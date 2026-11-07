# Välipalat: julkaisuportti V1

**2026-11-06.** Kohde: `valipala`-luokan FI/EN/SV/TH-reseptit (`status: published`). Julkaisuaikeiset muutokset tarkistetaan sekä muutetun reseptin CI-validoinnissa että julkaistun sisältöbuildin aikana.

## Pakolliset
- Julkaisukuvan oikea WebP-tiedosto `kuvat/valipalat/`-hakemistossa. `image.src` alkaa `valipalat/` ja tiedoston mitat vähintään 1200×675. Kuvan alt-teksti kuvaa todellista ruokaa. Kuvaputki tarkistaa myös tiedoston olemassaolon ja todelliset mitat.
- Kaikki neljä ravintokenttää annosta kohti ilmoitettuina numeroina: nettohiilihydraatti, kokonaishiilihydraatti, proteiini, rasva. **Laskenta on lisäksi todistettava olemassa olevalla `docs/nutrition/calculations/<id>.json`-evidenssillä ja mahdollisella erämanifestilla.** Pelkkä numero ei riitä: `npm run audit:nutrition -- --strict` estää lähteettömän julkaisun.
- Jokaisella ainesosalla yksiselitteinen numero ja yksikkö, ei `amount: null` eikä tyhjää yksikköä; mukaan lukien öljyt, sokerit ja mausteet.
- Kokonaishiilihydraatti ei voi olla nettohiilihydraattia pienempi. Oikea EU-/US-/polyolimääritelmä tarkistetaan laskennan evidenssissä.

## Tarkoituksellisesti sallittu
- **GK/GL puuttuu**, kun merkityksellinen GI-lähde tai hyväksytty reseptikohtainen menettely ei ole olemassa. Laskuri näyttää puuttumistilan, eikä väitä GK=0.
- `status: draft` saa olla keskeneräinen. Tämän portin tarkoitus ei ole estää iterointia.
- Muille kategorioille ei aseteta uusia vaatimuksia. Historiallisia reseptejä ja GK-sinettejä ei avata.

## Erilliset toimitukselliset portit
Koepaisto/koevalmistus, tuotepakkauksen täsmäys, kuvassa näkyvien ainesten oikeellisuus, käännösten merkityskatselmointi ja omistajan hyväksyntä tehdään ennen lopullista mergeä. Kooditesti ei voi todistaa fyysistä ruoanvalmistusta eikä kuvan ainesosien todellisuutta.

Seuranta: [Välipalat – Issue #333](https://github.com/ozirix-dev/Reseptit/issues/333). Tämä tekninen portti ei ole itsessään uusien reseptien julkaisu.
