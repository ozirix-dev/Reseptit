import { createHash } from "node:crypto";
import type { FoodRecord } from "./nutrition-model";

// The historical registry retains both Fineli 11557 records. Calculations and
// evidence hashes previously selected the last one; public citations did not.
const legacyLemonId = "fineli-11557-2026-10-24";
const legacyLemonSha256 = "aa00ef420ecb63f32044112e2d8be0326863561200273adef982c1b47e73fb67";
const canonicalLemonSha256 = "752abe09c78b5b38d82a42c71c3a0d17247deb80fbdb1f80a770c0353d621834";

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

const recordHash = (record: FoodRecord) => createHash("sha256").update(stableJson(record)).digest("hex");

export function canonicalGkFoodRecords(records: readonly FoodRecord[]): FoodRecord[] {
  const byId = new Map<string, FoodRecord>();
  for (const record of records) {
    const previous = byId.get(record.id);
    if (previous && !(record.id === legacyLemonId &&
      recordHash(previous) === legacyLemonSha256 && recordHash(record) === canonicalLemonSha256)) {
      throw new Error(`Unreviewed duplicate GK food record: ${record.id}`);
    }
    byId.set(record.id, record);
  }
  return [...byId.values()];
}
