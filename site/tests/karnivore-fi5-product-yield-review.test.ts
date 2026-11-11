import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

test("five newly illustrated karnivore FI drafts stay source-pinned and nutrition HOLD", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const audit = JSON.parse(await readFile(path.join(root, "docs/reviews/karnivore-fi5-publication-triage-2026-11-11.json"), "utf8")) as {
    publicationAuthorized: boolean;
    rawScenarioCanBePublished: boolean;
    recipes: Array<{ recipeId: string; sourceBlobSha: string; sourcePath: string; status: string;
      sourceMatchCounts: {matched: number; proxy: number; unresolved: number};
      blockers: string[]; gkStatus: string; rawScenarioStatus: string; productCandidates: Array<{url:string}> }>;
  };
  const sourceMap = JSON.parse(await readFile(path.join(root, "docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json"), "utf8")) as {
    recipes: Array<{recipeId: string; inputs: Array<{sourceMatch: string}>;
      modelledCarbohydratePerServingFromMappedInputsG: number | null}>;
  };
  const expected = ["karnivore-smashburger","karnivore-rapeat-kananreisipalat","karnivore-maksa-ja-pekoni","karnivore-meatza","karnivore-lammaskyljykset-voissa"];
  assert.equal(audit.publicationAuthorized, false);
  assert.equal(audit.rawScenarioCanBePublished, false);
  assert.deepEqual(audit.recipes.map(x=>x.recipeId), expected);
  for(const row of audit.recipes) {
    assert.equal(row.status,"HOLD_NO_PUBLICATION");
    assert.equal(row.gkStatus,"UNAVAILABLE_NOT_ZERO");
    assert.equal(row.rawScenarioStatus,"NONPUBLISHABLE_PROXY_INPUTS");
    assert(row.blockers.length>0);
    assert(row.productCandidates.every(p=>p.url.startsWith("https://")));
    const buf=await readFile(path.join(root,row.sourcePath));
    const prefix=Buffer.from("blob "+buf.byteLength+"\\0".replace("\\0","\0"));
    assert.equal(createHash("sha1").update(prefix).update(buf).digest("hex"),row.sourceBlobSha,
      row.recipeId+": draft content changed without source re-review");
    const parsed=parseMarkdown(buf.toString("utf8"));
    assert(parsed);
    const recipe=recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(recipe.recipe_id,row.recipeId);
    assert.equal(recipe.status,"draft");
    assert.equal(recipe.language,"fi");
    assert.equal(recipe.image?.src,"paaruoat/"+row.recipeId+".webp");
    assert.deepEqual([recipe.image?.width,recipe.image?.height],[1280,853]);
    await assert.rejects(access(path.join(root,"reseptit/paaruoat",row.recipeId+".md")),
      (error: unknown) => (error as NodeJS.ErrnoException).code === "ENOENT",
      row.recipeId+": cannot publish without a new release review");
    const mapped=sourceMap.recipes.find(x=>x.recipeId===row.recipeId);
    assert(mapped,row.recipeId+": missing source map");
    for(const kind of ["matched","proxy","unresolved"] as const)
      assert.equal(mapped.inputs.filter(i=>i.sourceMatch===kind).length,row.sourceMatchCounts[kind]);
    assert(row.sourceMatchCounts.proxy>0,row.recipeId+": no silent proxy promotion");
  }
  const liver=sourceMap.recipes.find(x=>x.recipeId==="karnivore-maksa-ja-pekoni");
  assert(liver && liver.modelledCarbohydratePerServingFromMappedInputsG !== null &&
    liver.modelledCarbohydratePerServingFromMappedInputsG>6.6,
    "liver's naturally available carbohydrates cannot be imputed to zero");
  const meatza=await readFile(path.join(root,"tuonti/karnivore/paaruoat/karnivore-meatza.md"),"utf8");
  assert.match(meatza,/Valuta pellille irronnut rasva/i,
    "drained meatza fat needs a separate retention model");
  for(const id of ["karnivore-rapeat-kananreisipalat","karnivore-lammaskyljykset-voissa"]){
    const row=audit.recipes.find(r=>r.recipeId===id);
    assert(row?.blockers.some(b=>/BONE|YIELD/.test(b)),id+": bone-to-edible yield remains unapproved");
  }
});
