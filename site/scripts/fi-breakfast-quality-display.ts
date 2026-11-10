import { createHash } from "node:crypto";

/** Two SHA-pinned FI public-presentation corrections.
 * Canonical FI files, published nutrient/GK bindings and ingredient quantities
 * must remain byte-identical. Unexpected raw edits or ambiguous anchors fail closed.
 */
const changes: Readonly<Record<string, {
  sourceSha256: string;
  edits: readonly (readonly [string, string])[];
}>> = {
  "reseptit/aamupalat/yrttituorejuusto-kinkkurullat.md": {
    sourceSha256: "e5649f6b71fb0131def0f4332f1522e4c96c4e90af5abeed947df8681ec25363",
    edits: [
      ["cooking_method:\n- kypsentäminen\n", "cooking_method:\n- kylmävalmistus\n"],
      [
        "3. Tarjoa kaikki rullat, kasvikset ja 40 g salaatinlehtiä kahtena annoksena.",
        "3. Tarjoa kaikki rullat, kasvikset ja 40 g salaatinlehtiä neljänä annoksena."
      ]
    ]
  },
  "reseptit/aamupalat/malesialainen-mee-goreng-aamunuudeleilla.md": {
    sourceSha256: "0fe3c4d4d2a129da4bc8fda84df1c9b96c501f1fdd5ee6be2733edc9f69e515d",
    edits: [[
      'main_ingredient:\n  - "munanuudeli"\n',
      'main_ingredient:\n  - "vehnänuudeli"\n'
    ]]
  }
};
export const breakfastFiQualityPaths = Object.freeze(Object.keys(changes));

export function projectBreakfastFiQualityDisplay(relativePath: string, input: string): string {
  const patch = changes[relativePath];
  if (!patch) return input;
  const raw = input.replaceAll("\r\n", "\n");
  const sha = createHash("sha256").update(raw).digest("hex");
  if (sha !== patch.sourceSha256) throw Error("FI_BREAKFAST_SOURCE_STALE: " + relativePath);
  let out = raw;
  for (const [from, to] of patch.edits) {
    if (from === to || out.split(from).length !== 2) throw Error("FI_BREAKFAST_ANCHOR_AMBIGUOUS: " + relativePath);
    out = out.replace(from, to);
  }
  return out;
}
