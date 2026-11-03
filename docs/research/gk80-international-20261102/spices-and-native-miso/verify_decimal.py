from pathlib import Path
import json,hashlib,subprocess,sys,yaml
from decimal import Decimal as D
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda b:hashlib.sha256(b).hexdigest()
m=read(HERE/'source-manifest.json')
for rel,h in m['sourceLfSha256'].items():
 local=(ROOT/rel).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()
 assert sha(local)==h and local==subprocess.check_output(['git','-C',str(ROOT),'show',m['mainObserved']+':'+rel]),rel
c=read(HERE/'source-catalog.json');b=read(HERE/'pav-bhaji-current-source-version.json');model=read(HERE/'model-results.json')
for key,r in c['foods'].items():
 n=next(x for x in read(ROOT/r['nativePath'])['foods'] if x['source_id']==r['nativeId'])
 afcd=key.startswith('afcd');p=n if afcd else n['per100g']
 assert r['per100g']['carbohydrate']==p['available_carbohydrate_without_sugar_alcohols_g_per_100g' if afcd else 'available_carbohydrate_g_per_100g']
 if afcd:assert r['per100g']['polyols'] is None and not r['polyolsSourceVerified']
 else:assert r['per100g']['polyols']==p['polyols_g_per_100g']
src=yaml.safe_load((ROOT/b['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1]);assert b['sourceIngredients']==src['ingredients'] and len(src['ingredients'])==len(b['ingredients'])==17 and b['servings']==src['servings']==4
rows=b['ingredients'];assert [r['grams'] for r in rows]==[400,200,150,65,27,30,55,7,400,5,4,2,2,1,6.5,300,10]
assert rows[3]['grams']==next(x for x in read(ROOT/'docs/nutrition/fineli-release-20-reference.json')['foods'] if x['source_id']=='300')['portion_mass_g']['KPL_M']
assert rows[7]['grams']==2*next(x for x in read(ROOT/'docs/nutrition/fineli-release-20-reference.json')['foods'] if x['source_id']=='393')['portion_mass_g']['KPL_M']
assert rows[2]['fineliRecordId']=='fineli-370' and rows[15]['fineliRecordId']=='fineli-1108' and rows[16]['fineliRecordId']=='afcd-F003192'
gis={r['id']:r for r in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']};gk=D(0);omit=D(0)
for i in rows:
 cho=D(str(i['grams']))*D(str(c['foods'][i['fineliRecordId']]['per100g']['carbohydrate']))/100/4
 if i['giRecordId']:assert i['giRecordId'] in c['existingGiIds'];gk+=cho*D(str(gis[i['giRecordId']]['gi']))/100
 else:assert cho<1;omit+=cho
assert gk==D('42.2723825')==D(b['expected']['unroundedGk']) and omit==D('1.90775')==D(b['expected']['omittedChoG']) and D(2)-omit==D('.09225')
assert abs(D(str(model['result']['unroundedGlycemicLoadPerServing']))-gk)<D('.000000001')
assert abs(D(str(model['result']['omittedAvailableCarbohydratePerServingG']))-omit)<D('.000000001')
assert all(r['status']=='INSUFFICIENT SOURCE DATA' for r in model['negativeControls']) and len(model['negativeControls'])==4
assert model['negativeControls'][3]['omittedCho']>=2
old=next(x for x in read(ROOT/'docs/nutrition/glycemic-load-pilot-input.json')['recipes'] if x['recipeId']=='pav-bhaji');assert len(old['ingredients'])==13
for i in rows[9:14]:assert 2*D(str(i['grams']))*D(str(c['foods'][i['fineliRecordId']]['per100g']['carbohydrate']))/100/4<1
screen=read(HERE/'regional-source-screen.json');ms=screen['miso']
assert ms['nativeAvailableMassPer100g']==11.8 and ms['byDifferenceAvailablePer100g']==18.5 and ms['nativeMonosaccharideEquivalentPer100g']==11.9
assert not ms['sourceFamilyAdmitted'] and ms['components']['sorbitol'] is None and ms['components']['mannitol'] is None
assert D('34.8')*D('11.8')/100/4==D(ms['densityScreenOnly']['choPerServingG'])==D('1.0266')>1
assert screen['cornstarch']['giParticipants']==6 and not screen['cornstarch']['fullPreparationVerified'] and screen['newGiRecordsImported']==0
assert not b['sourceApplicationApproved'] and not b['publicationApproved'] and not b['newProductOrQuantityPrescription'] and not b['macroPublicationAuthorized']
coord=read(HERE/'impact-and-coordination.json');pub=read(HERE.parent/'poha-and-main179/production-revalidation.json') if (HERE.parent/'poha-and-main179').exists() else read(ROOT/'docs/research/gk80-international-20261102/poha-and-main179/production-revalidation.json')
ids=set(pub['productionPage']['numericIds']);own=set(coord['ownCandidateIds']);other=set(coord['remainingOtherApprovedIds'])
assert len(ids)==179 and len(own)==10 and len(other)==1 and not(ids&own or own&other)
assert len(ids|own|other)==190 and coord['conditionalAllDistinctTotal']==190
assert 'pav-bhaji' not in sum(coord['codex2ReservedIdsByFile'].values(),[])
print('PASS:17currentrows,nativeFineli/AFCD,unknownAFCDpolyolsretained,GK',gk,'omittedCHO',omit,'4negativecontrols,10owncandidates,190conditionalunion;0newpublished.')
