# Operaatio 147:n toistaminen

Työkalut ovat tutkimusprototyyppejä. Ne eivät kirjoita reseptejä, lähderekistereitä, aktiivisia moottoreita, tuotannon generoitua moduulia tai hyväksyntöjä. Kaikki ajot tehdään oikeaksi varmennetussa Reseptit-worktreessä, tulokset ulkoiseen scratch-hakemistoon. Väliaikainen GK-moottorikopio on vain kahden rajan herkkyyskoetta varten.

## Syötteet ja ajot

Tarvitaan Node/tsx ja sivuston lukitut riippuvuudet sekä Python 3. Decimal-laskenta käyttää vain standardikirjastoa. `extract-afcd.py` käyttää read-only-openpyxliä; tarvittaessa käytä Codexin bundled Pythonia. Sivustobuildia ei tarvita.

PowerShell-esimerkki, aseta oma tarkistettu worktree-polku:

```powershell
$repo = 'D:/Projects/tmp/reseptit-operation147-method-audit'
$scratch = 'D:/Temp/operation147-repro'
$auditTools = Join-Path $repo 'docs/research/operation147/tools'
$tsx = Join-Path $repo 'site/node_modules/tsx/dist/cli.mjs'
python 'C:/Users/ossi/.codex/repo-guard/repo_guard.py' --project ozirix-dev/Reseptit --path $repo check
# Jatka vain PASSin jälkeen. Jos riippuvuuksia ei ole, npm ci --ignore-scripts
# kyseisen worktreen site-hakemistossa; cache ulkoiseen scratch-hakemistoon.
node $tsx "$auditTools/baseline.mts" $repo "$scratch/run"
Copy-Item -LiteralPath "$repo/docs/research/operation147/production.json" -Destination "$scratch/run/production.json"
node $tsx "$auditTools/gk-sensitivity.mts" $repo "$scratch/run"
python "$auditTools/scenarios.py" $repo "$scratch/run" "$scratch/review"
node $tsx "$auditTools/diagnostics.mts" $repo "$scratch/review"
python "$auditTools/verify.py" $repo "$scratch/review"
```

Vertaa `summary.json` ja kaikkia 326 ID:tä tallennettuun aineistoon. Aikaleima ja auditointi-PR:n oma HEAD voivat vaihtua. Vertaa laskennan syötehashit [input-manifest.json](../input-manifest.json)-tiedostoon: nykyinen menetelmä-/lähde-/reseptisnapshot ratkaisee toistettavuuden. Tämän aineiston lähtö-main oli `c127a715186d1d10820ae210f8cbff7d982b4444`; eri syötteiden tulos on uusi tutkimus, ei vanhan tuloksen vahvistus.

`production.py <external-output-directory>` tekee uuden lukevan HTTP-otoksen 326 FI-sivusta ja GK-yhteenvetosivusta (enintään kuusi samanaikaista pyyntöä). Älä käytä sitä jokaisen paikallisen laskennan yhteydessä: yllä oleva toisto käyttää tallennettua tuotantosnapshotia. Uusi tuotanto-otos voi tarkoituksellisesti poiketa jäädytetystä mainista. HTTP-virhe kirjataan UNKNOWN, ei terveeksi nollaksi.

Virallisen AFCD-XLSX:n voi ladata [tästä](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx) ulkoiseen scratchiin. `extract-afcd.py <xlsx-path>` tulostaa tarkat solupaikantimet ja lähdehashin. Vertaa hashiin [afcd-definition-extract.json](../afcd-definition-extract.json). Lähdetiedostoa ei muuteta eikä tallenneta tähän PR:ään. Puuttuva arvo ja lähteen nolla säilyvät erillisinä.

## Mitä kukin työkalu tekee

| Työkalu | Tehtävä ja raja |
| --- | --- |
| `baseline.mts` | Lukee julkaistut FI-lähteet ja käännökset, batch-jäsenyyden ja nykyisen makronäytön; kutsuu suljettujen erityispakettien olemassa olevat loaderit. Kopioi GK-pilotin vain raportin valmistumiseen asti ja suuntaa importit varmennettuun worktreehen. Ei käytä public-module-kirjoitusta. |
| `gk-sensitivity.mts` | Luo scratchiin viisi kahden rajavakion vaihtoehtoa ja käyttää muuten samoja GK-portteja. Tulokset ovat menetelmäehdokkaita, hyväksyntää ei siirretä. |
| `scenarios.py` | Summaa tavallisten makroinputtien kentät riippumattomasti Decimalilla, säilyttää S0:n rakennevirheet, tunnistaa S1/S2:n kentät, laskee sitruunakanan nimetyn S3-pilotin ja S6:n kenttäunionin. S4/S5:n nollalisäys tarkoittaa nykyisistä täydellisistä inputeista osoitettua tulosta; ilman inputtia oleva resepti on UNKNOWN. Ei väitä kattavaa kaikkien mahdollisten mapitusten hakua. |
| `diagnostics.mts` | Muistissa tehtävät hash-mutaatiot, nykyisten muunnosestojen ja Fineli-annosmassojen inventaario sekä AFCD-parikenttien tarkastusjoukko. |
| `verify.py` | Sovittaa kaikki 326 × 10 skenaarioriviä yhteenvetoon, tarkistaa yhdeksän yksilöityä uutta kenttää ja varmistaa alkuperäiset syötehashit sekä muutosrajauksen. Ei anna menetelmä- tai tuotantohyväksyntää. |
| `production.py` | Vain julkisen tuotantotiedon luku. GK-yhteenveto luetaan keskussivulta, ei reseptipayloadista puuttuvasta kentästä. |

S3:n katot sisältävät lähdekoostumuksen oletuksen. Sitruunan raakakuori/ulkokuori-vastaavuutta tai kaikkien erien koostumusta ei ole todistettu. GK:n 0–150-vaste on nimetty koeskenaario, ei biologinen luottamusväli. S3:n ja GK-rajojen lisäehdokkaita ei saa nimetä PASSiksi vain tämän laskennan perusteella.

## Tarkistusrajat

Skriptit lukevat repo-koodia, joten tarkista työskentelyhakemisto ja importattu versio ennen ajoa. Repo_guard ei sandboxaa mielivaltaista ohjelmaa. Tämän PR:n skriptit ajavat ulkoiseen Git-työpuun ulkopuoliseen scratchiin. Käyttöönottoon, version sidoksiin tai tulosten aktivointiin tarvitaan erillinen hyväksytty toteutus. Älä suorita alkuperäistä `glycemic-load-pilot.ts`-CLI:tä tämän ohjeen korvikkeena: sen loppu kirjoittaa julkisen generated-moduulin.
