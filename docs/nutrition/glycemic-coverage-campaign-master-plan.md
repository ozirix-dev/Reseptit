# CODEX MASTER PLAN – RESEPTIT GI/GK COVERAGE EXPANSION

## Kampanja 2B6E → eteenpäin

**Päätavoite: saada mahdollisimman monelle julkaistulle reseptille tieteellisesti puolustettava, toistettavasti laskettu glykeeminen kuorma (GK).**

**Toissijaiset tavoitteet:** minimoida turhat manuaaliset korjauskierrokset, hyödyntää yhteisiä lähderatkaisuja ja säilyttää aiemmin hyväksyttyjen GK-arvojen luotettavuus.

Tämä on pitkäkestoinen, useisiin itsenäisiin Codex-ajoihin ja PR:iin jaettava kehityskampanja.

Älä suorita koko kampanjaa yhtenä ajona.

Tallenna tämä suunnitelma projektin käytäntöjen mukaiseen sopivaan paikkaan, jotta eri Codex-istunnot voivat jatkaa sitä ilman aiempien keskustelujen kontekstia.

**Tässä ensimmäisessä suorituksessa tehdään vain AJO 0.** Sen jälkeen pysähdytään ja palautetaan analyysiin perustuva seuraavan ajon toteutussuunnitelma. Älä aloita AJO 1:tä automaattisesti.

---

# 1. Projektit ja lähtötilanne

## 1.1 Pääprojekti

GitHub:

https://github.com/ozirix-dev/Reseptit

Tuotantosivusto:

https://ozirix-dev.github.io/Reseptit/

Viimeksi hyväksytty ja julkaistu Reseptit main-SHA:

`cd9a6f4f740b31dc8b52c6c09cc1574cb7a89950`

Viimeksi varmennettu tuotantoajo:

https://github.com/ozirix-dev/Reseptit/actions/runs/40587729118

Tulos: PASS, mukaan lukien GitHub Pages -deploy.

## 1.2 ReportHub

https://github.com/ozirix-dev/ReportHub

Viimeksi varmennettu main:

`067f22a38a2bc6a148190dc1f4b188deab2d0b28`

GI/GK-erien 2B6C ja 2B6D auditoinnit sekä hallinnollinen closeout ovat valmiit ja yhdistetty.

ReportHubin käyttötarkoitus on säilyttää auditointi-, julkaisu- ja päätöshistoria. Se ei omista GK-laskentaa.

## 1.3 GK-laskennan vahvistettu lähtötilanne

| Mittari | Arvo |
|---|---:|
| Julkaistut reseptit | 326 |
| GK laskettu | 138 |
| GK keskeneräinen | 188 |
| GK-kattavuus | 42,3 % |
| GI-tietueet | 45 |
| STRONG GI-tietueet | 6 |
| SUPPLEMENTARY GI-tietueet | 39 |

Tavallisen ravintoarvoauditoinnin viimeksi varmennettu ajotulos:

- 180 lähdenäytöllä tuettua
- 86 uudelleentarkistusta tai riittämätöntä lähdenäyttöä vaativaa
- 60 puuttuvaa
- 0 ristiriitaista

Huomaa: ravintoarvoauditoinnin luokat eivät ole samat kuin GK-laskennan estoluokat. Älä käytä niiden määriä suoraan GK:n laskentavalmiuden mittarina.

Tarkista aluksi ajantasainen tuotanto- ja main-tila. Jos reseptejä on lisätty, käytä uutta todellista määrää äläkä pakota kokoelmaa takaisin 326 reseptiin.

---

# 2. Kampanjan päätavoite

Pyrimme ratkaisemaan mahdollisimman suuren osan 188 keskeneräisestä GK-arviosta.

Ensisijainen onnistumismittari:

**Uusien luotettavasti laskettujen ja tuotantoon julkaistujen GK-arvojen nettolisäys.**

Laskentakaava:

`GK = Σ(GI_i × imeytyvä hiilihydraatti_i annosta kohti) / 100`

Kampanjan onnistumista EI mitata:

- Lisättyjen GI-tietueiden lukumäärällä.
- Tutkittujen verkkosivujen määrällä.
- Muutettujen lähdetiedostojen määrällä.
- Luotujen PR:ien määrällä.
- Tuotettujen raporttien määrällä.
- Laskennallisesti mahdollisten mutta julkaisemattomien arvioiden määrällä.

Onnistuminen tarkoittaa, että aiemmin keskeneräinen resepti saa hyväksyttävän GK-arvion, kaikki tarkistukset läpäisevät ja arvo julkaistaan onnistuneesti.

Jos tutkimus osoittaa, ettei arvoa voida puolustettavasti laskea, sen pitää jäädä keskeneräiseksi.

**Määrällinen tavoite ei koskaan oikeuta keksittyä GI-arvoa.**

---

# 3. Laskennan ehdottomat turvallisuussäännöt

## 3.1 Säilytä nykyinen laskentamalli

Älä muuta kampanjan yhteydessä:

- GK-kaavaa.
- GK-luokkarajoja.
- Historiallisia baselineja.
- GI-asteikon muunnossääntöjä ilman erillistä katselmointia.
- LOW-confidence-luokittelun yleistä logiikkaa.
- Reseptiversioiden fingerprint-valvontaa.
- Julkaisun fail-closed-periaatetta.

Nykyisen mallin korvaaminen yksinkertaisemmalla kaavalla ei ole hyväksyttävä kattavuuden kasvatuskeino.

## 3.2 GI-lähteen vastaavuus

GI-arvoa saa käyttää vain, kun lähteen mitattu ruoka vastaa laskettavaa raaka-ainetta tai kun nykyinen lähdepolitiikka sallii perustellun, dokumentoidun analogian.

Tarkista ainakin:

1. Elintarvike ja ruokaperhe.
2. Raaka, keitetty, höyrytetty, paistettu tai leivottu muoto.
3. Jalostusaste.
4. Tuotteen koostumus.
5. GI-asteikko ja vertailuruoka.
6. Tutkimusmenetelmä ja osallistujat.
7. GI-lähteen alkuperä ja julkaistavuus.
8. Lähteen soveltuvuus reseptin valmistusohjeisiin.

**Älä käytä valmistustapaan sopimatonta GI:tä vain siksi, että ainesosan nimi on sama.**

Erityisen tärkeät aiemmin todetut virheet:

- Riisin GI ei ole riisiviinietikan GI.
- Maidon GI ei ole maitosuklaan GI.
- Kookosmaitoa sisältävän riisipuuron GI ei ole kookosmaidon GI.
- Raa'an tomaatin GI ei automaattisesti ole kypsän tomaattimurskan GI.
- Tavallisen tortillan GI ei automaattisesti ole rapean tostadan GI.
- Tumman suklaan GI ei automaattisesti ole paistetun suklaakakun GI.
- Höyrytetyn, öljyllä valmistetun mannasuurimon GI ei ole vesikeitetyn öljyttömän puuron GI.
- Kuivattujen taateleiden GI ei automaattisesti ole keitetyn taateliseoksen GI.

Jos vastaavuus on osoittamatta, pidä estot voimassa.

## 3.3 Pienosuuksien käsittely

Käytä nykyistä hyväksyttyä GK-politiikkaa:

- Yksittäisen GI-osumattoman ainesosan imeytyvä hiilihydraatti alle 1 g/annos.
- Kaikkien pois jätettävien GI-osumattomien ainesosien summa alle 2 g/annos.
- Tasan 1 g yksittäiselle tai 2 g yhteensä ei täytä tiukkaa alle-rajaa.
- Pois jätetty määrä on dokumentoitava ja tarvittaessa näytettävä.
- Luottamus on matala, jos arviossa käytetään hyväksyttyä pienosuustoleranssia.

**Älä sekoita GK:n pienosuustoleranssia tavallisen ravintoarvomallin omiin epävarmuusrajoihin.**

Tuntematonta hiilihydraattimäärää ei saa tulkita pieneksi ilman riittävää ylärajaa.

## 3.4 Nollat

Lähteistetty nolla on hyväksyttävä arvo.

Puuttuva GI ei ole nolla.

Puuttuva hiilihydraattitieto ei ole nolla.

Rasva-, liha-, liemi-, kastike- tai maustetietuetta ei saa automaattisesti merkitä GI 0 -arvoiseksi.

Päättely aineksen vähäisestä hiilihydraattiosuudesta on tehtävä todellisen koostumuksen ja reseptimäärän perusteella.

## 3.5 Ravintotiedot

Käytä ensisijaisesti projektin nykyisiä lähdeaineistoja:

- Fineli Release 20
- Australian Food Composition Database Release 3
- Health Canada CNF 2026
- Projektin hyväksytyt muut lähdetietueet
- Täsmälliset tuotekohtaiset ravintoarvot, kun vastaavuus on todistettu

Noudata lähdeaineiston hiilihydraattimääritelmää ja lisenssiehtoja.

Älä yhdistä kuitua sisältävää kokonais­hiilihydraattia suoraan imeytyvään hiilihydraattiin.

Älä oleta tuntemattomia polyoleja nolliksi.

Älä käytä tuntematonta annospainoa tai tuotekohtaista yksikkömuunnosta.

---

# 4. Koko kampanjan toteutusperiaate

## 4.1 Yksi Codex-ajo kerrallaan

Yksi ajo tekee yhden rajatun tehtävän.

Kun ajo valmistuu:

1. Muutokset tallennetaan.
2. Testit suoritetaan.
3. Draft-PR avataan tarvittaessa.
4. GitHub Actions -CI varmennetaan.
5. Codex antaa loppuraportin.
6. Työ pysähtyy riippumatonta katselmointia varten.

Seuraavaa ajoa ei aloiteta samanaikaisesti.

## 4.2 Työpuuturvallisuus

Jokaisen ajon alussa:

- Tarkista oikea Git-origin `ozirix-dev/Reseptit`.
- Varmista oikea paikallinen checkout.
- Varmista ettei Codex-projektin polku osoita Ravinto-repoon.
- Tarkista repo_guard ja mahdollinen projektikohtainen turvatarkistin.
- Tarkista `main`-HEAD.
- Tarkista avoimet PR:t ja muut aktiiviset työpuut.
- Älä muokkaa toisen ajon työpuuta.
- Älä poista säilytettyjä työpuita.
- Älä tee force-pushia.

Erityisesti aiempi 325/326-reseptiristiriita osoitti, että rinnakkaiset resepti- ja GK-ajot voivat aiheuttaa integraatiovirheen.

## 4.3 Yksi hyväksyttävä muutoskokonaisuus

Pääsääntöisesti yksi PR saa käsitellä noin 5–15 reseptin valittua työjoukkoa.

Yhteisen GI-lähderatkaisun tapauksessa useampia reseptejä voidaan käsitellä samalla PR:llä, jos:

- Lähteen käyttö on yhdenmukaista.
- Kaikki reseptit tarkistetaan yksilöllisesti.
- PR on katselmoitavissa.
- Testit kattavat kaikki muutokset.
- Vanhojen arvojen regressiosuojaus säilyy.

Älä muodosta yhtä valtavaa 188 reseptin muutosta.

---

# 5. AJO 0 – kaikkien 188 reseptin laskentapotentiaalin analyysi

**Tämä on ensimmäinen nyt suoritettava ajo.**

Tavoite: löytää parhaat käytännössä laskettavissa olevat reseptit ja luoda mitattava etenemisjärjestys.

## 5.1 Lue nykyiset lähteet

Tutki Reseptit-mainista vähintään:

- `docs/nutrition/README.md`
- `docs/nutrition/glycemic-coverage-batch-2b6d-review.md`
- `docs/nutrition/glycemic-coverage-batch-2b6d-current.json`
- `docs/nutrition/glycemic-coverage-batch-2b6d-current.md`
- `docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json`
- `docs/nutrition/glycemic-index-records.json`
- `docs/nutrition/glycemic-load-pilot-input.json`
- Nykyinen GK-laskentakoodi.
- Nykyiset regressiotestit.
- Reseptikohtaiset ravintoarvolaskentasyötteet.

Älä käytä vanhojen raporttien lukumääriä nykytilana tarkistamatta niitä uudesta inventaariosta.

## 5.2 Uudelleenluokittele kaikki keskeneräiset reseptit

Rakenna jokaiselle reseptille koneellisesti tuotettu analyysi, jossa näkyvät:

- Resepti-ID.
- Nykyinen GK-tila.
- Ravintoarvoauditoinnin tila.
- Annosmäärä.
- Ainesosat, joiden GI on hyväksytty.
- Ainesosat, joilta GI puuttuu.
- Ainesosat, joiden GI-vastaavuus on virheellinen tai epävarma.
- Puuttuvat koostumustiedot.
- Puuttuvat määrät tai yksikkömuunnokset.
- Valmistustapapoikkeamat.
- Rakenne- ja fingerprint-estot.
- Reseptivaihtoehtojen epäselvyys.
- Pienosuustoleranssin ylitykset.
- Muiden samanaikaisten esteiden lukumäärä.

Tarkista, onko aiemmista estoista jo tullut vanhentuneita uusien tietueiden tai korjausten vuoksi.

Luo jokaiselle keskeneräiselle reseptille **ensisijainen työlinja**, mutta säilytä myös kaikki päällekkäiset estot.

## 5.3 Reseptien etenemisluokat

Luokittele jokainen resepti yhteen ensisijaiseen luokkaan:

**A – lähes laskentavalmis**

Vain pieni, todennettavissa oleva sidonta-, syöte- tai dokumentointivirhe.

**B – olemassa olevan GI-lähteen hyväksyttävä uudelleenkäyttö**

GI-lähde on jo katalogissa, mutta sen vastaavuus on tutkittava reseptikohtaisesti.

**C – uusi GI-lähde tarvitaan**

Koostumus ja määrä ovat pääosin selvillä; puuttuva GI on merkittävin este.

**D – ravintoarvo- tai koostumustiedot puuttuvat**

Ennen GK:tä tarvitaan täydellinen, toistettava ravintoarvolaskelma.

**E – massa, annos tai valmistus on epäselvä**

Reseptin laskentasyötteen määrittely vaatii täsmennyksen.

**F – reseptirakenne tai syöteversio on ristiriitainen**

Vanhentunut tai väärin sidottu laskentasyöte estää julkaisun.

**G – useita toisistaan riippumattomia vaikeita esteitä**

Laskenta ei todennäköisesti valmistu yhdellä korjauksella.

**H – toimituksellinen päätös tarvitaan**

Arvo voisi tulla laskettavaksi vain reseptin aidolla muutoksella tai skenaarion valinnalla.

Varmista, että luokkien yhteenlaskettu reseptimäärä vastaa keskeneräisten reseptien todellista määrää.

## 5.4 Etsi yhteisiä pullonkauloja

Laske jokaiselle puuttuvalle tai epävarmalle ainesosaperheelle:

- Kuinka monessa keskeneräisessä reseptissä se esiintyy.
- Kuinka monessa se on merkittävä este.
- Kuinka monessa se on ainoa olennainen este.
- Kuinka monessa kaikki muut esteet ovat jo ratkaistavissa.
- Kuinka paljon hiilihydraattia se tuo annosta kohti.
- Onko luotettava lähde jo olemassa.
- Kuinka suuri määrä uusia GK-arvoja voisi avautua yhdellä hyväksytyllä ratkaisulla.
- Mikä on epävarmuus ja toteutustyön määrä.

Älä laske päällekkäisiä reseptejä kahteen kertaan arvioidessasi nettolisäystä.

## 5.5 Priorisointimalli

Aseta jokaiselle ehdokkaalle arviot:

- Potentiaalinen nettolisäys.
- Lähdenäytön saatavuus.
- Korjaustyön määrä.
- Jäljelle jäävien esteiden määrä.
- Reseptin vaikutusalue.
- Regressioriski.
- Todennäköisyys valmistua hyväksyttäväksi yhden pienen PR:n aikana.

Priorisoi ensisijaisesti:

**Todennäköinen uusi hyväksytty GK-arvo / toteutustyö ja riski.**

Älä priorisoi vain sen perusteella, kuinka usein jokin ainesosa esiintyy.

Jos yhdessä reseptissä on viisi merkittävää estettä, yhden niistä korjaaminen ei vielä tuota GK-arvoa.

## 5.6 AJO 0:n tulokset

Tuota:

1. Koneellisesti jäljitettävä inventaario kaikista keskeneräisistä resepteistä.
2. Työlinjakohtainen yhteenveto.
3. Kymmenen suurimman yhteisen esteperheen taulukko.
4. 20 parasta yksittäistä reseptiehdokasta.
5. Viisi parasta yhteistä lähdekorjausta.
6. Suositus ensimmäiseksi toteutuseräksi.
7. Arvio ensimmäisen erän realistisesta nettolisäyksestä.
8. Selkeät syyt resepteille, joita ei vielä kannata käsitellä.

Suunnitelma pitää tallentaa Reseptit-repoon soveltuvaan suunnitteludokumenttiin. Vältä suurten koneellisten inventaarioiden tarpeetonta kopiointia ReportHubiin.

AJO 0 ei julkaise GK-arvoja eikä muuta laskentamallia.

**Pysähdy AJO 0:n jälkeen.**

---

# 6. AJO 1 – ensimmäinen nopeat voitot -erä

Tavoite: saada mahdollisimman monta uutta hyväksyttyä GK-arvoa pienellä muutoksella.

Valitse AJO 0:n analyysin perusteella 5–15 lupaavinta reseptiä.

Suosi erityisesti:

- Vanhentunutta mutta turvallisesti korjattavaa syötesidontaa.
- Jo lähteistettyä ainesosaa, jonka GI-sidos puuttuu teknisestä syystä.
- Oikean valmistustavan jo dokumentoitua GI-lähdettä.
- Todennettua mittayksikkömuunnosta.
- Pientä GI-osumatonta hiilihydraattiosuutta, joka täyttää nykyiset rajat.
- Tilannetta, jossa kaikki muut reseptin estot ovat jo ratkenneet.

Jokaisen ehdotetun muutoksen tulee tuottaa todellinen GK-laskennan tilamuutos tai olla perusteltu välttämätön osa samaa laskentakokonaisuutta.

### Laskennan vaatimukset

Jokainen uusi laskettu arvo tarvitsee:

- Toistettavan laskentasyötteen.
- Lähteistetyt imeytyvät hiilihydraatit.
- Hyväksyttävät GI-sidonnat.
- Oikean annosmäärän.
- Dokumentoidut yksikkömuunnokset.
- Oikean valmistustapavastaavuuden.
- Lasketun GK/annos-arvon.
- GK-luokan.
- Luottamusluokan.
- Mahdollisten pois jätettyjen pienosuuksien määrät.
- Fingerprintien ja regressiotestien läpäisyn.

### AJO 1:n toimitus

Avaa yksi Draft-PR.

Raportoi ennen/jälkeen:

- Reseptimäärä.
- Laskettu GK.
- Keskeneräinen GK.
- Uudet GK-arvot resepteittäin.
- Ei-numeraalisten ratkaisujen määrä.
- Vanhat GK-arvot, jotka mahdollisesti muuttuisivat.
- CI-tulos.

Älä yhdistä PR:ää automaattisesti.

---

# 7. AJO 2 – tomaatti- ja tomaattivalmisteiden lähdekatselmointi

Tämä on aiemmin tunnistettu lupaava yhteinen esteperhe.

Historiallinen 2B6D-analyysi tunnisti:

- 35 keskeneräistä tomaattia sisältävää reseptiä.
- 23 ensisijaisesti GI-lähteen tarkistusta odottavaa.
- Näistä 8 ravintoarvoiltaan tuettua ehdokasta.

Aloita seuraavista vain, jos AJO 0:n nykyinventaario vahvistaa niiden olevan edelleen relevantteja:

- `tabbouleh`
- `paprikainen-vhh-gulassi`
- `kana-enchilada-kukkakaalivuoka`
- `ropa-vieja`
- `kanapyorykat-tomaattikastike`
- `paella-valenciana`
- `valimerellinen-farinata-aamupalaksi`
- `bouillabaisse`

### Tutkimustehtävä

Selvitä, onko ihmisillä mitattua, vertailukelpoista GI-lähdenäyttöä:

- Tuoreelle tomaatille.
- Kypsennetylle tomaatille.
- Tomaattimurskalle.
- Tomaattisoseelle.
- Tomaattipyreelle.
- Tomaattikastikkeelle.

Älä yhdistä näitä automaattisesti yhdeksi GI-tietueeksi.

Arvioi erikseen, voidaanko joidenkin reseptien tomaattiosuus dokumentoida todellisuudessa niin pieneksi, ettei sen puuttuva GI estä nykyisten sääntöjen mukaista laskentaa.

### Lopetusehto

Jos lähteet eivät täytä vastaavuusvaatimuksia, älä käytä raakatomaatin GI:tä kypsälle valmisteelle.

Siirrä tällaiset reseptit perusteltuina takaisin keskeneräisten jonoon ja valitse seuraava parempi kohde.

Älä käytä koko kampanjaa toistuvaan tomaatti-GI:n tuloksettomaan etsimiseen.

---

# 8. AJO 3 – rakenne-, reseptiversio- ja fingerprint-estot

Tavoite: avata reseptejä, joilla ei välttämättä ole aitoa ravitsemustieteellistä lähdepuutetta.

Etsi tapaukset, joissa:

- Reseptin rakenne on muuttunut.
- Laskentasyöte perustuu aiempaan reseptiversioon.
- Ainesosien järjestys tai tunnisteet eivät vastaa nykyistä syötettä.
- Reseptin annosmäärä on korjattu mutta syöte on vanha.
- Lähde-ID on vaihtunut ilman varsinaista koostumusmuutosta.
- Kattavuusinventaarion ja laskentasyötteen välinen sidonta on vanhentunut.

Korjaa nämä yksilöllisesti.

**Pelkkä fingerprintin päivittäminen ilman reseptin ja laskennan tarkistamista on kielletty.**

Jos reseptin aineksissa tai määrissä on tapahtunut todellinen muutos, laske tulos uudelleen ja arvioi vaikutus.

Älä käsittele kaikkia rakennevirheitä teknisenä massakorjauksena.

### Hyötytavoite

Etsi erityisesti reseptejä, joiden kaikki GI- ja koostumustiedot ovat jo hyväksyttäviä.

Nämä ovat mahdollisia nopeita GK-kattavuuden parannuksia ilman uutta kirjallisuustutkimusta.

---

# 9. AJO 4 – ravintoarvojen ja koostumustietojen täydennys

Tavoite: ratkaista sellaiset esteet, jotka eivät vaadi uuden GI-lähteen keksimistä.

Tutki ensiksi reseptit, joilla:

- GI-lähteet ovat valmiina.
- Ravintoarvot ovat pääosin tiedossa.
- Yksi tai muutama ravintoarvo- tai yksikkömuunnos estää laskennan.

Hyödynnä olemassa olevia viiteaineistoja ennen uusia verkkohakuja.

### Hyväksyttäviä korjauskohteita

- Täsmällinen Fineli-tuotetietue.
- Täsmällinen AFCD-tuotetietue.
- Lähteistetty tilavuus–massa-muunnos.
- Syötävän osuuden oikea käsittely.
- Oikea raaka-/kypsäpainon erottelu.
- Ravintoarvon ilmoittaman hiilihydraattimääritelmän korjaus.
- Dokumentoidun polyolimäärän oikea käsittely.
- Aiemmin puuttuneen laskentasyötteen täydentäminen.

### Kiellettyä

- Yleinen dl→g-oletus kaikille elintarvikkeille.
- Tuntemattoman massan valitseminen laskennan avaamiseksi.
- Tuotteen korvaaminen ravitsemuksellisesti erilaisella tuotteella ilman perustetta.
- Kokonaishiilihydraatin käsittely imeytyvänä hiilihydraattina.
- Lähteettömät nollat.

Älä tee suurta uutta ravintoarvokampanjaa pelkästään lukumäärän vuoksi.

Priorisoi reseptit, joiden GK todennäköisesti avautuu samalla kertaa.

---

# 10. AJO 5 – toistuvien GI-lähdepuutteiden kampanja

Tässä vaiheessa tutkitaan yhteiset puuttuvat GI-lähteet sen perusteella, kuinka monta GK-arvoa yksi onnistunut ratkaisu voi avata.

Aiemmin tunnettuja ongelmaryhmiä:

| Ainesosaperhe | Historiallisesti havaittu ongelma |
|---|---|
| Kookosmaito | Useita reseptejä, GI-vastaavuus puuttuu |
| Soijakastike | Pieniä ja osin merkittäviä hiilihydraattiosuuksia |
| Liemet | Tuotteen ja koostumuksen vaihtelu |
| Tamarinditahna | Ainesosakohtainen GI puuttuu |
| Lanttu | Valmistustapaan sopiva GI puuttuu |
| Hunaja | Tuotteen ja valmistustavan vastaavuus |
| Papaija | Tuotemuoto ja mittauksen vastaavuus |
| Maissitortilla/tostada | Valmistustapojen ero |
| Kypsennetyt taatelit | Kypsennyksen vaikutus |
| Manna ja mannasuurimo | Ruoka- ja valmistusmuotojen erot |

### Tutkimusjärjestys

Valitse aina se ainesosaperhe, jonka korjaamisesta on suurin odotettu nettokattavuushyöty.

Ennen laajaa lähdetutkimusta selvitä, kuinka monella reseptillä tämä on **ainoa tai viimeinen merkittävä ratkaisematon este**.

Jos lähteen löytyminen ei vielä avaa reseptiä, arvioi muiden esteiden ratkaistavuus.

### Lähteiden arviointi

Suosi:

- Alkuperäisiä ihmisillä tehtyjä GI-tutkimuksia.
- International Tables -julkaisujen yksilöityjä tietueita.
- Vertaisarvioituja elintarvikekohtaisia mittauksia.
- Alkuperäislähteen tarkistettavaa menetelmäkuvausta.

Älä käytä:

- Hakukoneen automaattisia katkelmia ainoana todisteena.
- Epäselviä GI-listoja ilman alkuperää.
- Sekoiteaterian GI:tä yksittäisen ainesosan GI:nä.
- Väärän ruokaperheen keskiarvoa.
- Uutta geneeristä GI:tä vain kattavuuden kasvattamiseksi.

Jos tutkimus ei tuota hyväksyttävää lähdettä, kirjaa päätös lyhyesti ja siirry seuraavaan kohteeseen.

---

# 11. AJO 6 – vaihtoehtoiset valmistustavat, reseptirakenne ja epäselvät määrät

Tämä työlinja voi vaikuttaa moniin resepteihin, mutta on sisällöllisesti riskialttiimpi.

Tarkista esimerkiksi:

- "Vettä tai lientä".
- "Öljyä tarvittaessa".
- "Kastiketta maun mukaan".
- Vaihtoehtoiset jauhot.
- Vaihtoehtoiset makeuttajat.
- Määrittelemätön kastiketiiviste.
- Paistossa imeytyvän öljyn tuntematon määrä.
- Epäselvä annosmäärä.
- Punnitsematon pääainesosa.

### Päätöspolut

**Polku A: laskentasyötteen todistettava korjaus**

Reseptin nykyinen tarkoitus ja aineksien todelliset määrät ovat selviä, mutta laskentasyöte on puutteellinen.

Korjaa syöte.

**Polku B: reseptin toimituksellinen täsmennys**

Resepti on aidosti epäselvä ja sen muuttaminen vaikuttaisi valmistusohjeeseen tai raaka-aineisiin.

Laadi ehdotus ja pysäytä se erillistä hyväksyntää varten.

**Polku C: useita aidosti vaihtoehtoisia reseptiversioita**

Älä laske kaikkia vaihtoehtoja yhdeksi keksityksi keskiarvoksi.

Ehdota erillistä skenaariota tai versiota vain, jos se sopii sivuston nykyiseen tietomalliin ja vaatii hyväksytyn erillisen muutoksen.

### Sisältömuutosten hyväksyntä

Älä muuta ruokalajin luonnetta vain saadaksesi GK-arvon.

Esimerkiksi riisin vaihtaminen kukkakaaliriisiin, sokerin poistaminen tai kastikkeen korvaaminen vedellä voi olla hyvä uusi resepti, mutta ei automaattisesti hyväksyttävä korjaus alkuperäiseen reseptiin.

Toimituksellisesti merkittävät muutokset tehdään erillisessä, selkeästi kuvatussa PR:ssä.

---

# 12. AJO 7 – jo laskettujen GK-arvojen lähdelaadun tarkistus

Tämä on erillinen laatutyölinja, ei kattavuuden kasvatuserä.

Tarkista neljän aiemmin lasketun mannasuurimoreseptin GI-sidonnat:

- `intialainen-rava-uttapam`
- `pohjoisafrikkalainen-baghrir`
- `pohjoisafrikkalainen-msemen-hunajalla`
- `pohjoisafrikkalainen-harcha-juustolla`

Nykyiset sidonnat perustuvat mannasuurimon leivonnaisryhmän GI-vastaavuuteen.

Tarkista jokaiselle:

1. Valmistustapa.
2. GI-lähteen täsmällinen ruoka.
3. Paistamisen tai muun käsittelyn vaikutus vastaavuuteen.
4. Muut GI-lähteet.
5. Nykyisen GK-arvon luottamus.

Mahdolliset ratkaisut:

- Nykyinen lähde kelpaa ja arvo säilyy.
- Parempi lähde löytyy ja arvo lasketaan uudelleen.
- Nykyinen vastaavuus ei kelpaa ja GK on estettävä.

**Älä säilytä virheellistä GK-arvoa vain siksi, että kokonaiskattavuus muuten laskisi.**

Raportoi mahdollinen vähenemä avoimesti.

Katselmoi tämä erillään uusien GK-arvojen julkaisusta, jotta syyt ovat jäljitettävissä.

---

# 13. AJO 8 – vaikeiden reseptien loppuluokitus

Kun helpot ja kohtuullisen vaikeat tapaukset on käsitelty, analysoi jäljellä olevat.

Jaa ne kolmeen ryhmään.

### Ryhmä 1 – laskenta mahdollinen nykyisillä tiedoilla

Kaikki kriittiset lähde- ja määrätiedot ovat olemassa, mutta aiemmat erät eivät ole vielä käsitelleet reseptiä.

Jatka laskentaa.

### Ryhmä 2 – laskenta mahdollinen lisätutkimuksella

Tietyn hyväksyttävän lähteen tai koostumustiedon saaminen voisi avata GK:n.

Priorisoi tutkimuksen vaikuttavuuden perusteella.

### Ryhmä 3 – ei puolustettavasti laskettavissa nykyisillä lähteillä

Merkittävä GI- tai koostumustieto puuttuu, eikä hyväksyttävää analogiaa löydy.

Säilytä GK arvossa `null`.

Lisää täsmällinen selitys esteestä.

Älä pakota reseptiä ryhmästä 3 ryhmään 1 vain kattavuustavoitteen vuoksi.

---

# 14. AJO 9 – numeeristen vaihteluvälien erillinen arviointi

Tämä on erillinen tuleva suunnittelutehtävä.

Projektissa on aiemmin pohdittu, voisiko keskeneräiselle GK-arvolle esittää esimerkiksi vaihteluvälin 30–35.

Tätä ei saa käyttää automaattisena kiertotienä nykyisiin GI-lähdepuutteisiin.

Mahdollinen vaihteluväli edellyttää, että:

- Sen ala- ja ylärajalla on lähteistetty peruste.
- Kaikki olennaiset hiilihydraattiosuudet tunnetaan.
- GI-epävarmuuden rajat perustuvat todelliseen, saman ruokamuodon näyttöön.
- Valmistustapaan sopimattoman GI:n käyttöä ei piiloteta väliin.
- Vaihteluväliä ei esitetä mitattuna tarkkuutena.
- Erottelu hyväksytyn GK:n ja kokeellisen vaihteluväliarvion välillä on selvä.

Tarkista olemassa olevien tähän liittyvien konsepti-PR:ien tilanne ennen uutta suunnittelua.

Älä toteuta vaihteluväliominaisuutta tämän kattavuuskampanjan sivutuotteena.

Laadi tarvittaessa erillinen ehdotus myöhempää päätöstä varten.

---

# 15. AJO 10 – toistuvat pienet GK-kattavuuserät

Kun AJO 0–8:n löydöksistä syntyy uusi priorisoitu työjono, jatka samoilla periaatteilla.

Yksi laskentaerä voi avata:

- Yhden reseptin.
- Viisi reseptiä.
- Kymmenen reseptiä.
- Tai enemmän, jos yksi todistettavasti hyväksyttävä yhteinen lähderatkaisu avaa useita reseptejä turvallisesti.

Älä pakota jokaisesta erästä kymmentä uutta arvoa.

Muodosta jokainen erä sen perusteella, mitkä reseptit voidaan käsitellä yhdessä laadukkaasti.

**Jatka kunnes uudet hyväksyttävät GK-arvot loppuvat tai jäljellä olevat esteet tarvitsevat uusia lähteitä, reseptimuutoksia tai omistajan päätöksiä.**

Älä pysähdy automaattisesti ensimmäisen 160 tai 190 arvon tavoitteen saavuttamisen jälkeen.

---

# 16. Jokaisen laskentaerän testaus

Kaikki komennot suoritetaan oikeasta `site/`-hakemistosta, ellei repon ajantasainen ohjeistus määrää muuta.

Perustarkistukset:

```bash
npm run content:sync
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
npm run audit:glycemic-coverage
npm run test:glycemic
npm test
npm run test:select-ci
npm run build
npm run test:static
```

Jos julkaistun reseptin sisältö muuttuu, suorita lisäksi tarvittavat käännös-, changed-content- ja selain-/julkaisutestit.

Noudata CI:n riskiperusteista FAST-FIRST-valintaa, mutta varmista, että GK-laskentaa muuttava PR suorittaa myös GK-regressiot ja kattavuusauditoinnin.

## 16.1 Baseline-suojaus

Jokaisessa laskentaerässä:

- Lukitse hyväksytty lähtötilanne.
- Älä ylikirjoita historiallisia baselineja.
- Vertaa aiemmin laskettuja reseptejä resepti-ID:n perusteella.
- Tarkista kaikki uudet laskettavat reseptit.
- Tarkista jokainen aiemmin laskettu mutta nyt estetty resepti.
- Tarkista jokainen numeerisesti muuttunut vanha arvo.
- Estä vanhentuneeseen laskentasyötteeseen perustuva julkaisu.
- Varmista yleisen ja eräkohtaisen nykyinventaarion yhdenmukaisuus.

Älä rakenna kiinteää 326 reseptin odotuslistaa takaisin järjestelmään.

Uusien reseptien tulee tulla mukaan dynaamisesti.

## 16.2 Nettolisäyksen laskenta

Raportoi jokaisen erän tulokset:

`uudet lasketut − aiemmin laskettuina olleiden estot = nettolisäys`

Jos esimerkiksi uusia avautuu 8 mutta 2 aiempaa estyy, nettolisäys on +6.

Älä laske GI-tietueiden lisäyksiä GK-kattavuushyödyksi.

Älä laske keskeneräiselle reseptille tuotettua osittaista arviota julkaistuksi GK-arvoksi.

## 16.3 Julkaisuportti

PR voidaan merkitä riippumattomaan katselmointiin valmiiksi vasta, kun:

- Laskentasyötteet ovat toistettavia.
- GI-lähteet ja valmistustavat on dokumentoitu.
- Kattavuusinventaario täsmää.
- Regressiotestit läpäisevät.
- CI on PASS viimeisimmällä HEADilla.
- Vanhojen arvojen muutokset on selitetty.
- Draft-PR:n diff on rajattu ja katselmoitavissa.

Ei automaattista mergeä tai tuotantojulkaisua ilman erillistä hyväksyntää.

---

# 17. Kampanjan laadunmittarit

Pidä jokaisessa erässä samat mitattavat laatutiedot.

## A. Kattavuus

- Reseptejä yhteensä.
- Laskettuja GK-arvoja.
- Keskeneräisiä GK-arvoja.
- Kattavuusprosentti.
- Nettomuutos edelliseen julkaisuun.

## B. Lähteiden laatu

- Uudet STRONG GI-tietueet.
- Uudet SUPPLEMENTARY GI-tietueet.
- Suorat mitatut GI-osumat.
- Hyväksytyt analogiat.
- Käytettyjen pienosuustoleranssien määrä.
- LOW-confidence-arviot.
- Hylätyt lähde-ehdokkaat.

## C. Regressiot

- Vanhat muuttumattomat arvot.
- Vanhat numeerisesti muuttuneet arvot.
- Vanhat nyt estetyt arvot.
- GK-luokkaa vaihtaneet arvot.
- Resepteihin liittyvät fingerprint-muutokset.

## D. Jäljellä olevat esteet

- GI puuttuu.
- GI-vastaavuus puuttuu.
- Koostumus puuttuu.
- Määrä tai massa puuttuu.
- Reseptin rakenne on epäselvä.
- Valmistustapa on epäselvä.
- Toimituksellinen päätös tarvitaan.

Näistä muodostetaan jatkuvasti päivittyvä työjono.

---

# 18. GitHub- ja ReportHub-käytäntö

## 18.1 Reseptit on varsinainen toteutusrepo

Kaikki GK-laskentaan liittyvät muutokset tehdään Reseptit-repoon.

Raportointikonteksti ei saa estää varsinaista arvonlaskentaa.

## 18.2 ReportHubin käyttö

ReportHubiin tallennetaan merkittävien erien:

- Hyväksytty tulos.
- Lopullinen HEAD.
- Merge-SHA.
- CI.
- Pages-julkaisu.
- Kattavuuden nettomuutos.
- Olennaiset uudet lähde- ja laatupäätökset.
- Merkittävät epäonnistumiset ja niiden korjaukset.

Älä käynnistä erillistä raskasta ReportHub-PR-ketjua jokaiselle pienelle lähdehavainnolle.

Pidä yksityiskohtainen reseptikohtainen tutkimus Reseptit-repossa ja säilytä ReportHubissa merkittävien julkaisujen koosteet.

ReportHubin projektikortin tiedot päivitetään hyväksytyn tuotantojulkaisun jälkeen.

Älä päivitä tuotantokattavuutta Draft-PR:n arvioilla.

---

# 19. Ajokohtainen vakioraportti

Jokaisen AJO 1:stä eteenpäin tehdyn toteutuserän lopussa raportoi:

## A. Lähtötilanne

- Main-SHA.
- Reseptejä.
- GK laskettu.
- GK keskeneräinen.
- GI-tietueet.

## B. Tutkitut reseptit

Taulukko:

| Resepti | Lähtöeste | Ratkaisu | Uusi GK/annos | Luottamus | Päätös |
|---|---|---|---:|---|---|
| ID | Syy | Lähde/korjaus | Arvo tai null | STRONG/LOW tai mallin mukainen | CALCULATED/BLOCKED |

Ilmoita täsmällisesti, mitkä arvot ovat hyväksyttyjä ja mitkä vain tutkimusvaiheen ehdokkaita.

## C. Nettotulos

- Uudet hyväksyttävät laskennat.
- Vanhat estetyt.
- Nettolisäys.
- Uusi GK-kattavuus.
- Jäljellä keskeneräiset.

## D. Testit

- Paikalliset tarkistukset.
- CI-linkki ja HEAD.
- Virheet.
- Regressiomuutokset.

## E. Pull request

- PR-linkki.
- Haara.
- HEAD-SHA.
- Draft/Ready.
- Mergeable.
- Avoimet review-ketjut.

## F. Seuraava paras työ

Ilmoita seuraava suositeltu erä ja sen laskentapotentiaali.

Älä kirjoita uutta laajaa yleisraporttia joka kerta, jos tulokset voidaan ilmaista selkeällä eräkohtaisella taulukolla.

---

# 20. Kampanjan onnistumistasot

Käytä seuraavia suuntaa-antavia välitavoitteita.

| Tavoitetaso | GK laskettu | Kattavuus 326 reseptillä |
|---|---:|---:|
| Lähtötilanne | 138 | 42,3 % |
| Ensimmäinen tavoite | 160 | 49,1 % |
| Toinen tavoite | 190 | 58,3 % |
| Kolmas tavoite | 220 | 67,5 % |

Tavoitteet ovat ehdollisia ja voivat muuttua reseptimäärän muuttuessa.

**Älä lupaa tiettyä nettolisäystä ennen lähdetutkimusta.**

Jos 160 arvon raja jää saavuttamatta, raportoi syyt.

Jos 220 arvon raja voidaan ylittää hyväksyttävillä lähteillä, jatka.

Varsinainen pitkän aikavälin tavoite on mahdollisimman täydellinen kattavuus.

Tavoitetta 326/326 ei pidä väittää mahdolliseksi ennen kuin kaikkien jäljellä olevien reseptien lähde- ja määräesteet on ratkaistu.

---

# 21. STOP-ehdot

Pysäytä käynnissä oleva toteutuserä ja raportoi, jos:

1. Git-origin tai työpuu on väärä.
2. Main on muuttunut eikä sen vaikutusta ole selvitetty.
3. Historiallinen baseline muuttuu odottamatta.
4. Yleinen ja eräkohtainen GK-inventaario ovat ristiriidassa.
5. Laskentatulos vaatii perusteettoman GI-oletuksen.
6. Uusi lähde kuuluu väärään ruokaperheeseen.
7. Merkittävä ainesosa jää ilman hiilihydraattimäärää.
8. Reseptin muuttaminen olisi välttämätöntä ilman toimituksellista hyväksyntää.
9. Aiempi hyväksytty GK-arvo estyy ilman dokumentoitua syytä.
10. GI/GK-regressiot tai CI epäonnistuvat.
11. Muutos alkaa laajentua hallitsemattomasti muihin projektin ominaisuuksiin.

STOP tarkoittaa, että vaarallinen muutos jätetään toteuttamatta. Riippumattomat, jo kelvollisiksi todetut ehdokkaat saa säilyttää erillisessä turvallisessa muutoksessa.

---

# 22. Ensimmäisen suorituksen täsmällinen toimeksianto

**SUORITA NYT VAIN AJO 0.**

Tee tässä järjestyksessä:

1. Varmista oikea Reseptit-repo ja main.
2. Varmista julkaistu GK-kattavuus.
3. Lue ajantasaiset laskenta- ja lähdeohjeet.
4. Tarkista kaikki keskeneräiset reseptit koneellisesti.
5. Muodosta disjunkti ensisijainen estoluokitus.
6. Analysoi yhteiset lähdepuutteet ja reseptien päällekkäiset estot.
7. Priorisoi 20 parasta yksittäistä GK-avauskohdetta.
8. Priorisoi viisi tuottavinta yhteistä korjauskohdetta.
9. Valitse ensimmäinen rajattu toteutuserä.
10. Tallenna kampanjasuunnitelma ja ajon havainnot Reseptit-repoon.
11. Avaa tarvittaessa yksi Draft-PR vain AJO 0:n suunnittelumuutoksille.
12. Varmista suunnittelumuutosten rajaus ja asianmukaiset tarkistukset.
13. Palauta loppuraportti.
14. PYSÄHDY.

Ensimmäisen ajon ei tarvitse ratkaista kaikkia GI-lähteitä. Sen tulee tuottaa sellainen luokiteltu työjono, josta seuraavat ajot voivat edetä mahdollisimman tehokkaasti.

## AJO 0:n pakollinen loppuraportti

Ilmoita:

- Todellinen keskeneräisten GK-arvojen lukumäärä.
- Luokkien A–H reseptimäärät.
- Kuinka moni resepti on lähes laskentavalmis.
- Kuinka moni edellyttää uutta GI-lähdettä.
- Kuinka moni edellyttää ravintoarvo- tai massakorjausta.
- Viisi parasta yhteistä estettä.
- 20 potentiaalisinta reseptiä.
- Ensimmäisen toteutuserän reseptit.
- Ensimmäisen erän realistinen laskentapotentiaali.
- Arvio suurimmista kampanjan esteistä.
- Tallennetut dokumentit ja mahdollinen PR.
- Mahdolliset toteutusta estävät havainnot.

Loppupäätös:

**`AJO 0 COMPLETE – READY FOR COVERAGE BATCH 2B6E`**

tai

**`AJO 0 BLOCKED`**

Älä aloita AJO 1:tä ennen seuraavaa toimeksiantoa.

# Kampanjan lopullinen periaate

**Maksimoi uusien luotettavien, julkaistujen GK-arvojen määrä. Minimoi perusteettomat oletukset, turhat raportit, regressiot ja korjauskierrokset.**

Käsittele jokainen keskeneräinen resepti lopulta joko laskettavana tai täsmällisesti perusteltuna keskeneräisenä tapauksena.

GK-kattavuuden kasvattaminen on tämän kampanjan ensisijainen tehtävä.