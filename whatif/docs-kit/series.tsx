/**
 * The Fiction Files series kit. Every case uses these same pieces in the same
 * places (the slate, the TV ident, the case brief, the Exhibit cards, the
 * evidence board, the Reality Score and CASE CLOSED), and each case dresses
 * them in its own world through a CaseTheme: one accent colour, its own paper,
 * its own arrangement of the motif and its own signature prop.
 */
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Bg, clamp, Grain, img, lerp, Stamp, Vignette} from './kit';
import {TV} from './tv';
import {Piece, slap, useBoil, useTwos, V} from './vox';

export type CaseTheme = {
	no: number;
	title: string; // e.g. "DEXTER ON TRIAL"
	accent: string; // the case colour
	accent2: string; // a second, quieter colour
	dir: string; // public folder, e.g. "case003"
	paper: string; // board colour of this case
	stamp: string; // house stamp colour (red)
};

export const HOUSE_RED = '#C4302B';
export const caseNo = (t: CaseTheme) => String(t.no).padStart(3, '0');

/** A one-shot sound from the series kit (public/series/sfx). */
export const S: React.FC<{n: string; at: number; v?: number}> = ({n, at, v = 0.6}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={120} layout="none">
		<Audio src={staticFile(`series/sfx/${n}.wav`)} volume={v} />
	</Sequence>
);

// ---------------------------------------------------------------- 1 · the case slate (cold open)
/** A manila tab that slaps into the corner at the very start: "CASE FILE 003". */
export const CaseSlate: React.FC<{t: CaseTheme; at?: number; end?: number}> = ({t, at = 4, end = 9999}) => {
	const frame = useCurrentFrame();
	const f2 = useTwos();
	const s = slap(f2, at);
	if (s === null || frame >= end) return null;
	const out = lerp(frame, end - 10, end, 0, 1, Easing.in(Easing.cubic));
	return (
		<div style={{position: 'absolute', left: 56, top: 44 - out * 160, transform: `rotate(-2deg) scale(${s})`, transformOrigin: '0 0', zIndex: 50}}>
			<div style={{position: 'relative', width: 380, height: 96, background: 'linear-gradient(170deg,#DDBB7E,#C69E5C)', borderRadius: '10px 10px 4px 4px', boxShadow: '4px 8px 14px rgba(0,0,0,.35)'}}>
				<div style={{position: 'absolute', left: 22, top: 18, fontFamily: 'Elite', fontSize: 20, letterSpacing: 4, color: '#4A3820'}}>FICTION FILES</div>
				<div style={{position: 'absolute', left: 22, top: 44, fontFamily: 'Bebas', fontSize: 44, letterSpacing: 3, color: V.ink}}>CASE FILE {caseNo(t)}</div>
			</div>
			<Stamp text="OPEN" x={322} y={62} at={at + 8} size={46} rot={-12} color={t.stamp} />
		</div>
	);
};

// ---------------------------------------------------------------- 2 · the ident
/**
 * The ident: the desk lamp comes up, the 1960s TV clicks on and the channel's
 * motif plays (in this case's own arrangement), then the case folder is stamped.
 * `welcomeAt`, `everyAt` and `caseAt` are local frames from the narration.
 */
export const Ident: React.FC<{t: CaseTheme; d: number; welcomeAt: number; everyAt: number; caseAt: number; photo?: string}> = ({t, d, welcomeAt, everyAt, caseAt, photo}) => {
	const frame = useCurrentFrame();
	const tvOn = Math.max(0, welcomeAt - 8);
	const lamp = lerp(frame, 0, 18, 0, 1);
	const toFolder = lerp(frame, caseAt - 14, caseAt + 4, 0, 1, Easing.inOut(Easing.cubic));
	const camS = interpolate(frame, [0, caseAt - 14], [1.0, 1.08], clamp) + toFolder * 0.12;
	const line = 'Every story is built on something real.';
	const n = Math.max(0, Math.floor((frame - everyAt) * 0.9));
	const glow = 0.75 + 0.25 * Math.sin(frame * 0.35) * Math.sin(frame * 0.13);
	return (
		<AbsoluteFill style={{background: '#07090C', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${camS}) translateY(${-toFolder * 40}px)`, opacity: 1 - toFolder}}>
				<Bg kind="navy" />
				<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, rgba(255,214,150,${0.3 * lamp}) 0%, rgba(0,0,0,0) 46%, rgba(0,0,0,.82) 100%)`}} />
				<TV x={960} y={470} w={900} on={tvOn} grade="colour">
					<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${t.accent}55 0%, #050608 75%)`, alignItems: 'center', justifyContent: 'center'}}>
						<div style={{textAlign: 'center', transform: `scale(${lerp(frame, tvOn, tvOn + 40, 0.92, 1)})`}}>
							<div style={{fontFamily: 'Bebas', fontSize: 120, letterSpacing: 26, color: '#F2E6C8', textShadow: `0 0 ${24 * glow}px ${t.accent}, 0 0 4px #fff`}}>FICTION FILES</div>
							<div style={{width: lerp(frame, tvOn + 10, tvOn + 34, 0, 420), height: 3, background: t.accent, margin: '6px auto 12px', boxShadow: `0 0 12px ${t.accent}`}} />
							<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 10, color: '#CFE7E3', opacity: lerp(frame, tvOn + 20, tvOn + 30, 0, 1)}}>CASE FILE {caseNo(t)}</div>
						</div>
					</AbsoluteFill>
				</TV>
				<div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 50, color: '#D9D2C2'}}>
					{line.slice(0, n)}
					<span style={{opacity: 0}}>{line.slice(n)}</span>
				</div>
			</AbsoluteFill>
			{frame >= caseAt - 8 && <CaseFolder t={t} at={caseAt - 8} photo={photo} />}
			<Vignette strength={0.5} />
			<Grain opacity={0.18} />
			<S n="tv_on" at={tvOn} v={0.5} />
			<Sequence from={tvOn + 2} layout="none">
				<Audio src={staticFile(`${t.dir}/music/ident.wav`)} volume={0.55} />
			</Sequence>
			<S n="stamp" at={caseAt + 14} v={0.7} />
		</AbsoluteFill>
	);
};

/** The case folder: dropped onto the desk, the title stamped across it in the case colour. */
export const CaseFolder: React.FC<{t: CaseTheme; at: number; photo?: string}> = ({t, at, photo}) => {
	const frame = useCurrentFrame();
	const k = frame - at;
	const drop = interpolate(k, [0, 10, 14], [0, 1.03, 1], clamp);
	return (
		<AbsoluteFill>
			<Bg kind="navy" />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,214,150,.3) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,.8) 100%)'}} />
			<div
				style={{
					position: 'absolute',
					left: 460,
					top: 230,
					width: 1000,
					height: 640,
					transform: `translateY(${(1 - drop) * -600}px) rotate(${-2.5 + (1 - drop) * 8}deg) scale(${1 + lerp(frame, at + 14, at + 120, 0, 0.05)})`,
					filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))',
				}}
			>
				<div style={{position: 'absolute', left: 0, top: -50, width: 300, height: 76, background: '#C9A564', borderRadius: '14px 14px 0 0'}} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#D9B77A,#C79F5E)', borderRadius: 8}} />
				<div style={{position: 'absolute', left: 22, top: -36, fontFamily: 'Elite', fontSize: 26, letterSpacing: 4, color: '#4A3820'}}>FICTION FILES</div>
				{photo && (
					<div style={{position: 'absolute', right: 50, top: -40, width: 300, height: 220, padding: 10, background: '#F7F2E6', transform: 'rotate(5deg)', boxShadow: '0 8px 16px rgba(0,0,0,.35)'}}>
						<Img src={staticFile(photo)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(.5) sepia(.2) contrast(1.05)'}} />
					</div>
				)}
				<div style={{position: 'absolute', left: 80, top: 170, width: 640, padding: '26px 36px', background: '#F4ECD8', border: '2px solid #8A6A3A'}}>
					<div style={{fontFamily: 'Elite', fontSize: 34, color: '#3A2E1E', letterSpacing: 5}}>CASE FILE No. {caseNo(t)}</div>
					<div style={{fontFamily: 'Bebas', fontSize: 130, color: V.ink, lineHeight: 0.95, marginTop: 14}}>{t.title}</div>
				</div>
				<Stamp text="OPEN" x={790} y={520} at={at + 22} size={130} rot={-12} color={t.stamp} />
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 3 · the case brief
/** The index card with the case's three questions, ticked off as they're asked. */
export const CaseBrief: React.FC<{t: CaseTheme; qs: string[]; ats: number[]; x?: number; y?: number; rot?: number; id?: string; done?: number[]}> = ({
	t,
	qs,
	ats,
	x = 470,
	y = 180,
	rot = -1.5,
	id = 'brief',
	done = [],
}) => {
	const f2 = useTwos();
	return (
		<Piece id={id} x={x} y={y} rot={rot} at={0}>
			<div
				style={{
					width: 980,
					padding: '30px 46px 40px',
					backgroundColor: '#FBF8EF',
					backgroundImage: 'repeating-linear-gradient(#FBF8EF 0 63px,#B9D3E6 63px 65px)',
					backgroundPosition: '0 98px',
					boxShadow: '8px 14px 26px rgba(0,0,0,.35)',
					borderTop: `16px solid ${t.accent}`,
				}}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Elite', fontSize: 30, letterSpacing: 6, color: HOUSE_RED, borderBottom: '3px solid #E3A0A0', paddingBottom: 10}}>
					<span>CASE BRIEF</span>
					<span style={{color: '#6b6660'}}>FILE {caseNo(t)}</span>
				</div>
				{qs.map((q, i) => {
					const n = Math.max(0, Math.floor((f2 - ats[i]) * 1.6));
					return (
						<div key={i} style={{display: 'flex', gap: 22, alignItems: 'baseline', marginTop: 16, height: 48, opacity: f2 >= ats[i] ? 1 : 0}}>
							<div style={{fontFamily: 'Bebas', fontSize: 52, color: t.accent, width: 40}}>{i + 1}</div>
							<div style={{fontFamily: 'Elite', fontSize: 38, color: V.ink, whiteSpace: 'nowrap'}}>
								{q.slice(0, n)}
								<span style={{opacity: 0}}>{q.slice(n)}</span>
							</div>
							{done[i] !== undefined && f2 >= done[i] && <div style={{fontFamily: 'Marker', fontSize: 48, color: t.accent, marginLeft: 'auto'}}>✓</div>}
						</div>
					);
				})}
			</div>
		</Piece>
	);
};

// ---------------------------------------------------------------- 4 · the Exhibit card
/**
 * Every act opens on an Exhibit card. The letter slaps down in ransom paper,
 * the title types on and the case's own badge (children) sits beside it.
 */
export const ExhibitCard: React.FC<{t: CaseTheme; letter: string; title: string; d: number; children?: React.ReactNode; bg?: React.ReactNode}> = ({t, letter, title, d, children, bg}) => {
	const frame = useCurrentFrame();
	const f2 = useTwos();
	const boil = useBoil(`ex${letter}`);
	const ls = slap(f2, 6);
	const n = Math.max(0, Math.floor((f2 - 14) * 1.1));
	const push = interpolate(frame, [0, d], [1, 1.06], clamp);
	const u = lerp(f2, 14 + title.length / 1.1, 26 + title.length / 1.1, 0, 1);
	return (
		<AbsoluteFill style={{background: t.paper, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${push})`}}>
				{bg}
				<div style={{position: 'absolute', left: 240, top: 260, transform: boil}}>
					<div style={{fontFamily: 'Elite', fontSize: 46, letterSpacing: 22, color: '#5d5a55'}}>EXHIBIT</div>
					{ls !== null && (
						<div
							style={{
								display: 'inline-block',
								marginTop: 18,
								fontFamily: 'Anton',
								fontSize: 330,
								lineHeight: 1,
								padding: '20px 46px 6px',
								background: V.ink,
								color: '#F3EEE3',
								transform: `rotate(-4deg) scale(${ls})`,
								boxShadow: '8px 12px 14px rgba(29,28,32,.35)',
							}}
						>
							{letter}
						</div>
					)}
				</div>
				<div style={{position: 'absolute', left: 760, top: 470, width: 1040, transform: boil}}>
					<div style={{fontFamily: 'Caslon', fontSize: 118, lineHeight: 1.02, color: V.ink}}>
						{title.slice(0, n)}
						<span style={{opacity: 0}}>{title.slice(n)}</span>
					</div>
					<div style={{width: 900 * u, height: 18, background: t.accent, mixBlendMode: 'multiply', marginTop: 14, transform: 'rotate(-0.8deg)'}} />
				</div>
				{children}
			</AbsoluteFill>
			<S n="stamp" at={6} v={0.55} />
			<S n="typing" at={14} v={0.35} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 5 · the evidence board
export type BoardItem = {
	id: string;
	x: number;
	y: number;
	rot?: number;
	w: number;
	h?: number;
	photo?: string; // image path under public/
	label: string; // typed label under / on the item
	note?: string; // big text instead of a photo
	pin?: string; // pin colour
};

/**
 * The evidence board. It gains one item per Exhibit and is revisited at every
 * act break: `shown` items are already up, the next one is pinned at `newAt`,
 * and the camera drifts to it. Red string joins the items in order.
 */
export const EvidenceBoard: React.FC<{t: CaseTheme; items: BoardItem[]; shown: number; newAt?: number; d: number; focus?: number; children?: React.ReactNode}> = ({
	t,
	items,
	shown,
	newAt,
	d,
	focus,
	children,
}) => {
	const frame = useCurrentFrame();
	const visible = items.slice(0, shown + (newAt !== undefined && frame >= newAt ? 1 : 0));
	const target = items[Math.min(items.length - 1, focus ?? (newAt !== undefined ? shown : Math.max(0, shown - 1)))];
	const cx = target ? target.x + target.w / 2 : 960;
	const cy = target ? target.y + (target.h ?? target.w * 0.75) / 2 : 540;
	const zoomIn = newAt !== undefined ? interpolate(frame, [0, Math.max(1, newAt - 4), newAt + 30, d], [1.0, 1.0, 1.32, 1.4], {...clamp, easing: Easing.inOut(Easing.quad)}) : interpolate(frame, [0, d], [1.06, 1.0], clamp);
	const k = (zoomIn - 1) / 0.4;
	const tx = (960 - cx) * k;
	const ty = (540 - cy) * k;
	return (
		<AbsoluteFill style={{background: '#2a1d12', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${zoomIn})`}}>
				<Bg kind="cork" />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,220,170,.12) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,.45) 100%)'}} />
				<div style={{position: 'absolute', left: 760, top: 40, padding: '10px 26px', background: '#F4ECD8', fontFamily: 'Elite', fontSize: 28, letterSpacing: 6, color: '#3A2E1E', transform: 'rotate(-1deg)', boxShadow: '3px 5px 8px rgba(0,0,0,.35)'}}>
					CASE {caseNo(t)} · {t.title}
				</div>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					{visible.slice(1).map((it, i) => {
						const a = visible[i];
						const p = it === items[shown] && newAt !== undefined ? lerp(frame, newAt + 6, newAt + 22, 0, 1) : 1;
						const x1 = a.x + a.w / 2,
							y1 = a.y + 6,
							x2 = it.x + it.w / 2,
							y2 = it.y + 6;
						return <line key={it.id} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={HOUSE_RED} strokeWidth={4} opacity={0.9} />;
					})}
				</svg>
				{visible.map((it, i) => {
					const isNew = i === shown && newAt !== undefined;
					return <BoardCard key={it.id} it={it} at={isNew ? newAt! : -100} accent={t.accent} />;
				})}
				{children}
			</AbsoluteFill>
			<Vignette strength={0.45} />
			{newAt !== undefined && <S n="pin" at={newAt + 2} v={0.7} />}
		</AbsoluteFill>
	);
};

const BoardCard: React.FC<{it: BoardItem; at: number; accent: string}> = ({it, at, accent}) => {
	const h = it.h ?? it.w * 0.75;
	return (
		<Piece id={it.id} x={it.x} y={it.y} rot={it.rot ?? 0} at={at}>
			<div style={{width: it.w, background: '#F7F2E6', padding: 10, paddingBottom: 12, boxShadow: '6px 10px 14px rgba(0,0,0,.45)'}}>
				{it.photo ? (
					<div style={{width: it.w - 20, height: h - 20, overflow: 'hidden', background: '#222'}}>
						<Img src={staticFile(it.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(.6) contrast(1.1) sepia(.15)'}} />
					</div>
				) : (
					<div style={{width: it.w - 20, height: h - 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF8EF', fontFamily: 'Bebas', fontSize: Math.min(110, it.w / 3.2), color: '#1D1C20', textAlign: 'center', lineHeight: 0.95, borderTop: `10px solid ${accent}`}}>
						{it.note}
					</div>
				)}
				<div style={{fontFamily: 'Elite', fontSize: 20, letterSpacing: 2, color: '#2b2620', marginTop: 8, textAlign: 'center'}}>{it.label.toUpperCase()}</div>
			</div>
			<div style={{position: 'absolute', left: it.w / 2 - 13, top: -8, width: 26, height: 26, borderRadius: 13, background: `radial-gradient(circle at 35% 35%, #fff8, ${it.pin ?? HOUSE_RED} 45%, #0008)`, boxShadow: '3px 5px 4px rgba(0,0,0,.35)'}} />
		</Piece>
	);
};

// ---------------------------------------------------------------- 6 · the Reality Score
export const BANDS: [number, number, string][] = [
	[0, 3, 'PURE FICTION'],
	[4, 6, 'PARTLY TRUE'],
	[7, 10, 'CASE HOLDS UP'],
];
export const bandOf = (s: number) => BANDS.find(([a, b]) => s >= a && s <= b)![2];

/**
 * The Reality Score frame, shot the same way every case: "REALITY SCORE",
 * a silent beat, then the number lands with its band. The meter itself is the
 * case's signature prop, passed as children.
 */
export const RealityScore: React.FC<{t: CaseTheme; score: number; landAt: number; children: React.ReactNode; sub?: string}> = ({t, score, landAt, children, sub}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame - landAt, [0, 4, 8], [1.6, 0.95, 1], clamp);
	return (
		<AbsoluteFill style={{background: '#07090C', overflow: 'hidden'}}>
			<Bg kind="navy" />
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${t.accent}2A 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,.8) 100%)`}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: 'Elite', fontSize: 40, letterSpacing: 16, color: '#C9D3DE', opacity: lerp(frame, 0, 10, 0, 1)}}>REALITY SCORE</div>
			{sub && <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 44, color: '#9FB0BE', opacity: lerp(frame, 6, 16, 0, 1)}}>{sub}</div>}
			{children}
			{frame >= landAt && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', transform: `scale(${s})`}}>
					<span style={{fontFamily: 'Bebas', fontSize: 250, lineHeight: 1, color: '#F3EEE3', textShadow: `0 0 40px ${t.accent}88`}}>{score}</span>
					<span style={{fontFamily: 'Bebas', fontSize: 120, color: '#7F8E9C'}}>/10</span>
					<div style={{fontFamily: 'Elite', fontSize: 40, letterSpacing: 12, color: t.accent, marginTop: -6}}>{bandOf(score)}</div>
				</div>
			)}
			<Vignette strength={0.5} />
			<Grain opacity={0.14} />
			<S n="hit" at={landAt} v={0.6} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 7 · case closed
/** CASE CLOSED: the stamp, the motif finally resolving, and the next file. */
export const CaseClosed: React.FC<{t: CaseTheme; d: number; closedAt: number; nextAt: number; next: string; bg?: React.ReactNode}> = ({t, d, closedAt, nextAt, next, bg}) => {
	const frame = useCurrentFrame();
	const nextIn = lerp(frame, nextAt, nextAt + 14, 0, 1, Easing.out(Easing.back(1.4)));
	const fadeOut = lerp(frame, d - 20, d, 1, 0);
	return (
		<AbsoluteFill style={{background: '#07090C', overflow: 'hidden', opacity: fadeOut}}>
			{bg ?? <Bg kind="navy" />}
			<AbsoluteFill style={{background: 'rgba(5,7,10,.55)'}} />
			<div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${lerp(frame, nextAt - 20, nextAt, 0, -230)}px)`}}>
				<Stamp text="CASE CLOSED" x={960} y={520} at={closedAt} size={200} rot={-8} color={t.stamp} onDark />
			</div>
			{frame >= nextAt && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', opacity: nextIn, transform: `translateY(${(1 - nextIn) * 80}px)`}}>
					<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 10, color: t.accent}}>NEXT FILE</div>
					<div style={{fontFamily: 'Bebas', fontSize: 110, color: '#F3EEE3', lineHeight: 1.05}}>{next}</div>
					<div style={{display: 'inline-block', marginTop: 20, padding: '12px 34px', background: HOUSE_RED, color: '#fff', fontFamily: 'Oswald', fontWeight: 700, fontSize: 36, borderRadius: 8}}>SUBSCRIBE</div>
				</div>
			)}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: 'Bebas', fontSize: 40, letterSpacing: 14, color: '#E9D6A8', opacity: lerp(frame, nextAt, nextAt + 20, 0, 1)}}>FICTION FILES · @FICTIONFILESHQ</div>
			<Vignette strength={0.55} />
			<Grain opacity={0.16} />
			<S n="cabinet" at={closedAt - 6} v={0.6} />
			<Sequence from={Math.max(0, closedAt - 4)} layout="none">
				<Audio src={staticFile(`${t.dir}/music/closed.wav`)} volume={0.6} />
			</Sequence>
		</AbsoluteFill>
	);
};

export {img};
