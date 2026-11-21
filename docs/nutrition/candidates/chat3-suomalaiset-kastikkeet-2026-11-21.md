# Chat 3 – kastikkeiden ravintolaskennan lähtöaineisto

## Nykytilanne – Chat 3, 21.11.2026

**4/10 kastikkeella on nyt lähdeaineistoon sidottu ravintolaskentapaketti, neljä makroarvoa kaikilla kielillä ja reseptikohtainen `nutrition: pass` -katselmointimerkintä.** Kaikki reseptit ja niiden käännökset ovat edelleen Draft/HOLD; GK on määrittämätön. Arvot ovat ainesosien keskiarvoista laskettuja arvioita, eivät tuotemerkkien tai laboratorion mittaustuloksia.

| Kastike | Annoksia | Nettohiilihydraatit g | Kokonaishiilihydraatit g | Proteiini g | Rasva g | Pienet lähdepuutteet |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Kermainen tillikastike | 4 | 2,89 | 3,07 | 1,52 | 6,04 | Ei poisjätettyjä ainesosia |
| Puolukkakastike | 6 | 12,88 | 13,92 | 0,23 | 0,27 | Ei siivilöintiä, marjakuitu mukana |
| Perinteinen valkokastike | 6 | 8,36 | 8,57 | 3,25 | 7,75 | Valkopippuri 0,4 g ja muskottipähkinä 0,2 g: yhteinen konservatiivinen yläraja 0,11 g/makro/annos ja 0,9 kcal/annos |
| Perinteinen munakastike | 4 | 10,53 | 10,90 | 7,89 | 12,52 | Valkopippuri 0,3 g: yläraja 0,08 g/makro/annos ja 0,68 kcal/annos |

Kaikkien neljän FI-lähteen täsmä-SHA256, ravintolaskennan syöttötiiviste ja ainesosarivit on tarkistettu omiin `docs/reviews/new-recipes/*.json` ja `docs/nutrition/calculations/*.json` -paketteihin. Kaikki 16 FI/EN/SV/TH-tiedostoa sisältävät yhtenevät neljä makroarvoa ja `status: draft` -tilan.

**Jäljellä 6:** ruskea kastike, kantarellikastike, sinappikastike, kylmä piparjuurikastike, kermainen pippurikastike ja vaniljakastike. Niiden ravintotietueet ovat vielä PENDING: tarvitaan lähteeseen sidotut Fineli-ainesosakortit tai nimettyjen tuotteiden ravintoarvot, kaikki makroravinteet ja polyolit sekä mahdolliset ml→g-muunnokset. Puuttuvaa tietoa ei korvata nollalla.

Tämä raportti ei yksin täytä EN/SV/TH:n lopullista semanttista katselmointia, AI-kuvien julkaisuhyväksyntää, Repo Guardin Ready/merge-porttia eikä Cloudflare-tuotantojulkaisun erillistä lupaa.

---

**Päivä:** 21.11.2026; **PR:** #808; **lähtö-HEAD:** `10cce14b379aef981ebb80cbcbe7a266ac5c21a0`.

Seuraava alkuperäinen inventaario kertoo lähtötilasta ennen yllä näkyviä neljää laskelmaa. Kyseessä on kymmenen reseptin ainesosa- ja lähtötiivisteinventaario. Kaikki punnitut määrät, yksiköt ja FI-lähdetekstit on luettu GitHubin omasta Chat 3 -haarasta. Rivejä yhteensä **63**; nestetilavuutta ml-yksikössä ilmoittavia rivejä **10**, joihin tarvitaan tuotekohtainen g/ml-muunnos.

| recipe_id | Annoksia | Ainesrivejä | ml-rivejä | Laskennan input SHA-256 (alku) |
| --- | ---: | ---: | ---: | --- |
| `perinteinen-ruskea-kastike` | 4 | 5 | 1 | `8452c0f3c108…` |
| `kermainen-tillikastike` | 4 | 6 | 0 | `3c80ddde80a9…` |
| `kantarellikastike` | 4 | 9 | 2 | `61bb6ce261bf…` |
| `sinappikastike-joulukinkulle` | 6 | 8 | 2 | `171034daac90…` |
| `kylma-piparjuurikastike` | 4 | 6 | 1 | `71080036d23e…` |
| `perinteinen-munakastike` | 4 | 7 | 0 | `62e86f7d10d5…` |
| `kermainen-pippurikastike` | 4 | 6 | 2 | `91c2af86c2f1…` |
| `perinteinen-valkokastike` | 6 | 6 | 0 | `019aa958cb6b…` |
| `puolukkakastike-jalkiruokiin` | 6 | 4 | 1 | `c50fd88ab225…` |
| `perinteinen-vaniljakastike` | 6 | 6 | 1 | `10e4c40b7383…` |

Ainesosaluettelo, reseptin täydellinen SHA-256 sekä `recipeNutritionInputHash`-syöttötiiviste jokaiselle reseptille ovat erillisessä **[koneellisesti luettavassa JSONissa](chat3-suomalaiset-kastikkeet-2026-11-21.json)**. Tiivistealgoritmi tarkistettiin olemassa olevaa `fetavaahto-kasvistikuilla`-laskentapakettia vastaan; tulos vastasi repossa olevaa `sourceHash`-arvoa.

## Ennen laskentaa

- Sido jokainen ainesosa **oikeaan elintarvikkeen tilaan ja koostumukseen** (raakana/kypsänä, rasvapitoisuus, laimennettu valmis liemi, sinappien tuote, soijakastikkeen valinta). Älä käytä saman tyyppisen toisen tuotteen arvoja tarkistamatta.
- Määritä ml → g tuotekohtaisesti. Älä oleta kaikille kermoille, maidolle, nesteille tai liemille samaa tiheyttä tai jätä yksiköitä huomiotta.
- Määritä syötävä osuus, valmisteen saanto ja keitto-/haihtumahävikki. Siivilöity ja siivilöimätön puolukkakastike ovat erisuuruisia saantoja.
- Fineli-ainesosavastaavuus, polyolit/CHO-määritelmä ja ravintolaskennan turvallisuusrajat on tarkistettava projektin omalla `nutrition-model`-polulla.
- **Kuuden laskemattoman kastikkeen ravintoarvokentät puuttuvat edelleen tarkoituksella.** GK:n numeerista arvoa ei julkaista ilman hyväksyttyä valmistuskohtaista GI-arviota. Lähtöaineiston kokoaminen ei anna Ready-/merge-/Cloudflare-lupaa.

Lähteiden ja allergeenien alustava katselmointi on dokumentoitu `docs/reviews/new-recipes/` ja `docs/reviews/recipes/` -hakemistoissa. Tämä ei ole hyväksytty ravintoevidenssi `docs/nutrition/calculations/`-hakemistoon.

## Täsmätuotepäivitys 21.11.2026

Kolmen aiemmin yleisellä valmisliemellä/sinapilla kuvatun kastikkeen ainesosat sidottiin yksilöityihin tuotteisiin ja EAN-tunnuksiin: ruskea kastike (Puljonki Signature Lihaliemi + Kikkoman Naturally Brewed), sinappikastike (Puljonki Signature Kasvisliemi + Turun Sinappia Mieto + Maille Dijon Kokojyväsinappi) sekä pippurikastike (Puljonki Signature Lihaliemi + Maille Dijon Original). Muutos ei vaikuttanut annos- eikä määrätietoihin, mutta **ainesosarivien nimet ja siten ravintolaskennan `sourceHash`-syöttötiivisteet muuttuivat**. Yllä olevat kolme tiivistettä on päivitetty vastaamaan JSON-kandidaattia. Varsinainen ravintolaskenta on edelleen tekemättä. Maille-tuotteiden sulfiitit on kirjattu turvallisuuskatselmointiin; sulfiittipitoisuutta valmiissa annoksessa ei arvata.

## Tillikastikkeen punnitustarkennus

Kermaviili: laktoositon 10–12 % rasvaa, Fineli #11152. Sitruunamehu muutettu 12 ml:sta 12 g:ksi; laskennan syöttötiiviste päivittyi. Kymmenen reseptin 63 ainesosariviä ennallaan ja ml-yksikköisiä rivejä nyt 13. Tässä vaiheessa ei vielä väitetä laskettua tai hyväksyttyä ravintoarvoa.

## Puolukkakastikkeen punnitustarkennus

Puolukkakastikkeen sitruunamehu muutettu 10 millilitrasta 10 grammaan ja valinnaisesta siivilöinnistä luovuttu: kaikki marjakuoret ja kuidut jäävät annokseen. Tämä varmistaa retentioperusteen ravintoarviolaskennalle. 63 ainesosariviä ennallaan, ml-rivejä nyt 12.

## Valkokastikkeen punnitustarkennus

Maito punnitaan 500 g:ksi entisen 500 ml:n sijaan; vastaava FI/EN/SV/TH-ainesmuutos on sitova ravintolaskennan lähtöarvo. 63 ainesosariviä pysyy, ml-rivejä nyt 11. Valkopippurin 0,4 g ja muskottipähkinän 0,2 g tarvitsevat joko lähdearvot tai massaperusteisen konservatiivisen poisjättöarvion.

## Munakastikkeen lähtömuutos

400 ml täysmaitoa korvattiin 400 g:n punnitulla täysmaidolla, jotta laskenta ei tarvitse oletettua tiheyskerrointa. Kananmuna punnitaan valmiiksi keitettynä ja kuorittuna (120 g), Fineli #8513; valkopippurin 0,3 g vaikutus arvioidaan massaan sidotulla enimmäisvirheellä. 63 ainesosariviä ja neljä kieliversiota säilyvät; ml-rivejä on enää 10.

## Jatkotarkistus 22.11.2026 – vaniljakastikkeen lähdesidonta

- Erillinen [vaniljakastikkeen lähdekohtainen esiselvitys](perinteinen-vaniljakastike-source-basis-2026-11-22.md) tallennettu. Täysmaidon, maissitärkkelyksen, sokerin ja raa'an keltuaisen Fineli-pohjaiset arvot tarkistettu lähdetasolla; Salliselta-vaniljasokerille löytyi valmistajan makroravintoarvoluettelo.
- **Vaniljasokerin polyolipitoisuutta ei ole merkitty numeerisesti valmistajan ilmoituksessa**, eikä puuttuvaa arvoa saa muuttaa nollaksi. Lisäksi 450 ml täysmaitoa vaatii asianmukaisen massamuunnoksen; MILKWORKS antaa yleiseksi tiheysväliksi 1,028–1,034 g/ml, ei tietyn pakkauksen mittausta.
- Rajattu laskennallinen koe: 1,030 g/ml tiheydellä kuuden annoksen erässä **15,11 g imeytyvää hiilihydraattia, 3,13 g proteiinia ja 4,18 g rasvaa / annos** tiedossa olevista lähteistä. Nämä **eivät ole hyväksyttyjä ravintoarvokenttiä**. Netto-/kokonais-CHO:n lopulliset lukuarvot ja ravintolaskentatodiste pidätetään edelleen.
- Tila ei muutu: **4/10 laskentapakettia**, kuudella vielä `nutrition: pending`, kaikki 10 reseptiä ja 40 kielisivua **Draft/HOLD**. Uusia reseptikenttiä tai virallisia katselmointimerkintöjä ei tämän esiselvityksen perusteella lisätty.

## Jatkotarkistus 22.11.2026 – kylmä piparjuurikastike

- Uusi ei-julkinen [piparjuurikastikkeen lähdesidottu esiselvitys](kylma-piparjuurikastike-source-basis-2026-11-22.md): Valio Hyvä suomalainen Arki crème fraîche 12 % (EAN 6408430141227), Fineli-pohjainen tuore piparjuuri ja jo käytetty Fineli-sokerin lähdekortti antavat kolme tunnettua osalaskennan riviä. Valion 180 g pakkauskoko ei rajoita reseptin 200 g kokonaiskäyttömäärää.
- Sitruunamehun 12 ml ei ole punnittu 12 g; tarvitaan muunnos tai kaikkien neljän kielen yhtenevä massamuutos. Ruohosipulille tarvitaan tuoreeseen tuotteeseen sidottu ravintokortti. Valion crème fraîchen polyolit ja kuitutieto eivät täyty numerona; tiedot pidätetään, ei arvausta.
- Kolmen vahvistetun grammaperusteisen raaka-aineen CHO/proteiini/rasva-osalaskenta kirjattu vain auditointiin, **ei** julkaistavaksi eikä kokonaisreseptin arvoiksi. Ravintolaskentapakettien määrä pysyy **4/10** ja kuuden reseptin nutrition edelleen PENDING. GK määrittämätön, kaikki FI/EN/SV/TH Draft/HOLD.
