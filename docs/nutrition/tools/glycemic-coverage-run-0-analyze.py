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

pilot = read('tmp/nutrition/glycemic-load-pilot.json')
nutrition = read('tmp/nutrition/audit.json')
general = read('docs/nutrition/glycemic-coverage-current-2026-10-25.json')
batch = read('docs/nutrition/glycemic-coverage-batch-2b6d-current.json')
baseline = read('docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json')
catalog = read('docs/nutrition/glycemic-index-records.json')
gi = {x['id']: x for x in catalog['records']}
food = {x['id']: x for x in read('docs/nutrition/food-records.json')}
ns = {x['recipe_id']: x for x in nutrition['inventory']}
inputs = {x['recipeId']: x for x in pilot['calculationInputs']}
current = {x['recipeId']: x for x in batch['recipes']}
results = {x['recipeId']: x for x in pilot['results']}
assert len(results) == len(pilot['results']) == len(ns)
assert set(ns) == set(results) == set(inputs)
for saved in (general, batch):
    assert set(x['recipeId'] for x in saved['recipes']) == set(results)
    for row in saved['recipes']:
        rid = row['recipeId']
        for key in ('status', 'glycemicLoadPerServing'):
            assert row[key] == results[rid][key], (rid, key)
        assert [b['message'] for b in row['blockers']] == results[rid]['blockers'], rid
        for key, hashes in [('recipeVersion','sourceHashes'),('calculationInputVersion','calculationInputHashes'),('calculationEvidenceVersion','calculationEvidenceHashes')]:
            assert row[key] == pilot[hashes][rid], (rid, key)
        assert row['nutritionStatus'] == ns[rid]['status'], rid
for r in baseline['recipes']:
    if r['status'] == 'CALCULATED':
        assert results[r['recipeId']]['status'] == 'CALCULATED'
        assert results[r['recipeId']]['glycemicLoadPerServing'] == r['glycemicLoadPerServing']

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
extra_priority = ['jerk-kana','hunaja-sinappikana-kaalilla','caponata','pasta-alla-norma','harira','kanapyorykat-tomaattikastike','karibia-kookosriisi-pavuilla','vietnamilainen-banh-xeo-aamiaisletut','indonesialainen-nasi-uduk-aamiaisella','thai-roti-munalla-banaanilla','paella-valenciana','pohjoisafrikkalainen-lablabi','kana-enchilada-kukkakaalivuoka','vhh-raparperipiirakka','baozi']
notes = {
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

byid={r['recipeId']:r for r in rows}
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

manifest_paths=['docs/nutrition/glycemic-load-pilot-input.json','docs/nutrition/glycemic-index-records.json','docs/nutrition/food-records.json','docs/nutrition/glycemic-load-recipe-bindings.json','site/scripts/glycemic-load-model.ts','site/scripts/glycemic-load-pilot.ts','site/scripts/glycemic-load-recipe-binding.ts','docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json','docs/nutrition/glycemic-coverage-batch-2b6d-current.json','docs/nutrition/glycemic-coverage-current-2026-10-25.json']
report={'schemaVersion':1,'scope':'AJO 0 planning; current model acceptance is not new source approval',
 'sourceCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
 'inputs':{p:digest(p) for p in manifest_paths},'freshAuditTimes':{'glycemic':pilot['generatedAt'],'nutrition':nutrition['calculatedAt']},
 'summary':pilot['summary'],'giRecords':len(gi),'giTiers':dict(collections.Counter(r['qualityTier'] for r in gi.values())),
 'nutritionCounts':nutrition['counts'],'incompleteNutritionCounts':dict(collections.Counter(r['nutritionStatus'] for r in rows)),
 'classCounts':counts,'overlapCounts':{t:sum(t in r['blockerTags'] for r in rows) for t in sorted({t for r in rows for t in r['blockerTags']})},
 'persistentFingerprintMismatches':{k:pilot[k] for k in ('recipeBindingMismatches','calculationInputMismatches','calculationEvidenceMismatches')},
 'inventoryChecks':{'generalAndBatchMatchFreshRows':True,'historicalCalculatedValuesUnchanged':True,'freshCalculatedValuesUnchanged':True},
 'semanticFindingsIncludingCalculated':semantic_all,'families':family_rows,'top20':top20,
 'priorityExplanation':'Editorially reviewed top20 overrides purely mechanical score: no empirical probabilities. Recipe/source mismatch, actual preparation, existing evidence and realistic whole-recipe unlock determine order. A single GI family can contain incompatible preparations.',
 'sharedTop5':shared,'firstBatch':{'recipeIds':first,'planningNetGainRange':[1,3],'guaranteedNetGain':0,'conditionalMaximum':5,'requires':'Independent per-recipe source review, source-backed amounts, unchanged calculator, full publication checks; failure may yield zero.'},
 'recipes':rows}
dump('glycemic-coverage-run-0-inventory.json',report)
labels={'A':'Lähes laskentavalmis','B':'Olemassa olevan GI-lähteen katselmointi','C':'Uusi soveltuva GI-lähde','D':'Ravinto-/koostumustieto','E':'Massa, annos tai valmistus','F':'Rakenne tai syöteversio','G':'Useita riippumattomia vaikeita esteitä','H':'Toimituksellinen päätös'}
lines=['# GI/GK-kattavuuskampanja — AJO 0, 28.10.2026','',
 '## Päätös ja rajaus','',
 '**AJO 0 COMPLETE – READY FOR COVERAGE BATCH 2B6E**','',
 'AJO 0 tuottaa työjonon ja seuraavan erän suunnitelman. AJO 1:tä ei ole aloitettu. Reseptit, GI-katalogi, laskentasyötteet, kaava, rajat, fingerprintit ja historialliset baselinet säilyvät muuttumattomina. Julkaistujen uusien GK-arvojen nettolisäys on **0**.','',
 'Tämä valmius koskee suunnittelua, ei uusien lähteiden tai GK-arvojen hyväksyntää. Nykyisissä sidoksissa löytyneet semanttiset laatuongelmat alla on erotettava kattavuuserästä; yhden jo lasketun reseptin kookosmaitosidos tarvitsee erillisen kiireellisen katselmoinnin.','',
 '## Varmennettu lähtötilanne','',
 f'- GitHub main ja analyysipohja: `{report["sourceCommit"]}`.',
 '- Tuotanto: [Recipe site / Pages 40587729118](https://github.com/ozirix-dev/Reseptit/actions/runs/40587729118), success. [GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) palautti HTTP 200 ja näkyvät luvut 326 / 138 / 188.',
 '- Tuore content:sync, strict-ravintoauditointi ja GK-ajo: 326 / 138 / 188; kattavuus 42,33 %. GI 45: 6 STRONG, 39 SUPPLEMENTARY.',
 '- Ravintoauditointi koko kokoelmassa: 180 ESTIMATE WITH EVIDENCE, 86 INSUFFICIENT SOURCE DATA, 60 MISSING, 0 CONFLICT. Keskeneräisissä GK-resepteissä vastaavasti 94 / 40 / 54.',
 '- Yleisen ja 2B6D-inventaarion kaikki 326 tilaa, arvoa, estoviestiä ja kolme fingerprinttiä vastaavat tuoretta ajoa. Historiallisen 2B6D-baselinen 136 laskettua arvoa säilyvät.',
 '- **38 voimassa olevaa rakennesidonnan estoa**, 0 syöte- ja 0 lähdesidonnan poikkeamaa. Aiemman raportin 0/0/0 koski uusia muutoksia baselineen nähden, ei kaikkien estojen puuttumista.',
 '- Avoimet PR:t alussa: #100 Nutritics, #116 Vite, #118 GK-vaihteluväli-/skenaariosuunnitelma, #119 GK-suodattimet. #118 säilyy erillisenä; vaihteluvälejä ei toteuteta. Muita työpuita ei muutettu eikä poistettu.',
 '- `docs/nutrition/README.md`: vanhat 261/325- ja 190/325-luvut ovat historiallista tekstiä, eivät nykytilan mittareita.','',
 '## Luokittelumenetelmä','',
 'Inventaario sisältää jokaisen keskeneräisen reseptin kaikki ainesrivit, nykyiset lähde-ID:t, hiilihydraatit/annos, massat ja lähdemuistiot, hyväksytyt/missing/epävarmat GI-sidokset, ravintolaskelman täsmänimiosumat, nykyisen reseptin määrät, estoviestit, variantit, pienosuudet ja fingerprintit. `accepted-by-current-model` tarkoittaa nykyisen ohjelman hyväksyntää; se ei ole tämän ajon uusi tieteellinen hyväksyntä. Tuntematon määrä säilyy nullina.','',
 'Disjunkti ensisijainen työlinja valitaan järjestyksessä: H (ratkaisematon vaihtoehto), G (koostumus+GI eri perheissä tai vähintään kolme estävää perhettä), F (voimassa oleva sidontaesto), D (koostumus), E (massa), A (vain lähteistetyn alle 1 g:n väärän sidoksen poistoehdokas, kokonaissumma alle 2 g eikä havaittua semanttista estoa), B (nimetty olemassa oleva katalogiehdokas), C (jäljellä oleva GI-/valmistus-/toleranssiongelma). Kaikki sivuestot säilyvät.','',
 'Luokitus on toistettava työnsuunnittelun heuristiikka. Tekstihakujen PREPARATION-lippu tarkoittaa valmistuksen tarkistuskohtaa, ei 144 todistettua valmistusvirhettä. Työyksikköjen määrä perustuu estäviin ainesperheisiin sekä sidonta-/toleranssiportteihin; se ei ole työtuntiarvio. Ravintoauditoinnin puuttuva status ei yksin muodosta GK-estoa, eikä tuettu status todista kaikkia GI-analogia- tai tuotemuoto-oletuksia.','',
 '| Luokka | Ensisijainen työlinja | Reseptejä |','| --- | --- | ---: |']
lines += [f'| {c} | {labels[c]} | {counts[c]} |' for c in labels]
lines += [f'| Yhteensä | | {len(rows)} |','',
 f'Lähes valmiita **{counts["A"]}**, olemassa olevan GI:n ehdokkaita **{counts["B"]}**, ensisijaisesti uuden GI-lähteen tarpeessa **{counts["C"]}**. Koostumus- tai massakorjaus ensisijaisena D+E: **{counts["D"]+counts["E"]}**. Kaikki päällekkäiset koostumus-/massaliput huomioiden **{sum(bool(set(r["blockerTags"]) & {"COMPOSITION","MASS"}) for r in rows)}** reseptiä tarvitsee tämän tarkistuksen. GI-tarkistuslipun saa {report["overlapCounts"]["GI"]} reseptiä; tämä ei tarkoita yhtä montaa uuden GI-mittauksen tarvetta.','',
 'Päällekkäiset koneelliset liput: '+', '.join(f'{k} {v}' for k,v in report['overlapCounts'].items())+'.','',
 '## Kymmenen suurinta yhteistä esteperhettä','',
 'Perheet ovat hakuryhmiä, eivät keskenään vaihdettavia GI-ruokia. Tomaattiperhe sisältää myös salsat; kookosmaitoperhe myös kookosjuoman. Valmistus ja tarkka nimi säilyvät jokaisessa ainesrivissä. Esiintyminen kattaa nykyisen reseptin tai GK-syötteen; ristiriitainen vanha syöte voi sisältää eri nimikkeen. Tuntemattomia hiilihydraatteja ei sisällytetä vaihteluväliin eikä lasketa nollaksi.','',
 '| Perhe | Esiintyy | Estää | Ainoa estävä perhe¹ | Muut portit valmiit² | Muilla paikallinen korjauspolku³ | Tunnettu HH g/annos |','| --- | ---: | ---: | ---: | ---: | ---: | --- |']
for f in family_rows[:10]:
    ran='tuntematon' if f['knownMinG'] is None else f'{f["knownMinG"]:.3f}–{f["knownMaxG"]:.3f}'
    lines.append(f'| {f["family"]} | {f["presentRecipes"]} | {f["blockingRecipes"]} | {f["soleBlockingFamilyRecipes"]} | {f["otherwiseCompositionAndMassReadyRecipes"]} | {f["allOtherBlockersHaveLocalReviewPathCount"]} | {ran} |')
lines += ['',
 '¹ Sama perhe voi sisältää useita koostumus-/määräongelmia. ² Konservatiivinen teoreettinen enimmäismäärä, jos kyseisen perheen kaikki täsmälliset lähdeongelmat ratkeavat; sisältää myös perheen GI:llä mahdollisesti alittuvan kumulatiivisen toleranssin. ³ Muut aineskohtaiset estot ovat korkeintaan tunnettuja alle 1 g:n virheellisiä sidoksia, joiden poistoehdotus pitää summan alle 2 g:n. Tämä on katselmointipolku, ei jo hyväksytty korjaus. Sarakkeet ² ja ³ käyttävät eri ehtoja eivätkä ole summattavia.','',
 'Täydet reseptijoukot, jokaisen perheen tuntemattomat osuudet, tunnetut annosmäärät, päällekkäisyydet ja lähteen saatavuus ovat [JSON-inventaariossa](glycemic-coverage-run-0-inventory.json).','',
 '## Viisi parasta yhteistä lähdetyötä','',
 '| Järjestys | Kohde | Työ ja näyttö | Ehdollinen enimmäisavaus |','| ---: | --- | --- | ---: |']
shared_notes={
 'maitotuote':'Kerman nykyinen kategoriatietue: aloita kaalilaatikosta. Smetana jää erilliseen lähde-/ruokaperhekatselmointiin; regexin laajennus ei ole tämän erän ratkaisu. Pieni–keskisuuri työ, epävarmuus kohtalainen.',
 'pähkinä/siemen':'Mantelin GI granolassa voisi alittaa yhteistoleranssin. Paahdetut lastut ja leivottu mantelijauho eivät ole sama valmistus: Runebergintorttujen siirto on erityisen epävarma. Keskisuuri työ, korkea lähderiski.',
 'tomaatti':'Murska, kypsä tomaatti, salsa ja pyree erikseen. Aloita caponatasta, pastasta ja harirasta, joissa ravintolaskelma on tuettu. Raakatomaatin GI ei kelpaa kypsän ratkaisuksi. Suuri lähdetyö, korkea epävarmuus.',
 'kookosmaito':'Täsmällinen tuote, määrä ja kuumennus. Riisipuuro-GI hylätään yksittäisen kookosmaidon näyttönä. Seitsemän yhden perheen tapausta ja yksi toleranssitapaus; suuri työ ja korkea epävarmuus.',
 'liemi':'Ensimmäinen hyöty voi tulla lähteistetystä pienosuudesta jauhelihapihveissä. Suuremmat osuudet tarvitsevat tuotekohtaisen koostumuksen ja kelvollisen GI:n; keittojen keskiarvo ei kelpaa automaattisesti. Keskisuuri–suuri työ, korkea epävarmuus.'}
for no,s in enumerate(shared,1):
    lines.append(f'| {no} | {s["family"]} | {shared_notes[s["family"]]} | {s["candidateCeiling"]} |')
lines += ['',f'Näiden viiden ehdokasjoukon unioni on **{len(seen)} reseptiä**, ei julkaisuennuste. Inventaarion `incrementalCeilingInThisOrder` poistaa päällekkäisyydet. Perheiden kaikki muodot eivät ratkea yhdellä lähteellä; todellinen avaus voi olla nolla. Lähteiden saatavuutta ei väitetä osoitetuksi uudella kirjallisuustutkimuksella tässä ajossa.','',
 '## 20 ensisijaista reseptiehdokasta','',
 'Järjestys yhdistää toistettavan pisteytyksen ja dokumentoidun reseptikatselmoinnin. Piste = näytön saatavuus (1–3) / (työ (1–6) × riski (1–4) × riippumattomien työyksiköiden arvio). Arvot ovat järjestysasteikkoja, eivät tilastollisia todennäköisyyksiä. Jokaisen reseptin potentiaalinen nettolisäys on enintään +1; yhteisen katalogin muutos laajentaa regressiotarkistuksen kaikkiin käyttäjiin.','',
 '| # | Resepti-ID | Luokka | Piste | Seuraava tarkistus |','| ---: | --- | --- | ---: | --- |']
for no,rid in enumerate(top20,1):
    r=byid[rid]
    reason=r['nextAction']
    if rid not in notes and rid not in reuse: reason='; '.join(r['blockingFamilies'])+'. '+reason
    lines.append(f'| {no} | `{rid}` | {r["primaryClass"]} | {r["priority"]["score"]} | {reason} |')
lines += ['',
 'A/B-ehdokkaiden valmistuminen yhden pienen PR:n aikana arvioidaan kohtalaiseksi; C–F-ehdokkaiden matalaksi ja G/H-ehdokkaiden erittäin matalaksi. Nämä ovat suunnitteluarvioita ilman empiiristä prosenttilupausta. Tuetun ravintolaskelman ja yhden selkeän lähdepuutteen reseptit nostettiin listalle ennen monen ongelman reseptejä.','',
 '## Ensimmäinen toteutuserä: 2B6E','',
 'Viiden reseptin rajattu katselmointi:','']
lines += [f'{no}. `{rid}` — {byid[rid]["nextAction"]}' for no,rid in enumerate(first,1)]
lines += ['',
 '**Realistinen suunnitteluarvio: +1–3; varma lisäys 0; ehdollinen enimmäismäärä +5.** Yhtäkään uutta arvoa ei hyväksytty tässä ajossa. Jos koko lähde- ja määräketju ei kestä katselmointia, tulos voi olla nolla. Mallin kaavaa tai validointiehtoja ei muuteta.','',
 'Ensimmäisen reseptin nykyinen liemiosuus on 0,750 g/annos. Nykyisen virheellisen GI-sidoksen poistamista kokeiltiin vain muistissa: laskentamalli päätyi alle 2 g:n kokonaispoisjättöön 1,18705 g/annos. Sidoksen poisto edellyttää silti lähdekohtaisen hiilihydraattimäärän varmentamista. Näitä mallikokeita ei kirjoitettu reseptisyötteisiin eikä julkaistu GK-lukuina.','',
 'Kaalilaatikon `dairy-category` on eri kuin katalogin `unflavoured-dairy`; som tamin pavuissa `vegetables/cooked` eroaa katalogin `vegetable/vegetable-category`-avaimista. Avainten korjaaminen ei saa peittää lähde-/valmistusvastaavuuden puutetta. Granolan mantelien uunipaahto 160 °C / 18–22 min on nimenomainen lähdeportti. Halloumileivän hapanjuurileipä käyttää ravintosyötteessä maalaisleipäproxya; sitä ei kopioida GK:hon ilman vastaavuuden tarkistusta.','',
 'AJO 1: tarkista ensin kaikkien viiden reseptin aines- ja valmistusketju, valitse vain kelvolliset korjaukset, lukitse nykyisten 138 lasketun arvon regressiovertailu, aja käyttäjän kampanjan mukaiset laskentaerän tarkistukset, avaa yksi Draft-PR ja varmista CI täsmälleen julkaistavalla HEADilla. Ei mergeä. Ei automaattista AJO 2:ta.','',
 '## Laatuportit ja syyt lykätä muita reseptejä','',
 '- `khao-soi-vhh-konjac`: liemisidoksen poisto näyttäisi mallissa onnistuvan (poisjättö 1,983 g), mutta kookosmaidon 2,81 g/annos on sidottu riisipuuron GI 31:een. Ei lähes valmis. Sama tietue on käytössä keskeneräisissä massamanissa ja tom khassa sekä jo lasketussa `keltainen-kanacurry-vhh`-reseptissä. Viimeinen tarvitsee erillisen laatukatselmoinnin; mahdollinen −1 on raportoitava erillään uusista avauksista. AJO 0 ei muuta sen arvoa.',
 '- `intialainen-aloo-paratha`: ravintolaskelman `fineli-310-release-20` on nimeltään MAA-ARTISOKKA, vaikka aines ja vastaavuusmuistio kuvaavat perunaa. Nykyinen ravintoauditin tuettu luokka ei ole riittävä takuu. Korjaa koostumus erillisessä laskentatyössä ennen GK-ehdotusta.',
 '- `valimerellinen-tortilla-espanola-aamupalaksi`: sipulin avainpoikkeaman lisäksi vesikeitetyn perunan lähde on tarkistettava öljyssä kypsennettyä tortillaa vasten. Ei pelkkä avainkorjaus.',
 '- Vanha kahdeksan tomaattireseptin lista ei ole kahdeksan avausta: tabboulehin estot ovat bulgur ja yrtit, paellan kanaliemi, bouillabaissen sinisimpukat ja fenkoli. Gulassissa ja ropa viejassa on myös liemi; gulassissa lisäksi toleranssi. Farinatan tomaatti paistetaan uunissa, vaikka ravintotietueen lähtömuoto on raaka.',
 '- 38 sidontaestoa ei korjata vaihtamalla hashia. Jokaisessa on myös nykyisestä syötteestä tulevia esteitä; yksi täsmällinen massakorjauskin vaatii koko reseptin vertailun.',
 '- H-luokan vesi/maito/liemivaihtoehdot, tuotteet ja määrät tarvitsevat toimituksellisen ratkaisun. G-luokan usean esteen reseptejä ei priorisoida yhden yleisen ainesosalähteen perusteella.',
 '- Keitetty taateli, vesikeitetty öljytön mannapuuro, rapea tostada ja paistettu suklaa pysyvät ilman sopivaa lähdettä estettyinä. Reseptin sisältöä ei vaihdeta laskennan avaamiseksi.',
 '- Semanttinen tarkistus on rajattu havaittuihin selviin ristiriitoihin, ei kaikkien 138 aiemman arvon täydellinen lähdeauditti. AJO 7:n neljä mannasuurimoreseptiä säilyvät erillisen katselmoinnin työjonossa.','',
 'Vanhentuneet esteet: 2B6D:n baselineen verrattuna taatelipuuro-tahinin nestevaihtoehto, tahinisidos ja vanha rakenne-esto ovat poistuneet, mutta keitetyn taatelin GI-esto jää. Appelsiinimannapuuron aiemmat taateli/neste/rakenne-estot ovat korvautuneet vesikeitetyn mannan täsmällisellä NO MATCH -estolla. Ajantasaiset estolistat säilyvät; vanhoja selitteitä ei lasketa uudelleen nykyisiksi.','',
 '## Jäljitettävyys, uudelleenajo ja tarkistukset','',
 '- [Kampanjan alkuperäinen toimeksianto](glycemic-coverage-campaign-master-plan.md) säilyttää AJO 0–10:n rajat ja STOP-ehdot.',
 '- [Koneellinen inventaario](glycemic-coverage-run-0-inventory.json): 188 uniikkia keskeneräistä ID:tä, A–H summa 188; lähdetiedostojen SHA-256:t ja reseptien fingerprintit.',
 '- [Analyysityökalu](tools/glycemic-coverage-run-0-analyze.py) lukee tuoreet auditoinnit ja kirjoittaa vain erilliseen scratch-hakemistoon. Nykyinventaarioiden erimielisyys, baseline-arvon muutos tai reseptijoukon ero keskeyttää ajon.',
 '- [Pienosuuksien mallikoe](tools/glycemic-coverage-run-0-probe.mts) muuttaa vain muistissa kloonattuja syötteitä ja tallentaa estot/poisjättösummat scratchiin. Ei uusia GI-arvoja eikä kokonais-GK-ennusteita.',
 '- Paikallinen `content:sync`, `audit:nutrition -- --strict`, `audit:glycemic-load` ja `test:glycemic`: PASS (64/64). Kokonainen sivustobuild ja selaintestit eivät ole tämän suunnitteludiffin paikallisia vaatimuksia; GitHubin riskivalitsin ratkaisee CI:n lisätarkistukset.',
 '- Markdown-lint ja diff-tarkistus sekä Draft-PR:n CI varmennetaan toimituksen yhteydessä. Lopullinen HEAD ja CI-linkki ovat PR:n Checks-näkymässä ja tämän ajon loppuraportissa. ReportHubia ei muuteta.','',
 'Uudelleenajo oikean checkoutin `site/`-hakemistosta (tarkista repo_guard ja buildin kirjoituskohteet ensin):','',
 '```powershell',
 'npm run content:sync',
 'npm run audit:nutrition -- --strict',
 'npm run audit:glycemic-load',
 'python ../docs/nutrition/tools/glycemic-coverage-run-0-analyze.py .. D:/Temp/reseptit-run0-replay',
 'node --import tsx ../docs/nutrition/tools/glycemic-coverage-run-0-probe.mts .. D:/Temp/reseptit-run0-replay/probe.json',
 'npm run test:glycemic',
 '```','',
 'Valmiit JSON/Markdown-tulokset tuodaan repoon vain repo_guard `write` -operaatiolla ja olemassa olevan tiedoston nykyisellä SHA-256:lla. Älä aja tavallista `audit:glycemic-coverage`-komentoa suoraan suunnitteludiffiin: se kirjoittaa seurattuja nykyraportteja. Tässä ajossa sen sijasta verrattiin kaikki tuoreet tulosrivit, estot ja fingerprintit kumpaankin nykyinventaarioon muuttamatta niitä. Jos main muuttuu, analyysi ja valittu työjoukko on varmennettava uudelleen.','',
 '**Pysähdy tähän. AJO 1 edellyttää seuraavaa toimeksiantoa.**','']
(out/'glycemic-coverage-run-0-plan.md').write_text('\n'.join(lines),encoding='utf-8')
print(json.dumps({'summary':report['summary'],'classes':counts,'overlap':report['overlapCounts'],'shared':shared,'first':first},ensure_ascii=False,indent=2))
