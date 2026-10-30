"""Read-only Decimal repeat and provenance checks for the 40 new proposals."""
from pathlib import Path
import importlib.util,sys,json,hashlib
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'docs/nutrition/gk80/run-3-v2'
spec=importlib.util.spec_from_file_location('reference',ROOT/'site/scripts/gk80-run2-decimal.py');ref=importlib.util.module_from_spec(spec);spec.loader.exec_module(ref)
def read(n):return ref.read(DATA/n)
def main():
 recipes=read('recipes.json')['recipes'];sources={s['id']:s for s in read('sources.json')['records']};comps={c['id']:c for c in read('composition-sources.json')['records']}
 for s in [*sources.values(),*comps.values()]:assert ref.fingerprint({k:v for k,v in s.items() if k!='evidenceHash'})==s['evidenceHash']
 for f in read('provenance.json')['localFiles']:assert hashlib.sha256((ROOT/f['path']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==f['sha256'],f['path']
 for c in comps.values():
  raw=c['sourceRecord']['per100g'];assert c['per100g']==dict(availableCarbohydrate=raw['carbohydrate'],protein=raw['protein'],fat=raw['fat'],fibre=raw['fibre'])
  assert c['sourceRecord']['carbohydrateDefinition']=='EU_AVAILABLE'
  assert hashlib.sha256((ROOT/c['originCalculation']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==c['originCalculationSha256']
 assert [ref.compute(r,sources) for r in recipes]==read('golden.json')['recipes']
 assert len(recipes)==40 and len({r['recipeId'] for r in recipes})==40
 prior={r['recipeId'] for folder in ['pilot-1','run-2'] for r in ref.read(ROOT/f'docs/nutrition/gk80/{folder}/recipes.json')['recipes']}
 assert not prior.intersection(r['recipeId'] for r in recipes)
 m=read('metrics.json');assert sum(r['coverageProposalEligible'] for r in recipes)==m['numericConditionalProposals']>=12
 assert sum(r['group']=='near-complete' for r in recipes)==15 and sum(r['group']=='shared-source' for r in recipes)==15
 assert read('selection.json')['majorCarbohydrateRecipes']>=10 and len(read('selection.json')['screen'])==243
 print(json.dumps(dict(status='PASS',recipes=40,numericProposals=m['numericConditionalProposals'],first20=m['first20'],second20=m['second20'],rangeProposals=m['rangeProposals'])))
if __name__=='__main__':main()
