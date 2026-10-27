# GK-vaihteluvälit, luokkavarmuus ja reseptiskenaariot – toteutussuunnitelma

**Tila:** PROPOSAL / DESIGN ONLY. Ei hyväksytty laskenta- tai julkaisukäytäntö.  
**Päiväys:** 2026-10-27 (Europe/Helsinki)  
**Omistaja:** Reseptit / GI–GK-laskenta  
**Tavoite:** kaikkien reseptien käyttäjälle hyödyllinen, perusteltu GK-tieto tai läpinäkyvä estoperuste – ei 325 keinotekoisesti täsmällistä GK-lukua.

## 1. Miksi tämä suunnitelma tarvitaan

Nykyinen malli julkaisee reseptikohtaisen GK:n vasta, kun nykyisen laskentapolitiikan edellyttämät GI-, koostumus-, massa- ja valmistustapavastaavuudet ovat kunnossa. Puuttuva tieto estää kokonais-GK:n. Tämä on hyvä turvatoimi, mutta käyttäjä voi jäädä kokonaan ilman tulkintaa, vaikka joistakin ainesosista tunnetaan päteviä vaihteluvälejä tai reseptin vaihtelut voitaisiin kuvata erillisinä skenaarioina.

Lokakuun 27. päivänä 2026 julkaistun Reseptit-mainin **b2ac53b11b45b8759d5f841ba978c966a50efe26** vertailutila on 325 reseptiä, 134 laskettua ja 191 keskeneräistä GK-arviota sekä 42 GI-tietuetta (5 STRONG, 37 SUPPLEMENTARY). Tavallinen strict nutrition audit on 180 / 86 / 59 / 0. Erillinen **Draft PR #117, erä 2B6C**, ehdottaa lisää tuloksia; sen laskelmia **ei** lasketa tässä dokumentissa tuotantoon julkaistuiksi. Pilotin alussa otetaan senhetkisen hyväksytyn mainin mukainen uusi baseline.

Tämä PR tallentaa päätösehdotuksen ja toteutusohjelman; **se ei muuta tuotantosivua, reseptejä, GI/GK-kaavaa, nykyisiä toleransseja, laskenta-JSONia, confidence-algoritmia tai CI:tä**.

## 2. Suunnittelupäätökset, joita pyydetään hyväksymään

1. Säilytetään nykyinen GK-pistelaskenta ja sen CALCULATED / INSUFFICIENT SOURCE DATA -käytäntö ennallaan ainakin pilotin ajan.
2. Määritellään sen rinnalle uusi, lähteisiin sidottu **GK-arvion esityskerros**, joka voi kuvata vaihteluvälin, perustellun luokan, laskennan vaihtoehtoiset skenaariot tai puuttuvan tuloksen syyn.
3. Vaihteluväliä ei generoida automaattisesti pelkästä puuttuvasta GI-arvosta. Vaihteluvälin **molemmille päille** vaaditaan näyttöä; puuttuva ei tarkoita nollaa eikä GI 100 ole universaali todistettu yläraja.
4. Reseptin alkuperäisiä ohjeita ja määriä ei muuteta vaivihkaa laskennan helpottamiseksi. Tarvittaessa luodaan nimettyjä, jäljitettäviä **laskentaskenaarioita** tai toimituksellisesti hyväksyttäviä vaihtoehtoisia reseptiversioita, joihin on erillinen hyväksyntä.
5. Erottelu säilytetään: **GI-lähteen laatuluokka**, **numeerisen GK-välin kattavuus** ja **GK-luokan pysyvyys** ovat eri käsitteitä. Pelkkä LOW-confidence ei yksin tarkoita korkeaa GK:ta.
6. Pilotin tuloksia ei julkaista automaattisesti. Jokainen toteutusvaihe tarvitsee oman PR:n, CI:n, auditoinnin ja ihmisen päätöksen.
7. Pitkän aikavälin tavoite on, että 325/325 reseptillä on informatiivinen arviointitila tai ymmärrettävä estoperuste. Tavoite **ei** ole 325/325 numeerista GK-arviota.

### Hyväksyttävät käyttäjälle näytettävät tapaukset

| Tuloslaji | Havainnollistava teksti | Vaatimus |
| --- | --- | --- |
| Nykyinen laskettu GK | GK noin 32 / annos | Nykyinen hyväksytty täyslaskenta |
| Lähteistetty GK-väli | GK arviolta 27–36 / annos | Perustellut ala- ja ylärajat, selitys ja lähde-evidenssi |
| Luokka ilman hyväksyttävää pistelukua | GK todennäköisesti matala – tarkka arvo epävarma | Luokittelun peruste eksplisiittinen; ei väitetä varmuutta ilman näyttöä |
| Ehdollinen skenaario | Vedellä X; erikseen yksilöidyllä maidolla Y | Kummallekin skenaariolle omat lähteet ja selkeät ainesosavalinnat |
| Ei riittävää näyttöä | GK ei vielä arvioitavissa: liemen tuote puuttuu | Estoperuste, ei null-arvosta johdettua nollaa |

Esimerkkiluvut 32, 27–36, X ja Y eivät ole todellisia julkaistavia reseptiarvoja.

## 3. Laskennan nykyiset rajapinnat ja varottavat yhteensopivuusongelmat

Nykyinen koodi:

- site/scripts/glycemic-load-model.ts: GlycemicLoadRecipeInput, GlycemicIndexRecord, GlycemicLoadResult ja calculateGlycemicLoad.
- site/src/features/recipes/glycemic-load-display.ts: julkaisee vain CALCULATED-kokonaisuuden, jonka pisteluku ja confidence ovat olemassa.
- docs/nutrition/glycemic-load-pilot-input.json, glycemic-index-records.json, food-records.json ja glycemic-load-recipe-bindings.json.
- docs/nutrition/glycemic-coverage-batch-2b6b-current.json sekä myöhempi julkaistu current-inventaario.

GlycemicLoadResult sisältää jo kentän **glycemicLoadRangePerServing**, mutta nykyinen toteutus muodostaa sen hyväksytystä ainesosakohtaisesta hiilihydraattiskenaariosta **vain, kun resepti on muuten CALCULATED**. Sitä ei saa tulkita yleiseksi GI-epävarmuuden vaihteluväliksi eikä käyttää puuttuvan GI:n peittämiseen.

Nykyisen pisteluvun status, julkaisutapa, pyöristys ja vertailufingerprintit pysyvät erillisenä. Uusi arviointimalli on aluksi oma versionoitu tietorakenteensa ja myöhemmin erikseen hyväksyttävä käyttöliittymärajapinta. Vältä nykyisen GlycemicLoadResult-kentän merkityksen hiljaista laajentamista.

Nykyinen classifyGlycemicLoad pyöristää ensin lähimpään kokonaislukuun: LOW pyöristettyyn 10:een asti, MEDIUM 11–19, HIGH 20 alkaen. Mahdollisen vaihteluvälin luokkavarmuus on määritettävä tämän saman nykyisen luokittelun kautta **ennen esityspyöristystä**, eikä käyttöliittymä saa peittää luokkarajan ylitystä.

## 4. Ehdotettu arviointitietomalli (ei toteutusta tässä PR:ssä)

Ehdotettu arvioinnin päätyyppi on esimerkiksi **GlycemicAssessmentV1**. Tarkka TypeScript-tyyppi päätetään toteutus-PR:ssä. Suositellut kentät:

- recipeId, recipeVersion, servings, assessedAt, modelVersion, policyVersion ja sourceCommit.
- evidenceFingerprint, calculationInputFingerprint ja sourceReferences.
- kind: POINT_ESTIMATE, EVIDENCE_BOUNDED_RANGE, CLASS_ONLY, CONDITIONAL_SCENARIOS tai UNAVAILABLE.
- pointValue ja pointConfidence vain, jos nykyinen point-malli sen hyväksyy.
- lower, upper, unit, lowerEvidence, upperEvidence, intervalSemantics ja intervalLimitations vain, jos hyväksyttävä todistusaineisto tukee kumpaakin rajaa.
- lowerClass, upperClass, classRobustness: STABLE, CROSSES_BOUNDARY tai NOT_DETERMINABLE.
- sourceQuality ja methodologicalConfidence erillisinä mahdollisesta numeerisen välin kattavuudesta; älä nimeä sääntöperustaista väliä tilastolliseksi confidence intervaliksi.
- scenarioId, scenarioLabel, selectedIngredients, quantities, productIdentity, recipeVersion sekä omat lähteet ja tulokset jokaiselle vaihtoehdolle.
- blockers, unresolvedIngredients, missingEvidence ja publicExplanation myös UNAVAILABLE-tilassa.
- calculatedCarbohydratePerServingG, unresolvedCarbohydrateBoundG ja omittedCarbohydrateG, jos niille on lähteistetyt perusteet.
- reviewerDecision, decisionEvidence, reviewedHead sekä publicationState; julkaisematon laskentakokeilu ei ole julkinen fakta.

Tärkeä sääntö: **kind on julkisen esityksen ensisijainen luokka**, mutta skenaario voi sisältää omat POINT/RANGE/CLASS_ONLY/UNAVAILABLE-alituloksensa. Malli ei saa antaa yhdelle reseptille ristiriitaisia julkisia pistelukuja tai luokkaväitteitä.

Versionointi ja vanhojen havaintojen säilytys on suunniteltava niin, ettei vanha näyttöä vailla oleva arvo jää roikkumaan reseptin muuttuessa. Julkaisuvahti hylkää vanhentuneet resepti-, syöte- tai lähdefingerprintit.

## 5. Tarkat vaihteluvälisäännöt

Ainesosasta i tarvitaan hyväksytyt **imeytyvän hiilihydraatin** rajat Cmin_i ja Cmax_i sekä elintarvikkeen ja valmistuksen kannalta perustellut GIrajat GImin_i ja GImax_i. Kaikkien arvojen on oltava ei-negatiivisia ja lähteistettyjä.

Jos käytettävissä on samanaikaisesti toteutuvia, perusteltuja ala- ja ylärajoja, laskennallinen herkkyysväli voi olla:

- GK_min = Σ(Cmin_i × GImin_i / 100)
- GK_max = Σ(Cmax_i × GImax_i / 100)

Yllä oleva on **laskennallinen skenaarioväli**, ei kliininen mittaustulos tai automaattisesti tilastollinen 95 % luottamusväli. Intervalliaritmetiikan soveltuvuus riippuu myös rajojen yhteensopivuudesta: jos hiilihydraatti- ja GI-rajoihin liittyy samaan tuotteeseen sidottuja korrelaatioita tai keskenään mahdottomia yhdistelmiä, ääripäitä ei saa esittää toteutuvina ilman tarkistusta. Tarvittaessa lasketaan erilliset toteutettavissa olevat skenaariot.

Älä tee seuraavia päättelyjä:

- GI tuntematon → GI välillä 0–100 on todistettu vaihteluväli.
- Tutkimuksen GI 38 ± 2 → GI:n varmasti toteutuva raja on 36–40. ± saattaa tarkoittaa SD:tä, SEM:ää tai muuta tutkimusvaihtelua.
- Raaka tomaatti GI 22 → kypsän tomaattimurskan GI 22.
- Sokeriton suklaa → kaikkien suklaatuotteiden yleinen vaihteluväli.
- Kuluttajan vaihtoehtoinen kookosmaito → yksi yksilöity tuote.
- Puuttuva ainesosan massa tai hiilihydraatti → nolla.
- Kaikkien hyväksyttyjen vaihtoehtojen ääriarvot → yksi universaali yksittäisen ruoan tarkka vaihteluväli.
- GI 100 → universaali biologinen yläraja (joitakin GI-arvoja voi esiintyä yli 100).

Jos rajaa ei voida lähteistää, se jää tuntemattomaksi. Ylärajan puuttuminen estää väitteen varmasta GK-luokasta, jos luokkavarmuus riippuisi ylärajasta.

### Nykyisten pienosuustoleranssien suhde uuteen malliin

Säilytä ennallaan:

- Yksittäinen pois jätetty positiivinen, GI:ttömäksi jäänyt imeytyvän hiilihydraatin osuus alle 1 g / annos.
- Kaikkien vastaavien pois jätettyjen osuuksien summa alle 2 g / annos.

Näitä ei saa laajentaa tai käyttää yksin todistamaan uuden vaihteluvälin ylärajaa. Poisjätön vaikutus raportoidaan erillisenä nykyisen toimituksellisen politiikan mukaisena epävarmuutena. Lähteistetty nolla, näytöllä nollaksi pyöristynyt positiivinen arvo, perusteltu yläraja ja täysin tuntematon määrä pysyvät neljänä eri tilana.

## 6. GK-luokan vakauden todistaminen

Luokka voidaan nimetä **STABLE** vain, jos kaikki hyväksytyn skenaarion mahdolliset väliarvot kuuluvat samaan nykyisen luokittelufunktion luokkaan. Käytä täsmälleen samaa funktiota pistearvoille ja välin päille; suojaa rajatapaukset testeillä.

Jos väli ylittää luokkarajan, näytä vaihteluväli ja esimerkiksi "GK-luokka voi olla keskisuuri tai korkea". Älä esitä yhtä luokkaa käyttäjälle varmasti oikeana.

**CLASS_ONLY** voidaan sallia ilman numeerista pistelukua vain, kun luokkaa koskeva johtopäätös on aidosti johdettavissa aineisto- ja valmistuskohtaisista lähteistetyistä rajoista. Pelkkä "annoksessa on vähän hiilihydraatteja" tai väljä GI-yleistys ei automaattisesti riitä; jos luokan perusteita ei voida rajata, status on UNAVAILABLE.

Erota käyttöliittymässä sanat "arvioitu", "laskennallisesti rajattu", "luokan pysyvyys" ja "GI-lähteen luottamus". Älä väitä kliinistä tai yksilöllistä verensokerivaikutusta.

## 7. Reseptien muokkaaminen ja vaihtoehtoiset skenaariot

**Oletus on, että julkaistu alkuperäinen resepti pysyy muuttumattomana.** Seuraavia voidaan myöhemmin harkita, mutta jokaisessa on erillinen toimituksellinen päätös:

1. Jos resepti sallii "maito tai vesi", laske molemmat nimetyissä skenaarioissa. Älä muuta alkuperäistä ohjetta automaattisesti "vain vesi" -muotoon.
2. Jos resepti käyttää yksilöimätöntä kookosmaitoa, testaa erilliset skenaariot vasta, kun molempiin valittuihin tuotteisiin on luotettava koostumus- **ja tarvittaessa GI-**näyttö. Pelkkä rasvapitoisuus ei ratkaise GI-puutetta.
3. Jos riisin lajike tai leivän tyyppi ratkaisee arvion, skenaario voi sisältää tarkasti nimetyn vaihtoehdon sekä siitä poikkeavan reseptin avoimen tilan.
4. Jos valmistustapa tai syötävä massa on ratkaiseva, älä vaihda niitä takaisinlaskemalla haluttuun GK-luokkaan.
5. Jos käyttäjälle halutaan lisätä valinta, se ei saa muuttaa reseptin lähdeversiota, SEO-kanonikaalia tai ravintoarvojen todellista syötehistoriaa ilman suunniteltua erillistä toteutusta.

Skenaariot on nimettävä FI/EN/SV/TH kielillä ja ne on erotettava reseptin varsinaisesta ainesosaluettelosta ja ravintoarvoista. Väärän skenaarion arvoa ei saa esittää reseptin yleisenä GK:na.

## 8. Pilotin otanta – 30 reseptiä ennen mallimuutoksia

Toteuta erillinen **lukutilainen 30 reseptin tutkimuspilotti** myöhemmässä PR:ssä, ennen kuin kirjoitetaan uusi laskentakoodi. Valitse todellisen hyväksytyn mainin mukaan edustava, kerrostettu otanta:

- 6 reseptiä: hyvin lähteistetty hiilihydraattikoostumus, mutta GI:n epävarmuus.
- 6 reseptiä: yksi puuttuva tai valmistuksen kanssa ristiriitainen GI-lähde.
- 6 reseptiä: reseptin vaihtoehtoinen neste tai tuotetyyppi.
- 6 reseptiä: koostumus- tai massatiedon puute / vanhentunut syötesidonta.
- 6 reseptiä: hiilihydraattimäärä on pieni tai nykyinen luottamus LOW ja käyttäjälle näkyvä vaikutus on rajallinen.

Jos ryhmät menevät päällekkäin, luokittele kukin resepti vain yhden pääryhmän alle ja dokumentoi sivuestot. Valitse myös korkean GK:n tai luokkarajoja ylittävän epävarmuuden esimerkkejä, ei vain VHH-ruokia. Kaikki 30 recipeId:tä ja valintaperusteet kirjataan etukäteen muuttumattomaan pilottikohdeluetteloon.

Pilotin jokaiselle reseptille kirjataan:

- nykyinen hyväksytty GK/estot ja ravintoarvotila
- koostumus- ja GI-lähteet sekä valmistus
- mikä lähderaja on aidosti perusteltavissa
- mahdollinen POINT/RANGE/CLASS_ONLY/SCENARIOS/UNAVAILABLE-tulos
- miksi jokin numeerinen väli ei ole hyväksyttävissä
- classRobustness, sourceQuality ja näkyvä esitysesimerkki
- aiemman laskennan ja ehdotetun arvion ero
- itsenäisen arvioijan PASS / NEEDS_SOURCE / BLOCKED -päätös

**Älä julkaise pilottiarvoja tuotantoon, muuta nykyistä 134+ julkaisuarvoa tai laske epämääräisestä aineistosta GK:n keksittyä vaihteluväliä.**

## 9. Pilotin numeeriset ja laadulliset mittarit

Raportoi erikseen, kuinka moni otoksen resepti saa:

- olemassa olevan pisteluvun säilyttäen nykyisen esitystavan
- hyväksyttävän lähteistetyn vaihteluvälin
- lähteistetysti vakaan GK-luokan mutta ei hyväksyttävää pistelukua
- kaksi tai useampia toisistaan erotettuja ehdollisia skenaarioita
- pelkän läpinäkyvän estoperusteen
- keskeneräisen lähdekatselmoinnin

Luvut eivät saa mennä toistensa kanssa päällekkäin julkisen ensisijaisen esitysmuodon tasolla. Jos mukaan lasketaan päällekkäisiä tutkimustuloksia, raportoi ne erikseen.

Arvioi lisäksi: vaihtoehtojen valmistustapavastaavuus, virheellisen "tarkan" välin riski, luokkien rajanylitykset, muuttuneet käyttäjätulkinnat, tekstin ymmärrettävyys FI/EN/SV/TH, tiedon ylläpitokustannus ja regressioriski. **Go/no-go päätös pitää perustua evidenssin laatuun ja käyttäjähyötyyn, ei vain siihen, kuinka monta numeerista arvoa saatiin.**

## 10. Toteutuksen vaiheistus – yksi hallittu Codex-ajo kerrallaan

Tämä suunnittelu-PR ei valtuuta toteutusajojen käynnistämistä. Toteutus jaetaan seuraaviin erillisiin, hyväksyttäviin PR:iin.

### P0 – 30 reseptin lähde- ja mahdollisuusauditointi

Tavoite: todelliset lukumäärät, lähdepuutteet ja käyttäjälle hyödylliset tuloslajit. Ei laskenta- tai UI-muutoksia.

Hyväksyntä: jokaisella pilottikohteella toistettavat lähteet, päätös ja estot; ei julkaisuja.

### P1 – Mallin ADR ja täsmällinen skeema

Tavoite: hyväksy uusi, versionoitu arviointirakenne, rinnakkaisuus nykyisen GlycemicLoadResult-tuloksen kanssa, laatuportit ja puuttuvien arvojen merkitys. ADR sisältää myös päätöksen siitä, mitkä lopputyypit sallitaan pilotissa.

Hyväksyntä: tyyppitarkat esimerkit kaikista tulostiloista, null/0-erottelu, intervalSemantics, sourceReferences, modelVersion, fingerprintit ja fallback.

### P2 – Ei-julkinen laskentamoottorin prototyyppi

Tavoite: testattu puhdas funktio vaihteluväleille, luokkarajojen tunnistukseen ja skenaarioille. Nykyinen julkinen julkaisutapa pysyy päällä; uutta mallia ei käytetä automaattiseen julkaisuun.

Hyväksyntä: vain lähteistetyt rajat, epävarmat tapaukset palauttavat UNAVAILABLE; virheelliset lähteet estyvät; kaikki vanhat GK-arvot muuttumattomat.

### P3 – Lähde- ja sisältökytkentä vain pilottiresepteille

Tavoite: hyväksytyt 30 kohdetta, luotettava lähdemetadata, versioidut skenaariot, auditit ja regressiot; vielä ilman julkista käyttöliittymää.

Hyväksyntä: jokainen esitys voidaan rekonstruoida lähde- ja syötefingerprinteistä, alkuperäisreseptit säilyvät.

### P4 – Käyttöliittymän ja nelikielisten tekstien rajattu pilotti

Tavoite: selkeä näkyvä ero pisteluvun, vaihteluvälin, vakaan luokan, skenaarion ja puuttuvan tuloksen välillä. Responsiivisuus, saavutettavuus ja hakemistokortit auditoidaan; kanonikaali- ja SEO-rakenne eivät saa rikkoutua.

Hyväksyntä: FI/EN/SV/TH-terminologia tarkistettu, näytöt eivät johda harhaan, selain- ja staattiset testit läpäisevät. Ei automaattista koko sivuston käyttöönottoa.

### P5 – Erillinen tuotantopäätös ja laajentaminen

Tavoite: pilotin tulosten perusteella valittu vaiheittainen julkaisu. Käyttöönotto vain riippumattoman katselmoinnin ja omistajan hyväksynnän jälkeen. Julkaistut GK-pisteluvut pysyvät entisellään, ellei uusi lähdekorjaus erillisessä PR:ssä oikeuta muutosta.

Hyväksyntä: tuotannon Pages build/deploy, selainvarmennus, 325 reseptin regressiot, ReportHub-closeout ja palautussuunnitelma PASS.

**Ei rinnakkaisia kirjoittavia Codex-ajoja samoihin laskenta- tai UI-tiedostoihin.**

## 11. Regressiot ja virheellisen luottamuksen torjunta

Pakolliset testit suunniteltava ainakin seuraaville:

- Lähteistetty hiilihydraatti 0 g ja puuttuva hiilihydraatti null erotetaan.
- Käytettävissä olevan hiilihydraatin intervalleissa ala- ja yläraja ovat ei-negatiivisia, äärellisiä ja ala ≤ ylä.
- Lähteetön GI-alas/ylös -väli hylätään.
- Raportoitu GI ± vaihteluluku ei muutu automaattisesti min/max-rajaksi.
- GI voi olla yli 100; GI=100 ei ole yleinen vahvistettu yläraja.
- Eri valmistukset / tuotelajit eivät pääse väärään ruokaperheeseen (raaka/kypsä tomaatti, maitosuklaa/maito, riisiviinietikka/riisi, peruna/maissitärkkelys, kookosmaito/puuro).
- Nykyiset alle 1 g ja alle 2 g toimitukselliset toleranssit säilyvät muuttumattomina.
- Alueen molemmat päät luokitellaan nykyisellä round-then-classify-menetelmällä.
- Luokkarajojen 10,49 / 10,50 ja 19,49 / 19,50 ympäristö testataan (lukuarvojen pyöristys IEEE-/JS-semanttiikalla ja rajapolitiikalla).
- Vaihteluväli, joka ylittää luokkarajan, ei tuota yhtä "varmaa" luokkaa.
- Vaihtoehtoinen maito/vesi, riisilajike ja muu ainesosa ei vuoda väärään skenaarioon.
- Erillisen skenaarion lähde-/reseptiversion vaihtuessa aikaisempi arvio vanhenee ja jää julkaisematta.
- Ei lupauksia yksilön verensokerivasteesta tai seka-aterian mitatusta GK:sta.
- Nykyisen tuotannon GK-pisteluvut, pyöristys, luokat ja confidence-metadata eivät muutu ilman erikseen hyväksyttyä lähtöaineistomuutosta.
- Tuotantobuild, staattiset reitit, selain-, kuva- ja käännöstestit sekä saavutettavuuden regressiot toimivat valittujen vaiheiden riskiä vastaavasti.

Nykymallin jo olemassa olevaa glycemicLoadRangePerServing-kenttää testataan erikseen, ettei sitä tai sen semantiikkaa muuteta vahingossa.

## 12. Julkisen käyttöliittymän tekstilinja (myöhempi vaihe)

Suomenkieliset alustavat tekstit:

- "GK-arvio noin 32 / annos" (nykyinen hyväksytty pisteluku).
- "GK-arvio noin 27–36 / annos" (lähteistetty vaihteluväli, ei kliininen luottamusväli).
- "GK-luokka: matala; tarkkaa lukua ei voida vielä perustella" (vain jos luokan vakaus on todella osoitettu).
- "Valitse laskentavaihtoehto: maito / vesi" (ei muuta alkuperäistä reseptiä).
- "GK ei vielä arvioitavissa – tarkka kastike-/liemituote puuttuu" (UNAVAILABLE).

Kaikissa tulostavoissa tarjotaan tiivis "Mihin arvio perustuu?" -selite ja tarvittaessa ainesosakohtainen evidenssi. LOW source confidence -merkintää ei korvata epämääräisellä varmuuskielellä. Tekstit ovat luonnoksia; nelikielinen toimituksellinen tarkistus tehdään P4-vaiheessa.

Varmista, että GK-luokittelufiltterit, hakemiston jakokelpoiset URL-suodattimet, reseptikortit, menetelmäsivut ja hakukoneiden rakenteiset tiedot eivät vahingossa käsittele UNAVAILABLE-tilaa nollana tai skenaariovalintaa mitattuna GK-arvona.

## 13. Governance, riippuvuudet ja suojaus

- Aktiivinen 2B6C-kattavuus PR #117 on **erillinen keskeneräinen työ**. Tämä suunnittelu-PR ei muuta sen haaraa eikä sulje sitä. Pilotin lähtötila tulee lopullisesta hyväksytystä mainista, ei avoimesta Draft PR:stä.
- Avoin Nutritics PR #100 ja Vite-päivitys PR #116 ovat erillisiä töitä.
- Hyderabadi-kanabiryanin sipulimuunnoksen tavallisen ravintoarvon ristiriita on erillinen korjaus.
- Alkuperäinen LOW confidence -algoritmi ei muutu tässä PR:ssä.
- Sivuston tekijänoikeus- ja lähdekäyttöehdot on tarkistettava ennen uusien GI- tai koostumusaineistojen tuotantokäyttöä.
- Ei force-pushia, git reset --hard -ajoa, git clean -ajoa, muiden työpuiden muutoksia eikä olemassa olevien historiallisten snapshotien regenerointia.
- Älä koske säilytettyyn työpuuhun D:/Projects/tmp/reseptit-2b6b-misrouted-worktree-preserved.
- ReportHubiin tehdään P0:n ja myöhempien vaiheiden auditointimerkinnät erikseen soveltuvissa myöhemmissä ajoissa; tästä suunnittelu-PR:stä ei tarvitse tehdä tuotantovarmennusta.
- UTC-tapahtuma-ajat ja Europe/Helsinki-ajat erotellaan. Raportin As of on YYYY-MM-DD HH:mm EET/EEST tai hyväksytty aikavyöhykemuoto, ja tarkoittaa kuvattua, todellista varmennustapahtumaa.

## 14. Stop-ehdot ja hyväksymisportit

Työ on palautettava katselmointiin ilman laskenta- tai julkaisumuutosta, jos:

1. GI-välin minimi tai maksimi ei perustu hyväksyttävään lähteeseen.
2. Ehdotettu "varma GK-luokka" riippuu perustelemattomasta universaalista GI-ylärajasta.
3. Skenaariot edellyttävät alkuperäisen reseptin hiljaista vaihtamista.
4. Puuttuva koostumus, massa tai valmistustapa naamioituu oletusluvuksi.
5. Nykyisten jo julkaistujen GK-pistelukujen status, luokka tai arvo muuttuisi epähuomiossa.
6. Pilotin tuloksia ei voida toistaa lähde- ja reseptiversiolla.
7. FI/EN/SV/TH-esitystavan ymmärrettävyys tai matalan/korkean luokan tulkinta johtaa harhaan.
8. Laskennan tai CI:n nykyiset regressioportit eivät läpäise.

Päätöksentekoa varten pilotin lopussa on esitettävä eksplisiittinen **GO / CONDITIONAL GO / NO-GO** ja perustelut.

## 15. Tämän suunnittelu-PR:n valmistumisen kriteerit

- Tallennettuna on tämä kirjallinen suunnitelma, esitystavat, rajapintaluonnos, vaihteluvälien hyväksymisvaatimukset, 30 reseptin otanta, pilottimittarit, toteutuksen viisi erillistä jatkovaihetta ja regressioportit.
- Yhtään laskentakaavaa, GI-tietuetta, reseptiä, UI-tiedostoa, vanhaa snapshotia tai julkaistua GK-arvoa ei muuteta.
- GitHub-PR avataan **Draft / suunnitteluehdotuksena**, eikä sitä yhdistetä automaattisesti.
- Allekirjoitettavat avoimet päätökset: skenaarioiden datamalli, mitkä intervalSemantics sallitaan, luokan vakauden näyttökynnys, lähteiden sallittavat epävarmuusmääritykset, käyttöliittymän terminologia ja pilotin hyväksymiskynnys.
- Ensimmäinen toteutusajo on **P0: vain 30 reseptin lähde- ja potentiaaliauditointi**, erillisenä myöhempänä tehtävänä.

**Lopputavoite: käyttäjä näkee perustellun tiedon tai ymmärrettävän syyn tiedon puutteelle. Laskentaa ei saa pakottaa kattavuusprosentin vuoksi.**
