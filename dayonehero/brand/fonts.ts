import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fredoka Bold: a heavy rounded typeface, like the Day 4 labels. Free (OFL).
export const FONT = 'Fredoka';
export const fontsReady = loadFont({family: FONT, url: staticFile('fonts/Fredoka-Bold.woff2'), weight: '700'});
