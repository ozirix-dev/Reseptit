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
    ['absent', 'time_total_min: 30\\n', ''],
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
