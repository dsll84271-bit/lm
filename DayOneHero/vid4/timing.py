# Ep4 timings from narration lengths: (pre-roll, gap after each line, tail). Writes t_<seg>.js + timing.json.
import json
D = json.load(open('tts/dur.json'))
G = {
 'o':  (5.5, [1.4, 2.0, 2.4, 0.8, 0.0], 4.6),                          # silent wake + mirror + black first; title card
 's1': (0.8, [0.8, 1.6, 1.4, 1.2, 1.2, 4.7, 1.0, 0.0], 1.8),             # Mum drops the laundry after "only part anyone can see"
 's2': (3.0, [6.7, 1.6, 1.4, 1.4, 0.0], 1.8),                          # chew + swallow gag after line 0
 's3': (0.8, [1.8, 1.4, 1.4, 5.9, 2.6, 0.0], 1.8),                     # rain starts, outline walks
 's4': (2.0, [1.4, 1.0, 1.4, 1.6, 2.9, 0.0], 1.8),                     # hides behind the glass case
 's5': (3.2, [1.4, 1.0, 1.2, 3.0, 1.2, 0.0], 1.8),                     # dog chase + lick after "Biscuit"
 'h':  (3.0, [3.2, 1.6, 2.8, 1.2, 1.0, 5.6, 1.6, 1.4, 0.0], 2.2),      # snatch; hoodie on; the stare + scream
 'e':  (0.6, [2.0, 1.2, 1.8, 3.6, 4.2, 0.0], 13.0),                    # creep; note + streak; DAY 5 card + end screen
}
out = {}; tot = 0
for g, (pre, gaps, tail) in G.items():
    t = pre; st = []
    for i, d in enumerate(D[g]): st.append(round(t, 2)); t += d + gaps[i]
    end = round(t + tail, 2); out[g] = {'st': st, 'du': D[g], 'end': end}; tot += end
    open(f't_{g}.js', 'w').write(f"const ST={st}; const DU={D[g]}; const END={end};\n")
    print(g, end, st)
print('TOTAL', round(tot, 2), '=', f'{int(tot//60)}:{tot%60:04.1f}')
json.dump(out, open('timing.json', 'w'))
