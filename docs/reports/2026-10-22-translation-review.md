# Käännösten oma tarkistus — 22.10.2026

## Laajuus

- 119 julkaistua suomenkielistä lähdereseptiä.
- 239 lisättyä kieliversiota: 80 englanniksi, 80 ruotsiksi ja 79 thaiksi.
- Julkaistuja käännöksiä on nyt 357 (119 reseptiä × EN/SV/TH). Neljä aiempaa keskeneräistä käännöstä, joiden suomenkieliset lähteet ovat luonnoksia, pidettiin luonnoksina.
- Kaikki 361 käännöstiedostoa läpäisivät metatietojen skeemavalidoinnin.

## Korjaukset

- Korjattiin kalafondin väärä käännös englanniksi ja ruotsiksi (`fish fondue` / `fiskfondue`) kalaliemitiivisteeksi tai kalafondiksi sekä samaa tarkoittavat selitetekstit.
- Korjattiin englannin `cognac noodles`- ja `brandy noodles` -virheet konjaknuudeleiksi myös kuvan vaihtoehtoteksteissä.
- Korjattiin voin, juustokuminan, hunajan, bulgurin, maustamattoman jogurtin ja osterivinokkaiden selvät käännösvirheet. Tarkennettiin thaikielisiä jauheliha- ja ruokayksikköilmauksia.
- Erotettiin täytettyjen paprikoiden tomaattimurska ja tomaattipyree EN/SV/TH-versioissa.
- Lisättiin puuttuvat `# `-välilyönnit 70 thaikielisen käännöstiedoston otsikoista.
- Lokalisointiin 13 reseptin aiemmin suomeksi jääneet yksiköt käännöskielille ja laajennettiin niiden vastaavuustarkistusta.
- Täydennettiin neljän aiemman luonnoksen puuttuvat rakenteiset ainesosat ja kauralastujen annosmäärä.
- Synkronoitiin lähdereseptien julkaistujen kielten metatiedot käännöstiedostojen kanssa.

## Tarkistustulokset

- `npx tsx scripts/translation-audit.ts --strict`: 119 lähdettä, 357 julkaistua käännöstä, 0 löydöstä.
- `npm test`: 21/21 läpäisi.
- `npm run test:translations`: 2/2 läpäisi.
- `npm run test:image`: 2/2 läpäisi.
- `npm run build`: onnistui; 476 julkaistua reseptiversiota sisältöaineistossa ja 480 prerenderöityä reittiä.
- `npm run test:static`: 6/6 läpäisi.
- `npm run test:browser`: selainvarmistus läpäisi.

## Avoin tarkistustarve

Automaattiset tarkistukset varmistavat rakenteen, määrät, yksiköt, kypsennystiedot ja joukon tunnettuja termivirheitä. Ne eivät todista jokaisen käännöksen luontevaa sanavalintaa tai kulttuurista täsmällisyyttä. Äidinkielisen tai muuten kieltä hyvin hallitsevan tarkistajan tekemä kielentarkistus on edelleen suositeltava. Käyttäjä pyysi käännökset julkaistaviksi, joten 239 käännöstä on merkitty julkaistuiksi tästä avoimesta kielentarkistuksesta huolimatta.

Jatkossa jokaisen käännöskierroksen oma tarkistus ja päivätty raportti tallennetaan käytännön mukaisesti tiedostoon [`docs/translation-review-policy.md`](../translation-review-policy.md).
