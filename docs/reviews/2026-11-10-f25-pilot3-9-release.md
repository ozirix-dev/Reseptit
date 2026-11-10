# F25 – ensimmäinen kolmen reseptin / yhdeksän käännöksen julkaisu (10.11.2026)

## Rajaus ja päätös

Eristetään [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -haarasta vain **3 suomenkielisen julkaistun reseptin 9 kieliversiota**. Julkaisuhakemisto ja AI-merkitysevidenssit lisätään vain niille. Koko F25-työjonoa **ei** yhdistetä; muut 22 reseptiä / 66 kieliversiota jäävät Draft- ja HOLD-jonoihin. Tämän release-PR:n omat toimitukselliset hyväksynnät korvaavat vain näiden kolmen aiemmat yleisluonteiset SOURCE-HOLD-merkinnät; niitä ei tulkita koko F25-erän hyväksynnäksi.

FI-vertailuversio on [PR #405](https://github.com/ozirix-dev/Reseptit/pull/405) kautta tarkistettu **SHA-256-lukittu julkinen FI-esitys**. Kanoniseen FI-raakatekstiin, GI/GK-sinetteihin, ainesmääriin, neljään ravintoarvoon tai kuvatiedostoihin ei kosketa.

### 1. Uunimuna-avokadot (`uunimuna-avokadot`)

- Laskennan lähde: `docs/nutrition/calculations/uunimuna-avokadot.json`, reviewerStatus `AUTOMATED ONLY`, Fineli-avokado 11057, kuoreton kananmuna 858, sitruunamehu 11557, ruohosipuli 392 sekä AFCD-mustapippuri F006618.
- Koko resepti: **200 g avokadon syötävää lihaa, 200 g kuoretonta kananmunaa, 5 g sitruunamehua, 7 g ruohosipulia, 0,5 g mustapippuria** ja valinnainen suola; **2 annosta**.
- Julkinen FI-ohje käyttää myös avokadon koloon mahtumattoman munan pienessä uunivuoassa. **Kaikki 200 g syödään.** Tuoteryhmät ja punnittu syötävä tila täsmäävät; ei kpl→g-arvausta.
- Määrä × lähteen 100 g koostumus / 100 / 2 tuottaa annosta kohti: imeytyvät hh **1,23 g**, hiilihydraatit kuidun kanssa **4,97 g**, proteiini **15,35 g**, rasva **28,68 g**. Kaikki neljä täsmäävät olemassa olevaan FI-julkaisuun.
- EN/SV/TH:n `diet_class: keto` on tallennettu jo F25:n esikatselmoinnissa ja säilytetään. `main_ingredient`-tunniste on lukittu FI:n `kananmuna`-arvoon.

### 2. Karibialainen mango-limejogurtti (`karibia-mango-limejogurtti`)

- Laskentasyöte: `docs/nutrition/calculations/karibia-mango-limejogurtti.json`, reviewerStatus `AUTOMATED ONLY`. Punnittu **200 g kuorittua mangoa**, **100 g jogurttia**, **15 g limemehua**, **20 g sokeroimatonta kuivattua kookosta**, valinnainen suola; **2 annosta**.
- Tuotetyypit: AFCD Release 3:n kuorittu raaka mango F005299, limemehu F004729, kookoshiutale F002987. Laskennan jogurttimalli on Fineli 620, **maustamaton Bulgarian-tyyppinen jogurtti, 3,9 % rasvaa**. Tämä on eksplisiittinen viitetuote, ei väite kaikkien maustamattomien jogurttien yhtäsuurista ravintoarvoista.
- Lasketut makrot/annos: imeytyvät hh **15,12 g**, kuitu mukaan lukien hiilihydraatit **18,23 g**, proteiini **2,65 g**, rasva **8,50 g**, täsmälleen FI-arvot.
- FI-raakatekstin vanhat väärät lämpimän kulhon vaiheet eivät kuulu julkaisuun: #401/#403:n projektio ja kolmen kielen neljä valmistusvaihetta kertovat mango-jogurtin kylmävalmistuksesta. Kookosta voi paahtaa vain kuivalla pannulla ilman lisättyä öljyä, mutta ravintomalli ei mittaa paahdon ravinnehävikkiä.
- **Rajoitus:** kaupan jogurttipakkauksen rasvapitoisuus ja koostumus on tarkistettava 3,9 % vertailuluokkaa vasten; muut tuotteet muuttavat laskennallisia makroja. Lähdearvio on täsmäytys luokiteltuun viite-elintarvikkeeseen, ei brändikohtainen laboratoriomittaus.

### 3. Kreikkalainen jogurttikulho hunajalla (`valimerellinen-jogurttikulho-hunajalla`)

- Laskentasyöte: `docs/nutrition/calculations/valimerellinen-jogurttikulho-hunajalla.json`, reviewerStatus `AUTOMATED ONLY`. **100 g 7 % kreikkalaista jogurttia**, **30 g saksanpähkinää**, **1 rkl hunajaa** ja **50 g tuoretta syötävää viikunaa**, 2 annosta.
- Viitteet: Fineli 34611 (maustamaton, 7 % rasvaa, laktoositon kreikkalainen jogurtti) ja Fineli 376 (saksanpähkinä); AFCD hunaja F004380 sekä tuore viikuna F003834. **Hunajan 1 rkl = 20 g** on laskentasyötteen Fineli 4 -annosmuunnos. Käytä ilmoitettua viitejogurttia tai tarkista korvaavan tuotteen pakkaus; 7 % rasvapitoisuus yksin ei takaa identtisiä kaikkia makroja.
- Lasketut makrot/annos: imeytyvät hh **11,19 g**, kuidun sisältävä kokonaishiilihydraatti **12,80 g**, proteiini **6,70 g**, rasva **13,36 g**. Laskettu kaikista syötävistä punnituista aineksista, täsmää FI:n neljään kenttään.
- Julkinen FI-esitys ja käännökset sisältävät vain kylmät annoskulhot, viikunan, pähkinät ja hunajan; aiemmat geneeriset lämpimän kulhon papu-/tofuvaiheet on poistettu SHA-lukitulla esitysoikaisulla.

## Merkityskatselmoinnin versiosidokset (AI only)

Verrattu FI-julkisen, kokkikorjatun esityksen ja yhdeksän käännöksen otsikko, mittayksiköt, raaka-aineet, annosmäärät, ruokavalioluokitus, neljä makroa, valmistusvaiheet, tuotteen raaka/kypsä/kuiva-muodot sekä ylimääräiset lisäykset. Päätös **AI-merkityskatselmointi `pass`**, ei ihmis-/natiivipuhujakatselmointi. Merkkijonojen täsmälliset SHA-256-tiivisteet ovat `meta/kaannokset/codex-review-evidence.json`-rekisterissä kaikille **9** kieliversiolle. Muuttuva tekstisisältö vanhentaa hyväksynnän automaattisesti; `source_hash` on julkisen FI-esityksen, ei korjaamattoman raakatiedoston hash.

Pääainesosan koneellinen tunniste säilytetään **suomeksi samana kuin FI-lähteessä** jokaiselle kieliversiolle; otsikko, ohjeet ja varsinaiset ainesnimet ovat käännettyjä. `status: published` -tunnisteet, 9 semanttista SHA-paria sekä julkaisuindeksin **59 lähdettä / 177 kieliparia → 62 lähdettä / 186 kieliparia** ovat tämän julkaisu-PR:n ainoat varsinaiset julkaisumuutokset.

## Ehdot ennen mergeä ja tuotantoa

1. Tämän release-PR:n täsmä-HEAD:lle Recipe site CI **SUCCESS**, mukaan lukien muutetut reseptit, ravintoaineet, käännösten rakenne, semanttinen SHA, sivuston build, selaintestit ja kuvat.
2. Edellytysten täytyttyä yhdistä release-PR, ei vanhaa F25 Draft #399:ää. Tarkista **juuri merge-SHA:n main Pages build ja deploy SUCCESS** erikseen; mahdolliset live-reitit tarkistetaan erillisellä smoke-testillä.
3. F25:n muissa 22 lähteessä 66 käännöstä pysyy Draftissa ja niiden lähde-/ravinto-/GI/GK-HOLD-jono ennallaan. Ei uusia reseptejä eikä muutoksia PR #400:n ennakkoporttiin tai PR #402:n 82 tapauksen luokitteluun.

Tämä julkaisu perustuu **jäljitettäviin reseptitietokannan koostumusarvioihin**, ei yksittäisten pakkauksien tai valmistettujen annosten laboratoriotutkimukseen. Ihmisen tekemää riippumatonta maun, käännöksen tai ravintosisällön katselmointia ei väitetä.
