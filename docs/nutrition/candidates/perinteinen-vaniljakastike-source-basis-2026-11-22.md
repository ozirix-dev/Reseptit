# Chat 3 – perinteinen vaniljakastike: lähteisiin sidottu ravintolaskennan esiselvitys

**Päivä:** 22.11.2026  
**PR:** #808  
**Tila:** CANDIDATE / HOLD. Ei valmis `docs/nutrition/calculations/`-todiste eikä julkinen ravintoarvo.  
**Resepti:** `reseptit/jalkiruoat/perinteinen-vaniljakastike.md`, FI-lähteen muuttumattomat kuusi ainesriviä ja 6 annosta.  
**Omistaja:** Chat 3

## Ainesosittain tarkastetut lähtötiedot

| FI-reseptin ainesosa | Määrä | Tarkistettu lähde, per 100 g | Imeytyvä CHO / kuitu / proteiini / rasva, g / 100 g | Polyolit |
| --- | ---: | --- | --- | --- |
| Täysmaito | 450 ml | THL Fineli #689, täysmaito, D-vitamiinia 1 µg; [Fineli-lähteen julkinen peili](https://ravinto.ptjesse.fi/maito-taysmaito-d-vitamiinia-1-ug/) | 4,8 / 0 / 3,0 / 3,5 | 0 g/100 g Fineli-peilin erittelyssä |
| Sokeri | 45 g | THL Fineli #1; [Fineli-peili](https://ravinto.ptjesse.fi/sokeri/) | 99,9 / 0 / 0 / 0 | 0 g/100 g erittelyssä |
| Maissitärkkelys | 18 g | THL Fineli #27; [Fineli-peili](https://ravinto.ptjesse.fi/jauho-maissitarkkelys/) | 86,0 / 0 / 0,35 / 0,6 | 0 g/100 g erittelyssä |
| Raaka kananmunan keltuainen | 30 g | THL Fineli: `kananmunan keltuainen, 34 % kananmunan massasta`; [Fineli-peili](https://ravinto.ptjesse.fi/kananmunan-keltuainen-34-kananmunan-massasta/) | 0,2 / 0 / 15,94 / 29,17 | 0 g/100 g erittelyssä |
| Vaniljasokeri | 8 g | **Mauste-Sallinen / Salliselta Vaniljasokeri**, valmistajan [ainesosa- ja ravintoarvot](https://salliselta.fi/tuotteet/mausteet/vaniljasokeri) | 98,7 / 0 / 0 / 0 | **Ei eritelty numeerisesti; UNKNOWN, ei nolla** |
| Ruokasuola | 0,3 g | THL Fineli #30, jodioitu ruokasuola; [Fineli](https://fineli.fi/fineli/fi/elintarvikkeet/30), sekä repoissa aiemmin varmennettu samantyyppinen lähdekortti | 0 / 0 / 0,63 / 0 | Edellisen Fineli-lähdekortin 0; vaatii tarkistuksen lopullisessa pakettiversiossa |

Määrät ovat punnitun syötävän osan lähtötietoja, paitsi maidon tilavuus. `Vaniljasokeri` on tässä **laskentaproxy** nimetylle valmistajan tuotteelle; resepti ei nykyisessä lähdetekstissä lukitse tätä tuotetta. Vaihtoehtoisen tuotteen koostumusta ei saa automaattisesti käyttää samana.

## Maidon millilitroista grammoiksi

[MILKWORKS: Maidontiheys](https://milkworks.fi/maidon-muut-ominaisuudet/) ilmoittaa tavalliseksi vaihteluväliksi **1,028–1,034 g/ml**, riippuen rasvasta, lämpötilasta ja ilmapitoisuudesta.

- Tilavuus 450 ml vastaa tällä *yleisellä* vaihteluvälillä noin **462,6–465,3 g**, laskennan keskiesimerkillä 1,030 g/ml **463,5 g**.
- Keskitiheys ei ole tämän täsmällisen maitopakkauksen mittaustulos. Tuotesidonnaista tiheyttä ei tässä vaiheessa ole todistettu eikä reseptin tilavuutta ole muutettu.
- Laskenta voidaan vahvistaa joko kirjaamalla reseptiin punnittu maidon massa kaikilla neljällä kielellä tai hyväksymällä lähdeperusteinen, epävarmuusrajattu ml→g-muunnos projektin ravintomallissa.

## Rajattu laskennallinen esimerkki – EI julkaisuun

Olettaen 463,5 g täysmaitoa ja yllä nimetyn Salliselta-vaniljasokerin, kuuden annoksen erässä yhteenlasketut **tiedossa olevat** ravinteet ovat:

- Imeytyvät hiilihydraatit: **90,639 g / erä, noin 15,11 g / annos**. Pelkkä maidon tiheyden 1,028–1,034 vaihteluväli muuttaa annosarviota noin **15,10–15,12 g**.
- Kuitu: **0,00 g / erä** yllä lueteltujen lähteiden ilmoitusten perusteella, kun käytetään nimenomaan valmistajan vaniljasokerimerkintää.
- Proteiini: **18,75189 g / erä, noin 3,13 g / annos** (tiheysväli noin **3,12–3,13 g**).
- Rasva: **25,0815 g / erä, noin 4,18 g / annos** (tiheysväli noin **4,18–4,19 g**).

Kaava per ainesosa = syötävä massa (g) × ilmoitettu ravintotekijä (g/100 g) / 100; annosta kohti jaetaan kuudella. Tässä **EI** julkaista `carbs_net_per_serving_g`- eikä `carbs_total_per_serving_g`-kenttiä: vaniljasokerin polyoliarvo on yhä varmentamatta, ja eri hiilihydraattikäsitteiden käsittelyn tulee vastata `site/scripts/nutrition-model.ts`-logiikkaa. Muuta puuttuvaa dataa ei aseteta nollaksi.

## Tarkka jatkoportti

1. Päätä sama nimetty vaniljasokeri FI/EN/SV/TH-lähteelle tai dokumentoi muu tarkasti vastaava tuote; varmista **polyolit ja hiilihydraattimääritelmä** ilman keksittyä nollaa.
2. Varmista maidon massaperuste / muu lähdemallin hyväksymä tiheys sekä mahdollinen retentio; 450 ml ei vielä ole punnittu massa.
3. Laadi varsinainen `docs/nutrition/calculations/perinteinen-vaniljakastike.json` täsmä-`sourceHash`-sidonnalla ja aja sen validointi; tarkista `source_sha256`- ja `nutrition_input_hash`-sidokset, jos lähdetiedostoja muutetaan.
4. Päivitä ravintoarvokentät kaikkiin FI/EN/SV/TH-tiedostoihin vasta hyväksytyn laskentatodisteen jälkeen. GK pidetään määrittämättömänä; kaikki neljä kieliversiota sekä PR #808 pysyvät **Draft/HOLD**.

**Ei merkitä `checks.nutrition: pass` eikä hyväksytä kuvaa, käännöstä, Readyä, mergeä tai tuotantodeployta tämän esiselvityksen perusteella.**
