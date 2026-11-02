"""Independent Decimal sums from pinned inputs; no calls to TypeScript or its outputs."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
root=Path(__file__).resolve().parents[3]
def load(p):return json.loads((root/p).read_text('utf-8'),parse_float=D)
def dec(x):return D(str(x))
def rnd(x):return x.quantize(D('.01'),rounding=ROUND_HALF_UP)
pack=load('docs/nutrition/gk80-operation146/integration.json')
foods={f['id']:f for f in load('docs/nutrition/food-records.json')};gis={g['id']:g for g in load('docs/nutrition/glycemic-index-records.json')['records']}
def available(f):
 p=f['per100g'];a=dec(p['carbohydrate'])
 if f['carbohydrateDefinition']=='EU_TOTAL_INCLUDING_POLYOLS':a-=dec(p['polyols'])
 else:assert f['carbohydrateDefinition']=='EU_AVAILABLE'
 return a
out=[]
for e in pack['recipes']:
 inp=e['newInput'];s=dec(inp['servings']);gk=D(0);omitted=D(0)
 for i in inp['ingredients']:
  if i.get('fineliRecordId'):
   a=dec(i['grams'])*available(foods[i['fineliRecordId']])/100/s
   if i.get('giRecordId'):gk+=a*dec(gis[i['giRecordId']]['gi'])/100
   else:assert a<1;omitted+=a
  elif 'availableCarbohydrateUpperBoundPerServingG' in i:
   a=dec(i['availableCarbohydrateUpperBoundPerServingG']);assert 0<a<1;omitted+=a
  else:assert i['estimatedAvailableCarbohydratePerServingG']==0
 assert omitted<2;assert rnd(gk)==dec(e['gk']);assert abs(omitted-dec(e['omittedCho']))<D('1e-12')
 ev=load('docs/nutrition/calculations/'+e['recipeId']+'.json');assert 'publicationStatus' not in ev
 totals={k:D(0) for k in ['net','total','protein','fat']};caps={k:D(0) for k in ['kcal','netCarbohydrate','totalCarbohydrate','protein','fat']}
 for i in ev['ingredients']:
  if i.get('excludedReason'):
   for k in caps:caps[k]+=dec(i['omissionImpactUpperBoundPerServing'][k])
   continue
  f=i['record'];assert f['polyolsSourceVerified'];p=f['per100g'];assert p['polyols'] is not None
  w=dec(i['amount'])/100/s;a=available(f);totals['net']+=w*a;totals['total']+=w*(a+dec(p['fibre'])+dec(p['polyols']));totals['protein']+=w*dec(p['protein']);totals['fat']+=w*dec(p['fat'])
 for k,v in caps.items():assert v<= (10 if k=='kcal' else 1)
 for k,pub in [('net','carbs_net_per_serving_g'),('total','carbs_total_per_serving_g'),('protein','protein_per_serving_g'),('fat','fat_per_serving_g')]:assert rnd(totals[k])==e['newMacros'][pub],(e['recipeId'],k,totals[k])
 out.append({'recipeId':e['recipeId'],'gkExact':str(gk),'omittedExact':str(omitted),'macros':{k:str(rnd(v)) for k,v in totals.items()}})
assert len(out)==9
scenarios=[]
for p in load('docs/nutrition/gk80-operation146/research-prototypes.json')['recipes']:
 local={i['record']['id']:i['record'] for i in p['macroEvidence']['ingredients'] if i.get('record')};s=dec(p['input']['servings']);gk=D(0);omitted=D(0)
 for i in p['input']['ingredients']:
  if i.get('fineliRecordId'):
   a=dec(i['grams'])*available(local[i['fineliRecordId']])/100/s
   if i.get('giRecordId'):gk+=a*dec(gis[i['giRecordId']]['gi'])/100
   else:assert a<1;omitted+=a
  elif 'availableCarbohydrateUpperBoundPerServingG' in i:
   a=dec(i['availableCarbohydrateUpperBoundPerServingG']);assert 0<a<1;omitted+=a
  else:assert i['estimatedAvailableCarbohydratePerServingG']==0
 assert omitted<2;assert rnd(gk)==dec(p['gkResult']['glycemicLoadPerServing'])
 assert any(f['per100g'].get('polyols') is None for f in local.values())
 scenarios.append({'recipeId':p['recipeId'],'gkExact':str(gk),'omittedExact':str(omitted),'activated':False})
assert len(scenarios)==6
print(json.dumps({'status':'PASS','checked':len(out),'researchScenariosChecked':len(scenarios),'recipes':out,'researchScenarios':scenarios}))
