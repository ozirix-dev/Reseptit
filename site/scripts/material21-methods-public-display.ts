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
  "reseptit/aamupalat/kiinalainen-jianbing-munaletty.md": {
    "sourceSha": "5866a69183587d0d75ce5e4794fce27814793b11",
    "old": "## Valmistus\n\n1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.\n2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.\n3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.\n4. Sekoita vehnäjauho ja vesi tasaiseksi taikinaksi. Paista ohut lettu öljytyllä pannulla. Lisää kananmuna ja kevätsipuli, kypsennä, käännä ja sivele pinnalle soijapaputahna. Taita ja tarjoa seesaminsiementen kanssa.",
    "revised": "## Valmistus\n\n1. Sekoita kulhossa 100 g vehnäjauhoa, ripaus ainesluettelon suolaa ja noin 180 ml kylmää vettä vähitellen tasaiseksi, ohuesti kaadettavaksi taikinaksi. Vatkaa kokkareet pois. Anna levätä peitettynä noin 10 minuuttia. Taikinavesi ei ole energiaravintoaine eikä muuta listattujen ruoka-aineiden annosmääriä.\n2. Hienonna luettelon 2 rkl kevätsipulia ja mittaa 8 g seesaminsiemeniä. Kuumenna leveä tarttumaton pannu keskilämmölle. Käytä koko kahden letun paistoon yhteensä vain luettelon 1 rkl neutraalia paistoöljyä. Kaada puolet taikinasta pannulle ja levitä nopeasti ohueksi, noin 20–25 cm levyksi.\n3. Riko ensimmäinen kananmuna vielä kostean letun päälle ja levitä se varovasti tasaiseksi. Ripottele päälle puolet kevätsipulista ja seesamista. Kun reunat alkavat kuivua ja pohja irtoaa pannusta, käännä leveällä lastalla. Jatka, kunnes muna on kypsä ja taikinaan ei jää raakaa keskustaa.\n4. Sivele kypsälle letulle puolet koko reseptin 1 rkl soijapaputahnasta. Taita lettu ja siirrä lautaselle. Valmista toinen samanlainen jäljellä olevasta taikinasta, kananmunasta, kevätsipulista, seesamista, soijapaputahnasta ja öljystä. Tarjoa kaksi lettua ilman erillisiä, listaamattomia kastikkeita tai rapeita täytteitä.\n\n## Muistiinpanot\n\nTämä on ilmoitetuilla aineilla valmistettava pelkistetty jianbing-tyylinen munalettu, ei väite kaikkien perinteisten jianbing-täytteiden sisältymisestä annokseen. Vesi on punnitsematon, energiaton taikinaneste; soijapaputahnan tuotekoostumus vaatii erillisen ravintolähdetarkistuksen."
  }
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
