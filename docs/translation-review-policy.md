# Käännösten tarkistuskäytäntö

Jokaisen reseptikäännösten lisäys- tai korjauskierroksen yhteydessä tehdään oma tarkistus. Tarkistuksessa:

- verrataan käännöstä suomenkieliseen lähteeseen: ainesosien merkitys ja järjestys, määrät, yksiköt, annokset, kypsennystavat, valmistusajat ja numeeriset kypsennysarvot
- etsitään kirjaimellisia tai asiayhteyteen sopimattomia käännöksiä, väärin kääntyneitä erikoistermejä sekä kuvausten ja ainesosien ristiriitoja
- tarkistetaan otsikot, kuvan vaihtoehtotekstit, kielimerkinnät, julkaisu- ja luonnostilat sekä Markdown-rakenne
- validoidaan käännösten metatiedot ja suoritetaan projektin käännösauditointi
- tallennetaan päivätty raportti `docs/reports/`-hakemistoon, jossa kerrotaan laajuus, korjaukset, tarkistustulokset ja avoimet epävarmuudet

Automaattinen tarkistus ei yksinään todista käännöksen luontevuutta tai reseptin kulttuurista oikeellisuutta. Jos käännöstä ei ole tarkistanut kyseistä kieltä hyvin osaava ihminen, se merkitään raportissa tarkistamattomaksi ja pidetään luonnoksena, ellei käyttäjä erikseen pyydä julkaisemaan sitä.

## Tarkistuksen tilat

- `STRUCTURE PASS`: julkaistujen vastineiden metadata, määrä/yksikkörivit,
  työvaiheiden määrä ja tunnistetut numeeriset kypsennysarvot täsmäävät.
- `AUTOMATED SEMANTIC REVIEW`: tunnetut virhetermit ja reseptikohtaiset
  regressiot on tarkistettu. Kielimallin tekemä lähdevertailu raportoidaan
  erikseen tällä tasolla; se ei ole riippumaton ihmistarkistus.
- `HUMAN REVIEW PENDING`: kohdekielen osaajan arviota ei ole dokumentoitu.
- `HUMAN REVIEW COMPLETE`: vain nimetyn ihmistarkistuksen todisteella,
  päivämäärällä, tarkistetulla versiolla ja rajauksella.

Tilat eivät korvaa toisiaan. Rakenteellisesti eheä käännös voi sisältää väärän
ruoka-aineen, valmistusverbin tai kuvatekstin. Aiemmin käyttäjän pyynnöstä
julkaistuja käännöksiä ei merkitä ihmistarkistetuiksi eikä poisteta julkaisusta
automaattisesti tämän auditoinnin vuoksi.

## Ajantasainen inventaario

Suorita `site/`-hakemistossa:

```powershell
npx tsx scripts/translation-audit.ts --strict --write-reports
npm run test:translations
```

Tulokset ovat `docs/reports/translation-audit-current.csv` ja
`docs/reports/recipe-inventory-current.csv`. Komento ei kirjoita historiallisia
V1.3-raportteja uudelleen. Odotetut julkaistut kielet tulevat lähteen
`translation_status`- ja `translation_languages`-metadatasta. Uusi resepti
ei vaadi testien lukumäärävakion muuttamista. Luonnos ei ole julkaistu vastine.

## Sisältötarkistuksen järjestys

Vertaa ensin lähteen ja käännöksen ainesosat riveittäin. Tarkista sitten
valmistus, ingressi, kuvaus, muistiinpanot, otsikko ja alt-teksti. Tarkista
erityisesti eläin-/kasvilaji, raaka/kypsä, nestemäinen/vaahdotettu kerma,
rahka/raejuusto, liemi/fondi ja tuore/säilötty tuote. Kuvaa ei käytetä
perusteena muuttaa reseptin raaka-aineita.

Todettu P0/P1-virhe korjataan lähteen tai luotettavan ruokaohjeen avulla.
Epäselvä alkuperäinen ohje kirjataan päätettäväksi; puuttuvaa määrää,
lämpötilaa tai ravintoarvoa ei päätellä ulkonäöstä. Suppeat regressiosäännöt
eivät saa hylätä samoja sanoja oikein käyttävää toista reseptiä.

V1.4:n laajuus, korjaukset ja avoimet havainnot ovat
[sisältöraportissa](reports/2026-10-22-v1-4-content-quality.md).
