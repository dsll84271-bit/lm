/** Case File 002, paragraphs 17–31: the darkest part, Jemmy Wood, Daniel Dancer, and the gravestone. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stamp} from '../../docs-kit/kit';
import {Cutout, Ink, MarkerNote, Piece, Ransom, Tag, TitleCard, V} from '../../docs-kit/vox';
import {Board, Book, Chapter, Gravestone, I, Quote, Sfx, Snow} from './parts';
import type {ShotProps} from './timeline';

// 17 · Scrooge at least had a fire. Elwes: eating was exercise enough.
export const S17: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s17a" src={I('scrooge_cratchit_1843')} w={460} h={580} x={130} y={200} rot={-2} at={0} pos="50% 50%" />
		<MarkerNote id="s17b" text="Scrooge: a small fire" x={150} y={820} at={2} size={50} rot={-2} />
		<Quote id="s17c" text="the fire was suffered to go out while Sir Harvey was at dinner, as eating was quite exercise enough." source="Topham, on the Elwes household" x={760} y={250} w={1000} size={52} at={cue('elwes') - 4} />
		<Sfx n="slap0" at={0} />
		<Sfx n="marker_s" at={2} />
		<Sfx n="slap1" at={cue('elwes') - 4} />
	</Board>
);

// 18 · the darkest part: a hundred houses, and "an old woman" as furniture
export const S18: React.FC<ShotProps> = ({cue}) => (
	<AbsoluteFill style={{background: '#17161A'}}>
		<Tag id="s18a" text="The darkest part" x={760} y={110} rot={-2} at={0} size={40} />
		<Ransom id="s18b" text="100+ HOUSES" x={500} y={240} size={120} rot={-2} at={cue('hundred')} />
		<Quote id="s18c" text="A couple of beds, a couple of chairs, a table, and an old woman, were all his furniture." source="Edward Topham, 1790" x={300} y={520} w={1300} size={56} at={cue('furniture') - 12} dark />
		<Snow n={50} opacity={0.35} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('hundred')} />
		<Sfx n="slap2" at={cue('furniture') - 12} />
	</AbsoluteFill>
);

// 19 · the nephew forces the door and finds Elwes close to death
export const S19: React.FC<ShotProps> = ({cue}) => (
	<AbsoluteFill style={{background: '#17161A'}}>
		<Cutout id="s19a" src={I('elwes_b')} w={420} h={600} x={1330} y={220} rot={3} at={cue('old') - 4} pos="50% 30%" />
		<MarkerNote id="s19b" text="an empty house" x={180} y={200} at={cue('empty')} size={64} rot={-2} color="#F1EDE4" />
		<MarkerNote id="s19c" text="the door forced open" x={180} y={360} at={cue('forced')} size={64} rot={2} color="#F1EDE4" />
		<MarkerNote id="s19d" text="close to death" x={180} y={520} at={cue('close')} size={78} rot={-2} color="#EDBD2E" />
		<Sfx n="marker_l" at={cue('empty')} />
		<Sfx n="slap0" at={cue('forced')} v={0.7} />
		<Sfx n="slap1" at={cue('old') - 4} />
		<Sfx n="marker_l" at={cue('close')} />
	</AbsoluteFill>
);

// 20 · the housekeeper, dead about two days
export const S20: React.FC<ShotProps> = ({cue}) => (
	<AbsoluteFill style={{background: '#0F0E11'}}>
		<Quote id="s20a" text="stretched out lifeless on a rug upon the floor. To all appearances she had been dead about two days." source="Edward Topham, 1790" x={260} y={260} w={1400} size={60} at={cue('found') - 6} dark />
		<Snow n={40} opacity={0.3} />
		<Sfx n="type0" at={cue('found') - 2} v={0.25} />
	</AbsoluteFill>
);

// 21 · Elwes survived. Scrooge only saw his lonely death in a vision.
export const S21: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s21a" src={I('last_spirit_1843')} w={520} h={680} x={170} y={180} rot={-2} at={0} />
		<Tag id="s21b" text="Scrooge sees his own grave · Leech, 1843" x={190} y={900} rot={1} at={4} size={20} />
		<MarkerNote id="s21c" text="Scrooge: a vision" x={860} y={300} at={cue('vision') - 6} size={70} rot={-3} />
		<MarkerNote id="s21d" text="Elwes: almost real" x={860} y={520} at={cue('almost') - 4} size={70} rot={2} color="#B8231E" />
		<Sfx n="slap0" at={0} />
		<Sfx n="marker_l" at={cue('vision') - 6} />
		<Sfx n="marker_l" at={cue('almost') - 4} />
	</Board>
);

// 22 · Dickens knew his story: he names Elwes in two later novels
export const S22: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s22a" src={I('dickens_1867')} w={380} h={520} x={150} y={240} rot={-2} at={0} pos="50% 30%" />
		<Book id="s22b" title="Bleak House" sub="1853 · mentions Elwes" x={700} y={200} at={cue('two') - 4} w={480} rot={-3} />
		<Book id="s22c" title="Our Mutual Friend" sub="1865 · mentions Elwes" x={1260} y={260} at={cue('two') + 4} w={480} rot={2.5} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('two') - 4} />
		<Sfx n="slap2" at={cue('two') + 4} />
	</Board>
);

// 23 · suspect number two: Jemmy Wood, the Gloucester miser, ~£900,000
export const S23: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Ransom id="s23r" text="SUSPECT No. 2" x={1060} y={70} size={70} rot={2} at={0} />
		<Cutout id="s23a" src={I('wood_painting')} w={560} h={740} x={120} y={190} rot={-2} at={cue('jemmy')} pos="50% 50%" />
		<Tag id="s23b" text="Jemmy Wood and the Gloucester Old Bank, c.1829" x={140} y={950} rot={1} at={cue('jemmy') + 4} size={20} />
		<TitleCard fig={3} title="Jemmy Wood" sub="Banker, Gloucester · 1756–1836" at={cue('banker') - 6} />
		<Ransom id="s23c" text="£900,000" x={760} y={470} size={140} rot={-2} at={cue('nine')} />
		<MarkerNote id="s23d" text={'"the richest commoner\nin the country"'} x={780} y={720} at={cue('richest') - 4} size={56} rot={-2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('jemmy')} />
		<Sfx n="slap2" at={cue('nine')} />
		<Sfx n="marker_l" at={cue('richest') - 4} />
	</Board>
);

// 24 · a bank of two clerks in a drapery shop; his coffin stoned
export const S24: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Cutout id="s24a" src={I('wood_painting')} w={720} h={520} x={1060} y={150} rot={2} at={0} pos="50% 25%" />
		<Tag id="s24b" text="Bank: 2 clerks, in a drapery shop" x={160} y={220} rot={-2} at={cue('clerks')} size={36} />
		<Ink id="s24c" d="M 300 760 L 360 560 L 760 560 L 820 760 Z" at={cue('funeral') - 4} dur={10} width={6} len={1300} />
		{[0, 1, 2, 3, 4].map((i) => (
			<Ink key={i} id={`s24s${i}`} d={`M ${280 + i * 120} ${430 - (i % 2) * 40} a 22 18 0 1 0 1 0`} at={cue('stones') + i * 3} dur={3} width={5} len={160} />
		))}
		<MarkerNote id="s24d" text="his coffin, pelted with stones" x={900} y={780} at={cue('pelted') - 4} size={58} rot={-2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('clerks')} />
		<Sfx n="marker_l" at={cue('funeral') - 4} />
		{[0, 1, 2, 3, 4].map((i) => (
			<Sfx key={i} n={`type${i % 3}`} at={cue('stones') + i * 3} v={0.6} />
		))}
		<Sfx n="marker_l" at={cue('pelted') - 4} />
	</Board>
);

// 25 · the will, the court fight, the executor
export const S25: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s25a" x={260} y={160} rot={-3} at={0}>
			<div style={{width: 600, height: 760, background: '#F3ECD8', padding: '50px 50px', boxShadow: '6px 9px 16px rgba(29,28,32,.35)', fontFamily: 'Caslon', color: V.ink}}>
				<div style={{fontSize: 70, fontWeight: 700, textAlign: 'center'}}>The Last Will</div>
				<div style={{fontSize: 30, fontStyle: 'italic', textAlign: 'center', marginTop: 10}}>of James Wood, of Gloucester</div>
				{Array.from({length: 11}).map((_, i) => (
					<div key={i} style={{height: 3, background: 'rgba(29,28,32,.35)', margin: '34px 0 0', width: `${70 + ((i * 37) % 30)}%`}} />
				))}
			</div>
		</Piece>
		<Ink id="s25b" d="M 300 520 C 500 480, 650 600, 830 500" at={cue('battle') - 2} dur={8} width={9} len={700} color="#B8231E" />
		<MarkerNote id="s25c" text="years in court" x={1000} y={300} at={cue('years') - 4} size={70} rot={-3} />
		<MarkerNote id="s25d" text={'one executor, consumed by\nthe case, took his own life'} x={1000} y={560} at={cue('executors') - 4} size={50} rot={2} />
		<Sfx n="slap0" at={0} />
		<Sfx n="scribble" at={cue('battle') - 2} />
		<Sfx n="marker_l" at={cue('years') - 4} />
		<Sfx n="marker_l" at={cue('executors') - 4} />
	</Board>
);

// 26 · suspect number three: Daniel Dancer, hay for clothes, £2,500 in a dung heap
export const S26: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Ransom id="s26r" text="SUSPECT No. 3" x={1060} y={70} size={70} rot={2} at={0} />
		<Cutout id="s26a" src={I('dancer')} w={520} h={720} x={130} y={200} rot={-2} at={cue('daniel')} pos="50% 35%" />
		<MarkerNote id="s26b" text="clothes: bands of hay" x={760} y={300} at={cue('hay') - 4} size={64} rot={-2} />
		<Ransom id="s26c" text="£2,500" x={760} y={520} size={140} rot={-2} at={cue('two') - 2} />
		<Tag id="s26d" text="Buried in a dung heap" x={800} y={760} rot={1.5} at={cue('dung') - 4} size={44} />
		<Sfx n="slap0" at={0} />
		<Sfx n="slap1" at={cue('daniel')} />
		<Sfx n="marker_l" at={cue('hay') - 4} />
		<Sfx n="slap2" at={cue('two') - 2} />
		<Sfx n="slap0" at={cue('dung') - 4} />
	</Board>
);

// 27 · Dickens owned these stories: Lives and Anecdotes of Misers
export const S27: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Book id="s27a" title="Lives and Anecdotes of Misers" sub="F. S. Merryweather, 1850" x={260} y={200} at={cue('lives') - 10} w={620} rot={-3} />
		<Tag id="s27b" text="Read aloud in Our Mutual Friend, 1865" x={980} y={300} rot={2} at={cue('novels')} size={26} />
		<MarkerNote id="s27c" text={'"John Elwes…\nDaniel Dancer…"'} x={1000} y={460} at={cue('lives')} size={64} rot={-2} />
		<Sfx n="slap0" at={cue('lives') - 10} />
		<Sfx n="slap1" at={cue('novels')} />
		<Sfx n="marker_l" at={cue('lives')} />
	</Board>
);

// 28 · so where did the name Scrooge come from?
export const S28: React.FC<ShotProps> = () => <Chapter n={2} title="The name" at={0} />;

// 29 · the Edinburgh gravestone: "meal man" read as "mean man"
export const S29: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Gravestone x={650} y={160} at={0} misread={cue('read') - 4} />
		<Tag id="s29a" text="Canongate Kirkyard, Edinburgh (the story)" x={120} y={90} rot={-2} at={4} size={26} />
		<MarkerNote id="s29b" text={'meal man =\ncorn merchant'} x={100} y={420} at={cue('corn') - 4} size={46} rot={-3} color="#F1EDE4" />
		<MarkerNote id="s29c" text={'…read in the\nfading light as'} x={1300} y={480} at={cue('fading') - 4} size={50} rot={3} color="#F1EDE4" />
		<Snow n={70} opacity={0.6} />
		<Sfx n="marker_l" at={cue('corn') - 4} />
		<Sfx n="scribble" at={cue('read') - 4} />
	</Board>
);

// 30 · probably a hoax; the stone was lost in 1932. Verdict: unproven.
export const S30: React.FC<ShotProps> = ({cue}) => (
	<Board dark>
		<Gravestone x={650} y={160} at={-30} misread={-30} />
		<MarkerNote id="s30a" text="no evidence" x={120} y={300} at={cue('evidence') - 4} size={60} rot={-3} color="#F1EDE4" />
		<MarkerNote id="s30b" text="stone lost in 1932" x={1300} y={300} at={cue('lost') - 4} size={56} rot={3} color="#F1EDE4" />
		<div style={{position: 'absolute', left: 0, top: 0}}>
			<Stamp text="UNPROVEN" x={960} y={600} at={cue('unproven') - 4} size={150} rot={-10} onDark />
		</div>
		<Snow n={70} opacity={0.6} />
		<Sfx n="marker_l" at={cue('evidence') - 4} />
		<Sfx n="marker_l" at={cue('lost') - 4} />
		<Sfx n="slap2" at={cue('unproven') - 4} v={0.8} />
	</Board>
);

// 31 · but here's where the case turns
export const S31: React.FC<ShotProps> = () => <Chapter n={3} title="The real villain" at={0} />;

