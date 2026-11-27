# J05-15 ja J05-16 · ravintolaskennan lähde-ehdokkaat

27.11.2026 · Kokki-Codex · [J05:n luonnokset #1011](https://github.com/ozirix-dev/Reseptit/pull/1011) · [valmistuskorjaukset #1039](https://github.com/ozirix-dev/Reseptit/pull/1039).

Tarkastetut FI-luonnokset on sidottu Git-blobeihin `47fc444b71145a0c49d966391c03a9dc72950ae1` (kalapiirakka) ja `0239daa3a4d7dee4d9fabc01b8938d555d027172` (salaatti). Lähdeaineistot ovat THL Fineli Release 20 (repon viiteaineiston Git-blob `f68c4f3e01a45274fd192cd46a4d9cb9c37761b8`) ja FSANZ AFCD Release 3 (Git-blob `208f18a3f6804a229e65d52b55b86f0b9013c074`). [Fineli avoin data](https://fineli.fi/fineli/fi/avoin-data) · [AFCD:n aineisto](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files).

## J05-15 Kalapiirakka perunakuorrutteella

Laskin neljän annoksen proteiini- ja rasvavertailun koko ainesosalistalle. Valio, Keiju ja Cathedral City ovat laskennan tuote-ehdokkaita. Resepti käyttää yleisnimiä, joten tuotekohtainen tulos edellyttää valinnan katselmointia. Kaikki taulukon massat oletetaan mukaan valmiiseen vuokaan ennen neljään annokseen jakamista. Laskenta käyttää lähtöpainoja ja olettaa ravintoaineet säilyviksi. Keitinveden mukana poistuvia ravintoaineita ja vuokaan jäävää ruokaa ei ole mitattu. Laskelmaa ei ole katselmoitu riippumattomasti.

| Ainesosa | g / erä | Proteiini / rasva g / 100 g | Proteiini / rasva g / annos |
| --- | ---: | ---: | ---: |
| Raaka kuorittu peruna, Fineli 205 | 700 | 1,88 / 0,114 | 3,29 / 0,1995 |
| [Valion ykkösmaito](https://www.valio.fi/tuotteet/valio-vapaan-lehman-ykkosmaito/) | 425 | 3,3 / 1,0 | 3,50625 / 1,0625 |
| [Keiju Kaura 60, ruoanlaittoon soveltuva](https://www.keiju.fi/tuote/keiju-kaura-rypsioljymargariini-60/) | 25 | 0,2 / 60 | 0,0125 / 3,75 |
| Puolikarkea vehnäjauho, Fineli 110 | 25 | 11,6 / 1,56 | 0,725 / 0,0975 |
| Raaka persilja, Fineli 333 | 4 | 1,38 / 0,2 | 0,0138 / 0,002 |
| Pakasteherne, Fineli 34229 | 100 | 5,06 / 0,864 | 1,265 / 0,216 |
| [Raaka seiti, Pollachius virens, Matvaretabellen 04.029](https://www.matvaretabellen.no/en/saithe-raw/) | 300 | 18,3 / 1,3 | 13,725 / 0,975 |
| [Cathedral City Lighter Extra Mature Cheddar](https://www.cathedralcity.co.uk/en/our-cheese/block/lighter-extra-mature-cheddar) | 25 | 29,1 / 21,5 | 1,81875 / 1,34375 |
| **Laskentaesimerkki / annos** | | | **24,36 / 7,65** |

Rivikaava on `erän g × lähdearvo / 100 / 4`. Ykkösmaidon 425 ml muunnettiin Fineli 627:n annospainolla 100 g/dl. Persiljan 2 rkl muunnettiin Fineli 333:n annospainolla 2 g/rkl. Molemmat ovat lähteistettyjä muunnoksia. Seitirivi edellyttää 300 g syötävää, nahatonta ja ruodotonta raakaa fileetä ja tuotteen lajin tarkistamista. Kokonaisen kalan syötävän osuuden kerrointa ei sovelleta valmiiseen fileeseen. Jos lajivastaavuus varmistuu myös Fineli 826:lle (17,56/1,0 g/100 g), sama laskelma antaa tällä vaihtoehdolla 23,80/7,42 g/annos.

### Hiilihydraatit ja GK

Valmistusohjeessa 300 g punnitaan sulatuksesta ja valutuksesta jääneestä syötävästä fileestä. Hiilihydraattiseulonnassa perunan, jauhon, persiljan ja herneen Fineli Release 20 CHOAVL -arvot ovat 15,5 / 73,998 / 1,1 / 9,36 g/100 g. Näiden osuus on **34,10 g/annos**, josta 27,13 g tulee perunasta. [Raaka seitiprofiili](https://www.matvaretabellen.no/en/saithe-raw/) ilmoittaa saatavilla olevan hiilihydraatin arvoksi 0 g/100 g. Kun Fineli-osuuteen lisätään maidon, levitteen ja juuston pakkausmerkintöjen hiilihydraatit (4,8 / 4,0 / 0,1 g/100 g), summa on 39,46 g/annos. Tämä on lähdelukujen seulontasumma: valmistajien levite- ja juustokortit eivät erittele kuitua tai polyoleja, joten summa ei ole hyväksytty netto- tai kokonaishiilihydraattiarvo. [NHS:n vertailureseptin](https://www.nhs.uk/healthier-families/recipes/fabulous-fish-pie/) valmiita ravintoarvoja ei siirretty sovitukseen.

**GK-ehdotus: `unavailable`.** Uunissa kypsennetyn kalapiirakan kuorrute tehdään keitetystä ja maidon kanssa muussatusta perunasta. Lajiketta ei ole määritelty. Hätösen ym. tutkimuksen perunamuusi ja muusia sisältänyt ateria erosivat glukoosivasteeltaan. Tutkittu ateria sisälsi kanaa, öljyä ja salaattia. Nicola-perunaa koskevassa tutkimuksessa käsittely ja jäähdytys vaikuttivat GI-tuloksiin. Kummankaan mittausasetelma ei vastaa tätä seititäytteistä reseptiä. Numeeriselle GK:lle tai GK-luokalle ei löydetty sopivaa sidontaa. [Hätönen ym.](https://doi.org/10.1017/S0007114511000080) · [Nicola-perunan käsittelytutkimus](https://www.sciencedirect.com/science/article/pii/S088915750500147X)

**Julkaisupäätös: HOLD.** Ravintoarvio tarvitsee tuotteiden vastaavuuden vahvistuksen, tarvittavat koostumustiedot sekä riippumattoman katselmoinnin. GK-ehdotus tarvitsee oman dokumentoidun arvionsa. Ehdotusta ei ole kirjattu julkaisuhyväksynnäksi.

## J05-16 Katkarapu-avokadosalaatti

- Reseptin 200 g valutettua käyttövalmista katkarapua on 50 g annosta kohti. Fineli 32202 (keitetty suolaton, resepti) antaa 8,02 g proteiinia tästä osuudesta. AFCD F007423 (ostettu kypsä mustatiikerirapu) antaa 10,10 g ja F007421 (ostettu kypsä banaanirapu) 11,60 g. Erot tukevat lajin ja valmisteen varmistamista ennen laskentalähteen valintaa.
- AFCD F008749 vastaa raakaa babypinaattia. Reseptin 140 g / 4 annosta antaa 0,98 g proteiinia ja 0,875 g kuitua annosta kohti kyseisestä rivistä.
- Reseptin avokado on nyt 240 g syötävää hedelmälihaa. Fineli 11057 antaa keskikokoiselle kuoritulle ja kivettömälle avokadolle 120 g. Reseptin 240 g on toimituksellinen, punnittava määrä alkuperäisen kahden avokadon pohjalta. Lähdeprofiililla avokadorivi antaa 1,58 g proteiinia ja 11,64 g rasvaa annosta kohti. [Good Foodin resepti](https://www.bbcgoodfood.com/recipes/spinach-avocado-prawn-salad)
- Kastike jaetaan neljälle. Yksi 15 ml:n ruokalusikallinen Kikkomanin paahdettua seesamiöljyä antaisi 3,45 g rasvaa annosta kohti. Vastaava määrä valmistajan tavallista soijakastiketta antaisi 0,375 g proteiinia annosta kohti. Valmistaja ilmoittaa arvot 100 ml:aa kohti, joten tiheysmuunnosta ei tarvita. Nämä ovat tuote-ehdokkaita. [Seesamiöljy](https://www.kikkoman.eu/products/detail/kikkoman-toasted-sesame-oil) · [Soijakastike](https://www.kikkoman.eu/about-kikkoman/kikkoman-quality/features-of-our-soy-sauce)
- Kotimaisen toimittajan kypsän ja kuoritun `Pandalus borealis` -tuotteen kortti ilmoittaa 15 g proteiinia ja 0,7 g rasvaa 100 grammassa. Kortti ei yksilöi ravintoarvojen yhteydessä valutettua painoperustetta. Tuotteen laji, käyttövalmius ja ravintoarvon painoperuste pitää vielä vahvistaa lopullisesta pakkauksesta tai täsmälähteestä. Myös limen, chilin ja valkosipulin syötävät panokset jäävät avoimiksi koko annoksen laskentaa varten. [PNM-Chipstersin tuotekortti](https://www.pnmchipsters.fi/foodservice/tuotteet/ayriaiset-madit/msc-katkarapu-kuorittu-350-500)

Molemmat reseptit ovat neljällä kielellä luonnoksia ja julkaistavat ravintokentät ovat tyhjiä. Numerot ovat katselmoinnin lähtöaineistoa. Vertaa [aiempaan J05-pidätyspäätöksen valmisteluun](https://github.com/ozirix-dev/Reseptit/pull/1011#issuecomment-7207332481).
