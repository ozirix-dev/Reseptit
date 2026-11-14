import { createHash } from "node:crypto";

export const coconutBananaSourcePath = "reseptit/aamupalat/malesialainen-kookos-banaanikulho.md";
export const coconutBananaRecipeId = "malesialainen-kookos-banaanikulho";
const currentSourceSha256 = "67ad7a365e91ed5c00be783fb41e5c26ceea7f5bf314324b4307958e0ff72be7";
const historicalStructure = "cooking_method:\n  - \"paistaminen\"\ningredients:\n  - amount: 1\n    unit: \"kpl\"\n    item: \"banaani\"\n  - amount: 200\n    unit: \"ml\"\n    item: \"kookosmaito\"\n  - amount: 150\n    unit: \"g\"\n    item: \"palmusokeri\"\n  - amount: 100\n    unit: \"g\"\n    item: \"tapioka\"\n  - amount: null\n    unit: \"\"\n    item: \"suolaa maun mukaan\"\n";

// Recover the historical ingredient and method fingerprint for the audit.
// The new version has no reviewed GI/GK estimate.
export function coconutBananaHistoricalBindingText(markdown: string): string {
  const normalized = markdown.replaceAll("\r\n", "\n");
  if (createHash("sha256").update(normalized).digest("hex") !== currentSourceSha256) return markdown;
  const start = normalized.indexOf("cooking_method:");
  const end = normalized.indexOf("servings:");
  return normalized.slice(0, start) + historicalStructure + normalized.slice(end);
}
