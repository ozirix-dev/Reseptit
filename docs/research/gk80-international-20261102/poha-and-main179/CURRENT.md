# GK80 – poha ja julkaistun kattavuuden tarkistus

Tilanne 2.11.2026 klo 19.58 UTC. Tämä on Codex1:n paikallinen tutkimusluovutus. Mainia, tuotantoa, GI-sääntöjä tai Codex2:n tiedostoja ei muutettu.

**Julkaistuna 179/326 (54,9 %); tavoitteeseen 261 puuttuu 82.** Tutkimuksen alku oli 156/326. PR185:n seitsemän reseptiä ovat nyt sekä mainissa `96a25d8c9db6fb0a505a70a37a5b357b6a83593a` että onnistuneen deployn jälkeen julkisella sivulla. Tämän tutkimuspaketin uusia julkaisuja on **0**. Tarkat resepti-ID:t, sivun hash ja deploy-tunniste ovat [julkaisutarkistuksessa](production-revalidation.json).

## Uusi ehdollinen laskelma: indialainen poha maapähkinöillä

[Kaikki kahdeksan alkuperäistä ainesriviä kattava syöte](poha-fresh-leaf-version.json) antaa **GK 28,327975 ≈ 28,33/annos**, varmuustaso LOW. Puuttuvan GI:n vuoksi sallitusti pois jäävä positiivinen saatava CHO on yhteensä **0,210525 g/annos**; jokainen tällainen rivi on alle 1 g ja summa alle 2 g. Puuttuvaa GI:tä ei asetettu nollaksi.

| Aine ja määrä / 2 annosta | Koostumus ja GI-käsittely | Käyttöraja |
| --- | --- | --- |
| Riisihiutale 100 g | Fineli182, CHO79,3 g/100 g; nykyinen riisiryhmän GI67 | Yhdistelmätietue riisijauholle ja -hiutaleelle; huuhdonnalle ei keksitty hiilihydraattivähennystä |
| Raaka suolaamaton maapähkinä kuorineen 20 g | AFCD F006107, WITHOUT sugar alcohols CHO8,9; nykyinen pähkinäryhmän GI22 | Laaja ryhmäanalogia, ei mitattu tämän pähkinän GI. Taulukon n3 ei tarkoita kolmen koehenkilön tutkimusta |
| Tuore curry-lehti 3 g | IFCT-G010, Table6 Total Available CHO3,66; poisjättö0,0549 g/annos | Raaka tuore syötävä Murraya koenigii; ei kuivattu lehti tai curryjauhe |
| Tuore vihreä herne 50 g | Fineli370, CHO9,495; nykyinen kasvisryhmän GI66 | Sama elintarviketietue kuin nykyisessä makrolähteistyksessä; ei vanhan prototyypin pakasteherne |
| Neutraali öljy 1 rkl =13,5 g | Fineli541, CHO0 | Tietueen oma talousmitta |
| Tuore korianteri 1 rkl =3,75 g | AFCD F003192, CHO1,9; poisjättö0,035625 g/annos | AUSNUT2023 saman elintarvikkeen tiheys0,25 g/ml ×15 ml; talousmitta-arvio, ei erän punnitus |
| Laimentamaton sitruunamehu 1 rkl =15 g | Fineli11557, CHO1,6; poisjättö0,12 g/annos | Tietueen oma rkl; ei laimennettu mehu |
| Tavallinen suola maun mukaan | Lähteistetty CHO0 | Määrä ei anna natriumarviota; ei mausteseos |

**Hyväksyntäportit ovat edelleen auki.** Reseptin yleiset vaiheet1–3 puhuvat jauhamisesta ja pihveistä, mutta pohaa koskeva vaihe4 kuvaa hiutaleiden huuhtelun ja pannukypsennyksen. Tämä nimetty versio seuraa vaihetta4 ja edellä täsmennettyjä tuoreita/raakoja aineita. Sisältöversion ja ryhmä-GI-sovellusten tarkistus tarvitaan ennen käyttöä. Laskettu versio ei yksin todista nykyisen ristiriitaisen valmistusohjeen kattavuutta.

Vanha GK-prototyyppi käytti maapähkinää100 g, curry-lehtiä150 g ja herneitä150 g sekä jätti korianterin ja sitruunamehun pois. Nykyinen makrolaskelma sisälsi jo oikeat päämäärät20/3/50 g ja hyödylliset lähdetunnisteet. Ne käytettiin uudelleen. Makrolaskelman korianterin lähteetöntä3 g/rkl määrää tai AFCD-polyolien nollaoletusta ei peritty. AFCD:n yksittäiset polyolit säilyvät tuntemattomina. [Vertailu](legacy-macro-comparison.json) erottaa tutkimussyötteen julkaistuista makroista; mitään makroarvoja ei muutettu.

## IFCT on lähteen uudelleenkäyttö, ei uusi GI-löytö

[IFCT2017:n alkuperäinen julkaisu](https://www.nin.res.in/ebooks/IFCT2017_16122024.pdf), PDF-sivu221 / painettu183, G010, antaa analyyttisen saatavan CHO:n3,66±0,17 g/100 g. Määritelmä on tärkkelys ja yksittäiset vapaat mono- ja disakkaridit (PDF-sivu27). Table1:n erotuslaskettu4,51 on eri suure; kuitua ei vähennetty uudelleen. Painetut tärkkelys3,08 ja vapaat sokerit0,60 summautuvat3,68:aan; natiivia kokonaissaraketta3,66 ei muutettu eikä erolle keksitty selitystä.

Sama täsmällinen lähdetietue ja PDF-hash ovat jo uuden mainin `gk80-operation149`-aineistossa. Lähdeperhe on hyväksytty Chettinad-versiolle PR185:ssä; **poha ei ole hyväksyttyjen reseptisyötteiden joukossa**. Lähdeperheen hyväksyntä ei ole uuden reseptiversion hyväksyntä. IFCT on koostumuslähde, ei GI-mittaus. Tämän kierroksen uusia varmennettuja GI-mittauksia: **0**. [Lähdekatalogi](source-catalog.json) säilyttää alkuperät, talousmitat ja nykyisen GI-rekisterin täsmälliset kortit.

Riisihiutaleiden suoraa näyttöä seulottiin rajatusti: Prasad2015:n [alkuperäisabstrakti](https://pubmed.ncbi.nlm.nih.gov/25092385/) ja vuoden2021 koonti johtavat valmiin riisipoha-annoksen GI74±4,87 SEM:ään (n10). Alkuperäisen valmistuksen koko menetelmää ei varmennettu: tulosta ei siirretty raakaan riisihiutaleeseen. [Amuthaselvi2025](https://doi.org/10.1007/s11694-025-03126-8) käsittelee eri riisilajikkeita ja prosessia, mutta numeerinen GI ja koko protokolla eivät varmistuneet. Arvoja ei tuotu malliin. [Seulontakortti](rice-flake-source-screen.json) kirjaa rajat ja lähestymistavan vaihdon olemassa olevan koostumuslähteen hyödyntämiseen.

## Kokonaisvaikutus ilman kaksoislaskentaa

| Joukko | Yksilöllisiä reseptejä | Tila |
| --- | ---: | --- |
| Julkaistu numeerinen GK |179| Varmennettu mainista ja julkiselta sivulta; alkuperäisohje156 ja nimetyt versiot23 |
| Aiemman kahdeksan hyväksytyn julkaisuttoman joukon jäljellä oleva rahkapiirakka-vhh |1| Toisen työn hyväksytty syöte; seitsemän muuta ovat jo yllä179:ssä |
| Omat lähteistetyt nykyisiin määriin perustuvat versiot: siemengranola, pistaasijogurtti, kongjuk, falafel |4| Laskettavia tutkimussyötteitä; reseptisovellusten tarkistus ja hyväksyntä puuttuvat |
| Omat muut ehdolliset versiot: pellavapuuro, paella, okonomiyaki, hunaja-sinappikana, poha |5| Tuote-, määrä- tai sisältöversion portti sekä sovellusten hyväksyntä puuttuvat |

Oma aineisto sisältää siis **9 erillistä hyväksymätöntä versiota**, ei yhdeksää uutta julkaistua arvoa. Kaikki9 ja rahkapiirakka ovat eri reseptejä ja erillään julkaistusta179:stä. Jos ne joskus hyväksytään ja julkaistaan, yhteismäärä olisi **189/326**, jolloin puuttuisi72. Tämä on ehdollinen mahdollisuus, **ei valmis julkaisuerä**. Codex2:n työlistan vanhaa kahdeksan odottavan lukua ei summattu uudelleen. [Koordinointitarkistus](coordination-snapshot.json) sisältää täsmälliset joukot; poha ei kuulu Codex2:n kolmeen tarkistettuun varauslistaan.

Ensimmäinen yhteisten esteiden33 reseptin jauho-/mannaseulonta ja jatkotöiden lähdekortit säilyvät [juurikoosteessa](../README.md). Niiden lähdehavainnot eivät yksin avaa33 laskelmaa. Kim2019:n pannulettu-GI57 on varmennettu ihmisnäyttö, mutta valmistusraja estää yleisen jauho-GI:n ja kolmen tutkitun erilaisen lettureseptin suoran sidonnan.

Tehokkaimmat seuraavat toimet:

1. Toisen työn omistaja vie jo hyväksytyn rahkapiirakka-version julkaisutarkistukseen: enintään1 lisäys.
2. Tarkistetaan neljän lähteistetyn version nimetyt GI-sovellukset, ainerajaukset ja pieni poisjättövara; falafelin vara on vain0,0429125 g/annos: enintään4 lisäystä.
3. Sovitaan poha-ohjeen valmistus ja tarkistetaan sen lähdesidonnat tässä dokumentoituna versiona: enintään1 lisäys.
4. Ratkaistaan neljän muun ehdollisen version täsmälliset tuotteet ja grammaspesifikaatiot: enintään4 lisäystä. Okonomiyakin poisjättövara on vain0,047125 g/annos.
5. Ratkaistaan jauhokomponentin ja kokonaisen kypsennetyn ruoan GI:n menetelmäportti erillisen ehdotuksen kautta ennen uusia laajoja hakuja. Mitattua sekaruoan GI:tä ei aseteta raaka-aineen arvoksi.

## Kevyt varmennus

[Nykyisen muuttamattoman GK-mallin ajo](evaluate.mts), [tulokset](model-results.json) ja [riippumaton Decimal-tarkistus](verify_decimal.py) yhtyvät tulokseen28,327975. Neljä negatiivista kontrollia jää HOLD-tilaan: puuttuva curry-lehden koostumus, vanha150 g lehtimäärä, puuttuva korianterin massa ja puuttuva maapähkinän koostumus. Lähde- ja malliblobit on sidottu main96a25d8:aan [manifestissa](source-manifest.json). Julkaistun sivun179 ID:t ja ehdollinen189:n unioni on tarkistettu.

Ei tuotantobuildia tai käynnistettyä CI-ajoa. Deploy-status luettiin olemassa olevasta ulkopuolisesta ajosta. Tutkimushaaran tiedostot ovat ainoa tämän työn kirjoituskohde.
