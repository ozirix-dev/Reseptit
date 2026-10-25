# Nutriticsin kokeilun 7 päivän protokolla

Käyttäjä aktivoi kokeilun itse. Aloituspäivä on tilin kokeilun ensimmäinen päivä. Jokaisesta testistä kirjataan päivämäärä, käyttäjäliittymän näkymä/ominaisuus, resepti-ID tai hakutermi, tulosluokka, lähteen nimi ja versio, epävarmuus, mahdollinen rajoitus sekä arvioitu käytetty aika. Älä tallenna yksityiseen muistiinpanoon API-avaimia tai arkaluontoisia tilitietoja.

## Päiväkohtaiset tehtävät

1. **Käyttöliittymä ja tilin ominaisuudet:** kirjaudu sisään, käy läpi käytettävissä olevat moduulit ja tietokantavalinnat, tarkista kokeilun päättymispäivä sekä mahdolliset käyttörajat. Älä aktivoi maksullista lisäominaisuutta.
2. **Tietokannat ja suomalaiset tuotteet:** hae 18 vertailureseptin tärkeimmät ainekset, mukaan lukien suomalaiset perusraaka-aineet, tuotemerkit, kastikkeet ja kansainväliset aineet. Kirjaa osuma, lähde, valmistustila ja annosmitat; älä vie tai massalataaa tietueita.
3. **Reseptien ravintoarvolaskenta:** analysoi reseptit sovitulla ainesmäärällä ja annosjaolla. Vertaa näkyviä arvoja lähtöauditin tilaan. Kirjaa erot yksityisiin havaintoihin; älä muuta Markdown-reseptejä tai laskentasyötteitä.
4. **GI/GK ja epävarmuus:** selvitä GI/GK-arvojen saatavuus, lähteet, luottamuksen ilmaisu ja reseptikoosteen laskentatapa. Pidä kaikki havainnot erillään käynnissä olevasta GI-laskentatyöstä; älä kopioi arvoja projektiin.
5. **Allergeenit, mikrot ja valmistus:** tarkastele allergeenien lisäksi vitamiineja, kivennäisaineita, ruoan saantoa, paistohävikkiä ja imeytyvää öljyä. Erota käyttöliittymässä näkyvä tieto dokumentoidusta lähteestä.
6. **API, tuonti/vienti ja lisäpalvelut:** käytä API:a vain, jos kokeiluoikeus ja kutsut on vahvistettu. Muussa tapauksessa tarkista dokumentaatio ja kirjaa este. Testaa sallittujen ominaisuuksien puitteissa ateriasuunnitelma, ostoslista, merkinnät, kustannukset ja ympäristötiedot.
7. **Yhteenveto ja jatkopäätös:** laske kattavuus ja vertailuerot, arvioi lähteiden jäljitettävyys, käyttöoikeudet, kustannukset, käytettävyys ja riippuvuus palvelusta. Tee suositus: ei käyttöä, rajattu käyttö tai erillinen hankinta-arvio.

## Havaintorivi

Kopioi tarvittaessa yksityiseen työmuistioon: `Päivä | ominaisuus | resepti-ID/hakutermi | onnistui/puuttui/estyi | tietuelähde ja versio | ero tai huomio | käyttöoikeus/kustannus | jatkotoimi`.

Repossa säilytetään vain sopimuksen ja tietokantalisenssien sallima yhteenvedon tasoinen tulos. Älä lisää Nutriticsin API-vastauksia, näytönkaappauksia, tuotteiden kokonaistaulukkoja tai yksityisen tilin tunnisteita.

## Nutriticsille lähetettävä viestiluonnos

Älä lähetä ilman käyttäjän erillistä pyyntöä.

> **Subject: Seven-day trial and API access for a Finnish recipe project**
>
> Hello Nutritics team,
>
> We are preparing a seven-day evaluation for a public Finnish recipe website with approximately 325 recipes. Before activating the trial, could you please confirm:
>
> 1. Whether the Food Data API and an API sandbox are included in the seven-day trial, and which endpoints and request limits are available.
> 2. Whether the Finnish food database includes THL Fineli, and whether food records expose source identifiers, release/version, nutrient definitions and preparation states.
> 3. Whether GI and glycaemic-load data are included, with source citations, measurement method, scale and recipe-level calculation details.
> 4. Whether recipe analyses, food records, nutrient results and derived per-serving values may be stored, shown on a public website, and retained after the subscription ends.
> 5. Whether API responses may be cached, what attribution is required, and whether data may be combined with our locally licensed Fineli Release 20 data (CC BY 4.0).
> 6. The price for API access, database access, API calls, integration support and any optional modules after the trial.
>
> Please also share the current API-key authentication format and any technical documentation that supersedes legacy username/password examples in the API Explorer.
>
> Kind regards,
> Reseptit project

## Päivä 1: täsmällinen aloituslista

1. Tarkista kokeilun jäljellä olevat päivät ja päättymispäivä.
2. Avaa moduulivalikko ja merkitse, mitkä ominaisuudet oikeasti näkyvät kyseisellä tilillä.
3. Avaa tietokanta-asetukset ja tallenna näkyvien tietokantojen nimet ja alueet (ei ruokatietueiden massalatausta).
4. Tarkista API-/integraatiovalikko: onko API-avain luotavissa, mitä oikeuksia ja vanhenemisaikaa valitaan sekä näkyykö sandbox.
5. Älä luo tai kopioi API-avainta repo- tai yhteiseen muistiinpanoon. Älä kutsu API:a ennen sallittujen toimintojen ja tunnistautumismuodon vahvistusta.
6. Täytä ominaisuusmatriisin UI-sarake A- tai D-merkinnällä ja lisää havaintopäivä.
