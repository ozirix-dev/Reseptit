"""Independent Decimal/identity audit. ROOT DATA CACHE EXTERNAL_OUT."""
import sys,json,pathlib,hashlib,subprocess,collections
from decimal import Decimal as D, ROUND_FLOOR, ROUND_CEILING, ROUND_HALF_UP
r,data,cache,out=map(lambda a:pathlib.Path(a).resolve(),sys.argv[1:5]);parent=out
while not parent.exists():parent=parent.parent
z=subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,text=True,capture_output=True)
if z.returncode==0 and z.stdout.strip()=='true':raise SystemExit('External output only')
def read(p):return json.loads(p.read_text('utf-8'))
def sha(b):return hashlib.sha256(b).hexdigest()
def lf(p):return sha(p.read_text('utf-8').encode())
def jh(x):return sha(json.dumps(x,ensure_ascii=False,separators=(',',':')).encode())
s=read(data/'sources.json');p=read(data/'cases.json');e=read(out/'engine-results.json');assert not any([s['activation'],s['ownerApproval'],p['activation'],p['ownerApproval'],p['publicationAuthorized']])
for f,h in s['sourceFilesLfSha256'].items():assert lf(r/f)==h
for x in s['pdfs']:assert sha((cache/x['file']).read_bytes())==x['rawSha256']
for x in s['products']:
 assert x['availablePoint'] is None and x['polyols'] is None and x['nominalOnlyNotLotBound']
 if x['rawFile']:assert sha((cache/x['rawFile']).read_bytes())==x['rawSha256']
fin={x['source_id']:x for x in read(r/'docs/nutrition/fineli-release-20-reference.json')['foods']};af={x['source_id']:x for x in read(r/'docs/nutrition/afcd-release-3-reference.json')['foods']};co={x['id']:x for x in s['composition']};gi={x['id']:D(str(x['gi'])) for x in s['giBindings']}
for x in co.values():
 if x['kind']=='FINELI_CHOAVL':assert jh(fin[x['nativeId']])==x['nativeRowPythonJsonSha256'] and fin[x['nativeId']]['per100g']['available_carbohydrate_g_per_100g']==x['availablePer100g']
 if x['kind']=='AFCD_WITHOUT_SUGAR_ALCOHOLS':assert jh(af[x['nativeId']])==x['nativeRowPythonJsonSha256'] and af[x['nativeId']]['available_carbohydrate_without_sugar_alcohols_g_per_100g']==x['availablePer100g']
assert gi=={'veg40':D(40),'arborio69':D(69),'couscous65':D(65),'marrowfat47':D(47)}
result=[];expected={'paella-valenciana':('40.353600','1.675',2),'kana-tagine-sitruunalla':('21.0531500','1.68725',2),'hernekeitto-savupotkalla':('16.2240250','1.5628875',1)}
for c,v in zip(p['cases'],e['results'],strict=True):
 assert c['recipeId']==v['recipeId'];assert jh({k:y for k,y in c.items() if k!='inputSha256'})==c['inputSha256']==v['inputSha256'];assert c['servings']==4 and not c['approval']
 for lang,f in c['paths'].items():assert lf(r/f)==c['recipeSha256Lf'][lang]
 for ix,orig in enumerate(c['originalIngredients']):
  rs=[a for a in c['candidateIngredients'] if a['originalIndex']==ix];assert rs
  if orig['unit']=='g':assert len(rs)==1 and rs[0]['grams']==orig['amount']
 vals=[]
 for sc,js in zip(c['scenarios'],v['scenarios'],strict=True):
  assert sc['id']==js['scenarioId'];tot=D(0);groups=collections.defaultdict(D);om=collections.defaultdict(D)
  for ix,a in enumerate(c['candidateIngredients']):
   f=co[sc['compositionOverrides'].get(str(ix),a['compositionId'])];kind=f['kind'];basis=D(100) if kind=='PHYSICAL_MASS_UPPER' else D(str(f['declaredCarbohydrate'] if kind=='LABEL_UPPER_PER100G' else f['availablePer100g']));q=D(str(a['grams']))*basis/D(400)
   if a['giId']:assert 'UPPER' not in kind;tot+=q*gi[a['giId']]/D(100)
   elif q>0:assert q<1;groups[a['originalIndex']]+=q;om[kind]+=q
  total=sum(om.values(),D(0));assert total<2 and max(groups.values())<1
  assert abs(tot-D(str(js['unrounded'])))<D('1e-10') and abs(total-D(str(js['omittedChoOrCap'])))<D('1e-10')
  vals.append({'scenarioId':sc['id'],'gk':str(tot),'omittedChoOrCap':str(total),'nominalLabelCap':str(om['LABEL_UPPER_PER100G']),'physicalMassCap':str(om['PHYSICAL_MASS_UPPER']),'maxOmittedOriginalGroup':str(max(groups.values()))})
 g,o,count=expected[c['recipeId']];assert len(vals)==count and D(vals[0]['gk'])==D(g) and D(vals[0]['omittedChoOrCap'])==D(o)
 result.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'scenarioCount':len(vals),'scenarios':vals,'primaryRoundedPoint':str(D(g).quantize(D('0.01'),rounding=ROUND_HALF_UP))})
assert len(result)==3 and len(e['controls'])==2 and all(x['status']=='REJECTED' for x in e['controls'])
m=data/'manifest.json'
if m.exists():
 for f,h in read(m)['filesLfSha256'].items():assert lf(data/f)==h,f
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'ownerApproval':False,'scenarioCount':5,'engineAgreementTolerance':'1e-10','sourceAndInputSealsPass':True,'results':result},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps({'results':[(a['recipeId'],a['primaryRoundedPoint'],a['scenarios'][0]['omittedChoOrCap']) for a in result],'strictA':'PASS','sourceInputSeals':'PASS'}))
