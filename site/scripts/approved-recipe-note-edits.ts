import { restoreRecipeAuditSnapshot } from "./restore-recipe-audit-snapshot";
import { createHash } from "node:crypto";

import { approvedNoteEdits, editorialSnapshots, englishPublicationSources } from "./approved-recipe-snapshot-records";
export { reviewedRecipesWithHistoricalGk } from "./approved-recipe-snapshot-records";

export function approvedRecipeSnapshotRecord(file: string) {
  return {
    editorial: editorialSnapshots[file] ?? null,
    note: approvedNoteEdits[file] ?? null,
    englishPublicationSource: englishPublicationSources.has(file),
  };
}

export function recipeTextForApprovedSnapshot(file: string, text: string, purpose: "historical-comparison" | "original-gk" = "historical-comparison"): string {
  text = restoreRecipeAuditSnapshot(file, text);
  const editorial = editorialSnapshots[file];
  if (editorial && createHash("sha256").update(text).digest("hex") === editorial.currentSha256) {
    if (purpose === "original-gk" && editorial.historicalGkText) return editorial.historicalGkText;
    const lines = text.split("\n");
    for (const [start, count, historical] of editorial.inverseEdits) {
      const restored = historical ? historical.slice(0, -1).split("\n") : [];
      lines.splice(start, count, ...restored);
    }
    return lines.join("\n");
  }
  if (
    file === "reseptit/jalkiruoat/keto-mutakakku.md" ||
    file === "reseptit/jalkiruoat/keto-suklaakeksit.md" ||
    file === "reseptit/jalkiruoat/meheva-suklaakakku.md"
  ) {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv, th]\ntranslation_status: {en: published, sv: published, th: published}\n",
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
    );
  }
  if (file === "reseptit/jalkiruoat/keto-suklaakeksit.md" || file === "reseptit/jalkiruoat/meheva-suklaakakku.md") {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv]\ntranslation_status: {en: published, sv: published}\n",
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
    );
  }
  if (englishPublicationSources.has(file)) {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en]\ntranslation_status: {en: published}\n",
      "\nstatus: published\n",
    );
  }
  const edit = approvedNoteEdits[file];
  if (!edit) return text;
  const [historical, current] = edit;
  return text.split("\n").map(line => line === current ? historical : line).join("\n");
}
