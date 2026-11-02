"""Independent Decimal and source-scenario audit: ROOT DATA CACHE EXTERNAL_OUT."""
from pathlib import Path
from decimal import Decimal as D,ROUND_FLOOR,ROUND_CEILING,ROUND_HALF_UP
import sys,json,hashlib,subprocess
root,data,cache,out=map(lambda x:Path(x).resolve(),sys.argv[1:5]);parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True).returncode!=0
read=lambda f:json.loads(f.read_text(encoding='utf-8-sig'))
h=lambda f:hashlib.sha256(f.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
jhash=lambda x:hashlib.sha256(json.dumps(x,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
s=read(data/'sources.json');p=read(data/'cases.json');comps={f['id']:f for f in s['composition']};gis={g['id']:g for g in s['giBindings']};engine=read(out/'engine-results.json');eng={c['recipeId']:c for c in engine['results']}
for f,sha in s['sourceFilesLfSha256'].items():assert h(root/f)==sha
for a in s['pinnedGitFiles']:assert hashlib.sha256(subprocess.check_output(['git','show',a['commit']+':'+a['path']],cwd=root).replace(b'\r\n',b'\n')).hexdigest()==a['lfSha256']
for a in s['externalSources']:
 if a.get('rawFile'):assert hashlib.sha256((cache/a['rawFile']).read_bytes()).hexdigest()==a['rawSha256']
for f in s['composition']:
 if f['kind'] in ['FINELI_CHOAVL','AFCD_WITHOUT_SUGAR_ALCOHOLS']:
  path='fineli-release-20-reference.json' if f['kind']=='FINELI_CHOAVL' else 'afcd-release-3-reference.json';a=next(a for a in read(root/'docs/nutrition'/path)['foods'] if a['source_id']==f['nativeId']);assert jhash(a)==f['nativeRowPythonJsonSha256']
assert gis['whole-cheela42-recovery']['values']==[42] and not gis['whole-cheela42-recovery']['equicarbohydrateDoseConfirmed'] and gis['upittu69']['values']==[69]
assert p['displayPolicy']['roundingStep']==1 and not any([s['activation'],s['ownerApproval'],p['activation'],p['ownerApproval'],p['publicationAuthorized']])
results=[]
for c in p['cases']:
 assert jhash({k:v for k,v in c.items() if k!='inputSha256'})==c['inputSha256'] and c['level']=='B' and c['servings']==2 and not c['approval']
 for loc,path in c['paths'].items():assert c['recipeSha256'][loc] in [h(root/path),hashlib.sha256((root/path).read_bytes()).hexdigest()]
 scenarios=[]
 for scenario in c['scenarios']:
  point=D(0);trace=D(0)
  for ix,i in enumerate(c['candidateIngredients']):
   id=scenario['replaceCompositionByIngredientIndex'].get(str(ix),i['compositionId']);f=comps[id];g=gis.get(i['giId']);cho=D(str(i['grams']))*D(str(f['availablePer100g']))/100/D(c['servings']);oi=c['originalIndexByCandidate'][ix]
   if oi is not None and c['originalIngredients'][oi]['unit']=='g':assert D(str(c['originalIngredients'][oi]['amount']))==D(str(i['grams']))
   if cho>0:assert g is not None and id in g['allowedCompositionIds'];point+=cho*D(str(g['values'][0]))/100
   if g and g['id']=='trace50':assert cho<=D('.5');trace+=cho
  assert trace<=1
  x=next(a for a in eng[c['recipeId']]['scenarios'] if a['scenarioId']==scenario['id']);assert abs(D(str(x['unrounded']))-point)<D('1e-11') and x['omittedCho']==0
  scenarios.append({'scenarioId':scenario['id'],'unrounded':str(point),'point':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':'0'})
 lo=min(D(x['unrounded']) for x in scenarios);hi=max(D(x['unrounded']) for x in scenarios);display={'min':int(lo.to_integral_value(rounding=ROUND_FLOOR)),'max':int(hi.to_integral_value(rounding=ROUND_CEILING))}
 assert display['min']==eng[c['recipeId']]['displayProposal']['min'] and display['max']==eng[c['recipeId']]['displayProposal']['max']
 results.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'sourceScenarioMin':str(lo),'sourceScenarioMax':str(hi),'integerDisplay':display,'ownerApproved':False,'publicationAuthorized':False,'scenarios':scenarios})
assert [r['integerDisplay'] for r in results]==[{'min':9,'max':12},{'min':9,'max':11},{'min':26,'max':27}]
assert [a['status'] for a in engine['controls']]==['REJECTED']*4
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'ownerApproval':False,'results':results},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'Decimal':'PASS','results':[{k:r[k] for k in ['recipeId','sourceScenarioMin','sourceScenarioMax','integerDisplay']} for r in results]}))
