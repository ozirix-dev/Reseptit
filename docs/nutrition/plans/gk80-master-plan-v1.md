# CODEX – RESEPTIT GK-80 MASTER PLAN V1.0
### Glykeemisen kuorman laskennan kattavuus vähintään 80 prosenttiin

**Päivä:** 30.10.2026
**Pääprojekti:** ozirix-dev/Reseptit
**Raportointi:** ozirix-dev/ReportHub
**Ohjelman tavoite:** Vähintään 80 % resepteistä saa numeerisen glykeemisen kuorman (GK) arvion, joko pistearvona, vaihteluvälinä tai täsmällisesti määriteltynä laskentaskenaariona.

**Työn luonne:** Strateginen suunnanmuutos, laskentamenetelmän kehitys ja vaiheittainen toteutus.

**Ensimmäinen ajo:** GK-80 PILOT 1 – 20 reseptiä.

---

## 1. OMISTAJAN PÄÄTÖS – UUSI TAVOITE

Aikaisempien GK 2.1 R2–R3.1 -ajojen aikana laskentamenetelmästä tuli liian rajoittava suhteessa projektin tarkoitukseen.

Epävarmoja lähteitä, ruokaryhmäkeskiarvoja ja valmistusanalogiota on poistettu tai estetty tilanteissa, joissa vaihtoehtoinen läpinäkyvä arviointimenetelmä olisi saattanut tuottaa käyttäjälle hyödyllisen GK-arvion.

Viimeisimmässä R3.1-selvityksessä ehdotettu erittäin tiukka hyväksyntäpolitiikka jättäisi nykyisistä 83 lasketusta GK-arvosta vain 12 määrällisen ja esityksellisen tarkistuksen läpäiseväksi. Tätä linjaa EI hyväksytä GK-80-ohjelman lähtökohdaksi.

**Omistajan nimenomainen uusi päätös:**

> Reseptit-projektin ensisijainen GK-kehitystavoite on kasvattaa numeeristen GK-arvioiden kattavuus vähintään 80 prosenttiin resepteistä. Hyväksymme perustellut, läpinäkyvästi merkityt arviot, vaihteluvälit ja laskentaskenaariot. Reseptien määriä, valmistusta ja tuotevalintoja saa tarvittaessa ehdottaa täsmennettäviksi, jotta laskenta voidaan tehdä paremmin.

Tämä tarkoittaa tavoitteellista kehitystä eikä lupaa keksiä mittaustuloksia, GI-arvoja tai perusteettoman kapeita vaihteluvälejä.

**Uusi suunnitteluperiaate:**

Älä ensisijaisesti kysy, miksi resepti ei kelpaa GK-laskentaan.

Kysy:

**Mitä tietoa, laskentatapaa, lähdettä tai reseptin täsmennystä tarvitaan, jotta reseptille saadaan käyttökelpoinen GK-arvio?**

---

## 2. MITATTAVAT PÄÄTAVOITTEET

Lähtötilanne viimeksi tarkistetussa aineistossa:

| Mittari | Määrä |
|---|---:|
| Reseptejä yhteensä | 326 |
| Numeerinen GK tällä hetkellä | 83 |
| GK keskeneräinen | 243 |
| Nykyinen kattavuus | 25,5 % |
| Tavoitekattavuus | vähintään 80 % |
| Tavoiteltu määrä | vähintään 261 |
| Tarvittavat uudet numeeriset GK-arviot | vähintään 178 |

Varmista alussa tuore tuotanto- ja main-tilanne. Edellä olevat luvut ovat lähtötaso, eivät lupa olettaa, etteivät tiedostot olisi muuttuneet.

### Vaihetavoitteet

| Välitavoite | GK-arvoja | Kattavuus |
|---|---:|---:|
| Lähtötilanne | 83 | 25,5 % |
| Vaihe 1 | 100 | 30,7 % |
| Vaihe 2 | 150 | 46,0 % |
| Vaihe 3 | 200 | 61,3 % |
| Vaihe 4 | 240 | 73,6 % |
| Päätavoite | 261 | 80,1 % |
| Jatkotavoite | 280 | 85,9 % |

Välitavoitteet ovat suunnittelutavoitteita, eivät lupauksia tietyn erän saavutuksista.

Jos jokin menetelmä ei tuota uusia arvoja, tutki aktiivisesti toinen menetelmä ennen laajojen selvitysten aloittamista uudelleen.

Älä kuitenkaan laske reseptiä kattavuuteen pelkän hiilihydraattiarvon, tekstimuotoisen GK-luokan, triviaalin vaihteluvälin tai perustelemattoman oletuksen perusteella.

**80 prosentin tavoite ei ole peruste tekaista arvoja.**

---

## 3. NYKYISEN TUTKIMUSAINEISTON HYÖDYNTÄMINEN

Lue tarvittavin osin seuraavat GitHub-aineistot:

- Reseptit PR #133 – GK 2.1 R2.
- Reseptit PR #134 – GK 2.1 R3 ja R3.1.
- ReportHub PR #73.
- ReportHub PR #74.
- `docs/nutrition/gk-r3-1-review.md`
- `docs/nutrition/gk-r3-1-gi-policy.md`
- `docs/nutrition/glycemic-user-purpose-policy-v2.md`
- R2:n inventaario ja 134 alustavaa CARBOHYDRATE_ONLY-ehdokasta.
- R3:n 24 syväarviota ja 14 lähteistettyä kokonaishiilihydraattiarviota.
- Nykyinen GI-rekisteri, GK-laskentamalli, koostumusaineistot ja niiden soveltuvuusehdot.

R2:n alustavan luokituksen mukaan:

- 55/243 reseptiä saattaa olla ratkaistavissa ilman uusien GI-lähteiden tutkimista.
- 188/243 tarvitsee GI-lähteen tutkimista tai soveltuvuuden arviointia.

Nämä ovat koneellisia seulontaryhmiä, eivät valmiiksi ratkaistuja kohteita.

Käytä aiempia tutkimuksia hyödyksi. Älä aloita jälleen koko 326 reseptin manuaalista syvätutkimusta alusta.

Nykyinen 45 GI-tietueen rekisteri on yksi laajentamisen kohteista.

Pidä historialliset lähdehavainnot, hylkäysperusteet ja aiemmat virheet tallessa. Uusi linja ei poista tarvetta korjata selvästi vääriä ruokaperhesidoksia.

---

## 4. UUSI GK-LASKENTAMALLI

Suunnittele laskenta, joka erottaa ainakin seuraavat numeeriset tasot.

### TASO A – SUORAAN LÄHTEISTETTY GK-PISTEARVIO

Käytetään, kun:

- Reseptin olennaiset hiilihydraattilähteet tunnetaan.
- Annosmäärä ja syötävät määrät tunnetaan.
- Käytettävä hiilihydraatti on laskettu asianmukaisesti.
- Keskeisille ainesosille löytyy hyvin vastaava tutkittu GI.
- Valmistusmuoto ja tuotetyyppi vastaavat riittävästi lähdettä.

Lasketaan:

GK = summa(ainesosan käytettävä CHO grammoina annoksessa × GI / 100).

Tulos on edelleen reseptin ainesosista laskettu arvio, ei koko aterian ihmisillä mitattu GK.

Käyttäjälle esimerkiksi:

**GK-arvio noin 26/annos**

Luottamustaso ja lähteet voidaan avata lisätiedoista.

### TASO B – LÄHTEISTETTY SOVELLETTU GK-PISTEARVIO

Käytetään, kun täsmälleen saman elintarvikkeen GI:tä ei ole mutta tutkimuksessa mitattu vertailuruoka on riittävän vastaava.

Soveltuvuudessa huomioidaan esimerkiksi:

- Elintarvikkeen kasvi- tai ruokaperhe.
- Hiilihydraattirakenne.
- Jauhatus tai muu käsittely.
- Raaka/kypsä-tila.
- Kuumentaminen ja jäähdyttäminen.
- Tuotteen rakenne ja reseptin valmistustapa.

Pelkkä yhteinen nimi ei riitä. Esimerkiksi eristettyä tärkkelystä ei saa automaattisesti rinnastaa kokonaiseen perunaan.

Jos soveltaminen on perusteltavissa, se saa tuottaa LOW-luottamustason numeerisen arvion.

Käyttäjälle esimerkiksi:

**GK-arvio noin 26/annos – sovellettu arvio**

Tallenna käytetty GI, alkuperäinen lähde, vertailuruoan ominaisuudet ja epävarmuuden perustelu.

### TASO C – MALLINNETTU GK-VAIHTELUVÄLI

Tämä on GK-80-ohjelman keskeinen uusi ominaisuus.

Jos täsmällistä GI-arvoa ei ole, mutta löytyy useita käyttökelpoisia vertailumittauksia tai perusteltuja, nimettyjä valmistus- ja tuoteskenaarioita, muodosta laskennallinen GK-vaihteluväli.

Esimerkkiesitystapa:

**Arvioitu GK noin 18–32/annos**

Tämä ei tarkoita, että juuri kyseisen ruokalajin GK olisi mitattu välille 18–32.

Se tarkoittaa, että nimetyillä vertailu- ja valmistusoletuksilla syntyvät laskelmat tuottavat tällaisen skenaarioalueen.

Vaatimukset:

1. Jokaisella käytetyllä GI-vertailuarvolla on oikea lähde.
2. Vertailuruokien olennaiset erot kirjataan.
3. Alueen ala- ja yläpäät ovat laskettavissa ilmoitetuista vaihtoehdoista.
4. Arvio ei saa perustua keksittyyn yleiseen GI-arvon ±20 % sääntöön.
5. Tutkimuksen SD, SEM tai luottamusväli ei automaattisesti ole reseptin GI-vaihteluväli.
6. GI 100 ei ole automaattinen yläraja.
7. Yksittäisten vaihtoehtojen on oltava mahdollisia saman reseptin yhteydessä.
8. Saman tuote- tai valmistusvalinnan vaikutukset eri ainesosiin pidetään tarvittaessa riippuvaisina toisistaan.
9. Jos käytettävissä olevat vaihtoehdot ovat liian heikkoja, alue jätetään hyväksymättä.
10. Hyvin laaja, kaikki käytännössä olennaiset GK-luokat kattava arvio merkitään erikseen eikä automaattisesti lasketa käyttökelpoiseen 80 prosentin kattavuuteen.

Toteuta erotus:

- Varsinainen mitattu tutkimusvaihtelu.
- Laskennallinen vaihtoehtojen vaihtelu.
- Tuote- tai valmistusvaihtelusta syntyvä skenaarioalue.
- Tuntemattoman tiedon takia laskematta jäävä vaikutus.

**Älä kutsu skenaarioaluetta tilastolliseksi luottamusväliksi.**

### TASO D – RESEPTIN EHDOLLISET GK-SKENAARIOT

Joissakin resepteissä ongelma ei ole GI-tutkimuksen puute vaan epätarkka resepti.

Esimerkkejä:

- Riisilajia ei ole määritelty.
- Leipä voi olla vaaleaa tai täysjyvää.
- Jogurtti voi olla makeutettu tai maustamaton.
- Riisi ilmoitetaan ilman raakaa/kypsää painoa.
- Kastikkeen todellinen määrä on epäselvä.
- Ainesosa on valinnainen.

Tällaisessa tapauksessa muodosta tarvittaessa erilliset, käyttäjälle ymmärrettävät skenaariot.

Esimerkkiesitys:

- Vaihtoehto 1, määritelty vaalea leipä: GK-arvio noin X.
- Vaihtoehto 2, määritelty täysjyväleipä: GK-arvio noin Y.

Näistä voidaan muodostaa vaihteluskenaario vain, jos molemmat ovat reseptin aitoja, mahdollisia toteutuksia ja kaikki olennaiset ainesosat on huomioitu.

Pelkkä nimellisesti eri vaihtoehto ei kelpaa, jos sen GI-lähde ei vastaa kyseistä valmistetta.

Jos reseptille voidaan määritellä suositeltu oletusversio, sen saa ehdottaa toimituksellisesti hyväksyttäväksi.

Ehdolliset skenaariot voivat kuulua 80 prosentin numeeriseen kattavuuteen hyväksynnän jälkeen.

### TASO E – VAIN HIILIHYDRAATTI

Jos koko annoksen käytettävä hiilihydraatti voidaan arvioida mutta perusteltua numeerista GK:ta ei saada, näytä hiilihydraattimäärä omana tietonaan.

Tätä EI lasketa 80 prosentin GK-tavoitteeseen.

### TASO F – EI ARVIOITAVISSA

Vasta viimeinen vaihtoehto, kun olennaista määrää, koostumusta tai GI-vaikutusta ei saada perusteltua edes reseptin täsmennyksellä tai asianmukaisella skenaariomallilla.

Merkitse täsmällisesti, mikä puuttuu ja mikä seuraava korjaustoimi voisi ratkaista ongelman.

---

## 5. RESEPTIEN TÄSMENTÄMINEN ON NYT HYVÄKSYTTY RATKAISUKEINO

Aikaisemmassa työssä alkuperäisten reseptien muuttamattomuudesta tuli paikoin liian rajoittava lähtökohta.

Uuden tavoitteen saavuttamiseksi reseptejä voidaan tarvittaessa kehittää tarkemmiksi.

Codex saa ehdottaa seuraavia korjauksia:

#### Ainesosien määrät

- Korvaa epäselvä kappalemäärä perustellulla grammapainolla tai lisää grammapaino rinnalle.
- Merkitse syötävän osan massa.
- Selvitä elintarvikekohtaiset lusikka- ja tilavuusmuunnokset.
- Määrittele annosten lukumäärä.
- Merkitse raaka- tai kypsäpaino.
- Yksilöi tarvittaessa tuote.

#### Valmistusmenetelmä

- Täsmennä, keitetäänkö, paistetaanko, höyrytetäänkö vai paahdetaanko.
- Selvennä keitinveden poiskaataminen.
- Täsmennä öljyn käyttö.
- Selvitä marinadin säilyminen tai poiskaataminen.
- Poista keskenään ristiriitaiset yleisohjeet.
- Yksilöi riisin, nuudelin tai muun tärkkelyslähteen käsittely.

#### Elintarvikkeen koostumus

- Tarkista vastaava Fineli-, AFCD- tai muu koostumustietue.
- Valitse perusteltu viitetuote.
- Erota tarvittaessa eri tuotteille omat laskentaversiot.
- Älä väitä geneeristä tuotetta tietyn tuotemerkin mitatuksi tuotteeksi.

#### Aidot reseptivaihtoehdot

Reseptistä voidaan tarvittaessa muodostaa esimerkiksi:

- Alkuperäinen yleisversio.
- GK-laskentaa varten tarkennettu versio.
- Täsmällisesti määritelty vaihtoehtoinen ainesosaversio.

Tärkeää:

**Älä vääristä ruokalajin identiteettiä pelkästään GK-arvon saamiseksi.**

Jos resepti muuttuu olennaisesti, kyseessä on uusi tai selvästi merkitty variantti eikä alkuperäisen reseptin huomaamaton korvaaminen.

Kaikki muutokset ovat versioituja, katselmoitavia ja yhteensopivia kieliversioiden kanssa.

---

## 6. PUUTTUVIEN GI-ARVOJEN RATKAISEMINEN

Tämän ohjelman yksi tärkeimmistä tehtävistä on kasvattaa käyttökelpoista GI-tietopohjaa.

Tutki nykyisen rekisterin lisäksi erityisesti:

- International Tables of Glycemic Index and Glycemic Load Values 2021.
- Alkuperäiset ihmisillä tehdyt GI-tutkimukset.
- Tutkimusten tarkemmat tuotetaulukot.
- Samojen tutkimusten valmistus- ja tuotekuvaukset.
- Eri maiden kansalliset elintarviketietokannat.
- Tutkimukset kypsennyksen, käsittelyn ja jäähdytyksen merkityksestä.

Erottele koostumustietokannan CHO-arvot GI-tutkimustuloksista.

Priorisoi elintarvikeryhmät sen mukaan, kuinka moneen reseptiin uusi lähde voisi vaikuttaa.

Ensisijaisesti:

1. Riisit ja riisivalmisteet.
2. Vehnä, leivät, leivonnaiset ja tortilla.
3. Nuudelit, pasta ja muut viljatuotteet.
4. Peruna ja perunavalmisteet.
5. Palkokasvit ja palkokasvijauhot.
6. Sokerit, siirapit ja makeat täytteet.
7. Hedelmät ja marjat.
8. Maitotuotteet.
9. Muut olennaiset hiilihydraattilähteet.

Jokaiselle uudelle GI-tietueelle tarvitaan:

- Elintarvikkeen nimi ja tunniste.
- Alkuperäinen lähde.
- DOI/PMID tai muu pysyvä lähdetunniste mahdollisuuksien mukaan.
- GI-asteikko ja vertailuruoka.
- Tutkimuksen GI-tulos.
- Tutkitun ruoan muoto ja käsittely.
- Tutkimuksen keskeiset rajoitteet.
- Mahdolliset reseptiin soveltuvat käyttötapaukset.
- Soveltuvuuden luottamustaso.
- Käytön sallittu rajaus.

Älä muodosta reseptille sopivaa lukua pelkästään ruokaryhmän nimellä.

Toisaalta älä hylkää kaikkia lähteistettyjä analogioita vain siksi, että resepti ei ole tutkimuksessa täsmälleen samanniminen.

Arvioi, onko ero todella merkittävä GK:n laskennan kannalta.

Tutki myös, voiko usean soveltuvan lähdearvon perusteella muodostaa käyttökelpoisen numeerisen skenaarioalueen.

---

## 7. EPÄVARMUUDEN VAIKUTUS GK:HON

Aiemmassa mallissa pieni epävarmuus saattoi estää kokonaisen reseptin GK-laskennan.

Uusi malli arvioi puuttuvan tiedon vaikutuksen ennen estopäätöstä.

Esimerkiksi jos ainesosan hiilihydraattimäärä on 0,3 g/annos ja GI puuttuu:

- Selvitä, onko ainesosan määrä ja CHO-arvo luotettava.
- Selvitä, voidaanko vaikutukselle muodostaa perusteltu raja.
- Arvioi vaikutus koko annoksen GK-arvioon.
- Tarkista, muuttuisiko GK-luokka tai laskelman käyttökelpoisuus.

Älä automaattisesti vaadi täydellistä GI-lähdettä jokaiselle vähähiilihydraattiselle mausteelle.

Älä kuitenkaan korvaa puuttuvaa GI:tä nollalla.

Käytä lähteistettyä vaikutusrajaa tai nimeä epävarmuus erikseen.

Jos vaikutus on olennainen ja tuntematon, ratkaise se ensisijaisesti:

1. Paremmalla lähteellä.
2. Reseptin määrätarkennuksella.
3. Tuotteen täsmennyksellä.
4. Vertailuskenaariolla.
5. Soveltuvan valmistusvaihtoehdon laskennalla.

Vasta näiden epäonnistuttua luokittele resepti esteelliseksi.

Arvioi aiemman 1 g / 2 g -säännön tarkoituksenmukaisuus uuden mallin yhteydessä.

Älä suurenna toleranssia mielivaltaisesti.

Tutki, voisiko paremmin toimiva ratkaisu olla GK-vaikutuksen perusteella määräytyvä toimituksellinen epävarmuusraja.

---

## 8. ERITYISKOHTELU GK 0 -ARVOILLE

R3.1 löysi yhdeksän reseptiä, joiden GK näkyy nollana, vaikka kaikkia tunnettuja positiivisia hiilihydraatteja ei ole sisällytetty GI-laskentaan.

Uusi tavoite ei saa johtaa harhaanjohtavien nollien säilyttämiseen.

Tutki jokaiselle näistä:

- Voidaanko GI-lähde lisätä?
- Voidaanko muodostaa lähteistetty arvio?
- Voidaanko muodostaa mielekäs numeerinen vaihteluskenaario?
- Onko määrä tai valmistustapa tarkennettavissa?

Jos lukua ei voi perustella, älä näytä täsmällistä nollakuormaa.

Nollan muuttaminen pieneksi mutta keksityksi positiiviseksi luvuksi ei ole hyväksyttävä ratkaisu.

---

## 9. NYKYISTEN 83 GK-ARVON SÄILYTTÄMINEN JA PARANTAMINEN

Nykyiset 83 GK-arvoa eivät saa automaattisesti kadota uuden politiikan seurauksena.

Älä toteuta R3.1:n 83 → 12 -skenaariota.

Sen sijaan:

1. Säilytä nykyiset arvot vertailulähtötietona.
2. Korjaa todetut väärät ruokaperhesidokset hallitusti.
3. Päivitä tarvittaessa arvioiden epävarmuusluokkaa.
4. Muunna yksittäisiä pistearvioita lähteistetyiksi vaihteluskenaarioiksi, jos se kuvaa näyttöä paremmin.
5. Älä väitä vanhoja LOW-arvioita suoriksi tutkimusmittauksiksi.
6. Raportoi vanhojen arvojen korjausten vaikutus kattavuuteen.
7. Älä julkaise tunnetusti harhaanjohtavaa nollaa pelkän kattavuusluvun säilyttämiseksi.

Kattavuuden kasvattaminen ja vanhojen arvojen laadun parantaminen ovat rinnakkaisia tavoitteita.

---

## 10. KÄYTTÖLIITTYMÄ JA TIEDON ESITYSTAPA

Suunnittele yksinkertainen käyttäjäkokemus.

Käyttäjälle tärkeintä on saada ymmärrettävä vastaus kysymykseen:

**Millainen glykeeminen kuorma tällä annoksella todennäköisesti on laskentamallin perusteella?**

Mahdolliset näkyvät esitysmuodot:

- GK-arvio noin 24.
- GK-arvio noin 18–32.
- GK-arvio riippuu valitusta riisistä.
- GK ei arvioitavissa.

Vältä näennäistarkkoja kahden desimaalin arvoja epävarmoissa arvioissa.

Sisäisen laskennan tarkkuus voi olla suurempi kuin käyttäjälle näytettävä tarkkuus.

Näytä tarvittaessa lyhyt merkintä:

- Suoraan lähteistetty.
- Sovellettu arvio.
- Mallinnettu vaihteluväli.

Yksityiskohtaisemmat lähteet ja epävarmuustiedot avataan lisätiedoista.

Älä lisää monimutkaista suodatinjärjestelmää ilman tarvetta.

Nykyiseen GK-suodattimeen voidaan suunnitella mahdollisuus hyväksyä kaikki kolme numeerista arviointitasoa.

Vaihteluvälien luokittelussa on huomioitava, että sama väli voi ylittää nykyisiä matalan, keskisuuren ja korkean GK:n rajoja.

Älä esitä tällaiselle välille varmaa yksittäistä GK-luokkaa.

Muista neljä kieliversiota: FI, EN, SV ja TH.

Älä esitä laskennallista GK-arviota henkilökohtaisena verensokeriennusteena tai lääkityksen annosteluohjeena.

---

## 11. KATTAVUUDEN RAPORTOINTI

Luo ohjelmalle selkeät mittarit.

**Ensisijainen KPI:**

Numeerisen GK-arvion saaneiden yksilöllisten nykyisten reseptien määrä / kaikkien nykyisten reseptien määrä.

Numeeriseen kattavuuteen hyväksytään:

- A: perusteltu pistearvio.
- B: lähteistetty sovellettu pistearvio.
- C: hyväksytty numeerinen skenaarioalue.
- D: hyväksytty numeerinen vaihtoehtolaskenta.

Vain CHO ja UNAVAILABLE eivät kuulu numeeriseen kattavuuteen.

Saman reseptin useita skenaarioita ei lasketa useaksi reseptiksi. Kieliversioita ei lasketa erikseen.

Pidä lisäksi erilliset laadun mittarit:

| Mittari | Tarkoitus |
|---|---|
| A-tason kattavuus | Vahvimmat soveltuvat GI-lähteet |
| B-tason kattavuus | Lähteistetyt sovellukset |
| C/D-tason kattavuus | Mallinnetut numeeriset arviot |
| CHO-only | Kokonainen hiilihydraattiarvio ilman GK:ta |
| UNAVAILABLE | Aidosti ratkaisematon |
| Epävarmuuden laajuus | Onko GK-arvio käyttäjälle hyödyllinen? |
| Reseptimuutokset | Kuinka monta täsmennystä tarvittiin? |
| Uudet GI-lähteet | Kuinka moneen reseptiin lähdettä voi soveltaa? |
| Laatuvirheet | Virheelliset sidokset, nollat ja laskentapoikkeamat |

Raportoi myös:

- Uudet numeeriset GK-arviot erässä.
- Erässä käsitellyt mutta keskeneräisiksi jääneet.
- Yhden uuden GK-arvion vaatimat työvaiheet.
- Uudelleenkäytettävien lähteiden hyöty.
- Merkittävät laatu- ja lähderiskit.

Älä muuta nimittäjää tai laske reseptejä kahdesti tavoitteen saavuttamiseksi.

---

## 12. TOTEUTUSOHJELMA – PIENET PERÄKKÄISET AJOT

Ohjelma toteutetaan vaiheittain.

Älä yritä suorittaa koko ohjelmaa yhdessä Codex-ajossa.

### AJO 1 – GK-80 PILOT, 20 RESEPTIÄ

**Tämä on nyt käynnistettävä ensimmäinen ajo.**

Tavoite on kokeilla uutta menetelmää oikeisiin keskeneräisiin resepteihin ja tuottaa konkreettisia, katselmoitavia GK-arvioehdotuksia.

#### 12.1 Valitse 20 reseptiä

Valitse tarkoituksella erilaisia estetyyppejä.

Ehdotettu jakauma:

- 5 reseptiä, joissa pääasiallinen ongelma on määrä, annoskoko tai koostumustieto.
- 5 reseptiä, joihin voidaan löytää soveltuva GI-analogia.
- 5 reseptiä, joissa numeerinen vaihteluskenaario voisi olla perusteltu.
- 5 reseptiä, joissa reseptin täsmentäminen tai versiointi voi ratkaista laskennan.

Ryhmät ovat valinnan tavoitteita; jos jokin resepti kuuluu useaan ryhmään, kirjaa se. Valitse yhteensä 20 yksilöllistä reseptiä.

Priorisoi myös reseptit, joiden ratkaisu voi tuottaa uudelleenkäytettävän GI-lähteen monelle muulle reseptille.

Älä valitse vain helpoimpia vähähiilihydraattisia ruokia.

Mukana tulee olla myös riisiä, viljaa, leipää tai muuta merkittävää hiilihydraattilähdettä sisältäviä reseptejä, jotta menetelmän todellinen toimivuus saadaan testattua.

#### 12.2 Käsittele jokainen resepti

Tarkista:

1. Alkuperäiset ainesosat ja annokset.
2. Käytettävä hiilihydraatti.
3. Puuttuvat tai epätarkat määrät.
4. Valmistusmenetelmä.
5. Nykyinen GI-lähde tai puuttuva lähde.
6. Vaihtoehtoiset tutkitut GI-arvot.
7. Soveltuvuus reseptiin.
8. Mahdolliset reseptitäsmennykset.
9. Pistearvion tai vaihteluskenaarion laskenta.
10. Epävarmuuden vaikutus tulokseen.
11. Käyttäjälle ehdotettu esitystapa.
12. Päätös siitä, onko arvio katselmoitavissa.

Kirjaa jokaisen ainesosan laskennallinen osuus niin, että lopputulos voidaan toistaa.

#### 12.3 Tuota oikeita laskelmia

Pilotissa ei riitä raportti siitä, miksi 20 reseptiä ovat keskeneräisiä.

Tavoitteena on saada mahdollisimman monta konkreettista uutta GK-pistearvio- tai vaihteluväliehdotusta.

Älä kuitenkaan pakota kaikkia 20:tä hyväksyttäväksi.

Jos jokin resepti estyy, selvitä ensin vaihtoehtoinen perusteltu menetelmä ja dokumentoi, miksi se ei lopulta riittänyt.

Tallenna laskentatiedot, käytetyt lähteet ja epävarmuus.

#### 12.4 Toteutuksen rajaus

Pilotissa saa luoda uutta laskentakoodia, tutkimusdataa, testejä, mallinnusskenaarioita ja tarvittavia eristettyjä syötetiedostoja Draft-PR:ään.

Älä vielä julkaise reseptimuutoksia, uutta laskentaa tai käyttöliittymämuutoksia tuotantoon.

Jos uusia esitystapoja täytyy testata, käytä eristettyä esikatselua tai testikomponenttia.

#### 12.5 Pilotin hyväksymisehto

Pilotti on onnistunut, kun:

- 20 reseptiä on tutkittu.
- Jokaiselle on kirjattu lähde- ja laskentapäätös.
- Uudesta GK-menetelmästä on toimiva laskennallinen prototyyppi.
- Uudet numeeriset ehdotukset voidaan toistaa testeillä.
- Vaihteluvälien perustelu voidaan tarkistaa.
- Mahdolliset reseptimuutokset on dokumentoitu.
- Nykyisiä 326 tuotantotulosta ei ole huomaamatta muutettu.
- Menetelmän laajennettavuus on arvioitu realistisesti.

Raportoi, kuinka moni 20:stä saavutti katselmoitavan numeerisen arvion.

Älä kutsu ehdotuksia julkaistuiksi ennen erillistä hyväksyntää.

**Pysähdy tämän ajon jälkeen riippumattomaan katselmointiin.**

---

### AJO 2 – YHTEINEN GI-LÄHDEKIRJASTO

Toteutetaan erikseen hyväksytyn pilotin jälkeen.

Tavoite:

Laajentaa GI-tietopohjaa ensisijaisesti sellaisiin elintarvikkeisiin, joiden tietueita voidaan käyttää useissa resepteissä.

Älä kerää tietueita vain määrän kasvattamiseksi.

Lisää alkuperäislähteet, soveltuvuusrajaukset, suorat arvot sekä vertailuun soveltuvat vaihtoehdot.

Testaa eri lähteiden ristiriidat ja asteikkomuunnokset.

---

### AJO 3 – RESEPTIEN TÄSMENNYSERÄT

Käsittele 10–20 reseptiä kerrallaan.

Toteuta hyväksytyt määrätarkennukset, ruoan identiteettitarkennukset ja valmistusohjeiden korjaukset.

Synkronoi ravintoarvot, reseptit, kieliversiot, laskentaversiot ja lähdehashit.

Jos alkuperäinen ohje pitää säilyttää, toteuta nimetty variantti.

Älä muokkaa reseptiä vain siksi, että jokin GI-tutkimus sopisi siihen paremmin.

---

### AJO 4 – GK-MALLIN TUOTANTOVALMIUS

Kun pilotin menetelmä on hyväksytty:

- Lisää pistearvio- ja vaihteluvälirakenteet.
- Lisää luottamus- ja lähdemetadata.
- Lisää skenaarioiden versionhallinta.
- Lisää vanhentuneiden laskentojen esto.
- Lisää epävarmuuslaskennan regressiotestit.
- Toteuta rajattu ja ymmärrettävä käyttöliittymä.
- Varmista nykyisten laskentojen yhteensopivuus.

Julkaise vain erikseen hyväksytyn PR:n kautta.

---

### AJO 5 – KATTAVUUDEN KASVATTAMINEN

Toteuta toistettavia 20–30 reseptin eriä.

Jokaisen erän jälkeen:

- Laske uusi GK-kattavuus.
- Vertaile numeeristen arvojen laatutasoja.
- Selvitä jäljellä olevien esteiden jakauma.
- Priorisoi seuraava erä vaikutuksen perusteella.
- Tarkista lähdekirjaston uudelleenkäyttö.
- Korjaa havaittu regressio ennen jatkoa.

Älä aloita uusia laajoja yleisauditointeja ilman yksilöityä syytä.

Jatka, kunnes vähintään 261 nykyistä reseptiä täyttää hyväksytyn numeerisen GK-arvion ehdot.

Jos saavutettavuus osoittautuu tutkimuksellisesti rajalliseksi, raportoi todellinen enimmäistulos, ratkaisemattomat esteet ja vaihtoehtoiset reseptitäsmennykset. Älä vääristele kattavuutta.

---

## 13. TURVALLISUUS JA TEKNINEN HALLINTA

Tarkista ennen työtä:

- Oikea repository ja origin.
- Git-työpuu.
- Nykyinen main.
- Avoimet PR:t.
- R2/R3-riippuvuudet.
- Käytössä olevat repo_guard-säännöt.
- Mahdolliset rinnakkaiset Codex-ajot.

Älä työskentele vahingossa Ravinto-repossa.

Älä kirjoita toisten ajojen keskeneräisiin työpuihin.

Säilytä R2:n ja R3:n tutkimushistoria.

GK-80 on uusi ohjelma. Sen ei tule hiljaisesti muuttaa R3.1:n historiallisia auditointituloksia tai hyväksymättömiä PR:iä.

Käytä erillistä haaraa ja Draft-PR:ää.

### Pakolliset tekniset suojaukset

- Resepti- ja lähdeversiot tarkistetaan.
- Tuntemattomia arvoja ei muuteta nolliksi.
- Käytettävä CHO määritellään johdonmukaisesti.
- Kuitua ei vähennetä kahdesti.
- GI-asteikot normalisoidaan oikein.
- Vaihteluskenaarioiden laskenta on toistettavaa.
- Samaa hiilihydraattia ei lasketa kahdesti.
- Vaihtoehtoisia valmistustapoja ei yhdistetä mahdottomaksi reseptiksi.
- Olennaiset valmistushävikit käsitellään asianmukaisesti.
- Lähteen muutos vanhentaa riippuvat hyväksynnät.
- GK 0 ei peitä laskennan ulkopuolelle jätettyä positiivista CHO:ta.
- Kaikki muuttuvat ravintoarvot tarkistetaan.
- FI/EN/SV/TH eivät saa näyttää ristiriitaisia arvoja.

Vaatimusten tulee tukea laskentaa eikä luoda uutta perusteetonta massahylkäystä.

---

## 14. TESTAUS

Jokaiselle laskentamenetelmälle tarvitaan testit.

Erityisesti:

1. Suora GK-pistearvo.
2. Sovellettu GI-pistearvo.
3. Usean GI-lähteen vaihteluskenaario.
4. Vaihtoehtoiset valmistus- ja tuotetyypit.
5. CHO-määrien muutokset.
6. Yhteisriippuvaiset epävarmuudet.
7. Pyöristys ja luokkarajat.
8. Puuttuva tai väärä GI.
9. Puuttuva ainesosamassa.
10. Vanhenneet syötteet ja lähteet.
11. Väärä ruokaperhe.
12. Nollahiilihydraatin käsittely.
13. Käyttäjän mahdollisesti väärin tulkitsema vaihteluväli.
14. Vanhan ja uuden laskentamallin regressiot.

Tarkista lopullisen commitin CI.

Älä ohita testejä vain sen vuoksi, että kattavuustavoite muuten jäisi saavuttamatta.

---

## 15. REPORTHUB JA MASTER PLANIN TALLENNUS

Tallenna GK-80 MASTER PLAN V1.0 Reseptit-repoon asianmukaiseen suunnitelmahakemistoon.

Luo ReportHubiin uusi ohjelman etenemistä seuraava raportti projektin sääntöjen mukaan.

Raportista tulee käydä ilmi:

- Lähtötilanne 83/326.
- Tavoite vähintään 261/326.
- Uudet laskentatasot.
- Pilotin valitut 20 reseptiä.
- Pilotin hyväksytyt ja keskeneräiset tulokset.
- Uudet GI-lähteet.
- Tarvittavat reseptimuutokset.
- Seuraavien ajojen riippuvuudet.
- Päätöstä vaativat asiat.

Älä muuta ReportHubin yleisiä rakenteita, automaatiota tai muiden projektien raportointia.

Säilytä aiempien GK-ajojen historialliset raportit.

---

## 16. ENSIMMÄISEN AJON LOPPURAPORTTI

Anna lopuksi suomeksi seuraava raportti.

### A. Päätös

GO / CONDITIONAL GO / BLOCKED.

### B. Lähtötila

- Nykyinen reseptimäärä.
- Nykyinen GK-kattavuus.
- Uusi tavoite.
- Tarkat GitHub-versiot.

### C. Pilotin 20 reseptiä

Taulukko:

| Resepti | Aiempi este | Käytetty menetelmä | Uusi GK-arvio | Epävarmuus | Tila |
|---|---|---|---|---|---|

Ilmoita numeerinen arvo tai vaihteluväli vain silloin, kun se on todella laskettu ja perusteltu.

### D. Uudet GI-lähteet

- Lähteiden määrä.
- Alkuperäislähteet.
- Elintarvikkeet.
- Soveltuvuus.
- Mahdollisuus käyttää samaa tietoa muissa resepteissä.

### E. Reseptimuutostarpeet

- Mitä pitäisi täsmentää?
- Vaikuttaako muutos ruokaan olennaisesti?
- Tarvitaanko variantti?
- Vaikutus ravintoarvoihin ja kieliversioihin.

### F. Mallin arviointi

- Kuinka moni resepti saatiin numeerisesti laskettavaksi?
- Kuinka moni jäi estetyksi?
- Kuinka moni tarvitsee vain pienen jatkokorjauksen?
- Ovatko vaihteluvälit käyttökelpoisia?
- Mitkä menetelmät tuottivat parhaat tulokset?

### G. Kattavuusennuste

Laadi perusteltu, epävarmuudet sisältävä arvio siitä, miten 80 prosentin tavoitteeseen voisi päästä.

Älä oleta, että pilotin onnistumisprosentti suoraan yleistyy kaikkiin 243 keskeneräiseen reseptiin.

Esitä:

- Varovainen skenaario.
- Todennäköinen toteutusskenaario, jos aineisto riittää sen arviointiin.
- Kunnianhimoinen 80 prosentin tavoiteskenaario.

Kerro kunkin skenaarion lähtöoletukset.

### H. Testit ja PR:t

- Testitulokset.
- CI.
- Draft-PR-linkit.
- Commit-SHA:t.
- Mitä tiedostoja muutettiin?
- Todiste, ettei tuotantoa muutettu.

### I. Seuraava ajo

Ehdota vain seuraavaa yhtä rajattua työerää.

**Älä käynnistä sitä automaattisesti.**

---

## 17. LOPULLINEN ONNISTUMISKRITEERI

GK-80-ohjelma on valmis, kun kaikki seuraavat ehdot täyttyvät:

1. Vähintään 80 prosentilla nykyisistä resepteistä on hyväksytty numeerinen GK-arvio.
2. Pistearvot ja vaihteluvälit perustuvat dokumentoituihin laskentamenetelmiin.
3. Epävarmuus näkyy käyttäjälle ymmärrettävästi.
4. Vaihteluvälit eivät perustu keksittyihin GI-rajoihin.
5. Reseptien täsmennykset ovat toimituksellisesti hyväksyttyjä.
6. Olennaisia tuntemattomia määriä tai koostumuksia ei ole naamioitu nolliksi.
7. Nykyisten arvojen korjaukset on tehty hallitusti.
8. Laskenta, kieliversiot ja käyttöliittymä ovat testattuja.
9. Historiallinen lähde- ja laskentaketju säilyy.
10. Tuotantoon julkaisu on erikseen hyväksytty.

### LOPPUOHJE CODEXILLE

**Tämän ohjelman tarkoitus on saada GK-laskenta toimimaan mahdollisimman monelle reseptille – ei rakentaa uutta monimutkaista järjestelmää, joka hylkää lähes kaiken aineiston.**

Käytä tutkimusta, vertailuarvoja, mallinnusta, reseptien täsmennyksiä ja hyvin perusteltuja vaihteluskenaarioita aktiivisesti.

Älä kuitenkaan sekoita mallinnettua lukua mitattuun tulokseen.

Jos nykyinen sääntö estää käyttökelpoisen arvion ilman riittävää syytä, ehdota säännön muuttamista.

Jos lähdetietoa puuttuu, etsi vaihtoehtoinen lähde tai perusteltu skenaario.

Jos resepti on epäselvä, ehdota sen korjaamista.

Jos pistearvo on liian epävarma, selvitä voidaanko laskea käyttökelpoinen vaihteluväli.

Jos vaihteluväliä ei voi perustella, ilmoita este avoimesti.

**Päätavoite: vähintään 261/326 reseptiä numeerisen GK-laskennan piiriin.**

**ALOITA NYT VAIN AJO 1: GK-80 PILOT – 20 RESEPTIÄ.**

Tallenna koko MASTER PLAN pysyvästi, tee ensimmäinen rajattu pilotti ja palauta tulokset riippumattomaan katselmointiin. Älä julkaise, yhdistä PR:iä tai aloita seuraavaa ajoa ilman erillistä hyväksyntää.
