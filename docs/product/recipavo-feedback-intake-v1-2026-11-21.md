# Recipavo – yhteinen palautekanava V1

**Päiväys:** 21.11.2026
**Tila:** TOTEUTETTU LÄHDEKOODIIN / DRAFT / TUOTANTOVASTAANOTTO OFF
**Repo:** ozirix-dev/Reseptit

## Tavoite ja rajaus

Yksi nelikielinen avattava lomake viidelle asialle: reseptivirhe (recipe_error), parannus (improvement), uusi resepti (new_recipe), tekninen virhe (technical) ja muu (other). Sivuston alatunnisteessa on yleinen palaute, reseptisivulla kontekstia kantava virheilmoituspainike. Mukaan siirtyvät kieli, lähdesivun polku ilman hakuparametreja sekä tarvittaessa recipeId.

Tämä ei ole uusi käyttäjätilijärjestelmä eikä toinen julkisten reseptien kirjasto. Käyttäjän yksityinen reseptikirja ja sen julkisuusrasti kuuluvat edelleen [Draft #560](https://github.com/ozirix-dev/Reseptit/pull/560):n C1–C3-vaiheisiin. Palaute-idea ei myöskään ohita nykyisiä ravinto-, GI/GK-, F25-, kuva-, käännös- tai Repo Guard -portteja.

## Suunnitelma ja toteutettu käyttäjäpolku

1. Avaa Anna palautetta sivuston alatunnisteesta tai Ilmoita reseptivirhe reseptisivun toimintopainikkeesta.
2. Valitse aihe, kirjoita 20–4 000 merkin viesti, anna halutessasi sähköposti lisäkysymyksiä varten. Ei vaadi käyttäjätiliä eikä liitteitä.
3. Roskapostisuoja antaa kertakäyttöisen Turnstile-tokenin; Cloudflare Pages Function todentaa sen Siteverify-rajapinnasta ja vahvistaa hostnamen.
4. Hyväksytty viesti tallennetaan yksityisen D1:n new-jonoon. Selain saa vain satunnaisen viitetunnuksen. Viestien julkista luku-API:a ei ole.
5. Oletuksena vastaanotto on pois käytöstä; käyttäjälle tarjotaan olemassa oleva sähköpostiosoite. Tallennuksen epäonnistumista ei näytetä onnistumisena.

Dialogi ei lisää uusia kanonisia sivureittejä, sitemap-rivejä tai neljää uutta SEO-polkua. Koko lomake ja ulkoinen Turnstile-scripti latautuvat vasta avattaessa. Nykyisiä värejä, fontteja, reseptirakennetta ja perussivutusta ei muuteta.

## Lähdekoodi

- site/src/features/feedback/feedback-copy.ts – neljä kieltä, kategoriat ja tietosuojatieto
- site/src/features/feedback/feedback-context.tsx – laiska dialogi ja kaksi avauspolkua
- site/src/features/feedback/FeedbackDialog.tsx – saavutettava natiivi dialogi, kiinteät kenttärangat ja vastaanottokuittaus
- site/functions/api/feedback.ts – Cloudflare Pages Function, POST /api/feedback, tiukka syöte-, koko-, Origin-, Siteverify- ja hostname-tarkistus
- site/migrations/0001_feedback.sql – yksityinen D1-jonotaulu, tilakone ja indeksit
- site/tests/feedback-api.test.ts ja site/tests/feedback-ui.test.ts – synteettiset yksikkö- ja kielitarkistukset

Palvelin tallentaa vain viestin, aiheen, kielen, sivupolun, reseptitunnisteen, mahdollisen sähköpostin sekä lähetetyn kertakäyttöhaasteen SHA-256-hashin toistojen estämiseksi. Raakaa Turnstile-tokenia, IP-osoitetta, selaintunnistetta, evästeitä tai kyselyparametreja ei tallenneta. Syöte tallennetaan datana: ei etäisen URL:n noutoa eikä annetun tekstin suorittamista.

## Käyttöönotto (ei kuulu tämän PR:n automaattisiin muutoksiin)

1. Hyväksy selkeä GDPR-säilytysaika, tietojen poisto ja siihen tarvittava D1-puhdistusajo sekä toteuta käsittely- ja poistopyyntöjen menettely. Päivitä tietosuojasivun valmisteilla-teksti lopulliseksi. Tähän V1-PR:ään ei kuulu automaattista vanhojen viestien poistamista, joten tämä on oikea aktivointiestäjä.
2. Perusta erillinen yksityinen D1 tietokanta ja aja migration 0001_feedback.sql hyväksyttyyn kantaan. Lisää Pages-projektiin binding FEEDBACK_DB. Käytä erillisiä preview- ja production-resursseja.
3. Luo Cloudflare Turnstile -avainpari ja salli vain täsmällinen preview-/tuotantodomain. Asenna serverille TURNSTILE_SECRET (ei koskaan VITE_-prefiksillä). Aktivoi Cloudflare WAF -rate limit ja vastuunjako roskapostista.
4. Serverin tuotantoasetukset: FEEDBACK_ENABLED=true sekä FEEDBACK_ALLOWED_ORIGIN=https://www.recipavo.com. Hyväksytyn frontend-buildin asetukset: VITE_RECIPAVO_FEEDBACK_ENABLED=true ja julkinen VITE_RECIPAVO_FEEDBACK_SITE_KEY. Kaikkien oletustila on pois päältä.
5. Cloudflare Pages Functions sijaitsee Pages-projektin juuressa functions-hakemistossa (tässä site/functions), ei dist-hakemistossa. Pelkkä Dashboardin Direct Upload ei asenna Functions-koodia. Varmista että hyväksytty Wrangler- tai Git-yhdistetty Pages-build todella asentaa API-reitin. Älä ylikirjoita nykyisiä projektiasetuksia omatekoisella Wrangler-konfiguraatiolla.
6. Ennen tuotantoa varmista synteettisillä viesteillä täsmällinen HTTPS-preview, 202 tallennus, väärän originin ja tokenin hylkäys, D1-rivi, viestin poisto ja se, ettei julkista lukureittiä synny.
7. Erota Repo Guardin täsmä-HEAD-Ready/merge nykyisestä Cloudflare-production-promootiosta. Omistajan julkaisulupa ja erillinen release-SHA:n sekä oikean URL:n tarkistus ovat pakollisia.

**Ei** oikean Cloudflare-tilin, D1:n, Turnstilen, DNS:n, nykyisen tuotannon tai käyttäjätietojen muutoksia tämän PR:n perusteella.

## AI/Codex-vaihe – ei suora web-automaatio

Palautteet käsitellään ensin turvallisesti ja yksityisesti. Tuleva ylläpitäjälle rajattu jono voi tuottaa henkilötiedoista puhdistetun aineiston AI-/Codex-katselmointiin, mutta tässä V1:ssä ei avata julkista D1-READ API:a eikä ajastettua AI-käsittelyä:

- Kirjoitus-/käännösvirhe: kevyt lähdevertailu, ehdotettu muutos, tarvittavat regressiotestit ja erä-PR.
- Ainesmäärä-/turvallisuusvirhe: korkean riskin triage, ruokalajikohtainen näyttö, epävarmuudessa HOLD.
- Uusi resepti: olemassa oleva duplikaatti- ja #560:n erillinen julkaisuehdotusportti.
- Tekninen virhe: korjausissue ja kohdennetut kooditestit.
- Muu: ihmisen rajattu arvio, ei automaattista julkaisua.

ChatGPT-keskustelu ei ole itsessään taustalla jatkuvasti ajettava worker. Mahdollinen suojattu jonoliitin, käyttöoikeudet, AI-kustannuskatto ja todellinen katselmointijärjestys tehdään erillisenä työnä.

## Paikallinen testi ja hyväksyntärajat

Aja site-hakemistosta:

    npm ci
    npx tsx --test tests/feedback-api.test.ts tests/feedback-ui.test.ts
    npm run typecheck
    npm run build
    npm run test:static

Yksikkötestissä D1 ja Siteverify korvataan synteettisillä vasteilla; se ei todista oikean Cloudflare-tilin liitoksia tai tuotannon tietosuojahyväksyntää. Julkista AI:ta tai uutta maksettua mallipalvelua ei käynnistetä.

Lähdeohjeet: [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/), [D1 Bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Turnstile Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
