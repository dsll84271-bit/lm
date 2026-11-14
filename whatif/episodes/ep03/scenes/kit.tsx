import {person, YOU, type Look} from '../../../characters/Hero';
import type {Light3} from '../../../three/Stage3D';

// Shared looks for Episode 3: who's in it, and how each place is lit.

export const P3 = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	friend: person('#FFE08A', '#2EA86A', 'long', '#7A4A2A'),
	friend2: person('#7FD0FF', '#FF8A3D', 'short', '#2A1E2E'),
	friend3: person('#FFB0C8', '#3FB7E8', 'cap', '#2A2350'),
	teacher: person('#C9A6FF', '#3A6FD8', 'bun', '#3A2A4A', {collar: true, glasses: true}),
	maths: person('#A8E0B8', '#8A5A3E', 'short', '#8A8AA8', {collar: true, glasses: true}),
	dinnerLady: person('#FFD0B0', '#F2F2F2', 'bun', '#B8B8C8', {collar: true}),
	shepherd: person('#E8B07A', '#F2EEE6', 'short', '#3A2A1A'),
	scientist: person('#B8C4FF', '#F2F2F2', 'short', '#8A8AA8', {collar: true, glasses: true}),
	man: person('#C9CED8', '#55597A', 'cap', '#2A2350'),
	extras: [
		person('#B8A6FF', '#E8453C', 'short', '#2A1E2E'),
		person('#FFE08A', '#3FB7E8', 'long', '#7A4A2A'),
		person('#A6E8B0', '#FF8A3D', 'cap', '#2A2350'),
		person('#7FD0FF', '#55597A', 'none'),
		person('#FFB0C8', '#2EA86A', 'bun', '#3A2A1A'),
		person('#E8B07A', '#7F5AF0', 'spiky', '#2A1E2E'),
		person('#C9A6FF', '#FFD84A', 'short', '#5A3A2A'),
		person('#9FE0D8', '#E8453C', 'long', '#2A1E2E'),
	] as Look[],
};

/** Everyone as a heat camera sees them: hot faces and hands, warm bodies. */
const hot = (hair: Look['hair'] = 'none'): Look => ({
	...person('#FFF4A0', '#FF7A2A', hair, '#E8303A'),
	legs: '#C8283C',
	legsLight: '#E8453C',
	shoe: '#6A2AB8',
	sole: '#3A1A8A',
	hoodieDark: '#E8453C',
});
export const HOT = {you: {...hot('none'), emblem: false}, a: hot('short'), b: hot('long'), c: hot('cap'), d: hot('bun')};
export {YOU};

export const LIGHT: Record<string, Light3> = {
	morning: {sky: '#FFE2C4', ground: '#6A4A7A', ambient: 1.3, sun: {from: [5, 7, 4], color: '#FFE8C8', intensity: 2.6}, rim: {from: [-5, 4, -6], color: '#9FD0FF', intensity: 1.6}},
	day: {sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.4, sun: {from: [-5, 9, 5], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.4}, fog: {color: '#CFE0F5', near: 18, far: 60}},
	sunny: {sky: '#D8ECFF', ground: '#9A8A6A', ambient: 1.2, sun: {from: [-6, 10, 6], color: '#FFF6E0', intensity: 3.4}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.2}, fog: {color: '#D8E8F8', near: 20, far: 60}},
	room: {sky: '#E8DCFF', ground: '#5A4A6A', ambient: 1.35, sun: {from: [3, 6, 5], color: '#FFF1D6', intensity: 2.3}, rim: {from: [-4, 4, -6], color: '#7FE0FF', intensity: 1.8}},
	bath: {sky: '#E8F8FF', ground: '#8AA8B8', ambient: 1.5, sun: {from: [2, 6, 6], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-4, 4, -6], color: '#9FE8FF', intensity: 1.6}},
	warm: {sky: '#FFD0A0', ground: '#4A2E3A', ambient: 1.1, sun: {from: [2, 4, 3], color: '#FFC890', intensity: 2.2}, rim: {from: [-4, 3, -5], color: '#FF8AD8', intensity: 1.8}, points: [{at: [0, 2.2, 0], color: '#FFB060', intensity: 6}]},
	evening: {sky: '#FFB890', ground: '#3A2A50', ambient: 1.15, sun: {from: [-4, 4, 5], color: '#FFC8A0', intensity: 2.2}, rim: {from: [4, 4, -6], color: '#9F8AFF', intensity: 2}, points: [{at: [0, 2.4, -1], color: '#FFD9A0', intensity: 4}]},
	rain: {sky: '#9AA8C8', ground: '#3A3A50', ambient: 1.25, sun: {from: [-3, 8, 5], color: '#DCE6F8', intensity: 1.8}, rim: {from: [5, 4, -6], color: '#9FD0FF', intensity: 2}, fog: {color: '#8A98B8', near: 10, far: 40}},
	museum: {sky: '#E8E0FF', ground: '#4A4060', ambient: 1.3, sun: {from: [2, 7, 6], color: '#FFF4E8', intensity: 2.4}, rim: {from: [-5, 4, -6], color: '#FF8AD8', intensity: 1.6}},
	thermal: {sky: '#FFF0D0', ground: '#FF9A50', ambient: 2.0, sun: {from: [0, 6, -6], color: '#FFFFFF', intensity: 1.4}},
	lab: {sky: '#E8F4FF', ground: '#8A94A8', ambient: 1.5, sun: {from: [3, 7, 5], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-5, 3, -5], color: '#7FE0FF', intensity: 1.6}},
	jungle: {sky: '#4A7AB0', ground: '#0E2A20', ambient: 1.0, sun: {from: [-3, 6, 4], color: '#CFE8FF', intensity: 1.8}, rim: {from: [4, 3, -4], color: '#7CF2A0', intensity: 2.6}, fog: {color: '#123A38', near: 6, far: 20}},
	sea: {sky: '#7FD8FF', ground: '#0E3A5A', ambient: 1.2, sun: {from: [0, 10, 3], color: '#CFF4FF', intensity: 2.2}, rim: {from: [-4, 3, -5], color: '#7FFFE0', intensity: 1.8}, fog: {color: '#1E6A9A', near: 5, far: 22}},
	greek: {sky: '#BFE6FF', ground: '#B89A6A', ambient: 1.35, sun: {from: [-6, 9, 6], color: '#FFF0D0', intensity: 3}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.4}, fog: {color: '#D8ECFA', near: 20, far: 60}},
	palace: {sky: '#FFD8A0', ground: '#5A3A2A', ambient: 1.1, sun: {from: [3, 7, 5], color: '#FFE0B0', intensity: 2.4}, rim: {from: [-4, 4, -6], color: '#FFB060', intensity: 2}, points: [{at: [0, 3, 0], color: '#FFB060', intensity: 5}]},
	stage: {sky: '#5A4AA0', ground: '#140E30', ambient: 0.85, sun: {from: [0, 7, 6], color: '#FFF3D6', intensity: 2.6}, rim: {from: [0, 4, -6], color: '#FF4FD8', intensity: 2.2}, points: [{at: [0, 3.2, 1.2], color: '#FFF0C8', intensity: 14}, {at: [0, 1.7, 1.6], color: '#FFF6E8', intensity: 9}]},
	stageDark: {sky: '#3A2E70', ground: '#0A0820', ambient: 0.6, sun: {from: [0, 7, 6], color: '#FFF3D6', intensity: 1.8}, rim: {from: [0, 4, -6], color: '#7F5AF0', intensity: 2}, points: [{at: [0, 3.2, 1.2], color: '#FFF0C8', intensity: 12}, {at: [0, 1.7, 1.6], color: '#E8E0FF', intensity: 8}, {at: [4.4, 2.6, 0.5], color: '#C9B8FF', intensity: 6}]},
	void: {sky: '#7F5AF0', ground: '#140E38', ambient: 1.0, sun: {from: [2, 5, 5], color: '#FFFFFF', intensity: 2.2}, rim: {from: [-3, 3, -4], color: '#7F5AF0', intensity: 3}},
};

export const BG = {
	studio: '#3E2F96',sky: '#9FD0FA', room: '#2A1E50', night: '#0E0A2E', void: '#0E0A2E', rain: '#6A7898', sea: '#0E4A7A', jungle: '#0A1E1A', greek: '#9FD4F8', stage: '#0A0820', thermal: '#0E0640'};
