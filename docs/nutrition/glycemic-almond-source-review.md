# AJO 1.7 – mantelijauhon GI-lähdekorjaus

## Päätös ja lukittu lähtötilanne

Hyväksytty main `e64a7ce04e71ab707f263b752763d02e42823cc7` ja
[tuotantoajo](https://github.com/ozirix-dev/Reseptit/actions/runs/40715654931)
varmistettiin 28.10.2026: 326 reseptiä, 111 laskettua / 215 keskeneräistä (34,0 %),
45 GI-tietuetta. Tuotannon HTML:n 325 reseptikorttia ja yksi erillinen
ravintotietoesteen sisältävä resepti muodostavat kaikki 326 reseptiä.

Ehdotus: **101 laskettua / 225 keskeneräistä, 31,0 %, netto −10**.
99 laskettua pysyy täsmälleen ennallaan, kaksi lasketaan uudelleen,
kymmenen palautuu keskeneräiseksi ja kaikki aiemmat 215 pysyvät keskeneräisinä.
Numeerisena säilyvien GK-luokat eivät muutu. Kymmenen poistuvan LOW-luokka ja
confidence palautuvat nulliksi. Kumpikin säilyvä arvio on edelleen LOW-confidence.

[Uusi immutable-baseline](glycemic-almond-source-baseline.json) lukitsee
326 tarkkaa tulosta, tulostiivisteet, lähde-, syöte- ja evidenssisormenjäljet sekä
katalogin. [Koneellinen katselmointi](glycemic-almond-source-review.json)
sisältää kaikkien 326 reseptin ennen/jälkeen-vertailun, 62 sidontaa,
28 lasketun käyttäjän seulonnan ja 13 mantelijauhoreseptin jokaisen ainesrivin.
Muiden 313 reseptin koko tulosobjekti säilyy muuttumattomana, ei vain pyöristetty GK.
Vanhat baselinet ja 2B6E:n viiden reseptin / 44 ainesrivin tutkimus säilyvät.

## Mitä alkuperäislähteet osoittavat

[Vuoden 2021 kansainvälisten GI-taulukoiden](https://doi.org/10.1093/ajcn/nqab233)
Table 1:n **Bakery products** sisältää 72 tuotetta, keskiarvo GI 58, SD 16.
Leivät ovat oma ryhmänsä (214, GI 64), samoin keksit (135, GI 49).
Ryhmän keskiarvo on valmistettujen tuotteiden jakauma, ei mantelijauhon
koe eikä reseptin GI-luottamusväli. Koko GI 58 -tietuetta ei muuteta
REFERENCE_ONLY-tilaan. Katalogin kaikki 45 tietuetta säilyvät täsmälleen ennallaan.
LOW-confidence ei oikeuta siirtämään valmiin leipomotuotteen GI:tä jauhetulle pähkinälle.

[Sydneyn GI-haku](https://glycemicindex.com/gi-search/) sekä vuoden 2021
[Supplemental Table 1](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable1-2.pdf)
ja [Supplemental Table 2](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable2-2.pdf)
tarkastettiin sanoilla almond, almond flour/meal ja ground almond.
Löydetyt manteliosumat koskevat sekaruokia, esimerkiksi kakkuja, granolaa ja patukoita.
Täsmällistä erillisen täysrasvaisen mantelijauhon ihmismittausta ei löytynyt.
Tämä ei todista, ettei sellaista voisi olla muualla. Liitteet luettiin
alkuperäistaulukoiden kopioista; niiden isäntä ei ole kustantaja.
Kustantajan suora kokotekstipyyntö epäonnistui ajoittain (500), mutta päätaulukko
oli luettavissa kustantajan PDF:n indeksoidusta sisällöstä.

[Mori, Considine ja Mattes 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3042001/)
(DOI 10.1186/1743-7075-8-6) on alkuperäinen 14 aikuisen vaihtovuorokoe.
Heillä oli heikentynyt glukoosinsieto. Viisi aamiaista sisälsi kuivia paahdettuja
kokonaisia manteleita, mantelivoita, rasvatonta mantelijauhoa, manteliöljyä tai
vertailuaterian. Farinan ja appelsiinimehun sisältävät seka-ateriat vakioitiin
75 grammaan imeytyvää hiilihydraattia. Verensokerivasteita seurattiin aterian
jälkeen ja toisella aterialla. Seulonnan glukoosirasitus ei ole aamiaisten
GI-referenssi. Tutkimus ei anna erillisen täysrasvaisen mantelijauhon GI:tä
GLUCOSE_100-asteikolla eikä testaa tämän kokoelman paistettuja taikinoita.
Siksi siitä ei johdeta korvaavaa arvoa.

Myös vuoden 2026 [funktionaalisten keksien tutkimus](https://doi.org/10.1080/19476337.2026.2613493)
suljettiin pois: ennustettu GI 28–34 perustuu in vitro -menetelmään ja valmiiseen
sekoitetuista raaka-aineista valmistettuun keksiin. Osallistujamäärä ja
kliininen glukoosireferenssi eivät sovellu tähän menetelmään.
Kokonainen/paahdettu manteli, täysrasvainen jauho, rasvaton jauho, mantelileipä
ja mantelikakku pidetään erillään. Korvaavaa GI:tä ei hyväksytty.

## Mantelijauhon massa, koostumus ja pienosuudet

Kaikki 13 sidontaa käyttivät `afcd-F006077-2026-10-24`-ravintotietuetta.
[AFCD Release 3](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files)
kuvaa kuivaa täysrasvaista almond meal -raaka-ainetta: imeytyvä HH ilman polyoleja
5,4 g/100 g, kuitu 11 g, polyolit 0, proteiini 19,7 g ja rasva 50,5 g.
Alkuperäisen viiteaineiston derivaatio on **Imputed**, joten tämä on geneerinen
koostumusarvio, ei jokaisen tuotemerkin laboratoriomittaus. Paikallinen muuttumaton
`afcd-release-3-reference.json` säilyttää lähdeaineiston ja tunnisteen F006077.

Reseptit ilmoittavat mantelijauhon grammoina. Kaikki massat ja annosmäärät
säilyvät. Reseptin koko syötävä lähtöraaka-aine lasketaan ilman keksittyä
kypsennyshävikkiä tai retentiokerrointa. Vhh-letut paistetaan pannulla;
muut 12 ovat uunitaikinoita. Valmistusohjeet ja tavalliset ravintoarvot eivät muutu.
Yksittäisen GI-osumattoman osuuden on oltava **alle 1 g HH/annos** ja kaikkien
poisjättöjen yhteensä **alle 2 g/annos**. Puuttuva GI ei ole nolla.

Pelkkä GI:n poisto jättäisi kahdeksan aiemmin laskettua reseptiä numeeriseksi.
Kuusi näistä kuitenkin sisältää määrältään todentamattoman muun poisjätön.
Niitä ei hyväksytä uudelleen tämän virheen peittämiseksi. Neljässä reseptissä
mantelijauho itsessään ylittää 1 g:n rajan. Raparperipiirakka oli jo keskeneräinen.

| Resepti | Mantelijauho g / annoksia | HH/annos | Vanha GK | Ehdotettu GK | Päätös |
|---|---|---|---|---|---|
| vhh-omenapiirakka | 150 / 8 | 1.0125 | 2.08 | None | Mantelijauho ≥1 g; sitruunamehun massa avoin |
| vhh-raparperipiirakka | 150 / 8 | 1.0125 | None | None | Mantelijauho ≥1 g; raparperin aiempi GI-ristiriita |
| vhh-mansikkakakku | 120 / 10 | 0.648 | 1.45 | None | Vaniljauutteen 1 tl → 2 g ei ole lähteistetty |
| vhh-juustokakku | 120 / 10 | 0.648 | 1.09 | None | Sitruunamehun massa/yläraja avoin |
| vhh-brita-kakku | 100 / 8 | 0.675 | 1.18 | 0.79 | Varmennetut pienosuudet, yhteensä 1,07875 g |
| rahkapiirakka-vhh | 150 / 8 | 1.0125 | 1.11 | None | Mantelijauho ≥1 g |
| vhh-letut | 50 / 4 | 0.675 | 1 | None | Suolaripauksen määrä ei ole varmennettu |
| vhh-lihapiirakka | 200 / 8 | 1.35 | 0.99 | None | Mantelijauho ≥1 g |
| keto-korvapuustit | 200 / 8 | 1.35 | 0.96 | None | Mantelijauho ≥1 g |
| vhh-korvapuustit | 120 / 8 | 0.81 | 0.56 | None | Kanelin 1 rkl → 15 g ei ole lähteistetty |
| keto-mutakakku | 60 / 8 | 0.405 | 0.23 | None | Suolaripauksen määrä avoin; suklaatuotteen vastaavuus jatkoselvitettävä |
| keto-suklaakeksit | 180 / 10 | 0.972 | 0.56 | None | Suolaripauksen määrä avoin; suklaatuotteen vastaavuus jatkoselvitettävä |
| vhh-mokkapalat | 120 / 12 | 0.54 | 0.4 | 0.08 | Varmennetut pienosuudet, yhteensä 1,02375 g |

`None` tarkoittaa nullia / INSUFFICIENT SOURCE DATA. Täydet pyöristämättömät
ennen/jälkeen-luvut, laskennalliset vaihteluvälit ja jokainen muiden ainesosien
GI-sidonta ovat koneellisen katselmoinnin `affectedRecipes`-riveillä.

### Kaksi säilyvää arvoa ja niiden kaikki poisjätöt

Brita: mantelijauho 0,675, voi 0,1, keltuaiset 0,015, valkuaiset 0,0525 ja
leivinjauheen lähteistetty suurempi annosskenaario 0,23625 g HH/annos.
Yhteensä **1,07875 g**, jokainen alle 1 g. Erytritolin imeytyvä HH on
nykyisen tuotetiedon perusteella nolla; sitä ei tulkita GI-mittaukseksi.
Kerma säilyttää dairy- ja mansikka fruit-ryhmäanalogian: sama laaja ruokaperhe,
mutta nämä eivät ole täsmällisiä valmistustavan kliinisiä mittauksia.

Mokkapalat: mantelijauho 0,54, munat 0,04125, voit yhteensä 0,12,
kaakao 0,11 + 0,055 ja leivinjauhe 0,1575 g HH/annos.
Yhteensä **1,02375 g**. Erytritoli ja valmistettu kahvi ovat nykyisten
koostumuslähteiden nollarivejä. Kerma säilyttää aiemman LOW-dairy-analogian.
Kuorrutteen kuuma kahvi on valmistettua kahvia, ei kuivaa kahvijauhetta.

Lusikkamitat tarkistettiin paikallisesta `fineli-release-20-reference.json`-aineistosta:
[leivinjauhe #74](https://fineli.fi/fineli/fi/elintarvikkeet/74), TL 5 g ja
CHOAVL 37,8 g/100 g; [kaakao #20](https://fineli.fi/fineli/fi/elintarvikkeet/20),
RKL 6 g ja CHOAVL 11 g/100 g. Nämä antavat aiempaa AFCD/Fineli-arviota suuremmat
poisjättömäärät. Mallin olemassa oleva ylärajakenttä sisältää tämän lähteistetyn
standardiannosskenaarion. Se **ei ole punnittu toteutunut massa, universaali
tuotteiden maksimi eikä kliininen luottamusraja**. Vanha grammapaino säilyy
syötteessä historiallisena arviona; ylärajakenttä määrää laskennassa poisjätön.
Finelin muna/yolk/white-annokset 55/20/35 g ja kerman DL 100 g tukevat muut muunnokset.
Tuntemattomille ripauksille tai sitruunamehun massoille ei aseteta vastaavaa arvausta.

- **vhh-brita-kakku**: tarkka GK 1.1807500000000002 → 0.78925; kahden desimaalin arvo 1.18 → 0.79; vaihteluväli None → None; LOW → LOW.
- **vhh-mokkapalat**: tarkka GK 0.3977833333333333 → 0.08458333333333334; kahden desimaalin arvo 0.4 → 0.08; vaihteluväli None → None; LOW → LOW.

Vaihteluvälit ovat nykyisen mallin lähde-/koostumusvaihtelun tuloksia,
eivät pois jätettyjen hiilihydraattien eivätkä yksilön verensokerivasteen luottamusvälejä.

## Koko GI 58 -inventaario

62 sidontaa / **58 uniikkia reseptiä**: 28 laskettua ja 30 keskeneräistä.
Ryhmittely käyttää julkaistua ainesosaa, koostumustietuetta ja valmistusohjetta,
ei kopioitua GI-foodKeytä. Sama resepti voi esiintyä useassa ryhmässä.
Koneellinen inventaario sisältää myös jokaisen reseptin valmistusohjeen.

| Todellinen raaka-aine | Sidontoja | Reseptejä | Laskettuja | Keskeneräisiä |
|---|---|---|---|---|
| Mantelijauho | 13 | 13 | 12 | 1 |
| Mantelirouhe / lastut | 0 | 0 | 0 | 0 |
| Vehnäjauho | 27 | 27 | 12 | 15 |
| Mannasuurimo | 6 | 6 | 3 | 3 |
| Valmis leipä | 0 | 0 | 0 | 0 |
| Valmis leivonnainen | 0 | 0 | 0 | 0 |
| Muut jauhot / tärkkelykset | 7 | 7 | 2 | 5 |
| Muut ruoat | 9 | 9 | 1 | 8 |

Muut jauhot sisältävät riisi-, ruis- ja maissijauhoa sekä maissitärkkelystä.
Muut ruoat sisältävät leseitä, hiutaleita, couscousia, bulguria, filotaikinaa,
nuudeleita ja kaakaota. Yhdessäkään sidonnassa ei ole varsinaisena raaka-aineena
valmista leipää tai leivonnaista. Lopullisen reseptin nimi ei muuta jauhoa
valmiiksi leipomotuotteeksi. Näiden ryhmien GI-siirto jää todentamatta;
muuttumaton tulos ei ole hyväksytty lähdenäyttö.

### Kaikki muut 16 laskettua käyttäjää

| Resepti | GI 58 -ainesosa | Nykyinen GK | Seulonnan tulos |
|---|---|---|---|
| gulab-jamun | vehnäjauhoja | 49.05 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| samosa | vehnäjauhoja | 43.99 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| aloo-paratha | vehnäjauhoja | 43.5 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| pizza-margherita | vehnäjauhoja | 65.14 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| keto-kauralesesampylat | kauralesettä | 1.34 | P0: selvä väärä valmistettu ruokaperhe; ei muutosta tässä PR:ssä |
| silakkapihvit-tilli-kermakastike | ruisjauhoja | 1.73 | P0: selvä väärä valmistettu ruokaperhe; ei muutosta tässä PR:ssä |
| pohjoisafrikkalainen-baghrir | mannasuurimo, vehnäjauho | 44.59 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| pohjoisafrikkalainen-msemen-hunajalla | mannasuurimo, vehnäjauho | 44.59 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| vietnamilainen-banh-cuon-sienilla | riisijauho | 23.01 | P0: selvä väärä valmistettu ruokaperhe; ei muutosta tässä PR:ssä |
| pohjoisafrikkalainen-harcha-juustolla | mannasuurimo | 19.83 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| karibia-johnny-cake | vehnäjauho | 21.96 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| valimerellinen-appelsiini-aamiaiskakku | vehnäjauho | 25.28 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| vietnamilainen-banh-bao-kananmunalla | vehnäjauho | 21.47 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| lahi-ita-manakish-zaatarilla | vehnäjauho | 33.06 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| kiinalainen-kevatsipulipannukakku | vehnäjauho | 21.46 | P1: jauhon/taikinan analogia todentamatta; ei muutosta tässä PR:ssä |
| kanaviillokki-kukkakaalilla | vehnäjauhoja | 7.57 | P0: selvä väärä valmistettu ruokaperhe; ei muutosta tässä PR:ssä |

Jatkotehtävä: [GI 58:n muiden käyttöryhmien rajattu auditointi](glycemic-bakery-other-users-follow-up.md).
Kaikkien 28 nykyisin lasketun käyttäjän lähdeainesosat, ruokalaji, valmistus,
GI 58 -osuus ja tarkat nykyarvot ovat `calculatedUserScreen`-kentässä.
13 poistettua mantelijauhosidontaa jättävät 49 aktiivista sidontaa / 16 laskettua käyttäjää.

## Toteutuksen rajaus ja suoja

13 mantelijauhon GI-sidontaa poistetaan. Lisäksi 11 muuta ainesriviä näiden
reseptien sisällä korjaa välttämättömän pienosuusnäytön (24 muuttunutta riviä
kaikkiaan). `allowedInputChanges` yksilöi jokaisen muutoksen. Reseptien määriä,
valmistusohjeita, normaaleja ravintolaskelmia, GI-kaavaa ja toleransseja ei muuteta.

Rajattu mallisuoja käyttää AFCD F006077 -identiteettiä sekä ravintotietueen
nimeä/tilaa ja ainesosan suomen- ja englanninkielisiä jauhovariantteja.
GI-tietueen ID tai bakery-perhe tunnistaa kielletyn lähteen. Valmistusavainten
kopiointi, paistaminen tai LOW-perusteluteksti eivät muuta mantelijauhoa
valmiiksi leipomotuotteeksi. Myös GI-ehdokaslistasta poistetaan väärä perhe.
Muita hyväksyttäviä testitietueita tai muita GI-perheitä ei estetä tällä säännöllä.

Historiallisten testien odotukset siirtyvät vain 13 nimettyyn,
täsmällisillä tulostiivisteillä lukittuun poikkeukseen. Vanhoja baselineja,
PR #124/#125/#126:n REFERENCE_ONLY-suojia tai 2B6E-tutkimusta ei kirjoiteta uudelleen.

## Tarkistukset ja julkaisuportti

Tarkistuskomennot: content:sync, strict nutrition audit, GK-auditointi,
molemmat nykykattavuusinventaariot, test:glycemic, npm test, test:select-ci,
build, test:static, Markdownlint ja git diff --check. Paikalliset tulokset 28.10.2026: GI/GK 79/79, yksikkötestit 149/149,
CI-valitsin 12/12; build, strict audit, molemmat kattavuusauditit ja staattiset testit PASS.
Markdownlint tarkisti 835 tiedostoa ilman virheitä; git diff --check PASS.
GitHub Actionsin viimeisen HEADin suoritus varmennetaan erikseen PR:n avaamisen jälkeen.
Draft-PR jää riippumattomaan katselmointiin. Ei mergeä eikä Pages-julkaisua.

## Seuraava kattavuutta kasvattava työ

Paras rajattu mahdollisuus on niiden kuuden nyt estettävän reseptin
pienosuus- ja koostumusnäytön korjaus, joissa mantelijauho on jo alle 1 g/annos:
mansikkakakku, juustokakku, letut, vhh-korvapuustit, mutakakku ja suklaakeksit.
Aloita mansikkakakun vaniljauutteen tuotemuodosta ja luotettavasta tl-massasta.
Selvitä lisäksi sitruunamehun massamuunnokset, suolarivit, kaneli/psylliummitat ja suklaan
kaakaoprosentin vastaavuus ennen uusien arvojen hyväksymistä.
Potentiaali on enintään kuusi palautusta, ei luvattu lisäys. Uutta mantelijauhon
GI:tä ei tarvita, jos kaikki pienosuusehdot todella täyttyvät.
Neljä vähintään 1 g:n mantelijauhoreseptiä tarvitsee erillisen hyväksyttävän GI-näytön.
Ensin on kuitenkin arvioitava erillisessä jatkotehtävässä jäljelle jäävien P0-arvojen laatu.
Mitään jatkoerää ei käynnistetä tässä työssä.
