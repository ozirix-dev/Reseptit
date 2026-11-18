# Seitsemän avoimen annoshiilihydraattitiedon lähdetarkistus

Erä kattaa seitsemän niistä 14 alkuperäisreseptistä, joilta #706:n
annosaineistossa puuttuu koko annoksen hiilihydraattiarvio. Tarkistetuilla
suomenkielisillä tuotantoreiteillä oli HTTP 200 ja sama kanoninen reitti.
Kaikki seitsemän julkaistua reseptitiedostoa täsmäävät tavutasolla
vertailtujen revisioiden välillä. Annosjaot, tiedostojen tarkisteet ja
kahden laskentatoiston syötteet ovat [lähdeaineistossa](2026-11-18-gk-annoslahteet-syote.json).
[Main-revisio](https://github.com/ozirix-dev/Reseptit/commit/e8ed43ed525a9cb6abbe61b94bc1c036153979c7) ·
[#706:n tarkistettu revisio](https://github.com/ozirix-dev/Reseptit/commit/cc85ff7abad6f253158b658d22dfbe27b1bf42bf)

## Pasta- ja riisiannokset

| Alkuperäinen resepti | Käyttökelpoinen lähtötieto | Mitä koko annoksen arvio vielä tarvitsee |
| --- | --- | --- |
| [Punajuuririsotto](https://www.recipavo.com/punajuuririsotto/) | 4 dl kuivaa risottoriisiä viiteen annokseen eli 0,8 dl annosta kohti. Finelin kypsän punajuuren luku koskee kuorittua syötävää osaa. | Kuivan risottoriisin punnitus ja sitä vastaava koostumus, keitetyn ja kuoritun punajuuren syötävä paino sekä kasvisfondin tuotetieto. Puuro-riisin tiheys ei varmista risottoriisin massaa. |
| [Marry Me -kanapasta](https://www.recipavo.com/marry-me-kanapasta/) | 60 g kuivaa De Cecco Spaghetti n°12 -pastaa annosta kohti. Aiemmat 69 ja 72 g/100 g:n pakkausarvot vastaavat 41,4 ja 43,2 g kuivasta pastasta laskettua pakkaushiilihydraattia. | Käytetty markkinapakkaus, keitetyn ja valutetun pastan syötävä massa ja vastaava koostumus sekä Royal-tomaatin hiilihydraatin painoperuste. |
| [Sitruuna-parsapasta](https://www.recipavo.com/sitruuna-parsapasta/) | 250 g tuorepastaa kolmeen annokseen eli noin 83 g annosta kohti ennen keittämistä. AFCD:n parmesaani- ja mustapippuritietueet ovat jo käytössä toisessa pastalaskelmassa. | Pastan tuotetyyppi sekä pastan ja parsan kypsä, valutettu massa ja vastaavat koostumuslähteet. Sitruunankuoriraasteen tilavuus ei osoita massaa. |
| [Linssimakaronilaatikko](https://www.recipavo.com/linssimakaronilaatikko/) | Noin 37 g kuivaa makaronia ja 25 g kuivia linssejä annosta kohti. | Erikseen keitettyjen ja valutettujen makaronien ja linssien syötävä saanto sekä valmistusta vastaava koostumus tai osoitettu hiilihydraatin säilyminen. Aiempi summa 40,23 g on ennen keittämistä laskettu ainesarvio. |
| [Uunifetapasta](https://www.recipavo.com/uunifetapasta-kirsikkatomaateilla/) | 60 g kuivaa penneä ja 112,5 g raakaa kirsikkatomaattia annosta vastaavassa lähtöainesosuudessa. AFCD F009190:n perusteella tomaatin ainesosuus vastaa noin 3,9 g imeytyvää hiilihydraattia ennen paahtamista. | Kypsän ja valutetun pennen saanto ja koostumus sekä tieto siitä, kuvaako fetan pakkausarvo valutettua juustoa. Aiempi summa 47,39 g sisältää kuivasta pastasta lasketun osuuden. |

Kypsä paino ratkaisee massaperusteen. Se ei yksin osoita, paljonko
hiilihydraattia jäi ruokaan keitinveden valutuksen jälkeen. Aiemmat
laskelmat ja todetut puutteet käytettiin sellaisinaan, kun näyttö ei ollut
muuttunut. AFCD F005172 on sitruunan koko kuorta kuvaava vertailutietue.
Aineisto huomauttaa sen koostumustietojen rajoista. Raasteelle jää
punnitus ja soveltuvuuden arvio. Punajuuririsoton nykyinen syöte jättää
myös timjamin, sitruunanmehun ja parmesaanin koostumuksen avoimeksi.
[Punajuuririsoton laskentasyöte](../calculations/punajuuririsotto.json) ·
[Fineli 30382](https://fineli.fi/fineli/fi/elintarvikkeet/30382) ·
[AFCD:n tietoaineisto](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files) ·
[Aiempi pastalaskelma](../calculations/parsakaali-cashewpasta.json) ·
[V10:n ainesosaerittely](../../review/suomalaiset-klassikot-v10-hiilihydraattien-erittely-2026-11-08.json)

## Suklaakaakao ja chia-puuro

Molemmat reseptit nimeävät Lindt Excellence 90 % -suklaan. Käytetyn
viitteen suomalainen GTIN on 3046920029759. Valmistajan ravintoarvotaulukossa
on 14 g hiilihydraattia ja 7 g sokereita 100 grammassa. Reseptin
suklaamäärä vastaa kaakaomukissa noin 1,05 g sokeria ja 2,10 g
pakkaushiilihydraattia. Yhden puurokulhon suklaa vastaa noin 0,53 g
sokeria ja 1,05 g pakkaushiilihydraattia. Pakkaushiilihydraatti
sisältää siihen mahdollisesti kuuluvat polyolit, ja sokerit ovat sen
osa. Lukuja ei lasketa yhteen.
[Lindt, Suomen tuote](https://www.lindt.fi/fi/lindt-excellence-dark-90-bar-100g-fi-fi-03046920029759) ·
[EU 1169/2011, liite I](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02011R1169-20250401)

| Resepti ja vakioannos | Viitetuotteiden ilmoittamista sokereista | Viitetuotteiden pakkaushiilihydraatista |
| --- | ---: | ---: |
| [Rasvakaakao](https://www.recipavo.com/rasvakaakao-rouva-keto/), yksi muki | noin 2,1 g | noin 4,4 g |
| [Lämmin suklaa-chia-puuro](https://www.recipavo.com/lammin-chia-puuro-rouva-keto/), puolet kattilallisesta | noin 1,0 g | noin 1,6 g |

Vertailu käyttää tarkkoja viitetuotteita ja reseptien punnittuja
ainesmääriä. Kerma, voi, kaakaojauhe ja chia voivat olla kotona eri
tuotteita. Vesi ja suola ovat koostumuslähteen nollarivejä.
Pakkausarvot ovat ilmoitettuja keskiarvoja, joten vertailun luvut
eivät kuvaa mitattua vaihtelua. Reseptin ravintomalli jätti
molemmissa laskelmissa imeytyvän hiilihydraatin, nettohiilihydraatin
ja kokonaishiilihydraatin avoimiksi. Laskentatoistossa pakkauksien
ilmoitukset käsiteltiin EU-hiilihydraattina. Vahvistamaton
polyoliarvo säilyi puuttuvana.
[Foodin kaakao](https://foodin.fi/tuote/kaakaojauhe-luomu-raaka-250g/) ·
[Foodin chia](https://foodin.fi/tuote/chia-siemen-luomu-raaka-250g/) ·
[Foodin kookosöljy](https://foodin.fi/tuote/kylmapuristettu-neitsytkookosoljy-1l/) ·
[Valio kerma 2 dl](https://www.valio.fi/tuotteet/valio-keittion-kuohukerma-laktoositon/2-dl-tolkki/) ·
[Valio suolaton voi](https://www.valio.fi/tuotteet/valio-voi-suolaamaton/)

## Päätös

Seitsemän tapausta jää lähdepuutteen vuoksi avoimeksi. Kahdelle
annokselle on tarkistettu uusi pakkausmerkintöihin sidottu vertailu.
Uusia julkaistavia koko annoksen imeytyvän hiilihydraatin arvioita
tai GK-arvioita on nolla. Pasta-annosten jatkotarkistus kannattaa
sitoa samaan keitto- ja valutuserään sekä sen käyttämien tuotteiden
lähteisiin. Suklaaresepteissä seuraava tarvittava näyttö on
katselmoitavan tuotevalinnan ja polyolien vahvistus.
