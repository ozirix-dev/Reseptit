# Chat-4: yleisiin viranomaisohjeisiin perustuva turvallinen reseptijulkaisu

Päiväys: 2026-11-21
Työn omistaja: Chat 4
Kohde: PR #805 ja sama toimintatapa myöhempiin Recipavon resepteihin.

## Oletustoimintatapa

1. Kirjoita reseptiin selkeä, tavalliselle kotikokille toteutuskelpoinen raaka-aine- ja käsittelyvaatimus. Käytä luotettavia Ruokaviraston ohjeita ja julkisia tuote-/pakkaustietoja, kun ne riittävät riskin tunnistamiseen ja menetelmän ohjeistamiseen.
2. **Älä edellytä automaattisesti erillistä valmistajan kirjettä, tuote-eräkohtaista jäädytyslokia tai valmistajan vastausta jokaisen reseptin julkaisemiseksi.** Se ei ole yleinen reseptijulkaisun portti.
3. Kun kuumentamatta syötävän kalan tai mädin loisriski edellyttää jäädytystä, kerro vaihtoehdot ja edellytä valmiiksi asianmukaisesti käsiteltyä tuotetta tai menetelmän toteuttamista: vähintään −20 °C / 24 h, −35 °C / 15 h tai −18 °C / 96 h. Aika lasketaan vaaditun lämpötilan saavuttamisesta. Jo tehtyä asianmukaista valmistajan käsittelyä ei toisteta turhaan.
4. Käytä vain sellaisenaan syötäväksi tarkoitettua, raakakäyttöön soveltuvaa tuotetta. Jos tuote on merkitty vain kypsennettäväksi, pelkkä pakaste-merkintä ei todista sen raakakäyttökelpoisuutta. Pakkausmerkintöjä ja kylmäsäilytystä tulee noudattaa.
5. Erota loiset ja listeria. Pakastus ja graavaus eivät poista listeriaa. Riskiryhmille jää kuumentamattoman graavikalan ja mädin välttämisohje. Älä julkaise vaarallista ohjetta vain prosessin nopeuttamiseksi.
6. Pidä ruokalaji ja resepti-identiteetti samoina FI/EN/SV/TH-kielissä. Tee semanttinen tarkistus ja CI täsmä-HEADilla. Varsinaiset ravintoarvot/GK ja mahdolliset F25/kuva/julkaisuhyväksynnät pysyvät erillisinä portteina.

## Julkaisupäätös tässä erässä

- Graavisiian ja muikunmädin **automaattinen valmistajakirje-HOLD poistetaan**. Niiden tilalle tulee ohjeeseen kirjattu Ruokaviraston mukainen käyttö- ja jäädytysvaatimus. Reseptit ovat edelleen Draft, koska muu julkaisuvalmius ja hyväksyntärekisteri eivät automaattisesti täyty.
- Kauppojen tuotetietoja saa käyttää esimerkkeinä, ei todistuksena tuntemattoman kotipakkauksen käsittelystä. Tuotesivun julkinen tieto ei todista juuri käyttäjän käyttämää erää.
- Tuotekohtainen lisäselvitys on tarpeen **vain jos olennainen turvallisuusepäselvyys jää oikeasti ratkaisematta** eikä reseptistä voi tehdä turvallista yleisohjetta. Silloin ratkaisu on kyseisen raaka-aineen tai reseptin tarkentaminen, ei automaattinen kirje jokaiselle valmistajalle.

## Lähteet
- https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/tuote--ja-toimialakohtaiset-vaatimukset/kalat-ja-kalastustuotteet/jaadytysvaatimus/
- https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/
- https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/mikrobiologiset-vaarat-ja-muut-riskit/
- https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/ruokamyrkytyksia-aiheuttavia-bakteereja/listeria/

Tämä ohje on laadittu Chat-4:n PR:n sisäiseksi uudelleenkäytettäväksi toimintatavaksi. Muut aktiiviset PR-haarat ja julkaisuportit jätetään koskematta.
