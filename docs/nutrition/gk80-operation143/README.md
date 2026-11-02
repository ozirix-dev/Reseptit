# Operaatio 143 — PR #171:n julkaisuportti

2.11.2026. **GO omistajan sisältökatselmointiin: kaikki kymmenen GK-ehdokasta.** Ei Ready-siirtymää, mergeä tai deployta. Tutkimus-PR #170 ja PR #168–169 säilyvät erillään; niistä ei tarvita menetelmämuutoksia tähän julkaisuun.

Tuotanto HTTP-varmennuksella **133/326 (40,80 %)**. Hyväksyntävalmis integraatioehdokas **143/326 (43,87 %)**. Kaikki kymmenen GK-tarkistusarvoa säilyvät Operaatio 142:sta. Aiempien 133 tuloksen säilyminen tarkistetaan nykyisestä laskentaraportista.

## Kahdeksan makropidätyksen päätökset

Kaikilla kahdeksalla oli tuotannossa neljä näkyvää makroarvoa. Tuotannon HTML ja mainin reseptit täsmäsivät. Alla järjestys **netto-HH / kokonais-HH / proteiini / rasva**, g/annos.

| Resepti | Tuotannon aiemmat arvot | Päätös / uuden version arvot |
| --- | --- | --- |
| Ratatouille | 16,40 / 23,62 / 3,37 / 14,96 | **B, palautettu:** 11,55 / 16,77 / 2,46 / 14,57 |
| Sitruuna-yrttikana ja parsa | 1,78 / 4,33 / 36,34 / 16,09 | **C, pidätetty** |
| Shakshuka | 8,90 / 12,40 / 15,60 / 17,50 | **B, palautettu:** 8,20 / 10,28 / 15,48 / 17,34 |
| Munatacot / huevos rancheros | 4,20 / 9,60 / 21,30 / 34,60 | **B, palautettu:** 4,23 / 6,99 / 21,40 / 34,56 |
| Paprikainen VHH-gulassi | 8,72 / 11,29 / 40,59 / 24,04 | **C, pidätetty** |
| Caponata | 13,87 / 20,66 / 2,35 / 11,74 | **B, palautettu:** 13,73 / 20,51 / 2,28 / 10,49 |
| Janssoninkiusaus juuriselleristä | 8,38 / 14,03 / 12,47 / 33,30 | **C, pidätetty** |
| Rogan josh | 4,39 / 6,05 / 35,37 / 41,78 | **C, pidätetty** |

**Palautuksia 4/8; A=0, B=4, C=4.** Menemenin ja täytettyjen paprikoiden aiemmat täydelliset paketit säilyvät, joten yhteensä **6/10 täydellistä makropakettia, 4/10 pidätettyä**. Kaikki uudet arvot laskettiin nykyisille punnituille versioille; vanhoja arvoja tai hyväksyntöjä ei siirretty vaihtamalla hashia.

### Palautusten lähderatkaisut

- Ratatouille: Finelin saman valkosipulitietueen **393 kuitu 2,1 g/100 g** sekä tuoreen basilikan **11134 kuitu 1,6 g/100 g** täydentävät paikallisen poiminnan puutteet. Kuivattu timjami ja mustapippuri rajataan kokonaisina pieninä osuuksina dokumentoiduilla USDA-katoilla.
- Shakshuka: täsmälleen nimetyn Santa Maria -savupaprikan **EAN 7311311015243 kuitu 41 g/100 g** mahdollistaa source-total-katon. Kumina, savupaprika, mustapippuri ja puhdas kuivattu chili jäävät pieninä kokonaisina osuuksina makrosumman ulkopuolelle. Niiden kumulatiivinen kokonais-HH-katto on **0,95722 g/annos**, energia **6,5995 kcal/annos**. Chilille käytetään saman kuivatun kokonaisen punapippurin USDA170932-koostumuskattoa; hienonnus ei erottele aineosia. Tämä on nimellinen lähdemalli, ei kaikkien maustelajikkeiden tai erien mitattu enimmäisarvo.
- Munatacot: saman tuoreen korianterin **Fineli34238 kuitu 2,8 g/100 g** täydentää puuttuvan kentän. Maustepoistojen kokonais-HH-katto on **0,921075 g/annos**, energia **5,9925 kcal/annos**.
- Caponata: koostumus sidotaan vihreisiin kivettömiin suolaliemioliiveihin **Fineli34972**, jonka polyoliarvo on lähteessä eksplisiittinen 0. Sekoitettujen vihreiden/mustien öljyoliivien tietuetta ei käytetä tämän version koostumuksena. Basilikan kuitu täydennetään saman Fineli-ID:n sivulta; kapriksen pieni osuus rajataan lähdekatoilla.

Rajat pysyvät nykyisinä: makropoistot yhteensä enintään 1 g kullekin neljälle makrolle ja 10 kcal/annos. Pieniä mausteita ei käsitellä erillisinä täysinä poikkeuksina. Epäselvää pääainesta ei poisteta. Lähdetietueiden yleistä vaihtelua ei muunnettu uudeksi hyväksyntätoleranssiksi.

Fineli-poiminnan alkuperäiset null-kentät säilyvät muuttamattomina `primaryReference`-osassa ja koko viiteaineistossa. Täydennetyssä makrotietueessa kuituarvolla on erillinen saman ruoan lähde, päiväys ja uusi tunniste. Polyolikenttiä ei täydennetä. Finelin API ja paikallinen HTTP palauttivat 403:n; kuituarvot luettiin virallisilta HTML-sivuilta web-työkalulla. Uutta API-vastausta tai paikallisen raakavastauksen hashia ei väitetä saaduksi.

### Neljä todellista jäljellä olevaa estettä

- **Sitruunakana:** timjamin, valkosipulijauheen, mustapippurin ja kuoriraasteen täydellinen makrokoostumus/erilliset polyolit puuttuvat. Lähteistetyt kokonais-HH-katot yhteensä **1,043295 g/annos ylittävät 1 g rajan**. Määriä ei pienennetty eikä toista tuotetta valittu rajan saavuttamiseksi.
- **Gulassi:** 150 g smetanan Fineli630-tietueesta ja 9 g paprikajauheen Fineli11182-tietueesta puuttuu eksplisiittinen polyoliarvo. Smetanan tai suuren mausteosuuden koko makrovaikutusta ei voi kuitata pienenä poisrajauksena.
- **Jansson:** 125 g valutetun öljyyn säilötyn anjoviksen USDA174183-tietueessa ei ole erillistä polyoliarvoa. Kokonaishiilihydraatin 0 ei muuta puuttuvaa kenttää eksplisiittiseksi polyolinollaksi. Kalaa ei vaihdeta makeutettuun pohjoismaiseen ansjovikseen. Mustapippurikin on makrolähteenä keskeneräinen.
- **Rogan josh:** useiden mausteiden ja inkiväärin polyolit ovat tuntemattomia, ja poistettavien kokonaisten mausteiden makrouutto on mittaamatta. Koko lähtömateriaalin varovaiset poistokatot eivät mahdu makrosääntöön. Uutto-osuutta ei keksitä.

## Rogan josh ja sisällöllinen tarkistus

**GK hyväksyttävissä tarkalle nykyversiolle:** neljä annosta; juustokumina 4 g, korianterinsiemen 2 g, chilijauhe 1 g, kokonainen kanelitanko 2 g, neljä kardemummakotaa yhteensä 1,6 g, inkivääri 15 g ja paprika 4 g. Kokonaiset kaneli ja kardemumma poistetaan valmistuksessa. GK-poisrajauksessa lasketaan niiden lähtömateriaalin katto, ei keksittyä liukenemisprosenttia.

Poisrajaus on nimellisesti **1,965075 g/annos**, raportointitasolla noin **1,97 g**. Jokainen yksittäinen osuus on alle 1 g ja summa alle 2 g. Lähdelukujen ilmoitettujen desimaalien pyöristystä kiinteillä reseptimäärillä suurentava aritmeettinen tarkistus antaa **1,9664125 g/annos**, yhä alle 2. Tämä tarkistus ei ole biologinen epävarmuusväli tai keittiövaa'an virheraja. Uusia määriä, toleransseja tai tarkkuusvaatimuksia ei asetettu rajan alittamiseksi. GK **1,11**, LOW, säilyy; makropaketti pidätetään.

Kymmenen reseptin vertailussa tuotantoon annosmäärät ja ruokalajien ydinainekset säilyvät. Operaatio 142:n punnitut versiot ovat edelleen rajaus, eivät yleisiä arvoja kaikille valmistustavoille. Tässä ajossa korjattiin vain kolme todellista sisältöepäjohdonmukaisuutta:

1. Munatacojen FI-listan 0,5 g korianteriksi virheellisesti nimetty mustapippuririvi korjattiin. Erillinen 10 g tuoretta korianteria säilyy. EN/SV/TH ja valmistusohje olivat jo oikein.
2. Gulassin aineslistan voi/öljy-vaihtoehto täsmennettiin laskennassa ja kaikissa valmistusohjeissa jo käytetyksi **21 g voiksi** neljällä kielellä. Tämä valitsee alkuperäisen sallitun vaihtoehdon.
3. Caponatan käännösten musta oliivi -vaihtoehto poistettiin alkuperäisen FI-ohjeen vihreiden oliivien mukaisesti; neljässä kielessä on nyt sama valutettu suolaliemiversio. Määrä säilyy 80 g.

PI-oletukset pysyvät laskentapolitiikkana, sakkaroosin ihmisvertailu erillisenä ruokaan sovellettuna analogiana. Kaikki kymmenen ovat LOW-pistearvioita, eivät valmiista ateriasta mitattuja GI/GK-tuloksia. Puuttuvat tiedot pysyvät tuntemattomina, ja neljä pidätettyä makropakettia puuttuvat myös JSON-LD:stä.

## Omistajalle hyväksyttävä täsmällinen erä

**Kaikki kymmenen:** Ratatouille; Sitruuna-yrttikana ja parsa; Menemen; Shakshuka; Munatacot / huevos rancheros; Paprikainen VHH-gulassi; Caponata; Janssoninkiusaus juuriselleristä; Täytetyt paprikat VHH; Rogan josh.

Hyväksyntä koskee nykyisiä lähde-/syöte-/kieliversiohasheja, neljää palautettua ja kahta aiempaa täydellistä makropakettia, neljää perusteltua pidätystä sekä nykyisiä LOW/PI-sovelluksia. Viisi E-tapausta ja muut HOLDit jäävät erilleen. Ready, Codex Review ja julkaisu vaativat seuraavan erillisen valtuutuksen.

## Tarkistukset ja todisteet

`review.json` sisältää kaikkien kahdeksan pidätyksen tuotantoarvot, A/B/C-luokat, alkuperäiset ja nykyiset ainekset/annokset, esteet sekä kymmenen päätöstä. `production-baseline.json` sisältää kymmenen tuotantosivun HTTP- ja makrovarmennuksen. `source-supplements.json`, `usda-omission-sources.json` ja `decimal-verification.json` sisältävät rajatut lähde- ja laskentatodisteet.

Riippumaton Decimal: **10/10 GK, 6/6 täydellistä makropakettia PASS**, neljä pidätystä säilyy. Julkaisusisältö muuttui: yksi paikallinen strict-build **703 reittiä PASS**, ravintoarvoristiriitoja0. Kohdennetut rekisteröidyt testit **3/3 PASS**, mukaan lukien133 aiemman numeerisen ja316 muuttumattoman kokonaisen tulosobjektin hashvertailut. Muuttunut sisältö **20 kieliversiota +8 evidenssiä PASS**. Julkinen aineisto **40/40 HTML/JSON-LD-sivua PASS**. Kaikkien10 ehdokkaan resepti-, syöte- ja lähdesidonnat täsmäävät. Uusia testitiedostoja, laskentakoodimuutoksia tai tarpeettomia koko testisarjan uusintoja ei tehty. CI käynnistyy automaattisesti tämän korjauksen pushista; manuaalista Actions-uusinta-ajoa ei tehdä. Lopulliset tulokset ja HEAD raportoidaan ajon lopuksi.

Rajatut päälähteet: [Fineli393](https://fineli.fi/fineli/fi/elintarvikkeet/393), [Fineli11134](https://fineli.fi/fineli/fi/elintarvikkeet/11134), [Fineli34238](https://fineli.fi/fineli/fi/elintarvikkeet/34238), [Fineli34972](https://fineli.fi/fineli/fi/elintarvikkeet/34972), [savupaprikan saman EAN:n pakkaustiedot](https://www.s-kaupat.fi/tuote/santa-maria-37g-paprika-smoked-savupaprikajauhe/7311311015243), [USDA SR Legacy](https://fdc.nal.usda.gov/download-datasets/).
