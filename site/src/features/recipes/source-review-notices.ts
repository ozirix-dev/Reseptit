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
    details: "Aiemmat ravintoarvot on piilotettu lähdetarkistuksen ajaksi. Maitorahkan, turkkilaisen jogurtin, metsämustikan, hasselpähkinän, sitruunankuoren teelusikkapainon ja valinnaisen makeutuksen tuotevastaavuutta ei ole vielä kokonaan varmennettu. Tuotteen vaihto voi muuttaa hiilihydraatteja ja rasvaa.",
    allergens: "Sisältää maitoa ja hasselpähkinää. Tarkista käyttämiesi tuotteiden pakkaukset.",
  },
  "intialainen-pinaatti-paneer-chilla": {
    heading: "Ravintoarvojen laskenta kesken",
    details: "Neljä varsinaista makroarvoa ja hyväksytty ainesosakohtainen laskentasyöte puuttuvat. Juustokuminan teelusikkapaino ja paistoöljyn syöty osuus pitää täsmentää. Ohjeessa ei ole korianterichutneyta eikä sitruunalohkoja, ellei niitä lisätä ainesluetteloon erikseen.",
    allergens: "Sisältää maitoa (paneer) ja kikhernejauhoa (palkokasvi). Tarkista pakkaukset.",
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
  "meksikolainen-chilaquiles-verdes": {
    heading: "Tortillan, salsan ja juuston ravintolaskenta puuttuu",
    details: "Tortillan tuotemerkki muuttaa hiilihydraatteja: El Taco Truckin maissitortilla 43 g/100 g ja Finelin eräs kaupallinen maissitortilla 51,845 g/100 g. Kaikki 100 g tortillaa, 150 g salsa verdeä, 150 g queso frescoa, kaksi munaa ja paistoöljy pitää sitoa täsmätuotteisiin ennen neljän makron hyväksymistä. Kuitua ei saa arvata nollaksi.",
    allergens: "Sisältää kananmunaa ja maitoa. Tarkista tortillan ja salsa verden pakkauksista allergeenit ja mahdolliset jäämät.",
  },
  "meksikolainen-paputostada-aamupalaksi": {
    heading: "Papujen ja avokadon punnitus puuttuu",
    details: "150 g mustapapuja tarkoittaa tässä vielä määrittämätöntä kuiva-, säilyke- tai kypsäpainoa. Käytä papuja vain täysin kypsinä. Yhden avokadon kuorittu syötävä massa sekä 100 g tortillan valmistaja ja 1 rkl öljyn syöty määrä on selvitettävä ennen makrolaskentaa.",
    allergens: "Sisältää kananmunaa. Tarkista tortillan ja muiden tuotteiden pakkausmerkinnät.",
  },
  "korealainen-kimchi-jeon-aamiaiseksi": {
    heading: "Kimchin tuote ja lettutaikinan kosteus vielä tarkistuksessa",
    details: "150 g kimchiä ei vielä kerro tuoteversiota tai valutettua painoa. Sempio-kimchin eri markkinaetiketeissä on ilmoitettu 2 ja 4,5 g hiilihydraattia/100 g. Myös 2 rkl kevätsipulia ja kimchistä taikinaan tuleva neste tarvitsevat punnituksen. Uutta vettä ei lisätä ilman erillistä ohje- ja ravintolaskentapäätöstä.",
    allergens: "Sisältää vehnää ja kananmunaa. Kimchituote voi sisältää soijaa, kalaa tai äyriäisiä: tarkista aina oma pakkaus.",
  },
  "karibia-plantain-aamiaislautanen": {
    heading: "Ruokabanaanin ja avokadon syötävät painot puuttuvat",
    details: "Yksi ruokabanaani, yksi avokado ja yksi lime eivät riitä ravintoarvojen laskentaan ilman kuorittuja syötäviä grammapainoja ja limemehun määrää. Kypsennä ruokabanaani kunnolla; 1 rkl paistoöljyn syöty osuus täytyy arvioida ja kaksi munaa punnita ilman kuorta.",
    allergens: "Sisältää kananmunaa. Tarkista muiden käytettyjen tuotteiden allergeenit.",
  },
  "munakoiso-kesakurpitsalasagne": {
    heading: "Lasagnen valmistetuotteiden ravintoarvot vielä avoimia",
    details: "Tässä FI-reseptissä on 200 g kuivia lasagnelevyjä, ei erillisessä kokeilussa mainittua 180 g vaihtoehtoa. Lisäksi 800 g tomaattikastiketta, 250 g mozzarellaa, 80 g parmesaania tai muuta kovaa juustoa sekä 60 g oliiviöljyä tarvitsevat lopulliset tuote- ja ravintoarvovastaavuudet. Nykyisen version neljä makroa ja GK puuttuvat.",
    allergens: "Sisältää tavallisista lasagnelevyistä vehnää ja juustoista maitoa. Tarkista mahdolliset tuotekohtaiset lisäallergeenit.",
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
