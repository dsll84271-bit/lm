import React, {useMemo} from 'react';
import * as THREE from 'three';
import {COLOURS} from '../brand/colours';
import {useDrawn} from './DepthLayers';

// Episode 1's signature: the ring, shown as thin arcs pulsing out of his ear.

export type RingPulseProps = {
	/** The ear, in metres. */
	position: [number, number, number];
	/** Seconds since the ring started. Negative = not started. */
	age: number;
	/** 1 = a normal ring. Raise it for the loud ones. */
	strength?: number;
	/** Which way the arcs open: 1 = screen right, -1 = screen left. */
	side?: 1 | -1;
};

const ARCS = 4;
const SPACING = 0.16; // seconds between one arc and the next
const LIFE = 1.15; // seconds an arc lives

const Arc: React.FC<{radius: number; width: number; opacity: number; side: 1 | -1}> = ({
	radius,
	width,
	opacity,
	side,
}) => {
	const geometry = useMemo(() => {
		// A 150-degree arc that opens away from the head, tilted slightly upwards.
		const span = (150 * Math.PI) / 180;
		const centre = side === 1 ? 0.2 : Math.PI - 0.2;
		return new THREE.RingGeometry(
			radius - width / 2,
			radius + width / 2,
			72,
			1,
			centre - span / 2,
			span,
		);
	}, [radius, width, side]);
	return (
		<mesh geometry={geometry} renderOrder={20}>
			<meshBasicMaterial
				color={COLOURS.red}
				transparent
				opacity={opacity}
				toneMapped={false}
				depthTest={false}
				depthWrite={false}
			/>
		</mesh>
	);
};

export const RingPulse: React.FC<RingPulseProps> = ({
	position,
	age,
	strength = 1,
	side = 1,
}) => {
	const drawn = useDrawn();
	if (!drawn || age < 0 || age > LIFE + ARCS * SPACING) {
		return null;
	}

	const arcs = [];
	for (let i = 0; i < ARCS; i++) {
		const t = (age - i * SPACING) / LIFE;
		if (t <= 0 || t >= 1) {
			continue;
		}

		const eased = 1 - (1 - t) ** 2.2;
		arcs.push(
			<Arc
				key={i}
				side={side}
				radius={0.07 + eased * 0.42 * strength}
				width={0.016 * (1 - 0.55 * t) * (0.8 + 0.2 * strength)}
				opacity={Math.min(1, t * 9) * (1 - t) ** 1.3}
			/>,
		);
	}

	// A small cream spark right at the ear, for the first fifth of a second.
	const spark = age < 0.22 ? 1 - age / 0.22 : 0;

	return (
		<group position={position}>
			{arcs}
			{spark > 0
				? [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].map((rot, i) => (
						<mesh key={i} rotation={[0, 0, rot]} renderOrder={21}>
							<planeGeometry
								args={[
									(i < 2 ? 0.17 : 0.1) * (1.3 - spark) * strength,
									0.012 * spark,
								]}
							/>
							<meshBasicMaterial
								color={COLOURS.cream}
								transparent
								opacity={spark}
								toneMapped={false}
								depthTest={false}
								depthWrite={false}
							/>
						</mesh>
					))
				: null}
		</group>
	);
};
