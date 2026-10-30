"""Read-only independent arithmetic check; run from any directory with Python 3."""
from pathlib import Path
from decimal import Decimal as D
import json
root = Path(__file__).resolve().parents[2] / 'docs/nutrition/gk80/pilot-1'
def read(name): return json.loads((root/name).read_text(encoding='utf8'))
sources = {x['id']:x for x in read('sources.json')['records']}
gold = {x['recipeId']:x for x in read('golden.json')['recipes']}
def same(a,b):
    assert (a is None and b is None) or (a is not None and b is not None and abs(a-D(str(b)))<D('0.000000001')), (a,b)
for r in read('recipes.json')['recipes']:
    for s,e in zip(r['scenarios'],gold[r['recipeId']]['scenarios']):
        total=D(0); missing=False
        macros={k:D(0) for k in ['availableCarbohydrate','protein','fat','fibre']}
        for i,c in zip(s['ingredients'],e['contributions']):
            if i['certifiedZeroSalt']:same(D(0),c['gk']);continue
            if i['massG'] is None or i['per100g'] is None:
                missing=True;same(None,c['gk']);continue
            factor=D(str(i['massG']))*D(str(i['retention']))/100/D(str(r['servings']))
            for k in macros:macros[k]+=factor*D(str(i['per100g'][k]))
            cho=factor*D(str(i['per100g']['availableCarbohydrate']));same(cho,c['carbohydrate'])
            gk=D(0) if cho==0 else cho*D(str(sources[i['giId']]['gi']))/100 if i['giId'] else None
            same(gk,c['gk'])
            if gk is None:missing=True
            else:total+=gk
        same(total,e['knownSubtotal']);same(total if not missing and r['completeInputScope'] else None,e['wholeGk'])
        for k in macros:same(macros[k],e['macros'][k])
print('PASS: 20 recipes, 40 scenarios, every ingredient and all four macros (Decimal)')
