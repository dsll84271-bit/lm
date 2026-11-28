/** A preview of the series pieces in Case 003's dress (for stills checks only). */
import React from 'react';
import {Sequence} from 'remotion';
import {CaseBrief, CaseClosed, CaseSlate, EvidenceBoard, ExhibitCard, Ident, RealityScore} from '../../docs-kit/series';
import {BOARD} from './board';
import {Board, Clip, Coin, Pleading, SlideBox, SlidePiece, T, TenDots} from './parts';

const D = 300;
export const SERIES_DEMO_FRAMES = D * 9;
export const SeriesDemo: React.FC = () => (
	<>
		<Sequence from={0} durationInFrames={D}>
			<Ident t={T} d={D} welcomeAt={20} everyAt={120} caseAt={220} photo="case003/img/courtroom.jpg" />
		</Sequence>
		<Sequence from={D} durationInFrames={D}>
			<Board>
				<CaseBrief t={T} qs={['Would his science get into court?', 'What if the man in the lab is the criminal?', 'How long would he really survive?']} ats={[10, 40, 70]} x={460} y={240} />
				<CaseSlate t={T} at={4} />
			</Board>
		</Sequence>
		<Sequence from={D * 2} durationInFrames={D}>
			<ExhibitCard t={T} letter="B" title="The science on the stand" d={D}>
				<SlidePiece id="exb" label={'EXHIBIT B\nRELIABLE?'} x={1330} y={180} at={20} rot={6} w={420} glow={0.4} />
			</ExhibitCard>
		</Sequence>
		<Sequence from={D * 3} durationInFrames={D}>
			<EvidenceBoard t={T} items={BOARD} shown={2} newAt={30} d={D} />
		</Sequence>
		<Sequence from={D * 4} durationInFrames={D}>
			<RealityScore t={T} score={3} landAt={80} sub="Overall: Dexter">
				<SlideBox fill={3} fillAt={40} />
			</RealityScore>
		</Sequence>
		<Sequence from={D * 5} durationInFrames={D}>
			<CaseClosed t={T} d={D} closedAt={8} nextAt={80} next="COMING SOON" />
		</Sequence>
		<Sequence from={D * 6} durationInFrames={D}>
			<Board>
				<Pleading id="pq" x={110} y={200} w={1060} at={0} head="Strengthening Forensic Science, p. 179" lines={['The uncertainties associated with', 'bloodstain pattern analysis', 'are enormous.']} hl={[2]} hlAt={60} size={44} cps={2} />
				<Clip n="eo_suit" x={1450} y={700} w={700} />
			</Board>
		</Sequence>
		<Sequence from={D * 7} durationInFrames={D}>
			<Board>
				<TenDots lit={9} at={4} x={300} y={240} size={86} />
				<TenDots lit={4} partial={0.94} at={10} x={300} y={590} size={86} />
			</Board>
		</Sequence>
		<Sequence from={D * 8} durationInFrames={D}>
			<Board>
				{Array.from({length: 10}).map((_, i) => (
					<Coin key={i} id={`c${i}`} x={150 + i * 165} y={360} at={i * 6} size={130} />
				))}
			</Board>
		</Sequence>
	</>
);
