import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectPublicRecipeMethodCopy, publicRecipeDescription } from "../scripts/public-recipe-copy";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";

const root = path.resolve(import.meta.dirname, "../..");
const locales = ["fi", "en", "sv", "th"] as const;
const fixtures = [
  {
    id: "hummus", dir: "alkuruoat", servings: 4,
    blobs: ["cd792d70d50753a5f8f93eeca030ec3743cfb209", "cdf5c01a82e3b2e0180fe655c817af1f26c76433", "726acb81b821bd42962cd169dab3227eac8ca6a0", "ecd6f325344988af9ab6242ee57d49714937b32f"],
    macros: { carbsNetG: 18.54, carbsTotalG: 25.16, proteinG: 11.04, fatG: 15.79 },
    note: ["Kuvassa näkyvä pitaleipä", "The pictured pita bread", "Pitabrödet på bilden", "ขนมปังพิตาในภาพ"],
  },
  {
    id: "paneer-tikka", dir: "alkuruoat", servings: 4,
    blobs: ["3ea73d0d275bc53355bdd705fc3a076ccd8099b0", "0db3e9fb6e9ba258cb0ec46b38add63175483aef", "9037586927abd14f8c3c82a9379f44c4da345530", "45086a5249b67df6401c8f3653319fd1fdab9401"],
    macros: { carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null },
    note: ["Sitruunalohkot ja minttuchutney", "Lemon wedges and mint chutney", "Citronklyftor och mintchutney", "เลมอนหั่นเสี้ยวและชัทนีย์มินต์"],
  },
  {
    id: "butter-chicken", dir: "paaruoat", servings: 4,
    blobs: ["5b35d650ed1647f0adbd4bcb58fadcc0c5234426", "e6cc65de68565c959ebf8fe94c6d7d8b4264f8af", "be7c1500d0a58e4643a278fb60ee1f5e0ed13592", "1b51c08be467b6b451631aeefd43245a20b28723"],
    macros: { carbsNetG: 11.54, carbsTotalG: 13.17, proteinG: 38.73, fatG: 36.96 },
    note: ["Ravintoarvion laskentaperuste", "Nutrition-estimate basis", "Näringsberäkningens grund", "พื้นฐานการประเมินโภชนาการ"],
  },
  {
    id: "paella-valenciana", dir: "paaruoat", servings: 4,
    blobs: ["0a998549059a486ea26c37226ba54fdfcc813e7e", "21727a307da43d0a25abaa4b86aa0dae1b0fbf9a", "7c7479e86e1e06cdfa71dbdb1a0e6ec3f214e7b1", "1aa34dbb6bed5064dfe82c64db6abd8304159939"],
    macros: { carbsNetG: 59.13, carbsTotalG: 61.1, proteinG: 40.13, fatG: 16.69 },
    note: null,
  },
] as const;

function gitBlob(data: string | Buffer) {
  return createHash("sha1").update("blob " + Buffer.byteLength(data) + "\0").update(data).digest("hex");
}

test("quality20 P3: recipe copy remains source-bound and nutrition-stable across four languages", () => {
  const image = readFileSync(path.join(root, "kuvat/paaruoat/hummus.webp"));
  assert.equal(gitBlob(image), "271e7699f2e86dfbd8f8e26464ab5d368a4084ef", "visually reviewed pita image unchanged");
  for (const fixture of fixtures) {
    const published = siteContent.recipes.filter(r => r.recipeId === fixture.id);
    assert.deepEqual(published.map(r => r.locale).sort(), [...locales].sort(), fixture.id);
    for (const [i, locale] of locales.entries()) {
      const file = locale === "fi" ? `reseptit/${fixture.dir}/${fixture.id}.md`
        : `kaannokset/${locale}/${fixture.dir}/${fixture.id}.md`;
      const raw = readFileSync(path.join(root, file), "utf8");
      assert.equal(gitBlob(raw), fixture.blobs[i], file + ": historic source cannot silently change");
      const parsed = parseMarkdown(raw);
      assert.ok(parsed);
      assert.equal(parsed.data.status, "published");
      assert.equal(parsed.data.servings, fixture.servings);
      const page = published.find(r => r.locale === locale);
      assert.ok(page);
      assert.equal(page.servings, fixture.servings);
      assert.deepEqual(page.nutrition, fixture.macros, file + ": historic macro values");
      if (fixture.note) {
        assert.ok(page.notesHtml.includes(fixture.note[i]), file + ": explanatory public note");
        if (fixture.id === "paneer-tikka") {
          assert.ok(page.instructionsText.some(step => locale === "fi" ? step.includes("Voit halutessasi lisätä") :
            locale === "en" ? step.includes("if desired") : locale === "sv" ? step.includes("eventuellt") :
            step.includes("หากต้องการ")), file + ": optional serving extras");
        }
        if (fixture.id === "butter-chicken") {
          assert.equal(page.instructionStepsHtml?.length, 5, file + ": original five-step cooking structure retained");
          assert.ok(page.instructionsText.at(-1)?.includes(locale === "fi" ? "Tarjoa broileri kuumana" : locale === "en" ? "Serve the chicken hot" : locale === "sv" ? "Servera kycklingen varm" : "เสิร์ฟไก่ขณะร้อน"), file + ": final step is actual serving advice");
          assert.ok(page.instructionsText.some(step => step.includes("75 °C")), file + ": chicken safety retained");
          assert.ok(!page.instructionsText.some(step => /nutrient-retention proxy|näringsproxy|ravintokoostumusta|ค่าประกอบของวัตถุดิบดิบ/.test(step)), file);
        }
      } else {
        const publicDescription = publicRecipeDescription(fixture.id, fixture.id, locale);
        assert.ok(publicDescription);
        assert.equal(page.description, publicDescription, file + ": distinct culinary summary");
        assert.ok(publicDescription.includes("75 °C"));
      }
    }
  }
  assert.throws(() => projectPublicRecipeMethodCopy("paneer-tikka", "fi", "no original steps", ""), /QUALITY20_P3_SOURCE_DRIFT/);
  assert.throws(() => projectPublicRecipeMethodCopy("butter-chicken", "fi", "no original steps", ""), /QUALITY20_P3_SOURCE_DRIFT/);
  assert.throws(() => projectPublicRecipeMethodCopy("hummus", "fi", "no original steps", ""), /QUALITY20_P3_SOURCE_DRIFT/);
});

test("quality20 P3: earlier published-copy cleanup remains in force", () => {
  const durrapizza = siteContent.recipes.find(r => r.recipeId === "gluteeniton-durrapizzapohja" && r.locale === "fi");
  assert.ok(durrapizza);
  assert.ok(durrapizza.notesHtml.includes("Tarkista merkintä omasta pakkauksestasi"));
  assert.ok(!durrapizza.notesHtml.includes("ennen julkaisemista"));
  for (const locale of locales) {
    const tort = siteContent.recipes.find(r => r.recipeId === "keto-joulutortut" && r.locale === locale);
    assert.ok(tort);
    assert.ok(!/mausta lopuksi oman maun mukaan|finally season according to your own taste|krydda till sist efter egen smak|ปรุงรสตามรสนิยมของคุณเอง/.test(tort.notesHtml), locale);
  }
});
