"""Read-only Decimal verification of a separate owner display proposal.

Consumes existing PR164 scenarios. Does not recalculate a recipe database.
"""
from pathlib import Path
from decimal import Decimal as D,ROUND_HALF_UP
import json,hashlib,subprocess
F=Path(__file__).resolve().parent;O=F.parent;R=O.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf8'))
def norm(x):
 if isinstance(x,float) and x.is_integer():return int(x)
 if isinstance(x,list):return [norm(v) for v in x]
 if isinstance(x,dict):return {k:norm(v) for k,v in x.items()}
 return x
def fp(x):return hashlib.sha256(json.dumps(norm(x),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def sha(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
p=read(F/'proposal.json');old=read(O/'case.json');dec=read(O/'decimal-verification.json');native=read(O/'prototype-result.json');pins=read(O/'source-pins.json')
assert fp({k:v for k,v in p.items() if k!='proposalFingerprintSha256'})==p['proposalFingerprintSha256']=='e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07'
assert fp(old)==p['baseCaseFingerprint']==pins['packetFingerprint']=='ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2'
assert p['recipeId']==old['recipeId']=='uunikanapasta-kesakurpitsa' and p['servings']==old['pilot']['servings']==4
assert fp({k:v for k,v in old['pilot'].items() if k!='caseFingerprintSha256'})==p['originalResearchFingerprint']
for name,h in p['sourceAndInputFileHashes'].items():assert sha(O/name)==h,name
assert sha(O/'pr153-source.md')==p['baseRecipeSha256']
for flag in ['publicationEligible','productionEnabled','activationSupported','ownerMethodApproved','ownerContentApproved','sourceBindingsApproved','releaseAuthorized']:assert p[flag] is False,flag
for obj in [old,native,p['originalPrototypeState']]:
 for flag in ['publicationEligible','productionEnabled','activationSupported']:assert obj[flag] is False
assert native['productionGkOverride'] is p['productionGkOverride'] is None
assert native['status']=='HOLD' and native['precision']['conservativeQuantum']['displays']['carbsNetG']['stable'] is False
assert old['pilot']['ingredients'][8]['aggregatePolyolPer100g'] is None
assert all(v is None for v in old['pilot']['ingredients'][8]['individuallyReportedSpecies'].values())
assert [old['pilot']['ingredients'][i]['sourceId'] for i in [0,6,7]]==['recovery01-fineli-11565-release20','recovery01-fineli-393-web-table-20261101','recovery01-fineli-11134-web-table-20261101']
for source in old['sourceCards']['giSources']:
 assert fp({k:v for k,v in source.items() if k!='evidenceHash'})==source['evidenceHash']
for source in old['compositionSources']:
 assert fp({k:v for k,v in source.items() if k!='evidenceHash'})==source['evidenceHash']
expected={'carbsNetG':('7.4',1),'carbsTotalG':('10.4',1),'proteinG':('39.53',2),'fatG':('23.91',2),'gk':('3',0)}
for name,scenario in p['scenarioEvidence'].items():
 for key,(value,dp) in expected.items():
  assert p['display'][key]['value']==value and p['display'][key]['decimalPlaces']==dp
  endpoints=scenario[key]['interval'];a,b=map(D,endpoints);assert 0<=a<=b
  if name!='fixedSource':
   assert endpoints==dec['sensitivity'][name]['intervals'][key]
   for edge,n in zip(['lower','upper'],[a,b]):assert abs(D(str(native['precision'][name]['displays'][key][edge]))-n)<D('1e-12')
  q=D(1).scaleb(-dp);rounded=[v.quantize(q,rounding=ROUND_HALF_UP) for v in [a,b]]
  assert rounded==list(map(D,scenario[key]['roundedEndpoints']))==[D(value),D(value)]
 a,b=map(D,scenario['gk']['interval']);assert b<=10 and b-a<=D('.10')
for name in ['nearestQuantum','conservativeQuantum']:
 a,b=map(D,dec['sensitivity'][name]['intervals']['carbsNetG']);assert a.quantize(D('.01'),rounding=ROUND_HALF_UP)!=b.quantize(D('.01'),rounding=ROUND_HALF_UP)
base=read(O/'main-baseline.json')
assert len(base['resultHashes'])==326 and sum(x['status']=='CALCULATED' for x in base['resultHashes'])==130
for target,h in base['protectedTrees'].items():
 assert subprocess.check_output(['git','-C',str(R),'rev-parse',f'{p["main"]}:{target}'],text=True).strip()==h
 assert not subprocess.check_output(['git','-C',str(R),'diff',p['main'],'--',target],text=True).strip()
for rid in ['keto-suklaakeksit','keto-mutakakku']:
 text=(R/'reseptit/jalkiruoat'/f'{rid}.md').read_text(encoding='utf8')
 for key in ['carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g']:assert f'{key}: null' in text
for file,h in pins['pr156FileHashes'].items():assert sha(Path(pins['sourcePrs']['156']['root'])/file)==h,file
print(json.dumps({'status':'PASS','proposalDecision':'CONDITIONAL_GO_OWNER_REVIEW_ONLY','proposalFingerprint':p['proposalFingerprintSha256'],'scenarios':3,'checkedDisplayFieldsPerScenario':5,'net7point4Stable':True,'otherDisplayValuesStable':True,'originalNet7point38StillUnstable':True,'gkClass':'LOW','originalEvidenceUnchanged':True,'sourceAndInputHashes':'PASS','productionFlagsUnchanged':True,'productionInputTreesUnchanged':True,'numericBaseline':130,'baselineObjects':326,'ketoPackageWithholdingPreserved':True,'pr156EvidenceFileHashesUnchanged':True,'newDatabaseCalculation':False,'builds':0},ensure_ascii=False,indent=2))
