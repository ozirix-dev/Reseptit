# Reseptit

Markdown-pohjainen reseptiarkisto GitHubissa.

Tama projekti on rakennettu kaytannolliseksi, pitkalla aikavalilla yllapidettavaksi reseptirepoksi, jossa reseptit, luokittelut ja taustadokumentaatio pysyvat selkeasti erillaan mutta toimivat yhteen. Painotus on vahahiilihydraattisissa ja ketoon sopivissa resepteissa, mutta rakenne on tehty niin, etta sama repo kestaa myos laajempaa kayttoa ilman kansiokaaosta tai rinnakkaisia tiedostoversioita.

Kyse ei ole vain sekalaisesta kansiosta, johon tallennetaan resepteja Markdownina, vaan tarkoituksella rakennetusta sisaltoreposta, joka toimii:

- selattavana reseptiarkistona suoraan GitHubissa
- yllapidon kannalta johdonmukaisena tyokaluna
- pohjana mahdolliselle myohemmalle julkaisulle, haulle, suodatuksille tai sivustolle

---

## 1. Projektin idea

Projektin ideana on yllapitaa resepteja tavallisina Markdown-tiedostoina ilman raskasta tietokanta- tai julkaisujarjestelmaa.

Reseptit jarjestetaan ensisijaisesti ruokalajin mukaan, ja tarkempi tieto kuten diettiluokka, ravintoarvot, tunnisteet ja muut tarkenteet tallennetaan metatietoihin. Tama pitaa rakenteen yksinkertaisena, mutta mahdollistaa silti tarkemman luokittelun ja myohemman jatkokayton.

---

## 2. Projektin tavoite

Projektin tavoite on yhdistaa kaksi tarvetta:

- reseptien nopea ja kaytannollinen yllapito
- rakenteen hallittavuus myos silloin, kun sisalto kasvaa paljon

Tarkoitus on valttaa tilanne, jossa sama resepti loytyy useasta kansiosta, nimeaminen hajoaa tai luokittelu alkaa elaa hallitsemattomasti. Repo on siis rakennettu niin, etta sisalto pysyy helposti yllapidettavana jo alusta asti.

---

## 3. Paa-periaate

Taman repon ydinajatus on yksinkertainen:

**Ruokalaji maarittaa kansiorakenteen. Diettiluokka, ravintoarvot ja tagit kuuluvat metatietoihin.**

Kaytannossa tama tarkoittaa seuraavaa:

- yksi resepti tallennetaan vain yhteen paakansioon
- paakansio maaraytyy ruokalajin mukaan
- tarkempi luokittelu ei luo uusia rinnakkaisia kansioita

Tama malli estaa tiedostojen kopioinnin, yllapitokaaoksen ja turhan syvan kansiorakenteen.

---

## 4. Projektin rakenne

Projektin rungon ydin on taman kaltainen:

```text
D:\Reseptit
├── README.md
├── .gitignore
├── kaannokset/
├── docs/
├── meta/
├── omatmuistiinpanot/
├── reseptit/
├── kuvat/
├── tmp/
├── tuonti/
└── tools/
```

Varsinainen reseptisisalto sijaitsee `reseptit/`-kansiossa:

```text
reseptit/
├── alkuruoat/
├── paaruoat/
├── jalkiruoat/
├── raakileet/
├── arkisto/
└── _mallipohjat/
```

Mahdolliset kieliversiot voidaan tallentaa erikseen:

```text
kaannokset/
├── en/
└── th/
```

---

## 5. Kansioiden tarkoitus

### `reseptit/`

Sisaltaa varsinaiset reseptitiedostot.

- `reseptit/alkuruoat/`
- `reseptit/paaruoat/`
- `reseptit/jalkiruoat/`
- `reseptit/raakileet/`
- `reseptit/arkisto/`
- `reseptit/_mallipohjat/`

`raakileet/` on tarkoitettu keskeneraisille ideoille ja luonnoksille. `arkisto/` taas vanhoille, poistuville tai muuten sivuun siirtyville resepteille.

### `docs/`

Sisaltaa projektin ohjeistuksen, taustadokumentit ja rakenteelliset linjaukset. Tama kansio tukee yllapitoa, mutta ei ole varsinainen reseptisisallon paaalue.

### `kaannokset/`

Sisaltaa muiden kielten versiot silloin, kun monikielisyys otetaan kayttoon oikeasti. Suomenkielinen resepti toimii lahdeversiona, ja englanti- tai thai-versiot voidaan tallentaa erillisiin kielikohtaisiin tiedostoihin ilman, etta `reseptit/`-kansion perusrakenne rikkoutuu.

### `meta/`

Sisaltaa metatietoihin liittyvia maarittelyja, kuten:

- paaluokat
- diettiluokat
- tagit
- ravintokentat

### `kuvat/`

Varattu reseptikuville tai muulle media-aineistolle. Kuvien placeholder-rakenne voidaan pitaa valmiina, vaikka varsinaiset kuvat lisattaisiin vasta myohemmin.

### `tuonti/`

Varattu raakadatalla, siivottavalla aineistolla ja mahdollisella import/export-tyoskentelylla. Taman tarkoitus on erottaa valiaikainen data varsinaisesta reseptisisallosta.

### `omatmuistiinpanot/`

Paikallinen tyokansio omille luonnoksille, kokeiluille tai muulle aineistolle, jota ei haluta osaksi varsinaista reseptiarkistoa. Taman kansion sisalto pidetaan poissa julkisesta yleisrakenteesta ja versionhallinnasta.

### `tmp/`

Valiaikainen tyokansio paikallisille paketeille, zip-arkistoille ja muille lyhytikaiseen kayttoon tarkoitetuille tiedostoille. Taman kansion tarkoitus on pysya projektin laidalla, ei varsinaisessa sisaltorungossa.

### `tools/`

Sisaltaa apuskripteja, kuten reseptipohjan perusteella uuden tiedoston luontia helpottavat tyokalut.

---

## 6. Luokittelumalli

Projektissa kaytetaan kahta tasoa:

### Paa-luokka

Jokaisella reseptilla on yksi paa-luokka:

- `alkuruoka`
- `paaruoka`
- `jalkiruoka`

Tama ratkaisee, mihin kansioon tiedosto kuuluu.

### Diettiluokka

Jokaisella reseptilla voi olla yksi paaasiallinen diettiluokka:

- `keto`
- `vhh_tiukka`
- `vhh_valjempi`

Diettiluokka ei luo omaa kansiorakennetta, vaan se tallennetaan metatietoon.

---

## 7. Ravintoarvot ja metatiedot

Reseptin alkuun lisataan yhtenainen YAML-frontmatter-lohko. Taman avulla tieto pysyy rakenteisena, helposti luettavana ja myohemmin jatkokaytettavana.

Esimerkkirunko:

```yaml
---
title: "Kermainen lohipata"
recipe_id: "kermainen-lohipata"
url_slug: "kermainen-lohipata"
category: "paaruoka"
diet_class: "keto"
language: "fi"
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
status: "draft"
---
```

`recipe_id` on pysyva tekninen tunniste. `url_slug` on valinnainen julkaisu- tai reitityskayttoon tarkoitettu julkinen slug. Jos sita ei myohemmin tarvita, julkaisu voi kayttaa oletuksena `recipe_id`:ta.

---

## 8. Miksi Markdown

Markdown on tahan projektiin sopiva valinta, koska se on:

- kevyt
- pitkalla aikavalilla turvallinen
- helposti versionhallittava
- luettava suoraan GitHubissa
- editorista riippumaton

Se toimii hyvin juuri taman tyyppisessa sisaltorepossa, jossa tiedostojen hallittavuus ja muutosten vertailtavuus ovat tarkeita.

---

## 9. Nimeamissaannot

Tiedostonimissa noudatetaan seuraavia saantoja:

- pienet kirjaimet
- sanat erotetaan yhdysmerkeilla
- ei aakkosia tiedostonimissa
- ei vuosilukuja tai turhia versiotunnisteita
- tiedostonimi kertoo reseptin ytimen mahdollisimman selkeasti

Esimerkkeja:

- `jauheliha-kaalipannu.md`
- `kermainen-lohipata.md`
- `marja-mascarponekulho.md`

---

## 10. Tagit ja tarkenteet

Paa-luokan ja diettiluokan lisaksi reseptit voivat saada tageja, jotka tukevat hakua ja myohempaa suodatusta.

Tyypillisia tagiryhmia ovat:

### Raaka-aine

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

### Kayttotilanne

- arki
- viikonloppu
- juhla
- meal-prep
- nopea
- helppo

### Erityisruokavalio tai lisatieto

- gluteeniton
- maidoton
- laktoositon
- sokeriton

Tagit ovat tarkenteita, eivat rinnakkainen kansiorakenne.

---

## 11. Tyoskentelyperiaatteet

Projektissa noudatetaan seuraavia kaytannon periaatteita:

1. Yksi resepti, yksi paikka.
2. Paa-luokka ratkaisee fyysisen sijainnin.
3. Diettiluokka, ravintoarvot ja tagit kuuluvat metatietoihin.
4. Raakile saa olla keskenerainen.
5. Arkisto on sallittu ja suositeltu vanhoille tai poistuville versioille.
6. Nimeaminen ja kentat pidetaan johdonmukaisina.

---

## 12. Julkinen repository

Tama repo on tarkoituksella julkinen. Siksi tanne ei kuulu tallentaa:

- tunnuksia
- salaisuuksia
- API-avaimia
- yksityisia muistiinpanoja
- lisenssiltaan epaselvaa ulkopuolista sisaltoa

Julkisuus ei ole vahinko vaan osa taman projektin toimintamallia.

---

## 13. Mahdollinen myohempi kehitys

Rakenne on tehty niin, etta sen paalle voidaan myohemmin rakentaa esimerkiksi:

- automaattiset listaukset metatietojen perusteella
- haku ja suodatus
- staattinen reseptisivusto
- kuvien kytkenta resepteihin
- ravintoarvojen tarkempi laskenta
- tuonti muista tiedostomuodoista
- monikielisyys kaannosrakenteen kautta

Repo toimii siis seka sellaisenaan GitHubissa etta mahdollisena julkaisun pohjana.

---

## 14. Aloitusohje uudelle reseptille

Kun lisat uuden reseptin:

1. paata, onko kyse alkuruoasta, paaruoasta vai jalkiruoasta
2. luo tiedosto oikeaan paakansioon yhtenaisella nimella
3. tayta metatietorunko
4. lisaa reseptin sisalto
5. arvioi ravintoarvot ja tarvittavat tagit
6. jata resepti tarvittaessa aluksi `draft`-tilaan

Jos resepti on vasta puolikas idea, se kuuluu mieluummin `reseptit/raakileet/`-kansioon kuin valmiiden joukkoon.

---

## 15. Status

Nykyinen vaihe on perusteltu bootstrap-vaihe:

- kansiorakenne on luotu
- mallipohjat ovat olemassa
- dokumentaatio ohjaa yllapitoa
- sisaltoa voidaan alkaa kasvattaa hallitusti

Tassa vaiheessa tarkeinta ei ole reseptien maara vaan se, etta rakenne pysyy eheana ja johdonmukaisena.

---

## 16. Lisenssi

Lisenssia ei ole talla hetkella lopullisesti lukittu.

Se tarkoittaa kaytannossa sita, etta vaikka repo on julkinen, sisallon uudelleenkaytto ei ole automaattisesti vapaa ilman erillista lisenssia. Myohemmin projektiin voidaan lisata tarkoitukseen sopiva lisenssi sen mukaan, painottuuko:

- sisallon jakaminen
- rakenteen ja tyokalujen avoin kaytto
- molemmat yhdessa

---

## 17. Yhteenveto

Tama repo on rakennettu niin, etta:

- selaaminen on ihmiselle helppoa
- yllapito pysyy tekijalle hallittavana
- samaa reseptia ei tarvitse kopioida
- luokittelu ei hajoa kasista reseptimaaraan kasvaessa
- sisalto sopii seka GitHub-kayttoon etta myohempaan julkaisuun

Lyhyesti: mahdollisimman selkea reseptiarkisto nyt, mahdollisimman hyva pohja jatkoon myohemmin.
