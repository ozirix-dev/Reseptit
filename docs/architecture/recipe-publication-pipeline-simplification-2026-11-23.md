# Recipavo: reseptijulkaisun, ravintolaskennan ja GK-tutkimuksen erottaminen

**Omistaja:** Chat-1 (arkkitehtuuri ja integraatio)
**Päivä:** 2026-11-23
**Tila:** Toteutuksen lähtöauditointi; EI julkaisuporttien muutos eikä hyväksytty käyttöönotto
**Lähtö-main:** `74a576b725f31cc85c16e4dd3f234a5e6c0b41cb`
**Esimerkki:** PR #904, piña colada -hedelmäjäätelö
**Omistajuusraja:** Älä muuta #904:n tai muiden aktiivisten chattien haaroja.

## Todennetut riippuvuudet

1. `site/package.json`: `build` → `content:prepare` → `content:sync` → `audit:nutrition --strict` → `audit:glycemic-load` → `typecheck` → `vite build` → `prerender`. `audit:glycemic-load` ajaa sekä `glycemic-load-pilot.ts` että `prepare-routes.ts`.
2. `site/scripts/prepare-routes.ts` tuo generoidut `gk-only-variants.generated`, `glycemic-load-pilot.generated` ja `glycemic-load-filters.generated` -moduulit. Näitä ei voi irrottaa ilman, että reittigeneroinnin syötteet tuotetaan toisella todistetulla tavalla.
3. `site/scripts/nutrition-audit.ts` käy läpi kaikki julkaistut FI-reseptit ja kaikki `docs/nutrition/calculations/*.json`-tiedostot; se vaatii olemassa olevalle evidenssille myös batch-manifestin. `--strict` pysäyttää `CONFLICT REQUIRES REVIEW` -tilanteet.
4. `site/scripts/validate-changed-content.ts` tarkistaa muuttuneen reseptin nykyiset reitit, hyväksynnät, karanteenin ja käännösten semantiikan. Jos laskentaevidenssi on olemassa, `verifyNutritionEvidence` ajetaan ja virheet estävät julkaisun **myös silloin, kun kaikki neljä julkista makrokenttää puuttuvat**. Jos evidenssiä ei ole eikä julkisia makroja muuteta, tämä kohta ei vaadi uutta laskentatiedostoa.
5. `site/scripts/select-ci-checks.mjs`: mikä tahansa `reseptit/**/*.md` aktivoi `addNutritionChecks` ja `addGlycemicChecks`; molemmat asettavat `runBuild` ja laajemmat testit. `.github/workflows/pages.yml` ajaa lisäksi täyden buildin, ja content-sync-only -haarassa erilliset auditoinnit.
6. #904:n epäonnistunut `Recipe site #45082079948` pysähtyi `validate-changed-content`-vaiheeseen: laskentasyötteen sourceHash ei vastannut ja laskentaprovenienssi oli puutteellinen. #904:n erillistä reseptikohtaista korjausta EI tehdä tässä PR:ssä.

## Tavoiteltu minimimuutos

### A: Tavallinen julkaisu ilman numeerisia makroja ja GK:ta

- Julkaisuun vaaditaan nykyiset `new-recipe-preflight`, SHA-sidottu toimituksellinen hyväksyntä, lähde, ainesosat, annokset, ruokaturvallisuus, allergeenit, kuva, karanteeni/F25, reitit ja CI.
- **Ei** uutta `docs/nutrition/calculations/<id>.json`-tiedostoa eikä batch-manifestia. Numeeriset ravintoarvot jätetään kokonaan pois; null ei tarkoita nollaa. GK `unavailable`.
- Säilytä nykyiset hyväksytyt historialliset laskennat. **Älä** jätä jo olemassa olevaa virheellistä evidenssiä hiljaisesti huomiotta. Jos vanha evidenssi muuttuu tai uusi virheellinen evidenssi lisätään, sen tarkistus pysyy fail-closed.
- Uuden reseptin `nutrition_evidence` voi viitata riippumattomaan **tietoisen poisjätön** katselmointiin; se ei ole laskentatiedosto eikä tekaistu laskelma.

### B: Julkaistavat numeeriset ravintoarvot

- Säilytä `nutrition-evidence.ts`, `nutrition-model.ts`, täsmäversion sourceHash, yksiköt, saanto/retentio, tuotekohtaiset lähteet ja laskenta-/batch-hyväksynnät.
- Julkaistujen makrojen lisäys/muutos, laskentatiedoston muutos ja laskentamoottorin muutos käynnistävät asianomaiset täydet evidenssi- ja regressiotarkistukset. Älä hyväksy laskentaa pelkän validin JSON-rakenteen perusteella.

### C: GK

- Säilytä GK-lähteiden hyväksyntä, vanhat F25/HOLD- ja karanteenisäännöt, GI-lähteet, versiosidokset ja numeerisen GK:n portit.
- Erota `glycemic-load-pilot.ts`:n generoitujen moduulien **tuottaminen** varsinaisesta koko tietokannan tutkimus-/hyväksyntäauditoinnista vasta riippuvuustestin jälkeen.
- `prepare-routes.ts` on ajettava jokaisessa tuotantobuildissa ajantasaisilla, varmennetuilla generoiduilla syötteillä; ei vanhoja tai puuttuvia moduuleita.

## Turvallinen toteutusjärjestys

1. **Nykykäytöksen regressiot ennen tuotantopolun muuttamista:** uusi FI-resepti ilman numeerisia makroja/evidenssiä läpäisee; numeeriset arvot ilman laskentaa pysähtyvät; muutettu tai virheellinen olemassa oleva laskenta pysähtyy; GK puuttuu ≠ nolla; karanteeni/F25 estää; käännös- ja kuva-SHA-portit säilyvät.
2. **Rajaa `select-ci-checks.mjs` riskin mukaan.** Tavallinen FI-sisältömuutos saa pakollisen buildin ja julkaisun tarkistukset; laskenta/GK-koodin, datan, evidenssin tai hyväksyntäskeeman muutokset laajat testit. Tämän optimoinnin on oltava fail-closed tuntemattomille poluille.
3. **Erota buildin `content:prepare` kahteen todistettuun vaiheeseen:** välttämättömien reitti-/GK-generointien tuotanto sekä erillinen tiukka ravinto/GK-auditointi. Ennen tätä kartoita `glycemic-load-pilot.ts`-tiedoston kaikki generoidut ulostulot ja niihin sidotut validointisäännöt. Ei välimuistiin jäävää historiallista GK:ta uuden lähteen tilalle.
4. **Säilytä tiukka koko kannan auditointi** erillisessä pakollisessa työnkulussa, joka laukeaa laskentakoodin, skeeman, hyväksyntärekisterin ja GK-yhteislogiikan muutoksista; lisäksi ajastettu koko kannan ajo. Ei pakollisten GitHub-checkien poistamista tai uudelleennimeämistä ilman branch protection -muutoksen arviointia.
5. **Yksi paikallinen preflight-komento**: suorittaa lähde-/katselmointi-/kuva-/käännös-/karanteeniportit, riskin mukaiset laskentatarkistukset ja buildin ennen PR:ää; generoi vain johdettavat tiedot. Ei toista laskentamoottoria eikä rinnakkaista hyväksyntäjärjestelmää.
6. Testaa nykyinen main ja uusi haara samoilla fixtureillä ja CI-ympäristöllä. Mittaa manuaalisten tiedostojen määrä, virheellisten kierrosten määrä, CI-kesto ja läpimeno. Vasta onnistuneen regressiovertailun jälkeen Repo Guard Ready/merge/main-CI/Cloudflare.

## Hyväksyntämatriisi

| Muutos | Pakollinen |
| --- | --- |
| FI-resepti ilman numeroita | Lähde, ruokaturvallisuus, annos/aika, toimituksellinen SHA-hyväksyntä, kuva, reitit, käännösstatus, karanteeni/F25, build |
| Numeeriset makrot | Edelliset + laskennan versionmukainen provenienssi, laskentatarkistus, batch-/julkaisuhyväksyntä |
| GK-numerot | Edelliset soveltuvin osin + GI/GK-lähde ja reseptiversion hyväksyntä |
| Julkaistun käännöksen muutos | Koko FI→käännös-parin semanttinen hyväksyntä ja tiivisteet |
| Laskentamoottori/skeema | Täysi ravinto- ja tarvittaessa GK-regressio |
| GK-/reitityslogiikka | Täysi GK- ja reitti-/staattinen integraatiotesti |
| Tuntematon yhteinen koodipolku | Täysi fail-closed CI |

## Rajaus ja käyttöönotto

Tämä ensimmäinen commit on **todellisiin main-tiedostoihin sidottu lähtöauditointi**, ei toiminnallinen yksinkertaistus. Älä muuta `site/package.json`-buildia ennen GK-reittigeneroinnin riippuvuuden regressiotestiä. Älä muuta `nutrition-evidence.ts`-porttia niin, että jo olemassa oleva virheellinen laskentatiedosto lakkaa näkymästä. Toiminnallinen muutos ja sen testit lisätään **tähän samaan erilliseen PR:ään**, ei #904:ään. Tämä PR pidetään Draftina, kunnes toiminnalliset regressiot ja CI ovat todistetusti vihreät.
