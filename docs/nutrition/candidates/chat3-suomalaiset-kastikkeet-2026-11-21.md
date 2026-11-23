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

## Jatkotarkistus 22.11.2026 – piparjuurikastikkeen punnitus

- Kylmän piparjuurikastikkeen sitruunamehun määrä muutettiin tarkoituksellisesti **12 ml → 12 g punnittua mehua**; FI/EN/SV/TH yhdenmukaistettu. Kyse ei ole tiheysoletuksesta.
- Uusi FI-lähteen SHA-256 `9a577bfdf6e610f3dfee98ff802de6841a2b3b9e23cc30544cea65345ed03260` ja `recipeNutritionInputHash` `c6fd529885f21f835fa6a97c4873c05bd27a9b11b8d04a3c6de68499666945a0` sidottu kirjalliseen review'hun ja kandidaattirekisteriin. Vanhempien osuuksien ml-lukumäärät ovat historiallisia tilannekuvia.
- Neljä laskentapakettia kymmenestä edelleen valmiina; piparjuurikastikkeen `nutrition: pending` ja koko PR:n Draft/HOLD pysyvät.

## Jatkotarkistus 22.11.2026 – vaniljakastikkeen 450 g täysmaito

- Vaniljakastikkeen täysmaito muutettiin **450 ml → 450 g punnittua maitoa** kaikissa FI/EN/SV/TH-resepteissä. Tämä on reseptin täsmennys, ei maitotiheyden oletus.
- Uusi lähdetiedoston SHA-256 `87d3a19d59f5a5cad0444bbf1aaa62d330bea230d6558f61d97895a66b3af771`, uusi ravintosyötteen `sourceHash` `49e5a1e7149059baaf6b39e13b534ed179cacd632041eb07e8442d7b06cf11c7`. Vanha 463,5 gramman tiheysoletusesimerkki on korvattu 450 g:n erillisellä osalaskelmalla lähdemuistiossa.
- Numeeriset ravintoarvot edelleen WITHHELD; vaniljasokerin polyoli-/kuituevidenssi ja muut julkaisuehdot ovat HOLD. Erän laskentapaketteja edelleen 4/10.

## Julkaisuportin ja laskentakandidaattien erottaminen – 22.11.2026

Uusimman `main`-haaran `site/scripts/nutrition-audit.ts` ja `site/scripts/validate-changed-content.ts` hyväksyvät `docs/nutrition/calculations/*.json`-todisteet vain **julkaistun** FI-lähteen yhteydessä. Chat 3:n kymmenen FI-reseptiä ovat tarkoituksella edelleen `status: draft`. Tämän seurauksena neljän sisällöltään laskennallisen, mutta julkaisemattoman paketoinnin paikka on nyt `docs/nutrition/candidates/draft-calculations/`, ei virallinen `docs/nutrition/calculations/`.

Kandidaatit (alkuperäiset JSON-sisällöt säilytetty muuttumattomina): `kermainen-tillikastike`, `perinteinen-munakastike`, `perinteinen-valkokastike`, `puolukkakastike-jalkiruokiin`. Reseptikohtaisiin tarkistus-JSON-tietueisiin vaihdettiin `nutrition: pending` ja tyhjä `nutrition_evidence`, koska ne eivät ole nykyisen julkaisuportin hyväksyttyjä laskentatodisteita. Nelikielisten Draft-reseptien neljä numerokenttää säilyivät toistaiseksi **vain ehdokkaina**, joita ei julkaista ilman myöhempää lopullista evidenssiä.

Tarkka tilanne: **4/10 dokumentoitua laskentakandidaattia, 0/10 julkaistuun FI-lähteeseen kiinnitettyä virallista laskentapakettia, 6/10 ravintosisällön osalta edelleen keskeneräistä.** Tämä ei hävitä tehtyä aritmetiikkaa eikä muuta raaka-ainemääriä; myöhempi hyväksytty julkaisuversio vaatii varsinaisen calculations-todisteen ja uudet CI/Repo Guard -portit. PR pysyy Draft/HOLD.

## Jatkotarkistus 22.11.2026 – ruskean kastikkeen täsmätuotteet

- Uusi [ruskean kastikkeen tuotekoostumusmuistio](perinteinen-ruskea-kastike-source-basis-2026-11-22.md): Puljonki Signature -liemen EAN 6416796728013 valmistaja- ja kauppatieto täsmäävät (100 ml:n rasva, CHO, proteiini ja kuitu); 500 ml:n osasumma laskettu suoraan tilavuusperusteesta. Kikkoman Naturally Brewed -soijakastikkeen valmistajan 100 ml -tiedot varmistettu, mutta reseptin määrä on 4 g. Tiheys, polyolit ja virallisen mallin 100 g -yksikkömuunnos jäävät avoimiksi; ei automaattisia nollia eikä julkisia makrokenttiä.

## Chat-3 – neljän laskentakandidaatin riviaritmetiikan tarkistus 22.11.2026

Tarkistuslähteet ovat `docs/nutrition/candidates/draft-calculations/`-hakemiston neljä JSON-tiedostoa, **eivät** hyväksyttyjä `docs/nutrition/calculations/`-julkaisupaketteja. Laskin jokaiselle ainesriville `amount × edibleFraction × retainedFraction × per100g / 100` ja jaoin saadut summat annosmäärällä.

| Kandidaatti | Rivejä | Tunnettu CHO g/annos | Proteiini g/annos | Rasva g/annos | Puuttuvat |
| --- | ---: | ---: | ---: | ---: | --- |
| kermainen-tillikastike | 6 | 2,8905 | 1,5249 | 6,0441 | Ei puuttuvia rivitietueita tässä laskelmassa |
| perinteinen-munakastike | 7 | 10,5336 | 7,8853 | 12,5165 | Valkopippurin tietue |
| perinteinen-valkokastike | 6 | 8,3632 | 3,2492 | 7,7502 | Valkopippurin ja muskottipähkinän tietueet |
| puolukkakastike-jalkiruokiin | 4 | 12,8750 | 0,2264 | 0,2737 | Ei puuttuvia rivitietueita tässä laskelmassa |

Numerot ovat **tunnettujen rivien laskennallisia osasummia** (CHO = Finelin käytettävissä oleva hiilihydraatti), eivät pyöristystä pidemmälle varmistettuja lopullisia reseptiarvoja. Kaksi puuttuvien mausteiden reseptiä ei saa saada niistä implisiittisiä nollia. Ehdokkaiden `reviewerStatus: AUTOMATED ONLY` pysyy voimassa. Lähdetietojen tuotekohtaiset tarkistukset, erillinen julkaisuhyväksyntä ja loput kuusi kastiketta ovat kesken.

**Portti:** PR #808 pysyy Draft/HOLD. Tämä lisäys on sisäinen aritmetiikkatarkistus, eikä muuta 0/10 hyväksyttyä julkaistuun FI-lähteeseen liitettyä laskentapakettia tai avaa Ready/mergeä.
