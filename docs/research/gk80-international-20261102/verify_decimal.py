"""Read-only arithmetic/receipt check; no network, build, or repository mutation."""
from pathlib import Path
from decimal import Decimal as D
import json, csv
p = Path(__file__).resolve().parent
b = json.loads((p / 'granola-conditional-input.json').read_text(encoding='utf-8'))
m = json.loads((p / 'mechanical-result.json').read_text(encoding='utf-8'))
rows = b['sourceRowsAndInputs']
assert len(rows) == b['originalIngredientsCount'] == 8
carbs = {}
for row in rows:
    i, record = row['input'], row['sourceRecord']
    native = row.get('nativeAvailableCarbohydrateEvidence')
    c = native['available_carbohydrate_without_sugar_alcohols_g_per_100g'] if native else record['per100g']['carbohydrate']
    assert c is not None and i['grams'] is not None
    carbs[i['name']] = D(str(c)) * D(str(i['grams'])) / 100 / 4
    if native:
        assert row['polyolsZeroClaimPermitted'] is False
omitted_before = sum(c for k,c in carbs.items() if k not in ['maustamatonta kreikkalaista jogurttia','vadelmia'])
omitted_after = omitted_before - carbs['kanelia']
gk = carbs['maustamatonta kreikkalaista jogurttia'] * D('.35') + carbs['vadelmia'] * D('.51') + carbs['kanelia'] * D('.50')
assert omitted_before == D('2.06375') and omitted_after == D('1.885')
assert omitted_before >= 2 and omitted_after < 2
assert all(c < 1 for k,c in carbs.items() if k not in ['maustamatonta kreikkalaista jogurttia','vadelmia','kanelia'])
assert carbs['kanelia'] == D('0.17875') <= D('.5')
assert sum(carbs.values()) == D('8.08875') and gk == D('2.474125')
assert abs(D(str(m['after']['unroundedGk']))-gk) < D('0.000000001')
assert not m['sourceEligible'] and not m['publicationApproved']
screen = list(csv.DictReader((p/'recipe-screen.csv').open(encoding='utf-8')))
assert len(screen) == len({r['recipeId'] for r in screen}) == 33
impact = json.loads((p/'impact-summary.json').read_text(encoding='utf-8'))
assert impact['newImmediatelySourceEligibleNumericRecipes'] == 0
assert impact['newPublishedNumericRecipes'] == 0 and impact['remainingPublishedGap'] == 105
print('PASS: 33 unique screened recipes; 8 complete granola rows; Decimal agrees with model; 0 approved/published unlocks; 1 conditional prototype.')
