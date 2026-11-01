"""POLYOLI-01: read-only research arithmetic, never a publication gate.

Run: python prototype.py --inputs pilot-inputs.json --output <scratch path>
No production imports. No null-to-zero conversion. GI caps are declared scenarios,
not universal maxima; label decimal cells are assumptions, not analytical bounds.
"""
import argparse
import json
from decimal import Decimal, ROUND_HALF_UP, getcontext
from pathlib import Path

getcontext().prec = 40


def dec(value):
    if value is None:
        raise ValueError('UNKNOWN_IS_NOT_ZERO')
    v = Decimal(str(value))
    if not v.is_finite() or v < 0:
        raise ValueError('INVALID_NONNEGATIVE_VALUE')
    return v


def available(cho, fibre, polyols, definition):
    c = dec(cho)
    if definition == 'AVAILABLE_EXCLUDING_POLYOLS':
        return c  # a missing polyol does not alter a separately defined CHO sum
    if polyols is None:
        return None
    p = dec(polyols)
    a = c - p if definition == 'EU_LABEL' else c - dec(fibre) - p if definition == 'US_TOTAL' else None
    if a is None or a < 0:
        raise ValueError('DEFINITION_OR_COMPONENT_CONFLICT')
    return a


def cls(v):
    # Current modeled recipe page/filter convention, applied to published 0.01 point.
    return 'LOW' if v <= 10 else 'MEDIUM' if v < 20 else 'HIGH'


def publication_point(v):
    p = v.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    return v if v > 0 and p == 0 else p


def shown(v):
    p = publication_point(v)
    return '<1' if 0 < p < 1 else str(p.quantize(Decimal('1'), rounding=ROUND_HALF_UP))


def interval_display(lo, hi):
    # <1 also has a discontinuity at zero; endpoint equality alone is insufficient.
    return dict(displayAtLower=shown(lo), displayAtUpper=shown(hi),
                displayedValueMayChange=shown(lo) != shown(hi) or (lo == 0 and hi > 0),
                publicPointMayChange=publication_point(lo) != publication_point(hi),
                classMayChange=cls(publication_point(lo)) != cls(publication_point(hi)))


def evaluate(recipe, gi_cap, threshold):
    cap, limit, servings = dec(gi_cap), dec(threshold), dec(recipe['servings'])
    if servings == 0:
        raise ValueError('INVALID_SERVINGS')
    total_pool = Decimal(0)
    total_mass = Decimal(0)
    removed = Decimal(0)
    fixed_reallocation = Decimal(0)
    rows = []
    unresolved = []
    for row in recipe['uncertainties']:
        mass = dec(row['massG'])
        # retention is not allowed to hide unknown partitioning/extraction.
        if dec(row['retention']) != 1:
            unresolved.append('UNKNOWN_RETENTION_PARTITION')
        mass_per_serving = mass / servings
        total_mass += mass_per_serving
        pool = row['scenarioPoolUpperPer100']
        if pool is None:
            unresolved.append('NO_COMPOSITION_POLYOL_CEILING')
        else:
            pool = dec(pool)
            if pool > 100:
                raise ValueError('POOL_EXCEEDS_MASS')
            total_pool += pool * mass_per_serving / 100
        gi = row['assignedGi']
        if gi is None and dec(row['modelChoPer100']) > 0:
            unresolved.append('MISSING_GI')
        if gi is not None:
            removed += dec(row['modelChoPer100']) * mass_per_serving * dec(gi) / 10000
            if row['unknownPoolPer100'] is not None:
                fixed_reallocation += dec(row['unknownPoolPer100']) * mass_per_serving * dec(gi) / 10000
        rows.append(dict(sourceId=row['sourceId'],polyolsPer100=row['polyolsPer100'],
                         massPerServing=mass_per_serving,
                         sourcePoolPerServing=None if pool is None else pool*mass_per_serving/100,
                         massScenarioWidth=mass_per_serving*cap/100,
                         sourceScenarioWidth=None if pool is None else pool*mass_per_serving*cap/10000))
    blockers=list(recipe.get('otherPreparationBlockers',[]))+unresolved
    if not recipe['completeScope']:
        blockers.append('INCOMPLETE_SCOPE')
    if not recipe['currentSourceMatches']:
        blockers.append('STALE_SOURCE_VERSION')
    base=dec(recipe['baselineModelGk'])
    source_width=None if unresolved else total_pool*cap/100
    mass_width=total_mass*cap/100
    lower=max(Decimal(0),base-removed)
    upper=None if source_width is None else lower+source_width
    p1_only=bool(rows) and all(r['group']=='P1' for r in recipe['uncertainties'])
    in_budget=source_width is not None and source_width <= limit
    return dict(recipeId=recipe['recipeId'],giScenario=[0,cap],editorialThreshold=limit,
                ingredients=rows,totalSourcePoolPerServing=None if unresolved else total_pool,
                totalMassPerServing=total_mass,sourceScenarioWidth=source_width,massScenarioWidth=mass_width,
                fixedAssignedGiDownwardReallocation=fixed_reallocation,
                sourceScenario=None if upper is None else dict(lower=lower,upper=upper,**interval_display(lower,upper)),
                massScenario=dict(lower=lower,upper=lower+mass_width,**interval_display(lower,lower+mass_width)),
                passesArithmeticBudget=in_budget,
                researchShortlist=in_budget and p1_only and not blockers,
                status='MISSING_POLYOLS_BOUNDED' if in_budget and not blockers else 'HOLD',
                blockers=blockers,confidence='LOW',publicationEligible=False,
                remainingRequirements=['OWNER_METHOD_DECISION','SOURCE_INTERVAL_REVIEW','FOUR_MACROS','FOOD_AND_PREPARATION_REVIEW'],
                biologicalInterval=False)


def run(data):
    rows=[evaluate(r,g,t) for g in data['giScenarioCaps'] for t in data['thresholds'] for r in data['recipes']]
    summary=[]
    for g in data['giScenarioCaps']:
        for t in data['thresholds']:
            subset=[r for r in rows if r['giScenario'][1]==dec(g) and r['editorialThreshold']==dec(t)]
            summary.append(dict(giCap=g,threshold=t,
                                arithmeticOnly=sum(r['passesArithmeticBudget'] for r in subset),
                                afterOtherRecipeGates=sum(r['passesArithmeticBudget'] and not r['blockers'] for r in subset),
                                p1ResearchShortlist=sum(r['researchShortlist'] for r in subset),
                                massBudget=sum(r['massScenarioWidth']<=dec(t) for r in subset),
                                actualNewPublishable=0))
    return dict(schemaVersion=1,baseMain=data['baseMain'],publicationEligible=False,summary=summary,results=rows)


def encode(value):
    if isinstance(value,Decimal):
        return str(value)  # preserve decimal arithmetic rather than float serialization
    raise TypeError(type(value).__name__)


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--inputs',type=Path,default=Path(__file__).with_name('pilot-inputs.json'));p.add_argument('--output',type=Path,required=True)
    a=p.parse_args();data=json.loads(a.inputs.read_text(encoding='utf8'));out=run(data)
    a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2,default=encode)+'\n',encoding='utf8')
    print(json.dumps(out['summary'],default=encode))
