# GK-80 kolmas julkaisupaketti –12 muuta AJO4-ehdotusta

Tila `READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW`. Main-pohja
e8da2c9417e2aeff55a85d599b3b7e1ad465f36c. Eri12 ID:tä kuin integraatio-Draftissa.
Omistajan menetelmä- ja sisältöhyväksyntä odottaa. Ei merge-/deploy-lupaa.

| Versio | Netto-CHO g | Kokonais-CHO g | Proteiini g | Rasva g | GK/annos |
|---|---:|---:|---:|---:|---:|
| Shoyu-kanakeitto konjac-nuudeleilla | 4.00 | 6.96 | 22.20 | 7.70 | 1.766975 |
| Nasi uduk – yksinkertainen kookosriisi ja muna | 39.57 | 40.52 | 12.16 | 20.98 | 26.372500 |
| Khao tom katkaravuilla | 41.20 | 42.08 | 15.01 | 3.78 | 27.687650 |
| Kookosriisi ja haudutetut pavut | 51.60 | 57.39 | 10.47 | 15.18 | 30.175200 |
| Lablabi – kikhernekeitto pitaleivällä ja kananmunalla | 33.84 | 37.70 | 16.02 | 9.82 | 19.129450 |
| Meksikolainen maissipuuro canelalla | 47.40 | 49.04 | 5.85 | 4.21 | 30.285250 |
| Jamaikalainen maissipuuro kookoksella | 44.16 | 45.80 | 4.14 | 14.88 | 29.627250 |
| Myskikurpitsa-kaurapuuro fariinisokerilla | 50.75 | 58.44 | 8.81 | 5.52 | 33.999500 |
| Kardemumma-taatelipuuro tahinilla | 38.25 | 44.79 | 12.34 | 14.63 | 24.942820 |
| Tahini-kaurapuuro appelsiinilla | 40.34 | 47.66 | 8.02 | 9.39 | 27.327250 |
| Papaijajogurtti tuoreella kookoksella | 12.14 | 15.12 | 3.75 | 6.37 | 4.380750 |
| Shakshuka kikherneillä ja yrteillä | 11.17 | 14.03 | 11.55 | 13.28 | 3.426600 |

Kaikki ovat LOW-luottamuksen pistearvioita, eivät mitattuja ateria-GI-arvoja tai
biologisia epävarmuusvälejä. GI40/30/50-koodaus, projektin5g/100g ja mausteen
0,5g/1g rajat sekä kuuman riisin, maissipuuron, kauran, pitan ja palkokasvien
analogiat odottavat yhteistä menetelmäpäätöstä. Kookos, butternut, tahini ja
kastikkeet sidotaan eksakteihin elintarvike-ID:ihin, eivät nimen osiin.

Kaikki12 nykyistä reseptiä ovat FI-only; kaikki käännösten YAML-lähteet
tarkistettiin eikä näille löytynyt vastinetta. Mallinnusmerkintä ja lyhyt
menetelmäteksti ovat FI/EN/SV/TH. Käännösten katselmointitilaa ei nosteta.

Kuvat ovat näkyvästi kuvituskuvia. Shoyun vanha vartaiskuva korvataan olemassa
olevalla kananuudelikeiton kuvituskuvalla; siinä näkyvä tavallinen nuudeli ei
kuulu konjac-version laskelmaan. Tahinipuuron viikunat/pähkinät eivät kuulu
nimettyyn appelsiiniversioon. Myös muiden kuvien ylimääräiset lisukkeet on rajattu
pois laskelmasta tekstissä. Reseptin identiteetti ja määrät perustuvat ohjeeseen.

## Neljä makroa ja hash-sidonta

publication-macros.json tarkistaa netto-CHO:n, kokonais-CHO:n, proteiinin ja
rasvan riippumattomalla Decimal ROUND_HALF_UP -laskennalla suoraan kaikista
ainesosista. Kokonais-CHO sisältää raportoidut polyolit: shoyun sienistä0,3g
polyoleja/annos, joten kokonais-CHO6,96g eikä6,66g. Papaijan kokonais-CHO15,115g
pyöristyy15,12g:ksi. GK ei muutu näistä kokonais-CHO-korjauksista.
Nasi udukin ja lablabin muna punnitaan kuorettomana raakana110g ja kypsennetään
höyryssä ilman lisärasvaa. Raaka-aineen koostumus on kypsennyksen proxy,
ei väite kuoritun keitetyn munan samasta grammapainosta.

Koko reseptitekstin, syötteen, lähteiden ja koostumuksen hashit sekä paketin
ID/version ja tarkan reseptijoukon rekisteri tarkistetaan. Historialliset testit
käyttävät täsmälleen mainista jäädytettyä12 reseptin lähde-/makro-/GK-näkymää;
alkuperäisiä baselineja ei muuteta. Uudet nykytestit tarkistavat aidon buildin,
neljä makroa ja12 tarkoituksellista GK-muutosta;314 muuta tulosobjektia pysyy
muuttumattomana. Itsenäinen ehdokasbuild95/326, tuotanto83/326.

## Integraatioriippuvuus ja varmennus

Tämä on itsenäinen main-pohjainen paketti3. Runtime-adapteri, ruokaperhesuoja,
katalogi ja käyttöliittymä ovat byte-for-byte samat kuin12 reseptin
integraatiohaarassa. Vain pakettirekisteri, sisältö ja historialliset näkymät
eroavat. Molempien haarojen yhdistäminen edellyttää rekisterien ja testinäkymien
unionia ja uuden24-reseptisen HEADin build/CI-varmennusta.107/326-yhdistelmää
ei väitetä testatuksi tässä ajossa. Tutkimus-PR-historiaa ei tuoda mukaan.

Paikallisesti koko build691 reittiä, yksikkö-/käännös-/staattiset testit sekä
Brave-tarkistus kaikille12 sivuille. Lopulliset tarkat testimäärät, HEAD ja CI
ovat AJO5:n yhteisessä ReportHub-koonnissa.

Ei mergeä, Ready-siirtymää, deployta tai automaattista AJO6:tta.
