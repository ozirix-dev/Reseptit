import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

/** C13: only 10 specifically reviewed FI method+note migrations, never a general GK waiver.
 * The original historical recipe is reconstructed solely inside frozen GK tests.
 * Changing any approved source bytes rejects this exceptional transition.
 */
const historicalMain = "9e6a00c33b1ee2c1cf0de2f086b257da8d3c8f50";
const approvedBlobById = {
  "indialainen-poha-maapahkinoilla": "a8b504d12ef75dc62e65d5d59b8acca7b783d020",
  "malesialainen-kaya-paahtoleipa": "0e91a495e41ce5a52a5f5ccec4365be7b11f62fd",
  "valimerellinen-halloumi-tomaattileipa": "d9fd81fe8863f7957dd8c673738c223956faf493",
  "intialainen-rava-uttapam": "65998ff2f37885f556fe28b82c6598fd70d17371",
  "lahi-ita-ful-medames": "e888884070fd5b26292d7f0298f28332b779f22e",
  "meksikolainen-aamiais-tacot-mustapavuilla": "8b0c1cfeb7a079e72cc93bce68e2767e4f85d829",
  "valimerellinen-menemen-fetalla": "84773d28d400fd8dee6226f245e32476913485cf",
  "valimerellinen-pinaatti-fetashakshuka": "61e4e39e20e245a295988c0c4c33fc10ab8d1f61",
  "vietnamilainen-pho-ga-aamuksi": "6f916a0b2675cd1f438279fe56843d8c0f2ac642",
  "intialainen-mannasuurimoupma": "3c92ca6b2e7c74fc22b476ab07719a903a618e50"
} as const;
export const c13CanonicalHistoryPaths = Object.freeze(
  Object.keys(approvedBlobById).map(id => `reseptit/aamupalat/${id}.md`)
);
const approvedPaths = new Set<string>(c13CanonicalHistoryPaths);
const lf = (s: string) => s.replaceAll("\r\n","\n");
const marker = "\n## Valmistus\n";
const original = (root: string, file: string) =>
  lf(execFileSync("git", ["show", `${historicalMain}:${file}`], {cwd: root, encoding: "utf8"}));
const blobSha = (s: string) =>
  createHash("sha1").update(`blob ${Buffer.byteLength(s,"utf8")}\0`).update(s).digest("hex");

export function originalForC13CanonicalHistory(root: string, file: string, text: string): string {
  if (!approvedPaths.has(file)) return text;
  const live = lf(text);
  const id = file.slice("reseptit/aamupalat/".length, -3) as keyof typeof approvedBlobById;
  assert.equal(blobSha(live), approvedBlobById[id], file + ": unreviewed C13 source mutation");
  const frozen = original(root, file);
  const cut = live.indexOf(marker), originalCut = frozen.indexOf(marker);
  assert(cut >= 0 && originalCut >= 0, file + ": missing reviewed preparation");
  assert.equal(live.slice(0,cut), frozen.slice(0,originalCut),
    file + ": C13 changed ingredients, metadata, introduction or other protected content");
  assert.equal((live.match(/\n## Muistiinpanot\n/g)??[]).length,1,
    file + ": expected exactly one reviewed note section");
  assert.equal((frozen.match(/\n## Muistiinpanot\n/g)??[]).length,0,
    file + ": original note section needs separate review");
  return frozen;
}
