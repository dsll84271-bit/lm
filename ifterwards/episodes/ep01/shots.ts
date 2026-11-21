// Episode 1 shot list, as data. Each shot covers one or more spoken lines of
// a section (lines are numbered from 0 within their section). The timings come
// from voiceover/timings.json, so changing the narration re-times every shot.
//
// tools/shotlist.ts turns this file into shotlist.md.

export type ShotDef = {
	/** Section number, then shot number: "4.2" is the second shot of section 4. */
	id: string;
	section: number;
	/** First and last spoken line this shot covers. */
	from: number;
	to: number;
	where: string;
	what: string;
	camera: string;
};

/** The day card shown just before a section starts. */
export const CARDS: Record<number, string> = {
	2: 'DAY 1',
	4: 'WEEK 1',
	5: 'MONTH 1',
	6: 'MONTH 3',
	7: 'MONTH 6',
	9: 'YEAR 1',
};

const s = (id: string, from: number, to: number, where: string, what: string, camera: string): ShotDef => ({
	id,
	section: Number(id.split('.')[0]),
	from,
	to,
	where,
	what,
	camera,
});

export const SHOTS: ShotDef[] = [
	// 1. Cold open
	s('1.1', 0, 1, 'Kitchen, early morning', 'He asks. Mum, back to us at the sink, answers. First ring: hand to ear, shock.', 'Slow push-in from the doorway'),
	s('1.2', 2, 3, 'Kitchen', 'He leans in and asks again. She answers without turning. Second ring, louder.', 'Push from two-shot to him'),
	s('1.3', 4, 4, 'Kitchen', "Mum's back against the sunrise, then his face as it sinks in.", 'Push on Mum, cut, push on him'),

	// 2. Day 1: the rule
	s('2.1', 0, 0, 'High street, midday', 'He walks through passers-by, working it out. A ring as one passes.', 'Tracking alongside him'),
	s('2.2', 1, 1, 'High street corner', 'He checks his phone. His mate is "five minutes away". Ring.', 'Push in'),
	s('2.3', 2, 2, 'Corner shop', 'The shopkeeper shrugs in front of a wall of identical boxes. Ring.', 'Slide along the counter'),
	s('2.4', 3, 3, 'Office', 'His manager drops a tower of paper on the desk. Loud ring.', 'Push in, shake on the ring'),
	s('2.5', 4, 4, 'High street', 'He strides along, delighted, scarf flying.', 'Low tracking shot, pull out'),
	s('2.6', 5, 6, 'A desk, lamplight', 'An open diary filling with tally marks.', 'Slow push over the diary'),
	s('2.7', 7, 7, 'High street', 'A crowd of thirty-odd passes him. The count climbs to 30.', 'Pull out to show the crowd'),
	s('2.8', 8, 8, 'High street, dusk', 'He walks home. Corner counter ticks 1, 9, 23.', 'Tracking, low sun'),
	s('2.9', 9, 9, 'Bedroom, night', 'A lie detector scribbles on the desk. He looks at it, then points at himself.', 'Push on the machine, cut, push on him'),

	// 3. Day 3: what the lies are
	s('3.1', 0, 0, 'Cafe, soft light', 'He sits with a tea, watching the tables around him.', 'Slow push-in'),
	s('3.2', 1, 1, 'Cafe', 'Three small moments at three tables: a new haircut, a late text, the last biscuit. A ring for each.', 'Three quick set-ups'),
	s('3.3', 2, 3, 'Cafe', 'He sits between them, hearing all of it.', 'Push in on him'),

	// 4. Week 1: the advantage
	s('4.1', 0, 2, 'Car showroom', 'The salesman pitches: ring, ring. He walks round the corner and back. Price drops.', 'Glide past the car, then push in'),
	s('4.2', 3, 3, 'Interview room', 'Two interviewers answer. Ring. He stands and leaves.', 'Push in, then follow him out'),
	s('4.3', 4, 4, 'Restaurant, candlelight', 'First date. She speaks. Nothing rings. He lights up.', 'Slow push on the two of them'),
	s('4.4', 5, 5, 'Card table', 'He wins every hand. His friends glare.', 'Circle the table a little'),
	s('4.5', 6, 6, 'Living room, TV on', 'The TV flashes red with every ring. He covers his ear.', 'Push in, red flashes'),
	s('4.6', 7, 7, 'High street', 'He walks tall through the crowd, untouchable.', 'Low angle, pull out'),

	// 5. Month 1: the cost
	s('5.1', 0, 1, 'Birthday party', 'Bunting, balloons, a cake. Friends gather round him.', 'Push in through the party'),
	s('5.2', 2, 4, 'Birthday party', 'Three friends, one after another. A ring for each.', 'Three quick set-ups'),
	s('5.3', 5, 5, 'Birthday party', 'His oldest friend hands over a hastily wrapped present. Ring.', 'Push in on the present'),
	s('5.4', 6, 8, 'Birthday party', 'He holds the present as the room cools and the friends drift back.', 'Slow pull out, light cooling'),
	s('5.5', 9, 14, 'Party room, later', 'Alone at the table, candles out. Now the ring comes when he speaks.', 'Slow push in on him'),

	// 6. Month 3: people find out
	s('6.1', 0, 1, 'Office kitchen', 'He walks in. Three colleagues stop talking and turn.', 'Follow him in'),
	s('6.2', 2, 4, 'Office kitchen', 'One careful sentence each, standing very straight. Nothing rings.', 'Three stiff close-ups'),
	s('6.3', 5, 6, 'Office kitchen', 'They watch him. He stands apart, mug in hand.', 'Slow pull out'),

	// 7. Month 6: a very small life
	s('7.1', 0, 2, 'His flat, evening', 'An empty flat. Phone face down. He sits slumped. One ring.', 'Slow push across the room'),
	s('7.2', 3, 6, 'His flat, night', 'The girl from the first date, half asleep beside him. He asks. "No." Ring.', 'Push in on the sofa'),
	s('7.3', 7, 7, 'His flat, dawn', 'He has not slept. She stands to go. Ring, for him.', 'Hold, then she leaves frame'),
	s('7.4', 8, 8, 'A playroom', 'A small child hands a grown-up a scribbled drawing and beams.', 'Gentle push in'),
	s('7.5', 9, 10, 'His flat', 'He stands alone at the window.', 'Slow pull out'),

	// 8. The turn
	s('8.1', 0, 1, 'Hospital corridor, night', 'Mum alone on a plastic chair. Everything still.', 'Very slow push down the corridor'),
	s('8.2', 2, 3, 'Hospital corridor', 'He sits beside her and asks.', 'Push to a two-shot'),
	s('8.3', 4, 5, 'Hospital corridor', 'She smiles: "No. Not a bit." Two seconds of silence. The loudest ring yet.', 'Close on her, then hold on him'),
	s('8.4', 6, 9, 'Corridor, then the kitchen', 'His face as he understands. A flash of the kitchen that first morning.', 'Push in on him, cut to the kitchen'),
	s('8.5', 10, 11, 'Hospital corridor', 'He takes her hand. "Yeah. Me neither." It rings for him.', 'Slow push on their hands and faces'),

	// 9. Year 1: asking why
	s('9.1', 0, 1, 'Kitchen, evening', 'The same kitchen in warm evening light. He sits, at ease.', 'Slow push-in'),
	s('9.2', 2, 2, 'Kitchen', 'Phone buzzes: five minutes away. Ring. He puts the kettle on.', 'Follow him to the kettle'),
	s('9.3', 3, 3, 'Living room', 'His friend unwraps a present. Ring. He hands her the receipt. She laughs.', 'Push in on the two of them'),
	s('9.4', 4, 4, 'Office kitchen', '"I\'m fine." Ring. He pulls up a chair and sits down.', 'Push in as he sits'),
	s('9.5', 5, 7, 'His flat, evening', 'He calls her. Says it. Nothing rings.', 'Slow push on him at the window'),
	s('9.6', 8, 10, 'Kitchen, then the party', 'Mum, facing him now, both smiling. Then the birthday, warm again.', 'Gentle push, cut, gentle push'),
	s('9.7', 11, 13, 'His window, then the street', 'He stands at the window. We pull back through the glass and out over the street as the lights come on.', 'Long pull back'),
];
