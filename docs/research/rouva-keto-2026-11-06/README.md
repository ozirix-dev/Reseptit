# Rouva Keto – julkisten reseptien lähdekartoitus ja ensimmäiset neljä ehdokasta

**Päivä:** 2026-11-06
**Tila:** KATSELMOINTI / RESEARCH_ONLY, ei mergeä, ei deployta
**Kohde:** Recipavo / `ozirix-dev/Reseptit`
**Rinnakkaiset työt:** blogi-PR #303, hero-PR #301 ja sämpylä-PR #302; tämän erän tiedostot eivät koske niiden navigaatiota, heroa tai tuotantoreseptejä.

## Rajaus ja lähdeluokat

- Varmennettu alkuperäisen blogin sivu: [Rouva Keto – Ketolla saa syödä pizzaa! (30.9.2024)](https://rouvaketo.fi/2024/09/30/ketoruokavaliolla-saa-syoda-pizzaa/). Ainesosat: 200 g juustoraastetta, 3 rkl tuorejuustoa, 2 isoa munaa, 5 rkl Pofiberiä, kahdelle.
- Julkiset Sulamo-reseptisivut: [rasvakaakao](https://www.sulamo.fi/resepti/ohje/354018/rasvakaakao-rouva-keto), [lämmin chia-puuro](https://www.sulamo.fi/resepti/ohje/353703/lammin-chia-puuro-rouva-keto), [todellinen suklaaherkku](https://www.sulamo.fi/resepti/ohje/455804/todellinen-suklaaherkku-rouva-keto). Niissä on avoimet ainesmäärät ja menetelmät. **Sulamon otsikon 'Rouva Keto' ei yksin todista tekijyyttä, alkuperää tai julkaisuoikeuksia.**
- Muistilähteet: käyttäjän kokoama julkisten reseptinimien lista ja Rouva Keton Top 20 -e-kirjan nimiluettelo. **Pelkkä nimi ei todista maksuttoman täyden ohjeen löytymistä.** Maksullista e-kirjaa ei käytetä reseptien sisällön lähteenä.
- Käytämme vain ruoan ideaa, tosiseikkoina esitettyjä ainesosia ja omaa tekstiä. Kuvien tulee olla omia tai lisensoituja. Lähdemerkintä ei anna oikeutta kopioida valokuvaa tai omaperäistä blogitekstiä eikä ilmaise yhteistyötä.

## Neljän reseptin deduplikointi

| Ehdokas | Nykyinen Recipavo | Päätös / sisältö |
| --- | --- | --- |
| Ketopizza / Pofiber-pohja | [`reseptit/paaruoat/ketopizza-pofiber-pohjalla.md`](../../../reseptit/paaruoat/ketopizza-pofiber-pohjalla.md), **published**, oma WebP ja EN/SV/TH. Olemassa oleva pizza käyttää *eri pohjamääriä ja täytteitä*. | **EI uutta kopiota.** Dokumentoidaan blogin pohjan erillinen ravintovertaillaskelma; ei muuteta julkaistuja arvoja. Provenienssi omalle reseptille selvitetään erikseen ennen mahdollista lähdemainintaa. |
| Rasvakaakao | Ei samannimistä reseptiä inventoiduissa reseptikansioissa. | [Uusi draft](luonnokset/rasvakaakao-rouva-keto.md), punnittavat määrät, oma [kuvitus](kuvitus/rasvakaakao.svg). |
| Lämmin chia-puuro | [`kaakao-kookos-chia`](../../../reseptit/aamupalat/kaakao-kookos-chia.md) ja [`marjainen-chiavanukas`](../../../reseptit/aamupalat/marjainen-chiavanukas.md) ovat **kylmiä** vanukkaita. | [Uusi draft](luonnokset/lammin-chia-puuro-rouva-keto.md), ei turhaa päällekkäisyyttä; oma [kuvitus](kuvitus/lammin-chia-puuro.svg). |
| Todellinen suklaaherkku | [`reseptit/jalkiruoat/suklaamousse-keto.md`](../../../reseptit/jalkiruoat/suklaamousse-keto.md) on **vain otsikko**, ei julkaistavaa ohjetta. | [Uusi draft](luonnokset/suklaavaahto-tummasta-suklaasta.md), oma [kuvitus](kuvitus/suklaavaahto.svg). Ratkaistaan vanhan tiedoston kohtalo ennen julkaisua. |

Päällekkäisyys on katsottu **main-haaran 2026-11-06** reseptinimistä ja yllä viitatuista sisällöistä; uusien PR:ien sisällöt tarkistetaan vielä ennen mergeä.

## Ravintoarvojen riippumaton vertailu

Aineskohtaiset syötteet, ravintolähteet, grammapainot ja kaikkien neljän uudelleenlaskettavat tulokset: [`independent-nutrition.json`](independent-nutrition.json). **Ei käytetty Sulamon reseptikohtaisia valmiita makroarvoja.** Energia on EU-kertoimilla laskettu arvio, ei laboratoriomittaus. Kokonaishiilihydraatti sisältää kuidun; imeytyvä hiilihydraatti on erillinen. Ei GI-/GK-julkaisua ilman hyväksyttyjä GI-lähdesidoksia.

| Vertailu, annosta kohden | kcal | Imeytyvä CHO g | Kokonais-CHO g | Proteiini g | Rasva g |
| --- | ---: | ---: | ---: | ---: | ---: |
| Rouva Keton Pofiber-pizzapohja: vertailulaskelma | 480,89 | 2,37 | 7,25 | 34,83 | 35,81 |
| Rasvakaakao | 326,53 | 1,63 | 3,45 | 1,82 | 34,35 |
| Lämmin chia-puuro | 501,01 | 2,96 | 13,28 | 8,75 | 48,17 |
| Kahden aineksen suklaavaahto | 193,03 | 13,46 | 15,44 | 6,67 | 12,06 |

**Ketopizza on vain pohjavertailu:** ruokalajina nykyisen julkaistun pizzan arvoja ei voi verrata suoraan täytepizzaan, eikä vertailu korvaa aiempaa ravintoevidenssiä.

**Suklaa on tärkeä päätöskohta:** tavallisen tumman suklaan Fineli-tietueessa on 53,26 g imeytyvää hiilihydraattia / 100 g. Siksi tässä suklaaversiossa on 13,46 g / annos eikä sitä pidetä automaattisesti ketoreseptinä. Erillinen sokerittoman suklaan skenaario vaatii täsmävalmisteen, polyolimäärät ja uuden laskennan. Pastöroidun valkuaisen vaahdotettavuus pitää koetestata.

## Keto-keittiöversiot ja ehdolliset GK-esikatselut (6.11.2026)

**Käyttäjän sisältöpyyntö:** kaikki neljä pysyvät keto-soveltuvina, ja lähdeidea tunnistettavana. GK-menetelmää **ei** höllennetä. Alkuperäiset lähtölaskelmat säilyvät muuttumattomina tiedostossa [`independent-nutrition.json`](independent-nutrition.json), ja uudet punnitut keto-versiot sekä omat lähdesidokset ovat [`keto-variants-2026-11-06.json`](keto-variants-2026-11-06.json).

| Resepti/versio | Keto-toteutus | KH g/annos | Ehdollinen suklaan GI29-skenaario GK¹ | GI:n puutteen vuoksi pois jäävä KH g/annos |
| --- | --- | ---: | ---: | ---: |
| [Rasvakaakao — tumma suklaa, keto](luonnokset/rasvakaakao-rouva-keto.md) | VARIANT_ONLY | 3,69 | 0,61 | 1,59 |
| [Lämmin suklaa-chia-puuro — keto](luonnokset/lammin-chia-puuro-rouva-keto.md) | VARIANT_ONLY | 3,11 | 0,61 | 1,01 |
| [Kahden aineksen ketosuklaavaahto (90 %)](luonnokset/suklaavaahto-tummasta-suklaasta.md) | CLARIFICATION_NEEDED | 3,64 | 1,02 | 0,14 |

¹ **Ei julkaistava GK-luku.** Lasku on `(Lindt 90 % CHO g/annos) × 29/100`; vain suklaa lasketaan ja muut tunnetut GI-puutteiset, yksittäin alle 1 g ja yhteensä alle 2 g osuudet eritellään avoimesti. Sama 29 ei ole Lindtin tuotekohtainen mittaus. GI-kategoriasidoksen soveltuvuus, lähteiden hyväksyntä, valmistusvaikutus sekä laskentamallin puuttuva suklaa-kategoria vaativat katselmoinnin. Ei GK0-kiertotietä, ei tekaistua GI:tä.

**Pizza on jo keto ja julkaistu.** Sitä ei muuteta tai kahdenneta. Rouva Keton pizzapohjavertailua ei muuteta keto-versioksi eikä GK-osumaa tavoitella annoksen keinotekoisella pienentämisellä. Pizzan nykyisestä reseptistä tarkistetaan ensin määrät, täytteiden tarkat hiilihydraatit, Pofiberin tuotemassa ja käytettävissä olevat suora-/valmistusvastaavat GI:t erillisessä hyväksytyssä GK-prosessissa.

## GK-laskennan rehellinen rajaus

Suklaan `GI 29` on [International Tables 2021](https://doi.org/10.1093/ajcn/nqab233) -katsauksen neljän tuotteen keskiarvo (rekisterissä `dark-chocolate-international-tables-mean-gi-29`). Se **ei** ole Lindt 90 % -tuotteen mittaus. Keskiarvon käyttäminen näissä resepteissä on *vasta arvioitava soveltuvuus*, ei hyväksytty GI-sidos. Seuraavassa ilmoitetaan vain **nimetty testiskenaario**, ei julkaistavaa GK-arvoa. Esikatselupisteet eivät sisällä GI:ltään tuntemattomien pienten ainesten vaikutusta; se on näkyvissä erikseen. Niistä ei saa tehdä täsmällistä GK-pistettä ilman menetelmäkatselmointia.

Uusi keto-keittiöversio ei korvaa Rouva Keton alkuperäistä eikä kartuta alkuperäisen reseptin GK-kattavuutta. Kerman vähentäminen chia-puurossa ja suklaan lisääminen kaakaoon ovat *erillisiä kulinaarisia versioita*. Erityisesti chia-puuron muutos on selvä, ei vain mittayksikön tarkennus.

Lindt 90 % [Suomen tuotetiedossa](https://www.lindt.fi/fi/lindt-excellence-dark-90-bar-100g-fi-fi-03046920029759) 100 g:ssä on 14 g imeytyvää hiilihydraattia, 10 g proteiinia, 55 g rasvaa ja 592 kcal, mutta **kuitu ja polyolit eivät ole eriteltyjä**. Niitä ei päätellä nollaksi. Näiden vaihtoehtojen `carbs_total_per_serving_g` jää tyhjäksi, kunnes tietue täsmennetään. Tämä ei estä imeytyvän hiilihydraatin laskemista labelista. Myös koekeittiön muna- ja rasvatuotteet tarkistetaan ennen mahdollista julkaisua.

Koodi `site/scripts/glycemic-load-model.ts` sisältää GI-kategorioiden kelpoisuuden tarkistuksen `categoryMeanMatchesFood`, jossa **ei tällä hetkellä ole `chocolate`-sääntöä**. En lisää sellaista sokkona: uusi tieteellinen / tekninen hyväksyntä tarvitaan, tai käytetään parempaa suoraan sopivaa GI-näyttöä. Ei muutoksia nykyisiin GK- tai GI-rekistereihin tässä PR:ssä.


## Julkaisemattomien reseptinimien jatkojono

Seuraavat ovat **vain kartoittamattomia nimiehdokkaita**, eivät lähdevarmennettuja ohjeita:

- Blogi/Facebook-maininnat: italianpata, jauhelihapohjainen pizza, kananuggetit, kaalisalaatti, jauheliha-kesäkurpitsa-tomaattipannu, kaalipata/kaalilaatikko, avokado-marja-proteiinipirtelö, parsakaali-punasipuli-tomaattisalaatti, lihapullat.
- Sulamo-nimihavainnot: lohiyllätys, valkosipulijuustorieska, rieska, syyspäivän sämpylät, juustosiemensämpylät, meksikolaisherkku, nopsa kesäkurpitsapannu, yrttiuunilohi, potpotmoussaka.
- Top 20 -e-kirjan nimiluettelo: lohturuoka, butterchicken ja kukkakaaliriisi, chili con keto, meksikon vuoka, cheddarpekonikana, Rouva Keton kesälasse, kimchikeitto, kasvisjauhelihasoppa, fetajuustokeitto, munakasrulla, rinkelit, ketoburger, riisitön sushi, ketokuningattaren kakku, lakujätski.
- Eri listoissa toistuvat nimikkeet (ketopizza, italianpata, kaalisalaatti, lohiyllätys, valkosipulirieskat) käsitellään **yhtenä ideana**, ei useana julkaistavana reseptinä. Täyttä maksullisen teoksen sisältöä ei haeta.

## Regressiotestin havainto: draftit erillisessä research-hakemistossa

Ensimmäinen toteutus sijoitti kolme uutta reseptiluonnosta `reseptit/raakileet/`-kansioon. GK-regressiotestien reseptimäärä nousi 327 → 330 **vaikka frontmatter oli `status: draft`**, ja 20 vanhaa GK-testiä epäonnistui. Reseptiauditoinnin nykyiset historialukitukset näyttävät laskevan myös raakileiden uudet MD-tiedostot. Siksi tämä tutkimuspaketti säilyttää luonnokset `docs/research/rouva-keto-2026-11-06/luonnokset/`-kansiossa, eikä koske reseptipuuhun. Vasta erillisessä julkaisuprosessissa siirretään hyväksytyt reseptit oikeisiin sisältökansioihin ja päivitetään testien hyväksytyt lukuarvot normaalin prosessin mukaan.

## CI-huomio 6.11. (ei piiloteta)

Tämän katselmointierän CI on punainen, samoin [samanaikainen main-CI #42199510115](https://github.com/ozirix-dev/Reseptit/actions/runs/42199510115). Molemmissa sama **20 GK-historialukittua testiä** epäonnistuu, mm. testin pysyvä odotus `92` vs toteutunut `95` sekä julkaistujen reseptien määrän `327` vs `330`. Ero vastaa viimeksi lisättyjä **kolmea briossireseptiä** mainissa; se ei ole tämän tutkimus-PR:n julkaisu tai oikeuta päivittämään historiaa ilman katselmusta. Tässä PR:ssä ei ole muutoksia `reseptit/`, `site/` eikä GK-lähdetietueisiin. CI-ongelman korjauksen omistaja on yleinen GK-regressiotestien ylläpito. **Ei Ready/mergeä ennen vihreää exact-HEAD-tarkastusta tai erikseen dokumentoitua, asianmukaisesti hyväksyttyä baseline-korjausta.**

## Ajantasainen katselmointi 8.11.2026

**[Tarkka julkaisuporttikatselmus ja valmistelun tulokset](julkaisuportit-2026-11-08.md)** täydentää alla olevaa 6.11. historiakirjausta. Tutkimus-PR:n HEAD `8001db15` läpäisi GitHub CI:n (ajo 42370488678) ennen tätä lisäystä. PR #351:n aiempi GK-historiatestiregressio on korjattu. Alla olevat vanhat punaisen CI:n merkinnät säilytetään tapahtumahistoriana, **eivät nykytilan väitteenä**.

Tutkimusaineiston arkistointi ja valmiiden reseptien julkaisu ovat eri hyväksynnät. Vihreä CI ei vahvista koekeittiötä, pastöroitujen munatuotteiden vaahtoutuvuutta, pakkauksia, tekijänoikeuksia tai tuotteeseen ja valmistukseen sopivaa GI:tä.

## Portit ennen Ready/merge/julkaisua

1. Hyväksy kolme punnittavaa keittiösovitetta ja pizzan vertailun rajaus; reseptit on koetehtävä. Chia-puuron suolamäärä on toimituksellisesti pienennetty.
2. Tarkista erityisesti kuohukerman rasvaprosentti, tuorejuusto, kookosöljy, Pofiber, tumma suklaa sekä pastöroidut munaerät tuotepakkausten ja ravintotietueiden tasolla. Jos tuote muuttuu, laske uudelleen.
3. Tarkista 90 % suklaan tuotetiedot, puuttuvat kuitu/polyolit sekä dark chocolate GI29 -soveltuvuus. Sovi vanhan `suklaamousse-keto.md`-otsikon käsittely ja varmista, ettei uusia duplikaatteja tule.
4. Kolme omaa, alkuperäistä SVG-kuvitusluonnosta on mukana tarkistukseen. **Julkaisussa kuvat on viimeisteltävä erillisiksi WebP-kuviksi** ja vietävä `kuvat/`-hakemistoon oikein mitoin, kuva-alt-tekstein ja testi-ajoin. Ketopizzalla on jo oma WebP.
5. Tarkista suomenkieliset tekstit, tee EN/SV/TH-käännökset tarvittaessa, ja aja `cd site && npm ci && npm test && npm run build && npm run test:static && npm run audit:nutrition`. Tässä tutkimus-PR:ssä ei ole tehty paikallista buildiä connector-ympäristössä.
6. GK pysyy julkaisematta, kunnes sekä mittauslähde- ja tuotekohtainen soveltuvuus että puuttuvien GI-osuuksien rajat on katselmoitu. Suklaan 29 on vasta kategorinen skenaario, ei hyväksytty piste. Draft-tila ei synnytä julkaistavia reittejä.

**Julkaisupäätöstä tai yhteistyöväitettä Rouva Keton kanssa ei ole tehty.**
