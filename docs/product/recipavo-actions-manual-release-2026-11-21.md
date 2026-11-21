# [Chat 1] Recipavon GitHub Actions -tuotantojulkaisu (käsin hyväksyttävä)

**Tila:** julkaisuputken toteutus. **Ei tuotantojulkaisua tämän PR:n kautta.** Käyttöönotto edellyttää GitHub-ympäristön hyväksyjien ja Cloudflare-salaisuuksien erillistä määritystä. Vanha PowerShell-julkaisuskripti jää hätävaraksi.

## Perusajatus

Reseptit on GitHubissa; `www.recipavo.com` toimii Cloudflare Pagesin `recipavo-site`-**Direct Upload** -projektissa, jonka tuotantohaara on `production`. Vihreä `Recipe site` -CI ei automaattisesti julkaise sitä. Uusi `.github/workflows/recipavo-production-manual.yml` ajaa tuotantoon vasta **käsin käynnistetyn**, SHA-sidotun, CI-vahvistetun ja GitHub Environment -hyväksytyn version.

## Kertaluonteinen GitHub-asennus

1. Avaa **Repository Settings → Environments → New environment**, anna nimeksi täsmälleen **`recipavo-production`**. Määritä **Required reviewers** (vähintään yksi käyttäjä/tiimi). Jos hyväksyjä on joku muu kuin käynnistäjä, valitse myös **Prevent self-review**. Suojaa julkaisuympäristön haarat rajoittamalla ne `main`-haaraan, jos kyseinen asetus on käytettävissä. Työnkulku tarkistaa hyväksyjien olemassaolon GitHubin API:sta jo ennen Cloudflare-vaihetta.
2. Lisää vain kyseisen ympäristön **Secrets**-kohtaan `CLOUDFLARE_API_TOKEN` (Cloudflare Pages -projektiin/tiliin rajattu Pages Edit/Write -oikeus) ja `CLOUDFLARE_ACCOUNT_ID` (tilin 32-merkkinen ID). **Älä kopioi tunnuksia keskusteluun tai koodiin.**
3. Varmista, että repon CI:ssä käytetyt kuva-aineiston lukusalaisuudet `IMAGE_CI_ACCESS_KEY_ID` ja `IMAGE_CI_SECRET_ACCESS_KEY` ovat GitHub Actionsin käytössä. Build pysähtyy, jos manifestin kuvia ei voi varmentaa.
4. Cloudflare Pagesissa `recipavo-site`: tuotantohaara on `production`, `FEEDBACK_ENABLED` puuttuu ja tuotannon D1-sidonnat puuttuvat. Workflow tarkistaa nämä suoraan Cloudflaren API:sta **jokaisella julkaisukerralla**. Tämä PR ei muuta niitä.

GitHubin hyväksyntä ei tarkoita pelkkää käsin tehtyä `workflow_dispatch`-käynnistystä: `recipavo-production`-ympäristön oikea **Review deployments** -hyväksyntä on toinen erillinen portti. Puuttuvat Required reviewers -asetukset johtavat aina HOLDiin.

## Julkaisu

1. Valitse hyväksytty, täsmälleen nykyinen GitHubin `main`-SHA. Varmista, että täsmälleen saman SHA:n **Recipe site** -CI on valmistunut onnistuneesti. Jos `main`-commit ei käynnistänyt CI:tä (esimerkiksi docs/workflow-merge), käynnistä **Actions → Recipe site → Run workflow → main → full_suite=true** ja odota SUCCESS.
2. Avaa **Actions → Recipavo production release (manual) → Run workflow**, valitse `main`, anna täysi 40-merkkinen `release_sha` ja muuta `confirmation`-kentän oletus `DO_NOT_RELEASE` arvoon **`RELEASE recipavo-site production`**.
3. `gate` tarkistaa SHA:n olevan samanaikaisesti `github.sha`, GitHubin nykyinen `main`-SHA ja viimeisimmän onnistuneen `Recipe site` main-CI-ajon SHA. Se tarkistaa myös `recipavo-production`-ympäristön Required reviewers -määrityksen.
4. Hyväksy GitHubin **Review deployments** -pyyntö. Vasta tämän jälkeen `release` saa ympäristön Cloudflare-tunnukset.
5. `release` tarkistaa CI:n ja Cloudflare-konfiguraation uudelleen, palauttaa/varmentaa kuva-aineiston ja Git-overlaysit, rakentaa Node 22:lla tuotantoversion (`RECIPAVO_BUILD_TARGET=production`, Preview-origin poistettuna, palautelomakkeen UI pois), tarkistaa staattisen tulosteen ja leimaa distin samalla SHA:lla.
6. Välittömästi ennen uploadia tarkistetaan `main`-SHA, CI ja Cloudflare-ympäristön asetukset vielä kerran. Jos sama SHA on jo www-tuotannossa, upload ohitetaan. Muussa tapauksessa `wrangler@4.165.0 pages deploy dist --project-name recipavo-site --branch production --commit-hash <SHA>` suoritetaan `site/`-hakemistossa.
7. `npm run verify:production` tarkistaa tuotannon SHA:n, nelikielisiä reseptisivuja, 404:n, sitemapin, robots.txt:n, JavaScript-assetsisällön ja SEO:n; lisäksi `GET /api/feedback` on palautettava **405 JSON**. POST-testiä tai palautteen tallennusta ei käynnistetä.

## HOLD / riskirajat

- Väärä SHA, main-haara vaihtunut, keskeneräinen/epäonnistunut CI tai puuttuva hyväksyntäsääntö → **HOLD, ei deploymentia**.
- Puuttuvat Cloudflare-tunnukset tai väärä projekti/tuotantohaara, `FEEDBACK_ENABLED`-muuttuja tai D1-sidonta → **HOLD**.
- Puuttuvat kuvat, tuotanto-HTML:n `noindex`, leiman ristiriita tai yli 20 000 tiedostoa / liian suuri tiedosto → **HOLD**.
- Jos Wrangler ilmoittaa deploymentin valmiiksi mutta HTTP-jälkitesti epäonnistuu, **älä automaattisesti toista uploadia**. Tutki jo julkaistu versio ja tarvittaessa käytä erikseen hyväksyttyä rollbackia.
- Tämä ei aseta D1:tä, Turnstileä, Cronia, WAFia, DNS:ää, `FEEDBACK_ENABLED`-lippua tai muuta vanhaa Coming Soon -projektia.

Työnkulku ei sisällä `push`-, `pull_request`- tai `schedule`-julkaisukäynnistimiä. Samanaikaisten production-ajojen estämiseksi käytössä on yksi concurrency-ryhmä, jossa aktiivista ajoa ei peruuteta.

Lähteet: [GitHub ympäristöt](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments), [GitHub käsin käynnistys](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [Cloudflare Direct Upload CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [julkaisukuilun todentaminen #812](https://github.com/ozirix-dev/Reseptit/issues/812).
