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

### GK-laadunvarmistuksen tila 25.10.2026 (historiallinen 1 g lähtötilanne)

Tämä tilannekuva perustuu Reseptit-lähdesisältöön
`3e410436a82df391075f7a762c23f011624a8ca6`; vertailukohta on GK-katselmus
`b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5`. Auditointi kattaa kaikki 325
julkaistua suomenkielistä reseptiä. Alun perin laskettuja arvioita oli 190 ja
keskeneräisiä 135. PR #104:n ennen jatkokorjauksia tekemässä tilannekuvassa
laskettuja oli 112, keskeneräisiä 213 ja aiemmin lasketuista 78 estyi
(21 rakenne-, 33 toleranssi-, 16 GI-lähde- sekä 8 yhdistetyn syyn tapausta).
Jatkokorjausten jälkeen laskettuja on 99 ja keskeneräisiä 226; 91 aiemmin
lasketuista ei ole tällä hetkellä laskettu. PR #104:n 112 lasketusta 86 pysyi
laskettuna; 26 estyi tarkemman tarkistuksen myötä (4 vain toleranssin ja 22
GI-vastaavuuden vuoksi). Aiemmin rakenteen vuoksi estetyistä 13 saatiin
laskettua yksilöllisen tarkistuksen jälkeen: `112 - 26 + 13 = 99`. 72
rakennemuutoksesta 21 aiemmin laskettua reseptiä käytiin yksitellen läpi; 51
muuta muuttunutta rakennetta oli jo ennestään keskeneräisiä ja pysyy
julkaisemattomana. Koneellinen auditointi ja ennen/jälkeen-rivit ovat
tiedostoissa `glycemic-load-quality-audit-2026-10-25.json` ja
`glycemic-load-before-after-2026-10-25.json`.

GK lasketaan kaavalla `sum(GI_i × imeytyvä hiilihydraatti_i annosta kohti) / 100`.
Version 2 reseptisidonta kattaa reseptitunnisteen, annosmäärän, järjestetyt
ainesosat, määrät, yksiköt, laskentaan vaikuttavat ainesosatilat ja
valmistustavan. Vapaamuotoiset ohjeet, huomiot, välimerkit ja muotoilu eivät
mitätöi arviota. Eri sidonta seuraa laskentasyötteen määrityksiä ja olennaisten
Fineli/GI-lähdetietueiden hiilihydraatti-, tila-, GI- ja vastaavuusarvoja.
Laskentaan vaikuttavan muutoksen havaitseminen estää vanhan tuloksen käytön,
kunnes muutos on tarkistettu.

GI-osuman on vastattava ruoka- ja valmistusavaimia. Julkaistu, jäljitettävä
analogia tai elintarvikeryhmän keskiarvo sallitaan matalan luottamuksen arviona
vain, kun tuoteryhmä tarkistuu; eri ryhmän osuma (esimerkiksi kookosmaito
currymaustetahnan GI-ryhmään) estetään. Julkaisematon, eri asteikon tai
perusteeton arvo ei kelpaa. GK-arvio on suuntaa-antava ainesosalaskelma, ei
valmiin aterian mittaus tai henkilökohtainen verensokerivaste.

Lähteistetyt positiiviset hiilihydraattiosuudet lasketaan, kun GI-vastaavuus
on kelvollinen. Puuttuvan GI:n pienet osuudet voidaan jättää pois vain, jos
niiden yhteissumma jää alle 1 g/annos; pois jäävä määrä näkyy ja luottamus on
matala. Raja on toimituksellinen toleranssi, ei kliininen tarkkuusraja.
Tuntematon määrä ja merkittävä puuttuva GI-lähde estävät GK:n. Toleranssi
pidettiin 1 grammassa. Kahden gramman skenaario palauttaisi 34 ja kolmen gramman
skenaario 39 nykyisin estettyä aiemmin laskettua arviota; nämä ovat
herkkyyslaskelmia, eivät puuttuvien GI-arvojen näyttöä. GI-oletuksilla 20, 50
ja 80 määritelty GK-luokka ei vaihtuisi, kun taas GI 120 -skenaariossa yksi
resepti vaihtaisi luokkaa 2 g:n ja 3 g:n vaihtoehdoissa. Politiikkaa ei muutettu.

Nykyisten 99 vertailukelpoisen GK-arvion joukossa 52 muuttui numeerisesti,
7 aiempaa nollaa muuttui positiiviseksi, ja 4 arvoa muuttui vähintään yhden
GK-yksikön. Nämä 11 tapausta ovat toimituksellisia tarkistuslippuja; yksikään
ei vaihtanut määriteltyä matalaa (≤10), keskitasoista (11–19) tai korkeaa (≥20)
luokkaa. Näin ollen luokitukseen perustuvia ruoanvalintavertailuja muuttavia
tapauksia on 0. Ennen jatkokorjausta vertailukelpoisia 112 arviota: 65
numeerista muutosta, 8 nollasta positiiviseksi, 1 vähintään yhden yksikön
muutos ja 0 määritellyn luokan muutosta. 14 aiempaa ja 11 nykyistä tulosta
ovat yhden GK-yksikön päässä luokkarajasta; rajaläheisyys ei itsessään osoita
ruokavalinnan muuttumista.

Aiemmin lasketuista estetyistä resepteistä 54 ainesosarivillä 49 reseptissä on
vähintään 1 g/annos hiilihydraattia ilman kelvollista GI-vastaavuutta. Tämä on
lähdekorjauksen työjono, ei oletus kyseisten ainesosien todellisesta GI:stä.
Koko nykyisessä joukossa 79 reseptiä ylittää pienosuuksien 1 g:n yhteisrajan.
84 aiemmin lasketun estetyn reseptin ongelmalistassa on GI-maininta, mukaan
lukien myös alle 1 g:n osuudet; luku ei tarkoita, että jokainen olisi suuri
hiilihydraattilähde. Kolme laskettua nollatulosta sisältää pienen poisjätön;
täysin vahvistettuja nollatuloksia ei ole.

Molemmat PR:t ovat Draft-tilassa. Muutoksia ei ole yhdistetty eikä julkaistu
tuotantoon. Ennen mahdollista yhdistämistä tarvitaan GK-lähde- ja
tuoteryhmävastaavuuksien katselmointi sekä päätös siitä, pidetäänkö 1 g:n
toimituksellinen toleranssi voimassa. GK-tulos esitetään noin-arviona; se ei ole
kliininen mittaustulos.
### GK-toleranssin lopullinen päätös 25.10.2026

Alla oleva aiempi 1 g:n tilannekuva säilytetään historiallisena vertailuna. Uusi
hyväksytty toimituksellinen politiikka on nyt yksittäiselle GI-osumattomalle
ainesosalle alle 1 g imeytyvää hiilihydraattia annosta kohti ja kaikkien tällaisten
osuuksien summalle alle 2 g annosta kohti. Tasan 2 g estää arvion. Yksittäisraja,
tuntemattoman määrän esto, lähteistetyn GI:n vaatimus ja väärän GI-vastaavuuden esto
säilyvät. Tämä on käyttäjälähtöinen toimituksellinen toleranssi, ei mitattu kliininen
tarkkuusraja.

Uusi koko 325 reseptin laskenta tuotti 112 GK-arviota ja 213 keskeneräistä tulosta;
aiemman 1 g:n tilannekuvan 99 lasketusta 27 palautui. Samalla 14 aiemmin laskettua
arviota jäi estetyksi tai estettiin uudelleen, koska niissä oli kelpaamaton,
perusteeton GI-osuma. Nettomuutos aiempaan tilanteeseen on +13. 135 jo aiemmin
keskeneräistä reseptiä eivät palautuneet. Aiemmin laskettujen estojen nykyjakauma on
4 vain kumulatiivisen 2 g rajan vuoksi, 72 GI-lähteen tai vastaavuuden vuoksi,
1 molemmista syistä ja 1 muun ratkaisemattoman syötteen vuoksi.

Palautuneet reseptit (kaikki matala luottamus; pois jätetty määrä näytetään):
Munakokkeli, Munakasrulla pinaatti-tuorejuustotäytteellä, Uunimuna-avokadot,
Uunimunat pinaatilla, Mehevä VHH-lihamureke, VHH-keltainen kanacurry kukkakaalilla,
Kermainen VHH-lohikeitto kukkakaalilla, Kana-fajitapelti avokadokastikkeella,
Kermainen lohipata, Gai yang – thaimaalainen grillikana VHH-lisukkeilla,
VHH-pad kee mao – tuliset kananuudelit, VHH-yum woon sen katkaravuilla ja
konjacnuudeleilla, Kreikkalaistyylinen kurkku-oliiviaamiainen, Uuniporsas
kermaisella pannukastikkeella, Hanoilainen bún chả, Yangzhoun paistettu riisi,
Amritsari-kala maustetussa kikhernejauhokuoressa, Kana-yakitori ja seesamikaali,
Karjalanpaisti ja paahdettu kaali, Gyeranbap kananmuna-riisikulho, Banh bao
kananmunalla, Scallion-pannukakut kevätsipulilla, Teehaudutetut kananmunat,
Kashmirilainen rogan josh, Marokkolainen kana-tagine sitruunalla ja oliiveilla,
Palak paneer – pinaattia ja intialaista tuorejuustoa sekä Tandoorikana uunissa.

14 aiemmin laskettua tulosta, jotka pysyvät nyt estettyinä kelpaamattoman GI-osuman
vuoksi: Caponata, Pasta alla Norma, Chettinad-kana, Raejuusto-pesto-kasviskulho,
VHH-Runebergintortut, Keto-suklaakeksit, VHH-mokkapalat, Kai jiew VHH,
Lähi-idän kikhernejauho-yrttilettu, Malesialainen congee inkiväärillä, Kiinalainen
riisipuuro kananmunalla, Thai jok kanalla, Thai porsasjok ja Yrttituorejuusto-
kinkkurullat. Alle 1 g:n hiilihydraattimäärä ei tee väärästä GI-vastaavuudesta
kelpaavaa.

27 palautuneesta 5 arvioi GK:ksi 0, koska niiden kaikille pienille positiivisille
hiilihydraattiosuuksille ei löytynyt kelpaavaa GI:tä. Kaikki viisi ovat merkitty
matalan luottamuksen noin-arvioiksi, ja pois jätetty 1,147–1,912 g/annos näytetään.
Täysin lähteistetyistä hiilihydraattimääristä ei syntynyt nollaa: nykyisistä
lasketuista nollatuloksista kaikki 8 sisältävät näkyvän poisjätön. GI 20/50/80/120
havainnollistavissa skenaarioissa palautuneiden suurin GK-lisä olisi vastaavasti
0,394 / 0,985 / 1,576 / 2,363. Määritelty GK-luokka ei muutu missään skenaariossa;
yhden merkitsevän numeron näyttö muuttuisi 16 / 22 / 23 / 23 palautuneessa
reseptissä. Skenaariot eivät ole mitattuja GI-arvoja tai epävarmuusvälejä.

Vertailukelpoisissa 112 reseptissä 52 kahden desimaalin GK-arvoa muuttui; 6 siirtyi
nollasta positiiviseksi, 5 muuttui vähintään yhdellä GK-yksiköllä ja toimituksellisen
tarkistuslipun sai 11. Luokitusmuutoksia oli 0 ja yhden merkitsevän numeron
näyttömuutoksia 24. Suurimmat edelleen estävät lähdepuutteet ovat väärät tai
perusteettomat GI-osumat ja puuttuvat GI-lähteet. Jiaozi, Paella, Jianbing ja 51 jo
aiemmin keskeneräistä rakennepoikkeamaa pysyvät estettyinä nykyisten lähdeperusteiden
mukaisesti.

Koneellinen, 325 rivin ennen/jälkeen-auditointi on
`glycemic-load-before-after-2026-10-25.json`; numeerinen yhteenveto on
`glycemic-load-quality-audit-2026-10-25.json` ja yksityiskohtainen katselmus on
`glycemic-load-quality-audit-2026-10-25.md`.

## Kattavuuskampanjan jatkaminen

Ajantasainen suunnittelupohja: [AJO 0 ja seuraava erä 2B6E](glycemic-coverage-run-0-plan.md).
[Kampanjan toimeksianto](glycemic-coverage-campaign-master-plan.md) ja
[188 keskeneräisen reseptin inventaario](glycemic-coverage-run-0-inventory.json)
säilyttävät työjonon eri istuntojen välillä. AJO 0 ei muuta julkaistuja GK-arvoja.
Tämän ohjeen vanhat kattavuusluvut ovat historiallisia; varmista nykytilanne tuoreella auditoinnilla.
