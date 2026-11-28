/**
 * Engraved world map in the collage style: wavy sea lines, coast-parallel
 * ripples, hatched land, a cross-hatched featured country that floods yellow
 * from south to north, graticule, compass rose and Caslon labels.
 * Everything is drawn so line spacing stays constant on screen while the
 * camera moves.
 */
import React from 'react';
import {Easing, interpolate} from 'remotion';
import W from './world_pacific.json';
import {useBoil, useTwos, V} from './vox';

type Geo = {W: number; H: number; land: string; landBig: string; borders: string; grat: string; vietnam: string; usa: string; pts: Record<string, [number, number]>; bbox: Record<string, [number, number, number, number]>};
const G = W as unknown as Geo;
export const MAP_PTS = G.pts;

/** Camera: centre (x, y) and visible width w, in map units. */
export type MapView = {x: number; y: number; w: number};
export type MapLabel = {text: string; at: [number, number]; size?: number; italic?: boolean; spacing?: number; from?: number};

const ease = Easing.bezier(0.6, 0, 0.25, 1);

export const useMapCam = (from: MapView, to: MapView, start: number, end: number) => {
	const f2 = useTwos();
	const t = interpolate(f2, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	// zoom in log space so the push feels even
	const w = Math.exp(Math.log(from.w) + (Math.log(to.w) - Math.log(from.w)) * t);
	return {x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, w};
};

/** Map coordinates → screen pixels for a camera. */
export const toScreen = (cam: MapView, p: [number, number]) => {
	const k = 1920 / cam.w;
	return [(p[0] - cam.x) * k + 960, (p[1] - cam.y) * k + 540] as [number, number];
};

const Compass: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 62}) => {
	const w = r * 0.16;
	const arms = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2 - Math.PI / 2);
	const P = (pts: number[][]) => pts.map((p) => p.join(',')).join(' ');
	return (
		<g stroke={V.ink} strokeWidth={2}>
			<circle cx={x} cy={y} r={r * 0.72} fill="none" strokeWidth={1.5} />
			<circle cx={x} cy={y} r={r * 0.62} fill="none" strokeWidth={1} strokeDasharray="3 4" />
			{arms.map((a, i) => {
				const tip = [x + Math.cos(a) * r, y + Math.sin(a) * r];
				const l = [x - Math.sin(a) * w, y + Math.cos(a) * w];
				const rr = [x + Math.sin(a) * w, y - Math.cos(a) * w];
				return (
					<g key={i}>
						<polygon points={P([tip, l, [x, y]])} fill={V.ink} />
						<polygon points={P([tip, rr, [x, y]])} fill={V.board} />
					</g>
				);
			})}
			<text x={x} y={y - r - 12} textAnchor="middle" fontFamily="Caslon" fontWeight={700} fontSize={30} fill={V.ink} stroke="none">
				N
			</text>
		</g>
	);
};

/**
 * The engraved map. `feature` is a country key in the JSON (vietnam, usa)
 * that floods yellow from `sweepAt` over 16 frames.
 */
export const EngravedMap: React.FC<{
	cam: MapView;
	feature?: 'vietnam' | 'usa';
	sweepAt?: number;
	labels?: MapLabel[];
	compass?: boolean;
	id?: string;
}> = ({cam, feature, sweepAt = 0, labels = [], compass = true, id = 'map'}) => {
	const f2 = useTwos();
	const boil = useBoil(id);
	const k = 1920 / cam.w;
	const h = cam.w * (1080 / 1920);
	const u = (px: number) => px / k; // screen px → map units
	const vb = `${cam.x - cam.w / 2} ${cam.y - h / 2} ${cam.w} ${h}`;
	const sea = 22,
		hatch = 22,
		cross = 13;
	const sweep = feature ? interpolate(f2, [sweepAt, sweepAt + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const bb = feature ? G.bbox[feature] : [0, 0, 0, 0];
	const pad = u(30);
	const sweepH = (bb[3] - bb[1] + pad * 2) * sweep;
	// wobble the line art a touch on every boil step
	const seed = Math.floor(f2 / 8) % 3;
	return (
		<div style={{position: 'absolute', inset: 0, transform: boil}}>
			<svg width={1920} height={1080} viewBox={vb} style={{position: 'absolute', inset: 0, background: V.board}}>
				<defs>
					<pattern id={`sea-${id}`} patternUnits="userSpaceOnUse" width={u(sea * 4)} height={u(sea)}>
						<path
							d={`M0 ${u(sea / 2)} q ${u(sea / 2)} ${-u(4)} ${u(sea)} 0 t ${u(sea)} 0 t ${u(sea)} 0 t ${u(sea)} 0`}
							fill="none"
							stroke={V.ink}
							strokeWidth={u(1.3)}
							opacity={0.55}
						/>
					</pattern>
					<pattern id={`hatch-${id}`} patternUnits="userSpaceOnUse" width={u(hatch)} height={u(hatch)} patternTransform="rotate(45)">
						<line x1={0} y1={0} x2={0} y2={u(hatch)} stroke={V.ink} strokeWidth={u(1.4)} opacity={0.6} />
					</pattern>
					<pattern id={`cross-${id}`} patternUnits="userSpaceOnUse" width={u(cross)} height={u(cross)} patternTransform="rotate(45)">
						<line x1={0} y1={0} x2={0} y2={u(cross)} stroke={V.ink} strokeWidth={u(1.6)} />
						<line x1={0} y1={0} x2={u(cross)} y2={0} stroke={V.ink} strokeWidth={u(1.6)} />
					</pattern>
					<clipPath id={`sweep-${id}`}>
						<rect x={bb[0] - pad} y={bb[3] + pad - sweepH} width={bb[2] - bb[0] + pad * 2} height={sweepH} />
					</clipPath>
					<filter id={`rough-${id}-${seed}`} x="-5%" y="-5%" width="110%" height="110%">
						<feTurbulence type="fractalNoise" baseFrequency={0.9 / u(40)} numOctaves={1} seed={seed + 2} />
						<feDisplacementMap in="SourceGraphic" scale={u(2.2)} />
					</filter>
				</defs>
				{/* wavy open sea */}
				<rect x={cam.x - cam.w / 2} y={cam.y - h / 2} width={cam.w} height={h} fill={`url(#sea-${id})`} />
				<g filter={`url(#rough-${id}-${seed})`}>
					{/* coast-parallel ripples: ink rings, each knocked back with board colour */}
					{[48, 32, 19, 8].map((d) => (
						<g key={d}>
							<path d={G.landBig} fill="none" stroke={V.ink} strokeWidth={u(d * 2 + 1.4)} strokeLinejoin="round" opacity={0.6} />
							<path d={G.landBig} fill="none" stroke={V.board} strokeWidth={u(d * 2 - 1.4)} strokeLinejoin="round" />
						</g>
					))}
					{/* land */}
					<path d={G.land} fill={V.beige} />
					<path d={G.land} fill={`url(#hatch-${id})`} />
					{feature && <path d={G[feature]} fill={V.beige} />}
					{feature && <path d={G[feature]} fill={`url(#cross-${id})`} opacity={0.7} />}
					<path d={G.grat} fill="none" stroke={V.ink} strokeWidth={u(1.1)} opacity={0.35} />
					<path d={G.borders} fill="none" stroke={V.ink} strokeWidth={u(2.2)} strokeDasharray={`${u(22)} ${u(18)}`} />
					<path d={G.land} fill="none" stroke={V.ink} strokeWidth={u(6)} strokeLinejoin="round" />
					{feature && sweep > 0 && (
						<g clipPath={`url(#sweep-${id})`} style={{mixBlendMode: 'multiply'}}>
							<path d={G[feature]} fill={V.yellow} opacity={0.9} />
							<path d={G[feature]} fill="none" stroke={V.ink} strokeWidth={u(6)} strokeLinejoin="round" />
						</g>
					)}
				</g>
			</svg>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{labels
					.filter((l) => f2 >= (l.from ?? 0))
					.map((l, i) => {
						const [sx, sy] = toScreen(cam, l.at);
						const n = Math.max(0, Math.floor((f2 - (l.from ?? 0)) * 1.4));
						return (
							<text
								key={i}
								x={sx}
								y={sy}
								textAnchor="middle"
								fontFamily="Caslon"
								fontStyle={l.italic ? 'italic' : 'normal'}
								fontSize={l.size ?? 34}
								letterSpacing={l.spacing ?? 6}
								fill={V.ink}
								stroke={V.board}
								strokeWidth={6}
								paintOrder="stroke"
							>
								{l.text.slice(0, l.from === undefined ? undefined : n)}
							</text>
						);
					})}
				{compass && <Compass x={1780} y={930} />}
			</svg>
		</div>
	);
};

/** A still of the map (no labels or compass) to use as a fast background plate. */
export const MapPlate: React.FC<{x: number; y: number; w: number; feature?: 'vietnam' | 'usa'}> = ({x, y, w, feature}) => (
	<EngravedMap cam={{x, y, w}} feature={feature} sweepAt={-100} labels={[]} compass={false} id="plate" />
);
