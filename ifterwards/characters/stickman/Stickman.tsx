import React, {useId} from 'react';
import {EXPRESSIONS, type ExpressionName} from './expressions';
import {POSES, type PoseName} from './poses';
import {
	buildStickman,
	HERO_LOOK,
	OTHER_LOOK,
	type Expression,
	type Pose,
	type Scarf,
	type SolvedPose,
} from './rig';

export type StickmanProps = {
	/** A pose by name, or a custom / blended pose. */
	pose?: PoseName | Pose | SolvedPose;
	/** An expression by name, or a custom / blended expression. */
	expression?: ExpressionName | Expression;
	/** 'hero' is the stickman. 'other' is everyone else (blue-grey head, no scarf). */
	who?: 'hero' | 'other';
	/** Where his feet stand, in the units of the SVG he is drawn in. */
	x?: number;
	y?: number;
	/** 1 = about 390 units tall. */
	scale?: number;
	/** Mirror him, to face or walk the other way. */
	flip?: boolean;
	/** Turn the face slightly: -1 screen left, 1 screen right. */
	turn?: number;
	/** 0 = eyes open, 1 = shut. */
	blink?: number;
	scarf?: Partial<Scarf>;
};

/**
 * The stickman, drawn as SVG. Put it inside an <svg>.
 * The same component draws the hero and every other person.
 */
export const Stickman: React.FC<StickmanProps> = ({
	pose = 'stand',
	expression = 'neutral',
	who = 'hero',
	x = 0,
	y = 0,
	scale = 1,
	flip = false,
	turn = 0,
	blink = 0,
	scarf,
}) => {
	// React's ids contain punctuation that SVG references cannot use.
	const id = `s${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
	const shapes = buildStickman({
		pose: typeof pose === 'string' ? POSES[pose] : pose,
		expression:
			typeof expression === 'string' ? EXPRESSIONS[expression] : expression,
		look: who === 'hero' ? HERO_LOOK : OTHER_LOOK,
		flip,
		turn,
		blink,
		scarf,
	});

	return (
		<g
			transform={`translate(${x} ${y}) scale(${scale})`}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<defs>
				{shapes.map((s, i) =>
					s.clip ? (
						<clipPath key={i} id={`${id}-clip-${i}`}>
							<path d={s.clip} />
						</clipPath>
					) : null,
				)}
			</defs>
			{shapes.map((s, i) => (
				<path
					key={i}
					d={s.d}
					fill={s.fill ?? 'none'}
					stroke={s.stroke ?? 'none'}
					strokeWidth={s.strokeWidth}
					opacity={s.opacity}
					clipPath={s.clip ? `url(#${id}-clip-${i})` : undefined}
				/>
			))}
		</g>
	);
};
