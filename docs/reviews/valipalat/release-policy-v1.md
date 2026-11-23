# Välipalat: julkaisuportti V1

**6.11.2026; ravintoarvojen puuttumistilan täsmennys 23.11.2026.** Kohde: `valipala`-luokan FI/EN/SV/TH-reseptit (`status: published`). Julkaisuaikeiset muutokset tarkistetaan sekä muutetun reseptin CI-validoinnissa että julkaistun sisältöbuildin aikana.

## Pakolliset
- Julkaisukuvan oikea WebP-tiedosto `kuvat/valipalat/`-hakemistossa. `image.src` alkaa `valipalat/` ja tiedoston mitat vähintään 1200×675. Kuvan alt-teksti kuvaa todellista ruokaa. Kuvaputki tarkistaa myös tiedoston olemassaolon ja todelliset mitat.
- **Ravintoarvojen esittäminen perustuu siihen, mitä on todella varmennettu – neljän makron numeropaketti ei ole kategorinen edellytys valmistusohjeen julkaisemiselle.**
  - Kun kaikki neljä arvoa (nettohiilihydraatti, kokonaishiilihydraatti, proteiini ja rasva / annos) julkaistaan, niiden on perustuttava nykyiseen aines- ja annosversioon sidottuun, hyväksyttyyn `docs/nutrition/calculations/<id>.json`-laskentaan sekä tarvittaessa erämanifestiin. `npm run audit:nutrition -- --strict` ja muut nykyiset portit säilyvät; pelkät numerot eivät kelpaa näytöksi.
  - **Kaikki neljä kenttää saavat jäädä `null`-tilaan**, kun puuttuvien lähdetietojen syy, laskennan rajaus ja nykyisen reseptin riippumaton toimituksellinen ravintopidätyspäätös kirjataan. Uudelle julkaistavalle FI-reseptille säilyy `new-recipe-preflight`-portin resepti-SHA:han sidottu hyväksyntä, `nutrition: pass` -tarkistus ja todellinen `nutrition_evidence`-viite. Tässä `pass` tarkoittaa pidätyksen asianmukaista perustelua, ei keksittyä makrolaskentaa. Jos aineisto on ristiriidassa tai turvallisuus on keskeneräinen, julkaisua ei sallita.
  - **Osittain numeroina julkaistavat kentät** ovat sallittuja vain, jos nykyinen laskenta-/CI-malli nimenomaisesti tukee kenttäkohtaista lähde- ja julkaisuhyväksyntää, hyväksyntä on sidottu oikeaan laskentaan ja jokainen näkyvä arvo on tarkistettu itsenäisesti. Muut kentät ovat `null`. Pelkkä tämän ohjeen päivitys **ei** ota käyttöön osittaista julkaisua eikä anna PR #965:n tuleville muutoksille ennakkohyväksyntää.
- Jokaisella ainesosalla yksiselitteinen numero ja yksikkö, ei `amount: null` eikä tyhjää yksikköä; mukaan lukien syötävä osuus, öljyt, sokerit ja mausteet. Valmistustavan ja annossaannon on oltava lähdeperusteisesti riittävän selkeät ja turvalliset.
- Jos molemmat hiilihydraattiarvot julkaistaan, kokonaishiilihydraatti ei voi olla nettohiilihydraattia pienempi. Oikea EU-/US-/polyolimääritelmä tarkistetaan laskennan evidenssissä. **Raportoimaton kuitu tai polyoli ei ole nolla**, eikä USDA:n `carbohydrate by difference` siirry automaattisesti EU-nettohiilihydraatiksi.

## Tarkoituksellisesti sallittu
- **Ravintoarvoja ei näytetä**, kun kaikkien neljän julkisen kentän arvo on `null` ja perusteltu pidätys on katselmoitu. Sivuston tulee kertoa niiden olevan määrittämättömiä; mitään puuttuvaa ei nimetä nollaksi.
- **GK/GL puuttuu**, kun merkityksellinen GI-lähde tai hyväksytty reseptikohtainen menettely ei ole olemassa. Laskuri näyttää puuttumistilan eikä väitä GK=0.
- `status: draft` saa olla keskeneräinen. Tämän portin tarkoitus ei ole estää iterointia.
- Muille kategorioille ei aseteta uusia vaatimuksia. Historiallisia reseptejä ja GK-/F25-sinettejä ei avata.

## Erilliset toimitukselliset portit
Katselmoi valmistustapa, annossaanto, syötävät raaka-ainemassat, mahdolliset hävikkiarviot ja ruokaturvallisuus kirjallisesti, ilman väitettä itse tehdystä koekeittiötestistä. Fyysinen koekeittiö ei ole yleinen pakollinen portti. **Tuntematon rasvan retentio ei saa muuttua oletetuksi ravintoarvoksi, eikä ratkaisematon turvallisuus tai virheellinen valmistusohje saa julkaisulupaa vain siksi, että ravintoarvot voidaan jättää pois.**

Tuotepakkauksen täsmäys silloin, kun siihen perustuvia numeroita tai turvallisuusväitteitä julkaistaan, kuvan vastaavuus, julkaistavien käännösten merkityskatselmointi ja omistajan hyväksyntä tarkistetaan ennen yhdistämistä. Numeroiden poisjättäminen ei ohita CI:tä, Repo Guardia eikä tuotantojulkaisun erillistä valtuutusta. Tätä ohjetta sovelletaan myös aiemmin laadittuihin välipalaluonnoksiin ja katselmointijonoihin.

**Jalapeñot (#333):** puuttuva varmistettu jalapeñon POLYL-arvo voi johtaa kaikkien neljän ravintokentän perusteltuun `null`-pidätykseen, mutta **ei yksin estä julkaisemista**. Pekoni-juustotäytteisen annoksen tarkka syötävä annosjako ja turvallinen valmistus, todellinen kuva, reseptin sisältöhyväksyntä ja julkaisuportit ovat edelleen erillisiä vaatimuksia. Vanha `jalapeno-poppers-pekonilla`-Draft ja sen HOLD-regressiotestit pidetään ennallaan, kunnes nämä esteet on todella ratkaistu.

Seuranta: [Välipalat – Issue #333](https://github.com/ozirix-dev/Reseptit/issues/333). Tämä täsmennys koskee julkaisuperiaatetta; se **ei** sellaisenaan julkaise yhtään reseptiä, muuta makroja, vapauta HOLDia tai hyväksy osittaisia arvoja.
