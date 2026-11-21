import {person, type Look} from '../../../characters/Hero';
import type {Light3} from '../../../three/Stage3D';

// Shared looks for Episode 2: who's in it, and how each place is lit.

export const P2 = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	brother: person('#FFD08A', '#3FB7E8', 'spiky', '#3A2A1A'),
	friend: person('#7FD0FF', '#2EA86A', 'short', '#2A1E2E'),
	friend2: person('#FFB0C8', '#FF8A3D', 'long', '#7A4A2A'),
	friend3: person('#A6E8B0', '#7F5AF0', 'cap', '#2A2350'),
	crush: person('#FFE08A', '#FF4FD8', 'long', '#2A1E2E'),
	teacher: person('#C9A6FF', '#3A6FD8', 'bun', '#3A2A4A', {collar: true, glasses: true}),
	driver: person('#A8E0B8', '#55597A', 'cap', '#2A2350'),
	seller: person('#E8B07A', '#8A5A3E', 'cap', '#E8453C'),
	host: person('#FFB0C8', '#7F5AF0', 'short', '#2A1E2E', {collar: true}),
	detective: person('#B8C4FF', '#2A2350', 'bun', '#2A1E2E', {collar: true}),
	suspect: person('#C9CED8', '#55597A', 'none'),
	scientist: person('#B8C4FF', '#F2F2F2', 'short', '#8A8AA8', {collar: true, glasses: true}),
	girl: person('#FFD8B0', '#FF8AD8', 'long', '#E8A040'),
	newKid: person('#B3A8E8', '#1E1A30', 'none'),
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

export const LIGHT: Record<string, Light3> = {
	morning: {sky: '#FFE2C4', ground: '#6A4A7A', ambient: 1.3, sun: {from: [5, 7, 4], color: '#FFE8C8', intensity: 2.6}, rim: {from: [-5, 4, -6], color: '#9FD0FF', intensity: 1.6}},
	day: {sky: '#CFE6FF', ground: '#8A7A6A', ambient: 1.4, sun: {from: [-5, 9, 5], color: '#FFF4E0', intensity: 2.8}, rim: {from: [6, 4, -8], color: '#FFD0A0', intensity: 1.4}, fog: {color: '#CFE0F5', near: 18, far: 60}},
	room: {sky: '#E8DCFF', ground: '#5A4A6A', ambient: 1.35, sun: {from: [3, 6, 5], color: '#FFF1D6', intensity: 2.3}, rim: {from: [-4, 4, -6], color: '#7FE0FF', intensity: 1.8}},
	warm: {sky: '#FFD0A0', ground: '#4A2E3A', ambient: 1.1, sun: {from: [2, 4, 3], color: '#FFC890', intensity: 2.2}, rim: {from: [-4, 3, -5], color: '#FF8AD8', intensity: 1.8}, points: [{at: [0, 2.2, 0], color: '#FFB060', intensity: 6}]},
	night: {sky: '#5A5AB0', ground: '#1A1440', ambient: 0.8, sun: {from: [-3, 5, 4], color: '#9FB0FF', intensity: 1.2}, rim: {from: [4, 3, -5], color: '#7F5AF0', intensity: 2.2}, points: [{at: [0, 2.4, 0.5], color: '#FFD9A0', intensity: 4}]},
	studio: {sky: '#B8A0FF', ground: '#2A1E50', ambient: 1.1, sun: {from: [0, 6, 6], color: '#FFFFFF', intensity: 2.6}, rim: {from: [0, 4, -6], color: '#FF4FD8', intensity: 2.6}},
	police: {sky: '#C9D8E8', ground: '#3A4050', ambient: 1.0, sun: {from: [0, 6, 2], color: '#E8F2FF', intensity: 2.4}, rim: {from: [4, 3, -4], color: '#7FA0C0', intensity: 1.2}},
	lab: {sky: '#E8F4FF', ground: '#8A94A8', ambient: 1.5, sun: {from: [3, 7, 5], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-5, 3, -5], color: '#7FE0FF', intensity: 1.6}},
	fair: {sky: '#FFD8B0', ground: '#4FB070', ambient: 1.3, sun: {from: [-6, 8, 6], color: '#FFE2B8', intensity: 2.4}, rim: {from: [6, 5, -8], color: '#FF8AD8', intensity: 2}, fog: {color: '#F5B08A', near: 12, far: 40}},
	sunset: {sky: '#FF9A6A', ground: '#3A6A4A', ambient: 1.1, sun: {from: [-8, 3, 4], color: '#FFB070', intensity: 2.4}, rim: {from: [6, 3, -6], color: '#FF4FD8', intensity: 2.4}, fog: {color: '#E8805A', near: 10, far: 35}},
	void: {sky: '#7F5AF0', ground: '#140E38', ambient: 1.0, sun: {from: [2, 5, 5], color: '#FFFFFF', intensity: 2.2}, rim: {from: [-3, 3, -4], color: '#7F5AF0', intensity: 3}},
};

export const BG = {sky: '#9FD0FA', room: '#2A1E50', night: '#0E0A2E', dusk: '#F59A7A', void: '#0E0A2E'};
