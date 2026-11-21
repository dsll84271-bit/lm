import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Ant3D, AntCrowd, ANT, CatHead3D, CatPaw3D, Ladybird3D, Mosquito3D, Mouse3D, Strider3D} from './bugs3d';
import {Alarm3D, AntHill3D, BedTop, BigCrumb3D, Brick3D, Carpet, Cornflake3D, Crumb3D, DandelionClock3D, Drop3D, DustBall3D, Grass, Ground, Rain3D, Rice3D, Ruler3D, Seed3D, Slipper3D, Sock3D, Twig3D, Water3D} from './giant3d';
import {Hero3D} from './Hero3D';
import {Shot3, type Angle3} from './shot3';

// Checks the Episode 4 props: one test set every 10 frames.
const LIGHT = {sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.3, sun: {from: [-8, 14, 9] as [number, number, number], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8] as [number, number, number], color: '#FFD0A0', intensity: 1.4}};

export const TestAnt: React.FC = () => {
	const frame = useCurrentFrame();
	const set = Math.floor(frame / 10);
	const f = frame;
	const views: Array<{angle: Angle3; far: React.ReactNode; near: React.ReactNode; bg?: string}> = [
		{
			angle: {at: [0.3, 0.9, 0], dist: 6, yaw: 25, pitch: 10},
			far: <Carpet size={50} clear={5} />,
			near: (
				<group>
					<Ant3D at={[1.2, 0, 0]} rot={-1.2} frame={f} pip tap={0.6} />
					<Hero3D position={[-1, 0, 0.3]} turn={1.0} face="happy" />
				</group>
			),
		},
		{
			angle: {at: [0, 2, 0], dist: 22, yaw: 20, pitch: 14},
			far: (
				<group>
					<Ground color="#7A5A3A" />
					<Grass size={90} clear={16} />
					<AntHill3D at={[-4, 0, -10]} />
				</group>
			),
			near: (
				<group>
					<AntCrowd frame={f} ants={[...Array(8)].map((_, i) => ({p: [-4 + i * 1.6, 0, 2 + i * 0.4] as [number, number, number], rot: Math.PI / 2, walk: f / 20 + i * 0.3}))} />
					<Ladybird3D at={[5, 0, 4]} rot={-0.6} frame={f} />
					<Hero3D position={[1, 0, 6]} face="shocked" />
				</group>
			),
		},
		{
			angle: {at: [0, 12, 0], dist: 80, yaw: 0, pitch: 5, fov: 40},
			bg: '#1A1430',
			far: <Ground color="#E8D8C0" />,
			near: (
				<group>
					<CatHead3D at={[0, 30, -40]} frame={f} pupil={0.8} />
					<CatPaw3D at={[22, 0, 0]} claws={1} />
					<Hero3D position={[0, 0, 20]} turn={Math.PI} />
				</group>
			),
		},
		{
			angle: {at: [0, 0.8, 0], dist: 8, yaw: 30, pitch: 12},
			far: <Water3D level={0.01} frame={f} size={[60, 60]} />,
			near: (
				<group>
					<Mouse3D at={[-2.5, 0, 0]} frame={f} rot={0.6} />
					<Mouse3D at={[-0.5, 0, 1]} frame={f} shrew rot={0.3} />
					<Mosquito3D at={[1.6, 1.4, 0.5]} frame={f} rot={[0, -0.6, 0]} />
					<Strider3D at={[2.5, 0, -2.5]} frame={f} rot={0.4} />
				</group>
			),
		},
		{
			angle: {at: [0, 10, 0], dist: 40, yaw: 10, pitch: 6, fov: 40},
			far: (
				<group>
					<Ground color="#5A8A3A" />
					<Grass size={110} clear={20} seed={3} />
				</group>
			),
			near: (
				<group>
					<DandelionClock3D at={[-8, 0, -6]} frame={f} gone={0.2} stalk={14} />
					<Seed3D at={[8, 4, 2]} frame={f} ring={1} />
					<Hero3D position={[8, 0.6, 2]} armL={[170, 175]} armR={[170, 175]} face="happy" />
				</group>
			),
		},
		{
			angle: {at: [0, 2.5, 0], dist: 26, yaw: -20, pitch: 10, fov: 38},
			far: (
				<group>
					<Carpet size={70} clear={12} seed={5} />
					<Brick3D at={[-12, 0, -14]} rot={0.4} />
					<Sock3D at={[18, 0, -30]} rot={-0.3} />
				</group>
			),
			near: (
				<group>
					<DustBall3D at={[6, 2.4, -2]} roll={f * 0.1} />
					<Cornflake3D at={[-2, 0.8, 0]} rot={[0.1, 0.4, 0]} />
					<Crumb3D at={[4, 0, 4]} />
					<BigCrumb3D at={[-6, 1, 5]} />
					<Hero3D position={[0, 0, 6]} armL={[170, 178]} armR={[170, 178]} />
				</group>
			),
		},
		{
			angle: {at: [0, 1.2, 0], dist: 9, yaw: 15, pitch: 22, fov: 34},
			far: <Ground color="#E8D8C0" />,
			near: (
				<group>
					<Ruler3D at={[0, 0, -2]} len={24} />
					<Hero3D position={[-2, 0, -2]} face="happy" />
					<Rice3D at={[3, 0, -2]} />
					<Drop3D at={[0, 0, 3]} frame={f} wobble={0.5} />
					<Twig3D at={[-6, 0.5, 3]} />
				</group>
			),
		},
		{
			angle: {at: [0, 30, 0], dist: 120, yaw: 25, pitch: 8, fov: 40},
			far: (
				<group>
					<Carpet size={200} clear={1} seed={9} tall={5} />
					<BedTop top={60} edge={-20} />
					<Alarm3D at={[60, 60, -60]} frame={f} ring={1} s={1.6} />
				</group>
			),
			near: (
				<group>
					<Slipper3D at={[30, 0, 20]} rot={0.5} />
					<Rain3D frame={f} area={40} center={[-20, 20]} />
				</group>
			),
		},
	];
	const v = views[Math.min(set, views.length - 1)];
	return <Shot3 frame={frame % 10} dur={10} lines={[]} cuts={[0]} angles={[v.angle]} light={LIGHT} bg={v.bg ?? '#9FD0FA'} far={v.far} near={v.near} />;
};

void ANT;
