import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLOURS} from '../brand/colours';
import {FONT_FAMILY} from '../brand/fonts';
import paperFlip from '../sfx/paper-flip.wav';

// The day card: a calendar whose top page flips over to show a new label.
// It is the channel's signature, so the animation, the length and the sound
// are fixed here and are the same every time it appears.

/** How long the card is on screen: 2 seconds at 30 frames a second. */
export const DAY_CARD_FRAMES = 60;

// The moments of the animation, in frames.
const ARRIVE_END = 8; // the calendar has settled into place
const FLIP_START = 8; // the top page starts to lift (the sound starts here)
const FLIP_END = 27; // the top page has gone over the top
const LEAVE_START = 52; // the calendar starts to leave

const CARD_W = 640;
const HEADER_H = 150;
const PAGE_H = 520;
const RADIUS = 40;
const BORDER = 10;
const PAGE = '#17245C';
const PAGE_BACK = '#2A3A7A';

const splitLabel = (label: string) => {
	const match = label.trim().match(/^(.*?)\s*(\d+)$/);
	return match ? {word: match[1], number: match[2]} : {word: label, number: ''};
};

/** What is printed on a page: the word in cream, the number in amber. */
const PageFace: React.FC<{label?: string}> = ({label}) => {
	if (!label) {
		return null;
	}

	const {word, number} = splitLabel(label);
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT_FAMILY,
				fontWeight: 700,
				lineHeight: 1,
			}}
		>
			<div
				style={{
					color: COLOURS.cream,
					fontSize: number ? 118 : 150,
					letterSpacing: 8,
					marginTop: number ? 6 : 0,
				}}
			>
				{word}
			</div>
			{number ? (
				<div style={{color: COLOURS.amber, fontSize: 300, marginTop: -8}}>
					{number}
				</div>
			) : null}
		</div>
	);
};

const pageShape: React.CSSProperties = {
	position: 'absolute',
	left: 0,
	top: HEADER_H,
	width: CARD_W,
	height: PAGE_H,
	borderRadius: `0 0 ${RADIUS - BORDER}px ${RADIUS - BORDER}px`,
	overflow: 'hidden',
};

export type DayCardProps = {
	/** What the calendar flips to, for example "DAY 1" or "MONTH 3". */
	label: string;
	/** What the page on top says before it flips. Leave out for a blank page. */
	previous?: string;
	/** 0 to 1. Lower it if the flip is too loud against the music. */
	volume?: number;
};

export const DayCard: React.FC<DayCardProps> = ({
	label,
	previous,
	volume = 0.9,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// The calendar arrives, sits, and leaves.
	const arrive = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 170, mass: 0.7},
	});
	const leave = interpolate(frame, [LEAVE_START, DAY_CARD_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	// A slow push-in for the whole two seconds: the camera never sits still.
	const push = interpolate(frame, [0, DAY_CARD_FRAMES], [1, 1.07]);
	// A small kick as the page snaps over.
	const kick =
		spring({
			frame: frame - (FLIP_START + 9),
			fps,
			config: {damping: 9, stiffness: 260, mass: 0.5},
		}) - 1;
	const kickAmount = frame >= FLIP_START + 9 ? kick : 0;

	// The top page turns about its top edge: 0 = flat, 90 = edge on, 180 = over.
	const angle = interpolate(frame, [FLIP_START, FLIP_END], [0, 178], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.5, 0, 0.25, 1),
	});
	const showingBack = angle > 90;
	const flipping = angle > 0 && angle < 178;
	const pageOpacity = interpolate(angle, [118, 172], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const shade = Math.sin((Math.min(angle, 180) * Math.PI) / 180);
	// The shadow the lifting page throws on the page underneath.
	const castShadow = interpolate(angle, [0, 100], [0.55, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const cardScale = (0.82 + 0.18 * arrive) * push * (1 - 0.12 * leave);
	const cardY = (1 - arrive) * 90 + kickAmount * 16 - leave * 40;
	const opacity =
		interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'}) *
		(1 - leave);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLOURS.navy,
				backgroundImage:
					'radial-gradient(ellipse 70% 70% at 50% 46%, #1B2A6B 0%, #0B1437 68%)',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Sequence from={FLIP_START} layout="none">
				<Audio src={paperFlip} volume={volume} />
			</Sequence>

			<div
				style={{
					position: 'relative',
					width: CARD_W,
					height: HEADER_H + PAGE_H,
					opacity,
					transform: `translateY(${cardY}px) scale(${cardScale}) rotate(${
						-2.2 + kickAmount * 1.2
					}deg)`,
					perspective: 1500,
					perspectiveOrigin: '50% 30%',
				}}
			>
				{/* The pages still to come, peeking out underneath. */}
				{[2, 1].map((i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: i * 9,
							right: i * 9,
							bottom: -i * 15 - BORDER,
							height: 80,
							borderRadius: RADIUS,
							backgroundColor: i === 1 ? '#D9CFBA' : '#B5AC9B',
						}}
					/>
				))}

				{/* Soft shadow under the calendar. */}
				<div
					style={{
						position: 'absolute',
						left: 30,
						right: 30,
						bottom: -78,
						height: 60,
						borderRadius: '50%',
						backgroundColor: '#03061A',
						filter: 'blur(26px)',
						opacity: 0.75,
					}}
				/>

				{/* The cream frame. */}
				<div
					style={{
						position: 'absolute',
						inset: -BORDER,
						borderRadius: RADIUS,
						backgroundColor: COLOURS.cream,
					}}
				/>

				{/* The page underneath: the new label. */}
				<div style={{...pageShape, backgroundColor: PAGE}}>
					<PageFace label={label} />
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `linear-gradient(180deg, rgba(3,6,26,${castShadow}) 0%, rgba(3,6,26,${
								castShadow * 0.6
							}) 100%)`,
						}}
					/>
				</div>

				{/* The top page, which flips up and over. */}
				{angle < 178 ? (
					<div
						style={{
							...pageShape,
							backgroundColor: showingBack ? PAGE_BACK : PAGE,
							transformOrigin: '50% 0%',
							transform: `rotateX(${angle}deg)`,
							opacity: pageOpacity,
							boxShadow: flipping ? '0 0 0 3px rgba(11,20,55,0.55)' : 'none',
						}}
					>
						{showingBack ? null : <PageFace label={previous} />}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: showingBack
									? `linear-gradient(0deg, rgba(255,244,224,${
											0.16 * shade
										}) 0%, rgba(3,6,26,${0.35 * shade}) 100%)`
									: `linear-gradient(180deg, rgba(3,6,26,${
											0.1 * shade
										}) 0%, rgba(3,6,26,${0.6 * shade}) 100%)`,
							}}
						/>
					</div>
				) : null}

				{/* The red header, with the two rings the pages hang from. */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: CARD_W,
						height: HEADER_H,
						borderRadius: `${RADIUS - BORDER}px ${RADIUS - BORDER}px 0 0`,
						backgroundColor: COLOURS.red,
						boxShadow: 'inset 0 -14px 0 rgba(11,20,55,0.22)',
					}}
				/>
				{[0.27, 0.73].map((x) => (
					<React.Fragment key={x}>
						<div
							style={{
								position: 'absolute',
								left: CARD_W * x - 27,
								top: 58,
								width: 54,
								height: 54,
								borderRadius: '50%',
								backgroundColor: COLOURS.navy,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								left: CARD_W * x - 15,
								top: -52,
								width: 30,
								height: 142,
								borderRadius: 15,
								backgroundColor: COLOURS.cream,
								border: `7px solid ${COLOURS.navy}`,
								boxSizing: 'border-box',
							}}
						/>
					</React.Fragment>
				))}
			</div>
		</AbsoluteFill>
	);
};
