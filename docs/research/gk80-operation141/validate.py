from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json,hashlib,sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('D:/Projects/tmp/reseptit-gk80-operation141')
package=Path(sys.argv[2]) if len(sys.argv)>2 else Path('D:/Temp/gk80-op141/stage/docs/research/gk80-operation141')
read=lambda p:json.loads(p.read_text(encoding='utf8'))
fp=lambda x:hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
sha=lambda p:hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
reference=root/'docs/nutrition/fineli-release-20-reference.json';F={x['source_id']:x for x in read(reference)['foods']}
allids=set();numerics=set();checked=0;bounds=0;unknown=0;values=[]
for n in range(1,7):
 b=read(package/f'batch-{n}.json');out=read(package/f'batch-{n}-results.json');foods={x['id']:x for x in b['foods']};gis={x['id']:x for x in b['giRecords']}
 assert len(b['recipeIds'])<=5 and not(allids & set(b['recipeIds']));allids.update(b['recipeIds'])
 assert set(b['recipeIds'])=={x['input']['recipeId'] for x in b['cases']}|{x['recipeId'] for x in b['holds']}
 assert len(out['results'])==len(b['cases'])
 for food in foods.values():
  assert food['referenceLfSha256']==sha(reference)
  fid=food['id'].split('-')[-1];v=F[fid]['per100g'];p=food['per100g']
  assert p['carbohydrate']==v['available_carbohydrate_g_per_100g']
  assert p['polyols']==v['polyols_g_per_100g'] and p['fibre']==v['fibre_g_per_100g']
  unknown+=p['polyols'] is None
 for g in gis.values():
  assert g['matchKind']!='CATEGORY_MEAN' and 'mean' not in g['id']
  assert g['gi']!=100 and g.get('calculationUse')!='REFERENCE_ONLY'
 for c,o in zip(b['cases'],out['results']):
  assert c['modelInputSha256']==fp(c['input'])==o['modelInputSha256']
  assert c['versionSha256']==fp(c['version'])==o['versionSha256']
  uf={i['fineliRecordId'] for i in c['input']['ingredients'] if i['fineliRecordId']};ug={i['giRecordId'] for i in c['input']['ingredients'] if i['giRecordId']}
  bundle={'input':c['input'],'version':c['version'],'foods':[foods[k] for k in sorted(uf)],'giRecords':[gis[k] for k in sorted(ug)],'ingredientEvidence':c['ingredientEvidence']}
  assert c['evidenceBundleSha256']==fp(bundle)==o['evidenceBundleSha256']
  v=c['version'];assert v['ownerApproved'] is False and v['publicationAuthorized'] is False and v['methodChange'] is False
  assert sha(root/v['publishedPath'])==v['publishedSourceLfSha256']
  inp=c['input'];res=o['result'];total=D(0);omitted=D(0);serv=D(str(inp['servings']))
  for e in c['ingredientEvidence']:
   if e['kind'] in ['USDA_TOTAL_CEILING','USDA_TOTAL_REPORTED_ZERO']:
    source=e['source'];total100=D(source['nutrients']['1005']['amount']);fibre100=D(source['nutrients']['1079']['amount']) if source['key']=='lime_raw' else D(0)
    expected=D(str(e['massG']))*(total100-fibre100)/100/serv
    assert expected==D(e['availableUpperPerServingG']) and e['aggregatePolyols'] is None
    assert inp['ingredients'][e['index']]['grams']==e['massG']
  for i,a in zip(inp['ingredients'],res['ingredients']):
   if i.get('excludedReason'):
    amount=D(str(i.get('availableCarbohydrateUpperBoundPerServingG',i.get('estimatedAvailableCarbohydratePerServingG',0))))
    if 'availableCarbohydrateUpperBoundPerServingG' in i:
     assert a['availableCarbohydratePerServingG'] is None and a['gi'] is None and a['giContribution'] is None
     assert i['upperBoundEvidence'];bounds+=1
    assert amount<1;omitted+=amount;continue
   f=foods[i['fineliRecordId']];a100=D(str(f['per100g']['carbohydrate']));available=a100*D(str(i['grams']))/100/serv
   if available==0:continue
   if i['giRecordId'] is None:assert available<1;omitted+=available
   else:
    g=gis[i['giRecordId']];total+=available*D(str(g['gi']))/100
    if 'lowcho50' in g['id']:assert a100<=5
  assert omitted<2 and abs(float(omitted)-res['omittedAvailableCarbohydratePerServingG'])<1e-10
  assert abs(float(total)-res['unroundedGlycemicLoadPerServing'])<1e-10
  assert float(total.quantize(D('.01'),rounding=ROUND_HALF_UP))==res['glycemicLoadPerServing']
  assert res['status']=='CALCULATED' and not res['blockers'] and res['confidence']=='LOW'
  numerics.add(inp['recipeId']);checked+=1;values.append({'recipeId':inp['recipeId'],'scenarioId':c['scenarioId'],'gkPerServingExactDecimal':str(total),'gkPerServingRounded2dp':res['glycemicLoadPerServing'],'omittedChoPerServingExactDecimal':str(omitted),'evidenceBundleSha256':c['evidenceBundleSha256'],'inputSha256':c['modelInputSha256'],'versionSha256':c['versionSha256']})
 assert len(b['recipeIds'])==5
assert len(allids)==30 and len(numerics)==15 and checked==17
summary={'status':'PASS','recipesHandled':len(allids),'numericRecipeProposals':len(numerics),'scenariosDecimalVerified':checked,'sourceCeilingRowsVerified':bounds,'unknownPolyolProfilesPreservedAcrossBatches':unknown,'productionActivated':False,'modelOrToleranceChanged':False,'results':values}
(package/'independent-check.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:v for k,v in summary.items() if k!='results'}))
