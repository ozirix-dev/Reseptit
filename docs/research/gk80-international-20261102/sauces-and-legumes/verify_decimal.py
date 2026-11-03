import pathlib,json,hashlib,sys,yaml
from decimal import Decimal as D

HERE=pathlib.Path(__file__).resolve().parent
ROOT=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()).hexdigest()
m=read(HERE/'source-manifest.json');c=read(HERE/'source-catalog.json')
for rel,h in m['sourceLfSha256'].items():assert sha(ROOT/rel)==h,rel
assert c['newGiCards']==[] and not c['policyChangeApplied']
native={rel:{r['source_id']:r for r in read(ROOT/rel)['foods']} for rel in ['docs/nutrition/fineli-release-20-reference.json','docs/nutrition/afcd-release-3-reference.json']}
for key,r in c['foods'].items():
 n=native[r['nativeSourcePath']][r['nativeSourceRecord']['source_id']]
 assert n==r['nativeSourceRecord'],key
 expected=n['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if key.startswith('afcd') else n['per100g']['available_carbohydrate_g_per_100g']
 assert r['per100g']['carbohydrate']==expected,key
 if key.startswith('afcd'):assert r['per100g']['polyols'] is None and not r['polyolsSourceVerified']
 else:assert r['per100g']['polyols']==n['per100g']['polyols_g_per_100g']
sourcegi={r['id']:r for r in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']}
for k,v in c['existingGiCards'].items():assert v==sourcegi[k]
state=read(HERE/'coordination-snapshot.json')
prod=read(ROOT/'docs/research/gk80-international-20261102/stock-and-current-bindings/production-revalidation.json')['productionPage']['numericIds']
oldroad=read(ROOT/'docs/research/gk80-international-20261102/stock-and-current-bindings/deduplicated-roadmap.json')
approved=oldroad['approvedUnpublishedVersionsAsRecordedByOwnerMatrix']['versions']
assert len(approved)==8
approvedids={r['recipeId'] for r in approved}
newids=set(state['newOwnCandidateIds']);oldids=set(state['priorOwnCandidateIds'])
assert len(prod)==172 and not(newids&set(prod) or newids&oldids or newids&approvedids)
assert not(newids&set(sum(state['codex2ReservedIdsByFile'].values(),[])))
assert len(set(prod)|newids|oldids|approvedids)==187
results=read(HERE/'model-results.json')['results']
for fn in ['falafel-current-oven-version.json','okonomiyaki-named-sauces-version.json']:
 b=read(HERE/fn);raw=(ROOT/b['sourcePath']).read_text(encoding='utf-8-sig')
 src=yaml.safe_load(raw.split('---',2)[1]);assert src['ingredients']==b['sourceIngredients'] and src['servings']==b['servings']
 assert sha(ROOT/b['sourcePath'])==b['sourceLfSha256']
 assert len(b['ingredients'])==len(src['ingredients'])==b['originalIngredientCount']
 assert not b['publicationApproved'] and not b['sourceApplicationApproved']
 gk=D(0);omitted=D(0);quantities=[]
 for i in b['ingredients']:
  if i['fineliRecordId']:
   food=c['foods'][i['fineliRecordId']]
   cho=D(str(i['grams']))*D(str(food['per100g']['carbohydrate']))/100/D(str(b['servings']))
  else:
   assert i['upperBoundEvidence'].strip();cho=D(str(i['availableCarbohydrateUpperBoundPerServingG']))
  if i['giRecordId']:gk+=cho*D(str(c['existingGiCards'][i['giRecordId']]['gi']))/100
  else:assert cho<1;omitted+=cho
 assert omitted<2 and str(gk)==b['expected']['unroundedGk']
 assert omitted==D(b['expected']['omittedChoUpperG'])
 r=next(x for x in results if x['recipeId']==b['recipeId'])
 assert abs(D(str(r['result']['unroundedGlycemicLoadPerServing']))-gk)<D('0.000000001')
 assert abs(D(str(r['result']['omittedAvailableCarbohydratePerServingG']))-omitted)<D('0.000000001')
 assert len(r['negativeControls'])==3 and all(x['status']=='INSUFFICIENT SOURCE DATA' for x in r['negativeControls'])
 if b['recipeId']=='falafel':
  assert [b['ingredients'][i]['fineliRecordId'] for i in [0,2,9,13]]==['fineli-31218','fineli-393','fineli-11557','fineli-11557']
  assert [b['ingredients'][i]['grams'] for i in [0,1,2,5,6,7,10]]==[250,55,10.5,2.65,2.65,2.275,20]
 else:
  assert b['ingredients'][2]['fineliRecordId']=='afcd-F006077' and b['ingredients'][2]['giRecordId'] is None
  assert b['ingredients'][4]['grams']==30
  assert D(str(b['ingredients'][3]['availableCarbohydrateUpperBoundPerServingG']))==D(30)*D(2)/100/4
  assert D(str(b['ingredients'][6]['availableCarbohydrateUpperBoundPerServingG']))==D(100)*D('1.3')/100/4
  assert D(str(b['ingredients'][7]['availableCarbohydrateUpperBoundPerServingG']))==D(15)*D(14)/100/4
  assert omitted+D(15)*D(5)/100/4>=2
 print(b['recipeId'],'GK',gk,'omittedCHO',omitted,'margin',2-omitted)
print('PASS: native fields, recipe rows, LF pins, Decimal, six negative controls,187-ID deduplication; no publication.')
