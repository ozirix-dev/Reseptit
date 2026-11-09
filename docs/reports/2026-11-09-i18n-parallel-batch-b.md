# Käännöserä B – PR #356:n ajantasainen työjono 9.11.2026

**Tila:** 6 FI-reseptiä ja 18 EN/SV/TH-luonnosta; PR #356 pysyy Draftina. Main-suoja: julkaistuja statuksia ei saa koskaan palauttaa Draftiksi.

## Jo julkaistut tästä alkuperäisestä 20 reseptin / 60 käännöksen erästä

- [PR #370](https://github.com/ozirix-dev/Reseptit/pull/370): 5 reseptiä / 15 kieliversiota.
- [PR #371](https://github.com/ozirix-dev/Reseptit/pull/371): 5 reseptiä / 15 kieliversiota.
- [PR #372](https://github.com/ozirix-dev/Reseptit/pull/372): 4 reseptiä / 12 kieliversiota; PR-CI PASS ensimmäisellä yrityksellä, sivuston Pages-deployn tulos tarkistettava erikseen.

**Yhteensä:** 14/20 reseptiä ja 42/60 käännöstä on yhdistetty mainiin. Niitä ei enää ole tämän Draft-PR:n muuttuneissa tiedostoissa.

## Jäljellä olevat lähdelaadun tarkistukset

| FI-reseptin ID | Tilanne | Kielet |
| --- | --- | --- |
| `pohjoisafrikkalainen-harissa-shakshuka` | FI/GK80 / kananmuna ilman kuorta -merkintä, PR #360 | EN, SV, TH – Draft |
| `munakasmuffinit` | FI/GK80 / vuoan voitelurasva, PR #360 | EN, SV, TH – Draft |
| `tonnikalamunakkaat-uunissa` | FI/GK80 / vuoan voitelurasva, PR #360 | EN, SV, TH – Draft |
| `thai-kookosriisi-mangolla` | FI / cooking_method = paistaminen vaikka riisi keitetään | EN, SV, TH – Draft |
| `vietnamilainen-chao-ga-kanapuuro` | FI / 40 min riisi + kana, 45 min kokonaisaika tarkistettava | EN, SV, TH – Draft |
| `indonesialainen-bubur-ayam-kanariisipuuro` | FI / 40 min riisi + kana, 45 min kokonaisaika tarkistettava | EN, SV, TH – Draft |

Kolme ensimmäistä vaatii lähde-/GK-sinetin hyväksytyn käsittelyn, ei automaattisia ainesosa- tai makromuutoksia. Kookosriisin menetelmämetatieto ei vastaa kokkausohjetta. Kahden kanariisipuuron kypsennysjärjestys ja kokonaisaika ovat toimituksellisia, ei pelkästään käännöksellisiä kysymyksiä. Veden lisääminen puuroon koostumuksen vuoksi on normaalia eikä yksin HOLD.

## Julkaisemisen seuraava ehto

Ensin yksittäisten FI-lähteiden korjaukset tai perustellut katselmointipäätökset, tarvittavat GK-hyväksynnät ja lähdeversion uusi AI-merkitystarkistus. Sen jälkeen **yksi** julkaisukandidaatti niin monelle näistä 18 käännöksestä kuin laatuportit oikeasti sallivat. Ei sokkoyritysten sarjaa: yksi ennakkotarkistus, yksi PR-CI, ja korkeintaan yksi kohdennettu korjaus uusintatestillä. Merkittävä FI/GK-ristiriita => Draft/HOLD.

Alkuperäisen 60 luonnoksen tarkempi historia säilyy aiemmissa Git-commiteissa. Aiemmat osakatselmointidokumentit ovat historiallisia, eivät nykyisten SHA-parien julkaisutodisteita. Ei ihmiskatselmointiväitettä.
