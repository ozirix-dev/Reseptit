# Recipavo — käyttäjän omien reseptien automaattinen GK-laskenta

**Luonne:** tulevan käyttäjäominaisuuden vaatimus- ja arkkitehtuuriehdotus. Ei API-päätös, tuotantokäyttöönotto, tallennusmuutos tai henkilökohtaisen terveysennusteen toteutus.

## 1. Käyttäjän odotettu kulku

1. Käyttäjä liittää reseptitekstin, kirjoittaa ainekset tai avaa tallennetun oman reseptinsä.
2. Järjestelmä tulkitsee annokset, ainekset, määrät, vaihtoehdot, tarjottavat lisukkeet ja valmistusvaiheet. Alkuperäinen teksti säilyy koskemattomana käyttäjän päätökseen asti.
3. Kullekin ainesosalle normalisoidaan syötävä määrä ja valmistustila. Sovellus ehdottaa vain lähteistettyjä kappalepainoja eikä oleta geneerisesti, että “yksi avokado = 100 g”.
4. Kuratoidut koostumustietueet ja GI-soveltuvuudet haetaan. V1:n jo julkaistu paikallinen SQLite-indeksi palvelee GI-hakua; sen lähteenä oleva JSON säilyy kanonisena.
5. Laskentamoottori muodostaa oikean arvon tai osatuloksen ja arvioi epävarmuuden. Jos tärkeä tietojoukko puuttuu, sovellus kysyy **yhden kerrallaan** vaikutukseltaan tärkeimmän asian.
6. Käyttäjä vahvistaa tuotteen, määrän tai valinnan. Tuloksen lisäksi näytetään laskentaoletukset ja mahdolliset muutetut ohjetekstit.
7. Tallennetun reseptin muutokset lasketaan uudelleen. Henkilökohtainen tulos ei siirry julkisen Reseptit-sivuston hyväksytyksi GK:ksi automaattisesti.

### Kysymysten esimerkkejä

- “Tarkoittaako 200 g riisiä kuivaa vai valmiiksi kypsää riisiä?”
- “Kuinka paljon avokadon syötävää hedelmälihaa käytit? Voit valita oletusgrammamäärän tai punnita.”
- “Käytitkö maitoa vai kermaa? Molemmat voidaan laskea erikseen.”
- “Syödäänkö kastike ja keitinliemi kokonaan vai jääkö osa pois?”
- “Mikä suklaatuote ja makeutusversio on käytössä?”

Kysy vain kun vastaus vaikuttaa arvoon tai sen luotettavuuteen mielekkäästi. Täsmennyksen voi ohittaa; silloin avoin osuus säilyy näkyvänä.

## 2. Kolme erillistä kerrosta

**I. Lähdetotuus:** Git-versioitu ruoka-/GI-aineisto, riippumattomat ihmis-GI-havainnot ja nimenomaisesti arvioidut soveltuvuudet. Vuonna 2026 yhdistetty PR #259 tekee tästä aineistosta paikallisen SQLite-haun. Hakutulos ei ole hyväksyntä.

**II. Laskentamoottori:** puhdas deterministinen toiminto, joka saa reseptiversion, koostumuskentät, GI-soveltuvuudet ja menetelmäversion. Sama syöte ja versio tuottaa saman tuloksen ilman verkkoyhteyttä tai kielimallin improvisaatiota.

**III. Käyttäjäkokemus:** reseptin jäsentely, selitykset, kysymykset, tuotteiden valinta ja GK-esitys. Kielimalli voi ehdottaa tietuevastineita, mutta laskentaluvuiksi hyväksytään vain varmennetut lähdearvot ja sääntöversiot.

## 3. Minimimalli tietueille

Alla oleva rakenne kuvaa käsitteet, **ei** käskyä muuttaa nykyisiä rajapintoja sellaisinaan.

| Kohde | Kentät, vähintään |
| --- | --- |
| FoodSource | tunniste, lähdeversio, oikeudet, luokitus, lähde-URL |
| FoodComposition | elintarvike/tuote, grammaperusta ja ruoan tila, CHO-kentän natiivi määritelmä, sokereiden+tärkkelyksen määrä, kuitu, polyolit lajeittain, tuntemattomuusmerkit |
| GiObservation | alkuperäistutkimus, testattu ruoka/valmistus, asteikko, GI, otos, laatutieto, viiteasteikon mahdollinen muunnos, lähderivin paikka |
| Applicability | observationId, targetFoodKey, targetPreparationKey, käyttökohteen rajaus, päätös/luottamus, poikkeamat, arvioija, versionumero |
| RecipeInput | recipeId, omistajan alue, annokset, alkuperäinen teksti, ainesosat, määrät, yksiköt, syötävä massa, tuotteen ja valmistuksen valinnat |
| Contribution | foodId, sourceId, normalizedCHO, giInput, evidenceKind, gkContribution, status, avoin vaikutus, paino-/valmistusperuste |
| Result | methodVersion, recipeFingerprint, point tai scenarioRange tai partial, unresolved, assumptions, confidence, reference snapshot |

Jos valmistetun komponentin hiilihydraatit ovat GI-havainnon kohteena, komponentin ainesosien CHO jaetaan siihen yksikköön mutta niiden erillisiä GI-termejä ei muodosteta. Siksi tieto syötteen komponenttirajoista kuuluu reseptimalliin.

## 4. Laskentatilojen sopimus

Tulosta ei typistetä onnistui/epäonnistui-pareiksi.

- COMPLETE_POINT: kokonaisen nimetyn annoksen perusteltu piste, esitetään “laskennallinen GK-arvio”.
- COMPLETE_SCENARIOS: koko annoksen eri perustellut vaihtoehdot; käyttöliittymä kertoo tuote-/valmistuserot.
- COMPLETE_POINT_WITH_SCENARIOS: selvä käyttäjän perusvalinta sekä sen rinnalla skenaarioita.
- PARTIAL_KNOWN: vain jo laskettu osuus, ei koko annoksen lukua eikä matalan GK:n suodatusoikeutta.
- NEEDS_CLARIFICATION: tarkennus käyttäjälle yhdestä suuresta epäselvyydestä.
- RESEARCH_REQUIRED: vaikuttava lähdeaukko raporttiin, ei tekaistua GI:tä.
- INVALID: ristiriitainen massa, negatiivinen määrä, kielletty tietuetäsmäys tai kaksinkertainen laskenta.

Lisätilat kuten draft, reviewed, owner approved ja production authorized koskevat **julkisen** version hyväksyntäprosessia, eivät ravitsemuksellista arviointitilaa.

## 5. Käyttäjän priorisoitu kysymys

Avoimista osista valitaan tarkennus suurimman **ennakoitavan GK-vaikutuksen** perusteella. Jos CHO tunnetaan ja GI:n vaihtoehdot ovat lähteistettyjä, vaikutusarvio on delta_GK = CHO_per_serving * delta_GI / 100. Jos CHO on tuntematon, kysy massa/tuote; älä laske vaikutusta keksityillä luvuilla.

Tee priorisoinnissa sekä suhteellinen että absoluuttinen arvio. Ei turhia kysymyksiä nollahiilihydraattisista aineista, joilla on oikea lähdetodiste. Reseptin luokkarajan ylitys on merkittävä, vaikka GK-ero olisi pieni. Algoritmin tulos on selitettävä: miksi kysyttiin tämä aines eikä yrttien tarkkaa grammapainoa?

## 6. Versiointi ja uudelleenkäyttö

- Reusable source: sama mittaus ja sama valmistusta koskeva soveltuvuus voidaan löytää useaan reseptiin.
- Per-recipe result: muuttunut määrä, komponenttiraja tai tuote tuottaa uuden reseptin laskenta- ja syötetarkisteen. Tulosta ei kopioida toiseen reseptiin.
- Käännös ei saa muuttaa laskentaa. Kunkin kieliversion näyttää sama kanoninen resepti; jokainen sisältöversio säilyttää hyväksytyn julkisen reseptin sidontasäännöt.
- Lähteen semanttinen muutos tai menetelmäversiomuutos vanhentaa sen laskelmat hallitusti. Vanhat julkaistut GK:t eivät päivity automaattisesti ilman julkaisun päätöstä.
- Yksityisen käyttäjän oma muokkaus voidaan laskea heti; yksityinen raaka reseptiteksti tai henkilökohtaiset ruokavalintatiedot eivät kuulu julkiseen Git-rekisteriin.

## 7. Kustannukset ja järjestelmärajat

Ei pakollista uutta maksullista tietokantaa. Paikallinen, uudelleen rakennettava SQLite GI-hakua varten on jo toteutettu PR #259:ssä. Mahdollisen palvelinlaskennan ja pilvisynkronoinnin erillinen suunnittelu ei ole tämän dokumentin lupaa siirtää käyttäjän reseptejä tai tunnistetietoja ulkopuoliseen palveluun. Välttämätön tuotekohtainen ulkoinen haku tehdään erillisen käyttöoikeus- ja tietosuojapäätöksen mukaan.

Lähteistä saa tallentaa tarvittavat faktat ja viitteet niiden käyttöoikeuksien mukaisesti; ei bulk-kopioida lisensoitua kaupallista GI-taulukkoa. Henkilökohtaisen resepteen vaikutusta verensokeriin ei pidä markkinoida kliinisenä ennusteena.

## 8. Toimituspolku

M0 tutkimus- ja rajapintadokumentaatio -> M1 hiilihydraattien semantiikkakorjaus erillisessä toteutus-PR:ssä -> M2 kuratoitu GI-soveltuvuus PR #242:n pohjalta ja SQLite-adapteri -> M3 uusia reseptejä arvioiva read-only-putki PR #241:n pohjalta -> M4 yksityisten reseptien käyttöliittymä ja tarkennuskysymykset -> M5 rajattu käyttäjäpilotti. Kunkin vaiheen lopussa julkaistut GK-versiot tarkistetaan ilman koko repositorion tarpeettomia uusintatestejä.
