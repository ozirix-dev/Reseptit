from pathlib import Path
from decimal import Decimal as D,ROUND_FLOOR,ROUND_CEILING
from copy import deepcopy
import json,hashlib,subprocess,sys
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
catalog=read(HERE/'composition-and-side-source.json');foods=catalog['foods'];cards=read(HERE/'source-cards.json')['cards'];case=read(HERE/'banh-bao-component-proposal.json')
m=read(HERE/'source-manifest.json')
for rel,h in m['sourceLfSha256'].items():
 b=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert hashlib.sha256(b).hexdigest()==h,rel
 if not rel.startswith('docs/research/'):
  assert b==subprocess.check_output(['git','-C',str(ROOT),'show',m['referenceMain']+':'+rel]),rel
for f in foods.values():
 x=next(x for x in read(ROOT/f['nativePath'])['foods'] if x['source_id']==f['nativeId']);assert x==f['nativeRecord']
 af=f['nativePath'].endswith('afcd-release-3-reference.json');v=x['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if af else x['per100g']['available_carbohydrate_g_per_100g'];assert f['availableChoPer100g']==v
 if af:assert f['polyols'] is None
 else:assert f['polyols']==x['per100g']['polyols_g_per_100g']
assert foods['fineli-345']['polyols'] is None
assert catalog['soyGiCard']==next(x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records'] if x['id']=='op142-lowcho50-r4')
assert 'afcd-F008065-r4' in catalog['soyGiCard']['originalSourceCard']['allowedCompositionIds']

def calculate(c):
 if c['recipeId']!='vietnamilainen-banh-bao-kananmunalla' or c['servings']!=2:raise ValueError('Only the reviewed named research case is supported')
 rows=c['ingredients'];unit=c['preparedUnit'];sides=c['separateIngredients']
 original=[x['originalIndex'] for x in rows if x['originalIndex'] is not None]
 if sorted(original)!=list(range(5)) or len(rows)!=7:raise ValueError('Incomplete original row mapping or unknown additional ingredient')
 allocated=unit['ingredientIndices']+[x['ingredientIndex'] for x in sides]
 if sorted(allocated)!=list(range(7)):raise ValueError('Missing or double-counted component allocation')
 if unit['foodClass']!='UNFILLED_YEAST_STEAMED_REFINED_WHEAT_BREAD' or sorted(unit['ingredientIndices'])!=[0,4,5,6]:raise ValueError('Prepared food is not the complete unfilled bun component')
 if [rows[i]['foodId'] for i in [0,4,5,6]]!=['fineli-110','fineli-30','fineli-922','afcd-F009606']:raise ValueError('Unreviewed dough formulation')
 amounts=[]
 for row in rows:
  if row['foodId'] not in foods:raise ValueError('Unknown food composition')
  food=foods[row['foodId']];coef=D(str(food['availableChoPer100g']))
  if row['grams'] is None:
   if row['foodId']!='fineli-30' or coef!=0:raise ValueError('Unknown positive-CHO food quantity is not zero')
   amounts.append(D(0));continue
  if D(str(row['grams']))<0:raise ValueError('Invalid mass')
  amounts.append(D(str(row['grams']))*coef/100/D(c['servings']))
 if rows[5]['grams']!=50 or rows[6]['grams']!=.6:raise ValueError('New water and yeast specification changed')
 side_gk=D(0);omit=D(0)
 for side in sides:
  i=side['ingredientIndex'];food=rows[i]['foodId'];cho=amounts[i]
  if side['method']=='EXISTING_NAMED_SOY_IMPUTATION50':
   if food!='afcd-F008065' or foods[food]['availableChoPer100g']>5:raise ValueError('Soy-only published imputation cannot stand for hoisin or another brand')
   side_gk+=cho*D(50)/100
  elif side['method']=='POSITIVE_GI_OMISSION':
   if food not in ['fineli-858','fineli-345'] or not(0<cho<1):raise ValueError('Unreviewed or too-large positive omission')
   omit+=cho
  else:raise ValueError('Unreviewed side method')
 if omit>=2:raise ValueError('Cumulative omission at or above2g')
 bread_cho=sum(amounts[i] for i in unit['ingredientIndices']);scenarios=[]
 for sid in unit['sourceIds']:
  if sid not in ['lau2015-osb68','lan2013-white93']:raise ValueError('Source HOLD or non-reviewed GI may not be applied')
  card=cards[sid]
  if card['scope']!='PREPARED_COMPONENT_ONLY' or card['foodClass']!=unit['foodClass']:raise ValueError('Wrong source scope or food class')
  scenarios.append({'sourceId':sid,'preparedGi':card['gi'],'wholeBunChoPerServingG':str(bread_cho),'gkPerServing':str(bread_cho*D(str(card['gi']))/100+side_gk)})
 if not scenarios:raise ValueError('No source scenario')
 vals=[D(x['gkPerServing']) for x in scenarios];lo=min(vals);hi=max(vals)
 return {'recipeId':c['recipeId'],'scenarios':scenarios,'gkMin':str(lo),'gkMax':str(hi),'displayBounds':[int((lo/5).to_integral_value(rounding=ROUND_FLOOR)*5),int((hi/5).to_integral_value(rounding=ROUND_CEILING)*5)],'separateSoyGk':str(side_gk),'positiveGiOmissionChoG':str(omit),'totalAvailableChoG':str(sum(amounts)),'polyolsInMushroomAndAfcdFoods':'UNKNOWN_NOT_ASSUMED_ZERO','confidence':'LOW','sourceScenarioNotConfidenceOrPhysiologicalInterval':True,'sourceApplicationApproved':False,'publicationApproved':False,'newPublishedValue':False}

result=calculate(case)
# Independent fixed-expression calculation catches unit factors, side allocation and rounding.
direct_bread=(D(100)*D('73.998')/100+D('.6')*D('6.3')/100)/2
direct_side=D('15.75')*D('3.2')/100/2*D('.5')
assert direct_bread==D('37.0179') and direct_side==D('.126')
assert direct_bread*D('.68')+direct_side==D(result['gkMin'])==D('25.298172')
assert direct_bread*D('.93')+direct_side==D(result['gkMax'])==D('34.552647')
assert result['displayBounds']==[25,35] and D(result['positiveGiOmissionChoG'])==D('.1875')
assert D(result['totalAvailableChoG'])==D('37.4574')
assert cards['lan2013-white93']['uncertainty']['type']=='SD' and cards['lau2015-osb68']['uncertainty']['type']=='SEM'
h=cards['haini2022-control69.18-HOLD'];assert h['scope']=='HOLD_NOT_USED';a=h['reportedTable1ControlPer100g'];t=h['reportedTable5']
assert D(str(a['availableCho']))+D(str(a['protein']))+D(str(a['fat']))==D('107.05')
assert 4*(D(str(a['availableCho']))+D(str(a['protein'])))+9*D(str(a['fat']))+2*D(str(a['fibre']))==D('435.51')
assert abs(float(t['sd'])/15**.5-float(t['sem']))>4
controls=[]
def reject(label,change):
 x=deepcopy(case);change(x)
 try:calculate(x)
 except (ValueError,KeyError,TypeError) as e:controls.append({'label':label,'status':'REJECTED','reason':str(e)})
 else:raise AssertionError('Unsafe case passed: '+label)
reject('Wholefood GI may not be used only on raw flour',lambda x:x['preparedUnit'].update(ingredientIndices=[0]))
reject('Double-counted flour as separate side',lambda x:x['separateIngredients'].append({'ingredientIndex':0,'method':'POSITIVE_GI_OMISSION'}))
reject('Missing egg allocation',lambda x:x['separateIngredients'].pop(0))
reject('Unknown mushroom mass is not zero',lambda x:x['ingredients'][2].update(grams=None))
reject('Unreviewed hoisin cannot inherit soy GI50',lambda x:x['ingredients'][3].update(foodId='afcd-F008008'))
reject('Haini reported69.18 remains source HOLD',lambda x:x['preparedUnit'].update(sourceIds=['haini2022-control69.18-HOLD']))
reject('Egg/mushroom filled-before-steaming bread is not the unfilled source component',lambda x:x['preparedUnit'].update(foodClass='STUFFED_BUN'))
reject('1.5g positive egg omission is blocked',lambda x:x['ingredients'][1].update(grams=1000))
impact=read(HERE/'impact-and-coordination.json');own=set(impact['ownAResearchIds']+impact['ownBPreparedScenarioIds']);pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);rahka={'rahkapiirakka-vhh'}
assert len(own)==18 and len(pub)==179 and not own&pub and not own&rahka and len(pub|own|rahka)==198
assert all(case['recipeId'] not in ids for ids in impact['codex2ReservedIdsByFile'].values())
out={'result':result,'negativeControls':controls,'newOwnCandidateIds':1,'totalOwnConditionalIds':18,'newApprovedValues':0,'newPublishedValues':0,'currentProductionModelWholeRecipeRun':False,'method':'Isolated proposal: human prepared bun component GI once plus separate named soy and positive egg/mushroom omissions. No new production method or source approval.'}
if '--verify' in sys.argv:
 assert read(HERE/'results.json')==out
 print('PASS:7rowsincluding2explicitdoughadditions,nativeCHO,independentDecimal25.298172-34.552647,8negativecontrols,HainiHOLD,18uniqueconditionalIDs,0newpublished.')
else:print(json.dumps(out,ensure_ascii=False,indent=2))
