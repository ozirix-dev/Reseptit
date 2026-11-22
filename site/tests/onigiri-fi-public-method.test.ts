import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "japanilainen-onigiri-lohella";
const sources = {
  fi: ["reseptit/aamupalat/japanilainen-onigiri-lohella.md", "b538651f6bcae3abb2e987549a85fc5589588e4c", "Valmistus"],
  en: ["kaannokset/en/aamupalat/japanilainen-onigiri-lohella.md", "2d3c04388b788ccb767e8427b258b52e6341e0c4", "Preparation"],
  sv: ["kaannokset/sv/aamupalat/japanilainen-onigiri-lohella.md", "9389c54af00b7c0f13f8d8f1a8c7b612f9051f65", "Tillagning"],
  th: ["kaannokset/th/aamupalat/japanilainen-onigiri-lohella.md", "77a218c719bec4b1d8b846c7f26d827b200d085d", "วิธีทำ"],
} as const;

function gitBlobSha(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 salmon onigiri: FI only public method fix and source-bound values (" + locale + ")", () => {
    const [relative, sha, heading] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), sha, "source changed: review new semantics first");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 25);

    const matching = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(matching.length, 1);
    const visible = matching[0];
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.instructionsText.length, 4);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(visible.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(visible.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(visible.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    const marker = "\\n## " + heading + "\\n";
    const start = parsed.content.indexOf(marker);
    assert.ok(start >= 0);
    const tail = parsed.content.slice(start + marker.length);
    const end = tail.indexOf("\\n## ");
    const originalMethod = (end < 0 ? tail : tail.slice(0, end)).trim();
    const correction = reviewedRecipeCopy(id, locale)?.method;
    const rendered = visible.instructionsText.join("\\n");

    if (locale === "fi") {
      assert.ok(correction && correction.length === 1, "one FI-only review correction");
      assert.equal(correction[0][0], originalMethod, "exact source before-text");
      assert.equal(applyCopyEdits(originalMethod, correction), correction[0][1]);
      assert.match(rendered, /100 g kuivaa riisiä/);
      assert.match(rendered, /150 g lohta/);
      assert.match(rendered, /tiiviiksi kolmioksi/);
      assert.match(rendered, /3 g kuivattua norilevää/);
      assert.match(rendered, /5 g seesaminsiemeniä/);
      assert.match(rendered, /ilman lisättyä rasvaa/);
      assert.doesNotMatch(rendered, /tofu|kasvikset ja.*yrtit|kastikkeen ainekset|jaa lämmin pohja kulhoihin/i);
    } else {
      assert.equal(correction, undefined, "translated source must not be overlaid");
      assert.equal(rendered, originalMethod, "published translation text must stay unchanged");
    }
  });
}
