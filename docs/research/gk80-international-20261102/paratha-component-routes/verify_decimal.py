from pathlib import Path
from decimal import Decimal as D,ROUND_FLOOR,ROUND_CEILING
import json,hashlib,subprocess,sys,yaml
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'));sha=lambda b:hashlib.sha256(b).hexdigest()
manifest=read(HERE/'source-manifest.json');catalog=read(HERE/'source-catalog.json');cards=read(HERE/'prepared-source-cards.json')['cards'];result=read(HERE/'results.json');cases=read(HERE/'cases.json')['cases']
for rel,h in manifest['sourceLfSha256'].items():
 b=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert sha(b)==h,rel
 if not rel.startswith('docs/research/gk80-international-20261102/'):assert b==subprocess.check_output(['git','-C',str(ROOT),'show',manifest['mainObserved']+':'+rel]),rel
for key,f in catalog['foods'].items():
 r=next(x for x in read(ROOT/f['nativePath'])['foods'] if x['source_id']==f['nativeId']);a=key.startswith('afcd');p=r if a else r['per100g'];v=p['available_carbohydrate_without_sugar_alcohols_g_per_100g' if a else 'available_carbohydrate_g_per_100g'];assert f['availableChoPer100g']==v
 if a:assert f['polyols'] is None and f['polyolsStatus']=='UNKNOWN_NOTZERO'
 else:assert f['polyols']==p['polyols_g_per_100g']
gi={x['id']:x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']}
for k,v in catalog['sideGiCards'].items():assert v==gi[k]
assert 'afcd-F008065-r4' in gi['op142-lowcho50-r4']['originalSourceCard']['allowedCompositionIds'] and catalog['foods']['afcd-F008065']['availableChoPer100g']==3.2<=5
expected={'aloo-paratha':('57.07930685','57.47330685',[55,60]),'intialainen-aloo-paratha':('39.5874897','39.5874897',[35,40]),'kiinalainen-kevatsipulipannukakku':('11.9838384','19.889064',[10,20])}
for case in cases:
 src=yaml.safe_load((ROOT/case['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1]);assert src['ingredients']==case['sourceIngredients'] and src['servings']==case['servings']
 original=[r for r in case['ingredients'] if r['originalIndex'] is not None];assert [r['sourceIngredient'] for r in original]==src['ingredients']
 unit=case['preparedUnits'][0];side=case['separateIngredients'][0];assert sorted(unit['ingredientIndices']+[side['ingredientIndex']])==list(range(len(case['ingredients'])))
 row=case['ingredients'][side['ingredientIndex']];sideCho=D(str(row['grams']))*D(str(catalog['foods'][row['foodId']]['availableChoPer100g']))/100/D(case['servings']);sideGk=sideCho*D(str(gi[side['giId']]['gi']))/100
 lo=sum(D(case['ingredients'][i]['choBatchMinG']) for i in unit['ingredientIndices'])/D(case['servings']);hi=sum(D(case['ingredients'][i]['choBatchMaxG']) for i in unit['ingredientIndices'])/D(case['servings'])
 # Explicit independent per-recipe equations protect unit factors and added sides.
 if case['recipeId']=='aloo-paratha':
  direct=(D(300)*D('73.998')/100+D(400)*D('15.5')/100+D('2.65')*D('33.7')/100+D(1)*D('12.9')/100+D(15)*D('1.9')/100)/4
  assert lo==direct and hi==direct+D('2')/4 and row['grams']==200 and sideGk==D('.875')
 elif case['recipeId']=='intialainen-aloo-paratha':
  direct=(D(100)*D('73.998')/100+D(150)*D('15.5')/100+D(6)*D('1.9')/100+D('2.65')*D('33.7')/100)/2
  assert lo==hi==direct and row['grams']==100 and sideGk==D('.875')
 else:
  direct=(D(100)*D('73.998')/100+D('12.6')*D('4.6')/100)/2
  assert lo==hi==direct and sideGk==D('15.75')*D('3.2')/100/2*D('.5')
  assert D(str(case['ingredients'][2]['grams']))==30*D('.42') and D(str(case['ingredients'][3]['grams']))==15*D('.92') and D(str(row['grams']))==15*D('1.05')
  assert case['ingredients'][3]['foodId']=='afcd-F006187' and catalog['foods']['afcd-F006187']['availableChoPer100g']==0
 bounds=[]
 for sid in unit['sourceIds']:
  card=cards[sid];assert card['allowedScope']=='PREPARED_UNIT' and card['foodClass']==unit['foodClass'];bounds.append((lo*D(str(card['gi']))/100+sideGk,hi*D(str(card['gi']))/100+sideGk))
 low=min(x[0] for x in bounds);high=max(x[1] for x in bounds);e=expected[case['recipeId']];assert low==D(e[0]) and high==D(e[1])
 r=next(x for x in result['results'] if x['recipeId']==case['recipeId']);assert D(r['gkMin'])==low and D(r['gkMax'])==high
 band=[int((low/5).to_integral_value(rounding=ROUND_FLOOR)*5),int((high/5).to_integral_value(rounding=ROUND_CEILING)*5)];assert band==r['outwardDisplayBounds']==e[2]
 assert not case['publicationApproved'] and not case['sourceApplicationApproved'] and not case['contentVersionApproved'] and case['sourceScenarioNotPhysiologicalInterval']
assert len(result['negativeControls'])==6 and all(x['status']=='REJECTED' for x in result['negativeControls'])
assert cards['potato-paratha-control78.8']['gi']==78.8 and cards['potato-paratha-control78.8']['n']==15
assert cards['kawan-frozen-paratha53']['gi']==53 and cards['kawan-frozen-paratha53']['sem']==5 and cards['kawan-frozen-paratha53']['n']==10
assert cards['omani-unfilled-paratha31.8']['n']==9 and cards['omani-unfilled-paratha31.8']['uncertaintyType']=='NOT_PROMOTED_TO_SEM_OR_RECIPE_INTERVAL'
coord=read(HERE/'impact-and-coordination.json');own=set(coord['ownAResearchIds'])|set(coord['priorConditionalPreparedIds'])|set(coord['newConditionalPreparedIds']);pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);other=set(coord['otherApprovedUnpublishedIds']);assert len(own)==16 and not(own&pub or own&other) and len(pub|own|other)==196
assert not(set(coord['newConditionalPreparedIds'])&set(sum(coord['codex2ReservedIdsByFile'].values(),[])))
print('PASS:3completepreparedscenarios,nativeCHO,explicit yogurt and soy sides,no double count,6negativecontrols,outward55–60/35–40/10–20;16ownconditionalIDs,196hypotheticaltotal,0newpublished.')
