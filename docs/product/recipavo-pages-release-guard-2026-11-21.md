# [Chat 1] Recipavon Pages-julkaisun suojattu suoritus

**Tila 21.11.2026:** Toteutettu erillinen PowerShell-julkaisutyökalu ja offline-syntaksitarkistus. **Pilvitilin tuotantojulkaisua ei ole suoritettu tässä PR:ssä.**

Ongelman varmistettu osa: Cloudflare Pagesin `recipavo-site` on ollut **Direct Upload** -projekti; GitHub Actionsin `Recipe site` rakentaa ja testaa, mutta ei julkaise Cloudflareen. Projektin tuotantohaara on aiemmin ollut `production` – `--branch main` johti preview-deployhin. Tämä ei todista mahdollisen uuden Wrangler-julkaisun erillistä autentikointi-/verkko-/asset-virhettä. Yhteinen diagnostiikka: [issue #812](https://github.com/ozirix-dev/Reseptit/issues/812).

## Turvallinen korjaus: käytä aikaisempaa toimivaa Wrangler-tapaa, mutta lukitse SHA

Uusi `scripts/recipavo-pages-production.ps1` ei vaadi uutta Pages-projektia tai uutta automaattijulkaisua. Se tarkistaa kirjautuneella Windows-koneella:

1. GitHub-remote on `ozirix-dev/Reseptit`, paikallinen HEAD ja remote-`main` vastaavat annettua 40-merkkistä SHA:ta, eikä tracked-työpuussa ole keskeneräisiä muutoksia.
2. `site/dist/_headers` sisältää **täsmälleen yhden** `X-Recipavo-Commit: <SHA>`-rivileiman, ja Files-määrä sekä yksittäisten tiedostojen koko mahtuvat Pages-rajoihin.
3. `site/functions/api/feedback.ts` on oikeassa Pages-projektin juuressa. Oletusprojekti `recipavo-site` on löydettävä Wrangler-tililtä, ja Cloudflaren `production_branch` on oltava `production`. Jos se on eri, työ pysähtyy; tuotantohaaraa ei muuteta.
4. Aiempi Production-deployment on löydettävä ja live `www.recipavo.com`-revisiotunniste on oltava luettavissa. Jos live vastaa jo hyväksyttyä SHA:ta, suoritetaan **NOOP**.
5. Ilman `-Apply`-lippua lopetetaan tarkistusten jälkeen. `-Apply` edellyttää PowerShellin vahvistusta (ShouldProcess) ja käyttää **vain** `wrangler@4.165.0 pages deploy <dist> --project-name recipavo-site --branch production --commit-hash <SHA>`.
6. Deployn jälkeen `npm run verify:production` vertaa leimattua `dist`-artefaktia oikeaan tuotantoon; lisäksi vaaditaan `GET /api/feedback` = 405 JSON. **Palautteen POST-vastaanottoa ei aktivoida.**

## Käyttö nykyisellä Windows-koneella

Tämä työkalu on repossa, ei osoitteessa `D:\MCP` tai muussa tunnelin kansiossa. Ei kopioida Cloudflare-tunnuksia ChatGPT:hen.

Ennen ajoa varmista, että GitHubista on haettu hyväksytty julkaisu-SHA ja että **samasta SHA:sta** on rakennettu ja leimattu `site/dist` olemassa olevan julkaisuprosessin mukaisesti. Skripti **ei rakenna**, muuta worktreeä, generoi SHA-leimaa, käynnistä toimia toisessa chatissa tai julkaise vanhaa sattumanvaraista buildia.

```powershell
# Esimerkki: käytä omaa täyttä hyväksyttyä main-SHA:ta
$sha = '<hyvaksytty-40-merkkinnen-main-sha>'
$script = 'D:\Projects\Products\Reseptit\scripts\recipavo-pages-production.ps1'

# Vain lukevat esiehdot: ei deployta
& $script -ExpectedSha $sha

# Vasta, kun tarkistukset ja julkaisu on hyväksytty:
& $script -ExpectedSha $sha -Apply
```

Varoitus: `-Apply` on **oikea tuotanto-operaatio**, eikä sen käyttämistä tule automatisoida oletuksena. Älä käytä `-Confirm:$false`-ohitusta tai muuta Repo Guardin julkaisuporttia. Yhden SHA:n rakentaminen ja hyväksyminen sekä mahdollinen viimeisten muiden chattien commitien erottaminen kannattaa tehdä erillisessä puhtaassa release-worktreessä.

`-Apply` ei luo D1-kantaa, WAF-sääntöä, Turnstile-avainta, Cron-Workeria, salaisuuksia eikä aseta `FEEDBACK_ENABLED=true` tai `VITE_RECIPAVO_FEEDBACK_ENABLED=true`. Käyttöönotto pysyy HOLDissa, kunnes [palautekanavan portit](recipavo-cloudflare-readiness-2026-11-21.md) ovat todennetut.

## Mitä tämä ratkaisee ja mitä ei

**Ratkaisee käytäntötasolla:** GitHubin CI:n ja Direct Upload -tuotannon välissä puuttuvan manuaalisen julkaisuvaiheen, oikean Cloudflare-`production`-haaran sekä artefaktin ja testatun commitin sitomisen samaan versioon. Väärä projekti/haara/SHA/vanhentunut artefakti pysähtyy ennen uploadia.

**Ei todista etukäteen:** Cloudflare-tilin nykyistä kirjautumista, projektin nykyistä production-haaraa tai Pagesin mahdollisen aiemman upload-virheen juurisyytä. Jos Wrangler-julkaisu epäonnistuu 4xx/5xx/timeout-tilaan, säilytä julkaistut vanhat tiedot ja raportoi **sanitoitu** virhevaihe issueen #812, älä tulosta salaisuuksia.

GitHubin erillinen `.github/workflows/recipavo-release-guard.yml` tarkistaa PowerShellin AST:n ja vaaditut suojamekanismit, mutta **ei koskaan suorita tuotanto- tai pilvikutsua**.

Lähteet: [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Wrangler Pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/), [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/).
