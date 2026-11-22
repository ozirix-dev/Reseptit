# Suppilovahverokeitto — julkaisun tarkistus 21.11.2026

- Tila: DRAFT, ei omaa kokkivarmistusta tai julkaisuhyväksyntää.
- Vertailulähde: https://www.martat.fi/reseptit/suppilovahverokeitto-2/
- Turvallisuus ja sienten tunnistus: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-tunnistaminen/
- Annostus: 4, tuoretta suppilovahveroa 300 g, sipulia 120 g, kasvislientä 800 g ja kermaa 200 g. Ei kuivattuja sieniä samassa määräsidonnassa.
- Ohje: nestettä poistetaan kuivalla pannulla; jauho kypsennetään liemessä; pinnalle tulee vain esikypsennettyä sientä.
- Allergeenit: maito, vehnä. EI gluteeniton-merkintää ilman tarkistusta.
- FI/EN/SV/TH käännösluonnokset, AI-kuva 960 x 746. Ravintoarvoja ja GK:ta ei laskettu.
- Seuraava portti: riippumaton merkityskatselmointi, turvallisuus, kuva ja CI, statusmuutos.

## Riippumaton lähde- ja turvallisuusvertailu, 21.11.2026 (kirjallinen)

- Marttojen suppilovahverokeiton vertailu: https://www.martat.fi/reseptit/suppilovahverokeitto-2/. Marttojen versiossa on 1 litra tuoreita sieniä, kasvisliemi, ruokakerma ja **100 g sulatejuustoa**. Recipavo on oma, erilainen muunnelma: 300 g tuoreita sieniä, 800 g kasvislientä, 200 g kermaa mutta **ei sulatejuustoa**. Marttojen ravintoarvoja ei voi käyttää tässä.
- Ruokaviraston ohje https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-tunnistaminen/ edellyttää kaikki tuntomerkit huomioivaa lajintunnistusta. Tuntematonta sientä ei käytetä. Tuoreiden sienten kuivalla pannulla haihdutuksen ja kypsennettävän jauhosuurusteen järjestys on lähdeohjeeseen verrattavissa.
- Allergeenit: maito ja vehnä; kasvisliemen mahdolliset muut allergeenit tarkistettava tuotteen pakkauksesta. Tämä on **kirjallinen** turvallisuusarvio, ei sienen tunnistustesti eikä koekeitto.
- Neljän kieliversion määrä-/yksikkö-/vaihelukema ja kuvaosoitteen rakenteellinen yhtenevyys on tarkistettu; lopullinen sanallinen merkitysvertailu sekä lajinkuvauksen ymmärrettävyys thaiksi puuttuvat.
- **HOLD:** fyysistä valmistusta tai ravintoarvolaskelmaa ei ole tehty; sienien määrästä ja kasvisliemen suolaisuudesta riippuva loppumaku tarkistettava. Virallinen hyväksyntä `decision: hold` säilytetään. Cloudflare-julkaisua ei tehdä.

## Chat 3:n lähde- ja turvallisuuskatselmointi 22.11.2026

Marttojen [suppilovahverokeitto](https://www.martat.fi/reseptit/suppilovahverokeitto-2/) tukee tuoreiden sienten kuumennusta, jauhojen sekoittamista, kasvisliemen lisäämistä ja kermaisen keiton soseutusta. Marttojen lähde sisältää myös sulatejuustoa ja eri sieni-/suurustemäärät, joten sen ravintoarvoja ei kopioida tähän itsenäiseen Recipavon muunnelmaan. **Tarkistus ei ole koekeittiökokeilu.**

Raaka-aineiden yhteenlaskettu massa **1488 g**, noin 372 g/annos ennen sienten ja liemen veden haihtumista. Suurin aineellinen epävarmuus on nimenomaan tuoreen suppilovahveron lajikohtainen koostumus ja tuotemerkitön kasvisliemi. [Ruokavirasto](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-tunnistaminen/) edellyttää kaikkien tuntomerkkien tunnistamista; reseptin AI-kuvalla ei voi varmentaa turvallista sienilajia. FI/EN/SV/TH on nyt täsmätty myös nopeaan jäähdytykseen matalissa astioissa ja alle +6 °C -kylmäsäilytykseen.

Rajattu katselmointipäätös: duplicates/ingredients/method/food_safety/servings_and_time `pass`, glycemic `unavailable`, **nutrition `pending`**, overall `decision: hold`. Loppuun jää riippumaton käännös-/kuvajulkaisun hyväksyntä ja ruokakohtaisen ravintoaineiston lähdesidonta.

## Chat-3: ravintokandidaatin aritmetiikan lisätarkistus 22.11.2026

- Laskennan lähtö: `docs/nutrition/candidates/suppilovahverokeitto-2026-11-21.json`, reseptikohtainen ei-julkinen kandidaatti. Laskin uudelleen tiedostossa numeerisesti katettujen rivien 100 g -arvot × grammamäärät ja kaikkien kirjattujen panosten annoskohtaiset osasummat.
- **Rivilaskuissa ei ole yli 0,0011 g poikkeamia** lähdearvojen ja kirjattujen rivipanosten välillä. Tiedoston tunnettujen rivien osasummat: hiilihydraatit 8,513 g, proteiini 2,7345 g ja rasva 12,7415 g. Nämä luvut ovat **ehdollisia osasummia**, eivät koko reseptin ravintoarvot tai julkaisuhyväksyntä.
- Lähdekattavuus: numeerisesti kirjattuja panoksia 7/9 ainesrivillä. **Avoimet todisteet:** 300 g tuoreen Craterellus tubaeformis -suppilovahveron lajikohtainen koostumus ja 800 g käytetyn kasvisliemen täsmällinen tuote/resepti puuttuvat. Mustapippurin kuidut ja polyolit ovat ilmoittamatta.
- Kuitujen ja polyolien täydellinen osasumma on tuntematon; rivitason tunnettujen panosten summa (kuitu 0,695 g/annos ja polyolit 0 g) ei ole koko ravintolaskelma.
- **Jatko:** varmennetaan yksilöidyt koostumustietueet/tuotepakkaukset, puuttuvat makrokomponentit sekä tarpeellinen saanto-/retentiokäsittely ja teetetään hyväksyttävä koko reseptin laskenta. `nutrition: pending`, `decision: hold`, Draft-status sekä riippumaton kuva- ja kielikatselmointi säilyvät. Tässä tarkistettiin vain tallennetun aritmetiikan sisäinen yhtäpitävyys, ei koostumustietokannan ulkoista oikeellisuutta.
