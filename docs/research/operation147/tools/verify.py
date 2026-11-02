"""Independent reconciliation and preservation checks for the review bundle."""
import collections, hashlib, json, subprocess, sys
from pathlib import Path
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve()
load=lambda name:json.loads((out/name).read_text(encoding='utf8'))
summary=load('summary.json');rows=load('recipe-scenarios.json');manifest=load('input-manifest.json')
assert len(rows)==326 and len({r['recipeId'] for r in rows})==326
for stat in summary['scenarios']:
    values=[r['scenarios'][stat['scenario']] for r in rows]
    assert sum(len(r['newFields']) for r in values)==stat['newFields']
    assert sum(bool(r['newFields']) for r in values)==stat['newRecipes']
    assert sum(len(r['remainingFields']) for r in values)==stat['remainingMissingFields']
    assert sum(r['restoredPackage'] for r in values)==stat['restoredPackages']
    assert all(r['classification']!='PASS' for r in values)
    for r in values:
        assert all(r['values'][k] is not None for k in r['newFields'])
        assert all(r['values'][k] is None for k in r['remainingFields'])
new={(r['recipeId'],k) for r in rows for k in r['scenarios']['S6']['newFields']}
expected_ids={'janssoninkiusaus-juuriselleri','marokkolainen-couscous','paprikainen-vhh-gulassi','pasta-alla-norma'}
expected={(id,k) for id in expected_ids for k in ['protein','fat']}|{('marokkolainen-couscous','netCarbohydrate')}
assert new==expected
for r in rows:
    if not r['hasCurrentEvidence'] or r['reason']=='WITHDRAWN_EXACT_HISTORICAL_PACKAGE':
        assert not r['scenarios']['S6']['newFields']
assert summary['productionDifferences']==[] and summary['numericConflicts']==[]
changed=[]
for name,wanted in manifest['rawSha256'].items():
    actual=hashlib.sha256((root/name).read_bytes()).hexdigest()
    if wanted!=actual:changed.append(name)
assert not changed,changed
diff=subprocess.check_output(['git','diff','--name-only',manifest['sourceCommit'],'--'],cwd=root,text=True).splitlines()
assert all(p.startswith('docs/research/operation147/') for p in diff),diff
result={'scope':'Research output reconciliation and original input preservation; not production/method approval','recipes':326,'scenarioRows':sum(len(r['scenarios']) for r in rows),'s6UniqueNewFields':len(new),'s6RestoredPackages':0,'independentDecimalComparisons':summary['decimalComponentChecks'],'originalInputHashesChecked':len(manifest['rawSha256']),'originalInputChanges':changed,'productionVsMainMacroDifferences':0,'baselineNumericConflicts':0}
print(json.dumps(result,ensure_ascii=False,indent=2))
