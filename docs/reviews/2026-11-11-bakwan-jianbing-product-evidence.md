# Issue #404 — Bakwanin ja jianbingin tuote- ja annospainon lähdekatselmointi

**11.11.2026.** Aineisto on uusintatarkastettu kahdesta lähdereseptistä ja niitä vastaavista ainesosakohtaisista `docs/nutrition/calculations`-tiedostoista, joita ei muuteta. Kyseessä on **todistepohjan täsmennys, ei ravinto- tai GK-hyväksyntä**.

## Päätös

| Resepti | Varmennettu | Ei varmennettu | Päätös |
|---|---|---|---|
| Indonesialainen bakwan | Fineli #300 soveltuu raa'an porkkanan keskimääräiseksi ravintokoostumuslähteeksi, ja talletettu arvo on 5,56 g käytettävissä olevia HH /100 g | Nimenomaisen porkkanan syötävä paino; talletettu 60 g/kpl on vain annospainomalli; koko käytetty taikinavesi ja paistoöljyn todellinen jäämä | **HOLD** |
| Jianbing-munalettu | AFCD Release 3 F005702 on fermentoidun soijapaputahnan koostumusviite (19,7 g käytettävissä olevia HH /100 g) ja nykyinen lasku käyttää 1 rkl = 15 g | Käytetyn tahnan todellinen tuote ja valmistustyyppi; kyseisen ruokalusikan mitattu massa; tuotteen oma ravintoarvo/GI | **HOLD** |

## Ensisijaiset ravintotietolähteet

- **Fineli #300, Porkkana, käsittelemätön:** https://fineli.fi/fineli/fi/elintarvikkeet/300 . THL:n julkaisema tietue esittää imeytyvää hiilihydraattia noin 5,6 g/100 g ja kasviksen koostumuksen, mutta ei todista tämän annoksen porkkanan punnittua massaa.
- **Finelin tietokannan lukuohje:** https://fineli.fi/fineli/content/file/7 . Fineli kertoo käyttävänsä keskiarvoelintarvikkeita; yksittäiset tuotemerkit ja todellinen syötävä annos voivat poiketa lähdemallista.
- **Australian Food Composition Database Release 3, F005702:** https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F005702 ja aineiston kuvailu https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files . AFCD:n `Paste, soybean`-profiilin 19,7 g käytettävissä olevia HH/100 g on luettavissa myös alkuperäiseen tietueeseen viittaavasta koosteesta https://www.weightloss.com.au/food-nutrition-tables/food/paste-soybean-f005702/ . Tämä ei yksilöi käytettyä kastiketta.

## Kulinaarinen vastaavuus — merkittävä jianbing-este

Jianbingin yhteydessä käytetään muun muassa **huangdoujiangia** (fermentoitu soijapaputahna), **tianmianjiangia** (usein vehnäpohjainen makea fermentoitu tahna), chilitahnaa ja erilaisia yhdistelmiä. Nämä eivät ole sama tuote eivätkä suoraan vaihdettavissa samaan ravintolaskenta-ID:hen. Lähteet:

- https://redhousespice.com/jian-bing/ (jianbingin yleiset kastiketyypit)
- https://thewoksoflife.com/sweet-bean-sauce-tian-mian-jiang/ (tianmianjiangin ja soijapaputahnan erojen yksilöinti)

Nykyisen reseptin **`soijapaputahnaa`** on periaatteessa mahdollinen, pelkistetty jianbing-versio. Se ei kuitenkaan tarkoita, että mikä tahansa sweet bean sauce tai tianmianjiang olisi ravintosisällöltään sama kuin AFCD:n australialainen fermentoitu `Paste, soybean`. **Tähän ei saa tehdä tuotevaihtoa hyväksyntäportin ohi**, eikä alkuperäistä reseptiä muokata pelkästään tunnetumman kastikkeen perusteella.

## Vaadittu näyttö hyväksyntä-PR:ään

1. Bakwan: valitun version porkkana **punnitaan kuorittuna/syötävänä grammoina**. Määrä voidaan sen jälkeen kirjoittaa uuteen punnittuun reseptiversioon ja laskelma tehdä uudelleen. Talletettu 60 g pysyy siihen asti mallina, ei mittauksena.
2. Jianbing: valitaan **täsmällinen tuote (valmistaja, tuotteen nimi, koostumus ja ravintosisältö/100 g)**, todetaan onko se soija- vai vehnäpohjainen tai muunlainen seos, punnitaan käytetty ruokalusikallinen grammoina ja varmistetaan ravinnon laskentaperusta.
3. Molemmille: aineskohtainen ravintoarvojen ja erityisesti käytettävissä olevien hiilihydraattien **riippumaton uudelleenlaskenta** sekä GI/GK-lähdemätsäys. Olemassa oleva `AUTOMATED ONLY` -arvo ei kelpaa tuotekohtaisen hyväksynnän todisteeksi.
4. Uusi versionmukainen lähde-/laskenta-SHA, mahdolliset kieliversioiden merkitystarkistukset ja PR:n täsmä-HEAD CI PASS. Vasta tämän jälkeen erillinen julkaisupäätös.

## Toteutettu valvonta

`site/scripts/bakwan-jianbing-product-evidence.ts` lukee alkuperäiset FI-reseptit ja talletetut aineskohtaiset laskelmat, varmistaa **kaikki neljä Git-blob-SHA-lukkoa**, reseptien ainesrivit, mallipainot ja käytetyt ravintoarvot. Testit estävät tietueen tai laskentamallin hiljaisen vaihtumisen ja sen, että `authorizedMacro` tai `authorizedGk` muuttuisi hyväksytyksi ilman uutta katselmointia.

Käyttö: `cd site && npm run audit:product-c5`. Tuloksessa on aina `status: HOLD_PRODUCT_AND_MASS`, `approved: 0`, ellei uutta erillistä hyväksyntämenettelyä tehdä.

**Ei muutoksia** alkuperäisiin resepteihin, ainesosiin, makrolukuihin, GI/GK-lähteisiin, karanteeniin, käännöksiin tai Cloudflare-sivuun. Tämä on jo testatun C5-aritmetiikan jatkotutkimus, joka kohdistaa seuraavan korjausvaiheen täsmällisiin puuttuviin tuotetietoihin.
