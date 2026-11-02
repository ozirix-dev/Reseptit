# GK-SCENARIOS-01: keto-mutakakun eristetty tuotepilotti

**Eristetty tutkimuspilotti COMPLETE; koko kakun GK-vaihteluväli NO-GO / HOLD.**
Päiväys 2.11.2026, Europe/Helsinki. Tuotantoon ei lisätä tuloksia.

## Rajaus ja omistajuus

- Rooli ja ainoa kirjoittaja: **Codex 3 / GK Scenario Developer**.
- Repo: `ozirix-dev/Reseptit`, origin `https://github.com/ozirix-dev/Reseptit.git`.
- Oma worktree: `D:/Projects/tmp/reseptit-gk-scenarios-chocolate-pilot`.
- Oma haara: `codex/gk-scenarios-chocolate-pilot`.
- Lähtö-main: **`92dc6dbe7b27e145d6938026c73b6823f2e2108f`**, etä-mainista tarkistettu ennen worktreen luontia.
- Viimeistelyssä nykyinen main `96a25d8c9db6fb0a505a70a37a5b357b6a83593a` (#185) varmennettiin uudelleen. GK149-apurin muutos koskee Foodin-lähdesidonnan varmennusta, ei laskentakaavaa. Guardin konfliktiton yhdistelmäpuu ja mainin apurit tarkistettiin erillisessä disposable-kopiossa; haaraa ei synkronoitu eikä muiden haarojen sisältöä muutettu. Tarkka varmennus alla.
- Viimeistelyn kirjoitusvastuullinen: **Codex 3 / GK-SCENARIOS-01 viimeistely**, istunto `01a19dfb-dc25-7292-9a91-d58514144c51`. Käyttäjän jatkotehtävä jatkaa saman nimetyn roolin vastuuta. Lähtö-HEAD `c05609b9defb4c939f46344918d89c50ad6b213a`; etä-HEAD, Draft-tila ja puhdas työpuu tarkistettiin ennen kirjoituksia. Valtuus: rajatut pilotin UI-korjaukset, tekninen katselmointi, loppuraportti, PR-kuvauksen päivitys ja Ready-siirtymä porttien täytyttyä. Ei mergeä, deployta tai toista PR:ää. Lopullinen HEAD ja sen CI sidotaan PR-kuvaukseen ja luovutukseen.
- Avoimet PR:t ja paikalliset haarat tarkistettiin: vastaavaa skenaariototeutusta ei ollut. #118, #182, muiden tutkimushaarat, kuusi lukittua A-versiota, pad see ew -aineisto, #183:n historialliset hashit ja ReportHub jäivät koskematta.
- `repo_guard check/write/commit/push/pr` sitoo kaikki kirjoitukset tähän repoon. Omat riippuvuudet asennettiin vain tämän worktreen `site/node_modules`-hakemistoon.
- Viimeistelyn aktiivinen chat-malli varmennettiin oman istunnon `turn_context`-metatiedosta: `gpt-6.1-sol`, effort `high`; myös käyttäjän config-oletus on Sol / High. Alkuperäisen toteutusajon mallivarmennuksen puute on historiallinen huomio, ei nykyisen ajon tila.

[PR #118:n suunnitelma](https://github.com/ozirix-dev/Reseptit/pull/118), luettu commitista `0346e0facbbd62105b424e5cb8fe0c18bcc51731`, antaa tuloslajit, lähde- ja oletusvaihtelun eron sekä erillisen version vaatimuksen. Käyttäjän nyt valtuuttama yhden reseptin tekninen pilotti on erillinen poikkeava rajaus. **30 reseptin P0-auditointia tai koko P0–P5-ohjelmaa ei ole tehty.**

## Nykyisen menetelmän hyödyntäminen

`gk149-model.evaluate` käyttää jo `calculateGlycemicLoad`-apuria. Adapteri toistaa **vain keto-mutakakun** nykyisen laskelman ja käyttää sen ainesosapanoksia. Alkuperäisen suklaan tavallisen hiilihydraatin rivi korvataan valitun tuotteen rivillä; vanhaa suklaariviä ei lisätä uudelleen. Erillinen 80 g Foodin-erytritoli mallinnetaan omana rivinään.

`GkOnlyVariant` sisältää jo erillisen version/input-hashin, annokset, A/B-tason, pisteen, `scenarioRange`-kentän, `rangeKind`-merkityksen, poisjätöt, LOW-luottamuksen, valmistuksen, lähteet sekä oman oletusherkkyyden. `macroScope` estää alkuperäisen makropaketin perimisen.

- A käyttää nykyistä laskentaa ja sen tiukkoja **alle 1 g / ainesosa, alle 2 g yhteensä** -poisjättörajoja. Nämä eivät ole todellisen GK:n ylärajoja.
- B käyttää erikseen perusteltua analogiaa tai nimettyjä mallivaihtoehtoja; koodausmalli on merkitty. HOLD ei ole GK-numero eikä nolla. Luokka-arvio ei kasvata numeerista kattavuutta.
- `scenarioRange` tarkoittaa nimettyjä vertailuskenaarioita tai ehdollista koodausmallia, ei automaattista fysiologista epävarmuusväliä.
- Vanhan `glycemicLoadRangePerServing`-kentän perusmerkitys on laskettavissa olevan reseptin hyväksytty hiilihydraattiskenaario; erikseen hyväksytyillä release-adaptereilla on omat rajatut semantiikkansa. Kumpaakaan kenttää ei käytetä tässä uutena GI-välinä.
- Alkuperäinen resepti, hyväksytty GK-only-versio ja uusi nimetty tuoteskenaario tunnistetaan erillisillä recipe/version/scenario-tunnisteilla. Nykyisen hyväksytyn version **0,07**, poisjättö **1,3774 g/annos** ja input-hash **`b373e5621c6c939eaec2af8c9c11cd687f0a4b0f179159b5d143d2d4141e6af3`** säilyvät. Julkinen ilmaisu säilyy *laskettu osuus alle 1*. Makrot pysyvät pidätettyinä.

Uusi `GK_SCENARIOS_01_V1` on erillinen sopimus. Tyyppi sallii POINT_ESTIMATE / EVIDENCE_BOUNDED_RANGE / CONDITIONAL_SCENARIOS / CLASS_ONLY / UNAVAILABLE. Tämän aineiston laskuri tuottaa ainoastaan ehdollisia **komponenttien osasummia** ja kokonaisarvon UNAVAILABLE-tilan. Tuleville POINT/RANGE/CLASS_ONLY-arvoille ei ole automaattista hyväksymisreittiä.

## Tuotteet ja koostumuserot

Lähteet tarkistettiin 2.11.2026. [pilot.json](pilot.json) säilyttää valitut alkuperäiset kentät, määritelmät, paikantimet, hakutavan ja lähde-/syötehashit. Valmistajan tällä hetkellä saatavilla oleva sivu ei todista tietyn pakkauksen tai erän koostumusta.

| Skenaario ja valmistajan lähde | Etiketin CHO / polyolit, g/100 g | Kerran vähennetty tavallinen CHO | Huomio |
| --- | ---: | ---: | --- |
| [Torras Dark chocolate, Art.557](https://chocolatestorras.com/en/dark-chocolate/) | 48 / 45 | 3 | Ainesosissa maltitoli ainoana polyolina. Sivun SKU556 ja kuvauksen Art.557 eroavat: pakkausvarmistus puuttuu. |
| [Torras Negro 60% Stevia, Art.40, EAN8410342007032](https://chocolatestorras.com/stevia-negro/) | 34 / 29 | 5 | Erytritoli + stevioliglykosidit. Sama tuote kattaa erytritoli- ja stevia-tyypit; niitä ei lasketa kahdeksi tuotteeksi. |
| [Wawel No Added Sugar Dark Chocolate 70%, EAN5900102013067](https://www.wawel.com.pl/karta-produktu?id=5900102013067&lang=en_UK) | 34 / 29 | 5 | Valmistajan indeksoitu tuotekortti, mutta suora lataus antoi 404:n. Erillinen lähdesaatavuus-HOLD. Sokeri0,8 + tärkkelys0,7 ei selitä koko tavallista CHO:ta; erotusta ei pyyhitä pois. |
| [AFCD F009837](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F009837) | without4,1 / with32,1; kokonaispolyolit tuntemattomat | 4,1 | Vertailukoostumus, ei ostettava nimetty tuote. |

Torras- ja Wawel-tuotteissa ilmoitettu polyolien kokonaismäärä kohdistetaan ainesosaluettelon ainoalle nimetylle polyolille **näkyvänä etikettiallokaatio-oletuksena**, ei lajin erillisenä laboratoriomittauksena. Etiketin kuitua ei vähennetä EU-hiilihydraatista. Puuttuvaa lajia tai määrää ei nollata.

## AFCD F009837:n tulkinta

Kolme virallista Release 3 -työkirjaa ladattiin omaan disposable-lähdevälimuistiin ja hashit varmistettiin. Uuteen PR:ään ei kopioida työkirjoja eikä koko tietokantaa. Työkirjojen URL:t ja SHA256:t ovat lähdetietueessa.

- `Nutrient details / Proximates!G38:H39`: without on saatavien hiilihydraattien summa ilman polyoleja. Yleisen with-yhtälön polyolilisät ovat sorbitoli, mannitoli ja glyseroli. Erytritoli, maltitoli ja ksylitoli ovat erillisillä riveillä. Joitakin CHO-havaintoja on saatu etiketeistä tai erotusmenetelmällä.
- `Nutrient profiles / All solids & liquids per 100 g`, rivi1307: without4,1, with32,1; maltitoli28,0, ksylitoli3,6, erytritoli3,8. Muut kolme lajikenttää ovat tyhjiä.
- `Food details!E1307:F1307`: useita makeutusjärjestelmiä edustava kahdeksan näytteen koostekoostumus vuodelta2020, neljä brändiä. Se ei ole yhden nykyisen suklaalevyn etiketti.

**32,1 − 4,1 = 28 on vain parikenttien erotus.** Nimettyjen lajien osasumma on35,4. Niitä ei yhdistetä 28+35,4:ksi eikä kumpaakaan nimetä kokonaispolyoliksi. Without4,1:stä ei vähennetä polyoleja uudelleen. Numeroinen vastaavuus maltitoli28:aan on havainto; käytettävissä olevat kenttämääritelmät ja näytetausta eivät osoita sen laskentasyytä. Erotus/etikettimenetelmä ja koosteen tausta ovat mahdollisia menetelmällisiä konteksteja, eivät todistettu selitys ristiriidalle. Alkuperäistä laboratoriokohtaista laskentaketjua tai FSANZ:n täsmennystä tarvitaan ennen kokonaisuuden täsmällistä tulkintaa.

Lähdearvoja saa käyttää juuri ilmoitettuina havaintoina ja rajattuina tutkimussyötteinä. Lajiosuuksien additiivinen vastearvio jää ehdolliseksi; puuttuva kokonaispaneeli estää kokonais-GK:n.

AFCD-attribuutio: © Food Standards Australia New Zealand, AFCD Release3. Valitut faktat ja huomautukset; CC BY-SA3.0 Australia / [FSANZ Data User Licence Agreement](https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd/datauserlicenceagreement). Australian aineisto, tuotekohtainen vaihtelu ja alkuperäisen aineiston rajoitukset säilyvät. FSANZ ei ole hyväksynyt tätä sovellusta.

## GI-näyttö ja käyttötapa

| Lähde | Aine/valmistemuoto, annos ja tutkimusjoukko | Havainto ja epävarmuus | Pilotin päätös |
| --- | --- | --- | --- |
| [Livesey2003, DOI10.1079/NRR200371](https://doi.org/10.1079/NRR200371) | Katsauksen eristetyt polyolit vesi-/teeliuoksissa; yhdistelmä terveiden ja diabetesta sairastavien tutkimuksia, pääosin10–50 g. Tarkat tutkimuskohtaiset annokset taulukossa4. | Glukoosi100: maltitoli35 (SD9,9 tutkimusta), ksylitoli13 (SD4,6), erytritoli0 (SD17,4). n tarkoittaa tutkimuksia. | Kertoimet vain ehdolliseen ainekohtaiseen siirtomalliin. SD:t eivät muodosta rajoja. Katsauksen suklaavertailut eivät vastaa nykyisiä tuotteita. |
| [Pelletier1994, PMID8001718](https://pubmed.ncbi.nlm.nih.gov/8001718/) | Maltitoliliuos ja maltitolisuklaa, terveet, glukoosiviite. Abstrakti ei anna tarkkaa annosta, n:ää tai epävarmuuslukuja. | Pienempi glykeeminen vaste, suklaan insuliinivaste jää korkeaksi. | Alkuperäistutkimuksen laadullinen tuki. Ei arvattuja annoksia tai siitä poimittua uutta GI-numeroa. |
| [Wölnerhanssen2016, DOI10.1152/ajpendo.00037.2016](https://doi.org/10.1152/ajpendo.00037.2016) | 10 normaalipainoista +10 lihavaa; ksylitoli50 g, erytritoli75 g, glukoosi75 g, vesi300 ml, nenämahaletku. | Erisuuret makeudeltaan vastaavat annokset; mahalaukun tyhjeneminen ja hormonivaste. Ei sellaisenaan standardoitu tuotteen GI. | Laadullinen tuki, ei suklaan tai kakun kerrointa eikä numeerista väliä. |
| [Noda1994, PMID8039489](https://pubmed.ncbi.nlm.nih.gov/8039489/) | Terveet, erytritoli0,3 g/kg suun kautta, sama glukoosiannos vertailuna. | Glukoosi-/insuliinivasteen ja poistumisen alkuperäistutkimus; numeerista GI:tä ei poimittu. | Laadullinen tuki, ei puuttuvan GI:n korvaavaa nollaa. |

Siirrossa käytetään **koko ilmoitettua polyolimassaa × tutkimuskerroin /100**. Imeytymiskerrointa tai puolittamista ei lisätä tämän päälle. Puhdasta maltitolia, maltitolisiirappia ja kokonaisen suklaan GI:tä ei vaihdeta keskenään. Tuotteen mitattua GI:tä ei saa kertoa pelkällä without/residuaali-CHO:lla ilman tutkimuksen hiilihydraattinimittäjän vastaavuutta. Erytritolin0 on eksplisiittinen tutkimuskerroin, ei tarkka biologinen nolla. Muista polyoleista ei luoda tässä uusia kertoimia.

## Pilotin toistettavat tulokset

8 annosta, suklaata150 g, erillistä erytritolia80 g. Muut ainesmäärät ovat nykyisen hyväksytyn **punnitun laskentaversion** määrät: mm. kuoreton muna165 g, kaakao10 g ja vaniljauute4,2 g. Ne eivät väitä alkuperäisten tilavuusmittojen yleisiä muunnoksia. Nykyinen pyöristämätön laskettu osuus on0,0669375; alkuperäinen hyväksytty0,07 säilyy.

| Tuoteskenaario | Ehdollinen osasumma / annos | Tavallinen CHO ilman soveltuvaa GI:tä, g/annos | Koko kakku |
| --- | ---: | ---: | --- |
| Torras maltitoli | 3,0200625 | 1,17115 | UNAVAILABLE / HOLD |
| Torras erytritoli–stevia | 0,0669375 | 1,54615 | UNAVAILABLE / HOLD |
| Wawel maltitoli, lähdesaatavuus-HOLD | 1,9700625 | 1,54615 | UNAVAILABLE / HOLD |
| AFCD:n nimetyt polyoliosuudet | 1,9921875 | 1,37740 | UNAVAILABLE / HOLD |

Torrasin maltitolituotteen polyolitermi on2,953125; erytritolituotteen termi on ehdollisella nollakertoimella0. **Tämä ero koskee vain mallinnettua polyolitermiä**, ei todistetusti koko kakun GK-eroa. AFCD:n osatermit ovat maltitoli1,8375 ja ksylitoli0,08775. Erillinen erytritoli10 g/annos pidetään erillään suklaan lajeista.

Yksikään osasumma ei sisällä tuntemattomien vaikutusten varmaa rajaa. Osasummien min/max ei ole reseptin GK-väli; luokkavarmuutta ei voida osoittaa. Kaikki positiiviset tavallisen CHO:n poisjätöt näkyvät. Myös muiden ainesosien kokonaispolyolit jäävät tuntemattomiksi. Aiempi havainnollistus2,7 ei ollut tavoite eikä testiodote.

**Uudet kokonais-GK:n numeeriset ehdokkaat0; lähdekelpoiset kokonais-GK-ehdokkaat0; julkaistut tulokset0.** Neljä toistettavaa ehdollista osatulosta kuuluu yhteen reseptiin: kolme nimettyä tuotetta ja yksi vertailukooste. Kahden Torras-vaihtoehdon koostumus saatiin suoraan valmistajalta; Wawelin tuore saatavuus jää avoimeksi. GK80-kattavuusmuutos0.

## Käyttöliittymä, uudelleenkäyttö ja varmennus

`site/previews/gk-scenarios.html` on eristetty HTML-prototyyppi, joka käyttää sivuston olemassa olevaa CSS:ää ja CLI:n aitoa tulosobjektia. Sitä ei importoida tuotantoreitteihin. CLI tuottaa esikatselun vain ignored-`tmp`-hakemistoon. Noindex, ei kanonikaalia, JSON-LD:tä tai ravintoarvomerkintöjä. FI/EN/SV/TH ovat koneavusteisia luonnoksia, eivät ihmisen tarkistamia. Lähdemuistiinpanot säilyvät alkuperäiskielisinä.

Tuotteen vaihto ei muuta alkuperäistä reseptiä, annoksia tai makroja. Valmistettavien annosten8→16 muutos skaalaa150→300 g suklaata ja80→160 g erillistä erytritolia; annoskohtaiset tulokset sekä lähde-/versiohashit säilyvät. Virheellinen annosluku poistaa numeerisen tuloksen näkyvistä, joten vanhan tuotteen tulos ei jää uuden valinnan alle.

[dependencies.json](dependencies.json) on nykyisen mainin FI-julkaistujen ainesosametatietojen lukuseula: **50 uniikkia ehdokasta**,29 polyoleja,2 keto-/VHH-suklaareseptiä ja23 eksplisiittistä `tai`-vaihtoehtoa. Ryhmät menevät päällekkäin. Samat2 reseptiä ovat keto-mutakakku ja keto-suklaakeksit; niiden yleinen sokeriton suklaa voi käyttää samoja todellisia koostumusvaihtoehtoja. Muiden tuotteiden todellisia koostumuseroja ei vielä lähdevarmistettu. Koko vaihtoehdon GI-/valmistusnäyttö puuttuu **tämän pilotin uudesta lähdepaketista kaikille50:lle**; tämä ei väitä niiden vanhoja hyväksyttyjä arvioita puuttuviksi eikä kirjallisuutta tyhjäksi. Uusia lähdekelpoisia kokonaisnumeroita menetelmä avasi nyt0. Seula ei ole täydellinen semanttinen korvattavuusauditointi.

Varmennus:14 kohdennettua testiä, rajattu TypeScript-tarkistus ja itsenäinen Decimal-rekonstruktio PASS. Brave/Playwright:4 tuotetta ×4 kieltä ×3 leveyttä (1280/768/375), yhteensä48 valintatarkistusta PASS; skaalaus, puuttuvuus, syötteen muuttumattomuus, virheelliset annokset ja sivuttaisylitys tarkistettu. Alussa löytyneet annosvirheen vanha tulos ja mobiilin valikon ylivuoto korjattiin ja tarkistettiin uudelleen.

Koko projektin ensimmäinen `tsc -p tsconfig.json` pysähtyi uuden worktreen puuttuviin generoituviin tuotantomoduuleihin. Pilotin oma tyyppitarkistus läpäisi. Näitä moduuleja ei generoitu massalaskennalla; 326 reseptin laskentaa,721 sivun buildia, Actions-uusintoja tai tuotantotestausta ei ajettu. Tarkistukset eivät ole tuotantojulkaisun hyväksyntä.

Toista omassa varmennetussa checkoutissa, `site`-hakemistosta:

```powershell
npx tsx --test tests/gk-scenarios.test.ts
npx tsc -p tsconfig.gk-scenarios.json --noEmit
npx tsx scripts/gk-scenario-pilot.ts
python scripts/gk-scenario-decimal.py
npx tsx scripts/gk-scenario-dependencies.ts
```

Esikatselu: palvele ainoastaan `tmp/nutrition/gk-scenarios-01`-hakemistoa loopback-osoitteessa. Playwright CLI:n `run-code --filename site/previews/gk-scenarios.browser-check.cjs` (absoluuttinen polku, avattu esikatselusivu) toistaa selainvarmennuksen. [verification.json](verification.json) sisältää tarkistustuloksen ja versiosidonnan.

## Erilliset päätökset

| Kohde | Päätös | Jatkovaade |
| --- | --- | --- |
| Polyolien mallinnus | **CONDITIONAL GO** | Lajit ja massaperuste voidaan erottaa turvallisesti tutkimuksessa. GI-siirto, etikettiallokaatio ja AFCD:n puutteellinen kokonaisuus jäävät oletuksiksi. |
| Tuotekohtaiset GK-skenaariot | **CONDITIONAL GO** | Nimetyt, hash-sidotut osasummat ja HOLDit toimivat. Ei hyväksyttyjä koko kakun tuotenumeroita. |
| Perusteltu numeerinen GK-vaihteluväli | **NO-GO** | Puuttuvat tuotteen/valmistuksen GI-sidonnat ja kokonaiskattavuus. SD/SEM tai skenaarioiden ääripäät eivät ratkaise niitä. |
| Käyttöliittymäpilotti | **GO eristettyyn katselmointiin** | Ei tuotantoon. Kielentarkistus ja lukijoiden ymmärrettävyystesti ennen julkaisuharkintaa. |
| Laajentaminen muihin resepteihin | **CONDITIONAL GO** | Ensin keto-suklaakeksien erillinen lähde- ja valmistustarkistus; sen jälkeen rajatut polyoli-/tuotevaihtokohteet. Ei massalaskentaa tai kattavuuden automaattista korotusta. |

Ennen tuotantokytkentää tarvitaan erillinen julkaistavan esityksen sisältöpäätös. Fyysisen pakkauksen tunnistus, Wawelin saatavuus, valmiin tuotteen GI:n vastaavuus, AFCD:n laskentaketjun täsmennys sekä neljän kielen toimituksellinen tarkistus ovat todelliset avoimet riskit.


## Viimeistely ja teknisen pilotin sulkeminen

**COMPLETE koskee eristettyä tutkimusprototyyppiä.** Polyolimallin käyttö pysyy ehdollisena; koko reseptin numeerinen GK-vaihteluväli on edelleen **NO-GO / HOLD**. Uutta tutkimusajoa tai aiempien tutkimusaineistojen massapäivitystä ei tehty. AFCD F009837:n ristiriita ja Wawelin 404-HOLD jäävät samoiksi lähdehuomioiksi.

Tarvittavat korjaukset rajautuivat esikatseluun ja sen olemassa olevaan selaintarkistukseen:

- Kaikki näkyvät GK-osuudet pyöristetään: esimerkiksi `3,0200625` → *noin 3,0*, `1,9700625` → *noin 2,0*, positiivinen `0,0669375` → *alle 0,1*. Myös avattavan laskentarivitaulukon GK-soluissa käytetään samaa esitystä. Tarkat luvut pysyvät tutkimusdatassa.
- Alkuteksti kertoo heti koko kakun arvon puuttuvan ja vertailun koskevan ehdollisia laskentaosuuksia. Näkyvä selite erottaa osasummien ääripäät koko kakun vaihteluvälistä. Polyolikertoimien siirto kakkuun säilyy tutkimusoletuksena. HOLD nimetään tietoiseksi näytön rajaukseksi.
- Tulosalue tyhjennetään ennen tuotevalinnan käsittelyä. Puuttuva tai tuntematon tuote ei enää voi jättää edellisen tuotteen numeroa näkyviin. Lähdesidonnan epäonnistumisen UNAVAILABLE-tulos ei palauta vanhaa osasummaa. Lähteet pysyvät valitun tuotteen omissa sidonnoissa.

Jo kunnossa olivat neljä erillistä skenaariota, lajikohtaiset polyolitermit, EU-hiilihydraatin kerran tehtävä vähennys, AFCD-without-kentän käyttö, syöte- ja lähdehashit, annosskaalaus sekä eristys tuotannosta. Laskentakoodia, lähdepakettia, alkuperäisreseptiä tai makroja ei muutettu. Hyväksytty laskettu osuus **0,07**, pois jätetty CHO **1,3774 g/annos**, hyväksytty input-hash sekä makrojen pidätys säilyvät.

Nykyisen mainin yhteensopivuus varmennettiin näin:

- Guardin `sync-main`-esitarkastus: ei konflikteja; lähtö-HEADin ja mainin yhdistelmäpuu `6411fd8351cf718e60af9fd627011c6973b2427c`.
- Tämä Git-puu vietiin disposable-hakemistoon `D:/Temp/gk-scenarios-final-01a19dfb/compat-main`. Päivitetty esikatselu kopioitiin siihen. Mainin `gk149-model.ts` ja uusi `gk-foodin-binding.ts` olivat mukana oikeina tiedostoina, eivät mockeina. Yhteinen `node_modules` oli vain riippuvuuksien lukukohde; tulokset kirjoitettiin disposable-kopion omaan `tmp`-hakemistoon.
- Samassa yhdistelmässä **14/14 kohdennettua testiä PASS** ja pilotin TypeScript-tarkistus PASS. Yhden reseptin CLI varmisti lähdesidonnat ja säilytettävien tiedostojen hashit. Tulos-JSONin LF-SHA256 vastaa alkuperäistä varmennusta täsmälleen (`3413d9b47c050aa65a53a816639587068a2d3e42004697cc7a61a9b4a639882f`), joten aiemman itsenäisen Decimal-rekonstruktion kattama laskentasisältö on sama; sitä ei ajettu uudelleen.
- Päivitetyn esikatselun Brave/Playwright-tarkistus: **48/48** tuote/kieli/leveys-yhdistelmää PASS sekä uusi pyöristys-, puuttuva tuote- ja lähdevirheen näyttötarkistus PASS. Skaalaus, syötteen muuttumattomuus ja SEO-eristys PASS; ei sivuttaisylitystä. FI-näkymä tarkistettiin myös kuvasta.
- Tuotantoreitit eivät importoi prototyypin toteutusta. PR lisää vain pilotin tiedostoja; viimeistely muuttaa esikatselua, sen tarkistusta ja näitä raporttitiedostoja. Historiallinen lähdeaineisto, muut PR:t ja haarat säilyvät.

[verification.json](verification.json) erottaa alkuperäisen varmennuksen ja tämän viimeistelyn. Lopullisen commitin normaali PR-CI tarkistetaan ennen Ready-siirtymää; CI-linkki ja tarkka HEAD kirjataan PR-kuvaukseen ja loppuluovutukseen. Paikallista koko sivuston buildia, 326 reseptin massalaskentaa tai manuaalista Actions-uusintaa ei tehdä.

## Seuraava erillinen tuotanto-PR: yksi avattava suklaaselitys

**Aloitusehto:** #186 on yhdistetty ja käyttäjä on hyväksynyt julkaistavan esityksen sisältörajauksen. Tässä työssä ei aloiteta toista PR:ää. Seuraava työ on UI- ja julkaisutyö nykyisellä lähdepaketilla, ei uusi perustutkimuskampanja.

Toteutetaan vain keto-mutakakun FI/EN/SV/TH-reseptisivulle yksi avattava kohta, FI-otsikkona **Miten käyttämäsi suklaa vaikuttaa GK-arvioon?** Se sijoitetaan nykyisen GK-only-version yhteyteen omaksi selityksekseen; nykyisen hyväksytyn version esitys säilyy. Natiivi `details`/`summary`, `recipe-panel` ja sivuston nykyiset lomake- ja lähdekomponenttien käytännöt riittävät. Uutta yleistä skenaariojärjestelmää ei tarvita.

### Sisältö ja lähdeportti

- Ensimmäiset kaksi valintaa: **Torras Dark chocolate, Art.557** (maltitoli; valmistajan ilmoitus CHO48 / polyolit45 g/100 g) ja **Torras Negro 60% Stevia, Art.40, EAN8410342007032** (erytritoli + stevioliglykosidit; CHO34 / polyolit29 g/100 g). Sidonnat otetaan tämän pilotin varmennetusta valmistajalähdepaketista tuote- ja lähdehasheineen. Etikettiarvoja ei esitetä yksittäisen pakkauserän mittauksena.
- Maltitolituotteen sivun SKU556/Art.557-ristiriita merkitään sisältöpäätökseen. Jos täsmällistä tunnistusta tai julkisen numeron laskentaoletusta ei voida hyväksyä nykyisestä aineistosta, tuotevalinta näyttää perustellun selityksen ja lähdetiedot ilman ehdollista numeroa. Pakkauksen tunnistusta ei ratkaista arvaamalla eikä aloittamalla laajaa lähdehakua.
- Wawel ja AFCD-kooste eivät kuulu julkisen valitsimen ensimmäiseen versioon. Wawel jää lähdesaatavuus-HOLDiin, AFCD ei ole ostettava yksilöity tuote.
- Valitusta tuotteesta näkyvät nimi, makeutusaine, CHO ja polyolit g/100 g, hiilihydraatin määritelmä, valmistajalähde ja tarkistuspäivä, mahdollinen etikettiallokaatio-oletus sekä puuttuvat vaikutukset. Numeerinen osuus näytetään vain hyväksytyn tuotekohtaisen oletuksen yhteydessä: *ehdollinen laskettu osuus noin 3,0* tai *alle 0,1* / annos.
- Näkyvä alkuselite: koko kakun GK:ta ei voida määrittää; kyse ei ole koko kakun mitatusta eikä luotettavasti rajatusta GK-arvosta. Muiden hiilihydraattien/GI:n puuttuvuus, muiden ainesosien kokonaispolyolit sekä polyolikertoimien siirto valmiiseen kakkuun kerrotaan valinnan yhteydessä. Min/max-väliä ei muodosteta.
- Nykyinen **0,07** säilyy vain hyväksytyn version laskettuna osuutena ja nykyisessä julkisessa muodossaan *laskettu osuus alle 1*. Sitä ei nimetä koko kakun GK:ksi. Tuotevalinta ei muuta reseptin aineksia, annoksia tai makroja.

### Tekninen rajaus ja hyväksyntä

Arvioitu tiedostorajaus: `RecipePage.tsx`:n yksi vain `keto-mutakakku`-tunnisteeseen sidottu kytkentä, uusi `ChocolateGkDisclosure.tsx`, pieni kuratoitu `chocolate-gk-content.ts` (FI/EN/SV/TH-tekstit ja kahden tuotteen hyväksytty julkinen tietonäkymä), kohdennettu komponentti-/sisältötesti sekä julkaisutarkistuksen dokumentointi. Tiedostot sijaitsevat nykyisessä `site/src/features/recipes`-hakemistossa; lopullinen nimi sovitetaan silloiseen mainiin. CSS-muutos vain, jos nykyiset luokat eivät riitä.

Julkinen tietonäkymä sisältää vain hyväksytyt näyttökentät ja tutkimuspakettiin sidotut tunnisteet/hashit; koko tutkimuslaskuria tai lähdekatalogia ei tuoda selainpakettiin. Puuttuva tai vanhentunut sidonta piilottaa numeron ja jättää selityksen. Annoskoon skaalaus pitää annoskohtaisen osuuden samana ja koskee tarvittaessa vain selitteen valmistuserän määriä. Ei kytkentää GK-suodattimeen, hakemistokortteihin, ravintoarvomakroihin, kattavuuslaskentaan tai JSON-LD/rakenteiseen ravintotietoon.

Hyväksyntä vaatii kahden tuotteen erilliset lähdesidonnat, näppäimistöllä toimivan avauksen ja valinnan, oikein päivittyvän tuotteen ja lähteet, puuttuvan/vanhentuneen syötteen numerottoman tilan, rajatun annosskaalauksen sekä neljän kielen ja mobiilin tarkistuksen. Regressiotarkistus varmistaa alkuperäisen reseptin, 0,07:n lasketun osuuden, 1,3774 g:n poisjätön ja makrojen pidätyksen säilymisen sekä sen, ettei muille resepteille tai rakenteiseen tietoon tule skenaarioita. Ihmisen kielentarkistus ja julkaistavan selitteen sisältöhyväksyntä kuuluvat tähän seuraavaan julkaisuvaiheeseen.

**Toteutusarvio:** 0,5–1 työpäivää komponenttiin, kuratoituun kahden tuotteen sisältöön ja kohdennettuun tekniseen varmennukseen. Lisäksi arviolta 0,5 työpäivää kieli-/sisältökatselmointiin ja julkaisun tarkistukseen; hyväksyntöjen odotusaika ei sisälly arvioon. Jos numeron lähdeportti ei täyty, selittävä numeroton toteutus pitää työn samassa rajauksessa. Uusi menetelmätutkimus tai uusien tuotteiden hankinta vaatii erillisen päätöksen.

PR #186:n merge-hyväksyntää varten ei tarvita uusia tutkimustuloksia. Jäljelle jäävät lopullisen HEADin vihreä CI, mahdolliset katselmoinnin huomiot ja käyttäjän erillinen merge-päätös repo_guardin menettelyllä. Tuotantoversion sisältö- ja kieliportit eivät estä eristetyn pilotin sulkemista.
