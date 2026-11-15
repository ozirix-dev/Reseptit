# Recipavon tuotanto ja GitHub Pages -staging

## Periaate

`Reseptit` on reseptisisällön kanoninen lähde. Julkinen sivusto on
[www.recipavo.com](https://www.recipavo.com/) Cloudflare Pagesissa.
[GitHub Pages](https://ozirix-dev.github.io/Reseptit/) toimii stagingina.

```text
reseptit/*.md + kaannokset/**/*.md
    -> site/scripts/build-content.ts
    -> staattinen HTML + client-hydration
    -> site/dist
    -> GitHub Pages -staging (/Reseptit/)
    -> Cloudflare Pages -tuotanto (/, erikseen hyväksytty julkaisu)
```

Build lukee Markdown-tiedostot, validoi julkaistujen reseptien metatiedot, poimii vain `status: published` -sisällön, sanitizoi ohjetekstin Markdownin ja esirenderöi koko sivun. Selain hydratoi saman sisällön annoslaskurin ja reitityksen toiminnallisuutta varten. Luonnokset, arkisto, raakileet ja mallipohjat eivät tule hakemistoon tai sivuille.

## Kehitys ja julkaisu

Reseptisivuston lähdekoodi on `site/`-kansiossa. Komennot suoritetaan siellä:

```powershell
npm ci
npm run build
npm test
npm run test:translations
npm run test:image
npm run test:static
npm run test:browser
npm audit --audit-level=low
npm run preview
```

GitHub Actions valitsee tarkistukset GitHubin muodostaman PR-yhdistelmän ja
sen ensimmäisen parentin erosta. Ajosta jäävät talteen testattu commit sekä
PR:n head- ja base-SHA. TypeScript-testimuutos ajaa sisällön generoinnin,
tyyppitarkistuksen ja kohdennetun testin. Laajempi julkaisu- tai
rakennemuutos ajaa myös tarvittavat tuotantobuildin, staattisen tulosteen
ja selaimen tarkistukset. Dokumentaatiomuutos voi käyttää kevyttä polkua.
`main`-haaran muutokset julkaistaan
GitHub Pages -stagingiin projektipolun `/Reseptit/` alle. Tuotantojulkaisu
Cloudflare Pagesiin edellyttää erikseen hyväksyttyä, testattua commit-SHA:ta.
Tuotannon reitit alkavat verkkotunnuksen juuresta.

### Reseptiversion julkaisu

- Tarkista uuden FI-lähteen kirjattu toimituksellinen näyttö ajamalla
  juuresta `node site/scripts/new-recipe-preflight.mjs --recipe=<polku> --json`.
  HOLD palauttaa virhekoodin ja reseptikohtaiset syyt. Käytä samaa porttia
  ennen ensimmäistä pushia.
- Valmistuksen, ruokaturvallisuuden, ainesosien ja ravinnon katselmointi
  kiinnitetään lähdeversioon. Ravinnon todiste tarkastaa laskentasyötteen
  erikseen. GK voi olla perustellusti määrittämätön. Erikseen käsiteltävän
  julkaistun GK-pending-lähteen Git-blob on
  [GK-pending-rekisterissä](nutrition/new-public-gk-pending-sources.json).
- Merkitykseen vaikuttava muutos edellyttää julkaistujen kieliparien
  ajantasaista vertailua. Varmista lisäksi kuvan vastaavuus ja julkaistun
  sivun toimivuus Pages-jakelusta.
- GK80:n ja GK149:n alkuperäisversion regressio käyttää jäädytettyä
  resepti-ID-joukkoa. Uusi riippumaton FI-luonnos ei muuta joukkoa.
  Julkaistun nykyversion esityssovitukset tehdään järjestyksessä
  sisältöbuildissa. Yksittäisen sovituksen lähtöversion ja laskennan
  tarkisteet säilyvät kunkin sovituksen ja hyväksynnän omissa tiedoissa.

Pages otetaan käyttöön kerran repon Settings → Pages -asetuksissa valitsemalla
Source: GitHub Actions. Julkaisuworkflow käyttää jo käyttöön otettua Pages-sivustoa;
se ei yritä perustaa sitä `GITHUB_TOKEN`-tunnuksella. Uudessa repossa tämä
käyttöönotto on tehtävä ennen ensimmäistä julkaisua.

## Sivureitit ja SEO

- Tuotannon hakemisto on `/` ja reseptin osoite `/<url_slug>/`.
- Käännösten hakemistot ovat `/en/recipes/`, `/sv/recept/` ja `/th/recipes/`.
  GitHub Pages -staging lisää samoihin reitteihin `/Reseptit`-etuliitteen.
- Hakemisto- ja reseptisivujen HTML sisältää näkyvän tekstin jo ennen JavaScriptiä.
- Canonical, hreflang ja sivukartta muodostuvat julkaistuista reiteistä. Reseptin `x-default` ohjaa julkaistuun suomenkieliseen versioon tai, jos sellaista ei ole, ensimmäiseen julkaistuun kieleen.
- Tuntemattomalle reitille GitHub Pages palauttaa `404.html`-sivun. Se sisältää `noindex,follow`-merkinnän eikä canonical-osoitetta tai `Recipe`-JSON-LD:tä. Asiakasreitityksen tuntemattomat polut saavat saman noindex-käsittelyn.
- JSON-LD vastaa sivulla näkyviä tietoja. Kuvamerkintä lisätään vain, kun frontmatterissa määritetty ja repo-työpuusta löytyvä kuva on mukana.
- Kielivalikoima, reseptit ja kuvat määräytyvät julkaistuista lähteistä. Ajantasainen inventaario: `cd site; npm run report:inventory`. Historiallisia reseptimääriä ei käytetä buildin oletuksena.

### Robots.txt ja sitemap

Tuotannon [robots.txt](https://www.recipavo.com/robots.txt) osoittaa
[tuotannon sivukarttaan](https://www.recipavo.com/sitemap.xml), joka sisältää
julkaistut hakemistot ja reseptireitit. GitHub Pages -stagingin sivuilla on
`noindex, nofollow`. Stagingin `robots.txt` sijaitsee projektipolun alla
`/Reseptit/robots.txt`.

### Google Search Console

Käytä tuotannon ominaisuutta ja tuotannon sivukarttaa. Tarkista tarvittaessa
tuotannon hakemisto ja yksittäinen resepti URL-tarkastuksella. Tarkista
indeksointi ja rakenteisen datan näkyvyys Search Consolesta.

## Kuvien lisääminen

- Lisää aidot, optimoidut WebP-tiedostot polkuun `kuvat/<luokka>/<tiedosto>.webp`, esimerkiksi `kuvat/leivonnaiset/keto-kauralesesampylat.webp`.
- Reseptin `image`-frontmatter sisältää `src`, kuvailevan `alt`-tekstin sekä oikeat pikselimitat. V1.5 muodostaa `srcset`-variantit ja `sizes`-arvot automaattisesti Sharpilla; älä ylläpidä niitä käsin.
- Build validoi suhteellisen WebP-polun, tarkistaa tiedoston olemassaolon `kuvat/`-kansion alla ja kopioi tiedoston julkiseen buildiin. Älä lisää placeholder-kuvia tai kuvaa, joka ei esitä kyseistä reseptiä.
- Hakemiston kuvat ladataan viiveellä. Yksittäisen reseptisivun kuva ladataan ensisijaisesti, ja sen mitat varataan asetteluun.

## Bundle ja ylläpito

### Sisältödatan kulku

1. `build-content.ts` lukee julkaistut Markdownit. Täysi
   `content.generated.ts` on buildin ja testien käytössä.
2. \`prepare-routes.ts\` yhdistää reseptien julkaistut GK-tiedot reittidataan.
   Kokonainen GK-aineisto kuuluu vain GK-oppaan reiteille. Hakemisto sisältää
   ensimmäiset kortit ja viitteen kielikohtaiseen hakuindeksiin, jonka selain
   lataa, kun käyttäjä hakee tai suodattaa. Reseptikirjastossa on 24 korttia
   sivulla ja tavalliset seuraava- ja edellinen-linkit.
3. Build kirjoittaa reittidatan sisältötiivisteellä nimettyihin
   \`public/data/\`-tiedostoihin ja luo reittimanifestin. Generoitu datahakemisto
   rakennetaan uudelleen, jotta poistunut julkaisutieto poistuu jakelusta.
4. Esirenderöinti lukee saman reittidatan ja upottaa sen HTML:n
   \`page-content\`-elementtiin. Selain hydratoi staattisen HTML:n ilman erillistä
   reittidatan hakua. Build tarkistaa etusivun HTML:n ja JavaScriptin
   gzip-kokorajat.
5. Navigoitaessa selain hakee vain kohdereitin JSONin ja pitää muistissa
   enintään 24 reittiä. Hakuehtojen muutos käyttää samaa kielikohtaista
   hakuindeksiä. Puuttuva tai virheellinen reittidata näyttää lokalisoidun
   virheen ja uudelleenlatauslinkin.

URL:n hakuparametrit sovelletaan vasta hydraation jälkeen: Pages ei generoi
erillistä HTML:ää jokaiselle kyselylle. Ilman JavaScriptiä käyttäjä voi selata kaikki kortit reseptikirjaston
sivutuslinkeillä. JavaScriptiä tukevassa
selaimessa lomakkeelle varattu tila ehkäisee asetteluhyppyä.

Manifesti ja yhteinen sovelluskoodi kuuluvat JavaScriptiin, kokonainen
reseptikirjasto ei. Sisältötiivisteet estävät eri versioiden JSONien sekoittumisen.
Pagesin HTTP-välimuisti täydentää sovelluksen välimuistia; projekti ei aseta
omaa palvelinpuolen Cache-Control-käytäntöä. Pitkään avoimen vanhan sivun
navigointi uuden julkaisun jälkeen voi kohdata poistuneen datatiedoston:
retry-linkki lataa ajantasaisen sivun kokonaan.

Hakemiston ensimmäinen kuva on eager/high. Toisen ja kolmannen kortin
esilataus on sidottu 700/1100 px:n grid-rajoihin; mobiili ei esilataa kolmea
kuvaa. Muut kortit ovat lazy. V1.5 tuottaa automaattiset responsiiviset
WebP-variantit; selain valitsee asetteluun ja pikselitiheyteen sopivan kuvan.

### Suorituskyvyn seuranta

Vite raportoi raakakoon ja gzip-koon jokaisessa buildissa. Ennen/jälkeen-labramittaus,
moduulianalyysi ja 119/250/500-reseptin fixturevertailu ovat
[V1.4-raportissa](reports/2026-10-22-v1-4-performance.md). Luvut eivät ole
käyttäjädataa tai lupaus tuotantoverkon nopeudesta. Toista mittaus samanlaisilla
laitteilla, selaimella, URL-osoitteilla ja kuristuksilla sisältömäärän kasvaessa.

Dependabot tarkistaa viikoittain npm-paketit ja GitHub Actions -versiot. Päivitykset tehdään harkiten: merkittäviä versiohyppyjä ei sisällytetä tähän laatukierrokseen.

## Jeesitiimin vanhat osoitteet

Aiemmassa siirtosuunnitelmassa Jeesitiimin vanhojen reseptiosoitteiden
kohteeksi ehdotettiin GitHub Pagesia. Recipavon nykyinen julkinen osoite on
[www.recipavo.com](https://www.recipavo.com/).
