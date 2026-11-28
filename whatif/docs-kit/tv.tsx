/**
 * A late-1960s television set. Footage plays on its curved screen with
 * scanlines, glow and glass glare, so low-resolution clips read as a broadcast.
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';

/**
 * Plays a clip from the moment the set switches on. Clips long enough are looped;
 * short ones hold on their last frame (like a paused tape) instead of running out.
 */
const Tape: React.FC<{src: string; startFrom: number; rate: number; len?: number}> = ({src, startFrom, rate, len}) => {
	const frame = useCurrentFrame();
	const video = <OffthreadVideo src={staticFile(src)} startFrom={startFrom} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.06)'}} />;
	if (!len) return video;
	const n = Math.max(2, Math.floor(((len - startFrom / 30) * 30) / rate) - 2);
	if (n >= 90) return <Loop durationInFrames={n} layout="none">{video}</Loop>;
	return frame >= n ? <Freeze frame={n}>{video}</Freeze> : video;
};

export const TV: React.FC<{
	src?: string; // video path under public/
	image?: string; // or a still image path under public/ (slowly pushed in)
	children?: React.ReactNode; // or anything else drawn on the screen
	startFrom?: number; // frames into the clip
	x?: number;
	y?: number;
	w?: number; // cabinet width in px
	rot?: number;
	on?: number; // frame the picture switches on
	grade?: 'colour' | 'warm' | 'mono';
	rate?: number; // playback speed of the clip
	tint?: string; // a colour washed over the picture (the case accent)
	len?: number; // the clip's length in seconds (lets it loop or hold instead of running out)
}> = ({src, image, children, rate = 1, tint, len, startFrom = 0, x = 960, y = 540, w = 1100, rot = 0, on = 0, grade = 'warm'}) => {
	const frame = useCurrentFrame();
	const h = w * 0.78;
	const sw = w * 0.7,
		sh = sw * 0.75; // 4:3 tube
	const t = frame - on;
	// switch-on: a bright horizontal line opens into the picture
	const open = Math.min(1, Math.max(0, t / 6));
	const flick = 0.94 + 0.06 * Math.sin(frame * 2.3) * Math.sin(frame * 0.7);
	const filter = grade === 'mono' ? 'grayscale(1) contrast(1.15) brightness(1.05)' : grade === 'warm' ? 'saturate(.75) sepia(.18) contrast(1.08)' : 'none';
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.55))'}}>
			{/* walnut cabinet */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: w * 0.05,
					background: 'linear-gradient(170deg,#7A4B2A 0%,#5C351C 45%,#43260F 100%)',
					boxShadow: 'inset 0 0 0 6px rgba(255,220,170,.12), inset 0 -20px 40px rgba(0,0,0,.45)',
				}}
			/>
			{/* wood grain */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: w * 0.05,
					opacity: 0.18,
					background: 'repeating-linear-gradient(178deg, rgba(0,0,0,.5) 0 2px, transparent 2px 9px, rgba(255,230,190,.25) 9px 10px, transparent 10px 23px)',
				}}
			/>
			{/* bezel */}
			<div style={{position: 'absolute', left: w * 0.05, top: h * 0.08, width: sw + w * 0.06, height: sh + w * 0.06, borderRadius: w * 0.06, background: 'linear-gradient(160deg,#cfc6b4,#8d8576)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,.5)'}} />
			{/* tube */}
			<div style={{position: 'absolute', left: w * 0.08, top: h * 0.08 + w * 0.03, width: sw, height: sh, borderRadius: `${w * 0.06}px / ${w * 0.07}px`, overflow: 'hidden', background: '#0b0d0c'}}>
				{t >= 0 && (
					<div style={{position: 'absolute', inset: 0, transform: `scaleY(${open < 1 ? Math.max(0.01, open) : 1})`, filter: `${filter} brightness(${flick})`}}>
						{src && (
								<Sequence from={on} layout="none">
									<Tape src={src} startFrom={startFrom} rate={rate} len={len} />
								</Sequence>
							)}
						{image && <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.06 + t * 0.0006})`}} />}
						{children}
					</div>
				)}
				{tint && t >= 0 && <AbsoluteFill style={{background: tint, mixBlendMode: 'soft-light', opacity: 0.55}} />}
				{t >= 0 && open < 1 && <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: '#fff', boxShadow: '0 0 20px #fff'}} />}
				{/* scanlines */}
				<AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 4px)', mixBlendMode: 'multiply'}} />
				{/* tube curvature + glow */}
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.65) 100%)'}} />
				{/* glass glare */}
				<AbsoluteFill style={{background: 'linear-gradient(125deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.04) 30%, rgba(255,255,255,0) 45%)'}} />
			</div>
			{/* speaker grille + knobs */}
			<div
				style={{
					position: 'absolute',
					right: w * 0.04,
					top: h * 0.1,
					width: w * 0.14,
					height: h * 0.5,
					borderRadius: 10,
					background: 'repeating-linear-gradient(0deg,#2a1a0e 0 3px,#6b4a2c 3px 7px)',
					boxShadow: 'inset 0 2px 6px rgba(0,0,0,.6)',
				}}
			/>
			{[0.68, 0.84].map((ty, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						right: w * 0.06,
						top: h * ty,
						width: w * 0.1,
						height: w * 0.1,
						borderRadius: '50%',
						background: 'radial-gradient(circle at 35% 30%,#e9e1cf,#8f8574 60%,#4b443a)',
						boxShadow: '0 4px 8px rgba(0,0,0,.5)',
					}}
				>
					<div style={{position: 'absolute', left: '48%', top: '8%', width: '4%', height: '34%', background: '#2b2620', transform: `rotate(${i ? 40 : -25}deg)`, transformOrigin: '50% 130%'}} />
				</div>
			))}
			{/* legs */}
			{[0.12, 0.82].map((lx, i) => (
				<div key={i} style={{position: 'absolute', left: w * lx, top: h - 4, width: w * 0.05, height: h * 0.12, background: '#3a210d', transform: `skewX(${i ? 8 : -8}deg)`}} />
			))}
		</div>
	);
};
