import type {BoardItem} from '../../docs-kit/series';
import {I} from './parts';

/** The Case 003 evidence board: the suspect, then one item per Exhibit. */
export const BOARD: BoardItem[] = [
	{id: 'b0', x: 790, y: 150, w: 340, h: 300, note: 'THE SUSPECT', label: 'Dexter Morgan · blood spatter analyst', rot: -2},
	{id: 'b1', x: 230, y: 230, w: 400, photo: I('fl_supreme'), label: 'A · the gatekeeper: walks in', rot: -4},
	{id: 'b2', x: 1310, y: 220, w: 400, photo: I('microscopes'), label: 'B · the science: 1 in 9 wrong', rot: 3},
	{id: 'b3', x: 300, y: 620, w: 400, photo: I('ma_statehouse'), label: 'C · the insider: every case reopened', rot: 3},
	{id: 'b4', x: 1240, y: 620, w: 400, photo: I('miami_aerial'), label: 'D · the clock: months, not decades', rot: -3},
];
