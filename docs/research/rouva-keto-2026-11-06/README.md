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
| Rasvakaakao | Ei samannimistä reseptiä inventoiduissa reseptikansioissa. | [Uusi draft](../../../reseptit/raakileet/rasvakaakao-rouva-keto.md), punnittavat määrät, oma [kuvitus](kuvitus/rasvakaakao.svg). |
| Lämmin chia-puuro | [`kaakao-kookos-chia`](../../../reseptit/aamupalat/kaakao-kookos-chia.md) ja [`marjainen-chiavanukas`](../../../reseptit/aamupalat/marjainen-chiavanukas.md) ovat **kylmiä** vanukkaita. | [Uusi draft](../../../reseptit/raakileet/lammin-chia-puuro-rouva-keto.md), ei turhaa päällekkäisyyttä; oma [kuvitus](kuvitus/lammin-chia-puuro.svg). |
| Todellinen suklaaherkku | [`reseptit/jalkiruoat/suklaamousse-keto.md`](../../../reseptit/jalkiruoat/suklaamousse-keto.md) on **vain otsikko**, ei julkaistavaa ohjetta. | [Uusi draft](../../../reseptit/raakileet/suklaavaahto-tummasta-suklaasta.md), oma [kuvitus](kuvitus/suklaavaahto.svg). Ratkaistaan vanhan tiedoston kohtalo ennen julkaisua. |

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

## Julkaisemattomien reseptinimien jatkojono

Seuraavat ovat **vain kartoittamattomia nimiehdokkaita**, eivät lähdevarmennettuja ohjeita:

- Blogi/Facebook-maininnat: italianpata, jauhelihapohjainen pizza, kananuggetit, kaalisalaatti, jauheliha-kesäkurpitsa-tomaattipannu, kaalipata/kaalilaatikko, avokado-marja-proteiinipirtelö, parsakaali-punasipuli-tomaattisalaatti, lihapullat.
- Sulamo-nimihavainnot: lohiyllätys, valkosipulijuustorieska, rieska, syyspäivän sämpylät, juustosiemensämpylät, meksikolaisherkku, nopsa kesäkurpitsapannu, yrttiuunilohi, potpotmoussaka.
- Top 20 -e-kirjan nimiluettelo: lohturuoka, butterchicken ja kukkakaaliriisi, chili con keto, meksikon vuoka, cheddarpekonikana, Rouva Keton kesälasse, kimchikeitto, kasvisjauhelihasoppa, fetajuustokeitto, munakasrulla, rinkelit, ketoburger, riisitön sushi, ketokuningattaren kakku, lakujätski.
- Eri listoissa toistuvat nimikkeet (ketopizza, italianpata, kaalisalaatti, lohiyllätys, valkosipulirieskat) käsitellään **yhtenä ideana**, ei useana julkaistavana reseptinä. Täyttä maksullisen teoksen sisältöä ei haeta.

## Portit ennen Ready/merge/julkaisua

1. Hyväksy kolme punnittavaa keittiösovitetta ja pizzan vertailun rajaus; reseptit on koetehtävä. Chia-puuron suolamäärä on toimituksellisesti pienennetty.
2. Tarkista erityisesti kuohukerman rasvaprosentti, tuorejuusto, kookosöljy, Pofiber, tumma suklaa sekä pastöroidut munaerät tuotepakkausten ja ravintotietueiden tasolla. Jos tuote muuttuu, laske uudelleen.
3. Sovi vanhan `suklaamousse-keto.md`-otsikon käsittely ja varmista, ettei uusia duplikaatteja tule.
4. Kolme omaa, alkuperäistä SVG-kuvitusluonnosta on mukana tarkistukseen. **Julkaisussa kuvat on viimeisteltävä erillisiksi WebP-kuviksi** ja vietävä `kuvat/`-hakemistoon oikein mitoin, kuva-alt-tekstein ja testi-ajoin. Ketopizzalla on jo oma WebP.
5. Tarkista suomenkieliset tekstit, tee EN/SV/TH-käännökset tarvittaessa, ja aja `cd site && npm ci && npm test && npm run build && npm run test:static && npm run audit:nutrition`. Tässä tutkimus-PR:ssä ei ole tehty paikallista buildiä connector-ympäristössä.
6. GK jää tyhjäksi, ellei kullekin ainesosalle löydy omassa GK-prosessissa hyväksyttyä relevanttia GI-evidenssiä. Draft-tila ei synnytä julkaistavia reittejä.

**Julkaisupäätöstä tai yhteistyöväitettä Rouva Keton kanssa ei ole tehty.**
