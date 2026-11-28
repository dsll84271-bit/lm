/** Case File 003, paragraphs 35–52: Exhibit D (the clock), the verdict and CASE CLOSED. */
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {lerp} from '../../docs-kit/kit';
import {CaseClosed, EvidenceBoard, ExhibitCard, HOUSE_RED, RealityScore, S} from '../../docs-kit/series';
import {Cutout, Ink, InkX, MarkerNote, Piece, Ransom, Tag, TitleCard, useTwos, V} from '../../docs-kit/vox';
import {BOARD} from './board';
import {AMBER, Board, Caption, Clip, Coin, Credit, I, IconCard, Plate, Sfx, SlideBox, SlidePiece, T, TEAL, TenDots} from './parts';
import type {ShotProps} from './timeline';

const CR_RES = 'Dexter: Resurrection (Paramount+)';
const Badge: React.FC<{label: string}> = ({label}) => <SlidePiece id="exb" label={label} x={1330} y={180} at={20} rot={6} w={420} glow={0.4} />;

/** A clock face whose hand sweeps; it ticks on every beat. */
const ClockFace: React.FC<{x: number; y: number; r?: number; speed?: number}> = ({x, y, r = 170, speed = 6}) => {
	const frame = useCurrentFrame();
	const a = Math.floor(frame / 15) * speed;
	return (
		<svg width={r * 2 + 20} height={r * 2 + 20} style={{position: 'absolute', left: x - r - 10, top: y - r - 10}}>
			<circle cx={r + 10} cy={r + 10} r={r} fill="#FBF8EF" stroke={V.ink} strokeWidth={8} />
			{Array.from({length: 12}).map((_, i) => {
				const t = (i / 12) * Math.PI * 2;
				return <line key={i} x1={r + 10 + Math.sin(t) * (r - 14)} y1={r + 10 - Math.cos(t) * (r - 14)} x2={r + 10 + Math.sin(t) * (r - 34)} y2={r + 10 - Math.cos(t) * (r - 34)} stroke={V.ink} strokeWidth={6} />;
			})}
			<line x1={r + 10} y1={r + 10} x2={r + 10 + Math.sin((a * Math.PI) / 180) * (r - 40)} y2={r + 10 - Math.cos((a * Math.PI) / 180) * (r - 40)} stroke={TEAL} strokeWidth={10} strokeLinecap="round" />
			<circle cx={r + 10} cy={r + 10} r={12} fill={V.ink} />
		</svg>
	);
};

// 35 · Exhibit D: the clock
export const S35: React.FC<ShotProps> = ({d}) => (
	<ExhibitCard t={T} letter="D" title="The clock" d={d}>
		<ClockFace x={1530} y={330} r={150} speed={6} />
		{Array.from({length: Math.ceil(d / 15)}).map((_, i) => (
			<S key={i} n="tick" at={i * 15 + 10} v={0.35} />
		))}
	</ExhibitCard>
);

// 36 · 1965: nine in ten murders solved. 2021: less than half.
export const S36: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s36t" text="U.S. murders solved" x={110} y={100} rot={-2} at={cue('good')} size={34} />
		<div style={{position: 'absolute', left: 120, top: 250, fontFamily: 'Anton', fontSize: 110, color: V.ink, opacity: useTwos() >= cue('nineteen') ? 1 : 0}}>1965</div>
		<TenDots lit={9} at={cue('nineteen') + 4} x={460} y={240} size={86} />
		<MarkerNote id="s36a" text="9 in 10" x={1640} y={270} at={cue('ten')} size={70} color={TEAL} rot={-4} />
		<div style={{position: 'absolute', left: 120, top: 600, fontFamily: 'Anton', fontSize: 110, color: V.ink, opacity: useTwos() >= cue('twenty') ? 1 : 0}}>2021</div>
		<TenDots lit={4} partial={0.94} at={cue('twenty') + 4} x={460} y={590} size={86} />
		<MarkerNote id="s36b" text="less than half" x={1580} y={620} at={cue('less')} size={62} color={HOUSE_RED} rot={-4} />
		<Credit text="FBI data via Murder Accountability Project / Jeff Asher (2021: 49.4%)" x={120} y={960} id="s36cr" at={cue('less')} />
		<Sfx n="slap0" at={cue('nineteen')} />
		<Sfx n="marker_s" at={cue('ten')} />
		<Sfx n="slap1" at={cue('twenty')} />
		<Sfx n="marker_l" at={cue('less')} />
	</Board>
);

// 37 · Miami-Dade: 64% solved in 2013, 36% in 2017
export const S37: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	const b1 = lerp(frame, cue('sixty') - 4, cue('sixty') + 14, 0, 1);
	const b2 = lerp(frame, cue('thirty') - 4, cue('thirty') + 14, 0, 1);
	return (
		<Board>
			<Cutout id="s37p" src={I('miami_aerial')} w={720} h={480} x={110} y={180} rot={-2} at={cue('miami')} />
			<Caption text="Miami · Carol M. Highsmith, Library of Congress" x={130} y={690} at={cue('miami') + 4} id="s37c" size={18} />
			<Tag id="s37t" text="Miami-Dade: murders solved" x={980} y={140} rot={-1} at={cue('dade')} size={30} />
			{[
				['2013', 64.3, b1, TEAL],
				['2017', 36, b2, AMBER],
			].map(([y, v, p, c], i) => (
				<div key={i} style={{position: 'absolute', left: 1000 + i * 380, top: 260}}>
					<div style={{position: 'absolute', left: 0, top: 600 - 6 * (v as number) * (p as number), width: 260, height: 6 * (v as number) * (p as number), background: c as string, boxShadow: '4px 6px 10px rgba(0,0,0,.2)'}} />
					<div style={{position: 'absolute', left: 0, top: 600 - 6 * (v as number) * (p as number) - 120, width: 260, textAlign: 'center', fontFamily: 'Anton', fontSize: 100, color: V.ink, opacity: (p as number) > 0.5 ? 1 : 0}}>{Math.round(v as number)}%</div>
					<div style={{position: 'absolute', left: 0, top: 620, width: 260, textAlign: 'center', fontFamily: 'Elite', fontSize: 40, color: V.ink}}>{y}</div>
				</div>
			))}
			<Credit text="Miami New Times, from FDLE data" x={1000} y={980} id="s37cr" at={cue('thirty')} />
			<Sfx n="slap0" at={cue('miami')} />
			<Sfx n="whoosh" at={cue('sixty') - 4} />
			<Sfx n="whoosh" at={cue('thirty') - 4} />
		</Board>
	);
};

const PCT = ['50%', '25%', '12.5%', '6.3%', '3.1%', '1.6%', '0.8%', '0.4%', '0.2%', '0.1%'];

// 38 · a coin flip, again and again: ten in a row is less than one in a thousand
export const S38: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const first = cue('coin');
	const again = cue('again');
	const step = Math.max(4, Math.min(8, Math.floor((cue('thousand') - again) / 10)));
	const at = (i: number) => (i === 0 ? first : again + (i - 1) * step);
	const k = PCT.reduce((acc, _, i) => (f2 >= at(i) + 14 ? i : acc), -1);
	return (
		<Board>
			<Tag id="s38t" text="A thought experiment" x={110} y={100} rot={-2} at={0} size={32} />
			{Array.from({length: 10}).map((_, i) => (
				<Coin key={i} id={`c${i}`} x={150 + i * 165} y={360} at={at(i)} size={130} />
			))}
			<div style={{position: 'absolute', left: 150, top: 620, fontFamily: 'Elite', fontSize: 38, letterSpacing: 3, color: '#5d5a55', opacity: k >= 0 ? 1 : 0}}>CHANCE OF NEVER LOSING</div>
			<div style={{position: 'absolute', left: 150, top: 680, fontFamily: 'Anton', fontSize: 170, color: k >= 9 ? HOUSE_RED : V.ink, opacity: k >= 0 ? 1 : 0}}>{k >= 0 ? PCT[k] : ''}</div>
			<Ransom id="s38r" text="< 1 IN 1,000" x={1040} y={720} size={100} rot={-3} at={cue('thousand')} />
			{Array.from({length: 10}).map((_, i) => (
				<S key={i} n="slide" at={at(i) + 12} v={0.25} />
			))}
			<Sfx n="slap0" at={cue('thousand')} />
		</Board>
	);
};

// 39 · linkage blindness: police forces that don't connect the dots
export const S39: React.FC<ShotProps> = ({cue}) => {
	const files = [
		['CITY POLICE', 160, 220, -3],
		['COUNTY SHERIFF', 620, 160, 2],
		['NEXT COUNTY', 280, 560, 2],
		['STATE POLICE', 760, 520, -2],
	] as const;
	return (
		<Board>
			{files.map(([n, x, y, r], i) => (
				<Piece key={n} id={`s39${i}`} x={x} y={y} rot={r} at={cue('dots') - 16 + i * 4}>
					<div style={{width: 330, height: 220, background: 'linear-gradient(160deg,#D9B77A,#C79F5E)', borderRadius: 6, boxShadow: '5px 8px 12px rgba(0,0,0,.3)', padding: 20, boxSizing: 'border-box'}}>
						<div style={{background: '#F4ECD8', fontFamily: 'Elite', fontSize: 24, padding: '8px 12px', color: V.ink}}>{n}</div>
						<div style={{fontFamily: 'Elite', fontSize: 22, marginTop: 14, color: '#4a3820'}}>UNSOLVED · 1 CASE</div>
					</div>
				</Piece>
			))}
			<Ink id="s39l1" d="M 490 330 L 620 280" at={cue('dots') + 6} color={HOUSE_RED} dash width={5} />
			<Ink id="s39l2" d="M 440 430 L 430 560" at={cue('dots') + 10} color={HOUSE_RED} dash width={5} />
			<InkX x={560} y={305} at={cue('dots') + 14} id="s39x1" />
			<InkX x={436} y={495} at={cue('dots') + 18} id="s39x2" />
			<Ransom id="s39r" text="LINKAGE BLINDNESS" x={110} y={850} size={96} rot={-2} at={cue('linkage')} />
			<Credit text="Term coined by criminologist Steven Egger, 1984" x={120} y={1000} id="s39cr" at={cue('linkage') + 10} />
			<Clip n="r2_board" x={1480} y={420} w={700} rot={2} on={cue('depends') - 10} rate={0.5} />
			<Credit text={CR_RES} x={1240} y={720} id="s39cr2" at={cue('depends')} />
			<MarkerNote id="s39m" text="dexter depends on it" x={1250} y={800} at={cue('depends')} size={50} rot={-3} color={TEAL} />
			<Sfx n="slap0" at={cue('dots') - 16} />
			<Sfx n="scribble" at={cue('dots') + 14} />
			<Sfx n="slap1" at={cue('linkage')} />
			<Sfx n="marker_s" at={cue('depends')} />
		</Board>
	);
};

// 40 · not a detective's hunch: one piece of data
export const S40: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s40a" x={150} y={240} rot={-3} at={cue('hunch') - 6}>
			<div style={{width: 620, background: '#FBF8EF', padding: '40px 40px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', textAlign: 'center'}}>
				<div style={{fontFamily: 'Bebas', fontSize: 80, color: V.ink, lineHeight: 1}}>A DETECTIVE'S HUNCH</div>
				<div style={{fontFamily: 'Elite', fontSize: 26, color: '#5d5a55', marginTop: 14}}>LIKE SGT. DOAKES (FICTION)</div>
			</div>
		</Piece>
		<InkX x={460} y={330} at={cue('data') - 10} id="s40x" />
		<Ink id="s40ar" d="M 820 380 C 940 330, 1040 340, 1130 380" at={cue('data') - 4} color={TEAL} width={7} arrow={[1130, 380, 0.4]} />
		<Piece id="s40b" x={1160} y={200} rot={2} at={cue('data')}>
			<div style={{width: 600, background: '#FBF8EF', padding: '40px 40px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', borderTop: `16px solid ${TEAL}`, textAlign: 'center'}}>
				<div style={{fontFamily: 'Bebas', fontSize: 92, color: V.ink, lineHeight: 1}}>ONE PIECE OF DATA</div>
			</div>
		</Piece>
		<Sfx n="slap0" at={cue('hunch') - 6} />
		<Sfx n="scribble" at={cue('data') - 10} />
		<Sfx n="slap1" at={cue('data')} />
	</Board>
);

/** A family tree that grows from a DNA sample down to one name. */
const Tree: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
	const f2 = useTwos();
	const lv = [
		[[0, 0]],
		[
			[-300, 1],
			[0, 1],
			[300, 1],
		],
		[
			[-450, 2],
			[-150, 2],
			[150, 2],
			[450, 2],
		],
		[[150, 3]],
	];
	let i = 0;
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			{lv.flat().map(([dx, row], k) => {
				const t = at + (i++) * 4;
				const hit = row === 3;
				return f2 >= t ? (
					<div key={k} style={{position: 'absolute', left: dx - 90, top: row * 150, width: 180, height: 70, background: hit ? TEAL : '#FBF8EF', border: `3px solid ${V.ink}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Elite', fontSize: 22, color: hit ? '#fff' : V.ink, boxShadow: '4px 6px 10px rgba(0,0,0,.25)'}}>
						{row === 0 ? 'CRIME-SCENE DNA' : hit ? 'MATCH' : 'RELATIVE'}
					</div>
				) : null;
			})}
		</div>
	);
};

// 41 · April 2018: the Golden State Killer, caught through a family tree
export const S41: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={6} title="The Golden State Killer" sub="Caught April 2018, Sacramento" at={cue('golden') - 4} id="s41t" />
		<Ransom id="s41r" text="DECADES LATER" x={110} y={500} size={96} rot={-3} at={cue('decades')} />
		<MarkerNote id="s41m" text="public genealogy website" x={120} y={720} at={cue('genealogy')} size={50} rot={-2} color={TEAL} />
		<Tree at={cue('dna') - 4} x={1260} y={170} />
		<Sfx n="slap0" at={cue('golden') - 4} />
		<Sfx n="slap1" at={cue('decades')} />
		<Sfx n="marker_s" at={cue('genealogy')} />
		<S n="pin" at={cue('tree')} />
	</Board>
);

const Span: React.FC<{a: string; b: string; at: number; bAt: number; label: string; y?: number}> = ({a, b, at, bAt, label, y = 620}) => {
	const frame = useCurrentFrame();
	const p = lerp(frame, at, bAt, 0, 1);
	return (
		<>
			<div style={{position: 'absolute', left: 200, top: y, fontFamily: 'Anton', fontSize: 110, color: V.ink, opacity: frame >= at ? 1 : 0}}>{a}</div>
			<div style={{position: 'absolute', left: 520, top: y + 70, width: 900 * p, height: 8, background: TEAL}} />
			<div style={{position: 'absolute', left: 1460, top: y, fontFamily: 'Anton', fontSize: 110, color: TEAL, opacity: frame >= bAt ? 1 : 0}}>{b}</div>
			<div style={{position: 'absolute', left: 520, top: y + 100, width: 900, textAlign: 'center', fontFamily: 'Elite', fontSize: 34, letterSpacing: 3, color: '#5d5a55', opacity: frame >= bAt ? 1 : 0}}>{label}</div>
		</>
	);
};

// 42 · Gary Ridgway: a 1987 sample, matched in 2001
export const S42: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={7} title="The Green River Killer" sub="Gary Ridgway · arrested 2001" at={cue('gary') - 4} id="s42t" />
		<IconCard k="dna" label="A DNA sample" sub="taken in 1987" x={1280} y={110} at={cue('dna')} id="s42c" rot={2} />
		<Span a="1987" b="2001" at={cue('nineteen') - 6} bAt={cue('nineteen') + 10} label="NEW DNA TESTING · MATCH" />
		<Sfx n="slap0" at={cue('gary') - 4} />
		<Sfx n="slap1" at={cue('dna')} />
		<Sfx n="whoosh" at={cue('nineteen') - 6} />
	</Board>
);

// 43 · Israel Keyes: caught within weeks, because of a bank card
export const S43: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={8} title="Israel Keyes" sub="Arrested March 2012, Texas" at={cue('israel') - 4} id="s43t" />
		<MarkerNote id="s43m" text="careful. travelled the country." x={120} y={470} at={cue('careful')} size={50} rot={-2} />
		<Ransom id="s43r" text="WITHIN WEEKS" x={110} y={640} size={100} rot={-3} at={cue('weeks')} />
		<IconCard k="card" label="A bank card" sub="a victim's card was used" x={1240} y={240} at={cue('bank')} id="s43c" rot={3} />
		<Sfx n="slap0" at={cue('israel') - 4} />
		<Sfx n="marker_s" at={cue('careful')} />
		<Sfx n="slap1" at={cue('weeks')} />
		<Sfx n="slap2" at={cue('bank')} />
	</Board>
);

// 44 · Gary, Indiana: a journalist's algorithm flagged the cluster four years early
export const S44: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s44p" src={I('gary_sign')} w={640} h={430} x={110} y={140} rot={-2} at={cue('gary') - 4} />
		<Caption text="Gary, Indiana · Carol M. Highsmith, Library of Congress" x={130} y={600} at={cue('gary')} id="s44c" size={18} />
		<IconCard k="cpu" label="An algorithm" sub="written by journalist Thomas Hargrove" x={1240} y={110} at={cue('computer')} id="s44i" rot={2} />
		<Span a="2010" b="2014" at={cue('twenty') - 4} bAt={cue('caught') - 4} label="FLAGGED → ARREST" y={700} />
		<Ransom id="s44r" text="4 YEARS" x={820} y={560} size={90} rot={-3} at={cue('four')} />
		<Sfx n="slap0" at={cue('gary') - 4} />
		<Sfx n="slap1" at={cue('computer')} />
		<Sfx n="slap2" at={cue('four')} />
	</Board>
);

// 45 · Miami today: genetic genealogy, licence plate cameras
export const S45: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Plate src={I('miami_aerial')} d={d} dark={0.3} />
		<IconCard k="tree" label="650+ cases" sub="solved by genetic genealogy, to end of 2023" x={150} y={200} at={cue('six') - 4} id="s45a" rot={-2} />
		<IconCard k="camera" label="20 billion" sub="plate scans a month (company figure)" x={620} y={240} at={cue('billion') - 6} id="s45b" rot={2} accent={AMBER} />
		<Clip n="r2_news" x={1450} y={430} w={640} rot={2} on={cue('company') - 10} rate={0.6} />
		<Credit text={CR_RES} x={1230} y={700} id="s45cr" at={cue('company')} dark />
		<Caption text="Dexter's routine was built for a world before this" x={150} y={900} at={cue('routine')} id="s45m" size={30} />
		<Sfx n="slap0" at={cue('six') - 4} />
		<Sfx n="slap1" at={cue('billion') - 6} />
		<Sfx n="slap2" at={cue('routine')} />
	</AbsoluteFill>
);

// 46 · the real vigilantes: Drum and Mullen
export const S46: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s46t" text="Real vigilantes · Washington State" x={110} y={100} rot={-2} at={cue('washington')} size={32} />
		{[
			['PATRICK DRUM · 2012', 'Sentenced to life without parole', 'within three months', cue('patrick'), 140, -2],
			['MICHAEL MULLEN · 2005', 'Died in prison', 'less than two years later', cue('michael'), 980, 2],
		].map(([a, b, c, at, x, r], i) => (
			<Piece key={i} id={`s46${i}`} x={x as number} y={240} rot={r as number} at={at as number}>
				<div style={{width: 760, background: '#FBF8EF', padding: '30px 36px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', borderTop: `14px solid ${i ? AMBER : TEAL}`, fontFamily: 'Elite', color: V.ink}}>
					<div style={{fontSize: 40, letterSpacing: 2}}>{a}</div>
					<div style={{fontSize: 30, marginTop: 18}}>{b}</div>
					<div style={{fontFamily: 'Marker', fontSize: 48, marginTop: 10, color: i ? AMBER : TEAL}}>{c}</div>
				</div>
			</Piece>
		))}
		<MarkerNote id="s46m" text="neither came close to dexter" x={420} y={720} at={cue('neither')} size={60} rot={-2} />
		<Sfx n="slap0" at={cue('washington')} />
		<Sfx n="slap1" at={cue('patrick')} />
		<Sfx n="slap2" at={cue('michael')} />
		<Sfx n="marker_l" at={cue('neither')} />
	</Board>
);

// 47 · Exhibit D, answered: months, a few years at most
export const S47: React.FC<ShotProps> = ({d, cue}) => (
	<EvidenceBoard t={T} items={BOARD} shown={4} newAt={cue('months') - 4} d={d}>
		<MarkerNote id="s47j" text="the detective's judgement:" x={1180} y={1010} at={cue('judgement')} size={40} color="#F3EEE3" rot={-2} />
	</EvidenceBoard>
);

// 48 · time for the verdict: the board, full
export const S48: React.FC<ShotProps> = ({d}) => <EvidenceBoard t={T} items={BOARD} shown={5} d={d} />;

const Score: React.FC<{cue: ShotProps['cue']; score: number; word: string; sub: string; d: number}> = ({cue, score, word, sub, d}) => {
	const land = cue(word);
	return (
		<RealityScore t={T} score={score} landAt={land} sub={sub}>
			<SlideBox fill={score} fillAt={land - score * 9 - 6} />
			{Array.from({length: score}).map((_, i) => (
				<S key={i} n="slide" at={land - score * 9 - 6 + i * 9 + 6} v={0.45} />
			))}
		</RealityScore>
	);
};

// 49 · on the science: five out of ten
export const S49: React.FC<ShotProps> = ({d, cue}) => <Score cue={cue} d={d} score={5} word="five" sub="On the science" />;

// 50 · on the double life: one out of ten
export const S50: React.FC<ShotProps> = ({d, cue}) => <Score cue={cue} d={d} score={1} word="one" sub="On the double life" />;

// 51 · overall: three out of ten. The science is half real. The man is pure fiction.
export const S51: React.FC<ShotProps> = ({d, cue}) => {
	const f2 = useTwos();
	const a = 'The science is half real.';
	const b = 'The man is pure fiction.';
	const na = Math.max(0, Math.floor((f2 - cue('science')) * 1.2));
	const nb = Math.max(0, Math.floor((f2 - cue('man')) * 1.2));
	return (
		<RealityScore t={T} score={3} landAt={cue('three')} sub="Overall: Dexter">
			<SlideBox fill={3} fillAt={cue('three') - 33} />
			{[0, 1, 2].map((i) => (
				<S key={i} n="slide" at={cue('three') - 33 + i * 9 + 6} v={0.45} />
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 50, color: '#E9E4D8'}}>
				{a.slice(0, na)}
				<span style={{opacity: 0}}>{a.slice(na)}</span> <span style={{color: '#7FD3CE'}}>{b.slice(0, nb)}</span>
				<span style={{opacity: 0}}>{b.slice(nb)}</span>
			</div>
		</RealityScore>
	);
};

// 52 · the finale lands on New Year's Day; case closed
export const S52: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const closeAt = cue('case') - 6;
	return (
		<AbsoluteFill>
			{frame < closeAt + 10 && (
				<Board dark>
					<Clip n="r2_street" x={760} y={480} w={1000} rot={-1} on={0} rate={0.6} />
					<Credit text={CR_RES} x={330} y={900} id="s52cr" dark />
					<Tag id="s52t" text="Season finale · New Year's Day" x={1300} y={300} rot={2} at={cue('finale')} size={30} />
					<MarkerNote id="s52m" text="now you know." x={1320} y={420} at={cue('know')} size={70} color="#F2D59A" rot={-3} />
				</Board>
			)}
			<Sequence from={closeAt} layout="none">
				<CaseClosed t={T} d={d - closeAt} closedAt={8} nextAt={Math.max(40, cue('see') - closeAt)} next="COMING SOON" />
			</Sequence>
			<Sfx n="slap0" at={cue('finale')} />
		</AbsoluteFill>
	);
};

