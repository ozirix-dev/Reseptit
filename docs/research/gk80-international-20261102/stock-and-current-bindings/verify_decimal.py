"""Independent source-data, quantity, ownership and Decimal verification; read-only."""
from pathlib import Path
from decimal import Decimal as D
import argparse
import json,hashlib,csv
import yaml
here = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('root', nargs='?', type=Path, default=here.parents[3],
                    help='checkout containing the baseline recipes and Fineli data')
parser.add_argument('--overlap-dir', type=Path, help='directory containing the pinned handoff CSVs')
parser.add_argument('--baseline-report', type=Path, help='pinned historical nutrition report JSON')
parser.add_argument('--production-html', type=Path, help='pinned historical production HTML')
parser.add_argument('--approval-matrix', type=Path, help='pinned historical approval matrix')
args = parser.parse_args()
root = args.root
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
c=read(here/'source-catalog.json');manifest=read(here/'source-manifest.json')
native={x['source_id']:x for x in read(root/'docs/nutrition/fineli-release-20-reference.json')['foods']}
for key,f in c['foods'].items():
 n=native[key.split('-')[1]]
 assert f['nativeSourceRecord']==n
 assert f['per100g']['carbohydrate']==n['per100g']['available_carbohydrate_g_per_100g']
 assert f['per100g']['polyols']==n['per100g']['polyols_g_per_100g']
assert D(c['stock']['euCarbohydrateIncludingPolyolsGPer100g'])*D(c['stock']['powderGPerPreparedLitre'])/100==D('3.28')
assert c['stock']['individualPolyolsGPer100g'] is None and not c['stock']['polyolsZeroClaimPermitted']
assert D(c['quantities']['paprika']['densityGPerMl'])*D(c['quantities']['paprika']['metricTeaspoonMl'])==D('2.65')
assert D(str(c['quantities']['saffron']['foodPortion']['gramWeight']))*D('.25')==D('.175')
for filename in ['paella-named-stock-version.json','kongjuk-current-water-version.json']:
 b=read(here/filename);raw=(root/b['sourcePath']).read_text(encoding='utf-8').replace('\r\n','\n');front=yaml.safe_load(raw.split('---',2)[1])
 assert hashlib.sha256(raw.encode()).hexdigest()==b['sourceLfSha256']
 assert front['ingredients']==b['sourceIngredients'] and front['servings']==b['servings']
 assert [x['item'] for x in front['ingredients']]==[x['name'] for x in b['ingredients']]
 gk=D(0);omitted=D(0);actual=D(0);s=D(str(b['servings']))
 for source,i in zip(front['ingredients'],b['ingredients']):
  if i.get('excludedReason'):
   if 'availableCarbohydrateUpperBoundPerServingG' in i:
    upper=D(str(i['availableCarbohydrateUpperBoundPerServingG']));assert upper<1
    if i['name']=='kanalientä':assert upper==D(8)*D(41)/100/4 and source['amount']==1 and source['unit']=='l'
    elif i['name']=='savupaprikajauhetta':assert upper==D('2.65')/4 and source['amount']==1 and source['unit']=='tl'
    elif i['name']=='sahramia':assert upper==D('.175')/4 and source['amount']==.25 and source['unit']=='tl'
    else:raise AssertionError('Unexpected upper-bound ingredient')
    omitted+=upper
   else:
    assert i['estimatedAvailableCarbohydratePerServingG']==0
    if i['name']=='rosmariinin oksa':assert i['grams']==0 and source['note']=='valinnainen'
    else:assert i['name']=='suolaa maun mukaan' and c['foods']['fineli-30']['per100g']['carbohydrate']==0
   continue
  f=c['foods'][i['fineliRecordId']];key=i['fineliRecordId'].split('-')[1]
  if source['unit']=='g':assert D(str(source['amount']))==D(str(i['grams']))
  elif source['unit']=='rkl':assert D(str(i['grams']))==D(str(source['amount']))*D(str(native[key]['portion_mass_g']['RKL']))
  elif source['unit']=='tl':assert D(str(i['grams']))==D(str(source['amount']))*D(str(native[key]['portion_mass_g']['TL']))
  elif source['unit']=='ml':assert D(str(i['grams']))==D(str(source['amount']))/100*D(str(native[key]['portion_mass_g']['DL']))
  else:raise AssertionError('Unverified unit')
  cho=D(str(f['per100g']['carbohydrate']))*D(str(i['grams']))/100/s;actual+=cho
  if i['giRecordId']:gk+=cho*D(str(c['existingGiCards'][i['giRecordId']]['gi']))/100
  elif cho>0:assert cho<1;omitted+=cho
 assert omitted<2 and gk==D(b['expected']['unroundedGk'])
 assert omitted==D(b['expected'].get('omittedChoUpperG',b['expected'].get('omittedChoG')))
 assert actual==D(b['expected'].get('knownIncludedChoG',b['expected'].get('availableChoG')))
 print(json.dumps({'recipeId':b['recipeId'],'rows':len(b['ingredients']),'decimalGk':str(gk),'omittedChoOrUpperG':str(omitted),'publicationApproved':False}))
if args.overlap_dir is not None:
    other = args.overlap_dir
    for fn,pinned in manifest['overlapHashes'].items():
     assert hashlib.sha256((other/fn).read_bytes()).hexdigest()==pinned,'Other-worker queue changed; recheck ownership'
     ids={x['recipeId'] for x in csv.DictReader((other/fn).open(encoding='utf-8-sig'))}
     assert not ids.intersection(manifest['ownNewNamedIds'])
else:
    print('SKIP historical handoff CSVs (supply --overlap-dir)')
screen=list(csv.DictReader((here/'broth-family24-screen.csv').open(encoding='utf-8')))
assert len(set(x['recipeId'] for x in screen))==24
assert sorted(set(x['recipeId'] for x in screen if x['portionBelow1g']=='True'))==['kimchi-jjigae','paella-valenciana','sichuan-hot-pot']
assert D('3.28')*D(350)/1000>D(1) and D('3.28')*D(250)/1000<D(1)
print('PASS: family24 reused, three portion passes only; all unknowns remain unknown.')
road=read(here/'deduplicated-roadmap.json')
if args.baseline_report is not None:
    baseline_path = args.baseline_report
    assert hashlib.sha256(baseline_path.read_bytes()).hexdigest()==road['baselineReportSha256']
    baseline_ids={x['recipeId'] for x in read(baseline_path)['results'] if x['status']=='CALCULATED'}
    assert baseline_ids==set(road['originalNumericRecipeIds']) and len(baseline_ids)==156
else:
    print('SKIP historical baseline report (supply --baseline-report)')
production=read(here/'production-revalidation.json');current_ids=set(production['productionPage']['numericIds'])
assert current_ids==set(road['mainNumericRecipeIds']) and len(current_ids)==172
assert production['productionPage']['numericClassA']==166 and production['productionPage']['numericClassB']==6
assert all(x['identicalGitBlobs'] and x['localLfMatchesNewGitBlob'] for x in production['sourceEquivalenceByExactGitBlob'].values())
if args.production_html is not None:
    raw_html = args.production_html
    assert hashlib.sha256(raw_html.read_bytes()).hexdigest()==production['productionPage']['rawHtmlSha256']
    from bs4 import BeautifulSoup
    html=BeautifulSoup(raw_html.read_text(encoding='utf-8'),'html.parser');rendered=set()
    for row in html.select('li.glycemic-pilot__recipe'):
     if any(p.get_text(' ',strip=True).startswith('GK-arvio') for p in row.find_all('p',recursive=False)):rendered.add(row['id'])
     if row.select_one('section.gk-only-variant[data-gk-level="A"], section.gk-only-variant[data-gk-level="B"]'):rendered.add(row['id'])
    assert rendered==current_ids
else:
    print('SKIP historical production HTML (supply --production-html)')
if args.approval_matrix is not None:
    matrix = args.approval_matrix
    assert hashlib.sha256(matrix.read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()).hexdigest()==road['approvedUnpublishedVersionsAsRecordedByOwnerMatrix']['sourceLfSha256'],'Approval matrix changed; refresh roadmap snapshot'
else:
    print('SKIP historical approval matrix (supply --approval-matrix)')
approved={x['recipeId'] for x in road['approvedUnpublishedVersionsAsRecordedByOwnerMatrix']['versions']}
own={x['recipeId'] for x in road['ownUnapprovedResearchVersions']}
assert len(approved)==road['counts']['approvedUnpublishedUnique'] and len(own)==5
assert not(current_ids&approved or current_ids&own or approved&own)
assert len(current_ids|approved|own)==road['counts']['ifAllRemainingAndOwn5LaterIndividuallyAcceptedAndPublished']
assert 261-len(current_ids|approved|own)==road['counts']['remainingGapInThatConditionalScenario']
for entry in road['ownUnapprovedResearchVersions']:
 rel=entry['evidencePath'];p=here/Path(rel).name if '/stock-and-current-bindings/' in rel else here.parents[3]/rel
 assert hashlib.sha256(p.read_text(encoding='utf-8-sig').replace('\r\n','\n').encode()).hexdigest()==entry['evidenceLfSha256']
 assert not entry['approved'] and not entry['published']
print('PASS: committed roadmap snapshot IDs are disjoint and its conditional totals agree.')
