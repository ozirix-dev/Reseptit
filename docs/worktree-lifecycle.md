# Recipavo: jatkuva työpuu- ja haarahuolto

Haararaportti ja paikallinen työpuutarkistin auttavat seuraamaan Git-repon
ylläpitotarpeita kehityksen rinnalla.

## GitHubin viikoittainen haararaportti

`.github/workflows/repository-hygiene.yml` laskee etähaarat ja avoimet PR:t
sunnuntaisin sekä käsin käynnistettäessä. Tulokset näkyvät GitHub Actionsin
ajon yhteenvedossa. Työnkululla on vain lukuoikeudet, ja kaikki haarat
säilyvät.

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

Säilytä työpuut, joiden paikallisia tiedostoja ei voi todistetusti luoda
uudelleen. Varmista myös, ettei toinen työpuu käytä poistokohdetta
hakemistolinkin kautta. Säilytä paikalliset haarat työpuiden poiston jälkeen.

## Käyttöönotto

- Tarkista GitHub-raportti yhdistämisen jälkeen ajon yhteenvedosta.
- Aja paikallinen tarkistin tarvittaessa yllä olevilla komennoilla.
- Sivuston build ja tuotantojulkaisu käyttävät omaa työnkulkuaan.
