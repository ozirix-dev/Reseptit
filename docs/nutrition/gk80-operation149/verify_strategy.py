"""Read-only replay of the frozen16-version source-reuse proposal and queue snapshot."""
from pathlib import Path
from decimal import Decimal as D
import csv, hashlib, json
ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
def read(p):return json.loads(p.read_text(encoding='utf8'))
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
p=read(HERE/'additional-proposal.json');q=read(HERE/'shared-blocker-queue.json');approval=read(HERE/'owner-approval.json')
rows=list(csv.DictReader((HERE/'hold-screen.csv').open(encoding='utf8')))
expected={r['recipeId'] for r in rows}-set(approval['approvedInputs'])
actual=[id for group in q['groups'] for id in group['recipes']]
assert len(actual)==len(set(actual))==154 and set(actual)==expected
assert all(len(g['recipes'])==g['count'] for g in q['groups'])
assert q['candidateNumeric']==156+len(approval['approvedInputs'])==172
assert q['targetNumeric']==261 and q['gapAfterDraft']==261-172==89
assert p['publicActivation'] is False and p['includedIn172'] is False
assert p['recipeId'] in expected and p['recipeId'] not in approval['approvedInputs']
total=D(0);omitted=D(0)
for i in p['ingredients']:
 file='fineli-release-20-reference.json' if i['source']=='Fineli' else 'afcd-release-3-reference.json'
 row=next(r for r in read(ROOT/'docs/nutrition'/file)['foods'] if str(r['source_id'])==i['sourceId'])
 assert digest(row)==i['nativeRowSha256']
 value=row['per100g']['available_carbohydrate_g_per_100g'] if i['source']=='Fineli' else row['available_carbohydrate_without_sugar_alcohols_g_per_100g']
 assert D(str(value))==D(str(i['availablePer100g']))
 cho=D(str(i['gramsForTwoServings']))*D(str(value))/D(100)/D(p['servings'])
 assert cho==D(i['availablePerServing'])
 if i['gi'] is None:
  assert cho<D(1);omitted+=cho;assert i['contributionPerServing'] is None
 else:
  gl=cho*D(i['gi'])/D(100);assert gl==D(i['contributionPerServing']);total+=gl
assert total==D(p['pointExact'])==D('10.918125')
assert omitted==D(p['omittedAvailableChoPerServing'])==D('.3') and omitted<D(2)
print(json.dumps({'status':'PASS','pendingNumericProposal':1,'point':str(total),'approvedPublicScope':16,'queueDistinct':154,'gap':89,'writes':0}))
