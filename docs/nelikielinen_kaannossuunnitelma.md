# Nelikielinen kaannossuunnitelma

## Tarkoitus

Tama dokumentti kuvaa suunnitelman, jolla `Reseptit`-repo voidaan laajentaa hallitusti nelikieliseksi.

Tavoitekielet:

- suomi
- englanti
- ruotsi
- thai

Suomi pysyy lahdekielena. Muut kielet tuotetaan erillisiksi kaannostiedostoiksi.

---

## Nykytilan arvio

Nykyinen malli on jo riittavan vahva nelikieliseen kayttoon, koska:

- lahderesepti on omassa suomenkielisessa tiedostossaan
- kaannokset ovat omassa `kaannokset/`-rakenteessa
- `recipe_id` toimii pysyvana kielesta riippumattomana tunnisteena
- `url_slug` voidaan maaritella kielikohtaisesti
- `source_recipe` ja `translation_of` sopivat hyvin kaannostiedostoihin

Kaytannossa suurin puuttuva osa ei ole arkkitehtuuri vaan:

- ruotsin lisaaminen malliin
- dokumentaation paivitys malliin `fi + en + sv + th`
- yksi selkea kutsutapa käännösten luontiin

Johtopaatos:

- nelikielinen malli on toteutettavissa ilman kansiorakenteen uudelleensuunnittelua
- toteutus kannattaa tehda nykyisen mallin paalle, ei rinnalle

---

## Lukittu perusmalli

Tavoitemalli:

- suomi = lahderesepti
- englanti = kaannos
- ruotsi = kaannos
- thai = kaannos

Yksi resepti elaa edelleen yhtena loogisena kokonaisuutena:

- yksi `recipe_id`
- yksi suomenkielinen lahde
- kolme erillista kaannostiedostoa

Fyysinen rakenne:

```text
reseptit/jalkiruoat/esimerkkiresepti.md
kaannokset/en/jalkiruoat/esimerkkiresepti.md
kaannokset/sv/jalkiruoat/esimerkkiresepti.md
kaannokset/th/jalkiruoat/esimerkkiresepti.md
```

---

## Miksi tama malli kannattaa

Tama malli on kaytannollinen seuraavista syista:

- yllapito pysyy suomenkielisen lahteen varassa
- sama resepti ei jakaudu useaksi rinnakkaiseksi paaoriginaaliksi
- kaannokset pysyvat siististi omissa hakemistoissaan
- Git-historia pysyy ymmarrettavana
- julkaisu- tai hakukerros voidaan rakentaa myohemmin saman rakenteen paalle

Tata ei kannata tehda mallilla, jossa kaikki nelja kielta ovat samassa tiedostossa, koska:

- tiedostot paisuvat nopeasti
- luku- ja muokkauskaytto vaikeutuu
- diffit muuttuvat raskaiksi

Tata ei kannata tehda myoskaan mallilla, jossa jokainen kieli olisi `reseptit/`-puussa tasavertaisena lahteena, koska:

- lahteen omistajuus hajoaa
- muutoshallinta muuttuu sekavaksi

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
    ├── sv
    │   ├── alkuruoat
    │   ├── paaruoat
    │   └── jalkiruoat
    └── th
        ├── alkuruoat
        ├── paaruoat
        └── jalkiruoat
```

Huomio:

- `raakileet` pysyy toistaiseksi vain suomenkielisessa paapuussa
- käännöskieliin ei lisata kielikoodeja tiedostonimeen
- kieli ratkaistaan kansiopolulla ja frontmatterilla

---

## Metadata neljalle kielelle

Lahdetiedosto:

```yaml
---
title: "Kermainen lohipata"
recipe_id: "kermainen-lohipata"
url_slug: "kermainen-lohipata"
category: "paaruoka"
language: "fi"
translation_languages: ["en", "sv", "th"]
translation_status:
  en: "draft"
  sv: "missing"
  th: "draft"
status: "published"
---
```

Kaannostiedosto:

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

Ruotsi toimii samalla rakenteella:

```yaml
---
title: "Kramig laxgryta"
recipe_id: "kermainen-lohipata"
url_slug: "kramig-laxgryta"
category: "paaruoat"
language: "sv"
source_language: "fi"
source_recipe: "reseptit/paaruoat/kermainen-lohipata.md"
translation_of: "kermainen-lohipata"
status: "draft"
---
```

Huomio:

- `recipe_id` ei muutu kielen mukana
- `url_slug` saa muuttua kielen mukana
- `translation_status` kuuluu vain lahdetiedostoon

---

## Tyonkulku

Suositeltu kaytanto:

1. Resepti kirjoitetaan ensin suomeksi.
2. Lahdetiedoston frontmatter tarkistetaan.
3. Käännokset tuotetaan vasta valmiista suomenkielisesta lahteesta.
4. Käännöstiedostot tallennetaan `en`, `sv` ja `th` -hakemistoihin.
5. Lahdetiedoston `translation_languages` ja `translation_status` paivitetaan tarvittaessa.

Tama pitaa yllapitovirran selkeana:

- suomi ensin
- muut kielet vasta sen jalkeen

---

## Suositeltu kutsutapa

Paras kaytannollinen malli tahan projektiin on on-demand-kutsuttava käännöstyokalu tai chat-kutsu, ei ajastettu automaatio.

Suositeltu kutsumuoto:

```text
kaanna resepti XXXXXXX.md
```

Esimerkki:

```text
kaanna resepti sienikakkupohja.md
```

Tama tarkoittaa kaytannossa:

- lahdetiedosto luetaan suomenkielisesta `reseptit/`-puusta
- puuttuvat `en`, `sv` ja `th` -versiot luodaan
- olemassa olevat kaannokset voidaan paivittaa pyynnon mukaan

---

## Voiko Codex tehda kaannokset

Kyllä, Codex voi tehda kaannokset taman projektin mallissa.

Suositeltu vastuunjako:

- kayttaja kirjoittaa reseptin suomeksi
- Codex tuottaa englannin, ruotsin ja thain
- Codex pitaa frontmatterin ja teknisen mallin oikeana
- Codex hioo kielen luonnolliseksi, ei vain raakakaannokseksi

Tama sopii hyvin nykyiseen repo-malliin, koska:

- lahde pysyy suomeksi
- kaannokset ovat johdettuja tiedostoja
- tyovirta on toistettava

---

## Automaation arvio

Ajastettu automaatio ei ole tahan paras ensivaiheen ratkaisu.

Syy:

- resepteja ei synny tasaisella aikataululla
- kaannos kannattaa tehda silloin, kun lahdetiedosto on oikeasti valmis
- ajastettu automaatio aiheuttaisi helposti keskeneraisia kaannoksia

Parempi ratkaisu:

- manuaalisesti kutsuttava automaatio tai apuohjelma
- kaynnistyy vain silloin, kun kayttaja pyytää

Esimerkki:

- `kaanna resepti keto-jaatelosmoothie-proteiinijauheella.md`

---

## Toteutussuunnitelma

### Vaihe 1

- paivita `docs/kielivalinnat.md` tukemaan `sv`
- paivita mallipohjat tukemaan `translation_languages: ["en", "sv", "th"]`

### Vaihe 2

- luo `kaannokset/sv/`-kansiopuu
- tee yksi pilottiresepti neljalla kielella

### Vaihe 3

- lukitse kutsutapa:
  - `kaanna resepti XXXXXXX.md`
- maarittele, luodaanko puuttuvat kaannokset automaattisesti vai kysytaanko ennen ylikirjoitusta

### Vaihe 4

- tee kevyt apuohjelma tai vakioitu chat-tyonkulku
- tarkista, etta `recipe_id`, `url_slug`, `source_recipe` ja `translation_of` pysyvat oikein

---

## Suositus

Tama kannattaa toteuttaa.

Perustelu:

- nykyinen repo tukee ratkaisua jo nyt
- muutos on hallittu, ei rakenteellinen uudelleenrakennus
- suurin lisatyo on ruotsin lisaaminen ja käännöstyokulun vakiointi

Paras kaytannon ratkaisu ensivaiheeseen:

- nelikielinen malli
- suomi lahteena
- Codex tekee `en + sv + th`
- kutsu kaynnistetaan pyynnosta muodossa `kaanna resepti XXXXXXX.md`

---

## Seuraava askel

Kun tama suunnitelma hyvaksytaan, seuraava tekninen toteutuskierros on:

1. paivita kieliohje tukemaan ruotsia
2. paivita mallipohjat nelikielisiksi
3. luo `kaannokset/sv/`-rakenne
4. testaa malli yhdella oikealla reseptilla

