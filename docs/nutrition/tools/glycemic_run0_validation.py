"""Strict read-only checks for the run 0.6 planning snapshot."""
PRODUCTION_COMMIT = 'f7a43503c8dde25c6c2281885807c3e7ed31f07e'
ORIGINAL_RUN_COMMIT = '651ea1a0a59a22409e2ace29efc3ed67533b204a'
WITHDRAWN = 'keltainen-kanacurry-vhh'
REFERENCE_ONLY = 'coconut-milk-porridge-gi-31'


def unique_by(rows, key, label):
    result = {row[key]: row for row in rows}
    assert len(result) == len(rows), f'Duplicate identifiers in {label}'
    assert all(result), f'Empty identifier in {label}'
    return result


def verify_regression(baseline, pilot, review, catalog):
    """Permit only the source-backed PR #124 withdrawal; fail on all other changes."""
    current = unique_by(pilot['results'], 'recipeId', 'fresh GL audit')
    historical = unique_by(baseline['recipes'], 'recipeId', 'historical baseline')
    before = unique_by(review['previouslyCalculated'], 'recipeId', 'PR #124 prior values')
    affected = unique_by(review['affectedRecipes'], 'recipeId', 'PR #124 reviewed effects')
    records = unique_by(catalog['records'], 'id', 'GI catalog')
    inputs = unique_by(pilot['calculationInputs'], 'recipeId', 'effective inputs')
    assert set(inputs) == set(current), 'Input/result recipe sets differ'
    assert set(historical) <= set(current), 'Historical recipe disappeared'
    assert records[REFERENCE_ONLY].get('calculationUse') == 'REFERENCE_ONLY', 'Reference-only restriction lost'
    assert records[REFERENCE_ONLY]['foodKey'] != 'coconut-milk', 'Invalid coconut food family restored'
    assert not any(i.get('giRecordId') == REFERENCE_ONLY for r in inputs.values() for i in r['ingredients']), 'Rejected coconut binding restored'
    evidence = affected[WITHDRAWN]
    assert historical[WITHDRAWN]['status'] == evidence['before']['status'] == 'CALCULATED'
    assert historical[WITHDRAWN]['glycemicLoadPerServing'] == evidence['before']['glycemicLoadPerServing'] == before[WITHDRAWN]['glycemicLoadPerServing']
    assert evidence['after']['status'] == 'INSUFFICIENT SOURCE DATA' and evidence['after']['glycemicLoadPerServing'] is None
    assert any('PMID 22849311' in b for b in evidence['after']['blockers']), 'Withdrawal lacks source-specific evidence'
    assert current[WITHDRAWN] == evidence['after'], 'Withdrawal differs from reviewed PR #124 evidence'
    for rid, prior in historical.items():
        if prior['status'] != 'CALCULATED' or rid == WITHDRAWN:
            continue
        assert current[rid]['status'] == 'CALCULATED', f'Unexpected historical withdrawal: {rid}'
        assert current[rid]['glycemicLoadPerServing'] == prior['glycemicLoadPerServing'], f'Historical GK changed: {rid}'
    for rid, prior in before.items():
        if rid == WITHDRAWN:
            continue
        assert current[rid]['status'] == 'CALCULATED', f'Unexpected published withdrawal: {rid}'
        for field in ('glycemicLoadPerServing', 'unroundedGlycemicLoadPerServing', 'glycemicLoadRangePerServing'):
            assert current[rid][field] == prior[field], f'Published GK changed: {rid}/{field}'
    calculated = {rid for rid, r in current.items() if r['status'] == 'CALCULATED'}
    assert calculated == set(before) - {WITHDRAWN}, 'Unexpected calculated recipe set'
    for rid, value in {'kiinalainen-hirssipuuro-taateleilla': 21.19, 'pohjoisafrikkalainen-kuskus-aamiaiskulho': 34.36}.items():
        assert current[rid]['status'] == 'CALCULATED' and current[rid]['glycemicLoadPerServing'] == value, f'2B6D addition changed: {rid}'
    for rid, effect in affected.items():
        assert current[rid] == effect['after'], f'PR #124 published result changed: {rid}'
    assert pilot['summary'] == {'recipes': len(current), 'calculated': len(calculated), 'insufficientSourceData': len(current)-len(calculated)}, 'Audit summary disagrees with rows'
    return {
        'approvedWithdrawal': {'recipeId': WITHDRAWN, 'previousGlycemicLoad': before[WITHDRAWN]['glycemicLoadPerServing'], 'currentGlycemicLoad': None, 'sourcePullRequest': 'https://github.com/ozirix-dev/Reseptit/pull/124', 'evidenceFile': 'docs/nutrition/glycemic-coconut-source-review.json', 'reason': 'PMID 22849311 measures a mixed rice porridge, not standalone coconut milk'},
        'historicalCalculatedCount': sum(r['status']=='CALCULATED' for r in historical.values()),
        'historicalValuesPreservedExceptDocumentedWithdrawal': True,
        'previouslyPublishedValuesPreserved': len(calculated),
        'twoBatch2B6DAdditionsPreserved': True,
        'unexpectedWithdrawals': [], 'unexpectedValueChanges': [],
    }
