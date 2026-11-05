# Reseptit PR-jonon siivous V2 5.11.2026

## Tarkistettu lähtötilanne

- Repo on ozirix-dev/Reseptit. Main on `0fa20528ffe0ca075c9e0fb54c2b388cd7d959fe`. Sen Recipe site -ajo 41965490135 onnistui.
- Avoimia PR:iä oli 60. Luokittelu kattaa kaikki 60 HEADia, GitHubin muutospolut, CI:n, katselmoinnit ja merge-tilan.
- Päätöstaulukossa on 29 rajattua arkistointi-/korvaamistapausta ja 31 säilytettävää PR:ää. Tämä yksi koottu Draft lisää lopuksi yhden PR:n.
- Tavoite 15–25 jäi toissijaiseksi yksilöllisten toteutusten, avoimien oikeellisuuskysymysten ja neljän erillisen Recipavo-suunnitelman säilyttämiselle.
- Konfiguroitu mallioletus tarkistettiin Sol Highksi. Aktiivisen chatin tarkkaa mallivalintaa ei saatu työkalumetatiedoista.

## Näyttö ja historiaviitteiden käyttö

Koneellinen liite sisältää jokaisen PR:n täydellisen HEAD-SHA:n, alkuperäisen base-haaran, kaikki muuttuneet tiedostot Git-blob-tunnisteineen, commit-sidotut tiedostolinkit, main-täsmäykset, CI-linkit ja keskustelu-/katselmointiviitteet. [Koneellinen kartoitus](pr-cleanup-v2-2026-11-05.json).

Historiallinen aineisto säilyy alkuperäisissä PR:issä ja niiden nimetyissä Git-haaroissa. Alla olevat linkit kiinnittyvät tutkittuihin committeihin. Kokonaisia vanhoja tutkimuspinoja ei kopioida tähän muutokseen. Alkuperäisten manifestien sisäiset SHA-256:t, lähteet, tarkkuusrajat, päätökset ja HOLD-perusteet löytyvät liitteen tiedostolinkeistä. Sulkemiskommentti yhdistää jokaisen PR:n tähän viitteeseen ja sen jatkopolkuun.

Luokittelu on siivouspäätös. Se ei kirjaa puuttuvaa sisältö-, menetelmä- tai julkaisuhyväksyntää. Historiallisen ehdokkaan sulkeminen ei tarkoita sen kaikkien muutosten toteutumista mainissa. Päätös-/hyväksyntähistoria luetaan alkuperäisestä PR-keskustelusta ja julkaistusta SHA-sidotusta kuitista.

## Aktiivijonon työjärjestys

1. Oikeellisuus ensin. #182:n kolmen AFCD-kentän korjaus ja #168:n US-normalisointi rajattuun regressiokatselmointiin. #133:n puuttuvat R2-korjaukset ja #169:n kaksi kookosmaidon P1-sidosta tarkistetaan alkuperäissyötteistä. #181:n kokonaispolyolien tulkinta ja #180:n makromenettely vaativat erillisen omistajapäätöksen.
2. GK-infrastruktuuri ja lähteet. #255 on recovery-/Smart Review -jatkojonon omistava PR. Käytä arkistoidun #269:n 30 reseptin työlistaa ja 61 käsittelemättömän ID:n luetteloa nyky-mainiin päivitettynä. #231:n CI/työindeksi, #242:n kuratointimalli ja #241:n uusien reseptien putki käsitellään rajattuina kokonaisuuksina. #223 + #224 säilyvät varalla, aktivointi odottaa aiempaa omistajan päätöstä.
3. Julkaisuvalmistelu. #271:n kahdeksan version julkaisu on jo toteutunut #276:ssa. Avoimeksi jäävät aidosti erilaiset #210:n EDEKA-version vaihto ja #227:n kolmen version julkaisuvalmistelu. #229:n arvioitujen välien menetelmä-/UI-sopimus käsitellään erillisenä.
4. Käännökset. #273 voidaan katselmoida ensin vähäisimmän törmäyspinnan vuoksi. Sen jälkeen #272 ja #274 sovitetaan peräkkäin. #222:n sidontavirhe ja CRLF-löydös käsitellään erikseen. Erien numerot eivät edellytä haitallisten testikonfliktien hyväksymistä.
5. Recipavo myöhemmin. #174:n SOURCE-01-tietosopimus → #172:n siirtovaatimukset ja #176:n Core-arkkitehtuuri. #178 omistaa tuote-/liiketoimintapäätökset. #243 omistaa tuotanto/staging/cutover-portit. #119:n haku-UI on erillinen käyttöliittymäkatselmointi.
6. Riippuvuudet. #116, #196, #197 ja #198 käsitellään erikseen lukitustiedoston ja nykyisen mainin kanssa. #100 odottaa kirjallista Nutriticsin API-/käyttöoikeusvahvistusta.

## Käännöserien törmäys- ja SHA-tarkistus

- #272, #273 ja #274 lisäävät kukin 30 uutta V2-rekisteriavainta. Yksikään erä ei poista tai päivitä vanhaa avainta. Uusien avainten leikkaukset ovat tyhjät kaikissa kolmessa parivertailussa. Yhteensä 90 erillistä uutta paria.
- Yhteinen tiedosto on meta/kaannokset/codex-review-evidence.json. Integroi avaimet yhdistämällä ja säilytä mainin aiemmat merkinnät. Koko tiedoston korvaaminen toisen haaran versiolla hukkaisi muiden erien tarkistukset.
- Git merge-tree -tarkistus nykyiseen mainiin onnistui #273:lle ilman tekstikonfliktia. #272 ja #274 tuottivat molemmat konfliktit tiedostoissa site/tests/assert-recipe-baseline.ts ja site/tests/static-output.test.ts. Tarkistus ei muuttanut haaroja tai työpuita.
- #272 ja #274 koskevat lisäksi hyväksyttyjen FI-reseptien snapshot-palautuksia ja yhteisiä GK-buildereita. Säilytä mainin #270:n hyväksytty translation-baseline sekä #275/#276:n tutkimusannos-/kattavuuskorjaukset. Yhdistä uudet, erillisiin FI-polkuihin sidotut editorialSnapshots-rivit nykyisiin riveihin.
- Hyväksyntäkuittien lähde-SHA:ta ei saa päivittää pelkän käännösmetadatan hyväksymiseksi. Näiden PR:ien tarkkaan nykyiseen tiedostohashiin sidottu inverseEdits palauttaa historialliset tavut, sitten alkuperäinen hyväksyntähash tarkistetaan. Tarkista LF/CRLF, nykyinen lähdehash ja V2-parin molemmat semanttiset hashit integraation jälkeen.
- #274 lisää ruukkuyksikön nelikielisen aliasin. Sen viisi FI-lähteen P2-havaintoa säilyvät rekisterissä. Mainin julkaistuun chiavanukkaan täsmäversioon liittyvä sidos tarkistetaan erikseen.
- Tämä ajo varmisti tiedosto-/avainpäällekkäisyydet ja integraatiorajat. Se ei toistanut 90 käännöksen kielikatselmointia eikä ajanut uutta 326 reseptin GK-laskentaa.

## Havaitut korjausta tai päätöstä odottavat asiat

- #222:n todellinen CI-virhe on indialainen-poha-maapahkinoilla-sidoksen vanhentuminen validate-changed-content-vaiheessa. #268 muutti vain Okayun puuttuvan menetelmähyväksynnän testifixtureä. #222:n avoin CRLF-P2 koskee LF-only-metadatan poistoa.
- #226:n epäonnistunut ajo raportoi 21 vanhan testin ristiriitaa sekä masala-dosa- ja meksikolainen-paputostada-aamupalaksi-syötteiden muutokset. Testisuojaa ei ohiteta.
- #169:n väärät dairy35-sidokset ovat yhä mainissa kahdessa HOLD-syötteessä. #133:n R2-ehdotuksen määrä- ja GI-muutoksia puuttuu alkuperäissyötteistä. Myöhemmin hyväksytyt GK-only-paketit eivät todista näiden vanhojen syötteiden korjautumista.
- #210:n EDEKA-versio korvaa #207:n toisen granolaversion. 2,47 → 2,38 on malliversion vaihto, eikä uusi kattavuuslisäys. Tuotevertailukelpoisuus ja omistajan versionvalinta säilyvät katselmointina.
- Arkistoitavan #166:n kolme regressiotestiä ovat yksilöllisiä ja nykyisestä nutrition-evidence.test.ts-tiedostosta puuttuvia. Lähdekoodi on commit-sidottuna liitteessä. Niitä ei merkitä jo integroiduiksi. Porttaus arvioidaan nykyisen korjaus-PR:n rajatussa regressiokatselmoinnissa.
- #269:n työlistan kookosmaito-, riisipaperi-, höyrytaikina-, salsa- ja paistettu-taikinaesteet sekä bánh xèon valmistusanalogia säilyvät avoimina. #276 julkaisi yhden kotireseptiin sidotun version ja seitsemän tutkimusannosvertailua. Näitä ei saa laskea kahdeksaksi uudeksi ratkaistuksi kotireseptiksi.
- #233:ssa on historiallinen avoin B-menetelmän katselmointiketju. Myöhempi ehdokaskoodi muutettiin A-menetelmäksi ja julkaisu eteni #239:ssä. Ketjua ei merkitä ratkaistuksi tämän siivouksen perusteella.
- GitHubin reviewDecision on tyhjä kaikissa 60 PR:ssä. #222:ssa ja #233:ssa on COMMENTED-katselmointi. Keskusteluihin kirjatut reseptikohtaiset omistajapäätökset ovat erillisiä, SHA-sidottuja päätöksiä.

## Kaikkien 60 PR:n luokittelu

CI-sarake kuvaa tarkistetun PR-HEADin buildia. Historiallinen vihreä CI ei vahvista yhdistelmää tämänhetkiseen mainiin. Poissa oleva CI on merkitty puuttuvaksi.

| PR | Luokka | HEAD | Tiedostoja | CI | Peruste ja jatko |
| --- | --- | --- | ---: | --- | --- |
| [#100](https://github.com/ozirix-dev/Reseptit/pull/100) | BLOCKED | [`930c39825151`](https://github.com/ozirix-dev/Reseptit/commit/930c398251515fbb7662e33707d7ed7e72bfc351) | 8 | SUCCESS | Nutriticsin live-adapteri ja arviointiprotokolla ovat yksilöllisiä. Kirjallinen API-/käyttöoikeusvahvistus puuttuu. |
| [#116](https://github.com/ozirix-dev/Reseptit/pull/116) | KEEP_ACTIVE | [`61d19c6148a1`](https://github.com/ozirix-dev/Reseptit/commit/61d19c6148a16bf8cf390f25ac213df1c6d831e5) | 2 | SUCCESS | Viten erillinen riippuvuuspäivitys. Tarkista lukitustiedosto nykyisessä mainissa. |
| [#118](https://github.com/ozirix-dev/Reseptit/pull/118) | ARCHIVE | [`0346e0facbbd`](https://github.com/ozirix-dev/Reseptit/commit/0346e0facbbd62105b424e5cb8fe0c18bcc51731) | 1 | SUCCESS | P0–P5-tutkimusroadmap säilytetään historiallisena suunnitteluna. #229 on erillinen toteutus, #241/#242 ja mainin #264 jatkavat suunnittelua. Toteutumattomat vaiheet eivät saa hyväksyntää arkistoinnista. |
| [#119](https://github.com/ozirix-dev/Reseptit/pull/119) | REVIEW | [`2ae46f59c9b9`](https://github.com/ozirix-dev/Reseptit/commit/2ae46f59c9b982c540a10ba8e0a6cd999ace7187) | 6 | SUCCESS | Suodattimen, poistettavien suodatinvalintojen ja kokonaisajan käyttöliittymämuutokset ovat yhä yksilöllisiä. Sovitus nykyiseen UI:hin tarvitaan. |
| [#133](https://github.com/ozirix-dev/Reseptit/pull/133) | REVIEW | [`020b665582f4`](https://github.com/ozirix-dev/Reseptit/commit/020b665582f4f1ec54e56ec978581e424adc6ace) | 12 | SUCCESS | R2:n massa-, koostumus- ja GI-korjauksia puuttuu mainin alkuperäissyötteistä. Nykyiset hyväksytyt GK-only-versiot ovat erillisiä. Korjauksia ei saa merkitä toteutetuiksi vanhan erän perusteella. |
| [#134](https://github.com/ozirix-dev/Reseptit/pull/134) | ARCHIVE | [`edabab80ec03`](https://github.com/ozirix-dev/Reseptit/commit/edabab80ec03d26ba85a6c51a07e58936a75298a) | 19 | SUCCESS | R3/R3.1 on vanhan 83/326-lähtötilan tutkimus- ja politiikkaehdotus. Lähderekisteri, 24 tapausta, epävarmuudet ja 0 julkaisuhyväksyntää säilyvät. #133 omistaa avoimet R2-korjaukset, #255 nykyisen recovery-jonon. |
| [#135](https://github.com/ozirix-dev/Reseptit/pull/135) | ARCHIVE | [`bff8c6a1799c`](https://github.com/ozirix-dev/Reseptit/commit/bff8c6a1799cf56947413ddfc634e72ea4d2efce) | 13 | SUCCESS | Eristetty 20 reseptin pilotti ja vanha mallipolku ovat tutkimushistoriaa. Julkaisu on edennyt mainin #149/#150/#151/#152:n ja myöhempien integraatioiden kautta. Kaikkien pilotin ehdotusten toteutumista ei väitetä. |
| [#136](https://github.com/ozirix-dev/Reseptit/pull/136) | ARCHIVE | [`61a4563a997a`](https://github.com/ozirix-dev/Reseptit/commit/61a4563a997a5c5aa603df109cea020f89c10d08) | 16 | SUCCESS | Pinottu 30 reseptin tutkimuserä ja neljä ehdollista pistettä säilyvät tarkassa commitissa. Vanhaa mallipinoa ei enää integroida. Nykyinen jatkojono #255. |
| [#137](https://github.com/ozirix-dev/Reseptit/pull/137) | ARCHIVE | [`2511f00a38e3`](https://github.com/ozirix-dev/Reseptit/commit/2511f00a38e394faa54ee5896f2164c38db77870) | 11 | SUCCESS | Kahdeksan liemi-/kastiketuotteen lähde- ja tuotetiedot säilyvät. Historiallinen pinoriippuvuus #136:een poistuu aktiivijonosta, käyttökelpoisuus tarkistetaan nykyisessä #255:n lähdetyössä. |
| [#138](https://github.com/ozirix-dev/Reseptit/pull/138) | ARCHIVE | [`0eb8747069a5`](https://github.com/ozirix-dev/Reseptit/commit/0eb8747069a57c306f32a612fad79d43e9892d65) | 12 | SUCCESS | Kaksi ehdollista kanapannun ehdotusta säilyvät lähde- ja syötehashien kanssa. Vanha pinottu julkaisupolku on korvautunut myöhemmillä main-integraatioilla. Ei uutta hyväksyntää. |
| [#139](https://github.com/ozirix-dev/Reseptit/pull/139) | ARCHIVE | [`c660cc217bdd`](https://github.com/ozirix-dev/Reseptit/commit/c660cc217bdd6df42e5648a48d3d23d28414819c) | 16 | SUCCESS | 40 reseptin ajo, 14 ehdotusta, prior-eight-auditointi ja päätösaineisto ovat historiallinen erä. Jatko mainin nykyisillä versioilla ja #255:n jonolla. |
| [#141](https://github.com/ozirix-dev/Reseptit/pull/141) | ARCHIVE | [`a332822fd29d`](https://github.com/ozirix-dev/Reseptit/commit/a332822fd29d054eb4c9510f07b22ee398404990) | 45 | SUCCESS | 50 reseptin erä, 26 numeerista ehdotusta ja aiempien tapausten auditointi säilyvät. Mainin myöhemmät julkaisu- ja hyväksyntäpaketit korvaavat vanhan pinon integrointipolun. HOLDit eivät vapaudu. |
| [#144](https://github.com/ozirix-dev/Reseptit/pull/144) | ARCHIVE | [`a1628d4f9ad7`](https://github.com/ozirix-dev/Reseptit/commit/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8) | 58 | SUCCESS | 26 uuden ehdotuksen, 48 aiemman auditoinnin ja 261-tavoitteen vanha tutkimuspaketti säilyy. Viisi muutettua tiedostoa on mainissa tavutasolla samoja, muu tutkimus säilyy commitlinkeillä. Jatko #255. |
| [#146](https://github.com/ozirix-dev/Reseptit/pull/146) | SUPERSEDED | [`5735e46f3939`](https://github.com/ozirix-dev/Reseptit/commit/5735e46f3939bfbc3154a1226e71729fa112522c) | 121 | SUCCESS | 24 reseptin yhteisintegraation seuraaja #149 on yhdistetty. 107/121 muutettua tiedostoa on mainissa tavutasolla sama, loput sisältävät myöhempää runtime-/rekisterikehitystä. Vanhaa koko rekisteriä ei palauteta. |
| [#147](https://github.com/ozirix-dev/Reseptit/pull/147) | SUPERSEDED | [`31816bbe1c24`](https://github.com/ozirix-dev/Reseptit/commit/31816bbe1c2401bc1f4c5864e36e87de30f426d0) | 66 | SUCCESS | Q09-korjaukset vietiin yhteispakettiin #149. 43/66 muutettua tiedostoa on mainissa tavutasolla sama. Historialliset lähteet ja nollan poiston perusteet säilyvät. |
| [#148](https://github.com/ozirix-dev/Reseptit/pull/148) | ARCHIVE | [`767f57795f98`](https://github.com/ozirix-dev/Reseptit/commit/767f57795f981028227167d52ee23f7e674494db) | 53 | SUCCESS | 20 tapauksen run-6 ja next-eight-paketti säilyvät. Julkaisuja on jatkettu mainin #150/#151/#152:n kautta. Vanhan kattavuus- ja HOLD-tilan palauttaminen ei ole integraatiotarve. |
| [#154](https://github.com/ozirix-dev/Reseptit/pull/154) | ARCHIVE | [`d6d2d35e78df`](https://github.com/ozirix-dev/Reseptit/commit/d6d2d35e78df9e1b459f793a4fc1387fa791af80) | 12 | SUCCESS | POLYOLI-01:n eristetty prototyyppi ja määrälliset vaikutukset säilyvät. Yleinen polyoliohitus jäi NO-GOksi. Nykyinen menetelmäkeskustelu #168/#180/#181 ja lähdekorjaus #182. |
| [#155](https://github.com/ozirix-dev/Reseptit/pull/155) | ARCHIVE | [`08b69bd974c4`](https://github.com/ozirix-dev/Reseptit/commit/08b69bd974c427c94be3a460c27d007fbcd53f54) | 12 | SUCCESS | POLYOLI-02:n meirami-, laakeri- ja nakkikeittolähteet sekä kaikki viisi HOLD-perustetta säilyvät. Ei yleistä polyolitulkinnan hyväksyntää. Jatko #181/#182 ja #255. |
| [#161](https://github.com/ozirix-dev/Reseptit/pull/161) | ARCHIVE | [`6f09e0a4b4ca`](https://github.com/ozirix-dev/Reseptit/commit/6f09e0a4b4caaac17412f12b1f3dcc79d875f345) | 15 | SUCCESS | 130 GK:n AFCD-vaikutusauditointi on historiallinen. Keto-pidätys #162 ja rajatut recovery-integraatiot #165/#167 ovat mainissa. Lähdekattavuus-, 21 epäselvän tapauksen ja HOLD-näyttö säilyy. Nykyinen auditointi #181. |
| [#164](https://github.com/ozirix-dev/Reseptit/pull/164) | ARCHIVE | [`e496a1b55810`](https://github.com/ozirix-dev/Reseptit/commit/e496a1b5581037d3d910c0119a235cc7045dbbbb) | 18 | SUCCESS | Pois kytketty uunikanapastaprototyyppi, tarkkuus-HOLD ja recovery-03 säilyvät. Myöhempi erillinen julkaisu #165 on mainissa. Vanhan prototyypin aktivointia ei tarvita. |
| [#166](https://github.com/ozirix-dev/Reseptit/pull/166) | ARCHIVE | [`b89a89117156`](https://github.com/ozirix-dev/Reseptit/commit/b89a891171566cd6c8553349fdd363db6e5a93a9) | 12 | SUCCESS | MAIN131-tuotantovarmennus ja inventaario ovat päivättyä historiaa, main on edennyt. Kolme yksilöllistä regressiotestiä eivät ole nykyisessä nutrition-evidence.test.ts:ssä. Niiden koodi säilytetään ja arvioidaan myöhemmin #168/#182:n kohdennetun regressiokatselmoinnin yhteydessä. |
| [#168](https://github.com/ozirix-dev/Reseptit/pull/168) | KEEP_ACTIVE | [`0eacc8f0ba44`](https://github.com/ozirix-dev/Reseptit/commit/0eacc8f0ba448347b0f39c2d4e76f887c9942934) | 20 | SUCCESS | US_TOTAL_INCLUDING_FIBRE-normalisoinnin C−F−P-korjaus ja tuntemattoman polyolin esto ovat yhä erillinen toteutus. Nykyisen mainin regressio ja vaikutusrajat katselmoitava. |
| [#169](https://github.com/ozirix-dev/Reseptit/pull/169) | REVIEW | [`e834bb59035d`](https://github.com/ozirix-dev/Reseptit/commit/e834bb59035dc20f09e015d57278a08771c13b13) | 17 | SUCCESS | Kookosmaidon väärät kevytmaito-/dairy35-sidokset ovat edelleen mainin kookos-lime-kanacurry- ja sate-ayam-HOLD-syötteissä. P1-korjausraja ja lähdeidentiteetit tarvitsevat erillisen päätöksen. |
| [#170](https://github.com/ozirix-dev/Reseptit/pull/170) | ARCHIVE | [`87c603bfe5de`](https://github.com/ozirix-dev/Reseptit/commit/87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051) | 22 | SUCCESS | Operation141:n 30 kokoreseptikatselmointia, 17 skenaariota ja 15 numeerista ehdotusta säilyvät. Osa eteni mainin #171/#173/#175/#179/#183:n kautta. Jäljelle jäävät HOLDit ja soveltuvuudet kuuluvat nykyiseen #255:n lähdetyöhön. |
| [#172](https://github.com/ozirix-dev/Reseptit/pull/172) | REVIEW | [`69a2ca2be732`](https://github.com/ozirix-dev/Reseptit/commit/69a2ca2be732e9e4454cd44cf770a601feb8fd9d) | 6 | puuttuu | Cloudflare-siirtosuunnitelman D1/R2-, kuva-, palautus- ja lähdemasteripäätökset ovat yksilöllisiä. #243 täydentää käyttöönottoa. SOURCE-01 #174 on tietomalliriippuvuus. |
| [#174](https://github.com/ozirix-dev/Reseptit/pull/174) | REVIEW | [`19939d95d8c9`](https://github.com/ozirix-dev/Reseptit/commit/19939d95d8c93d6e93d4619d9f2510d043d246dc) | 7 | puuttuu | SOURCE-01:n kenttäkartoitus, lähdemääritelmät ja enintään kahdeksan tietueen pilotti odottavat vaiheen 1 omistajapäätöstä. #172/#176 riippuvat tästä. |
| [#176](https://github.com/ozirix-dev/Reseptit/pull/176) | REVIEW | [`9e0bab5209e5`](https://github.com/ozirix-dev/Reseptit/commit/9e0bab5209e59533e6b7326a5375680024ea7083) | 1 | puuttuu | Nutrition Coren sovellusten välinen havaintomalli, ravintotekijät ja vaiheistus ovat oma arkkitehtuuripäätös. Sitä ei korvaa #172 tai #243. |
| [#178](https://github.com/ozirix-dev/Reseptit/pull/178) | REVIEW | [`60a6b5c33cb4`](https://github.com/ozirix-dev/Reseptit/commit/60a6b5c33cb4bf09e5270ab9011ecfbceda1d0e1) | 1 | puuttuu | Recipavon päiväkirja-MVP, tuote-, tietosuoja- ja liiketoimintasuunnitelma on oma sisältöpäätös. Sitä ei korvaa pilvisuunnitelma. |
| [#180](https://github.com/ozirix-dev/Reseptit/pull/180) | REVIEW | [`fd8bd4d31e6d`](https://github.com/ozirix-dev/Reseptit/commit/fd8bd4d31e6d37bc53d669870a00557f5147644a) | 22 | puuttuu | Osittaisten makrojen hyväksyntä, toleranssit ja 326 reseptin skenaariot ovat avoin menetelmäpäätös. Ei valtuutta muuttaa hyväksyttyjä laskelmia. |
| [#181](https://github.com/ozirix-dev/Reseptit/pull/181) | REVIEW | [`88e08d517bb6`](https://github.com/ozirix-dev/Reseptit/commit/88e08d517bb62fa83dd1207912569fe853737596) | 16 | puuttuu | AFCD:n with−without-erotus ei osoita kokonaispolyolia. 133 tietueen/219 reseptin lähdejoinit ja null-semanttiikka ovat edelleen tarpeellinen menetelmäaineisto. #182 korjaa vain kolme kenttäsidosta. |
| [#182](https://github.com/ozirix-dev/Reseptit/pull/182) | KEEP_ACTIVE | [`924a827b515f`](https://github.com/ozirix-dev/Reseptit/commit/924a827b515f4d4e27d70389837e22f904d38c1f) | 8 | SUCCESS | Kolmen AFCD-kentän sidontakorjaus on yhä toteuttamatta mainissa. Persikan 8→7,7, vadelman 7→6,9 ja juurisellerin 5→2,8 sekä kahden evidenssisidoksen rajaus katselmoidaan ensin. |
| [#187](https://github.com/ozirix-dev/Reseptit/pull/187) | ARCHIVE | [`0aab0b9a11e5`](https://github.com/ozirix-dev/Reseptit/commit/0aab0b9a11e57c6e6695dc871796c48282a6d3cf) | 14 | SUCCESS | Vanhan 15 ehdokkaan approval-gate säilytetään päätöstaulukoineen. Kahden chilla-version nimenomainen omistajapäätös säilyy PR-kommentissa ja myöhemmät integraatiot #192/#193 ovat mainissa. Muut ehdolliset/lähde-HOLDit eivät vapaudu, jatko #255. |
| [#196](https://github.com/ozirix-dev/Reseptit/pull/196) | KEEP_ACTIVE | [`c7342840af08`](https://github.com/ozirix-dev/Reseptit/commit/c7342840af0809355019577bf579a5f2921f7d6c) | 2 | SUCCESS | @types/node on erillinen riippuvuuspäivitys. |
| [#197](https://github.com/ozirix-dev/Reseptit/pull/197) | KEEP_ACTIVE | [`635b4b8bc4fd`](https://github.com/ozirix-dev/Reseptit/commit/635b4b8bc4fd49e8aa0c876052fcfbb160cdc35e) | 2 | SUCCESS | react-router-dom on erillinen riippuvuuspäivitys. |
| [#198](https://github.com/ozirix-dev/Reseptit/pull/198) | KEEP_ACTIVE | [`0bcbb39ed1a0`](https://github.com/ozirix-dev/Reseptit/commit/0bcbb39ed1a05fac6bdb717427254fa3d244bd64) | 2 | SUCCESS | marked on erillinen riippuvuuspäivitys. |
| [#210](https://github.com/ozirix-dev/Reseptit/pull/210) | REVIEW | [`c2e7c53ff55a`](https://github.com/ozirix-dev/Reseptit/commit/c2e7c53ff55a562f1dd3f983266db33833b7ee26) | 4 | SUCCESS | EDEKA-granola on eri hyväksytty täsmäversio kuin mainin #207-versio. Nykyinen HEAD korvaa aiemman version eikä lisää kattavuutta. Tuotesoveltuvuus ja nyky-main-sovitus ratkaistava. |
| [#219](https://github.com/ozirix-dev/Reseptit/pull/219) | SUPERSEDED | [`abe8a1da15c0`](https://github.com/ozirix-dev/Reseptit/commit/abe8a1da15c0af3b02ee1b509783f475ec2f8e42) | 5 | SUCCESS | Pav bhaji on jo mainissa PR #218:n kautta. #219:n rajattu vaihtoehtoinen builder ja hyväksyntäkuitti säilyvät. Samaa recipe-ID:tä ei integroida toistamiseen. |
| [#222](https://github.com/ozirix-dev/Reseptit/pull/222) | BLOCKED | [`bca2d19f80fa`](https://github.com/ozirix-dev/Reseptit/commit/bca2d19f80fa21391a8e5696748c19ce24f92ba0) | 12 | FAILURE | CI 41918540234 pysähtyy pohan vanhentuneeseen GI/GK-sidokseen validate-changed-content-vaiheessa. #268 korjasi eri Okayu-testin. Avoin CRLF-P2 ja nyky-main-konfliktit ratkaistava ennen käännösten integraatiota. |
| [#223](https://github.com/ozirix-dev/Reseptit/pull/223) | KEEP_ACTIVE | [`34d757c4ac77`](https://github.com/ozirix-dev/Reseptit/commit/34d757c4ac7799db4d2ff91d3bf615406eb88fec) | 6 | SUCCESS | Controller V1 on oma varalla säilytettävä toteutus. Aiempi omistajan ohje jättää ajonohjaimen aktivoimatta. #224:n turvakorjaukset ovat käyttöönoton edellytys. |
| [#224](https://github.com/ozirix-dev/Reseptit/pull/224) | STACKED | [`e8cdfce0fb52`](https://github.com/ozirix-dev/Reseptit/commit/e8cdfce0fb52950ad4595a0bd6117152f3a5ad57) | 6 | SUCCESS | Turvakorjaukset kohdistuvat #223:n haaraan. Fyysiset input/evidence-SHA:t, työpuurajat ja keskeytyksestä palautuminen tarkastetaan yhdessä. Ei tutkimusajon käynnistystä. |
| [#225](https://github.com/ozirix-dev/Reseptit/pull/225) | ARCHIVE | [`e841b0244aeb`](https://github.com/ozirix-dev/Reseptit/commit/e841b0244aeb0d110fbf8efb0ce127ee0ee9d789) | 1 | SUCCESS | Käännösten 3.11.2026 masterplan säilytetään vanhan kattavuusbaselinen suunnitteluna. Mainin #260/#262/#263 toteuttaa laatupolitiikkaa, #270 ensimmäisen erän ja #272–#274 jatkavat. Toteutumattomat laatu- ja kattavuustavoitteet säilyvät viitteessä. |
| [#226](https://github.com/ozirix-dev/Reseptit/pull/226) | BLOCKED | [`cba54cfdc00b`](https://github.com/ozirix-dev/Reseptit/commit/cba54cfdc00b73460c7d8b9686bc97bcbc90d834) | 5 | FAILURE | Peruna-/avokadosidosten toteutus on yksilöllinen. CI 41616860813 epäonnistuu 21 historiallisen glycemic-load-testin calculationInputMismatches-suojaan. Selvitä tarkoitettu muutos nykyisessä mainissa, älä ohita suojaa. |
| [#227](https://github.com/ozirix-dev/Reseptit/pull/227) | REVIEW | [`cf551fd06403`](https://github.com/ozirix-dev/Reseptit/commit/cf551fd064036d31479bfa910ebf97adf42c57fe) | 5 | SUCCESS | Kerala, maksa-pekoniversio ja kevätsipulipannukakku ovat yksilöllinen kolmen version julkaisuvalmistelu. Nyky-main-sovitus ja alkuperäiset hyväksyntäsidokset tarvitaan. |
| [#228](https://github.com/ozirix-dev/Reseptit/pull/228) | ARCHIVE | [`5cbd53858790`](https://github.com/ozirix-dev/Reseptit/commit/5cbd538587904fea02378a1773c2c8e1c24b6346) | 1 | SUCCESS | 36 lähde-/pääsyvaihtoehdon selvitys on käyttökelpoinen lähdearkisto. #242 ja mainin #264/#265 jatkavat kuratointi- ja hakusuunnittelua, #255/#269 recovery-työtä. Lähteiden käyttörajoitukset säilyvät. |
| [#229](https://github.com/ozirix-dev/Reseptit/pull/229) | REVIEW | [`2b50b18af9b4`](https://github.com/ozirix-dev/Reseptit/commit/2b50b18af9b473337d7ddad8d37a660547f1d63d) | 9 | SUCCESS | ESTIMATED_RANGE-sopimus, luokkarajan ylityksen suodatus ja bindaetteok-skenaariot ovat yhä erillinen toteutus. Yhteensovitus #251/#276:n nykyiseen esitykseen ja menetelmäpäätös tarvitaan. |
| [#231](https://github.com/ozirix-dev/Reseptit/pull/231) | KEEP_ACTIVE | [`9d20ca9adbd1`](https://github.com/ozirix-dev/Reseptit/commit/9d20ca9adbd158a9acf6c50a1665dd4797250191) | 7 | SUCCESS | CI-valitsimen ja GK-työindeksin muutokset ovat yksilöllisiä. Historiallisen #230-riippuvuuden päivitys ja nykyisen workflow/AGENTS-sisällön sovitus tarvitaan. |
| [#233](https://github.com/ozirix-dev/Reseptit/pull/233) | SUPERSEDED | [`fa11a0c78e2a`](https://github.com/ozirix-dev/Reseptit/commit/fa11a0c78e2af80ad5813bba672603dba7ff1f47) | 13 | SUCCESS | Viiden version julkaisu on mainissa #239:n kautta. Kaikki viisi ehdokas-JSONia ovat mainissa tavutasolla samoja. Päätös- ja lähdehistoria sekä vanha avoin B-menetelmähavainto säilyvät PR:ssä. |
| [#234](https://github.com/ozirix-dev/Reseptit/pull/234) | SUPERSEDED | [`7a2249f6286f`](https://github.com/ozirix-dev/Reseptit/commit/7a2249f6286f49ef7daf9548b3fd31dc25d8f31b) | 12 | SUCCESS | Viisi toisen erän ehdokasta sisältyy mainin #240 eighteen-julkaisuun. Kaikki viisi ehdokas-JSONia ovat mainissa tavutasolla samoja. Vanha päätöstiedosto ja lähdeperustelut säilyvät. |
| [#235](https://github.com/ozirix-dev/Reseptit/pull/235) | SUPERSEDED | [`118d8b8264ad`](https://github.com/ozirix-dev/Reseptit/commit/118d8b8264ad57272dd1d5c03c609330871392f9) | 14 | SUCCESS | Kolmannen erän viisi ehdokasta ovat mainin #240-julkaisussa ja tavutasolla samat. Farinata-/Saníssimo-hyväksyntäkuittien alkuperäisversiot sekä sisältöpäätökset säilyvät commitissa. |
| [#236](https://github.com/ozirix-dev/Reseptit/pull/236) | SUPERSEDED | [`170393a3f2a9`](https://github.com/ozirix-dev/Reseptit/commit/170393a3f2a9e6aa125bcfdd4267d3f1902ac0b5) | 5 | SUCCESS | Bún chả ja mapo tofu ovat mainin #240-julkaisussa. Ehdokas-JSONit ja alkuperäinen mapo-tutkimus ovat tavutasolla samat. Alkuperäinen sisältöpäätöstaulukko säilyy. |
| [#238](https://github.com/ozirix-dev/Reseptit/pull/238) | SUPERSEDED | [`2cadbab5b73a`](https://github.com/ozirix-dev/Reseptit/commit/2cadbab5b73ab883d97254e9aa479acd1b4ffe3b) | 13 | SUCCESS | Kuuden ehdokkaan paketti sisältyy mainin #240-julkaisuun. 12/13 muutettua tiedostoa on mainissa tavutasolla sama. Alkuperäinen kuuden sisältöpäätöksen tiedosto säilyy. |
| [#241](https://github.com/ozirix-dev/Reseptit/pull/241) | REVIEW | [`8fd0800ed664`](https://github.com/ozirix-dev/Reseptit/commit/8fd0800ed664f7f2c2c4a12b6f9b6914ef452dbc) | 1 | SUCCESS | Uuden reseptin automaattinen arviointiputki on oma suunnitelma. Sovitetaan #242:n kuratointiin, #255:n jonoon ja mainin #264/#265:n sopimuksiin. |
| [#242](https://github.com/ozirix-dev/Reseptit/pull/242) | REVIEW | [`f37ebe1b4599`](https://github.com/ozirix-dev/Reseptit/commit/f37ebe1b4599f0bdff2c71a76d3e3c1780548547) | 1 | SUCCESS | Source/Observation/Applicability-kuratointimalli on eri asia kuin mainin #265 SQLite-hakumoottori. Soveltuvuudet ja käyttöoikeudet jäävät suunnitelman päätöksiksi. |
| [#243](https://github.com/ozirix-dev/Reseptit/pull/243) | REVIEW | [`f493274b158f`](https://github.com/ozirix-dev/Reseptit/commit/f493274b158f0611df20a1b0a0845c3e03119c15) | 1 | SUCCESS | Recipavon tuotanto/staging/cutover- ja julkaisupäätösportit ovat oma käyttöönottosuunnitelma. Säilytä #172:n siirto-, #176:n Core- ja #178:n tuotesuunnitelmat erillisinä. |
| [#255](https://github.com/ozirix-dev/Reseptit/pull/255) | KEEP_ACTIVE | [`fa411bf1cb62`](https://github.com/ozirix-dev/Reseptit/commit/fa411bf1cb620dfd7db97730cfeb5b6fb5ca738d) | 6 | SUCCESS | Smart Review V2:n priorisointityökalu ja bánh xèon REVIEW_REQUIRED-paketti ovat yksilöllisiä. Päivitä vanha 91 reseptin jono mainin julkaisuihin. #269:n tarkempi työlista ja 231 SQLite-kyselyä säilytetään historiaviitteessä. |
| [#269](https://github.com/ozirix-dev/Reseptit/pull/269) | ARCHIVE | [`2e6b46c2af77`](https://github.com/ozirix-dev/Reseptit/commit/2e6b46c2af777c7c76b773a07c55680a273f25d2) | 6 | SUCCESS | Ensimmäinen 30 reseptin SQLite V3 -tutkimuserä on valmis erähistoria. Kahdeksan päätöksen valmistelu eteni #271:n kautta mainin #276-julkaisuun. 231 kyselyä, 61 käsittelemätöntä ID:tä ja Bánh xèon valmistus-HOLD siirtyvät jatkoviitteeksi aktiiviseen #255-jonoon. Kahdeksan julkaisua ei tarkoita kaikkien 30 kotireseptin ratkeamista. |
| [#271](https://github.com/ozirix-dev/Reseptit/pull/271) | SUPERSEDED | [`b45dc22324fe`](https://github.com/ozirix-dev/Reseptit/commit/b45dc22324fe289fa67d0b403352b9c30c7124f5) | 34 | SUCCESS | Kahdeksan version valmistelun seuraaja #276 on mainissa, #275:n V3.1-korjaukset mukaan lukien. 30/34 tiedostoa on mainissa tavutasolla sama. Loput neljä valmistelutiedostoa säilyvät, toteutunut v31-eight-julkaisukuitti on mainissa. Seitsemän tutkimusannosta ei lisää kotireseptien kattavuutta. |
| [#272](https://github.com/ozirix-dev/Reseptit/pull/272) | BLOCKED | [`176d28a299d7`](https://github.com/ozirix-dev/Reseptit/commit/176d28a299d7d9786e647746b8d6f00cbbc99f52) | 49 | SUCCESS | 30 uutta käännösparia säilytetään. Main-konfliktit assert-recipe-baseline.ts- ja static-output.test.ts-tiedostoissa, ei päällekkäisiä uusia review-avaimia #273/#274:n kanssa. |
| [#273](https://github.com/ozirix-dev/Reseptit/pull/273) | KEEP_ACTIVE | [`7a4fcb1cc155`](https://github.com/ozirix-dev/Reseptit/commit/7a4fcb1cc15536538a0ab63665582f5e8bbcfec8) | 41 | SUCCESS | 30 uutta käännösparia. Git merge-tree yhdistyy mainiin ilman tekstikonflikteja. V2-rekisterin 30 uutta avainta eivät leikkaa #272/#274:n kanssa. Rajattu katselmointi voidaan aloittaa tästä. |
| [#274](https://github.com/ozirix-dev/Reseptit/pull/274) | BLOCKED | [`2233290dd792`](https://github.com/ozirix-dev/Reseptit/commit/2233290dd792afa6f85ee9757bded170d0c06a27) | 49 | SUCCESS | 30 uutta käännösparia säilytetään. Samat kaksi main-testikonfliktia kuin #272:ssa. Lisäksi yksikköalias ruukku/pot/kruka/กระถาง ja SHA-sidottu reseptimetadatan palautus on katselmoitava. |

## Suljettavien PR:ien säilytettävä aineisto

Kunkin tiedoston Git-blob ja pysyvä commitlinkki löytyvät koneellisesta liitteestä. Lähteiden omat manifestit ja tarkisteet jäävät niiden alkuperäiseen sisältöön. PR-keskustelut säilyttävät annetut päätökset ja aiemman katselmointihistorian.

### PR #118

P0–P5-tutkimusroadmap säilytetään historiallisena suunnitteluna. #229 on erillinen toteutus, #241/#242 ja mainin #264 jatkavat suunnittelua. Toteutumattomat vaiheet eivät saa hyväksyntää arkistoinnista.

Tarkistettu HEAD `0346e0facbbd62105b424e5cb8fe0c18bcc51731`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/1. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/118).

- [docs/nutrition/glycemic-uncertainty-range-scenarios-roadmap.md](https://github.com/ozirix-dev/Reseptit/blob/0346e0facbbd62105b424e5cb8fe0c18bcc51731/docs/nutrition/glycemic-uncertainty-range-scenarios-roadmap.md)

### PR #134

R3/R3.1 on vanhan 83/326-lähtötilan tutkimus- ja politiikkaehdotus. Lähderekisteri, 24 tapausta, epävarmuudet ja 0 julkaisuhyväksyntää säilyvät. #133 omistaa avoimet R2-korjaukset, #255 nykyisen recovery-jonon.

Tarkistettu HEAD `edabab80ec03d26ba85a6c51a07e58936a75298a`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/19. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/134).

- [docs/nutrition/gk-r3-1-gi-policy.md](https://github.com/ozirix-dev/Reseptit/blob/edabab80ec03d26ba85a6c51a07e58936a75298a/docs/nutrition/gk-r3-1-gi-policy.md)
- [docs/nutrition/gk-r3-1-review.md](https://github.com/ozirix-dev/Reseptit/blob/edabab80ec03d26ba85a6c51a07e58936a75298a/docs/nutrition/gk-r3-1-review.md)
- [docs/nutrition/gk-r3-review.md](https://github.com/ozirix-dev/Reseptit/blob/edabab80ec03d26ba85a6c51a07e58936a75298a/docs/nutrition/gk-r3-review.md)
- [docs/nutrition/gk-r3-source-evidence.json](https://github.com/ozirix-dev/Reseptit/blob/edabab80ec03d26ba85a6c51a07e58936a75298a/docs/nutrition/gk-r3-source-evidence.json)
- [docs/nutrition/gk-r3-verification-manifest.json](https://github.com/ozirix-dev/Reseptit/blob/edabab80ec03d26ba85a6c51a07e58936a75298a/docs/nutrition/gk-r3-verification-manifest.json)

### PR #135

Eristetty 20 reseptin pilotti ja vanha mallipolku ovat tutkimushistoriaa. Julkaisu on edennyt mainin #149/#150/#151/#152:n ja myöhempien integraatioiden kautta. Kaikkien pilotin ehdotusten toteutumista ei väitetä.

Tarkistettu HEAD `bff8c6a1799cf56947413ddfc634e72ea4d2efce`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/13. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/135).

- [docs/nutrition/gk80/pilot-1/README.md](https://github.com/ozirix-dev/Reseptit/blob/bff8c6a1799cf56947413ddfc634e72ea4d2efce/docs/nutrition/gk80/pilot-1/README.md)
- [docs/nutrition/gk80/pilot-1/sources.json](https://github.com/ozirix-dev/Reseptit/blob/bff8c6a1799cf56947413ddfc634e72ea4d2efce/docs/nutrition/gk80/pilot-1/sources.json)

### PR #136

Pinottu 30 reseptin tutkimuserä ja neljä ehdollista pistettä säilyvät tarkassa commitissa. Vanhaa mallipinoa ei enää integroida. Nykyinen jatkojono #255.

Tarkistettu HEAD `61a4563a997a5c5aa603df109cea020f89c10d08`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/16. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/136).

- [docs/nutrition/gk80/run-2/README.md](https://github.com/ozirix-dev/Reseptit/blob/61a4563a997a5c5aa603df109cea020f89c10d08/docs/nutrition/gk80/run-2/README.md)
- [docs/nutrition/gk80/run-2/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/61a4563a997a5c5aa603df109cea020f89c10d08/docs/nutrition/gk80/run-2/composition-sources.json)
- [docs/nutrition/gk80/run-2/sources.json](https://github.com/ozirix-dev/Reseptit/blob/61a4563a997a5c5aa603df109cea020f89c10d08/docs/nutrition/gk80/run-2/sources.json)

### PR #137

Kahdeksan liemi-/kastiketuotteen lähde- ja tuotetiedot säilyvät. Historiallinen pinoriippuvuus #136:een poistuu aktiivijonosta, käyttökelpoisuus tarkistetaan nykyisessä #255:n lähdetyössä.

Tarkistettu HEAD `2511f00a38e394faa54ee5896f2164c38db77870`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/11. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/137).

- [docs/nutrition/gk80/broth-sauce-1/README.md](https://github.com/ozirix-dev/Reseptit/blob/2511f00a38e394faa54ee5896f2164c38db77870/docs/nutrition/gk80/broth-sauce-1/README.md)
- [docs/nutrition/gk80/broth-sauce-1/source-review.json](https://github.com/ozirix-dev/Reseptit/blob/2511f00a38e394faa54ee5896f2164c38db77870/docs/nutrition/gk80/broth-sauce-1/source-review.json)

### PR #138

Kaksi ehdollista kanapannun ehdotusta säilyvät lähde- ja syötehashien kanssa. Vanha pinottu julkaisupolku on korvautunut myöhemmillä main-integraatioilla. Ei uutta hyväksyntää.

Tarkistettu HEAD `0eb8747069a57c306f32a612fad79d43e9892d65`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/12. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/138).

- [docs/nutrition/gk80/chicken-pans-1/README.md](https://github.com/ozirix-dev/Reseptit/blob/0eb8747069a57c306f32a612fad79d43e9892d65/docs/nutrition/gk80/chicken-pans-1/README.md)
- [docs/nutrition/gk80/chicken-pans-1/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/0eb8747069a57c306f32a612fad79d43e9892d65/docs/nutrition/gk80/chicken-pans-1/composition-sources.json)
- [docs/nutrition/gk80/chicken-pans-1/source-review.json](https://github.com/ozirix-dev/Reseptit/blob/0eb8747069a57c306f32a612fad79d43e9892d65/docs/nutrition/gk80/chicken-pans-1/source-review.json)
- [docs/nutrition/gk80/chicken-pans-1/sources.json](https://github.com/ozirix-dev/Reseptit/blob/0eb8747069a57c306f32a612fad79d43e9892d65/docs/nutrition/gk80/chicken-pans-1/sources.json)

### PR #139

40 reseptin ajo, 14 ehdotusta, prior-eight-auditointi ja päätösaineisto ovat historiallinen erä. Jatko mainin nykyisillä versioilla ja #255:n jonolla.

Tarkistettu HEAD `c660cc217bdd6df42e5648a48d3d23d28414819c`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/16. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/139).

- [docs/nutrition/gk80/run-3-v2/README.md](https://github.com/ozirix-dev/Reseptit/blob/c660cc217bdd6df42e5648a48d3d23d28414819c/docs/nutrition/gk80/run-3-v2/README.md)
- [docs/nutrition/gk80/run-3-v2/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/c660cc217bdd6df42e5648a48d3d23d28414819c/docs/nutrition/gk80/run-3-v2/composition-sources.json)
- [docs/nutrition/gk80/run-3-v2/decisions.json](https://github.com/ozirix-dev/Reseptit/blob/c660cc217bdd6df42e5648a48d3d23d28414819c/docs/nutrition/gk80/run-3-v2/decisions.json)
- [docs/nutrition/gk80/run-3-v2/policy.md](https://github.com/ozirix-dev/Reseptit/blob/c660cc217bdd6df42e5648a48d3d23d28414819c/docs/nutrition/gk80/run-3-v2/policy.md)
- [docs/nutrition/gk80/run-3-v2/sources.json](https://github.com/ozirix-dev/Reseptit/blob/c660cc217bdd6df42e5648a48d3d23d28414819c/docs/nutrition/gk80/run-3-v2/sources.json)

### PR #141

50 reseptin erä, 26 numeerista ehdotusta ja aiempien tapausten auditointi säilyvät. Mainin myöhemmät julkaisu- ja hyväksyntäpaketit korvaavat vanhan pinon integrointipolun. HOLDit eivät vapaudu.

Tarkistettu HEAD `a332822fd29d054eb4c9510f07b22ee398404990`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/45. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/141).

- [docs/nutrition/gk80/run-4/README.md](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/README.md)
- [docs/nutrition/gk80/run-4/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/composition-sources.json)
- [docs/nutrition/gk80/run-4/decisions.json](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/decisions.json)
- [docs/nutrition/gk80/run-4/policy.md](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/policy.md)
- [docs/nutrition/gk80/run-4/source-verification.md](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/source-verification.md)
- [docs/nutrition/gk80/run-4/sources.json](https://github.com/ozirix-dev/Reseptit/blob/a332822fd29d054eb4c9510f07b22ee398404990/docs/nutrition/gk80/run-4/sources.json)

### PR #144

26 uuden ehdotuksen, 48 aiemman auditoinnin ja 261-tavoitteen vanha tutkimuspaketti säilyy. Viisi muutettua tiedostoa on mainissa tavutasolla samoja, muu tutkimus säilyy commitlinkeillä. Jatko #255.

Tarkistettu HEAD `a1628d4f9ad7c133b24b627ab4fa858ccbace3b8`. Mainissa täsmälleen samoja muutettuja tiedostoja 5/58. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/144).

- [docs/nutrition/gk80/run-5/README.md](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/README.md)
- [docs/nutrition/gk80/run-5/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/composition-sources.json)
- [docs/nutrition/gk80/run-5/decisions.json](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/decisions.json)
- [docs/nutrition/gk80/run-5/policy.md](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/policy.md)
- [docs/nutrition/gk80/run-5/prior48/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/prior48/composition-sources.json)
- [docs/nutrition/gk80/run-5/prior48/sources.json](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/prior48/sources.json)
- [docs/nutrition/gk80/run-5/sources.json](https://github.com/ozirix-dev/Reseptit/blob/a1628d4f9ad7c133b24b627ab4fa858ccbace3b8/docs/nutrition/gk80/run-5/sources.json)

### PR #146

24 reseptin yhteisintegraation seuraaja #149 on yhdistetty. 107/121 muutettua tiedostoa on mainissa tavutasolla sama, loput sisältävät myöhempää runtime-/rekisterikehitystä. Vanhaa koko rekisteriä ei palauteta.

Tarkistettu HEAD `5735e46f3939bfbc3154a1226e71729fa112522c`. Mainissa täsmälleen samoja muutettuja tiedostoja 107/121. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/146).

- [docs/nutrition/gk80-release-registry.json](https://github.com/ozirix-dev/Reseptit/blob/5735e46f3939bfbc3154a1226e71729fa112522c/docs/nutrition/gk80-release-registry.json)

### PR #147

Q09-korjaukset vietiin yhteispakettiin #149. 43/66 muutettua tiedostoa on mainissa tavutasolla sama. Historialliset lähteet ja nollan poiston perusteet säilyvät.

Tarkistettu HEAD `31816bbe1c2401bc1f4c5864e36e87de30f426d0`. Mainissa täsmälleen samoja muutettuja tiedostoja 43/66. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/147).

- [docs/nutrition/gk80-q09/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/31816bbe1c2401bc1f4c5864e36e87de30f426d0/docs/nutrition/gk80-q09/composition-sources.json)
- [docs/nutrition/gk80-q09/manifest.json](https://github.com/ozirix-dev/Reseptit/blob/31816bbe1c2401bc1f4c5864e36e87de30f426d0/docs/nutrition/gk80-q09/manifest.json)
- [docs/nutrition/gk80-release-4/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/31816bbe1c2401bc1f4c5864e36e87de30f426d0/docs/nutrition/gk80-release-4/composition-sources.json)
- [docs/nutrition/gk80-release-4/manifest.json](https://github.com/ozirix-dev/Reseptit/blob/31816bbe1c2401bc1f4c5864e36e87de30f426d0/docs/nutrition/gk80-release-4/manifest.json)

### PR #148

20 tapauksen run-6 ja next-eight-paketti säilyvät. Julkaisuja on jatkettu mainin #150/#151/#152:n kautta. Vanhan kattavuus- ja HOLD-tilan palauttaminen ei ole integraatiotarve.

Tarkistettu HEAD `767f57795f981028227167d52ee23f7e674494db`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/53. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/148).

- [docs/nutrition/gk80/run-6/README.md](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/README.md)
- [docs/nutrition/gk80/run-6/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/composition-sources.json)
- [docs/nutrition/gk80/run-6/next-eight/README.md](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/next-eight/README.md)
- [docs/nutrition/gk80/run-6/next-eight/composition-sources.json](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/next-eight/composition-sources.json)
- [docs/nutrition/gk80/run-6/next-eight/manifest.json](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/next-eight/manifest.json)
- [docs/nutrition/gk80/run-6/next-eight/sources.json](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/next-eight/sources.json)
- [docs/nutrition/gk80/run-6/sources.json](https://github.com/ozirix-dev/Reseptit/blob/767f57795f981028227167d52ee23f7e674494db/docs/nutrition/gk80/run-6/sources.json)

### PR #154

POLYOLI-01:n eristetty prototyyppi ja määrälliset vaikutukset säilyvät. Yleinen polyoliohitus jäi NO-GOksi. Nykyinen menetelmäkeskustelu #168/#180/#181 ja lähdekorjaus #182.

Tarkistettu HEAD `d6d2d35e78df9e1b459f793a4fc1387fa791af80`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/12. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/154).

- [docs/research/polyoli-01/README.md](https://github.com/ozirix-dev/Reseptit/blob/d6d2d35e78df9e1b459f793a4fc1387fa791af80/docs/research/polyoli-01/README.md)
- [docs/research/polyoli-01/source-retrievals.json](https://github.com/ozirix-dev/Reseptit/blob/d6d2d35e78df9e1b459f793a4fc1387fa791af80/docs/research/polyoli-01/source-retrievals.json)

### PR #155

POLYOLI-02:n meirami-, laakeri- ja nakkikeittolähteet sekä kaikki viisi HOLD-perustetta säilyvät. Ei yleistä polyolitulkinnan hyväksyntää. Jatko #181/#182 ja #255.

Tarkistettu HEAD `08b69bd974c427c94be3a460c27d007fbcd53f54`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/12. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/155).

- [docs/research/polyoli-02/README.md](https://github.com/ozirix-dev/Reseptit/blob/08b69bd974c427c94be3a460c27d007fbcd53f54/docs/research/polyoli-02/README.md)
- [docs/research/polyoli-02/marjoram-source-proposal.json](https://github.com/ozirix-dev/Reseptit/blob/08b69bd974c427c94be3a460c27d007fbcd53f54/docs/research/polyoli-02/marjoram-source-proposal.json)
- [docs/research/polyoli-02/source-evidence.json](https://github.com/ozirix-dev/Reseptit/blob/08b69bd974c427c94be3a460c27d007fbcd53f54/docs/research/polyoli-02/source-evidence.json)
- [docs/research/polyoli-02/source-questions.md](https://github.com/ozirix-dev/Reseptit/blob/08b69bd974c427c94be3a460c27d007fbcd53f54/docs/research/polyoli-02/source-questions.md)

### PR #161

130 GK:n AFCD-vaikutusauditointi on historiallinen. Keto-pidätys #162 ja rajatut recovery-integraatiot #165/#167 ovat mainissa. Lähdekattavuus-, 21 epäselvän tapauksen ja HOLD-näyttö säilyy. Nykyinen auditointi #181.

Tarkistettu HEAD `6f09e0a4b4caaac17412f12b1f3dcc79d875f345`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/15. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/161).

- [docs/research/gk80-afcd-polyol-impact/README.md](https://github.com/ozirix-dev/Reseptit/blob/6f09e0a4b4caaac17412f12b1f3dcc79d875f345/docs/research/gk80-afcd-polyol-impact/README.md)
- [docs/research/gk80-afcd-polyol-impact/checksums.json](https://github.com/ozirix-dev/Reseptit/blob/6f09e0a4b4caaac17412f12b1f3dcc79d875f345/docs/research/gk80-afcd-polyol-impact/checksums.json)
- [docs/research/gk80-afcd-polyol-impact/shared-hold-sources.json](https://github.com/ozirix-dev/Reseptit/blob/6f09e0a4b4caaac17412f12b1f3dcc79d875f345/docs/research/gk80-afcd-polyol-impact/shared-hold-sources.json)
- [docs/research/gk80-afcd-polyol-impact/sources.json](https://github.com/ozirix-dev/Reseptit/blob/6f09e0a4b4caaac17412f12b1f3dcc79d875f345/docs/research/gk80-afcd-polyol-impact/sources.json)

### PR #164

Pois kytketty uunikanapastaprototyyppi, tarkkuus-HOLD ja recovery-03 säilyvät. Myöhempi erillinen julkaisu #165 on mainissa. Vanhan prototyypin aktivointia ei tarvita.

Tarkistettu HEAD `e496a1b5581037d3d910c0119a235cc7045dbbbb`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/18. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/164).

- [docs/research/gk80-afcd-recovery-02/README.md](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/README.md)
- [docs/research/gk80-afcd-recovery-02/checksums.json](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/checksums.json)
- [docs/research/gk80-afcd-recovery-02/main-source.md](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/main-source.md)
- [docs/research/gk80-afcd-recovery-02/pr153-source.md](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/pr153-source.md)
- [docs/research/gk80-afcd-recovery-02/recovery-03/README.md](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/recovery-03/README.md)
- [docs/research/gk80-afcd-recovery-02/source-pins.json](https://github.com/ozirix-dev/Reseptit/blob/e496a1b5581037d3d910c0119a235cc7045dbbbb/docs/research/gk80-afcd-recovery-02/source-pins.json)

### PR #166

MAIN131-tuotantovarmennus ja inventaario ovat päivättyä historiaa, main on edennyt. Kolme yksilöllistä regressiotestiä eivät ole nykyisessä nutrition-evidence.test.ts:ssä. Niiden koodi säilytetään ja arvioidaan myöhemmin #168/#182:n kohdennetun regressiokatselmoinnin yhteydessä.

Tarkistettu HEAD `b89a891171566cd6c8553349fdd363db6e5a93a9`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/12. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/166).

- [docs/research/gk80-main131-night/README.md](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/docs/research/gk80-main131-night/README.md)
- [docs/research/gk80-main131-night/artifact-manifest.json](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/docs/research/gk80-main131-night/artifact-manifest.json)
- [docs/research/gk80-main131-night/input-manifest.json](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/docs/research/gk80-main131-night/input-manifest.json)
- [docs/research/gk80-main131-night/next-approval-packet.json](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/docs/research/gk80-main131-night/next-approval-packet.json)
- [docs/research/gk80-main131-night/source-family-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/docs/research/gk80-main131-night/source-family-decisions.json)
- [Säilytetyt kolme regressiotestiä](https://github.com/ozirix-dev/Reseptit/blob/b89a891171566cd6c8553349fdd363db6e5a93a9/site/tests/nutrition-evidence.test.ts)

### PR #170

Operation141:n 30 kokoreseptikatselmointia, 17 skenaariota ja 15 numeerista ehdotusta säilyvät. Osa eteni mainin #171/#173/#175/#179/#183:n kautta. Jäljelle jäävät HOLDit ja soveltuvuudet kuuluvat nykyiseen #255:n lähdetyöhön.

Tarkistettu HEAD `87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/22. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/170).

- [docs/research/gk80-operation141/README.md](https://github.com/ozirix-dev/Reseptit/blob/87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051/docs/research/gk80-operation141/README.md)
- [docs/research/gk80-operation141/sources.json](https://github.com/ozirix-dev/Reseptit/blob/87c603bfe5ded3b1fe6af1abdaa5b0442ebc5051/docs/research/gk80-operation141/sources.json)

### PR #187

Vanhan 15 ehdokkaan approval-gate säilytetään päätöstaulukoineen. Kahden chilla-version nimenomainen omistajapäätös säilyy PR-kommentissa ja myöhemmät integraatiot #192/#193 ovat mainissa. Muut ehdolliset/lähde-HOLDit eivät vapaudu, jatko #255.

Tarkistettu HEAD `0aab0b9a11e57c6e6695dc871796c48282a6d3cf`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/14. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/187).

- [docs/nutrition/gk80-approval-gate/README.md](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/README.md)
- [docs/nutrition/gk80-approval-gate/approval-table.csv](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/approval-table.csv)
- [docs/nutrition/gk80-approval-gate/existing-approvals.json](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/existing-approvals.json)
- [docs/nutrition/gk80-approval-gate/owner-decisions.md](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/owner-decisions.md)
- [docs/nutrition/gk80-approval-gate/package-manifest.json](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/package-manifest.json)
- [docs/nutrition/gk80-approval-gate/pr-triage.csv](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/pr-triage.csv)
- [docs/nutrition/gk80-approval-gate/pr-triage.md](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/pr-triage.md)
- [docs/nutrition/gk80-approval-gate/proposals.json](https://github.com/ozirix-dev/Reseptit/blob/0aab0b9a11e57c6e6695dc871796c48282a6d3cf/docs/nutrition/gk80-approval-gate/proposals.json)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/187#issuecomment-6589357634)

### PR #219

Pav bhaji on jo mainissa PR #218:n kautta. #219:n rajattu vaihtoehtoinen builder ja hyväksyntäkuitti säilyvät. Samaa recipe-ID:tä ei integroida toistamiseen.

Tarkistettu HEAD `abe8a1da15c0af3b02ee1b509783f475ec2f8e42`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/5. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/219).

- [docs/nutrition/gk80-tehoajo-era1/approval.json](https://github.com/ozirix-dev/Reseptit/blob/abe8a1da15c0af3b02ee1b509783f475ec2f8e42/docs/nutrition/gk80-tehoajo-era1/approval.json)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/219#issuecomment-6599485773)

### PR #225

Käännösten 3.11.2026 masterplan säilytetään vanhan kattavuusbaselinen suunnitteluna. Mainin #260/#262/#263 toteuttaa laatupolitiikkaa, #270 ensimmäisen erän ja #272–#274 jatkavat. Toteutumattomat laatu- ja kattavuustavoitteet säilyvät viitteessä.

Tarkistettu HEAD `e841b0244aeb0d110fbf8efb0ce127ee0ee9d789`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/1. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/225).

- [docs/plans/2026-11-03-translation-coverage-quality-masterplan.md](https://github.com/ozirix-dev/Reseptit/blob/e841b0244aeb0d110fbf8efb0ce127ee0ee9d789/docs/plans/2026-11-03-translation-coverage-quality-masterplan.md)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/225#issuecomment-6600545501)

### PR #228

36 lähde-/pääsyvaihtoehdon selvitys on käyttökelpoinen lähdearkisto. #242 ja mainin #264/#265 jatkavat kuratointi- ja hakusuunnittelua, #255/#269 recovery-työtä. Lähteiden käyttörajoitukset säilyvät.

Tarkistettu HEAD `5cbd538587904fea02378a1773c2c8e1c24b6346`. Mainissa täsmälleen samoja muutettuja tiedostoja 0/1. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/228).

- [docs/nutrition/gk80-global-source-discovery-2026-11-03.md](https://github.com/ozirix-dev/Reseptit/blob/5cbd538587904fea02378a1773c2c8e1c24b6346/docs/nutrition/gk80-global-source-discovery-2026-11-03.md)

### PR #233

Viiden version julkaisu on mainissa #239:n kautta. Kaikki viisi ehdokas-JSONia ovat mainissa tavutasolla samoja. Päätös- ja lähdehistoria sekä vanha avoin B-menetelmähavainto säilyvät PR:ssä.

Tarkistettu HEAD `fa11a0c78e2af80ad5813bba672603dba7ff1f47`. Mainissa täsmälleen samoja muutettuja tiedostoja 10/13. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/233).

- [docs/nutrition/gk100-first-five-review.md](https://github.com/ozirix-dev/Reseptit/blob/fa11a0c78e2af80ad5813bba672603dba7ff1f47/docs/nutrition/gk100-first-five-review.md)
- [docs/nutrition/gk100-pr233-content-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/fa11a0c78e2af80ad5813bba672603dba7ff1f47/docs/nutrition/gk100-pr233-content-decisions.json)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/233#issuecomment-6615438239)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/233#issuecomment-6615697890)
- [Alkuperäinen omistaja-/katselmointikommentti](https://github.com/ozirix-dev/Reseptit/pull/233#issuecomment-6615764475)

### PR #234

Viisi toisen erän ehdokasta sisältyy mainin #240 eighteen-julkaisuun. Kaikki viisi ehdokas-JSONia ovat mainissa tavutasolla samoja. Vanha päätöstiedosto ja lähdeperustelut säilyvät.

Tarkistettu HEAD `7a2249f6286f49ef7daf9548b3fd31dc25d8f31b`. Mainissa täsmälleen samoja muutettuja tiedostoja 10/12. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/234).

- [docs/nutrition/gk100-pr234-content-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/7a2249f6286f49ef7daf9548b3fd31dc25d8f31b/docs/nutrition/gk100-pr234-content-decisions.json)
- [docs/nutrition/gk100-second-five-sources.md](https://github.com/ozirix-dev/Reseptit/blob/7a2249f6286f49ef7daf9548b3fd31dc25d8f31b/docs/nutrition/gk100-second-five-sources.md)

### PR #235

Kolmannen erän viisi ehdokasta ovat mainin #240-julkaisussa ja tavutasolla samat. Farinata-/Saníssimo-hyväksyntäkuittien alkuperäisversiot sekä sisältöpäätökset säilyvät commitissa.

Tarkistettu HEAD `118d8b8264ad57272dd1d5c03c609330871392f9`. Mainissa täsmälleen samoja muutettuja tiedostoja 10/14. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/235).

- [docs/nutrition/gk100-farinata-pan-approval.json](https://github.com/ozirix-dev/Reseptit/blob/118d8b8264ad57272dd1d5c03c609330871392f9/docs/nutrition/gk100-farinata-pan-approval.json)
- [docs/nutrition/gk100-pr235-content-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/118d8b8264ad57272dd1d5c03c609330871392f9/docs/nutrition/gk100-pr235-content-decisions.json)
- [docs/nutrition/gk100-sanissimo-tostada-approval.json](https://github.com/ozirix-dev/Reseptit/blob/118d8b8264ad57272dd1d5c03c609330871392f9/docs/nutrition/gk100-sanissimo-tostada-approval.json)
- [docs/nutrition/gk100-third-five-sources.md](https://github.com/ozirix-dev/Reseptit/blob/118d8b8264ad57272dd1d5c03c609330871392f9/docs/nutrition/gk100-third-five-sources.md)

### PR #236

Bún chả ja mapo tofu ovat mainin #240-julkaisussa. Ehdokas-JSONit ja alkuperäinen mapo-tutkimus ovat tavutasolla samat. Alkuperäinen sisältöpäätöstaulukko säilyy.

Tarkistettu HEAD `170393a3f2a9e6aa125bcfdd4267d3f1902ac0b5`. Mainissa täsmälleen samoja muutettuja tiedostoja 4/5. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/236).

- [docs/nutrition/gk100-pr236-content-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/170393a3f2a9e6aa125bcfdd4267d3f1902ac0b5/docs/nutrition/gk100-pr236-content-decisions.json)

### PR #238

Kuuden ehdokkaan paketti sisältyy mainin #240-julkaisuun. 12/13 muutettua tiedostoa on mainissa tavutasolla sama. Alkuperäinen kuuden sisältöpäätöksen tiedosto säilyy.

Tarkistettu HEAD `2cadbab5b73ab883d97254e9aa479acd1b4ffe3b`. Mainissa täsmälleen samoja muutettuja tiedostoja 12/13. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/238).

- [docs/nutrition/gk100-six-content-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/2cadbab5b73ab883d97254e9aa479acd1b4ffe3b/docs/nutrition/gk100-six-content-decisions.json)

### PR #269

Ensimmäinen 30 reseptin SQLite V3 -tutkimuserä on valmis erähistoria. Kahdeksan päätöksen valmistelu eteni #271:n kautta mainin #276-julkaisuun. 231 kyselyä, 61 käsittelemätöntä ID:tä ja Bánh xèon valmistus-HOLD siirtyvät jatkoviitteeksi aktiiviseen #255-jonoon. Kahdeksan julkaisua ei tarkoita kaikkien 30 kotireseptin ratkeamista.

Tarkistettu HEAD `2e6b46c2af777c7c76b773a07c55680a273f25d2`. Mainissa täsmälleen samoja muutettuja tiedostoja 1/6. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/269).

- [docs/nutrition/gk100-v3-batch01-factory-manifest.json](https://github.com/ozirix-dev/Reseptit/blob/2e6b46c2af777c7c76b773a07c55680a273f25d2/docs/nutrition/gk100-v3-batch01-factory-manifest.json)
- [docs/nutrition/gk100-v3-batch01-worklist.jsonl](https://github.com/ozirix-dev/Reseptit/blob/2e6b46c2af777c7c76b773a07c55680a273f25d2/docs/nutrition/gk100-v3-batch01-worklist.jsonl)

### PR #271

Kahdeksan version valmistelun seuraaja #276 on mainissa, #275:n V3.1-korjaukset mukaan lukien. 30/34 tiedostoa on mainissa tavutasolla sama. Loput neljä valmistelutiedostoa säilyvät, toteutunut v31-eight-julkaisukuitti on mainissa. Seitsemän tutkimusannosta ei lisää kotireseptien kattavuutta.

Tarkistettu HEAD `b45dc22324fe289fa67d0b403352b9c30c7124f5`. Mainissa täsmälleen samoja muutettuja tiedostoja 30/34. [Alkuperäinen keskustelu](https://github.com/ozirix-dev/Reseptit/pull/271).

- [docs/nutrition/gk100-v3-eight-decisions.json](https://github.com/ozirix-dev/Reseptit/blob/b45dc22324fe289fa67d0b403352b9c30c7124f5/docs/nutrition/gk100-v3-eight-decisions.json)
