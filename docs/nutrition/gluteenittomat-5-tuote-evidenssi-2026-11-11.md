# Gluteenittomat 5 — tuotevalintojen evidenssi 11.11.2026

**Dokumentin tila:** reseptikohtaisen laskennan ja keliakiaturvallisuuden valmistelupaketti. Reseptit pysyvät `draft` eikä niihin liitetä `gluten_free: true`-merkintää tällä muistiolla. Tarkastaja: ChatGPT, julkiset valmistaja- ja myymälätiedot; **ei käytettyjen pakkausten fyysistä tarkistusta**.

## Alkuperäinen tuotetilanne ennen 11.11. jatkolaskentaa (historiallinen tilannekuva)

**Ajantasainen laskentapäätös on tämän dokumentin jäljempänä olevassa neljän reseptin lisäyksessä.** Alla oleva alkuperäinen taulukko kuvaa ennen jatkotarkistusta avoinna olleita tuotteita; osalle on sittemmin valittu tuotemerkit laskentaoletuksiksi. Pakkauksia ei edelleenkään ole tarkistettu fyysisesti.

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

**Katselmointipäätös:** makrotietojen *laskentaperusta ehdollisesti hyväksyttävissä*, mutta resepti pysyy `draft`; gluteenittomuuden tuotekohtainen/pakkaustarkistus estää edelleen julkaisun. Viisi erillistä, 1500 × 1000 WebP-piirroskuvitusta on myöhemmin lisätty PR #422 -haaraan ja liitetty luonnoksiin. Tätä laskelmaa ei saa siirtää muihin neljään reseptiin.

## Neljän jäljellä olevan reseptin suuntaa-antavat makrolaskelmat — 11.11.2026

**Tila:** LASKETTU TUOTE- JA PAINO-OLETUKSILLA / EI LOPULLINEN JULKAISUHYVÄKSYNTÄ. Fyysistä koeleivontaa, grammojen punnitusta tai yksittäisen ostetun pakkauksen analyysia ei ole tehty. Kaikki viisi reseptiä pysyvät `draft`-tilassa, `gluten_free`-väitettä ei hyväksytä tässä laskennassa.

### Valitut tuotteet ja lähdetiedot (imeytyvä C / proteiini P / rasva R, g / 100 g)
- **Pirkka vaalea gluteeniton jauhoseos 1 kg, EAN 6410405221858:** C 75 / P 5,3 / R 0,9. Tuote on gluteeniton ja vehnätön, mutta ei vaihdettavissa toiseen tuoteversioon automaattisesti. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/pirkka-vaalea-jauhoseos-1kg-gluteeniton-6410405221858).
- **Pirkka tumma gluteeniton jauhoseos 1 kg, EAN 6410405221872:** C 70 / P 7 / R 4,3. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/pirkka-tumma-jauhoseos-1kg-gluteeniton-6410405221872).
- **Myllärin gluteeniton kaurahiutale 500 g:** C 58 / P 14 / R 6,5. [Valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kaurahiutale-500-g/).
- **Myllärin gluteeniton kauralese 450 g, EAN 6415000164739:** C 48 / P 18 / R 7,7. [Valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kauralese-450-g/).
- **Myllärin gluteeniton kaurajauho 950 g, EAN 6415000163565:** C 58 / P 14 / R 6,5. [Valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kaurajauho-950-g/).
- **Schär Pofiber perunakuitu 125 g, EAN 8008698049129:** C 20 / P 5 / R 0,3. [S-kaupat](https://www.s-kaupat.fi/tuote/schar-pofiber-perunakuitujauhe-gluteeniton-125g/8008698049129). **Vastaavan Semper Pofiberin 1 dl ~17 g**; tämä on tuotekohtainen poikkeus eikä muiden perunakuitujen yleinen muunnos. [Tuotetieto](https://www.scandinavianonlinestore.com/fi/food/semper-pofiber-125-grams).
- **FiberHusk psyllium (gluteeniton):** C 0 / P 1,5 / R 0,6. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/fiber-husk-psylliumsiemenkuori-100g-jauh-7320880010146).
- **Sunnuntai kuivahiiva, EAN 6416597816049:** pussi 11 g, C 19 / P 44 / R 5,7. [Valmistaja](https://sunnuntai.fi/tuotteet/sunnuntai-kuivahiiva/).
- **Valio turkkilainen 10 % jogurtti:** C 4,1 / P 3,6 / R 10. [Valmistaja](https://www.valio.fi/tuotteet/valio-turkkilainen-ruokajogurtti-sanko/).
- **Virtasalmen gluteeniton durrajauhoseos:** C 70,6 / P 7,4 / R 2,6. [Valmistaja](https://www.virtasalmenviljatuote.fi/tuote/gluteeniton-durrajauhoseos-3kg/).
- **Hungry Chef pizzakastike, EAN 6426000005236:** C 7,8 / P 0,9 / R 2,9; **sisältää selleriä**. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/hungry-chef-pizzakastike-260g-6426000005236).
- **Lactalis mozzarella:** C 2 / P 17 / R 16. [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/mozzarella-125g-3228023050285).
- **Valio kevytmaito:** C 4,8 / P 3,4 / R 1,5. [Valio](https://www.valio.fi/tuotteet/valio-kevytmaito/).
- **Keiju juokseva rypsiöljyvalmiste, EAN 6438207019008:** C 0 / P 0 / R 80. [S-kaupat](https://www.s-kaupat.fi/tuote/keiju-juokseva-rypsioljyvalmiste-500-ml/6438207019008).
- Kasvisten, siemenien, marjojen ja lisämakeutuksen yksittäiset makrot ovat yleisten ravintotietokanta-arvojen pyöristettyjä oletuksia. Nämä ovat pienempi, mutta eivät nollaksi huomaamatta pois jätetty, osa kokonaislaskentaa.

### Raakapainot ja tulokset
| Resepti | Avainoletukset koko erässä | Annoksia | C / annos | P / annos | R / annos |
| --- | --- | ---: | ---: | ---: | ---: |
| `gluteeniton-siemenvuokaleipa` | 3,5 dl Pirkka vaaleaa = **210 g**, 3 dl Pirkka tummaa = **180 g** (molemmat 60 g/dl **yleismuunnoksena**, ei punnittu), 2 dl kauraa 70 g, pellava 20 g, auringonkukka 27 g, psyllium 8 g, kuivahiiva 11 g | 12 | **27,45 g** | **3,98 g** | **3,08 g** |
| `gluteenittomat-kauralesesampylat` | 2 dl Myllärin kauralese = 100 g, 2,5 dl Schär Pofiber = **42,5 g (17 g/dl)**, 2 dl tumma seos = 120 g arvio, 0,5 dl öljyä = 45 g, siirappi 1 rkl = 21 g, kaurahiutale pintaan 5,25 g, psyllium 4 g, kuivahiiva 11 g | 16 | **10,14 g** | **2,13 g** | **3,69 g** |
| `gluteeniton-durrapizzapohja` | Jogurtti 3,5 dl = 350 g, durrajauhoseos 3 dl = 195 g (65 g/dl), oliiviöljy taikinaan + paperille 4 rkl = 54 g, hiiva 10 g, leivinjauhe 3 tl = 12 g, kastike 150 g, mozzarella syötävä valutettu osa 200 g, tomaatit 120 g, basilika 10 g | 4 | **44,05 g** | **17,07 g** | **32,83 g** |
| `gluteeniton-uunipannukakku` | Kevytmaito 800 g, munat 150 g (50 g/kpl), Pirkka tumma 1,5 dl = 90 g (yleismuunnos), Myllärin kaurajauho 2 dl = 120 g (valmistajan 60 g/dl yleisohje), Keiju juokseva 1 dl = 90 g, marjat 200 g, kerma 100 g, tomusokeri 1 rkl ≈8,25 g | 13 | **15,13 g** | **5,63 g** | **11,19 g** |

**Laskukaava:** kullekin aineelle arvioitu syötävä raakapaino g × tuotteen C/P/R per 100 g / 100; kaikkien ainesosien makrot summataan ja jaetaan annoksilla. Annoksen koko ei vastaa mitattua paistopainoa. Suuntaa-antavat arvot tallennettiin metatietoihin, ja epävarmuudet reseptien muistiinpanoihin.

**Epävarmuus:** Pirkka-jauhoseosten 60 g/dl on **yleinen oletus eikä tuotemerkin dokumentoitu tilavuuspaino**, joten punnitut grammapainot voivat muuttaa erityisesti leipien ja pannukakun hiilihydraatteja useilla grammoilla/annos. Eri jauhomerkki voi myös muuttaa taikinan toimivuutta. Schär Pofiber 17 g/dl on varmempi tuotekohtainen muunnos. Pizzassa 4 rkl öljyä oletetaan syödyksi kokonaan, mikä saattaa yliarvioida rasvaa. Marjat ym. tuoreet tuotteet on oletettu yleisillä lähdearvoilla. Ei hyväksyttyä GK-laskelmaa, koska GI-vastaavuuksia ei ole lukittu. Gluteeniton-tuotteen valinta ja pakkaus pitää vielä tarkistaa käyttäjän käyttämästä pakkauksesta; arvio ei todista gluteenittomuutta tai vehnäallergiaturvallisuutta.

**Laatupäätös:** Nämä ovat julkaisemattomien FI-draftien *laskentaperustaa täydentäviä* arvioita. Tuote- ja määrätarkistus, yhden tuotteen vaihtokokeen toteutustekniikka, kuvien vastaavuuden lopullinen toimituksellinen hyväksyntä sekä gluteeniton-suodattimen PR #417 ovat edelleen lopullisen julkaisuportin osia.

## Kuvien toimitusstatus — 11.11.2026

PR #422:n haaraan on GitHub Actions -ajossa 42924356218 tallennettu **viisi uutta alkuperäistä WebP-piirroskuvitusta** (1500 × 1000 px) ja lisätty niiden polut kaikkiin viiteen FI-luonnokseen. Ne ovat SVG:stä Sharpilla tuotettuja yksinkertaisia ruoka-aiheisia kuvituksia, **eivät** keskustelussa aiemmin annetun `gluteenittomat_viisi_kuvaa.zip`-paketin photorealistiset kuvat. AI-/kuvitusmerkintä on yksiselitteinen alt-teksteissä. Kuvan lisääminen ei myönnä gluteenittomuuden tai ravintolaskennan turvallisuushyväksyntää.
