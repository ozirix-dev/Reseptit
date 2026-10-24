# Kahdentoista reseptin ravintoarviot, erä 5

Laskentapäivä: 24.10.2026. Arvot ovat ainesosapohjaisia suuntaa-antavia
arvioita annosta kohti. Ne eivät ole valmiin ruoan laboratorioanalyysejä.
Pääasiallinen lähde on paikallinen THL:n Fineli Release 20 -poiminta
(`fineli-release-20-reference.json`, CC BY 4.0). Poiminta sisältää Finelin
ruokakomponentit ja yksikkömassat. Fineli-attribuutio ei tarkoita THL:n
hyväksyntää.

## Laskenta

Kunkin raaka-aineen grammoista laskettiin Finelin CHO 2034 (imeytyvä
hiilihydraatti), FIBT 2168 (kuitu), POLYL 2260 (polyolit), PROT 2230
(proteiini) ja FAT 2157 (rasva). Nettohiilihydraatti = CHO;
kokonaishiilihydraatti = CHO + kuitu + polyolit. Reseptin kokonaissumma
jaettiin annosmäärällä ja pyöristettiin vasta lopuksi kahteen desimaaliin.
Vettä ei laskettu. Öljynä käytettiin rypsiöljyä (#535); ilmoitettu
friteerausöljyn arvioitu imeytynyt määrä laskettiin kokonaan reseptiin.
Laskennan voi toistaa komennolla `python tools/calculate-nutrition-batch5.py`.

Muunnetut määrät: Finelin ruokalusikka (RKL) on 15 ml; öljyn tiheys on
0,9 g/ml. Puolikarkeaa vehnäjauhoa 1 RKL = 10 g (#110). Keskikokoinen sipuli
= 55 g (#335), valkosipulinkynsi = 3,5 g (#393), keskikokoinen peruna = 60 g
(#205), porkkana = 65 g (#300), vehnäsämpylä = 50 g (#1108), kananmuna =
55 g (#858). Pani purin limetistä laskettiin 30 g mehua ja tamarinditahnaa
2 × 15 g. Butter chickenin hunaja muutettiin 15 ml:ksi = 21 g ja laskettiin
sokerina (#1); 15 ml öljyä = 13,5 g. Chole bhaturen 2 RKL
kypsennysöljyä = 27 g ja reseptin 60 g friteerausöljyä laskettiin molemmat.
Lohikeiton kuusi perunaa = 360 g ja yksi porkkana = 65 g. Tilliä 1 dl =
16,67 g (#369, 2,5 g/RKL). Gulab jamunin 100 ml kevytmaitoa = 103 g ja kaksi
RKL gheetä = 27 g.

## Tulokset annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| Medu vada | 30,54 | 36,20 | 15,44 | 13,25 |
| Pani puri | 50,20 | 55,00 | 9,70 | 7,81 |
| Samosa | 73,37 | 78,17 | 11,99 | 27,48 |
| Vada pav | 55,00 | 63,21 | 11,64 | 14,48 |
| Aloo paratha | 71,00 | 75,02 | 10,63 | 8,78 |
| Butter chicken | 7,79 | 8,45 | 37,43 | 40,44 |
| Chole bhature | 105,30 | 118,40 | 27,69 | 28,39 |
| Keto-pizza Pofiber-pohjalla | 4,10 | 7,72 | 34,32 | 31,79 |
| Lohikeitto kuohukermalla | 17,80 | 20,16 | 23,39 | 38,64 |
| Uunilohi smetanakuorrutteella | 2,03 | 2,97 | 36,76 | 50,77 |
| VHH-lohikeitto kukkakaalilla | 6,16 | 9,66 | 29,66 | 41,89 |
| Gulab jamun | 93,18 | 93,87 | 14,96 | 16,36 |

## Käytetyt lähdetietueet

Fineli Release 20 -tietueet resepteittäin:

- Medu vada: #399 kuivatut vihreät/ruskeat linssit, #33023 inkivääri,
  #182 riisijauho, #535 rypsiöljy.
- Pani puri: #112 mannasuurimo, #110 puolikarkea vehnäjauho, #205 peruna,
  #11089 kypsä kikherne, AFCD #F009081 tamarinditahna, #11557 sitruunamehu
  limetin mehun likiarvona, #535 öljy.
- Samosa: #110 vehnäjauho, #535 öljy, #205 peruna, #370 tuore herne
  pakasteherneen likiarvona.
- Vada pav: #205 peruna, #535 öljy, AFCD #F003986 kikhernejauho,
  #1108 vehnäsämpylä.
- Aloo paratha: #110 vehnäjauho, #205 peruna, #598 voiöljy gheen likiarvona.
- Butter chicken: #30792 nahaton broilerin koipireisi, #620 maustamaton
  jogurtti, #11557 sitruunamehu, #500 voi, #335 keltasipuli, #33023 inkivääri,
  #398 tomaattimurska, #631 kuohukerma, #1 sokeri hunajan likiarvona,
  #535 öljy.
- Chole bhature: #31218 kuivatut kikherneet, #535 öljy, #335 sipuli,
  #33023 inkivääri, #398 tomaattimurska, #110 vehnäjauho, #620 jogurtti.
- Keto-pizza: #642 emmental juustoraasteen likiarvona, #11571 maustamaton
  tuorejuusto, #858 kananmuna, tuotetiedot alla Pofiberille, #398
  tomaattikastikkeen likiarvona, #779 vähärasvainen keittokinkku, #355 paprika.
- Lohikeitto: #335 sipuli, #337 purjo, #205 kuorittu peruna, #300 porkkana,
  #500 voi, #75 laimennettu kalaliemi kalafondin likiarvona, #34255 kasvatettu
  lohifilee, #631 kuohukerma, #369 tilli.
- Uunilohi: #34255 lohi, #630 smetana, #337 purjo, #28925 sitruuna kuorineen
  (65 % syötävä osuus), #369 tilli, #500 voi.
- VHH-lohikeitto: #34255 lohi, #322 kukkakaali, #337 purjo, #335 sipuli,
  #75 laimennettu kalaliemi kalafondin likiarvona, #631 kuohukerma, #500 voi,
  #369 tilli.
- Gulab jamun: #672 rasvaton maitojauhe, #110 vehnäjauho, #598 voiöljy,
  #675 kevytmaito, #1 sokeri, #535 öljy, #33131 pistaasipähkinä.

AFCD-tietueiden lähde on Food Standards Australia New Zealand, Australian
Food Composition Database, Release 3. Kikhernejauhon ja puhtaan
tamarinditahnan makrot käytettiin lähdepoiminnan arvoista; kyseiset lähderivit
eivät raportoi polyoleja. Poiminnan lisenssi ja attribuutioehdot on kuvattu
`README.md`-tiedostossa.

Pofiberiä ei ollut Fineli-poiminnassa. Käytettiin Schär Pofiberin
tuotemerkintää (per 100 g: imeytyvä hiilihydraatti 17 g, kuitu 65 g,
proteiini 5 g, rasva 0,3 g; [tuotetiedot ja ravintoarvot](https://www.apotekhjartat.se/varumarken/schar/schar-pofiber-125-g)).
Tilavuusmuunnoksena 1 dl = 17 g, joten Finelin ruokalusikan 15 ml tilavuudella
3,5 rkl = 8,925 g.

## Rajaukset ja epävarmuudet

- Urad-dalille ei löytynyt paikallisesta Fineli-poiminnasta suoraa tietuetta.
  Kuivattujen vihreiden/ruskeiden linssien (#399) arvoja käytettiin
  suuntaa-antavana palkokasvilikiarvona. Urad-dalin erikoiskoostumus voi
  muuttaa etenkin kuitua ja proteiinia.
- Kikhernejauho ja tamarinditahna perustuvat lisensoituun AFCD-aineistoon.
  AFCD:n poiminta ei sisällä niille polyoliarvoa; polyolit oletettiin
  nollaksi, kuten tavallisissa makeuttamattomissa raaka-aineissa yleensä.
  Samoin Finelin puuttuva polyolikomponentti tulkittiin näissä resepteissä
  nollaksi. Tämä on arvio, ei mitattu nollatulos.
- Pofiberin pakkausarvo vastaa nimettyä tuotetta, mutta erän/pakkauksen
  tuotespesifikaatiota ei tarkistettu. Paikallista tuotteen eräkohtaista
  etikettiä ei ollut saatavilla.
- Broilerin nahaton reisiliha vastaa reseptissä nimettyä lihaa; luiden tai
  nahan käyttö muuttaisi arviota. Ghee korvattiin Finelin voiöljyllä.
- Kalafondi 15 ml mallinnettiin laimennetulla kalaliemellä (#75), koska
  tuotemerkkiä ja konsentraatiota ei ole annettu. Fondin todellinen suola- ja
  energiapitoisuus voi poiketa tästä.
- Rasvaisten juustojen ja tomaattikastikkeen tuotteet vaihtelevat. Pizzaan
  laskettiin reseptissä vahvistetut 50 g kinkkua, 50 g paprikaa ja 50 g
  herkkusieniä; herkkusienen pieni ravintosisältö jätettiin pois polyolitiedon
  puutteen vuoksi. Kookoschutney ja muut lisukkeet eivät sisälly resepteihin.
- Suola, vesi, mustapippuri sekä pienet maustemäärät, valkosipuli, yrtit ja
  kardemumma/ruusuvesi rajattiin pois. Niiden määrät tai täydelliset Fineli-
  komponentit puuttuvat. Arvot eivät kuvaa mahdollisia lisukkeita tai
  valmistuksessa imeytymätöntä öljyä.
- Gulab jamunissa koko reseptiin merkitty sokerimäärä laskettiin mukaan,
  vaikka osa sokerisiirapista voi jäädä tarjoilun jälkeen käyttämättä.

Laskenta- ja lähdeaineisto säilytetään paikallisen Fineli Release 20
-poiminnan kanssa. Arvot voidaan laskea uudelleen käsin tämän muistion
määrämuunnoksilla ja lähde-ID:illä; päivitys ei lisää Fineli-dataa sivuston
käyttäjälle eikä kopioi koko tietokantaa julkaisuun.
