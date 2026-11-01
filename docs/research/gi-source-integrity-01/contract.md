# GI-lähteiden luokittelun ja uuden käytön ehdotus

Tila: **AUDIT PROTOTYPE / OWNER DECISION REQUIRED**. Toteutus on vain tämän
tutkimuspaketin `admission.py`-tarkistin ja fixturet. Sitä ei ole kytketty
tuotannon laskentaan, PR-CI:hin tai nykyisten hyväksyntöjen korvaajaksi.
Skeeman läpäisy ei todista GI-tutkimuksen menetelmää, tuotteen vastaavuutta
tai omistajapäätöksen aitoutta.

Pienin laajennus olisi erillinen versioitu metatietokortti, joka viittaa
alkuperäisen GI-kortin ID:hen ja evidenssihashiin. Vanhoja lähdekortteja tai
hyväksyntähasheja ei kirjoiteta uudelleen. Kortissa erotetaan:

| Ulottuvuus | Luokat ja merkitys |
|---|---|
| `measurementKind` | `HUMAN_MEASURED`, `HUMAN_MEASURED_METHOD_UNCONFIRMED`, `IN_VITRO_ESTIMATE`, `NOT_MEASURED`, `UNASSESSED` |
| `testObjectKind` | `SINGLE_FOOD`, `MIXED_MEAL`, `POLICY` |
| `applicationKind` | `DIRECT`, `FOOD_ANALOGUE`, `CATEGORY_PROXY`, `PROJECT_IMPUTATION`, `REFERENCE_ONLY` |
| `calculationUse` | `REFERENCE_ONLY`, `REVIEW_REQUIRED`, tai erikseen päätettävä täsmällinen käyttölupa |

Näin esimerkiksi ihmisillä mitattu puuro voi olla sekä `MIXED_MEAL` että
ainesosalaskennan `REFERENCE_ONLY`. Menetelmältään puutteellinen ihmiskoe ei
muutu in vitro -kokeeksi, eikä julkaistu in vitro -tutkimus ihmis-GI:ksi.
Tutkimuksen laatu, elintarvikkeen vastaavuus ja laskentakäytön lupa pysyvät
eri asioina. `qualityTier`, `confidence` tai `published:true` eivät korvaa
näitä tietoja. Alkuperäiset arvot ja niiden hajonnan laji säilytetään.

Tuoteidentiteetti tarvitsee täsmällisen tuotetunnisteen, nimen, tuotemerkin tai
geneerisen määritelmän, fyysisen muodon, valmistuksen, olennaiset ainesosat ja
lisätyn sokerin/tärkkelyksen tiedon. Puuttuva ainesosatieto merkitään
puuttuvaksi, ei tyhjäksi listaksi. Koostumuskortti, sen hash, resepti-ID,
reseptin lähdehash ja laskentasyötehash sidotaan erikseen. Mittauskortilla
säilytetään menetelmä, osallistujat, referenssiruoka, alkuperäinen asteikko,
DOI/tunniste ja tiedon saatavuusraja. Valkoleipäasteikko ei muutu
glukoosiasteikoksi pelkällä nimen vaihdolla; muunnos olisi oma lähteistetty
toimi ja sen jälki säilytettäisiin.

`admission.py` havainnollistaa uuden käytön suljettua tarkistusporttia.
Tuntematon metodi jää katselmointiin. In vitro hylätään ihmisen GI-pisteenä
myös ristiriitaisella julkaistu/STRONG/ISO-metadatalla. Sama nimi ei ohita
tuote- tai valmistus-ID:tä. Sekaruoan arvoa ei voi siirtää sen ainesosalle.
Analogia, ryhmäproxy ja projektin imputointi tarvitsevat kukin erillisen,
täsmälliseen syötteeseen sidotun päätöksen. Tarkistimen oletuspäätöslista on
tyhjä; fixtureissä käytetyt hyväksynnät ovat nimenomaan synteettisiä.

Nykyiselle `HUMAN_MEASURED_METHOD_UNCONFIRMED`-lähteelle voisi yhä ehdottaa
rajattua LOW-sovellusta, mutta puuttuva metodi pitäisi ilmoittaa ja päätös
tehdä erikseen. Luokittelu ei anna automaattista käyttölupaa. Nykyisiä
hyväksyttyjä LOW-analogeja ei tässä peruta tai uudelleenhyväksytä.

Saman täsmällisen tuotteen eri tutkimusarvot säilytetään erillisinä. Ennen
yhdistämistä tarkistetaan menetelmä, referenssi, osallistujat ja tuoteversio.
Minimiä tai yksinkertaista keskiarvoa ei valita automaattisesti. Perustellut
vaihtoehdot voivat muodostaa nimetyt reseptiskenaariot, eivät biologista
luottamusväliä ilman siihen kuuluvaa näyttöä.

Suositeltu myöhempi käyttöönotto olisi uuden GI-kortin admission-portti ennen
uuden erän integraatiota. Sen kytkentä nykyiseen CI:hin ja todelliseen
päätösrekisteriin on erillinen toteutuspäätös. Nykyinen auditointi ei vielä
takaa, että kaikki tulevat PR:t ajavat tämän prototyypin automaattisesti.
