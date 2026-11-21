// Renders several frames of one composition quickly (it bundles only once).
//   node tools/stills.mjs <composition> <out folder> <frame,frame,...> [scale]
// Set CHROME to a browser path if Remotion's own browser is not installed.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [id, outDir, frames, scale = '0.5'] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.CHROME || undefined;
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const f of frames.split(',')) {
	const output = path.join(outDir, `${id}-${String(f).padStart(5, '0')}.jpg`);
	await renderStill({
		composition,
		serveUrl,
		output,
		frame: Number(f),
		scale: Number(scale),
		imageFormat: 'jpeg',
		jpegQuality: 85,
		browserExecutable,
		timeoutInMilliseconds: 180000,
	});
	console.log(output);
}
