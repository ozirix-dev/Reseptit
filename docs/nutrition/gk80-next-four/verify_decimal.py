"""Read-only independent Decimal replay of the four admitted A inputs; no mass inference."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import json

HERE = Path(__file__).resolve().parent
def read(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))

pack = read('cases.json')
catalogs = read('sources.json')['contexts']
expected = read('integration.json')['expectedResults']
results = []
for case in pack['cases']:
    context = catalogs[pack['caseContexts'][case['recipeId']]]
    comps = {r['id']: r for r in context['composition']}
    gis = {r['id']: r for r in context['giBindings']}
    point, omitted, covered = D(0), D(0), D(0)
    terms = []
    for item in case['candidateIngredients']:
        src = comps[item['compositionId']]
        if src['kind'] in ['PHYSICAL_MASS_CAP', 'PHYSICAL_MASS_UPPER']:
            value = D(100)
        elif src['kind'] in ['LABEL_UPPER_PER100ML', 'LABEL_UPPER_PER100G']:
            value = D(str(src['declaredCarbohydrate']))
        else:
            value = D(str(src['availablePer100g']))
        if 'millilitres' in item:
            assert 'grams' not in item and src['kind'] == 'LABEL_UPPER_PER100ML'
            amount, unit = D(str(item['millilitres'])), 'ml'
        else:
            assert src['kind'] != 'LABEL_UPPER_PER100ML'
            amount, unit = D(str(item['grams'])), 'g'
        cho = amount * value / D(100) / D(case['servings'])
        gi = gis.get(item['giId'])
        if gi:
            assert item['carbohydrateUse'] == 'AVAILABLE_POINT'
            assert item['compositionId'] in gi['allowedCompositionIds']
            values = gi.get('values', [gi.get('value')])
            assert len(values) == 1
            point += cho * D(str(values[0])) / D(100)
            covered += cho
        elif cho > 0:
            assert cho < D(1)
            omitted += cho
        terms.append({'sourceId': src['id'], 'amountUnit': unit, 'choPerServing': str(cho)})
    assert omitted < D(2)
    want = expected[case['recipeId']]
    assert point == D(str(want['unrounded']))
    assert omitted == D(str(want['omittedCho']))
    assert point.quantize(D('.01'), rounding=ROUND_HALF_UP) == D(str(want['point']))
    if case['recipeId'] == 'kaakao-kookos-chia':
        assert covered == D('.725') and omitted == D('.9625') and omitted > covered
        assert next(t for t in terms if t['sourceId'] == 'koko-uk-unsweetened-cap')['amountUnit'] == 'ml'
    results.append({'recipeId': case['recipeId'], 'point': str(point.quantize(D('.01'), rounding=ROUND_HALF_UP)), 'unrounded': str(point), 'omittedCho': str(omitted), 'coveredCho': str(covered), 'terms': terms})
assert len(results) == 4
print(json.dumps({'status': 'PASS', 'checked': 4, 'writes': 0, 'results': results}))
