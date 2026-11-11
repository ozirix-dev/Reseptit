# Issue #404 – erä C: viiden reseptin ravintolaskennan riippumaton aritmetiikkatarkastus

**11.11.2026.** Tämä tarkistus on laskentamenetelmän riippumaton toisto jo talletetuista ravintolähdesyötteistä, **ei riippumaton tuote-/massa-/GI-hyväksyntä**. Alkuperäisiä Markdown-reseptejä, ainesmääriä, makroarvoja ja GK-historiaa ei ole muutettu.

## Tarkistuksen tulos

| #404 | Resepti | Laskenta-aineisto | Aritmetiikan tulos | Julkaisupäätös |
|---:|---|---|---|---|
| #02 | Bakwan-fritterit | `docs/nutrition/calculations/indonesialainen-bakwan-maissifritter.json` (AUTOMATED ONLY) | Neljä nykyistä makroarvoa täsmää tallennettujen syötteiden laskuun | Ravinto-/GK-HOLD |
| #21 | Maakouda-perunafritterit | Ei omaa aineskohtaista calculation-JSONia | **Lähdetiedostossa on numeeriset makrot ilman nykyistä aineskohtaista laskentatodistetta.** 1 kpl perunaa ei yksilöi syötävää massaa | Julkinen karanteeni, HOLD |
| #29 | Soba-aamiaiskeitto | Ei omaa aineskohtaista calculation-JSONia | Ei laskettavissa; pinaattinipun massa, liemituotteet ja soban tila puuttuvat | GK100 first-five -lähde-SHA ennallaan, HOLD |
| #31 | Jianbing-munalettu | `docs/nutrition/calculations/kiinalainen-jianbing-munaletty.json` (AUTOMATED ONLY) | Neljä nykyistä makroarvoa täsmää tallennettujen syötteiden laskuun | Ravinto-/GK-HOLD |
| #40 | Huevos divorciados | Ei omaa aineskohtaista calculation-JSONia | Ei laskettavissa; 150 g mustia papuja ei yksilöi kuivaa/kypsää massaa | Ravinto-/GK-HOLD |

### Todennetut laskukaavat – vain talletetuille syötteille

| Resep­ti | HH käytettävissä /annos | HH + kuitu /annos | Proteiini /annos | Rasva /annos |
|---|---:|---:|---:|---:|
| Bakwan | 45,19 g | 49,88 g | 7,89 g | 8,50 g |
| Jianbing | 38,96 g | 41,60 g | 14,79 g | 15,39 g |

Makrot saatiin summasta `sum(ainemassa_g × ravintotekijä_per_100g / 100) / annokset` kullekin ravintotekijälle; hiilihydraattien kokonaissumma on käytettävissä olevat hiilihydraatit + kuitu. **Tämä todistaa sisäisen aritmetiikan, ei sitä että lähde-/ainesosavastaavuus on biologisesti tai tuotekohtaisesti tarkka.**

## Herkkyystarkastelu, ei ehdotettu reseptimuutos

Bakwanin alkuperäinen automaattinen syöte käyttää 60 g syötävää porkkanaa yhdelle `1 kpl` -riville; tämä on *laskennan oletus*, ei todellinen punnittu porkkana. Talletetulla porkkanan koostumuksella (5,56 g käytettävissä olevia HH /100 g) seuraavat esimerkkimassat tuottaisivat:

| Porkkanan syötävä massa | Laskennallinen HH/annos | Muutos suhteessa 60 g malliin |
|---|---:|---:|
| 35 g | 44,50 g | −0,70 g |
| 60 g (talletettu malli) | 45,19 g | 0,00 g |
| 65 g | 45,33 g | +0,14 g |
| 100 g | 46,31 g | +1,11 g |

Jianbingin laskennassa **1 rkl soijapaputahnaa = 15 g**, mutta valmistajaa tai tuotetta ei ole yksilöity. Talletetulla yleisellä soijapaputahnan koostumuksella (19,7 g HH /100 g) eri annosmassat antaisivat:

| Tahnan massa | Laskennallinen HH/annos | Muutos 15 g malliin |
|---|---:|---:|
| 10 g | 38,47 g | −0,49 g |
| 15 g (talletettu malli) | 38,96 g | 0,00 g |
| 20 g | 39,46 g | +0,49 g |
| 30 g | 40,44 g | +1,48 g |

Myös *tuotekoostumuksen vaihtelu* voi muuttaa näitä arvoja; yllä olevat rivit eivät ole tuotekohtaisia ravintolukuja. Finelin dokumentaatio muistuttaa, että sen elintarvikeaineisto kuvaa keskimääräisiä elintarvikkeita ja yksittäisen tuotemerkin koostumus voi poiketa huomattavasti: https://fineli.fi/fineli/content/file/8 . Porkkanan talletettu Fineli #300 -koostumus on olemassa, mutta kappalepainon oletus ei korvaa punnitusta.

## Mitä on vielä korjattava?

1. **Bakwan:** valitaan aidosti käytettävä, punnittu porkkanan syötävä massa; varmistetaan öljyn retention oletus ja taikinan nestemäärä. Lasketaan ravintoarvot uudestaan riippumattomasti ennen hyväksyntää.
2. **Maakouda:** määritetään kuoritun perunan syötävä paino grammoina, mittaustapa ja sen valmiin aterian GK-syöte. Karanteenia ei pureta.
3. **Soba:** punnitaan syötävä pinaatti, määritetään dashi ja toinen liemi tuotteina, sekä soban raaka/kypsä massa. GK100 first-five -paketin vanhaa hyväksyttyä lähdettä ei kirjoiteta uusiksi.
4. **Jianbing:** yksilöidään soijapaputahna tuotteena, punnitaan oikea annos sekä varmistetaan kaikkien öljy-/jauhoperusteiden ravintoarvot. Vesi on valmistusneste, eikä sitä pidä käyttää GK:n nollattuna ainesosaproksina.
5. **Huevos divorciados:** selvitetään mustien papujen kypsän/kuivan massan ero ja vihreän salsan tuotekoostumus; tuodaan vasta sen jälkeen uusi ravintolaskenta.

## Toteutettu valvonta

`site/scripts/c-five-nutrition-recheck.ts` toistaa bakwanin ja jianbingin laskut suoraan nykyisistä aineskohtaisista JSON-syötteistä, tarkistaa makrojen vastaavuuden tämänhetkisiin kanonisiin FI-merkintöihin, tarkistaa viiden reseptin lähde-Git-blobit #442:n manifestia vasten ja raportoi kaikki viisi edelleen HOLDiin. Kolmesta muusta soban ja huevos divorciadosin makrojen tulee edelleen puuttua. Maakoudalle merkitään eksplisiittinen `NUMERIC_MACROS_WITHOUT_INGREDIENT_LEVEL_EVIDENCE` -estekoodi; se on jo julkisessa karanteenissa ja lähteen historiallisia lukuja **ei hyväksytä**. Yhdellekään reseptille ei luoda nollia tai laskenta-arvauksia.

`site/tests/c-five-nutrition-recheck.test.ts` suojaa laskennan tulokset, herkkyysparametrit ja sen, ettei tästä työstä synny GK-/ravintoarvohyväksyntää.

**Julkaisuraja:** Ei uusia GK-numeroita, ei korjattuja makroja julkaisuun, ei karanteenista vapautusta, ei käännösmuutoksia eikä Recipavo/Cloudflare-cutoveria. Viisi lähde-/ravintokorttia pysyvät HOLDissa. Testin CI PASS todistaa vain, että arviointi on versionmukainen ja aritmeettisesti toistettava.
