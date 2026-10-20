# Reseptisivuston julkaisu GitHub Pagesissa

## Periaate

`Reseptit`-repo on reseptien kanoninen lähde ja itsenäisen reseptisivuston koti. Jeesitiimi käsittelee tietokoneapua ja IT-ohjeita; sen reseptisivut ovat vain vanhojen osoitteiden uudelleenohjauksia.

```text
reseptit/*.md + kaannokset/**/*.md
    -> site/scripts/build-content.ts
    -> site/dist
    -> GitHub Pages: https://ozirix-dev.github.io/Reseptit/
```

Build käyttää repon paikallisia Markdown-tiedostoja. Se julkaisee vain `status: published` -reseptit ja muodostaa sisältöindeksin, sivureitit, sitemapin ja robots-tiedoston. Arkistoa, raakileita, mallipohjia tai luonnoksia ei julkaista.

## Kehitys ja julkaisu

Reseptisivuston lähdekoodi on `site/`-kansiossa. Paikalliset komennot ajetaan siellä:

```powershell
npm ci
npm test
npm run build
npm run preview
```

GitHub Actions ajaa testit ja buildin reseptisisällön tai sivustokoodin PR:issä. `main`-haaraan yhdistetyt muutokset julkaistaan GitHub Pagesiin. Sivuston base path on `/Reseptit/`, koska julkaisu käyttää projektisivuston osoitetta.

## Julkaisu- ja SEO-säännöt

- Suomen hakemisto on sivuston juuri `/Reseptit/`; reseptin osoite on `/Reseptit/<url_slug>/`.
- Käännösten reitit ovat `/Reseptit/en/recipes/`, `/Reseptit/sv/recept/` ja `/Reseptit/th/recipes/`.
- Hakemisto, reseptit, kielilinkit, canonical-, hreflang- ja `Recipe`-JSON-LD-tiedot perustuvat vain julkaistuun sisältöön.
- Tällä hetkellä julkaistuna on suomenkielinen kermainen lohipata. Englannin ja thain luonnokset eivät tuota julkisia sivuja.
- GitHub Pagesin projektisivuston `robots.txt` sijaitsee projektin polun alla. Sitemap on `https://ozirix-dev.github.io/Reseptit/sitemap.xml`.

## Jeesitiimin vanhat osoitteet

Kun GitHub Pages -julkaisu on tarkistettu, Jeesitiimin Cloudflare Pagesiin lisätään pysyvät uudelleenohjaukset vanhoille osoitteille:

- `https://jeesitiimi.com/reseptit/` -> `https://ozirix-dev.github.io/Reseptit/`
- `https://jeesitiimi.com/reseptit/<slug>/` -> `https://ozirix-dev.github.io/Reseptit/<slug>/`

Jeesitiimi ei sisällä reseptiartikkeleita, reseptivalikkoa, reseptien sitemap-osoitteita tai reseptisisällön build-vaihetta.
