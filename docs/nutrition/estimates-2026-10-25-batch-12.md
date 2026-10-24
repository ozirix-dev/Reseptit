# Ravintoarvioiden erä 12 — 25.10.2026

Erässä on 20 auditissa puuttuvaksi luokiteltua julkaistua reseptiä. Jokaisesta
on laskentasyöte tiedostossa `calculations/<recipe_id>.json` ja lähdemäppäys
manifestissa `batches/batch-12.json`. Yhteinen TypeScript-laskentamalli laskee
arvot annosta kohti; julkaistut arvot synkronoitiin saatavilla oleviin
englannin-, ruotsin- ja thaikäännöksiin.

## Laskenta ja laadunvarmistus

Kaikki annokset laskettiin uudelleen reseptin ilmoitetusta annosmäärästä.
Fineli Release 20:n CHO 2034 on imeytyvä hiilihydraatti, FIBT 2168 kuitu ja
POLYL 2260 polyolit. AFCD Release 3:n imeytyvä hiilihydraatti saatiin
paritetuista arvoista, joissa sokerialkoholit ovat mukana ja ilman niitä.
Nettohiilihydraatti vähentää polyolit vain, kun lähde nimenomaisesti sisältää
ne hiilihydraattiarvossaan; kokonaishiilihydraatti on imeytyvä hiilihydraatti,
kuitu ja lähteistetyt polyolit. Puuttuvia arvoja ei täytetty nollalla.
Pyöristys tehtiin vasta annosjaon jälkeen kahteen desimaaliin.

Valitut tuotteet ja raakapainot ovat laskentasyötteissä. Reseptiteksti
täsmennettiin, kun aiempi nimi ei yksilöinyt laskennassa tarvittavaa tuotetta:
yleinen kypsä broileri täsmennettiin kypsäksi rintafileeksi, tacokulhon
jogurtti tavalliseksi 3,9 % jogurtiksi, yakitorin tamari soijakastikkeeksi,
uunimakkaran juusto cheddariksi ja kolmen valkokalareseptin kala pakastetuksi
seitiksi. Janssoninkiusauksen anjovis määritettiin ensin öljystä valutetuiksi
fileiksi, mutta tämä olisi ristiriidassa reseptin makean mausteliemen ja
valmistusohjeen kanssa. Janssoninkiusaus vaihdettiin erässä seuraavaan
laskettavaan reseptiin, kanapyöryköihin tomaatti-kermakastikkeessa. Janssonin
alkuperäinen sivusisältö ja arvot jätettiin ennalleen. Ropa viejan vaihtoehdoista
laskenta käyttää reseptissä mainittua naudanpaistia.
Karjalanpaistin ja muiden luullisten lihavaihtoehtojen luu-/syötävä osuus ei
ollut tulkinnanvarainen valittujen reseptien osalta.

Kaksi Fineli-tietuetta ei sisältänyt kaikkia laskentaan pakollisia tietoja:
katkaravulta puuttui polyolitieto ja valkosipulilta kuitu. Ne korvattiin
lisensoiduilla AFCD:n analysoiduilla tietueilla, joissa paritetut
hiilihydraattiarvot osoittavat polyolien määrän. Kuivattu timjami,
punajuuriliemi, valkosipulijauhe ja pieniä määriä mausteita tai koristeyrttejä
rajattiin joissakin resepteissä pois eräkohtaisilla laskentasyötteeseen
kirjatuilla ylärajoilla. Rajaukset yhteenlaskettuna pysyvät alle 10 kcal:n ja
1 g:n kunkin hiilihydraatti-, proteiini- ja rasva-arvon osalta annosta kohti.
Vesi ja suola eivät lisää näitä neljää ravintoarvoa.

Fineli Release 20 on THL:n aineisto, CC BY 4.0; THL ja Fineli nimetään eikä
lukuja esitetä THL:n hyväksyminä. Käytetyt Fineli-ID:t: 3, 28, 29, 31, 100,
28930,
303, 311, 320, 322, 330, 335, 337, 339, 352, 354, 369, 370, 386, 387, 398,
500, 536, 541, 620, 628, 631, 689, 698, 718, 719, 7530, 7600, 7607, 779,
826, 858, 929, 11048, 11057, 11557, 11565, 29207, 29239, 30346, 3323,
33207, 34159, 34972, 30792.

FSANZ Australian Food Composition Database Release 3 on CC BY-SA 3.0 Australia
-lisenssillä ja sen Australian dataa koskevat käyttöehdot säilyvät.
Laskennassa käytetyt AFCD-ID:t: F000155, F000678, F001010, F002258, F002479,
F002893, F002963, F002991, F003190, F003192, F003269, F003327, F003986,
F004193, F004213, F005198, F005700, F005701, F006118, F006187, F006250,
F006281, F006316, F006933, F007433, F007682, F008214, F009081, F009190,
F009335. Tietuetunnisteet, ravintoarvot, lähde- ja lisenssimerkinnät ovat
reseptikohtaisissa JSON-syötteissä.

## Erän sisältö ja arvot annosta kohti

| Resepti | Nettohiilihydraatit (g) | Kokonaishiilihydraatit (g) | Proteiini (g) | Rasva (g) |
| --- | ---: | ---: | ---: | ---: |
| kana-enchilada-kukkakaalivuoka | 8.13 | 11.64 | 46.66 | 29.27 |
| kanasalaatti-pesto-mozzarella | 1.88 | 4.36 | 32.00 | 24.19 |
| yangzhou-paistettu-riisi | 40.97 | 43.14 | 21.91 | 11.19 |
| tacokulho-nauta-avokado | 2.71 | 5.28 | 31.27 | 26.41 |
| silakkapihvit-tilli-kermakastike | 3.82 | 4.76 | 21.27 | 30.04 |
| sitruuna-yrttikana-parsa | 1.78 | 4.33 | 36.34 | 16.09 |
| karjalanpaisti-vhh | 6.60 | 9.13 | 28.79 | 9.07 |
| lindstrominpihvit-kaalilla | 9.54 | 12.77 | 31.90 | 18.32 |
| lanttulaatikko-kermainen | 16.68 | 20.33 | 4.75 | 24.83 |
| uunimakkara-sipulipedilla | 12.02 | 12.70 | 19.58 | 38.50 |
| paprikainen-vhh-gulassi | 8.72 | 11.29 | 40.59 | 24.04 |
| nakkikeitto-kukkakaalilla | 11.55 | 15.22 | 13.94 | 17.52 |
| nakkikastike-kukkakaalimuusi | 7.88 | 10.96 | 15.69 | 45.87 |
| amritsari-kala | 10.74 | 16.33 | 32.17 | 10.81 |
| kantonilainen-hoyrytetty-kala | 3.13 | 4.58 | 31.99 | 9.04 |
| hyderabadi-kanabiryani | 60.47 | 62.73 | 37.41 | 20.64 |
| kana-yakitori-kaalilla | 9.16 | 12.35 | 27.52 | 6.23 |
| ropa-vieja | 7.67 | 9.77 | 34.06 | 6.77 |
| kerala-kalacurry | 5.54 | 6.67 | 28.28 | 22.70 |
| kanapyorykat-tomaattikastike | 4.94 | 5.61 | 29.44 | 21.23 |

## Erän auditointi ja prosessimuutos

Lähtöauditissa oli 40 `ESTIMATE WITH EVIDENCE`, 86 vanhaa arviota ilman
toistettavaa lähdenäyttöä ja 199 puuttuvaa reseptiä. Erän jälkeen
tiukka uudelleenlaskenta hyväksyy 60 evidenssillä tuettua arviota; 86 vanhaa
arviota säilyvät selvitystilassa ja puuttuvia reseptejä on 179.

Erän aikana havaittiin lähdetietueiden pakollisten kenttien puutteet ennen
julkaisua. Jatkossa uudessa erässä lähdetietue tarkistetaan ensin polyolien,
kuidun, proteiinin ja rasvan osalta; puutteellinen tietue vaihdetaan
ensisijaisesti lisensoituun lähteeseen, jossa saatavilla oleva hiilihydraatti
on todennettavissa paritetuilla arvoilla. Suurten erien laskenta pysyy yhden
yhteisen mallin, manifestin ja tiukan auditin varassa. Luvut ovat käytännön
reseptiarvioita, eivät laboratorioanalyysejä.
