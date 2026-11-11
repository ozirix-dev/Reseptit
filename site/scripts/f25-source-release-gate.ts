/** Batch-safe fail-closed gate for F25's 15 unapproved Finnish source recipes.
 * Never treats green translation structure tests or historical FI status:published as
 * proof of approved ingredients, nutrition, food safety, or GI/GK bindings.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { calculate, type Calculation } from "./nutrition-model";
import { recipeNutritionInputHash } from "./nutrition-evidence";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import defaultGate from "../../meta/kaannokset/f25-release-gate.json";

const digest = z.string().regex(/^[0-9a-f]{64}$/);
const approvalSchema = z.object({
  status: z.literal("RELEASE_AUTHORIZED"),
  reviewedAt: z.iso.date(),
  reviewReference: z.string().url().refine(url => url.startsWith("https://github.com/ozirix-dev/Reseptit/")),
  reviewerKind: z.enum(["AI_EDITORIAL_WITH_INDEPENDENT_EVIDENCE", "HUMAN_EDITORIAL"]),
  sourceSha256: digest,
  nutritionEvidenceSha256: digest,
  gkRecipeBindingSha256: digest,
  gkCalculationInputSha256: digest,
  gkCalculationEvidenceSha256: digest,
  gkDisposition: z.enum(["GK_RECHECKED_NUMERIC", "GK_UNAVAILABLE_EXPLICITLY_REVIEWED"]),
  cookingAndAllergensReviewed: z.literal(true),
  ingredientUnitConversionsReviewed: z.literal(true),
  translationMeaningReviewRequired: z.literal(true),
}).strict();
const trackedSource = z.object({
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  source_path: z.string().regex(/^reseptit\/(aamupalat|paaruoat)\/[a-z0-9-]+\.md$/),
  baseline_git_blob_sha: z.string().regex(/^[0-9a-f]{40}$/),
  source_risk: z.string().min(1),
  nutrition_input_at_baseline: z.enum(["missing", "present-unapproved"]),
  public_quarantine_at_baseline: z.boolean(),
  approval: approvalSchema.nullable(),
}).strict();
const gateSchema = z.object({
  schemaVersion: z.literal(1),
  purpose: z.string().min(1),
  originalScopeMain: z.string().regex(/^[0-9a-f]{40}$/),
  publishedF25PairsAtCreation: z.literal(30),
  sources: z.array(trackedSource).length(15),
}).strict();
export type F25SourceGate = z.infer<typeof gateSchema>;
export const f25SourceReleaseGate = gateSchema.parse(defaultGate);
export const f25SourceReleaseGatePath = "meta/kaannokset/f25-release-gate.json";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const read = (root: string, rel: string) => readFileSync(path.join(root, rel), "utf8");
const macroKeys = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const;

function assertUniqueGate(gate: F25SourceGate): void {
  const ids = gate.sources.map(x=>x.recipe_id);
  if (new Set(ids).size !== ids.length) throw Error("F25_GATE_DUPLICATE_ID");
  if (new Set(gate.sources.map(x=>x.source_path)).size !== ids.length) throw Error("F25_GATE_DUPLICATE_PATH");
}
assertUniqueGate(f25SourceReleaseGate);

export function sourceReleaseGateDecision(recipeId: string, gate: F25SourceGate = f25SourceReleaseGate, root: string = repoRoot):
  { authorized: boolean; reason: string } {
  const tracked = gate.sources.find(x => x.recipe_id === recipeId);
  if (!tracked) return {authorized:true,reason:"NOT_F25_PENDING"};
  if (!tracked.approval) return {authorized:false,reason:"F25_SOURCE_HOLD: " + recipeId};
  const approval = approvalSchema.parse(tracked.approval);
  const fail = (reason: string) => ({authorized:false,reason:"F25_SOURCE_APPROVAL_STALE: "+recipeId+": "+reason});
  if (isPublicRecipeQuarantined(recipeId)) return fail("public quarantine remains in effect");
  let raw: string, calculationRaw: string;
  try {
    raw = read(root, tracked.source_path);
    calculationRaw = read(root, "docs/nutrition/calculations/"+recipeId+".json");
  } catch { return fail("FI source or nutrition calculation missing"); }
  if (sha256(raw.replaceAll("\r\n","\n")) !== approval.sourceSha256) return fail("FI source SHA mismatch");
  if (sha256(calculationRaw.replaceAll("\r\n","\n")) !== approval.nutritionEvidenceSha256) return fail("nutrition evidence SHA mismatch");
  const markdown = parseMarkdown(raw);
  if (!markdown) return fail("missing FI frontmatter");
  const parsed = recipeFrontmatterSchema.safeParse(markdown.data);
  if (!parsed.success || parsed.data.language!=="fi" || parsed.data.status!=="published" || parsed.data.recipe_id!==recipeId) return fail("invalid or unpublished FI source");
  const source = parsed.data;
  if (macroKeys.some(k=>source[k] == null)) return fail("one or more FI macro fields missing");
  let evidence: Calculation;
  try { evidence = JSON.parse(calculationRaw) as Calculation; }
  catch { return fail("malformed nutrition evidence"); }
  if (evidence.recipeId!==recipeId || evidence.sourceHash!==recipeNutritionInputHash(source) || evidence.servings!==source.servings ||
      evidence.publicationStatus==="WITHHELD_SOURCE_INCOMPLETE" || evidence.ingredients.length!==source.ingredients.length ||
      source.ingredients.some((i,n)=>i.item!==evidence.ingredients[n]?.item || i.amount!==evidence.ingredients[n]?.amount || i.unit!==evidence.ingredients[n]?.unit))
    return fail("nutrition calculation not bound to exact FI ingredient masses");
  let c: ReturnType<typeof calculate>;
  try { c=calculate(evidence); } catch { return fail("nutrition calculation invalid"); }
  if (c.status!=="ESTIMATE WITH EVIDENCE" || !c.omissionWithinTolerance) return fail("nutrient sources or omission bounds incomplete");
  const derived=[c.perServing.netCarbohydrate,c.totalCarbohydratePerServingG,c.perServing.protein,c.perServing.fat];
  if (macroKeys.some((k,n)=>derived[n]!==source[k])) return fail("published FI macro fields do not match calculation");
  let gkBindings: {recipes?:Record<string,string|null>;calculationInputs?:Record<string,string|null>;calculationEvidence?:Record<string,string|null>};
  try { gkBindings=JSON.parse(read(root,"docs/nutrition/glycemic-load-recipe-bindings.json")); }
  catch { return fail("GK version bindings missing or invalid"); }
  if (gkBindings.recipes?.[recipeId]!==approval.gkRecipeBindingSha256 ||
      gkBindings.calculationInputs?.[recipeId]!==approval.gkCalculationInputSha256 ||
      gkBindings.calculationEvidence?.[recipeId]!==approval.gkCalculationEvidenceSha256)
    return fail("GK recipe/input/evidence binding changed since review");
  // Full GI/GK calculation and translation semantic audits still run separately in CI.
  // This gate requires an explicit reviewed disposition, never creates one.
  return {authorized:true,reason:"REVIEWED_SOURCE_AND_EXACT_NUTRITION_AND_GK_BINDINGS"};
}

export function assertF25SourceReleaseAuthorized(recipeId: string): void {
  const decision = sourceReleaseGateDecision(recipeId);
  if (!decision.authorized) throw Error(decision.reason);
}

export function f25SourceGatePreflight(gate: F25SourceGate = f25SourceReleaseGate, root: string = repoRoot) {
  assertUniqueGate(gate);
  const rows = gate.sources.map(record=>({
    recipe_id:record.recipe_id,
    ...sourceReleaseGateDecision(record.recipe_id,gate,root),
    risk:record.source_risk,
    quarantine:isPublicRecipeQuarantined(record.recipe_id),
    hasNutritionCalculationAtBaseline:record.nutrition_input_at_baseline!=="missing",
  }));
  return {total:rows.length,authorized:rows.filter(x=>x.authorized).length,
    held:rows.filter(x=>!x.authorized).length,rows,
    statement:"Preflight is a release gate only; approval also requires current semantic, safety and GK CI. Never auto-publish."};
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(f25SourceGatePreflight(),null,2)+"\n");
}
