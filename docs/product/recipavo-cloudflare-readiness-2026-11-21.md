# [Chat 1] Recipavon Cloudflare-julkaisun käyttöönottorajat ja testaus

**Päivä:** 21.11.2026. **Tila:** ESIKATSELUUN VALMISTELU / TUOTANTOVASTAANOTTO OFF / CLOUDFARE-RESURSSIEN TARKISTUS HOLD.

**Työn omistaja:** Chat 1. Tämä dokumentti ja erillinen GitHub Actions -työnkulku eivät luo Cloudflare-resursseja, muuta tunnuksia tai julkaise sivustoa. Vastuullinen Cloudflare/Codex-julkaisija varmistaa tiliasetukset erillisenä työvaiheena.

## 1. Nykytilan vahvistetut ja vahvistamattomat asiat

GitHubin `main`-haaraan yhdistetyn [PR #780](https://github.com/ozirix-dev/Reseptit/pull/780) lähdekoodissa ovat:
- `site/functions/api/feedback.ts` – Cloudflare Pages Function, jonka `GET` antaa 405 ja `POST` antaa 503 kun vastaanoton erikseen hyväksyttyjä sidontoja/aktivointia ei ole.
- `site/migrations/0001_feedback.sql`, `0002_feedback_retention.sql`, `0003_feedback_quota.sql` – yksityinen D1-skeema.
- `site/workers/feedback-retention.ts` – erillisen päivittäin ajettavan Workerin lähdekoodi, ei vielä Cron-toteutusta.
- Nelikielinen palaute-UI pysyy oletuksena OFF, jos `VITE_RECIPAVO_FEEDBACK_ENABLED` ja julkinen sitekey eivät ole nimenomaisesti asetettuina.

Githubin `Recipe site` -CI ei julkaise Cloudflareen. `site/wrangler.assistant.jsonc` on *erillisen mock-assistant Workerin* `assets`-konfiguraatio; se ei ole Pages-tuotannon konfiguraatio eikä sitä saa käyttää sellaisenaan. **Oikean Pages-projektin nimi, kytkentä (Direct Upload vai Git), deploy-tilanne, projektin build root, branch-säännöt, olemassa olevat sidonnat ja julkaisutapa ovat yhä tililtä vahvistamatta.**

## 2. Vaihe 1 – julkaisutavan selvitys ja korjaus (Cloudflare-tilille pääsyn jälkeen)

1. Lue **read-only** Cloudflaren Workers & Pages -näkymästä oikea tuotantoprojekti, siihen kytketty `www.recipavo.com`-domain, projektin nimi, tuotantohaara, deploy-laji, käyttöönottotasot, viimeisin julkaisu-SHA, build root ja output-dir. Älä arvaa projektin nimeä pelkän preview-hostin perusteella.
2. Varmista, että valitulla projektilla voidaan asentaa `site/functions/` Pages-projektin juuresta. Buildin normaali staattinen output on `site/dist`; Functions-koodia ei kopioida `dist`-hakemistoon. Dashboardin drag-and-drop Direct Upload **ei tue** Functions-koodia; Wrangler Pages Deploy tai oikein konfiguroitu Git-integraatio tukee sitä.
3. Varmista, sallivatko nykyisen projektin Git-auto-deploy-säännöt tahattoman tuotantojulkaisun, jos `main` muuttuu. **Älä muuta julkaisuasetuksia automaattisesti, ota käyttöön production-deployta tai vaihda projektityyppiä.** Direct Upload -projektia ei voi vain vaihtaa Git-integraatioksi. Väliaikainen preview-julkaisu vaatii erillisen vahvistetun projektin ja hyväksynnän.
4. Tarkista nykyinen tuotannon Pages-yhteensopivuuspäivä ja kaikki sidonnat. Jos tarvitaan Wrangler-konfiguraatio, käytä ensin `npx wrangler pages download config <vahvistettu-projekti>` **erillisessä tarkistus-/työhakemistossa**, vertaa Dashboardiin ja katselmoi ennen versionhallintaan siirtämistä. Älä kirjoita käsin uutta produksio-Wrangler-tiedostoa tai korvaa olemassa olevaa muuta Worker-konfiguraatiota.
5. Jos projektissa on ongelma, kirjaa todistettu juurisyy, korjattava asetus sekä turvallinen rollback. **Codexin tai muun julkaisijan** toteutus pidetään erillään muiden chattien reseptimuutoksista.

## 3. Vaihe 2 – todennettava offline- ja preview-julkaisukoe

**Tämän PR:n toteutetut offline-testit**: `.github/workflows/feedback-pages-readiness.yml` käynnistyy palautekanavan tai kyseisen työnkulun PR-muutoksista tai erillisestä `workflow_dispatch`-valinnasta. Se ei tarvitse Cloudflare-salaisuuksia:
- Node 22:n `feedback-cloudflare-preview-probe.test.mjs` tarkistaa vain oikean preview-URL:n, SHA:n, `noindex`-merkinnän ja Pages Functionsin 405/JSON-kontrahdin.
- `npx --yes wrangler@4.165.0 pages functions build functions` kääntää **todellisen Pages Functions -hakemiston** erilliseen GitHub runnerin väliaikaiseen tiedostoon.
- `node scripts/feedback-pages-local-smoke.mjs` käynnistää erillisen paikallisen `wrangler pages dev` -prosessin ilman tilitunnuksia tai D1-/Turnstile-bindingeja. Se vaatii paikallisesti: `GET /` → 200, `GET /api/feedback` → 405, `POST /api/feedback` → 503 (fail-closed). Käyttää vain synteettistä sisältöä ja sulkee prosessin lopuksi.

**Oikeaan pilveen vietävä preview – vain erillisellä hyväksynnällä:** käytä Cloudflaren tililtä vahvistettua projektia ja erillistä ei-tuotantohaaraa / Pages-previewtä, ei tuotantohaaraa. Valitse hyväksytyn HEADin staattinen `dist` sekä samasta lähdeversiosta tuleva `site/functions/`. Preview-asetukset aluksi `FEEDBACK_ENABLED` poissa/false ja `VITE_RECIPAVO_FEEDBACK_ENABLED` poissa/false. Älä sido previewtä tuotannon D1:een.

Kun täsmällinen ei-tuotanto-URL ja julkaistun artefaktin 40-heksinen commit-SHA tunnetaan, aja **read-only**:

```powershell
cd D:\Projects\Products\Reseptit\site
node scripts/feedback-cloudflare-preview-probe.mjs --url "https://<erillinen-preview>.<vahvistettu-projekti>.pages.dev/" --sha "<julkaistun-artefaktin-40-hex-SHA>"
```

Tämä **ei** lähetä palautetta, vaan lukee previewn etusivun (200, `x-robots-tag: noindex`, oikea `x-recipavo-commit`) ja palautereitin (GET 405 + tarkka JSON). Väärä domain, uudelleenohjaus, puuttuva reitti, väärä revisio tai indeksoitava preview johtaa HOLDiin.

**Seuraava integraatiotestin taso** vaatii nimenomaan uuden preview-only D1:n, suljetun Turnstile-testin, testidomainin sallitut hostnamet ja kokeellisen siivouksen: synteettinen 202-palautteen tallennus sekä tietueen poisto ja virhetestit. Offline SQLite-testit ovat olemassa, mutta **oikeaa Cloudflare-previewtä ei ole vielä testattu eikä tässä PR:ssä perusteta**.

## 4. Vaihe 3 – käyttöönoton päätösportit (HOLD kunnes kaikki todennettu)

| Portti | Vaadittu näyttö ennen live-viestejä |
|---|---|
| Lainmukaisuus | Rekisterinpitäjän hyväksymä tarkoitus, GDPR/tietosuojatekstit FI/EN/SV/TH, 30 vrk -säilytys tai muu nimenomainen päätös, poistopyyntöjen käsittely sekä varmuuskopioiden rajaus |
| D1 | Erilliset preview ja production -tietokannat, migraatiot 0001→0002→0003, vähimmäiskäyttöoikeudet; ei tietokannan tunnuksia GitHub-artefakteihin |
| Turnstile | Sivustoavain vain frontendille; salainen avain vain Pages-servicelle; palvelimen Siteverify-hostname/origin toimivat ja vääriä tokeneita hylätään |
| Siivous | Oma `feedback-retention` Scheduled Worker, Cron ja oikea `FEEDBACK_DB`, ensimmäinen oikea DELETE, vasta sen jälkeen heartbeat; hälytys ja 48 h fail-closed sekä selkeä käsin tehtävä palautuminen |
| WAF/kiintiö | Käyttöönotettu etureunan rate limit ja testattu globaali kiintiö 15/15 min sekä 100/24 h; kiintiön aiheuttama asiallisen palautteen katko hyväksytty tai korjattu |
| Preview-järjestelmä | Ei-tuotantodomainin GET=405 ja SHA/noindex, oikean preview-D1:n 202-testi synteettisellä datalla, väärän originin 403/puuttuvan ylläpitomerkinnän 503 ja poistotestin näyttö |
| Julkaisulupa | Repo Guard, main-CI, testatun SHA:n ja live-`www.recipavo.com`-version vertailu, julkaisijan/omistajan erillinen hyväksyntä, dokumentoitu rollback ja tarvittava ilmoitus |

**Tuotanto-FEEDBACK_ENABLED=true ja VITE_RECIPAVO_FEEDBACK_ENABLED=true vasta kaikkien porttien PASSin jälkeen.** Silloin julkaisu-SHA ja reitin toimivuus on todennettava tuotannosta, ei pelkästä GitHub-CI:stä.

## 5. Mitä ei tehdä tässä PR:ssä

- Ei muutoksia todellisen Cloudflare-tilin projektiin, D1:een, DNS:ään, WAFiin, Turnstileen, Croniin, tehtävänajoihin tai salasanoihin.
- Ei Github Actions -deploytä, `wrangler pages deploy` -käskyä automatiikassa, GitHub Secrets -muutoksia, uutta tuotanto-Wrangler-konfiguraatiota tai oikeaa palautetta.
- Ei Codex-istunnon käynnistystä tai viestien tallentamista API:in.
- Ei väitettä, että offline-workerd-testi todentaisi Cloudflaren tilin, oikean previewn tai tuotannon tietosuojahyväksynnät.

**Lähteet:** [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [Pages Wrangler config](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [Wrangler Pages commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/), [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/).
