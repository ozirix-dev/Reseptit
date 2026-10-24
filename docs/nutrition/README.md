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

## Pienten puuttuvien määrien pysyvä käytäntö

Ravintoarvot ovat suuntaa-antavia reseptiarvioita. Pieniä puuttuvia määriä ei
tarvitse käyttää syynä koko reseptin hylkäämiseen, kun niiden suurin uskottava
vaikutus annosta kohti voidaan rajata ja dokumentoida. Laskentamalli sallii
julkaisun vain, jos kaikkien pois rajattujen ainesten ylärajat yhteensä ovat
enintään:

| Ravintoarvo | Sallittu puuttuvan määrän epävarmuus / annos |
| --- | ---: |
| Energia | 10 kcal |
| Nettohiilihydraatti | 1 g |
| Kokonaishiilihydraatti | 1 g |
| Proteiini | 1 g |
| Rasva | 1 g |

Raja koskee vain reseptistä puuttuvia pieniä määriä, ei lähdetietueiden,
tuotemerkkien tai valmistuksen yleistä vaihtelua. Ylärajat lasketaan yhteen;
useita pieniä mausteita ei käsitellä erikseen sallittuina täysinä poikkeamina.
Poissuljetun aineksen yhteydessä kirjataan syy, yläraja ja sen lähde tai
perustelu. Vesi ja suola voidaan rajata pois, kun niiden makroravinnevaikutus
on lähteen mukaan nolla. Kuivat mausteet, valkosipuli ja yrtit arvioidaan
reseptin ilmoittaman yksikön tai dokumentoidun tavanomaisen enimmäismäärän
mukaan.

Öljyä, voita, sokeria, hunajaa, makeutusainetta, kastiketta, pähkinöitä,
juustoa, lihaa, kalaa tai muuta energia- tai hiilihydraattipitoista pääainesta
ei saa kuitata pieneksi tai nollaksi. Jos sen määrä tai tuote on epäselvä,
resepti tarkennetaan tai arvo jätetään julkaisematta. Samoin toimitaan, jos
hiilihydraattien yläraja ylittää annoskohtaisen gramman rajan. Näin yksittäiset
mausteet eivät pysäytä arviota, mutta olennaiset ainesosat eivät katoa
laskennasta.

### Tarkat määrät resepteissä

Jokaisessa uudessa tai ravintoarvoiltaan päivitettävässä reseptissä ilmoitetaan
määrä ja yksikkö kaikille öljyille ja rasvoille, sokereille ja makeuttajille,
hunajalle ja siirapeille, kastikkeille ja tiivisteille, pähkinöille ja siemenille,
juustoille, lihalle, kalalle ja siipikarjalle sekä pizzan täytteille. Käytä
ensisijaisesti punnittavaa g-määrää; nesteille ml käy. Älä jätä näitä määriä
muotoon "maun mukaan", "tarpeen mukaan", vapaa valinta tai tyhjä määrä.
Valinnaisellekin määrälle annetaan laskettava oletus ja kerrotaan, että määrää
voi säätää. Tuotemerkistä riippuvissa tiivisteissä annetaan reseptin oletusmäärä
ja kehotetaan tarkistamaan pakkauksen annostus.

Uppopaistorasvan ravintoarvoon kirjataan koko erään arvioitu ruokaan imeytyvä
määrä grammoina. Ohjeessa kerrotaan erikseen, kuinka paljon öljyä tarvitaan
keittimeen tai kattilaan sekä että ylimääräinen öljy valutetaan pois. Kattilaan
kaadettua määrää ei lasketa syödyksi määräksi.

Tämä sääntö koskee kaikkia uusia reseptejä ja ravintoarvopäivityksiä. Vanhojen
julkaisujen poikkeamat ovat siirtymävelkaa: niitä ei saa lisätä uusiin
reseptiversioihin, ja ne tarkennetaan ennen kyseisen reseptin ravintoarvojen
seuraavaa laskentaa.

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

Sokerit, kuitu ja polyolit ovat erillisiä kenttiä. Nettohiilihydraatti
lasketaan vähentämällä imeytyvästä hiilihydraatista vain lähteessä ilmoitettu,
määrältään tunnettu polyoli. Tuntematon polyoliarvo ei ole nolla eikä sitä
vähennetä. Jos polyolien määrä ylittää imeytyvän hiilihydraatin, tietue
vaatii tarkistuksen. Tämä koskee myös erytritolia: vähennys tehdään vain
tuotteen tai tietokannan nimenomaisen koostumustiedon perusteella.

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
  kopioinnin, muokkauksen ja jakelun lähdemaininnalla ilman Health Canadan
  hyväksynnän vaikutelmaa
  ([lisenssiehdot](https://open.canada.ca/en/open-government-licence-canada)).
  Health Canadan [CNF 2026 -käyttöopas](https://open.canada.ca/data/dataset/1b6139bd-ed7e-4043-bc28-ff00e10f3109/resource/86483321-6c76-4a5f-9061-04b9a0a48a8d/download/canadian-nutrient-file_users-guide_2026.pdf)
  pyytää huolellisuutta eikä salli ravintoarvon muuttamista; siksi tämän
  viiteaineiston lähdearvot on säilytetty täsmälleen alkuperäisinä.
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
- Koneella ollut Fineli Rel20 -paketti lisättiin täydemmäksi paikalliseksi
  viiteaineistoksi `fineli-release-20-reference.json`. Se sisältää 4 238
  tietuetta, joista 3 995:llä on numeerisesti ilmoitettu CHOAVL-, FIBT-,
  SUGOH-, PROT- ja FAT-arvo. Aineiston 4 238 lähdetunnistetta ja nimet ovat
  uniikkeja; valituissa makroissa ei havaittu negatiivisia tai yli
  100 g/100 g -arvoja. Lähteen `foodaddunit.csv`-taulukosta säilyy
  7 347 ruokakohtaista mittaa (ruokalusikka, teelusikka, dl, l ja kpl-koot)
  3 247 ruoalle. Yleistä muunnosta ei tehdä, vaan yksikkömuunnos edellyttää
  täsmällistä ruokatietuetta ja samankokoista Fineli-yksikköä.
  Aineisto voidaan tuottaa uudelleen komennolla
  `python tools/import-fineli-reference.py <Fineli-Rel20.zip>
  docs/nutrition/fineli-release-20-reference.json`.
- FSANZ:n Australian Food Composition Database Release 3:n lähdeprofiilit
  tarkistettiin 24.10.2026 ja lisättiin erilliseksi viiteaineistoksi
  `afcd-release-3-reference.json`. Aineisto sisältää 1 588 ruokaa, viisi
  laskennan perusmakroa, AFCD:n hiilihydraatit sokerialkoholeilla ja ilman
  sekä saatavilla olevat erilliset polyolirivit. Jokaisella tietueella
  säilyvät lähdetunniste, nimi, luokitus ja tietojen alkuperäluokka.
  Lähdeprofiilin 1 588 tunnistetta ovat uniikkeja, normalisoituja
  duplikaattinimiä ei havaittu, kaikki 1 588 tietuetta sisältävät viisi
  vaadittua perusmakroarvoa eikä valituissa makroissa havaittu negatiivisia
  tai yli 100 g/100 g -arvoja. Puuttuva polyoliarvo on silti tuntematon, ei
  nolla.

  AFCD:n julkaistun määritelmän mukaan `Available carbohydrate, without
  sugar alcohols` on imeytyvä hiilihydraatti ilman polyoleja, ja versio `with
  sugar alcohols` lisää laskentaan sorbitolin, mannitolin ja glyserolin.
  Muita erillisiä polyolirivejä (erytritoli, maltitoli ja ksylitoli) ei
  sisällytetä tähän kaavaan. Siksi AFCD-tietueita ei voi siirtää Finelin
  laskentamalliin suoraan yhdellä sarakekartoituksella. Erillinen viitepoiminta
  ei vielä ole laskennan hyväksytty lähdeadapteri, eikä sitä käytetty uusien
  reseptiarvojen julkaisemiseen.

  FSANZ sallii kopioinnin ja muokkauksen lisenssiehtojen täyttyessä. Ehtoihin
  kuuluu johdannaisen CC BY-SA 3.0 Australia -lisenssi, FSANZ-attribuutio,
  datarajoituslausuma ja Australian dataa koskeva käyttörajaus jokaisessa
  jaetussa kopiossa. Nämä tiedot on upotettu viiteaineiston `source`-metatietoihin.
  Lähde-XLSX muunnettiin JSONiksi ja rajattiin ravintoarvoihin, mutta arvot
  säilytettiin muuttamatta. Aineiston voi tuottaa uudelleen komennolla
  `python tools/import-afcd-reference.py <afcd-nutrient-profiles.xlsx>
  docs/nutrition/afcd-release-3-reference.json`.

Ei kokonaisia tietokantoja, tuotetekstejä tai kuvia kopioitu. CNF:stä on mukana
vain yllä rajattu, lähderivien perusteella täydellinen osajoukko.
Seuraava kierros tarvitsee nimetyt tuotteet, syötävät punnitut määrät,
ainekohtaiset muunnokset, valmistussaannon ja tarkistetut tietueet.

## Reseptiarvioiden erät, 24.10.2026

Viiden erän ravintoarviot, Fineli-tietueiden ID:t ja yksikköoletukset on
kirjattu seuraaviin muistioihin:

- `estimates-2026-10-24.md` — erä 1, 10 reseptiä.
- `estimates-2026-10-24-batch-2.md` — erä 2, 20 reseptiä.
- `estimates-2026-10-24-batch-3.md` — erä 3, 10 reseptiä.
- `estimates-2026-10-24-batch-4.md` — erä 4, 10 reseptiä.
- `estimates-2026-10-24-batch-5.md` — erä 5, 12 reseptiä; paikallinen Fineli Release 20 täydennettynä dokumentoiduilla AFCD- ja pakkaustiedoilla.
- `tools/calculate-nutrition-batch5.py` — erän 5 toistettava laskentatiedosto.

Luvut ovat toimituksellisia arvioita; niitä ei tuoteta julkaisun buildissa
automaattisesti. Kokonaishiilihydraatit on lisätty yhteensä 62 reseptille
Finelin CHO-, FIBT- ja POLYL-komponenttien pohjalta. Lähdepoiminta on
`food-records.json`-tiedostossa tai eräkohtaisessa paikallisessa Fineli-
viitepoiminnassa. Fineli-attribuutio ja lisenssi kirjataan jokaiseen muistioon.

## Nykyisten lukujen luokitus

VERIFIED vaatii todennetun koko laskelman; ESTIMATE WITH EVIDENCE vaatii
toistettavan, rajauksiltaan ilmoitetun arvion. INSUFFICIENT SOURCE DATA
tarkoittaa puuttuvaa laskentanäyttöä. CONFLICT REQUIRES REVIEW tarkoittaa
ristiriitaa, ei lupaa korvata lukua. MISSING tarkoittaa, ettei numeroita ole.
Arvion tekstimerkintä yksin ei ole laskentatodiste.
