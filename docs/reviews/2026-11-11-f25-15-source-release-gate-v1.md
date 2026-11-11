# F25 – 15 FI-lähteen yhteinen julkaisuportti (11.11.2026)

## Lähtötilanne ja laajan työn tavoite

Main `36f2d6874ed1c659ebe4d03a4e036d78432a04e0`, F25 julkaisussa 10 FI / 30 EN–SV–TH-kieliparia, jäljellä 15 FI / 45 paria SOURCE-HOLDissa. 9 lähteeltä puuttuu ravintolaskentatiedosto, 6:lla on laskentatiedosto mutta lähde-/menetelmätarkistus kesken, kaksi on lisäksi julkisessa karanteenissa. Tämä PR tekee suuren erän käsittelystä **turvallisesti rinnakkaistettavaa**: 8–10 FI-lähdettä saa tarkistaa ja korjata yhdessä, mutta yksittäinen SOURCE-HOLD ei pääse salaa julkaisuun, vaikka EN/SV/TH:n rakennetestit olisivat vihreitä.

## Muutos

- `meta/kaannokset/f25-release-gate.json`: 15 FI-lähdettä ja niiden lähtötilanteen lähde-blob-SHA:t, kaikkien `approval:null`. Tämä on erillinen pitkäikäinen päätösportti, ei päivämäärään sidottu tilastolaskuri.
- `site/scripts/f25-source-release-gate.ts`: käyttökelpoinen CI/CLI-preflight (esim. `cd site && npx tsx scripts/f25-source-release-gate.ts`). Jokaiselle 15 lähteelle tulos HOLD tai tarkasti perusteltu RELEASE_AUTHORIZED, ei koskaan automaattista julkaisemista.
- `site/scripts/translation-publication-index.ts`: estää puuttuvan F25-hyväksynnän sekä koko julkaisuindeksissä että kohdennetussa auditoinnissa, jo ennen `FI status:published`-tarkistusta.
- `site/scripts/translation-audit.ts`: estää suoraan `status:published`-tilaan merkityn käännöstiedoston indeksin ohi. Jatkaa erillistä karanteeniestoa #432.
- kaksi nykyisen CI:n testaamaa regressiotiedostoa: 15 ID:tä, 15 Git-blob-SHA:ta, 2 karanteenia, sivurekisteri ja suora kielitiedosto, sekä väärennetty vanhentunut approval / puuttuva ravintolaskenta.

## Aidon hyväksynnän vaatimat todisteet

Jokaista hyväksyttävää lähdettä kohti PR:n arvion ja päätöksen pitää antaa `f25-release-gate.json`-tiedostoon `approval`-objekti, jossa

1. FI-raakasisällön SHA-256 juuri kyseisestä lähteestä.
2. `docs/nutrition/calculations/<recipe_id>.json`-sisällön SHA-256, `sourceHash` juuri nykyisten FI-annosten/ainesrivien perusteella, kaikkien ainesrivit täsmäävät, neljä FI-makroa täsmäävät `calculate(...)`-tuloksiin ja ravintolaskentatila on `ESTIMATE WITH EVIDENCE`.
3. GK-reseptin, GK-laskentasyötteen ja GK-lähdeevidenssin SHA-256-sidokset `docs/nutrition/glycemic-load-recipe-bindings.json`-tiedoston nykyisiin arvoihin. GK:n arvio pitää erikseen dokumentoida `GK_RECHECKED_NUMERIC` tai `GK_UNAVAILABLE_EXPLICITLY_REVIEWED`. Tämä portti ei itsessään todista GI-laskennan oikeellisuutta; nykyiset erilliset GI/GK-auditoinnit ovat edelleen pakolliset.
4. Ruokalajin kypsyys, allergeenit ja keittiökelpoisuus sekä ainesosien mittamuunnokset tarkistettu `true`. Dokumentoitu katselmointiviite ja päivämäärä. `reviewerKind` kertoo, onko kyse AI-toimituskatselmoinnista vai ihmistarkistuksesta. Ei koskaan väitetä AI-arviota ihmisen hyväksynnäksi.
5. Sen jälkeen kaikkien kolmen kieliversion ajantasainen merkitys-SHA, pakollinen CI ja merge-SHA:n Pages-deploy.

Jokaisen alkuperäisen 15 lähteen `approval:null` säilyy nyt. Nykyiset 69 FI / 207 kieliparia ovat **ei-F25-HOLD-lähteitä**, joten niitä ei muuteta. Tämä muutos on tarkoituksella infrastruktuuria, ei uuden reseptin tai käännöksen julkaisu.

## Seuraavat käsittelykorit

**Tuote-/makrolähteet, 4 kpl:** rahka-marjakerroskulho, pinaatti-paneer-chilla, za’atar-munat, hojicha-jogurtti. Valmistajien osittainen todistusaineisto: [Valio](https://www.valio.fi/tuotteet/valio-pehmea-maitorahka/), [Salakis 10%](https://salakis.fi/tuotteet/turkkilainen-jogurtti-10/), [Arla Apetina paneer](https://www.arla.fi/tuotteet/arla-apetina/paneer-225g-69940/), [Salliselta za’atar](https://salliselta.fi/tuotteet/mausteet/zaatar) ja [Renée Voltaire hojicha](https://reneevoltaire.se/en/products/hojicha-rostad). Erityisen tärkeää: Salakis 10% *laktoositon* -tuotteen valmistajan arvo on 5,1 g HH/100g, mutta erään jälleenmyyntipakkauksen tiedoissa oli 4,4 g: tuoteversio on nimettävä, eikä tämä ero saa peittyä mallin yhden desimaalin sisään.

**Kokkimenetelmän portit, 4 kpl:** tapiokahelmen keitto-/valutusaika, bánh cuốnin porsaan kypsyys ja riisilevyjen irrotus, bánh xèon riisitaikinan ja kurkuman/kuvan vastaavuus sekä baghririn vesimäärä ja oikea perinne-identiteetti.

**Puuttuvan laskennan muut lähteet, 5 kpl:** chilaquiles, paputostada, kimchi-jeon, plantain-aamiaislautanen ja munakoiso-lasagne. **Karanteeni, 2 kpl:** maakouda ja nasi goreng. Karanteenia ei voi ohittaa tällä approvallakaan, koska erillinen #432-vartija hylkää ne.

Kaikki voidaan käsitellä seuraavan suuren 15 lähteen erän sisällä. **Kenenkään ei tarvitse yhdistää vanhaa Draft #399:ää**; jokainen hyväksytty käännös julkaistaan tuoreelta main-pohjalta.
## Katselmointikorjaus 11.11.2026

Ensimmäinen CI-ajo oli vihreä, mutta Codex havaitsi, ettei uusi `f25-source-release-gate.test.ts` ollut vielä `site/package.json`-tiedoston varsinaisessa CI-testilistassa. Korjaus lisää sen sekä `test`- että `test:translations`-ajoihin. Vanhentuneen lähde-SHA:n testi käyttää nyt za'atar-munia, joilla on olemassa oleva laskentatiedosto; näin testi etenee oikeasti SHA-tarkistukseen eikä pysähdy aikaisempaan puuttuvan laskentatiedoston ehtoon. Myös toinen testi varmistaa, että laskentatiedostoton paneer-chilla hylätään ennen muuta hyväksyntää. Tässä vaiheessa on tärkeää todentaa uusi täsmä-HEAD CI ja uusia Codex-katselmointi, ei vain hyväksyä edellisen vihreän ajon tulosta.
