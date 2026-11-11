# Issue #404 – C5: kolmen grammoitetun FI-reseptiversion toteutusluonnokset

Päiväys 11.11.2026. **Luonnokset ovat reseptisuunnittelua, eivät mitattuja tai koepaistettuja reseptejä.** Niitä ei ole lisätty sivuston julkaistavaan reseptiluetteloon.

## Toteutettu

| Alkuperäinen resepti | Uusi erillinen FI-versioluonnos | Ennen mahdollista julkaisua |
| --- | --- | --- |
| Bakwan-maissifritterit | [60 g porkkanaa ja 100 ml taikinavettä](c5-variants/bakwan-maissifritter-60g-porkkana.md) | Veden toimivuus, fritterien tuotto, rasvan retentio ja riippumaton ravinto/GK |
| Jianbing-munalettu | [15 g nimettyä Soy Bean Sauce -kastiketta](c5-variants/jianbing-soy-bean-sauce-15g.md) | Käytetyn tuotteen etiketti, ravintosisältö, vehnä-/soija-allergeenit, todellinen kastikemassa ja GI/GK |
| Huevos divorciados | [150 g kypsiä, valutettuja mustia papuja](c5-variants/huevos-divorciados-cooked-beans-150g.md) | Papujen tuotemerkki ja valutusmassa, vihreän salsan tuote, tomaatin punnitus, koko ruoan ravinto/GK |

Näissä käytetään **uutta, erikseen määriteltyä grammoitettua versiota**, joka ei muuta historiallisia FI-lähteitä. Työaineisto käyttää nykyistä kahden annoksen rakennetta ja säilyttää ruokalajien idean. Ehdotetut taikinaveden, porkkanan, kastikkeen, tomaatin ja suolan määrät ovat suunnitteluarvoja; niitä ei esitetä fyysisinä punnituksina.

## Riippumattomat valmistusvertailut

- [Rasa Indonesia / Kimi Abdullah, bakwan jagung](https://coventmarket.com/wp-content/uploads/2021/08/Bakwan-Jagung-Indonesian-Corn-Fritter-Kimi-Abdullah-Aug-2021.pdf): kasvisten ja jauhon taikina, nestettä ja pannulla paistaminen. Esikuvan neste-/ainesmäärät eivät ole yksi yhteen tämän koeversion kanssa.
- [Australian Eggs, Jianbing](https://www.australianeggs.org.au/recipes-and-cooking/jianbing): ohut jauho-vesitaikina, muna ja kevätsipuli, kastike, pannulla paistaminen. Recipavon versio on tarkoituksella pelkistetty ilman baocui-rapeaa täytettä ja muita listaamattomia tuotteita.
- [Margarita Carrillo Arronte, Huevos Divorciados](https://www.newworlder.com/huevos-divorciados/): kahden erilaisen salsan idea ja munien yhdistäminen papuihin. Recipavon versiosta on jätetty pois lisukkeita, joita ei aiemman reseptin ravintopohjassa ollut.

## Tekninen toteutus ja rajat

- [Sinetöity luonnosmanifesti](2026-11-11-c5-draft-release-manifest.json) sisältää kolme nykyistä alkuperäisen FI-lähteen Git-blob-SHA-tunnistetta, kolme erillistä täsmä-SHA-lukittua luonnosta, tarkistettavat ainemääräilmaukset ja hyväksyntäesteet.
- `site/scripts/c-five-draft-version-gate.ts` varmistaa alkuperäisen version muuttumattomuuden ja estää julkaisuoikeuden, ravinto- ja GK-hyväksynnän sekä fyysisen koepaiston väittämisen tehdyksi.
- `site/tests/c-five-draft-version-gate.test.ts` testaa lähde-/luonnostarkisteet, kontrolloidut ainesmääräilmaukset ja väärin muuttuneet hyväksyntäarvot.
- `cd site && npm run audit:c5-drafts` on erillinen halpa esikatselmointi. Tavallinen `npm test` sisältää regressiotestin.
- Ei muutoksia olemassa oleviin FI-resepteihin, kuviin, käännöksiin, ainesosien nykyisiin makroarvoihin, GK-kattavuuteen tai karanteenilistoihin.

### Seuraava julkaisuun tähtäävä korjaus

Tässä on kaksi eri päätöstä: ensin hyväksytään suunnitellun version ruokaan tarvittavat tarkat määrät ja toimintatapa, sitten hyväksytään niihin sidottu riippumaton ravinto-/GK-laskenta. **Käyttäjän aiemmin hyväksymä oletuskoepaisto ei ole todiste fyysisestä koepaistosta**, eikä sitä saa merkitä mittaustulokseksi. Myöhemmässä PR:ssä voidaan tehdä versiosta FI-`draft` tai julkaistu resepti vasta kaikkien relevanttien ruoka-, ravinto-, turvallisuus-, lähde- ja käännösporttien täyttyessä.

**PR-status: Draft / DO NOT MERGE, kunnes täsmä-HEAD CI on PASS.** Tämän PR:n yhdistäminen julkaisee ainoastaan sisäiset työaineistot, ei reseptejä käyttäjille.
