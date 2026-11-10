# C20: pisang goreng EN/SV/TH – rajattu julkaisu, SV-uppopaistovirheen korjaus

**10.11.2026.** Lähde-main `f59ddd3ae5526a812cc7a5547630738d8dc5433d`, alkuperäinen [C20 Draft #380](https://github.com/ozirix-dev/Reseptit/pull/380). Julkaistaan vain `indonesialainen-pisang-goreng-aamiaiseksi` kolmena kieliversiona, **ei** muita C20 HOLD -tiedostoja.

## Lähdesidonnat ja kielimerkitys

- FI-lähde on 2 annoksen pannupaisto 1 rkl:ssa luettelon neutraalia öljyä; 120 g kuorittu banaani, 100 g riisijauho, 20 g kuivattu kookos, 25 g fariinisokeri, 75 ml vesi ja suola. Ei uppopaistoa eikä lisäöljyä.
- EN- ja TH-käännösten ainekset, valmistustapa ja annokset vastaavat FI:tä; kummassakin `status: draft` → `published`, ei muuta semanttista muutosta. Aiemman C20 CI:n [#42749726980](https://github.com/ozirix-dev/Reseptit/actions/runs/42749726980) tulosteissa molemmat semanttiset tiivisteet täsmäävät.
- SV-versiossa **`friterade bananer` → `pannstekta bananer`** täsmälleen kolmessa paikassa: `title`, kuvan `alt`, Markdownin H1. Ohjeen pannupaisto ja kaikki ainesmäärät pysyvät ennallaan. Uusi `semanticHash`: `6fcda21fb9307147302801e5a4e3b83682073b4a854346b44337f3cbe5622629c`. Alkuperäisen version hash täsmäytettiin CI:n lokiin ennen muutosta.
- FI `source_hash` `b30ed589c88cdd2108c6e9c34a6cf0329620b9a46f900ff2277356d1789a8316`; EN `102f7bae68d757463a4c745e36b43d17b2817a60b74443e5f22a1bf11787f3d6`, TH `1bf31d23c8f4808f304d19562f04ed4d0697821f311f39dcaeb68a9e3f7418ae`; uudet todisteet `meta/kaannokset/codex-review-evidence.json`. Arvio on **ChatGPT:n AI-merkityskatselmointi**, ei riippumattoman äidinkielisen tarkistus eikä fyysinen koepaisto.

## Julkaisun turvarajat

- FI-resepti, annokset, ainesmäärät, ravintoarvot, kuvapolut ja alkuperäiset GI/GK/GK80/GK100-lähde-SHA:t muuttumattomia.
- `published-translation-pairs.json` kasvatetaan **55/165 → 56/168**; tämä kuvaa sivurekisteriä, ei kaikkia sivuston historiallisia käännöksiä.
- Neljä muuta C20-HOLDia (nasi lemak, nasi uduk, maakouda, kevätsipulipannukakku) jäävät erilliseen lähde-/ravintokatselmointiin. C20 Draft #380:aa ei yhdistetä, se sisältää jo julkaistuja vanhoja Draft-kopioita.
- Merge vain täsmä-HEADin changed-content, strict translations, semantic hash ja valittujen CI-porttien SUCCESSin jälkeen. Main-Pages build ja deploy on sen jälkeen todennettava erikseen. Ei uusintayrityksiä ilman eriteltyä virheen syytä.
