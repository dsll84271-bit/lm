/** Case File 001, paragraphs 1–15: the hook, the case file, Panem, and the night of the lottery. */
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseIntro} from '../../docs-kit/case';
import {lerp} from '../../docs-kit/kit';
import {TV} from '../../docs-kit/tv';
import {Cutout, Ink, InkX, MarkerNote, Ransom, Tag, TitleCard, useBoil, useTwos, V} from '../../docs-kit/vox';
import {MAP_PTS, toScreen} from '../../docs-kit/vmap';
import {Board, Chapter, F, Film, I, Sfx} from './parts';
import type {ShotProps} from './timeline';

const T = (n: string) => F(`trailer_${n}`);

// 1 · a boy's name pulled from a glass bowl, live on television
export const S01: React.FC<ShotProps> = ({cue}) => {
	const boy = cue("boy's");
	const live = cue('live');
	return (
		<Board>
			{useCurrentFrame() < boy ? <TV src={T('bowl')} x={900} y={500} w={1200} rot={-1.2} on={0} grade="colour" /> : <TV src={T('haymitch')} x={900} y={500} w={1200} rot={-1.2} on={boy} grade="colour" />}
			<Tag id="s1t" text="Sunrise on the Reaping · the film, 2026" x={1150} y={930} rot={1.5} at={10} size={24} />
			<MarkerNote id="s1m" text="live on television" x={1300} y={120} at={live} size={60} rot={4} />
			<Ink id="s1a" d="M 1480 200 C 1500 260, 1470 300, 1400 330" at={live + 14} dur={8} len={300} arrow={[1400, 330, 2.5]} />
			<Sfx n="slap0" at={10} />
			<Sfx n="marker_l" at={live} />
		</Board>
	);
};

// 2 · it's fiction… but 57 years ago America did something terrifyingly close
export const S02: React.FC<ShotProps> = ({cue}) => {
	const but = cue('but');
	const fifty = cue('fifty');
	const live = cue('live');
	const date = cue('date');
	return (
		<Board>
			<Ransom id="s2f" text="FICTION" x={560} y={420} size={170} rot={-3} at={2} end={fifty} />
			<InkX x={960} y={520} at={but} id="s2x" end={fifty} />
			<Ink id="s2x2" d="M 520 440 L 1420 640" at={but + 4} dur={6} width={9} len={1000} end={fifty} />
			<Ransom id="s2y" text="57 YEARS AGO" x={300} y={430} size={150} rot={-2} at={fifty} end={live} />
			{useCurrentFrame() >= live && <TV image={I('draft_lottery_1969')} x={860} y={510} w={1150} rot={1} on={live} grade="mono" />}
			<Tag id="s2t" text="Washington, 1 December 1969" x={1180} y={940} rot={-1.5} at={live + 8} size={24} />
			<MarkerNote id="s2m" text="a date of birth" x={1330} y={130} at={date} size={56} rot={5} />
			<Sfx n="slap1" at={2} />
			<Sfx n="scribble" at={but} />
			<Sfx n="slap2" at={fifty} />
			<Sfx n="whoosh" at={live - 4} v={0.4} />
		</Board>
	);
};

const Q: React.FC<{n: number; text: string; img: string; x: number; at: number; rot: number}> = ({n, text, img, x, at, rot}) => (
	<>
		<Cutout id={`q${n}`} src={img} w={500} h={350} x={x} y={360} rot={rot} at={at} />
		<Tag id={`qt${n}`} text={`${n}. ${text}`} x={x + 20} y={770} rot={-rot / 2} at={at + 6} size={30} />
	</>
);

// 3 · what you'll know by the end of this file
export const S03: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const head = 'Based on something real.';
	const n = Math.max(0, Math.floor((f2 - 4) * 1.1));
	return (
		<Board>
			<div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: 'Caslon', fontSize: 92, color: V.ink}}>
				{head.slice(0, n)}
				<span style={{opacity: 0}}>{head.slice(n)}</span>
			</div>
			<Q n={1} text="The real reaping" img={I('pirnie_1969')} x={110} at={cue('what')} rot={-3} />
			<Q n={2} text="Rigged by accident" img={I('lottery_drum_1972a')} x={700} at={cue('rigged')} rot={2} />
			<Q n={3} text="A father at war" img="case001/map/vietnam_yellow.jpg" x={1290} at={cue('woman')} rot={-2} />
			<Sfx n="type0" at={4} v={0.3} />
			<Sfx n="slap0" at={cue('what')} />
			<Sfx n="slap1" at={cue('rigged')} />
			<Sfx n="slap2" at={cue('woman')} />
		</Board>
	);
};

// 4 · welcome to the Fiction Files → the case file opens
export const S04: React.FC<ShotProps> = ({d, cue}) => {
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
			<Sequence from={start} layout="none">
				<CaseIntro caseNo={1} title="THE REAPING" photo="case001/img/draft_lottery_1969.jpg" stingVol={0.45} />
			</Sequence>
		</AbsoluteFill>
	);
};

// 5 · first, the fiction: Panem's reaping
export const S05: React.FC<ShotProps> = ({cue}) => {
	const pan = cue('panem');
	if (useCurrentFrame() < pan) return <Chapter n={1} title="The fiction" />;
	return (
		<Board>
			<TV src={T('lineup')} x={760} y={500} w={1100} rot={-1} on={pan} grade="colour" />
			<Ransom id="s5a" text="12–18" x={1290} y={180} size={120} rot={4} at={cue('twelve')} />
			<MarkerNote id="s5b" text="every child" x={1330} y={350} at={cue('every')} size={54} rot={-4} />
			<Tag id="s5c" text="1 boy + 1 girl × 12 districts" x={1260} y={520} rot={2} at={cue('boy')} size={26} />
			<Ransom id="s5d" text="24" x={1300} y={640} size={110} rot={-3} at={cue('twenty')} />
			<MarkerNote id="s5e" text="→ 1 survivor" x={1550} y={680} at={cue('survivor')} size={54} rot={-3} />
			<Sfx n="slap0" at={cue('twelve')} />
			<Sfx n="marker_s" at={cue('every')} />
			<Sfx n="slap1" at={cue('boy')} />
			<Sfx n="slap2" at={cue('twenty')} />
			<Sfx n="marker_s" at={cue('survivor')} />
		</Board>
	);
};

// 6 · the 50th Games: a Quarter Quell, 48 children, Haymitch
export const S06: React.FC<ShotProps> = ({cue}) => {
	const hay = cue('haymitch');
	const frame = useCurrentFrame();
	return (
		<Board>
			{frame < hay ? <TV src={T('escort')} x={760} y={500} w={1100} rot={1} on={0} grade="colour" /> : <TV src={T('haymitch')} x={760} y={500} w={1100} rot={1} on={hay} grade="colour" />}
			<Tag id="s6a" text="The 50th Games · a Quarter Quell" x={1270} y={180} rot={-2} at={cue('fiftieth')} size={24} />
			<Ransom id="s6b" text="×2" x={1350} y={300} size={130} rot={3} at={cue('doubles')} />
			<Ransom id="s6c" text="48" x={1320} y={520} size={170} rot={-4} at={cue('forty')} />
			<MarkerNote id="s6d" text="Haymitch Abernathy" x={1240} y={800} at={hay} size={54} rot={-3} />
			<Sfx n="slap1" at={cue('fiftieth')} />
			<Sfx n="slap0" at={cue('doubles')} />
			<Sfx n="slap2" at={cue('forty')} />
			<Sfx n="marker_l" at={hay} />
		</Board>
	);
};

/** A glass bowl drawn in ink, with name slips dropping in. */
const Bowl: React.FC<{slips: number[]; x?: number; y?: number}> = ({slips, x = 700, y = 560}) => {
	const f2 = useTwos();
	const boil = useBoil('bowl');
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: boil}}>
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<ellipse cx={x} cy={y - 170} rx={300} ry={46} fill="none" stroke={V.ink} strokeWidth={6} />
				<path d={`M ${x - 300} ${y - 170} C ${x - 300} ${y + 140}, ${x + 300} ${y + 140}, ${x + 300} ${y - 170}`} fill="rgba(255,255,255,.35)" stroke={V.ink} strokeWidth={6} />
				<path d={`M ${x - 90} ${y + 74} L ${x - 110} ${y + 170} L ${x + 110} ${y + 170} L ${x + 90} ${y + 74}`} fill="none" stroke={V.ink} strokeWidth={6} />
			</svg>
			{slips.map((at, i) => {
				if (f2 < at) return null;
				const t = Math.min(1, (f2 - at) / 6);
				const px = x - 210 + ((i * 97) % 420);
				const py = y - 20 - Math.floor(i / 5) * 26 - (1 - t) * 420;
				const r = ((i * 37) % 50) - 25;
				return (
					<div key={i} style={{position: 'absolute', left: px, top: py, width: 120, height: 36, background: '#FBF7EC', border: `2px solid ${V.ink}`, transform: `rotate(${r}deg)`, fontFamily: 'Elite', fontSize: 15, textAlign: 'center', lineHeight: '32px', color: V.ink}}>
						YOUR NAME
					</div>
				);
			})}
		</div>
	);
};

// 7 · the reaping isn't fair: tesserae
export const S07: React.FC<ShotProps> = ({cue}) => {
	const tess = cue('tessera');
	const base = [cue('reaping'), cue('fair')];
	const extra = [0, 1, 2, 3, 4, 5, 6].map((k) => tess + 8 + k * 5);
	return (
		<Board>
			<Bowl slips={[...base, ...extra]} />
			<MarkerNote id="s7a" text="isn't fair" x={1180} y={140} at={cue('fair')} size={64} rot={-4} />
			<Tag id="s7b" text="Tesserae = extra food" x={1200} y={360} rot={2} at={cue('tesserae')} size={30} />
			<MarkerNote id="s7c" text={'+1 ration\n= +1 slip'} x={1240} y={480} at={cue('catch')} size={60} rot={-3} />
			<Sfx n="slap0" at={base[0]} v={0.35} />
			<Sfx n="slap1" at={base[1]} v={0.35} />
			{extra.map((a, i) => (
				<Sfx key={i} n={`slap${i % 3}`} at={a} v={0.3} />
			))}
			<Sfx n="marker_l" at={cue('catch')} />
		</Board>
	);
};

// 8 · the poorest kids have the worst odds
export const S08: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const g = lerp(f2, 4, 30, 0, 1);
	const rows: [string, number][] = [
		['FED', 1],
		['HUNGRY', 4],
		['STARVING', 9],
	];
	return (
		<Board>
			{rows.map(([label, n], i) => (
				<div key={label} style={{position: 'absolute', left: 300, top: 260 + i * 190, display: 'flex', alignItems: 'center', gap: 26}}>
					<div style={{width: 300, fontFamily: 'Anton', fontSize: 64, color: V.ink, textAlign: 'right'}}>{label}</div>
					{Array.from({length: n}).map((_, k) => (
						<div key={k} style={{width: 90, height: 60, background: i === 2 ? V.yellow : '#FBF7EC', border: `3px solid ${V.ink}`, opacity: g * 9 > k ? 1 : 0, transform: `rotate(${((k * 13) % 9) - 4}deg)`}} />
					))}
				</div>
			))}
			<MarkerNote id="s8a" text="remember that." x={1150} y={140} at={cue('remember')} size={66} rot={-5} />
			<Ink id="s8c" d="M 1150 240 C 1300 228, 1450 246, 1620 232" at={cue('remember') + 10} dur={8} width={7} len={520} />
			<Sfx n="marker_l" at={cue('remember')} />
		</Board>
	);
};

/** Two channels on one set: a glossy reality show and grey war footage, flicking. */
const Channels: React.FC<{flickAt: number; blurAt: number}> = ({flickAt, blurAt}) => {
	const frame = useCurrentFrame();
	const k = frame < flickAt ? 0 : Math.floor((frame - flickAt) / 14);
	const mix = lerp(frame, blurAt, blurAt + 20, 0, 0.5);
	const a = k % 2 === 0;
	const Reality = (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #FFDB6E, #E0477A 60%, #5B1F7A)', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: 'Anton', fontSize: 110, color: '#fff', textShadow: '0 6px 0 #5B1F7A'}}>REALITY TV</div>
			<div style={{fontFamily: 'Elite', fontSize: 30, color: '#fff', marginTop: 8}}>★ WHO GOES HOME TONIGHT? ★</div>
		</AbsoluteFill>
	);
	const War = (
		<AbsoluteFill style={{background: 'linear-gradient(#5d6660,#2c302d)', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: 'Anton', fontSize: 100, color: '#e9e6dc'}}>WAR FOOTAGE</div>
			<div style={{fontFamily: 'Elite', fontSize: 30, color: '#e9e6dc', marginTop: 8}}>IRAQ, 2003</div>
		</AbsoluteFill>
	);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: a ? 1 - mix : mix}}>{Reality}</AbsoluteFill>
			<AbsoluteFill style={{opacity: a ? mix : 1 - mix}}>{War}</AbsoluteFill>
			{frame >= flickAt && (frame - flickAt) % 14 < 2 && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg,#ddd 0 2px,#222 2px 4px)', opacity: 0.8}} />}
		</AbsoluteFill>
	);
};

// 9 · the idea: flicking between a reality show and war footage
export const S09: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TV x={820} y={510} w={1150} rot={-1} on={2} grade="colour">
			<Channels flickAt={cue('flicking')} blurAt={cue('blur')} />
		</TV>
		<Tag id="s9a" text="Suzanne Collins, on where the idea came from" x={1150} y={940} rot={1.5} at={6} size={22} />
		<MarkerNote id="s9b" text={'flick…\nflick…'} x={1460} y={170} at={cue('flicking')} size={56} rot={6} />
		<MarkerNote id="s9c" text="they blur together" x={1300} y={420} at={cue('blur')} size={50} rot={-4} />
		<Sfx n="marker_s" at={cue('flicking')} />
		<Sfx n="marker_l" at={cue('blur')} />
	</Board>
);

// 10 · the Greek myth of Theseus
export const S10: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s10a" src={I('minotaur_tribute_1885')} w={1040} h={666} x={180} y={150} rot={-1.5} at={2} />
		<Tag id="s10b" text={'"The tribute to the Minotaur" · Puck, 1885'} x={260} y={860} rot={1} at={8} size={22} />
		<MarkerNote id="s10c" text={'Theseus\n& the Minotaur'} x={1330} y={240} at={cue('theseus')} size={62} rot={4} />
		<MarkerNote id="s10d" text={'young people\nsent as tribute'} x={1330} y={560} at={cue('young')} size={52} rot={-3} />
		<Sfx n="slap0" at={2} />
		<Sfx n="marker_l" at={cue('theseus')} />
		<Sfx n="marker_l" at={cue('young')} />
	</Board>
);

// 11 · the version everyone's heard… and the one nobody talks about
export const S11: React.FC<ShotProps> = ({cue}) => {
	const here = cue("here's");
	return (
		<Board>
			<Tag id="s11a" text="The official story" x={760} y={300} rot={-2} at={2} size={44} end={here} />
			<InkX x={960} y={330} at={cue('heard') - 6} id="s11b" end={here} />
			<Ransom id="s11c" text="THE OTHER STORY" x={190} y={430} size={130} rot={-2} at={here} />
			<Sfx n="slap0" at={2} />
			<Sfx n="scribble" at={cue('heard') - 6} />
			<Sfx n="slap1" at={here} />
		</Board>
	);
};

// 12 · 1969: America deep in Vietnam, and a draft seen as unfair
export const S12: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const mapBoil = useBoil('map12');
	const army = cue('army');
	const but = cue('but');
	const cam = {x: 3600, y: 1330, w: 3900};
	const [wx, wy] = toScreen(cam, MAP_PTS.washington);
	const [sx, sy] = toScreen(cam, MAP_PTS.saigon);
	const arc = `M ${wx} ${wy} Q ${(wx + sx) / 2} ${Math.min(wy, sy) - 330} ${sx + 18} ${sy - 14}`;
	const ang = Math.atan2(sy - 14 - (Math.min(wy, sy) - 330), sx + 18 - (wx + sx) / 2);
	if (frame < 26) return <Chapter n={2} title="The real reaping" at={0} />;
	if (frame < army)
		return (
			<Board>
				<Img src={staticFile('case001/map/pacific.jpg')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, transform: mapBoil}} />
				<Ink id="s12r" d={arc} at={40} dur={22} dash len={2600} arrow={[sx + 18, sy - 14, ang]} />
				<TitleCard fig={1} title="1969" sub="America is at war in Vietnam" at={28} />
				<Sfx n="slap0" at={28} />
				<Sfx n="marker_l" at={40} />
			</Board>
		);
	if (frame < but)
		return (
			<Board dark>
				<Film src={F('a_march')} from={2} d={but - army} at={army} id="f12" />
				<Tag id="s12t" text="US Army film, 1968" x={1430} y={890} rot={-2} at={army + 6} size={22} />
			</Board>
		);
	return (
		<Board>
			<Ransom id="s12u" text="UNFAIR" x={640} y={170} size={140} rot={-3} at={but + 4} />
			<MarkerNote id="s12a" text="in college?" x={260} y={520} at={cue('college')} size={64} rot={-4} />
			<MarkerNote id="s12b" text="knew the right people?" x={240} y={700} at={cue('knew')} size={64} rot={3} />
			<Ink id="s12c" d="M 900 560 C 1050 560, 1150 600, 1260 640" at={cue('put')} dur={8} len={500} arrow={[1260, 640, 0.4]} />
			<Ink id="s12d" d="M 1080 730 C 1150 720, 1200 700, 1260 680" at={cue('put') + 4} dur={8} len={300} arrow={[1260, 680, -0.3]} />
			<Tag id="s12e" text="draft put off" x={1290} y={630} rot={-2} at={cue('put') + 8} size={34} />
			<Sfx n="slap2" at={but + 4} />
			<Sfx n="marker_l" at={cue('college')} />
			<Sfx n="marker_l" at={cue('knew')} />
			<Sfx n="slap0" at={cue('put') + 8} />
		</Board>
	);
};

// 13 · so the government tries something new: a lottery
export const S13: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<MarkerNote id="s13a" text="something new…" x={700} y={260} at={cue('new') - 4} size={64} rot={-3} />
		<Ransom id="s13b" text="A LOTTERY" x={330} y={430} size={190} rot={-2} at={Math.max(0, cue('lottery') - 16)} />
		<Sfx n="marker_s" at={cue('new') - 4} />
		<Sfx n="slap1" at={Math.max(0, cue('lottery') - 16)} />
	</Board>
);

// 14 · 1 December 1969: 366 blue capsules in a container
export const S14: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s14p" src={I('draft_lottery_1969')} w={900} h={600} x={900} y={250} rot={2} at={cue('headquarters')} pos="40% 50%" />
		<TitleCard fig={2} title="The draft lottery" sub="Selective Service HQ, 1 Dec 1969" at={2} />
		<Ransom id="s14n" text="366" x={140} y={560} size={190} rot={-4} at={cue('three')} />
		<MarkerNote id="s14m" text={'one for every\nbirthday'} x={150} y={830} at={cue('one')} size={58} />
		<Tag id="s14t" text="Including 29 February" x={1180} y={880} rot={-2} at={cue('twenty')} size={28} />
		<Sfx n="slap0" at={2} />
		<Sfx n="slap1" at={cue('headquarters')} />
		<Sfx n="slap2" at={cue('three')} />
		<Sfx n="slap0" at={cue('three') + 3} />
		<Sfx n="slap1" at={cue('three') + 7} />
		<Sfx n="marker_l" at={cue('one')} />
		<Sfx n="slap2" at={cue('twenty')} />
	</Board>
);

// 15 · men born 1944–1950, broadcast live on television
export const S15: React.FC<ShotProps> = ({cue}) => {
	const br = cue('broadcast');
	return (
		<Board>
			<Ransom id="s15a" text="1944–1950" x={330} y={420} size={150} rot={-2} at={cue('born')} end={br} />
			<MarkerNote id="s15b" text="men born between…" x={420} y={270} at={cue('men')} size={56} rot={-3} end={br} />
			{useCurrentFrame() >= br && <TV image={I('draft_lottery_1969')} x={900} y={500} w={1150} rot={-1} on={br} grade="mono" />}
			<Tag id="s15c" text="Live on television" x={1250} y={930} rot={2} at={br + 8} size={34} />
			<Sfx n="marker_s" at={cue('men')} />
			<Sfx n="slap1" at={cue('born')} />
			<Sfx n="whoosh" at={br - 4} v={0.4} />
		</Board>
	);
};
