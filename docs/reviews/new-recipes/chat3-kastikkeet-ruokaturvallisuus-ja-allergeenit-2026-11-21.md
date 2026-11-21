# Chat-3: kastikkeiden ruokaturvallisuuden ja allergeenien katselmointi

## AJANTASAINEN TÄYDENNYS 21.11.2026 – 10/10 rajattua turvallisuus-PASSia

**Tämä täydennys korvaa alla olevan aiemman 7 PASS / 3 PENDING -tilannekuvan.** Kolmen kastikkeen valmisliemi-, sinappi- ja soijatuotteet on nyt yksilöity ainesosatietoineen ja EAN-tunnuksineen. Repossa olevat FI/EN/SV/TH-ainesrivit ja lähdereseptin SHA-256 sekä ravinnon syöttötiivisteet on päivitetty. Tarkistus koskee vain nimettyjä tuotteita, ei niiden kaikkia mahdollisia korvaajia eikä ristisaastumisen laboratoriotestausta. Pakkausmerkinnät on tarkistettava myös valmistushetkellä.

| Aiemmin PENDING | Sidotut täsmätuotteet | Tunnetut ilmoitettavat ainesosa-allergeenit ja huomiot | Rajattu päätös |
| --- | --- | --- | --- |
| Ruskea kastike | Puljonki Signature Lihaliemi 1 l, EAN **6416796728013**; Kikkoman Naturally Brewed, valmistajan neljän ainesosan koostumus | **Maito, vehnä, soija**. Puljongin tuotelistassa ei luetella selleriä; vaihtoehtoinen liemi tarkistettava uudelleen | **PASS** näillä tuotteilla |
| Sinappikastike joulukinkulle | Puljonki Signature Kasvisliemi 1 l, EAN **7613287431745**; Turun Sinappia Mieto EAN **6411600954510**; Maille Dijon Kokojyväsinappi EAN **3036810207589** | **Maito, vehnä, sinappi**. Maille-kokojyväsinappi sisältää **sulfiitteja** valkoviinistä. Valmiin kastikkeen sulfiittipitoisuutta / EU-ilmoitusrajan ylittymistä ei ole analysoitu. Puljonki sisältää lipstikkaa ja fenkolia, ei lueteltua selleriä. | **PASS** näillä tuotteilla ja sulfiittihuomiolla |
| Kermainen pippurikastike | Puljonki Signature Lihaliemi 1 l EAN **6416796728013**; Maille Dijon Original EAN **8711200375684** | **Maito, sinappi**. Maille Dijon Original sisältää **sulfiitteja** (kaliumdisulfiitti). Valmiin kastikkeen sulfiittipitoisuutta ei ole mitattu. | **PASS** näillä tuotteilla ja sulfiittihuomiolla |

Valmistaja- ja tuotetietoviitteet: [Puljonki lihaliemi](https://www.oscarnordic.fi/puljonki-signature/367-signature-lihaliemi-1-l.html), [Puljonki kasvisliemi](https://www.oscarnordic.fi/puljonki-signature/386-1571-signature-kasvisliemi-1-l.html), [Kikkoman Naturally Brewed](https://www.kikkoman.eu/food-service/products/detail/kikkoman-naturally-brewed-soy-sauce), [Turun Sinappia Mieto](https://www.s-kaupat.fi/tuote/turun-sinappia-mieto-sinappi-275-g/6411600954510), [Maille Dijon Kokojyvä](https://www.s-kaupat.fi/tuote/maille-dijon-kokojyva-sinappi-210-g/3036810207589), [Maille Dijon Original](https://www.k-ruoka.fi/kauppa/tuote/maille-dijon-original-sinappi-1kg-8711200375684) sekä [Ruokaviraston allergeeniohje](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/allergeenit/).

**Muiden seitsemän kastikkeen aiemmat rajatut PASS-tulokset säilyvät. Kokonaisuudessaan 10/10 ruokaturvallisuustietueiden `checks.food_safety` on PASS, mutta kaikkien kymmenen `decision` on edelleen `hold`**. Ravintolaskennan lähdesidokset, käännösten lopullinen versiosidonnainen merkityskatselmointi, kuvien lopullinen toimituksellinen katselmointi ja GitHub/Repo Guard -julkaisuportit ovat kesken. Tämä tiedote EI ole julkaisuvaltuutus.

---

### Alla aiempi turvallisuuskatselmoinnin historiallinen tilanne ennen tuotekohtaista ratkaisua

**Päivä:** 2026-11-21
**PR:** #808
**Omistaja:** Chat 3
**Tarkistettu sisältö:** `a90de29dc71c9564c7c369dc38e77ce6a8c61dfe`
**Kokonaispäätös:** DRAFT / HOLD – ei julkaisu- eikä merge-hyväksyntää

## Katselmoinnin tulos

Kaikkien kymmenen kastikkeen FI-lähde ja EN/SV/TH-käännösten turvallisuus- ja säilytyshuomiot on täydennetty. Rajattu ruokaturvallisuuden kirjallinen katselmointi: **7 PASS ja 3 PENDING**. Tässä PASS tarkoittaa kuvattujen reseptikohtaisten vaarojen, ainesosien ja ohjeiden arviointia, EI tuotannon sertifiointia, fyysistä testikeittiökokeilua tai koko julkaisun lupaa. Tuotteiden koostumuksista riippuvia allergeeneja ei ole oletettu poissaoleviksi.

| FI-resepti | Tunnetut allergeenit ainesosista | Päätös | Keskeiset rajoitukset |
| --- | --- | --- | --- |
| perinteinen-ruskea-kastike | maito, vehnä, soija | **PENDING** | Lihaliemen ja soijakastikkeen valinta määrää mahdollisen sellerin, vehnän ja muut allergeenit; pakkausmerkinnät vahvistettava |
| kermainen-tillikastike | maito | **PASS** | Pestyn tillin käsittely ja kermaviilin kylmäsäilytys alle +6 °C |
| kantarellikastike | maito, vehnä | **PASS** | Vain varmasti tunnistetut syötävät kantarellit; AI-kuva EI kelpaa sienilajin tunnistamiseen |
| sinappikastike-joulukinkulle | maito, vehnä, sinappi | **PENDING** | Kasvisliemen mahdollinen selleri ja sinappivalmisteiden tuotekohtaiset allergeenit vahvistettava; tarjoilu kypsän kinkun kanssa |
| kylma-piparjuurikastike | maito | **PASS** | Puhtaat välineet, pestyt yrtit, puhdistettu tuore piparjuuri, alle +6 °C kylmäsäilytys |
| perinteinen-munakastike | muna, maito, vehnä | **PASS** | Käytä täysin kovaksi keitettyjä munia; kuumatarjoilu ja nopea ylijäämien jäähdytys |
| kermainen-pippurikastike | maito, sinappi | **PENDING** | Vähäsuolaisen valmiin lihaliemen ainesosat ja mahdollinen selleri vahvistettava |
| perinteinen-valkokastike | maito, vehnä | **PASS** | Kuumentaminen ja jauhoseoksen kypsentäminen, tarvittaessa kuumasäilytys yli +60 °C |
| puolukkakastike-jalkiruokiin | ei tunnettuja suoraan lisättyjä EU-allergeeneja | **PASS** | **Vain kotimaisista puolukoista**: tarkista myös pakasteen todellinen alkuperä. Jos käytettäisiin ulkomaisia pakastemarjoja, Ruokaviraston erillinen kuumennusohje on välttämätön |
| perinteinen-vaniljakastike | muna, maito | **PASS** | Keltuaiskastike kuumennetaan kauttaaltaan noin 82–85 °C:seen ja saostetaan; tarjoilu heti tai nopea jäähdytys alle +6 °C |

## Viranomaislähteet ja tulkinta

- Ruokavirasto, ilmoitettavat allergeenit (ml. maito, vehnä, soija, sinappi, muna, selleri): https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/allergeenit/
- Ruokavirasto, kotikeittiön säilytys, kuumana ja kylmänä tarjoilu, ylijäämien jäähdytys: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/lampotila/tietoa-elintarvikkeiden-sailytysajoista/
- Ruokavirasto, elintarvikkeiden turvallinen säilytys ja ruokamyrkytysten ehkäisy: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/
- Ruokavirasto, ulkomaiset pakastemarjat: **vähintään 90 °C viisi minuuttia tai kiehuen kaksi minuuttia**; Suomessa pakattu ei välttämättä tarkoita Suomessa kasvatettua: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ulkomaiset-pakastemarjat/

Kuumien kastikkeiden ylijäämien nopea jäähdyttäminen matalassa astiassa ja kylmäsäilytys alle +6 °C:ssa sekä kylmien maitokastikkeiden alle +6 °C säilytys kirjattiin FI/EN/SV/TH-teksteihin. Pitkässä kuumassa tarjoilussa valkokastike pidetään yli +60 °C. Kaikissa resepteissä annos- ja säilyvyysajat ovat ohjeita, ei laboratorio- tai säilyvyystestaukseen perustuvia päivämääriä.

## Muutosten tekninen eheys

- Päivitetty 10 FI-lähdettä ja 30 EN/SV/TH-käännöstä; kielitiedostot ovat edelleen `status: draft`.
- `docs/reviews/new-recipes/<id>.json`-tietueiden `checks.food_safety` päivitetty yllä mainittuihin PASS/PENDING-arvoihin, muut julkaisua estävät kentät edelleen ennallaan.
- Jokaisen 10 FI-lähteen koko SHA-256 vastaa katselmointitietuetta ja `docs/nutrition/candidates/chat3-suomalaiset-kastikkeet-2026-11-21.json`-tietuetta. Kaikkien 30 käännöksen uusi alle +6 °C -säilytysohje ja Draft-tila tarkistettu.
- Ainesosamääriä tai annosmääriä ei tässä kierroksessa muutettu; `recipeNutritionInputHash`-laskentasyötteet jäävät entisiksi.

## Avoimet julkaisuportit

1. Kolmelle **PENDING**-kastikkeelle: valittujen liemi-, sinappi- ja soijatuotteiden tai täsmällisen itse valmistetun liemen koostumus ja allergeenit ennen turvallisuuden loppukuittausta.
2. Kaikille kymmenelle: Fineli-/tuotetietoon sidottu ravintolaskenta ja kaikki pakolliset ravintoarvot tai projektin vaatima perusteltu hyväksytty julkaisutapa; numeerinen GK vain hyväksytyllä näytöllä.
3. Kaikille kolmekymmenelle EN/SV/TH-käännökselle: muutetun FI-lähteen ja turvallisuusohjeiden lopullinen merkitysvertailu sekä tarvittavat rekisterin tiivisteet, EI kuittausta pelkällä rakennetestillä.
4. Kuvat: teknisesti olemassa ja SHA-varmennettu, mutta kaikki lopulliset toimitukselliset kuvahyväksynnät vielä erikseen tarkistettava.
5. Uusimman HEADin CI + Repo Guard, Ready/merge ja Cloudflare tuotantojulkaisu vain hyväksyttyjen porttien jälkeen.

**Päätös:** tämä kierros on valmis ja dokumentoitu, **PR #808 pidetään Draft/HOLD-tilassa**.
