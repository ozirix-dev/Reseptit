import { createHash } from "node:crypto";

/** Two source-Git-blob-locked display-only FI preparation corrections.
 * Never rewrite canonical FI history or ingredient/GI/GK approvals.
 */
const recipes = {
  "reseptit/aamupalat/japanilainen-soba-aamiaiskeitto.md": {
    "sourceSha": "1dfb8be5bfdc6e09080610bc9191505f9175cf25",
    "old": "## Valmistus\n\n1. Kuumenna kattilassa öljy tai liemi. Lisää aromit ja hitaammin kypsyvät ainekset; paista tai hauduta muutama minuutti.\n2. Kaada kattilaan liemi ja keitä miedosti, kunnes pääraaka-aineet ovat kypsiä.\n3. Lisää nuudelit, lehtivihannekset tai muut nopeasti kypsyvät ainekset niiden kypsymisajan mukaan.\n4. Kypsennä soba erikseen ja tarjoa dashi-liemessä pinaatin ja uppomunan kanssa.",
    "revised": "## Valmistus\n\n1. Pese luettelon yksi pinaattinippu ja poista huonot lehdet. Kuumenna kattilassa 200 ml dashi-lientä ja erikseen lueteltu 700 ml kasvis- tai kanalientä yhdessä kiehuviksi. Näitä kahta liemimäärää ei korvata vedellä tai öljyllä.\n2. Keitä 100 g soba-nuudeleita toisessa kattilassa vedessä pakkauksen ajan mukaan, kunnes ne ovat kypsiä mutta eivät pehmeäksi hajonneita. Valuta ja jaa nuudelit kahteen annoskulhoon. Nuudelien keitinvesi ei ole erillinen ravintoaines.\n3. Laske liemikattilan lämpöä niin, että pinta poreilee hiljaa. Riko kananmunat yksitellen kuppiin ja valuta ne varovasti liemeen. Kypsennä, kunnes valkuaiset ovat kauttaaltaan hyytyneet; täysin kypsästä keltuaisesta huolehditaan tarvittaessa jatkamalla kypsennystä. Nosta kananmunat reikäkauhalla sivuun.\n4. Lisää pesty pinaatti kuumaan liemeen ja kuumenna se pehmeäksi. Jaa kaikki pinaatti ja koko 900 ml alkuperäistä lientä kahteen kulhoon nuudelien päälle. Lisää kummankin kulhon pinnalle yksi kypsennetty kananmuna ja vain luettelon suolaa tarvittaessa. Älä lisää öljyä, tofua, merilevää tai muita listaamattomia aineita.\n\n## Muistiinpanot\n\nSoba keitetään erikseen ja tarjotaan kahden liemikomponentin yhteismäärässä. Pinaatti on alkuperäisluettelossa vain kappaleena ilman syötävää grammapainoa; tätä näyttökorjausta ei pidä tulkita uudeksi ravinto- tai GK-hyväksynnäksi."
  },
} as const;
export const material21MethodPaths = Object.freeze(Object.keys(recipes));

export function projectMaterial21MethodsFi(relativePath: string, input: string): string {
  if (!Object.hasOwn(recipes, relativePath)) return input;
  const binding = recipes[relativePath as keyof typeof recipes];
  const raw = input.replaceAll("\r\n", "\n");
  const actual = createHash("sha1").update("blob " + Buffer.byteLength(raw, "utf8") + "\0").update(raw).digest("hex");
  if (actual !== binding.sourceSha) throw new Error("B21_METHOD_SOURCE_STALE: " + relativePath);
  if (raw.split(binding.old).length !== 2) throw new Error("B21_METHOD_ANCHOR_AMBIGUOUS: " + relativePath);
  return raw.replace(binding.old, binding.revised);
}
