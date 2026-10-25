# Nutriticsin seitsemän päivän ohjelmistokokeilu

Tämä protokolla ei aktivoi tiliä, ohjelmistokokeilua tai API-kokeilua. Nutriticsin ohjelmistokokeilu ja mahdollinen API-sandbox ovat eri sopimuksia ja niiden alkamis-/päättymisajat voivat erota. Käyttäjä aktivoi haluamansa kokeilun itse vasta kirjallisten ehtojen tarkistamisen jälkeen.

## Ennen aloitusta

1. Lähetä alla oleva viestiluonnos Nutriticsille ja pyydä kirjallinen vastaus API:n, tietojen käytön, hinnan ja lisenssien kysymyksiin.
2. Älä pyydä tai säilytä oikeita API-vastauksia tässä julkisessa repossa. Käytä paikallista, Gitin ulkopuolista muistiota; älä tallenna siihen tunnuksia tai API-avaimia.
3. Käytä vertailussa samaa 18 reseptin joukkoa, samaa ainesosalistaa, määriä ja annoskokoa kuin projektin lähtötiedoissa. `comparison-template.csv` sisältää reseptien lähdehashit ja annosmäärät; lisää yksi rivi kutakin ainesosaa kohti ja jätä lähdetietueen tulokset tyhjiksi, kunnes ne on havaittu.
4. Kirjaa joka havainnosta päivän numero, päivämäärä, testattu ominaisuus, resepti/hakutermi, tuloksen tila, aineistolähteen nimi/versio, erot, epävarmuus, lisenssikysymys ja käytetty aika.

## Polku A — Nutritics myöntää rajatun API-evaluoinnin

Älä tee live-kutsua ennen kuin Nutritics on vahvistanut kirjallisesti API-avaimen otsakeformaatin, sallitut endpointit, sandboxin, kutsukiintiön, datan lisenssin sekä sen, ettei pyyntö aiheuta odottamatonta maksua. Rajaa avain paikalliseen ympäristöön. Käytä valmisteltua sovitinta vain erillisessä arviointiajossa, ei normaali-CI:ssä.

| Päivä | API-kokeilun tehtävä ja vertailukelpoinen tulos |
| --- | --- |
| 1 | Vahvista avain toimii vain sandboxissa; kirjaa sallitut endpointit, quota, rate-limit, päättymisaika ja oikeudet. Tee enintään yksi harmiton dokumentoitu testihaku. |
| 2 | Hae vertailureseptien olennaiset suomalaiset, kansainväliset ja tuotemerkkiainekset. Kirjaa osumien määrä, lähde-/tietuetunnisteet, versiot ja valmistustilan vastaavuus. Älä massalataaa tietokantaa. |
| 3 | Analysoi kaikki 18 reseptiä samoilla määrillä ja annosmäärillä. Tallenna yksityisesti energian, hiilihydraatin, kuidun, proteiinin, rasvan ja puuttuvien arvojen vertailu. |
| 4 | Tarkista GI/GK-lähteet, asteikko, mittausmenetelmä, ainesosakoosteen laskentatapa ja epävarmuus. Älä siirrä tuloksia nykyisiin GI/GK-aineistoihin tai toiseen istuntoon. |
| 5 | Tarkista mikroravinteet, allergeenit, kypsennystila, saanto, hävikki ja öljyn imeytyminen. Erota mitattu tieto, mallinnettu tieto ja tyhjä kenttä. |
| 6 | Testaa vain hyväksytyt ateriasuunnittelu-, kustannus-, label-, Foodprint-, tuonti- ja vientitoiminnot. Mittaa kesto, kutsumäärä, virheet ja vahvistettu kustannus. Vältä toistuvia kutsuja. |
| 7 | Laske kattavuus ja erot; tarkista lähdejäljitettävyys, oikeudet, tietojen säilytys ja kustannus. Tee jatkopäätös ja poista kokeiludata säilytysehtojen mukaan. |

## Polku B — API-evaluointia ei myönnetä

Ohjelmiston UI-kokeilu voidaan silti tehdä, jos se tarjotaan käyttäjälle ilman maksullista sitoumusta. API-live-vaihe jää erilliseksi sopimuspäätökseksi.

| Päivä | UI-kokeilun tehtävä ja vertailukelpoinen tulos |
| --- | --- |
| 1 | Merkitse käyttöliittymän moduulit, tilin kokeilun alku/loppu, näytetyt tietokannat ja oikeusrajat. |
| 2 | Hae samat 18 reseptin olennaiset ainekset. Kirjaa tulos, lähde, maa/tuotemerkki, valmistustila ja annosmitta; älä kopioi koko tietuetta. |
| 3 | Syötä samat määrät ja annokset kaikille 18 reseptille. Kirjaa yksityiseen vertailuun energia ja makrot sekä käytetyt oletukset. |
| 4 | Tarkista GI/GK:n olemassaolo ja lähteet UI:ssa, jos ominaisuus näkyy. Jos sitä ei ole tai tietolähde puuttuu, merkitse “ei saatavilla / vahvistamatta”; älä päättele arvoja. |
| 5 | Tarkastele mikroarvoja, allergeeneja ja valmistuksen vaikutuksia. Kirjaa kentän lähde ja erottele tyhjä kenttä nollasta. |
| 6 | Kokeile lisenssin sallimia ostoslista-, kustannus-, ateriasuunnittelu-, merkintä- ja Foodprint-toimintoja. Dokumentoi API-estettä koskevat kysymykset mutta älä yritä kiertää käyttöoikeuksia. |
| 7 | Kokoa UI-havaintojen kattavuus, lähteet, hinnat ja lisenssirajat; pyydä erillinen kirjallinen API-tarjous jos ratkaisu vaikuttaa lupaavalta. |

## Kummankin polun vertailusäännöt

- Käytä reseptien repo-lähdehashia sekä Fineli-tietueen tunnistetta, kun ne ovat tiedossa. Nutriticsin tunnisteet ja vastaukset jäävät paikalliseen lisenssin sallimaan aineistoon.
- Älä muuta reseptejä, niiden ravintoarvoja, Fineli-syötteitä tai GI/GK-laskentaa kokeilun aikana.
- Vertaa samoja yksiköitä ja annoskokoja. Merkitse aineistojen erilaiset hiilihydraatti- ja kuitumääritelmät ennen numerovertailua.
- Kustannus on `UNKNOWN`, ellei yksikköhintaa, valuuttaa ja laskutustapaa ole kirjallisesti vahvistettu.
- Kutsut, viiveet ja virheet kirjataan yhteenvetona. Älä tallenna API-vastauksia tai tunnuksia GitHubiin.

## Päiväkirjan otsakkeet

`date, path(A/B), feature, recipe_id/query, source/version, result_state, duration, quota_before_after, cost_status, comparison_note, confidence, rights_status, follow_up`

## Nutriticsille lähetettävä viesti

Älä lähetä automaattisesti. Lähetä [Nutriticsin virallisen yhteydenottolomakkeen](https://www.nutritics.com/en/pricing/) tai [API-sivun maksuttoman tarjouspyynnön](https://www.nutritics.com/en/product/food-data-api/) kautta. “Request free quote” kertoo tarjouspyynnön olevan maksuton; se ei osoita API:n olevan ilmainen.

**Subject: Seven-day software trial and API evaluation for a Finnish recipe project**

> Hello Nutritics team,
>
> We are preparing to evaluate Nutritics for a public Finnish recipe website with approximately 325 recipes. We have not activated a trial or subscription. Could you please answer the following before we start?
>
> **Software and API evaluation**
> 1. Is the seven-day software trial available for this project, and which modules, databases and user limits does it include?
> 2. Is a free API sandbox or time-limited API evaluation available separately? Please specify its duration, request quota, rate limits, allowed endpoints and any charges or overage fees.
> 3. What is the current API-key authentication format and the current technical documentation for v1.2? Please identify any legacy Explorer examples that should not be used.
>
> **Data and calculation coverage**
> 4. Which Finnish food databases and branded products are available? Is THL Fineli included or can it be used alongside Nutritics data? Please include source/version identifiers and nutrient definitions where available.
> 5. Are GI and glycaemic-load data available? If so, what are their source tables, glucose/reference scale, testing method, food-preparation matching rules and recipe-level calculation method?
> 6. Which macro- and micronutrients, allergens, cooking yield/loss, nutrient retention and oil-absorption calculations are supported, and how are missing or estimated values identified?
> 7. Which recipe-analysis, meal-planning, shopping-list, costing, food-label and Foodprint/environmental functions are available in the UI and via API? Do any require separate modules?
>
> **Rights, retention and cost**
> 8. May we store API results, derive per-serving nutrition values, combine them with our locally licensed Fineli Release 20 data (CC BY 4.0), and publish the resulting values on a public website? What attribution is required?
> 9. What caching limits apply, may results be retained after a trial or subscription ends, and what deletion/export obligations apply?
> 10. Please provide monthly and annual prices for the API, databases and relevant add-ons, including setup/integration fees, usage tiers, overage charges and any small-business/developer evaluation pricing.
>
> We will not make live API requests until the sandbox, authentication, permissions and charges are confirmed in writing.
>
> Kind regards,
> Ossi
> Reseptit project

## Ensimmäisen päivän tarkka aloituslista

1. Tarkista kokeilun päivärajat ja käyttäjätilin moduulit.
2. Kirjaa näkyvät tietokantanimet ja alueet, älä lataa dataa massana.
3. Avaa API/integrations-näkymä ja merkitse onko avaimen luonti tai sandbox näkyvissä. Älä luo avainta tässä valmisteluvaiheessa.
4. Jos oikeuksia ei ole vahvistettu kirjallisesti, älä tee live-pyyntöä.
5. Täytä matriisin UI-sarake vain omilla havaintotiedoilla (päivämäärä ja näkymä). Kokeilutilin kenttiin ei tehdä oletuksia.
