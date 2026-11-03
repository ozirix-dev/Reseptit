"""Read-only source-row and independent decimal checks; no publication writes."""
import json,sys,hashlib
from decimal import Decimal as D
from pathlib import Path
import yaml
folder=Path(__file__).resolve().parent
root=Path(sys.argv[1]) if len(sys.argv)>1 else folder.parents[3]
af={x['source_id']:x for x in json.loads((root/'docs/nutrition/afcd-release-3-reference.json').read_text(encoding='utf-8'))['foods']}
fi={x['source_id']:x for x in json.loads((root/'docs/nutrition/fineli-release-20-reference.json').read_text(encoding='utf-8'))['foods']}
for filename in ['granola-source-resolved.json','pellava-conditional-version.json']:
 b=json.loads((folder/filename).read_text(encoding='utf-8'))
 raw=(root/b['sourcePath']).read_text(encoding='utf-8').replace('\r\n','\n')
 assert hashlib.sha256(raw.encode()).hexdigest()==b['sourceLfSha256']
 front=yaml.safe_load(raw.split('---',2)[1]); assert front['servings']==b['servings']==4
 assert len(front['ingredients'])==len(b['rows'])==8
 assert [x['item'] for x in front['ingredients']]==[r['input']['name'] for r in b['rows']]
 servings=D(str(b['servings'])); gk=D(0); omitted=D(0); allcho=D(0)
 for source_row,r in zip(front['ingredients'],b['rows']):
  i=r['input']; f=r['food']; name=i['name']
  if source_row['unit']=='g': assert D(str(source_row['amount']))==D(str(i['grams']))
  if source_row['unit']=='ml':
   assert r['compositionOrigin']=='fineli'
   assert D(str(i['grams']))==D(str(source_row['amount']))/100*D(str(fi[r['sourceId']]['portion_mass_g']['DL']))
  if name=='kanelia':
   assert source_row['unit']=='tl' and source_row['amount']==1
   assert D(str(i['grams']))==D('0.51')*D('5')
  if not f:
   if 'availableCarbohydrateUpperBoundPerServingG' in i:
    cho=D(str(i['availableCarbohydrateUpperBoundPerServingG'])); assert cho==D(18)*D(20)/100/4
    omitted+=cho; allcho+=cho
   else:
    assert name=='suolaa' and i['estimatedAvailableCarbohydratePerServingG']==0
   continue
  if r['compositionOrigin']=='afcd':
   assert r['nativeSourceRecord']==af[r['sourceId']]
   assert f['per100g']['carbohydrate']==af[r['sourceId']]['available_carbohydrate_without_sugar_alcohols_g_per_100g']
   assert f['per100g']['polyols'] is None and not f['polyolsSourceVerified']
  elif r['compositionOrigin']=='fineli':
   assert r['nativeSourceRecord']==fi[r['sourceId']]
   assert f['per100g']['carbohydrate']==fi[r['sourceId']]['per100g']['available_carbohydrate_g_per_100g']
  cho=D(str(f['per100g']['carbohydrate']))*D(str(i['grams']))/100/servings; allcho+=cho
  if name=='kanelia':
   assert cho==D('0.1753125') and cho<=D('0.5'); gk+=cho*D('0.5')
  elif i['giRecordId']=='dairy-category-mean-gi-35': gk+=cho*D('0.35')
  elif i['giRecordId']=='fruit-category-mean-gi-51': gk+=cho*D('0.51')
  else: assert cho<D(1); omitted+=cho
 assert omitted<D(2)
 assert gk==D(b['expected']['unroundedGk'])
 assert omitted==D(b['expected'].get('omittedChoG',b['expected'].get('omittedChoUpperG')))
 if filename.startswith('granola'): assert allcho==D(b['expected']['allAvailableChoG'])
 print(json.dumps({'id':b['recipeId'],'decimalGk':str(gk),'omittedChoOrUpperG':str(omitted),'sourceRows':8,'publicationApproved':False}))
