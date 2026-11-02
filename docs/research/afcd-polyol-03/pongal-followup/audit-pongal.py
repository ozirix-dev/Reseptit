"""Independent Decimal/identity replay. ROOT DATA CACHE EXTERNAL_OUT; no repo writes."""
import sys,json,hashlib,pathlib,subprocess,itertools
from decimal import Decimal as D, ROUND_FLOOR, ROUND_CEILING
r,data,cache,out=map(lambda x:pathlib.Path(x).resolve(),sys.argv[1:5])
parent=out
while not parent.exists():parent=parent.parent
z=subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True,text=True)
if z.returncode==0 and z.stdout.strip()=='true':raise SystemExit('External output only')
def read(p):return json.loads(p.read_text('utf-8'))
def canon(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def jh(x):return hashlib.sha256(canon(x).encode()).hexdigest()
def lf(p):return hashlib.sha256(p.read_text('utf-8').encode()).hexdigest()
s=read(data/'sources.json');p=read(data/'cases.json');e=read(out/'engine-results.json')
assert not any([s['activation'],s['ownerApproval'],p['activation'],p['ownerApproval'],p['publicationAuthorized']])
for f,h in s['sourceFilesLfSha256'].items():assert lf(r/f)==h
for f in s['externalSources']:assert hashlib.sha256((cache/f['rawFile']).read_bytes()).hexdigest()==f['rawSha256']
for f in s['pinnedGitFiles']:
 t=subprocess.check_output(['git','show',f["commit"]+':'+f['path']],cwd=r,encoding='utf-8').replace('\r\n','\n');assert hashlib.sha256(t.encode()).hexdigest()==f['lfSha256']
fin=read(r/'docs/nutrition/fineli-release-20-reference.json')['foods'];af=read(r/'docs/nutrition/afcd-release-3-reference.json')['foods'];co={x['id']:x for x in s['composition']}
for f in co.values():
 n=next(x for x in (fin if f['kind']=='FINELI_CHOAVL' else af) if x['source_id']==f['nativeId']);assert jh(n)==f['nativeRowPythonJsonSha256'];assert f['availablePer100g']==(n['per100g']['available_carbohydrate_g_per_100g'] if f['kind']=='FINELI_CHOAVL' else n['available_carbohydrate_without_sugar_alcohols_g_per_100g'])
c=p['cases'][0];body={k:v for k,v in c.items() if k!='inputSha256'};assert jh(body)==c['inputSha256']==e['inputSha256']
for locale,f in c['paths'].items():assert c['recipeSha256'][locale] in [lf(r/f),hashlib.sha256((r/f).read_bytes()).hexdigest()]
assert c['servings']==2 and len(c['candidateIngredients'])==7 and [i['grams'] for i in c['candidateIngredients']]==[100,150,20,2,700,14,0]
assert c['candidateIngredients'][1]['compositionId']=='F000446'
for ix,oi in enumerate(c['originalIndexByCandidate']):
 o=c['originalIngredients'][oi]
 if o['unit']=='g':assert c['candidateIngredients'][ix]['grams']==o['amount']
expected=set(itertools.product(['F007682','11521'],[31.43,42],[22,27]));assert {(x['riceCompositionId'],x['mungGi'],x['cashewGi']) for x in c['scenarios']}==expected
results=[]
for a,v in zip(c['scenarios'],e['scenarios'],strict=True):
 assert a['id']==v['scenarioId'];terms=[]
 for ix,i in enumerate(c['candidateIngredients']):
  f=co[a['riceCompositionId'] if ix==0 else i['compositionId']];cho=D(str(i['grams']))*D(str(f['availablePer100g']))/D(100)/D(c['servings']);gi=[D(80),D(str(a['mungGi'])),D(str(a['cashewGi'])),D(50),None,None,None][ix]
  assert cho==0 or gi is not None
  terms.append(cho*(gi or D(0))/D(100))
 total=sum(terms,D(0));assert abs(total-D(str(v['unrounded'])))<D('1e-10');assert v['omittedCho']==0;assert abs(D(str(v['traceCodedCho']))-D('0.3831'))<D('1e-12')
 results.append({'scenarioId':a['id'],'gk':str(total),'terms':list(map(str,terms))})
lo=min(D(x['gk']) for x in results);hi=max(D(x['gk']) for x in results);display={'min':int(lo.to_integral_value(rounding=ROUND_FLOOR)),'max':int(hi.to_integral_value(rounding=ROUND_CEILING))};assert all(e['displayProposal'][k]==v for k,v in display.items());assert display=={'min':40,'max':46}
assert len(e['controls'])==4 and all(c['status']=='REJECTED' for c in e['controls'])
manifest=data/'manifest.json'
if manifest.exists():
 for f,h in read(manifest)['filesLfSha256'].items():assert lf(data/f)==h, f
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'ownerApproval':False,'inputSha256':c['inputSha256'],'scenarioCount':len(results),'allNativeRowAndSourceSealsMatch':True,'engineAgreementTolerance':'1e-10','sourceScenarioMin':str(lo),'sourceScenarioMax':str(hi),'display':display,'positiveOmissions':0,'results':results},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n');print(json.dumps({'scenarios':len(results),'decimalMin':str(lo),'decimalMax':str(hi),'display':display,'sourceAndInputSeals':'PASS','strictBPositiveOmissions':0}))
