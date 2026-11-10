import { createHash } from "node:crypto";

/**
 * D30 whole-milk editorial display only. FI canonical raw and nutrition/GI/GK
 * evidence remain unchanged; this is not a new source or nutrient approval.
 * Source is tied to the precise raw UTF-8 SHA256 and a unique textual anchor.
 */
export const mintMilkFiPath = "reseptit/aamupalat/pohjoisafrikkalainen-minttutee-kaurapuuro.md";
export const mintMilkRawSha256 = "117727dfb2aeb61745b21ab1f38916b4c3c6d266b2eaaec5c0979cb9309fb6a9";

export function projectMintWholeMilkFiDisplay(relativePath: string, input: string): string {
  if (relativePath !== mintMilkFiPath) return input;
  const raw = input.replaceAll("\r\n", "\n");
  if (createHash("sha256").update(raw).digest("hex") !== mintMilkRawSha256) {
    throw Error("D30_MINT_MILK_SOURCE_STALE");
  }
  const before = "- amount: 200\n  unit: g\n  item: maito\n";
  const after = "- amount: 200\n  unit: g\n  item: täysmaito\n";
  if (raw.split(before).length !== 2) throw Error("D30_MINT_MILK_ANCHOR_AMBIGUOUS");
  return raw.replace(before, after);
}
