# F25 – Thai-kookosmunacurry: 3 EN/SV/TH-kieliversion rajattu julkaisu (10.11.2026)

## Julkaisupäätös ja rajaus

Tämä PR ottaa vanhasta [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -haarasta vain `thai-kananmunat-kookoscurryssa`-reseptin kolme kieliversiota. Muut kieliluonnokset ja niiden SOURCE-HOLDit eivät siirry julkaisuun. Julkaisu-PR on luotu tuoreesta mainista, eikä vanhaa Draft-PR:ää yhdistetä.

FI:n valmistusohje on lähde-SHA:han lukittu julkinen esitys, jota tarkennettiin [PR #414](https://github.com/ozirix-dev/Reseptit/pull/414):ssa. Siinä on ruokalajikohtaiset neljä ohjevaihetta, käyttömäärän tarkennus ja **katkaraputahnan äyriäisallergeenivaroitus**. Sama merkitys kerrotaan EN/SV/TH-julkaisuteksteissä tuoteviitteineen. Syntyvän FI:n tarkka `semanticHash` on `c86446ffb5aeef6b82e4942e575e5c5f9f21b1333228beeca97e0d0a6e73b279`; raakaa FI-tiedostoa ei muuteta.

## Ainesosien ja ravintoarvojen jäljitettävyys

`docs/nutrition/calculations/thai-kananmunat-kookoscurryssa.json` (Git blob `78929fce4b8c4f95336a460a1643b287ad68b40c`, `reviewerStatus: AUTOMATED ONLY`, laskettu 24.10.2026). Kahden annoksen valmistuksessa on:

| Ainesosa | Todentunut laskentamassa | Lähde |
| --- | ---: | --- |
| Kananmunat, 2 kpl | 110 g syötävää kuoretonta munaa | Fineli 858, 55 g / KPL_M |
| Kookosmaito, 200 ml | 184 g purkkikookosmaitoa | AFCD F002991, 0,92 g/ml |
| Mae Ploy punainen currytahna | 20 g | Sainsbury's Mae Ploy Red Curry Paste 400 g |
| Tomaatti, 1 kpl keskikokoinen | 125 g syötävää tomaattia | Fineli 352, KPL_M |
| Neutraali paistoöljy, 1 rkl | 13,5 g, kaikki laskettu annokseen | Fineli 541 |
| Valkoinen pitkäjyväinen riisi, kuivana | 100 g kuivaa riisiä | AFCD F007682 |
| Suola | valinnainen | ei vaikuta neljään makroon |

Currytahnan käytettyyn referenssiin kuuluvat ravintoarvot **per 100 g: 24,2 g hh, 6,1 g proteiinia, 1,6 g rasvaa, 13,5 g kuitua** sekä katkaraputahna (äyriäinen) 4,5 %. [Sainsbury'sin tuotetiedot](https://sainsburys.co.uk/groceries/product/mae-ploy-red-curry-paste-400g); eri markkinoiden pakkauksissa sisältö voi poiketa. Näitä lukuja ei väitetä kaikkien Mae Ploy -tuotteiden universaaliksi koostumukseksi. FI ja kieliversiot varoittavat myös mahdollisista kalajäämistä.

Punnituista syötävistä aineksista uudelleenlasketut ravintoarvot per annos ovat **imeytyvä hh 43,31 g, hiilihydraatit kuidun kanssa 45,31 g, proteiini 12,68 g, rasva 26,79 g**; kaikki neljä vastaavat mainin FI-reseptin kenttiä sekä jokaista julkaistavaa kieliversiota. Laskennassa koko 1 rkl öljyä jää ruokaan; muita aineksia, kastikkeita tai mittaamattomia lisukkeita ei lisätä. Kookosmaidon tiheys ja tomaatin oletusmassa ovat reseptin laskentamallin dokumentoituja osia. Tämä on tietokantaperusteinen arvio, ei valmiin annoksen laboratoriomittaus.

## Kokkikatselmointi ja merkitys

1. 100 g kuivaa riisiä kypsennetään pakkauksen vesimäärässä; kaksi kananmunaa keitetään kypsiksi ja kuoritaan.
2. 20 g tahnaa paistetaan 1 rkl neutraalissa öljyssä ja sekoitetaan joukkoon 200 ml kookosmaitoa.
3. Yksi tomaatti lisätään currykastikkeeseen; keitetyt munat lämmitetään kastikkeessa.
4. Riisi ja munacurry jaetaan kahteen annokseen. Neljään työvaiheeseen ei lisätä rekisterin ulkopuolisia aineksia.
5. EN/SV/TH varoittavat samasta äyriäisallergeenista, mainitsevat kalajäämien mahdollisuuden ja nimeävät tuotekoostumuksen viitteen. Neuvo tarkistaa oma tuote ei korvaa itse ruokaturvallisuuden tarkistamista.

AI-merkitystarkistus kattoi otsikot, 7 ainesriviä, määrät, keitto-/paistovaiheiden järjestyksen, 2 annosta, four macros, allergian ja tuotteen vaihtelun. FI-julkisen esityksen semanttinen SHA: `c86446ffb5aeef6b82e4942e575e5c5f9f21b1333228beeca97e0d0a6e73b279`; kieliversioiden lukitut tiivisteet:
- EN `bbaa0f1451606a25cf56dcc1565daa2962d39082c8c27c969975102cbfcbb8f4`
- SV `49ad8580efedae63214f96db995cde85de96435db089dc18a3b35f1c7feb5ef6`
- TH `07ed8ede74e024a63edf4aa9713add2177e9c928b484c8cf7703df183e25ed8a`

Nämä kirjoitetaan `codex-review-evidence.json`-rekisteriin outcome `pass`: se tarkoittaa **tekoälyn tekemää sisältövertailua**, ei riippumattoman kääntäjän/natiivipuhujan tai koekeittiön hyväksyntää. Kääntämisen kohteena oli sisältö, ei uuden reseptin kehittäminen.

## Julkaisuportti ja rinnakkaistyö

- Muuttuvat vain kolme EN/SV/TH-tiedostoa, julkaisurekisteri **63 reseptiä / 189 kieliparia → 64 reseptiä / 192 kieliparia**, näiden kolme semanttista evidenssiriviä sekä tämä raportti. FI-raakatiedostot, GI/GK, makrot, kuvat ja uudet reseptit pysyvät koskemattomina.
- **FI-PR #414:n exact-HEAD CI sekä merge-SHA:n GitHub Pages build ja deploy SUCCESS** on vahvistettava ennen tämän julkaisun hyväksyntää.
- Julkaisu-PR:n exact-HEAD CI SUCCESS, sitten merge, sitten **julkaisu-PR:n oman merge-SHA:n Pages build + deploy SUCCESS**. Erillistä live-HTTP-savuajotestiä ei ilmoiteta tehdyksi ilman todistetta.
- Ei muutoksia rinnakkaisiin laatu-PR:iin eikä vanhaan F25 #399:ään. Tapiokapuuro ja ruusuvesijogurtti pysyvät HOLDissa omien tuotemäärittelyjensä vuoksi.
