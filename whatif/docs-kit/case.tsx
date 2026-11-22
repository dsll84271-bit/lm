/**
 * The channel's signature pieces: every video opens a case file and ends with
 * a Reality Score and "CASE CLOSED".
 */
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bg, C, clamp, Grain, img, Kicker, lerp, Stamp, Typed, useDrop, Vignette} from './kit';

export const CHANNEL = 'FICTION FILES';
export const INTRO_FRAMES = 150;
export const OUTRO_FRAMES = 300;

const Lamp: React.FC<{o?: number}> = ({o = 1}) => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(255,214,150,.28) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.75) 100%)', opacity: o}} />
);

const Wordmark: React.FC<{at: number; y?: number; size?: number}> = ({at, y = 90, size = 44}) => {
	const frame = useCurrentFrame();
	const o = lerp(frame, at, at + 12, 0, 1);
	const w = lerp(frame, at, at + 20, 0, 260);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: o}}>
			<div style={{fontFamily: 'Bebas', fontSize: size, letterSpacing: size * 0.32, color: '#E9D6A8', textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>{CHANNEL}</div>
			<div style={{width: w, height: 2, background: C.gold, margin: '10px auto 0'}} />
		</div>
	);
};

/** 5-second opener: a case folder lands on the desk, gets typed and stamped OPEN. */
export const CaseIntro: React.FC<{caseNo: number; title: string; photo?: string}> = ({caseNo, title, photo}) => {
	const frame = useCurrentFrame();
	const drop = useDrop(10, 13);
	const push = interpolate(frame, [0, 150], [1.0, 1.12], {...clamp, easing: Easing.bezier(0.3, 0, 0.6, 1)});
	const flash = interpolate(frame, [128, 134, 150], [0, 1, 0], clamp);
	const swipe = lerp(frame, 126, 150, 0, 1, Easing.in(Easing.cubic));
	const no = String(caseNo).padStart(3, '0');
	return (
		<AbsoluteFill style={{background: '#0B0F14', overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${push}) translateX(${-swipe * 300}px)`, opacity: 1 - swipe * 0.6}}>
				<Bg kind="navy" />
				<Lamp />
				<div
					style={{
						position: 'absolute',
						left: 560,
						top: 250,
						width: 800,
						height: 560,
						transform: `translateY(${(1 - drop) * -500}px) rotate(${-3 + (1 - drop) * 10}deg)`,
						filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))',
					}}
				>
					{/* folder back + tab */}
					<div style={{position: 'absolute', left: 0, top: -46, width: 260, height: 70, background: '#C9A564', borderRadius: '14px 14px 0 0'}} />
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#D9B77A,#C79F5E)', borderRadius: 8}} />
					{photo && (
						<div style={{position: 'absolute', right: 40, top: -30, width: 250, height: 190, padding: 10, background: '#F7F2E6', transform: 'rotate(6deg)', boxShadow: '0 8px 16px rgba(0,0,0,.35)'}}>
							<div style={{width: '100%', height: '100%', background: `url(${img(photo)}) center/cover`, filter: 'grayscale(.4) sepia(.3)'}} />
						</div>
					)}
					{/* label */}
					<div style={{position: 'absolute', left: 70, top: 120, width: 560, padding: '26px 34px', background: '#F4ECD8', border: '2px solid #8A6A3A', boxShadow: '0 4px 10px rgba(0,0,0,.2)'}}>
						<div style={{fontFamily: 'Elite', fontSize: 34, color: '#3A2E1E', letterSpacing: 4}}>
							<Typed text={`CASE FILE No. ${no}`} at={24} cps={22} />
						</div>
						<div style={{fontFamily: 'Bebas', fontSize: 120, color: C.ink, lineHeight: 1, marginTop: 14, opacity: lerp(frame, 46, 54, 0, 1)}}>{title}</div>
					</div>
					<div style={{position: 'absolute', left: 0, top: 0}}>
						<Stamp text="OPEN" x={600} y={430} at={52} size={120} rot={-12} />
					</div>
				</div>
				<Wordmark at={64} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: '#FFF6E0', opacity: flash}} />
			<Grain opacity={0.2} />
			<Audio src={staticFile('doc01/music/sting_intro.wav')} volume={0.9} />
		</AbsoluteFill>
	);
};

/** 10-second closer: the Reality Score, CASE CLOSED, and the next case. */
export const CaseClosed: React.FC<{score: number; question: string; next: string; nextPhoto?: string}> = ({score, question, next, nextPhoto}) => {
	const frame = useCurrentFrame();
	const fill = lerp(frame, 27, 27 + score * 4, 0, score, Easing.linear);
	const closed = 120;
	const nextIn = useDrop(175, 14);
	return (
		<AbsoluteFill style={{background: '#0B0F14', overflow: 'hidden'}}>
			<Bg kind="navy" />
			<Lamp />
			<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: lerp(frame, 0, 12, 0, 1)}}>
				<Kicker color="#E0A84A" size={30} style={{letterSpacing: 10}}>
					THE VERDICT
				</Kicker>
				<div style={{fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 64, color: C.cream, marginTop: 14}}>{question}</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', transform: `translateY(${lerp(frame, 150, 175, 0, -60)}px) scale(${lerp(frame, 150, 175, 1, 0.62)})`, opacity: lerp(frame, 150, 175, 1, 0.9)}}>
				<div style={{fontFamily: 'Elite', fontSize: 30, letterSpacing: 8, color: '#C9D3DE'}}>REALITY SCORE</div>
				<div style={{fontFamily: 'Bebas', fontSize: 260, lineHeight: 1, color: C.yellow, textShadow: '0 0 40px rgba(242,194,0,.35)'}}>
					{Math.round(fill)}
					<span style={{fontSize: 130, color: '#8A9AAC'}}>/10</span>
				</div>
				<div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10}}>
					{Array.from({length: 10}).map((_, i) => (
						<div key={i} style={{width: 60, height: 22, borderRadius: 4, background: i < fill ? C.yellow : '#25313F', boxShadow: i < fill ? '0 0 14px rgba(242,194,0,.6)' : undefined}} />
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, opacity: lerp(frame, 150, 175, 1, 0)}}>
				<Stamp text="CASE CLOSED" x={960} y={560} at={closed} size={190} rot={-8} onDark />
			</div>
			{frame >= 175 && (
				<div style={{position: 'absolute', left: 560, top: 660, width: 800, display: 'flex', gap: 30, alignItems: 'center', transform: `translateY(${(1 - nextIn) * 200}px)`, opacity: nextIn}}>
					{nextPhoto && <div style={{width: 260, height: 180, border: '8px solid #F7F2E6', background: `url(${img(nextPhoto)}) center/cover`, flex: 'none', boxShadow: '0 10px 20px rgba(0,0,0,.5)'}} />}
					<div>
						<div style={{fontFamily: 'Elite', fontSize: 26, letterSpacing: 6, color: '#E0A84A'}}>NEXT CASE</div>
						<div style={{fontFamily: 'Bebas', fontSize: 86, lineHeight: 1, color: C.cream}}>{next}</div>
						<div style={{display: 'inline-block', marginTop: 16, padding: '10px 28px', background: '#C4302B', color: '#fff', fontFamily: 'Oswald', fontWeight: 700, fontSize: 34, borderRadius: 8}}>SUBSCRIBE</div>
					</div>
				</div>
			)}
			<Wordmark at={175} y={980} size={34} />
			<Vignette strength={0.5} />
			<Grain opacity={0.2} />
			<Audio src={staticFile('doc01/music/sting_outro.wav')} volume={0.9} />
		</AbsoluteFill>
	);
};
