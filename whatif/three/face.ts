import type {HeroFace} from '../characters/Hero';

// Paints the hero's face (eyes, brows, mouth) onto a canvas, in the same
// coordinates as the 2D drawing (head centre at (0, -780), radius 190). The 3D
// head maps this canvas straight onto the front of its sphere.

export const FACE_SPAN = 190 * 1.27; // half-width of the canvas, in 2D units

const INK = '#140A28';

export type FaceState = {face: HeroFace; look: [number, number]; blink: number; talk: number; skin: string; glasses?: boolean; eyesOnly?: boolean};

export const drawFace = (ctx: CanvasRenderingContext2D, size: number, f: FaceState) => {
	ctx.clearRect(0, 0, size, size);
	ctx.save();
	const k = size / 2 / FACE_SPAN;
	ctx.translate(size / 2, size / 2);
	ctx.scale(k, k);
	ctx.translate(0, 780);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	const stroke = (d: string, w: number, color = INK) => {
		ctx.strokeStyle = color;
		ctx.lineWidth = w;
		ctx.stroke(new Path2D(d));
	};
	const fill = (d: string, color: string, outline = 0) => {
		const p = new Path2D(d);
		ctx.fillStyle = color;
		ctx.fill(p);
		if (outline) {
			ctx.strokeStyle = INK;
			ctx.lineWidth = outline;
			ctx.stroke(p);
		}
	};
	const ellipse = (cx: number, cy: number, rx: number, ry: number, color: string, outline = 0) => {
		ctx.beginPath();
		ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
		if (outline) {
			ctx.strokeStyle = INK;
			ctx.lineWidth = outline;
			ctx.stroke();
		}
	};
	const {face, look, blink, talk} = f;

	// cheeks
	ctx.globalAlpha = f.eyesOnly ? 0 : 0.35;
	ellipse(-92, -700, 34, 18, '#FF6A4A');
	ellipse(92, -700, 34, 18, '#FF6A4A');
	ctx.globalAlpha = 1;

	// brows
	const base = -836;
	const shapes: Record<HeroFace, [number, number, number, number]> = {
		neutral: [0, 0, 0, 0],
		smug: [6, -6, -22, -8],
		shocked: [-26, -22, -26, -22],
		determined: [22, -12, 22, -12],
		happy: [-14, -8, -14, -8],
		scared: [-28, -6, -28, -6],
		sad: [-20, 10, -20, 10],
	};
	const [li, lo, ri, ro] = shapes[face];
	if (!f.eyesOnly) stroke(`M-108 ${base + lo} Q-70 ${base + (lo + li) / 2 - 10} -32 ${base + li}`, 20);
	if (!f.eyesOnly) stroke(`M32 ${base + ri} Q70 ${base + (ro + ri) / 2 - 10} 108 ${base + ro}`, 20);

	// eyes
	if (face === 'happy') {
		stroke('M-98 -760 Q-64 -800 -30 -760', 16);
		stroke('M30 -760 Q64 -800 98 -760', 16);
	} else {
		const big = face === 'shocked' || face === 'scared';
		const rx = big ? 40 : 34;
		const ry = big ? 52 : 44;
		const pr = big ? 13 : 19;
		const lid0 = blink > 0 ? blink : face === 'smug' ? 0.45 : face === 'determined' ? 0.32 : face === 'sad' ? 0.3 : 0;
		for (const cx of [-64, 64]) {
			if (blink >= 0.85) {
				stroke(`M${cx - rx} ${-765} Q${cx} ${-765 + 22} ${cx + rx} ${-765}`, 10);
				continue;
			}
			const lid = face === 'smug' ? (cx < 0 ? 0.5 : 0.4) : lid0;
			ctx.save();
			ctx.beginPath();
			ctx.ellipse(cx, -765, rx, ry, 0, 0, Math.PI * 2);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.clip();
			ellipse(cx + look[0] * 12, -760 + look[1] * 10, pr, pr * 1.25, INK);
			ellipse(cx + look[0] * 12 + pr * 0.45, -760 + look[1] * 10 - pr * 0.55, pr * 0.38, pr * 0.38, '#fff');
			if (lid > 0) {
				const lidY = -765 - ry + ry * 2 * lid;
				const slope = face === 'determined' ? (cx < 0 ? 10 : -10) : face === 'sad' ? (cx < 0 ? -10 : 10) : 0;
				fill(`M${cx - rx - 10} ${-765 - ry - 10} L${cx + rx + 10} ${-765 - ry - 10} L${cx + rx + 10} ${lidY - slope} Q${cx} ${lidY + 10} ${cx - rx - 10} ${lidY + slope} Z`, f.skin);
				stroke(`M${cx - rx - 10} ${lidY + slope} Q${cx} ${lidY + 10} ${cx + rx + 10} ${lidY - slope}`, 9);
			}
			ctx.restore();
			ctx.beginPath();
			ctx.ellipse(cx, -765, rx, ry, 0, 0, Math.PI * 2);
			ctx.strokeStyle = INK;
			ctx.lineWidth = 7;
			ctx.stroke();
		}
	}

	// mouth
	const y = -660;
	if (f.eyesOnly) {
		// an invisible face: only the eyes show
	} else if (talk > 0.05 && face !== 'happy' && face !== 'shocked') {
		ellipse(0, -655, 30, 8 + 26 * talk, '#5A1A2A', 8);
	} else if (face === 'smug') {
		stroke(`M-40 ${y} Q10 ${y + 18} 52 ${y - 14}`, 13);
	} else if (face === 'shocked') {
		ellipse(0, y + 6, 30, 40, '#5A1A2A', 8);
		ellipse(0, y + 30, 18, 10, '#F27A8A');
	} else if (face === 'determined') {
		stroke(`M-40 ${y + 4} Q0 ${y - 6} 40 ${y + 4}`, 13);
	} else if (face === 'happy') {
		fill(`M-60 ${y - 16} Q0 ${y - 22} 60 ${y - 16} Q50 ${y + 50} 0 ${y + 52} Q-50 ${y + 50} -60 ${y - 16} Z`, '#5A1A2A', 8);
		fill(`M-50 ${y - 14} Q0 ${y - 4} 50 ${y - 14} L48 ${y - 2} Q0 ${y + 8} -48 ${y - 2} Z`, '#fff');
		ellipse(0, y + 34, 26, 12, '#F27A8A');
	} else if (face === 'scared') {
		stroke(`M-44 ${y + 4} Q-30 ${y - 10} -14 ${y + 4} Q0 ${y + 16} 14 ${y + 4} Q30 ${y - 10} 44 ${y + 4}`, 12);
	} else if (face === 'sad') {
		stroke(`M-40 ${y + 10} Q0 ${y - 16} 40 ${y + 10}`, 13);
	} else {
		stroke(`M-30 ${y} Q0 ${y + 10} 30 ${y}`, 12);
	}
	if (face === 'scared' && !f.eyesOnly) {
		fill('M160 -880 Q182 -840 166 -820 Q146 -840 160 -880 Z', '#9FD6F5', 6);
	}
	if (f.glasses) {
		ctx.strokeStyle = INK;
		ctx.lineWidth = 9;
		for (const cx of [-64, 64]) {
			ctx.beginPath();
			ctx.arc(cx, -765, 56, 0, Math.PI * 2);
			ctx.stroke();
		}
	}
	ctx.restore();
};
