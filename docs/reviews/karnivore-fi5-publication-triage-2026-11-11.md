# Karnivore FI5: kuvien jälkeen vaaditut ravintotarkistukset (11.11.2026)

**Päätös:** 5/5 kuvat versionhallinnassa (PR #488), **0/5 uutta FI-reseptiä julkaisuun hyväksytty**. Kuvien 1280 × 853 -metatiedot ovat tarkistettuja, mutta kokonaisten annosten ravintoarvot eivät ole. Tämä on tuotekohtaisten ehdokkaiden ja puuttuvien saantoperusteiden katselmointi, ei mittaus eikä ravintoarvojen julkaisu.

| Resepti | Proxy-lähteitä | Ennen julkaisua tarvittava täsmäpäätös |
| --- | ---: | --- |
| Smashburger | 2 | Valitse nimetty 20 % naudan jauheliha sekä tali; määritä syöty paistorasva |
| Kananreisipalat | 1 | Erottele 900 g:n luupaino syötävästä reisilihasta ja nahasta, huomioi rasvahävikki |
| Maksa ja pekoni | 1 | Pekonin tarkka aines- ja ravintotuote sekä irronneen rasvan saanto; säilytä A-vitamiinivaroitus |
| Meatza | 3 | Jauheliha, pekoni ja mozzarella tuotetasolle; mittaa tai mallinna pois valutettu rasva |
| Lammaskyljykset | 1 | 600 g luullisen kyljyksen syötävä lihamassa ja paistorasvan pidättyminen |

## Tuotehavaintojen merkitys

**Smashburger:** valmistajan [Snellman 20 %](https://snellman.fi/fi/tuotteet/kunnon-naudan-jauheliha-20-400-g/) sopii 20-prosenttiselle raaka-aineelle vasta, jos resepti eksplisiittisesti valitsee kyseisen EAN-tuotteen. [Ellin naudan tali](https://ellinkeittio.fi/products/ellin-keittio-ellin-100-ruohoruokitun-naudan-tali-500-g) ilmoittaa 99 g rasvaa ja 1,2 g proteiinia / 100 g. AFCD:n generic dripping -tietueen 100 g rasvaa / 100 g ei ole tämän tuotteen etiketti. Kahdella tuotteella on raakapanoslaskelma tehtävissä, kun niiden valinta on kirjattu. Pannulle jäävän rasvan määrä on edelleen arvioitava.

**Maksa ja pekoni:** Finelin maksa on 5 g imeytyviä hiilihydraatteja / 100 g, joten 400 g maksaa jakautuneena kolmelle henkilölle sisältää jo noin 6,67 g hiilihydraattia / annos ilman pekonia ja voita. [Pirkka pekonin](https://www.k-ruoka.fi/kauppa/tuote/pirkka-pekoni-140g-6410402012312) ainesosaluettelossa ei ole lisättyä sokeria, mutta 100 g:ssa on etiketin mukaan 1 g hiilihydraattia ja tuotteessa on lisäaineita. Se ei vastaa luonnoksen *vain sianliha ja suola* -vaatimusta eikä automaattisesti Finelin rasvaisuuslukua. Raskauden aikana maksaruokia tulee välttää [Ruokaviraston suosituksen](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/maksa-ja-maksaruoat/maksan-kaytto-raskauden-aikana/) mukaan.

**Meatza:** Finelin mozzarella-proxy (0 g HH / 100 g) ei anna lupaa kaikille mozzarelloille. [Coop mozzarella](https://www.s-kaupat.fi/tuote/coop-mozzarella-220125-g/7340191148918) ilmoittaa 1 g HH / 100 g, eli jo 90 g olisi +0,3 g HH / kolmesta annoksesta yhdelle. [Valio mozzarella -juustoraaste](https://www.s-kaupat.fi/tuote/valio-mozzarella-juustoraaste-e400-g/6408430348237) ilmoittaa 0 g / 100 g, mutta sisältää E460:aa; karnivore-ainesosarajaus pitää arvioida tuotekohtaisesti. Lisäksi meatza-ohje kehottaa *valuttamaan pellille irronneen rasvan erilliseen astiaan*; 100 % rasvaretentio olisi ristiriidassa nykyisen ohjeen kanssa.

**Kananreisipalat ja lammaskyljykset:** lähdekartan AFCD-makrot eivät tee luullisesta kokonaispainosta syötävää lihaa. Reseptin muodossa säilytetään turvallinen kypsennysohje; jatkolaskenta tarvitsee luullisen raakapainon, syötävän lihan ja nahan saannon sekä paistorasvan oikean käsittelyn.

## Työjärjestys

1. Viimeistele **Smashburgerin** kaksi tuotesidontaa ja saantosopimus, muodosta erillinen `docs/nutrition/calculations/karnivore-smashburger.json` ja vasta silloin uusi FI-julkaisu-PR.
2. Selvitä **Maksa ja pekoni** -reseptin täsmällinen pekoni, saanto ja maksaruokaa koskeva näkyvä turvallisuustieto.
3. **Meatza** vasta tuotteiden + pois valutetun rasvan laskentamallin hyväksynnällä.
4. **Broilerin reisipalat ja lammaskyljykset** vasta luullisen massan edible-yield-perusteella.
5. **Naudan lyhytkylki ja rapea porsaan kylki** pysyvät erillisessä HOLDissa, eivät tämän FI5-erän osia.

**GK:** Tuntematon pysyy tuntemattomana. Ainesosatietueen `availableCarbohydrates: 0` ei anna koko reseptille mitattua GK=0-lukua. Tuote- ja annoskohtainen hyväksyntä on erotettava kuvan julkaisusta.
