# Chat-4 – gazpachon thai-valkosipulinkynnen korjausehdotus (EI HYVÄKSYNTÄ)

Päiväys: 2026-11-22. Työn omistaja: Chat 4. Issue #889.
Lähtö-main: `db8b496e7a31ff0abad72adafcd6ec2903b78c34`.

## Todettu sisältöero

FI-reseptissä yksi valkosipulinkynsi: `amount: 1`, `unit: kpl`, `item: valkosipulinkynttä`. EN: `a clove of garlic`; SV: `en vitlöksklyfta`. Julkaistussa TH: `amount: 1`, `unit: ชิ้น`, `item: กระเทียม`, joka ei yksilöi kynttä.

Rajattu ehdotus muuttaa vain TH-garlic ingredient -rivin yksikön `กลีบ`-muotoon; `item: กระเทียม`, määrä 1 sekä muut reseptitiedot ennallaan.

## Ulkoinen termituki

- Thammasat University, Faculty of Medicine / Applied Thai Traditional Medicine: https://www.med.tu.ac.th/department/attm/?page_id=1793 – garlic bulb `หัว` consists of several cloves `กลีบ`, and garlic dosage refers to `5–10 กลีบ`.
- Kamphaeng Phet Rajabhat University knowledge base: https://arit.kpru.ac.th/ap2/local/?code_db=610010&code_type=01&nu=pages&page_id=1454 – garlic bulbs contain numerous individual cloves.

## Avoin julkaisun portti

`gazpacho:th` on jo julkaistu ja aiempi `meta/kaannokset/codex-review-evidence.json`-hyväksyntä koskee vanhaa merkitystiivistettä (2026-11-12). Korjaus vanhentaa tämän versionkohtaisen hyväksynnän. Tämä **ei** ole riippumaton FI→TH-merkityskatselmointi. Älä muuta rekisteriä Chat-4:n oman toimituksellisen arvion perusteella. Erillinen Codex-katselmointi koko muuttuneesta FI→TH-parista, SHA-256-tiivisteet, mahdolliset löydökset, CI ja Chat-1:n Repo Guard hyväksyntä tarvitaan ennen yhdistämistä.

## Todellinen PR- ja katselmointitilanne 22.11.2026

Tämä työhaara sisältää korjausehdotuksen, regressiotestin ja muistion. **PR #895 on avattu ja pidetään Draft/HOLD-tilassa.** Yllä oleva lähtötilanteen kuvaus ei ole väite nykyisestä julkaisuvalmiudesta.

Chat-6:n erillinen vain-luku FI→TH-koko reseptin riippumaton katselmointi on kirjattu [PR #895:n kommenttiin #7080823786](https://github.com/ozirix-dev/Reseptit/pull/895#issuecomment-7080823786). Katselmoitu sisältö-HEAD: `2109621209daecb12dcde6474b4ab229e17554be`. Tulos: **sisällöllinen PASS**, muodollinen käännösportti **HOLD**.

- FI Git-blob: `61b92f37817a09c4d04bdaba1acc378c1918f0a3`.
- Korjattu TH Git-blob: `d7ee3febd451002866bcee269e0c676c46ed5a48`.
- Repon `semanticHash`-mukainen FI source_hash: `93a75fbf882225b1aa91c496fa65308c85a58f30234c27d16907eb7a765575a2`.
- Repon `semanticHash`-mukainen korjatun TH:n translation_hash: `fc06ef9e4e9f022495c257cabe259d40f0579bad9b674141847d352cadb5f175`.
- Chat-6 huomasi erillisen jo olemassa olevan P2-toimitushuomion: valinnainen vehnäleipä voi sisältää gluteenia, eikä FI/TH-kieliversiossa ole erillistä allergeenihuomautusta. Tätä ei muuteta tässä PR:ssä eikä se ole nyt korjattavan TH-yksikön merkitysero.
- `gazpacho:th`-rekisterin vanha 12.11. hyväksyntä ei koske korjattua TH-tiivistettä. Chat-6:n riippumaton sisältöarvio ei ole Codexin käännöspolitiikan mukainen muodollinen katselmointi, eikä GitHubin yleinen Codex Code Review `no findings` sellaisenaan osoita koko FI→TH-parin merkitysvastaavuuden hyväksyntää.

Ennen rekisterimuutosta vaaditaan **todellinen koko FI→TH-parin Codex-merkityskatselmointi** näille nykyisille tiivisteille, kirjattu tulos ja viite. Vasta hyväksytyn todisteen jälkeen Chat-4 voi päivittää `meta/kaannokset/codex-review-evidence.json`-rekisterin sovitulla tiedosto-omistajuudella ja ajaa täsmä-HEADin Recipe site -CI:n. `validate:changed-content` ei saa ohittaa. Chat-1 yksin vastaa Repo Guardin Ready/merge-päätöksestä ja main-CI:n jälkitarkistuksesta.
