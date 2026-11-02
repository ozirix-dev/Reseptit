"""Source-row, native-composition and Decimal checks. No repository writes."""
from pathlib import Path
from decimal import Decimal as D
import json,hashlib,sys,csv
import yaml
here=Path(__file__).resolve().parent;root=Path(sys.argv[1]) if len(sys.argv)>1 else here.parents[3]
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
fi={x['source_id']:x for x in load(root/'docs/nutrition/fineli-release-20-reference.json')['foods']}
af={x['source_id']:x for x in load(root/'docs/nutrition/afcd-release-3-reference.json')['foods']}
for filename in ['pistachio-yogurt-named-version.json','chia-unsweetened-version.json']:
 b=load(here/filename);raw=(root/b['sourcePath']).read_text(encoding='utf-8').replace('\r\n','\n');front=yaml.safe_load(raw.split('---',2)[1])
 assert hashlib.sha256(raw.encode()).hexdigest()==b['sourceLfSha256']
 assert front['servings']==b['servings']
 assert [x['item'] for x in front['ingredients']]==[x['input']['name'] for x in b['rows']]
 assert front['ingredients']==b['sourceIngredients']
 gk=D(0);omitted=D(0);allcho=D(0)
 for source,row in zip(front['ingredients'],b['rows']):
  i=row['input'];f=row['food']
  if f is None:
   assert i['estimatedAvailableCarbohydratePerServingG']==0
   if row['compositionOrigin']=='SOURCE_DECLARED_ZERO_NAMED_PRODUCT':
    assert row['sourceComposition']['euCarbohydrateIncludingPolyolsG']==0
    assert i['recipeQuantity']=={'amount':5,'unit':'ml','massGrams':None}
    assert i['grams'] is None
   elif row['compositionOrigin']=='EXPLICIT_OPTION_NOT_USED':
    assert i['grams']==0 and 'halutessasi' in raw
   else:assert row['compositionOrigin']=='PURE_SALT_DOCUMENTED_ZERO'
   continue
  key=row['sourceId']
  if row['compositionOrigin']=='fineli':
   native=fi[key];assert native==row['nativeSourceRecord'];assert f['per100g']['carbohydrate']==native['per100g']['available_carbohydrate_g_per_100g']
   assert f['per100g']['polyols']==native['per100g']['polyols_g_per_100g']
   if f.get('sourceOriginalName'):
    assert key in ['448','442'] and native['ingredient_class']=='BERRY' and native['process']=='RAW'
    assert f['name'].startswith(native['name']) and f['verifiedEnglishName'] in f['name']
  else:
   assert row['nativeSourceRecord']==af[key] and f['per100g']['polyols'] is None
   assert not f['polyolsSourceVerified']
   assert f['per100g']['carbohydrate']==af[key]['available_carbohydrate_without_sugar_alcohols_g_per_100g']
  if source['unit']=='g':assert source['amount']==i['grams']
  elif source['unit']=='ml':assert D(str(i['grams']))==D(str(source['amount']))/100*D(str(fi[key]['portion_mass_g']['DL']))
  elif source['unit']=='tl':assert source['amount']==1 and row['quantityEvidence']['foodPortion']['gramWeight']==i['grams']==4.2
  cho=D(str(f['per100g']['carbohydrate']))*D(str(i['grams']))/100/D(str(b['servings']));allcho+=cho
  if i['giRecordId']:
   scalar={'dairy-category-mean-gi-35':D('.35'),'fruit-category-mean-gi-51':D('.51'),'nuts-category-mean-gi-22':D('.22')}[i['giRecordId']];gk+=cho*scalar
  else:assert cho<1;omitted+=cho
 assert omitted<2
 assert gk==D(b['expected']['unroundedGk']) and omitted==D(b['expected']['omittedChoG']) and allcho==D(b['expected']['availableChoG'])
 print(json.dumps({'recipeId':b['recipeId'],'rows':len(b['rows']),'decimalGk':str(gk),'omittedChoG':str(omitted),'availableChoG':str(allcho),'published':False}))
own={'lahi-ita-pistaasijogurtti'};other=Path('D:/Projects/tmp/reseptit-afcd-polyol-03-gk80-handoff/docs/research/afcd-polyol-03')
for filename in ['priority77.csv','joint-proposal-index.csv']:
 ids={r.get('recipeId') or r.get('recipe_id') for r in csv.DictReader((other/filename).open(encoding='utf-8-sig'))}
 assert None not in ids and not own.intersection(ids)
 if filename=='priority77.csv':assert 'marjainen-chiavanukas' in ids
print('PASS: own pistachio-yogurt case has no priority77/joint33 overlap; chia is Codex2 source support only, never an own opening.')
