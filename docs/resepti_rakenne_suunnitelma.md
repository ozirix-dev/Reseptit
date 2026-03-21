# ReseptiRakenneSuunnitelma

## Lukittu peruslinja

Tämä suunnitelma lukitaan nyt lähtörakenteeksi. Sitä saa myöhemmin säätää, mutta perusajatus pidetään samana:

1. **GitHubin kansiorakenne pidetään yksinkertaisena.**
2. **Pääluokitus tehdään ruokalajin mukaan.**
3. **Keto- ja VHH-luokitus tehdään reseptin metatiedoissa, ei omissa alikansioissaan.**
4. **Jokaisella reseptillä on yksi selkeä pääluokka ja useita tarkentavia tageja.**

Tämä on käytännöllisin malli sekä ylläpitoon että myöhempään julkaisuun verkkosivulla.

---

## Miksi tämä rakenne lukitaan

Reseptejä selataan tavallisesti näin:

- ensin etsitään, onko kyse alkuruoasta, pääruoasta vai jälkiruoasta
- sen jälkeen tarkennetaan ruokavaliolla, raaka-aineella, valmistustavalla tai muulla tarpeella

GitHubin ylläpidossa taas tärkeintä on, ettei samaa reseptiä tarvitse kopioida useaan paikkaan eikä kansiorakenne paisu liian syväksi.

Siksi paras käytännön ratkaisu on tämä:

- **kansio kertoo, mihin pääryhmään resepti kuuluu**
- **reseptin tiedot kertovat, onko se keto, tiukka VHH tai väljempi VHH**

Näin rakenne pysyy siistinä, mutta reseptit ovat silti helposti eroteltavissa.

---

## Pääluokitus

Lukittu pääluokitus on tämä:

- **Alkuruoka**
- **Pääruoka**
- **Jälkiruoka**

Tätä ei tässä vaiheessa muuteta.

Perustelu on yksinkertainen: tämä on yleisesti ymmärrettävä, käyttäjälle tuttu ja toimii hyvin sekä selaamisessa että myöhemmässä sivuston navigaatiossa.

---

## Keto- ja VHH-luokitus

Keto- ja VHH-luokitus pidetään mukana, mutta sitä **ei rakenneta kansiorakenteen sisään**. Se määritellään reseptin omissa metatiedoissa.

Lukittu jaottelu on tämä:

- **keto** = resepti sopii selvästi erittäin vähähiilihydraattiseen käyttöön
- **vhh_tiukka** = resepti sopii tiukkaan VHH-linjaan
- **vhh_valjempi** = resepti sopii väljemmälle VHH-linjalle

Tärkeä käytännön sääntö:

**Reseptiä ei luokitella suoraan päivän hiilarirajan perusteella, vaan reseptin annoskohtaisen hiilarimäärän ja käytännön käyttötarkoituksen perusteella.**

Tämä estää sen ongelman, että pieni annos tai lisuke näyttäisi paperilla "keto"-reseptiltä vain siksi, että annos on pieni, tai päinvastoin hyvä pääruoka putoaisi ulos luokasta vain annoskoon vuoksi.

---

## Päivärajat taustalla, mutta ei kansiorakenteessa

Koska haluat pitää mukana ajatuksen päiväkohtaisista hiilaritasoista, ne kirjataan taustaselitteeksi näin:

- **keto** = sopii yleensä malliin, jossa päivän hiilarit pidetään noin alle 20 grammassa
- **vhh_tiukka** = sopii yleensä malliin, jossa päivän hiilarit ovat noin 20–50 grammaa
- **vhh_valjempi** = sopii yleensä malliin, jossa päivän hiilarit ovat noin 50–100 grammaa

Tätä käytetään luokituksen tukena, mutta reseptin tekninen luokitus perustuu silti annoskohtaisiin tietoihin.

---

## Lopullinen kansiorakenne GitHubiin

```text
reseptit/
├── alkuruoat/
├── paaoikeat/
└── jalakiruoat/
```

Korjattu ja käytännöllinen versio kuitenkin kirjoitusasun puolesta näin:

```text
reseptit/
├── alkuruoat/
├── paaruoat/
└── jalkiruoat/
```

Jokaisen kansion sisällä on yksittäiset reseptitiedostot.

Esimerkki:

```text
reseptit/
├── alkuruoat/
│   ├── avokado-lohi-lusikkapala.md
│   └── feta-kurkku-salaatti.md
├── paaruoat/
│   ├── kermainen-lohipata.md
│   └── jauheliha-kaalipannu.md
└── jalkiruoat/
    ├── mascarpone-marjakuppi.md
    └── mantelikakku-vhh.md
```

Huomio:

- yksi resepti tallennetaan vain **yhteen** kansioon
- reseptiä ei koskaan kopioida useaan kansioon
- tarkempi luokitus tehdään metatiedoissa

---

## Reseptitiedoston pakolliset metatiedot

Jokaisen reseptin alkuun lisätään yhtenäinen metatietolohko.

Suositeltu rakenne:

```yaml
---
title: "Kermainen lohipata"
slug: "kermainen-lohipata"
category: "paaruoka"
diet_class: "keto"
carbs_net_per_serving_g: 6
carbs_total_per_serving_g: 8
protein_per_serving_g: 28
fat_per_serving_g: 34
servings: 4
main_ingredient: ["kala", "lohi"]
cooking_method: ["uuni"]
time_total_min: 40
difficulty: "helppo"
tags: ["arki", "gluteeniton", "uuniruoka", "vhh"]
status: "published"
---
```

---

## Mitä metatiedot ratkaisevat

Tämä malli ratkaisee monta ongelmaa kerralla.

### 1. GitHub pysyy hallittavana

Kansioita on vähän, ja ylläpito pysyy selkeänä.

### 2. Sama resepti voidaan löytää monella tavalla

Vaikka resepti sijaitsee vain yhdessä pääkansiossa, sitä voidaan hakea myöhemmin esimerkiksi näin:

- kaikki keto-reseptit
- kaikki kalareseptit
- kaikki uuniruoat
- kaikki helpon tason pääruoat
- kaikki gluteenittomat jälkiruoat

### 3. Verkkosivulle siirtyminen helpottuu

Kun tieto on jo metatiedoissa, siitä voi myöhemmin rakentaa automaattisesti listauksia, suodattimia, arkistosivuja ja hakunäkymiä.

---

## Lukittu luokitteluperiaate

Jokaisella reseptillä on tästä eteenpäin seuraava rakenne:

- **yksi pääluokka** = alkuruoka, pääruoka tai jälkiruoka
- **yksi diettiluokka** = keto, vhh_tiukka tai vhh_valjempi
- **useita vapaaehtoisia tageja** = esimerkiksi kala, kana, kasvis, uuni, nopea, arki, juhla

Tämä estää luokittelun hajoamisen.

Jos esimerkiksi resepti on nopea lohipata, sitä ei tallenneta useaan paikkaan kuten:

- pääruoat
- kalareseptit
- keto
- uuniruoat

Vaan näin:

- tiedosto sijaitsee kansiossa **paaruoat/**
- metatiedoissa lukee **keto**, **kala**, **uuni**, **arki**, **helppo**

Tämä on lukittu toimintatapa.

---

## Tiedostonimen standardi

Kaikissa tiedostonimissä käytetään samaa mallia:

- pienet kirjaimet
- sanat yhdysmerkeillä
- ei ääkkösiä tiedostonimissä
- ei vuosilukuja eikä turhia versiomerkintöjä

Esimerkkejä:

- `jauheliha-kaalipannu.md`
- `uunifeta-kesakurpitsa.md`
- `sitruuna-mascarpone-marjat.md`

---

## Tunnisteet, jotka kannattaa ottaa heti käyttöön

Vaikka kaikkea ei tarvitse käyttää heti, nämä tagiryhmät kannattaa varata rakenteeseen alusta asti.

### Dietti

- keto
- vhh_tiukka
- vhh_valjempi

### Raaka-ainepainotus

- kana
- kala
- naudanliha
- porsas
- muna
- kasvis
- marjat
- juusto

### Valmistustapa

- uuni
- pannu
- keitto
- salaatti
- airfryer
- no-cook

### Käyttötilanne

- arki
- viikonloppu
- juhla
- meal-prep
- nopea
- helppo

### Erityisruokavalio tai tekninen lisätieto

- gluteeniton
- maidoton
- laktoositon
- sokeriton

---

## Mitä ei tehdä

Seuraavat asiat rajataan pois, jotta rakenne ei hajoa heti alkuun:

- ei tehdä omaa kansiota jokaiselle dietille
- ei tehdä omaa kansiota jokaiselle raaka-aineelle
- ei tallenneta samaa reseptiä useaan paikkaan
- ei käytetä sekalaisia nimeämistapoja
- ei päätetä luokitusta pelkän mutu-tuntuman perusteella ilman annoskohtaisia tietoja

---

## Käytännön tallennusmalli yhdelle reseptille

Jokainen resepti tallennetaan näin:

1. valitaan pääluokka: alkuruoka, pääruoka tai jälkiruoka
2. lasketaan tai arvioidaan annoskohtaiset hiilarit
3. asetetaan diet_class: keto, vhh_tiukka tai vhh_valjempi
4. lisätään tarvittavat tagit
5. tallennetaan tiedosto oikeaan pääkansioon yhtenäisellä nimellä

---

## Julkaisun ja GitHubin yhteinen hyöty

Tämä rakenne toimii hyvin siksi, että se palvelee samanaikaisesti kahta tarvetta.

### Sinun näkökulmastasi ylläpitäjänä

- rakenne pysyy siistinä
- tiedostot löytyvät nopeasti
- laajennus onnistuu ilman kansioräjähdystä
- samaa reseptiä ei tarvitse hallita monessa paikassa

### Lukijan näkökulmasta

- resepti löytyy tutulla tavalla ruokalajin mukaan
- tarkennus onnistuu dietillä ja tageilla
- myöhemmin sivustolla voidaan tarjota suodattimia ilman rakenneuudistusta

---

## Lopullinen lukittu päätös

Tämän suunnitelman mukainen rakenne on nyt lukittu lähtömalli:

### Kansiorakenne

```text
reseptit/
├── alkuruoat/
├── paaruoat/
└── jalkiruoat/
```

### Jokaisella reseptillä on

- yksi pääluokka
- yksi diettiluokka
- annoskohtaiset ravintotiedot vähintään hiilareille
- joukko tarkentavia tageja

### Diettiluokat

- keto
- vhh_tiukka
- vhh_valjempi

### Pääperiaate

**Ruokalaji on kansiorakenne. Dietti, ravintoarvot ja muut tarkenteet ovat metatietoa.**

Tämä on tämän suunnitelman ydin, eikä sitä muuteta ilman selvää tarvetta.

---

## Seuraava käytännön askel

Kun tätä aletaan toteuttaa, seuraava vaihe on tehdä yksi valmis malliresepti tämän rakenteen mukaan, jotta formaatti lukittuu käytännössä eikä vain ajatustasolla.

