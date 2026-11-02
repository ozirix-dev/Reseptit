"""Independent, one-recipe Decimal reconstruction. Never writes a source/recipe file."""
import json,sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

D=Decimal
root=Path(__file__).resolve().parents[2]
folder=root/'docs/nutrition/gk-scenarios-01'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
pack=read(folder/'pilot.json')
result_file=Path(sys.argv[1]) if len(sys.argv)>1 else root/'tmp/nutrition/gk-scenarios-01/results.json'
results=read(result_file)['results']
old=root/'docs/nutrition/gk80-operation149'
case=next(c for c in read(old/'cases.json')['cases'] if c['recipeId']==pack['recipeId'])
comps={c['id']:c for c in read(old/'composition-sources.json')['records']}
gis={g['id']:g for g in read(old/'gi-sources.json')['records']}
servings=D(case['servings']);assert servings==D(pack['servings'])
base={};ordinary_subtotal=D(0);other_unresolved=D(0)
for index,i in enumerate(case['candidateIngredients']):
 if i['compositionId'] in ['F009837',pack['separateErythritolCompositionId']]:continue
 grams=D(str(i['grams']));cho=grams*D(str(comps[i['compositionId']]['availablePer100g']))/100/servings
 gk=cho*D(str(gis[i['giId']]['values'][0]))/100 if i['giId'] else (D(0) if cho==0 else None)
 if gk is not None:ordinary_subtotal+=gk
 else:other_unresolved+=cho
 base['base-'+str(index)]=(cho,gk)
assert ordinary_subtotal.quantize(D('.01'),rounding=ROUND_HALF_UP)==D('.07')
assert other_unresolved+D('4.1')*D(pack['chocolateGrams'])/100/servings==D('1.3774')
responses={g['id']:g for g in pack['responses']}
def check(actual,expected):
 if expected is None:assert actual is None
 else:assert actual is not None and abs(D(str(actual))-expected)<D('1e-12'),(actual,expected)

rows=[]
for p in pack['products']:
 result=next(r for r in results if r['scenarioId']==p['id'])
 assert result['wholeRecipe']['kind']=='UNAVAILABLE'
 expected=dict(base);chocolate=D(pack['chocolateGrams'])
 ordinary=D(p['raw']['withoutSugarAlcohols']) if p['carbohydrateDefinition']=='AFCD_WITHOUT_SUGAR_ALCOHOLS' else D(p['raw']['labelCarbohydrate'])-D(p['raw']['polyols'])
 expected['chocolate-ordinary']=(ordinary*chocolate/100/servings,None)
 subtotal=ordinary_subtotal
 for species,value in p['species'].items():
  if value is None:continue
  amount=D(value)*chocolate/100/servings
  coefficient=responses[p['responseBindings'][species]]
  assert coefficient['species']==species and coefficient['massBasis']=='FULL_REPORTED_POLYOL_MASS'
  contribution=amount*D(coefficient['gi'])/100
  expected['chocolate-'+species]=(amount,contribution);subtotal+=contribution
 separate=D(pack['separateErythritolGrams'])/servings
 contribution=separate*D(responses[pack['separateErythritolResponseId']]['gi'])/100
 expected['separate-erythritol']=(separate,contribution);subtotal+=contribution
 assert {t['id'] for t in result['terms']}==set(expected)
 for term in result['terms']:
  cho,gk=expected[term['id']];check(term['gPerServing'],cho);check(term['gkPerServing'],gk)
 check(result['calculatedPortion'],ordinary_subtotal)
 check(result['conditional']['alternatives'][0]['value'],subtotal)
 check(result['coverage']['unresolvedOrdinaryChoG'],other_unresolved+expected['chocolate-ordinary'][0])
 rows.append({'product':p['id'],'conditionalComponentSubtotal':str(subtotal),'unresolvedOrdinaryChoG':str(other_unresolved+expected['chocolate-ordinary'][0]),'wholeRecipe':'UNAVAILABLE'})
print(json.dumps({'decimalCheck':'PASS','approvedInputHash':case['inputSha256'],'calculatedPortion':str(ordinary_subtotal),'rows':rows},indent=2))
