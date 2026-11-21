# Chat 3 – perinteinen vaniljakastike: lähteisiin sidottu ravintolaskennan esiselvitys

**Päivä:** 22.11.2026  
**PR:** #808  
**Tila:** CANDIDATE / HOLD. Ei valmis `docs/nutrition/calculations/`-todiste eikä julkinen ravintoarvo.  
**Resepti:** `reseptit/jalkiruoat/perinteinen-vaniljakastike.md`, FI-lähteen kuusi ainesriviä ja 6 annosta; täysmaito täsmennettiin 22.11.2026 punnituksi 450 grammaksi kaikilla kielillä.  
**Omistaja:** Chat 3

## Ainesosittain tarkastetut lähtötiedot

| FI-reseptin ainesosa | Määrä | Tarkistettu lähde, per 100 g | Imeytyvä CHO / kuitu / proteiini / rasva, g / 100 g | Polyolit |
| --- | ---: | --- | --- | --- |
| Täysmaito | 450 g | THL Fineli #689, täysmaito, D-vitamiinia 1 µg; [Fineli-lähteen julkinen peili](https://ravinto.ptjesse.fi/maito-taysmaito-d-vitamiinia-1-ug/) | 4,8 / 0 / 3,0 / 3,5 | 0 g/100 g Fineli-peilin erittelyssä |
| Sokeri | 45 g | THL Fineli #1; [Fineli-peili](https://ravinto.ptjesse.fi/sokeri/) | 99,9 / 0 / 0 / 0 | 0 g/100 g erittelyssä |
| Maissitärkkelys | 18 g | THL Fineli #27; [Fineli-peili](https://ravinto.ptjesse.fi/jauho-maissitarkkelys/) | 86,0 / 0 / 0,35 / 0,6 | 0 g/100 g erittelyssä |
| Raaka kananmunan keltuainen | 30 g | THL Fineli: `kananmunan keltuainen, 34 % kananmunan massasta`; [Fineli-peili](https://ravinto.ptjesse.fi/kananmunan-keltuainen-34-kananmunan-massasta/) | 0,2 / 0 / 15,94 / 29,17 | 0 g/100 g erittelyssä |
| Vaniljasokeri | 8 g | **Mauste-Sallinen / Salliselta Vaniljasokeri**, valmistajan [ainesosa- ja ravintoarvot](https://salliselta.fi/tuotteet/mausteet/vaniljasokeri) | 98,7 / 0 / 0 / 0 | **Ei eritelty numeerisesti; UNKNOWN, ei nolla** |
| Ruokasuola | 0,3 g | THL Fineli #30, jodioitu ruokasuola; [Fineli](https://fineli.fi/fineli/fi/elintarvikkeet/30), sekä repoissa aiemmin varmennettu samantyyppinen lähdekortti | 0 / 0 / 0,63 / 0 | Edellisen Fineli-lähdekortin 0; vaatii tarkistuksen lopullisessa pakettiversiossa |

Kaikki kuusi ilmoitettua ainesosaa on nyt punnittu grammoina; maito ei enää perustu tilavuusmuunnokseen. `Vaniljasokeri` on tässä **laskentaproxy** nimetylle valmistajan tuotteelle; resepti ei nykyisessä lähdetekstissä lukitse tätä tuotetta. Vaihtoehtoisen tuotteen koostumusta ei saa automaattisesti käyttää samana.

## Maidon punnitus 22.11.2026

Aiemman luonnoksen **450 ml** maitomäärä korvattiin neljässä kielessä uudella **450 g punnitulla** täysmaitomäärällä. Tämä on tarkoituksellinen reseptimuutos, ei väite siitä, että 450 ml maitoa painaisi 450 g. Aiempi mahdollinen tiheysväli on vain historiallisen luonnoksen taustatieto, eikä sitä tarvita tämän täsmäversion laskentaan.

## Rajattu laskennallinen esimerkki – EI julkaisuun

Kun täysmaito on punnittu **450 g** ja vaniljasokeri on edelleen vain nimetty Salliselta-tuoteproxy, kuuden annoksen erässä **esimerkinomaiset, ei-julkaistavat** lähteiden laskennalliset määrät ovat:

- Imeytyvät hiilihydraatit: **89,991 g / erä, noin 15,00 g / annos**.
- Proteiini: **18,34689 g / erä, noin 3,06 g / annos**.
- Rasva: **24,609 g / erä, noin 4,10 g / annos**.
- Kuitu **ei ole hyväksytty lopullinen kokonaisarvo**, koska vaniljasokerin kuitumerkinnät poikkeavat valmistajan ja kaupan välillä (0,0 vs 0,6 g/100 g).

Kaava per ainesosa = syötävä massa (g) × ilmoitettu ravintotekijä (g/100 g) / 100; annosta kohti jaetaan kuudella. Tässä **EI** julkaista `carbs_net_per_serving_g`- eikä `carbs_total_per_serving_g`-kenttiä: vaniljasokerin polyoliarvo on yhä varmentamatta, ja eri hiilihydraattikäsitteiden käsittelyn tulee vastata `site/scripts/nutrition-model.ts`-logiikkaa. Muuta puuttuvaa dataa ei aseteta nollaksi.

## Tarkka jatkoportti

1. Päätä sama nimetty vaniljasokeri FI/EN/SV/TH-lähteelle tai dokumentoi muu tarkasti vastaava tuote; varmista **polyolit ja hiilihydraattimääritelmä** ilman keksittyä nollaa.
2. Maidon massaperuste on täsmennetty **450 g punnituksi täysmaidoksi** neljällä kielellä; tarkista vielä valmistuksen retentio ja muu ravintokorttien täsmällinen soveltuvuus.
3. Laadi varsinainen `docs/nutrition/calculations/perinteinen-vaniljakastike.json` täsmä-`sourceHash`-sidonnalla ja aja sen validointi; tarkista `source_sha256`- ja `nutrition_input_hash`-sidokset, jos lähdetiedostoja muutetaan.
4. Päivitä ravintoarvokentät kaikkiin FI/EN/SV/TH-tiedostoihin vasta hyväksytyn laskentatodisteen jälkeen. GK pidetään määrittämättömänä; kaikki neljä kieliversiota sekä PR #808 pysyvät **Draft/HOLD**.

**Ei merkitä `checks.nutrition: pass` eikä hyväksytä kuvaa, käännöstä, Readyä, mergeä tai tuotantodeployta tämän esiselvityksen perusteella.**

## Tuotetietojen ristivertailu 22.11.2026

- Valmistajan [Mauste-Sallinen / Salliselta Vaniljasokeri](https://salliselta.fi/tuotteet/mausteet/vaniljasokeri) ilmoittaa ravintokuitua **0,0 g / 100 g**, kun taas [S-kaupat – sama Salliselta Vaniljasokeri, EAN 6436501050550](https://www.s-kaupat.fi/tuote/salliselta-vaniljasokeri-500g/6436501050550) ilmoittaa ravintokuitua **0,6 g / 100 g**. Nämä tiedot koskevat nimellisesti samaa tuotetta mutta **eivät täsmää**. Ero vastaa 8 gramman annosraaka-aineessa noin 0,048 g koko reseptierää ja 0,008 g / annos; laskennallinen yläraja ei itsessään korvaa hyväksyttyä lähdearvoa.
- Molemmat lähteet ilmoittavat hiilihydraattia **98,7 g / 100 g** ja rasvaa/proteiinia 0 g. Kumpikaan ei anna nimenomaista numeerista polyoliarvoa. Vaniljasokerille ei siis aseteta `polyols: 0` kumpaankaan perustuen.
- Valmistajan ilmoittama kuitu 0 g valittiin aiemmassa **vain esimerkkiä** koskevassa koosteessa; se ei ole ristiriidaton lopullinen kuituevidenssi. Ristiriita ja polyolipuutteet estävät edelleen neljän julkaistavan makroarvon hyväksynnän.

## Täsmäsidokset 22.11.2026

Uusi FI-lähteen SHA-256: `87d3a19d59f5a5cad0444bbf1aaa62d330bea230d6558f61d97895a66b3af771`. Uusi `recipeNutritionInputHash`: `49e5a1e7149059baaf6b39e13b534ed179cacd632041eb07e8442d7b06cf11c7`. Kaikki neljä kieliversiota ilmoittavat täysmaidon nyt **450 g**, eivät vanhaa 450 ml. Vaniljasokerin polyolit ja kuituristiriita estävät edelleen varsinaisen ravintoevidenssin hyväksynnän. Ei julkisia makroarvoja, PR yhä Draft/HOLD.

## Valmistuksen saantotarkennus 22.11.2026

Neljän kieliversion valmistusvaiheessa 3 poistettiin valinnainen kastikkeen siivilöinti. Pienet paakut vatkataan tasaisiksi, eikä munan tai tärkkelyksen kiintoainetta ole tarkoitus poistaa. Tämä tukee lähdesidonnaisen ravintolaskennan punnitun ainesmassan säilymistä, mutta ei todista laboratoriotason lämpökäsittelyretentiota. FI-reseptin uusi SHA-256 on `ec655927a2ae1370f6283740c1bc533e81970926f80705a875dd75653e10fe28`; ravintolaskennan `recipeNutritionInputHash` pysyi samana, koska ainesmäärät ja annokset eivät muuttuneet. Vaniljasokerin polyolitieto ja kuituarvojen ristiriita ovat yhä ratkaisematta. **Ei julkisia ravintoarvoja, HOLD jatkuu.**
