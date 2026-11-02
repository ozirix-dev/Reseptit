# GK80 Operaatio 146 — koottu katselmointiaineisto

Päiväys 2.11.2026. **PARTIAL / GO omistajan katselmointiin**, ei julkaisuvaltuutusta.

## A–C. Lähtötila ja työn laajuus

Main `c127a715186d1d10820ae210f8cbff7d982b4444`. Tuotannosta varmennettu
**147/326 (45,09 %)** ennen laskentaa; [tuotantotarkistuksen havainnot](production-start.json).
Main tarkistettu uudelleen paikallisten tarkistusten jälkeen, sama SHA.

50 reseptin kohdejoukko käsiteltiin kymmenenä viiden reseptin ryhmänä. Kaikista
luettiin nykyiset ainesosat, annosmäärä ja valmistus, verrattiin aiempia esteitä
ja ratkaistiin vaikutus neljään makroon. 15 tapausta eteni numeeriseen
lähde-/laskentaprototyyppiin. Muissa 35 tapauksessa täsmällinen lähde- tai
valmistuseste jäi voimaan. Kyse ei ole50 uudesta GI-mittauksesta eikä 30 uudesta
riippumattomasta lähderatkaisusta. Aiempi tutkimus hyödynnettiin toistamatta
samoja hakuja. [Kaikki50 päätöstä](recipe-audits.json), [lukittu kohdejoukko](queue.json).

## D–E. Numeeriset ehdotukset ja tekninen integraatio

**9 teknistä integraatiota**, kaikki LOW-luottamuksen mallinnuksia. Arvot alla
ovat sisäisiä tarkistuslukuja; käyttöliittymä säilyttää nykyisen näyttötarkkuuden.
PI 40 kasveille, PI 30 makeuttamattomille eläinmaitotuotteille ja PI 50 nimetyille
enintään 5 g/100 g saatavaa hiilihydraattia sisältäville aineksille ovat nykyisiä
projektin koodauksia, eivät näiden ruokien mitattuja GI-arvoja.

| Täsmällinen reseptiversio | GK/annos | GK:sta poisrajattu CHO g/annos | Makrot |
| --- | ---: | ---: | --- |
| Jauhelihapihvit ja kermakastike ilman jauhoja | 1,09 | 0,493 | 4/4 uudelleenlaskettu |
| Kuubalainen ropa vieja | 3,25 | 0,307 | 4/4 uudelleenlaskettu |
| Siskonmakkarakeitto juureksilla | 7,04 | 0,117 | 4/4 uudelleenlaskettu |
| Nakkikeitto kukkakaalilla | 5,13 | 0,221 | 4/4 uudelleenlaskettu |
| Nakkikastike ja kukkakaalimuusi | 2,97 | 0,309 | 4/4 uudelleenlaskettu |
| Menemen sumakilla | 1,80 | 0,635 | 4/4 uudelleenlaskettu |
| Perunaton suomalainen lihakeitto | 2,41 | 0,783 | 4/4 uudelleenlaskettu |
| Letut – VHH | 0,60 | 0,825 | 4/4 uudelleenlaskettu |
| Korvapuustit mantelitaikinasta | 0,10 | 1,776 | 4/4 uudelleenlaskettu |

Erityisesti VHH-korvapuustien pieni GK 0,10 **ei tarkoita lähes hiilihydraatitonta
tai mitattua ruokavastetta**: manteliosuudesta 0,99 g ja kanelista noin 0,786 g
saatavaa hiilihydraattia on jätetty GK:n pistemallin ulkopuolelle nykyisten
rajakohtaisten ja kumulatiivisten sääntöjen puitteissa. Täysi mantelikoostumus
sisältyy makroihin. Sumakkimenemenissä makroista poisrajatun koko ainesosan
raja on 1 g kutakin makroa ja 9 kcal/annos; GK:n hiilihydraattiraja 0,635 g on
toisesta, tuotekohtaisesta lähteestä. Molemmat tarvitsevat omistajan sisällön
ja menetelmäsovelluksen katselmoinnin muiden seitsemän kanssa.

**6 erillistä ehdollista skenaariota, ei aktivoitu:**

| Resepti | Hypoteettinen GK/annos | Todellinen jäljellä oleva este |
| --- | ---: | --- |
| VHH-juustokakku | 0,62 | Smetana Fineli 630: kokonaispolyolit puuttuvat; vanha makrolähde 628 on ranskankermaa, ei smetanaa. |
| VHH-rahkapiirakka | 0,50 | Täysrasvaisen mantelijauhon kokonaispolyolit varmentamatta. |
| VHH-lihapiirakka | 0,30 | Sama mantelijauhon lähdeportti. |
| Keto-korvapuustit | 0,17 | Sama mantelijauhon lähdeportti;200 g jauhoa ei ohiteta kokonaisen mantelin lähteellä. |
| Kana-parmesaanipannu parsakaalilla | 1,06 | Parmesanin kokonaispolyolit: NEVO:n “ei lisättyjä polyoleja” ei osoita luonnollisten puuttumista. |
| Kermainen kanasienipannu | 0,74 | Herkkusienen kokonaispolyolit puuttuvat; myös Dijon+timjami+pippuri ylittävät tämän makroskenaarion budjetin. |

[Skenaarioiden täydet syötteet ja laskut](research-prototypes.json) ovat vain
tutkimustodisteita. Niiden reseptit, nykyiset makrot ja aktiiviset GK-syötteet
säilyvät mainin tilassa. Omistajan hyväksyntä ei itsessään täytä puuttuvaa
polyolikenttää; tarvitaan lisää lähdenäyttöä tai erillinen päätös täsmällisestä
reseptiversiosta ja mahdollisesta makropidätyksestä.

## F. Ravintoarvojen säilyminen

Yhdeksän täydellistä neljän makron pakettia laskettiin uudelleen ja sidottiin
uusiin FI/EN/SV/TH-versioihin. Yhtään uutta neljän makron pidätystä ei aktivoitu.
Annosmäärät ja nykyiset valmistusvaiheet säilyvät. Alkuperäinen naudanpaisti-
vaihtoehto valittiin Ropa viejaan; flank-vaihtoehdon hyväksyntää ei väitetä.
Punnitut määrät ja tuoterajaukset näkyvät ainesosissa. Finelin pienen sipulin
30 g ja keskikokoisen 55 g osuuksia ei sekoiteta. Liemi on käyttövalmiin
laimennetun lihaliemen LOW-koostumusproxy, ei kaikkien kuutioiden tarkka arvo.

Kuudelta integroitavalta reseptiltä puuttuivat kaikki käännökset:18 uutta
käännöstä lisättiin. Muiden kolmen yhdeksän käännöstä päivitettiin. Valmistus-
vaiheiden lukumäärä, ainesosamäärät, ajat, lämpötilat ja makrot tarkistettu;
kielentarkistuksen tila on **AUTOMATED ONLY**.

## G. Yhteiset lähderatkaisut ja rajaukset

- Fineli 393:n puuttuva kuitu täydennettiin saman valkosipulitietueen viralliselta
  sivulta: 2,1 g/100 g, julkaisu 425. Alkuperäinen jäädytetty null säilyy lähdeviitteessä.
  Vain uusi `op146-fineli-393` käyttää lisähavaintoa; vanhoja tietueita ei muuteta.
- Finelin itsenäiset saatavaCHO-, kuitu- ja polyolihavainnot korvaavat näissä
  uusissa paketeissa AFCD:n parikenttien erotuksesta tehdyt perusteettomat P0:t.
  Finelin lähdeperäiset summatut/loogiset nollat kuvataan menetelmineen;
  niitä ei väitetä laboratoriossa mitatuiksi. AFCD-päättelyä ei peritä.
- French’s Dijon US 32 oz, GTIN 00041500741284: valmistajan 5 g-annos ja USA:n
  merkintäpyöristys tuottavat nimelliset rajat 0,5 g/makro ja 7,5 kcal/5 g.
  Pyöristetty etikettinolla ei ole todellinen 0. Rajat eivät ole eräkohtaisia
  biologisia takuita eikä niitä siirretä Mailleen, muihin markkinoihin tai
  hunajasinappiin. Isompi 30 g/4-annos ei läpäise energiarajaa.
- Culpeper’s Ground Sumac (marja+suola), tuotetiedote 27.8.2026: merkinnän
  hiilihydraatti 63,5 g/100 g rajaa 2 g tuotteen GK-poisrajausta. Kuitua/polyoleja
  ei täytetä nolliksi. Koko ainesosan massarajaa käytetään erikseen makroihin.
- USDA SR Legacy: samojen kokonaisten mausteiden lähdehiilihydraatti sisältää
  kuidun ja mahdolliset polyolit, joten sitä käytetään saatavan CHO:n
  lähdemallin ylärajana, ei EU_AVAILABLE-pistearvona. Oregano 1 g/tl,
  mustapippuri 2,3 g/tl ja kaneli 7,8 g/rkl eivät ole yleisiä tilavuusmuunnoksia.
  Pienten kokonaislehtien 0,2 g ja 6 pippurin 0,3 g ovat tämän version määriteltyjä
  punnittuja annoksia, eivät USDA:n ilmoittamia kappalepainoja.
- Kokonaisista manteleista jauhettu täysrasvainen jauho käyttää Fineli 379:n
  LOW-koostumusproxya johdonmukaisesti. Ei rasvan/kuidun erottelua, ei
  rasvattomia jauhoja, ei keksittyä mantelin GI:tä. Fineli Rel20:n kuitu 7,2
  säilyy tässä proxyssa; nykyisen verkkosivun 12,5:tä ei sekoiteta huomaamatta.
- NEVO 5579:n natiivi CHO 3,6 sisältää polyolit. Natiivien erilliskomponenttien
  sokerit 3,5 + tärkkelys 0,2 = 3,7 on läpinäkyvä tutkimusjohdos, ei 3,6 miinus
  oletettu P0. Lähteen pyöristysero ei ole biologinen vaihteluväli. Kokonais-P
  jää unknown/null. NEVO 718/19:n “ei lisätty” -looginen nolla hylättiin
  kokonaispolyolien näyttönä. **NEVO-tietueita ei aktivoitu tuotannon rekisteriin.**

NEVO-tutkimusaineiston vaadittu attribuutio:
“Based on data from NEVO online version 2025/9.0, RIVM, Bilthoven and other data sources”.
Natiivitaulukot ja johdokset ovat erillään, lisenssiä ei väitetä CC0:ksi.

Ensisijaiset lähteet ja ladattujen PDF:ien SHA:t:
[lähdemanifesti](sources-manifest.json), [USDA-natiivirivit](sources/usda-selected.json),
[NEVO 5579](sources/nevo5579-observation.json), [NEVO718](sources/nevo718-observation.json),
[NEVO19](sources/nevo19-observation.json).
Alkuperäiset valmistajan PDF:t renderöitiin ja tarkastettiin myös silmämääräisesti.
Repossa säilyvät muuttamattomat tekstipoiminnat, alkuperäiset URL:t ja PDF-hashit.

## H. HOLD-esteet

35 HOLD-reseptiä säilyy muuttumattomina. Yhteiset esteet ovat erityisesti
riisipuurojen/kaksivaiheisten riisien, muussatun perunan, jauhojen ja paistettujen
palkokasvien GI-valmistusvastaavuus; kookosmaidon väärän yhdistelmäruokalähteen
siirtokielto; hedelmien, marjojen, sienten ja paneerin polyolitiedot sekä
marinadien, dippien ja väkevien kastikkeiden todellinen koostumus/nautittu määrä.
Pav bhajin yksittäiset mausteet ovat jo punnittuja: sen todellinen este ei ole
enää “tuntematon masala”. Tarkat syyt ja seuraava ratkaiseva näyttö ovat
reseptikohtaisessa auditissa, eivät uuden laajan hakukierroksen työlistana.

## I. Kattavuus

Vain tämän Draftin 9 teknisen tapauksen hyväksyminen ja myöhempi oikea julkaisu
nostaisi kattavuuden **156/326 eli 47,85 %**. Tämä ei ole tuotantokattavuus.
Kuusi ehdollista skenaariota eivät kuulu lukuun.80 % tavoite on 261/326;
156:n jälkeen siihen puuttuisi 105 numeerista tulosta.

## J. Muutokset ja tarkistukset

[Integraatio ja tarkat syöte-/lähdehashit](integration.json),
[paikallisen tarkistuksen koonti](verification.json),
[riippumaton Decimal-tarkistin](verify_decimal.py).

Paikallisesti 142 kohdennettua testiä ja 26 staattisen julkaisun testiä PASS.
Decimal: 9 GK:tä,36 makroarvoa ja 6 aktivoimatonta GK-skenaariota PASS.
Tiukka ravintoarvoauditointi ei tuottanut ristiriitoja. TypeScript PASS;
Vite ja 721 reitin esirenderöinti PASS. Ensimmäinen pipeline pysähtyi uuden
testin käyttämättömään importiin ennen Viteä; korjauksen jälkeen jatkettiin
TypeScript-vaiheesta toistamatta läpäistyjä auditointeja. Yksi varsinainen
koottu Vite/esirenderöintibuild.147 vanhaa numeerista ja 317 kaikkien muiden
reseptien täydellistä tulosobjektia säilyivät.575 vanhaa elintarviketietuetta
säilyvät arvoineen ja järjestyksineen; 29 uutta vain tämän version tunnisteilla.

Historialliset testit käyttävät vain rajattuja ennen-146-snapshotteja;
uusi nykytilan regressio testaa kaikki 326 todellista tulosta erikseen.
Uusi testi on rekisteröity normaaliin `npm test` -komentoon.
Normaali PR-CI varmentaa lopullisen pusketun HEADin; manuaalisia Actions-
uusinta-ajoja ei pyydetä. CI:n tarkka tila näkyy PR:n Checks-osiossa.

## K. Seuraavan ajon prioriteetit

1. Smetanan täsmällinen kokonaispolyolilähde ja VHH-juustokakun vanhan väärän
   ranskankerma-makrosidonnan erillinen sisältöpäätös.
2. Täysrasvaisen mantelijauhon kokonaispolyolit: kolme valmista skenaariota,
   joille lähdeporttia ei korvata loogisella nollalla.
3. Parmesanin täysi kokonaispolyolinäyttö kana-parmesaanipannulle.
4. Herkkusieni sekä Dijon/timjamin täydet makrot ja salottisipulin proxy:
   kanasienipannun kaikki esteet ratkaistaan yhdessä.
5. Vadelma/mansikka ja kurpitsansiemenen kuitu; vasta sitten granolan tai
   marjaleivonnaisten uusi kokonainen laskenta.

Carnitas, teehaudutetut munat ja muut avoimet tutkimus-/Cloudflare/SOURCE01/
NutritionCore/Recipavo-PR:t sekä ReportHub jätetään erilleen.
Tämä aineisto odottaa omistajan katselmointia. Ei Ready-siirtymää, mergeä tai deployta.
