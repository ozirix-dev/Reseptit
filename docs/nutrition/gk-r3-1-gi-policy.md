# GK 2.1 R3.1 – yhtenäisen GI-hyväksynnän ehdotus

Tila: **REVIEW FIXUP – DRAFT ONLY / POLICY PROPOSAL**. Päivä 2026-10-30.
Ehdotusta ei ole aktivoitu. Se koskee uusia ja kaikkia nykyisiä 83 LOW-arvioita
samoin ehdoin. Vanha julkaisu ei itsessään ole hyväksyntä eikä poistoperuste.
Taustana on [käyttäjätarkoituksen aiempi ehdotus](glycemic-user-purpose-policy-v2.md).

## Päätösjärjestys ja näyttö

1. Varmista täydellinen resepti, annosmäärä, syötävät massat, imeytyvä CHO,
   valmistus ja lähteiden yksiköt. Tuntematon massa tai CHO ei ole nolla.
2. Tarkista jokainen GI-sidos alla olevassa järjestyksessä. Tallenna alkuperäinen
   lähde, taulukko/rivi, tutkittu ruoka/tuote, valmistus, koeasetelma ja päätös.
3. Tarkista koko reseptin poisjätöt ja käyttäjälle näytettävän tiedon merkitys.
   Lähteen laatuluokka ja vastaavuus reseptiin ovat erilliset hyväksynnät.

| Sidostyyppi | Ehdotettu hyväksyntä |
| --- | --- |
| Suora mittaus | Ihmisillä tehty alkuperäistutkimus; reseptin tuotteen, olennaisen koostumuksen ja syödyn valmistusmuodon vastaavuus osoitettu. GI-asteikko, vertailuateria, koehenkilöt, saatavilla oleva CHO, menetelmä ja tuloksen sijainti tarkistettu. Lähteen rajoitukset säilyvät. |
| Valmistukseltaan vastaava analogia | Sama ruokalaji/aines ja olennainen tärkkelys- tai sokerirakenne, jauhatus, kuumennus, jäähdytys ja kypsyys vastaavat tai ero on perusteltu lähteellä. Kirjaa erot ja rajaa soveltamisala; ei automaattista raaka–kypsä-, jyvä–jauho- tai kokonainen–uute-siirtoa. Esitä LOW, kun analogia hyväksytään. |
| Ruokaryhmäkeskiarvo | Vain LOW-ehdotus: ryhmän alkuperäiset ihmis-GI-tiedot ja sisältö tarkistettu, aines kuuluu ryhmään ja valmistus on perusteltu; lisäksi jokaisen tällaisen rivin CHO on alle 1 g/annos ja näiden rivien CHO + kaikki tunnetut poisjätöt yhteensä alle 2 g/annos. Vaatii riippumattoman hyväksynnän. |
| Soveltumaton tai puuttuva GI | Ei numeerista GI:tä. Väärä ruokaperhe hylätään myös pienellä CHO:lla. Arvioi seuraavaksi koko reseptin estyminen, älä korvaa lähdettä mielivaltaisella keskiarvolla. |

Menetelmän ISO-vastaavuutta ei päätellä julkaisuvuodesta. SD/SEM ei kelpaa
minimi–maksimiväliksi, GI 100 ei ole yleinen yläraja eikä aterian rasva/proteiini
oikeuta keksittyyn korjauskertoimeen. Suorakaan ainesmittaus ei mittaa koko ateriaa.

Alle 1 g / alle 2 g ovat tässä toimituksellisia, katselmoitavia rajoja, eivät
kliinisiä turvallisuusrajoja tai todistettuja GK-virherajoja. Ehdotus tekee
ruokaryhmäkeskiarvoille saman kumulatiivisen varovaisuusrajan kuin poisjätöille.
Rajojen hyväksyntä on erillinen päätös; lähdeportti on pakollinen niiden lisäksi.
Jos lähteellinen yläraja on olemassa, se lasketaan mukaan kerran; tuntematon
yläraja ei muutu nollaksi. Nykyisen 83 joukon ylärajakomponentit ovat nollia.

## Koko reseptin esto ja nollan esitys

Merkittävä CHO ilman hyväksyttyä GI:tä estää koko reseptin piste-GK:n.
Tämän ehdotuksen numeerinen esto on vähintään 1 g yhdellä puuttuvalla rivillä
tai vähintään 2 g puuttuvien ja ruokaryhmäarvioiden yhteissummassa.
Tuntematon merkittävä massa/koostumus estää aina. Seulan vähintään 5 g tai
vähintään 1 g ja vähintään 25 % tunnetusta CHO:sta on priorisointisääntö,
ei lupa hyväksyä sen alapuolisia lähteettömiä sidoksia.

Lähteistetty CHO 0 ei tarvitse GI-sidosta. Väärä sidoksen metadata korjataan
jäljitettävästi, vaikka laskettu GK ei muuttuisi.

Jos GK-summa on 0 mutta CHO:ta on jätetty pois, älä näytä numeerista GK 0:aa
tai siitä johdettua matalaa GK-luokkaa. Näytä ehdotuksena ”GK ei arvioitavissa:
hiilihydraattia jäi arvioinnin ulkopuolelle”. Myös pyöristyminen nollaan
tarkastetaan ennen esitystä. Tämän aineiston yhdeksässä tapauksessa summa on
jo ennen pyöristystä nolla ja kaikki tunnettu positiivinen CHO on pois jätetty.
Koko annoksen CHO voidaan esittää vain, jos se läpäisee oman kokonaislaskennan
porttinsa; GK-mallin osasummaa ei nimetä koko hiilihydraattimääräksi.

## Mitattu vaikutusherkkyys ennen toteutusta

Lähtö: 83 laskettavaa, 243 nykyisillä ehdoilla estynyttä, yhteensä 326.
[Toistettava aineisto](gk-r3-1-targeted-screen.json) ja
[lukevan tarkistimen lähde](tools/gk_r3_1_review.mts) käyttävät nykyistä mallia
ja vain muistissa tehtyjä syötekopioita. Aktiivisia sidoksia ei muutettu.

| Koe / portti | Jäljelle nykyisistä 83:sta | Merkitys |
| --- | ---: | --- |
| Nykyinen lähtötilanne | 83 | Ei uusi lähdehyväksyntä |
| Vain kolme todettua väärän ruokaperheen sidosta pois | 83 | Pippurin GK muuttuu muistissa; kahden öljyn ei |
| Merkittävät ruokaryhmäsidokset pois | 26 | 57 estyy nykyisen mallin mukaan |
| Kaikki numeerisesti käytetyt ruokaryhmäsidokset pois | 21 | 62 estyy nykyisen mallin mukaan |
| Ehdotuksen määrärajat, ennen nollan esitysporttia | 21 | Vasta määrällinen kelpoisuus |
| Määrärajat ja positiivisen poisjätön GK 0 -esto | 12 | Mekaaninen yläraja, ei hyväksytyn kattavuuden ennuste |

12 on vain nykyisten 83 arvojen määrällinen/esityksellinen enimmäisjoukko
tässä ehdotuksessa. Lähde- ja valmistusportit voivat vähentää sitä edelleen.
Uusi parempi lähde voisi myöhemmin palauttaa kelpoisuuden; sitä ei oleteta.
243 estyneeseen ei tehty uutta hyväksyntäarviota. Mekaanista 12/326-lukua ei
pidä julkaista lähdehyväksyttynä kattavuutena.

## Nykyiset LOW-arviot ja toteutusportti R5:lle

R2:n 20 lähteeseen/ruokamuotoon sopimatonta sidosta eivät muutu kelvollisiksi
sillä perusteella, että nykyinen malli sallii muita ryhmäkeskiarvoja. Nykyinen
malli tarkistaa nimeä ja luokitusta väljemmin kuin R2:n lähdekatselmointi;
pippurin ”pepper”-osuma näyttää tämän konkreettisesti. Ratkaisu on yksi
näyttöperusteinen sääntö molemmille joukoille.

R5:n ensimmäinen erillinen päätös käsittelee kolme todettua perhevirhettä
ja yhdeksän GK 0 -tapausta. Seuraava pieni erä käy läpi suurimmat
epävarmat CHO-vaikutukset ja yhdeksän valmistusmuodon jatkohavaintoa.
Älä toteuta 68 reseptin yhteispoistoa tai hyväksyntää pelkän lipun perusteella.

Jokaisen tulevan päätöksen tietueeseen kuuluvat resepti/aines, vanha sidos,
alkuperäislähteen pysyvä tunniste ja tarkka kohta, ruoka-/valmistusvastaavuus,
CHO/annos, uusi päätös perusteluineen, katselmoija, lähde-/reseptiversiot,
ennen/jälkeen GK ja poisjätöt sekä käyttäjälle näytettävä tila.
Lähteen tai valmistuksen muutos vanhentaa hyväksynnän.

Aktivointi vaatii riippumattoman politiikkapäätöksen, reseptikohtaiset lähdepäätökset,
regressiot nollan esitykselle, raja-arvoille ja pippuri/öljy-erolle, kattavuusraportin,
FI/EN/SV/TH-esityksen tarkistuksen sekä täsmällisen HEADin CI:n.
R3.1 ei muuta tuotannon mallia, käyttöliittymää tai sidoksia.
