# GK80-lukittujen FI-reseptien versionpitävä näyttökorjauspilotti

**Päivä:** 10.11.2026. **Lähtö:** Reseptit `main` `1ad8b36137236d5e785387a19120d860588eb8eb`. **Tila:** testattava PR-ehdotus, ei uusi GK80-hyväksyntä eikä koepaisto.

## Tavoite ja korjausraja

Kuudessa julkisessa FI-reseptissä on toimituksellisia virheitä, mutta niiden tarkka alkuperäinen Markdown on lukittu `gk80-release-1/4/5/6`-paketteihin. Vanhoja SHA-arvoja tai `golden.json`-tuloksia ei muuteta. Build käyttää vain **täsmälleen hyväksytyn alkuperäistiedoston** SHA-256:een sidottuja, yhteen kertaan sovellettavia näyttökorjauksia. Reseptin kanoninen lähdeteksti ja GI/GK-laskennan syötteet säilyvät byte-for-byte muuttumattomina. Tuntematon uusi lähdeversio pysäyttää buildin `EDITORIAL_FI_SOURCE_STALE`-virheellä.

## Näkyviin tulevat toimitukselliset korjaukset

| Resepti | Näyttökorjaus | Alkuperäinen GK80-paketti |
| --- | --- | --- |
| `pohjoisafrikkalainen-harissa-shakshuka` | 110 g muna merkitään kuorettomaksi valmistusvaiheen mukaisesti | release-6 |
| `munakasmuffinit` | silikoniset/paperiset vuoat ilman listaamatonta voitelurasvaa; kaikki pekonista irronnut rasva mukaan seokseen | release-4 |
| `tonnikalamunakkaat-uunissa` | silikoniset/paperiset vuoat ilman listaamatonta voitelurasvaa | release-4 |
| `thai-kookosriisi-mangolla` | näkyvän reseptiversion `cooking_method` keittäminen eikä paistaminen | release-5 |
| `vietnamilainen-chao-ga-kanapuuro` | riisin kokonaiskypsennys noin 40 min, pieniksi leikattu kana mukana viimeiset noin 15 min ja sisälämpö vähintään 75 °C | release-1 |
| `indonesialainen-bubur-ayam-kanariisipuuro` | sama täsmällinen rinnakkainen kypsennys ja kanaturvallisuuden tarkistus | release-1 |

Molemmissa puuroissa 45 minuutin kokonaisaika jää ennalleen, mutta toteutuminen riippuu kanan koosta ja kypsymisestä. Jos 75 °C ei täyty, kypsennystä jatketaan. Kokonaisaikaa ei pidä tulkita kypsentämisturvallisuutta tärkeämmäksi. Reseptien 800 g keitinvesi ja kaikki kanasta irronnut neste pysyvät mukana. Tässä ei arvioida mitattua GI:tä eikä muuteta laskettuja makroja.

## Historian kielitestin sovitus

Täyden CI:n ensimmäisessä ajossa [#42708673724](https://github.com/ozirix-dev/Reseptit/actions/runs/42708673724) build onnistui ja 440/441 yksikkötestistä meni läpi. Ainoa FAIL oli Release 7:n historiallinen `existingLocales`-vaatimus, joka ei ottanut huomioon jo aiemmin julkaistuja EN/SV/TH-pareja (#370–372). Vanhaa sinettiä ei poisteta: testi hyväksyy nyt vain historiallisen kielijoukon ja julkaisusivurekisterin **ajantasaisella FI- ja käännös-SHA-todisteella** varmentamat lisäkieliversiot. Kaikki muut kielet hylätään edelleen. Tämä on yhden täsmäkorjauksen yritys, ei GK80-testirajojen yleinen höllennys.

## Turvaportti

- Jokaisella kuudella on täsmällinen alkuperäinen FI-SHA; koodi ei käytä pelkkää reseptitunnistetta tai laajaa tekstikorvausta.
- Muut reseptit ja kieliversiot palautetaan sellaisinaan.
- Korjauksen jokaisen tekstikatkelman pitää löytyä juuri kerran. Tuntematon lisämuutos estää koko buildin, eikä aiheuta hiljaista poikkeamaa.
- Tests: lähde-SHA:t vastaavat lukittuja GK80-paketteja; muutoksista vain rajatut tekstikentät tai menetelmä; kaikki numeeriset ainekset, annokset, makrot ja alkuperäiset tiedostot pysyvät samoina; muutettu lähde, väärä polku ja kadonnut ankkuri estetään.
- Julkisen ruoanvalmistusohjeen kehitys ei ole uusi GK80/GL-mittaus eikä itsenäinen kielikatselmointi. Näihin kuuteen kuuluvaa 18 Draft-käännöstä ei julkaista tämän PR:n mukana.

## Päätösvaihe ennen käännösjulkaisua

Tämä on väliaikainen, testattava julkaisunäyttöön rajattu korjaus. Kanonisen FI-lähteen korjaaminen ja kaikkien kuuden `gk80-release`-paketin historiallisen hyväksynnän versioitu uudelleensidonta vaativat erillisen tarkistuksen. Ennen 18 käännöksen julkaisemista FI/EN/SV/TH-versiot pitää verrata näkyvään korjattuun ruoanvalmistukseen, päivittää tarvittaessa itse käännökset ja niiden uuden version SHA-merkinnät, testata julkaisuportti uudelleen. Pelkkä tämä PR ei vapauta #356:n HOLDia.

**Rajaus:** tämä PR ei muuta ainuttakaan `reseptit/**`, `kaannokset/**`, `docs/nutrition/**`-tiedostoa. Ei automaattista mergeä ennen täyden CI:n ja erityisesti numeeristen GK-regressiotestien tarkistusta.
