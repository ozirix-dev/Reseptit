# GI/GK-erä 2B6B — lähdekatselmointi ja kattavuusauditointi

## Rajaus ja lähtötilanne

Erä perustuu Reseptit-main-committiin `0d7b194228b3a520b0f14613246b4d9aa48137cc` ja ReportHub-main-committiin `16d61582b86f62e7409b4f7c49f44d8cb2b22dea`. Työpuut: `D:\Projects\Products\Reseptit-glycemic-coverage-batch-2b6b` / `codex/glycemic-coverage-batch-2b6b` ja `D:\Projects\_Hub\ReportHub-reseptit-glycemic-coverage-batch-2b6b` / `codex/reseptit-glycemic-coverage-batch-2b6b`.

Muuttumaton baseline `glycemic-coverage-batch-2b6b-baseline.json` on otettu julkaistusta Reseptit-main-HEADista. Sen SHA-256 on `8d7472ccabe5bbebc6304ba2b945e64d563de38c60e8ee6bf86e3f9bc1f76b8b`. Baseline sisältää 325 reseptin lähde-, syöte- ja evidenssifingerprintit, tilat 132 / 193, 40 GI-tietuetta (5 STRONG / 35 SUPPLEMENTARY) ja nutrition-auditin luvut 180 / 86 / 59 / 0. Kirjoitus käyttää `wx`-tilaa; olemassa olevan tiedoston korvaus on estetty ja testattu.

Koko baseline-korpus seulottiin reseptikohtaisesti. Jokaisen 193 keskeneräisen reseptin koostumus-, määrä-, valmistus-, GI-, pienosuus-, aiempi tila- ja fingerprint-estot ovat lähtöinventaarion ja tämänhetkisen inventaarion JSONissa. Päällekkäiset lähtöestoluokat olivat STRUCTURE 41, INPUT 0, EVIDENCE 0, COMPOSITION 65, MASS_PREPARATION 20, GI_MATCH 87, GI_MISSING 41 ja TOLERANCE 7. Ravintoarvotila oli 98 lähteillä tuettua, 41 uudelleentarkistettavaa ja 54 puuttuvaa.

## Kahdeksan ehdokkaan shortlist

Ehdokkaat pisteytettiin ravintoarvolähteiden, annos- ja massatietojen, päätason hiilihydraattien, valmistuksen, estojen määrän sekä lähteen ruoka- ja valmistusvastaavuuden perusteella. Taulukon merkittävät hiilihydraattimäärät ovat g/annos. Ehdokkaat 1–2 läpäisivät katselmoinnin ja siirtyivät laskettaviksi; muut jäivät keskeneräisiksi.

| Sija | recipeId | Ravintoarvotila, este ja merkittävä hiilihydraatti | Lähdepolku ja alustava ratkaisu | Työ / riski |
|---:|---|---|---|---|
| 1 | `kanasalaatti-pesto-mozzarella` | Tuettu; GI_MATCH; kirsikkatomaatti 1,313 g | Raaka kirsikkatomaatti tarjoillaan kypsentämättä. Vuoden 2021 taulukon raaka kokonaistomaatti on sopiva ruoka-/valmistusanalogia, ei kirsikkatomaatin exact-mittaus. Käytä ANALOG / SUPPLEMENTARY / LOW. | Pieni / matala, analogia näkyy |
| 2 | `tacokulho-nauta-avokado` | Tuettu; TOLERANCE; mitatut pienosuudet yhteensä 2,958 g, joista raaka tomaatti 0,863 g ja maustamaton jogurtti 0,850 g | Käytä raakalle tomaatille julkaistua GI 22 -tietuetta ja plain-jogurtin 43 tietueen keskiarvoa 27 ± 11 matalan luottamuksen CATEGORY_MEAN-tietueena. Tunnettujen massojen hiilihydraatit lasketaan lähdekoostumuksista, ei käsin syötetyistä arvoista. | Pieni / matala, keskiarvo merkitty |
| 3 | `sitruuna-yrttikana-parsa` | Tuettu; GI_MATCH; vihreä parsa 1,400 g | Vaihtoehtoina löytyi vain toissijaisia yleistaulukoita ja laaja vihannesten keskiarvo; ei parsakohtaista, valmistukseen sopivaa GI-tutkimusta. Älä siirrä yleistä tai ristiriitaista GI-lukua parsalle. | Rajattu / keskitaso, estyy |
| 4 | `uunimakkara-sipulipedilla` | Tuettu; GI_MISSING; lenkkimakkara 9,500 g | Tarvitaan juuri lenkkimakkaran tai riittävän saman tuotteen julkaistu GI. Yleinen makkaraluku ei tunnista tuotetta tai sen hiilihydraattikoostumusta. | Rajattu / korkea, estyy |
| 5 | `meheva-suklaakakku` | Tuettu; GI_MATCH; tumma suklaa 10,650 g + 5,326 g, kaakao 0,330 g | Vuoden 2021 tumma suklaa -keskiarvo mittaa tuotteita sellaisenaan, ei suklaakakkua. Kaakaojauhetta ei voi kohdentaa leivonnaisten GI-keskiarvoon. | Rajattu / korkea, estyy |
| 6 | `siemengranola-jogurtilla` | Tuettu; TOLERANCE; tunnetut siemen-/pähkinäosuudet yhteensä 2,064 g, yksittäiset osuudet alle 1 g | Kaikki massat ja koostumukset ovat tiedossa; hyväksyttävä ratkaisu edellyttäisi GI-vastaavia lähteitä riittävälle määrälle siemen-/pähkinäosuuksia. Sekaruoka- tai siementutkimusta ei siirretä yksittäisille siemenille. | Rajattu / keskitaso, estyy |
| 7 | `liha-juureskeitto-perunaton` | Tuettu; GI_MATCH; lanttu 1,850 g | 2002 taulukon lanttutietue ei yksilöi valmistusta; keitetty keittoaines ei oikeuta esittämään yleistä arvoa tarkkana matchina. | Rajattu / keskitaso, estyy |
| 8 | `vhh-raparperipiirakka` | Tuettu; GI_MATCH; raparperi 1,720 g | Raparperille ei löytynyt ensisijaista GI-mittausta. Hedelmäkeskiarvo ei ole riittävä vastaavuus; mantelijauhon leivonnaiskategoriaa ei laajenneta. | Rajattu / keskitaso, estyy |

Aiemmat shortlist-umpikujat ja bulguri/couscous, kypsä tomaatti, filotaikina, maissitärkkelys sekä yksilöimätön kookosmaito jätettiin pois. Erä 2B6A:ssa jo laskettaviksi avatut bulgogi, keto-suklaakeksit ja vhh-mokkapalat eivät kuuluneet keskeneräiseen lähtöjoukkoon.

## Neljän reseptin syväkatselmointi

### `tacokulho-nauta-avokado` — PASS

Reseptissä on neljä annosta, 100 g tuoretta tomaattia ja 100 g maustamatonta 3,9 % jogurttia. Lähdesyötteessä kummankin määrä ja Fineli-koostumus ovat ennallaan. International Tables 2021 Supplemental Table 1 raportoi kokonaiselle raa'alle tomaatille GI 22. Tämä vastaa reseptin raakaa tomaattia täsmällisesti. [Atkinson ym., 2021](https://doi.org/10.1093/ajcn/nqab233).

Maustamattoman jogurtin GI on tietuekeskiarvo, ei tuotemerkin tai reseptin mittaus: Wolever (2017) raportoi Sydney GI -tietokannan 43 plain/artificially sweetened yogurt -tietueelle 26,6 ± 10,9. Tietue on pyöristetty arvoon 27, luokiteltu CATEGORY_MEAN / SUPPLEMENTARY / LOW eikä sen epävarmuutta esitetä kliinisenä toleranssina. [Wolever, 2017](https://doi.org/10.3945/jn.116.240770).

Poistettiin tunnetuilta Fineli/AFCD-massoilta redundantit käsin asetetut `estimatedAvailableCarbohydratePerServingG`- ja poissulkemiskentät, jotta laskenta käyttää tavallista lähdekoostumusta. Tuntemattoman määrän mausteille säilyy alkuperäinen dokumentoitu 0,25 g/annos oletus. Pois jätetty hiilihydraatti on 1,24525 g/annos; jokainen osuus alittaa 1 g ja summa 2 g. GK ennen pyöristystä 0,41925, tallennettu 0,42, näytetty 0,4, luokka LOW, confidence LOW. Pois jätetyn osuuden GI 100 -herkkyyden yläraja lisää enintään 1,24525 GK-yksikköä; tulos pysyy LOW-luokassa. Tämä yläraja ei ole lähteistetty GI eikä ennuste.

### `kanasalaatti-pesto-mozzarella` — PASS

Neljä annosta; recipe source listaa 150 g kirsikkatomaatteja, jotka valmistusohjeen mukaan puolitellaan ja tarjoillaan raakana. AFCD F009190 tukee kirsikkatomaatin koostumusta. Vuoden 2021 GI-taulukko mittaa raakaa kokonaistomaattia GI 22, mutta ei erittele kirsikkalajiketta. Siksi lisättiin erillinen ANALOG / SUPPLEMENTARY / LOW -tietue, ei EXACT-tietuetta. Tietue ei sovellu kypsennettyyn tomaattiin tai kastikkeeseen. [Atkinson ym., 2021](https://doi.org/10.1093/ajcn/nqab233).

GK ennen pyöristystä 0,28875, tallennettu 0,29, näytetty 0,3, luokka LOW, confidence LOW. Pois jätetty hiilihydraatti on 0,816225 g/annos; GI 100 -herkkyys lisäisi enintään 0,816225 GK-yksikköä, eikä matala luokka muutu. Kirsikkatomaatin laskennallinen GI-osuus on 0,28875. Reseptin tavallisia ravintoarvoja tai valmistustietoja ei muutettu.

### `meheva-suklaakakku` — BLOCKED

Fineli tukee suklaan koostumusta ja reseptimäärää, mutta International Tables 2021:n dark chocolate -keskiarvo GI 29 kokoaa neljä sellaisenaan testattua tuotetta. Reseptissä suklaa sulatetaan ja sekoitetaan kakkutaikinaan, joten lähteen as-sold-valmistus ei ole reseptin seka-/paistovalmistus. Kaakaojauheen 0,330 g/annos voidaan jättää alle 1 g:n osuussäännöllä, mutta kaksi suklaaosuutta (10,650 ja 5,326 g/annos) tarvitsevat vastaavan GI:n. Ei muutoksia.

### `uunimakkara-sipulipedilla` — BLOCKED

Fineli-tietueella määritetty lenkkimakkara tuottaa 9,500 g imeytyvää hiilihydraattia annosta kohti. Määrä ylittää osuustoleranssin selvästi. Löytynyt yleinen toissijainen makkarataulukko ei yksilöi lenkkimakkaraa, tuotetta, valmistusta eikä ensisijaista mittauslähdettä. Ei GI-arvoa tai laskentaa.

Parsakanasta ja muista shortlistin resepteistä ei tehty syväkatselmointia. Syväkatselmointi pysyi neljän reseptin rajassa.

## Kattavuus, tietueet ja regressiot

| Mittari | Baseline | 2B6B nykytila |
|---|---:|---:|
| Reseptit | 325 | 325 |
| GK laskettu | 132 | 134 |
| GK keskeneräinen | 193 | 191 |
| GI-tietueita | 40 | 42 |
| STRONG / SUPPLEMENTARY | 5 / 35 | 5 / 37 |
| Nutrition: tuettu / tarkistettava / puuttuva / ristiriita | 180 / 86 / 59 / 0 | 180 / 86 / 59 / 0 |

Uudet arviot ovat `tacokulho-nauta-avokado` ja `kanasalaatti-pesto-mozzarella`. Aiemmin lasketuista 132 reseptistä 0 estyi ja 0 GK-arvoa muuttui. Uusia structure/input/evidence mismatch -eroja on 0/0/0. Uusien arvioiden GK-luokka on molemmissa LOW, confidence LOW. Molempien korkein pois jätetty hiilihydraattioletus säilyy matalan GK-luokan sisällä; näiden reseptien käyttäjälle näkyvä luokkavertailu ei muutu.

Uudet GI-tietueet: `plain-yogurt-category-mean-gi-27-2017` (Wolever 2017, 43 Sydney-tietueen keskiarvo) ja `tomato-cherry-raw-analogue-gi-22` (Atkinson ym. 2021 Supplemental Table 1:n raaka kokonaistomaatti, analogia kirsikkatomaatille). Aiempi `whole-tomato-raw-gi-22` pysyy erillisenä suorana raakatomaatin tietueena. Ei muutoksia reseptiteksteihin, annoksiin, tavalliseen ravintoarvomalliin, GK-kaavaan, luokkarajoihin, pyöristyksiin tai confidence-algoritmiin.

## Baseline ja testit

Baseline sisältää alkuperäisen lähdecommitin `0d7b194228b3a520b0f14613246b4d9aa48137cc`. Baseline write-once -suoja käyttää atomista `wx`-luontia; testissä uudelleenkirjoitus hylätään ja alkuperäisen tiedoston sisältö varmennetaan. Nykyisen inventaarion sourceCommit ja 325 uniikkia reseptiä tarkistetaan jokaisessa kattavuusajossa.

Paikalliset testit ja GitHub Actions päivitetään tähän closeoutiin, kun 2B6B-haarojen lopulliset commitit on pushattu. Tuotantoon ei julkaista eikä PR:iä yhdistetä tässä erässä.

## Avoimet huomiot ja erärajaus

- Parsalle, lenkkimakkaralle, suklaakakun paistetulle suklaalle, siemen-/pähkinäseokselle ja raparperille ei löytynyt tähän käyttöön riittävän täsmällistä GI-lähdepolkua.
- Kaksi uutta tulosta ovat lähteistettyjä ingredient-based estimate -arvioita, eivät reseptin tai aterian mitattuja GI/GK-tuloksia.
- ReportHub Issue #67 pysyy avoinna. Projektikorttia tai `reports/latest.md`-osoitinta ei päivitetä Draft-erässä.
- Erää 2B6C/2B7, Nutritics PR #100 ja muut projektit eivät kuulu erään.
