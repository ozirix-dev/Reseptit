# PR #311 – V8: ravintoarvoportin ainesosatarkastus ja eräjärjestys

Päiväys: 2026-11-07. Tämä on lähdematriisiin perustuva **laskennan valmistelun katselmointi**, ei hyväksytty ravintolaskenta eikä GK-päätös.

## Tarkistuksen lähtötila

- PR #311: 5 FI-raakiletta + 15 kieliluonnosta; edelleen `status: draft`.
- V7:ssa koepaisto/koekeitto hyväksyttiin **työoletuksena jatkokäsittelylle**, ei tosiasiallisesti tehdyksi mittaukseksi. Kaikki puuttuvat massa-/pakkaus- ja lähdetiedot säilyvät avoimina.
- PR:n edellisen HEADin `6a2d4258a4228e1f2bbcc77dd7effa05054552aa` CI Recipe site #42363799687: SUCCESS (build), deploy SKIPPED. GitHub: mergeable true, Draft.
- Luettu lähde: `docs/review/suomalaiset-klassikot-v2-aineslahiematriisi.json`. **47 ainesosariviä** = 24 `NUTRITION_CANDIDATE`, 10 `PRODUCT_EXACT_MATCH_MISSING`, 3 `RETAINED_MASS_UNKNOWN`, 10 `WATER_OR_SALT_ZERO`. Kenenkään `publishableNutrients`-kenttää ei hyväksytä automaattisesti.
- Tuotesidoksia `docs/review/suomalaiset-klassikot-v3-tuote-gikandidaatit.json` -aineistossa 9; EAN-luku **ei** tarkoita hyväksyttyä ravintolaskentaa.

## Reseptikohtainen lähdetilanne

| Resepti | Rivejä | Nutrition candidate | Product exact missing | Retained mass unknown | Vesi/suola | Konkreettinen seuraava laskentaportti |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Karjalanpiirakat | 10 | 2 | 2 | 2 | 4 | jauhojen täsmäluokka; kaulintajauhon ja voiteluvoin todellinen käyttö, APT |
| Marry me -kanapasta | 12 | 7 | 3 | 0 | 2 | De Cecco 69/72 g CHO -ristiriita; Royal-tomaatin valutettu/öljyinen massa ja E224/GTIN |
| Uunifetapasta | 9 | 6 | 2 | 0 | 1 | Barilla Penne n°73 + Mevgal feta tuotetäsmäys; muut Fineli-tietueet |
| Raejuustobagelit | 5 | 2 | 1 | 1 | 1 | Valio 2 x 200 g; jauhojen lähde; todellinen käytetty munavoitelu |
| Linssimakaronilaatikko | 11 | 7 | 3 | 0 | 1 | Myllyn Paras -makaroni, Coop-linssit, Valio 17 % Emmental; valmistus- ja ravintolähde-erottelu |
| **Yhteensä** | **47** | **24** | **10** | **3** | **10** | |

## Priorisoitu käsittely – pienin riski ensin

1. **Lähteiden täsmäys ilman laskennallisia oletuksia.** Tarkista yhdeksästä EAN-ehdokkaasta tuotteen nimi, pakkauksen hiilihydraatit, tarvittavat proteiini- ja rasvatiedot sekä syötävän massan ilmoitusperuste. Pidä ristiriitaiset luvut HOLDissa.
2. **Hyväksy ravintoarvot reseptikohtaisesti vasta täydestä syötematriisista.** Finelin yleiset vastineet ja julkiset EAN-kandidaatit ovat välivaihe. Kullekin 47 riville on löydyttävä hyväksyttävä arvo tai eksplisiittinen sallittu nolla; mitään rakenteellisesti puuttuvaa lukua ei arvata.
3. **Käsittele kolme tuntematonta syötyä massaa:** karjalanpiirakan kaulintajauho ja voitelu sekä raejuustobagelin kananmunavoitelu. Koepaiston työoletus **ei muuta** näitä automaattisesti ainesosamääriksi. Jos toimitus päättää käyttää koko varatun erän konservatiivisena reseptimääränä, tämä on dokumentoitava nimenomaisena *reseptin määränmuutoksena*, peilattava kaikkiin kieliin ja auditoitava; sitä ei saa esittää mitattuna kulutuksena.
4. **Laske makrot vasta hyväksytyistä syötteistä.** Hyväksytty hiilihydraattimäärä ei ole GK. Älä muuta `carbs_total_per_serving_g`-, `carbs_net_per_serving_g`-, `protein_per_serving_g`- tai `fat_per_serving_g`-kenttiä ennen hyväksyttyä laskenta-aineistoa.
5. **Käsittele GK erillisenä porttina:** GI-täsmäosuma per olennainen hiilihydraattilähde tai näkyvä `GK ei laskettavissa` -tila, jos julkaisujärjestelmä ja toimituksellinen päätös sen sallivat. Ryhmä-GI-analogia, 0-GI-arvaus tai pastan pelkkä tavaramerkkiosuma eivät riitä.
6. **Kielet, aitous ja julkaisu:** FI/EN/SV/TH merkityskatselmointi, allergeenit, karjalanpiirakan APT-eritelmä, luotettavasti merkitty AI-kuvitus sekä reseptikohtainen Ready/merge/deploy vasta soveltuvien porttien jälkeen.


## Julkaisun tekninen tietomallitarkastus

`site/scripts/build-content.ts` (buildRecipes) ohittaa `status: draft` -sisällöt, mutta käsittelee julkaistujen reseptien `carbs_net_per_serving_g`, `carbs_total_per_serving_g`, `protein_per_serving_g` ja `fat_per_serving_g` -kentät muodossa `?? null`. `site/src/types/content.ts` hyväksyy nämä neljä kenttää joko numerona tai `null`-arvona. **Sivuston sisältörakenne siis teknisesti tukee julkaistua reseptiä, jonka ravintoarvot puuttuvat.** Tämä on koodin lukemiseen perustuva havainto, **ei** tuotantotestin eikä toimituksellisen julkaisuportin hyväksyntä. Koodia, skeemaa ja historiallisia testejä ei muuteta tämän havainnon vuoksi.

Toimituksellinen suositus: ensisijaisesti hyväksytään täydet makrot lähdetietueiden kautta, mutta jos lähteiden varmennus pitkittyy, erillinen reseptikohtainen päätös voi mahdollistaa julkaisun, jossa arvot ovat `null` ja GK näkyvästi laskematta. Mitään ravintoväitettä ei tehdä ilman näyttöä. Päätös on erotettava automaattisen teknisen läpimenon tuloksesta.

## Päätös

Tässä vaiheessa **5/5 reseptiä jäävät DRAFT** ja **0/5 virallista GK-lukua hyväksytään**. Rakenteellinen lähdeportti ei ole valmis. Tavoite ei ole tekaista laboratoriokoetta tai pakkausmerkintää vaan valmistella julkaistavissa olevia reseptejä sitä mukaa kuin todelliset lähdetiedot ovat hyväksyttävissä.

Ei muutoksia main-haaraan, laskentasinetteihin, muihin PR:iin tai tuotantosivuun.
