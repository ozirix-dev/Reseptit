"""Five-case C-method proposal, never imported by production.

The cap is a declared source-accounting scenario, not a biological maximum.
Unknown source polyols remain None. Publication numbers are proposed only when
every value in a conditional interval rounds to the same displayed number.
"""
import argparse,hashlib,json
from decimal import Decimal,ROUND_HALF_UP,getcontext
from pathlib import Path
getcontext().prec=40
ALLOWED=('jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko','ropa-vieja','siskonmakkarakeitto-juurekset','nakkikeitto-kukkakaalilla')
MASS={'jauheliha-kaalikeitto-vhh':('0.6',6),'vhh-kaalilaatikko':('0.6',6),'ropa-vieja':('0.2',6),'siskonmakkarakeitto-juurekset':('0.2',4),'nakkikeitto-kukkakaalilla':('0.2',4)}

def d(value):
    if value is None:raise ValueError('UNKNOWN_NOT_ZERO')
    q=Decimal(str(value))
    if not q.is_finite() or q<0:raise ValueError('INVALID_QUANTITY')
    return q

def rounded(q,places):return q.quantize(Decimal(1).scaleb(-places),rounding=ROUND_HALF_UP)
def group(q):return 'LOW' if q<=10 else 'MEDIUM' if q<20 else 'HIGH'

def stable(lo,hi,places):
    if lo<0 or hi<lo:raise ValueError('INVALID_INTERVAL')
    a,b=rounded(lo,places),rounded(hi,places)
    return dict(lower=lo,upper=hi,decimalPlaces=places,stable=a==b,value=a if a==b else None)

def macro_display(lo,hi):
    for places in [2,1,0]:
        z=stable(lo,hi,places)
        if z['stable']:return z
    return dict(lower=lo,upper=hi,decimalPlaces=None,stable=False,value=None)

def gk_display(lo,hi):
    result=stable(lo,hi,0)
    if hi>0 and (lo<1 or result['value']==0):
        # No positive modeled contribution may become a displayed zero.
        # The five reviewed cases exceed one; new subunit behavior needs review.
        result.update(stable=False,value=None)
    return result

def slack(macro,known_polyols=Decimal(0)):
    # Deliberately DO NOT subtract a water-by-difference field: that would
    # manufacture a zero residual. This is a source-accounting scenario only.
    result=Decimal(100)-sum(d(macro[k]) for k in ['availableCarbohydrate','fibre','protein','fat'])-known_polyols
    if result<0:raise ValueError('INCONSISTENT_SOURCE_ACCOUNTING')
    return result

def evaluate_case(case,cap=Decimal(150),limit=Decimal('.05'),include_partial_evidence=False):
    rid=case['recipeId']
    if rid not in ALLOWED:raise ValueError('OUT_OF_SCOPE_RECIPE')
    expected_mass,expected_servings=MASS[rid]
    if case['servings']!=expected_servings or not case['completeScope']:raise ValueError('UNREVIEWED_VERSION')
    cap,limit=d(cap),d(limit);n=d(case['servings'])
    sums={k:Decimal(0) for k in ['availableCarbohydrate','fibre','protein','fat']}
    reference_gk=Decimal(0);known_polyols=Decimal(0);target=None
    additional_partial_p=Decimal(0);partial=[]
    for i in case['ingredients']:
        if d(i['retention'])!=1:raise ValueError('UNREVIEWED_RETENTION')
        factor=d(i['massG'])/100/n
        for k in sums:sums[k]+=d(i['macro'][k])*factor
        a=d(i['macro']['availableCarbohydrate'])*factor
        if a>0 and i['gi'] is None:raise ValueError('MISSING_GI')
        if i['gi'] is not None:reference_gk+=a*d(i['gi'])/100
        kind=i['polyolEvidenceKind']
        if kind=='REPORTED_SOURCE_VALUE':
            known_polyols+=d(i['polyolsSourceValue'])*factor
        elif kind=='AFCD_PAIRED_SOURCE_MODEL':
            pair=i['pairedCarbohydrates']
            if pair is None:raise ValueError('MISSING_PAIRED_SOURCE')
            p=d(pair['withValue'])-d(pair['without'])
            if p<0:raise ValueError('NEGATIVE_PAIRED_DIFFERENCE')
            if i['polyolsSourceValue'] is not None and abs(d(i['polyolsSourceValue'])-p)>Decimal('1e-12'):raise ValueError('PAIRED_VALUE_CONFLICT')
            known_polyols+=p*factor
            residual=slack(i['macro'],p)*factor
            additional_partial_p+=residual
            partial.append(dict(sourceId=i['sourceId'],sourcePolyolsValue=i['polyolsSourceValue'],pairedSourceModelValue=p,
                                notAMeasurementOfAllSpecies=True,additionalSpeciesSourceAccountingStressP=residual))
        elif kind=='MISSING_AGGREGATE':
            if target is not None:raise ValueError('UNREVIEWED_ADDITIONAL_UNKNOWN')
            if i['polyolsSourceValue'] is not None:raise ValueError('SOURCE_STATE_CHANGED_REVIEW_REQUIRED')
            if d(i['massG'])!=d(expected_mass):raise ValueError('TARGET_MASS_CHANGED')
            target=(i,factor)
        else:raise ValueError('UNREVIEWED_POLYOL_EVIDENCE_KIND')
    if target is None:raise ValueError('TARGET_MISSING')
    i,factor=target;mass=d(i['massG'])/n
    if i['targetDefinition']=='AVAILABLE_WITH_UNKNOWN_EXTERNAL_POLYOLS':
        if rid not in ALLOWED[:2] or i['sourceId']!='norway-06.186-polyoli02-20261101':raise ValueError('UNREVIEWED_SOURCE')
        maximum_p=slack(i['macro'])*factor
        lo=reference_gk;hi=lo+maximum_p*cap/100
        net_lo=net_hi=sums['availableCarbohydrate']
        total_lo=sums['availableCarbohydrate']+sums['fibre']+known_polyols;total_hi=total_lo+maximum_p
        basis='DECLARED_MACRO_SLACK_EXCLUDES_DERIVED_WATER'
    elif i['targetDefinition']=='US_TOTAL_NONFIBRE_POOL':
        if rid not in ALLOWED[2:] or i['sourceId'] not in ['U170917-r5','U170917-r6']:raise ValueError('UNREVIEWED_SOURCE')
        u=i['us'];pool=d(u['total'])-d(u['fibre'])
        if pool<0 or abs(pool-d(i['macro']['availableCarbohydrate']))>Decimal('1e-12'):raise ValueError('US_DEFINITION_CONFLICT')
        maximum_p=pool*factor
        lo=reference_gk-maximum_p*d(i['gi'])/100;hi=lo+maximum_p*cap/100
        net_hi=sums['availableCarbohydrate'];net_lo=net_hi-maximum_p
        # For US total, A+P=C-F, so A+F+P=C without determining P.
        # The recipe total is formed directly by this identity, not P=0.
        total_lo=total_hi=sums['availableCarbohydrate']+sums['fibre']+known_polyols
        basis='US_REPORTED_TOTAL_MINUS_FIBRE_SOURCE_POOL'
    else:raise ValueError('UNREVIEWED_TARGET_DEFINITION')
    if d(i['gi'])>cap:raise ValueError('SCENARIO_CAP_BELOW_ASSIGNED_GI')
    target_width=hi-lo
    target_p=maximum_p
    if include_partial_evidence:
        # The AFCD pair covers only three named polyols. Remaining species
        # cannot disappear from the recipe's aggregate C budget.
        hi+=additional_partial_p*cap/100
        total_hi+=additional_partial_p
        maximum_p+=additional_partial_p
    width=hi-lo
    displayed_gk=gk_display(lo,hi)
    macros={
        'carbsNetG':macro_display(net_lo,net_hi),'carbsTotalG':macro_display(total_lo,total_hi),
        'proteinG':macro_display(sums['protein'],sums['protein']),'fatG':macro_display(sums['fat'],sums['fat'])}
    acceptable=width<=limit and displayed_gk['stable'] and group(lo)==group(hi) and all(v['stable'] for v in macros.values())
    if i['targetDefinition']=='AVAILABLE_WITH_UNKNOWN_EXTERNAL_POLYOLS':
        mass_lo=reference_gk;mass_hi=mass_lo+mass*cap/100
    else:mass_lo=lo;mass_hi=mass_lo+mass*cap/100
    return dict(recipeId=rid,basis=basis,unknownSourcePolyolsPer100g=None,unknownPPerServing=dict(min=Decimal(0),max=maximum_p),
                targetUnknownPMax=target_p,targetOnlyGkWidth=target_width,includesAllAfcdPartialEvidence=include_partial_evidence,
                sourceModelGk=dict(lower=lo,upper=hi,width=width),referenceScenarioGk=reference_gk,
                proposedDisplayedGk=displayed_gk,gkClass=group(lo) if group(lo)==group(hi) else None,
                macros=macros,proposedEditorialBudget=limit,giResponseScenario=[Decimal(0),cap],
                arithmeticCandidate=acceptable,methodApprovalPending=True,publicationEligible=False,
                physicalMassStress=dict(lower=mass_lo,upper=mass_hi,width=mass_hi-mass_lo),
                afcdPartialEvidence=partial,
                broaderSpeciesStressWidth=target_width+additional_partial_p*cap/100,
                remainingOwnerDecisions=['SOURCE_ACCOUNTING_DOMAIN','AFCD_PAIRED_SOURCE_CONVENTION_LIMITS','EXACT_INTERVALS_AND_DISPLAY_PRECISIONS','NAMED_PREPARATION_VERSION','LOW_DISCLOSURE'],
                biologicalBoundEstablished=False)

def run(data):
    if data['allowedRecipeIds']!=list(ALLOWED) or [c['recipeId'] for c in data['cases']]!=list(ALLOWED):raise ValueError('SCOPE_MISMATCH')
    p=data['policy'];primary=[evaluate_case(c,d(p['primaryGiCap']),d(p['fullGkWidthLimit']),True) for c in data['cases']]
    grid=[]
    for cap in p['giCaps']:
        for limit in p['thresholdComparison']:
            r=[evaluate_case(c,d(cap),d(limit),True) for c in data['cases']]
            targets=[evaluate_case(c,d(cap),d(limit),False) for c in data['cases']]
            grid.append(dict(cap=cap,fullWidthBudget=limit,wholeRecipeCandidates=sum(x['arithmeticCandidate'] for x in r),
                             targetOnlyCandidates=sum(x['arithmeticCandidate'] for x in targets),
                             physicalMassBudgetMatches=sum(x['physicalMassStress']['width']<=d(limit) for x in r),
                             broaderSpeciesBudgetMatches=sum(x['broaderSpeciesStressWidth']<=d(limit) for x in r),newPublishable=0))
    return dict(schemaVersion=1,baseMain=data['baseMain'],method='SCOPED_C_STABLE_ROUNDING_PROPOSAL',scope=list(ALLOWED),results=primary,
                comparisons=grid,conditionalArithmeticCandidates=sum(r['arithmeticCandidate'] for r in primary),
                newPublishable=0,productionEnabled=False,ownerApproval=data['ownerApproval'])

def encode(x):
    if isinstance(x,Decimal):return str(x)
    raise TypeError(type(x).__name__)

def main():
    p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,default=Path.cwd());p.add_argument('--output',type=Path,required=True)
    a=p.parse_args();here=Path(__file__).resolve().parent;root=a.repo.resolve();out=a.output.resolve()
    if out.is_relative_to(root):raise ValueError('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY')
    raw=(here/'cases.json').read_bytes();expected=(here/'cases.sha256').read_text().strip()
    if hashlib.sha256(raw.replace(b'\r\n',b'\n')).hexdigest()!=expected:raise ValueError('STALE_CASE_PACKET')
    data=json.loads(raw)
    for c in data['cases']:
        for name,digest in [(c['sourcePath'],c['sourceSha256']),(c['heldFile'],c['heldFileSha256'])]:
            if hashlib.sha256((root/name).read_bytes().replace(b'\r\n',b'\n')).hexdigest()!=digest:raise ValueError('STALE_MAIN_SOURCE')
    result=run(data);out.write_text(json.dumps(result,ensure_ascii=False,indent=2,default=encode)+'\n',encoding='utf8')
    print(json.dumps(dict(status='PASS',cases=5,conditionalCandidates=result['conditionalArithmeticCandidates'],newPublishable=0)))

if __name__=='__main__':main()
