# Nattō-riisikulho: keittäminen on oikea valmistustapa, raakalähde lukittu

**Päiväys:** 18.11.2026
**Tila:** toteutusehdokas / Draft, ei yhdistetty eikä julkaistu
**Lähtö-main:** `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`
**Lähtötehtävä:** [#327 reseptilaatu](https://github.com/ozirix-dev/Reseptit/issues/327) ja [PR #725:n 20 reseptin tarkistus](https://github.com/ozirix-dev/Reseptit/pull/725).

## Todettu ristiriita

Julkaistun `japanilainen-natto-riisikulho`-reseptin **kaikissa neljässä lähdetiedostossa** `cooking_method: [paistaminen]` on väärä. FI-, EN-, SV- ja TH-valmistusohjeissa **100 g kuivaa valkoista jasmiiniriisiä keitetään** ja **kaksi kananmunaa keitetään kypsiksi**. Nattō, hienonnettu kevätsipuli ja haluttu suola lisätään valmiin riisin kanssa kulhoihin; mitään ei paisteta. Rakenteisen riisirivin `100 g` on valmistusvaiheen perusteella **kuivapaino**, mutta rivin nimi ei kerro sitä.

[14.11.2026 nelikielinen kielikatselmointi](https://github.com/ozirix-dev/Reseptit/blob/main/docs/reviews/2026-11-14-natto-kielikatselmointi.md) vahvistaa tämän saman todellisen valmistustavan, riisin kuivapainon, läpikypsän munan ja kaksi annosta. Kananmunan sekä soijan allergeenit säilyvät. Fyysistä valmistusta ei väitetä suoritetuksi.

## Miksi raakaa frontmatteria ei muuteta tässä PR:ssä

`docs/nutrition/gk100-original-recipe-audit-2026-11-05.json` sisältää alkuperäiselle tunnisteelle `INSUFFICIENT SOURCE DATA / SEPARATE_EXACT_VERSION`. Alkuperäisen ja erillisen GK149-version syötteet, hyväksynnät sekä lähdesidonnat on pidettävä erillään. Neljän kielitiedoston raakatekstin muuttaminen invalidioisi niiden nykyiset blobit ja vaatisi normaalin kieli- ja GK-lähdehyväksynnän päivityksen. Väärä historiallinen lähdemetatieto merkitään tässä näkyväksi poikkeamaksi eikä vääriä hyväksyntätiivisteitä kirjoiteta uusiksi.

Julkinen `siteContent` ei lähtöversiossa välitä `cooking_method`-kenttää lainkaan. Siksi pelkkä uusi huomautus ei riittäisi rekisteröimään oikeaa valmistustapaa. Tässä toteutuksessa:

1. `reviewedPublicCookingMethod` palauttaa täsmälleen `["keittäminen"]` vain nattō-riisikulholle ja vain kun alkuperäinen `["paistaminen"]`-metatieto on edelleen ennallaan; muu lähdearvo aiheuttaa `NATTO_COOKING_METHOD_SOURCE_DRIFT`-virheen.
2. `site/scripts/build-content.ts` vie tämän katselmoidun arvon **vain neljän nattō-sivun** generoituun `cookingMethod`-kenttään. Muut reseptit eivät saa uutta arvoa tai uutta käyttöliittymäelementtiä.
3. Julkisen muistiinpanon nelikielinen teksti kertoo oikean valmistustavan ja `100 g` riisin kuivapainon. `projectPublicRecipeMethodCopy` tarkistaa alkuperäisen valmistuksen riisi- ja munavirkkeiden säilymisen; poikkeama pysäyttää buildin koodilla `NATTO_COOKING_METHOD_TEXT_DRIFT`.
4. `cookingMethod` on valinnainen reseptin sisältötyypissä. Tällä kertaa ei lisätä uutta valmistustapa-suodatinta, komponenttia tai laajaa sivujen metadataa.

**Toteutuksen raja:** Raakoja FI-/EN-/SV-/TH-reseptejä ei muuteta. Kaikki raaka-ainemäärät, kaksi annosta, valmis kypsennysohje, allergiatiedot, kuvat, makrojen puuttuminen sekä GK149-historian hyväksyntärekisterit säilyvät. **Julkiseen projektionäkymään** saadaan uusi virheettömäksi tarkistettu valmistustapa, ei lähdetiedoston täydellistä siivousta. Raakafrontmatterin siistiminen edellyttää myöhemmin erillistä lähdemigraatiota.

## Lukitut lähteet

| Kieli | Lähde | Git-blob SHA-1 |
|---|---|---|
| FI | `reseptit/aamupalat/japanilainen-natto-riisikulho.md` | `941d0724416d00338277c9a2c2bd22ef981b8fc1` |
| EN | `kaannokset/en/aamupalat/japanilainen-natto-riisikulho.md` | `89727a0502a63aac3ece88ab1a28cef4194f4123` |
| SV | `kaannokset/sv/aamupalat/japanilainen-natto-riisikulho.md` | `454c43a19b6fa7c302bc8f245057dea86a30680f` |
| TH | `kaannokset/th/aamupalat/japanilainen-natto-riisikulho.md` | `1218f9c352528dec894f02a99a230bfee8c20260` |

`site/tests/natto-reviewed-cooking-method.test.ts` tarkistaa alkuperäiset Git-blobit, väärän historiallisen `paistaminen`-metatiedon säilymisen lähteessä, oikean `keittäminen`-projektion, kuivana mitatun 100 g:n riisin, läpikypsän munan, julkiset muistiinpanot, puuttuvat makrot sekä fail-closed-portit. Uudelleenkatselmoinnin jälkeen testi voidaan muuttaa sallimaan alkuperäiseen tiedostoon hyväksytysti siirretty korjaus.

## Riippuvuus ja portit

Muutos pinotaan PR:n [#735](https://github.com/ozirix-dev/Reseptit/pull/735) päälle; ketju on **#731 → #733 → #735 → tämä PR**, koska `site/scripts/public-recipe-copy.ts` on yhteinen esityskerroksen tiedosto. Tässä PR:ssä tarvittava `build-content.ts`-lisäys on pieni ja rajattu yhteen reseptiin; Codexin omaan GK-haaraan ei kirjoiteta. Kun vanhemmat PR:t yhdistetään, tarkista uudet rebase-/base-ref-sidonnat ja anna GitHub CI:n sekä riippumattoman katselmoinnin vahvistaa lopullinen SHA.

Toteutuksen julkaisu edellyttää tarkkaa GitHub CI -tulosta, riippumatonta nelikielisen merkityksen ja näkyvän valmistustavan tarkistusta, Repo Guard -porttia ja erillistä merge-/julkaisupäätöstä. Tämä raportti ei myönnä niitä eikä sulje laajaa issuea #327.
