"""Read-only Decimal replay of exactly seven separately approved A inputs."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
ROOT=Path(__file__).resolve().parents[3]
FOLDER=ROOT/'docs/nutrition/gk80-operation149'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
approval=read(FOLDER/'approved-six-owner-approval.json')
cases=[json.loads(line) for line in (ROOT/'docs/research/afcd-polyol-03/source-extensions/cases.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
cases+=read(FOLDER/'recovery-cases.json')['cases']+read(FOLDER/'prepared-route-cases.json')['cases']
base_comps={r['id']:r for r in read(FOLDER/'composition-sources.json')['records']}
base_gis={r['id']:r for r in read(FOLDER/'gi-sources.json')['records']}
recovery_comps={**base_comps,**{r['id']:r for r in read(FOLDER/'recovery-composition.json')['records']}}
recovery_gis={**base_gis,**{r['id']:r for r in read(FOLDER/'recovery-gi.json')['records']}}
prepared_comps={**recovery_comps,**{r['id']:r for r in read(FOLDER/'prepared-route-composition.json')['records']}}
prepared_gis={**recovery_gis,**{r['id']:r for r in read(FOLDER/'prepared-route-gi.json')['records']}}
EXT=ROOT/'docs/research/afcd-polyol-03/source-extensions'
local_comps={**base_comps,**{r['id']:r for r in read(EXT/'composition-sources.json')['records']}}
local_gis={**base_gis,**{r['id']:r for r in read(EXT/'gi-sources.json')['records']}}
gold={r['recipeId']:r for r in read(FOLDER/'approved-six-golden.json')['results']}
selected=[]
for id,sha in approval['approvedInputs'].items():
 c=next(c for c in cases if c['recipeId']==id and c['inputSha256']==sha)
 foods,indices=(recovery_comps,recovery_gis) if id=='pad-kee-mao-vhh-konjac' else (prepared_comps,prepared_gis) if id=='chettinad-kana' else (local_comps,local_gis)
 selected.append((c,foods,indices,gold[id]))
PAD=ROOT/'docs/research/afcd-polyol-03/noodle-campaign'
pad=read(PAD/'cases.json')['cases'][0];sources=read(PAD/'sources.json')
pc={r['id']:{**r,'availablePer100g':r.get('availablePer100g',r.get('availableUpperPer100g'))} for r in sources['composition']}
pg={r['id']:{**r,'values':[r['value']]} for r in sources['giBindings']}
pd=read(PAD/'decimal-results.json')['results'][0]
selected.append((pad,pc,pg,{'point':pd['roundedPoint'],'omittedCho':pd['omittedCho']}))
output=[]
for c,foods,indices,expected in selected:
 assert c.get('level',c.get('classification'))=='A'
 total=D(0);omitted=D(0)
 for i in c['candidateIngredients']:
  f=foods[i['compositionId']];cho=D(str(i['grams']))*D(str(f['availablePer100g']))/D(100)/D(c['servings'])
  if i['giId'] is None:
   assert cho<D(1),c['recipeId'];omitted+=cho
  else:
   g=indices[i['giId']];assert len(g['values'])==1 and i['compositionId'] in g['allowedCompositionIds'] and i['carbohydrateUse']=='AVAILABLE_POINT'
   total+=cho*D(str(g['values'][0]))/D(100)
 assert omitted<D(2) and abs(omitted-D(str(expected['omittedCho'])))<D('1e-12')
 rounded=total.quantize(D('.01'),rounding=ROUND_HALF_UP)
 assert rounded==D(str(expected['point'])),(c['recipeId'],rounded,expected)
 output.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'pointExact':str(total),'point':str(rounded),'omittedCho':str(omitted)})
assert len(output)==7 and len({r['recipeId'] for r in output})==7
print(json.dumps({'status':'PASS','checked':7,'writes':0,'results':output},ensure_ascii=False))
