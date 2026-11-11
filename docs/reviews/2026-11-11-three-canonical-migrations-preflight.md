# Issue #404 – esiseulonta ja kolmen FI-valmistusohjeen kanoninen erä (11.11.2026)

## Valinta: miksi ei 15:tä?

Mainissa oli tarkistuksen alkaessa kymmenen #404:n SHA-lukittua julkista FI-näyttökorjausta. GK149:n 70 lähde-ID:n joukkoon kuuluvat poha, kaya-paahtoleipä, halloumi-tomaattileipä, pho ga ja mannasuurimoupma. Niitä ei siirretä alkuperäiseen tiedostoon ilman GK149:n täyslähde-SHA-sidoksen erillistä tutkimusversiokäsittelyä. Pohan EN/SV/TH-merkitystarkisteet ovat lisäksi aiemmassa katselmoinnissa vanhentuneet.

Manakish jätetään ruokalajin identiteetti-/jogurttipannuleipä-vs.-hiivataikina-HOLDiin. Labneh jätetään rakenteisen `cooking_method`-kentän sekä ravinto-/GK-sidoksen HOLDiin. **Kolme muuta** ovat johdonmukaisia valmistustekstin lähdemigraatioehdokkaita, joilla ei ole tunnettua GK149-sidosta. Kaikista kolmesta tarkistettiin myös, ettei tavallisissa `kaannokset/en|sv|th/aamupalat`-poluissa ole julkaistua kieliversiota; lopullinen semantiikan auditointi kuuluu CI:lle.

## Varsinaiset lähdesiirrot

| Kortti | Resepti | Muutos | Avoin tutkimus-/laatuvelka |
| --- | --- | --- | --- |
| B21 #29 | japanilainen-soba-aamiaiskeitto | 200 ml dashi + 700 ml toinen liemi, soba erikseen, kaksi uppomunaa | Pinaatin syötävä kappalepaino, dashi-tuote, ravinto/GK |
| B21 #31 | kiinalainen-jianbing-munaletty | 100 g jauhoista vedellä kaksi lettua, muna, seesami, soijapaputahna | Soijapaputahnan koostumus, taikinaveden dokumentointi, ravinto/GK |
| A #32 | kiinalainen-katkarapu-wontonkeitto | Katkarapujen käsittely, nyyttien täyttö, sulku ja kypsennys liemessä | Katkarapu-/taikinatuotteen ravintovastaavuus, ruoan turvallinen käytännön valmistus |

Kaikki uudet tekstit kopioitiin **täsmälleen** aiemmin PR #421:n / PR #407:n täsmä-SHA-lukituista julkisista FI-projektioista. Ei uutta kaloria, GK-lukua, ainesosaa, annosmäärää, rakennettua ruokareittiä, käännöstä eikä Cloudflare-muutosta.

Julkiset projektorit `material21-methods-public-display.ts` ja `wonton-fi-public-display.ts` palauttavat nyt lähteen sellaisenaan; kanoninen FI sisältää jo aiemmin näytetyn ohjeen.

## Turvallisuuden ja historian portit

- `site/tests/issue404-three-canonical-history.ts` sallii vain kolmen yksilöidyn lähdetiedoston täsmälliset uudet Git-blob-SHA:t. Se rekonstruoi alkuperäisen ennen muutosta olleen reseptin **vain GK:n jäädytettyjen historiatestien vertailuun**.
- Reseptin ennen `## Valmistus` -otsikkoa oleva sisältö ja kaikki frontmatter-, annos-, aines- ja makroarvot täytyy säilyä muuttumattomina.
- Historiallisen makroinventaarion koko lähde-SHA sekä tarkistetut muistiinpanot verrataan täsmällisesti; vanha tulos ei muutu uudeksi GK-hyväksynnäksi.
- `site/tests/issue404-public-integrity.test.ts` seuraa tavoitetilaa **21 karanteenia + 7 SHA-näyttökorjausta + 10 kanonista FI-valmistusmenetelmää = 38**. Tämä kuvaa teknistä näkyvyys- ja menetelmäsuojausta, ei 38 lopullista ravinto/GK-kortin hyväksyntää.
- Wontonin turvallinen valmistus edellyttää edelleen todellisen tuotteen, katkarapujen kypsyyden ja ristikontaminaation hallintaa. Reseptin tekstinsiirto ei ole riippumaton koekeittiö-/turvallisuushyväksyntä.
- **Draft / DO NOT MERGE**, kunnes tämän HEADin CI PASS ja tuotannon erillinen tarkistus on saatu. Karanteeneja ei pureta.

## Seuraavat erät

Älä kasvata kanonista lähdemigraatiota 15 reseptiin pelkän määrätavoitteen vuoksi. Seuraava oikea työ on ensin seitsemän jäljelle jääneen SHA-näyttökorjauksen erillisten käännös-/GK-sidosten ratkaiseminen tai etsiä uusia **muista laadunvarmistusjonoista** sellaisia tekstitason korjauksia, joita uuden ennakkotarkistimen ja muiden historiallisten porttien ei tarvitse pysäyttää.
