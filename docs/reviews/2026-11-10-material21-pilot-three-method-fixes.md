# 21 aines- ja ravintoperustan HOLD-tapausta – kolmen ohjekorjauksen esitysrajaus

**Issue #404, kohdat 02, 40 ja 63.** Näille on tehty ruokalajikohtainen suomenkielinen julkinen valmistusohje, joka ajetaan vain alkuperäisen **Git-blob-SHA-tunnisteen** täsmätessä. Kyse ei ole uudesta riippumattomasta ravintotutkimuksesta eikä reseptien koepaistosta.

| # | Resepti | Julkisen valmistuksen korjaus | Jäljellä oleva aines-/ravinto-HOLD |
|---:|---|---|---|
| 02 | `indonesialainen-bakwan-maissifritter` | Maissin, porkkanan, jauhon ja 1 rkl paistoöljyn ruokalajikohtainen käsittely; tavallinen taikinavesi | Porkkanan syötävä massapaino sekä käytetyn taikinaveden dokumentointi; ravintoarvojen lähteen varmistus |
| 40 | `meksikolainen-huevos-divorciados` | Kaksi kastiketta: tomaatti sekä valmis vihreä salsa; munien paisto | Mustien papujen kuivapainon/kypsän massan ja GI/GK-laskennan vahvistus |
| 63 | `lahi-ita-labneh-kulho-zaatarilla` | Kylmän annoksen resepti, lisättyä oliiviöljyä ja tekaistuja lämpimiä proteiineja ei ole | Oliivien ja kurkun punnitusperusta sekä riippumattomat makro- ja GI/GK-perusteet |

**Toteutustapa:** `site/scripts/material21-fi-public-display.ts` toimii vain kolmella lähdepolulla ja täsmällisellä SHA-lukolla. Alkuperäisten `reseptit/aamupalat/*.md`-tiedostojen tavut, ravintoarvot ja olemassa olevat GI/GK-lukitukset pysyvät muuttumattomina. Sama oikaistu FI-esitys annetaan tulevien käännösten semanttisen tarkistuksen vertailupohjaksi.

**Ei hyväksytä laskentaa vain oikean ohjeen perusteella.** Kolme issue #404:n korjauskorttia jäävät avoimeksi. Muut 18 B21-tapausta jäävät erilliseen tarkistukseen; niille ei keksitä puuttuvia grammoja. Cloudflare-tuotantoon ei kosketa.
