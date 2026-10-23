# Reseptisivuston julkaisu GitHub Pagesissa

## Periaate

`Reseptit`-repo on reseptien kanoninen lähde ja itsenäisen reseptisivuston koti. Jeesitiimi käsittelee tietokoneapua ja IT-ohjeita; reseptisivut kuuluvat tähän repoosi.

```text
reseptit/*.md + kaannokset/**/*.md
    -> site/scripts/build-content.ts
    -> staattinen HTML + client-hydration
    -> site/dist
    -> GitHub Pages: https://ozirix-dev.github.io/Reseptit/
```

Build lukee Markdown-tiedostot, validoi julkaistujen reseptien metatiedot, poimii vain `status: published` -sisällön, sanitizoi ohjetekstin Markdownin ja esirenderöi koko sivun. Selain hydratoi saman sisällön annoslaskurin ja reitityksen toiminnallisuutta varten. Luonnokset, arkisto, raakileet ja mallipohjat eivät tule hakemistoon tai sivuille.

## Kehitys ja julkaisu

Reseptisivuston lähdekoodi on `site/`-kansiossa. Komennot suoritetaan siellä:

```powershell
npm ci
npm test
npm run test:translations
npm run test:image
npm run build
npm run test:static
npm run test:browser
npm audit --audit-level=low
npm run preview
```

GitHub Actions ajaa yksikkötestit, buildin ja esirenderöityjen tiedostojen tarkistukset pull requesteissa. `main`-haaraan yhdistetyt muutokset julkaistaan GitHub Pagesiin. Sivuston base path on `/Reseptit/`, koska julkaisu käyttää GitHub Pagesin projektisivustoa.

Pages otetaan käyttöön kerran repon Settings → Pages -asetuksissa valitsemalla
Source: GitHub Actions. Julkaisuworkflow käyttää jo käyttöön otettua Pages-sivustoa;
se ei yritä perustaa sitä `GITHUB_TOKEN`-tunnuksella. Uudessa repossa tämä
käyttöönotto on tehtävä ennen ensimmäistä julkaisua.

## Sivureitit ja SEO

- Suomen hakemisto on `/Reseptit/`; reseptin osoite on `/Reseptit/<url_slug>/`.
- Käännösten reitit ovat `/Reseptit/en/recipes/`, `/Reseptit/sv/recept/` ja `/Reseptit/th/recipes/`.
- Hakemisto- ja reseptisivujen HTML sisältää näkyvän tekstin jo ennen JavaScriptiä.
- Canonical, hreflang ja sivukartta muodostuvat julkaistuista reiteistä. Reseptin `x-default` ohjaa julkaistuun suomenkieliseen versioon tai, jos sellaista ei ole, ensimmäiseen julkaistuun kieleen.
- Tuntemattomalle reitille GitHub Pages palauttaa `404.html`-sivun. Se sisältää `noindex,follow`-merkinnän eikä canonical-osoitetta tai `Recipe`-JSON-LD:tä. Asiakasreitityksen tuntemattomat polut saavat saman noindex-käsittelyn.
- JSON-LD vastaa sivulla näkyviä tietoja. Kuvamerkintä lisätään vain, kun frontmatterissa määritetty ja repo-työpuusta löytyvä kuva on mukana.
- Kielivalikoima, reseptit ja kuvat määräytyvät julkaistuista lähteistä. Ajantasainen inventaario: `cd site; npm run report:inventory`. Historiallisia reseptimääriä ei käytetä buildin oletuksena.

### Robots.txt ja sitemap

GitHub Pagesin projektisivuston `robots.txt` on projektipolun alla: `https://ozirix-dev.github.io/Reseptit/robots.txt`. Se **ei hallitse** käyttäjätunnuksen juuren osoitetta `https://ozirix-dev.github.io/robots.txt`. Sivuston tiedosto kertoo projektipolun sitemap-osoitteen; tunnuksen juuritason crawling-säännöt on hallittava erikseen, jos sellaisia tarvitaan.

Sitemap on `https://ozirix-dev.github.io/Reseptit/sitemap.xml` ja sisältää vain julkaistut hakemistot ja reseptireitit.

### Google Search Console

1. Lisää URL-prefix-ominaisuus osoitteelle `https://ozirix-dev.github.io/Reseptit/`.
2. Valitse HTML-tiedostovahvistus ja tallenna Googlen antama tiedosto `site/public/`-kansioon täsmälleen annetulla nimellä ja sisällöllä.
3. Rakenna ja julkaise sivusto, ja avaa vahvistustiedosto täsmällisessä julkaistussa osoitteessa.
4. Suorita Search Consolessa vahvistus ja lisää sivukartaksi `https://ozirix-dev.github.io/Reseptit/sitemap.xml`.
5. Tarkista URL-tarkastuksella hakemistosivu ja yksittäinen resepti. Lähettäminen ei takaa indeksointia tai rich result -näkyvyyttä.

Reseptikuvat ja rakenteinen data ovat käytössä. Tekninen validointi ei takaa
Googlen indeksointia tai rich result -näkyvyyttä. Kuva ja teksti täytyy tarkistaa
myös sisällöllisesti. Vahvistustiedoston HTTP 200 todistaa vain tiedoston
saatavuuden, ei Search Consolen omistajuusvahvistuksen onnistumista.

## Kuvien lisääminen

- Lisää aidot, optimoidut WebP-tiedostot polkuun `kuvat/<luokka>/<tiedosto>.webp`, esimerkiksi `kuvat/leivonnaiset/keto-kauralesesampylat.webp`.
- Reseptin `image`-frontmatter sisältää `src`, kuvailevan `alt`-tekstin sekä oikeat pikselimitat. V1.5 muodostaa `srcset`-variantit ja `sizes`-arvot automaattisesti Sharpilla; älä ylläpidä niitä käsin.
- Build validoi suhteellisen WebP-polun, tarkistaa tiedoston olemassaolon `kuvat/`-kansion alla ja kopioi tiedoston julkiseen buildiin. Älä lisää placeholder-kuvia tai kuvaa, joka ei esitä kyseistä reseptiä.
- Hakemiston kuvat ladataan viiveellä. Yksittäisen reseptisivun kuva ladataan ensisijaisesti, ja sen mitat varataan asetteluun.

## Bundle ja ylläpito

### Sisältödatan kulku

1. `build-content.ts` lukee julkaistut Markdownit. Täysi
   `content.generated.ts` on buildin ja testien käytössä.
2. `contentForRoute` poimii hakemistoon vain kyseisen kielen tiivistelmät
   (myös haun tarvitsemat ainesosanimet) tai reseptisivulle yhden reseptin.
   Vastinkielten linkit ovat kevyitä locale/polku-pareja.
3. Build kirjoittaa `public/data/<sha256-prefix>.json`-tiedostot ja
   reittimanifestin. Generoitu datahakemisto rakennetaan uudelleen, jotta
   poistunut julkaisutieto ei jää vahingossa jakeluun.
4. Prerenderöinti upottaa saman lähtödatan HTML:n `page-content`-elementtiin.
   `<`, U+2028 ja U+2029 escapetaan. Sivun sisältö ei tarvitse JSON-hakua
   ensimmäisellä latauksella. Reactin alkuperäinen puu vastaa staattista HTML:ää.
5. Routerin loader hakee navigoitaessa vain kohdereitin JSONin. Selainmuistin
   välimuisti säilyttää enintään 24 reittiä. Query-muutos ei hae dataa uudelleen.
   Puuttuva tai virheellinen payload näyttää lokalisoidun virheen ja retry-linkin.

URL:n hakuparametrit sovelletaan vasta hydraation jälkeen: Pages ei generoi
erillistä HTML:ää jokaiselle kyselylle. Ilman JavaScriptiä käyttäjä saa kaikki
kortit ja linkit ilman toimimatonta hakulomaketta. JavaScriptiä tukevassa
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

Kun GitHub Pages -julkaisu on tarkistettu, Jeesitiimin Cloudflare Pagesiin lisätään pysyvät uudelleenohjaukset vanhoille osoitteille:

- `https://jeesitiimi.com/reseptit/` -> `https://ozirix-dev.github.io/Reseptit/`
- `https://jeesitiimi.com/reseptit/<slug>/` -> `https://ozirix-dev.github.io/Reseptit/<slug>/`

Tämä tekninen laatukierros ei muuta Jeesitiimin repo- tai hosting-asetuksia. Jeesitiimi ei sisällä reseptiartikkeleita, reseptivalikkoa, reseptien sitemap-osoitteita tai reseptisisällön build-vaihetta.
