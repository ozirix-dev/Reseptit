"""Independent one-case Decimal reproduction of the installed recovery evidence."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP
import json,hashlib
F=Path(__file__).resolve().parent;R=F.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf8'))
e=read(R/'docs/nutrition/calculations/uunikanapasta-kesakurpitsa.json');c=e['recoveryC']['reviewedCase'];p=c['pilot'];q=e['recoveryC']['displayProposal']
def norm(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,list):return [norm(v) for v in x]
 if isinstance(x,dict):return {k:norm(v) for k,v in x.items()}
 return x
def fp(x):return hashlib.sha256(json.dumps(norm(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert fp(e)=='b3c8d086f15b997937000cf4f42175a122f3f7cf2fd99c61d2783e2dc59668d7'
assert fp(c)==q['baseCaseFingerprint']
assert fp({k:v for k,v in q.items() if k!='proposalFingerprintSha256'})==q['proposalFingerprintSha256']=='e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07'
keys=['availableCarbohydrate','protein','fat','fibre'];sums={k:D(0) for k in keys};ordinary=D(0);extra=D(0);known=D(0)
for i in p['ingredients']:
 factor=D(0) if i.get('certifiedZeroSalt') else D(i['massG'])*D(i['retention'])/100/4
 for k in keys:sums[k]+=D(i['macroPer100g'][k])*factor
 a=D(i['macroPer100g']['availableCarbohydrate'])*factor
 if a:ordinary+=a*D(i['gi'])/100
 known+=D(i['knownPartialPolyolPer100g'])*factor
 if i['unknownAggregate']:
  assert i['index']==8 and i['aggregatePolyolPer100g'] is None
  extra+=(100-sum((D(i['macroPer100g'][k]) for k in keys),D(0))-D(i['knownPartialPolyolPer100g']))*factor
assert extra==D('.028') and ordinary==D('2.737675')
rows=[]
for mult in [D(0),D('.5'),D(1)]:
 md=D(0);ad=D(0);ps=D(0)
 for idx in [6,7]:
  i=p['ingredients'][idx];factor=D(i['massG'])/400;md+=D('.1')*mult*factor;ad+=D('.1')*mult*factor*D(i['gi'])/100;ps+=mult*factor
 total=sums['availableCarbohydrate']+sums['fibre']+known
 intervals={'carbsNetG':[sums['availableCarbohydrate']-md,sums['availableCarbohydrate']+md],'carbsTotalG':[total-2*md,total+2*md+extra+ps],'proteinG':[sums['protein']-md,sums['protein']+md],'fatG':[sums['fat']-md,sums['fat']+md],'gk':[ordinary-ad,ordinary+ad+(extra+ps)*D('1.5')]}
 for k,values in intervals.items():
  d=q['display'][k];rounds=[x.quantize(D(1).scaleb(-d['decimalPlaces']),rounding=ROUND_HALF_UP) for x in values];assert rounds==[D(d['value'])]*2
 assert intervals['gk'][1]<=10 and intervals['gk'][1]-intervals['gk'][0]<=D('.10')
 rows.append({k:[str(x) for x in v] for k,v in intervals.items()})
print(json.dumps({'status':'PASS','recipeId':e['recipeId'],'scenarios':rows,'display':{'net':'7.4','total':'10.4','protein':'39.53','fat':'23.91','gk':'about3LOW'},'aggregatePolyolPoint':None,'wholeGkPoint':None}))
