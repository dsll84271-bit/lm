import {person, YOU, type Look} from '../../../characters/Hero';
import type {Light3} from '../../../three/Stage3D';

// Shared looks for Episode 4: who's in it, and how each place is lit at ant height.

export const P4: Record<string, Look> = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
};
export {YOU};

export const LIGHT: Record<string, Light3> = {
	bedroom: {sky: '#E8DCFF', ground: '#5A4A7A', ambient: 1.35, sun: {from: [6, 12, 8], color: '#FFF1D6', intensity: 2.6}, rim: {from: [-6, 5, -8], color: '#7FE0FF', intensity: 1.8}, fog: {color: '#B8A8E8', near: 40, far: 160}},
	carpet: {sky: '#E8DCFF', ground: '#5A4A7A', ambient: 1.3, sun: {from: [5, 12, 7], color: '#FFF1D6', intensity: 2.6}, rim: {from: [-6, 5, -8], color: '#FFB0E8', intensity: 1.8}, fog: {color: '#9A84D8', near: 14, far: 70}},
	underbed: {sky: '#9A8AD8', ground: '#2A1E50', ambient: 1.1, sun: {from: [6, 10, 10], color: '#FFE8C8', intensity: 2.2}, rim: {from: [-5, 4, -6], color: '#7FE0FF', intensity: 2}, fog: {color: '#3A2A70', near: 12, far: 60}},
	void: {sky: '#7F5AF0', ground: '#140E38', ambient: 1.0, sun: {from: [3, 8, 6], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-4, 4, -5], color: '#7F5AF0', intensity: 3}},
	studio: {sky: '#D8D0FF', ground: '#3A2E80', ambient: 1.35, sun: {from: [4, 9, 8], color: '#FFFFFF', intensity: 2.4}, rim: {from: [-5, 4, -6], color: '#FF8AD8', intensity: 1.8}},
	mine: {sky: '#C9A070', ground: '#2A1A10', ambient: 1.1, sun: {from: [2, 12, 4], color: '#FFE0B0', intensity: 2.2}, rim: {from: [-4, 4, -6], color: '#FFB060', intensity: 1.6}, fog: {color: '#3A2416', near: 10, far: 40}},
	hall: {sky: '#FFE2C4', ground: '#6A4A3A', ambient: 1.3, sun: {from: [6, 12, 8], color: '#FFE8C8', intensity: 2.5}, rim: {from: [-6, 5, -8], color: '#9FD0FF', intensity: 1.6}, fog: {color: '#E8C8A0', near: 30, far: 140}},
	kitchen: {sky: '#FFF0D8', ground: '#8A7A6A', ambient: 1.4, sun: {from: [6, 14, 9], color: '#FFF4E0', intensity: 2.6}, rim: {from: [-6, 5, -8], color: '#7FE0FF', intensity: 1.6}, fog: {color: '#F2E4CC', near: 40, far: 180}},
	cold: {sky: '#BFD8FF', ground: '#4A5A7A', ambient: 1.25, sun: {from: [6, 12, 8], color: '#DCEBFF', intensity: 2.2}, rim: {from: [-6, 5, -8], color: '#9FE8FF', intensity: 2.2}, fog: {color: '#C8D8F0', near: 30, far: 150}},
	dark: {sky: '#3A3A70', ground: '#100C24', ambient: 0.75, sun: {from: [8, 16, 12], color: '#B8C8FF', intensity: 1.6}, rim: {from: [-6, 6, -10], color: '#7CF27A', intensity: 1.2}, fog: {color: '#141030', near: 40, far: 170}},
	fridge: {sky: '#7A90C8', ground: '#1E2440', ambient: 1.05, sun: {from: [4, 10, 12], color: '#DCE8FF', intensity: 2}, rim: {from: [-5, 4, -6], color: '#7FE0FF', intensity: 2}, fog: {color: '#2A3050', near: 14, far: 60}},
	pond: {sky: '#BFE6FF', ground: '#2A5A7A', ambient: 1.35, sun: {from: [-6, 12, 8], color: '#FFF6E0', intensity: 2.6}, rim: {from: [6, 4, -8], color: '#9FFFE8', intensity: 1.6}, fog: {color: '#9FD0E8', near: 20, far: 90}},
	garden: {sky: '#CFEFFF', ground: '#4A7A3A', ambient: 1.3, sun: {from: [-8, 14, 9], color: '#FFF6E0', intensity: 2.9}, rim: {from: [6, 5, -8], color: '#FFE0A0', intensity: 1.4}, fog: {color: '#BFE4F2', near: 30, far: 130}},
	rain: {sky: '#8A98B8', ground: '#2A3A3A', ambient: 1.2, sun: {from: [-4, 12, 8], color: '#DCE6F8', intensity: 1.7}, rim: {from: [5, 4, -6], color: '#9FD0FF', intensity: 2}, fog: {color: '#6A7898', near: 14, far: 70}},
	night: {sky: '#3A4A90', ground: '#0E1430', ambient: 0.95, sun: {from: [6, 10, -12], color: '#DCE6FF', intensity: 1.6}, rim: {from: [-5, 4, 6], color: '#FFD9A0', intensity: 1.2}},
	room: {sky: '#E8DCFF', ground: '#5A4A6A', ambient: 1.35, sun: {from: [3, 6, 5], color: '#FFF1D6', intensity: 2.3}, rim: {from: [-4, 4, -6], color: '#7FE0FF', intensity: 1.8}},
	morning: {sky: '#FFE2C4', ground: '#6A4A7A', ambient: 1.3, sun: {from: [5, 7, 4], color: '#FFE8C8', intensity: 2.6}, rim: {from: [-5, 4, -6], color: '#9FD0FF', intensity: 1.6}},
};

export const BG = {sky: '#9FD0FA', bedroom: '#B8A8E8', carpet: '#9A84D8', under: '#3A2A70', void: '#0E0A2E', studio: '#3E2F96', mine: '#3A2416', hall: '#E8C8A0', kitchen: '#F2E4CC', dark: '#141030', fridge: '#2A3050', pond: '#9FD0E8', garden: '#BFE4F2', rain: '#6A7898', night: '#0E1440', room: '#2A1E50'};
