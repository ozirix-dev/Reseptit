"""Independent Decimal audit, only external output: ROOT DATA CACHE EXTERNAL_OUT."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP
import json,sys,hashlib,subprocess
root,data,cache,out=map(lambda x:Path(x).resolve(),sys.argv[1:5]);parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True).returncode!=0
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
jhash=lambda x:hashlib.sha256(json.dumps(x,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
s=read(data/'sources.json');p=read(data/'cases.json');e={a['recipeId']:a for a in read(out/'engine-results.json')['results']};comp={a['id']:a for a in s['composition']};gis={a['id']:a for a in s['giBindings']}
assert not any([s['activation'],s['ownerApproval'],p['activation'],p['ownerApproval']])
for f,h in s['sourceFilesLfSha256'].items():assert sha(root/f)==h
for f in s['composition']:
 if f['kind']=='FINELI_CHOAVL':rows=read(root/'docs/nutrition/fineli-release-20-reference.json')['foods'];a=next(a for a in rows if a['source_id']==f['nativeId'])
 elif f['kind']=='AFCD_WITHOUT_SUGAR_ALCOHOLS':rows=read(root/'docs/nutrition/afcd-release-3-reference.json')['foods'];a=next(a for a in rows if a['source_id']==f['nativeId'])
 elif f['kind']=='EXPLICIT_LABEL_C_MINUS_P':a=next(a for a in read(root/'docs/nutrition/food-records.json') if a['id']==f['nativeId']);assert a['per100g']['carbohydrate']==a['per100g']['polyols']==100 and a['polyolsSourceVerified']
 else:continue
 assert jhash(a)==f['nativeRowPythonJsonSha256']
for o in s['products']+[s['externalPdf']]:assert hashlib.sha256((cache/o['rawFile']).read_bytes()).hexdigest()==o['rawSha256']
for a in s['pinnedGitFiles']:assert hashlib.sha256(subprocess.check_output(['git','show',a['commit']+':'+a['path']],cwd=root).replace(b'\r\n',b'\n')).hexdigest()==a['lfSha256']
results=[]
for c in p['cases']:
 assert jhash({k:v for k,v in c.items() if k!='inputSha256'})==c['inputSha256'] and not c['approval'] and c['level']=='A' and c['servings']==4
 for loc,f in c['paths'].items():assert c['recipeSha256'][loc] in [sha(root/f),hashlib.sha256((root/f).read_bytes()).hexdigest()]
 point=D(0);omitted=D(0);upper=D(0);covered=D(0);terms=[]
 for ix,i in enumerate(c['candidateIngredients']):
  f=comp[i['compositionId']];g=gis.get(i['giId']);o=p['originalIngredientsByRecipe'][c['recipeId']][p['originalIndexByCandidate'][c['recipeId']][ix]];isml=f['kind']=='LABEL_UPPER_PER100ML';q=D(str(i['millilitres'] if isml else i['grams']));iscap=f['kind'].startswith('LABEL_UPPER') or f['kind']=='PHYSICAL_MASS_UPPER'
  if o['unit']=='g':assert q==D(str(o['amount'])) and not isml
  if isml:assert o['unit']=='ml' and q==D(str(o['amount'])) and 'grams' not in i
  assert iscap==(i['carbohydrateUse']=='UPPER_BOUND')
  cho=q/D(c['servings']) if f['kind']=='PHYSICAL_MASS_UPPER' else q*D(str(f['declaredCarbohydrate'] if iscap else f['availablePer100g']))/100/D(c['servings'])
  if g:assert not iscap and i['compositionId'] in g['allowedCompositionIds'];point+=cho*D(str(g['values'][0]))/100;covered+=cho
  elif cho>0:
   assert cho<1;omitted+=cho
   if iscap:upper+=cho
  terms.append({'compositionId':f['id'],'choUpperOrNativePointPerServing':str(cho),'isUpper':iscap,'giId':i['giId']})
 assert omitted<2
 a=e[c['recipeId']];assert abs(D(str(a['unrounded']))-point)<D('1e-12') and D(str(a['point']))==point.quantize(D('.01'),rounding=ROUND_HALF_UP) and abs(D(str(a['omittedCho']))-omitted)<D('1e-12') and abs(D(str(a['omittedUpper']))-upper)<D('1e-12')
 results.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'unrounded':str(point),'point':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted),'omittedUpper':str(upper),'coveredCho':str(covered),'ownerApproved':False,'publicationAuthorized':False,'terms':terms})
assert {a['recipeId']:a['unrounded'] for a in results}=={'kaakao-kookos-chia':'0.2175','rahka-marjakerroskulho':'2.33945'}
assert next(a for a in results if a['recipeId']=='kaakao-kookos-chia')['omittedCho']=='0.9625'
# Generic Alpro composition cannot stand in for the selected manufacturer drink.
assert D('200')*D('2.635')/100/4>1 and D('200')*D('.4')/100/4==D('.2')
# Finnish bilberry is not the accepted identity of the Canadian wild-blueberry source.
assert D(50)*D('10.2')/100/4>1
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'ownerApproval':False,'results':results},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'Decimal':'PASS','results':[{k:a[k] for k in ['recipeId','point','omittedCho','omittedUpper']} for a in results]}))
