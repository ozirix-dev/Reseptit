# Thai-erä A: kahdeksan reseptin ravintoarviot

Laskenta 24.10.2026. Arvot ovat suuntaa-antavia arvioita annosta kohti, eivät
valmiin ruoan laboratorioanalyysejä. Reseptit on mitoitettu neljään annokseen.
Laskennan toistaa komennolla `python tools/calculate-nutrition-batch7.py`.
Laskin lukee vain paikallisia Fineli Release 20- ja AFCD Release 3 -poimintoja
sekä tässä tiedostossa ja `food-records.json`-tiedostossa nimettyjä
tuote-etikettejä. Duplikaattitarkistus: Fineli-poiminnassa ei ole duplikoituja
ID-tunnisteita tai normalisoituja nimiä; tuotetiedot on lisätty omilla
tuotekohtaisilla tunnisteilla.

## Määritelmät ja muunnokset

Nettohiilihydraatit = imeytyvä hiilihydraatti. Kokonaishiilihydraatit =
imeytyvä hiilihydraatti + kuitu + lähteistetyt polyolit. Foodin-erytritoli on
100-prosenttista polyolia ja sisältyy kokonaisarvoon; nettomäärä on nolla.
AFCD:n polyolit lasketaan lähteen ilmoittamien imeytyvän hiilihydraatin
arvojen erotuksena sokerialkoholien kanssa ja ilman niitä. Vesi jätetään
laskematta. Kananmunan kuoret ja eläinruoan luut eivät sisälly punnittavaan
syötävään massaan.

Kaikki ainesmäärät on muutettu grammoiksi ja yhdenmukaistettu julkaistuihin
käännöksiin. Ruokalusikallisina tai teelusikallisina aiemmin ilmoitetut
määrät on punnittu seuraavasti: 1 rkl kastiketta tai mehua = 15 g, 1 rkl öljyä
= 13,5 g, 1 rkl erytritolia = 12 g, 1 tl erytritolia = 4 g ja 1 tl jauhettua
maustetta = 2 g. Keskikokoiseksi tomaatiksi laskettiin 125 g (#352), pieneksi
sipulimääräksi 40–70 g reseptin mukaan ja kahdeksi korianterirkl:ksi 6 g.
Pala- ja sellerimäärät on muutettu lähteiden mukaisiksi syötäviksi
painomääriksi.

Currytahnojen, konjacnuudelien, soijapaputahnan, kalakastikkeen ja
erytritolin laskenta vastaa `food-records.json`-tiedoston nimettyjä tuotteita.
Nämä ovat etikettitietoja, eivät kaikilta osin avoimen tietokannan rivejä;
koostumus voi muuttua pakkauksittain. Kookosmaito lasketaan AFCD:n tavallisen
rasvaisuuden säilykekookosmaidon tietueella F002991.
Finelin ja AFCD:n lähderivit on kopioitu muuttamatta ja lähteiden lisenssit ja
attribuutiot on kuvattu `README.md`-tiedostossa.

## Tulokset annosta kohti

| Resepti | Nettohiilihydraatit g | Kokonaishiilihydraatit g | Proteiini g | Rasva g |
| --- | ---: | ---: | ---: | ---: |
| Yum woon sen katkaravuilla | 3,15 | 7,88 | 18,98 | 9,23 |
| Gai yang | 5,78 | 10,45 | 45,17 | 35,05 |
| Keltainen kanacurry | 7,74 | 11,79 | 33,08 | 22,78 |
| Khao kha moo | 9,93 | 16,87 | 49,80 | 38,91 |
| Khao man gai | 6,75 | 11,16 | 38,57 | 6,00 |
| Khao soi konjacnuudeleilla | 6,35 | 11,69 | 32,08 | 21,05 |
| Larb moo | 6,82 | 9,61 | 33,83 | 16,13 |
| Massaman-kanacurry | 12,80 | 20,38 | 37,66 | 24,85 |

## Lähdetietueet resepteittäin

- **Yum woon sen:** Fineli #835 katkarapu, #352 tomaatti, #335 sipuli, #535
  rypsiöljy ja #339 lehtiselleri; AFCD F007057 raaka porsaan jauheliha,
  F004729 limettimehu, F002901 punainen chili ja F003192 korianteri; KoRo
  kypsät konjacnuudelit, Foodin-erytritoli ja Squid Brand -kalakastike.
- **Gai yang:** Fineli #11563 raaka, nahallinen ja luuton reisiliha, #31
  soijakastike, #322 kukkakaali ja #346 kurkku; AFCD F004193 valkosipuli,
  F003192 korianteri ja F004729 limettimehu; Foodin-erytritoli ja Squid
  Brand -kalakastike.
- **Keltainen kanacurry:** AFCD F002806 nahaton raaka reisiliha, F002991
  säilykekookosmaito ja F003192 korianteri; Fineli #322 kukkakaali, #335
  sipuli ja #552 kookosrasva; Mae Ploy -keltainen currytahna,
  Foodin-erytritoli ja Squid Brand -kalakastike.
- **Khao kha moo:** Fineli #705 porsaan lapa, #30315 laimennettu kanaliemi,
  #31 soijakastike, #858 kananmuna, #359 kiinankaali ja #322 kukkakaali;
  AFCD F004193 valkosipuli; Foodin-erytritoli ja Squid Brand -kalakastike.
- **Khao man gai:** AFCD F002806 raaka nahaton reisiliha, F004213 tuore
  inkivääri, F004729 limettimehu, F004193 valkosipuli ja F003192 korianteri;
  Fineli #322 kukkakaali, #30315 kanaliemi ja #346 kurkku; Healthy Boy
  -soijapaputahna ja Squid Brand -kalakastike.
- **Khao soi:** AFCD F002806 raaka reisiliha, F002991 säilykekookosmaito ja
  F004729 limettimehu; Fineli #30315 kanaliemi, #359 kiinankaali ja #335
  sipuli; Mae Ploy -punainen currytahna, KoRo kypsät konjacnuudelit,
  Foodin-erytritoli ja Squid Brand -kalakastike.
- **Larb moo:** AFCD F007057 raaka porsaan jauheliha, F004729 limettimehu,
  F005700 minttu ja F003192 korianteri; Fineli #182 riisijauho, #335 sipuli,
  #320 valkokaali ja #346 kurkku; Squid Brand -kalakastike.
- **Massaman-curry:** AFCD F002806 raaka nahaton reisiliha, F002991
  säilykekookosmaito ja F004729 limettimehu; Fineli #304 nauris, #322
  kukkakaali, #378 maapähkinä ja #335 sipuli; Mae Ploy -massaman-currytahna,
  Foodin-erytritoli ja Squid Brand -kalakastike.

Khao kha moon liemen ravintosisältö on laskettu kokonaan neljään annokseen,
koska resepti tarjoilee haudutusliemen. Broilerin paisto- tai marinadihävikkiä
ei vähennetty. KoRo-nuudelit ovat valmiiksi valmistettuja ja niiden
ravintoarvot koskevat tuotteen etikettiä; määrä 400 g on valutettu syötävä
paino. Yrttien ja pienten mausteiden, joita laskin ei sisällä, määrä ja
arvioitu yläraja on pieni; yhteenlaskettu vaikutus jää alle 10 kcal sekä
1 gramman hiilihydraatti-, proteiini- ja rasvatoleranssin annosta kohti.
Pikkumausteista viisipippuri, kaneli, tähtianis, valkopippuri, kurkuma,
curryjauhe ja chilihiutaleet eivät ole nollaravinteisiksi oletettuja
ainesosia vaan laskennan ulkopuolelle rajattuja mausteita.

Kaikkien kahdeksan reseptin arvot ja grammapainot on synkronoitu suomen-,
englannin-, ruotsin- ja thainkielisiin julkaistuihin versioihin.
