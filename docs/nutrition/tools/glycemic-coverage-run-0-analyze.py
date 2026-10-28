"""AJO 0 planning only. Read fresh audits; write only to an external scratch folder.

Usage: python glycemic-coverage-run-0-analyze.py REPO_ROOT SCRATCH_DIR
No input, binding, catalog, historical baseline or public GK value is changed.
"""
import collections
import hashlib
import json
import pathlib
import re
import subprocess
import sys
from glycemic_run0_validation import PRODUCTION_COMMIT, ORIGINAL_RUN_COMMIT, WITHDRAWN, unique_by, verify_regression

root = pathlib.Path(sys.argv[1]).resolve()
out = pathlib.Path(sys.argv[2]).resolve()
assert not out.is_relative_to(root), 'Output must be disposable space outside the repository'
out.mkdir(parents=True, exist_ok=True)
def read(rel):
    return json.loads((root / rel).read_text(encoding='utf-8-sig'))
def digest(rel):
    return hashlib.sha256((root / rel).read_bytes()).hexdigest()
def match(pattern, text):
    return bool(re.search(pattern, text, re.I))
def dump(name, obj):
    if name.endswith('inventory.json'):
        # Keep the large machine inventory reviewable: one JSON line per recipe.
        metadata={k:v for k,v in obj.items() if k!='recipes'}
        text=json.dumps(metadata, ensure_ascii=False, indent=2).rstrip()[:-1]
        text+=',\n  "recipes": [\n'+',\n'.join('    '+json.dumps(r,ensure_ascii=False,separators=(',',':')) for r in obj['recipes'])+'\n  ]\n}\n'
        (out / name).write_text(text,encoding='utf-8')
    else:
        (out / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

# Planning is locked to the accepted production revision, not merely the folder name.
subprocess.run(['git','merge-base','--is-ancestor',PRODUCTION_COMMIT,'HEAD'],cwd=root,check=True)
allowed = {
 'docs/nutrition/README.md', 'docs/nutrition/glycemic-coverage-campaign-master-plan.md',
 'docs/nutrition/glycemic-coverage-run-0-plan.md', 'docs/nutrition/glycemic-coverage-run-0-inventory.json',
 'docs/nutrition/tools/glycemic-coverage-run-0-analyze.py', 'docs/nutrition/tools/glycemic-coverage-run-0-probe.mts',
 'docs/nutrition/tools/glycemic_run0_validation.py', 'docs/nutrition/tools/test_glycemic_run0_validation.py',
}
changed = set(subprocess.check_output(['git','diff','--name-only',PRODUCTION_COMMIT,'--'],cwd=root,text=True).splitlines())
assert changed <= allowed, ('Changes outside planning scope', sorted(changed-allowed))
historical = json.loads(subprocess.check_output(['git','show',ORIGINAL_RUN_COMMIT+':docs/nutrition/glycemic-coverage-run-0-inventory.json'],cwd=root))
review = read('docs/nutrition/glycemic-coconut-source-review.json')

pilot = read('tmp/nutrition/glycemic-load-pilot.json')
nutrition = read('tmp/nutrition/audit.json')
general = read('docs/nutrition/glycemic-coverage-current-2026-10-25.json')
batch = read('docs/nutrition/glycemic-coverage-batch-2b6d-current.json')
baseline = read('docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json')
catalog = read('docs/nutrition/glycemic-index-records.json')
gi = unique_by(catalog['records'], 'id', 'GI catalog')
# Match the unchanged calculator's last-record-wins food catalog semantics.
food = {x['id']:x for x in read('docs/nutrition/food-records.json')}
ns = unique_by(nutrition['inventory'], 'recipe_id', 'nutrition audit')
inputs = unique_by(pilot['calculationInputs'], 'recipeId', 'calculation inputs')
current = {x['recipeId']: x for x in batch['recipes']}
results = unique_by(pilot['results'], 'recipeId', 'GL results')
assert len(results) == len(pilot['results']) == len(ns)
assert set(ns) == set(results) == set(inputs)
for saved in (general, batch):
    assert set(unique_by(saved['recipes'], 'recipeId', 'saved inventory')) == set(results)
    for row in saved['recipes']:
        rid = row['recipeId']
        for key in ('status', 'glycemicLoadPerServing'):
            assert row[key] == results[rid][key], (rid, key)
        assert [b['message'] for b in row['blockers']] == results[rid]['blockers'], rid
        for key, hashes in [('recipeVersion','sourceHashes'),('calculationInputVersion','calculationInputHashes'),('calculationEvidenceVersion','calculationEvidenceHashes')]:
            assert row[key] == pilot[hashes][rid], (rid, key)
        assert row['nutritionStatus'] == ns[rid]['status'], rid
regression = verify_regression(baseline, pilot, review, catalog)

def family(name):
    rules = [
        ('tomaatti',r'tomaat|tomato|salsa'), ('kookosmaito',r'kookosmaito|coconut milk|kookosjuoma'),
        ('liemi',r'liem|lient|broth|stock|dashi'), ('soijakastike',r'soijakast|tamari|soy sauce|kecap'),
        ('tamarindi',r'tamarind'), ('lanttu',r'lanttu|lanttua|swede'),
        ('peruna',r'perun|potato'), ('limetti',r'limett|lime'),
        ('maissi/tärkkelys',r'maissi|corn|tapiok'), ('taikina/leipä',r'taikina|leip|wrap|pita|filo'),
        ('miso/soijapaputahna',r'miso|soijapaputah'), ('hunaja',r'hunaj|honey'),
        ('maitotuote',r'maito|kerma|smetana|jogurt|juusto|milk|cream|yogurt|cheese'),
        ('yrtit',r'persil|korianter|mintt|rosmariin|ruohosip|curry.leh|curryleh|timjam'),
        ('sipuli',r'sipul|onion|garlic'), ('pähkinä/siemen',r'mantel|pähkin|seesam|siemen|tahini'),
        ('tulinen kastike',r'currytahn|hariss|gochujang|sambal|sriracha'),
        ('kala/äyriäinen',r'simpuk|katkarap|kala|anjovis|lohi'),
        ('taateli',r'taatel'), ('manna',r'manna|semolina'), ('papaija',r'papaij|papaya'),
    ]
    return next((key for key, pattern in rules if match(pattern,name)), name.lower())

reuse = {
 'vhh-kaalilaatikko': ('dairy-category-mean-gi-35','Kerma: dairy-category vs unflavoured-dairy; kypsennetyn kerman analogia ja koko syöte tarkistettava.'),
 'som-tam-vhh-kurkkuna': ('vegetables-category-mean-gi-66','Keitetyt pavut: vegetables/cooked vs vegetable/vegetable-category; olemassa olevan kategorian sallittu käyttö tarkistettava.'),
 'siemengranola-jogurtilla': ('nuts-category-mean-gi-22','40 g paahdettuja mantelilastuja: 0,660 g/annos; hyväksytty GI vähentäisi poisjätön 2,06375 -> 1,40375. Paahdon lähdevastaavuutta ei vielä hyväksytty.'),
}
first = ['jauhelihapihvit-vhh-kermakastikkeella','vhh-kaalilaatikko','som-tam-vhh-kurkkuna','siemengranola-jogurtilla','valimerellinen-halloumi-tomaattileipa']
extra_priority = ['jerk-kana','hunaja-sinappikana-kaalilla','caponata','pasta-alla-norma','harira','kanapyorykat-tomaattikastike','keltainen-kanacurry-vhh','karibia-kookosriisi-pavuilla','vietnamilainen-banh-xeo-aamiaisletut','indonesialainen-nasi-uduk-aamiaisella','thai-roti-munalla-banaanilla','paella-valenciana','pohjoisafrikkalainen-lablabi','kana-enchilada-kukkakaalivuoka','vhh-raparperipiirakka']
notes = {
 'keltainen-kanacurry-vhh':'PR #124 palautti nulliksi: 2,81 g/annos kookosmaitoa tarvitsee oman soveltuvan GI-lähteen. Ainoa mallin esto, mutta REFERENCE_ONLY-riisipuurolähde ei käy. Koko ainesketju ja valmistus tarkistettava ennen mitään palautusta.',
 'jauhelihapihvit-vhh-kermakastikkeella':'Lihaliemi 0,750 g/annos; väärän GI-sidoksen poiston jälkeen poisjättö 1,18705 g/annos. Varmista liemen koostumus ja kaikki nykyiset määrät; ravintoauditointi ei yksin todista syötettä.',
 'valimerellinen-halloumi-tomaattileipa':'Leivän koostumus on nykyisessä ravintolaskelmassa Fineli 31842 -maalaisleipäproxy. Tarkista hapanjuurileivän vastaavuus ja leipä-GI; älä siirrä proxya automaattisesti.',
 'jerk-kana':'Neljä kevätsipulia: ravintolaskelman määrä ja Fineli-mitta verrattava reseptiin; lisäksi rakennesidonnan tarkistus.',
 'hunaja-sinappikana-kaalilla':'Valkosipulijauheeseen on liitetty tuoreen valkosipulin tietue/mittapyyntö. Tarkista jauheen koostumus ja tl-massa sekä reseptin rakennesidonta.',
 'paella-valenciana':'Ainoa nykyinen GI-esto on kanaliemi 1,0675 g/annos, ei tomaatti. Raja ei salli pyöristämistä alle 1 g:n.',
 'baozi':'Maissitärkkelys 1,632 g/annos tarvitsee valmistukseen soveltuvan GI:n; perunan GI ei käy.',
 'vhh-raparperipiirakka':'Raparperi 1,71875 g/annos tarvitsee lähteen paistettuun muotoon; hedelmäryhmä ei sellaisenaan kelpaa.',
}

def tags(message):
    message=message.split(': ',1)[-1]
    t = set()
    if match(r'structure differs|input must be reviewed|source mapping and calculation must be reviewed',message): t.add('FINGERPRINT')
    if match(r'composition|food record|food mapping|(?:product|source) record|Fineli/AFCD|not treated as zero|brand|label|carbohydrate.*(?:unknown|unmeasured|not established|cannot be)',message): t.add('COMPOSITION')
    if match(r'mass|gram conversion|unit conversion|density|unweighed|without an amount|amount.*unknown|quantity|portion|retained|retention|strained|product/size/weight',message): t.add('MASS')
    if match(r'preparation|raw|cooked|steamed|boiled|simmer|fresh vs|process state|state.*unspecified',message): t.add('PREPARATION')
    if match(r'\bGI\b|glycemic|category mean|analogue',message): t.add('GI')
    if match(r'cumulative omitted',message): t.add('TOLERANCE')
    if match(r'allows.*(?:liquid|water)|milk or water|offers milk or water|selected liquid|sweetener type|pizza toppings|product type or fat level|fresh vs dried|without fresh/dried|without specifying fresh|vettä tai|maitoa tai|kasvis- tai|naudan- tai|kanalientä tai|filo- tai',message): t.add('EDITORIAL')
    return sorted(t or {'OTHER'})

rows=[]
semantic_all=[]
for rid, result in results.items():
    n=ns[rid]
    calc_path=n.get('calculationEvidence')
    calc=read(calc_path) if calc_path else None
    semantic=[]
    for i in result['ingredients']:
        if i.get('giRecordId')=='coconut-milk-porridge-gi-31':
            semantic.append({'kind':'GI','family':'kookosmaito','ingredient':i['name'],'reason':'Riisipuuro kookosmaidolla ei mittaa kookosmaitoa yksinään; malli hyväksyy sidoksen, lähdevastaavuus ei ole puolustettu.'})
        if i.get('giRecordId')=='potato-boiled-tortilla-analogue-gi-66':
            semantic.append({'kind':'PREPARATION','family':'peruna','ingredient':i['name'],'reason':'Vesikeitetty peruna vs öljyssä kypsennetty tortilla: erillinen valmistusvastaavuuden tarkistus, ei pelkkä sipuliavaimen korjaus.'})
    if calc:
        for i in calc['ingredients']:
            if match('peruna',i['item']) and match('maa-artisokka',i.get('record',{}).get('name','')):
                semantic.append({'kind':'COMPOSITION','family':'peruna','ingredient':i['item'],'reason':'Ravintosyötteen Fineli 310 on MAA-ARTISOKKA, vaikka state/matchEvidence kuvaavat perunaa; auditin ESTIMATE WITH EVIDENCE ei tunnista tätä semanttista ristiriitaa.'})
    if semantic: semantic_all.append({'recipeId':rid,'status':result['status'],'findings':semantic})
    if result['status']=='CALCULATED': continue
    ingredients=[]
    for idx,i in enumerate(result['ingredients']):
        inp=inputs[rid]['ingredients'][idx]
        blocking=[s for s in i['issues'] if f'{rid}: {i["name"]}: {s}' in result['blockers']]
        carb=i.get('availableCarbohydratePerServingG')
        gid=i.get('giRecordId')
        assert not gid or gi.get(gid,{}).get('calculationUse') != 'REFERENCE_ONLY', (rid, gid)
        state=('accepted-by-current-model' if i.get('giContribution') is not None else
               'invalid-or-uncertain' if gid and blocking else
               'unreviewed-composition-or-amount' if carb is None and i.get('availableCarbohydrateUpperBoundPerServingG') is None else
               'source-backed-zero' if carb==0 else 'missing-GI')
        ingredients.append({'index':idx,'name':i['name'],'family':family(i['name']),'giState':state,
            'grams':i['grams'],'availableCarbohydratePerServingG':carb,'upperBoundPerServingG':i.get('availableCarbohydrateUpperBoundPerServingG'),
            'foodRecordId':i.get('fineliRecordId'),'giRecordId':gid,'foodKey':inp.get('foodKey'),'preparationKey':inp.get('preparationKey'),
            'recipeQuantity':inp.get('recipeQuantity'),'massEvidence':inp.get('massEvidence'),'giMatchEvidence':inp.get('giMatchEvidence'),
            'blockingIssues':blocking,'information':i['issues'] if not blocking else [],
            'nutritionInputMatches':[{'item':c['item'],'recordId':c.get('record',{}).get('id'),'state':c.get('state'),'amount':c.get('amount'),'unit':c.get('unit'),'gramsPerUnit':c.get('gramsPerUnit'),'matchEvidence':c.get('matchEvidence')} for c in (calc or {}).get('ingredients',[]) if c['item'].casefold()==i['name'].casefold()]})
    blockers=[]
    for b in result['blockers']:
        named=[i for i in ingredients if any(b==f'{rid}: {i["name"]}: {s}' for s in i['blockingIssues'])]
        blockers.append({'message':b,'tags':tags(b),'ingredientIndices':[i['index'] for i in named],'families':sorted(set(i['family'] for i in named))})
    tt=set(t for b in blockers for t in b['tags']) | set(s['kind'] for s in semantic)
    families=set(f for b in blockers for f in b['families']) | set(s['family'] for s in semantic)
    missing_gi=[i for i in ingredients if i['giState']=='missing-GI']
    invalid=[i for i in ingredients if i['giState']=='invalid-or-uncertain']
    # A diagnostic only: removal of invalid GI never approves source evidence.
    removable=[i for i in invalid if i['availableCarbohydratePerServingG'] is not None and 0<i['availableCarbohydratePerServingG']<1]
    removed_messages={f'{rid}: {i["name"]}: {b}' for i in removable for b in i['blockingIssues']}
    omission=result['omittedAvailableCarbohydratePerServingG']+sum(i['availableCarbohydratePerServingG'] for i in removable)
    omission_only=bool(removable) and not [b for b in result['blockers'] if b not in removed_messages] and omission<2
    if 'EDITORIAL' in tt: cls='H'
    elif ('COMPOSITION' in tt and 'GI' in tt and len(families)>1) or len(families)>=3: cls='G'
    elif 'FINGERPRINT' in tt: cls='F'
    elif 'COMPOSITION' in tt: cls='D'
    elif 'MASS' in tt: cls='E'
    elif omission_only and not semantic: cls='A'
    elif rid in reuse: cls='B'
    else: cls='C'
    source_effort={'A':1,'B':2,'C':4,'D':3,'E':3,'F':3,'G':6,'H':5}[cls]
    risk={'A':1,'B':2,'C':3,'D':2,'E':2,'F':3,'G':4,'H':4}[cls]
    evidence={'A':3,'B':2,'C':1,'D':2 if calc else 1,'E':2 if calc else 1,'F':2 if calc else 1,'G':1,'H':1}[cls]
    units=max(1,len(families)+int('FINGERPRINT' in tt)+int('TOLERANCE' in tt))
    score=round(evidence/(source_effort*risk*units),4)
    old=next((b for b in baseline['recipes'] if b['recipeId']==rid),None)
    rows.append({'recipeId':rid,'status':result['status'],'glycemicLoadPerServing':None,'nutritionStatus':n['status'],
      'servings':result['servings'],'sourcePath':n['source_path'],'sourceContentHash':n['source_content_hash'],
      'recipeVersion':pilot['sourceHashes'][rid],'inputVersion':pilot['calculationInputHashes'][rid],'evidenceVersion':pilot['calculationEvidenceHashes'][rid],
      'nutritionCalculationPath':calc_path,'currentRecipeIngredients':n['ingredients'],
      'cookingMethod':current[rid]['currentRecipeStructure']['cookingMethod'],
      'primaryClass':cls,'blockerTags':sorted(tt),'blockingFamilies':sorted(families),'blockerCount':len(blockers),
      'independentWorkUnitsHeuristic':units,'otherWorkUnitsHeuristic':units-1,
      'blockers':blockers,'semanticReviewFindings':semantic,'ingredients':ingredients,
      'acceptedGiIngredientIndices':[i['index'] for i in ingredients if i['giState']=='accepted-by-current-model'],
      'missingGiIngredientIndices':[i['index'] for i in missing_gi],
      'uncertainGiIngredientIndices':[i['index'] for i in invalid],
      'compositionMissingIngredientIndices':[i['index'] for i in ingredients if any('COMPOSITION' in tags(b) for b in i['blockingIssues'])],
      'massOrPreparationIngredientIndices':[i['index'] for i in ingredients if any(set(tags(b)) & {'MASS','PREPARATION'} for b in i['blockingIssues'])],
      'variantAmbiguities':[b['message'] for b in blockers if 'EDITORIAL' in b['tags']],
      'omittedCarbohydratePerServingG':result['omittedAvailableCarbohydratePerServingG'],
      'omissionLimitExceeded':result['omittedAvailableCarbohydratePerServingG']>=2,
      'individualAtOrAbove1gWithoutAcceptedGI':[i['index'] for i in ingredients if i['giState']!='accepted-by-current-model' and i['availableCarbohydratePerServingG'] is not None and i['availableCarbohydratePerServingG']>=1],
      'omissionDiagnostic':{'invalidGiRemovalWouldPassModel':omission_only,'omittedAfterRemovalG':omission,'ingredientIndices':[i['index'] for i in removable],'approved':False},
      'existingSourceCandidate':{'id':reuse[rid][0],'review':reuse[rid][1],'approved':False} if rid in reuse else None,
      'previousBlockersNowAbsent':[b for b in (old or {}).get('blockers',[]) if b not in result['blockers']],
      'priority':{'potentialNetNewMaximum':1,'evidenceAvailabilityOrdinal':evidence,'effortOrdinal':source_effort,'regressionRiskOrdinal':risk,'score':score,'recipeImpact':'one recipe; shared catalogs require separate global impact review','oneSmallPrProbability':'kohtalainen' if cls in 'AB' else 'matala' if cls in 'CDEF' else 'erittäin matala'},
      'nextAction':notes.get(rid,reuse.get(rid,('',None))[1]) or {'A':'Tarkista koko syöte ja pienosuudet; dokumentoi kelpaamattoman sidoksen poisto ilman uutta GI-oletusta.','B':'Katselmoi katalogin lähde, valmistus ja analogian perustelu reseptikohtaisesti.','C':'Hanki oikeaan ruokaan ja valmistukseen soveltuva GI-lähde; säilytä null, jos näyttö puuttuu.','D':'Vertaa nykyistä ravintolaskelmaa ja viiteaineistoja; varmista koostumus ja sen jälkeen kaikki GI-estot.','E':'Varmenna annos-, massa-, yksikkö- ja valmistusperusta ennen laskentaa.','F':'Vertaa reseptiä ja syötettä ainesosa kerrallaan; fingerprintin vaihto ei yksin riitä.','G':'Ratkaise useampi riippumaton lähde-/syöteongelma; yhden aineksen korjaus ei riitä.','H':'Hanki toimituksellinen ratkaisu vaihtoehtoon tai valmistukseen; älä valitse skenaariota hiljaisesti.'}[cls]})

byid=unique_by(rows, 'recipeId', 'incomplete planning inventory')
for candidate in reuse.values():
    assert gi[candidate[0]].get('calculationUse') != 'REFERENCE_ONLY'
assert set(byid) == {rid for rid, r in results.items() if r['status'] != 'CALCULATED'}
assert len(byid)==len(rows)==pilot['summary']['insufficientSourceData']
counts={c:sum(r['primaryClass']==c for r in rows) for c in 'ABCDEFGH'}
assert sum(counts.values())==len(rows)
family_rows=[]
for fam in sorted({i['family'] for r in rows for i in r['ingredients']}):
    present=[r for r in rows if any(i['family']==fam for i in r['ingredients']) or any(family(i['item'])==fam for i in r['currentRecipeIngredients'])]
    blocking=[r for r in rows if fam in r['blockingFamilies'] or (r['omissionLimitExceeded'] and any(i['family']==fam and i['giState']=='missing-GI' and (i['availableCarbohydratePerServingG'] or 0)>0 for i in r['ingredients']))]
    sole=[r for r in blocking if r['blockingFamilies']==[fam] and not set(r['blockerTags']) & {'FINGERPRINT','EDITORIAL','TOLERANCE','OTHER'}]
    ready=[r for r in sole if not set(r['blockerTags']) & {'COMPOSITION','MASS'}]
    # A GI for one omitted family can resolve cumulative tolerance without
    # inventing its GI value. This is only a conditional blocker-count ceiling.
    tolerance_ready=[r for r in blocking if r['blockerTags']==['TOLERANCE'] and r['omittedCarbohydratePerServingG']-sum(i['availableCarbohydratePerServingG'] or 0 for i in r['ingredients'] if i['family']==fam and i['giState']=='missing-GI')<2]
    ready += [r for r in tolerance_ready if r not in ready]
    locally_resolvable=[]
    for r in blocking:
        others=[b for b in r['blockers'] if fam not in b['families']]
        remaining=[b for b in others if not b['ingredientIndices'] or any(ix not in r['omissionDiagnostic']['ingredientIndices'] for ix in b['ingredientIndices'])]
        if not remaining and r['omissionDiagnostic']['omittedAfterRemovalG']<2 and not any(s['family']!=fam for s in r['semanticReviewFindings']):
            locally_resolvable.append(r['recipeId'])
    known=[]; unknown=[]
    for r in present:
        pieces=[i for i in r['ingredients'] if i['family']==fam]
        if not pieces or any(i['availableCarbohydratePerServingG'] is None for i in pieces): unknown.append(r['recipeId'])
        else: known.append({'recipeId':r['recipeId'],'gPerServing':sum(i['availableCarbohydratePerServingG'] for i in pieces)})
    family_rows.append({'family':fam,'presentRecipes':len(present),'blockingRecipes':len(blocking),'soleBlockingFamilyRecipes':len(sole),
      'otherwiseCompositionAndMassReadyRecipes':len(ready),'theoreticalNewValuesUpperBound':len(ready),
      'readyRecipeIds':[r['recipeId'] for r in ready],'soleFamilyRecipeIds':[r['recipeId'] for r in sole],
      'allOtherBlockersHaveLocalReviewPathRecipeIds':locally_resolvable,
      'allOtherBlockersHaveLocalReviewPathCount':len(locally_resolvable),
      'blockingRecipeIds':[r['recipeId'] for r in blocking],'knownCarbohydrateByRecipe':known,'unknownCarbohydrateRecipeIds':unknown,
      'knownMinG':min((i['gPerServing'] for i in known),default=None),'knownMaxG':max((i['gPerServing'] for i in known),default=None),
      'sourceAvailability':'Existing catalog candidate needs preparation review' if fam in {'maitotuote','pähkinä/siemen'} else 'No universal approved solution established; distinct foods/preparations retained',
      'uncertainty':'HIGH: upper bound assumes all family-specific issues solved; not a promise or a single interchangeable GI source',
      'effort':'recipe review plus source research; varies by exact preparation'})
family_rows.sort(key=lambda r:(-r['blockingRecipes'],r['family']))
top20=first+extra_priority
assert len(top20)==len(set(top20))==20 and set(top20)<=set(byid)
shared_order=['maitotuote','pähkinä/siemen','tomaatti','kookosmaito','liemi']
seen=set(); shared=[]
for fam in shared_order:
    f=next(f for f in family_rows if f['family']==fam)
    eligible=set(f['readyRecipeIds'])
    shared.append({'family':fam,'candidateCeiling':len(eligible),'incrementalCeilingInThisOrder':len(eligible-seen),'candidateIds':sorted(eligible),
       'qualification':'Catalog reuse for selected ingredients only' if fam in {'maitotuote','pähkinä/siemen'} else 'New measured preparation-matched evidence required; otherwise yield zero'})
    seen |= eligible

manifest_paths=['docs/nutrition/glycemic-coconut-source-review.json','docs/nutrition/glycemic-load-pilot-input.json','docs/nutrition/glycemic-index-records.json','docs/nutrition/food-records.json','docs/nutrition/glycemic-load-recipe-bindings.json','site/scripts/glycemic-load-model.ts','site/scripts/glycemic-load-pilot.ts','site/scripts/glycemic-load-recipe-binding.ts','docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json','docs/nutrition/glycemic-coverage-batch-2b6d-current.json','docs/nutrition/glycemic-coverage-current-2026-10-25.json']
report={'schemaVersion':2,'scope':'AJO 0.6 planning only; current model acceptance is not scientific source approval',
 'productionCommit':PRODUCTION_COMMIT, 'productionRun':'https://github.com/ozirix-dev/Reseptit/actions/runs/40640331867',
 'historicalRun0':{'commit':ORIGINAL_RUN_COMMIT,'summary':historical['summary'],'classCounts':historical['classCounts']},
 'regressionChecks':regression,
 'referenceOnlyGiRecordIds':sorted(r['id'] for r in gi.values() if r.get('calculationUse')=='REFERENCE_ONLY'),
 'sourceCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
 'inputs':{p:digest(p) for p in manifest_paths},'freshAuditTimes':{'glycemic':pilot['generatedAt'],'nutrition':nutrition['calculatedAt']},
 'summary':pilot['summary'],'giRecords':len(gi),'giTiers':dict(collections.Counter(r['qualityTier'] for r in gi.values())),
 'nutritionCounts':nutrition['counts'],'incompleteNutritionCounts':dict(collections.Counter(r['nutritionStatus'] for r in rows)),
 'classCounts':counts,'overlapCounts':{t:sum(t in r['blockerTags'] for r in rows) for t in sorted({t for r in rows for t in r['blockerTags']})},
 'persistentFingerprintMismatches':{k:pilot[k] for k in ('recipeBindingMismatches','calculationInputMismatches','calculationEvidenceMismatches')},
 'inventoryChecks':{'generalAndBatchMatchFreshRows':True,'historicalValuesPreservedExceptApprovedWithdrawal':True,'publishedPostCorrectionValuesUnchanged':True},
 'existingDuplicateFoodRecordIds':sorted(k for k,v in collections.Counter(r['id'] for r in read('docs/nutrition/food-records.json')).items() if v>1),
 'semanticFindingsIncludingCalculated':semantic_all,'families':family_rows,'top20':top20,
 'priorityExplanation':'Editorially reviewed top20 overrides purely mechanical score: no empirical probabilities. Recipe/source mismatch, actual preparation, existing evidence and realistic whole-recipe unlock determine order. A single GI family can contain incompatible preparations.',
 'sharedTop5':shared,'firstBatch':{'recipeIds':first,'planningNetGainRange':[0,5],'guaranteedNetGain':0,'conditionalMaximum':5,'requires':'Independent per-recipe source review, source-backed amounts, unchanged calculator, full publication checks; failure may yield zero.'},
 'recipes':rows}

# Each field below is an explicit planning judgement, not a new source approval.
first_reviews = {
 'jauhelihapihvit-vhh-kermakastikkeella': {
  'sourceReview':'Fineli 29 -liemen tuote, laimennus ja 100 ml → 100 g; myös nykyiset kuumennetun kerman ja sipulin analogiat tarkistetaan koko reseptin katselmoinnissa.',
  'amountReadiness':'4 annosta; kaikki laskentamassat ovat olemassa. Munan 55 g, voin 14 g ja liemen tilavuusmuunnos tarvitsevat lähdevarmennuksen; tavallinen ravintoauditointi on INSUFFICIENT SOURCE DATA.',
  'tolerance':'Liemi 0,750 g/annos: väärän GI:n poistoehdokas nostaisi poisjätöt 0,43705 → 1,18705 g/annos. Alle 1 g / alle 2 g voi soveltua vain koostumuksen ja määrän tarkistuksen jälkeen.',
  'unlock':'Poista perusteeton keitto-GI vain, jos pieni liemiosuus ja koko muu ainesketju kestävät lähdetarkistuksen.',
  'oneBatch':'Realistinen rajattu yhden erän katselmointi; numeerista lopputulosta ei hyväksytä tässä.',
 },
 'vhh-kaalilaatikko': {
  'sourceReview':'dairy-category-mean-gi-35 on olemassa, mutta 175 °C:ssa 60–70 min kypsennetyn kerman analogia on perusteltava; avainten korjaus ei yksin riitä.',
  'amountReadiness':'6 annosta; kerma 200 g, sipuli 55 g, munat 110 g, liemi 100 g ja meiramin arvio tarkistettava reseptimittoihin. Ei puuttuvaa olennaista massaa mallissa, mutta meiramin 0,1 g HH on oletus.',
  'tolerance':'Kerma 0,96667 g/annos. Pelkkä GI-sidoksen poisto nostaisi yhteispoisjätön 1,17752 → 2,14418 g/annos ja estäisi edelleen. Tarvitaan kelvollinen GI-sidos tai muu erikseen lähteistetty ratkaisu.',
  'unlock':'Varmenna kerman hyväksyttävä ruoka-/valmistusanalogia ja koko määräpohja; muuta vain perustellut avaimet myöhemmässä erässä.',
  'oneBatch':'Mahdollinen yhden erän lähdekatselmointi, epävarmuus kohtalainen; ei automaattinen avainkorjaus.',
 },
 'som-tam-vhh-kurkkuna': {
  'sourceReview':'vegetables-category-mean-gi-66 on ehdokas keitetyille vihreille pavuille. Varmista myös Fineli 29022:n valmistustila, raakatomaatin nykyinen sidos ja pähkinäanalogia.',
  'amountReadiness':'4 annosta; papuja 100 g ja kaikki muut massat määritelty. Keitetty/valutettu massa tarkistettava lähteeseen; nykyiset fingerprintit eivät ole vanhentuneet.',
  'tolerance':'Papujen 1,2645 g/annos ylittää yksittäisen poisjätön rajan. Muiden poisjättö on 0,36675 g/annos; pavuille tarvitaan lähde, niitä ei saa pyöristää alle 1 g:n.',
  'unlock':'Hyväksytty papujen ruoka-/valmistusvastaavuus ja kaikkien syötteiden tarkistus; vasta sitten vegetables/cooked-avainten korjaus.',
  'oneBatch':'Mahdollinen yhden erän katselmointi, jos olemassa oleva lähde todella kattaa valmistuksen.',
 },
 'siemengranola-jogurtilla': {
  'sourceReview':'nuts-category-mean-gi-22 on manteliehdokas. Fineli 379 -mantelilastut paahdetaan 160 °C:ssa 18–22 min; lähteen on katettava tämä muoto. Myös jogurtti- ja vadelmasidokset tarkistetaan.',
  'amountReadiness':'4 annosta; 40 g mantelilastuja ja kaikki muut massat määritelty. Tuettu ravintolaskelma on olemassa, mutta paahto ja syötävä osuus vaativat tarkistuksen.',
  'tolerance':'Nykyinen poisjättö 2,06375 g/annos estää. Jos mantelien 0,660 g/annos saa hyväksyttävän GI:n, poisjättö olisi 1,40375 g/annos. GI-arvoa ei tässä kokeessa arvata.',
  'unlock':'Vähintään riittävän yhden poisjätetyn osuuden hyväksyttävä GI-sidos sekä koko ainesketjun katselmointi; manteli on nimetty tutkimusehdokas.',
  'oneBatch':'Rajattu mutta lähderiskinen yhden erän työ; paahtovastaavuuden puuttuessa jää nulliksi.',
 },
 'valimerellinen-halloumi-tomaattileipa': {
  'sourceReview':'Ravintolaskelman Fineli 31842 -maalaisleipäproxy ei ole hyväksytty hapanjuurileivän GK-koostumus. Leipä-GI-katalogiehdokas ja paahdon vastaavuus on tarkistettava erikseen.',
  'amountReadiness':'2 annosta; hapanjuurileipää 100 g. Annos- ja grammapohja on täsmällinen, mutta tuotekoostumus puuttuu GK-syötteestä. Öljyn/suolan nollahiilihydraattiperuste ja muu resepti tarkistetaan.',
  'tolerance':'Leivän imeytyvä hiilihydraatti on ratkaisematon eikä saa olla nolla. Pienosuustoleranssia ei voi soveltaa tuntemattomaan leipäosuuteen.',
  'unlock':'Lähdevastaava hapanjuurileivän koostumus sekä paahdettuun leipään sopiva GI; yksi koostumuskorjaus yksin ei riitä.',
  'oneBatch':'Yhden erän selvityskohde, ei varma avaus. Kahden lähdeportin vuoksi viisikon epävarmin; ei silti uutta näyttöä selvästi paremmasta korvaajasta.',
 },
}
old_rows=unique_by(historical['recipes'],'recipeId','original planning snapshot')
for rid in first:
    row=byid[rid]
    assert row['inputVersion']==old_rows[rid]['inputVersion'], ('First-batch input changed; reassess selection',rid)
    assert row['blockers']==old_rows[rid]['blockers'], ('First-batch blockers changed; reassess selection',rid)
    first_reviews[rid].update({
        'recipeId':rid, 'servings':row['servings'], 'allCurrentBlockers':row['blockers'],
        'availableFoodRecordIds':sorted({i['foodRecordId'] for i in row['ingredients'] if i['foodRecordId']}),
        'modelAcceptedGiRecordIds':sorted({i['giRecordId'] for i in row['ingredients'] if i['giState']=='accepted-by-current-model'}),
        'candidateGiRecordId':row['existingSourceCandidate']['id'] if row['existingSourceCandidate'] else None,
        'expectedNetGain':{'guaranteed':0,'conditionalMaximum':1,'sourceReviewRequired':True},
        'comparedWithOriginal':'Input fingerprint and full blocker list unchanged; retained after reassessment',
    })
report['firstBatch']['reviews']=[first_reviews[rid] for rid in first]
report['firstBatch']['selectionDecision']='Retain all five: no change to their inputs/blockers; withdrawal recipe has no usable GI source and is not a better immediate implementation target.'
report['firstBatch']['rangeMeaning']='0–5 is a logical conditional bound, not an expected +1–3 delivery forecast.'
report['priorityChanges']={
 'addedRecipes':sorted(set(byid)-set(old_rows)), 'removedRecipes':sorted(set(old_rows)-set(byid)),
 'classChanges':[{'recipeId':rid,'before':old_rows[rid]['primaryClass'],'after':byid[rid]['primaryClass']} for rid in sorted(set(byid)&set(old_rows)) if byid[rid]['primaryClass']!=old_rows[rid]['primaryClass']],
 'top20Added':sorted(set(top20)-set(historical['top20'])), 'top20Removed':sorted(set(historical['top20'])-set(top20)),
 'rationale':'Yellow curry enters at 12 as a precisely documented single-source withdrawal; baozi moves outside the top20, remaining in the complete inventory. This prioritizes a traceable source-review target without claiming coconut GI availability. First ten and first batch remain unchanged.',
}
report['newFingerprintMismatchesComparedWithHistoricalBaseline']={k:batch['currentSummary'][k] for k in ('newStructureMismatches','newInputMismatches','newEvidenceMismatches')}
report['analysisToolHashes']={p:digest(p) for p in (
 'docs/nutrition/tools/glycemic-coverage-run-0-analyze.py','docs/nutrition/tools/glycemic_run0_validation.py','docs/nutrition/tools/glycemic-coverage-run-0-probe.mts')}
report['auditContentHashes']={p:digest(p) for p in ('tmp/nutrition/glycemic-load-pilot.json','tmp/nutrition/audit.json')}
report['qualityReviewQueue']={
 'coconut':{'bindingCorrection':'MERGED PR #124','remainingIssue':'No accepted standalone coconut-milk GI','referenceOnlyId':'coconut-milk-porridge-gi-31'},
 'alooParatha':{'recipeId':'intialainen-aloo-paratha','issue':'Fineli 310 is Jerusalem artichoke, not potato; separate composition/source-match review'},
 'semolina':{'recipeIds':['intialainen-rava-uttapam','pohjoisafrikkalainen-baghrir','pohjoisafrikkalainen-msemen-hunajalla','pohjoisafrikkalainen-harcha-juustolla'],'issue':'Separate preparation-match review; published values unchanged'},
}
for rid in report['qualityReviewQueue']['semolina']['recipeIds']:
    assert results[rid]['status']=='CALCULATED'
for f in family_rows:
    f['confirmedNewValues']=0
    f['potentialBasis']='Conditional count of recipes whose other model blockers can clear; no source approval or empirical yield forecast'
dump('glycemic-coverage-run-0-inventory.json',report)

labels={'A':'Lähes laskentavalmis','B':'Olemassa olevan GI-lähteen katselmointi','C':'Uusi soveltuva GI-lähde','D':'Ravinto-/koostumustieto','E':'Massa, annos tai valmistus','F':'Rakenne tai syöteversio','G':'Useita riippumattomia esteitä','H':'Toimituksellinen päätös'}
original_plan=subprocess.check_output(['git','show',ORIGINAL_RUN_COMMIT+':docs/nutrition/glycemic-coverage-run-0-plan.md'],cwd=root).decode('utf-8').rstrip()
# Keep original prose/numbers byte-for-byte (apart from checkout line endings).
lines=['# AJO 0–0.6: GI/GK-kattavuuskampanjan suunnitteluhistoria','',
 'Ajantasainen suunnittelu on tämän dokumentin **AJO 0.6** -osuudessa. Alla oleva alkuperäinen AJO 0 on historiallinen: sen 326/138/188-luvut ja silloiset riskit eivät kuvaa uutta tuotantoa.','',
 '## AJO 0 – alkuperäinen analyysi','',original_plan,'',
 '## AJO 0.5 – lähdelaadun korjaus','',
 '[PR #124](https://github.com/ozirix-dev/Reseptit/pull/124) yhdistettiin ja julkaistiin. Keltaisen kanacurryn aiempi GK 3,48 poistettiin, koska riisi-kookosmaitopuuron GI 31 ei tue yksittäistä kookosmaitoa. Neljä virheellistä sidontaa poistettiin; kolme muuta reseptiä olivat jo keskeneräisiä. Katalogin tutkimus säilyy REFERENCE_ONLY-viitteenä. [Tarkka lähdekorjausnäyttö](glycemic-coconut-source-review.md) ja sen koneluettava raportti ovat poikkeuksen peruste.','',
 '## AJO 0.6 – ajantasaistettu suunnittelu','',
 f'Tuotannon lähtöcommit `{PRODUCTION_COMMIT}`. Analyysin checkout-commit `{report["sourceCommit"]}` ja työkalujen/syötteiden SHA-256:t on lukittu koneelliseen inventaarioon. [Pages-CI 40640331867](https://github.com/ozirix-dev/Reseptit/actions/runs/40640331867): build ja deploy SUCCESS. [Julkinen GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).',
 f'Tuore auditointi: **{pilot["summary"]["recipes"]} reseptiä / {pilot["summary"]["calculated"]} laskettua / {pilot["summary"]["insufficientSourceData"]} keskeneräistä**, kattavuus {100*pilot["summary"]["calculated"]/pilot["summary"]["recipes"]:.1f} %. GI {len(gi)}: 6 STRONG / 39 SUPPLEMENTARY; yksi REFERENCE_ONLY, jota ei hyväksytä laskentalähteeksi eikä lähde-ehdokkaaksi. Julkaistujen arvojen nettomuutos tässä suunnitteluerässä **0**.','',
 '### Uusi luokitus ja koko työjono','',
 'Kaikki nykyiset keskeneräiset reseptit on analysoitu uudelleen tuoreista GK- ja ravintoauditeista. Tunnisteiden uniikkius, täydellinen reseptijoukko sekä molempien nykyinventaarioiden tilat, arvot, estoviestit, ravintoluokat ja kolme fingerprintiä tarkistetaan.','',
 '| Luokka | Ensisijainen työlinja | Alkuperäinen AJO 0 | AJO 0.6 |','| --- | --- | ---: | ---: |']
lines += [f'| {c} | {labels[c]} | {historical["classCounts"][c]} | {counts[c]} |' for c in labels]
lines += [f'| Yhteensä | | {historical["summary"]["insufficientSourceData"]} | {len(rows)} |','',
 'Päällekkäiset liput: '+', '.join(f'{k} {v}' for k,v in report['overlapCounts'].items())+'. Liput ovat tarkistusluokkia, eivät todisteita samanmääräisistä tieteellisistä virheistä. Ensisijaiset A–H-luokat ovat erilliset; sivuestot säilyvät.',
 f'Työjonoon lisättiin `{WITHDRAWN}`; mitään aiempaa keskeneräistä ei poistunut. Vanhojen ensisijaisten luokkien muutokset: {len(report["priorityChanges"]["classChanges"])}. Alkuperäisen 20 listaan nähden keltainen curry tulee sijalle 12 ja baozi siirtyy listan ulkopuolelle mutta säilyy täydellisessä työjonossa. Tämä on jäljitettävän lähdetarkistuksen priorisointi, ei oletus kookosmaito-GI:n löytymisestä.','',
 '### Yhteisten esteperheiden todellinen ehdollinen potentiaali','',
 'Yhden perheen ratkaisu ei riitä, jos reseptillä on muita portteja. Alla ainoan perheen, muiden porttien ja paikallisen tarkistuspolun määrät ovat eri ehtoja eikä niitä summata. Myös saman perheen tuotteet ja valmistustavat vaativat eri lähteitä. **Varmennettu uusi nettotuotto on jokaisessa perheessä 0**; ehdollinen katto ei ole julkaisuennuste.','',
 '| Perhe | Estää reseptejä | Ainoa estävä perhe | Muut portit valmiit / ehdollinen katto | Muilla paikallinen tarkistuspolku |','| --- | ---: | ---: | ---: | ---: |']
lines += [f'| {f["family"]} | {f["blockingRecipes"]} | {f["soleBlockingFamilyRecipes"]} | {f["otherwiseCompositionAndMassReadyRecipes"]} | {f["allOtherBlockersHaveLocalReviewPathCount"]} |' for f in family_rows[:10]]
coconut=next(f for f in family_rows if f['family']=='kookosmaito')
old_coconut=next(f for f in historical['families'] if f['family']=='kookosmaito')
lines += ['',f'Kookosmaito: esiintyy {coconut["presentRecipes"]} keskeneräisessä (ennen {old_coconut["presentRecipes"]}), estää {coconut["blockingRecipes"]} (ennen {old_coconut["blockingRecipes"]}), ehdollinen avauskatto {coconut["theoreticalNewValuesUpperBound"]} (ennen {old_coconut["theoreticalNewValuesUpperBound"]}). Kolmen vanhan reseptin semanttinen riski on nyt todellinen puuttuvan GI:n esto; uusi curry lisää yhden reseptin. Tiheys-/tuote-/määrä-/varianttiongelmat eivät katoa GI-lähteen löytymisellä.','',
 '### Päivitetty 20 reseptin prioriteettijono','',
 'Pisteytyksen kaava ja A–H-luokittelun säännöt ovat alkuperäisessä menetelmäkuvauksessa. Järjestys sisältää dokumentoidun toimituksellisen valinnan. Ensimmäinen kymmenikkö säilyi, koska sen lähdepolut ja estot eivät muuttuneet ja uusilta ehdokkailta puuttuu parempi varmistettu lähdepolku.','',
 '| # | Resepti | Luokka | Piste | Seuraava portti |','| ---: | --- | --- | ---: | --- |']
for no,rid in enumerate(top20,1):
    r=byid[rid];lines.append(f'| {no} | `{rid}` | {r["primaryClass"]} | {r["priority"]["score"]} | {r["nextAction"]} |')
lines += ['', '### Seuraavan 2B6E-erän ehdotettu viisikko','',
 'Säilytetään alkuperäinen viisikko. Kaikkien viiden syötefingerprint ja koko estolista ovat ennallaan; jokainen tarkistettiin uuden tuotantotilan rinnalla. Keltaisen curryn oma GI puuttuu eikä se ole näitä parempi välitön toteutuskohde.','',
 '**Varmistettu nettolisäys 0; jokaisessa reseptissä ehdollisesti 0–1 ja koko joukossa 0–5. Aiempi +1–3 ei ole toimituslupaus eikä tämän ajon odotusarvo.** Tulokset voivat jäädä kokonaan nollaan. Määrät ovat loogisia ylärajoja, eivät lähteiden löytämisen todennäköisyyksiä.','']
for no,rid in enumerate(first,1):
    r=first_reviews[rid]
    lines += [f'#### {no}. `{rid}`','',
     'Nykyiset estot: '+'; '.join(b['message'] for b in r['allCurrentBlockers']),
     'Jo olemassa: '+', '.join('`'+v+'`' for v in r['availableFoodRecordIds'])+'. Mallin nyt hyväksymät GI-tietueet: '+', '.join('`'+v+'`' for v in r['modelAcceptedGiRecordIds'])+'. Mallihyväksyntä ei korvaa lähdekatselmointia.',
     '**Tarkistettava lähde:** '+r['sourceReview'], '**Syöte ja annos:** '+r['amountReadiness'],
     '**Pienosuudet:** '+r['tolerance'], '**Avaava ratkaisu:** '+r['unlock'], '**Erän realistisuus:** '+r['oneBatch']+' Ehdollinen nettolisäys 0–1.','']
lines += ['### Historiallinen regressiosuoja ja erilliset laatutyöt','',
 f'Historiallinen 2B6D-baseline säilyy muuttumattomana: {regression["historicalCalculatedCount"]} silloista laskettua arvoa. Vain `{WITHDRAWN}` saa poiketa lasketusta tilasta, ja sen koko nykyinen tulos on täsmättävä PR #124:n dokumentoituun jälkeen-tilaan. Muut historialliset arvot sekä kaikki {regression["previouslyPublishedValuesPreserved"]} nykyistä laskettua arvoa tarkistetaan; kahden 2B6D-lisäyksen arvot säilyvät: hirssipuuro 21,19 ja kuskus-aamiaiskulho 34,36.',
 'REFERENCE_ONLY-lipun poistaminen, hylätyn kookosmaitosidoksen palautus, muun aiemman arvon poistuminen/muuttuminen, uusi laskettu resepti, duplikaatti-ID tai työjonon aukko keskeyttää analyysin. Julkaistua dataa tai laskentakoodia ei sallita muutetuksi suhteessa lukittuun tuotantocommittiin.',
 'Voimassa olevat fingerprint-poikkeamat: '+', '.join(f'{k}={len(v)}' for k,v in report['persistentFingerprintMismatches'].items())+'. Uudet poikkeamat historiallisen vertailun suhteen: '+', '.join(f'{k}={v}' for k,v in report['newFingerprintMismatchesComparedWithHistoricalBaseline'].items())+'. 38 rakenne-estoa ja uusien muutosten 0/0/0 kuvaavat eri asioita.',
 '`intialainen-aloo-paratha`: Fineli 310 / MAA-ARTISOKKA vs peruna säilyy erillisenä koostumus- ja lähdevastaavuustyönä. Tortillan keitetty peruna vs öljykypsennys säilyy erillisenä valmistusriskinä.',
 'Lisähavainto: koostumuskatalogissa on ennestään kaksi eri tietuetta samalla ID:llä `fineli-11557-2026-10-24`. Analyysi säilyttää laskentamallin nykyisen viimeisen tietueen valinnan; koostumuksia ei muuteta. Tämä jää erilliseksi lähdekatalogin laatutarkistukseksi.',
 'Neljä laskettua mannasuurimoreseptiä säilyvät erillisessä valmistusvastaavuuden katselmoinnissa: '+', '.join('`'+rid+'`' for rid in report['qualityReviewQueue']['semolina']['recipeIds'])+'. Niiden arvoja ei muutettu.','',
 '### Uudelleenajo ja tarkistukset','',
 'Aja oikean checkoutin `site/`-hakemistosta. Audittien tulokset menevät ohitettuun `tmp/nutrition`-hakemistoon; content/build vain tämän työpuun generoituun sivustoon. Analyysin ja probe-kokeen tuloskohteen on oltava repon ulkopuolinen scratch. Versionhallittuihin tiedostoihin siirto tehdään repo_guardilla.','',
 '```powershell','npm run content:sync','npm run audit:nutrition -- --strict','npm run audit:glycemic-load',
 'python ../docs/nutrition/tools/glycemic-coverage-run-0-analyze.py .. D:/Temp/reseptit-run06-replay',
 'python ../docs/nutrition/tools/test_glycemic_run0_validation.py',
 'node --import tsx ../docs/nutrition/tools/glycemic-coverage-run-0-probe.mts .. D:/Temp/reseptit-run06-replay/probe.json',
 'npm run test:glycemic','npm test','npm run test:select-ci','npm run build','npm run test:static','```','',
 'Kattavuuskomentoa ei tarvita seurattujen nykyinventaarioiden muuttamiseen: analyysi täsmää jokaisen tuoreen tulosrivin kumpaankin nykyinventaarioon. Kahden peräkkäisen analyysiajon JSON/Markdown ja probe-tulokset verrataan byte-for-byte samoilla syötteillä. Paikallinen testitulos ja viimeisen HEADin CI raportoidaan PR #123:ssa; aiemman HEADin CI ei hyväksy tätä päivitystä.',
 'Git-integraatiossa säilytettiin molemmat README-lisäykset. PR #124:n laskentatoteutus, historialliset baselinet ja tuotannon GK-tulokset ovat muuttumattomat. PR #123 pysyy Draftina; ei mergeä, deployta, ReportHubia eikä 2B6E-laskentaa.','',
 '**Pysähdy tähän. AJO 1 / 2B6E edellyttää erillistä toimeksiantoa.**','']
(out/'glycemic-coverage-run-0-plan.md').write_text('\n'.join(lines),encoding='utf-8')
print(json.dumps({'summary':report['summary'],'classes':counts,'overlap':report['overlapCounts'],'familiesTop5':[{k:f[k] for k in ('family','blockingRecipes','theoreticalNewValuesUpperBound')} for f in family_rows[:5]],'priorityChanges':report['priorityChanges'],'first':first},ensure_ascii=False,indent=2))
