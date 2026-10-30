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
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path);args=parser.parse_args()
    recipes=read(DATA/'recipes.json')['recipes'];sources={s['id']:s for s in read(DATA/'sources.json')['records']}
    compositions={s['id']:s for s in read(DATA/'composition-sources.json')['records']}
    for s in [*sources.values(),*compositions.values()]:
        assert fingerprint({k:v for k,v in s.items() if k!='evidenceHash'})==s['evidenceHash'],s['id']
    n=verify_numeric_composition(recipes,compositions)
    result={'arithmetic':'Python Decimal, precision 40; all four macros and every ingredient; no TypeScript imports',
            'numericCompositionRowsVerifiedAgainstFrozenReferences':n,'recipes':[compute(r,sources) for r in recipes]}
    if args.output:
        target=args.output.resolve()
        assert not target.is_relative_to(ROOT), 'Prepare in scratch, then use repo_guard write.'
        target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    else: assert result==read(DATA/'golden.json'), 'Independent Decimal output differs from golden.json'
    print(json.dumps({'verifiedRecipes':len(recipes),'numericProposals':sum(r['coverageProposalEligible'] for r in recipes),
                      'numericCompositionRows':n,'status':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
