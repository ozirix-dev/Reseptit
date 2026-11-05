# Toistaminen

Työkalut lukevat varmennettua Reseptit-worktreeä. Tulokset ja lähdevälimuisti kirjoitetaan Git-työpuiden ulkopuolelle. Aktiivisia moottoreita, reseptejä tai rekistereitä ei kirjoiteta eikä hyväksyntöjä siirretä. `verify.py` on pelkkä luku/tarkistus.

Tarvitaan Node/tsx ja Python, jossa on openpyxl. Auditointi käyttää vain openpyxlin read-only-lukua ja standardikirjastoa. Codexin bundled Python sisältää openpyxlin; muita asennuksia ei tämän ajon vuoksi tehty. Työkalu ei tarvitse sivustobuildia.

Esimerkki PowerShellissä (polut ovat tämän ajon varmennettuja polkuja):

```powershell
$repo = 'D:/Projects/tmp/reseptit-afcd-polyol-01-current'
$dossier = Join-Path $repo 'docs/research/afcd-polyol-01'
$scratch = 'D:/Temp/afcd-polyol-01-repro'
$python = 'C:/Users/ossi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$tsx = 'D:/Projects/Products/Reseptit/site/node_modules/tsx/dist/cli.mjs'
python 'C:/Users/ossi/.codex/repo-guard/repo_guard.py' --project ozirix-dev/Reseptit --path $repo check
# Jatka vain PASSin jälkeen.
& $python "$dossier/tools/fetch-sources.py" "$dossier/source-manifest.json" "$scratch/sources"
node $tsx "$dossier/tools/numeric-probe.mts" $repo "$scratch/probe.json"
& $python "$dossier/tools/audit.py" $repo "$scratch/sources" "$scratch/review" --cohort "$dossier/cohort.json" --probe "$scratch/probe.json"
& $python "$dossier/tools/verify.py" $repo "$scratch/review" "$dossier/cohort.json"
```

tsx-polku on jo asennettu riippuvuus samassa Reseptit-repossa. Loaderia luetaan; toisen checkoutin resepti- tai moottoritiedostoja ei suoriteta. Varsinaiset moottori-importit tulevat aina `$repo`-argumentin worktreestä. Jos käytät toista asennettua tsx-polkua, muuta vain loaderin polku.

Jäädytetty main on `4a804757d5f9732938928dcba8f79ea0674ad98c`. Uusi lähdehash tai muuttunut resepti/input on uusi auditointisnapshot. `fetch-sources.py` pysähtyy, jos virallisen latauksen tavut muuttuvat. Vanha julkaisupäivä tai sama Release 3 -nimi ei ohita tätä tarkistusta.

## Aineistot

- `cohort.json` säilyttää PR #180:n alkuperäiset 172 ID:tä ja 127 native-ID:tä sekä tarkistetut commitit. Se ei väitä, että riippuvuudet olisivat yhä samat.
- `source-decisions.csv`: 138 native-ID:tä, lähdearvot kerran ja nykyisten todellisten riippuvuuksien määrä. `referenced_recipes` sisältää myös ohitetut viitteet; `dependent_recipes` sisältää vain `used=True`-rivit.
- `normalization-variants.csv`: normalisoinnin tunniste sisältää arvot, määritelmän ja polyoliväitteen. Eri arvoversioita ei yhdistetä paikallisen ID:n perusteella.
- `recipe-dependencies.csv`: 979 viiteriviä; `used=False` tarkoittaa nykyisen laskentapolun ohittamaa source-viitettä. Arvot säilyvät lähdetaulussa, rivillä on vain kerroin ja viitteet. Kertoimen yksikkö on (syöty g / annos) / 100 g.
- `recipe-effects.csv`: 228 katselmointiriviä. Viiden alkuperäisjoukon reseptin AFCD-riippuvuus on poistunut ja neljällä muulla reseptillä on vain ohitettuja viitteitä. Nämä eivät ole uusia laskentavirheitä.
- `summary.json`: tiivistelmä, viiden kohdennetun kokeen tulokset, lähdetiedostojen ja luettujen Git-syötteiden hashit. Se ei ole hyväksyntämanifesti.

## Rajat

`audit.py` ei laske 326 reseptin uusia makro-/GK-paketteja. Se kartoittaa viitteet, vertaa lähdearvot kerran ja laskee vain osoitetut suklaan nimelliset historialliset erot. Se tunnistaa base-GK:n, release-packien ja kolmen suljetun reitin todelliset lähteet, myös recovery-paketin sisään käärityn alkuperäistietueen.

`numeric-probe.mts` ajaa muistissa vain kaksi makrokontrollia ja kolme GK-tapausta. Sen laskennalliset after-arvot eivät peri hyväksyntää. Legacy-total-luku on vanhan puutteellisen polyolimallin vastaehdollinen tulos, ei uusi täydellinen total-CHO.

Yhden desimaalin pyöristysbudjetti on esityksen yhteensopivuuskoe. Se ei ole lähteen analyyttinen virheraja, biologinen maksimi tai lupa täyttää blank nollalla. Myös koko elintarvikkeen `Analysed`-luokasta puuttuu komponenttikohtainen mittausnäyttö.
