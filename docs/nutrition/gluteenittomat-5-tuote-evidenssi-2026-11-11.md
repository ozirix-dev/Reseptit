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

## Kakkupohjan ensimmäinen laskentahyväksyntä — arviot, 11.11.2026

**Resepti:** `gluteeniton-perunajauhokakkupohja`. **Lähdeversio:** PR #422, alkuperäinen [Keliakialiiton 4 ainesosan ohje](https://www.keliakialiitto.fi/ruoka/reseptit/taytekakku-tai-kaaretorttupohja/). Annostus 10 yhtä suurta palaa. Vain **pohja**; ei täytteitä/kuorrutusta. Fyysistä koeleivontaa tai käytettyjen pakkausten laboratoriotarkistusta ei ole tehty.

| Ainesosa | Määrä | Käytetty paino | Hiilihydraatti / proteiini / rasva per 100 g | Lähde |
| --- | --- | --- | --- | --- |
| Kananmuna ilman kuorta | 4 kpl | 200 g (oletus 50 g syötävää sisältöä/kpl) | 0,3 / 12,6 / 9,2 g | [Fineli-tietueen toisinto](https://www.kilokalori.net/ravinto/yleinen/kananmuna-kuoreton) |
| Dansukker Taloussokeri | 1,5 dl | 132 g (88 g/dl) | 100 / 0 / 0 g | [Dansukker valmistaja](https://www.dansukker.fi/fi/tuotteet/kaikki-tuotteet/suomalainen-taloussokeri) |
| Finnamyl Helmi perunajauho | 1,5 dl | 105 g (70 g/dl) | 82 / 0,1 / 0 g | [Finnamyl valmistaja](https://finnamyl.fi/tuotteet/perunajauhot-kuluttajille/) ja [EAN 6430024961201](https://www.s-kaupat.fi/tuote/finnamyl-helmi-perunajauho-500g/6430024961201) |
| Meira leivinjauhe 50 g | 1 tl | 4 g (arvioitu paino, ei punnittu) | 17,6 / 0 / 0,1 g | [Meira](https://meira.fi/tuote/leivinjauhe/) ja [pakkaustiedot](https://www.s-kaupat.fi/tuote/meira-leivinjauhe-50g/6414200210055) |

Laskenta kullekin aineelle: raakapaino × tuotteen ravintoarvo / 100 g. Yhteensä koko kakussa **219,404 g imeytyvää hiilihydraattia, 25,305 g proteiinia ja 18,404 g rasvaa**, jaettuna 10 annokseen. Metatietoon pyöristetty: **21,94 g C**, **2,53 g P**, **1,84 g R** per pala. Energian raaka-ainepohjainen laskennallinen suuntaa-antava arvo **noin 115 kcal/pala**, perustuen ilmoitettuihin 100 g:n kilokaloreihin.

**Epävarmuudet:** munien koko, 1 tl leivinjauheen paino, leivinpaperin käyttö ja valitun perunajauho-/sokeripakkauksen erä. Paiston veden haihtuminen muuttaa valmiin palan painoa mutta ei yksin muuta koko taikinan imeytyvien hiilihydraattien massaa. EU-pakkauksesta hiilihydraattia ei vähennetä kuitua uudelleen. `carbs_total_per_serving_g` on edelleen `null` – eri määritelmän mukaista kokonaishiilihydraattia ei ole laskettu. **GK ei laskettu eikä luokiteltu; 21,94 g hiilihydraattia ei itsessään riitä GK-luvuksi.**

**Katselmointipäätös:** makrotietojen *laskentaperusta ehdollisesti hyväksyttävissä*, mutta resepti pysyy `draft` ja gluteenittomuuden tuotekohtainen/pakkaustarkistus sekä kuvan GitHub-siirto estävät edelleen julkaisun. Tätä laskelmaa ei saa siirtää muihin neljään reseptiin.
