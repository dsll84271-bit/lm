# Ep3 timings from narration lengths: (pre-roll, gap after each line, tail). Writes t_<seg>.js + timing.json.
import json
D = json.load(open('tts/dur.json'))
G = {
 'o':  (4.0, [1.8, 0.9, 1.6, 0.7, 0.0], 4.4),                                   # slam first, title card at the end
 's1': (0.8, [0.9, 1.6, 2.5, 1.2, 1.6, 0.9, 1.1, 1.8, 0.9, 0.0], 1.6),
 's2': (3.6, [1.0, 2.2, 1.4, 1.6, 0.9, 0.0], 1.6),                              # BANG before the first line
 's3': (3.0, [0.9, 1.6, 1.0, 1.6, 1.4, 3.6, 0.0], 1.6),                         # POP + wind on arrival; gasp home before rule
 's4': (0.6, [3.8, 1.6, 1.2, 1.6, 1.0, 2.6, 0.0], 1.6),                         # silent float after "Space."
 's5': (0.6, [0.9, 1.0, 2.6, 1.6, 0.0], 1.6),
 'w':  (3.0, [1.2, 4.2, 0.6, 0.8, 0.6, 1.8, 0.8, 1.1, 3.4, 0.0], 2.0),          # establishing city; long fall; splash + ringing ears
 'e':  (0.6, [2.2, 0.8, 1.8, 1.4, 5.4, 0.0], 13.0),                             # silent stare; DAY 4 card + end screen
}
out = {}; tot = 0
for g, (pre, gaps, tail) in G.items():
    t = pre; st = []
    for i, d in enumerate(D[g]): st.append(round(t, 2)); t += d + gaps[i]
    end = round(t + tail, 2); out[g] = {'st': st, 'du': D[g], 'end': end}; tot += end
    open(f't_{g}.js', 'w').write(f"const ST={st}; const DU={D[g]}; const END={end};\n")
    print(g, end)
print('TOTAL', round(tot, 2), '=', f'{int(tot//60)}:{tot%60:04.1f}')
json.dump(out, open('timing.json', 'w'))
