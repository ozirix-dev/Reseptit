# Recipavon nykytilanäkymä

Tämä on [RFC:n #555](https://github.com/ozirix-dev/Reseptit/pull/555) P0/P1-pilotti
ja inventaarioraportin rajattu integraatio. GI/GK:n vastuut seuraavat
[auditointia #533](https://github.com/ozirix-dev/Reseptit/pull/533).
Versioitu JSON sopii myöhemmin [D1:een suunnitellun](https://github.com/ozirix-dev/Reseptit/pull/660)
lukuprojektion syötteeksi.

## Käyttö

Aja riippuvuuksien asennuksen jälkeen puhtaan työpuun `site/`-hakemistossa.

```sh
node --import tsx scripts/recipe-state-cli.ts
```

Komento regeneroi sisältö- ja auditointisyötteet ja tallentaa
`tmp/recipe-state/current.json`-tiedoston repon juureen suhteutetulla polulla. Aja saman työpuun
buildit ja auditoinnit peräkkäin, sillä niiden välituotteilla on yhteiset polut.
Tarkista `sourceCommit` ennen tuloksen käyttöä. Jos ajo keskeytyy, levyllä voi
olla edellisen onnistuneen ajon projektio. Git ohittaa projektion ja
välituotteet. Sisäinen JSON kuuluu `tmp/`-hakemistoon.

`npm run report:inventory` säilyttää kentät, laskurien määritelmät ja
`content:sync`-vaiheen. Raportti käyttää samaa julkisen sisällön indeksiä kuin
laajempi projektio. Se tarvitsee vain buildin julkisen reseptiluettelon.

## Tietojen omistajuus

| Tieto | Omistava lähde ja tulkinta |
| --- | --- |
| Reitti ja hakemistonäkyvyys | `build-content.ts` lukee aktiiviset reseptihakemistot ja `kaannokset/`-puun, käyttää skeemaa, karanteenia, SHA-sidottuja toimituksellisia projektioita ja HOLD-varoituksia. `site/src/content/route-data.ts` kokoaa hakemisto- ja reseptipaketit. Projektio lukee generoidut reitit ja tunnukset. Näkyvyys kuvaa commitin buildia. Tuotantodeploylla on oma SHA. |
| Identiteetti | FI Markdownin `recipe_id`. `meta/recipe-successors.json` yhdistää julkisen seuraajan karanteeniin jääneeseen edeltäjään, kun polku, Git-blob, slug ja reitit täsmäävät. Edeltäjä antaa kanonisen tunnuksen ja säilyy versiohistorian viitteenä. Semanttinen duplikaattiraportti on toimituksellinen tarkistus. |
| Käännös ja lupa | Reitti tulee buildista. `translation-audit.ts`, julkaisusivuindeksi ja `translation-review.ts` määrittävät katselmoinnin tilan ja kaksi merkitystiivistettä `meta/kaannokset/`-evidenssistä. F25 käyttää nykyisiä lähde-, ravinto- ja GK-sidoksia. Historiallisen edeltäjän F25 HOLD säilyy edeltäjän viitteessä. |
| Ravinto | `nutrition-audit.ts` lukee laskentatiedostot, erämanifestit ja lähteet. Projektio tarkistaa raportin lähdepolun ja sisällön SHA-256:n ja lukee auditoidun tilan. |
| GK | `glycemic-load-pilot.ts` omistaa laskennan ja julkisen yhteenvedon, `glycemic-coverage-inventory.ts` erävertailut. Projektio lukee julkisen alkuperäisen arvon, sisäisen tuloksen tilan, täsmäytyserot, erilliset laskentaversiot sekä SHA-lukitun uuden reseptin odotusjonon. |
| Kuva | Buildin kuvalähde verrataan julkaistavan FI-lähteen valitsemaan polkuun ja Git-blobin olemassaoloon. Merkintä vahvistaa tiedostovastaavuuden. Kuvan sisällöllistä arviointia varten käytetään reseptin katselmointia. |

Skeema 1 käyttää `canonicalRecipeId`-tunnusta tietueen avaimena ja
`sourceRecipeId`-tunnusta nykyiselle lähdeversiolle. `contentHash` on
LF-normalisoidun Markdownin SHA-256. `effectiveContentHash` kirjataan kun
buildin projektio muuttaa tekstiä tai lisää nykyiselle sivulle HOLD-varoituksen.
Katselmoinnin päivämääräraja tulee commitista. Aikaleima jää tuloksen
ulkopuolelle. Epäselvä seuraajasidos ilmoitetaan `conflicts`-listassa ja
lähdetunnukset säilyvät erillisinä, kunnes omistava rekisteri ratkaisee sidoksen.
`publicState`, käännöskatselmointi ja `currentBlockers` kuvaavat eri päätöksiä.

`verifiedRawGkRelease` kertoo käytössä olevan julkaisulaskennan tarkistaman
FI-lähdepolun, tiivisteen, tuloksen ja evidenssitiedoston. Kun ne vastaavat
nykyistä lähdettä ja näkyvää arviota ja buildin annosjako, ainesosat,
valmistus ja muistiinpanot täsmäävät tarkistettuun FI-lähteeseen,
vanhan reseptisidonnan ero säilyy kentässä
`historicalSourceBindingDifference`. Raakalaskennan auditointi säilyttää
alkuperäisen poikkeaman. Ohjeen vertailu hyväksyy katselmoidun
pilkkuvälin lisäyksen grammoina ilmoitettujen ainesmäärien luetteloon,
kun molemmat näkyvät valmistusohjeet täsmäävät sen jälkeen.
Pelkkä `cooking_method`-luokituksen muutos sallitaan, jos muu
lähdesisältö ja näkyvä valmistus täsmäävät. Katselmoidulle
FI-esityskorjaukselle vertailu käyttää korjattua versiota,
kun sekä koko esitysversio että alkuperäinen julkaisutodiste vastaavat
kirjattuja SHA-256-tiivisteitä. Annosjako, ainekset, molemmat
valmistusohjeen esitystavat ja muistiinpanot tarkistetaan myös näille.
Katselmoitu kananmunan kappalemäärä täsmää grammoina annettuun lähderiviin
vain, jos näkyvässä ainesrivissä näkyy myös sama kuoreton kokonaispaino.
Tällöin valmistuksen viittaus samaan ainesriviin vastaa grammoina annettua
ohjetta. Muut ainekset, erilliset valmistustoimet ja muistiinpanot
tarkistetaan edelleen.

Kahdeksassa release-4-reseptissä myös annosjakoa ja syötävän erän
säilyttämistä koskevat ohjeet sekä laskentaoletukset muistiinpanoissa
on sidottu alkuperäiseen julkaisupakettiin ja näkyvän valmistusosion
tiivisteeseen. Muffineissa ja tonnikalamunakkaissa kolme annosta
vastaa kahta kappaletta annosta kohti. Avokadomunissa jaetaan myös
koverrettu hedelmäliha ja erikseen kypsennetty muna. Porsaan ja
lihamurekkeen annosjako sisältää kastikkeen tai paistonesteen.
Nasi uduk pysyy käsintarkistuksessa. Vertailussa käytetty jasmiiniriisin
GI-lähde ei varmista ehdollisen lisäveden ja kannellisen kypsennyksen
vastaavuutta mitattuun valmistukseen.

Muuttunut julkaistu ohje, puuttuva varmennus sekä
laskentasyötteen ja lähdeaineiston erot
kuuluvat `bindingDifferences`-kenttään. Kun alkuperäinen julkaisulähde
täsmää, `releasePresentationDifferences` näyttää, poikkeavatko näkyvä
lähdeversio, annosmäärä, ainekset, valmistus tai muistiinpanot.

## Lähtömittaus

Lähtöcommit `5eab296998caa06143b06e1adf3f09f9d7dfed6d`. Projektion
reseptisyötteet ja julkinen sisältö vastaavat samaa committia.

| Joukko | Määrä ja rajaus |
| --- | --- |
| Julkiset FI-reseptit | 390 FI-reittiä, joista 370 nelikielistä ja 20 FI-only. Puuttuvia julkisia EN/SV/TH-kielipaikkoja 60. |
| Julkaisemiselta estetyt FI-lähteet | 25 `published`-lähdettä ilman julkista FI-reittiä, kaikki karanteenissa. |
| Luonnokset | 23 FI-tiedostoa. Niistä 16 on samantunnuksisia työversioita ja 7 omaa luonnostietuetta. |
| Nykyiset resepti-HOLDit | 8 karanteenissa olevaa FI-lähdettä ilman varmennettua seuraajaa. Julkisia varoitussivuja 0. |
| Historialliset HOLDit | 17 SHA-varmennettua karanteeniedeltäjää ja 17 julkista seuraajaa. F25:ssä 1 nykyinen ja 2 edeltäjälle jäävää portin estoa. |
| GK-alkuperäinen, julkiset FI:t | 151 laskettua, 168 määrittämätöntä ja 71 lähdekatselmointia odottavaa. |
| GK-alkuperäinen, laskenta-auditointi | 344 erän lähdettä, joista 156 laskettua ja 188 määrittämätöntä. Joukko sisältää karanteenihistoriaa. |
| Hyväksytyt GK-erillisversiot | 79 reseptivarianttia ja 8 tutkimusvertailua. Julkisissa moduuleissa vastaavasti 72 ja 6. |
| Ravinto, julkiset FI:t | 250 evidenssiin perustuvaa arviota, 96 puutteellista ja 44 ilman arvoja. Ravintoauditointi käsittelee yhteensä 415 FI-lähdettä. |

Lisäksi vanhan saman ID:n HOLDin poistaminen varmennettiin kolmessa
korjauscommitissa. Edellinen ja nykyinen sisältö ovat eri versiot.
Nämä tapaukset jäävät Git-historian varaan.

| FI-tunnus | HOLDin poistava commit | Vanha / nykyinen SHA-256, alku |
| --- | --- | --- |
| `hyderabadi-kanabiryani` | `19b68d96` | `c3434af8d2db` / `591ff23b6543` |
| `jiaozi` | `fce5b1d6` | `07659418c6a8` / `3ca732e55e98` |
| `tunisialainen-brik` | `33453893` | `1eb06f3db86f` / `ba717dc99f3f` |

## Vastaavuus ja kustannus

- Projektio kattaa 405 nykyistä identiteettiä, 17 historiallista edeltäjää ja
  samantunnuksiset luonnokset. Kaikki 1 500 reseptireittiä, niiden resepti- ja
  kielitunnukset ja julkiset hakemistot täsmäsivät käännettyyn `dist/`-pakettiin.
  Julkaisuun vaikuttavia konflikteja havaittiin 0. Luonnos- ja
  vanhentuneen käännöksen tapaukset testattiin myös simuloiduilla syötteillä.
- Inventaarioraportin 390 reseptiä, 1 500 kieliversiota, 1 504 raportoitua
  reittiä ja 389 erillistä pääkuvapolkua säilyivät. Inventaario ja
  reseptiprojektio käyttävät yhtä yhteistä reitti- ja kielilaskentaa.
- Peräkkäisten CLI-ajojen tulos oli tavutasolla sama. Syötteiden generointi
  vei lämpimällä koneella noin 20 s, niiden luku ja katselmointirekisterin
  laskenta 4,6–4,8 s sekä projektio ja JSON-serialisointi 30 ms.
  Inventaarioraportin oman tulostusprosessin ajo oli 1,19 s ennen ja
  0,66 s jälkeen yksittäisissä ajoissa. Molemmat lukevat saman build-syötteen.
  Ensimmäinen koko build vei 106 s ja lämmin tarkistusbuild 37 s.
  Nämä build-ajat sisältävät kuvat ja prerenderin sekä eri välimuistitilan.
- Staging-paketin 4 491 tiedostoa vastasivat lähtöbuildia tavutasolla.
  GK-auditoinnissa vaihtui ajoaikaleima. Ravintoauditoinnin laskelmat ja
  tilat täsmäsivät, kun ajoaika ja koodin provenienssi jätettiin vertailusta
  pois. Projektioajo muutti 0 versionhallittua tiedostoa.
- GK149-regressio lukee viisi [PR:ssä #663](https://github.com/ozirix-dev/Reseptit/pull/663)
  arkistoitua Markdownia varmennetusta palautuscommitista ja tunnistaa kahden
  käyttöohjeen yhdistetyt tiedostoversiot. Testin tulos- ja laskentalukot
  käyttävät alkuperäistä lähtöversiota.

## GK-erädelta ja julkinen paketti

```sh
mkdir -p ../tmp/nutrition/glycemic-coverage
node --import tsx scripts/glycemic-coverage-delta.ts BASE.json TARGET.json > ../tmp/nutrition/glycemic-coverage/delta.json
```

Kontrolloidussa 2B1 → 2B2 -kokeessa 316/325 reseptiriviä säilyi.
Deltan 493 324 tavusta ja lukitusta 2B1-lähteestä rekonstruoitiin täsmälleen
2B2:n 3 270 277 tavua. Säästö oli 84,9 % täyden kohdesnapshotin koosta.
Paketti sisältää kummankin syötteen commitin ja SHA-256:n, kohteen järjestyksen
ja metatiedot sekä muuttuneiden rivien ennen/jälkeen-arvot ja sidokset.
Palautus hylkää väärän lähtösnapshotin. Nykyiset snapshotit pysyvät
`glycemic-coverage-inventory.test.ts`-regressiotesteissä ja niiden
poistolle tarvittaisiin erillinen riippuvuusmuutos.

Staging- ja tuotantoasetuksin paikallisesti rakennetuista paketeista
tarkistettiin polut ja tekstimuotoiset artefaktit. Tarkistus kattoi reseptien
reitit ja JSONit, selainmoduulit, julkiset GK-osat sekä tunnettujen sisäisten
rekisterien nimet ja kenttätunnisteet, SQLite- ja avaintiedostot.
Kenttä- ja tiedostotarkistuksessa ei havaittu sisäistä tutkimus- tai
hyväksyntäaineistoa. Julkiset ravintoarvot, GK-arvot ja niiden lähdeviitteet
kuuluvat pakettiin.
