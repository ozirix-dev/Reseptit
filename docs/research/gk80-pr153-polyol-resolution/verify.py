"""Read-only scope, source-hash and independent one-case Decimal verification."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP,getcontext
import json,hashlib,re
getcontext().prec=40
F=Path(__file__).resolve().parent;R=F.parents[2]
load=lambda p:json.loads(p.read_text(encoding='utf8'))
a=load(F/'analysis.json');assert len(a['recipes'])==len({r['recipeId'] for r in a['recipes']})==20
assert len(a['sources'])==len({r['foodId'] for r in a['sources']})==41
assert sum(bool(s['replacementProposal']) for s in a['sources'])==14
assert all(r['currentPublicationDecision']=='HOLD' and not r['releaseEligibleNow'] and not r['proposedSourcesAppliedToRuntime'] for r in a['recipes'])
assert [r['recipeId'] for r in a['recipes'] if r['analysisDecision']=='CONDITIONAL_METHOD_PROPOSAL']==['uunikanapasta-kesakurpitsa']
for path,expected in a['inputFileSha256LfNormalized'].items():
 assert hashlib.sha256((R/path).read_text(encoding='utf8').encode()).hexdigest()==expected,path
recipes=load(R/'docs/nutrition/gk80-release-8/recipes.json')['recipes'];comps={c['id']:c for c in load(R/'docs/nutrition/gk80-release-8/composition-sources.json')['records']};gis={g['id']:D(str(g['gi'])) for g in load(R/'docs/nutrition/gk80-release-8/sources.json')['records']}
for row in a['recipes']:
 assert hashlib.sha256((R/row['sourcePath']).read_text(encoding='utf8').encode()).hexdigest()==row['sourceSha256'],row['recipeId']
source={s['foodId']:s for s in a['sources']};r=next(r for r in recipes if r['recipeId']=='uunikanapasta-kesakurpitsa');assert len(r['scenarios'])==1
macro={k:D(0) for k in ['availableCarbohydrate','protein','fat','fibre']};pmin=D(0);pmax=D(0);gk=D(0);unresolved=[]
for i in r['scenarios'][0]['ingredients']:
 if i.get('certifiedZeroSalt'):continue
 c=comps[i['composition']['sourceId']];rec=c['sourceRecord'];aid=rec.get('primaryVerification',{}).get('foodId');match=re.search(r'F\d{6}',rec.get('id',''));aid=aid or (match.group(0) if match else None)
 alt=source[aid]['replacementProposal'] if aid else None;v=alt['per100g'] if alt else i['per100g'];f=D(str(i['massG']))*D(str(i['retention']))/100/r['servings']
 if alt:p=D(str(v['polyols']));extra=D(0)
 elif aid:
  s=source[aid]['currentSource'];p=max(D(str(s['sourceWith']))-D(str(s['sourceWithout'])),sum((D(str(x)) for x in s['species'].values() if x is not None),D(0)));extra=D(100)-sum((D(str(v[k])) for k in macro),D(0))-p;unresolved.append(aid)
 else:p=D(str(rec['per100g']['polyols']));extra=D(0)
 for k in macro:macro[k]+=D(str(v[k]))*f
 pmin+=p*f;pmax+=(p+extra)*f
 available=D(str(v['availableCarbohydrate']))*f
 if available:gk+=available*gis[i.get('giId') or i['impact']['sourceId']]/100
assert unresolved==['F006618'];assert pmax-pmin==D('.028');assert (pmax-pmin)*D('1.5')==D('.042')
assert gk==D('2.737675');assert gk+(pmax-pmin)*D('1.5')==D('2.779675')
lowTotal=macro['availableCarbohydrate']+macro['fibre']+pmin;highTotal=macro['availableCarbohydrate']+macro['fibre']+pmax
assert lowTotal==D('10.380250') and highTotal==D('10.408250')
assert lowTotal.quantize(D(1),rounding=ROUND_HALF_UP)==highTotal.quantize(D(1),rounding=ROUND_HALF_UP)==10
assert lowTotal.quantize(D('.01'),rounding=ROUND_HALF_UP)!=highTotal.quantize(D('.01'),rounding=ROUND_HALF_UP)
assert gk.quantize(D(1),rounding=ROUND_HALF_UP)==(gk+D('.042')).quantize(D(1),rounding=ROUND_HALF_UP)==3
assert gk+D('.042')<10 and D('.042')<=D('.10')
claimed=next(row for row in a['recipes'] if row['recipeId']==r['recipeId'])['scenarios'][0]
assert {k:D(v) for k,v in claimed['conditionalFixedSourceMacros'].items()}==macro
assert [D(x) for x in claimed['gkScenario']]==[gk,gk+D('.042')]
assert [D(x) for x in claimed['totalChoScenarioG']]==[lowTotal,highTotal]
print(json.dumps({'status':'PASS','recipes':20,'sourceFamilies':41,'replacementOptions':14,'conditionalCase':'uunikanapasta-kesakurpitsa','newCaseApplied':False,'releaseEligibleNow':0,'width':'.042','totalChoTwoDecimalDisplayStable':False,'integerDisplayStable':True}))
