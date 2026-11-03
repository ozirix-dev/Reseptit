# Reseptit — nelikielisyyden kattavuus- ja laatutyön masterplan

**Tila:** SUUNNITELMA / DRAFT / ei julkaisuvaltuutusta  
**Päivä:** 2026-11-03  
**Kohde:** `ozirix-dev/Reseptit` / `main`; FI-lähde ja EN/SV/TH-käännökset  
**Vastuu:** käyttäjä hyväksyy julkaisut, Codex toteuttaa erät, katselmoija auditoi tulokset.  
**Rajaus:** tämä PR sisältää vain työohjeen. Ei uusia käännöksiä, muutoksia reseptien ravintoarvoihin, GK/GI-laskentaan, luokituksiin, reitteihin tai deployhin.

## 1. Tavoite ja menestyksen mittaus

Tavoite on saada **jokaiselle julkaistulle suomenkieliselle reseptille toimivat EN-, SV- ja TH-kieliversiot**, ilman että olemassa olevien käännösten laatu, annokset, ravintoarvot, turvallisuus tai julkaistut URL:t heikkenevät. Kattavuus ja kielellinen oikeellisuus ovat **kaksi eri mittaria**. Älä raportoi rakennetestin läpäisyä ihmisen kielihyväksynnäksi.

Mittaa joka erässä:

1. Julkaistut FI-lähteet (lukumäärä ja commit SHA).
2. Julkaistut käännösparit erikseen EN, SV ja TH sekä puuttuvat **FI × 3** -parit.
3. Reseptit, joilla on kaikki neljä julkaistua kieliversiota.
4. Luonnoksina olevat käännökset ja luonnoksina olevat FI-lähteet — **erillään julkaistuista**.
5. Rakenteelliset virheet, semanttiset epäilyt, vahvistetut merkitysvirheet ja ihmistarkistusten tila **eri sarakkeisiin**.
6. Per kieli P0/P1/P2/P3-löydösten määrä ja korjattujen löytöjen määrä.
7. Muuttuneiden tiedostojen sekä julkaistujen sivujen/reittien luettelo.

Älä ilmoita valmistuneeksi reseptiä, jolta puuttuu yksikin julkaistu kieliversio. Julkaisematon käännösluonnos ei lisää julkaistua kattavuutta.

## 2. Lähtötaso — snapshot, ei kovakoodattu tavoitetila

3.11.2026 tarkastelussa julkaistuja FI-reseptejä oli **326**, julkaistuja käännöksiä **390**: EN 132, SV 129, TH 129. Täysi nelikielisyys **129/326** reseptiä. Puuttuvia julkaistuja kielipareja **588** (= EN 194 + SV 197 + TH 197). Ilman kaikkia kolmea käännöstä **194** julkaistua reseptiä; kolmelta reseptiltä puuttuvat SV ja TH, yhteensä **197** julkaistua reseptiä on vähintään osittain puutteellisia. Tämä on vain tämän PR:n suunnittelulähtökohta.

Kolme 3.11.2026 englanniksi julkaistua suklaareseptiä:
- `keto-mutakakku`
- `keto-suklaakeksit`
- `meheva-suklaakakku`

Niiden SV/TH-versioita ei saa olettaa olemassa oleviksi. Repossa on myös FI-luonnoksia (esimerkiksi `kaurakeksit`, `sienikakkupohja`) ja niiden EN/TH-luonnoksia; näitä **ei** lasketa julkaistujen reseptien kattavuuteen.

**Varmennuksen lähteet:** varsinaiset `reseptit/**`- ja `kaannokset/{en,sv,th}/**`-tiedostot, `site/scripts/translation-audit.ts`, `site/scripts/inventory.ts`, `docs/translation-review-policy.md`, `docs/translation-human-review.md`; vain senhetkisen `main`-SHA:n mukainen tilanne. Päivätty `docs/reports/translation-review-registry.json` (357 paria) on historiallinen snapshot eikä enää yksin ajantasainen. `docs/reports/translation-audit-current.csv` voi myös olla vanhentunut suhteessa uusimpiin mergeihin. 3.11. suklaareseptien dokumentoitu auditointi: 387 paria ennen kolmen EN-version aktivointia, 390 aktivoinnin jälkeen, 0 rakennepoikkeamaa. Nolla rakennepoikkeamaa **ei** tarkoita nollaa sisältövirhettä.

**Samanaikaisuuden suoja:** avoin Draft-PR [#222](https://github.com/ozirix-dev/Reseptit/pull/222) tekee EN/SV/TH-versioita poha- ja hunaja-sinappikana-resepteille. Tutki PR:n tila ja head ennen uutta erää; älä tee samoja käännöksiä rinnakkain. Yhdistymättömiä PR:iä ei lasketa tuotantoon.

## 3. Yksi kanoninen inventaario

AJO 0:n ensimmäinen tehtävä on tuottaa **koneellisesti lähteistä** ajantasainen inventaario. Älä käytä tiedostonimimäärää yksin julkaistun sisällön mittarina: lue `status`, `recipe_id`, `language`, `translation_languages` ja `translation_status`, ja varmista, että julkaistut kieliversiot todella vastaavat samaa FI-lähdettä.

Pakolliset kentät per `recipe_id` ja locale:

`source_path | source_status | locale | expected_translation_path | translation_path | translation_status | exists | published | structural_status | semantic_findings | human_review_status | source_sha256 | translation_sha256 | risk | last_review_evidence | batch_id`.

Jos samasta `recipe_id`- ja kieliparista löytyy tupla, poikkeava `translation_of`/`source_recipe`, väärä status, törmäävä `url_slug` tai suomenkielisen lähteen kieli on väärä, kirjaa virhe ja pidä kyseinen pari pois hyväksytystä kattavuudesta. Älä korjaa vaivihkaa laskennan yhteydessä.

Peruskomennot `site/`-hakemistossa:

```powershell
npm run report:inventory
npx tsx scripts/translation-audit.ts --strict --write-reports
npm run test:translations
```

Inventaariovertailussa näytetään **lähtö-SHA, HEAD-SHA, uudet, muuttuneet, julkaistut, edelleen puuttuvat ja virheelliset**. Pidä raportoinnissa vain yksi ensisijainen mittari: julkaistut FI-reseptit, joiden kaikki EN/SV/TH-versiot ovat julkaistuja.

Erota tilat `MISSING`, `DRAFT`, `PUBLISHED`, `OUTDATED`, `STRUCTURAL_ERROR`, `SEMANTIC_SUSPECT`, `HUMAN_REVIEW_PENDING`, `HUMAN_REVIEW_COMPLETE`. `OUTDATED` vaatii sisällöllisen muutoksen toteamisen, ei vain metatiedon tai muotoilun eroa.

## 4. Riskiluokitus ja päätöspolku

**P0 — vaarallinen tai olennaisesti harhaanjohtava:** väärä allergeeni/raaka-aine (esim. kala vs. äyriäiset), raaka–kypsä-vaihdos, vaarallinen lämpötila/säilytysohje tai kieltomuodon katoaminen. Ei julkaisuun. Jo julkaistun P0:n korjaus omana pienenä kiireellisenä PR:nä.

**P1 — reseptin toteutus tai ravintolukema vääristyy:** väärät määrät/yksiköt/annokset, eri valmistustapa, väärät makrot/GK, täyte tai kastike jää pois, sokeriton ↔ makeuttamaton sekoittuu merkityksellisesti. Ei julkaisuun ennen korjausta.

**P2 — merkitykseltään epätarkka tai epäluonteva:** harhaanjohtava ruokatermi, vaikeaselkoinen ohje, alt-tekstin sisältövirhe, esityksen johdonmukaisuus. Korjaa erän yhteydessä; epävarmuus dokumentoidaan.

**P3 — toimituksellinen hiominen:** tyyli, välimerkit, pienet sanavalinnat. Ei saa pysäyttää kaikkia muita reseptejä eikä aiheuttaa massamuutosta.

Tunnista aiemmat regressiot: `fish fondue`/`fiskfondue` (fondi), `cognac noodles`/`brandy noodles` (konjaknuudeli), rahka/raejuusto, liquid cream/whipped cream, jauhelihalaji, curry- ja maustesekoitukset, gluteenittomuus/keto/vhh, tomaattimurska/tomaattipyree, maustamaton jogurtti, bulgur, kieltomuodot sekä `sugar-free` vs. `unsweetened`. Semanttinen tarkistus käy **ainesosat, määrät, vaiheiden merkityksen, otsikon, kuvauksen, muistiinpanot, altin ja tagit** läpi; ei pelkkiä yksikkötestien kenttiä.

Epäselvä lähderesepti → `SOURCE_BLOCKED`: korjaa FI lähde omassa päätöksessä ensin, eikä käännä arvailtua tarkennusta kolmelle kielelle. Ei täytetä puuttuvia gramma-, aika- tai lämpötilatietoja arvauksilla.

## 5. Toteutuserät: pienet, itsenäiset, loppuun asti vietävät

**AJO 0 — inventaario ja työjonon lukitus**  
Tavoite: yksi ajantasainen, yksilöity FI × EN/SV/TH -matriisi, virhekooste, yhteys avoimiin PR:iin, baseline/main-SHA, erälista, mahdollisten riippuvuuksien ja estojen lista. Ei sisältömuutoksia eikä julkaisua. PASS = kaikki julkaistut FI-lähteet tilitetty, puuttuvien parien summa täsmää, luonnokset erotettu, data uusinnettavissa.

**AJO 1 — julkaistujen käännösten riskiauditointi**  
Tavoite: priorisoi Thai ja korkean riskin turvallisuus- ja ravintomerkkitykset, sen jälkeen EN ja SV. Tee käytännössä 10–20 reseptin vertailueriä: koko kolme kieltä / resepti, jos olemassa. Raportoi riskilöydökset konkreettisilla lähde- ja käännöskatkelmilla, vakavuus ja korjausehdotus. Vain todetut P0/P1-korjaukset erillisiin, rajattuihin PR:iin; yhtään pelkkään heuristiikkaan perustuvaa virhettä ei merkitä vahvistetuksi. Ihmisen tekemää hyväksyntää ei saa sepittää.

**AJO 2 — lyhyt täydentävä kielierä**  
Tavoite: viimeistele jo osittain käännetyt julkaistut reseptit (3 suklaareseptiä × SV/TH = 6 ehdokasta, jos tilanne on edelleen sama), ehdollisesti myös jo avatun PR #222:n tarkistaminen; älä kopioi keskeneräisiä luonnoksia julkaistuiksi. Omistajan hyväksyntä vaaditaan ennen mergeä.

**AJO 3 — pilottierä, 10 FI-reseptiä × 3 kieltä**  
Tavoite: 30 uutta käännösparia yhdessä rajatussa PR:ssä. Valitse kanonisesta työjonosta reseptejä, joissa FI-ohje on yksiselitteinen ja reseptillä on riittävät määrät. Sisällytä erilaisia keittiöitä ja vaikeusasteita. Muista erottaa annoksia ja GK-tietoja koskeva sisältö FI:n laskennasta. Jos lähde epäselvä, korvaa se toisella jonosta ja kirjaa esto.

**AJO 4...N — toistettava tuotanto, yleensä 10–20 FI-reseptiä per PR**  
Tavoite: 30–60 käännösparia/erä. Yhden Codex-ajon sisäinen välitavoite korkeintaan 5 reseptiä; tilanne ja SHA tallennetaan kunkin osan jälkeen. Jos ajo keskeytyy, jatka viimeisestä commitista ja jäljellä olevasta listasta, älä aloita samoja reseptejä uudelleen. Jos mallin konteksti tai aika loppuu, **pienennä erää 5 → 2 → 1** ennen mallinvaihtoa; älä kasvata tehtävää eikä anna osittaisen raportin muuttua saavutetuksi tulokseksi.

**AJO viimeinen — 100 % kattavuuden täsmäauditointi**  
Kun kaikki julkaistut reseptit ovat kolmella kohdekielellä: varmista jokaisen 4 locale -reitti, `hreflang`, tilat, linkit, sisältö ja että raporteissa `missing_published_pairs=0`. Kielilaadun auditointi ja ihmistarkistustiedot raportoidaan tästä erillisinä; 100 % kattavuus ei ole 100 % ihmistarkistus.

## 6. Järjestys ja priorisointi

Eräjärjestyksen kriteerit:
1. Korjaa P0/P1 jo julkaistuista teksteistä ennen uusien, riskialttiiden käännösten julkaisua.
2. Täydennä keskeneräiset 2/3-käännöksen julkaistut reseptit ennen kokonaan puuttuvia.
3. Poimi helpot, hyvin rakennetut, kysytyt ja vähän riippuvuuksia aiheuttavat FI-reseptit.
4. Käännä myös korkean GI/GK:n reseptit. GK:n puuttuminen tai suuri arvo **ei** ole käännöseste, mutta mitään arvoa ei keksitä eikä käännöksessä kaunistella.
5. Reseptin valinta ei saa riippua vain siitä, että se on helppo tai keto/VHH. Tavoite on koko maailman ruokakulttuurien reseptipankki.

Säilytä joka reseptille `recipe_id`; älä muuta vanhoja julkaistuja slugeja. Uuden kieliversion `url_slug` tehdään selkeäksi ja kielikohtaiseksi; välty törmäyksiltä. Kieliä ja kansioita ei saa vaihtaa keskenään.

## 7. Yhden reseptin hyväksymislista

- [ ] FI-lähde on `published`, yksiselitteinen ja tarkistettu nykyisestä `main`-SHA:sta.
- [ ] Kohdekielen `language`, `source_language`, `translation_of`, `source_recipe`, `recipe_id` ja `status` täsmäävät.
- [ ] Ainesosien nimet, eläinlajit, järjestys, määrät, yksiköt, tilavuudet, raaka/kypsä ja valinnaiset ainekset vastaavat FI:tä.
- [ ] Annokset, valmistusajat, lämpötilat ja työvaiheiden **merkitys** ovat samat. Vaiheiden järjestystä ei muuteta, ellei FI-lähdettä ensin hyväksytysti korjata.
- [ ] Kieltomuodot, allergiariskit, tarjoilu vs. valmistus sekä säilytys-/kypsennysohjeet säilyvät.
- [ ] Kuvaus, huomautukset, alt-teksti, tagit ja ruokakulttuurin termit on oikeasti käännetty; ei jää suomenkielisiä jäänteitä.
- [ ] Neljä makroa, ravintoväitteet, GI/GK-numerot, varmuusluokat, lähdeviitteet ja laskentamenetelmät säilyvät ilman uutta laskentaa.
- [ ] Käännöksen kuvapolku viittaa olemassa olevaan kuvaan; kuvaa ei käytetä sisällön oikomiseen.
- [ ] Suomi-reseptin `translation_languages` ja `translation_status` vastaavat julkaisuun meneviä tiedostoja.
- [ ] Rakennetarkistus PASS, semanttisen tarkistuksen löydökset päätetty; ihminen HYVÄKSYNYT vain jos todiste on todella olemassa.
- [ ] Uudet kielireitit löytyvät esikatselusta, eivätkä vanhat reitit katoa.
- [ ] Eräraportti ja PR:n aloitus-/lopputilojen erot on talletettu.

## 8. Kevyt mutta riittävä testipolitiikka

**Älä suorita koko projektin raskasta testi-, build- tai selaintestisarjaa jokaisesta pienestä dokumentti- tai reseptimuutoksesta.** Pyri yhteen paikalliseen käännösvalidointiin per erä ja anna CI:n suorittaa sen oma normaali portti. Käytä vain oikean muutoksen edellyttämiä tarkistuksia:

- Documentation-only: GitHubin diff ja linkit; ei tarpeettomia install/build/npm-audit/browser-ajokertoja.
- Translation-only: `npx tsx scripts/translation-audit.ts --strict` + `npm run test:translations` ja tarvittaessa juuri kyseisen reseptin/gk:n muutosten valitsintestit.
- Rakenteen tai reittien muuttuessa: yksi `npm run build` + rajattu reittiesikatselu (4 kieliversiota vähintään yhdelle uudelle reseptille), ei useita identtisiä uusintoja.
- FI-määrä/makro/valmistusmuutos: pysäytä translation-only-haara, käytä asianmukaisia ravinto/GK-tarkistuksia ja omaa hyväksyntää; älä piilota muutosta käännös-PR:ään.
- CI:n tai buildin epäonnistuessa: korjaa todettu syy ja uusintatesti vain vaikuttavaan osaan. Ei `rerun all` vain varmuuden vuoksi.

Varmista status käyttämällä GitHubin todellista commitia ja ajon loppuarvoa, älä kopsaa vanhaa PASS-raporttia. Älä tee manuaalisia Actions-käynnistyksiä ilman syytä. Käytä olemassa olevaa `validate:changed-content`-polkua silloin kun soveltuu.

## 9. GK80 / ravintotiedot / rinnakkaisajot

GK80-työ on aktiivinen. Uusi translation-PR saa normaalisti muuttaa vain `kaannokset/{en,sv,th}/**` sekä tarkkaan rajatut FI-lähteiden `translation_languages` / `translation_status` -kentät. Tarpeeton FI-tiedoston tekstimuutos on kielletty, koska se voi vanhentaa laskentaan sidottuja source hash -suojia.

Jos GK80 tai toinen PR on muokannut FI-lähdettä:
1. Tarkista `main` ja avoimet PR:t ennen uuden erän valintaa.
2. Valitse uusi, itsenäinen resepti tai synkronoi ensin hyväksytty sisältö. Ei kahden Codex-ajon kirjoituksia samaan tiedostoon.
3. Laske käännös hyväksytystä FI-muodosta; älä palauttele vanhoja massoja, ruoan valmistusta tai GK-luokkaa.
4. Älä muokkaa `meta/nutrition`, GK-evidenceä, painoja, GI-valintoja tai laskenta-skriptejä käännöserän "helpottamiseksi".
5. Jos lähteen muutos koskee vain metadataa, varmista olemassa olevien GK-sinettien ja testien odotettu tulkinta; älä kierrä suojia laajoilla sallintalistauksilla.

Samaan aikaan avoimet käännös-PR:t listataan työjonon `RESERVED_BY_PR`-tilaan. Vasta merge mainiin tekee niistä valmistuneita. Päivitä lista jokaisen erän alussa.

## 10. Laadun hyväksyntä vs. julkaisulupa

Projektin `docs/translation-review-policy.md` ja `docs/translation-human-review.md` ovat ensisijaisia. Julkaiseminen voi käyttäjän nimenomaisella päätöksellä tapahtua automaattisen tarkistuksen jälkeen, mutta silloin **HUMAN REVIEW PENDING** säilyy. Kone, Codex, LLM tai CI ei saa kirjoittaa `human_attestation: true` ilman todellista ihmisen hyväksyntätodistetta.

FI ja käännös vierekkäin näyttävä tarkistuspaketti on suositeltava etenkin thai-kielelle; riskilöydökset nousevat tarkistusjonoon. Näyttöä ei saa ilmaista "kieliasu on hyväksytty" vain siksi, että tekninen testi meni läpi.

**Kuka päättää:** Codex voi ehdottaa tekstin ja korjaukset, katselmointi antaa GO / CONDITIONAL GO / HOLD, käyttäjä päättää merge/julkaisu erikseen. Tämä masterplan ei ole yleisvaltuutus yhdistää tulevia PR:iä.

## 11. Eräraportti ja jatko ilman katkeamista

Tallennuspaikka: `docs/reports/YYYY-MM-DD-translation-batch-XX.md` tai jo käytössä oleva ReportHubiin linkittävä raporttikäytäntö. Jokainen ajon raportti sisältää:

```text
BATCH_ID:
MODE: AUDIT | TRANSLATE | FIX
BASE_MAIN_SHA:
HEAD_SHA:
RESERVED_BY_OTHER_PR:
RECIPE_IDS_TARGETED:
RECIPE_IDS_COMPLETED:
RECIPE_IDS_BLOCKED + reasons:
PUBLISHED_FI_BEFORE/AFTER:
PUBLISHED_EN/SV/TH_BEFORE/AFTER:
COMPLETE_4_LANG_BEFORE/AFTER:
MISSING_PUBLISHED_PAIRS_BEFORE/AFTER:
P0/P1/P2/P3 open/closed:
AUTOMATED_CHECKS (commands, counts, outcomes):
HUMAN_REVIEW_STATUS:
CHANGED_FILES:
OPEN_PR_URL:
NEXT_UNPROCESSED_RECIPE_ID:
NEXT_ACTION:
DECISION: GO | CONDITIONAL GO | HOLD | PARTIAL
```

Tosiasiallisesti päättyneen erän `COMPLETED` tarkoittaa, että kaikki sen suunnitellut reseptit on käsitelty, validointi kirjattu ja seuraavan erän alku tiedossa — **ei** sitä, että kokonaisurakka olisi valmis. `PARTIAL` on sallittu ja todenmukainen. Älä tee 30 reseptin "yöajoa", jossa tavoitteeksi merkitään 30 mutta vain kuusi ehditään tarkistaa ilman jatkopolkua.

## 12. Määrälliset välitavoitteet

Merkitse absoluuttiset numerot aina päivitetyn inventaarion perusteella. Näillä 3.11. lähtöluvuilla:

| Vaihe | Täysi FI+EN+SV+TH | Puuttuvat julkaistut parit | Tuloksen ehto |
| --- | ---: | ---: | --- |
| Lähtö | 129 / 326 | 588 | snapshot, ei tavoite |
| Osittaisten täydennys (3 suklaareseptiä) | 132 / 326 | 582 | 6 SV/TH-versiota julkaistu |
| Pilotti 10 FI-reseptiä | 142 / 326 | 552 | +30 uutta julkaistua paria |
| 50 % kattavuus | väh. 163 / 326 | korkeintaan 489 | kaikki 3 käännöstä per täysi resepti |
| 75 % kattavuus | väh. 245 / 326 | korkeintaan 243 | uudelleenlaskettu toteutuma |
| 90 % kattavuus | väh. 294 / 326 | korkeintaan 96 | uudelleenlaskettu toteutuma |
| 100 % kattavuus | 326 / 326 | 0 | neljä julkaistua kieliversiota/resepti |

Huomaa: väliportaiden "puuttuvat parit" -rajat edellyttävät, että täydellisiksi laskettavilla resepteillä on kaikki kolme käännöstä; muut osittaiset voivat tehdä todellisen puuttuvien parien määrän tätä pienemmäksi. Uudet FI-reseptit siirtävät nimittäjää ja tavoitetta. Ei lupausta kiinteästä suoritusajasta tai tokenkulusta.

## 13. Ensimmäisen Codex-ajon valmis toimeksianto

> AJA VAIN AJO 0 (INVENTAARIO), älä käännä tai julkaise. Tarkista aluksi `pwd`, `git remote -v` ja `git rev-parse HEAD`: oikea työrepo on `ozirix-dev/Reseptit`, ei Ravinto tai Ravintotuote. Lue tämä masterplan sekä `docs/translation-review-policy.md` ja `docs/translation-human-review.md`. Tarkista `main` ja kaikki avoimet päällekkäiset PR:t, etenkin #222. Laske kanonisesta julkaistusta FI-lähdeaineistosta FI × EN/SV/TH -matriisi, puuttuvat parit, 4-kielisesti valmiit reseptit, luonnokset ja virheiden tilat; älä luota 3.11. raportin lukuihin ilman uusintaa. Tallenna toistettava inventaario ja pieni raportti erilliseen Draft-PR:ään, ellei nykyinen masterplan-PR ole siihen tarkoitukseen erikseen päätetty. Älä tee runsaasti testejä, älä muuta ravinto-/GK-aineistoa, älä yhdistä PR:ää, älä julkaise. Lopussa ilmoita SHA:t, tarkan määrälaskennan peruste, päällekkäisyydet, 10-reseptin pilottijono ja seuraavan ajon valmis rajattu prompti. Lopputila GO / CONDITIONAL GO / HOLD / PARTIAL.

## 14. Hyväksymiskriteeri tälle PR:lle

Tämä suunnittelu-PR voidaan yhdistää erillisellä hyväksynnällä, kun:
- Baseline ja sen rajat esitetään oikein; historiallista 357-parin rekisteriä ei pidetä nykyisenä.
- GK80 ja rinnakkaiset käännös-PR:t on suojattu päällekkäisyydeltä.
- Ensimmäinen ajo on itsenäisesti käynnistettävissä.
- Ohjeet erottavat automaattisesti tarkistetun ja ihmisen hyväksymän käännöksen.
- Mitään reseptisisältöä tai julkaisutapaa ei muuteta tämän PR:n mukana.

**Ei sallittua tämän suunnitelma-PR:n perusteella:** auto-merge, julkaisu, 588 kieliparin massatuonti, ihmistarkistusstatusten vääristely, FI-ravintoarvojen/GK-lukujen muutos tai tuntemattomien lähdetietojen keksiminen.
