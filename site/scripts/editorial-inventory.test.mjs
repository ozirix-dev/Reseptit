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
  assert.equal(r.signals.genericLead.length, 2);
  assert.equal(r.signals.duplicateDescription.length, 2);
  assert.equal(r.signals.repeatedLeads.length, 1);
  assert.equal(r.signals.repeatedSteps.length, 1);
  assert.equal(r.signals.repeatedSteps[0].recipes.length, 2);
  assert.equal(r.byTime['30'], 2);
  assert.equal(r.byDifficulty.helppo, 2);
  assert.deepEqual(inputs.map(x => x.content), original);
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
