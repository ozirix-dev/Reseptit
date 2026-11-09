# Kokkikorjaukset viiteohjeiden pohjalta – 9.11.2026

## Rajaus

Tämän PR:n ainoa kirjoittaja on tämä keskustelu. Muutetaan viiden FI-reseptin tekstiä erillään käännös-PR:istä #356 ja #357, ainesosaauditista #358 sekä kokkikorjausten #359:n työalueesta. Käyttäjä antoi luvan parantaa reseptejä. Tämän PR:n muutokset eivät ole fyysisiä koepaistoja.

## Muutokset ja kokin perustelut

1. `kana-yakitori-kaalilla`: alkuperäisessä YAML:ssa soijakastike mutta ohjeessa tamari. Käytetään soijakastiketta johdonmukaisesti. Järjestetään marinadi kahteen puhtaaseen astiaan raa'an kanan ristikontaminaation välttämiseksi. Tarkistetaan broilerin ≥75 °C ja mirinin mahdollinen korvaus erilliseksi ravintolaskentaversioksi. Ainesmäärät ennallaan.
2. `pho-bo`: perinteinen, raakaa viipalelihaa kiehuvalla liemellä kypsentävä menetelmä ei ole kotikäyttöön varma. Kypsennetään hyvin ohut liha erikseen kiehuvassa liemessä vähintään 70 °C:een ennen annostelua; kaikki ruoka-aineet ennallaan.
3. `pohjoisafrikkalainen-harissa-shakshuka`: oikaistaan ainesosarivin kielivirhe `kananmunaa kuoretta` -> `kananmunaa kuorettomana`. Valmistuksessa on jo 110 g kuoretonta munaa. Määrä, valmistus, ravintoarvot ennallaan.
4. `munakasmuffinit`: kuusi tarttumatonta silikoni- tai paperivuokaa ilman luetteloimatonta voitelurasvaa. Pekonin paistossa irronnut rasva palautetaan munaseokseen, jolloin laskennan raaka-ainesyöte ja koko annos vastaavat paremmin toisiaan. Uusia aineksia tai määriä ei tule.
5. `tonnikalamunakkaat-uunissa`: vastaava silikonin/paperin käyttö ilman ilmoittamatonta voitelurasvaa; kaikki määrät ennallaan.

## Vertailu- ja turvallisuuslähteet

- Yakitorin yleinen perusidea (soija, mirin, reisiliha, vartaat): https://www.justonecookbook.com/yakitori/ — reseptiä ei kopioitu.
- Shakshukan perinteinen pohja (tomaatti, paprika, muna): https://www.youtube.com/watch?v=x3nKYqGwDZA — tarkistusvertailu, ei kopio.
- Perinteisen phở bò -liemen ja annostelun kuvaus: https://vietnamesecookbook.com/recipes/pho-bo/ — kotikäyttöön turvallisempi poikkeama perusteltu.
- Munamuffinien perusmenetelmä ja erillisen vuokarasvan tyypillisyys: https://www.bbc.co.uk/food/recipes/egg_muffins_75130 — korjauksessa käytetään rasvatonta vuokavaihtoehtoa.
- Suomen elintarviketurvallisuus: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/kypsentaminen/ ja https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/liha/

## Portit

- FI-lähteiden tekstimuutos voi rikkoa hyväksyttyjen GK80/GK100-pakettien raakatekstin SHA-sinetin. Historiallisten hyväksyntöjen alkuperäisiä SHA-tiivisteitä ei korvata eikä uudelleenkuitata tässä PR:ssä. Pysyy Draftina, jos näihin liittyvät CI-testit epäonnistuvat; jatkokorjaus edellyttää erillistä hyväksyttyä reseptiversio-/evidence-rekonsiliaatiota.
- Käännösten #356 ja #357 lähdekohtainen vertailu vanhenee muuttuneille viidelle FI-reseptille. Käännösomistajan on päivitettävä niiden EN/SV/TH-ohjeet uuteen versioon ja laskettava semanttiset hashit uudelleen; tähän PR:ään ei tuoda rinnakkaisten haarojen tiedostoja.
- Ennen Ready/merge: changed-content, ravinto/GK-regressiot, build ja CI samalla HEADilla. Ei väitetä koepaistoa tai riippumatonta ihmistarkastusta.
