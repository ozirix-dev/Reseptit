"""Independent Decimal audit. ROOT DATA_DIR EXTERNAL_OUT; no repository writes."""
from pathlib import Path
from decimal import Decimal as D, ROUND_HALF_UP
import csv,json,hashlib,sys,subprocess
root,data,out=map(lambda x:Path(x).resolve(),sys.argv[1:4]);parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True).returncode!=0,'External output required'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def h(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def save(name,d):
 out.mkdir(parents=True,exist_ok=True);(out/name).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
s=read(data/'sources.json');pack=read(data/'cases.json');cs={x['id']:x for x in s['composition']};gs={x['id']:x for x in s['giBindings']}
for p,digest in s['sourceFilesLfSha256'].items():assert h(root/p)==digest,p
results=[]
for c in pack['cases']:
 body={k:v for k,v in c.items() if k!='inputSha256'};assert hashlib.sha256(json.dumps(body,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==c['inputSha256']
 for loc,p in c['paths'].items():assert h(root/p)==c['recipeSha256Lf'][loc],p
 # Preserve original grams and count. New vanilla5g is explicit, not tsp density inference.
 orig=c['originalIngredients'];assert c['servings']==8 and orig[0]['amount']==150 and orig[1]['amount']==75 and orig[3]['amount']==300
 assert orig[2]['amount']+orig[4]['amount']==3 and cs['858']['portionMasses']['KPL_M']==55
 assert orig[5]['amount']==1 and orig[5]['unit']=='dl' and cs['631']['portionMasses']['DL']==100
 assert orig[6]['amount']==2 and orig[6]['unit']=='rkl' and 'WEIGHED_VANILLA5G_NEW_VERSION' in c['requiredDecisions']
 point=D(0);omitted=D(0);rows=[]
 for i in c['candidateIngredients']:
  src=cs[i['compositionId']];cap=i['carbohydrateUse']=='UPPER_BOUND';v=D(str(src['availableUpperPer100g'] if cap else src['availablePer100g']));cho=D(str(i['grams']))*v/D(100)/D(c['servings']);g=gs.get(i['giId']);term=None
  if g:
   assert not cap and src['id'] in g['allowedCompositionIds'];term=cho*D(str(g['value']))/D(100);point+=term
  else:assert cho<D(1),'Individual ingredient cap';omitted+=cho
  rows.append({'compositionId':src['id'],'choPerServing':str(cho),'gkContribution':None if term is None else str(term),'isUpper':cap,'unknownGiOmitted':g is None and cho>0})
 assert omitted<D(2) and point==D('.44625') and omitted==D('1.736875')
 engine=next(x for x in read(out/'engine-results.json')['results'] if x['recipeId']==c['recipeId']);assert abs(D(str(engine['unrounded']))-point)<D('1e-12') and D(str(engine['point']))==point.quantize(D('.01'),rounding=ROUND_HALF_UP) and abs(D(str(engine['omittedCho']))-omitted)<D('1e-12')
 results.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'point':str(point),'rounded':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted),'almondIndividualMarginTo1g':str(D(1)-D('.975')),'almondPointMustStayStrictlyBelowPer100g':str(D(100)*D(8)/D(150)),'ownerApproval':False,'publicationAuthorized':False,'rows':rows})
save('decimal-results.json',{'activation':False,'results':results})
gates=[]
for c in read(data/'family-gates.json')['cases']:
 assert h(root/c['sourcePath'])==c['sourceSha256Lf'];ch=D(str(c['almondGrams']))*D('5.2')/D(100)/D(c['servings']);old=D(str(c['almondGrams']))*D('5.4')/D(100)/D(c['servings'])
 gates.append({'recipeId':c['recipeId'],'almondGrams':c['almondGrams'],'servings':c['servings'],'mext05001AlmondChoPerServing':str(ch),'afcdF006077AlmondChoPerServing':str(old),'newVersionSingleIngredientPass':ch<D(1),'wholeRecipeCandidatePrepared':c['wholeRecipeCandidatePrepared'],'coverageGainFromThisGateAlone':0})
assert sum(x['newVersionSingleIngredientPass'] for x in gates)==1
with (out/'family-gate-results.csv').open('w',encoding='utf8',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(gates[0]));w.writeheader();w.writerows(gates)
print(json.dumps({'Decimal':'PASS','newReviewableArithmeticCandidates':len(results),'point':results[0]['rounded'],'omittedCho':results[0]['omittedCho'],'familyRecipes':len(gates),'singleIngredientPasses':1,'wholeSourceFamilyCoverageNotAssumed':True}))
