# GK80:n päätöstaulukko 3.11.2026

**Ajantasainen GitHub-tilannekuva 3.11.2026:** main `e771b53ef560f7960f5a6210bc82e53e0e15142f` sisältää **197/326 (60,4 %)** numeerista resepti-ID:tä: 156 alkuperäisohjetta ja 41 nimettyä GK-only-versiota. [Mainin julkaisuajo 41594126919](https://github.com/ozirix-dev/Reseptit/actions/runs/41594126919) läpäisi buildin ja deployn. Tavoitteeseen 261 puuttuu **64**. Tämä on versionlukittu tilannekuva, ei automaattisesti päivittyvä nykytilamittari. Julkisen HTML:n erillistä uutta sisältöauditointia ei tehty tässä dokumentointipäivityksessä.

**Edellinen todennettu vaihe:** main `d224549f5e1df3078d9acfa4e79d5e3b84dd457b`, [julkaisuajo 41587298227](https://github.com/ozirix-dev/Reseptit/actions/runs/41587298227) sekä [tuotannon GK-kooste](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) näyttivät 193/326 (59,2 %). PR #194 koski vain suklaavertailua. Tämän jälkeen [#202](https://github.com/ozirix-dev/Reseptit/pull/202) lisäsi mustikkapiirakan ja [#203](https://github.com/ozirix-dev/Reseptit/pull/203) kolme kanacurrya.

Historialliset luvut säilyvät omissa paketeissaan. 2.11.2026 tutkimus käynnistyi tasolta 156/326, ja [viimeinen 179/326-tilannekuva](blueberry-and-defined-brine/CURRENT.md) havaittiin 2.11.2026 klo 21.33 UTC.

### 20 alkuperäistä tutkimusehdokasta

GK per annos. A on ehdollinen aineslaskelma ja B ehdollinen valmistusvastine. *LOW kuvaa tässä tutkimuskatselmuksen varovaisuusluokkaa, ja B-välit ovat lähdeskenaarioita. Linkitetty täsmäsyöte sisältää reseptimäärät ja lähdetunnisteet. Parathan yhteisessä syötteessä tapaus valitaan resepti-ID:llä.

| Resepti-ID | Luokka | GK | Lähde ja täsmäsyöte | Luottamus | Hyväksyntäeste | Seuraava päätös |
| --- | --- | --- | --- | --- | --- | --- |
| `siemengranola-jogurtilla` | A | 2,47170625 | Fineli ja AFCD, kaneli GI50, [täsmäsyöte](followup/granola-source-resolved.json) | LOW* | Punnittu kaneli ja rajattu GI50-sovellus | Omistajakatselmus |
| `pellava-puuro-pahkinoilla` | A | 0,21453125 | Sukrin ja Alpro, [täsmäsyöte](followup/pellava-conditional-version.json) | LOW* | Tuotesidonta ja nimellisen CHO-varauksen kelpoisuus | Tuote- ja sisältökatselmus |
| `lahi-ita-pistaasijogurtti` | A | 4,3665 | Fineli 619/31212/31555 ja Steenbergs, [täsmäsyöte](breakfast-versions/pistachio-yogurt-named-version.json) | LOW* | Nimetty ruusuvesi ja ryhmä-GI-sovellukset | Omistajakatselmus |
| `korealainen-kongjuk-soijapapu-riisipuuro` | A | 29,0915 | Vesiversion koostumus- ja GI-sidonnat, [täsmäsyöte](stock-and-current-bindings/kongjuk-current-water-version.json) | LOW* | Nykyisen vesiversion ryhmä-GI-sovellus | Omistajakatselmus |
| `paella-valenciana` | A | 40,01949 | Knorr-liemi, kana, [täsmäsyöte](stock-and-current-bindings/paella-named-stock-version.json) | LOW* | Tutkimussyöte eroaa hyväksytystä 40,35-versiosta | Pois jonosta, #193 ja Codex2 |
| `falafel` | A | 9,86 | Kuiva kikherne ja tahinikastike, [täsmäsyöte](sauces-and-legumes/falafel-current-oven-version.json) | LOW* | Liotetun uunifalafelin GI-vastine ja tarjoilurajaus | Omistajakatselmus |
| `okonomiyaki-kaaliletut` | A | 3,5079 | Tamari, majoneesi ja Encona, [täsmäsyöte](sauces-and-legumes/okonomiyaki-named-sauces-version.json) | LOW* | Enconan pakkaus ja kastikkeiden määrärajat | Varmenna pakkaus |
| `hunaja-sinappikana-kaalilla` | A | 7,1423 | Nimetty tuote- ja grammakoostumus, [täsmäsyöte](pancake-source-and-fixed-input/honey-mustard-chicken-fixed-input-proposal.json) | LOW* | Punnitut määrät ja tuotesidonta | Sisältökatselmus |
| `indialainen-poha-maapahkinoilla` | A | 28,327975 | Fineli 182, AFCD F006107 ja IFCT G010, [täsmäsyöte](poha-and-main179/poha-fresh-leaf-version.json) | LOW* | Riisihiutaleiden vastine ja tuore currylehti | Omistajakatselmus |
| `pav-bhaji` | A | 42,2723825 | Yang 2006 / IT2021, kasvis- ja leipäryhmät, [täsmäsyöte](spices-and-native-miso/pav-bhaji-current-source-version.json) | LOW* | Muusivastine ja nimetyt leipä-/maustemäärät | Soveltuvuuskatselmus |
| `vhh-omenapiirakka` | A | 1,4955 tai 1,47675 | MEXT 05001 ja rajattu ryhmäimputointi, [täsmäsyöte](almond-reuse-and-oman/vhh-omenapiirakka.json) | LOW* | Tutkimusvaihtoehdot vaativat oman hyväksynnän | Pois jonosta, julkaistu GK toisella syötteellä |
| `vhh-raparperipiirakka` | A | 1,33125 tai 0,85625 | MEXT 05001 ja rajattu ryhmäimputointi, [täsmäsyöte](almond-reuse-and-oman/vhh-raparperipiirakka.json) | LOW* | Tutkimusvaihtoehdot vaativat oman hyväksynnän | Pois jonosta, julkaistu GK toisella syötteellä |
| `uunimakkara-sipulipedilla` | A | 0,4356 | Nimetty Tammelan lenkki ja sinappi, [täsmäsyöte](sausage-named-version/proposal.json) | LOW* | Tutkimussyöte eroaa hyväksytystä 0,26-versiosta | Pois jonosta, #193 |
| `vhh-mustikkapiirakka` | A | 1,30177875 | MEXT 05001 ja Fineli 622/442, [täsmäsyöte](blueberry-and-defined-brine/blueberry-pie-proposal.json) | LOW* | Tutkimusversion hyväksyntä ja erillinen julkaisu [#202](https://github.com/ozirix-dev/Reseptit/pull/202) | Pois jatkojonosta, julkaistu täsmäversio |
| `lindstrominpihvit-kaalilla` | A | 6,895695 | Fineli 30382/1/929/922 ja Maille, [täsmäsyöte](blueberry-and-defined-brine/lindstrom-defined-brine-proposal.json) | LOW* | Uusi itse tehty liemi ja punnitut mausteet | Ehdokas [#205](https://github.com/ozirix-dev/Reseptit/pull/205), ei vielä julkaistu |
| `samosa` | B | 44,460742–44,611742 | Omanin ihmis-GI 60,4, [täsmäsyöte](almond-reuse-and-oman/samosa-prepared-source-scenario.json) | LOW / ehdollinen* | Uppopaistetun täytetyn yksikön vastaavuus | Valmistus- ja menetelmäkatselmus |
| `aloo-paratha` | B | 57,07930685–57,47330685 | Thakurdesai 2024, valmistettu perunaparatha, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Täytetyn paistetun komponentin vastaavuus | Valmistus- ja menetelmäkatselmus |
| `intialainen-aloo-paratha` | B | 39,5874897 | Thakurdesai 2024, valmistettu perunaparatha, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Aamiaisversion komponenttivastaavuus | Valmistus- ja menetelmäkatselmus |
| `kiinalainen-kevatsipulipannukakku` | B | 11,9838384–19,889064 | Valmistettujen pannuleipien lähdekortit, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Kerrostus, rasva ja kastikkeen erillinen käsittely | Valmistus- ja menetelmäkatselmus |
| `vietnamilainen-banh-bao-kananmunalla` | B | 25,298172–34,552647 | Lau 2015 ja Lan 2013, [täsmäsyöte](steamed-buns-source-control/banh-bao-component-proposal.json) | LOW / ehdollinen* | Uuden höyrytaikinan valmistusvastine ja menetelmätuki | Pois jonosta, julkaistu A-versio |

### Täsmäsyötteiden tunnisteet ja Codex2-kuitit

SHA-256 yksilöi yllä linkitetyn tutkimussyötteen Git-sisällön. Yhteisestä paratha-paketista hash lasketaan vain kyseisen ID:n JSON-objektille, avaimet järjestettyinä, UTF-8-muodossa ja ilman erottimien ympärillä olevia välilyöntejä. Nämä arkistohashit eivät ole hyväksyntäkuitin laskentasyötehasheja.

GI:tön saatava CHO on tutkimuslaskelmasta pois jätetty positiivinen määrä grammoina annosta kohti. A-rivien summat sisältävät mahdolliset tutkimuspaketin kattoarviot. B-rivillä erittelemätön määrä jää avoimeksi.

Kuittisarake vertaa jokaista 20 resepti-ID:tä Codex2:n versionlukitun snapshotin 10 hyväksyntäkuittiin. Paella ja uunimakkara löytyvät kuiteista. Kummankin kuitti koskee eri täsmäversiota.

| Resepti-ID | Tutkimussyötteen SHA-256 | GI:tön CHO g/annos | Codex2-kuitti |
| --- | --- | --- | --- |
| `siemengranola-jogurtilla` | `f0ec31256c473fb98eefae2acd11c05ae8daad74d17a9852cf9f3fb2812fb24d` | 1,885 | Ei ID-osumaa |
| `pellava-puuro-pahkinoilla` | `04baf63840f36c75d0b3608e4115b3a219b5b561c21b869c3af560a1c4f3c924` | 1,905 (nimellinen, sisältää kattoarvioita) | Ei ID-osumaa |
| `lahi-ita-pistaasijogurtti` | `986cb3fda641818f1fb79883b52b241b74ec19027d8276221732e5ff2dd2dadf` | 0 | Ei ID-osumaa |
| `korealainen-kongjuk-soijapapu-riisipuuro` | `362b8e7c482b1f79d92344761dfa781c646a46d807f9565e2fe46646c26aa4fd` | 0,045 | Ei ID-osumaa |
| `paella-valenciana` | `b21a9c7ea5937d36c5b73fc61c46f3262298748e663af078cb8dbfd592dce3cb` | 1,52625 (kattoarvio) | [Kuitti](https://github.com/ozirix-dev/Reseptit/blob/fcba8c85a31e49bf2d65dbb356eadf8d1ac56a0b/docs/research/afcd-polyol-03/current-a-cap-approval.json) koskee eri versiota, GK 40,35. Hyväksytty syöte `5e9c7deff4c545411210ed1c5979ff29c0c63e37c746f1cc9fcc192d11b9fa69` |
| `falafel` | `e733e3f65fc9bd467f04ee47c390b1a987c65d65304cc7161421c425d34c2de2` | 1,9570875 | Ei ID-osumaa |
| `okonomiyaki-kaaliletut` | `86bea0a9c9eb8b4b88e082c2ed62de8b580f1cb81cb02fb7a34dcfdad60f2970` | 1,952875 | Ei ID-osumaa |
| `hunaja-sinappikana-kaalilla` | `a1beb66e7abaf810278f0d78bfc1a79efb2d30755b58158c23dca1f0bd75f239` | 1,2254125 | Ei ID-osumaa |
| `indialainen-poha-maapahkinoilla` | `90881aa37a0b15be63b2b7dabf4e96ba905c74037459afec87f56bd268db497c` | 0,210525 | Ei ID-osumaa |
| `pav-bhaji` | `e22f15133ef2e9ea0903817766efe31ca7de6754fe60f1c05fae4faca65e817e` | 1,90775 | Ei ID-osumaa |
| `vhh-omenapiirakka` | `909d45f07d6b4548c14f0b3fbe8a87e3f0ae044533ce4ab73f3bac3bcbb115d2` | 1,18390625 | Ei ID-osumaa |
| `vhh-raparperipiirakka` | `07d408ef4ead966af300e705cce151f0f9cd58e951a3100187bf52578feb8b4c` | 1,73125 | Ei ID-osumaa |
| `uunimakkara-sipulipedilla` | `1bef53eae6327750577b744f6717c43bc33fc6911c7c4594d797295ddb6c115e` | 1,6284125 (nimellinen) | [Kuitti](https://github.com/ozirix-dev/Reseptit/blob/fcba8c85a31e49bf2d65dbb356eadf8d1ac56a0b/docs/research/afcd-polyol-03/sausage-a-approval.json) koskee eri versiota, GK 0,26. Hyväksytty syöte `726315e676d5a36776e2cab4b9e75e3478e5b0c900e1230d4fbb183bb7650ae3` |
| `vhh-mustikkapiirakka` | `4c8b093cdbf484b4e5b939e98400cc1eb310b2e0f95e0b142ea30447ceb2bd0a` | 1,736875 | Ei ID-osumaa |
| `lindstrominpihvit-kaalilla` | `08dac21f5d3c6127cd7abae63b4224cd11ed4b0ebee1023f24283077741f7c51` | 0,6495625 | Ei ID-osumaa |
| `samosa` | `887d71328f493de5870f913d3a40a0881a44d3489fad57ddb97e5220007c54d8` | Ei eritelty B-skenaariossa | Ei ID-osumaa |
| `aloo-paratha` | `110a4ab63c6f866e4ae606629ffdb57a14bbcb66b5f981efa1556464b570cad7` | Ei eritelty B-skenaariossa | Ei ID-osumaa |
| `intialainen-aloo-paratha` | `6a268c2cd9d62985f9bfa3ea1e4854eb1112af547e59b35d964255688c387954` | Ei eritelty B-skenaariossa | Ei ID-osumaa |
| `kiinalainen-kevatsipulipannukakku` | `f640d29abfa627624ff5e527e28a1f76fc2279811785632bab33eb11d13bdf07` | Ei eritelty B-skenaariossa | Ei ID-osumaa |
| `vietnamilainen-banh-bao-kananmunalla` | `61e9a8bffe095f02f50c59c652add9a880a7d7a599a24108390b976e7e76b1a9` | 0,1875 ([tutkimustulos](steamed-buns-source-control/results.json)) | Ei ID-osumaa |

### Hyväksyntäjono ja ehdollinen potentiaali

Vertailu Codex2:n kolmeen CSV-jonoon ja hyväksyntäkuitteihin on sidottu [tutkimushaaran snapshotiin](https://github.com/ozirix-dev/Reseptit/tree/fcba8c85a31e49bf2d65dbb356eadf8d1ac56a0b/docs/research/afcd-polyol-03). Kuittivertailun yhteiset ID:t ovat paella ja uunimakkara. Viisi ID:tä poistuu jatkojonosta julkaistun GK:n perusteella, ja kaikki 20 säilyvät yllä tutkimushistoriana. Codex2:n seitsemän APPROVED_RESEARCH_HANDOFF-riviä sekä muut snapshotin kuittiversiot, mukaan lukien rahkapiirakka, täsmäävät jo tuotannon versioihin. Tässä vertailussa **0 varmennettua hyväksyttyä, julkaisematta olevaa versiota**.

Kun [#202](https://github.com/ozirix-dev/Reseptit/pull/202) julkaisi mustikkapiirakan, **20 historiallisesta tutkimus-ID:stä kuusi** on jo numeerisena versiona mainissa. Jäljellä on **14 erillistä vielä julkaisematonta ID:tä (10 A, 4 B)**. Kaikkien erillisen hyväksynnän ja julkaisun teoreettinen yläraja on **211/326**. Tämä ei ole hyväksytty tai julkaistu kattavuus.

**Viisi näistä 14:stä on jo erillisissä integraatio-PR:issä**, eikä niitä tule palauttaa uuteen tutkimushyväksyntäjonoon:
- [#205 Lindströminpihvit](https://github.com/ozirix-dev/Reseptit/pull/205): hyväksytty erillinen punajuuriliemen A-versio, Ready; ei vielä mainissa tilannekuvan hetkellä
- [#206 Siemengranola, pistaasijogurtti, kongjuk ja falafel](https://github.com/ozirix-dev/Reseptit/pull/206): neljän hyväksytyn A-version integraatio, Draft; ei vielä mainissa tilannekuvan hetkellä

Nämä viisi voivat nostaa 197:n **202/326:een** vain, jos kaikki viisi säilyvät erillisinä, nykyiseen mainiin yhteensopivina ja julkaistaan hyväksytysti. PR:ien vanhentuneita 195/326- ja 198/326-esikatselulukemia ei saa käyttää suoraan uusina nykytilalukuina. Ennen mergeä on varmennettava ajantasainen pohja, laskennan tulokset, hyväksyntä ja julkaisulupa.

**Muu jäljellä oleva tutkimuskatselmointijono on yhdeksän ID:tä:** viisi A-versiota (`pellava-puuro-pahkinoilla`, `okonomiyaki-kaaliletut`, `hunaja-sinappikana-kaalilla`, `indialainen-poha-maapahkinoilla`, `pav-bhaji`) sekä neljä B-skenaariota (`samosa`, `aloo-paratha`, `intialainen-aloo-paratha`, `kiinalainen-kevatsipulipannukakku`). Niiden yksilölliset lähde-, valmistus- ja omistajapäätökset pysyvät avoinna. Viiden B-skenaarion historiallinen tutkimuslista säilyy yllä, mutta banh bao on jo julkaistu eri A-versiona.

20 ID:n taulukko ja alla olevat Codex2-kuittivertailut ovat tutkimushetken historiallista evidenssiä, eivät nykyisen hyväksyntäjonon yksinomainen totuus. Tässä päivityksessä ei anneta uusia hyväksyntöjä eikä muuteta numeerisia GK-arvoja.
