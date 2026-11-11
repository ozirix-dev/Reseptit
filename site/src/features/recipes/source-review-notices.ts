/** F25 source-review notices shown without altering source recipe Markdown or GK-sealed content.
 *  A disclaimer is not a release authorization, nutrition recalculation, or quarantine action.
 */
export interface SourceReviewNotice {
  heading: string;
  details: string;
  allergens: string;
}

export const sourceReviewNotices: Readonly<Record<string, SourceReviewNotice>> = Object.freeze({
  "rahka-marjakerroskulho": {
    heading: "Ravintoarvojen lähdetarkistus kesken",
    details: "Näytetyt makrot ovat alustavia. Maitorahkan, turkkilaisen jogurtin, metsämustikan, hasselpähkinän, sitruunankuoren teelusikkapainon ja valinnaisen makeutuksen tuotevastaavuutta ei ole vielä kokonaan varmennettu. Tuotteen vaihto voi muuttaa hiilihydraatteja ja rasvaa.",
    allergens: "Sisältää maitoa ja hasselpähkinää. Tarkista käyttämiesi tuotteiden pakkaukset.",
  },
  "intialainen-pinaatti-paneer-chilla": {
    heading: "Ravintoarvojen laskenta kesken",
    details: "Neljä varsinaista makroarvoa ja hyväksytty ainesosakohtainen laskentasyöte puuttuvat. Juustokuminan teelusikkapaino ja paistoöljyn syöty osuus pitää täsmentää. Ohjeessa ei ole korianterichutneyta eikä sitruunalohkoja, ellei niitä lisätä ainesluetteloon erikseen.",
    allergens: "Sisältää maitoa (paneer) ja kikhernejauhoa (palkokasvi). Tarkista pakkaukset.",
  },
  "lahi-ita-zaatar-munat": {
    heading: "Mausteseoksen ravintoarvot tarkistuksessa",
    details: "Nykyinen laskenta jättää yhden teelusikallisen za’atar-mausteseosta ravintoarvojen ulkopuolelle. Esimerkiksi Mauste-Sallisen za’atar sisältää hiilihydraattia ja rasvaa, joten vanhat luvut ovat alustavia. Seoksen todellinen grammapaino ja tuoteversio pitää määrittää.",
    allergens: "Za’atar-seos sisältää tässä vertailutuotteessa seesamia. Reseptissä on myös kananmunaa, vehnää (pita) ja maitoa (jogurtti).",
  },
  "japanilainen-hojicha-jogurtti-persimonilla": {
    heading: "Syötävän teejauheen laskenta kesken",
    details: "Tämän ohjeen 2 g hienoa hojicha-jauhetta syödään kokonaan, mutta nykyiset ravintoarvot eivät sisällä jauheen hiilihydraatteja, kuitua, proteiinia ja rasvaa. Teetä ei tässä versiossa hauduteta ja siivilöidä pois.",
    allergens: "Sisältää maitoa (jogurtti) ja seesamia. Tarkista myös hojicha-tuotteen pakkaus.",
  },
  "vietnamilainen-papaija-kookospuuro": {
    heading: "Tapiokahelmen tuotteen ja kypsennysajan tarkistus kesken",
    details: "Ohje on tarkoitettu kuivalle pienikokoiselle tapiokahelmelle, joka kypsyy pehmeäksi noin 15–20 minuutissa. Liotusta tai pidempää keittoa vaativilla tuotteilla 25 minuutin kokonaisaika ei riitä. Käytetty 700 ml keitinvettä pidetään puurossa, eikä helmiä huuhdella tai valuteta. Älä vaihda esikeitettyihin tai siirapissa oleviin kuplateehelmiin ilman uutta ravintolaskentaa.",
    allergens: "Tarkista kookosmaidon ja tapiokahelmien pakkausmerkinnät, lisäaineet ja mahdolliset allergiat.",
  },
  "vietnamilainen-banh-xeo-aamiaisletut": {
    heading: "Vaalea bánh xèo -sovellus vaatii rakennevarmennuksen",
    details: "Nykyinen punnittu taikina sisältää 100 g riisijauhoa ja 200 ml kookosmaitoa, mutta ei vettä eikä kurkumaa. Se ei ole perinteisen keltaisen ohuen bánh xèon tarkka vastine. Paista katkaravut täysin kypsiksi, kuumenna pavunidut läpikotaisin ja paista letut yhdeltä puolelta. Rapeus ja taikinan levittyvyys on vielä varmistettava.",
    allergens: "Sisältää katkarapuja eli äyriäisiä. Tarkista myös kookosmaidon ja muiden tuotteiden pakkausmerkinnät.",
  },
  "pohjoisafrikkalainen-baghrir": {
    heading: "Baghririn nestemäärä ei vastaa perinteistä ohutta taikinaa",
    details: "Nykyisessä lähteessä on 200 g manna- ja vehnäjauhoja mutta vain 150 ml vettä. Seoksesta tulee selvästi paksumpi kuin perinteisestä toiselta puolelta paistettavasta reikäisestä baghrirista. Näytetyt makrot perustuvat tähän vanhaan punnittuun versioon. Korjausehdotuksen noin 300 ml vettä ja uusi valmistusaika tarvitsevat vielä FI- ja GK-versiohyväksynnän.",
    allergens: "Sisältää vehnää eli gluteenia. Hunajaa on vain 1 rkl koko reseptissä; voita ei ole ainesluettelossa.",
  },
  "vietnamilainen-banh-cuon-sienilla": {
    heading: "Valmistusajan ja täytteen tarkistus kesken",
    details: "Sienistä huolimatta täytteessä on 150 g raakaa porsaan jauhelihaa: tämä ei ole kasvisruoka. Kypsennä jauheliha kauttaaltaan täysin kypsäksi. Riisilevyjen höyryttämisen ja irrottamisen takia ilmoitettua 25 minuutin kokonaisaikaa ei ole varmistettu; varaa enemmän aikaa.",
    allergens: "Kalakastike sisältää kalaa. Tarkista muut allergeenit tuotepakkauksista.",
  },
});

export function sourceReviewNotice(recipeId: string): SourceReviewNotice | null {
  return sourceReviewNotices[recipeId] ?? null;
}
