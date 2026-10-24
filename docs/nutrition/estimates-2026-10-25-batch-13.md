# Ravintoarvioiden erä 13 — 25.10.2026

Erään valittiin 20 julkaistua reseptiä, jotka puuttuivat lähtöauditista. Jokaisella on yhteisen laskentamallin tuottama lähdesyöte tiedostossa `calculations/<recipe_id>.json` ja valintaa, määriä sekä tietueita kuvaava manifesti tiedostossa `batches/batch-13.json`. Malli tallentaa laskennan reseptiversion tiivisteen, lähdetietueet, annosmäärät, tilan, muunnokset ja rajaukset. Laskenta asettaa julkaistut neljä arvoa suomenkieliselle lähdesivulle sekä olemassa oleviin käännöksiin.

## Laskentatapa ja rajaukset

Fineli Release 20:n imeytyvä hiilihydraatti (CHO 2034), kuitu (FIBT 2168) ja polyolit (POLYL 2260) säilytetään erillisinä. AFCD Release 3:n imeytyvä hiilihydraatti ja polyolit johdetaan paritetuista saatavilla olevan hiilihydraatin arvoista, joissa sokerialkoholit ovat mukana ja ilman niitä. Nettohiilihydraateista vähennetään ainoastaan lähteistetyt polyolit. Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + lähteistetyt polyolit. Puuttuvia lähdearvoja ei oleteta nolliksi. Summat jaetaan annosmäärällä ja pyöristetään vasta lopuksi kahden desimaalin tarkkuuteen.

Reseptien epäselvät määrät ja valmistusmuodot täsmennettiin ennen laskentaa: esimerkiksi riisi erotellaan kuivaan ja kypsään painoon, kana kypsään nahattomaan rintafileeseen tai raakaan nahattomaan rintafileeseen, porsaankylki ulkofileeseen josta näkyvä rasva on poistettu, sekä säilykepavut ja -kikherneet valutettuun painoon. Char siu- ja hapanimeläpossun lisäkkeeksi määritettiin 600 g kypsää pitkäjyväistä riisiä neljälle annokselle (150 g annosta kohti). Kaikki reseptissä lueteltu paistoöljy ja kastikkeet laskettiin mukaan; char siu -marinadi ja sivelyhunaja käsiteltiin kokonaan syödyiksi, mikä voi hieman yliarvioida toteutunutta määrää.

Pienet mittaamattomat mausteet rajattiin reseptikohtaisilla ylärajoilla manifestissa ja laskentatiedostoissa. Suola jätettiin pois, sillä se ei vaikuta neljään julkaistuun makroon. Rajaukset pysyvät erikseen ilmoitettujen annoskohtaisten toleranssien sisällä. Ainesosien määrä tai valittu tuote ei jäänyt ratkaisematta julkaistuissa 20 reseptissä.

Alkuperäinen ehdokas `lahi-ita-ful-medames` vaihdettiin ennen laskentaa reseptiin `kiinalainen-riisipuuro-kananmunalla`. Paikallisten Fineli-härkäpaputietueiden kuitu- ja polyolitiedot ovat puutteelliset, eikä niitä voi käyttää yhteisessä laskennassa olettamatta puuttuvia arvoja. Ful medames -reseptin sivusisältö jätettiin ennalleen. Squid Brand -kalakastikkeen nimeämä tuotetietue on paikallisessa `food-records.json`-aineistossa; Open Food Facts -tiedon ODbL 1.0 -alkuperä ja attribuutio säilytetään. Tuote sisältää anjovisuutetta, suolaa ja sokeria, eikä ainesosaluettelo osoita polyoleja.

## Lähteet ja lisenssit

Fineli Release 20 on THL:n aineisto, CC BY 4.0. THL ja Fineli nimetään eikä arvioita esitetä THL:n hyväksyminä. Tässä erässä käytetyt Fineli-tietuetunnisteet: 1, 27, 31, 110, 300, 322, 330, 335, 346, 352, 353, 386, 387, 389, 392, 471, 500, 541, 620, 631, 779, 858, 922, 929, 1056, 11087, 11089, 11521, 11557, 11565, 28946, 30315, 30346, 34765, 7530.

FSANZ Australian Food Composition Database Release 3 on CC BY-SA 3.0 Australia -lisenssillä; sen Australian dataa koskevat käyttöehdot ja attribuutio säilytetään. Käytetyt AFCD-tietuetunnisteet: F000396, F000448, F002488, F002991, F003327, F003337, F003986, F004193, F004213, F004380, F006113, F006187, F006250, F006321, F006571, F007037, F007422, F008008, F008761, F010466. Tuotetietueen lähde, lisenssi ja polyoliperuste on kirjattu kyseisen reseptin laskentatiedostoon.

## Ravintoarvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| char-siu | 51.32 | 53.07 | 50.97 | 5.50 |
| hapanimela-porsas | 54.86 | 56.87 | 41.40 | 15.40 |
| kanaviillokki-kukkakaalilla | 9.25 | 12.57 | 38.04 | 34.37 |
| karibia-callaloo-munakas | 2.12 | 4.83 | 9.32 | 12.14 |
| karibia-jamaikalainen-munakokkeli | 2.35 | 3.02 | 7.45 | 12.06 |
| karibia-kookosriisi-pavuilla | 51.60 | 57.39 | 10.47 | 15.18 |
| kiinalainen-tomaattimunakas-riisilla | 42.10 | 42.96 | 11.45 | 12.54 |
| kiinalainen-riisipuuro-kananmunalla | 39.99 | 40.63 | 11.11 | 5.61 |
| korealainen-yachaejuk-kasvisjuk | 45.54 | 50.26 | 5.39 | 8.03 |
| lahi-ita-fattet-hummus | 33.61 | 37.78 | 11.10 | 8.04 |
| lahi-ita-kikhernejauho-yrttilettu | 20.94 | 31.93 | 10.49 | 9.76 |
| lahi-ita-menemen-sumakilla | 4.45 | 6.23 | 8.08 | 12.27 |
| malesialainen-congee-inkivaarilla | 40.68 | 41.32 | 4.64 | 0.54 |
| pohjoisafrikkalainen-lablabi | 33.84 | 37.70 | 16.02 | 9.82 |
| thai-jok-kanalla | 39.71 | 40.24 | 27.84 | 7.11 |
| thai-kai-jiao-yrteilla | 0.70 | 0.92 | 7.87 | 11.85 |
| thai-khao-tom-katkaravuilla | 41.20 | 42.08 | 15.01 | 3.78 |
| thai-porsasjok | 39.71 | 40.24 | 25.12 | 17.38 |
| valimerellinen-ricotta-persikkakulho | 8.27 | 10.63 | 8.30 | 12.79 |
| yrttituorejuusto-kinkkurullat | 2.76 | 3.66 | 8.17 | 6.26 |

## Eräauditointi ja prosessiarvio

Lähtöauditissa 179 reseptiltä puuttuivat arvot, 60 reseptiä oli laskentatodistein hyväksyttyjä ja 86 aiempaa arviota jäi selvitystilaan. Erän 20 kohdetta laskettiin uudelleen yhtenäisellä laskentamallilla. Tiukka auditointi varmistaa laskentasyötteen reseptiversion tiivisteen, täydelliset lähdetiedot, neljän julkaistun arvon yhtäsuuruuden sekä saatavilla olevien käännösten arvot.

Prosessia parannettiin erää varten lisäämällä alias täsmennetylle porsaan ulkofileelle, paistoöljylle, valutetuille kidneypavuille, tuotteen nimellä julkaistulle kalakastikkeelle ja riisin sanajärjestysvariantille. Paikallisen tuotetietueen tilakuvauksen on vastattava alkuperäisen tietueen tilaa täsmälleen; laskentamalli hylkäsi ensin epätarkan Squid Brand -tilanimen, joka korjattiin vastaamaan säilytettyä etikettitietuetta. Nämä ovat manifestin lähdemäppäyksiä eivätkä eräkohtaisia vaihtoehtoisia laskukaavoja.

Arvot ovat käytännöllisiä suuntaa-antavia reseptiarvioita, eivät laboratorioanalyysejä. Fineli: https://fineli.fi/fineli/fi/avoin-data. AFCD: https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd.
