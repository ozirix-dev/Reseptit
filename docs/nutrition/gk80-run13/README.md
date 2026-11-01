# GK-80 — AJO 13: 22 reseptin katselmointitulokset

**1 numeerista katselmointiehdotusta, 21 HOLD. Julkaisusuositus NO-GO: lukittu 15 / 18 / 20 tavoite jäi kaikilta tasoilta saavuttamatta.**

Tämä main-pohjainen Draft säilyttää koko erän päätökset ja mahdolliset täsmälliset reseptiversiot omistajan arvioitaviksi. Se ei ole valmis julkaisuintegraatio. Kaikki numeeriset tulokset ovat LOW-luottamuksen mallinnettuja arvioita. Omistajan sisältö- ja menetelmähyväksyntä puuttuu.

Erän lähdöksi lukittiin main 5761afa069ea54c9d510f1cb3c1086ae7d42f998. Kaikki neljä erää sisältävät yhteensä88 eri reseptiä; valinta ja15/18/20 tavoitteet lukittiin ennen laskentaa eikä listaa vaihdettu tulosten parantamiseksi. AJO9:n Draft PR153 jää erilliseksi.

Vain tämän docs/nutrition/gk80-run13/-hakemiston tiedostoja lisätään. Reseptien julkaistuja lähteitä, käännöksiä, Golden-rekisteriä, GI-lähdekatalogia tai ajonaikaista laskentaa ei muuteta. Runtime pysyy130/326:ssa (39,88 %). Viittä tutkimusehdotusta ei nimetä tuotantokattavuudeksi eikä integroiduksi135/326-ehdokkaaksi. Ready-siirtymää, mergeä, deployta tai ReportHub-muutoksia ei tehdä.

## Koko 22 reseptin päätösmatriisi

| Resepti | Päätös | GK/annos | Keskeinen este / rajaus |
|---|---|---:|---|
| Chettinad-kana paahdetuilla mausteilla | HOLD | — | fenkolinsiemeniä, tuoreita currylehtiä |
| Hapanimelä porsas ja kasvikset | HOLD | — | maissitärkkelystä, valutettua ananasta omassa mehussaan, ketsuppia, soijakastiketta, keitettyä pitkäjyväistä valkoista riisiä |
| Pisang goreng banaanifritterit | HOLD | — | kuorittua banaania, riisijauho, kuivattua kookoshiutaletta |
| Pehmeä mannasuurimoupma | HOLD | — | mannasuurimo, tuoreita curry-lehtiä |
| Jauheliha-makaronilaatikko — 7 % jauhelihan ja tuoreen valkosipulin versio | EHDOTUS / LOW | 17,61 | Täsmällinen punnittu versio; rajaukset alla |
| Bammy-kassavaleipä avokadolla | HOLD | — | kuorittua tuoretta kassavaa |
| Mutakakku – keto | HOLD | — | mantelijauhoa, kaakaojauhetta |
| Kookos-lime-kanacurry | HOLD | — | thaimaalaista currytahnaa, kalakastiketta |
| Manakish za’atarilla aamiaiseksi | HOLD | — | vehnäjauhoja |
| Lindströminpihvit ja voissa paistettu kaali | HOLD | — | säilykepunajuurta, punajuurilientä, Dijon-sinappia |
| Roti jala currykanalla | HOLD | — | vehnäjauho |
| Miso-lohi paistetuilla paksoilla | HOLD | — | vaaleaa misotahnaa, tamaria |
| Valencialainen paella kanalla | HOLD | — | puuroriisiä, kuivapaino, sahramia, rosmariinin oksa |
| Marokkolainen baghrir hunajavoilla | HOLD | — | mannasuurimo, vehnäjauho, kuivahiivaa |
| Pohjoisafrikkalainen taatelipuuro appelsiinilla | HOLD | — | mannasuurimo, kivettömiä kuivattuja taateleita, kuorittua appelsiinia |
| Indonesialaiset sate ayam -kanavartaat maapähkinäkastikkeella | HOLD | — | soijakastiketta, maapähkinävoita |
| Kananmunat kookoscurrykastikkeessa | HOLD | — | Mae Ploy punaista currytahnaa, kuivaa pitkäjyväistä valkoista riisiä |
| Uunimakkara sipuli-sinappipeitteellä | HOLD | — | lenkkimakkaraa, Dijon-sinappia |
| Korvapuustit mantelitaikinasta | HOLD | — | mantelijauhoa, kanelia |
| Omenapiirakka – VHH | HOLD | — | mantelijauhoa, pientä omenaa |
| Banh cuon sienitäytteellä | HOLD | — | riisijauho, kalakastike |
| Xiaolongbao-höyrynyytit | HOLD | — | vehnäjauhoja taikinaan, soijakastiketta |

## Numeeristen versioiden ravintoarvot

Saatavilla oleva HH, kokonaishiilihydraatti, proteiini ja rasva g/annos. Laskennassa käytetään täysiä lähdelukuja; näytetyt makrot pyöristetään vasta lopuksi. Kaya-leivän skenaarioväli ei ole biologinen epävarmuusväli.

| Versio | HH saatavilla | HH yhteensä | Proteiini | Rasva |
|---|---:|---:|---:|---:|
| [Jauheliha-makaronilaatikko — 7 % jauhelihan ja tuoreen valkosipulin versio](versions/jauheliha-makaronilaatikko.md) | 37,35 | 39,2 | 47,73 | 27,99 |

## Reseptikohtainen katselmointi

### Chettinad-kana paahdetuilla mausteilla

ID: chettinad-kana. Alkuperäinen resepti: [reseptit/paaruoat/chettinad-kana.md](../../../reseptit/paaruoat/chettinad-kana.md). Lähde-SHA256: 92672822970d68f41f3a1698dbd4c665c928a48738ba2447f586e47f7c018da3.

**HOLD — ei koko reseptin GK:ta.**

- **fenkolinsiemeniä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **tuoreita currylehtiä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Hapanimelä porsas ja kasvikset

ID: hapanimela-porsas. Alkuperäinen resepti: [reseptit/paaruoat/hapanimela-porsas.md](../../../reseptit/paaruoat/hapanimela-porsas.md). Lähde-SHA256: 2b5b1a12add2b95057c032ad37750688908a7e561114c856a3ce4517bfd10966.

**HOLD — ei koko reseptin GK:ta.**

- **maissitärkkelystä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F27; saatavilla oleva HH 86.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **valutettua ananasta omassa mehussaan**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F471; saatavilla oleva HH 11.2 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **ketsuppia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F353; saatavilla oleva HH 19.2 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **keitettyä pitkäjyväistä valkoista riisiä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F30346; saatavilla oleva HH 23.561 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Pisang goreng banaanifritterit

ID: indonesialainen-pisang-goreng-aamiaiseksi. Alkuperäinen resepti: [reseptit/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md](../../../reseptit/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md). Lähde-SHA256: 138cdf475d4ee52853833fad3ad08a91fb97f0f5f1e951edaeb8d0477d0a79f7.

**HOLD — ei koko reseptin GK:ta.**

- **kuorittua banaania**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F11049; saatavilla oleva HH 18.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **riisijauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F182; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuivattua kookoshiutaletta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A002987; saatavilla oleva HH 7.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Pehmeä mannasuurimoupma

ID: intialainen-mannasuurimoupma. Alkuperäinen resepti: [reseptit/aamupalat/intialainen-mannasuurimoupma.md](../../../reseptit/aamupalat/intialainen-mannasuurimoupma.md). Lähde-SHA256: edc2d2353036c6e400361951048a4be69d4943d9ad78a40058de0458015fd562.

**HOLD — ei koko reseptin GK:ta.**

- **mannasuurimo**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F112; saatavilla oleva HH 63.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **tuoreita curry-lehtiä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Jauheliha-makaronilaatikko — 7 % jauhelihan ja tuoreen valkosipulin versio

ID: jauheliha-makaronilaatikko. Alkuperäinen resepti: [reseptit/paaruoat/jauheliha-makaronilaatikko.md](../../../reseptit/paaruoat/jauheliha-makaronilaatikko.md). Lähde-SHA256: 29d29a7faeff8029b9700b1d21f3e14bde10bedae2988112987437eee4e98eba.

**EHDOTUS / LOW — sisältö- ja menetelmähyväksyntä puuttuu.** Jauhelihan koostumus korjataan nimettyyn 7 % naudan jauhelihaan (Fineli 712); aiempi 17 % vertailu ei vastannut ainesosaa. Tuore valkosipuli 6 g korvaa 3 g jauhetta erillisessä versiossa. Makaronin GI 49 on esikeitetyn ja valutetun pastan lähdevertailu, jota uunissa jälkikypsennykseen sovelletaan LOW-analogiana. Kuivapainokoostumus säilytetään; mittaamatonta liukenemishävikkiä, jäähdytys- tai rasvahyvitystä ei vähennetä.

[Valmistus ja kaikki punnitut ainekset](versions/jauheliha-makaronilaatikko.md). Täsmällinen syötehash: 2d39b0c11f3e710c38a0d23b44c437606e881795e14a738dff85e6fca8a2527d. Kaikki lähdekohtaiset GI-sovellukset ja koostumusproxyt ovat recipes.json- ja sources.json-tiedostoissa.

### Bammy-kassavaleipä avokadolla

ID: karibia-bammy-kassavaleipa. Alkuperäinen resepti: [reseptit/aamupalat/karibia-bammy-kassavaleipa.md](../../../reseptit/aamupalat/karibia-bammy-kassavaleipa.md). Lähde-SHA256: 7d428074d611fe4099d474cae84332bfada53d7be72e7aaba65f2eb440530951.

**HOLD — ei koko reseptin GK:ta.**

- **kuorittua tuoretta kassavaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A002286; saatavilla oleva HH 30.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Mutakakku – keto

ID: keto-mutakakku. Alkuperäinen resepti: [reseptit/jalkiruoat/keto-mutakakku.md](../../../reseptit/jalkiruoat/keto-mutakakku.md). Lähde-SHA256: 4c3766146f4fd3379a8581f4ec4023c0b32d7bab1e593f75bb7ca30e096de17e.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kaakaojauhetta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F20; saatavilla oleva HH 11.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kookos-lime-kanacurry

ID: kookos-lime-kanacurry. Alkuperäinen resepti: [reseptit/paaruoat/kookos-lime-kanacurry.md](../../../reseptit/paaruoat/kookos-lime-kanacurry.md). Lähde-SHA256: 3b0e306e88dc4feed09e84a47c445e87dff9046c7ea83bddf4605cfe98187f9c.

**HOLD — ei koko reseptin GK:ta.**

- **thaimaalaista currytahnaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus mae-ploy-green-curry-paste-2026-10-24-campaign4; saatavilla oleva HH 17.3 g/100 g; polyolit 0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kalakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus off-13692210-squid-brand-fish-sauce-2026-10-24-campaign4; saatavilla oleva HH 3.4 g/100 g; polyolit 0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Manakish za’atarilla aamiaiseksi

ID: lahi-ita-manakish-zaatarilla. Alkuperäinen resepti: [reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md](../../../reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md). Lähde-SHA256: b1c6167df859ba8589506e7bdc4a87a42e72a69ed175d073001422eb515fbd45.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauhoja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Lindströminpihvit ja voissa paistettu kaali

ID: lindstrominpihvit-kaalilla. Alkuperäinen resepti: [reseptit/paaruoat/lindstrominpihvit-kaalilla.md](../../../reseptit/paaruoat/lindstrominpihvit-kaalilla.md). Lähde-SHA256: ea116b68468b429136a7d799a9e84530ab6d618b77aa4dcd2a18857599f77069.

**HOLD — ei koko reseptin GK:ta.**

- **säilykepunajuurta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A001010; saatavilla oleva HH 8.7 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **punajuurilientä**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **Dijon-sinappia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F28; saatavilla oleva HH 14.1 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Roti jala currykanalla

ID: malesialainen-roti-jala-currykanalla. Alkuperäinen resepti: [reseptit/aamupalat/malesialainen-roti-jala-currykanalla.md](../../../reseptit/aamupalat/malesialainen-roti-jala-currykanalla.md). Lähde-SHA256: 47a941e68c3b47e9b62d534ce5f21dd04c76b7db37426df7fe659e580474d576.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Miso-lohi paistetuilla paksoilla

ID: miso-lohi-paksoi. Alkuperäinen resepti: [reseptit/paaruoat/miso-lohi-paksoi.md](../../../reseptit/paaruoat/miso-lohi-paksoi.md). Lähde-SHA256: c83d14f66d5add960227fc90e39e720ccebb5c9473a5a69608a40ff2c8b2305e.

**HOLD — ei koko reseptin GK:ta.**

- **vaaleaa misotahnaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A005702; saatavilla oleva HH 19.7 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **tamaria**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Valencialainen paella kanalla

ID: paella-valenciana. Alkuperäinen resepti: [reseptit/paaruoat/paella-valenciana.md](../../../reseptit/paaruoat/paella-valenciana.md). Lähde-SHA256: 49089d94833037456fa7f21b7e9b258a531c731db6f0344b2a789add6b96b3dd.

**HOLD — ei koko reseptin GK:ta.**

- **puuroriisiä, kuivapaino**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007682; saatavilla oleva HH 74.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **sahramia**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **rosmariinin oksa**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Marokkolainen baghrir hunajavoilla

ID: pohjoisafrikkalainen-baghrir. Alkuperäinen resepti: [reseptit/aamupalat/pohjoisafrikkalainen-baghrir.md](../../../reseptit/aamupalat/pohjoisafrikkalainen-baghrir.md). Lähde-SHA256: 465c021ba03a828a5a70f17ad6d5bce142e9cf957dc7af730bf5c1c352d8f706.

**HOLD — ei koko reseptin GK:ta.**

- **mannasuurimo**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F112; saatavilla oleva HH 63.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuivahiivaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A009606; saatavilla oleva HH 6.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Pohjoisafrikkalainen taatelipuuro appelsiinilla

ID: pohjoisafrikkalainen-taatelipuuro-appelsiinilla. Alkuperäinen resepti: [reseptit/aamupalat/pohjoisafrikkalainen-taatelipuuro-appelsiinilla.md](../../../reseptit/aamupalat/pohjoisafrikkalainen-taatelipuuro-appelsiinilla.md). Lähde-SHA256: bc0b56fcd0d24b4a227a0ff9343d86a8c4105760c6faf1735a0f8d044a68cfaf.

**HOLD — ei koko reseptin GK:ta.**

- **mannasuurimo**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F112; saatavilla oleva HH 63.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kivettömiä kuivattuja taateleita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A003496; saatavilla oleva HH 67.2 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuorittua appelsiinia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F11045; saatavilla oleva HH 8.9 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Indonesialaiset sate ayam -kanavartaat maapähkinäkastikkeella

ID: sate-ayam. Alkuperäinen resepti: [reseptit/paaruoat/sate-ayam.md](../../../reseptit/paaruoat/sate-ayam.md). Lähde-SHA256: 3ed0776b1f7a4358f11648e9311faef5018a28b758e0826c72a0f62d26dda93b.

**HOLD — ei koko reseptin GK:ta.**

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **maapähkinävoita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F34667; saatavilla oleva HH 12.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kananmunat kookoscurrykastikkeessa

ID: thai-kananmunat-kookoscurryssa. Alkuperäinen resepti: [reseptit/aamupalat/thai-kananmunat-kookoscurryssa.md](../../../reseptit/aamupalat/thai-kananmunat-kookoscurryssa.md). Lähde-SHA256: 1d127dee1a5b1e82c2cbbb7d71e41aac62e4d86266074d27d867197aa9e0ae83.

**HOLD — ei koko reseptin GK:ta.**

- **Mae Ploy punaista currytahnaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus mae-ploy-red-curry-paste-2026-10-24-campaign4; saatavilla oleva HH 24.2 g/100 g; polyolit 0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuivaa pitkäjyväistä valkoista riisiä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007682; saatavilla oleva HH 74.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Uunimakkara sipuli-sinappipeitteellä

ID: uunimakkara-sipulipedilla. Alkuperäinen resepti: [reseptit/paaruoat/uunimakkara-sipulipedilla.md](../../../reseptit/paaruoat/uunimakkara-sipulipedilla.md). Lähde-SHA256: 4bc6f751fc46af1fcb7b72419438cc55fd8132b6893d74ddb65a9b732089b092.

**HOLD — ei koko reseptin GK:ta.**

- **lenkkimakkaraa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F7607; saatavilla oleva HH 7.598 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **Dijon-sinappia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F28; saatavilla oleva HH 14.1 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Korvapuustit mantelitaikinasta

ID: vhh-korvapuustit. Alkuperäinen resepti: [reseptit/jalkiruoat/vhh-korvapuustit.md](../../../reseptit/jalkiruoat/vhh-korvapuustit.md). Lähde-SHA256: 5719d9a040bacca1c6a8106269c736d57b8e560446ef81ce93a25b0d845aed2f.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kanelia**: Pienen mauste-/siemenosuuden ainesosakohtainen hiilihydraattiraja ylittyy. Koostumus A002963; saatavilla oleva HH 27.5 g/100 g; polyolit 0.0 g/100 g.

### Omenapiirakka – VHH

ID: vhh-omenapiirakka. Alkuperäinen resepti: [reseptit/jalkiruoat/vhh-omenapiirakka.md](../../../reseptit/jalkiruoat/vhh-omenapiirakka.md). Lähde-SHA256: a22e61974772a696521e6a70376e7eeb132fb81668a5a04df4da700a77952536.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **pientä omenaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000095; saatavilla oleva HH 10.7 g/100 g; polyolit 0.3 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Banh cuon sienitäytteellä

ID: vietnamilainen-banh-cuon-sienilla. Alkuperäinen resepti: [reseptit/aamupalat/vietnamilainen-banh-cuon-sienilla.md](../../../reseptit/aamupalat/vietnamilainen-banh-cuon-sienilla.md). Lähde-SHA256: 54b5cf45d8eeff8a07d9c5e9bcac2e4db43d916fb594818c2cc72485aafa9385.

**HOLD — ei koko reseptin GK:ta.**

- **riisijauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F182; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kalakastike**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus off-13692210-squid-brand-fish-sauce-2026-10-24-campaign4; saatavilla oleva HH 3.4 g/100 g; polyolit 0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Xiaolongbao-höyrynyytit

ID: xiaolongbao. Alkuperäinen resepti: [reseptit/alkuruoat/xiaolongbao.md](../../../reseptit/alkuruoat/xiaolongbao.md). Lähde-SHA256: 2d0e026ce3e13ae802fb836053ee7c0b2a28a43ac0306a5ee902d59d1d2aa549.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauhoja taikinaan**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

## Lähde- ja laskentaperiaatteet

Tämä on rajatun lähdekatselmoinnin tulos, ei väite siitä, ettei muualla voisi olla soveltuvaa tutkimusta. Osittainen ainesosasumma tai tunnetut makrot eivät ole koko reseptin GK. HOLD-päätöksissä wholeGk ja julkaistavat kokonaismakrot jäävät nulliksi.

Finelin CHOAVL ja AFCD:n available carbohydrate without sugar alcohols ovat jo kuitua ja polyoleja vailla. Polyoleja ei vähennetä niistä uudelleen. Kokonaishiilihydraatti lasketaan saatavilla olevasta hiilihydraatista, kuidusta ja varmennetuista polyoleista. Lähteessä puuttuva polyoli pysyy puuttuvana. AFCD:n alkuperäinen Excel luettiin ja sen paritetut hiilihydraattikentät tarkistettiin; tietueita ei väitetä tänään verkosta ladatuiksi.

Nykyisen nimetyn vähähiilihydraattisen oletuksen 50 ehto on saatavilla oleva hiilihydraatti enintään 5 g/100 g. Mantelijauho 5,4, naudanmaksa 5,031, Finelin soijakastike 9,5 ja yleinen sinappi 14,1 eivät alita rajaa. Raja-arvoja ei pyöristetä hyväksyttäviksi. Kokonaisen pavun/pähkinän GI ei sellaisenaan todista jauhon, tahnan, taikinan tai sekaruoan GI:tä. Pienen mausteosuuden ehto on enintään 0,5 g saatavilla olevaa hiilihydraattia ainesosasta/annos ja enintään 1 g yhteensä. Sääntöä ei laajenneta jauhoihin tai tahnoihin.

Valmistus- ja identiteettikorjaukset koskevat vain tutkimuspaketin ehdotuksia: esimerkiksi tavallinen limetti ei ole AFCD:n native lime, Fineli 310 on maa-artisokka eikä peruna, ja paksoi ei ole kiinankaali. Nykyisiä reseptejä ei korvata hiljaisesti toisilla raaka-aineilla.


[Alkuperäislähteet, uudet lähdehavainnot ja rajoitukset](source-review.md). Uusi ihmis-GI-lähdelöydös ei yksin tuota kokonaisen reseptin GK:ta.

## Tehty varmennus

Muuttumattomalla mainin tyypitetyllä GK-moottorilla tarkistettiin yhteensä86 mallia (kaksi koordinaatio-HOLDia ilman rinnakkaismallia), niiden lähdesidonnat ja Golden-Decimal-vastaavuus. Lisäksi kaikki viisi numeerista versiota läpäisivät projektin neljän makron nutrition-evidence-tarkistuksen. verification.json tallentaa tämän erän tuloksen ja käytettyjen moottoritiedostojen hashit. Teknisesti PASS ei ole riippumaton tieteellinen hyväksyntä.

Toistettava, read-only tarkistus: python docs/nutrition/gk80-run13/verify.py. Se tarkistaa22 päätöstä, lähdetekstit ja hashit, koostumusten pääviitteet, kaikki skenaariot, riippumattoman Decimal-laskennan, viiden ehdotuksen neljä makroa sekä sen, että mainiin verrattu diff ja uudet tiedostot rajoittuvat tämän paketin hakemistoon. Tässä erässä tarkistetaan vain sen omat numeeriset versiot. Julkaistuja130 tulosta säilyttää muuttumaton aktiivinen laskenta; niitä ei laskettu uudestaan näillä tutkimusmalleilla.

Ei paikallista sivuston kokonaisbuildia eikä selaintestiä: sivuston koodi ja julkaistavat reseptit eivät muutu. PR:n normaali CI käynnistyy kerran lopulliselle HEADille; sen tilan voi tarkistaa PR:n Checks-näkymästä. CI:n mahdollinen build tarkistaa muuttumattoman runtime-aineiston, ei hyväksy tätä lähdetutkimusta.

## Katselmointiin tuotava päätös

Koko erä on valmis tämän rajatun katselmoinnin tuloksena arvioitavaksi. Julkaisuvaiheeseen etenemistä ei suositella nykyisellä saannolla. Omistaja voi arvioida nimetyt punnitut versiot ja menetelmärajaukset yhtenä kokonaisuutena; HOLD-aineisto pysyy erillään kaikista numeerisista tuloksista. Mahdollinen myöhempi integraatio, Ready, merge ja tuotantodeploy vaativat oman toimeksiantonsa. Uutta tutkimusajoa ei ole käynnistetty tämän paketin jälkeen.
