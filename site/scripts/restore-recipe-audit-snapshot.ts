import { createHash } from "node:crypto";
import transitions from "../../docs/nutrition/recipe-correctness-history.json";

type TextTransition = {
  currentSha256: string;
  historicalSha256: string;
  inverseEdits: readonly (readonly [start: number, remove: number, previous: string])[];
};

const reviewedTransitions = transitions as unknown as Readonly<Record<string, TextTransition>>;
const sha256 = (text: string): string => createHash("sha256").update(text).digest("hex");

/** Reconstruct the pre-audit recipe only for comparisons against historical seals. */
export function restoreRecipeAuditSnapshot(file: string, text: string): string {
  if (!Object.hasOwn(reviewedTransitions, file)) return text;
  const transition = reviewedTransitions[file];
  const current = text.replaceAll("\r\n", "\n");
  // The audited base and later unreviewed edits follow their normal paths.
  if (sha256(current) !== transition.currentSha256) return text;

  const lines = current.split("\n");
  for (const [start, count, previous] of transition.inverseEdits) {
    const replacement = previous ? previous.slice(0, -1).split("\n") : [];
    lines.splice(start, count, ...replacement);
  }
  const historical = lines.join("\n");
  if (sha256(historical) !== transition.historicalSha256) {
    throw new Error("Recipe audit historical snapshot mismatch: " + file);
  }
  return historical;
}
