# Recipavo – yhteinen palautekanava V1

**Päiväys:** 21.11.2026
**Tila:** TOTEUTETTU LÄHDEKOODIIN / TUOTANTOVASTAANOTTO OFF / AKTIVOINTI HOLD
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
- site/migrations/0001–0003_feedback*.sql – yksityinen D1-jonotaulu, tilakone, siivouksen heartbeat sekä aikaleimaindeksi atomisia kiintiölaskureita varten
- site/tests/feedback-api.test.ts ja site/tests/feedback-ui.test.ts – synteettiset yksikkö- ja kielitarkistukset

Palvelin tallentaa vain viestin, aiheen, kielen, sivupolun, reseptitunnisteen, mahdollisen sähköpostin sekä lähetetyn kertakäyttöhaasteen SHA-256-hashin toistojen estämiseksi. Raakaa Turnstile-tokenia, IP-osoitetta, selaintunnistetta, evästeitä tai kyselyparametreja ei tallenneta. Syöte tallennetaan datana: ei etäisen URL:n noutoa eikä annetun tekstin suorittamista.

## Lähdekoodin yhdistäminen ja tuotannon vastaanotto ovat kaksi eri päätöstä

GitHubin `main`-haaraan voidaan yhdistää **oletuksena suljettu** lomake ja Pages Function -lähdekoodi erillisellä Repo Guard -hyväksynnällä. Se ei itsessään hyväksy GDPR-säilytystä, perusta D1:tä tai ota käyttöön Turnstile-/WAF-/Cron-resursseja.

Backendin `POST /api/feedback` vastaa 503, kun `FEEDBACK_ENABLED` ei ole täsmälleen `true` tai mikä tahansa `FEEDBACK_DB`-, `TURNSTILE_SECRET`- tai `FEEDBACK_ALLOWED_ORIGIN`-sidonta puuttuu. Myös onnistunut oikea siivous pitää varmistaa ennen vastaanottoa. Frontendin lomake on pois käytöstä, kun `VITE_RECIPAVO_FEEDBACK_ENABLED` tai julkinen `VITE_RECIPAVO_FEEDBACK_SITE_KEY` puuttuu. Koodin yhdistäminen ei ole lupa asettaa näitä arvoja.

**Cloudflare-tuotantoon ei tehdä automaattista julkaisua tämän GitHub-työn yhteydessä.** Cloudflare Pages -projektin todellinen Git/Direct Upload -julkaisumalli on tarkistettava erikseen; Git-integraatio voi julkaista oma-aloitteisesti. Dashboardin drag-and-drop-upload ei kokoa `functions`-hakemistoa, toisin kuin oikein sijoitettu Wrangler-julkaisu. Siksi uuden Functions-reitin todellista asennusta ei väitetä ilman hyväksyttyä preview-testiä.

V1:n oikeaa Cloudflare Pages + D1 + Turnstile + Worker Cron + WAF -ketjua **ei ole testattu pilvessä**. Sen vuoksi varsinaista vastaanottoa ei saa avata, vaikka lähdekoodin testit ja GitHub-merge olisivat onnistuneet.

## Käyttöönotto (ei kuulu tämän PR:n automaattisiin muutoksiin)

1. Hyväksy selkeä GDPR-säilytysaika ja poistopyyntöjen käsittely. PR sisältää nyt [erillisen ajastettavan D1-siivoojan](recipavo-feedback-retention-2026-11-21.md), jonka tekninen ehdotus on 30 päivän säilytys, päivittäinen UTC-poisto ja enintään 48 tunnin vanha onnistumismerkintä. **Koodin läsnäolo ei aktivoi Cronia eikä hyväksy säilytyspolitiikkaa**. Päivitä tietosuojasivun valmisteilla-teksti lopulliseksi, varmista siivoojan oikea D1-sidonta ja toistettava poisto sekä hälytys ennen käyttäjäviestien vastaanottoa.
2. Perusta erillinen yksityinen D1-tietokanta ja aja hyväksyttyyn kantaan migraatiot 0001_feedback.sql, 0002_feedback_retention.sql ja 0003_feedback_quota.sql. Lisää Pages-projektiin binding FEEDBACK_DB ja erilliselle ajastetulle Workerille sama yksityinen sidonta. Käytä erillisiä preview- ja production-resursseja. Älä täytä siivouksen onnistumismerkintää käsin.
3. Luo Cloudflare Turnstile -avainpari ja salli vain täsmällinen preview-/tuotantodomain. Asenna serverille TURNSTILE_SECRET (ei koskaan VITE_-prefiksillä). Palautteen hyväksyttyjen tallennusten **globaali** kiintiö on koodissa enintään 15 / 15 minuuttia ja 100 / 24 tuntia. Tarkista kuormaraja pilotissa ja aktivoi lisäksi Cloudflare WAF -rate limit: D1:n jälkikäteinen globaali kiintiö ei korvaa verkon etureunan suojaa, eikä se estä kaikkia tahallisia palvelunestoyrityksiä.
4. Serverin tuotantoasetukset: FEEDBACK_ENABLED=true sekä FEEDBACK_ALLOWED_ORIGIN=https://www.recipavo.com **vasta todistetun siivousajon jälkeen**. Ajastetulla Workerilla FEEDBACK_RETENTION_ENABLED=true ja oikea FEEDBACK_DB-binding. Hyväksytyn frontend-buildin asetukset: VITE_RECIPAVO_FEEDBACK_ENABLED=true ja julkinen VITE_RECIPAVO_FEEDBACK_SITE_KEY. Kaikkien oletustila on pois päältä.
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

API:n yksikkötesteissä D1 ja Siteverify korvataan synteettisillä vasteilla. Lisäksi feedback-d1-integration.test.ts käyttää oikeaa SQLite-muistitietokantaa, suorittaa kaikki kolme D1-migraatiota ja testaa vastaanotto/siivous/poisto-ketjun todellisilla SQL-kyselyillä. Tämäkään ei todista oikean Cloudflare D1-/Worker-tilin liitoksia, Cron-ajastusta, WAFia tai tuotannon tietosuojahyväksyntää. Julkista AI:ta tai uutta maksettua mallipalvelua ei käynnistetä.

Lähdeohjeet: [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/), [D1 Bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Turnstile Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Anonyymin palautteen globaali tallennuskiintiö

Julkisten lähetysten hallittua määrää varten API tekee **yhden** parametrisoidun SQLite/D1-lauseen: INSERT ... SELECT ... WHERE COUNT viimeisen 15 minuutin aikana on alle 15 ja viimeisen 24 tunnin aikana alle 100. Viesti tallennetaan vain, jos molemmat ehdot täyttyvät; D1:n vahvistettu meta.changes = 1 palauttaa 202-viitetunnuksen. meta.changes = 0 palauttaa 429, puuttuva/virheellinen metadata palauttaa turvallisesti 503. Samassa kirjoituslauseessa tehty tarkistus estää sovellustason erillisen COUNT + INSERT -kilpajuoksun.

Laskenta käyttää jo vastaanotettujen viestien aikaleimoja ilman IP-osoitetta, verkkotunnistetta tai erillisiä henkilöpohjaisia laskureita. Se on **kaikkien käyttäjien yhteinen** ja voi kuormassa estää myös asiallisen palautteen. Kun kiintiö tulee täyteen, nelikielinen käyttöliittymä kertoo selvästi, ettei viestiä tallennettu, ja tarjoaa olemassa olevan sähköpostiyhteyden. Palautteen teksti jää lomakkeeseen käyttäjän kopioitavaksi.

Näitä lukuja ei ole mitattu todellisella palvelukuormalla, eikä globaali 100 vuorokaudessa ole lupaus rajattomasta skaalautuvuudesta. Kiintiö ei torju raakaa HTTP-tulvaa tai tuhansia Turnstile-pyyntöjä – siksi WAF-rajoitus ja Cloudflare-esikatselun mittaus ovat edelleen ehdottomia käyttöönottovaatimuksia.

Migraatio 0003_feedback_quota.sql lisää vastaanottoajan indeksin. Offline SQLite -integraatiotesti täyttää molemmat laskentaikkunat ja tarkistaa 429:n sekä rajan vapautumisen. Kaikki testisyötteet ovat synteettisiä eikä oikeita käyttäjätietoja tai pilvi-D1:tä käytetä.
