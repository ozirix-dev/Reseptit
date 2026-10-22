# Search Console -vahvistus ja SEO-tarkistus — 22.10.2026

## Muutos

- Lisättiin Search Consolen kuvassa näkyvälle URL-etuliiteominaisuudelle vahvistustiedosto `site/public/google0c6f9c0486376f0f.html`.
- Staattisen buildin regressiotesti tarkistaa, että tiedosto julkaistaan sivuston juuressa odotetulla nimellä ja sisällöllä.
- Google Search Consolen selainohjaus esti tiedoston lataamisen, joten tiedoston yksirivinen sisältö muodostettiin Googlen vahvistustiedoston vakiomuodon ja kuvassa näkyvän tiedostonimen perusteella. Googlen mukaan tiedoston sisällön on vastattava täsmälleen vahvistusnäkymässä annettua tiedostoa. Vahvistusta ei ole vielä painettu.

## SEO-tarkistus

- Tuotantobuild onnistui ja prerenderöi 480 reittiä.
- Staattisesta tulosteesta tarkistettiin kaikki 480 sivua: jokaisella on title, description, canonical ja tuettu `lang`-arvo.
- Sitemapissa on 480 URL:ia; kaksoisosoitteita tai sitemapista puuttuvia canonical-osoitteita ei löytynyt.
- Olemassa olevien testien mukaan kielikohtaiset hreflangit, Recipe JSON-LD, sitemap ja projektipolun robots.txt ovat kunnossa.
- Julkisesta sivustosta etusivu, sitemap ja robots.txt palauttivat HTTP 200. Vahvistustiedoston URL palautti vielä HTTP 404, koska tätä muutosta ei ole julkaistu.
- Build ilmoitti suuresta JavaScript-bundlesta: 1,714.64 kB (347.15 kB gzip). Tämä on latausnopeuden optimointikohde, ei buildin tai löydettävyyden estävä virhe.

## Testit

- `npm test`: 21/21 läpäisi.
- `npm run test:translations`: 2/2 läpäisi.
- `npm run test:image`: 2/2 läpäisi.
- `npm run build`: onnistui.
- `npm run test:static`: 7/7 läpäisi.
- `npm run test:browser`: läpäisi.

## Seuraava tarkistus

Kun PR on yhdistetty ja GitHub Pages on julkaissut muutoksen, avaa vahvistustiedoston julkinen URL ja suorita omistajuuden vahvistus Search Consolessa. Koska kuvassa näkyvän tiedoston alkuperäistä latausta ei voitu saada selaimesta, varmista sivulta löytyvä sisältö vastaamaan Search Consolen tarjoamaa tiedostoa ennen vahvistuksen painamista.
