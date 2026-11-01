"""Read-only verification of the scoped review package; no build or network.

Checks source hashes, primary-reference identities, all input/source hashes,
independent Decimal arithmetic and four complete proposal macros. A PASS is
technical evidence, not owner method/content approval or release authority.
"""
from pathlib import Path
from decimal import Decimal,getcontext,ROUND_HALF_UP
import json,hashlib,argparse,subprocess
getcontext().prec=40
HERE=Path(__file__).resolve().parent
def read(p):return json.loads(p.read_text(encoding='utf8'))
def norm(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,dict):return {k:norm(v) for k,v in x.items()}
 if isinstance(x,list):return [norm(v) for v in x]
 return x
def fingerprint(x):return hashlib.sha256(json.dumps(norm(x),sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def filehash(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def calc(r,sources):
 out=[]
 for s in r['scenarios']:
  m={k:Decimal(0) for k in ['availableCarbohydrate','protein','fat','fibre']};contributions=[];gk=Decimal(0);imputed=Decimal(0)
  for i in s['ingredients']:
   if i['per100g'] is None or (i['massG'] is None and not i.get('certifiedZeroSalt')):contributions.append(dict(index=i['index'],carbohydrate=None,gk=None));continue
   factor=Decimal(0) if i.get('certifiedZeroSalt') else Decimal(str(i['massG']))*Decimal(str(i['retention']))/100/Decimal(str(r['servings']))
   for k in m:m[k]+=Decimal(str(i['per100g'][k]))*factor
   cho=Decimal(str(i['per100g']['availableCarbohydrate']))*factor;sid=i.get('giId') or (i.get('impact') or {}).get('sourceId');v=Decimal(0) if cho==0 else cho*Decimal(str(sources[sid]['gi']))/100 if sid else None
   if v is not None:
    gk+=v
    if (i.get('impact') or {}).get('kind')=='PUBLISHED_IMPUTATION':imputed+=v
   contributions.append(dict(index=i['index'],carbohydrate=float(cho),gk=None if v is None else float(v)))
  whole=float(gk) if r['completeInputScope'] and all(c['gk'] is not None for c in contributions) else None
  wholeCho=float(m['availableCarbohydrate']) if r['completeInputScope'] and all(c['carbohydrate'] is not None for c in contributions) else None
  out.append(dict(id=s['id'],macros={k:float(v) for k,v in m.items()},contributions=contributions,knownSubtotal=float(gk),wholeGk=whole,wholeCarbohydrate=wholeCho,imputedImpact=float(imputed)))
 return dict(recipeId=r['recipeId'],inputHash=fingerprint(r),scenarios=out)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--repo-root',type=Path);a=ap.parse_args();root=(a.repo_root or HERE.parents[2]).resolve();manifest=read(HERE/'manifest.json');decisions=read(HERE/'decisions.json')['recipes'];bundles=read(HERE/'review-bundles.json')['recipes'];recipes=read(HERE/'recipes.json')['recipes'];sources={s['id']:s for s in read(HERE/'sources.json')['records']};comps={c['id']:c for c in read(HERE/'composition-sources.json')['records']};gold=read(HERE/'golden.json')['recipes'];pub={r['recipeId']:r for r in read(HERE/'publication-macros.json')['recipes']}
 assert len(decisions)==len(bundles)==len({d['recipeId'] for d in decisions})==22
 assert sorted(d['recipeId'] for d in decisions)==sorted(manifest['lockedRecipeIds'])
 assert manifest['lockedTarget']==dict(minimum=15,primary=18,stretch=20)
 assert manifest['ownerApproved'] is False and manifest['publicationIntegrated'] is False
 allIds=[x for b in read(HERE/'selection.json')['batches'] for x in b['recipeIds']];assert len(allIds)==len(set(allIds))==88
 for b in bundles:
  assert filehash(root/b['sourcePath'])==b['sourceSha256'],b['recipeId']
  assert hashlib.sha256(b['originalSource'].encode()).hexdigest()==b['sourceSha256']
 references=read(HERE/'primary-files.json');assert filehash(root/references['fineli']['path'])==references['fineli']['sha256']
 for filename,h in read(HERE/'verification.json')['engineSourceHashes'].items():assert filehash(root/'site/scripts'/filename)==h
 fineli={str(f['source_id']):f for f in read(root/'docs/nutrition/fineli-release-20-reference.json')['foods']};afcd={f['source_id']:f for f in read(root/'docs/nutrition/afcd-release-3-reference.json')['foods']}
 originals={s['id']:s for s in read(HERE/'reference-source-records.json')['records']}
 for s in sources.values():
  assert fingerprint({k:v for k,v in s.items() if k!='evidenceHash'})==s['evidenceHash']
  o=originals[s['originalSourceId']];assert o['evidenceHash']==s['originalEvidenceHash'];assert fingerprint({k:v for k,v in o.items() if k!='evidenceHash'})==o['evidenceHash'];assert o['gi']==s['gi']
 for c in comps.values():
  assert fingerprint({k:v for k,v in c.items() if k!='evidenceHash'})==c['evidenceHash'];rec=c['sourceRecord'];proof=rec.get('primaryVerification')
  if proof and 'source_id' in proof:
   r=fineli[str(proof['source_id'])]['per100g'];expected=dict(availableCarbohydrate=r['available_carbohydrate_g_per_100g'],protein=r['protein_g_per_100g'],fat=r['fat_g_per_100g'],fibre=r['fibre_g_per_100g']);poly=r['polyols_g_per_100g'];assert expected==c['per100g'];assert rec['per100g']['polyols']==poly
  elif proof and 'foodId' in proof:
   r=afcd[proof['foodId']];expected=dict(availableCarbohydrate=r['available_carbohydrate_without_sugar_alcohols_g_per_100g'],protein=r['protein_g_per_100g'],fat=r['fat_g_per_100g'],fibre=r['fibre_g_per_100g']);assert expected==c['per100g'];p=Decimal(str(r['available_carbohydrate_with_sugar_alcohols_g_per_100g']))-Decimal(str(r['available_carbohydrate_without_sugar_alcohols_g_per_100g']));assert rec['per100g']['polyols']==float(p)
  else:
   original=rec['originalLabelOrReference'];v=original['per100g'];p=v.get('polyols');ch=v.get('carbohydrate');definition=original['carbohydrateDefinition'];available=ch
   if definition=='EU_TOTAL_INCLUDING_POLYOLS':available=None if p is None else ch-p
   if definition=='US_TOTAL_INCLUDING_FIBRE':available=None if p is None or v.get('fibre') is None else ch-v['fibre']-p
   assert c['per100g']['availableCarbohydrate']==available
   if rec['polyolsSourceVerified']:assert original.get('polyolsSourceVerified') and original.get('polyolsEvidence') and p==rec['per100g']['polyols']
 assert [calc(r,sources) for r in recipes]==gold
 for r in recipes:
  path=root/r['sourcePath']
  if not path.exists():path=HERE.parents[2]/r['sourcePath']
  assert filehash(path)==r['sourceSha256'],r['recipeId']
  if not r['coverageProposalEligible']:continue
  assert r['completeInputScope'];assert r['proposedVersionHash']==fingerprint(dict(title=r['proposedTitle'],servings=r['servings'],scenarios=r['scenarios'],preparation=r['proposedPreparation']))
  exact={k:Decimal(0) for k in ['availableCarbohydrate','protein','fat','fibre']};poly=Decimal(0)
  for i in r['scenarios'][0]['ingredients']:
   if i.get('certifiedZeroSalt'):continue
   c=comps[i['composition']['sourceId']];assert c['evidenceHash']==i['composition']['evidenceHash'];assert c['sourceRecord']['polyolsSourceVerified'];assert c['sourceRecord']['per100g']['polyols'] is not None
   factor=Decimal(str(i['massG']))*Decimal(str(i['retention']))/100/Decimal(str(r['servings']))
   for k in exact:exact[k]+=Decimal(str(i['per100g'][k]))*factor
   poly+=Decimal(str(c['sourceRecord']['per100g']['polyols']))*factor
  rnd=lambda v:float(v.quantize(Decimal('.01'),rounding=ROUND_HALF_UP));expected=dict(carbsNetG=rnd(exact['availableCarbohydrate']),carbsTotalG=rnd(exact['availableCarbohydrate']+exact['fibre']+poly),proteinG=rnd(exact['protein']),fatG=rnd(exact['fat']));assert pub[r['recipeId']]['publishedMacros']==expected
 for d in decisions:
  if d['state']=='HOLD':assert d['wholeGk'] is None and d['publicationMacros'] is None
 assert sum(d['state']=='NUMERIC_REVIEW_PROPOSAL' for d in decisions)==manifest['numericReviewProposals']==len(pub)
 assert sum(d['state']=='HOLD' for d in decisions)==manifest['holds']
 prefix='docs/nutrition/gk80-run'+str(manifest['run'])+'/'
 changed=subprocess.check_output(['git','diff','--name-only',manifest['baseMain'],'--'],cwd=root,text=True).splitlines()
 untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=root,text=True).splitlines()
 assert all(p.startswith(prefix) for p in changed+untracked),(changed,untracked)
 for r in recipes:
  for scenario in r['scenarios']:
   for i in scenario['ingredients']:
    if i.get('impact'):assert i['impact']['evidenceHash']==sources[i['impact']['sourceId']]['evidenceHash']
 print(json.dumps(dict(status='PASS',run=manifest['run'],reviewed=22,models=len(recipes),numeric=manifest['numericReviewProposals'],holds=manifest['holds'],primaryCompositionRecords=len(comps),independentDecimal=True,activeSourcesUnchanged=True)))
if __name__=='__main__':main()
