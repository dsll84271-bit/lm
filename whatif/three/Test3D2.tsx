import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAST} from '../episodes/ep01/scenes/kit';
import {Hero3D} from './Hero3D';
import {Fair3} from './sets3d';
import {C, Shot3, Thought, W} from './shot3';

export const Test3D2: React.FC = () => {
	const frame = useCurrentFrame();
	const crowd = [CAST.crowdA, CAST.crowdB, CAST.crowdC, CAST.friend, CAST.kid, CAST.driver];
	return (
		<Shot3
			frame={frame}
			dur={300}
			lines={[]}
			cuts={[0, 150]}
			angles={[W(0, 0, 9, 10, 10), C(0, 0, 10)]}
			bg="#F59A7A"
			light={{sky: '#FFD8B0', ground: '#4FB070', ambient: 1.3, sun: {from: [-6, 8, 6], color: '#FFE2B8', intensity: 2.4}, rim: {from: [6, 5, -8], color: '#FF8AD8', intensity: 2}, fog: {color: '#F5B08A', near: 12, far: 40}}}
			far={<Fair3 frame={frame} />}
			near={
				<group>
					<Hero3D position={[0, 0, 0]} face="determined" />
					{crowd.map((who, i) => (
						<Hero3D key={i} who={who} lite position={[-4 + i * 1.6, 0, -1.5 - (i % 2) * 1.2]} face="happy" walk={frame / 20 + i * 0.3} turn={i % 2 ? 1.2 : -1.2} />
					))}
				</group>
			}
			overlay={(cam) => <Thought cam={cam} head={[0, 1.9, 0]} text="I want mummy..." frame={frame} at={5} />}
		/>
	);
};
