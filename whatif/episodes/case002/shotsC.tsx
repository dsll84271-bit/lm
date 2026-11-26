/** Case File 002, paragraphs 32–47: the 1843 report, the sledge hammer, Dickens at twelve, and the verdict. */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {CaseClosed} from '../../docs-kit/case';
import {Cutout, Ink, MarkerNote, Ransom, Tag, TitleCard} from '../../docs-kit/vox';
import {Board, Book, Chapter, Gravestone, I, Pic, Quote, Sfx, Snow} from './parts';
import type {ShotProps} from './timeline';

const TRAPPER = 'case002/img/trapper_1842.png';

// 32 · February 1843: the report into child labour
export const S32: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TitleCard fig={4} title="The 1843 report" sub="Children's Employment Commission" at={0} />
		<Cutout id="s32a" src={TRAPPER} w={760} h={436} x={980} y={130} rot={2} at={cue('child')} />
		<Tag id="s32b" text="A child 'trapper' in a coal mine · from the 1842 mines report" x={1000} y={610} rot={-1} at={cue('child') + 4} size={20} />
		<Ransom id="s32c" text="AGE 3" x={160} y={520} size={150} rot={-3} at={cue('three')} />
		<MarkerNote id="s32d" text="many at five" x={180} y={760} at={cue('five') - 4} size={60} rot={-2} />
		<MarkerNote id="s32e" text="most working by 7 or 8" x={900} y={760} at={cue('seven') - 6} size={60} rot={2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('child')} />
		<Sfx n="slap2" at={cue('three')} />
		<Sfx n="marker_l" at={cue('five') - 4} />
		<Sfx n="marker_l" at={cue('seven') - 6} />
	</Board>
);

// 33 · horrified: the Cornish tin mines, a ragged school
export const S33: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s33a" src={I('dickens_1867')} w={380} h={520} x={150} y={260} rot={-2} at={0} pos="50% 30%" />
		<Ransom id="s33b" text="HORRIFIED" x={640} y={150} size={120} rot={-2} at={cue('horrified') - 4} />
		<MarkerNote id="s33c" text="children in the Cornish tin mines" x={680} y={480} at={cue('cornish') - 6} size={54} rot={-2} />
		<MarkerNote id="s33d" text="half-starved children at a ragged school" x={680} y={640} at={cue('ragged') - 8} size={54} rot={2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('horrified') - 4} />
		<Sfx n="marker_l" at={cue('cornish') - 6} />
		<Sfx n="marker_l" at={cue('ragged') - 8} />
	</Board>
);

// 34 · the pamphlet he never wrote, and the sledge hammer
export const S34: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Book id="s34a" title="An Appeal to the People of England" sub="on behalf of the Poor Man's Child" x={140} y={160} at={cue('pamphlet') - 4} w={600} rot={-3} />
		<InkX x={440} y={360} at={cue('changed')} id="s34x" />
		<Quote id="s34b" text="a Sledge hammer has come down with twenty times the force — twenty thousand times the force" source="Dickens to Dr Southwood Smith, March 1843" x={820} y={330} w={960} size={52} at={cue('wrote') - 4} />
		<Sfx n="slap0" at={cue('pamphlet') - 4} />
		<Sfx n="scribble" at={cue('changed')} />
		<Sfx n="slap1" at={cue('wrote') - 4} />
	</Board>
);

// 35 · that sledge hammer was A Christmas Carol
export const S35: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s35a" src={I('marley_plate')} w={520} h={680} x={1240} y={180} rot={3} at={0} pos="50% 55%" />
		<Ransom id="s35b" text="A CHRISTMAS CAROL" x={110} y={420} size={110} rot={-2} at={cue('christmas') - 8} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('christmas') - 8} />
	</Board>
);

// 36 · "Are there no prisons? … workhouses?": the Poor Law of 1834
export const S36: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Quote id="s36a" text="Are there no prisons? … And the Union workhouses?" source="Scrooge, A Christmas Carol" x={160} y={150} w={1100} size={64} at={cue('prisons') - 10} />
		<Tag id="s36b" text="The New Poor Law, 1834" x={1240} y={520} rot={2} at={cue('poor') - 4} size={40} />
		<MarkerNote id="s36c" text="families split apart" x={260} y={620} at={cue('families') - 4} size={62} rot={-2} />
		<MarkerNote id="s36d" text="work for your food" x={260} y={780} at={cue('food') - 6} size={62} rot={2} />
		<Sfx n="slap0" at={cue('prisons') - 10} />
		<Sfx n="slap1" at={cue('poor') - 4} />
		<Sfx n="marker_l" at={cue('families') - 4} />
		<Sfx n="marker_l" at={cue('food') - 6} />
	</Board>
);

// 37 · the surplus population: Thomas Malthus
export const S37: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Ransom id="s37a" text="SURPLUS POPULATION" x={110} y={120} size={90} rot={-2} at={0} />
		<Cutout id="s37b" src={I('malthus')} w={420} h={560} x={1300} y={300} rot={2} at={cue('malthus') - 4} pos="50% 30%" />
		<Tag id="s37c" text="Thomas Malthus, economist" x={1320} y={900} rot={-1.5} at={cue('malthus')} size={26} />
		<MarkerNote id="s37d" text={'"the poor multiply\nfaster than food"'} x={200} y={420} at={cue('multiplying') - 4} size={60} rot={-2} />
		<MarkerNote id="s37e" text="the cold economics of his day" x={200} y={720} at={cue('economics') - 8} size={56} rot={2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('malthus') - 4} />
		<Sfx n="marker_l" at={cue('multiplying') - 4} />
		<Sfx n="marker_l" at={cue('economics') - 8} />
	</Board>
);

// 38 · Ignorance and Want
export const S38: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Cutout id="s38a" src={I('third_plate')} w={560} h={720} x={1180} y={180} rot={2.5} at={0} pos="50% 40%" />
		<Tag id="s38b" text="The Ghost of Christmas Present · Leech, 1843" x={1200} y={930} rot={-1} at={4} size={20} />
		<Quote id="s38c" text="This boy is Ignorance. This girl is Want." source="A Christmas Carol, 1843" x={140} y={300} w={900} size={66} at={cue('ignorance') - 8} dark />
		<MarkerNote id="s38d" text="based on real children he had seen" x={160} y={720} at={cue('based') - 4} size={52} rot={-2} color="#F1EDE4" />
		<Snow n={50} opacity={0.4} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('ignorance') - 8} />
		<Sfx n="marker_l" at={cue('based') - 4} />
	</Board>
);

// 39 · the most personal clue
export const S39: React.FC<ShotProps> = () => <Chapter n={4} title="Personal" at={0} />;

// 40 · Dickens at twelve: the debtors' prison and the blacking factory
export const S40: React.FC<ShotProps> = ({d, cue}) => (
	<Board dark>
		<Pic src={I('blacking_barnard')} d={d} from={1.05} to={1.18} pos="50% 40%" />
		<Tag id="s40a" text="Dickens at the blacking warehouse · Fred Barnard, 1892" x={120} y={980} rot={1} at={6} size={20} />
		<Ransom id="s40b" text="AGE 12" x={1300} y={120} size={130} rot={3} at={cue('twelve')} />
		<MarkerNote id="s40c" text={'10 hours a day\n6 shillings a week'} x={1260} y={640} at={cue('ten') - 4} size={60} rot={-2} color="#F1EDE4" />
		<Sfx n="slap0" at={cue('twelve')} />
		<Sfx n="marker_l" at={cue('ten') - 4} />
	</Board>
);

// 41 · "how I could have been so easily cast away at such an age"
export const S41: React.FC<ShotProps> = ({cue}) => (
	<AbsoluteFill style={{background: '#0F0E11'}}>
		<Quote id="s41a" text="how I could have been so easily cast away at such an age" source="Charles Dickens" x={300} y={330} w={1320} size={68} at={cue('wondered') - 6} dark />
		<Snow n={40} opacity={0.3} />
		<Sfx n="type0" at={cue('wondered') - 2} v={0.25} />
	</AbsoluteFill>
);

// 42 · the boy who was cast away; six weeks; 19 December 1843; still retold
export const S42: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s42a" src={I('scrooge_cratchit_1843')} w={480} h={610} x={140} y={200} rot={-2} at={0} />
		<Tag id="s42b" text="Scrooge, changed · Leech, 1843" x={160} y={850} rot={1} at={4} size={20} />
		<Ransom id="s42c" text="6 WEEKS" x={760} y={170} size={120} rot={-2} at={cue('six') - 4} />
		<TitleCardLike at={cue('nineteenth') - 6} />
		<MarkerNote id="s42e" text="still retold: Ebenezer (2026)" x={780} y={760} at={cue('johnny') - 8} size={56} rot={-2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('six') - 4} />
		<Sfx n="slap2" at={cue('nineteenth') - 6} />
		<Sfx n="marker_l" at={cue('johnny') - 8} />
	</Board>
);
const TitleCardLike: React.FC<{at: number}> = ({at}) => <Tag id="s42d" text="Published 19 December 1843" x={800} y={470} rot={1.5} at={at} size={44} />;

// 43 · so, let's look at the evidence
export const S43: React.FC<ShotProps> = () => (
	<Board>
		<Ransom id="s43" text="THE EVIDENCE" x={300} y={430} size={160} rot={-2} at={4} />
		<Sfx n="slap0" at={4} />
		<Sfx n="slap1" at={8} />
		<Sfx n="slap2" at={12} />
	</Board>
);

const Card: React.FC<{n: number; img: string; text: string; x: number; y: number; at: number; rot: number}> = ({n, img, text, x, y, at, rot}) => (
	<>
		<Cutout id={`ev${n}`} src={img} w={420} h={300} x={x} y={y} rot={rot} at={at} pos="50% 30%" />
		<Tag id={`evt${n}`} text={text} x={x + 10} y={y + 340} rot={-rot / 2} at={at + 4} size={24} />
		<Ink id={`evk${n}`} d={`M ${x + 370} ${y + 40} L ${x + 400} ${y + 75} L ${x + 460} ${y - 10}`} at={at + 10} dur={5} width={10} len={160} />
	</>
);

// 44 · the evidence, item by item
export const S44: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Card n={1} img={I('elwes_1801')} text="Real misers, worse than Scrooge" x={110} y={220} at={cue('misers')} rot={-2} />
		<Card n={2} img={I('malthus')} text="Real cruel policies" x={740} y={260} at={cue('policies') - 4} rot={2} />
		<Card n={3} img={TRAPPER} text="Real children he had seen" x={1370} y={220} at={cue('children') - 4} rot={-1.5} />
		{['misers', 'policies', 'children'].map((w) => (
			<React.Fragment key={w}>
				<Sfx n="slap1" at={cue(w) - 4} />
				<Sfx n="marker_s" at={cue(w) + 6} />
			</React.Fragment>
		))}
	</Board>
);

// 45 · no single real Scrooge; the gravestone is probably a myth; a mix of real men
export const S45: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s45a" text="One real Scrooge" x={200} y={200} rot={-2} at={cue('single') - 6} size={60} />
		<Ink id="s45b" d="M 180 250 L 760 210" at={cue('single')} dur={6} width={10} len={620} />
		<div style={{position: 'absolute', left: 0, top: 0, transform: 'scale(0.55)', transformOrigin: '1300px 100px'}}>
			<Gravestone x={1300} y={120} at={cue('gravestone') - 6} misread={cue('gravestone') - 6} />
		</div>
		<MarkerNote id="s45c" text="probably a myth" x={1260} y={560} at={cue('myth') - 4} size={56} rot={3} />
		<MarkerNote id="s45d" text="a mix of real men" x={200} y={460} at={cue('mix') - 4} size={70} rot={-2} />
		<MarkerNote id="s45e" text="the worst of him: the real world" x={200} y={680} at={cue('worst') - 4} size={64} rot={2} color="#B8231E" />
		<Sfx n="slap0" at={cue('single') - 6} />
		<Sfx n="scribble" at={cue('single')} />
		<Sfx n="marker_l" at={cue('myth') - 4} />
		<Sfx n="marker_l" at={cue('mix') - 4} />
		<Sfx n="marker_l" at={cue('worst') - 4} />
	</Board>
);

// 46–47 · the verdict, case closed, next case: you decide
export const S46: React.FC<ShotProps> = ({cue}) => {
	const seven = cue('seven');
	const closed = cue('case');
	const next = cue('investigate') - 16;
	return (
		<AbsoluteFill>
			<CaseClosed score={7} question="How real is Ebenezer Scrooge?" next="YOU DECIDE" scoreAt={seven - 28} closedAt={closed} nextAt={next} sting={false} />
			<Snow n={60} opacity={0.4} />
			<Sequence from={Math.max(0, closed - 120)} layout="none">
				<Audio src={staticFile('doc01/music/sting_outro.wav')} volume={0.55} />
			</Sequence>
		</AbsoluteFill>
	);
};

