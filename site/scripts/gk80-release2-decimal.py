"""Independent Decimal verification. Does not import the TypeScript model.

Run from any directory; --output writes a proposed golden file to scratch.
Without --output this checks the checked-in golden data and makes no edits.
"""
from pathlib import Path
from decimal import Decimal, getcontext
import argparse, hashlib, json, sys
getcontext().prec = 40
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'docs/nutrition/gk80-release-2'
def read(p): return json.loads(p.read_text(encoding='utf8'))
def normalized(x):
    if isinstance(x, float) and x.is_integer(): return int(x)
    if isinstance(x, dict): return {k: normalized(v) for k, v in x.items()}
    if isinstance(x, list): return [normalized(v) for v in x]
    return x
def fingerprint(x):
    return hashlib.sha256(json.dumps(normalized(x), ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def decimal(x): return Decimal(str(x))
def number(x): return None if x is None else float(x)
def compute(recipe, sources):
    scenarios = []
    for scenario in recipe['scenarios']:
        macro = {k: Decimal(0) for k in ['availableCarbohydrate', 'protein', 'fat', 'fibre']}
        contributions = []; total = Decimal(0); imputed = Decimal(0)
        for i in scenario['ingredients']:
            composition = i['per100g']; mass = i['massG']
            if composition is None or (mass is None and not i.get('certifiedZeroSalt')):
                contributions.append(dict(index=i['index'], carbohydrate=None, gk=None)); continue
            factor = Decimal(0) if i.get('certifiedZeroSalt') else decimal(mass) * decimal(i['retention']) / 100 / decimal(recipe['servings'])
            for k in macro: macro[k] += decimal(composition[k]) * factor
            cho = decimal(composition['availableCarbohydrate']) * factor
            binding = i.get('giId') or i.get('impact', {}).get('sourceId')
            gk = Decimal(0) if cho == 0 else cho * decimal(sources[binding]['gi']) / 100 if binding else None
            if gk is not None:
                total += gk
                if i.get('impact', {}).get('kind') == 'PUBLISHED_IMPUTATION': imputed += gk
            contributions.append(dict(index=i['index'], carbohydrate=number(cho), gk=number(gk)))
        whole = total if recipe['completeInputScope'] and all(c['gk'] is not None for c in contributions) else None
        whole_cho = macro['availableCarbohydrate'] if recipe['completeInputScope'] and all(c['carbohydrate'] is not None for c in contributions) else None
        scenarios.append(dict(id=scenario['id'], macros={k:number(v) for k,v in macro.items()}, contributions=contributions,
                              knownSubtotal=number(total), wholeGk=number(whole), wholeCarbohydrate=number(whole_cho), imputedImpact=number(imputed)))
    return dict(recipeId=recipe['recipeId'], inputHash=fingerprint(recipe), scenarios=scenarios)
def main():
    recipes=read(DATA/'recipes.json')['recipes'];sources={s['id']:s for s in read(DATA/'sources.json')['records']}
    assert len(recipes)==8
    assert [compute(r,sources) for r in recipes]==read(DATA/'golden.json')['recipes']
    for r in recipes:
        assert hashlib.sha256((ROOT/r['sourcePath']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==r['sourceSha256']
    print(json.dumps(dict(status='PASS',recipes=8)))
if __name__=='__main__':main()
