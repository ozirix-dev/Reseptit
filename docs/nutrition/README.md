# Ravintoarvojen laskentapohja

Toimituksellinen, paikallinen laskentatyökalu. Sivuston build ja tiukka
ravintoarvoauditointi varmistavat, että julkaistut luvut vastaavat dokumentoitua
laskentaa.

Suorita `site/`-kansiossa `npm run audit:nutrition`.
Tuloksena on `tmp/nutrition/audit.json`: kaikkien julkaistujen FI-lähteiden
inventaariorivit ja kolmen keskeneräisen pilotin aineskohtaiset puutteet. `--snapshot`
tallentaa tarkistuskierroksen tuloksen tähän hakemistoon. Auditointikuva
päivitettiin 24.10.2026, ja laskentamuistiot sekä Fineli- ja AFCD-
viiteaineistot sisältyvät lähdetiivisteeseen. Uudet irralliset
laskentamuistiot pitää lisätä lähteiden inventaarioon erikseen.

`food-records.json` sisältää vain käytetyn pienen lähdeotoksen.
`nutrition-model.ts` erottaa lähdetietueen, ainesmäärän, tuotteen vastaavuuden,
syötävän osuuden, tilan ja valmistuksen retention eli säilyvän ravintomäärän.
Laskennan syöte sisältää reseptin ID:n, lähdetiivisteen, laskentapäivän,
rajauksen ja tarkistajan tilan. Osatulokset eivät muutu koko reseptin arvoksi.

Jokaisen evidenssillä tuetun arvion uudelleenlaskettava syöte tallennetaan
tiedostoon `calculations/<recipe_id>.json`. Auditointi laskee syötteen uudelleen,
tarkistaa reseptin ainesmäärät ja annoskoon sekä vertaa neljää ravintoarvoa FI-
reseptiin ja sen julkaistuihin käännöksiin. Muistio tai tunnuslista ei yksin
riitä `ESTIMATE WITH EVIDENCE` -luokitukseen. Jos vanhalta arviolta puuttuu
toistettava syöte, sen julkaistut arvot säilyvät mutta audit luokittelee sen
`INSUFFICIENT SOURCE DATA` -tilaan, kunnes syöte on koottu.

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
- Finelin CHOAVL tarkoittaa tärkkelyksen ja sokereiden määrää. Siitä ei
  vähennetä polyoleja toistamiseen. Nettohiilihydraatti vähennetään
  polyoleista vain silloin, kun lähteen hiilihydraattiarvo sisältää ne.
  Kokonaishiilihydraatti on saatavilla oleva hiilihydraatti + kuitu +
  lähteistetyt polyolit.
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
- [Foodin, Erytritoli Luomu 200 g](https://foodin.fi/tuote/erytritoli-luomu-200g-2/):
  tuotteen ainesosaluettelo nimeää erytritolin ainoaksi ainesosaksi ja
  tuotetietotaulukko ilmoittaa 100 g hiilihydraattia, josta 100 g
  sokerialkoholeja, sekä 0 g rasvaa ja proteiinia. Tuotesivun nollaenergiaa
  ei käytetä makrolaskennassa. Tallennettu yksittäiseksi tuoteviitteeksi;
  lähteellä ei ole avoimen tietokannan lisenssiä. Tuotetiedon
  hiilihydraattimääritelmä sisältää polyolin, joten normalisointi tuottaa
  0 g imeytyvää hiilihydraattia ja 100 g kokonaisuutta. Finelin tietue 35481
  antaa tästä tuotteesta poikkeavasti nollan polyoliarvolle, joten sitä ei
  käytetä erytritolin lähteenä.
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
  Tuotekohtaiset tiedot liitetään laskentaan vain, kun reseptissä on valittu
  sama tuote. Erän 6 kai jiew -reseptissä kalakastike täsmennettiin Squid
  Brand -tuotteeksi; sen 100 g ravintoarvot ovat OFF-tietueessa
  `13692210`. Tämä tuoteviite on lisensoitu ODbL 1.0 -ehdoin, eikä sitä
  yhdistetä Fineli-poimintaan.
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
  sisällytetä tähän kaavaan. AFCD-tietueita ei siis siirretä Finelin
  sarakekartoituksella: lähteistetty polyolilisä lasketaan saman tietueen
  saatavilla olevien hiilihydraattien `with`- ja `without`-arvojen erotuksena,
  ja muut erilliset polyolit jäävät tuntemattomiksi, jos niille ei ole
  tietuetta. Thai-erän 6 käytetyt AFCD-tietueet, tunnisteet ja lisenssiehdot
  on kirjattu erämuistioon.

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

Kahdeksan aiemman erän ravintoarviot, Fineli-tietueiden ID:t ja yksikköoletukset on
kirjattu seuraaviin muistioihin:

- `estimates-2026-10-24.md` — erä 1, 10 reseptiä.
- `estimates-2026-10-24-batch-2.md` — erä 2, 20 reseptiä.
- `estimates-2026-10-24-batch-3.md` — erä 3, 10 reseptiä.
- `estimates-2026-10-24-batch-4.md` — erä 4, 10 reseptiä.
- `estimates-2026-10-24-batch-5.md` — erä 5, 12 reseptiä; paikallinen Fineli Release 20 täydennettynä dokumentoiduilla AFCD- ja pakkaustiedoilla.
- `tools/calculate-nutrition-batch5.py` — erän 5 toistettava laskentatiedosto.
- `estimates-2026-10-24-batch-6.md` — erä A:n kaksi aiemmin viimeisteltyä reseptiä.
- `tools/calculate-nutrition-batch6.py` — erän 6 laskennan toistettava ohjelma.
- `estimates-2026-10-24-batch-7.md` — erä A:n kahdeksan muuta reseptiä.
- `tools/calculate-nutrition-batch7.py` — erän 7 laskennan toistettava ohjelma.
- `estimates-2026-10-24-batch-8.md` — Thai-erä B:n kymmenen reseptiä.
- `tools/calculate-nutrition-batch8.py` — erän 8 laskennan toistettava ohjelma.
- `batches/batch-10.json` — 20 reseptin erämanifesti ja lähdemäppäykset.
- `calculations/<recipe_id>.json` — erän 10 reseptikohtaiset syötteet,
  lähdetietueet, muunnokset ja rajaukset.
- `estimates-2026-10-24-batch-10.md` — erän lähdemuistio ja poikkeamat.
- `batches/batch-11.json` — seuraavan 20 reseptin lähdemäppäykset ja laskennan rajaus.
- `calculations/<recipe_id>.json` — erän 11 reseptikohtaiset syötteet,
  lähdetietueet, muunnokset ja poisrajausten ylärajat.
- `estimates-2026-10-25-batch-11.md` — erän valinnat, lähdevastaavuudet ja
  laskennan arviointi.
- `batches/batch-12.json` — erän 12 20 reseptin täsmälliset lähdemäppäykset.
- `calculations/<recipe_id>.json` — erän 12 uudelleenlaskettavat
  ainesosasyötteet, lähdetietueet, yksikkömuunnokset ja rajaukset.
- `estimates-2026-10-25-batch-12.md` — erän 12 laskentaperusteet, poikkeamat,
  lähteet, arvot ja prosessin auditointi.

Erissä 1–8 käytettiin aikaisempia laskentatyökaluja, jotka säilyvät niiden
laskentojen historiallisina lähteinä. Uudet erät on luotava nykyisellä
TypeScript-mallilla ja manifestilla; uutta rinnakkaista eräkohtaista kaavaa ei
lisätä.

Luvut ovat toimituksellisia arvioita; niitä ei tuoteta julkaisun buildissa
automaattisesti. Aiemmat arvot käyttävät Finelin CHO-, FIBT- ja POLYL-
komponentteja. Uudet erät lasketaan yhteisellä `nutrition-model.ts`-mallilla
batch-plan-syötteestä (`npm run nutrition:batch -- <polku.json>`). Erämanifesti
on `docs/nutrition/batches/`-hakemistossa ja reseptikohtainen täydellinen
laskentasyöte `docs/nutrition/calculations/`-hakemistossa. Lähdetietueiden
arvot, tunnisteet, lisenssit, vastaavuudet, muunnokset ja rajaukset tallentuvat
laskentasyötteeseen. Audit laskee arvot tästä syötteestä uudelleen ja vertaa
niitä julkaistuun suomenkieliseen sisältöön sekä kaikkiin julkaistuihin
käännöksiin kahden desimaalin tarkkuudella.

## Nykyisten lukujen luokitus

VERIFIED vaatii todennetun koko laskelman; ESTIMATE WITH EVIDENCE vaatii
toistettavan, rajauksiltaan ilmoitetun arvion. INSUFFICIENT SOURCE DATA
tarkoittaa puuttuvaa laskentanäyttöä. CONFLICT REQUIRES REVIEW tarkoittaa
ristiriitaa, ei lupaa korvata lukua. MISSING tarkoittaa, ettei numeroita ole.
Arvion tekstimerkintä tai reseptitunnuksen sallittu lista yksin ei ole
laskentatodiste. Aiemmat sivuarvot säilyvät näkyvissä, mutta ilman
toistettavaa laskentasyötettä ne luokitellaan riittämättömäksi lähdenäytöksi.


## GK-pilotti, 20 reseptiä

GK-laskennan koko Fineli Rel20 -viiteaineisto on `fineli-release-20-reference.json`. Se sisältää 4 238 Fineli-tietuetta sekä ruoka-ainekohtaisia annosmittoja; sen lähde-ID:t, imeytyvän hiilihydraatin CHOAVL, kuidun FIBT ja polyolit SUGOH säilytetään. Pilotin `food-records.json` sisältää vain laskennassa tarvittavan pienen tietuejoukon. Reseptimäärät otetaan reseptien rakenteisista aineksista, ja muu kuin grammamäärä muunnetaan vain Fineli-tietueen omalla massalla.

`glycemic-load-pilot-input.json` ja `glycemic-index-records.json` sisältävät ainesosakohtaiset vastaavuudet, GI-lähteet ja epävarmuudet. GK-sivulla on nyt 260 reseptin tulosriviä, joista 167 sisältää lasketun arvion ja 93 on keskeneräisiä. Yhteensä 261 reseptiä 325:stä on tarkistettu; 64 odottaa käsittelyä. Massaman-curryn GK on vaihteluväli noin 5–6 annosta kohti; vaihtelu kuvaa currytahnan lähde-eroa, ei koko laskelman virhemarginaalia. Erä 12 lisää matalan luottamuksen lähdetietueet kuskusille ja hirssille (puolalainen ihmistutkimus, n=8 kullekin) sekä keitetyille kuiville riisinuudeleille (vietnamilaisia ruokia vertaileva ihmistutkimus, n=12). Näiden lähteiden valmistustapa- ja tuotevastaavuusrajat on kirjattu yksittäisiin GI-tietueisiin. Maksalaatikolle ei julkaista GK-kokonaislukua, koska aiempi 3,45-arvio käytti maksalle mittaamatonta nolla-GI-oletusta. Laajat ruoka-aineryhmien keskiarvot ja epäsuorat lähdeosumat ovat matalan luottamuksen arvioita, eivät ruokalajikohtaisia mittauksia. Laskelma on ainesosista tehty arvio, ei valmiin aterian mittaus.

### GK-laadunvarmistuksen tila 25.10.2026

Yllä oleva erätilanne on historiallinen. Auditointi tehtiin lähde-SHA:sta
`3e410436a82df391075f7a762c23f011624a8ca6`; vertailukohta on viimeisin
GK-katselmus `b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5`. Kaikki 325 reseptiä
tarkistettiin. Uudessa auditissa 112 GK-kokonaisarviota on laskettu ja 213
keskeneräisiä. Aiemmista 190 arviosta 78 estyy edelleen: 72 reseptin sidottu
ainesosa- tai valmistusrakenne on muuttunut, ja muilla estävä lähde tai määrä
puuttuu. Katso ennen/jälkeen luvut tiedostoista
`glycemic-load-quality-audit-2026-10-25.json` ja
`glycemic-load-before-after-2026-10-25.json`.

Laskennan kaava on `sum(GI_i × imeytyvä hiilihydraatti_i annosta kohti) / 100`.
Reseptin sidonta kattaa tunnisteen, annosmäärän, järjestetyt ainesosanimet,
määrät, yksiköt ja huomiot, valmistustavan, valmistusohjeen sekä muistiinpanot.
Toinen fingerprint sitoo laskentasyötteen: Fineli- ja GI-tunnisteet, määrät,
annosmuunnokset, lähdeperustelut ja oletukset. Molemmat tarkistetaan joka
auditissa ja buildissa. Jos sidottu ainesosa, määrä, annos, valmistus tai
laskentasyöte muuttuu, vanha kokonaisarvio estyy. Sidoksen päivittäminen
edellyttää ainesosamäppäyksen ja lähteiden uudelleenarviointia. Nimenmuutoksen
voi hyväksyä vain lähteistettynä alias-vastaavuutena tiedostossa
`glycemic-load-recipe-aliases.json`.

Alle 1 g/annos ainesosakohtaisia osuuksia ei poisteta yksittäin. Lähteistetty
hiilihydraatti lasketaan aina, jos valittuun GI-tietueeseen on hyväksyttävä
osuma. Jos GI-osuma puuttuu, tällainen pienosuus voidaan jättää toimituksellisella
toleranssilla pois vain, kun kaikkien pois jätettävien osuuksien yhteismäärä jää
alle 1 g/annos. Toleranssi on käyttäjän ymmärrettävyyteen tarkoitettu toimituksellinen
raja, ei kliininen virhemarginaali. Pois jätetty hiilihydraattimäärä näytetään
käyttäjälle ja tulos merkitään matalan luottamuksen arvioksi. Kun yhteissumma on
vähintään 1 g/annos, resepti tarvitsee GI-lähteen tai kokonaisarvio estetään.
Tuntematon määrä ei kuulu toleranssiin eikä muutu nollaksi.

GI-lähdepolitiikka erottaa tutkimuksen menetelmällisen laadun ruoka- ja
valmistustapavastaavuudesta. Julkaistua `STRONG`-arvoa käytetään suoraan vain,
kun ruoka-aineen ja valmistuksen avaimet täsmäävät. Julkaistua ja jäljitettävää
analogiaa voidaan käyttää, jos valmistustapa täsmää ja ruoka-ainetta koskeva
perustelu on dokumentoitu; se alentaa luottamuksen matalaksi. Elintarvikeryhmän
keskiarvo voidaan näyttää vain selvästi yleisenä matalan luottamuksen
arviona, ei yksittäisen ruoan mitattuna GI-arvona. Julkaisematon, eri asteikon
tai perustelematon GI-tieto estää olennaisen osuuden laskennan.

Vertailussa 112 reseptin GK-numero muuttui aiempaan laskettuun arvoon nähden;
65 muutosta oli numeerisia. Kahdeksan aiempaa nollaa muuttui positiiviseksi.
Yksi muutos oli vähintään 1 GK-yksikkö annosta kohti (`kanakeitto-pinaatti-sitruuna`:
1,00 → 2,31). Tässä toimituksellisessa vertailussa selvästi tulkintaan vaikuttavia
muutoksia oli 9: kahdeksan nollasta positiiviseksi sekä yksi vähintään 1 yksikön
muutos. Yhden yksikön vertailuraja on auditointia varten, ei kliininen raja.
Kolmen nykyisen alle-toleranssin tuloksen sisäinen summa on pyöristetty nollaan;
ne esitetään vain noin-arvioina ja niiden pois jätetty hiilihydraatti ilmoitetaan.
Maksalaatikon aiempi 3,45-arvio pysyy estettynä, koska maksan GI-arvoa ei ole
osoitettu.

GK on ainesosakohtaisista GI- ja hiilihydraattiarvoista laskettu arvio, ei
valmiista ateriasta mitattu GI eikä yksilöllinen verensokerivaste. Julkisella
reseptisivulla arvo esitetään noin-arviona enintään yhden merkitsevän numeron
tarkkuudella. Luottamustaso, pois jätetty pieni hiilihydraattimäärä ja
menetelmälinkki näkyvät reseptisivulla.
