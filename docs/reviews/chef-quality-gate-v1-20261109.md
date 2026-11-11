# Kokkikelpoisuuden laatumenetelmä – V1 ja viiden reseptin pilotti

**Päivä:** 9.11.2026 · **Repo:** `ozirix-dev/Reseptit` · **Omistajuus:** tämä PR koskee vain uusia `chef-quality-gate*`-tiedostoja, pilotin aineistoa ja CI:n rajattua lisäaskelta. **Ei muuta** muiden PR:ien #358, #359, #360, #361, #362, #356 tai #357 omistamia reseptejä ja validaattoreita.

## Tavoite ja periaate

**Ruokalajin oikeellisuus ensin, nopeus toisena.** Vihreä CI, oikealta näyttävä YAML tai keskenään samansisältöiset käännökset eivät yksin todista, että resepti on keittiössä toimiva tai ravintolaskenta oikea. AI:n tekemä reseptikatselmointi **ei ole fyysinen koepaisto**.

Kaksi erillistä hyväksymisporttia:

1. **Kokkikelpoisuus:** ruokalaji tunnistettava, ainekset ja määrät uskottavat, toimivat työvaiheet, lämpö, ajat, annosmäärä, raaka-aineiden käsittely ja riskit.
2. **Tekninen julkaisukelpoisuus:** validi sisältörakenne, muuttumaton/korjattu ravintoevidenssi, GI/GK-version oikea sidonta, muutettujen FI/käännösparien ajantasaiset semanttiset SHA-tiivisteet, CI- ja julkaisuportit sekä yksittäinen tiedoston/PR:n omistaja.

### Menetelmän vaiheet

1. **Lukitse lähtöversio.** Varmista `git remote`, lähdehaara, reseptin Git-blob-SHA ja muiden PR:ien tiedosto-omistajuus. Muuttunut lähdesnapshot -> **STALE**, ei vanhan tarkistuksen automaattista hyväksyntää.
2. **Varmista ruokalaji.** Käytä vähintään yhtä tunnistettavaa, ruokaa koskevaa ulkoista lähdettä ja dokumentoi sen soveltuvuus. Älä kopioi ulkopuolisen reseptin aineksia tai mittasuhteita suoraan tämän projektin eri versioon. Kirjaa alkuperäinen ruokalajiajatus.
3. **Tarkista aineet ja käyttö.** Jokainen ruokaan jäävä ainesosa, rasva ja neste; määrä, yksikkö, raaka/kypsä, hävikki, annoskoko ja mahdolliset allergeenit. **Vesi erotellaan:** (a) huuhtelu/keitinvesi, joka poistuu, (b) taikinaan/keittoon jäävä vesi, (c) epäselvä. Vain (b) vaatii koostumuksen ja mahdollisen laskentaperustan arvioinnin; määrä puuttuu -> HOLD. Keitinvettä ei saa automaattisesti lisätä makroihin.
4. **Lue valmistus kokin silmin.** Tunnista geneeriset pihvi-/taikina-/keitto-ohjeet, epäuskottavat ajat, puuttuvat vaiheet, kypsyystavoite, turvallinen käsittely ja ruoan määrä. Älä parantele epäuskottavaa aineslistaa pelkällä sujuvalla tekstillä.
5. **Luokittele korjaus:** A – tekstivirhe ilman raaka-aineiden tai menetelmän merkitysmuutosta; B – määrä, ruoan rakenne, valmistusaika tai ravintovaikutus; C – turvallisuus, ratkaisematon alkuperä tai GI/GK-/käännössidoksen epävarmuus. **B/C eivät mene suoraan julkaisuun.** A:kin tarvitsee kokkikatselmoinnin ja tarvittavat semanttiset vertailut.
6. **Tarkista vaikutusketju.** Vertaa ennen/jälkeen `ingredients`, `servings`, `cooking_method`, `time_total_min`, makrot ja valmistusteksti. Pelkkä tekstidiffi ei todista, että kypsennysmenetelmä pysyi biologisesti samana. GI/GK pidetään HOLDissa, jos menetelmän vaikutus on arvioimatta. Julkaistujen käännösten muuttuessa verrataan kaikki pari- ja tilatiedot uudelleen.
7. **Hyväksy vain sidotulla todistusaineistolla.** Kirjaa perustelut, mahdollinen ulkoinen lähde, lähde-SHA, korjaus-PR, CI-ajon HEAD, ravintolaskennan versio ja käännösvertailujen todistus. Jos jokin P0/P1 on avoin, **HOLD**. Toimituksellisesti ratkaistut havainnot eivät koskaan tarkoita automaattista `READY`/mergeä.
8. **Nopeuta vasta toistetun oikeellisuuden jälkeen.** Yksinkertaiset A-tapaukset voidaan niputtaa; B/C käsitellään pienissä erissä. Tarkistin tekee automaattisen seulonnan ja lähdeversioiden valvonnan; ihminen/tekoäly toimittaa erillisen merkitysarvion eikä väitä koepaistoa.

### Väärien positiivisten kontrollit

- Ei päätellä kaikkia `sipuli`-esiintymiä tavalliseksi sipuliksi: erota valkosipuli, kevätsipuli ja keltasipuli.
- `Ei lisätä`, `ei kuulu` ja `valinnainen` ovat eri asioita kuin pakollinen raaka-aine.
- Useassa valmistusvaiheessa käytettävän saman aineen **kokonaismäärän jakaminen** tarkistetaan erikseen; se ei ilmene pelkästä sanahakemisesta.
- `Huuhtele riisihiutaleet` tai `keitä vedessä` ei tarkoita, että vettä olisi lisättävä ravintolaskentaan.
- Samalla tiedolla ei saa hyväksyä sekä aineslistan korjausta että siihen perustuvaa ravintolaskentaa ilman riippumatonta lähdekytkentää.
- Lukitut GK100/GK149-lähdesnapshotit ja erilliset käännös-PR:t eivät vaihda omistajaa tämän pilotin perusteella.

## Pilotti: viisi erilaista ongelmatapausta

Lähtötilanteena `main`-haaran reseptit; lukittu Git-blob-SHA ja tarkat koneellisesti tarkastettavat havainnot tiedostossa [chef-quality-pilot-five-20261109.json](chef-quality-pilot-five-20261109.json).

| Resepti | Luokka | Ongelma | Pilotin sallima jatko |
| --- | --- | --- | --- |
| Serabi-kookospannukakku | A / toimituksellinen katselmointi | Yleisohje korjattu. Kotiohjeessa tehdään paksuhkoja pannukakkuja. | GK100-arvio kuuluu erilliseen ohueen versioon. [Ohjekorjaus #362](https://github.com/ozirix-dev/Reseptit/pull/362) |
| Bakwan-maissifritter | B | Fritterikohtainen ohje on mainissa. Taikinaveden kokonaismäärä ja porkkanan syötävä paino ovat avoinna. | HOLD – mittaa vesi, porkkana ja saanto ja varmista ravintolaskennan perusteet |
| Bissara-härkäpapukeitto | B/C | Kuivat pavut, 25 min ja olemattomat nuudelit/liemi | HOLD – paputyyppi, kypsennys ja kokonaisaika |
| Yaki-onigiri misolla | B/C | 100 g riisiä + 150 g misoa + 150 g noria; riisin tila epäselvä | HOLD – mittasuhteet, raaka/kypsä ja GI/GK |
| Poha maapähkinöillä | A + kieliriski | Pihvi-/taikinaohjeet ja kolme julkaistua käännöstä | HOLD – FI+EN/SV/TH yhteiskatselmointi |

Ensimmäinen pilotti **ei muuta yhtään reseptiä** eikä julkaise uusia ravintoarvoja. Tarkoitus on testata päätösmenetelmää eri vikaluokkia vasten, havainnoida puutteet ja korjata menetelmää ennen laajaa käyttöönottoa.

## Testaus

Suorita `site/`-hakemistossa (riippuvuudet: `npm ci`):

```sh
node --test scripts/chef-quality-gate.test.mjs
node scripts/chef-quality-gate.mjs --out=site/chef-quality-pilot
```

Raportit syntyvät `site/chef-quality-pilot.json` ja `site/chef-quality-pilot.md`. GitHub Actions tallentaa ne CI-artifactiksi. Laskennan `PILOT_EVIDENCE_CURRENT` tarkoittaa ainoastaan, että viisi dokumentoitua, lähdesnapshottiin sidottua havaintoa ovat edelleen todennettavissa. **Se ei tarkoita, että viisi reseptiä olisi korjattu tai julkaisuvalmiita.**

## Menetelmän seuraava validointi

Pilottiajon jälkeen tarkasta erityisesti, peittääkö yksi HOLD-päätöslaji toisen samanaikaisen vakavan ongelman, löytyykö kaikkien käännösten todellinen julkaisutila sekä jääkö menetelmän muuttumattomuus oletukseksi. Päivitä testit löydösten mukaan. Laajempi CI-portti aktivoidaan vasta, kun se ei estä virheellisesti muuhun työhön liittyviä, jo hyväksyttyjä korjauksia.
