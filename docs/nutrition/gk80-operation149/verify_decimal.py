"""Independent decimal arithmetic for the closed draft pilot. No writes/network."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
root=Path(__file__).resolve().parent
read=lambda name:json.loads((root/name).read_text(encoding='utf8'),parse_float=D)
pack=read('cases.json');comps={c['id']:c for c in read('composition-sources.json')['records']};gis={g['id']:g for g in read('gi-sources.json')['records']};expected={g['recipeId']:g for g in read('golden.json')['results']}
checked=held=0
for c in pack['cases']:
 lo=hi=omitted=D(0);blocked=False
 for i in c['candidateIngredients']:
  f=comps[i['compositionId']];cho=D(i['grams'])*D(f['availablePer100g'])/D(100)/D(c['servings']);g=gis.get(i['giId']);cap=i['carbohydrateUse']=='UPPER_BOUND'
  if c['level']=='A':
   if (not g or cap) and cho>0:
    if cho>=1:blocked=True
    else:omitted+=cho
   elif g:lo+=cho*D(g['values'][0])/D(100);hi=lo
  else:
   if not g and cho>0:blocked=True
   elif g:
    lo+=(D(0) if cap else cho)*D(min(g['values']))/D(100);hi+=cho*D(max(g['values']))/D(100)
 if c['level']=='A' and omitted>=2:blocked=True
 e=expected[c['recipeId']]
 assert e['numericProposal']==(not blocked),c['recipeId']
 if blocked:held+=1;continue
 assert abs(D(e['omittedCho'])-omitted)<D('1e-10')
 if e['scenarioRange']:
  assert abs(D(e['scenarioRange']['min'])-lo)<D('1e-10')
  assert abs(D(e['scenarioRange']['max'])-hi)<D('1e-10')
 else:assert D(e['point'])==lo.quantize(D('0.01'),rounding=ROUND_HALF_UP),(c['recipeId'],lo,e['point'])
 checked+=1
print(json.dumps({'status':'PASS','checked':checked,'held':held,'writes':0}))
