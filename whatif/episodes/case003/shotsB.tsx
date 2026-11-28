/** Case File 003, paragraphs 17–34: Exhibit B (the science on the stand) and Exhibit C (the insider). */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {lerp, Stamp} from '../../docs-kit/kit';
import {EvidenceBoard, ExhibitCard, HOUSE_RED, S} from '../../docs-kit/series';
import {Cutout, Ink, InkX, MarkerNote, Piece, Ransom, Tag, TitleCard, useTwos, V} from '../../docs-kit/vox';
import {BOARD} from './board';
import {AMBER, Board, Caption, Clip, CountUp, Credit, I, IconCard, Plate, Pleading, Sfx, Slide, SlidePiece, T, TEAL} from './parts';
import type {ShotProps} from './timeline';

const Badge: React.FC<{label: string}> = ({label}) => <SlidePiece id="exb" label={label} x={1330} y={180} at={20} rot={6} w={420} glow={0.4} />;

/** A typed quotation on a clean card, with its source. */
const QuoteCard: React.FC<{text: string; source: string; x: number; y: number; w?: number; at: number; id: string; size?: number; rot?: number; accent?: string}> = ({text, source, x, y, w = 900, at, id, size = 52, rot = -1.2, accent = TEAL}) => {
	const f2 = useTwos();
	const n = Math.max(0, Math.floor((f2 - at - 4) * 2.6));
	return (
		<Piece id={id} x={x} y={y} rot={rot} at={at}>
			<div style={{width: w, background: '#FBF8EF', padding: '34px 44px 28px', boxShadow: '6px 9px 16px rgba(29,28,32,.32)', borderLeft: `14px solid ${accent}`}}>
				<div style={{fontFamily: 'Caslon', fontStyle: 'italic', fontSize: size, lineHeight: 1.18, color: V.ink}}>
					“{text.slice(0, n)}
					<span style={{opacity: 0}}>{text.slice(n)}</span>”
				</div>
				<div style={{fontFamily: 'Elite', fontSize: 20, letterSpacing: 2.5, marginTop: 16, opacity: n >= text.length ? 1 : 0, color: '#4a4740'}}>— {source.toUpperCase()}</div>
			</div>
		</Piece>
	);
};

// 17 · Exhibit B: the science on the stand
export const S17: React.FC<ShotProps> = ({d}) => (
	<ExhibitCard t={T} letter="B" title="The science on the stand" d={d}>
		<Badge label={'EXHIBIT B\nRELIABLE?'} />
		<S n="slide" at={20} v={0.5} />
	</ExhibitCard>
);

/** A drop of ink hitting paper at an angle: the ellipse gives the angle away (drawn as geometry, not blood). */
const DropDiagram: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
	const f2 = useTwos();
	if (f2 < at) return null;
	const p = Math.min(1, (f2 - at) / 16);
	return (
		<svg width={620} height={360} style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: 'scale(1.35)', transformOrigin: '0 0'}}>
			<line x1={20} y1={300} x2={600} y2={300} stroke={V.ink} strokeWidth={3} />
			<line x1={120} y1={40} x2={120 + 220 * p} y2={40 + 260 * p} stroke={TEAL} strokeWidth={5} strokeDasharray="14 10" />
			{p >= 1 && <ellipse cx={360} cy={300} rx={70} ry={22} fill="none" stroke={V.ink} strokeWidth={5} />}
			{p >= 1 && (
				<>
					<path d="M 300 300 A 60 60 0 0 0 290 265" fill="none" stroke={AMBER} strokeWidth={5} />
					<text x={220} y={270} fontFamily="Elite" fontSize={30} fill={V.ink}>
						angle
					</text>
					<text x={300} y={350} fontFamily="Elite" fontSize={24} fill="#5d5a55">
						width ÷ length = sin(angle)
					</text>
				</>
			)}
		</svg>
	);
};

// 18 · MacDonell, 1971: Flight Characteristics and Stain Patterns of Human Blood
export const S18: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s18doc" x={110} y={120} rot={-2} at={cue('nineteen')}>
			<div style={{width: 640, background: '#F6F3EA', padding: '50px 54px', boxShadow: '8px 12px 22px rgba(29,28,32,.32)', textAlign: 'center', fontFamily: 'Elite', color: V.ink}}>
				<div style={{fontSize: 20, letterSpacing: 3}}>U.S. DEPARTMENT OF JUSTICE · LEAA</div>
				<div style={{fontSize: 18, letterSpacing: 2, marginTop: 6, color: '#5d5a55'}}>PR 71-4 · NOVEMBER 1971</div>
				<div style={{fontFamily: 'Caslon', fontSize: 52, lineHeight: 1.1, margin: '44px 0'}}>Flight Characteristics and Stain Patterns of Human Blood</div>
				<div style={{fontSize: 24}}>HERBERT L. MacDONELL</div>
				<div style={{fontSize: 18, color: '#5d5a55', marginTop: 6}}>CORNING, NEW YORK</div>
			</div>
		</Piece>
		<Ink id="s18u" d="M 230 520 C 400 512, 560 526, 690 516" at={cue('flight') + 4} color={AMBER} width={8} />
		<DropDiagram x={960} y={60} at={cue('worked') - 4} />
		<Cutout id="s18p" src={I('fbi_lab')} w={560} h={380} x={1160} y={560} rot={2} at={cue('police')} />
		<Caption text="A real crime lab, 1976" x={1180} y={960} at={cue('police') + 4} id="s18c" size={20} />
		<Tag id="s18t" text="Corning, New York" x={250} y={890} rot={-2} at={cue('corning')} size={28} />
		<Sfx n="slap0" at={cue('nineteen')} />
		<Sfx n="marker_s" at={cue('flight') + 4} />
		<Sfx n="scribble" at={cue('worked') - 4} />
		<Sfx n="slap1" at={cue('corning')} />
		<Sfx n="slap2" at={cue('police')} />
	</Board>
);

// 19 · 2009: the National Academy of Sciences — "enormous"; "more subjective than scientific"
export const S19: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s19t" text="National Academy of Sciences · 2009" x={110} y={100} rot={-2} at={cue('national')} size={32} />
		<Pleading
			id="s19q"
			x={110}
			y={200}
			w={1060}
			at={cue('uncertainties') - 4}
			head="Strengthening Forensic Science, p. 179"
			lines={['The uncertainties associated with', 'bloodstain pattern analysis', 'are enormous.']}
			hl={[2]}
			hlAt={cue('enormous')}
			size={44}
			cps={1.9}
		/>
		<QuoteCard text="In general, the opinions of bloodstain pattern analysts are more subjective than scientific." source="National Research Council, 2009, p. 178" x={900} y={640} w={900} at={cue('general') - 2} id="s19b" size={44} />
		<Ink id="s19u" d="M 1180 860 C 1350 852, 1520 866, 1690 858" at={cue('subjective') + 6} color={AMBER} width={8} />
		<Sfx n="slap0" at={cue('national')} />
		<Sfx n="type0" at={cue('uncertainties') - 4} v={0.3} />
		<Sfx n="marker_s" at={cue('enormous')} />
		<Sfx n="slap1" at={cue('general') - 2} />
	</Board>
);

// 20 · 2021: 75 analysts, 192 patterns, about one answer in nine wrong
export const S20: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const wrongAt = cue('wrong');
	return (
		<Board>
			<Tag id="s20t" text="NIJ-funded study · 2021" x={110} y={100} rot={-2} at={cue('twenty')} size={32} />
			<CountUp id="s20a" to={75} at={cue('seventy')} dur={18} x={120} y={200} size={170} comma={false} />
			<div style={{position: 'absolute', left: 130, top: 380, fontFamily: 'Elite', fontSize: 32, letterSpacing: 3, color: V.ink, opacity: f2 >= cue('analysts') ? 1 : 0}}>WORKING ANALYSTS</div>
			<CountUp id="s20b" to={192} at={cue('hundred')} dur={18} x={120} y={470} size={170} comma={false} />
			<div style={{position: 'absolute', left: 130, top: 650, fontFamily: 'Elite', fontSize: 32, letterSpacing: 3, color: V.ink, opacity: f2 >= cue('patterns') ? 1 : 0}}>PATTERNS, CAUSE ALREADY KNOWN</div>
			{Array.from({length: 9}).map((_, i) => {
				const at = cue('patterns') + 4 + i * 3;
				const bad = i === 6;
				return (
					<div key={i} style={{position: 'absolute', left: 900 + (i % 3) * 330, top: 170 + Math.floor(i / 3) * 230, opacity: f2 >= at ? 1 : 0}}>
						<Slide label={`ANSWER\n${i + 1}`} w={290} dim={bad && f2 >= wrongAt} />
						{bad && <InkX x={200} y={48} at={wrongAt} id="s20x" />}
					</div>
				);
			})}
			<Ransom id="s20r" text="11.2% WRONG" x={940} y={880} size={90} rot={-2} at={wrongAt + 4} />
			<Sfx n="slap0" at={cue('seventy')} />
			<Sfx n="slap1" at={cue('hundred')} />
			<S n="slide" at={cue('patterns') + 4} v={0.4} />
			<Sfx n="scribble" at={wrongAt} />
		</Board>
	);
};

// 21 · one in nine — and it can cost a man his life
export const S21: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Ransom id="s21r" text="1 IN 9" x={600} y={330} size={210} rot={-3} at={cue('one')} />
		<MarkerNote id="s21m" text="it can cost a man his life." x={520} y={720} at={cue('cost')} size={64} color="#F2D59A" rot={-2} />
		<Sfx n="slap0" at={cue('one')} />
		<Sfx n="marker_l" at={cue('cost')} />
		<S n="riser" at={cue('life') - 40} v={0.3} />
	</Board>
);

// 22 · Joe Bryan: Clifton, Texas, 1985; a flashlight; forty hours of training
export const S22: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={3} title="The case of Joe Bryan" sub="Clifton, Texas, 1985" at={cue('nineteen')} id="s22t" />
		<Piece id="s22a" x={110} y={430} rot={-1.5} at={cue('mickey')}>
			<div style={{width: 760, background: '#FBF8EF', padding: '22px 30px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', fontFamily: 'Elite', fontSize: 30, lineHeight: 1.6, color: V.ink}}>
				MICKEY BRYAN · teacher · killed at home
				<br />
				<span style={{opacity: useTwos() >= cue('joe') ? 1 : 0}}>JOE BRYAN · principal · at a conference</span>
			</div>
		</Piece>
		<MarkerNote id="s22m" text="another city" x={620} y={640} at={cue('conference') + 4} size={44} rot={-4} color={TEAL} />
		<SlidePiece id="s22s" label={'EVIDENCE\nFLASHLIGHT'} x={1060} y={190} at={cue('flashlight')} rot={4} w={520} />
		<MarkerNote id="s22n" text="“put him at the scene”" x={1050} y={420} at={cue('scene')} size={50} rot={-2} />
		<Ransom id="s22r" text="40 HOURS" x={1020} y={620} size={130} rot={-3} at={cue('forty')} />
		<MarkerNote id="s22o" text="of blood spatter training" x={1060} y={830} at={cue('training')} size={46} rot={-2} />
		<Sfx n="slap0" at={cue('nineteen')} />
		<Sfx n="type0" at={cue('mickey')} v={0.3} />
		<S n="slide" at={cue('flashlight')} v={0.5} />
		<Sfx n="slap1" at={cue('forty')} />
		<Sfx n="marker_s" at={cue('training')} />
	</Board>
);

// 23 · decades later: "not accurate or scientifically supported"; "my conclusions were wrong"; 33 years
export const S23: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Pleading
			id="s23p"
			x={110}
			y={120}
			w={1000}
			at={cue('commission') - 4}
			head="Texas Forensic Science Commission"
			lines={['The bloodstain testimony was', 'not accurate or', 'scientifically supported.']}
			hl={[1, 2]}
			hlAt={cue('accurate') + 4}
			size={42}
			cps={2}
		/>
		<QuoteCard text="My conclusions were wrong." source="The original expert, at a 2018 hearing" x={1080} y={200} w={720} at={cue('conclusions') - 4} id="s23q" size={58} rot={2} accent={AMBER} />
		<Piece id="s23c" x={1120} y={540} rot={-2} at={cue('parole')}>
			<div style={{width: 640, background: '#FBF8EF', padding: '20px 30px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', fontFamily: 'Elite', fontSize: 30, lineHeight: 1.6, color: V.ink}}>
				PAROLED · 31 MARCH 2020
				<br />
				AGE 79
			</div>
		</Piece>
		<Ransom id="s23r" text="33 YEARS" x={160} y={740} size={140} rot={-3} at={cue('thirty', 1)} />
		<Stamp text="CONVICTION STANDS" x={1440} y={880} at={cue('stands')} size={84} rot={-6} color={HOUSE_RED} />
		<Sfx n="type1" at={cue('commission') - 4} v={0.3} />
		<Sfx n="slap0" at={cue('conclusions') - 4} />
		<Sfx n="slap1" at={cue('parole')} />
		<Sfx n="slap2" at={cue('thirty', 1)} />
		<S n="stamp" at={cue('stands')} v={0.6} />
	</Board>
);

// 24 · to be fair to Dexter: better trained — but "most definitely made for TV"
export const S24: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s24a" x={110} y={140} rot={-2} at={cue("isn't")}>
			<div style={{width: 520, background: '#FBF8EF', padding: '22px 28px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', borderTop: '12px solid #8B8780', fontFamily: 'Elite', fontSize: 30, lineHeight: 1.5, color: V.ink}}>
				BRYAN CASE EXPERT
				<br />
				40 hours of training
			</div>
		</Piece>
		<Piece id="s24b" x={110} y={380} rot={1.5} at={cue('full')}>
			<div style={{width: 520, background: '#FBF8EF', padding: '22px 28px', boxShadow: '6px 9px 16px rgba(29,28,32,.3)', borderTop: `12px solid ${TEAL}`, fontFamily: 'Elite', fontSize: 30, lineHeight: 1.5, color: V.ink}}>
				DEXTER MORGAN
				<br />
				full-time lab analyst ✓
			</div>
		</Piece>
		<Clip n="eo_suit" x={1300} y={340} w={760} rot={2} on={cue('better') - 6} rate={0.6} />
		<QuoteCard text="most definitely made for TV" source="Jennifer Shen, former San Diego police crime-lab director, to Looper" x={110} y={760} w={1000} at={cue('definitely') - 6} id="s24q" size={56} accent={AMBER} />
		<Sfx n="slap0" at={cue("isn't")} />
		<Sfx n="slap1" at={cue('full')} />
		<Sfx n="slap2" at={cue('definitely') - 6} />
	</Board>
);

// 25 · Exhibit B, answered: the science is real, the certainty isn't
export const S25: React.FC<ShotProps> = ({d, cue}) => (
	<EvidenceBoard t={T} items={BOARD} shown={2} newAt={cue('real') - 4} d={d}>
		<MarkerNote id="s25m" text="real science. TV certainty." x={1150} y={700} at={cue('certain')} size={52} color="#F3EEE3" rot={-3} />
	</EvidenceBoard>
);

// 26 · Exhibit C: when the analyst is the criminal
export const S26: React.FC<ShotProps> = ({d}) => (
	<ExhibitCard t={T} letter="C" title="When the analyst is the criminal" d={d}>
		<Badge label={'EXHIBIT C\nTHE INSIDER'} />
	</ExhibitCard>
);

// 27 · the problem isn't the science, it's Dexter: hiding, taking, changing evidence
export const S27: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Clip n="r2_office" x={1300} y={420} w={900} rot={1.5} on={0} rate={0.6} />
		<Ransom id="s27r" text="IT'S DEXTER" x={110} y={170} size={120} rot={-3} at={cue('dexter')} />
		{(['hiding', 'taking', 'changing'] as const).map((w, i) => (
			<SlidePiece key={w} id={`s27${w}`} label={`EVIDENCE\n${w.toUpperCase()}`} x={140 + i * 40} y={420 + i * 160} at={cue(w)} rot={-5 + i * 4} w={440} />
		))}
		<MarkerNote id="s27m" text="a crime lab insider" x={1000} y={900} at={cue('insider')} size={50} color="#F2D59A" rot={-2} />
		<Sfx n="slap0" at={cue('dexter')} />
		<S n="slide" at={cue('hiding')} v={0.45} />
		<S n="slide" at={cue('taking')} v={0.45} />
		<S n="slide" at={cue('changing')} v={0.45} />
		<Sfx n="marker_s" at={cue('insider')} />
	</Board>
);

/** A lab logbook page where entries type on and one gets stamped. */
const Logbook: React.FC<{at: number; forgedAt: number}> = ({at, forgedAt}) => {
	const f2 = useTwos();
	const rows = ['SAMPLE 0412 · POSITIVE', 'SAMPLE 0413 · POSITIVE', 'SAMPLE 0414 · POSITIVE', 'SAMPLE 0415 · POSITIVE', 'SAMPLE 0416 · POSITIVE'];
	return (
		<Piece id="s28log" x={980} y={120} rot={2} at={at}>
			<div style={{width: 800, background: '#F4F1E6', padding: '30px 40px', boxShadow: '8px 12px 22px rgba(29,28,32,.32)', fontFamily: 'Elite', color: V.ink, position: 'relative'}}>
				<div style={{fontSize: 24, letterSpacing: 4, color: '#5d5a55', borderBottom: '2px solid #aaa', paddingBottom: 10}}>DRUG LAB LOG · ILLUSTRATION</div>
				{rows.map((r, i) => (
					<div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, lineHeight: 2, borderBottom: '1px solid #d8d3c6', opacity: f2 >= at + 4 + i * 3 ? 1 : 0}}>
						<span>{r}</span>
						<span style={{color: '#8B8780', fontSize: 24}}>NOT TESTED</span>
					</div>
				))}
				<Stamp text="FORGED" x={560} y={300} at={forgedAt} size={110} rot={-12} color={HOUSE_RED} />
			</div>
		</Piece>
	);
};

// 28 · Annie Dookhan, Boston, 2012: results for drugs never tested; forged signatures
export const S28: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={4} title="Annie Dookhan" sub="State drug lab, Boston, 2012" at={cue('annie')} id="s28t" />
		<Cutout id="s28p" src={I('ma_statehouse')} w={560} h={420} x={110} y={470} rot={-2} at={cue('boston')} />
		<Caption text="Boston, Massachusetts · C. M. Highsmith, LoC" x={130} y={900} at={cue('boston') + 4} id="s28c" size={18} />
		<Logbook at={cue('positive') - 6} forgedAt={cue('forged')} />
		<Sfx n="slap0" at={cue('annie')} />
		<Sfx n="slap1" at={cue('boston')} />
		<Sfx n="type0" at={cue('positive') - 6} v={0.3} />
		<S n="stamp" at={cue('forged')} v={0.6} />
	</Board>
);

/** Case folders stacking up as the count rises. */
const Folders: React.FC<{at: number; n?: number}> = ({at, n = 40}) => {
	const f2 = useTwos();
	return (
		<>
			{Array.from({length: n}).map((_, i) => {
				const show = f2 >= at + i;
				const col = i % 8,
					row = Math.floor(i / 8);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 1000 + col * 105 + (row % 2) * 30,
							top: 880 - row * 130,
							width: 150,
							height: 104,
							background: 'linear-gradient(160deg,#D9B77A,#C79F5E)',
							borderRadius: 4,
							transform: `rotate(${((i * 37) % 11) - 5}deg)`,
							boxShadow: '3px 5px 8px rgba(0,0,0,.3)',
							opacity: show ? 1 : 0,
						}}
					>
						<div style={{position: 'absolute', left: 10, top: -12, width: 56, height: 16, background: '#C9A564', borderRadius: '4px 4px 0 0'}} />
					</div>
				);
			})}
		</>
	);
};

// 29 · April 2017: 21,587 cases thrown out at once
export const S29: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s29t" text="Massachusetts · April 2017" x={110} y={100} rot={-2} at={cue('april')} size={32} />
		<CountUp id="s29n" to={21587} at={cue('twenty', 1)} dur={34} x={110} y={210} size={220} />
		<div style={{position: 'absolute', left: 120, top: 460, fontFamily: 'Elite', fontSize: 40, letterSpacing: 4, color: V.ink, opacity: lerp(useCurrentFrame(), cue('once') - 6, cue('once'), 0, 1)}}>CASES THROWN OUT · ALL AT ONCE</div>
		<Folders at={cue('doubt') - 10} />
		<QuoteCard text="the largest dismissal of wrongful convictions in American history" source="ACLU of Massachusetts" x={110} y={600} w={820} at={cue('campaigners')} id="s29q" size={42} accent={AMBER} />
		<Sfx n="slap0" at={cue('april')} />
		<Sfx n="slap1" at={cue('campaigners')} />
	</Board>
);

// 30 · Sonja Farak, Amherst: more than 24,000 drug charges dismissed
export const S30: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Ransom id="s30a" text="AGAIN" x={1200} y={150} size={120} rot={4} at={cue('again')} />
		<SlidePiece id="s30s" label={'EVIDENCE\nDRUGS'} x={110} y={470} at={cue('drugs')} rot={-4} w={460} />
		<MarkerNote id="s30n" text="secretly using them" x={130} y={650} at={cue('secretly')} size={46} rot={-3} />
		<TitleCard fig={5} title="Sonja Farak" sub="State drug lab, Amherst, Massachusetts" at={cue('sonja')} id="s30t" />
		<CountUp id="s30n" to={24075} at={cue('twenty')} dur={30} x={760} y={430} size={200} />
		<div style={{position: 'absolute', left: 770, top: 660, fontFamily: 'Elite', fontSize: 38, letterSpacing: 4, color: V.ink, opacity: lerp(useCurrentFrame(), cue('dismissed') - 6, cue('dismissed'), 0, 1)}}>DRUG CHARGES DISMISSED</div>
		<Tag id="s30s" text="16,449 cases · Special Master's report, 2019" x={770} y={760} rot={-1} at={cue('dismissed') + 6} size={24} />
		<Sfx n="slap2" at={cue('again')} />
		<S n="slide" at={cue('drugs')} v={0.5} />
		<Sfx n="slap0" at={cue('sonja')} />
		<Sfx n="slap1" at={cue('dismissed') + 6} />
	</Board>
);

// 31 · the rules: disclose anything that damages your witness; since 2009, the analyst can be cross-examined
export const S31: React.FC<ShotProps> = ({cue}) => {
	const frame = useCurrentFrame();
	const X = (y: number) => 260 + ((y - 2006) / (2014 - 2006)) * 1400;
	return (
		<Board>
			<IconCard k="gavel" label="Hand it over" sub="anything that damages your own witness" x={150} y={110} at={cue('prosecutors')} id="s31a" rot={-2} accent={AMBER} />
			<IconCard k="gavel" label="Take the stand" sub="since 2009: the analyst can be cross-examined" x={620} y={130} at={cue('analyst')} id="s31b" rot={2} />
			<Tag id="s31c" text="Melendez-Diaz v. Massachusetts (2009)" x={1100} y={200} rot={1} at={cue('analyst') + 6} size={24} />
			<div style={{position: 'absolute', left: X(2006.75), top: 760, width: (X(2013.72) - X(2006.75)) * lerp(frame, cue('middle') - 20, cue('middle'), 0, 1), height: 70, background: V.ink, color: '#F3EEE3', fontFamily: 'Bebas', fontSize: 40, paddingLeft: 20, display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap'}}>
				DEXTER · 2006–2013
			</div>
			{frame >= cue('middle') && <div style={{position: 'absolute', left: X(2009.48) - 3, top: 700, width: 6, height: 190, background: TEAL}} />}
			<MarkerNote id="s31m" text="2009 ↓" x={X(2009.48) - 60} y={620} at={cue('middle')} size={50} color={TEAL} rot={-3} />
			<Sfx n="slap0" at={cue('prosecutors')} />
			<Sfx n="slap1" at={cue('analyst')} />
			<Sfx n="marker_s" at={cue('middle')} />
		</Board>
	);
};

// 32 · the real version: every bloodstain report he ever signed, reopened
export const S32: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const every = cue('every');
	return (
		<Board dark>
			{Array.from({length: 24}).map((_, i) => {
				const col = i % 6,
					row = Math.floor(i / 6);
				const at = every + i;
				const re = f2 >= cue('microscope') + (i % 6) * 2;
				return (
					<div key={i} style={{position: 'absolute', left: 140 + col * 280, top: 120 + row * 190, opacity: f2 >= at ? 1 : 0, transform: `rotate(${((i * 29) % 9) - 4}deg)`}}>
						<div style={{width: 240, height: 160, background: '#F4F1E6', boxShadow: '4px 6px 10px rgba(0,0,0,.4)', padding: 14, fontFamily: 'Elite', fontSize: 16, color: V.ink, lineHeight: 1.5}}>
							BLOODSTAIN REPORT
							<br />
							ANALYST: D. MORGAN
							<br />
							CASE #{(4100 + i * 37).toString()}
						</div>
						{re && <div style={{position: 'absolute', left: 30, top: 54, padding: '2px 10px', border: `4px solid ${TEAL}`, color: TEAL, fontFamily: 'Bebas', fontSize: 38, transform: 'rotate(-10deg)'}}>REOPENED</div>}
					</div>
				);
			})}
			<MarkerNote id="s32m" text="killers could walk free" x={140} y={900} at={cue('killers')} size={56} color="#F2D59A" rot={-2} />
			<Ransom id="s32r" text="BIGGEST MESS" x={1000} y={880} size={100} rot={-3} at={cue('mess')} />
			<Sfx n="whoosh" at={every} />
			<S n="stamp" at={cue('microscope')} v={0.4} />
			<Sfx n="marker_l" at={cue('killers')} />
			<Sfx n="slap0" at={cue('mess')} />
		</Board>
	);
};

// 33 · for the record: no scandal like this at Miami-Dade's real crime lab
export const S33: React.FC<ShotProps> = ({d, cue}) => (
	<AbsoluteFill>
		<Plate src={I('miami_skyline')} d={d} />
		<Caption text="For the record" x={140} y={160} at={cue('record')} id="s33a" size={36} />
		<Caption text="Miami-Dade's real crime lab: no scandal like this found" x={140} y={240} at={cue('miami')} id="s33b" size={30} />
		<Stamp text="PURE FICTION" x={1300} y={700} at={cue('pure')} size={130} rot={-8} color={HOUSE_RED} onDark />
		<Credit text="Miami skyline · Carol M. Highsmith, Library of Congress" x={140} y={1000} id="s33cr" at={4} dark />
		<Sfx n="slap0" at={cue('record')} />
		<S n="stamp" at={cue('pure')} v={0.6} />
	</AbsoluteFill>
);

// 34 · Exhibit C, answered: his evidence might survive; Dexter wouldn't
export const S34: React.FC<ShotProps> = ({d, cue}) => (
	<EvidenceBoard t={T} items={BOARD} shown={3} newAt={cue('dexter') - 4} d={d}>
		<MarkerNote id="s34m" text="dexter wouldn't." x={420} y={1000} at={cue("wouldn't")} size={56} color="#F3EEE3" rot={-3} />
	</EvidenceBoard>
);

