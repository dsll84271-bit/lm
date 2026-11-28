import {loadFont} from '@remotion/fonts';
import fredokaBold from './fonts/Fredoka-Bold.woff2';

// Fredoka in its heaviest weight (700), as the rulebook asks for on-screen text.
// The font file lives in brand/fonts so renders never depend on the internet.
export const FONT_FAMILY = 'Fredoka';

export const fontsReady = loadFont({
  family: FONT_FAMILY,
  url: fredokaBold,
  weight: '700',
});
