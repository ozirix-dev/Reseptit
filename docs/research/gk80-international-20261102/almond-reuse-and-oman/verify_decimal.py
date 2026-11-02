from pathlib import Path
from decimal import Decimal as D
import hashlib,json,sys,subprocess,yaml
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda b:hashlib.sha256(b).hexdigest()
manifest=read(HERE/'source-manifest.json');catalog=read(HERE/'source-catalog.json');foods=catalog['foods'];model=read(HERE/'model-results.json')
for rel,h in manifest['sourceLfSha256'].items():
 b=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert sha(b)==h and b==subprocess.check_output(['git','-C',str(ROOT),'show',manifest['mainObserved']+':'+rel]),rel
for key,r in foods.items():
 if not key.startswith(('fineli-','afcd-')):continue
 n=next(x for x in read(ROOT/r['nativePath'])['foods'] if x['source_id']==r['nativeId']);afcd=key.startswith('afcd');p=n if afcd else n['per100g']
 assert r['per100g']['carbohydrate']==p['available_carbohydrate_without_sugar_alcohols_g_per_100g' if afcd else 'available_carbohydrate_g_per_100g']
 if afcd:assert r['per100g']['polyols'] is None and not r['polyolsSourceVerified']
 else:assert r['per100g']['polyols']==p['polyols_g_per_100g']
r=foods['MEXT2023-05001'];n=r['nativeSourceRecord'];assert n['massToken']==n['carbohydrateMassToken']=='5.2' and n['polyolsToken']=='-' and n['componentTokens']['GALS']=='-'
assert n['monosaccharideEquivalentToken']=='5.5' and n['differenceToken']=='11.5' and r['per100g']['polyols'] is None
assert n['mainWorkbookSha256']=='0d5a77077dd6cd91cbc2e6e317b8b218a38728c409eed452f1c10635a0d3099c' and n['carbohydrateWorkbookSha256']=='099bdadb4a980df503e7a3dd057e49a69b68315b67012a3358b9a6d06984e137'
canonical=sha(json.dumps(n,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode());assert canonical==manifest['frozenMextRecordCanonicalSha256']==catalog['reusedMext']['recordCanonicalSha256']
up=Path(catalog['reusedMext']['upstreamWorktree'])/catalog['reusedMext']['path'];assert n==next(x for x in read(up)['records'] if x['nativeId']=='05001')
ery=next(x for x in read(ROOT/'docs/nutrition/food-records.json') if x['id'].startswith('foodin-erythritol'));assert foods[ery['id']]==ery and ery['polyolsSourceVerified'] and ery['per100g']['carbohydrate']==ery['per100g']['polyols']==100
gis={x['id']:x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']};expected={'vhh-omenapiirakka':('1.49550','1.18390625','0'),'vhh-raparperipiirakka':('1.331250','1.731250','.625')}
for rid,(eg,eo,eu) in expected.items():
 b=read(HERE/(rid+'.json'));src=yaml.safe_load((ROOT/b['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1]);assert src['ingredients']==b['sourceIngredients'] and len(src['ingredients'])==len(b['ingredients']) and src['servings']==b['servings']==8
 assert b['ingredients'][0]['grams']==150 and b['ingredients'][0]['fineliRecordId']=='MEXT2023-05001'
 gk=D(0);omitted=D(0);ceil=D(0)
 for i in b['ingredients']:
  if i['fineliRecordId']:
   f=foods[i['fineliRecordId']];v=f['per100g'];effective=D(str(v['carbohydrate']))
   if f['carbohydrateDefinition']=='EU_TOTAL_INCLUDING_POLYOLS':assert f['polyolsSourceVerified'];effective-=D(str(v['polyols']))
   cho=D(str(i['grams']))*effective/100/8
  else:cho=D(str(i['availableCarbohydrateUpperBoundPerServingG']));assert D(str(i['grams']))/8==cho;ceil+=cho
  if i['giRecordId']:gk+=cho*D(str(gis[i['giRecordId']]['gi']))/100
  else:assert cho<1;omitted+=cho
 assert gk==D(eg) and omitted==D(eo)<2 and ceil==D(eu)
 mr=next(x for x in model['results'] if x['recipeId']==rid);assert mr['result']['status']=='CALCULATED'
 assert abs(D(str(mr['result']['unroundedGlycemicLoadPerServing']))-gk)<D('.000000001')
 assert abs(D(str(mr['result']['omittedAvailableCarbohydratePerServingG']))-omitted)<D('.000000001')
 assert all(x['status']=='INSUFFICIENT SOURCE DATA' for x in mr['negativeControls']) and len(mr['negativeControls'])==(4 if rid=='vhh-omenapiirakka' else 5)
 assert not b['publicationApproved'] and not b['sourceApplicationApproved'] and not b['contentVersionApproved'] and not b['macroPublicationAuthorized']
 assert D(150)*D('5.2')/100/8==D('.975') and D(154)*D('5.2')/100/8>1 and D(150)*D('5.4')/100/8==D('1.0125')>1
rhu=read(HERE/'vhh-raparperipiirakka.json');assert rhu['ingredients'][3]['fineliRecordId']=='fineli-338' and foods['fineli-338']['nativeClass']=='VEGFRESH' and foods['fineli-338']['per100g']['carbohydrate']==5.5
assert rhu['ingredients'][3]['giRecordId']=='vegetables-category-mean-gi-66' and D(str(rhu['ingredients'][8]['grams']))==15*D('.5')
coord=read(HERE/'impact-and-coordination.json');pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);own=set(coord['ownCandidateIds']);other=set(coord['otherApprovedUnpublishedIds']);assert len(pub)==179 and len(own)==12 and len(other)==1 and not(pub&own or other&own)
assert len(pub|own|other)==192 and not(set(coord['newOwnConditionalIds'])&set(sum(coord['codex2ReservedIdsByFile'].values(),[])))
assert not model['newRulesApplied'] and model['newGiRecords']==0
print('PASS:twofullpies,nativeMEXT5.2reused,FineliRhubarb5.5retained,Foodin100minus100notmissingzero,9negativecontrols,12owncandidates,192conditionalunion;0newpublished.')
