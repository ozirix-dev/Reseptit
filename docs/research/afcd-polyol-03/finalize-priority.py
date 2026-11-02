import csv,json,pathlib,collections
import sys,subprocess
root,snap,out=map(pathlib.Path,sys.argv[1:4]);p=snap
parent=out.resolve()
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--show-toplevel'],cwd=parent,capture_output=True).returncode==128,'Output must be outside Git'
out.mkdir(parents=True,exist_ok=True)
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def writecsv(name,rows):
 with (out/name).open('w',encoding='utf-8',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
pack=load(snap/'cases.json'); results={r['recipeId']:r for r in load(snap/'results.json')['results']}; gis={g['id']:g for g in load(snap/'gi-sources.json')['records']}; blockers={r['recipeId']:r for r in csv.DictReader((out/'blockers.csv').open(encoding='utf-8'))}; screen=list(csv.DictReader((p/'hold-screen.csv').open(encoding='utf-8')))
priority=[r for r in screen if r['category'] in ['2','3']];assert len(priority)==77
for r in priority:r.update({'classes':blockers[r['recipeId']]['classes'],'groupIds':blockers[r['recipeId']]['groupIds'],'currentPilotNumeric':results.get(r['recipeId'],{}).get('numericProposal',False)})
writecsv('priority77.csv',priority)
rows=[]
for c in pack['cases']:
 r=results[c['recipeId']]
 if not r['numericProposal']:continue
 used={i['giId'] for i in c['candidateIngredients'] if i['giId']}
 rows.append({'recipeId':c['recipeId'],'level':c['level'],'point':r['point'],'rangeMin':(r['scenarioRange'] or {}).get('min'),'rangeMax':(r['scenarioRange'] or {}).get('max'),'rangeKind':r['rangeKind'],'omittedAvailableCho':r['omittedCho'],'namedGiSources':';'.join(sorted(i for i in used if gis[i]['kind']=='NAMED_HUMAN_GI')),'existingCoding':';'.join(sorted(i for i in used if gis[i]['kind']=='EXISTING_PUBLISHED_CODING')),'newEditorialCoding':';'.join(sorted(i for i in used if gis[i]['kind']=='PROPOSED_B_CODING')),'sensitivityOnly':r['assumptionSensitivity'] is not None,'exactVersionSha256':c['inputSha256'],'requiredApprovals':';'.join(c['requiredDecisions']),'publicationAuthorized':False,'reviewNote':c['preparationDecision']})
assert len(rows)==16;writecsv('16-decision-matrix.csv',rows)
byreason=collections.defaultdict(list)
for r in priority:byreason[r['reason']].append(r['recipeId'])
methods=[
 {'methodId':'GK_ONLY_CURRENT_A','scope':'Current16 prepared pilot: existing A arithmetic','dependentRecipes':';'.join(r['recipeId'] for r in rows if r['level']=='A'),'actualPreparedNumeric':10,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Exact weighed/product versions and explicit GK-only publication contract; macro-version compatibility','risk':'Using current macro approval for changed content is prohibited'},
 {'methodId':'B_NAMED_PREPARATION_ANALOGY','scope':'Named comparator source/preparation model in current16','dependentRecipes':';'.join(r['recipeId'] for r in rows if r['rangeKind']=='NAMED_COMPARATOR_SCENARIOS'),'actualPreparedNumeric':2,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Accept exact named food analogies; bounds are scenarios, not physiological or statistical limits','risk':'Hydration/fermentation/toasting uncertainty not covered by source endpoints'},
 {'methodId':'B_PLANT_OR_TRACE_CODING','scope':'Source analogies plus unapproved editorial coding in current16','dependentRecipes':';'.join(r['recipeId'] for r in rows if r['rangeKind']=='CONDITIONAL_CODING_MODEL'),'actualPreparedNumeric':4,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Explicit new plant50/trace50 contract and exact source bindings; complete version approval','risk':'GI50 is a default, not measured GI; sensitivity is separate'},
 {'methodId':'ALMOND50_PARKED_RESEARCH','scope':'Completed editorial-model scenario; not eligible for coverage','dependentRecipes':'rahkapiirakka-vhh;vhh-lihapiirakka;keto-korvapuustit;vhh-runebergintortut','actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':4,'remainingConditions':'New GI assumption and publication contract NOT approved; no further priority work here','risk':'5.4/6.6 bracket composition only; GI50 and milling/baking error are not source-bounded'},
 {'methodId':'CURRY_PASTE_SOURCE_AND_GI','scope':'Current category3 shared curry block','dependentRecipes':';'.join(byreason['CURRY_PASTE_AVAILABLE_CHO_AND_GI']+byreason['UNSPECIFIED_CURRY_PASTE']),'actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Independent availableCHO/label bounds AND suitable paste GI/model, exact products and masses','risk':'Approving coconut plant50 alone opens zero of these; paste remains an independent blocker'},
 {'methodId':'PULSE_PREPARATION_GROUP','scope':'Current39 model candidates:3 named pulse preparations','dependentRecipes':';'.join(byreason['PEA_SOUP_PREPARATION']+byreason['MUNG_PORRIDGE_MODEL']+byreason['BROAD_BEAN_PUREE']),'actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Dried/split/dehulled food identity and boiled-versus-pureed preparation match; weighted complete input review','risk':'One boiled-pulse GI does not validate every pulse or preparation'},
 {'methodId':'RAW_BERRY_GI_AND_PRODUCT','scope':'Current39 model candidates:raw mixed-berry dishes','dependentRecipes':';'.join(byreason['BERRY_GI']),'actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Berry species/preparation GI or justified analogy; almond-drink and sweetener product definitions','risk':'Raw strawberry GI40 does not automatically establish raspberry/blueberry GI'},
 {'methodId':'EXACT_PRODUCT_MASS_VARIANTS','scope':'Current38 product/preparation cases','dependentRecipes':';'.join(r['recipeId'] for r in priority if r['category']=='3'),'actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Individual exact variants, followed by the residual GI/source gate; no bulk approval','risk':'Resolving product/mass may leave GI, retained fraction or cooking mismatch;38 is not38 numeric gains'},
]
for r in methods:r['dependentRecipeCount']=len(r['dependentRecipes'].split(';')) if r['dependentRecipes'] else 0
writecsv('method-impact.csv',methods)
summary=load(out/'summary.json');summary.update({'sharedA':10,'sharedB':6,'newSupplementB':0,'newAssumptionResearchCases':4,'uniqueJointNumericCandidates':16,'jointCoverage':'172/326','jointCoveragePercent':52.76,'target30Shortfall':14,'remainingAfterJointCandidatesTo80':89,'priorityModelCandidates':39,'priorityProductPreparationCandidates':38,'priorityUnresolvedAfterKnownB':71,'newApprovedPublishedNumeric':0,'ownerClarification':'GK-only further preparation and B research authorized; no new GI assumptions or publication authorized','assumptionScenariosExcludedFromCandidateAndCoverageCounts':True})
(out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'finalizedCandidates':16,'A':10,'B':6,'priority77':77,'priorityUnresolved':71,'additionalApprovedNumeric':0,'parkedAssumptions':4,'methodGroups':len(methods)}))
