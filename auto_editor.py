#!/usr/bin/env python3
"""
auto_editor.py — beat-synced action-montage builder.

Takes a long source video (a movie) plus a music track, finds the highest-motion
moments in the video, and cuts them together so that every cut lands on a beat.

Pipeline
--------
    AudioAnalyzer   librosa  ->  beats, strong onsets, drops, silences  ->  cut grid
    MotionScanner   OpenCV   ->  motion score curve + shot boundaries    ->  candidates
    ClipSelector             ->  assign candidates to cut-grid slots     ->  EDL
    Assembler       MoviePy  ->  extract, speed-ramp, reframe, concat
                    ffmpeg   ->  final encode (+ optional interpolation)

The EDL (edit decision list) is a plain dict, dumped to JSON. `--dry-run` stops
after the EDL so you can inspect the plan without paying for a render, and
`--from-edl` re-renders a saved (or hand-tweaked) plan.

Targets MoviePy 2.x. On MoviePy 1.x the API names differ: subclipped->subclip,
time_transform->fl_time, cropped->crop, resized->resize, and with_effects does
not exist. Pin >=2.1 rather than porting.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path

import cv2
import librosa
import numpy as np


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class BeatMap:
    """Everything the audio pass learned about the track."""
    tempo: float
    beats: np.ndarray            # every detected beat, seconds
    downbeats: np.ndarray        # first beat of each bar, seconds
    strong: np.ndarray           # onsets in the top strength quantile, seconds
    drops: np.ndarray            # energy jumps out of a quiet passage, seconds
    silences: list               # (start, end) spans of near-silence
    energy_t: np.ndarray         # time base for `energy`
    energy: np.ndarray           # smoothed RMS, normalised 0..1
    duration: float

    def energy_at(self, t: float) -> float:
        return float(np.interp(t, self.energy_t, self.energy))


@dataclass
class Candidate:
    """A stretch of source video that scored well for motion."""
    start: float                 # seconds into the source
    end: float
    score: float                 # action intensity, arbitrary units
    centroid: tuple = (0.5, 0.5) # normalised (x, y) of motion mass, for reframing

    @property
    def duration(self) -> float:
        return self.end - self.start


@dataclass
class Slot:
    """One position in the output timeline, bounded by two cuts."""
    t_out: float                 # where this slot starts in the output
    duration: float              # how long it lasts in the output
    profile: str = "flat"        # flat | ramp_down | impact
    src_start: float = 0.0       # filled in by the selector
    src_score: float = 0.0
    centroid: tuple = (0.5, 0.5)


@dataclass
class EDL:
    video: str
    audio: str
    fps: int
    size: tuple
    audio_start: float
    slots: list = field(default_factory=list)
    meta: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# 1. Audio analysis
# ---------------------------------------------------------------------------

class AudioAnalyzer:
    """Extracts a cut grid from a music track."""

    def __init__(self, path: str, sr: int = 22050, offset: float = 0.0,
                 duration: float | None = None):
        self.path = path
        # mono at a modest rate: everything here is envelope-domain work, so
        # 22 kHz is plenty and roughly halves the analysis cost.
        self.y, self.sr = librosa.load(path, sr=sr, mono=True,
                                       offset=offset, duration=duration)
        self.hop = 512

    def analyse(self, bars_per_phrase: int = 4, beats_per_bar: int = 4) -> BeatMap:
        y, sr, hop = self.y, self.sr, self.hop

        # --- tempo + beat grid -------------------------------------------------
        # onset_envelope is reused by beat_track and by our own strong-hit
        # picking, so compute it once.
        onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
        tempo, beat_frames = librosa.beat.beat_track(
            onset_envelope=onset_env, sr=sr, hop_length=hop, trim=False)
        tempo = float(np.atleast_1d(tempo)[0])
        beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)

        # --- downbeats ---------------------------------------------------------
        # librosa gives no metre, so infer the bar phase: whichever offset in
        # [0, beats_per_bar) puts the most onset energy on its downbeats wins.
        env_at_beat = np.interp(beats,
                                librosa.frames_to_time(np.arange(len(onset_env)),
                                                       sr=sr, hop_length=hop),
                                onset_env)
        phase = max(range(beats_per_bar),
                    key=lambda p: env_at_beat[p::beats_per_bar].mean()
                    if len(env_at_beat[p::beats_per_bar]) else -1)
        downbeats = beats[phase::beats_per_bar]

        # --- strong hits -------------------------------------------------------
        # Peak-picked onsets, then keep the loud tail of the distribution. These
        # are the accents a human editor actually cuts to (not the metronome).
        onset_frames = librosa.onset.onset_detect(
            onset_envelope=onset_env, sr=sr, hop_length=hop, backtrack=False)
        onset_times = librosa.frames_to_time(onset_frames, sr=sr, hop_length=hop)
        onset_strength = onset_env[onset_frames] if len(onset_frames) else np.array([])
        if len(onset_strength):
            keep = onset_strength >= np.quantile(onset_strength, 0.60)
            strong = onset_times[keep]
        else:
            strong = np.array([])

        # --- energy envelope ---------------------------------------------------
        rms = librosa.feature.rms(y=y, hop_length=hop)[0]
        energy_t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
        # ~0.4 s box smoothing: long enough to ignore individual kicks, short
        # enough to keep section edges sharp.
        win = max(3, int(0.4 * sr / hop))
        energy = np.convolve(rms, np.ones(win) / win, mode="same")
        energy = energy / (energy.max() + 1e-9)

        # --- drops -------------------------------------------------------------
        # A drop is a big positive step in smoothed energy that follows a
        # comparatively quiet stretch. Look at the forward/backward energy ratio
        # across a ~1 s window and peak-pick it.
        w = max(2, int(1.0 * sr / hop))
        pre = np.array([energy[max(0, i - w):i].mean() if i > 0 else 0.0
                        for i in range(len(energy))])
        post = np.array([energy[i:i + w].mean() for i in range(len(energy))])
        lift = post - pre
        drops = []
        if len(lift):
            thr = max(0.12, float(np.quantile(lift, 0.985)))
            i = 0
            while i < len(lift):
                if lift[i] >= thr:
                    j = i
                    while j + 1 < len(lift) and lift[j + 1] >= thr:
                        j += 1
                    peak = i + int(np.argmax(lift[i:j + 1]))
                    drops.append(energy_t[peak])
                    i = j + int(2.0 * sr / hop)   # one drop per ~2 s
                else:
                    i += 1
        # Snap each drop to the nearest beat so the ramp lands musically.
        drops = np.array([beats[np.argmin(np.abs(beats - d))] for d in drops]) \
            if len(drops) and len(beats) else np.array([])

        # --- near-silence spans ------------------------------------------------
        quiet = energy < 0.12
        silences, i = [], 0
        while i < len(quiet):
            if quiet[i]:
                j = i
                while j + 1 < len(quiet) and quiet[j + 1]:
                    j += 1
                if energy_t[j] - energy_t[i] >= 0.35:
                    silences.append((float(energy_t[i]), float(energy_t[j])))
                i = j + 1
            else:
                i += 1

        return BeatMap(tempo=tempo, beats=beats, downbeats=downbeats, strong=strong,
                       drops=drops, silences=silences, energy_t=energy_t,
                       energy=energy, duration=float(len(y) / sr))

    # -- cut grid ------------------------------------------------------------

    @staticmethod
    def build_cut_grid(bm: BeatMap, every: int = 2, dense_every: int = 1,
                       dense_above: float = 0.72, min_slot: float = 0.28,
                       max_slot: float = 3.0) -> list:
        """Choose which beats become cuts.

        Cutting on *every* beat at 120 BPM is a cut each 0.5 s, which reads as
        strobing rather than rhythm. So take every Nth beat, and fall back to
        every beat during the loudest sections, where fast cutting belongs.
        """
        beats = bm.beats
        if len(beats) < 2:
            raise ValueError("no beats detected — is the audio silent?")

        cuts, i = [], 0
        while i < len(beats):
            cuts.append(float(beats[i]))
            hot = bm.energy_at(beats[i]) >= dense_above
            i += max(1, dense_every if hot else every)
        if cuts[-1] < bm.duration - 0.05:
            cuts.append(min(bm.duration, float(beats[-1])))

        # Any drop must be a cut — that is the whole point of the edit.
        for d in bm.drops:
            if not np.any(np.abs(np.array(cuts) - d) < 1e-3):
                cuts.append(float(d))
        cuts = sorted(set(round(c, 4) for c in cuts))

        # Enforce slot bounds: drop cuts that are too close together, split
        # slots that would drag on past max_slot.
        pruned = [cuts[0]]
        for c in cuts[1:]:
            if c - pruned[-1] >= min_slot:
                pruned.append(c)
        out = []
        for a, b in zip(pruned, pruned[1:]):
            out.append(a)
            span = b - a
            if span > max_slot:
                n = int(np.ceil(span / max_slot))
                out.extend(a + span * k / n for k in range(1, n))
        out.append(pruned[-1])
        return out

    @staticmethod
    def build_slots(bm: BeatMap, cuts: list, ramp: bool,
                    slow: float, fast: float) -> list:
        """Turn cut times into Slots, tagging the ones around each drop.

        The ramp deliberately spans a cut: the slot *ending* at a drop decays
        into slow motion (tension), the slot *starting* at the drop opens fast
        (release). Ramping inside a single clip instead just looks like a glitch.
        """
        slots = []
        for a, b in zip(cuts, cuts[1:]):
            profile = "flat"
            if ramp and len(bm.drops):
                near = np.min(np.abs(bm.drops - b))
                if near < 1e-3:
                    profile = "ramp_down"
                if np.min(np.abs(bm.drops - a)) < 1e-3:
                    profile = "impact"
            slots.append(Slot(t_out=a, duration=b - a, profile=profile))
        return slots


# ---------------------------------------------------------------------------
# 2. Motion scanning
# ---------------------------------------------------------------------------

class MotionScanner:
    """Scores a long video for action density and finds its shot boundaries.

    Two tiers, because dense optical flow over a feature-length film is hours of
    compute:

      tier 1  one sequential pass, stride-sampled and heavily downscaled,
              scoring absolute frame difference and detecting shot cuts;
      tier 2  Farnebäck dense flow on the top-K windows only, which separates
              real action from a slow camera pan and yields a motion centroid
              for reframing.
    """

    def __init__(self, path: str, stride: int = 5, width: int = 192,
                 verbose: bool = True):
        self.path = path
        self.stride = stride
        self.width = width
        self.verbose = verbose

        cap = cv2.VideoCapture(path)
        if not cap.isOpened():
            raise IOError(f"cannot open video: {path}")
        self.fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
        self.n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.src_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.src_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        self.duration = self.n_frames / self.fps if self.fps else 0.0
        self.crop_box = None       # (y0, y1) letterbox bounds, set in tier 1

    # -- helpers -------------------------------------------------------------

    def _small(self, frame):
        h = max(2, int(round(self.width * frame.shape[0] / frame.shape[1])))
        g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        return cv2.resize(g, (self.width, h), interpolation=cv2.INTER_AREA)

    def _detect_letterbox(self, frame) -> tuple:
        """Find horizontal black bars so they don't dilute the motion mean."""
        g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rows = g.mean(axis=1)
        lit = np.where(rows > 18)[0]
        if len(lit) < 10:
            return (0, g.shape[0])
        return (int(lit[0]), int(lit[-1]) + 1)

    # -- tier 1 --------------------------------------------------------------

    def scan(self) -> tuple:
        """Sequential motion + shot-boundary pass.

        Returns (times, motion, shot_boundaries). Uses grab()/retrieve() rather
        than seeking: seeking in inter-frame-coded video is both slow and
        inexact, while grab() skips decode of unwanted frames cheaply.
        """
        cap = cv2.VideoCapture(self.path)
        times, motion, shots = [], [], [0.0]

        ok, frame = cap.read()
        if not ok:
            raise IOError("empty video")
        self.crop_box = self._detect_letterbox(frame)
        y0, y1 = self.crop_box
        prev = self._small(frame[y0:y1])
        prev_hist = self._hist(frame[y0:y1])
        idx = 0

        while True:
            # grab() advances the demuxer without decoding, so only every
            # stride-th frame costs a decode. Retrieve just that one.
            grabbed = True
            for _ in range(self.stride):
                grabbed = cap.grab()
                if not grabbed:
                    break
                idx += 1
            if not grabbed:
                break
            ok, frame = cap.retrieve()
            if not ok or frame is None:
                break
            t = idx / self.fps

            sub = frame[y0:y1]
            cur = self._small(sub)

            # Absolute frame difference, mildly normalised for exposure: dark
            # night scenes otherwise under-score badly against bright daylight.
            # The divisor is floored, because an unbounded boost on near-black
            # frames makes flashing title cards outscore real action.
            diff = float(np.abs(cur.astype(np.int16) - prev.astype(np.int16)).mean())
            luma = max(12.0, float(cur.mean()))
            score = diff / max(0.62, (luma / 110.0) ** 0.5)

            # Reject title cards, credits and end cards: mostly-black frames
            # carrying a little high-contrast text. Genuine night scenes keep a
            # spread of midtones, so they survive this test.
            if float((cur < 25).mean()) > 0.80:
                score = 0.0

            # Shot cut: colour histogram correlation collapses across a cut.
            hist = self._hist(sub)
            corr = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)
            if corr < 0.60:
                shots.append(t)
                score = 0.0          # the cut itself is not "motion"

            times.append(t)
            motion.append(score)
            prev, prev_hist = cur, hist

            if self.verbose and len(times) % 2000 == 0:
                pct = 100.0 * idx / max(1, self.n_frames)
                print(f"    scanning… {pct:5.1f}%", end="\r", flush=True)

        cap.release()
        if self.verbose:
            print(f"    scanned {len(times)} samples, "
                  f"{len(shots)} shot boundaries        ")
        shots.append(self.duration)
        return np.array(times), np.array(motion), np.array(shots)

    @staticmethod
    def _hist(frame):
        h = cv2.calcHist([cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)], [0, 1],
                         None, [32, 32], [0, 180, 0, 256])
        return cv2.normalize(h, h).flatten()

    # -- candidate windows ---------------------------------------------------

    def candidates(self, times, motion, shots, clip_len: float = 2.0,
                   top_k: int = 120, min_gap: float = 6.0,
                   skip_head: float = 0.02, skip_tail: float = 0.03) -> list:
        """Pick the best non-overlapping windows, clamped inside single shots.

        A clip that straddles a shot boundary looks broken, so every window is
        confined to one shot. Windows are then greedily selected by score with a
        minimum separation, which stops one long explosion from supplying eight
        near-identical clips.
        """
        # Ignore logos/credits at either end of the film.
        t_lo = self.duration * skip_head
        t_hi = self.duration * (1.0 - skip_tail)

        # Mean motion over a clip_len window, via cumulative sum.
        dt = float(np.median(np.diff(times))) if len(times) > 2 else 0.2
        w = max(1, int(round(clip_len / dt)))
        csum = np.concatenate([[0.0], np.cumsum(motion)])
        win_mean = (csum[w:] - csum[:-w]) / w
        win_start = times[:len(win_mean)]

        # Reject any window crossing a shot boundary, plus a small inset so an
        # imprecise boundary estimate doesn't leak a frame of the wrong shot.
        keep = []
        for i, ts in enumerate(win_start):
            te = ts + clip_len
            if ts < t_lo or te > t_hi:
                continue
            nxt = shots[np.searchsorted(shots, ts, side="right")] \
                if np.searchsorted(shots, ts, side="right") < len(shots) else self.duration
            prv = shots[max(0, np.searchsorted(shots, ts, side="right") - 1)]
            if ts - prv < 0.12 or nxt - te < 0.12:
                continue
            keep.append(i)
        if not keep:
            raise RuntimeError("no usable windows — try a smaller --clip-len")

        order = sorted(keep, key=lambda i: win_mean[i], reverse=True)
        picked = []
        for i in order:
            ts = float(win_start[i])
            if all(abs(ts - p.start) >= min_gap for p in picked):
                picked.append(Candidate(ts, ts + clip_len, float(win_mean[i])))
            if len(picked) >= top_k:
                break
        return picked

    # -- tier 2 --------------------------------------------------------------

    def refine(self, cands: list, samples: int = 5) -> list:
        """Rescore candidates with dense optical flow and find their centroids.

        Frame differencing cannot tell a whip-pan from a fight. Farnebäck flow
        can: a pan produces large but highly *coherent* flow, so we discount
        magnitude by directional coherence. The flow-magnitude centroid also
        tells the reframer where the action sits in the frame.
        """
        cap = cv2.VideoCapture(self.path)
        y0, y1 = self.crop_box or (0, self.src_h)
        out = []

        for n, c in enumerate(cands):
            mags, cxs, cys, cohs = [], [], [], []
            for k in range(samples):
                t = c.start + (k + 0.5) * c.duration / samples
                cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000.0)
                ok, f1 = cap.read()
                ok2, f2 = cap.read()
                if not (ok and ok2):
                    continue
                a = self._small(f1[y0:y1])
                b = self._small(f2[y0:y1])
                flow = cv2.calcOpticalFlowFarneback(a, b, None, 0.5, 3, 15,
                                                    3, 5, 1.2, 0)
                fx, fy = flow[..., 0], flow[..., 1]
                mag = np.sqrt(fx * fx + fy * fy)
                m = float(mag.mean())
                if m < 1e-6:
                    continue
                # Coherence: |mean vector| / mean |vector|. ~1 for a pure pan,
                # ~0 for churning independent motion.
                coh = float(np.hypot(fx.mean(), fy.mean()) / (m + 1e-9))
                # Centroid of flow magnitude, normalised.
                tot = mag.sum() + 1e-9
                ys, xs = np.mgrid[0:mag.shape[0], 0:mag.shape[1]]
                cxs.append(float((mag * xs).sum() / tot / mag.shape[1]))
                cys.append(float((mag * ys).sum() / tot / mag.shape[0]))
                mags.append(m)
                cohs.append(coh)

            if not mags:
                continue
            mag = float(np.mean(mags))
            coh = float(np.mean(cohs))
            score = mag * (1.0 - 0.65 * coh)        # discount camera pans
            out.append(Candidate(c.start, c.end, score,
                                 (float(np.mean(cxs)), float(np.mean(cys)))))
            if self.verbose and (n + 1) % 10 == 0:
                print(f"    flow… {n + 1}/{len(cands)}", end="\r", flush=True)

        cap.release()
        if self.verbose:
            print(f"    refined {len(out)} candidates            ")
        return sorted(out, key=lambda c: c.score, reverse=True)


# ---------------------------------------------------------------------------
# 3. Clip selection
# ---------------------------------------------------------------------------

class ClipSelector:
    """Assigns candidates to timeline slots."""

    @staticmethod
    def assign(slots: list, cands: list, base_speed: float, slow: float,
               fast: float, spread: bool = True, reuse: bool = False) -> list:
        """Fill every slot, longest first.

        Longest-first matters: a long slot needs a long stretch of source (more
        so under slow motion), and if short slots grab the good material first
        the long ones have nothing left to use.
        """
        pool = sorted(cands, key=lambda c: c.score, reverse=True)
        used = []
        order = sorted(range(len(slots)), key=lambda i: slots[i].duration,
                       reverse=True)

        for i in order:
            s = slots[i]
            need = SpeedRamp.source_needed(s, base_speed, slow, fast)
            pick = None
            for c in pool:
                if c.duration + 1e-6 < need:
                    continue
                if not reuse and any(abs(c.start - u) < 1e-6 for u in used):
                    continue
                # Keep successive clips from neighbouring source moments, so the
                # montage roams the film instead of replaying one sequence.
                if spread and used and min(abs(c.start - u) for u in used) < 4.0:
                    continue
                pick = c
                break
            if pick is None:                      # relax the spread constraint
                pick = next((c for c in pool
                             if c.duration + 1e-6 >= need
                             and (reuse or not any(abs(c.start - u) < 1e-6
                                                   for u in used))), None)
            if pick is None:                      # last resort: reuse the best
                pick = pool[0] if pool else None
            if pick is None:
                raise RuntimeError("no candidate clips available")

            # Centre the needed span inside the candidate window.
            pad = max(0.0, (pick.duration - need) / 2.0)
            s.src_start = pick.start + pad
            s.src_score = pick.score
            s.centroid = pick.centroid
            used.append(pick.start)
        return slots


# ---------------------------------------------------------------------------
# 4. Speed ramping
# ---------------------------------------------------------------------------

class SpeedRamp:
    """Variable-speed time mapping with an exact output duration.

    A slot must occupy exactly its allotted output time or every later cut
    drifts off the beat. So the speed curve is defined in *output* time, and the
    source time is its running integral:

        src(t) = integral of s(tau) dtau, for tau in [0, t]

    Total source consumed is L = integral over the whole slot, which is what the
    selector must reserve. MoviePy's time_transform wants exactly this output ->
    source mapping, and duration is then pinned with with_duration().
    """

    N = 2048     # integration samples per slot

    @staticmethod
    def profile(slot: Slot, base: float, slow: float, fast: float):
        """Speed as a function of normalised position in the slot."""
        if slot.profile == "ramp_down":
            # Ease from base down to `slow`: tension into the drop.
            return lambda u: base + (slow - base) * (u ** 1.6)
        if slot.profile == "impact":
            # Open at `fast`, settle back to base: release on the hit.
            return lambda u: fast + (base - fast) * (u ** 0.55)
        return lambda u: base + 0.0 * u

    @classmethod
    def curve(cls, slot: Slot, base: float, slow: float, fast: float):
        """Return (t_grid, src_grid, source_needed) for one slot."""
        f = cls.profile(slot, base, slow, fast)
        t = np.linspace(0.0, slot.duration, cls.N)
        s = np.clip(np.array([f(u) for u in np.linspace(0.0, 1.0, cls.N)]),
                    0.05, 8.0)
        # Trapezoidal cumulative integral -> source time at each output time.
        src = np.concatenate([[0.0], np.cumsum((s[1:] + s[:-1]) / 2.0 * np.diff(t))])
        return t, src, float(src[-1])

    @classmethod
    def source_needed(cls, slot: Slot, base: float, slow: float,
                      fast: float) -> float:
        return cls.curve(slot, base, slow, fast)[2]

    @classmethod
    def apply(cls, clip, slot: Slot, base: float, slow: float, fast: float):
        """Time-warp a clip so it lasts exactly slot.duration."""
        t, src, _ = cls.curve(slot, base, slow, fast)
        if slot.profile == "flat" and abs(base - 1.0) < 1e-9:
            return clip.with_duration(slot.duration)
        # Monotonic by construction (s > 0), so plain interpolation inverts it.
        mapping = lambda tt: float(np.interp(tt, t, src))
        return clip.time_transform(mapping,
                                   apply_to=[]).with_duration(slot.duration)


# ---------------------------------------------------------------------------
# 5. Assembly
# ---------------------------------------------------------------------------

class Assembler:
    """Extracts, ramps, reframes and concatenates; hands off to ffmpeg."""

    def __init__(self, edl: EDL, crop_mode: str = "motion", base: float = 1.0,
                 slow: float = 0.5, fast: float = 1.5, verbose: bool = True):
        self.edl = edl
        self.crop_mode = crop_mode
        self.base, self.slow, self.fast = base, slow, fast
        self.verbose = verbose

    # -- reframing -----------------------------------------------------------

    def _reframe(self, clip, centroid):
        """Crop to the target aspect, then scale to the target size.

        Going 16:9 -> 9:16 keeps only ~32% of the frame width, so a blind centre
        crop decapitates people routinely. `motion` centres the crop on where
        the flow centroid says the action is; `blur-pad` avoids cropping at all
        and is applied later in ffmpeg.
        """
        tw, th = self.edl.size
        target_ar = tw / th
        w, h = clip.w, clip.h

        if self.crop_mode == "blur-pad":
            return clip           # handled during the ffmpeg encode

        if w / h > target_ar:                     # source is wider: crop width
            cw = int(round(h * target_ar))
            cx = 0.5 if self.crop_mode == "center" else float(centroid[0])
            x1 = int(round(np.clip(cx * w - cw / 2, 0, w - cw)))
            clip = clip.cropped(x1=x1, y1=0, width=cw, height=h)
        else:                                     # source is taller: crop height
            ch = int(round(w / target_ar))
            cy = 0.5 if self.crop_mode == "center" else float(centroid[1])
            y1 = int(round(np.clip(cy * h - ch / 2, 0, h - ch)))
            clip = clip.cropped(x1=0, y1=y1, width=w, height=ch)
        return clip.resized(new_size=(tw, th))

    # -- render --------------------------------------------------------------

    def render(self, out_path: str, silent: bool, crf: int = 18,
               preset: str = "medium", interpolate: bool = False):
        from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips

        # Drop the source's own audio immediately. Otherwise subclipped() carries
        # the film's dialogue through the concat: harmless when a music track
        # replaces it, but it leaks straight into a --silent-video render.
        src = VideoFileClip(self.edl.video).without_audio()
        pieces = []
        for n, s in enumerate(self.edl.slots):
            need = SpeedRamp.source_needed(s, self.base, self.slow, self.fast)
            a = s.src_start
            b = min(src.duration, a + need)
            if b - a < need - 1e-3:               # clamp at end of source
                a = max(0.0, b - need)
            piece = src.subclipped(a, b)
            piece = SpeedRamp.apply(piece, s, self.base, self.slow, self.fast)
            piece = self._reframe(piece, s.centroid)
            pieces.append(piece)
            if self.verbose and (n + 1) % 10 == 0:
                print(f"    building… {n + 1}/{len(self.edl.slots)}",
                      end="\r", flush=True)

        video = concatenate_videoclips(pieces, method="compose")
        video = video.with_fps(self.edl.fps)

        if not silent:
            audio = AudioFileClip(self.edl.audio)
            end = min(audio.duration, self.edl.audio_start + video.duration)
            audio = audio.subclipped(self.edl.audio_start, end)
            video = video.with_audio(audio)

        tmp = str(Path(out_path).with_suffix(".tmp.mp4"))
        if self.verbose:
            print(f"    encoding {len(pieces)} clips -> {out_path}      ")
        video.write_videofile(
            tmp, codec="libx264", fps=self.edl.fps, preset=preset,
            audio=not silent,
            audio_codec=None if silent else "aac",
            audio_bitrate=None if silent else "192k",
            ffmpeg_params=["-crf", str(crf), "-pix_fmt", "yuv420p",
                           "-movflags", "+faststart"],
            logger="bar" if self.verbose else None)
        src.close()
        for p in pieces:
            p.close()

        self._post(tmp, out_path, interpolate, silent)

    def _post(self, tmp: str, out_path: str, interpolate: bool,
              silent: bool = False):
        """Optional ffmpeg finishing pass: blur-pad framing, interpolation."""
        filters = []
        tw, th = self.edl.size
        if self.crop_mode == "blur-pad":
            filters.append(
                f"split[a][b];[a]scale={tw}:{th}:force_original_aspect_ratio=increase,"
                f"crop={tw}:{th},gblur=sigma=28[bg];"
                f"[b]scale={tw}:-2:force_original_aspect_ratio=decrease[fg];"
                f"[bg][fg]overlay=(W-w)/2:(H-h)/2")
        if interpolate:
            # Real slow motion needs synthesised frames; without this, 0.5x on
            # 24 fps source judders. minterpolate is slow but built in.
            filters.append(f"minterpolate=fps={self.edl.fps}:mi_mode=mci:"
                           f"mc_mode=aobmc:vsbmc=1")
        if not filters:
            shutil.move(tmp, out_path)
            return

        ff = ffmpeg_bin()
        cmd = [ff, "-y", "-i", tmp, "-vf", ",".join(filters),
               "-c:v", "libx264", "-crf", "18", "-preset", "medium",
               "-pix_fmt", "yuv420p", "-movflags", "+faststart",
               *(["-an"] if silent else ["-c:a", "copy"]), out_path]
        if self.verbose:
            print("    ffmpeg finishing pass "
                  f"({'blur-pad ' if self.crop_mode == 'blur-pad' else ''}"
                  f"{'interpolate' if interpolate else ''})…")
        subprocess.run(cmd, check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        Path(tmp).unlink(missing_ok=True)


def ffmpeg_bin() -> str:
    """Locate ffmpeg: PATH first, then the imageio-ffmpeg bundled binary."""
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        raise RuntimeError("ffmpeg not found — install it or `pip install imageio-ffmpeg`")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args(argv=None):
    p = argparse.ArgumentParser(
        prog="auto_editor.py",
        description="Cut a beat-synced action montage from a movie and a music track.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    io = p.add_argument_group("input / output")
    # Not argparse-required: --from-edl carries both paths inside the EDL, so
    # requiring them here would break re-rendering a saved plan. Checked in main().
    io.add_argument("--video", help="source movie file (omit with --from-edl)")
    io.add_argument("--audio", help="music track for the beat map (omit with --from-edl)")
    io.add_argument("--output", default="edit.mp4", help="output file")
    io.add_argument("--silent-video", action="store_true",
                    help="render with no baked-in audio; cuts still match the "
                         "track, so you can add the licensed sound in-app")
    io.add_argument("--audio-start", type=float, default=0.0,
                    help="offset into the track to start the edit at (seconds)")
    io.add_argument("--duration", type=float, default=None,
                    help="cap the edit length (seconds)")

    fmt = p.add_argument_group("format")
    fmt.add_argument("--size", default="1080x1920", help="output WxH")
    fmt.add_argument("--fps", type=int, default=60)
    fmt.add_argument("--crop-mode", choices=["motion", "center", "blur-pad"],
                    default="motion", help="how to reach the target aspect ratio")
    fmt.add_argument("--crf", type=int, default=18, help="x264 quality, lower=better")
    fmt.add_argument("--preset", default="medium", help="x264 preset")
    fmt.add_argument("--interpolate", action="store_true",
                    help="synthesise frames (real slow motion; slow to encode)")

    rhy = p.add_argument_group("rhythm")
    rhy.add_argument("--cut-every", type=int, default=2,
                    help="cut every Nth beat")
    rhy.add_argument("--dense-every", type=int, default=1,
                    help="cut every Nth beat inside high-energy sections")
    rhy.add_argument("--dense-above", type=float, default=0.72,
                    help="normalised energy that counts as high-energy")
    rhy.add_argument("--min-slot", type=float, default=0.28)
    rhy.add_argument("--max-slot", type=float, default=3.0)

    spd = p.add_argument_group("speed")
    spd.add_argument("--ramp", action="store_true",
                    help="slow into each drop, accelerate out of it")
    spd.add_argument("--base-speed", type=float, default=1.0)
    spd.add_argument("--slow-speed", type=float, default=0.5)
    spd.add_argument("--fast-speed", type=float, default=1.5)

    scan = p.add_argument_group("scanning")
    scan.add_argument("--stride", type=int, default=5,
                     help="analyse every Nth frame in the motion pass")
    scan.add_argument("--scan-width", type=int, default=192,
                     help="downscale width for motion analysis")
    scan.add_argument("--clip-len", type=float, default=2.0,
                     help="candidate window length (seconds)")
    scan.add_argument("--top-k", type=int, default=120,
                     help="candidates kept for the optical-flow pass")
    scan.add_argument("--min-gap", type=float, default=6.0,
                     help="minimum separation between candidates in the source")
    scan.add_argument("--no-flow", action="store_true",
                     help="skip the optical-flow pass (faster, cruder)")

    wf = p.add_argument_group("workflow")
    wf.add_argument("--dry-run", action="store_true",
                    help="plan the edit and write the EDL, but do not render")
    wf.add_argument("--edl", default=None, help="where to write the EDL JSON")
    wf.add_argument("--from-edl", default=None,
                    help="render a saved EDL, skipping all analysis")
    wf.add_argument("--quiet", action="store_true")
    return p.parse_args(argv)


def main(argv=None) -> int:
    a = parse_args(argv)
    v = not a.quiet
    tw, th = (int(x) for x in a.size.lower().split("x"))

    # ---- re-render path ---------------------------------------------------
    if a.from_edl:
        if not Path(a.from_edl).exists():
            print(f"error: no such EDL: {a.from_edl}", file=sys.stderr)
            return 2
        raw = json.loads(Path(a.from_edl).read_text())
        # Let --video/--audio override what the EDL recorded, so a plan stays
        # usable after the source files move.
        if a.video:
            raw["video"] = str(a.video)
        if a.audio:
            raw["audio"] = str(a.audio)
        edl = EDL(**{**raw, "slots": [Slot(**s) for s in raw["slots"]],
                     "size": tuple(raw["size"])})
        for f in ([edl.video] if edl.video else []) + \
                 ([] if a.silent_video else [edl.audio]):
            if not Path(f).exists():
                print(f"error: the EDL points at a file that is gone: {f}\n"
                      f"       pass --video / --audio to point at its new location.",
                      file=sys.stderr)
                return 2
        Assembler(edl, a.crop_mode, a.base_speed, a.slow_speed, a.fast_speed, v) \
            .render(a.output, a.silent_video, a.crf, a.preset, a.interpolate)
        print(f"done -> {a.output}")
        return 0

    missing = [n for n, val in (("--video", a.video), ("--audio", a.audio))
               if not val]
    if missing:
        print(f"error: {' and '.join(missing)} required when not using --from-edl",
              file=sys.stderr)
        return 2
    for f in (a.video, a.audio):
        if not Path(f).exists():
            print(f"error: no such file: {f}", file=sys.stderr)
            return 2

    # ---- 1. audio ---------------------------------------------------------
    if v:
        print("[1/4] analysing audio")
    bm = AudioAnalyzer(a.audio, offset=a.audio_start,
                       duration=a.duration).analyse()
    cuts = AudioAnalyzer.build_cut_grid(bm, a.cut_every, a.dense_every,
                                       a.dense_above, a.min_slot, a.max_slot)
    slots = AudioAnalyzer.build_slots(bm, cuts, a.ramp, a.slow_speed, a.fast_speed)
    if v:
        print(f"    tempo {bm.tempo:.1f} BPM · {len(bm.beats)} beats · "
              f"{len(bm.drops)} drops · {len(bm.silences)} silences")
        print(f"    {len(slots)} slots over {cuts[-1] - cuts[0]:.1f}s "
              f"(mean {np.mean([s.duration for s in slots]):.2f}s)")

    # ---- 2. video ---------------------------------------------------------
    if v:
        print("[2/4] scanning video for motion")
    scanner = MotionScanner(a.video, a.stride, a.scan_width, v)
    if v:
        print(f"    {a.video}: {scanner.src_w}x{scanner.src_h} @ "
              f"{scanner.fps:.2f} fps, {scanner.duration / 60:.1f} min")
    times, motion, shots = scanner.scan()
    cands = scanner.candidates(times, motion, shots, a.clip_len, a.top_k,
                               a.min_gap)
    if not a.no_flow:
        if v:
            print("[3/4] refining with optical flow")
        cands = scanner.refine(cands)
    elif v:
        print("[3/4] skipping optical flow (--no-flow)")

    # ---- 3. match ---------------------------------------------------------
    # Starved candidate pools are the main cause of a disappointing edit: the
    # selector has to fall back to low-scoring material to fill every slot.
    # Say so, rather than quietly shipping filler.
    if len(cands) < len(slots):
        print(f"    warning: {len(cands)} candidates for {len(slots)} slots — "
              f"clips will repeat.\n"
              f"    Try a smaller --clip-len, a smaller --min-gap, or a longer "
              f"source. If the source\n"
              f"    is itself fast-cut, few windows fit inside a single shot.",
              file=sys.stderr)
    slots = ClipSelector.assign(slots, cands, a.base_speed, a.slow_speed,
                                a.fast_speed)

    edl = EDL(video=str(a.video), audio=str(a.audio), fps=a.fps, size=(tw, th),
              audio_start=a.audio_start, slots=slots,
              meta={"tempo": bm.tempo, "n_drops": int(len(bm.drops)),
                    "n_candidates": len(cands), "crop_mode": a.crop_mode,
                    "ramp": bool(a.ramp)})

    edl_path = a.edl or str(Path(a.output).with_suffix(".edl.json"))
    Path(edl_path).write_text(json.dumps(asdict(edl), indent=2, default=float))
    if v:
        print(f"    EDL -> {edl_path}")
        ramped = sum(1 for s in slots if s.profile != "flat")
        print(f"    {len(slots)} cuts, {ramped} speed-ramped, "
              f"total {sum(s.duration for s in slots):.1f}s")

    if a.dry_run:
        print("dry run: no render. Inspect the EDL, then re-run with "
              f"--from-edl {edl_path}")
        return 0

    # ---- 4. render --------------------------------------------------------
    if v:
        print("[4/4] rendering")
    Assembler(edl, a.crop_mode, a.base_speed, a.slow_speed, a.fast_speed, v) \
        .render(a.output, a.silent_video, a.crf, a.preset, a.interpolate)

    print(f"done -> {a.output}")
    if a.silent_video:
        print(f"silent render: in TikTok, add the sound and trim it to start at "
              f"{a.audio_start:.2f}s to match the cuts.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
