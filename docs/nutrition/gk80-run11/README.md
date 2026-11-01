# GK-80 — AJO 11: 22 reseptin katselmointitulokset

**3 numeerista katselmointiehdotusta, 19 HOLD. Julkaisusuositus NO-GO: lukittu 15 / 18 / 20 tavoite jäi kaikilta tasoilta saavuttamatta.**

Tämä main-pohjainen Draft säilyttää koko erän päätökset ja mahdolliset täsmälliset reseptiversiot omistajan arvioitaviksi. Se ei ole valmis julkaisuintegraatio. Kaikki numeeriset tulokset ovat LOW-luottamuksen mallinnettuja arvioita. Omistajan sisältö- ja menetelmähyväksyntä puuttuu.

Erän lähdöksi lukittiin main 5761afa069ea54c9d510f1cb3c1086ae7d42f998. Kaikki neljä erää sisältävät yhteensä88 eri reseptiä; valinta ja15/18/20 tavoitteet lukittiin ennen laskentaa eikä listaa vaihdettu tulosten parantamiseksi. AJO9:n Draft PR153 jää erilliseksi.

Vain tämän docs/nutrition/gk80-run11/-hakemiston tiedostoja lisätään. Reseptien julkaistuja lähteitä, käännöksiä, Golden-rekisteriä, GI-lähdekatalogia tai ajonaikaista laskentaa ei muuteta. Runtime pysyy130/326:ssa (39,88 %). Viittä tutkimusehdotusta ei nimetä tuotantokattavuudeksi eikä integroiduksi135/326-ehdokkaaksi. Ready-siirtymää, mergeä, deployta tai ReportHub-muutoksia ei tehdä.

## Koko 22 reseptin päätösmatriisi

| Resepti | Päätös | GK/annos | Keskeinen este / rajaus |
|---|---|---:|---|
| Marseillelainen bouillabaisse-kalakeitto | HOLD | — | sahramia, kuivattua timjamia, perunoita, vaaleaa leipää |
| Dan dan -nuudelit porsaskastikkeella | HOLD | — | Erillinen GI-METHOD-02-katselmointi päätyi HOLDiin; tutkimusta ei monisteta. |
| Mausteinen poha maapähkinöillä | HOLD | — | riisihiutale, maapähkinä, curry-lehti |
| Aloo paratha jogurtin kera | HOLD | — | vehnäjauho, kuorittua perunaa |
| Eteläintialainen suolainen pongal | HOLD | — | riisi, mungpapu |
| Kaakao-kookos-chia-aamiainen | HOLD | — | kaakaojauhetta, paahdettuja kookoshiutaleita |
| Keralalainen kookos-kalacurry | HOLD | — | tamarinditahnaa, sinapinsiemeniä, tuoreita currylehtiä |
| Jianbing-tyylinen munaletty | HOLD | — | vehnäjauho, soijapaputahnaa |
| Kreikkalainen moussaka | HOLD | — | perunoita, vehnäjauhoja |
| Pistaasi-ruusuvesijogurtti | HOLD | — | pistaasi, ruusuvesi, granaattiomenan siemeniä |
| Kaya-paahtoleipä kananmunalla — koko hillomäärän punnittu versio | EHDOTUS / LOW | 20,29–27,32 | Täsmällinen punnittu versio; rajaukset alla |
| Mehevä suklaakakku | HOLD | — | tummaa suklaata, vehnäjauhoja, kaakaojauhetta, leivinjauhetta |
| Munatacot eli huevos rancheros — punnittu paprikaversio | EHDOTUS / LOW | 2,02 | Täsmällinen punnittu versio; rajaukset alla |
| Paprikainen gulassi — voin ja smetanaproxyn punnittu versio | EHDOTUS / LOW | 3,72 | Täsmällinen punnittu versio; rajaukset alla |
| Harcha-mannasuurimoleipä juustolla | HOLD | — | mannasuurimo |
| VHH-rahkapiirakka | HOLD | — | mantelijauhoa |
| Silakkapihvit tilli-kermakastikkeella | HOLD | — | ruisjauhoja, suolaa ja valkopippuria |
| Roti munalla ja banaanilla | HOLD | — | banaani, vehnäjauho |
| Kikhernepannukakku tomaattioliiveilla | HOLD | — | kikhernejauho, tuoretta rosmariinia |
| VHH-lihapiirakka | HOLD | — | mantelijauhoa |
| Raparperipiirakka – VHH | HOLD | — | mantelijauhoa |
| Vietnamilainen papaija-kookospuuro | HOLD | — | tapiokahelmiä |

## Numeeristen versioiden ravintoarvot

Saatavilla oleva HH, kokonaishiilihydraatti, proteiini ja rasva g/annos. Laskennassa käytetään täysiä lähdelukuja; näytetyt makrot pyöristetään vasta lopuksi. Kaya-leivän skenaarioväli ei ole biologinen epävarmuusväli.

| Versio | HH saatavilla | HH yhteensä | Proteiini | Rasva |
|---|---:|---:|---:|---:|
| [Kaya-paahtoleipä kananmunalla — koko hillomäärän punnittu versio](versions/malesialainen-kaya-paahtoleipa.md) | 36,59 | 40,28 | 12,18 | 26,21 |
| [Munatacot eli huevos rancheros — punnittu paprikaversio](versions/munatacot-huevos-rancheros.md) | 4,76 | 8,01 | 21,69 | 34,82 |
| [Paprikainen gulassi — voin ja smetanaproxyn punnittu versio](versions/paprikainen-vhh-gulassi.md) | 8,79 | 11,47 | 40,64 | 24,05 |

## Reseptikohtainen katselmointi

### Marseillelainen bouillabaisse-kalakeitto

ID: bouillabaisse. Alkuperäinen resepti: [reseptit/paaruoat/bouillabaisse.md](../../../reseptit/paaruoat/bouillabaisse.md). Lähde-SHA256: 15a7127f67bc3d2b2707afe6137c05ddaecf8e39e424a4c66502c8e4a7a9218c.

**HOLD — ei koko reseptin GK:ta.**

- **sahramia**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **kuivattua timjamia**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **perunoita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F205; saatavilla oleva HH 15.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vaaleaa leipää**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F1107; saatavilla oleva HH 53.348 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Dan dan -nuudelit porsaskastikkeella

ID: dan-dan-nuudelit. Alkuperäinen resepti: [reseptit/paaruoat/dan-dan-nuudelit.md](../../../reseptit/paaruoat/dan-dan-nuudelit.md). Lähde-SHA256: 81db676010a87a0a2b4a9dbd081ca672659fec2027fc82237b8bc606c3f34664.

**HOLD — ei koko reseptin GK:ta.**

- Erillinen GI-METHOD-02-katselmointi päätyi HOLDiin; tutkimusta ei monisteta.

### Mausteinen poha maapähkinöillä

ID: indialainen-poha-maapahkinoilla. Alkuperäinen resepti: [reseptit/aamupalat/indialainen-poha-maapahkinoilla.md](../../../reseptit/aamupalat/indialainen-poha-maapahkinoilla.md). Lähde-SHA256: 70651af4a46cc2443fba33b56c5f83235bf2bd608ba3f450b1f8f8c49f2a7485.

**HOLD — ei koko reseptin GK:ta.**

- **riisihiutale**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F182; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **maapähkinä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006107; saatavilla oleva HH 8.9 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **curry-lehti**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Aloo paratha jogurtin kera

ID: intialainen-aloo-paratha. Alkuperäinen resepti: [reseptit/aamupalat/intialainen-aloo-paratha.md](../../../reseptit/aamupalat/intialainen-aloo-paratha.md). Lähde-SHA256: 355753da95cc04ac8822f76a8ff51f5017a7b9bf4ce12de727abb1e5e7d6bfbc.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuorittua perunaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F205; saatavilla oleva HH 15.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Eteläintialainen suolainen pongal

ID: intialainen-ven-pongal. Alkuperäinen resepti: [reseptit/aamupalat/intialainen-ven-pongal.md](../../../reseptit/aamupalat/intialainen-ven-pongal.md). Lähde-SHA256: 7ab0b5f0350e1e9631afbe1a3cad9d99b9e6788ec1ecbf83fd1e400a5e242763.

**HOLD — ei koko reseptin GK:ta.**

- **riisi**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007682; saatavilla oleva HH 74.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **mungpapu**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000446; saatavilla oleva HH 41.9 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kaakao-kookos-chia-aamiainen

ID: kaakao-kookos-chia. Alkuperäinen resepti: [reseptit/aamupalat/kaakao-kookos-chia.md](../../../reseptit/aamupalat/kaakao-kookos-chia.md). Lähde-SHA256: 909dc73c356b1db0d393ddd5a22ebfafd76b557f5fa5068b60c624da4a72c700.

**HOLD — ei koko reseptin GK:ta.**

- **kaakaojauhetta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F20; saatavilla oleva HH 11.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **paahdettuja kookoshiutaleita**: Vaadittu ravintotekijä tai polyolitieto puuttuu. Koostumus F382; saatavilla oleva HH 6.4 g/100 g; polyolit puuttuu.

- **paahdettuja kookoshiutaleita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F382; saatavilla oleva HH 6.4 g/100 g; polyolit puuttuu. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Keralalainen kookos-kalacurry

ID: kerala-kalacurry. Alkuperäinen resepti: [reseptit/paaruoat/kerala-kalacurry.md](../../../reseptit/paaruoat/kerala-kalacurry.md). Lähde-SHA256: 0c2d96d105ba258e741c9e50ffd7250f20f59167e63fb4850757f98dc46e2fed.

**HOLD — ei koko reseptin GK:ta.**

- **tamarinditahnaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A009081; saatavilla oleva HH 57.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **sinapinsiemeniä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **tuoreita currylehtiä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Jianbing-tyylinen munaletty

ID: kiinalainen-jianbing-munaletty. Alkuperäinen resepti: [reseptit/aamupalat/kiinalainen-jianbing-munaletty.md](../../../reseptit/aamupalat/kiinalainen-jianbing-munaletty.md). Lähde-SHA256: fade773e583d0ee2f045702a3b4e2e1c65064b1ab3a5e227c2d9818c01e83289.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijapaputahnaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A005702; saatavilla oleva HH 19.7 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kreikkalainen moussaka

ID: kreikkalainen-moussaka. Alkuperäinen resepti: [reseptit/paaruoat/kreikkalainen-moussaka.md](../../../reseptit/paaruoat/kreikkalainen-moussaka.md). Lähde-SHA256: a421dde851b40359047315504ab0e13ab47ee77719df7dae12594af2d579a684.

**HOLD — ei koko reseptin GK:ta.**

- **perunoita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F205; saatavilla oleva HH 15.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vehnäjauhoja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Pistaasi-ruusuvesijogurtti

ID: lahi-ita-pistaasijogurtti. Alkuperäinen resepti: [reseptit/aamupalat/lahi-ita-pistaasijogurtti.md](../../../reseptit/aamupalat/lahi-ita-pistaasijogurtti.md). Lähde-SHA256: f9a1d41f86c92902bbda7c9f224cbc8de48900ec7726625a482f1ecea794a9e1.

**HOLD — ei koko reseptin GK:ta.**

- **pistaasi**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006113; saatavilla oleva HH 7.8 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **ruusuvesi**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **granaattiomenan siemeniä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006842; saatavilla oleva HH 13.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kaya-paahtoleipä kananmunalla — koko hillomäärän punnittu versio

ID: malesialainen-kaya-paahtoleipa. Alkuperäinen resepti: [reseptit/aamupalat/malesialainen-kaya-paahtoleipa.md](../../../reseptit/aamupalat/malesialainen-kaya-paahtoleipa.md). Lähde-SHA256: 9ed7ae702fd399d11e8487c838343828207c2c6c064ba1b221514efe515f12bf.

**EHDOTUS / LOW — sisältö- ja menetelmähyväksyntä puuttuu.** Koko kaya-hillo, molemmat kananmunat ja kaikki paistorasva kulutetaan kahdessa annoksessa. Finelin vaalea maalaisleipä on koostumusproxy hapanjuurityyppiselle leivälle. Molemmat leipävertailut GI 54 ja 82 säilytetään; tulosalue on kahden lähdevertailun ero, ei biologinen tai tilastollinen epävarmuusväli. Kookosmaito on Finelin 21,33 % rasvaa sisältävä proxy. Leipää vain lämmitetään kuivalla pannulla; öljy kuuluu kananmunalle.

[Valmistus ja kaikki punnitut ainekset](versions/malesialainen-kaya-paahtoleipa.md). Täsmällinen syötehash: 0f28ae8993d57916a83c7368b262e46aa6fa47ad85ac78f82fdccef3e1d533a3. Kaikki lähdekohtaiset GI-sovellukset ja koostumusproxyt ovat recipes.json- ja sources.json-tiedostoissa.

### Mehevä suklaakakku

ID: meheva-suklaakakku. Alkuperäinen resepti: [reseptit/jalkiruoat/meheva-suklaakakku.md](../../../reseptit/jalkiruoat/meheva-suklaakakku.md). Lähde-SHA256: a06e4c19b30eb701df9fdd76435153ceb6d14cf4cf4769360dde92de2dff9d3a.

**HOLD — ei koko reseptin GK:ta.**

- **tummaa suklaata**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F32; saatavilla oleva HH 53.26 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vehnäjauhoja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kaakaojauhetta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F20; saatavilla oleva HH 11.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **leivinjauhetta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000247; saatavilla oleva HH 19.8 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **tummaa suklaata**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F32; saatavilla oleva HH 53.26 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Munatacot eli huevos rancheros — punnittu paprikaversio

ID: munatacot-huevos-rancheros. Alkuperäinen resepti: [reseptit/aamupalat/munatacot-huevos-rancheros.md](../../../reseptit/aamupalat/munatacot-huevos-rancheros.md). Lähde-SHA256: 079fec7114ae9e414a85de9e2781ebc89d43e809169d90926667fd1168c3c40f.

**EHDOTUS / LOW — sisältö- ja menetelmähyväksyntä puuttuu.** Kaksi munakasta toimii kuorina; tavallisia tortilloja ei lisätä. Paprikajauheen koostumus on AFCD:n yleinen kuiva paprika, ei varmennettu savupaprikatuote. Sipuli, avokado, mausteet, korianteri ja kaikki voi punnitaan. Pienen mausteosuuden nykyiset ainesosa- ja yhteismäärärajat tarkistettiin.

[Valmistus ja kaikki punnitut ainekset](versions/munatacot-huevos-rancheros.md). Täsmällinen syötehash: 9386c1bc946543f9c94e9105e0e2e058f2d1541bfd453e097bb8dfe411c3ccaa. Kaikki lähdekohtaiset GI-sovellukset ja koostumusproxyt ovat recipes.json- ja sources.json-tiedostoissa.

### Paprikainen gulassi — voin ja smetanaproxyn punnittu versio

ID: paprikainen-vhh-gulassi. Alkuperäinen resepti: [reseptit/paaruoat/paprikainen-vhh-gulassi.md](../../../reseptit/paaruoat/paprikainen-vhh-gulassi.md). Lähde-SHA256: 0c9af581ee1838efba58eb62b2ef8ac3d5b84e792bc4668c5fe27b02c4b50c6c.

**EHDOTUS / LOW — sisältö- ja menetelmähyväksyntä puuttuu.** Versio valitsee 21 g voita, käyttövalmiin lihaliemen sekä nimetyn AFCD:n 36,3 % rasvaa sisältävän smetanaproxyn. Kaikki kastike ja rasva syödään. Tomaattipyreelle 15 g sovelletaan erikseen kasvisoletusta 40 tiivistetyn, murskatun, ruoassa säilyvän tärkkelyksettömän kasviksen analogiana. Tämä ei ole mitattu tomaattipyreen GI eikä uusi yleinen menetelmäsääntö; juuri tämä rajattu sovellus tarvitsee omistajahyväksynnän.

[Valmistus ja kaikki punnitut ainekset](versions/paprikainen-vhh-gulassi.md). Täsmällinen syötehash: 2eb490d2f50e423c09f6099b173486f9fc091c466fad73487552275478995450. Kaikki lähdekohtaiset GI-sovellukset ja koostumusproxyt ovat recipes.json- ja sources.json-tiedostoissa.

### Harcha-mannasuurimoleipä juustolla

ID: pohjoisafrikkalainen-harcha-juustolla. Alkuperäinen resepti: [reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md](../../../reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md). Lähde-SHA256: e9d16b10d288751693eea94779000da147e386c91d74c86f732b1f8fbe08e06d.

**HOLD — ei koko reseptin GK:ta.**

- **mannasuurimo**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F112; saatavilla oleva HH 63.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### VHH-rahkapiirakka

ID: rahkapiirakka-vhh. Alkuperäinen resepti: [reseptit/jalkiruoat/rahkapiirakka-vhh.md](../../../reseptit/jalkiruoat/rahkapiirakka-vhh.md). Lähde-SHA256: e902035d36263b4ad41d337d5fed8283d76e8fffcbfc87c28d53076c075dfdab.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Silakkapihvit tilli-kermakastikkeella

ID: silakkapihvit-tilli-kermakastike. Alkuperäinen resepti: [reseptit/paaruoat/silakkapihvit-tilli-kermakastike.md](../../../reseptit/paaruoat/silakkapihvit-tilli-kermakastike.md). Lähde-SHA256: c2a1a660591eee52740e6356f88172ca92f765d4aad9e6dffb3044e32f590389.

**HOLD — ei koko reseptin GK:ta.**

- **ruisjauhoja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F100; saatavilla oleva HH 59.391 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **suolaa ja valkopippuria**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Roti munalla ja banaanilla

ID: thai-roti-munalla-banaanilla. Alkuperäinen resepti: [reseptit/aamupalat/thai-roti-munalla-banaanilla.md](../../../reseptit/aamupalat/thai-roti-munalla-banaanilla.md). Lähde-SHA256: 01b5f49344afa698e599aa1ae8672649a18182892227ae5aa8d49b07e582c0ba.

**HOLD — ei koko reseptin GK:ta.**

- **banaani**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F11049; saatavilla oleva HH 18.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kikhernepannukakku tomaattioliiveilla

ID: valimerellinen-farinata-aamupalaksi. Alkuperäinen resepti: [reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md](../../../reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md). Lähde-SHA256: 1b15fd29f9d833b84289c2d1345e27a0110c4bda7044ed6939d581ede947d237.

**HOLD — ei koko reseptin GK:ta.**

- **kikhernejauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A003986; saatavilla oleva HH 38.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **tuoretta rosmariinia**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### VHH-lihapiirakka

ID: vhh-lihapiirakka. Alkuperäinen resepti: [reseptit/leivonnaiset/vhh-lihapiirakka.md](../../../reseptit/leivonnaiset/vhh-lihapiirakka.md). Lähde-SHA256: 8b5071d4c6b08847a0855b630b34ee55471ed00cf6f61b9687e25f56f3ec96a9.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Raparperipiirakka – VHH

ID: vhh-raparperipiirakka. Alkuperäinen resepti: [reseptit/jalkiruoat/vhh-raparperipiirakka.md](../../../reseptit/jalkiruoat/vhh-raparperipiirakka.md). Lähde-SHA256: 3a467afacaac68ffe88a084834e3a084e0563f85432725543e24d67e232454ca.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Vietnamilainen papaija-kookospuuro

ID: vietnamilainen-papaija-kookospuuro. Alkuperäinen resepti: [reseptit/aamupalat/vietnamilainen-papaija-kookospuuro.md](../../../reseptit/aamupalat/vietnamilainen-papaija-kookospuuro.md). Lähde-SHA256: 02440d7cfaac9b9b3b79e2467ee0fc4bd26afc49a0204253accf3478992aec99.

**HOLD — ei koko reseptin GK:ta.**

- **tapiokahelmiä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A009090; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

## Lähde- ja laskentaperiaatteet

Tämä on rajatun lähdekatselmoinnin tulos, ei väite siitä, ettei muualla voisi olla soveltuvaa tutkimusta. Osittainen ainesosasumma tai tunnetut makrot eivät ole koko reseptin GK. HOLD-päätöksissä wholeGk ja julkaistavat kokonaismakrot jäävät nulliksi.

Finelin CHOAVL ja AFCD:n available carbohydrate without sugar alcohols ovat jo kuitua ja polyoleja vailla. Polyoleja ei vähennetä niistä uudelleen. Kokonaishiilihydraatti lasketaan saatavilla olevasta hiilihydraatista, kuidusta ja varmennetuista polyoleista. Lähteessä puuttuva polyoli pysyy puuttuvana. AFCD:n alkuperäinen Excel luettiin ja sen paritetut hiilihydraattikentät tarkistettiin; tietueita ei väitetä tänään verkosta ladatuiksi.

Nykyisen nimetyn vähähiilihydraattisen oletuksen 50 ehto on saatavilla oleva hiilihydraatti enintään 5 g/100 g. Mantelijauho 5,4, naudanmaksa 5,031, Finelin soijakastike 9,5 ja yleinen sinappi 14,1 eivät alita rajaa. Raja-arvoja ei pyöristetä hyväksyttäviksi. Kokonaisen pavun/pähkinän GI ei sellaisenaan todista jauhon, tahnan, taikinan tai sekaruoan GI:tä. Pienen mausteosuuden ehto on enintään 0,5 g saatavilla olevaa hiilihydraattia ainesosasta/annos ja enintään 1 g yhteensä. Sääntöä ei laajenneta jauhoihin tai tahnoihin.

Valmistus- ja identiteettikorjaukset koskevat vain tutkimuspaketin ehdotuksia: esimerkiksi tavallinen limetti ei ole AFCD:n native lime, Fineli 310 on maa-artisokka eikä peruna, ja paksoi ei ole kiinankaali. Nykyisiä reseptejä ei korvata hiljaisesti toisilla raaka-aineilla.


[Alkuperäislähteet, uudet lähdehavainnot ja rajoitukset](source-review.md). Uusi ihmis-GI-lähdelöydös ei yksin tuota kokonaisen reseptin GK:ta.

## Tehty varmennus

Muuttumattomalla mainin tyypitetyllä GK-moottorilla tarkistettiin yhteensä86 mallia (kaksi koordinaatio-HOLDia ilman rinnakkaismallia), niiden lähdesidonnat ja Golden-Decimal-vastaavuus. Lisäksi kaikki viisi numeerista versiota läpäisivät projektin neljän makron nutrition-evidence-tarkistuksen. verification.json tallentaa tämän erän tuloksen ja käytettyjen moottoritiedostojen hashit. Teknisesti PASS ei ole riippumaton tieteellinen hyväksyntä.

Toistettava, read-only tarkistus: python docs/nutrition/gk80-run11/verify.py. Se tarkistaa22 päätöstä, lähdetekstit ja hashit, koostumusten pääviitteet, kaikki skenaariot, riippumattoman Decimal-laskennan, viiden ehdotuksen neljä makroa sekä sen, että mainiin verrattu diff ja uudet tiedostot rajoittuvat tämän paketin hakemistoon. Tässä erässä tarkistetaan vain sen omat numeeriset versiot. Julkaistuja130 tulosta säilyttää muuttumaton aktiivinen laskenta; niitä ei laskettu uudestaan näillä tutkimusmalleilla.

Ei paikallista sivuston kokonaisbuildia eikä selaintestiä: sivuston koodi ja julkaistavat reseptit eivät muutu. PR:n normaali CI käynnistyy kerran lopulliselle HEADille; sen tilan voi tarkistaa PR:n Checks-näkymästä. CI:n mahdollinen build tarkistaa muuttumattoman runtime-aineiston, ei hyväksy tätä lähdetutkimusta.

## Katselmointiin tuotava päätös

Koko erä on valmis tämän rajatun katselmoinnin tuloksena arvioitavaksi. Julkaisuvaiheeseen etenemistä ei suositella nykyisellä saannolla. Omistaja voi arvioida nimetyt punnitut versiot ja menetelmärajaukset yhtenä kokonaisuutena; HOLD-aineisto pysyy erillään kaikista numeerisista tuloksista. Mahdollinen myöhempi integraatio, Ready, merge ja tuotantodeploy vaativat oman toimeksiantonsa. Uutta tutkimusajoa ei ole käynnistetty tämän paketin jälkeen.
