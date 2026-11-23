import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Calculation, FoodRecord } from "./nutrition-model";

export const nutritionKeys = [
  "carbs_net_per_serving_g",
  "carbs_total_per_serving_g",
  "protein_per_serving_g",
  "fat_per_serving_g",
] as const;

const approvalSchema = z.strictObject({
  evidenceSha256: z.string().regex(/^[a-f0-9]{64}$/),
  fields: z.array(z.enum(nutritionKeys)).min(1).max(nutritionKeys.length - 1)
    .refine(fields => new Set(fields).size === fields.length),
});

export function nutritionCalculationFingerprint(evidence: Calculation): string {
  return createHash("sha256").update(JSON.stringify(evidence)).digest("hex");
}

export type NutritionBatchRecipe = { recipeId?: string; partialNutrition?: unknown };
export type NutritionFieldApproval = {
  scope: unknown;
  verifiedAvailableRows: ReadonlySet<number>;
};

const nativeCarbohydrateSources = {
  fineli: {
    filename: "fineli-release-20-reference.json",
    id: /^fineli-(\d+)(?:-|$)/,
    host: "fineli.fi",
    available: (row: NativeFood) => row.per100g?.available_carbohydrate_g_per_100g,
  },
  afcd: {
    filename: "afcd-release-3-reference.json",
    id: /^afcd-(F\d+)(?:-|$)/,
    host: "www.foodstandards.gov.au",
    available: (row: NativeFood) => row.available_carbohydrate_without_sugar_alcohols_g_per_100g,
  },
} as const;

type NativeFood = {
  source_id: string;
  per100g?: { available_carbohydrate_g_per_100g?: number | null };
  available_carbohydrate_without_sugar_alcohols_g_per_100g?: number | null;
};

function belongsToHost(record: FoodRecord, host: string): boolean {
  return record.sourceUrl.startsWith("https://" + host + "/");
}

export function parseNutritionFieldScope(scope: unknown) {
  return approvalSchema.safeParse(scope);
}

export async function resolveNutritionFieldApproval(
  root: string, evidence: Calculation, scope: unknown,
): Promise<NutritionFieldApproval | undefined> {
  if (scope === undefined) return undefined;
  const verifiedAvailableRows = new Set<number>();
  const parsed = parseNutritionFieldScope(scope);
  if (parsed.success && parsed.data.evidenceSha256 === nutritionCalculationFingerprint(evidence)
      && parsed.data.fields.includes("carbs_net_per_serving_g")) {
    for (const { filename, id, host, available } of Object.values(nativeCarbohydrateSources)) {
      const candidates = evidence.ingredients.flatMap(({ record, excludedReason }, index) => {
        if (!record || excludedReason || record.carbohydrateDefinition !== "EU_AVAILABLE" || !belongsToHost(record, host)) return [];
        const sourceId = id.exec(record.id)?.[1];
        return sourceId ? [{ index, sourceId, value: record.per100g.carbohydrate }] : [];
      });
      if (!candidates.length) continue;
      const { foods } = JSON.parse(await readFile(path.join(root, "docs/nutrition", filename), "utf8")) as { foods: NativeFood[] };
      const byId = new Map(foods.map(row => [row.source_id, row]));
      for (const { index, sourceId, value } of candidates) {
        const original = byId.get(sourceId);
        if (original && typeof value === "number" && value === available(original)) verifiedAvailableRows.add(index);
      }
    }
  }
  return { scope, verifiedAvailableRows };
}

export async function readNutritionFieldApproval(root: string, evidence: Calculation) {
  if (!/^batch-\d+$/.test(evidence.batchId ?? "")) return undefined;
  const file = path.join(root, "docs/nutrition/batches", evidence.batchId + ".json");
  const raw = await readFile(file, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (raw === null) return undefined;
  const batch = JSON.parse(raw) as { batchId?: string; recipes?: NutritionBatchRecipe[] };
  if (batch.batchId !== evidence.batchId || !Array.isArray(batch.recipes)) throw Error("Invalid nutrition batch: " + evidence.batchId);
  const entries = batch.recipes.filter(row => row.recipeId === evidence.recipeId);
  if (entries.length > 1 && entries.some(row => row.partialNutrition !== undefined)) {
    throw Error("Duplicate partial nutrition batch entry: " + evidence.recipeId);
  }
  return resolveNutritionFieldApproval(root, evidence, entries[0]?.partialNutrition);
}
