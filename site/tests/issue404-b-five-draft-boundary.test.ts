import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const draftDirectory = path.join(repositoryRoot, "docs/reviews/issue404-b-five-draft-recipes");

const candidates = [
  {
    original: "karibia-saltfish-fritterit",
    sourceBlob: "f197d405e1d1c9de9afcbfb2b5ce4def501de30f",
    required: [/160\s*g/, /300\s*g/, /375\s*ml/, /self-raising/i, /0,5 cm/, /63\s*°C/],
    minIngredients: 10,
  },
  {
    original: "intialainen-idli-kookoschutneylla",
    sourceBlob: "e862e239cf56f33c27ea36e6a5311bf6d179364d",
    required: [/120\s*g/, /20\s*g/, /2 kuppia/, /1\s*tl suolaa/, /74\s*°C/, /chutney/],
    minIngredients: 18,
  },
  {
    original: "intialainen-pesarattu-mungpavuista",
    sourceBlob: "5356f03ce2764e38563a95ede0e4373b8f50a65e",
    required: [/150\s*g/, /12\s*tuntia/, /30\s*minuuttia/, /Ruokavirasto/, /EFSA/, /HOLD/],
    minIngredients: 7,
  },
  {
    original: "malesialainen-kuih-seri-muka",
    sourceBlob: "4c565331c9e3a6322cd97989a9ad6fac38167284",
    required: [/300\s*g/, /170\s*g/, /pandan/i, /20\s*minuuttia/, /30\s*minuuttia/, /71\s*°C/],
    minIngredients: 12,
  },
  {
    original: "vietnamilainen-xoi-maapahkinalla",
    sourceBlob: "424b60e50e95d2e216e9090333f4f89509ee61ad",
    required: [/200\s*g/, /100\s*g/, /160\s*ml/, /20\s*g/, /COOK/, /WARM/],
    minIngredients: 5,
  },
] as const;

const sourceBlobSha = (text: string): string => {
  const normalized = text.replaceAll("\r\n", "\n");
  return createHash("sha1")
    .update("blob " + Buffer.byteLength(normalized, "utf8") + "\0")
    .update(normalized, "utf8")
    .digest("hex");
};

test("issue 404: five new candidates are schema-valid FI drafts and cannot enter public content", async () => {
  assert.equal(candidates.length, 5);
  assert.equal(new Set(candidates.map((row) => row.original)).size, 5);
  const successorRegistry = JSON.parse(
    await readFile(path.join(repositoryRoot, "meta/recipe-successors.json"), "utf8"),
  ) as Array<{ predecessor_id: string; recipe_id: string; url_slug: string }>;
  const readme = await readFile(path.join(draftDirectory, "README.md"), "utf8");

  for (const entry of candidates) {
    const proposedId = entry.original + "-punnittu-v2";
    const proposal = await readFile(path.join(draftDirectory, proposedId + ".md"), "utf8");
    const parsed = parseMarkdown(proposal);
    assert.ok(parsed, proposedId);
    const data = recipeFrontmatterSchema.parse(parsed.data);

    assert.equal(data.recipe_id, proposedId);
    assert.equal(data.url_slug, entry.original);
    assert.equal(data.language, "fi");
    assert.equal(data.category, "aamupala");
    assert.equal(data.status, "draft", proposedId);
    assert.equal(data.time_total_min, null, "Unmeasured total time cannot be asserted");
    assert.equal(data.image, undefined, "Draft has no approved image");
    assert.equal(data.translation_languages, undefined, "No invented translation approvals");
    assert.ok(data.servings > 0);
    assert.ok(data.ingredients.length >= entry.minIngredients);
    assert.ok(data.ingredients.every((ingredient) =>
      ingredient.amount === null ? Boolean(ingredient.note && ingredient.note.trim())
        : Number.isFinite(ingredient.amount) && ingredient.amount > 0),
      "Unknown source quantities need a reason, never a silent zero");
    for (const key of [
      "carbs_net_per_serving_g", "carbs_total_per_serving_g",
      "protein_per_serving_g", "fat_per_serving_g",
    ] as const) {
      assert.equal(data[key], null, proposedId + ": published macro approval is missing");
    }
    assert.match(parsed.content, /\*\*DRAFT\s*\/[^\n]*HOLD/);
    assert.match(parsed.content, /Recipavo|koekeittiö|koeversio/);
    assert.match(parsed.content, /## (?:Valmistus|Idlitaikinan valmistus)/);
    assert.match(parsed.content, /## (?:Lähde|Lähdepäätös|Lähdehaarojen päätös|Tekijä- ja turvallisuuslähteet|Turvallisuus- ja ruokalajilähteet)/);
    for (const token of entry.required) assert.match(parsed.content, token, proposedId);
    assert.ok(readme.includes(proposedId), "Missing scoped review manifest entry");

    const raw = await readFile(
      path.join(repositoryRoot, "reseptit/aamupalat", entry.original + ".md"), "utf8",
    );
    const original = parseMarkdown(raw);
    assert.ok(original);
    assert.equal(original.data.status, "published", entry.original + ": historical source must be sealed");
    assert.equal(sourceBlobSha(raw), entry.sourceBlob, entry.original + ": unreviewed original source changed");
    assert.equal(isPublicRecipeQuarantined(entry.original), true, entry.original);
    assert.equal(siteContent.recipes.some((recipe) => recipe.recipeId === entry.original), false);
    assert.equal(siteContent.recipes.some((recipe) => recipe.recipeId === proposedId), false);
    assert.equal(
      successorRegistry.some((record) => record.predecessor_id === entry.original || record.recipe_id === proposedId),
      false,
      proposedId + ": candidate must not be registered as a published successor",
    );
  }
});

test("issue 404: five proposed copies stay entirely outside public recipe and translation inputs", () => {
  for (const entry of candidates) {
    const source = path.relative(repositoryRoot,
      path.join(draftDirectory, entry.original + "-punnittu-v2.md")).replaceAll("\\", "/");
    assert.match(source, /^docs\/reviews\/issue404-b-five-draft-recipes\//);
    assert.doesNotMatch(source, /^(?:reseptit|kaannokset)\//);
  }
});


test("issue 404: critical food-safety controls remain explicit in the three high-risk drafts", async () => {
  const readDraft = (id: string) =>
    readFile(path.join(draftDirectory, id + "-punnittu-v2.md"), "utf8");
  const [idli, kuih, xoi, review] = await Promise.all([
    readDraft("intialainen-idli-kookoschutneylla"),
    readDraft("malesialainen-kuih-seri-muka"),
    readDraft("vietnamilainen-xoi-maapahkinalla"),
    readFile(path.join(draftDirectory, "README.md"), "utf8"),
  ]);

  // Idli is a spontaneously fermented, moist grain/pulse dough. A timer and
  // visible bubbles cannot substitute for process and food-safety evidence.
  assert.match(idli, /yli neljän tunnin liotus pitää tehdä enintään 4 °C:ssa/);
  assert.match(idli, /huoneenlämpöliotus enintään neljä tuntia/);
  assert.match(idli, /\*\*noin 2 %\*\*/);
  assert.match(idli, /\*\*12[–-]14 tuntia noin 30 °C:ssa\*\*/);
  assert.match(idli, /\*\*pH ≤ 4,6\*\*/);
  assert.match(idli, /\*\*74 °C vähintään 15 sekunnin ajan\*\*/);
  assert.match(idli, /bccdc\.ca\/resource-gallery\/Documents\//);
  assert.doesNotMatch(idli, /anna käydä lämpimässä noin \*\*8[–-]12 tuntia\*\*/);

  // Cooked rice and rice-with-egg custard must not sit at room temperature
  // waiting to cool. The source-backed guidance is also declared in README.
  for (const [name, draft] of [["kuih", kuih], ["xoi", xoi]] as const) {
    assert.match(draft, /\*\*mieluiten tunnin kuluessa\*\*/, name);
    assert.match(draft, /\*\*5 °C\*\*/, name);
    assert.match(draft, /gov\.uk\/government\/publications\/home-food-fact-checker/, name);
    assert.match(draft, /foodstandards\.gov\.au\/consumer\/prevention-of-foodborne-illness/, name);
  }
  assert.match(kuih, /jääkaapissa, ei tuntikausien huoneenlämpöodotuksessa|jääkaappiin \*\*mieluiten tunnin kuluessa\*\*/);
  assert.match(xoi, /\*\*vain kerran\*\*/);
  assert.match(review, /BC Centre for Disease Control \(2024\)/);
  assert.match(review, /Bacillus cereus/);
  assert.match(review, /edelleen HOLD/);
});


test("issue 404: source-backed review replaces kitchen dependency without bypassing safety HOLD", async () => {
  const [policy, readme, evidence, cookedMoong] = await Promise.all([
    readFile(path.join(repositoryRoot, "AGENTS.md"), "utf8"),
    readFile(path.join(draftDirectory, "README.md"), "utf8"),
    readFile(path.join(draftDirectory, "source-review-without-kitchen.md"), "utf8"),
    readFile(path.join(draftDirectory, "intialainen-pesarattu-mungpavuista-punnittu-v2.md"), "utf8"),
  ]);

  assert.match(policy, /in-house test kitchen is not available/i);
  assert.match(policy, /do \*\*not\*\* make the author's own/i);
  assert.match(policy, /remain HOLD/);
  assert.match(readme, /Koekeittiö ei ole pakollinen/);
  assert.match(readme, /source-review-without-kitchen\.md/);
  assert.match(evidence, /Koekeittiökoetta ei vaadita yleisenä julkaisuehtona/);
  assert.match(evidence, /ei ole todistus siitä, että Recipavon/);

  for (const entry of candidates) {
    assert.ok(evidence.includes(entry.original), `${entry.original}: no source review entry`);
  }
  assert.match(evidence, /HOLD \/ suora lähderistiriita/);
  assert.match(evidence, /Ruokavirasto/);
  assert.match(evidence, /Bacillus cereus/);
  const parsed = parseMarkdown(cookedMoong);
  assert.ok(parsed);
  assert.match(String(parsed.data.title), /^Mungpapuletut keitetyistä pavuista/);
  assert.doesNotMatch(String(parsed.data.title), /Pesarattu/i);
  assert.match(parsed.content, /ei perinteinen pesarattu/i);
  assert.match(parsed.content, /lähteistetysti toimivaksi osoitettu/i);
  assert.match(parsed.content, /ERITYINEN TURVALLISUUS-HOLD/);
  assert.equal(isPublicRecipeQuarantined("intialainen-pesarattu-mungpavuista"), true);
});
