# Chat-6: Recipavon GK-kattavuuden täysi nykytilainventaario 22.11.2026

**Tila: INVENTAARIO VALMIS; GI:n tieteellinen soveltuvuuskatselmointi ja mahdolliset julkaisut erillisiä töitä.**

## Lähde ja rajaus

- Työn omistaja: **Chat 6**. Integraatiovastaava: **Chat 1**.
- Alkuperäinen tutkimuksen lähtö-main: `5f93a08d62e0611fde431d04682370154835efa4`.
- Auditoidun PR:n base-main: `745e69685f875c89433e203203868dcd536aad70`.
- Auditoitu GitHubin yhdistelmäcommit (testattu lähdepuu): `2ad809e405f42d304db8c885360cde54a7bf0c6b`.
- Chat-6:n auditointikoodin HEAD CI-ajossa: `3b8f8882a19af26c2302c4d49d42bd552579a6fc`.
- [Auditointi ja GI/GK-regressiot: SUCCESS, ajo 45011777710](https://github.com/ozirix-dev/Reseptit/actions/runs/45011777710).
- [Aiempi ReportHub-handoff](https://github.com/ozirix-dev/ReportHub/blob/01fd768bcf668c0eee4aed0673e6c086af20b705/reports/handoffs/2026-11-22-recipavo-gk-audit-chat6.md).
- Testiympäristö oli eristetty GitHub Actions -checkout; se ei ollut Chat-2–5:n paikallinen työpuu. CI-konetta ei pidä tulkita käyttäjän Windows-työpuuksi.

Kaikki luvut alla perustuvat tähän yhteen suoritettuun reseptitilan, ravintoaineiden, GK-pilotin, esteinventaarion ja tutkimusjonon generointiin. Ajonaikaiset täydet reseptikohtaiset tulokset tallennettiin `tmp/nutrition/chat6-gk-audit/`-hakemistoon ja GitHub Actions -artefaktiin `chat6-gk-current-audit` (14 päivän säilytysaika). Niitä **ei** lisätä tuoterepon lähdedataksi. Repon pysyvä raportti on tämä asiakirja; täydet tulokset voidaan generoida uudelleen.

## 1. Julkisen FI-kannan todellinen kattavuus

| Mittari | Reseptit | Osuus näkyvistä FI-resepteistä |
| --- | ---: | ---: |
| Näkyviä FI-reseptejä | **406** | 100 % |
| Numeerinen alkuperäisen GK (piste tai vaihteluväli) | **151** | 37,2 % |
| Pelkkä sanallinen alkuperäis-GK | **24** | 5,9 % |
| Numeerinen tai sanallinen alkuperäis-GK yhteensä | **175** | 43,1 % |
| Ei numeerista eikä sanallista alkuperäis-GK:ta | **231** | 56,9 % |
| Koko annoksen hiilihydraattitieto näkyy | **337** | 83,0 % |
| Nelikielisiä reseptejä | **397** | 97,8 % |

`publicOriginalGk`-julkisen tilan jakauma: `CALCULATED` 151; `INSUFFICIENT SOURCE DATA` 200; `PENDING REVIEW` 55. Sanalliset GK-arviot voivat sisältyä alkuperäisen numerotilan `INSUFFICIENT SOURCE DATA`- tai `PENDING REVIEW` -riveihin. Pidä nämä mittarit erillään.

**Ero aiempaan 398/151-lähtötilaan:** näkyviä reseptejä **+8** (398 → 406), alkuperäisiä numeerisia GK-arvioita **+0** (151 → 151). Aiempi luku oli julkisen sivun päivätty havainto ilman samaa lähde-SHA:ta. Muutos ei todista yksittäisten julkaisujen ajankohtaa.

## 2. Miksi toinen inventaario kertoo 431?

- Koko alkuperäis-GK-pilotin syötekorpus: **354** (`CALCULATED` 156, `INSUFFICIENT SOURCE DATA` 198).
- GK:n osalta erikseen SHA-lukittuja uusia FI-lähteitä: **77**.
- Syötekorpusten yhteenlaskettu alkuperäisreseptien lähdemäärä: **431**. Tämä ei ole julkisten FI-sivujen määrä.
- Julkisen reseptitilan näkyviä FI-reseptejä: **406**. Yhteensä **25** lähdeidentiteettiä eivät kuulu tähän näkyvään julkiseen joukkoon (esim. karanteeni-, seuraaja- ja muu julkaisurajaus; yksilöitävä erikseen).
- Erillisen GK-HOLD-rekisterin 77 lähteestä näkyvässä kannassa **55** on ilman numeerista tai sanallista GK:ta, **21**:llä on sanallinen arvio ja **1** on erillisen näytön numeerinen nollatulos. Nämä eivät ole 77 uutta numeerista laskentatulosta.
- Laskentapilotin `CALCULATED` 156 ja julkinen alkuperäis-GK 151 ovat eri mittareita. Kattavuuslukuun ei saa lisätä 79 erillistä GK-versiota eikä 8 tutkimusvertailua.

## 3. Puuttumisen reseptikohtaiset käsittelyryhmät

Seuraavat yhdeksän ryhmää ovat **toisensa poissulkevia** ja kattavat kaikki 406 näkyvää reseptiä. Yksittäisen reseptin kaikki esteviestit löytyvät CI-artefaktin `recipes.json`-tiedostosta. Ryhmä kuvaa katselmointitarvetta; se ei yksin myönnä julkaisu- tai laskentalupaa.

| Ryhmä | Reseptit |
| --- | ---: |
| `BINDING_REVIEW` | 24 |
| `CHO_OR_PORTION_EVIDENCE_REVIEW` | 54 |
| `GI_SOURCE_OR_MATCH_REVIEW` | 38 |
| `INTERNAL_CALCULATION_NOT_PUBLIC` | 3 |
| `MULTIPLE_OR_UNCLASSIFIED_REVIEW` | 55 |
| `NEW_PUBLIC_GK_REVIEW_PENDING` | 55 |
| `PUBLIC_NUMERIC` | 151 |
| `PUBLIC_VERBAL` | 24 |
| `TECHNICAL_OR_TOLERANCE_REVIEW` | 2 |

Julkisesti numeerista GK:ta vailla olevista 255 reseptistä 24 sisältää vain sanallisen arvion. Aidosti ilman kumpaakaan arviota on 231.

**Tarkistettavia esimerkkejä (ei automaattisia julkaisuja):**

- `INTERNAL_CALCULATION_NOT_PUBLIC` (3): `lahi-ita-zaatar-munat`, `meksikolainen-aamiais-tacot-mustapavuilla`, `meksikolainen-molletes-pico-de-gallolla`. Sisäinen `CALCULATED` ei syrjäytä julkista HOLDia. Näistä kahdelta puuttuu lisäksi julkisessa reseptitilassa koko annoksen hiilihydraattitieto.
- `TECHNICAL_OR_TOLERANCE_REVIEW` (2): `pad-see-ew-vhh-konjac` (poisjättö 2,659 g/annos), `siemengranola-jogurtilla` (2,064 g/annos). Molemmat ylittävät nykyisen **alle 2 g/annos** -toleranssin. Rajaa ei saa nostaa kattavuuden vuoksi.
- `GI_SOURCE_OR_MATCH_REVIEW` -ryhmän esimerkkejä: `bouillabaisse`, `congee-riisipuuro`, `intialainen-pinaatti-paneer-chilla`, `keltainen-kanacurry-vhh`. Soveltuva GI-lähde tai valmistusvastaavuus pitää tarkistaa reseptikohtaisesti.
- `CHO_OR_PORTION_EVIDENCE_REVIEW` -ryhmän esimerkkejä: `bibimbap`, `dal-makhani`, `goi-cuon`, `hernekeitto-savupotkalla`. Pelkkä GI-haku ei ratkaise annos- tai koostumuspuutetta.

### Päällekkäiset esteet GK-laskennan 354 rivin sisäisessä inventaariossa

| Laskennan estoluokka | Reseptit | Estoviestit |
| --- | ---: | ---: |
| `STRUCTURE` | 54 | 54 |
| `INPUT` | 29 | 29 |
| `EVIDENCE` | 29 | 29 |
| `COMPOSITION` | 86 | 331 |
| `MASS_PREPARATION` | 13 | 15 |
| `GI_MATCH` | 44 | 54 |
| `GI_MISSING` | 36 | 39 |
| `TOLERANCE` | 2 | 2 |

Estoluokkia **ei saa summata** reseptimääräksi: sama resepti voi esiintyä useassa luokassa. Laskentainventaarion keskeneräisistä 198 tapauksesta 95 on ravintoarvioinnin `ESTIMATE WITH EVIDENCE` -tilassa, 38 vaatii ravintolähteiden lisäkatselmointia ja 65 puuttuu ravintoarvoinventaarion näkökulmasta.

## 4. Julkaistujen GK-arvioiden epävarmuus

| Tarkistus | Reseptit |
| --- | ---: |
| `LOW` | 150 |
| `NOT_IN_INTERNAL_PILOT` | 1 |
| Dokumentoitu positiivinen hiilihydraattiosuuden poisjättö | 80 |
| Ainakin yksi GI-analogia | 40 |
| Ainakin yksi GI-ryhmäkeskiarvo | 66 |
| Ainakin yksi julkaistu imputointi | 23 |
| Käytetty GI-lähde ilman `evidenceKind`-merkintää | 73 |

Nämä jakaumat menevät osittain päällekkäin. Varmuusluokka `LOW` kuvaa menetelmän konservatiivista arviota ja soveltuvuusrajoja, ei sitä, että kyseinen GK-luku olisi osoitettu virheelliseksi. Erillinen nollatulos `kylma-oliivioljylevite` ei ole sisäisen pilotin `CALCULATED`-rivillä, joten sillä ei ole pilotin `HIGH`/`MEDIUM`/`LOW`-luokitusta.

**Erillinen mahdollinen laatuepäyhtenäisyys:** kuudella julkisesti numeerisella GK-arviolla julkinen koko annoksen hiilihydraattitietolippu on `false`: `janssoninkiusaus-juuriselleri`, `marokkolainen-couscous`, `paprikainen-vhh-gulassi`, `pasta-alla-norma`, `rogan-josh`, `sitruuna-yrttikana-parsa`. Kyse voi olla ravintolähteen puutteesta tai näyttösäännöstä; tämä auditointi ei automaattisesti väitä julkaistua GK:ta virheelliseksi.

## 5. GI-rekisteri ja lähteiden soveltuvuus

- Rekisterissä **64** GI-riviä ja **11** lähdekuvausta.
- `qualityTier`: `STRONG` 6, `SUPPLEMENTARY` 58.
- `matchKind`: `ANALOG` 34, `CATEGORY_MEAN` 17, `EXACT` 3, `MISSING` 10.
- `evidenceKind`: `HUMAN_GI` 7, `MISSING` 45, `PUBLISHED_IMPUTATION` 12.
- `REFERENCE_ONLY`: 4 tietuetta.

GI-tietueen `SUPPLEMENTARY` ei automaattisesti tee reseptiarviosta virheellistä; toisaalta lähderivien määrä ei todista niiden soveltuvuutta tiettyyn syötävään annokseen. Varmentamista vaativat ruoan valmistustapa, koostumus, mittaustapa ja reseptin annos. Uusi mallinnettu GK ei saa ohittaa nykyistä alkuperäisen reseptin hyväksyntäporttia.

## 6. Tutkimusjonon uusi tila

| Jono | Reseptit |
| --- | ---: |
| `new` | 191 |
| `reopened` | 0 |
| `skip` | 16 |
| `approved` | 169 |
| `review` | 30 |
| `priority` | 0 |

Tutkimusjonon `approved` tarkoittaa nykyisen päätös-/julkaistun tiedon käsittelytilaa, **ei** samaa kuin numeerisen GK:n määrä. `new` ja `review` eivät ole tieteellisesti hyväksyttyjä uusia laskelmia. Rajatun seuraavan 30 reseptin listan saa CI-artefaktista `research-queue.json`.

## 7. Luotettavasti saavutettavissa oleva kattavuus

- Nykyinen **julkinen numeerinen** kattavuus: 151/406 (37,2 %).
- Jäljellä olevia julkisia alkuperäisreseptejä ilman numeerista GK:ta: 255.
- Omistajan 80 % tavoite vaatisi tämän kokoisella julkisella kannalla vähintään **325** alkuperäistä numeerista arviota eli **174** uutta hyväksyttyä arviota, mikäli nimittäjä ei muutu.
- Olemassa olevalla laskentapilotin kapeammalla 354 reseptin laajuudella sen oma 80 % tavoite on 284 ja laskennallinen ero 128. Näitä eri nimittäjiä ei saa sekoittaa.
- **0** uutta julkisesti hyväksyttävää lukua osoitettiin automaattisesti tämän auditoinnin perusteella. Kolme sisäisesti laskettua mutta julkisesti estettyä tapausta eivät ole julkaisulupa. Tieteellisesti toteutuvan nousun ylärajaa ei voi todeta ennen reseptikohtaista lähdekatselmointia.

## 8. Rajattu seuraava GK-laadun parannuserä – ehdotus Chat-1:lle

Ensimmäiseksi kannattaa tehdä **kahden julkisesti numeerisen mutta koko annoksen hiilihydraattitietoa näyttämättömän reseptin** erillinen katselmointi: `janssoninkiusaus-juuriselleri` ja `pasta-alla-norma`. Tarkista näiden todellinen lähde-, annos- ja julkisen esityksen rajaus. Lopputulos voi olla perustellun eron dokumentointi, ravintolähteen täsmennys tai erillinen HOLD – **ei** automaattinen GK-arvon muuttaminen.

Tämä kahden reseptin kohde on olemassa olevan GK-tiedon laadun tarkistus, ei uuden massalaskennan alku. Muut neljä samankaltaista reseptiä jäävät samaan myöhempään katselmointijonoon. Älä käynnistä aineistomuutoksia ilman erillistä rajattua työtä.

## 9. Toistettavuus ja testit

Eristetyn auditointiympäristön tapahtumaketju:

1. GitHub Actionsin erillisessä checkoutissa käytettiin main-pohjaa `745e69685f875c89433e203203868dcd536aad70` ja testattua yhdistelmä-SHA:ta `2ad809e405f42d304db8c885360cde54a7bf0c6b`.
2. SHA-256-tarkistetut kuvasyötteet palautettiin, ja `npm ci` suoritettiin.
3. `site/scripts/recipe-state-cli.ts` generoi nykyiset sisältö-, ravinto- ja GK-raportit.
4. `npm run audit:glycemic-coverage` eritteli estot.
5. `gk-research-queue.ts 30 --catalog` teki lähdetutkimusjonon vain luku -valinnan.
6. `node site/scripts/chat6-gk-current-audit.mjs` tarkisti lähde-SHA:n ja sisäisen laskennan määrien yhteneväisyyden sekä tuotti `summary.json`, `recipes.json`, `published-numeric-evidence.json` ja `current.md` `tmp/`-hakemistoon.
7. `npm run test:glycemic` läpäisi erillisessä auditointi-CI:ssä. Kuvasyötteiden ja julkaistujen reseptien alkuperäistä luonnetta ei muutettu.

Toisto erillisessä puhtaassa saman revision työkopiossa (kun kuvat on palautettu projektin omalla SHA-varmennetulla CI-menetelmällä):

```bash
cd site
npm ci
node --import tsx scripts/recipe-state-cli.ts
npm run audit:glycemic-coverage
mkdir -p ../tmp/nutrition/chat6-gk-audit
node --import tsx scripts/gk-research-queue.ts 30 --catalog > ../tmp/nutrition/chat6-gk-audit/research-queue.json
node scripts/chat6-gk-current-audit.mjs
npm run test:glycemic
```

**Tarkisteet:** Auditin neljä JSON/Markdown-tulosta, täydet per-resepti-estot ja tutkimusjonon päätökset julkaistaan vain lyhytaikaisena GitHub Actions -artefaktina. Lähdekoodi säilyttää toistettavuuden. Kun pohja-SHA muuttuu, raportin määrät on laskettava uudelleen. CI:n vihreys ei korvaa tieteellistä hyväksyntää.

## Rajoitukset ja tietoiset non-actionit

- Ei GI/GK-numeroita, hyväksyntärekistereitä, reseptiä, julkaisustatusta eikä tuotantoympäristöä muutettu.
- Laskennan estoluokkien automaattinen `OTHER` ei selitä yksittäisen reseptin tieteellistä syytä; alkuperäiset blocker-viestit on tarkistettava `recipes.json`-listasta.
- Työkalujen `CALCULATED`, `approved`, `verbal` ja `published numeric` tarkoittavat eri asioita.
- 25:n syötekorpus–julkinen reitti -eron tarkka selitys vaatii yksittäisten reseptien tilojen tarkistuksen; ero itsessään ei todista vikaa.
- Auditointi mittaa nykyisten laskenta- ja julkaisusääntöjen mukaisen tilan, ei ihmiskokeissa mitattua aterian GI:tä tai diabeteksen hoitotulosta.
- Kriittistä normaalin Recipe site -CI:n SHA-suojausta ei ohitettu; ensimmäinen PR-ajo pysähtyi, kun main vaihtui kesken ajon. Auditointityön oma CI onnistui testatulle revisionille.
- Tämän raportin havainnot eivät anna Chat-6:lle Ready- tai merge-valtuutta. **Chat-1 vastaa yhdistämisistä.**
