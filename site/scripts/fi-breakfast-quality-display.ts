import { createHash } from "node:crypto";

/** SHA-pinned FI public-presentation corrections for fifteen breakfasts.
 * Canonical FI files, published nutrient/GK bindings and ingredient quantities
 * must remain byte-identical. Unexpected raw edits or ambiguous anchors fail closed.
 */
const changes: Readonly<Record<string, {
  sourceSha256: string;
  edits: readonly (readonly [string, string])[];
}>> = {
  "reseptit/aamupalat/karibia-mango-limejogurtti.md": {
    sourceSha256: "91fcf9425bb58e499304414a99665cc01ba7c37a1a72115262d31e04b5c93a0f",
    edits: [["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Sekoita mango ja lime jogurttiin ja viimeistele kevyesti paahdetulla kookoksella.","1. Punnitse 200 g kuorittua, syötävää mangoa ja kuutioi se pieniksi paloiksi. Mittaa myös 100 g jogurttia, 15 g limemehua ja 20 g kookoshiutaleita.\n2. Halutessasi paahda kaikki 20 g kookoshiutaleita kuivalla pannulla kevyesti kullanruskeiksi ja anna niiden jäähtyä. Älä lisää öljyä tai muuta rasvaa.\n3. Jaa jogurtti ja mango kahteen kylmään annoskulhoon. Lisää kumpaankin puolet punnitusta limemehusta ja halutessasi luettelon suolaa.\n4. Jaa kookoshiutaleet tasaisesti annoksille (10 g annosta kohti) ja tarjoa heti kylmänä. Reseptiin ei kuulu papuja, tofua tai kastiketta."]]
  },
  "reseptit/aamupalat/japanilainen-hojicha-jogurtti-persimonilla.md": {
    sourceSha256: "cae50573ff18898460b95e9c674d0bc39514c7cbaaaa502d4008171b14261cfe",
    edits: [["cooking_method:\n  - \"paistaminen\"\n","cooking_method:\n  - \"kylmävalmistus\"\n"],["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Jauha hojicha hienoksi tai hauduta siitä vahva tee ja jäähdytä. Annostele jogurtti kulhoihin, lisää viipaloitu persimon, hojicha ja seesaminsiemenet. Tarjoa heti.","1. Mittaa 200 g jogurttia, 150 g syötävää persimonin hedelmälihaa, 2 g kuivaa hojicha-teetä ja 5 g seesaminsiemeniä.\n2. Jauha kaikki 2 g hojicha-teetä hyvin hienoksi jauheeksi, jota voi syödä jogurtin mukana. Tässä punnitussa versiossa ei uuteta teetä ylimääräiseen veteen eikä teelehtiä siivilöidä pois.\n3. Jaa jogurtti kahteen kulhoon ja sekoita hojicha-jauhe tasaisesti jogurttiin. Viipaloi persimon ja jaa kaikki 150 g kulhoihin.\n4. Ripottele päälle yhteensä 5 g seesaminsiemeniä (2,5 g annosta kohti), lisää vain luettelon suolaa tarvittaessa ja tarjoa kylmänä. Ruokaa ei paisteta."]]
  },
  "reseptit/aamupalat/lahi-ita-pistaasijogurtti.md": {
    sourceSha256: "f9a1d41f86c92902bbda7c9f224cbc8de48900ec7726625a482f1ecea794a9e1",
    edits: [["cooking_method:\n  - \"paistaminen\"\n","cooking_method:\n  - \"kylmävalmistus\"\n"],["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Mausta jogurtti pienellä tilkalla ruusuvettä ja lisää pistaasi sekä granaattiomenan siemenet.","1. Mittaa 200 g maustamatonta jogurttia, 20 g syötäviä pistaasinsydämiä, 5 ml ruusuvettä ja 60 g granaattiomenan siemeniä.\n2. Sekoita kaikki 5 ml ruusuvettä jogurttiin. Älä lämmitä jogurttia tai lisää reseptiin kuulumattomia kastikkeita.\n3. Jaa ruusuvesijogurtti kahteen kulhoon. Jaa myös kaikki 60 g granaattiomenan siemeniä tasaisesti kulhojen päälle.\n4. Rouhi 20 g pistaasinsydämiä ja jaa annoksille (10 g annosta kohti). Lisää luettelon suolaa vain tarvittaessa ja tarjoa kylmänä."]]
  },
  "reseptit/aamupalat/vietnamilainen-kahvijogurtti-banaanilla.md": {
    sourceSha256: "73b5dbb717f3833c8354f1fcdfa0fdd86ca78a342d50625881133e44b3aba0e3",
    edits: [["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Sekoita vahva kahvi jogurttiin, makeuta kevyesti ja lisää banaaniviipaleet.","1. Valmista 200 ml kahvia ilman lisättyä sokeria tai maitoa ja jäähdytä se kunnolla. Mittaa 100 g jogurttia ja 30 g kondensoitua maitoa.\n2. Sekoita jäähtynyt kahvi ja koko 30 g kondensoitua maitoa keskenään. Lisää 100 g jogurttia vähitellen samalla sekoittaen, jotta seos tasaantuu. Lopputulos on juotavan notkeaa, ei paksu rahkakulho.\n3. Kuori luettelon yksi banaani ja viipaloi sen koko syötävä osa. Jaa kahvijogurttiseos kahteen lasiin tai kulhoon.\n4. Lisää banaaniviipaleet tasaisesti molempiin annoksiin ja tarjoa viileänä. Älä lisää makeutusainetta, maitoa tai muuta kahvinlisuketta punnitun reseptin ulkopuolelta."]]
  },
  "reseptit/aamupalat/valimerellinen-jogurttikulho-hunajalla.md": {
    sourceSha256: "d3b3fa89bf9fe3a4b04e70d3a0d0f8f4fbd957dec2a57cd786cbe8a0af00e0bb",
    edits: [["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Lisää jogurtin päälle viikunaa, hunajaa ja rouhittuja saksanpähkinöitä.","1. Jaa 100 g maustamatonta 7-prosenttista kreikkalaista jogurttia kahteen pieneen kylmään annoskulhoon (50 g kuhunkin).\n2. Punnitse 50 g syötävää tuoretta viikunaa, leikkaa paloiksi ja jaa yhtä suuri määrä kulhoihin.\n3. Rouhi kaikki 30 g saksanpähkinöitä ja jaa tasaisesti annoksille (15 g annosta kohti).\n4. Valuta luettelon yhteensä 1 rkl hunajaa tasaisesti kahden kulhon päälle. Tarjoa kylmänä ilman lämpimiä täytteitä tai luettelematonta kastiketta."]]
  },
  "reseptit/aamupalat/kiinalainen-soijamaito-aamiaisella.md": {
    sourceSha256: "e28b598683b1a561384eb300f6bd08d0a7603a8c2b7dc922b19ce569a51067cf",
    edits: [["cooking_method:\n  - \"paistaminen\"\n","cooking_method:\n  - \"kuumentaminen\"\n"],["1. Valmistele kulhon ainekset; kypsennä pavut tai proteiini, jos käytät niitä kuivina tai raakana. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Kuumenna soijajuoma höyryäväksi mutta älä anna kiehua. Laita riisiviinietikka kulhoihin ja kaada kuuma juoma päälle, jotta se juoksettuu kevyesti. Viimeistele seesamiöljyllä ja hienonnetulla kevätsipulilla. Tarjoa heti.","1. Mittaa 200 ml makeuttamatonta soijajuomaa, 15 ml riisiviinietikkaa, 5 g seesamiöljyä ja 2 rkl hienonnettua kevätsipulia. Käytä vain luettelon suolaa.\n2. Jaa riisiviinietikka kahteen kuumuutta kestävään annoskulhoon. Lisää kumpaankin puolet luettelon seesamiöljystä ja halutessasi vähän luettelon suolaa.\n3. Kuumenna kaikki 200 ml soijajuomaa kattilassa höyryävän kuumaksi mutta älä keitä voimakkaasti. Kaada kuuma soijajuoma annoskulhoihin etikan päälle ja anna seistä hetki; se voi juoksettua kevyesti, mutta koostumus riippuu soijajuomasta.\n4. Viimeistele kulhot luettelon 2 rkl hienonnetulla kevätsipulilla tasaisesti ja tarjoa heti lämpiminä. Älä lisää tofua, papuja tai muita kastikkeita."]]
  },
  "reseptit/aamupalat/korealainen-gyeranbap-riisikulho.md": {
    sourceSha256: "e9ee2e939778d57fafd4b9015b88a7b59669638f522ae7253446f531861034e8",
    edits: [["1. Kypsennä riisi pakkauksen ohjeen mukaan. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Nosta paistettu muna riisille ja viimeistele soijakastikkeella, seesamiöljyllä ja merilevällä.","1. Huuhtele luettelon 100 g kuivaa valkoista riisiä ja keitä pakkauksen ohjeen mukaisessa vesimäärässä kypsäksi. Jaa kypsä lämmin riisi kahteen kulhoon.\n2. Kuumenna tarttumaton paistinpannu miedolle tai keskilämmölle. Paista 2 kananmunaa ilman lisättyä öljyä tai voita niin, että valkuaiset hyytyvät kunnolla.\n3. Nosta yksi paistettu kananmuna kummankin riisiannoksen päälle. Jaa luettelon 1 rkl soijakastiketta tasaisesti kahden kulhon kesken.\n4. Revi luettelon 5 g kuivattua norilevää pieniksi paloiksi ja ripottele annoksille (2,5 g annosta kohti). Lisää vain luettelon suolaa tarvittaessa. Seesamiöljy ei kuulu tähän punnittuun versioon."]]
  },
  "reseptit/aamupalat/lahi-ita-zaatar-munat.md": {
    sourceSha256: "2abaf61e4abd891bb20d3372d24fb45150566a7ff4b1750dd6db976fda0e4924",
    edits: [["1. Valmistele ainekset: paloittele kasvikset ja kypsennä pavut tai liha tarvittaessa erikseen. Kuumenna öljy pannulla.\n2. Lisää pannulle pisimpään kypsyvät ainekset ja kypsennä pehmeiksi. Lisää mausteet ja tilkka vettä, jos pannu uhkaa kuivua.\n3. Lisää lopuksi nopeasti kypsyvät ainekset, kuten muna tai lehtivihannekset. Kypsennä juuri valmiiksi ja maista suola.\n4. Paista kananmunat ja mausta za’atarilla; tarjoa jogurtin ja lämpimän pitan kanssa.","1. Punnitse 100 g valmista pitaa ja lämmitä sitä kuivalla pannulla tai uunissa ilman lisättyä rasvaa. Jaa pita kahteen annokseen.\n2. Kuumenna pannulla yhteensä luettelon 1 rkl neutraalia paistoöljyä. Riko pannulle 2 kananmunaa ja paista haluamaasi kypsyyteen siten, että valkuaiset hyytyvät.\n3. Ripottele luettelon 1 tl za’ataria tasaisesti kananmunille. Käytä suolaa vain luettelon mukaan, jos mausteseos ei jo ole suolaista.\n4. Jaa 100 g jogurttia kahteen pieneen annokseen. Tarjoa yksi za’atar-muna annosta kohti lämpimän pitan ja 50 g jogurtin kanssa. Älä lisää kastiketta, voita tai muita luettelemattomia aineksia."]]
  },
  "reseptit/aamupalat/rahka-marjakerroskulho.md": { sourceSha256: "38ed90a415a871e64593e65b63bc46171b2fecf2bc5ff05a3a67690eae81b8e6", edits: [["  - kypsentäminen\n", "  - kylmävalmistus\n"]] },
  "reseptit/aamupalat/kiinalainen-teehaudutetut-munat.md": {
    sourceSha256: "bae898d991ed769ae2853f2860e1ebcd3629e292e0d5ca2901244c0377d640e1",
    edits: [
      ["cooking_method:\n  - \"paistaminen\"\n", "cooking_method:\n  - \"keittäminen\"\n"],
      ["1. Keitä kananmunat kiehuvassa vedessä haluttuun kypsyyteen ja jäähdytä hetki kylmässä vedessä.\n2. Kuumenna mausteliemi ja lisää pääraaka-aine. Hauduta miedosti, jotta maut ehtivät tarttua.\n3. Kuori ja puolita munat. Kokoa kulhot ja lusikoi päälle lämmin mausteliemi.\n4. Halkeile keitettyjen munien kuoret kevyesti ja hauduta mausteliemessä.", "1. Keitä 2 kananmunaa kuorineen vedessä 8–9 minuuttia. Jäähdytä hetki, jotta kuoria voi käsitellä; älä kuori munia vielä.\n2. Kuumenna mausteliemeksi luettelon 150 ml valmiiksi haudutettua mustaa teetä, 1 rkl soijakastiketta ja 1 tl tähtianista. Lisää luettelon suolaa vain tarvittaessa.\n3. Naputtele kovaksi keitettyjen munien kuoriin pieniä säröjä lusikalla poistamatta kuoria. Nosta munat pieneen kattilaan mausteliemeen ja kääntele niitä, jotta vähäinenkin liemi koskettaa kuoria tasaisesti.\n4. Hauduta kannen alla miedolla lämmöllä noin 10 minuuttia. Kuori munat vasta maustumisen jälkeen ja tarjoa yksi muna annosta kohti. Lientä ei tarvitse tarjoilla erillisenä kastikkeena."]
    ]
  },
  "reseptit/aamupalat/japanilainen-onigiri-lohella.md": {
    sourceSha256: "71de7695fefca8a5fe6d0d84e3343380ca06858b6cbdfdb539ff32296733cdbf",
    edits: [["1. Kypsennä riisi pakkauksen ohjeen mukaan. Paista tofu, muna tai muu lämmin täyte tarvittaessa erikseen.\n2. Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.\n3. Jaa lämmin pohja kulhoihin, asettele muut ainekset päälle ja lisää kastike juuri ennen tarjoamista.\n4. Huuhtele riisi ja kypsennä se. Kypsennä lohi pannulla ja hiutaloi. Jaa lämmin riisi kahteen osaan, täytä lohella ja muotoile tiiviiksi kolmionmuotoisiksi riisipalloiksi. Kääri pienet norileväsuikaleet ympärille ja viimeistele seesaminsiemenillä.", "1. Huuhtele luettelon 100 g kuivaa valkoista riisiä ja keitä se pakkauksen ohjeen mukaisessa vesimäärässä kypsäksi. Anna kypsän riisin jäähtyä hieman, jotta sitä voi käsitellä.\n2. Kypsennä samalla luettelon 150 g raakaa lohta kuivalla tarttumattomalla pannulla ilman lisättyä rasvaa, kunnes kala on kauttaaltaan kypsää. Poista ruodot, hiutaloi lohi ja mausta luettelon suolalla tarvittaessa.\n3. Jaa kypsennetty riisi kahteen yhtä suureen osaan. Kostuta kädet vedellä, aseta kummankin riisiosuuden keskelle puolet lohesta ja purista riisi tiiviiksi kolmioksi täytteen ympärille.\n4. Leikkaa luettelon 3 g kuivattua norilevää suikaleiksi ja kääri niitä riisikolmioiden ympärille. Ripottele päälle yhteensä 5 g seesaminsiemeniä (2,5 g annosta kohti). Tarjoa ilman muita, luettelemattomia täytteitä tai kastikkeita."]]
  },
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
