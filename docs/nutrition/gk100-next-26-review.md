# GK100 · 26 ehdokkaan päätöserä

Pohja on 230/326 tuotannossa, main `de83657c52e0f018b10c3d5e7d26cdf671d5c85f`. Lähtöcommit `eb6f8012705012bd7cdf32a66c63bc01a620c831` tuotti uudelleen manifestin `e6edcf980b24419a587b9da8aacc8bcb942f3757d75c9a06da22da0b9bb1b1a0`. Reseptikohtaiset laskelmat, syötteet ja FI/EN/SV/TH-tekstit säilyvät tarkistetuissa ehdokaspaketeissa. Syväkatselmointi hyödyntää aiemmin valmistuneita paketteja ja tutkimusindeksiä. [Tutkimusindeksi commitissa bd52ca7](https://github.com/ozirix-dev/Reseptit/blob/bd52ca7752fdb4138b5b1a05c223cea973ade648/docs/nutrition/gk100-rescue-index.md)

[Eräsyöte](gk100-next-26-batch.json) · [Päätösmanifesti](gk100-next-26-manifest.json) · [Sidotut omistajapäätökset](gk100-next-26-owner-approvals.json) · [Julkaisuvalmistelupaketti](gk100-next-26-release-bundle.json)

Uuden manifestin SHA-256 on `a3b6c434076dc2cffa1a0cc62b056f5fe4d43fa37bbf3c6fbd54111f2a0b3e11`. Julkaisuvalmistelupaketin tarkiste on `f52626b01ac5a6191e39fea7ab9730b22786a47ad2a4dce26916580645bf56a9`. Vain kaksi hyväksyttyä ehdokasta on paketissa julkaisuvalmiina. Niiden julkaisu nostaisi kattavuuden **232/326:een (71,2 %)**. Tuotantokytkentä vaatii erillisen valtuutuksen.

## GO · hyväksytty julkaisuvalmisteluun

| Versio | GK/annos | Hyväksytty rajaus ja laskenta |
| --- | ---: | --- |
| Maapähkinä-xôi | 28,06 | Kahdelle 100 g tahmariisiä kuivapainona, höyrytettynä, 100 g paahdettua maapähkinää, 25 g tuoretta kookosta ja 8 g seesamia. Kuivapaino käyttää MEXTin saatavan hiilihydraatin massalukua. Riisin osuus on 26,68425 GK, maapähkinän 0,9165 ja kookoksen 0,4594625. Riisin GI-verrokki on höyrytetty. Seesami on mukana annoksessa. Sen 0,248 g CHO/annos jää GK-summasta pois ja GI 100 -stressi pitää kokonaislukupyöristyksen samana. [Laskentamuistio](gk100-xoi-coconut-review.md) |
| Bouillabaisse | 22,24–22,69 | Neljälle 60 g kypsää kuoretonta simpukanlihaa, 1 000 g laimennettua kalalientä ja 120 g vaaleaa vehnäleipää punnittuna ennen paahtamista. **Paahdettu leipä sisältyy GK-arvioon** kaikissa neljässä kieliversiossa. Keitto antaa 12,7496425 GK/annos, leipä 9,490068 tai 9,941976 kahdella mitatulla paahtoleipäverrokilla. Keitetyn perunan GI on analogia. [Laskentamuistio](gk80-operation80-batch-12.md) · [GK-reseptitekstit](gk80-operation80-bouillabaisse-release-candidate.json) |

## CONDITIONAL GO · yksi sisältöpäätös

**Msemen hunajalla.** Hyväksyttävä GK-versio kahdelle sisältää 100 g hienoa mannasuurimoa, 100 g vehnäjauhoa, 50 g kerrosvoita, 13,5 g paistoöljyä ja 20 g erikseen tarjoiltua hunajaa. Omanin parathan ja Etelä-Intian parotan ihmismittaukset ovat rasvaisen, täyttämättömän pannuleivän verrokkeja. Hunajalle käytetään erillistä ihmismittausta. Hyväksyntä koskisi punnittua versiota ja lukujen **28,23 ja 49,40 GK/annos** esittämistä kahtena verrokkiskenaariona. Mannasuurimon, kerrosrasvan ja taittelun vaikutuksesta todellinen vaste voi jäädä skenaarioiden ulkopuolelle. [Laskentamuistio](gk80-operation80-batch-18.md)

## BLOCKED · 23

Sama juurisyy on merkitty taulukkoon yhteisellä nimellä. Ratkaisun kohde on kunkin arvion kannalta suurin avoin osuus.

| Versio | Juurisyy | Ratkaistava näyttö |
| --- | --- | --- |
| Bissara | Pääraaka-aineen käsittely | GI 66 perustuu kolmen henkilön kokeeseen ehjillä keitetyillä härkäpavuilla. Soseutetusta kuoritusta pavusta tarvitaan valmistusta vastaava GI-peruste. Valkosipuli ja juustokumina (0,49 g CHO/annos) eivät ratkaise estettä. [Laskentamuistio](gk100-bissara-select-review.md) |
| Samosa | Koko ruoan analogia | Punnittu Meira-mauste ratkaisee koostumussyötteen. Koko samosan 44,49 GK:n laskennassa GI 60,35 perustuu omanilaiseen kasvis-sambosaan. Mitatun näytteen taikina–täytesuhde ja öljyn imeytyminen ovat avoimia, eikä laboratorioluku 69,2 ole toinen ihmismittaus. [Laskentamuistio](gk100-samosa-meira-review.md) |
| Bammy | Pääraaka-aineen käsittely | Casaben GI 117,55 ei yksilöi kostutetun ja pannulla paistetun bammyn käsittelyä. Tarvitaan nimetyn kassavaleivän kypsennys- ja turvallisuussidos sekä sitä vastaava verrokki. [Laskentamuistio](gk80-operation80-batch-62.md) |
| Bánh xèo | Erillinen ainesosa | Kaksi ihmismittausta tukee riisidosaa taikinan herkkyysvertailuna. Erillinen kypsä itutäyte antaa tuotetiedoista 1,20–6,975 g CHO/annos. Itutuote ja sen kypsennyksen GI-peruste pitää sitoa, eikä taikinan GI kata täytettä. [Laskentamuistio](gk80-operation80-batch-23.md) |
| Baozi | Koko ruoan analogia | Täytetyn höyrysämpylän GI 39,1 vaikuttaa koko annokseen. Kuori–täytesuhde ja jauho puuttuvat, ja muut höyryleipäverrokit antavat olennaisesti eri luvun. [Laskentamuistio](gk80-operation80-baozi.md) |
| Brik | Koko ruoan analogia | Chen ym. kuvaavat kevätrullan sanalla Instant. Taikinakuoren, täytteen ja paiston vastaavuus puuttuu, joten koko brikin 5,28 GK jää verrokkiskenaarioksi. Sitruunamehun pieni osuus ei ratkaise estettä. [Laskentamuistio](gk80-operation80-batch-45.md) |
| Marjainen chiavanukas | Pienosuuden suhteellinen vaikutus | Chian ja vaniljauutteen poisjättö on noin 0,34 g CHO/annos. GI 100 -stressi on noin viidennes 1,62–1,81 GK:n osatuloksesta. Alpro No Sugarsin nollahiilihydraatti on jo sidottu. [Laskentamuistio](gk80-operation80-batch-38.md) |
| Kookos-lime-kanacurry | Koodit ja avoin CHO | Tarvitaan haudutetulle kastikepohjalle soveltuva GI-peruste ja jäljelle jäävän tahnan ja limetin osuuden ratkaisu. Ks. erittely alla. [Laskentamuistio](gk80-operation80-batch-30.md) |
| Dal makhani | Pääraaka-aineen käsittely | Urad antaa 11,82 GK 16,94 GK:sta. Höyrytetyn uradin GI 43 ei kata keittoa ja osittaista murskaamista, ja vain osin palautettavan keitinliemen CHO-osuus on auki. Kidneypavun valmistus on kirjattu pakettiin. Pääeste on uradin sidos. [Laskentamuistio](gk80-operation80-batch-50.md) |
| Dim sum | Koko ruoan analogia | Wonderbaon koostumus 52,9 g CHO/100 g on varmennettu. Vaihtoehtoinen höyryleipäverrokki muuttaa 31,92:n noin 25,54:ään. QQ Century -kuoren ja nyyttiverrokin vastaavuus pitää ratkaista erikseen. [Laskentamuistio](gk80-operation80-batch-51.md) |
| Johnny cake | Pääraaka-aineen käsittely | Punnittu ohut pannureitti on erotettu sämpyläreitistä. Paratha ja chapati antavat 23,75–24,63 GK, maitopannukakkuverrokki 26,43 ja toinen vehnäpannukakku 31,40. Maitoa ja leivinjauhetta käyttävälle taikinalle tarvitaan perusteltu verrokkivalinta. [Laskentamuistio](gk80-operation80-batch-02.md) |
| Kimchi-jjigae | Koodit ja avoin CHO | Tarvitaan haudutetun kimchi-tofupohjan GI-peruste ja tahnan sekä muiden liemeen jäävien hiilihydraattien käsittely. Ks. erittely alla. [Laskentamuistio](gk80-operation80-batch-54.md) |
| Lontong sayur | Pääraaka-aineen käsittely | Lehtikääreessä kypsennetyn tahmariisin GI 83 ei yksilöi pitkäjyväisen riisikakun vastetta. Lähimmän suoran lähteen tulostaulukko ja valmistussidos ovat auki. [Laskentamuistio](gk80-operation80-batch-48.md) |
| Mehevä suklaakakku | Koko ruoan analogia | 14,44–22,03 GK:n kaupallisista verrokeista korkeammassa on erillinen maitokermatäyte. Mutakakku antaa 16,33 GK herkkyysvertailussa. Kotikakun kuorrutettu saanto ja läheisemmän verrokin koostumus on vahvistettava. [Laskentamuistio](gk80-operation80-batch-40.md) |
| Nasi lemak | Koko ruoan analogia | GI 66 on kokonaisen testiaterian havainto. Samalla CHO-kuormalla kotiversion rasva- ja proteiinimäärät poikkeavat. Tarvitaan vastaava ateriakoostumus tai erillinen riisi- ja lisukemalli. [Laskentamuistio](gk80-operation80-batch-06.md) |
| Ojja | Erillinen ainesosa | Bertinet-leipä on sidottu koostumukseen. Leipäverrokit ja haudutetun pannun noin 3 GK:n koodiosuus vaativat perustelun. Tomaatti yksin sisältää 3,9 g CHO/annos. Harissan 0,0825 g:n poisjättö on sivuseikka. [Laskentamuistio](gk80-operation80-batch-55.md) |
| Papaija-kookospuuro | Pääraaka-aineen käsittely | Maitoon keitetty tapioka määrää arvion. Tapiokaverrokin 10 GI-yksikköä muuttaa arviota noin 4,73 GK/annos. Kookosmaidossa kypsennetyn tapiokan valmistus- ja GI-sidos puuttuu. [Laskentamuistio](gk80-operation80-batch-61.md) |
| Ruokabanaanilautanen | Pääraaka-aineen käsittely | Noin 97 % tuloksesta tulee kypsän uppopaistetun ruokabanaanin GI 90:stä. Ohut öljykerros on eri valmistus. Matalampi paistoverrokki ei vahvista samaa kypsyys- ja valmistusastetta. [Laskentamuistio](gk80-operation80-batch-04.md) |
| Roti canai dhalilla | Koko ruoan analogia | Yhdistelmäverrokkien GI 69 ja 71 eivät varmista leivän ja dhalin osuuksia. Kotiversiossa on noin 45 % CHO:sta dhalissa, ja kookosmaidon rasva poikkeaa koostumusverrokista. [Laskentamuistio](gk80-operation80-batch-57.md) |
| Roujiamo | Erillinen ainesosa | Kohotetulle pannuleivälle käytetään vehnäletun GI 79,6:ta. Leivän rakenne pitää sitoa läheisempään verrokkiin. Soijakastikkeen siirtymän epävarmuus on toissijainen. [Laskentamuistio](gk80-operation80-batch-60.md) |
| Tempeh-munakulho | Pääraaka-aineen käsittely | Jasmiiniriisi antaa noin 98 % alemmasta arviosta. Nimetyllä vertailuriisillä lähderivien valinta muuttaa tuloksen noin 27,44–32,17 GK:hon. Tarvitaan riisipakkauksen ja valmistuksen sidos sekä punnitun sambalversion päätös. [Laskentamuistio](gk80-operation80-batch-03.md) |
| Katkarapu-wontonkeitto | Koko ruoan analogia | Yangin liha–salottisipulinyytti antaa noin 96,5 % GK:sta. Kuori, täyte ja kypsennys jäävät avoimiksi. Tarvitaan keitetyn katkarapuwontonin tai sen kuoren valmistusverrokki. [Laskentamuistio](gk80-operation80-batch-29.md) |
| Xiaolongbao | Koko ruoan analogia | Yangin GI 28 -nyytin kypsennystapa on avoin. Höyrytetyn ohuen kuoren ja liemitäytteen vastaavuus ratkaisee. Dipin 0,462 g CHO/annos ei ole pääeste. [Laskentamuistio](gk80-operation80-batch-36.md) |

## Kaksi kokonaan koodattua arviota

| Versio | Paketin CHO ja koodattu GK annosta kohti | Avoin CHO ja vaikutus |
| --- | --- | --- |
| Kookos-lime-kanacurry | Kookosmaito 1,70 tai 3,40 g → 0,85 tai 1,70 GK (GI 50). Vihreät pavut 1,2375 g → 0,495 GK ja paprika 1,6875 g → 0,675 GK (GI 40). Kalakastike ja basilika 0,14 g → 0,07 GK (GI 50). Summa 2,09 tai 2,94 GK. | Paketin 850 g Knorr-tahnasta 0,9225 g ja limettimehusta 0,50125 g, yhteensä 1,42375 g. GI 100 -stressi lisää 48–68 % osatulokseen. Eri pakkauskoon Knorr ja tuore limetti antoivat tutkimuksessa yhteensä 0,82 g. Eri tuotteiden ja syötteiden luvut pysyvät erillään. |
| Kimchi-jjigae | Kimchi 1,10 g → 0,44 GK, keltasipuli 1,20 g → 0,48 ja kevätsipuli 0,46 g → 0,184 (GI 40). Tofu 1,35 g → 0,675 GK (GI 50). Summa 1,779 GK. Riisi on erillinen lisuke. | Bibigo-tahna 0,8925 g, liemi 0,40 g, soijakastike 0,12 g ja gochugarun massakatto 0,50 g, yhteensä enintään 1,9125 g. Nimetyn vaihtoehtoisen gochugarun koostumus laskisi summan 1,6789 grammaan. GI 100 -stressillä lisäys olisi yhä noin 94 % osatuloksesta. |

Kummankaan reseptin laskennassa ei käytetä soveltuvaa ihmisillä mitattua GI:tä. Currya lisukkeen kanssa testanneet ihmiskokeet mittasivat seka-aterioita. Kimchin Bibigo-tahnan 0,4725 g:n sokeriosuudelle puhtaan maltoosin mitattu GI 105 tuottaisi oletuksena 0,496125 GK/annos. Malli jättää tahnan 0,42 g muuta hiilihydraattia avoimeksi. Tällaiset herkkyyslaskelmat kertovat, mihin näyttö kannattaa kohdistaa. [Curryn laskelma](gk80-operation80-batch-30.md) · [Kimchi-jjigaen laskelma](gk80-operation80-batch-54.md)

## Menetelmä ja tarkistus

- Factory kirjaa ihmis-GI:n lähteenä `HUMAN_GI`. Sovellettu mitattu verrokki käyttää samaa lähdetyyppiä, ja siirron perustelu ja epävarmuus näkyvät lähdehuomautuksessa sekä reseptitekstissä. `PUBLISHED_CODING` ja `B_CODING` erottavat laskentakoodit mittauksista. `BOUND` kuvaa koostumuksen rajaa. Tuntematon GI jää avoimeksi ja sen vaikutus käsitellään erikseen.
- Aiemman pienosuussäännön grammaseula on alle 1 g ainesosaa kohti ja alle 2 g yhteensä annosta kohti. Arvion kokoon suhteutettu GI 100 -stressi voi silti osoittaa olennaisen epävarmuuden. Stressi on oletus. B-mallin koostumussidonnaiset koodit ja `TRACE50`-rajat eivät ratkaise näiden kahden annoksen avoimia osuuksia. GK149:n B-reitti edellyttää GI-perustetta kaikille positiivisille CHO-riveille. Näistä paketeista ei löytynyt perustetta muuttaa Factoryn lähdeporttia.
- 15 aiempaa teknistä sidosta säilytettiin. Katselmointi erotti pienosuudet varsinaisista GI- ja valmistusongelmista, ja kaksi hyväksyntää sidottiin ehdokkaan, alkuperäisen reseptin, syötteiden ja manifestin tarkisteisiin.
