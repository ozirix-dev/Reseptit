# Reseptit

Laajeneva reseptiarkisto GitHubissa.

Tämä projekti on rakennettu käytännölliseksi, pitkäikäiseksi ja ylläpidettäväksi reseptivarastoksi, jonka sisältö kirjoitetaan Markdown-muotoon. Painotus on vähähiilihydraattisissa, ketoon sopivissa ja muuten arjessa toimivissa resepteissä, mutta rakenne on tehty niin, ettei koko projekti kaadu siihen, vaikka mukaan tulee myöhemmin myös väljempiä VHH-reseptejä, tavallisempia kotiruokia, jälkiruokia, kokeiluja tai raakileita.

Tämä ei ole vain sekalainen kansio reseptejä varten, vaan tietoisesti rakennettu sisältörepo, jossa:

- reseptejä on helppo kirjoittaa, muokata ja siivota
- rakenne pysyy hallittavana myös silloin, kun reseptien määrä kasvaa
- samaa reseptiä ei tarvitse kopioida useaan paikkaan
- luokittelu voidaan pitää selkeänä sekä ihmiselle että myöhempää automaatiota varten
- repo toimii samalla pohjana mahdolliselle verkkosivulle, haulle, suodatuksille tai muulle jatkokehitykselle

---

## Projektin tavoite

Tämän projektin tavoite on yhdistää kaksi asiaa, jotka ovat usein ristiriidassa keskenään:

Ensimmäinen tarve on käytännön ruoanlaitto. Reseptin pitää löytyä nopeasti, olla helposti muokattavissa ja pysyä luettavana ilman raskasta järjestelmää.

Toinen tarve on rakenteellinen hallittavuus. Kun reseptejä kertyy enemmän, pelkkä “laitetaan ne kansioon” ei enää riitä. Tiedostot alkavat hajota, nimeäminen lipsuu, sama ajatus löytyy viidestä eri paikasta ja lopulta koko arkisto muuttuu hitaasti sotkuksi.

Tässä repossa pyritään estämään tuo kehitys jo alussa.

Perusidea on yksinkertainen:

**Ruokalaji määrää kansiorakenteen. Diettiluokka, ravintoarvot ja muut tarkenteet kuuluvat reseptin metatietoihin.**

Tämä ratkaisu pitää selaamisen helppona ja samalla estää sen, että sama resepti pitäisi tallentaa sekä esimerkiksi pääruokiin että keto-kansioon että kalaresepteihin erikseen.

---

## Kenelle tämä repo on tehty

Tämä repo on tehty ensisijaisesti omaan käyttöön, mutta rakenne on suunniteltu niin, että sitä voi ymmärtää myös ulkopuolinen lukija.

Se sopii erityisesti tilanteisiin, joissa:

- halutaan ylläpitää reseptejä tekstimuodossa ilman raskasta tietokantaa
- halutaan käyttää GitHubia sisällön versionhallintaan
- halutaan pitää mukana keto- ja VHH-ajattelu ilman sekavaa kansioräjähdystä
- halutaan myöhemmin mahdollisuus julkaista sisältöä sivustona tai tuoda sitä muuhun järjestelmään
- halutaan erottaa valmiit reseptit, raakileet, mallipohjat ja taustamateriaalit toisistaan

---

## Pääperiaate

Tämän projektin rakenne nojaa yhteen lukittuun pääperiaatteeseen:

**Jokainen resepti tallennetaan vain yhteen pääkansioon.**

Se pääkansio määräytyy ruokalajin mukaan:

- alkuruoka
- pääruoka
- jälkiruoka

Muut tiedot, kuten keto, tiukka VHH, väljempi VHH, raaka-ainepainotus, valmistustapa, käyttötilanne ja ravintoarvot eivät muodosta omia rinnakkaisia kansiorakenteitaan. Ne kirjataan reseptin omiin metatietoihin.

Tämä tekee rakenteesta huomattavasti kestävämmän kuin malli, jossa yritetään rakentaa sisäkkäisiä kansioita tyyliin:

`pääruoat/keto/kala/uuni/nopea/`

Tuollainen rakenne näyttää aluksi loogiselta, mutta alkaa nopeasti hajota käytännössä. Yksi resepti voi kuulua yhtä aikaa moneen luokkaan, ja silloin aletaan kopioida tiedostoja tai tehdä epäjohdonmukaisia kompromisseja.

Tässä repossa sitä ei tehdä.

---

## Projektin rakenne

Alla on projektin ydinrakenne yleisellä tasolla.

```text
D:\Reseptit
├── .gitignore
├── docs/
├── kuvat/
├── meta/
├── omatmuistiinpanot/
├── reseptit/
├── tmp/
├── tools/
├── tuonti/
└── README.md
```

### `reseptit/`

Tämä on projektin tärkein kansio. Varsinaiset reseptit asuvat täällä.

```text
reseptit/
├── alkuruoat/
├── paaruoat/
├── jalkiruoat/
├── raakileet/
├── arkisto/
└── _mallipohjat/
```

#### `reseptit/alkuruoat/`

Sisältää alkuruokareseptit.

#### `reseptit/paaruoat/`

Sisältää pääruokareseptit.

#### `reseptit/jalkiruoat/`

Sisältää jälkiruoat.

#### `reseptit/raakileet/`

Sisältää keskeneräiset ideat, luonnokset ja nopeat raakaversiot. Tämä kansio on tarkoituksella olemassa, jotta hyvä idea voidaan tallentaa heti ilman että sitä tarvitsee teeskennellä valmiiksi reseptiksi.

#### `reseptit/arkisto/`

Sisältää poistetut, vanhentuneet tai myöhemmin ehkä vielä hyödynnettävät reseptit. Tällä vältetään turha lopullinen hävittäminen silloin kun vanha versio voi myöhemmin olla hyödyllinen.

#### `reseptit/_mallipohjat/`

Sisältää yhtenäiset mallipohjat uusille resepteille ja mahdollisille ateriakokonaisuuksille.

---

### `docs/`

Projektin taustadokumentaatio ja käytännön ohjeet.

Tyypillisiä tiedostoja ovat esimerkiksi:

- reseptirakenteen suunnitelma
- kirjoitusohje
- luokitusohje
- ravintoarvojen kirjausohje
- projektin rakennepuu
- päivittäinen seuranta

Tarkoitus ei ole haudata repoa dokumenttivuoreen, vaan pitää täällä vain ne ohjeet, joista on oikeasti hyötyä rakenteen pysymisessä ehjänä.

Tällä hetkellä `docs/`-kansion alla on myös:

- `tree.md`, joka näyttää projektin rakenteen ASCII-muodossa
- `seuranta/`, johon voidaan tallentaa päivittäiset projektiseurantatiedostot muodossa `YYYY-MM-DD.md`

---

### `meta/`

Metatietojen, luokitusten ja tagien määrittelyt.

Tänne voidaan pitää koottuna esimerkiksi:

- pääluokat
- diettiluokat
- tagilistat
- ravintokenttien nimet ja käyttöperiaatteet

Tämä erottaa rakennepäätökset varsinaisesta reseptisisällöstä.

---

### `kuvat/`

Mahdolliset resepteihin liittyvät kuvat tai muu myöhemmin käytettävä media. Kuvakansiot voidaan pitää jaoteltuna pääluokkien mukaan.

---

### `tuonti/`

Varattu alue raakadatalla, siivottavalla aineistolla tai myöhemmin mahdollisilla import/export-virroilla työskentelyä varten.

Tämä on hyödyllinen, jos reseptejä myöhemmin tuodaan esimerkiksi muista tiedostoista, muistiinpanoista tai puolistrukturoidusta datasta.

---

### `tools/`

Apuskriptit ja pienet työkalut. Täällä voi olla esimerkiksi skripti, joka luo uuden reseptitiedoston valmiista mallipohjasta oikeaan kansioon.

---

### `tmp/`

Väliaikaiset paketit, exportit ja muut hetkelliset aputiedostot. Tätä kansiota ei pidetä varsinaisen sisältörakenteen ytimenä, mutta se on käytännöllinen työskentelyssä.

---

### `omatmuistiinpanot/`

Paikallinen oma työskentelytila yksityisille muistiinpanoille ja väliaikaisille paketeille. Tätä kansiota ei ole tarkoitus käyttää julkisena projektisisältönä, ja se on tarkoituksella rajattu versionhallinnan ulkopuolelle.

---

## Luokittelumalli

Tässä repossa käytetään kaksitasoista luokittelua.

### 1. Pääluokka

Jokaisella reseptillä on yksi pääluokka:

- `alkuruoka`
- `paaruoka`
- `jalkiruoka`

Pääluokka määrittää, missä kansiossa resepti sijaitsee.

### 2. Diettiluokka

Jokaisella reseptillä voi olla yksi pääasiallinen diettiluokka:

- `keto`
- `vhh_tiukka`
- `vhh_valjempi`

Tämä tieto kuuluu metatietoihin, ei kansiorakenteeseen.

Tärkeä käytännön huomio:

Diettiluokitus ei tässä mallissa perustu mekaanisesti vain siihen, että käyttäjä noudattaa jotakin päiväkohtaista hiilarirajaa, vaan reseptin käytännön sopivuuteen ja annoskohtaisiin ravintoarvoihin.

Toisin sanoen pieni kastike ei muutu automaattisesti “keto-reseptiksi” vain siksi, että annos on pieni, eikä hyvä pääruoka tipu ulos luokasta vain siksi, että joku syö sen suurempana annoksena.

---

## Ravintoarvot ja metatiedot

Reseptin yläosaan voidaan lisätä yhtenäinen YAML-frontmatter-lohko, jotta tieto pysyy rakenteisena ja on myöhemmin helposti hyödynnettävissä.

Esimerkkirakenne:

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
status: "draft"
---
```

Tämän jälkeen varsinainen resepti voi sisältää esimerkiksi:

- kuvauksen
- ainekset
- valmistuksen
- ravintoarvion per annos
- muistiinpanot

---

## Miksi Markdown

Markdown valittiin tähän projektiin tietoisesti.

Syy ei ole se, että Markdown olisi hieno tai trendikäs, vaan se on tässä yhteydessä käytännöllinen.

Sen etuja ovat:

- tiedostot pysyvät kevyinä ja pitkäikäisinä
- sisältöä voi muokata millä tahansa kunnollisella editorilla
- GitHub näyttää Markdownin siististi suoraan selaimessa
- versionhallinta toimii luonnostaan
- muutokset ovat helposti verrattavissa diffissä
- rakenne toimii myöhemmin myös monissa staattisissa sivustotyökaluissa

Markdown on tässä projektissa riittävän yksinkertainen, mutta tarpeeksi jämäkkä.

---

## Nimeämissäännöt

Tiedostonimissä käytetään seuraavia sääntöjä:

- pienet kirjaimet
- sanat erotetaan yhdysmerkeillä
- ei ääkkösiä tiedostonimissä
- ei turhia vuosilukuja tai versiotunnisteita nimeen
- tiedostonimi kertoo reseptin ytimen mahdollisimman selvästi

Esimerkkejä:

- `jauheliha-kaalipannu.md`
- `kermainen-lohipata.md`
- `suklaamousse-keto.md`
- `marja-mascarponekulho.md`

Tavoite on, että nimi on heti ymmärrettävä sekä hakemistonäkymässä että Git-diffiä tai projektipuuta selattaessa.

---

## Tagit ja tarkenteet

Pääluokan ja diettiluokan lisäksi reseptiin voidaan liittää tageja.

Tagit ovat hyödyllisiä erityisesti silloin, kun reseptejä on enemmän ja niitä halutaan hakea tai suodattaa useilla tavoilla.

Mahdollisia tagiryhmiä:

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

### Käyttötilanne

- arki
- viikonloppu
- juhla
- meal-prep
- nopea
- helppo

### Erityisruokavalio tai lisätieto

- gluteeniton
- maidoton
- laktoositon
- sokeriton

Tagien tarkoitus ei ole paisuttaa reseptiä metatietoviidakoksi, vaan mahdollistaa järkevä lisäluokitus ilman että sama tiedosto joudutaan kopioimaan useaan paikkaan.

---

## Työskentelyperiaatteet

Projektissa noudatetaan seuraavia käytännön sääntöjä:

### 1. Yksi resepti, yksi paikka

Yksi resepti tallennetaan vain yhteen pääkansioon.

### 2. Metatiedot ratkaisevat tarkemman luokittelun

Keto, VHH, valmistustapa, raaka-ainepainotus ja muut tarkenteet kuuluvat metatietoihin tai tageihin.

### 3. Raakileet saavat olla keskeneräisiä

Kaiken ei tarvitse olla heti julkaisukelpoista. Siksi `raakileet/` on mukana rakenteessa.

### 4. Arkistointi on sallittua ja suositeltavaa

Jos resepti vanhenee tai siitä tulee uusi versio, vanha voidaan siirtää arkistoon eikä sitä tarvitse välttämättä poistaa lopullisesti.

### 5. Nimeämisessä ja kentissä pysytään johdonmukaisina

Pitkän aikavälin hyöty syntyy siitä, että pienet asiat tehdään samalla tavalla, ei siitä että joka tiedosto näyttää persoonalliselta omalta taideteokseltaan.

---

## Julkinen repository

Tämä repo on julkinen tarkoituksella.

Se tarkoittaa käytännössä sitä, että tänne ei pidä tallentaa:

- tunnuksia
- API-avaimia
- salasanoja
- yksityisiä muistiinpanoja, joita ei haluta julkisiksi
- lisenssiltään epäselvää ulkopuolista sisältöä sellaisenaan
- muuta sellaista materiaalia, jonka näkyminen GitHubissa aiheuttaisi myöhemmin turhaa harmia

Julkisuus on tässä projektissa ominaisuus, ei vahinko.

---

## Miksi rakenne on tehty näin eikä toisin

Moni reseptikokoelma alkaa viattomasti. Ensin on muutama tiedosto. Sitten tulee muutama kansio. Sen jälkeen syntyy sekalainen sekoitus tyyliä:

- keto
- kala
- airfryer
- nopeat
- viikonloppu
- suosikit
- oikeat reseptit
- testit
- uudet
- vielä-kerran-tämä

Lopputuloksena kukaan ei enää oikein tiedä, missä mikäkin asuu.

Tämä rakenne on tehty juuri tuota vastaan.

Ruokalaji on riittävän vakaa pääjako. Muut asiat muuttuvat helpommin, menevät ristiin keskenään ja kuuluvat siksi metatietoihin, eivät fyysiseen kansiopuuhun.

Tämä on ehkä hieman kuivempi ratkaisu kuin villi luova kansioiloittelu, mutta se kestää käyttöä paremmin.

---

## Mahdollinen myöhempi kehitys

Vaikka projekti on nyt Markdown-pohjainen reseptiarkisto, rakenne on tehty niin, että sen päälle voi myöhemmin rakentaa paljon enemmän.

Mahdollisia jatkosuuntia:

- automaattiset listaukset metatietojen perusteella
- haku ja suodatus
- staattinen reseptisivusto
- kuvien yhdistäminen resepteihin
- ravintoarvojen automaattisempi laskenta tai tarkistus
- tuonti muista tiedostomuodoista
- reseptien vienti toiseen formaattiin
- ateriakokonaisuudet ja ruokalistasuunnittelu

Rakenne ei siis ole tehty vain tämän päivän käyttöä varten, vaan niin että se ei estä huomisen laajennuksia.

---

## Aloitusohje uudelle reseptille

Kun lisäät uuden reseptin, toimi käytännössä näin:

1. päätä kuuluuko resepti alkuruokiin, pääruokiin vai jälkiruokiin
2. luo tiedosto oikeaan kansioon yhtenäisellä tiedostonimellä
3. lisää reseptin alkuun metatiedot
4. täytä reseptin sisältö
5. lisää tarvittavat tagit ja ravintoarviot
6. jätä resepti aluksi tarvittaessa `draft`-tilaan

Jos resepti on vielä vain idea tai puolikas luonnos, se kuuluu mieluummin `reseptit/raakileet/`-kansioon kuin valmiiden joukkoon.

---

## Status

Nykyinen vaihe:

**Projektin perusrakenne on luotu ja sisältöä aletaan täyttää hallitusti.**

Tässä vaiheessa tärkeintä ei ole reseptimäärä vaan se, että rakenne pysyy alusta asti siistinä, johdonmukaisena ja myöhemmin helposti laajennettavana.

---

## Lisenssi

Lisenssiä ei ole vielä lopullisesti lukittu.

Myöhemmin tähän voidaan lisätä projektin tavoitteeseen sopiva lisenssi sen mukaan, halutaanko painottaa enemmän:

- sisällön jakamista
- rakenteen ja työkalujen avointa käyttöä
- molempia yhdessä

Siihen asti on hyvä muistaa yksi käytännön asia: julkinen näkyvyys GitHubissa ei yksinään tarkoita, että sisältö olisi automaattisesti vapaasti uudelleenkäytettävää missä tahansa muodossa.

---

## Yhteenveto

Tämä repo on tarkoituksella rakennettu niin, että:

- selaaminen pysyy ihmiselle helppona
- ylläpito pysyy tekijälle järkevänä
- luokittelu ei hajoa käsiin reseptimäärän kasvaessa
- sisältöä voi käyttää myöhemmin myös muualla kuin vain GitHubissa

Toisin sanoen: vähemmän kansiokaaosta, enemmän käyttökelpoista rakennetta.
