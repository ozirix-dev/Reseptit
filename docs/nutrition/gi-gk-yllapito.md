# GI/GK-ylläpitäjän työohje

Git sisältää reseptit, GI- ja koostumuslähteet sekä laskennan ja hyväksyntöjen
sidokset. SQLite on näistä uudelleen rakennettava paikallinen hakemisto.
Recipavon julkinen sivusto rakennetaan staattiseksi. Mahdollinen GI/GK:n
D1-lukukopio muodostetaan samasta Git-revisiosta. Tuotantokatalogilla on oma
julkaisuprosessinsa. Ylläpitohaun tulos ei anna julkaisulupaa.

## Käyttöönotto ja aineistokartta

Asenna riippuvuudet `site/`-hakemistossa komennolla `npm ci`. Aja komennot
katselmoitavan revision puhtaan työpuun juuresta.

```powershell
python -B site/scripts/gi_sqlite_evidence.py --maintainer inventory
python -B site/scripts/gi_sqlite_evidence.py --maintainer capture
python -B site/scripts/gi_sqlite_evidence.py --maintainer map
python -B site/scripts/gi_sqlite_evidence.py --maintainer cases
```

`capture` ajaa tuotantoasetuksin sisältö-, ravinto- ja GK-generaattorit ja
sitoo tulokset revisioon, Git-puuhun ja syötteiden tarkisteisiin. Ensimmäinen
haku tai `cases` rakentaa indeksin. Uusi revisio edellyttää uutta capturea.
Haku hylkää virheellisen capturen ja rakentaa vanhan tai vaurioituneen
SQLite-välimuistin uudelleen tarkistetusta capturesta.

`map` kirjoittaa `tmp/gi-gk/asset-map.json`- ja `asset-map.md`-tiedostot.
JSON sisältää Git-blobit, elinkaariluokat, ajonaikaiset lukijat ja
testiviitteet. Ajonaikainen seuranta löytää myös hakemistoista ja
rekistereistä johdetut lukupolut. Historiallisten Git-hakujen ja muiden
ajopolkujen kattavuus on rajallinen. Kartta sisältää `docs/research`-polun
tiedoston silloin, kun capture-ajossa havaittiin luku tai koodista löytyi
viite. `UNRESOLVED`-merkintä tarkoittaa, että
tiedoston rooli edellyttää selvitystä ennen siirtoa. Historiallinen
[13.11.2026 auditointi](../architecture/gi-gk-system-audit-2026-11-13.md)
säilyttää alkuperäiset lähderevisionsa.

## Kolme tavallista tehtävää

| Kysymys | Valinnat | Tuloksen tulkinta |
| --- | --- | --- |
| Mistä julkaistu GK muodostuu? | `--maintainer approval --id gazpacho` tai `--maintainer approval --id valimerellinen-halloumi-tomaattileipa` | Tarkista version tunniste, julkaistu piste tai vaihteluväli, vaihteluvälin tyyppi ja saatavilla olevat syöte- ja evidenssitarkisteet. Tarvittaessa avaa audit-JSON ja hyväksyntäviite. |
| Miksi reseptiltä puuttuu GK? | `--maintainer approval --id bataattiletut` | Tarkista laskennan tila, julkinen tila ja esteluokka. `REVIEW_PENDING` ohjaa odottavan reseptin rekisteriin. Jos julkaisutieto puuttuu, laskennallinen arvo voi silti näkyä auditissa. |
| Mitkä reseptit voivat muuttua, jos GI-lähdettä korjataan? | `--maintainer source --id whole-tomato-raw-gi-22`, sitten `--maintainer impact --id whole-tomato-raw-gi-22` | Haku näyttää varmennetut rinnakkaistunnisteet, lähdeviitteet ja reseptit versioittain. Tarkista `unverified-variant-citation` käsin. Tyhjän haun kattavuus on osittainen. |

Lisää valinnat komennon `python -B site/scripts/gi_sqlite_evidence.py` perään.
JSON on oletus. Tekstitulosteen saa valinnalla `--format text`. Jatka saman
revision ja kyselyn tuloksesta `--after`-valinnalla ja `next`-arvolla.

Lähdeluokka ja reseptikohtainen soveltaminen näkyvät eri kentissä.
`SECONDARY_REFERENCE` tarkoittaa toissijaista viitettä, ja
`HUMAN_GI_RECORDED` ilmaisee rekisteriin kirjatun luokituksen.
Lady Rosetta ja Spunta ovat saman tutkimuksen eri mittauksia.
[Tutkimuksen tulokset](https://www.foodandnutritionjournal.org/pdf/vol4no1/CRNFSJ_vol04_no1_09-15.pdf)

Vaikutushaku indeksoi alkuperäisten reseptien tunnisteviitteet sekä
kanoniset GI-sidokset operation149-, next-four- ja Pad See Ew -paketeista.
Muiden varianttien samat lähde-URL:t auttavat löytämään tarkistuskohteita.
Paperin sisäiset erilliset havainnot ja eri muodossa kirjatut viitteet
edellyttävät omaa näyttöä. `PUBLISHED_CHECK_RELEASE_PATH` ohjaa tarkistamaan
alkuperäisreseptin eräkohtaisen hyväksynnän.

## Paikallinen D1-koevienti

```powershell
python -B site/scripts/gi_sqlite_evidence.py --maintainer benchmark
python -B site/scripts/gi_sqlite_evidence.py --maintainer export
```

`benchmark` mittaa tietokannan rakentamisen ja oikeat ylläpitokyselyt
nykyaineistolla sekä 10 000 ja 100 000 synteettisellä tietueella.
`export` kirjoittaa `tmp/gi-gk/d1-preview/`-hakemistoon skeeman, passiivisen
tuonnin ja manifestin. SQL:n tarkisteet varmistetaan ennen lukemista.
Paikallinen koe testaa tiedostokannassa keskeytyksen, uusintatuonnin ja
version vaihdon odotetusta edeltäjästä. Pistekenttien sallintalista koskee
kahta julkaistua tulosta ja neljää lähdeviitettä. Vaihteluvälillisen
tuloksen lisääminen edellyttää kenttäjoukon erillistä hyväksyntää.
GI-arvot, lähdeotteiden paikantimet ja hyväksyntätiivisteet kuuluvat
paikalliseen ylläpitohakuun.

### Ehdotus myöhempää pilottipäätöstä varten

- Rajaa nykyinen vienti tiedonsiirron ja palautuksen harjoitukseen. Jos
  pilotissa arvioidaan GI-lähteen soveltuvuutta, hyväksy ensin vientiin
  rekisterin `qualityTier` ja `calculationUse` tai niiden merkityksen
  säilyttävä esitystapa. Nykyisen viennin `HUMAN_GI` kuvaa havaintotyyppiä.
  Esimerkiksi Lady Rosettan mittaus kuuluu rekisterissä
  `SUPPLEMENTARY`-tasolle, ja tämä rajoitus pitää säilyttää käyttöliittymässä
  ja kyselyissä.
- Eristä `recipavo-gi-gk-preview` EU-jurisdiktioon. Käytä erillistä
  Cloudflare-tiliä, jos käyttöoikeuksia ei voi rajata pois
  tuotantokatalogista. Tuontioikeus on tilapäinen. Lukuasiakkaalle
  tarjotaan rajattu rajapinta, jossa vain ennalta määritellyt kyselyt ovat
  käytettävissä. [D1:n sijainti](https://developers.cloudflare.com/d1/configuration/data-location/)
- Ehdotettu lisäkustannuskatto on 0 euroa ja päivittäinen työkatto
  10 000 luettua sekä 1 000 kirjoitettua riviä. Varmista tilin vapaa
  kiintiö ja mittaa rivit D1:n kyselymetasta. Katkaise pilotin liikenne
  ennen kattoa ja hyväksytä mahdolliset uudet kustannukset erikseen.
  [D1:n hinnoittelu](https://developers.cloudflare.com/d1/platform/pricing/)
- Tarkista tuonnin skeemaversio, revisio, tiivisteet ja sisältö. Kokeile
  tuontia D1:n atomisella `batch()`-rajapinnalla ja mittaa p50, p95 sekä
  luetut ja kirjoitetut rivit. Pidä vanha snapshot palautettavana
  osoittimen vaihdolla. Kirjaa lisäksi tietokannan palautuspiste.
  [D1:n erärajapinta](https://developers.cloudflare.com/d1/worker-api/d1-database/)
  · [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)

## PR:n katselmointi

```powershell
python -B .github/scripts/verify-pr-review.py <PR-numero> <head-sha>
```

Aja tarkistus Ready-tilassa heti ennen Repo Guardin yhdistämisesitarkastusta.
Edellytä tarkalle HEADille Codexin katselmointikuittausta tai riippumattoman
ylläpitäjän GitHub-hyväksyntää. Ratkaise avoimet katselmointiketjut ja aja
vaadittu CI ajantasaiselle yhdistettävälle revisiolle. Varmista sen jälkeen
yhdistämisvaltuus erikseen. Codexin pelkkä 👍 ei kerro katselmoitua SHA:ta.
Aiempaan committiin jätetty muutospyyntö estää yhdistämisen, kunnes sen
tekijä hyväksyy muutoksen tai GitHubissa hylätään kyseinen katselmointi.

PR #685 yhdistettiin 2 minuuttia 48 sekuntia ennen Codexin kuittausta.
Haaran nykyinen GitHub-sääntö vaatii vain `build`-tarkistuksen. Kaikille
yhdistämisreiteille tarvittava palvelinesto edellyttää `main`-rulesetiin
asetuksia **Require review thread resolution**, **Require approvals = 1**,
**Dismiss stale pull request approvals when new commits are pushed** ja
**Require approval of the most recent reviewable push**, sekä bypass-oikeuksien
rajausta. Jos Codex-kuittaus halutaan hyväksyä GitHubin yhdistämisportissa,
sääntöön
tarvitaan lisäksi luotetun integraation tarkalle HEADille julkaisema
pakollinen tarkistus. Paikallinen esitarkistus lukee Codex-sovelluksen
PR-yhteenvedon tilan, ylläpitäjien hyväksynnät ja avoimet katselmointiketjut.
Jos yhteenveto koskee aiempaa committia, pyydä katselmointi GitHubissa
kommentilla `@codex review` ja odota päivitettyä kuittausta.
[GitHubin ruleset-säännöt](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
