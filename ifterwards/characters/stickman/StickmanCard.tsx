import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useLayer, usePass, type Pass} from '../../components/DepthLayers';
import {CARD, paintShapes} from './paint';
import {buildStickman, type StickmanOptions} from './rig';

/** Metres per rig unit: the stickman stands about 1.64 m tall. */
export const UNIT = 0.0042;

export type StickmanCardProps = {
	/** Pose, expression, look and so on: the same options the 2D rig takes. */
	options: StickmanOptions;
	/** Where his feet stand in the set, in metres. */
	position: [number, number, number];
	/** 1 = normal height. */
	scale?: number;
	/** How sharp the drawing is. Raise it for extreme close-ups. */
	pixels?: number;
};

/**
 * A character inside a 3D set: the flat 2D rig, painted onto a card that
 * stands upright facing the camera. The card is unlit, so his colours stay
 * exactly on-model, but it still casts a shadow shaped like him.
 */
export const StickmanCard: React.FC<StickmanCardProps> = ({
	options,
	position,
	scale = 1,
	pixels = 1280,
}) => {
	const drawn = usePass() === useLayer();
	// Layers that only need his shadow can use a much smaller picture.
	const size = drawn ? pixels : 512;

	const {canvas, texture} = useMemo(() => {
		const c = document.createElement('canvas');
		c.width = size;
		c.height = size;
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 8;
		return {canvas: c, texture: t};
	}, [size]);

	const ctx = canvas.getContext('2d');
	if (ctx) {
		paintShapes(ctx, buildStickman(options), size);
		texture.needsUpdate = true;
	}

	const side = CARD.size * UNIT * scale;
	const lift = (CARD.size / 2 - CARD.ground) * UNIT * scale;

	return (
		<mesh
			position={[position[0], position[1] + lift, position[2]]}
			castShadow
			renderOrder={5}
		>
			<planeGeometry args={[side, side]} />
			{drawn ? (
				<meshBasicMaterial
					map={texture}
					transparent
					alphaTest={0.03}
					toneMapped={false}
					depthWrite={false}
					side={THREE.DoubleSide}
				/>
			) : (
				// Invisible, but the picture still decides the shape of his shadow.
				<meshBasicMaterial
					map={texture}
					alphaTest={0.5}
					colorWrite={false}
					depthWrite={false}
					side={THREE.DoubleSide}
				/>
			)}
		</mesh>
	);
};
