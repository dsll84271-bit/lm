import React from 'react';
import {AbsoluteFill, interpolate, spring, useVideoConfig} from 'remotion';
import {COLOURS} from '../brand/colours';
import {FONT_FAMILY} from '../brand/fonts';

// On-screen text. Rulebook: five words at most, cream, Fredoka at its
// heaviest, one number on screen at a time, never the narration word for word.

const base: React.CSSProperties = {
	fontFamily: FONT_FAMILY,
	fontWeight: 700,
	lineHeight: 1,
	letterSpacing: 2,
	// A dark edge, so cream text reads on any background.
	textShadow: '0 0 14px rgba(11,20,55,0.9), 0 6px 0 rgba(11,20,55,0.85)',
	WebkitTextStroke: '10px #0B1437',
	paintOrder: 'stroke fill',
};

/**
 * A short caption. `since` is frames since it should appear; give `until` to
 * make it leave. `number` is drawn in amber, `key` words in red.
 */
export const Caption: React.FC<{
	text?: string;
	number?: string;
	since: number;
	until?: number;
	where?: 'bottom' | 'top' | 'centre';
	size?: number;
	red?: boolean;
	/** Put the number after the words. */
	numberLast?: boolean;
}> = ({text, number, since, until, where = 'bottom', size = 96, red = false, numberLast = false}) => {
	const {fps} = useVideoConfig();
	if (since < 0 || (until !== undefined && since > until + 8)) {
		return null;
	}

	const pop = spring({frame: since, fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
	const out = until === undefined ? 0 : interpolate(since, [until, until + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: where === 'top' ? 'flex-start' : where === 'centre' ? 'center' : 'flex-end',
				padding: 90,
			}}
		>
			<div
				style={{
					...base,
					display: 'flex',
					alignItems: 'baseline',
					gap: 26,
					flexDirection: numberLast ? 'row-reverse' : 'row',
					fontSize: size,
					opacity: Math.min(1, since / 3) * (1 - out),
					transform: `translateY(${(1 - pop) * 40 + out * -20}px) scale(${0.85 + 0.15 * pop})`,
				}}
			>
				{number ? <span style={{color: COLOURS.amber, fontSize: size * 1.7}}>{number}</span> : null}
				{text ? <span style={{color: red ? COLOURS.red : COLOURS.cream}}>{text}</span> : null}
			</div>
		</AbsoluteFill>
	);
};

/** A counter in the top-right corner that ticks up. */
export const Counter: React.FC<{value: number; label?: string; since: number}> = ({value, label, since}) => {
	const {fps} = useVideoConfig();
	if (since < 0) {
		return null;
	}

	const pop = spring({frame: since, fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
	return (
		<AbsoluteFill style={{alignItems: 'flex-end', padding: 70}}>
			<div style={{...base, textAlign: 'right', transform: `scale(${0.7 + 0.3 * pop})`, transformOrigin: 'top right', opacity: Math.min(1, since / 3)}}>
				<div style={{color: COLOURS.amber, fontSize: 190}}>{value}</div>
				{label ? <div style={{color: COLOURS.cream, fontSize: 52, marginTop: 4}}>{label}</div> : null}
			</div>
		</AbsoluteFill>
	);
};
