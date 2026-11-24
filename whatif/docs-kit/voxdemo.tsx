/** 10-second test of the collage style on Case File 001 material. */
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {EngravedMap, MAP_PTS, toScreen, useMapCam} from './vmap';
import {Cutout, Ink, MarkerNote, PaperFinish, Ransom, Tag, TitleCard} from './vox';

export const VOX_DEMO_FRAMES = 300;

const CAM0 = {x: 3600, y: 1330, w: 3900};
const CAM1 = {x: 1990, y: 1590, w: 980};

const sfx = (name: string, at: number, volume = 0.8) => (
	<Sequence key={`${name}${at}`} from={at} durationInFrames={40}>
		<Audio src={staticFile(`vox/sfx/${name}.wav`)} volume={volume} />
	</Sequence>
);

export const VoxDemo: React.FC = () => {
	const cam = useMapCam(CAM0, CAM1, 96, 140);
	const [wx, wy] = toScreen(CAM0, MAP_PTS.washington);
	const [sx, sy] = toScreen(CAM0, MAP_PTS.saigon);
	const arc = `M ${wx} ${wy} Q ${(wx + sx) / 2} ${Math.min(wy, sy) - 330} ${sx + 18} ${sy - 14}`;
	const ang = Math.atan2(sy - 14 - (Math.min(wy, sy) - 330), sx + 18 - (wx + sx) / 2);
	return (
		<AbsoluteFill style={{background: '#EFEBE3', overflow: 'hidden'}}>
			<EngravedMap
				cam={cam}
				feature="vietnam"
				sweepAt={142}
				compass
				labels={[
					{text: 'UNITED STATES', at: [4700, 1060], size: 40, spacing: 10, from: 20},
					{text: 'Pacific Ocean', at: [3560, 1560], size: 44, italic: true, spacing: 4, from: 30},
					{text: 'VIETNAM', at: [2135, 1650], size: 30, spacing: 8, from: 144},
				]}
			/>
			{/* Washington → Vietnam, before the push */}
			<Ink id="route" d={arc} at={40} dur={22} dash len={2600} end={96} arrow={[sx + 18, sy - 14, ang]} />
			<MarkerNote id="miles" text="9,000 miles" x={760} y={440} at={58} size={58} end={96} />
			<TitleCard fig={1} title="The real reaping" sub="Washington, 1 December 1969" at={8} end={96} />

			{/* after the push: the evidence slaps down */}
			<Cutout id="pirnie" src="case001/img/pirnie_1969.jpg" w={560} h={377} x={1270} y={110} rot={2.5} at={156} />
			<Tag id="pirnie-tag" text="Rep. Alexander Pirnie draws No. 1" x={1300} y={516} rot={-1.5} at={170} size={22} />
			<Ransom id="366" text="366" x={130} y={520} size={190} rot={-4} at={180} />
			<MarkerNote id="bday" text={'one for every\nbirthday'} x={150} y={800} at={200} size={60} />
			<Ink id="u" d="M 150 960 C 330 948, 470 966, 600 952" at={236} dur={8} width={6} len={600} />

			<PaperFinish />

			{sfx('whoosh', 4, 0.5)}
			{sfx('slap0', 8)}
			{[12, 14, 16, 18, 20, 22, 26, 28].map((t, i) => sfx(`type${i % 3}`, t, 0.45))}
			{sfx('marker_l', 40, 0.6)}
			{sfx('marker_s', 58, 0.6)}
			{sfx('whoosh', 94, 0.55)}
			{sfx('scribble', 142, 0.5)}
			{sfx('slap1', 156)}
			{sfx('slap2', 170, 0.7)}
			{[180, 183, 187].map((t, i) => sfx(`slap${i}`, t, 0.75))}
			{sfx('marker_l', 200, 0.6)}
			{sfx('marker_s', 236, 0.6)}
		</AbsoluteFill>
	);
};
