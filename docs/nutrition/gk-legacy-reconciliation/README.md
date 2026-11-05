# Vanhojen GK-PR:ien nyky-main-sovitus

Vertailupohja on `081ba2c95f9243c1ed72206073160f9e64992e96`. Tämä on yksi koottu Draft-sovitus PR:ille #229, #133, #182 ja #226. Vanhoja kokonaisia syöte-, sidos-, testi- tai käyttöliittymätiedostoja ei palauteta. Alkuperäiset Git-haarat, kommentit ja hyväksyntähistoria säilytetään. Mainiin yhdistäminen ja deploy eivät kuulu tämän työn valtuuksiin.

| PR | Nykyinen ratkaisu | Jäljelle jäävä päätös |
| --- | --- | --- |
| #229 | Kokonaisskenaarioiden laskin ja sen regressiot sovitettu nykyiseen versiosopimukseen. Auditissa erotetaan pisteet, vaihteluvälit ja puuttuvat arviot. Tutkimusannosvertailut pysyvät erillään eivätkä korvaa alkuperäisohjeen arviota. Nykyinen vaihteluvälipaneeli ja #283:n alkuperäisohjeen suodatin säilyvät. | Historiallisen bindaetteok-ehdotuksen soveltuvuus ja julkaisu vaativat oman katselmointinsa. Sitä ei lisätä julkaistuihin versioihin. |
| #133 | 8 massa-/identiteettikorjauksen ehdokaspatchia sovitettu nykyisiin riveihin: bulgogi, baozi, Yangzhou-riisi ja koshari. Baozin 8 g perunatärkkelyssidos vaihtuu ehdokkaassa 7 g maissitärkkelys-ID:hen 27. Muita nykyisiä koostumussidoksia ei palauteta vanhasta haarasta. | 17 GI-poistoehdotusta odottaa valmistusmatchin päätöstä. Tomaatti-kananmuna-wokin kaikki 5 vanhaa ehdotusta ohitetaan nykyisen hyväksytyn EHOLD-käsittelyn säilyttämiseksi. Ehdokaslaskenta ei hyväksy uusia lähteitä tai julkaise GK:ta. |
| #182 | Kolme AFCD:n available CHO -kenttää korjataan ilman sokerialkoholeja ilmoitetuiksi. Persikkakulhon piste 4,08 → 3,97, näyttö edelleen noin 4. Vadelman osuus muuttuu, pellavapuuro pysyy lähdepuutteellisena. | Käyttäjä valtuutti tämän rajatun numeerisen korjauksen Draftiin. Polyolien kokonaiskattavuuden väitteet ja #181:n laajempi menetelmäpäätös säilyvät erillisinä. Ei julkaisuvaltuutta. |
| #226 | 4 nykyisiin riveihin sovitettua ehdokaspatchia: masala dosan peruna, sinapinsiemenet ja currylehdet sekä paputostadan avokado. Avokado käyttää nykyistä 0,77 g/100 g koostumusta: 0,462 g CHO/annos. Perusteeton avokadon GI poistuu ehdokkaasta. | Raakakoostumuksen siirto keitettyyn perunaan, valmistusanalogian soveltuvuus, mausteiden poisjätöt ja tortillan lähdepuute on katselmoitava ennen uutta julkaisua. |

## Aktiivinen korjaus ja arvosuoja

`baseline.json` sitoo kaikki 326 aiempaa tulosobjektia, 87 täyttä GK-versiota sekä makroinventaarion. Ainoat sallitut aktiivisten tulosten erot on lueteltu kenttäkohtaisesti kahdelle #182:n reseptille. Muut 324 täyttä tulosobjektia, kaikki 87 versiota ja 326 makropakettia säilyvät identtisinä. GI-rekisteri, laskentamoottori, reseptitekstit, käännösten SHA-snapshotit ja hyväksyntäkuitit säilyvät.

Viisi curry-/kimchiversiota sitoi koko food-records.json-tiedoston tarkisteen, vaikka niiden omat hyväksytyt koostumusluvut eivät käytä kolmea korjattavaa tietuetta. Yhteensopivuussovitin sallii vain alkuperäisen ja täsmällisen korjatun tiedostoversion. Kolmen kentän palautus tuottaa alkuperäisen SHA-256:n. Osittainen korjaus, muu lähdemuutos, väärä tiedosto ja tuntematon odotettu hash estetään. Alkuperäisiä hyväksyntöjä ei kirjoiteta uudelleen.

Vanhojen julkaisuerien testit käyttävät omaa muuttumatonta lähdeversiotaan. Erillinen nykytilan regressio tarkistaa kaikki 326/87 tulokset, makrot sekä siirtymän negatiiviset kontrollit. Historiallisten odotusten sovitus ei vapauta nykytilan portteja.

## Ehdokkaiden toistaminen

`candidates.json` sisältää 12 täsmäpatchia ja jokaisen alkuperäisen ehdotuksen käsittelypäätöksen. `site/scripts/legacy-gk-corrections.ts` tarkistaa nykyisen syötetiedoston LF-SHA:n ja muodostaa ehdokkaat muistissa. Se ei kirjoita syötteitä, julkaisutietoja, sidoksia eikä hyväksyntöjä. Syötteen muuttuminen estää vanhojen patchien käyttämisen.

Toista repon `site`-hakemistossa: `npx tsx scripts/legacy-gk-corrections.ts`. Tuloksen `publicationAuthorized` ja `sourceApprovalGranted` ovat false. Esimerkiksi korjattu bulgogi ja masala dosa voivat saada raakaa laskentatulosta, mutta niiden nykyinen julkinen GK pysyy lähdepuutteellisena. Laskennallinen tulos ei ole lähde- tai julkaisuhyväksyntä.

## Historiallinen aineisto

- [#133:n lähdearvio, 30 muutosesitystä, 326 reseptin inventaario, viisi erillistä ravintoarvoehdotusta ja HOLD-päätökset](https://github.com/ozirix-dev/Reseptit/blob/020b665582f4f1ec54e56ec978581e424adc6ace/docs/nutrition/gk-r2-review.md). Vanha 83/326-tilanne ei ole nykyinen tuotantotilanne. Inventaarion työkalua ja vanhoja 326 sidosta ei oteta nykyiseksi oletukseksi.
- [#229:n 33 reseptin seulonta, bindaetteok-skenaarion lähde- ja valmistusrajaukset sekä laskentapäätökset](https://github.com/ozirix-dev/Reseptit/blob/2b50b18af9b473337d7ddad8d37a660547f1d63d/docs/nutrition/gk80-estimated-ranges-2026-11-03.md). Toistettava ehdollinen laskenta säilyy tutkimusskriptinä ja testeissä; se ei ole hyväksytty nykyinen GK-versio.
- [#226:n alkuperäinen rajattu muutos ja tutkimuspäätökset](https://github.com/ozirix-dev/Reseptit/commit/cba54cfdc00b73460c7d8b9686bc97bcbc90d834). Nykyinen avokadon koostumus ja julkaisun pidätys näkyvät uudessa ehdokaspaketissa.
- [#182:n alkuperäinen lähdekorjaus ja päätöshistoria](https://github.com/ozirix-dev/Reseptit/commit/924a827b515f4d4e27d70389837e22f904d38c1f). Kolmen solun lähdekoordinaatit, alkuperäistarkiste ja riippumaton Decimal-tarkistin säilyvät `../afcd-field-bindings/`-hakemistossa.

Toisen nopeus-/GK100-ajon työpuihin tai haaroihin ei kirjoiteta tämän sovituksen yhteydessä.
