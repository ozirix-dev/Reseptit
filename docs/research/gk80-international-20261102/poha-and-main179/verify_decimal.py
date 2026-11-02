from pathlib import Path
import json,hashlib,subprocess,sys,yaml
from decimal import Decimal as D
HERE=Path(__file__).resolve().parent;ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE.parents[3]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda b:hashlib.sha256(b).hexdigest()
lf=lambda p:p.read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()
manifest=read(HERE/'source-manifest.json')
gitblob=lambda rel:subprocess.check_output(['git','-C',str(ROOT),'show',manifest['mainObserved']+':'+rel])
for rel,h in manifest['sourceLfSha256'].items():assert sha(lf(ROOT/rel))==h and gitblob(rel)==lf(ROOT/rel),rel
for rel,h in manifest['sourceGitBlobSha256'].items():assert sha(gitblob(rel))==h,rel
c=read(HERE/'source-catalog.json');b=read(HERE/'poha-fresh-leaf-version.json');model=read(HERE/'model-results.json')
native={rel:{r['source_id']:r for r in read(ROOT/rel)['foods']} for rel in ['docs/nutrition/fineli-release-20-reference.json','docs/nutrition/afcd-release-3-reference.json']}
for key,r in c['foods'].items():
 if key=='IFCT-G010':continue
 n=native[r['nativeSourcePath']][r['nativeSourceRecord']['source_id']];assert r['nativeSourceRecord']==n
 expected=n['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if key.startswith('afcd') else n['per100g']['available_carbohydrate_g_per_100g']
 assert r['per100g']['carbohydrate']==expected
 if key.startswith('afcd'):assert r['per100g']['polyols'] is None and not r['polyolsSourceVerified']
 else:assert r['per100g']['polyols']==n['per100g']['polyols_g_per_100g']
ifct=c['foods']['IFCT-G010'];obs=json.loads(gitblob(ifct['nativeSourcePath']))['ifctRecords'];r=next(x for x in obs if x['id']=='IFCT-G010')
assert ifct['nativeSourceRecord']==r and r['availablePer100g']==ifct['per100g']['carbohydrate']==3.66
assert ifct['per100g']['polyols'] is None and not ifct['polyolsSourceVerified']
assert r['foodState']=='RAW_FRESH_EDIBLE_LEAVES' and r['nativeTable']==6 and r['nativeColumn']=='Total Available CHO'
assert D(str(r['starchPer100g']))+D(str(r['totalFreeSugarsPer100g']))==D('3.68')!=D('3.66')
assert ifct['per100g']['carbohydrate']!=r['byDifferenceTable1Value']
approval=json.loads(gitblob(c['reusedSource']['approvalPath']))
assert 'IFCT2017_TABLE6_AVAILABLE_CHO_G010_ONLY' in approval['admittedSourceFamilies'] and b['recipeId'] not in approval['approvedInputs']
gi={r['id']:r for r in read(ROOT/'docs/nutrition/glycemic-index-records.json')['records']}
for k,r in c['existingGiCards'].items():assert r==gi[k]
src=yaml.safe_load((ROOT/b['sourcePath']).read_text(encoding='utf-8-sig').split('---',2)[1])
assert src['ingredients']==b['sourceIngredients'] and len(src['ingredients'])==len(b['ingredients'])==8
assert src['servings']==b['servings']==2
assert [i['grams'] for i in b['ingredients'][:5]]==[100,20,3,50,13.5]
assert D(str(b['ingredients'][5]['grams']))==D(15)*D('.25')
assert b['ingredients'][3]['fineliRecordId']=='fineli-370' and b['ingredients'][5]['fineliRecordId']=='afcd-F003192'
assert b['ingredients'][6]['fineliRecordId']=='fineli-11557' and b['ingredients'][6]['grams']==15
assert not b['publicationApproved'] and not b['sourceApplicationApproved'] and not b['contentVersionApproved']
gk=D(0);omission=D(0)
for i in b['ingredients']:
 cho=D(str(i['grams']))*D(str(c['foods'][i['fineliRecordId']]['per100g']['carbohydrate']))/100/2 if i['fineliRecordId'] else D(str(i['estimatedAvailableCarbohydratePerServingG']))
 if i['giRecordId']:gk+=cho*D(str(c['existingGiCards'][i['giRecordId']]['gi']))/100
 else:assert cho<1;omission+=cho
assert gk==D('28.327975') and omission==D('.210525') and omission<2
assert abs(D(str(model['result']['unroundedGlycemicLoadPerServing']))-gk)<D('.000000001')
assert abs(D(str(model['result']['omittedAvailableCarbohydratePerServingG']))-omission)<D('.000000001')
assert len(model['negativeControls'])==4 and all(x['status']=='INSUFFICIENT SOURCE DATA' for x in model['negativeControls'])
pub=read(HERE/'production-revalidation.json')['productionPage'];coord=read(HERE/'coordination-snapshot.json')
assert pub['numericUnique']==179 and len(pub['numericIds'])==179 and len(set(pub['numericIds']))==179
assert len(pub['newNumericIdsSince172'])==7 and pub['originalInstructionsNumeric']==156 and pub['namedNumericVersionCount']==23
assert pub['levelACount']==17 and pub['levelBCount']==6
assert set(pub['newNumericIdsSince172'])==set(json.loads(gitblob('docs/nutrition/gk80-next-seven/integration.json'))['approvedInputs'])
own=set(coord['priorOwnCandidateIds']+coord['newOwnConditionalCandidateIds']);remaining={x['recipeId'] for x in coord['remainingApprovedUnpublishedFromPriorEight']}
assert len(own)==9 and len(remaining)==1 and not(own&set(pub['numericIds']) or own&remaining)
assert len(set(pub['numericIds'])|own|remaining)==189
assert b['recipeId'] not in set(sum(coord['codex2ReservedIdsByFile'].values(),[]))
assert sha(Path(pub['rawHtmlScratchPath']).read_bytes())==pub['htmlSha256']
print('PASS: native IFCT3.66 reused,8 current rows,GK',gk,'omittedCHO',omission,'4 negative controls,179published IDs,189conditional dedup; no publication by research.')
