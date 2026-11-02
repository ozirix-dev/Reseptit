from pathlib import Path
from decimal import Decimal as D,ROUND_FLOOR,ROUND_CEILING
import json,hashlib,subprocess,sys,yaml
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda b:hashlib.sha256(b).hexdigest()
c=read(HERE/'source-catalog.json');p=read(HERE/'published-imputation-profiles.json');gi={x['id']:x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']};m=read(HERE/'imputation-model-results.json')
assert set(p['cards'])=={'op142-vegetable-imputation40','op142-dairy-imputation30'}
for k,v in p['cards'].items():assert v==gi[k] and v['evidenceKind']=='PUBLISHED_IMPUTATION'
for case in p['cases']:
 total=D(0)
 for row in case['ingredients']:
  if row['giRecordId']:
   total+=D(str(row['grams']))*D(str(c['foods'][row['fineliRecordId']]['per100g']['carbohydrate']))/100/8*D(str(gi[row['giRecordId']]['gi']))/100
 assert total==D(case['expectedGk'])
 r=next(x for x in m['results'] if x['recipeId']==case['recipeId'])['result'];assert r['status']=='CALCULATED' and abs(D(str(r['unroundedGlycemicLoadPerServing']))-total)<D('.000000001')
s=read(HERE/'samosa-prepared-source-scenario.json');raw=(ROOT/s['sourcePath']).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert sha(raw)==s['sourceLfSha256'] and raw==subprocess.check_output(['git','-C',str(ROOT),'show',read(HERE/'source-manifest.json')['mainObserved']+':'+s['sourcePath']])
src=yaml.safe_load(raw.decode().split('---',2)[1]);assert src['servings']==s['servings']==4 and src['ingredients']==[r['sourceIngredient'] for r in s['ingredients']] and len(s['ingredients'])==11
fin={x['source_id']:x for x in read(ROOT/'docs/nutrition/fineli-release-20-reference.json')['foods']};af={x['source_id']:x for x in read(ROOT/'docs/nutrition/afcd-release-3-reference.json')['foods']};lo=D(0);hi=D(0)
for r in s['ingredients']:
 if r['nativeId']:
  k=r['nativeId'];v=af[k]['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if k.startswith('F') else fin[k]['per100g']['available_carbohydrate_g_per_100g'];a=b=D(str(r['grams']))*D(str(v))/100
 else:assert r['carbohydrateSource']=='PHYSICAL_CHO_MASS_INTERVAL' and r['grams']==1;a=D(0);b=D(1)
 assert a==D(r['availableChoBatchMinG']) and b==D(r['availableChoBatchMaxG']);lo+=a;hi+=b
card=read(HERE/'oman-human-source-card.json');assert card['humanGi']==s['componentGi']==60.4 and card['inVitroPredictedGi']==69.2
lo=lo/4*D('60.4')/100;hi=hi/4*D('60.4')/100;assert lo==D(s['gkScenarioMin'])==D('44.460742') and hi==D(s['gkScenarioMax'])==D('44.611742')
assert [(lo/5).to_integral_value(rounding=ROUND_FLOOR)*5,(hi/5).to_integral_value(rounding=ROUND_CEILING)*5]==[40,45]==s['displayBounds']
assert s['wholePreparedUnitCount']==1 and not s['ingredientGiContributionsAlsoAdded'] and not s['publicationApproved'] and not s['sourceApplicationApproved']
sel=read(HERE/'three-method-selection.json');assert len(sel['selected'])==3 and [x['rank'] for x in sel['selected']]==[1,2,3] and sel['displayPolicy']['semNotUsedAsRecipeRange'] is True
coord=read(HERE/'impact-and-coordination.json');pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);own=set(coord['ownCandidateIds']);allown=own|set(coord['additionalPreparedScenarioIds']);other=set(coord['otherApprovedUnpublishedIds']);assert len(own)==12 and len(allown)==13 and not(pub&allown or other&allown) and len(pub|allown|other)==193
assert 'samosa' not in sum(coord['codex2ReservedIdsByFile'].values(),[])
print('PASS:all3methodsapplied,twoimputationprofilesactualAengine,samosa11rowscountedonce,unknownblendCHOintervalnotzero,sourceGI60.4notlab69.2,outward40–45,193hypotheticaldedup;0newpublished.')
