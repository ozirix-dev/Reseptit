# SOURCE-01 – SQLite/D1-kenttäkartoitus v1

Tila 2.11.2026: **katselmointiehdotus, omistajan hyväksyntä puuttuu**. Tämä ei ole SQL-migraatio, tuontiohjelma eikä lupa ottaa uusia arvoja laskentaan. Sovitetaan [PR #172:n](https://github.com/ozirix-dev/Reseptit/pull/172) vaiheen 1 käsitemalliin; nykyinen Git-omistajuus säilyy. Lähtötilanne: main `c5393a10a07fdb5f97bd50a1d14f2747f4488cbe`.

## 1. Tietosopimus ja relaatiot

Sama looginen skeema toteutetaan myöhemmin paikalliseen SQLiteen ja D1:een. Käytetään tavallisia tauluja, vierasavaimia ja yksikäsitteisyysrajoitteita. Alla nimet ovat ehdotuksia; velvoittavia hyväksyttäväksi ovat avaimet, merkitykset ja säilytettävä näyttö. Ei PostgreSQL-riippuvuutta eikä automaattista maiden välistä yhdistelyä.

| Kokonaisuus / kentät | Merkitys ja rajoite |
|---|---|
| `source`: `source_id`, ylläpitäjä, virallinen URL | Nimiavaruus, esim. NEVO, MEXT. Ei elintarvikkeen hyväksyntä. |
| `source_release`: `source_id`, `release_key`, `vendor_version`, `published_at`, `retrieved_at`, `manifest_sha256`, `rights_snapshot_id` | Yksilöllinen `(source_id, release_key)`. Release key erottaa myös saman toimittajaversion korjatut snapshotit; toimittajan versionumero säilyy muuttamatta. Aikaleima UTC; puuttuva julkaisupäivä null. |
| `source_asset`: `asset_id`, release, alkuperäinen URL, SHA-256, tavumäärä, MIME, yksityisen arkiston viite, oikeustila | Rajoitetut aineistot vain sallitussa yksityisessä arkistossa. Julkisessa Gitissä metadata ja linkit. Bucketin yksityisyys ei yksin anna säilytysoikeutta. |
| `raw_occurrence`: asset, sivu/taulukko/rivi, `native_food_id`, alkuperäinen nimi, `payload_sha256`, `semantic_sha256`, canonicalization-versio | Jokainen havainto talteen. Saa säilyttää saman native-ID:n kaksi eri riviä tutkimuksessa. Ei vielä laskentataulu. |
| `source_record`: `record_revision_id`, release, `native_food_id`, raw occurrence, nimi, laji/osa, tila, tuote, basis, määrä/yksikkö | Hyväksyttyyn tietuejoukkoon UNIQUE `(source_id, release_key, native_food_id)`. ID:t tekstiä: `04046`, `13-669`, `D87` säilyvät. Ei automaattista mergeä nimen perusteella. Ristiriita karanteeniin ennen insert/updatea. |
| `nutrient_definition`: source + release + `native_component_id`, nimi, määritelmä, yksikkö, menetelmä, sisältääkö kuidun/polyolit, polyolijoukon rajaus | Lähteen oma koodi erillään projektin semanttisesta tunnisteesta. Jos lähde ei anna koodia, käytetään dokumentoitua otsikkoa ja tiedostolokaattoria; adapterin tunnistetta ei esitetä lähteen koodina. |
| `nutrient_observation`: tietuerevisio, definition, `raw_value_text`, `value_state`, `decimal_value`, ala-/yläraja, `derivation_method`, lähde-/menetelmäviite | Havaintokohtainen alkuperä ja puuttuvuus. Useampi menetelmä/havainto sallitaan omalla observation-ID:llä; laskenta valitsee nimenomaisesti yhden. Ei summata saman komponentin vaihtoehtoisia havaintoja. |
| `normalization`: alkuhavainnot, adapteri-/sääntöversio, kaava, kohdemääritelmä, tulos, tarkistus | Johdettu arvo erillään alkuperäisestä. Ei korvaa lähdearvoa. Talletetaan myös muunnoksen edellytykset ja hylkäyssyy. |
| `record_review` / `ingredient_match`: tietuerevisio, havaintovalinnat, päätös, perustelu, tarkistaja, aika | Tietueen hyväksyntä ja tietyn reseptin ainesosavastaavuus eri päätöksiä. Automaattinen ehdokas ei ole ihmishyväksyntä. |
| `calculation` / `calculation_ingredient`: resepti-ID, input-hash, annokset, rivi-indeksi, täsmällinen tietuerevisio, lähdemäärät, massa-/hävikkinäyttö, menetelmäversio, tulokset, tila | Resepti ja kaikki käytetyt lähdeversiot voidaan palauttaa. Rivi-indeksi tarvitaan saman raaka-aineen useaan esiintymään. |
| `import_batch` / `approval_manifest`: paketin SHA, skeema-/importer-/adapteriversiot, releaset, määrät, hyväksyntäpäätös ja digest | Identtinen paketti on no-op; eri sisältö samassa avaimessa pysähtyy. Hyväksyntä sidotaan pakettiin, ei muuttuvaan haaranimeen. |
| `publication_release`: main-SHA, hyväksytty paketti, laskentaversiot, vienti-SHA, varmistusmanifesti | Staattisen julkaisun jäljitettävä snapshot; sivulataus ei tarvitse D1-kyselyä. |

Desimaalit säilytetään alkuperäisinä merkkijonoina ja kanonisena desimaalitekstinä; SQLite/D1:n REAL ei ole laskennan ensisijainen totuus. Myöhemmän adapterin laskentatarkkuus ja loppupyöristys testataan nykyistä rationaalista laskentaa vasten. Tuntemattomat kentät ovat null, eivät `0` tai tyhjäksi muutettu merkkijono. Raja-arvot ja alkuperäinen merkkijono säilyvät erikseen.

**CoFID-poikkeus:** 2021-tiedoston `1.3 Proximates` sisältää 2 887 ruokariviä mutta 2 886 eri food codea. `13-669` on rivillä 55 paahdettu munakoiso ja rivillä 2827 raaka vesikrassi. `raw_occurrence` säilyttää molemmat; kyseistä koodia ei hyväksytä yksikäsitteiseksi `source_record`-tietueeksi ennen lähteen korjausta tai erillistä, dokumentoitua ratkaisua. Ei viimeinen rivi voittaa -tuontia eikä keksittyä lähdekoodia. Muu erä voidaan myöhemmin rajata eksplisiittisesti ilman tätä ryhmää.

Uusintahaku ei itsessään luo uutta toimittajaversiota tai hyväksyttyä tietuerevisiota. Säilytetään erikseen kuljetuksen koko bytes-hash ja deterministinen semanttinen hash (versionoitu kanonisointi: lähde/release/native-ID, nimi/tila/basis, järjestetyt native-komponentit, alkuperäiset arvotekstit/yksiköt, menetelmät ja lähdeviitteet). Vain käyttöliittymän/tulostusajan muutos saa tuottaa uuden capture-havainnon samaan revisioon. Kanonisointi ei poista ravintomääritelmää, puuttuvuusmerkkiä tai menetelmää. Jos semanttinen sisältö muuttuu saman hyväksytyn release/native-ID-avaimen alla, se pysäytetään ja uusi korjaussnapshot katselmoidaan ennen hyväksyntää. Release keytä ei generoida automaattisesti jokaisesta hakukellonajasta. Näin byte-arkistointi ja varsinaisten ruokarivien idempotenssi eivät ole sama asia. Tämän kanonisoinnin toteutus ja näyttö kuuluvat vaiheeseen 2.

## 2. Arvon tila on eri asia kuin tuottamismenetelmä

| `value_state` | Tulkinta / laskentakelpoisuus |
|---|---|
| `REPORTED_NUMERIC` | Lähde julkaisee numeron. Ei todista mittausta; menetelmä voi olla laskettu, lainattu tai koostettu. |
| `REPORTED_ZERO` | Lähde julkaisee nollan. Menetelmä ja havaitsemisraja tarkistetaan erikseen. |
| `MISSING_MEASUREMENT` | Komponentti kuuluu taulukkoon, mutta arvo puuttuu (`-`, blank lähteen ohjeen mukaan). Ei numeroa. |
| `COMPONENT_NOT_REPORTED` | Lähde/taulukko ei tarjoa tätä komponenttia. Eri asia kuin yksittäisen ruoan puuttuva mittaus. |
| `TRACE` | `Tr` tai vastaava. Ei täsmällinen nolla; mahdollinen raja säilyy, nykyiseen pistelaskentaan HOLD. |
| `CENSORED` | Esim. `<0.1`: ylärajahavainto, ei 0 eikä 0.1:n tarkka mittaus. |
| `UNKNOWN` / `CONFLICT` | Selite tulkitsematta tai ristiriita. Ei normalisoitua lukua. |

`derivation_method` on erillinen: measured / calculated / recipe-derived / borrowed / logical-zero / estimated / unknown. Esimerkiksi NEVO:n loogisesti päätelty julkaistu nolla on `REPORTED_ZERO + logical-zero`, ei puuttuva eikä mitattu nolla. MEXT:n `(0)` säilyy nollana **arvioitu**-menetelmällä; `Tr` ja `-` säilyvät eri tiloina. CoFIDin `N` ei ole luotettava määrä; se on unknown, ei nolla.

Ehdotettu vaiheen 1 sääntö: yleinen adapteri ei hyväksy logical-zero-, trace-, censored- tai menetelmältään epäselvää polyolihavaintoa automaattisesti täsmälliseksi vähennettäväksi luvuksi. Sitä ei muuteta `polyolsSourceVerified=true` vain numeron perusteella. Jos loogisille nollille halutaan myöhemmin poikkeus, tarvitaan nimetty lähde-/komponentti-/menetelmärajaus, omistajan päätös ja erillinen toteutusarvio. Nykyisiä GK80:n reseptikohtaisia poikkeuksia ei laajenneta.

## 3. Kanoniset ravintotekijät ja nykyisen mallin raja

Kanoninen normalisointitavoite on grammoina per 100 g syötävää osaa: saatava hiilihydraatti **ilman kuitua ja polyoleja**, kuitu, tunnetun kattavuuden polyolisumma, proteiini ja kokonaisrasva. Lähteen oma hiilihydraattihavainto säilyy aina tämän rinnalla. Tuntematon määritelmä => HOLD.

Nykyisen `site/scripts/nutrition-model.ts`-mallin enumit eivät yksin ole kansainvälinen komponenttisanasto:

| Nykyinen kenttä / toiminta | Ehto adapterille |
|---|---|
| `EU_AVAILABLE` | Malli pitää syötettyä hiilihydraattia jo ilman polyoleja; ei vähennä polyoleja uudestaan. Pelkkä lähteen sana available ei riitä tämän valintaan. |
| `EU_TOTAL_INCLUDING_POLYOLS` | Lähde-CHO sisältää polyolit mutta ei kuitua. Malli vähentää tunnetun P:n kerran. Kuitua ei vähennetä tästä. |
| `US_TOTAL_INCLUDING_FIBRE` | Ei yleinen by-difference-luokka. Vain dokumentoidusti kuitua ja mallin edellyttämän polyolijoukon sisältävään kokonaisuuteen; mallin fibre/P-vähennykset eivät saa muuttaa lähteen määritelmää. |
| `UNKNOWN` / basis `unresolved` | Ei hyväksyttyä neljän luvun laskentaa. |
| `polyolsSourceVerified`, `polyolsEvidence` | Nimenomainen lähdehavainto ja menetelmän kelpoisuus; puuttuvaa tai loogista nollaa ei hyväksytä automaattisesti. |
| `componentValues` / `componentIds` | Nykyinen toteutus validoi Fineli-koodit CHO 2034/FIBT 2168/POLYL 2260. **Frida 244, CIQUAL 34000 tai muut vieraat koodit eivät kuulu näihin kenttiin.** Lähdekoodit säilytetään ehdotetussa skeemassa, hyväksytty adapteri tuottaa `per100g`-arvot ja erillisen provenienssin. |
| `totalCarbohydrate` | Projektin näytettävä kokonais-CHO = normalisoitu saatava CHO + kuitu + polyolit. Tämä ei ole jokaisen lähteen TOTALCAR-kenttä. Kaikkien kolmen pitää olla tunnettuja. |
| `WITHHELD_SOURCE_INCOMPLETE` | Kaikki neljä julkista arvoa pidätetään ja syy säilyy. Tuonti ei palauta vanhoja arvoja automaattisesti. Myös tarkkoihin historiallisiin evidence-hasheihin sidotut pidätykset säilytetään. |

Tämä kartoitus ei muuta nykyisen mallin arvoja tai rajapintaa. Jos valittu lähdemääritelmä ei sovi siihen, tietue jää tutkimukseen eikä semantiikkaa pakoteta lähimpään enumiin.

## 4. Lähdekohtainen kenttäkartta

Lähteiden versiot, viralliset määrittely- ja lisenssilinkit: [sources.json](sources.json). Havaitut näytekohtaiset tilat ja menetelmät: [pilot-review.json](pilot-review.json). Raakahavainnon alkuperäisen otsikon/koodin säilytys on pakollinen myös käännöksen rinnalla.

| Lähde | Hiilihydraatti, kuitu ja polyolit | Proteiini / rasva ja adapteripäätös |
|---|---|---|
| NEVO 2025/9.0 | `Carbohydrate available`: sisältää polyolit, ei kuitua. `Fibre dietary total` erillinen. `Polyols total` ja sen lähde-/menetelmäkoodi säilyvät. Ehdokas mallin `EU_TOTAL_INCLUDING_POLYOLS`-polulle vain tunnetulla, hyväksyttävällä P:llä. | `Protein total`, `Fat total`. Menetelmä voi olla reseptilaskenta tai lainattu, ei automaattisesti analyysi. 17 näytteen P=0:sta 13 logical-zero, 4 tarvitsee menetelmän lisäselvityksen; kaikki toistaiseksi HOLD laskentakäyttöön. |
| Thai FCD | `CHOAVLDF`: 100 − vesi − proteiini − rasva − kuitu − tuhka. `CHOCDF` ei vähennä kuitua. Ei keskinäistä fallbackia ilman tarvittavaa kuituhavaintoa ja menetelmää. P ei näytteissä raportoitu. | `PROTCNT`, `FAT`, `FIBTG`. Polyolit, kaupallinen lupa ja PDF-version ristiriita estävät täydellisen malliadapterin. `CHOAVLDF`-nimestä ei päätellä polyolien puuttumista. |
| MEXT | `利用可能炭水化物（質量計）` massapohjainen ehdokas. `利用可能炭水化物（単糖当量）` monosakkaridiekvivalentti, `差引き法による利用可能炭水化物` erotusmenetelmä ja `炭水化物` laaja erotus-CHO ovat erillisiä havaintoja. `食物繊維総量` kuitu, `糖アルコール` P. Ei valita ensimmäistä saatavilla olevaa CHO-lukua. | `たんぱく質` kokonaisproteiini erillään aminohappokoostumuksen proteiinista. `脂質` kokonaisrasva erillään TAG-ekvivalentista. Massa-CHO:n ja P:n kattavuus varmistetaan valitulle tietueelle ennen enum-valintaa. `-`, Tr, arvioidut sulkeet säilyvät. |
| CoFID 2021 | `CHO` monosakkaridiekvivalentteina; `AOACFIB` ei sama kuin `ENGFIB` (NSP). Proximates-sheetissä ei aggregaattipolyolisaraketta. Ei sellaisenaan massapohjaiseen CHO:hon. | `PROT`, `FAT`. Oppaan s.16 yleinen CHO/1.05 sisältää poikkeuksen tärkkelys-/oligosakkaridipainotteisille ruoille; tärkkelyksen oma kerroin 1.10. Ei yleistä jaa-kaikki-1.05 -adapteria. Komponenttikohtainen muunnos tai HOLD, lisäksi ID-karanteeni. |
| Frida 5.5 | `170` total by difference; `172` available =170−kuitu; `318` labelling = sokereiden+tärkkelyksen summa **tai dokumentoitu fallback** erotusmenetelmään käyttäen label-proteiinia. `168` kuitu; `244` sugar alcohol sum. `318`-nimestä ei päätellä yhdenmukaista menetelmää. | `218` protein vs `317` protein labelling, `141` fat. `237` sorbitoli, `188` mannitoli ja `445` ksylitoli eivät yksin muodosta varmennettua koko P-summaa. Näytteiden 14/716/740 blank 244 estää täydellisen laskennan. |
| CIQUAL 2025 | `31000` glucides sisältää polyolit, ei kuitua. `34100` kuitu. `34000` polyolit **ei sisällä erytritolia** (ohje 3.3.5). Ei yleinen kaikki-polyolit-kenttä. Energiassa käytetyt oletusnollat eivät ole julkaistuja luotettavia P-havaintoja (3.3.6). | `25000` Jones-proteiini, `25003` N×6.25, `40000` rasva. P-joukon rajaus on ratkaistava etenkin Foodin-erytritolia sisältävissä resepteissä; yksittäistä komponenttia ei korjata eri tuotteen yleisluvulla. Puuttuva/`<` ei nolla. |
| Ruotsi | Saatava CHO ja kuitu säilytetään erikseen; native komponentti-ID:t ja aggregaattipolyolien kattavuus eivät riittävästi varmennettuja tässä pilotissa. | Native-adapteri DEFERRED. Ei hyväksyttyä normalisointikaavaa tai automaattista P0:aa. |
| Norja | Tavallisesti sokeri+tärkkelys, osa lähteistä erotusmenetelmällä. Menetelmäkohtainen alkuperä säilyy. Tarkistetussa nutrient-katalogissa ei löytynyt P-aggregaattia. Nolla voi tarkoittaa alle määritysrajan. | N-kertoimet ja rasvan menetelmä erillään; ei FA-osien summasta keksittyä kokonaisrasvaa. Native-adapteri DEFERRED. |
| IFCT / Korea | Tarkka native-kenttäkartta, ajantasaisen Korean version tunnisteet ja käyttöoikeus eivät valmiita. | DEFERRED, eivät ensimmäisen toteutuksen lähteitä. Tässä ei luvata näille toimintakykyistä adapteria. |

Esimerkki määritelmäerosta: MEXT 17045:n saatavan hiilihydraatin massaluku 11.8, monosakkaridiekvivalentti 11.9 ja erotusmenetelmä 18.5 ovat eri havaintoja, eivät korvattavia pyöristysversioita (g/100 g). Polyolit ovat `-`. Kentän läsnäolo tai yksi hyvä CHO-luku ei siten tuota neljää julkaistavaa reseptiarvoa.

## 5. Massa, tila ja reseptisidos

- Säilytä lähteen määrä ja yksikkö: 100 g edible / as-sold / prepared / 100 ml / kuiva-aine. Ei oletusta, että nesteen 100 ml =100 g. Jos tiheys puuttuu, ml→g jää HOLD-tilaan. Kuiva-ainepohja vaatii kosteuden ja kaavan samasta määritellystä tuotteesta.
- Säilytä laji, kasvin/eläimen osa, kuori/luu, raaka/keitetty/paahdettu/kuivattu/valutettu, rasva-/suola-/sokeripitoisuus ja tuotenimi. Ruokaryhmä tai käännöksen nimiosuma ei ole vastaavuus.
- Reseptin g/kg-määrä on suora massamuunnos. `kpl`, tl, rkl, dl ja ml vaativat ainesosa-/tuotekohtaisen muunnosnäytön. Kuoreton kananmunamassa ei seuraa tietokannan per 100 g-arvosta.
- `edibleFraction` ja `retainedFraction` tarvitsevat omat perustelunsa. Arvo 1 ei ole oletus. Kypsän tietueen käyttö ja raaka-ainemassan hävikki eivät saa laskea samaa muutosta kahdesti.
- Sidotaan `recipe_id` + nykyisen `recipeNutritionInputHash`-funktion input-hash (annokset ja järjestetyt amount/unit/item/note-rivit) + main-SHA. Tämä hash ei ole koko Markdown-tiedoston hash. Säilytetään myös evidence/batch/source-payload-hashit ja laskentamenetelmän versio.
- Jokainen laskentarivi viittaa muuttumattomaan `record_revision_id`:hen ja valittuihin havaintoihin. Ei latest-linkkejä. Reseptin tai lähdearvojen muutos invalidioi vanhan hyväksynnän ja vaatii uuden laskenta-arvion.
- Eri lähteiden ruokia tai saman ruoan P:tä ei yhdistetä automaattisesti. Mahdollinen kenttäkohtainen yhdistelmä vaatii täsmällisen tuote-, tila-, basis- ja määritelmävastaavuuden sekä jokaisen havainnon provenienssin; muuten HOLD.

## 6. Hyväksyntä, toistettavuus ja legacy

Ehdotettu yksisuuntainen kulku:

1. Oikeudet tarkistettu kyseiselle käytölle → sallittu yksityinen raakakopio+hash → paikallinen SQLite staging. Raakakopion oikeus arvioidaan erikseen julkisesta jakelusta.
2. `CANDIDATE` → määritelmä-, yksikkö-, nolla-, ID- ja tilatarkistus → `HOLD` / `REJECTED` / `RECORD_ACCEPTED`. Päätös sisältää tarkistajan, ajan, ehdot ja täsmälliset revisiot.
3. Erillinen reseptin ainesosavastaavuus ja massa-/hävikkinäyttö → paikallinen laskenta. `AUTOMATED ONLY` ei vaihdu ihmishyväksynnäksi itsestään.
4. Katselmoitu laskenta ja manifesti → hyväksytty vientipaketti. Manifestissa rivimäärät, semanttiset komponentit, lähde-/adapteri-/skeemaversiot, sisältö-SHA ja oikeusrajaukset. Identtinen uusintatuonti no-op; samalle avaimelle eri payload => pysäytys/erillinen uusi snapshot. Kahden samannimisen lähderuoan automaattinen yhdistäminen kielletty.
5. Vasta erikseen hyväksytyssä myöhemmässä vaiheessa paketin tuonti stage-D1:een, palautettavuus ja vientivertailu. D1:stä staattisen julkaisun snapshot, ei selaimen tietokantahakuja. Git pysyy laskennan masterina vaiheissa 1–3; omistajuuden vaihto vasta PR #172:n vaiheen 4 nimenomaisella päätöksellä. Ei kahta rinnakkaista muokattavaa masteria.

Legacy: lähtötilanteessa 261 reseptissä on neljä arvoa, mutta 55 reseptin 220 arvolta puuttuu laskentanäyttötiedosto. Ne eivät muutu hyväksytyiksi tiedoiksi, kun formaatti tai tallennuspaikka vaihtuu. Tuleva skeema säilyttää ne tarvittaessa erillisessä `LEGACY_UNVERIFIED`-julkaisuhistoriassa. Uusi hyväksytty dataset sisältää vain todennetut laskennat; vanhan julkaisun näkyvyyden/poistamisen ratkaisu tehdään erikseen, ei tässä dokumentaatiotyössä. Puuttuvat 65 ja mahdolliset `WITHHELD_SOURCE_INCOMPLETE`-pidätykset säilyvät puuttuvina, kunnes uusi näyttö on hyväksytty.

Varmistusrajapinta: vientiin liitetään resepti-/lähde-/oikeus-/skeema-/adapteriversiot, SHA:t ja manifesti. Ne yhdistyvät PR #172:n D1-vientiin, yksityiseen R2:een ja salattuun Cloudflaren ulkopuoliseen kopioon vain oikeuksien sallimassa laajuudessa. Julkisen kuvabucketin mediaa ja yksityistä lähde-/varmistusaineistoa ei sekoiteta. Tässä työssä ei luoda tietokantaa tai bucketia, siirretä aineistoa R2:een eikä toteuteta varmistuksia.

## 7. Vaiheen 1 hyväksymisehdotus

Omistajan päätökseen sidotaan tämän PR:n lopullinen commit sekä README:n päätöstaulukko: ehdotettu skeema ja puuttuvuussäännöt, lähdekohtaiset HOLD/DEFERRED-rajaukset, ei hyväksyntää loogisille polyolinollille yleissääntönä, CoFID-ID-karanteeni, reseptin versiosidos, legacy-erottelu ja rajattu vaiheen 2 paikallinen pilotti. Ehdollisten lähteiden ei tarvitse muuttua tuotantokelpoisiksi vaiheen 1 sulkemiseksi: niiden rajaus ulos ensimmäisestä hyväksytystä laskentadatasta on nimenomainen päätös.

Hyväksyntä ei tarkoita SQL:n tai importer-koodin olemassaoloa, uusien ravintoarvojen hyväksymistä, D1-masterin vaihtoa tai lupaa aloittaa Cloudflare-siirtoa. Fyysinen skeema, avaimet ja idempotenssi osoitetaan myöhemmin paikallisessa vaiheessa 2 ennen stage-pilottia.
