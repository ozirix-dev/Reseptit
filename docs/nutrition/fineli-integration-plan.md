# Fineli-integraation suunnitelma

## Tavoite

Hyödynnä Fineliä reseptien ainesosakohtaisten ravintoarvotietojen lähteenä ja
toimituksellisen laskentapohjan apuna. Fineli-arvo ei yksinään vahvista
reseptin ravintoarvoja: raaka-aineen täsmällinen vastaavuus, määrä, syötävä
osuus, valmistus ja annoskoko pitää pystyä perustelemaan.

## Varmennettu toiminta ja rajat

- Finelin avoimen datan dokumentaatio tarjoaa ravintotekijöiden, hakusanan
  mukaisten ruoka-aineiden ja yksittäisen ruoka-aineen rajapinnat JSON-muodossa.
- Hakupäätepiste `/fineli/api/v1/foods?q=omena` toimii tavallisessa selaimessa:
  käyttäjän 24.10.2026 toimittama kuvakaappaus näyttää JSON-vastauksen, jossa
  on sekä `FOOD`-raaka-aineita että `DISH`-valmisruokia.
- Tietueen haku ID:llä ja komponenttilista palautuivat tämän tarkistuksen
  verkkotyökaluissa. Paikallisen komentorivin suora hakupyyntö sai 403:n;
  tämä ei kuvaa käyttäjän selaimessa toimivaa hakua.
- Kuvakaappaus todentaa navigoinnin API-osoitteeseen, ei selaimen JavaScriptin
  `fetch`-pyyntöjen CORS-oikeutta tai käyttöä GitHub Pages -alkuperästä. Ne on
  tarkistettava selaimessa ennen kuin selainpohjainen Fineli-haku otetaan
  käyttöön.
- Fineli kertoo, että rajapinta voi muuttua. Dokumentaatio edellyttää THL:n ja
  Finelin nimeämistä, eikä palvelua saa esittää THL:n tuottamana tai
  suosittelemana. Tarkista lisenssi- ja attribuutioteksti alkuperäisestä
  lähteestä ennen jokaista laajempaa käyttöönottoa.

Lähteet: [Finelin avoin data](https://fineli.fi/fineli/fi/avoin-data),
[hakupäätepiste](https://fineli.fi/fineli/api/v1/foods?q=omena) ja
[Finelin rajapintadokumentaatio](https://fineli.fi/fineli/swagger-ui/index.html#/).

## Sopiva paikka tässä repossa

Reseptisivusto on staattisesti julkaistava React/Vite-sivusto. Nykyinen
ravintoarvoprosessi on toimituksellinen paikallinen työkalu:

- `docs/nutrition/food-records.json` sisältää valitun, pienen lähdeotoksen.
- `site/scripts/nutrition-model.ts` laskee vain riittävästi perustelluista
  ainesosista ja säilyttää lähde- ja laskentatiedot. Fineli-komponenttiarvot
  kohdistetaan koodeilla CHO/FIBT/POLYL sekä niiden ID-tunnisteilla.
- `site/scripts/nutrition-audit.ts` tuottaa tarkistusraportin. Se ei tällä
  hetkellä päivitä reseptien metatietoja eikä julkista Fineli-hakua.
- `site/src/features/recipes/RecipePage.tsx` näyttää reseptin valmiiksi
  tallennetut arvot; vierailijoille ei ole ainesmuokkainta.

Siksi ensimmäinen Fineli-ominaisuus kuuluu **toimitukselliseen laskentatyöhön**:
Fineli auttaa löytämään ja tunnistamaan ruoka-ainetietueen, minkä jälkeen
toimittaja hyväksyy lähteen ja kirjaa sen laskentatietueeseen. Julkinen
reseptisivu jatkaa vain erikseen tarkistettujen reseptiarvojen näyttämistä.

## Käyttöpolku

1. Toimittaja hakee ruoka-ainetta suomenkielisellä nimellä. Tuloksissa
   erotellaan raaka-aineet ja valmiit ruoat. Ehdotus näyttää nimen, tunnisteen,
   valmistustavan ja saatavilla olevat annosmitat. Hakutulos ei valikoidu
   automaattisesti.
2. Toimittaja valitsee nimenomaan reseptissä käytettyä ruokaa ja tilaa vastaavan
   Fineli-tietueen. Kypsää tuotetta ei yhdistetä raakaan määrään eikä
   valmisruokaa sen ainesosiin.
3. Laskentatietueeseen tallennetaan Fineli-ID, lähde-URL, haku-/noutopäivä,
   tietueen nimi ja tila, laskennan ravintoarvot, yksikköperusta sekä
   hiilihydraattien lähdemääritelmä. Rajapinnan `data`-taulukon arvoja ei
   indeksoida arvauksella: komponentti-ID:t ja yksiköt ratkaistaan vastaavan
   `components`-metatiedon avulla. Jos suhde jää epäselväksi, arvoa ei käytetä.
   Hiilihydraattien lähteeksi tallennetaan Finelin CHO 2034 (imeytyvä
   hiilihydraatti), FIBT 2168 (kokonaisravintokuitu) ja POLYL 2260 (polyolit).
   Kokonaisarvo lasketaan kaavalla CHO + FIBT + POLYL; jos yksikin arvo puuttuu,
   kokonaishiilihydraatti jätetään tyhjäksi.
4. Ainesmäärät, grammamuunnos, syötävä osuus ja valmistuksen retentio
   dokumentoidaan nykyisen laskentamallin mukaisesti. Tuntematon arvo jää
   tuntemattomaksi; sitä ei käsitellä nollana eikä siitä tuoteta reseptisummaa.
5. Laskenta hyväksytään toimituksellisesti vasta, kun jokainen mukaan otettu
   ainesosa ja ravintotekijä on lähteistetty ja reseptin annosmäärä tarkistettu.
   Hyväksytyt arvot siirretään lähdereseptin nykyisiin
   per-annos-metatietokenttiin. Käännökset perivät samat arvot, eivät erillisiä
   uudelleenlaskentoja.

## Jatkuva ylläpito

- Käytä Fineliä tarvittaessa tehtävän haun ja tietueen tarkistuksen yhteydessä;
  älä hae kaikkia tietoja joka sivulatauksella äläkä kopioi koko tietokantaa.
- Säilytä aiempi lähdevedos ja sen noutopäivä. Kun Finelin tietue muuttuu,
  merkitse vaikutuksen alaiset laskelmat uudelleen tarkistettaviksi. Älä
  päivitä julkaistuja ravintoarvoja automaattisesti.
- Lisää myöhemmin pieni rajapinnan sopimustarkistus, joka varmistaa haun ja
  tietuehaun vastausrakenteen sekä tarvittavat ravintotekijät. Tarkistus saa
  ilmoittaa muutoksesta; se ei saa hiljaisesti kirjoittaa tuotantodataa.
- Jos selainhaun CORS-tarkistus onnistuu ja toimitukselliselle käyttöliittymälle
  on tarve, rakenna haun päälle erillinen paikallinen työkalunäkymä. Jos se ei
  onnistu tai rajapinta on epävakaa, käytä rajattua, lähteistettyä
  toimituksellista aineistopoimintaa. Julkinen sivusto pysyy toimivana myös
  Finelin ollessa poissa käytöstä.
- Näytä lähde- ja vastuuvapausmaininta siellä, missä Fineli-tietoja käytetään:
  “Lähde: Terveyden ja hyvinvoinnin laitos (THL), Fineli. Fineli ei tuota eikä
  suosittele tätä palvelua.” Varmista lopullinen sanamuoto Finelin voimassa
  olevista ehdoista.

## Toteutusvaiheet

1. Varmista selaimesta CORS `fetch` Finelin haku- ja ID-päätepisteisiin.
2. Määrittele ja tarkista Fineli-vastauksen kenttien ja komponenttien
   yhdistäminen nykyiseen `FoodRecord`-tietomalliin.
3. Lisää toimitukselliseen laskentaprosessiin ehdotushaku ja valitun tietueen
   lähteistetty tallennus; pidä valinta ihmisen hyväksymänä.
4. Kokeile yhdellä reseptillä, jolla määrät, tuotteen tila ja grammapainot
   voidaan todentaa. Vertaa laskennan tulosta nykyisiin arvoihin ja selvitä
   poikkeamat ennen laajennusta.
5. Laajenna hallitusti muihin resepteihin, kunnes kunkin arvon lähteet ja
   rajaukset voidaan auditoida. Näytä puutteelliset arvot edelleen puuttuvina.

Rajapinnan selaimessa todettu toiminta ei vielä tarkoita, että integraatio olisi
toteutettu tai CORS varmennettu. Tämä tiedosto kuvaa suunnitelman, ei
käyttöönotettua julkista Fineli-hakua. Ravintoarvoprosessissa käytetään nyt
rajaettua, version ja lähde-ID:iden kanssa tallennettua lähdeotosta:
`food-records.json` ja `nutrition-model.ts` laskevat kokonaishiilihydraatin
jatkossa samalla säännöllä, ja Recipes-sivun arvot tallentuvat lähdereseptin
metatietoihin. Fineli-tietueiden muutokset tarkistetaan toimituksellisesti
ennen metatietojen päivittämistä.
