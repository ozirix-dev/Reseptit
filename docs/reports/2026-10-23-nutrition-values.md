# Ravintoarvojen laskennan toteutettavuus

Paiva: 23.10.2026, Europe/Helsinki.
Lahde-main: `e7fa5d9`.

## Tulos

Julkaistuja suomenkielisia lahderesepteja on 179. Ravintoauditoinnin mukaan
155 reseptilta puuttuvat kaikki nykyiset ravintokentat; 24:lla on joitakin
numeroita, mutta niiden laskentaketju ei ole todennettavissa. Inventaario
tuottaa 401 yksilollista ainesosanimiketta ja 80 maaratonta ainesrivia.

Ravintoarvoja ei lisatty. Kokonaisarvojen tayttaminen tassa tilanteessa
vaatisi mittaamattomien ainesten maarien, ainesvastaavuuksien,
tuotekoostumusten ja yksikkopainojen keksimista tai laajoja dokumentoimattomia
oletuksia. Se rikkoisi projektin ravintoarvojen nayttovaatimusta. Jo
annoskohtaisen lohipadan yksittaisen lohiosan laskenta ei aiemman pilotin
mukaan riita koko reseptin arvoiksi.

## Lahteiden saatavuus

- Finelin virallinen API ja avoimen datan latausosoite palauttivat
  Cloudflare HTTP 403 -eston komentorivilta ja Brave-selaimesta tassa
  ajossa. [Finelin avoin data](https://fineli.fi/fineli/fi/avoin-data)
  ilmoittaa API:n ja CSV-paketit seka CC BY 4.0 -attribuutiovaatimuksen.
- USDA FoodData Centralin virallinen Foundation Foods CSV (2026-04-30)
  latautui ja avautui paikallisesti. Se on mahdollinen vaihtoehtoinen
  laskentalahde, mutta ei yksin ratkaise suomalaisten reseptien
  ainesvastaavuuksia, annosmuunnoksia tai maarattomia riveja.
  [FoodData Central -aineistolataukset](https://fdc.nal.usda.gov/download-datasets/)

Finelin eston vuoksi vaihtoehtoisen aineiston valinta ei riita: jokaiselle
reseptille tarvitaan viela tarkastettavat tietuevastaavuudet ja riittavat
ainesmaarat. En tehnyt automaattista nimen perusteella tapahtuvaa fuzzy-
kohdistusta, koska virheellinen kala-, liha-, maitotuote- tai viljatuote
muuttaisi ilmoitettuja arvoja olennaisesti.

## Tarkistus

- `npm run audit:nutrition` laski 179 lahdereseptia: MISSING 155,
  INSUFFICIENT SOURCE DATA 24, VERIFIED 0 ja ESTIMATE WITH EVIDENCE 0.
- Tarkistuksessa laskettiin 401 uniikkia ainesosanimiketta ja 80 riviä,
  joiden `amount` on null.
- `git diff --check` lapi.
- Yksikko-, selain- tai tuotantotesteja ei ajettu, koska resepti- tai
  sovelluskoodia ei muutettu.

Reseptien ravintokentat sailyvat ennallaan. Seuraava kelvollinen laskenta
vaatii Finelin kaytettavissa olevan tietueaineiston tai valitun vaihtoehtoisen
aineiston seka reseptikohtaiset punnitukset ja yksilokohtaiset muunnokset.
