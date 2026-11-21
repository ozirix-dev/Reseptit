/**
 * Issue #327: read-only inventory of FI source text marked published.
 * Reports heuristic review candidates; never changes recipes or release gates.
 * Run from anywhere: node site/scripts/editorial-inventory.mjs
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATEGORIES = ['aamupalat', 'alkuruoat', 'jalkiruoat', 'leivonnaiset', 'paaruoat', 'valipalat'];
const GENERIC = /t(?:ä|a)ss(?:ä|a) kotikeitti(?:ö|o)(?:ö|o)n sovitetussa/i;

function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  return match ? { yaml: match[1], body: text.slice(match[0].length) } : null;
}

function value(yaml, name) {
  const line = yaml.split(/\r?\n/).find((part) => part.startsWith(`${name}:`));
  const raw = line?.slice(name.length + 1).trim() ?? '';
  return raw.replace(/^['"]|['"]$/g, '');
}

function section(body, title) {
  const heading = new RegExp(`^##\\s+${title}\\s*$`, 'im').exec(body);
  if (!heading) return '';
  const remaining = body.slice(heading.index + heading[0].length);
  const next = /^##\s+/m.exec(remaining);
  return (next ? remaining.slice(0, next.index) : remaining).trim();
}

function clean(text) {
  return text.replace(/\r/g, '').replace(/\s+/g, ' ').trim();
}
function canonical(text) {
  return clean(text.normalize('NFKC').toLocaleLowerCase('fi'))
    .replace(/[.,!?;:“”"'()\-–—]/g, '').replace(/\s+/g, ' ').trim();
}
function sha(text) {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}
function add(map, key, record) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(record);
}
function ranked(map, minimum = 2) {
  return [...map].map(([phrase, values]) => ({ phrase, recipes: [...new Map(values.map((x) => [x.path, x])).values()] }))
    .filter(({ recipes }) => recipes.length >= minimum)
    .map(({ phrase, recipes }) => ({ phrase, recipes: recipes.sort((a, b) => a.path.localeCompare(b.path, 'fi')) }))
    .sort((a, b) => b.recipes.length - a.recipes.length || a.phrase.localeCompare(b.phrase, 'fi'));
}

export function analyze(sources, quarantine = new Set()) {
  const counts = { files: sources.length, published: 0, excludedQuarantine: 0, reviewed: 0, skipped: 0 };
  const byCategory = {};
  const byTime = {};
  const byDifficulty = {};
  const genericLead = [], duplicateDescription = [], missingPreparation = [], missingTime = [], invalidTime = [], noExplicitUrl = [];
  const leadMap = new Map(), stepMap = new Map(), idMap = new Map();
  const indexedRecipes = [];
  const sorted = [...sources].sort((a, b) => a.path.localeCompare(b.path, 'fi'));
  for (const source of sorted) {
    const parsed = frontmatter(source.content);
    if (!parsed || value(parsed.yaml, 'status') !== 'published' || value(parsed.yaml, 'language') !== 'fi') {
      counts.skipped++;
      continue;
    }
    counts.published++;
    const recipeId = value(parsed.yaml, 'recipe_id');
    if (quarantine.has(recipeId)) { counts.excludedQuarantine++; continue; }
    counts.reviewed++;
    const category = source.path.split('/')[1];
    const timeRaw = value(parsed.yaml, 'time_total_min');
    const parsedTime = /^\\d+$/.test(timeRaw) ? Number(timeRaw) : null;
    const validTime = parsedTime !== null && Number.isSafeInteger(parsedTime) && parsedTime > 0;
    const missingTimeValue = timeRaw === '' || timeRaw.toLowerCase() === 'null';
    const time = validTime ? parsedTime : null;
    const difficulty = value(parsed.yaml, 'difficulty') || '(puuttuu)';
    const title = value(parsed.yaml, 'title');
    const evidence = { recipeId, title, path: source.path, sourceSha256: sha(source.content) };
    indexedRecipes.push(evidence);
    add(idMap, recipeId, evidence);
    byCategory[category] = (byCategory[category] || 0) + 1;
    const timeBucket = validTime ? String(time) : missingTimeValue ? '(puuttuu)' : '(virheellinen)';
    byTime[timeBucket] = (byTime[timeBucket] || 0) + 1;
    byDifficulty[difficulty] = (byDifficulty[difficulty] || 0) + 1;

    const heading = /^#\s+.+$/m.exec(parsed.body);
    const afterTitle = heading ? parsed.body.slice(heading.index + heading[0].length) : '';
    const nextSection = /^##\s+/m.exec(afterTitle);
    const lead = clean(nextSection ? afterTitle.slice(0, nextSection.index) : afterTitle);
    const description = clean(section(parsed.body, 'Kuvaus'));
    // Many older FI recipes place their entire introduction under ## Kuvaus.
    // Use one visible introduction for frequency signals, but detect a
    // duplicate only when two separate fields are actually present.
    const primaryLead = lead || description;
    if (primaryLead) add(leadMap, canonical(primaryLead), evidence);
    if (primaryLead && GENERIC.test(primaryLead)) genericLead.push(evidence);
    if (lead && description && canonical(lead) === canonical(description)) duplicateDescription.push(evidence);

    const preparation = section(parsed.body, 'Valmistus');
    const steps = preparation.split(/\r?\n/).map((line) => /^\s*\d+[.)]\s+(.+)/.exec(line)?.[1]).filter(Boolean);
    if (steps.length === 0) missingPreparation.push(evidence);
    for (const step of steps) {
      const phrase = canonical(step);
      // Short, common actions such as "Tarjoile heti" are not useful matches.
      if (phrase.length >= 65) add(stepMap, phrase, evidence);
    }
    if (time === null) missingTime.push(evidence);
    if (!validTime && !missingTimeValue) invalidTime.push({ ...evidence, rawValue: timeRaw });
    if (!/https?:\/\//i.test(source.content) && !/^source(?:_url)?:\s*\S+/mi.test(parsed.yaml)) noExplicitUrl.push(evidence);
  }
  return {
    notice: 'Read-only heuristics on non-quarantined FI sources marked published; not verified live routes, factual errors, cooking tests or release approval.',
    indexedRecipes, counts, byCategory, byTime, byDifficulty,
    signals: { genericLead, duplicateDescription, missingPreparation, missingTime, invalidTime, noExplicitUrl,
      repeatedLeads: ranked(leadMap), repeatedSteps: ranked(stepMap), duplicateRecipeIds: ranked(idMap) },
  };
}

async function markdownFiles(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...await markdownFiles(target));
    else if (item.isFile() && item.name.endsWith('.md')) result.push(target);
  }
  return result;
}

function markdown(report) {
  const out = ['# Recipavo #327 – FI-reseptien tekstien toimituksellinen inventaario', '',
    '**Vain heuristinen katselmointijono.** Ei resepti-, ravinto-, GK-, kieli- tai julkaisuhyväksyntä.', '',
    `Lähdemerkittyjä FI-julkaisuja: **${report.counts.published}**; karanteenissa rajattu pois **${report.counts.excludedQuarantine}**; analysoitu **${report.counts.reviewed}** / ${report.counts.files} lähdetiedostoa.`,
    '', '## Otsikkotekstien ja valmistusvaiheiden signaalit', ''];
  for (const [label, value] of [
    ['Geneerinen kotikeittiö-ingressi', report.signals.genericLead.length],
    ['Ingressi täsmälleen sama kuin Kuvaus', report.signals.duplicateDescription.length],
    ['Sama ingressi useassa eri reseptissä (ryhmiä)', report.signals.repeatedLeads.length],
    ['Pitkä sama valmistusvaihe eri resepteissä (ryhmiä)', report.signals.repeatedSteps.length],
    ['Numeroitu Valmistus puuttuu tai ei tunnistu', report.signals.missingPreparation.length],
    ['Kokonaisaika puuttuu tai on virheellinen', report.signals.missingTime.length],
    ['Kokonaisajan arvo on virheellinen', report.signals.invalidTime.length],
    ['Lähdetiedostossa ei suoraa URL-viitettä (ei ole virhetuomio)', report.signals.noExplicitUrl.length],
  ]) out.push(`- ${label}: **${value}**`);
  out.push('', '## Virheelliset kokonaisaikamerkinnät', '');
  if (!report.signals.invalidTime.length) out.push('Ei osumia.');
  for (const item of report.signals.invalidTime) {
    out.push('- ' + item.recipeId + ' — ' + item.path +
      ' (SHA256 ' + item.sourceSha256 + '), raakaarvo ' + JSON.stringify(item.rawValue));
  }
  out.push('', '## Tarkistettavat toistot', '');
  for (const [name, list] of [['Ingressit', report.signals.repeatedLeads], ['Valmistusvaiheet', report.signals.repeatedSteps]]) {
    out.push(`### ${name}`, '');
    if (!list.length) out.push('Ei samanmuotoisia monessa reseptissä toistuvia osumia.', '');
    for (const row of list.slice(0, 30)) {
      out.push(`- **${row.recipes.length} lähdettä:** ${row.phrase.slice(0, 180)}`);
      for (const e of row.recipes.slice(0, 10)) out.push(`  - ${e.path} (SHA256 ${e.sourceSha256})`);
      if (row.recipes.length > 10) out.push(`  - ... ja ${row.recipes.length - 10} muuta; katso JSON`);
    }
    out.push('');
  }
  out.push('## Aika- ja vaikeusjakaumat – **eivät** automaattisia laatupuutteita', '',
    '| Minuutit | Lähteitä |', '|---:|---:|');
  for (const [time, count] of Object.entries(report.byTime).sort(([a], [b]) => (Number(a) || 1e6) - (Number(b) || 1e6))) out.push(`| ${time} | ${count} |`);
  out.push('', '| Vaikeusmerkintä | Lähteitä |', '|---|---:|');
  for (const [level, count] of Object.entries(report.byDifficulty).sort(([a], [b]) => a.localeCompare(b, 'fi'))) out.push(`| ${level} | ${count} |`);
  out.push('', '## Jatkokatselmointi', '',
    '1. Tarkista ensin toistuvien pitkien valmistusvaiheiden merkitys, annostus ja turvallisuus *alkuperäisiä reseptejä vasten*.',
    '2. Käy geneeriset/duplikoituneet ingressit läpi ja lisää ruokalajikohtaista olennaista tietoa vain lähteiden tukemana.',
    '3. Älä päättele virhettä yleisestä ajasta, vaikeusluokasta tai puuttuvasta URL:sta; lisänäyttö voi olla reseptin erillisessä katselmointirekisterissä.',
    '4. Tee myöhemmät reseptikorjaukset erillisissä, SHAn lukitsevissa katselmoidussa PR:issä; älä muuta historiallisia ravinto-/GK-sinettejä.', '');
  return out.join('\n');
}

async function main() {
  if (process.argv.includes('--help')) {
    process.stdout.write('Usage: node site/scripts/editorial-inventory.mjs [--help]\nOutputs: tmp/editorial-inventory/current.json and current.md\n');
    return;
  }
  if (process.argv.length > 2) throw new Error('Unknown arguments; use --help');
  const sources = [];
  for (const category of CATEGORIES) {
    const dirname = path.join(ROOT, 'reseptit', category);
    for (const filename of await markdownFiles(dirname)) {
      sources.push({ path: path.relative(ROOT, filename).split(path.sep).join('/'), content: await readFile(filename, 'utf8') });
    }
  }
  const quarantine = new Set(JSON.parse(await readFile(path.join(ROOT, 'site/scripts/public-recipe-quarantine.json'), 'utf8')));
  const report = analyze(sources, quarantine);
  const target = path.join(ROOT, 'tmp/editorial-inventory');
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, 'current.json'), JSON.stringify(report, null, 2) + '\n');
  await writeFile(path.join(target, 'current.md'), markdown(report) + '\n');
  console.log(JSON.stringify({ ...report.counts, genericLead: report.signals.genericLead.length,
    duplicateDescription: report.signals.duplicateDescription.length,
    repeatedLeads: report.signals.repeatedLeads.length,
    repeatedSteps: report.signals.repeatedSteps.length,
    output: 'tmp/editorial-inventory/' }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
