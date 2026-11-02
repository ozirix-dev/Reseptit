"""Read-only GK80 campaign check and optional dependency rebuild.
Usage: python audit-campaign.py ROOT DATA_DIR EXTERNAL_OUT [INVENTORY_JSON]
No active data writes. Decimal independently checks the TypeScript result.
Optional inventory is a pinned old170-HOLD metadata artifact, not a fresh70 run.
"""
import csv,hashlib,json,re,subprocess,sys
from decimal import Decimal as D, ROUND_HALF_UP
from pathlib import Path
root,data,out=map(lambda x:Path(x).resolve(),sys.argv[1:4]);parent=out
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--is-inside-work-tree'],cwd=parent,capture_output=True).returncode!=0,'Output must be external'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def digest(p):return hashlib.sha256(p.read_text(encoding='utf-8-sig').encode()).hexdigest()
def save(name,x):
 out.mkdir(parents=True,exist_ok=True);(out/name).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def table(name,rows):
 out.mkdir(parents=True,exist_ok=True)
 with (out/name).open('w',encoding='utf8',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
s=read(data/'sources.json');pack=read(data/'cases.json');comp={x['id']:x for x in s['composition']};gi={x['id']:x for x in s['giBindings']}
for p,h in s['sourceFilesLfSha256'].items():assert digest(root/p)==h,p
results=[]
for c in pack['cases']:
 body={k:v for k,v in c.items() if k!='inputSha256'};assert hashlib.sha256(json.dumps(body,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()==c['inputSha256']
 for loc,p in c['paths'].items():assert digest(root/p)==c['recipeSha256Lf'][loc],p
 point=D(0);omitted=D(0);rows=[]
 for i in c['candidateIngredients']:
  f=comp[i['compositionId']];cap=i['carbohydrateUse']=='UPPER_BOUND';v=D(str(f['availableUpperPer100g'] if cap else f['availablePer100g']));cho=D(str(i['grams']))*v/D(100)/D(c['servings']);g=gi.get(i['giId'])
  if g:
   assert not cap and f['id'] in g['allowedCompositionIds'];term=cho*D(str(g['value']))/D(100);point+=term
  else:
   assert cho<D(1),'Individual strict cap';omitted+=cho;term=None
  rows.append({'ingredientIndex':i['originalIndex'],'compositionId':f['id'],'choPerServing':str(cho),'gkContribution':None if term is None else str(term),'positiveUnknownGiOmitted':g is None and cho>0,'isNominalUpper':cap})
 assert omitted<D(2),'Aggregate strict cap'
 assert point==D('.7261') and omitted==D('1.57330')
 comparatorOmission=omitted+(D('23.5')-D(8))*D(15)/D(100)/D(4)
 assert comparatorOmission==D('2.15455') and comparatorOmission>=D(2)
 results.append({'recipeId':c['recipeId'],'inputSha256':c['inputSha256'],'unroundedPoint':str(point),'roundedPoint':str(point.quantize(D('.01'),rounding=ROUND_HALF_UP)),'omittedCho':str(omitted),'blueDragonComparatorOmissions':str(comparatorOmission),'ownerApproval':False,'publicationAuthorized':False,'rows':rows})
 # Cross-language independent calculation, same exact sealed input.
 engine=read(out/'engine-results.json')['results'];er=next(x for x in engine if x['recipeId']==c['recipeId']);assert abs(D(str(er['unrounded']))-point)<D('1e-12') and D(str(er['point']))==point.quantize(D('.01')) and abs(D(str(er['omittedCho']))-omitted)<D('1e-12')
# Symbolic starch ledger: arbitrary algebraic examples ONLY, no GI assumptions or recipe outputs.
for a,l,r in [(D(195),D(0),D(0)),(D(195),D(15),D('.1')),(D(195),D(15),D(1))]:
 served=(a-l)+r*l;assert served==a-(1-r)*l and served<=a
 if r*l>0:assert a+r*l>served # catches counting initial starch and returned starch twice
scenarios=[]
for recipe,grams in [('dan-dan-nuudelit',D(300)),('lanzhou-naudanliha-nuudelikeitto',D(350))]:
 for gid,gv in [('dried-wheat46',D(46)),('sanlian-dried-wheat62',D(62))]:
  cho=grams*D(65)/D(100)/D(4);term=cho*gv/D(100)
  scenarios.append({'recipeId':recipe,'hypotheticalNoodleState':'MEXT01050_DRY_SEPARATE_UNAPPROVED_VERSION','grams':str(grams),'sourceNativeAvailablePer100g':'65.0','availableChoPerServing':str(cho),'giObservationRef':gid,'componentOnlyGkArithmetic':str(term),'wholeRecipeGk':'','coverageGain':0,'notAnIntervalOrApprovedSourceTransfer':'True'})
table('decimal-source-scenarios.csv',scenarios)
save('decimal-results.json',{'activation':False,'sourceBasedArithmeticCases':len(results),'results':results,'starchLedgerCheck':'A0-L+rL = A0-(1-r)L; no empirical L/r or GI inferred'})
if len(sys.argv)>4:
 invpath=Path(sys.argv[4]);inv=read(invpath)
 inventorySeal=hashlib.sha256(invpath.read_bytes()).hexdigest()
 assert len(inv)==170 and len({x['recipeId'] for x in inv})==170
 baselineMatrix=subprocess.check_output(['git','show','c850f479dc88322520ab452876501f1d9909be40:docs/research/afcd-polyol-03/current-decision-matrix.csv'],cwd=root).decode('utf8');existing=list(csv.DictReader(baselineMatrix.splitlines()));prior={x['recipeId']:x for x in existing}
 noodleTypes={'pad-thai-vhh-konjac':'KONJAC_READY','khao-soi-vhh-konjac':'KONJAC_READY','pad-kee-mao-vhh-konjac':'KONJAC_READY','pad-see-ew-vhh-konjac':'KONJAC_READY','bun-cha-hanoi':'RICE_DRY_VERMICELLI_RINSED','chow-mein':'WHEAT_EGG_BOILED_DRAINED_WOK','dan-dan-nuudelit':'WHEAT_STATE_UNRESOLVED_WATER_RETAINED','goi-cuon':'RICE_DRY_VERMICELLI_WITH_RICE_PAPER','pho-bo':'RICE_DRY_FLAT','lanzhou-naudanliha-nuudelikeitto':'WHEAT_STATE_UNRESOLVED_DRAINED','japanilainen-soba-aamiaiskeitto':'SOBA_BUCKWHEAT_FRACTION_AND_STATE_UNRESOLVED','malesialainen-laksa-lemak-aamiaiseksi':'RICE_STATE_VERSION_ALREADY_APPROVED','vietnamilainen-pho-ga-aamuksi':'RICE_STATE_VERSION_ALREADY_APPROVED','sichuan-hot-pot':'NOODLE_TYPE_AND_STATE_UNRESOLVED'}
 reasons={'pad-thai-vhh-konjac':'TAMARIND30G_CURRENT_CAP_FAILS;PEANUT_PRODUCT_GI;MISSING_SPRING_ONION_IN_INGREDIENT_LIST','khao-soi-vhh-konjac':'COCONUT_MILK_GI;CURRY_PASTE_GI;PICKLED_MUSTARD_DRAINED_BASIS','pad-see-ew-vhh-konjac':'EXACT_YUTAKA_AND_DRAINED_KORO_BINDING_OWNER_REVIEW','bun-cha-hanoi':'COLD_RINSED_VERMICELLI_GI_TRANSFER;MARINADE_RETENTION;SUGAR_AND_FISH_SAUCE_ML','chow-mein':'EGG_NOODLE_WOK_GI;NOT_PLAIN_DRY_WHEAT;WEIGHED_CARROT_AND_SAUCES','dan-dan-nuudelit':'NOODLE_STATE;RETAINED_STARCH;SAUCE_PRODUCT_AND_MASS','goi-cuon':'VERMICELLI_GI;RICE_PAPER8PIECES;PEANUT_BUTTER120G;HOISIN','pho-bo':'FLAT_RICE_NOODLE_GI;STOCK_EXTRACTION_AND_AROMATIC_MASSES','lanzhou-naudanliha-nuudelikeitto':'NOODLE_STATE;AROMATIC_MASSES;STRAINED_STOCK_RETENTION;CHILLI_OIL','japanilainen-soba-aamiaiskeitto':'BUCKWHEAT_FRACTION_STATE;DASHI_BROTH_BASIS;SPINACH_MASS','sichuan-hot-pot':'NOODLE_TYPE_STATE;SAUCE_AND_STOCK_PRODUCT','malesialainen-laksa-lemak-aamiaiseksi':'EXISTING_APPROVED16_VERSION_ONLY','vietnamilainen-pho-ga-aamuksi':'EXISTING_APPROVED16_VERSION_ONLY','pad-kee-mao-vhh-konjac':'EXISTING_LOCKED_APPROVED6_VERSION_ONLY'}
 deps=[];familyRows=[];coconutGates=[];selected={};nativeCoconut=D(str(comp['29014']['availablePer100g']))
 for x in inv:
  # Scan existing inventory once, then follow real ingredient dependencies only.
  for idx,a in enumerate(x['recipe']['ingredients']):
   item=a['item'].lower();family=None
   if re.search('nuudel|vermisell|soba',item) and 'keitinvett' not in item:family='NOODLES'
   elif 'kookosmaito' in item:family='COCONUT_MILK'
   elif 'tummaa soija' in item:family='DARK_SOY'
   elif 'tähtianis' in item:family='STAR_ANISE_AND_BROTH'
   elif ('currytahna' in item or 'currytahno' in item):family='CURRY_PASTE'
   if not family:continue
   assert digest(root/x['path'])==x['sourceSha256'],x['recipeId']
   row={'family':family,'recipeId':x['recipeId'],'ingredientIndex':idx,'originalItem':a['item'],'amount':a['amount'],'unit':a['unit'],'servings':x['recipe']['servings'],'sourcePath':x['path'],'sourceSha256Lf':x['sourceSha256'],'preparationClass':noodleTypes.get(x['recipeId'],'FAMILY_SPECIFIC_REVIEW_REQUIRED'),'existingStage':prior.get(x['recipeId'],{}).get('currentStage','NO_PREPARED_NUMERIC_VERSION')}
   deps.append(row);selected[x['recipeId']]=x
   if family=='COCONUT_MILK':
    g=D(str(a['amount'])) if a['unit']=='g' and a['amount'] is not None else None
    ch=None if g is None else g*nativeCoconut/D(100)/D(x['recipe']['servings'])
    coconutGates.append({'recipeId':x['recipeId'],'ingredientIndex':idx,'compositionReferenceOnly':'29014','sourceUse':'NATIVE_REFERENCE_SCENARIO_NOT_BRAND_EQUIVALENCE','availableReferenceChoPerServing':None if ch is None else str(ch),'singleOmissionStrictlyBelow1':None if ch is None else ch<D(1),'gate':'MASS_OR_VOLUME_BASIS_UNRESOLVED' if ch is None else 'INGREDIENT_REFERENCE_OMISSION_FAIL' if ch>=1 else 'REFERENCE_ONLY_DOES_NOT_RESOLVE_REMAINING_RECIPE'})
 assert {r['recipeId'] for r in deps if r['family']=='NOODLES'}==set(noodleTypes),'Noodle dependency set changed'
 table('dependency-map.csv',deps);save('coconut-gates.json',{'sourceRef':{'file':'sources.json','compositionId':'29014'},'notABrandMatchedPointForEveryRecipe':True,'cases':coconutGates})
 fams=[]
 for family in sorted({r['family'] for r in deps}):
  ids=sorted({r['recipeId'] for r in deps if r['family']==family});already=[i for i in ids if prior.get(i,{}).get('currentStage') in ['APPROVED_IN_PR183','APPROVED_LOCKED_SIX']]
  fams.append({'family':family,'dependentRecipes':len(ids),'recipeIds':ids,'alreadyApprovedVersionIds':already,'unapprovedRecipeIds':[i for i in ids if i not in already],'newCompleteArithmeticCandidates':[i for i in ids if i=='pad-see-ew-vhh-konjac'],'actualNewPublicationQualified':0,'ingredientResolutionIsNotWholeRecipeResolution':True})
 save('family-impact.json',{'inventoryRows':170,'inventoryRawSha256':inventorySeal,'metadataScanIsNotFullRecipeRecalculation':True,'distinctDependentRecipes':len(selected),'families':fams,'noodleTypes':noodleTypes,'remainingNoodleBlockers':reasons,'distinctReadyForOwnerSourceReview':1,'publishedGain':0})
 # One live matrix: retain every preexisting value; add campaign scope/status columns.
 cols=list(existing[0]);extra=['numericArithmeticProposal','researchCandidateInputSha256','campaignFamilies','campaignRemainingBlockers']
 for k in extra:
  if k not in cols:cols.append(k)
 for r in existing:
  r.setdefault('numericArithmeticProposal','True');r.setdefault('researchCandidateInputSha256','');r.setdefault('campaignFamilies','');r.setdefault('campaignRemainingBlockers','')
 live={r['recipeId']:r for r in existing}
 for id,x in selected.items():
  if id not in live:live[id]={k:'' for k in cols};live[id].update({'recipeId':id,'currentStage':'RESEARCH_HOLD','selectedApprovedInputSha256':'','integratedInPr183':'False','sourceHold':'True','publishedByThisTask':'False','numericArithmeticProposal':'False','researchCandidateInputSha256':''})
  live[id]['campaignFamilies']=';'.join(sorted({r['family'] for r in deps if r['recipeId']==id}))
  live[id]['campaignRemainingBlockers']=reasons.get(id,'COCONUT_OR_CURRY_GI_PRODUCT_AND_MASS_OR_STAR_ANISE_BASIS;EXISTING_APPROVAL_IF_ANY_APPLIES_ONLY_TO_PINNED_VERSION')
 c=pack['cases'][0];live[c['recipeId']].update({'currentStage':'RESEARCH_A_SOURCE_CONTENT_REVIEW_REQUIRED','sourceHold':'False','numericArithmeticProposal':'True','researchCandidateInputSha256':c['inputSha256']})
 table('current-decision-matrix.csv',[live[k] for k in sorted(live)])
 summary={'dependencyRecipes':len(selected),'dependencyRows':len(deps),'noodleRecipes':14,'existingApprovedDependentRecipes':sum(prior.get(i,{}).get('currentStage') in ['APPROVED_IN_PR183','APPROVED_LOCKED_SIX'] for i in selected),'newAArithmeticCandidates':1,'newBCompleteScenarios':0,'newSourceBasedReviewableCandidates':1,'newOwnerApproved':0,'newPublicationQualified':0,'remainingUnapprovedHolds':sorted(i for i in selected if i!=c['recipeId'] and prior.get(i,{}).get('currentStage') not in ['APPROVED_IN_PR183','APPROVED_LOCKED_SIX']),'matrixRows':len(live),'arithmeticProposalRecipesTotal':sum(r['numericArithmeticProposal']=='True' for r in live.values())}
 save('summary.json',summary)
 print(json.dumps(summary,ensure_ascii=False))
else:print(json.dumps({'Decimal':'PASS','point':results[0]['roundedPoint'],'omittedCho':results[0]['omittedCho']}))
