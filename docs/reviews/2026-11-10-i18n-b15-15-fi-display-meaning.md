# Käännöserä B15 – 15 korjattua EN/SV/TH-käännöstä

**Päivä:** 10.11.2026. **Tila:** AI-merkitysvertailu ja julkaisuehdokas; ei ihmisen tekemää koepaistoa tai kielikatselmointia.

## Lähtö ja oikeellisuuden lähteet

- FI-alkuperäisreseptit: Reseptit `main` `9785a2eef8e0affd34d5e39d74b8204bb9264495`, GK80:n seitsemän lukittua pakettia ennallaan.
- Julkiset, tarkasti raakaversion SHA:han sidotut toimitukselliset FI-korjaukset: [PR #373](https://github.com/ozirix-dev/Reseptit/pull/373), `site/scripts/gk80-editorial-display.ts`.
- EN/SV/TH-luonnosten alkuperä: [PR #356](https://github.com/ozirix-dev/Reseptit/pull/356), HEAD `f28381d4a1700f3018fa45cf9e502f91e3731bda`. Tässä erässä käytetyt viisi reseptiä käännettiin uudelleen julkista FI-valmistusohjetta vastaaviksi. Alkuperäisiä FI-raakareseptejä ei muokata.
- 15 `source_hash`/`translation_hash`-paria sidottu repo-skeeman semanttiseen SHA-256:een: tiivisteet perustuvat **kanoniseen FI-raakatekstiin ja julkaistaviin kieliteksteihin**. Näyttökorjaus on erillinen tarkasti SHA-lukittu vaihe, eikä sen käyttöä saa sekoittaa uuden GK80-lähdehyväksynnän kanssa. Semanttinen SHA todistaa vain tiedostoversion, ei kieliopillista oikeellisuutta.

## AI-katselmointi ja konkreettinen kielten merkitysvertailu

| Resepti | FI-julkisen näyttöversion ydinsäännöt ja EN/SV/TH-takaisinkäännöksen havainnot |
| --- | --- |
| `indonesialainen-bubur-ayam-kanariisipuuro` | 100 g kuivaa jasmiiniriisiä, 150 g nahatonta kananrintaa, 800 g vettä, 2 g inkivääriä ja 12 g kevätsipulia. Riisiä haudutetaan yhteensä noin 40 min; pieneksi leikattu kana lisätään noin 25 min jälkeen ja kypsyy vielä noin 15 min, **vähintään 75 °C** mitattuna. Kaikki kana ja keitinliemi jäävät ruokaan; vain vettä saa lisätä. EN/SV/TH käyttävät samoja aikamääriä, mittausrajaa ja samaa kahden annoksen laskentarajausta. |
| `vietnamilainen-chao-ga-kanapuuro` | Sama punnittu riisi/kanapohja kuin buburissa, mutta vietnamilainen nimi ja ruokalajin taustalinkki säilyvät. Riisi noin 40 min, kana viimeiset noin 15 min ja **75 °C**; kanan irronnut neste pidetään annoksessa. EN/SV/TH eivät muuta kanapuuron valmistusta tai lisää perinteisiä lisukkeita ravintolaskelman ulkopuolelta. |
| `munakasmuffinit` | 275 g kuorettomia munia, 60 g pekonia, 40 g pinaattia, 50 g cheddaria ja 30 g kermaa. Kuusi tarttumatonta silikoni- tai paperivuokaa, **ei erillistä voitelurasvaa**. Pannulle irronnut pekonirasva säästetään ja sekoitetaan munamassaan; sitä ei imeytetä talouspaperiin. EN/SV/TH poistavat vanhan virheellisen voiteluohjeen ja säilyttävät `190 °C`, `16–20 min` ja lepo-ohjeen. |
| `tonnikalamunakkaat-uunissa` | 220 g kuorettomia munia, 120 g valutettua tonnikalaa, 50 g emmentalia, 30 g kermaa; vuoat ilman erillistä rasvaa. EN/SV/TH säilyttävät `190 °C`, `15–18 min`, 6 muffinivuokaa, 3 annosta ja varoituksen laskennallisen rasvan lisäyksestä. |
| `pohjoisafrikkalainen-harissa-shakshuka` | 110 g kananmunan **syötävää, kuoretonta osaa**, kotiharissa 5 g täsmälleen luetelluista ainesosista sekä paistoöljy 13,5 g. EN/SV/TH sisältävät kuorettoman munan ja poistavat aikaisemmat maininnat, joiden mukaan julkisen FI-lähteen korjaus olisi edelleen kesken. Kaupallinen harissatahna ei kuulu laskelmaan. |

Kaikissa 15:ssä ainesosamäärät, neljä annoskohtaista makroarvoa, kokonaisaika, annosmäärä ja numeroidut valmistusvaiheet on verrattu FI-raakalähteen vastaaviin lukuihin. AI:n valmistusvertailussa on huomioitu **julkiseen FI-versioon sidotut lisäohjeet**. Tuoreita kenttähintoja, uusien GI-lähteiden hyväksyntöjä tai ravintoarvolaskuja ei väitetä syntyneen.

## Tahallisesti julkaisematta

**`thai-kookosriisi-mangolla` EN/SV/TH (3 kpl)** pysyvät Draftina PR #356:ssa. FI:n kanonisessa lukitussa metatiedossa `cooking_method: paistaminen`, mutta PR #373:n julkisessa esityksessä `keittäminen`. EN/SV/TH-luonnosten raw-metatiedoissa on edelleen vanha paistaminen. Ei julkaista tiedostoa, jonka toimituksellinen valmistustapametadata tunnetaan virheelliseksi, ennen yhteensovitettua lähde-/kieliversiota ja hyväksyntänäyttöä.


## Julkaisuajon deterministinen korjaushistoria

- Ensimmäinen PR-CI [#42716227557](https://github.com/ozirix-dev/Reseptit/actions/runs/42716227557) pysähtyi whitespace-porttiin: kolmessa shakshuka-käännöksessä oli vanhan lähdehuomautuksen poiston jäljiltä ylimääräinen loppurivi. Rivit poistettiin muuttamatta semanttisia SHA-tarkisteita.
- Toinen PR-CI [#42716379173](https://github.com/ozirix-dev/Reseptit/actions/runs/42716379173) läpäisi muuttuneiden käännösten tarkistuksen mutta pysähtyi TypeScriptin `TS18046`/`TS7006`-virheeseen uuden näyttösovitusregressiotestin ainesosajäsennyksessä. Kenttä jäsennetään nyt eksplisiittisesti `recipeFrontmatterSchema.parse`-kutsulla ennen määrien vertailua. Ei FI-raakalähteen eikä käännöksen muutoksia.
- Enintään yksi kolmas kokonaisajo tässä julkaisukierroksessa. Jos sekin epäonnistuu, tämä julkaisu pysyy Draft/HOLDissa; ei sokkoyrityksiä.

## Riippumattomat laatupolut

- CI:n Changed-content ja strict Translation audit: 15 muutettua kielitiedostoa sekä 15 ajantasaista SHA-paria.
- GK80 Release 6:n historiatestissä **säilytetään alkuperäinen `existingLocales`-joukko muuttumattomana**. Myöhemmin julkaistut käännökset hyväksytään vain erillisestä julkaisusivurekisteristä, jos sekä FI- että käännöstiedoston SHA-pari on nykyinen ja niiden luokituksessa ei ole avointa P0/P1:tä. Sama tarkistus tehtiin aiemmin Release 7:lle.
- `site/tests/gk80-editorial-translation-release.test.ts` varmistaa FI-julkaisuesityksen ja 15 käännöksen annosten, ainesosamäärien, makrojen, kypsennysrajojen sekä voitelurasvakieltojen vastaavuuden. Testi hylkää myös virheellisen kookosriisin luvattoman julkaisun.
- CI-ajon on päätyttävä SUCCESS **tarkalle HEAD-SHA:lle** ennen mahdollista mergeä. Mainin Pages-build ja deploy tarkistetaan omalta yhdistämis-SHA:ltaan.

## Riskit ja avoimet asiat

Kanoninen FI-raakatiedosto sisältää yhä kuuden reseptin vanhoja tekstimuotoja. Tässä käytetään versiopinnattua **näyttökorjausta**, joka on tarkoituksellisesti erillinen historiassa hyväksytystä GK80-numeerisesta tiedosta. Uuden FI-raakaversion hyväksyntää, ihmisen fyysistä koepaistoa tai mitattua aterian GI:tä ei tehdä. Julkaistut käännökset kertovat sivuston näyttöversion valmistusohjeen, eivät muuta historiallisen raakatiedoston GK80-lähdeidentiteettiä.

Yksi etukäteen valmisteltu julkaisu-PR, yksi täysi PR-CI; jos ilmaantuu yksilöity regressio, korkeintaan yksi perusteltu korjaus, muutoin HOLD. Jo julkaistuja kieliversioita ei palauteta Draftiksi vanhan PR #356:n mukana.
