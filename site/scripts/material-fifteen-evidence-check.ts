import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";

export const material15ManifestPath = "docs/reviews/2026-11-11-material21-fifteen-evidence-cases.json";

type EvidenceCase = {
  issue404_card: number;
  recipe_id: string;
  source_path: string;
  source_git_blob_sha1: string;
  public_disposition: "QUARANTINE" | "VISIBLE_METHOD_ONLY" | "VISIBLE_CANONICAL_METHOD";
  review_status: "HOLD_EVIDENCE";
  blocker_axis: string;
  source_observation: { item: string; amount: number; unit: string };
  required_independent_evidence: string;
  approval: {
    nutrition: false; gi_gk: false;
    canonical_ingredient_change: false; public_quarantine_release: false;
  };
  next_action: string;
};
type Manifest = { schemaVersion: 1; cases: EvidenceCase[] };

export const gitBlobSha1 = (value: string): string =>
  createHash("sha1").update("blob " + Buffer.byteLength(value,"utf8") + "\0").update(value).digest("hex");

/** Validate a static, source-locked HOLD inventory; never approve macro or GK values. */
export async function verifyMaterialFifteen(repoRoot: string, manifest?: Manifest): Promise<{
  checked: number; quarantine: number; visible: number; ids: string[];
}> {
  const source = manifest ?? JSON.parse(await readFile(path.join(repoRoot,material15ManifestPath),"utf8")) as Manifest;
  assert.equal(source.schemaVersion,1);
  assert.ok(Array.isArray(source.cases));
  assert.equal(source.cases.length,15,"15 evidence decisions are mandatory");
  const ids = new Set<string>();
  const cardIds = new Set<number>();
  let quarantine=0,visible=0;
  for (const item of source.cases) {
    assert.match(item.recipe_id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(item.source_path,`reseptit/aamupalat/${item.recipe_id}.md`);
    assert.match(item.source_git_blob_sha1,/^[a-f0-9]{40}$/);
    assert(!ids.has(item.recipe_id),`duplicate recipe: ${item.recipe_id}`);
    ids.add(item.recipe_id);
    assert(Number.isInteger(item.issue404_card) && !cardIds.has(item.issue404_card));
    cardIds.add(item.issue404_card);
    assert.equal(item.review_status,"HOLD_EVIDENCE");
    assert.ok(item.blocker_axis.length>3 && item.required_independent_evidence.length>25);
    assert.ok(item.next_action.length>20);
    assert.deepEqual(item.approval,{
      nutrition:false,gi_gk:false,
      canonical_ingredient_change:false,public_quarantine_release:false,
    },"This evidence inventory cannot authorize release or nutrition approval");

    const raw=await readFile(path.join(repoRoot,item.source_path),"utf8");
    assert.equal(gitBlobSha1(raw),item.source_git_blob_sha1,
      item.recipe_id+": SOURCE_STALE; re-audit changed FI source before relying on this card");
    const parsed=parseMarkdown(raw);
    assert.ok(parsed,item.recipe_id+": expected canonical Markdown");
    const recipe=recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(recipe.recipe_id,item.recipe_id);
    assert.equal(recipe.status,"published");
    assert.equal(recipe.language,"fi");
    const ingredient=recipe.ingredients.find(x=>
      x.item.toLocaleLowerCase("fi-FI").includes(item.source_observation.item.toLocaleLowerCase("fi-FI")));
    assert.ok(ingredient,item.recipe_id+": OBSERVED_INGREDIENT_MISSING");
    assert.equal(ingredient.amount,item.source_observation.amount,
      item.recipe_id+": OBSERVED_QUANTITY_CHANGED");
    assert.equal(ingredient.unit,item.source_observation.unit,
      item.recipe_id+": OBSERVED_UNIT_CHANGED");
    const quarantined=isPublicRecipeQuarantined(item.recipe_id);
    if (item.public_disposition==="QUARANTINE") {
      assert.equal(quarantined,true,item.recipe_id+": QUARANTINE_REMOVED_WITHOUT_APPROVAL");
      quarantine++;
    } else {
      assert.ok(["VISIBLE_METHOD_ONLY","VISIBLE_CANONICAL_METHOD"].includes(item.public_disposition));
      assert.equal(quarantined,false,item.recipe_id+": PUBLIC_DISPOSITION_CHANGED");
      visible++;
    }
  }
  assert.equal(quarantine,12);
  assert.equal(visible,3);
  return {checked:source.cases.length,quarantine,visible,ids:[...ids]};
}

const direct=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if (direct) {
  const root=path.resolve(import.meta.dirname,"../..");
  const result=await verifyMaterialFifteen(root);
  console.log(JSON.stringify({...result,status:"SOURCE_LOCKED_HOLD_ONLY",approved:0},null,2));
}
