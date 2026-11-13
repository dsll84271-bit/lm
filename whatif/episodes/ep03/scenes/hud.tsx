import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../../brand/fonts';
import {pop, span} from '../../../components/stage';
import {UI} from '../../../components/ui';

// Screen graphics for Episode 3: the bathroom mirror's frame, the heat
// camera's viewfinder, a heart monitor, a birthday photo and the show sign-up sheet.

/** The camera is the mirror: a thick rounded frame with a glassy sheen. */
export const MirrorFrame: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div style={{position: 'absolute', inset: 0, border: '70px solid #E8DCC8', borderRadius: 120, boxShadow: 'inset 0 0 0 10px #C9B898, inset 0 0 80px rgba(0,0,0,0.35)'}} />
		<div style={{position: 'absolute', left: 180, top: 120, width: 260, height: 900, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 45%, rgba(255,255,255,0) 100%)', transform: 'rotate(18deg)'}} />
		<div style={{position: 'absolute', left: 1500, top: 160, width: 120, height: 800, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)', transform: 'rotate(18deg)'}} />
	</AbsoluteFill>
);

/** A heat camera's viewfinder: corner brackets, REC, temperature scale. */
export const ThermalHud: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill style={{pointerEvents: 'none', fontFamily: FONT, fontWeight: 700, color: '#fff'}}>
		{[
			[90, 150, '0 0'],
			[1830, 150, '1 0'],
			[90, 930, '0 1'],
			[1830, 930, '1 1'],
		].map(([x, y, c]) => {
			const [cx, cy] = String(c).split(' ').map(Number);
			return (
				<div
					key={String(c)}
					style={{
						position: 'absolute',
						left: Number(x) - (cx ? 80 : 0),
						top: Number(y) - (cy ? 80 : 0),
						width: 80,
						height: 80,
						borderLeft: cx ? 'none' : '8px solid #fff',
						borderRight: cx ? '8px solid #fff' : 'none',
						borderTop: cy ? 'none' : '8px solid #fff',
						borderBottom: cy ? '8px solid #fff' : 'none',
					}}
				/>
			);
		})}
		<div style={{position: 'absolute', left: 130, top: 175, fontSize: 40, display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{width: 26, height: 26, borderRadius: 13, background: frame % 30 < 18 ? UI.red : 'transparent'}} />
			HEAT CAMERA
		</div>
		<div style={{position: 'absolute', right: 130, top: 300, width: 40, height: 480, borderRadius: 20, background: 'linear-gradient(0deg, #1A0E6A, #6A2AB8, #E8303A, #FF9A2A, #FFF4A0)', border: '4px solid #fff'}} />
		<div style={{position: 'absolute', right: 190, top: 285, fontSize: 32}}>HOT</div>
		<div style={{position: 'absolute', right: 190, top: 760, fontSize: 32}}>COLD</div>
	</AbsoluteFill>
);

/** A heart monitor: a live ECG trace and the beats per minute. */
export const HeartMonitor: React.FC<{frame: number; at: number; bpm: number; label: string; tag: string; x: number; y: number; color?: string}> = ({frame, at, bpm, label, tag, x, y, color = UI.green}) => {
	const p = pop(frame, at, 220);
	if (p <= 0.01) {
		return null;
	}
	const W = 560;
	const H = 170;
	const period = (60 / bpm) * 30;
	const pts: string[] = [];
	for (let i = 0; i <= 140; i++) {
		const t = ((frame * 3 + i * 2) % (period * 3)) / (period * 3);
		const k = t * 10;
		const v = k > 4.6 && k < 4.9 ? -1 : k > 4.9 && k < 5.2 ? 0.55 : k > 6.2 && k < 7 ? -0.15 * Math.sin((k - 6.2) * Math.PI * 1.25) : 0;
		pts.push(`${(i / 140) * W},${H / 2 + v * H * 0.42}`);
	}
	return (
		<div style={{position: 'absolute', left: x, top: y, width: W + 60, transform: `translate(-50%, -50%) scale(${p})`, background: UI.box, border: `3px solid ${UI.edge}`, borderRadius: 30, padding: '20px 30px', fontFamily: FONT, fontWeight: 700, color: UI.cream}}>
			<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 34}}>
				<span>{label}</span>
				<span style={{color}}>♥ {tag}</span>
			</div>
			<svg width={W} height={H} style={{display: 'block', marginTop: 8}}>
				<polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" />
			</svg>
		</div>
	);
};

/** A white flash (a camera going off). */
export const Flash: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const o = frame < at ? 0 : 1 - span(frame, at, at + 12);
	return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};

/** A photo border around the whole frame, tilted, with a caption. */
export const PhotoFrame: React.FC<{frame: number; at: number; caption: string}> = ({frame, at, caption}) => {
	const p = span(frame, at, at + 14);
	if (p <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{pointerEvents: 'none', transform: `rotate(${-2 * p}deg) scale(${1 - 0.06 * p})`}}>
			<div style={{position: 'absolute', inset: 0, border: '46px solid #FFFDF6', borderBottomWidth: 170, boxShadow: '0 0 0 2000px rgba(20,10,40,0.5)', opacity: p}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 52, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 64, color: '#2A2350', opacity: p}}>{caption}</div>
		</AbsoluteFill>
	);
};

/** The school show sign-up sheet, pinned to a noticeboard. Your line gets circled. */
export const SignUp: React.FC<{frame: number; at: number; circleAt: number}> = ({frame, at, circleAt}) => {
	const p = pop(frame, at, 200);
	if (p <= 0.01) {
		return null;
	}
	const rows: Array<[string, string]> = [
		['Priya', 'Magic tricks'],
		['Tom & Leo', 'Comedy'],
		['Ava', 'Dance'],
		['YOU', 'Singing'],
		['Sam', 'Juggling'],
	];
	const c = span(frame, circleAt, circleAt + 18);
	return (
		<div style={{position: 'absolute', left: 960, top: 560, width: 820, transform: `translate(-50%, -50%) rotate(-2deg) scale(${p})`, background: '#FFFDF6', borderRadius: 12, padding: '40px 60px 50px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', fontFamily: FONT, fontWeight: 700, color: '#2A2350'}}>
			<div style={{position: 'absolute', left: '50%', top: -22, width: 44, height: 44, borderRadius: 22, background: UI.red, transform: 'translateX(-50%)', boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}} />
			<div style={{fontSize: 64, textAlign: 'center', color: '#7F5AF0'}}>SCHOOL SHOW</div>
			<div style={{fontSize: 40, textAlign: 'center', marginBottom: 24, color: '#E8453C'}}>FRIDAY · 7PM · MAIN HALL</div>
			{rows.map(([n, act], i) => (
				<div key={n} style={{position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: 44, borderBottom: '3px solid #D8D0E8', padding: '10px 6px'}}>
					<span>{n}</span>
					<span>{act}</span>
					{n === 'YOU' && c > 0 ? (
						<svg style={{position: 'absolute', left: -30, top: -18, overflow: 'visible'}} width={760} height={100}>
							<ellipse cx={380} cy={46} rx={370} ry={44} fill="none" stroke={UI.red} strokeWidth={8} strokeDasharray={2400} strokeDashoffset={2400 * (1 - c)} />
						</svg>
					) : null}
					{i === 3 ? null : null}
				</div>
			))}
		</div>
	);
};

/** A soft dark vignette, for nerves. */
export const Vignette: React.FC<{strength: number}> = ({strength}) => (
	<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(8,4,24,${0.75 * strength}) 100%)`}} />
);

/** H.G. Wells's 1897 novel: an old clothbound cover, with a floating hat and glasses. */
export const Book: React.FC<{frame: number; at: number}> = ({frame, at}) => {
	const p = pop(frame, at, 180);
	if (p <= 0.01) {
		return null;
	}
	const bob = Math.sin(frame * 0.08) * 6;
	return (
		<AbsoluteFill style={{background: `rgba(10,6,30,${0.55 * Math.min(1, p)})`}}>
			<div style={{position: 'absolute', left: 960, top: 560, width: 460, height: 640, transform: `translate(-50%, -50%) rotate(-4deg) scale(${p})`, background: 'linear-gradient(135deg, #8A2A2A, #5A1A1E)', borderRadius: '10px 22px 22px 10px', boxShadow: 'inset 18px 0 0 rgba(0,0,0,0.25), 0 30px 70px rgba(0,0,0,0.6)', fontFamily: FONT, fontWeight: 700, color: '#F2C66E', textAlign: 'center'}}>
				<div style={{position: 'absolute', inset: 22, border: '4px solid #F2C66E', borderRadius: 12}} />
				<div style={{marginTop: 70, fontSize: 44, letterSpacing: 4}}>THE</div>
				<div style={{fontSize: 60, lineHeight: 1.05, marginTop: 6}}>INVISIBLE<br />MAN</div>
				<svg width={300} height={220} style={{marginTop: 26}} viewBox="0 0 300 220">
					<g transform={`translate(0 ${bob})`}>
						<ellipse cx={150} cy={78} rx={110} ry={16} fill="#F2C66E" />
						<path d="M85 78 Q90 10 150 10 Q210 10 215 78 Z" fill="#F2C66E" />
						<circle cx={118} cy={150} r={30} fill="none" stroke="#F2C66E" strokeWidth={10} />
						<circle cx={182} cy={150} r={30} fill="none" stroke="#F2C66E" strokeWidth={10} />
						<line x1={148} y1={150} x2={152} y2={150} stroke="#F2C66E" strokeWidth={10} />
					</g>
				</svg>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 64, fontSize: 38}}>H.G. WELLS · 1897</div>
			</div>
		</AbsoluteFill>
	);
};
