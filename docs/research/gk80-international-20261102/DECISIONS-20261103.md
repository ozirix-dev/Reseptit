# GK80:n päätöstaulukko 3.11.2026

Main `d224549f5e1df3078d9acfa4e79d5e3b84dd457b` sisältää 193/326 numeerista resepti-ID:tä. PR #195:n [julkaisuajo](https://github.com/ozirix-dev/Reseptit/actions/runs/41587298227) raportoi 193 numeerista reseptiä. [Tuotannon GK-koonti](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) vahvisti **193/326 (59,2 %)**, joista 156 alkuperäisohjeita ja 37 nimettyjä GK-versioita. Tavoitteeseen 261 puuttuu 68. PR #194:n main-diff koskee suklaavertailua.

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
| `vhh-mustikkapiirakka` | A | 1,30177875 | MEXT 05001 ja Fineli 622/442, [täsmäsyöte](blueberry-and-defined-brine/blueberry-pie-proposal.json) | LOW* | Kotijauhettu manteli, punnittu vanilja ja korjattu munamäärä | Sisältökatselmus |
| `lindstrominpihvit-kaalilla` | A | 6,895695 | Fineli 30382/1/929/922 ja Maille, [täsmäsyöte](blueberry-and-defined-brine/lindstrom-defined-brine-proposal.json) | LOW* | Uusi itse tehty liemi ja punnitut mausteet | Sisältökatselmus |
| `samosa` | B | 44,460742–44,611742 | Omanin ihmis-GI 60,4, [täsmäsyöte](almond-reuse-and-oman/samosa-prepared-source-scenario.json) | LOW / ehdollinen* | Uppopaistetun täytetyn yksikön vastaavuus | Valmistus- ja menetelmäkatselmus |
| `aloo-paratha` | B | 57,07930685–57,47330685 | Thakurdesai 2024, valmistettu perunaparatha, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Täytetyn paistetun komponentin vastaavuus | Valmistus- ja menetelmäkatselmus |
| `intialainen-aloo-paratha` | B | 39,5874897 | Thakurdesai 2024, valmistettu perunaparatha, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Aamiaisversion komponenttivastaavuus | Valmistus- ja menetelmäkatselmus |
| `kiinalainen-kevatsipulipannukakku` | B | 11,9838384–19,889064 | Valmistettujen pannuleipien lähdekortit, [täsmäsyöte](paratha-component-routes/cases.json) | LOW / ehdollinen* | Kerrostus, rasva ja kastikkeen erillinen käsittely | Valmistus- ja menetelmäkatselmus |
| `vietnamilainen-banh-bao-kananmunalla` | B | 25,298172–34,552647 | Lau 2015 ja Lan 2013, [täsmäsyöte](steamed-buns-source-control/banh-bao-component-proposal.json) | LOW / ehdollinen* | Uuden höyrytaikinan valmistusvastine ja menetelmätuki | Pois jonosta, julkaistu A-versio |

### Hyväksyntäjono ja ehdollinen potentiaali

Vertailu Codex2:n kolmeen CSV-jonoon ja hyväksyntäkuitteihin on sidottu [tutkimushaaran snapshotiin](https://github.com/ozirix-dev/Reseptit/tree/fcba8c85a31e49bf2d65dbb356eadf8d1ac56a0b/docs/research/afcd-polyol-03). Paella on ainoa yhteinen ID näiden 20:n joukossa. Viisi ID:tä poistuu jatkojonosta julkaistun GK:n perusteella, ja kaikki 20 säilyvät yllä tutkimushistoriana. Codex2:n seitsemän APPROVED_RESEARCH_HANDOFF-riviä sekä muut snapshotin kuittiversiot, mukaan lukien rahkapiirakka, täsmäävät jo tuotannon versioihin. Tässä vertailussa **0 varmennettua hyväksyttyä, julkaisematta olevaa versiota**.

Jäljellä on 15 ehdollista ID:tä (11 A, 4 B). Teoreettinen yläraja on **208/326**, jos jokainen saa erilliset hyväksynnät ja julkaistaan. Käytännön ensimmäinen katselmointierä on alla. Viisi onnistunutta julkaisua antaisi **198/326**. Tarkista jokaisen syötteen tekninen julkaisukelpoisuus omistajan päätöksen jälkeen.

1. Hyväksytkö siemengranolan täsmäversion punnitun kanelimäärän ja vain tälle määrälle rajatun GI50-imputoinnin?
2. Hyväksytkö pistaasijogurtin Steenbergs-ruusuvedellä ja nykyisillä maito-, pähkinä- ja hedelmäryhmän GI-arvioilla?
3. Hyväksytkö kongjukin täsmällisen vesiversion ja sen nykyiset LOW-ryhmäsidonnat?
4. Hyväksytkö falafelin GK-arvion linkitetylle uunissa paistetulle versiolle, johon kuuluu tahinikastike ja josta määrättömät tarjoiluehdotukset on rajattu pois?
5. Hyväksytkö mustikkapiirakan version, jossa käytetään 150 g kuorellista itse jauhettua mantelia, 165 g kananmunaa ja 5 g punnittua vaniljauutetta?

Lähde- ja sisältöpäätökset koskevat linkitettyjä syötteitä. Mahdollisesta integraatiosta ja julkaisusta päätetään erikseen.
