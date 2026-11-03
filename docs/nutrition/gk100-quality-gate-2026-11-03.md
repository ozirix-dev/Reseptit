# GK100 · Laadunvarmistus ja hyväksyntäportti

Katselmoitu 3.11.2026. PR #230:n lukittu HEAD on `2b991589d4dfc2010f26ec16733a95eb9a7824fc` ja vertailupohja `4d6f19a620bb95e771c12f499554bf2cf1f06e51`. Paikallisen tuotantohaaran neljä myöhempää committia jäävät otoksen ulkopuolelle.

**HOLD.** Otoksen A+B on 5/15. Laskenta täsmää syötteisiin, mutta otoksessa on viisi sisältöpäätöstä ja viisi merkittävää estettä. Tulokset ohjaavat työtä eivätkä estimoi koko aineiston hyväksyntäastetta.

## Inventaario

| Ryhmä | Reseptiä | Peruste |
|---|---:|---|
| Julkaistu GK | 207 | 197 pistelukua ja 10 vaihteluväliä |
| Numeerinen katselmointiehdotus | 79 | 46 pistelukua ja 33 vaihteluväliä. Ensimmäinen erä 30, toinen 30, jatko 19 |
| Tutkimusaihio | 7 | Inventaarion PROPOSED-rivi ilman laskentapakettia tässä PR-versiossa |
| Keskeneräinen | 31 | Inventaarion IN_PROGRESS ilman laskentapakettia |
| GK puuttuu | 2 | Inventaarion NO_GK ilman laskentapakettia |
| Yhteensä | 326 | Kukin reseptitunniste kerran |

Seitsemän aihiota ovat jerk-kana, keto-kauralesesämpylät, kiinalainen kevätsipulipannukakku, bindaetteok, manakish, roti jala ja taatelipuuro. Esikatselun potentiaali on 286/326. Ensimmäisten kahden erän päätöstaulukossa on 12 nimenomaista sisältöpäätöstä. Se on vähimmäismäärä näissä erissä, koska myös muissa tiloissa on punnittuja täsmäversioita. Jatkojonosta esimerkiksi Yaki-onigiri ja Pofiber-pizza muuttavat määriä tai täytettä. Reseptimuutostarve on ehdokkaan ominaisuus eikä erillinen lisäys kokonaismäärään. [Päätöstaulukko](gk80-operation80-decisions.md) · [Inventaario](gk80-operation80-inventory.json)

## Riippumaton 15 reseptin otos

Pisteluvut ovat viisi ensimmäistä riviä, vaihteluvälit viisi seuraavaa, merkittävän epävarmuuden tapaukset kolme seuraavaa ja sisältömuutokset kaksi viimeistä. Kaikki tunnisteet ovat eri reseptejä. Otos kattaa molemmat alkuerät ja jatkojonon sekä runsashiilihydraattisen dosan ja VHH-ehdokkaita. Arvot ovat riippumattoman Decimal-uudelleenlaskennan tuloksia kahteen desimaaliin pyöristettyinä. Arvioitiin kunkin paketin alkuperäinen ohje, annos, koostumuksen ja GI:n sidokset, skenaario, poisjätöt ja nelikielisen tekstin rajaukset. A tarkoittaa valmisteluun kelpaavaa laskelmaa. Se ei ole julkaisuhyväksyntä.

| Resepti, erä | GK/annos | Päätös ja vaikutus | Löydös ja toimenpide |
|---|---:|---|---|
| Serabi, 1 | 40,22 | B · toistuva | Kaksi annosta ja ainesosamäärät täsmäävät. 83,31 g taikinan CHO:ta käyttää mitatun urad-riisidosan GI:tä 76. Serabin kookos muuttaa koostumusta. Nimeä analogia ja kookoseron vaikutuksen epävarmuus näkyvästi neljällä kielellä, ja pidä lisätty 30 g fariinisokeria erillisenä. [Laskelma](gk80-operation80-batch-28.md) |
| Nasi lemak, 1 | 43,86 | D · toistuva | Neljän annoksen punnittu erä laskee 265,845 g CHO:ta kerran. Old Chang Kee -aterian GI 66 sisältää paistetun kalan ja erilaisen lisukesuhteen. Kotikulhon kurkku, tamarindi, riisi ja rasvasuhteet eroavat. Tarvitaan koostumusvertailu ja MyFCD:n käyttöperuste ennen koko aterian GI:n siirtoa. [Laskelma](gk80-operation80-batch-06.md) |
| Jiaozi, 2 | 15,95 | A · toistuva | Neljä annosta, 300 g jauhoa ja 200 g kaalia ennen puristamista. Yangin liha–salottisipulinyytin GI 28 sovelletaan koko nyyttiin kerran. Kaalin täysi osuus on konservatiivinen ja dipistä jää 0,37875 g CHO/annos. Näytä analogiarajaus sekä lähteen käyttöperuste valmistelussa. [Laskelma](gk80-operation80-batch-35.md) |
| Xiaolongbao, 2 | 15,77 | D · toistuva | Neljän annoksen jauhot, liemihyytelö ja dippi on sidottu. Dipistä jää 0,462 g CHO/annos. Sama GI 28 -koe kuin jiaozissa. Tutkimus ei yksilöi höyrytystä tai liemitäytettä. Hongkongin koostumusmittaus ei vahvista GI:tä. Tarvitaan perustelu juuri höyrytetylle lieminyytille. [Laskelma](gk80-operation80-batch-36.md) |
| Margherita, jatko | 58,48 | B · yksittäinen | Kaksi annosta, 300 g kuivaa jauhoa ja 200 g tomaattimurskaa. Bobolin GI 52 antaa 57,71844 GK. Kotitaikinan tunnin kohotus ja 250 °C:n paisto eroavat. Yksilöi Sydneyn julkaisematon mittaus ja tomaattirivin GI-lähde käyttöperusteineen samassa paketissa. Pieni poisjättö 0,1369 g CHO/annos. [Ehdotus](gk80-operation80-pizza-margherita-release-candidate.json) |
| Bún chả, 1 | 31,25–45,94 | C · toistuva | Neljän annoksen 300 g kuivaa vermiselliä ja kahden eri tuotteen keitetyn nuudelin GI 37/61 tuottavat välin. Koko dippi ja marinadin täysi siirtymä on kirjattu. Hyväksy tarjoilu ja täysi siirtymä tai mittaa jäännös. [Laskelma](gk80-operation80-batch-24.md) |
| Chow mein, 1 | 11,92–12,18 | A · toistuva | 300 g kypsää valutettua nuudelia neljälle. Munafettuccinen ja keitetyn vehnänuudelin GI 47/48,2, lyhyen wokkaamisen rajaus näkyy. 12 g kevätsipulia sisältyy laskentaan. Osterikastikkeen 0,93 g CHO/annos jää pois vain punnitulla 12 g erällä. Pidä väli nimettyinä skenaarioina. [Laskelma](gk80-operation80-batch-25.md) |
| Dan dan, 1 | 18,53–24,98 | B · toistuva | Neljän annoksen 300 g tuoretta udonia tai kuivaa somenia lasketaan eri koostumuksilla ja GI:llä. Etikan 0,195 g CHO/annos on pieni. Valmisteluohjeessa erota vaihtoehdot painotiloineen ja ilmoita valinnaisen paksoin rajaus kaikilla kielillä. [Laskelma](gk80-operation80-batch-26.md) |
| Masala dosa, 2 | 58,94–64,64 | C · toistuva | Neljän annoksen kuivataikina käyttää kaupallisen riisi–urad-dosan GI:tä 76. Väli syntyy 500 g kypsän perunan 13/19,9 g CHO-pitoisuuksista, ei GI-epävarmuudesta. Hyväksy kypsäpunnitus, mausteiden 1,465 g/annos rajaus ja chutneyn sekä sambarin erillinen tarjoilu. [Laskelma](gk80-operation80-batch-39.md) |
| Mapo tofu, jatko | 33,56–36,72 | C · toistuva | Neljä annosta. Ehdotus sitoo alkuperäisen neljän kypsän riisiannoksen määräksi 200 g kuivaa riisiä ja tahnan 30 grammaan. Riisin GI 82/90 selittää välin. Pienosuuksia jää 1,57095 g CHO/annos. Hyväksy riisi, tahna ja tarjoilumäärä. [Laskelma](gk80-operation80-mapo-tofu.md) |
| Tom yum VHH, 1 | 0,98–1,85 | D · järjestelmätaso | Neljän annoksen sienivalinnat vaihtavat koostumusta. Kaikki positiiviset GI:t ovat koodeja. 1,90845 g/annos poisjättö ja alkuperäisen 40 g sitruunaruohon korvaaminen 8 grammalla vaikuttavat tulkintaan. Vaaditaan sisältöpäätös ja herkkyys, joka kattaa koko annoksen olennaiset osuudet. [Laskelma](gk80-operation80-batch-22.md) |
| Silakkapihvit, 2 | 0,58 | D · järjestelmätaso | Neljän annoksen kerman, voin ja tillin GI 50 on laskentakoodi. Ruisjauho, sitruuna ja pippuri tuottavat enintään 1,15586 g/annos poisjätettyä CHO:ta. Täyden annoksen pisteluvulle tarvitaan suhteutettu epävarmuus ja tarjoilusitruunan käsittely. [Laskelma](gk80-operation80-batch-44.md) |
| Pofiber-pizza, jatko | 0,42 | D · järjestelmätaso | Kahden annoksen laskettu GK tulee 75 g passatasta tomaattimurskan GI-verrokilla. 1,9625 g CHO/annos jää pois. Paprika vaihtuu herkkusieniin ja pohjan tuotteet lukitaan. Tarvitaan koko annoksen epävarmuusarvio sekä sieniversion sisältöpäätös. [Ehdotus](gk80-operation80-ketopizza-pofiber-pohjalla-release-candidate.json) |
| Yaki-onigiri, jatko | 10,78 | C · yksittäinen | Kahden annoksen 100 g kypsä sushiriisi antaa 28 g CHO:ta. Satoun GI 77 on muunnettu riisiviitteestä. Misoa ja noria vähennetään 150 grammasta 10 ja 2 grammaan. Poisjättö 0,90833 g/annos. Hyväksy kypsäpaino, uudet määrät ja paistoanalogia. [Ehdotus](gk80-operation80-yaki-onigiri-release-candidate.json) |
| Ackee ja suolakala, 1 | 1,35 | C · yksittäinen | Kahden annoksen 150 g kaupallinen valutettu säilyke ja 60 g kypsä suolaturska. Turskamäärä muuttuu olennaisesti. Turvallisen reseptiversion tarkiste täsmää. CoFIDin monosakkaridiekvivalentti ja kaikki GI-koodit vaativat päätöksen. Säilytä kaupallisen säilykkeen vaatimus. [Laskelma](gk80-operation80-batch-10.md) |

A **2/15** (13,3 %), B **3/15**, C **5/15** (33,3 %), D **5/15** (33,3 %). A+B **5/15** (33,3 %). Vaikutus kuvaa pääasiallista ongelmaa tai hyväksynnässä tarkistettavaa kysymystä. Luokkien päällekkäisissä tapauksissa D asetettiin ennen sisältöpäätöstä, jos aineisto ei vielä kanna koko annoksen arviota.

## Koko joukon kevyt eheystarkistus

Lukitussa versiossa `npm run content:sync` ja GK:n `--operation80-release-check` onnistuivat. Raportti palautti 207/326 tuotannon lähtöarvoksi ja 286/326 esikatseluksi. Erillisessä Decimal-laskennassa tarkistettiin 79 yksilöllistä tunnistetta, positiivinen annosmäärä, pisteet ja vaihteluvälien päät, lähdeviitteiden olemassaolo, paikallisten lähdetiedostojen ja reseptiversioiden SHA-256 sekä FI/EN/SV/TH-valmistus- ja rajauskentät. Farinatan ainesosakohtainen ja labnehin tuoteskenaariomuoto käsiteltiin erikseen. Ackeen nykyinen turvallisuussidos tarkistettiin erillisen valmistellun reseptin SHA:sta. Vanhalla tutkimussidoksella on eri tarkiste. Vastaavia julkaistuja tunnisteita tai duplikaatteja ei löytynyt. Laskentatulosten ero tallennettuun oli kaikissa enintään 0,0000000001 GK.

Kevyt tarkistus vahvistaa viitteen ja aineiston rakenteen. Se ei varmista jokaisen ulkoisen sivun saatavuutta, lisenssiä, lähteen soveltuvuutta tai kaikkien käännösten idiomatiikkaa. Otoksessa tarkistettiin, että laskennallinen arvio ja rajaukset ovat näkyvissä. Thaikäännöksille tarvitaan julkaisussa kielentarkistus. Reseptit, syötteet ja julkaisuvaltuudet jätettiin koskematta. Katselmointihaaran ainoa korjaus raportin lisäksi on päätöstaulukon otsikon laajuuden täsmennys.

## Yhteiset ongelmat

1. **Pienosuudet voivat hallita tulkintaa.** 11 pakettia ylitti seulontakriteerin, jossa pois rajattu CHO antaisi oletus-GI:llä 100 enemmän GK:ta kuin skenaarion pienempi laskettu arvo. Tämä on herkkyystesti eikä todellinen yläraja. Pofiberin 1,9625 g olisi jo oletus-GI:llä 50 noin 0,98 GK suhteessa laskettuun 0,42:een. Pidä osatulokset näkyvästi osatuloksina ja tarkista merkitys suhteessa koko arvioon. Aritmeettista järjestelmävirhettä ei löytynyt.
2. **Yksi mittaus voi kertautua.** Yangin sama nyytti tuottaa jiaozin ja xiaolongbaon GI:n. Lähteiden lukumäärä ei lisää riippumatonta näyttöä. Koko aterian GI:n siirto vaatii koostumussuhteiden tarkistuksen ja varmistuksen, että hiilihydraatit lasketaan kerran.
3. **Skenaarioväli ei kata kaikkea epävarmuutta.** Erota tuotteiden, raaka- ja kypsäpainojen, tarjoilumäärän sekä mitattujen GI-arvojen vaihtelu. Ilmoita kiinteät oletukset, kuten koko dippi tai marinadi. Erottele muutettu annos reseptin normaalista tarjoilusta.
4. **Käyttöperuste on lähdekohtainen.** Fineli CC BY 4.0, AFCD CC BY-SA 3.0 Australia ja CoFID OGL v3.0 merkitään lähteittäin. Yangin artikkeli on CC BY-NC 4.0. Yksittäisen tutkimusluvun käyttöperuste, Sydneyn julkaisemattoman mittauksen ehdot ja MyFCD:n ehdot kirjataan ennen julkaisua. Tutkimustaulukkoa ei kopioida.

## Ensimmäinen julkaisuerä ja jatko

HOLD-tilassa seuraava erä on ehdotettu tarkistuslista. Varsinainen 10–15 reseptin julkaisu-PR valmistellaan vasta portin avauduttua. Ensimmäisen kymmenen reseptin ryhmään ehdotetaan jiaozia ja chow meinia (A), serabia, Margheritaa ja dan dania (B) sekä ennakkokatselmointiin soba-aamiaiskeittoa, katkarapu-wontonkeittoa, pannufarinataa, tunisialaista brikiä ja tunisialaista ojjaa. Viisi viimeistä ovat otoksen ulkopuolelta ja tarvitsevat saman syvätarkastuksen ennen valintaa. Jos yksikin jää esteeseen, valitaan tarkastettu korvaava resepti. C-ehdokkaat siirtyvät myöhempään erään vasta omistajan päätöksellä. Tuotantoon siirto edellyttää hyväksyntää täsmälleen katselmoidulle versiolle.

1. Määritä suhteellinen pienosuussääntö ja tarkista 11 seulonnan osumaa ennen uusia laskentaeriä.
2. Täsmennä lähdekohtainen käyttöperuste ja mittauksen tunniste ennen B-korjauksia.
3. Käy läpi viisi C-päätöstä punnittuine resepteineen ja tarjoilurajauksineen.
4. Syvätarkasta viisi nimettyä täydentävää reseptiä ja arvioi portti uudelleen.
5. Valmistele erillinen julkaisu-PR vasta hyväksytylle 10–15 reseptin erälle.
