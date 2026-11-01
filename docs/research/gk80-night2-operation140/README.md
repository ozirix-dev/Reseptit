# AAMURAPORTTI – GK80 MASTER NIGHT RUN 2 / OPERAATIO 140

Yö 1.–2.11.2026. Repo `ozirix-dev/Reseptit`. Tämä on teknisen Draftin
valmisteluhetken lukittu raportti. Lopullinen PR-HEAD ja automaattisen CI:n
tulos kirjataan saman chatin loppuraporttiin; tämä tiedosto ei väitä
valmisteluhetkellä odottavaa CI:tä läpäistyksi.

## A. Yhteenveto

**PARTIAL.** Seulottiin 86 aiemmin seulomatonta reseptiä ja tarkastettiin kuusi
kokonaisuutena. Uusia täysiä GK-ehdokkaita syntyi **0**, joten minimi 3,
ensisijainen 5 ja venytys 7 jäivät saavuttamatta. Tekninen tavoite toteutui:
US-total-normalisoinnin toistettu virhe korjattiin rajatusti ja suojattiin
kolmella testillä. Lisäksi löytyivät Finelin kookosmaitoprofiilien kuituero ja
Kayan GI-kortin väärään tutkimusriviin kuuluva valmistusselite. Näitä ei
muutettu luvattomiksi reseptijulkaisuiksi. Yksi tekninen Draft, ei GK-erä-PR:ää.

## B. Lähtötila ja lopputila

Main: `583fdb91aeb12114f909412b9165fc3b02a6515d`.
Julkaistu kattavuus alussa ja ajon jälkeen **133/326 = 40,80 %**.
Uusia kokonaisia numeroehdokkaita 0; omistajakatselmointivalmiita 0;
uusia ehdollisia numeerisia skenaarioita 0; edelleen keskeneräisiä 193.
Kuusi syvätutkittua ja erillinen Kaya ovat HOLDissa.

Tarkistettu erillisten ID-joukkojen jako on 133 julkaistua + 23 vanhaa
lähde-HOLDissa olevaa numeroehdotusta + 1 vanha Kaya-skenaario + 83 muuta
vanhaa HOLDia + 86 uutta seulontatapausta = 326. Kaksi jo julkaistua
C-reseptiä poistettiin aiemmasta 109 ehdokkaan joukosta ennen seulontaa.
[Jako](partition.json), [326 tulosobjektin hashit ja julkaistut makrot](main133-baseline.json).

Tuotanto tarkistettiin ajon alussa HTTP:llä: 12/12 pyyntöä onnistui, keskussivun
325 julkista riviä vastasivat tarkistettua buildia ja numeerinen ID-joukko oli
133. Laskentapoolissa on 326 reseptiä; julkisia koontirivejä 325.
[HTTP-näyttö ja tarkistuksen UTC-aika](production-start.json).
[Main-CI](https://github.com/ozirix-dev/Reseptit/actions/runs/41351575830)
ja Pages-deploy 7479319566 oli varmennettu samaan julkaisuun.
Tässä ajossa ei julkaistu mitään.

## C. 86 reseptin seulonta

Halvan alustavan luokittelun tulos: **A 0, B 8, C 13, D 65**.
B tarkoitti korkeintaan kahta *olemassa oleviin riveihin kirjattua* estettä,
ei täydellisen reseptin todistettua yhden lähteen korjaustarvetta. Vanhojen
GK-syötteiden osittaisuus paljastui kokonaislukemisessa. Luokkia ei käytetä
valmiiden reseptien lukumääränä.

Valittiin B-joukosta punainen, vihreä ja panang-kanacurry, vada-pav, tangyuan
ja masala-dosa: pieni kirjattu estemäärä, mahdollisuus käyttää nykyisiä lähteitä
ja yhteisen koostumusongelman tutkiminen. Valintaa ei tehty matalan GK:n
perusteella. Loput B-tapaukset olivat kookos-banaanikulho ja nasi-lemak.
Kuuden nollatuloksen jälkeen ei aloitettu toista kuuden kierrosta:
siirryttiin kahteen yhteiseen lähdeperheeseen ja todettuun tekniseen virheeseen.
[Kaikki 86 ID:tä, lähdehashit, määrät ja alustavat luokat](screening86.json).

## D. Syvätutkitut reseptit

Kaikkien nykyinen GK-tila on keskeneräinen ja uusi päätös **HOLD**. Yhdellekään
ei muodostettu uutta neljän makron pakettia, piste-GK:ta, luokkaa tai
näyttötarkkuutta. Vanha sivulla oleva ravintotieto ei ole tässä uudelleen
validoitu kokonainen ehdokaspaketti.

| ID | Kokonaisen reseptin ratkaisematon este |
|---|---|
| `punainen-kanacurry-vhh` | Vanha GK-syöte kattaa vain 3/11 ainesosariviä. Tahnan GI/polyolit sekä lime- ja yrttiosuuksien syötävä massa/profiilit puuttuvat. |
| `thai-vihrea-curry-kanalla-vhh` | Vanha GK-syöte kattaa 4/11 riviä. Currytahna, 2 g kaffirlimetinlehdet, basilika ja kookosmaidon versio vaativat rajauksen. |
| `panang-curry-kanalla-vhh` | Vanha GK-syöte kattaa 3/10 riviä. Tahna, lehdet ja rouhitun maapähkinän valmistussovellus jäävät avoimiksi. |
| `vada-pav` | Kikhernepäällysteen valmistus ei vastaa cheela-tutkimusta; kokonaispolyoli puuttuu. Sämpylän tyyppi/massa, perunan painoperusta, öljyn pidättyminen ja ohjeen määrätön chutney ovat avoimia. |
| `tangyuan` | Tahmariisijauho ja jauhettu musta seesamitäyte eivät vastaa geneeristä riisi-/siemenvertailua. Inkiväärin massa ja nautitun makean liemen määrä puuttuvat. |
| `intialainen-masala-dosa` | Lähde todella ilmoittaa 150 g sinapinsiementä kahdelle. Vanha Fineli399 ei ole urad/black gram. Ohjeen 10 minuutin lepo ei osoita fermentointia; täyte ja sambar eivät ole täydellisesti määrällistettyjä. |

Kaikki ilmoitetut ainesosat ja valmistus luettiin. Yllä oleva puutteiden lista
ei ole väite muiden ainesosien hyväksytystä loppuvalidoinnista. Dosa-reseptin
vanhaa väärää sidontaa ei käytetä uudessa ehdotuksessa; vanhaa runtime-aineistoa
ei tässä muutettu. Ei osasummaa kokonais-GK:ksi, ei tuntematonta nollaksi.
[Kuusi lähdehashattua päätöstä, määrät ja lähderivien tunnisteet](deep-review-six.json).

## E. Kaya-paahtoleipä

**HOLD.** PR #158:n täsmällinen versio ja vanha syötehash säilytettiin.
Vanhoja makroja 36,59/40,28/12,18/26,21 g tai GK-skenaariota
20,29204–27,32172 ei lasketa uusiksi tai hyväksytyiksi.

GI 54 kuuluu Atkinsonin taulukon riville 226 (Australia 2003), jossa ei kuvata
korttiin kopioitua valmistusta. Kortin 50:50-jauhoseos ja fermentointi-/paistoajat
kuuluvat GI 82:n riville 227 (Uusi-Seelanti 2010). Tarkennus kirjattiin uuteen
päätösaineistoon; alkuperäisiä hashattuja kortteja ei kirjoitettu uudelleen.
Geneerinen maalaisleipä ja kevyt pannupaahto eivät ole näiden vertausten
todistettu sovellus. Vertailuhaarukka ei rajaa paahtamisen vaikutusta.
[Kaya-päätös ja alkuperäislähteen hash](kaya-decision.json),
[alkuperäisen GI-koonnin julkaisu](https://doi.org/10.1093/ajcn/nqab233),
[paahtamista koskeva erillinen alkuperäistutkimus](https://pubmed.ncbi.nlm.nih.gov/17426743/).

## F. Yhteiset lähde-esteet

Tutkittiin kaksi perhettä, vapautui **0 kokonaista reseptiä**.

1. **Kookosmaito, Fineli29014 / AFCD F002991.** Virallisessa Fineli-verkkonäkymässä
   kuitu on 0,5 g/100 g, lukitussa Release20-kortissa 5,145. Muutkin luvut
   eroavat pyöristyksen verran. Verkkonäkymä saatiin selaustyökalun kautta,
   jonka indeksointitieto oli kaksi päivää vanha; uutta raakaa API-/ZIP-versiota
   ei saatu. Ero on havainto, ei todistettu importerivirhe. Esimerkin 400 g / 4
   annosta komponenttierotus on −4,645 g kuitua ja −4,655 g sivuston
   rekonstruoitua kokonais-CHO:ta annosta kohti. Tämä ei ole koko curryn
   muutosarvio. Lähteen polyolinolla on reseptistä laskettu arvo, ei kattava
   analyysi. Mitään nykyistä profiilia ei korvattu.
   [Finelin oma elintarvikesivu](https://fineli.fi/fineli/fi/elintarvikkeet/29014).
2. **Kikhernejauho AFCD F003986.** Batra ym. 1994:n jo tallennettu
   alkuperäis-PDF luettiin uudelleen ja kaksi sivua tarkistettiin kuvina.
   Tutkimuksen kokojyväsestä palkokasvijauheesta pannulla valmistettu cheela
   ei ole vada-pavin uppopaistettu kuorrute. AFCD:n kokonaispolyolipuute
   säilyy. [Alkuperäistutkimus](https://apjcn.nhri.org.tw/server/APJCN/3/4/151.pdf).

193 keskeneräisen ID:n [estematriisi](shared-source-matrix193.json) erottaa
kirjatun käyttötiheyden ja kokonaisen reseptin todistetun vapautumisen.
Käyttömittari on yksilöllinen resepti–lähdeperhe-osuma, ei kaikkien
ainesosamainintojen määrä. Osittaiset vanhat syötteet rajoittavat matriisin
tarkkuutta. Yhdenkään perheen ratkaisemisesta ei osoitettu varmaa välitöntä
julkaisuhyötyä; tasatulosta ei purettu pelkällä toistuvuudella.
[Lähdepäätökset](shared-source-decisions.json).
Mantelijauhon, mustapippurin ja timjamin identtisiä hakuja ei toistettu.

## G. Tekninen toteutus

Korjattiin vain `site/scripts/nutrition-model.ts` ja sen olemassa oleva
rekisteröity testitiedosto. US-totalin C sisältää kuidun F ja polyolit P:
nykyisen projektimääritelmän mukaan sekä available että net ovat C−F−P,
kun P on lähteellä varmennettu. Ennen available jäi C−F:ksi ja
kokonais-CHO-rekonstruktio lisäsi P:n toiseen kertaan. Synteettinen
C=20/F=4/P=3 palautti aiemmin available16/net13/total23; nyt 13/13/20.
GI50:n yhden 100 g annoksen testissä GK muuttuu 8:sta 6,5:een.
Tuntematon, varmentamaton tai ristiriitainen US-polyoli estää pistearvon.

EU-määritelmät ja nykyiset lähdevaatimukset säilyvät. Ei lähdekatalogi-,
resepti-, GI-, rekisteri-, batch- tai C-menetelmämuutoksia. Mainin ja korjatun
normalisoijan vertailussa 1 933 nykyistä lähdekäyttöä / 751 tunnistetta antoivat
tasan samat tulokset tai virheet; US-total-käyttöjä oli 0.
[Normalisoinnin vertailunäyttö](normalization-proof.json).

133 GK-tuloksen ja kaikkien makrojen säilymistä perustellaan muuttumattomilla
lähde- ja reseptitiedostoilla sekä kaikkien käytössä olevien normalisointien
yhtäläisyydellä. Paikallista 326 reseptin laskentaa ei ajettu uudelleen.
Vertailuraportti on puhtaasta puusta, joka on Git-puultaan täsmälleen sama
kuin julkaistu main. Kaikkien 326 aiemman tulosobjektin hashit säilytettiin.
Erityisesti kolme julkaistua C-tapausta, keto-makropidätykset, teehaudutetut
munat ja batchit 87/88 ovat koskematta. Seuraava tarkistettu vapaa mainin
batch oli 89; sitä ei varattu.

Mahdollinen [kahden evidenssipäätöksen malli](method-option.md) on vain
arvioitava vaihtoehto: 0 osoitettua välitöntä vapautusta, ei toteutusta eikä
omistajan menetelmäpäätöstä.

## H. GitHub

Yksi main133-pohjainen tekninen Draft haarasta
`codex/gk80-night2-operation140`. Lähtö-main yllä; muuttuneita resepti-ID:itä 0.
Valmisteluvaiheen CI odottaa normaalia automaattista PR-ajoa. Lopullinen
HEAD, PR-URL ja CI-tulos ovat chatin loppuraportissa ja PR:n Checks-näkymässä.
Readyä, mergeä tai deployta ei ole valtuutettu eikä suoritettu.
[Vanhojen PR:ien tilannekuva](github-preflight.json).

PR #166:n suojausten vertailussa nykyisen mainin C-palautustesteissä on jo
positiivisen tapauksen, hash-muutoksen ja ristiriitaisen numeron suojat.
Uutta kopiota tai vanhaa 131-odotusta ei tuotu. PR #153/#156/#166 ja
tutkimus-PR:t jäivät erilleen. Suositus myöhemmäksi: käsittele #156 historiallisena
hyväksyntälähteenä ja arvioi #166:n korvautuminen erikseen; älä yhdistä vanhaa
pinoa siivouksen vuoksi. ReportHubiin ei koskettu eikä PR:iä suljettu.

## I. Testit ja resurssit

- Yksi paikallinen kohdennettu ajo: nutrition-model + nutrition-evidence,
  **26/26 PASS**, joista 3 uutta regressiotestiä.
- Yksi normalisoinnin vertailu: **1 933/1 933 samaa**, 751 tunnistetta.
- Tutkimuspaketin oma staattinen verifier; ei lähdehakua tai reseptilaskentaa.
- Uusia resepti-Decimal-tarkistuksia 0, koska täydellisiä ehdokkaita ei ole.
- Paikallisia kokonaistestejä 0, sivustobuildeja 0, uusia 326-laskentoja 0,
  selainkierroksia 0, manuaalisia Actions-ajoja 0, Codex Review -pyyntöjä 0.
- Suunniteltu yksi normaali automaattinen CI lopulliselle Draft-HEADille.
  Nykyinen workflow ajaa tälle koodiluokalle buildin ja nutrition-testit
  kahdessa vaiheessa osin kahteen kertaan. Sitä ei muutettu tässä korjauksessa
  eikä päällekkäistä manuaalista ajoa tilattu. Toteutuneet luvut loppuraportissa.

[Resurssit](scope-and-resources.json). Testilähteet ovat jo normaalissa
testirekisterissä. Ei uutta irrallista testitiedostoa. Koneellisen seulonnan
ja raportin valmisteluskriptejä korjattiin ennen paketin lukitsemista;
tuotantokoodin kohdennettu testiajo ei tarvinnut uusintaa.

## J. GK140-tavoite

Uusia kokonaisia numeroehdokkaita **0/7**, puuttuu **7**. Ei ehdokaskattavuutta
140 eikä toteutunutta julkaisua. Seuraaviksi arvioitavat punainen, vihreä ja
panang-curry ovat yhteisen lähdeselvityksen mahdollinen pieni kohdejoukko,
eivät todennettuja seuraavia julkaisuja. Tarvitaan kookosmaidon täsmällinen
versioratkaisu, tahnojen koostumus/polyolit ja perusteltu GI-sovellus sekä
yrttien ja tarjottujen lisukkeiden massat. Yksi omistajan yleinen hyväksyntä
ei korvaa puuttuvaa lähdetietoa. Kaya vaatii leipä-/paahtosovelluksen.

Seuraava työpaketti olisi ensin **yhden kokonaisen curryn** lähdetodistus,
vasta sen onnistuessa 3–5 suljettua tapausta. Seitsemän voisi sen jälkeen
jakautua 3+4 tai 5+2 eriin. Tämä on ehdotus, ei käynnistetty uusi tutkimusajo.

## K. Pitkän aikavälin 80 % -polku

| Välitavoite | Uusia tarvitaan nykyisestä | Nyt todistetusti hyväksyntävalmiita | Realistinen tilanne |
|---|---:|---:|---|
| 140/326 | 7 | 0 | Seitsemän suljettua lähdeketjua vielä osoittamatta. |
| 150/326 | 17 | 0 | Ei osoitettua yhden päätöksen 17 reseptin joukkoa. |
| 160/326 | 27 | 0 | Tarvitsee uusia jaettuja koostumus- ja GI-ratkaisuja. |
| 180/326 | 47 | 0 | Nykyisten teknisten numeroehdotusten hyödyntäminen ei yksin riitä. |
| 200/326 | 67 | 0 | Laaja lähdekehitys; ei luvattavaa aikataulua tällä näytöllä. |
| 240/326 | 107 | 0 | Vanha 107 tapauksen pooli on tutkimusjoukko, ei valmis varanto. |
| 261/326 | 128 | 0 | Lisäksi vähintään 21 uuden seulontajoukon tapausta, jos kaikki 107 vanhaa joskus ratkeaisivat. |

Yhden täsmällisen päätöksen varassa olevia *todistettuja kokonaisia tapauksia*
on nyt 0. Kuinka moni 193:sta ratkeaa uudella yhteisellä lähteellä tai jää
vaikeaksi, ei ole luotettavasti kvantifioitavissa osittaisista vanhoista syötteistä.
Alustavat B8/C13/D65 koskevat vain 86 tapauksen seulontaa; ne eivät ole koko
poolin valmiusennuste. Kaikkien 193:n laskeminen lähderatkaisulla avautuviksi
olisi perusteetonta.

80 % on edelleen matemaattisesti määritelty tavoite, mutta nykyinen näyttö ei
osoita toteutuspolkua tai aikataulua 128 lisäykseen. Suurin todettu tekninen
hyöty nyt on US-total-virheen esto tuleville syötteille; se ei lisää yhtään
nykyistä reseptiä. Tulevan lähdekorjauksen hyöty on mitattava yhden kokonaisen
reseptin läpimenolla ennen eräkoon kasvattamista. Säilytä hashatut lähteet,
päätökset ja suljetut haut, älä toista identtisiä mauste-/mantelihakuja,
22 reseptin kierrosta tai valmiin lähtötilan kokonaisbuildia ilman uutta tarvetta.

## L. Seuraava omistajapäätös

**Hyväksytäänkö tämän teknisen US-total-Draftin siirtäminen Ready for review
-tilaan, ilman reseptijulkaisua, mergeä tai deployta?**

Tässä vaiheessa päätös on yksi rajattu tekninen katselmointi. Uuden yleisen
menetelmän hyväksyntää tai heikosti lähteistetyn reseptierän julkaisua ei pyydetä.
