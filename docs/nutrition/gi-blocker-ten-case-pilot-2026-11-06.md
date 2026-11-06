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
| 5 | `valimerellinen-farinata-aamupalaksi` `a80d7bb2` | Tomaatti; **1,725** | Vanha #292 arvio puhui 220 °C:ssa paistetusta tomaatista. **Nykyisen main-reseptin teksti kuitenkin paistaa pannulla** ja metadatassa lukee vain `paistaminen`; tämä on valmistustavan/estearvion lähdesynkronoinnin ristiriita. Raakatomaatin GI ei ole automaattisesti pannulla paistetun GI. | **DATA_CONFLICT / REBASE_METHOD**. Ensiksi korjataan reseptin ja blocker-inputin valmistustapakonteksti; ei GI-lukua. |
| 6 | `vhh-mustikkapiirakka` `1cf8d8ca` | Uunissa paistettu mustikka; **1,909125** | [PMID 33922965](https://pubmed.ncbi.nlm.nih.gov/33922965/) tutki tuoreen mustikan vaikutusta **valkoisen leivän yhteydessä** verensokerivasteeseen; se ei mittaa paistetun metsämustikan GI:tä. | **HOLD / NOT_A_GI_MEASUREMENT_FOR_FOOD**. Tuore mustikka+leipä -AUC ei ole uunimustikan GI. |
| 7 | `vhh-runebergintortut` `a53cbab8` | Mantelijauho uunileivonnassa; **1,08** | Ei löytynyt valmistusvastaavaa ihmisillä mitattua mantelijauhon GI:tä; yleinen leivonnaisten GI-keskiarvo ei mittaa täysrasvaista mantelijauhoa. | **HOLD / MISSING_PRIMARY_MATCH**. Älä korvaa paistettua torttua leivonnaiskeskiarvolla. |
| 8 | `pad-kee-mao-vhh-konjac` `d310adcd` | Punainen paprika paistettuna; **1,35** | Geneerinen `pepper GI 40` on vanhassa estearviossa jo hylätty, koska kasvilaji, väri ja mittauksen alkuperä eivät täsmää. Täsmällistä ihmisillä mitattua punaisen paprikan GI:tä ei näissä hauissa varmennettu. | **HOLD / UNSOURCED_GENERIC_VALUE**. Ei vihreän/muun paprikan tai in vitro -arvon siirtoa. |
| 9 | `char-siu` `0b99e269` | Hoisinkastike grillimarinaadissa; **4,185** | Tuotemerkki ja sokerikoostumus puuttuvat. [PMID 6833686](https://pubmed.ncbi.nlm.nih.gov/6833686/) mittaa kiinalaisten kastikkeiden **natriumia**, ei GI:tä; lähellä kuulostava tutkimus ei kelpaa. Marinadin imeytymis-/valutusosuus on erikseen tarkistettava. | **IDENTITY_FIRST / GI_UNRESOLVED**. Valitse tarkka hoisintuote ja tuotekohtainen CHO ensin. |
| 10 | `uunimakkara-sipulipedilla` `7fb851ec` | Geneerinen lenkkimakkara, huomattava tuotteesta riippuva CHO; **9,4975** | Ei vahvistettua tämän makkaran ihmis-GI-arvoa; `500 g lenkkimakkaraa` ei määritä tuotetta eikä tärkkelysmäärää. Tuotesidoksen puute on tässä GI-hakua perustavampi ongelma. | **IDENTITY_FIRST / PRODUCT_SPEC_NEEDED**. Merkkituote + koostumus/hiilihydraatit ja vasta sitten GI:n tarpeen arvio. |

### Pilotin mitattu tulos

- **10/10** reseptin nykyisen `main`-haaran tekstisisältö tarkistettu ja sidottu recipe-blob SHA:han. **10/10** historiallisen GK-estesnapshotin relevanssi tarkistettu; ei väitetä nykyisen GK-auditin reaaliaikaista ajamista.
- **2/10 P1** tutkimuspolkua: makaroni ja mannasuurimo. **1/10 P2**: kikhernejauhon valmistusmuodot. **4/10 HOLD**: kookosmaito, uunimustikka, mantelijauho ja punainen paprika. **1/10 DATA_CONFLICT**: farinatan pannupaisto vs. vanha 220 °C:n tulkinta. **2/10 IDENTITY_FIRST**: hoisin ja lenkkimakkara.
- **Uusia relevantteja alkuperäisiä tutkimusjohtolankoja:** mm. PMID **28771262** (macaroni and cheese -ateria) ja PMID **15483639** (kikhernejauholeipä). Ne eivät ole valmiita, uusia GI-reseptisidoksia.
- **0/10** lähdettä hyväksytty reseptin täsmälliseksi GI:ksi; **0** uutta GK-arvoa, hyväksyntää, muuttunutta tuotantitiedostoa tai kattavuuslisäystä. Tämä on **tutkimus- ja soveltuvuuspilotti**, ei kliininen mittaus.
- P1/P2-merkintä ei tarkoita, että hyväksynnän todennäköisyys olisi määrällisesti osoitettu.

### Tutkimuksen lisenssi-/laatu-/julkaisusuoja

1. PMID/DOI ja julkaistu ihmis-GI-fakta ovat tutkimusviitteitä. Artikkelien, taulukoiden tai kaupallisten hakemistojen laajaa kopiointioikeutta **ei ole tämän pilotin perusteella todennettu**. Ei tietokantojen massasiirtoa.
2. Erota *GI* (vertailutestattu, viiteasteikko ilmoitettu) ja *postprandial AUC* (ei yksin GI). Vaikka ryhmässä mitataan verensokeri, tutkimus ei automaattisesti mittaa GI:tä. Erota lisäksi in vitro ja ihmisvastetta mittaava tutkimus.
3. Nykyiset laskentasäännöt, 1 g toleranssi, syötemäärät, hyväksyntäportit ja julkaistu 156/326 historiallinen alkuperäiskattavuus pidetään ennallaan. Nykyinen luku tarkistettava auditista ennen seuraavaa julkaisuerää.
4. Mallinnettua GK:ta voidaan harkita **erillisessä selvästi mallinnetussa julkaisulinjassa** vasta [PR #297](https://github.com/ozirix-dev/Reseptit/pull/297):n hyväksytyn sopimuksen mukaan. Älä esitä sitä mitattuun GI:hin perustuvana hyväksyttynä GK:na.

### Jatkojono (järjestyksessä)

1. **Farinata:** synkronoi nykyinen pannupaisto ja GK-estelistan 220 °C -teksti, varmista ettei kyse ole eri reseptiversiosta. Dokumentoi oikea tomaattikäsittely ennen hakua.
2. **Makaronilaatikko:** avaa PMID 28771262:n täysi menetelmä ja annoksen koostumus, PMID 3743316:n makaronityyppi; tarkista mahdollinen paistetun muna-maito-pastavuoan erillinen primaaritutkimus. Jos ei täsmää, pysyy HOLDissa.
3. **Mannapuuro:** vertaa raaka-aineen hiukkaskokoa, vedessä kypsentämistä ja taatelia sisältävää annosta Mani 1992:n testiruokaan; erottele GI 55 tutkimuksen valmistusmuodosta.
4. **Hoisin ja makkara:** yksi täsmätuote kumpaankin, dokumentoitu koostumus ja annos; vasta sitten GI-tutkimus. Ei keksittyä tuotemerkkiä.
5. **Vada pav:** etsi besan-friteerauksen tai vada-komponentin ihmis-GI, älä vaihda palotun kikherneen GI:hin.
6. Pysäytä muut viisi ilman uutta vertailukelpoista primaarimittausta; kymmenien laskurilinkkien läpikäynti ei tuota erillisiä mittauksia.

**Toteutusraja:** vain tämä tutkimusdokumentti omassa haarassa. Ei muutoksia `glycemic-index-records.json`, `site/`, reseptiteksteihin, GK/CHO-dataan, hyväksyntäkuitteihin tai deployhin. Dokumentin katselmointi ennen mahdollista mergeä.
