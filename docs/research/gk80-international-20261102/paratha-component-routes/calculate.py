from pathlib import Path
from decimal import Decimal as D,ROUND_FLOOR,ROUND_CEILING
from copy import deepcopy
import json
HERE=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
c=read(HERE/'source-catalog.json');cards=read(HERE/'prepared-source-cards.json')['cards'];foods=c['foods'];cases=read(HERE/'cases.json')['cases']
def calculate(case):
 rows=case['ingredients'];serv=D(case['servings']);assert serv>0
 assert sorted(x['originalIndex'] for x in rows if x['originalIndex'] is not None)==list(range(len(case['sourceIngredients'])))
 original=[x['sourceIngredient'] for x in rows if x['originalIndex'] is not None];assert original==case['sourceIngredients']
 selected=[j for u in case['preparedUnits'] for j in u['ingredientIndices']]+[s['ingredientIndex'] for s in case['separateIngredients']]
 if sorted(selected)!=list(range(len(rows))):raise ValueError('Missing or double-counted ingredient allocation')
 for row in rows:
  if row['grams'] is None or row['grams']<0:raise ValueError('Unresolved ingredient mass')
  if row.get('physicalChoMassBound'):
   if row.get('choBatchMinG') is None or row.get('choBatchMaxG') is None:raise ValueError('Unknown composition has no physical CHO interval')
   assert D(row['choBatchMinG'])==0 and D(row['choBatchMaxG'])==D(str(row['grams']))
  elif row['foodId']:
   cho=D(str(row['grams']))*D(str(foods[row['foodId']]['availableChoPer100g']))/100
   assert D(row['choBatchMinG'])==D(row['choBatchMaxG'])==cho
  elif row['name']=='suolaa maun mukaan':
   assert foods['fineli-30']['availableChoPer100g']==0 and row.get('sourceZeroEvidence') and row['choBatchMinG']==row['choBatchMaxG']=='0'
  else:raise ValueError('Unknown composition cannot become zero')
 assert len(case['preparedUnits'])==1
 unit=case['preparedUnits'][0];identities={rows[j]['foodId'] for j in unit['ingredientIndices']}
 assert 'fineli-110' in identities
 if unit['foodClass']=='POTATO_STUFFED_PANBREAD':assert 'fineli-205' in identities
 elif unit['foodClass']=='UNFILLED_LAYERED_OIL_PANBREAD':assert 'fineli-205' not in identities
 else:raise ValueError('Unreviewed prepared food class')
 sideLo=sideHi=D(0)
 for side in case['separateIngredients']:
  if side['giId'] not in c['sideGiCards']:raise ValueError('Prepared-food GI cannot be assigned to raw flour or another separate ingredient')
  row=rows[side['ingredientIndex']];gi=c['sideGiCards'][side['giId']]
  if side['giId']=='op142-lowcho50-r4':
   assert row['foodId']=='afcd-F008065' and foods[row['foodId']]['nativeId']=='F008065' and foods[row['foodId']]['availableChoPer100g']<=5
   assert 'afcd-F008065-r4' in gi['originalSourceCard']['allowedCompositionIds']
  if side['giId']=='dairy-category-mean-gi-35':assert row['foodId']=='fineli-619'
  sideLo+=D(row['choBatchMinG'])/serv*D(str(gi['gi']))/100;sideHi+=D(row['choBatchMaxG'])/serv*D(str(gi['gi']))/100
 choLo=sum(D(rows[j]['choBatchMinG']) for j in unit['ingredientIndices'])/serv
 choHi=sum(D(rows[j]['choBatchMaxG']) for j in unit['ingredientIndices'])/serv
 scenarios=[]
 for sid in unit['sourceIds']:
  src=cards[sid]
  if src['allowedScope']!='PREPARED_UNIT' or src['foodClass']!=unit['foodClass']:raise ValueError('Prepared-food class or scope mismatch')
  gi=D(str(src['gi']));scenarios.append({'sourceId':sid,'gi':str(gi),'preparedChoPerServingMinG':str(choLo),'preparedChoPerServingMaxG':str(choHi),'gkMin':str(choLo*gi/100+sideLo),'gkMax':str(choHi*gi/100+sideHi)})
 lo=min(D(s['gkMin']) for s in scenarios);hi=max(D(s['gkMax']) for s in scenarios)
 low=(lo/5).to_integral_value(rounding=ROUND_FLOOR)*5;high=(hi/5).to_integral_value(rounding=ROUND_CEILING)*5
 return {'recipeId':case['recipeId'],'sourceScenarios':scenarios,'gkMin':str(lo),'gkMax':str(hi),'outwardDisplayBounds':[int(low),int(high)],'separateSideGkMin':str(sideLo),'separateSideGkMax':str(sideHi),'confidence':'LOW','sourceScenarioNotBiologicalRange':True,'publicationApproved':False}
results=[calculate(case) for case in cases];controls=[]
def reject(label,case,mutate):
 x=deepcopy(case);mutate(x)
 try:calculate(x)
 except (AssertionError,ValueError,TypeError,KeyError) as e:controls.append({'label':label,'status':'REJECTED','reason':str(e) or type(e).__name__})
 else:raise AssertionError('Unsafe control passed: '+label)
reject('Flour cannot be counted in both bread and a side',cases[0],lambda x:x['separateIngredients'].append({'ingredientIndex':0,'giId':'dairy-category-mean-gi-35'}))
reject('Unmatched spice blend cannot become pointzero',cases[0],lambda x:x['ingredients'][6].update(choBatchMaxG=None))
reject('Unfilled Kawan paratha cannot stand for potato-stuffed paratha',cases[0],lambda x:x['preparedUnits'][0].update(sourceIds=['kawan-frozen-paratha53']))
reject('Unknown yogurt quantity blocks the complete plate',cases[1],lambda x:x['ingredients'][-1].update(grams=None))
reject('Removing the yogurt side allocation is not a complete plate',cases[1],lambda x:x.update(separateIngredients=[]))
reject('Wholefood GI cannot be attached only to the raw-flour row',cases[0],lambda x:x.update(preparedUnits=[],separateIngredients=[{'ingredientIndex':i,'giId':'potato-paratha-control78.8'} for i in range(len(x['ingredients']))]))
out={'results':results,'negativeControls':controls,'newGiRecordsInProduction':0,'newPublishedValues':0,'method':'Prepared component GI times its source-backed availableCHO once,plus separate side GI;research only'}
(HERE/'results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for r in results:print(r['recipeId'],r['gkMin'],r['gkMax'],r['outwardDisplayBounds'])
print('PASS:',len(controls),'negative scope/quantity/unknown-source controls rejected.')
