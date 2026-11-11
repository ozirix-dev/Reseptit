# Issue #404 – suurten lähdemigraatioerien halpa ennakkotarkistus

Toteutus 11.11.2026, PR #433:n 10 reseptin pilotin havaintojen perusteella.

## Käyttö

```bash
cd site
npm run preflight:source -- indialainen-poha-maapahkinoilla intialainen-rava-uttapam
```

Tuloste: reseptitunnus, joko `HOLD` tai `CANDIDATE_REQUIRES_REVIEW`, sekä syyt. Jos yksikin HOLD löytyy, komennon paluuarvo on 2. Tarkistuksessa ei muuteta reseptejä eikä Git-haaroja, eikä täyttä CI:tä käynnistetä.

## Nykyiset suojat

- `GK149_FULL_SOURCE_SHA_REVIEW_REQUIRED`: alkuperäinen ID on GK149:n 70 valitun lähteen joukossa. Valmistustekstin kanoninen muuttaminen voisi vanhentaa tiivisteen, vaikka aineslistan ja makrojen sisältö pysyisi samana.
- `PUBLISHED_TRANSLATION_SEMANTIC_REVIEW_REQUIRED:...`: julkaistuille EN/SV/TH-käännöksille on tarkistettava uusi FI-merkitystarkiste. Tarkistus käyttää sekä julkaisurekisteriä että varsinaisista julkaistuista Markdown-käännöstiedostoista tehtyä `auditTranslations`-havaintoa, koska pelkkä rekisteri ei sisällä esimerkiksi pohan kolmea julkaistua kieliversiota. Esim. poha (3 kieltä) ei saa automaattista hyväksyntää.
- `PUBLIC_QUARANTINE_REQUIRES_SEPARATE_APPROVAL`: julkisesta sisällöstä poistettu resepti ei palaudu samalla valmistustekstin siirrolla.
- `DUPLICATE_CANDIDATE` ja `INVALID_RECIPE_ID`: perusvirheet estetään ennen CI:tä.

**Tämä on konservatiivinen esiseulonta, ei vihreä julkaisulupa.** `CANDIDATE_REQUIRES_REVIEW` edellyttää edelleen lähde-Git-blob-SHA:n ja näyttökorjauksen täsmävertailua, muuta GK-historiaa, ravintoperustaa, julkaistujen käännösten semantiikkaa ja normaalia täsmä-HEAD CI:tä. Jos uusi tutkimuspaketti tai muu lähderiippuvuus lisätään, tarkistin pitää laajentaa; se ei saa hiljaisesti merkitä poikkeusta hyväksytyksi.

## Pilotin toistettava vertailu

`site/tests/source-migration-preflight.test.ts` lukee rekisterit suoraan reposta ja vahvistaa, että alkuperäisestä 10 C13-kohteen erästä **viisi olisi pysäytetty ennakkoon ja viisi olisi edennyt varsinaiseen lähdekatselmointiin**. Tämä on vastetesti eräkokojen kasvattamista varten.

**Suositus:** älä vielä nosta eräkokoa 15:een, ennen kuin käännös-/GK149-preflight on CI-hyväksytty ja seuraava erä osoittaa, ettei se tuota turhia täysiä uusinta-ajoja.
