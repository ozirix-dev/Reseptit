import { createHash } from "node:crypto";

/** Exact source-blob-locked preparation-only corrections. Canonical FI files,
 * source GI/GK seals, and all four nutrition fields must stay unchanged. */
const correction = {
  "reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md": { sourceGitBlobSha1: "c9651cac25fa6fd639ad08892cdd2f3aa5355978", oldMethod: "## Valmistus\n\n1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Levitä labneh kulhoon, pyöräytä päälle oliiviöljyä ja lisää za’ataria sekä kurkkua.", newMethod: "## Valmistus\n\n1. Annostele 100 g valmista labnehia ja tarkista, että tuote on tarkoitettu syötäväksi sellaisenaan. Tätä kulhoa ei paisteta eikä lämmitetä.\n2. Viipaloi tai kuutioi luettelon yksi kurkku. Valuta 150 g syötäväksi tarkoitettuja oliiveja ja poista mahdolliset kivet ennen tarjoamista.\n3. Jaa labneh, kurkku ja oliivit kahteen kylmään kulhoon tasaisesti. Ripottele päälle yhteensä 1 tl za'ataria ja käytä luettelon suolaa vain tarvittaessa.\n4. Tarjoa heti. Älä lisää oliiviöljyä, papuja, tofua, kananmunaa, lämmintä pohjaa tai erillistä kastiketta, joita tämän punnitun version ainesluettelo ei sisällä.\n\n## Muistiinpanot\n\nAiemman ohjeen puuttuva oliiviöljy ja väärän ruokalajin yleiset valmistusvaiheet poistettu. Tämä on kylmäannos; ravintoarvoja tai GK-arvoa ei ole tässä uudelleen laskettu.", oldMeta: "cooking_method:\n  - \"paistaminen\"", newMeta: "cooking_method:\n  - \"kylmävalmistus\"", },
} as const;

export const material21FiPaths = Object.freeze(Object.keys(correction));

export function projectMaterial21FiDisplay(relativePath: string, input: string): string {
  if (!Object.hasOwn(correction, relativePath)) return input;
  const reviewed = correction[relativePath as keyof typeof correction];
  const raw = input.replaceAll("\r\n", "\n");
  const gitBlobSha1 = createHash("sha1").update("blob " + Buffer.byteLength(raw, "utf8") + "\0").update(raw).digest("hex");
  if (gitBlobSha1 !== reviewed.sourceGitBlobSha1) throw new Error("MATERIAL21_FI_SOURCE_STALE: " + relativePath);
  const edits: Array<[string, string]> = [[reviewed.oldMethod, reviewed.newMethod]];
  if ("oldMeta" in reviewed && "newMeta" in reviewed) edits.push([reviewed.oldMeta, reviewed.newMeta]);
  let result = raw;
  for (const [before, after] of edits) {
    if (result.split(before).length !== 2) throw new Error("MATERIAL21_FI_ANCHOR_AMBIGUOUS: " + relativePath);
    result = result.replace(before, after);
  }
  return result;
}
