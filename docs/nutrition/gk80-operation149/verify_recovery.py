"""Independent read-only Decimal replay; no publication activation or macro writes."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
ROOT=Path(__file__).resolve().parents[3];HERE=Path(__file__).resolve().parent
def read(p):return json.loads(p.read_text(encoding='utf8'))
pack=read(HERE/'recovery-cases.json')
assert all(pack[k] is False for k in ['activation','ownerApproval','readyAuthorized','mergeAuthorized','deployAuthorized'])
comps={c['id']:c for c in read(HERE/'composition-sources.json')['records']+read(HERE/'recovery-composition.json')['records']}
gis={g['id']:g for g in read(HERE/'gi-sources.json')['records']+read(HERE/'recovery-gi.json')['records']}
expected={'rahka-marjakerroskulho':'2.33945','japanilainen-hojicha-jogurtti-persimonilla':'8.4175','pad-kee-mao-vhh-konjac':'1.79625','intialainen-besan-chilla':'9.4698','intialainen-pinaatti-paneer-chilla':'8.9235'}
assert len(pack['cases'])==5 and {c['recipeId'] for c in pack['cases']}==set(expected)
out=[]
for c in pack['cases']:
 total=D(0);omitted=D(0)
 for i in c['candidateIngredients']:
  f=comps[i['compositionId']];value=D(str(f['availablePer100g']))
  if f['kind'] in ['FINELI_CHOAVL','AFCD_WITHOUT_SUGAR_ALCOHOLS']:
   row=next(r for r in read(ROOT/f['path'])['foods'] if r['source_id']==f['nativeId'])
   native=row['per100g']['available_carbohydrate_g_per_100g'] if f['kind']=='FINELI_CHOAVL' else row['available_carbohydrate_without_sugar_alcohols_g_per_100g']
   assert D(str(native))==value
  cho=D(str(i['grams']))*value/D(100)/D(c['servings'])
  if i['giId'] is None:
   if cho>0:
    assert c['level']=='A' and cho<D(1);omitted+=cho
  else:
   g=gis[i['giId']];assert i['compositionId'] in g['allowedCompositionIds'] and len(g['values'])==1
   assert i['carbohydrateUse']=='AVAILABLE_POINT'
   total+=cho*D(str(g['values'][0]))/D(100)
 assert omitted<D(2) and total==D(expected[c['recipeId']])
 out.append({'recipeId':c['recipeId'],'level':c['level'],'pointExact':str(total),'point':str(total.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted)})
gold=read(HERE/'recovery-golden.json');assert gold['publicActivation'] is False and gold['ownerApproval'] is False
assert len(gold['results'])==5
for actual in out:
 g=next(g for g in gold['results'] if g['recipeId']==actual['recipeId'])
 assert g['recipeId']==actual['recipeId'] and g['level']==actual['level'] and g['confidence']=='LOW'
 assert all(D(g[key])==D(actual[key]) for key in ['pointExact','point','omittedCho']),(actual,g)
print(json.dumps({'status':'PASS','checked':5,'publicActivation':False,'results':out,'writes':0}))
