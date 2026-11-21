import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Ground} from './giant3d';
import {Airliner3D, Ball3D, Banana3D, Bolt3D, Burst3D, Calculator3D, Clover3D, CloverField, DeskFan3D, Grimoire3D, Scale3D, Sword3D} from './grimoire3d';
import {Hero3D} from './Hero3D';
import {Shot3, type Angle3} from './shot3';

// Checks the Episode 6 props: one test set every 10 frames.
const LIGHT = {sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.3, sun: {from: [-8, 14, 9] as [number, number, number], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8] as [number, number, number], color: '#FFD0A0', intensity: 1.4}};
const SKY = 'linear-gradient(#5AA8F0, #BFE4FF)';

export const TestGrim: React.FC = () => {
	const frame = useCurrentFrame();
	const set = Math.floor(frame / 10);
	const f = frame;
	const views: Array<{angle: Angle3; far: React.ReactNode; near: React.ReactNode; bg?: string}> = [
		{
			angle: {at: [0, 1.2, 0], dist: 2.0, yaw: 20, pitch: 6},
			far: <Ground color="#4FA050" size={40} />,
			near: <Grimoire3D at={[0, 1.2, 0]} frame={f} open={(f % 10) / 9} />,
		},
		{
			angle: {at: [0, 1.2, 0], dist: 1.6, yaw: 0, pitch: 4},
			far: <Ground color="#4FA050" size={40} />,
			near: <Grimoire3D at={[0, 1.2, 0]} frame={f} open={1} riffle={(f % 10) * 0.7} ink={(f % 10) / 9} glow={1} />,
		},
		{
			angle: {at: [0, 0.9, 0], dist: 3.4, yaw: 30, pitch: 6},
			far: (
				<group>
					<Ground color="#3E9A4A" size={40} />
					<CloverField skip={[[0, 0, 0.5]]} />
				</group>
			),
			near: (
				<group>
					<Hero3D position={[-0.5, 0, 0]} face="shocked" />
					<Sword3D at={[0.5, 0.35, 0]} rot={[0, 0, 0.1]} frame={f} smoke={1} />
				</group>
			),
		},
		{
			angle: {at: [0, 0.1, 0], dist: 0.75, yaw: 10, pitch: 40},
			far: <Ground color="#3E9A4A" size={40} />,
			near: (
				<group>
					<Clover3D at={[-0.2, 0.12, 0]} n={5} s={0.1} />
					<Clover3D at={[0.2, 0.14, 0]} n={63} s={0.07} />
					<CloverField size={2} n={60} skip={[[0, 0, 0.35]]} />
				</group>
			),
		},
		{
			angle: {at: [0, 8, 0], dist: 30, yaw: 20, pitch: 4},
			far: <Ground color="#3E5A4A" size={200} />,
			near: (
				<group>
					<Bolt3D from={[0, 20, 0]} to={[0, 0, 0]} p={(f % 10) / 6} seed={3} />
					<Airliner3D at={[8, 12, 0]} rot={[0, 0.4, 0]} skin={1} />
				</group>
			),
			bg: 'linear-gradient(#2A1E50, #5A4A8A)',
		},
		{
			angle: {at: [0, 0.4, 0], dist: 2.4, yaw: 20, pitch: 14},
			far: <Ground color="#6A5A7A" size={40} />,
			near: (
				<group>
					<DeskFan3D at={[-0.7, 0, 0]} spin={f} />
					<Banana3D at={[0, 0.1, 0]} />
					<Ball3D at={[0.5, 0.11, 0]} />
					<Scale3D at={[0.9, 0, 0]} />
					<Calculator3D at={[0.3, 0.4, 0.3]} />
					<Burst3D at={[0, 1, -0.5]} t={(f % 10) / 10 + 0.05} />
				</group>
			),
		},
	];
	const v = views[set % views.length];
	return <Shot3 frame={f} dur={10} lines={[]} cuts={[0]} angles={[v.angle]} light={LIGHT} bg={v.bg ?? SKY} far={v.far} near={v.near} blur={0} />;
};
