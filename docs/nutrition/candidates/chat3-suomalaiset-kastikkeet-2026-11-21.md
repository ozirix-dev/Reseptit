# Chat 3 – kastikkeiden ravintolaskennan lähtöaineisto

**Päivä:** 21.11.2026; **PR:** #808; **lähtö-HEAD:** `10cce14b379aef981ebb80cbcbe7a266ac5c21a0`.

Tämä ei ole ravintolaskelma eikä julkinen ravintoarvio. Kyseessä on kymmenen reseptin ainesosa- ja lähtötiivisteinventaario. Kaikki punnitut määrät, yksiköt ja FI-lähdetekstit on luettu GitHubin omasta Chat 3 -haarasta. Rivejä yhteensä **63**; nestetilavuutta ml-yksikössä ilmoittavia rivejä **14**, joihin tarvitaan tuotekohtainen g/ml-muunnos.

| recipe_id | Annoksia | Ainesrivejä | ml-rivejä | Laskennan input SHA-256 (alku) |
| --- | ---: | ---: | ---: | --- |
| `perinteinen-ruskea-kastike` | 4 | 5 | 1 | `6430473ab619…` |
| `kermainen-tillikastike` | 4 | 6 | 1 | `2fa8e3c648a1…` |
| `kantarellikastike` | 4 | 9 | 2 | `61bb6ce261bf…` |
| `sinappikastike-joulukinkulle` | 6 | 8 | 2 | `4f8899e9ffa8…` |
| `kylma-piparjuurikastike` | 4 | 6 | 1 | `71080036d23e…` |
| `perinteinen-munakastike` | 4 | 7 | 1 | `54b24ba297bc…` |
| `kermainen-pippurikastike` | 4 | 6 | 2 | `a9ef4648da15…` |
| `perinteinen-valkokastike` | 6 | 6 | 1 | `cfd1a39123f8…` |
| `puolukkakastike-jalkiruokiin` | 6 | 4 | 2 | `dc57fc50dec6…` |
| `perinteinen-vaniljakastike` | 6 | 6 | 1 | `10e4c40b7383…` |

Ainesosaluettelo, reseptin täydellinen SHA-256 sekä `recipeNutritionInputHash`-syöttötiiviste jokaiselle reseptille ovat erillisessä **[koneellisesti luettavassa JSONissa](chat3-suomalaiset-kastikkeet-2026-11-21.json)**. Tiivistealgoritmi tarkistettiin olemassa olevaa `fetavaahto-kasvistikuilla`-laskentapakettia vastaan; tulos vastasi repossa olevaa `sourceHash`-arvoa.

## Ennen laskentaa

- Sido jokainen ainesosa **oikeaan elintarvikkeen tilaan ja koostumukseen** (raakana/kypsänä, rasvapitoisuus, laimennettu valmis liemi, sinappien tuote, soijakastikkeen valinta). Älä käytä saman tyyppisen toisen tuotteen arvoja tarkistamatta.
- Määritä ml → g tuotekohtaisesti. Älä oleta kaikille kermoille, maidolle, nesteille tai liemille samaa tiheyttä tai jätä yksiköitä huomiotta.
- Määritä syötävä osuus, valmisteen saanto ja keitto-/haihtumahävikki. Siivilöity ja siivilöimätön puolukkakastike ovat erisuuruisia saantoja.
- Fineli-ainesosavastaavuus, polyolit/CHO-määritelmä ja ravintolaskennan turvallisuusrajat on tarkistettava projektin omalla `nutrition-model`-polulla.
- **Kaikki neljä ravintoarvokenttää puuttuvat edelleen tarkoituksella.** GK:n numeerista arvoa ei julkaista ilman hyväksyttyä valmistuskohtaista GI-arviota. Lähtöaineiston kokoaminen ei anna Ready-/merge-/Cloudflare-lupaa.

Lähteiden ja allergeenien alustava katselmointi on dokumentoitu `docs/reviews/new-recipes/` ja `docs/reviews/recipes/` -hakemistoissa. Tämä ei ole hyväksytty ravintoevidenssi `docs/nutrition/calculations/`-hakemistoon.
