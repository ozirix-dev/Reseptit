import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyze } from './editorial-inventory.mjs';

function recipe(id, intro, step, overrides = '') {
  return `---
title: ${id}
recipe_id: ${id}
status: published
language: fi
time_total_min: 30
difficulty: helppo
${overrides}---
# ${id}

${intro}

## Kuvaus

${intro}

## Valmistus

1. ${step}
2. Tarjoa lämpimänä.
`;
}

const duplicateStep = 'Laita kaikki raaka-aineet kattilaan ja kuumenna sekoittaen, kunnes kastike on tasainen ja kiehuu kevyesti.';

test('reports repeated lead and long instructions without changing source texts', () => {
  const rawA = recipe('a', 'Tässä kotikeittiöön sovitetussa reseptissä on yksi ohje.', duplicateStep);
  const rawB = recipe('b', 'Tässä kotikeittiöön sovitetussa reseptissä on yksi ohje.', duplicateStep);
  const inputs = [
    { path: 'reseptit/aamupalat/a.md', content: rawA },
    { path: 'reseptit/leivonnaiset/b.md', content: rawB },
    { path: 'reseptit/valipalat/hidden.md', content: recipe('hidden', 'Ei mukana.', duplicateStep) },
    { path: 'reseptit/jalkiruoat/draft.md', content: recipe('draft', 'Ei mukana.', duplicateStep).replace('status: published', 'status: draft') },
  ];
  const original = inputs.map(x => x.content);
  const r = analyze(inputs, new Set(['hidden']));
  assert.deepEqual(r.counts, { files: 4, published: 3, excludedQuarantine: 1, reviewed: 2, skipped: 1 });
  assert.deepEqual(r.indexedRecipes.map(x => x.recipeId), ['a', 'b']);
  assert.equal(r.signals.genericLead.length, 2);
  assert.equal(r.signals.duplicateDescription.length, 2);
  assert.equal(r.signals.repeatedLeads.length, 1);
  assert.equal(r.signals.repeatedSteps.length, 1);
  assert.equal(r.signals.repeatedSteps[0].recipes.length, 2);
  assert.equal(r.byTime['30'], 2);
  assert.equal(r.byDifficulty.helppo, 2);
  assert.deepEqual(inputs.map(x => x.content), original);
});

test('includes intro text found only in Kuvaus, without fake duplicate', () => {
  const intro = 'Tässä kotikeittiöön sovitetussa ohjeessa valmistetaan perinteinen ateria.';
  const descriptionOnly = (id) => recipe(id, intro, duplicateStep)
    .replace(`# ${id}\n\n${intro}\n\n## Kuvaus`, `# ${id}\n\n## Kuvaus`);
  const sources = [
    { path: 'reseptit/aamupalat/aloo.md', content: descriptionOnly('aloo') },
    { path: 'reseptit/paaruoat/other.md', content: descriptionOnly('other') },
  ];
  const r = analyze(sources);
  assert.equal(r.counts.reviewed, 2);
  assert.equal(r.signals.genericLead.length, 2);
  assert.equal(r.signals.repeatedLeads.length, 1);
  assert.deepEqual(r.signals.repeatedLeads[0].recipes.map(x => x.recipeId), ['aloo', 'other']);
  assert.equal(r.signals.duplicateDescription.length, 0);
});

test('treats missing metadata as an advisory signal, not an approval or a zero', () => {
  const r = analyze([{path: 'reseptit/alkuruoat/c.md', content:
    recipe('c','Kuvaus reseptille.','Sekoita.', 'time_total_min: null\n').replace('time_total_min: 30\n','')}]);
  assert.equal(r.counts.reviewed, 1);
  assert.equal(r.signals.missingTime.length, 1);
  assert.equal(r.byTime['(puuttuu)'], 1);
  assert.equal(r.signals.repeatedSteps.length, 0);
});

test('excludes unparseable content and foreign-language recipes', () => {
  const fi = recipe('a','Kuvaus','Sekoita.');
  const r = analyze([
    {path:'reseptit/aamupalat/a.md',content:fi.replace('language: fi','language: en')},
    {path:'reseptit/aamupalat/invalid.md',content:'# Ei frontmatteria'},
  ]);
  assert.equal(r.counts.reviewed, 0);
  assert.equal(r.counts.skipped, 2);
});

test('classifies absent/null time separately from malformed, unsafe or nonpositive values', () => {
  const inputs = [
    ['absent', 'time_total_min: 30', ''],
    ['explicit-null', 'time_total_min: 30', 'time_total_min: null'],
    ['zero', 'time_total_min: 30', 'time_total_min: 0'],
    ['negative', 'time_total_min: 30', 'time_total_min: -5'],
    ['decimal', 'time_total_min: 30', 'time_total_min: 1.5'],
    ['unsafe', 'time_total_min: 30', 'time_total_min: 9007199254740992'],
    ['valid', 'time_total_min: 30', 'time_total_min: 45'],
  ].map(([id, from, to]) => ({
    path: 'reseptit/aamupalat/' + id + '.md',
    content: recipe(id, 'Yksilöllinen kuvaus.', 'Sekoita.').replace(from, to),
  }));
  const report = analyze(inputs);
  assert.equal(report.counts.reviewed, 7);
  assert.equal(report.signals.missingTime.length, 6);
  assert.equal(report.signals.invalidTime.length, 4);
  assert.deepEqual(report.signals.invalidTime.map(x => x.recipeId).sort(),
    ['decimal', 'negative', 'unsafe', 'zero']);
  assert.equal(report.byTime['(puuttuu)'], 2);
  assert.equal(report.byTime['(virheellinen)'], 4);
  assert.equal(report.byTime['45'], 1);
  assert.equal(report.signals.invalidTime.find(x => x.recipeId === 'zero').rawValue, '0');
});

test('flags duplicate total-time YAML keys, even when values agree', () => {
  const sources = [
    { path: 'reseptit/aamupalat/same.md', content:
      recipe('same', 'Kuvaus.', 'Sekoita.', 'time_total_min: 30\n') },
    { path: 'reseptit/aamupalat/different.md', content:
      recipe('different', 'Kuvaus.', 'Sekoita.', 'time_total_min: 0\n') },
    { path: 'reseptit/aamupalat/single.md', content:
      recipe('single', 'Kuvaus.', 'Sekoita.') },
  ];
  const original = sources.map(x => x.content);
  const report = analyze(sources);
  assert.equal(report.counts.reviewed, 3);
  assert.deepEqual(report.signals.duplicateTimeKeys.map(x => x.recipeId), ['different', 'same']);
  assert.equal(report.signals.missingTime.length, 2);
  assert.equal(report.signals.invalidTime.length, 2);
  assert.equal(report.byTime['(virheellinen)'], 2);
  assert.equal(report.byTime['30'], 1);
  assert.equal(report.signals.duplicateTimeKeys[0].rawValue, '30 | 0');
  assert.equal(report.signals.duplicateTimeKeys[1].rawValue, '30 | 30');
  assert.deepEqual(sources.map(x => x.content), original);
});

test('quarantined duplicate time keys are excluded from public FI review signals', () => {
  const raw = recipe('hidden', 'Kuvaus.', 'Sekoita.', 'time_total_min: 10\n');
  const report = analyze([{ path: 'reseptit/aamupalat/hidden.md', content: raw }], new Set(['hidden']));
  assert.equal(report.counts.excludedQuarantine, 1);
  assert.deepEqual(report.signals.duplicateTimeKeys, []);
  assert.deepEqual(report.signals.invalidTime, []);
});

test('distinguishes unnumbered method text from absent FI preparation', () => {
  const intro = 'Yksilöllinen ruokaohje.';
  const original = recipe('prose', intro, 'Sekoita.') ;
  const prose = original.replace('1. Sekoita.\\n2. Tarjoa lämpimänä.', 'Sekoita ainekset. Tarjoa lämpimänä.');
  const bullets = recipe('bullets', intro, 'Sekoita.')
    .replace('1. Sekoita.\\n2. Tarjoa lämpimänä.', '- Sekoita.\\n- Tarjoa lämpimänä.');
  const empty = recipe('empty', intro, 'Sekoita.')
    .replace('1. Sekoita.\\n2. Tarjoa lämpimänä.', '');
  const missing = recipe('no-section', intro, 'Sekoita.')
    .replace('## Valmistus\\n\\n1. Sekoita.\\n2. Tarjoa lämpimänä.', '');
  const inputs = [
    { path: 'reseptit/aamupalat/prose.md', content: prose },
    { path: 'reseptit/aamupalat/bullets.md', content: bullets },
    { path: 'reseptit/aamupalat/empty.md', content: empty },
    { path: 'reseptit/aamupalat/no-section.md', content: missing },
    { path: 'reseptit/aamupalat/numbered.md', content: recipe('numbered', intro, 'Sekoita.') },
  ];
  const untouched = inputs.map(x => x.content);
  const report = analyze(inputs);
  assert.equal(report.counts.reviewed, 5);
  assert.deepEqual(report.signals.missingPreparation.map(x => x.recipeId),
    ['bullets', 'empty', 'no-section', 'prose']);
  assert.deepEqual(report.signals.unnumberedPreparation.map(x => x.recipeId), ['bullets', 'prose']);
  assert.deepEqual(inputs.map(x => x.content), untouched);
});

test('quarantine excludes unnumbered FI method advisory signals', () => {
  const content = recipe('hidden', 'Kuvaus.', 'Sekoita.')
    .replace('1. Sekoita.\\n2. Tarjoa lämpimänä.', '- Sekoita.');
  const report = analyze(
    [{ path: 'reseptit/aamupalat/hidden.md', content }],
    new Set(['hidden']),
  );
  assert.equal(report.counts.excludedQuarantine, 1);
  assert.deepEqual(report.signals.unnumberedPreparation, []);
  assert.deepEqual(report.signals.missingPreparation, []);
});
