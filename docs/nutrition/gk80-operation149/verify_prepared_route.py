"""Independent Decimal replay of the eight closed A/B route proposals; no writes."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
def read(p):return json.loads(p.read_text(encoding='utf8'))
def q(v):return str(v.quantize(D('.01'),rounding=ROUND_HALF_UP))
pack=read(HERE/'prepared-route-cases.json')
assert all(pack[k] is False for k in ['activation','ownerApproval','readyAuthorized','mergeAuthorized','deployAuthorized'])
comps={r['id']:r for n in ['composition-sources.json','recovery-composition.json','prepared-route-composition.json'] for r in read(HERE/n)['records']}
gis={r['id']:r for n in ['gi-sources.json','recovery-gi.json','prepared-route-gi.json'] for r in read(HERE/n)['records']}
obs=read(HERE/'prepared-route-observations.json');prepared={r['id']:r for r in obs['preparedSources']}
ifct=obs['ifctRecords'][0];assert ifct['foodCode']=='G010' and ifct['nativeTable']==6 and D(str(ifct['availablePer100g']))==D('3.66')
assert D(str(ifct['byDifferenceTable1Value']))==D('4.51')
for f in comps.values():
 if f['kind'] in ['FINELI_CHOAVL','AFCD_WITHOUT_SUGAR_ALCOHOLS']:
  r=next(r for r in read(ROOT/f['path'])['foods'] if r['source_id']==f['nativeId'])
  v=r['per100g']['available_carbohydrate_g_per_100g'] if f['kind']=='FINELI_CHOAVL' else r['available_carbohydrate_without_sugar_alcohols_g_per_100g']
  assert D(str(v))==D(str(f['availablePer100g']))
expected={'chettinad-kana':('1.41925','1.41925'),'kaakao-kookos-chia':('1.5949','1.5949'),'hyderabadi-kanabiryani':('30.60421','44.93684'),'baozi':('31.55529','31.55529'),'pizza-margherita':('59.15606','59.15606'),'malesialainen-roti-jala-currykanalla':('19.61531','19.61531'),'intialainen-mannasuurimoupma':('27.630005','27.630005'),'pohjoisafrikkalainen-taatelipuuro-appelsiinilla':('21.64195','21.64195')}
results=[]
for c in pack['cases']:
 s=D(c['servings']);rows=[];lo=D(0);hi=D(0);omitted=D(0)
 for i in c['candidateIngredients']:
  vs=[D(str(comps[id]['availablePer100g'])) for id in [i['compositionId']]+i.get('carbohydrateScenarioCompositionIds',[])]
  factor=D(str(i['grams']))/D(100)/s
  rows.append((D(0) if i['carbohydrateUse']=='UPPER_BOUND' else factor*min(vs),factor*max(vs)))
 if c['applicationMode']=='INGREDIENT_SUM':
  trace=D(0)
  for i,(a,b) in zip(c['candidateIngredients'],rows):
   if i['giId'] is None:
    if b>0:assert c['level']=='A' and b<D(1);omitted+=b
   else:
    g=gis[i['giId']];assert i['compositionId'] in g['allowedCompositionIds'] and len(g['values'])==1
    v=D(str(g['values'][0]));lo+=a*v/D(100);hi+=b*v/D(100)
    if g['id']=='trace50':assert b<=D('.5');trace+=b
  assert trace<=D(1) and omitted<D(2)
 else:
  assert c['level']=='B';seen=[]
  for n in c['preparedNodes']:
   seen+=n['ingredientIndexes'];a=sum((rows[ix][0] for ix in n['ingredientIndexes']),D(0));b=sum((rows[ix][1] for ix in n['ingredientIndexes']),D(0))
   if n['sourceId'] in prepared:
    src=prepared[n['sourceId']];assert src['foodClass']==n['foodClass'] and n['unitScope'] in src['allowedUnitScopes'] and c['recipeId'] in src['allowedRecipeIds']
    if n['unitScope']=='PREPARED_RECIPE':assert len(n['ingredientIndexes'])==len(rows)
    gi=D(str(src['gi']))
   elif n['sourceId'] is None:assert b==0;gi=D(0)
   else:gi=D(str(gis[n['sourceId']]['values'][0]))
   lo+=a*gi/D(100);hi+=b*gi/D(100)
  assert sorted(seen)==list(range(len(rows)))
  if c['recipeId']=='hyderabadi-kanabiryani':
   rice=[i for i in c['candidateIngredients'] if i.get('accountingKey')=='RICE_MAIN_BATCH'];assert len(rice)==1 and rice[0]['massBasis']=='COOKED_EDIBLE_WEIGHED'
   assert rice[0]['grams']==900 and c['riceMassDecision']['isYieldConversion'] is False
   assert not any(i['compositionId']=='F007682' for i in c['candidateIngredients'])
 want=expected[c['recipeId']];assert lo==D(want[0]) and hi==D(want[1]),(c['recipeId'],lo,hi,want)
 results.append({'recipeId':c['recipeId'],'level':c['level'],'minExact':str(lo),'maxExact':str(hi),'point':q(lo) if lo==hi else None,'omittedCho':str(omitted)})
assert len(results)==8 and len({r['recipeId'] for r in results})==8
print(json.dumps({'status':'PASS','checked':8,'writes':0,'publicActivation':False,'results':results}))
