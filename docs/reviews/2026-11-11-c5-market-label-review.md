# C5 – markkina-alueen tuote-etiketit ja kypsien papujen ravintoarvon vertailu

11.11.2026. **Ehdollinen lähde- ja tuotevertailu, ei julkaistujen makrojen muutos eikä GK-hyväksyntä.**

Tarkistuksessa löytyi olennainen epävarmuus aiemmin suunnitellun jianbing V2:n **Lee Kum Kee Soy Bean Sauce** -nimisen 240 g tuotteen aluekohtaisista merkinnöistä. Myös Suomessa myytyjen kypsien mustapapujen koostumusarvot eroavat toisistaan olennaisesti. Tästä syystä **ei** ole oikein syöttää yhtä internetistä saatua tuotearvoa reseptiin ilman käyttöpakkausta tai selkeästi lukittua markkina-/tuoteversiota.

## 1. Jianbingin kastike – kolme erilaista markkinamerkintää

| 240 g Lee Kum Kee Soy Bean Sauce -niminen tuote | Hiilihydraatit /100 g | Proteiini /100 g | Rasva /100 g | Ehdollinen HH /annos |
|---|---:|---:|---:|---:|
| EU-myyjä, A&A Asian Food Store | 22 g | 6,5 g | 5,2 g | **39,14 g** |
| Australia, Coles | 15,8 g | 7,8 g | 5,7 g | **38,67 g** |
| Hongkong, valmistajan verkkokauppa; 10 g annos skaalattu 100 grammaan | 16 g | 9 g | 6 g | **38,69 g** |

Tuotetietolähteet:
- EU: https://aashop.ee/en/products/lkk-soy-bean-sauce-240g
- Australia: https://www.coles.com.au/product/lee-kum-kee-soy-bean-sauce-240g-3631686
- Hongkong: https://shop.lkk.com/en/collections/basic-cooking-ingredients/products/soy-bean-sauce-240g
- Valmistajan Australian tuotetieto ja soija-/vehnäallergeenit: https://au.lkk.com/en/products/soy-bean-sauce

**Tulkinta:** erot voivat johtua tuoteformulaatiosta, markkinaversiosta, merkintätavasta tai annospyöristyksistä. Niitä ei saa yhdistää eikä väittää yhden pakkauksen mittausvaihteluksi. Taulukon ehdollinen jianbingin HH/annos on laskettu säilyttämällä aiemman ainekohtaisen laskelman muut syötteet ja korvaamalla 15 g tahnan hiilihydraattipitoisuus vain, jos hiilihydraattien määritelmät osoittautuvat yhteensopiviksi. Proteiini- ja rasvaehdot saadaan samalla menetelmällä, mutta **kuitu, polyolit, HH+kuitu sekä GK pysyvät määrittämättä**, koska tuote- ja hiilihydraattiperustan hyväksyntä puuttuu.

**Kriittinen huomautus:** Euroopassa myydyn tuotteen etiketti ei todista, että käyttäjä hankkisi juuri tätä formulointia. Vasta käytetyn pakkauksen EAN, tuoteteksti, ravintoarvomerkintä ja tarvittaessa valmistajan tuotetiedot mahdollistavat merkityksellisen hyväksynnän.

## 2. Huevos V2 – neljä kypsää mustapapusäilykettä Suomessa

Lähtömäärä jokaisessa vaihtoehdossa **150 g kypsiä, valutettuja mustapapuja kahteen annokseen**. Alla mainitut arvot ovat kauppojen ilmoittamia per 100 g -arvoja; sitä, lasketaanko kukin etiketti valmiista valutetusta syötävästä painosta vai pakkauksen myyntitilan 100 grammasta, ei ole vielä varmistettu. Siksi alla oleva laskenta on **vertailuskenaario, ei valmis ravintoarvo**.

| Esimerkkituote | HH /100 g | Ehdollinen papujen HH /annos | EAN |
|---|---:|---:|---|
| GoGreen 380/230 g | 8,5 g | **6,38 g** | 7310130009785 |
| Bonduelle 200/130 g | 13,1 g | **9,83 g** | 3083681132496 |
| Coop 390/230 g | 13 g | **9,75 g** | 7340191171664 |
| Menu 2500/1500 g | 15 g | **11,25 g** | 6410405172457 |

Lähteet:
- https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-ruotsal-7310130009785
- https://www.k-ruoka.fi/kauppa/tuote/bonduelle-mustapavut-200130g-3083681132496
- https://www.s-kaupat.fi/tuote/coop-mustapavut-suolaliemessa-390230-g/7340191171664
- https://www.k-ruoka.fi/kauppa/tuote/menu-mustapapu-suolaliemessa-25001500g-6410405172457

## 3. Vihreä salsa – löydetty tuotekohtainen esimerkkiehdokas

**La Costeña Salsa Verde 250 g**, EAN 7501017005925: hiilihydraatit **3,9 g**, proteiini **0,9 g**, rasva **0,9 g** / 100 g. Jos tähän valittaisiin 150 g, kastikkeen hiilihydraattiosuus olisi **2,93 g / annos** kahdelle. Tämäkään ei vielä todista käytetyn purkin koostumusta, kuitua tai polyoleja eikä tee koko huevos-reseptin makroja laskettaviksi.

Tuotelähde: https://www.k-ruoka.fi/kauppa/tuote/la-costena-salsa-250g-verde-7501017005925

Älä korvaa salsa verdea Suomessa yleisellä nimellä `salsa verde` löytyvällä yrtti-öljykastikkeella: se on koostumukseltaan eri ruoka kuin meksikolainen vihreä salsakastike.

## 4. Toteutettu laskentatarkistus

- `docs/reviews/2026-11-11-c5-market-label-variants.json` sisältää kolmen kastikemarkkinaversion, neljän kypsän paputuotteen ja yhden vihreän salsan lähde-URLit, hiilihydraatit ja tunnetut makroarvot. Tuotteen pakkausvarmennukset ja hyväksynnät ovat **false/null**.
- `site/scripts/c5-market-label-audit.ts` varmistaa jianbing V2:n, huevos V2:n ja aiemman jianbingin ainekohtaisen laskelman täsmä-Git-blobit. Vertaa ainesosakohtaista 15 g kastikemassaa alkuperäiseen laskentaan ja laskee vain rajatun, ehdollisen muutoksen; säilyttää kuidun ja polyolit tuntemattomina sekä erottaa kypsien papujen olomuodon ja koko ruoan laskennan.
- `site/tests/c5-market-label-audit.test.ts` suojaa numeeriset erot, lähdeidentiteetin muuttumattomuuden, viiden tuotetyypin vaihtoehdot ja julkaisun/GK:n estot.
- Komento: `cd site && npm run audit:c5-market-labels`.

**Yhteenveto: 0 uutta ravinto-/GK-hyväksyntää.** 0 uutta julkista reseptiä, 0 muokattua alkuperäisen FI-reseptin ravintoarvoa, 0 tuotepakkauksen fyysistä varmennusta. Seuraava hyväksyntään tarvittava todellinen tieto on valittu, ostettavissa oleva täsmällinen tuotemerkki ja etiketti, papujen *valutettu syötävä massa* ja varsinaisen ruoan tuotekohtaiset, vastaavat laskentasyötteet. Ei GK-arvon imputointia tuoteluokasta.
