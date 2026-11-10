# PR #412: kaksi julkaistua reseptiä ja GK-historian rajaus (10.11.2026)

PR #412 julkaisi `sienikakkupohja` ja `perinteinen-mansikkataytekakku-sienikakkupohjalla` -reseptit. Nykyisessä FI-historiassa on **337** julkaistua alkuperäistä reseptiä, joista **2 uutta** ovat GK-osalta `INSUFFICIENT SOURCE DATA`. Yhtään vanhaa 326/335-laskentatulosta eikä 87 GK-varianttia muuteta.

- Uusien reseptien täsmäjulkaisun Git-commit `004284fe72da0463295f1ac3bf2afaecf3f34895` ja FI-reseptitiedostot ovat erillinen hyväksyntäraja vanhan historiallisen baseline-aineiston rinnalla. Muuntunut resepti ei saa luvan muuttua vain julkaisustatuksen perusteella.
- `site/tests/original-content-transition.ts`: vain nämä kaksi ID:tä poistetaan **historiallisessa vertailunäkymässä**. Oikeassa `tmp/nutrition/glycemic-load-pilot.json`-raportissa molemmat säilyvät; niiden GK pysyy puuttuvana, ei nollana.
- Julkiset kokonaisluvut kasvavat `335 → 337`: alkuperäisiä GK-lukuja edelleen 156, niiden puuttuvia 181, erillisiä GK-variantteja edelleen 79 ja vertailuja 8. Uusi 80 % tavoitteellinen numeromäärä `ceil(0,8×337)=270`.
- Kaksi reseptiä eivät ole itsenäisesti uudelleen laskettuja tässä PR:ssä. Neljä aiemmin hyväksyttyä ravintokenttää ja niiden epävarmuus eivät muutu. Tässä PR:ssä ei lisätä käännöksiä, uusia numeerisia GK-lukuja eikä muita reseptejä.
- Historiallisten testien muutokset ovat täsmällisiä versionrajaustäsmennyksiä; vanhoja lähdehash-lukkoja, hyväksyttyjä tutkimustuloksia tai laskennan laskutoimituksia ei muuteta.
