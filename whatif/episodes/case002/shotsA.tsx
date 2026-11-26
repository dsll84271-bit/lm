/** Case File 002, paragraphs 1–16: the hook, the case file, Scrooge, and John Elwes. */
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {CaseIntro} from '../../docs-kit/case';
import {lerp} from '../../docs-kit/kit';
import {Cutout, Ink, InkX, MarkerNote, Piece, Ransom, Tag, TitleCard, useTwos, V} from '../../docs-kit/vox';
import {Board, Candle, Chapter, I, Quote, Sfx, Snow} from './parts';
import type {ShotProps} from './timeline';

const Card: React.FC<{text: string; x: number; y: number; at: number; id: string; rot: number; n: number}> = ({text, x, y, at, id, rot, n}) => (
	<Piece id={id} x={x} y={y} rot={rot} at={at}>
		<div style={{width: 500, minHeight: 300, background: '#FBF7EC', padding: '28px 30px', boxShadow: '6px 9px 16px rgba(29,28,32,.32)', borderTop: `14px solid ${V.yellow}`}}>
			<div style={{fontFamily: 'Elite', fontSize: 22, letterSpacing: 3, color: '#6b6660'}}>EXHIBIT {n}</div>
			<div style={{fontFamily: 'Caslon', fontSize: 46, lineHeight: 1.12, color: V.ink, marginTop: 14}}>{text}</div>
		</div>
	</Piece>
);

// 1 · Johnny Depp is Scrooge right now: the meanest man in fiction
export const S01: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s1a" text="Now in cinemas · Ebenezer (2026)" x={150} y={120} rot={-2} at={2} size={34} />
		<Cutout id="s1b" src={I('marley_plate')} w={620} h={760} x={1120} y={150} rot={2.5} at={cue('meanest') - 4} pos="50% 55%" />
		<Tag id="s1c" text="Scrooge, as first drawn in 1843" x={1170} y={940} rot={-1} at={cue('meanest') + 4} size={22} />
		<Ransom id="s1d" text="MEANEST" x={140} y={330} size={130} rot={-3} at={cue('meanest')} />
		<MarkerNote id="s1e" text={'would rather sit\nin the dark than\npay for a candle'} x={160} y={600} at={cue('dark') - 6} size={56} rot={-2} />
		<Candle x={900} y={980} at={cue('candle') - 8} outAt={cue('candle') + 26} id="s1f" />
		<Sfx n="slap0" at={2} />
		<Sfx n="slap1" at={cue('meanest') - 4} />
		<Sfx n="slap2" at={cue('meanest')} />
		<Sfx n="marker_l" at={cue('dark') - 6} />
	</Board>
);

// 2 · Scrooge was made up. The men behind him weren't. They were even worse.
export const S02: React.FC<ShotProps> = ({cue}) => {
	const men = cue('men');
	return (
		<Board>
			<Cutout id="s2a" src={I('marley_plate')} w={420} h={520} x={130} y={260} rot={-3} at={0} pos="20% 60%" />
			<Tag id="s2b" text="Made up" x={170} y={820} rot={2} at={cue('made')} size={40} />
			<InkX x={340} y={520} at={cue('made') + 4} id="s2x" />
			<Cutout id="s2c" src={I('elwes_b')} w={280} h={400} x={720} y={170} rot={2} at={men} pos="50% 30%" />
			<Cutout id="s2d" src={I('dancer')} w={280} h={400} x={1060} y={200} rot={-2} at={men + 4} pos="50% 30%" />
			<Cutout id="s2e" src={I('wood_painting')} w={280} h={400} x={1400} y={170} rot={3} at={men + 8} pos="50% 60%" />
			<Ransom id="s2f" text="EVEN WORSE" x={760} y={700} size={130} rot={-2} at={cue('worse') - 10} />
			<Sfx n="slap0" at={0} />
			<Sfx n="scribble" at={cue('made') + 4} />
			<Sfx n="slap1" at={men} />
			<Sfx n="slap2" at={men + 4} />
			<Sfx n="slap0" at={men + 8} />
			<Sfx n="slap1" at={cue('worse') - 10} />
		</Board>
	);
};

// 3 · the moorhen, the wig, the servant
export const S03: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Card n={1} text="Ate a bird a rat had dragged out of a river" x={110} y={330} at={cue('ate')} id="s3a" rot={-2.5} />
		<Card n={2} text="Wore a wig he found lying in the road" x={700} y={370} at={cue('wore')} id="s3b" rot={1.5} />
		<Card n={3} text="His servant was found dead in his house" x={1290} y={330} at={cue('servant')} id="s3c" rot={-1.5} />
		<Ransom id="s3d" text="2 DAYS" x={1380} y={760} size={110} rot={4} at={cue('two')} />
		<Sfx n="slap0" at={cue('ate')} />
		<Sfx n="slap1" at={cue('wore')} />
		<Sfx n="slap2" at={cue('servant')} />
		<Sfx n="slap0" at={cue('two')} />
	</Board>
);

const Q: React.FC<{n: number; text: string; img: string; x: number; at: number; rot: number; pos?: string}> = ({n, text, img, x, at, rot, pos}) => (
	<>
		<Cutout id={`q${n}`} src={img} w={480} h={340} x={x} y={300} rot={rot} at={at} pos={pos} />
		<Tag id={`qt${n}`} text={`${n}. ${text}`} x={x + 20} y={700} rot={-rot / 2} at={at + 6} size={28} />
	</>
);

// 4 · what you'll know by the end of this file
export const S04: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const head = 'The case of the real Scrooge.';
	const n = Math.max(0, Math.floor((f2 - 4) * 1.1));
	return (
		<Board>
			<div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: 'Caslon', fontSize: 88, color: V.ink}}>
				{head.slice(0, n)}
				<span style={{opacity: 0}}>{head.slice(n)}</span>
			</div>
			<Q n={1} text="The real Scrooges" img={I('elwes_1801')} x={130} at={cue('real')} rot={-3} pos="50% 35%" />
			<Q n={2} text="The gravestone" img={I('last_spirit_1843')} x={720} at={cue('gravestone')} rot={2} pos="50% 60%" />
			<Q n={3} text="The true villain" img="case002/img/trapper_1842.png" x={1310} at={cue('villain')} rot={-2} />
			<Sfx n="type0" at={4} v={0.3} />
			<Sfx n="slap0" at={cue('real')} />
			<Sfx n="slap1" at={cue('gravestone')} />
			<Sfx n="slap2" at={cue('villain')} />
		</Board>
	);
};

// 5 · welcome to the Fiction Files → case file 002
export const S05: React.FC<ShotProps> = ({d, cue}) => {
	const f2 = useTwos();
	const start = Math.max(0, Math.min(cue('case') - 26, d - 150));
	const line = 'Every story is built on something real.';
	const n = Math.max(0, Math.floor((f2 - cue('every')) * 1.4));
	return (
		<AbsoluteFill style={{background: '#0B0F14'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: lerp(f2, 0, 10, 0, 1)}}>
				<div style={{fontFamily: 'Bebas', fontSize: 150, letterSpacing: 40, color: '#E9D6A8'}}>FICTION FILES</div>
				<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 52, color: '#C9D3DE', marginTop: 10}}>
					{line.slice(0, n)}
					<span style={{opacity: 0}}>{line.slice(n)}</span>
				</div>
			</div>
			<Snow n={60} opacity={0.5} />
			<Sequence from={start} layout="none">
				<CaseIntro caseNo={2} title="THE REAL SCROOGE" photo="case002/img/marley_plate.jpg" stingVol={0.45} />
			</Sequence>
		</AbsoluteFill>
	);
};

const WORDS = ['squeezing', 'wrenching', 'grasping', 'scraping', 'clutching', 'covetous'];

// 6 · first, the fiction: 1843, a squeezing, wrenching, grasping… old sinner
export const S06: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	const in43 = cue('in');
	if (frame < in43) return <Chapter n={1} title="The fiction" at={0} />;
	return (
		<Board>
			<TitleCard fig={1} title="A Christmas Carol" sub="Charles Dickens, London, 1843" at={in43} />
			<Cutout id="s6c" src={I('dickens_1867')} w={360} h={500} x={1460} y={90} rot={2} at={cue('charles')} pos="50% 30%" />
			{WORDS.map((w, i) => (
				<Tag key={w} id={`s6w${i}`} text={w} x={160 + (i % 3) * 400} y={520 + Math.floor(i / 3) * 120} rot={((i * 37) % 6) - 3} at={cue(w)} size={44} />
			))}
			<Ransom id="s6s" text="OLD SINNER" x={420} y={800} size={110} rot={-2} at={cue('sinner') - 6} />
			<Sfx n="slap0" at={in43} />
			<Sfx n="slap1" at={cue('charles')} />
			{WORDS.map((w, i) => (
				<Sfx key={w} n={`slap${i % 3}`} at={cue(w)} v={0.35} />
			))}
			<Sfx n="slap2" at={cue('sinner') - 6} />
		</Board>
	);
};

// 7 · counting money, Bob Cratchit's one coal, "decrease the surplus population"
export const S07: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s7a" src={I('scrooge_cratchit_1843')} w={560} h={710} x={120} y={170} rot={-2} at={2} />
		<Tag id="s7b" text="Scrooge and Bob Cratchit · John Leech, 1843" x={140} y={910} rot={1} at={6} size={20} />
		<MarkerNote id="s7c" text="a fire like one coal" x={820} y={170} at={cue('coal') - 6} size={58} rot={-3} />
		<Quote id="s7d" text="If they would rather die, they had better do it, and decrease the surplus population." source="Scrooge, A Christmas Carol" x={780} y={380} w={1000} size={50} at={cue('asked') - 4} cps={2.2} />
		<Highlighter2 at={cue('surplus')} />
		<Sfx n="slap0" at={2} />
		<Sfx n="marker_l" at={cue('coal') - 6} />
		<Sfx n="slap1" at={cue('asked') - 4} />
		<Sfx n="type1" at={cue('asked')} v={0.3} />
	</Board>
);
const Highlighter2: React.FC<{at: number}> = ({at}) => {
	const f2 = useTwos();
	if (f2 < at) return null;
	const p = Math.min(1, (f2 - at) / 10);
	return <div style={{position: 'absolute', left: 830, top: 545, width: 560 * p, height: 40, background: V.yellow, mixBlendMode: 'multiply', opacity: 0.85, transform: 'rotate(-1.5deg)'}} />;
};

// 8 · three ghosts: past, present, future
export const S08: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s8a" src={I('fezziwig_1843')} w={460} h={600} x={130} y={200} rot={-3} at={cue('past')} />
		<Cutout id="s8b" src={I('third_plate')} w={460} h={600} x={730} y={160} rot={1.5} at={cue('present')} pos="50% 45%" />
		<Cutout id="s8c" src={I('last_spirit_1843')} w={460} h={600} x={1330} y={200} rot={-1.5} at={cue('future')} />
		<Tag id="s8d" text="Past" x={180} y={860} rot={-2} at={cue('past') + 4} size={40} />
		<Tag id="s8e" text="Present" x={780} y={820} rot={2} at={cue('present') + 4} size={40} />
		<Tag id="s8f" text="Future" x={1380} y={860} rot={-2} at={cue('future') + 4} size={40} />
		<MarkerNote id="s8g" text="…and Scrooge changes." x={700} y={60} at={cue('changes') - 6} size={60} rot={-2} />
		<Sfx n="slap0" at={cue('past')} />
		<Sfx n="slap1" at={cue('present')} />
		<Sfx n="slap2" at={cue('future')} />
		<Sfx n="marker_l" at={cue('changes') - 6} />
	</Board>
);

// 9 · Dickens never said who Scrooge was based on: the suspects
export const S09: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s9a" src={I('dickens_1867')} w={400} h={560} x={140} y={200} rot={-2} at={2} pos="50% 30%" />
		<Tag id="s9b" text="Dickens never named his model" x={150} y={820} rot={1.5} at={cue('never')} size={26} />
		{[0, 1, 2].map((i) => (
			<Piece key={i} id={`s9s${i}`} x={720 + i * 380} y={260 + (i % 2) * 40} rot={[-3, 2, -1.5][i]} at={cue('suspects') + i * 4}>
				<div style={{width: 320, height: 420, background: '#2A292D', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 9px 16px rgba(29,28,32,.35)', border: '10px solid #fff'}}>
					<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 220, color: '#F1EDE4'}}>?</div>
				</div>
			</Piece>
		))}
		<MarkerNote id="s9c" text="…one sat in Parliament" x={800} y={820} at={cue('parliament') - 6} size={56} rot={-2} />
		<Sfx n="slap0" at={2} />
		<Sfx n="slap1" at={cue('suspects')} />
		<Sfx n="slap2" at={cue('suspects') + 4} />
		<Sfx n="slap0" at={cue('suspects') + 8} />
		<Sfx n="marker_l" at={cue('parliament') - 6} />
	</Board>
);

// 10 · John Elwes, his miser uncle, and going to bed to save candle-light
export const S10: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Ransom id="s10r" text="SUSPECT No. 1" x={1060} y={70} size={70} rot={2} at={0} />
		<Cutout id="s10a" src={I('elwes_1801')} w={440} h={580} x={120} y={260} rot={-2} at={cue('elwes')} pos="50% 40%" />
		<TitleCard fig={2} title="John Elwes" sub="Born 1714 · MP · miser" at={cue('elwes') + 4} />
		<MarkerNote id="s10b" text="one stick on the fire, one glass of wine" x={680} y={420} at={cue('stick') - 4} size={46} rot={-2} />
		<Candle x={1500} y={1000} at={cue('dark') - 10} outAt={cue('bed') + 4} id="s10c" />
		<Quote id="s10d" text="going to bed saved candle-light" source="Topham, Life of John Elwes, 1790" x={680} y={620} w={760} size={52} at={cue('saved') - 8} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('elwes')} />
		<Sfx n="marker_l" at={cue('stick') - 4} />
		<Sfx n="slap2" at={cue('saved') - 8} />
	</Board>
);

// 11 · MP for Berkshire, worth nearly £800,000
export const S11: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s11a" src={I('elwes_b')} w={420} h={620} x={140} y={200} rot={-2.5} at={0} pos="50% 30%" />
		<Tag id="s11b" text="MP for Berkshire, 1772–1784" x={720} y={170} rot={-2} at={cue('member')} size={34} />
		<Ransom id="s11c" text="£800,000" x={720} y={360} size={150} rot={-2} at={cue('eight')} />
		<MarkerNote id="s11d" text="today: well over £100 million" x={760} y={640} at={cue("today's") - 4} size={56} rot={-3} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('member')} />
		<Sfx n="slap2" at={cue('eight')} />
		<Sfx n="marker_l" at={cue("today's") - 4} />
	</Board>
);

// 12 · his friend Edward Topham wrote it all down
export const S12: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s12a" x={560} y={170} rot={-2} at={cue('topham') - 6}>
			<div style={{width: 760, background: '#E9DFC6', border: `3px double ${V.ink}`, padding: '46px 40px', textAlign: 'center', boxShadow: '6px 9px 16px rgba(29,28,32,.35)', color: V.ink}}>
				<div style={{fontFamily: 'Caslon', fontSize: 30, letterSpacing: 6}}>THE</div>
				<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 84, lineHeight: 1}}>LIFE</div>
				<div style={{fontFamily: 'Caslon', fontSize: 30, letterSpacing: 6, marginTop: 6}}>OF THE LATE</div>
				<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 64, marginTop: 6}}>JOHN ELWES, ESQUIRE</div>
				<div style={{height: 2, background: V.ink, margin: '24px 120px'}} />
				<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 34}}>by Edward Topham · 1790</div>
			</div>
		</Piece>
		<MarkerNote id="s12b" text="he knew him personally" x={640} y={820} at={cue('friend')} size={56} rot={-2} />
		<Sfx n="slap0" at={cue('topham') - 6} />
		<Sfx n="marker_l" at={cue('friend')} />
	</Board>
);

const Tick: React.FC<{label: string; at: number; y: number; id: string}> = ({label, at, y, id}) => (
	<>
		<Ink id={`${id}k`} d={`M 300 ${y + 34} L 328 ${y + 64} L 380 ${y + 6}`} at={at} dur={5} width={8} len={120} />
		<MarkerNote id={id} text={label} x={420} y={y} at={at + 2} size={52} rot={0} />
	</>
);

// 13 · rain, wet clothes, rotting food
export const S13: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s13t" text="How the richest MP lived" x={300} y={120} rot={-2} at={0} size={36} />
		<Cutout id="s13c" src={I('elwes_b')} w={320} h={500} x={1560} y={360} rot={3} at={4} pos="50% 25%" />
		<Tick id="t1" label="walked home in the rain, not a coach" at={cue('walk')} y={260} />
		<Tick id="t2" label="sat in wet clothes, not by a fire" at={cue('sit')} y={420} />
		<Tick id="t3" label="ate rotting food, not fresh meat" at={cue('ate')} y={580} />
		<Sfx n="slap0" at={0} />
		<Sfx n="marker_l" at={cue('walk')} />
		<Sfx n="marker_l" at={cue('sit')} />
		<Sfx n="marker_l" at={cue('ate')} />
	</Board>
);

// 14 · the moorhen a rat dragged from the river; the fish inside a fish
export const S14: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Quote id="s14a" text="He dined upon the remaining part of a moor-hen, which had been brought out of the river by a rat!" source="Edward Topham, 1790" x={180} y={140} w={1300} size={62} at={cue('moorhen') - 20} />
		<Ransom id="s14b" text="A RAT" x={1320} y={560} size={130} rot={5} at={cue('rat')} />
		<MarkerNote id="s14c" text={'and once, a fish found\nhalf-digested inside a bigger fish'} x={260} y={720} at={cue('fish') - 6} size={52} rot={-2} />
		<Sfx n="slap0" at={cue('moorhen') - 20} />
		<Sfx n="type2" at={cue('moorhen') - 16} v={0.3} />
		<Sfx n="slap1" at={cue('rat')} />
		<Sfx n="marker_l" at={cue('fish') - 6} />
	</Board>
);

// 15 · the beggar's wig from a rut in a lane
export const S15: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Quote id="s15a" text="he wore a wig for above a fortnight, which I saw him pick up out of a rut in a lane" source="Edward Topham, 1790" x={160} y={140} w={1150} size={58} at={cue('wig') - 10} />
		<Cutout id="s15b" src={I('elwes_b')} w={380} h={560} x={1420} y={260} rot={3} at={cue('beggar\'s') - 6} pos="50% 20%" />
		<MarkerNote id="s15c" text="a beggar's old wig" x={260} y={640} at={cue('beggar\'s')} size={60} rot={-3} />
		<Ransom id="s15d" text="2 WEEKS" x={300} y={790} size={110} rot={-2} at={cue('weeks') - 6} />
		<Sfx n="slap0" at={cue('wig') - 10} />
		<Sfx n="slap1" at={cue('beggar\'s') - 6} />
		<Sfx n="marker_l" at={cue('beggar\'s')} />
		<Sfx n="slap2" at={cue('weeks') - 6} />
	</Board>
);

// 16 · never pay a toll if you can avoid it
export const S16: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s16a" x={260} y={200} rot={-3} at={0}>
			<div style={{width: 520, height: 280, background: '#FBF7EC', border: `8px solid ${V.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 9px 16px rgba(29,28,32,.35)'}}>
				<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 110, color: V.ink, letterSpacing: 10}}>TOLL</div>
				<div style={{fontFamily: 'Elite', fontSize: 28, color: V.ink}}>ONE PENNY</div>
			</div>
		</Piece>
		<InkX x={520} y={340} at={cue('no') + 2} id="s16x" />
		<Quote id="s16b" text="Never pay a toll if you can avoid it." source="John Elwes, quoted by Topham" x={880} y={520} w={900} size={60} at={cue('never') - 6} />
		<Sfx n="slap0" at={0} />
		<Sfx n="scribble" at={cue('no') + 2} />
		<Sfx n="slap1" at={cue('never') - 6} />
	</Board>
);
