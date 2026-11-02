"""Independent Decimal calculation using stored source data; no TypeScript calls."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
root=Path(__file__).resolve().parents[3]
def load(p):return json.loads((root/p).read_text('utf-8'),parse_float=D)
def dec(v):return D(str(v))
def rounded(v):return v.quantize(D('.01'),rounding=ROUND_HALF_UP)
pack=load('docs/nutrition/gk80-e-hold-release/integration.json')
foods={r['id']:r for r in load('docs/nutrition/food-records.json')};gis={r['id']:r for r in load('docs/nutrition/glycemic-index-records.json')['records']}
out=[]
for e in pack['recipes']:
 inp=e['newInput'];serv=dec(inp['servings']);gk=D(0);omitted=D(0)
 for row in inp['ingredients']:
  if row.get('fineliRecordId'):
   f=foods[row['fineliRecordId']];assert f['carbohydrateDefinition']=='EU_AVAILABLE';a=dec(row['grams'])*dec(f['per100g']['carbohydrate'])/100/serv
   if row.get('giRecordId'):gk+=a*dec(gis[row['giRecordId']]['gi'])/100
   else:assert a<1;omitted+=a
  elif 'availableCarbohydrateUpperBoundPerServingG' in row:
   a=dec(row['availableCarbohydrateUpperBoundPerServingG']);assert a<1;omitted+=a
  else:assert row['estimatedAvailableCarbohydratePerServingG']==0
 assert omitted<2
 assert rounded(gk)==dec(e['gk']),(e['recipeId'],gk,e['gk'])
 assert abs(omitted-dec(e['omittedChoPerServingG']))<D('1e-12')
 macros=load('docs/nutrition/calculations/'+e['recipeId']+'.json')
 if e['macroStatus']=='ESTIMATE WITH EVIDENCE':
  totals={k:D(0) for k in ['carbohydrate','fibre','polyols','protein','fat']};caps={k:D(0) for k in ['kcal','netCarbohydrate','totalCarbohydrate','protein','fat']}
  for row in macros['ingredients']:
   if row.get('excludedReason'):
    for k in caps:caps[k]+=dec(row['omissionImpactUpperBoundPerServing'][k])
   else:
    rec=row['record'];assert rec['carbohydrateDefinition']=='EU_AVAILABLE';assert rec['polyolsSourceVerified']
    for k in totals:totals[k]+=dec(row['amount'])*dec(rec['per100g'][k])/100/serv
  for k,v in caps.items():assert v<= (10 if k=='kcal' else 1)
  actual=e['macroValues'];assert rounded(totals['carbohydrate'])==actual['carbs_net_per_serving_g'];assert rounded(totals['carbohydrate']+totals['fibre']+totals['polyols'])==actual['carbs_total_per_serving_g'];assert rounded(totals['protein'])==actual['protein_per_serving_g'];assert rounded(totals['fat'])==actual['fat_per_serving_g']
 else:assert macros['ingredients'][6]['record']['per100g']['polyols'] is None
 out.append({'recipeId':e['recipeId'],'gkExact':str(gk),'omittedExact':str(omitted)})
print(json.dumps({'status':'PASS','checked':len(out),'recipes':out}))
