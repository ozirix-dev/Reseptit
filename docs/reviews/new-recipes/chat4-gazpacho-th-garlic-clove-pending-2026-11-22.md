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

Tämä työhaara sisältää korjausehdotuksen, testin ja muistion, mutta **sille ei ole avattu PR:ää** eikä sitä ole otettu julkaisuun, koska vaadittu riippumaton hyväksyntä puuttuu.
