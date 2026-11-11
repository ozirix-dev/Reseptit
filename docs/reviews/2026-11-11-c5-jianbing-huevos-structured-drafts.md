# Issue #404 – C5: Jianbingin ja huevos divorciadosin rakenteiset V2-FI-luonnokset

**11.11.2026. EI julkaistu / EI koepaistettu / EI hyväksytty ravinto- tai GK-laskenta.**

PR #459 vei ensin bakwanin uuden version oikeaksi, koneellisesti jäsennettäväksi `reseptit/raakileet/`-reseptiksi. Tämä erä täydentää saman menettelyn kahdelle jäljellä olevalle C5-skenaariolle.

## Kaksi uutta rakenteista FI-reseptiä

| Uusi tunnus ja lähde | Määräperusta kahteen annokseen | Avoin evidenssi |
| --- | --- | --- |
| [`kiinalainen-jianbing-soy-bean-sauce-punnittu-v2`](../../reseptit/raakileet/kiinalainen-jianbing-soy-bean-sauce-punnittu-v2.md) | 100 g vehnäjauhoja, 180 ml vettä, 2 munaa, 12 g kevätsipulia, 8 g seesamia, 13,5 g öljyä, 15 g Lee Kum Kee Soy Bean Sauce -kastiketta, 1 g suolaa | Kastikkeen fyysinen etiketti, soija-/vehnäallergeenit, kuidun ja polyolien saatavuus, mahdollinen GK, paiston toimivuus ja öljyn retentio |
| [`meksikolainen-huevos-divorciados-kypsat-pavut-v2`](../../reseptit/raakileet/meksikolainen-huevos-divorciados-kypsat-pavut-v2.md) | 2 munaa, 150 g valmiiksi kypsiä **valutettuja** mustapapuja, 120 g tomaattia, 150 g vihreää salsaa, 13,5 g öljyä, 1 g suolaa | Valmiin pavun ja salsan tarkka tuote, valutusmassa, papujen todellinen ravintosisältö ja GI, öljyn retentio sekä ruokalajin toimivuus |

Kumpikin tiedosto on `status: draft`, `category: aamupala`, `language: fi`, `servings: 2`, sisältää koko valmistusohjeen ja kaikki neljä numeerista makrokenttää nulleina. **Null tarkoittaa tiedon puuttumista, ei nollaa grammaa.** Valmistuksen sekä ainesosien määrät ovat suunniteltuja uuden version lähtökohtia, eivät mitattuja koekeittiön tuloksia.

## Jäsennettävyyden ja historian tarkistus

- `site/tests/c5-second-structured-drafts.test.ts` lukee kummankin FI-draftin repo-raakileista, jäsentää Zod-reseptiskeeman, tarkistaa jokaisen ainesrivin täsmällisen määrän ja yksikön sekä varmistaa koko dokumentin Git-blob-SHA:n.
- Sama testi tarkistaa kahden alkuperäisen julkisen FI-reseptin Git-blob-SHA:n ja estää kummankaan draftin näkymisen `siteContent.recipes`-julkisessa sisällössä.
- `site/tests/assert-recipe-baseline.ts` sallii uudet tiedostot vain kolmen nyt yksilöidyn C5-version **täsmä-SHA-allowlistalla**, ja varmistaa `status: draft`, `aamupala`, `fi` sekä neljä null-ravintokenttää. Kaikkien muiden historiallisen GK-baselinen syötteiden muuttamista estetään edelleen.
- Koska todellisia kastikkeen, salsan ja papujen käyttöpakkauksia ei ole varmennettu, näille kahdelle ei tehdä hyväksyttyä ravinto- tai GK-laskelmaa. Ehdolliset skenaariomakrot säilyvät erillään julkisista resepteistä.

## Julkaisua edeltävät ehdot

1. Valitse oikeasti käytettävä jianbing-kastikkeen tuote ja varmista sen pakkauksen ravinto- ja allergeenimerkinnät; uusi `Lee Kum Kee` -versio on tuotesuunnitelma, ei väite käytössä olevasta pakkauksesta.
2. Varmista kypsien valutettujen mustapapujen tuote ja grammamäärä. **150 g kypsiä papuja ei tarkoita 150 g kuivia papuja.** Valitse myös tarkka vihreän salsan tuote.
3. Tarkista valmistuskelpoisuus ja rasvan imeytymisen perusteltu oletus, mutta älä kirjaa fysikaalista punnitusta tai koepaistoa tehdyksi ilman mittausta.
4. Laske molempien uusien versioiden makrot riippumattomasti tuotteiden ja syötävien määrien perusteella; varmista GI/GK vain reseptiä vastaavalla lähteellä. Jos ei varmennettavissa, jätä null/HOLD.
5. Tee erillinen ruokalaji- ja tarvittaessa FI/EN/SV/TH-merkityskatselmointi, julkaisu-PR ja täsmä-HEAD CI. Tämä PR ei ole julkaisuvaltuutus.

**Tulos:** kahden aiemman skenaarioluonnoksen lisäksi nyt kaksi uutta jäsennettävää FI-reseptidraftia, ei muutoksia alkuperäisten ravinto- tai GK-tietojen arvoihin, kuviin, käännöksiin, karanteeneihin tai Cloudflareen.
