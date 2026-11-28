/** Case File 001, paragraphs 16–30: the first capsule, the board, the bias, and Collins's father. */
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {lerp} from '../../docs-kit/kit';
import {TV} from '../../docs-kit/tv';
import {Cutout, Ink, MarkerNote, Piece, Ransom, Tag, TitleCard, useBoil, useTwos, V} from '../../docs-kit/vox';
import {Board, Chapter, F, Film, I, L, LotteryBoard, MONTHS, MonthBars, Pic, Sfx} from './parts';
import type {ShotProps} from './timeline';

/** A paper capsule slip with a typed date. */
const Slip: React.FC<{text: string; x: number; y: number; at: number; id: string; size?: number; rot?: number}> = ({text, x, y, at, id, size = 64, rot = -3}) => (
	<Piece id={id} x={x} y={y} rot={rot} at={at}>
		<div style={{background: '#FBF7EC', border: `3px solid ${V.ink}`, padding: '18px 40px', fontFamily: 'Elite', fontSize: size, color: V.ink, boxShadow: '5px 8px 12px rgba(29,28,32,.35)'}}>{text}</div>
	</Piece>
);

// 16 · Alexander Pirnie pulls out the first capsule: September 14
export const S16: React.FC<ShotProps> = ({d, cue}) => (
	<Board dark>
		<Pic src={I('pirnie_1969')} d={d} from={1.05} to={1.2} ox={[40, 120]} oy={[-20, -60]} />
		<Tag id="s16a" text="Rep. Alexander Pirnie draws the first capsule" x={100} y={90} rot={-1.5} at={cue('congressman')} size={26} />
		<Slip id="s16b" text="SEPTEMBER 14" x={1080} y={720} at={cue('september')} />
		<Sfx n="slap0" at={cue('congressman')} />
		<Sfx n="slap2" at={cue('september')} />
	</Board>
);

// 17 · born on September 14? You are number one.
export const S17: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const boil = useBoil('cal17');
	return (
		<Board>
			<div style={{position: 'absolute', left: 260, top: 200, width: 560, background: '#FBF7EC', boxShadow: '6px 10px 16px rgba(29,28,32,.3)', transform: `${boil} rotate(-3deg)`, opacity: lerp(f2, 0, 6, 0, 1)}}>
				<div style={{background: V.ink, color: V.beige, fontFamily: 'Anton', fontSize: 56, textAlign: 'center', padding: '10px 0'}}>SEPTEMBER</div>
				<div style={{fontFamily: 'Caslon', fontWeight: 700, fontSize: 330, textAlign: 'center', color: V.ink, lineHeight: 1.1}}>14</div>
			</div>
			<Ink id="s17c" d="M 430 420 C 380 560, 520 700, 650 640 C 800 570, 760 390, 600 380 C 520 375, 450 400, 430 430" at={cue('fourteenth')} dur={10} len={1300} />
			<Ransom id="s17n" text="No. 1" x={1000} y={330} size={190} rot={3} at={cue('number')} />
			<MarkerNote id="s17m" text="first in line" x={1080} y={640} at={cue('first')} size={70} rot={-3} />
			<Sfx n="marker_l" at={cue('fourteenth')} />
			<Sfx n="slap1" at={cue('number')} />
			<Sfx n="marker_s" at={cue('first')} />
		</Board>
	);
};

// 18 · the dates go up on the board; families wait at home
export const S18: React.FC<ShotProps> = ({d, cue}) => {
	const f2 = useTwos();
	const shown = Math.floor(lerp(f2, 0, d, 4, 140));
	return (
		<Board>
			<LotteryBoard shown={shown} x={70} y={70} scale={0.6} />
			<Cutout id="s18p" src={I('tv_vietnam_1968')} w={760} h={490} x={1080} y={220} rot={2.5} at={cue('families')} />
			<Tag id="s18t" text="Watching the war on TV, 1968" x={1150} y={740} rot={-1.5} at={cue('families') + 6} size={22} />
			<MarkerNote id="s18m" text={'waiting to hear\na birthday'} x={1150} y={820} at={cue('waiting')} size={54} />
			<Sfx n="slap1" at={cue('families')} />
			<Sfx n="marker_l" at={cue('waiting')} />
		</Board>
	);
};

// 19 · the first 195 birthdays were called up
export const S19: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const on = lerp(f2, cue('one'), cue('one') + 24, 0, 1);
	return (
		<Board>
			<LotteryBoard shown={366} cut={195} cutOn={on} x={70} y={70} scale={0.6} />
			<Ransom id="s19n" text="1–195" x={1150} y={300} size={150} rot={-3} at={cue('one')} />
			<Tag id="s19t" text="Called up" x={1260} y={520} rot={2} at={cue('called')} size={50} />
			<Sfx n="slap0" at={cue('one')} />
			<Sfx n="slap2" at={cue('called')} />
		</Board>
	);
};

// 20 · pause: find your birthday (the real 1969 numbers)
export const S20: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<LotteryBoard shown={366} cut={195} cutOn={1} x={150} y={92} scale={0.97} />
		<Tag id="s20a" text="Pause · find your birthday · yellow = called up" x={170} y={22} rot={-1} at={cue('pause')} size={30} />
		<MarkerNote id="s20b" text="tell me in the comments" x={1240} y={8} at={cue('tell')} size={46} rot={-2} />
		<Sfx n="slap1" at={cue('pause')} />
		<Sfx n="marker_l" at={cue('tell')} />
	</Board>
);

const Tick: React.FC<{label: string; at: number; y: number; id: string}> = ({label, at, y, id}) => (
	<>
		<Ink id={`${id}k`} d={`M 700 ${y + 30} L 725 ${y + 58} L 770 ${y + 4}`} at={at} dur={5} width={8} len={120} />
		<MarkerNote id={id} text={label} x={800} y={y} at={at + 2} size={48} rot={0} />
	</>
);

// 21 · the parallels (with Collins's own words kept straight)
export const S21: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Tag id="s21n" text="Collins has never said this lottery inspired the reaping" x={420} y={40} rot={-1} at={2} size={28} />
		<TV src={F('trailer_lineup')} x={330} y={330} w={560} rot={-2} on={cue('parallels')} grade="colour" />
		<Cutout id="s21p" src={I('draft_lottery_1969')} w={520} h={350} x={1320} y={130} rot={2} at={cue('parallels')} />
		<Tick id="t1" label="young people" at={cue('young')} y={600} />
		<Tick id="t2" label="chosen by chance" at={cue('chance')} y={680} />
		<Tick id="t3" label="drawn from a container" at={cue('drawn')} y={760} />
		<Tick id="t4" label="broadcast to the nation" at={cue('broadcast')} y={840} />
		<Tick id="t5" label="families watch, and wait" at={cue('watch')} y={920} />
		<Sfx n="slap0" at={2} />
		<Sfx n="slap1" at={cue('parallels')} />
		{['young', 'chance', 'drawn', 'broadcast', 'watch'].map((w) => (
			<Sfx key={w} n="marker_s" at={cue(w)} />
		))}
	</Board>
);

// 22 · but that's not the strangest part
export const S22: React.FC<ShotProps> = () => <Chapter n={3} title="Rigged by accident" at={0} />;

// 23 · the reaping isn't fair, and nor was 1969
export const S23: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<TV src={F('trailer_bowl')} x={480} y={460} w={720} rot={-2} on={0} grade="colour" />
		<Cutout id="s23p" src={I('draft_lottery_1969')} w={640} h={430} x={1120} y={240} rot={2} at={cue('nineteen')} />
		<MarkerNote id="s23a" text="isn't fair" x={300} y={820} at={cue('fair')} size={60} rot={-3} />
		<MarkerNote id="s23b" text="wasn't either" x={1180} y={760} at={cue("wasn't")} size={60} rot={3} />
		<Sfx n="marker_s" at={cue('fair')} />
		<Sfx n="slap1" at={cue('nineteen')} />
		<Sfx n="marker_l" at={cue("wasn't")} />
	</Board>
);

// 24 · month by month into the container, never properly mixed
export const S24: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const start = cue('month');
	const step = Math.max(4, Math.floor((cue('mixed') - start) / 12));
	const dec = cue('december');
	const boil = useBoil('box24');
	const x0 = 560,
		w = 800,
		lh = 52;
	return (
		<Board>
			<div style={{position: 'absolute', left: x0 - 14, top: 220, width: w + 28, height: 12 * lh + 40, border: `7px solid ${V.ink}`, borderTop: 'none', transform: boil}} />
			{MONTHS.map((m, i) => {
				if (f2 < start + i * step) return null;
				const hot = f2 >= dec && i === 11;
				return (
					<div
						key={m}
						style={{
							position: 'absolute',
							left: x0,
							top: 220 + 12 * lh + 20 - (i + 1) * lh,
							width: w,
							height: lh - 6,
							background: hot ? V.yellow : i % 2 ? '#DCD6C8' : '#C9C2B2',
							border: `2px solid ${V.ink}`,
							fontFamily: 'Anton',
							fontSize: 30,
							lineHeight: `${lh - 8}px`,
							paddingLeft: 18,
							color: V.ink,
							transform: boil,
						}}
					>
						{m}
					</div>
				);
			})}
			<Tag id="s24a" text="First in: January" x={1400} y={820} rot={2} at={start} size={26} />
			<MarkerNote id="s24b" text={'never properly\nmixed'} x={1400} y={400} at={cue('never')} size={56} rot={-4} />
			<MarkerNote id="s24c" text={'last in,\nnear the top'} x={150} y={180} at={dec} size={56} rot={-4} />
			<Ink id="s24d" d="M 420 300 C 470 300, 510 290, 545 285" at={dec + 6} dur={6} len={200} arrow={[545, 285, -0.1]} />
			{MONTHS.map((m, i) => (
				<Sfx key={m} n={`slap${i % 3}`} at={start + i * step} v={0.3} />
			))}
			<Sfx n="marker_l" at={cue('never')} />
			<Sfx n="marker_l" at={dec} />
		</Board>
	);
};

// 25 · born late in the year → drawn early (the real averages), the court, the fix
export const S25: React.FC<ShotProps> = ({cue}) => {
	const f2 = useTwos();
	const p = lerp(f2, cue('late'), cue('late') + 70, 0, 1);
	const court = cue('court');
	return (
		<Board>
			<div style={{position: 'absolute', left: 260, top: 60, fontFamily: 'Caslon', fontSize: 50, color: V.ink}}>Average draft number by birth month</div>
			<div style={{position: 'absolute', left: 262, top: 125, fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 30, color: '#55504a'}}>lower = called up sooner · 1969 lottery</div>
			<MonthBars p={p} hiDec={cue('drawn')} y={250} />
			<Tag id="s25a" text="Statisticians spotted it almost at once" x={1180} y={180} rot={2} at={cue('statisticians')} size={24} end={court} />
			<Piece id="s25q" x={1040} y={150} rot={-2} at={court}>
				<div style={{width: 760, background: V.beige, padding: '24px 30px', boxShadow: '5px 7px 12px rgba(29,28,32,.32)', fontFamily: 'Caslon', fontStyle: 'italic', fontSize: 40, color: V.ink}}>
					“perhaps not scientifically perfect” — but fair.
					<div style={{fontFamily: 'Elite', fontStyle: 'normal', fontSize: 20, marginTop: 10, letterSpacing: 2}}>A US COURT, ON THE 1969 LOTTERY</div>
				</div>
			</Piece>
			<Tag id="s25c" text="The next year: a new system" x={1260} y={930} rot={-2} at={cue('changed')} size={30} />
			<Sfx n="marker_l" at={cue('late')} />
			<Sfx n="slap0" at={cue('statisticians')} />
			<Sfx n="slap1" at={court} />
			<Sfx n="slap2" at={cue('changed')} />
		</Board>
	);
};

// 26 · Panem: poor = more slips. 1969: December = worse odds.
export const S26: React.FC<ShotProps> = ({cue}) => {
	const dec = L.filter((r) => r[0] === 12 && r[2] <= 195).length;
	return (
		<Board>
			<Tag id="s26a" text="Panem" x={330} y={360} rot={-2} at={2} size={60} />
			<MarkerNote id="s26b" text={'poor =\nmore slips'} x={300} y={520} at={cue('poor')} size={80} rot={-3} />
			<Ransom id="s26c" text="=" x={890} y={530} size={160} rot={0} at={cue('nineteen')} />
			<Tag id="s26d" text="1969" x={1300} y={360} rot={2} at={cue('nineteen')} size={60} />
			<MarkerNote id="s26e" text={'December =\nworse odds'} x={1240} y={520} at={cue('december')} size={80} rot={3} />
			<Tag id="s26f" text={`${dec} of 31 December birthdays were called`} x={980} y={860} rot={-1} at={cue('stacked')} size={24} />
			<Sfx n="slap0" at={2} />
			<Sfx n="marker_l" at={cue('poor')} />
			<Sfx n="slap1" at={cue('nineteen')} />
			<Sfx n="marker_l" at={cue('december')} />
			<Sfx n="slap2" at={cue('stacked')} />
		</Board>
	);
};

// 27 · now here's where this case gets personal
export const S27: React.FC<ShotProps> = () => <Chapter n={4} title="Personal" at={0} />;

// 28 · her father: an Air Force officer, sent to Vietnam; Suzanne was six
export const S28: React.FC<ShotProps> = ({d, cue}) => {
	const frame = useCurrentFrame();
	const dur = cue('during');
	return (
		<Board dark>
			{frame < dur ? <Film src={F('d_jetsil')} from={0} d={dur} id="f28a" /> : <Film src={F('a_huey')} from={0} d={d - dur} id="f28b" />}
			<Tag id="s28a" text="US Air Force officer · military historian" x={120} y={70} rot={-1.5} at={cue('officer')} size={26} end={dur} />
			<Tag id="s28b" text="Archive: US Department of Defense films" x={1320} y={980} rot={1} at={4} size={18} />
			<Ransom id="s28c" text="AGE 6" x={1260} y={110} size={120} rot={4} at={cue('six')} />
			<Sfx n="slap0" at={cue('officer')} />
			<Sfx n="slap1" at={cue('six')} />
		</Board>
	);
};

// 29 · Year of the Jungle
export const S29: React.FC<ShotProps> = ({cue}) => (
	<Board>
		<Piece id="s29m" x={980} y={170} rot={2} at={2}>
			<Img src={staticFile('case001/map/vietnam_yellow.jpg')} style={{width: 820, height: 461, boxShadow: '6px 9px 14px rgba(29,28,32,.32)', border: '10px solid #fff'}} />
		</Piece>
		<Piece id="s29b" x={190} y={250} rot={-3} at={cue('called')}>
			<div style={{width: 620, background: V.beige, padding: '40px 40px 34px', boxShadow: '6px 9px 14px rgba(29,28,32,.32)'}}>
				<div style={{fontFamily: 'Elite', fontSize: 22, letterSpacing: 3, color: V.ink}}>A PICTURE BOOK BY SUZANNE COLLINS</div>
				<div style={{fontFamily: 'Caslon', fontSize: 86, lineHeight: 1.04, color: V.ink, marginTop: 14}}>Year of the Jungle</div>
			</div>
		</Piece>
		<MarkerNote id="s29c" text={'a girl waiting\nfor her dad'} x={240} y={700} at={cue('girl')} size={62} rot={-3} />
		<Sfx n="slap0" at={2} />
		<Sfx n="slap1" at={cue('called')} />
		<Sfx n="marker_l" at={cue('girl')} />
	</Board>
);

// 30 · he made sure his children understood war
export const S30: React.FC<ShotProps> = ({d, cue}) => {
	const bat = cue('battlefields');
	return (
		<Board>
			<Piece id="s30q" x={150} y={110} rot={-1.5} at={2}>
				<div style={{width: 820, fontFamily: 'Caslon', fontSize: 64, lineHeight: 1.12, color: V.ink}}>He felt it was his job to make sure his children understood war.</div>
			</Piece>
			<Tag id="s30a" text="Its cost" x={180} y={520} rot={-2} at={cue('cost')} size={44} />
			<Tag id="s30b" text="Its consequences" x={200} y={610} rot={1.5} at={cue('consequences')} size={44} />
			{useCurrentFrame() >= bat && <Film src={F('a_field')} from={1} w={720} x={1450} y={400} rot={2} d={d - bat} at={bat} id="f30" />}
			<MarkerNote id="s30c" text="battlefields & memorials" x={1130} y={720} at={bat} size={52} rot={-3} />
			<Ransom id="s30d" text="WAR" x={200} y={760} size={130} rot={-3} at={cue('heart')} />
			<MarkerNote id="s30e" text="= the heart of The Hunger Games" x={560} y={820} at={cue('heart') + 8} size={50} rot={-2} />
			<Sfx n="slap0" at={2} />
			<Sfx n="slap1" at={cue('cost')} />
			<Sfx n="slap2" at={cue('consequences')} />
			<Sfx n="marker_l" at={bat} />
			<Sfx n="slap0" at={cue('heart')} />
		</Board>
	);
};
