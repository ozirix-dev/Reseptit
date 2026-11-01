# Omistajan yhteinen menetelmä- ja sisältöpäätös

Tila: hyväksyntää ei ole saatu. AJO6:n toimeksianto valtuuttaa tutkimuksen ja
Draft-valmistelun. Tämä asiakirja ei ole julkaisulupa.

Päätöksen rajaus on manifestin24 täsmällistä resepti-ID:tä ja pakettien1–3
hasheilla sidotut punnitut valmistusversiot. Kieliversioita ei ole luotu:
reseptit ovat FI-only, laskennan mallinnus- ja luottamustekstit FI/EN/SV/TH.

| Evidenssi tai oletus | Merkitys ja hyväksyttävä sovellus |
| --- | --- |
| Ihmisillä mitattu GI | Lähderuoalle ja lähteen valmistukselle mitattu arvo glukoosiasteikolla; ei tämän aterian mittaus |
| Sovellettu ihmis-GI | Nimetyn ruoan ja valmistuksen analogia; perustelu ainesosassa, matala luottamus |
| Julkaistu GI-koodaus | Kasvis40 ja eläinmaitotuote30 sekä Schakelin default50 erotetaan mittauksesta; alkuperäislähteet pakettien sources.json:ssa |
| Projektin soveltamisraja | Default50 vain nimetyille ruokaperheille ja enintään5g CHO/100g; ei biologinen virheraja |
| Pieni mausteannos | Nimetty mauste/siemen/uute: enintään0,5g CHO/ainesosa/annos ja yhteensä1g; kaikki CHO lasketaan, mitään ei nollata |
| Nimetty skenaario | Esimerkiksi nasi lemakin basmati/jasmiini; alue kuvaa valintoja, ei tilastollista epävarmuusväliä |
| Tuntematon | Puuttuva GI, koostumus, määrä tai sopiva valmistus jää keskeneräiseksi; ei GI0-oletusta |

Hyväksyttävä kokonaisuus sisältää nimetyt riisi-, riisipuuro-, nuudeli-,
kaura-, pita-, maissi- ja palkokasvianalogiat. Kuiva/kypsä paino, syötävät
osuudet, tuotteiden koostumus ja koko kastikkeen/liemen syöminen määräytyvät
tarkasta reseptistä. Tuotevaihto ei automaattisesti säilytä samaa arviota.
Kasvis40 ei sovellu sanan osan perusteella: esimerkiksi butternut ei ole voi.
Pakettikohtaiset samannimiset lähde-ID:t ovat erillisiä versioita omissa
hakemistoissaan, omilla aineistohasheillaan.

Kaikki24 arviota ovat LOW-luottamuksen ainesosasummia. Biologista
epävarmuusväliä ei tunneta. Esitys ei ole mitattu aterian vaste tai insuliinin
annosteluohje. Positiivinen alle yhden GK näytetään alle yhtenä, ei nollana.

Sisältöpäätös koskee muun muassa erillisiä chao ga- ja bubur ayam -perusversioita,
syötävää minttua, kokonaisia seesaminsiemeniä, yksinkertaisia nasi-versioita,
raakana punnittua höyrymunaa ja kuvien laskelman ulkopuolisia lisukkeita.
Shoyun kuva on kuvituskuva; käytetään konjac-nuudeleita. Kaikkien24 neljä
makroa ja lähdesidonta ovat osa katselmointia.

Yhdeksän vanhan nollan hyväksyntää ei sisälly tähän päätökseen. Q09 on erillinen
korjauserä. Tämän integraation muuttumattomuusregressio ei validoi niiden nollaa.

Omistajan ratkaistava kysymys: hyväksytäänkö manifestin24 reseptin täsmälliset
versiot ja yllä rajatut menetelmäsovellukset seuraavaan vaiheeseen? Kyllä / Ei.
Myönteinen vastaus ei yksin anna merge- tai deploy-lupaa.
