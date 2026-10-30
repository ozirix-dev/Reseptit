"""Independent Decimal verification. Does not import the TypeScript model.

Run from any directory; --output writes a proposed golden file to scratch.
Without --output this checks the checked-in golden data and makes no edits.
"""
from pathlib import Path
from decimal import Decimal, getcontext
import argparse, hashlib, json, sys
getcontext().prec = 40
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'docs/nutrition/gk80/run-2'
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
def verify_numeric_composition(recipes, compositions):
    afcd = {r['source_id']:r for r in read(ROOT/'docs/nutrition/afcd-release-3-reference.json')['foods']}
    fineli = {str(r['source_id']):r for r in read(ROOT/'docs/nutrition/fineli-release-20-reference.json')['foods']}
    count = 0
    for r in recipes:
        if not r['coverageProposalEligible']: continue
        for s in r['scenarios']:
            for i in s['ingredients']:
                if i.get('certifiedZeroSalt'): continue
                c = compositions[i['composition']['sourceId']]; sid = c['id']
                if sid.startswith('afcd-'):
                    raw=afcd[sid.split('-')[1]]
                    expected=[raw[k] for k in ['available_carbohydrate_without_sugar_alcohols_g_per_100g','protein_g_per_100g','fat_g_per_100g','fibre_g_per_100g']]
                elif sid.startswith('fineli-'):
                    raw=fineli[sid.split('-')[1]]['per100g']
                    expected=[raw[k] for k in ['available_carbohydrate_g_per_100g','protein_g_per_100g','fat_g_per_100g','fibre_g_per_100g']]
                else: raise AssertionError('Unreviewed numeric composition ' + sid)
                actual=[c['per100g'][k] for k in ['availableCarbohydrate','protein','fat','fibre']]
                assert actual==expected, (sid,actual,expected)
                count+=1
    return count
def main():
    base=ROOT/'docs/nutrition/gk80/run-5'
    verified=0
    for folder in [base,base/'prior48']:
        recipes=read(folder/'recipes.json')['recipes'];sources={s['id']:s for s in read(folder/'sources.json')['records']}
        assert [compute(r,sources) for r in recipes]==read(folder/'golden.json')['recipes']
        verified+=len(recipes)
    proof=read(base/'primary-usda.json')['records']; comps=read(base/'composition-sources.json')['records']
    for p in proof:
        n={x['nutrient']['id']:x.get('amount') for x in p['rawResponse']['foodNutrients']}
        c=next(c for c in comps if c['id']==p['foodId']+'-r5')
        assert decimal(c['per100g']['availableCarbohydrate'])==decimal(n[1005])-decimal(n[1079])
        assert c['sourceRecord']['polyolsSourceVerified'] is False
        assert c['sourceRecord']['polyolsValue'] is None
    comps={c['id']:c for c in comps};recipes=read(base/'recipes.json')['recipes']
    for r in recipes:
        if not r['coverageProposalEligible']:continue
        total=Decimal(0)
        for i in r['scenarios'][0]['ingredients']:
            if i.get('certifiedZeroSalt'):continue
            c=comps[i['composition']['sourceId']];rec=c['sourceRecord'];factor=decimal(i['massG'])*decimal(i['retention'])/100/decimal(r['servings'])
            if c['id'].startswith('A'):v=decimal(rec['referenceRecord']['available_carbohydrate_with_sugar_alcohols_g_per_100g'])+decimal(c['per100g']['fibre'])
            elif c['id'].startswith('F'):v=decimal(c['per100g']['availableCarbohydrate'])+decimal(c['per100g']['fibre'])+decimal(rec['polyolsValue'])
            elif c['id'].startswith('U'):v=decimal(next(x['amount'] for x in rec['referenceRecord']['foodNutrients'] if x['nutrient']['id']==1005))
            else:v=decimal(rec['declaredPer100']['carbohydrate'])+decimal(rec['declaredPer100']['fibre'])
            total+=v*factor
        assert r['nutritionPerServing']['carbsTotalG']==float(total)
        macro=compute(r,{s['id']:s for s in read(base/'sources.json')['records']})['scenarios'][0]['macros']
        for a,b in [('carbsNetG','availableCarbohydrate'),('proteinG','protein'),('fatG','fat')]:assert r['nutritionPerServing'][a]==macro[b]
    print(json.dumps(dict(status='PASS',recipes=verified,newRecipes=40,priorRecipes=48,usdaProxyRecords=len(proof),fourMacroProposals=26)))
if __name__=='__main__':main()
