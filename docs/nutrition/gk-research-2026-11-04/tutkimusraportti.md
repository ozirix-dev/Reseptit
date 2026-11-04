# Reseptien glykeemisen kuorman laskenta — tutkimus 4.11.2026

> **Lähdedokumentti / arkistotutkimus.** Tämä on 4.11.2026 valmistuneen 16-sivuisen tutkimusraportin Markdown-siirto. Tutkimuksessa käytetyt R-lähteet ja kattavuus 230/326 kuvaavat siihen kirjattua tarkistushetkeä; eivät ole automaattisesti tämän PR:n ajantasainen main-tilanne. Päätökset, käyttöönottojärjestys ja repon uudempi tila dokumentoidaan rinnakkaisissa tiedostoissa. Tämä julkaisu ei hyväksy uutta laskentamenetelmää eikä muuta tuotantodataa.

# Tutkimuksen päätulos

Reseptit-palvelun laskentaa voidaan tehdä huomattavasti sujuvammaksi säilyttämällä lähteiden jäljitettävyys. Suosittelen yhteistä laskentamoottoria, jossa jokaisen hiilihydraattiosuuden määrä, GI-peruste ja epävarmuus tunnetaan. Moottori muodostaa tilanteeseen sopivan pistearvion, perustellun skenaariovälin tai selvästi nimetyn osatuloksen. Yhden raaka-aineen puuttuva täsmämittaus ei yksin ratkaise koko reseptin laskettavuutta.

Tutkimuksen keskeinen käytännön suositus on hyväksyä uudelleenkäytettäviä, valmistustavaltaan rajattuja raaka-ainesidoksia. Samalle perunalle, avokadolle tai kastikkeelle tehtyä lähdearviota pitää voida käyttää seuraavassa vastaavassa reseptissä. Reseptin tulos lasketaan ja versioidaan uudelleen määrien muuttuessa, mutta määränmuutos ei itsessään tee kelvollisesta lähteestä kelvotonta.

Tarkastelu osoittaa myös korjattavaa. Eri laskentareittien poisjättösäännöt eroavat toisistaan. Hiilihydraatin normalisoinnin available-kentän polyolimerkitys vaihtelee lähdetyypin mukaan. Uunimuna-avokadojen valmistusohjeessa on syödyn määrän ristiriita. Ketomutakakun 0,07 on laskettu osuus, joten sitä ei saa tulkita koko kakun GK:ksi. Näiden ongelmien ratkaisut esitetään tässä raportissa. \[R1, R2, R7, R8, R12\]

Suositukset on laadittu myös Recipavon henkilökohtaisia reseptejä varten. Käyttäjä on sallinut tarkkojen määrien ja raaka-ainevalintojen ehdottamisen reseptitekstiin. Tuloksen esitystapa valitaan tiedon laadun mukaan. Yksityisen reseptin automaattinen uudelleenlaskenta ja julkisen toimitetun reseptin julkaiseminen tarvitsevat eri toimintakäytännöt.

# 1 Tarkistettu lähtötilanne

Repoaineisto tarkistettiin main-versiosta b96ba0b0dfe8f859736f9db63be982021ca7a63d. Mixed Evidence -luonnoksen PR 253 tarkistettu versio on 936ef6d8ed9af185b233db4b77afcab9e8fab705. Mainin toteutus, luonnoksen ehdotukset ja tässä raportissa esitettävät uudet suositukset ovat eri asioita.

Viimeisin menetelmäraportti ilmoittaa kattavuudeksi 230/326 eli 70,55 prosenttia. Julkaisupakettien tarkastelu tukee tätä: 207 reseptin lähtötilaan lisättiin 23 erillistä versiota. Kattavuus tarkoittaa vähintään yhtä numeerista reseptiversiota. Se ei tarkoita, että kaikkien 230 alkuperäisohjeen koko GK olisi täysin määritetty. Nykyinen koodi erottaa jo alkuperäisen reseptin ja hyväksytyn täsmäversion. Tätä erottelua kannattaa käyttää myös raporteissa. \[R3–R5\]

Alkuperäisten numeeristen reseptien 156 ja erillisten versioiden 74 erittely perustuu julkaistuihin raportteihin ja latausketjun tarkastukseen. Tässä tutkimuksessa ei tehty uutta koko aineiston massalaskentaa. Vanhaan 261 reseptin tavoitteeseen tarvittaisiin 31 uutta reseptiä. Tämän tutkimuksen ehdotuksille ei lasketa ennakkoon kattavuushyötyä.

| **Nykyinen reitti**   | **Keskeinen ehto**                                                                                                                                                                  | **Käytännön seuraus**                                                                                   |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Perusmalli            | GI voi olla EXACT, ANALOG tai rajattu CATEGORY_MEAN. GI:tön osuus alle 1 g hiilihydraattia per ainesosa ja alle 2 g yhteensä annosta kohti.                                         | Analogiat ovat jo osittain sallittuja. Vanha yleiskuva kaikkien analogioiden kiellosta on liian karkea. |
| GK149 B               | Positiivinen hiilihydraatti tarvitsee nimetyn sovelluksen. Rajatut projektin koodit ovat mahdollisia.                                                                               | Tietyn koodin toimivuus yhdessä reseptissä ei vielä yleistä sitä toiseen.                               |
| Mixed Evidence main   | Positiivinen ihmis-GI-osuus, koodiosuus ja poisjättö vaaditaan. Poisjättö on enintään 0,50 g hiilihydraattia/annos ja sen GI 100 -stressivaikutus enintään 10 prosenttia pisteestä. | Nollapoisjättöinen yhdistelmä ei pääse tähän reittiin.                                                  |
| Mixed Evidence PR 253 | Pakollinen positiivinen poisjättö poistetaan. Lisätään sääntöversioon ja syötteisiin sidottu katselmointi.                                                                          | Jo julkaistu okayu kelpaa katselmointireitin verrokiksi. Ehdotus koskee rajattua katselmointia.         |

Nämä ovat projektin toteutus- ja julkaisusääntöjä. Niiden numeerisille rajoille ei tässä lähdeaineistossa löytynyt yleispätevää fysiologista hyväksyntästandardia. Tutkimusperusta tukee vaikutuksen ja epävarmuuden arvioimista, mutta ei tee esimerkiksi 0,50 GK:n rajasta luonnonvakiota. \[R1–R3\]

# 2 Mitä reseptin GK arvioi

Glykeeminen indeksi kuvaa elintarvikkeen hiilihydraatin verensokerivaikutusta suhteessa viiteruokaan. Glykeeminen kuorma yhdistää GI:n ja syödyn hiilihydraattimäärän. Käytännön laskentaan tarvitaan yhteensopiva hiilihydraattimäärä, GI:n asteikko ja elintarvikkeen valmistusmuoto. Kansainväliset taulukot suosittelevat glukoosin asteikkoa, jossa glukoosi on 100. Ennen laskentaa kaikki havainnot yhtenäistetään tälle asteikolle. Muunnos ja peruste tallennetaan; tuntemattoman asteikon lukua ei yhdistetä sellaisenaan. \[S1–S3\]

$${GK}_{annos} = \frac{1}{n}\sum_{i}^{}\frac{{GI}_{i} \cdot C_{i}}{100}$$

Kaavassa C<sub>i</sub> on ainesosan tai valmistetun komponentin koko reseptiin tuoma, GI-lähteen kanssa yhteensopiva hiilihydraattimäärä grammoina. n on annosten määrä. Kun ainesosa painaa m<sub>i</sub> grammaa ja sen koostumus on c<sub>i</sub> grammaa hiilihydraattia sadassa grammassa, C<sub>i</sub> saadaan kertomalla m<sub>i</sub> ja c<sub>i</sub> sekä jakamalla sadalla. Painon ja koostumustietueen pitää koskea samaa olomuotoa ja syötävää osaa.

Valmistetun osan, kuten dosa-taikinan, GI voidaan kohdistaa sen hiilihydraatteihin yhtenä kokonaisuutena. Samoja hiilihydraatteja ei sen jälkeen lasketa uudelleen riisin ja palkokasvin erillisillä GI-arvoilla. Jos käytössä on koko valmiin tuotteen soveltuva mitattu GI, sitä voidaan käyttää vastaavan tuotteen hiilihydraattimäärään. Tavallisen purettavan seka-aterian ja valmistuksessa yhdeksi tuotteeksi muuttuvan ruoan välillä tehdään tietoinen valinta; vuoden 2021 kansainväliset taulukot suosittelevat seka-aterioille komponenttilaskentaa. \[S29\]

Leivän, kakun ja keksin valmistus muuttaa rakennetta. Louien kohdistusmenetelmä suosittelee tällaisille tuotteille vastaavaa valmistettua tuotetta raakajauhojen GI-keskiarvon sijaan. Recipavon pitää siksi tunnistaa myös valmis komponentti. Jos aineksista laskettua mallia käytetään puuttuvan vastineen takia alustavana arviona, sen valmistukseen liittyvä epävarmuus merkitään näkyviin. \[S9\]

## Laskettu arvo ja mitattu ateriavaste

Hiilihydraateilla painotettu laskenta on vakiintunut tutkimusmenetelmä. Sen tarkkuus valmiin aterian fysiologisen vasteen ennustamisessa riippuu ruoasta. Doddin tutkimuksessa 30 terveellä osallistujalla kolmen aterian laskettu GI yliarvioi mitattua GI:tä 22–50 prosenttia. Toisessa pienessä tutkimuksessa kuuden aterian mitatut ja ennustetut GI:t korreloivat hyvin. Näistä seuraa, että menetelmä soveltuu läpinäkyväksi arvioksi, mutta poikkeamaa ei voi korjata yhdellä yleisellä vähennyskertoimella. \[S4–S5\]

Ballancen tutkimuksessa korjattu ateriamalli ennusti hyvin 15:tä 17 tarkastellusta ateriasta, kun uuteen kokeeseen yhdistettiin aiempia tutkimuksia. Tekijät edellyttivät lisävalidointia. Tulos osoittaa, että ateriamalleja kannattaa tutkia, mutta ei yksin ratkaise kaikkien käyttäjäreseptien laskentaa. \[S28\]

Reseptikortille sopii nimi ”laskennallinen GK-arvio”. Arvo ei ole verensokerin nousu millimooleina litrassa, henkilökohtainen hoitoennuste tai osoitus koko aterian mitatusta GI:stä. Rasvaa ja proteiinia ei vähennetä GK:sta mielivaltaisilla kertoimilla. Yksilöllinen vaihtelu ja aterian yhteisvaikutukset jäävät tavallisen reseptilaskennan ulkopuolelle. \[S6\]

# 3 Glykeemisen indeksin kohdistaminen käytännössä

Julkaistuissa kohdistusmenetelmissä puuttuvia GI-tietoja on ratkaistu vaiheittain: suora vastaavuus, läheinen ruoka, ainesosiin perustuva laskenta ja heikommin perusteltu luokkakohtainen arvio. FAO suosittelee myös koostumustietojen vastaavuudessa dokumentoitua etenemistä parhaasta saatavasta vastineesta heikompaan. Koostumuksen vastaavuus ja GI:n vastaavuus on silti arvioitava erikseen. Sama rasva- ja proteiinimäärä ei osoita samaa tärkkelyksen sulavuutta. \[S7–S9\]

Ensin päätetään, lasketaanko ruoka erillisinä ainesosina vai valmistettuna komponenttina. Vastaavuus arvioidaan valitun yksikön sisällä. Tarkasti vastaavan valmiin tuotteen mittaus voi siis olla paras täsmävastine. Alla olevat menetelmät kokoavat yhteisen toimintamallin; valmistettu osa ei ole automaattisesti heikompi kuin erillinen ainesosa. Tämä on Reseptit- ja Recipavo-toteutusta varten laadittu sovellus, ei suora kopio yhden tutkimuksen säännöistä.

| **Menetelmä**   | **Hyväksyttävä peruste**                                                      | **Tulokseen tallennettava tieto**                                           |
|-----------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Täsmävastine    | Sama tuote tai tarkasti vastaava ruoka ja valmistus, kelvollinen ihmismittaus | Tutkimus, testiruoka, valmistus, viiteasteikko ja mittausmenetelmän laatu   |
| Lähivastine     | Sama raaka-aine ja valmistuksen pääluokka, perusteltu lähivastine             | Soveltuvuuden perustelu ja ne erot, joita lähde ei kata                     |
| Valmistettu osa | Valmistetun komponentin vastaava mittaus, kuten ohut lettu tai puuro          | Tarkka komponenttiraja sekä siihen kuuluvat hiilihydraatit                  |
| Usea havainto   | Useita saman rajatun ruoan kelvollisia mittauksia                             | Tutkimuskohtaiset havainnot, yhdistämisperuste ja vaihtoehtoiset skenaariot |
| Koodiarvo       | Julkaistu tai erikseen hyväksytty laskentakoodi                               | Koodauksen alkuperä, käyttötarkoitus, soveltamisala ja vaikutus annokseen   |
| Skenaariot      | Tiettyjen vaihtoehtojen lähteistetyt skenaariot                               | Esimerkiksi valmistus- tai tuotevalinnat erillisinä kokonaisuuksina         |
| Avoin vaikutus  | Olennainen vaikutus jää määrittämättä                                         | Osatulos ja yksi täsmällinen tarkennus- tai tutkimustehtävä                 |

Koodattu GI on laskennan parametri. Se ei muutu mitatuksi arvoksi sillä, että se julkaistaan luotettavassa tutkimuksessa tai hyväksytään projektin sisällä. Myös ihmisillä mitattu arvo tarvitsee menetelmäluokituksen: vanha pieni koe, väärä vertailuannos tai poikkeava näytteenotto eivät vastaa automaattisesti standardoitua mittausta.

## Peruna ja valmistustavan tarkkuus

Keitettyä perunaa koskeva soveltuva tutkimus voi olla perusteltu vastine toiselle keitetylle perunalle. Tarkistettavia tekijöitä ovat esimerkiksi lajike, muussaaminen, kuumana tai jäähdytettynä tarjoilu ja merkittävä prosessointi. Jokainen puuttuva keittiödetalji ei tarvitse itsenäistä estoa. Esimerkiksi kuutioinnin ajankohdan pitäisi estää käyttö vain, jos sillä on tässä sovelluksessa olennaista näyttöön perustuvaa merkitystä.

Jauhaminen, ekstrudointi, fermentointi ja kokonaisen jyvän rakenteen rikkoutuminen voivat sen sijaan muuttaa hiilihydraatin käytettävyyttä. ”Sama vilja” tai ”sama kasvi” ei yksin riitä vastineeksi. Valmiin leivonnaisen GI ei ole raakan mantelijauhon GI. Jäähdytykselle ei pidä antaa kaikille ruoille samaa vähennysprosenttia. \[S2–S3\]

## Avokado ja muut vähän hiilihydraattia sisältävät ainekset

Sydneyn GI-tutkimusryhmä toteaa, ettei monille vähän hiilihydraattia sisältäville ruoille, kuten avokadolle, ole mielekästä määrittää tavallista mitattua GI:tä. Tämä selittää osan tietokantapuutteista. ISO-menetelmän soveltuvuusehdot koskevat riittävää glykeemistä hiilihydraattimäärää. \[S1, S10\]

Laskentajärjestelmän pitää erottaa kolme tapausta. Varmennettu nolla tarkoittaa, ettei kyseinen hiilihydraattiosuus tuota GK-termiä. Pieni mutta positiivinen hiilihydraattimäärä voidaan käsitellä perustellulla koodilla tai nimetyllä skenaariolla. Tuntematon koostumus säilyy tuntemattomana. Pelkkä GI:n puuttuminen ei oikeuta muuttamaan hiilihydraatteja tai GK-vaikutusta nollaksi. \[S11\]

Pienten ainesten vaikutukset lasketaan yhteen. Viiden erikseen vähäisen kastike- tai mausterivin yhteisvaikutus voi olla olennainen. Vastaavasti sadan prosentin koodiosuus hyvin vähähiilihydraattisessa annoksessa ei yksin merkitse suurta absoluuttista epävarmuutta.

# 4 Hiilihydraattitietojen yhteinen merkitys

Laskentaan ei pidä ottaa eri lähteiden samannimisiä hiilihydraattikenttiä sellaisinaan. Niiden sisältö eroaa. FAO erottaa lisäksi hiilihydraattien summamäärityksen ja erotuslaskennan sekä sakkaridien massan ja monosakkaridiekvivalentit. Alkuperäinen määritelmä tallennetaan lukuarvon rinnalle. \[S23\]

| **Lähde**                       | **Kentän merkitys**                                           | **Laskentasääntö**                                                                             |
|---------------------------------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Fineli CHOAVL                   | Tärkkelyksen ja sokereiden kokonaismäärä                      | Kuitua tai erikseen ilmoitettuja polyoleja ei vähennetä tästä uudelleen. \[S19\]               |
| USDA carbohydrate by difference | Erotuslaskenta sisältää ravintokuidun                         | Kuitu vähennetään kerran. Polyolien sisältyminen ratkaistaan erikseen. \[S20\]                 |
| EU-pakkauksen hiilihydraatit    | Sisältää polyolit; ravintokuitu on eri ravintotekijä          | Tavalliset hiilihydraatit ja polyolit erotetaan tarvittaessa saman tuotteen tiedoista. \[S21\] |
| AFCD without sugar alcohols     | Lähteen hiilihydraattimäärä ilman sokerialkoholeja            | Jo pois rajattua osuutta ei vähennetä uudelleen. \[S22\]                                       |
| AFCD with sugar alcohols        | Dokumentoitu summa lisää sorbitolin, mannitolin ja glyserolin | Kenttien erotus ei ole yleinen kokonaispolyolien mittari. \[S22\]                              |

USDA huomauttaa, että erikseen analysoitujen sokerien, tärkkelyksen ja kuidun summa voi poiketa erotuksena lasketusta hiilihydraatista. Siksi tuntematonta polyolimäärää tai muuta ainesosaa ei voi aina päätellä kahden kentän erotuksesta. AFCD:n kentän nimestä ei puolestaan seuraa, että sen summassa olisivat kaikki mahdolliset makeutuspolyolit. \[S20, S22\]

**Havainnollistava esimerkki.** Oletetaan annokseen 20 g sokereita ja tärkkelystä sekä 10 g kuitua. Ilman kuitua ilmoitettu lähde antaa 20 g ja kuitua sisältävä 30 g. Kun yhteensopiva GI on 50, oikea GK on kummallakin lähdereitillä 10. Uusi kuituvähennys jo kuiduttomasta 20 grammasta antaisi virheellisesti GK:n 5. Esimerkin luvut ovat laskentasäännön havainnollistus.

## Nykyisestä koodista löytynyt harmonisointikohde

Funktio normalizeCarbohydrate palauttaa EU_TOTAL_INCLUDING_POLYOLS-reitillä available-arvon, josta polyolit on vähennetty. US_TOTAL_INCLUDING_FIBRE-reitillä available-arvosta on vähennetty kuitu, mutta varmennetut polyolit vähennetään vasta erilliseen net-arvoon. GK-moottori käyttää available-arvoa. Kentän polyolimerkitys ei siis ole sama kaikilla lähdereiteillä. \[R1, R12\]

Tämä on varmennettu rajapinnan merkitysero. Päärekisterin rajatussa haussa ei löytynyt US_TOTAL_INCLUDING_FIBRE-tietueita, joten tämän perusteella ei osoitettu julkaistun GK-luvun virhettä. Korjaus on määritellä yhteinen hiilihydraattipohja ja sen lähdekohtaiset muunnokset. Pelkkä available-kentän vaihtaminen net-kentäksi voisi tehdä uuden virheen, jos polyolin oma vaikutus tai GI-testin hiilihydraattiperusta jää huomioimatta.

# 5 Polyolit ja makeutetut tuotteet

Polyolituotteelle tarvitaan kaksi erillistä laskentareittiä. Jos käytössä on juuri vastaavalle tuotteelle mitattu GI, annoksen hiilihydraattimäärä sovitetaan tutkimuksen hiilihydraattiperustaan. Saman tuotteen polyolivaikutusta ei tämän päälle lisätä uudelleen. Jos arvio rakennetaan ainesosista, tavalliset hiilihydraatit ja tunnistetut polyolit käsitellään erillisinä, lähteistettävinä osuuksina. Tämä on laskentamallia koskeva johtopäätös GI:n annosnormalisoinnista. \[S1–S3\]

Kaikkia polyoleja ei merkitä automaattisesti nollaksi. Tiedossa oleva polyolilaji, määrä ja soveltuva glykeeminen näyttö ratkaisevat käsittelyn. Tuntemattoman polyoliseoksen koostumusta ei keksitä. Myöskään energialaskennan kerroin ei ole GI-kerroin: EU:n polyoleille käyttämä 2,4 kcal/g ja erytritolille 0 kcal/g eivät muodosta sääntöä, jolla polyoligrammoista otettaisiin automaattisesti 60 prosenttia GK-laskentaan. \[S21\]

Konkreettinen alkuperäistutkimus on Prattin 30 osallistujan vaihtovuorokoe, jossa verrattiin 50 g maltitolia ja 50 g glukoosia sisältäviä juomia. Maltitolin suhteellinen glukoosivaste oli tutkimusryhmissä 23,1–33,5 prosenttia. Tämä riittää osoittamaan, ettei kaikkien polyolien automaattinen nollaus ole perusteltu. Luvuista ei kuitenkaan muodosteta kaikille maltitolisuklaille yhteistä GI-väliä. \[S30\]

Suklaata tai muuta makeutettua valmistetta varten tallennetaan tuotteen nimi, etikettiversio, tavalliset hiilihydraatit, polyolit lajeittain siltä osin kuin tiedot tunnetaan sekä valmistetun tuotteen GI:n soveltuvuus. Jos käyttökelpoisia vaihtoehtoja on kaksi, ne lasketaan erillisinä skenaarioina. Tuotteen nimi tai kuva kannattaa pyytää käyttäjältä silloin, kun valinta voi muuttaa tulosta olennaisesti.

Koostumustiedon puute voi koskea eri tuloksia eri tavoin. Valmiiksi ilman polyoleja ilmoitettu sokeri- ja tärkkelysmäärä voi olla käyttökelpoinen, vaikka kokonaispolyolitietoa ei ole. Tällöin tunnettu osuus säilytetään ja mahdollinen muu vaikutus arvioidaan erikseen; koko tuotteen täydellisyyttä ei päätellä yhden kentän kelvollisuudesta.

# 6 Painot annokset ja valmistushävikki

Koostumustietue ja punnitus sovitetaan yhteen ennen GI:n valintaa. Kuiva riisi, keitetty riisi ja riisipuuro ovat eri painoperustoja. Myös kuorellinen, syötävä ja valutettu paino on erotettava. FAO:n reseptilaskentaohjeet käyttävät tarvittaessa kypsennyksen saanto- ja ravintoaineiden säilymiskertoimia. \[S12\]

Veden lisääminen ei itsessään lisää koko reseptin hiilihydraatteja. Jos koko valmis ruoka syödään neljänä yhtä suurena annoksena, veden määrä ei muuta hiilihydraattia annosta kohti. Sadan gramman arvo muuttuu, koska valmis kokonaispaino muuttuu. Keitinveteen tai pois valutettavaan liemeen siirtyvä aines on eri kysymys: syödystä määrästä tarvitaan oma oletus.

Laskenta kannattaa toteuttaa kahdella selvästi erotetulla tavalla. Raaka-ainereitissä käytetään syötävien raaka-aineiden määriä ja dokumentoidaan mahdollinen poistuma. Kypsäreitissä käytetään kypsää punnittua määrää ja sitä vastaavaa koostumustietuetta. Molempien reittien vesi- tai saantokorjausta ei sovelleta samaan ainesosaan kahdesti.

**Havainnollistava laskuesimerkki.** Oletetaan 100 g kuivaa riisiä, jossa on 78 g laskennan hiilihydraattia, ja valmiin riisin painoksi 300 g. Jos hiilihydraattia ei poistu, koko erässä on edelleen 78 g. Keitetyn riisin pitoisuus olisi tässä oletuksessa 26 g/100 g. Kolmessa annoksessa on 26 g/annos riippumatta lisätyn veden määrästä. Nämä ovat esimerkkilukuja, eivät uusi tietokantasuositus millekään riisituotteelle.

Kastikkeesta ja marinadista ilmoitetaan, lasketaanko kaikki mukaan vai vain tarjottu osa. Suodatetun liemen hiilihydraattia ei voi päätellä suoraan poistettujen kasvisten märkäpainosta. Kun sekä kasvikset että liemi syödään, siirtymää ei lisätä toiseen kertaan. Samoin annoslaskennassa pitää erottaa reseptin skaalaaminen ja syödyn annoksen suurentaminen.

Reseptitekstiin kannattaa ehdottaa esimerkiksi ”500 g keitettyä ja valutettua perunaa”, ”50 g tuoretta pinaattia” ja ”200 g avokadon syötävää hedelmälihaa”. Vaihtoehto ”maitoa tai kermaa” voidaan säilyttää, kun sen molemmille valinnoille on omat koostumustiedot ja laskentatulokset. Käyttäjälle näytetään, mikä vaihtoehto on valittuna.

# 7 Puuttuvan tiedon vaikutus ja julkaisukelpoinen tulos

Suosittelen neljää tulostilaa: pistearvio, lähteistetty skenaarioväli, tunnettu osuus ja tarkennusta tarvitseva tulos. Tekninen laskenta voi valmistua myös silloin, kun yksi tarkka koko annoksen piste ei ole perusteltu. Tällöin käyttöliittymän pitää kertoa, mitä luku koskee.

| **Tila**              | **Milloin käytetään**                                     | **Lukijalle näkyvä sisältö**                                                 |
|-----------------------|-----------------------------------------------------------|------------------------------------------------------------------------------|
| Pistearvio            | Valitut lähtötiedot ja sovellukset ovat perusteltuja      | Esimerkiksi ”GK-arvio noin 12 annosta kohti” sekä laskennan oletukset        |
| Skenaarioväli         | Useita perusteltuja tuote-, valmistus- tai määrävalintoja | Esimerkiksi ”GK-arvio 10–14 annosta kohti”; mistä väli syntyy                |
| Tunnettu osuus        | Osa vaikutuksesta puuttuu                                 | ”Laskettu osuus 0,1; koko annoksen GK puuttuu” ja avoimen aineksen nimi      |
| Tarkennusta tarvitaan | Olennainen määrä tai tuotetyyppi ei ole rajattavissa      | Yksi käytännön kysymys, kuten ”Onko 200 g riisiä kuivapaino vai kypsäpaino?” |

## Herkkyys on laskettavissa

GI-oletuksen muutos vaikuttaa GK:hon suoraan hiilihydraattimäärän kautta. Kun ainesosan hiilihydraatti on annoskohtainen, vaikutus on C<sub>i</sub> kertaa GI-muutos jaettuna sadalla. Tämä antaa käyttökelpoisen tavan järjestää selvitystyö.

**Havainnollistavat esimerkit.** Jos riisi tuo annokseen 30 g hiilihydraattia, GI:n kymmenen yksikön ero muuttaa GK:ta 3 yksikköä. Jos toinen aines tuo 0,8 g, GI:n 50 yksikön ero muuttaa GK:ta 0,4 yksikköä. Ensimmäisen aineksen tarkentaminen voi siksi olla hyödyllisempää, vaikka toisen GI tunnetaan heikommin. Näissä luvuissa ei ole oletusta todellisesta verensokerivasteesta.

Mixed Evidence -reitin nykyinen 0,50 g:n poisjättöraja vastaa GI 100 -stressissä 0,50 GK:ta. Se ja 10 prosentin suhteellinen raja koskevat poisjätön lisäseulaa, eivät koko laskelman virherajaa tai kaikkia muita laskentareittejä. Ne voivat toimia väliaikaisina toimituksellisina pistearvion seulontarajoina. Suosittelen kuitenkin, että niiden ylitys ohjaa harkitsemaan paremmin perusteltua sidosta tai skenaarioväliä. Raja ei saa olla ainoa peruste päätellä koko resepti mahdottomaksi. Nykyisten julkaistujen pisteiden arvoja ei muuteta pelkän uuden säännön käyttöönotolla ilman vertailua.

Prosentti tarvitsee rinnalleen absoluuttisen vaikutuksen. Esimerkin osapiste 0,30 ja lisäys 0,05 merkitsevät 16,7 prosentin muutosta osapisteeseen. Osuus uudesta 0,35 summasta on 14,3 prosenttia. Molemmat ovat oikein laskettuja, mutta ne kuvaavat eri asiaa. Rajan nimittäjä on määriteltävä yksiselitteisesti. Nollapisteellä suhteellista muutosta ei lasketa jakamalla nollalla.

## Kolme erilaista väliä

**Lähtötietojen skenaarioväli** kuvaa lähteistettyjä vaihtoehtoja: eri perunan koostumuksia, tuotemerkkejä, annoskokoja tai valmistustapoja. Skenaarioiden pitää olla sisäisesti mahdollisia. Kuivan ja keitetyn riisin tietoja ei yhdistetä toisiinsa riippumattomina ääripäinä.

**Stressiskenaario** kertoo oletuksen vaikutuksesta. Projektin GI 0, 100 ja 150 -kokeet ovat tällaisia. Ne eivät yksin määritä biologista ylärajaa, todennäköistä vaihteluväliä tai 95 prosentin luottamusväliä. GI 100 on viitetaso, eikä kaikkien elintarvikkeiden absoluuttinen enimmäisarvo. \[R3, S8\]

**Tilastollinen luottamusväli** tarvitsee tilastollisen mallin ja havaintoaineiston. Yhden tutkimuksen keskiarvon SEM ei kata tuotemerkkien, valmistuksen, annoksen ja yksilöllisten vasteiden koko vaihtelua. Monte Carlo -laskenta ei ratkaise tätä, jos syötteiden jakaumat on vain arvattu. Ensimmäiseen toteutukseen suosittelen nimettyjä skenaarioita. \[S6\]

# 8 Ratkaisut todellisiin reseptitapauksiin

## Masala dosa

Perunaongelma on jo ratkaistu hyväksytyssä täsmäversiossa. Nykyinen laskentapaketti käyttää neljälle annokselle 500 g keitettyä valutettua perunaa, GI-vastinetta 66 ja kahta koostumusta, 13,0 sekä 19,9 g hiilihydraattia/100 g. Koko version laskettu väli on 57,8025–63,495. Se kuvaa valittuja koostumusskenaarioita, eikä sisällä kaikkea GI-vaihtelua. Mausteiden 0,45475 g hiilihydraattia/annos jää erikseen ilmoitetusti pois. \[R4, R6\]

Perunan osuus on alaskenaariossa 10,725 ja yläskenaariossa 16,4175 GK/annos. Erotus on 5,6925. Tämä on laskettu uudelleen paketin syötteistä. Kyseessä on merkittävä vaikutus, jonka näkyvä skenaariokäsittely on hyödyllinen ratkaisu.

Toteutusohje on säilyttää nykyinen valmistusrajaus ja tehdä perunasidoksesta uudelleenkäytettävä. Vanhaa TRS-uradiin perustunutta 58,94–64,64 laskelmaa ei pidä palauttaa: nykyinen paketti korvaa sen IFCT B003:n koostumuksella. Dosa-taikinan GI kohdistetaan taikinaan vain kerran. Tarjottavat chutney ja sambar tarvitsevat omat määrät, jos ne halutaan koko aterian tulokseen.

## Uunimuna avokadot

Punnittu versio on jo laskettavissa. Siinä on muun muassa 200 g avokadon hedelmälihaa ja 200 g kuoretonta kananmunaa kahdelle. Tallennettu hiilihydraattimäärä on 1,23205 g/annos ja malliarvio 0,61347 GK/annos. Avokadon GI 50 on laskentakoodi. Koko tuloksen koodiosuus ei tee tästä mitattua avokadon GI:tä. \[R7\]

Valmistusohje kuitenkin kehottaa käyttämään vain kuoppaan mahtuvan valkuaisen ja samanaikaisesti syömään kaikki punnitut ainekset. Suosittelen seuraavaa korvaavaa ohjetta: ”Jaa punnittu kananmuna avokadonpuolikkaisiin. Kypsennä kuoppiin mahtumaton muna ja koverrettu avokadonliha pienessä uunivuoassa. Tarjoa kaikki punnitut ainekset ja jaa ne kahteen annokseen.” Vaihtoehtona on punnita vain tosiasiallisesti käytetty määrä ja laskea tulos siitä.

Ratkaisu on ohjetekstin, syödyn määrän ja laskennan sovittaminen yhteen. Avokadon GI-tutkimuksen etsiminen uudelleen jokaiselle reseptille ei ratkaise tätä sisältöristiriitaa.

## Vesipohjainen okayu

Hyväksytyn version laskelma on 36,7676 GK/annos. Koodit muodostavat 0,2301 GK eli noin 0,63 prosenttia pisteestä, eikä hiilihydraatteja ole jätetty pois. Tämä osoittaa käytännössä, miksi mitatun GI:n ja koodien yhdistäminen voi olla järkevää. Olennaista on koodien pieni vaikutus ja riisipuuron soveltuva valmistusvastine. \[R3–R4\]

PR 253 poistaa tämän tapauksen tarpeettoman teknisen esteen, jossa Mixed Evidence mainissa vaatii positiivista poisjättöä. Julkaistu okayu on menetelmän vertailutapaus, eikä sen uusi tarkistus lisää kattavuutta.

## Lontong sayur

Nykyisessä koepaketissa kookosmaito tuo 3,40 g, kaali 4,97 g ja liemi 0,70 g avointa hiilihydraattia annosta kohti. Yhteensä 9,07 g on liian suuri osuus kuitattavaksi pienenä maustepuutteena. Kiinteä 14,512 GK:n osasumma sisältää riisin ja ehdollisen tofukoodin. Jos vain avoimeen 9,07 grammaan sovelletaan GI 100 -stressiä, lisäys on 9,07 GK. Tämä on laskennallinen herkkyys, ei uusi hyväksytty tulos. \[R3\]

Kookosmaidolle pitää ratkaista nimetyn tuotteen soveltuva koodaus tai lähivastine. Kookosmaitoa sisältävän riisipuuron GI 31 kuuluu tutkimuksen puurolle, ei yksin kookosmaidolle. Kaalille tarvitaan kypsän ruoan sovellus ja yhtenäinen massatase. Kun kaali ja liemi syödään, liemeen siirtyneet hiilihydraatit eivät tule lisäykseksi jo lasketun kaalin päälle. \[S13\]

Käytännön etenemisjärjestys on kookosmaito, kaali ja liemi. Liemen 0,70 g ei yksin saisi peittää kahta suurempaa puutetta. Liemen voi saada mukaan todellisen tuotteen hiilihydraatti- ja ainesosatietoon sopivalla perustellulla mallilla; vaihtoehtoisesti reseptille voi ehdottaa nimettyä toista lientä tai vesiversiota. Nämä ovat näkyviä sisältövalintoja, joille lasketaan omat tulokset.

## Ojja ja muut suuren vaikutuksen vastineet

Ojjan arkistolaskelman piste on 12,4821625. Harissan poisjättö on vain 0,0825 g hiilihydraattia/annos, mutta leivän fermentoinnin ja jauhojen vastaavuus sekä haudutetun kastikkeen koodit ovat avoinna. Koodien ja poisjätön yhteinen GI 100 -stressi muuttaa pistettä 35,81 prosenttia. Selvitystyö kannattaa kohdistaa leipään ja kastikkeeseen. \[R3\]

Samassa jonossa bammyyn liittyy kostutetun ja pannulla paistetun kassavaleivän vastaavuus, dal makhaniin uradin valmistus ja roujiamoon kohotetun pannuleivän vastaavuus. Näitä ei ratkaista ainoastaan muuttamalla 0,50 GK:n rajaa. Toimiva ratkaisu on rajata valmistusluokka, valita sen tutkimukset ja tarvittaessa tuottaa nimetyt skenaariot.

Marjaisessa chiavanukkaassa pieni absoluuttinen puute muodostaa suuren prosenttiosuuden, koska koko piste on pieni. Sen tarkastelussa tarvitaan molemmat mittarit. Pelkkä suuri suhteellinen luku ei kerro, onko käyttäjän ruokavalinta epävarma, mutta tuntematon osuus pitää silti ilmoittaa.

## Besan chilla ja pinaatti paneer chilla

Nykyiset hyväksytyt versiot ovat 9,4698–11,1288 ja 9,1305–10,7895 GK/annos. Näyttövälit ovat 9–12 ja 9–11. Vanhoja yksittäisiä pisteitä 9,47 ja 8,92 ei pidä käyttää nykytilan yleiskuvauksena. Pinaattiversion 50 g pinaattia sekä määritellyt chutney ja sitruuna ratkaisevat todellisia määräpuutteita. \[R9\]

Batra 1994 tutki valmiita fermentoituja ja fermentoimattomia palkokasvilettuja. Alkuperäisen artikkelin tiivistelmä vahvistaa 15 tervettä 18–23-vuotiasta naista, jauhetut kokonaiset palkokasvit, glukoosireferenssin ja neljä näytteenottohetkeä. Tämä on ihmismittaus, jonka menetelmä poikkeaa nykyisestä standardista. \[S27\]

Projektin lähdetietueessa kikherneletun arvoksi on tallennettu 42. Tietue kirjaa myös testihiilihydraatin 54,8 g ja glukoosireferenssin 50 g sekä merkitsee saman hiilihydraattiannoksen vahvistamatta jääneeksi. Tutkimuksen tiivistelmä puolestaan kuvaa annokset samahiilihydraattisiksi. Alkuperäinen PDF ei avautunut tässä tutkimuksessa, joten taulukon annoseroa ei riippumattomasti varmennettu. Ero säilytetään dokumentoituna menetelmärajoitteena; siitä ei lasketa omaa korjattua GI:tä. \[R9, S27\]

Suosittelen säilyttämään valmistetun komponentin ja jauhon raaka-aineen erottelun sekä matalan varmuuden esityksen. Kuorimattoman kokonaisen kikherneen jauhosta tehty ohut lettu ei anna yleistä GI:tä kaikelle besanille, mungille tai uunissa paistettaville jauhoseoksille. Pinaatin täsmennys voidaan ehdottaa myös varsinaiseen reseptitekstiin.

## Ketomutakakku

Nykyinen 0,07 on laskettu osuus. Sen ulkopuolella on 1,3774 g hiilihydraattia annosta kohti. Käyttöliittymän ilmaisu ”laskettu osuus alle 1” säilyttää tämän eron. Kokonaiskattavuudessa tällainen tulos pitäisi erottaa koko annoksen arviosta. \[R8\]

Ratkaisujärjestys on nimetyn suklaan tuoteversio ja etiketti, käytetyn makeutuksen ja polyolien määrät, niiden laskentaperuste sekä muun kakun samaan hiilihydraattimääritelmään normalisoitu koostumus. ”Sokeriton suklaa” ei yksilöi laskentasyötettä. Jos kaksi tuotetta ovat vaihtoehtoja, kummallekin muodostetaan oma skenaario. Pois jätettyä määrää ei nollata pelkän pienen osasumman vuoksi.

# 9 Vaihtoehtoiset laskentamallit ja tekoäly

Ravintoaineisiin perustuvia GI- ja GK-ennustemalleja on julkaistu. Rytzin ryhmän mallin tarkkuutta kuvattiin 42 aamiaismurolla, ja Leen ryhmä kehitti valmisaterioiden GK-mallin 70 aterian aineistosta. Tämä on hyödyllistä kehitysnäyttöä, mutta se ei osoita mallien kattavan samalla tarkkuudella kaikki pohjoismaiset ruoat, thai-ateriat tai erittäin vähähiilihydraattiset leivonnaiset. \[S14–S15\]

Esimerkiksi Leen mallissa on vakio 19,27. Jos kaikki makrosyötteet asetettaisiin nollaksi, kaava antaisi edelleen tämän luvun. Tämä oma matemaattinen huomio havainnollistaa, miksi aineistoon sovitettua regressiota ei voi siirtää rajatta nollahiilihydraattisiin ruokiin. Malli ei ole GK:n määritelmä. Näitä menetelmiä voi myöhemmin verrata mitattuihin aterioihin erillisenä kehitystyönä.

GI-kohdistamisen automatisointi on silti realistinen tavoite. Vuoden 2024 yhdysvaltalaisessa tietokantatyössä katettiin 99,9 prosenttia aineiston hiilihydraattisaannista tekoälyavusteisella ja käsin tarkistetulla kohdistuksella. Tämä ei tarkoita, että kaikkien kohdistettujen ruokien GI olisi mitattu. \[S16\]

Vuoden 2026 esijulkaisu osoittaa kielimallin mahdollisuuksia, mutta vertailukohtana olivat asiantuntijoiden kohdistukset. Molemmissa menetelmissä positiivisen GI:n saaneista ruoista 73,7 prosenttia osui kymmenen GI-yksikön sisään. Kolmen ajon tarkka yhtäpitävyys oli 53,6 prosenttia. Lähde on esijulkaisu. Sen 73,7 prosentin osumatarkkuutta ei pidä verrata suoraan aiemman työn 31,3 prosentin säilytettyjen kohdistusten osuuteen, koska mittarit ovat erilaiset. \[S17\]

Suositukseni on käyttää kielimallia reseptitekstin tulkintaan, nimien yhdistämiseen ja lähde-ehdokkaiden löytämiseen. Varsinainen summa, yksikkömuunnokset ja päätössäännöt toteutetaan deterministisenä koodina. Hyväksyttyä raaka-ainesidosta ei kysytä kielimallilta uudelleen jokaisessa laskussa. Tuore ehdotus tallennetaan lähteineen erillään hyväksytystä tiedosta.

# 10 Recipavon automaattinen laskenta

Recipavon ensimmäinen versio kannattaa rakentaa olemassa olevien GI Knowledge Base- ja New Recipe Pipeline -suunnitelmien päälle. PR 242 erottaa lähteen, havainnon ja soveltuvuuden. PR 241 kuvaa reseptin automaattisen arvioinnin. Tutkimuksen tulokset täydentävät niiden hyväksymissääntöjä. \[R10–R11\]

Suosittelen seuraavaa käsittelyjärjestystä. Ensin säilytetään käyttäjän alkuperäinen teksti ja poimitaan ainekset, määrät, annokset ja valmistaminen. Sen jälkeen tunnistetaan kanoniset raaka-aineet ja sovitetaan painoperusta. Hyväksytystä rekisteristä haetaan koostumus ja GI-sovellus. Laskenta muodostaa pisteen tai skenaariot. Avoimet kohdat järjestetään sen mukaan, kuinka paljon niiden tarkentaminen voi muuttaa tulosta.

Käyttäjältä kysytään kerrallaan tärkein ratkaiseva asia. ”Kuivapaino vai kypsäpaino?” on riisin kohdalla hyödyllinen kysymys. Nimetyn suklaan kuva tai etiketti voi ratkaista ketoleivonnaisen. Vähäisen yrtin tarkkaa lajiketta ei kysytä automaattisesti ennen näitä. Jos oletus on lähteistetty ja vaikutukseltaan pieni, se voidaan näyttää muokattavana oletuksena.

Henkilökohtainen resepti voi päivittyä automaattisesti jo hyväksyttyjen menetelmä- ja lähdesääntöjen puitteissa. Julkiseen reseptikokoelmaan nostaminen käyttää toimituksen nykyistä hyväksymismenettelyä. Käyttäjän henkilökohtainen ainesvalinta tai tekoälyn arvaus ei muuta yhteistä lähderekisteriä automaattisesti.

## Tarvittavat tietokentät

| **Tietoryhmä**  | **Vähimmäissisältö**                                                                                    |
|-----------------|---------------------------------------------------------------------------------------------------------|
| Reseptin versio | Alkuperäinen teksti, kanoninen rakenne, annokset, syötteiden tarkiste, menetelmäversio                  |
| Määrä           | Arvo, yksikkö, syötävä osuus, raaka tai kypsä, valutettu tai pakkauspaino, määrän alkuperä              |
| Koostumus       | Lähde, tietue ja versio, hiilihydraatin määritelmä, kuitu, polyolit, alkuperäiset arvot ja muunnos      |
| GI havainto     | Tutkimus ja testiruoka, viiteasteikko, annoksen hiilihydraattipohja, valmistus, mittausmenetelmän laatu |
| Sovellus        | Mitattu vastine tai koodaus, perustelu, rajattu käyttöalue, hyväksyntä ja lähteiden tarkisteet          |
| Tulos           | Piste, skenaariot, osatulos, avoin hiilihydraatti, näyttöluokka, tarkennustarpeet ja kattavuustyyppi    |

Tietueiden tunnisteet ovat kielestä riippumattomia. FI-, EN-, SV- ja TH-nimet ovat saman ainesosan nimivastineita. Käännöksen vaihtuminen ei saa muuttaa laskentaa. Valmistustavan tai tuotteen muuttuminen voi muuttaa soveltuvuutta, vaikka reseptin nimi säilyisi samana.

Saman tutkimuksen havaintoa ei lasketa useaksi riippumattomaksi tutkimukseksi sillä perusteella, että se löytyy alkuperäisartikkelista ja kahdesta koontitaulukosta. Samaan oletukseen perustuvat ainesosat eivät myöskään muodosta riippumattomia epävarmuuksia. Yhteinen tutkimus- ja havaintotunniste ratkaisee tämän tietomallissa.

# 11 Esitystapa ja suodatus

Reseptikortin tuloksen pitäisi vastata sitä ruokaa ja annosta, jonka käyttäjä näkee. Sopiva perusesitys on ”GK-arvio noin 12 / annos”. Kun perustellut vaihtoehdot eroavat olennaisesti, esitetään väli tai piste ja väli yhdessä. Lisätiedoissa näkyvät keskeiset oletukset ja suurimmat vaikutukset.

Yli yhden GK:n tuloksissa kokonaisluku on usein käyttökelpoinen esitystarkkuus. Alle yhden tuloksissa voi käyttää yhtä desimaalia tai ilmaisua ”alle 1”, jos koko laskettu arvio sitä tukee. Tämä on ehdotettu käyttöliittymäkäytäntö. Tallennettu laskentatarkkuus säilyy suurempana, jotta pyöristykset eivät kerry. Pienten lukujen kymmenystarkkuus ei ole väite fysiologisen ennusteen tarkkuudesta.

Alaraja pyöristetään tarvittaessa ulospäin alas ja yläraja ylös. Mahdollinen matalan GK:n suodatin perustetaan koko annoksen hyväksyttyyn tulokseen tai perustellun välin yläpäähän. Osasumma ei kelpaa koko annoksen matalan GK:n todisteeksi. Jos väli ylittää luokkarajan, reseptin luokitus merkitään vaihtelevaksi.

Yleisesti käytetyt rajat ovat matala enintään 10, keskitaso yli 10 ja alle 20 sekä korkea vähintään 20 annosta kohti. Nykykoodi luokittelee ensin lähimpään kokonaislukuun pyöristetyn arvon: esimerkiksi 10,4 on siinä matala ja 19,5 korkea. Suoraan jatkuvaan arvoon perustuva luokitus olisi siis nykyiseen nähden menetelmämuutos. Näyttöpyöristys ja luokittelu sovitaan samassa menetelmäversiossa. Näitä luokkia ei pidä esittää aterian koko terveellisyyden arvosanana. \[S18, R1\]

Kattavuusraportissa suosittelen neljää rinnakkaista mittaria: alkuperäinen resepti laskettavissa, vähintään yksi täsmäversio laskettavissa, koko annos ilman avointa positiivista vaikutusta sekä vain osatulos. Pistearviot ja skenaariovälit voidaan esittää lisäksi erikseen. Näin numeerinen edistyminen ei peitä sisällön tai täydellisyyden eroja.

# 12 Aineistojen käyttö Recipavossa

Koostumustiedot ja GI-tutkimusaineistot tarvitsevat lähdekohtaiset käyttöoikeustiedot. Pelkkä verkkosivun luettavuus tai tutkimuksen avoin tiivistelmä ei ratkaise kokonaisen taulukon kaupallista uudelleenjakelua.

| **Aineisto**                             | **Tarkistettu lähtökohta**                                                                                         | **Recipavon käytännön ratkaisu**                                                                        |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Fineli                                   | CC BY 4.0; lähdemerkintä THL, Fineli. \[S19\]                                                                      | Säilytä tietue, julkaisuversio, lisenssi ja lähdemerkintä.                                              |
| USDA FoodData Central                    | Public domain ja CC0; USDA pyytää lähdeviittausta. \[S24\]                                                         | Säilytä FDC-tunniste ja versio; toteuta lähdeviittaus.                                                  |
| AFCD                                     | CC BY-SA 3.0 Australiaan perustuva sopimus lisäehdoin. \[S25\]                                                     | Tarkista jaettavan muunnetun aineiston ehdot, attribuutio ja rajoituksia kuvaava lausuma.               |
| Sydneyn GI-aineistot ja tutkimustaulukot | Sisältökohtaiset oikeudet; verkkosivun lupa ei kata automaattisesti kaikkea kolmannen osapuolen aineistoa. \[S26\] | Tallenna viitteet ja rajatut havainnot; selvitä laajan tuonnin ja jakelun oikeudet aineistokohtaisesti. |

AFCD:n sopimus erottaa muuttamattoman aineiston sisältävän kokoelman aineistoa muokkaavasta johdannaisesta. Se ei merkitse automaattista kaupallisen käytön kieltoa tai koko sovelluskoodin avaamista. Todellisen tietokantatuotteen jakelutapa on arvioitava sopimusta vasten. Myös AFCD:n ja muiden FSANZ-aineistojen, kuten AUSNUTin, ehdot on pidettävä erillään. \[S25\]

Vuoden 2026 tekoälyä käsittelevä esijulkaisu kertoo GI-lähdetaulukoiden edelleenjakeluun liittyvistä rajoituksista. Artikkelin menetelmää voi tutkia ilman oletusta, että sen koko GI-tietokanta olisi vapaasti kopioitava Recipavoon. Oikeuksien ratkaisu tehdään yhteiselle aineistolle kerran ja tallennetaan lähderekisteriin, jolloin asiaa ei tarvitse aloittaa alusta jokaisella reseptillä. \[S17\]

# 13 Toteutusjärjestys Codexille

## Vaihe 1 Yhteinen hiilihydraattisopimus

Määrittele yksi yksiselitteinen laskentapohja sekä erilliset kuitu- ja polyolikentät. Säilytä lähteen alkuperäinen termi ja muunnos. Korjaa available-kentän lähdekohtainen monitulkintaisuus uuden sovittimen kautta. Älä tee yleistä available-kentän vaihtoa net-kenttään, koska GI:n hiilihydraattipohjan ja polyolien käsittelyn pitää sopia yhteen. Tämän vaiheen onnistuminen todetaan rinnakkaisilla EU-, US- ja AFCD-esimerkeillä.

## Vaihe 2 Yhteiset sidokset ja menetelmä

Täydennä PR 242:n rekisteri ja PR 241:n arviointiputki. Muodosta yhteinen vaikutuserittely, jossa suora ihmis-GI, analogia, julkaistu koodi, projektin koodi ja puuttuva osuus ovat rivien ominaisuuksia. Erota lähteen kelpuutus, soveltuvuuspäätös ja reseptin laskenta. Viimeistele PR 253:n nollapoisjättöinen Mixed Evidence -tapaus sen nykyisessä katselmointikehyksessä.

Menetelmään kirjataan täsmällisesti, mitkä tilanteet antavat pisteen, skenaarion tai osatuloksen. Nykyisten julkaistujen reseptien ja täsmäversioiden tuloksia verrataan uuteen moottoriin. Vain muutoksen vaikutusalueen poikkeamat selvitetään. Tavoitteena on yksi laskentapolitiikka, jonka rajaukset näkyvät tuloksessa.

## Vaihe 3 Reseptien konkreettiset korjaukset

Ensimmäiseksi korjataan uunimuna-avokadojen syödyn määrän ristiriita ja ehdotetaan pinaatti-paneer-chillan määrien yhdenmukaistamista hyväksytyn täsmäversion kanssa. Lontongin kolme avointa sidosta sekä ojjan leipä ja kastike käsitellään raaka-aineiden yhteisinä ratkaisutehtävinä. Valmiita peruna- ja avokadosidoksia käytetään jo ratkaistuina vertailuina.

Jäljellä olevat reseptit ryhmitellään yhteisen puutteen perusteella. Työjärjestys valitaan sen mukaan, kuinka moneen reseptiin sama korjaus vaikuttaa, kuinka suuri sen GK-vaikutus on ja kuinka helposti lähde voidaan saada. Aineskohtainen korjaus hyödyttää koko kokoelmaa ja Recipavon myöhempiä reseptejä.

## Vaihe 4 Henkilökohtaiset reseptit ja käyttöliittymä

Lisää Recipavoon sama laskentamoottori, näkyvät määräoletukset ja vaikutuksen mukaan järjestetyt tarkennuskysymykset. Tuloksen tallennus säilyttää reseptiversion ja menetelmäversion. Käyttäjälle näytetään, mikä muuttui uuden tuotevalinnan tai annoksen jälkeen. Julkisen kokoelman hyväksymisputki kytketään siihen vaiheeseen, jossa henkilökohtainen resepti todella julkaistaan yhteiseen kokoelmaan.

# 14 Kohdennettu varmennus

Varmennuksen tarkoitus on ratkaista tunnistetut riskit. Suosittelen yhtä rajattua vertailuaineistoa ja jo olemassa olevien testien laajentamista tarvittavilta osin. Uusi laaja testikehikko ei ole tämän tutkimuksen edellytys.

- EU- ja US-esimerkkien sama sokeri- ja tärkkelysmäärä tuottaa saman normalisoidun laskentapohjan.

- Finelin ja AFCD:n valmiiksi poissuljettua kuitua tai polyolia ei vähennetä uudelleen.

- Varmennettu nolla, pyöristetty nolla ja puuttuva arvo säilyvät eri tiloina.

- Sama hiilihydraatti kohdistetaan yhteen valmistettuun komponenttiin tai ainesosaan vain kerran.

- Ainesosarivin pilkkominen ei muuta kokonaisvaikutusta eikä kierrä kumulatiivista rajaa.

- Raaka- ja kypsäpainon muunnos ei lisää tai vähennä hiilihydraatteja pelkän veden vuoksi.

- Reseptimäärän ja annosmäärän yhtäaikainen skaalaaminen säilyttää annoskohtaisen tuloksen.

- Sama kanoninen resepti antaa saman tuloksen kaikissa neljässä kielessä.

- Osatulos ei läpäise koko annoksen matalan GK:n suodatinta.

- Skenaariovälin pyöristys ja luokkarajan ylitys näkyvät johdonmukaisesti.

- Tuntematon suuri osuus johtaa tarkennuskysymykseen eikä nollaimputointiin.

- Hyväksytyt nykyversiot muuttuvat vain nimettyjen syöte- tai menetelmämuutosten seurauksena.

Valmistumiskriteeri on konkreettinen: aiemmin ratkaistu raaka-aine ei käynnistä uutta lähdetutkimusta jokaisessa vastaavassa reseptissä, alkuperäinen ohje ja laskettu versio ovat tunnistettavissa, ja käyttäjä saa käyttökelpoisen tuloksen tai yhden perustellun tarkennuskysymyksen.

# Lähteet

Lähteet tarkistettu 4.11.2026. S-viitteet ovat tieteellisiä julkaisuja tai virallisia menetelmä- ja aineistolähteitä. R-viitteet osoittavat tarkastettuun projektiversioon. Raportin toimintamalli, priorisointi ja käyttöliittymäratkaisut ovat tutkimuksen pohjalta laadittuja suosituksia. Esimerkkiluvut on nimetty erikseen.

## Tieteelliset ja viralliset lähteet

\[S1\] ISO 26642:2010. Food products — Determination of the glycaemic index and recommendation for food classification. [<u>Standarditietue</u>](https://www.iso.org/standard/43633.html). Menetelmän määritelmistä käytettiin myös [<u>GSO:n julkaisemaa standardin esikatselua</u>](https://gso-sims-preview-doc-aws.s3-eu-west-1.amazonaws.com/iso-26642-2010-en.html).

\[S2\] FAO/WHO 1998. Carbohydrates in human nutrition, glykeemistä indeksiä käsittelevä osuus. [<u>FAO:n julkaisu</u>](https://www.fao.org/4/W8079E/w8079e0a.htm). Vanhan julkaisun taulukoiden vertailuasteikko tarkistetaan ennen lukujen käyttöä.

\[S3\] Atkinson FS, Foster-Powell K, Brand-Miller JC. 2008. International tables of glycemic index and glycemic load values. Diabetes Care. DOI 10.2337/dc08-1239. [<u>Koko artikkeli</u>](https://pmc.ncbi.nlm.nih.gov/articles/PMC2584181/).

\[S4\] Dodd H ym. 2011. Calculating meal glycemic index by using measured and published food values compared with directly measured meal glycemic index. DOI 10.3945/ajcn.111.012138. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/21831990/).

\[S5\] Chew I ym. 1988. Sekaruokien mitatun ja ennustetun glykeemisen indeksin vertailututkimus. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/3276136/).

\[S6\] Matthan NR ym. 2016. Ihmisten välisen ja saman henkilön mittausten välisen GI-vaihtelun tutkimus. [<u>Koko artikkeli</u>](https://pmc.ncbi.nlm.nih.gov/articles/PMC5039811/).

\[S7\] FAO/INFOODS. Guidelines for Food Matching, version 1.2. [<u>Menetelmäohje</u>](https://www.fao.org/fileadmin/templates/food_composition/documents/Nutrition_assessment/INFOODSGuidelinesforFoodMatching_version_1_2.pdf).

\[S8\] Aston LM ym. 2010. Diogenes-hankkeen menetelmä GI-arvojen kohdistamiseksi eurooppalaisiin elintarviketietokantoihin. DOI 10.1111/j.1467-789X.2009.00690.x. [<u>Julkaisu</u>](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1467-789x.2009.00690.x).

\[S9\] Louie JCY ym. 2015. Methodology for assigning appropriate glycaemic index values to an Australian food composition database. Journal of Food Composition and Analysis 38, 1–6. [<u>Alkuperäisartikkelin PDF-kopio</u>](https://www.nutritics.com/downloads/resources/Louie_GI%20assignment_2015.pdf).

\[S10\] University of Sydney, Glycemic Index Research. 2021. What do we mean by a low glycemic load diet. [<u>Tutkimusryhmän menetelmäselitys</u>](https://glycemicindex.com/2021/11/what-do-we-mean-by-a-low-glycemic-load-diet/).

\[S11\] FAO. Food composition data, puuttuvien arvojen ja nollien käsittely. [<u>Menetelmäjulkaisu</u>](https://www.fao.org/4/y4705e/y4705e14.htm).

\[S12\] FAO. Food composition data, reseptilaskennan ohjeistus. [<u>Reseptilaskennan liite</u>](https://www.fao.org/4/y4705e/y4705e23.htm).

\[S13\] Senadheera SPAS, Ekanayake S. 2013. Kookosmaitoa sisältävien riisipuurojen GI-tutkimus. DOI 10.3109/09637486.2012.710895. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/22849311/).

\[S14\] Rytz A ym. 2019. Makroravintoaineisiin perustuva GI- ja GK-ennustemalli. Nutrients 11, 1172. DOI 10.3390/nu11051172. [<u>Koko artikkeli</u>](https://pmc.ncbi.nlm.nih.gov/articles/PMC6566235/).

\[S15\] Lee J ym. 2021. Valmisaterioiden ravintoaineisiin perustuva GK-malli. Foods 10, 2626. DOI 10.3390/foods10112626. [<u>Koko artikkeli</u>](https://pmc.ncbi.nlm.nih.gov/articles/PMC8625555/).

\[S16\] Della Corte K ym. 2024. Yhdysvaltalaisen ravintoaineiston GI-kohdistus tekoälyn ja asiantuntijatarkistuksen avulla. DOI 10.1016/j.ajcnut.2024.06.001. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/38852855/).

\[S17\] Della Corte K ym. 2026. Kielimallilla tehtävän GI-kohdistuksen arviointi. medRxiv, esijulkaisu 1.5.2026, versio 1. Ei vertaisarvioitu. DOI 10.64898/2026.04.23.26351292. [<u>Esijulkaisu</u>](https://www.medrxiv.org/content/10.64898/2026.04.23.26351292v1.full.pdf).

\[S18\] Lee ym. 2022. Pikaruokien GK-mallin validointitutkimus; raportissa käytetty GK-luokkarajojen lähteenä. DOI 10.3389/fnut.2022.892403. [<u>Koko artikkeli</u>](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2022.892403/full). Tämä ei ole sama malli kuin S15.

\[S19\] THL. Finelin avoimen aineiston lukuohje, ravintotekijöiden määritelmät ja CC BY 4.0 -lisenssi. [<u>Virallinen aineistokuvaus</u>](https://fineli.fi/fineli/content/file/7).

\[S20\] USDA. Foundation Foods Documentation, hiilihydraatin erotuslaskenta ja ravintotekijöiden määritelmät. [<u>Virallinen dokumentaatio</u>](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/).

\[S21\] Euroopan parlamentin ja neuvoston asetus EU 1169/2011, liitteet I ja XIV. Hiilihydraatin, polyolien ja kuidun määritelmät sekä energiakertoimet. [<u>EUR-Lex</u>](https://eur-lex.europa.eu/eli/reg/2011/1169/oj/fin).

\[S22\] FSANZ. Australian Food Composition Database, hiilihydraattikenttien määritelmät. [<u>Available carbohydrate with sugar alcohols</u>](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/nutrients/AVAILCHOCNS). Kentän nimittäminen ei korvaa ainekohtaisen summan tarkistusta.

\[S23\] FAO. Food energy — methods of analysis and conversion factors, luku 2. [<u>Hiilihydraattien määritystavat</u>](https://www.fao.org/4/y5022e/y5022e03.htm).

\[S24\] USDA. FoodData Central API Guide, Licensing. [<u>CC0 ja käyttöehdot</u>](https://fdc.nal.usda.gov/api-guide/).

\[S25\] FSANZ. Australian Food Composition Database Data User Licence Agreement. [<u>Virallinen sopimus</u>](https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd/datauserlicenceagreement).

\[S26\] University of Sydney, Glycemic Index Research. 2025. Copyright and permission 101. [<u>Käyttöoikeuksia koskeva ohje</u>](https://glycemicindex.com/2025/05/copyright-and-permission-101/).

\[S27\] Batra M, Sharma S, Seth V. 1994. The glycaemic index of fermented and non-fermented legume-based snack food. Asia Pacific Journal of Clinical Nutrition 3, 151–154. [<u>Alkuperäistutkimuksen tiivistelmä</u>](https://pubmed.ncbi.nlm.nih.gov/24351324/). Artikkelin alkuperäinen PDF ei avautunut tässä tarkastuksessa; menetelmärajoitteen annosluvut perustuvat R9:n projektitietueeseen.

\[S28\] Ballance S ym. 2019. Predicting mixed-meal measured glycaemic index in healthy subjects. DOI 10.1007/s00394-018-1813-z. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/30218140/).

\[S29\] Atkinson FS ym. 2021. International tables of glycemic index and glycemic load values 2021: a systematic review. DOI 10.1093/ajcn/nqab233. [<u>Julkaisu</u>](https://doi.org/10.1093/ajcn/nqab233).

\[S30\] Pratt M ym. 2011. No observable differences in glycemic response to maltitol in human subjects from 3 ethnically diverse groups. DOI 10.1016/j.nutres.2011.02.002. [<u>PubMed</u>](https://pubmed.ncbi.nlm.nih.gov/21481716/).

## Projektiaineisto

\[R1\] Reseptit main b96ba0b. [<u>GK-perusmalli</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/site/scripts/glycemic-load-model.ts).

\[R2\] Reseptit main b96ba0b. [<u>Mixed Evidence -toteutus</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/site/scripts/gk100-mixed-evidence.ts).

\[R3\] Reseptit PR 253, luonnosversio 936ef6d. [<u>Mixed Evidence V1 -menetelmä ja tapausraportti</u>](https://github.com/ozirix-dev/Reseptit/blob/936ef6d8ed9af185b233db4b77afcab9e8fab705/docs/nutrition/gk100-mixed-evidence-v1.md). Ehdotuksia ei kuvata mainiin jo vietyinä muutoksina.

\[R4\] Reseptit main b96ba0b. [<u>Hyväksytty 18 version julkaisupaketti</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk100-approved-releases/eighteen.json).

\[R5\] Reseptit main b96ba0b. [<u>Kattavuusnäkymät ja versioiden lataus</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/site/scripts/glycemic-load-pilot.ts) ja [<u>versiotyypit</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/site/src/features/recipes/gk-only-types.ts).

\[R6\] Reseptit main b96ba0b. [<u>Masala dosa IFCT -laskentapaketti</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk100-masala-dosa-ifct-release-candidate.json). Julkaisuvaltuutus tarkistettu erillisestä R4:n paketista.

\[R7\] Reseptit main b96ba0b. [<u>Uunimuna-avokadojen ohje</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/reseptit/aamupalat/uunimuna-avokadot.md) ja [<u>hyväksytyn version laskelma</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk80-release-4/golden.json).

\[R8\] Reseptit main b96ba0b. [<u>Ketomutakakun laskenta- ja suklaaraportti</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/reports/2026-11-02-keto-mutakakku-chocolate-fi.md).

\[R9\] Reseptit main b96ba0b. [<u>Chillojen nykyinen hyväksytty laskenta</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk80-four-approved-b/README.md) ja [<u>koostumus- ja GI-lähteet</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/gk80-four-approved-b/gi-fallback/sources.json).

\[R10\] Reseptit PR 241, luonnosversio 8fd0800. [<u>New Recipe Pipeline -suunnitelma</u>](https://github.com/ozirix-dev/Reseptit/blob/8fd0800ed664f7f2c2c4a12b6f9b6914ef452dbc/docs/nutrition/gk100-new-recipe-pipeline-plan.md).

\[R11\] Reseptit PR 242, luonnosversio f37ebe1. [<u>GI Knowledge Base -suunnitelma</u>](https://github.com/ozirix-dev/Reseptit/blob/f37ebe1b4599f0bdff2c71a76d3e3c1780548547/docs/nutrition/gi-knowledge-base-v1-plan.md).

\[R12\] Reseptit main b96ba0b. [<u>Hiilihydraattien normalisointi</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/site/scripts/nutrition-model.ts), [<u>päärekisteri</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/food-records.json) ja [<u>menetelmädokumentaatio</u>](https://github.com/ozirix-dev/Reseptit/blob/b96ba0b0dfe8f859736f9db63be982021ca7a63d/docs/nutrition/README.md).
