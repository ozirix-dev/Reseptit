# GK80: Codex1:n ajantasainen tutkimusluovutus

2.11.2026. Repo `ozirix-dev/Reseptit`, main `061f8170a7bc31244ce787c13e80d3d757f0c859`.
Tämä jatko täydentää ylemmän hakemiston ensimmäistä tutkimusraporttia.
Vanhoja laskentakuitteja ei ole muutettu takautuvasti.

**Julkaistu GK-kattavuus on edelleen 156/326 (47,9 %). Tavoitteesta261 puuttuu105.**
Oman tutkimuksen lisätulos on yksi lähdeaineistoltaan koottu LOW-laskentaehdokas
ja yksi lisäehdollinen tuoteversio. Hyväksyttyjä uusia arvoja0, julkaistuja0.
Main, reseptit, ravinto- ja GI-rekisterit sekä Codex2:n tiedostot ovat ennallaan.

## Heti käytettävä lähdeaineisto ja sen rajat

Granolan aiempi kanelimassan lähdepuute on ratkaistu. FSANZin
[AUSNUT2023 Food measures](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/ausnut/data-files)
antaa jauhetulle kanelille F002963 mittatunnuksella49452 tiheyden0,51g/ml.
[Marttojen](https://www.martat.fi/ruoka/ruoanvalmistus/ruoka-aineiden-mitat-ja-painot/)
5ml:n tasateelusikasta saadaan2,55g. USDA:n
[171320-tietueen](https://fdc.nal.usda.gov/food-details/171320/nutrients)2,6g/tsp
on erillinen tarkistus, ei keskiarvotettava havainto eikä epävarmuusväli.
Tämä on yleinen tiheysvastine, ei reseptierän punnitus. Mitta- ja ravintotieto
eivät ole GI-mittausnäyttöä.

[Määrälähteet](quantity-sources.json) sisältävät alkuperäisen Excelin hashin,
arkin, rivin, mittatunnuksen ja lähderivin; koko tietokantaa ei kopioitu repoon.
USDA:n kokonaishiilihydraattia ei yhdistetty AFCD:n saatavaan hiilihydraattiin.

| Täydellinen8-rivinen tutkimusversio | GK/annos | Pois jätetty CHO/annos | Käyttöportti |
| --- | ---: | ---: | --- |
| `siemengranola-jogurtilla` |2,47170625|1,885g|Lähdeaineisto koossa; uusi nimetty mauste50-sovellus ja valmistus-/koostumusvastineet vielä arvioitava. |
| `pellava-puuro-pahkinoilla`, nimetty Sukrin+Alpro |0,21453125|enintään1,905g ilmoitetun koostumusmallin sisällä|Lisäksi nimetty tuoteversio ja pakkaus-CHO-ylärajan kelpoisuus ratkaistava. |

Kanelin0,1753125g saatavaa CHO:ta/annos koodataan molemmissa nykyisen
projektin pienmausteiden GI50-menetelmällä. Se lisää GK:ta0,08765625.
**Kanelille ei löydetty eikä väitetä mitattua ihmis-GI50:tä.**
Mausteen0,5g/ainesosa ja1g/yhteensä sekä poisjättöjen alle1g/ainesosa
ja alle2g/yhteensä säilyvät ennallaan. Pois jätetty positiivinen CHO ei ole nolla.
Malli ei muodosta biologista virherajaa eikä suoraan mitattua ateriavastetta.

Granolan jogurtin natiivi Fineli32201 CHO on4,298g/100g vanhan pyöristetyn4,3:n
sijaan. Tämä ja lähteistetty kanelimassa selittävät eron historialliseen2,474125:een.
Jogurtin GI35 ja vadelman GI51 ovat aiempia LOW-kategoriavastineita.
AFCD:n natiivia sugar-alcohols-excluded-kenttää käytetään suoraan;
puuttuvia yksittäisiä polyoleja ei ole merkitty nolliksi.

## Pellavapuuron lisäehdot

Vanhan syötteen mantelimaito oli väärin Fineli684-lehmänmaitoa.
Tutkimusversion Fineli34738 on nimetty makeuttamaton Alpro-mantelijuoma:
CHO0,132g/100g,250ml:n massa250g tietueen omasta DL100g-mitasta.
Positiivinen0,0825g/annos lasketaan poisjättöihin. AFCD:n eri australialaista
0-CHO-juomaa ei valittu tämän tilalle eikä kaikkia mantelijuomia nollata.

[Valmistajan Sukrin-kookosjauho](https://sukrin.com/en/products/coconut-flour)
ilmoittaa18g hiilihydraattia/100g.20g/4annosta antaa nimellisen saatavan
CHO:n ylärajan0,90g/annos, kun mahdollisia polyoleja ei vähennetä.
Sokerin ja hiilihydraatin samuus ei todista polyoleja nollaksi.
[Valmistaja sanoo arvojen olevan keskiarvoja](https://butikk.funksjonellmat.no/products/kokosmel-okologisk-fettredusert).
0,90g ei siis ole todistettu eräkohtainen enimmäismäärä. Sen kelpoisuus
poisjättöportissa odottaa erillistä menetelmä-/lähdearviota. Alkuperäinen
tuotemerkitön resepti jää HOLDiin; tätä ei ole laskettu välittömäksi avaukseksi.

Kerman GI35 ja kanelin projekti50 muodostavat pisteen. Pellava, kookosjauhon
ehdollinen yläraja, mantelijuoma, saksanpähkinä ja vadelma muodostavat1,905g:n
poisjättösumman. Suolan lähteistetty nolla ei anna lupaa natriumin tai muiden
makrojen julkaisuun, kun suolamäärä on punnitsematta.

Norjan05.445-kookosjauhon5,2g CHO/100g -tietuetta ei käytetty:61,3g rasvaa
ei vastaa nimettyä rasvavähennettyä Sukrin-tuotetta.22g CHO/100g:n muut
tuotteet puolestaan tuottavat1,10g/annos ja ylittävät yhden ainesosan rajan.
Valmiin kookosjauhoa sisältävän leivonnaisen GI45 ei ole raaka-ainejauhon GI.
[Hylkäykset ja vaihtoehtojen rajat](rejected-shortcuts.json).

## Vaikutus ilman kaksoislaskentaa

Omat uniikit laskentaehdokkaat ovat granola1 ja sen lisäksi ehdollinen puuro1.
Kaksi parathaa ovat aiemman erillisen menetelmäehdotuksen tutkimuskohteita,
eivät valmiita laskentaehdokkaita. Codex2:n kahvijogurtti on lähdetukea,
eikä sitä lasketa omaksi avaukseksi.

Molempien omien versioiden myöhempi erillinen hyväksyntä ja julkaisu voisi
nostaa lähtötilanteen158/326:een, jolloin puuttuisi103. Tätä ei ole tapahtunut.
PR183:n172, kuuden erillisen version178 ja Codex2:n uusimman yhden
A-ehdokkaan179 ovat muita julkaisemattomia pinoja. Niitä ei lisätty tämän
paketin julkaistuun kattavuuteen eikä yhdistetty ilman ID-kohtaista täsmäytystä.
Main ja PR183:n HEAD olivat jatkotarkistuksessa ennallaan.

## Seuraavat viisi toimenpidettä

1. Arvioi granolan täydellinen nimetty sovellus lähdepaketin pohjalta;
   aiempi massalähteen puute on nyt poistettu. Mahdollinen lisä1.
2. Ratkaise puuron nimetty tuoteversio ja nominal-label-ylärajan kelpoisuus;
   jos raja ei kelpaa, hanki natiivi saatava CHO sopivasta jauhosta.
   Älä korvaa epäonnistunutta porttia keksityllä jauho-GI:llä. Mahdollinen lisä1.
3. Hyödynnä Chan2001:n kondensoidun maidon61-kortti Codex2:n kahvijogurttiin,
   samassa versiossa sen täsmällisen koostumuksen ja massan kanssa.
4. Kohdenna uusi ihmis-GI-tutkimus Dona2013:n jauho- ja pannuprotokollaan
   sekä kahden parathan komponenttiehdotukseen.38 jauhoreseptille ei ole
   perusteltua yleistä yhden luvun sidontaa.
5. Täsmäytä PR183:n16, erilliset6 ja Codex2:n uusi1 ID-/versiokohtaisesti;
   käsittele julkaisu erillisen vastuutahon kautta. Pelkkä vanhojen PR:ien
   yhteismäärä ei osoita80prosentin tavoitteen täyttymistä.

## Kevyt varmennus

[Syöte1](granola-source-resolved.json), [syöte2](pellava-conditional-version.json),
[mallitulos](model-results.json), [lähdemanifesti](source-manifest.json).
`evaluate.mts <baseline-repo> <tämä-hakemisto>` tarkistaa lähdehashit ja ajaa
mainin nykyistä GK-mallia vain muistissa. `verify_decimal.py <baseline-repo>`
varmistaa desimaaliaritmetiikan, kaikkien8 ainesrivin nimet, määrät ja reseptihashit.
Kummankin tarkistus onnistui. Ei CI:tä tai uusia laajoja build-/testikierroksia.
