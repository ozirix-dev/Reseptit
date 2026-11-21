import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";
import { parseMarkdown } from "../src/content/markdown";

const locales = ["fi", "en", "sv", "th"] as const;

/** Issue #404 B: legacy source ID, separately reviewed published successor if any.
 * A successor is never an approval to unquarantine or rewrite the historical source.
 */
const quarantined = [
  ["indonesialainen-bakwan-maissifritter", "indonesialainen-bakwan-jagung-kotiversio"],
  ["indonesialainen-nasi-goreng-aamiaisriisi", "indonesialainen-nasi-goreng-aamiaisriisi-punnittu-v2"],
  ["japanilainen-yaki-onigiri-misolla", "japanilainen-yaki-onigiri-misolla-punnittu-v2"],
  ["karibia-saltfish-fritterit", null],
  ["malesialainen-roti-canai-dhalilla", "malesialainen-roti-canai-dhalilla-punnittu-v2"],
  ["pohjoisafrikkalainen-maakouda", "pohjoisafrikkalainen-maakouda-punnittu-v2"],
  ["pohjoisafrikkalainen-msemen-hunajalla", "pohjoisafrikkalainen-msemen-hunajalla-punnittu-v2"],
  ["indonesialainen-lontong-sayur-aamiaiseksi", "indonesialainen-lontong-sayur-aamiaiseksi-punnittu-v2"],
  ["japanilainen-miso-tofu-paksoi", "japanilainen-miso-tofu-paksoi-punnittu-v2"],
  ["korealainen-mandu-keitto-aamiaiseksi", "korealainen-mandu-keitto-aamiaiseksi-punnittu-v2"],
  ["valimerellinen-appelsiini-aamiaiskakku", "valimerellinen-appelsiini-aamiaiskakku-punnittu-v2"],
  ["valimerellinen-kikherne-yrttiaamiainen", "valimerellinen-kikherne-yrttiaamiainen-punnittu-v2"],
  ["intialainen-idli-kookoschutneylla", null],
  ["intialainen-pesarattu-mungpavuista", null],
  ["kiinalainen-bao-munalla", "kiinalainen-bao-munalla-punnittu-v2"],
  ["malesialainen-kuih-seri-muka", null],
  ["vietnamilainen-xoi-maapahkinalla", null],
] as const;

const correctedOriginals = {
  "japanilainen-soba-aamiaiskeitto": [200, 700, 900],
  "kiinalainen-jianbing-munaletty": [100, 180],
  "meksikolainen-huevos-divorciados": [150, 75],
  "lahi-ita-labneh-kulho-zaatarilla": [100, 150],
} as const;

const repoRoot = path.resolve(import.meta.dirname, "../..");
const allBIds = new Set<string>([
  ...quarantined.map(([id]) => id),
  ...Object.keys(correctedOriginals),
]);

test("issue 404 B: source inventory partitions exactly into 17 quarantined and 4 corrected originals", () => {
  assert.equal(quarantined.length, 17);
  assert.equal(Object.keys(correctedOriginals).length, 4);
  assert.equal(allBIds.size, 21);
  assert.equal(quarantined.filter(([, successor]) => successor !== null).length, 12);
  assert.equal(quarantined.filter(([, successor]) => successor === null).length, 5);
  for (const [original] of quarantined) assert.ok(isPublicRecipeQuarantined(original), original);
  for (const original of Object.keys(correctedOriginals)) {
    assert.equal(isPublicRecipeQuarantined(original), false, original);
  }
});

test("issue 404 B: all 17 original HOLD IDs stay absent in FI/EN/SV/TH, with successors registered separately", async () => {
  const successors = JSON.parse(
    await readFile(path.join(repoRoot, "meta/recipe-successors.json"), "utf8"),
  ) as Array<{ predecessor_id: string; recipe_id: string; url_slug: string }>;
  const byOriginal = new Map(successors.map((item) => [item.predecessor_id, item]));
  for (const [original, successorId] of quarantined) {
    const raw = parseMarkdown(await readFile(
      path.join(repoRoot, "reseptit/aamupalat", `${original}.md`), "utf8",
    ));
    assert.ok(raw, original);
    // A sealed historical source may still say published. The quarantine is authoritative.
    assert.equal(raw.data.status, "published", `${original}: sealed source changed`);
    assert.equal(
      siteContent.recipes.some((entry) => entry.recipeId === original),
      false,
      `${original}: unsafe original was made public`,
    );
    const successor = byOriginal.get(original);
    if (successorId === null) {
      assert.equal(successor, undefined, `${original}: successor needs a separate review`);
      continue;
    }
    assert.ok(successor, `${original}: registered successor missing`);
    assert.equal(successor.recipe_id, successorId, original);
    assert.equal(successor.url_slug, original, original);
    const pages = siteContent.recipes.filter((entry) => entry.recipeId === successorId);
    assert.deepEqual(pages.map((entry) => entry.locale).sort(), [...locales].sort(),
      `${successorId}: published language coverage changed`);
    for (const page of pages) {
      assert.equal(page.slug, original, `${successorId}/${page.locale}: unexpected slug`);
      assert.ok(page.instructionsText.length >= 3, `${successorId}/${page.locale}: method missing`);
    }
  }
});

test("issue 404 B: the four active originals retain their reviewed cooking methods in all locales", () => {
  for (const [id, requiredNumbers] of Object.entries(correctedOriginals)) {
    for (const locale of locales) {
      const page = siteContent.recipes.find((entry) => entry.recipeId === id && entry.locale === locale);
      assert.ok(page, `${id}/${locale}: public recipe missing`);
      const method = page.instructionsText.join(" ");
      assert.ok(page.instructionsText.length >= 4, `${id}/${locale}: truncated method`);
      for (const amount of requiredNumbers) {
        assert.ok(method.includes(String(amount)), `${id}/${locale}: missing reviewed amount ${amount}`);
      }
      assert.doesNotMatch(method,
        /Kuumenna kattilassa öljy tai liemi|Valmistele kulhon ainekset; kypsennä pavut/,
        `${id}/${locale}: unreviewed generic FI instructions resurfaced`);
    }
  }
});
