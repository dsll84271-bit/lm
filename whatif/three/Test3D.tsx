import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CAST} from '../episodes/ep01/scenes/kit';
import {Hero3D} from './Hero3D';
import {Stage3D} from './Stage3D';
import {T} from './toon';

// A test of the 3D hero: a few expressions and poses in a simple room.
export const Test3D: React.FC = () => (
	<AbsoluteFill>
		<Stage3D
			cam={{pos: [0, 1.5, 6.2], at: [0, 1.0, 0], fov: 34}}
			bg="#1A1240"
			blur={0}
			light={{
				sky: '#B8A8FF',
				ground: '#3A2A6A',
				ambient: 1.4,
				sun: {from: [4, 7, 5], color: '#FFF1D6', intensity: 2.6},
				rim: {from: [-5, 4, -6], color: '#7FE0FF', intensity: 2.2},
			}}
			far={
				<group>
					<T shape={{kind: 'box', w: 16, h: 0.1, d: 10}} color="#5A3E6A" position={[0, -0.05, 0]} outline={0} />
					<T shape={{kind: 'box', w: 16, h: 6, d: 0.2}} color="#4B3AA8" position={[0, 3, -3]} outline={0} />
					<T shape={{kind: 'box', w: 1.6, h: 0.9, d: 0.6}} color="#8A5A3E" position={[3.2, 0.45, -1.8]} />
				</group>
			}
			near={
				<group>
					<Hero3D position={[-2.4, 0, 0]} face="smug" armR={[100, 160]} turn={0.3} />
					<Hero3D position={[-0.8, 0, 0.4]} face="shocked" armL={[150, 170]} armR={[150, 170]} />
					<Hero3D who={CAST.friend} position={[0.8, 0, 0]} face="happy" talk={0.6} walk={0.25} turn={-0.4} />
					<Hero3D who={CAST.kid} position={[2.3, 0, 0.3]} height={1.2} face="determined" walk={0.1} run turn={-0.8} />
				</group>
			}
		/>
	</AbsoluteFill>
);
