import {person, YOU, type Look} from '../../../characters/Hero';
import type {Light3} from '../../../three/Stage3D';

// Shared looks for Episode 5: who's in it, and how each place is lit.

export const P5: Record<string, Look> = {
	mum: person('#9FB0D0', '#E8453C', 'bun', '#5A3A2A'),
	friend: person('#7FD8B0', '#2E8AE8', 'spiky', '#2A1E2E'),
	kid1: person('#F2B8D8', '#FFD84A', 'long', '#5A2A1A'),
	kid2: person('#B8A8F0', '#3AB87A', 'cap', '#E8453C'),
	kid3: person('#F2C89A', '#FF5A8A', 'short', '#2A1E2E'),
	kid4: person('#8FD0F2', '#8A5AE8', 'bun', '#3A2A1A'),
	pilot: person('#E8C8A0', '#F2F2F2', 'cap', '#2E8AE8'),
	w1: person('#C8B8E8', '#5A8A4A', 'cap', '#3A5A2A'),
	w2: person('#F2C8B0', '#8A6A4A', 'short', '#6A6A6A'),
	w3: person('#A8D8C8', '#3A6A8A', 'long', '#C8A060'),
	w4: person('#E8B8B8', '#6A4A8A', 'none'),
	w5: person('#D8D0A0', '#C86A3A', 'bun', '#8A8A8A'),
};
export {YOU};

const L = (sky: string, ground: string, ambient: number, sun: [number, number, number], sunColor: string, intensity: number, rimColor: string, rim: number, fog?: [string, number, number]): Light3 => ({
	sky,
	ground,
	ambient,
	sun: {from: sun, color: sunColor, intensity},
	rim: {from: [-sun[0], 5, -sun[2]], color: rimColor, intensity: rim},
	fog: fog ? {color: fog[0], near: fog[1], far: fog[2]} : undefined,
});

export const LIGHT: Record<string, Light3> = {
	bedroom: L('#E8DCFF', '#5A4A7A', 1.35, [6, 12, 8], '#FFF1D6', 2.6, '#7FE0FF', 1.8),
	night: L('#3A4A90', '#0E1430', 0.95, [6, 10, 8], '#DCE6FF', 1.5, '#FFD9A0', 1.2),
	day: L('#CFE6FF', '#6A8A5A', 1.35, [8, 14, 9], '#FFF6E0', 2.8, '#FFE0A0', 1.4, ['#BFE4FF', 90, 190]),
	town: L('#CFE6FF', '#6A8A5A', 1.4, [8, 14, 9], '#FFF6E0', 2.8, '#FFE0A0', 1.3, ['#CFEAFF', 120, 199]),
	street: L('#CFE6FF', '#6A6A8A', 1.35, [8, 14, 9], '#FFF6E0', 2.7, '#9FD0FF', 1.5, ['#CFEAFF', 50, 160]),
	fog: L('#D8DCE8', '#8A8EA8', 1.5, [4, 12, 6], '#F2F4FF', 1.6, '#FFFFFF', 1.2, ['#C8CCDA', 2, 24]),
	above: L('#BFE0FF', '#FFFFFF', 1.35, [10, 16, 6], '#FFF8E8', 3.0, '#9FD8FF', 1.6, ['#CFE8FF', 90, 199]),
	high: L('#9FC0FF', '#DDE6FF', 1.2, [10, 12, 6], '#E8F0FF', 2.6, '#7FE0FF', 2.2, ['#9CC4F2', 90, 199]),
	studio: L('#D8D0FF', '#3A2E80', 1.35, [4, 9, 8], '#FFFFFF', 2.4, '#FF8AD8', 1.8),
	grey: L('#C8D0E0', '#5A6A80', 1.4, [6, 12, 8], '#EEF2FF', 2.2, '#DCE6FF', 1.4, ['#B8C4D6', 60, 199]),
	aegean: L('#CFE6FF', '#6A8AA0', 1.4, [8, 14, 9], '#FFF6E0', 2.9, '#FFE0A0', 1.3, ['#BFE4FF', 90, 199]),
	overcast: L('#C8D4E0', '#5A7A5A', 1.4, [6, 12, 8], '#F2F2F2', 2.0, '#DCE6FF', 1.2, ['#B8C8D8', 80, 199]),
	dusk: L('#FFC0A0', '#3A4A7A', 1.25, [-10, 6, -8], '#FFB070', 2.6, '#FF8AD8', 1.8, ['#F2A88A', 70, 199]),
	sunset: L('#FFB8A0', '#4A3A6A', 1.25, [-10, 7, -6], '#FFC080', 2.8, '#FF7AA8', 1.8, ['#FFB89A', 80, 199]),
	cliffs: L('#FFE0B8', '#6A5A4A', 1.3, [-8, 10, 8], '#FFD8A0', 3.0, '#FF9AD0', 1.4, ['#FFD0B0', 90, 199]),
	andes: L('#CFE0FF', '#6A6A8A', 1.3, [8, 14, 9], '#FFF6E0', 2.8, '#FFD0A0', 1.4, ['#C8DCF2', 90, 199]),
	evening: L('#6A70B0', '#1E1A40', 0.9, [-8, 8, 8], '#FFB880', 1.4, '#9FD0FF', 1.6, ['#3A3A7A', 60, 190]),
	morning: L('#FFE2C4', '#6A6A8A', 1.35, [8, 12, 9], '#FFE8C8', 2.7, '#9FD0FF', 1.6, ['#FFE6CC', 50, 170]),
};

export const BG = {
	bedroom: '#2A1E50',
	night: '#0E1440',
	day: 'linear-gradient(#5AA8F0 0%, #BFE4FF 70%)',
	town: 'linear-gradient(#5AA8F0 0%, #CFEAFF 70%)',
	fog: '#C8CCDA',
	above: 'linear-gradient(#3A86E8 0%, #CFE8FF 75%)',
	high: 'linear-gradient(#1A3A9A 0%, #9CC4F2 80%)',
	studio: '#3E2F96',
	grey: 'linear-gradient(#8A9AB8 0%, #B8C4D6 70%)',
	aegean: 'linear-gradient(#3A9AF0 0%, #BFE4FF 70%)',
	overcast: 'linear-gradient(#9AA8BC 0%, #B8C8D8 70%)',
	dusk: 'linear-gradient(#5A4A9A 0%, #E87A7A 45%, #F2A88A 70%)',
	sunset: 'linear-gradient(#6A4AA0 0%, #FF8A7A 45%, #FFB89A 70%)',
	cliffs: 'linear-gradient(#5AA0E8 0%, #FFD0B0 70%)',
	andes: 'linear-gradient(#4A90E8 0%, #C8DCF2 70%)',
	evening: 'linear-gradient(#1E1A50 0%, #5A5AA0 60%)',
	morning: 'linear-gradient(#7FC0F2 0%, #FFE6CC 70%)',
};
