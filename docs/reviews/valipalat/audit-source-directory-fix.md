# Välipalat: auditoitava lähdehakemisto (2026-11-07)

CI:n **käännös- ja ravintoauditointi** käy läpi julkaistut FI-reseptit lähdehakemistoissa `reseptit/`. Uusi kategoria `reseptit/valipalat/` pitää kuulua samaan rekisteriin kuin aamupalat, alku-, pää- ja jälkiruoat sekä leivonnaiset.

## Löydös ja korjaus
- Ennen tätä muutosta `site/scripts/build-content.ts` luki välipalat, mutta `site/scripts/translation-audit.ts` ei. Tämän vuoksi uuden julkaistun välipalan lähdeversio olisi voinut jäädä käännös- ja ravintoauditin tarkistusten ulkopuolelle.
- `translation-audit.ts` on korjattu lukemaan myös `valipalat` ja paljastamaan lähdehakemistolistan testattavaksi.
- `published-content.test.ts` inventoi jatkossa myös välipalat.
- Testi todentaa, että kaikki julkaistut FI-välipalat sisältyvät käännösauditin `publishedSources`-listaan. Se ei edellytä, että yhtään välipalaa olisi jo julkaistu.

## Julkaisupolun vaikutus
Uusi julkaistu välipala ei enää voi jäädä väliin auditoinnista vain siksi, että se sijaitsee uudessa hakemistossa. Ravintoarvojen `docs/nutrition/calculations/<id>.json` -sidos ja olemassa olevat lähdetarkistukset koskevat tällöin myös välipaloja. VHH/Keto/GK-luokkia ei muuteta eikä historiallisia reseptejä kosketa.

**Ei julkaise reseptejä eikä tarvitse muiden projektien muokkaamista.**
