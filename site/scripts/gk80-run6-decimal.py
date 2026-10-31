from pathlib import Path
from decimal import Decimal
import json,hashlib,importlib.util
R=Path(__file__).resolve().parents[2];B=R/'docs/nutrition/gk80/run-6'
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
spec=importlib.util.spec_from_file_location('arithmetic',R/'site/scripts/gk80-run2-decimal.py');d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
refs={**{'F'+r['source_id']:r for r in read(R/'docs/nutrition/fineli-release-20-reference.json')['foods']},**{'A'+r['source_id'][1:]:r for r in read(R/'docs/nutrition/afcd-release-3-reference.json')['foods']}}
count=0
for folder in [B,B/'next-eight']:
 recipes=read(folder/'recipes.json')['recipes'];sources={s['id']:s for s in read(folder/'sources.json')['records']};comps={c['id']:c for c in read(folder/'composition-sources.json')['records']};gold=read(folder/'golden.json')['recipes']
 for x in [*sources.values(),*comps.values()]:assert d.fingerprint({k:v for k,v in x.items() if k!='evidenceHash'})==x['evidenceHash'],x['id']
 assert [d.compute(r,sources) for r in recipes]==gold
 for r in recipes:
  actual=hashlib.sha256((R/r['sourcePath']).read_bytes().replace(b'\r\n',b'\n')).hexdigest();assert actual==r['sourceSha256'],r['recipeId']
  if not r['coverageProposalEligible']:assert not r['completeInputScope'];continue
  for i in r['scenarios'][0]['ingredients']:
   if i.get('certifiedZeroSalt'):continue
   c=comps[i['composition']['sourceId']];assert i['composition']['evidenceHash']==c['evidenceHash'];assert i['per100g']==c['per100g']
   fid=c['id'].rsplit('-r',1)[0]
   if fid in refs:
    ref=refs[fid];n=ref.get('per100g',ref);keys=['available_carbohydrate_g_per_100g','protein_g_per_100g','fat_g_per_100g','fibre_g_per_100g'] if fid.startswith('F') else ['available_carbohydrate_without_sugar_alcohols_g_per_100g','protein_g_per_100g','fat_g_per_100g','fibre_g_per_100g'];assert list(c['per100g'].values())==[n[k] for k in keys],c['id']
   elif fid=='N01301':assert c['per100g']==dict(availableCarbohydrate=0,protein=26,fat=24.5,fibre=0)
   elif fid=='erythritol':assert c['per100g']['availableCarbohydrate']==0 and c['sourceRecord']['polyolsValue']==100
   elif fid.startswith('U'):assert 'US_TOTAL_MINUS_FIBRE' in c['sourceRecord']['carbohydrateDefinition']
   # Older eight preserve their previously verified label and composed source IDs.
   elif folder==B:raise AssertionError('Unverified new composition '+c['id'])
   count+=1
 pubs=read(folder/'publication-nutrition.json')['records']
 if folder==B:
  for p in pubs:
   r=next(r for r in recipes if r['recipeId']==p['recipeId']);g=next(g for g in gold if g['recipeId']==r['recipeId'])['scenarios'][0];m=g['macros']
   assert [p['carbsNetG'],p['proteinG'],p['fatG']]==[m['availableCarbohydrate'],m['protein'],m['fat']]
   total=sum(Decimal(str(comps[i['composition']['sourceId']]['sourceRecord']['totalCarbohydratePer100g']))*Decimal(str(i['massG']))/100/Decimal(str(r['servings'])) for i in r['scenarios'][0]['ingredients'] if not i.get('certifiedZeroSalt'));assert abs(float(total)-p['carbsTotalG'])<1e-10
print(json.dumps(dict(status='PASS',newCases=20,numeric=7,nextEight=8,numericCompositionRows=count,arithmetic='Independent Decimal40')))
