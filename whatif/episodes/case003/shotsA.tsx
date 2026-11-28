/** Case File 003, paragraphs 1–16: the cold open, the ident, the case brief, the fiction and Exhibit A. */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {lerp} from '../../docs-kit/kit';
import {CaseBrief, CaseSlate, EvidenceBoard, ExhibitCard, Ident, S} from '../../docs-kit/series';
import {Cutout, Ink, InkCircle, MarkerNote, Piece, Ransom, Tag, TitleCard, useTwos, V} from '../../docs-kit/vox';
import {BOARD} from './board';
import {AMBER, Board, Caption, Clip, CountUp, Credit, I, IconCard, NIGHT, Plate, Pleading, Sfx, SlidePiece, T, TEAL} from './parts';
import type {ShotProps} from './timeline';

const CR_ORIG = 'Dexter (Showtime, 2006–2013)';
const CR_RES = 'Dexter: Resurrection (Paramount+)';

// 1 · twenty years of television's favourite killer: by day, by night
export const S01: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	const day = cue('day');
	const night = cue('night');
	const clip = frame < day - 4 ? 'eo_hall' : frame < night - 4 ? 'eo_slide' : 'eo_boat';
	return (
		<Board dark>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 45%, ${TEAL}33 0%, rgba(0,0,0,0) 55%)`}} />
			<Clip key={clip} n={clip} x={1270} y={500} w={980} rot={1.2} on={clip === 'eo_hall' ? 2 : 0} rate={0.5} />
			<Credit text={CR_ORIG} x={950} y={950} id="s1cr" dark />
			<Ransom id="s1a" text="20 YEARS" x={110} y={270} size={120} rot={-3} at={cue('twenty')} />
			<div style={{position: 'absolute', left: 120, top: 470, fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 58, color: '#E9E4D8', opacity: lerp(frame, cue('favourite') - 6, cue('favourite') + 6, 0, 1)}}>
				television's favourite killer.
			</div>
			<MarkerNote id="s1b" text="by day: reads blood" x={130} y={610} at={day} size={54} color="#BFE6E2" rot={-2} />
			<MarkerNote id="s1c" text="by night: hunts killers" x={130} y={700} at={night} size={54} color="#F2D59A" rot={-2} />
			<CaseSlate t={T} at={4} end={cue('night') + 40} />
			<S n="stamp" at={12} v={0.35} />
			<Sfx n="slap0" at={cue('twenty')} />
			<Sfx n="marker_l" at={day} />
			<Sfx n="marker_l" at={night} />
		</Board>
	);
};

// 2 · he's back: Resurrection season two, every Friday, finale on New Year's Day
export const S02: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Clip n="r1_wake" x={760} y={500} w={1080} rot={-1} on={0} rate={0.55} />
		<Credit text={CR_RES} x={330} y={960} id="s2cr" dark />
		<Tag id="s2a" text="Dexter: Resurrection · Season 2" x={1330} y={230} rot={2} at={cue('resurrection')} size={28} />
		<Piece id="s2b" x={1380} y={330} rot={-2} at={cue('friday')}>
			<div style={{width: 420, background: '#FBF8EF', boxShadow: '6px 9px 16px rgba(0,0,0,.4)'}}>
				<div style={{background: TEAL, color: '#fff', fontFamily: 'Bebas', fontSize: 44, padding: '6px 20px', letterSpacing: 4}}>EVERY FRIDAY</div>
				<div style={{padding: '16px 20px', fontFamily: 'Elite', fontSize: 26, lineHeight: 1.6, color: V.ink}}>
					30 OCT 2026 → <br />
					FINALE: <b>1 JAN 2027</b>
				</div>
			</div>
		</Piece>
		<MarkerNote id="s2c" text="he's back." x={1400} y={680} at={cue('back')} size={80} color="#F2D59A" rot={-4} />
		<Sfx n="slap1" at={cue('resurrection')} />
		<Sfx n="slap2" at={cue('friday')} />
		<Sfx n="marker_s" at={cue('back')} />
	</Board>
);

// 3 · the question the show never asks
export const S03: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const lines: [string, number][] = [
		["What if Dexter's job was real?", cue('what')],
		['Would his evidence stand up in a real courtroom?', cue('evidence')],
		['How long would he last?', cue('how')],
	];
	return (
		<Board>
			<Cutout id="s3p" src={I('courtroom')} w={620} h={440} x={1180} y={420} rot={2.5} at={cue('courtroom') - 4} />
			<Caption text="A real courtroom: Tallahassee, Florida" x={1190} y={900} at={cue('courtroom')} id="s3cap" size={20} />
			{lines.map(([t, at], i) => {
				const n = Math.max(0, Math.floor((f2 - at) * 1.25));
				return (
					<div key={i} style={{position: 'absolute', left: 110, top: 170 + i * 200, width: i === 1 ? 980 : 1100, fontFamily: 'Caslon', fontSize: i === 2 ? 92 : 64, lineHeight: 1.1, color: i === 2 ? TEAL : V.ink, opacity: f2 >= at ? 1 : 0}}>
						{t.slice(0, n)}
						<span style={{opacity: 0}}>{t.slice(n)}</span>
					</div>
				);
			})}
			<Ink id="s3u" d="M 110 735 C 400 722, 700 744, 1000 728" at={cue('last')} color={TEAL} width={9} />
			<Sfx n="type0" at={cue('what')} v={0.3} />
			<Sfx n="type1" at={cue('evidence')} v={0.3} />
			<Sfx n="slap0" at={cue('courtroom') - 4} />
			<S n="riser" at={cue('how') - 50} v={0.35} />
		</Board>
	);
};

// 4 · 21,000 cases thrown out; a family tree caught a killer 40 years on
export const S04: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s4t" text="In real life" x={110} y={120} rot={-2} at={0} size={34} />
		<CountUp id="s4n" to={21000} at={cue('twenty')} dur={26} x={110} y={250} size={210} suffix="+" />
		<div style={{position: 'absolute', left: 120, top: 480, fontFamily: 'Elite', fontSize: 40, letterSpacing: 4, color: V.ink, opacity: lerp(useCurrentFrame(), cue('cases'), cue('cases') + 6, 0, 1)}}>CASES THROWN OUT</div>
		<MarkerNote id="s4m" text="because of one chemist" x={130} y={560} at={cue('chemist')} size={52} rot={-2} />
		<IconCard k="tree" label="A family tree" sub="caught a killer" x={1180} y={200} at={cue('family')} id="s4c" rot={2} />
		<Ransom id="s4r" text="40+ YEARS" x={1060} y={760} size={110} rot={-3} at={cue('forty')} />
		<Sfx n="slap0" at={cue('twenty')} />
		<Sfx n="marker_l" at={cue('chemist')} />
		<Sfx n="slap1" at={cue('family')} />
		<Sfx n="slap2" at={cue('forty')} />
		<S n="riser" at={cue('began') - 40} v={0.4} />
	</Board>
);

// 5 · the ident
export const S05: React.FC<ShotProps> = ({d, cue}) => <Ident t={T} d={d} welcomeAt={cue('welcome')} everyAt={cue('every')} caseAt={cue('case')} photo={I('courtroom')} />;

// 6 · the case brief: three questions
export const S06: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<SlidePiece id="s6s1" label={'CASE 003\nBRIEF'} x={120} y={120} at={0} rot={-8} w={300} />
		<CaseBrief t={T} qs={['Would his science get into court?', 'What if the man in the lab is the criminal?', 'How long would he really survive?']} ats={[cue('one'), cue('two'), cue('three', 1)]} x={460} y={240} />
		<S n="pin" at={2} />
		<Sfx n="type0" at={cue('one')} v={0.3} />
		<Sfx n="type1" at={cue('two')} v={0.3} />
		<Sfx n="type2" at={cue('three', 1)} v={0.3} />
	</Board>
);

const BookCover: React.FC<{at: number}> = ({at}) => (
	<Piece id="s7book" x={120} y={250} rot={-4} at={at}>
		<div style={{width: 420, height: 600, background: 'linear-gradient(160deg,#0E3A3C,#071C1E)', boxShadow: '10px 14px 20px rgba(0,0,0,.45)', padding: '60px 40px', boxSizing: 'border-box', borderLeft: '14px solid #052022'}}>
			<div style={{fontFamily: 'Elite', fontSize: 24, letterSpacing: 6, color: '#9FD6D2'}}>A NOVEL · 2004</div>
			<div style={{fontFamily: 'Caslon', fontSize: 70, lineHeight: 1.02, color: '#F3EEE3', marginTop: 40}}>Darkly Dreaming Dexter</div>
			<div style={{width: 120, height: 4, background: TEAL, margin: '40px 0 20px'}} />
			<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 38, color: '#CFE7E3'}}>Jeff Lindsay</div>
		</div>
	</Piece>
);

// 7 · first, the fiction: a 2004 novel, a Showtime series, eight seasons
export const S07: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s7t" text="First, the fiction" x={110} y={100} rot={-2} at={0} size={34} />
		<BookCover at={cue('novel')} />
		<Clip n="eo_suit" x={1230} y={470} w={860} rot={1.5} on={cue('showtime')} rate={0.6} />
		<Credit text={CR_ORIG} x={950} y={880} id="s7cr" at={cue('showtime') + 6} />
		<Tag id="s7m" text="Michael C. Hall as Dexter Morgan" x={880} y={120} rot={1.5} at={cue('michael')} size={28} />
		<Ransom id="s7r" text="8 SEASONS" x={620} y={900} size={100} rot={-2} at={cue('eight')} />
		<Sfx n="slap0" at={cue('novel')} />
		<Sfx n="slap1" at={cue('michael')} />
		<Sfx n="slap2" at={cue('eight')} />
	</Board>
);

// 8 · a blood spatter analyst for Miami Metro: drops, smears, angles; never wrong
export const S08: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s8p" src={I('microscopes')} w={620} h={420} x={110} y={170} rot={-2} at={0} />
		<Caption text="A real crime lab, 1975" x={130} y={610} at={4} id="s8c" size={20} />
		<Piece id="s8id" x={140} y={700} rot={3} at={cue('miami')}>
			<div style={{width: 520, background: '#fff', borderRadius: 14, boxShadow: '6px 10px 16px rgba(0,0,0,.35)', overflow: 'hidden'}}>
				<div style={{background: TEAL, color: '#fff', fontFamily: 'Bebas', fontSize: 34, letterSpacing: 3, padding: '8px 20px'}}>MIAMI METRO POLICE · FORENSICS</div>
				<div style={{padding: '14px 20px', fontFamily: 'Elite', fontSize: 26, color: V.ink, lineHeight: 1.5}}>
					DEXTER MORGAN
					<br />
					BLOOD SPATTER ANALYST
				</div>
				<div style={{padding: '0 20px 10px', fontFamily: 'Elite', fontSize: 16, color: '#777'}}>(a fictional ID)</div>
			</div>
		</Piece>
		<SlidePiece id="s8a" label="DROPS" x={900} y={190} at={cue('drops')} rot={-5} w={420} />
		<SlidePiece id="s8b" label="SMEARS" x={1000} y={360} at={cue('smears')} rot={3} w={420} />
		<SlidePiece id="s8c2" label="ANGLES" x={920} y={530} at={cue('angles')} rot={-2} w={420} />
		<Ink id="s8ang" d="M 1420 260 L 1700 260 M 1420 260 L 1650 140" at={cue('angles') + 2} color={TEAL} width={6} />
		<Ink id="s8arc" d="M 1520 260 A 100 100 0 0 0 1505 205" at={cue('angles') + 8} color={TEAL} width={5} dur={6} />
		<Ransom id="s8r" text="NEVER WRONG" x={860} y={790} size={110} rot={-3} at={cue('never')} />
		<Sfx n="slap0" at={cue('miami')} />
		<S n="slide" at={cue('drops')} v={0.5} />
		<S n="slide" at={cue('smears')} v={0.5} />
		<S n="slide" at={cue('angles')} v={0.5} />
		<Sfx n="slap1" at={cue('never')} />
	</Board>
);

// 9 · the idea the show rests on → the suspect goes up on the evidence board
export const S09: React.FC<ShotProps> = ({d, cue}) => {
	const f2 = useTwos();
	const a = 'The man the system trusts most';
	const b = 'is the one it should trust least.';
	const na = Math.max(0, Math.floor((f2 - cue('man')) * 1.3));
	const nb = Math.max(0, Math.floor((f2 - cue('is')) * 1.3));
	const toBoard = cue('least') + 24;
	if (useCurrentFrame() >= toBoard) return <EvidenceBoard t={T} items={BOARD} shown={0} newAt={4} d={d - toBoard} />;
	return (
		<Board dark>
			<Clip n="r1_close" x={1420} y={300} w={620} rot={2} on={0} rate={0.6} />
			<Credit text={CR_RES} x={1200} y={560} id="s9cr" dark />
			<div style={{position: 'absolute', left: 110, top: 600, fontFamily: 'Caslon', fontSize: 74, color: '#E9E4D8', lineHeight: 1.15}}>
				{a.slice(0, na)}
				<span style={{opacity: 0}}>{a.slice(na)}</span>
				<br />
				<span style={{color: '#7FD3CE'}}>{b.slice(0, nb)}</span>
				<span style={{opacity: 0}}>{b.slice(nb)}</span>
			</div>
			<Sfx n="type0" at={cue('man')} v={0.25} />
		</Board>
	);
};

const Badge: React.FC<{label: string}> = ({label}) => <SlidePiece id="exb" label={label} x={1330} y={180} at={20} rot={6} w={420} glow={0.4} />;

// 10 · Exhibit A: the gatekeeper
export const S10: React.FC<ShotProps> = ({d}) => (
	<ExhibitCard t={T} letter="A" title="The gatekeeper" d={d}>
		<Badge label={'EXHIBIT A\nADMISSIBLE?'} />
		<S n="gavel" at={30} v={0.5} />
	</ExhibitCard>
);

// 11 · a judge decides first; two tests
export const S11: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Plate src={I('courtroom')} d={d} pos="50% 60%" />
		<Caption text="Expert witness?" x={1260} y={250} at={cue('expert')} id="s11a" size={34} />
		<Caption text="First, the judge decides" x={1180} y={340} at={cue('judge')} id="s11b" size={34} />
		<IconCard k="gavel" label="The gatekeeper" sub="is the science good enough?" x={140} y={260} at={cue('judge')} id="s11c" rot={-2} accent={AMBER} />
		<Ransom id="s11r" text="2 TESTS" x={1180} y={720} size={120} rot={-3} at={cue('two')} />
		<Credit text="Courtroom, U.S. Courthouse, Tallahassee · Carol M. Highsmith, Library of Congress" x={140} y={1000} id="s11cr" at={4} dark />
		<Sfx n="slap0" at={cue('expert')} />
		<S n="gavel" at={cue('judge')} v={0.45} />
		<Sfx n="slap1" at={cue('two')} />
	</AbsoluteFill>
);

// 12 · Frye (1923): generally accepted?
export const S12: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={1} title="The Frye test" sub="Frye v. United States, 1923" at={cue('frye')} id="s12t" />
		<Cutout id="s12p" src={I('polygraph')} w={380} h={540} x={1430} y={160} rot={3} at={cue('lie') - 4} pos="50% 40%" />
		<Caption text="A polygraph, 1976" x={1450} y={730} at={cue('lie')} id="s12c" size={20} />
		<MarkerNote id="s12m" text="it began with an early lie detector" x={120} y={420} at={cue('lie')} size={44} rot={-2} />
		<Pleading id="s12q" x={140} y={560} w={1150} at={cue('asks')} head="The Frye question" lines={['Is this method generally accepted', 'by the experts in its own field?']} hl={[0]} hlAt={cue('generally')} size={40} />
		<Sfx n="slap0" at={cue('frye')} />
		<Sfx n="slap1" at={cue('lie') - 4} />
		<Sfx n="type1" at={cue('asks')} v={0.3} />
		<Sfx n="marker_s" at={cue('generally')} />
	</Board>
);

// 13 · Daubert (1993): tested? peer reviewed? error rate?
export const S13: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={2} title="The Daubert test" sub="U.S. Supreme Court, 1993" at={cue('daubert')} id="s13t" />
		<Cutout id="s13p" src={I('us_supreme')} w={700} h={520} x={1100} y={110} rot={2} at={cue('supreme') - 4} />
		<Caption text="U.S. Supreme Court · Carol M. Highsmith, LoC" x={1120} y={660} at={cue('supreme')} id="s13c" size={18} />
		<MarkerNote id="s13g" text="the judge = gatekeeper" x={120} y={420} at={cue('gatekeeper')} size={50} rot={-2} color={AMBER} />
		<MarkerNote id="s13a" text="☐ tested?" x={160} y={560} at={cue('tested')} size={60} />
		<MarkerNote id="s13b" text="☐ peer reviewed?" x={160} y={660} at={cue('peer')} size={60} />
		<MarkerNote id="s13c2" text="☐ error rate?" x={160} y={760} at={cue('error')} size={60} />
		<InkCircle x={330} y={800} r={60} at={cue('rate') + 6} id="s13o" />
		<Sfx n="slap0" at={cue('daubert')} />
		<Sfx n="slap1" at={cue('supreme') - 4} />
		<Sfx n="marker_s" at={cue('tested')} />
		<Sfx n="marker_s" at={cue('peer')} />
		<Sfx n="marker_s" at={cue('error')} />
		<Sfx n="scribble" at={cue('rate') + 6} />
	</Board>
);

const YearCard: React.FC<{y: string; who: string; yes: boolean; x: number; at: number; id: string; rot: number}> = ({y, who, yes, x, at, id, rot}) => (
	<Piece id={id} x={x} y={560} rot={rot} at={at}>
		<div style={{width: 330, background: '#FBF8EF', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', borderTop: `14px solid ${yes ? TEAL : '#8B8780'}`, padding: '18px 22px', textAlign: 'center'}}>
			<div style={{fontFamily: 'Anton', fontSize: 92, lineHeight: 1, color: V.ink}}>{y}</div>
			<div style={{fontFamily: 'Elite', fontSize: 22, letterSpacing: 2, color: '#5d5a55', marginTop: 10, minHeight: 56}}>{who}</div>
			<div style={{fontFamily: 'Bebas', fontSize: 58, color: yes ? TEAL : '#8B8780', marginTop: 4}}>{yes ? 'DAUBERT ✓' : 'NO ✗'}</div>
		</div>
	</Piece>
);

// 14 · Florida couldn't make up its mind: 2013, 2017, 2018, 2019
export const S14: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s14p" src={I('fl_supreme')} w={560} h={360} x={110} y={110} rot={-2} at={cue('florida') - 4} />
		<Caption text="Florida Supreme Court, Tallahassee" x={130} y={490} at={cue('florida')} id="s14c" size={20} />
		<MarkerNote id="s14m" text="couldn't make up its mind" x={780} y={200} at={cue('mind')} size={64} rot={-3} />
		<YearCard y="2013" who="STATE LEGISLATURE" yes x={110} at={cue('thirteen')} id="s14a" rot={-3} />
		<YearCard y="2017" who="FLORIDA SUPREME COURT" yes={false} x={540} at={cue('seventeen')} id="s14b" rot={2} />
		<YearCard y="2018" who="SUPREME COURT, AGAIN" yes={false} x={970} at={cue('eighteen')} id="s14c3" rot={-2} />
		<YearCard y="2019" who="SUPREME COURT CHANGES ITS MIND" yes x={1400} at={cue('nineteen')} id="s14d" rot={3} />
		<Sfx n="slap0" at={cue('florida') - 4} />
		<Sfx n="marker_l" at={cue('mind')} />
		<Sfx n="slap1" at={cue('thirteen')} />
		<Sfx n="slap2" at={cue('seventeen')} />
		<Sfx n="slap0" at={cue('eighteen')} />
		<S n="gavel" at={cue('nineteen')} v={0.45} />
	</Board>
);

// 15 · the show ran in the Frye years: an expert only had to convince other experts
export const S15: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	const X = (y: number) => 160 + ((y - 2004) / (2021 - 2004)) * 1600;
	const runP = lerp(frame, cue('run') - 4, cue('run') + 16, 0, 1);
	const fryeP = lerp(frame, cue('older') - 4, cue('older') + 20, 0, 1);
	return (
		<Board>
			<Tag id="s15t" text="Florida courts vs. the show" x={110} y={110} rot={-2} at={0} size={32} />
			{[2006, 2009, 2013, 2016, 2019].map((y) => (
				<div key={y} style={{position: 'absolute', left: X(y) - 40, top: 610, width: 80, textAlign: 'center', fontFamily: 'Elite', fontSize: 28, color: '#5d5a55'}}>
					{y}
				</div>
			))}
			<div style={{position: 'absolute', left: 160, top: 600, width: 1600, height: 3, background: V.ink}} />
			<div style={{position: 'absolute', left: X(2004), top: 420, width: (X(2019.4) - X(2004)) * fryeP, height: 90, background: AMBER, opacity: 0.9, display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: 'Bebas', fontSize: 54, color: V.ink, overflow: 'hidden', whiteSpace: 'nowrap'}}>
				EFFECTIVELY THE FRYE TEST
			</div>
			<div style={{position: 'absolute', left: X(2019.4), top: 420, width: (X(2021) - X(2019.4)) * lerp(frame, cue('older') + 18, cue('older') + 26, 0, 1), height: 90, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas', fontSize: 34, color: '#fff', overflow: 'hidden'}}>
				DAUBERT
			</div>
			<div style={{position: 'absolute', left: X(2006.75), top: 300, width: (X(2013.72) - X(2006.75)) * runP, height: 80, background: V.ink, display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: 'Bebas', fontSize: 46, color: '#F3EEE3', overflow: 'hidden', whiteSpace: 'nowrap'}}>
				DEXTER · 2006–2013
			</div>
			<Ransom id="s15r" text="OTHER EXPERTS" x={560} y={760} size={110} rot={-2} at={cue('other')} />
			<MarkerNote id="s15m" text="only had to convince..." x={160} y={700} at={cue('convince') - 6} size={48} rot={-3} />
			<Sfx n="whoosh" at={cue('run') - 4} />
			<Sfx n="whoosh" at={cue('older') - 4} />
			<Sfx n="marker_s" at={cue('convince') - 6} />
			<Sfx n="slap1" at={cue('other')} />
		</Board>
	);
};

// 16 · Exhibit A, answered: his testimony walks straight in (onto the board)
export const S16: React.FC<ShotProps> = ({d, cue}) => (
	<EvidenceBoard t={T} items={BOARD} shown={1} newAt={cue('walks') - 6} d={d}>
		<div style={{position: 'absolute', left: 0, top: 0, opacity: lerp(useCurrentFrame(), cue('holding') - 4, cue('holding') + 4, 0, 1)}}>
			<MarkerNote id="s16m" text="...but will it hold up?" x={700} y={900} at={cue('holding') - 4} size={56} color="#F3EEE3" rot={-3} />
		</div>
	</EvidenceBoard>
);
