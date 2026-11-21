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
    required: [/80\s*g/, /180\s*g/, /liot/i, /ruodot/, /63\s*°C/],
    minIngredients: 8,
  },
  {
    original: "intialainen-idli-kookoschutneylla",
    sourceBlob: "e862e239cf56f33c27ea36e6a5311bf6d179364d",
    required: [/120\s*g/, /40\s*g/, /4[–-]6/, /8[–-]12/, /12[–-]15/, /chutney/],
    minIngredients: 12,
  },
  {
    original: "intialainen-pesarattu-mungpavuista",
    sourceBlob: "5356f03ce2764e38563a95ede0e4373b8f50a65e",
    required: [/150\s*g/, /12\s*tuntia/, /30\s*minuuttia/, /keitet/i, /Ruokavirasto/],
    minIngredients: 7,
  },
  {
    original: "malesialainen-kuih-seri-muka",
    sourceBlob: "4c565331c9e3a6322cd97989a9ad6fac38167284",
    required: [/180\s*g/, /pandan/i, /4\s*tuntia/, /25[–-]30/, /71\s*°C/],
    minIngredients: 11,
  },
  {
    original: "vietnamilainen-xoi-maapahkinalla",
    sourceBlob: "424b60e50e95d2e216e9090333f4f89509ee61ad",
    required: [/180\s*g/, /65\s*g/, /4[–-]8\s*tuntia/, /25[–-]40/, /seesam/i],
    minIngredients: 7,
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
    assert.ok(data.ingredients.every((ingredient) => ingredient.amount !== null && ingredient.amount > 0),
      "No unknown weighed ingredient may silently become zero");
    for (const key of [
      "carbs_net_per_serving_g", "carbs_total_per_serving_g",
      "protein_per_serving_g", "fat_per_serving_g",
    ] as const) {
      assert.equal(data[key], null, proposedId + ": published macro approval is missing");
    }
    assert.match(parsed.content, /DRAFT\s*\/\s*(?:HOLD|ERITYINEN TURVALLISUUS-HOLD)/);
    assert.match(parsed.content, /(?:ei|eivät) (?:ole |fyysisesti |koe)/i);
    assert.match(parsed.content, /## Valmistus/);
    assert.match(parsed.content, /## (?:Menetelmävertailu|Turvallisuus- ja ruokalajilähteet)/);
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
