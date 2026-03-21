# Kielivalinnat

## Tarkoitus

Tama ohje lukitsee monikielisyyden perusmallin tahan projektiin.

Tavoite on yhdistaa:

- yllapidon selkeys
- yksi selkea lahdeversio per resepti
- hallittu laajennettavuus englantiin ja thaihin
- mahdollisuus julkaista sisaltoa myohemmin sivustolla tai muussa jarjestelmassa

---

## Lukittu paalinja

Tassa projektissa kaytetaan mallia:

- yksi suomenkielinen paaresepti toimii lahdeversiona
- englanti ja thai tallennetaan erillisiksi kaannostiedostoiksi
- kaannokset sijaitsevat omassa `kaannokset/`-rakenteessa
- raakileet pysyvat toistaiseksi vain suomenkielisessa paapuussa
- tiedostonimiin ei lisata kielikoodeja kuten `.fi.md`, `.en.md` tai `.th.md`

Tama tarkoittaa kaytannossa sita, etta:

- `reseptit/` sisaltaa alkuperaiset suomenkieliset reseptit
- `kaannokset/` sisaltaa muiden kielten versiot

---

## Miksi tama malli valittiin

Tama malli on tahan projektiin paras seuraavista syista:

- yksi resepti pysyy yhtena loogisena kokonaisuutena
- suomi voi toimia luonnollisena yllapidon paakielena
- kaannokset eivat sotke reseptien paakansioita
- samaa reseptia ei tarvitse yllapitaa useana rinnakkaisena paaoriginaalina
- muutoshistoria pysyy selkeampana
- tuleva julkaisu tai sivustokaytto helpottuu

Tata ei toteuteta mallilla, jossa kaikki kielet ovat samassa tiedostossa, koska:

- tiedostoista tulee raskaita
- luettavuus heikkenee
- muokkaus ja diffit muuttuvat sekaviksi

Tata ei toteuteta myoskaan mallilla, jossa jokainen kieli on suoraan `reseptit/`-kansiossa omana versionaan, koska:

- kansiorakenne paisuu nopeasti
- selaus muuttuu sekavaksi
- yllapitoon tulee helposti rinnakkaisia versioita

---

## Suositeltu kansiorakenne

```text
D:\Reseptit
├── reseptit
│   ├── alkuruoat
│   ├── paaruoat
│   ├── jalkiruoat
│   ├── raakileet
│   ├── arkisto
│   └── _mallipohjat
└── kaannokset
    ├── en
    │   ├── alkuruoat
    │   ├── paaruoat
    │   └── jalkiruoat
    └── th
        ├── alkuruoat
        ├── paaruoat
        └── jalkiruoat
```

Huomio:

- `kaannokset/` voidaan lisata vasta silloin, kun ensimmaiset oikeat kaannokset tehdaan
- `raakileet/` pysyy toistaiseksi vain suomenkielisessa paapuussa
- fyysista polkurakennetta ei nimeta nyt uusiksi kielikohtaisilla tiedostonimilla

---

## Tiedostoperiaate

Yksi suomenkielinen paaresepti:

```text
reseptit/paaruoat/kermainen-lohipata.md
```

Sen kaannokset:

```text
kaannokset/en/paaruoat/kermainen-lohipata.md
kaannokset/th/paaruoat/kermainen-lohipata.md
```

Tarkea saanto:

- sama `recipe_id` pysyy samana kaikissa kieliversioissa
- tiedostonimi pysyy toistaiseksi samana eri kieliversioiden valilla
- kieli ratkaistaan hakemistopolulla ja metatiedoilla
- `url_slug` voi olla kielikohtainen vain julkista URL- tai reitityskayttoa varten

Ei kayteta mallia:

```text
kermainen-lohipata.fi.md
kermainen-lohipata.en.md
kermainen-lohipata.th.md
```

Eika siirryta talla tasolla viela kielikohtaisiin fyysisiin tiedostonimiin tai uusiin polkuihin.

---

## recipe_id ja url_slug

`recipe_id` ja `url_slug` erotetaan toisistaan, koska niilla on eri tarkoitus.

### `recipe_id`

- pysyva, kielesta riippumaton tekninen tunniste
- sama kaikissa saman reseptin kieliversioissa
- tarkoitettu repo- ja yllapitotason tunnisteeksi

### `url_slug`

- valinnainen julkinen slug
- voi olla kielikohtainen, jos julkaisu tai reititys niin vaatii
- tarkoitettu myohempaa julkaisukerrosta varten, ei paatunnisteeksi repossa

Jos `url_slug` puuttuu, myohempi julkaisu voi kayttaa oletuksena `recipe_id`:ta.

Tama erottelu suojaa rakennetta kahdella tavalla:

- repo pysyy teknisesti johdonmukaisena
- mahdollinen julkaisu voi silti kayttaa kielikohtaisia julkisia osoitteita ilman, etta tiedostorakenne tai tekninen tunnistus hajoaa

---

## Metatietosuositus

Suomenkielinen lahdetiedosto voi sisaltaa esimerkiksi:

```yaml
---
title: "Kermainen lohipata"
recipe_id: "kermainen-lohipata"
url_slug: "kermainen-lohipata"
category: "paaruoka"
language: "fi"
translation_languages: ["en", "th"]
translation_status:
  en: "draft"
  th: "missing"
status: "published"
---
```

Englanninkielinen kaannos voi sisaltaa esimerkiksi:

```yaml
---
title: "Creamy salmon casserole"
recipe_id: "kermainen-lohipata"
url_slug: "creamy-salmon-casserole"
category: "paaruoka"
language: "en"
source_language: "fi"
source_recipe: "reseptit/paaruoat/kermainen-lohipata.md"
translation_of: "kermainen-lohipata"
status: "draft"
---
```

Thaikielinen kaannos voi sisaltaa vastaavan rakenteen:

```yaml
---
title: "..."
recipe_id: "kermainen-lohipata"
url_slug: "..."
category: "paaruoka"
language: "th"
source_language: "fi"
source_recipe: "reseptit/paaruoat/kermainen-lohipata.md"
translation_of: "kermainen-lohipata"
status: "draft"
---
```

Perussaanto:

- `recipe_id` on yhteinen kaikissa kieliversioissa
- `recipe_id`:ta ei vaihdeta kielittain
- `url_slug` saa olla kielikohtainen vain julkista reititysta varten

---

## Kielikoodit

Kaytetaan lyhyita ja yleisia kielikoodeja:

- `fi` = suomi
- `en` = englanti
- `th` = thai

Nama riittavat tahan projektiin hyvin.

---

## Mita kaannetaan ja mita ei

Kaannetaan:

- title
- kuvaus
- ainekset
- valmistus
- tarjoilu- ja huomautustekstit
- mahdollinen kielikohtainen `url_slug`, jos julkaisukerros sita tarvitsee

Ei muuteta kaannoksissa ilman erityista syyta:

- `recipe_id`
- category
- diet_class
- ravintokenttien nimet
- mittarakenne ja tekniset kenttanimet

Tarkea periaate:

- tekninen rakenne pysyy yhtenaisena kaikissa kielissa
- vain loppukayttajalle nakyva sisalto muuttuu kielen mukaan
- `recipe_id` pysyy vakaana, vaikka julkinen `url_slug` vaihtuisi kielesta toiseen

Tama koskee myos otsikkorakennetta:

- metatietokenttien nimet pysyvat samoina kaikissa kielissa
- mutta reseptin varsinaiset osio-otsikot kirjoitetaan kohdekielella

Esimerkki:

- englanti: `Description`, `Ingredients`, `Preparation`, `Nutrition estimate per serving`, `Notes`
- thai: kohdekielen omat vastaavat otsikot

---

## Yllapidon kaytanto

Kun uusi resepti tehdaan:

1. suomenkielinen lahdeversio tehdaan ensin valmiiksi
2. `recipe_id` ja paametatiedot lukitaan
3. tarvittaessa maaritellaan suomen `url_slug`
4. vasta taman jalkeen tehdan kaannokset

Kun suomenkielinen resepti muuttuu:

1. paivita ensin suomenkielinen tiedosto
2. tarkista, vaikuttaako muutos kaannoksiin
3. paivita tarvittavat kieliversiot
4. paivita tarvittaessa `translation_status`
5. muuta `url_slug`:ia vain, jos julkinen julkaisu- tai reititystarve sita aidosti vaatii

Hyva kaytannon saanto:

- raakakaannos on sallittu
- mutta sen status merkitsee selkeasti, ettei kaannos ole viela lopullinen
- raakakaannoksessakin osio-otsikot kannattaa kirjoittaa kohdekielella heti alusta asti

---

## Suositellut status-arvot kaannoksille

Suositellut arvot:

- `missing`
- `draft`
- `review`
- `published`
- `outdated`

Selitys:

- `missing` = kaannosta ei viela ole
- `draft` = raakakaannos on olemassa
- `review` = sisalto odottaa tarkistusta
- `published` = kaannos on valmis kayttoon
- `outdated` = lahdetiedosto on muuttunut ja kaannos on jaljessa

---

## Thai-kielen erityishuomio

Thai kannattaa pitaa aina erillisessa tiedostossa, ei sekoitettuna muiden kielten kanssa samaan runkoon.

Syyt:

- merkisto poikkeaa paljon latinapohjaisista kielista
- tiedostojen luettavuus yllapidossa pysyy parempana
- tarkistus ja mahdollinen kielikohtainen jatkokasittely helpottuu

Thai-kaannoksessa on erityisen tarkea pitaa tekninen metatietorakenne samana kuin suomessa ja englannissa.

---

## GitHub- ja julkaisuetu

Tama malli auttaa myohemmin seuraavissa:

- voidaan rakentaa kielivalitsin reseptisivulle
- voidaan nayttaa puuttuvat kaannokset helposti
- voidaan hakea kaikki saman reseptin kieliversiot yhteisen `recipe_id`:n perusteella
- voidaan pitaa suomi selvana lahdeversiona
- voidaan kayttaa kielikohtaisia `url_slug`-arvoja ilman, etta repon tekninen rakenne muuttuu

---

## Mita ei tehda

Tassa projektissa ei tehda ainakaan seuraavia:

- ei sijoiteta englannin ja thain resepteja suoraan `reseptit/`-kansion sekaan
- ei laiteta kaikkia kielia samaan reseptitiedostoon
- ei vaihdeta `recipe_id`:ta kielittain
- ei sidota teknista tunnistetta julkiseen URL-slugiin
- ei nimeteta kieliversioita satunnaisesti eri logiikoilla
- ei nimeteta tiedostoja nyt uusiksi kielikoodeilla
- ei pideta kaannoksia irrallisina ilman viittausta lahdereseptiin

---

## Lopullinen suositus

Tahan projektiin paras monikielisyysmalli on:

- suomi = lahderesepti
- englanti = erillinen kaannostiedosto
- thai = erillinen kaannostiedosto
- `recipe_id` = pysyva yhteinen tekninen tunniste
- `url_slug` = valinnainen kielikohtainen julkinen slug
- kaannokset = omassa `kaannokset/`-hakemistossa

Tama malli on paras yhdistelma:

- selkeytta
- yllapidettavyytta
- skaalautuvuutta
- tulevaa julkaisua

---

## Seuraava kaytannon askel

Kun monikielisyys otetaan oikeasti kayttoon, seuraavat asiat tehdaan tassa jarjestyksessa:

1. luodaan `kaannokset/`-kansiorakenne
2. paivitetaan reseptipohja tukemaan `recipe_id`- ja `url_slug`-kenttia
3. tehdan yksi pilottiresepti suomi + englanti + thai
4. tarkistetaan, etta rakenne tuntuu yllapidossa luontevalta ennen laajempaa kayttoa
