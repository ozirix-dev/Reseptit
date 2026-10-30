# GK 2.1 R3 – nykyisten 83 arvion automaattinen riskijärjestys

Lähtö-main `e8da2c9417e2aeff55a85d599b3b7e1ad465f36c`, 2026-10-30.
Automaattinen priorisointi; ei uusi tieteellinen hyväksyntä tai 83 syväarviota.
Nykyisiä GK-arvoja ei muutettu. Luvut ovat auditoinnin lähtötietoja.

Liput: R = ruokaryhmän keskiarvo, V = valmistuspoikkeaman signaali,
M = merkittävä CHO-lähde epävarmalla GI-vastaavuudella, P = poisjättö vähintään
1,5 g, O = poisjättö vähintään puolet tunnetusta CHO:sta, N = näkyvä GK 0 mutta
ei-nolla poisjättö. Kaikkien luottamus on LOW; sitä ei toisteta lippusarakkeessa.
Pisteet ovat toimituksellinen järjestys, eivät kliininen riskiasteikko.
Pistepainot: R 8, V 8, M 10, P 5, O 4, N 4, LOW 2. Tasapisteet järjestetään
epävarmaan GI:hin sidotun CHO:n, poisjättömäärän ja tunnisteen mukaan.
Valmistuslippu voi olla väärä positiivinen; puuttuva lippu ei varmista vastaavuutta.
Poisjätön määrä sisältää ylärajat kerran; se ei ole lisättävä GK-arvoon tai CHO:hon.

Tarkat ainesosat, tietueet, valmistusavaimet ja lähdeperustelut ovat
[koneellisessa seulassa](gk-r3-existing-83-risk-screen.json).
[Päätelmät, kynnysarvot ja rajat](gk-r3-review.md) kuuluvat samaan aineistoon.

| Sija | Resepti | Pisteet | Liput | Nykyinen GK | Epävarman GI:n CHO g/annos | Pois jätetty CHO g/annos |
| ---: | --- | ---: | --- | ---: | ---: | ---: |
| 1 | vhh-kaalikaarryleet | 33 | R, M, P, V | 9.24 | 14,00 | 1,58 |
| 2 | amritsari-kala | 33 | R, M, P, V | 3.27 | 9,63 | 1,61 |
| 3 | kana-yakitori-kaalilla | 33 | R, M, P, V | 4.8 | 7,27 | 1,89 |
| 4 | karjalanpaisti-vhh | 33 | R, M, P, V | 3.83 | 5,80 | 1,60 |
| 5 | korealainen-yachaejuk-kasvisjuk | 28 | R, M, V | 30.45 | 45,54 | 0,00 |
| 6 | indonesialainen-ketoprak-aamiaiskulho | 28 | R, M, V | 26.67 | 44,96 | 0,00 |
| 7 | kiinalainen-tomaattimunakas-riisilla | 28 | R, M, V | 28.07 | 41,93 | 0,17 |
| 8 | korealainen-jumeokbap-merilevalla | 28 | R, M, V | 27.57 | 41,17 | 0,00 |
| 9 | malesialainen-congee-inkivaarilla | 28 | R, M, V | 26.65 | 39,78 | 0,90 |
| 10 | kiinalainen-riisipuuro-kananmunalla | 28 | R, M, V | 26.65 | 39,78 | 0,21 |
| 11 | pohjoisafrikkalainen-kuskus-aamiaiskulho | 28 | R, M, V | 34.36 | 38,32 | 0,00 |
| 12 | meksikolainen-molletes-pico-de-gallolla | 28 | R, M, V | 20.01 | 36,07 | 0,00 |
| 13 | malesialainen-mee-goreng-aamunuudeleilla | 28 | R, M, V | 18.55 | 35,15 | 0,17 |
| 14 | vietnamilainen-banh-mi-munalla | 28 | R, M, V | 19.49 | 30,38 | 0,17 |
| 15 | souvlaki | 28 | R, M, V | 17.9 | 30,25 | 0,37 |
| 16 | lahi-ita-kikhernejauho-yrttilettu | 28 | R, M, V | 7.42 | 20,57 | 0,37 |
| 17 | gazpacho | 28 | R, M, V | 8.3 | 18,62 | 0,13 |
| 18 | valimerellinen-kikherne-yrttiaamiainen | 28 | R, M, V | 4.93 | 11,60 | 0,95 |
| 19 | kanakorma-kukkakaaliriisilla | 28 | R, M, V | 3.45 | 6,66 | 0,00 |
| 20 | lihapullat-kermakastikkeessa-vhh | 28 | R, M, V | 3.53 | 6,38 | 0,00 |
| 21 | khao-man-gai-vhh | 28 | R, M, V | 3.67 | 6,18 | 0,66 |
| 22 | kesakurpitsalasagne-vhh | 28 | R, M, V | 2.77 | 6,18 | 0,51 |
| 23 | jauhelihakastike-kesakurpitsanuudeleilla | 28 | R, M, V | 3.4 | 5,83 | 0,00 |
| 24 | kukkakaaligratiini-pekonilla | 28 | R, M, V | 3.28 | 5,65 | 0,20 |
| 25 | valimerellinen-menemen-fetalla | 28 | R, M, V | 2.2 | 5,21 | 0,37 |
| 26 | vhh-lohikeitto-kukkakaalilla | 28 | R, M, V | 2.88 | 5,05 | 1,23 |
| 27 | broileri-kukkakaaligratiini | 28 | R, M, V | 2.88 | 5,05 | 0,15 |
| 28 | poronkaristys-kukkakaalimuusilla | 28 | R, M, V | 3.09 | 5,02 | 0,72 |
| 29 | larb-moo-vhh | 28 | R, M, V | 3.13 | 4,71 | 0,00 |
| 30 | khao-kha-moo-vhh | 28 | R, M, V | 2.78 | 4,21 | 0,00 |
| 31 | paahdettu-aamiaismunakoiso | 28 | R, M, V | 2.43 | 4,19 | 0,36 |
| 32 | pad-kra-pao-vhh | 28 | R, M, V | 2.5 | 3,96 | 0,99 |
| 33 | gai-yang-vhh | 28 | R, M, V | 2.4 | 3,64 | 1,35 |
| 34 | kermainen-lohipata | 28 | R, M, V | 1.26 | 3,53 | 1,50 |
| 35 | valimerellinen-pinaatti-fetashakshuka | 28 | R, M, V | 0.79 | 3,06 | 0,17 |
| 36 | halloumimunakas | 28 | R, M, V | 0.82 | 2,98 | 0,52 |
| 37 | raejuusto-pesto-kasviskulho | 28 | R, M, V | 0.86 | 2,48 | 0,63 |
| 38 | kiinalainen-soijamaito-aamiaisella | 28 | R, M, V | 0.67 | 1,96 | 0,35 |
| 39 | korealainen-gyeran-mari-kasviksilla | 28 | R, M, V | 1.19 | 1,81 | 0,42 |
| 40 | yum-woon-sen-vhh | 24 | O, M, V | 0.24 | 1,08 | 1,13 |
| 41 | munakasrulla-pinaatti-tuorejuustolla | 24 | O, R, M | 0.35 | 1,00 | 1,20 |
| 42 | kantonilainen-hoyrytetty-kala | 22 | O, R, V | 0.23 | 0,35 | 0,83 |
| 43 | intialainen-pesarattu-mungpavuista | 20 | R, M | 37.15 | 70,93 | 0,60 |
| 44 | japanilainen-tamago-kake-gohan | 20 | R, M | 26.47 | 39,50 | 1,02 |
| 45 | korealainen-gyeranbap-riisikulho | 20 | R, M | 26.47 | 39,50 | 1,02 |
| 46 | thai-jok-kanalla | 20 | R, M | 26.47 | 39,50 | 0,24 |
| 47 | thai-porsasjok | 20 | R, M | 26.47 | 39,50 | 0,21 |
| 48 | japanilainen-onigiri-lohella | 20 | R, M | 26.47 | 39,50 | 0,02 |
| 49 | kiinalainen-hirssipuuro-taateleilla | 20 | M, V | 21.19 | 37,76 | 0,08 |
| 50 | marjakiisseli-vaniljakastikkeella | 20 | R, M | 19.93 | 35,73 | 0,01 |
| 51 | lahi-ita-fattet-hummus | 20 | R, M | 18.33 | 33,54 | 0,07 |
| 52 | meksikolainen-aamiais-tacot-mustapavuilla | 20 | R, M | 16.04 | 33,16 | 0,73 |
| 53 | medu-vada | 20 | R, M | 10.77 | 30,15 | 0,00 |
| 54 | meksikolainen-munakokkeli-pico-de-gallolla | 20 | M, V | 14.06 | 28,08 | 0,42 |
| 55 | lahi-ita-zaatar-munat | 20 | R, M | 15.62 | 25,54 | 0,42 |
| 56 | pannacotta-marjakastikkeella | 20 | R, M | 12.56 | 23,22 | 0,04 |
| 57 | karibia-mango-limejogurtti | 20 | R, M | 7.3 | 15,10 | 0,73 |
| 58 | valimerellinen-jogurttikulho-hunajalla | 20 | R, M | 6.09 | 12,04 | 0,00 |
| 59 | lahi-ita-ful-medames | 20 | R, M | 3.6 | 10,60 | 0,69 |
| 60 | valimerellinen-ricotta-persikkakulho | 20 | R, M | 4.08 | 9,86 | 0,12 |
| 61 | pohjoisafrikkalainen-maakouda | 20 | R, M | 3.3 | 4,65 | 0,50 |
| 62 | keto-joulutortut | 20 | R, M | 1.8 | 4,08 | 0,12 |
| 63 | tandoorikana | 20 | R, M | 0.88 | 2,50 | 1,44 |
| 64 | keto-pannukakku | 20 | R, M | 0.86 | 2,45 | 0,55 |
| 65 | karibia-jamaikalainen-munakokkeli | 20 | M, V | 0.47 | 2,16 | 0,67 |
| 66 | vhh-brita-kakku | 20 | R, M | 0.79 | 1,78 | 1,08 |
| 67 | keto-pinaattiletut | 20 | R, M | 0.47 | 1,33 | 0,88 |
| 68 | kurkku-oliivi-aamiaiskulho | 18 | R, V | 0.31 | 1,14 | 1,05 |
| 69 | savulohi-avokadokulho | 18 | R, V | 0.4 | 0,79 | 0,29 |
| 70 | kai-jiew-vhh | 18 | R, V | 0.46 | 0,70 | 0,42 |
| 71 | vhh-lihamureke | 15 | O, N, P | 0 | 0,00 | 1,91 |
| 72 | uunimunat-pinaatilla | 15 | O, N, P | 0 | 0,00 | 1,58 |
| 73 | uuniporsas-kermakastikkeessa-vhh | 15 | O, N, P | 0 | 0,00 | 1,51 |
| 74 | vhh-mokkapalat | 14 | O, R | 0.08 | 0,24 | 1,02 |
| 75 | hummus | 12 | M | 6.16 | 17,60 | 0,57 |
| 76 | kanasalaatti-pesto-mozzarella | 12 | M | 0.29 | 1,31 | 0,82 |
| 77 | tacokulho-nauta-avokado | 10 | R | 0.42 | 0,85 | 1,25 |
| 78 | uunimuna-avokadot | 10 | O, N | 0 | 0,00 | 1,46 |
| 79 | kiinalainen-teehaudutetut-munat | 10 | O, N | 0 | 0,00 | 1,27 |
| 80 | munakokkeli | 10 | O, N | 0 | 0,00 | 1,15 |
| 81 | munakasmuffinit | 10 | O, N | 0 | 0,00 | 0,81 |
| 82 | thai-kai-jiao-yrteilla | 10 | O, N | 0 | 0,00 | 0,79 |
| 83 | tonnikalamunakkaat-uunissa | 10 | O, N | 0 | 0,00 | 0,62 |
