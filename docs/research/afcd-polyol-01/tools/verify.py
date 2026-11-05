"""Independent reconciliation; no recipe writes or publication approval."""
import csv,hashlib,json,subprocess,sys
from decimal import Decimal as D
from pathlib import Path
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();cohort=json.loads(Path(sys.argv[3]).read_text('utf8'))
load=lambda p:json.loads((out/p).read_text('utf8'))
table=lambda p:list(csv.DictReader((out/p).open(encoding='utf8',newline='')))
s=load('summary.json');m=table('source-decisions.csv');g=table('recipe-dependencies.csv');v=table('normalization-variants.csv');e=table('recipe-effects.csv')
sources={x['native_id']:x for x in m};variants={x['variant_id']:x for x in v};effects={x['recipe_id']:x for x in e}
assert len(sources)==len(m)==138 and len(variants)==len(v)==253
assert len(g)==979 and len(effects)==len(e)==228
used=[x for x in g if x['used']=='True']
assert len(used)==936 and len({x['native_id'] for x in used})==133 and len({x['recipe_id'] for x in used})==219
assert set(cohort['recipeIds'])<=set(effects) and len(cohort['recipeIds'])==172
for row in g:
    assert row['native_id'] in sources
    assert variants[row['variant_id']]['native_id']==row['native_id']
for id,row in sources.items():
    count=len({x['recipe_id'] for x in used if x['native_id']==id})
    assert count==int(row['dependent_recipes'])
    assert row['polyols_total']=='UNKNOWN'
assert sum(x['initial_cohort']=='True' for x in e)==172
assert sum(x['initial_cohort']=='True' and x['decision']=='NO_CURRENT_AFCD_DEPENDENCY' for x in e)==5
assert len([x for x in v if x['source_alignment']=='AVAILABLE_BINDING_MISMATCH'])==3
assert len([x for x in v if x['source_alignment']=='AVAILABLE_BINDING_MISMATCH' and int(x['active_dependency_rows'])])==2
# Regression: identical local ID must not overwrite its correct macro copy.
rasp=[x for x in v if x['local_record_id']=='afcd-F007619-release-3']
assert {D(x['available_per100g']) for x in rasp}=={D('6.9'),D('7')}
macro_rasp=[x for x in used if x['local_record_id']=='afcd-F007619-release-3' and x['channel']=='MACRO']
assert {x['recipe_id'] for x in macro_rasp}=={'siemengranola-jogurtilla','vhh-runebergintortut'}
assert all(D(variants[x['variant_id']]['available_per100g'])==D('6.9') for x in macro_rasp)
checks={x['recipeId']:x for x in s['targetedProbe']}
for id in ['siemengranola-jogurtilla','vhh-runebergintortut']:assert checks[id]['before']==checks[id]['afterAvailableOnlyCorrection']
peach=checks['valimerellinen-ricotta-persikkakulho']
assert abs(D(str(peach['before']['exact']))-D('4.0836'))<D('1e-12')
assert abs(D(str(peach['afterAvailableOnlyCorrection']['exact']))-D('3.96885'))<D('1e-12')
assert (D('8')-D('7.7'))*D('150')/100/2*51/100==D('.11475')
assert peach['afterAvailableOnlyCorrection']['rounded']==3.97
assert checks['pellava-puuro-pahkinoilla']['afterAvailableOnlyCorrection']['status']=='INSUFFICIENT SOURCE DATA'
assert checks['siskonmakkarakeitto-juurekset']['before']==checks['siskonmakkarakeitto-juurekset']['afterAvailableOnlyCorrection']
chocolate=D('3.8')+D('28')+D('3.6')-(D('32.1')-D('4.1'))
assert chocolate==D('7.4') and chocolate*150/100/8==D('1.3875') and chocolate*60/100/10==D('.444')
assert s['rawReferenceMismatches']==[] and s['gkPolyolDependentRows']==[]
for name,wanted in s['inputHashes'].items():assert hashlib.sha256((root/name).read_bytes()).hexdigest()==wanted,name
diff=subprocess.check_output(['git','diff','--name-only',s['baseMain'],'--'],cwd=root,text=True).splitlines()
assert all(p.startswith('docs/research/afcd-polyol-01/') for p in diff),diff
print(json.dumps({'sourceRows':len(m),'normalizationVariants':len(v),'dependencyRows':len(g),'usedDependencyRows':len(used),'originalCohortCovered':172,'recipeReviewRows':len(e),'currentPublishedGkNumericalErrors':1,'currentHeldGkBindingErrors':1,'historicalWithheldErrors':2,'currentPublishedMacroNumericalErrorsProven':0,'inputHashesChecked':len(s['inputHashes']),'independentDecimalChecks':3,'sameIdDifferentValueRegression':'PASS','productionWrites':0},indent=2))
