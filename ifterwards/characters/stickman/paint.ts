// Paints the stickman's flat shapes onto a canvas.
// 3D scenes use this to put him on a flat card inside the set.

import type {Shape} from './rig';

/**
 * The square patch of "character space" a card shows, in rig units.
 * 560 units wide and tall, with his feet 40 units above the bottom edge.
 */
export const CARD = {size: 560, ground: 40} as const;

export const paintShapes = (
	ctx: CanvasRenderingContext2D,
	shapes: ReadonlyArray<Shape>,
	pixels: number,
) => {
	const s = pixels / CARD.size;
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, pixels, pixels);
	ctx.setTransform(s, 0, 0, s, pixels / 2, pixels - CARD.ground * s);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	for (const shape of shapes) {
		ctx.save();
		if (shape.clip) {
			ctx.clip(new Path2D(shape.clip));
		}

		ctx.globalAlpha = shape.opacity ?? 1;
		const path = new Path2D(shape.d);
		if (shape.fill) {
			ctx.fillStyle = shape.fill;
			ctx.fill(path);
		}

		if (shape.stroke && shape.strokeWidth) {
			ctx.strokeStyle = shape.stroke;
			ctx.lineWidth = shape.strokeWidth;
			ctx.stroke(path);
		}

		ctx.restore();
	}
};
