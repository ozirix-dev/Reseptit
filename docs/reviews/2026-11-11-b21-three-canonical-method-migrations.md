# Issue #404 – B21:n kolmen valmistusmenetelmän siirto kanoniseen FI-lähteeseen

Päiväys: 11.11.2026. Tämä on **valmistusohjeen lähdemigraatio**, ei ravinto-/GI/GK-hyväksyntä eikä alkuperäisen tutkimushistorian uudelleentulkinta.

## Mitä muuttui

| Kortti | FI-resepti | Korjaus |
| --- | --- | --- |
| #02 | indonesialainen-bakwan-maissifritter | Geneerinen pihvitaikina korvattiin maissin, porkkanan, jauhon ja luetellun paistoöljyn fritteriohjeella. |
| #40 | meksikolainen-huevos-divorciados | Mustat pavut, tomaattipohjainen punainen kastike, valmis vihreä salsa ja paistetut munat kuvataan erikseen. |
| #63 | lahi-ita-labneh-kulho-zaatarilla | Kylmä labneh-kulho; poistettiin luettelemattomat öljyt ja lämpimät proteiinit. Reseptin cooking_method korjattiin kylmävalmistukseksi. |

Ohjetekstit on siirretty *sellaisinaan* aiemmin PR #409:n lähde-Git-blob-SHA-lukitulla näyttöprojektorilla julkaistuista teksteistä. Ainesosaluetteloita, annosmääriä, neljää ravintokenttää tai GI/GK-asiakirjoja ei muutettu. `site/scripts/material21-fi-public-display.ts` on nyt tyhjä yhteensopivuusadapteri; sitä ei saa kutsua uutena ravintotarkistuksena.

## Julkiset ja laskennalliset portit erillään

- **Bakwan:** porkkanan syötävä grammamassa ja käytetty taikinavesi dokumentoitava; erityisesti makroarvon lähtötiedot vahvistettava.
- **Huevos divorciados:** mustien papujen kuivapaino/kypsäpaino ja tuotekohtainen ravintolähde vahvistettava ennen GK-päätöstä.
- **Labneh:** oliivien ja kurkun syötävät grammapainot, labnehin tuote ja riippumaton ravintolaskenta vahvistettava. Kylmävalmistus ei ole paistaminen.

**Kortit #02, #40 ja #63 jäävät issue #404:ssä auki ravinto/GK-varmennuksen vuoksi.** Niiden olemassa oleva julkinen näkyvyys pidetään ennallaan; lähdemigraatio ei oikeuta uutta numeerista hyväksyntää.

## Testaus ja rollback

- `site/tests/material21-fi-public-display.test.ts`: tarkista kanonisesta FI:stä valmistus, ainesluettelot, annokset ja ravintoarvojen muuttumattomuus julkisessa buildissä.
- `site/tests/issue404-public-integrity.test.ts`: täsmällinen 38/38 jakauma on nyt **21 karanteenia + 14 SHA-lukittua näyttökorjausta + 3 kanonista menetelmäkorjausta**. Lähdekorjaukset eivät tarkoita ravinto/GK-hyväksyntää.
- Tämän PR:n onnistuminen vaatii täsmä-HEAD CI PASSia. Jos vanhoja SHA-viitteitä tai ravinto-GK-sinettejä rikkoutuu, **älä ohita tarkistuksia**: selvitä alkuperäisversioiden arkistointi ja hyväksytty uudelleenlukitus tai palauta tämä PR käsittelyyn.
- Erillinen EN/SV/TH-sisällöllinen vertailu vaaditaan, jos näille ID:ille julkaistaan käännöksiä.

Ei Cloudflare-cutoveria eikä karanteeni-ID:n poistoa.
