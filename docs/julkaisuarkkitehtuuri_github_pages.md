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
npm run build
npm run test:static
npm run preview
```

GitHub Actions ajaa yksikkötestit, buildin ja esirenderöityjen tiedostojen tarkistukset pull requesteissa. `main`-haaraan yhdistetyt muutokset julkaistaan GitHub Pagesiin. Sivuston base path on `/Reseptit/`, koska julkaisu käyttää GitHub Pagesin projektisivustoa.

## Sivureitit ja SEO

- Suomen hakemisto on `/Reseptit/`; reseptin osoite on `/Reseptit/<url_slug>/`.
- Käännösten reitit ovat `/Reseptit/en/recipes/`, `/Reseptit/sv/recept/` ja `/Reseptit/th/recipes/`.
- Hakemisto- ja reseptisivujen HTML sisältää näkyvän tekstin jo ennen JavaScriptiä.
- Canonical, hreflang ja sivukartta muodostuvat julkaistuista reiteistä. Reseptin `x-default` ohjaa julkaistuun suomenkieliseen versioon tai, jos sellaista ei ole, ensimmäiseen julkaistuun kieleen.
- Tuntemattomalle reitille GitHub Pages palauttaa `404.html`-sivun. Se sisältää `noindex,follow`-merkinnän eikä canonical-osoitetta tai `Recipe`-JSON-LD:tä. Asiakasreitityksen tuntemattomat polut saavat saman noindex-käsittelyn.
- JSON-LD vastaa sivulla näkyviä tietoja. Kuvamerkintä lisätään vain, kun frontmatterissa määritetty ja repo-työpuusta löytyvä kuva on mukana.
- Julkaistuna ovat tällä hetkellä suomenkieliset kermainen lohipata ja keto-kauralesesämpylät. Niillä ei ole julkaistuja käännöksiä tai reseptikuvia.

### Robots.txt ja sitemap

GitHub Pagesin projektisivuston `robots.txt` on projektipolun alla: `https://ozirix-dev.github.io/Reseptit/robots.txt`. Se **ei hallitse** käyttäjätunnuksen juuren osoitetta `https://ozirix-dev.github.io/robots.txt`. Sivuston tiedosto kertoo projektipolun sitemap-osoitteen; tunnuksen juuritason crawling-säännöt on hallittava erikseen, jos sellaisia tarvitaan.

Sitemap on `https://ozirix-dev.github.io/Reseptit/sitemap.xml` ja sisältää vain julkaistut hakemistot ja reseptireitit.

### Google Search Console

1. Lisää URL-prefix-ominaisuus osoitteelle `https://ozirix-dev.github.io/Reseptit/`.
2. Valitse HTML-tiedostovahvistus ja tallenna Googlen antama tiedosto `site/public/`-kansioon täsmälleen annetulla nimellä ja sisällöllä.
3. Rakenna ja julkaise sivusto, ja avaa vahvistustiedosto täsmällisessä julkaistussa osoitteessa.
4. Suorita Search Consolessa vahvistus ja lisää sivukartaksi `https://ozirix-dev.github.io/Reseptit/sitemap.xml`.
5. Tarkista URL-tarkastuksella hakemistosivu ja yksittäinen resepti. Lähettäminen ei takaa indeksointia tai rich result -näkyvyyttä.

Googlen Recipe-rich-result-ohjeissa `image` on pakollinen ominaisuus. Nykyisillä kuvattomilla resepteillä on Schema.org `Recipe` -dataa, mutta ne eivät nykyohjeiden mukaan ole kelpoisia Googlen reseptin rich result -esitykseen ennen aidon, sisältöä vastaavan ja indeksoitavan kuvan lisäämistä. Rakenteisen datan on myös vastattava käyttäjälle näkyvää sisältöä. ([Recipe markup](https://developers.google.com/search/docs/appearance/structured-data/recipe), [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies))

## Kuvien lisääminen

- Lisää aidot, optimoidut WebP-tiedostot polkuun `kuvat/<luokka>/<tiedosto>.webp`, esimerkiksi `kuvat/leivonnaiset/keto-kauralesesampylat.webp`.
- Reseptin `image`-frontmatter sisältää `src`, kuvailevan `alt`-tekstin sekä oikeat pikselimitat. Tarvittaessa lisää `srcset`-variantit ja `sizes`.
- Build validoi suhteellisen WebP-polun, tarkistaa tiedoston olemassaolon `kuvat/`-kansion alla ja kopioi tiedoston julkiseen buildiin. Älä lisää placeholder-kuvia tai kuvaa, joka ei esitä kyseistä reseptiä.
- Hakemiston kuvat ladataan viiveellä. Yksittäisen reseptisivun kuva ladataan ensisijaisesti, ja sen mitat varataan asetteluun.

## Bundle ja ylläpito

Asiakasbundle sisältää reseptitiedot hydratoidakseen aktiivisen reitin ja annoslaskurin. Lokakuun 2026 auditissa kaikkien reseptien JavaScript-bundle oli noin 331 kB ennen gzip-pakkausta ja 105 kB gzipattuna. Pienelle kokoelmalle tämä on kohtuullinen, mutta sisältö kasvaa yhteisen bundle-moduulin mukana. Arvioi reittikohtainen tietolataus uudelleen, kun julkaistuja reseptejä on noin sata tai sisältö kasvattaa gzipattua JavaScriptiä yli 150 kB.

Dependabot tarkistaa viikoittain npm-paketit ja GitHub Actions -versiot. Päivitykset tehdään harkiten: merkittäviä versiohyppyjä ei sisällytetä tähän laatukierrokseen.

## Jeesitiimin vanhat osoitteet

Kun GitHub Pages -julkaisu on tarkistettu, Jeesitiimin Cloudflare Pagesiin lisätään pysyvät uudelleenohjaukset vanhoille osoitteille:

- `https://jeesitiimi.com/reseptit/` -> `https://ozirix-dev.github.io/Reseptit/`
- `https://jeesitiimi.com/reseptit/<slug>/` -> `https://ozirix-dev.github.io/Reseptit/<slug>/`

Tämä tekninen laatukierros ei muuta Jeesitiimin repo- tai hosting-asetuksia. Jeesitiimi ei sisällä reseptiartikkeleita, reseptivalikkoa, reseptien sitemap-osoitteita tai reseptisisällön build-vaihetta.
