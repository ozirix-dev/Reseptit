# Recipavo Keittiöapuri — A3, Cloudflare Worker mock (pois päältä oletuksena)

Päiväys: 6.11.2026

Tila: pelkkä rajattu toteutusehdotus PR:ssä. Ei Cloudflare-tilimuutoksia, DNS-/Workers-julkaisua, laskutettavia API-kutsuja, tekoälymallia eikä tuotannon käyttäjäkutsuja.

## Toteutettu

- `workers/assistant-mock.ts` on standardin Request/Response-rajapinnan mukainen Cloudflare Worker -handler.
- GET tai muu kuin POST `/api/assistant/v1`: 405; väärä origin: 403; väärä Content-Type: 415; liian suuri runko: 413; virheellinen JSON tai skeema: 400. Vastaukset ovat JSONia `no-store` / `nosniff`.
- Vain `POST /api/assistant/v1` kun `ASSISTANT_MOCK_ENABLED=true` **erikseen**. Oletuksena palautuu 503 ASSISTANT_DISABLED jo ennen assettien lukemista.
- Pyyntöskeema `{ "version": 1, "locale": "fi|en|sv|th", "search": { "kind": "text", "text": "..." } }` tai `{ "kind":"preset", "preset":"keto-30|breakfast|snack" }`.
- Pakollinen `Origin`-vertautus, jos Origin-header on annettu. CORS ei ole pääsynhallinta; serverin oikeudet ja rajat on käsiteltävä ennen live-käyttöä.
- User-input-historiaa, käyttäjäkohtaista tokenia tai raakaa promptia ei säilytetä. Ei provider-kytkentää.
- Kysely tulkitaan vain sallittuun A2-mock-hakuun. Worker lataa A1:n samalle sivustolle kuuluvan `data/assistant-manifest.json`-tiedoston ja hash-varmennetun kielen sisällön `env.ASSETS.fetch`-sidonnan kautta.
- Lopullinen vastaus palauttaa maksimissaan viisi julkaistua ID:tä, otsikkoa, oikeaa URL-polkua, lähdehashia ja jo julkaistua ravintotietoa. Ei uusia GK-lukuja, tietolähteitä, valmistusohjeita eikä omia reseptejä.

## Eristetty kokeilukonfiguraatio

`wrangler.assistant.jsonc`:
- `workers_dev: false`, ei tuotantoreittiä, ei custom domainia;
- nimi `recipavo-assistant-mock-preview`, eri kuin Coming Soon -projekti;
- `assets.directory: ./dist`, `ASSETS`-binding, Worker suoraan vain `/api/assistant/*`-poluille;
- `ASSISTANT_MOCK_ENABLED: "false"` myös paikallisen ajon oletuksena.

Huom.: Cloudflare Pages on erillisen julkaisuarkkitehtuurin nykyinen tuotantosuositus. Tämä Worker-kokeilukonfiguraatio ei tarkoita muutosta hostauksen suositukseen. Ennen oikeaa julkaisua verrataan Pages Functions -toteutusta ja erillisen Workerin liittämistä sekä tarkistetaan saman originin reititys.

## Rajatut testit

~~~bash
cd site
npm ci
npm run content:sync
npm exec -- tsx --test tests/assistant-catalog.test.ts tests/assistant-demo.test.ts tests/assistant-worker.test.ts
npm run build
npm test
~~~

`tests/assistant-worker.test.ts` käyttää muistiin tehtyä ASSETS-adapteria ja normaaleja buildin sisältöasset-tiedostoja; se ei tarvitse Cloudflare-tunnuksia eikä lähetä verkkopyyntöjä. Tarkistaa nelikieliset julkaistut tulokset, fail-closed OFF, väärät requestit, checksum-muutokset ja staattisten reittien läpimenon.

**Tämä ei ole turvallisuustestattu julkinen botti.** A3:n testit ovat pakollisia mutta eivät riittäviä oikeaan tuotantoon.

## Julkaisun estävät portit

1. A1 ja A2 mainiin hyväksyttyinä; kaikki HEAD-sidotut testit vihreinä.
2. Päätös Cloudflare Pages Functions / Worker -reitityksestä ja erillinen preview ilman www-domainia.
3. Todellinen automaattisten pyyntöjen esto. Cloudflare Workers Rate Limiting API käyttää likimääräisiä, aluekohtaisia rajoja — **ei** maailmanlaajuista kovaa kulukattoa. Ennen laskutettavaa AI:ta tarvitaan erikseen globaali atominen budjettivaraus tai maksupalvelun todellinen kova raja, plus kill switch.
4. Turnstile-/bot-tarkistus, käsittelyn tietosuoja-arvio ja logien minimointi ennen avointa käyttöä. AI Gateway tallentaa oletusarvoisesti pyyntöjä ja vastauksia, ellei asetusta erikseen kytketä pois.
5. Nelikielinen käsin tarkistettu UX, saavutettavuus ja oikea julkaistun aineiston palautus.
6. Erillinen omistajan hyväksymä Cloudflare-preview-/tuotantojulkaisu ja domainin Coming Soon -portti.

**Viitelähteet, tarkistettu 6.11.2026:** Cloudflare Worker Static Assets / ASSETS-binding: https://developers.cloudflare.com/workers/static-assets/binding/ ; rate limitin likimääräisyys: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ ; AI Gateway -lokit: https://developers.cloudflare.com/ai-gateway/observability/logging/ .

A4:n maksullista AI-vertailua ei aloiteta tässä PR:ssä. A4 voidaan suunnitella testiaineistolla ilman ulkoisia mallikutsuja; todelliset kulut vaativat uuden luvan.
