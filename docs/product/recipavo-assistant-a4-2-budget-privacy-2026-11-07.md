# Recipavo Keittiöapuri A4.2 — laskutusbudjetin ja tietosuojan offline-portti

**7.11.2026.** Tämä PR on **laskutusestetty suunnittelutoteutus**, ei julkisen chatbotin käyttöönotto eikä edes oikea Cloudflare-resurssi. A4-kieliarvioinnin seurantatehtävä: [#342](https://github.com/ozirix-dev/Reseptit/issues/342).

## Tavoite

Laskutettavaa mallikutsua ei saa aloittaa, ellei maksimaalinen mahdollinen lisäkulu ole ensin **varattu globaalisti**. Cloudflare Workersin aluekohtainen / likimääräinen rate limit ei ole tähän riittävä. Yksi jaettu SQLite-backed Durable Object voi tarjota transaktionaalisen, voimassa pysyvän budjettilaskurin. **DO:ta ei vielä perusteta eikä oteta käyttöön tässä PR:ssä.**

Tämä erä lisää A4.2:n helposti testattavan päätöksentekokoneen ja injektoitavan transaktioadapterin ilman mallia, AI Gatewayta, avainta, uutta NPM-riippuvuutta, yksityistä käyttäjätietoa tai Cloudflare-kohteeseen deployta.

## Toteutetut rajat

- **Yksikkö:** nano-USD, 1 USD = 1 000 000 000. Lisä-AI-kustannusten suunnittelubudjetti **5 USD / UTC-kalenterikuukausi**. Kyse on vain hyväksytyn AI-inferenssin arvioidusta maksimista, EI kaikkien Cloudflaren, maksupalvelun, verojen tai valuuttakurssin kustannusten katosta.
- Mallin `modelId`, `maxInputTokens`, `maxOutputTokens`, syöte-/ulostulohinnat ja kiinteät lisämaksut jäädytetään *palvelinpuolen hyväksyttyyn versioituun hintapolitiikkaan*. Käyttäjä ei voi säätää hinnoittelua, tokenkattoa tai työkaluja. Pahimman tapauksen kustannus pyöristetään ylöspäin *jokaista tokenia kohden* ja **varataan ennen** ulkoista mallipyyntöä.
- **Yksi globaali koordinaattori** (A4.3:ssa yksi vakioniminen Durable Object -instanssi) hallitsee kaikki instanssit ja reitit. Pelkkä selaimen, Workerin, KV:n tai Cloudflaren alueellinen rate limit ei riitä. Tilapäisen storage-verkkovirheen on estettävä laskutettava kutsu.
- `reserveWorstCase` hyväksyy pyynnön vain, jos `charged + held + requestMax <= 5 USD`. Saman serverillä generoidun request-ID:n uusinta ei saa aiheuttaa toista mallikutsua.
- `settleKnownCost` palauttaa erotuksen varauksesta vasta, kun mallitoimittajan lopullinen käyttö/kulu on tiedossa. Aikakatkaisu, epäselvä veloitus, huonosti muodostettu laskutustieto tai kadonnut vastaus **jättää enimmäisvarauksen kiinni**. Ylärajan ylitys pysäyttää uudet varaukset, eikä jo laskutettua yritetä piilottaa.
- Päivämäärä valitaan luotettavasta Worker-palvelinkellosta UTC-kuukauden mukaan, ei käyttäjän pyynnöstä. Vanhan kuukauden avoimia varauksia ei muuteta automaattisesti uuden kuukauden saldoiksi eikä vapauteta hiljaisesti.
- `site/workers/assistant-budget-coordinator.ts` käyttää injektoitavaa `transactionSync` + `kv`-rajapintaa Cloudflare Durable Object -ympäristöä varten. Ei julkista Worker-fetcheä, routes-konfiguraatiota, DO-migraatiota, promptin välitystä, maksullista integraatiota eikä laskutusavainta.
- Talletetaan vain serverillä generoitu ID, UTC-kuukausi, kokonaislukuiset varaus-/kulutiedot ja poiskytkentä. **Ei kysymystä, diagnoosia, käyttäjän IP:tä tai mallin vastausta.**

## Todelliset käyttöönoton estot

Seuraavaa ei ole toteutettu eikä saa tulkita tämän PR:n mergaamisesta sallituksi:

1. **Yksi oikea SQLite-backed Durable Object** Wrangler-migraatioineen ja eksklusiivisine sisäisinä RPC-oikeuksineen. Sen nimetty instanssi ja pysyvä state kestävät samanaikaisuuden ja Workerien uudelleenkäynnistymiset. Varaukset ja settlementit suojataan luvattomilta kutsuilta.
2. **Katkeamaton preflight:** gateway/Worker ei saa koskaan suorittaa maksullista kutsua ohi varauspolun. Ei varauksen automaattista vapautusta timeoutissa. Providerin retryt, työkalukutsut, reasoning-tokenit, huippuhinnat, mahdollinen providerin kiinteä kustannus ja inputin maksimit on sisällytettävä jäädytettyyn ylärajaan. Jos todellista ylärajaa ei voida osoittaa, mallia ei kytketä päälle.
3. **Providerin laskutusero:** mallin käyttötietojen valmistuminen, billing-periodin aikavyöhyke ja lopullinen lasku voivat poiketa Recipavon UTC-varaustilasta. Kun vaaditaan aidosti ehdoton kokonaiskulukatto, tarkista lisäksi providerin todellinen account hard cap tai rajaa mallitestaus pre-paid/erilliseen tilikohtaiseen enimmäissummaan. Tämä offline-koodi ei yksin takaa 5 USD:n todellista laskua.
4. **Rate limit + Turnstile:** vain mahdollinen bot-eston lisäkerros; ei korvaa budjettia eikä hyväksyntäporttia. CORS ei ole autentikointia.
5. **Tietosuoja:** A4.3:ssa määritetään käyttötarkoitus, oikeusperuste, rekisteröidyn oikeudet, käsittelysopimus, mahdolliset EU:n ulkopuoliset siirrot ja poistoajat. V1 ei pyydä terveystietoja, eikä yhdistä käyttäjää Diaryhin. Mallille vain tarpeellinen hakutulkinnan syöte, ei kokonaista reseptikirjastoa tai yksityistä profiilia.
6. **AI Gateway -lokitus:** Cloudflare dokumentoi, että Gateway kerää lokit oletusarvoisesti, ellei niitä kytketä pois. Ennen testiä tarkistetaan asetuksen todellinen tila ja per-request log-headerit, ja myös muut logi-/Logpush-polut erikseen. Ei raakakysymystä telemetriaan.
7. **Turvallinen start:** kaikki AI-avaimet vain Worker-secretissä; feature flag OFF, avain puuttuu, budget fail-closed. Julkinen `www.recipavo.com` ja Coming Soon eivät ole tämän PR:n kohteita.
8. **Rajakohdat / QA:** natiivissa Cloudflare Durable Object -testissä testataan todellinen yhtäaikaisuus, tallennuksen virheet, uudelleenkäynnistys, kuukausirajan käyttäytyminen ja palveluntarjoajan timeoutit. Nykyinen Node-testin synkroninen muistiadapteri ei korvaa näitä.

## Testit ja resurssitalous

~~~bash
cd site
npm ci
npm exec -- tsx --test tests/assistant-budget.test.ts
~~~

Testit kattavat pahimman hinnan ylöspäin pyöristyksen, 500 samanaikaista *simuloitua* varausyritystä, ~303 hyväksyttyä maksimi-varausta esimerkkihinnalla, 5 dollarin rajan, idempotenssin, settlementin/varauksen vapauttamisen, epäselvän kustannuksen, hintarajan ylittävän arvon, kuukauden vaihdon, poliittisen hard-cap-muutoksen hylkäämisen ja promptitiedon tallentamattomuuden.

`modelId: test-fixture-only-not-approved-model` ja hintaluvut ovat testisyötettä, eivät todellinen mallivalinta tai käyttölupa.

## Lähteet / sovitettava ennen tuotantoa

- Durable Object SQLite transactions: https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
- DO:n pysyvä state ja käyttösäännöt: https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/
- AI Gateway logitus ja oletusasetukset: https://developers.cloudflare.com/ai-gateway/observability/logging/
- Workers rate limiting -dokumentaatio: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

**Päätös:** A4.2 offline-portti voidaan merkitä Ready/merged lähdekoodina, mutta A4.3 maksullinen mallitesti ja A5 julkinen pilotti edellyttävät erillistä omistajan budjetti- ja tuotantohyväksyntää.
