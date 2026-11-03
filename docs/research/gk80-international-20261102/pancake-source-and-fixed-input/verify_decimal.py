from pathlib import Path
from decimal import Decimal as D
import json,hashlib,sys,yaml
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()).hexdigest()
manifest=read(HERE/'source-manifest.json')
for rel,h in manifest['sourceLfSha256'].items():assert sha(ROOT/rel)==h,rel
c=read(HERE/'source-catalog.json');b=read(HERE/'honey-mustard-chicken-fixed-input-proposal.json');model=read(HERE/'model-results.json')
native={rel:{r['source_id']:r for r in read(ROOT/rel)['foods']} for rel in ['docs/nutrition/fineli-release-20-reference.json','docs/nutrition/afcd-release-3-reference.json']}
for key,r in c['foods'].items():
 n=native[r['nativeSourcePath']][r['nativeSourceRecord']['source_id']];assert n==r['nativeSourceRecord']
 v=n if key.startswith('afcd') else n['per100g']
 assert r['per100g']['carbohydrate']==v['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if key.startswith('afcd') else r['per100g']['carbohydrate']==v['available_carbohydrate_g_per_100g']
 if key.startswith('afcd'):assert r['per100g']['polyols'] is None and not r['polyolsSourceVerified']
 else:assert r['per100g']['polyols']==v['polyols_g_per_100g']
gi={r['id']:r for r in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']}
for k,r in c['existingGiCards'].items():assert gi[k]==r
assert c['newGiCards']==[]
assert not b['actualBatchWeighed'] and not b['contentChangeApproved'] and not b['publicationApproved']
src=yaml.safe_load((ROOT/b['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1])
assert src['ingredients']==b['sourceIngredients'] and len(src['ingredients'])==8 and len(b['ingredients'])==9
indices=[r['sourceRowIndex'] for r in b['ingredients']];assert indices==[0,1,2,3,4,5,6,7,7]
assert src['ingredients'][7]['amount'] is None and b['ingredients'][7]['grams']==.5
assert b['ingredients'][3]['grams']==native['docs/nutrition/fineli-release-20-reference.json']['4']['portion_mass_g']['RKL']==20
assert b['ingredients'][5]['fineliRecordId'] is None and b['ingredients'][5]['grams']==3.1
assert b['ingredients'][5]['availableCarbohydrateUpperBoundPerServingG']==.775
assert c['quantitySources']['garlicPowder']['portion']['gramWeight']==3.1
assert c['quantitySources']['garlicPowder']['portion']['id']==88439
assert c['products']['mustard']['ean']=='3036810201761'
assert D(str(b['ingredients'][2]['availableCarbohydrateUpperBoundPerServingG']))==D('31.5')*D('3.5')/100/4
gk=D(0);omission=D(0)
for i in b['ingredients']:
 if i.get('availableCarbohydrateUpperBoundPerServingG') is not None:cho=D(str(i['availableCarbohydrateUpperBoundPerServingG']))
 elif i['fineliRecordId']:cho=D(str(i['grams']))*D(str(c['foods'][i['fineliRecordId']]['per100g']['carbohydrate']))/100/4
 else:assert i['estimatedAvailableCarbohydratePerServingG']==0 and c['foods']['fineli-30']['per100g']['carbohydrate']==0;cho=D(0)
 if i['giRecordId']:gk+=cho*D(str(c['existingGiCards'][i['giRecordId']]['gi']))/100
 else:assert cho<1;omission+=cho
assert omission<2 and gk==D('7.1423') and omission==D('1.2254125')
assert abs(D(str(model['result']['unroundedGlycemicLoadPerServing']))-gk)<D('.000000001')
assert abs(D(str(model['result']['omittedAvailableCarbohydratePerServingG']))-omission)<D('.000000001')
assert len(model['negativeControls'])==4 and all(r['status']=='INSUFFICIENT SOURCE DATA' for r in model['negativeControls'])
human=read(HERE/'human-source-card.json')
assert human['humanGi']==57 and human['participantsThisFood']==14 and not human['registryImported'] and human['wholeRecipeOpeningsNow']==0
assert not model['newHumanPancakeSourceApplied']
state=read(HERE/'coordination-snapshot.json')
assert b['recipeId'] not in set(sum(state['codex2ReservedIdsByFile'].values(),[]))
assert b['recipeId'] not in state['previousOwnCandidateIds']
pub=read(ROOT/'docs/research/gk80-international-20261102/stock-and-current-bindings/production-revalidation.json')['productionPage']['numericIds']
approved=read(ROOT/'docs/research/gk80-international-20261102/stock-and-current-bindings/deduplicated-roadmap.json')['approvedUnpublishedVersionsAsRecordedByOwnerMatrix']['versions']
sets=[set(pub),{r['recipeId'] for r in approved},set(state['previousOwnCandidateIds']),{b['recipeId']}]
assert list(map(len,sets))==[172,8,7,1] and len(set.union(*sets))==188
print('PASS GK',gk,'omissionUpper',omission,'8 original rows /9 mapped rows;4 negative controls;188-ID conditional deduplication; no publication.')
