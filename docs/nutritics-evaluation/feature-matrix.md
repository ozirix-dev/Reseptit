# Nutriticsin ominaisuusmatriisi

Matriisi erottaa Nutriticsin julkisesti kuvaamat tuotteet ja rajapinnan nykyisen käyttäjätilin oikeuksista. Kokeilua ei ole aktivoitu, joten tilikohtaisia ominaisuuksia ei ole vahvistettu.

## Tulkinta

- **Tuote:** ominaisuus tai palvelu on Nutriticsin tuote- tai tukisivuilla kuvattu. Tämä ei takaa yksittäisen tilin saatavuutta.
- **API:** Nutriticsin API-sivu tai API Explorer dokumentoi vastaavan toiminnon tai kentän. Kentän nimi ei osoita, että tietoa löytyy kaikille elintarvikkeille tai että pääsy kuuluu kokeiluun.
- **Kokeilutili:** todetaan vasta kirjautuneessa kokeilutilissä. Kaikki rivit ovat nyt **vahvistamatta**.
- **Lisenssi:** erillinen moduuli, sopimus tai käyttöoikeus on vahvistettava Nutriticsilta.
- **Avoin kysymys:** konkreettinen asia, joka kirjataan kokeilussa tai kysytään kirjallisesti.

## Tarkistusmatriisi

| Ominaisuus | Tuotteen julkinen kuvaus | API-dokumentaatio / Explorer | Kokeilutili | Lisenssi / vahvistus | Avoin tarkistus |
| --- | --- | --- | --- | --- | --- |
| Elintarvikehaku | Kyllä: yli miljoonan ruoan tietokanta | Kyllä: haku/listaus näkyy Explorerissa | Vahvistamatta | API-oikeus ja kutsurajat | Hakutulosten järjestys, lähde- ja tietuetunnisteet |
| Kansalliset tietokannat | Kyllä: kansallisia ja kansainvälisiä tietokantoja yleisesti | Yleinen elintarvikehaku; aluekohtaista kattavuutta ei vahvista | Vahvistamatta | Tietokantavalikoima voi riippua paketista | Mitkä maat, tietokantalähteet ja versiot sisältyvät |
| Suomalaiset elintarvikkeet / Fineli | Ei Suomen kattavuusväitettä | Ei vahvistusta Fineli-aineistosta | Vahvistamatta | Kirjallinen vahvistus tarvitaan | Onko Fineli tai suomalainen lähde saatavilla ja tunnistettavissa |
| Tuotemerkkituotteet | Kyllä: geneerisiä ja merkkituotteita yleisesti | Food Data API kuvaa yli miljoonaa ruoka- ja reseptitietuetta | Vahvistamatta | Suomen tuotemerkkikattavuus avoin | Määrä, lähde, päivitystiheys, EAN/GTIN ja käyttöoikeus |
| Makroravintoaineet ja energia | Kyllä: ravintotietoja | Kyllä: energy, carbohydrate, protein, fat ja muut kentät | Vahvistamatta | Datan käyttöoikeus vahvistettava | Hiilihydraattien määritelmä, kuitu/polyolit, pyöristys |
| Vitamiinit ja kivennäisaineet | Kyllä: jopa 258 ravinneparametria API-tuotekuvauksessa | Kyllä: vitamiini- ja mineraalikenttiä Explorerissa | Vahvistamatta | Tietuekohtainen kattavuus vaihtelee ja oikeus avoin | Kenttien yksiköt, lähteet ja puuttuvan arvon merkitys |
| Reseptianalyysi | Kyllä: reseptien analyysi tuotekuvauksessa | Kyllä: resepti-/ainesosatoiminnot Explorerissa | Vahvistamatta | API-käyttö ja tallennus vahvistettava | Määrät, annokset, kypsennystila ja laskentamenetelmä |
| GI ja GK | Ei riittävää julkista vahvistusta kattavuudesta tai menetelmästä | `gi` ja `gl` esiintyvät attribuuttiluettelossa | Vahvistamatta | Sisältö, käyttöoikeus ja lähteet vahvistettava | Mitattu vai johdettu, asteikko, lähteet ja reseptikoosteen kaava |
| Allergeenit | Kyllä: API-kuvaus mainitsee allergeenit | Kyllä: `allergies` ja allergeenikenttiä Explorerissa | Vahvistamatta | Tietuekohtainen luotettavuus ja lisenssi | Ristikontaminaatio, lähde ja puuttuvan tiedon merkitys |
| Ruokavalio-ominaisuudet | Kyllä: API voi kuvauksen mukaan järjestää ruokavaliotyypeittäin | Osittain: vegan, vegetarian, glutenfree ym. kenttiä Explorerissa | Vahvistamatta | Määritelmät ja tilikohtaisuus avoinna | Peruste, aluekohtainen merkitys ja kattavuus |
| Valmistushävikki / saanto | Ei yleistä API-lupausta löydetty | `cmethod` näkyy Explorerissa; hävikki-/retentiolaskentaa ei siten todisteta | Vahvistamatta | Vahvistettava | Saanto, ravinteen retentio ja öljyn imeytyminen erikseen |
| Ateriasuunnittelu | Kyllä: ateriasuunnittelua kuvataan tuotteissa | API-sivu mainitsee meal plan -analyysin/generoinnin | Vahvistamatta | Moduuli- ja API-lisenssi avoin | Käytettävissä olevat endpointit ja rajoitteet |
| Ostoslistat / tuotantolistat | Kyllä: tukisivu kuvaa ominaisuuden | API-tuki ei vahvistettu | Vahvistamatta | Tukisivu kehottaa tarkistamaan ominaisuuden lisenssin | UI:n vienti, formaatit ja API-toiminto |
| Reseptikustannukset | Tuotteen tarkka saatavuus riippuu ratkaisusta | `costs`-attribuutti näkyy Explorerissa; laskentapalvelu ei vahvistu | Vahvistamatta | Hintalähteet ja moduuli avoinna | Valuutta, yksikköhinnat, päivitys ja API-oikeus |
| Ravintoarvomerkinnät | Kyllä: Labelmagic on erillinen tuote; API-sivu mainitsee compliant food labels | `foodlabel` näkyy Explorerissa | Vahvistamatta | Labelmagic-/API-lisenssi ja EU-formaatti avoin | EU-ravintoarvomerkinnän tarkkuus ja vienti |
| Ympäristövaikutukset / Foodprint | Kyllä: Foodprint on erillinen tuote | Explorerissa on `Foodprint`-attribuutti, mutta Foodprint-sivu sanoo API-integraation olevan tulossa; nykyinen API-saatavuus ei ole vahvistettu | Vahvistamatta | Erillinen tuote-/API-sopimus mahdollinen | Päästötietojen lähde, rajaus, hinta ja käyttöoikeus |
| Tietojen tuonti/vienti | Tuotekohtaiset työkalut kuvattu | API tukee GET/POST ja JSON; reseptitoiminnot näkyvät Explorerissa | Vahvistamatta | Tietojen vienti ja säilytys ehtojen alaisia | Massatuonti, poistot, vientimuodot, rajat |
| API-raportointi ja quota | API kuvattu REST/JSON-palveluna | Endpointit Explorerissa | Vahvistamatta | Sandbox, avain, quota ja maksullisuus avoinna | Rate limit -otsakkeet, lokitus ja raportointitoiminnot |
| API-autentikointi | API-tuotesivu sanoo perustunnistautumisen tapahtuvan headerissa | Explorerissa on nykyinen “API Key” -valinta; sivulla näkyy myös vanhoja URL-tunnusesimerkkejä | Vahvistamatta | Avaimen wire-formaatti vahvistettava Nutriticsilta | Julkinen materiaali ei yksin vahvista API-avaimen otsakkeen nimeä/arvoa; älä kopioi legacy-esimerkkejä |
| Henkilökohtaiset palvelut | Nutritics listaa diet analysis & meal planning -tuotteen | Henkilötieto-/client-kenttiä näkyy Explorerissa | Vahvistamatta | Tuote, henkilötietojen käsittely ja sopimus vahvistettava | Soveltuuko reseptiprojektiin; ei henkilötietoja tähän pilottiin |
| Tulosten tallennus/julkaisu | Ei julkista lupaa projektin tallennus- tai julkaisuoikeudesta | Tekninen vastaus ei määritä käyttöoikeutta | Vahvistamatta | Kirjallinen sopimus/ehdot tarvitaan | Välimuisti, julkinen verkkosivu, attribuutio, säilytys sopimuksen jälkeen |

## Viralliset lähteet

- [Food Data API and Integrations](https://www.nutritics.com/en/product/food-data-api/) — API:n yleinen sisältö ja “Request free quote”. Maksuton tarjouspyyntö ei tarkoita ilmaista API-kiintiötä.
- [Nutritics API Explorer v1.2](https://www.nutritics.com/api/v1.2/explorer/) — saatavilla olevat toiminto- ja attribuuttinimet. Explorerin esimerkit sisältävät vanhaa tunnistautumisesimerkkiä; niitä ei käytetä suoraan.
- [Pricing](https://www.nutritics.com/en/pricing/) — hinnat pyydetään yhteydenotolla; julkista API-hintaa ei ole vahvistettu.
- [Shopping Lists & Production Sheets](https://www.nutritics.com/en/support-center/shopping-lists-production-sheets/) — ostoslista-/tuotantolistaominaisuudet ja lisenssikohtaisuus.
- [Foodprint](https://www.nutritics.com/en/product/foodprint/) — ympäristövaikutusten erillinen tuote.

**Tila 25.10.2026:** API:n yleinen tuotetoiminto on julkisesti kuvattu, mutta ilmaista API-kokeilua, sandboxia, Suomen/Finelin kattavuutta, GI/GK-aineiston käyttökelpoisuutta, kokeilutilin oikeuksia, kustannusta tai julkaisulisenssiä ei ole vahvistettu kirjallisesti.
