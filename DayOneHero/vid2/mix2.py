# Rig 2.0 audio for one Ep2 segment:  python mix2.py <seg>   (run from vid2/)
#   music  : audio.py's score for the segment (unchanged timings)
#   sfx    : the original sfxmix.py events, plus EXTRA events for the new shots/actions
#            (MUTE windows silence original events that the new design replaces)
#   voice  : tts/<seg>_<i>_m.wav at ST, music ducked under the voice
# Writes mix2_<seg>.wav. Segment 'v' (recap) has its own short music bed.
import numpy as np, soundfile as sf, json, sys
SR = 44100
seg = sys.argv[1]
TM = json.load(open('timing.json')); TM['v'] = {'st': [0.4], 'du': [2.54], 'end': 6.47}
T = TM[seg]; ST, DU, END = T['st'], T['du'], T['end']; N = int(END*SR)

# ---------------- music
if seg == 'v':
    gm = {}; exec(open('../vid/music.py').read().split('# chords (C G Am F) as midi')[0].replace('D=35.0', f'D={END}'), gm)
    place, pad, bell, kick = gm['place'], gm['pad'], gm['bell'], gm['kick']
    place(pad([57, 64, 69], 3.0), 0, .2); [place(bell(m, 1.6), .2 + i*.18, .1) for i, m in enumerate([81, 79, 76, 74, 72, 69, 67, 64])]
    place(pad([45, 52, 56], 1.8), 3.0, .25); place(kick(), 4.6, .9); place(pad([60, 64, 67, 72], 1.9), 4.6, .22)
    mus = gm['mus']; mus = mus/np.abs(mus).max()*.85
else:
    ga = {}; exec(open('audio.py').read().rsplit('\nfor seg in', 1)[0], ga); ga['build'](seg)
    mus, _ = sf.read(f'music_{seg}.wav')
mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))[:N]

# ---------------- original sfx (captured before sfxmix's own mix step)
src = open('sfxmix.py').read().rsplit('\nfor seg in', 1)[0]
src = src.replace("sfx=np.stack([out,out],1)", "sfx=np.stack([out,out],1); return out")
g0 = {}; exec(src, g0); g0['TM']['v'] = TM['v']
orig = np.nan_to_num(g0['build'](seg)[:N].copy())

# ---------------- extra sfx palette (same synths as ../vid/sfx1.py)
g = {}; exec(open('../vid/sfx1.py').read().split('for at in')[0].replace('D=75.6', f'D={END}'), g)
add, tone, bp, whoosh, hit, rng = (g[k] for k in ('add', 'tone', 'bp', 'whoosh', 'hit', 'rng'))
def noise(x, dur, lo, hi, gn, dec=None):
    n = int(dur*SR); s = bp(rng.standard_normal(n), lo, hi)
    if dec: s *= np.exp(-np.arange(n)/SR*dec)
    add(s, x, gn)
def boom(x, gn=1.0):
    n = int(1.8*SR); t = np.arange(n)/SR
    add(np.sin(2*np.pi*np.cumsum(30 + 90*np.exp(-t*7))/SR)*np.exp(-t*2.0) + bp(rng.standard_normal(n), 40, 900)*np.exp(-t*3)*.9, x, gn)
pop_ = lambda x, gn=.15: add(tone(900, 1500, .08, .003, .05), x, gn)
ding = lambda x, gn=.13: add(tone(1500, 2400, .25, .005, .15), x, gn)
def click(x, gn=.35): noise(x, .03, 1500, 7000, gn, 120)
def thump(x, gn=.5): add(hit(), x, gn); noise(x, .2, 150, 1200, gn*.6, 20)
def swish(x, gn=.3, d=.35): add(whoosh(d, 500, 6000), x - d*.6, gn)          # camera cut whoosh, centred on the cut
def sparkle(x, gn=.12): [add(tone(f, f, .35, .002, .3), x + j*.06, gn) for j, f in enumerate((1318, 1568, 2093))]
def chirp(x, f=2600, gn=.1): add(tone(f, f*1.35, .06, .003, .04), x, gn); add(tone(f*1.1, f*1.5, .05, .003, .03), x + .08, gn*.8)
def boing(x, gn=.3):
    n = int(.4*SR); tt = np.arange(n)/SR; add(np.sin(2*np.pi*np.cumsum(180 + 700*(tt/tt[-1])**.6 + 30*np.sin(tt*60))/SR)*np.exp(-tt*4), x, gn)
def buzz(x, dur, gn=.12):
    n = int(dur*SR); tt = np.arange(n)/SR; s = np.sign(np.sin(2*np.pi*np.cumsum(210 + 15*np.sin(tt*30))/SR))*(.6 + .4*np.sin(tt*50)); add(bp(s, 200, 3000)*np.minimum(1, np.minimum(tt*4, (dur - tt)*4)), x, gn)
def thunder(x, gn=.8): n = int(2.5*SR); tt = np.arange(n)/SR; add(bp(rng.standard_normal(n), 30, 600)*np.exp(-tt*1.4)*(1 + .5*np.sin(tt*9)), x, gn); noise(x, .15, 2000, 9000, gn*.7, 25)
def crackle(x, dur, gn=.15):
    for i in range(int(dur*25)): noise(x + i*.04 + rng.random()*.03, .02, 1500, 6000, gn*rng.random(), 150)
def rush(x, dur, gn=.3): n = int(dur*SR); tt = np.arange(n)/SR; add(bp(rng.standard_normal(n), 200, 2500)*np.minimum(1, np.minimum(tt*3, (dur - tt)*3)), x, gn)
def bubble(x, gn=.2): add(tone(180, 420, .12, .004, .08), x, gn)
MUTE, GAP = [], []

# ---------------- per-segment extras (timed to the Rig 2.0 shot lists in sc_<seg>2.js)
if seg == 'v':
    rush(0, 3.0, .25); [swish(x) for x in (1.5, 3.0, 4.6)]; thump(4.7, .6); add(tone(400, 1600, .6, .01, .3), 5.7, .2); add(whoosh(.8, 300, 8000), 5.8, .6)
if seg == 'c':
    [swish(x, .22) for x in (1.6, 3.15, 5.1, ST[2], ST[3] + .95, ST[3] + 1.8, ST[4] + 1.9, ST[5] - .25, ST[5] + 2.9, ST[7] - .1)]
    add(whoosh(.5, 300, 2500), 3.3, .25); add(tone(300, 220, .9, .05, .4), 3.7, .08)          # stretch + yawn
    pop_(5.5); sparkle(5.8, .1)
    add(tone(320, 210, .12, .004, .08), ST[2] + .35, .2); boing(ST[2] + .5, .3); thump(ST[2] + .87, .3); sparkle(ST[2] + 1.3)
    buzz(ST[3] - .3, 3.2, .1)
    click(ST[4] + 2.25, .5); click(ST[4] + 2.32, .4); add(tone(2400, 2000, .2, .002, .15), ST[4] + 2.4, .08)   # scissors bend
    t1 = ST[4] + 2.8 + .3; add(hit(), t1, .7); [add(tone(f, f*.98, .5, .002, .4), t1, .06) for f in (620, 930, 1410)]   # weight clang
    add(whoosh(.6, 400, 4000), ST[4] + 3.7, .3); crackle(ST[4] + 3.7, .8, .15)                     # flame
    sp = (ST[7] - .1 - ST[6])/4; boom(ST[6] + .5, .5); thunder(ST[6] + sp + .45, .6); [bubble(ST[6] + 2*sp + .2 + i*.3, .15) for i in range(5)]; rush(ST[6] + 3*sp, sp, .35)

if seg == 'h':
    [swish(x, .2) for x in (4.3, 6.0, 7.2, 8.4, 9.9, ST[2] - .1, 20.0, 22.3, ST[4] + 2.0, 30.6, 37.6, 39.0, 41.4)]
    for i in range(12): noise(.9 + i*.14, .08, 2500, 7000, .12, 30)                                   # marker squeak
    rush(4.4, 1.6, .15); add(tone(90, 60, 1.6, .2, .6), 4.5, .12)                                     # stone creeping up
    add(tone(180, 150, .3, .01, .2), 6.3, .25); add(tone(160, 130, .3, .01, .2), 6.7, .2)            # creak (can't bend)
    rush(10.8, .7, .12); [chirp(11.6 + i*.5, 900, .08) for i in range(2)]                             # pigeon lands, coos
    a = ST[2] + .3; noise(a, .5, 1500, 8000, .7, 8); thump(a, .7); [noise(a + .05 + i*.05, .06, 600, 4000, .3, 40) for i in range(10)]
    boing(a + .8, .25); thump(a + 1.15, .3); add(hit(), a + 2.95, .5); add(tone(900, 900, .3, .002, .25), a + 2.97, .1)   # hop + clonk
    add(whoosh(.6, 300, 3000), ST[3] + .3, .3)                                                        # cape
    for i in range(7): click(20.1 + i*.32, .25)                                                       # snipping air
    for i in range(12): add(tone(3000, 2500, .03, .002, .02), ST[5] + .5 + i*.5, .12); [noise(ST[5] + .5 + i*.5, .05, 1000, 5000, .08, 40) for i in range(12)]   # calendar flips
    boom(ST[6] + .1, .4); add(tone(600, 900, .2, .01, .12), 38.1, .15); add(tone(1200, 2600, 2.0, .05, .5), 39.2, .04)   # 5 years / ruler / nails creak
    thump(41.5, .5)
if seg == 'p':
    MUTE.append((0, 17.5)); GAP.append((ST[2] - .09, ST[2]))
    IMP = ST[2]; LAND = IMP + 1.6; FLY0 = IMP + .1
    n = N; add(bp(rng.standard_normal(n), 120, 900)*(.6 + .4*np.sin(np.arange(n)/SR*.7)), 0, .04)
    for x in (.6, 1.4, 3.1): chirp(x, 3200, .04)
    pop_(.8); add(whoosh(.35, 500, 6000), 2.0 - .2, .35)
    for x in (2.55, 2.61, 2.69, 2.75): click(x)
    add(whoosh(.5, 300, 2500), 3.05, .25); add(tone(700, 1050, .18, .004, .1), 3.75, .1)
    tt = np.arange(int((IMP - 4.15)*SR))/SR; TT = tt/tt[-1]
    f0 = 55 + 45*TT**1.5 + 2*np.sin(tt*9); ph = 2*np.pi*np.cumsum(f0)/SR
    eng = sum(np.sin(ph*h)/h for h in range(1, 7)) + bp(rng.standard_normal(len(tt)), 80, 500)*.6
    lvl = np.interp(tt + 4.15, [4.15, 6.79, 6.8, 8.69, 8.7, 10.54, 10.55, IMP], [.05, .18, .3, .5, .25, .4, .75, 1.0])
    add(np.tanh(eng*1.5)*lvl, 4.15, .35); add(whoosh(.35, 400, 5000), 4.0, .3)
    for i in range(12): add(tone(1400, 1400, .02, .002, .015), 4.4 + i*.1, .07)
    pop_(5.2); pop_(5.9); add(whoosh(.9, 200, 3000), 6.7, .55); pop_(7.0)
    add(tone(420, 260, .12, .005, .08), 7.78, .3); add(tone(300, 190, .14, .005, .1), 7.92, .25)
    thump(8.98, .7); noise(8.98, .25, 300, 3000, .25, 14); thump(9.28, .95); boom(9.28, .35); noise(9.28, .3, 300, 3000, .3, 12)
    for x in (9.75, 10.22): thump(x, .45); thump(x + .17, .3)
    n2 = int((IMP - 9.65)*SR); t2 = np.arange(n2)/SR
    add(np.sin(2*np.pi*np.cumsum(300 + 1300*(t2/t2[-1])**2)/SR)*(t2/t2[-1])**2*.5 + bp(rng.standard_normal(n2), 1500, 7000)*(t2/t2[-1])**3, 9.65, .3)
    add(whoosh(.45, 300, 7000), 10.35, .6)
    boom(IMP, 1.0); add(hit(), IMP, .9); noise(IMP, .5, 600, 7000, .7, 9)
    for f in (1870, 2330, 3110): add(tone(f, f*.97, .35, .002, .3), IMP + .01, .07)
    add(whoosh(1.4, 400, 6000), FLY0, .55); add(tone(900, 300, 1.2, .01, .5), FLY0 + .05, .06)
    n3 = int(1.3*SR); t3 = np.arange(n3)/SR
    add((np.sin(2*np.pi*np.cumsum(2500 + 120*np.sin(t3*31) + 80*np.sin(t3*7))/SR)*.5 + bp(rng.standard_normal(n3), 2000, 5000)*.5)*np.sin(np.linspace(0, np.pi, n3))**.6, IMP + .2, .2)
    pop_(11.25); add(hit(), LAND, .9); boom(LAND, .45)
    for i in range(9): noise(LAND + i*.04 + rng.random()*.02, .12, 200, 2500, .5 - i*.03, 22)
    for x in (12.86, 12.97, 13.08, 13.22, 13.35): noise(x, .1, 150, 1500, .35, 25); add(hit(), x, .2)
    for i, x in enumerate(np.arange(13.35, 14.35, .2)): chirp(x, 2500 + (i % 3)*300, .09)
    add(tone(500, 900, .12, .004, .08), 14.42, .2); add(tone(320, 210, .12, .004, .08), 14.56, .2); boing(14.66, .35)
    add(whoosh(.35, 600, 6000), 14.68, .3); thump(15.06, .4); sparkle(15.32, .14); ding(ST[3] + .4)
    # after 17.5: scale, seesaw, slow-mo replay, ping-pong, dent, bench
    swish(17.5, .25); thump(17.95, .45); boing(18.0, .2); ding(18.1)
    thump(ST[4] + .2, .7); add(tone(140, 90, .8, .01, .5), ST[4] + .3, .2); add(whoosh(.8, 200, 3000), ST[4] + 1.3, .3); swish(23.6, .2)
    R0 = ST[4] + 5.0; add(tone(2000, 200, .5, .01, .2), R0 - .1, .12); add(tone(200, 2000, .4, .01, .2), R0 + .35, .1)     # rewind blip
    ri = R0 + (IMP - 10.5)/.27; n4 = int(3.5*SR); t4 = np.arange(n4)/SR
    add(np.sin(2*np.pi*np.cumsum(18 + 40*np.exp(-t4*2))/SR)*np.exp(-t4*.9) + bp(rng.standard_normal(n4), 30, 400)*np.exp(-t4*1.2)*.8, ri, .9)
    add(whoosh(3.0, 150, 1500), ri - 1.4, .4)
    for k in range(5): add(tone(1300 if k % 2 else 1000, 900, .12, .002, .1), ST[5] - .2 + k/1.1, .3)
    add(tone(300, 200, .6, .02, .4), ST[6] + .3, .12); swish(36.3, .2); pop_(37.2)
    add(whoosh(1.4, 300, 4000), ST[7] - .2, .45); noise(ST[7] + 1.2, .3, 800, 6000, .6, 15); [thump(ST[7] + 1.25 + i*.1, .25) for i in range(3)]
    rush(ST[7] + 1.2, 1.0, .2); swish(41.3, .2)

if seg == 's':
    PUNCH = ST[1] + 1.4; SLAM = ST[4] + 1.5
    [swish(x, .2) for x in (2.0, ST[1], PUNCH + .3, 7.4, ST[2] - .05, 15.5, 17.4, 20.9, 23.4, 27.3, 28.7)]
    for i in range(5): add(tone(400 + i*30, 300, .12, .004, .08), .2 + i*.33, .1)                     # footsteps
    for x in (2.33, 2.4, 2.48, 2.55): click(x, .4)
    add(whoosh(.5, 300, 3000), ST[1] + .3, .3); add(whoosh(.25, 600, 8000), PUNCH - .2, .7); boom(PUNCH, .5)
    [add(hit(), x, .25) for x in (7.85, 8.45)]; add(tone(200, 150, .4, .02, .3), ST[2] + .3, .1)       # taps, wall "hm"
    add(hit(), 13.75, .4); add(tone(900, 900, .3, .002, .25), 13.77, .1); add(tone(1200, 1500, .1, .003, .06), 15.9, .2)   # clonk, boop
    n = int((SLAM - 20.6)*SR); tt = np.arange(n)/SR; add(bp(rng.standard_normal(n), 200, 900)*(.5 + .5*np.sin(tt*28)), 20.6, .15)  # strain
    boom(SLAM, .5); add(hit(), SLAM, .8); chirp(SLAM + .7, 2600, .08)
    for k in range(4): add(hit(), ST[5] + .1 + k*.98, .3); add(tone(140, 110, .3, .01, .2), ST[5] + .2 + k*.98, .12)    # barbell reps
    add(whoosh(.3, 600, 6000), 27.55, .4); add(hit(), 27.6, .5); add(whoosh(.3, 400, 4000), 27.95, .4); add(hit(), 28.05, .7); sparkle(29.4)

if seg == 'l':
    JUMP = ST[0] + DU[0] + .2; SPL = JUMP + 1.0
    n = N; add(bp(rng.standard_normal(n), 40, 300)*(.7 + .3*np.sin(np.arange(n)/SR*1.3)), 0, .12)        # lava rumble bed
    for i in range(int(END*2.2)): bubble(.3 + i*.45 + rng.random()*.2, .06)
    [swish(x, .2) for x in (2.6, 5.0, JUMP - .1, SPL, ST[1], 12.0, 15.2, ST[2] - .2, 21.0, 30.6, 33.2)]
    add(tone(300, 900, 1.2, .05, .3), 2.9, .08)                                                        # thermometer rising
    add(tone(700, 1100, .15, .004, .1), 5.6, .15); add(whoosh(.8, 300, 4000), JUMP, .5); add(tone(300, 700, .5, .01, .3), JUMP, .1)
    add(hit(), SPL, .6); [bubble(SPL + .05 + i*.07, .2) for i in range(6)]; boing(SPL + .1, .2)
    [add(hit(), ST[1] + .9 + i*.4, .15) for i in range(3)]
    for i in range(6): add(tone(160, 120, .25, .01, .2), 15.5 + i*.35, .08)                            # gloopy pour
    add(tone(1800, 2400, .15, .004, .1), 21.8, .12); add(tone(1700, 2200, .12, .004, .08), 22.0, .1)     # duck squeak
    for i in range(12): bubble(ST[3] + 3.0 + i*.15, .12)
    add(tone(300, 120, 1.6, .05, .8), ST[3] + 6.0, .25); [bubble(ST[3] + 7.4 + i*.1, .25) for i in range(8)]   # sink + glug
if seg == 'k':
    STRIKE = ST[1] + 1.0
    [swish(x, .2) for x in (2.2, 4.6, 6.9, 9.5, 13.0)]
    rush(4.6, STRIKE - 4.6, .25); thunder(4.9, .3)
    noise(STRIKE, .2, 2000, 10000, 1.0, 20); boom(STRIKE, 1.0); thunder(STRIKE + .1, .9); crackle(STRIKE + .3, 2.0, .2)
    add(tone(120, 4000, 1.5, .05, .4), 10.2, .05); add(tone(200, 6000, 1.5, .05, .4), 11.2, .05)       # bar sweeps
    add(tone(400, 900, .1, .003, .06), ST[2] + 1.4, .3); add(tone(900, 500, .15, .004, .1), ST[2] + 1.5, .2)   # "toast" pop
    for i in range(3): add(whoosh(.3, 600, 5000), ST[3] + .25 + i*1.1, .3); thump(ST[3] + .3 + i*1.1, .2)
    add(tone(500, 300, .4, .01, .3), WK1 + .1 if (WK1 := ST[4] - .2) else 0, .15); sparkle(ST[4] + .4)

if seg == 'a':
    JUMP = ST[0] + DU[0] + .2; UP = ST[4] + .6; OUT = ST[4] + DU[4] + .3
    for i in range(int(JUMP*1.5)): noise(i*.66 + .2, .5, 300, 2500, .05, 4)                               # waves
    add(tone(300, 220, .9, .05, .4), 3.6, .1); add(whoosh(.4, 300, 4000), JUMP, .4); noise(JUMP + .55, .6, 400, 6000, .7, 6)   # breath, dive, splash
    n = int((OUT - JUMP - .6)*SR); tt = np.arange(n)/SR; add(bp(rng.standard_normal(n), 60, 400)*(.8 + .2*np.sin(tt*.9)), JUMP + .6, .14)   # underwater hum
    for i in range(int((OUT - JUMP)*1.5)): bubble(JUMP + .7 + i*.66 + rng.random()*.3, .07)
    [swish(x, .18) for x in (2.4, 11.8, 13.9, 17.9, 20.05, ST[3] - .1, 28.7, 33.9, 35.1)]
    add(tone(80, 50, 1.5, .1, .6), ST[1] + .4, .2)                                                         # pressure groan
    noise(12.55, .5, 300, 3000, .6, 8); add(hit(), 12.55, .6); [add(tone(f, f*.9, .4, .002, .3), 12.6, .05) for f in (700, 1100)]   # sub crush
    add(tone(1200, 1800, .6, .02, .3), 14.2, .06)                                                          # angler glow
    for i in range(8): add(tone(1000, 1000, .03, .002, .02), ST[3] + .4 + i*.7, .1)                         # timer ticks
    rush(UP, OUT - UP, .3); add(tone(200, 1400, OUT - UP, .1, .3), UP, .05)
    add(tone(80, 60, 1.1, .05, .5), 33.9, .1)                                                               # space hush
    noise(OUT, .5, 400, 6000, .6, 6); add(tone(500, 900, .3, .01, .2), OUT + .05, .2); sparkle(ST[5] + .5)
if seg == 'x':
    [swish(x, .2) for x in (3.0, 6.6, 11.0, 15.9, 18.4, ST[3] + 2.6, 30.8)]
    add(whoosh(.5, 200, 3000), 2.6, .4); add(tone(60, 40, 3.0, .3, 1.0), 6.6, .2); rush(6.6, 4.4, .15)    # dive into the core
    n = int(10*SR); add(bp(rng.standard_normal(n), 40, 250), 11.0, .1); crackle(11.0, 7.0, .06)
    add(tone(80, 60, 1.2, .05, .5), 11.2, .25); sparkle(ST[2] + .3); add(tone(800, 300, .6, .01, .3), ST[2] + 2.2, .08); pop_(ST[2] + 3.4)
    for i in range(6): add(hit(), ST[3] + .1 + i*.5, .2); noise(ST[3] + .1 + i*.5, .1, 200, 2000, .15, 25)   # digging
    add(hit(), ST[3] + 2.6, .7); [add(tone(f, f, .8, .002, .7), ST[3] + 2.62, .07) for f in (1180, 1770)]       # boink (shovel ring)
    add(whoosh(1.8, 150, 2500), 29.0, .35); pop_(ST[4] + 4.2)

if seg == 'r':
    SLIP = ST[1] + 3.0; RUN0 = ST[3] + .2; PUSH = ST[3] + 1.4; HIT = ST[3] + DU[3] + .2; GETUP = ST[4] + 1.8
    for i in range(6): add(tone(380 + i*20, 300, .1, .004, .07), .3 + i*.55, .08)                        # footsteps
    [swish(x, .18) for x in (3.9, 6.6, SLIP + .1, 9.6, 13.1, 14.9, PUSH, 19.3, 23.2, GETUP)]
    add(tone(200, 160, .5, .02, .3), SLIP - .5, .2); add(tone(170, 140, .4, .02, .3), SLIP - .1, .2); noise(SLIP, .2, 300, 3000, .3, 15)   # creak, slip
    add(tone(600, 1600, .3, .01, .2), 10.1, .15)                                                          # Dex notices
    n = int((RUN0 - ST[2])*SR); tt = np.arange(n)/SR; add(np.sin(2*np.pi*55*tt)*.5*np.minimum(1, tt*2), ST[2], .12); add(tone(300, 60, 1.0, .05, .6), ST[2] - .1, .2)   # slow-mo drop
    for i in range(int((RUN0 - ST[2])/.9)): thump(ST[2] + .5 + i*.9, .2)                                     # heartbeat in slow-mo
    add(whoosh(.4, 400, 6000), RUN0 - .1, .5); [add(tone(260, 220, .06, .003, .04), RUN0 + i*.15, .15) for i in range(8)]
    add(whoosh(.3, 500, 5000), PUSH, .35); sparkle(PUSH + .1, .08)
    add(tone(80, 50, 1.0, .05, .6), HIT, .3); [noise(HIT + .3 + i*.14, .1, 300, 2500, .25, 25) for i in range(4)]
    boing(GETUP + .3, .2); thump(GETUP + .65, .3); sparkle(GETUP + 1.0)
if seg == 'd':
    JMP = ST[1] + DU[1] + .3; IMPD = ST[4] + .5
    n = int(JMP*SR); tt = np.arange(n)/SR; add(bp(rng.standard_normal(n), 60, 500)*(.8 + .2*np.sin(tt*30)), 0, .14)        # plane drone
    rush(3.0, JMP - 3.0, .25); [swish(x, .2) for x in (3.0, 5.6, ST[2] - .1, 15.5, ST[3] - .1, 25.4, 33.0, ST[6] - .2, 53.0)]
    add(whoosh(1.0, 300, 6000), JMP, .6); rush(JMP + .3, IMPD - JMP - .3, .3)
    add(tone(300, 900, 1.2, .05, .4), ST[2] + 2.6, .06); add(tone(400, 400, 1.5, .1, .5), 15.5, .03)
    n2 = int(4.0*SR); t2 = np.arange(n2)/SR; add(np.sin(2*np.pi*np.cumsum(300 + 900*(t2/t2[-1])**2)/SR)*(t2/t2[-1])**2*.5, IMPD - 4.0, .25)   # riser to impact
    GAP.append((IMPD - .1, IMPD))
    noise(IMPD, .3, 2000, 9000, .8, 15); boom(IMPD, 1.0); add(hit(), IMPD, 1.0); thunder(IMPD + .05, .5)
    for i in range(10): add(hit(), IMPD + .6 + i*.11, .15)                                                     # debris rain
    for i in range(6): add(hit(), ST[5] + .4 + i*.35, .15)                                                     # climbing
    add(tone(80, 70, 4.5, .5, 1.5), ST[7] + .2, .2); add(tone(1200, 400, .6, .01, .4), ST[7] + 2.3, .12)       # red hood sting
    add(whoosh(.6, 500, 8000), ST[8] + DU[8] + .6, .6)

if seg == 'e':
    DAY3 = ST[3] + DU[3] + .15
    [swish(x, .18) for x in (3.0, 5.5, 14.9)]
    for i in range(6): add(hit(), 3.05 + i*.63, .12)                                                      # happy bounces
    for at in (ST[1] + .9, ST[1] + 1.8, ST[1] + 2.6, ST[1] + 3.4, ST[1] + 4.4, ST[1] + 5.0): pop_(at, .14)   # sticky notes
    add(tone(110, 90, 3.0, .2, 1.0), 14.9, .15)                                                           # spotlight hush
    add(whoosh(.8, 200, 6000), DAY3 - .4, .5); add(tone(200, 2400, .5, .01, .3), DAY3, .1)
    sparkle(ST[4] + .6, .1)

sfx = orig*(1.0)
for a, b in MUTE: sfx[int(a*SR):int(b*SR)] = 0
o = g['out'][:N]; ex = o/(np.abs(o).max() + 1e-9)*.8 if np.abs(o).max() > 0 else o
sfx = sfx/(np.abs(sfx).max() + 1e-9)*.8 + ex*.85

# ---------------- mix (as sfxmix.py: ducking under the voice, soft clip)
vo = np.zeros(N)
for i, t0 in enumerate(ST):
    a, _ = sf.read(f'tts/{seg}_{i}_m.wav'); a = a if a.ndim == 1 else a.mean(1); j = int(t0*SR); n = min(len(a), N - j); vo[j:j + n] += a[:n]
vo /= np.abs(vo).max()/.9
env = np.abs(vo); k = int(.25*SR); sm = np.convolve(env, np.ones(k)/k, 'same'); duck = 1 - .6*np.clip(sm/.05, 0, 1)
bed = mus*.42*duck[:, None] + np.stack([sfx, sfx], 1)*.42
for a, b in GAP: i0, i1 = int(a*SR), int(b*SR); bed[i0:i1] *= np.linspace(1, .12, i1 - i0)[:, None]
m = bed + vo[:, None]
m = np.tanh(m*1.1)/np.tanh(1.1); m /= np.abs(m).max()/.89
sf.write(f'mix2_{seg}.wav', m, SR); print('mix2', seg, round(END, 2))
