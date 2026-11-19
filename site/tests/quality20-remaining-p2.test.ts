import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { reviewedRecipeCopy, applyCopyEdits } from "../scripts/public-recipe-copy-r2";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const locales = ["fi", "en", "sv", "th"] as const;
const cases = [
  {
    id: "keto-pannukakku", category: "jalkiruoat", servings: 4,
    image: "kuvat/jalkiruoat/keto-pannukakku.webp", imageBlob: "0e598b99085db20df6573847b5671f659576fb73",
    sources: ["3a1769328ec0154bb572db330528d72648f915a1", "dfdba9bbb94b2f09432e1da828310b259c5f37ff", "f8ceefa89e73de90fac0a6e7f68d8d3472a2c098", "513804e1613af2dd70f322addf2083e4ae20e581"],
    nutrition: { carbsNetG: 3.01, carbsTotalG: 5.88, proteinG: 11.06, fatG: 35.48 },
    notes: ["Kuvassa olevat mustikat", "The pictured blueberries", "Blåbären, hallonen", "บลูเบอร์รี ราสป์เบอร์รี"],
  },
  {
    id: "keto-pinaattiletut", category: "paaruoat", servings: 3,
    image: "kuvat/paaruoat/keto-pinaattiletut.webp", imageBlob: "c3cf853182de277b3f3b483f391b5a257d9d6371",
    sources: ["884807dcdd6d10945e6874ab2e4f27ccb4fe3fa3", "ea9875c2306fd5c4d0f03494103001e25f5c6da7", "4c7d990402d2a3f4fe1d682ff263c51a376f051c", "0bdc2bcfec4ed42f7c8a8a503a24ced97644de03"],
    nutrition: { carbsNetG: 2.08, carbsTotalG: 3.71, proteinG: 11.82, fatG: 19.93 },
    notes: ["Kuvassa on marjoja", "The picture shows berries", "Bilden visar bär", "ในภาพมีผลเบอร์รี"],
  },
  {
    id: "pad-kra-pao-vhh", category: "paaruoat", servings: 4,
    image: "kuvat/paaruoat/pad-kra-pao-vhh.webp", imageBlob: null,
    sources: ["93a52ad822e505b064dae7f4eb7263a2c269d1c3", "f4b20407ed6a0ee3c867e84e801fefab8b398ef2", "f9ec6ed326b9d937932a026b10aff8d9bd7893b3", "dfb59871717efdb6d26191628f2da45b4694a0af"],
    nutrition: { carbsNetG: 4.87, carbsTotalG: 9.85, proteinG: 42.67, fatG: 28.2 },
    notes: null,
  },
] as const;

function gitBlob(data: string | Buffer): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(data) + "\0").update(data).digest("hex");
}

test("quality20: reviewed public copy resolves three P2 findings across all four languages", () => {
  for (const fixture of cases) {
    const published = siteContent.recipes.filter(item => item.recipeId === fixture.id);
    assert.deepEqual(published.map(item => item.locale).sort(), [...locales].sort(), fixture.id);
    if (fixture.imageBlob) {
      const image = readFileSync(path.join(root, fixture.image));
      assert.equal(gitBlob(image), fixture.imageBlob, fixture.id + ": the reviewed image must be unchanged");
    }
    for (const [i, locale] of locales.entries()) {
      const sourcePath = locale === "fi"
        ? `reseptit/${fixture.category}/${fixture.id}.md`
        : `kaannokset/${locale}/${fixture.category}/${fixture.id}.md`;
      const raw = readFileSync(path.join(root, sourcePath), "utf8");
      assert.equal(gitBlob(raw), fixture.sources[i], sourcePath + ": sealed source drift");
      const parsed = parseMarkdown(raw);
      assert.ok(parsed);
      assert.equal(parsed.data.status, "published");
      assert.equal(parsed.data.servings, fixture.servings);
      assert.equal(parsed.data.image?.src, fixture.image.replace(/^kuvat\//, ""));
      const page = published.find(item => item.locale === locale);
      assert.ok(page);
      assert.equal(page.servings, fixture.servings);
      assert.deepEqual(page.nutrition, fixture.nutrition, sourcePath + ": historical macros");
      assert.equal(page.image?.alt, parsed.data.image?.alt, sourcePath + ": image caption");
      const copy = reviewedRecipeCopy(fixture.id, locale);
      assert.ok(copy, sourcePath + ": reviewed display copy required");
      if (fixture.notes) {
        assert.ok(copy.notes?.length, sourcePath + ": serving note required");
        const projected = applyCopyEdits(parsed.content, copy.notes);
        assert.ok(projected.includes(fixture.notes[i]), sourcePath + ": visible explanatory text");
        assert.ok(!parsed.content.includes(fixture.notes[i]), sourcePath + ": do not mutate sealed source");
        assert.ok(page.notesHtml.includes(fixture.notes[i]), sourcePath + ": published note");
        assert.ok(page.notesHtml.includes(locale === "fi" ? "ravintoarvo" : locale === "en" ? "nutrition" : locale === "sv" ? "näringsvär" : "โภชนาการ"));
      } else {
        assert.equal(page.description, copy.description, sourcePath + ": public recipe description");
        assert.ok(copy.description && copy.description.length > 80);
        assert.ok(page.description.includes(locale === "fi" ? "thaibasilikaa"
          : locale === "en" ? "Thai basil"
          : locale === "sv" ? "thaibasilikan" : "ใบโหระพาไทย"));
        assert.ok(page.description.includes(locale === "fi" ? "pyhä basilika"
          : locale === "en" ? "holy basil"
          : locale === "sv" ? "heliga basilika" : "ใบกะเพรา"),
          sourcePath + ": distinguish the species in adaptation");
        const items = parsed.data.ingredients as { item: string; amount: number }[];
        const basil = items.find(item => /basilik|basil|โหระพา/i.test(item.item));
        assert.equal(basil?.amount, 30, sourcePath + ": canonical basil amount");
      }
    }
  }
});
