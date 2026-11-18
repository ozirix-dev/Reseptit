import { createHash } from "node:crypto";
import { z } from "zod";
import { parseMarkdown } from "../src/content/markdown";
import type { GlycemicLoadRecipeInput } from "./glycemic-load-model";

export const gkResearchDecisionPath = "docs/nutrition/glycemic-research-decisions.json";
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const hash = z.string().regex(/^[0-9a-f]{64}$/);
const text = z.string().trim().min(1);
const evidence = z.strictObject({
  path: z.string().regex(/^docs\/(?:nutrition|research)\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:md|json|txt)$/),
  sha256: hash,
  locator: text,
});
const decision = z.strictObject({
  canonicalRecipeId: id,
  sourceRecipeId: id,
  scope: z.literal("original"),
  outcome: z.literal("NO_RELIABLE_GK"),
  recipeSha256: hash,
  calculationInputSha256: hash.nullable(),
  calculationEvidenceSha256: hash.nullable(),
  contextSha256: hash,
  reviewedAt: z.iso.date(),
  reason: text,
  evidence: z.array(evidence).min(1),
  reopen: z.strictObject({
    kind: z.enum(["applicable-gi", "applicable-composition", "documented-review"]),
    reason: text,
    evidence,
  }).optional(),
});

export const gkResearchRegistry = z.strictObject({
  schemaVersion: z.literal(1),
  decisions: z.array(decision).refine(rows => new Set(rows.map(row => row.canonicalRecipeId)).size === rows.length,
    "One current research decision per canonical original"),
});

export type GkResearchDecision = z.infer<typeof decision>;
type Evidence = z.infer<typeof evidence>;

export function researchTextHash(text: string): string {
  return createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");
}

const normalize = (text: string) => text.normalize("NFC").replace(/\s+/g, " ").trim();

export function gkResearchRecipeBinding(markdown: string) {
  const parsed = parseMarkdown(markdown);
  if (!parsed || parsed.data.language !== "fi" || !Number.isInteger(parsed.data.servings) ||
    !Array.isArray(parsed.data.ingredients)) {
    throw Error("GK research requires a Finnish original with structured ingredients and integer servings");
  }
  const [intro, ...sections] = parsed.content.split(/^##[ \t]+/m);
  const isDescription = (section: string) => section.split("\n", 1)[0].trim().toLowerCase() === "kuvaus";
  const recipeSections = sections.filter(section => !isDescription(section));
  const ingredients = parsed.data.ingredients.map(ingredient => {
    if (!ingredient || typeof ingredient !== "object" || Array.isArray(ingredient)) {
      throw Error("Invalid structured ingredient in GK research");
    }
    return Object.fromEntries(Object.entries(ingredient).sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([key, value]) => [key, typeof value === "string" ? normalize(value) : value]));
  });
  if (!recipeSections.some(section => /^Valmistus\s*$/im.test(section.split("\n", 1)[0]))) {
    throw Error("GK research requires a classified preparation section");
  }
  return {
    recipeSha256: researchTextHash(JSON.stringify({
      servings: parsed.data.servings,
      ingredients,
      cookingMethod: parsed.data.cooking_method ?? null,
      sections: recipeSections.map(normalize),
    })),
    narrativeSha256: researchTextHash(JSON.stringify([
      normalize(intro.replace(/^#[ \t]+[^\r\n]+$/m, "")),
      ...sections.filter(isDescription).map(normalize),
    ])),
  };
}

export function gkResearchCalculationContextHash(input: GlycemicLoadRecipeInput): string {
  return researchTextHash(JSON.stringify(input.ingredients.map(row => [
    row.massEvidence, row.giMatchEvidence, row.excludedReason, row.availableCarbohydratePer100gRange?.evidence,
    row.upperBoundEvidence, row.negligibleAssumption,
  ].map(value => normalize(value ?? "")))));
}

export function gkResearchDisposition(
  current: {
    sourceRecipeId: string;
    recipeSha256: string | null;
    calculationInputSha256: string | null;
    calculationEvidenceSha256: string | null;
    contextSha256: string | null;
    hasPublicEstimate: boolean;
    ambiguous: boolean;
    bindingConflict: boolean;
    priority: boolean;
  },
  decision: GkResearchDecision | undefined,
  evidenceMatches: (evidence: Evidence) => boolean,
) {
  if (current.priority) return { status: "priority", reason: "P0/P1 takes precedence" } as const;
  if (current.ambiguous) return { status: "review", reason: "Unclear original recipe binding" } as const;
  const conflict = { status: "review", reason: "Conflicting published calculation bindings" } as const;
  if (current.hasPublicEstimate) {
    return current.bindingConflict ? conflict : { status: "approved", reason: "Existing public original estimate" } as const;
  }
  if (!current.recipeSha256 || !current.contextSha256) return { status: "review", reason: "Missing recipe/preparation binding" } as const;
  if (!decision) return current.bindingConflict ? conflict : { status: "new", reason: "No current research decision" } as const;
  if (decision.sourceRecipeId !== current.sourceRecipeId || decision.recipeSha256 !== current.recipeSha256) {
    return { status: "reopened", reason: "Original recipe or preparation changed" } as const;
  }
  if (decision.calculationInputSha256 !== current.calculationInputSha256 ||
    decision.calculationEvidenceSha256 !== current.calculationEvidenceSha256) {
    return { status: "reopened", reason: "Recipe calculation inputs or bound evidence changed" } as const;
  }
  if (decision.reopen) {
    const event = decision.reopen;
    const seen = decision.evidence.some(source => source.path === event.evidence.path && source.sha256 === event.evidence.sha256);
    return !seen && evidenceMatches(event.evidence)
      ? { status: "reopened", reason: event.reason } as const
      : { status: "review", reason: "Reopening evidence is unverified or already reviewed" } as const;
  }
  if (current.bindingConflict) return conflict;
  if (current.contextSha256 !== decision.contextSha256) {
    return { status: "review", reason: "Serving description or source rationale changed" } as const;
  }
  if (!decision.evidence.every(evidenceMatches)) return { status: "review", reason: "Reviewed evidence cannot be verified" } as const;
  return { status: "skip", reason: decision.reason } as const;
}
