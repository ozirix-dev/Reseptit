# liha-perunasoselaatikko: nelikielisen luonnoksen tekstuaalinen merkitysvertailu

- Päiväys: 2026-11-21; PR #786; tarkistettu HEAD `f1accc0c64be9cd1a34bf488c50886b2be74175c`.
- Tarkistaja **Chat 3 / Kokki-3**, ei Codex-/ihmishyväksyntä. FI Git blob `b2649678ae8bdc6697936f4431f10012de1f0a64`; EN `2fe5c7143341186975dc75407660ba4f4bba601e`; SV `37ff3266deda2c9c7daca7aa4aceb66638b163fb`; TH `23f51241355a9f873b9eead257dd06f178a1195a`.
- 7 ainesriviä, 6 annosta, 5 valmistusvaihetta; kaikki numeeriset määrät (g) ja järjestys täsmäävät. Vastaavuus ei yksin ole julkaisuhyväksyntä.

| # | FI | EN | SV | TH |
|---|---|---|---|---|
| 1 | kuorittuja jauhoisia perunoita (1000 g) | peeled floury potatoes | skalad mjölig potatis | มันฝรั่งเนื้อร่วนปอกเปลือก |
| 2 | naudan jauhelihaa (450 g) | beef mince | nötfärs | เนื้อวัวบด |
| 3 | sipulia (120 g) | onion | gul lök | หอมหัวใหญ่ |
| 4 | maitoa (250 g) | milk | mjölk | นม |
| 5 | voita, 30 g soseeseen ja 10 g vuokaan (40 g) | butter, 30 g for mash and 10 g for the dish | smör, 30 g till mos och 10 g till formen | เนย 30 กรัมสำหรับมันบดและ 10 กรัมสำหรับทาถาด |
| 6 | suolaa, 3 g soseeseen ja 3 g jauhelihaan (6 g) | salt, 3 g for mash and 3 g for mince | salt, 3 g till moset och 3 g till färsen | เกลือ 3 กรัมสำหรับมันบดและ 3 กรัมสำหรับเนื้อ |
| 7 | mustapippuria (1 g) | black pepper | svartpeppar | พริกไทยดำ |

## Tärkeät merkityskohdat

- **EN:** peeled *floury* potatoes, beef mince (ei sekoitusjauheliha), maito, voin jako 30/10 g, suolan jako 3/3 g, esikeitto 15–20 min, uuni 200 °C 25–30 min. Naudan jauheliha kypsennetään kokonaan ennen vuokaan laittamista.
- **SV:** "mjölig potatis", "nötfärs", "genomstekt", "30 g ...10 g" ja "3 g ...3 g" vastasivat FI-lähteen merkitystä. Ei puuttuvia ainesosia tai ristiriitaisia aikoja.
- **TH:** "มันฝรั่งเนื้อร่วนปอกเปลือก" kuvaa kuorittua jauhoista perunaa, "เนื้อวัวบด" naudan jauhelihaa; 200 °C, voin/suolan jako ja läpikypsentäminen täsmäävät. Maitoa koskeva allergeenihuomio on mukana.
- **Havainnot:** ei havaittua P0/P1-käännösristiriitaa tästä käsin luetusta aineistosta. Jauhelihan rasvaprosentti puuttuu *kaikista kielistä samoin*; se on lähteen ravintolaskennan HOLD, ei käännösvirhe.

## Hyväksyntärajat

Tämä dokumentti ei ole `meta/kaannokset/codex-review-evidence.json` -rekisterin hyväksyntä, eikä täytä vaadittavaa lähdesemanttisten tiivisteiden kirjausta. Kun FI-version sisältö on lopullinen, tee vaadittu Codex-merkitysvertailu ja rekisterikuittaus. `docs/reviews/new-recipes/liha-perunasoselaatikko.json`:n `decision: hold` säilyy.

## Chat-3:n lisäkatselmointi 22.11.2026

FI/EN/SV/TH on nyt tarkennettu käyttämään **17 % naudan jauhelihaa** ja **1,5 % kevytmaitoa**, jotka vastaavat ravintokandidaatissa aiemmin vain proxyina käytettyjä Fineli-luokkia. Neljässä kielessä yhteiset 7 ainesmäärää, 6 annosta sekä 200 °C / 25–30 min paisto eivät muuttuneet. Uunivuoka on tarkennettu vähintään **3 litraan**, ja tähteiden jäähdytyksen jälkeen kylmäsäilytys on alle **+6 °C**.

FI-raakateksti SHA-256: `c2bc22e3f1fe53ae292b7f24fad20def5f247b22494f5f4c98f4c68d84da1922`; Git-blob `d757f61f6cd38037d9eb6900d8974fc45f187907`. Chat 3:n rajattu 7/7 ainesosarivien, 5/5 valmistusvaiheiden, kuumennuksen, allergian ja kylmäsäilytyksen merkitysvertailu ei osoittanut kriittisiä eroja. **Ei virallista Codex-/ihmiskielen loppuhyväksyntää:** julkaistuille kielille varattu `meta/kaannokset/codex-review-evidence.json` pysyy koskemattomana, koska käännökset ovat Draft-tilassa. `decision: hold` säilyy.
