# AAMURAPORTTI — GK80 OPERAATIO 141

Päiväys 2.11.2026. Repository `ozirix-dev/Reseptit`.
Main-pohja `583fdb91aeb12114f909412b9165fc3b02a6515d`.

## A. Päätös: PARTIAL

30 reseptiä käsiteltiin kokonaisina kuudessa enintään viiden reseptin ryhmässä.
Syntyi **15 uutta numeerista katselmointiehdotusta / 17 nimettyä skenaariota**.
Kymmenen ehdotuksen koostumusesteet ratkesivat nykyisillä lähde- ja PI-säännöillä;
viidessä tarvitaan erityinen valmistus-/koostumusvastaavuuden katselmointi.
Kaikki tulokset ovat LOW-luottamuksen malliarvioita.

**Paketti on sisältö- ja lähdekatselmointiin tarkoitettu Draft-aineisto.
Sivuston julkaisuintegraatiota ei ole tehty. Julkaisuvalmiita integraatioita on 0.**
Vähintään 30 syvätapauksen ja 15 numeerisen ehdotuksen tavoitteet saavutettiin;
vähintään 10 julkaisuvalmiin integraation tavoite jäi saavuttamatta.
Uusia täsmällisiä versioita ei ole merkitty omistajan hyväksymiksi.
Pelkkä moottorin `CALCULATED`-tulos ei todista lähdevastaavuutta tai julkaisulupaa.

## B. Kattavuus

| Tila | Määrä | Osuus 326 reseptistä |
| --- | ---: | ---: |
| Tuotannosta tämän ajon alussa varmennettu | 133 | 40,80 % |
| Tämän Draftin aktivoima lisäys | 0 | 0 % |
| Uudet numeeriset katselmointiehdotukset | 15 | 4,60 prosenttiyksikön mahdollinen lisäys |
| Hypoteettinen kattavuus kaikkien 15:n myöhemmän hyväksynnän ja integraation jälkeen | 148 | 45,40 % |
| Julkaisuvalmiit uudet integraatiot | 0 | 0 % |

148/326 ei ole tämän haaran eikä tuotannon kattavuus. Nykyiset reseptit,
aktiiviset laskenta- ja lähdeaineistot sekä julkaisuregisterit säilyvät mainin mukaisina.
Lähtövarmennuksen HTTP200 ja 326/133/193 ovat [production-start.json](production-start.json)-tiedostossa.

## C. Käsittelyn syvyys

- Syvällisesti käsitellyt: **30**. Uusia pintaseulonnan tapauksia: **0**.
- Priorisointi: aiemmat 23 lähes valmista SOURCE_HOLD-tapausta, Kaya sekä kuusi
  ennalta tunnistettua vaikeaa tapausta. Uutta satunnaista inventaariota ei tehty.
- Jokaisesta luettiin julkaistu ainesosaluettelo ja valmistus, annosmäärä sekä
  saatavilla ollut aiempi punnittu versio, koostumus- ja GI-sidos.
  [recipe-audits.json](recipe-audits.json) säilyttää koko 30 reseptin aineksen,
  valmistustavan, nykyisen tekstihashin, uuden kysymyksen ja päätöksen.
- [queue.json](queue.json) erottaa kaikki kuusi käsittelyryhmää. Ryhmäkohtaiset
  `batch-N.json` ja `batch-N-results.json` säilyttävät syötteet ja moottorin tulokset.

## D. Numeeriset ehdotukset

Luvut ovat sisäisiä kahden desimaalin laskentatuloksia. Ne eivät ole väite
lähtötietojen kahden desimaalin tarkkuudesta eivätkä valmiita julkisen kortin näyttölukuja.
GK:n puuttuvat pienet osuudet on kirjattu erikseen, eivätkä ne ole nollia.
Makroja ei ole laskettu uudelleen eikä vanhoja makroja hyväksytty uusille versioille.

**S = koostumuksen osalta lähderatkaistu, omistajan täsmällisen version ja PI-sovellusten katselmointi avoin.
E = lisäksi erityinen valmistus-/koostumusvertailun katselmointi. Kumpikaan ei tarkoita julkaisuvalmista integraatiota.**

| Resepti | GK/annos | Pois rajattu CHO tai sen lähdemallin yläraja, g/annos | Tila |
| --- | ---: | ---: | --- |
| Ratatouille | 4,63 | 0,183 | S |
| Sitruuna-yrttikana ja parsa | 0,98 | 0,746 | S |
| Menemen | 2,77 | 0,125 | S |
| Tomaatti-kananmuna-wokki, kuuma jasmiiniriisi | 24,24 | 0,842 | E |
| Shakshuka, mieto paprikaversio | 3,31 | 0,657 | S |
| Munatacot eli huevos rancheros, paprikaversio | 1,76 | 0,500 | S |
| Paprikainen VHH-gulassi, noin 40 % smetana | 3,52 | 0,571 | S |
| Caponata ilman leipää | 6,12 | 0,110 | S |
| Pasta alla Norma, penne/parmesaani, De Cecco -vertailu | 30,05 | 0,450 | E |
| Carnitas-salaattitacot, kaikki hedelmäliha ja kastike | 2,13 | 1,291 | E |
| Döner, punnittu pita ja raaka valkokaali | 18,81 | 0,415 | E |
| Marokkolainen couscous, uusi broilerisuikale-/säilykekikherneversio | 33,91 | 0,664 | E |
| Janssoninkiusaus juuriselleristä, valutettu öljy-anjovis | 3,05 | 0,048 | S |
| Täytetyt paprikat, tomaattimurskaversio | 4,08 | 0,204 | S |
| Rogan josh, kaikki jauhetut mausteet syödään | 1,11 | 1,803 | S |

Kaksi muuta nimettyä skenaariota: wokin **basmatiriisiversio 20,84**, Norman
**Barilla-pennevertailu 31,79**. Niitä ei lasketa uusiksi resepteiksi, keskiarvoisteta
eikä esitetä fysiologisena epävarmuusvälinä. Skenaarioiden sisältö ja koko lähde-
/syöte-/valmistusaineiston `evidenceBundleSha256` ovat ryhmätiedostoissa.

Viiden E-tapauksen erityisrajaukset:

- Wokki: Finelin yleinen kypsä riisi on erillinen koostumusproxy kuumalle
  jasmiini-/basmatiriisille. Vennin eurooppalaisen ryhmän GI68/57 ei ole paistetun,
  jäähdytetyn tai kaikkien riisien GI. Riisi sisältyy koko annokseen.
- Norma: nimettyjen pennejen GI47/50, ei pastaperhekeskiarvo49.
  Kuivan durumkoostumuksen käyttö valutetulle keitetylle tuotteelle on erillinen
  LOW-proxy; liukenemishävikkiä ei keksitä. Parmesaniversio korvaa ricotta salatan.
- Carnitas: navel-appelsiinin raakaa ihmistutkimuspistettä sovelletaan kypsennettyyn,
  kokonaan syötävään hedelmään LOW-valmistusanalogiana. Se ei ole kypsän appelsiinin mittaus.
- Döner: valkoisen minipitan GI68 on tuotekohtainen vertailu; yleinen pita ja sen
  lämmitys eivät ole kyseinen tutkimuserä. Raaka kaali korvaa määrittelemättömän salaatin.
- Couscous: nykyinen punnittu versio käyttää broilerisuikaletta, Finelin
  couscouskoostumusta sekä säilykekikherneitä. San Remo GI65 ja Edgell GI35 ovat
  nimetyt vertailut; geneerinen koostumus ja kikherneen uudelleenkuumennus ovat
  erillisiä LOW-sovelluksia, eivät mitattu valmis annos.

## E. Yhteiset ratkaisut ja lähdehavainnot

1. **Finelin itsenäinen CHOAVL.** Projektin nykyinen menetelmä määrittelee sen
   tärkkelyksen ja sokereiden summaksi. Nykyinen GK-moottori kuluttaa `available`-
   arvoa; tuntematon SUGOH voi jättää `net`- ja kokonais-CHO:n avoimeksi ilman,
   että lähteistetty CHOAVL muuttuu tuntemattomaksi. Tämän vuoksi esimerkiksi
   valkosipulin, yrttien, smetanan ja mausteiden Fineli-sidokset tutkittiin uudelleen.
   Tämä ei ole AFCD:n puuttuvien kokonaispolyolien nollaus eikä PR168:n US-korjauksen
   ennakkoon käyttöönotto. SUGOH/FIBT:n puuttuvat arvot säilyvät `null`-arvoina.
2. **Nykyinen GK-poisjättösääntö.** Tunnettu positiivinen CHO-osuus on yksittäin
   alle 1 g/annos ja kaikki poisrajaukset yhteensä alle 2 g/annos. Tasan raja estää.
   Lähdeylärajan käyttö on moottorissa jo olemassa. Tässä ei muutettu rajoja,
   keksitty GI100-kattoa eikä laskettu tuntemattoman GI:n kliinistä enimmäisvaikutusta.
3. **USDA:n kokonais-CHO ylärajana.** Mausteiden, kapristen ja parmesaanin
   kokonais-CHO voi kattaa myös kuidun ja tuntemattomat polyolit. Se kelpaa
   konservatiiviseen lähdemallin CHO-kattoon, ei todelliseksi A-pisteeksi.
   Limetin kattoa kiristetään saman tietueen tunnetulla kuidulla: C−F sisältää
   edelleen tuntemattomat polyolit eikä ole todellinen imeytyvän CHO:n piste.
   Anjoviksen lähteessä ilmoitettu total0 tukee vain lähdemallin A0:aa; se ei ole
   väite laboratorion täydellisestä nollasta tai keksitty aggregate-polyoli0.
   Mallin nimelliset lähdearvot eivät ole tuote-erien tai ihmisvasteen ylärajoja.
4. **Kikherne GI35.** Alkuperäisen 2021-liitteen s87/r1284 on Edgellin valutettu
   säilykekikherne, Australia2018, n12, glukoosiviite, GI35±3.
   Vanhempi saman merkin r1285 GI38±3 säilyy vertailutietona; niitä ei yhdistetä
   perhekeskiarvoksi. Uudempi ja suurempi koe valittiin ennalta kuvattavana
   lähdevalintana. [Alkuperäinen julkaisu](https://doi.org/10.1093/ajcn/nqab233).
5. **Kaksi aiempaa hakupäätelmää tarkentui:** taulukossa on ANCO/Soubry-lyhyt
   makaroni GI63±3, r1492 (jatkovalmistus vielä avoin), ja GI51/r1799 on nimenomaan
   keitetty butternut. Niitä ei saa enää kirjata puuttuviksi vain yleisen GI-haun perusteella.
6. **Keto ja tangyuan:** mantelijauheen [ateriakoe](https://pmc.ncbi.nlm.nih.gov/articles/PMC3042001/)
   ei ole puhtaan mantelijauhon GI-mittaus. [Tahmean riisin ihmiskoe](https://www.spkx.net.cn/CN/10.7506/spkx1002-6630-201617038)
   koskee muita riisi-/kakkumuotoja; tangyuanin in vitro eGI ei korvaa tämän reseptin
   ihmis-GI:tä. Näistä ei johdettu uusia numeerisia arvoja.

Lähteet, raakakentät, Finelin viitehashit ja GI-kortit ovat [sources.json](sources.json)-tiedostossa.
PDF:n todellinen binäärihash on `e930c4a...`; vanha `69deea1...` on saman tiedoston
CRLF-normalisoitu hash. Tämä hashkäytäntöjen ero ei tarkoita eri GI-taulukkoa.

## F. Toteutus ja varmennus

- Yksi uusi main-pohjainen haara `codex/gk80-operation141`, yksi koottu Draft.
  Kaikki tämän ajon pysyvät tiedostot ovat tässä tutkimus-/katselmointipaketissa.
- Mukana 15 reseptin koko syötteet, 17 moottoritulosta, GI- ja koostumuslähteet,
  täsmälliset punnitut versiot, koko evidenssin hashit, 30 tapauksen päätösloki ja
  seuraava priorisoitu jono. Uusi hyväksyntä ei ole periytynyt vanhoilta PR-haaroilta.
- Nykyisellä muuttamattomalla GK-moottorilla kaikki 17 skenaariota `CALCULATED`, LOW.
  Riippumaton Decimal tarkisti kaikki 17 arvoa, pyöristykset, poisrajaussummat,
  kokonaiset evidenssihashit, viitearvot ja puuttuvien tietojen säilymisen:
  [independent-check.json](independent-check.json), PASS.
- Ei tuotantokoodin, reseptien, Golden-aineistojen, aktiivisten lähteiden,
  julkaisuregisterien tai hyväksyntärajojen muutoksia. Vanhojen 133 tuloksen
  säilyminen perustuu muuttumattomiin laskenta-/reseptitiedostoihin; uutta koko
  326 reseptin laskentaa tai tuotantojulkaisua ei väitetä tehdyksi.
- PR168 ja169 säilyvät erillisinä Draft-hankkeina samoissa HEADeissa. Niiden
  korjauksia ei tuotu haaraan. ReportHubiin ei tehty muutoksia.
- Commitin ja PR:n lopulliset tunnisteet ovat tämän Draftin GitHub-näkymässä.

## G. Jäljellä olevat esteet

**15 HOLD-tapausta:** jauheliha-makaronilaatikko, bulgogi, bún chả,
congee, kabocha/myskikurpitsapuuro, rahka-marjakulho, kahvijogurtti,
halloumi-tomaattileipä, Kaya, punainen kanacurry, keto-suklaakeksit,
keto-mutakakku, tangyuan, masala dosa ja vada pav.

Esteet eritellään reseptikohtaisesti [päätöslokissa](recipe-audits.json).
Muun muassa Fineli-soijakastike60g/4 =1,425g A/annos ei mahdu yksittäisrajaan;
mustikka50g/4 Fineli35596 =1,565g A/annos ei myöskään mahdu.
Masala dosan ilmoitettu sinapinsiemen150g/2 ei ole jälkikäteen korjattu1,5grammaksi.
Vada pavin chutney ja sämpylän massa ovat edelleen auki.
Mantelijauhon ja suklaan puuttuvia tietoja ei peitetty kaakaon onnistuvalla
pienosuuden rajauksella. Keto-makropidätys, teehaudutetut munat ja aiemmat HOLDit säilyvät.

Kymmenen S-tapauksen joukosta viidellä on jo makroevidenssi: sitruuna-yrttikana,
gulassi, caponata, juuriselleri-Jansson ja rogan josh. Nykyinen `nutrition-evidence.ts`
sitoo sen ainesosanimien, määrien, yksiköiden ja annosten hashiin; `nutrition-audit.ts`
--strict estää ristiriitaisen aineiston. Uutta GK-versiota ei voi julkaisuintegroida
siirtämällä vanhoja makroja tai päivittämällä niiden hashia ilman sisältövarmennusta.
[Tarkka integraatioportti](integration-gate.json) nimeää kaikki kymmenen tapausta.
Tämä arvio perustuu nykyisen tarkistimen lukemiseen, ei väitettyyn uuteen full-build-ajoon.

Numeeristen 15 ehdotuksen jatkotyö on vielä konkreettinen julkaisuintegraatio:
hyväksyttävän version valinta, resepti-/käännösvastaavuus, nykyisen julkisen GI-
selitteen PI/MS-merkinnät, muuttuneiden makrojen käsittely ja koko julkaisupolun
regressio. Niitä ei korvata tämän erillisen laskentapaketin PASS-merkinnällä.

## H. Seuraava täsmällinen jono

1. **Tämän paketin 10 S-tapausta:** yksi eräpäätös täsmällisistä evidenssihasheista;
   sen jälkeen yhteinen main-pohjainen julkaisuintegraatio ja tarvittava CI.
2. **Viisi E-tapausta:** wokin riisikoostumus, Norman keitetty penne, carnitasin
   kypsä appelsiini, lämmitetty pita ja couscousin säilykekikherne/koostumusproxy.
   Päätä rajauksista yhdessä; ei uutta laajaa seulontaa.
3. **Jauheliha-makaronilaatikko:** hae r1492:n alkuperäistutkimus/ref80 ja
   varmista keitto- ja uunivaihe. Uusi nimetty GI63-lähde on todellinen johtolanka.
4. **Bulgogi:** tutki Kikkomanin valmistajan3,2g/100ml lähdekatto nimenomaisella
   tilavuusversiolla; ei g/ml-oletusta. Varmista myös päärynän kypsennys:
   r1160/1161 Williams-raaka GI24/33 ei suoraan mittaa marinadissa paistettua päärynää.
5. **Bún chả:** varmista Squidin täsmällisen EU-tuotteen per100g/per100ml-perusta
   ja yhdistä koko120g kalakastike yhdeksi ainesosabudjetiksi. Älä jaa rajaa
   keinotekoisesti marinadiin ja dippiin. Selvitä fariinisokerin itsenäinen A.
6. **Butternut-puuro:** GI51 on jo löytynyt; seuraava kysymys on tarkka
   koostumus sekä riisi-/kookosversion valmistus, ei uusi yleinen pumpkin-GI-haku.
7. **Rahka-marjakulho:** tarkka mustikkalaji ja sitä vastaava lähde.
   Kanadan wild blueberry GI53 ei automaattisesti kata metsämustikkaa tai highbushia.

## I. Resurssit ja uusinta

Käytettiin olemassa olevia alkuperäisiä PDF/XML-/USDA-arkistoja sekä kohdennettuja
valmistaja- ja tutkimushakuja. Ei npm-asennusta, paikallista sivustobuildia,
691 reitin buildia, uutta koko326 laskentaa, Actionsin manuaalista käynnistystä
tai päällekkäistä Codex Review'ta. Numerot toistettiin lopullisten koko-evidenssin
hashien lisäämisen jälkeen; tämä ei ollut uusi tutkimuserä.

Paikallinen tarkistus: nykyinen GK-moottori17 skenaariolle ja riippumaton
Decimal17/17, 20 lähdekaton käyttöä, 14 puuttuvan polyoliprofiilin esiintymää
ryhmäaineistoissa. Lähdekenttien nollia ei täydennetty. Normaali Draft-PR:n CI
käynnistyy kerran automaattisesti, ja sen todellinen tila raportoidaan loppuviestissä.

Uusinta tarvitsee projektin normaalin Node/tsx-ympäristön. Aja `evaluate.mts`
antamalla `OP141_REPOSITORY` ja `OP141_PACKAGE` osoittamaan tarkistettuun checkoutiin
ja tämän paketin **erilliseen scratch-kopioon**; tulokset kirjoitetaan pakettihakemistoon.
Sen jälkeen `python validate.py <repo-root> <scratch-package>` tarkistaa Decimalin.
Älä aja kumpaakaan suoraan seurattuihin tiedostoihin guardin ohi.

ReportHub-käsittelyä varten on [valmis siirtoteksti](ReportHub-handoff.md).
Se ei ole ReportHubin julkaistu päivitys eikä erillinen raportointiajo.
