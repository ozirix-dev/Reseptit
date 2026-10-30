# GK-80 AJO 2 – 4/30 reseptille uusi numeerinen GK-ehdotus. Tavoite 10. Päätös PARTIAL.

Status: DRAFT – INDEPENDENT REVIEW REQUIRED. Tarkistus 30.10.2026.

## A. Tulostavoite

Neljä ehdollista B-pistearviota, ei uusia vaihteluvälejä. Kaikki neljä vaativat täsmennetyn reseptiversion ja julkaistun kasvisimputaation hyväksynnän. Kymmenen tavoite ei täyty. Näitä ei lasketa hyväksytyiksi tai julkaistuiksi. Merkittävä menetelmäpäätös on yhä avoin: kelpaako julkaistu GI-pisteoletus pienelle kasvisosuudelle, vaikka todellista epävarmuusrajaa ei ole osoitettu? Jos katselmoija ei hyväksy tätä, hyväksyttävien uusien ehdotusten määrä on nolla.

Kaikki 30 ovat eri reseptitunnuksia, nykyisiä keskeneräisiä ja Pilotin 1 ulkopuolella. Chao ga ja bubur ayam ovat eri julkaistut reseptit, mutta niiden täsmennetty laskentasyöte on sama; nämä eivät ole kaksi riippumatonta validointikoetta. Minttupuuroehdotuksessa minttu syödään: nykyinen siivilöity hauduke ei saa tätä arvoa ilman reseptimuutosta.

[Valinta](selection.json) sisältää 243 keskeneräisen koneellisen seulonnan ja 10+10+10-ryhmät. R2:n 55 ei-GI-korjauskohdetta seulottiin, joista 52 on pilotin ulkopuolella. CHO-valmius ei osoittautunut riittäväksi GK-ratkaistavuuden ennustajaksi. R3:n lähteistetyt kokonaisuudet ja pilotin lähteet käytettiin uudelleen; koko kokoelmalle ei tehty uutta syväauditointia.

## B. Uudet GK-laskelmat

| Resepti | CHO g/annos | GK/annos | Menetelmä | Luottamus | Katselmointitila |
| --- | --- | --- | --- | --- | --- |
| Hu tieu -nuudelikeitto kasviksilla | 42.077 | 25.403000 → noin 25 | B, julkaistu kasvisoletus | LOW | READY_FOR_INDEPENDENT_APPROVAL |
| Chao ga -inkiväärinen kanapuuro | 37.324 | 29.729600 → noin 30 | B, julkaistu kasvisoletus | LOW | READY_FOR_INDEPENDENT_APPROVAL |
| Bubur ayam -kanariisipuuro | 37.324 | 29.729600 → noin 30 | B, julkaistu kasvisoletus | LOW | READY_FOR_INDEPENDENT_APPROVAL |
| Marokkolainen minttutee-kaurapuuro | 39.412 | 26.179300 → noin 26 | B, julkaistu kasvisoletus | LOW | READY_FOR_INDEPENDENT_APPROVAL |

Kaikki neljä pistearviota ovat korkeassa GK-luokassa. LOW tarkoittaa pientä luottamusta, ei matalaa GK:ta. Tarkat punnitut ainekset, tuote-/valmistusrajaukset ja korvaavat ohjeet ovat [recipes.json](recipes.json)-tiedoston proposedPreparation-kentissä. Koko määritelty annos syödään, suola on ainoa massaton varmennettu makronolla. Kuiva- ja kypsäpainoa ei sekoiteta. Ravintoarvot ovat geneerisiä koostumusviitteitä, eivät GI-testituotteiden pakkausmerkintöjä.

| Resepti | Proteiini g | Rasva g | Kuitu g | Kasvisoletuksen laskettu GK-osuus |
| --- | --- | --- | --- | --- |
| Hu tieu -nuudelikeitto kasviksilla | 21.613 | 2.023 | 2.106 | 0.5028 |
| Chao ga -inkiväärinen kanapuuro | 20.485 | 1.066 | 0.542 | 0.1296 |
| Bubur ayam -kanariisipuuro | 20.485 | 1.066 | 0.542 | 0.1296 |
| Marokkolainen minttutee-kaurapuuro | 9.223 | 8.283 | 4.966 | 0.0528 |

Kasvisoletuksen osuus ei ole sen virheen yläraja. Nämä ovat nimettyjen oletusten pisteitä, eivät mitattuja ateria-GI-arvoja tai verensokeriennusteita. [Eristetty esikatselu](preview.html) näyttää kokonaiset arviot ja näkyvän epävarmuuden. Tuotannon käyttöliittymää tai kieliversioita ei muuteta.

## C. Pilotin 1 kolme ehdotusta

Lähteet katselmoitiin erikseen alkuperäisen Mani-artikkelin sekä julkaistujen taulukoiden avulla ja aritmetiikka laskettiin erillisellä Decimal-toteutuksella. Katselmoinnin teki sama toteutusagentti; tämä ei ole riippumattoman ihmisen hyväksyntä. Tarkka historia ja korjattu leipälähteen metadata ovat [pilot-review.json](pilot-review.json)-tiedostossa. Pilotin alkuperäisiä tiedostoja ei muuteta.

**vietnamilainen-kahvijogurtti-banaanilla: ACCEPTABLE_FOR_REVIEW.** Maustamaton makeuttamaton jogurtti 100 g, kahvijuoma 200 g, banaanin syötävä massa 125 g ja makeutettu kondensoitu maito 30 g; kaksi annosta. Neljä koostumusta ja kaikki makrot tarkistettu pilotin lähderiveistä. GI 61 vastaa makeutettua kondensoitua maitoa, ei haihdutettua makeuttamatonta maitoa. Banaani 47 tarkoittaa kypsentämätöntä banaania, jonka kypsyysastetta ei täsmennetä; 57 on ylikypsä. Kyse ei ole varmennetusta raa'an ja kypsän banaanin rajasta. Jogurtin GI 17/35 ovat eri tuotetyyppien analogiat. Geneerinen koostumus säilyy samana; nimetty mallialue ei kata kaikkea tuote- tai kypsyysvaihtelua.

**valimerellinen-halloumi-tomaattileipa: ACCEPTABLE_FOR_REVIEW.** Ehdollinen korjattu skenaario: 150 g halloumia, 100 g raakaa tomaattia, 25 g oliiveja, 100 g vehnähapanjuurileipää, 13.5 g öljyä ja suola, kaksi annosta. Paista vain halloumi; leipä tarjoillaan paahtamatta, tomaatti raakana. Koko öljymäärä ja ruoat syödään. Tämä korvaa ristiriitaiset taikinavaiheet ja aiemman kevyen paahtamisen; nykyisen paahdetun version vaikutusta ei väitetä rajatuksi. GI 54: vehnähapanjuurileipä, Australia 2003, UO5, valmistus tarkemmin ilmoittamatta. GI 82: Uusi-Seelanti 2010, 50:50 täysjyvä-/valkoinen vehnä, 80 min nousu, 60 min kohotus, 200 °C / 60 min paisto. Pilotin 54-tietueen preparation-kenttään kopioitu 82-rivin tarkka resepti oli virhe: vain 82 saa nämä tiedot. Tässä katselmoinnissa metadata korjataan erillisellä overlaylla, historia säilyy. Halloumin 0.75 g CHO/annos saa maitoanalogialla 0.225–0.345 GK; ero 0.12 ei ole biologinen enimmäisraja. Leivän geneerinen koostumus ja eri GI-tuotteet ovat LOW-analogia.

**pohjoisafrikkalainen-harcha-juustolla: REJECTED.** Mani 1992 alkuperäinen artikkeli, kuvatut sivut 447–448, tarkistettu. GI 55 ja 76 koskevat höyrytettyä tai paahdettua ja vedessä gelatinisoitua mannasuurimoa: 67 g suurimoa, 400 ml vettä, 5 g öljyä, 20 min; 6 T2D-osallistujaa per ruokaryhmä. Tiivis pannuleipä on eri ruokamatriisi. Uudempi mannasuurimoleipä-/couscous-/pastatutkimus ei anna suoraa harcha-rajausta. Säilytä vanha 19–26 tutkimushistoriana, poista se aktiivisesta ehdotuskattavuudesta. Älä levennä aluetta keksityillä päillä tai muuta harchaa puuroksi.

Kahvijogurtin tarkat päät: 10.697125–12.146875. Halloumileivän korjatun paahtamattoman skenaarion päät: 14.161740–21.311420; keskisuuri–korkea. Molemmat ovat READY_FOR_INDEPENDENT_APPROVAL. Harchan vanha aritmetiikka 18.648000–25.943600 on toistettavissa mutta valmistusanalogia hylättiin. Yhtäkään näistä ei lasketa neljään uuteen.

## D. Laskentamallin parannukset

Puuttuvan tarkan GI-sidoksen rinnalle tuli lähteeseen ja hashiin sidottu SOURCE_COMPARATOR-vaikutus. Skenaario laskee myös sen positiivisen CHO:n; useiden pienten osuuksien vaikutus summataan. GI:n ei oleteta rajoittuvan sataan. Toisiinsa liittyvät määrät, tuotteet ja valmistukset pysyvät kokonaisina skenaarioina, eikä mallissa rakenneta mahdottomia ristiyhdistelmiä.

Erillinen PUBLISHED_IMPUTATION-tunniste sallii nimetyn julkaistun pisteoletuksen. Se ei saa esiintyä ihmisillä mitattuna GI:nä, suorana A-menetelmänä tai biologisena vaihteluvälinä. Kaikki neljä uutta ehdotusta hyötyvät tästä: ilman sidosta kokonais-GK on edelleen null. Ehdotuskynnys sallii enintään yhden GK-yksikön **lasketun imputaatio-osuuden**; tämä on tutkittava toimituksellinen valinta eikä osoitettu enimmäisvirhe. Lähteistettyjen vertailujen skenaarioväli ja imputaation piste pidetään eri asioina.

Jos vaikutukselle ei ole soveltuvaa lähdettä, se jää tuntemattomaksi pienestäkin CHO:sta huolimatta. Stressiluku ei koskaan kelpuuta reseptiä. Olennainen tuntematon, puuttuva massa/koostumus tai vanhentunut lähde estää kokonaisarvon. Kaikki neljä makroa tarkistetaan ja koostumussidos on nyt hashattu. Suolan ja pippurin yhdistelmää ei hyväksytä suolan nollaksi.

Luokkarajan ylitys säilyy näkyvänä: esimerkiksi halloumileipä 14–21 saa molemmat luokat. Pilotin laajan, kaikki kolme luokkaa kattavan alueen erillinen käyttökelpoisuusrajoitus säilyy. Malli tukee nimettyjä vertailualueita, mutta tässä erässä ei löytynyt uutta riittävän perusteltua kokonaisaluetta. Julkaistun imputaation hyväksyttävyys jää olennaiseksi avoimeksi menetelmäkysymykseksi.

## E. GI-lähteiden vaikutus

Seitsemän uutta tutkimustietuetta: kuusi ihmis-GI-vertailua ja yksi julkaistu imputaatiomenetelmä. Näistä nuudeli 61 auttaa yhtä, riisipuuro 80 kahta ja kaurapuuro 76 yhtä uutta numeerista ehdotusta; kasvisten pisteoletus 40 osallistuu kaikkiin neljään. Herne 42, porkkana 32 ja upittu 69 eivät yksin avaa yhtään kokonaista uutta arvoa. IFCT:n kaksi uutta koostumusriviä ratkaisevat currylehden ja riisihiutaleen koostumuksia, eivät niiden koko aterian GK:ta. Aktiivinen 45 GI-tietueen tuotantorekisteri säilyy ennallaan.

- [Atkinson ym. 2021](https://doi.org/10.1093/ajcn/nqab233): nuudeli, riisipuuro, kaura, herne ja porkkana. Alkuperäinen julkaistu liitetaulukko luettiin peilipalvelusta; UO-tutkimusten alkuperäisprotokollia ei väitetä luetuiksi. Taulukon GI on jo glukoosiasteikolla. SEM ei ole reseptialueen pää.
- [Atkinson ym. 2008](https://doi.org/10.2337/dc08-1239): vähähiilihydraattisten kasvisten julkaistu GI 40 -koodausehdotus. Soveltaminen tuoreisiin yrtteihin, ituihin ja sipuliin on tämän projektin näkyvä tulkinta; ei yleinen mauste-, liemi- tai siemenarvo.
- [Urooj & Puttaraj 2000](https://doi.org/10.1017/S0007114500000611): upittu 69, SD 13, 11 tervettä. Alkuperäisreseptin sipuli ja öljy estävät nimeämisen öljyttömän upman mannasuurimon suoraksi GI:ksi.
- [Mani ym. 1992](https://doi.org/10.1079/BJN19920102): alkuperäisen valmistuksen tarkistus johti harchan vanhan ehdotuksen hylkäämiseen.
- [IFCT 2017](https://www.nin.res.in/ebooks/IFCT2017.pdf): currylehdet G010 ja riisihiutale A011; käytettävä CHO ja kaikki neljä makroa tarkistettu taulukkosarakkeista. Kuitua tai polyoleja ei vähennetä toiseen kertaan.

Tarkat linkit, taulukkorivit, lähdehashit, rajoitteet ja osallistujat ovat [sources.json](sources.json), [composition-sources.json](composition-sources.json) ja [provenance.json](provenance.json). Lähteen validi hash ei yksin todista soveltuvuutta.

## F. Keskeneräiset reseptit

Neljän numeerisen ehdotuksen ehdot on kuvattu B:ssä. Muut 26 on käsitelty alla. Osalaskelmien makrosummat ovat tunnettujen rivien summia, eivät varmennettuja kokonaisannoksia; kokonais-GK ja kokonais-CHO pysyvät null-tilassa, kun koko reseptiskenaario on ratkaisematta.

| Resepti | Jäljelle jäävä este ja lähdepäätös |
| --- | --- |
| Khao tom katkaravuilla | Kanalientä 700 ml: 1.4945 g CHO/annos jää ilman vastaavaa GI:tä. Valkosipuli ja inkivääri voidaan mallintaa, mutta lihaliemen hiilihydraattilähde on ensin yksilöitävä. Puurovertailu 80 ei yksin ratkaise koko keittoa. |
| Kreikkalainen hunajainen tahinipuuro | Tahinin 0.0675 g CHO/annos on pieni, mutta seesamtahnan ihmis-GI ei varmistunut. Cashew, kokonaisten pähkinöiden GI tai lähteetön tahini 35 eivät osoita jauhetun tahnan vaikutusrajaa. |
| Hojicha-jogurtti persimonilla | Persimonille löytyi taulukkovertailu 61. Hojichan jauhe/hauduke on täsmennettävä ja seesamin 0.029275 g CHO/annos jää avoimeksi; teelehtien CHO ei ole haudukkeen CHO. |
| Pistaasi-ruusuvesijogurtti | Ruusuveden koostumus/annos on avoin. Pistaasin aterialisäkoe ei ole pistaasin GI-mittaus; granaattiomenamehun GI 53 ei sellaisenaan varmista kokonaisten siementen GI:tä. |
| Korealainen bulgogi | Jasmiiniriisin 68-vertailu sopii kuumana syötävään keitettyyn riisiin. Soijakastikkeen, seesamin ja pippurin vaikutus sekä marinadin syötävä osuus jäävät avoimiksi. R3:n 60 ml soijan tiheys pitää huomioida. |
| Hanoilainen bún chả | Kuivien riisinuudelien 61-vertailu ratkaisee päähiilihydraatin. Kalakastike, pippurimäärä ja marinadin pidättyminen jäävät avoimiksi; sokeri ei edusta kastikkeen koko koostumusta. |
| Chettinad-kana paahdetuilla mausteilla | Currylehtien koostumus löytyi IFCT:stä. Fenkolinsiemenen massa ja koostumus sekä useiden mausteiden GI jäävät avoimiksi; kanelitangon siirtymää liemeen ei tunneta. |
| Kotitekoinen döner kebab naudanlihasta | Pitaleipä ja kaalisalaatti kuuluvat koko annokseen. Kaalisalaatin tuote/resepti ja mausteseoksen GI jäävät avoimiksi; lihaosan GK ei edusta koko reseptiä. |
| Perunaton suomalainen lihakeitto | Keiton siivilöinnin, sipulin/juuresten pidättyminen ja laakerin/pippurin siirtymä liemeen jäävät avoimiksi. Vettä ei merkitä ravintoaineiltaan tuntemattomaksi, mutta annoksen saanto on täsmennettävä. |
| Parmesaaninen kanapannu parsakaalilla | Kerma/voi voidaan verrata maitoon LOW-analogiana, mutta liemi ja pippuri jäävät avoimiksi. Parsakaalin CHO ei ole nolla; kasvisten imputaatiomenetelmä yksin ei ratkaise koko annosta. |
| Kermainen kanasienipannu | Sienen CHO 0.50 g/annos on AFCD:n polyolit jo poissulkevaa arvoa. Imputaatio 40 tuottaisi 0.20 GK, ei varmennettua ylärajaa. Sinappi, liemi ja pippuri jäävät avoimiksi. |
| Kuubalainen ropa vieja | Lihaliemen CHO on lähderivillä 3 g/100 g, yhteensä 2.5 g/annos. Sitä ei saa lukea arvoksi 0.3. Liemeä, laakerin siirtymää ja mausteita ei pystytä rajaamaan. |
| Sinappinen kanapelti paahdetulla kaalilla | Kaali, hunaja ja sinappi sisältävät merkittävän CHO-osuuden. Sinappituote, valkosipulijauhe/pippurimäärä ja mausteiden GI jäävät avoimiksi; päällekkäiset valmistusvaiheet tulee yhdistää. |
| Sitruuna-yrttikana ja paahdettu parsa | Sitruunasta käytetään mehu ja kuori, ei vanhan koostumusrivin koko hedelmää. Kuivien mausteiden määrät sekä pippuri ovat avoimia; suola+pippuri-riviä ei hyväksytä CHO-nollaksi. |
| Hitaasti haudutetut carnitas-salaattitacot | Liemen pidättyminen ja appelsiinin/limen käyttö jäävät avoimiksi. Aiempi Australian native lime -koostumus ei vastaa tavallista limettiä ja poistettiin tästä ehdotuksesta. |
| Paprikainen VHH-gulassi | Lihaliemen, paprikan ja kuminan GI sekä pippurin/persiljan massat jäävät avoimiksi. Voita/öljyä ei saa yhdistellä eri skenaarioista. |
| Kookosriisi ja haudutetut pavut | Riisin ja valutettujen kidneypapujen ihmistutkimusvertailut löytyvät, mutta kookosmaidon GI jää avoimeksi. Kookosmaitopuuron GI 31 on seosruoan, ei maidon GI. |
| Nasi uduk -kookosriisi ja muna | Kookosmaidon ja kananmunan positiivinen CHO jää ilman hyväksyttävää GI-vertailua. Keitetyn riisin 68 ei yksin ratkaise annosta. |
| Bissara-härkäpapukeitto aamiaiseksi | Kypsennetty ja soseutettu kuiva härkäpapu tarvitsee vastaavan vertailun. Pakastetun tuoreen härkäpavun 63 ei riitä; kumina jää myös avoimeksi. |
| Pehmeä mannasuurimoupma | Currylehtien koostumus ratkaistiin. Alkuperäistutkimuksen upittu 69 sisältää sipulia ja öljyä; nykyinen öljytön kasvisupma ei vastaa sitä riittävästi. Vertailua ei nimetä mannasuurimon mitatuksi GI:ksi. |
| Mausteinen poha maapähkinöillä | Riisihiutaleen ja currylehden koostumus korjattiin IFCT:stä. Poha 74 -viite löytyi koontitaulukosta, mutta alkuperäisen kontrolliruoan valmistus ei varmistunut. Pihviohje on ristiriidassa poha-vaiheen kanssa. |
| Pho ga -kanakeitto aamuksi | Kuivanuudelin 61 sopii pääainesosaan, mutta tähtianiksen syötävä massa/haudukkeeseen siirtyminen ja GI jäävät avoimiksi. Tähtianis ei ole tavallinen anis. |
| Thaimaalainen riisinuudelikeitto aamuksi | Kokonainen lähtölaskelma puuttui. Nuudeli ja kana voidaan sitoa olemassa oleviin koostumuksiin, mutta liemi, limetin mehu/massa ja mahdollinen chili/öljy on määriteltävä ennen koko annosta. |
| Kardemumma-taatelipuuro tahinilla | Kauran, taatelin ja maidon vertailut ovat käytettävissä. Kardemumman ja tahinin GI jää avoimeksi; niiden tunnettuja CHO-osuuksia ei muuteta nolliksi. |
| Kongjuk soijapapu-riisipuuro | Soijapavun kuiva/kypsäpaino ja liotus/keitto sekä riisipuuron yhteiskypsennys on täsmennettävä. Seesamin GI jää avoimeksi; kypsän pavun ja kuivan massan arvot eivät ole vaihdettavia. |
| Meksikolainen maissipuuro canelalla | Maissipuuron koontitaulukkovertailu 68 löytyi, mutta hienojakoisen atolen valmistus, kaneli ja vaniljauute jäävät avoimiksi. Maitoanalogia ei ratkaise mausteita. |

## G. Kattavuuden etenemä

| Mittari | Määrä |
| --- | --- |
| Tuotanto ennen / jälkeen | 83/326 → 83/326 (25,46 %) |
| Nykyisin keskeneräiset | 243 |
| Ajo 2 uudet ehdolliset Draft-pisteet | 4 |
| Pilotin 1 historialliset / jatkokatselmoitavat / hylätty | 3 / 2 / 1 |
| Uudet hyväksytyt mutta julkaisemattomat | 0 |
| Uudet julkaistut | 0 |
| Tavoite | 261/326 (80,06 %) |
| Todellinen lisätarve ilman hyväksyntöjä | 178 |
| Ehdollinen kattavuus, jos kaikki kuusi hyväksyttäisiin | 89/326 (27,30 %) |
| Tämän ehdollisen tilanteen lisätarve | 172 |

83 nykyisen arvon laatuvaatimusten täyttymistä ei hyväksytä tässä uudelleen. Yhdeksän GK-nollaa vaatii oman korjauskäsittelynsä; lisätarve 178 olettaa kaikkien 83 säilyvän kelvollisina. Kattavuuden tavoite on riittävän täsmällinen, mutta 80 prosentin saavutettavuutta tämä ajo ei osoita. Neljän Draft-pisteen lisääminen ei muuta tuotantoprosenttia.

## H. Testit, historia ja toistettavuus

Laskentatarkistus: `python site/scripts/gk80-run2-decimal.py`. Työkalu käyttää Python Decimalia 40 numeron tarkkuudella eikä tuo TypeScript-mallia. Kaikki 30 osalaskelmaa, neljä kokonaista uutta pistettä, jokainen ainesosa ja kaikki neljä makroa verrataan [golden.json](golden.json)-tiedostoon. Numeeristen ehdotusten 20 koostumusriviä tarkistetaan lisäksi suoraan jäädytetyistä Fineli-/AFCD-viitteistä. Pilotin kolmen ehdotuksen kuusi skenaariota on laskettu erikseen katselmointiaineistoon.

GK-testit ovat normaalissa `npm test`- ja `npm run test:gk80`-polussa. Ne kattavat pienen ja suuren tuntemattoman, useat osuudet, puuttuvan massan, aidon nollan, alle yhden pyöristyvän positiivisen arvon, luokkarajan, riippuvaiset vaihtoehdot, vanhentuneet sidokset, väärän ruokaperheen ja GI:n yli 100. Pilotin regressio tarkistaa 994 suojattua tiedostoa ja kaikki 326 tuotantotulosta.

Paikallinen lopputarkistus: **185/185 normaalia testiä PASS**, joista 28 GK-80-testiä. Python Decimal PASS kaikille 30 reseptille ja neljälle kokonaispisteelle. Build (sisältö, tiukka ravintoauditointi, GK-auditointi, TypeScript, Vite ja 691 reitin prerender) PASS. Markdownlint: 846 tiedostoa, 0 virhettä. 994 suojattua tiedostoa ja 326 tuotantotulosta ennallaan. Buildin ennestään suuri JavaScript-chunk tuotti varoituksen, ei virhettä. Lopullisen etä-HEADin CI varmennetaan ennen handoffia.

Pohja on Pilotin 1 uudempi HEAD `bff8c6a1799cf56947413ddfc634e72ea4d2efce`, joka sisältää käyttäjän mainitseman `23b4c68`-version jälkeisen erähyväksyntälinjauksen. ReportHubin pilotin viimeisin HEAD on `ae44b055f0482264a18084b1382c5d19aeeddd51`; sitä ei muuteta. Reseptit main on `e8da2c9417e2aeff55a85d599b3b7e1ad465f36c`, ReportHubin työpohja `b4f7f5d745f4401a5d956983cef1dd4f1c0d7604`.

Ajo 2 on erillinen `codex/gk80-run-2`-haara ja uusi Draft-PR. Se riippuu [Pilotin 1 Draftista #135](https://github.com/ozirix-dev/Reseptit/pull/135); R2 [#133](https://github.com/ozirix-dev/Reseptit/pull/133) ja R3 [#134](https://github.com/ozirix-dev/Reseptit/pull/134) säilyvät erillisinä tutkimuslähteinä. Lopullisen HEADin CI ja commit-SHA raportoidaan PR:n tarkistuksissa sekä [ReportHubin ajon raportissa](https://github.com/ozirix-dev/ReportHub/blob/codex/reseptit-gk80-run-2/reports/active/2026-10-30-reseptit-gk80-run-2.md). Mainia, tuotantoa, kieliversioita tai vanhaa pilotin tutkimushistoriaa ei muuteta. Mergeä, Ready-siirtoa tai deployta ei tehdä.

## I. Yksi seuraava rajattu työerä

Ehdotus: **neljän liemi-/kastiketyypin tuotesidonta** (kanaliemi, lihaliemi, soijakastike ja kalakastike) ja vaikutuksen kokeilu kahdeksaan jo valittuun reseptiin: khao tom, thai-riisinuudelikeitto, bulgogi, bun cha, kana-parmesaanipannu, kanasienipannu, ropa vieja ja gulassi. Selvitä ensin tarkat tuotteet, hiilihydraattilajit ja valmistus/retentio; hyväksy vaikutusmalli vain lähdenäytön perusteella. Tämä käsittelee yhteistä estettä, ei aloita uutta samanlaista 30 reseptin hakua. Työerää ei käynnistetä automaattisesti.

Periaatepäätös: Codex tekee perustellut arviot itsenäisesti ja tuo koko erän katselmoitavaksi. Yksittäisistä arvioista ei kysytä lupaa. Tavallinen GK-80-erä on 20 reseptiä; käyttäjän AJO 2 -ohjeen erillinen koko on 30.

**Hyväksytäänkö erä seuraavaan vaiheeseen? Kyllä / Ei.** Hyväksyntä tarkoittaa seuraavan rajatun kehitysvaiheen päätöstä; se ei julkaise arvoja eikä hyväksy jokaista lähdeoletusta automaattisesti.
