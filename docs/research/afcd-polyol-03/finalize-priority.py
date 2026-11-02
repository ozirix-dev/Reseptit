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
base_summary={'finalizedCandidates':16,'A':10,'B':6,'priority77':77,'priorityUnresolved':71,'additionalApprovedNumeric':0,'parkedAssumptions':4,'methodGroups':len(methods)}

if len(sys.argv)>5:
 source_dir,source_results=map(pathlib.Path,sys.argv[4:6])
 additions=[json.loads(line) for line in (source_dir/'cases.jsonl').read_text(encoding='utf-8').splitlines()]
 source_eval=load(source_results/'source-first-results.json')
 expected={r['recipeId']:r for r in source_eval['results']}
 assert len(additions)==len(expected)==len({c['recipeId'] for c in additions})
 assert not {c['recipeId'] for c in additions}&{r['recipeId'] for r in rows}
 assert all(c['recipeId'] in {r['recipeId'] for r in priority} for c in additions)
 assert all(expected[c['recipeId']]['numericProposal'] and expected[c['recipeId']]['publicationAuthorized'] is False for c in additions)
 extra_ids={c['recipeId'] for c in additions};all_ids=extra_ids|{r['recipeId'] for r in rows}
 for r in priority:
  r['sourceExtensionNumeric']=r['recipeId'] in extra_ids
  r['jointPreparedNumeric']=bool(r['currentPilotNumeric'] or r['sourceExtensionNumeric'])
 writecsv('priority77.csv',priority)
 methods.append({'methodId':'CURRENT_A_SOURCE_PRODUCT_BOUNDS','scope':'Current A physical/label upper bounds with fixed original ingredient amounts','dependentRecipes':'japanilainen-dashimaki-tamago-aamiaislautasella;japanilainen-hojicha-jogurtti-persimonilla','actualPreparedNumeric':0,'additionalBeyond16':0,'approvedNewPublished':0,'researchArithmeticOnly':0,'remainingConditions':'Exact manufacturer dilution/product and current source assignments; unchanged per-ingredient and cumulative A bounds; owner version review','risk':'Labels are source-model upper bounds, not biological limits. Hojicha also belongs to product38; count unique IDs, not row sums.','dependentRecipeCount':2})
 for m in methods:
  ids=set(m['dependentRecipes'].split(';'));prepared=ids&all_ids;selected=ids&extra_ids
  m['actualPreparedNumeric']=len(prepared);m['additionalBeyond16']=len(selected);m['preparedRecipeIds']=';'.join(sorted(prepared))
  if selected:m['remainingConditions']+='; only '+','.join(sorted(selected))+' verified; other dependent recipes remain unresolved'
  if m['methodId']=='PULSE_PREPARATION_GROUP':m['risk']+='; cashew22-27 spread does not bound mung/rice porridge uncertainty'
  if m['methodId']=='RAW_BERRY_GI_AND_PRODUCT':m['risk']+='; bilberry proposal is explicit LOW Canadian-blueberry interspecies analogy; chia/raspberry case remains HOLD'
 assert set().union(*(set(m['preparedRecipeIds'].split(';'))-{''} for m in methods))==all_ids
 writecsv('method-impact.csv',methods)
 a=sum(r['level']=='A' for r in rows)+sum(c['level']=='A' for c in additions)
 b=sum(r['level']=='B' for r in rows)+sum(c['level']=='B' for c in additions)
 total=len(all_ids);conditional=156+total;unresolved=sum(not r['jointPreparedNumeric'] for r in priority)
 summary.update({'sharedA':10,'sharedB':6,'newSupplementA':sum(c['level']=='A' for c in additions),'newSupplementB':sum(c['level']=='B' for c in additions),'uniqueJointNumericCandidates':total,'preparedA':a,'preparedB':b,'jointCoverage':str(conditional)+'/326','jointCoveragePercent':round(100*conditional/326,2),'target30Shortfall':30-total,'remainingAfterJointCandidatesTo80':261-conditional,'priorityUnresolvedAfterAllPrepared':unresolved,'upstreamMethodAndContentApproved':16,'upstreamAdditionalUnapprovedCandidate':1,'newDistinctBeyondCurrentUpstream17':total-17,'extensionMethodAndVersionApprovalsRequired':len(additions),'newApprovedPublishedNumeric':0,'upstreamHead':'54615726324d855bbfe0d72c3fc3ba58ceced9d4','ownerClarification':'Original16 exact approval recorded upstream; all supplement versions unapproved, no release approval','methodImpactRowsOverlap':'Hojicha belongs to product38 and A source/bound method; unique preparedRecipeIds union gives total, never sum row counts'})
 (out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 base_summary.update({'finalizedCandidates':total,'A':a,'B':b,'priorityUnresolved':unresolved,'currentUpstreamMethodContentApproved':16,'newDistinctBeyondCurrentUpstream17':total-17,'methodGroups':len(methods)})
print(json.dumps(base_summary))
