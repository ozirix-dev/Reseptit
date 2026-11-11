# Karnivore Smashburger – ensimmäisen FI5-kuvaerän rajattu julkaisukandidaatti (11.11.2026)

Tämä versio tekee juuri yhden `status: published` -FI-julkaisukandidaatin kuvista, jotka PR #488 jo yhdisti main-haaraan. Muita neljää kuvitetua karnivore-ruokaa **ei** julkaista; seitsemän muun luonnoksen status säilyy.

## Lähteet ja laskenta

- Tuote: Snellman Kunnon naudan jauheliha 20 % 400 g, EAN **6409620011856**. 500 g punnittua lihaa, joten tuotetta voidaan ottaa kahdesta pakkauksesta.
- Tuote: Ellin keittiö 100 % ruohoruokittu naudan tali 500 g, 10 g käytettyä talia. Kaupan ilmoitus 99 g rasvaa ja 1,2 g proteiinia / 100 g.
- Suola: Fineli R20, ID30, 4 g.
- Aineskohtaisten kuitu- ja polyolirivien perusteena vastaavat AFCD F000678/F003627 -tietueet; nämä **eivät ole tuotteen täysin samaa koostumusta todentavia laboratoriotutkimuksia**. Tarkka brand-matching koskee etiketin proteiini-, rasva- ja hiilihydraattiarvoja.
- Koko raaka-aine-erä ja myös irronnut paistorasva jaetaan kahdelle annokselle. Retentio-oletus **1,0** on kirjoitettu valmistusohjeeseen. Se ei ole havaittu paistotulos.
- Laskenta/annos: proteiini **45,07 g**, rasva **54,95 g**, imeytyvä HH **0,00 g** (etiketin pyöristystä vastaava arvio). GK:lle ei löydy hyväksyttyä GI:tä; tila on **puuttuva**, ei 0.
- Pannulle jäävä rasva voi tuottaa merkittävän erotuksen todelliseen annosrasvaan, eikä lukuja saa yleistää muihin 20 % jauhelihoihin tai eri taleihin.

Lähteet: https://snellman.fi/fi/tuotteet/kunnon-naudan-jauheliha-20-400-g/ , https://ellinkeittio.fi/products/ellin-keittio-ellin-100-ruohoruokitun-naudan-tali-500-g , https://fineli.fi/fineli/fi/elintarvikkeet/30

## Julkaisuraja

1. Koko FI-lähteen Git-blob-tiiviste sidottava sekä dietTags-hyväksyntään että erilliseen GK-puuttuvaan statukseen.
2. Valmista `docs/nutrition/calculations/karnivore-smashburger.json` vastaava `sourceHash` ja neljän makron ravintotarkiste.
3. Hyväksy vain yksi FI-julkaisu. Maksa ja pekoni, Meatza, broilerin reisipalat ja lammaskyljykset pysyvät odottamassa omia tuotekohtaisia saantoratkaisuja.
4. Testaa `main`-historian muuttumattomuus, valittu GK-kattavuus, kuvan metadata, suodatin ja koko sivuston CI. Älä merkitse Ready/julkaistuksi ilman viimeisen commitin vihreää CI:tä.
