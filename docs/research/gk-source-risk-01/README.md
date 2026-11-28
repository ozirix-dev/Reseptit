# GK-lähdesidosten määrällinen riskiseulonta 01

Tila: **AUDIT / HISTORICAL INPUT ONLY / NO RUNTIME APPROVAL**. Omistaja Chat-3. Päivä 25.11.2026. Lähtömain `2075b8430b6320feef6ebe181f3f84b6cd56c0ce`.

Tämä jatkaa GK-006:n 45 kortin tutkimuspakettia (#1003) ja [Chat-2:n koko korpuksen riskiseulontaa](https://github.com/ozirix-dev/Reseptit/pull/982#issuecomment-7159080055). Se ei muuta niitä, aktiivisia syötteitä, laskentaa tai hyväksyntöjä. Tässä paketissa lasketaan **määrällinen priorisointi** 326 alkuperäiselle reseptille ja kaikille 64 GI-lähdekortille. Ei nykyisten julkisten tulosten auditointia.

- `risk-screen.json`: pinnatut syötteet, kaikki 326 reseptikohtaista yhteenvetoa ja 64 lähdekortin käyttötilasto, ainesosakohtaiset tarkastusrivit ja priorisoidut jonot.
- `verify.mjs`: vain luku, Node 22; tarkistaa viiden syötteen Git-blobit, toistaa täsmälleen saman seulonnan ja vertaa JSONia tavutasolla. Ei uutta CI-porttia.

## Menetelmä ja tulos

```json
{
  "recipes": 326,
  "ingredientRows": 2464,
  "assignedGiRows": 700,
  "knownGiRows": 699,
  "unknownGiRows": 1,
  "referenceOnlyAssignedRows": 0,
  "missingMatchKeys": 145,
  "missingMatchKeysNonCategory": 8,
  "mismatchedPresentKeys": 5,
  "excludedRows": 827,
  "explicitEstimateOrBoundRows": 588,
  "unresolvedCompositionOrMassRows": 17,
  "pointCarbRows": 1618,
  "rangeCarbRows": 2,
  "knownPositiveMissingGiRows": 639,
  "knownMissingGiAtLeast1gRows": 129,
  "knownMissingGiAtLeast10gRows": 46,
  "categoryProxyAtLeast10gRows": 103,
  "analogueAtLeast10gRows": 14,
  "missingCompositionIdRows": 0,
  "recipesWithAssignedGi": 285,
  "assignedKnownGiIds": 51,
  "screenedRecipeCount": 253,
  "screenedIngredientCount": 606
}
```

Ainesosakohtainen saatavan HH:n suuntaa-antava määrä = pinnatun koostumuskortin saatava HH /100 g × syötemassa / annosmäärä. EU_AVAILABLE-kenttä käytetään sellaisenaan; ainoa EU_TOTAL_INCLUDING_POLYOLS-tietue käsitellään vain lähdevarmennetulla polyolimäärällä. Poissuljettua ainesosaa ei esitetä mitattuna koostumuksena, vaikka sen syötteessä on koostumuskortti. Sen erillinen arvio tai yläraja säilyy. Tuntematon ei ole nolla. Kaksi eksplisiittistä koostumusväliä säilytetään väleinä; priorisointi käyttää niiden yläpäätä. Pyöristys 6 desimaaliin, ei tuotannon Decimal-laskennan korvaaja.

Tuotantokoodin `canonicalGkFoodRecords` tunnistaa historiallisen sitruunamehun kaksoiskortin ja valitsee jälkimmäisen, ja glycemic-load-pilot.ts lisää joulutorttujen katselmoidun erillisen tuorejuustokortin. Molemmat huomioitu tässä rajatussa tutkimuksessa, pinnatulla aineistolla. Ei uutta rekisterikorjausta niiden takia.

1 g raja on tarkastusjono puuttuvalle GI:lle, ei automaattinen päätös: tuotannon oikeat yksittäis- ja kumulatiiviset rajat, poikkeukset, range-sidokset ja historialliset hyväksynnät ratkaisevat. 10 g on vain toimituksellinen korkean vaikutuspotentiaalin seulontaraja. Kategoria-/analogiarivit eivät ole todettuja virheitä. Lähdekohtainen knownCarbExposureGSum on eri reseptien ainesosa-annoslukujen summa vain jonon järjestämiseen, ei yhden annoksen ravintoarvo tai väestöaltistus. Puuttuvat kategoriavaimet voivat olla mallissa sallittuja; liput voivat olla päällekkäisiä. Ei lasketa GK-pisteitä, annosvasteita, hyväksyntää tai julkaisustatusta. Myös nykyisen mallin pieni-omissio-, perhe- ja soveltuvuusportit jäävät ennalleen.

## Korjausjärjestys

1. Aiemmin yksilöity mantelimaito ja char siu (hoisin sekä riisiviinietikka) tarkastetaan ensin; ks. [työluovutus](https://github.com/ozirix-dev/Reseptit/pull/982#issuecomment-7159257220).
2. Puuttuvan GI:n vähintään 10 g/annos rivit ja korkean altistuksen kategoria-/analogiarivit, etenkin jauhatus, nuudelit, valmistusmuoto ja tuoteidentiteetti. Osa voi jo olla ratkaistu erillisellä hyväksytyllä versiolla; tarkista canonical capture ensin.
3. Tomaattien 39 valmistustavan tutkimusjono (#1003); avainristiriidat ja puuttuvat ei-kategoria-avaimet arvioidaan reseptikohtaisesti.
4. Puuttuvan koostumuksen tai massan rivit, lähde- ja soveltuvuustarkastus, jäljellä olevat pienet altistukset. Tuntemattomasta massasta ei päätellä pientä vaikutusta.

Ennen aktiivista muutosta tarvitaan nykyisen puhtaan checkoutin canonical capture, map/source/impact, julkiset alkuperäis- ja varianttitulokset sekä kaikki range- ja historiariippuvuudet. Älä korjaa automaattisesti avaimia, kopioi ryhmä-GI:tä tuotteelle, täytä puuttuvia arvoja nollalla tai sido uusia hyväksyntähasheja tämän raportin perusteella. Pidä vanhat historialliset sinetit. Tarkistimen voi ajaa suoraan pinnatuilla tiedostoilla ilman npm-asennusta; se ei käynnistä sovellusta. Tutkimuspaketti ei ole uusi laskentamoottori.

## Näytön aste

Seulontafunktio ajettiin GitHubista luetuilla pinnatuilla syötteillä ja sen keskeiset rakenteelliset lukumäärät verrattiin Chat-2:n raporttiin. Node-tarkistimen varsinainen ajo oikeassa checkoutissa ja riippumaton katselmointi ovat vielä erilliset vaiheet.
