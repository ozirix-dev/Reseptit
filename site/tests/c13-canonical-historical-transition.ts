import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

/** C13: only 5 specifically reviewed FI method+note migrations, never a general GK waiver.
 * The original historical recipe is reconstructed solely inside frozen GK tests.
 * Changing any approved source bytes rejects this exceptional transition.
 */
const historicalMain = "9e6a00c33b1ee2c1cf0de2f086b257da8d3c8f50";
const approvedBlobById = {
  "intialainen-rava-uttapam": "65998ff2f37885f556fe28b82c6598fd70d17371",
  "lahi-ita-ful-medames": "e888884070fd5b26292d7f0298f28332b779f22e",
  "meksikolainen-aamiais-tacot-mustapavuilla": "8b0c1cfeb7a079e72cc93bce68e2767e4f85d829",
  "valimerellinen-menemen-fetalla": "84773d28d400fd8dee6226f245e32476913485cf",
  "valimerellinen-pinaatti-fetashakshuka": "61e4e39e20e245a295988c0c4c33fc10ab8d1f61",
} as const;
export const c13CanonicalHistoryPaths = Object.freeze(
  Object.keys(approvedBlobById).map(id => `reseptit/aamupalat/${id}.md`)
);
export const reviewedRavaPath = "reseptit/aamupalat/intialainen-rava-uttapam.md";
const reviewedRavaBlob = "ddd0cef8cedd901297677672e0d6287a7e45b4ec";
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
  const liveBlob = blobSha(live);
  if (file === reviewedRavaPath && liveBlob === reviewedRavaBlob) {
    const previous = lf(execFileSync("git", ["cat-file", "blob", approvedBlobById[id]], {cwd: root, encoding: "utf8"}));
    return originalForC13CanonicalHistory(root, file, previous);
  }
  if (id === "valimerellinen-pinaatti-fetashakshuka" && liveBlob === "3e2882523e98b4ab681c97d8a95a5e6c59f5a7bb") {
    const previous = lf(execFileSync("git", ["cat-file", "blob", approvedBlobById[id]], {cwd: root, encoding: "utf8"}));
    assert.equal(live.split(marker)[0], previous.split(marker)[0], file + ": changed protected recipe inputs");
    return originalForC13CanonicalHistory(root, file, previous);
  }
  assert.equal(liveBlob, approvedBlobById[id], file + ": unreviewed C13 source mutation");
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
