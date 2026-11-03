from pathlib import Path
from decimal import Decimal as D
import json,hashlib,subprocess,yaml,sys
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'));sha=lambda b:hashlib.sha256(b).hexdigest()
c=read(HERE/'source-catalog.json');m=read(HERE/'source-manifest.json');out=read(HERE/'model-results.json');foods=c['foods']
assert c['mustard']==read(ROOT/'docs/research/gk80-international-20261102/pancake-source-and-fixed-input/source-catalog.json')['products']['mustard']
assert c['mustard']['labelCarbohydrateG']==3.5
for rel,h in m['sourceLfSha256'].items():
 b=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert sha(b)==h
 if not rel.startswith('docs/research/'):assert b==subprocess.check_output(['git','-C',str(ROOT),'show',m['referenceMain']+':'+rel]),rel
for k,f in foods.items():
 if k=='MEXT2023-05001':continue
 af=k.startswith('afcd-');npath=f.get('nativePath',f.get('nativeSourcePath'));sid=f.get('nativeId',f.get('nativeSourceRecord',{}).get('source_id'))
 n=next(x for x in read(ROOT/npath)['foods'] if x['source_id']==sid);p=n if af else n['per100g'];value=p['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if af else p['available_carbohydrate_g_per_100g'];assert value==f['per100g']['carbohydrate']
 if af:assert f['per100g']['polyols'] is None
 else:assert f['per100g']['polyols']==p['polyols_g_per_100g']
alm=foods['MEXT2023-05001'];n=alm['nativeSourceRecord'];assert n['massToken']==n['carbohydrateMassToken']=='5.2' and n['polyolsToken']=='-' and alm['per100g']['polyols'] is None
assert sha(json.dumps(n,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode())==m['frozenMextRecordCanonicalSha256']==c['reusedMext']['recordCanonicalSha256']
up=Path(c['reusedMext']['upstreamWorktree'])/c['reusedMext']['path'];assert n==next(x for x in read(up)['records'] if x['nativeId']=='05001')
gis={x['id']:x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']}
assert all(v==gis[k] for k,v in c['existingGiCards'].items())
expected={'vhh-mustikkapiirakka':(D('1.30177875'),D('1.736875')),'lindstrominpihvit-kaalilla':(D('6.895695'),D('.6495625'))}
for name in ['blueberry-pie-proposal.json','lindstrom-defined-brine-proposal.json']:
 b=read(HERE/name);src=yaml.safe_load((ROOT/b['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1]);assert b['sourceIngredients']==src['ingredients'] and b['servings']==src['servings']
 gk=D(0);omit=D(0)
 for i in b['ingredients']:
  if i['fineliRecordId']:
   f=foods[i['fineliRecordId']];coef=D(str(f['per100g']['carbohydrate']));cho=D(str(i['grams']))*coef/100/b['servings']
  elif 'availableCarbohydrateUpperBoundPerServingG' in i:
   cho=D(str(i['availableCarbohydrateUpperBoundPerServingG']))
  else:
   assert i['grams'] is None and i['name'].startswith('plain suola') and foods['fineli-30']['per100g']['carbohydrate']==0 and i['estimatedAvailableCarbohydratePerServingG']==0;cho=D(0)
  if i['giRecordId']:gk+=cho*D(str(gis[i['giRecordId']]['gi']))/100
  else:assert cho<1;omit+=cho
 assert gk==expected[b['recipeId']][0] and omit==expected[b['recipeId']][1]<2
 mr=next(x for x in out['results'] if x['recipeId']==b['recipeId']);assert mr['result']['status']=='CALCULATED'
 assert abs(D(str(mr['result']['unroundedGlycemicLoadPerServing']))-gk)<D('1e-10') and abs(D(str(mr['result']['omittedAvailableCarbohydratePerServingG']))-omit)<D('1e-10')
 assert not b['sourceApplicationApproved'] and not b['contentVersionApproved'] and not b['publicationApproved']
 if b['recipeId']=='vhh-mustikkapiirakka':
  assert len(b['ingredients'])==7 and b['ingredients'][2]['grams']==55 and b['ingredients'][4]['grams']==110
  assert b['ingredients'][6]['grams']==5 and D(str(b['ingredients'][6]['availableCarbohydrateUpperBoundPerServingG']))==D(5)/8
  direct=D(250)*D(3)/100/8*D('.35')+D(150)*D('10.182')/100/8*D('.51');assert direct==gk
  assert D(150)*D('5.2')/100/8==D('.975') and D(150)*D('5.4')/100/8==D('1.0125')
 else:
  assert len(b['ingredients'])==12 and sum(D(str(x['grams'])) for x in b['ingredients'] if x['sourceRowIndex']==2)==D(30)
  assert b['ingredients'][7]['grams']==15.75 and D(str(b['ingredients'][7]['availableCarbohydrateUpperBoundPerServingG']))==D('15.75')*D('3.5')/100/4
  direct=D(100)*D('8.163')/100/4*D('.66')+D(500)*D('4.97')/100/4*D('.66')+D(10)*D('99.9')/100/4*D('.58');assert direct==gk
controls=sum((x['negativeControls'] for x in out['results']),[]);assert len(controls)==9 and all(x['status'] in ['REJECTED','INSUFFICIENT SOURCE DATA'] for x in controls)
s=read(HERE/'sempio-source-card.json');assert s['declared']['totalCarbohydrateG']==40 and s['declared']['alluloseG']==19 and s['declared']['dietaryFibreG']==4 and s['residualAlgebraGPer100g']==17
assert s['newWholeRecipeUnlocks']==0 and not s['methodChangeApplied'] and s['status'].endswith('NOT_USED_IN_RECIPE_MODEL') and 'gi' not in s
a=read(HERE/'impact-and-coordination.json');own=set(a['ownAResearchIds']+a['ownBPreparedScenarioIds']);pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);other={'rahkapiirakka-vhh'}
assert len(a['ownAResearchIds'])==15 and len(a['ownBPreparedScenarioIds'])==5 and len(own)==20 and not own&pub and not own&other and len(pub|own|other)==200
assert not(set(a['newThisPackage'])&set(sum(a['codex2ReservedIdsByFile'].values(),[])))
print('PASS:2completefixedversions,19source/calculationrows,independentDecimal,9controls,20uniqueconditionalIDs,Sempio0unlocks,0newpublished.')
