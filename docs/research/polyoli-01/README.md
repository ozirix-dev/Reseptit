# RESEPTIT GK-80 — POLYOLI-01 LOPPURAPORTTI

Päiväys 1.11.2026. **Päätös: PARTIAL.** Määrällinen tutkimus ja eristetty
prototyyppi ovat valmiit. **Tuotantosäännön yleiselle keventämiselle NO-GO.**
Suositus: lähdekohtainen jatkotyö (B), nykyinen julkaisuesto (A) siihen asti.
C on neljän ensisijaisen tapauksen tutkimuslista, ei hyväksytty julkaisupolku.

Puuttuvan polyolitiedon vaikutus voidaan erotella ja laskea ehdollisesti.
Pelkkä puuttuvan kentän olemassaolo ei osoita GK:n laskentakelvottomuutta.
Tässä aineistossa ei kuitenkaan löytynyt sääntöä, joka yksin oikeuttaisi uuden
reseptin julkaisemisen: lähdemääritelmä, neljä makroa ja muut hyväksymisportit
on käsiteltävä erikseen. **Uusia julkaistavia GK-arvoja tässä työssä: 0.**

## Lähtötila ja työn eristys

- Tarkoitettu repo `ozirix-dev/Reseptit`; origin
  `https://github.com/ozirix-dev/Reseptit.git`. Ravinto ei ole työn kohde.
- Etä-main tarkistettu ennen työtä ja ennen tulosten tallennusta:
  `5761afa069ea54c9d510f1cb3c1086ae7d42f998`, PR #152 yhdistetty.
- Oma puhdas worktree `D:/Projects/tmp/reseptit-gk80-polyol-policy-research`,
  haara `codex/gk80-polyol-policy-research`, luotu suoraan tästä mainista.
  Repo guard PASS molemmissa tarkistetuissa Reseptit-hakemistoissa.
- Toinen aktiivinen chat **Paranna Reseptit GK -laatua** käyttää
  `D:/Projects/tmp/reseptit-gk80-run9`-työpuuta ja muuttaa myös
  `site/scripts/gk80-food-catalog.json`-tiedostoa. Sen tila tarkastettiin
  vain lukemalla. Sen tiedostoja, raportteja, haaroja tai julkaisuehdokkaita
  ei muutettu, yhdistetty eikä rebasettu.
- Pages: HTTP 200 1.11.2026 klo 13.01 Suomen aikaa, **326 / 130 / 196**.
  HTML:n SHA-256
  `614c99774367a1d203e634fe87bc0a995159858f61ff16a16c8965cf4d6cef06`.
  [Nykyinen menetelmäsivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/).
  Mainin laskentapolku toistettiin lisäksi ilman sivustobuildia: samat 130/326.
- Config-oletukset `gpt-6.1-sol` ja `high` luettiin. Aktiivisen chatin mallia
  tai mahdollisia chat-kohtaisia reasoning-ylikirjoituksia ei saatu
  session metadatasta; niiden vaihtamisesta tai varmentamisesta ei esitetä väitettä.

## A. Nykyisen mallin analyysi

### Tietovirta

1. **Lähdetietue:** Fineli CHO/FIBT/POLYL, AFCD:n erilliset CHO-summat,
   USDA total-by-difference tai valmistajan EU-etiketti.
2. **Tulkinta:**
   [nutrition-batch-builder.ts](../../../site/scripts/nutrition-batch-builder.ts#L26)
   muodostaa lähdekohtaisen tietueen.
   [normalizeCarbohydrate](../../../site/scripts/nutrition-model.ts#L77)
   palauttaa erilliset `available`- ja `net`-kentät.
3. **Koostumus ja makrot:**
   [nutrition-model.ts](../../../site/scripts/nutrition-model.ts#L159)
   laskee tarkalla rationaalilaskennalla massat ja ravintoaineet. Tuntematon
   polyoli jättää `net`- ja kokonais-CHO:n puuttuvaksi.
4. **GI-sidos:** yleinen moottori käyttää lähde-, ruoka- ja valmistusavaimia;
   GK80-polku vaatii lisäksi hashit ja
   [eksplisiittisen ruokakatalogin](../../../site/scripts/gk80-food-safety.ts#L19).
5. **GK:** yleisessä polussa
   [normalized.available](../../../site/scripts/glycemic-load-model.ts#L276);
   GK80:ssa
   [valmiiksi normalisoitu availableCarbohydrate](../../../site/scripts/gk80-candidate-model.ts#L65).
   GK = Σ(massa / annokset / 100 × CHO × GI / 100).
6. **Julkaisu:**
   [gk80-release.ts](../../../site/scripts/gk80-release.ts#L10)
   lukee vain hash-lukitut rekisteripaketit. HELD-paketit eivät ole rekisterissä.
   Numeerinen `calculateCandidate()`-ehdotus ei yksin ole julkaisulupa.
   Julkaisun luottamus on LOW ja nimetyt oletukset kulkevat lähdeviitteissä.

### Eston tarkka sijainti

Yleistä “polyoli puuttuu → kaikki GK estetään” -sääntöä **ei ole**.
`EU_AVAILABLE` voi palauttaa tunnetun CHO:n ja `net:null`.
Yleinen GK käyttää CHO:ta, vaikka polyoli puuttuisi. Sen sijaan
`nutrition-model.ts:171–194` vaatii polyolin ja neton neljän makron
todisteelliseen julkaisuun. AJO8:n seulonta ja HELD-lista pidättävät paketit.
`gk80-release7.test.ts:35` varmistaa tämän pidätyksen ja rekisterin ulkopuolisuuden.

Seitsemän AJO8:n HELD-syötettä antaa nykyisessä `calculateCandidate()`-polussa
jo `numericProposal:true`. Polyolipuute on niiden **julkaisuaineiston esto**,
ei itse ainesosasumman suoritusvirhe. Näitä tutkimuslukuja ei julkaistu.
Palak paneerin ja nakkikeiton vanhat AJO6-syötteet pysähtyvät ensin
`UNREVIEWED_FOOD_PREPARATION`-porttiin; polyolin ratkaisu ei korjaisi sitä.

### Havaittujen tapausten erottelu

| Tapaus | Havainto ja koodikohta | Luonne |
| --- | --- | --- |
| Fineli/AFCD suoraan käytettävissä oleva CHO | `nutrition-model.ts:84,99–103`: kuitua/polyolia ei vähennetä uudelleen | Oikea tulkinta |
| EU-etiketti | `:85–88`: vain polyoli vähennetään; kuitu ei kuulu etikettikarboon | Oikea vähennys; tuntematon polyoli estää täsmällisen neton |
| US total, tunnettu polyoli | `:89–105` palauttaa `available=C−F`, `net=C−F−P`; GK käyttää ensimmäistä `glycemic-load-model.ts:277` | Toistettu latentti ohjelmavirhe suhteessa polyolit poissulkevaan GK-määritelmään |
| US kokonais-CHO ravintomallissa | `nutrition-model.ts:166,183–185`: `(C−F)+F+P = C+P` | Toistettu polyolin kaksinkertainen mukaanlasku kokonais-CHO:hon |
| US nollafiktio vältetty | Puuttuva polyoli jää `net:null`; USDA `total−fibre` ei osoita puhdasta käytettävissä olevaa CHO:ta | Perusteltu lähde-esto |
| AFCD kenttäparin erotus | `nutrition-batch-builder.ts:47–58` merkitsee erotuksen lähdevarmennetuksi | Johdettu malliarvo, ei kaikkien polyolien mittaus; provenance-käsitteen riski |
| EU etikettiproxy nimetään jo availableksi | HELD `maille-label-proxy` / `chicken-label-proxy` ja ainesosan tiukka available-tagi | Tutkimusoletus näkyy lähteessä, mutta ainesosatagin semantiikka on liian vahva tuotantoon |
| Tunnettu CHO mutta tuntematon P | `:94–103` pidättää myös neton suoraan available-lähteessä | Tarkoituksellinen tiukka julkaisupolitiikka; GK-aritmetiikka ja makrojen täydellisyys on erotettava |

US-koe on **synteettinen**, ei oikean tomaatin ravintosisältö: C=50, F=10,
P=20 g/100 g, massa 100 g, GI22. Todellinen ohjelma laskee GK8,8 eikä
polyolit poissulkevan mallin 4,4:ää; ravintomalli muodostaa kokonais-CHO70
alkuperäisen 50:n sijaan. [Toistettava koe ja tulokset](diagnostics.json).
Nykyisessä 504 tietueen `food-records.json`-aineistossa **0 US-total-tietuetta**.
Löydös ei muuta nykyisiä 130 tulosta. Erillinen korjaus tarvitsee myös
`glycemic-load-recipe-binding.ts:132–151`-hashin US-polyoliriippuvuuden tarkistuksen.
Tässä työssä sitä ei korjattu.

Sokerit ovat valinnaisia makrolaskennan kenttiä (`nutrition-model.ts:170–172`),
eivät GK:ssa CHO:n päälle lisättävä osuus. Tärkkelys ei ole erillinen
GK-syöte; se voi olla lähteen CHO-summan osa. Etanolia ei käytetä polyolina.
Yleisen mallin aiempi 1 g / yhteensä alle 2 g GI-osumattomien CHO-osuuksien
poisjättöpolitiikka on eri asia kuin tämän pilotin tuntematon polyoliosuus.
Sitä ei laajennettu eikä yhtäkään maustetta poistettu.

## B. Tietolähteet

| Lähde | CHO-määritelmä | Käytettävissä oleva CHO | Puuttuvan P:n seuraus |
| --- | --- | --- | --- |
| Fineli Release20 CHOAVL | Sokerit+tärkkelys; kuitu ja polyolit erillään | CHO suoraan | CHO tunnetaan; sivuston CHO+F+P-kokonaisarvo ei välttämättä tunneta |
| AFCD Release3 AVAILCHO | Lueteltujen käytettävissä olevien hiilihydraattien summa ilman sokerialkoholeja | AVAILCHO suoraan, lähteen johdantopoikkeukset tarkistaen | Puuttuva yksilöllinen polyoli ei ole nolla |
| AFCD AVAILCHOCNS | Edellinen + sorbitoli+mannitoli+glyseroli | Ei yleinen kaikkien polyolien kokonaismäärä | Kenttäparin erotus ei osoita erytritolia/ksylitolia/maltitolia mitatuiksi |
| EU-etiketti | Kuitu ei sisälly, polyolit sisältyvät | C−P, kun P on perusteltu | Tuntematon jako; kuitua ei vähennetä |
| US total / USDA by difference | Kuitu sisältyy; erotusluku ei ole analysoitu sokeri+tärkkelyssumma | C−F−P lähdemallin sisällä | C−F on vain polyolit sisältävä pooli, ei varmennettu netto |
| Matvaretabellen MI0181 | Sokerit+tärkkelys | CHO suoraan | Ei polyolimittausta eikä oikeutta päätellä kokonaispolyolia nollaksi |

Finelin määritelmä ja puuttuvien arvojen erottelu:
[THL:n tiedosto-ohje](https://fineli.fi/fineli/content/file/8), s.3.
Kenttä-ID:t 2034/2168/2260 ovat tämän repon Fineli-adapterin CHO/FIBT/POLYL-mappaus.
Nolla voi olla lähteen looginen tai historiallinen nolla, ei aina laboratoriomittaus.

AFCD:n yhtälöt varmennettiin alkuperäisestä
[Release3 Nutrient details -tiedostosta](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx),
sheet3. Etanoli on eri komponentti (ALC/ETOHM). Kenttäparin erotus voi olla
hyödyllinen **julkaistun koostumusmallin** arvo; yksilöllisten polyolirivien
puuttumista ei saa nimetä mitatuksi nollaksi. FSANZ myös sanoo erikseen,
ettei raportoimaton ravintoaine tarkoita sen puuttumista, ja että <LOR voi
näkyä nollana:
[AFCD:n johdanto, s.1 ja 3](https://www.foodstandards.gov.au/sites/default/files/2025-12/About%20the%20Australian%20Food%20Composition%20Database%20-%20Release%203.pdf).

EU:n määritelmät: [1169/2011 liite I](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169).
US-total ja pyöristykset: [21 CFR101.9(c)(6)](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9).
Näitä laskentakenttiä ei yhdenmukaisteta globaalilla vähennyksellä.

### Rajattu lähdetäydennys

- AFCD F006618: jauhettu mustapippuri, AVAILCHO=38,6 ja AVAILCHOCNS=38,6.
  F010466: **tuore** timjami, vastaavat 1,1/1,1. Primääri-API palautti samat
  hashit kuin lukittu lähde. Alkoholi0 on etanoli; yksilöllisiä polyoleja
  ei raportoitu. Timjamia ei korvattu kuivatulla F009160-tietueella.
- AFCD F010451 on tuore meirami (0,6 g CHO/100 g). Se ei kelpaa kuivattuun.
- Uusi oikean valmistusmuodon lähde löytyi:
  [Matvaretabellen 06.186, kuivattu meirami](https://www.matvaretabellen.no/en/marjoram-dried/).
  MI0181, CHO20,3; F40; proteiini12,7; rasva7 g/100 g. Sokeri4,1 ja
  tärkkelys16,2. Polyolimäärää ei ole. Kahta meiramitapausta koskeva
  ehdollinen lähdevaihto muuttaisi GK:ta vain +0,000020/annos, mutta koko
  tietue, valmistus ja GI-sidos on katselmoitava; lähteiden jakeita ei sekoiteta.
- [Matvaretabellen 06.177, kuivattu laakerinlehti](https://www.matvaretabellen.no/laurbaerblad-torket/)
  antaa CHO48,6/F26/proteiini7,6/rasva8,4 ja MI0181-määritelmän, mutta
  sokeri48,6/tärkkelys0-jakeistus eroaa odotetusta USDA-proxysta. Tämä
  lähdemääritelmä on uusi tarkistettava vaihtoehto, ei hyväksytty vaihtotietue.
- [Paneer01.301](https://www.matvaretabellen.no/en/cheese-paneer/): MI0181,
  CHO0 = sokeri0+tärkkelys0; P26, F24,5. `Alcohol0` on erillinen arvo.
  Puuttuvan polyolin ylärajaa ei johdeta tästä CHO0:sta. CHO-aritmetiikka
  on määritelty, kaikkien hiilihydraattijakeiden määrä ei.
- [Kivikylä EAN6406300045026](https://www.kivikylan.fi/tuotteet/paahdettu-kanaliemi/)
  vahvistaa 0,2 g CHO ja 0,2 g sokereita /100 **g**, kuitu1,1. Ei polyoleja.
  150 g punnittu liemi ei ole pieni maustemassa eikä 150 ml =150 g -oletus.
- Maille EAN8711200375684: valmistajan suora sivu palautti403, mutta
  [valmistajan 2025-tuoteluettelon](https://www.unileverfoodsolutions.fi/dam/global-ufs/mcos/nordics/finland/themes/tuoteopas-2025/UFS_2025_Tuoteluettelo_S%C3%A4hk%C3%B6inen.pdf)
  indeksoitu taulukko vahvisti C3,5/S1,9/F2/P7/rasva11 /100 g. Polyoli puuttuu.
  Suoralle403-vastaukselle ei keksitty sisältöhashia tai uutta tuotemittausta.

**Uusia todellisia polyolimäärän täydennyksiä: 0.** Suoraan available-CHO:n
määrittelevä vaihtoehto löytyi viiteen maustetapaukseen; niistä kaksi
meiramitapausta on selkein lähdejatkotyö, kolmen laakeritapauksen jakeistus
vaatii lisätarkistuksen. Paneerin määritelmä oli jo lukitussa aineistossa.
Näistä mikään ei yksin ratkaise neljää julkaisumakroa. Haku oli rajattu;
löytämättä jääminen ei todista ettei täydellistä lähdettä ole olemassa.

Polyolien täydellinen vähentäminen ei myöskään tarkoita, että kaikkien
polyolien fysiologinen GK olisi0. Alkuperäisessä ihmiskokeessa ksylitoli
ja laktitoli erosivat glukoosista ja toisistaan tulkittavassa GI-vasteessa:
[Natah ym.1997](https://pubmed.ncbi.nlm.nih.gov/9094877/).
Erytritoli ja ksylitoli antoivat erilaisen glukoosivasteen myös
[Wölnerhanssen ym.2016](https://pubmed.ncbi.nlm.nih.gov/27117004/).
Maltitolin vaste ei ollut nolla
[Felber ym.1987](https://pubmed.ncbi.nlm.nih.gov/3298708/).
Näistä ei johdeta yhteistä GI-ylärajaa tai automaattista annoskorjausta.

## C. Estyneet reseptit

[pilot-inputs.json](pilot-inputs.json) sitoo yhdeksän nykyistä HELD-pakettia
resepti-, lähde- ja bundle-hasheihin. Kaikki yhdeksän reseptilähdettä
vastaavat mainia. AJO7:n 27 lukittua bundlea luettiin Git-objektista
`f3777a8c423f4cb49eb67b0f2aca318aaebb7531`; vanhaa haaraa ei yhdistetty.

| Ryhmä | Itsenäiset unresolved lähde-identiteetit | Resepti–ainesosaesiintymät | Yksilölliset reseptit |
| --- | ---: | ---: | ---: |
| P1: kuivattu meirami / laakeri | 2 | 5 | 5 |
| P2: Maille Dijon | 1 | 2 | 2 |
| P3: Kivikylän liemi | 1 | 2 | 2 |
| P4: paneer | 1 | 1 | 1 |
| P5: itsenäinen muu este, päällekkäinen luokitus | 4 reseptikohtaista estettä | 4 | 4 |

P1–P4 yhteensä **5 lähde-identiteettiä, 10 resepti–ainesosaestettä, 9 reseptiä**.
P5 sisältää nakkikeiton/paneerin katalogisidokset sekä jerk-kanan/pav bhajin
valmistusesteet. Ryhmien reseptimääriä ei saa laskea yhteen uniikkina määränä.
Laajennettu vertailujoukko on11, joista9 polyoli-HOLDia ja2 muuta HOLDia.

Raakoja puuttuvia polyolikenttäesiintymiä on paketeissa23. Näistä13 on
AFCD-tietueita, joilla julkaistut with/without-kentät ovat tiedossa ja joiden
erotus täydennetään nykyisen projektimallin johdetuksi arvoksi ennen
yllä olevaa viiden unresolved-identiteetin laskentaa. Tämä **ei varmista
kaikkien polyolilajien mittausta** eikä oikeuta kenttäparin nollaa
merkittävän polyolimakeutuksen yleiseen ohitukseen. Kaksi checked-tietuetta
ja vanhat AFCD-proxyt tarvitsevat tämän provenance-täsmennyksen, eivät
uutta yleistä GI-oletusta.

Rajattu olemassa olevien laskenta-JSONien haku ei löytänyt muita uusia
puuttuvaa polyolimittausta yksin osoittavia tapauksia. Yleisen GK-inputin
77 reseptiä viittaa vanhaan food-recordsiin, jonka P on null:31 näistä
on jo numeerisia ja46 keskeneräisiä. Yhdenkään blocker-teksti ei ole suora
polyoliesto. Osa julkaistuista käyttää uutta rekisterikoostumusta vanhan
legacy-viitteen sijaan. **46 ei tarkoita 46 polyolilla ratkaistavaa reseptiä.**
Yhdeksän nykyistä varmistettua tapausta, **0 muuta varmistettua polyoli-only
HOLDia**. Kaikkien326 reseptin uutta lähdeauditointia ei tehty.

Jerk-kanalta puuttuu inkiväärijauhe laskentasyötteestä. Pav bhajin porkkanan
60/70 g ero ja soseutetun perunan valmistusanalogia ovat ratkaisematta.
Molemmat pysyvät HOLDissa polyolipolitiikasta riippumatta.

## D. Vaikutuslaskelmat

`m` on reseptin massa, `n` annokset, `q` tarkasteltavan lähdemallin
polyolin mahdollisesti sisältävä hiilihydraattipooli /100 g.

- Massaskenaario: `M=m/n`; pooli `Q=M*q/100`.
- GI-skenaariossa0…G koko poolin GK-leveys `W=Q*G/100`.
- Täysin massaan perustuva leveys `Wmass=M*G/100`.
- Kiinteällä vanhalla GI:llä polyolin uudelleenjako pienentää ainesosan
  käytettävissä olevan CHO:n osuutta enintään `Q*GIassigned/100`.
- Kokoreseptin skenaarion alaraja = vanha ehdollinen GK miinus **kaikkien**
  epäselvien ainesosien alkuperäiset osuudet; yläraja = alaraja+ΣW.

Skenaarion0…G voi tulkita koko poolin osuudeksi, kun sen käytettävissä olevien
hiilihydraattien ja polyolien kertoimet oletetaan kumpikin samaan sallittuun
alueeseen. Tämä on ehdollinen mallilaskelma, ei väite todellisesta GI:stä.
GI50/100/120/150 eivät ole todistettuja universaaleja enimmäisarvoja.
US-difference-pooli on koostumuslähteen malli, ei analyyttisesti todistettu
biologinen maksimipitoisuus. Ainesosan poisjättö aliarvioisi kokonaisuutta;
etiketti-CHO:n käsittely kokonaan tavallisena CHO:na voi ylittää sen
polyolit poissulkevan malliosuuden. Tuntemattomilla polyolivasteilla koko
mallivertailun suunta voi muuttua. Näitä ei niputeta yhdeksi virhesuunnaksi.

### Annoskohtaiset tulokset, vertailuskenaario G=150

| Resepti | Epäselvä massa g/annos | Pooli g/annos | W, koostumusskenaario | Wmass | Ehdollinen koko GK-alue |
| --- | ---: | ---: | ---: | ---: | --- |
| Jauheliha-kaalikeitto VHH | 0,100 | 0,020260 | 0,030390 | 0,150 | 4,578750–4,609140 |
| VHH-kaalilaatikko | 0,100 | 0,020260 | 0,030390 | 0,150 | 3,763267–3,793657 |
| Ropa vieja | 0,033333 | 0,016223 | 0,024335 | 0,050 | 3,337617–3,361952 |
| Siskonmakkarakeitto | 0,050 | 0,024335 | 0,036503 | 0,075 | 3,819925–3,856428 |
| Nakkikeitto kukkakaalilla | 0,050 | 0,024335 | 0,036503 | 0,075 | 5,373125–5,409628 |
| Jauhelihapihvit/Dijon5 g | 1,250 | 0,044375 | 0,066563 | 1,875 | 1,308275–1,374838 |
| Kana-parmesaanipannu/liemi150 g | 37,500 | 0,093750 | 0,140625 | 56,250 | 1,039045–1,179670 |
| Kermainen kanasienipannu/liemi150+Dijon15 g | 41,250 | 0,226875 | 0,340313 | 61,875 | 1,043395–1,383708 |
| Palak paneer/paneer250 g | 62,500 | Ei määriteltävissä CHO0:sta | HOLD | 93,750 | Vain massaskenaario1,153688–94,903688 |

Etikettitaulukon Q käyttää erikseen ilmoitettua desimaalipyöristysoletusta:
Dijon3,5→enintään3,55 ja liemi0,2→enintään0,25 g/100 g. **Nämä eivät ole
valmistajan vahvistamia maksimipitoisuuksia.** Liemen matalan arvon
ilmoituskäytäntö ja tuotevaihtelu jäävät auki. Taulukko ei käsittele etikettiä
mittaustuloksena. Neljän maustejatkokehitysehdokkaan pooli käyttää vanhoja
USDA-koostumuksia, ei norjalaisesta lähteestä ja USDA:sta yhdistettyä tietuetta.

Sokerit voivat teoriassa kiristää etikettipoolia: jos Dijon3,5 ja1,9
pyöristyvät kumpikin0,1 g tarkkuudella, `P≤Cmax−Smin=1,70 g/100 g`.
Liemelle sama oletus antaa0,10 g/100 g. Tätä pienempää rajaa ei käytetty
hyväksymisen perustana: taulukon arvot eivät ole riippumattomia tarkkoja
analyysejä. Täysi CHO-pooli säilyy herkkyysvertailussa.

[Komission pyöristys- ja toleranssiohjeen](https://food.ec.europa.eu/system/files/2016-10/labelling_nutrition-supplements-guidance_tolerances_1212_en.pdf)
taulukot1/4 erottavat pyöristyksen ja valvontatoleranssin. EU:n ilmoitettu0
voi olla enintään0,5 g/100 g eikä mitattu0. Alle10 g/100 g hiilihydraatille
yleinen valvontatoleranssi on ±2 g/100 g; se ei ole tuotteen fyysinen tai
tilastollinen yläraja. Jos stressiksi lisätään se pyöristyksen yläpäähän,
liemi saa2,25 ja Dijon5,55 g/100 g: liemipannun W on1,265625 ja
liemi+Dijon-pannun1,5778125, joista kumpikaan ei läpäise0,50-rajaa.
Tämä osoittaa, ettei pelkkä etikettidesimaali oikeuta automaattista vapautusta.

Laakeri on kaikkien kolmen lukitun **ehdotusversion** mukaan jauhettu ja
syödään. Alkuperäisen kokonaisen poistettavan lehden reseptiä ei hyväksytä
samaksi versioksi. Jos halutaan säilyttää poistettava lehti, tarvitaan
mitattu lisäysmassa ja uuttumisen skenaario0…koko lisätty määrä. Nollauuttoa
ei oleteta eikä punnittua versiota julkaista alkuperäisenä hiljaisesti.

## E. Pilotin tulokset

| Toimituksellinen W-raja /annos | Pelkkä ehdollinen koostumusbudjetti, G150 | Muut nykyiset GK-portit läpäiseviä | P1-tutkimuslistalla | Todella julkaistavissa |
| --- | ---: | ---: | ---: | ---: |
| 0,05 | 5 | 4 | 4 | 0 |
| 0,10 | 6 | 5 | 4 | 0 |
| 0,25 | 7 | 6 | 4 | 0 |
| 0,50 | 8 | 7 | 4 | 0 |

G50:n vastaavat pelkät budjettiluvut ovat7/7/8/8, G100:n6/7/8/8 ja
G120:n5/6/7/8. Kaikki16 vertailua sekä144 reseptiarviota:
[pilot-results.json](pilot-results.json). Pelkkä massaraja G150 tuottaisi
1/3/5/5 budjettiosumaa; tämäkin sisältää nakkikeiton muun sidosteen.
Lähdeperusteisen ja massaperusteisen oletuksen valinta siis vaikuttaa tulokseen.

Kaikkien kahdeksan koostumusskenaarion **julkinen0,01-tarkkuuden piste voi
muuttua**, mutta näytetty kokonaislukuteksti ja GK-luokka pysyvät samoina
nykyisillä ehdollisilla lähtöluvuilla. Tämä ei tee luvuista biologisesti
tarkkoja. Nakkikeiton pieni vaikutus ei poista puuttuvaa ruokakatalogisidosta.
Paneerille CHO0 ei rajaa tuntemattoman polyolin massaa; pidetään HOLD.

Kontrollit:3 nykyistä valmista reseptiä laskettiin riippumattomasti Decimalilla
kaikkine makroineen ja lähteen polyoleineen (tortilla, frittata, lohikeitto).
Lohikeiton10,457325 on todellinen lähellä luokkarajaa oleva lähtöluku;
siihen lisätty tuntematon on erikseen **synteettinen** kontrolli, ei todettu
puute. Lisäksi0,05-leveyden synteettinen10,00-rajan ylitys tunnistetaan,
vaikka ruudulla molemmat päät näyttävät10. Kymmenen pienen tuntemattoman
summa estyy. Nykyinen Foodin100 g polyolia/100 g -kontrolli, suuri tuntematon
makeuttaja ja CHO0 mutta tuntematon suuri polyolimäärä säilyttävät eronsa.

## F. Ehdotettu menetelmä

**Yleistä tuotannon hyväksymiskynnystä ei suositella tämän näytön perusteella.**
0,05 GK/annos G0…150-koostumusskenaariossa on perusteltu **jatkotutkimuksen
priorisointiraja**: se erottaa kaikki viisi pientä maustetapausta liemestä,
Dijonista ja paneerista. Suuremmat rajat lisäävät enimmäkseen tuote-etiketin
oletuksiin nojaavia tapauksia; niiden hyöty ei perustele automaattista sääntöä.
Jos vain massaskenaario hyväksytään, sama0,05 ei riitä molempiin meiramiversioihin
eikä kahteen neljän annoksen laakeriversioon. Tämän eron hyväksyntää ei piiloteta.

Prototyypin `MISSING_POLYOLS_BOUNDED` tarkoittaa vain, että **ilmoitetun
skenaarion** reseptikohtainen budjetti on laskettavissa ja läpäisee valitun
rajan. Se ei muuta P:tä0:ksi tai lisää reseptiä rekisteriin. Kaikki144
tulosta sisältävät `publicationEligible:false`. Neljä ensisijaista ovat
jauheliha-kaalikeitto, kaalilaatikko, ropa vieja ja siskonmakkarakeitto.
Viides maustetapaus nakkikeitto tulee mukaan vasta ruokasidoskatselmoinnin jälkeen.

Ennen mahdollista C-julkaisusääntöä omistajan pitää hyväksyä ainakin:
käytettävä lähdemääritelmä ja poolin peruste, koko reseptin yhteisbudjetti,
GI-skenaarion rooli, neton/kokonais-CHO:n erillinen epävarmuus, täsmällinen
valmistusversio, pyöristys ja luokkaraja sekä LOW-merkinnän sanamuoto.
Budjettitarkistus ei korvaa lähteen tai GI-sidoksen tarkistusta. Ei
tuoteryhmäkohtaista yleislupaa, ei tuntemattomien makeuttajien ohitusta.

## G. Turvallisuus

`null` säilyy syötteissä ja tuloksissa. Tunnettu lähteen0, lähteen johdettu0,
etiketin pyöristetty0 ja tuntematon erotetaan. Prototyyppi ei anna
käyttäjälle julkaisuvaltuutta edes erittäin väljällä budjetilla.
Massa, annokset, lähdeversio, määritelmä, puuttumisen syy ja skenaario
tallennetaan. Suuren P4-massan CHO0 ei anna pienuussääntöä.
Kaikki tuntemattomat lasketaan yhteen; epäselvä valmistus, puuttuva GI,
vanhentunut reseptilähde ja ruokakatalogisidos estävät tutkimuslistalle pääsyn.

AFCD:n suora available-arvo voi ratkaista **CHO:n määritelmän** ilman
polyolimittausta, mutta ei takaa muiden polyolien fysiologista osuutta tai
sivuston kokonais-CHO-makroa. Arvioitu koostumusproxy säilyy proxyna.
Skenaario ei ole biologinen epävarmuusväli. Olemassa olevia GI40/30/50-
sovelluksia ei laajennettu.

Tuotannon riskit, jos yleinen ohitus tehtäisiin: erytritolipitoisen CHO0-tuotteen
suuri massa, AFCD:n vain kolme polyolia kattavan erotuksen väärä yleistys,
etikettien pyöristyksen tulkitseminen täsmälliseksi, monen pienen puutteen
kasautuminen ja nykyisen ruokasidosportin ohitus. Tutkimuspolku ei koske
muihin resepteihin. [326 kokonaisen tulosobjektin hashit](main-baseline-hashes.json)
toistettiin muuttumattomiksi; kaikki vanhat130 numeerista säilyvät täsmälleen.

## H. Testit ja resurssit

- 12 prototyypin unittest-kontrollia PASS.
- 17 nykyistä kohdistettua testiä PASS: nutrition-model, gk80-food-safety,
  gk80-display. Mukana oikea Foodin-erytritolietiketti ja suuri polyolimassa.
- 144 Decimal-skenaariota verrattu erilliseen TypeScript Number-laskentaan,
  erot alle1e−12. Myös nykyinen käyttöliittymän formatter tarkistettiin.
- 9 HELD-lähtösummaa tarkistettu riippumattomalla Decimalilla lukituista
  ainesosista/GI:stä (ero goldeniin alle1e−14);3 valmiin reseptin makrokontrollia.
- Tuotantopolun326 tulosobjektia laskettiin ensin mainista ja uudelleen
  tutkimustiedostojen lisäämisen jälkeen;130 numeerista, kaikki326 identtisiä.
  Harness lukee alkuperäisen pilot-scriptin laskentavaiheen ja kirjoittaa
  vain erikseen nimettyyn scratch-hakemistoon. Generointia, kuvatyötä tai
  tuotannon lähdetiedostojen kirjoittamista ei tarvita.
- Yksi synteettisen US-tapauksen diagnostiikka paljasti kaksi virhettä.
  Kehityksessä täydennettiin kokeen pakollinen lähdemetadata ennen uusintaa.
  Tämä fixture-korjaus ei muuttanut tuotantokoodia tai johtopäätöstä.
- Ei kokonaista691-reittistä buildia, Bravea/Playwrightia, kuvia, deployta,
  uutta reseptierää tai tuotantomuutosta. Ei manuaalisia Actions-ajoja.

CI-valitsin tarkistettiin ennen julkaisutoimia: mikä tahansa uusi JSON
`docs/nutrition/**`-puussa käynnistäisi **fullPlan**-ajon. Tutkimus on siksi
erillisessä `docs/research/polyoli-01/`-puussa. Sen JSON/Python/Markdown/JS-
tiedostot luokitellaan docs-only: ei buildia, selainta tai julkaisua.
PR:n normaali kevyt selector-check voi silti käynnistyä. Valitsinta ei muutettu.

Toisto nykyisellä lukitulla main-pohjalla, riippuvuudet asennettuina:

```powershell
python -B -m unittest discover -s docs/research/polyoli-01 -p test_prototype.py -v
python docs/research/polyoli-01/prototype.py --output D:/Temp/polyoli-verify-results.json
node site/node_modules/tsx/dist/cli.mjs docs/research/polyoli-01/verify-model.mts D:/Temp/polyoli-verify-model.json
node docs/research/polyoli-01/verify-main.mjs --output-dir D:/Temp/polyoli-main-verify
```

Lähdehakujen URL:t, ajat, hashit ja epäonnistumiset ovat
[source-retrievals.json](source-retrievals.json). Raakaverkkodokumentteja ei
kopioitu repoon. Ei uutta testikehystä tai riippuvuutta.

## I. Projektin hyödyt

| Mittari | Tulos |
| --- | --- |
| Tutkitut nykyiset polyoli-HOLDit | 9 |
| Muut HOLD-kontrollit | 2 |
| Oikealla uudella polyolimäärällä kokonaan ratkaistut | 0 |
| Lähdemääritelmällä yksin julkaisuun vapautuneet | 0 |
| Suoran available-CHO:n määritelmän vaihtoehto | 5 maustetapausta; paneerin6. määritelmä jo tiedossa |
| Rajatun vaikutuksen P1-ehdokkaat | 5, joista4 läpäisee muut nykyiset GK-portit |
| Yhä julkaisu-HOLDissa | kaikki9 |
| Muu itsenäinen este polyoli-HOLDien sisällä | 2: nakkikeitto ja paneer |
| Muista syistä estyneet erilliset kontrollit | 2: jerk ja pav bhaji |
| Mahdolliset uudet GK:t | ensin4 ehdollista;5. vasta sidostarkistuksella; ei lupaus |
| Vanhojen130 vaikutus | 0; kaikki326 kokonaiset tulokset identtiset |

Neljä mahdollista lisäystä tarkoittaisi134/326 (41,10 %), viisi135/326
(41,41 %), jos kaikki muut lähde-, makro-, versio- ja omistajaportit myöhemmin
täyttyvät. Kolmen tuotereseptin lisähyötyä ei lasketa tähän realistiseen
ensimmäiseen erään; pelkkä väljempi0,50-skenaario ei tee niistä julkaistavia.

Kustannus–hyöty: neljää ensimmäistä varten kannattaa ensiksi täydentää
kahden maustelähteen semantiikka ja todistusketju. Yleinen interval-engine
vaatisi enemmän lähdetyyppejä, pyöristys-/toleranssimetadataa, yhteisbudjetin,
makro- ja luokkarajapolitiikan sekä tulevien makeutustuotteiden suojat.
Nykyinen UI osaa jo nimetyn skenaarioalueen, mutta polyolialueen merkitys,
luokat ja hakusuodattimet tarvitsevat oman hyväksytyn määritelmän. Sitä
ei kannata lisätä automaattisesti näin pientä ensierää varten.

## J. Omistajan päätös

| Vaihtoehto | Hyöty ja mahdolliset uudet GK:t | Riskit / lähdevaatimus | Tekninen työ | Vanhojen130 vaikutus | Suositus |
| --- | --- | --- | --- | --- | --- |
| A: nykyinen julkaisuesto | 0 uutta heti; säilyttää nykyiset portit | Pieni mauste voi pidättää hyödyllisen arvion | Ei muutosta | 0 | Säilytä toistaiseksi |
| B: vain lähdetäydennys ja lähdekohtainen tulkinta | 0 varmistettua heti; ensimmäinen kohde4+ehdollinen1 maustetta | Tarvitaan oikea kuiva/tuotemuoto, source-provenance, kokonais-CHO:n ratkaisu; paneeria ei vapauteta CHO0:lla | Pieni–keskisuuri; uusia lähdetietueita, ei globaalia ohitusta | Rajattava0:aan | **Ensisijainen seuraava työ** |
| C: rajattu määrällinen vaikutus | 4 ensisijaista+1 sidosehdollinen, jos kaikki muut portit ja omistajan menetelmäpäätös täyttyvät | Source-model-pooli ja valittu GI-alue eivät ole biologinen raja; neljä makroa ratkaistava | Keskisuuri; tarkka reseptikohtainen override/meta, ei vielä UI-muutosta | Regressiolla0 | Tutkimusvalmis, ei vielä tuotantosääntö |
| D: erikseen hyväksyttävä skenaarioalue | 8 ehdollista koostumusvertailua voidaan esittää tutkimuksessa; paneerille vain leveä massaskenaario | Etiketin todelliset toleranssit ja polyolien vasteet auki; voi johtaa väärään varmuuteen | Suurin; käyttäjätekstit, luokitus ja suodatinkäytös hyväksyttävä | Vaatii erillisen0-regression | Ei ensivaiheen toteutusta |

Yksi selkeä päätösehdotus: **hyväksy B-jatkoselvitys neljälle ensisijaiselle
maustetapaukselle ja nakkikeiton erilliselle sidostarkistukselle; säilytä
A:n julkaisuesto. Älä hyväksy yleistä polyolin puuttumisen ohitusta tai uutta
GK-pistearvoa tämän raportin perusteella.** Jos kokonais-CHO:n täydellistä
lähdettä ei löydy, tuo C:n rajattu makro-/GK-käsittely erikseen päätettäväksi.

## K. Seuraava toteutusvaihe

Ehdotettu **erikseen hyväksyttävä** korjaus-PR:
`GK80: viiden mauste-HOLDin lähdemääritelmät ja julkaisukelpoisuuden erottelu`.

1. Lukitse uusi senhetkinen main ja tarkista toisen GK-ajon mahdolliset
   sidospäivitykset. Ei tämän haaran synkronointia toisen ehdokkaan päälle.
2. Aloita vain jauheliha-kaalikeitosta, kaalilaatikosta, ropa viejasta,
   siskonmakkarakeitosta ja nakkikeitosta. Meiramin06.186 on oikea kuivattu
   vaihtoehto; laakerin06.177 jakeistus on ensin selvitettävä. Vaihtoehtona
   täydellinen kansallisen tietokannan tai valmistajan tietue.
3. Erottele lähteen available-CHO:n kelpoisuus, polyolin tiedon tyyppi ja
   kokonais-CHO:n julkaisukelpoisuus. Puuttuva P pysyy nullina. Älä käytä
   sivuston vanhaa etiketin tai AFCD-parin arvoa “mitattuna nollana”.
4. Jos neljä makroa eivät ratkea lähteellä, pysähdy julkaisuvaiheeseen ja
   tuo täsmällinen C-ehdotus omistajalle. Enintään0,05/skenaario0…150 on
   vain tutkittu lähtökohta. Ei tuotantopistettä ilman hyväksyttyä
   menetelmää ja neljän makron näyttöä.
5. Nakkikeiton F7600-r6-sidos ja muut nykyisen katalogin seuraavat mahdolliset
   portit tarkistetaan kokonaan. Yhden ensimmäisen virheen korjaus ei
   todista kaikkia loppuja sidoksia hyväksytyiksi.
6. Erillinen pieni tekninen korjaus-PR US-normalisoinnille ja total-CHO:n
   kaksinkertaiselle polyolille: ei sekoiteta viiden reseptin julkaisuun,
   koska nykyisiä US-lähteitä ei ole käytössä. Muutos tarvitsee läpi
   normalisoinnin, GK:n, kokonais-CHO:n ja evidenssihashin ulottuvan kontrollin.

Tämä tutkimus ei avaa uutta reseptierää, muuta ruokaperhesuojaa, julkaise
pilottialueita, muuta aiempia GK-arvoja tai anna merge-/deploy-lupaa.
