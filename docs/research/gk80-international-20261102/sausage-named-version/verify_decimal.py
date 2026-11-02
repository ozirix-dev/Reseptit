from pathlib import Path
from decimal import Decimal as D
import hashlib,json,sys,subprocess
HERE=Path(__file__).resolve().parent
ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda b:hashlib.sha256(b).hexdigest()
m=read(HERE/'source-manifest.json');c=read(HERE/'source-catalog.json');p=read(HERE/'proposal.json');out=read(HERE/'model-results.json')
for rel,h in m['sourceLfSha256'].items():
 b=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode();assert sha(b)==h,rel
 if not rel.startswith('docs/research/'):
  assert b==subprocess.check_output(['git','-C',str(ROOT),'show',m['calculationReferenceMain']+':'+rel]),rel
for f in c['foods'].values():
 native=next(x for x in read(ROOT/f['nativeSourcePath'])['foods'] if x['source_id']==f['nativeSourceRecord']['source_id']);assert native==f['nativeSourceRecord']
 afcd=f['id'].startswith('afcd');v=native['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if afcd else native['per100g']['available_carbohydrate_g_per_100g'];assert f['per100g']['carbohydrate']==v
 if afcd:assert f['per100g']['polyols'] is None
 else:assert f['per100g']['polyols']==native['per100g']['polyols_g_per_100g']
gi=next(x for x in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records'] if x['id']=='vegetables-category-mean-gi-66');assert c['existingGiCards'][gi['id']]==gi
assert p['servings']==4 and len(p['ingredients'])==8 and {x['sourceRowIndex'] for x in p['ingredients']}==set(range(8))
cho=[D(500)*D('.3')/100/4,D(100)*D('.1')/100/4,D(55)*D('4.8')/100/4,D('31.5')*D('3.5')/100/4,D(100)*D(3)/100/4,D(14)*D('.8')/100/4,D('2.65')*D('19.1')/100/4,D('.5')*D('38.6')/100/4]
assert p['ingredients'][0]['grams']==500 and p['ingredients'][7]['grams']==.5
assert D(str(p['ingredients'][0]['availableCarbohydrateUpperBoundPerServingG']))==cho[0]
assert D(str(p['ingredients'][3]['availableCarbohydrateUpperBoundPerServingG']))==cho[3]
gk=cho[2]*D(66)/100;omitted=sum(v for i,v in enumerate(cho) if i!=2)
assert gk==D('.4356') and omitted==D('1.6284125') and all(v<1 for i,v in enumerate(cho) if i!=2) and omitted<2
assert gk==D(p['expected']['unroundedGk']) and omitted==D(p['expected']['omittedChoNominalUpperG'])
assert abs(D(str(out['result']['unroundedGlycemicLoadPerServing']))-gk)<D('1e-12')
assert abs(D(str(out['result']['omittedAvailableCarbohydratePerServingG']))-omitted)<D('1e-12')
assert gk+omitted*D('1.5')==D('2.87821875') and p['expected']['sensitivityIsAssumptionNotPhysiologicalBound']
assert len(out['negativeControls'])==6 and all(x['status']=='INSUFFICIENT SOURCE DATA' for x in out['negativeControls'])
assert not p['publicationApproved'] and not p['sourceApplicationApproved'] and not p['actualBatchWeighed'] and not p['policyChangeApplied']
a=read(HERE/'impact-and-coordination.json');own=set(a['ownAResearchIds']+a['ownBPreparedScenarioIds']);pub=set(read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')['productionPage']['numericIds']);other=set(a['otherApprovedUnpublishedIds'])
assert len(a['ownAResearchIds'])==13 and len(a['ownBPreparedScenarioIds'])==4 and len(own)==17 and len(pub)==179
assert not(own&pub or own&other) and len(pub|own|other)==197
assert all('uunimakkara-sipulipedilla' not in ids for ids in a['codex2ReservedIdsByFile'].values())
print('PASS:8rows,nativeCHO,DecimalGK0.4356,nominalomission1.6284125,6negativecontrols,17uniqueconditionalIDs,0newpublished.')
