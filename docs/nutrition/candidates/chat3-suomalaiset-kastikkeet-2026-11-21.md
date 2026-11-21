# Chat 3 – kastikkeiden ravintolaskennan lähtöaineisto

**Päivä:** 21.11.2026; **PR:** #808; **lähtö-HEAD:** `10cce14b379aef981ebb80cbcbe7a266ac5c21a0`.

Tämä ei ole ravintolaskelma eikä julkinen ravintoarvio. Kyseessä on kymmenen reseptin ainesosa- ja lähtötiivisteinventaario. Kaikki punnitut määrät, yksiköt ja FI-lähdetekstit on luettu GitHubin omasta Chat 3 -haarasta. Rivejä yhteensä **63**; nestetilavuutta ml-yksikössä ilmoittavia rivejä **12**, joihin tarvitaan tuotekohtainen g/ml-muunnos.

| recipe_id | Annoksia | Ainesrivejä | ml-rivejä | Laskennan input SHA-256 (alku) |
| --- | ---: | ---: | ---: | --- |
| `perinteinen-ruskea-kastike` | 4 | 5 | 1 | `8452c0f3c108…` |
| `kermainen-tillikastike` | 4 | 6 | 0 | `3c80ddde80a9…` |
| `kantarellikastike` | 4 | 9 | 2 | `61bb6ce261bf…` |
| `sinappikastike-joulukinkulle` | 6 | 8 | 2 | `171034daac90…` |
| `kylma-piparjuurikastike` | 4 | 6 | 1 | `71080036d23e…` |
| `perinteinen-munakastike` | 4 | 7 | 1 | `54b24ba297bc…` |
| `kermainen-pippurikastike` | 4 | 6 | 2 | `91c2af86c2f1…` |
| `perinteinen-valkokastike` | 6 | 6 | 1 | `cfd1a39123f8…` |
| `puolukkakastike-jalkiruokiin` | 6 | 4 | 1 | `c50fd88ab225…` |
| `perinteinen-vaniljakastike` | 6 | 6 | 1 | `10e4c40b7383…` |

Ainesosaluettelo, reseptin täydellinen SHA-256 sekä `recipeNutritionInputHash`-syöttötiiviste jokaiselle reseptille ovat erillisessä **[koneellisesti luettavassa JSONissa](chat3-suomalaiset-kastikkeet-2026-11-21.json)**. Tiivistealgoritmi tarkistettiin olemassa olevaa `fetavaahto-kasvistikuilla`-laskentapakettia vastaan; tulos vastasi repossa olevaa `sourceHash`-arvoa.

## Ennen laskentaa

- Sido jokainen ainesosa **oikeaan elintarvikkeen tilaan ja koostumukseen** (raakana/kypsänä, rasvapitoisuus, laimennettu valmis liemi, sinappien tuote, soijakastikkeen valinta). Älä käytä saman tyyppisen toisen tuotteen arvoja tarkistamatta.
- Määritä ml → g tuotekohtaisesti. Älä oleta kaikille kermoille, maidolle, nesteille tai liemille samaa tiheyttä tai jätä yksiköitä huomiotta.
- Määritä syötävä osuus, valmisteen saanto ja keitto-/haihtumahävikki. Siivilöity ja siivilöimätön puolukkakastike ovat erisuuruisia saantoja.
- Fineli-ainesosavastaavuus, polyolit/CHO-määritelmä ja ravintolaskennan turvallisuusrajat on tarkistettava projektin omalla `nutrition-model`-polulla.
- **Kaikki neljä ravintoarvokenttää puuttuvat edelleen tarkoituksella.** GK:n numeerista arvoa ei julkaista ilman hyväksyttyä valmistuskohtaista GI-arviota. Lähtöaineiston kokoaminen ei anna Ready-/merge-/Cloudflare-lupaa.

Lähteiden ja allergeenien alustava katselmointi on dokumentoitu `docs/reviews/new-recipes/` ja `docs/reviews/recipes/` -hakemistoissa. Tämä ei ole hyväksytty ravintoevidenssi `docs/nutrition/calculations/`-hakemistoon.

## Täsmätuotepäivitys 21.11.2026

Kolmen aiemmin yleisellä valmisliemellä/sinapilla kuvatun kastikkeen ainesosat sidottiin yksilöityihin tuotteisiin ja EAN-tunnuksiin: ruskea kastike (Puljonki Signature Lihaliemi + Kikkoman Naturally Brewed), sinappikastike (Puljonki Signature Kasvisliemi + Turun Sinappia Mieto + Maille Dijon Kokojyväsinappi) sekä pippurikastike (Puljonki Signature Lihaliemi + Maille Dijon Original). Muutos ei vaikuttanut annos- eikä määrätietoihin, mutta **ainesosarivien nimet ja siten ravintolaskennan `sourceHash`-syöttötiivisteet muuttuivat**. Yllä olevat kolme tiivistettä on päivitetty vastaamaan JSON-kandidaattia. Varsinainen ravintolaskenta on edelleen tekemättä. Maille-tuotteiden sulfiitit on kirjattu turvallisuuskatselmointiin; sulfiittipitoisuutta valmiissa annoksessa ei arvata.

## Tillikastikkeen punnitustarkennus

Kermaviili: laktoositon 10–12 % rasvaa, Fineli #11152. Sitruunamehu muutettu 12 ml:sta 12 g:ksi; laskennan syöttötiiviste päivittyi. Kymmenen reseptin 63 ainesosariviä ennallaan ja ml-yksikköisiä rivejä nyt 13. Tässä vaiheessa ei vielä väitetä laskettua tai hyväksyttyä ravintoarvoa.

## Puolukkakastikkeen punnitustarkennus

Puolukkakastikkeen sitruunamehu muutettu 10 millilitrasta 10 grammaan ja valinnaisesta siivilöinnistä luovuttu: kaikki marjakuoret ja kuidut jäävät annokseen. Tämä varmistaa retentioperusteen ravintoarviolaskennalle. 63 ainesosariviä ennallaan, ml-rivejä nyt 12.
