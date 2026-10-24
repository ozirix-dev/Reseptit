# Thai batch B: ten evidence-backed nutrition estimates

Laskelmat koskevat kymmentä julkaistua reseptiä, neljää annosta ja sivun
annosarvoja. Jokaisesta reseptistä laskettiin imeytyvä hiilihydraatti,
ravintokuitu, lähteistetyt polyolit, proteiini ja rasva. Nettohiilihydraatti
on imeytyvä hiilihydraatti vähennettynä vain tunnetuilla polyoleilla.
Kokonaishiilihydraatti on imeytyvä hiilihydraatti + kuitu + polyolit.
Erytritolin tuote-etiketti ilmoittaa polyolimassan; se sisältyy
kokonaishiilihydraatteihin ja vähennetään netosta. Lähdeaineistojen
polyolierot käsitellään niiden omien määritelmien mukaan.

`tools/calculate-nutrition-batch8.py` toistaa laskelmat suoraan paikallisista
Fineli Release 20-, AFCD Release 3- ja nimetyistä tuote-etikettitietueista.
Reseptien mitat on julkaistu grammoina; käytetyt muunnokset ovat:

- 1 rkl kastiketta, limettimehua tai tamarindia = 15 g
- 1 rkl öljyä = 13,5 g
- 1 tl erytritolia = 4 g
- yksi valkosipulinkynsi = 3,5 g; yksi keskikokoinen paprika = 120 g
- yksi punainen chili = 12 g; yksi kananmuna = 55 g syötävää osaa
- yksi kaffirlimetinlehti = 0,5 g; yksi sitruunaruohon varsi = 20 g
- limelohkoja yhteensä 60 g; kurkkua tarjoiluun 200 g
- kaksi kalaliemikuutiota = 22 g (Finelin annosmitta 11 g/kpl)
- säilykekookosmaidon ml-määrät muutettiin reseptissä suoraan grammoiksi;
  jatkossa arvio koskee nimenomaista 400 g määrää.

Kuorittu ja valutettu massa lasketaan syötävänä painona. Vesi jätetään
laskematta. Tom kha gai -reseptin sitruunaruoho ja makrutlimetinlehdet sekä
Tom yum -keiton sitruunaruoho ja kaffirlimetinlehdet punnitaan, haudutetaan
kokonaisina ja poistetaan ennen tarjoilua. Pad see ew käyttää yksiselitteisesti
300 g parsakaalia; kaalivaihtoehto poistettiin. Tom yum käyttää 22 g
Finelin kalaliemikuutiota ja 1 000 g vettä kalafondin sijasta. Moo pingin
kurkku (200 g) ja lime (60 g) erotettiin omiksi määrikseen. Paprikat ja
valkosipulit on muutettu syötävän osan grammoiksi.

Muut pois rajatut mausteet: moo pingin 2 g valkopippuria (0,5 g/annos).
Sen konservatiivinen yläraja on enintään noin 2 kcal, 0,3 g hiilihydraattia,
0,1 g proteiinia ja 0,1 g rasvaa annosta kohti. Yläraja on alle sovitun 10
kcal sekä 1 g kunkin makron annoskohtaisen toleranssin. Vettä ei lasketa,
koska se ei tuo energiaa tai makroravinteita. Valinnaisia riisi- tai muita
lisäkkeitä ei sisällytetä.

## Lähteet ja aineosavastaavuudet

- **Fineli Release 20:** #31 soijakastike, #322 kukkakaali, #324 parsakaali,
  #346 kurkku, #352 tomaatti, #378 maapähkinä, #389 kesäkurpitsa, #535
  #552 kookosrasva, #858 kuoreton kananmuna, #29010 kalaliemikuutio
  ja #30315 laimennettu kanaliemi. Kaikkien käytettyjen tietueiden
  komponenttitunnisteet ja lisenssi on säilytetty mukana olevassa
  Fineli-viiteaineistossa.
- **AFCD Release 3:** F007089 raaka porsaan scotch-roast (lähin vastaavuus
  porsaan niska-/kaulaosalle), F007057 raaka porsaan jauheliha, F002806
  nahaton raaka broilerin reisiliha, F002594 raaka broilerin rintaliha,
  F007433 raaka katkaravun liha, F009176 kiinteä tofu, F008806 tuoreet
  pavunidut, F009081 puhdas tamarinditahna, F008004 kaupallinen
  kalakastike, F008026 kaupallinen osterikastike, F000431 tuoreet vihreät
  pavut, F002247 punainen paprika, F000396 tuore basilika, F004193
  kuorittu raaka valkosipuli, F002901 raaka punainen chili, F006159
  rypsiöljy, F005198 lime, F004729 limettimehu, F006110 kuorittu
  F000253 vedessä säilötyt bambunversot, F003761
  kuorimaton raaka munakoiso, F004213 tuore inkivääri, F003192 tuore
  korianteri ja F005946 tuoreet herkkusienet. AFCD:n saatavilla oleva
  hiilihydraatti ilman sokerialkoholeja on nettoa vastaava lähtöarvo;
  lähteen erillinen `with`/`without`-ero säilytetään polyoleina.
- **KoRo konjacnuudelit, valmiina:** tuotetietueessa kypsän/valutetun
  tuotteen etikettiarvot; käytetty 400–600 g. Reseptit on nimetty
  KoRo-tuotteelle.
- **Squid Brand -kalakastike:** Open Food Facts -tuotetietue ja ODbL 1.0
  -attribuutio; tuote ilmoittaa anjovisuutteen, suolan ja sokerin. Käytetty
  kastikemäärä on 15–30 g.
- **Foodin erytritoli:** tuotteen etiketti todentaa 100 g polyoleja/100 g.
  Yksi teelusikka on mallinnettu 4 grammaksi.
- **Mae Ploy -currytahnat:** vihreän currytahnan etiketti Sainsbury'sin
  tuotesivulta, Panang-tahnan etiketti Yare Food Services -tietosivulta,
  punaisen tahnan etiketti Sainsbury'sin tuotesivulta. Reseptien
  currytahna-annos on 30 g. Lähteet ilmoittavat kuidun ja hiilihydraatit
  erikseen, eikä ainesosaluettelo sisällä polyoleja.

AFCD-aineistoa käytetään vain tallennetussa Australian ruokakoostumuksen
rajoituksessa; jakelussa säilyvät FSANZ-attribuutio, lähde-/muutoslausuma,
CC BY-SA 3.0 Australia -lisenssiviite, datan rajoitus ja Australian-dataa
koskeva huomautus. Tuotetiedot ovat etiketti- tai Open Food Facts
-tietueviitteitä, eivät avointa lähdedataa lukuun ottamatta OFF:n ODbL-
tietuetta. Tuotekohtaiset arvot voivat vaihdella pakkauksittain.

## Tulokset annosta kohti

| Resepti | Nettohiilihydraatit g | Kokonaishiilihydraatit g | Proteiini g | Rasva g |
| --- | ---: | ---: | ---: | ---: |
| Moo ping | 2,00 | 4,44 | 34,86 | 34,69 |
| Pad kee mao konjacnuudeleilla | 4,53 | 12,09 | 26,37 | 10,81 |
| Pad kra pao | 4,87 | 9,85 | 42,67 | 28,20 |
| Pad see ew konjacnuudeleilla | 3,39 | 10,62 | 37,05 | 12,05 |
| Pad thai konjacnuudeleilla | 6,38 | 12,71 | 34,88 | 18,21 |
| Panang-kanacurry | 8,79 | 14,91 | 36,09 | 23,57 |
| Punainen kanacurry | 9,15 | 15,90 | 34,74 | 22,98 |
| Vihreä kanacurry | 9,01 | 15,82 | 34,97 | 23,97 |
| Tom kha gai | 3,58 | 6,85 | 32,52 | 21,37 |
| Tom yum goong | 4,66 | 7,25 | 28,80 | 2,38 |

Lihapainot ovat raakoja ja luuttomia syötäviä painoja. Kypsennyksen
haihtumista tai rasvan valumista ei vähennetä. Annosmäärä on neljä.
Laskelmissa käytetyt lähde- ja määrävalinnat on sovitettu vastaamaan
suomen-, englannin-, ruotsin- ja thainkielisiä reseptejä.
