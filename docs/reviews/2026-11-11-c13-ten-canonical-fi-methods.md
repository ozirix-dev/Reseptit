# Issue #404 / C13 – yhdeksän kanonista FI-ohjetta ja yksi käännös-HOLD

Päiväys 11.11.2026. **Valmistusmenetelmän tekstisiirto, EI ravinto- tai GI/GK-hyväksyntä.**

## Lähdemigraation kohteet (9)

| FI-resepti | Julkisessa näyttöoikaisussa jo käytetty menetelmä | Avoin ravinto-/laatuvelka |
| --- | --- | --- |
| malesialainen-kaya-paahtoleipa | Kaya-vesihaude ja valmiin leivän paahto | Turvallinen munakypsyys ja todellinen 25 min valmistusaika; ei koepaistoa |
| valimerellinen-halloumi-tomaattileipa | Halloumin paisto ja valmiin leivän paahto | Hapanjuurileivän tuotekohtainen ravinto/GK |
| intialainen-rava-uttapam | Mannasuurimo-jogurttitaikina ja kasvisletut | Tomaatti- ja sipulipainot |
| lahi-ita-ful-medames | Kypsien härkäpapujen lämmitys ja murskaus | Valmiiksi kypsä / kuiva papupohja |
| meksikolainen-aamiais-tacot-mustapavuilla | Kypsät pavut, munat ja tortilla | Papujen kuiva/kypsä-painon evidenssi |
| valimerellinen-menemen-fetalla | Muna kypsennetään tomaatti-paprikaseoksessa | Kappalepainot, feta-tuotetiedot |
| valimerellinen-pinaatti-fetashakshuka | Munat haudutetaan tomaatti-pinaattikastikkeessa | Tomaatin kappalepaino, fetan tuotetieto |
| vietnamilainen-pho-ga-aamuksi | Kana kypsennetään vähintään 74 °C:seen ja riisinuudelit keitetään erikseen | Nuudelien kuiva/kypsä-massa, laskennan lähteet |
| intialainen-mannasuurimoupma | Mannasuurimoiden kuivapaahto ja kasvisten keitto | Porkkanan kappalepaino |

Yhdeksän uuden kanonisen FI-ohjeen teksti vastaa **samaa reseptiä jo aiemmin PR #425:ssä palvellutta lähde-SHA-lukittua julkista näyttöoikaisua**; julkaistujen ainesosarivien, annosten, valmistustavan metatietojen ja ravintoarvokenttien muokkaus ei kuulu tähän PR:ään. Uudet muistiinpanot ilmaisevat keskeneräisen ravintoperustan, eivät hyväksy sitä.

## Tekniset portit ja rajaukset

- C13:n **poha-maapahkinoilla** jätettiin erästä pois: ensimmäinen CI-ajo #42932727708 vahvisti kolmen julkaistun EN/SV/TH-käännöksen `REVIEW STALE`-esteen. Poha säilyy aiemmin jo käytetyllä SHA-lukitulla julkisella FI-ohjekorjauksella eikä sen lähdetekstiä tässä erässä muuteta. Käännösten merkitystarkisteita ei saa ohittaa eikä hyväksyä ilman tuoretta katselmointia.
- C13:n **manakish-zaatarilla** jätetään eri PR:ään: oikea perinteinen hiivataikina vs. nykyinen nopea jogurttipannuleipä ja GK-laskennan rajaus tarvitsevat erillisen katselmoinnin.
- `site/scripts/c13-fi-public-display.ts` jää täsmä-SHA-lukittuna vain manakishille.
- Uusi `site/tests/c13-canonical-historical-transition.ts` lukitsee yhdeksän uutta Git-blob SHA-1:tä, tarkistaa vanhaan `main`-commit `9e6a00c33b1ee2c1cf0de2f086b257da8d3c8f50` -lähteeseen nähden koko frontmatterin ja muun valmistusta edeltävän tekstin muuttumattomuuden sekä antaa jäädytetyille GK-testeille vain alkuperäisen laskenta-ajankohdan reseptitekstin. Tuntematon muutos hylätään.
- Historiallinen GK-auditin `source_content_hash` ja `notes` rekonstruoidaan vain edellä mainituille yhdeksälle täsmäversiolle; julkinen sivusto lukee uutta kanonista FI-ohjetta. Ei vanhan numeerisen GK:n uudelleenhyväksyntää.
- Issue #404:n tekninen tilajako vasta CI-hyväksytyn yhdistämisen jälkeen: **21 karanteenia + 6 SHA-lukittua näyttökorjausta + 11 kanonista FI-valmistusohjetta = 38**. Kaikki 38 lähde-/ravintotutkimuksen seurantakorttia pidetään edelleen avoimina.
- Ei uusia käännöksiä eikä Cloudflare-tuotantodomainin muutosta.
- **Draft / DO NOT MERGE ennen täsmä-HEAD CI PASSia**, historiallisten tiivisteiden regressiota ja rinnakkaisten PR:ien konfliktitarkistusta.
