"""Read-only independent Decimal verification and protected-file audit."""
from pathlib import Path
import importlib.util,json,hashlib,sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];D=R/'docs/nutrition/gk80/run-4'
spec=importlib.util.spec_from_file_location('dec',R/'site/scripts/gk80-run2-decimal.py');dec=importlib.util.module_from_spec(spec);spec.loader.exec_module(dec)
def read(p):return json.loads(p.read_text(encoding='utf8'))
def main():
 recipes=read(D/'recipes.json')['recipes'];sources={s['id']:s for s in read(D/'sources.json')['records']};comps=read(D/'composition-sources.json')['records']
 assert len(recipes)==50 and len({r['recipeId'] for r in recipes})==50
 for s in [*sources.values(),*comps]:assert dec.fingerprint({k:v for k,v in s.items() if k!='evidenceHash'})==s['evidenceHash']
 for f in read(D/'provenance.json')['localFiles']:assert hashlib.sha256((R/f['path']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==f['sha256'],f['path']
 for c in comps:
  raw=c['sourceRecord'];v=c['per100g']
  if 'originCalculation' in c:
   m=raw['per100g'];assert v==dict(availableCarbohydrate=m['carbohydrate'],protein=m['protein'],fat=m['fat'],fibre=m['fibre'])
   assert hashlib.sha256((R/c['originCalculation']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==c['originCalculationSha256']
  elif 'sourceRecord' in raw:
   m=raw['sourceRecord'];assert v==dict(availableCarbohydrate=m['available_carbohydrate_without_sugar_alcohols_g_per_100g'],protein=m['protein_g_per_100g'],fat=m['fat_g_per_100g'],fibre=m['fibre_g_per_100g'])
  else:assert c['id']=='maille-label-proxy' and v==dict(availableCarbohydrate=3.5,protein=7,fat=11,fibre=2)
 assert [dec.compute(r,sources) for r in recipes]==read(D/'golden.json')['recipes']
 for r in recipes:
  if r['coverageProposalEligible']:assert dec.fingerprint(dict(title=r['proposedTitle'],servings=r['servings'],scenarios=r['scenarios'],preparation=r['proposedPreparation']))==r['proposedVersionHash']
 prior=set(read(D/'selection.json')['priorNumericExcluded']);assert len(prior)==22 and not prior.intersection(r['recipeId'] for r in recipes)
 m=read(D/'metrics.json');assert sum(r['coverageProposalEligible'] for r in recipes)==m['numericConditionalProposals']>=25
 print(json.dumps(dict(status='PASS',recipes=50,numeric=m['numericConditionalProposals'],first25=m['first25'],second25=m['second25'],protectedFiles=len(read(D/'provenance.json')['localFiles']))))
if __name__=='__main__':main()
