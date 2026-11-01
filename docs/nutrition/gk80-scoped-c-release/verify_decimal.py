"""Independent Decimal reproduction of only the two installed approved cases."""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP,getcontext
import hashlib,json
getcontext().prec=40
R=Path(__file__).resolve().parents[3]
APPROVED={'jauheliha-kaalikeitto-vhh':'7e16f21f52cc2365c6b1742d891542fb118b7b879b5bf73d88d5dbef361c0f2f','vhh-kaalilaatikko':'57540a15a0e29a4fc6c7cdfe83dfbaa8f59222a0dd48ad77f75c96cf36d82235'}
def normalize(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,list):return [normalize(v) for v in x]
 if isinstance(x,dict):return {k:normalize(v) for k,v in x.items()}
 return x
def fp(x):return hashlib.sha256(json.dumps(normalize(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def number(x):
 assert x is not None,'UNKNOWN_NOT_ZERO'
 q=D(str(x));assert q.is_finite() and q>=0;return q
def display(lo,hi,places):
 for p in places:
  step=D(1).scaleb(-p);a=lo.quantize(step,rounding=ROUND_HALF_UP);b=hi.quantize(step,rounding=ROUND_HALF_UP)
  if a==b:return {'lower':lo,'upper':hi,'decimalPlaces':p,'value':a}
 raise AssertionError('UNSTABLE_DISPLAY')
out=[]
for rid,seal in APPROVED.items():
 e=json.loads((R/f'docs/nutrition/calculations/{rid}.json').read_text(encoding='utf8'));assert fp(e)==seal
 p=e['scopedPolyolC'];c=p['case'];assert c['servings']==e['servings']==6 and c['completeScope'] and c['preparationApprovedForPublication']
 for file,sha in p['versionHashes'].items():assert hashlib.sha256((R/file).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==sha
 sums={k:D(0) for k in ['availableCarbohydrate','fibre','protein','fat']};gk=D(0);known=D(0);extra=D(0);unknowns=0
 for row in c['ingredients']:
  f=number(row['massG'])/100/6;assert number(row['retention'])==1
  m={k:number(row['macro'][k]) for k in sums}
  for k in sums:sums[k]+=m[k]*f
  if m['availableCarbohydrate']>0:gk+=m['availableCarbohydrate']*f*number(row['gi'])/100
  if row['polyolEvidenceKind']=='REPORTED_SOURCE_VALUE':known+=number(row['polyolsSourceValue'])*f
  else:
   assert row['polyolsSourceValue'] is None;unknowns+=1;partial=D(0)
   if row['polyolEvidenceKind']=='AFCD_PAIRED_SOURCE_MODEL':
    partial=number(row['pairedCarbohydrates']['withValue'])-number(row['pairedCarbohydrates']['without']);assert partial>=0;known+=partial*f
   else:assert row['polyolEvidenceKind']=='MISSING_AGGREGATE' and row['sourceId']=='norway-06.186-polyoli02-20261101'
   residual=D(100)-sum(m.values())-partial;assert residual>=0;extra+=residual*f
 assert unknowns==2
 hi=gk+extra*D('1.5');assert hi-gk<=D('.10') and gk>=1 and hi<=10
 gd=display(gk,hi,[0]);total=sums['availableCarbohydrate']+sums['fibre']+known
 macros={'carbsNetG':display(sums['availableCarbohydrate'],sums['availableCarbohydrate'],[2,1,0]),'carbsTotalG':display(total,total+extra,[2,1,0]),'proteinG':display(sums['protein'],sums['protein'],[2,1,0]),'fatG':display(sums['fat'],sums['fat'],[2,1,0])}
 assert [v['value'] for v in macros.values()]==([D('10.21'),D(12),D('17.68'),D('15.26')] if rid=='jauheliha-kaalikeitto-vhh' else [D('9.52'),D(13),D('20.86'),D('30.65')])
 out.append({'recipeId':rid,'approvedFingerprint':seal,'sourceModelGk':{'lower':gk,'upper':hi,'width':hi-gk},'displayedGk':gd,'macros':macros,'unknownAggregatePolyols':None,'biologicalBoundEstablished':False})
print(json.dumps({'status':'PASS','cases':2,'results':out},default=lambda v:str(v) if isinstance(v,D) else v,ensure_ascii=False))
