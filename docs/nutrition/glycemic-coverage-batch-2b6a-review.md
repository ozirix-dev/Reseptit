# GI/GK-erä 2B6A — lähdekatselmointi ja auditointi

## Rajaus ja lähtötilanne

Erä perustuu Reseptit-main-committiin `21d9628db3ffc7434e4308d6ab42880d1f12bae0` ja ReportHub-main-committiin `a748f250f051637212c1e44ab56a541a97bff5fb`. Erilliset työpuut ovat `D:\Projects\Products\Reseptit-glycemic-coverage-batch-2b6a` (haara `codex/glycemic-coverage-batch-2b6a`) ja `D:\Projects\_Hub\ReportHub-reseptit-glycemic-coverage-batch-2b6a` (haara `codex/reseptit-glycemic-coverage-batch-2b6a`).

Muuttumaton lähtöbaseline on `glycemic-coverage-batch-2b6a-baseline.json`: kaikki 325 reseptiä, 129 laskettua / 196 keskeneräistä, 39 GI-tietuetta (5 STRONG, 34 SUPPLEMENTARY). Strict nutrition audit oli 180 tuettua, 86 tarkistettavaa, 59 puuttuvaa ja 0 ristiriitaista. Erien 1–2B5 historiallisia snapshoteja ei muutettu.

## Inventaario ja kahdeksan lupaavinta ehdokasta

Uudelleenajo kattoi kaikki 196 keskeneräistä reseptiä. Lähtötilan päällekkäiset esteluokat olivat STRUCTURE 41, INPUT 0, EVIDENCE 0, COMPOSITION 65, MASS_PREPARATION 20, GI_MATCH 90, GI_MISSING 41 ja TOLERANCE 7. Ravintoarvotila oli 101 tuettu, 41 tarkistettava ja 54 puuttuva.

Seulonta suosi tuettuja ravintoarvoja, tunnettua annosmäärää, dokumentoituja hiilihydraattimääriä ja yhtä tai kahta rajattua GI-estettä. Seulonta löysi kahdeksan lupaavinta lähdepolkua:

| Sija | recipeId | GK-este ja hiilihydraatti/annos | Lähdevalmius ja ratkaisu | Työmäärä |
|---:|---|---|---|---|
| 1 | `bulgogi` | Raastettu päärynä noin 2,0 g; seesami 0,025 g ja pippuri 0,048 g | Raakapäärynälle löytyi ruoka-ainekohtainen julkaistu GI-keskiarvo. Pienet seesami- ja pippuriosuudet sopivat nykyiseen toimitukselliseen toleranssiin. | Pieni |
| 2 | `keto-suklaakeksit` | Sokeriton tumma suklaa 0,246 g; kaikki pois jätetyt osuudet 0,5073 g | Tarkka tuotekoostumus tunnetaan, mutta yleinen tumma suklaa ei ole tuotekohtainen GI-osuma. Koko pieni osuus voidaan jättää pois lähteistetysti. | Pieni |
| 3 | `vhh-mokkapalat` | Kaakao yhteensä 0,1375 g; kaikki pois jätetyt osuudet 0,36475 g | Finelin koostumus tunnetaan. Julkaistu kaakaojuoman GI ei mittaa puhdasta kaakaojauhetta eikä kakkua; pieni jauheosuus voidaan jättää pois. | Pieni |
| 4 | `lanttulaatikko-kermainen` | Lanttu 11,76 g | Vuoden 2002 taulukossa on swede/lanttu-arvo, mutta lähde ei määritä valmistustapaa. Keitetty, soseutettu ja uunissa paistettu laatikko ei saa hyväksyttävää vastaavuutta. | Pieni tutkimus, estyy |
| 5 | `paella-valenciana` | Valmis kanalientä 1,0675 g | Tunnettu koostumus, mutta annososuus ylittää pienosuustoleranssin eikä liemelle löytynyt vastaavaa GI-mittausta. | Rajattu, estyy |
| 6 | `thai-khao-tom-katkaravuilla` | Laimennettu kanaliemi 1,4945 g; inkivääri 0,048 g | Inkiväärin voi jättää pois toleranssissa, mutta liemi ylittää 1 g eikä geneerinen keittokeskiarvo vastaa reseptin tuotetta. | Rajattu, estyy |
| 7 | `kerala-kalacurry` | Kookosmaito 1,564 g; tamarinditahna 2,1525 g | Kookosmaidon tuotetta ei yksilöidä (aiempi dead end); tamarindin nykyinen hedelmäproxy ei ole hyväksyttävä match. | Useampi puute, estyy |
| 8 | `bouillabaisse` | Sinisimpukat 2,9375 g; fenkoli 0,9 g | Simpukoille puuttuu julkaistu GI ja fenkolin nykyinen yleinen vihannesproxy on liian laaja. | Useampi puute, estyy |

Perunaton liha-juureskeitto, bulgur/couscous, kypsä tomaatti, filotaikina, uppopaistettu maissi, yksilöimätön kookosmaito ja congee-liemi jätettiin priorisoimatta aiempien lähdeumpikujien mukaisesti. Parsojen 1,4 g/annos osuutta ei käsitelty pienosuutena. Reseptimääriä, annoskokoja, GK-kaavaa, rajoja tai confidence-mallia ei muutettu.

## Neljän reseptin syväkatselmointi

### `bulgogi` — PASS-CANDIDATE, GK avattu

Reseptin 100 g hienoksi raastettua päärynää käytetään neljälle annokselle marinadissa ja kuumennetaan paistamisen yhteydessä. Foster-Powell K, Holt SHA ja Brand-Miller JC:n International Tables 2002 -julkaisun Table 1, rivit 423–426, raportoi neljän raa'an päärynän tutkimuksen keskiarvon GI 38 ± 2 (glukoosiasteikko). Se on ruoka-ainekohtainen mutta vanhempi, lajike- ja tutkimuskohtaisesti vaihteleva, eikä ISO 26642 -vahvistettu. Nykyinen lähdepolitiikka sallii perustellun ruoka-aine-/valmistustapa-analogian vain matalalla luottamuksella: tietue pysyy SUPPLEMENTARY / ANALOG / LOW -tasolla, ja raaka, raastettu, marinadissa kuumeneva päärynä ei ole EXACT-vastaavuus eikä bulgogin tai seka-aterian mitattu GI. [Foster-Powell ym., International Tables 2002](https://doi.org/10.1093/ajcn/76.1.5).

Päärynän 2,0 g/annos on lähteistetty Fineli 11062 -tietueella. Seesamin 0,02488375 g ja mustapippurin 0,04825 g jätetään pois lähteistettyjen koostumustietojen perusteella ilman GI-proxyja. Molempien hiilihydraatti lasketaan normaalia lähdekoostumusta käyttäen: seesami 8,5 g × 1,171 g/100 g ÷ 4, mustapippuri 0,5 g × AFCD:n 38,6 g/100 g ÷ 4. Pilot-syötteen käsin arvioidut `estimatedAvailableCarbohydratePerServingG` -kentät poistettiin, sillä niitä ei käytetä lähteistetyn massan normaalissa laskentapolussa ja ne olivat redundantteja; ne muuttivat input-fingerprintiä. Pois jätetty määrä pysyy yhteensä 0,07313375 g/annos. Uusi laskenta: GK ennen pyöristystä 40,249495; tallennettu 40,25; näytetty yhden merkitsevän numeron tarkkuudella 40; GK-luokka HIGH; confidence LOW.

### `keto-suklaakeksit` — PASS-CANDIDATE, GK avattu

AFCD F009837 tunnistaa ainesosan lisättyä sokeria sisältämättömäksi tummaksi suklaaksi ja tukee 0,246 g/annos hiilihydraattia. International Tables 2021:n tumma suklaa -keskiarvo koostuu neljästä eri tuotteesta eikä varmista tämän tuotteen GI:tä. Sitä ei käytetä. Voi, kananmuna, leivinjauhe, suklaa, vanilja ja suola pois jätettynä muodostavat lähteistetyn yhteissumman 0,5073 g/annos; kukin positiivinen mitattu osuus on alle 1 g/annos. [Atkinson ym., International Tables 2021](https://doi.org/10.1093/ajcn/nqab233).

GK ennen pyöristystä 0,56376; tallennettu 0,56; näytetty 0,6; luokka LOW; confidence LOW. Pois jätetyn määrän teoreettinen suurin lisäys GK:hon GI 100 -herkkyysoletuksella olisi 0,5073, mikä ei muuta LOW-luokkaa. Tämä on herkkyystarkistus, ei julkaistu GI-oletus.

### `vhh-mokkapalat` — PASS-CANDIDATE, GK avattu

Fineli 20:n kaakaojauhetietue tukee 0,0916667 ja 0,0458333 g/annos kahdelle reseptiin listatulle jauheosuudelle. Leivonnaisten keskiarvoa ei siirretä kaakaojauheelle. Brand-Miller ym. tutkivat kaakaota vähärasvaisessa maidossa ja raportoivat testijuomalle GI 58 ± 18; se ei ole puhtaan jauheen tai kakun GI, joten tutkimusta ei hyväksytty suoraksi lähteeksi. [Brand-Miller ym. 2003](https://doi.org/10.1093/jn/133.10.3149).

Pois jätetty määrä yhteensä 0,36475 g/annos. GK ennen pyöristystä 0,3977833333; tallennettu 0,40; näytetty 0,4; luokka LOW; confidence LOW. GI 100 -herkkyystarkistuksen enimmäislisäys olisi 0,36475 GK-yksikköä eikä muuttaisi LOW-luokkaa. Tämä ei ole mitattu tai julkaistuksi GI:ksi asetettu oletus.

### `lanttulaatikko-kermainen` — BLOCKED

Reseptin 800 g lanttua keitetään 20–25 minuuttia, valutetaan, soseutetaan kermaan, voihin ja kananmunaan, minkä jälkeen seos paistetaan 175 °C:ssa noin tunnin ajan. Foster-Powell ym. International Tables 2002 -julkaisun Table 1 antaa swede/rutabaga-arvon 72 ± 8 (5 tervettä osallistujaa, glukoosivertailu, 2 h), mutta ei kuvaa kyseistä valmistusta. Lisäksi tutkimus on pieni eikä ISO 26642 -vahvistettu. [Foster-Powell ym., International Tables 2002](https://doi.org/10.1093/ajcn/76.1.5). Koska lantun osuus on 11,76 g/annos, sitä ei voi ohittaa toleranssilla. Ei muutosta laskentaan.

## Kattavuus ja regressiot

Kaikkien 325 reseptin tulos: ennen 129 laskettua / 196 keskeneräistä ja 39 GI-tietuetta; jälkeen 132 / 193 ja 40 tietuetta (5 STRONG, 35 SUPPLEMENTARY). Kolme uutta arviota: `bulgogi`, `keto-suklaakeksit`, `vhh-mokkapalat`. Aiemmin laskettujen GK-arvoja ei muuttunut eikä yksikään resepti estynyt lisää. Laskettujen GK-luokat: LOW 87, MEDIUM 11, HIGH 34; kaikki 132 confidence-arvoa ovat LOW.

Perustelluilla pienosuuksilla bulgogin näytetty GK on 40, keto-suklaakeksien 0,6 ja mokkapalojen 0,4. Luokat pysyvät herkkyystarkistuksissa samoina. Aiemmin lasketuista resepteistä tulkintaa muuttavia GK-muutoksia on 0. Uusista arvoista yksi on HIGH (bulgogi), kaksi LOW; kyseessä on kolme uutta kattavuusarviota, ei aiempien arvojen korjaus.

Strict nutrition audit säilyi 180 / 86 / 59 / 0. Uusi GI-tietue: `pear-raw-mean-gi-38-2002`. Bibliografian tekijätieto ja Table 1 -viite korjattiin; GI 38 ei muuttunut. Bulgogin redundantit pienhiilihydraattiarviot poistettiin seesamilta ja mustapippurilta. Lähdekoostumuksesta laskettu seesamin 0,02488375 g/annos, mustapippurin 0,04825 g/annos ja yhteissumma 0,07313375 g/annos säilyivät samoina. Bulgogin laskentasyötteen ja lähde-evidenssin fingerprintit päivitettiin; reseptin rakennesidonta ja koostumusarvot eivät muuttuneet. Reseptitekstejä ja tavallisia ravintoarvoja ei muutettu. Nykyinen auditointi ei havainnut uusia structure/input/evidence mismatch -eroja (0/0/0). Eräkohtaisen inventoryn `sourceCommit` on `7a850e983737db90e29427efaf2c5279156d0513`; baseline säilyi muuttumattomana (325 / 129 / 196 / 39). Nykyinen inventory JSON ja Markdown päivitettiin (325 / 132 / 193 / 40).

## Testaus ja julkaisu

`npm test` PASS (119/119); `npm run test:glycemic` PASS (50/50); `npm run audit:nutrition -- --strict` PASS (180 / 86 / 59 / 0); `npm run audit:glycemic-load` PASS (325 reseptiä, 132 laskettua / 193 keskeneräistä; bulgogi 40,25, pois 0,07313375 g/annos); 2B6A-kattavuusauditointi PASS (325 / 132 / 193 / 40, uudet rakenne-/syöte-/lähdesidonnan mismatchit 0/0/0); `npm run build` PASS (TypeScript, Vite, 690 esirenderöityä reittiä); erillinen TypeScript-tarkistus PASS; staattiset testit 23/23. Markdown lint, lopullinen GitHub Actions ja `git diff --check` varmistetaan PR:n viimeiselle HEADille. Erä 2B6A ei muuta tuotantoa eikä yhdistä PR:iä. Käännös-, kuva- ja selainpolut eivät muuttuneet.

## Avoimet huomiot

- Lanttulaatikko tarvitsee valmistustapavastaavan GI-mittauksen ennen laskennan avaamista.
- Stock-, kookosmaito-, simpukka- ja tamarindilähteiden puutteet jäävät ennalleen.
- Confidence-arvot ovat LOW, koska lähteissä on analogisia GI-osumia tai toimituksellisia pieniä hiilihydraattiosuuksia. Confidence-algoritmia ei muutettu.
- LOW-luottamusmallin erillinen arviointi ja erä 2B6B eivät kuulu tähän työhön.
