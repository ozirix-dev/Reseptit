import { createHash } from "node:crypto";

/** C13: exact Git blob pinned, public-FI-only chef preparation corrections.
 * Sealed Markdown, ingredients, macros, GI and GK receipts stay unchanged.
 */
const corrections = {
  "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md": {
    "sourceGitBlobSha1": "f8b9cf8a82c6c0a04a1a3cdbc76f2599cb4f6258",
    "oldMethod": "## Valmistus\n\n1. Raasta, muussaa tai hienonna pääraaka-aine. Sekoita joukkoon taikinan ainekset ja lisää vettä vain sen verran, että seos pysyy koossa.\n2. Kuumenna pannulla ohut kerros öljyä. Muotoile pieniksi pihveiksi tai lusikoi taikina pannulle.\n3. Paista keskilämmöllä molemmin puolin kypsäksi ja rapeapintaiseksi. Paista erissä, jotta pannu ei jäähdy.\n4. Huuhtele riisihiutaleet nopeasti ja valuta. Kuullota maapähkinät, herneet ja curry-lehdet öljyssä; lisää hiutaleet ja kypsennä sekoittaen. Viimeistele korianterilla ja sitruunamehulla.",
    "newMethod": "## Valmistus\n\n1. Mittaa 100 g riisihiutaleita, huuhtele nopeasti siivilässä kylmällä vedellä ja valuta huolellisesti. Hiutaleiden tulee pehmetä mutta pysyä irtonaisina; älä keitä niitä puuroksi.\n2. Kuumenna pannulla koko reseptin 1 rkl neutraalia öljyä. Lisää 20 g maapähkinöitä ja 3 g currylehtiä. Paahda sekoittaen varovasti niin, etteivät pähkinät pala. Lisää 50 g herneitä ja kuumenna ne kunnolla kypsiksi.\n3. Lisää valutetut riisihiutaleet pannulle ja kääntele varovasti maapähkinöiden ja herneiden kanssa. Kypsennä miedolla lämmöllä vain sen verran, että kaikki on kuumaa, ja lisää listan suolaa tarvittaessa.\n4. Ota pois liedeltä. Jaa kahteen annokseen ja viimeistele yhteensä 1 rkl silputtua tuoretta korianteria ja 1 rkl sitruunamehua. Älä lisää sipulia, sokeria tai muita listaamattomia aineksia.\n\n## Muistiinpanot\n\nTämä on pelkistetty poha nykyisillä punnituilla raaka-aineilla. Huuhteluvesi valutetaan pois. Ravinto- ja GI/GK-lähteet tarvitsevat erillisen hyväksynnän; valmistusvaiheiden korjaus ei muuta historiallisia tuloksia."
  },
  "reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md": {
    "sourceGitBlobSha1": "1369126b90bafbe09c07aaf503ae2c69c886b8e4",
    "oldMethod": "## Valmistus\n\n1. Sekoita jauhot, neste ja suola. Vaivaa pehmeäksi taikinaksi ja anna levätä 10 minuuttia. Jos reseptissä on valmis leipä tai taikina, siirry täyttöön.\n2. Jaa taikina osiin ja painele tai kauli ohuiksi leiviksi. Lisää taikinaan kuuluva täyte tai mausteöljy.\n3. Paista kuumalla pannulla molemmin puolin kypsäksi ja nosta liinan alle pysymään pehmeänä.\n4. Sekoita vehnäjauho, jogurtti ja vesi pehmeäksi taikinaksi. Jaa kahdeksi litteäksi leiväksi. Sekoita oliiviöljy, kuivattu timjami ja seesaminsiemenet ja levitä leipien päälle. Paista kuumalla pannulla tai uunissa, kunnes reunat ovat kypsiä.",
    "newMethod": "## Valmistus\n\n1. Sekoita 150 g vehnäjauhoja, 100 g jogurttia ja 40 ml vettä sekä ripaus ainesluettelon suolaa. Vaivaa vain sen verran, että saat muotoiltavan tasaisen taikinan. Anna sen levätä peitettynä noin 5 minuuttia.\n2. Sekoita pienessä kupissa 1 rkl oliiviöljyä, 2 g kuivattua timjamia ja 3 g seesaminsiemeniä. Tämä on tässä reseptissä käytetty za'atar-tyylinen yrttipinta; muita mausteita ei lisätä.\n3. Jaa taikina kahteen osaan ja painele ohuiksi, tasapaksuiksi leiviksi. Levitä koko timjami-seesami-öljyseos niiden pinnoille. Kuumenna paksupohjainen pannu keskilämmölle käyttäen yhteensä reseptin 1 rkl neutraalia paistoöljyä.\n4. Paista leivät pannulla yksi kerrallaan kannen alla tarvittaessa, kunnes molemmat pinnat ovat saaneet väriä ja sisus on kypsä eikä siinä ole raakaa jauhoista taikinaa. Jaa kahdeksi annokseksi ja tarjoa lämpiminä.\n\n## Muistiinpanot\n\nTämä nopea jogurttitaikinainen pannuleipä on manakish-henkinen muunnelma, ei perinteinen hiivalla kohotettu manakish. Erillistä hiivaa, lisäjauhoja tai muuta za'atar-mausteseosta ei ole punnitussa versiossa."
  },
} as const;
export const c13PublicFiPaths = Object.freeze(Object.keys(corrections));

export function projectC13FiDisplay(relativePath: string, input: string): string {
  if (!Object.hasOwn(corrections, relativePath)) return input;
  const patch = corrections[relativePath as keyof typeof corrections];
  const raw = input.replaceAll("\r\n", "\n");
  const currentBlob = createHash("sha1").update("blob " + Buffer.byteLength(raw, "utf8") + "\0").update(raw).digest("hex");
  if (currentBlob !== patch.sourceGitBlobSha1) throw new Error("C13_FI_SOURCE_STALE: " + relativePath);
  if (raw.split(patch.oldMethod).length !== 2) throw new Error("C13_FI_ANCHOR_AMBIGUOUS: " + relativePath);
  return raw.replace(patch.oldMethod, patch.newMethod);
}
