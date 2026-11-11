import React from 'react';
import {Still} from 'remotion';
import '../brand/fonts';
import {
	SHEET_HEIGHT,
	SHEET_WIDTH,
	StickmanSheet,
} from '../characters/stickman/Sheet';

// The list of everything that can be rendered. Each entry shows up in the
// Remotion Studio sidebar (npm run studio).
export const Root: React.FC = () => {
	return (
		<>
			<Still
				id="StickmanSheet"
				component={StickmanSheet}
				width={SHEET_WIDTH}
				height={SHEET_HEIGHT}
			/>
		</>
	);
};
