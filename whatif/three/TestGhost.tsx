import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hero3D} from './Hero3D';
import {Room3, ROOM3, Shelf3, Plant3} from './sets3d';
import {Shot3, W, C} from './shot3';

// Checks the invisible-hero look: normal, half-faded, invisible, and a close-up.
export const TestGhost: React.FC = () => {
	const frame = useCurrentFrame();
	const close = frame >= 50;
	return (
		<Shot3
			frame={frame % 50}
			dur={50}
			lines={[]}
			cuts={[0]}
			angles={[close ? C(0.9, -1.2, -15) : W(0, -1.2, 6.5, 0, 10)]}
			light={{sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.4, sun: {from: [-5, 9, 5], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.4}}}
			bg="#2A1E50"
			far={
				<Room3 look={ROOM3.bedroom} window={{x: -0.4}}>
					<Shelf3 at={[-4, 2, -4.3]} />
					<Plant3 at={[4.6, 0, -3.6]} />
				</Room3>
			}
			near={
				<group>
					<Hero3D position={[-2.2, 0, -1.2]} face="happy" />
					<Hero3D position={[-0.6, 0, -1.2]} face="neutral" ghost={0.45} />
					<Hero3D position={[0.9, 0, -1.2]} face="shocked" ghost={1} armL={[120, 207]} />
					<Hero3D position={[2.4, 0, -1.2]} face="determined" ghost={0.75} />
				</group>
			}
		/>
	);
};
