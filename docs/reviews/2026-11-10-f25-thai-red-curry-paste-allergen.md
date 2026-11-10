# F25 – Thai-kananmunacurryn currytahnan lähde ja allergeenivaroitus (10.11.2026)

## Ongelma

Suomenkielinen `thai-kananmunat-kookoscurryssa` ilmoittaa ainesosaksi 20 g **Mae Ploy punaista currytahnaa**. Laskentasyöte `docs/nutrition/calculations/thai-kananmunat-kookoscurryssa.json` (Git blob `78929fce4b8c4f95336a460a1643b287ad68b40c`) käyttää **Mae Ploy Red Curry Paste 400 g** -viitetuotteen Sainsbury'sin ravintosisältöä: 100 g tahnassa 24,2 g käytettävissä olevaa hiilihydraattia, 6,1 g proteiinia, 1,6 g rasvaa ja 13,5 g kuitua, ja pakkauksen ainesosaluettelossa on **katkaraputahnaa 4,5 % (äyriäisallergeeni)**. [Tuotteen ilmoitettu ainesosaluettelo ja ravintoarvot](https://sainsburys.co.uk/groceries/product/mae-ploy-red-curry-paste-400g). Pakkauksen mukaan kalajäämätkin ovat mahdollisia.

Saman nimisen tahnan muissa eurooppalaisissa ja australialaisissa myyntilähteissä esiintyy eri hiilihydraatti- ja kuituarvoja (esim. 17–17,5 g hh/100g), eikä yleinen tuotemerkkinimi yksin takaa samaa ravintolaskentaa. Vertailulähteet: [Mathem](https://www.mathem.se/se/products/10166-mae-ploy-rod-currypasta/) ja [Sainsbury's](https://sainsburys.co.uk/groceries/product/mae-ploy-red-curry-paste-400g). Oma tuote-etiketti määrää todellisen koostumuksen.

## Korjaus

Vain `site/scripts/fi-breakfast-quality-display.ts`:n nykyiseen raaka-SHA-lukittuun FI-julkiseen esitysoikaisuun lisätään **Tuotetarkennus ja allergeenit** -huomautus, joka nimeää viitteen ja allergeenin sekä varoittaa eri tuotteiden ravintoarvoeroista. 4 valmistusvaihetta, ainesmäärät, 2 annosta, 25 minuutin aika, kuva, neljä makroa, laskentasyöte ja GI/GK-tietueet jäävät ennalleen. Kanoninen FI Markdown jää byte-identtiseksi.

Regressiotesti varmistaa FI-näytön tuotetekstin, lähdeviitteen numerot sekä sen, että varoitus on lisätty vain projektioon. Alkuperäisen tekstin SHA-256 tarkistetaan kuten aiemminkin. Testi ei ohita käännösjulkaisun semanttista lähdehashia.

**Julkaisu/HOLD:** Tämä PR on vain FI:n ravinto- ja allergeeniselitteen lähdekorjaus. Ennen EN/SV/TH-julkaisua päivitetään kaikki kolme kieliversiota vastaavalla allergeenivaroituksella, generoidaan uudet julkisen FI:n ja käännösten SHA:t, varmistetaan tarkka main-deploy ja hyväksytään lähdekatselmointi. F25:n [#399](https://github.com/ozirix-dev/Reseptit/pull/399) vanhaa Draftia ei yhdistetä. Rinnakkaiset #407/#409/#412/#400 jäävät koskemattomiksi.

Tämä on AI:n dokumentoitu lähde- ja kokkikatselmointi, ei todistus fyysisestä koepaistosta tai riippumattomasta natiivipuhujakatselmoinnista.
