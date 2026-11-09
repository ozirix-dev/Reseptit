# Erä B10 – 5 reseptin 15 EN/SV/TH-julkaisukäännöstä: merkitysvertailu

9.11.2026. AI-katselmointi (ChatGPT), ei ihmistarkistusta tai koepaistoa. FI-versio main a7df722525def7155267fb63bebe61afcfc053ba; Draft-lähde PR #356 HEAD 1d28d8ba75b6d9884d86d50b4998fe8737500bbe.

## Rajaus

Viisi julkaistua FI-reseptiä, 15 käännöstä. FI-lähdetiedostoja ei muuteta, jotta GK80/GK100:n byte-for-byte-sinetit säilyvät. Uusi kielijulkaisu merkitään ainoastaan erilliseen published-translation-pairs.json-rekisteriin. Julkaisun semanttiset SHA-256-todisteet yhteisessä codex-review-evidence.json-rekisterissä ovat AI-vertailun version sidoksia, eivät itsenäinen merkitystarkistin.

| Resepti | AI-vertailun ydinhavainnot (FI–EN/SV/TH, TH-takaisinkäännös) |
| --- | --- |
| kiinalainen-musta-seesamipuuro | 100 g **kuivaa** jasmiiniriisiä, 700 g vettä, 200 g makeuttamatonta soijajuomaa, 20 g hunajaa, 10 g **kokonaisia mustia seesaminsiemeniä**, ei tahnaksi jauhamista. 40 min haudutus, 2 annosta, GL-mallin matala luottamus ja insuliinivaroitus säilyvät. TH: ข้าวหอมมะลิขาวสาร, งาดำเต็มเมล็ด ja บด kieltomerkitys oikein. |
| valimerellinen-tortilla-espanola-aamupalaksi | 60 g **kuorittua raakaa** perunaa keitetään 500 g vedessä ja vesi valutetaan pois; 55 g sipulia, 13,5 g oliiviöljyä, 13,5 g rypsiöljyä ja 110 g kuoretonta munaa. Koko kypsennyksen rasva 2 annokseen. TH ei siirrä pitkässä öljykypsennyksessä muodostuvan GI/GK:n analogiaa tähän muunnelmaan. |
| pohjoisafrikkalainen-lablabi | Valmis kanaliemi 700 g, kypsät valutetut kikherneet 100 g, jauhettu juustokumina 2 g, valkoinen valmis pita 100 g ja kuoreton muna 110 g. Muna **höyrykypsennetään**, ei paisteta rasvassa. Ruotsin 'helt genomstekt' korjattu menetelmäneutraaliin 'helt genomlagat'. TH pitää 110 g munan kuorettomana ja kieltää lisäöljyn/harissan. |
| meksikolainen-quesadilla-sienilla | 100 g **valmista maissitortillaa**, mozzarella 80 g, herkkusieni 75 g, maissinjyvät 80 g ja paistoöljy 13,5 g. Maissin mikrokypsennyksen turvallisuusvaraus sekä maissitortillan GI-analogian rajaus säilytetty. Ei friteerausta eikä lisäöljyä. TH säilyttää myös kaiken rasvan laskennan. |
| meksikolainen-kurpitsapuuro-piloncillolla | Täsmällinen **myskikurpitsa 250 g, 0,5–0,6 mm kaurahiutaleet 100 g, fariinisokeri 30 g, vesi 500 g, kaneli 2,6 g**. Ei korvata fariinia piloncillolla pelkän slug-tunnisteen perusteella. Kurpitsapalat jätetään kokonaisiksi, ei soseuteta. TH säilyttää 'älä soseuta' -rajoituksen ja annoksen veden. |

Kaikissa 15 parissa: ainesosarivien lukumäärä, määräarvot, annokset, kokonaisaika ja neljä ravintoarvokenttää ovat FI-lähteen kanssa yhtenevät. Käännöksissä on samat rakenne-, valmistus- ja GI/GK-varaukset. SHA-tiivisteet on laskettu repo-skeeman kenttäjärjestystä ja tekstin normalisointia käyttäen; status ei kuulu semanttiseen tiivisteeseen. Poikkeama P2-tasolla: useiden tämän vanhan työerän käännösten `tags` ovat yhä suomeksi (hakusana-UX:n jatkokorjaus); piloncillo-id kertoo eri sokerista kuin tarkasti punnittu fariinisokeriresepti. Nämä eivät saa muuttaa ravintoarvoja tai annettuja määriä ilman erillistä FI-tarkastusta.

Pois tästä erästä: kookosriisin FI `cooking_method: paistaminen` ristiriidassa keitto-ohjeen kanssa; chicken congee -ohjeiden 45 min kokonaisajan uskottavuus erilliseen laatutriageen. #360:n kolme FI-HOLD-reseptiä eivät julkaistu.

## Julkaisuportit

- [ ] CI: Changed-content ja strict translation audit päättyvät PASS täsmälleen julkaisu-HEADilla
- [ ] CI: valitut unit/translation/GK-regressiot PASS; ei avoimia P0/P1
- [ ] PR Ready/merge vain CI PASS jälkeen
- [ ] Main SHA:n Pages-build ja deploy SUCCESS, live-sisältö erillinen tarkistus

Ei väitettä ihmisen suorittamasta katselmoinnista, eikä suomenkielisten hyväksyttyjen GK-lähteiden muokkaamista.
