# GK-80 AJO 5 – yhdistetty 12 reseptin julkaisuehdokas

Tila: `READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW`. Omistajan menetelmä- ja
sisältöhyväksyntä on avoin. Draft ei anna lupaa mergeen tai deployhin.

Tämä on main-pohjainen integraatio PR:istä #140 (283de58e144ae602bf471fe28d45cc9a81a11ede)
ja #142 (d01b7cd050dea271a562242ffac236ac860eac40).
Lähtö-main: e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Alkuperäiset PR:t ja pakettikohtaiset raportit säilyvät historiallisina lähteinä.
Tämän integraation nykyinen regressioraja on 12 muutosta ja 314 muuttumatonta
täydellistä GK-tulosobjektia: ehdokasbuild 95/326, tuotanto edelleen 83/326.

## Sisältö ja toistettavuus

Molempien pakettien kaikki 12 ID:t ovat manifestissa. Kumpikin paketti on
pakollinen. Yhteinen rekisteri sitoo paketin ID:n, version, täsmällisen
reseptijoukon ja kaikkien viiden laskentatiedoston SHA256:t. Puuttuva paketti,
resepti, toistuva ID, väärä versio tai muuttunut lähdeaineisto pysäyttää ajon.
Reseptin koko tekstin ja laskentasyötteen hashit tarkistetaan lisäksi laskennassa.
Uusi paketti lisätään rekisteriin tietueena ilman adapterin uutta erikoishaaraa.

Kaikkien 12 reseptin punnitut massat, valmistus, annokset, koostumussidokset,
neljä makroa, GI-lähteet ja Decimal-vertailut säilyvät paketeissa 1 ja 2.
Kaikki ovat nykyisin FI-only; lyhyt mallinnusmerkintä on FI/EN/SV/TH.
Käännösten katselmointitilaa ei nosteta. Historialliset testit käyttävät
mainista jäädytettyä 12 reseptin näkymää. Erilliset nykytestit tarkistavat
todellisen buildin, kaikki makrot ja jokaisen 314 muun tuloksen SHA256:n.

Chao ga ja bubur ayam ovat eri nimettyjä perusversioita. Minttupuuron minttu
syödään; vanhan siivilöidyn version GK:ta ei päätellä tästä. Nasi lemak on
yksinkertainen kookosriisi-muna-kurkkuversio ilman kuvan lisukkeita.
Seesamipuuro on riisipuuro kokonaisilla mustilla siemenillä, ei seesamitahna.

## Hyväksyttävät menetelmäehdot

Kasvis-GI40 ja eläinmaitotuote-GI30 ovat julkaistua koodausta, eivät näiden
kasvisten tai maitotuotteiden mittauksia. GI50:n rajattu sovellus ja projektin
5 g/100 g sekä maustekohtainen 0,5 g ja yhteensä 1 g CHO/annos ovat
toimituksellisia menetelmärajoja. Ne eivät ole fysiologisia virherajoja.
Riisin, riisipuuron, nuudelien, kauran ja hariran palkokasvi/pastavertailujen
valmistusanalogiat odottavat yhteistä menetelmäpäätöstä.

Nasi lemakin kaksi nimettyä riisivaihtoehtoa ovat skenaarioita. Kaikkien
arvioiden luottamus on LOW; biologisen epävarmuuden rajoja ei tunneta.
Kaikki CHO lasketaan mukaan. GK-luokka ja luottamus esitetään erikseen.
Ihmis-GI, reseptiin sovellettu analogia ja julkaistu imputointi erotetaan
lähdetiedoissa. Tulokset eivät ole mitattuja aterian verensokerivasteita.

Ei mergeä, Ready-siirtymää, tuotantodeployta tai automaattista AJO 6:tta.

## Paikallinen varmennus

Integroitu build esirenderöi 691 reittiä. 174 yksikkötestiä, 27 käännöstestiä
ja 25 staattista testiä läpäisivät tarkistuksen. Molempien pakettien Decimal
tarkistaa kaikki 12 reseptiä. Muuttuneiden 12 lähdereseptin ja 12 laskennan
sisältötarkistus läpäisi. Brave/Playwright tarkisti kaikki 12 reseptisivua,
mallinnusmerkinnän ja luottamustason ilman JavaScript-virheitä. Nasi lemakin
22–26-skenaarioalue tarkistettiin myös kuvakaappauksesta.
Täsmällisen GitHub-HEADin CI raportoidaan AJO 5:n koontiraportissa.
