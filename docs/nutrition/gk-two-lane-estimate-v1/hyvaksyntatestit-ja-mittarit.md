# Toteutuksen hyväksyntätestit ja mittarit

**Design-only:** nämä testit ovat V1–V4-toteutus-PR:ien sopimus. Ne eivät vielä ole testiajon PASS-tuloksia.

## Riskitestien vähimmäismatriisi

| Testi | Syöte | Odotus |
| --- | --- | --- |
| PIZZA-CHO-01 | #294 pizza, 2 annosta, 25 g kaurajauhoa | 12,902625 g CHO/annos, kaurasta 7,984625 g; ei GK-arvoa ilman GI-sidosta |
| PIZZA-HOLD-02 | Kaurapuuron GI tarjotaan kaurajauhopohjalle ilman soveltuvuushyväksyntää | GI_APPLICABILITY_REVIEW / point=null |
| PIZZA-WHATIF-03 | Kauran kuvitteelliset GI 50/70/100 ja muiden GI 50 | Matematiikka täsmää; what-if ei kulje publisheriin, filttereihin eikä kattavuuteen |
| MASS-04 | Kuiva riisi ja eri painoinen kypsä riisi | Erotetut tietueperustat, erähiilihydraatti kerran, ei kuiva/kypsäsekoitusta |
| CARB-05 | EU, Fineli ja US total sisältäen kuitua/polyoleja | Sama normalisoitu koostumus tuottaa saman tuloksen; ei kuitu-/polyoli-double-subtraction |
| POLYOL-06 | Maltitoli, erytritoli ja tuntematon polyoliseos | Lajierot säilyvät, ei 'GI=0 kaikille', puutteet näkyvät |
| ZERO-07 | Varmennetusti 0 g CHO vs pakkauksen pyöristetty 0 g | Ensimmäinen nolla hyväksytty, jälkimmäinen voi olla avoin |
| DUPLICATE-08 | Valmiin pizzapohjan GI ja kauran eri GI samalle hiilihydraattimassalle | INVALID duplicate-component |
| PROVENANCE-09 | Tuotteen/valmistuksen/painon/lähteen/politiikan muutos | Vanhat review- ja julkaisuhashit hylätään |
| VERSION-10 | FI-reseptin määrämuutos, EN-käännös pysyy vanhana | Laskenta sidottu FI-alkuperään; käännös ristiriitana review’hun |
| STATUS-11 | MODEL_POINT_REVIEWABLE mutta julkaisu NOT_REVIEWED | Ei julkista B-lukua eikä A-kattavuuskasvua |
| STATUS-12 | MODEL_POINT_REVIEWABLE ja OWNER_AUTHORIZED | B julkaistaan omalla tunnisteella, A pysyy muuttumattomana |
| STATUS-13 | B julkinen, uusi A hyväksytään | A ensisijainen, B ei korvaa sitä eikä kahdenna kattavuuslaskentaa |
| RANGE-14 | Nimetty skenaarioväli ylittää GK-luokkarajan | Ei varmaa matalan GK:n luokkaa tai filtteriä |
| RANGE-15 | GI 0/100/150 stressi | Luvut merkitään stressiksi, ei biologiseksi rajaksi / CI:ksi |
| REUSE-16 | Sama GI-vastine kahdelle valmistukseltaan samalle reseptille | Sama hyväksytty sidos kelpaa, oma recipeHash ja uusi laskenta |
| REUSE-17 | Sama ruokanimi mutta eri valmistus/partikkelikoko | Reuse estetään, GI_APPLICABILITY_REVIEW |
| PRIVACY-18 | Recipavon yksityinen resepti | Ei julkista tietuetta tai GitHub-commitia; käyttäjän data ei ohittaen vuoda |
| CI-19 | B-feature flag pois päältä | A-kentät, nykyiset luvut, suodattimet, versionCoverage, JSON-LD ja reitit byte-tasoisesti ennallaan |

## Pilottireseptit vähintään

- Raejuustopizza: ravintoarvot tiedossa, valmisteelle GI-lähde avoin.
- Yksi suoralla ihmis-GI:llä laskettu resepti: A/B erottelu ja vertailu.
- Yksi peruna-/riisiresepti: valmistusvaikutus.
- Yksi VHH/avokadoresepti: pieni mutta mahdollisesti suhteellisesti tärkeä CHO.
- Yksi polyolituote: EU-label versus koostumus ja lajikohtainen vaikutus.
- Yksi seka-aterian valmis komponentti: double-count-estot.
- Laajennus 10–15 reseptiin ennen B-julkaisua; pilotin korpusta ei saa valikoida pelkistä helppotapauksista.

## Mitattavat tulokset

- coverage_A: nykyisen hyväksytyn GK-kattavuuden erillinen osoittaja ja nimittäjä, laskenta tuotannon ajantasaisesta datasta (ei kovakoodata muistissa olevaa 235/326 tai muuta vanhentuvaa lukua).
- coverage_B: nimettyjen alkuperäisreseptien B-malliarvion erillinen määrä ja nimittäjä, ei koskaan summata coverage_A:han ilman eksplisiittistä erillistä yhdistelmätaulukkoa.
- whatIfCount: sisäinen havaintomäärä; ei GK-kattavuutta.
- eligibleSourceReuse: uudelleenkäytettyjen lähde-/soveltuvuussidosten määrä ja säästetyt manuaaliset toimenpiteet.
- reviewLoad: keskimääräiset ihmisen review-minuutit / resepti sekä erähyväksyntöjen määrä.
- failureModes: virheellinen soveltuvuus, vanhentunut hash, tuntematon CHO, väärä annos, GI-asteikko, kaksoislaskenta, läpi päässyt unsupported-koodi.
- timeToFirstResult: käyttäjän reseptituonnista ensimmäiseen läpinäkyvään tulokseen tai perusteltuun blocker-listaan.
- withdrawnEstimates: julkisten B-lukujen peruuntumiset ja syyt.

## Vasta sitten 'valmis'

- Lähde-/versioketju ja hyväksyntä näkyvät riippumattomalle tarkistajalle ilman chattihistoriaa.
- Laskennan tuottama numero on toistettavissa julkaistulla syötteellä, eikä satunnainen mallin valinta vaikuta.
- Kaikissa neljässä kielessä laskennan status, annos, lähteen rajaus ja epävarmuus merkitsevät samaa.
- Nykyinen A-kattavuus, GK-only-version käyttö, suodattimet, JSON-LD ja julkaistut GK-arvot eivät muutu suunnitelman tai B-ytimen lisäämisestä.
- Omistajan erillinen menetelmä- ja julkaisupäätös sekä kontrolloitu rollback on dokumentoitu.
