# GK-80 — AJO 10: 22 reseptin katselmointitulokset

**1 numeerista katselmointiehdotusta, 21 HOLD. Julkaisusuositus NO-GO: lukittu 15 / 18 / 20 tavoite jäi kaikilta tasoilta saavuttamatta.**

Tämä main-pohjainen Draft säilyttää koko erän päätökset ja mahdolliset täsmälliset reseptiversiot omistajan arvioitaviksi. Se ei ole valmis julkaisuintegraatio. Kaikki numeeriset tulokset ovat LOW-luottamuksen mallinnettuja arvioita. Omistajan sisältö- ja menetelmähyväksyntä puuttuu.

Erän lähdöksi lukittiin main 5761afa069ea54c9d510f1cb3c1086ae7d42f998. Kaikki neljä erää sisältävät yhteensä88 eri reseptiä; valinta ja15/18/20 tavoitteet lukittiin ennen laskentaa eikä listaa vaihdettu tulosten parantamiseksi. AJO9:n Draft PR153 jää erilliseksi.

Vain tämän docs/nutrition/gk80-run10/-hakemiston tiedostoja lisätään. Reseptien julkaistuja lähteitä, käännöksiä, Golden-rekisteriä, GI-lähdekatalogia tai ajonaikaista laskentaa ei muuteta. Runtime pysyy130/326:ssa (39,88 %). Viittä tutkimusehdotusta ei nimetä tuotantokattavuudeksi eikä integroiduksi135/326-ehdokkaaksi. Ready-siirtymää, mergeä, deployta tai ReportHub-muutoksia ei tehdä.

## Koko 22 reseptin päätösmatriisi

| Resepti | Päätös | GK/annos | Keskeinen este / rajaus |
|---|---|---:|---|
| Baozi-höyrysämpylät porsastäytteellä | HOLD | — | vehnäjauhoja, kuivahiivaa, soijakastiketta, maissitärkkelystä |
| Chow mein -paistetut nuudelit kanalla | HOLD | — | keitettyjä ja valutettuja vehnämunanuudeleita, soijakastiketta, osterikastiketta |
| Hyderabadilainen kanabiryani | HOLD | — | basmatiriisiä, garam masalaa, sahramia |
| Kookospannukakku serabilla | HOLD | — | riisijauho, kuivattua kookoshiutaletta |
| Rava-uttapam kasviksilla | HOLD | — | mannasuurimo |
| Jiaozi-dumplingit porsas-kaalitäytteellä | HOLD | — | vehnäjauhoja taikinaan, soijakastiketta |
| Johnny cake -aamiaissämpylät | HOLD | — | vehnäjauho, leivinjauhe |
| Suklaakeksit – keto | HOLD | — | mantelijauhoa, leivinjauhetta |
| Kongjuk soijapapu-riisipuuro | HOLD | — | soijapapu, riisi |
| Menemen sumakilla | HOLD | — | sumakki |
| Apam balik maapähkinälettu | HOLD | — | vehnäjauho, maapähkinä |
| Marjainen chiavanukas | HOLD | — | vadelmia, mustikoita |
| Munakoiso-kesäkurpitsalasagne | HOLD | — | valmis italialainen tomaattikastike, lasagnelevyt, parmesaani tai vastaava kova juusto |
| Paistettu maksa ja pekoni | HOLD | — | naudan maksaa |
| Bissara-härkäpapukeitto aamiaiseksi | HOLD | — | kuivattuja härkäpapuja |
| Rahka-marjakerroskulho — sitruunamehun ja nimettyjen marjaproxyjen versio | EHDOTUS / LOW | 2,25 | Täsmällinen punnittu versio; rajaukset alla |
| Paahdettu siemengranola jogurtilla | HOLD | — | mantelilastuja, vadelmia, Pienten mauste-/siemenosuuksien yhteinen hiilihydraattiraja ylittyy. |
| Thaimaalaiset maissifritterit | HOLD | — | vehnäjauho |
| Appelsiini-oliiviöljykakku jogurtilla | HOLD | — | vehnäjauho, kuorittua appelsiinia |
| Letut – VHH | HOLD | — | mantelijauhoa |
| VHH-pyttipannu makkarasta ja kasviksista | HOLD | — | vähähiilihydraattista makkaraa |
| Banh xeo -rapeat aamiaisletut | HOLD | — | riisijauho |

## Numeeristen versioiden ravintoarvot

Saatavilla oleva HH, kokonaishiilihydraatti, proteiini ja rasva g/annos. Laskennassa käytetään täysiä lähdelukuja; näytetyt makrot pyöristetään vasta lopuksi. Kaya-leivän skenaarioväli ei ole biologinen epävarmuusväli.

| Versio | HH saatavilla | HH yhteensä | Proteiini | Rasva |
|---|---:|---:|---:|---:|
| [Rahka-marjakerroskulho — sitruunamehun ja nimettyjen marjaproxyjen versio](versions/rahka-marjakerroskulho.md) | 5,89 | 8,41 | 8,09 | 5,87 |

## Reseptikohtainen katselmointi

### Baozi-höyrysämpylät porsastäytteellä

ID: baozi. Alkuperäinen resepti: [reseptit/paaruoat/baozi.md](../../../reseptit/paaruoat/baozi.md). Lähde-SHA256: af8efd8db3bbfc7a57f4e75fe537f88b03e9dfe4227ae586905a6c046b60f208.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauhoja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuivahiivaa**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **maissitärkkelystä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F162; saatavilla oleva HH 81.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Chow mein -paistetut nuudelit kanalla

ID: chow-mein. Alkuperäinen resepti: [reseptit/paaruoat/chow-mein.md](../../../reseptit/paaruoat/chow-mein.md). Lähde-SHA256: 3e9d6ed75ef531708f84720de20aa4fc8d40122f0fdd81c6a6f609d34cbab9c2.

**HOLD — ei koko reseptin GK:ta.**

- **keitettyjä ja valutettuja vehnämunanuudeleita**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006044; saatavilla oleva HH 29.1 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **osterikastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A008026; saatavilla oleva HH 21.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Hyderabadilainen kanabiryani

ID: hyderabadi-kanabiryani. Alkuperäinen resepti: [reseptit/paaruoat/hyderabadi-kanabiryani.md](../../../reseptit/paaruoat/hyderabadi-kanabiryani.md). Lähde-SHA256: c3434af8d2dbd5b016f9afd18839fa778fb2a13d79c2cf0b9e4c2070d43367d9.

**HOLD — ei koko reseptin GK:ta.**

- **basmatiriisiä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007682; saatavilla oleva HH 74.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **garam masalaa**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

- **sahramia**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Kookospannukakku serabilla

ID: indonesialainen-serabi-kookospannukakku. Alkuperäinen resepti: [reseptit/aamupalat/indonesialainen-serabi-kookospannukakku.md](../../../reseptit/aamupalat/indonesialainen-serabi-kookospannukakku.md). Lähde-SHA256: 3c3948cb2d5e7092f203c3656f023a9c041066c4a364c624c1dea7ed82f8de70.

**HOLD — ei koko reseptin GK:ta.**

- **riisijauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F182; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuivattua kookoshiutaletta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A002987; saatavilla oleva HH 7.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Rava-uttapam kasviksilla

ID: intialainen-rava-uttapam. Alkuperäinen resepti: [reseptit/aamupalat/intialainen-rava-uttapam.md](../../../reseptit/aamupalat/intialainen-rava-uttapam.md). Lähde-SHA256: da667b2f0d44a192fa9f930e08a640dbb2473eb0629452279506e4a77904f85b.

**HOLD — ei koko reseptin GK:ta.**

- **mannasuurimo**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F112; saatavilla oleva HH 63.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Jiaozi-dumplingit porsas-kaalitäytteellä

ID: jiaozi. Alkuperäinen resepti: [reseptit/alkuruoat/jiaozi.md](../../../reseptit/alkuruoat/jiaozi.md). Lähde-SHA256: 07659418c6a8ccbdcf907be2d09896db714fb40a1f9aebfbbc6df662dfe7e9d5.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauhoja taikinaan**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **soijakastiketta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F31; saatavilla oleva HH 9.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Johnny cake -aamiaissämpylät

ID: karibia-johnny-cake. Alkuperäinen resepti: [reseptit/aamupalat/karibia-johnny-cake.md](../../../reseptit/aamupalat/karibia-johnny-cake.md). Lähde-SHA256: eab5edacb27b76b31b5fb07912922d23bf5b88c5b09210efbff7802f138e34bc.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **leivinjauhe**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000247; saatavilla oleva HH 19.8 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Suklaakeksit – keto

ID: keto-suklaakeksit. Alkuperäinen resepti: [reseptit/jalkiruoat/keto-suklaakeksit.md](../../../reseptit/jalkiruoat/keto-suklaakeksit.md). Lähde-SHA256: 3bdae3c9ac420759cf20afc908ba7549357fcd55d7435e6a2cbf74d192b3bc44.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **leivinjauhetta**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000247; saatavilla oleva HH 19.8 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Kongjuk soijapapu-riisipuuro

ID: korealainen-kongjuk-soijapapu-riisipuuro. Alkuperäinen resepti: [reseptit/aamupalat/korealainen-kongjuk-soijapapu-riisipuuro.md](../../../reseptit/aamupalat/korealainen-kongjuk-soijapapu-riisipuuro.md). Lähde-SHA256: 6aca70cdb27f83a51c2d759e58bdcd446e6a1f9f5c414a71494fb44ec9454f31.

**HOLD — ei koko reseptin GK:ta.**

- **soijapapu**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000458; saatavilla oleva HH 12.5 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **riisi**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007682; saatavilla oleva HH 74.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Menemen sumakilla

ID: lahi-ita-menemen-sumakilla. Alkuperäinen resepti: [reseptit/aamupalat/lahi-ita-menemen-sumakilla.md](../../../reseptit/aamupalat/lahi-ita-menemen-sumakilla.md). Lähde-SHA256: 761665715f51419e9c1de3beffaf5d0c375b92475aa111c9dcefeb8a09a6d899.

**HOLD — ei koko reseptin GK:ta.**

- **sumakki**: Koostumus tai kulutettu määrä jäi puutteelliseksi. Laskentaan kelpaavaa massan ja tunnistetun koostumuksen yhdistelmää ei saatu tähän pakettiin; alkuperäinen ainesosarivi säilyy review-bundles.json-tiedostossa.

### Apam balik maapähkinälettu

ID: malesialainen-apam-balik. Alkuperäinen resepti: [reseptit/aamupalat/malesialainen-apam-balik.md](../../../reseptit/aamupalat/malesialainen-apam-balik.md). Lähde-SHA256: e79cae619673433b33136e61e4ca91d14daa02a4c226645347b386ef38893f80.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **maapähkinä**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006107; saatavilla oleva HH 8.9 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Marjainen chiavanukas

ID: marjainen-chiavanukas. Alkuperäinen resepti: [reseptit/aamupalat/marjainen-chiavanukas.md](../../../reseptit/aamupalat/marjainen-chiavanukas.md). Lähde-SHA256: c4c9c7a14345199304e7221fab28633a4a9abeffa3c99afc780cb5360824ec22.

**HOLD — ei koko reseptin GK:ta.**

- **vadelmia**: Vaadittu ravintotekijä tai polyolitieto puuttuu. Koostumus F448; saatavilla oleva HH 5.715 g/100 g; polyolit puuttuu.

- **vadelmia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F448; saatavilla oleva HH 5.715 g/100 g; polyolit puuttuu. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **mustikoita**: Vaadittu ravintotekijä tai polyolitieto puuttuu. Koostumus F442; saatavilla oleva HH 10.182 g/100 g; polyolit puuttuu.

### Munakoiso-kesäkurpitsalasagne

ID: munakoiso-kesakurpitsalasagne. Alkuperäinen resepti: [reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md](../../../reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md). Lähde-SHA256: 4ae15e1b24e86165ef95b0a05ec26806bac14a48618fc9eeaeeb1f089d47d9f8.

**HOLD — ei koko reseptin GK:ta.**

- **valmis italialainen tomaattikastike**: Koostumus tai kulutettu määrä jäi puutteelliseksi.

- **lasagnelevyt**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F117; saatavilla oleva HH 66.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **parmesaani tai vastaava kova juusto**: Koostumus tai kulutettu määrä jäi puutteelliseksi.

### Paistettu maksa ja pekoni

ID: paistettu-maksa-pekonilla. Alkuperäinen resepti: [reseptit/paaruoat/paistettu-maksa-pekonilla.md](../../../reseptit/paaruoat/paistettu-maksa-pekonilla.md). Lähde-SHA256: 32114e6da3c578b2a968f55cbf659604d2b0f3970696e4ae995c059702f8aed9.

**HOLD — ei koko reseptin GK:ta.**

- **naudan maksaa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F786; saatavilla oleva HH 5.031 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Bissara-härkäpapukeitto aamiaiseksi

ID: pohjoisafrikkalainen-bissara. Alkuperäinen resepti: [reseptit/aamupalat/pohjoisafrikkalainen-bissara.md](../../../reseptit/aamupalat/pohjoisafrikkalainen-bissara.md). Lähde-SHA256: 1ff5c53d68cced68d1a56360dafccd38096f3192a2d0579cd79214362b9581a3.

**HOLD — ei koko reseptin GK:ta.**

- **kuivattuja härkäpapuja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A000416; saatavilla oleva HH 37.0 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Rahka-marjakerroskulho — sitruunamehun ja nimettyjen marjaproxyjen versio

ID: rahka-marjakerroskulho. Alkuperäinen resepti: [reseptit/aamupalat/rahka-marjakerroskulho.md](../../../reseptit/aamupalat/rahka-marjakerroskulho.md). Lähde-SHA256: c571f8f509bde4da9159bfdb4e1449f856030c9c92bf8a8ba1e2376d9c33c058.

**EHDOTUS / LOW — sisältö- ja menetelmähyväksyntä puuttuu.** Sitruunamehu korvaa kuoriraasteen, makeutusaine on 5 g nimettyä erytritolia. AFCD:n strawberry/blueberry ovat koostumusproxyja; metsämustikan puuttuvia polyoleja ei täytetä nollalla. GI 40 ja 53 ovat raakojen nimettyjen marjojen vertailuja. Kanadalaisen wild blueberry -lajikevertailun ja AFCD-koostumuksen yhdistäminen vaatii omistajan rajatun hyväksynnän. Hasselpähkinän saatavilla oleva hiilihydraatti 3,4 g/100 g sallii nykyisen nimetyn vähähiilihydraattisen oletuksen 50.

[Valmistus ja kaikki punnitut ainekset](versions/rahka-marjakerroskulho.md). Täsmällinen syötehash: b9f2c461ac4cb4ba7d860ee0c290c2d2d6b18bb8dc85e8c5c0ecc731daa4d296. Kaikki lähdekohtaiset GI-sovellukset ja koostumusproxyt ovat recipes.json- ja sources.json-tiedostoissa.

### Paahdettu siemengranola jogurtilla

ID: siemengranola-jogurtilla. Alkuperäinen resepti: [reseptit/aamupalat/siemengranola-jogurtilla.md](../../../reseptit/aamupalat/siemengranola-jogurtilla.md). Lähde-SHA256: 0ea4aec2500d7f974f28db074b912bcb4a2c987dc58f35c5de3ad736bbdd404e.

**HOLD — ei koko reseptin GK:ta.**

- **mantelilastuja**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F379; saatavilla oleva HH 6.6 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **vadelmia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A007619; saatavilla oleva HH 6.9 g/100 g; polyolit 0.1 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- Pienten mauste-/siemenosuuksien yhteinen hiilihydraattiraja ylittyy.

### Thaimaalaiset maissifritterit

ID: thai-maissifritterit. Alkuperäinen resepti: [reseptit/aamupalat/thai-maissifritterit.md](../../../reseptit/aamupalat/thai-maissifritterit.md). Lähde-SHA256: eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Appelsiini-oliiviöljykakku jogurtilla

ID: valimerellinen-appelsiini-aamiaiskakku. Alkuperäinen resepti: [reseptit/aamupalat/valimerellinen-appelsiini-aamiaiskakku.md](../../../reseptit/aamupalat/valimerellinen-appelsiini-aamiaiskakku.md). Lähde-SHA256: 0866699f37d32c4330e6b089ed1567ede7b9b64ddf7081012fa97d644e588bee.

**HOLD — ei koko reseptin GK:ta.**

- **vehnäjauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F110; saatavilla oleva HH 73.998 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

- **kuorittua appelsiinia**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F11045; saatavilla oleva HH 8.9 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### Letut – VHH

ID: vhh-letut. Alkuperäinen resepti: [reseptit/jalkiruoat/vhh-letut.md](../../../reseptit/jalkiruoat/vhh-letut.md). Lähde-SHA256: 0b2f9a1915de8d0f4558a5084a4011cc2ffa285a0fddcade8c9aec8be05bd94e.

**HOLD — ei koko reseptin GK:ta.**

- **mantelijauhoa**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus A006077; saatavilla oleva HH 5.4 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

### VHH-pyttipannu makkarasta ja kasviksista

ID: vhh-pyttipannu. Alkuperäinen resepti: [reseptit/paaruoat/pyttipannu-vhh.md](../../../reseptit/paaruoat/pyttipannu-vhh.md). Lähde-SHA256: 26af9ddeded6d62ac3822aefece70d29d5e4df0e8d33468966a9e1bc16b34df5.

**HOLD — ei koko reseptin GK:ta.**

- **vähähiilihydraattista makkaraa**: Koostumus tai kulutettu määrä jäi puutteelliseksi.

### Banh xeo -rapeat aamiaisletut

ID: vietnamilainen-banh-xeo-aamiaisletut. Alkuperäinen resepti: [reseptit/aamupalat/vietnamilainen-banh-xeo-aamiaisletut.md](../../../reseptit/aamupalat/vietnamilainen-banh-xeo-aamiaisletut.md). Lähde-SHA256: bd4fbd1c77bd3d5383e5986c71bc87e5b2c0c0fd6ac1faa8b660b300b7b2136d.

**HOLD — ei koko reseptin GK:ta.**

- **riisijauho**: Ainesosalle tai sen valmistusmuodolle ei hyväksytty riittävää GI-sovellusta tässä rajatussa lähdekatselmoinnissa. Koostumus F182; saatavilla oleva HH 79.3 g/100 g; polyolit 0.0 g/100 g. Tämä koskee yllä nimetyn ainesosan muotoa; puuttuva sidonta ei ole väite kaikkien mahdollisten lähteiden puuttumisesta.

## Lähde- ja laskentaperiaatteet

Tämä on rajatun lähdekatselmoinnin tulos, ei väite siitä, ettei muualla voisi olla soveltuvaa tutkimusta. Osittainen ainesosasumma tai tunnetut makrot eivät ole koko reseptin GK. HOLD-päätöksissä wholeGk ja julkaistavat kokonaismakrot jäävät nulliksi.

Finelin CHOAVL ja AFCD:n available carbohydrate without sugar alcohols ovat jo kuitua ja polyoleja vailla. Polyoleja ei vähennetä niistä uudelleen. Kokonaishiilihydraatti lasketaan saatavilla olevasta hiilihydraatista, kuidusta ja varmennetuista polyoleista. Lähteessä puuttuva polyoli pysyy puuttuvana. AFCD:n alkuperäinen Excel luettiin ja sen paritetut hiilihydraattikentät tarkistettiin; tietueita ei väitetä tänään verkosta ladatuiksi.

Nykyisen nimetyn vähähiilihydraattisen oletuksen 50 ehto on saatavilla oleva hiilihydraatti enintään 5 g/100 g. Mantelijauho 5,4, naudanmaksa 5,031, Finelin soijakastike 9,5 ja yleinen sinappi 14,1 eivät alita rajaa. Raja-arvoja ei pyöristetä hyväksyttäviksi. Kokonaisen pavun/pähkinän GI ei sellaisenaan todista jauhon, tahnan, taikinan tai sekaruoan GI:tä. Pienen mausteosuuden ehto on enintään 0,5 g saatavilla olevaa hiilihydraattia ainesosasta/annos ja enintään 1 g yhteensä. Sääntöä ei laajenneta jauhoihin tai tahnoihin.

Valmistus- ja identiteettikorjaukset koskevat vain tutkimuspaketin ehdotuksia: esimerkiksi tavallinen limetti ei ole AFCD:n native lime, Fineli 310 on maa-artisokka eikä peruna, ja paksoi ei ole kiinankaali. Nykyisiä reseptejä ei korvata hiljaisesti toisilla raaka-aineilla.


[Alkuperäislähteet, uudet lähdehavainnot ja rajoitukset](source-review.md). Uusi ihmis-GI-lähdelöydös ei yksin tuota kokonaisen reseptin GK:ta.

## Tehty varmennus

Muuttumattomalla mainin tyypitetyllä GK-moottorilla tarkistettiin yhteensä86 mallia (kaksi koordinaatio-HOLDia ilman rinnakkaismallia), niiden lähdesidonnat ja Golden-Decimal-vastaavuus. Lisäksi kaikki viisi numeerista versiota läpäisivät projektin neljän makron nutrition-evidence-tarkistuksen. verification.json tallentaa tämän erän tuloksen ja käytettyjen moottoritiedostojen hashit. Teknisesti PASS ei ole riippumaton tieteellinen hyväksyntä.

Toistettava, read-only tarkistus: python docs/nutrition/gk80-run10/verify.py. Se tarkistaa22 päätöstä, lähdetekstit ja hashit, koostumusten pääviitteet, kaikki skenaariot, riippumattoman Decimal-laskennan, viiden ehdotuksen neljä makroa sekä sen, että mainiin verrattu diff ja uudet tiedostot rajoittuvat tämän paketin hakemistoon. Tässä erässä tarkistetaan vain sen omat numeeriset versiot. Julkaistuja130 tulosta säilyttää muuttumaton aktiivinen laskenta; niitä ei laskettu uudestaan näillä tutkimusmalleilla.

Ei paikallista sivuston kokonaisbuildia eikä selaintestiä: sivuston koodi ja julkaistavat reseptit eivät muutu. PR:n normaali CI käynnistyy kerran lopulliselle HEADille; sen tilan voi tarkistaa PR:n Checks-näkymästä. CI:n mahdollinen build tarkistaa muuttumattoman runtime-aineiston, ei hyväksy tätä lähdetutkimusta.

## Katselmointiin tuotava päätös

Koko erä on valmis tämän rajatun katselmoinnin tuloksena arvioitavaksi. Julkaisuvaiheeseen etenemistä ei suositella nykyisellä saannolla. Omistaja voi arvioida nimetyt punnitut versiot ja menetelmärajaukset yhtenä kokonaisuutena; HOLD-aineisto pysyy erillään kaikista numeerisista tuloksista. Mahdollinen myöhempi integraatio, Ready, merge ja tuotantodeploy vaativat oman toimeksiantonsa. Uutta tutkimusajoa ei ole käynnistetty tämän paketin jälkeen.
