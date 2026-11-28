import React from 'react';
import {Composition, Still} from 'remotion';
import '../brand/fonts';
import {HeroSheet} from '../characters/Sheet';
import {TestThumb} from '../characters/TestThumb';
import {Test3D} from '../three/Test3D';
import {Test3D2} from '../three/Test3D2';
import {TestGhost} from '../three/TestGhost';
import {TestAnt} from '../three/TestAnt';
import {TestFly} from '../three/TestFly';
import {TestGrim} from '../three/TestGrim';
import {TestSea} from '../three/TestSea';
import {TestTall} from '../three/TestTall';
import {EP01_FRAMES, Episode01} from '../episodes/ep01/Episode';
import {EP02_FRAMES, Episode02} from '../episodes/ep02/Episode';
import {EP03_FRAMES, Episode03} from '../episodes/ep03/Episode';
import {EP04_FRAMES, Episode04} from '../episodes/ep04/Episode';
import {EP05_FRAMES, Episode05} from '../episodes/ep05/Episode';
import {EP06_FRAMES, Episode06} from '../episodes/ep06/Episode';
import {EP07_FRAMES, Episode07} from '../episodes/ep07/Episode';
import {EP08_FRAMES, Episode08} from '../episodes/ep08/Episode';
import {EP09_FRAMES, Episode09} from '../episodes/ep09/Episode';
import {DOC01_FRAMES, Doc01} from '../episodes/doc01/Episode';
import {CASE001_FRAMES, Case001} from '../episodes/case001/Episode';
import {CASE002_FRAMES, Case002} from '../episodes/case002/Episode';
import {CASE003_FRAMES, Case003} from '../episodes/case003/Episode';
import '../docs-kit/kit';
import {CaseClosed, CaseIntro, INTRO_FRAMES, OUTRO_FRAMES} from '../docs-kit/case';
import {TvDemo, VOX_DEMO_FRAMES, VoxDemo} from '../docs-kit/voxdemo';
import {MapPlate} from '../docs-kit/vmap';

export const Root: React.FC = () => (
	<>
		<Composition id="Ep01" component={Episode01} width={1920} height={1080} fps={30} durationInFrames={EP01_FRAMES} />
		<Composition id="Ep02" component={Episode02} width={1920} height={1080} fps={30} durationInFrames={EP02_FRAMES} />
		<Composition id="Ep03" component={Episode03} width={1920} height={1080} fps={30} durationInFrames={EP03_FRAMES} />
		<Composition id="Ep04" component={Episode04} width={1920} height={1080} fps={30} durationInFrames={EP04_FRAMES} />
		<Composition id="Ep05" component={Episode05} width={1920} height={1080} fps={30} durationInFrames={EP05_FRAMES} />
		<Composition id="Ep06" component={Episode06} width={1920} height={1080} fps={30} durationInFrames={EP06_FRAMES} />
		<Composition id="Ep07" component={Episode07} width={1920} height={1080} fps={30} durationInFrames={EP07_FRAMES} />
		<Composition id="Ep08" component={Episode08} width={1920} height={1080} fps={30} durationInFrames={EP08_FRAMES} />
		<Composition id="CaseIntroDemo" component={() => <CaseIntro caseNo={2} title="ARRAKIS" photo="everglades_highsm.jpg" />} width={1920} height={1080} fps={30} durationInFrames={INTRO_FRAMES} />
		<Composition id="CaseClosedDemo" component={() => <CaseClosed score={7} question="How real is Leonida?" next="COULD ARRAKIS EXIST?" nextPhoto="egrets_highsm.jpg" />} width={1920} height={1080} fps={30} durationInFrames={OUTRO_FRAMES} />
		<Still id="MapPlate" component={MapPlate as React.FC} width={1920} height={1080} defaultProps={{x: 3600, y: 1330, w: 3900}} />
		<Composition id="TvDemo" component={TvDemo} width={1920} height={1080} fps={30} durationInFrames={80} />
		<Composition id="VoxDemo" component={VoxDemo} width={1920} height={1080} fps={30} durationInFrames={VOX_DEMO_FRAMES} />
		<Composition id="Case003" component={Case003} width={1920} height={1080} fps={30} durationInFrames={CASE003_FRAMES} />
		<Composition id="Case002" component={Case002} width={1920} height={1080} fps={30} durationInFrames={CASE002_FRAMES} />
		<Composition id="Case001" component={Case001} width={1920} height={1080} fps={30} durationInFrames={CASE001_FRAMES} />
		<Composition id="Doc01" component={Doc01} width={1920} height={1080} fps={30} durationInFrames={DOC01_FRAMES} />
		<Composition id="Ep09" component={Episode09} width={1920} height={1080} fps={30} durationInFrames={EP09_FRAMES} />
		<Still id="HeroSheet" component={HeroSheet} width={1920} height={1080} />
		<Still id="TestThumb" component={TestThumb} width={1920} height={1080} />
		<Still id="Test3D" component={Test3D} width={1920} height={1080} />
		<Composition id="TestGhost" component={TestGhost} width={1920} height={1080} fps={30} durationInFrames={100} />
		<Composition id="TestFly" component={TestFly} width={1920} height={1080} fps={30} durationInFrames={80} />
		<Composition id="TestGrim" component={TestGrim} width={1920} height={1080} fps={30} durationInFrames={60} />
		<Composition id="TestSea" component={TestSea} width={1920} height={1080} fps={30} durationInFrames={100} />
		<Composition id="TestTall" component={TestTall} width={1920} height={1080} fps={30} durationInFrames={80} />
		<Composition id="TestAnt" component={TestAnt} width={1920} height={1080} fps={30} durationInFrames={80} />
		<Composition id="Test3D2" component={Test3D2} width={1920} height={1080} fps={30} durationInFrames={300} />
	</>
);
