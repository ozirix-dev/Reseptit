import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { verifyNutritionEvidence } from "../scripts/nutrition-evidence";

type PublishedReview = { recipeId: string; releasePr: number; sourceBlobSha: string; state: string; gkStatus: string };

test("five original drafts stay pinned and separate FI releases need their own evidence", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const audit = JSON.parse(await readFile(path.join(root, "docs/reviews/karnivore-fi5-publication-triage-2026-11-11.json"), "utf8")) as {
    publicationAuthorized: boolean;
    rawScenarioCanBePublished: boolean;
    postReviewReleases?: PublishedReview[];
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
  assert.deepEqual(audit.postReviewReleases?.map(x=>x.recipeId),["karnivore-smashburger"]);
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
    if (row.recipeId === "karnivore-smashburger") {
      const publicBytes=await readFile(path.join(root,"reseptit/paaruoat",row.recipeId+".md"));
      const sourcePin: PublishedReview | undefined = audit.postReviewReleases?.find((release) => release.recipeId === row.recipeId);
      assert(sourcePin,"published Smashburger needs a separately reviewed source pin");
      const publicHash=createHash("sha1").update("blob "+publicBytes.byteLength+"\\0".replace("\\0","\0")).update(publicBytes).digest("hex");
      assert.equal(publicHash,sourcePin.sourceBlobSha,"published source changed without renewed review");
      assert.equal(sourcePin.releasePr,492);
      assert.equal(sourcePin.state,"PUBLISHED_WITH_INDEPENDENT_SOURCE_EVIDENCE");
      assert.equal(sourcePin.gkStatus,"UNAVAILABLE_NOT_ZERO");
      const pub=parseMarkdown(publicBytes.toString("utf8"));
      assert(pub);
      const published=recipeFrontmatterSchema.parse(pub.data);
      assert.equal(published.status,"published");
      assert.equal(published.image?.src,"paaruoat/karnivore-smashburger.webp");
      assert.deepEqual([published.image?.width,published.image?.height],[1280,853]);
      assert.deepEqual([published.protein_per_serving_g,published.fat_per_serving_g,published.carbs_net_per_serving_g],
        [45.01,55,0]);
    } else if (row.recipeId === "karnivore-meatza") {
      const publicBytes = await readFile(path.join(root, "reseptit/paaruoat", row.recipeId + ".md"));
      const publicHash = createHash("sha1").update("blob " + publicBytes.byteLength + "\0").update(publicBytes).digest("hex");
      assert.equal(publicHash, "c5b3a778b25e79912c2ac657fc832ad0040d6088");
      const publicSource = publicBytes.toString("utf8");
      const parsedPublic = parseMarkdown(publicSource);
      assert(parsedPublic);
      const published = recipeFrontmatterSchema.parse(parsedPublic.data);
      assert.equal(published.status, "published");
      assert.equal(published.image?.src, "paaruoat/karnivore-meatza.webp");
      assert.match(publicSource, /Jaa kaikki talteen otettu paistorasva ja paistoneste/);
      assert.match(publicSource, /GK: ei määritetty\./);
      const evidence = JSON.parse(await readFile(path.join(root, "docs/nutrition/calculations/karnivore-meatza.json"), "utf8"));
      const result = verifyNutritionEvidence(published, evidence);
      assert.equal(result.status, "ESTIMATE WITH EVIDENCE", result.errors.join("\n"));
      assert.equal(result.calculated?.perServing.kcal, 571.83);
    } else {
      await assert.rejects(access(path.join(root,"reseptit/paaruoat",row.recipeId+".md")),
        (error: unknown) => (error as NodeJS.ErrnoException).code === "ENOENT",
        row.recipeId+": publication requires its own release review");
    }
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
