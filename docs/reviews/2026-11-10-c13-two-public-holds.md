# C13: kahden edelleen puutteellisen valmistusreseptin julkinen karanteeni

10.11.2026, issue #404:n kohdat #05 ja #37. [PR #425](https://github.com/ozirix-dev/Reseptit/pull/425) korjasi 11 muuta C13:n valmistusohjetta, mutta **näitä kahta ei saa ratkaista pelkällä uudella tekstitulkinnalla**.

| Kortti | Resepti | Lähtötilan puute | Kriteeri paluulle |
|---:|---|---|---|
| #05 | `intialainen-aloo-paratha` | Otsikon/ohjeen tarjoilujogurtti puuttuu aineslistasta; perunatäytteen valmistus, kokonaisaika ja ravintoperusta HOLD | Punnittu lisuke joko erilliseksi valinnaiseksi tai kokonaan pois, luotettava täyttö/kypsennys ja CHO/GK-uudelleenkatselmointi |
| #37 | `malesialainen-laksa-lemak-aamiaiseksi` | Kookoskeitossa ei ole currylle olennaista laksa-maustetahnaa eikä sen vastaavia ainesosia | Punnittu maustetahna ja mahdolliset allergiat, aidosti laksa lemak -ohje, laskettu makro-/GI/GK-tuotemalli ja kielikatselmointi |

**Lähdevertailut:** [King Arthur Baking – Aloo Paratha](https://www.kingarthurbaking.com/recipes/aloo-paratha-spiced-potato-stuffed-flatbread-recipe) sisältää perunatäytteen ja merkitsee jogurtin tarjoilussa valinnaiseksi, ei osaksi punnittua leipätaikinaa. [SBS Food – Curry laksa](https://www.sbs.com.au/food/recipe/curry-laksa-nyonya-laksa-lemak/vglnllxtq) kuvaa kookosliemen ja moniaineisen maustetahnan yhdistelmän; pelkkä kookosmaito ja nuudeli ei ole tämän ruokalajin vastaava valmiste. Näitä ei käytetä mekaaniseen grammojen muuttamiseen.

Julkinen karanteeni toteutetaan vain `site/scripts/public-recipe-quarantine.ts`-listalla. Yhteensä nyt 18 julkisuudesta pois vedettyä recipe_id:tä (PR #407:n 3, PR #419:n 8, PR #423:n 5 ja tämä PR:n 2). Kanoniset Markdownit, GK100-hyväksynnät, GI/GK-luvut ja ravintoevidenssit säilyvät historiallisina muuttumattomina. Tähän versioon jää FI-aamiaisia 132, ei uutta hyväksyntää puuttuville aineille.

**Ei** väitetä fyysistä koepaistoa, ei tehdä Cloudflare/Recipavo-tuotantosiirtoa eikä suljeta issue #404:n kortteja ennen oikean reseptiversion evidenssiä.
