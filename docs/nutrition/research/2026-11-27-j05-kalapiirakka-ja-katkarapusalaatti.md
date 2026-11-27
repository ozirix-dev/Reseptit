# J05-15 ja J05-16 · ravintolaskennan lähde-ehdokkaat

27.11.2026 · Kokki-Codex · [J05:n luonnokset #1011](https://github.com/ozirix-dev/Reseptit/pull/1011) · [valmistuskorjaukset #1039](https://github.com/ozirix-dev/Reseptit/pull/1039).

Rivit on sidottu valmistuskorjausten committiin `70f5cce4e5ee2f8634535d69fbf36ea455e45e6c`. Lähdeaineistot ovat THL Fineli Release 20 (repon viiteaineiston Git-blob `f68c4f3e01a45274fd192cd46a4d9cb9c37761b8`) ja FSANZ AFCD Release 3 (Git-blob `208f18a3f6804a229e65d52b55b86f0b9013c074`). [Fineli avoin data](https://fineli.fi/fineli/fi/avoin-data) · [AFCD:n aineisto](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files).

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

**Julkaisuarvojen avoimet kohdat.** Varmista rasvalevitteen ja juuston tuotevastaavuus, fileen nettopainoperuste ja laskennan katselmointi. Valmistajien levite- ja juustokorteissa ei eritellä ravintokuitua tai polyoleja. Kalapiirakan hiilihydraattiarvot ja valmistustavan GK jäävät avoimiksi. [NHS:n vertailureseptin](https://www.nhs.uk/healthier-families/recipes/fabulous-fish-pie/) valmiita ravintoarvoja ei siirretty sovitukseen.

## J05-16 Katkarapu-avokadosalaatti

- Reseptin 200 g valutettua käyttövalmista katkarapua on 50 g annosta kohti. Fineli 32202 (keitetty suolaton, resepti) antaa 8,02 g proteiinia tästä osuudesta. AFCD F007423 (ostettu kypsä mustatiikerirapu) antaa 10,10 g ja F007421 (ostettu kypsä banaanirapu) 11,60 g. Erot tukevat lajin ja valmisteen varmistamista ennen laskentalähteen valintaa.
- AFCD F008749 vastaa raakaa babypinaattia. Reseptin 140 g / 4 annosta antaa 0,98 g proteiinia ja 0,875 g kuitua annosta kohti kyseisestä rivistä.
- Fineli 11057 tarjoaa kuoritun ja kivettömän avokadon koostumuksen, myös lähdearvion keskikoon painosta (120 g syötävää hedelmälihaa/kpl). Reseptissä avokadon koko on avoin. Punnittu syötävä massa tai katselmoitu kokooletus on tarpeen koko ruoan arviolle. Valitse myös soijakastikkeen ja seesamiöljyn tuotetiedot sekä koko tarjottavan kastikkeen paino- ja jakoperuste.

Molemmat reseptit ovat neljällä kielellä luonnoksia ja julkaistavat ravintokentät ovat tyhjiä. Numerot ovat katselmoinnin lähtöaineistoa. Vertaa [aiempaan J05-pidätyspäätöksen valmisteluun](https://github.com/ozirix-dev/Reseptit/pull/1011#issuecomment-7207332481).
