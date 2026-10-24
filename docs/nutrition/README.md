# Ravintoarvojen laskentapohja

Toimituksellinen, paikallinen työkalu. Ei yhteyttä julkisen sivuston
buildiin eikä automaattista metatietojen päivitystä.

Suorita `site/`-kansiossa `npm run audit:nutrition`.
Tuloksena on `tmp/nutrition/audit.json`: kaikkien julkaistujen FI-lähteiden
inventaariorivit ja viiden pilotin aineskohtaiset puutteet. `--snapshot`
tallentaa tarkistuskierroksen tuloksen tähän hakemistoon. Auditointikuva
päivitettiin 24.10.2026, ja neljän erän laskentamuistiot sekä
Fineli-ruokatietueet sisältyvät nyt laskennan lähdetiivisteeseen. Uudet
irralliset laskentamuistiot pitää lisätä lähteiden inventaarioon erikseen.

`food-records.json` sisältää vain käytetyn pienen lähdeotoksen.
`nutrition-model.ts` erottaa lähdetietueen, ainesmäärän, tuotteen vastaavuuden,
syötävän osuuden, tilan ja valmistuksen retention eli säilyvän ravintomäärän.
Laskennan syöte sisältää reseptin ID:n, lähdetiivisteen, laskentapäivän,
rajauksen ja tarkistajan tilan. Osatulokset eivät muutu koko reseptin arvoksi.

## Laskentasäännöt

- Ravintomäärä = arvo / 100 g × määrä × g/yksikkö × syötävä osuus × retentio.
- Vain g ja kg muunnetaan ilman aineskohtaista näyttöä. Ml, dl, tl, rkl,
  l ja kpl tarvitsevat yksilöidyn tuotteen/punnituksen g/yksikkö-arvon.
- Tuntematon kuorimis-, valutus-, paisto- tai marinadihävikki estää
  laskennan. Raaka- ja kypsäpainoja ei yhdistetä eri tietueisiin.
- Koko reseptin tietty ravintoarvo syntyy vain kaikkien mukana olevien
  aineksien saman ravintotekijän ollessa tiedossa. Puuttuva ei ole nolla.
- Annosarvo lasketaan pyöristämättömästä summasta. Pyöristys on lopuksi
  enintään kaksi desimaalia; se ei ole väite lähtötiedon tarkkuudesta.
- Valinnainen aines voidaan jättää pois vain kirjatussa skenaariossa.
  Lisäkkeitä ei päätellä kuvasta eikä määrittelemätöntä öljyä keksitä.

## Hiilihydraatit

Laskennan `carbohydrate` tarkoittaa aina imeytyvää, kuidun poissulkevaa
hiilihydraattia. `EU_AVAILABLE` kirjataan sellaisenaan.
`US_TOTAL_INCLUDING_FIBRE` muunnetaan vähentämällä tunnettu kuitu täsmälleen
kerran. Tuntematonta määritelmää ei yhdistetä laskelmaan.

Sivun `carbs_total_per_serving_g` tarkoittaa kokonaishiilihydraattia:
imeytyvä hiilihydraatti + ravintokuitu + polyolit. Tulos voidaan laskea vain,
kun kaikkien mukaan otettujen ainesten imeytyvä hiilihydraatti, kuitu ja
polyolit tunnetaan; puuttuva arvo ei ole nolla. Nettohiilihydraatti pysyy
erillisenä arvona.

Finelin API:ssa komponenttitunniste ratkaisee merkityksen, ei hakutuloksen
yleisotsikko: `CHO` (komponentti 2034) on kuvauksen mukaan imeytyvä
hiilihydraatti ja `FIBT` (komponentti 2168) kokonaisravintokuitu. Arvot
yhdistetään vain komponenttimetadatan tunnisteilla. Hakuvasteen yleistä
`fiber`-kenttää ei käytetä laskennassa, koska se on palauttanut epäluotettavia
nollia. Polyolit säilytetään omana komponenttinaan ja lasketaan mukaan
kokonaishiilihydraattiin, kun niiden määrä tunnetaan.

Sokerit, kuitu ja polyolit ovat erillisiä kenttiä. NetCarbohydrate syntyy
tässä varovaisessa pilotissa vain, jos polyolit ovat todistetusti nolla.
Erytritolia tai muita polyoleja ei vähennetä automaattisesti. Jos tuotteen
polyolikoostumus on epäselvä, nettoarvo jää puuttumaan.

## Lähteet ja käyttöehdot, tarkistettu 22.10.2026

- [THL / Fineli, avoin data](https://fineli.fi/fineli/fi/avoin-data): CC BY 4.0,
  nimeä THL ja Fineli, älä anna kuvaa THL:n hyväksynnästä. Käytetty pieni
  numeropoiminta tietueesta 34255; tietueen indeksoitu virallinen sivu löytyi,
  mutta suora sivulataus palautti aikakatkaisun/403:n. Sen nykyhetken
  muuttumattomuutta ei vahvistettu. Kauraleseen tietue 170 tunnistettiin
  virallisen reseptin linkistä, mutta arvoja ei saatu luotettavasti luettua.
- [USDA FDC API Guide](https://fdc.nal.usda.gov/api-guide/): tiedot ovat
  public domain, lähdemaininta suositeltu; API käyttää avainta. Tässä ei
  kopioitu tietokantaa eikä hankittu tai tallennettu avaimia.
  [FDC Foundation Foods -määritelmät](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/)
  kuvaavat carbohydrate by difference -kentän. USDA-lukuja ei käytetty
  pilotissa ilman täsmällistä raaka-ainevastaavuutta.
- [Valio Keittiön kuohukerma](https://www.valio.fi/tuotteet/valio-keittion-kuohukerma-laktoositon/):
  todellinen tuotteen ravintosisältö on saatavilla, mutta lähdereseptit
  eivät yksilöi tätä tuotetta. Tuotesivu ei ratkaise dl→g-muunnosta.
  [Valion käyttöehdoissa](https://www.valio.fi/kayttoehdot/valion-verkko-ja-mobiilipalvelun-kayttoehdot/)
  ei ole yleistä avointa uudelleenkäyttölisenssiä; verkkosisällöstä ei
  rakennettu ravintotietokantaa. Pyydä tarvittaessa käyttölupa tai käytä
  dokumentoitua pakkausmerkintää ja tarkista sen käyttöoikeus.

### Muut avoimet tietokannat, tarkistettu 24.10.2026

- USDA FoodData Centralin [API-ohje](https://fdc.nal.usda.gov/api-guide/)
  kertoo aineiston olevan CC0 1.0 -lisenssillä ja suosittelee lähdemainintaa.
  [Foundation Foods -lataus](https://fdc.nal.usda.gov/download-datasets/)
  tarkistettiin huhtikuun 2026 CSV-pakettina. Sen `food_nutrient.csv` sisältää
  hiilihydraatti (1005), ravintokuitu (1079), proteiini (1003) ja rasva (1004)
  -arvoja, mutta latauksessa ei ollut yhtään `Total sugar alcohols` (1086)
  -arvoriviä. USDA määrittelee hiilihydraatin by difference -arvon kuitua
  sisältäväksi [Foundation Foods -dokumentaatiossa](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/).
  Siksi tätä poimintaa ei voi muuntaa tämän projektin kokonaishiilihydraatiksi
  ilman polyolien erillistä lähdearvoa. Pakettia ei lisätty laskennan
  ruokatietueisiin; CC0 sallii käytön, mutta puuttuva ravintotekijä ei muutu
  luvaksi olettaa nollaa.
- Open Food Facts ilmoittaa tietokannan ODbL-lisenssistä,
  nimeämisvelvollisuudesta ja share-alike-ehdosta
  ([lisenssiohje](https://github.com/openfoodfacts/openfoodfacts-server/blob/main/docs/api/tutorials/license-be-on-the-legal-side.md)).
  Tuotekohtaiset pakkaustiedot eivät myöskään vastaa yleisnimisiä reseptiaineksia
  ilman tuotemerkkiä ja tuotteen valintaa. Sitä ei yhdistetty Fineli-poimintaan.
- Health Canadan [Canadian Nutrient File 2026](https://open.canada.ca/data/en/dataset/1b6139bd-ed7e-4043-bc28-ff00e10f3109)
  on julkaistu Open Government Licence – Canada -lisenssillä. Lisenssi sallii
  kopioinnin, muokkauksen ja jakelun lähdemaininnalla
  ([lisenssiehdot](https://open.canada.ca/en/open-government-licence-canada)).
  Paikalliseen raakaviitekantaan tuotiin 1 449/5 993 tietuetta, joilta löytyvät
  eksplisiittiset lähderivit proteiinille (203), rasvalle (204), kokonaishiilihydraatille
  by difference (205), kuidulle (291), mannitolille (260) ja sorbitolille (261).
  Nutrient-arvot on säilytetty lähteen merkkijonoina ilman numeerista muunnosta;
  jokaisessa tietueessa säilyvät myös ravintoaineen lähdekoodi ja päivityspäivä.
  4 544 ruokaa jätettiin tästä osajoukosta pois puuttuvien komponenttirivien
  vuoksi, eikä puuttuvaa arvoa täytetty nollalla. Koko CNF:ssä ei ole
  duplikaattitunnisteita; yksi normalisoitu englanninkielinen nimi toistuu
  tunnisteilla 6239 ja 6433. Molemmat pidetään erillään. Tuoduissa 1 449
  tietueessa ei ole duplikaattinimiä, negatiivisia valittuja arvoja tai
  yli 100 g/100 g makroarvoja.
  Aineiston kokonaishiilihydraatti sisältää kuidun, ja polyolikentät kattavat
  vain mannitolin ja sorbitolin. Siksi tietueet ovat paikallinen lähdehaku,
  eivät vielä laskentamalliin kytkettyjä Fineli-komponentteja. Raakapoiminta
  on `cnf-2026-reference.json`; sen voi tuottaa uudelleen komennolla
  `python tools/import-cnf-reference.py <cnf-2026.zip> docs/nutrition/cnf-2026-reference.json`.
- Paikallisessa Fineli-poiminnassa on 69 tietuetta, joilla on 69 uniikkia
  lähdetunnistetta ja 69 uniikkia täsmälleen normalisoitua nimeä. Koko ladatussa
  Fineli-paketissa on 4 238 tietuetta ja samoin uniikit lähdetunnisteet sekä
  nimet. Täsmänimien duplikaatteja ei löytynyt; samankaltaisia versioita ei
  yhdistetä automaattisesti, koska niiden ravintoarvot voivat erota.

Ei kokonaisia tietokantoja, tuotetekstejä tai kuvia kopioitu. CNF:stä on mukana
vain yllä rajattu, lähderivien perusteella täydellinen osajoukko.
Seuraava kierros tarvitsee nimetyt tuotteet, syötävät punnitut määrät,
ainekohtaiset muunnokset, valmistussaannon ja tarkistetut tietueet.

## Reseptiarvioiden erät, 24.10.2026

Neljän erän ravintoarviot, Fineli-tietueiden ID:t ja yksikköoletukset on
kirjattu seuraaviin muistioihin:

- `estimates-2026-10-24.md` — erä 1, 10 reseptiä.
- `estimates-2026-10-24-batch-2.md` — erä 2, 20 reseptiä.
- `estimates-2026-10-24-batch-3.md` — erä 3, 10 reseptiä.
- `estimates-2026-10-24-batch-4.md` — erä 4, 10 reseptiä.

Luvut ovat toimituksellisia arvioita; niitä ei tuoteta julkaisun buildissa
automaattisesti. Kokonaishiilihydraatit on lisätty yhteensä 50 reseptille
Finelin CHO-, FIBT- ja POLYL-komponenttien pohjalta. Lähdepoiminta on
`food-records.json`-tiedostossa, ja Fineli-attribuutio sekä lisenssi on
kirjattu jokaiseen muistioon.

## Nykyisten lukujen luokitus

VERIFIED vaatii todennetun koko laskelman; ESTIMATE WITH EVIDENCE vaatii
toistettavan, rajauksiltaan ilmoitetun arvion. INSUFFICIENT SOURCE DATA
tarkoittaa puuttuvaa laskentanäyttöä. CONFLICT REQUIRES REVIEW tarkoittaa
ristiriitaa, ei lupaa korvata lukua. MISSING tarkoittaa, ettei numeroita ole.
Arvion tekstimerkintä yksin ei ole laskentatodiste.
