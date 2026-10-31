# Kahdeksan aiemman ehdotuksen hyväksyntäaineisto

Tila READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW. Omistajan hyväksyntä odottaa.
Tämä on valmis katselmointiaineisto, ei uusi tuotantokoodipaketti tai julkaisu.
Valitut8 ovat AJO5:n50 tutkimusvaiheen ehdotuksen osajoukko. Niitä ei lasketa
AJO6:n uusiksi numeerisiksi tutkimustuloksiksi.

Valinta suosii täydellisiä punnittuja versioita, selkeitä pakettikohtaisia
lähteitä ja neljää makroa. Kaikki8 ovat FI-only: kaannokset-kansion
rakenteiset lähteet tarkistettiin. Käännöksiä tai ihmisarvioita ei keksitty.
Myöhempi julkaisu käyttää nelikielistä mallinnus-/LOW-merkintää kuten#146.

| Resepti | Netto-CHO g | Kokonais-CHO g | Proteiini g | Rasva g | GK |
| --- | ---: | ---: | ---: | ---: | ---: |
| Paprikauunimunakkaat – punnittu versio | 7.6375 | 10.7722 | 21.0100 | 16.3461 | 3.0976 |
| Kana-fajitapelti avokadokastikkeella – punnittu versio | 4.8429 | 8.1133 | 32.1333 | 17.1384 | 1.9307 |
| Kana-enchilada-kukkakaalivuoka – kotisalsaversio | 6.3688 | 10.0250 | 46.4441 | 28.9450 | 2.5145 |
| Kookosriisi mangolla ja seesamilla – punnittu versio | 48.0491 | 49.7631 | 5.8260 | 16.4090 | 30.7791 |
| Thaimaalainen riisinuudelikeitto aamuksi – punnittu versio | 42.5770 | 44.6080 | 19.5880 | 1.6230 | 25.7730 |
| Tortilla española – esikeitetyn perunan versio | 6.1350 | 6.8850 | 7.8433 | 18.6369 | 3.6795 |
| Chili con carne kukkakaaliriisillä – punnittu versio | 15.6299 | 22.5724 | 30.7748 | 28.9641 | 5.1552 |
| Kermainen kanakeitto pinaatilla ja sitruunalla – punnittu versio | 4.6463 | 7.2804 | 25.6916 | 23.4898 | 1.8513 |

Kaikki ovat LOW-luottamuksen pistearvioita, eivät aterialla mitattuja vasteita.
Biologista epävarmuusväliä ei tunneta. Valmistusversiot, syötävät massat,
kaikki ainesosat, lähde-/koostumushashit ja riippumaton Decimal sisältyvät
tähän hakemistoon. Lähdehashit varmistettiin nykyisestä tutkimuspohjasta.

## Julkaisussa tarvittavat sisältömuutokset

- Paprikamunakkaat ja fajitapelti: käytetään vain punnitut ainekset ja rasvat.
- Enchilada-kukkakaalivuoka: määritelty250g kotisalsa, ei tuntematonta tuotetta.
- Mango-kookosriisi ja riisinuudelikeitto: nimetyt kuumat vilja-/nuudeliversiot.
- Tortilla española: peruna esikeitetään ja munat kypsennetään pannulla;
  arvio ei koske vanhaa pitkään öljyssä kypsennettyä perunaversiota.
- Chili con carne: nimetyt kypsät kidneypavut ja punnittu kukkakaaliriisi.
- Pinaatti-sitruunakanakeitto: punnittu kokonaan syötävä liemi ja kerma.

Myöhempi toteutus vaihtaa nykyiset FI-reseptit näihin täsmällisiin versioihin,
laskee julkaisun neljä makroa samasta aineistosta, sitoo lopullisen koko
reseptitekstin hashin ja lisää paketin yhteiseen rekisteriin. Päivitä kuvan
lisukerajaus ja varmista sisältö-/macro-/lähdesidonta oikeassa ehdokasbuildissa.
Tämän8 reseptin runtime-buildia tai uutta tuotantokattavuutta ei väitetä.

## Yhteiset hyväksyntäehdot

Omistaja katselmoi täsmälliset versiot, GI40/30/50-koodauksen projektirajoineen
ja nimetyt mango-, riisi-, nuudeli-, peruna- ja kidneypapuvertailut.
Valmistusanalogiat ja koostumusproxyt ovat avoimia ehtoja,
eivät mittauksia. GI-asteikko ja tilastollinen lähde-SEM/SD erotetaan
reseptin pisteestä. Kaikki CHO on mukana. Ei uutta näennäistä epävarmuusväliä.

Erillistä main-pohjaista PRD:tä ei avata tässä ajossa: näin24 reseptin
integraatio ja Q09-laatukorjaus pysyvät hallittavina. Tämä aineisto antaa
omistajalle konkreettiset8 versiota arvioitaviksi ennen seuraavaa toteutusta.
Ei mergeä, deployta tai automaattista seuraavaa ajoa.
