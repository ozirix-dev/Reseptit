# Glykeemisen kuorman laadunvarmistus, 25.10.2026

## Rajaus ja yhteenveto

Tarkistus kattaa kaikki 325 julkaistua reseptiä lähde-SHA:ssa
`3e410436a82df391075f7a762c23f011624a8ca6`. GK-syötteet ja reseptiversiot
sidotaan edellisen GL-katselmuksen commitin `b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5`
mukaan. Ainesosa- tai valmistusrakenne oli muuttunut 72 reseptissä; yksikään
GK-laskentasyöte ei ollut muuttunut katselmuksen jälkeen.

| Mittari | Ennen | Nyt |
| --- | ---: | ---: |
| Tarkistetut reseptit | 325 | 325 |
| Lasketut kokonaisarviot | 190 | 112 |
| Keskeneräiset tai julkaisusta estetyt | 135 | 213 |
| Reseptirakenne muuttunut viime katselmuksen jälkeen | ei sidosta | 72 |
| Aiemmin lasketut, nyt estetty | — | 78 |
| Reseptin rakenne- tai GK-syötemismatchit | ei sidontaa | 72 / 0 |

Koneellisesti luettava 325-rivinen ennen/jälkeen-vertailu on tiedostossa
[`glycemic-load-before-after-2026-10-25.json`](glycemic-load-before-after-2026-10-25.json),
ja yhteenvetoraportti on tiedostossa
[`glycemic-load-quality-audit-2026-10-25.json`](glycemic-load-quality-audit-2026-10-25.json).

## Merkitykselliset muutokset

112 reseptin uusi laskettu luku voidaan näyttää nykyisillä syötteillä ja
lähdepolitiikalla. Näistä 65 arvoa poikkeaa edellisestä tuloksesta; 47 säilyi
samoina. Kahdeksan aiempaa nollaa muuttui positiiviseksi, kun pienet
hiilihydraattiosuudet huomioidaan kumulatiivisesti. Yksi muutos oli vähintään
1 GK-yksikkö annosta kohti: kanakeitto pinaatilla ja sitruunalla muuttui arvosta
1,00 arvoon 2,31. Toimituksellisella tarkistusrajalla selvästi tulkintaan
vaikuttavia muutoksia oli 9: nollasta positiiviseksi muuttuneet kahdeksan sekä
yksi vähintään yhden yksikön muutos. Yhden yksikön raja on vain auditoinnin
vertailusääntö, ei kliininen kynnys.

78 aiempaa kokonaisarviota estetään. Niistä 21 kuuluu niihin resepteihin, joiden
rakenne on muuttunut edellisen GL-katselmuksen jälkeen. Keskeiset esimerkit ovat
Ketoprak, manakish, lohi-onigiri, soijamaito-aamiainen ja paella valenciana.
Vanha GK-syöte ei voi jäädä julkaistuksi, vaikka se laskettaisiin uudelleen
nykyisestä reseptistä: laskentasyöte ja kaikki vastaavuudet pitää tarkistaa.
Muut kuusi aiempaa arviota estyvät uuden kumulatiivisen rajan tai olennaisen
lähde-/määräpuutteen takia.

## Pienet hiilihydraattiosuudet ja nollat

Edellisessä mallissa 87 reseptin pois jätetty hiilihydraattimäärä oli vähintään
1 g/annos, 17 reseptissä vähintään 2 g/annos ja suurin määrä oli 3,5968 g/annos.
21 aiemmasta nollatuloksesta 18:ssa pois jätetty summa oli vähintään 1 g/annos.
Tacokulho naudalla ja avokadolla oli aiemmin 0,00, vaikka pois jätetty osuus oli
2,95775 g/annos.

Alle 1 g:n osuudet summataan nyt reseptikohtaisesti. Jos yksittäiseltä
alle 1 g/annos osuudelta puuttuu GI-osuma, sen voi jättää pois vain, kun kaikkien
tällaisten pois jätettävien osuuksien summa jää alle 1 g/annos. Raja on
toimituksellinen toleranssi ymmärrettävien arvioiden säilyttämiseksi, ei kliininen
virheraja. Tuntematon määrä estää laskennan eikä kuulu toleranssiin. Nykyisistä
112 arviosta 93 sisältää dokumentoidun pienosuuksien poissulun; suurin on
0,99075 g/annos. Kolmen tällaisen laskelman sisäinen summa pyöristyy nollaan.
Niitä ei esitetä tarkkana nollana: käyttöliittymä näyttää noin-arvion ja kertoo
pois jätetyn hiilihydraattimäärän.

## Lähteiden laatu ja vastaavuudet

Julkisen arvion lähdepolitiikka erottaa tutkimuksen laadun ja ruoka-aineen
vastaavuuden. Suora julkaistu `STRONG`-osuma vaatii ruoka- ja valmistustavan
avainten täsmäämisen. Julkaistua analogiaa voidaan käyttää, kun vastaavuuden
peruste ja valmistustapa on dokumentoitu; se pakottaa luottamustason matalaksi.
Elintarvikeryhmän keskiarvo säilyy yleisenä matalan luottamuksen arviona, eikä sitä
nimitetä yksittäisen ruoan mitatuksi GI-arvoksi. Puuttuva lähde tai merkittävä
ruoka-/valmistustaparistiriita estää kokonaisarvion.

GK-inputissa olevien ainesosarivien GI-mäppäykset: 10 suoraa, 139 analogiaa,
687 ryhmäkeskiarvoa ja 1 570 ilman GI-tietuetta. Vähintään yksi analogia esiintyy
104 reseptissä ja ryhmäkeskiarvo 283 reseptissä. Nämä ovat syötteiden
mäppäysmääriä, eivät tutkimusten tai reseptien hyväksyntämääriä.

## Versionvarmistus, testit ja tila

GK-tulos sidotaan reseptitunnisteeseen, annosmäärään, järjestettyyn
ainesosaluetteloon nimi-/määrä-/yksikkö-/huomiotietoineen, valmistustapaan,
valmistusohjeeseen sekä muistiinpanoihin. Toinen fingerprint sitoo Fineli- ja
GI-tunnisteet, annosmuunnokset, lähdeperustelut ja oletukset. Jokainen audit ja
build vertaa molempia sidoksia. Lähdenäytöllä dokumentoitu nimialias on sallittu
[`glycemic-load-recipe-aliases.json`](glycemic-load-recipe-aliases.json)-tiedoston
kautta; ilman näyttöä tehty muutos estää tuloksen.

Automaattiset testit osoittavat annos-, määrä-, yksikkö-, kuiva/kypsä-, GI-
ja ruokatietuemuutosten eston, toistetun pienten hiilihydraattiosuuksien summan,
aliasin dokumentoidulla näytöllä, matalan luottamuksen analogiat sekä nollan ja
puuttuvan tiedon eron. Neljän kieliversion reseptisivu näyttää GK:n noin-arviona,
luottamustason, pienosuuksien poissulun ja menetelmälinkin.

Tarkistus ei muuttanut reseptitekstejä, tavallisen ravintoarvolaskennan
toteutusta tai Nutritics PR #100:aa. Testit/buildi ajetaan tämän haaran
CI:ssä; tämä raportti kuvaa katselmointiin avattavaa Draft PR:ää eikä
tuotantojulkaisua.
