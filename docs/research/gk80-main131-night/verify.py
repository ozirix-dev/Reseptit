"""Static evidence verification; never regenerates the 326-recipe calculation.

Run from anywhere: python -I -X utf8 docs/research/gk80-main131-night/verify.py
Optional --report pins the already existing release report, not a new calculation.
"""
from pathlib import Path
import argparse,hashlib,json,subprocess

P=Path(__file__).resolve().parent;R=P.parents[2]
load=lambda p:json.loads(p.read_text(encoding='utf8'))
sha=lambda p:hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
git=lambda *a:subprocess.check_output(['git','-C',str(R),*a],text=True,encoding='utf8').strip()
args=argparse.ArgumentParser();args.add_argument('--report',type=Path);a=args.parse_args()
m=load(P/'artifact-manifest.json')
for file,h in m.items():assert sha(P/file)==h,('changed report evidence',file)
b=load(P/'baseline-proof.json');main=b['main'];hs=b['resultHashes'];ids={x['recipeId'] for x in hs}
assert len(ids)==len(hs)==326 and sum(x['status']=='CALCULATED' for x in hs)==131
assert b['counts']['unchangedPriorNumeric']==130 and b['uunikanapastaDisplay']==3
assert b['newCalculations326']==0 and b['teaStatus']=='INSUFFICIENT SOURCE DATA'
assert all(v is None for vals in b['withheld'].values() for v in vals.values())
assert sha(R/b['baseline130File'])==b['baseline130LfSha256']
for file,obj in b['protectedGitObjects'].items():
 assert git('rev-parse',main+':'+file)==obj
 subprocess.run(['git','-C',str(R),'diff','--exit-code',main,'--',file],check=True,capture_output=True)
changes=git('diff','--name-only',main).splitlines()
assert all(p=='site/tests/nutrition-evidence.test.ts' or p.startswith('docs/research/gk80-main131-night/') for p in changes),changes
i=load(P/'inventory.json');rows=i['recipes'];rids={x['recipeId'] for x in rows}
assert len(rows)==len(rids)==109 and rids<=ids
numeric={x['recipeId'] for x in hs if x['status']=='CALCULATED'};assert not rids&numeric
assert i['gateCounts']=={'SOURCE_HOLD':106,'CONDITIONAL_OWNER_REVIEW':1,'APPROVED_UNPUBLISHED_NEEDS_MAIN_RECONCILIATION':2}
assert sum(i['classificationBreakdown'].values())==326
selected=set(i['selectedSourceFamilies']);assert len(selected)==3
potential={x['recipeId'] for x in rows if x['families'] and set(x['families'])<=selected and not x['otherBlockers']}
assert potential==set(i['selectedOptimisticRecordedBarrierClosure']['recipeIds']) and len(potential)==4
matrix=load(P/'integration-matrix.json');assert len(matrix['rows'])==32
assert matrix['overlapCounts']=={'153_165':10,'156_165':14,'153_156':8}
cases=load(P/'next-approval-packet.json')['cases'];assert len(cases)==2
assert {x['approvedEvidenceFingerprint'] for x in cases}=={'7e16f21f52cc2365c6b1742d891542fb118b7b879b5bf73d88d5dbef361c0f2f','57540a15a0e29a4fc6c7cdfe83dfbaa8f59222a0dd48ad77f75c96cf36d82235'}
assert all(x['ownerContentAndMethodApproved'] and not x['releaseAuthorized'] and not x['currentMainIntegrationVerified'] for x in cases)
http=load(P/'production-http.json');assert http['status']=='PASS' and http['expectedReleaseSha']==main
assert http['coverage']['numeric']==131 and http['coverage']['recipes']==326
if a.report:
 assert sha(a.report)==b['sourceReportLfSha256']
 results=load(a.report)['results'];by={x['recipeId']:x for x in results};assert set(by)==ids
 for x in hs:
  h=hashlib.sha256(json.dumps(by[x['recipeId']],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
  assert h==x['sha256'],x['recipeId']
print(json.dumps({'status':'PASS','published':131,'recipes':326,'priorNumericUnchanged':130,'fullResultObjectsVerified':326 if a.report else 'pinned existing baseline; no recalculation','unpublishedUnique':109,'selectedFamiliesPotentialOnly':4,'newSourceCleared':0,'new326Calculations':0,'newBuilds':0},ensure_ascii=False))
