# Issue #369: FI-lähteen oikeellisuusportin nykytila ja toteutusaukot

**Päiväys:** 21.11.2026
**Työn omistaja:** Chat-5 (tämä rajattu katselmointi, ei muiden PR:ien omistajuutta)
**Tila:** READ-ONLY AUDIT / DRAFT – ei tuotantohyväksyntää, automaattijulkaisua tai ihmisen katselmoinniksi merkitsemistä.

## 1. Jo olemassa olevat mekanismit

| Osa | Varmennettu nykyisestä mainista | Mitä se EI todista |
| --- | --- | --- |
| `site/scripts/translation-batch-partition.ts` | Eräkohtainen `source-hold / needs-review / candidate` -luokittelu; FI- ja EN/SV/TH-semanttiset tiivisteet, kohdekielien rakenteelliset erot, todisterekisterin `REVIEW CURRENT` | `review_state` on ledgerin syöte eikä itsenäinen FI-kokkikelpoisuuspäätös; `candidate` ei ole julkaisulupa |
| `site/tests/translation-batch-partition.test.ts` | Puuttuva FI/kieli, käännös-SHA:n muutos, avoin P0/P1 kielitodisteessa ja ledgerin source-hold estävät etenemisen | Testin mock-merkintä `source-hold` ei todista aidon FI-lähdevirheen automaattista löytämistä |
| `site/scripts/new-recipe-preflight.mjs` | Uuden FI-julkaisun hyväksyntätiedot, lähde-SHA ja seitsemän kirjallista katselmointikohtaa tarkistetaan; HOLD jos tieto puuttuu | Ei todista kulinaarista totuutta eikä kata automaattisesti jokaista vanhan julkaistun FI-lähteen muutosta |
| `site/scripts/translation-source-preflight.mjs` | D30- ja E20-erien FI-esitarkistus, kun niiden worklist muuttuu | Ei koko reseptikirjaston yleinen oikeellisuusportti |
| `.github/workflows/pages.yml` | D30/E20-esitarkistuksia, uuden FI-julkaisun portti, erillinen viiden tapauksen chef quality -pilotti ja FI-toimituksellisen auditoinnin JSON/MD-artefakteja | Ei tässä katselmoinnissa osoitettu, että **#369:n** kolmijonoinen `translation-batch-partition` -raportti syntyisi jokaisesta relevantista PR:stä automaattisesti |

Lähdetiedostoja tarkistettiin GitHubin oletushaarasta. Tässä työssä ei ajettu testejä tai saatettu rakennettua artefaktia uudelleen; mainin nykytila voi muuttua rinnakkaisissa töissä.

## 2. Pysäyttävä aukko

V1:n `evaluateBatchEntry` palauttaa `candidate`-ryhmän, jos ledgerin `reviewState` on `ai-compared-draft`, kaikki rakenteet ja tiivisteet täsmäävät ja kieliparien semanttinen evidenssi on ajantasainen. Se **ei erikseen edellytä SHA-sidottua, riippumatonta FI-source-quality-päätöstä**. Tämä on #369:n ratkaiseva erottelu: kielten vastaavuus virheelliseen FI-ohjeeseen ei ole reseptin kokkikelpoisuustodiste.

Älä ratkaise aukkoa vain lisäämällä boolean `approved: true` ledgeriin. Lähdepäätöksellä on oltava FI-reseptin SHA, päätös ja sen perusteena olevat yksilöidyt havainnot, alkuperäinen audit-versio, katselmoija tai referenssi, päivämäärä sekä invalidointi aina FI-sisällön muuttuessa. FI-lähteen P0/P1-, ravinto- tai GK-muutos pysäyttää erän ennen kieliparien ehdokkuutta.

## 3. Viiden tarkoituksella vaikean tapauksen regressiokartta

Nämä ovat **testattavaksi määritettyjä synteettisiä tapauksia**, eivät väitteitä oikeiden julkaistujen reseptien virheistä tai nyt läpäistyistä testeistä.

| Tapaus | Syöte | Odotettu tulos |
| --- | --- | --- |
| FI-01 puuttuva rasva | Valmistus paistaa öljyssä, ainesluettelo ei sisällä rasvaa eikä selitettyä valmistusapua | `source-hold`; määrä tai evidenssi vaaditaan, ei automaattista imputointia |
| FI-02 geneerinen vieras valmistusvaihe | Puuroreseptissä valmistusvaihe käskee käsitellä lihaa; audit löytää epäjohdonmukaisuuden | `source-hold` tai dokumentoitu väärän osuman katselmointi; ei automaattista tekstin korjausta |
| FI-03 väärä lajike / yksikkö | FI-ainesosa käyttää eri raaka-ainelajia tai määrän yksikköä kuin varmennettu valmistus- ja ravintotodiste | `source-hold`, ravinto/GK-sidos uudelleenarviointiin |
| FI-04 vaarallinen lämpötila | Raakaa lihaa koskeva ohje sisältää epävarman kypsennys-/säilytysvaiheen | `source-hold` ja ihmisen arvio, vaikka kieliversiot vastaavat FI:tä täydellisesti |
| FI-05 FI-SHA vanhenee | Hyväksyttyä lähdettä muutetaan jälkikäteen, EN/SV/TH ja vanha evidenssi ovat ennallaan | lähdehyväksyntä vanhenee; kolme kieliparia `needs-review` tai `source-hold`, ei `candidate` |

Lisäregressio: pelkkä valmistusvesi, jonka käyttö ja syöty osuus on dokumentoitu, ei saa tuottaa perusteetonta FI-01-HOLDia. Tietojen tarkkuus, lähteet ja todellinen ruoanvalmistus ovat tärkeämpiä kuin heuristiikan osumamäärä.

## 4. Suositeltu toteutusjärjestys (erillinen koodi-PR)

1. **Evidenssisopimus:** määritä FI-source-quality -tietue ja sen SHA-invalidaatio yhteensopivasti `new-recipe-preflight`-, source worklist- ja nykyisen käännösevidenssin kanssa. Älä muuta `meta/kaannokset/codex-review-evidence.json`-tiedostoa rinnakkaisen omistajan ohitse.
2. **Partitiokone:** liitä lähdepäätös portiksi `candidate`-haaralle. Lähteen virhe / epätäydellinen evidenssi tuottaa fail-closed-luokan ja säilyttää kirjallisen perusteen.
3. **Regressiot:** toteuta FI-01..FI-05 ja valmistusvesi/false-positive-tapaus, lisäksi kaikkien EN/SV/TH-parien invalidointi FI-SHA:n muuttuessa.
4. **Artefakti:** tuota kolmesta jonosta kanoninen JSON + siitä muodostettu Markdown CI:ssä niille PR:ille, jotka koskevat kyseistä erää; säilytä SHA-tunniste. Erottele nolla käynnistynyttä jobia varsinaisesta FAIL-tuloksesta.
5. **Pilotti ja rajaus:** täsmä-HEAD-testit, viiden ongelmatapauksen manuaaliset perustelut, väärät positiiviset/negatiiviset; ei automaattista mergeä, GK- tai julkaisuvaltuutusta. Vasta tämän jälkeen nopeusoptimointi.

## 5. Rajat ja päätös

- Tämä PR lisää vain tilannekartoituksen eikä muuta CI:tä, reseptejä, laskentaa, HOLD-merkintöjä, käännösrekisteriä tai Cloudflare-julkaisua.
- Kooditoteutuksen vaadittuja testejä ei tässä ajettu. Tämä raportti **ei** ole #369:n valmistumis- tai hyväksymisilmoitus.
- Issue #369 pysyy avoimena, kunnes yllä olevat aukot on todistettavasti suljettu.
- Käytössä olevat uudemmat reseptien toimitukselliset auditit (#327) sekä aktiiviset Chat-1…Chat-4-työt säilyvät omissa omistajuuksissaan.
