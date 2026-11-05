"""Read-only artifact and match-contract checks, no network/build/GK recalculation.

python docs/research/gi-source-integrity-01/verify.py [--baseline-report PATH]
"""
from pathlib import Path
from decimal import Decimal
import json,hashlib,subprocess,argparse,sys
sys.dont_write_bytecode = True
from admission import issues, decision_key

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
MAIN='583fdb91aeb12114f909412b9165fc3b02a6515d'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def sha(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args],text=True).strip()
def verify(baseline_report=None):
 manifest=read(HERE/'artifact-manifest.json')['lfSha256']
 assert set(manifest)=={p.name for p in HERE.iterdir() if p.is_file() and p.name!='artifact-manifest.json'}
 for name,h in manifest.items():assert sha(HERE/name)==h,name
 inputs=read(HERE/'input-manifest.json')
 for path,h in inputs['mainFiles'].items():assert sha(ROOT/path)==h,path
 prefix=HERE.relative_to(ROOT).as_posix()+'/'
 assert all(p.startswith(prefix) for p in git('diff','--name-only',MAIN).splitlines())
 assert all(p.startswith(prefix) for p in git('ls-files','--others','--exclude-standard').splitlines())
 base=read(HERE/'baseline133.json')
 assert base['main']==MAIN and git('rev-parse',MAIN+'^{tree}')==base['sourceTree']
 assert len(base['resultHashes'])==326 and len(set(base['numericIds']))==133
 assert base['counts']=={'recipes':326,'numeric':133,'incomplete':193}
 inv=read(HERE/'coconut-recipes.json')
 assert len(inv['allCoconutRecipes'])==41 and len(set(inv['milkDrinkWaterRecipeIds']))==35
 assert len([r for r in inv['allCoconutRecipes'] if r['recipeId'] in inv['milkDrinkWaterRecipeIds'] and r['currentStatus']=='CALCULATED'])==6
 uses=inv['activeReleaseCoconutUses'];assert len(uses)==8 and len({u['recipeId'] for u in uses})==7
 for u in uses:
  i=u['ingredient'];assert u['source']['evidenceKind']=='PUBLISHED_IMPUTATION' and u['source']['gi']==50
  cho=Decimal(str(i['massG']))*Decimal(str(i['retention']))*Decimal(str(i['per100g']['availableCarbohydrate']))/100/Decimal(str(next(r['servings'] for r in inv['allCoconutRecipes'] if r['recipeId']==u['recipeId'])))
  assert cho==Decimal(u['availableChoPerServing']) and cho/2==Decimal(u['gkContribution'])
  assert u['recipeId'] in base['numericIds']
 cards=read(HERE/'all-source-index.json');assert cards['cardOccurrences']==len(cards['cards'])==122
 assert cards['inVitroTextMarkers']==0
 risk=read(HERE/'high-risk-screen.json');assert risk['screenedHighRiskCardOccurrences']==len(risk['cards'])==36
 low=read(HERE/'lowcho-applications.json');assert len(low['uses'])==72 and low['uniqueRecipes']==44
 assert all(u['availablePer100g']<=5 for u in low['uses'])
 for x in read(HERE/'research-source-screen.json'):
  raw=subprocess.check_output(['git','-C',str(ROOT),'show',x['commit']+':'+x['path']])
  assert hashlib.sha256(raw.replace(b'\r\n',b'\n')).hexdigest()==x['lfSha256']
 p1=read(HERE/'p1-decision.json');assert p1['publishedNumericGkAffected']==0 and len(p1['cases'])==2
 for c in p1['cases']:
  assert c['recipeId'] not in base['numericIds'] and c['currentGk'] is None
  assert c['wrongFoodRecord']['id']=='fineli-684-release-20'
  assert c['macroCalculationUsesDifferentRecord']=='afcd-F002991-release-3'
 source=read(HERE/'source-classifications.json')['sources'];assert len(source)==5
 assert source[0]['calculationUse']=='REFERENCE_ONLY' and source[0]['testObjectKind']=='MIXED_MEAL'
 assert source[2]['measurementKind']=='IN_VITRO_ESTIMATE' and source[2]['participants'] is None
 fixtures=read(HERE/'match-fixtures.json');assert fixtures['syntheticOnly'] is True and len(fixtures['cases'])==14
 for f in fixtures['cases']:
  trusted=[decision_key(f['record'],f['target'])] if f['syntheticTrustedDecision'] else []
  actual=issues(f['record'],f['target'],trusted)
  if f['expectedReason'] is None:assert not actual,(f['name'],actual)
  else:assert f['expectedReason'] in actual,(f['name'],actual)
 if baseline_report:
  assert sha(baseline_report)==base['sourceReportLfSha256']
  hashes={r['recipeId']:hashlib.sha256(json.dumps(r,ensure_ascii=False,separators=(',',':')).encode()).hexdigest() for r in read(baseline_report)['results']}
  assert hashes==base['resultHashes']
 return {'status':'PASS','baseline':'133/326','lockedResultObjects':326,'sourceCardOccurrences':122,'riskCards':36,'milkRecipes':35,'publishedMilkRecipes':6,'p1HeldCases':2,'contractFixtures':14,'newGkCalculation':False,'productionCodeChanges':0,'baselineReportChecked':bool(baseline_report)}
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--baseline-report',type=Path);args=parser.parse_args()
 print(json.dumps(verify(args.baseline_report),ensure_ascii=False))
