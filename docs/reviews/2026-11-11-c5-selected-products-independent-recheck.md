# C5 – valitut täsmätuotteet ja riippumaton annoslaskennan tarkistus (11.11.2026)

**Tila: DRAFT / HOLD.** Tämä on rinnakkainen aritmeettinen tarkistus eikä fyysinen pakkaus- tai koepaistovarmennus. Se ei hyväksy eikä muuta julkisia ravinto-/GK-lukuja. Lähtöaineistot: PR #464, FI V2 -draftit ja `docs/nutrition/calculations/kiinalainen-jianbing-munaletty.json` (AUTOMATED ONLY).

## 1. Valinnat: yksi tuotteeksi yksilöity laskentavaihtoehto per rivi

| Resepti | Aines | Valittu laskentaehdokas | Tuotetiedot |
|---|---|---|---|
| Jianbing V2 | 15 g soijapapukastiketta/2 annosta | Lee Kum Kee Yellow Bean / Soy Bean Sauce 240 g, EU-jälleenmyyjän tunniste **078895151473** | 22 g hiilihydraattia, 6,5 g proteiinia, 5,2 g rasvaa /100 g. Lähde: https://www.piccantino.com/lee-kum-kee/yellow-bean-sauce |
| Huevos V2 | 150 g kypsiä valutettuja papuja/2 annosta | **GoGreen Ruotsissa viljellyt mustapavut 380/230 g, EAN 7310130009785** | K-Ruoka ilmoittaa **myyntihetkellä** 8,5 g HH, 7,5 g proteiinia, 1,1 g rasvaa, 8,5 g kuitua /100 g. https://www.k-ruoka.fi/kauppa/tuote/gogreen-mustapavut-380230g-ruotsal-7310130009785 |
| Huevos V2 | 150 g vihreää salsaa/2 annosta | **La Costeña Salsa Verde 250 g, EAN 7501017005925** | 3,9 g HH, 0,9 g proteiinia, 0,9 g rasvaa /100 g. https://www.s-kaupat.fi/tuote/la-costena-salsa-verde-salsakastike-250g/7501017005925 |

**Erittäin tärkeä tuotteen identiteettiero:** GoGreenin Italiassa valmistetun mustapapupurkin **EAN 7310130009839** ravintoarvo on **14 g HH/100 g**, ei 8,5 g. Valmistajan sivu https://www.gogreen.fi/tuotteet/mustapavut/ ja S-kaupat https://www.s-kaupat.fi/tuote/gogreen-mustapavut-380g/7310130009839 ilmoittavat tämän. **Eri EANit = eri laskentaehdokkaat**. Italian vaihtoehdolla 150 g/2 tuottaa **10,50 g** papu-HH/annos; valittu ruotsalainen antaa **6,375 g** — erotus **4,125 g/annos**. Kumpikaan etikettiluku ei yksin vahvista valutetun syötävän 150 gramman ravintoarvoa.

Myös saman Lee Kum Kee -tuotenimen Australian/Hongkongin makromerkinnät eroavat. EU-tietoja ei sekoiteta muihin markkina-arvoihin. Valittu EAN/jälleenmyyjä ei ole fyysisesti tarkistettu käyttöpakkauksesta. Kastike sisältää soijaa ja vehnää, joten jianbing ei ole gluteeniton.

## 2. Riippumaton laskenta: Jianbing V2

Laskin itse suoraan V2:n ainesmääristä käyttäen aikaisemman ainekohtaisen laskennan dokumentoituja Fineli/AFCD-arvoja *muille* raaka-aineille sekä yllä olevan nimetyn EU-tuotteen kastike-etikkettiä. Näin laskelma ei kopioi PR #464:n jo pyöristettyä lopputulosta. Kaava jokaiselle makrolle on **summa (grammat × ravintoarvo per 100 g / 100) / 2**.

| Aines (koko 2 annoksen erä) | HH g/100 g | Proteiini g/100 g | Rasva g/100 g |
|---|---:|---:|---:|
| Kananmuna, kuoreton, 110 g (2 × oletus 55 g) | 0,3 | 12,61 | 9,24 |
| Vehnäjauho, 100 g | 73,998 | 11,6 | 1,56 |
| Kevätsipuli 12 g | 4,6 | 1,7 | 0,2 |
| Seesaminsiemen 8 g | 1,171 | 24,6 | 59,7 |
| Öljy 13,5 g, skenaario 100 % jää ruokaan | 0 | 0 | 99,9 |
| Valittu EU-kastike 15 g | 22 | 6,5 | 5,2 |

**Laskettu per annos:** saatavilla olevat hiilihydraatit **39,13684 → 39,14 g**, proteiini **14,309 → 14,31 g**, rasva **15,39525 → 15,40 g**. Tarkistus täsmää PR #464:n EU-skenaarioon. Vesi ja suola eivät muuta näitä makroja; munien syötävä massa 110 g sekä kaiken paistoöljyn imeytyminen ovat oletuksia, eivät mittauksia.

Öljyn herkkyys (muiden aineiden pysyessä vakiona), rasvaa/annos: 0 % öljystä **8,65 g**; 50 % **12,02 g**; 75 % **13,71 g**; 100 % **15,40 g**. Nämä ovat vain skenaarioita. Kastikkeen kuitu ja polyolit jäävät **null**; kuidun sisältävää kokonaishiilihydraattia ja GK-arvoa **ei voi hyväksyä**. EU-merkityn kastikkeen ilmoitetut hiilihydraatit tulkitaan ehdollisesti saataviksi hiilihydraateiksi; pakkauksen sisältö ja merkintä vahvistettava.

## 3. Riippumaton laskenta: Huevos divorciados V2

Tämä on **erillinen aineskohtainen osalaskenta**, ei koko annoksen hyväksytty makrotaulukko. Samalla kaavalla, kahdelle annokselle:

| Aines | HH g / annos | Proteiini g / annos | Rasva g / annos | Laskennan rajoite |
|---|---:|---:|---:|---|
| GoGreen Ruotsi, 150 g valutettua papua | **6,375** | **5,625** | **0,825** | *Vain jos* 100 g:n etiketin myyntitilan arvot soveltuvat valutettuun massaan |
| La Costeña, 150 g salsaa | **2,925** | **0,675** | **0,675** | Etiketti vahvistettava käytetystä purkista |
| Kaksi munaa, yhteensä 110 g kuoretonta (Fineli 858) | **0,165** | **6,9355** | **5,082** | Munien todellinen kuoreton massa mittaamatta |
| 13,5 g öljyä | **0** | **0** | **0–6,74325** | Retentio 0–100 %, ei mitattu |
| Tuore tomaatti 120 g | **EI LASKETTU** | **EI LASKETTU** | **EI LASKETTU** | Täsmällinen koostumustietue/kypsennyshävikki vielä valitsematta |

**Osalaskennan tunnetut ehdolliset erät ilman tomaattia:** HH 9,465 g/annos, proteiini 13,2355 g/annos, rasva 6,582–13,32525 g/annos. Näitä **ei saa julkaista koko ruoan ravintoarvoina**. Valutuspainon puute voi muuttaa papujen ravintoarvoa merkittävästi. Salsa on meksikolainen tomatillopohjainen salsa, ei yrtti-öljysalsa. Lähteen https://www.online.bmsupermercados.es/es/p/salsa-verde-250-g/65451 mukaan samalle EANille on myös ilmoitettu 2,1 g kuitua/100 g, mutta tätä ei vielä siirretä suomalaiseen tuotemääritelmään ilman pakkausvarmennusta.

## 4. Jäljellä olevat hyväksynnän esteet

1. **Jianbing:** todellinen EU-tuotepakkaus ja valmistajan formulointi, tuotteen kuitu/polyolit, munien kuoreton paino sekä öljyn retentio; erillinen GI→GK-lähdevastaavuus.
2. **Huevos:** käytetyn GoGreen-EANin täsmäpakkaus; vahvistus sille, koskevatko myyntihetken makrot 100 g valutettua papua; La Costeñan pakkaus; 120 g tomaatin riippumaton koostumustietue; munien massa ja öljyretentio; riippumaton GK-käsittely.
3. V2-draftin valmistus, ruokaturvallisuus, merkitysvastaavuus ja mahdolliset i18n-versiot käsitellään ennen julkaisua. Ei automaattista `status: published` -muutosta.

**Päätös:** Valitut nimetyt tuotteet ovat laskentaehdokkaita. Tulokset ovat tarkistettuja *ehdollisia skenaarioita*, eivät hyväksyttyjä ravintoarvoja. **0 reseptiä julkaistaan; ravintoarvot jäävät nulliksi ja GK HOLD-tilaan.** Vanhoihin lähdetiedostoihin tai PR #464:n tarkistimen lukitsemiin blob-SHA-arvoihin ei tehdä muutoksia.
