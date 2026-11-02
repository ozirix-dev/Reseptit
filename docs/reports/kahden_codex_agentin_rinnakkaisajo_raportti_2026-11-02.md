# Kahden rinnakkaisen Codex-agentin kokeilu Reseptit-projektissa

**Tapaustutkimus ja arvio — 2.11.2026**\
**Kohde:** `ozirix-dev/Reseptit`, GK80-ohjelma\
**Tarkastelun rajaus:** kahden samanaikaisen Codex-ajon yhteistyö, työnkulku, saavutukset, haitat, riskit, kehittämismahdollisuudet ja jatkosuositus.\
**Lähdetilanne:** GitHubin tarkistetut PR- ja commit-tiedot sekä ajonaikaiset, käyttäjän välittämät Codex-viestit. Tilanne kuvaa tarkistushetkeä, ei myöhempää julkaisua.

**Täydennys 2.11.2026:** Luvut 1–13 säilyttävät alkuperäisen tarkistushetken. Luku 14 kuvaa myöhemmän julkaisuhaaran törmäyksen, erottelukorjauksen ja yhden kirjoittajan periaatteen.

## 1. Johdon yhteenveto

Käytännön ongelmasta kehittyi spontaanisti kahden tekoälyagentin rinnakkaistyön kokeilu. Reseptit-sivuston glykeemisen kuorman (GK) numeerinen kattavuus oli 156/326 eli 47,85 %, kun tavoite oli vähintään 261/326 eli 80,06 %. Aikaisemmat erittäin tarkat lähde- ja polyoliauditoinnit olivat tuottaneet hyödyllistä laadunvarmistusta mutta hitaasti uusia julkaistavia GK-lukuja. Käyttäjä muutti toimeksiannon luonteen: agenttien piti vertailla täysin uusia lähestymistapoja, valita paras ja toteuttaa sitä, sen sijaan että ne vain soveltaisivat vanhaa sääntöjärjestelmää.

Kaksi Codex-ajoa alkoi hyödyntää toistensa työaineistoa. Pääajo (Operaatio 149 V2, Draft PR #183) vastasi GK-only-versioiden mallista, laskennasta, integraatiosta ja sivuston esityksestä. Rinnakkaisajo (AFCD-POLYOL-03) tutki vaihtoehtoisia lähteitä ja menetelmiä sekä teki tietoisesti **luovutusaineistoa samaan julkaisuputkeen**, ei kilpailevaa PR:ää. Kahden aineiston ristiinvertailussa 30 + 22 ehdokasmerkinnästä 19 koski samoja reseptitunnuksia; jäljelle jäi **33 uniikkia numeerista laskentaehdotusta**. Niistä 16 oli menetelmä- ja sisältöhyväksyttyjä täsmällisiä GK-versioita ja teknisesti integroitu Draft-PR:ään. Muut 17 odottivat uutta lähdesovellus-, menetelmä- tai sisältökatselmointia.

**Päätelmä:** yhteistyömalli toimi teknisesti ja tuotti uusia ongelmanratkaisupolkuja. Se ei vielä osoita 80 prosentin tuotantokattavuuden saavuttamista eikä todista mitattavaa kustannus- tai aikasäästöä verrattuna yhteen agenttiin. Tulos on lupaava tapaustutkimus, ei kontrolloitu suorituskykykoe.

## 2. Tausta: miksi kaksi ajoa syntyi?

GK80-projektin 326 reseptin arviointi oli keskittynyt ainesosien lähdekoostumukseen, GI-lähteen täsmälliseen valmistusvastaavuuteen, hyväksyntähashien sitomiseen, makrojen täydelliseen evidenssiin ja varovaisiin poisjättöbudjetteihin. Tämä suojasi virheiltä mutta aiheutti useita hidastavia ilmiöitä:

- Polyolien puuttuminen saattoi estää koko neljän makron julkaisun myös silloin, kun proteiini ja rasva olivat laskettavissa.
- Reseptin GK saattoi jäädä HOLD-tilaan pienenkin ainesosan valmistus- tai GI-vastaavuuden puuttumisen vuoksi.
- Yhteen lähdeongelmaan saatettiin käyttää suhteettoman paljon tutkimusta sen sijaan, että samat esteet ratkaistaisiin yhteisellä lähderatkaisulla.
- Pitkät katselmointiaineistot ja toistuvat JSON-rakenteet veivät tilaa eivätkä välttämättä lisänneet päätöksentekohyötyä.

Operaation 147 auditointi osoitti, että nykyisillä lähteillä voitaisiin vapauttaa yhdeksän itsenäistä ravintoarvokenttää neljälle reseptille, mutta ei uusia kokonaisia makropaketteja tai GK-tuloksia. AFCD-POLYOL-01 paljasti laajemman lähdetulkintaongelman, ja PR #182 korjasi kolme AFCD:n saatavan hiilihydraatin kenttäsidosta, mutta ei vielä nostanut GK-kattavuutta.

Käyttäjän reaktio oli työmenetelmän kannalta ratkaiseva: **10 uutta GK-lukua useiden tuntien ajolla ei riitä; tavoite on 80 % kattavuus, ja uusia toimintatapoja pitää tutkia ja toteuttaa.** Tämän myötä agenttien tehtävä ei ollut enää pelkkä suoritus vaan myös menetelmän optimointi. Toinen ajo käynnistyi rinnalla, ensin osittain sattumalta, ja toimijat havaitsivat toistensa olemassaolon työympäristöstä.

## 3. Toimintamalli ja vastuunjako

| Rooli | Vastuu | Todennettavissa oleva käyttäytyminen |
| --- | --- | --- |
| **Ihminen / omistaja** | Tavoitteen 261/326 määrittely, työskentelyperiaatteen muutos, menetelmä- ja julkaisuluvat | Siirsi tavoitteen yksittäisistä luvuista kokonaiskattavuuteen; hyväksyi ensimmäiset 16 versiota jatkointegraatioon, ei julkaisua |
| **Codex 1: pääajo** | GK149 V2 -malli, 170 puuttuvan reseptin seulonta, versionhallinta, pilottimoottori, UI ja hyväksyttyjen versioiden integrointi | Draft PR #183; 16 integroitua hyväksyttyä versiota, 14 muuta laskentaehdotusta omassa koonnissaan; lähdevastaavuus-HOLDit |
| **Codex 2: rinnakkaisajo** | Vaihtoehtoisten GI- ja koostumusreittien tutkimus, MEXT-lähdeadapteri, yhteisten päätösten yhdistäminen, uusien ehdokkaiden luovutus | Tutkimuscommit `c4cd0d8`; yhteinen 33 ID:n indeksi; ei kilpailevaa integraatio-PR:ää |
| **ChatGPT / riippumaton katselmointi** | GitHub-tilan tarkistus, menetelmien soveltuvuuden arviointi, riskien ja esitystavan havaitseminen | Erotti teknisen laskennan ja tieteellisen lähdevastaavuuden; nosti esiin mm. hyvin pienten GK-lukujen näennäisen tarkkuuden ja erillisten reseptiversioiden näkyvyyden |
| **GitHub ja paikalliset worktreet** | Jaettu, versioitu työaineisto ja muutosten erottelu | HEAD-hashit, erilliset haarat, PR:t, luovutusindeksit, lähdehashit ja kohdennetut CI-ajot |

**Tärkeä tulkintaraja:** havainnot osoittavat, että agentit **lukivat ja hyödynsivät** toistensa tuottamaa dataa, tunnistivat aktiivisia töitä ja sopivat käytännössä työnjaosta. Käytettävissä oleva näyttö ei osoita autonomista, jatkuvaa vertaiskeskustelu- tai viestinvälitysjärjestelmää. Osuvin kuvaus on *jaetun artefaktivaraston kautta koordinoitu asynkroninen moniagenttityö*.

### 3.1 Työnkulun arkkitehtuuri

```text
Omistaja: tavoite >=261/326 + menetelmävapaus
                     |
             yhteiset lähteet
                     |
       +-------------+---------------+
       |                             |
 Codex 1: GK149                 Codex 2: AFCD/MEXT
 integraatio, UI, CI            uudet lähteet, strategiat
       |                             |
       |          yhteiset resepti-ID:t,
       |          hashit ja päätösdata
       +---------------+-------------+
                       |
             deduplikointi + katselmointi
                       |
             16 hyväksyttyä / 17 odottaa
                       |
             erillinen julkaisupäätös
                       |
                  80 % tavoite
```

Näin työ voi edetä eri suunnista ilman, että kaksi agenttia yrittää samanaikaisesti muuttaa samoja tuotantotiedostoja.

## 4. Dokumentoitu eteneminen

| Vaihe | Tapahtuma | Merkitys |
| --- | --- | --- |
| Aiemmat ajot | Kattavuus 156/326; Operaatiot 146 ja 147 sekä AFCD-auditoinnit | Lähteet ja esteet oli kartoitettu, mutta julkaisutuotto hidas |
| Käyttäjän suunnanmuutos | Vaaditaan vähintään 30 ehdotuksen eräkoko; lopullinen tavoite edelleen 80 % | Agentit saavat luvan arvioida myös menettelytapaa |
| GK149 V2 | Kaikki 170 puuttuvaa seulotaan; 70 priorisoidaan | Yhteinen lähtöjoukko vähentää umpimähkäistä hakua |
| Ensimmäinen välitulos | 10 A + 6 B = 16 numeerista ehdokasta | Uusi GK-only-sopimus ja erillinen versionäkymä syntyvät |
| Omistajan rajattu hyväksyntä | 16 täsmällistä versiota hyväksytään integraation pohjaksi | Hyväksyntä sidotaan laskentapakettien hasheihin; ei Ready/merge/deploy-lupaa |
| Pääajon laajennus | 14 muuta laskentaehdotusta | Kokonaismäärä 30, mutta lähdevastaavuuden hyväksyntä puuttuu |
| Rinnakkaisajon lähdetyö | MEXT CHOAVL, natto-riisikulho sekä muut tarkat versiot | Kolme uutta uniikkia ID:tä yhteiseen aineistoon |
| Yhteinen luovutus | 30 + 22 merkintää −19 päällekkäisyyttä = 33 uniikkia | Estetään tulosten kaksoislaskenta |
| Rinnakkaisajon jatko | Pienien osuuksien B-sovitus, savupotkan tuotetieto ja hernekeitto-tutkimus | Lisäehdotukset ovat yhä kokeita; hyväksyttyä tuotantotulosta ei ole osoitettu |

**Ajallinen varaus:** käyttäjän välittämät tilaviestit ovat väliaikaisia työtilanteita. Ne eivät ole yhden yhteisen ajanottojärjestelmän luotettavia läpimenoaikahavaintoja.

## 5. Keskeiset tekniset ja metodiset innovaatiot

### 5.1 GK-only-profiili

Uusi laskentapolku erottaa GK:n tarvitsemat tiedot täydellisestä neljän makron paketista. Jos **imeytyvä hiilihydraatti on aidosti lähdemääritelmän mukaisesti saatavilla**, puuttuva kokonaispolyoli ei itsessään estä GK-laskentaa. Lähde, natiivi-ID, alkuperäinen kenttä, annos ja versio sidotaan. Makroja ei keksitä eikä peritä uuteen versioon.

**Hyöty:** sama työ voi tuottaa rehellisesti rajatun GK-version, vaikka ravintoarvojen täydellinen hyväksyntä vaatii myöhempää tutkimusta. **Riski:** erillisen version GK:n ja alkuperäisreseptin makrojen sekoittaminen käyttäjän mielessä. Siksi käyttöliittymässä on selvä versiokohtainen ero.

### 5.2 Valmiin ruoan GI tai valmistettu osaruoka

Perinteisen jokaisen ainesosan erillisen GI:n lisäksi tutkitaan ihmisillä mitattua **täsmällistä valmisruokaa tai valmistettua komponenttia**. Käyttöalan rajaus on ehdoton: kokonaisen aterian GI edellyttää koko vastaavan aterian hiilihydraattimäärää; pizzapohjan GI ei ole pizzan GI; roti jalan GI ei ole koko curryaterian GI. Testiannos ei ole reseptin tarjoiluannos. Esimerkkikohteet: biryani, baozi, Margherita, roti jala, upma ja taatelipuuro.

**Hyöty:** yksi valmistetun ruoan GI-mittaus voi välttää monen yksittäisen mausteen GI-puutteen. **Riski:** lähteen ja oman reseptin rakenne, jauhokoostumus, kypsennys, lisäaineet, määrä, lämpötila tai koehenkilöryhmä eivät välttämättä vastaa toisiaan. Esimerkiksi upman ja taatelipuuron analogiat ovat huomattavan epävarmoja. Kuusi valmistetun ruoan sovellusta jäi pääajossa nimenomaan lähdevastaavuus-HOLDiin; läpäisty aritmetiikka ei tarkoita hyväksyttyä julkaisutietoa.

### 5.3 Kansallisten ravintolähteiden alkuperäiskentät

Rinnakkaisajo rakensi rajatun MEXT-adapterin: naton natiivin saatavan hiilihydraatin massan kenttä oli **0,3 g/100 g**, eikä sitä korvattu MEXTin sokeriekvivalentilla tai erotuslaskennalla. Näin natto-riisikulhon ehdotus oli **GK noin 25,34/annos**, kun naton pieni hiilihydraattiosuus jäi hyväksyttävän pienosuuskokeen sisään ilman natolle keksittyä GI:tä. Kimchin puuttuva vastaava kenttä jäi nimenomaisesti puuttuvaksi, vaikka toisessa kentässä näkyi nolla.

**Hyöty:** uusi lähde ratkaisee täsmällisen koostumustiedon ongelman. **Riski:** eri lähteiden kenttien merkitykset, käyttöoikeudet ja valmistusversiot vaihtelevat; uusi tietokanta ei automaattisesti anna puuttuvaa GI:tä.

### 5.4 Lähdetiedon sijaan riippuvuuskartta

Kaikille 170 GK-puutereseptille muodostettiin koneellinen estekartta. Ensimmäisessä seulonnassa 39 jäi mallinnusmahdollisuuksien ja 38 tuote-/valmistustäsmennysten ryhmään; 83:ssa oli syvempi lähde- tai menetelmäeste. Pääajon 16 version jälkeen 154 keskeneräistä tapausta ryhmiteltiin yhteisiin esteisiin. Näitä lukuja ei pidä tulkita automaattisesti julkaistavissa olevien reseptien määräksi.

**Hyöty:** samat GI-/valmistus-/tuoteongelmat voidaan tutkia kerran ja tarkistaa vaikutus monelle reseptille; priorisointi perustuu odotettuun hyötyyn. **Riski:** liian karkea luokitus voi ohittaa reseptikohtaisen ratkaisevan eron.

### 5.5 Kontrolloidut GK-versiot

Pääajo toteutti 16 rajattua versiota ilman, että 326 alkuperäisen reseptin numeeriset GK-tulokset, käännökset tai makrot korvattiin. Erillinen versio sisältää omat ainesosamääränsä, valmistustarkennuksensa, LOW-luottamusmerkintänsä, lähteensä ja mahdolliset poisrajatut CHO-osuudet. FI/EN/SV/TH-esitys rakennettiin. Kattavuuslaskuri laskee reseptitunnuksen vain kerran.

**Hyöty:** menetelmäuudistuksia voi ottaa vaiheittain käyttöön. **Riski:** käyttäjälle voidaan esittää versiokohtaista GK:ta alkuperäisen reseptin ravintoarvojen vieressä; tämä vaatii erittäin selkeän käyttökokemuksen.

## 6. Todennetut tulokset ja suorituskyky

| Mittari | Tulos | Miten tulkitaan |
| --- | ---: | --- |
| Kattavuus alussa / tuotannossa | 156/326 | 47,85 %, ei muuttunut tarkistettuina hetkinä |
| Pääajon laskentaehdotukset | 30 reseptitunnusta | Vain 16 oli hyväksyttyä integraatioscopea |
| Rinnakkaisajon laskentaehdotukset | 22 merkintää | Osittain samoja pääajon ehdotusten kanssa |
| Päällekkäiset reseptitunnukset | 19 | Poistettiin yhteiskoonnista |
| **Uniikit numeeriset ehdotukset** | **33** | Laskennallisia, eivät kaikki julkaisuvalmiita |
| Omistajan menetelmä- ja sisältöhyväksymät versiot | 16 | Tekninen integraatio Draftissa; ei tuotantolupaa |
| Lähde-/sisältökatselmointia odottavat | 17 | Voi supistua myöhemmässä arvioinnissa |
| Draftin 16 integroidun version mahdollinen kattavuus | 172/326 | Versiokattavuus, ei alkuperäisreseptien kattavuus |
| Kaikkien 33 mahdollinen kattavuus | 189/326 | Vain jos kaikki 17 lisäksi hyväksytään, integroidaan ja julkaistaan |
| 80 % vähimmäisvaatimus | 261/326 | Lopullinen tavoite; 189:n jälkeen puuttuisi 72 |
| Pääajon viimeisin tarkistettu PR | #183 HEAD `c559be58` | Draft, CI PASS, ei deployta |
| Rinnakkaisajon luovutus | tutkimuscommit `c4cd0d8` | Ei erillistä kilpailevaa PR:ää |

**Vältettävä tulkintavirhe:** 33 uutta ehdotusta ei tarkoita 33 onnistunutta tuotantolaskentaa. Myöskään 172/326 ei tarkoita, että 172 alkuperäisestä reseptistä olisi nykyisellään täsmällinen hyväksytty GK, vaan että 156 alkuperäisen tuloksen lisäksi 16 muulle löytyi **erillinen hyväksytty GK-versio**, jota ei vielä ollut julkaistu.

## 7. Hyödyt

### 7.1 Menetelmien monipuolistuminen

Sama rajattu ongelma voidaan ratkaista eri tavoilla: itsenäinen saatavan CHO:n lähdekenttä, ainesosakohtainen GI, valmistetun ruoan GI, nimetty tarkka tuote, pieniainesten hyväksytty poisjättö tai aidosti lähteistetty skenaario. Yhden menetelmän este ei enää automaattisesti pysäytä koko reseptiä. Vaihtoehdoista voidaan valita paras reseptikohtaisesti.

### 7.2 Rinnakkaisuus ja mahdollinen nopeutuminen

Kaksi agenttia voi tutkia lähdeperheitä ja valmistustapoja samanaikaisesti. Tällä kertaa molemmat löysivät uusia ehdotuksia ja hyödynsivät toistensa tuotoksia. **Todellista speedup-kerrointa ei kuitenkaan voida laskea**, koska saman tehtävän yhden agentin vertailuajoa, yhtenäistä ajanottoa ja kokonaistokenien kulutusmittausta ei ole.

### 7.3 Tiedon uudelleenkäyttö

Yhteiset CSV/JSON/JSONL-indeksit, natiivi-ID:t, commitit ja hashit antavat agentille mahdollisuuden jatkaa siitä mihin toinen jäi. Tämä vähentää turhia samoihin lähde-esteisiin paluuta ja auttaa välttämään ristiriitaisia hyväksyntöjä.

### 7.4 Roolien luonnollinen eriytyminen

Yhdestä agentista kehittyi **integroija**, toisesta **tutkija ja uusien reittien etsijä**. Tämä on tehokkaampi kuin kaksi agenttia, jotka molemmat tekevät saman kokonaistyön ja avaavat erilliset PR:t samoihin tiedostoihin.

### 7.5 Luotettavuus ja palautettavuus

Omat Git-worktreet, täsmälliset syötehashit, hyväksynnän scope, Draft-vaihe, regressiot ja CI antavat vahvan suojan tahattomalle tuotantomuutokselle. Omistajan hyväksyntä ei automaattisesti tarkoita mergeä tai deployta.

### 7.6 Skaalautuvuus muille projekteille

Mallia voi soveltaa lähde- ja faktatutkimukseen, ohjelmistosuunnitteluun, sisältökatselmointiin, datan normalisointiin ja ReportHubin ympärille rakentuvaan työnjakojärjestelmään. Menetelmä ei edellytä uutta NVIDIA-laitetta: nykyinen pilvi-Codex ja GitHub riittävät toimivan prosessin testaamiseen.

## 8. Haitat ja riskit

| Riski | Miten se ilmeni tai voisi ilmetä? | Torjunta |
| --- | --- | --- |
| **Päällekkäinen työ** | 52 ehdokasmerkintää, mutta vain 33 uniikkia reseptiä; 19 osui samoihin ID:ihin | Yksi yhteinen rekisteri, uniikki `(recipeId, variantHash, methodVersion)` ja omistajuus |
| **Yhteinen virhe vahvistuu** | Agentit voivat lainata samaa virheellistä GI-analogiaa toisiltaan | Riippumaton lähde- ja menetelmäkatselmointi, virheellinen riippuvuus ei periydy hyväksyntänä |
| **Laskenta sekoittuu lähdekelpoisuuteen** | Kuusi valmistetun ruoan B-sovellusta laskettavissa mutta lähdevastaavuus-HOLDissa | Erottele laskettu, lähdehyväksytty, sisältöhyväksytty, integroitu ja julkaistu |
| **Kattavuus mittaa väärää asiaa** | 16 erillistä versiota nostaa *versio*-kattavuutta, ei alkuperäisen reseptin lukujen saatavuutta | Kaksi erillistä kattavuusmittaria, versiokohtainen selite |
| **Näennäistarkka hyvin pieni GK** | Kakku GK 0,07/keksit 0,03 vaikka yli 1 g CHO/annos rajattu pois | Julkisesti ”laskettu osuus <1” ja näkyvä poisjättö; tarkat sisäarvot säilyvät |
| **Lähdevastaavuusvirhe** | Pizza-pohja ≠ koko pizza, verkkolettu ≠ curryateria, höyrytetty manna ≠ vesipuuro | Valmistetun ruoan nimetty soveltamisala, nimenomaiset erojen hyväksynnät |
| **Väärä määrä tai koostumus** | 900 g kypsää riisiä on ehdotettu uusi punnittu versio, ei todennettu 300 g kuivan riisin saanto | Kuiva/kypsä-laskenta kerran, versiota ei vaihdeta huomaamatta |
| **Versio- ja hash-riippuvuus** | PR #182 muuttaa koko `food-records.json`-hashia vaikka GK149:n käyttämä erytritolitietue ei muutu | Lähdetietuekohtainen riippuvuussidos; tarkka regressio ja tarvittaessa uusi hyväksyntä |
| **CI ja testikuorma** | Useat commitit ja PR-CI:t syövät Actions-minuutteja; kaksi ajoa voi lisätä kokonaiskuormaa | Paikalliset kohdennetut tarkistukset, ei turhia massauusintoja; yksi release-CI per hyväksytty muutos |
| **Kustannusten kasvu** | Kahden agentin suurempi samanaikainen tokenien kulutus mahdollinen | Seuraa kummankin ajon tokenit, rahakustannukset, läpimenoaika ja käyttökelpoiset julkaisut |
| **Yhteiskontekstin vanheneminen** | Pääajo päivittää HEADia, rinnakkaisajo lukee aiemman snapshotin | Näytä molemmille pinned-HEAD ja aineiston ikä, estä vanhan ehdotuksen suora julkaisu |
| **Ihmiselle syntyvä katselmointijono** | 17 numerollista ehdotusta tarvitsee päätöksiä, vaikka mallit laskevat nopeasti | Priorisoi korkean vaikuttavuuden yhteisratkaisut ja ryhmähyväksynnät täsmällisellä scope-rajauksella |
| **Raporttien paisuminen** | Aiempi Operaatio 147 tuotti >100 000 lisättyä riviä | Pääraportti 1–3 sivua, yhteinen tietotaulukko ja linkit alkuperäiseen evidenssiin |
| **Turvallisuus / oikeudet** | Uudet lähdetietokannat voivat sisältää käyttö- tai jatkojakelurajoituksia | Käytä luvallisia alkuperäislähteitä, dokumentoi versiot ja attribuutiot, älä julkaise luvattuja raw-dumppeja |

### 8.1 Erityinen lääketieteellinen tulkintariski

GK on mallinnettu hiilihydraattivaikutuksen mittari, ei yksilön glukoosisensorin ennuste. Ainesosien GI-lähteiden soveltuvuus voi vaihdella kypsennyksen, jalostuksen, koostumuksen ja testatun väestön mukaan. Kun käyttäjä käyttää arvoja VHH/Keto- tai diabetestarkoituksiin, epävarmuuden näkyvä erottelu on tärkeämpää kuin kahden desimaalin näyttö. Rehellinen puuttuva tieto on parempi kuin väärä turvallisuuden tunne.

## 9. Onko kahden agentin käyttö taloudellisesti kannattavaa?

Tässä tapauksessa rinnakkaiskäytön koettua kustannusta pidettiin maltillisena: käyttäjän ilmoituksen mukaan viikkokiintiötä oli vielä 64 yksikköä jäljellä koko päivän ajojen jälkeen. **Mittayksikköä ei ole varmennettu**, joten tästä ei saa tehdä kustannus- tai tokeniprofilointiväitettä. Emme tiedä kummankin agentin todellista input/output-tokenimäärää, mallin hinnoittelua, uudelleenajoja tai laskennan paikallista osuutta.

Seuraavassa kokeessa tulisi mitata kummallekin ajolle: aloitus- ja lopetusaika, käytetty malli ja effort, syöte-/tulostetokenit, web- ja connector-kutsut, Actions-minuutit, uniikit ehdokkaat, hyväksytyt ehdokkaat, julkaistut reseptit sekä tarvittujen ihmispäätösten määrä. Tärkein tulosmittari on **hyväksyttyä ja julkaistua numeerista GK:ta / käytetty resurssi**, ei vain löydettyjen desimaalien määrä.

## 10. Miten tätä kannattaisi käyttää jatkossa?

### 10.1 Yksi koordinaattori, kaksi selvästi erillistä työroolia

Suositeltu malli:

1. **Integraatioagentti** omistaa hyväksyttyjen reseptiversioiden GK-only-toteutuksen, UI:n, kieliversiot ja julkaisu-Draftin.
2. **Tutkimusagentti** omistaa yhteisten lähteiden, GI-vastaavuuksien ja uusien mallinnusreittien selvityksen. Se tuottaa siirrettävän aineiston, ei muokkaa integraatiotiedostoja.
3. **Katselmoija/ihminen** hyväksyy lähde- ja menetelmäpäätökset, varmistaa riskit ja antaa erilliset julkaisuvaltuudet.

### 10.2 Kevyt yhteinen tulosrekisteri

Yhteisessä tiedostossa tai ReportHubin myöhemmässä tietomallissa pitäisi olla vähintään: `recipeId`, `variantInputHash`, `sourceVersion`, `methodVersion`, `agentOwner`, `sourceState`, `methodState`, `contentState`, `integrationState`, `publicationState`, `blockingReasons`, `lastVerifiedHead` ja `nextAction`. Vain yksi aktiivinen agentti muokkaa kunkin reseptiversion julkaisuscopea; muut tekevät ehdotuksia.

### 10.3 Tiukat hyväksyntätasot

- **LASKETTU:** aritmetiikka tuottaa numeron; ei julkaisuvaltuutta.
- **LÄHDEKELPOINEN:** ruoka, valmistus ja CHO vastaavat hyväksyttävää lähdesovellusta.
- **SISÄLTÖHYVÄKSYTTY:** täsmällinen reseptiversio, annokset ja mahdolliset lisukerajaukset on hyväksytty.
- **INTEGROITU:** koodi ja esitystapa vastaavat hyväksyttyä syötettä, regressiot läpäisty.
- **JULKAISTU:** erillinen lupa, merge, deploy ja tuotantovarmennus.

Tämän avulla esimerkiksi kuutta tutkimuksellista B-laskua ei esitetä kuutena julkaisuvalmiina reseptinä.

### 10.4 Hyväksyttyjen erien läpimenoaika tärkeimmäksi

Jotta 80 % toteutuu, tutkimus ja julkaisuprosessi eivät saa odottaa toistensa koko urakan valmistumista. Tarkoituksenmukainen linja on julkaista erikseen hyväksytyt versiot, kun kyseisen HEADin riippuvuudet (mm. PR #182:n hashimuutokset) on korjattu, ja jatkaa seuraavia lähdetyöeriä rinnalla. Älä kuitenkaan julkaise ensimmäistä 16:ta ilman nykyisen haaran uusiutunutta tarkistusta ja erillistä lupaa.

### 10.5 Jatkokokeen arviointi ilman kontrolliryhmän harhaa

Seuraavassa vertailussa käytetään esimerkiksi kahta mahdollisimman samankaltaista reseptijoukkoa tai samoista lähtötiedoista riippumattomia tehtäväkopioita. Mitataan yhden agentin ja kahden agentin julkaisuvalmis tuotto, resurssikulutus ja virhekorjausten määrä. Ilman tätä ei väitetä, että kaksi agenttia olisi X kertaa nopeampi.

## 11. Seuraavat konkreettiset päätökset

1. **PR #183:n 16 hyväksyttyä versiota:** viimeistele nimenomaan tämän HEADin käyttöliittymä- ja lähdesidonta; huomioi PR #182:n tuoma koko lähdetiedoston hash-riippuvuus. Vasta tämän jälkeen Ready/merge/deploy erillisellä luvalla.
2. **Rinnakkaisajon A-ehdokkaat:** katselmoi natto, dashimaki, kahvijogurtti, täyslehtinen hojicha, pad kee mao ja Chettinad yhdessä rajatussa lähde- ja sisältöerässä; ne eivät vielä ole hyväksyttyjä julkaisuversioita.
3. **Valmisruoka-B-ehdotukset:** hyväksy vain nimettyjen tutkittujen ruokien ja reseptiversioiden kestävät vastaavuudet; erityisesti upma/taatelipuuro voivat jäädä HOLDiin.
4. **Jatka 261/326-tavoitetta:** työjono rakennetaan 154 jäljellä olevasta puuttuvasta GK-reseptistä ja sen tarkennuksista; järjestelmä priorisoi yhteisiä lähde-/valmistusesteitä eikä raportoi julkaisemattomia arvoja tuotantotuloksina.
5. **Tallenna opit:** kirjaa kaksiajon toimintamalli ReportHubin kehityssuunnitelmaan tai IdeaHubiin erillisellä omistajan hyväksynnällä. Älä rakenna heti raskasta automaatiota; ensin mitataan toistettavuus.

## 12. Kokonaisarvio

| Ulottuvuus | Arvio | Peruste |
| --- | --- | --- |
| Teknisesti toteutunut rinnakkaistyö | Hyvä | Selkeä työnjako syntyi, yhteiset artefaktit ja ei kilpailevaa PR:ää |
| Aito menetelmäkehitys | Hyvä | GK-only, valmisruokayksikkö, MEXT-natiivi kenttä ja riippuvuuskartta |
| Laskennallinen tuotto | Lupaava | 33 uniikkia ehdotusta verrattuna vanhaan hitaaseen malliin, mutta ei kontrolloitua vertailua |
| Tieteellinen lähdevarmuus | Vaihteleva | Useat valmisruokavertailut ovat edelleen HOLDissa |
| Julkaisutuotto | Ei vielä osoitettu | Tuotanto 156/326 kokeilun tarkistetuilla hetkillä |
| Tokeni-/aikatehokkuus | Tuntematon | Vertailumittarit puuttuvat |
| Laajennettavuus muihin projekteihin | Hyvä potentiaali | Toimii Git-/ReportHub-pohjaisena prosessina ilman uutta laitteistoa |

**Yhteenveto:** kaksiajo kannatti kokeilla. Se muutti ongelmanratkaisua ja löysi uuden yhteisen työmuodon. Seuraava todellinen onnistumisen osoitus on, saadaanko 16 hyväksyttyä versiota julkaisuun ja pystytäänkö samaa menetelmää toistamaan niin, että 261/326 saavutetaan ilman epäluotettavia GK-lukuja.

## 13. Tarkistetut ensisijaiset lähteet

- [GK80 Operaatio 149 V2 – Draft PR #183](https://github.com/ozirix-dev/Reseptit/pull/183), tarkistettu HEAD `c559be5855b86e4b89b8f780df51a6298612ec6f`.
- [PR #183:n raportti](https://github.com/ozirix-dev/Reseptit/blob/c559be5855b86e4b89b8f780df51a6298612ec6f/docs/nutrition/gk80-operation149/README.md).
- [PR #183:n valmisruokien ja 14 ehdotuksen katselmointi](https://github.com/ozirix-dev/Reseptit/blob/c559be5855b86e4b89b8f780df51a6298612ec6f/docs/nutrition/gk80-operation149/prepared-route-review.md).
- [PR #183:n lähdevastaavuuden päätösmatriisi](https://github.com/ozirix-dev/Reseptit/blob/c559be5855b86e4b89b8f780df51a6298612ec6f/docs/nutrition/gk80-operation149/source-match-matrix.md).
- [Pääajon CI](https://github.com/ozirix-dev/Reseptit/actions/runs/41472310699), PASS ja deploy SKIPPED.
- [Rinnakkaisajon AFCD-POLYOL-03 -luovutus](https://github.com/ozirix-dev/Reseptit/blob/c4cd0d8/docs/research/afcd-polyol-03/README.md), yhteinen 33 ehdokkaan analyysi.
- [AFCD-POLYOL-01 tutkimus-PR #181](https://github.com/ozirix-dev/Reseptit/pull/181) ja [kenttäkorjaus PR #182](https://github.com/ozirix-dev/Reseptit/pull/182).
- [Operaatio 147 – PR #180](https://github.com/ozirix-dev/Reseptit/pull/180), aikaisempi menetelmäauditointi.

## 14. Ensimmäinen rinnakkaisajon törmäys ja siitä johdettu yhden kirjoittajan periaate

**Täydentävä havainto — 2.11.2026.** Tämä luku kuvaa alkuperäisen tapaustutkimuksen jälkeen tapahtunutta julkaisuhaaran törmäystä ja sen korjausta. Lukujen 1–13 aikaisempaa tilannekuvaa ei ole kirjoitettu jälkikäteen uudelleen.

### 14.1 Mitä tapahtui?

Omistaja hyväksyi PR #183:n Ready-siirtymän ja normaalin Codex-katselmoinnin täsmälliselle 16 version HEADille `c559be5855b86e4b89b8f780df51a6298612ec6f`. Repo_guard varmisti tämän HEADin ja mainin ennen Ready-siirtymää. GitHub kirjasi Ready-tapahtuman 2.11.2026 kello 17.58.26 Suomen aikaa. Codex-katselmointi käynnistyi kyseiselle commitille.

Rinnakkaisajo valmisteli samaan aikaan kuuden A-version sisältöhyväksyttyä integraatiota samaan PR-haaraan. Näiden kuuden hyväksyntä koski integraatiota; se ei antanut Ready-, merge- tai deploy-lupaa. Kuuden erä käsitti kahvijogurtin, dashimakin, täyslehtisen hojichan, natto-riisikulhon, pad kee maon ja Chettinadin.

Seuraavassa tilatarkistuksessa PR:n HEAD oli vaihtunut committiin `80f4360435b978d1cfa81088df1414430a88c222`. Julkaisuintegraatio sisälsi nyt 22 versiota, vaikka Ready-hyväksyntä ja käynnissä oleva katselmointi koskivat 16 version sisältöä. Kuuden integraatiocommitissa oli `[skip ci]`, joten uuden HEADin GitHub-CI:tä ei ollut suoritettu.

Törmäys koski julkaisuhaaran omistajuutta ja hyväksynnän rajausta. Kumpikin ajo oli tunnistanut oikean repositoryn ja käytti repo_guardia omiin toimiinsa. Repository-identiteetin tarkistus ei kuitenkaan varannut yhteistä työpuuta tai haaraa yhdelle kirjoittajalle eikä lukinnut PR:n sisältöä Ready-siirtymän jälkeisiltä pusheilta.

### 14.2 Miten tilanne korjattiin?

Codex-katselmointi valmistui alkuperäiselle `c559be5`-sisällölle ilman löydöksiä. Sen tulosta ei ulotettu uuteen 22 version sisältöön. Omistajalle tuotiin yksi yhteensovituspäätös: pidetäänkö 16 ja 6 erillisinä vai valmistellaanko 22 yhteiseen katselmointiin. Omistaja valitsi erottelun.

Korjaus eteni näin:

1. Toisen ajon kirjoittaminen yhteiseen työpuuhun pysäytettiin omistajan ohjeella. Se jäi seuraamaan korjauksen valmistumista.
2. Kuuden version koko työ säilytettiin etähaarassa `codex/gk80-six-a-isolated` ja omassa työpuussa. Säilytetty lähdecommit on `80f4360435b978d1cfa81088df1414430a88c222`.
3. PR #183:n palautukselle valmisteltiin tarkka käänteinen muutos. Siihen kuului 13 lisätyn tiedoston poistaminen PR-haarasta ja seitsemän muutetun tiedoston palauttaminen.
4. Repo_guardin commit-toiminto ei tue tiedostopoistoja. Omistajalta saatiin kertaluonteinen poikkeus vain tämän palautuscommitin tekemiseen. Push tehtiin edelleen repo_guardilla normaalina pushina.
5. Palautuscommit `d98d77f56c244833320705b32e789ea72e30e58f` palautti PR:n koko tiedostopuun täsmälleen `c559be5`-tilaan. Molempien Git-tiedostopuun tunniste oli `6c95de99500e7a3b2337fa801f436986e360a525`.
6. Uuden palautus-HEADin yksi normaali PR-CI läpäisi. Deploy ohitettiin. Kuuden erän sisältöä ei yhdistetty PR #183:n julkaisuintegraatioon.

Korjaus ei muuttanut GK-laskelmia, alkuperäisiä reseptejä, makroja tai hyväksyttyjen 16 version lähde- ja syötepaketteja. Se ei lisännyt tuotantokattavuutta. Korjauksen lopputilanteessa tuotannosta varmennettu määrä oli edelleen 156/326, PR #183:n 16 version ehdokas 172/326 ja molempien erillisten erien mahdollinen myöhempi yhteistulos 178/326. Jälkimmäinen oli ehdollinen tuleva tilanne. Mergeä tai tuotantodeployta ei tehty.

### 14.3 Johdettu yhden kirjoittajan periaate

**Yhdellä julkaisuhaaralla ja siihen liittyvällä työpuulla on kerrallaan yksi kirjoittava vastuurooli.** Muut agentit voivat lukea aineistoa ja tehdä riippumattomia tarkistuksia. Niiden omat muutokset valmistellaan omissa työpuissa ja haaroissa.

Käytännössä tämä tarkoittaa:

- Integraatioagentti omistaa julkaisu-PR:n sisällön, siihen tehtävät pushit ja Ready-siirtymän valmistelun.
- Tutkimusagentti tuottaa oman haaransa lähde- ja päätöspaketin. Integraatioagentti ottaa sen julkaisuhaaraan vasta sovitussa siirtokohdassa.
- Uuden aineiston lisääminen Ready-PR:ään sovitaan erikseen. Aiempi Ready-hyväksyntä ei siirry automaattisesti muuttuneeseen reseptijoukkoon tai lähdepakettiin.
- Sisältöhyväksyntä sidotaan täsmällisiin syötteisiin ja lähteisiin. Ready-, merge- ja deploy-valtuutukset erotetaan siitä.
- Julkaisuhaaralle kirjoittava agentti tarkistaa etä-HEADin ennen muutosta. Ulkopuolinen HEAD-muutos aiheuttaa uuden rajauksen tarkistuksen.
- Kirjoitusvuoron vaihto ilmaistaan selvästi omistajan päätöksessä tai luovutuksessa. Epäselvässä tilanteessa agentti säilyttää työnsä omassa haarassaan.

Tässä korjauksessa erottelu toteutettiin erillisellä haaralla ja työpuulla. Automaattista agenttien kirjoituslukkoa ei rakennettu. Periaate on tapaustutkimuksesta johdettu toimintasuositus; sen tekninen toimeenpano olisi erillinen tehtävä.

### 14.4 Mitä törmäys opetti tehokkuudesta?

Rinnakkaisuus auttoi lähteiden tutkimisessa ja vaihtoehtoisten menetelmien löytämisessä. Yhteinen kirjoitettava julkaisuhaara synnytti silti ylimääräisen palautuscommitin, CI-kierroksen ja omistajan yhteensovituspäätöksen. Nämä ovat todellista koordinointikustannusta.

80 prosentin tavoite ohjasi etsimään tehokkaampia ratkaisuja. Törmäys osoitti, että suurempi tutkimustuotto tarvitsee rinnalleen selkeän integraation omistajan. Kaksi ajoa voi työskennellä samaa tavoitetta kohti eri reiteillä, kun niiden kirjoitusvastuut ja hyväksyntärajat pysyvät erotettuina. Tehokkuutta arvioidaan lopulta hyväksyttyjen ja julkaistujen tulosten sekä niihin käytetyn kokonaisresurssin perusteella.

### 14.5 Törmäyshavainnon evidenssi

- [16 version katselmoitu commit `c559be5`](https://github.com/ozirix-dev/Reseptit/commit/c559be5855b86e4b89b8f780df51a6298612ec6f).
- [Codex-katselmoinnin yhteenveto](https://github.com/ozirix-dev/Reseptit/pull/183#issuecomment-6581721791): katselmointi kohdistui `c559be5`:een ja valmistui ilman löydöksiä.
- [Kuuden version integraatiocommit `80f4360`](https://github.com/ozirix-dev/Reseptit/commit/80f4360435b978d1cfa81088df1414430a88c222).
- [Erillinen kuuden version haara](https://github.com/ozirix-dev/Reseptit/tree/codex/gk80-six-a-isolated).
- [16 version palautuscommit `d98d77f`](https://github.com/ozirix-dev/Reseptit/commit/d98d77f56c244833320705b32e789ea72e30e58f).
- [Palautus-HEADin CI](https://github.com/ozirix-dev/Reseptit/actions/runs/41479093739): PASS; deploy SKIPPED.

---

**Huomautus:** Tämä on historiallinen tapaustutkimus, joka perustuu riippumattomaan katselmointiin ja käyttäjän toimittamiin työviesteihin. Luku 14 täydentää alkuperäistä tarkistushetkeä myöhemmällä törmäys- ja erotteluhavainnolla. Raportin tallentaminen ei muuta tuotantotietoja eikä anna julkaisulupaa.
