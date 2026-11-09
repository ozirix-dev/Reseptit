/**
 * Advisory check: ingredients named in FI preparation instructions but absent
 * from the structured ingredient list. Findings are candidates, not verified
 * defects; no recipe, nutrition or GI/GK value is silently mutated.
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SOURCE_DIRS = [
  "reseptit/aamupalat", "reseptit/valipalat", "reseptit/alkuruoat",
  "reseptit/paaruoat", "reseptit/jalkiruoat", "reseptit/leivonnaiset",
];

/*
 * Small and explicitly defined Finnish vocabulary. Unmatched words are not
 * treated as proof that a recipe is correct. Keep aliases auditable.
 *
 * Order: canonical term, instruction matcher, ingredient matcher.
 */
const TERMS = [
  ["öljy", /öljy(?:ä|ssä|llä|n|yn)?/iu, /öljy/iu],
  ["voi", /\b(?:voita|voissa|voilla|voin)\b/iu, /\b(?:voi|voita)\b/iu],
  ["vesi", /(?:vettä|veden|veteen|vedessä|vesi)/iu, /(?:vettä|vesi)/iu],
  ["suola", /suolaa|suolalla|suolan|suola\b/iu, /suol/iu],
  ["pippuri", /pippur/iu, /pippur/iu],
  ["sokeri", /soker/iu, /soker/iu],
  ["hunaja", /hunaj/iu, /hunaj/iu],
  ["jogurtti", /jogur/iu, /jogur/iu],
  ["sitruuna", /sitruun/iu, /sitruun/iu],
  ["limetti", /limet/iu, /limet/iu],
  ["soijakastike", /soijakastik/iu, /soijakastik/iu],
  ["maito", /maitoa|maidon|maitoon|maito\b/iu, /maito|maid/iu],
  ["kerma", /\b(?:kermaa|kerman|kermaan|kermalla|kerma)\b/iu, /kerm/iu],
  ["etikka", /etikk/iu, /etikk/iu],
  ["sipuli", /sipul/iu, /(?<!valko)sipul/iu],
  ["valkosipuli", /valkosipul/iu, /valkosipul/iu],
  ["inkivääri", /inkiväär/iu, /inkiväär/iu],
  ["kaneli", /kanel/iu, /kanel/iu],
  ["juustokumina", /juustokumin/iu, /juustokumin/iu],
  ["kurkuma", /kurkum/iu, /kurkum/iu],
  ["kookosmaito", /kookosmaid/iu, /kookosmaid|kookosmait/iu],
  ["maapähkinä", /maapähkin/iu, /maapähkin/iu],
  ["tomaatti", /tomaat/iu, /tomaat/iu],
  ["kananmuna", /\b(?:munat|munaa|munan|munien|munaseos|kananmun\w*)\b/iu, /\b(?:kananmun\w*|munat|munaa)\b/iu],
  ["chili", /chili/iu, /chili/iu],
  ["korianteri", /korianter/iu, /korianter/iu],
  ["persilja", /persilj/iu, /persilj/iu],
  ["leivinjauhe", /leivinjauh/iu, /leivinjauh/iu],
  ["hiiva", /hiiv/iu, /hiiv/iu],
  ["riisi", /riis/iu, /riis/iu],
  ["paprika", /paprik/iu, /paprik/iu],
  ["sinappi", /sinapp/iu, /sinapp/iu],
  ["seesaminsiemen", /seesaminsiemen/iu, /seesaminsiemen/iu],
];

const TEMPLATE_MARKERS = [
  ["yleisohje-paaraaka-aine", /Raasta,\s*muussaa tai hienonna pääraaka-aine/iu],
  ["yleisohje-taikinan-ainekset", /Sekoita joukkoon taikinan ainekset/iu],
  ["yleisohje-ehdollinen-leipa", /Jos reseptissä on valmis leipä tai taikina/iu],
  ["yleisohje-kasvistäyte", /Pilko täytteen kasvikset ja muut suuret ainekset/iu],
];

const ACTION = /(?:lisää|ripottele|ripota|kaada|kuullota|ruskista|paista|sekoita|vatkaa|sulata|sivele|voitele|mausta|viimeistele|yhdistä|sirottele|valuta|lorauta|kuumenna|nosta|laita|annostele)/iu;
const SERVING = /(?:tarjoa|tarjoile|lisukkeeksi|lisäkkeenä|koristele|koristeeksi|kanssa)/iu;
const AMOUNT_NEAR = /(?:\d+(?:[,.]\d+)?\s*(?:g|kg|ml|dl|l|tl|rkl|kpl)\b|ripaus|tilkka)\s*(?:[\p{L}-]+\s+){0,3}$/iu;
const OPTIONAL = /(?:halutessasi|valinnaisesti|voit halutessasi|ei kuulu|ilman|älä lisää|ei lisätä|vaihtoehtoisesti)/iu;
const HEADINGS = /^(?:Valmistus)$/iu;

export function preparationSection(markdown) {
  const header = /^##\s+([^\n]+)\s*$/gm;
  for (const match of markdown.matchAll(header)) {
    if (!HEADINGS.test(match[1].trim())) continue;
    const start = match.index + match[0].length;
    const next = markdown.slice(start).search(/^##\s+/m);
    return markdown.slice(start, next < 0 ? undefined : start + next).trim();
  }
  return "";
}

function classifyReference(line, index) {
  // Examine the current clause only: a previous sentence's "paista" must not
  // reclassify "Tarjoa jogurtin kanssa" as an added cooking ingredient.
  const prefix = line.slice(0, index);
  const clauseStart = Math.max(prefix.lastIndexOf("."), prefix.lastIndexOf("!"),
    prefix.lastIndexOf("?"), prefix.lastIndexOf(";"));
  const before = prefix.slice(clauseStart + 1).slice(-115);
  const optional = OPTIONAL.test(line);
  if (optional) return "valinnainen-maininta";
  if (SERVING.test(before) && !AMOUNT_NEAR.test(before)) return "luettelosta-puuttuva-tarjoilu";
  if (AMOUNT_NEAR.test(before) || ACTION.test(before)) return "luettelosta-puuttuva-lisäys";
  if (SERVING.test(line)) return "luettelosta-puuttuva-tarjoilu";
  return "maininta-ilman-luetteloa";
}

export function inspectRecipe(source, filename = "fixture.md") {
  const frontmatter = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!frontmatter) {
    // Legacy title-only placeholders are not malformed published recipes.
    const titleOnly = /^\uFEFF?\s*#\s+[^\r\n]+\s*$/u.test(source.trim());
    if (titleOnly) return { path: filename, status: "stub", skipped: true, stub: true, findings: [] };
    return { path: filename, error: "YAML-frontmatter puuttuu" };
  }
  let data;
  try {
    data = parseYaml(frontmatter[1]);
  } catch (error) {
    return { path: filename, error: "YAML ei jäsenny: " + String(error) };
  }
  if (!data || typeof data !== "object") return { path: filename, error: "YAML ei ole objekti" };
  const status = String(data.status ?? "");
  const language = String(data.language ?? "");
  if (language !== "fi" || status !== "published") {
    return { path: filename, recipe_id: data.recipe_id, status, language, skipped: true, findings: [] };
  }
  const instructions = preparationSection(source.slice(frontmatter[0].length));
  if (!instructions) return {
    path: filename, recipe_id: data.recipe_id, status, language,
    error: "Julkaistusta reseptistä puuttuu Valmistus-osio",
  };
  if (!Array.isArray(data.ingredients)) return {
    path: filename, recipe_id: data.recipe_id, status, language,
    error: "Ainesosaluettelo ei ole rakenteinen taulukko",
  };

  const ingredients = data.ingredients.map((row) => typeof row?.item === "string" ? row.item.trim() : "").filter(Boolean);
  const lines = instructions.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const findings = [];
  for (const [term, stepPattern, ingredientPattern] of TERMS) {
    if (ingredients.some((item) => ingredientPattern.test(item))) continue;
    const candidates = lines.filter((line) => stepPattern.test(line));
    if (!candidates.length) continue;
    // Cooking water is not automatically an ingredient. Count only water
    // explicitly added to a preparation, not water used for boiling or rinsing.
    if (term === "vesi") {
      const specific = candidates.find((line) =>
        /(?:lisää|sekoita|kaada|mittaa|yhdistä)[^.!?\n]{0,85}(?:vettä|veden|veteen|vesi)/iu.test(line));
      if (!specific) continue;
    }
    const options = candidates.map((line) => {
      const match = stepPattern.exec(line);
      return { line, kind: classifyReference(line, match?.index ?? 0) };
    });
    const order = ["luettelosta-puuttuva-lisäys", "luettelosta-puuttuva-tarjoilu", "maininta-ilman-luetteloa", "valinnainen-maininta"];
    options.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
    const choice = options[0];
    findings.push({ type: choice.kind, term, excerpt: choice.line.slice(0, 240) });
  }
  for (const [marker, regex] of TEMPLATE_MARKERS) {
    const line = lines.find((row) => regex.test(row));
    if (line) findings.push({ type: "yleisohjepohja", term: marker, excerpt: line.slice(0, 240) });
  }
  return {
    path: filename, recipe_id: String(data.recipe_id ?? ""), title: String(data.title ?? ""),
    status, language, category: String(data.category ?? ""), ingredients_count: ingredients.length,
    steps_count: lines.filter((line) => /^\d+[.)]\s+/.test(line)).length, findings,
  };
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  }));
  return nested.flat().sort();
}

export async function auditRecipes(root = ROOT) {
  const files = (await Promise.all(SOURCE_DIRS.map((dir) => filesIn(path.join(root, dir))))).flat().sort();
  const records = await Promise.all(files.map(async (file) => {
    const data = await readFile(file, "utf8");
    return inspectRecipe(data, path.relative(root, file).replaceAll("\\", "/"));
  }));
  const published = records.filter((r) => r.status === "published" && r.language === "fi" && !r.error);
  const flagged = published.filter((r) => r.findings.length > 0);
  const kinds = [...new Set(flagged.flatMap((r) => r.findings.map((f) => f.type)))].sort();
  const summary = {
    scanned_files: records.length,
    published_fi: published.length,
    unpublished_or_other: records.filter((r) => r.skipped && !r.stub).length,
    title_only_stubs: records.filter((r) => r.stub).length,
    parse_errors: records.filter((r) => r.error).length,
    flagged_recipes: flagged.length,
    unlisted_addition_recipes: flagged.filter((r) => r.findings.some((f) => f.type === "luettelosta-puuttuva-lisäys")).length,
    unlisted_serving_recipes: flagged.filter((r) => r.findings.some((f) => f.type === "luettelosta-puuttuva-tarjoilu")).length,
    boilerplate_recipes: flagged.filter((r) => r.findings.some((f) => f.type === "yleisohjepohja")).length,
    findings_by_type: Object.fromEntries(kinds.map((kind) => [
      kind, flagged.reduce((n, r) => n + r.findings.filter((f) => f.type === kind).length, 0),
    ])),
  };
  const priority = (r) => r.findings.some((f) => f.type === "yleisohjepohja") ? 0 :
    r.findings.some((f) => f.type === "luettelosta-puuttuva-lisäys") ? 1 : 2;
  return {
    schema_version: 1,
    caveat: "Heuristinen FI-lähdereseptien auditointi. Osumat ovat tarkistettavia ehdokkaita, eivät todettuja virheitä.",
    summary,
    errors: records.filter((r) => r.error),
    findings: flagged.sort((a, b) => priority(a) - priority(b) || a.path.localeCompare(b.path, "fi")),
  };
}

export function markdownReport(audit, maximumRows = 60) {
  const s = audit.summary;
  const out = [
    "# Reseptien ainesosaluettelon ja valmistusohjeen ristiriidat",
    "",
    "Tämä on **automaattinen ehdokasraportti**, ei ihmisvarmennettujen virheiden määrä. Auditointi kattaa julkaistut suomenkieliset lähdereseptit. Käännökset ja raakileet eivät kuulu näihin lukuihin.",
    "",
    "| Mittari | Määrä |",
    "| --- | ---: |",
    "| Läpikäytyjä lähdereseptitiedostoja | " + s.scanned_files + " |",
    "| Julkaistuja FI-reseptejä | " + s.published_fi + " |",
    "| Vähintään yksi epäilyttävä ristiriita | " + s.flagged_recipes + " |",
    "| Valmistusohjeessa lisäys, jota ei löydy ainesosaluettelosta | " + s.unlisted_addition_recipes + " |",
    "| Puuttuva tarjoilulisuke tai viimeistely | " + s.unlisted_serving_recipes + " |",
    "| Epäilyttävä yleisohjepohja | " + s.boilerplate_recipes + " |",
    "| Pelkän otsikon sisältävät vanhat julkaisemattomat aihiot | " + s.title_only_stubs + " |",
    "| Jäsentämisvirheitä (ei lasketa mukaan julkaistuihin) | " + s.parse_errors + " |",
    "",
    "Luokat voivat mennä päällekkäin. Ainesosien taivutus, synonyymit, vapaaehtoiset lisukkeet ja keitinvesi voivat aiheuttaa sekä vääriä osumia että ohituksia. Ravintoarvoja tai GI/GK-sidoksia **ei saa muuttaa automaattisesti**.",
    "",
    "## Havaintojen määrät tyypeittäin",
    "",
    ...Object.entries(s.findings_by_type).map(([kind, count]) => "- " + kind + ": " + count),
    "",
    "## Ensimmäiset tarkistettavat reseptit",
    "",
    "| Resepti | Löydökset |",
    "| --- | --- |",
    ...audit.findings.slice(0, maximumRows).map((r) => {
      const ref = "[ " + r.recipe_id + " ](https://github.com/ozirix-dev/Reseptit/blob/main/" + r.path + ")";
      const descriptions = r.findings.map((f) => f.type + ": " + f.term).join("; ");
      return "| " + ref + " | " + descriptions.replaceAll("|", "&#124;") + " |";
    }),
    "",
    "Koko aineisto, esimerkkilauseet ja luokkien päällekkäisyydet löytyvät JSON-raportista. Merkitykselliset muutokset vaativat reseptin, käännösten ja ravintolaskelman yhteistarkistuksen.",
    "",
  ];
  return out.join("\n");
}

async function main() {
  const audit = await auditRecipes();
  console.log("INGREDIENT_AUDIT_SUMMARY " + JSON.stringify(audit.summary));
  if (audit.errors.length) console.log("INGREDIENT_AUDIT_UNREADABLE " + JSON.stringify(audit.errors));
  if (audit.summary.title_only_stubs) console.log("INGREDIENT_AUDIT_STUBS " + audit.summary.title_only_stubs);
  const outArg = process.argv.find((arg) => arg.startsWith("--out="));
  if (outArg) {
    const prefix = path.resolve(process.cwd(), outArg.slice(6));
    await mkdir(path.dirname(prefix), { recursive: true });
    await writeFile(prefix + ".json", JSON.stringify(audit, null, 2) + "\n", "utf8");
    await writeFile(prefix + ".md", markdownReport(audit), "utf8");
    console.log("Audit report: " + prefix + ".md");
  }
  // Legacy files can be irregular; report them without breaking unrelated PRs.
  // --strict is available for a future, separately approved CI gate.
  if (audit.errors.length && process.argv.includes("--strict")) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
