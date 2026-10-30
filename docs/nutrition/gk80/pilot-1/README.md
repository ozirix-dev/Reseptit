# GK-80 PILOT 1 – katselmointipaketti

Status: DRAFT – INDEPENDENT REVIEW REQUIRED

## A. Päätös

**CONDITIONAL GO riippumattomaan katselmointiin.** Tekninen pilotti on toistettavissa. Kolme laskettua C-ehdotusta ei tarkoita kolmea hyväksyttyä tai julkaistua arvoa. Harcha vaatii olennaisen soveltuvuuspäätöksen; sen hyväksymistä ei suositella pelkän aritmetiikan perusteella. 80 prosentin saavutettavuutta ei vielä osoitettu.

## B. Lähtötila ja rajaus

Tarkistus 30.10.2026. Reseptit main: e8da2c9417e2aeff55a85d599b3b7e1ad465f36c. ReportHub main: 067f22a38a2bc6a148190dc1f4b188deab2d0b28. Tuore auditointi: 326 reseptiä, 83 laskettua, 243 keskeneräistä (25,46%). Tavoite261/326=80,06%; lisätarve 178. GI-rekisterissä 45 aktiivista tietuetta.

[Nykyisen mainin onnistunut build ja Pages-deploy](https://github.com/ozirix-dev/Reseptit/actions/runs/40964207895) sekä HTTP 200-etusivu varmistettiin. Etusivun SHA 256 on baseline.json:ssa; etusivu yksin ei todista kaikkien reseptisivujen GK-arvoja. Tarkka 326 tuloksen vertailu tehdään julkaistun commitin paikallisesta auditoinnista.

[Koko omistajan master plan](../../plans/gk80-master-plan-v1.md) on tallennettu. Vain ajo 1 tehtiin. R2/R3.1 säilyvät erillisissä Draft-PR:issä [#133](https://github.com/ozirix-dev/Reseptit/pull/133) ja [#134](https://github.com/ozirix-dev/Reseptit/pull/134). Niiden tarkat HEADit on baseline.json:ssa. R3.1:n83→12-politiikkaa ei toteuteta.

Valinta: tarkoituksellinen 5+5+5+5-otos aiemmista syväarvioista; jokaisella yksi ensisijainen ryhmä. Määrä, analogia, vaihteluväli ja tekstin täsmennys limittyvät. Riisi, vehnäleipä, mannasuurimo, pasta ja tortilla sisältyvät otokseen. Tämä ei ole satunnaisotos 243 reseptistä.

## C. Pilotin 20 reseptiä

E = kokonaisen nimetyn syöteskenaarion CHO, ilman kokonaista GK:ta. F = myös reseptin kokonaisuus jää avoimeksi; tunnettuja osia voidaan silti laskea. R3:n B/C-kirjaimet olivat eri luokitus eivätkä vastaa tämän ohjelman A–F-tasoja.

| Resepti | Aiempi este / uusi päätös | Menetelmä | Uusi GK/annos | Epävarmuus | Tila |
|---|---|---|---|---|---|
| Kiinalainen tomaatti-kananmunawokki | Annosmuunnokset korjattu; muna, soija ja kevätsipuli jäävät avoimiksi. Riisivertailut eivät ratkaise niitä. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Yangzhoun paistettu riisi | Kypsän riisin massa tunnetaan; jäähdytys, herne, soija ja lisukkeet tarvitsevat soveltuvuuden tarkistuksen. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Paahdettu siemengranola jogurtilla | Jogurttivertailu toimii; siemenet, manteli ja vadelma vaativat omat vertailut. Cashew ei ole mantelirouhe. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Kreikkalainen moussaka | Perunan paistaminen ja vehnäjauhosuuruste erotettava keitetystä perunasta ja leivästä; munakoiso avoin. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| VHH-lihapiirakka | Mantelijauhon ihmis-GI ei varmistunut; pelkkä pähkinäkeskiarvo ei ratkaise jauhatusta ja paistoa. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Vietnamilainen kahvijogurtti banaanilla | Maustamaton jogurtti, 125 g syötävää banaania ja makeutettu kondensoitu maito. Tuote- ja kypsyysanalogiat LOW. | C | 11–12 | LOW; lähde-/valmistusvalinta | Numeerinen ehdotus, ei hyväksytty |
| Papaija-limejogurtti paahdetulla kookoksella | Papayan pala/sose-vertailu löytyi; kookoshiutaleen ja limen vaikutus jää erikseen avoimeksi. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Aamiaisquesadilla sienillä ja maissilla | Tortillan ja maissinjyvien lähteet erotettu; 0,30 g sienen CHO:n GI-vaikutus avoin. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Letut – VHH | Mantelijauho ja muna avoimia. Kerma ja voi on arvioitu erillisellä laktoosianalogialla; manteli jää avoimeksi. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Harcha-mannasuurimoleipä juustolla | Kiistanalainen LOW-analogia: pannuleivän mannasuurimo verrataan hydratoituun mannasuurimoon; lähteessä vain 6 T 2D-osallistujaa. | C | 19–26 | LOW; lähde-/valmistusvalinta | Numeerinen ehdotus, ei hyväksytty |
| Pohjoisafrikkalainen taatelipuuro appelsiinilla | Mannasuurimon valmistusero ja 0,3575 g kanelin CHO avoimia; lähteen öljyä ei lisätä reseptiin vain GI:n vuoksi. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Kookosriisi mangolla ja seesamilla | Kuiva riisi ja syötävä mango täsmennettävä. Kookosmaito ja seesami avoimia; puuron GI 31 ei ole maidon GI. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Juustotaikinan kanelipullat | Mantelijauho, muna ja kaneli avoimia; erytritolia ei lasketa käytettävään CHO:hon. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Halloumi-tomaattileipä oliiveilla | Vaihe 4 yhdeksi ohjeeksi; vehnähapanjuurileipä ja halloumin laktoosille maitoanalogia. Leivän koostumus erillinen geneerinen arvio. | C | 14–21 | LOW; lähde-/valmistusvalinta | Numeerinen ehdotus, ei hyväksytty |
| Appelsiini-oliiviöljykakku jogurtilla | Appelsiini/sitruuna-ristiriita ja jogurtin paikka ratkaistava; paistetun taikinan GI ei ole jauhon tai leipäryhmän yleisarvo. | F | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Kookospannukakku serabilla | Yksi valmistuskerta, täysrasvainen kookosmaito ja fariinisokeri täsmennetty skenaarioksi; riisijauhopannukakun ihmis-GI puuttuu. | E | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Baozi-höyrysämpylät porsastäytteellä | Hiiva 7 g ja vesi 250 ml on nyt sisällytetty syöteskenaarioon; kaali määriteltävä puristetuksi syötäväksi massaksi; käymisen ja höyrytetyn vehnätaikinan vaikutus avoin. | F | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Egyptiläinen koshari riisistä, linsseistä ja pastasta | Valutettujen linssien ja pastan saannot sekä sipulin tärkkelyspäällysteen säilyminen määriteltävä; ei keksittyä hävikkiprosenttia. | F | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Msemen-kerrosleipä hunajalla | Nesteen laji ja määrä sekä hunajan käyttö täsmennettävä. Kerrostettu pannuleipä tarvitsee oman vertailun. | F | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |
| Japanilainen soba-aamiaiskeitto | Nuudelin kuivapaino, tattariosuus, pinaatin grammat ja yksi liemikaava puuttuvat; tutkimusnuudeli ei yksilöi geneeristä tuotetta. | F | — | LOW; lähde-/valmistusvalinta; tuntematon vaikutus | Keskeneräinen |

### Kolmen ehdotuksen laskenta

Kaikki luvut ovat ainesosista laskettuja. Maitoanalogia ei väitä juuston GI:tä mitatuksi. Skenaarioiden CHO pitää geneerisen koostumusviitteen samana: lähdetuotteen GI:n valinta ei väitä samuutta sen pakkausravintoarvoihin. Alue ei kata kaikkea mahdollista tuotevaihtelua.

| Ehdotus | Täsmälliset päät | CHO/P/F/kuitu g/annos | Tulkinta |
|---|---|---|---|
| Vietnamilainen kahvijogurtti banaanilla | 10.697125–12.146875 | 21.387/3.795/3.680/1.062 | Keskisuuri |
| Harcha-mannasuurimoleipä juustolla | 18.648000–25.943600 | 35.660/10.664/20.203/2.029 | Ylittää keskisuuren/korkean rajan |
| Halloumi-tomaattileipä oliiveilla | 14.161740–21.311420 | 27.581/20.180/28.562/1.924 | Ylittää keskisuuren/korkean rajan |

Kahvijogurtti: 1,7 g jogurtti-CHO×GI17/35 +11,4375 g banaani-CHO×GI47/57 +8,25 g kondensoidun maidon CHO×GI 61, kaikki jaettuna 100. Kahvi 0CHO.

Halloumileipä:25,106 g leipä-CHO×GI54/82 +0,75 g halloumi-CHO×maitoanalogia30/46 +1,725 g tomaatti-CHO×GI 22, jaettuna 100. Oliivi ja öljy 0CHO. Leipälähteiden77/66 tukitietueet jäävät näiden nimettyjen ääriskenaarioiden sisään.

Harcha:31,8 g mannasuurimo-CHO×GI55/76 +(0,06+1,8+2)g meijerituote-CHO×maitoanalogia30/46, jaettuna 100. Maitoanalogian vaikutus skenaarioalueeseen on 0,6176GK; suurin ero tulee mannasuurimosta 6,678GK. Lähteen öljy ja valmistus eivät vastaa pannuleipää. Tätä heikkoa siirtoa ei saa kutsua harchalla mitatuksi vaihteluksi tai hyväksyä automaattisesti kattavuuteen.

## D. Lähteet ja uudelleenkäyttö

Uusia eristettyjä GI-tietueita 21; niistä 18 osallistuu positiivisen CHO:n koelaskentaan. Tietue ei tarkoita uutta tutkimusta. Kahdeksan nykyistä rekisteritietuetta on mukana vertailukatalogissa; aktiivinen 45 tietueen rekisteri ei muutu.

- [Atkinson 2021, DOI10.1093/ajcn/nqab233](https://doi.org/10.1093/ajcn/nqab233): alkuperäisen liitteen taulukot1/2 luettu peilipalvelusta, tiedostotiivisteet tallennettu; keskeiset rivit tarkistettu myös kuvasta. Banaani, jogurtti, kondensoitu/täysmaito, hapanjuurileipä, mannasuurimo, maissinjyvä, papaya. Sydney UO -mittaukset ovat liitteessä julkaistuja tietoja, eivät erillisinä julkaistuja tutkimuksia.
- [Venn 2014, DOI10.1186/1475-2891-13-50](https://doi.org/10.1186/1475-2891-13-50): alkuperäisartikkelin XML ja Table 2, glukoosiasteikon saman eurooppalaiskohortin basmati 57, jasmiini 68 ja sakkaroosi 60. Etnisten kohorttien eroa ei muuteta valmistusvälillä selitettäväksi vaihteluksi.
- Liitteen alkuperäisviitteet: [Henry2005](https://doi.org/10.1079/BJN20051594), [Chan2001](https://doi.org/10.1038/sj.ejcn.1601265), [Tey2017](https://doi.org/10.1007/s12603-017-0880-9), Mani 1992 Br J Nutr 68:445–450. Numeeriset tietueet perustuvat tässä liitteeseen; kaikkia näiden alkuperäisiä kokotekstejä ei ole uudelleen luettu.

Soveltamisrajat ja alkuperäiset tutkittujen ruokien valmistukset ovat sources.json:ssa. Koostumus tulee erikseen Finelistä/AFCD:stä, ei GI-taulukon annos-GL:stä. Rasvaa tai proteiinia ei käytetä yleisenä GK-alennuskertoimena.

Lähteet voivat hyödyttää samanmuotoisia riisi-, hedelmä-, maito- ja leipäreseptejä. Tutkittu 21 tietueen määrä ei todista niiden soveltuvan 21 tai useampaan uuteen reseptiin. Riisin jyvän tietoa ei siirretä jauhoon; maissinjyvää ei siirretä tärkkelykseen; kookosriisipuuron GI 31 ei ole kookosmaidon GI. Mantelilisän sisältävä leipäkoe ei mittaa mantelijauhoa.

## E. Reseptien täsmennykset

recipes.json säilyttää kaikki alkuperäiset ainesosarivit, valmistuksen, massan ja koostumuksen lähteet, neljä makroa ja R3-erot. Jokaisella on oma editorialProposal. FI/EN/SV/TH-reseptejä tai tuotannon ravintotietoja ei muutettu.

Kahvijogurtti: määrittele maustamaton 3,9% jogurtti,125 g syötävää banaania ja makeutettu kondensoitu maito. Halloumileipä: käytä nykyistä vaihetta 4 kerran ja poista taikinasta puhuvat yleisvaiheet. Harcha: yksi paksujen kiekkojen paisto, kaikkien ainesosien käyttötapa ja kaksi annosta; pannuleipää ei vaihdeta höyrypuuroksi lähteen vuoksi. Nämä säilyttävät ruoan identiteetin, mutta leivän tuotetyyppi ja banaanin massa pitää nimetä laskentaversion rajauksiksi.

Serabi ja thaimaalainen mangoriisi säilyttävät R3.1:n nimetyn yhden erän ehdotuksen, eivät ristiriitaisten yleisvaiheiden yhtäaikaista suorittamista. Soba tarvitsee oikean nuudelituotteen/liemen. Msemen tarvitsee nesteen. Baozin kaalin puristus ja käymisvaihe sekä kosharin valutus tarvitsevat syötävän kokonaisuuden määrittelyn. Merkittävä tuote- tai valmistusmuutos on nimettävä variantiksi.

Ravintoarvot lasketaan kaikille skenaarioille uudelleen; nykyisen R3-skenaarion erot vanhaan julkaistuun arvoon säilyvät historicalMacroDelta-kentässä. Lopullinen reseptitäsmennys edellyttää neljän kieliversion yhteistä ainesosa-/valmistus- ja ravintoarvopäivitystä erikseen hyväksyttävässä työssä.

## F. Menetelmän arviointi ja pieni epävarmuus

3/20 laskettua numeerista ehdotusta;0 hyväksyttyä uutta tuotantoarvoa.17 ei saa kokonaista numeerista GK:ta:12 E ja 5 F. Niistä yhdenkään valmistumista pelkällä pienellä teknisellä korjauksella ei osoitettu. Halloumin ja harchan ohjeiden selkeytys on pieni toimituksellinen työ, mutta GI-soveltuvuuden hyväksyntä on erillinen päätös.

Vahvin pilotin tulos on eritelty hedelmä–jogurtti–kondensoitu maito -malli. Leipämallin käyttökelpoinen mutta luokkarajan ylittävä alue syntyy todellisista leipävertailuista. Harchan alueen aritmetiikka toimii, mutta ulkoinen soveltuvuusnäyttö on selvästi heikompi.

Vanhaa1g/2g-rajaparia ei nosteta eikä käytetä automaattisena poissulkuna. Jokainen tunnettu CHO lasketaan. Tuntemattomalle GI:lle tulos on symbolinen lisävaikutus delta, ei nolla: kokoGK = tunnettu summa + delta. Tarkastelussa lasketaan GI, joka tarvittaisiin muuttamaan GK:ta yhdellä yksiköllä:100/ainesosan CHO. Tämä on herkkyys, ei GI-yläraja. Quesadillan 0,30 g sieni-CHO tarvitsee GI 333,33:n yhden GK-yksikön vaikutukseen; papayajogurtin yhteensä 0,6375 g avoin CHO vastaisi yhteisellä vertailu-GI:llä 156,86:a. Luvut priorisoivat katselmointia, mutta eivät todista vaikutuksen ylärajaa tai anna puuttuvalle ruoalle GI:tä.

Toimituksellinen vaikutusraja voidaan hyväksyä vasta, kun ainesosalle on perusteltu lähdearvo tai vaikutusalue, ja sen vaikutus pyöristykseen sekä luokkaan tarkistetaan. Yhtä yleistä GI 100-kattoa tai ±20%-sääntöä ei oteta käyttöön. Malli salliiGI>100. Puuttuvaa määrää ei korvata nollamassalla; nollakoostumukseltaan tunnettu suola on erillinen kirjattu poikkeus makrolaskennassa.

Kolme vaihteluväliä eivät kata kaikkia kolmea GK-luokkaa. Kaksi ylittää keskisuuren/korkean rajan ja näyttää molemmat. Ainesosien sama maitovalinta kulkee samassa skenaariossa yhdessä; mahdottomia rivi kerrallaan valittuja ääriyhdistelmiä ei tuoteta. Tutkimusten SEM/CI säilyy lähdemetadatana. Tuntemattomat vaikutukset eivät sisälly välin päihin.

### Yhdeksän vanhaa nollaa

legacy-zero-review.json sisältää kaikki yhdeksän nykyistä nollatulosta ja niiden positiiviset poisjätetyt CHO-rivit. Maitoanalogian, määrätäsmennyksen ja muiden lähteiden mahdollisuus arvioitiin: kerma/voi/juusto voi hyötyä laktoosianalogiasta, mutta muna, yrttiseokset, sipuli, avokado, soija tai mausteiden epäselvät määrät eivät ratkea sen mukana. Kokonaista korvaavaa lukua ei hyväksytty. Uusi prototyyppi ei esitä vastaavaa puuttuvaa vaikutusta nollana. Nykyinen tuotanto pysyy vertailutilassa; erillinen korjaus on tarpeen ennen uuden mallin tuotantojulkaisua.

| Nykyinen nolla | Poisjätetty CHO g/annos | Seuraava ratkaistava tieto |
|---|---|---|
| munakokkeli | 1.1466 | kananmuna, kuohukerma, voi, ruohosipuli, suola ja mustapippuri; tuotetyyppi/määrä ja soveltuva GI |
| munakasmuffinit | 0.8083 | kananmuna, pinaatti, cheddarjuusto, kuohukerma, mustapippuri; tuotetyyppi/määrä ja soveltuva GI |
| uunimuna-avokadot | 1.4555 | avokado, kananmuna, sitruunamehu, ruohosipuli, suola ja mustapippuri; tuotetyyppi/määrä ja soveltuva GI |
| uunimunat-pinaatilla | 1.5780 | kananmuna, pinaatti, kuohukerma, voi, suola, mustapippuri ja muskottipähkinä; tuotetyyppi/määrä ja soveltuva GI |
| vhh-lihamureke | 1.9117 | kesäkurpitsa, kananmuna, kuohukerma, keltasipuli, suola, mustapippuri ja paprikajauhe; tuotetyyppi/määrä ja soveltuva GI |
| uuniporsas-kermakastikkeessa-vhh | 1.5116 | kuohukermaa, sipuli, mustapippuria, timjamia, voita; tuotetyyppi/määrä ja soveltuva GI |
| tonnikalamunakkaat-uunissa | 0.6175 | kananmunaa, kuohukermaa, silputtua tilliä, mustapippuria ja tarvittaessa suolaa; tuotetyyppi/määrä ja soveltuva GI |
| kiinalainen-teehaudutetut-munat | 1.2700 | kananmuna, soijakastike, tähtianista; tuotetyyppi/määrä ja soveltuva GI |
| thai-kai-jiao-yrteilla | 0.7913 | kananmuna, Squid Brand -kalakastiketta, thaibasilika, kevätsipuli; tuotetyyppi/määrä ja soveltuva GI |

## G. Kattavuusskenaariot

- Varovainen: jos kahvijogurtti ja leipä hyväksytään, harcha ei, ja 9 harhaanjohtavaa nollaa jää ilman korvausta, laskennallinen peitto olisi76/326=23,31%. Jos yhdeksän voidaan korjata numeerisiksi, vastaava peitto olisi85/326=26,07%. Nämä ovat ehtolaskelmia, eivät päätöksiä poistaa arvoja.
- Todennäköistä koko 243 reseptin ennustetta ei voi perustella tällä valikoidulla 20 reseptin aineistolla.15% ehdotusosuutta ei yleistetä. Kaikkien kolmen hyväksyntä ja kaikkien nykyisten 83 korjaaminen/säilyttäminen antaisi86/326=26,38%.
- Kunnianhimoinen tavoite:83 nykyistä kelvolliseksi korjattua +178 uutta =261. Jos 9 nollalle ei saada korvausta, tarvitaan 74+187=261. Kolmen pilotin ehdotuksen hyväksynnän jälkeen lisätarve olisi vastaavasti 175 tai 184. R2:n55 mahdollisesti ilman uutta GI-tutkimusta ratkaistavaa reseptiä ei ole hyväksytty joukko: vaikka kaikki 55 ratkeaisivat, peitto olisi vain138/326 ja tarvittaisiin vielä 123 muuta.134 CHO-ehdokasta on päällekkäinen seulontajoukko eikä lisättävä uusi peitto.

80% edellyttää moniin resepteihin uudelleenkäytettäviä valmistuskohtaisia GI-lähteitä, hyväksyttyä pienen vaikutuksen käsittelyä sekä reseptien täsmennyksiä. Pilotti osoittaa laskentatavan, ei tämän lähdenäytön saatavuutta.

## H. Toistaminen ja suojaukset

Reseptit-repon site-hakemistossa:

```text
npm ci
npm run content:sync
npm run audit:nutrition -- --strict
npm run audit:glycemic-load
npm run test:gk 80
python scripts/gk80-decimal-check.py
npm exec -- tsx scripts/gk80-preview.ts
npm test
npm exec -- tsc -p tsconfig.json
```

Paikallisesti 167 yksikkötestiä läpäisi; mukana 10 GK-80-testiä, joiden sisällä tarkistetaan 20 reseptiä/40 skenaariota ja pyydetyt 14 suojaustapausta. Decimal-tarkistus kattaa jokaisen ainesosan ja CHO/proteiini/rasva/kuitu. Kaikki 994 suojattua tiedostoa ja 326 vanhan tuloksen SHA 256 täsmäävät. Testi ei hyväksy ehdotuksia tieteellisesti.

FI/EN/SV/TH-esitystekstit ovat eristetyssä JSON-esikatselussa, eivät tuotannossa. Sama numeerinen tulos ja luokkarajan ylitys testataan kaikilla kielillä. Natiivi kielikatselmointi ja käyttäjätulkinta jäävät ennen tuotantoa tehtäviksi. Esitys ei ole henkilökohtainen verensokeriennuste tai annosteluohje.

Muutokset: master plan, tämä katselmointiohje,6 JSON-aineistoa, eristetty TypeScript-malli/esikatselu, riippumaton Python-tarkistus, GK-80-testit ja package.json:n testikytkentä. Ei tuotannon resepti-, käännös-, ravinto-, aktiivinenGI-, laskentamalli- tai UI-muutoksia. Nykyinen CI suorittaa uuden testin normaalin npm test -ajon mukana; lopullinen HEAD/CI todennetaan Draft-PR:n GitHub-tarkistuksista ja ReportHub-handoffista.

## I. Yksi seuraava erä

Riippumaton kolmen numeerisen ehdotuksen katselmointi: kahvijogurtin tuotevastaavuus, halloumin maitoanalogia/leipävalinta ja harchan mannasuurimosiirto. Päätä jokaiselle hyväksy/hylkää/rajattu korjaus sekä tarkista pienen CHO-vaikutuksen käsittely. Tätä työtä, ajoa 2 tai tuotantoon vientiä ei käynnistetty.

Baozin pilottilaskentaan palautettiin lähteistetty hiiva 7 g: annokseen 0,11025 g CHO, 0,637 g proteiinia, 0,0875 g rasvaa ja 0,47075 g kuitua. R3:n aiempi puuttuva rivi säilyy historiatietona. Käymisen ja kaalin puristuksen epävarmuus jää avoimeksi.
