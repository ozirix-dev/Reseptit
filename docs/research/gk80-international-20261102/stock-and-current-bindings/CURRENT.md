# Codex1: liemilähde ja kaksi täydellistä tutkimusversiota

2.11.2026. Ajo alkoi mainista `061f8170a7bc31244ce787c13e80d3d757f0c859`,156/326.
Toinen julkaisuajo yhdisti PR183:n työn aikana. Nykyinen julkaistu main on
`92dc6dbe7b27e145d6938026c73b6823f2e2108f`: **172/326 reseptillä numeerinen GK
vähintään yhdelle versiolle (166 A +6 B), tavoite261, puuttuu89**.
Alkuperäisten ohjeiden numeerinen kattavuus on edelleen156.
Tämän tutkimusjakson oma tulos on yksi
lähteiltään dokumentoitu nykyreseptiehdokas ja yksi lisäehdollinen tuoteversio.
Tämän paketin hyväksyttyjä uusia0, julkaistuja0. Ei uutta yleistä GI-arvoa tai menetelmämuutosta.

[Julkaisuvarmennus](production-revalidation.json) sisältää tuotantosivulta
itsenäisesti poimitut172 numeerista ID:tä,16 version tunnisteet, main-/deploy-SHA:n
sekä ydintiedostojen täsmällisen Git-sisältövertailun. Laskentamalli, koostumus-
ja GI-lähteet sekä alkuperäiset reseptit ovat ennallaan; uutta laajaa buildia ei tarvittu.
GK-sivun yksityiskohtaisesta listasta puuttuu yksi HOLD-resepti, maksalaatikko;
tämä ei muuta172 numeerisen ID:n laskua eikä326:n lähdereseptin nimittäjää.

| Oma täysi versio | Rivejä | GK/annos | Poisjätetty CHO tai sen yläraja/annos | Portti |
| --- | ---: | ---: | ---: | --- |
| Kongjuk, nykyinen vesiresepti |6/6|29,0915|0,045g|Koko version sovellusarvio; nykyiset LOW-kategoriat säilyvät. |
| Paella, nimetty Knorr-liemi, kana, ei valinnaista rosmariinia |10/10|40,01949|1,52625g ylärajoina|Tuote-/yläraja- ja mittavastineiden arvio vielä erikseen. |

Molempien luottamus on LOW. Luvut ovat ainesosamallin tuloksia, eivät mitattuja
ateriavasteita. Puuttuvaa GI:tä ei asetettu nollaksi. Yhden ainesosan poisjättö
pysyy alle1g ja reseptin summa alle2g; yhtäsuuruus ei kelpaa.

## Liemilähde: annostelu ratkaisee

[Unileverin Knorr Professional F73781](https://www.unileverfoodsolutions.fi/tuotteet/knorr-kanaliemi-vaehaesuolainen-1-1-kg-34-FI-1249840.html),
EAN8721317737794,1,1kg:n vähäsuolainen kanaliemijauhe: ilmoitettu
hiilihydraatti41g/100g kuivaa jauhetta; annostelu8g ja valmistajan valmis saanto1l.
Ilmoitetun koostumuksen saatavan CHO:n yläraja on3,28g/l eli0,82g/250ml-annos.
EU-hiilihydraattiin mahdollisesti sisältyviä polyoleja ei vähennetty tai nollattu.
Valmista litraa ei muutettu kiloksi. Tuotteelle ei annettu keittojen GI:tä tai GI50:tä.
Yläraja koskee ilmoitettua koostumusmallia; pakkausarvo ei ole mitattu biologinen
eräkohtainen maksimi. Siksi uusi nimetty sovellus on ehdollinen.

Historiallisen24 reseptin liemiryhmä tarkistettiin nykyisiä ainesrivejä vasten,
ei uutena koko repon inventaariona. Julkaisun jälkeen ryhmässä on20 reseptiä
ilman numeerista versiota; neljä on jo julkaistu erillisinä versioina.
Knorr-annososuus alittaa1g-rajan kolmessa
volyymiltaan sopivassa tapauksessa: paella, kimchi-jjigae ja sichuan-hot-pot.
**Tämä ei tarkoita kolmea kokonaista GK-avausta.** Sichuan kuuluu Codex2:n jonoon;
kimchi-jjigaessa on muita ainesesteitä. Oma täydellinen tuoteversio tehtiin vain paellasta.
700ml/2annosta tuottaa1,148g ja2l/4annosta1,64g: nämä eivät kelpaa poisjättöön.
Lientä ei laimennettu lisää rajan saavuttamiseksi. Grammoina ilmoitettua lientä,
kalakuutiota, punajuurilientä tai lihahyytelöä ei muutettu tämän tuotteen litroiksi.
[24 reseptin rajattu seulonta](broth-family24-screen.csv).

## Paellan eritellyt pienet ainesosat

Vanha kuusirivinen syöte yhdisti mausteet yhteen lähteettömään0,3g-arvioon ja
jätti öljyrivin erittelemättä. Uusi syöte vastaa kaikkia kymmentä nykyistä riviä.
Paprikajauheen mittavastine tulee AUSNUT2023:n F006316-mittatunnuksesta49463:
0,53g/ml *5ml =2,65g. Tätä yleisen kuivan paprikajauheen tiheyttä käytetään
savustetun paprikajauheen mittavastineena, ei täsmätuotteen punnituksena.
[USDA170934](https://fdc.nal.usda.gov/food-details/170934/nutrients) antaa
sahramille0,7g/tsp, joten alkuperäinen neljänneslusikka vastaa0,175g:n lähdemittaa.

Varovaiset CHO-ylärajat ovat **koko nimellinen kulutettu massa**: paprika
2,65/4=0,6625g ja sahrami0,175/4=0,04375g. Tarkkaa koostumusta ei tarvita
tähän massan sisäiseen ylärajaan, eikä tuntematonta koostumusta nollata.
Rajat riippuvat mittavastineiden hyväksyttävyydestä; ne eivät ole todistettuja
maksimaalisia lusikkamassoja. AFCD:n tavallisen paprikan ravintoarvoa tai
USDA:n sahramin kokonaishiilihydraattia ei siirretty pistearvoksi.
Liemen0,82 +paprikan0,6625 +sahramin0,04375 =1,52625g/annos.

Riisin GI67 ja kasvisten GI66 ovat aiempia laajoja kategoriavastineita.
Fineli536 on oliiviöljy; auringonkukkaöljyn540-tietuetta ei käytetty.
Kana on reseptin nykyinen700g:n nahaton, luuton reisiliha. Reseptin huomautus
sallii pelkän kanan; luettelemattomia jäniksenpaloja ei lisätty laskelmaan.
Valinnainen rosmariini jätetään nimenomaisesti pois; valitun uutosversion
tuntematonta hiilihydraattia ei väitetä nollaksi.

## Kongjuk: nykyreseptin este ei enää ole liemi

Nykyinen lähde määrittää700ml vettä ja10g seesaminsiemeniä. Vanha syöte
käyttää vettä tai mietoa lientä ja100g siemeniä. Suolojen lähteettömät
positiiviset maustearviot korvattiin puhtaan suolan natiiveilla nollatiedoilla.
Lisäsuolan punnitsematon määrä ei anna lupaa natriumin tai makrojen julkaisuun.

Koostumukset säilyttävät aiemmat Fineli391-kuivat soijapavut,11521-pitkäjyväisen
kuivan riisin ja385-kuorellisen seesamin. Pienempää hiilihydraattitietuetta ei
etsitty rajan vuoksi. Soijapapu150g/2annosta antaa7,725g CHO:ta, riisi100g/2annosta39,5g
ja seesami10g/2annosta0,045g. Nykyiset palkokasvien GI34 ja riisin GI67 antavat
29,0915:n pisteen; seesamin positiivinen osuus jää nykyiseen poisjättötoleranssiin.
Kuivien papujen lähtö-CHO säilytetään, koska liotus-/keittohävikin määrää ei tunneta.
Osittain soseutetun puuron ihmis-GI:tä ei väitetä mitatuksi.

## Vaikutus ilman reseptien kaksoislaskentaa

[ID-/versiokohtainen täsmäytys](deduplicated-roadmap.json) sisältää mainin172 ID:tä,
toisen ajon matriisin8 hyväksyttyä mutta julkaisematonta täsmäsyötettä ja omat
viisi uniikkia hyväksymätöntä tutkimusversiota. Joukot ovat erilliset.
Omat viisi ovat granola, pistaasijogurtti, kongjuk sekä lisäehdolliset
pellavapuuro ja paella. Kolme on lähteiltään dokumentoitu sovellusarvioon;
kaksi tarvitsee lisäksi tuote-/yläraja-/mittavastinepäätöksiä.

Kahdeksan myöhempi julkaisu yksin antaisi180/326. Jos myös kaikki viisi omaa versiota
myöhemmin erikseen hyväksyttäisiin ja julkaistaisiin, määrä olisi185/326 ja
tavoitteesta puuttuisi76. Tämä on **ehdollinen suunnitteluluku**, ei valmis tai
julkaistu erä. Nykyinen puute on89. Aiemmat16 siirrettiin mainin joukkoon,
ja Codex2:n uusi rahkapiirakkahyväksyntä lisäsi julkaisemattomien määrän kahdeksaan.
Chiavanukas ja muut Codex2:n lähdetukikohteet
sekä kaksi parathamenetelmän tutkimuskohdetta eivät kasvata omaa lukua.

Seuraavat viisi tointa: arvioi kongjukin kuusirivinen versio; arvioi paellan
nimetty liemi ja mittaylärajat; käsittele aiemmat kolme omaa versiota niiden
tarkoin rajatuissa paketeissa; käytä liemilähde Codex2:n omistamassa Sichuan-tapauksessa
vain muiden esteiden kanssa; ratkaise seuraavaksi kimchin/gochujangin kaltaisia
toistuvia valmistuskohtaisia lähdepuutteita ja pidä185-skenaario erillään julkaistusta.

[Yhteinen lähdekatalogi](source-catalog.json), [paellasyöte](paella-named-stock-version.json),
[kongjuksyöte](kongjuk-current-water-version.json), [mallitulos](model-results.json).
Samoja lähdetietoja ei kopioitu jokaiselle ainesriville. Nykyinen GK-malli,
erillinen Decimal-lasku, kaikkien lähderivien/yksiköiden tarkistus ja viisi
virheellisen yleistyksen estävää kontrollia onnistuivat. Ei resepti-, rekisteri-,
main- tai Codex2-tiedostojen muutoksia, ei julkaisemista tai raskasta CI:tä.
