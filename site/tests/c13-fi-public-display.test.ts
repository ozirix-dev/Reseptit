import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { c13PublicFiPaths, projectC13FiDisplay } from "../scripts/c13-fi-public-display";

const root = path.resolve(import.meta.dirname, "../..");
const ids = ["indialainen-poha-maapahkinoilla","lahi-ita-manakish-zaatarilla","malesialainen-kaya-paahtoleipa","valimerellinen-halloumi-tomaattileipa","intialainen-rava-uttapam","lahi-ita-ful-medames","meksikolainen-aamiais-tacot-mustapavuilla","valimerellinen-menemen-fetalla","valimerellinen-pinaatti-fetashakshuka","vietnamilainen-pho-ga-aamuksi","intialainen-mannasuurimoupma"];
test("C13 exact-source preparation corrections preserve raw FI nutrition and GI/GK binding inputs", async () => {
  assert.deepEqual(c13PublicFiPaths.slice().sort(), ids.map(id=>`reseptit/aamupalat/${id}.md`).sort());
  for (const id of ids) {
    const file = `reseptit/aamupalat/${id}.md`;
    const raw = await readFile(path.join(root, file), "utf8");
    const shown = projectC13FiDisplay(file, raw);
    assert.notEqual(shown, raw);
    const beforeMd = parseMarkdown(raw), afterMd = parseMarkdown(shown);
    assert.ok(beforeMd && afterMd);
    const before = recipeFrontmatterSchema.parse(beforeMd.data), after = recipeFrontmatterSchema.parse(afterMd.data);
    assert.deepEqual(after.ingredients, before.ingredients, id);
    assert.equal(after.servings, before.servings, id);
    assert.equal(after.time_total_min, before.time_total_min, id);
    assert.equal(after.status, before.status, id);
    for (const key of ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const)
      assert.equal(after[key], before[key], id + "/" + key);
    const steps = afterMd.content.match(/^\d+\. /gm) ?? [];
    assert.equal(steps.length, 4, id + ": four individualized preparation steps");
    assert.doesNotMatch(afterMd.content, /Raasta, muussaa tai hienonna pääraaka-aine|Kypsennä liha tai muut täytteet|Jos reseptissä on valmis leipä tai taikina|Valmistele kulhon ainekset|Kuumenna kattilassa öljy tai liemi/);
    const publicFi = siteContent.recipes.find(r=>r.recipeId===id && r.locale==="fi");
    assert.ok(publicFi, id + " must remain published");
    assert.equal(publicFi.instructionsText.length, 4, id);
    assert.equal(projectC13FiDisplay("reseptit/aamupalat/unrelated.md", raw), raw);
    assert.throws(()=>projectC13FiDisplay(file, raw + "\n# unexpected"), /C13_FI_SOURCE_STALE/);
  }
});
