# GK80-ajonohjain V1 – turvallinen monivuoroinen Codex-ajo

**Tila:** paikallinen opt-in -prototyyppi, ei oteta käyttöön PR:n yhdistämisellä.

Tämän työkalun tarkoitus on estää Reseptit-projektin 30 reseptin GK80-työtä pysähtymästä 7/30, 8/30 tai 9/30 kohdalla siksi, että Codex valmistui yhdestä tutkimushavainnosta. Ohjaus on Pythonilla tehty ulkoinen tilakone. Malli tutkii reseptejä; tilakone tarkastaa työjonon rakenteen, rajoittaa vuoroja ja säilyttää etenemisen.

## Toteutuksen rajat

| Toiminto | V1 |
| --- | --- |
| 30 uniikkia GK-resepti-ID:tä samassa pysyvässä työjonossa | Kyllä |
| Useita peräkkäisiä Codex-vuoroja yhdellä ajolla | Kyllä, rajattu määrä |
| Ajon käynnistys oletuksena | Ei, vaatii --execute |
| SIGINT, STOP, aikakatkaisu ja budjettikatkaisu | Kyllä |
| Paikalliset checkpointit ja JSONL-lokit | Kyllä |
| Työpuun, Git-originin ja branchin tarkistus | Kyllä |
| Päällekkäisten recipe-ID:iden esto työjonossa | Kyllä |
| VERIFIED-vaatimukset: lähteet, määrät, GI, poisjättö, kaksi todellista tiedosto-SHA:ta | Kyllä, rakenteellinen portti |
| Tieteellinen riippumaton GK-varmennus | Ei |
| Reaaliaikainen main/PR-kattavuussynkronointi | Ei; nimetty Codex tarkistaa |
| Automatisoitu GitHub PR, merge tai deploy | Ei |
| Taustaprosessi tai automaattinen ajastus | Ei |

**Ajonohjain ei muuta reseptejä, GI/GK-laskentamoottoria, julkaisurekistereitä eikä Github Actionsin työvirtaa.** Se ei edes käynnistä Codexia, ellei komentoon lisätä erikseen --execute.

## 1. Valmistele Windowsilla oma research-worktree

Tarkista ensin Codex CLI:n todellinen paikallinen versio ja komentorajapinta, sekä Python 3.10+ ja Git:

~~~powershell
codex --version
codex exec --help
py -3 --version
git --version
~~~

Codexin malli valitaan omassa asetuksessa ja tarkistus-hookilla. Tämä ohjelma ei vaihda mallia, ei ohita sandboxia eikä ota käyttöön vaarallista hyväksyntöjen ohitusta.

Tarkista alkuperäinen repo ja tee **uusi, yksin tämän työn omistama** Git-worktree. Älä käytä aktiivista main-työpuuta tai jo toisen Codexin omistamaa haaraa.

~~~powershell
$repo = 'D:\Projects\Products\Reseptit'
$worktree = 'D:\Projects\tmp\reseptit-gk80-batch30'
$branch = 'codex/gk80-batch30-20261103'
git -C $repo remote get-url origin
git -C $repo worktree add -b $branch $worktree main
git -C $worktree remote get-url origin
git -C $worktree branch --show-current
~~~

Säilytä AGENTS.md:n repo_guard- ja yhden kirjoittajan säännöt. Jos haara tai työpuu on olemassa, älä käytä niitä toiselle kirjoittajalle.

## 2. Alusta yksi 30 reseptin työjono

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree init --branch $branch --target 30 --max-turns 12
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree status
~~~

Työpuun .gk80-controller-hakemisto syntyy paikallisesti. Se on Gitin ignore-listalla ja sisältää queue.json:n, state.json:n, logs-hakemiston, työnaikaisen active.lock-lukon ja mahdollisen STOP-lipun. Uusi init ei ylikirjoita vanhaa työjonoa. Varmuuskopioi paikallinen työjono ennen koneen uudelleenasennusta.

Aiemmat yhdeksän tutkimuslaskelmaa eivät ole vielä yhdeksän VERIFIED-tapausta. Codex saa tuoda ne jonoon ensin enintään CALCULATED-tilassa ja selvittää jokaisen lähteet, massat, GI-sovellukset sekä hashit.

## 3. Esikatsele ja aja

Pelkkä step ei tee ulkoisia toimia eikä kuluta Codexin tokeneita:

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree step
~~~

Yksi rajattu vuoro:

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree step --execute --max-seconds 1200
~~~

Enintään kuusi työvuoroa peräkkäin samassa **etualalla suoritettavassa** komennossa:

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree run --execute --turn-limit 6 --max-seconds 1200
~~~

Kukin vuoro valitsee tyypillisesti 5–8 ID:tä; tavoite on 3–5 lähdekelpoista tutkimuspakettia, mutta määrää ei luvata. HOLD merkitään tarkalla esteellä ja seuraava resepti otetaan käsittelyyn. Vuorojen välillä työjono säilyy ja ohjain kutsuu seuraavan vuoron, ellei rajaa tai estettä saavuteta.

max-turns rajoittaa koko paikallisen ajon Codex-vuoroja, turn-limit yhden komennon vuoroja ja max-seconds yhden vuoron aikaa. **Nämä eivät rajoita suoraan tokenimäärää tai euromääräistä laskutusta.** Tarkista käyttökiintiö erikseen. Työkalu ei lupaa yhden vuoron sisäistä pitkäkestoista suorittamista.

## 4. Pysäytä ja jatka

Toisesta PowerShellistä:

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree stop
~~~

Ajo tarkistaa STOP-lipun puolen sekunnin välein ja lopettaa oman Codex-prosessinsa. Tarkista tarvittaessa, onko Windowsissa jäänyt lapsiprosesseja. Lukkoa ei saa automaattisesti yliajaa, jos työ voi yhä olla käynnissä.

Kun päätät jatkaa:

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree status
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree resume
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree run --execute --turn-limit 4
~~~

Resume ei käynnistä Codexia. Se ei myöskään nosta loppunutta max-turns-budjettia.

## 5. Kun 30/30 on saavutettu

~~~powershell
py -3 "$worktree\tools\gk80_controller.py" --worktree $worktree handoff
~~~

Tämä luo tutkimuspakettiin tiedoston docs/research/gk80-batch30/HANDOFF.md, jossa on 30 resepti-ID:tä, GK:t, pois jätetty CHO ja lähde-evidenssin hashit.

**VERIFIED on V1:ssä rakenteellinen tila, ei automaattinen tieteellinen hyväksyntä.** Tämän jälkeen riippumaton katselmointi varmistaa lähteiden soveltuvuuden, valmistuksen, määrät, LOW-rajaukset ja mainin uusimman tilanteen. Jos jokin 30 ID:stä on sillä välin julkaistu toisessa PR:ssä, se korvataan toisella oikeasti varmennetulla ID:llä. Nimetty kirjoittaja voi valmistella yhden Draft-PR:n erillisellä integraatiovaiheella. Tämä ohjain ei itse pushaa, avaa PR:ää, vaihda Ready-tilaa, yhdistä, julkaise tai deployaa.

## Tämän V1:n tunnetut rajoitukset

- Python tarkastaa tiedostopolun, SHA-256-tiivisteen, määrien ja lähdeviitteiden läsnäolon; se ei osaa itse ratkaista tieteellisesti, onko GI tai ruoan valmistusvastaavuus oikea.
- Reaaliaikainen GitHubin julkaistujen ID:iden tarkistus tehdään Codex-ohjeella, ei kovalla API-portilla. Ennen PR:ää vaaditaan ajantasainen riippumaton vertailu.
- Codex exec käyttää yhden vuoron itsenäistä kontekstia; välitieto kulkee queue.json:ssa ja tutkimustiedostoissa, ei toivomalla mallin muistavan kaiken.
- Controllerin sandbox-käynnistys ei ole täydellinen tekninen verkko- tai git-toimien esto; myös repo_guard, Git-branchin omistajuus ja julkaisupäätökset ovat voimassa.
- Automaatio ei käynnisty itsestään eikä toimi Windows-palveluna tai taustalla.
- Älä pane yksityisiä avaimia, henkilötietoja tai muita salaisuuksia työjonoon tai lokeihin.
- Keskeytetty tai virheellinen työjono palautetaan edellisen vuoron muistissa olevaan jonoon, mikäli kirjoitus epäonnistui. Jos aiemman jonon evidenssitiedostojakin on muutettu, vaaditaan manuaalinen korjaus.
- Varmennetuille resepteille vaaditaan erillinen fyysinen `inputPath`-JSON ja `evidencePath`-JSON saman tutkimushakemiston alla. Kummankin SHA lasketaan aidosta tiedostosta.
- Ennen jokaista varsinaista vuoroa ja sen jälkeen tarkistetaan, että muokkaukset rajoittuvat `docs/research/gk80-batch30/`-tutkimushakemistoon. Koodin `STOPPED_GUARD`-tila vaatii tarkastuksen; muutoksia ei poisteta automaattisesti.
- Windowsissa STOP voi katkaista suoranaisen Codex CLI -prosessin mutta ei välttämättä kaikkia sen mahdollisesti käynnistämiä lapsiprosesseja. Tarkista prosessit ennen uutta ajoa.

## Rajatut testit

~~~powershell
py -3 "$worktree\tools\tests\test_gk80_controller.py"
~~~

Testit käyttävät paikallista väliaikaista Git-repoa, eivät Codexia tai verkkoa. Ne kattavat alkuperän tarkistuksen, tilan talletuksen, dry-runin, pysäytyksen, lukon, virheelliset ID:t, lähde- ja SHA-256-portit. Ei koko 326 reseptin laskenta-ajoja eikä GitHub Actions -uusintoja.

Katso lisäksi [työjonosopimus](CONTRACT.md), [vaiheistettu hyväksyntäsuunnitelma](PLAN.md) ja [rinnakkaisten Codex-ajojen käytäntö](../rinnakkaiset-codex-ajot.md).
