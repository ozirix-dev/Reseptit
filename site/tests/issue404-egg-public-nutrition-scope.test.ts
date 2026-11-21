import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const scopeIds = [
  "valimerellinen-menemen-fetalla",
  "valimerellinen-pinaatti-fetashakshuka",
] as const;
const pinnedBlobs: Record<string, string> = {
  "valimerellinen-menemen-fetalla/fi": "6a767558edc1ee37372f9029ca4ea88c6f129746",
  "valimerellinen-menemen-fetalla/en": "dcb27ea6eba20094f491649ecc84d2c1b56c4a12",
  "valimerellinen-menemen-fetalla/sv": "e05601dfa3fd920f261b58be943c379bd5870a05",
  "valimerellinen-menemen-fetalla/th": "161a21e9c8e8bb71368b85310e7578d96a31ed76",
  "valimerellinen-pinaatti-fetashakshuka/fi": "3e2882523e98b4ab681c97d8a95a5e6c59f5a7bb",
  "valimerellinen-pinaatti-fetashakshuka/en": "aa84114a32ce23881714f8f416ec557b1a702872",
  "valimerellinen-pinaatti-fetashakshuka/sv": "625ea0b0f3f80a117813fdca21bd46287b489ed5",
  "valimerellinen-pinaatti-fetashakshuka/th": "57d8d1709d5cb0e093eb034dd5662ad7ae72ad93",
};
const locales = ["fi", "en", "sv", "th"] as const;
const headers = {
  fi: "Ravintoarvion laskentaperusta",
  en: "Nutrition estimate assumptions",
  sv: "Antaganden för näringsberäkningen",
  th: "สมมติฐานในการคำนวณคุณค่าทางโภชนาการ",
} as const;
const oilAmounts = { fi: "13,5 g", en: "13.5 g", sv: "13,5 g", th: "13.5 กรัม" } as const;
function blob(text: string) {
  return createHash("sha1").update("blob " + Buffer.byteLength(text, "utf8") + "\0")
    .update(text).digest("hex");
}

test("#404 egg recipes: eight public nutrition scopes disclose assumptions without changing sealed recipe sources", () => {
  for (const id of scopeIds) {
    for (const locale of locales) {
      const key = id + "/" + locale;
      const recipePath = locale === "fi"
        ? "reseptit/aamupalat/" + id + ".md"
        : "kaannokset/" + locale + "/aamupalat/" + id + ".md";
      const raw = readFileSync(path.join(root, recipePath), "utf8");
      assert.equal(blob(raw), pinnedBlobs[key], key + ": unreviewed source change");
      const note = reviewedRecipeCopy(id, locale)?.nutritionBasis;
      assert.ok(note, key + ": source assumptions must be visible in all languages");
      assert.ok(note.includes(headers[locale]), key);
      assert.ok(note.includes("Fineli 11211"), key + ": 25% goat milk feta source");
      assert.ok(note.includes(oilAmounts[locale]), key + ": all cooking oil counted");
      assert.ok(note.includes("125"), key + ": edible tomato weight");
      assert.ok(note.includes("55"), key + ": shell-free egg weight");
      assert.ok(note.includes("150"), key + ": 25% feta weight");
      if (id.includes("menemen")) {
        assert.ok(note.includes("170"), key + ": green pepper weight");
      } else {
        assert.ok(note.includes("F008761"), key + ": nutrition spinach record");
      }
      const published = siteContent.recipes.find(recipe => recipe.recipeId === id && recipe.locale === locale);
      assert.ok(published, key + ": published recipe must remain visible");
      assert.ok(published.notesHtml.includes("Fineli 11211"), key + ": publicly visible source link");
      assert.ok(published.notesHtml.includes(headers[locale]), key + ": publicly visible disclosure");
      assert.ok(published.notesHtml.includes(oilAmounts[locale]), key + ": oil assumption visible");
      assert.ok(!raw.includes(headers[locale]), key + ": never change sealed FI/i18n/GK source");
    }
  }
});

test("#404 spinach GK: historical source discrepancy stays explicit; no new numeric approval", () => {
  const gk = JSON.parse(readFileSync(path.join(root, "docs/nutrition/gk-reviewed-portions.json"), "utf8"));
  const row = gk["valimerellinen-pinaatti-fetashakshuka"];
  assert.ok(row);
  assert.equal(row.reviewedAt, "2026-11-18");
  assert.match(row.reasoning, /F008749/);
  assert.match(row.reasoning, /F008761/);
  assert.match(row.reasoning, /0\.3 g for one serving/);
  for (const locale of locales) {
    const note = reviewedRecipeCopy("valimerellinen-pinaatti-fetashakshuka", locale)?.nutritionBasis ?? "";
    assert.match(note, /GK|glycemic|glykemisk|ภาระน้ำตาล/);
    assert.ok(note.includes("F008761"));
  }
});
