# Karnivore 10: ravinto- ja GK-esikäsittely – 11.11.2026

**Tilanne: HOLD.** Ei valmiita julkaistavia ravintoarvoja tai GK-pistelukuja. Kymmenen FI-reseptin raakaaineet on kohdistettu olemassa oleviin lähdetietueisiin ja erotettu vahvistamattomat tuote- ja saantokysymykset.

## Lähteet ja toistettava aineisto

- `docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json` sisältää raakapainot, annosmäärät, ainekohtaiset lähde-ID:t, 100 g:n lähdearvot, luottamusluokan ja esteet.
- `docs/nutrition/food-records.json`: THL Fineli Release 20, CC BY 4.0.
- `docs/nutrition/afcd-release-3-reference.json`: Food Standards Australia New Zealand AFCD Release 3, CC BY-SA 3.0 Australia.
- Elintarvikkeiden koostumusarvot koskevat tiettyjä tuotetyyppejä. Matriisin `proxy` ei ole lupa käyttää arvoa reseptin metatiedoissa ilman vastaavuuspäätöstä.

## Esteet (automaattinen kymmenen reseptin läpikäynti)

| Resepti | Puuttuvia tietueita | Välillisiä vastineita | Tarkistettava |
| --- | ---: | ---: | --- |
| `karnivore-steak-and-eggs` | 0 | 1 | entrecôte-pihviä |
| `karnivore-smashburger` | 1 | 1 | naudan jauhelihaa, naudan talia |
| `karnivore-voilohi-pannulla` | 0 | 1 | nahallista lohifileetä |
| `karnivore-naudan-lyhytkylki` | 1 | 0 | luullisia naudan short ribs -kylkipaloja |
| `karnivore-rapeat-kananreisipalat` | 0 | 1 | nahallisia, luullisia broilerin reisipaloja |
| `karnivore-jauhelihakulho-munalla` | 1 | 0 | naudan jauhelihaa |
| `karnivore-rapea-porsaan-kylki` | 1 | 0 | nahallista porsaan kylkeä |
| `karnivore-maksa-ja-pekoni` | 0 | 1 | sokeritonta pekonia |
| `karnivore-meatza` | 1 | 2 | naudan jauhelihaa, sokeritonta pekonia, mozzarellajuustoa |
| `karnivore-lammaskyljykset-voissa` | 0 | 1 | luullisia lammaskyljyksiä |

## Laskennan esimerkit – EIVÄT ole julkaistavia ravintoarvoja

- Steak & Eggs: 220 g kuoretonta kananmunaa × 0,3 g CHO/100 g ja 20 g voita × 0,8 g CHO/100 g = 0,82 g kahteen annokseen eli **0,41 g/annos** näistä kahdesta aineksesta. Entrecôten AFCD-scotch-fillet-vastineen proteiini- ja rasvalukujen tuotekohtainen vastaavuus on vielä epävarma.
- Pannulohi: 35 g voita × 0,8 g/100 g = 0,28 g kahteen annokseen eli **0,14 g/annos** voista. Lohifileen AFCD-viite antaa 0 g/100 g, mutta nahan, kalan alkuperän ja syötävän osuuden erot pitää vielä arvioida.
- Maksa ja pekoni: 400 g naudanmaksaa × 5,0 g CHO/100 g = 20 g. 15 g voita tuo 0,12 g lisää. Kolmeen annokseen jakautuva maksa+voi-skenaario on noin **6,71 g/annos** ENNEN pekonin tuoteselostetarkistusta. Tämä kumoaa väitteen, että kaikki karnivore-ruoat olisivat hiilihydraatittomia.

Näitä lukuja ei kirjata reseptien `carbs_*`-kenttiin, koska koko reseptin ravintoarvojen laskentaperusta ja paiston saanto eivät ole vielä hyväksyttyjä.

## GK:n käsittely

- Eläinperäinen koostumus ei yksin todista GK=0:aa tai validia GI-arvoa.
- Tarkastellaan vain todellisia imeytyviä hiilihydraatteja ja projektin ravinto- sekä GI/GK-portin sallimia lähteitä; GH CI:n läpäisy ei vastaa ravintokatselmointia.
- Erityisesti naudanmaksalle, kananmunalle, voille ja maitotuotteille ei aseteta automaattista nollaa. Merkitään GK-päätös erikseen, kun tarvittava näyttö on riittävä.

## Mitä seuraavaksi

1. Tuotekohtaiset vahvistukset (erityisesti 20 % jauheliha, sokeriton pekoni, mozzarella ja pihvien rasvaisuus).
2. Luullisen short ribs-, kananreisi- ja lammaskyljyslihan syötävä saanto sekä sianvatsan nahan ja sulaneen rasvan käsittely.
3. Mitatut tai perustellut rasvan säilyvyysosuudet: voin kaataminen annokseen, pannuun jäävä rasva ja meetzan valutettu rasva.
4. Reseptikohtaiset, lähteistetyt `docs/nutrition/calculations/`-merkinnät sekä numerot vain hyväksytyissä metatiedoissa.
5. Kuvat ja tarkistetut lähdematchit, julkaisuportti, neljän kielen julkaisu ja vasta sitten PR #450:n SHA-lukittu karnivore-luokitus.

## Säädös-/turvallisuuslähteet

- [Ruokavirasto: liha ja jauheliha](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/liha/): jauheliha kauttaaltaan kypsäksi, broileri 75 °C ja sika 70 °C.
- [Ruokavirasto: maksa raskauden aikana](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/maksa-ja-maksaruoat/maksan-kaytto-raskauden-aikana/): pääruokana tarjottavaa maksaruokaa vältetään raskauden aikana.
- [AFCD Release 3](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files) sisältää 1 588 elintarvikkeen tiedot; Australian tuotekoostumus ei automaattisesti vastaa Suomessa myytävää elintarviketta.

### Suodattimen integraatio ilman omistajuuskonfliktia

- PR #450:n `dietTags` ja SHA-lukittu hyväksyntä ovat eri PR:n vastuulla. PR #448 EI muuta sen `site/scripts/build-content.ts`- tai `site/src/features/recipes/`-tiedostoja.
- Pelkkä `tags: [carnivore, karnivore]` ei vielä tuota hyväksyttyä karnivore-suodatinosumaa.
- Hyväksy lähdeviitteet PR #450:n manifestiin vasta siinä commitissa, johon lopullinen julkaistava FI-resepti on lukittu.

## Automaattinen estotarkistus

- `site/scripts/karnivore-draft-gate.ts` lukitsee tämän erän tunnukset, eläinperäiset ainesosan nimikkeet, grammaerittelyn ja Draft-tilan.
- `site/scripts/validate-changed-content.ts` kutsuu tarkistusta jokaiselle muuttuneelle karnivore-reseptille; näin CI estää uuden kasviaineksen, ennenaikaisen `published`-tilan ja perustelemattoman nollaravintoarvon.
- Itsenäinen regressiotesti: `cd site && npx tsx --test tests/karnivore-draft-gate.test.ts`.
