# Ehdotettu tekninen sopimus: read-only GK-estimaattikaista

**Vasta tulevan toteutus-PR:n malli, ei nykyinen API.** Tavoite on käyttää samoja ravintoarvo-/GI-faktoja kuin nykyiset laskentapolut ilman, että arvio muuttuu julkaistuksi GK:ksi väärän kentän kautta.

## 1. Minimikerrokset

- InputSnapshot: recipeId, recipeVersionHash, sourceLanguage='fi', servings, componentBoundaries, massState, foodRecordIds, nativeCarbohydrateDefinition, sourceHashes.
- EvidenceSnapshot: GI observationId (source, year, table/row, scale, measured food, preparation, n/quality), applicabilityId + applicabilityVersion (kohteen food/preparationKey, erot, hyväksyjä, käyttöraja), mahdollinen hyväksytty codingPolicyVersion.
- ModelEstimate: methodVersion, inputHash, evidenceSetHash, ingredient contributions, evidenceCoverage, unresolved, status, numeric point / named scenarios / null, diagnostics, generation timestamp.
- PublicationDecision: status NOT_REVIEWED / REVIEWED / OWNER_AUTHORIZED / WITHDRAWN, reviewedHash, reviewer, scope, copyVersion, date, decisionReference. Älä sekoita tätä laskennan valmistumiseen.

Yksityisen Recipavo-reseptin userScope on erillinen; henkilötietoja, käyttäjän ruokapäiväkirjaa, raakatekstiä tai yksityisiä tuotevalintoja ei kirjoiteta julkiseen Git-repoon.

## 2. Ehdotettu JSON-muotoinen tulos (luonnos)

```json
{
  "schemaVersion": "GK_MODEL_ESTIMATE_V1",
  "recipeId": "example",
  "methodVersion": "MODEL_GK_V1_PENDING_APPROVAL",
  "inputHash": "sha256:...",
  "evidenceSetHash": "sha256:...",
  "servings": 2,
  "calculationStatus": "GI_APPLICABILITY_REVIEW",
  "publicationStatus": "NOT_REVIEWED",
  "pointPerServing": null,
  "scenariosPerServing": null,
  "ingredients": [],
  "unresolved": [],
  "review": null
}
```

Tämä on käsitteellinen rajapinta, ei lupa muuttaa vanhan JSON-skeeman kenttiä. 'null' tarkoittaa ettei numeerista arvoa ole, ei GK 0. C-herkkyyskokeella on oma WHAT_IF_ONLY-tulostyyppi ja erillinen tulostuspolku. B:n julkaisukytkentä hyväksyy vain menetelmäversion mukaisen B-tyypin, jonka julkaisutarkiste sitoo syötteen, lähteet, menetelmän, laskentatuloksen ja esitysversion samaan päätökseen.

## 3. Arviointialgoritmi

1. Hae kanonisen FI-reseptin annokset ja ainesmäärät (ei suoraan HTML:stä). Kytke laskenta-JSON vain, jos sen sourceHash vastaa reseptin ravintosyötteen tarkistetta. Sido myös reseptitekstin ja koostumuspaketin omat tarkisteet arvioon. Jos jokin sidos vanhenee, palauta STALE_INPUT.
2. Muunna ruoan massa syötäväksi grammamääräksi ja saatavaksi CHO:ksi sen omalla koostumussopimuksella. Säilytä polyolit erikseen. Epäselvä muunnos -> NEEDS_CLARIFICATION.
3. Määritä **yksi** ei-päällekkäinen laskentayksikkö kullekin hiilihydraattimassalle: valmis komponentti TAI ainesosa. Tarkista koko erän CHO-tase/annos; ei kaksoislaskentaa.
4. Hae GI Knowledge Basesta ehdokkaat read-only. Valitse vain täsmäävät, versiollisesti katselmoidut soveltuvuudet. Jos niitä ei ole, luo GI_APPLICABILITY_REVIEW tai RESEARCH_REQUIRED. Älä pyydä kielimallia generoimaan GI:tä.
5. Lasketut termit: GK_i/annos = (erän saatava, GI-testiperustaan sopiva CHO_i / annokset) * GI_i/100. Tarkistettava summien uudelleenlaskenta Decimal-aritmetiikalla. Valmisteen GI kattaa vastaavan kokonaiskomponentin, ei sen yksittäisiä aineksia toistamiseen.
6. Jos jokainen positiivinen CHO-termi on ratkaistu ja kaikki termit läpäisevät menetelmäversion portit, muodosta MODEL_POINT_REVIEWABLE tai MODEL_SCENARIOS_REVIEWABLE. Muuten point=null, listaa osasumma vain tutkimusta varten.
7. Review tarkistaa hashit ja lähdekäytön. Omistajan päätös tarvitaan julkisen Reseptit-sisällön julkaisuun. Mikä tahansa määrä-, valmistus-, koostumus-, GI-, soveltuvuus- tai menetelmämuutos vanhentaa luvan.
8. Julkiselle sivulle siirretään vain nimenomaisen B-julkaisustatuksen sisältävä luku. Legacy-GK-funktioille ei syötetä tätä tulosta A-tilaan.

## 4. Integroitavat nykyiset osat

| Nykyinen osa | Jatkotoimi, ei tässä PR:ssä |
| --- | --- |
| site/scripts/nutrition-model.ts, nutrition-evidence.ts | Tarkista CHO-merkitykset ja polyolit; älä muuta olemassa olevaa available-kenttää suoraan |
| docs/nutrition/glycemic-index-records.json + SQLite-cache | Käytä versionhallittua GI-havainto-/soveltuvuushakua; indeksi on johdettu |
| site/scripts/glycemic-load-model.ts | Pidä legacy-A:n laskenta- ja valvontapolku ennallaan |
| site/scripts/gk-estimated-range.ts | Hyödynnä laskentaideaa mutta älä nosta mitä tahansa complete-skenaariota automaattisesti julkaistuksi |
| site/src/features/recipes/gk-estimate.ts | Erottele A:n julkaistu laskelma B:n julkaistusta malliarviosta omassa myöhemmässä adapterissa |
| site/src/features/recipes/glycemic-load-display.ts | Legacy-palautetyypin muuttaminen B:ksi ilman erillistä discriminatoria kielletään |
| GK100 Approval Factory & versionCoverage | Pidä B-erillisjulkaisut ja laskuri omana tietonaan |
| Recipavo reseptituonti, PR #295 | Syötä samaan estimaattiytimeen normalisoidut ainekset; yksityinen what-if vain suostumuksella |

## 5. Eristyssäännöt ja sovelluksen copy

- Julkisen reseptin A voi näkyä entiseen tapaan. Jos B koskee samaa reseptiä, sivulla saa näkyä vain **yksi ensisijainen** GK-esitys: A on ensisijainen, B ei ohita sitä; tarvittaessa B on erillisessä lähteitä avaavassa paneelissa.
- B-näkymässä FI: 'Arvioitu GK: noin X / annos. Laskettu ainesosien GI-vastineista. Ei mitattu juuri tällä reseptillä.' EN/SV/TH käännetään merkitysvastaavaksi eikä numerolaskentaa toisteta.
- Ei uuden B-luvun käyttöä keto-/VHH-päätelmänä, 'matala GK' -hakusuodattimena, rikastetun reseptin health-claimina, SEO-JSON-LD:n nutrition-kenttänä tai nykyisen GK80 prosenttilaskurin kasvattajana V1:ssä.
- Jos B-arviota ei ole hyväksytty, voi käyttäjäystävällisesti näkyä: 'GK ei vielä arvioitavissa — merkittävä GI-vastine puuttuu.' Älä näytä laskettuna '0' tai epämääräistä 'matala'.
- Käyttäjän omassa Recipavossa erota 'arvioitu' ja 'muuta oletuksia'. What-if-liukusäädin saa tuottaa lukuja vain aktiivisen kokeilun kontekstissa, eikä tallenna niitä viralliseksi ravintoarvoksi.

## 6. Jäljitettävyys ja regressiosuoja

Ehdokaspaketti on deterministinen muuttumattomilla lähdesnapshoteilla. SourceHash, applicabilityVersion, policySha256, recipeVersionHash ja calculatorVersion muodostavat auditoitavan kokonaisuuden. Julkaisun peruminen asettaa WITHDRAWN ja poistaa julkisen B-luvun; se ei koske A:n hyväksyttyä lukua. Hallittu uudelleenarviointi voidaan tehdä riveittäin ilman koko repon skannausta. Soveltuvuusrekisterin muutos tuottaa vain vaikutuspiirissään olevien reseptien uusintalaskentajonon.
