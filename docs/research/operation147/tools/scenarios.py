from scratch_scope import assert_scratch
"""Read-only Decimal research scenarios. Output is review material, never activation."""
import argparse, collections, csv, hashlib, json, re
from decimal import Decimal, ROUND_HALF_UP, getcontext
from pathlib import Path
getcontext().prec=40
D=lambda value:Decimal(str(value))
FIELDS=('netCarbohydrate','totalCarbohydrate','protein','fat')
META=('carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g')
def load(p):return json.loads(p.read_text(encoding='utf8'))
def dump(p,value):p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def rounded(x):return float(x.quantize(D('.01'),rounding=ROUND_HALF_UP)) if x is not None else None
def finite(x):return isinstance(x,(int,float)) and x>=0
def exact_fields(row):
    e=row['evidence'];c=row['checked']['calculated']
    if not e or not c or e.get('recoveryC') or e.get('scopedPolyolC'):return None
    sums={k:D(0) for k in FIELDS};counts={k:0 for k in FIELDS};net2=D(0);net2ok=True;normal=0
    for i,cr in zip(e['ingredients'],c['rows']):
        if i.get('excludedReason'):continue
        normal+=1;r=i.get('record',{});v=r.get('per100g',{});definition=r.get('carbohydrateDefinition')
        # Preserve all structural/source/conversion/retention validation performed by S0.
        structural=[x for x in cr['issues'] if not x.startswith('Unknown nutrient ')]
        if structural or cr['grams'] is None:
            net2ok=False;continue
        factor=D(1) if i['unit']=='g' else D(1000) if i['unit']=='kg' else D(i['gramsPerUnit'])
        w=D(i['amount'])*factor*D(i['edibleFraction'])*D(i['retainedFraction'])/D(100)/D(e['servings'])
        comp=r.get('componentValues',{})
        ch=comp.get('CHO',v.get('carbohydrate'));fi=comp.get('FIBT',v.get('fibre'));po=comp.get('POLYL',v.get('polyols'))
        available=None
        if definition=='EU_AVAILABLE' and finite(ch):available=D(ch)
        if definition=='EU_TOTAL_INCLUDING_POLYOLS' and finite(ch) and finite(po):available=D(ch)-D(po)
        if definition=='US_TOTAL_INCLUDING_FIBRE' and finite(ch) and finite(fi):available=D(ch)-D(fi)
        net=available if definition in ['EU_AVAILABLE','EU_TOTAL_INCLUDING_POLYOLS'] else available-D(po) if available is not None and finite(po) else None
        verified=(r.get('polyolsSourceVerified') is True and bool(r.get('polyolsEvidence','').strip())) or ('POLYL' in comp and r.get('componentIds',{}).get('POLYL')==2260)
        if not verified or not finite(po):net=None
        values={'protein':D(v['protein']) if finite(v.get('protein')) else None,'fat':D(v['fat']) if finite(v.get('fat')) else None,'netCarbohydrate':net,'totalCarbohydrate':available+D(fi)+D(po) if available is not None and finite(fi) and finite(po) else None}
        for k,x in values.items():
            if x is not None:sums[k]+=x*w;counts[k]+=1
        if definition=='EU_AVAILABLE' and available is not None:net2+=available*w
        elif net is not None:net2+=net*w
        else:net2ok=False
    exact={k:sums[k] if counts[k]==normal else None for k in FIELDS}
    return {'exact':exact,'s2Net':net2 if net2ok else None,'normalRows':normal}
def caps_for_chicken(row,root):
    """Four explicitly reviewed small ingredients; no recipe amounts changed.
    Nominal source-accounting ceilings, NOT population/lot maxima. Raw lemon peel
    is an already-reviewed proxy for zest. Energy missing for garlic: mass*9 cap.
    """
    sources=load(root/'docs/nutrition/gk80-operation143/usda-omission-sources.json')
    prior=load(root/'docs/nutrition/gk80-operation142/integration.json')
    extras={s['fdc_id']:s for s in prior['extraUsdaSources']}
    mapping={5:'170938',6:'171325',7:'170931',8:'167749'}
    cap={k:D(0) for k in (*FIELDS,'kcal')};details=[]
    for ix,sourceid in mapping.items():
        ingredient=row['evidence']['ingredients'][ix];assert ingredient['unit']=='g'
        w=D(ingredient['amount'])/D(100)/D(row['recipe']['servings'])
        if sourceid in sources:
            s=sources[sourceid];values={k:D(v['amount']) for k,v in s['nutrients'].items()};energy=D(s['energy']['amount'])
        elif sourceid in extras:
            values={k:D(v['amount']) for k,v in extras[sourceid]['nutrients'].items()};energy=values.get('1008',D(900))
        else:
            # The same USDA record's CHO/P/F are retained in current evidence;
            # energy is bounded by full ingredient mass, never inferred from CHO.
            r=ingredient['record'];assert sourceid in r['sourceUrl']
            values={'1005':D(r['per100g']['carbohydrate']),'1003':D(r['per100g']['protein']),'1004':D(r['per100g']['fat'])};energy=D(900)
        part={'netCarbohydrate':values['1005']*w,'totalCarbohydrate':values['1005']*w,'protein':values['1003']*w,'fat':values['1004']*w,'kcal':energy*w}
        for k,v in part.items():cap[k]+=v
        details.append({'ingredientIndex':ix,'item':ingredient['item'],'sourceId':sourceid,'massG':ingredient['amount'],'ceiling':{k:str(v) for k,v in part.items()},'energyRule':'mass * 9 kcal/g' if energy==900 else 'same-source energy'})
    # Values of the retained rows calculated from exact decimal input operands.
    e=row['evidence'];base={k:D(0) for k in FIELDS}
    for ix,i in enumerate(e['ingredients']):
        if ix in mapping or i.get('excludedReason'):continue
        r=i['record'];v=r['per100g'];assert r['carbohydrateDefinition']=='EU_AVAILABLE';assert all(finite(v.get(k)) for k in ['carbohydrate','fibre','polyols','protein','fat'])
        w=D(i['amount'])*D(i['edibleFraction'])*D(i['retainedFraction'])/D(100)/D(e['servings'])
        for k,vv in {'netCarbohydrate':D(v['carbohydrate']),'totalCarbohydrate':D(v['carbohydrate'])+D(v['fibre'])+D(v['polyols']),'protein':D(v['protein']),'fat':D(v['fat'])}.items():base[k]+=vv*w
    return {'base':base,'caps':cap,'details':details}
def glclass(value):
    n=int(D(value).quantize(D(1),rounding=ROUND_HALF_UP));return 'LOW' if n<=10 else 'MEDIUM' if n<=19 else 'HIGH'
def publicclass(value):return 'LOW' if D(value)<=10 else 'MEDIUM' if D(value)<20 else 'HIGH'
def display(value,modeled=False):
    if modeled and 0<D(value)<1:return '<1'
    return str(D(value).quantize(D(1),rounding=ROUND_HALF_UP)) if modeled else str(float(format(float(value),'.1g')))
def main():
    parser=argparse.ArgumentParser();parser.add_argument('root',type=Path);parser.add_argument('run',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args()
    root=args.root.resolve();run=args.run.resolve();out=args.output.resolve();assert_scratch(out);out.mkdir(parents=True,exist_ok=True)
    b=load(run/'baseline-internal.json');g=load(run/'gk-baseline.json');prod=load(run/'production.json');gks=load(run/'gk-sensitivity.json')
    assert b['recipes']==len(b['rows'])==326;assert len({r['recipeId'] for r in b['rows']})==326
    byid={r['recipeId']:r for r in b['rows']};assert set(byid)=={r['recipeId'] for r in g['results']}
    chicken=caps_for_chicken(byid['sitruuna-yrttikana-parsa'],root)
    scenario_names=['S0','S1','S2','S3_1','S3_1.5','S3_2','S3_relative','S4','S5','S6']
    ledger=[];checks=[];differences=[];rounding=[]
    for r in b['rows']:
        id=r['recipeId'];current={k:r['recipe'].get(m) for k,m in zip(FIELDS,META)}
        published=all(v is not None for v in current.values());e=r['evidence'];c=r['checked']['calculated'];calc=exact_fields(r)
        states={s:dict(current) for s in scenario_names};intervals={};fieldReasons={};latent={}
        # Published legacy values remain separately unverified; no new publication inferred.
        if calc:
            caps=c['omissionImpactUpperBoundPerServing'];safe=c['omissionWithinTolerance'] and not r['checked']['errors']
            for k,x in calc['exact'].items():
                expected=c['totalCarbohydratePerServingG'] if k=='totalCarbohydrate' else c['perServing'][k]
                assert rounded(x)==expected,(id,k,rounded(x),expected)
                checks.append((id,k))
                if not published and safe and x is not None:
                    states['S1'][k]=rounded(x);fieldReasons[k]='Independent current-source component, existing omission ceilings retained'
            if not published and safe and calc['s2Net'] is not None:
                latent['netCarbohydrate']=rounded(calc['s2Net'])
            # S2 alone retains atomic publication and required aggregate polyols.
            # S6 combines S1+S2 only, with original caps, hashes, scopes and sources.
            states['S6']=dict(states['S1'])
            if not published and safe and calc['s2Net'] is not None:states['S6']['netCarbohydrate']=rounded(calc['s2Net'])
            if published:
                for k,v in current.items():
                    x=calc['exact'][k]
                    if x is not None and rounded(x)!=v:differences.append({'recipeId':id,'field':k,'published':v,'calculated':rounded(x)})
        if id=='sitruuna-yrttikana-parsa':
            for s,limit in [('S3_1',D(1)),('S3_1.5',D('1.5')),('S3_2',D(2)),('S3_relative',None)]:
                limits={k:limit if limit is not None else min(D('1.5') if 'Carbohydrate' in k else D(1),max(D('.1'),abs(chicken['base'][k])*D('.05'))) for k in FIELDS}
                good=all(chicken['caps'][k]<=limits[k] for k in FIELDS) and chicken['caps']['kcal']<=10
                if good:states[s]={k:rounded(chicken['base'][k]) for k in FIELDS}
                intervals[s]={'classification':'REVIEW REQUIRED; nominal source-model envelope; raw-peel/zest proxy and tolerance require decision','fields':{k:{'lower':str(chicken['base'][k]),'upper':str(chicken['base'][k]+chicken['caps'][k]),'omissionCeiling':str(chicken['caps'][k]),'allowed':str(limits[k])} for k in FIELDS},'energyOmissionCeilingKcal':str(chicken['caps']['kcal']),'numericallyWithinLimits':good}
        unknown='NO_CURRENT_MACRO_EVIDENCE' if not e else 'WITHDRAWN_EXACT_HISTORICAL_PACKAGE' if c is None else 'CURRENT_INPUTS_INCOMPLETE' if r['checked']['status']!='ESTIMATE WITH EVIDENCE' else None
        record={'recipeId':id,'sourcePath':r['path'],'dietClass':r['recipe'].get('diet_class'),'baselineStatus':r['checked']['status'],'publishedPackage':published,'hasCurrentEvidence':bool(e),'reason':unknown,'scenarios':{},'latentS2Fields':latent,'boundedScenarios':intervals,'baselineIssues':[] if c is None else [{'item':x['item'],'issues':x['issues']} for x in c.get('rows',[]) if x['issues']]}
        for s,values in states.items():
            new=[k for k,v in values.items() if v is not None and current[k] is None]
            remaining=[k for k,v in values.items() if v is None]
            classification='REVIEW REQUIRED' if new else 'UNKNOWN' if unknown and not published else 'UNVERIFIED LEGACY' if published and not e else 'EXISTING ESTIMATE'
            record['scenarios'][s]={'values':values,'newFields':new,'remainingFields':remaining,'restoredPackage':not published and not remaining,'classification':classification,'gkChanged':False,'gkClassChanged':False}
        ledger.append(record)
    summaries=[]
    for s in scenario_names:
        rows=[r['scenarios'][s] for r in ledger]
        summaries.append({'scenario':s,'newRecipes':sum(bool(x['newFields']) for x in rows),'newFields':sum(len(x['newFields']) for x in rows),'fieldsByNutrient':{k:sum(k in x['newFields'] for x in rows) for k in FIELDS},'restoredPackages':sum(x['restoredPackage'] for x in rows),'remainingMissingFields':sum(len(x['remainingFields']) for x in rows),'recipesStillIncomplete':sum(bool(x['remainingFields']) for x in rows),'gkCount':g['summary']['calculated'],'gkDelta':0,'gkClassChanges':0,'numericConflicts':len(differences),'newRecipeIds':[r['recipeId'] for r in ledger if r['scenarios'][s]['newFields']],'unknownRecipesWithoutCurrentMacroEvidence':sum(not r['hasCurrentEvidence'] for r in ledger),'withdrawnPackagesNotReused':2,'safeProductionActivation':'NOT_AUTHORIZED'})
    # Exact 0.01 equality is separated from display precision; current actual mismatches counted above.
    for p,q in [('7.38','7.39'),('1.04','1.05'),('0.04','0.05')]:
        rounding.append({'a':p,'b':q,'sameAt1Decimal':D(p).quantize(D('.1'),rounding=ROUND_HALF_UP)==D(q).quantize(D('.1'),rounding=ROUND_HALF_UP),'meaning':'Display equality alone is not approval or a source-error bound'})
    envelope=[]
    for result in g['results']:
        if result['status']!='CALCULATED':continue
        v=result['unroundedGlycemicLoadPerServing'];v=result['glycemicLoadPerServing'] if v is None else v
        omitted=result['omittedAvailableCarbohydratePerServingG'];end=D(v)+D('1.5')*D(omitted)
        envelope.append({'recipeId':result['recipeId'],'point':v,'omittedChoG':omitted,'hypotheticalMax':str(end),'pointClass':glclass(v),'scenarioEndClass':glclass(end),'classCanChange':publicclass(v)!=publicclass(end),'coreClassCanChange':glclass(v)!=glclass(end),'publicPointClass':publicclass(v),'publicScenarioEndClass':publicclass(end),'displayCanChange':display(v,bool(result.get('assessmentType')))!=display(end,bool(result.get('assessmentType'))),'meaning':'0–150 GI response scenario for omitted CHO only; NOT a biological confidence/uncertainty bound; excludes all other source/analogue/retention variation'})
    for s in gks:
        for r in s['newResults']:
            v=r['unroundedGlycemicLoadPerServing'];end=D(v)+D('1.5')*D(r['omittedAvailableCarbohydratePerServingG'])
            r['auditScenario']={'pointClass':glclass(v),'scenarioEndClass':glclass(end),'classCanChange':publicclass(v)!=publicclass(end),'coreClassCanChange':glclass(v)!=glclass(end),'displayCanChange':display(v,bool(r.get('assessmentType')))!=display(end,bool(r.get('assessmentType'))),'end':str(end),'biologicalBoundEstablished':False}
    productionById={r['recipeId']:r for r in prod['rows']};productionDiff=[]
    publicKeys=('carbsNetG','carbsTotalG','proteinG','fatG')
    for r in b['rows']:
        p=productionById[r['recipeId']]
        if p['status']!=200:productionDiff.append({'recipeId':r['recipeId'],'error':p});continue
        for m,k in zip(META,publicKeys):
            if p['nutrition'].get(k)!=r['recipe'].get(m):productionDiff.append({'recipeId':r['recipeId'],'field':k,'production':p['nutrition'].get(k),'main':r['recipe'].get(m)})
    summary={'sourceCommit':b['sourceCommit'],'recipes':326,'publicPackages':sum(r['publishedPackage'] for r in ledger),'evidencePackages':sum(r['baselineStatus']=='ESTIMATE WITH EVIDENCE' for r in ledger),'legacyPackagesWithoutCurrentEvidence':sum(r['publishedPackage'] and not r['hasCurrentEvidence'] for r in ledger),'missingPackages':sum(not r['publishedPackage'] for r in ledger),'currentEvidenceFiles':sum(r['hasCurrentEvidence'] for r in ledger),'noEvidenceFiles':sum(not r['hasCurrentEvidence'] for r in ledger),'scenarios':summaries,'decimalComponentChecks':len(checks),'numericConflicts':differences,'productionDifferences':productionDiff,'productionGkSummary':prod['gkSummary'],'productionVerifiedAtUtc':prod['verifiedAtUtc'],'gk':g['summary'],'gkSensitivity':[{k:v for k,v in s.items() if k!='newResults'} for s in gks],'gkOmissionScenario':{'recipes':len(envelope),'classCanChange':sum(x['classCanChange'] for x in envelope),'coreClassCanChange':sum(x['coreClassCanChange'] for x in envelope),'displayCanChange':sum(x['displayCanChange'] for x in envelope),'biologicalBoundEstablished':False},'roundingExamples':rounding,'chickenCeilings':{k:str(v) for k,v in chicken['caps'].items()},'chickenBoundDetails':chicken['details']}
    dump(out/'summary.json',summary);dump(out/'recipe-scenarios.json',ledger);dump(out/'gk-threshold-sensitivity.json',gks);dump(out/'gk-omission-sensitivity.json',envelope);dump(out/'production.json',prod)
    rawHashes={};textHashes={};binaryFiles=[]
    for name in b['inputHashes']:
        data=(root/name).read_bytes();rawHashes[name]=hashlib.sha256(data).hexdigest()
        try:textHashes[name]=hashlib.sha256(data.decode('utf8').replace('\r\n','\n').encode()).hexdigest()
        except UnicodeDecodeError:binaryFiles.append(name)
    dump(out/'input-manifest.json',{'sourceCommit':b['sourceCommit'],'rawSha256':rawHashes,'normalizedLfSha256':textHashes,'binaryFiles':binaryFiles,'gkPilotSha256':b['gkPilotSha256'],'note':'Raw bytes for all inputs, LF-normalized UTF-8 hashes additionally for text. Bind the audited snapshot; not replacement approval hashes.'})
    with (out/'scenario-summary.csv').open('w',encoding='utf8',newline='') as file:
        cols=['scenario','newRecipes','newFields','restoredPackages','remainingMissingFields','recipesStillIncomplete','gkCount','gkDelta','gkClassChanges'];w=csv.DictWriter(file,fieldnames=cols,extrasaction='ignore');w.writeheader();w.writerows(summaries)
    with (out/'recipe-scenarios.csv').open('w',encoding='utf8',newline='') as file:
        cols=['recipeId','baselineStatus','scenario','newFields','remainingFields','restoredPackage','classification'];w=csv.DictWriter(file,fieldnames=cols);w.writeheader()
        for row in ledger:
            for s,v in row['scenarios'].items():w.writerow({'recipeId':row['recipeId'],'baselineStatus':row['baselineStatus'],'scenario':s,**{k:';'.join(v[k]) if isinstance(v[k],list) else v[k] for k in cols[3:]}})
    print(json.dumps({k:v for k,v in summary.items() if k not in ['chickenBoundDetails']},ensure_ascii=False,indent=2))
if __name__=='__main__':main()

