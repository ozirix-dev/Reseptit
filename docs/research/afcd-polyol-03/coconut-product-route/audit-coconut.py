"""Independent Decimal; ROOT DATA CACHE EXTERNAL_OUT, outside Git only."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP
import json,csv,hashlib,sys,subprocess
root,data,cache,out=map(lambda x:Path(x).resolve(),sys.argv[1:5]);par=out
while not par.exists():par=par.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=par,capture_output=True).returncode!=0
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
s=read(data/'sources.json');pack=read(data/'cases.json');values={c['id']:c['availablePer100g'] for c in s['composition']};ext={a['id']:a for a in s['externalObservations']}
for p,h in s['sourceFilesLfSha256'].items():assert hashlib.sha256((root/p).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==h
rows=[]
for c in pack['cases']:
 body={k:v for k,v in c.items() if k!='inputSha256'};assert hashlib.sha256(json.dumps(body,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==c['inputSha256']
 assert not c['sourceQualified'] and len(c['ingredients'])==len(c['originalIngredients'])==11 and c['servings']==4
 point=D(0);omitted=D(0);upper=D(0);terms=[]
 for i in c['ingredients']:
  orig=c['originalIngredients'][i['originalIndex']];assert orig['unit']=='g' and orig['amount']==i['grams']
  v=values.get(i['sourceId']);isupper=v is None
  if isupper:
   a=ext[i['sourceId']];assert a['basis'].startswith('per100g');v=a.get('totalCarbohydrate',a.get('declaredCarbohydrate'))
  cho=D(str(i['grams']))*D(str(v))/D(100)/D(c['servings'])
  if i['giId']:assert not isupper and i['sourceId'] in s['giBinding']['allowedCompositionIds'];point+=cho*D(40)/D(100)
  else:assert cho<D(1);omitted+=cho;upper+=cho if isupper else D(0)
  terms.append({'sourceId':i['sourceId'],'choPerServing':str(cho),'isNominalUpper':isupper,'gi':40 if i['giId'] else None})
 assert point==D('2.375') and omitted==D('1.66655') and omitted<D(2)
 engine=read(out/'engine-results.json')['results'][0];assert abs(D(str(engine['unrounded']))-point)<D('1e-12') and abs(D(str(engine['omittedCho']))-omitted)<D('1e-12')
 rows.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'conditionalCalculatedPart':str(point),'rounded':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted),'nominalUpperOmittedCho':str(upper),'remainingAggregateMargin':str(D(2)-omitted),'sourceQualified':False,'publicationAuthorized':False,'terms':terms})
gates=list(csv.DictReader((data/'source-gates.csv').open(encoding='utf8',newline='')));assert len(gates)==28 and len({x['recipeId'] for x in gates})==28
for c in gates:
 assert hashlib.sha256((root/c['sourcePath']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==c['sourceSha256Lf']
 if c['unit']=='g':assert D(c['nominalCoconutUpperChoPerServing'])==D(c['amount'])*D('.8')/D(100)/D(c['servings'])
 else:assert c['nominalCoconutUpperChoPerServing']=='' and c['basisMatches']=='False'
assert sum(x['coconutIndividualGatePass']=='True' for x in gates)==7
assert ext['THAI_KAFFIR_N35_TOTAL']['availablePoint'] is None and ext['THAI_KAFFIR_N35_TOTAL']['fibre'] is None
out.mkdir(parents=True,exist_ok=True);(out/'decimal-results.json').write_text(json.dumps({'activation':False,'results':rows,'familyRows':28,'compatibleIndividualGates':7,'volumeBasisHolds':21,'newSourceQualifiedNumeric':0},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'Decimal':'PASS','conditionalPoint':rows[0]['rounded'],'omittedCho':rows[0]['omittedCho'],'familyGates':28,'newSourceQualifiedNumeric':0}))
