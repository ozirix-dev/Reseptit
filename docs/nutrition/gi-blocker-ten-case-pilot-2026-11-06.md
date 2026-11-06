# GI-lähteiden kohdennettu 10 reseptin pilotti — 6.11.2026

**Tila:** RESEARCH_ONLY / DRAFT / ei hyväksyttyjä GI- tai GK-arvoja
**Lähtötilan estelista:** [GK100 ratkaisuerä 02, PR #292](https://github.com/ozirix-dev/Reseptit/pull/292), tiedosto `docs/nutrition/gk-original-solutions-batch02/priority-snapshot.json` SHA:ssa `20bfcefb621a2bafa16f240591c7749fe8023fc5`. Tämä on **5.11. historiallinen prioriteettikuva**, ei automaattisesti tämän päivän tuotantotila.
**Reseptit:** kaikki kymmenen reseptin **main-haaran sisältö** avattu ja blob-SHA kirjattu 6.11.2026. Ei nykyisen julkaistun GK-esterekisterin täyttä uusinta-ajoa tässä pilotissa.
**Aiemmat löydöt:** [GI-regional intake PR #299](https://github.com/ozirix-dev/Reseptit/pull/299) (21 faktahavaintoa, kahdeksan muuta reseptivertailua), [ReportHub 5.11. audit](https://github.com/ozirix-dev/ReportHub/blob/main/reports/audits/2026-11-05-gi-tutkimusaineistojen-lahdekartoitus.md) sekä [Issue #300](https://github.com/ozirix-dev/Reseptit/issues/300) (Grokin 30 lähteen vertailu). **Nämä 10 reseptiä valittiin eri resepteiksi kuin #299:n kahdeksan vertailua.**

## Työn tavoite ja onnistumiskriteerit

Poimitaan alkuperäisreseptien GI-esteistä 10 kiinnostavaa, lähteistettyä tapausta. Etsitään ihmisillä tehtyjä alkuperäismittauksia ja erotetaan toisistaan 1) **mittauksen olemassaolo**, 2) **sama ruoka ja valmistus**, 3) **kaupallisen käytön/taulukkokopioinnin oikeudet**, 4) **reseptin muiden CHO- ja GI-sidosten täydellisyys**.

Vain kaikki portit läpäisevä tapaus saa **ehdokkaaksi** GK-laskentaan; hyväksyntä ja julkaisu ovat myöhempiä eri toimia. Lähteiden avaaminen tai faktan siteeraaminen ei oikeuta tietokannan massakopiointia. `0` ei korvaa tuntematonta GI:tä. Numeroita ei siirretä yhteenkään tuotantitiedostoon.

## Kymmenen tapausta ja päätökset

Estetty saatava CHO/annos -arvo on historiallisesta #292-snapshotista, ei tämän raportin uusi ravintolaskelma. Jos lukua ei voi vahvistaa tämänhetkisestä syötteestä, tarkistetaan se myöhemmin ennen numeerista laskentaa.

| # | Alkuperäisresepti / nykyisen mainin recipe-blob SHA (alku) | GI-este snapshotissa, CHO g/annos | Parhaat löydöt / valmistusvertailu | Pilottipäätös |
| --- | --- | --- | --- | --- |
| 1 | `jauheliha-makaronilaatikko` `cb98ea94` | Kuiva makaroni uunissa munan, maidon ja juuston kanssa; **33,2** | [Jenkins ym. 1986, PMID 3743316](https://pubmed.ncbi.nlm.nih.gov/3743316/) mittaa makaronille **GI 68 ± 8**, mutta kyseessä ei ole munamaitoon paistettu vuoka. [Johnston ym. 2017, PMID 28771262](https://pubmed.ncbi.nlm.nih.gov/28771262/) tutki makaroni-juustoateriaa (13 osallistujaa): **verensokerivastevertailu**, ei reseptimme ISO-GI. [Pasta GI -katsaus 2021](https://pubmed.ncbi.nlm.nih.gov/34828822/) kuvaa hajontaa ja 95 pastatuotetta, ei täsmä-GI:tä. | **P1 / ORIGINAL_STUDY_LEAD**. Aito relevantti primaarimittaus löytyi, **EI hyväksyttyä uunivuoan GI:tä**. Tarkista tutkimusten pasta, kypsennys, muna-/maitoseos ja prosessointi ennen käyttöä. |
| 2 | `pohjoisafrikkalainen-taatelipuuro-appelsiinilla` `041aa9a5` | Mannasuurimo vedessä haudutettuna; **31,8** | [Mani ym. 1992, PMID 1445824](https://pubmed.ncbi.nlm.nih.gov/1445824/): ihmisillä mitattuja semolinavalmisteita, mutta höyrytetty/paahdettu+gelatinoitu ≠ nykyinen vesihaudutus. [AJCN 2022](https://ajcn.nutrition.org/article/S0002-9165%2822%2900218-0/fulltext): 16 henkilön porridgetutkimus mittaa glukoosivastetta, mutta ei soveltuvaa täsmä-GI:tä juuri tälle puurolle. | **P1 / PREPARATION_MISMATCH**. Arvot oikealle semolinalle ovat olemassa; nykyiseen keittotapaan ei riittävää vastaavuutta. Ei GI 55:n automaattista kopiointia. |
| 3 | `vada-pav` `335f2e51` | Friteerattavan perunapihvin kikhernejauho; **9,625** | [Chickpea flour / extruded chickpea bread, PMID 15483639](https://pubmed.ncbi.nlm.nih.gov/15483639/) mittaa leipää ihmisillä, ei friteerattua besan-perunakuorta; [palkokasvien GI-katsaus, PMID 32419476](https://pubmed.ncbi.nlm.nih.gov/32419476/) korostaa jauhatuksen ja kypsennyksen vaikutusta. | **P2 / FOOD_FORM_MISMATCH**. Tutkimusjohtolanka, ei vada pavin kikhernejauhokuoren mittaus. |
| 4 | `keltainen-kanacurry-vhh` `83195285` | Täysrasvainen kookosmaito 400 g/4 annosta; **2,81** | [PMID 22849311](https://pubmed.ncbi.nlm.nih.gov/22849311/) esittää kookosmaitoa sisältävän **riisipuuron GI 31 ± 5**, ei erikseen kookosmaidon GI:tä. [Non-Western 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7791047/) täsmentää koostumukseksi riisi + kookosmaito. Jo tunnettu negatiivinen lähdejohtolanka. | **HOLD / WRONG_FOOD_MATRIX**. Ei hyväksytä GI 31:tä kookosmaidolle. |
| 5 | `valimerellinen-farinata-aamupalaksi` `a80d7bb2` (main ennen korjausta) | Tomaatti; **1,725** | **TARKENNETTU:** mainin samassa valmistusohjeessa ovat **molemmat**: ristiriitaiset pannupaistovaiheet 1–3 ja 220 °C:n uunipaistovaihe 4. Historiallinen #292:n 220 °C:n blocker-konteksti **ei ollut virhe**. [Kohdennettu reseptikorjaus PR #323:ssa](https://github.com/ozirix-dev/Reseptit/pull/323) säilyttää uunivalmistuksen, poistaa pannuvaiheet ja korjaa kokonaisajan 25 → 55 min. Yleinen `cooking_method: paistaminen` säilyy ennallaan, jotta laskentasidoksen rakenteellinen tarkiste ei muutu. | **EDITORIAL_FIX_IN_DRAFT / GI_HOLD**. Reseptitekstin valmistusristiriita korjattu Draftissa; tomaatin uunivalmistusta vastaava ihmis-GI **puuttuu edelleen**. |
| 6 | `vhh-mustikkapiirakka` `1cf8d8ca` | Uunissa paistettu mustikka; **1,909125** | [PMID 33922965](https://pubmed.ncbi.nlm.nih.gov/33922965/) tutki tuoreen mustikan vaikutusta **valkoisen leivän yhteydessä** verensokerivasteeseen; se ei mittaa paistetun metsämustikan GI:tä. | **HOLD / NOT_A_GI_MEASUREMENT_FOR_FOOD**. Tuore mustikka+leipä -AUC ei ole uunimustikan GI. |
| 7 | `vhh-runebergintortut` `a53cbab8` | Mantelijauho uunileivonnassa; **1,08** | Ei löytynyt valmistusvastaavaa ihmisillä mitattua mantelijauhon GI:tä; yleinen leivonnaisten GI-keskiarvo ei mittaa täysrasvaista mantelijauhoa. | **HOLD / MISSING_PRIMARY_MATCH**. Älä korvaa paistettua torttua leivonnaiskeskiarvolla. |
| 8 | `pad-kee-mao-vhh-konjac` `d310adcd` | Punainen paprika paistettuna; **1,35** | Geneerinen `pepper GI 40` on vanhassa estearviossa jo hylätty, koska kasvilaji, väri ja mittauksen alkuperä eivät täsmää. Täsmällistä ihmisillä mitattua punaisen paprikan GI:tä ei näissä hauissa varmennettu. | **HOLD / UNSOURCED_GENERIC_VALUE**. Ei vihreän/muun paprikan tai in vitro -arvon siirtoa. |
| 9 | `char-siu` `0b99e269` | Hoisinkastike grillimarinaadissa; **4,185** | Tuotemerkki ja sokerikoostumus puuttuvat. [PMID 6833686](https://pubmed.ncbi.nlm.nih.gov/6833686/) mittaa kiinalaisten kastikkeiden **natriumia**, ei GI:tä; lähellä kuulostava tutkimus ei kelpaa. Marinadin imeytymis-/valutusosuus on erikseen tarkistettava. | **IDENTITY_FIRST / GI_UNRESOLVED**. Valitse tarkka hoisintuote ja tuotekohtainen CHO ensin. |
| 10 | `uunimakkara-sipulipedilla` `7fb851ec` | Geneerinen lenkkimakkara, huomattava tuotteesta riippuva CHO; **9,4975** | Ei vahvistettua tämän makkaran ihmis-GI-arvoa; `500 g lenkkimakkaraa` ei määritä tuotetta eikä tärkkelysmäärää. Tuotesidoksen puute on tässä GI-hakua perustavampi ongelma. | **IDENTITY_FIRST / PRODUCT_SPEC_NEEDED**. Merkkituote + koostumus/hiilihydraatit ja vasta sitten GI:n tarpeen arvio. |

### Pilotin mitattu tulos

- **10/10** reseptin nykyisen `main`-haaran tekstisisältö tarkistettu ja sidottu recipe-blob SHA:han. **10/10** historiallisen GK-estesnapshotin relevanssi tarkistettu; ei väitetä nykyisen GK-auditin reaaliaikaista ajamista.
- **2/10 P1** tutkimuspolkua: makaroni ja mannasuurimo. **1/10 P2**: kikhernejauhon valmistusmuodot. **4/10 HOLD**: kookosmaito, uunimustikka, mantelijauho ja punainen paprika. **1/10 EDITORIAL_FIX_IN_DRAFT**: farinatan kahteen valmistustapaan jakautuva ohje korjattu yhdenmukaiseksi uuniohjeeksi PR #323:ssa; GI jää HOLDiin. **2/10 IDENTITY_FIRST**: hoisin ja lenkkimakkara.
- **Uusia relevantteja alkuperäisiä tutkimusjohtolankoja:** mm. PMID **28771262** (macaroni and cheese -ateria) ja PMID **15483639** (kikhernejauholeipä). Ne eivät ole valmiita, uusia GI-reseptisidoksia.
- **0/10** lähdettä hyväksytty reseptin täsmälliseksi GI:ksi; **0** uutta GK-arvoa, hyväksyntää, muuttunutta tuotantitiedostoa tai kattavuuslisäystä. Tämä on **tutkimus- ja soveltuvuuspilotti**, ei kliininen mittaus.
- P1/P2-merkintä ei tarkoita, että hyväksynnän todennäköisyys olisi määrällisesti osoitettu.

### Tutkimuksen lisenssi-/laatu-/julkaisusuoja

1. PMID/DOI ja julkaistu ihmis-GI-fakta ovat tutkimusviitteitä. Artikkelien, taulukoiden tai kaupallisten hakemistojen laajaa kopiointioikeutta **ei ole tämän pilotin perusteella todennettu**. Ei tietokantojen massasiirtoa.
2. Erota *GI* (vertailutestattu, viiteasteikko ilmoitettu) ja *postprandial AUC* (ei yksin GI). Vaikka ryhmässä mitataan verensokeri, tutkimus ei automaattisesti mittaa GI:tä. Erota lisäksi in vitro ja ihmisvastetta mittaava tutkimus.
3. Nykyiset laskentasäännöt, 1 g toleranssi, syötemäärät, hyväksyntäportit ja julkaistu 156/326 historiallinen alkuperäiskattavuus pidetään ennallaan. Nykyinen luku tarkistettava auditista ennen seuraavaa julkaisuerää.
4. Mallinnettua GK:ta voidaan harkita **erillisessä selvästi mallinnetussa julkaisulinjassa** vasta [PR #297](https://github.com/ozirix-dev/Reseptit/pull/297):n hyväksytyn sopimuksen mukaan. Älä esitä sitä mitattuun GI:hin perustuvana hyväksyttynä GK:na.

### Jatkojono (järjestyksessä)

1. **Farinata:** reseptin ristiriitaiset valmistustavat yhdistetty uunivalmistukseksi tämän PR:n Draftissa. Tarkista CI/koepaisto ja 55 minuutin kesto ennen mergeä. GK-estetiedon 220 °C:n uunivalmistus säilyy; tomaatin GI jää HOLDiksi.
2. **Makaronilaatikko:** avaa PMID 28771262:n täysi menetelmä ja annoksen koostumus, PMID 3743316:n makaronityyppi; tarkista mahdollinen paistetun muna-maito-pastavuoan erillinen primaaritutkimus. Jos ei täsmää, pysyy HOLDissa.
3. **Mannapuuro:** vertaa raaka-aineen hiukkaskokoa, vedessä kypsentämistä ja taatelia sisältävää annosta Mani 1992:n testiruokaan; erottele GI 55 tutkimuksen valmistusmuodosta.
4. **Hoisin ja makkara:** yksi täsmätuote kumpaankin, dokumentoitu koostumus ja annos; vasta sitten GI-tutkimus. Ei keksittyä tuotemerkkiä.
5. **Vada pav:** etsi besan-friteerauksen tai vada-komponentin ihmis-GI, älä vaihda palotun kikherneen GI:hin.
6. Pysäytä muut viisi ilman uutta vertailukelpoista primaarimittausta; kymmenien laskurilinkkien läpikäynti ei tuota erillisiä mittauksia.

**Toteutusraja 6.11. jatkopäivityksen jälkeen:** tutkimusdokumentti **ja vain farinatan reseptin valmistusohjeen/ajan korjaus** samassa Draft-PR:ssä. Muut kymmenen reseptiä pysyvät koskemattomina. Ei muutoksia ainesosiin, annoksiin, makroihin, `glycemic-index-records.json`, laskennan syötteisiin, GK-arvoihin, hyväksyntäkuitteihin tai deployhin. CI ja koepaiston plausibiliteetti vielä tarkistettava ennen mahdollista mergeä.

## Täsmätutkimuksen loppukatselmointi — 6.11.2026 (jälkikäteen täydennetty)

**Lähderajaus:** julkisesti luettavissa olevat tutkimusten abstraktit, alkuperäisjulkaisijoiden kuvaukset ja vuoden 2002 kansainvälisen taulukon yksittäiset tietuerivit. Kokonaisten maksumuurin takana olevien tutkimusten yksityiskohtaisia menetelmiä **ei väitetä luetuiksi**. `SOURCE_FOUND` ei ole `MATCH_APPROVED`.

### 1. Runsasproteiininen jauheliha-makaronilaatikko — CLOSED AS GI_HOLD

- Nykyresepti: 400 g kuivattua makaronia, 600 g jauhelihaa, 500 g raejuustoa, 6 kananmunaa, 200 g maitoa, 200 g ruokakermaa ja 300 g emmentalraastetta; 8 annosta. #292 historiallinen makaroniin kohdistuva 33,2 g saatavaa CHO:ta/annos (ei koko reseptin CHO-määrä).
- [Wolever ym. 1986, doi:10.2337/diacare.9.4.401](https://pubmed.ncbi.nlm.nih.gov/3743316/) raportoi makaroniin kohdistuvan GI:n 68 ± 8 ja spagettiin 45 ± 6 **kyseisen tutkimuksen ilmoittamalla asteikolla**; tutkittavat olivat 13 diabetesta sairastavaa, eikä tämä raportti vielä varmista viiteasteikon yksiselitteistä yhtenevyyttä julkaistuun glukoosi=100 tietueeseen. [Foster-Powell ym. 2002 GI-taulukko](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext) sisältää erikseen keitettyä makaronia (glukoosiasteikolla noin 45–48), joten yksittäisiä lukuja tai referenssiskaaloja **ei saa sekoittaa**.
- [2002 International Tables, item 527](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext): **Kraft Macaroni and Cheese (boxed)** GI 64 glukoosiasteikolla, **n=9** sekadiabetesryhmä ja leipävertailusta muunnettu lukema. Kyseessä valmistajakohtainen pakettituote, ei jauheliha- ja kananmunamaitopohjainen paistettu suomalainen makaroni-laatikko. **Ei täsmä-GI eikä validoitu analogia**.
- [Johnston ym. 2017, doi:10.1039/C7FO00099E](https://pubmed.ncbi.nlm.nih.gov/28771262/) käytti 13 terveellä ihmisellä makaroni-juustoateriaa arvioiden gluteenittoman ja vehnäpohjaisen pastan verensokerikäyriä, mutta ei anna tähän reseptiin sovellettavaa standardoitua julkaistua GI:tä; annos, vilja, kuumennus, muna ja rasvakoostumus eivät täsmää.
- [Pasta GI -katsaus, doi:10.3390/foods10112541](https://pmc.ncbi.nlm.nih.gov/articles/PMC8623826/) kattaa 95 pastaformulointia; keskiarvo ei ole uunivuoan mittaus.
- **Päätös:** `SOURCE_FOUND / PRODUCT_PREPARATION_MISMATCH / GI_HOLD`. Historiallinen 33,2 g CHO/annos pysyy tiedossa mutta sille ei pakoteta GI 45/48/64/68 eikä lasketa julkista GK:ta. Jatkokriteeri: tarkka validoitu pasta-ainesosa ja uunivalmistuksen vastaavuus tai hyväksytty erillinen mallinnettu julkaisulinja PR #297:n jälkeen.

### 2. Pohjoisafrikkalainen taatelipuuro appelsiinilla — CLOSED AS GI_HOLD

- Nykyresepti: 100 g mannasuurimoa vedessä (300 ml) keitettynä, 10 g kuivattuja taateleita, 130 g appelsiinia; 2 annosta. #292 historiassa 31,8 g CHO/annos estetyltä semolinariviltä.
- [Mani ym. 1992, doi:10.1079/bjn19920102](https://pubmed.ncbi.nlm.nih.gov/1445824/): 30 tyypin 2 diabetesta sairastavaa henkilöä, viisi semolina- tai semolina+palkokasviruokaa, eri kuumennusmenetelmiä. [2002 GI-taulukon semolinarivit](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext) erottelevat **paahdetun ja vedellä gelatinoidun semolinan GI 55 ± 9** sekä **höyrytetyn ja gelatinoidun semolinan GI 54 ± 13** (glukoosiasteikko). Näiden keskiarvoa ei voi esittää mittauksena meidän vedessä keitetylle, paahtamattomalle puurolle.
- **Uusi valmistukseltaan läheisempi mutta ei täsmä:** [2002 International Tables, upittu / item 712](https://ajcn.nutrition.org/article/S0002-9165%2823%2905840-9/fulltext) kuvaa *paahdettua mannasuurimoa ja sipulia vedessä keitettynä*, GI 67 ± 3 ja 69 ± 4 eri ryhmissä (keskiarvo noin 68). Tämäkin on paahto- ja sipulivalmiste, ei nykyinen makea, paahtamaton taatelipuuro.
- Vanhan #292-estesnapshotin kuvauksessa on 5 g maapähkinäöljyä koskeva huomautus, jonka tarkan kohdistumisen alkuperäiseen mittausriviin vaaditaan **full-text/taulukkovarmennus** ennen kuin sitä käytetään määräävänä erona. Jo varmennettu valmistusero on **paahtaminen/höyrytys vs. meidän keittäminen**.
- **Päätös:** `SOURCE_FOUND / PREPARATION_MISMATCH / GI_HOLD`. Ei GI 54/55/68 siirtoa, ei tuoretta GK-lukua. Tätä ei jatketa samoihin lähteisiin uudelleen ilman aidosti uutta keitetyn mannasuurimopuuron ihmis-GI-mittausta.

### 3. Kikhernepannukakku tomaattioliiveilla — EDITORIAL_CONFLICT RESOLVED IN DRAFT, GI_HOLD

- **Täsmällinen juurisyy:** 6.11. `main`-version reseptin valmistusohjeen **vaiheet 1–3** käskevät tehdä pannuletun; **vaihe 4** käskee valmistaa seoksesta 220 °C:ssa uunissa paistettavan farinatan. Tämä on **saman reseptin sisäinen sekava kaksoisohje**, ei #292-estetiedon virhe. Aiemmassa tämän raportin versiossa esitetty tulkinta, että resepti olisi vain pannulla paistettava, **korjataan tällä kirjauksella**.
- PR #323:n saman haaran muutoksessa säilytetään reseptin alkuperäisen loppuvaiheen **220 °C uunivalmistus**, poistetaan päällekkäiset pannuohjeet, annetaan selkeät 5 vaihetta, pidetään **100 g kikhernejauhoa, 150 ml vettä, 100 g tomaattia, 25 g oliiveja, 1 g rosmariinia, 1 rkl öljyä ja valinnainen suola** sekä 2 annosta muuttumattomina. `cooking_method` `paistaminen` säilyy ennallaan, `time_total_min` **25 → 55**, koska 20 min turvotus ja 20–25 min paisto plus valmistelu/levähdys.
- Ulkoinen referenssi [Tescon farinata](https://www.tesco.com/recipes/en-GB/recipe/farinata) vahvistaa, että 220 °C:n uunissa valmistettu kikhernejauhotaikina on vakiintunut farinatan toteutustapa. Tesco käyttää eri suhteita, joten tämä on **kulinaarisen menetelmän tarkistus, ei reseptin tai GK:n lähdetodiste**.
- Vanha #292 GI-este **100 g tuoretta tomaattia / 2 annosta ≈ 1,725 g saatavaa CHO:ta/annos** ylittää nykyisen alle 1 g yksittäisen GI-puutteen toleranssin. Tuoreen kokonaisen tomaatin GI 22 -lähde ei todista uunissa paistetun tomaatin GI:tä. **Kokonais-GK pysyy HOLDissa**.
- **Päätös:** `RECIPE_EDIT_IN_DRAFT / GI_HOLD`. Ohjeen sekaannus on korjattu PR-haarassa. **Testit/koepaisto, CI ja merge vielä avoimia.** Ei tuotantojulkaisua eikä automaattista uutta GI/GK-numeroa.

### Päätöstaulukko — jälkikatselmoinnin valmistuminen

| Tapaus | Lähdepolun tutkimus | Reseptin korjaus | Julkaistu uusi GK |
|---|---|---|---|
| Makaronilaatikko | CLOSED / PRIMARY & COMPOSITE FOUND / NO MATCH | Ei reseptimuutosta | **Ei** |
| Mannapuuro | CLOSED / 2–3 RELATED METHODS / NO MATCH | Ei reseptimuutosta | **Ei** |
| Farinata | CLOSED / INTERNAL COOKING CONFLICT IDENTIFIED | **Kyllä, vain Draft PR #323** | **Ei** |

**Dokumentoitujen näyttöjen lisäys:** selvästi entistä läheisempi makaronijuuston mittaus (boxed Kraft GI 64) ja upittun mittaus (paahdettu semolina+sipuli vedessä) auttavat estämään virheellistä oletusta, että kaikkien ruoka-aineryhmien yleiset GI-luvut olisivat täsmävalmisteen lukuja. **3/3 tapausta katselmoitu loppuun tämän aineiston osalta; 0/3 täsmä-GI-hyväksyntää.**

### CI:n valmistus-/reseptisidonnan tarkennus

Alustava PR #323 -versio yritti vaihtaa `cooking_method`-tunnisteen `paistaminen` → `uuni`. [GI/GK recipe binding](../../site/scripts/glycemic-load-recipe-binding.ts) sisällyttää `cooking_method`-listan laskentasisällön tarkisteeseen; CI pysäytti muuttuneen sidoshashin. Koska alkuperäisessä lähdereseptissä oli jo 220 °C:n uunipaisto, turvallinen ja vähäisimmän muutoksen korjaus on **pitää alkuperäinen yleisluokka `paistaminen`**, selkeyttää vain ohjetta ja oikaista kokonaiskesto. Ainesosia, annoksia, valmistusluokan rakenteellista GK-hashia tai hyväksyttyjä numeroita **ei muuteta**. `time_total_min` ei kuulu nykyiseen GK-sidoksen hash-funktioon. Vanha CI-pysäytys oli tarkoituksenmukainen, ei ohitettavaksi tarkoitettu virhe. Uuden HEADin CI:llä on varmistettava myös käännösten merkitysvastaavuus ja muut validointisäännöt.
