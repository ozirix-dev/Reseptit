# Issue #404 – tahmariisin täsmälähde ja xôin maapähkinän keittoretentio

**21.11.2026 · LÄHDETUTKIMUS / EI JULKAISU- TAI RAVINTOARVOHYVÄKSYNTÄÄ**

Kohde: kaksi karanteenissa olevaa FI-Draftia, `vietnamilainen-xoi-maapahkinalla-punnittu-v2` (200 g raakaa tahmariisiä) ja `malesialainen-kuih-seri-muka-punnittu-v2` (300 g raakaa tahmariisiä). Alkuperäinen ainesosaluettelo ja `sourceGitBlobSha` säilyvät ennallaan. Tässä lähteistetään **uusi vaihtoehto vääränlaisen tavallisen riisin vertailutietueelle**; päätös sidotaan `docs/nutrition/issue404-b5-ingredient-preflight.json`-esikartoitukseen.

## 1. Virallinen raaka-aineeltaan oikea tahmariisiviite

**Institute of Nutrition, Mahidol University (INMU): [Thai Food Composition Database – A22, Rice, glutinous, polished, raw](https://inmu.mahidol.ac.th/thaifcd/foodsearch/food_name_result_std_pdf/?dbcode=STD&food_id=148).**

Tämä on **kuivaa kiillotettua tahmariisiä**, ei tavallista pitkäjyväistä riisiä eikä kypsää tahmariisiä. A22:n sivulle ilmoitetut alkuperäiset ravintokomponentit koskevat 100 grammaa raakaa, syötävää riisiä:

| Komponentti | A22, 100 g raakaa riisiä | Menetelmä / rajoitus |
| --- | ---: | --- |
| `CHOAVLDF` / saatavilla oleva hiilihydraatti | 80,49 g | laskettu erotusmenetelmällä, **ei** suoraan analysoitu |
| `FIBTG` / kuitu | 0,5 g | analysoitu, ilmoitettu n=1 |
| `PROTCNT` / proteiini | 6,30 g | analysoitu |
| `FAT` / rasva | 0,62 g | analysoitu |
| `POLYL` / polyolit | **ei ilmoitettu** | **puuttuva ei ole nolla** |

Lähdetaulukon ruoka-ID on **A22**, tietueen ravintokomponenttien päivämäärä 1.10.2015. Thai FCD:n verkkosivu esittelee koko palvelun uudemman version 3 (08/2025), mutta tällä ei väitetä A22:n alkuperäistä analyysidataa uudeksi vuoden 2025 analyysiksi.

**Aritmeettinen komponenttivertailu, EI valmiin ruoan ravintoaineväite:**

| Kuiva raaka-ainesyöte | Raaka-riisin `CHOAVLDF`-laskelma | Raaka-riisin proteiini | Raaka-riisin rasva | Raaka-riisin kuitu |
| --- | ---: | ---: | ---: | ---: |
| Xôi: 200 g × A22 / 100 g | 160,98 g | 12,60 g | 1,24 g | 1,00 g |
| Kuih: 300 g × A22 / 100 g | 241,47 g | 18,90 g | 1,86 g | 1,50 g |

Nämä ovat **vain kuivasta riisistä lähtötilanteessa** laskettuja osakomponentteja, eivät xôin tai kuihin neljä per annos julkaistavaa makroa. Keiton/huuhtelun mahdollinen tärkkelyksen poistuminen ja keitetyn riisin todellinen syötävä saanto voivat muuttaa käytännössä syötyä määrää. `CHOAVLDF` ei myöskään oikeuta asettamaan Recipavon `carbs_net_per_serving_g`- tai `carbs_total_per_serving_g`-kenttää, koska polyolien tietue puuttuu ja koko reseptin laskenta on tekemättä.

### Käyttöoikeudet – ennen tuotantokäyttöä

[INMU:n virallisella etusivulla](https://inmu.mahidol.ac.th/thaifcd/) kerrotaan, että ei-kaupalliset käyttäjät voivat käyttää tietokantaa maksutta asianmukaisella lähdemaininnalla; kaupallinen uudelleenkäyttö tai muuhun tuotteeseen sisällyttäminen **saattaa edellyttää lupaa/maksua**. Tässä ei ole tarkastettu Recipavon mahdollista kaupallista käyttölupaa. **Älä kopioi A22:ta `docs/nutrition/food-records.json`-käyttöaineistoon tai julkaistun reseptin makroihin, ennen kuin käyttöoikeus ja polyoliperusta on ratkaistu.** JSON-esikartassa säilytetään vain tietueen identiteetti, URL ja oikeus-/puuteportti, ei uudelleen julkaistavaa ravintotietokantatietuetta.

Vertailun vuoksi USDA:n avoimen SR Legacy -tietueen **FDC 168883** on myös kuivaa valkoista glutinous rice -riisiä, mutta sen *carbohydrate by difference* -arvot eivät yksin täytä projektin `EU_AVAILABLE + FIBRE + verified POLYL` -ketjua. Sitä ei siksi käytetä automaattisena korvaajana.

## 2. Xôin maapähkinöiden keittäminen

Xôin FI-lähde käyttää **100 g kuivia kuorittuja maapähkinöitä** ja noin **15 minuutin esikeittoa**. Repon vanha **AFCD F006107** kuvaa raakoja, suolaamattomia maapähkinöitä – se on *lähtötilan* vertailuehdokas, ei suoraan keitetyn syötävän pähkinämassan mittaus.

[Zhang ym. (2024), *Effect of Boiling and Roasting Treatments on the Nutrients, Lipid Quality, and Flavor of Peanuts*](https://pmc.ncbi.nlm.nih.gov/articles/PMC11606846/), DOI 10.1002/fsn3.4509, vertaili raakoja, keitettyjä ja paahdettuja maapähkinöitä. Tutkimuksessa keitto kesti **210 minuuttia**. Sen tulokset osoittavat, että keittäminen muuttaa vesipitoisuutta ja mitattujen ravintoaineiden suhteita. **Tutkimuksen 210 minuutin käsittelyä ei voi käyttää tämän xôi-reseptin noin 15 minuutin keiton tuotekohtaisena retentiokertoimena.** Retentio ja keitetyn pähkinän saanto pysyvät tuntemattomina.

## 3. Kookosmaidon kaksi eri epätarkkuutta

Repon AFCD **F002991** vastaa geneeristä tölkkikookosmaitoa (regular fat), mutta VNIFoodin xôi-lähde ei nimeä tuotevalmistajaa. Lisäksi sen ainesluettelossa on **20 g** kookosmaitoa, kun työvaiheessa puhutaan **20 ml**:sta. Projektin ravintosäännöt vaativat tuote- ja mittayksikkökohtaisen näytön. **20 g ≠ oletusarvoisesti 20 ml**, eikä geneerisen F002991:n hyväksyntää voi tehdä tuotenimen samankaltaisuuden perusteella. Valitse nimetty valmistajan pakkaus, josta saa per 100 g makrot ja kuidun/polyolien lähdesemantiikan; kirjaa myös 20 g:n aineslistan ja 20 ml:n ohjeen tulkintapäätös ennen laskentaa.

## 4. Valmius ja seuraavat ratkaistavat esteet

| Kohde | Varmennettu tässä | Ei vielä hyväksytty |
| --- | --- | --- |
| Xôin 200 g tahmariisiä | raaka-aineeltaan oikea virallinen tietue A22, saatavilla olevien hiilihydraattien, kuidun, proteiinin ja rasvan tutkimusarvot | **käyttölupa**, `POLYL`, syötävä annos/retentio |
| Kuihin 300 g tahmariisiä | sama täsmätietue ja erän raaka-riisin osakomponentit | samat oikeus- ja polyoliportit; lisäksi pandan, kookos, munat, rkl-muunnokset |
| Xôin 100 g maapähkinöitä | AFCD F006107 sopii kuivan lähtötilan vertailuksi; kirjallisuustutkimus vahvistaa käsittelymenetelmien eron | **keiton saanto, 15 min:n retentio ja valittu tuote** |
| Xôin 20 g kookosmaitoa | geneerinen AFCD F002991 on saatavilla vertailuun | nimetty tuote, **20 g vs 20 ml** ja tuotteen hiilihydraattisemantiikka |

**Päätös:** tähän erään on löytynyt täsmällinen **tahmariisin lähde-ehdokas** ja uusia tieteellisiä käsittelyrajoja; **ei** neljää hyväksyttyä makroa kummallekaan reseptille. Alkuperäiset viisi jäävät karanteeniin, viisi FI-versiota DRAFT/HOLDiin, kuvat/käännökset/GK ennalleen. Tämä tutkimus ei valtuuta Cloudflare-deployta. Julkaisulaskentaa ei ole vielä perusteltua aloittaa ilman yllä mainittuja tuotteita ja retentiotietoja.


## 5. Tuotepakkausmerkintään perustuva vaihtoehtoinen lähdepolku (21.11.2026)

**Uusi täsmällinen tuote-ehdokas; EI RAVINTOARVO- TAI JULKAISUHYVÄKSYNTÄÄ.**
[Elatukun / maahantuoja Cemet Oy:n tuotetiedot: Royal Thai Glutinous Rice / Tahmeariisi 1 kg](https://www.elatukku.fi/teolliset-elintarvikkeet/royal-thai-glutinous-rice-tahmeariisi-1kg/p/18885/)
yksilöivät 100-prosenttisen thaimaalaisen tahmariisin, **EAN 8717677860876**.
Tuoteluettelossa ilmoitetaan seuraavat ravintoarvot **per 100 g tuotetta**:

| Tuoteluettelon ilmoitus | Arvo / 100 g |
| --- | ---: |
| Hiilihydraatit | 80 g |
| Kuitu | 0,6 g |
| Proteiini | 6,4 g |
| Rasva | 1,0 g |
| Energia | 1 458 kJ / 355 kcal |

Nämä ovat **nimetyn suomalaisessa jakelussa olevan tuotteen myyjän ilmoittamia
pakkausarvoja**, eivät Thai FCD A22:n tutkimusarvoja eikä VNIFoodin nimeämän
riisituotteen todennus. Myös toisen pakkauskoon tai tuotteen ilmoitettu
ravintosisältö voi erota; tuotetunnus ja pakkauskohtainen versio on säilytettävä.
Varsinainen pakkauksen etiketti, valmistajan tuote-erä ja merkinnän ajantasaisuus
on vielä varmennettava ennen tuotetietueen hyväksyntää.

**Polyolit ja kaksi erilaista hiilihydraattikenttää.** [EU:n asetuksen
1169/2011 liitteen I kohtien 7–9 mukaan](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/eng)
ravintoarvomerkinnän *hiilihydraatit* sisältävät myös polyolit; kuitu
määritellään erikseen. Elatukun lista **ei ilmoita polyoleja eriteltyinä**.
Sen 80 g:n hiilihydraattimerkintä ei siten ole automaattisesti Recipavon
\`carbs_net_per_serving_g\`-arvo, eikä puuttuvasta polyolirivistä seuraa
\`POLYL = 0\`. Merkitse \`POLYL = NOT_REPORTED\` tutkimuksessa, kunnes
tuotteen valmistajalta tai toisesta soveltuvasta, nimenomaan samaa tuotetta
koskevasta lähteestä saadaan riittävä tieto.

**Oikeusraja.** Tämä tuote-ehdokas on eri lähdepolku kuin Thai FCD:n
tekijänoikeudella suojatun tutkimustietokannan kopiointi kaupalliseen
käyttöaineistoon. Tuoteluettelon löytyminen **ei** anna Thai FCD:n
kaupallisen käytön lupaa eikä yksin ratkaise myöskään tuotetietojen
uudelleenjulkaisun ehtoja. Tuotekortin tiedot säilytetään tässä
lähdeviitteenä, ei lisätä \`docs/nutrition/food-records.json\`-aineistoon.

**Seuraava kelvollinen etenemistapa:** (1) varmista nimettyä EAN-tuotetta
vastaava alkuperäinen pakkaus ja hiilihydraatin/polyolien käsittely;
(2) päätä erikseen, käytetäänkö juuri tätä riisiä FI-reseptiehdokkaassa,
äläkä oleta yleisen tahmariisin automaattista vastaavuutta;
(3) dokumentoi raaka-/kypsäsaanto ja mahdollinen hävikki, muut raaka-aineet
sekä xôin maapähkinän noin 15 minuutin esikeiton retentio;
(4) hyväksytä neljän ravintokentän laskelma ja julkaisun muut portit vasta
kokonaisen lähdeketjun valmistuttua. **Molemmat tahmariisia sisältävät
reseptit pysyvät DRAFT/HOLDissa ja kaikki neljä makrokenttää \`null\`.**
