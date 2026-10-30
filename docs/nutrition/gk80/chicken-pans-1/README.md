# GK-80: kahden kanapannun kokonaiset arvioehdotukset

Päivä: 30.10.2026. Tila: **2 ehdollista numeerista ehdotusta, luottamus matala**.
Pohja: [liemi- ja kastike-erän Draft #137](https://github.com/ozirix-dev/Reseptit/pull/137),
commit `2511f00a38e394faa54ee5896f2164c38db77870`. [Käyttäjän rajaus](request.md).

Molempien tarkasti määriteltyjen pannujen GK-arvio on **noin 1 annosta kohti**.
Tuotannon reseptejä tai ravintoarvoja ei muutettu. Koko erä tuodaan nyt katselmoitavaksi.
Arviot koskevat alla ehdotettuja punnittuja versioita, koko kastike mukana jaettuna neljään annokseen.
Lisukkeita ei ole mukana. Sienipannussa **salottisipuli korvataan 55 grammalla keltasipulia**;
alkuperäinen salottisipuliversio ei saa tätä arvoa.

## Tulokset annosta kohti

| Ehdotettu reseptiversio | CHO g | Proteiini g | Rasva g | Kuitu g | GK-laskentapiste | Näyttöehdotus |
| --- | --- | --- | --- | --- | --- | --- |
| Parmesaaninen kanapannu parsakaalilla | 2,88225 | 38,00015 | 27,348625 | 2,403625 | 1,076545 | GK-arvio noin 1 |
| Kermainen kanasienipannu keltasipulilla | 2,898 | 27,832025 | 26,571875 | 1,629125 | 1,14652 | GK-arvio noin 1 |

Pitkät desimaalit ovat laskennan toistettavuutta varten. Ne eivät ole mittaustarkkuusväite.
Käyttäjälle ehdotetut CHO-luvut ovat noin **2,88 g** ja **2,90 g**.
Kaikki positiivisen CHO:n GI-luvut perustuvat oletukseen tai vertailuruokaan.
Matalan luottamuksen piste ei ole mitattu ateria-GI, henkilökohtainen vaste tai epävarmuusväli.

## Liemen arviointitapa

[Schakel ym. 2008](https://doi.org/10.1016/j.jfca.2007.02.004) kehitti GI-tietokannan
ruokavalion arviointiin. [Tekijöiden esityksen](https://pdfs.semanticscholar.org/eead/ef25b9a2d5c209deb31265082c85080758f4.pdf)
dia 12 antaa vähähiilihydraattisille ruoille oletusarvon **GI 50 glukoosiasteikolla**.
Dia tarkistettiin kuvana. Kustantajan indeksoitu tulosteksti vahvistaa oletusarvon käytön;
koko lehtiartikkeliin ei saatu pääsyä. Myös [NCC:n menetelmäkuvaus](https://www.ncc.umn.edu/products/nutrients-nutrient-ratios-and-other-food-components/)
erottaa mitatut, johdetut ja oletetut GI-luvut.

Tässä käytetään tätä julkaistua koodausmenetelmää nimetyille vähähiilihydraattisille aineille.
GI 50 ei ole tuotetesti, biologinen keskipiste tai enimmäisraja. GI voi ylittää 100.
Menetelmä ei määritä tämän erän kaikille tuotteille erikseen soveltuvuutta: tuotekohtainen sovellus
ja mausteannosta koskeva laajennus ovat näkyviä katselmointipäätöksiä, eivät automaattinen yleissääntö.
Lähteen käyttö rajataan näihin kahteen ehdotukseen.

Molempiin pannuihin tulee **150 g Kivikylän Sooci Paahdettua kanalientä**, EAN 6406300045026.
[Valmistajan tiedot](https://www.kivikylan.fi/tuotteet/paahdettu-kanaliemi/):
CHO 0,2 g, proteiini 3 g, rasva 0,1 g ja kuitu 1,1 g / 100 g.
Koko liemi syödään kastikkeen mukana. Mahdollinen lisäneste on vettä.
Annososuuden laskenta on `150 / 100 × 0,2 / 4 × 50 / 100 = 0,0375 GK`.
150 g määrittelee uuden punnitun version; se ei todista vanhan 150 ml:n tiheyttä.

EU-pakkaus-CHO on tässä **mallinnettu käytettävän CHO:n korvike**. Tuotteiden polyoleja ei ole mitattu
eikä oletusta merkitä varmennetuksi polyolittomuudeksi. Kuitua ei vähennetä EU-CHO:sta uudestaan.
Mallin ainesosarivin CHO-määritelmä ilmaisee tavoitekäsitteen; erilliset lähde- ja näyttökentät
kertovat, että liemen ja Dijonin lukuarvo täyttää sen vain tämän nimenomaisen oletuksen kautta.
Ravintoarvojen pyöristyminen ja mahdolliset luontaiset polyolit jäävät epävarmuuksiksi.

## Dijon, mausteet ja muut ratkaisut

| Ainesosa | Ehdotettu määrä koko pannuun | CHO g/annos | GI-sidos | GK-osuus/annos |
| --- | --- | --- | --- | --- |
| Kanaliemi, molemmat | 150 g | 0,075 | Oletus 50 | 0,0375 |
| Maille Dijon Originale, sienipannu | 15 g | 0,13125 | Oletus 50 | 0,065625 |
| Mustapippuri, molemmat | 0,5 g | 0,04825 | Pienen annoksen erillinen laajennus 50 | 0,024125 |
| Tuore timjami, sienipannu | 2 g | 0,0055 | Oletus 50 | 0,00275 |
| Herkkusieni, sienipannu | 250 g | 0,5 | Oletus 50 | 0,25 |
| Kerma ja voi, molemmat yhteensä | 200 g + 14 g | 1,478 | Maidosta sovellettu 34 | 0,50252 |

Dijon on Suomen **Maille Dijon Originale, sileä 1 kg tuote, kuluttaja-EAN 8711200375684**.
[Valmistajasivu](https://www.unileverfoodsolutions.fi/tuotteet/maille-dijon-originale-sinappi-1-kg-34-FI-1203997.html)
ja [valmistajan vuoden 2025 tuoteluettelo](https://www.unileverfoodsolutions.fi/dam/global-ufs/mcos/nordics/finland/themes/tuoteopas-2025/UFS_2025_Tuoteluettelo_S%C3%A4hk%C3%B6inen.pdf)
ilmoittavat CHO 3,5 g, proteiinia 7 g, rasvaa 11 g ja kuitua 2 g / 100 g.
Luettelo vahvistaa nimenomaan 100 g:n perustan ja erottaa kuluttaja-EANin myyntierän EANista
8711200375691. Yksi vanhempi välimuistisivu toistaa myyntierän EANin molemmissa kentissä.
Luvut tarkistettiin indeksoidusta valmistaja-aineistosta; suorat lataukset estyivät 403-vastaukseen.
Fyysistä pakkausta ei nähty eikä lataamattomasta asiakirjasta väitetä tiedostohashia.
15 g on punnittu ohje-ehdotus, ei todistettu ruokalusikan paino. Muun maan tai kokojyväsinapin
tietoja ei yhdistetty tähän tuotteeseen. Ainesosissa ei ilmoiteta lisättyä sokeria tai polyolia;
tämä ei osoita tarkkaa sokerikoostumusta eikä polyolien puuttumista.

Mustapippurin koostumus tulee [AFCD F006618](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/api/foods/F006618):
38,6 g käytettävää CHO:ta / 100 g. Pippuri **ei ole vähähiilihydraattinen ruoka 100 g kohti**.
GI 50:n käyttö juuri 0,5 g:n koko pannun annokselle on erillinen projektin soveltamisoletus.
Sen 0,04825 g CHO/annos säilyy laskennassa; sitä ei pudoteta nollaksi.
Määrä korvaa vanhan määrittelemättömän pippuriosuuden. Puhdas suola on oma nollamakrorivinsä;
suolan määrää tai natriumin saantia ei arvioida tässä neljän makron laskennassa.

Tuoreen timjamin [AFCD F010466](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/api/foods/F010466)
sisältää 1,1 g käytettävää CHO:ta / 100 g. Valitaan 2 g irrotettuja, syötäviä tuoreita lehtiä.
Aiempi 15 g:n ruokalusikkaoletus hylätään; 2 g ei ole uusi väite ruokalusikan mitatusta painosta.
Kuivattu timjami tai pois nostettavat varret eivät kuulu versioon.

Sienipannun vanha tutkimusrivi nimesi salottisipulin mutta käytti Fineli 335:n keltasipulia.
AFCD F008227:n englanninkielinen “shallot” kuvaa puolestaan pitkävartista nuorta sipulia,
joten sitä ei tulkita suomalaiseksi salottisipuliksi. Ratkaisu on näkyvä reseptimuutos:
**55 g kuorittua keltasipulia**, jolloin Fineli 335 vastaa käytettävää ainesosaa.

Parsakaalin, valkosipulin ja keltasipulin GI 40 säilyy aiemman
[Atkinson 2008](https://doi.org/10.2337/dc08-1239) kasvisoletuksen mukaisena.
Herkkusienen AFCD-koostumus sulkee polyolit jo pois; niitä ei vähennetä toiseen kertaan.
38 % kerman ja suolattoman voin GI 34 sovelletaan aiemmin varmennetusta maidon ihmistutkimuksesta
([Henry 2005](https://doi.org/10.1079/BJN20051594), Atkinson 2021 taulukko 1, rivi 938).
Se on säilytettyjen maitovertailujen 30, 34 ja 46 keskimmäinen luku, **ei kerma- tai voikohtainen GI**.
Rasva, proteiini ja valmistus poikkeavat maidosta. SEM 6:sta ei muodosteta epävarmuusväliä.
Valitaan punnittu 200 g kermaa; aiemman 200 ml:n tiheyttä ei oleteta tunnetuksi.

Täydelliset 9 ja 10 ainesosarivin määrät, koostumukset, lähdesidokset ja valmistusehdotukset
ovat [recipes.json](recipes.json)-tiedostossa. Kypsennyshävikkiä ei ole mitattu.
Kaikki paistamisrasva, lihasta irronnut neste ja kastike sisältyvät neljään tasaisesti jaettuun annokseen.

## Herkkyys ja rajat

Seuraavat ovat **erillisiä diagnostisia kokeita**, eivät todellisen GK:n vaihteluväli tai luottamusrajat.
Muut oletukset pysyvät kussakin kokeessa ennallaan. Todelliselle fysiologiselle epävarmuudelle
ei löytynyt perusteltua ala- ja ylärajaa.

| Laskentavaihtoehto | Parmesaanipannu | Sienipannu |
| --- | --- | --- |
| Valittu piste | 1,076545 | 1,14652 |
| Kaikkien GI 50 -rivien hypoteettinen GI 100 | 1,13817 | 1,52652 |
| Kaikkien GI 50 -rivien hypoteettinen GI 150 | 1,199795 | 1,90652 |
| Molemmille maitotuotteille vertailu 30 | 1,017425 | 1,0874 |
| Molemmille maitotuotteille vertailu 46 | 1,253905 | 1,32388 |
| Liemen ja Dijonin koko pakkaus-CHO poistettu, muut sidokset ennallaan | 1,039045 | 1,043395 |

Viimeinen rivi näyttää mallikorvikkeen herkkyyttä; se ei väitä tuotteiden olevan hiilihydraatittomia.
Pippurin oma GK-osuus GI-oletuksilla 50 / 100 / 150 on 0,024125 / 0,04825 / 0,072375.
Maidon vaihtoehdot eivät kata rasvaisten maitotuotteiden todellista epävarmuutta.
Julkaistujen imputaatioiden osuudet ovat 0,574025 ja 0,644 GK eli alle mallin yhden yksikön
toimituksellisen seulontarajan. **Kaikkien oletusten ja vertailujen yhteisosuus on kuitenkin
koko GK, 1,076545 ja 1,14652, eli yli yhden yksikön tavoitteen.** Seulontarajan läpäisy ei
siksi tarkoita, että koko oletusvaikutus olisi alle yksi, eikä kumpikaan raja ole biologinen virheraja.

[Nasu 2005](https://www.jstage.jst.go.jp/article/fstr/11/1/11_1_77/_pdf) tutki maustetta riisiä ja voita sisältävässä ateriassa
riisivertailuun nähden, ei erillistä Dijonia glukoosiasteikolla.
[Khan 2024](https://doi.org/10.1002/fsn3.3965) koskee pippuria seosaamiaisessa.
Kummastakaan ei anneta glukoosivastetta alentavaa hyvitystä.
[Louie 2015](https://doi.org/10.1016/j.jfca.2014.06.002) vähähiilihydraattisten ruokien nollasääntöä
ei oteta käyttöön: positiivinen CHO säilyy laskennassa. Verkon lähteistämättömät sinappi-GI:t hylättiin.

## Kattavuus

| Mittari | Tulos |
| --- | --- |
| Uudet ehdolliset kokonaiset numeeriset ehdotukset | 2 |
| Tässä erässä hyväksytyt / julkaistut GK-arvot | 0 / 0 |
| Yksilölliset ehdolliset ehdotukset, aiemmat mukaan lukien | 6 → 8 |
| Tuotannon GK-kattavuus | 83/326 → 83/326 (25,46 %) |
| Tavoite | 261/326 eli vähintään 80 % |
| Nykyinen ero tavoitteeseen | 178, jos nykyiset 83 säilyvät kelvollisina |
| Jos kaikki kahdeksan ehdotusta myöhemmin hyväksytään ja julkaistaan | 91/326, ero 170 |

Kaksi kohdetta kuuluivat jo AJO 2:n 30 reseptiin; uusia resepti-ID:itä ei synny.
Vanhoja yhdeksää nollatulosta tai aiempia ehdollisia pisteitä ei muuteta hyväksytyiksi.
Edellisen erän hyväksyntä tarkoitti lupaa tähän selvitykseen.

## Toistaminen ja tarkistukset

```powershell
python site/scripts/gk80-chicken-pans-verify.py
cd site
npm run test:gk80
```

Pythonin Decimal-laskenta käyttää 40 numeron tarkkuutta ja aiemman Python-verifioijan puhtaita
laskentafunktioita. Se on TypeScript-toteutuksesta riippumaton, ei toinen uusi Python-algoritmi.
TypeScript-tarkistus vertaa jokaista ainesosaa, kaikkia neljää makroa ja koko GK:ta tähän tulokseen.
Lähdehashit, tuotannon reseptit ja aiemmat tutkimustiedostot tarkistetaan muuttumattomiksi.
Uudet koostumustiedot säilyttävät eron ilmoitetun pakkausluvun, käytetyn mallikorvikkeen
ja AFCD:n polyolit poissulkevan luvun välillä. Hash ei todista lähteen tieteellistä oikeellisuutta.

Paikallinen varmennus: **196/196 testiä PASS**, mukana kuusi uutta testiä ja read-only Decimal-tarkistus.
Regressio varmisti **994 suojattua tiedostoa ja kaikki 326 tuotantotulosta muuttumattomiksi**.
Ravinto- ja GK-auditoinnit valmistuivat tuoreesta generoidusta sisällöstä; tuotannossa 83 laskettua
ja 243 keskeneräistä tulosta. Markdownlint: 850 tiedostoa, 0 virhettä.
Täsmällisen julkaistun kehitys-HEADin CI todetaan Draft-PR:stä ja ReportHub-handoffista.
Käyttöliittymää tai paikallista esikatselupalvelinta ei muutettu tässä laskentaerässä.

Aineistot: [lähteet](sources.json), [koostumukset](composition-sources.json), [reseptit](recipes.json),
[laskenta ja diagnostiikka](golden.json), [lähdekatselmointi](source-review.json),
[provenienssi](provenance.json), [mittarit](metrics.json).

## Seuraava päätös

Ehdotettu seuraava vaihe on näiden **kahden valmiin ehdotuksen riippumaton menetelmä- ja
reseptikatselmointi**. Se tarkistaa erityisesti GI 50:n soveltamisen, pippurin erillisen laajennuksen,
pakkaus-CHO-korvikkeen, maitotuotteiden analogian ja keltasipuliversion.
Tässä päätöksessä ei julkaista numeroita, siirretä niitä tuotantoon tai aloiteta seuraavaa laajaa erää.

**Hyväksytäänkö erä seuraavaan vaiheeseen? Kyllä / Ei.**
