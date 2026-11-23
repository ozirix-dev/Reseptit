# Perinteinen silakkalaatikko — lähde- ja turvallisuustarkistus 21.11.2026

Tila: DRAFT. Ei omaa kokkivarmistusta tai julkaisuhyväksyntää.

- Vertailuohje: https://www.martat.fi/reseptit/silakkalaatikko/
- Ajantasainen silakan käytön rajoitus (päivitetty 2.1.2025): https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/kala/
- Oma resepti: 6 annosta, peruna 900 g, ruodottomat silakkafileet 350 g, pekoni 150 g, maito 500 g, 2 kananmunaa. Uuni 175 °C 80–90 min, kypsyys varmistetaan.
- Huomio: Ruokaviraston uudemman suosituksen mukaan iso, perkaamattomana yli 19 cm silakka kuuluu alle kouluikäisten ja hedelmällisessä iässä olevien naisten erityissuosituksiin, enintään kerran kahdessa kuukaudessa. Vanhentunutta 17 cm / 1–2 kertaa kuussa -ohjetta ei käytetä.
- Allergeenit: kala, maito, kananmuna; sisältää myös sianlihaa (pekoni).
- Neljä luonnoskieltä FI/EN/SV/TH ja AI-kuva 960 × 746.
- Ravintoarvojen/GK:n puute ilmoitettu, ei nollia, ei gluteenittomuusväitettä.
- Julkaisuportti: toimituksellinen ja turvallisuustarkastus, käännösten merkitystarkastus ja rekisteröinti, kuva-arvio, mahdollinen ravintolaskenta, CI, statusmuutos ja hyväksynnät.

## Riippumaton lähde- ja turvallisuusvertailu, 21.11.2026 (kirjallinen)

- Marttojen silakkalaatikko: https://www.martat.fi/reseptit/silakkalaatikko/. Marttojen ravintolaskennassa käytetään noin 750 g perunaa, 300 g silakkafileitä, noin 175 g siankylkeä sekä 500 ml maitoa ja 2 munaa. Recipavossa on 900 g perunaa, 350 g silakkafileitä ja 150 g pekonia mutta sama 500 g maitoa ja 2 munaa. Tämä on oma muunnelma, joten Marttojen ravintoarvoja ei kopioida.
- Ruokaviraston 2.1.2025 päivitetty ohje: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/kala/. Alle kouluikäiset sekä hedelmällisessä iässä olevat naiset (mukaan lukien raskaana olevat ja imettävät) voivat syödä isoa yli 19 cm:n perkaamatonta Itämeren silakkaa **kerran kahdessa kuukaudessa**. Tämä suositus koskee nimenomaan suurta silakkaa ja mainittuja ryhmiä, ei kaikkien silakkafileiden yleistä käyttökieltoa.
- Tämän muunnelman turvallisuustarkistus: kalafileiden ruodot tarkistetaan, kala ja muna kypsennetään kauttaaltaan, ja vuoan keskiosan hyytyminen varmistetaan. Allergeenit: kala, muna ja maito; pekoni sisältää sianlihaa, jonka tuotekohtaiset allergiatiedot tarkistettava.
- Neljän kielen määrä-/yksikkö-/vaihelukema ja kuvaosoitteet täsmäsivät rakenteellisesti; todellinen kokkaustesti, sanallinen merkitysvertailu ja ravintolaskenta ovat edelleen avoinna.
- **HOLD:** uunin 175 °C / 80–90 minuutin ja 3 litran vuoan soveltuvuus tälle määrälle vahvistettava ennen julkaisua. Julkaisuportti `decision: hold` säilyy. Cloudflare-julkaisu ei kuulu PR:n toimenpiteisiin.

## Chat-3:n kala-, turvallisuus- ja lähdekatselmointi 22.11.2026

[Ruokaviraston kalankäyttösuosituksessa](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/kala/) suurikokoiselle Itämeren silakalle on erityinen rajoitus: **perkaamattomana yli 19 cm** silakkaa enintään kerran kahdessa kuukaudessa alle kouluikäisille ja hedelmällisessä iässä oleville naisille, raskaana olevat ja imettävät mukaan lukien. Tämä ei tarkoita kaikkien silakkafileiden yleistä käyttökieltoa. Kalan alkuperä ja mahdollinen alkuperäinen kokoluokka selvitetään pakkausmerkinnästä tai myyjältä. Marttojen [silakkalaatikko](https://www.martat.fi/reseptit/silakkalaatikko/) käyttää samaa peruna–silakka–siankylki–munamaito-rakennetta, mutta Recipavon pekoni, määrät ja vehnäjauhon puuttuminen ovat oma sovitus.

Neljässä kielessä ainesosien määrä ja vaiheistus täsmäävät: 350g silakkaa, 900g perunaa, 150g pekonia, **500g 1,5 % kevytmaitoa** ja 2 kananmunaa; ruotojen tarkistus, 175°C 80–90min, kala kauttaaltaan kypsä, munamaito hyytynyt, 10min lepo. Ylijäämä jäähdytetään nopeasti matalissa astioissa ja säilytetään alle +6°C. Punnittuja aineksia 2031g + kaksi kananmunaa; kananmunien syötävä massa arvio ei ole fyysisesti punnittu. Fyysinen valmistus/uunin riittävyys ei ole mitattu.

Rajatut katselmointitilat: duplicates, ingredients, method, food_safety ja servings_and_time `pass`, glycemic `unavailable`, **nutrition `pending`** ja `decision: hold`. Kalan täsmäalkuperä, pekonin ravintokoostumus ja riippumattomat kuva-/kieli-/julkaisuhyväksynnät edelleen avoimet.

## Chat-3: ravintokandidaatin aritmetiikan lisätarkistus 22.11.2026

- Laskennan lähtö: `docs/nutrition/candidates/silakkalaatikko-2026-11-21.json`, reseptikohtainen ei-julkinen kandidaatti. Laskin uudelleen tiedostossa numeerisesti katettujen rivien 100 g -arvot × grammamäärät ja kaikkien kirjattujen panosten annoskohtaiset osasummat.
- **Rivilaskuissa ei ole yli 0,0011 g poikkeamia** lähdearvojen ja kirjattujen rivipanosten välillä. Tiedoston tunnettujen rivien osasummat: hiilihydraatit 28,176 g, proteiini 20,850 g ja rasva 17,800 g. Nämä luvut ovat **ehdollisia osasummia**, eivät koko reseptin ravintoarvot tai julkaisuhyväksyntä.
- Lähdekattavuus: numeerisesti kirjattuja panoksia 10/11 ainesrivillä. **Avoimet todisteet:** 0,5 g maustepippurille puuttuu varmennettu koostumustietue. Valkopippurin kuitu- ja polyolitiedot puuttuvat; pekonin tuote, kalan ravintoprofiili sekä kahden kananmunan massaoletus vaativat vahvistuksen.
- Kuitu- ja polyolisummia ei julkaista: tunnetut kuitupanokset 2,370 g/annos ja polyolipanokset 0 g eivät ole kaikkien ainesosien summia.
- **Jatko:** varmennetaan yksilöidyt koostumustietueet/tuotepakkaukset, puuttuvat makrokomponentit sekä tarpeellinen saanto-/retentiokäsittely ja teetetään hyväksyttävä koko reseptin laskenta. `nutrition: pending`, `decision: hold`, Draft-status sekä riippumaton kuva- ja kielikatselmointi säilyvät. Tässä tarkistettiin vain tallennetun aritmetiikan sisäinen yhtäpitävyys, ei koostumustietokannan ulkoista oikeellisuutta.
