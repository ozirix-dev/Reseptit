# F25 – kaksi lähdettä / kuusi kieliparia, katselmointi 11.11.2026

## Eristetty julkaisu

Pohjana `main` `62d2b620d4a1240b4b136c89075b230e32f0d4c2`, ei vanhan [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399)-PR:n yhdistäminen. Kaksi FI-reseptiä: `kiinalainen-soijamaito-aamiaisella` ja `thai-roti-munalla-banaanilla`, kummastakin EN/SV/TH. Rekisteri **67 FI / 201 kieliparia → 69 FI / 207 kieliparia**. F25 **8 FI / 24 kieliparia → 10 FI / 30 kieliparia**. Jäljellä 15 FI / 45 kieliparia HOLD.

## Xian dou jiang – pieni suolainen soijamaitokulho

2 pientä annosta: **200 ml makeuttamatonta soijajuomaa, 15 ml makeuttamatonta Lee Kum Kee Rice Vinegar -riisiviinietikkaa, 5 g seesamiöljyä, 2 rkl hienonnettua kevätsipulia**, valinnainen suola. [Valmistajan riisiviinietikassa](https://uk.lkk.com/products/rice-vinegar) on vesi, riisi 12,5 %, suola, ja hiilihydraatteja **alle 0,5 g/100 ml**. Käytetty 15 ml / 2 annosta = alle 0,0375 g netto-HH per annos valmistajan ilmoitusrajan perusteella, olettaen merkintä 100 ml. Nykyinen [laskentasyöte](../../docs/nutrition/calculations/kiinalainen-soijamaito-aamiaisella.json) jättää etikan tämän mausteylärajan sisällä pois; kyse ei ole 0,01 g:n laboratoriotarkkuudesta. **Sokeroitua sushi-etikkaa ei saa korvata tilalle laskematta uudelleen**. Muun soijajuoman koostumus vastaa Fineli 31247 -viitettä; merkki voi vaikuttaa hyytymiseen. [SCMP:n xian dou jiang](https://www.scmp.com/cooking/recipe/breakfast-savoury-soymilk-recipe/article/3084414) käyttää happamuutta ja kuumaa makeuttamatonta soijamaitoa. Kiinteä hyytyminen ei ole luvattu. Sisältää **soijaa ja seesamia**; kaikki kielet varoittavat.

FI:n neljä koostumusarviota / annos säilyvät: **1,31 g netto-HH, 3,03 g HH kuidun kanssa, 3,69 g P ja 4,28 g rasva**. Ei muuteta GI/GK-sinettiä, laskentasyötettä eikä FI-raakatekstiä.

## Thaityyliset kookos-banaanimunaletut – ei perinteinen roti

Alkuperäinen FI-raakaotsikko *Roti munalla ja banaanilla* ei kuvaa 100 g vehnäjauhon, 200 ml kookosmaidon ja 2 kananmunan **juoksevaa lettutaikinaa**. Julkisen FI:n otsikko, H1, alt ja kuvaus korjataan *Thaityyliset kookos-banaanimunaletut*, ja EN/SV/TH noudattavat samaa ruokalaji-identiteettiä. Tämä ei ole venytetty thaimaalainen roti. 2 annosta: yksi keskikokoinen banaani **125 g syötävää**, 2 kananmunaa **110 g kuorettomana**, 200 ml kookosmaitoa = **184 g** AFCD-tilavuusmassalla ja 1 rkl öljyä = **13,5 g** Fineli 541 -viitteellä; öljyn oletetaan jäävän kokonaan syödyksi. Ei sokeroitua kondensoitua maitoa tai siirappia.

Lähde [laskentasyöte](../../docs/nutrition/calculations/thai-roti-munalla-banaanilla.json) on `AUTOMATED ONLY`. Neljä makroa / annos säilyvät **50,17 g netto-HH, 52,98 g HH kuidun kanssa, 14,77 g proteiini, 27,02 g rasva**. Kyse on tietokantapohjaisista arvioista, ei tuotekohtaisista mittauksista. Kanoninen FI/GI/GK muuttumaton.

## Julkaisuportit

FI:n julkisen näyttöprojektorin kahden tekstimuutoksen alkuperäinen Git-blob-SHA tarkistetaan ennen sovitusta. EN/SV/TH:n hakutunnisteet `main_ingredient` vastaavat FI:tä, 4 makroa sekä annokset ja ainesmäärät täsmäävät. Kuusi uutta merkitys-SHA-paria sidottu julkiseen FI:n näyttöön. `source_hash`:
- Doujiang: `88b0ce36c42ce4ba56c0b96df515568ade8eb1e74e7aec8654a1d4995090d4f5`
- Kookosletut: `320b8122a884d27c9ad35b84d93010c7fd6e11b54541e7765efe16f5e93ceec9`.

Täsmä-HEAD CI SUCCESS → merge → main Pages build/deploy SUCCESS. Riskiperusteisesti ohitetut vaiheet raportoidaan SKIPPED. Ei väitetä natiivipuhujan tai fyysisen koepaiston arviota.

## Ei mukana

Muut 15 lähdettä / 45 kieliparia pysyvät HOLDissa, erityisesti za’atarin ja hojichan syötävien mausteiden ravintolaskenta, tapiokan kypsytysaika, bánh xèon kurkuman ja rakenteen vastaavuus, bánh cuốnin 25 minuutin aika ja öljyttömien riisilevyjen irrotus. Kaksi karanteenissa olevaa F25-lähdettä ei voi ohittaa [PR #432:n](https://github.com/ozirix-dev/Reseptit/pull/432) kielijulkaisuporttia.
