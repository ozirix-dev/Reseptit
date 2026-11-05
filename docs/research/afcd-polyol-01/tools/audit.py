"""AFCD-POLYOL-01: source-deduplicated, read-only dependency/Decimal audit.
No recipe engine execution, approval transfer, source rewrite or publication.
"""
import argparse, collections, csv, hashlib, json, re, subprocess
from decimal import Decimal as D
from pathlib import Path
import openpyxl

SPECIES={'glycerol':25,'erythritol':28,'maltitol':29,'mannitol':30,'xylitol':31,'sorbitol':37}
VALUECOLS={**SPECIES,'available_without':39,'available_with':40,'protein':8,'fat':10,'fibre':12}
BASE='4a804757d5f9732938928dcba8f79ea0674ad98c'
def dec(v):return None if v is None else D(str(v))
def fmt(v):return '' if v is None else format(v.normalize(),'f') if isinstance(v,D) else str(v)
def sha(raw):return hashlib.sha256(raw).hexdigest()
def scratch(p):
    p=p.resolve();q=p
    while not q.exists():q=q.parent
    test=subprocess.run(['git','rev-parse','--show-toplevel'],cwd=q,capture_output=True,text=True)
    if test.returncode!=128:raise ValueError('Output must be outside Git worktrees')
    p.mkdir(parents=True,exist_ok=True);return p
def writecsv(path,rows,columns):
    with path.open('w',encoding='utf8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=columns,extrasaction='ignore');w.writeheader()
        for row in rows:w.writerow({k:fmt(row.get(k)) for k in columns})
def native(record):
    text=' '.join(str(record.get(k,'')) for k in ['id','sourceUrl','afcdId','source_id'])
    ref=record.get('referenceRecord',record.get('fullReferenceRecord',{})) or {}
    candidates={x.upper() for x in re.findall(r'F\d{6}',text,re.I)}
    if re.fullmatch(r'F\d{6}',str(ref.get('source_id',''))):candidates.add(ref['source_id'])
    if re.match(r'^A\d{6}(?:-|$)',str(record.get('id',''))):candidates.add('F'+record['id'][1:7])
    is_afcd='foodstandards.gov.au' in text or str(record.get('id','')).startswith('afcd-') or bool(candidates)
    if not is_afcd:return None
    if len(candidates)!=1:raise ValueError(('Ambiguous native AFCD identity',record.get('id'),candidates))
    return next(iter(candidates))
def source_record(comp):
    record=comp.get('sourceRecord',{})
    if 'originalComposition' not in record:return record
    original=record['originalComposition']['sourceRecord'];copy={**original,'per100g':dict(original.get('per100g',{}))}
    contract=record.get('correctedPolyolContract',{})
    if contract.get('unknownAggregate'):
        copy['per100g']['polyols']=None;copy['polyolsValue']=None;copy['polyolsSourceVerified']=False
        copy['polyolsEvidence']='EXPLICIT_UNKNOWN_TOTAL_WITH_SEPARATE_PARTIAL_PAIR_CONTRACT'
    return copy
def main():
    ap=argparse.ArgumentParser();ap.add_argument('repo',type=Path);ap.add_argument('sources',type=Path);ap.add_argument('output',type=Path);ap.add_argument('--cohort',type=Path,required=True);ap.add_argument('--probe',type=Path,required=True);a=ap.parse_args()
    root=a.repo.resolve();source=a.sources.resolve();out=scratch(a.output);input_hashes={}
    source_manifest=json.loads((source/'manifest.json').read_text('utf8'))
    for entry in source_manifest:assert sha((source/entry['name']).read_bytes())==entry['sha256']
    probe=json.loads(a.probe.read_text('utf8'))
    definitions=openpyxl.load_workbook(source/'nutrients.xlsx',read_only=True,data_only=True)['Proximates']
    assert definitions['A38'].value=='Available carbohydrate, without sugar alcohols'
    assert definitions['A39'].value=='Available carbohydrate, with sugar alcohols'
    assert all(term in definitions['G39'].value.lower() for term in ['sorbitol','mannitol','glycerol'])
    notes={'genericWithEquationAdds':['sorbitol','mannitol','glycerol'],'extraSpeciesColumns':['erythritol','maltitol','xylitol'],'withoutMayUseLabelDifferenceMethod':'label' in definitions['H38'].value.lower(),'reportingLimits':{definitions[f'A{row}'].value:str(definitions[f'E{row}'].value) for row in [35,36,37]},'definitionsLocator':'Proximates!G38:H39; E35:E37','individualBlankMeans':'not reported, never inferred zero','aggregatePolyolReported':False}
    (out/'source-notes.json').write_text(json.dumps(notes,indent=2)+'\n',encoding='utf8')
    def raw(p):
        p=root/p if not Path(p).is_absolute() else Path(p);b=p.read_bytes();input_hashes[p.relative_to(root).as_posix()]=sha(b);return b
    def load(p):return json.loads(raw(p).decode('utf8'))
    # Only top-level scalar metadata is needed. Reject unsupported syntax instead
    # of guessing at YAML structures. No ingredient parsing from prose.
    recipes={}
    for p in sorted((root/'reseptit').rglob('*.md')):
        text=raw(p).decode('utf8').replace('\r\n','\n');parts=re.split(r'^---\s*$',text,maxsplit=2,flags=re.M)
        if len(parts)!=3:continue
        meta=dict(re.findall(r'^([a-z_]+):[ \t]*([^\r\n]*)$',parts[1],re.M))
        def scalar(k):
            v=meta.get(k,'').strip()
            return json.loads(v) if v.startswith('"') else v[1:-1].replace("''", "'") if v.startswith("'") and v.endswith("'") else v
        if scalar('status')!='published' or scalar('language')!='fi':continue
        id=scalar('recipe_id');assert re.fullmatch('[a-z0-9-]+',id) and id not in recipes
        vals={}
        for k in ['carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g']:
            v=scalar(k)
            if v in ['',None,'null','~']:vals[k]=None
            else:assert re.fullmatch(r'\d+(?:\.\d+)?',v),(id,k,v);vals[k]=D(v)
        recipes[id]={'path':p.relative_to(root).as_posix(),'values':vals,'published':all(v is not None for v in vals.values())}
    assert len(recipes)==326
    reference={r['source_id']:r for r in load('docs/nutrition/afcd-release-3-reference.json')['foods']}
    registry=load('docs/nutrition/food-records.json');foods={f['id']:f for f in registry}
    evidence={p.stem:load(p) for p in sorted((root/'docs/nutrition/calculations').glob('*.json'))}
    graph=[];aliases={};cohort=set();native_use=collections.defaultdict(set);macro_claims=[]
    def alias(record,context):
        id=native(record)
        if not id:return None
        local=record.get('id',context);v=record.get('per100g',{});p=v.get('polyols',record.get('polyolsValue'))
        method='PAIR_AS_TOTAL' if re.search(r'paired|with-minus-without|with/without',str(record.get('polyolsEvidence','')),re.I) else 'SCOPED_OR_OTHER'
        av=v.get('carbohydrate',v.get('availableCarbohydrate'))
        normalized={'native_id':id,'local_record_id':local,'method':method,'carbohydrate_definition':record.get('carbohydrateDefinition',''),'claimed_polyols_per100g':p,'polyols_verified_flag':record.get('polyolsSourceVerified'),'available_per100g':av,'protein_per100g':v.get('protein'),'fat_per100g':v.get('fat'),'fibre_per100g':v.get('fibre')}
        variant=sha(json.dumps(normalized,sort_keys=True,separators=(',',':')).encode())[:16]
        assert variant not in aliases or aliases[variant]=={'variant_id':variant,**normalized}
        aliases[variant]={'variant_id':variant,**normalized}
        return id,local,method,variant
    for id,e in evidence.items():
        assert id in recipes
        if 'scopedPolyolC' in e or 'recoveryC' in e:
            p=e.get('scopedPolyolC',e.get('recoveryC'));comps={c['id']:c for c in p['comps']}
            case=p['case']['ingredients'] if 'scopedPolyolC' in e else p['reviewedCase']['pilot']['ingredients']
            for ix,i in enumerate(case):
                comp=comps.get(i['sourceId'],{});resolved=alias(source_record(comp),i['sourceId'])
                if not resolved:continue
                nid,local,_,variant=resolved;native_use[nid].add(id)
                weight=None if i.get('massG') is None else D(str(i['massG']))*D(str(i.get('retention',1)))/100/D(e['servings'])
                graph.append({'native_id':nid,'recipe_id':id,'channel':'MACRO','scenario':'closed','row':ix,'local_record_id':local,'variant_id':variant,'method':'MACRO_CLOSED_SOURCE_ACCOUNTING','coefficient_per100g_per_serving':weight,'used':True,'published_macros':recipes[id]['published'],'source_path':f'docs/nutrition/calculations/{id}.json'})
            continue
        for ix,i in enumerate(e['ingredients']):
            f=i.get('record',{});resolved=alias(f,f'{id}:{ix}')
            if not resolved:continue
            nid,local,method,variant=resolved
            initial='foodstandards.gov.au' in f.get('sourceUrl','') and 'paired' in str(f.get('polyolsEvidence','')).lower()
            if initial:cohort.add(id)
            factor=1 if i['unit']=='g' else 1000 if i['unit']=='kg' else i.get('gramsPerUnit')
            operands=[i.get('amount'),factor,i.get('edibleFraction'),i.get('retainedFraction')]
            weight=None if any(x is None for x in operands) else D(str(operands[0]))*D(str(operands[1]))*D(str(operands[2]))*D(str(operands[3]))/D(e['servings'])/100
            effective=not bool(i.get('excludedReason'))
            graph.append({'native_id':nid,'recipe_id':id,'channel':'MACRO','scenario':'current','row':ix,'local_record_id':local,'variant_id':variant,'method':method,'coefficient_per100g_per_serving':weight,'used':effective,'published_macros':recipes[id]['published'],'source_path':f'docs/nutrition/calculations/{id}.json'})
            native_use[nid].add(id)
            if effective:macro_claims.append((id,nid,weight,dec(f.get('per100g',{}).get('polyols',f.get('polyolsValue'))),initial))
    observed_cohort=set(cohort);original_cohort=json.loads(a.cohort.read_text('utf8'));cohort=set(original_cohort['recipeIds']);assert len(cohort)==172;assert cohort<=set(recipes)
    # Effective GK routes: base inputs, then declared release-pack overrides,
    # followed by the three closed owner-approved scope routes. No calculation.
    effective={r['recipeId']:('GENERIC',r,None,'docs/nutrition/glycemic-load-pilot-input.json') for r in load('docs/nutrition/glycemic-load-pilot-input.json')['recipes']}
    release=load('docs/nutrition/gk80-release-registry.json')
    for pack in release['requiredPacks']:
        folder='docs/nutrition/'+pack['folder']
        comps={x['id']:x for x in load(folder+'/composition-sources.json')['records']}
        for r in load(folder+'/recipes.json')['recipes']:effective[r['recipeId']]=('RELEASE',r,comps,folder+'/recipes.json')
    for id,e in evidence.items():
        if 'scopedPolyolC' in e or 'recoveryC' in e:
            p=e.get('scopedPolyolC',e.get('recoveryC'));r=p.get('recipe',p.get('candidate'));effective[id]=('CLOSED_SCOPE',r,{x['id']:x for x in p['comps']},f'docs/nutrition/calculations/{id}.json')
    for id,(route,r,comps,sourcepath) in effective.items():
        assert id in recipes
        scenarios=[{'name':'current','ingredients':r['ingredients']}] if route=='GENERIC' else r['scenarios']
        for sn,sc in enumerate(scenarios):
            for ix,i in enumerate(sc['ingredients']):
                if route=='GENERIC':f=foods.get(i.get('fineliRecordId'),{});local=i.get('fineliRecordId');weight=None if i.get('grams') is None else D(str(i['grams']))/100/D(r['servings']);method='GK_AVAILABLE_ONLY';used=not bool(i.get('excludedReason'))
                else:
                    c=comps.get((i.get('composition') or {}).get('sourceId'),{});f=source_record(c);local=c.get('id');weight=None if i.get('massG') is None else D(str(i['massG']))*D(str(i.get('retention',1)))/100/D(r['servings']);method='GK_'+route;used=bool(i.get('composition'))
                resolved=alias(f,local or f'{id}:{ix}')
                if not resolved:continue
                nid,_,_,variant=resolved;native_use[nid].add(id)
                definition=f.get('carbohydrateDefinition',i.get('carbohydrateDefinition',''))
                graph.append({'native_id':nid,'recipe_id':id,'channel':'GK','scenario':str(sn),'row':ix,'local_record_id':local,'variant_id':variant,'method':method,'coefficient_per100g_per_serving':weight,'used':used,'published_macros':recipes[id]['published'],'source_path':sourcepath,'carbohydrate_definition':definition})
    # Also inspect unused registry copies with an already demonstrable CHO binding
    # mismatch. Do not count an unused copy as an active recipe dependency.
    for f in registry:
        nid=native(f)
        if nid and f.get('carbohydrateDefinition')=='EU_AVAILABLE':
            value=dec(f.get('per100g',{}).get('carbohydrate'));expected=dec(reference[nid]['available_carbohydrate_without_sugar_alcohols_g_per_100g'])
            if value is not None and value!=expected:alias(f,f['id']);native_use.setdefault(nid,set())
    # Read the publisher's workbook once per file; all 1588 rows are indexed,
    # only sources actually referenced in the graph are emitted.
    for nid in original_cohort['nativeIds']:native_use.setdefault(nid,set())
    wb=openpyxl.load_workbook(source/'profiles.xlsx',read_only=True,data_only=True)
    sheet=wb['All solids & liquids per 100 g'];native_rows={}
    for row in sheet.iter_rows(min_row=4):
        nid=row[0].value
        if nid not in native_use:continue
        native_rows[nid]={'name':row[3].value,'derivation':row[2].value,'excel_row':row[0].row,**{k:dec(row[c-1].value) for k,c in VALUECOLS.items()}}
    assert set(native_rows)==set(native_use),(set(native_use)-set(native_rows))
    wb.close();details={}
    wb=openpyxl.load_workbook(source/'details.xlsx',read_only=True,data_only=True)
    for row in wb['Food details'].iter_rows(min_row=4):
        if row[0].value in native_use:details[row[0].value]={'row':row[0].row,'derivation':row[2].value,'sampling':row[5].value or ''}
    wb.close()
    matrix=[];source_decisions={};ref_mismatch=[]
    mapping={'available_without':'available_carbohydrate_without_sugar_alcohols_g_per_100g','available_with':'available_carbohydrate_with_sugar_alcohols_g_per_100g','protein':'protein_g_per_100g','fat':'fat_g_per_100g','fibre':'fibre_g_per_100g',**{k:k+'_g_per_100g' for k in SPECIES}}
    for nid,n in sorted(native_rows.items()):
        assert nid in reference
        for k,refkey in mapping.items():
            if n[k]!=dec(reference[nid].get(refkey)):ref_mismatch.append((nid,k,fmt(n[k]),reference[nid].get(refkey)))
        delta=n['available_with']-n['available_without'];reported={k:n[k] for k in SPECIES if n[k] is not None};partial=sum(reported.values(),D(0))
        # A display-rounding compatibility check, not biological uncertainty:
        # one displayed decimal in native numeric cells => up to .05 each;
        # the pair difference contributes .10. Missing species remain missing.
        gap=partial-delta;rounding_budget=D('.05')*len(reported)+D('.10')
        robust=gap>rounding_budget
        group='KNOWN_PARTIAL_EXCEEDS_PAIR' if robust else 'NONZERO_PAIR_WITH_PARTIAL_PANEL' if delta!=0 else 'ZERO_PAIR_WITH_SOME_REPORTED_ZEROS' if reported else 'ZERO_PAIR_WITHOUT_SPECIES_OBSERVATIONS'
        mac={x['recipe_id'] for x in graph if x['native_id']==nid and x['channel']=='MACRO' and x['used']}
        gk={x['recipe_id'] for x in graph if x['native_id']==nid and x['channel']=='GK' and x['used']}
        paired={x['recipe_id'] for x in graph if x['native_id']==nid and x['channel']=='MACRO' and x['method']=='PAIR_AS_TOTAL'}
        row={'native_id':nid,'name':n['name'],'food_derivation':n['derivation'],'group':group,'dependent_recipes':len(mac|gk),'referenced_recipes':len(native_use[nid]),'cohort_recipes':len(native_use[nid]&cohort),'paired_macro_recipes':len(paired),'macro_recipes':len(mac),'gk_recipes':len(gk),'available_without':n['available_without'],'available_with':n['available_with'],'pair_difference':delta,**{k:n[k] for k in SPECIES},'known_reported_partial':partial if reported else None,'species_reported_count':len(reported),'polyols_total':'UNKNOWN','robust_known_understatement_per100g':gap if robust else None,'display_rounding_budget':rounding_budget,'profile_locator':f"All solids & liquids per 100 g!AM{n['excel_row']}:AN{n['excel_row']}",'details_locator':f"Food details!E{details[nid]['row']}:F{details[nid]['row']}",'decision':'BLOCK_PAIR_AS_TOTAL; KEEP_AVAILABLE_P_F'}
        matrix.append(row);source_decisions[nid]=row
    assert not ref_mismatch,ref_mismatch
    variant_mismatches=[]
    for v in aliases.values():
        expected=native_rows[v['native_id']]['available_without'];actual=dec(v['available_per100g'])
        v['active_dependency_rows']=sum(x['variant_id']==v['variant_id'] and x['used'] for x in graph)
        v['available_matches_native_without']=actual==expected
        v['source_alignment']='AVAILABLE_BINDING_MISMATCH' if actual is not None and actual!=expected else 'MATCH' if actual is not None else 'NO_NORMALIZED_VALUE'
        if v['source_alignment']=='AVAILABLE_BINDING_MISMATCH':variant_mismatches.append(v.copy())
    for row in matrix:
        bad=[v for v in variant_mismatches if v['native_id']==row['native_id']]
        row['bad_available_variants']=len(bad);row['bad_available_active_rows']=sum(v['active_dependency_rows'] for v in bad)
        row['numerical_issue']='AVAILABLE_BINDING_MISMATCH' if bad else 'HISTORICAL_PARTIAL_SUM_UNDERSTATEMENT' if row['robust_known_understatement_per100g'] is not None else 'NO_NUMERICAL_ERROR_DEMONSTRATED'
    effects=[]
    for id in sorted({x['recipe_id'] for x in graph}|cohort):
        ms=[x for x in graph if x['recipe_id']==id and x['channel']=='MACRO' and x['used']];gs=[x for x in graph if x['recipe_id']==id and x['channel']=='GK' and x['used']]
        confirmed=D(0);missing_mass=False;errors=[]
        for rid,nid,w,currentp,initial in macro_claims:
            if rid!=id or not initial:continue
            n=source_decisions[nid]
            if n['robust_known_understatement_per100g'] is not None:
                if w is None or currentp is None:missing_mass=True
                else:
                    correction=max(D(0),n['known_reported_partial']-currentp)*w;confirmed+=correction
                    if correction>0:errors.append(nid)
        bad_edges=[x for x in [*ms,*gs] if aliases[x['variant_id']]['source_alignment']=='AVAILABLE_BINDING_MISMATCH']
        gk_other=[x for x in gs if x.get('carbohydrate_definition') not in ['EU_AVAILABLE','AVAILABLE_EXCLUDING_FIBRE_AND_POLYOLS']]
        effects.append({'recipe_id':id,'initial_cohort':id in cohort,'published_macro_package':recipes[id]['published'],'macro_sources':len({x['native_id'] for x in ms}),'gk_sources':len({x['native_id'] for x in gs}),'net_numeric_delta':'0: available-without retained' if ms else 'NOT_APPLICABLE','total_numeric_delta':'UNKNOWN: total polyols unreported' if ms else 'NOT_APPLICABLE','protein_numeric_delta':'0' if ms else 'NOT_APPLICABLE','fat_numeric_delta':'0' if ms else 'NOT_APPLICABLE','gk_numeric_delta':'SOURCE_AVAILABLE_FIX_REQUIRED' if any(x['channel']=='GK' for x in bad_edges) else 'REVIEW' if gk_other else '0: available dependency only' if gs else 'NOT_APPLICABLE','known_total_understatement_nominal_g_per_serving':None if missing_mass else confirmed if errors else None,'confirmed_error_sources':';'.join(sorted(set(errors))),'available_binding_mismatch_channels':';'.join(sorted({x['channel'] for x in bad_edges})),
                        'decision':'AVAILABLE_BINDING_MISMATCH' if bad_edges else 'CLOSED_SOURCE_ACCOUNTING_PRESERVED' if any(x['method']=='MACRO_CLOSED_SOURCE_ACCOUNTING' for x in ms) else 'HISTORICAL_ERROR_ALREADY_WITHHELD' if errors and not recipes[id]['published'] else 'CONFIRMED_PUBLISHED_ERROR' if errors else 'TOTAL_UNCERTAIN_OTHER_NUMBERS_UNCHANGED' if ms else 'GK_AVAILABLE_UNCHANGED' if gs else 'NO_CURRENT_AFCD_DEPENDENCY'})
    current_cohort_natives={x['native_id'] for x in graph if x['channel']=='MACRO' and x['method']=='PAIR_AS_TOTAL' and x['recipe_id'] in cohort};initial_natives=set(original_cohort['nativeIds'])
    summary={'baseMain':BASE,'auditHead':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'publishedRecipes':326,'initialCohortRecipes':len(cohort),'initialCohortNativeSources':len(initial_natives),'initialCohortLocalRecordIds':original_cohort['originalLocalRecordIds'],'currentCohortNativeSources':len(current_cohort_natives),'currentPairedTextRecipes':len(observed_cohort),'initialCohortPairedRows':original_cohort['originalIngredientRows'],'currentCohortPairedRows':sum(x['channel']=='MACRO' and x['method']=='PAIR_AS_TOTAL' and x['recipe_id'] in cohort for x in graph),'allReferencedNativeSources':sum(bool(v) for v in native_use.values()),'allDependentNativeSources':len({x['native_id'] for x in graph if x['used']}),'matrixNativeSources':len(matrix),'allReferencedRecipes':len({x['recipe_id'] for x in graph}),'allDependentRecipes':len({x['recipe_id'] for x in graph if x['used']}),'recipeReviewRows':len(effects),'dependencyRows':len(graph),'usedDependencyRows':sum(x['used'] for x in graph),'ignoredReferenceRows':sum(not x['used'] for x in graph),'currentPairAsTotalMacroSources':len({x['native_id'] for x in graph if x['channel']=='MACRO' and x['method']=='PAIR_AS_TOTAL' and x['used']}),'currentPairAsTotalMacroRecipes':len({x['recipe_id'] for x in graph if x['channel']=='MACRO' and x['method']=='PAIR_AS_TOTAL' and x['used']}),'sourceGroups':dict(collections.Counter(x['group'] for x in matrix)),'initialSourceGroups':dict(collections.Counter(x['group'] for x in matrix if x['native_id'] in initial_natives)),'recipeDecisions':dict(collections.Counter(x['decision'] for x in effects)),'confirmedErrorRecipes':[x for x in effects if x['confirmed_error_sources']],'historicalConfirmedNumericErrorRecipes':2,'currentPublishedGkNumericErrorRecipes':sum(x['channel']=='GK' and x['before']['status']=='CALCULATED' and x['before']['rounded']!=x['afterAvailableOnlyCorrection']['rounded'] for x in probe),'currentHeldGkBindingErrorRecipes':sum(x['decision']=='AVAILABLE_BINDING_MISMATCH' for x in effects)-sum(x['channel']=='GK' and x['before']['status']=='CALCULATED' and x['before']['rounded']!=x['afterAvailableOnlyCorrection']['rounded'] for x in probe),'cohortFileSha256':sha(a.cohort.read_bytes()),'confirmedPublishedMacroErrorRecipes':sum(x['decision']=='CONFIRMED_PUBLISHED_ERROR' for x in effects),'availableBindingMismatchVariants':variant_mismatches,'normalizationVariantCount':len(aliases),'activeAvailableMismatchVariants':sum(v['active_dependency_rows']>0 for v in variant_mismatches),'inactiveRegistryAvailableMismatchVariants':sum(v['active_dependency_rows']==0 for v in variant_mismatches),'proposedProductionWrites':0,'rawReferenceMismatches':ref_mismatch,'gkPolyolDependentRows':[x for x in graph if x['channel']=='GK' and x['used'] and x.get('carbohydrate_definition') not in ['EU_AVAILABLE','AVAILABLE_EXCLUDING_FIBRE_AND_POLYOLS']],'rawSourceFiles':source_manifest,'targetedProbe':probe,'inputHashes':input_hashes}
    writecsv(out/'source-decisions.csv',matrix,list(matrix[0]))
    writecsv(out/'recipe-dependencies.csv',graph,['native_id','recipe_id','channel','scenario','row','local_record_id','variant_id','method','coefficient_per100g_per_serving','used','published_macros','source_path'])
    writecsv(out/'normalization-variants.csv',sorted(aliases.values(),key=lambda x:(x['native_id'],str(x['local_record_id']))),list(next(iter(aliases.values()))))
    writecsv(out/'recipe-effects.csv',effects,list(effects[0]))
    (out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2,default=str)+'\n',encoding='utf8')
    print(json.dumps({k:v for k,v in summary.items() if k not in ['inputHashes','rawSourceFiles','targetedProbe']},ensure_ascii=False,indent=2,default=str))
if __name__=='__main__':main()
