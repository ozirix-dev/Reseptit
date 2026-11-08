# Keittiöapuri V1 — rajapintasopimus, testimatriisi ja julkaisukynnykset

**6.11.2026 / suunnittelu, ei toimivaa toteutusta.** Tämä dokumentti täydentää [tuotesuunnitelmaa](../product/recipavo-keittioapuri-plan-2026-11-06.md). Tarkoitus on tehdä ensimmäisten toteutus-PR:ien rajaus yksiselitteiseksi ja pitää rinnakkaistyö erillään.

## A. Julkinen V1-API, ehdotus (ei vielä julkaistu)

- Ehdotettu kutsu: POST /api/assistant/v1 saman Recipavo-domainin alla vasta Cloudflare-julkaisuvaiheessa.
- Erillinen preview-host ja manuaalisesti sallittu preview-origin testauksessa; GitHub Pages -stagingissa ei oleteta toimivaa tuotanto-API:a.
- Pyyntö vastaanottaa yhden rajatun viestin, kielen sekä avoimesti luetellut suodattimet; **ei** mallin nimeä, system promptia, URL:ia, julkaisuoperaatiota, käyttäjätokenia tai itse rakennettua GK-arvoa.
- V1:ssa ei keskustelun pysyvää tunnistetta eikä palvelimella säilytettyä sisältöhistoriaa. Mahdollinen lyhyt jatkokonteksti on asiakkaan näyttämä ja palvelimella joka kutsulla validoitava, eikä se saa ohittaa hakusuodattimia.
- V1:n schema: locale = fi | en | sv | th; category = all tai reseptikannan tunnettu luokka; diet = all | keto | vhh; maxTime = 30 | 60 | 90 tai pois; gl = low | medium | high tai pois.
- Haku voi käsitellä useita ainesosatermejä, mutta nykyinen ingredientGroup-luokitus ei todista yksittäisen ainesosan esiintymistä. Tämä on erotettava vastauksen sanamuodossa.

Esimerkkipyyntö (synteettinen, ei API:n käyttöönoton vahvistus):

~~~json
{
  "locale": "fi",
  "message": "Nopea ketoillallinen, mieluiten kanaa",
  "filters": {
    "category": "paaruoka",
    "diet": "keto",
    "maxTime": 30
  },
  "consentToSendTextToAiProvider": false
}
~~~

Ilman AI-palvelun käyttölupaa/erillistä tiedonsiirtovalintaa pyyntö käsitellään deterministisesti paikallisen haun avulla. V1:n live-API:n lopullinen minimisopimus ja suostumus-/oikeusperuste testataan tietosuojakatselmuksessa; edellinen boolean ei yksin ratkaise GDPR:n oikeusperustetta.

Esimerkkivastaus: hakutulokset tulevat vain julkaistusta versionoidusta indeksistä, eivät kielimallin itse kirjoittamasta JSON-reseptistä.

~~~json
{
  "version": 1,
  "mode": "deterministic",
  "locale": "fi",
  "status": "ok",
  "interpretation": {
    "filters": { "category": "paaruoka", "diet": "keto", "maxTime": 30 },
    "uncertain": ["kana-toive ei välttämättä ole pakollinen"]
  },
  "results": [
    {
      "recipeId": "EXAMPLE_ONLY_REPLACE_WITH_PUBLISHED_ID",
      "routePath": "/actual-route-from-index/",
      "locale": "fi",
      "sourceVersion": "content-hash",
      "source": "published-recipe-index",
      "nutrition": {
        "carbsNetG": null,
        "carbsTotalG": null,
        "proteinG": null,
        "fatG": null
      },
      "glycemicLoad": {
        "status": "unknown",
        "value": null,
        "evidenceRef": null
      }
    }
  ]
}
~~~

**HUOM:** esimerkin tunniste ja polku ovat tarkoituksellisesti epäaitoja eivätkä saa koskaan mennä fixtureinä tuotantojulkaisuun. Oikea toteutus poimii ne julkaistun indeksin kautta ja jättää tuloslistan tyhjäksi, jos osumia ei ole. Poista esimerkkirivi toteutustestissä, jos todellista reseptiä ei ole.

## B. Hakutulkinta ja sallittu LLM-tuloste

Sallittu tyypitetty action: search | compare | clarify | unsupported. Jos AI ei tuota skeeman mukaista JSONia, kutsua ei toisteta rajatta; näytä deterministinen fallback.

LLM saa ehdottaa vain:
- suodatinkenttien sallittuja arvoja;
- vapaita hakutermejä, jotka alistetaan saman julkaistun indeksin tekstihakuun;
- selittävän kysymyksen tai ettei osumia löydy.

LLM **ei saa** palauttaa hyväksyttynä:
- tarkkoja ravintoarvoja/GK-lukuja, uutta reseptiä, määrällistä muutosta tai ruokaturvallisuusväitettä;
- reseptin URL:ia, julkaisu-ID:tä, raakaa HTML:ää, kuvapolkuja tai ulkoista lähdettä;
- käyttäjän oikeuksia, maksutapahtumaa, admin-toimintoa tai Diaryn tietoja.

Palvelin käsittelee mallin JSONin epäluotettavana, tekee tyypintarkistuksen, rajaa kielen/suodattimet, hakee nimenomaan julkaistuista riveistä ja muodostaa lopullisen vastauksen itse. Reseptin linkki rakennetaan allowlistatusta routePathista. Nolla tulosta ja tuntematon tieto ovat sallittuja vastauksia.

## C. Sisältöindeksin lähde- ja versiosopimus

1. Sama kanoninen published Markdown + käännösvalinta kuin nykyisessä buildissä. Ei draft-/arkisto-/raakile-/työjono- tai erillisen omistajan reseptejä.
2. RecipeSummary-tyypin lisäksi tarvitaan erillinen rajattu backend-index, koska nykyisessä summaryssa ei ole ravintofaktoja.
3. Numero-GK vain nykyisen GK-julkaisuprosessin hyväksytystä ja saman reseptiversion kanssa yhteensopivasta lähteestä. Tilat: verified_number | verified_range | unavailable | hold; mahdollinen arvio pidettävä **selvästi erillisenä** alkuperäisestä hyväksytystä GK:sta. Mikäli luokat ja provenance eivät ole teknisesti tarjolla, GK-numero pois V1:stä.
4. Buildin snapshot/manifests SHA sitoo kieliversiot, reseptiversion ja mahdollisen GK-evidence-referenssin. API ei tarjoa epäjohdonmukaista eri-ikäistä dataa.
5. P0-status null-arvoille säilyy. “Ei julkaistu tietoa” ≠ “0 g”; “Keto” ≠ lupaus tietystä hiilihydraattimäärästä.
6. Vain tarpeelliset kentät lähetetään AI-palvelulle. Mieluiten mallille pelkkä käyttäjän pyyntö ja valitut sallitut hakusanat, ei koko reseptikirjasto.
7. Vanhojen query-URLien käyttö on säilytettävä: nykyinen recipeFiltersToSearch ja localeIndexes; linkkiä ei tuoteta pelkällä merkkijonokäännöksellä.

## D. Testimatriisi ennen mitään live-AI-kutsua

| Tapaus | Odotettu havainto | Estää julkaisun? |
|---|---|---|
| 20 FI + 20 EN + 20 SV + 20 TH testikysymystä | Sallittu hakuaie, sovellettava kieli ja tulosten ID:t; virheiden luokittelu | kyllä |
| Samat sanat eri diakriitein ja thai-merkein | Ei hakunormalisoinnin regressiota | kyllä |
| Kaksi tai kolme yhdistettyä suodatinta | Lopputulos yhtenevä nykyisen filterRecipesin kanssa | kyllä |
| VHH vs keto | Ei muuteta toimituksellista luokitusta mallilla | kyllä |
| “GK alle 10” ilman hyväksyttyä numeerista faktaa | Ei lupausta tai laskettua arvoa | kyllä |
| GK-faktan lähde vaihtuu | Vanha snapshot ei tarjoa uutta GK:ta | kyllä |
| Tulos toisella kielellä ei julkaistu | Ei keksittyä URL:ia; vaihtoehto toimivalla kielellä selitetään | kyllä |
| Null ravintoarvossa | Ei näytetä nollana tai “vähän”-väitteenä | kyllä |
| Prompt injection reseptissä tai viestissä | Ei ohiteta skeemaa eikä tietorajaa | kyllä |
| HTML-/script-/URL-injektio | Ei suoritettavaa koodia; linkit vain allowlistasta | kyllä |
| Pyyntö 501+ merkkiä, konteksti liian pitkä | Turvallinen validointivirhe, ei mallikutsua | kyllä |
| Malli palauttaa väärän actionin tai ID:n | Hylätään ja käytetään fallbackia | kyllä |
| Moninkertainen rinnakkaiskutsu budjetin rajalla | Atominen kiintiö estää ylivarauksen | kyllä |
| Turnstile-tunniste puuttuu/virheellinen AI-polulla | Server-side Siteverify, ei laskutettavaa kutsua | kyllä |
| AI-off / provider 429/500 / timeout | Tavallinen haku ja reseptilinkit toimivat | kyllä |
| 320/390/768/1440 px, näppäimistö ja ruudunlukija | Ei fokusansaa, live-alue hallittu | kyllä |
| No-JS ja vanhat index/reseptireitit | Hakemisto, SEO, canonicalit, kielilinkit ja sivuston muu sisältö toimivat | kyllä |
| 80 testikysymyksen kustannus ja latenssit | Mitattu tokenimäärä/malli ja p50/p95, ei pelkkä hinnastoarvio | kyllä |
| AI Gateway -lokit pois / ei PII:tä telemetriassa | Tarkastettu käytännössä, ei vain dokumentoitu | kyllä |

**A4:n laatukynnykset (ehdotus, tarkennettava ennen testiä):** nolla sepitettyä resepti-ID:tä/URL:ia ja numeerista GK/CHO-arvoa 80 testissä; rakenteen skeemavalidointi 100 %; kieltäytyminen/fallback on hyväksyttävä mieluummin kuin keksitty vastaus. Vertailu normaaliin hakuun mitataan: uuden avustajan pitää lyhentää vaikean haun käyttövaiheita, muuten ei kannata julkaista.

## E. Minimoitu toteutuspolku ja tiedosto-omistajuus

**A1 suunnitellut uudet tiedostot:** site/src/features/assistant/catalog-index.ts (tyyppiturvallinen sisältö), site/src/features/assistant/intent.ts (deterministiset tulkinnat), site/tests/assistant-catalog.test.ts sekä mahdollinen uusi build-skripti indeksiin. Vaihtoehtoisesti jaetaan nykyinen recipe-search.ts suoraan; pidä muutokset minimissä.

**A2:** omat assistant-UI- ja testitiedostot feature-flagin takana. Integrointi RecipesPage.tsx/router/styles vasta #312 + H2:n katselmoinnin jälkeen. Älä luo samaa päävalikko- tai hero-muutosta rinnakkaisessa työhaarassa.

**A3:** Cloudflare Worker kokonaan erillisessä hakemistossa ja etä-API-/secret-konfiguraatiossa, ensin mock-tilassa. GitHub Pages ei saa AI-endpointtia eikä avainta. Tämä ei pakota siirtämään koko sivustoa Workers Static Assetsiin.

**A4–A5:** provider-mittaukset synteettisillä syötteillä ja redaktoidulla telemetrialla. Kustannus- ja tietosuojapäätös ennen henkilöiden oikeita kysymyksiä. Erillinen explicit cutover-päätös, jos Chat näkyy www.recipavo.comissa.

## F. Ylläpidon mittarit, jotka saa kerätä ilman raakatekstiä

- assistant_open, query_mode (deterministic/ai), returned_results_count, no_results, user_click_to_recipe, fallback_rate;
- language, request token bands, p50/p95 latency, provider error class, aggregate daily cost;
- privacy-safe abuse counters with lyhyt säilytys, ei raakaa kysymystä, terveydentilaa tai tarkkaa käyttäjäprofiilia;
- mittaa normaaliin hakuun verrattu klikkaus reseptiin, ei vanity-chat-viestimäärää;
- kulujarrun laukaisu + palautumispolku ovat operatiivisia hälytyksiä.

**Mittareita ei aktivoida vahingossa nykyiseen GitHub Pages -tuotantoon.**

## G. Muutosten hyväksymisketju

- Tämän PR:n katselmointi = dokumentin tarkistus.
- A1–A4:n jokainen toteutus erillisessä rajatussa PR:ssä, CI- ja testitulos sidottuna HEADiin.
- Ei mergeä, deployta, verkkomallikutsua tai laskutussopimusta vain tämän dokumentin perusteella.
- Ennen suljettua live-pilottia tarkistetaan tietosuojailmoitus, DPA, mallin lähetettävä data, Cloudflare-ai-portin asetukset, API-hostin rajat, kustannuskatto ja henkilötietojen käsittely.
- Olemassa olevat muut PR:t #312, #309 sekä Cloudflare-siirtosuunnitelma pysyvät omistajillaan.
