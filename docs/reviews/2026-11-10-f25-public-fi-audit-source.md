# F25 – käännösten FI-lähteen tekstiversion täsmäkorjaus (10.11.2026)

## Ongelma

[PR #401](https://github.com/ozirix-dev/Reseptit/pull/401) ja [PR #403](https://github.com/ozirix-dev/Reseptit/pull/403) korjasivat 22:n F25-reseptin julkiset FI-valmistusohjeet olemassa olevalla `fi-breakfast-quality-display.ts`-projektorilla. Käännösauditointi `site/scripts/translation-audit.ts` luki kuitenkin edelleen raaka-FI-tiedostojen vanhoja valmistusohjeita ja metadataa. Esimerkiksi pistaasijogurtin raakaversio on virheellisesti `paistaminen`, julkinen versio `kylmävalmistus`. Baghririn raakateksti lupaa hunajavoita, vaikka julkinen korjattu ohje ei sisällä voita. Siten tuleva käännösjulkaisu voisi verrata kieliversioita väärään FI-lähtöön ja tallentaa merkityshashin vanhasta ohjeesta.

## Rajattu korjaus

`auditTranslations()` käyttää nyt **vain tarkasti sallittujen 28 FI-reseptin** osalta samaa SHA-256-lukittua julkista FI-projektiota kuin sivuston muodostus. Muu reseptiauditointi säilyy ennallaan.

- Kanoniset FI-raakalähteet, lähdeblobin SHA:t, ravintolaskennan JSON:t, GI/GK-tietueet ja kuvatiedostot eivät muutu.
- Projektio hyväksytään vain, jos pysyvät kentät täsmäävät: recipe ID, URL-slug, kategoria, FI-kieli, published-status, annokset, aika, diet-class, aineslista, neljä makroa sekä kuvan polku, mitat ja muut tiedot ilman vaihtoehtoisen tekstin sallittua toimituksellista oikaisua.
- Jokaisen lähteen tarkka raaka-SHA varmistetaan projektorissa. Muuttunut lähde tai korjausankkuri pysäyttää auditoinnin (`FI_BREAKFAST_SOURCE_STALE` / `FI_BREAKFAST_ANCHOR_AMBIGUOUS`).
- Käännösten `semanticHash` saa nyt saman FI-sisällön, joka näkyy yleisölle. Ihmis-/AI-katselmointi on silti tehtävä erikseen, eikä automaattista `pass`-evidenssiä luoda.
- Regressiotesti varmistaa 5 tapausta: baghririn otsikko+alt+ravintokenttä, pistaasin kylmävalmistus, uunimunan koko määrä, rahkan annokset ja kylmämetodi sekä gyeranbapin kuiva riisi.

**EI F25-käännösten julkaisua tässä PR:ssä.** Ne säilyvät [#399:n](https://github.com/ozirix-dev/Reseptit/pull/399) Draft-haarassa. Tämä PR ei koske uuden FI-reseptin porttia [#400](https://github.com/ozirix-dev/Reseptit/pull/400) eikä 82 osuman luokittelua [#402](https://github.com/ozirix-dev/Reseptit/pull/402). Tämä korjaus on edellytys F25:n viiden ensimmäisen julkaisuehdokkaan tarkalle merkityskatselmoinnille.
