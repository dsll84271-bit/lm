import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hero3D} from './Hero3D';
import {Shot3, type Angle3} from './shot3';
import {Bird3D, Bus3D, Car3D, Cliffs3D, Cloud3D, CloudSea, Fields3D, Flyer, Gossamer3D, Herd3D, Mountains3D, SchoolTop3D, Sea3D, Streaks, Sun3D, Thermal3D, Town3D, townCell, Vee} from './sky3d';

// Checks the Episode 5 props: one test set every 10 frames.
const LIGHT = {sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.3, sun: {from: [-8, 14, 9] as [number, number, number], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8] as [number, number, number], color: '#FFD0A0', intensity: 1.4}};
const SKY = 'linear-gradient(#5AA8F0, #BFE4FF)';

export const TestFly: React.FC = () => {
	const frame = useCurrentFrame();
	const set = Math.floor(frame / 10);
	const f = frame;
	const views: Array<{angle: Angle3; far: React.ReactNode; near: React.ReactNode; bg?: string}> = [
		{
			angle: {at: [0, 0.6, 0], dist: 2.2, yaw: 35, pitch: 10},
			far: <Town3D frame={f} clear={[{at: [0, 0], r: 30}]} />,
			near: (
				<group>
					<Bird3D kind="pigeon" at={[-0.4, 0.4, 0]} frame={f} wing="fold" perch s={1.5} />
					<Bird3D kind="pigeon" at={[0.6, 0.9, 0.2]} frame={f} s={1.5} yaw={-40} />
				</group>
			),
			bg: SKY,
		},
		{
			angle: {at: [0, 0, 0], dist: 5, yaw: 90, pitch: 5},
			far: <CloudSea y={-20} />,
			near: (
				<group>
					<Flyer at={[0, 0.8, 0]} frame={f} face="happy" />
					<Flyer at={[0, -0.8, 0]} frame={f} face="shocked" pose="glide" />
				</group>
			),
			bg: SKY,
		},
		{
			angle: {at: [0, 0.5, 0], dist: 3.4, yaw: 40, pitch: 8},
			far: <Sea3D frame={f} />,
			near: (
				<group>
					<Bird3D kind="godwit" at={[-0.8, 0.6, 0]} frame={f} s={1.6} />
					<Bird3D kind="frigate" at={[0.8, 0.5, -0.5]} frame={f} wing="glide" sleepy s={0.9} yaw={-30} />
				</group>
			),
			bg: SKY,
		},
		{
			angle: {at: [0, 1, 0], dist: 5.5, yaw: 25, pitch: 14},
			far: <Fields3D />,
			near: <Bird3D kind="condor" at={[0, 1, 0]} frame={f} wing="glide" tracker bank={-12} />,
			bg: SKY,
		},
		{
			angle: {at: [0, 1.5, 0], dist: 11, yaw: 25, pitch: 8, fov: 40},
			far: <Fields3D />,
			near: (
				<group>
					<Bird3D kind="argentavis" at={[-2.5, 1.6, 0]} frame={f} wing="glide" perch />
					<Hero3D position={[1, 0, 1]} face="shocked" turn={-0.5} />
					<Car3D at={[4, 0, -2]} yaw={1.2} />
				</group>
			),
			bg: SKY,
		},
		{
			angle: {at: [0, 0, 0], dist: 4, yaw: 35, pitch: 8},
			far: <Cloud3D at={[0, -8, 30]} s={14} />,
			near: (
				<group>
					<Flyer at={[0, 0, 0]} frame={f} face="happy" />
					<Streaks at={[0, 0, 0]} frame={f} />
				</group>
			),
			bg: SKY,
		},
		{
			angle: {at: [0, 14, 0], dist: 70, yaw: 20, pitch: 8, fov: 45},
			far: (
				<group>
					<Sea3D frame={f} />
					<Cliffs3D at={[0, 0, -30]} />
				</group>
			),
			near: <Thermal3D at={[0, 20, -20]} frame={f} />,
			bg: SKY,
		},
		{
			angle: {at: [0, 2.5, 0], dist: 26, yaw: 30, pitch: 12, fov: 40},
			far: <Sea3D frame={f} color="#5A7AA0" />,
			near: (
				<Gossamer3D at={[0, 1, 0]} frame={f} yaw={0}>
					<Hero3D position={[0, 0.4, 0.2]} sit />
				</Gossamer3D>
			),
			bg: 'linear-gradient(#8A9AB8, #C8D4E4)',
		},
	];
	const v = views[Math.min(set, views.length - 1)];
	return <Shot3 frame={frame % 10} dur={10} lines={[]} cuts={[0]} angles={[v.angle]} light={LIGHT} bg={v.bg ?? '#9FD0FA'} far={v.far} near={v.near} />;
};
