# GK100 Approval Factory V1

Factory tarkistaa enintään 30 ehdokasta yhdellä ajolla ja tekee SHA-sidotun erämanifestin. Se lukee ehdokkaat nimetystä Git-commitista. Laskenta, ainesosat, lähteet ja kielitekstit tulevat ehdokas-JSONista, eikä niitä ylläpidetä manifestissa käsin. Käytä jokaiselle erälle omaa tunnistetta.

## Tarkista erä

Aja `site`-hakemistossa. Esimerkki lukee viisi ehdokasta olemassa olevasta commitista, jonka on oltava paikallisessa Git-objektitietokannassa.

```powershell
npm run --silent gk:approval-check -- check d7fe3644aaf1adaf6b69b6923f47fa02345b890a ../docs/nutrition/gk100-approval-factory-example.json
npm run test:gk100-approval
```

Tulos on JSON-manifesti. [Esimerkkituloste](gk100-approval-factory-example-manifest.json) näyttää tarkistuksen tuloksen. Näytä omistajalle sen `batchId`, `manifestSha256` ja ehdokasrivit. Jokaisella teknisesti kelvollisella rivillä on annosmäärä, piste tai nimetty skenaarioväli, lähteet, epävarmuus, sisältömuutos (kun luokittelu on toimitettu), tila ja mahdollinen este. Pelkkä esimerkkisyöte antaa teknisen tuloksen eikä sisällä hyväksyntöjä.

- `CANDIDATE` on syötteeseen luettu ehdokas ennen ajoa. `TECHNICALLY_VALID` tarvitsee vielä luokittelutiedot.
- `REVIEW_REQUIRED` edellyttää riskin mukaista katselmointia. `OWNER_DECISION` tarvitsee nimetyn sisältöpäätöksen, ja `READY_FOR_APPROVAL` voidaan esittää osana erähyväksyntää.
- `OWNER_APPROVED` edellyttää päätöstietuetta, ja `RELEASE_READY` lisäksi yhteensopivuutta nykyiseen mainiin. `BLOCKED` koskee yksittäistä ehdokasta.
- Factory tulostaa valmistelutiloja. `PUBLISHED` kuuluu tuotantovarmennukseen. Kirjaa se vasta, kun julkaistun sivuston kaikki neljä reseptireittiä näyttävät juuri valmistellun version `data-gk-version`-tunnisteen ja odotettu kattavuusmuutos on varmennettu tuotannosta.

## Luokittelijan sopimus

Syöte käyttää muotoa `{schemaVersion:1,batchId,candidates:[{recipeId,packetPath,classification?}]}`. Luokittelijan tiedot voi liittää lukutilassa sen luovutuksesta. Factory ei muuta luokittelijan lähdetiedostoja.

- `candidateSha256` on ehdokas-JSONin SHA-256 UTF-8-tekstistä LF-rivinvaihdoilla.
- `risk` on `LOW`, `MEDIUM` tai `HIGH`. `reasons` on perustelulista. `contentChange` on `NONE`, `GK_ONLY` tai `ORIGINAL_CHANGE` ja `contentSummary` kuvaa täsmällisen muutoksen ja tarvittavan päätöksen. GK-only-julkaisuportti estää alkuperäisen reseptin muutokset.
- `outcome` on `REVIEW_REQUIRED`, `OWNER_DECISION`, `READY_FOR_APPROVAL` tai `BLOCKED`. `review` sisältää `depth`-tason `LIGHT`, `FOCUSED` tai `DEEP` sekä `evidence`-viitteen todelliseen katselmointiin. Perustelun tulee kattaa lähdeoikeudet, GI-soveltuvuus, kielen ja sisällön rajaus sekä poisjättöjen olennaisuus. Teknisen tarkistuksen riskisignaalit voivat vaatia vahvemman katselmoinnin.
- Nimetty vaihteluväli, GI-koodaus tai positiivinen CHO-poisjättö vaatii vähintään kohdennetun katselmoinnin. GI 100 -stressiluku ilmoittaa poisjätetyn CHO:n laskennallisen vaikutuksen yhdellä oletuksella. Koko aterian heikko analogia, hallitseva epävarmuus ja turvallisuus- tai käyttöoikeusongelmat kuuluvat korkean riskin katselmointiin.
- Nykyinen adapteri lukee GK80 Operation80- ja GK100-piste-/skenaariopaketit, joissa on `inputs`, `boundFiles`, `preparation` ja `limitation`. Vanhojen monen tiedoston GK80-julkaisupakettien laskenta säilyy olemassa olevassa GK80-putkessa. Luokittelijan on toimitettava niille erikseen GK-only-ehdokas ja sen tarkistettavat syötteet ennen tämän portin käyttöä. Tuntematon tai vanhentunut luokittelutulos pysähtyy rivikohtaisesti.
- Jokainen ainesosarivi sidotaan syötteeseen, pienosuuden poisjättöön, skenaariokorvaukseen tai perusteltuun poissulkuun. Uuden paketin `exclusions`-rivi sisältää `ingredientIndex`, `kind` (`ZERO_CHO` tai `ALREADY_COUNTED`), `rationale` ja `evidencePath` (pakettiin tarkisteella sidottu laskentamuistio). Katselmointi vahvistaa perustelun. PR #233:n vanhojen poissulkujen yhteensopivuus koskee vain niiden täsmällisiä pakettitarkisteita.
- Rakennetarkistus vahvistaa viitteiden muodon, tyypit, tiedostotarkisteet, syötesidokset, annokset, yksiköt, aritmetiikan ja neljän kielen kenttien olemassaolon. Lähteen saatavuus, GI-soveltuvuus ja käännösten laatu ovat katselmointiin kirjattavaa näyttöä.

## Kirjaa päätökset ja valmistele julkaisu-PR

Kirjaa käyttäjän päätöksistä erillinen JSON, jonka `schemaVersion` on 1 ja `manifestSha256` on omistajalle esitetyn manifestin tarkiste. Jokaisessa `records`-tietueessa on `recipeId`, `candidateSha256`, `originalSha256`, `inputSha256`, `decision` (`APPROVE`, `REJECT`, `RETURN`) ja `evidence` (viite nimenomaiseen omistajapäätökseen). Päätöksen voi jättää puuttumaan. Päätöstiedoston kirjaaja vastaa viitteen ja valtuutuksen aitoudesta. Tarkisteet sitovat sisällön, ja Git-katselmointi suojaa päätöstiedostojen muutoksia.

Main-vertailun syöte on `{schemaVersion:1,mainSha,numericRecipeIds}`. Ota tunnisteet nykyisestä, puhtaalla main-työpuulla tuotetusta `tmp/nutrition/glycemic-load-pilot.json`-raportin `versionCoverage.numericRecipeIds`-kentästä. Kirjaa mainin täysi SHA raporttia tuotettaessa. Käytä tuoretta raporttia ja hae main-objekti ennen valmistelua.

```powershell
npm run --silent gk:approval-check -- prepare CANDIDATE_COMMIT batch.json decisions.json main-coverage.json
```

Komento tarkistaa GitHubin nykyisen mainin ja valitsee vain hyväksytyt yhteensopivat versiot. Tulos sisältää pois jääneiden rivien syyt, odotetun kattavuusmuutoksen, kopioitavat paketti- ja evidenssitiedostot tarkisteineen sekä valmiin `bundle`-kentän. Varmista main uudelleen ennen Draft PR:n avaamista. Tee oma release-haara mainista, tuo vain valitut uudet tiedostot ja tallenna bundle julkaisun valmistelua varten. Alkuperäisiä reseptejä ei kopioida eikä muuteta.

Tuotantokytkentä lukee vain `docs/nutrition/gk100-approved-releases/*.json`-tiedostoja. Kun omistaja on erikseen valtuuttanut juuri tämän bundlen tuotantokytkennän, sijoita sille kyseiseen hakemistoon tiedosto, jossa on `bundle` sekä `authorization: {schemaVersion:1,bundleSha256,evidence}`. Käytä repo guardin kirjoitus-, commit-, push- ja Draft PR -toimintoja. Hyväksytyt variantit kulkevat olemassa olevan GK-only-generaattorin kautta. Se tarkistaa uudelleen paketit ja päätökset ja estää päällekkäisen numeerisen kattavuuden. Factory-komento tulostaa valmistelun aineiston. PR:n avaaminen ja mahdollinen myöhempi yhdistäminen tapahtuvat omissa hyväksytyissä Git-toimissaan.

## Rajat ja läpivienti

V1:n päätös- ja luokittelutiedot tuodaan JSON-sopimuksella. Suora luokittelijaintegraatio ja automaattinen tuotantovarmennus ovat jatkotöitä. Läpivientiharjoitus käytti PR #233:n viittä oikeaa ehdokasta ja jo kirjattua omistajapäätöstä. Viisi versiota läpäisi valmisteluportin ja laskennallinen kattavuus kasvaisi 207:stä 212:een. Tuotantovaltuutus säilyi epätotena. Erillisessä 25 ehdokkaan testissä yksi este ja hyväksymättömät rivit jäivät pois valmistelupaketista. Tehdas ei muuta reseptisisältöä eikä tee sisältöpäätöksiä. Julkaisukytkennän hakemistoa ei oteta käyttöön tämän PR:n mukana.
