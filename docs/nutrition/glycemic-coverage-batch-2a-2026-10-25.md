# GI/GK-kattavuuserä 2A – katselmointi ja tulokset

## Tavoite ja rajaus

Tämä on rajattu katselmointi historiallisen GK-työjonon 51 vanhentuneesta reseptisidonnasta ja enintään kymmenestä valitusta korjauksesta. GI/GK-mallia, 1 g:n yksittäistä pienosuusrajaa tai 2 g:n kumulatiivista toimituksellista toleranssia ei muutettu. Kliinistä tarkkuutta ei väitetä.

Työ tehtiin Reseptit-repon ajantasaisesta main-committista `5e9cdeb830f468ecf099e9c286f9344afe3b6b71`, haarassa `codex/glycemic-coverage-batch-2a` ja erillisessä työpuussa `D:\Projects\Products\Reseptit-glycemic-coverage-batch-2a`. Arvioitu syöte- ja työkalurevisio on `640eb38f023169445d55d4576c37ae4097a222b2`; nykyinventaarion `sourceCommit` sitoo laskennan tähän commit-tunnisteeseen. Alkuperäinen erän 1 inventaario on säilytetty ennallaan.

## Lähtötilanne ja inventaariot

Hyväksytty lähtötilanne oli 325 reseptiä, joista 114:lle laskettiin GK ja 211 oli keskeneräisiä. GI-luettelossa oli 38 tietuetta (5 STRONG, 33 SUPPLEMENTARY). Strict nutrition -auditissa oli 180 lähteillä tuettua arviota, 86 tarkistettavaa, 59 puuttuvaa ja 0 ristiriitaa.

Erillinen nykyinventaario muodostetaan auditointien tuloksista. Se sisältää kaikki 325 reseptiä kerran, sitoo vertailun commit-tunnisteeseen ja näyttää jokaisen keskeneräisen reseptin tila-, versio-, lähde-, este- ja jatkotoimitiedot. Erän hyväksytty vertailusnapshot sekä 51 sidonnan korjausta edeltävä nykytila on tallennettu erikseen:

- [Nykyinen GK-inventaario, JSON](glycemic-coverage-current-2026-10-25.json)
- [Nykyinen GK-inventaario, taulukko](glycemic-coverage-current-2026-10-25.md)
- [Erän 2A hyväksytty lähtösnapshot](glycemic-coverage-batch-2a-baseline.json)
- [51 sidonnan aloitustilanne ennen korjauksia, JSON](glycemic-coverage-batch-2a-review-start.json)
- [51 sidonnan aloitustilanne ennen korjauksia, taulukko](glycemic-coverage-batch-2a-review-start.md)

Erän 1 alkuperäinen 213 reseptin inventaario (`glycemic-coverage-inventory-2026-10-25.json`, 112 laskettua / 213 keskeneräistä / 37 GI-tietuetta) säilyy erillisenä historiallisena tiedostona.

## Kaikkien 51 rakennesidonnan analyysi

Korjauksia edeltävässä nykyajossa kaikki 51 reseptiä olivat GK:n osalta keskeneräisiä. Jokaisella oli rakennesidonnan lisäksi vähintään yksi muu kirjattu este. Sidonnan tai fingerprintin päivittäminen yksin ei olisi palauttanut yhtäkään GK-arviota.

Päällekkäiset muut esteet (reseptimäärä, ei toisensa poissulkeva):

| Muu este | Reseptit |
| --- | ---: |
| Koostumus tai lähteistetty hiilihydraattimäärä | 24 |
| Muu yksilöity tieto-/varianttiongelma | 19 |
| GI-lähde puuttuu | 19 |
| GI-vastaavuus ei ole hyväksyttävä | 12 |
| Massa-/valmistustilamuunnos | 9 |

Yksi resepti voi esiintyä useassa luokassa. Aloitustilanteen yksityiskohtainen rivi sisältää nykyisen reseptirakenteen, GK-syötteen määrät ja lähteet, ravintoarvotilan, muut estot sekä arvion siitä, avaisiko pelkkä sidonta arvion.

## Ensimmäiset kymmenen tarkistusta

| Resepti | Tarkistettu ja korjattu syöte | Jäljellä oleva tila |
| --- | --- | --- |
| `karibia-johnny-cake` | Maito 60 ml, voi 15 g ja leivinjauhe 5 g vastaavat nykyistä reseptiä. Leivinjauheelle lisättiin Fineli-lähde. | GK laskettu; matala luottamus. |
| `pohjoisafrikkalainen-msemen-hunajalla` | Voi korjattiin reseptin 50 grammaan ja sidottiin Finelin voilähteeseen. | GK laskettu; matala luottamus. |
| `japanilainen-tamago-kake-gohan` | Kuivattu nori korjattiin 150 grammasta reseptin 2 grammaan ja sidottiin kuivattua noria vastaavaan tietueeseen. | GK laskettu; matala luottamus. |
| `malesialainen-nasi-lemak-aamiaisella` | Kurkku korjattiin 400 grammasta reseptin 100 grammaan. Kookosmaidon 200 ml jätettiin massaltaan ratkaisemattomaksi; 184 g:aa ei oleteta. | GK keskeneräinen: kookosmaidon massa/tilavuusmuunnos. |
| `thai-kookosriisi-mangolla` | Mango korjattiin 240 grammasta 150 grammaan ja seesami 100 grammasta 6 grammaan. Seesamille aiemmin annettu pähkinäryhmän GI-vastaavuus poistettiin. Kookosmaidon muunnos jätettiin ratkaisematta. | GK keskeneräinen: kookosmaidon massamuunnos ja seesamin GI. |
| `pohjoisafrikkalainen-harissa-shakshuka` | Paprika muutettiin reseptin 150 grammaksi punaista paprikaa ja Finelin punaiseen paprikaa vastaavaksi lähteeksi. Raakatomaatin ja väärän paprikavastaavuuden GI-sidonnat poistettiin. | GK keskeneräinen: tomaatin ja paprikan soveltuva GI sekä harissan koostumus. |
| `meksikolainen-quesadilla-sienilla` | Mozzarella korjattiin 80 grammaan ja sienet 75 grammaan; sienelle lisättiin AFCD:n tuoreiden herkkusienten tietue. Maissi korjattiin 240 grammasta 80 grammaan, mutta säilytys-/kypsennystilaa ei päätelty. | GK keskeneräinen: maissin lähde- ja valmistustila. |
| `indonesialainen-bakwan-maissifritter` | Maissin määrä korjattiin 240 grammasta reseptin 100 grammaan tuoreita jyviä. Grillattua tähkää ei käytetä tuoreiden jyvien vastineena. | GK keskeneräinen: tuoreiden maissinjyvien koostumus- ja GI-lähde. |
| `valimerellinen-farinata-aamupalaksi` | Oliivit korjattiin 150 grammasta 25 grammaan, tomaatti 125 grammasta 100 grammaan ja rosmariini 150 grammasta reseptin 1 grammaan. Reseptin 150 ml vesi lisättiin nollahiilihydraattisena. Raa'an tomaatin GI poistettiin kypsennettävästä reseptistä. | GK keskeneräinen: soveltuva tomaatin GI. Rosmariinin pieni hiilihydraattiosuus käsitellään nykyisellä toimituksellisella toleranssilla. |
| `valimerellinen-halloumi-tomaattileipa` | Oliivit korjattiin 150 grammasta reseptin 25 grammaan. | GK keskeneräinen: hapanjuurileivän koostumuslähde. |

Kaikki kymmenen reseptin määrä-, ruoka-aine- ja lähdesyötefingerprintit tarkistettiin sisällöllisten muutosten jälkeen. GI-arvoja ei lisätty. Tuntemattomia maissi- tai kookosmaitomassoja ei käsitelty nollana. Muuttunutta valmistustapaa ei ohitettu fingerprintillä.

## Vaikutus GK-kattavuuteen

| Mittari | Ennen | Jälkeen |
| --- | ---: | ---: |
| Reseptit | 325 | 325 |
| Laskettu GK | 114 | 117 |
| Keskeneräinen GK | 211 | 208 |
| GI-tietueet | 38 | 38 |
| Uusia laskettuja arvioita | – | 3 |
| Aiemmin laskettuja, nyt estettyjä | – | 0 |
| Korjauksen kohteena olleita sidontoja | – | 10 |
| Sidontaan liittyviä jäljellä olevia vanhoja estotapauksia | 51 | 48 |

Kolme aiemmin puuttunutta, käyttäjälle näkyvää matalan luottamuksen arviota palautui: Johnny cake 21,96, msemen hunajalla 44,59 ja tamago kake gohan 26,47 GK/annos. Niiden aiemmat arvot olivat puuttuvia, joten kyse ei ole aiemmin julkaistun numeron muutoksesta vaan arvion palautumisesta. Seitsemän muuta valittua reseptiä jäivät perustellusti ilman kokonais-GK:ta.

Yksikään jo laskettu arvo ei muuttunut. Nykyinen käyttöliittymä ei luokittele GK-arvoja erillisiin numeerisiin luokkiin, joten luokkarajamuutoksia ei ole. Ruokavalintaa tai reseptien vertailua voi nyt tehdä kolmelle uudelle matalan luottamuksen arviolle; korjauksen muuttamien arvojen määrä, joilla vertailun saatavuus muuttui, on **3**.

Strict nutrition -audit pysyi muuttumattomana: 180 tuettua, 86 tarkistettavaa, 59 puuttuvaa, 0 ristiriitaa. GK:n 208 keskeneräisestä arviosta 112:lla on tuettu ravintoarvotila, 42 kaipaa ravintoarvotietojen tarkistusta ja 54:ltä lähdetiedot puuttuvat.

## Regressiosuoja ja paikallinen varmistus

Nykytilan testit varmistavat koko reseptijoukon yksikäsitteisyyden, lähtösnapshotin, 51 sidonnan aloitustilanteen muiden esteiden päällekkäisyyden, historian 213 reseptin inventaarion säilymisen sekä valittujen syötteiden rajat. GK:n olemassa olevat testit varmistavat myös määrä- ja valmistustilamuutosten fingerprintit, väärän GI-vastaavuuden hylkäyksen, tuntemattomien määrien/koostumusten eston sekä 1 g / 2 g -toleranssin.

Paikalliset tarkistukset läpäisivät:

- `npm test` — 105 testiä.
- `npm run test:translations` — 26 testiä.
- `npm run test:image` — 7 testiä.
- `npm run test:static` — 23 testiä.
- `npm run test:browser` — 4 testiä.
- `npm run build` — strict nutrition, koko GK-auditointi, TypeScript, tuotantobuild ja 690 prerenderöityä reittiä.
- `npm run audit:nutrition -- --strict` — 180 tuettua, 86 tarkistettavaa, 59 puuttuvaa, 0 ristiriitaa.
- `npm run audit:glycemic-load` — 325 reseptiä, 117 laskettua, 208 keskeneräistä.
- `npm run audit:glycemic-coverage` — jokainen 325 reseptistä kerran; 0 uutta sitomismismatchia.
- `scripts/lint-markdown.ps1` — 805 tiedostoa, 0 ongelmaa.
- `git diff --check` — läpäisi.

Buildin Vite-tulosteessa on olemassa oleva huomio yhdestä yli 500 kB JavaScript-chunkista. Build valmistui silti onnistuneesti. GitHub Actionsin tulos kirjataan PR:n CI-ajon jälkeen.

## Jäljelle jäävät esteet ja seuraava erä

Erä 2A ei laajentanut työtä muihin 41 rakennesidontaan eikä kattaviin GI-lähdehakuihin. Seuraava rajattu erä 2B kannattaa valita nykyinventaarion GI- ja koostumusesteistä tapauskohtaisesti. Ensisijaisia ehdokkaita ovat maissinjyvien valmistustilan täsmällinen lähdemappaus sekä yleisten maissin, seesamin ja kypsennetyn tomaatin GI-vastaavuuksien tarkistus. Kookosmaidon tilavuusmassan pitää perustua lähteeseen ennen GK-laskentaa. Uusia GI-arvoja tai oletettuja muunnoksia ei tule lisätä ilman lähdenäyttöä.

Tämä raportti on katselmointia varten. Muutoksia ei ole yhdistetty eikä tuotantoon julkaistu.
