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

test('groups FI difficulty labels without regard to capitalization', () => {
  const difficulties = ['helppo', 'Helppo', 'keskitaso', 'Keskitaso', 'vaativa', ''];
  const sources = difficulties.map((difficulty, index) => ({
    path: `reseptit/aamupalat/difficulty-${index}.md`,
    content: recipe(`difficulty-${index}`, 'Kuvaus.', 'Sekoita.')
      .replace('difficulty: helppo', difficulty ? `difficulty: ${difficulty}` : ''),
  }));
  const report = analyze(sources);

  assert.deepEqual(report.byDifficulty, {helppo: 2, keskitaso: 2, vaativa: 1, '(puuttuu)': 1});
});

test('distinguishes decimal quantities from whole numbers in repeated steps', () => {
  for (const decimal of ['1,5', '1.5']) {
    const sources = [['a', decimal], ['b', '15'], ['c', decimal]].map(([id, quantity]) => ({
      path: `reseptit/aamupalat/${id}.md`,
      content: recipe(id, 'Kuvaus.', `Mittaa ${quantity} dl vettä kattilaan ja kuumenna sekoittaen, kunnes seos alkaa kiehua.`),
    }));

    const { repeatedSteps } = analyze(sources).signals;
    assert.equal(repeatedSteps.length, 1);
    assert.ok(repeatedSteps[0].phrase.includes(decimal));
    assert.deepEqual(repeatedSteps[0].recipes.map(item => item.recipeId), ['a', 'c']);
  }
});

test('distinguishes time ranges from whole numbers in repeated steps', () => {
  const sources = [['a', '5–7'], ['b', '57'], ['c', '5-7']].map(([id, duration]) => ({
    path: `reseptit/aamupalat/${id}.md`,
    content: recipe(id, 'Kuvaus.', `Paista uunin keskitasolla ${duration} minuuttia, kunnes reunat ovat saaneet hieman väriä.`),
  }));

  const { repeatedSteps } = analyze(sources).signals;
  assert.equal(repeatedSteps.length, 1);
  assert.match(repeatedSteps[0].phrase, /5–7 minuuttia/);
  assert.deepEqual(repeatedSteps[0].recipes.map(item => item.recipeId), ['a', 'c']);
});

test('distinguishes negative temperatures from positive temperatures in repeated steps', () => {
  const sources = [['a', '-18'], ['b', '18'], ['c', '−18']].map(([id, temperature]) => ({
    path: 'reseptit/aamupalat/' + id + '.md',
    content: recipe(id, 'Kuvaus.', 'Säilytä pakastimessa ' + temperature
      + ' °C:ssa ja noudata aina pakkauksen säilytys- ja sulatusohjeita.'),
  }));

  const { repeatedSteps } = analyze(sources).signals;
  assert.equal(repeatedSteps.length, 1);
  assert.match(repeatedSteps[0].phrase, /−18 °c/);
  assert.deepEqual(repeatedSteps[0].recipes.map(item => item.recipeId), ['a', 'c']);
});

test('compares every line of a wrapped preparation step', () => {
  const shared = 'Sekoita taikinaa rauhallisesti kulhossa, kunnes rakenne on kauttaaltaan tasainen.';
  const mushroom = 'Lisää pilkotut sienet ja sekoita kertaalleen.';
  const sources = [
    ['a', mushroom],
    ['b', 'Lisää valutetut pavut ja sekoita kertaalleen.'],
    ['c', mushroom],
  ].map(([id, continuation]) => ({
    path: `reseptit/aamupalat/${id}.md`,
    content: recipe(id, 'Kuvaus.', shared + '\n   ' + continuation),
  }));

  const {repeatedSteps} = analyze(sources).signals;
  assert.equal(repeatedSteps.length, 1);
  assert.match(repeatedSteps[0].phrase, /lisää pilkotut sienet/);
  assert.deepEqual(repeatedSteps[0].recipes.map(item => item.recipeId), ['a', 'c']);
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

test('accepts trailing horizontal whitespace on frontmatter delimiters', () => {
  const withPaddedDelimiters = id => recipe(id, 'Kuvaus.', 'Sekoita.')
    .replace(/^---$/gm, '--- \t');
  const sources = [
    { path: 'reseptit/aamupalat/lf.md', content: withPaddedDelimiters('lf') },
    { path: 'reseptit/aamupalat/crlf.md', content: withPaddedDelimiters('crlf').replaceAll('\n', '\r\n') },
    { path: 'reseptit/aamupalat/not-a-delimiter.md', content: recipe('invalid', 'Kuvaus.', 'Sekoita.')
      .replace(/\n---\n/, '\n--- text\n') },
  ];
  const report = analyze(sources);

  assert.deepEqual(report.indexedRecipes.map(item => item.recipeId), ['crlf', 'lf']);
  assert.equal(report.counts.skipped, 1);
  assert.equal(report.signals.missingPreparation.length, 0);
});

test('includes published FI recipes with YAML comments in their metadata', () => {
  const cases = [
    ['plain', 'published # ready for the index', 'fi # original'],
    ['quoted', "'published' # ready", '"fi" # original'],
    ['draft', 'draft # not ready', 'fi # original'],
    ['translation', 'published # ready', 'en # translation'],
    ['literal-hash', '"published # literal text"', 'fi'],
    ['no-separator', 'published#literal', 'fi'],
  ];
  const report = analyze(cases.map(([id, status, language]) => ({
    path: `reseptit/aamupalat/${id}.md`,
    content: recipe(id, 'Kuvaus.', 'Sekoita.')
      .replace(`title: ${id}`, 'title: "Kuvaus #1" # audit note')
      .replace('status: published', `status: ${status}`)
      .replace('language: fi', `language: ${language}`),
  })));

  assert.deepEqual(report.indexedRecipes.map(item => [item.recipeId, item.title]),
    [['plain', 'Kuvaus #1'], ['quoted', 'Kuvaus #1']]);
  assert.equal(report.counts.skipped, 4);
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

test('classifies YAML comments on total time without accepting malformed values', () => {
  const cases = [
    ['number', '30 # arvio'],
    ['null', 'null # ei mitattu'],
    ['tilde', '~ # ei mitattu'],
    ['comment-only', '# ei mitattu'],
    ['no-separator', '30#arvio'],
    ['quoted-hash', '"30 # arvio"'],
  ];
  const report = analyze(cases.map(([id, time]) => ({
    path: `reseptit/aamupalat/${id}.md`,
    content: recipe(id, 'Kuvaus.', 'Sekoita.').replace('time_total_min: 30', `time_total_min: ${time}`),
  })));

  assert.deepEqual(report.byTime, {'30': 1, '(puuttuu)': 3, '(virheellinen)': 2});
  assert.deepEqual(report.signals.invalidTime.map(item => item.rawValue), ['30#arvio', '"30 # arvio"']);
});

test('reports quoted YAML scalars as invalid total times', () => {
  const values = ['"30"', "'30' # arvio", '"null"', "'~'", '""'];
  const report = analyze(values.map((time, index) => ({
    path: `reseptit/aamupalat/quoted-${index}.md`,
    content: recipe(`quoted-${index}`, 'Kuvaus.', 'Sekoita.').replace('time_total_min: 30', `time_total_min: ${time}`),
  })));

  assert.deepEqual(report.byTime, {'(virheellinen)': values.length});
  assert.deepEqual(report.signals.invalidTime.map(item => item.rawValue), values);
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
  const prose = original.replace('1. Sekoita.\n2. Tarjoa lämpimänä.', 'Sekoita ainekset. Tarjoa lämpimänä.');
  const bullets = recipe('bullets', intro, 'Sekoita.')
    .replace('1. Sekoita.\n2. Tarjoa lämpimänä.', '- Sekoita.\n- Tarjoa lämpimänä.');
  const empty = recipe('empty', intro, 'Sekoita.')
    .replace('1. Sekoita.\n2. Tarjoa lämpimänä.', '');
  const missing = recipe('no-section', intro, 'Sekoita.')
    .replace('## Valmistus\n\n1. Sekoita.\n2. Tarjoa lämpimänä.', '');
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
  assert.deepEqual(report.signals.emptyPreparation.map(x => x.recipeId), ['empty', 'no-section']);
  assert.deepEqual(inputs.map(x => x.content), untouched);
});

test('quarantine excludes unnumbered FI method advisory signals', () => {
  const content = recipe('hidden', 'Kuvaus.', 'Sekoita.')
    .replace('1. Sekoita.\n2. Tarjoa lämpimänä.', '- Sekoita.');
  const report = analyze(
    [{ path: 'reseptit/aamupalat/hidden.md', content }],
    new Set(['hidden']),
  );
  assert.equal(report.counts.excludedQuarantine, 1);
  assert.deepEqual(report.signals.unnumberedPreparation, []);
  assert.deepEqual(report.signals.missingPreparation, []);
  assert.deepEqual(report.signals.emptyPreparation, []);
});

test('empty preparation and unnumbered preparation partition the missing numbered steps', () => {
  const inputs = [
    {path: 'reseptit/aamupalat/empty.md', content: recipe('empty', 'Kuvaus.', 'Sekoita.')
      .replace('1. Sekoita.\n2. Tarjoa lämpimänä.', '')},
    {path: 'reseptit/aamupalat/bullets.md', content: recipe('bullets', 'Kuvaus.', 'Sekoita.')
      .replace('1. Sekoita.\n2. Tarjoa lämpimänä.', '- Sekoita.')},
    {path: 'reseptit/aamupalat/numbered.md', content: recipe('numbered', 'Kuvaus.', 'Sekoita.')},
  ];
  const report = analyze(inputs);
  const missing = report.signals.missingPreparation.map(item => item.recipeId).sort();
  const partition = [...report.signals.emptyPreparation, ...report.signals.unnumberedPreparation]
    .map(item => item.recipeId).sort();
  assert.deepEqual(missing, ['bullets', 'empty']);
  assert.deepEqual(partition, missing);
  assert.deepEqual(report.signals.emptyPreparation.map(item => item.recipeId), ['empty']);
  assert.deepEqual(report.signals.unnumberedPreparation.map(item => item.recipeId), ['bullets']);
});
