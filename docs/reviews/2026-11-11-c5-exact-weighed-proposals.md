# Recipavo / issue #404 – Erä C, vaihe III: punnitut versiovaihtoehdot ja tuotekohtainen skenaariolaskenta

**11.11.2026.** Tämä on toteutettu **erillisenä, julkaisemattomana reseptiversion suunnitteluna**. Nykyiset FI-reseptit, annokset, ravintoluvut, GI/GK-historiat ja karanteenit ovat muuttumattomat. Kokki ei ole fyysisesti punninnut eikä koepaistanut näitä versioita.

## Miksi versiovaihtoehto eikä suora muutos alkuperäiseen?

Samat kaksi valmistusohjetta voidaan saada toistettaviksi määrittämällä vakioidut grammamäärät. Kirjoittamalla uusi täsmällinen reseptiversio voidaan myöhemmin tehdä vertailukelpoinen ravintolaskenta **ilman että jo hyväksyttyä aiemman version laskentahistoriaa muutetaan jälkikäteen**. Tämän työn `status` on tarkoituksella `PROPOSAL_ONLY_NO_PUBLICATION`, ja kaikki numeeriset skenaariot ovat ehdollisia.

## Valmistusversioehdokas A – bakwan

Ehdotettu ainesosan tarkennus: nykyisen **1 kpl porkkanan** sijaan **60 g kuorittua syötävää porkkanaa**, nimenomaan *uudessa* reseptiversiossa. Muu reseptin perusta ennallaan: 100 g tuoreita maissinjyviä, 100 g vehnäjauhoa, 2 rkl kevätsipulia ja 1 rkl ilmoitettua paistoöljyä; annoksia 2. Taikinaan lisätyn veden määrä pitää määrittää toistettavana, mitattuna valmistusvaiheena ennen hyväksyntää.

**Tilanne:** 60 g on aiemman automaattisen Fineli-mallin mukainen *suunniteltu paino*, EI käyttäjän tai keittiön suorittama punnitus. Sillä vanha laskennallinen hiilihydraattimäärä olisi edelleen 45,19 g/annos, mutta tämä ei vielä varmista tuotetietoja tai öljyn toteutunutta imeytymistä. Katselmointitiedosto: `docs/reviews/2026-11-11-bakwan-jianbing-product-evidence.json`.

## Valmistusversioehdokas B – jianbing tunnetulla kastikkeella

Ehdotettu yksilöity tuote: **Lee Kum Kee Soy Bean Sauce 240 g**, EAN **078895151473** (huom. ei Kikkoman-soijakastike, eikä `tianmianjiang`-vehnätahna). Käytettäväksi *suunniteltu* tarkka määrä on 15 g kahteen lettuun. Muu ilmoitettu perusta ennallaan: 2 kananmunaa, 100 g vehnäjauhoa, 2 rkl kevätsipulia, 8 g seesamia, 1 rkl paistoöljyä ja vesi taikinanvalmistukseen.

Tuotevalmistetta myyvien kauppojen ilmoittamat ravintoarvot / 100 g ovat: hiilihydraatti **22 g**, proteiini **6,5 g**, rasva **5,2 g** ja sokerit **22 g**. Ainesosina vettä, 27 % soijapapuja, sokeria, suolaa ja vehnäjauhoa sekä tuotemerkinnän muita lisäaineita. **Allergeenit: soija ja vehnä.** Tuotteen ravintoarvot on vahvistettava käytetystä etiketistä ennen hyväksyntää; kuitua ja polyoleja ei ole varmennettu. Lähteet:
- https://www.piccantino.de/lee-kum-kee/sojabohnen-sauce
- https://hiyou.co/products/lee-kum-kee-soy-bean-sauce-240g

### Ehdollinen ravintolaskenta – jianbing

Jos kastiketta käytetään 15 g ja muut ilmoitetut ainesosat/massat sekä niiden koostumusarvot pysyvät ennallaan, aiemman geneerisen fermentoidun soijapaputahnan ravintoarvot voidaan korvata nimettyä tuotetta vastaavilla etikettiarvoilla. Lasku perustuu ainesosakohtaisiin *pyöristämättömiin* lähtötietoihin:

| Ravintoarvo annosta kohti | Vanha geneerinen laskentamalli | Nimetyn tuotteen ehdollinen malli |
|---|---:|---:|
| Hiilihydraatit, jos ilmoitustavat ovat yhteensopivat | 38,96 g | **39,14 g** |
| Proteiini | 14,79 g | **14,31 g** |
| Rasva | 15,39 g | **15,40 g** |
| Hiilihydraatit + kuitu | 41,60 g | **ei määritetty** |

**Nämä ovat laskennan versiovaihtoehdon numeroita, eivät julkisia tai hyväksyttyjä makroarvoja.** Kuitu- ja polyolitietoja ei saa korvata nollalla, eikä uuden etiketin hiilihydraattien määritelmää saa pitää automaattisesti identtisenä AFCD:n GI/GK:n laskennassa käytetyn lähteen kanssa. Tuotteen/tahnan käytön todellinen massa pitää punnita, eikä tälle kastikkeelle ole tässä vahvistettu GI-arvoa.

## Skenaario C – huevos divorciados ja papujen eri olomuodot

Tässä reseptissä on **150 g mustia papuja, kahteen annokseen**. Kokin korjattu julkinen ohje sanoo *valmiiksi kypsiä* papuja, mutta alkuperäinen rakenteinen ainesrivi ei yksilöi niiden olomuotoa.

| Käsitteellinen syötevaihtoehto | Hiilihydraatit / 100 g Fineli-pohjaisesta lähteestä | 150 g / 2 annosta – vain papujen HH /annos |
|---|---:|---:|
| Säilyke, suolaliemi, lähteen ilmoittamassa tuotetilassa | 9,65 g | **7,24 g** |
| Kuivattu mustapapu, punnittu ennen liotusta ja keittoa | 47,8 g | **35,85 g** |

**Vertailun 150 g kuivattuja papuja EI ole sama määrä valmiiksi keitettyjä papuja**: liotus ja keittäminen muuttavat vesimäärää ja loppumassaa. Tämä ei ole valmis ravintoarvotaulukko huevos-reseptille. Säilykevaihtoehdon tuotetietojen ja valutusmassan vastaavuus, yksi tomaatti, 150 g vihreää salsaa sekä munien/öljyn tarkat ravintolähteet tarvitaan ennen koko ruoan laskua.

Lähteet (Fineli-aineistoon perustuvat sekundaarijulkaisut, eivät tuotepakkauksen varmenteita):
- Säilyke: https://ravinto.ptjesse.fi/papu-musta-mustapapu-suolaliemessa-sailyke/
- Kuivattu: https://fittifrendi.fi/ainesosa/papu-musta-mustapapu-kuivattu/

## Suoritettu tekninen toteutus

- `docs/reviews/2026-11-11-c5-exact-variant-scenarios.json`: kolmelle nykyiselle FI-reseptille neljä tulevaa ainesversioehdokasta, lähde-Git-blob-SHA:t, tuoteviitteet, tunnetut ja puuttuvat ravintokomponentit, jokaiselle esteet ja hyväksynnän puuttuminen.
- `site/scripts/c-five-variant-scenarios.ts`: ehdokkaiden **toistettava** laskenta aiemmista yksilöidyistä reseptin ainekohtaisista syötteistä; tarkistaa kaikille kolmelle lähteen SHA:n, sekä jianbingin aiemman aineslaskelman SHA:n. Säilyttää bränditiedon puuttuvan kuidun ja polyolit nulleina sekä kuivien/säilykepapujen eron.
- `site/tests/c-five-variant-scenarios.test.ts`: torjuu muuttuneet lähde-SHA:t, keksityn kuitunollan, arvojen ehdottoman hyväksymisen sekä mustapaputietueiden hiljaisen vaihdon. Tarkistaa myös skenaarioiden numerot.
- Komento `cd site && npm run audit:scenario-c5`.

## Julkaisuportti

**Hyväksyttyjä uusia ravintoarvoja 0. Hyväksyttyjä uusia GK-arvoja 0. Julkaistuja uusia reseptiversioita 0.** Ennen hyväksyntää tarvitaan täsmällinen valittu versio, oikeasti käytetyn tuotepakkauksen etiketti, todelliset punnitukset tai selvästi vakiopainona määritelty uuden reseptin ainesosa, vastaava ravintoarvo- ja GI/GK-lähde sekä kaikkien aktiivisten FI/EN/SV/TH-merkitysten tarkistus. Koekeittiön suorittamista ei väitetä.

Tätä ehdotusraporttia **ei** saa käyttää alkuperäisen version GK-SHA:n päivittämisen tai karanteenin purkamisen perusteena.
