"""Read-only independent Decimal check of the shared pilot and the AFCD supplement.
Usage: python verify_decimal.py SHARED_SNAPSHOT SUPPLEMENT_DIR SUPPLEMENT_RESULTS
No production imports or writes. Does not confer source/method approval.
"""
import csv
import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import sys
snapshot, supplement, output = map(Path, sys.argv[1:4])
def read(folder, name):
    return json.loads((folder/name).read_text(encoding='utf-8-sig'))
def d(value):
    assert value is not None, 'Missing CHO/GI must not become zero'
    return Decimal(str(value))
def rounded(value):
    return value.quantize(Decimal('0.01'),rounding=ROUND_HALF_UP)
base_comps=read(snapshot,'composition-sources.json')['records']
base_gis=read(snapshot,'gi-sources.json')['records']
pack=read(snapshot,'cases.json')
expected={r['recipeId']:r for r in read(snapshot,'results.json')['results']}
comps={r['id']:r for r in base_comps}
gis={r['id']:r for r in base_gis}

def calculate(case, composition, gi):
    lo, hi, omitted = Decimal(0), Decimal(0), Decimal(0)
    blocked=False
    for row in case['candidateIngredients']:
        source=composition[row['compositionId']]
        upper=d(row['grams'])*d(source['availablePer100g'])/100/d(case['servings'])
        lower=Decimal(0) if row['carbohydrateUse']=='UPPER_BOUND' else upper
        g=gi.get(row['giId'])
        if case['level']=='A' and (g is None or row['carbohydrateUse']=='UPPER_BOUND'):
            omitted+=upper
            blocked|=upper>=1
            continue
        if g is None:
            blocked|=upper>0
            continue
        lo+=lower*min(map(d,g['values']))/100
        hi+=upper*max(map(d,g['values']))/100
    if case['level']=='A':
        blocked|=omitted>=2
    return lo,hi,omitted,not blocked

numeric=set()
for case in pack['cases']:
    lo,hi,omitted,ok=calculate(case,comps,gis)
    want=expected[case['recipeId']]
    assert ok==want['numericProposal'],case['recipeId']
    if ok:
        numeric.add(case['recipeId'])
        if want['point'] is not None:
            assert rounded(lo)==d(want['point']),case['recipeId']
        else:
            assert abs(lo-d(want['scenarioRange']['min']))<Decimal('1e-10')
            assert abs(hi-d(want['scenarioRange']['max']))<Decimal('1e-10')
base_numeric=len(numeric)
assert base_numeric==sum(r['numericProposal'] for r in expected.values())
comps.update({r['id']:r for r in read(supplement,'composition-overlays.json')['records']})
gis.update({r['id']:r for r in read(supplement,'gi-overlays.json')['records']})
cases=[json.loads(x) for x in (supplement/'cases.jsonl').read_text(encoding='utf-8').splitlines()]
endpoints=list(csv.DictReader((output/'b-endpoint-checks.csv').open(encoding='utf-8')))
checks=[]
for case in cases:
    assert case['recipeId'] not in numeric,'No duplicate counting'
    numeric.add(case['recipeId'])
    for scenario,source in [('AFCD_MEAL','F006077'),('FINELI_DRY_GROUND_WHOLE_ALMOND','379')]:
        copy=json.loads(json.dumps(case))
        next(r for r in copy['candidateIngredients'] if r['compositionId']=='F006077')['compositionId']=source
        lo,hi,omitted,ok=calculate(copy,comps,gis)
        assert ok and not omitted and lo==hi
        expected_row=next(r for r in endpoints if r['recipeId']==case['recipeId'] and r['scenario']==scenario)
        assert abs(lo-d(expected_row['exactGk']))<Decimal('1e-10')
        checks.append({'recipeId':case['recipeId'],'source':source,'exactGk':str(lo)})
assert len(numeric)==base_numeric+4 and len(checks)==8
print(json.dumps({'status':'PASS','sharedCasesChecked':len(pack['cases']),'sharedNumeric':base_numeric,'newBScenariosChecked':8,'eligiblePilotCandidates':base_numeric,'assumptionResearchCases':len(cases),'assumptionCasesCountedTowardCoverage':False,'publicationAuthorized':False,'endpoints':checks},ensure_ascii=False,indent=2))
