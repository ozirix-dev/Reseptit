"""Read-only cross-branch proposal reconciliation; no scientific equivalence approval.
Usage: reconcile-shared-proposals.py ROOT UPSTREAM_HEAD LOCAL_RESULTS RECOVERY_RESULTS PREPARED_RESULTS EXTERNAL_OUT
"""
import csv,hashlib,json,subprocess,sys
from pathlib import Path
root,head,local_results,recovery_results,prepared_results,out=sys.argv[1:]
root=Path(root);out=Path(out);folder='docs/nutrition/gk80-operation149/'
parent=out.resolve()
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--show-toplevel'],cwd=parent,capture_output=True).returncode==128,'Output must be outside Git'
assert subprocess.check_output(['git','rev-parse',head+'^{commit}'],cwd=root,text=True).strip()==head

def blob(rel):return subprocess.check_output(['git','show',head+':'+rel],cwd=root)
def read(rel):return json.loads(blob(folder+rel))
def local(path):return json.loads(Path(path).read_text(encoding='utf-8-sig'))
def writecsv(name,rows):
 with (out/name).open('w',encoding='utf-8',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
batch=read('proposal-batch.json');approval=read('owner-approval.json')
assert batch['ownerApproved'] is False and batch['publicActivation'] is False and batch['notASourceEquivalenceCertification'] is True
for rel,want in batch['sealedFilesLfSha256'].items():assert hashlib.sha256(blob(rel).replace(b'\r\n',b'\n')).hexdigest()==want,'Upstream sealed file changed: '+rel
base={r['recipeId']:r for r in csv.DictReader((root/'docs/research/afcd-polyol-03/16-decision-matrix.csv').open(encoding='utf-8'))}
assert set(base)==set(approval['approvedInputs']) and len(base)==16
for k,r in base.items():assert r['exactVersionSha256']==approval['approvedInputs'][k]
pending={r['recipeId']:r for r in batch['reviewedInputs']};assert len(pending)==14 and not set(base)&set(pending)
recovery_cases={c['recipeId']:c for c in read('recovery-cases.json')['cases']}
prepared_cases={c['recipeId']:c for c in read('prepared-route-cases.json')['cases']}
up_cases={**recovery_cases,**prepared_cases}
for k,c in up_cases.items():assert pending[k]['inputSha256']==c['inputSha256'] and c['approval'] is False
up_results={r['recipeId']:r for p in [recovery_results,prepared_results] for r in local(p)['results']}
assert len(up_results)==13 and all(r['numericProposal'] and not r['publicationAuthorized'] for r in up_results.values())
coffee=read('additional-proposal.json');assert coffee['publicActivation'] is False
up_results[coffee['recipeId']]={'level':'A','point':coffee['displayApprox'],'scenarioRange':None}
local_cases={r['recipeId']:r for r in map(json.loads,(root/'docs/research/afcd-polyol-03/source-extensions/cases.jsonl').read_text(encoding='utf-8').splitlines())}
local_results_byid={r['recipeId']:r for r in local(local_results)['results']}
assert set(local_cases)==set(local_results_byid) and len(local_cases)==6
assert all(c['approval'] is False and local_results_byid[k]['numericProposal'] and not local_results_byid[k]['publicationAuthorized'] for k,c in local_cases.items())
ids=set(base)|set(pending)|set(local_cases)
rows=[]
for k in sorted(ids):
 b=base.get(k);u=pending.get(k);c=local_cases.get(k);r=local_results_byid.get(k);v=up_results.get(k)
 rows.append({'recipeId':k,'methodContentApproved':bool(b),'releaseAuthorized':False,'upstreamKind':u['kind'] if u else 'ORIGINAL_APPROVED16' if b else '', 'upstreamLevel':v['level'] if v else b['level'] if b else '', 'upstreamInputSha256':u['inputSha256'] if u else approval['approvedInputs'].get(k,''),'upstreamPoint':v.get('point','') if v else b['point'] if b else '', 'upstreamRange':json.dumps(v.get('scenarioRange'),separators=(',',':')) if v and v.get('scenarioRange') else json.dumps({'min':float(b['rangeMin']),'max':float(b['rangeMax'])},separators=(',',':')) if b and b.get('rangeMin') not in ['',None,'None'] else '', 'localLevel':c['level'] if c else '', 'localInputSha256':c['inputSha256'] if c else '', 'localPoint':r['point'] if r and r['point'] is not None else '', 'localRange':json.dumps(r['scenarioRange'],separators=(',',':')) if r and r['scenarioRange'] else '', 'sourceAdmissionPending':c.get('sourcePolicy','') if c and c.get('sourcePolicy') else 'IFCT_TABLE6_SOURCE_APPLICATION_REVIEW_REQUIRED' if any(str(i['compositionId']).startswith('IFCT-') for i in up_cases.get(k,{}).get('candidateIngredients',[])) else '', 'multipleProposalRecordsRequireVersionSelection':bool(c and u),'evidenceStatus':'EXACT_METHOD_CONTENT_APPROVAL_AWAITING_RELEASE' if b else 'SOURCE_APPLICATION_CONTENT_AND_METHOD_REVIEW_PENDING_NOT_CERTIFIED_BY_THIS_RECONCILIATION'})
prepared_group_ids={k for k,c in prepared_cases.items() if c['applicationMode']=='PREPARED_UNITS'}
assert len(prepared_group_ids)==6
other_prepared_ids=set(prepared_cases)-prepared_group_ids
local_only=set(local_cases)-set(pending)-set(base)
method_groups=[('ORIGINAL_APPROVED16',set(base)),('UPSTREAM_RECOVERY_AND_COFFEE',set(recovery_cases)|{coffee['recipeId']}),('UPSTREAM_MEASURED_PREPARED_GROUP',prepared_group_ids),('UPSTREAM_OTHER_SOURCE_OR_CODING',other_prepared_ids),('HANDOFF_DISTINCT_ADDITIONS',local_only)]
assert sum(len(g) for _,g in method_groups)==len(ids)==33
summary={'upstreamHead':head,'upstreamArithmeticProposals':30,'localHandoffArithmeticProposals':22,'overlappingSupplementRecipeIds':sorted(set(local_cases)&set(pending)),'localDistinctBeyondUpstream30':sorted(local_only),'distinctCrossBranchArithmeticProposals':33,'methodContentApprovedVersions':16,'pendingDistinctRecipes':17,'arithmeticProposal30TargetMet':True,'thirtySourceQualifiedPublicationCandidatesProvenByThisCount':False,'sourceEquivalenceCertified':False,'productionBaselineNumeric':156,'integratedApprovedDraftNumeric':172,'hypotheticalOnlyAfterAll33AdmissibleApprovedAndReleased':189,'hypotheticalPercent':round(189/326*100,2),'target80Numeric':261,'gapTo80AfterHypothetical33':72,'actualPublishedGain':0,'preparedGroupArithmeticProposals':len(prepared_group_ids),'newGiConstantInMextRoute':False}
out.mkdir(parents=True,exist_ok=True);writecsv('joint-proposal-index.csv',rows)
writecsv('joint-method-impact.csv',[{'method':name,'recipeIds':';'.join(sorted(group)),'distinctArithmeticProposals':len(group),'methodContentApproved':len(group&set(base)),'publishedGain':0,'sourceEquivalenceCertified':False} for name,group in method_groups])
(out/'joint-proposal-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
