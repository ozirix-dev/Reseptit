"""Read-only feasibility gates, not recipe GK calculation or source admission.
Usage: python evaluate-product-gates.py ROOT DATA_JSON EXTERNAL_OUT
"""
from pathlib import Path
from decimal import Decimal as D
import csv,hashlib,json,re,subprocess,sys
if len(sys.argv)!=4:raise SystemExit(__doc__)
root,data,out=map(Path,sys.argv[1:]);out=out.resolve();parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--show-toplevel'],cwd=parent,capture_output=True).returncode==128,'Output must be outside Git'
pack=json.loads(data.read_text(encoding='utf-8'));assert pack['activation'] is False
sources={s['id']:s for s in pack['sources']};rows=[]
for c in pack['cases']:
 raw=(root/c['recipePath']).read_bytes().decode('utf-8').replace('\r\n','\n')
 assert hashlib.sha256(raw.encode()).hexdigest()==c['recipeLfSha256'],c['recipeId']
 fm=raw.split('---',2)[1]
 found=[tuple(v.strip().strip('\"\'') for v in row) for row in re.findall(r'^  - amount: ([^\n]+)\n    unit: ([^\n]*)\n    item: ([^\n]*)',fm,re.M)]
 found += [tuple(v.strip().strip('\"\'') for v in row) for row in re.findall(r'^  - \{\s*amount:\s*([^,]+),\s*unit:\s*([^,]+),\s*item:\s*([^,}]+)',fm,re.M)]
 assert (c['grams'],'g',c['ingredient']) in found,'Original ingredient mass changed: '+c['recipeId']
 assert re.search(r'^servings: '+str(c['servings'])+r'\s*$',fm,re.M),'Original servings changed'
 s=sources[c['sourceId']];q=D(s['carbohydratePer100g']);g=D(c['grams']);n=D(str(c['servings']))
 assert g>0 and n>0 and D(0)<=q<=D(100)
 if s['kind']=='NATIVE_AVAILABLE_POINT':
  original=json.loads((root/s['nativePath']).read_text())['foods'];native=next(x for x in original if x['source_id']==s['nativeId'])
  assert D(str(native[s['nativeField']]))==q
  assert hashlib.sha256((root/s['nativePath']).read_bytes()).hexdigest()==s['nativeFileSha256']
 else:
  assert s['kind']=='DECLARED_SOURCE_MODEL_UPPER';assert s['basisAmount']==100 and s['basisUnit']=='g'
  assert s['polyolsState']=='UNKNOWN_NOT_INFERRED_ZERO';assert re.fullmatch('[0-9a-f]{64}',s['documentSha256'])
 portion=g*q/D(100)/n;strict=portion<D(1)
 status='HOLD_PRODUCT_BASIS_UNRESOLVED' if not s.get('recipeBasisResolved',True) else ('NATIVE_POINT_EXCEEDS_MINOR_OMISSION_LIMIT' if s['kind']=='NATIVE_AVAILABLE_POINT' else 'SOURCE_MODEL_CANNOT_PROVE_A_MINOR_OMISSION') if not strict else 'ONLY_SINGLE_INGREDIENT_GATE_PASS_NOT_WHOLE_RECIPE'
 rows.append({'recipeId':c['recipeId'],'ingredient':c['ingredient'],'sourceId':s['id'],'valueKind':s['kind'],'gramsOriginal':str(g),'servingsOriginal':str(n),'pointOrLabelScenarioChoPerServing':str(portion),'singleIngredientStrictlyBelow1g':strict,'status':status,'newNumericGkResult':False,'published':False})
ids={x['recipeId'] for x in rows};assert len(ids)==4 and len(rows)==5
assert all(x['newNumericGkResult'] is False for x in rows)
out.mkdir(parents=True,exist_ok=True)
with (out/'product-gate-results.csv').open('w',encoding='utf-8',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
summary={'distinctRecipes':len(ids),'sourceRecords':len(sources),'comparisons':len(rows),'newSourceQualifiedNumericGkResults':0,'newPublishedResults':0,'labelValueIsNotActualAvailableCho':True,'noPolyolZeroInferred':True,'recipeQuantitiesChanged':False,'activation':False}
(out/'product-gate-summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'summary':summary,'results':rows},ensure_ascii=False,indent=2))
