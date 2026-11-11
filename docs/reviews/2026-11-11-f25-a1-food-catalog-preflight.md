# F25 A1 – tarkka ravintoarvotietokannan osumatarkistus 11.11.2026

Tämä erä ajaa **oikean `site/scripts/nutrition-model.ts`-laskurin** kaikkien neljän FI-lähteen järjestettyä ainesosaluetteloa vasten ja lukitsee niiden Git-blob-SHA:n. Kyse on tuotekohtaisen laskentasyötteen **puutteiden todentamisesta**, ei uuden makroarvon hyväksymisestä. `main`-julkaisun 69 FI / 207 kieliparia eivät muutu, F25:n 45 HOLD-paria pysyvät estettyinä [julkaisuportissa #444](https://github.com/ozirix-dev/Reseptit/pull/444).

## Todetut tietokantapuutteet

| FI-resepti | Katalogissa tunnistettu | Estävät puutteet |
|---|---|---|
| Rahka-marjakerroskulho | AFCD mansikka, Fineli metsämustikka | Valio-rahkan ja Salakis 10%-jogurtin täsmäbrändit puuttuvat, Fineli-metsämustikan polyolit **tuntemattomat**, hasselpähkinän syötävän osan validi record, sitruunankuoren 1 tl grammapaino ja valinnainen makeutusaine |
| Pinaatti-paneer-chilla | AFCD besan, AFCD pinaatti, Fineli vesi, AFCD jauhettu juustokumina, Fineli öljy | [Arla Apetina Paneer](https://www.arla.fi/tuotteet/arla-apetina/paneer-225g-69940/) -täsmätietue ei ole katalogissa, 1 tl jauhetun juustokuminan grammapaino puuttuu; öljyn 13,5g käyttöaste tarkistettava |
| Za’atar-munat | Fineli muna, pita, 3,9% jogurtti ja paistoöljy | [Salliselta Za’atar](https://salliselta.fi/tuotteet/mausteet/zaatar) SKU 107348:n tuotekohtainen ravintotietue puuttuu, 1 tl grammapaino tuntematon; seesamiallergeeni |
| Hojicha-jogurtti | Fineli 2,5% jogurtti ja seesami | Persimonin AFCD-resepti-ID on vain vanhassa laskentatiedostossa, ei master-katalogissa; [Renée Voltaire Hojicha](https://reneevoltaire.se/en/products/hojicha-rostad) 2g syötävää jauhetta vaatii oman tarkan kuitu-/polyolirecordin |

Lähteitä vastaavat valmistajan tuotetiedot: [Valio 250g pehmeä maitorahka](https://www.valio.fi/tuotteet/valio-pehmea-maitorahka/), [Salakis 10%](https://salakis.fi/tuotteet/turkkilainen-jogurtti-10/), [Arla Paneer](https://www.arla.fi/tuotteet/arla-apetina/paneer-225g-69940/), [Salliselta Za’atar](https://salliselta.fi/tuotteet/mausteet/zaatar) ja [Renée Voltaire Hojicha](https://reneevoltaire.se/en/products/hojicha-rostad). Ravintomalliin ei lisätä niiden tuntemattomia kuitu-/polyoliarvoja nollina.

## Koneellinen käsittely

- `meta/kaannokset/f25-a1-food-catalog-preflight-20261111.json` sisältää neljän alkuperäisen FI:n Git-blob-SHA:t, ainesrivien täsmäjärjestyksen ja nykyisen katalogin ID:t tai puutteen perustelun.
- `site/scripts/f25-a1-food-catalog-preflight.ts` lukee nykyisen `docs/nutrition/food-records.json`, asettaa tunnetut ainesviitteet ja käyttää `calculate()`-funktiota. Aineen `polyols:null` säilyy nimenomaan tuntemattomana. Malli estää tuloksen, ellei jokainen ainesmassa/tuotetieto ole täysin lähteistetty.
- Vakiotestin `f25-source-release-gate.test.ts` uusi osio varmistaa kaikkien neljän `INSUFFICIENT SOURCE DATA`-tilan ja yksilöidyt aukot; CI-ohjattua testilistaa ei muuteta.

**Ei** uusia resepti- tai käännösjulkaisuja, alkuperäisten FI-makrojen/GK-sinettien muutoksia eikä koepaistoväitettä. Jatkokorjaukset vaativat tuotepakkauksen, teelusikan todellisen grammapainon, sokerialkoholitiedon ja hyväksytyn versionidonnan.
