import json
from pathlib import Path
F=json.loads(Path('docs/nutrition/fineli-release-20-reference.json').read_text(encoding='utf-8'))
DB={str(x['source_id']):x for x in F['foods']}
# Rows are grams of ingredient; all cooking oil listed in previous recipe review
# is treated as retained/absorbed. Values: available carbohydrate, fibre, polyols, protein, fat.
def fin(id,g):
 x=DB[str(id)]['per100g']; keys=['available_carbohydrate_g_per_100g','fibre_g_per_100g','polyols_g_per_100g','protein_g_per_100g','fat_g_per_100g']
 vals=[x[k] for k in keys]
 # Food components outside ingredients formulated with polyols: absence in the
 # Fineli snapshot is treated as estimated zero and called out in the memo.
 if vals[2] is None: vals[2]=0
 if any(v is None for v in vals): raise ValueError((id,DB[str(id)]['name'],vals))
 return [g*v/100 for g,v in zip([g]*5,vals)]
def custom(vals,g): return [g*v/100 for v in vals] # available, fibre, polyols, protein, fat
R={
'medu-vada':(4,[fin(399,250),fin(33023,10),fin(182,8),fin(535,50)]),
'pani-puri':(4,[fin(112,150),fin(110,20),fin(205,300),fin(11089,150),custom([57.4,5.1,0,2.8,.6],30),fin(11557,30),fin(535,25)]),
'samosa':(4,[fin(110,300),fin(535,54),fin(205,400),fin(370,100),fin(535,50)]),
'vada-pav':(4,[fin(205,500),fin(535,13.5),custom([38.5,20.8,0,19.7,5.5],100),fin(1108,200),fin(535,25)]),
'aloo-paratha':(4,[fin(110,300),fin(205,400),fin(598,30)]),
'butter-chicken':(4,[fin(30792,700),fin(620,150),fin(11557,15),fin(500,30),fin(335,55),fin(33023,20),fin(398,400),fin(631,200),fin(1,21),fin(535,13.5)]),
'chole-bhature':(4,[custom([46.4,12.5,0,21.3,5.4],300),fin(535,27),fin(335,55),fin(33023,20),fin(398,400),fin(110,350),fin(620,100),fin(535,60)]),
'ketopizza-pofiber-pohjalla':(2,[fin(642,175),fin(11571,37.5),fin(858,55),custom([17,65,0,5,.3],8.925),fin(398,75),fin(779,50),fin(355,50)]),
'lohikeitto-kuohukermalla':(4,[fin(335,55),fin(337,50),fin(205,360),fin(300,100),fin(500,15),fin(75,15),fin(34255,400),fin(631,200),fin(369,10)]),
'uunilohi-smetanakuorrutteella':(4,[fin(34255,700),fin(630,200),fin(337,100),fin(28925,120*.65),fin(369,16.67),fin(500,5)]),
'vhh-lohikeitto-kukkakaalilla':(4,[fin(34255,500),fin(322,600),fin(337,80),fin(335,55),fin(75,15),fin(631,200),fin(500,10),fin(369,10)]),
'gulab-jamun':(4,[fin(672,150),fin(110,50),fin(598,27),fin(675,103),fin(1,250),fin(535,30),fin(33131,10)]),
}
for id,(servings,parts) in R.items():
 s=[sum(row[i] for row in parts)/servings for i in range(5)]
 net,total,poly,protein,fat=s[0],s[0]+s[1]+s[2],s[2],s[3],s[4]
 print(id,*(round(x,2) for x in [net,total,protein,fat]),'parts',len(parts))
