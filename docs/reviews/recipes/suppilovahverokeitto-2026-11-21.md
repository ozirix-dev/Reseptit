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

## Chat-1:n nykyversion riippumaton sovittelukatsaus 23.11.2026

Tämä merkintä **ei muuta yllä olevia 21.–22.11. historiallisia HOLD-päätöksiä jälkikäteen**. Tarkistettu PR #788:n lähde-HEAD `9adb3f455a9c36ab22db2f11bedc57d75c83c068`, FI-lähteen SHA-256 `1c5eacafdd87050834afa42f9f2faf616fcc17bf9a58fd76d93908ea4510c534`. FI-frontmatterissa on jo `status: published` ja `docs/reviews/new-recipes/suppilovahverokeitto.json` kertoo nykyversion `decision: approved` sekä Chat-3:n käyttäjän valtuuttaman FI-first-arvion. Nämä ovat **myöhempiä ja eritasoisia merkintöjä** kuin alkuperäinen HOLD; eivät sama tapahtuma.

Chat-1 tarkisti nykyisen FI-tekstin ja EN/SV/TH-luonnosten tekstisisällön suoraan GitHubista. Kaikissa näkyvät sama 9 ainesosan määräsarja (300, 120, 25, 30, 800, 200, 2, 1, 10 g), 4 annosta, 45 min, `Craterellus tubaeformis` -lajin tunnistamisen vaatimus, sienikoristeen erottaminen vasta 10 minuutin liemihaudutuksen jälkeen, vehnä ja maito sekä ripeä jäähdytys ja alle +6 °C säilytys. Kirjallisessa tarkastuksessa ei havaittu ilmeistä turvallisuuden tai määrien P0/P1-poikkeamaa. Tämä ei ole fyysinen valmistuskoe eikä thaikielisen äidinkielisen asiantuntijan virallinen hyväksyntä.

**Rajattu FI-päätös:** viimeisimmän FI-tekstin kirjallinen turvallisuus- ja sisältökatselmointi ei itsessään estä *FI-first*-julkaisua **ilman numeerisia ravintoarvoja ja GK:ta**. Nykyisessä FI-lähteessä näitä numeroita ei ole; puuttuvan sieni-/liemikoostumuksen korvaaminen nollilla on edelleen kielletty. Aiempi ravintolaskennan HOLD jää voimaan **numeroiden julkaisemiselle**, ei väitteenä siitä, että numerot olisi laskettu. Kuva on hyväksytty SHA-lukittuna havainnekuvana PR #852:ssa; se ei ole lajintunnistuksen näyttö.

**Yhä ei hyväksytty:** EN/SV/TH-julkaisua ei avata pelkällä Chat-1:n tekstuaalisella vertailulla; niiden `status: draft` sekä virallisten merkitys-/SHA-hyväksyntöjen tarve säilyvät. Myös PR-haaran todellinen Ready/merge-portti edellyttää ajantasaisen main-synkronoinnin, rajatun muutostiedostolistan, uuden HEADin CI:n ja Repo Guardin. Tämä raportti ei myönnä merge- tai tuotantolupaa.
