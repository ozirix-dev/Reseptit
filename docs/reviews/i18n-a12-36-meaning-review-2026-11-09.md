# EN/SV/TH-erä A12 – 36 kieliversion julkaisuehdokas ja AI-lähdevertailu

**Tila:** Release candidate (PR), ei vielä tuotantohyväksyntä. **Oikeellisuus on ensisijainen, nopeus toissijainen.**

- FI-lähtöcommit: `ade461048ea138cd4f6a34340e8a53df79532bd7`
- Käännöslähde (Draft-PR #357): `3e0803e91e3e76d7dc9efa14c217b23a7f3a2047`
- 12 julkaistua suomenkielistä reseptiä, kolme kieltä kustakin; 36 julkaisuun ehdotettua kieliversiota.
- Valinta: vain `review_state: ai-compared-draft` versiolukitussa aineistossa `docs/reviews/translation-batch20-digests-2026-11-09.json` (PR #357).
- Jokainen 36 kieliversioista säilyttää FI-ainesosat samassa järjestyksessä, määrät ja yksiköiden merkityksen, annokset, valmistusnumerot, ravintoarvot ja kuvan. Käännös on tehty FI:stä EN/SV/TH:ksi, myös thai-ohjeiden kypsyys- ja poissulkurajaukset.
- Tarkistajamerkintä: **AI-lähdevertailu, ei ihmistarkistusta eikä väitettä syntyperäisestä kielikatselmoinnista**.
- Uusien julkaisujen muodolliset `source_hash`/`translation_hash`-tietueet lisätty `meta/kaannokset/codex-review-evidence.json`-rekisteriin. Ne ovat version tarkisteita, eivät yksin semanttisen oikeellisuuden todiste; katso alla oleva rajattu merkitysyhteenveto.
- FI-lähteisiin lisätty **vain** `translation_languages` ja `translation_status`. Reseptin ainekset, valmistus, ravintoarvot, GK ja kuva säilyvät.
- Lopullinen julkaisu sallitaan vasta, kun muuttuneen sisällön, tiukan käännösauditoinnin, nutrition/GK-sinetin ja julkaisu-buildin CI on **vihreä tarkalleen tällä PR-HEADilla**.
- Tämän PR:n perusteella ei saa julkaista toisen erän #356 tiedostoja eikä kahdeksaa #357:n `source-hold`-reseptiä.

## Reseptikohtainen merkitys- ja turvaraja

| Resepti-ID | AI:n FI–EN/SV/TH-merkitysvertailun olennainen tarkistus |
| --- | --- |
| `bulgogi` | Beef sirloin and dry jasmine rice, soy/pear marinade, 20–30 min refrigerated and staged searing; generic sesame seeds not assumed white. |
| `bun-cha-hanoi` | Separate pork patty and belly marinades, distinct fish sauce amounts, 30 min refrigeration, cooked pork and dipping sauce. |
| `carnitas-salaattitacot` | Pork neck, entire orange and lime liquids, 150°C for 2.5 h, crisped edges and lettuce-wrap serving. |
| `chili-con-carne-kukkakaaliriisi` | 17% ground beef, cooked drained whole kidney beans, cauliflower steamed separately, no disposal of sauce or cooking fat. |
| `harira` | Dry green/brown lentils versus cooked drained chickpeas, dry durum vermicelli, measured stock, no purée or drained broth. |
| `kana-enchilada-kukkakaalivuoka` | 500 g chicken weighed cooked, exactly 250 g four-ingredient homemade salsa, 50 g peeled lime including flesh, no tortilla. |
| `kana-fajita-pelti` | Raw chicken, 200°C oven and minimum 75°C core, all cooking liquids retained, full avocado and peeled lime, no tortilla. |
| `kanakeitto-pinaatti-sitruuna` | Raw chicken and ready-to-use stock, liquid whipping cream, peeled lemon flesh plus juice and 75°C internal temperature. |
| `kanapyorykat-tomaattikastike` | Ground chicken with shell-free weighed egg, parmesan, liquid cream and complete cooking in tomato sauce. |
| `kreikkalainen-kanavuoka-oliiveilla` | Boneless skinless chicken thighs, Kalamata olives, feta, 200°C oven and all juices divided among four servings. |
| `silakkapihvit-tilli-kermakastike` | Baltic herring (not other fish), rye flour and gluten warning, 3–4 min per side, separate liquid cream/dill sauce. |
| `uunikanapasta-kesakurpitsa` | No wheat pasta, 200°C initial oven phase of 20 min then zucchini and cheese, all sauces and low-confidence GL note. |

## HOLD-jono, ei mukana julkaisuehdokkaassa

`falafel` (pita/salaatti), `jerk-kana` (kokonaisaika), `kimchi-jjigae` (riisilisuke),
`lanttulaatikko-kermainen` (kuoren mukanaolo), `lindstrominpihvit-kaalilla` (voin jako),
`maksalaatikko-kukkakaalilla` (voin jako), `shoyu-kanakeitto-konjac` (keittäminen vs paistaminen),
`vhh-brita-kakku` (taikinan yhdistämisen ohje).

Kunkin lähde-HOLDin korjaus vaatii uuden AI-lähdevertailun ja SHA-kirjauksen. Yhteisen rekisterin integrointi
muihin aktiivisiin PR:iin tapahtuu vain yhden nimettynä toimivan omistajan kautta; konfliktit ratkaistaan
lisäämällä kelvolliset avaimet, **ei ylikirjoittamalla** aiempia todisterivejä.

## Julkaisun tarkistuslista

- [ ] Julkaisukäännökset läpäisevät strict auditoinnin (36/36)
- [ ] Käännös- ja turvallisuustestit, mukaan lukien rakenne ja valmistusmenetelmät
- [ ] FI-metadataa koskevat GK80/GK100-lukot, ravinto ja tarvittavat testit vihreinä
- [ ] Sivustobuild tuottaa 36 oikeaa kielireittiä, eikä uusia reittiduplikaatteja
- [ ] Ehdokkaan viimeisin commit ja PR-CI tarkistettu
- [ ] Mahdollinen merkittävä semanttinen epäselvyys => takaisin Draftiin (fail closed)

**Ei koepaisto- tai ihmiskatselmointiväitettä.** Ehdokas pysyy Draftina, kunnes kaikki yllä olevat ehdot on todennettu.
