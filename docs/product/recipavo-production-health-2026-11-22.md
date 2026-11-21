# [Chat 1] Recipavon tuotannon kevyt jatkuva terveystarkistus

**Tila:** uusi read-only GitHub Actions -valvonta. Ei Cloudflare-deployta, salaisuuksia, DNS-muutoksia tai palautteen POST-kutsuja.

## Tarkoitus

Varmistaa säännöllisesti, että `https://www.recipavo.com` toimii myös **julkaisujen välillä**. Uusi `.github/workflows/recipavo-production-health.yml` voidaan käynnistää käsin ja se ajetaan lisäksi neljä kertaa vuorokaudessa UTC-aikoihin 00:17, 06:17, 12:17 ja 18:17 (GitHubin ajoitus voi viivästyä).

Tarkistuksen kohteet (9 GET-pyyntöä per ajo):

- FI-etusivu sekä EN/SV/TH-hakemistot: HTTP 200, 40-merkkinen ja yhtenäinen julkaisu-SHA, oikea `lang`, canonical ja ei `noindex`-merkintää.
- `robots.txt`: toimiva `Sitemap:`-osoite ja ei koko sivuston `Disallow: /` -kieltoa.
- `sitemap.xml`: kaikkien neljän kielihakemiston julkiset reitit.
- Tarkoituksella puuttuva sivu: HTTP 404 ja `noindex`.
- `GET /api/feedback`: HTTP 405 ja `{"error":"method_not_allowed"}` JSONina. **Ei POST-pyyntöä.**
- Etusivun viittaama hash-nimetty JavaScript-aloitustiedosto: HTTP 200 ja ei tyhjä sisältö.

`robots.txt`-vastauksen mahdollinen vanha CDN-välimuistin SHA-otsake **ei yksin aiheuta hälytystä**, koska tuotannon jälkitarkistuksissa tämä ilmiö on jo todettu. HTML-sivujen SHA:n on kuitenkin oltava yhtenäinen.

GitHubin epäonnistunut workflow ja sen loki ovat hälytyksen lähde; tämä työ ei avaa automaattisesti issueita, muuta tuotantoa eikä tee rollbackia.

## Käyttö

**Actions → Recipavo production health (read-only) → Run workflow** käynnistää tarkistuksen heti. Ajastus tarvitsee julkaistun workflow-tiedoston oletushaarassa `main`. PR:ssä ajetaan vain offline-testit, ei tuotantoprobea.

Tulokset löytyvät ajon yhteenvedosta. GitHubin Actions-ilmoitusasetuksista riippuen epäonnistuminen voi tuottaa ilmoituksen.

Offline-testit kattavat onnistuneen tilanteen sekä rikkinäiset SHA:t, canonicalin, `noindex`-asetuksen, kielireitin, sivukartan, 404:n, Functions 405:n, puuttuvan JS-assetin ja verkkovirheen.

**Rajaus:** Tämä on saatavuus-/reititysmonitorointi, ei sisällön täydellinen laatukatselmus eikä korvaa SHA-lukitun tuotantojulkaisun `verify:production`-tarkistusta. Julkaisun aikana HTML-reitit voivat hetkellisesti näyttää eri revisioita; varmista hälytyksen jatkuvuus ennen korjaavaa toimenpidettä.
