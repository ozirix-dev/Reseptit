# F25 – kahdeksan ruokalajikohtaista FI-näyttöoikaisua (10.11.2026)

Työerä [F25 #399](https://github.com/ozirix-dev/Reseptit/pull/399) tarvitsee kelvolliset FI-ohjeet ennen kielijulkaisua. Tässä PR:ssä korjataan kahdeksan aiemmin julkaistun reseptin *julkinen suomenkielinen esitystapa* olemassa olevalla SHA-256-lukitulla projektorilla. Raaka-FI, ravintolaskennat, GI/GK-lähdesinetit ja julkaisukielirekisteri säilyvät byte-identtisinä.

- `karibia-mango-limejogurtti`: Git blob `a0d8cdb2ae4aaa9733903b643941d984a788c260`; raw SHA-256 `91fcf9425bb58e499304414a99665cc01ba7c37a1a72115262d31e04b5c93a0f`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty.
- `japanilainen-hojicha-jogurtti-persimonilla`: Git blob `bba0051aba98ebf8ce1845a1df5bccc058394aba`; raw SHA-256 `cae50573ff18898460b95e9c674d0bc39514c7cbaaaa502d4008171b14261cfe`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty. Virheellinen valmistustapa korjattu.
- `lahi-ita-pistaasijogurtti`: Git blob `8d417c3c8972507895dbd91c325bcd480695e11a`; raw SHA-256 `f9a1d41f86c92902bbda7c9f224cbc8de48900ec7726625a482f1ecea794a9e1`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty. Virheellinen valmistustapa korjattu.
- `vietnamilainen-kahvijogurtti-banaanilla`: Git blob `4f215df58a68fe86d5c03a7d11c7fc516f823d3f`; raw SHA-256 `73b5dbb717f3833c8354f1fcdfa0fdd86ca78a342d50625881133e44b3aba0e3`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty.
- `valimerellinen-jogurttikulho-hunajalla`: Git blob `283840ebf2620cf7e4ad684e7470b99ecf19fa21`; raw SHA-256 `d3b3fa89bf9fe3a4b04e70d3a0d0f8f4fbd957dec2a57cd786cbe8a0af00e0bb`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty.
- `kiinalainen-soijamaito-aamiaisella`: Git blob `2eede161a4c9a8f3b42a6dced6eaf2e133ce96c2`; raw SHA-256 `e28b598683b1a561384eb300f6bd08d0a7603a8c2b7dc922b19ce569a51067cf`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty. Virheellinen valmistustapa korjattu.
- `korealainen-gyeranbap-riisikulho`: Git blob `9955dbbce84566bb1967f86ab19c75eb3c3379af`; raw SHA-256 `e9ee2e939778d57fafd4b9015b88a7b59669638f522ae7253446f531861034e8`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty.
- `lahi-ita-zaatar-munat`: Git blob `cf0c02b2b1ecd1200557271c2bc574f2ad1c2c71`; raw SHA-256 `2abaf61e4abd891bb20d3372d24fb45150566a7ff4b1750dd6db976fda0e4924`. Neljä yleisohjetta korvattu neljällä täsmällisellä valmistusvaiheella; ruoan annokset ja punnitukset säilytetty.

## Laaturajat
- Jokaisessa käytetään vain FI-lähteen punnittuja ainesosia ja koko ilmoitettu määrä; ei papu-/tofu-/lihatekstejä kylmäruokaan, ei luettelematonta seesamiöljyä riisikulhossa.
- Hojicha käyttää koko 2 g hyvin hienoksi jauhettua teetä eikä pois siivilöityä uutetta; käytettävän teen syötävyys ja ravintolaskennan vastine vaativat erillisen lähdekatselmoinnin.
- 200 ml kahvia + 100 g jogurttia tuottaa juotavan notkean annoksen, ei paksua jogurttikulhoa; yhden banaanin syötävä grammapaino ja kondensoidun maidon tuotetyyppi ovat lähdetarkistuksessa.
- Soijajuoma voi juoksettua vain osittain; valmistus ei takaa tiettyä rakennetta. Käyttötapa `kuumentaminen`, ei `paistaminen`.
- Osa alkuperäisistä laskentatiedoista on yksikkö- tai GI/GK-arvioita. Kirjallinen oikaisu ei ole ravinto-/GI/GK-uusintatarkastus.

Testi vaatii 14 alkuperäis-SHA:ta, täsmälliset YAML-punnitukset/annokset/makrot/kuvat sekä neljän vaiheen näyttöohjeet ja vanhojen geneeristen virheiden poistumisen. Odottamaton alkuperäistiedoston muutos pysäyttää tuotannon (fail closed).

**Ei EN/SV/TH-kielijulkaisua tässä PR:ssä.** E20 ja F25 pysyvät erillisinä Draft-työjonoina, ja jokaisen lähteen julkaisuvaltuus vaatii erillisen hyväksynnän. Tämä on AI:n kirjallinen kokkikatselmointi; fyysistä koepaistoa tai ihmisarviointia ei väitetä.

## Yhdeksäs rajattu oikaisu

- `rahka-marjakerroskulho`: FI raw blob `af3a8debe0a46b920ed0464545732bd2900485b8`, normalisoitu SHA-256 `38ed90a415a871e64593e65b63bc46171b2fecf2bc5ff05a3a67690eae81b8e6`; julkinen `cooking_method: kypsentäminen` → `kylmävalmistus`. Kaikki neljä alkuperäistä vaihetta, 4 annosta, 250 g rahkaa, 100 g jogurttia, 150 g marjoja, 20 g hasselpähkinää ja ravintoarvot säilyvät ennallaan. Ei kuumennusta.
