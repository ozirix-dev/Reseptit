# CODEX – RESEPTIT GK-80
# AJO 2: LÄPIMURTOERÄ – VÄHINTÄÄN 10 UUTTA NUMEERISTA GK-EHDOTUSTA

**Päivä:** 30.10.2026  
**Projekti:** `ozirix-dev/Reseptit`  
**Raportointi:** `ozirix-dev/ReportHub`  
**Pääohjelma:** GK-80 MASTER PLAN V1.0  
**Työn tila:** DEVELOPMENT + DRAFT REVIEW

## 0. TEHTÄVÄN YDIN

Tämä on GK-80-ohjelman toinen toteutusajo.

Ensimmäinen 20 reseptin pilotti tuotti vain kolme numeerista GK-ehdotusta. Tekninen prototyyppi toimii, mutta se ei vielä ratkaise ohjelman varsinaista tavoitetta: vähintään 80 % resepteistä numeerisen GK-laskennan piiriin.

**Tämän ajon konkreettinen tulostavoite on tuottaa vähintään 10 uutta numeerista GK-pistearvio- tai vaihteluväliehdotusta 30 uudelle reseptille.**

Lisäksi katselmoidaan edellisen pilotin kolme ehdotusta ja kehitetään laskentamallia niin, etteivät pienet hiilihydraattiosuudet ilman täsmällistä GI:tä automaattisesti estä koko reseptin arviointia.

Älä korvaa numeeristen tulosten tavoitetta dokumenttien, lähdetietueiden, testien tai auditointien määrällä.

**Onnistumisen mittari on uusi numeerinen GK-tieto, jonka laskennan ja oletukset riippumaton katselmoija voi tarkistaa.**

Jos tavoite ei toteudu hyväksyttävällä näytöllä, raportoi todellinen tulos. Älä keksi lukuja tai muuta laskentasääntöjä vain tavoiteluvun täyttämiseksi.

---

# 1. TAUSTA JA LÄHTÖKOHTA

## 1.1 Pääohjelma

https://github.com/ozirix-dev/Reseptit/blob/23b4c68185c4995a726558b3052e48b438586d47/docs/nutrition/plans/gk80-master-plan-v1.md

## 1.2 Pilotin 1 tulokset

Reseptit Draft-PR:

https://github.com/ozirix-dev/Reseptit/pull/135

HEAD:

`23b4c68185c4995a726558b3052e48b438586d47`

ReportHub Draft-PR:

https://github.com/ozirix-dev/ReportHub/pull/75

HEAD:

`c7650c689fb90eaa758962a5f378f11bf8274ad8`

Tutkimusaineisto:

`docs/nutrition/gk80/pilot-1/`

Prototyyppi:

`site/scripts/gk80-model.ts`

Testit:

`site/tests/gk80-model.test.ts`

Aiemmat R2- ja R3-tutkimusaineistot ovat edelleen erillisissä PR:issä #133 ja #134.

Lue pilotin tulokset ja nykyiset suunnitelmat. Käytä jo tehtyä tutkimustyötä hyväksesi.

Älä aloita koko 326 reseptin syväauditointia uudelleen.

## 1.3 Lähtötilanteen määrät

- Reseptejä: 326.
- Nykyisiä laskettuja GK-tuloksia: 83.
- Keskeneräisiä: 243.
- GK-80-tavoite: vähintään 261 reseptiä.
- Tarvittavia uusia hyväksyttäviä arvoja: 178, mikäli kaikki 83 nykyistä säilyvät kelvollisina.
- Yhdeksän nykyistä GK-nollaa tarvitsee oman korjauskäsittelynsä.
- Pilotissa 1: 3 numeerista ehdotusta, ei uusia julkaisuja.

Erota raportissa nykyinen julkaistu kattavuus, alustava numeerinen ehdotuskattavuus ja laatuvaatimukset täyttävä hyväksytty kattavuus.

Älä laske samoja reseptejä kahteen kertaan.

---

# 2. TÄMÄN AJON MITATTAVAT HYVÄKSYMISKRITEERIT

## Päätavoite

**10 uutta numeerista GK-arvioehdotusta.**

Näiden tulee:

1. Olla kymmenelle aiemman pilotin ulkopuoliselle yksilölliselle reseptille.
2. Sisältää koko määritellyn annosskenaarion hiilihydraattivaikutus.
3. Perustua oikeisiin ravintoarvo- ja GI-vertailutietoihin.
4. Olla laskennallisesti toistettavissa.
5. Käsitellä oleelliset valmistus- ja tuoteoletukset.
6. Antaa pistearvo tai numeerinen vaihteluväli.
7. Sisältää näkyvä epävarmuusluokitus.
8. Olla käyttökelpoinen reseptien vertailuun määritellyillä oletuksilla.
9. Säilyttää lähde- ja reseptiversioiden jäljitettävyys.
10. Olla riippumattomaan katselmointiin valmis, ei automaattisesti julkaistu.

## Tulostasot

- **GO:** vähintään 10 uutta katselmoitavaa numeerista GK-ehdotusta sekä vaadittu laskentamallin parannus.
- **PARTIAL:** 4–9 uutta numeerista ehdotusta tai malliparannuksessa olennainen avoin ongelma.
- **BLOCKED:** 0–3 uutta ehdotusta tai laskennan keskeinen luotettavuus jää osoittamatta.

Nämä ovat tämän ajon tavoitteellisen työn arviointikriteerejä, eivät syitä hyväksyä heikkoja laskelmia.

Jos tulos jää PARTIAL- tai BLOCKED-tasolle, osoita konkreettinen yhteinen este, jonka ratkaiseminen avaisi seuraavassa erässä useita reseptejä.

---

# 3. KORJAA ENSIN LASKENTAMALLIN TÄRKEIN PUUTE

Ensimmäisessä pilotissa havaittiin, että yksikin positiivista hiilihydraattia sisältävä ainesosa ilman GI-sidosta estää koko numeerisen arvion.

Nykyisessä prototyypissä:

`site/scripts/gk80-model.ts`

Puuttuva GI palauttaa `gk: null`, ja koko reseptin arvo vaatii kaikkien ainesosien numeeriset osuudet.

Tämä oli turvallinen prototyypin lähtökohta, mutta GK-80-ohjelmaan se on liian rajoittava.

## 3.1 Toteuta epävarman ainesosan vaikutuslaskenta

Uuden mallin tulee pystyä erottamaan:

- Täsmällisesti lähteistetty GI-osuus.
- Sovelletusta GI-lähteestä laskettu osuus.
- Perusteltuun vertailualueeseen perustuva osuus.
- Puuttuva mutta vaikutukseltaan pieneksi arvioitu osuus.
- Olennainen tuntematon, jonka vaikutusta ei voi vielä rajata.

Jos ainesosan GI puuttuu, älä palauta automaattisesti koko reseptille UNAVAILABLE-tilaa.

Laske ensin ainesosan hiilihydraattimäärä ja selvitä, voidaanko GI-vaihtoehdoista tai muusta dokumentoidusta lähdenäytöstä muodostaa vaikutusskenaario.

## 3.2 GK-vaikutuksen rajaus

Kun ainesosan käytettävä CHO on C ja hyväksyttävien vertailuskenaarioiden GI-arvot ovat L ja H:

- Vaikutusskenaarioiden päät ovat C × L / 100 ja C × H / 100.
- Molemmat GI-arvot tarvitsevat yksilöidyn perusteen.
- L:n ja H:n on vastattava mahdollisia, määriteltyjä tuote- tai valmistustapauksia.
- Alue ei ole mitattu biologinen varmuusväli.

Laske koko annoksen numeeriset skenaariot huomioiden myös muiden ainesosien epävarmuus.

Saman reseptin toisiinsa riippuvia vaihtoehtoja ei saa yhdistää mahdottomiksi ääriyhdistelmiksi.

## 3.3 Pieni epävarma hiilihydraattiosuus

Esimerkki pilotista:

Quesadillan sienen käytettävä CHO on noin 0,30 g/annos.

Nykyinen prototyyppi estää kokonaisarvion, koska sienen GI puuttuu.

Tutki, miten tämä voidaan ratkaista.

Ensisijaiset vaihtoehdot:

1. Etsi soveltuva GI-vertailutieto.
2. Selvitä, mitä saman elintarvikkeen tai riittävän vastaavien valmistemuotojen tutkimukset kertovat.
3. Muodosta eksplisiittinen vaikutusskenaario.
4. Tarkista, muuttaako epävarmuus käytännön GK-tulkintaa.
5. Jos arviota voidaan edelleen käyttää mielekkäästi, tuota numeerinen kokonaisarvio siihen kuuluvine epävarmuustietoineen.

Älä aseta puuttuvaa GI:tä nollaksi.

Älä myöskään oleta, että GI:n absoluuttinen maksimi olisi 100.

Stressitestissä saa käyttää erikseen ilmoitettua hypoteettista GI-arvoa, mutta sellaista ei saa esittää tieteellisesti varmennettuna ylärajana.

Pelkällä stressitestillä ei saa muuttaa tuntematonta vaikutusta varmennetuksi vaihteluväliksi.

## 3.4 Ehdotettu vaikutusperusteinen toimituksellinen sääntö

Tutki, voidaanko seuraavaa käyttää GK-80-arviointimenetelmän osana:

Jos lähteistetyillä ja perustelluilla vaihtoehdoilla tuntemattoman tai epätarkan osuuden vaikutus GK:hon on enintään noin yksi GK-yksikkö eikä se muuta olennaisesti käyttäjän tulkintaa, resepti voi saada numeerisen GK-arvion asianmukaisella epävarmuusmerkinnällä.

Yksi GK-yksikkö on tässä kokeiltava toimituksellinen tarkkuustavoite, ei lääketieteellinen tai tutkimuksellinen luonnonvakio.

Tutki myös tapauksia, joissa vaihteluväli ylittää GK-luokkarajan.

Älä hylkää tällaista aluetta automaattisesti, jos se on muuten hyödyllinen ja käyttäjälle esitetään molemmat luokat.

## 3.5 Testit

Luo erilliset testit vähintään seuraaville:

- Yksi pieni epävarma GI-osuus.
- Useita pieniä epävarmoja GI-osuuksia.
- Suuri tuntematon GI-vaikutus.
- Puuttuva massa.
- Tunnettu CHO-nolla.
- Todellinen GK-nolla.
- Positiivinen GK, joka pyöristyisi nollaan.
- Vaihteluvälin luokkarajan ylitys.
- Usean ainesosan riippuvaiset skenaariot.
- Vanhentunut koostumus- tai GI-lähde.
- Väärä ruokaperhe.
- GI yli 100.

Varmista, että vanhat 326 laskentatulosta säilyvät muuttumattomina.

---

# 4. PILOTIN 1 KOLMEN EHDOTUKSEN RIIPPUMATON LÄHDEKATSELMOINTI

Suorita tämän työn yhteydessä erillinen riippumaton lähde- ja valmistusvastaavuuden katselmointi kolmelle jo lasketulle ehdotukselle.

Älä laske niitä tämän ajon kymmenen uuden ehdotuksen tavoitteeseen.

## 4.1 Vietnamilainen kahvijogurtti banaanilla

Nykyinen ehdotus:

GK noin 11–12/annos.

Tarkista:

- Jogurtin tuotetyyppi ja koostumus.
- Banaanin 125 g syötävä massa.
- Banaanin kypsyysvaihtoehtojen GI-lähteet.
- Makeutetun kondensoidun maidon oikea tuotetyyppi.
- GI 61 -lähteen vastaavuus.
- Käytetyt CHO-arvot.
- Kaikki annos- ja yksikkömuunnokset.
- Valmistustavan yhdenmukaisuus.

Selvitä, voidaanko nykyinen 11–12 hyväksyä ehdolliseksi mallinnetuksi alueeksi.

Jos voidaan, merkitse `READY_FOR_INDEPENDENT_APPROVAL`.

Älä nimeä sitä hyväksytyksi tai julkaistuksi pelkän oman tarkistuksen perusteella.

## 4.2 Halloumi-tomaattileipä

Nykyinen ehdotus:

GK noin 14–21/annos.

Tarkista erityisesti:

- Hapanjuurileivän GI 54 ja 82 -vertailut.
- Leipätyyppi ja koostumus.
- Kevyen paahtamisen vaikutuksen käsittely.
- Halloumin maitoanalogia.
- Tomaatin koostumus ja GI.
- Reseptin ristiriitaiset valmistusvaiheet.
- Kahden annoksen kokonaisuus.

Tavoitteena on löytää tarkka reseptiskenaario, joka vastaa laskennan lähteitä ja voidaan esittää käyttäjälle luotettavasti epävarmuusmerkinnällä.

Jos halloumin maitoanalogia on liian heikko, arvioi sen pienen CHO-osuuden vaikutus koko reseptiin. Älä hylkää koko leipäreseptiä automaattisesti pelkästään tämän vuoksi.

## 4.3 Pohjoisafrikkalainen harcha juustolla

Nykyinen ehdotus:

GK noin 19–26/annos.

Keskeinen ongelma on mannasuurimotutkimuksen soveltaminen pannuleipään.

Tarkista alkuperäinen Mani ym. 1992 -tutkimus, DOI `10.1079/BJN19920102`.

Tutki myös mahdolliset suoremmin vastaavat mannasuurimoleipä-, litteä leipä- tai vastaavat valmistustutkimukset.

Älä tulkitse höyrytetyn tai vesihyytelöitetyn mannasuurimon GI:tä automaattisesti pannulla kypsennetyn harchan GI:ksi.

Päätä:

- Säilyykö 19–26 perusteltuna skenaarioehdotuksena?
- Tarvitaanko laajempi alue?
- Voidaanko löytää parempi vertailu?
- Pitäisikö tämä ehdotus hylätä ja valmistella myöhempää tutkimusta varten?

Hylkää tarvittaessa vanha skenaario ja dokumentoi syy. Älä muuta harchaa höyrypuuroksi vain siksi, että lähde sopisi paremmin.

---

# 5. VALITSE 30 UUTTA RESEPTIÄ TULOSKESKEISESTI

Ensimmäinen pilotti valitsi tarkoituksella useita vaikeita reseptejä.

Tässä ajossa valintamenetelmä muutetaan.

Tavoitteena on löytää reseptit, joiden GK on todennäköisimmin ratkaistavissa nykyisten ja uusien vertailulähteiden avulla.

## 5.1 Koneellinen esivalinta

Seulo 243 keskeneräistä reseptiä olemassa olevasta inventaariosta.

Älä suorita uutta syvää yleisauditointia.

Järjestä ehdokkaat seuraavien tekijöiden mukaan:

- Kokonaisen CHO-laskelman valmius.
- Olennaisten GI-lähteiden olemassaolo.
- Puuttuvan GI:n hiilihydraattiosuus.
- Mahdollisuus käyttää valmistus- tai tuoteskenaariota.
- Mahdollisuus korjata reseptiteksti helposti.
- Lähteen uudelleenkäytettävyys muissa resepteissä.
- Todennäköisyys saada hyödyllinen numeerinen alue.
- Tarvittavan työn suhteellinen määrä.

Selvitä erityisesti R2:n 55 mahdollista ei-GI-korjauskohdetta.

Huomioi myös R3:n 14 lähteistettyä CHO-kokonaisarviota ja Pilotin 1 uusia vertailulähteitä.

Älä kuitenkaan laske aiemman pilotin samoja 20 reseptiä uusiksi kohteiksi.

## 5.2 Lopullinen 30 reseptin valinta

Valitse 30 yksilöllistä reseptiä.

Ehdotettu rakenne:

- 10 mahdollisimman lähellä valmista olevaa reseptiä.
- 10 reseptiä, joissa puuttuvan GI:n vaikutus voi olla pieni tai rajattavissa.
- 10 reseptiä, joissa yhteinen uusi GI-lähde tai mallinnusskenaario voi ratkaista merkittävän hiilihydraattilähteen.

Tämä on kohdennettu läpimurtoerä, ei satunnaisotos kokoelmasta.

Priorisoi myös sellaiset yhteiset GI-ongelmat, joiden ratkaisulla on vaikutusta kymmeniin muihin resepteihin.

Kirjaa valintaperusteet, mutta älä käytä suurinta osaa ajosta valintaraportin hiomiseen.

---

# 6. TUOTA 10 UUTTA NUMEERISTA GK-EHDOTUSTA

Käsittele kaikki 30 valittua reseptiä.

Jokaiselle reseptille:

1. Tarkista nykyinen CHO-kokonaisuus.
2. Selvitä tärkeimmät GI-lähteet.
3. Tarkista valmistusvastaavuus.
4. Etsi tarvittaessa paremmat lähteet.
5. Selvitä puuttuvien osuuksien vaikutus.
6. Muodosta mahdolliset tuote- ja valmistusskenaariot.
7. Laske kaikki mukana olevat ainesosat.
8. Arvioi kokonais-GK:n käyttökelpoisuus.
9. Tuota numeerinen piste tai väli, kun laskelma on perusteltu.
10. Laadi käyttäjälle yksinkertainen esitysehdotus.

Tavoitteena on vähintään kymmenen uutta laskelmaa.

Älä pysähdy ensimmäiseen puuttuvaan GI-lähteeseen, jos vaihtoehtoinen perusteltu laskentatapa on mahdollinen.

Älä käytä lähteetöntä yleistä ruokaryhmäkeskiarvoa pelkästään tavoitteen täyttämiseksi.

Jos pääainesosan GI on tuntematon, etsi erityisesti sen käsittelyä ja valmistusta vastaavia tutkimuksia.

## 6.1 Priorisoi pääasiallinen hiilihydraattilähde

Tarkista esimerkiksi riisiruokien kohdalla ensin riisi eikä jokaista vähähiilihydraattista maustetta.

Jos pääainesosan CHO on 40 g ja sivuaineksen 0,2 g, priorisoi tiedonhaku suhteessa mahdolliseen GK-vaikutukseen.

Yksittäisen mausteen tutkiminen ei saa muodostua tuntikausia kestäväksi työksi, jos sen realistinen vaikutus on lähdeperusteisesti rajattavissa merkityksettömäksi arvioidun lopputuloksen kannalta.

## 6.2 Vaihteluvälien muodostaminen

Laske vain perustellut skenaariot.

Jos kahdessa mahdollisessa tuotevalinnassa GK on esimerkiksi 21 ja 29, esitä mallinnettu alue noin 21–29.

Jos todellisia vertailuvaihtoehtoja ei tunneta, älä keksi alueen päitä.

Jos alue ylittää matalan, keskisuuren tai korkean GK:n rajan, näytä asia avoimesti. Älä automaattisesti estä numeerista tulosta.

## 6.3 Muuttuvat reseptit

Jos laskenta vaatii esimerkiksi:

- Riisin raaka-/kypsäpainon täsmennyksen.
- Tuotetyypin määrittelyn.
- Tietyn leipätyypin nimeämisen.
- Jogurtin makeutuksen selventämisen.
- Nesteen lisäämisen ainesosaluetteloon.
- Valmistusohjeen ristiriidan korjaamisen.

Laadi täsmällinen uusi reseptiehdotus.

Älä muuta tuotannon reseptiä tämän ajon aikana.

Jos laskentaskenaario riippuu tulevasta reseptitäsmennyksestä, merkitse tämä hyväksynnän ehdoksi.

Älä julista skenaariota valmiiksi nykyiselle julkaistulle reseptille, jos se vaatii olennaisen muutoksen, jota ei ole vielä hyväksytty.

---

# 7. UUSIEN GI-LÄHTEIDEN HANKINTA

Käytä ensisijaisesti:

- Nykyistä 45 GI-tietueen aktiivista rekisteriä.
- Pilotin 1 21 uutta vertailutietuetta.
- Atkinson ym. 2021 -kansainvälisiä taulukoita.
- Taulukoiden alkuperäisiä tutkimusviitteitä.
- Muuta luotettavaa ihmisillä tehtyä GI-tutkimusaineistoa.

Älä keskity keräämään mahdollisimman suurta määrää uusia GI-tietueita.

**Tavoite ei ole esimerkiksi 100 uutta GI-riviä. Tavoite on 10 uutta laskettavaa reseptiä.**

Jos yksi hyvä GI-lähde ratkaisee viisi reseptiä, sen tutkiminen on parempi työ kuin viisi erillistä lähdettä, joille ei löydy käyttöä.

Raportoi lähteiden todellinen vaikutus laskettaviin resepteihin.

Pidä selvästi erillään alkuperäinen tutkimus, julkaistu koontitaulukko, soveltuva analogia ja mallinnettu skenaario.

---

# 8. VÄLTÄ TOISTAMASTA PILOTIN 1 ONGELMAA

Pilotissa 1:

- 20 reseptiä käsiteltiin.
- 21 uutta GI-tietuetta tallennettiin.
- 17 reseptiä jäi ilman numeerista GK-ehdotusta.

Tässä ajossa kyseinen tulos pitää ottaa käytännön kehityssignaalina.

Ennen uuden lähdetutkimuksen laajentamista selvitä:

- Kuinka monessa reseptissä ainoa merkittävä este on pienen CHO-osuuden puuttuva GI?
- Kuinka moni voidaan laskea hyväksyttävillä nykyisillä lähteillä?
- Kuinka moni tarvitsee vain reseptin täsmennyksen?
- Kuinka moni tarvitsee uuden pääainesosan GI-lähteen?
- Kuinka monella on valmistukseen liittyvä todellinen merkittävä epävarmuus?

Toteuta ratkaisut vaikutusjärjestyksessä.

Jos 30 reseptin erä ei tuota lähellekään 10 tulosta, yksilöi, miksi mallin uusi lähestymistapa ei toimi.

Älä ehdota vain uutta samanlaista 30 reseptin tutkimuserää.

Tällöin tarvitaan mallin tai lähteiden valintamenetelmän korjaus, ei saman työn toistoa.

---

# 9. GK-ARVON KÄYTTÄJÄLLE NÄKYVÄ MERKITYS

Reseptit-sivuston käyttäjä haluaa tietää, onko annoksen glykeeminen kuorma todennäköisesti matala, keskisuuri vai korkea.

Käyttäjä ei vaadi, että kyseinen ateria olisi mitattu ihmisillä laboratoriossa.

Hän hyötyy hyvin merkitystä laskennallisesta arviosta.

Käyttäjälle riittää esimerkiksi:

**GK-arvio noin 12–18/annos**

Lisäksi:

**Arvioitu alue: matala–keskisuuri**

Ja tarvittaessa:

"Arvio perustuu reseptin hiilihydraatteihin ja samankaltaisista elintarvikkeista julkaistuihin GI-tutkimuksiin. Valmistus ja tuotevalinnat vaikuttavat tulokseen."

Vältä turhaa kahden desimaalin tarkkuutta käyttöliittymässä.

Sisäisessä aineistossa säilytä tarkka laskenta.

Muista, että ketoilijalle hiilihydraattimäärä on GK:n rinnalla keskeinen tieto. Diabeetikolle GK voi auttaa aterioiden vertailussa, mutta sitä ei saa esittää henkilökohtaisena verensokeriennusteena tai insuliinin annosteluohjeena.

Älä muuta varsinaista käyttöliittymää tässä ajossa, mutta päivitä tarvittaessa eristetty esikatselu.

---

# 10. TESTAUS JA VARMENNUS

Testaa erityisesti mallin uusi epävarmuuksien käsittely.

Varmista:

- Kaikki 30 valittua reseptiä kuuluvat nykyisiin keskeneräisiin.
- Yhtään Pilotin 1 reseptiä ei lasketa uudeksi.
- Kaikki numeeriset ehdotukset voidaan toistaa.
- Jokaisella hyväksyttäväksi ehdotetulla skenaarioalueella on dokumentoidut laskentavaihtoehdot.
- Tuntematon GI ei muutu automaattisesti nollaksi.
- Tuntematon olennainen CHO ei muutu nollaksi.
- Puuttuvan vaikutuksen raja perustellaan.
- Kaikki neljä makroa säilyvät johdonmukaisina.
- Vanhentuneet reseptit ja lähteet estävät virheellisen laskennan.
- GI-asteikot käsitellään oikein.
- Nykyiset 326 tuotantotulosta säilyvät ennallaan.
- Kieliversioita tai tuotantosivuja ei muuteta.
- Normaali CI ja kohdennetut laskentatestit läpäisevät.

Suorita erillinen riippumaton Decimal-laskenta kaikille uusille numeerisille ehdotuksille.

Jos kirjoitat uutta laskentakoodia, lisää sille automaattiset testit normaaliin CI-polkuun.

Älä luota pelkkään samaa laskentafunktiota uudelleen kutsuvaan vertailuun riippumattomana todisteena.

---

# 11. REPOSITORY- JA GUARD-MENETTELY

Ennen aloittamista tarkista:

- Repositoryn oikea nimi ja Git-origin.
- Työpuun puhtaus.
- Mainin ajantasaisuus.
- Avoimet rinnakkaiset PR:t.
- R2/R3/GK-80-riippuvuudet.
- Käytössä olevan kevennetyn repo_guardin säännöt.

Käytä projektin normaalia suojaus- ja kirjoitusmenettelyä.

Älä luo tarpeettomia hyväksyntävaiheita.

Tavalliset paikalliset tutkimukset, laskelmat, dokumenttien valmistelu ja Draft-PR-työt saa tehdä niille jo annetun valtuutuksen rajoissa.

Jos guard tarvitsee kyllä/ei-päätöksen, esitä täsmälleen, mitä toimintoa hyväksyntä koskee.

Älä käytä guardin kevennystä syynä ohittaa oikean repositoryn tarkistusta tai julkaisurajoja.

---

# 12. GITHUB JA REPORTHUB

Tee GK-80 AJO 2 erilliseen haaraan.

Luo Reseptit-repoon uusi Draft-PR.

Älä muuta Pilotin 1 tutkimushistoriaa, ellei korjaus ole erikseen dokumentoitu.

Tallenna uudet tutkimusaineistot selkeään GK-80-hakemistoon.

Tee ReportHubiin yksi ajon tuloksia kuvaava raportti.

Päivitä GK-80:n etenemismittarit.

Pidä erillään:

- Nykyinen tuotantokattavuus.
- Katselmointiin ehdotetut uudet GK-arvot.
- Hyväksytyt mutta julkaisemattomat arvot.
- Julkaistut arvot.
- Jäljellä oleva matka 80 prosenttiin.

Älä yhdistä PR:iä tai julkaise tuotantoon.

Älä käynnistä seuraavaa ajoa automaattisesti.

---

# 13. LOPPURAPORTTI – TULOKSET ENSIN

Loppuraportin ensimmäisen rivin on kerrottava:

**GK-80 AJO 2 – X/30 reseptille uusi numeerinen GK-ehdotus. Tavoite 10. Päätös GO/PARTIAL/BLOCKED.**

Seuraavaksi:

## A. Tulostavoite

- Kuinka monta uutta numeerista ehdotusta valmistui?
- Kuinka moni on pistearvio?
- Kuinka moni on vaihteluväli?
- Kuinka moni vaatii reseptitäsmennyksen?
- Kuinka moni vaatii vielä merkittävän lähdepäätöksen?
- Täyttyikö tavoite 10?

## B. Uudet GK-laskelmat

Taulukko:

Resepti | CHO g/annos | GK-arvio/alue | Käytetty menetelmä | Epävarmuus | Katselmointitila

Älä sisällytä tähän päätaulukkoon pelkkiä CHO-tuloksia.

## C. Pilotin 1 kolme ehdotusta

Ilmoita erillinen päätös:

- Kahvijogurtti: ACCEPTABLE_FOR_REVIEW / NEEDS_CORRECTION / REJECTED.
- Halloumileipä: sama.
- Harcha: sama.

Perustele jokainen lähde- ja valmistusvastaavuudella.

## D. Laskentamallin parannukset

Kerro:

- Mikä ensimmäisen pilotin automaattinen esto korjattiin?
- Kuinka moni uusi resepti hyötyi korjauksesta?
- Miten pieni tuntematon osuus käsitellään?
- Miten merkittävä epävarmuus käsitellään?
- Ovatko vaihteluvälit nyt helpommin tuotettavissa?

## E. GI-lähteiden vaikutus

Raportoi uusien lähteiden määrä sekä niiden avulla numeerisesti ratkaistujen reseptien lukumäärä.

## F. Keskeneräiset reseptit

Ilmoita lyhyesti jokaiselle 30 kohteesta, miksi mahdollinen numeerinen GK jäi vielä saavuttamatta.

Ei uutta monikymmenen sivun esteiden yleisauditointia.

## G. Kattavuuden etenemä

Näytä:

- Tuotanto ennen ja jälkeen.
- Uudet Draft-ehdotukset.
- Aiemmat Pilotin 1 ehdotukset erikseen.
- Mahdollinen hyväksyttyjen arvojen määrä.
- Jäljellä olevat arvot 261 tavoitteeseen.

## H. Testit

- Tarkat testitulokset.
- CI.
- Lähdehashit.
- Regression tulokset.
- GitHub-linkit.
- ReportHub-linkki.
- Commit-SHA:t.

## I. Seuraava toimenpide

Ehdota vain yksi seuraava rajattu työerä.

Älä aloita sitä automaattisesti.

---

# 14. LOPULLINEN OHJAUS

Tässä ajossa tärkeintä ei ole laaja tutkimusraportti vaan toimiva GK-laskennan läpimurto.

Ensimmäinen pilotti osoitti, että kolme numeerista ehdotusta voidaan laskea toistettavasti. Samalla se osoitti, että nykyinen malli estää liian herkästi kokonaisia reseptejä.

Korjaa tätä ongelmaa.

Käytä lähdeaineistoja tehokkaasti.

Valitse seuraavat reseptit ratkaistavuuden perusteella.

Tee oikeita numeerisia arvioita.

Älä muuta epävarmuutta automaattiseksi esteeksi, jos sen vaikutus voidaan perustellusti kuvata.

Älä myöskään piilota merkittävää epävarmuutta.

**ASETA AJOON SEURAAVAT TAVOITTEET:**

**PÄÄTAVOITE: vähintään 10 uutta numeerista GK-ehdotusta 30 uudesta reseptistä.**

**TEKNINEN TAVOITE: laskentamalli osaa käsitellä pieniä, lähteistetysti rajattavia GI-epävarmuuksia ilman koko reseptin automaattista estoa.**

**KATSELMOINTITAVOITE: Pilotin 1 kolme numeerista ehdotusta on arvioitu erikseen.**

**PITKÄN AIKAVÄLIN TAVOITE: vähintään 261/326 reseptiä saa käyttökelpoisen GK-arvion tai perustellun numeerisen vaihteluvälin.**

Suorita nyt vain AJO 2.

Lopeta, kun 30 reseptin erä, laskentamallin korjaus, testit ja raportointi on tehty. Palauta työ riippumattomaan katselmointiin. Älä tee mergeä tai tuotantodeployta.