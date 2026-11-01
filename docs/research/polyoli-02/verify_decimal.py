"""Independent Decimal check of the five scoped research versions.

Run from the repository root. Writes only the explicitly named scratch file.
No production calculator imports; no assumption that missing polyols are zero.
"""
import argparse,json
from decimal import Decimal,getcontext
from pathlib import Path
getcontext().prec=40

def read(p):return json.loads(p.read_text(encoding='utf8'))
def dec(x):
    if x is None:raise ValueError('UNKNOWN_IS_NOT_ZERO')
    return Decimal(str(x))

def main():
    p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,default=Path.cwd());p.add_argument('--review',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    a=p.parse_args();root=a.repo.resolve();target=a.output.resolve()
    if target.is_relative_to(root):raise ValueError('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY')
    review=read(a.review);bundles={}
    for n in [6,7]:
        for h in read(root/f'docs/nutrition/gk80-release-{n}/held-review.json')['recipes']:bundles[h['recipeId']]=h['lockedResearchBundle']
    result=[]
    for v in review['results']:
        b=bundles[v['recipeId']];r=b['recipe'];sources={s['id']:s for s in b['sources']}
        totals={k:Decimal(0) for k in ['availableCarbohydrate','protein','fat','fibre']};gk=Decimal(0)
        old_totals={k:Decimal(0) for k in totals};old_gk=Decimal(0)
        for i in r['scenarios'][0]['ingredients']:
            if i.get('certifiedZeroSalt'):continue
            original=i['per100g'];comp=original
            if v['sourceDecision']=='PROPOSE_NO_06_186_AVAILABLE_ONLY' and i['composition']['sourceId']=='U170928-r5':
                comp=review['marjoramProposal']['sourceRecord']['per100g']
            factor=dec(i['massG'])*dec(i['retention'])/100/dec(r['servings'])
            for k in totals:
                totals[k]+=dec(comp[k])*factor;old_totals[k]+=dec(original[k])*factor
            gi=i.get('giId') or i.get('impact',{}).get('sourceId')
            if dec(original['availableCarbohydrate'])>0:
                assert gi is not None
                gk+=dec(comp['availableCarbohydrate'])*factor*dec(sources[gi]['gi'])/100
                old_gk+=dec(original['availableCarbohydrate'])*factor*dec(sources[gi]['gi'])/100
        assert abs(gk-dec(v['proposedResearchGk']))<Decimal('1e-12'),r['recipeId']
        for k in totals:assert abs(totals[k]-dec(v['researchMacros'][k]))<Decimal('1e-12')
        assert v['strictTotalCarbohydratePerServing'] is None
        assert v['polyolsPer100g'] is None
        assert v['publicationEligible'] is False
        result.append(dict(recipeId=r['recipeId'],researchGk=str(gk),deltaGk=str(gk-old_gk),researchMacros={k:str(z) for k,z in totals.items()},deltaMacros={k:str(totals[k]-old_totals[k]) for k in totals},totalCarbohydratePerServing=None,publicationEligible=False))
    out=dict(status='PASS',recipes=5,arithmeticTolerance='1e-12',results=result)
    target.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(json.dumps(dict(status='PASS',recipes=5,macroComparisons=20)))

if __name__=='__main__':main()
