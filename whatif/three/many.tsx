import React, {useMemo} from 'react';
import * as THREE from 'three';
import {INK, toonRamp} from './toon';

// Many copies of one cel-shaded shape in a single draw call (carpet fibres,
// grass, a crowd of ants), each with its own place, size, turn and colour,
// and the same ink outline as every other shape.

type V3 = [number, number, number];

export type Copy = {p: V3; s?: V3 | number; r?: V3; c?: string};

const tmp = new THREE.Object3D();

export const Many: React.FC<{
	/** Makes the shape; called once per `kind`. */
	geom: () => THREE.BufferGeometry;
	kind: string;
	items: Copy[];
	color?: string;
	/** Outline thickness in the shape's own units (0 for none). */
	outline?: number;
	glow?: boolean;
	opacity?: number;
	shadow?: boolean;
}> = ({geom, kind, items, color = '#ffffff', outline = 0.03, glow = false, opacity = 1, shadow = true}) => {
	const n = items.length;
	const {body, line, radius} = useMemo(() => {
		const g = geom();
		g.computeBoundingSphere();
		const mat = glow
			? new THREE.MeshBasicMaterial({color: '#ffffff', toneMapped: false, transparent: opacity < 1, opacity})
			: new THREE.MeshToonMaterial({color: '#ffffff', gradientMap: toonRamp(), transparent: opacity < 1, opacity});
		const b = new THREE.InstancedMesh(g, mat, Math.max(1, n));
		b.castShadow = shadow;
		b.receiveShadow = true;
		const l = outline > 0 ? new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({color: INK, side: THREE.BackSide}), Math.max(1, n)) : null;
		return {body: b, line: l, radius: Math.max(0.05, g.boundingSphere?.radius ?? 1)};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [kind, n, glow, outline > 0]);
	const col = useMemo(() => new THREE.Color(), []);
	const k = 1 + outline / radius;
	body.count = n;
	if (line) {
		line.count = n;
	}
	items.forEach((it, i) => {
		const s = it.s === undefined ? [1, 1, 1] : typeof it.s === 'number' ? [it.s, it.s, it.s] : it.s;
		tmp.position.set(...it.p);
		tmp.rotation.set(...(it.r ?? [0, 0, 0]));
		tmp.scale.set(s[0], s[1], s[2]);
		tmp.updateMatrix();
		body.setMatrixAt(i, tmp.matrix);
		body.setColorAt(i, col.set(it.c ?? color));
		if (line) {
			tmp.scale.set(s[0] * k, s[1] * k, s[2] * k);
			tmp.updateMatrix();
			line.setMatrixAt(i, tmp.matrix);
		}
	});
	body.instanceMatrix.needsUpdate = true;
	if (body.instanceColor) {
		body.instanceColor.needsUpdate = true;
	}
	if (line) {
		line.instanceMatrix.needsUpdate = true;
	}
	return (
		<group>
			<primitive object={body} />
			{line ? <primitive object={line} /> : null}
		</group>
	);
};

/** A repeatable random number in 0..1 for seed `i`. */
export const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
