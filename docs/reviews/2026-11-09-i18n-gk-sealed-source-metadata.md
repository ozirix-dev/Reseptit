# Käännösten julkaisu ilman GK-sinetöidyn FI-tiedoston metamuutosta

## Ongelma

`translation-audit.ts` edellytti kaikille julkaistaville kieliversioille kahta FI:n YAML-merkintää: `translation_languages` ja `translation_status`. GK80/GK100-paketeissa saman FI-tiedoston raakatekstin SHA-256 on jo lukittu. Pelkkä uuden kielimerkinnän lisääminen muutti hyväksytyn reseptilähteen SHA:n ja pysäytti julkaisun, vaikka ainesmäärä ja valmistus eivät muuttuneet.

## Turvallinen rajattu muutos

1. Varsinainen `kaannokset/{locale}/...`-tiedosto täytyy edelleen olla `status: published`; kaikki rivikohtaiset rakenne-, annos-, ravinto-, kuva-, valmistus- ja lähdeviitetarkistukset säilyvät.
2. FI-lähteen **puuttuva** kielikohtainen deklarointi sallitaan, mutta nimenomainen `draft` tai `missing` estää. Nimenomainen `published` ilman vastaavaa `translation_languages`-merkintää estää. Nimenomainen `published` ilman julkaistua tiedostoa estää.
3. `validate-changed-content` vaatii semanttisesti muuttuneelle julkaistulle käännökselle edelleen nykyiset Codex-merkitsemistiedot. Samanlainen pakollinen lähdevertailu tulee tehdä ennen uuden käännöksen julkaisemista, eikä tässä muuteta sen ehtoja.
4. Sivuston `build-content.ts` jo käyttää julkaistujen kielitiedostojen `status`-kenttää, eikä se tarvitse FI-lähteen `translation_languages`-listan muutosta. CI-vartijat `changedSemanticReviewErrors` ja GK-historiat pysyvät ennallaan.

Tämä korjaa **vain i18n-metadataa koskevan tuplakirjausesteen**, ei reseptin varsinaisesta valmistuskorjauksesta muuttuvaa GK-raakatekstin SHA-sinettiä eikä avoimia lähde-/turvallisuus-HOLDeja. Nämä ratkaistaan erikseen, eikä käynnissä olevien käännösten tiloja muuteta automaattisesti. Tila: Draft, odottaa testit.
