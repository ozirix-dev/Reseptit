# Käännösten oikeellisuus ensin: erien automaattinen jako v1

## Lähtötilanne 9.11.2026
- Erä A: #357 sisältää 8 FI-source-HOLDia / 24 luonnosta; #364 on erillinen 12 FI-reseptin / 36 käännöksen julkaisuehdokas.
- Erä B #356 hoidetaan omassa haarassa; ei saa ylikirjoittaa sen yhteistä tarkistusevidenssiä.
- #364 lisäsi ulkoisen `published-translation-pairs.json`-indeksin GK-sinetöityjen FI-tiedostojen muuttamisen välttämiseksi. Tämä portti täydentää indeksiä; se **ei** tee julkaisuja eikä ohita CI:tä.

## Prosessi – kaksi vaihetta, ensimmäinen oikeellisuus

1. **FI:n raaka-aineet ja valmistus:** lue alkuperäinen resepti, tarkista aineslista vs ohje, puuttuvat lisukkeet, raakakypsä, allergeenit, säilytys, ajat ja turvallisuus. Esiintyvän source-HOLDin koko kolmen kielen ryhmä pysäytetään; vettä valmistusapuna ei yksin leimata virheeksi.
2. **Merkitysvastaavuus:** AI vertaa FI↔EN/SV/TH jokaisen ainesosan, vaiheen ja kiellon sekä TH:n takaisin suomeksi. Tallenna todellinen vertailu ja avoimet havainnot projektin nykyiseen `codex-review-evidence.json`-rekisteriin. Älä merkitse ihmistarkistetuksi, ellei ihminen ole tarkistanut.
3. **Automaattinen partitiokone:** `translation-batch-partition.ts` käy valitut reseptit läpi, vertaa lukittuja FI/EN/SV/TH SHA-256-tiivisteitä nykyiseen sisältöön, tarkistaa rakenne-, yksikkö-, numero-, kuva- ja tunnetut termivirheet sekä tarkistusrekisterin `REVIEW CURRENT`-tilan. Epäselvä lähde → `source_hold`; vanhentunut/puuttuva kielitarkistus → `needs_review`; vain kaikki kolme kelvollista paria → `candidate`.
4. **Julkaisuehdokas ei ole julkaisulupa:** erillinen rajattu PR vain `candidate`-ryhmälle. Julkaisuindeksin muutoksille vaaditaan GK80/GK100/GK149-sinettien säilyminen, `translation-audit --strict`, `validate:changed-content`, nutrition/GK, reitit, kuvat, build ja CI **samalle HEADille**. Todistettujen pakollisten porttien FAIL → Draft/HOLD, ei mergeä.
5. **Eräomistajuus:** jokaisella chatilla/ajolla oma branch ja yksilöity käännöslista. Yhteisen V2-rekisterin muutokset yhdistää yksi integraatio-omistaja avaintasolla, ei korvaa toisen haaran JSONia. FI-sisällön muutos vanhentaa automaattisesti käännösten tarkistustietueet.

## Käyttö

Aja repon `site/`-hakemistossa, kun käännös- ja todisterekisterit ovat samassa tarkastettavassa haarassa:

```bash
npx tsx scripts/translation-batch-partition.ts --ledger=docs/reviews/translation-batch20-digests-2026-11-09.json --out=/tmp/translation-partition.json
```

Tulos on **päätösehdotus** ryhmissä `candidate`, `needs_review`, `source_hold`. Se ei muuta tiedostoja, avaa PR:ää tai julkaise mitään. Jos esimerkissä käytetyn ledgerin 36 käännöstä on jo eri PR-haarassa kuin jäljelle jääneet 24, aja tämä **vain kokonaisuudessaan eristettyä yhteistä analyysityöpuuta vasten** tai valitse yhtä haaraa kuvaava manifesti; muuten puuttuvat kielitiedostot päätyvät `needs_review`-ryhmään. Puuttuva todisterekisteri, virheellinen SHA tai ei-käsitelty kriittinen havainto ei koskaan tuota julkaisuehdokasta.

## Automaation jatkokehitys

- V1: muuttumattomiin tiedostoihin sidottu luokittelu + testit; käsittely recipe_id:n mukaan, ei token-budjetin ylityksen jälkeisiä oletushyväksyntöjä.
- V2: GitHub Actions luo jokaiselle PR:lle partitiotuloksen artifactina; ei vaadita ihmistä lukemaan joka reseptiä, mutta kriittisiin epäselvyyksiin vaaditaan todellinen päätös.
- V3: botti voi ehdottaa vain puhdasta `candidate`-ryhmää omaksi Draft-PR:ksi, ilman auto-mergeä; julkaisun pakolliset portit pidetään erillään luokittelusta.

**Oikeellisuus > nopeus.** Tuntematon tai ristiriitainen tieto pysähtyy, ei muutu oletusarvoksi.
