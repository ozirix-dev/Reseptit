# Recipavo: jatkuva työpuu- ja haarahuolto

Huollon tavoite on ehkäistä uusien Git-jäämien kertymistä **kehityksen rinnalla**.
Tämä on erillinen, rajattu toteutus: ei muutoksia resepteihin, käännöksiin,
F25-portteihin, GK-historiaan eikä nykyisen Codexin paikalliseen kertasiivoukseen.

Lähtötilanne 14.11.2026: GitHubissa 568 etähaaraa ja paikallisessa
ympäristössä raportoitu 366 työpuuta. Luvut eivät ole jatkuvasti päivittyviä.

## Jatkuva GitHub-haarojen siivous

`.github/workflows/repository-hygiene.yml` käsittelee PR:n sulkemisen jälkeen
vain **onnistuneesti yhdistetyn** PR:n lähdehaaran. Poisto on sallittu vain,
kun kaikki seuraavat ehdot pitävät:

1. Lähde on `ozirix-dev/Reseptit`-repo, ei forkki.
2. Haara alkaa `codex/`, `chatgpt/`, `chore/`, `fix/`,
   `quality/` tai `review/`. Muut haarat säilyvät.
3. Haara ei ole `main` eikä kyseisen PR:n kohdehaara.
4. GitHubin nykyinen haaraosoitin vastaa täsmälleen yhdistetyn PR:n
   lähdecommittia. Työn jatkuminen haarassa estää poiston.
5. Sama haara ei ole enää minkään avoimen PR:n lähde.
6. GitHubin omat suojaus- ja käyttöoikeussäännöt sallivat operaation.

Ei `--force`-poistoja, ei historiaa uudelleen kirjoittavaa operaatiota
eikä aiemmin syntyneiden haarojen massapoistoa. Sunnuntaiaamun ajastus
laskee etähaarat ja avoimet PR:t **vain luku** -periaatteella ja näyttää
luvut GitHub Actionsin yhteenvedossa.

Repon `delete_branch_on_merge` oli tämän työn alussa pois käytöstä.
Tämä workflow ei muuta repon asetusta, vaan hoitaa vain yllä olevan
sallitun tehtävähaarajoukon suljettujen PR:ien jälkeen.

## Windowsin paikallisten työpuiden tarkistus

GitHub Actions **ei näe paikallista Windows-konetta**. Työkalu
`tools/worktree-hygiene.mjs` tarkistaa paikalliset rekisteröidyt Git-työpuut,
mutta ei poista niitä, haaroja, tiedostoja, cachea eikä Gitin ohittamaa
sisältöä. Ajo ei myöskään tee `git fetch`- tai `git prune` -muutoksia.

Suorita Reseptit-repon juuresta:

```powershell
node tools/worktree-hygiene.mjs
node tools/worktree-hygiene.mjs --json > tmp/worktree-hygiene.json
node --test tools/worktree-hygiene.test.mjs
```

Raportti tarkistaa oikean `origin`-repon, Gitin worktree-rekisterin,
työpuiden lukitukset, aktiivisten PR:ien haarat, tracked- ja
untracked-muutokset, Gitin ohittamat tiedostot sekä HEADin sisältymisen
paikalliseen `origin/main`-viitteeseen. GitHub CLI:n (`gh`) pitää olla
kirjautunut, jotta avoimet PR:t voidaan varmistaa. Jos tarkistus ei onnistu,
tulos on `KEEP` — ei poistohyväksyntä.

`MANUAL_REVIEW` tarkoittaa vain mahdollista jatkokatselmointia.
Se ei ole automaattinen poistopäätös. Päivitä `origin/main` hyväksytyllä
Repo Guard -menettelyllä erikseen, sillä paikallinen viite voi olla vanha.

## Turvallinen paikallinen poistoprosessi

Nimetty vastuullinen varmistaa ennen erillistä `git worktree remove` -ajoa
kunkin ehdokkaan omistajan, ettei käynnissä oleva prosessi käytä työpuuta,
mahdolliset PR-riippuvuudet ja sen, että myös Gitin ohittamat tiedostot
ovat tarpeettomia tai erikseen varmistettuja. Älä käytä massapoistossa
`--force`-, `git branch -D`- tai rekursiivisia hakemistopoistoja.

Erityisesti aiemmat 72 epävarmaa työpuuta sekä avoimiin Draft-PR:iin
liittyvät haarat on jätettävä rauhaan, kunnes niiden tilanne on erikseen
selvitetty. Vanhojen paikallisten työpuiden kertasiivous kuuluu jo
käynnissä olevaan Codex-ajoon; tähän PR:ään ei yhdistetä sen poistotoimia.

## Käyttöönotto ja työnjako

- Yksi vastuullinen kirjoittaja tälle PR:lle. Älä muokkaa muiden PR-haaroja.
- Testaa paikallinen tarkistin, Repo Guard ja CI täsmälliseen HEADiin sidottuna.
- GitHubin etähaarasiivous alkaa vasta **kun PR on yhdistetty**.
- Windowsin automaattista Task Scheduler -tehtävää ei asenneta tässä PR:ssä.
  Myöhemmästä paikallisesta ajastuksesta päätetään mittausten perusteella.
- Sivuston buildiin tai tuotantodeployhin ei lisätä siivouksen vaatimaa työtä.
