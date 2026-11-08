/** Public copy may be reused by many recipes; never imply the group proxy
 * was measured for a specific ingredient from a different recipe. This module
 * changes explanation only, not the underlying GI register or application. */
const genericNotes: Record<string, string> = {
  "dairy-category-mean-gi-35":
    "Low-confidence dairy-product group mean; not a measured GI for this recipe's specific dairy ingredient or preparation.",
  "fruit-category-mean-gi-51":
    "Low-confidence fruit-product group mean; not a measured GI for this recipe's specific fruit or preparation.",
  "nuts-category-mean-gi-22":
    "Low-confidence nut-group mean from few observations; not measured for this recipe's nut ingredient or flour preparation.",
};

export function publicGiSourceNote(record: { id: string; note?: string; source: { qualityEvidence: string } }): string {
  return genericNotes[record.id] ?? record.note ?? record.source.qualityEvidence;
}
