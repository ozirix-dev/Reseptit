# F25 A2 – neljä kokonaista valmistuskelpoista FI-korjausehdokasta

**Tila 11.11.2026: HOLD, ei tuotantoon.** Työ jatkaa [PR #453:n](https://github.com/ozirix-dev/Reseptit/pull/453) kolmeen julkiseen FI-ohjeeseen jo tekemiä korjauksia, mutta ei muokkaa uudelleen GK-lukittua raakaa FI-Markdownia eikä aiempia historiallisia ravintoarvoja. Neljän uuden täydellisen ehdokkaan sijainti on `docs/reviews/f25-a2-draft-recipes/`, ei `reseptit/`. Testit ja `f25-a2-four-fi-draft-manifest-20261111.json` estävät lähteen ja julkaisustatuksen sekoittamisen.

## Neljän ehdokkaan päätösmatriisi

| Lähde | Vanha → uusi aika | Ehdotettu muutos | Miksi edelleen HOLD |
|---|---|---|---|
| Papaija-kookos-tapiokapuuro | 25 → 40 min | 100g pieni kuivattu tapioka + 700ml keitinvettä puuroon kokonaan, 200ml kookosmaito, 200g papaija, 15g lime | Tarkka helmityyppi ja tuote/kypsymisaika varmistamatta |
| Bánh cuốn | 25 → 50 min | 100g riisijauho + 250ml vesi, 150g läpikypsä porsaan jauheliha, 100g sieni, 1rkl kalakastike, ei lisäöljyä | Pannulla hauraan öljyttömän riisilevyn irtoaminen, läpikypsyys, kala-allergeeni, uusi FI-aika/GK |
| Bánh xèo | 25 → 45 min | Ehdokastaikinaan +120ml vettä, 100g riisijauho, 200ml kookosmaito; 150g kypsä katkarapu, 150g kuuma idut, 1rkl öljy | Vaalea kurkumaton muunnelma, lisävesi muuttaa lähdetarkisteen, pannulla rapeus ja kuvan vastaavuus |
| Baghrir | 25 → 45 min | 150ml → 300ml vettä, 100g manna + 100g vehnä, 5g kuivahiiva; yksipuolinen paisto, 1rkl hunajaa, ei voita | Veden muuttuminen mitätöi nykyisen lähde-GK-version, ilman leivinjauhetta reikien muodostus epävarma |

**Tärkeä ravintoraja:** Vesi on makroiltaan nolla, mutta `recipeNutritionInputHash` ja GI/GK-sidokset sisältävät myös sen määrän. Ehdokasta ei saa merkitä samaksi reseptiversioksi eikä sen neljää nykyistä makroa hyväksytyiksi ilman uuden FI-lähteen ja laskentaversion tarkastusta.

## Tapiokahelmien tuotekohtainen, laskentaa muuttava ero

Suomessa [K-Ruoan Cock pienet tapiokahelmet 400 g](https://www.k-ruoka.fi/kauppa/tuote/cock-tapioca-pearl-400g-0084909007087) (suomalaisen myyntilistan EAN 0084909007087) ilmoittaa **86 g imeytyvää hiilihydraattia / 100 g**. Alkuperäisen FI:n nykyisessä [AFCD:n laskentasyötteessä](../../docs/nutrition/calculations/vietnamilainen-papaija-kookospuuro.json) 100 g kuivia helmiä vastaa **79,3 g / 100 g**. **Erotus: (86−79,3) × 100/100 ÷ 2 = 3,35 g netto-HH per annos** jo ennen muita aineita. Veden 700 ml säilyttäminen puurossa ei korjaa tätä tuote-eroa. Myyntietiketin kuitu- ja polyolitiedot eivät ole tässä lähdetodisteessa täydelliset, joten uutta neljän makron lukua ei voida hyväksyä.

Tämä poikkeama on lukittu myös A2-manifestiin ja regressiotestiin, jolloin tuotteen vaihtaminen vaatii ravinto-/GK-lähdearvion eikä ainoastaan valmistusohjeen muutosta. K-Ruoka antaa samalle tuotteelle noin 30 minuutin kypsennysohjeen omassa tapiokavanukkaassaan; 40 minuutin ehdotettu kokonaisaika ei ole fyysisesti mitattu eikä joka tuotteella taattu.

## Riippumattomat valmistuslähteet

- [The Woks of Life: kuivien tapiokahelmien keitto](https://thewoksoflife.com/how-to-cook-tapioca-pearls/) käyttää noin 15 minuutin keittoa, 15 minuutin lepoa ja valuttamista **eri menetelmällä**. Tässä puurossa vettä ei valuteta; älä väitä lähteen vahvistavan tiettyä 700ml:n puuromallia tai 40 min valmistusta yleispätevästi.
- [Bon Appétit / Andrea Nguyen, bánh cuốn](https://www.bonappetit.com/recipe/banh-cuon) kertoo kannellisella tarttumattomalla pannulla valmistuvista riisilevyistä ja niiden haurautta koskevasta käsittelystä. Kotisovellus on tarkistettava erikseen, koska tuotteessa ei käytetä lisäöljyä.
- [King Arthur Baking, bánh xèo](https://www.kingarthurbaking.com/recipes/banh-xeo-vietnamese-crispy-crepes-recipe) ja [SBS Food](https://www.sbs.com.au/food/recipe/vietnamese-banh-xeo/0cngr6ab1) osoittavat, että ohueen taikinaan lisätään vettä ja klassiseen keltaiseen muunnelmaan kurkumaa. Tämä vaalea muunnelma jätetään nimeltään erottuvaksi, eikä valokuva saa näyttää toisen muunnelman annosta.
- [Baghrir semolinasta ja vehnäjauhosta](https://marokkanisch.com/en/recipes/baghrir-with-semolina-and-flour/) käyttää 500g jauhoseokseen 800ml vettä; 200g skaalattuna 320ml. Tässä **300ml on eksplisiittisesti ehdotus**, ei väitetty autenttisen lähteen täsmäannos. [Yksipuolinen kypsytys](https://marokkanisch.com/en/recipes/baghrir/) ja 10–15 minuutin kohotus tukevat menetelmää, mutta ehdotuksesta puuttuu usein käytetty leivinjauhe.

## Koodin ja näyttöjen suoja

- 4 raakaa FI-lähdettä **ja neljä uutta kokonaista FI-luonnosta** Git-blob-SHA-lukittuja erikseen. Jokaisen luonnoksen sisällön muuttaminen ilman uuden lähde- ja päätöskatselmoinnin version päivitystä pysäyttää CI:n. Lähteiden 4-kanonista makrokenttää tai GI/GK-mallia ei muokata.
- Ainesrivit, nimetyt uudet määrät, vanhat ja uudet kokonaisajat sekä varsinaiset valmistusvaiheet kirjataan koneelliseen päätösmanifestiin. Testi ajaa lähdeidentiteetin ja julkaisun fail-closed-tarkistuksen myös kohdennetussa käännös-CI:ssä.
- 4/4 `nutritionApproved:false`, `gkApproved:false`, `translationApproved:false`, `physicalTrialCompleted:false`. Vanha #399 Draft ei ole julkaisukelpoinen eikä siitä yhdistetä kieliversioita ilman uutta hyväksyntää.
- Seuraavassa erillisessä FI-hyväksyntä-PR:ssä päivitetään `reseptit/`-lähde, laskenta/tuotekoostumus, GI/GK:n uusi versiosidos, `f25-release-gate.json` ja EN/SV/TH merkitystarkisteet vain yksilöidyille hyväksytyille resepteille.

Ei väitettä fyysisestä koepaistosta, ihmisen tekemästä ravintolaboratoriotarkistuksesta tai autenttisuudesta. F25:n 45 HOLD-käännöstä ja 15 portissa olevaa FI-lähdettä pysyvät ennallaan.
