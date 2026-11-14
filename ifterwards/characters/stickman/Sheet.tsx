import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOURS} from '../../brand/colours';
import {FONT_FAMILY} from '../../brand/fonts';
import {EXPRESSIONS, type ExpressionName} from './expressions';
import {POSES, walkCycle, type PoseName} from './poses';
import {getSkeleton, scarfForMotion} from './rig';
import {Stickman} from './Stickman';

// The model sheet: every expression and every pose on one still.
// Render it with:  npm run sheet

export const SHEET_WIDTH = 2400;
export const SHEET_HEIGHT = 2040;

const MARGIN = 80;
const GAP = 24;
const INNER = SHEET_WIDTH - MARGIN * 2;
const LIGHT = '#E9E2D2';

const EXPRESSION_ORDER: ExpressionName[] = [
	'neutral',
	'delighted',
	'shocked',
	'suspicious',
	'crushed',
];

const POSE_ORDER: Array<{pose: PoseName; label: string}> = [
	{pose: 'stand', label: 'STAND'},
	{pose: 'walk', label: 'WALK'},
	{pose: 'sit', label: 'SIT'},
	{pose: 'point', label: 'POINT'},
	{pose: 'slump', label: 'SLUMP'},
	{pose: 'handToEar', label: 'HAND TO EAR'},
];

const text = (size: number, fill: string = COLOURS.cream) => ({
	fontFamily: FONT_FAMILY,
	fontWeight: 700,
	fontSize: size,
	fill,
});

const Cell: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	label?: string;
	/** Height of the picture area. Below it is kept clear for the label. */
	pictureH?: number;
	fill?: string;
	labelFill?: string;
	children: React.ReactNode;
}> = ({x, y, w, h, label, pictureH, fill = '#111C47', labelFill, children}) => {
	const clip = `cell-${Math.round(x)}-${Math.round(y)}`;
	return (
		<g transform={`translate(${x} ${y})`}>
			<clipPath id={clip}>
				<rect width={w} height={pictureH ?? h} rx={28} />
			</clipPath>
			<rect width={w} height={h} rx={28} fill={fill} />
			<g clipPath={`url(#${clip})`}>{children}</g>
			{label ? (
				<text
					x={w / 2}
					y={h - 30}
					textAnchor="middle"
					letterSpacing={2}
					style={text(34, labelFill)}
				>
					{label}
				</text>
			) : null}
		</g>
	);
};

const Shadow: React.FC<{x: number; y: number; w: number; dark?: boolean}> = ({
	x,
	y,
	w,
	dark,
}) => (
	<ellipse
		cx={x}
		cy={y}
		rx={w}
		ry={w * 0.13}
		fill={dark ? '#0B1437' : '#050A22'}
		opacity={dark ? 0.16 : 0.55}
	/>
);

const SectionTitle: React.FC<{y: number; children: string}> = ({
	y,
	children,
}) => (
	<text x={MARGIN} y={y} letterSpacing={5} style={text(30, COLOURS.teal)}>
		{children}
	</text>
);

const Swatch: React.FC<{x: number; colour: string; name: string}> = ({
	x,
	colour,
	name,
}) => (
	<g transform={`translate(${x} 62)`}>
		<rect
			width={64}
			height={64}
			rx={16}
			fill={colour}
			stroke={COLOURS.cream}
			strokeOpacity={0.35}
			strokeWidth={3}
		/>
		<text x={80} y={30} style={text(26)}>
			{name}
		</text>
		<text x={80} y={60} style={text(22, COLOURS.blueGrey)}>
			{colour.toUpperCase()}
		</text>
	</g>
);

export const StickmanSheet: React.FC = () => {
	const exW = (INNER - GAP * 4) / 5;
	const exH = 480;
	const exY = 240;

	const poseW = (INNER - GAP * 5) / 6;
	const poseH = 560;
	const poseY = exY + exH + 96;

	const botY = poseY + poseH + 96;
	const botH = SHEET_HEIGHT - botY - 70;
	// (the bottom row is as tall as whatever space is left on the sheet)
	const botW = [900, 640, INNER - 900 - 640 - GAP * 2];
	const floor = botH - 96;

	// Where the stool goes in the "sit" cell: under his hips.
	const sit = getSkeleton(POSES.sit);

	return (
		<AbsoluteFill style={{backgroundColor: COLOURS.navy}}>
			<svg
				width={SHEET_WIDTH}
				height={SHEET_HEIGHT}
				viewBox={`0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}`}
			>
				<text x={MARGIN} y={112} style={text(84)}>
					THE STICKMAN
				</text>
				<text x={MARGIN + 660} y={112} style={text(34, COLOURS.amber)}>
					MODEL SHEET · RIG V1
				</text>
				<Swatch x={1380} colour={COLOURS.cream} name="Cream" />
				<Swatch x={1620} colour={COLOURS.navy} name="Navy" />
				<Swatch x={1860} colour={COLOURS.amber} name="Amber" />
				<Swatch x={2100} colour={COLOURS.blueGrey} name="Blue-grey" />

				<SectionTitle y={exY - 22}>EXPRESSIONS</SectionTitle>
				{EXPRESSION_ORDER.map((name, i) => (
					<Cell
						key={name}
						x={MARGIN + i * (exW + GAP)}
						y={exY}
						w={exW}
						h={exH}
						label={name.toUpperCase()}
						pictureH={exH - 84}
					>
						<Stickman
							expression={name}
							x={exW / 2 + 8}
							y={766}
							scale={1.8}
							pose={{
								...POSES.stand,
								headTilt: name === 'crushed' ? 5 : 0,
								nod: name === 'crushed' ? 0.5 : 0,
							}}
							scarf={{side: -1, phase: i}}
						/>
					</Cell>
				))}

				<SectionTitle y={poseY - 22}>POSES</SectionTitle>
				{POSE_ORDER.map(({pose, label}, i) => {
					const offset =
						pose === 'sit' ? -34 : pose === 'point' ? -32 : pose === 'slump' ? -18 : 0;
					const cx = poseW / 2 + offset;
					const ground = poseH - 96;
					return (
						<Cell
							key={pose}
							x={MARGIN + i * (poseW + GAP)}
							y={poseY}
							w={poseW}
							h={poseH}
							label={label}
						>
							<Shadow x={cx + (pose === 'sit' ? 30 : 0)} y={ground} w={pose === 'sit' ? 105 : 78} />
							{pose === 'sit' ? (
								<rect
									x={cx + sit.hip[0] - 46}
									y={ground + sit.hip[1] + 14}
									width={92}
									height={-sit.hip[1] - 14}
									rx={10}
									fill="#24305F"
									stroke={COLOURS.navy}
									strokeWidth={6}
								/>
							) : null}
							<Stickman
								pose={pose}
								expression={
									pose === 'slump'
										? 'crushed'
										: pose === 'point'
											? 'delighted'
											: pose === 'handToEar'
												? 'suspicious'
												: 'neutral'
								}
								x={cx}
								y={ground}
								turn={
									pose === 'walk' || pose === 'sit' || pose === 'point' ? 0.9 : 0
								}
								scarf={
									pose === 'walk'
										? scarfForMotion(150, 0.4)
										: {side: -1, phase: i * 1.7}
								}
							/>
						</Cell>
					);
				})}

				<SectionTitle y={botY - 22}>SCARF TRAILS WHEN HE MOVES</SectionTitle>
				<Cell x={MARGIN} y={botY} w={botW[0]} h={botH}>
					{[0.05, 0.3, 0.55].map((phase, i) => (
						<React.Fragment key={phase}>
							<Shadow x={170 + i * 290} y={floor} w={62} />
							<Stickman
								pose={walkCycle(phase)}
								x={170 + i * 290}
								y={floor}
								scale={0.8}
								turn={0.9}
								scarf={scarfForMotion(120 + i * 110, 0.3 + i * 0.21)}
							/>
						</React.Fragment>
					))}
					<text x={170} y={botH - 30} textAnchor="middle" style={text(26)}>
						SLOW
					</text>
					<text x={460} y={botH - 30} textAnchor="middle" style={text(26)}>
						WALKING
					</text>
					<text x={750} y={botH - 30} textAnchor="middle" style={text(26)}>
						HURRYING
					</text>
				</Cell>

				<text
					x={MARGIN + botW[0] + GAP}
					y={botY - 22}
					letterSpacing={5}
					style={text(30, COLOURS.teal)}
				>
					ON A LIGHT BACKGROUND
				</text>
				<Cell
					x={MARGIN + botW[0] + GAP}
					y={botY}
					w={botW[1]}
					h={botH}
					fill={LIGHT}
				>
					<Shadow x={190} y={floor} w={62} dark />
					<Stickman x={190} y={floor} scale={0.8} expression="delighted" />
					<Shadow x={450} y={floor} w={62} dark />
					<Stickman
						x={450}
						y={floor}
						scale={0.8}
						pose="handToEar"
						expression="shocked"
					/>
				</Cell>

				<text
					x={MARGIN + botW[0] + botW[1] + GAP * 2}
					y={botY - 22}
					letterSpacing={5}
					style={text(30, COLOURS.teal)}
				>
					OTHER PEOPLE
				</text>
				<Cell
					x={MARGIN + botW[0] + botW[1] + GAP * 2}
					y={botY}
					w={botW[2]}
					h={botH}
				>
					<Shadow x={200} y={floor} w={62} />
					<Stickman who="other" x={200} y={floor} scale={0.8} turn={0.5} />
					<Shadow x={480} y={floor} w={62} />
					<Stickman
						who="other"
						x={480}
						y={floor}
						scale={0.74}
						pose="point"
						expression="delighted"
						flip
						turn={0.6}
					/>
					<text
						x={botW[2] / 2}
						y={botH - 30}
						textAnchor="middle"
						style={text(26)}
					>
						SAME RIG · BLUE-GREY HEAD · NO SCARF
					</text>
				</Cell>
			</svg>
		</AbsoluteFill>
	);
};
