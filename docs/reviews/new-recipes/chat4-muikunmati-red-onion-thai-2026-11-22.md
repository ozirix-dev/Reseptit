# Chat-4 – muikunmäti-rieskarullien punasipulin TH-merkityskorjaus

Päiväys 2026-11-22. Työn omistaja: Chat 4. Lähtö-main `6cf72e0506fa12c0ec8e0a6e8de4859b3dbdfb37`.

## Todettu ja korjattu

FI:n `muikunmati-rieskarullat`-reseptin 50 g punasipulia on thaikielisessä Draft-versiossa aiemmin ilmaistu `หอมแดงหัวใหญ่`, mikä voi sekoittua salottisipuliin. Sama terminologinen virhe on korjattu aiemmin kolmesta alkuruoasta PR #884:ssä.

Thaikielisen ainesosan sekä valmistusvaiheen 2 esiintymät korjataan muotoon `หอมหัวใหญ่สีแดง` (punasipuli). Muutokset eivät koske määriä, muikunmädin käsittelyä, kylmäketjua, jäädytysvaatimusta, listeriavaroitusta, annoksia, muita kieliä, kuvia tai GK-arvioita.

Korjattu tiedoston Git-blob-tunniste päivitetty `docs/reviews/new-recipes/chat4-raw-fish-evidence-inventory.json` -inventaarioon. Kohdennettu regressiotesti tarkistaa punasipulin nimen, Draft-tilan sekä kriittisten turvallisuusrajoitusten pysymisen.

## Julkaisun rajoitukset

**Draft/HOLD säilyy kaikissa neljässä kielessä.** Korjaus ei osoita muikunmädin raakakäyttökelpoisuutta, riippumatonta semanttista hyväksyntää tai reseptin julkaisukelpoisuutta. Kaikki aiemmat turvallisuus- ja hyväksyntäportit pysyvät voimassa. Ei automaattista valmistajakirjevaatimusta.
