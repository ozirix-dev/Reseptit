import assert from "node:assert/strict";
import { createHash } from "node:crypto";

/** FI-only display release for the already public canonical huevos recipe.
 * Keep immutable source, ingredients, nutrition and prior C5 draft seals unchanged.
 * This is NOT authorization to publish the draft V2 or its tentative macros.
 */
const file = "reseptit/aamupalat/meksikolainen-huevos-divorciados.md";
const sourceBlob = "7559395cbb0d66229b7b964fb034bbcf3f9edd0b";
const heading = "\n## Valmistus\n";
const note = "\n## Muistiinpanot\n";
const method = `\n## Valmistus

1. Valitse valmiiksi kypsennetyt säilykemustapavut. Valuta ja huuhtele pavut, punnitse niistä 150 g syötävää papumassaa koko kahden annoksen erään. Älä käytä 150 g kuivia papuja; mahdollisen kuivan pavun turvallinen esikäsittely ja pitkä kypsennys eivät kuulu tähän 25 minuutin reseptiin.
2. Pese ainesluettelon yksi tomaatti, hienonna se ja kuumenna pienessä kattilassa ilman lisäöljyä, kunnes se pehmenee punaiseksi tomaattikastikkeeksi. Mausta halutessasi osalla luettelon suolasta. Kuumenna toisessa astiassa koko 150 g valmista vihreää meksikolaista salsaa. Älä sekoita punaista ja vihreää kastiketta yhteen.
3. Kuumenna koko ainesluettelon 1 rkl neutraalia paistoöljyä pannulla ja paista kaksi kananmunaa. Varmista, että valkuaiset hyytyvät kunnolla. Kuumenna valutetut pavut läpikotaisin erillisessä astiassa ilman listaamatonta öljyä.
4. Jaa kahdelle lautaselle kummallekin yksi muna ja 75 g kypsiä valutettuja papuja. Lusikoi punainen tomaattikastike munan toiselle puolelle ja vihreä salsa toiselle puolelle; kumpaakin kastiketta tulee puolet per annos. Tarjoile heti. Tortillat ja muut lisukkeet eivät kuulu tämän version annoslaskentaan.

## Muistiinpanot

**Ravintolaskennan rajaus:** resepti on valmistusohjeena julkinen, mutta tietyn säilykemustapavun 100 g:n etiketin vastaavuutta valutettuun 150 g:n syötävään massaan ei ole vahvistettu. Älä tulkitse erillisen V2-luonnoksen ehdollisia makroja tämän julkisen reseptin hyväksytyiksi ravintoarvoiksi tai GK:ksi. Myyntipakkauksen tuotetiedot ja allergeenit tarkistetaan ennen käyttöä. Yksi tomaatti ei ole sama kuin punnittu 120 g.
`;

export function projectHuevosFiPublicPreparation(relative: string, raw: string): string {
  if (relative !== file) return raw;
  const lf = raw.replaceAll("\r\n", "\n");
  const blob = createHash("sha1").update("blob " + Buffer.byteLength(lf,"utf8") + "\0").update(lf).digest("hex");
  assert.equal(blob,sourceBlob,"HUEVOS_C5_SOURCE_STALE");
  const start=lf.indexOf(heading), end=lf.indexOf(note,start+heading.length);
  assert(start>=0 && end>start && lf.indexOf(heading,start+1)<0,"HUEVOS_C5_METHOD_ANCHOR");
  const visible = lf.slice(0,start) + method;
  assert(visible.includes("## Muistiinpanot"));
  return visible;
}
