# [Chat 1] Recipavon GitHub Actions -tuotantojulkaisu (käsin käynnistetty, 10 min ajastettu)

**Tila:** tuotantoworkflow on mainissa; ajastinportin päivitys PR:n alla. **Ei tuotantojulkaisua tämän muutoksen kautta.** Käyttöönotto edellyttää GitHub Environmentin 10 minuutin suoja-ajastinta, vain main-haaraa ja Cloudflare-salaisuuksien erillistä määritystä. Vanha PowerShell-julkaisuskripti jää hätävaraksi.

## Perusajatus

Reseptit on GitHubissa; `www.recipavo.com` toimii Cloudflare Pagesin `recipavo-site`-**Direct Upload** -projektissa, jonka tuotantohaara on `production`. Vihreä `Recipe site` -CI ei automaattisesti julkaise sitä. Uusi `.github/workflows/recipavo-production-manual.yml` ajaa tuotantoon vasta **käsin käynnistetyn**, SHA-sidotun, CI-vahvistetun ja GitHub Environmentin 10 minuutin odotusajan läpäisseen version.

## Kertaluonteinen GitHub-asennus

1. Avaa **Repository Settings → Environments → recipavo-production** (luo ympäristö, jos sitä ei ole). Valitse **Wait timer: 10 minutes**, pidä **Required reviewers** pois käytöstä ja poista **Allow administrators to bypass configured protection rules**. Valitse **Deployment branches and tags → Selected branches and tags → main** (täsmälleen yksi sallittu haaramalli `main`). Paina **Save protection rules**. Workflow varmentaa nämä kaikki suoraan GitHub API:sta, myös täsmälleen yhden `main`-haararajoituksen; puuttuva asetus estää julkaisun.
2. Lisää vain kyseisen ympäristön **Secrets**-kohtaan `CLOUDFLARE_API_TOKEN` (Cloudflare Pages -projektiin/tiliin rajattu Pages Edit/Write -oikeus) ja `CLOUDFLARE_ACCOUNT_ID` (tilin 32-merkkinen ID). **Älä kopioi tunnuksia keskusteluun tai koodiin.**
3. Varmista, että repon CI:ssä käytetyt kuva-aineiston lukusalaisuudet `IMAGE_CI_ACCESS_KEY_ID` ja `IMAGE_CI_SECRET_ACCESS_KEY` ovat GitHub Actionsin käytössä. Build pysähtyy, jos manifestin kuvia ei voi varmentaa.
4. Cloudflare Pagesissa `recipavo-site`: tuotantohaara on `production`, `FEEDBACK_ENABLED` puuttuu ja tuotannon D1-sidonnat puuttuvat. Workflow tarkistaa nämä suoraan Cloudflaren API:sta **jokaisella julkaisukerralla**. Tämä PR ei muuta niitä.

**Hyväksyntä on yksi käsin tehty `workflow_dispatch` ja 10 minuutin automaattinen odotus.** `recipavo-production`-ympäristö ei pyydä `Review deployments` -vahvistusta. Ajastin ei korvaa SHA-/CI-, Cloudflare- tai tuotannon HTTP-tarkistuksia. Ilman ajastinta, `main`-rajoitusta tai jos admin-bypass on sallittu, suoritus päättyy HOLDiin. Nämä ehdot tarkistetaan myös odotuksen jälkeen ennen uploadia.

## Julkaisu

1. Valitse hyväksytty, täsmälleen nykyinen GitHubin `main`-SHA. Varmista, että täsmälleen saman SHA:n **Recipe site** -CI on valmistunut onnistuneesti. Jos `main`-commit ei käynnistänyt CI:tä (esimerkiksi docs/workflow-merge), käynnistä **Actions → Recipe site → Run workflow → main → full_suite=true** ja odota SUCCESS.
2. Avaa **Actions → Recipavo production release (manual) → Run workflow**, valitse `main`, anna täysi 40-merkkinen `release_sha` ja muuta `confirmation`-kentän oletus `DO_NOT_RELEASE` arvoon **`RELEASE recipavo-site production`**.
3. `gate` tarkistaa SHA:n olevan samanaikaisesti `github.sha`, GitHubin nykyinen `main`-SHA ja viimeisimmän onnistuneen `Recipe site` main-CI-ajon SHA. Se tarkistaa myös `recipavo-production`-ympäristön 10 minuutin ajastimen, `main`-haararajoituksen ja ylläpitäjän ohituskiellon.
4. GitHub odottaa `recipavo-production`-ympäristön **10 minuutin Wait timer** -ajan. Tänä aikana ajon voi peruuttaa. Ajan päätyttyä `release` saa ympäristön Cloudflare-tunnukset automaattisesti, jos muut suojaehdot täyttyvät.
5. `release` tarkistaa CI:n ja Cloudflare-konfiguraation uudelleen, palauttaa/varmentaa kuva-aineiston ja Git-overlaysit, varmistaa että Pagesin `site/functions/api/feedback.ts` on oikea lähdetiedosto ja sisältää `GET 405`-reitin sekä POST-vastaanoton ominaisuusportin, rakentaa Node 22:lla tuotantoversion (`RECIPAVO_BUILD_TARGET=production`, Preview-origin poistettuna, palautelomakkeen UI pois), tarkistaa staattisen tulosteen ja leimaa distin samalla SHA:lla.
6. Välittömästi ennen uploadia tarkistetaan `main`-SHA, CI ja Cloudflare-ympäristön asetukset vielä kerran. Jos sama SHA on jo www-tuotannossa, upload ohitetaan. Muussa tapauksessa `wrangler@4.165.0 pages deploy dist --project-name recipavo-site --branch production --commit-hash <SHA>` suoritetaan `site/`-hakemistossa.
7. `npm run verify:production` tarkistaa tuotannon SHA:n, nelikielisiä reseptisivuja, 404:n, sitemapin, robots.txt:n, JavaScript-assetsisällön ja SEO:n; lisäksi `GET /api/feedback` on palautettava **405 JSON**. POST-testiä tai palautteen tallennusta ei käynnistetä.

## HOLD / riskirajat

- Väärä SHA, main-haara vaihtunut, keskeneräinen/epäonnistunut CI tai puuttuva tai väärä 10 minuutin suoja-ajastin, `main`-rajaus tai sallittu ylläpitäjän ohitus → **HOLD, ei deploymentia**.
- Puuttuvat Cloudflare-tunnukset tai väärä projekti/tuotantohaara, `FEEDBACK_ENABLED`-muuttuja tai D1-sidonta → **HOLD**.
- Puuttuva tai virheellinen Pages Function -lähde (`site/functions/api/feedback.ts`), puuttuvat kuvat, tuotanto-HTML:n `noindex`, leiman ristiriita tai yli 20 000 tiedostoa / liian suuri tiedosto → **HOLD ennen Wrangler-uploadia**.
- Jos Wrangler ilmoittaa deploymentin valmiiksi mutta HTTP-jälkitesti epäonnistuu, **älä automaattisesti toista uploadia**. Tutki jo julkaistu versio ja tarvittaessa käytä erikseen hyväksyttyä rollbackia.
- Tämä ei aseta D1:tä, Turnstileä, Cronia, WAFia, DNS:ää, `FEEDBACK_ENABLED`-lippua tai muuta vanhaa Coming Soon -projektia.

Työnkulku ei sisällä `push`-, `pull_request`- tai `schedule`-julkaisukäynnistimiä. Samanaikaisten production-ajojen estämiseksi käytössä on yksi concurrency-ryhmä, jossa aktiivista ajoa ei peruuteta.

Lähteet: [GitHub ympäristöt](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments), [GitHub käsin käynnistys](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [Cloudflare Direct Upload CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [julkaisukuilun todentaminen #812](https://github.com/ozirix-dev/Reseptit/issues/812).
