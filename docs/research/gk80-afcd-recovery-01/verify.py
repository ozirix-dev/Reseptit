"""Read-only verification of the one proposed recovery pilot; no site build."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP,getcontext
import argparse,hashlib,json,subprocess
getcontext().prec=40
F=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=F.parents[2]);parser.add_argument('--check-local-sources',action='store_true');args=parser.parse_args();R=args.repo_root.resolve()
read=lambda n:json.loads((F/n).read_text(encoding='utf8'))
def norm(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,dict):return {k:norm(v) for k,v in x.items()}
 if isinstance(x,list):return [norm(v) for v in x]
 return x
def fp(x):return hashlib.sha256(json.dumps(norm(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def sha(path):return hashlib.sha256(path.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def git(*a):return subprocess.check_output(['git','-C',str(R),*a],text=True,encoding='utf8').strip()
p=read('pilot.json');s=read('sources.json');screen=read('screening.json');base=read('baseline-verification.json');provenance=read('source-provenance.json')
assert screen['counts']=={'A':0,'B':1,'C':19};assert len(screen['records'])==len({r['recipeId'] for r in screen['records']})==20
assert [r['recipeId'] for r in screen['records'] if r['selected']]==[p['recipeId']]
assert sum(r['class']=='B' for r in screen['records'])==1 and sum(r['class']=='C' for r in screen['records'])==19
assert p['caseFingerprintSha256']==fp({k:v for k,v in p.items() if k!='caseFingerprintSha256'})
assert sha(F/'pr153-source.md')==p['sourceRecipeSha256'];assert sha(F/'main-source.md')==p['mainRecipeSha256']
assert p['servings']==4 and len(p['ingredients'])==10 and p['classification']=='B'
assert all(p[k] is False for k in ['ownerMethodApproved','ownerContentApprovedForThisVersion','productionIntegrationApproved','mergeApproved','deployApproved','productionEnabled','publicationEligibleNow'])
assert p['pr156ScopeUnchanged'] is True and p['model']['borrowedPr156Approval'] is False
assert p['calculation']['glycemicLoadExactPoint'] is None and p['calculation']['aggregatePolyolsExactPoint'] is None
assert p['model']['responseFactorScenario']==[0,150] and D(p['model']['fullGkWidthBudget'])==D('.10')
assert p['model']['biologicalBoundEstablished'] is False and p['model']['polyolSpeciesAssumedAbsent'] is False
source={x['sourceId']:x for x in s['compositionSources']};gis={x['id']:x for x in s['giSources']};unknown=[]
for g in gis.values():assert fp({k:v for k,v in g.items() if k!='evidenceHash'})==g['evidenceHash']
for x in source.values():
 e=x['evidence']
 if 'originalComposition' in e:
  comp=e['originalComposition'];assert fp({k:v for k,v in comp.items() if k!='evidenceHash'})==comp['evidenceHash']
 if 'fullReferenceRecord' in e:
  f=e['fullReferenceRecord'];assert f['source_id']=='11565' and f['process']=='RAW' and all(v is not None for v in f['per100g'].values())
assert s['allGiValuesInheritedFromPr153'] and not s['newGeneralGiRule']
assert [x['ingredientIndex'] for x in s['foodBindingReview'] if x['newAliasRequired']]==[6,7]
assert [x['ingredientIndex'] for x in s['foodBindingReview'] if x['newSourceAllowlistEntryRequired']]==[7]
macro={k:D(0) for k in ['availableCarbohydrate','protein','fat','fibre']};known=D(0);extra=D(0);ordinary=D(0);contributions=[]
for i in p['ingredients']:
 if i.get('certifiedZeroSalt'):
  assert i['massG'] is None and i['polyolEvidence']=='DEFINED_PURE_SALT_ONLY_NOT_UNKNOWN_ZERO';factor=D(0)
 else:
  assert i['sourceId'] in source;assert source[i['sourceId']]['effectiveMacroPer100g']==i['macroPer100g'];factor=D(i['massG'])*D(i['retention'])/100/p['servings']
 for k in macro:macro[k]+=D(i['macroPer100g'][k])*factor
 partial=D(i['knownPartialPolyolPer100g']);known+=partial*factor
 if i['unknownAggregate']:
  assert i['index']==8 and i['aggregatePolyolPer100g'] is None;assert all(v is None for v in i['individuallyReportedSpecies'].values())
  assert D(i['pairedCarbohydrates']['with'])-D(i['pairedCarbohydrates']['without'])==partial
  remaining=D(100)-sum((D(i['macroPer100g'][k]) for k in macro),D(0))-partial
  assert remaining==D('22.4');extra+=remaining*factor;unknown.append(i['index'])
 else:assert i['aggregatePolyolPer100g'] is not None and D(i['aggregatePolyolPer100g'])==partial
 cho=D(i['macroPer100g']['availableCarbohydrate'])*factor
 if cho:
  gi=gis[i['giSourceId']];assert gi['evidenceHash']==i['giSourceEvidenceHash'] and D(str(gi['gi']))==D(i['gi'])
  value=cho*D(i['gi'])/100
 else:assert i['gi'] is None;value=D(0)
 ordinary+=value;contributions.append(value)
assert unknown==[8] and known==0 and extra==D('.028')
assert macro=={k:D(v) for k,v in p['calculation']['macroPerServing'].items()}
assert ordinary==D('2.737675') and ordinary==D(p['calculation']['ordinaryKnownAIngredientSum'])
assert contributions==[D(x['ordinaryGkContribution']) for x in p['calculation']['contributions']]
total=macro['availableCarbohydrate']+macro['fibre']+known;high=total+extra;gk_high=ordinary+extra*D('1.5')
assert [total,high]==[D('10.380250'),D('10.408250')];assert gk_high==D('2.779675');assert gk_high-ordinary==D('.042')<=D('.10');assert gk_high<=10
rounding=lambda v,dp:v.quantize(D(1).scaleb(-dp),rounding=ROUND_HALF_UP)
assert rounding(ordinary,0)==rounding(gk_high,0)==3
for key,display in p['calculation']['displayMacros'].items():
 a,b=[D(v) for v in display['interval']];assert rounding(a,display['decimalPlaces'])==rounding(b,display['decimalPlaces'])==D(display['value'])
assert rounding(total,2)!=rounding(high,2);assert rounding(total,1)==rounding(high,1)==D('10.4')
assert extra*D(4)>D('.10'), 'factor400 exceeds the scenario budget;150 is not a physiological maximum'
assert base['baselineObjectCount']==len(base['resultHashes'])==len({r['recipeId'] for r in base['resultHashes']})==326
assert sum(r['status']=='CALCULATED' for r in base['resultHashes'])==130 and base['newGkCalculations']==base['newBuilds']==0
for path,h in base['protectedTrees'].items():assert git('rev-parse',f'HEAD:{path}')==h and git('rev-parse',f'{base["main"]}:{path}')==h,path
changed=git('diff','--name-only',base['main'],'--').splitlines()
assert all(x.startswith('docs/research/gk80-afcd-recovery-01/') for x in changed),changed
if args.check_local_sources:
 for f in provenance['files']:assert sha(Path(f['path']))==f['sha256LfNormalized'],f['path']
 for state in provenance['worktreesBefore'].values():
  assert subprocess.check_output(['git','-C',state['root'],'rev-parse','HEAD'],text=True).strip()==state['head']
  assert not subprocess.check_output(['git','-C',state['root'],'status','--porcelain'],text=True).strip()
 for rid,expected in provenance['originalPr156Approvals'].items():
  path=Path(provenance['worktreesBefore']['156']['root'])/'docs/nutrition/calculations'/f'{rid}.json';assert fp(json.loads(path.read_text(encoding='utf8')))==expected,rid
if (F/'checksums.json').exists():
 for name,h in read('checksums.json').items():assert sha(F/name)==h,name
print(json.dumps({'status':'PASS','screening':screen['counts'],'selectedDecimalCases':1,'caseHash':p['caseFingerprintSha256'],'conditionalPilot':'uunikanapasta-kesakurpitsa','width':'0.042','display':{'net':'7.38','total':'10.4','protein':'39.53','fat':'23.91','gk':'about3 LOW'},'ownerApproval':False,'publicationEligibleNow':False,'mainNumericBaseline':130,'baselineObjects':326,'productionInputTreesUnchanged':True,'newProductionCalculations':0,'builds':0,'localSourceHashesChecked':args.check_local_sources}))
