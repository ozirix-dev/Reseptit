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
  "reseptit/aamupalat/valimerellinen-ricotta-persikkakulho.md": {
    sourceSha256: "da520f24684e3d1dfa2ed786b4e1200605b588a413591e852b568b59d3968d5c",
    edits: [
      ["cooking_method:\n  - \"paistaminen\"\n", "cooking_method:\n  - \"kylmävalmistus\"\n"],
      ["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Lusikoi kulhoon ricotta ja persikkaviipaleet. Mausta sitruunamehulla ja viimeistele pistaasilla.", "1. Jaa 100 g maustamatonta ricottaa kahteen tarjoilukulhoon yhtä suuriin osiin. Ricottaa ei kuumenneta.\n2. Lisää kulhoihin yhteensä 150 g tuoreita, kivettömiä persikkaviipaleita (75 g annosta kohti).\n3. Jaa luettelon 1 rkl laimentamatonta sitruunamehua tasaisesti molempiin annoksiin. Lisää luettelon suolaa vain maun mukaan.\n4. Ripottele päälle yhteensä 30 g suolaamattomia pistaasinsydämiä (15 g annosta kohti) ja tarjoa kylmänä. Älä lisää öljyä, kastiketta tai muita luettelemattomia aineksia."]
    ]
  },
  "reseptit/aamupalat/thai-maissifritterit.md": {
    sourceSha256: "eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a",
    edits: [["1. Raasta, muussaa tai hienonna pääraaka-aine. Sekoita joukkoon taikinan ainekset ja lisää vettä vain sen verran, että seos pysyy koossa.\n2. Kuumenna pannulla ohut kerros öljyä. Muotoile pieniksi pihveiksi tai lusikoi taikina pannulle.\n3. Paista keskilämmöllä molemmin puolin kypsäksi ja rapeapintaiseksi. Paista erissä, jotta pannu ei jäähdy.\n4. Tarjoa limetillä ja makean chilikastikkeen pienellä tipalla.", "1. Valuta ja kuivaa 150 g jo kypsennettyjä maissinjyviä. Hienonna luettelon 2 rkl tuoretta thaibasilikaa; älä muussaa maissia.\n2. Vatkaa 2 kananmunaa kulhossa ja sekoita joukkoon 100 g vehnäjauhoa, maissinjyvät, thaibasilika ja luettelon suolaa maun mukaan. Älä lisää vettä, jauhoja tai muita aineksia.\n3. Kuumenna pannulla yhteensä luettelon 1 rkl neutraalia paistoöljyä. Lusikoi seoksesta pieniä, hieman litistettyjä frittereitä. Paista keskilämmöllä erissä, jotta ne ruskistuvat tasaisesti; jaa sama punnittu öljymäärä kaikkien erien kesken.\n4. Käännä fritterit ja paista molemmin puolin kullanruskeiksi ja kauttaaltaan kypsiksi niin, ettei keskelle jää raakaa kananmunaa tai jauhoa. Jaa kaikki fritterit kahteen annokseen; lime ja makea chilikastike eivät sisälly tähän punnittuun versioon."]]
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
