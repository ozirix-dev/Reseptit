# Glykeemisen kuorman laadunvarmistus, 25.10.2026

## Rajaus ja aiempi 1 g lähtötilanne (historiallinen)

Auditointi kattaa 325 reseptiä lähdesisällön SHA:ssa
`3e410436a82df391075f7a762c23f011624a8ca6`. Viimeisin rakenteiden tarkistuksen
lähtöversio on `b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5`; resepti- ja
laskentasyötteiden fingerprintien määritelmä on versio 3.

| Reseptit | Aiemmin laskettu | Nyt laskettu | Aiemmin keskeneräinen | Nyt keskeneräinen | Muuttunut rakenne | Aiempia laskettuja estetty |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 325 | 190 | 99 | 135 | 226 | 72 | 91 |

Nykyisten 91 eston jakauma on 38 vain kumulatiivisen pienosuusrajan vuoksi,
40 vain GI-lähteen tai vastaavuuden vuoksi, 12 molemmista syistä ja yksi muun
ratkaisemattoman laskentasyötteen vuoksi. Tämä jakauma kuvaa nykyistä tilaa,
ei aiempaa 78 eston vaihetta.

Rakenteeltaan muuttuneista 72 reseptistä 21:llä oli aiempi laskettu GK. Kaikki
21 tarkistettiin: 13 palautettiin laskentaan ja kahdeksan jäi asianmukaisesti
estetyksi. Muut 51 olivat jo aiemmin keskeneräisiä ja odottavat edelleen
tarkistusta. PR #104:n 112 lasketun arvon vaiheesta 86 säilyi, 26 estyi
(4 vain toleranssin ja 22 GI-syötteen vuoksi) ja 13 rakenteen tarkistuksen
jälkeen palautui: `112 - 26 + 13 = 99`.

Koneellinen 325 reseptin ennen/jälkeen-vertailu on tiedostossa
[`glycemic-load-before-after-2026-10-25.json`](glycemic-load-before-after-2026-10-25.json).
Koneellinen lähde- ja estoraportti on tiedostossa
[`glycemic-load-quality-audit-2026-10-25.json`](glycemic-load-quality-audit-2026-10-25.json).

## Laskenta, luokitus ja käyttäjälle näkyvä pyöristys

GK lasketaan ainesosien lähteistetyistä osuuksista ja summataan ennen tuloksen
kahden desimaalin tallennuspyöristystä. Reseptisivulla arvo esitetään yhden
merkitsevän numeron tarkkuudella. Luokitus käyttää lähimpään kokonaislukuun
pyöristettyä GK:ta: kokonaisluku 0–10 on matala, 11–19 keskitasoinen ja 20 tai
suurempi korkea. Näin desimaalien väliin ei jää luokittelematonta aluetta.
Luokitus on auditoinnin kuvaustapa, ei kliininen raja.

99 yhteisen lasketun arvon vertailussa numeerisesti muuttui 52, seitsemän
siirtyi nollasta positiiviseksi ja neljä muuttui vähintään yhden GK-yksikön.
Yhden merkitsevän numeron käyttäjänäkymässä 26 arvoa muuttui. Pyöristämättömän
20-rajan ylitti yksi arvo: harcha juustolla `20,88 → 19,83`; 10-rajan ylityksiä
oli nolla. Sovitulla kokonaislukuluokituksella luokkamuutoksia oli nolla:
harchan molemmat arvot pyöristyvät luokittelussa kokonaislukuun 20 ja ovat
korkeita. Käyttäjän yhden merkitsevän numeron näkymässä molemmat näkyvät noin
20:nä.

Manakish muuttui `22,33 → 33,06` ja Ketoprak `23,89 → 26,67`; kummankin
käyttäjälle näkyvä yhden merkitsevän numeron arvo muuttuu noin 20:stä noin
30:een. Nämä ovat reseptien vertailua helpottavia muutoksia, eivät väitteitä
kliinisestä vaikutuksesta. Auditoinnin 11 toimituksellista tarkistuslippua
(seitsemän nollasta positiiviseen ja neljä vähintään yhden yksikön muutosta)
eivät ole kliininen kynnys.

## Rakenne- ja lähdefingerprintit

Reseptifingerprint sitoo reseptitunnisteen, annosmäärän, järjestetyt
ainesosatunnisteet, määrät ja yksiköt, laskentaan vaikuttavat ainesosatilat
sekä järjestetyn `cooking_method`-kentän. Vapaamuotoinen valmistusohje,
toimitukselliset huomiot ja välimerkit eivät itsessään muuta sidosta.
Laskentasyötteen fingerprint sitoo ruoka- ja GI-tunnisteet, määrät, avaimet,
numeraaliset oletukset sekä lähdenäytön olemassaolon.

Lähdefingerprint huomioi ruokatietueen tunnisteen, tilan, painoperustan,
hiilihydraattimääritelmän, normalisoidun käytettävissä olevan hiilihydraatin
ja määritelmän laskennassa käyttämät komponentit. Mukaan tulee esimerkiksi
polyolimäärä `EU_TOTAL_INCLUDING_POLYOLS`-lähteessä ja kuitu
`US_TOTAL_INCLUDING_FIBRE`-lähteessä. GI-arvo, ruoka-/valmistusavaimet ja
lähteen laatutiedot säilyvät sidonnassa. Otsikko, noutoaika, seliteteksti tai
viitteen URL-muotoilu ei muuta laskentaa. Fingerprint käyttää nykyistä
`normalizeCarbohydrate()`-toteutusta eikä muuta ravintoarvolaskentaa.

## Jiaozi ja tuoteryhmien vastaavuudet

Jiaozin 12 g riisiviinietikkaa ei enää ole mäpätty Finelin kuivaan riisiin tai
riisin GI-keskiarvoon. Etikan hiilihydraattikoostumusta ei ole lähteistetty,
joten se merkitään tuntemattomaksi eikä nollaksi. Jiaozi pysyy keskeneräisenä;
myös taikinalevyjen lähdekoostumus puuttuu. GI-mäppäyksen selvä
tuoteryhmäsuoja estää riisiviinietikan/riisin ja maitosuklaan/maidon
ristiriidat suorissa, analogisissa ja ryhmäkeskiarvo-osumissa. Muita reseptejä
ei käyty uudelleen läpi manuaalisesti.

## Pienosuudet ja avoimet lähteet

Nykyinen 1 g/annos kumulatiivinen toimituksellinen toleranssi säilyy.
Pienosuuksien yhteismäärä näytetään eikä laskentaan lisätty uutta
poikkeamajärjestelmää. Aiemmin dokumentoidut 2 g ja 3 g herkkyysskenaariot
(133 ja 138 laskettavaa aiemman herkän lähdeoletuksen pohjalta) ovat
jatkopäätöksen vaihtoehtoja, eivät tämän PR:n julkaistuja laskelmia tai
hyväksyttyjä rajoja.

Varsinaiset myöhemmät lähdetyöt ovat puuttuvien GI-arvojen ja vastaavuuksien
tarkistus, mukaan lukien paellan sopiva liemilähde sekä jianbingin soijatahnan
koostumus. Lisäksi 51 aiemmin keskeneräistä muuttunutta rakennetta odottaa
tarkistusta. Nämä eivät muuta nykyistä yhden gramman politiikkaa.

## Testit ja tila

Regressiotestit kattavat polyolien ja kuidun lähdetiivisteet, metatietojen
muutosten ohittamisen, ruoan tilan muutoksen, 11 luokitus-/pyöristysraja-arvoa,
suorat, analogiset ja ryhmäkeskiarvomäppäykset selviin tuoteryhmäristiriitoihin
sekä Jiaozi-syötteen ja tämän Markdown-yhteenvedon yhdenmukaisuuden
JSON-auditoinnin kanssa. Neljän kieliversion GK-sivun ja julkaisuesteiden
toimivuus varmennetaan projektin normaaleilla testeillä ja buildilla.

Reseptitekstejä, tavallisen ravintoarvolaskennan toteutusta tai Nutritics PR
#100:aa ei muutettu. Muutokset ovat katselmointiin avatuissa Draft PR:issä;
niitä ei ole yhdistetty eikä julkaistu tuotantoon.
### GK-toleranssin lopullinen päätös 25.10.2026

Alla oleva aiempi 1 g:n tilannekuva säilytetään historiallisena vertailuna. Uusi
hyväksytty toimituksellinen politiikka on nyt yksittäiselle GI-osumattomalle
ainesosalle alle 1 g imeytyvää hiilihydraattia annosta kohti ja kaikkien tällaisten
osuuksien summalle alle 2 g annosta kohti. Tasan 2 g estää arvion. Yksittäisraja,
tuntemattoman määrän esto, lähteistetyn GI:n vaatimus ja väärän GI-vastaavuuden esto
säilyvät. Tämä on käyttäjälähtöinen toimituksellinen toleranssi, ei mitattu kliininen
tarkkuusraja.

Uusi koko 325 reseptin laskenta tuotti 112 GK-arviota ja 213 keskeneräistä tulosta;
aiemman 1 g:n tilannekuvan 99 lasketusta 27 palautui. Samalla 14 aiemmin laskettua
arviota jäi estetyksi tai estettiin uudelleen, koska niissä oli kelpaamaton,
perusteeton GI-osuma. Nettomuutos aiempaan tilanteeseen on +13. 135 jo aiemmin
keskeneräistä reseptiä eivät palautuneet.

| Reseptit yhteensä | Aiemmin laskettu | Nyt laskettu | Aiemmin keskeneräinen | Nyt keskeneräinen | Muuttunut rakenne | Aiempia laskettuja estetty |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 325 | 190 | 112 | 135 | 213 | 72 | 78 |

Aiemmin laskettujen estojen nykyjakauma on
4 vain kumulatiivisen 2 g rajan vuoksi, 72 GI-lähteen tai vastaavuuden vuoksi,
1 molemmista syistä ja 1 muun ratkaisemattoman syötteen vuoksi.

Palautuneet reseptit (kaikki matala luottamus; pois jätetty määrä näytetään):
Munakokkeli, Munakasrulla pinaatti-tuorejuustotäytteellä, Uunimuna-avokadot,
Uunimunat pinaatilla, Mehevä VHH-lihamureke, VHH-keltainen kanacurry kukkakaalilla,
Kermainen VHH-lohikeitto kukkakaalilla, Kana-fajitapelti avokadokastikkeella,
Kermainen lohipata, Gai yang – thaimaalainen grillikana VHH-lisukkeilla,
VHH-pad kee mao – tuliset kananuudelit, VHH-yum woon sen katkaravuilla ja
konjacnuudeleilla, Kreikkalaistyylinen kurkku-oliiviaamiainen, Uuniporsas
kermaisella pannukastikkeella, Hanoilainen bún chả, Yangzhoun paistettu riisi,
Amritsari-kala maustetussa kikhernejauhokuoressa, Kana-yakitori ja seesamikaali,
Karjalanpaisti ja paahdettu kaali, Gyeranbap kananmuna-riisikulho, Banh bao
kananmunalla, Scallion-pannukakut kevätsipulilla, Teehaudutetut kananmunat,
Kashmirilainen rogan josh, Marokkolainen kana-tagine sitruunalla ja oliiveilla,
Palak paneer – pinaattia ja intialaista tuorejuustoa sekä Tandoorikana uunissa.

14 aiemmin laskettua tulosta, jotka pysyvät nyt estettyinä kelpaamattoman GI-osuman
vuoksi: Caponata, Pasta alla Norma, Chettinad-kana, Raejuusto-pesto-kasviskulho,
VHH-Runebergintortut, Keto-suklaakeksit, VHH-mokkapalat, Kai jiew VHH,
Lähi-idän kikhernejauho-yrttilettu, Malesialainen congee inkiväärillä, Kiinalainen
riisipuuro kananmunalla, Thai jok kanalla, Thai porsasjok ja Yrttituorejuusto-
kinkkurullat. Alle 1 g:n hiilihydraattimäärä ei tee väärästä GI-vastaavuudesta
kelpaavaa.

27 palautuneesta 5 arvioi GK:ksi 0, koska niiden kaikille pienille positiivisille
hiilihydraattiosuuksille ei löytynyt kelpaavaa GI:tä. Kaikki viisi ovat merkitty
matalan luottamuksen noin-arvioiksi, ja pois jätetty 1,147–1,912 g/annos näytetään.
Täysin lähteistetyistä hiilihydraattimääristä ei syntynyt nollaa: nykyisistä
lasketuista nollatuloksista kaikki 8 sisältävät näkyvän poisjätön. GI 20/50/80/120
havainnollistavissa skenaarioissa palautuneiden suurin GK-lisä olisi vastaavasti
0,394 / 0,985 / 1,576 / 2,363. Määritelty GK-luokka ei muutu missään skenaariossa;
yhden merkitsevän numeron näyttö muuttuisi 16 / 22 / 23 / 23 palautuneessa
reseptissä. Skenaariot eivät ole mitattuja GI-arvoja tai epävarmuusvälejä.

112 yhteisen lasketun arvon vertailussa 52 kahden desimaalin GK-arvoa muuttui; 6 siirtyi
nollasta positiiviseksi, 5 muuttui vähintään yhdellä GK-yksiköllä ja toimituksellisen
tarkistuslipun sai 11. Luokitusmuutoksia oli 0 ja yhden merkitsevän numeron
näyttömuutoksia 24. Suurimmat edelleen estävät lähdepuutteet ovat väärät tai
perusteettomat GI-osumat ja puuttuvat GI-lähteet. Jiaozi, Paella, Jianbing ja 51 jo
aiemmin keskeneräistä rakennepoikkeamaa pysyvät estettyinä nykyisten lähdeperusteiden
mukaisesti.

Koneellinen, 325 rivin ennen/jälkeen-auditointi on
`glycemic-load-before-after-2026-10-25.json`; numeerinen yhteenveto on
`glycemic-load-quality-audit-2026-10-25.json` ja yksityiskohtainen katselmus on
`glycemic-load-quality-audit-2026-10-25.md`.
