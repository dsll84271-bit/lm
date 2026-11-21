import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Flyer, Sea3D} from './sky3d';
import {Ambergris3D, AcidPool3D, Beaks3D, Gut3D, GutFloor, Heart3D, Slime3D, Sphincter3D, Stink3D} from './inside3d';
import {Boat3D, Bubbles3D, Fish3D, Kayak3D, Krill3D, Squid3D, Torch3D, Underwater3D, UwCamera3D, Whale3D} from './ocean3d';
import {Hero3D} from './Hero3D';
import {Shot3, type Angle3} from './shot3';
import type {Light3} from './Stage3D';

// Checks the Episode 7 props: one test set every 10 frames.
const SEA: Light3 = {sky: '#BFF0FF', ground: '#103A60', ambient: 1.3, sun: {from: [4, 20, 6], color: '#E8FFFF', intensity: 2.4}, rim: {from: [-6, 4, -8], color: '#7FE0FF', intensity: 1.4}, fog: {color: '#1E78B0', near: 10, far: 110}};
const DAY: Light3 = {sky: '#CFE6FF', ground: '#5A7A9A', ambient: 1.3, sun: {from: [-8, 14, 9], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.4}};
const GUT: Light3 = {sky: '#7A3048', ground: '#2A0A18', ambient: 0.7, sun: {from: [2, 8, 4], color: '#FFB0C0', intensity: 0.5}, points: [{at: [0.6, 1.6, 1.5], color: '#FFF0D0', intensity: 9, distance: 12}, {at: [0, 3, -3], color: '#FF8AA0', intensity: 4, distance: 10}]};
const WATER = 'linear-gradient(#5FC8F0 0%, #1E78B0 45%, #0A2A5A 100%)';
const SKY = 'linear-gradient(#5AA8F0, #CFEFFF)';

export const TestSea: React.FC = () => {
	const frame = useCurrentFrame();
	const f = frame;
	const set = Math.floor(frame / 10);
	const u = (f % 10) / 9;
	const views: Array<{angle: Angle3; far: React.ReactNode; near: React.ReactNode; bg: string; light: Light3}> = [
		{angle: {at: [0, 0, 0], dist: 48, yaw: 80, pitch: 5, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={14} center={[0, 0, 0]} />, near: <Whale3D kind="blue" at={[0, 0, 0]} len={25} frame={f} />},
		{angle: {at: [0, -1, 9], dist: 14, yaw: 35, pitch: 8, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={14} center={[0, 0, 0]} />, near: <Whale3D kind="blue" at={[0, 0, 0]} len={25} frame={f} jaw={u} pouch={u} />},
		{angle: {at: [0, 0, 1], dist: 18, yaw: 60, pitch: 8, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={14} center={[0, 0, 0]} />, near: <Whale3D kind="humpback" at={[0, 0, 0]} len={15} frame={f} jaw={u * 0.5} />},
		{angle: {at: [0, 0, 0], dist: 20, yaw: 70, pitch: 6, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={14} center={[0, 0, 0]} />, near: <Whale3D kind="sperm" at={[0, 0, 0]} len={16} frame={f} />},
		{angle: {at: [0, -1, 6], dist: 10, yaw: 30, pitch: -4, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={14} center={[0, 0, 0]} />, near: <Whale3D kind="sperm" at={[0, 0, 0]} len={16} frame={f} jaw={u} />},
		{angle: {at: [0, 2.2, 0], dist: 4.2, yaw: 20, pitch: 6, fov: 36}, bg: SKY, light: DAY, far: <group><Sea3D frame={f} /><Boat3D at={[0, 0, 0]} frame={f} /></group>, near: <Hero3D position={[0, 1.0, -1.5]} scuba mask={u} face="happy" />},
		{angle: {at: [0, -6, 0], dist: 4.5, yaw: 60, pitch: 10, fov: 40}, bg: WATER, light: SEA, far: <Underwater3D frame={f} surface={0} center={[0, -6, 0]} />, near: <group><Flyer at={[0, -6, 0]} pitch={80} frame={f} pose="glide" scuba walk={f * 0.03} armL={[10, 10]} armR={[30, 60]} reachR={70} /><Bubbles3D at={[0, -5.4, 0.4]} frame={f} /><Fish3D at={[2, -6, -2]} frame={f} /></group>},
		{angle: {at: [0, 1.4, 0], dist: 5.2, yaw: 30, pitch: 10, fov: 44}, bg: '#1A0610', light: GUT, far: <group><Gut3D at={[0, 2.2, 0]} len={14} r={(t) => 1.2 + 2.6 * Math.pow(Math.sin(Math.PI * t), 0.7)} frame={f} beat={u} /><GutFloor frame={f} w={8} d={12} /><Beaks3D r={3} hole={[0, 1]} clear={0.8} /><Slime3D top={4.5} frame={f} /></group>, near: <group><Hero3D position={[0, 0, 1]} scuba armR={[20, 60]} reachR={70} face="scared" /><Torch3D at={[0.35, 0.95, 1.4]} rot={[0.3, 0.3, 0]} /></group>},
		{angle: {at: [0, 1.2, 0], dist: 6, yaw: 15, pitch: 14, fov: 44}, bg: '#1A0610', light: GUT, far: <group><Gut3D at={[0, 2.2, 0]} len={14} r={() => 3} frame={f} color="#D86A80" /><GutFloor frame={f} /><AcidPool3D at={[0, 0, -1.5]} frame={f} /><Sphincter3D at={[0, 1.6, -4.5]} open={u} /></group>, near: <Ambergris3D at={[1.6, 0.4, 0]} s={0.35} />},
		{angle: {at: [0, 1, 0], dist: 7, yaw: 10, pitch: 8, fov: 40}, bg: SKY, light: DAY, far: <Sea3D frame={f} />, near: <group><Squid3D at={[-2, 2, 0]} rot={[0, 0.8, 0]} len={3} frame={f} /><Krill3D at={[2.5, 2, -2]} frame={f} r={1.2} n={200} /><Heart3D at={[1.5, 1.5, 1]} s={0.8} /><Kayak3D at={[0, 0, 2]} rot={[0, 1.2, 0]} frame={f} /><UwCamera3D at={[-0.5, 1.4, 2]} rot={[0, 0.5, 0]} /><Ambergris3D at={[0.5, 1.4, 2.5]} s={0.25} /><Stink3D at={[0.5, 1.5, 2.5]} frame={f} /></group>},
	];
	const v = views[Math.min(set, views.length - 1)];
	return <Shot3 frame={frame % 10} dur={10} lines={[]} cuts={[0]} angles={[v.angle]} light={v.light} bg={v.bg} far={v.far} near={v.near} blur={0} />;
};
