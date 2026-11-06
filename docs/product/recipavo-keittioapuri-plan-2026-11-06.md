# Recipavo Keittiöapuri — Cloudflare + AI, vaiheistettu arkkitehtuurisuunnitelma V1

**Päiväys:** 6.11.2026  
**Tila:** suunnittelu-PR / Draft; ei AI-kutsuja, käyttäjärajapintaa, palvelinrajapintaa, tilinkytkentää eikä tuotantojulkaisua.  
**Omistaja:** Reseptit / Recipavo. **Kohde:** tuleva https://www.recipavo.com/.  
**Periaate:** julkaistut reseptisivut, reseptikortit ja linkit toimivat edelleen ilman Keittiöapuria, JavaScriptiä tai kirjautumista; hakusuodattimet tarvitsevat nykyiseen tapaan JavaScriptin.

## 1. Päätösesitys

Rakennetaan **oma Recipavo Keittiöapuri**, jonka ensimmäinen tehtävä on ohjata käyttäjä jo julkaistujen reseptien ääreen. Ei osteta erillistä chat-palvelua, ei luoda vapaasti reseptejä keksivää keskustelubottia, eikä rakenneta uutta ravintolaskuria tekoälyllä. Ensimmäinen toimiva etappi on **deterministinen haku + keskustelunomainen käyttöliittymä ilman LLM-kuluja**. Vasta käyttökelpoisuuden osoittamisen jälkeen lisätään rajattu kielimallin tulkinta.

**Miksi tämä on erillinen ominaisuus:** nykyinen hakukenttä hallitsee jo hakusanat, kielikohtaisen normalisoinnin, kategoriat, keto/VHH:n, maksimiajan, aluekeittiöt, ainesosaryhmät ja GK-luokat. AI:n tehtävä on muuntaa luonnollinen pyyntö näihin rajauksiin, kysyä tarpeellinen täsmennys ja selittää löydetyt vaihtoehdot — ei olla oma tietokanta.

**Ei nyt:** chat-kuplaa nykyiseen heroon, maksullisuutta, käyttäjäprofiileja, päiväkirjaa, D1-keskusteluhistoriaa, erillistä vektorihakua tai Cloudflare-domainin vaihtoa.

## 2. Todettu lähtötilanne ja riippuvuudet

- Site: Vite / React, esirenderöity nelikielinen sivusto. Reseptien kanoninen lähde on julkaistu Markdown; reseptisisällöstä luodaan reittikohtaisia JSON-paketteja. Hakemiston yhteinen JavaScript ei lataa koko kantaa.
- site/src/features/recipes/recipe-search.ts: nykyinen suodatus ja normalizeSearchText; hyödyntäminen ensisijaisesti, ei toista erillistä hakualgoritmia.
- site/src/content/route-data.ts: RecipeSummary sisältää esimerkiksi title, ingredients item/note, tags ja timeTotalMin mutta **ei** numeroituja ravintoarvoja eikä hyväksytyn GK-laskennan lähdesidosta. Tästä ei saa johtaa GK-lukua.
- site/src/types/content.ts: RecipeEntry.nutrition sisältää hiilihydraatit, proteiinin ja rasvan nullable-kenttinä. Null = tuntematon, ei nolla.
- GK-suodatus lukee erillisiä glycemic-load-filters.generated-luokkia; luokka ei automaattisesti merkitse numeerisen GK:n saatavuutta.
- PR #312: etusivun H1-esikatselu. Älä muuta RecipesPage.tsx-, hero-, router-, styles- tai blogitiedostoja tässä suunnittelu-PR:ssä.
- #309: Ruokaopas yhdistetty mainiin. Mahdollinen tuleva ruokaoppaan sisältöhaku on erillinen feature-portti.
- docs/recipavo-cloudflare-release-plan.md: Cloudflare Pages tavoiteltu julkiseksi hostiksi, GitHub Pages stagingiin; Coming Soon säilytetään, kunnes erikseen valtuutettu domain-cutover tapahtuu. **Keittiöapurin PR ei ole cutover-valtuutus.**
- docs/product/recipavo-product-strategy.md: julkinen reseptipalvelu ja yksityinen tuleva Diary ovat erillisiä. Avustaja ei saa muodostaa oikopolkua Diaryn tietoihin tai henkilökohtaisiin terveystietoihin.

## 3. Käyttäjät, käyttötapaukset ja rajat

**V1 — julkaistujen reseptien opastava haku (FI/EN/SV/TH):**
1. “Löydä ketoillallinen enintään 30 minuutissa” → todennetut diet + time -suodattimet, oikeat reseptilinkit.
2. “Minulla on kananmunia ja fetaa” → sanahaku/ainesosien osumat; kerrotaan, ovatko kaikki vai osa aineksista reseptissä.
3. “Näytä vain reseptit, joiden GK on saatavilla” → käytetään vain hyväksyttyä GK-saatavuusstatusta, ei päätellä itse.
4. “Miksi reseptiltä puuttuu GK?” → näytetään kyseisen reseptin tarkistetut selitteet, tai kerrotaan ettei perustetta ole avustajan tietopaketissa.
5. “Vertaa näitä kahta” → faktapohjainen vertailu reseptin julkaistuista tiedoista, null-arvot näkyviin.
6. “Vaihda thaihin” → keskustelun käyttöliittymän kieli ja kohdekielen **olemassa olevat** reseptipolut, ei luoda linkkejä kääntämällä slugia.
7. Nolla tulosta → normaali ei osumia -viesti ja ehdotus poistaa yksi rajaus; linkki tavalliseen hakuun.

**Ei V1:ssä:** vapaiden ruoka-aineiden ravinto-/GK-arvioita, käyttäjän omaa GK-laskentaa, ateriapäiväkirjan lukua/kirjoitusta, verensokerin tai sairauksien yksilöllistä ohjausta, allergiaturvallisuuden takuuta, kauppatuote- tai hinta-arvioita, reseptin automaattista julkaisemista, ulkopuolisten verkkosivujen hakua, käyttäjän keskustelujen pitkäaikaistallennusta.

**Käyttäjälle näkyvä ero:** “Löysin julkaistuista resepteistä” vs. “Yleinen ruoanlaittovinkki”. V1 näyttää vain ensin mainittua. Jos käyttäjä pyytää uutta omaa reseptiä, ohjaus myöhempään reseptiehdotusprosessiin ilman julkaisu- tai tekijänoikeusväitettä.

## 4. Ratkaisun looginen arkkitehtuuri

~~~mermaid
flowchart TD
  A[Recipavon julkinen haku / valinnainen Keittiöapuri] --> B[Paikallinen hakutulkinta]
  B -->|selkeä pyyntö| C[Julkaistu resepti-indeksi]
  B -->|epäselvä tai monitulkintainen| D[Cloudflare Worker: assistant/v1]
  D --> E[Validoi pyyntö + käyttökate + väärinkäytön esto]
  E --> F[Valinnainen AI Gateway -> mallipalvelu]
  F --> G[Tyyppitarkistettu hakuaie]
  G --> C
  C --> H[Palvelimen/asiakkaan varmentama julkaistujen osumien lista]
  H --> I[Recipe-ID + oikea kieliversion URL + todistetut kentät]
  I --> A
  J[Published Markdown + hyväksytty GK-näyttö] --> K[Build-vaiheen avustajaindeksi]
  K --> C
~~~

**Suositus:** lähdekoodin yhteinen, puhdas hakufunktio siirretään tarvittaessa jaettavaksi moduuliksi erillisessä toteutus-PR:ssä, mutta nykyisen frontendin tietovirtaa ei muuteta ennakoivasti.

**Hakutietopaketti / build:** muodostetaan vain status=published-sisällöstä, kunkin kieliversion todellisista reiteistä. Jokaiseen riviin recipeId, locale, routePath, otsikko, luokka, ruokavalioluokka, ainesosanimet ja määrät vain jos lähde antaa määrän, aikakenttä, rajatut ravintokentät nullable-muodossa, GK-status + piste/arvoväli **vain** kun hyväksyttyyn GK-julkaisumenetelmään sidottu, näyttöluokan selite sekä sisällön versio/hash. Haettavat indeksit pidetään kevyinä ja kielikohtaisina, ei monikertaisteta koko reseptikirjastoa frontendin yhteiseen JS:ään.

**Määrittelemättömät/keskeneräiset:** puuttuva määrä tai puuttuva GI-sidos aiheuttaa eston GK-numeroiden esittämiseen; vanha/nimeämätön vastaavuus ei kelpaa. V1 ei laske uusia GK-lukuja eikä sovella ruoka-aineryhmäanalogiaa. Jos hyväksytty GK-paketti ei ole buildissa saatavilla, numeerinen GK jätetään kokonaan pois.

**Backend:** samaan origin-polkuun suunniteltu POST /api/assistant/v1, vain Cloudflare-pilottiin; Worker saa hakea vain julkaistun, buildissä versionoidun indeksin. Provider ja malli ympäristöasetuksina, ei käyttäjän antamina. Varsinainen AI saa tehdä rajatun intenttijäsennyksen, ei antaa suoraan selaimelle luotettuna pidettävää reseptifaktaa. Palvelin validoi listan ja ottaa lopulliset faktat indeksistä.

**Vaihtoehto avoinna:** Cloudflare Workers AI (malli Cloudflaren alustalla) vs. OpenAI API Cloudflare AI Gatewayn kautta. Valinta tehdään laadun ja **todellisten** hintojen testistä. Ei samaan vaiheeseen kahta laskutettavaa mallia.

## 5. Tuotteen UX ja saavutettavuus

- Ensisijainen paikka: reseptihaun yhteydessä pieni “Kysy Keittiöapurilta” -valinta vasta, kun haku ja hero/H2-kirjasto ovat vakiintuneet; ei pakollista kelluvaa kuplaa tai tilaa vievää heroa.
- Suositukset ovat **oikeita reseptikortteja** ja linkkejä, eivät pelkkiä tekstikuvauksia. Aktiiviset rajaukset ovat näkyvissä ja käyttäjä saa poistaa ne.
- Hakusuodattimet toimivat ilman AI:ta ja kirjautumista JavaScriptin ollessa käytössä; julkaistut reseptikortit ja reseptilinkit näkyvät myös ilman JavaScriptiä. AI:n palvelukatko ei estä reseptien lukemista.
- Koko käyttö neljällä kielellä, myös virheet, kuittaukset, lähderajaukset ja tietosuojatekstit. Thai-segmentointi ja eri kielten diakriitit testattava.
- WCAG 2.2 AA -tavoite: näppäimistökäyttö, kohdistuksen palautus, aria-live maltillisesti, viestien navigointi, ruudunlukija, 320 px viewport ja reduced-motion; ei automaattista fokuskaappausta.
- Visuaalisen toteutuksen täytyy noudattaa nykyistä niukkaa HTML/CSS-linjaa, ei uutta UI-kirjastoa. Ei chatin päällä kiinteää paneelia mobiilissa.
- Tuloslistasta voi avata yksittäisen reseptin suoraan, säilyttäen nykyiset reitit ja kieliversiot.

## 6. AI:n luottamusrajat ja ravintoarvojen turva

1. Malli on **epäluotettava tulkitsija**, ei tietolähde. Käytetään tiukkaa JSON-tyyppistä toimintoa: search / compare / clarify / unsupported, vain sallituilla filter-arvoilla.
2. Reseptitunnisteet ja URL:t tulevat vain versionoidusta indeksistä; mallin ehdottama olematon ID hylätään. Ulkoisia linkkejä ei avata automaattisesti.
3. Kaikki GK/CHO/proteiini/rasva/annosarvot palautetaan deterministisesti saman julkaistun reseptiversion lähteestä; null ei saa muuttua nollaksi tai “vähäiseksi”.
4. Keto/VHH-tagit ovat toimituksellisia luokkia, eivät lääkinnällisiä lupauksia. Nimetty allergia tai diagnoosi ei oikeuta turvallisuustakuuseen tai annosteluun.
5. Reseptin teksti, käyttäjän syöte ja ulkopuolinen lähde käsitellään datana; niissä olevat toimintaohjeet, URL:t tai prompt-injektiot eivät saa antaa oikeuksia.
6. Mallin tuottamat tekstit HTML-escapetaan; ei renderöidä luottamattomia HTML- tai Markdown-linkkejä suoraan. Kaikki reseptilinkit omasta allowlistasta.
7. Mallin halutessa muuttaa ruokaohjetta/ainesmääriä sitä ei tehdä tämän tuotteen kautta. Käyttäjän reseptiehdotus on erillinen hyväksyntätyöjono.

## 7. Turvallisuus, yksityisyys ja käyttökustannusten esto

- API-avaimet vain Cloudflare Worker -secretissä; ei Vite-enviin, repon tiedostoon, HTML:ään eikä selaimen network-kutsuun. Salli vain hyväksytty origin; CORS ei yksin suojaa julkista API:a.
- Pituus- ja tokenrajat: esim. 500 merkkiä/kysymys, korkeintaan 6 viestin rajattu konteksti, tulos enintään 5 korttia; aikakatkaisu, virherajat ja mallin strukturoitu vastaus.
- Kevyt automaattisuodatin + Turnstile Siteverify (etenkin AI-polulla); oikeat serveripohjaiset lyhyt-/pitkäaikaiset rate limitit, ei vain asiakassivun laskuria. IP-pohjainen pseudonyymi on henkilötietoa; minimoi ja määritä säilytys.
- Budjetti ei saa olla pelkkä monitorointihälytys: **atomisesti varattu pyyntö-/tokenibudjetti** tai toimittajan todellinen hard cap, lisäksi kill switch OFF oletusarvona; rajojen ylitys -> normaali ilmainen haku.
- AI Gatewayn lokitus on oletuksena päällä: vaihda erikseen **pois** tai redactaa ennen lähetystä; pelkät aggregoidut kustannus-/onnistumistiedot. Pelkän gateway-cache:n käyttö ei saa sekoittaa käyttäjien keskusteluja.
- V1 ei tallenna keskusteluhistoriaa palvelimelle; vain istuntokohtainen välttämätön tieto selaimessa ilman pysyvää synkronointia. Ei terveystietoprofiilia, analytiikkatapahtumassa vain kategoria/latenssi/hinta, ei käyttäjän tekstisyötettä.
- Käsittelyn ehdot, DPA, sijainti/siirrot, toimittajan tietojen käyttö ja mahdollinen erityisiin henkilötietoihin liittyvä riski arvioidaan ennen oikeaa käyttäjäpilottia. Selkeä AI-ilmoitus käyttäjälle. V1 ei pyydä terveystietoja.
- Ei toiminnallista liitäntää Diaryn henkilötietoihin, maksuihin, GitHubin julkaisupolkuun tai admin-rajapintaan.

## 8. Kustannusmalli (USD, 6.11.2026, EI kustannuslupa)

**Vertailuoletus:** yksi keskustelu = 5 kysymys/vastausparia, yhteensä 10 000 input-tokenia ja 2 000 output-tokenia. Todellinen kontekstin toisto, kielijakauma, välimuistit, työkalukutsut ja ajateltavat tokenit voivat nostaa kulua. V1 ilman ulkoista verkkohakua. Mukana ei veroa, tukityötä eikä uusia tallennus-/lokikustannuksia.

| Esimerkkimalli | 1M input | 1M output | Mallikulu / keskustelu | 300 keskustelua | 1 000 keskustelua | 5 000 keskustelua |
|---|---:|---:|---:|---:|---:|---:|
| OpenAI GPT-5.4 mini (virallinen API-hinta) | $0.75 | $4.50 | **$0.01650** | **$4.95** | **$16.50** | **$82.50** |
| Cloudflare Workers AI Llama 3.1 8B fp8-fast (referenssimalli) | $0.045 | $0.384 | **$0.001218** | $0.37 | $1.22 | $6.09 |

Cloudflare Workers AI:n todellinen hinta/ilmaiskiintiö määräytyy Neuron-laskennasta ja sovellettavasta mallista; edellinen halvempi rivi on vain vertailulaskelma. Llama-vaihtoehdon FI/EN/SV/TH-laatu, lähdekuri ja saatavuus **on testattava**. Vertailuluvuista ei päätellä, että nämä mallit suoriutuvat yhtä hyvin.

Cloudflare Workers Paid perusmaksu on **$5/kk tilikohtaisesti** ja voi olla jo nykyisen tilauksen kattama — ei lisätä samaa perusmaksua toistamiseen. Ylityskulut, AI-pyynnöt ja lokitus riippuvat oikeasta käytöstä. AI Gatewayn perustoiminnot ovat ilman erillistä gateway-lisämaksua, mutta käyttö ja logit voivat aiheuttaa kuluja.

**Taloudellinen portti:** nykyisen Recipavo-suunnitelman oletettu uusiin palveluihin käytettävä **enintään $5/kk lisäkulubudjetti** säilyy, ellei omistaja erikseen muuta. GPT-5.4 mini -esimerkkihinnalla tämä raja ylittyy jo noin 304 keskustelussa/kk, jos muuta kulua ei ole. Suunnittele aluksi pieni kiintiö ja budjetin automaattinen katkaisu. Ei laskutusavainta kehitystestien todellisiin AI-kutsuihin ennen hyväksyttyä kulurajaa.

**Lähteet (tarkista hinnat uudelleen ennen käyttöönottoa):**
- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/ai-gateway/reference/pricing/
- https://developers.cloudflare.com/ai-gateway/observability/logging/
- https://developers.cloudflare.com/ai-gateway/features/rate-limiting/
- https://developers.cloudflare.com/turnstile/

## 9. Eteneminen, erilliset PR:t ja riippuvuudet

| Portti | Erä | Konkreettinen toimitus | Julkaisu- ja riippuvuusraja |
|---|---|---|---|
| A0 | Tämä Draft-suunnitelma | Arkkitehtuuri, API-sopimus, kustannukset, riskit ja testimatriisi | **Ei ajoon / ei deployta** |
| A1 | Read-only hakumoottori | Rakennettu avustajaindeksi status=published-sisällöstä; normalisointi/hakusuodattimet yhteiskäyttöön; 4 kielitestiä | Ei koske heroa, blogia eikä GK-laskentaa |
| A2 | Paikallinen mock-UI | Kehityslipun takainen keskustelu-UX, fixture-pohjaiset mock-vastaukset ja no-AI-fallback | Esikatselu vasta #312/H2-yhteensovituksen jälkeen |
| A3 | Worker ilman AI:ta | Tyypitetty /api/assistant/v1, validointi, published-ID-allowlist, kustannus- ja väärinkäyttöportit, mock-provider | Erillinen Cloudflare-preview; ei www-domainia |
| A4 | Rajattu AI-benchmark | 4 kieltä, kahden mallin vaihtoehtoinen evaluointi, väärät osumat ja kustannukset kirjataan; provider-valinta | Laskutus ja henkilötietojen käsittely hyväksyttävä erikseen |
| A5 | Suljettu pilotti | Vapaaehtoiset testaajat, saavutettavuus, privacy, kustannuskatto, kill switch, fallback, mittarit | Cloudflare-domainin cutover ja julkinen chat erillisellä nimenomaisella hyväksynnällä |
| A6 | Mahdollinen Plus-laajennus | Ruokalistat/ostolistat ja vasta myöhemmin omien tietojen käsittely erillisenä oikeustasona | Vaatii Diaryn, tietosuojan, hinnoittelun ja uuden PR:n |

**Järjestys:** viimeistele #312 ja tuleva etusivun H2-kirjastoreititys ennen A2:n julkista UI-integraatiota. Älä muuta #309 Ruokaopasta, vanhoja reseptiosoitteita, #243 domainin julkaisuportteja, GK100:aa tai reseptien kuvia tässä PR:ssä. A1 voidaan tehdä rinnakkain, kun ainoat muokatut polut ovat omat adapterit ja testit.

## 10. Riskit ja palautus

| Riski | Torjunta ja hyväksyntä |
|---|---|
| Keksitty GK, CHO tai ravintoarvo | Vain lähteestä palautettu nullable-fakta; kieltäydy arvosta ilman hyväksyttyä evidence/hash-sidosta |
| Käännöksen keksitty reseptilinkki | Vain reitti-indeksin olemassa oleva locale + routePath |
| Kalliit bottipyynnöt | Atominen käyttökatto, per-user/per-origin rajat, testattu kill switch, fallback hakuun |
| Prompt-injektio / XSS | Tyypitetty toiminto, serverin allowlist ja eskapointi; resepti- ja käyttäjätekstit epäluotettavia |
| Arkaluontoinen käyttäjädata / lokitus | Ei pitkäaikaishistoriaa, DPA/siirtoarvio, gatewayn logging OFF, ei tekstiä telemetriaan |
| SEO, hero tai blogi rikkoutuu | Omat tiedostopolut ja kytkin OFF; no-JS ja mobile-mittaukset |
| Cloudflare-virhe tai API:n katko | Normaali linkitetty haku toimii aina; erillinen palvelinpolun poiskytkentä |
| Liiketoimintarajan lipsuminen | Ei Diary- tai Plus-kytkentää ilman erillistä päätöstä |

## 11. Katselmuksessa hyväksyttävät päätökset

1. Hyväksytäänkö hakukeskeinen Keittiöapuri tuotekonseptina, **ei vielä tuotantoominaisuutena**?
2. Hyväksytäänkö vaiheistus A0–A6 ja toteutus vain yksi erillinen, pienialainen PR kerrallaan?
3. Vahvistetaanko V1:lle **ei tallennettua keskusteluhistoriaa, ei henkilökohtaisia terveystietoja, ei omaa GK-laskentaa**?
4. Vahvistetaanko uuden palvelukulun **$5/kk suunnittelukatto** ja tekninen kill switch ennen AI-avaimen käyttöönottoa?
5. Valitaanko A4:n vertailun jälkeen AI-palvelu todellisella FI/EN/SV/TH-laatu- ja kustannusnäytöllä?

**Ei yhdistämistä tuotantojulkaisuluvaksi:** tämän dokumentin merge mainiin saa julkaista vain dokumentaation nykyisen GitHub Pagesin tavallisen putken kautta; ei anna oikeutta avata AI:ta, laskutusta, Cloudflare-rajapintaa eikä Recipavo-domainia.
