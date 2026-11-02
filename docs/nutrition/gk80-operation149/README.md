# Operaatio 149 V2: hyväksyttyjen GK-versioiden integraatio

**PR #183 on Draft. CONDITIONAL GO koskee vain16 jo hyväksytyn täsmällisen version integraatiota.14 uutta ehdotusta odottavat erillistä hyväksyntää. Ei Ready-, merge- tai deploy-valtuutusta.**

## Nykytila

Tuotannosta varmennettu lähtötila on 156/326 (47,85 %). Tämän Draftin sivustototeutuksen ehdokaskattavuus on **172/326 (52,76 %)**: 156 alkuperäistä numeerista tulosta ja 16 uutta, erikseen nimettyä GK-versiota (10 A + 6 B). Kukin resepti lasketaan kerran. Kaikkien 326 alkuperäisen version laskentatulokset ja resepti-, käännös- ja makroaineistot säilyvät ennallaan. Alkuperäisversioiden 170 keskeneräistä tulosta eivät muutu hyväksytyiksi uuden version perusteella.

Omistajan nimenomainen Kyllä ja täsmällinen 16 syötteen rajaus on kirjattu `owner-approval.json`:iin. Hyväksynnän lähde- ja menetelmäviite on HEAD `7127c0014edd525ac2ced97cf36b3eb511032ae2`. Kuusi hyväksyttyä lähde-/syötetiedostoa säilytetään muuttumattomina ja validoidaan sisällön hasheilla. `cases.json`:n suljettu pilottiprofiili ja `method-proposal.md`:n ennen hyväksyntää kirjoitettu otsikko ovat tämän jäädytetyn viiteaineiston historiallinen tila; nykyinen päätös ja valtuutus ovat erillisessä hyväksyntäkirjauksessa.

## Integroitu erä

| Resepti | Taso | GK/annos tai ehdollinen lähdeskenaario | Pois jätetty CHO g/annos (A) |
| --- | --- | --- | --- |
| keto-mutakakku | A | 0.07 | 1.377 |
| keto-suklaakeksit | A | 0.03 | 1.311 |
| vhh-juustokakku | A | 0.63 | 0.701 |
| palak-paneer | A | 1.79 | 1.250 |
| paneer-tikka | A | 3.07 | 1.250 |
| kana-parmesaanipannu-parsakaali | A | 1.06 | 0.048 |
| kermainen-kanasienipannu | A | 0.74 | 1.173 |
| vhh-pyttipannu | A | 2.60 | 0.846 |
| vhh-mansikkakakku | A | 1.11 | 0.780 |
| vietnamilainen-pho-ga-aamuksi | A | 24.96 | 0.500 |
| congee-riisipuuro | B | 31.09 | 0.000 |
| valimerellinen-halloumi-tomaattileipa | B | 12.84–17.77 | 0.000 |
| jauheliha-makaronilaatikko | B | 16.91–17.76 | 0.000 |
| japanilainen-kabocha-puuro | B | 35.42 | 0.000 |
| malesialainen-laksa-lemak-aamiaiseksi | B | 27.55 | 0.000 |
| malesialainen-kaya-paahtoleipa | B | 18.37–23.31 | 0.000 |


Taulukon arvot ovat laskentatuloksia; käyttöliittymä merkitsee pisteet likiarvoiksi ja pyöristää skenaariovälien rajat ulospäin. A:n positiivista poisjättöä ei oleteta vaikutuksettomaksi. Poisjättöjen ylärajat pyöristetään käyttöliittymässä ylöspäin, myös pienissä jälkiruokien arvioissa. B:n lähdeskenaario, projektin koodaus ja GI 0–150 -oletusherkkyys erotetaan; viimeinen ei ole biologinen yläraja tai luottamusväli.

`gk149-integration.ts` hyväksyy vain täsmälliset 16 hyväksyttyä syötettä. Se muodostaa laskenta-ajossa erillisen GK-versiorekisterin. Reseptisivuilla ja menetelmäsivuilla näkyvät version omat määrät, valmistustarkennukset, LOW-luottamus, lähteet ja makrojen erillisyys FI/EN/SV/TH-kielillä. Versio ei peri alkuperäisen ohjeen ravintoarvoja. Alkuperäistä reseptiä ei korvata hiljaisesti.

Annosmäärän säätö skaalaa saman version ainesluettelon ja valmistustekstin määrät yhteisestä syötteestä. GK/annos, lähteiden GI:t ja valmistusajat eivät muutu annosmäärän mukana. Suolan kaltaiset nollahiilihydraattiset alkuperäisen ohjeen määrät merkitään erikseen. Kayan hillo- ja lisäkemunat erotellaan.

## Paras etenemistapa kohti 80 prosenttia

| Tapa | Tästä erästä avautuva hyöty | Päätös |
| --- | --- | --- |
| Nykyinen A-laskenta ja täsmällinen GK-versio | 10 reseptiä | Käytetään aina kun lähde- ja poisjättösäännöt täyttyvät |
| Hyväksytty GK-only-sopimus ja rajatut B-analogiat | Lisäksi 6 reseptiä | Toteutettu erillisenä versiokerroksena |
| Täyden makropaketin odottaminen kaikille | Ei lisähyötyä näille GK-only-tapauksille | Makrojen puute ei yksin pysäytä GK:ta, eikä makroja keksitä |
| Yleinen ruokalajikeskiarvo tai mielivaltainen GI puuttuville aineksille | Ei hyväksyttävää numeerista näyttöä | Ei käytetä kattavuuden kasvattamiseen |
| Yhteinen lähde ratkaistaan useille täsmällisille valmistusversioille | Suurin tunnistettu jatkotyön kohdejoukko | Valittu seuraavaksi työjärjestykseksi; ei etukäteen luvattua numerotuottoa |

80 % edellyttää vähintään **261/326**. Tuotannosta puuttuu 105; integroidun Draftin jälkeenkin puuttuisi 89. Jäljellä olevista 154 reseptistä 47:n ensisijainen este on tärkkelyksen valmistus, 26:n nimetyn ruoan valmistusvastaavuus ja 22:n tuote-/massatiedot. Nämä ovat 95 erillistä reseptiä, eivät 95 valmista GK-tulosta. `shared-blocker-queue.json` sisältää kaikki 154 ilman päällekkäisiä reseptejä.

Seuraava työjärjestys on: tarkka valmistus- ja tuoterajaus, natiivi saatava hiilihydraatti, nimetty ihmisillä mitattu vertailuruoka tai hyväksyttävä rajattu koodaus, itsenäinen laskenta, versio-/käännössovitus ja koko erän sisältökatselmointi. Raakajauhon GI:tä ei päätellä suoraan leivän tai pannukakun GI:stä. Merkittävä reseptin luonteen muutos tuodaan omistajalle.

Lähteiden uudelleenkäytön ensimmäinen uusi tulos on `additional-proposal.json`: kahvijogurtti **GK ≈ 10,92/annos**, LOW, erillinen hyväksymätön ehdotus. Kondensoidulle maidolle löytyi nimetty Table1/936-havainto (GI61), banaanille Table1/1088 (GI47); makeutettua maitoa ei mallinneta makeuttamattoman maitotuotteen koodilla30. Jogurtin30 on erikseen arvioitava nykyisen koodauksen sovellus. Kahvin0,3g/annos on dokumentoitu A-poisjättö. Uusi ehdotus ei ole sivustoimportissa eikä mukana172:ssa. PDF-sivujen63 ja73 rivikohdistus tarkistettiin kuvasta; SEM ei muodosta reseptin vaihteluväliä.

Kikherneletun Cheela-havainto on sovitettu kahteen erikseen ehdotettuun, kokonaisista kikherneistä jauhettuun versioon. Ne eivät ole kaupallisen kuoritun besanin hyväksyntä eivätkä vielä hyväksyttyjä julkaisunumeroita. Lajit, fermentointi ja valmistus on rajattu lähdepalautuksen katselmoinnissa. Suljettu valmisruoka-/komponenttipilotti ja kaksi uutta ainesosareitin sovellusta lisäävät8 laskentaehdotusta: hyväksytyssä integraatiossa16; erillisiä uusia ehdotuksia14, yhteensä30 eri reseptin ehdotusta. Laskentaehdotusten määrä ei ole julkaisuvalmiiden tai hyväksyttyjen lähdesovellusten määrä. [Lähdevastaavuuden päätösmatriisi](source-match-matrix.md) pitää6 valmisruoka-/komponenttisovellusta lähde-HOLDissa ja8 muuta ehdotusta erilliseen katselmointiin odottamassa; yhtäkään14:stä ei integroida. Uudet14 tarvitsevat oman koko erän sisältö- ja menetelmäkatselmointinsa. Katso [viiden version lähdepalautus](recovery-review.md); aikaisempi kahvijogurtti on erillinen kuudes ehdotus.

## Uusi valmistetun ruoan B-pilotti

[30 ehdotuksen koonti ja14 uuden version katselmointi](prepared-route-review.md) tunnistaa mitatut vertailuruoat, dokumentoi olennaiset erot ja laskee GK:n version omasta annoskohtaisesta saatavastaCHO:sta. Koko ruoan GI ja valmistetun komponentin GI pidetään erillään.900g kypsää riisiä on erillinen punnittu ehdotus, ei oletettu300g kuivan riisin saanto. Kaksi kypsän riisin koostumusta ovat vaihtoehtoja; näyttö30–45 ei kata lähderuoan tuntematonta GI-vastaavuusvirhettä. IFCT:n Table6 currylehtikenttä3,66 erotetaan Table1:n erotuslaskennasta4,51.

Kahdeksan uutta laskentaehdotusta: Chettinad1,42; kaakao-kookos-chia1,59; biryani30,60–44,94; baozi31,56; Margherita59,16; roti jala19,62; upma27,63; taatelipuuro21,64. Kaikki ovat hyväksymättömiä LOW-malleja. Kuusi käyttää valmistetun ruoan/osan GI-vertailua; nämä kuusi ovat lähdevastaavuuden päätösmatriisissa HOLDissa. Erän laskenta ja lähde-/syötehashit on lukittu `proposal-batch.json`:iin. Tuotanto156 ja nykyinen ehdokas172 säilyvät; kaikkien14 hyväksyntä ja myöhempi onnistunut integraatio mahdollistaisivat186/326:n.

## Rajattu julkaisukatselmoinnin viimeistely

- Pienet alle1:n pisteet näytetään muodossa **laskettu osuus alle1**, ei0,03:n tai0,07:n näennäisellä tarkkuudella. Taustalaskelmat ja hyväksyntähashit eivät muutu. Positiivinen poisjättö näkyy heti arvon alla,ylöspäin yhteen desimaaliin pyöristettynä: mutakakku ja keksit enintään1,4gCHO/annos. Teksti kertoo,että pois jätetty osuus voi kasvattaa kokonais-GK:ta.
- Alkuperäisohjeiden kattavuus on **156/326 (47,85%)**, puuttuvia170. Vähintään yhden täsmällisen version ehdokaskattavuus on **172/326 (52,76%)**, puuttuvia154. Raportin `coverageViews` ja käyttöliittymä erottavat nämä näkymät.16 erillistä versiota eivät muuta alkuperäisohjeiden tuloksia.
- Alkuperäisen ohjeen ravintoarvopaneeli nimetään erikseen ja sen yhteydessä kerrotaan näkyvästi,ettei se ole GK-only-version makropaketti. Erottelu on FI/EN/SV/TH-kielillä. Arvoja,evidenssiä tai pidätyksiä ei siirretä versioiden välillä.
-14 ehdotusta pysyvät lähde-/sisältökatselmointia odottavina.186/326 (57,06%) on vain kaikkien14:n mahdollisen myöhemmän hyväksynnän ja onnistuneen integraation ehdollinen ylätilanne,ei nykyinen ehdokas tai tuotantoluku. Kuusi lähde-HOLDia estää tämän olettamisen valmiiksi eräksi.30 käyttökelpoisen julkaisuehdokkaan tavoitetta ei merkitä valmiiksi pelkän laskennan perusteella.

## PR #182:n vaikutus ennen julkaisua

Tarkistettu main on `4a804757d5f9732938928dcba8f79ea0674ad98c`. [PR #182](https://github.com/ozirix-dev/Reseptit/pull/182),HEAD `924a827b515f4d4e27d70389837e22f904d38c1f`,on erillinen avoin Draft. Sen kahdeksalla muutostiedostolla ei ole mekaanista päällekkäisyyttä tämän PR:n muutostiedostojen kanssa.

**Semanttinen riippuvuus on silti todellinen.** Hyväksytyn `composition-sources.json`:n erytritolitietue on sidottu koko `docs/nutrition/food-records.json`:n hashiin `2f8ff76b97848294c28195bb92c6d202e9754168ddb169d30ee5e8610d2c2b9b`. PR #182 muuttaisi tiedoston hashiksi `361a945c3d6702ec64529dff267f8cd849ba0a8a14fd42ee6798d189a619dcd3`. Gitin täsmällisistä commit-objekteista varmennettiin,että Foodin-erytritolitietue säilyy identtisenä; muuttuvat vain kolme AFCD-hiilihydraattiarvoa. Nykyinen koko tiedoston sidonta pysäyttäisi silti GK149-validoinnin. Sitä ei ohiteta tai kirjoiteta hyväksytyn lähdepaketin päälle.

PR #182:n korjaus muuttaisi myös persikkakulhon4,08→3,97 sekä pidossa olevan pellavapuuron osalaskentaa; numeerinen reseptimäärä pysyisi156:ssa. Siksi tämän PR:n nykyinen326 alkuperäistulosobjektin identtisyysväite ei sellaisenaan soveltuisi uuteen mainiin. Tarvitaan rajattu lähdesidonnan päätös ja kahden oikeutetun lähdekorjauksen erillinen regressiopohja,ei yleistä regressiopoikkeusta.

**Julkaisuehto:** tarkista main ja PR #182 uudelleen ennen PR #183:n lopullista julkaisupäätöstä. Jos #182 yhdistetään,älä käytä tämän HEADin CI:tä tai vanhaa lähdesidontaa automaattisesti muuttuneelle mainille. Ratkaise sidonta ja tarkista muuttuneen HEADin tarpeelliset portit. Tässä ajossa ei yhdistetä tai muuteta kumpaakaan PR:ää tämän riippuvuuden vuoksi,eikä käynnistetä ylimääräistä Actions-ajoa.

## Tarkistusnäyttö ja rajaukset

- Kohdennetut hyväksyntä-, lähde-, Decimal-, 326 tuloksen regressio-, kieli- ja versiokattavuustarkistukset läpäisivät.
- Koko julkaisu-build läpäisi721 reittiä. Todellisen annosskaalauskorjauksen jälkeen Vite + esirenderöinti toistettiin; turhaa ravintoarvolaskennan kokonaisajoa ei toistettu.
- Brave:31 olemassa olevaa resepti-/kielisivua ja4 menetelmäsivua; näppäimistön details-ohjaus, annosskaalaus ja320/390/1280px reflow läpäisivät;0 JavaScript-virhettä.
- Ulkoasu käyttää olemassa olevia paneeleita, värejä ja typografiaa. Ossin kahdeksaa perustamuistiota käytettiin hierarkian, luettavuuden, komponenttien, saavutettavuuden ja tokenien taustana. Ei uusia kuvia, fontteja tai irrallista tyylijärjestelmää.
- Käännökset ovat automaattisesti laadittuja ja rakenteellisesti tarkistettuja; ihmisellä tehtyä kielikatselmointia ei väitetä.
- Täsmällisen lopullisen HEADin normaali PR-CI tarkistetaan GitHub Checksistä. Ei manuaalista Actions-uusinta-ajoa.
- Ei uusia makropidätyksiä, alkuperäisten pidätysten purkua, Readyä, mergeä, deployta, muiden PR:ien muutoksia tai ReportHub-muutoksia.

`validation.json` erottaa paikallisen näytön ja CI:n. Tuotantokattavuus pysyy156/326, kunnes erikseen hyväksytty julkaisu on oikeasti varmennettu tuotannosta. Tämä erä on tekninen Draft-integraatio, ei julkaisupäätös.
