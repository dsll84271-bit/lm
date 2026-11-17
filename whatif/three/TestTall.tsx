import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hero3D} from './Hero3D';
import {Shot3, type Angle3} from './shot3';
import type {Light3} from './Stage3D';
import {Bird3D, Bus3D, Car3D, Fields3D, Town3D} from './sky3d';
import {AnkleHouse, Balance3D, Bathtub3D, Bed8, BigBen3D, Billboard3D, Bridge3D, Cat8, Church3D, Drone3D, Eiffel3D, Elephant3D, Giraffe3D, Goal8, Helicopter3D, Hill3D, House3D, Kite3D, Lorry3D, Oak3D, Pavilion3D, PizzaPile, PoliceTape3D, Redwood3D, Ruler3D, Shops3D, Stadium3D, Street8, Trays3D, Van3D, Washing3D, Water8} from './tall3d';

// Checks the Episode 8 props: one test set every 10 frames.
const BIG: Light3 = {sky: '#CFE6FF', ground: '#5A7A6A', ambient: 1.3, sun: {from: [-120, 220, 160], color: '#FFF4E0', intensity: 2.8}, rim: {from: [120, 60, -160], color: '#FFD0A0', intensity: 1.3}, fog: {color: '#CFE6FF', near: 400, far: 1800}, shadow: {size: 160, far: 700, at: [0, 0, 0]}};
const STREET: Light3 = {sky: '#CFE6FF', ground: '#5A7A6A', ambient: 1.3, sun: {from: [-30, 60, 40], color: '#FFF4E0', intensity: 2.8}, rim: {from: [30, 20, -40], color: '#FFD0A0', intensity: 1.3}, fog: {color: '#CFE6FF', near: 150, far: 900}, shadow: {size: 40, far: 200, at: [0, 0, 0]}};
const STUDIO: Light3 = {sky: '#D8D0FF', ground: '#3A2E80', ambient: 1.35, sun: {from: [80, 180, 160], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-80, 50, -160], color: '#FF8AD8', intensity: 1.8}, shadow: {size: 120, far: 600, at: [0, 0, 0]}};
const SKY = 'linear-gradient(#5AA8F0, #CFEFFF)';

export const TestTall: React.FC = () => {
	const frame = useCurrentFrame();
	const f = frame;
	const set = Math.floor(frame / 10);
	const u = (f % 10) / 9;
	const views: Array<{angle: Angle3; far: React.ReactNode; near: React.ReactNode; bg: string; light: Light3}> = [
		{angle: {at: [0, 40, 0], dist: 260, yaw: 25, pitch: 12, fov: 38, far: 4000, near: 1}, bg: SKY, light: BIG,
			far: <group><Town3D size={700} seed={2} clear={[{at: [0, 0], r: 70}]} /><Street8 len={140} skip={[57, 7]} /></group>,
			near: <group><Hero3D height={100} position={[0, 0, 0]} sit face="shocked" armL={[30, 20]} armR={[30, 20]} /><AnkleHouse at={[14, 0, 18]} /><Bed8 at={[0, 52, -14]} rot={[-1.4, 0, 0]} /><Bird3D kind="pigeon" at={[0, 84, 18]} frame={f} s={8} wing="fold" perch /></group>},
		{angle: {at: [0, 80, -40], dist: 118, yaw: 0, pitch: -40, fov: 52, far: 4000, near: 0.5}, bg: SKY, light: STREET,
			far: <group><Street8 len={140} /></group>,
			near: <group><Hero3D height={100} position={[0, 0, -40]} face="happy" lean={20} armR={[40, 60]} reachR={60} /><Hero3D position={[0, 0, 36]} turn={Math.PI} armR={[160, 10]} /></group>},
		{angle: {at: [0, 50, 0], dist: 300, yaw: 0, pitch: 4, fov: 36, far: 4000, near: 1}, bg: '#2A1E66', light: STUDIO,
			far: <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2000, 2000]} /><meshToonMaterial color="#3A2E80" /></mesh>,
			near: <group><BigBen3D at={[-40, 0, 0]} /><Hero3D height={100} position={[0, 0, 0]} face="happy" /><Redwood3D at={[40, 0, 0]} /><Ruler3D at={[-70, 0, 0]} /></group>},
		{angle: {at: [0, 5, 0], dist: 26, yaw: 0, pitch: 6, fov: 36}, bg: '#2A1E66', light: {...STUDIO, shadow: undefined, sun: {from: [6, 10, 8], color: '#FFFFFF', intensity: 2.4}},
			far: null,
			near: <Balance3D at={[0, 0, 0]} arm={6} h={8} tilt={0}>{[<Hero3D key="a" height={2.4} face="happy" />, <Eiffel3D key="b" at={[0, 0, 0]} h={6} />]}</Balance3D>},
		{angle: {at: [0, 6, 0], dist: 90, yaw: 30, pitch: 14, fov: 38, far: 4000, near: 0.5}, bg: 'linear-gradient(#3A4060, #8A90A8)', light: STREET,
			far: <group><Water8 at={[0, -1, 0]} frame={f} w={60} d={600} color="#7A6A4A" caps="#C8B898" />{[-1, 1].map((x) => <mesh key={x} position={[x * 330, -0.5, 0]}><boxGeometry args={[600, 1, 600]} /><meshToonMaterial color="#6CC25A" /></mesh>)}</group>,
			near: <group><Bridge3D at={[0, 0, 0]} yaw={0} crack={u} fall={u > 0.5 ? (u - 0.5) * 2 : 0} drop={u} /><Bus3D at={[0, 9.1, 0]} yaw={Math.PI / 2} /><Car3D at={[16, 9.1, 0]} yaw={Math.PI / 2} /></group>},
		{angle: {at: [0, 3, 0], dist: 16, yaw: 30, pitch: 6, fov: 38}, bg: '#2A1E66', light: {...STUDIO, shadow: undefined, sun: {from: [6, 10, 8], color: '#FFFFFF', intensity: 2.4}},
			far: null,
			near: <group><Giraffe3D at={[-3, 0, 0]} flow={u} frame={f} /><Elephant3D at={[3.5, 0, 0]} yaw={-0.5} flap={u} hot={u} /></group>},
		{angle: {at: [0, 6, 0], dist: 70, yaw: 20, pitch: 14, fov: 40, far: 3000, near: 0.5}, bg: SKY, light: STREET,
			far: <Fields3D size={400} />,
			near: <group><Church3D at={[-30, 0, -10]} /><Shops3D at={[10, 0, -20]} /><Pavilion3D at={[25, 0, 10]} /><Oak3D at={[-10, 0, 15]} /><Kite3D at={[-10, 15, 18]} frame={f} s={2} /><Cat8 at={[0, 0, 20]} s={3} /><Lorry3D at={[10, 0, 20]} yaw={0.5} /><Van3D at={[-20, 0, 20]} /><Washing3D at={[0, 0, 0]} blown={u} /><Helicopter3D at={[0, 25, 0]} frame={f} /><Drone3D at={[8, 10, 10]} frame={f} s={3} laser={u} /><Hill3D at={[60, 0, -40]} r={30} h={10} /></group>},
		{angle: {at: [0, 2, 0], dist: 40, yaw: 20, pitch: 20, fov: 40, far: 3000, near: 0.5}, bg: SKY, light: STREET,
			far: <Fields3D size={400} />,
			near: <group><PoliceTape3D at={[0, 0, 0]} r={14} posts={12} /><Bathtub3D at={[0, 0, 0]} /><PizzaPile at={[6, 0, -4]} n={200} r={3} /><Trays3D at={[-6, 0, -4]} /><Billboard3D at={[0, 6, -10]} /><Stadium3D at={[8, 0, 6]} frame={f} /><Goal8 at={[-8, 0, 6]} /></group>},
	];
	const v = views[Math.min(set, views.length - 1)];
	return <Shot3 frame={frame % 10} dur={10} lines={[]} cuts={[0]} angles={[v.angle]} light={v.light} bg={v.bg} far={v.far} near={v.near} blur={0} />;
};
