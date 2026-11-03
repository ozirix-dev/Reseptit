# GK80: kansainväliset GI-lähteet, Codex1

> **Ajantasainen GitHub-tilannekuva 3.11.2026 (main `e771b53`):** 197/326 numeerista resepti-ID:tä, tavoitevaje 64. [Päätöstaulukko ja julkaisujono](DECISIONS-20261103.md) erottaa julkaistut, erillisten PR:ien hyväksytyt integraatioehdokkaat sekä vielä hyväksymättömät tutkimusskenaariot. Luvut ovat aikaleimattuja, eivät automaattisesti päivittyviä.

> **Historiallinen tutkimusluovutus 2.11.2026 klo 21.33 UTC:** [blueberry-and-defined-brine/CURRENT.md](blueberry-and-defined-brine/CURRENT.md). Kaksi uutta täsmäversiota: mustikkapiirakka GK1,30177875 ja Lindströminpihvien itse määritelty liemiversio GK6,895695. Mustikkapiirakan munat1+2 käsitellään oikein165g:na. Korealaisen Sempio-tahnan nimetty alluloosi-/kuitulähde löytyi, mutta siitä ei kirjata uutta kokonaista avausta. Omia ehdollisia versioita20 eri ID:lle:15 A-tutkimusversiota ja5 B-lähdeskenaariota. Uusia hyväksyntöjä tai julkaisuja0. Julkaistuna179/326, tavoitteesta261 puuttuu82.

Aiempi18 ehdokkaan luovutus: [steamed-buns-source-control/CURRENT.md](steamed-buns-source-control/CURRENT.md).
Edellinen17 ehdokkaan yhteiskoonti: [sausage-named-version/CURRENT.md](sausage-named-version/CURRENT.md).
Aiempi valmistettujen pannuleipien lähdeskenaariopaketti: [paratha-component-routes/CURRENT.md](paratha-component-routes/CURRENT.md).
Aiemmat jatkopaketit (historialliset tilannekuvat): [kolme valittua reittiä, mantelipiirakat ja samosa](almond-reuse-and-oman/CURRENT.md), [pav bhajin mausteet sekä miso- ja tärkkelysrajat](spices-and-native-miso/CURRENT.md), [poha ja julkaistu179](poha-and-main179/CURRENT.md), [pannulettulähde ja kanan grammaspesifikaatio](pancake-source-and-fixed-input/CURRENT.md), [falafel ja kastikkeet](sauces-and-legumes/CURRENT.md), [liemi ja nykyreseptisidonnat](stock-and-current-bindings/CURRENT.md), [granola ja pellavapuuro](followup/CURRENT.md), [pistaasijogurtti ja Codex2:n marjalähdetuki](breakfast-versions/CURRENT.md).

## Ensimmäisen tutkimusajon historiallinen koonti

2.11.2026. Paikallinen tutkimusluovutus Codex2:n käyttöön.
Lähtö-main `061f8170a7bc31244ce787c13e80d3d757f0c859`.

**0 uutta heti lähdekelpoista kokonaista GK-arvoa; 1 ehdollinen laskentaprototyyppi.**
Julkaistu kattavuus säilyy **156/326 (47,9 %)**, matkaa 261:een 105.
Tämä tutkimusajo ei saavuttanut suurta avausmäärää.

## Tilanne ja rajaus

ReportHubin etä-mainin koonti106/326 ja AJO 8-handoffin119/130 ovat historiaa.
Niitä ei käytetty nykytilana. Mainin Markdown-aineistosta tehty tuore
content:sync ja GK-ajo antoivat 326/156/170. Ajo tehtiin erillisessä
`D:/Temp/gk80-international-20261102/main-snapshot`-hakemistossa.
Ei tuotantobuildia, CI-ajoa tai toisen työpuun generoimista.

Avoimia PR:iä ja tarkat HEADit säilytetään
[lähtötilassa](scope-and-baseline.json). #183 on erillinen Ready-ehdokas 172/326;
kuusi muuta hyväksyttyä versiota ovat erillään. Näiden mahdollinen178/326
ei ole julkaistu kattavuus. Tutkimus ei muuttanut kumpaakaan haaraa.

Vanha estekartta käytettiin uudelleen. Sen neljän suurimman perheen
reseptijoukosta 62 on vielä keskeneräisiä. Tomaattiryhmän vanhasta 23:sta
vain 5 on keskeneräisiä; uutta yleistä tomaattitutkimusta ei aloitettu.
Luvut ovat vanhojen perhejäsenyyksien suodatuksia, eivät uusi täysi inventaario.

Vehnä-, manna- ja mantelijauhojen esteisiin osuu 38 nykyistä HOLD-reseptiä.
Viisi aiemman yhteisehdotuspinon tapausta jätettiin yksityiskohtaisesta
uudelleentutkimuksesta pois. [33 reseptin seulonta](recipe-screen.csv)
on sidottu lähde-, syöte- ja evidenssihasheihin.
Codex2:n 77-reseptiseen prioriteettijonoon ei ole päällekkäisyyttä.
Sen käynnissä oleva nuudeliperhe jätettiin kokonaan sen vastuulle.

## Lähdetulos tärkeysjärjestyksessä

| Löydös | Reseptihyöty ja portti | Heti uusia kokonaisia GK-arvoja |
| --- | --- | ---: |
| [Dona 2013](https://doi.org/10.1017/S0007114512004096), ihmis-GI 61 | Tarkempi pannulettuvastine; alkuperäisen täysjyvämaininta ja hakemiston plain flour eroavat. Selvitys ennen käyttöä. |0|
| [Thakurdesai 2024](https://doi.org/10.12944/CRNFSJ.12.1.05), perunaparatha 78,8 | Kaksi parathareseptiä menetelmätutkimukseen. Valmis ruoka ei anna jauhon erillistä GI:tä. |0|
| [Shobana 2022](https://doi.org/10.4103/ijmr.IJMR_1935_19), vehnädosa 61,8 | Täysjyvä- ja valmistusraja; ei yleistä jauhosidontaa. |0|
| [Chan 2001](https://doi.org/10.1038/sj.ejcn.1601265), kondensoitu maito 61 | Valmis lähdekortti Codex2:n kahvijogurttitapaukseen; ei oma avaus. |0|

[Lähdekortit](source-findings.json) sisältävät alkuperäisviitteet,
valmistuksen, asteikon, osallistujat, epävarmuuden lajin ja käyttörajat.
SEM:iä ei muutettu reseptiväliksi. Dona-tutkimuksen ihmisosa erotettiin
laboratorio-osasta; pelkkä otsikon in vitro -sana ei ratkaise menetelmää.

## Ehdollinen siemengranola

Kaikki 8 ainesriviä sisältävä, erillinen prototyyppi antaa **GK 2,474125/annos**
eli noin 2,47. Täsmällinen lasku ja nykyinen malli ovat samaa mieltä.
Lähteistetty saatava CHO on 8,08875 g/annos.

Nykyiset poisjätöt 2,06375 g ylittävät 2 g-rajan. Kanelin 0,17875 g CHO:n
erillinen GI 50-imputointi jättää pois 1,885 g ja lisää GK:hon 0,089375.
Rajoja ei väljennetty. Kyse on projektin mausteimputoinnin uudesta
nimetystä sovelluksesta, ei mitatusta kanelin GI:stä.

Ehdokas **ei ole heti lähdekelpoinen eikä hyväksytty julkaisuun**:
nykyisen 1 tl:n 2,6 g-muunnokselle puuttuu lähde. Tarvitaan joko muunnoksen
varmennus tai täsmällinen punnittu 2,6 g-versio sekä sen lähde-/sisältöhyväksyntä.
Valmistuksen koostumusproxyt ja nykyiset jogurtin/marjan kategoriat säilyvät
LOW-tason oletuksina. AFCD:n yksittäisiä puuttuvia polyoleja ei nollattu:
GK:ssa käytettiin natiivia sugar-alcohols-excluded-kenttää.

[Syötepaketti](granola-conditional-input.json),
[mallitulos](mechanical-result.json),
[Decimal-varmennus](verify_decimal.py).
Mahdollinen hyväksyntä ja myöhempi julkaisu nostaisivat luvun 157:ään,
mutta tämän ajon hyväksytty lisäys on 0.

## Hylätyt ja ratkaisemattomat

- Kookosmaidon31/68/96,82 ja leipomokategorian 58 hylkäykset käytettiin
  aiemmista tutkimuksista; niitä ei tutkittu samana työnä uudestaan.
- Mantelijauhon GI 15/5-verkkoväitteelle ei löytynyt käyttökelpoista
  valmistuskohtaista ihmisnäyttöä. Kokonaisen mantelin ateriatutkimus ei riitä.
- Harcha-, baghrir-, johnny cake- ja manakish-verkkoluvuille ei vahvistettu
  sopivaa alkuperäismittausta. Maissinen johnnycake ei vastaa vehnäreseptiä.
- Khaliqin paratha-/samosa-osumat jäivät aiemman kokoteksti- ja
  valmistus-HOLDin piiriin; hakutulosta ei ylennetty lähdehyväksynnäksi.
- `aloo-paratha`: 9 lähdeainesriviä vastaan 2 vanhaa GK-riviä.
  `intialainen-aloo-paratha`: nykyinen peruna 150 g vastaan vanha 60 g.
  Pelkkä uuden GI-luvun lisääminen ei riitä koko reseptiin.

## Viisi tehokkainta jatkotoimea

1. Varmenna granolan kanelimassa ja käsittele yksi täydellinen nimetty
   sovellus nykyisillä mausterajoilla. Lyhin uusi polku, ehdollisesti 1.
2. Käytä maidon 61-lähdekortti Codex2:n olemassa olevaan
   kahvijogurttitapaukseen. Koostumus/massa ratkaistaan samassa paketissa.
3. Ratkaise Dona-lähteen jauhoidentiteetin ristiriita ja puuttuva
   ihmiskokeen pannuprotokolla. Ei yleistä 61-sidontaa 38 reseptille.
4. Tee kahden parathan täydet nykyreseptisyötteet ennen
   [erillisen komponenttimenetelmän ehdotuksen](method-proposal.md) arviointia.
5. Käytä jo valmisteltu 16+6-pipeline nimettyjen vastuullisten kautta.
   Sen mahdollinen 178/326 jättäisi 83; se ei ole tämän ajon uusi tulos.

## Varmennus ja toisto

`evaluate.mts <baseline-repo> <paketin-hakemisto>` on vain lukevan mallikokeen
ajuri. Se tarkistaa lähtötiedostojen hashit ennen laskua; se ei integroi tulosta.
Tulosteen voi tallentaa omaan scratch-hakemistoon.
`python verify_decimal.py` varmistaa paketin aritmetiikan ja 33 uniikkia ID:tä.
PDF-taulukoiden olennaiset kohdat tarkistettiin myös renderöityinä.
Ei resepti-, rekisteri-, sääntö- tai julkaisutiedostojen muutoksia.
