# GK100 / Recipavo — tutkimus ja toteutuspäätösten pohja, 4.11.2026

**Tila: TUTKIMUS + TOTEUTUSSUUNNITELMA, ei menetelmä- tai julkaisuhyväksyntä.** Tämä hakemisto on tarkoituksella uusi ja itsenäinen. Se ei muuta laskentasyötteitä, hyväksyttyjä GK-versioita, tuotteita, kaannoksia, Approval Factorya eikä tuotantoon vietäviä sivuja.

## Tutkimuskokonaisuus

1. [Tutkimusraportti kokonaisuudessaan](tutkimusraportti.md) — 16-sivuisen tutkimuksen Markdown-siirto; 30 tieteellistä/virallista viitettä ja 12 projektiviitettä. Numerot ja lähdekoodin havainnot ovat tutkimushetken tietoja.
2. [Menetelmä- ja hiilihydraattisopimus](menetelma-ja-hiilihydraattisopimus.md) — laskennan yksiköt, GI-näytön hierarkia, polyolit, poisjättöjen vaikutus, epävarmuus ja kenttien semantiikka.
3. [Todellisten reseptien korjaussuunnitelma](reseptikohtaiset-ratkaisut.md) — masala dosa, uunimuna-avokadot, okayu, lontong sayur, ojja, besan-chillat, ketomutakakku ja muut avoimet ongelmat.
4. [Recipavon automaattisen laskennan määrittely](recipavo-automaattinen-gk.md) — käyttäjäreseptien syötteet, lähdehaku, valintakysymykset, tietomalli, tulostilat ja hyväksymisrajat.
5. [Toteutusjärjestys ja PR-törmäystarkistus](pr-riippuvuudet-ja-toteutusjarjestys.md) — olemassa olevat PR:t, niiden tiedostorajaukset, toteutusportit, suositeltu yhdistämisjärjestys ja tehtävien rajat.
6. [Kohdennettu varmennus](kohdennetut-hyvaksyntatestit.md) — laskentasopimuksen riskeihin suhteutetut testit, regressioehdot ja seurattavat kattavuusmittarit.

## Tutkimuksen johtopäätökset

- Puuttuva mitattu GI ei tarkoita, ettei koko reseptiä voi arvioida. Arvioitavan osuuden merkitys, valmistustapa, lähivastineiden soveltuvuus ja mahdollinen avoin osa selvitetään erikseen.
- Ruoan koostumuksen hyväksyminen, GI-havainnon hyväksyminen, sen soveltaminen reseptiin ja reseptin julkaiseminen ovat **neljä eri päätöstä**.
- Komponentin (esim. fermentoitu dosa-taikina) mitattu GI voi olla tarkoituksenmukaisempi kuin irrallisten raaka-aineiden GI. Sama hiilihydraatti ei saa sisältyä kahteen laskentatermiin.
- Normalisoitu hiilihydraattikenttä ei saa tarkoittaa eri asiaa polyolien osalta eri lähteillä. Nykyinen koodiero on rajapinnan semanttinen puute; se **ei yksin osoita tuotantolaskelmaa vääräksi**.
- Piste, perusteltu skenaarioväli, pelkkä laskettu osuus ja tarkennusta vaativa laskelma ovat eri tuloksia. GI 0/100/150 -stressi ei ole biologinen luottamusväli.
- Käyttäjän hyväksymät tuotevalinnat ja grammapainot voidaan ehdottaa myös reseptitekstiin. Muutos julkaistuun reseptiin edellyttää tavallista sisältökatselmointia.
- Sama valmistustavan perusteella hyväksytty GI-soveltuvuus kannattaa käyttää myöhemmässä reseptissä ilman saman lähdetutkimuksen tekemistä uudelleen. Määrän muuttuminen silti tekee uuden reseptituloksen.
- Käyttäjien henkilökohtaisen reseptin automaattinen uudelleenlaskenta ja toimitetun julkisen Reseptit-version hyväksyntä pysyvät erillisinä.

## Aikaleimat ja nykytilan lähde

- Tutkimuksen tarkistusversio: main `b96ba0b0dfe8f859736f9db63be982021ca7a63d`; Mixed Evidence -ehdotus #253 HEAD `936ef6d8ed9af185b233db4b77afcab9e8fab705`. **Tutkimuksen 230/326 on historiallinen lähtötaso.**
- Uudempi repon tilannetarkistus 4.11.2026 noin 20.16 Suomen aikaa: main `67261d139b1e3dcc55772f25ffcdd8e6a22c116d`; PR #259 yhdistetty (paikallinen GI SQLite -hakuindeksi). Viimeksi julkaistujen GK-versioiden dokumentaation mukaan numeerinen kattavuus **235/326 (72,09 %)** PR #257:n jälkeen. 80 % -tavoite on vähintään 261/326; jäljellä **26**. Tämä ei ole uusi 326 reseptin laskenta-ajo.
- Tarkistushetkellä haku palautti **83 avointa PR:ää**. Nykypäivän yksityiskohtainen riippuvuuskartta on erillisessä tiedostossa; älä tulkitse tätä määrää pysyväksi mittariksi.
- Kanoninen lähdetotuus GI-havainnoille on Gitissä oleva JSON. PR #259:n SQLite on paikallinen uudelleen rakennettava *hakuvälimuisti*, ei korvike kuratoidulle lähde- ja soveltuvuuspäätökselle.

## Käyttö Codexille

Lue ensin tämä README ja [PR-järjestys](pr-riippuvuudet-ja-toteutusjarjestys.md). Tee uusi kooditehtävä vasta, kun sen omistava avoin PR ja riippuvuudet on tarkistettu. Älä oleta, että tällä tutkimuksella hyväksytään GI-koodeja, 0,50 GK/10 % -rajan muutos, uuden tuoteversion ravintoarvot tai tuotantodeploy. Käytä rajattua uutta haaraa/worktreetä, vain kohdennettuja testejä ja yhtä yhtenäistä pushia. Älä muuta toisten keskeneräisiä PR-haaroja.
