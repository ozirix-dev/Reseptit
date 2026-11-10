import { createHash } from "node:crypto";

/** Exact-SHA public FI corrections for three C20 source-HOLDs.
 * This overlay NEVER changes canonical source files, GI/GK source approval, or
 * ingredient/nutrition evidence. It fails closed on any unexpected source edit.
 */
const patches: Readonly<Record<string, { sourceSha256: string; edits: readonly (readonly [string, string])[] }>> = {
  "reseptit/aamupalat/malesialainen-nasi-lemak-aamiaisella.md": {
    sourceSha256: "a6e430aabed3fd11242235a2f89ff564d8d29934f6f9bc1a10161fa5270216fb",
    edits: [[
      "cooking_method:\n- paistaminen\n",
      "cooking_method:\n- keittäminen\n"
    ]]
  },
  "reseptit/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md": {
    sourceSha256: "c9a7763e156e016e1516f14d0a64ae4e94f17e30baaf97482c01b73f828e4395",
    edits: [
      ["cooking_method:\n- paistaminen\n", "cooking_method:\n- keittäminen\n"],
      [
        "1. Kypsennä 100 g kuivaa valkoista jasmiiniriisiä 200 g kookosmaidossa miedolla lämmöllä pakkauksen kypsennysaikaa noudattaen.",
        "1. Kypsennä 100 g kuivaa valkoista jasmiiniriisiä 200 g kookosmaidossa kannellisessa kattilassa miedolla lämmöllä pakkauksen kypsennysaikaa noudattaen. Jos riisi uhkaa kuivua ennen kuin jyvät ovat kypsiä, lisää tarvittaessa vain pieni määrä kuumaa vettä kerrallaan. Älä lisää öljyä tai muita ravintoaineita."
      ]
    ]
  },
  "reseptit/aamupalat/kiinalainen-kevatsipulipannukakku.md": {
    sourceSha256: "df3a1f87eb240b5fcb0bcaca831c708734d1f58e019517e031d629dc5ba87886",
    edits: [["time_total_min: 25\n", "time_total_min: 35\n"]]
  }
};

export const c20FiDisplayPaths = Object.freeze(Object.keys(patches));

export function projectC20FiDisplay(relativePath: string, input: string): string {
  const patch = patches[relativePath];
  if (!patch) return input;
  const raw = input.replaceAll("\r\n", "\n");
  const actual = createHash("sha256").update(raw).digest("hex");
  if (actual !== patch.sourceSha256) throw Error("C20_FI_DISPLAY_SOURCE_STALE: " + relativePath);
  let result = raw;
  for (const [oldText, newText] of patch.edits) {
    if (oldText === newText || result.split(oldText).length !== 2) throw Error("C20_FI_DISPLAY_ANCHOR_AMBIGUOUS: " + relativePath);
    result = result.replace(oldText, newText);
  }
  if (result === raw) throw Error("C20_FI_DISPLAY_EMPTY: " + relativePath);
  return result;
}
