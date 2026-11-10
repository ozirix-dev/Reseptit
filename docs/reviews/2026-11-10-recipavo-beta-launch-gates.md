# Recipavo – käyttäjätestauksen avausportti (10.11.2026)

**Tila:** tarkistus-/koordinointiaineisto, EI tuotantojulkaisulupa. **Työnjako:** PR #402 hoitaa tarkistuskirjan, issue #404 omistaa reseptien 38-kohdan korjausjonon, rinnakkaiset kokki-PR:t omistavat reseptit. Cloudflare-domainiin ei kosketa ilman käyttäjän nimenomaista hyväksyntää.

## Toistettava tämänhetkinen lähtötaso

| Portti | Tila | Täsmällinen näyttö / tehtävä |
| --- | --- | --- |
| GitHub Pages -staging, build | **PASS** | `main` SHA `7498c6741cb19a21dfb419f1cbc7b1bf00423054`, [Recipe site #42863429389](https://github.com/ozirix-dev/Reseptit/actions/runs/42863429389): job `build=success` |
| GitHub Pages -staging, deploy | **PASS** | Sama ajo: `deploy=success`, `actions/deploy-pages@v5=success` |
| Julkinen reittien HTTP-sisältösmoke | **NOT VERIFIED** | Tästä ympäristöstä `github.io` ja `www.recipavo.com` eivät ole DNS-/HTTP-tavoitettavissa. Tarkista vasta käyttäjän/luotettavan julkaisijan ympäristöstä, älä väitä outagea. |
| 82 FI-auditointiosumaa | **TRIAGED** | [PR #402](https://github.com/ozirix-dev/Reseptit/pull/402): 38 käsittelyä vaativaa, 8 FI-näyttöoverlayllä oikaistua, 11 korjattua alkuperäisosumaa, 20 väärää hälytystä, 5 toimituksellista. Tulos ei kata kaikkia 335 reseptiä täydellisenä aistinvaraisena tarkastuksena. |
| Korjausjonon 38 kohdetta | **BLOCKED** | [Issue #404](https://github.com/ozirix-dev/Reseptit/issues/404). Ei yhtään riviä saa sulkea ilman ajantasaisen SHA:n, vaikutusten ja relevantin CI/Pages/evidenssin varmennusta. |
| FI/EN/SV/TH julkaistut kieliparit | **OSITTAIN** | `meta/kaannokset/published-translation-pairs.json`: 59 FI-reseptiä / 177 julkaistua EN/SV/TH-paria; ei sama kuin koko julkaistun FI-kannan käännöskattavuus. |
| F25 käännösluonnokset | **HOLD** | [PR #399](https://github.com/ozirix-dev/Reseptit/pull/399): 75 Draftia, 21 SOURCE-HOLD + 4 needs-chef-review; niitä ei lasketa julkaistuihin. [PR #396](https://github.com/ozirix-dev/Reseptit/pull/396): E20 Draft kesken. |
| Uuden reseptin ennakkoportti | **DRAFT** | [PR #400](https://github.com/ozirix-dev/Reseptit/pull/400) ei vielä yhdistetty; vanhojen reseptien laatuvelka ei ratkea tämän portin avulla. |
| Recipavo-tuotantodomain ja DNS-cutover | **NOT AUTHORIZED / NOT VERIFIED** | [Cloudflare V2 -suunnitelma](../../docs/recipavo-cloudflare-release-plan.md): `www.recipavo.com` on tarkoitettu Cloudflare-tuotannoksi, GitHub Pages stagingiksi. Coming Soon säilyy kunnes erillinen lupa. [Issue #334](https://github.com/ozirix-dev/Reseptit/issues/334) odottaa cutoveria. |
| Rekisteröityminen, pääsyn rajaus ja palautelomake | **NOT VERIFIED** | [Etusivun esikatselu PR #312](https://github.com/ozirix-dev/Reseptit/pull/312) ei tuonut tilikirjautumista eikä palautetta; nykyisestä reitityksestä ei löytynyt niitä koskevia selviä reittejä. Tarvitsee erillisen toiminnallisen testin ja tietosuojaratkaisun ennen kutsuttuja koekäyttäjiä. |

## Ehdotettu kevyt avauspolku

1. **Reseptit:** korjaa tai poista käyttäjän saatavilta todetut vakavat valmistus-, turvallisuus- ja ravintovirheet (A/B ennen C). Esimerkkejä kassavan turvallinen käsittely, ackeen varoitettu raw-ohje, suurien misa/wakame/nori/siemenmäärien selvitys. Näyttöoverlay ei muuta alkuperäisen ravintomallin hyväksyntää.
2. **Käännökset:** julkaise vain tarkastetut kieliparit. Muuttuneen FI-ohjeen ja EN/SV/TH:n ajantasaiset merkitys-/SHA-parit vaaditaan ennen kielijulkaisua. Käyttäjää ei saa ohjata Draft-resepteihin.
3. **Stagingin tekninen smoke:** vähintään FI-etusivu, EN/SV/TH-kieliluettelot, 3–5 nelikielistä reseptireittiä, reseptikuvat, hakusuodattimet ja GK-selitteet. Kirjaa HTTP-status, canonical, hreflang, sitemap/robots ja tutkittu commit SHA. Tarkista 404, ei vain jokaisen reitin 200.
4. **Koekäyttäjien pääsy:** päätä kevyt kutsujen/tilien hallinta, tietojen minimointi, suostumus ja poistaminen; testaa sisään/ulos, kutsun toiminta, anonyymin rajoitus ja virhetilanteet. Älä tee laajaa kirjautumisjärjestelmää vain testin vuoksi; arvioi valmis, turvallinen kirjautumisratkaisu.
5. **Palaute + käytön mittaus:** testaa lomakkeen lähetys, roskapostisuoja, tietojen säilytysaika, palautteen lukijan työjono sekä yksityisyyttä kunnioittava käyttöanalytiikka. Älä talleta salasanoja tai arkaluonteisia tietoja palautteeseen.
6. **Cloudflare preview:** rakenna erilliseen preview-ympäristöön samalla hyväksytyllä sisältö-SHA:lla. Varmista `/`-asset/reitityspohja, origin, SEO, HTTP 200/404, kuvat ja neljä kieltä, ilman nykyisen Coming Soon -sivun muuttamista.
7. **Erillinen GO/NO-GO:** käyttäjä hyväksyy nimenomaisesti tuotantocommitin, domain-cutoverin, indeksoinnin ja palautustavan. Vasta sitten Cloudflare julkaisu `www.recipavo.com` ja tuotannon smoke. GitHub Pagesin vihreä ajo ei ole tämä lupa.

## Julkaisuvalmiuden päätössääntö

**NO-GO**, jos tunnettu vaarallinen tai olennaisesti harhaanjohtava valmistus-/ravinto-ohje näkyy reseptinä, käyttämätön turvallisuusvaroitus ei estä reseptin seuraamista, ympäristön oikeaa julkaisu-SHA:ta ei voi todeta, tai testikäyttäjän henkilötietojen käsittelyä ei ole ratkaistu. **GO koekäyttöön** vasta, kun julkisesti näkyvään aineistoon jää vain hyväksyttävästi selitettyjä GI/GK-puutteita ja vähäisiä toimituksellisia asioita, eikä testikäyttäjän ole pakko luottaa keskeneräisiin ohjeisiin.

## Varmennusraja

Tämän asiakirjan `PASS` viittaa täsmällisesti GitHub Pages -stagingin onnistuneisiin jobeihin. Se **ei väitä**, että käyttäjän Cloudflare-tuotanto, live-sisältö, DNS, SSL, rekisteröityminen tai palaute olisi tällä hetkellä toimintakunnossa. Nämä ovat tietoisesti erillisiä myöhempiä portteja. Kaikki 38 korjauskohdetta säilyvät issue #404:ssa, kunnes niistä on vahvistettu valmistumisevidenssi.
