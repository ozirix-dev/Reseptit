# Operaatio 149 V2: hyväksyttyjen GK-versioiden integraatio

**PR #183 on Draft. Menetelmä ja 16 täsmällistä versiota on hyväksytty integraation pohjaksi. Ei Ready-, merge- tai deploy-valtuutusta.**

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

Kikherneletun ihmisillä mitattu Cheela-havainto on jatkoselvityksen kohde, ei vielä uusi hyväksytty numero. Lajit, fermentointi ja valmistus pitää sovittaa. Alkuperäisen30 ehdotuksen tavoite on edelleen kesken: hyväksytyssä integraatiossa16; erillinen uusi ehdotus1, joten yhteensä17 ehdotusta ja13 puuttuu. Uusi ehdotus tarvitsee oman hyväksynnän.

## Tarkistusnäyttö ja rajaukset

- Kohdennetut hyväksyntä-, lähde-, Decimal-, 326 tuloksen regressio-, kieli- ja versiokattavuustarkistukset läpäisivät.
- Koko julkaisu-build läpäisi721 reittiä. Todellisen annosskaalauskorjauksen jälkeen Vite + esirenderöinti toistettiin; turhaa ravintoarvolaskennan kokonaisajoa ei toistettu.
- Brave:31 olemassa olevaa resepti-/kielisivua ja4 menetelmäsivua; näppäimistön details-ohjaus, annosskaalaus ja320/390/1280px reflow läpäisivät;0 JavaScript-virhettä.
- Ulkoasu käyttää olemassa olevia paneeleita, värejä ja typografiaa. Ossin kahdeksaa perustamuistiota käytettiin hierarkian, luettavuuden, komponenttien, saavutettavuuden ja tokenien taustana. Ei uusia kuvia, fontteja tai irrallista tyylijärjestelmää.
- Käännökset ovat automaattisesti laadittuja ja rakenteellisesti tarkistettuja; ihmisellä tehtyä kielikatselmointia ei väitetä.
- Täsmällisen lopullisen HEADin normaali PR-CI tarkistetaan GitHub Checksistä. Ei manuaalista Actions-uusinta-ajoa.
- Ei uusia makropidätyksiä, alkuperäisten pidätysten purkua, Readyä, mergeä, deployta, muiden PR:ien muutoksia tai ReportHub-muutoksia.

`validation.json` erottaa paikallisen näytön ja CI:n. Tuotantokattavuus pysyy156/326, kunnes erikseen hyväksytty julkaisu on oikeasti varmennettu tuotannosta. Tämä erä on tekninen Draft-integraatio, ei julkaisupäätös.
