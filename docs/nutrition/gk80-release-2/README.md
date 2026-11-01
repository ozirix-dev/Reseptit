# GK-80 toinen julkaisuehdokas – kahdeksan reseptiä

Tila DRAFT, OWNER_APPROVAL_REQUIRED. Main-pohja e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Tässä on vain kahdeksan aiempaa ehdotusta, niiden täsmällinen sisältö ja rajattu
laskentakoodi. Tutkimuspinon historiaa tai uusia AJO4:n26 ehdotusta ei tuoda mukaan.

| Reseptiversio | CHO g/annos | Proteiini g | Rasva g | Kuitu g | GK/annos |
|---|---:|---:|---:|---:|---:|
| Huevos a la mexicana | 3.7163 | 7.8330 | 12.0627 | 1.5475 | 1.5105 |
| Callaloo-munakas – pinaattiversio | 2.1240 | 9.3180 | 12.1382 | 2.7090 | 0.8661 |
| Yrttituorejuusto-kinkkurullat | 2.8037 | 8.1873 | 6.2676 | 0.9384 | 1.0565 |
| Kreikkalainen kanavuoka oliiveilla | 4.1495 | 34.5003 | 20.8091 | 2.0941 | 1.6598 |
| Kanapyörykät tomaatti-kermakastikkeessa | 4.9905 | 29.4488 | 21.2379 | 0.7029 | 1.9392 |
| Nasi lemak – yksinkertainen kookosriisi kananmunalla ja kurkulla | 39.7790 | 11.9235 | 19.7500 | 0.7000 | 22.3745–26.4445 |
| Kiinalaistyylinen riisipuuro mustilla seesaminsiemenillä | 46.5000 | 7.6400 | 5.2300 | 2.5150 | 34.7115 |
| Marokkolainen harira-linssi-kikhernekeitto | 33.8905 | 20.5429 | 8.2630 | 6.9862 | 11.9523 |

Kaikki ovat LOW-luottamuksen mallinnettuja arvioita. Nasi lemakiin kuuluu kaksi
nimettyä kuumaa riisivaihtoehtoa, ei SEM- tai fysiologista epävarmuusväliä.
Kookosriisi on nimenomaisesti yksinkertainen versio ilman kuvan sambalia,
anjovista tai pähkinöitä. Seesamipuuro on riisipohjainen kokonaisen siemenen
versio, ei suuren jauhetun seesamitahna-annoksen laskelma. Callaloo käyttää
pinaattia. Kuvat eivät todista täsmällisen laskentaversion koostumusta.

## Yhteinen hyväksyntäpäätös

Hyväksyttäväksi ehdotetaan kasvis40- ja eläinmaitotuote30-koodit, nimettyjen
vähä-CHO-ruokien50-sovellus, mauste/siemen50:n oma annoslaajennus, kuuman
riisin ja riisipuuron valmistusanalogiat sekä hariran keitettyjen linssien,
kikherneiden ja vehnävermisellin vertailut. Projektin5g/100g ja0,5g/1g rajat
ovat toimituksellisia menetelmäpäätöksiä, eivät tieteellisiä tarkkuusrajoja.
Kaikki syötävä CHO lasketaan mukaan; mitään ei jätetä pois pienenä osuutena.

Lähteet, soveltamisperustelut, kokonaiset punnitut versiot ja lähdehashit ovat
recipes.json-, sources.json- ja composition-sources.json-tiedostoissa.
Jokainen valmistustekstin muutos vanhentaa laskentaversion, kunnes lähde- ja
syötehash on tarkistettu. GI-asteikko on GLUCOSE_100, eikä100 ole enimmäisraja.

Omistajan menetelmä- ja sisältöhyväksyntä odottavat. Teknisesti valmis Draft ei
ole lupa julkaista. Kaikki kahdeksan lähdereseptiä ovat FI-only; käyttöliittymä
ja lyhyt menetelmäselitys ovat FI/EN/SV/TH. Ihmiskatselmointia ei väitetä.

## Tarkoitukselliset muutokset ja regressioraja

Kahdeksan aiemmin keskeneräistä GK-tulosta valmistuu ehdokasbuildissa:
83→91/326. Muut318 täydellistä GK-tulosobjektia säilyvät muuttumattomina.
Tuotanto on edelleen83/326. macro-changes.json näyttää kaikki neljä
ravintoarvoa ennen/jälkeen; muun muassa punnittu mustapippuri sulkee vanhan
maustepuutteen. Nasi lemakiin lisätään100g vettä, jolla ei ole makroja.

Vanhojen source-correction- ja ravintoarvoerien baselineja ei muuteta.
Niiden historialliset testit lukevat täsmälleen mainista talletetun kahdeksan
reseptin näkymän. Erillinen nykytesti vaatii kaikkien kahdeksan todellisten
lähdetiedostojen, laskentaevidenssin ja generoidun julkaisun neljän makron
vastaavan Decimal-tuloksia. Nykyinen326-rivin regressio sallii vain nämä8
muutosta. Historiallinen näkymä ei voi hyväksyä uutta virheellistä nykyarvoa.

## Yhteiskäyttö ensimmäisen paketin kanssa

Sama adapteri on myös PR#140:ssä. Molemmilla on ennalta nimetty ID-luettelo,
oma datahakemisto ja omat fingerprintit. Tämä main-pohjainen PR ei sisällä
ensimmäisen neljän reseptin dataa. Molempien hyväksyttyjen pakettien lopullinen
integrointi vaatii yhdistetyn12 reseptin julkaisuversion tarkistuksen; tässä
ajossa ei tehdä mergeä. Historia- ja sisältötestien integraatio on tarkistettava
silloin erikseen, vaikka laskenta-adapteri tukee molempia paketteja.

Paikallinen varmennus:166 yksikkötestiä,25 staattista testiä ja27 käännöstestiä.
Kaikki neljä makroa ja skenaariot toistetaan riippumattomalla Python Decimalilla.
Muuttuneiden8 reseptin ja8 laskentaevidenssin sisältötarkistus PASS. Brave
selaimessa tarkistettiin nasi lemak, seesamiriisipuuro, harira ja kinkkurullat.
Täsmällisen HEADin CI seurataan ennen lopullista handoffia.

Ei mergeä, Ready-siirtymää, deployta tai automaattista seuraavaa ajoa.
