# C5 – Huevos divorciados V2: tomaatin koostumus ja valutettujen papujen laskentaperusta (11.11.2026)

**Johtopäätös: koko aterian aritmeettinen skenaario on nyt laskettu, mutta tuotekohtainen ravintoarvojen hyväksyntä edelleen HOLD.** Ei muutoksia reseptin julkisiin kenttiin, GK:hon tai alkuperäiseen draftiin. Tämä täydentää PR #468:n raporttia eikä korvaa sen lukittuja lähteitä.

## Täsmähavainnot

1. GoGreen Ruotsissa viljellyt mustapavut 380 g / valutettu 230 g, EAN **7310130009785**, on K-Ruoan sivulla merkitty **"Tuotteen valmistus on lopetettu"**. K-Ruoka ilmoittaa ravintosisällön **"100 g Tuote myyntihetkellä"**, EI 100 g valutettua, huuhtelun jälkeen punnittua papumassaa. Verkkokauppatieto ei siksi todista 150 g valutetun annoksen ravintosisältöä. https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-ruotsal-7310130009785
2. GoGreen Italiassa valmistettu mustapapu, EAN **7310130009839**, on valmistajan tiedoissa 14 g HH /100 g, proteiini 7,4, rasva 0,8 ja kuitu 10 g/100 g. https://www.gogreen.fi/tuotteet/mustapavut/ . **Eri etikettiversioita on myös verkossa ristiriitaisesti:** Tokmannin EAN 7310130009839 -nimisessä PDF:ssä on 8,5 g HH/100 g (https://res.cloudinary.com/tokmanni/image/upload/7310130009839_et1.pdf), vaikka sen tuotteen verkkosivu ilmoittaa 14 g. Tätä ristiriitaa ei saa hiljaisesti ratkaista poimimalla sopiva arvo.
3. Valutettu paino 230 g tarkoittaa erillistä syötävää papumassaa; siitä ei voi johtaa ravintoarvoa pelkällä 230/380-kertoimella. Myyntitilan liemen osuus ja 100 g etiketin laskentapohja on valmistajalta vahvistettava. Pelkkä ravintoarvomerkinnän 'per 100 g' ei osoita, että perusta on valutusmassa.
4. Tomaatin laskentatietueeksi on valittu **raaka tomaatti, Finelin rajapinnasta julkaistu koostumus**: saatavilla olevat HH 3,45 g, proteiini 0,55 g, rasva 0,30 g, kuitu 1,4 g / 100 g, polyolit 0 g /100g. https://ravinto.ptjesse.fi/tomaatti/ . Finelin tietueen numeerista elintarvike-ID:tä ei varmistettu suoraan tästä lähteestä: siten tämä on avoimesti tunnistettu *Fineli-derived* koostumusrivi, ei keksitty täsmä-ID. 120 g reseptimassa on suunniteltu syötävä raakapaino, veden haihtuminen vaikuttaa lopulliseen annospainoon mutta ei itsessään näiden makrojen summaan.
5. La Costeña Salsa Verde EAN **7501017005925** K-Ruoan suomalainen etiketti 3,9 g HH, 0,9 g proteiini, 0,9 g rasva /100 g. https://www.k-ruoka.fi/kauppa/tuote/la-costena-salsa-250g-verde-7501017005925. S-kauppojen ja Espanjan listaukset tukevat samaa päämakroprofiilia, mutta suomalainen sivu ei kerro kuidun määrää. Espanjalaisella samalla EANilla ilmoitetaan 2,1 g kuitua/100 g (https://www.online.bmsupermercados.es/es/p/salsa-verde-250-g/65451); **suomalaiseen laskentaan kuitu jää nulliksi**, kunnes etiketti varmistettu.

## Riippumaton koko reseptin ehdollinen makrolaskenta

Kaava jokaiselle ainesosalle: (ainesosan syötävä g × koostumus g/100g /100) / 2 annosta. Kaksi munaa **oletuksena** 110 g kuoretonta (Fineli 858, aiempi laskentalähde). Öljy 13,5 g koko erään, rasva 99,9 g/100g (Fineli 541); valittu papu on **vain väliaikainen laskentaehdokas** EAN 7310130009785, jonka myyntitilan lukuja käytetään *ehdollisesti* valutettuun massaan. Reseptin ravintosisältöä ei hyväksytä.

| Aines / 2 annosta | HH /annos g | P /annos g | R /annos g |
|---|---:|---:|---:|
| 150 g GoGreen Ruotsi mustapapu (oletettu etikettiperustan vastaavuus) | 6,375 | 5,625 | 0,825 |
| 150 g La Costeña Salsa Verde | 2,925 | 0,675 | 0,675 |
| 110 g kuoreton kananmuna | 0,165 | 6,9355 | 5,082 |
| 120 g raaka tomaatti | 2,070 | 0,330 | 0,180 |
| 13,5 g paistoöljyä, 0–100 % jäljelle | 0 | 0 | 0–6,74325 |
| **Yhteensä /annos** | **11,535 → 11,54** | **13,5655 → 13,57** | **6,762–13,50525 → 6,76–13,51** |

**Herkkyys paputuotteelle (ei suoraan vertailukelpoisia ravintoperustoja):** jos tilalla 150 g italialaista GoGreeniä (14 g HH/100g), HH olisi **15,66 g/annos**, mikä on **4,125 g/annos** enemmän. Tämä on pelkkä tuotevaihtoehdon skenaario, EI korjattu lopullinen laskelma.

**Kuitu:** ehdollisesti Ruotsin papu 150×8,5/100/2 = **6,375 g/annos**; tomaatti 120×1,4/100/2 = **0,84 g/annos**. Salsa kuidun suomalainen tuoteperusta edelleen **null**, joten koko annoksen kuitu ja kuidun sisältävä kokonaishiilihydraatti **null**. GK **null/HOLD**, tuotekohtaista GI-vastaavuutta ei varmennettu. Ei kuidun tai polyolien nollaamista tuntemattoman tiedon kohdalla.

## Vapautusehdot

- Vaihda poistuneen Ruotsi-tuotteen sijaan aktiivinen, yksilöity ja saatavissa oleva tuote **vasta kun** etiketti sekä ravintosisällön *valutettu vs myyntitila* -määritelmä vahvistettu (tarvittaessa valmistajalta). Älä valitse muuttunutta EANia automaattisesti.
- Varmista salsan käytettävä pakkaus, munien syötävä massa ja öljyn retentio; vahvista tomaatin alkuperäisen Fineli-tietueen ID ennen lopullista nutrition-JSONia.
- Aja aineskohtainen laskenta uudella vahvistetulla syötteellä, GI/GK-portti erikseen, valmistuksen ja käännösten tarkistus ennen reseptin julkaisua.

**Näin ollen: laskentamallin rakenteellinen aukkokohta tomaatin osalta korjattu, papujen valutuspainoon liittyvää todistusaineistoa ei löytynyt riittävästi. Tuotannon makrot ja GK pidetään edelleen null/HOLD.**
