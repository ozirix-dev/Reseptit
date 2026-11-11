import assert from "node:assert/strict";
import {createHash} from "node:crypto";

/** Public FI editorial note only. No revision to sealed ingredients, calculations, GI/GK or original markdown. */
const original="reseptit/aamupalat/kiinalainen-jianbing-munaletty.md";
const sourceBlob="15eef1ad0e7d56666e923e8d035db14e7efadd0c";
const heading="\n## Muistiinpanot\n";
const note=`\n## Muistiinpanot

Tämä on pelkistetty, kotikeittiöön sovitettu jianbing-tyylinen munalettu. Taikinaan lisättävä noin 180 ml vesi on energiatonta, mutta se ei korvaa ainesosaluettelon tarkkoja määriä.

**Ravintoarvojen tuotekohtainen rajaus:** sivulla näkyvä historiallinen ravintolaskenta perustuu yleiseen soijapaputahnan koostumustietueeseen (AFCD F005702), ei todistettuun, käytettyyn Lee Kum Kee -pakkaukseen. Soijapapukastikkeiden EU-, Australian- ja Hongkongin markkinaversioiden ravintoarvot eroavat. Näitä etikettilukuja ei voi yhdistää samaan hyväksyttyyn ravintolaskelmaan. V2-luonnoksen tuotekohtaiset makrot ja GK ovat edelleen tarkistamatta; julkisen alkuperäisversion numeroita ei pidä tulkita kaikkien kastikkeiden tarkaksi ravintoarvoksi.

**Allergeenit:** ohje sisältää vehnäjauhoja, kananmunaa, seesamia ja soijapaputahnaa. Tarkista myös ostetun kastikkeen oma etiketti; resepti ei ole gluteeniton.
`;
export function projectJianbingC5FiPublicNote(relative:string,raw:string):string {
  if(relative!==original)return raw;
  const lf=raw.replaceAll("\r\n","\n");
  const gitBlob=createHash("sha1").update("blob "+Buffer.byteLength(lf,"utf8")+"\0").update(lf).digest("hex");
  assert.equal(gitBlob,sourceBlob,"JIANBING_C5_SOURCE_STALE");
  const where=lf.indexOf(heading);
  assert(where>=0&&lf.indexOf(heading,where+1)<0,"JIANBING_C5_NOTES_ANCHOR");
  return lf.slice(0,where)+note;
}
