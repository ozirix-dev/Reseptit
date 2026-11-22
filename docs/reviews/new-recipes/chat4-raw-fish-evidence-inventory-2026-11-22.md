# Chat-4 – graavisiian ja muikunmädin SHA-sidottu katselmointiinventaario

Päiväys 2026-11-22. Omistaja Chat-4. Lähtö-main: `f9de3630d6e0e770156d0edb80ee6f0d217298ad`.

**Tämä ei ole julkaisu- eikä semanttinen hyväksyntä.** Alla oleva JSON on kahden FI-luonnoksen ja kuuden EN/SV/TH-luonnoksen tarkka Git-blob-inventaario; blob-tunniste ei korvaa `meta/kaannokset/codex-review-evidence.json` -rekisterin SHA-256-hyväksyntää.

- Riskipohjainen lähdekäytäntö: `docs/reviews/new-recipes/chat4-risk-based-recipe-evidence-policy-2026-11-21.md`. Yleiseen reseptiin **ei** edellytetä automaattista valmistajakirjettä.
- Nykyinen nelikielinen riskiohjeiden regressiotesti: `site/tests/chat4-raw-fish-draft-safety.test.ts`. Sen PASS on tekninen tarkistus, ei tuotekohtainen turvallisuustodistus.
- Tiedostojen nykytila on `draft`, raakakäytön turvallisuusehdot eivät ole julkaisuvaltuutus.
- Tämän erän uusi testi `site/tests/chat4-raw-fish-evidence-gate.test.ts` tarkistaa inventaarion jokaisen blobin ja Draft-tilan. Sisällön muuttuessa inventaario on päivitettävä tietoisesti; tätä ei saa tulkita automaattiseksi semanttiseksi hyväksynnäksi.

## Jäljellä olevat portit

1. Molempien reseptien mittasuhteiden, saannon ja valmistuskelpoisuuden riippumaton arvio.
2. Ajantasaisen Ruokavirasto-ohjeen ja kylmäketjun loppukatselmointi; raakakäyttökelpoisuuden ja vaaditun käsittelyn epävarmuudessa ei tarjoilla kuumentamatta.
3. Kuuden käännöksen riippumaton semanttinen hyväksyntä ja kanonisen lähde- ja käännös-SHA-256:n rekisteröinti oikeaan hyväksyntärekisteriin.
4. Ravintoarvo-, GK-, kuva- ja mahdolliset muut julkaisun hyväksyntäportit erikseen.

**Luovutus Chat-1:lle:** tämän dokumentointi- ja testi-PR:n voi yhdistää CI:n jälkeen, mutta se ei anna lupaa julkaista kumpaakaan reseptiä. Ready ja merge ovat vain Chat-1:n tehtäviä.
