import type { GkOnlyVariant } from "./gk-only-types";

/**
 * Public presentation-only correction for shared historical GI group-mean notes.
 * Keep sealed variant sources, approval packets and calculated GK untouched.
 */
const sourceNoteOverrides: Record<string, string> = {
  "Category mean, not a measured GI for the recipe's cream cheese.":
    "Low-confidence dairy-product group mean; not a measured GI for this recipe's specific dairy ingredient or preparation.",
  "fruit category mean; used only as a broad tamarind-paste analogue":
    "Low-confidence fruit-product group mean; not a measured GI for this recipe's specific fruit or preparation.",
  "Low-confidence category mean for peanuts.":
    "Low-confidence nut-group mean from few observations; not measured for this recipe's nut ingredient or flour preparation.",
};

type Source = GkOnlyVariant["sources"][number];

export function publicGkOnlySourceNote(source: Pick<Source, "kind" | "note">): string {
  if (source.kind !== "HUMAN_GI" && source.kind !== "PUBLISHED_CODING") return source.note;
  return sourceNoteOverrides[source.note] ?? source.note;
}
