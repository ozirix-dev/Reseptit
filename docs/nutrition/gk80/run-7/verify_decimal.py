"""Independent Decimal verification. Does not import the TypeScript model.

Run from any directory; --output writes a proposed golden file to scratch.
Without --output this checks the checked-in golden data and makes no edits.
"""
from pathlib import Path
from decimal import Decimal, getcontext
import argparse, hashlib, json, sys
getcontext().prec = 40
ROOT = Path(__file__).resolve().parents[4]
DATA = Path(__file__).resolve().parent
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
    bundles=read(DATA/'recipe-bundles.json')['recipes'];ready=held=0
    for b in bundles:
        r=b['recipe'];assert fingerprint({k:v for k,v in b.items() if k!='bundleHash'})==b['bundleHash']
        assert hashlib.sha256((ROOT/r['sourcePath']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==r['sourceSha256']
        assert compute(r,{s['id']:s for s in b['sources']})==b['golden']
        for record in b['sources']+b['comps']:assert fingerprint({k:v for k,v in record.items() if k!='evidenceHash'})==record['evidenceHash']
        cm={c['id']:c for c in b['comps']}
        for s in r['scenarios']:
            for i in s['ingredients']:
                if i.get('certifiedZeroSalt'):continue
                c=cm[i['composition']['sourceId']];assert c['evidenceHash']==i['composition']['evidenceHash'] and c['per100g']==i['per100g']
        m=b['golden']['scenarios'][0]['macros'];p=b['publicationNutrition']
        assert (m['availableCarbohydrate'],m['protein'],m['fat'],m['fibre'])==(p['carbsNetG'],p['proteinG'],p['fatG'],p['fibreG'])
        if b['blocker']:assert b['golden']['scenarios'][0]['wholeGk'] is None;held+=1
        else:assert b['golden']['scenarios'][0]['wholeGk'] is not None;ready+=1
    inventory=read(DATA/'inventory.json');assert len(inventory['assignments'])==len({a['recipeId'] for a in inventory['assignments']})==326
    assert ready==25 and held==2 and inventory['conditionalPotential']==161
    print(json.dumps(dict(status='PASS',ready=ready,held=held,uniqueInventory=326)))
if __name__=='__main__':main()
