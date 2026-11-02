"""Independent Decimal audit: ROOT DATA CACHE EXTERNAL_OUT; no active repository writes."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP
import json,csv,hashlib,sys,subprocess
root,data,cache,out=map(lambda x:Path(x).resolve(),sys.argv[1:5]);parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True).returncode!=0
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
h=lambda p:hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
s=read(data/'sources.json');pack=read(data/'cases.json');comps={c['id']:c for c in s['composition']};gis={g['id']:g for g in s['gi']};engine={x['recipeId']:x for x in read(out/'engine-results.json')['results']}
for p,digest in s['sourceFilesLfSha256'].items():assert h(root/p)==digest
for c in s['composition']:
 if 'nativeRowPythonJsonSha256' not in c:continue
 f=read(root/('docs/nutrition/fineli-release-20-reference.json' if c['kind']=='FINELI_CHOAVL' else 'docs/nutrition/afcd-release-3-reference.json'))['foods'];a=next(a for a in f if a['source_id']==c['nativeId']);assert hashlib.sha256(json.dumps(a,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==c['nativeRowPythonJsonSha256']
ng=read(root/'docs/nutrition/glycemic-index-records.json')['records']
for g in s['gi']:
 if 'nativeRowPythonJsonSha256' in g:
  a=next(a for a in ng if a['id']==g['nativeId']);assert hashlib.sha256(json.dumps(a,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==g['nativeRowPythonJsonSha256']
assert gis['peanutExpert18']['kind']=='SOURCE_EXPERT_ESTIMATE' and not gis['peanutExpert18']['humanMeasured'] and not gis['peanutExpert18']['currentContractAdmitted']
results=[]
for c in pack['cases']:
 body={k:v for k,v in c.items() if k!='inputSha256'};assert hashlib.sha256(json.dumps(body,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==c['inputSha256']
 assert c['servings']==4 and not c['approval'] and not c['publicationAuthorized']
 for loc,p in c['paths'].items():assert h(root/p)==c['recipeSha256'][loc]
 point=D(0);omitted=D(0);trace=D(0);terms=[];omits=set(c.get('omitOriginalIngredientGroups',[]));groups={}
 for i in c['candidateIngredients']:
  original=c['originalIngredients'][i['originalIndex']];assert original['item']==i['name']
  if original['unit']=='g':assert original['amount']==i['grams']
  src=comps[i['compositionId']];g=gis.get(i['giId']);cho=D(str(i['grams']))*D(str(src['availablePer100g']))/D(100)/D(c['servings']);isupper=i['carbohydrateUse']=='UPPER_BOUND'
  if i['grams']==0:assert i['note'].startswith('ZERO_CHO_SENTINEL_RETAIN_ORIGINAL') and src['availablePer100g']==0
  if src['kind']=='LABEL_CARBOHYDRATE_UPPER':assert isupper
  if c['profile']=='NEW_B_MINOR_OMISSIONS' and str(i['originalIndex']) in omits:
   assert g is None;groups.setdefault(str(i['originalIndex']),D(0));groups[str(i['originalIndex'])]+=cho;omitted+=cho
  elif g:
   assert not isupper and i['compositionId'] in g['allowedCompositionIds'];point+=cho*D(str(g['values'][0]))/D(100)
   if g['id']=='trace50':assert cho<=D('.5');trace+=cho
  else:
   assert c['level']=='A' or cho==0
   if cho>0:assert cho<D(1);omitted+=cho
  terms.append({'sourceId':i['compositionId'],'choPerServing':str(cho),'isNominalUpper':isupper,'giId':i['giId']})
 assert all(x<D(1) for x in groups.values()) and omitted<D(2) and trace<=D(1)
 e=engine[c['recipeId']];assert abs(D(str(e['unrounded']))-point)<D('1e-11') and D(str(e['point']))==point.quantize(D('.01'),rounding=ROUND_HALF_UP) and abs(D(str(e['omittedCho']))-omitted)<D('1e-11')
 results.append({'recipeId':c['recipeId'],'profile':c['profile'],'inputSha256':c['inputSha256'],'unrounded':str(point),'point':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted),'traceCodedCho':str(trace),'sourceQualifiedForOwnerReview':c['level']=='A','ownerApproved':False,'publicationAuthorized':False,'terms':terms})
assert {x['recipeId'] for x in results}=={'bulgogi','jerk-kana','sate-ayam'}
assert engine['bulgogi']['currentContractArithmeticPass'] and not engine['jerk-kana']['currentContractArithmeticPass'] and not engine['sate-ayam']['currentContractArithmeticPass']
# Soy and sugar rows in satay stay original32+16 and18+9, never stale kecap.
c=next(c for c in pack['cases'] if c['recipeId']=='sate-ayam');assert sum(i['grams'] for i in c['candidateIngredients'] if i['compositionId']=='F008065')==48 and sum(i['grams'] for i in c['candidateIngredients'] if i['compositionId']=='F008969')==27
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'ownerApproval':False,'results':results},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'Decimal':'PASS','results':[{k:x[k] for k in ['recipeId','point','omittedCho','profile']} for x in results]}))
