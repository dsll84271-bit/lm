import json
D=json.load(open('tts/dur.json'))
G={'c':(1.4,[0.5,2.2,1.2,1.4,0.8,0.6,1.4,0.0]),
'h':(0.4,[0.8,1.6,0.8,1.4,1.6,1.0,2.6,1.0]),
'p':(0.4,[0.6,0.4,3.4,0.8,1.0,1.4,1.2,0.8,1.2]),
's':(0.4,[0.6,1.0,0.8,0.8,2.6,0.8,1.2]),
'l':(0.4,[2.2,0.8,2.0,0.8,1.2]),
'k':(0.4,[1.6,0.6,1.0,0.8,1.2]),
'a':(0.4,[3.6,1.0,0.8,0.8,1.6,1.2]),
'x':(0.4,[1.0,1.4,0.8,0.8,1.4,1.2]),
'r':(0.4,[0.8,0.8,0.6,2.6,1.2,1.6]),
'd':(0.4,[0.6,2.6,0.8,3.6,3.0,1.0,0.8,1.2,2.4]),
'e':(0.4,[0.8,0.8,1.0,3.0,0.0])}
TAIL={'c':4.6,'e':10.0}  # title card / end card hold after last line
out={};tot=0
for g,(pre,gaps) in G.items():
    t=pre;st=[]
    for i,d in enumerate(D[g]): st.append(round(t,2)); t+=d+gaps[i]
    end=round(t+TAIL.get(g,0),2); out[g]={'st':st,'du':D[g],'end':end}; tot+=end
    open(f't_{g}.js','w').write(f"const ST={st}; const DU={D[g]}; const END={end};\n")
    print(g,end)
print('TOTAL',round(tot,1))
json.dump(out,open('timing.json','w'))
