"""Read-only Decimal and evidence validation for the two conditional pan proposals."""
from pathlib import Path
import hashlib, importlib.util, json, sys
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'docs/nutrition/gk80/chicken-pans-1'
spec = importlib.util.spec_from_file_location('decimal_reference', ROOT/'site/scripts/gk80-run2-decimal.py')
ref = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ref)

def read(name): return ref.read(DATA/name)
def file_hash(path): return hashlib.sha256(path.read_text(encoding='utf8').replace('\r\n','\n').encode()).hexdigest()

def main():
    recipes = read('recipes.json')['recipes']
    sources = {x['id']:x for x in read('sources.json')['records']}
    compositions = {x['id']:x for x in read('composition-sources.json')['records']}
    golden = read('golden.json')
    ids = ['kana-parmesaanipannu-parsakaali','kermainen-kanasienipannu']
    assert [r['recipeId'] for r in recipes] == ids
    assert len(sources) == 5 and sources['schakel-default50']['allowedRecipeIds'] == ids
    for x in [*sources.values(),*compositions.values()]:
        assert ref.fingerprint({k:v for k,v in x.items() if k!='evidenceHash'}) == x['evidenceHash'], x['id']
    for x in read('provenance.json')['localFiles']:
        assert file_hash(ROOT/x['path']) == x['sha256'], x['path']
    inherited = {x['id']:x for x in ref.read(ROOT/'docs/nutrition/gk80/run-2/composition-sources.json')['records']}
    for cid,c in compositions.items():
        if cid in inherited:
            assert c == inherited[cid], cid
        elif cid.endswith('-checked'):
            n=c['extractedNutrients']
            assert c['carbohydrateDefinition']=='AVAILABLE_EXCLUDING_FIBRE_AND_POLYOLS'
            assert list(c['per100g'].values())==[n[k] for k in ['AVAILCHO','PROT','FAT','AOACDFTOTW']]
        elif cid.endswith('-label-proxy'):
            assert c['carbohydrateDefinition']=='MODELLED_AVAILABLE_CHO_FROM_EU_LABEL'
            assert c['measuredPolyolsPer100'] is None and c['confidence']=='LOW'
            assert c['modelAssumption'] and c['sensitivity']
        else:
            raise AssertionError('Unreviewed composition '+cid)
    # Explicit reviewed declarations, with no second subtraction of fibre.
    assert compositions['chicken-label-proxy']['per100g']==dict(availableCarbohydrate=.2,protein=3,fat=.1,fibre=1.1)
    assert compositions['maille-label-proxy']['per100g']==dict(availableCarbohydrate=3.5,protein=7,fat=11,fibre=2)
    assert [ref.compute(r,sources) for r in recipes] == golden['recipes'], 'Decimal output drift'
    count=0
    for r,g,d in zip(recipes,golden['recipes'],golden['diagnostics']):
        assert r['sourceSha256']==file_hash(ROOT/r['sourcePath'])
        assert not r['approved'] and not r['published'] and r['confidence']=='LOW' and r['uncertainty']=='NOT_BOUNDED'
        assert r['servings']==4 and len(r['scenarios'])==1
        rows=r['scenarios'][0]['ingredients']; terms=g['scenarios'][0]['contributions']
        for i,c in zip(rows,terms):
            count+=1
            assert i['retention']==1
            if not i.get('certifiedZeroSalt'):
                assert i['quantityEvidence']['amount']==i['massG']
                comp=compositions[i['composition']['sourceId']]
                assert comp['per100g']==i['per100g'] and comp['evidenceHash']==i['composition']['evidenceHash']
                if comp['id'].endswith('-label-proxy'):
                    assert i['carbohydrateEvidence']=='MODEL_PROXY_NOT_MEASURED_POLYOL_FREE'
            if c['carbohydrate']>0:
                assert i.get('impact') and i.get('giId') is None
                assert c['gk']>0
        dec=ref.decimal
        point=dec(g['scenarios'][0]['wholeGk'])
        defaultcho=sum(dec(c['carbohydrate']) for i,c in zip(rows,terms) if i.get('impact',{}).get('sourceId')=='schakel-default50')
        dairycho=sum(dec(c['carbohydrate']) for i,c in zip(rows,terms) if i.get('impact',{}).get('sourceId')=='milk34')
        labelcho=sum(dec(c['carbohydrate']) for i,c in zip(rows,terms) if i.get('carbohydrateEvidence'))
        expected=dict(default50Cho=defaultcho,default50Contribution=defaultcho/2,dairyCho=dairycho,
                      hypotheticalAllDefault100=point+defaultcho/2,hypotheticalAllDefault150=point+defaultcho,
                      milk30Comparator=point-dairycho*dec('.04'),milk46Comparator=point+dairycho*dec('.12'),
                      allLabelProxyRemovedAtFixedAssignedGi=point-labelcho/2)
        for key,value in expected.items(): assert dec(d[key])==value, key
        assert not any(d[k] for k in ['numericRangeClaim','biologicalBoundEstablished','coverageEligible'])
    assert count==19
    metrics=read('metrics.json')
    assert metrics['newNumericConditionalProposals']==2 and metrics['cumulativeUniqueConditionalProposals']==8
    assert metrics['productionBefore']==metrics['productionAfter']==83 and metrics['total']==326
    assert metrics['newApprovedNumericValues']==metrics['newPublished']==0
    print(json.dumps(dict(status='PASS',verifiedRecipes=2,ingredientRows=count,numericConditionalProposals=2,
                          protectedFiles=len(read('provenance.json')['localFiles']),productionChanged=False)))

if __name__=='__main__': main()
