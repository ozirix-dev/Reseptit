"""Run with python -I: independent Decimal reproduction of one disabled case.

Isolated mode prevents this executable's filename from shadowing stdlib decimal.
"""
from decimal import Decimal as D,ROUND_HALF_UP,getcontext
from pathlib import Path
import json,hashlib,argparse
getcontext().prec=40
F=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--prototype-result',type=Path);args=parser.parse_args()
read=lambda p:json.loads(p.read_text(encoding='utf8'))
def normalize(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,dict):return {k:normalize(v) for k,v in x.items()}
 if isinstance(x,list):return [normalize(v) for v in x]
 return x
def fp(x):return hashlib.sha256(json.dumps(normalize(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
c=read(F/'case.json');p=c['pilot'];pins=read(F/'source-pins.json')
assert fp(c)==pins['packetFingerprint']=='ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2'
assert fp({k:v for k,v in p.items() if k!='caseFingerprintSha256'})==p['caseFingerprintSha256']=='d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae'
assert hashlib.sha256((F/'pr153-source.md').read_bytes().replace(b'\r\n',b'\n')).hexdigest()==p['sourceRecipeSha256']
keys=['availableCarbohydrate','protein','fat','fibre'];sums={k:D(0) for k in keys};ordinary=D(0);partial=D(0);pepper=D(0)
for i in p['ingredients']:
 factor=D(0) if i.get('certifiedZeroSalt') else D(i['massG'])*D(i['retention'])/100/D(p['servings'])
 for k in keys:sums[k]+=D(i['macroPer100g'][k])*factor
 a=D(i['macroPer100g']['availableCarbohydrate'])*factor
 if a:ordinary+=a*D(i['gi'])/100
 partial+=D(i['knownPartialPolyolPer100g'])*factor
 if i['unknownAggregate']:
  assert i['index']==8 and i['aggregatePolyolPer100g'] is None
  assert all(v is None for v in i['individuallyReportedSpecies'].values())
  residual=100-sum((D(i['macroPer100g'][k]) for k in keys),D(0))-D(i['knownPartialPolyolPer100g'])
  pepper+=residual*factor
assert sums=={k:D(v) for k,v in p['calculation']['macroPerServing'].items()}
assert pepper==D('.028') and ordinary==D('2.737675') and partial==0
rounding=lambda x,n:x.quantize(D(1).scaleb(-n),rounding=ROUND_HALF_UP)
out={'fixedSource':{'macroPerServing':{k:str(v) for k,v in sums.items()},'gk':[str(ordinary),str(ordinary+pepper*D('1.5'))],'gkWidth':str(pepper*D('1.5'))},'sensitivity':{}}
for name,mult in [('nearestQuantum',D('.5')),('conservativeQuantum',D(1))]:
 md=D(0);ad=D(0);ps=D(0)
 for index in [6,7]:
  i=p['ingredients'][index];factor=D(i['massG'])/100/4
  md+=D('.1')*mult*factor;ad+=D('.1')*mult*factor*D(i['gi'])/100;ps+=mult*factor
 total=sums['availableCarbohydrate']+sums['fibre']+partial
 intervals={'carbsNetG':[sums['availableCarbohydrate']-md,sums['availableCarbohydrate']+md],
 'carbsTotalG':[total-2*md,total+2*md+pepper+ps],
 'proteinG':[sums['protein']-md,sums['protein']+md],
 'fatG':[sums['fat']-md,sums['fat']+md],
 'gk':[ordinary-ad,ordinary+ad+(pepper+ps)*D('1.5')]}
 places={'carbsNetG':2,'carbsTotalG':1,'proteinG':2,'fatG':2,'gk':0}
 displays={k:[str(rounding(v,places[k])) for v in vals] for k,vals in intervals.items()}
 assert displays['carbsNetG']==['7.38','7.39']
 for k in ['carbsTotalG','proteinG','fatG','gk']:assert displays[k][0]==displays[k][1]
 width=intervals['gk'][1]-intervals['gk'][0];assert width<=D('.10') and intervals['gk'][1]<=10
 out['sensitivity'][name]={'intervals':{k:[str(x) for x in vals] for k,vals in intervals.items()},'displays':displays,'gkWidth':str(width),'netDisplayStable':False}
 if args.prototype_result:
  native=read(args.prototype_result)['precision'][name]
  for k,vals in intervals.items():
   for end,x in zip(['lower','upper'],vals):assert abs(D(str(native['displays'][k][end]))-x)<D('1e-12'),(name,k,end)
  assert abs(D(str(native['gkWidth']))-width)<D('1e-12')
out.update(status='PASS',decision='HOLD',publicationEligible=False,selectedRecipes=1,changedDisplayPrecision=False,explanation='Net7.38 fails its original precision under both conditional rounding envelopes. Total10.4,protein39.53,fat23.91 and aboutGK3 remain stable within this limited audit. No complete analytical uncertainty bound is claimed.')
print(json.dumps(out,ensure_ascii=False,indent=2))
