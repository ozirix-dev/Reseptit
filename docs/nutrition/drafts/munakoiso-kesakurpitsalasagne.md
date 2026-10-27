# Munakoiso-kesäkurpitsalasagne: laskentaskenaarion tarkistus

Tarkistettu 27.10.2026. [Resepti](../../../reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md),
neljä yhtä suurta annosta. Tämä on toimituksellinen tarkistusmuistio,
ei `calculations/`-hakemiston evidenssitiedosto eikä uusi laskentamalli.

**Johtopäätös: GK ei ole hyväksyttävissä nykyisellä lähdenäytöllä.**
Aiempi skenaario tuottaa aritmeettisesti 25,2475 GK/annos, mutta useat sen
kertoimet ovat perusteettomia oletuksia. Niitä ei hyväksytä GI-arvoiksi.
Numeroa ei lisätä reseptin metatietoihin, GI-aineistoon tai julkaistuun
GK-järjestelmään. Projektin mallia ja toleransseja ei muuteta.

## Määrät ja valmistuksen rajaus

Kasvikset punnitaan raakoina syötävänä osana, pasta kuivana ja mozzarella
valutettuna. Valkosipulia on 12 g; kolme kynttä on vain kokoarvio.
Perusskenaario sisältää 200 g pastaa, vaihtoehto 180 g.

| Aines | Koko reseptiin sisältyvä määrä ja jako |
| --- | --- |
| Munakoiso, kesäkurpitsa, sipuli | 400 g, 400 g, 100 g |
| Valkosipuli | 12 g kuorittuna kastikkeeseen |
| Oliiviöljy | 60 g = 50 g paahtoon + 5 g vuokaan + 5 g viimeistelyyn |
| Tuore timjami | 3 g lehtiä kastikkeeseen |
| Tomaattikastike | 800 g = 650 g vuokaan + 150 g tarjoiluun |
| Lasagnelevyt | 200 g kuivana; vaihtoehtoinen skenaario 180 g |
| Mozzarella | 250 g valutettuna = 175 g väliin + 75 g pinnalle |
| Parmesaani tai vastaava kova juusto | 80 g = 60 g väliin + 20 g viimeistelyyn |
| Tuore basilika | 10 g = 5 g väliin + 5 g viimeistelyyn |
| Viinietikka | 10 g tarjoilukastikkeeseen |
| Mustapippuri | 0,5 g viimeistelyyn |
| Suola | 3 g; makusäätö alaspäin mahdollinen |
| Vesi | 100 ml; säätövara yhteensä 50–150 ml |

Skenaario olettaa kaikki punnitut aineet syödyiksi eikä vähennä paiston
tai pellille jäävän öljyn mahdollisia ravinnehävikkejä. Mozzarellan 250 g
punnitaan vasta valutuksen jälkeen: säilöntälientä ei lasketa mukaan
eikä sen poistumista vähennetä toistamiseen. Avoin kysymys on vertailutuotteen
100 g:n ravintotietojen vastaavuus juuri valutettuun juustoon. Kun lähde
koskee valutettua juustoa ja käytetään valutettua painoa, erillistä
säilöntäliemen hävikkikerrointa ei tarvita. Paistoretention oletus ei
silti ole nykyisen ravintoarvomallin hyväksytty retentiotodiste.
Vesi ja haihtuminen muuttavat massaa ja ravintotiheyttä, eivät itsessään
koko reseptin ravintomääriä tai neljälle jaettua laskennallista määrää.
Ml-määrää ei muunneta hyväksyttyyn ravintolaskentaan dokumentoimattomalla
massakertoimella. Kypsän ruoan painoa ei ole mitattu.

## Hiilihydraattien lähteet ja vastaavuus

Alla HH tarkoittaa skenaariossa imeytyvänä käsiteltyä hiilihydraattia.
Finelin imeytyvästä hiilihydraatista ja EU-tuotteiden ilmoitetusta
hiilihydraatista ei vähennetä kuitua uudelleen. Kokonaishiilihydraattia
ei päätellä tästä sarakkeesta; kuitu ja polyolit vaativat oman lähdenäytön.

| Aines / lähde | HH g/100 g | Vastaavuus ja avoin puute |
| --- | ---: | --- |
| [Knorr GN -lasagnelevyt](https://www.unileverfoodsolutions.fi/tuotteet/knorr-lasagnelevyt-gn-mitoitus-5-kg-34-FI-354670.html) | 72 | Suomen valmistajasivu, EAN 8721497001593, kuiva durumvehnätuote. Sopii 200/180 g kuivapainoon; muu tuote tarkistettava erikseen. |
| [Knorr Tomato Pronto Napoletana, Suomen 2023 tuoteluettelo](https://www.unileverfoodsolutions.fi/dam/global-ufs/mcos/nordics/finland/pdf/UFS_Tuoteluettelo_2023_LR.pdf) | 5,3 | Aiemman luonnoksen historiallinen tuotetieto, EAN 8712566255177. PDF:n uudelleenhaku epäonnistui tässä tarkistuksessa; nykyistä Suomen pakkausta ei ole varmennettu. |
| [Knorr Tomato Pronto, Sveitsin valmistajasivu](https://shop.unileverfoodsolutions.ch/products/knorr-professional-tomato-pronto-tomatensauce-3-kg?variant=57489490248061) | 5,3 | Uudelleen tarkistettu 100 g:n sarake, ei 100 ml:n sarake. Tukee historiallista lukua, mutta markkina- ja koostumuserot estävät oletuksen samasta nykyisestä Suomen tuotteesta. |
| [Fineli/THL: munakoiso 362](https://fineli.fi/fineli/fi/elintarvikkeet/362) | 3,1 | Raaka, syötävä osa; paahtamisen retentiota ei ole todennettu. |
| [Fineli/THL: kesäkurpitsa 389](https://fineli.fi/fineli/fi/elintarvikkeet/389) | 2,5 | Raaka, syötävä osa; ei kypsän ruoan painoa. |
| [Fineli/THL: sipuli 335](https://fineli.fi/fineli/fi/elintarvikkeet/335) | 4,8 | Raaka kuorittu sipuli. |
| [Fineli/THL: valkosipuli 393](https://fineli.fi/fineli/fi/elintarvikkeet/393) | 16,3 | Raaka kuorittu valkosipuli; 12 g, ei vakioitu kolmen kynnen massa. |
| [Galbani mozzarella, Lactalis UK](https://www.lactalis.co.uk/dairy-goodness/galbani-mozzarella/) | 2,0 | Vertailutuote. Käytettävää Suomen tuotetta ja ravintotietojen vastaavuutta valutettuun massaan ei ole varmennettu. Sokeria lähteessä vain 1 g/100 g: kaikkia hiilihydraatteja ei voi nimetä laktoosiksi. |
| [Parmigiano Reggiano, valmistajajärjestö](https://www.parmigianoreggiano.com/product-guide-nutritional-characteristics) | 0 | Sopii vain nimettyyn vertailujuustoon. Kasvisruokavalioon valittu korvaava kova juusto tarvitsee oman tiedon. |
| Basilika, timjami, viinietikka, pippuri | ei varmennettu | Vanha yhteisarvio 1 g HH koko reseptiin ei ole lähteistetty yläraja. |
| Puhdas oliiviöljy, suola, vesi | 0 skenaariossa | Koostumukseen perustuva hiilihydraatittomuus; ei väite mitatusta GI-arvosta 0. Tuotekohtaisia kokonaisia ravintotietueita ei ole koottu. |

Fineli-tietojen lähde: Terveyden ja hyvinvoinnin laitos, Fineli,
CC BY 4.0. Yksittäiset tuotetiedot on poimittu yllä linkitetyiltä
valmistajilta; ne eivät muodosta varmennettua koko reseptin evidenssisyötettä.

## GI-näytön tarkistus

- **Pasta 55:** [Henry ym. 2005, taulukko 2, tuote 26](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/39502DB89C8FDD82CFCEF46EFBDED5E4/S0007114505002692a.pdf/glycaemic-index-and-glycaemic-load-values-of-commercially-available-products-in-the-uk.pdf)
  ja [Sydneyn GI-tietokannan](https://glycemicindex.com/gi-search/) haku
  `Lasagne sheets, dry pasta`: Value-tuotteen keitetyt levyt, UK, n=8,
  GI 55 (glukoosi=100). Julkaistu mittaus on olemassa; uunissa kastikkeessa
  kypsyvä Knorr ei ole sama tuote tai valmistustapa. Kyse on arvioitavasta
  analogiasta, ei tämän lasagnen tai Knorrin mitatusta GI:stä.
- **Kastike 23:** GI-tietokannan `Tomato and vegetable pasta sauce,
  commercially-prepared`, Ranska, 2007, n=10, on merkitty julkaisemattomaksi
  havainnoksi. Tämä ei täytä projektin julkaistun näytön vaatimusta.
  Knorr-kastikkeen omaa mitattua GI:tä ei löytynyt.
- **Kastikkeen vertailukerroin 35:** [Dodd ym. 2011](https://pubmed.ncbi.nlm.nih.gov/21831990/)
  tutki eri elintarvikkeita ja seka-aterioita. Tekijän
  [alkuperäistutkimukseen liittyvä opinnäyte](https://ourarchive.otago.ac.nz/esploro/outputs/graduate/Predicting-the-Glycaemic-Index-of-Mixed/9926478783401891)
  raportoi kastikkeelle GI 35 (95 % LV 30–41). Aiemman luonnoksen
  juustoa sisältävä kastikevertailu säilyy vain herkkyysskenaariona:
  sen vastaavuutta Knorrin tomaattikastikkeeseen ei ole osoitettu.
  Artikkelin kokotekstin uudelleenhaku estyi; lukua ei hyväksytä tämän
  reseptin kastikkeelle eikä seka-aterian GI:tä siirretä yksittäiselle aineelle.
- **Munakoiso, kesäkurpitsa, sipuli 30; valkosipuli 50:** vanhan luonnoksen
  omia kertoimia. Niille ei löytynyt jäljitettävää mittausnäyttöä.
  Vähäinen tärkkelys tai hiilihydraatti ei yksin määritä GI:tä.
  Näitä ei jatkossa kirjata hyväksytyiksi GI-arvoiksi.
- **Mozzarella 48:** Sydneyn tietokannan `Lactose (Lactose 101394S, BDH,
  Poole, UK)` koskee puhdasta laktoosia, ei juustoa.
  [Östman ym. 2001](https://pubmed.ncbi.nlm.nih.gov/11451723/) käytti
  valkoista leipää vertailuna; 48 on tietokannan glukoosiasteikolle
  ilmoittama arvo, ei peruste tehdä uutta muunnosta. Mozzarellaan
  soveltaminen hylätään tuotteen ja ruokamatriisin eron takia.
- **Mausteiden yhteiskerroin 50:** vanha oletus ilman mittausta.
  Nollahiilihydraattisille aineille ei tarvitse keksiä GI:tä.

Rasvan, proteiinin, etikan tai jäähdytyksen oletettua vaikutusta ei vähennetä.
Laskennallinen GK ei ole valmiin ruoan mitattu GI eikä yksilöllisen vasteen ennuste.

## Vanhan skenaarion aritmetiikka — ei hyväksytty GK

Kaava: koko reseptin skenaarioluku = Σ(HH g × vanha kerroin / 100).
Annos = pyöristämätön summa / 4. Kertoimet toistetaan aiemman laskun
tarkistettavuutta varten; tässä ei muodosteta uusia puuttuvia GI-arvoja.

| Aines | Määrä g | HH g koko reseptiin | Vanha kerroin, ei hyväksytty GI | Koko reseptin GK-skenaario |
| --- | ---: | ---: | ---: | ---: |
| Pasta | 200 | 144 | 55 | 79,2 |
| Tomaattikastike, myös tarjoilu | 800 | 42,4 | 23 | 9,752 |
| Munakoiso | 400 | 12,4 | 30 | 3,72 |
| Kesäkurpitsa | 400 | 10 | 30 | 3 |
| Sipuli | 100 | 4,8 | 30 | 1,44 |
| Valkosipuli | 12 | 1,956 | 50 | 0,978 |
| Mozzarella | 250 | 5 | 48 | 2,4 |
| Parmigiano Reggiano -vertailu | 80 | 0 | ei tarvita | 0 |
| Basilika + timjami + viinietikka + pippuri | 10 + 3 + 10 + 0,5 | 1 (vanha arvio) | 50 | 0,5 |
| Öljy + suola + vesi | yllä ilmoitetut määrät | 0 | ei tarvita | 0 |
| **Yhteensä** | | **221,556** | | **100,99** |

Per annos: **55,389 g HH** ja **25,2475 → 25,25 GK-skenaario**.
Desimaalit palvelevat laskun tarkistusta, eivät kuvaa lähtötietojen tarkkuutta.
Muuttuneet öljyn ja veden täsmälliset määrät eivät muuta vanhaa HH-laskua.

Herkkyydessä muutetaan vain rivillä mainittua vanhaa oletusta.
Vaihteluvälit eivät ole luottamusvälejä tai hyväksyttyjä GI-vaihteluvälejä.

| Skenaario | Pasta 200 g: GK/annos | Pasta 180 g: GK/annos |
| --- | ---: | ---: |
| Vanha peruslasku | 25,2475 | 23,2675 |
| Kastikkeen kerroin 35 (muut ennallaan) | 26,5195 | 24,5395 |
| Pastan kerroin 45–65 | 21,6475–28,8475 | 20,0275–26,5075 |
| Munakoison, kesäkurpitsan ja sipulin kerroin 15–40 | 24,2275–25,9275 | 22,2475–23,9475 |

180 g pastalla koko reseptin HH on 207,156 g, annoksessa 51,789 g,
ja skenaarioluku 93,07 / 4 = 23,2675. Ero 200 g:n versioon on
3,6 g HH ja 1,98 GK-skenaarioyksikköä annosta kohti.

### Miksi toleranssi ei korjaa puuttuvaa näyttöä

[Nykyiset säännöt](../README.md) edellyttävät lähteistettyä GI:tä tai
perusteltua vastaavuutta. GI:n pienen puuttuvan osuuden rajat ovat
yksittäiselle aineelle **alle 1 g** ja yhteensä **alle 2 g** imeytyvää
hiilihydraattia annosta kohti; rajoja ei muuteta.
Jo kastike tuo skenaariossa 10,6 g/annos, munakoiso 3,1 g,
kesäkurpitsa 2,5 g, sipuli 1,2 g ja mozzarella 1,25 g.
Ne eivät mahdu poikkeukseen. Kaikki muut kuin pasta tuovat yhteensä
19,389 g/annos vanhassa skenaariossa. Valkosipulin 0,489 g ja mausteiden
arvioitu 0,25 g eivät yksin ratkaise kokonaisuutta; mausteiden 1 g ei
myöskään ole lähteistetty yläraja. Pastankin analogia on vielä arvioitava.

## Koko reseptin ravintoarvojen kattavuus

| Ravintoarvo | Päätös tässä reseptissä | Puuttuva näyttö |
| --- | --- | --- |
| Imeytyvät hiilihydraatit | Metadata puuttuu; lähdenäyttö riittämätön | Noin 55 g/annos on vain yllä olevan skenaarion tulos. Nykyiset kastike- ja juustotuotteet, mausteet ja valmistuksen retentio eivät ole kattavasti varmennettuja. |
| Kokonaishiilihydraatit | Metadata puuttuu | Lisäksi kaikkien ainesten kuitu- ja polyolitiedot nykyisen mallin edellyttämällä tavalla; puuttuvaa ei aseteta nollaksi. |
| Proteiini | Metadata puuttuu | Pääaineille on osittaisia valmistaja-/Fineli-tietoja, mutta ei kaikkia määriteltyjä tuotteita ja valmistustiloja kattavaa syötettä tai perusteltuja poisjättöjä. |
| Rasva | Metadata puuttuu | Tarkat juustot ja öljyn retentio erityisesti; lisätty 60 g öljyä ei todista pelliltä syötyä määrää. |
| Energia | Metadata puuttuu | Samat tuote- ja valmistuspuutteet; osittaisia energiatietoja ei summata täydeksi tulokseksi. |

Nykyisen mallin pienten puuttuvien ravintoarvojen rajat ovat yhteensä
enintään 10 kcal tai 1 g kullekin makrolle annosta kohti. Niitä ei
sovelleta tuotteen vastaavuuden tai valmistuksen yleiseen epävarmuuteen.
Mausteiden ravintotekijäkohtaisia ylärajoja ei ole dokumentoitu, eikä
pääraaka-aineita saa jättää pois. Siksi tässä ei luoda osittaista
evidenssitiedostoa eikä ravintoarvometatietoja. Hyväksyntä edellyttää
tuote-/tilavastaavuuden, retention ja rajattujen poisjättöjen dokumentointia
nykyiseen malliin, sen jälkeen normaaleja evidenssi- ja regressiotarkistuksia.

Tämä luonnosmuistio ei kuulu `nutrition-provenance.ts`-tiedoston
`inputPaths`-inventaarioon eikä `calculations/`-evidenssiin. Sen irralliset
skenaariotaulukot tarkistetaan erikseen; yleisen ravintoarvo- tai GK-auditoinnin
onnistuminen ei varmista näitä lukuja eikä anna niille hyväksyntää.
Mahdollinen myöhempi hyväksyttävä laskenta on rekisteröitävä normaalin
evidenssikäytännön mukaisesti.

## Valmistuksen toimitukselliset ratkaisut

- 15 minuutin suolaus/valutus poistettiin: ohuet viipaleet paahdetaan
  suoraan, jotta työvaihe ja määrittelemätön valumahävikki eivät jää mukaan.
  Paahdon kuivattava vaikutus on arvio, ei koekeittiötulos.
- Kahdelle pellille valittiin kiertoilma 200 °C / 20–25 min; tasalämpö
  225 °C voi vaatia 25–35 min ja peltien vaihdon. Aiempi 225 °C / 20–25 min
  ei yksin takaa tasaista tulosta kahdella täydellä pellillä. Valkosipuli
  ja timjami lisätään kastikkeeseen palamisriskin vähentämiseksi.
- 20 × 25 cm on vain pohjamitta. 6 cm sisäsyvyydellä suorakulmainen
  tilavuus on 3 litraa; viistot seinät pienentävät käyttötilaa.
  Täytön ja 1 cm:n kiehumisvaran tarkistus ratkaisee. Suurempi vuoka voi
  muuttaa kerrospaksuutta ja paistoaikaa. Mitoitus on vielä koekeitettävä.
- 650 g vuokakastiketta, kasvisten/juuston kosteus ja 100 ml lisävettä
  muodostavat lähtöoletuksen 200 g:lle kuivaa pastaa. Peittäminen ja
  kastikkeen levitys molemmille puolille vähentävät kuivumista; veden
  50–150 ml säätövara ei ole kokeellisesti validoitu kaikille tuotteille.
- Valmistajan Knorr GN -ohje on 3–5 kerrosta, noin 45 min 180 °C:ssa,
  ei välttämätöntä esikeittoa. Luonnoksen 3–4 kerrosta ja 45 min korvaavat
  videon 200 °C / 30–35 min suoran siirron. Veitsitarkistus kaikista
  kerroksista ja oman pakkauksen ohje ratkaisevat. Valmistaja ei erittele
  uunitilaa; tasalämmön ja folion käyttö ovat kotikeittiösovellusta.
  Uuni säädetään alempaan lämpöön heti paahdon jälkeen, jotta se ehtii
  jäähtyä kokoamisen aikana; lisäodotus pidentää kokonaisaikaa.
- Aikataulu 15 + 25 + 10 + 45 + 15 = 110 min sisältää kastikkeen ja
  juustojen valmistelun paahtamisen aikana. Aktiivinen aika noin 35–40 min,
  kokonaisaikavara noin 100–130 min. Ei koekeitetty.

Omistaja antoi 27.10.2026 julkaisuluvan ja toimitti reseptille
havainnekuvan. Resepti julkaistaan ilman hyväksyttyjä ravintoarvoja tai GK:ta.
Käytännön valmistus on edelleen koekeittämättä; kuva ei ole koekeittotodiste.
Tämä muistio ei anna lupaa esittää havainnollistavia lukuja hyväksyttyinä.

## Erillisen tarkistuskierroksen havainnot

Tarkistuksen lähtöversio: `7b339c2cdc5c135b40f680b6cfe450f7ebeea72f`.

- Aritmetiikka ja herkkyystaulukot tarkistettiin uudelleen ainesmääristä.
  200 g:n ja 180 g:n pastavaihtoehtojen luvut eivät muuttuneet.
- Reseptin ainesluettelon 180 g:n vaihtoehto tuotiin myös kokoamisohjeeseen;
  muiden ainesten määrät pysyvät samoina.
- Kuvaukselle ja huomioille otettiin käyttöön sivuston tunnistamat
  `Kuvaus`- ja `Muistiinpanot`-otsikot. Allergeenit, lähde, yhteistyömaininta
  ja laskennan rajaus säilyvät näin samassa luettavassa huomio-osassa.
- Mozzarellan valutettu painoperusta ja auditointien soveltamisala
  täsmennettiin. Tämä ei poista tuotetiedon tai GI:n lähdepuutteita.
- 180 °C / 45 min tarkistettiin valmistajan sivulta. Uunitilaa ei ilmoiteta
  lähteessä, joten tasalämpö nimettiin sovellukseksi ja lämpötilan lasku
  siirrettiin tapahtumaan kokoamisen aikana.

Tämän tarkistuskierroksen lopussa resepti ja PR säilyivät luonnoksina.
Tarkistus ei ollut koekeittotesti eikä toisen henkilön hyväksyntä.
Myöhempi omistajan julkaisupyyntö on kirjattu yllä.
