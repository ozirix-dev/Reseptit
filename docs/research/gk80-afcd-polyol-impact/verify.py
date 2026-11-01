"""Read-only audit-package verification. Does not run a site build or whole-dataset GK calculation."""
from pathlib import Path
from decimal import Decimal as D,getcontext,ROUND_HALF_UP
from collections import Counter
import json,hashlib,argparse,subprocess
getcontext().prec=40;HERE=Path(__file__).resolve().parent
def read(n):return json.loads((HERE/n).read_text(encoding='utf8'))
def normalized(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,dict):return {k:normalized(v) for k,v in x.items()}
 if isinstance(x,list):return [normalized(v) for v in x]
 return x
def fp(x):return hashlib.sha256(json.dumps(normalized(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def sha(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--repo-root',type=Path);ap.add_argument('--check-local-source-files',action='store_true');a=ap.parse_args();root=(a.repo_root or HERE.parents[2]).resolve()
 for name,h in read('checksums.json').items():assert sha(HERE/name)==h,name
 matrix=read('matrix.json')['rows'];sources={r['foodId']:r for r in read('sources.json')['records']};summary=read('summary.json');n=read('numeric-checks.json')
 assert len(matrix)==len({(r['group'],r['recipeId']) for r in matrix})==240
 for g,count in [('A',130),('B',20),('C',2),('D',88)]:
  rs=[r for r in matrix if r['group']==g];assert len(rs)==count
  assert dict(Counter(r['decision'] for r in rs))==summary[g]['decisions']
  assert all(not r['releaseEligibleFromThisAudit'] for r in rs)
 assert len(sources)==137
 for r in matrix:
  for row in r['afcdOccurrences']:
   assert row['foodId'] in sources
   if row['role']=='SCOPED_C_SOURCE':continue
   s=sources[row['foodId']];pair=D(str(s['sourceWith']))-D(str(s['sourceWithout']));assert pair>=0
   if row['massG'] is not None:
    dose=pair*D(str(row['massG']))*D(str(row['retention']))/100/D(str(r['servings']));assert dose==D(row['pairDifferencePerServing'])
  if r['hasAfcdInTracedChain']:assert r['unknownAggregatePolyol'] is None
 for s in sources.values():assert s['aggregatePolyol'] is None
 chocolate=sources['F009837'];assert chocolate['sourceWith']==32.1 and chocolate['sourceWithout']==4.1
 assert sum(D(str(chocolate['species'][k])) for k in ['maltitol','erythritol','xylitol'])==D('35.4')
 for row in n['additionalSpeciesCases']:
  r=next(r for r in matrix if r['recipeId']==row['recipeId'] and r['group']=='D');i=next(i for i in r['afcdOccurrences'] if i['foodId']=='F009837' and i['role']=='FOUR_MACRO_SOURCE');dose=D('7.4')*D(str(i['massG']))*D(str(i['retention']))/100/D(str(r['servings']));assert dose==D(row['knownAdditionalTotalChoPerServing']);assert r['referenceRecipeSource']['frontmatterStatus']=='published'
  assert r['decision']=='HOLD'
 for e in read('c-evidence.json')['records']:
  rid=e['recipeId'];m=next(r for r in matrix if r['group']=='C' and r['recipeId']==rid);assert fp(e)==m['approvalFingerprint'];case=e['scopedPolyolC']['case'];sums={k:D(0) for k in ['availableCarbohydrate','protein','fat','fibre']};known=D(0);unknown=D(0);gk=D(0)
  for i in case['ingredients']:
   f=D(str(i['massG']))*D(str(i['retention']))/100/D(str(case['servings']))
   for k in sums:sums[k]+=D(str(i['macro'][k]))*f
   if i['gi'] is not None:gk+=D(str(i['macro']['availableCarbohydrate']))*f*D(str(i['gi']))/100
   kind=i['polyolEvidenceKind']
   if kind=='REPORTED_SOURCE_VALUE':known+=D(str(i['polyolsSourceValue']))*f
   elif kind=='AFCD_PAIRED_SOURCE_MODEL':
    pair=D(str(i['pairedCarbohydrates']['withValue']))-D(str(i['pairedCarbohydrates']['without']));known+=pair*f;unknown+=(D(100)-sum(D(str(i['macro'][k])) for k in sums)-pair)*f
   else:
    assert kind=='MISSING_AGGREGATE' and i['polyolsSourceValue'] is None;unknown+=(D(100)-sum(D(str(i['macro'][k])) for k in sums))*f
  width=unknown*D('1.5');audit=m['numericAudit'];assert abs(width-D(audit['sourceModelGk']['width']))<D('1e-30');assert width<=D('.10');assert abs(gk-D(audit['sourceModelGk']['lower']))<D('1e-30')
  total=sums['availableCarbohydrate']+sums['fibre']+known;assert total.quantize(D(1),rounding=ROUND_HALF_UP)==(total+unknown).quantize(D(1),rounding=ROUND_HALF_UP)
  assert gk.quantize(D(1),rounding=ROUND_HALF_UP)==(gk+width).quantize(D(1),rounding=ROUND_HALF_UP);assert gk>=1 and gk+width<=10
 control=read('systematic-control.json');assert control['actual']==dict(available=16,net=13,totalCarbohydrate=23);assert control['expected']==dict(available=13,net=13,totalCarbohydrate=20)
 nextBatch=read('next-production-batch.json');assert nextBatch['recipeIds']==['keto-suklaakeksit','keto-mutakakku'];assert nextBatch['numericGkCoverageChange']==0
 p=read('provenance.json');assert p['builds']==p['manualActionsRuns']==0 and not p['productionCodeChanged']
 if a.check_local_source_files:
  for path,h in p['sourceFiles'].items():assert sha(Path(path))==h,path
 changed=subprocess.check_output(['git','diff','--name-only',p['state']['main'],'--'],cwd=root,text=True).splitlines();extra=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=root,text=True).splitlines();assert all(s.startswith('docs/research/gk80-afcd-polyol-impact/') for s in changed+extra)
 print(json.dumps(dict(status='PASS',matrixRows=240,publishedGk=130,afcdChainHits=101,sourceFoods=137,cCasesVerified=2,sourceFileRescan=a.check_local_source_files,productionBuilds=0)))
if __name__=='__main__':main()
