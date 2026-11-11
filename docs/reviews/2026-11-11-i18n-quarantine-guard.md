# F25 ja koko käännösputki – karanteeni estää kielijulkaisun

11.11.2026. Tämä rajattu porttikorjaus ei muuta FI-reseptejä, EN/SV/TH-tekstejä, julkaisuindeksiä, GI/GK-sinettejä eikä karanteenilistaa. Pohja main `9e6a00c33b1ee2c1cf0de2f086b257da8d3c8f50`.

## Löytynyt aukko

`site/scripts/translation-publication-index.ts` tarkisti että julkaisuhakemistossa ilmoitetulla FI-lähteellä on `status: published`. Issue #404:n 21 julkisessa karanteenissa olevalla historiallisella lähteellä raakastatus on tarkoituksella edelleen `published` GI/GK-historian säilyttämiseksi. Ilman erillistä estettä uusia EN/SV/TH-käännöksiä voisi yrittää kirjata muuten piilotettuun reseptiin.

F25:n 17 jäljellä olevasta lähteestä **kaksi on tässä tilanteessa**:
- `pohjoisafrikkalainen-maakouda` — punnitsematon peruna ja alimitoitettu makro-/GK-perusta.
- `indonesialainen-nasi-goreng-aamiaisriisi` — 150 g kecap manis sekä kuiva-/kypsäriisin epäselvyys.

## Korjaus

1. Uusi `assertTranslationSourceIsNotQuarantined(recipeId)` tarkistaa keskitetyn `publicRecipeQuarantineIds`-luettelon.
2. Sitä kutsutaan jokaisen `published-translation-pairs.json`-rekisteririvin kohdalla **myös kohdennetussa auditoinnissa** ennen FI-raakastatuksen käsittelyä.
3. Samaa vartijaa kutsutaan `auditTranslations`-toiminnossa jokaiselle suoraan `status: published`-tilaiselle kielitiedostolle, vaikka julkaisuindeksistä ei olisi riviä.
4. Kolme regressiotestiä todentavat molemmat estoreitit ja kohdennetun auditoinnin. Puhdas ei-karanteenissa oleva lähde pysyy sallittuna.

Nykyisen `main`-version 67 käännetyn FI-lähteen julkaisuindeksi ei sisällä yhtään 21:n karanteenitunnuksen reseptiä; muutos ei tarvitse takautuvaa aineistomigraatiota. Karanteenista julkaiseminen vaatii ensin erillisen turvallisuus-/ravinto-/GK-perustan hyväksynnän ja luettelon muuttamisen perustein.

## Testi ja julkaisu

PR:n exact-HEAD CI:ssa tulee suorittaa vähintään `test:translations` / `translation-publication-index.test.ts`, muu CI riskivalitsimen mukaisesti. Merge vasta PASSin ja katselmoinnin jälkeen; uuden mainin Pages build+deploy erikseen. Tämä on **ohjelmallinen julkaisuportti**, ei ravitsemustieteellinen hyväksyntä eikä henkilökohtainen keittiökoe.
