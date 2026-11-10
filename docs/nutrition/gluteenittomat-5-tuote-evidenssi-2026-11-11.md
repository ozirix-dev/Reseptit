# Gluteenittomat 5 — tuotevalintojen evidenssi 11.11.2026

**Dokumentin tila:** reseptikohtaisen laskennan ja keliakiaturvallisuuden valmistelupaketti. Reseptit pysyvät `draft` eikä niihin liitetä `gluten_free: true`-merkintää tällä muistiolla. Tarkastaja: ChatGPT, julkiset valmistaja- ja myymälätiedot; **ei käytettyjen pakkausten fyysistä tarkistusta**.

## Tunnistettavat tuotteet ja lähteet

| Käyttö | Tuote ja tunniste | Saatavilla oleva näyttö | Päätös |
| --- | --- | --- | --- |
| Durrapizza, 3 dl | Virtasalmen Viljatuote Gluteeniton Durrajauhoseos 500 g, EAN 6430041081623, FI-004-049 | 70 % durrajauhoa, perunajauhoa, tapiokatärkkelystä, psylliumia; 1 dl noin 65 g; 100 g: hiilihydraatit 70,6 g, proteiini 7,4 g, rasva 2,6 g. [Valmistaja](https://www.virtasalmenviljatuote.fi/tuote/gluteeniton-durrajauhoseos-500g/) | TUOTETIETO VALITTU, muun käytetyn annoksen ainesosat ja pakkaus tarkistamatta. Älä sekoita vanhojen tietokantojen 68,5 g hiilihydraattiarvoon. |
| Kauralesesämpylät, 2 dl | Myllärin Gluteeniton Kauralese 450 g, EAN 6415000164739 | [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/myllarin-kauralese-450g-gluteeniton-6415000164739): gluteeniton alle 20 mg/kg, ravinto 100 g: C 48 g, P 18 g, R 7,7 g. | SOPIVA EHDOKAS; tilavuuspaino, muut tuotteet ja pakkaus varmistettava. |
| Kakkupohjan leivinjauhe, 1 tl | Meira Leivinjauhe 50 g, EAN 6414200210055 | [Valmistaja](https://meira.fi/tuote/leivinjauhe/): nostatusaineet E450i/E500, E330 ja maissitärkkelys; [jälleenmyyjä](https://www.s-kaupat.fi/tuote/meira-leivinjauhe-50g/6414200210055) ilmoittaa ravinto-C 17,6 g / 100 g. | SOPIVA EHDOKAS; gluteenittomuus tarkistettava käytetystä pakkauksesta. |
| Pannukakun tumma jauhoseos | Ei vielä lukittu | Eri valmistajien gluteenittomilla seoksilla on eri hiilihydraatit ja tilavuuspainot; valmistetietojen vaihtelu voi muuttaa taikinan rakennetta | HOLD. |
| Vuokaleivän vaalea/tumma jauhoseos | Ei vielä lukittu | Tuotemerkkejä tai alkuperäisiä tilavuuspainoja ei määritelty, joten kokonaismakroja ei voi laskea tarkasti | HOLD. |
| Kaurahiutaleet, kaurajauho, perunakuitu, psyllium, hiiva | Ei kaikilta osin lukittu | Gluteenittomuus pitää todentaa erikseen, erityisesti kauratuotteissa | HOLD. |
| Tomaatin, mozzarellan, marjojen, kerman ja tomusokerin lisäosat | Määrät kirjattu, merkit avoinna | Määrät ovat omia toimituksellisia valintoja; kaikki otetaan myöhempään makrolaskentaan | HOLD. |

## Kriittinen allergiarajaus

**Gluteeniton ≠ vehnätön.** Esimerkiksi [Sunnuntain tumma gluteeniton jauhoseos](https://www.s-kaupat.fi/tuote/sunnuntai-1kg-tumma-gluteeniton-jauhoseos/6416597416423) sisältää gluteenitonta **vehnätärkkelystä** ja sen allergeeneissa lukee vehnä. Samoin [Pirkka vaalea gluteeniton jauhoseos](https://www.k-ruoka.fi/kauppa/tuote/pirkka-1kg-gluteeniton-jauhoseos-6410405071064). Näitä ei pidä automaattisesti esittää vehnäallergiselle sopiviksi, vaikka tuote olisi keliakiaruokavalion mukainen.

**Älä käytä tavallista Elovena-kauralesettä vastineena Myllärin gluteenittomalle tuotteelle.** [Elovenan kauraleseen](https://elovena.fi/tuotteet/elovena-kauralese/) tiedoissa lukee, että se saattaa sisältää muita viljoja. Myllärin erikseen gluteenittomaksi merkitystä tuotteesta on saatavilla vahvempi lähdenäyttö.

## Ravintoarvojen laskentamenetelmä

- Laskenta tehdään koko reseptin kaikista rakenteisista aineksista, ei vain otsikon pääraaka-aineesta.
- Kunkin määrän tilavuuspaino lukitaan valmistajan omasta tiedosta tai erillisestä luotettavasta lähteestä. 2 dl kauralesettä tai jauhoseosta ei muuteta 200 grammaksi ilman näyttöä.
- EU-pakkauksen hiilihydraatit ovat imeytyviä; kuitua ei vähennetä niistä toiseen kertaan. `carbs_total_per_serving_g` vaatii erillisen johdonmukaisen määritelmän.
- Merkitse energian, hiilihydraatin, proteiinin ja rasvan laskennan oletukset, annosmäärä, valmistushävikki sekä käytetyn pakkauksen ajankohta.
- Koska toimivaa kokonaislaskentaa ei ole vielä, nykyiset neljä makrokenttää ovat `null`. **Ei GK-arvoa eikä gluteenittomuushyväksyntää lähdemuistion perusteella.**

Normitausta: [Ruokavirasto – gluteeniton enintään 20 mg/kg](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/gluteenittomat-ja-erittain-vahagluteeniset-elintarvikkeet/).

## Työjonon päätös

Jatka ensin kolmeen helpoimpaan (kakkupohja, pannukakku, pizza) lukitsemalla puuttuvat jauhot, hiiva, jogurtti, maito ja täytteiden tuotemerkit. Vuokaleipä ja kauralesesämpylät tarvitsevat erityisesti jauho- ja kuitutuotteen sitovuustarkistusta. **Tämä on tietopohjan valmistelu, ei fyysinen koeleivonta.**
