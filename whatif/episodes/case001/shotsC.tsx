/** Case File 001, paragraphs 31–45: Hume, bread and circuses, autumn 1969, and the verdict. */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed} from '../../docs-kit/case';
import {lerp} from '../../docs-kit/kit';
import {TV} from '../../docs-kit/tv';
import {Cutout, Highlighter, Ink, MarkerNote, Piece, Ransom, Tag, useBoil, useTwos, V} from '../../docs-kit/vox';
import {Board, Chapter, F, I, Pic, Sfx, Timeline} from './parts';
import type {ShotProps} from './timeline';

// 31 · the girl who grew up waiting for her father
export const S31: React.FC<ShotProps> = ({d}) => (
	<Board dark>
		<Pic src={I('tv_vietnam_1968')} d={d} from={1.1} to={1.28} ox={[60, 160]} oy={[0, -10]} dark={0.08} />
		<Tag id="s31t" text="Americans watching the war on TV, 1968" x={1240} y={990} rot={1} at={6} size={18} />
	</Board>
);

// 32 · one more piece of evidence
export const S32: React.FC<ShotProps> = () => <Chapter n={5} title="The philosopher" at={0} />;

// 33 · David Hume: "the easiness with which the many are governed by the few"
export const S33: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const q = 'The easiness with which the many are governed by the few.';
	const at = cue('easiness') - 4;
	const n = Math.max(0, Math.floor((f2 - at) * 1.6));
	return (
		<Board>
			<Cutout id="s33h" src={I('hume_engraving')} w={420} h={600} x={140} y={170} rot={-2.5} at={cue('david') - 6} pos="50% 30%" />
			<Tag id="s33t" text="David Hume, 1711–1776" x={180} y={800} rot={1.5} at={cue('david')} size={28} />
			<Tag id="s33s" text="Scottish philosopher" x={200} y={860} rot={-1} at={cue('scottish')} size={22} />
			<div style={{position: 'absolute', left: 760, top: 300, width: 1020, fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 84, lineHeight: 1.15, color: V.ink}}>
				{f2 >= at && '“'}
				{q.slice(0, n)}
				<span style={{opacity: 0}}>{q.slice(n)}</span>
				{n >= q.length && '”'}
			</div>
			<Highlighter x={1265} y={455} w={250} h={38} at={cue('many')} />
			<Highlighter x={1160} y={555} w={210} h={38} at={cue('few')} />
			<Sfx n="slap0" at={cue('david') - 6} />
			<Sfx n="slap1" at={cue('david')} />
			<Sfx n="type1" at={at} v={0.3} />
			<Sfx n="marker_s" at={cue('many')} />
			<Sfx n="marker_s" at={cue('few')} />
		</Board>
	);
};

/** Many small ink dots (the people) and a few yellow ones (the rulers). */
const Many: React.FC<{p: number; x?: number; y?: number; cols?: number; rows?: number}> = ({p, x = 160, y = 330, cols = 34, rows = 16}) => {
	const boil = useBoil('many');
	const few = [
		[cols / 2 - 2, -3],
		[cols / 2, -3.4],
		[cols / 2 + 2, -3],
	];
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: boil}}>
			{Array.from({length: cols * rows}).map((_, i) => {
				const c = i % cols,
					r = Math.floor(i / cols);
				const show = (i * 7919) % (cols * rows) < p * cols * rows;
				return show ? <div key={i} style={{position: 'absolute', left: c * 30, top: r * 30, width: 14, height: 14, borderRadius: 7, background: V.ink, opacity: 0.85}} /> : null;
			})}
			{few.map(([c, r], i) => (
				<div key={i} style={{position: 'absolute', left: c * 30 - 12, top: r * 30 - 12, width: 38, height: 38, borderRadius: 19, background: V.yellow, border: `4px solid ${V.ink}`}} />
			))}
		</div>
	);
};

// 34 · Hume's answer: belief. Collins: implicit submission, propaganda.
export const S34: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const p = lerp(f2, cue('millions'), cue('millions') + 30, 0, 1);
	return (
		<Board>
			<Many p={p} x={120} y={330} cols={30} rows={18} />
			<MarkerNote id="s34a" text="why do millions obey a few?" x={140} y={100} at={cue('why')} size={56} rot={-2} />
			<Ransom id="s34b" text="BELIEF" x={1140} y={200} size={140} rot={3} at={cue('belief')} />
			<Tag id="s34c" text="Implicit submission" x={1180} y={480} rot={-2} at={cue('implicit')} size={38} />
			<MarkerNote id="s34d" text={'propaganda:\ncontrol the story'} x={1150} y={620} at={cue('propaganda')} size={60} rot={-3} />
			<Sfx n="marker_l" at={cue('why')} />
			<Sfx n="slap1" at={cue('belief')} />
			<Sfx n="slap2" at={cue('implicit')} />
			<Sfx n="marker_l" at={cue('propaganda')} />
		</Board>
	);
};

// 35 · Panem: panem et circenses, bread and circuses
export const S35: React.FC<ShotProps> = ({d, cue}) => {
	const bread = cue('bread');
	return (
		<Board dark>
			<Pic src={I('colosseum_1903')} d={d} from={1.03} to={1.15} color />
			<Tag id="s35a" text="Rome: the Colosseum (postcard, 1903)" x={1240} y={1000} rot={1} at={4} size={18} />
			<MarkerNote id="s35b" text="panem et circenses" x={150} y={120} at={cue('roman')} size={70} rot={-3} color="#F1EDE4" />
			{useCurrentFrame() >= bread && <TV src={F('trailer_circus')} x={1220} y={470} w={860} rot={2} on={bread} grade="colour" />}
			<Ransom id="s35c" text="BREAD & CIRCUSES" x={110} y={760} size={110} rot={-2} at={bread} />
			<Sfx n="marker_l" at={cue('roman')} />
			<Sfx n="slap0" at={bread} />
		</Board>
	);
};

// 36 · the weeks before the lottery
export const S36: React.FC<ShotProps> = () => {
	const f2 = useTwos();
	return (
		<Board>
			<div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: 'Caslon', fontSize: 110, color: V.ink, opacity: lerp(f2, 0, 8, 0, 1)}}>Autumn, 1969</div>
			<Timeline active={-1} p={lerp(f2, 4, 40, 0, 1)} />
		</Board>
	);
};

/** Nixon's televised address: his real words, typed on the screen. */
const Address: React.FC<{at: number}> = ({at}) => {
	const f2 = useTwos();
	const q = '“…the great silent majority of my fellow Americans — I ask for your support.”';
	const n = Math.max(0, Math.floor((f2 - at) * 1.5));
	return (
		<AbsoluteFill style={{background: '#121416', padding: '40px 56px', color: '#ECE8DE'}}>
			<div style={{fontFamily: 'Elite', fontSize: 24, letterSpacing: 4, opacity: 0.8}}>PRESIDENTIAL ADDRESS · 3 NOV 1969</div>
			<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 42, lineHeight: 1.18, marginTop: 22}}>
				{q.slice(0, n)}
				<span style={{opacity: 0}}>{q.slice(n)}</span>
			</div>
			<div style={{fontFamily: 'Elite', fontSize: 20, letterSpacing: 2, marginTop: 24, opacity: 0.7}}>— PRESIDENT RICHARD NIXON</div>
		</AbsoluteFill>
	);
};

// 37 · November 3: Nixon asks the silent majority for support
export const S37: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TV x={960} y={340} w={880} rot={-1} on={0} grade="mono">
			<Address at={cue('great') - 30} />
		</TV>
		<Timeline active={0} />
		<Sfx n="type2" at={cue('great') - 30} v={0.3} />
	</Board>
);

// 38 · November 15: hundreds of thousands march on Washington
export const S38: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s38a" src={I('march_against_death_1969')} w={560} h={445} x={380} y={110} rot={-3} at={cue('marched') - 10} />
		<Cutout id="s38b" src={I('candles_whitehouse_1969')} w={620} h={414} x={1000} y={150} rot={2.5} at={cue('marched')} />
		<Tag id="s38c" text="Anti-war protests, autumn 1969" x={1080} y={600} rot={-1.5} at={cue('marched') + 6} size={22} />
		<MarkerNote id="s38d" text="one of the biggest in US history" x={420} y={600} at={cue('biggest')} size={46} rot={-2} />
		<Timeline active={1} />
		<Sfx n="slap0" at={cue('marched') - 10} />
		<Sfx n="slap1" at={cue('marched')} />
		<Sfx n="marker_l" at={cue('biggest')} />
	</Board>
);

// 39 · sixteen days later, the lottery on live TV
export const S39: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TV image={I('draft_lottery_1969')} x={960} y={340} w={800} rot={1} on={cue('lottery') - 8} grade="mono" />
		<Timeline active={2} />
		<Sfx n="whoosh" at={cue('lottery') - 10} v={0.35} />
	</Board>
);

// 40 · the many and the few: some stayed silent, some refused
export const S40: React.FC<ShotProps> = ({cue}) => {
	const boy = cue('boy');
	return (
		<Board>
			<Many p={1} x={120} y={360} cols={22} rows={16} />
			<MarkerNote id="s40a" text="some stayed silent" x={120} y={130} at={cue('silent')} size={54} rot={-2} />
			<MarkerNote id="s40b" text="some refused" x={600} y={250} at={cue('refused')} size={54} rot={2} />
			{useCurrentFrame() >= boy && <TV src={F('trailer_haymitch')} x={1360} y={460} w={860} rot={2} on={boy} grade="colour" />}
			<MarkerNote id="s40c" text="refuses to keep quiet" x={1100} y={860} at={cue('refuses')} size={56} rot={-3} />
			<Sfx n="marker_l" at={cue('silent')} />
			<Sfx n="marker_l" at={cue('refused')} />
			<Sfx n="whoosh" at={boy - 4} v={0.35} />
			<Sfx n="marker_l" at={cue('refuses')} />
		</Board>
	);
};

// 41 · so, let's look at the evidence
export const S41: React.FC<ShotProps> = () => (
	<Board>
		<Ransom id="s41" text="THE EVIDENCE" x={300} y={430} size={160} rot={-2} at={4} />
		<Sfx n="slap0" at={4} />
		<Sfx n="slap1" at={8} />
		<Sfx n="slap2" at={12} />
	</Board>
);

const Card: React.FC<{n: number; img: string; text: string; x: number; y: number; at: number; rot: number}> = ({n, img, text, x, y, at, rot}) => (
	<>
		<Cutout id={`ev${n}`} src={img} w={380} h={250} x={x} y={y} rot={rot} at={at} />
		<Tag id={`evt${n}`} text={text} x={x + 10} y={y + 285} rot={-rot / 2} at={at + 4} size={22} />
		<Ink id={`evk${n}`} d={`M ${x + 330} ${y + 40} L ${x + 360} ${y + 75} L ${x + 420} ${y - 10}`} at={at + 10} dur={5} width={10} len={160} />
	</>
);

// 42 · the evidence, item by item
export const S42: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Card n={1} img={I('draft_lottery_1969')} text="A real lottery, live on TV" x={110} y={120} at={cue('real')} rot={-2} />
		<Card n={2} img={I('lottery_drum_1972a')} text="It really was unfair" x={1000} y={120} at={cue('unfair')} rot={2} />
		<Card n={3} img="case001/map/vietnam_yellow.jpg" text="Her father served in that war" x={110} y={580} at={cue("author's")} rot={1.5} />
		<Card n={4} img={I('hume_engraving')} text="A philosopher's question" x={1000} y={580} at={cue('newest')} rot={-1.5} />
		<MarkerNote id="s42m" text="the very same weeks" x={620} y={480} at={cue('same')} size={54} rot={-2} />
		{['real', 'unfair', "author's", 'newest'].map((w) => (
			<React.Fragment key={w}>
				<Sfx n="slap1" at={cue(w)} />
				<Sfx n="marker_s" at={cue(w) + 10} />
			</React.Fragment>
		))}
	</Board>
);

// 43 · no real arena, no real tributes, but a real-world shadow
export const S43: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s43a" text="A real arena" x={300} y={250} rot={-2} at={cue('arena') - 6} size={56} />
		<Ink id="s43b" d="M 290 330 L 860 270" at={cue('arena')} dur={6} width={10} len={620} />
		<Tag id="s43c" text="Real tributes" x={1100} y={250} rot={2} at={cue('tributes') - 6} size={56} />
		<Ink id="s43d" d="M 1090 270 L 1700 335" at={cue('tributes')} dur={6} width={10} len={660} />
		<MarkerNote id="s43e" text={'everything else:\na real-world shadow'} x={420} y={560} at={cue('shadow') - 10} size={68} rot={-2} />
		<Sfx n="slap0" at={cue('arena') - 6} />
		<Sfx n="scribble" at={cue('arena')} />
		<Sfx n="slap1" at={cue('tributes') - 6} />
		<Sfx n="scribble" at={cue('tributes')} />
		<Sfx n="marker_l" at={cue('shadow') - 10} />
	</Board>
);

// 44–45 · the verdict, case closed, next case
export const S44: React.FC<ShotProps> = ({cue}) => {
	const eight = cue('eight');
	const closed = cue('case');
	const next = cue('christmas');
	return (
		<AbsoluteFill>
			<CaseClosed score={8} question="How real is Sunrise on the Reaping?" next="THE REAL SCROOGE" scoreAt={eight - 32} closedAt={closed} nextAt={next} sting={false} />
			<Sequence from={Math.max(0, closed - 120)} layout="none">
				<Audio src={staticFile('doc01/music/sting_outro.wav')} volume={0.55} />
			</Sequence>
		</AbsoluteFill>
	);
};
