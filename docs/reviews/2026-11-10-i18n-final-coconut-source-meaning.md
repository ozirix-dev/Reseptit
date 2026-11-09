# Mangokookosriisi – viimeisten kolmen EN/SV/TH-käännöksen julkaisutarkistus

**Päivä:** 10.11.2026. **Katselmointi:** ChatGPT:n AI-merkitysvertailu, ei riippumatonta ihmiskielentarkistusta eikä fyysistä koepaistoa. **FI-lähde:** Reseptit main 9b47b8dda29057cdb5baf91d24a7498055438932. Alkuperäistä FI Markdownia, GK80 Release 5 -pakettia ja ravintoarvoja ei muokata.

## Yksi rajattu metadataero

Kanonisessa lukitussa FI-lähteessä `cooking_method: paistaminen`, mutta ohje valmistaa 100 g kuivaa jasmiiniriisiä 184 g:ssa tölkkikookosmaitoa ja 100 g:ssa vettä **keittämällä**. [PR #373](https://github.com/ozirix-dev/Reseptit/pull/373) lukitsee alkuperäisen FI-tiedoston SHA-256:n ja korjaa *julkisen esityksen* `cooking_method: keittäminen` -arvoon. Tämä ei ole uusi kanoninen GK80-lähdehyväksyntä.

Tässä erässä EN/SV/TH-käännösten metatieto oikaistaan *keittäminen*-menetelmäksi. `site/scripts/translation-audit.ts` käyttää tälle **yhdelle eksplisiittiselle FI-lähdepolulle** rakennusvaiheen `projectReviewedFiEditorialSource`-toimintoa ja hyväksyy vain sen SHA-lukittuna tuottaman `keittäminen`-arvon. Muille resepteille auditointi vertailee edelleen suoraan kanonista FI-metatietoa. **FI `semanticHash` ja `source_hash` jäävät alkuperäisen raakatiedoston mukaisiksi.**

## Kokkikatselmointi ja EN–SV–TH-merkitysvertailu

- 100 g kuivaa valkoista jasmiiniriisiä, 184 g täysrasvaista tölkkikookosmaitoa ja 100 g vettä kypsennyksessä; **kuuma jyväriisi**, ei tahmariisi eikä kypsennyksen jälkeen jäähdytetty riisi.
- 150 g syötävää, kuorittua **raakaa mangoa** paloina, ei soseena; 6 g **kokonaisia kuorittuja seesaminsiemeniä**; suola vain maun mukaan, ei lisää makeuttajaa.
- Koko riisi, mango ja käytetyt ainesosat jaetaan **kahteen annokseen**; ei ravintoarvoihin kirjautumatonta kastiketta, lisättyä rasvaa tai uutta sokeria. Tämä on nimetty soveltava GI/GK-rinnastus, ei aterian verensokerimittaus. Luottamus on LOW.
- EN `Cook ... following the rice package's cooking time`; SV `Koka ... enligt koktiden`; TH `หุงข้าว ... ตามเวลาที่ระบุ`: kaikki vastaavat keittämistä. Jokainen kieli säilyttää kuuman riisin, mangon raakakypsän rajan, kokonaisten seesaminsiementen määrän sekä kiellon lisätä makeutusta.
- Kolmessa kielessä samat seitsemän rakenteista ainesosariviä (yksi suola ilman määrää), ainesosien punnitut massat, 2 annosta, 25 min kokonaisaika ja neljä ravintoarvokenttää kuin alkuperäisessä FI-laskentaversiossa. Kolme valmistusvaihetta kussakin.

## Numeerinen näyttö ja hyväksyntärajat

- FI-historiallisen GK80-raakatiedoston SHA-256: `df6fe9113a62bc23fbea66eb023b30ef2aa70eeb3ec7221826fa96ff564997f8`.
- FI:n semanttinen `source_hash` (sisältää alkuperäisen `paistaminen`-metatiedon): `f5f1b28f29bbaade6a59ad21cf4c25505415c7e5fe746e0ad9601748e4d7a745`.
- EN:n `translation_hash`: `36b5c35b2c50f3bdb2375e7424dc683aa716e07d136d8cc16c6f870adcad2e7d`.
- SV:n `translation_hash`: `86042df5aac23fb36a52b4099a51e0ce8e3d201405109876373911aa88f19096`.
- TH:n `translation_hash`: `dd79f13d0ce861d02841d62e9650c5118f02860787d06b040b21e2a7e5899315`.
- `source_hash` kertoo **kanonisen raakatekstin version**; julkinen näyttömetatieto tulee PR #373:n erillisestä, täsmälleen tarkistetusta lähdeversiosta. Semanttinen SHA ei itsessään osoita merkityksen oikeellisuutta.
- Jos lukittu FI-lähde muuttuu, `EDITORIAL_FI_SOURCE_STALE` pysäyttää auditoinnin; jos locale-kenttä jää `paistaminen`, uusi auditointi hylkää sen. Testissä varmistetaan molemmat sekä kaikkien muiden reseptien tavallisen valmistustapavertailun säilyminen.

## Ei tehty

Ei korvattu vanhaa GK80-lähdehashia, ei muutettu FI-lähdetiedostoa, ei laskettu ravintoarvoja uudestaan, ei väitetty ihmiskatselmointia. Kolme muuta käännöskieltä eivät ole automaattisesti sallittuja. Tämän 3-käännöksen erän julkaisu edellyttää vielä saman HEADin CI PASS -tulosta sekä erillistä main-commitin Pages-deployn SUCCESS-vahvistusta. Mahdollinen virhe kirjataan ja pidetään Draft/HOLDissa, ei toistuvia sokkoyrityksiä.
