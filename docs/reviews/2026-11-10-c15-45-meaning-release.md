# C15: 15 FI-aamiaisreseptiä / 45 EN/SV/TH-käännöstä – AI-merkityskatselmointi

Päivä: 10.11.2026. Lähde-main: `b86a2b01ea477e9399bb1e035cbc303ebea19572`. Alkuperäinen C20-työ: [Draft #380](https://github.com/ozirix-dev/Reseptit/pull/380), tarkka C20-CI [#42749726980](https://github.com/ozirix-dev/Reseptit/actions/runs/42749726980) SUCCESS (myös sisältö-, kieli-, GI/GK-, build- ja selaintarkistukset). Tämän release-PR:n oma CI ja sen HEAD-SHA on tarkistettava erikseen ennen mergeä.

## Julkaisurajaus ja katselmoitu merkitys

Kaikki seuraavien 15 FI-alkuperäisen EN/SV/TH-ohjeet ja ainesluettelot luettu kokonaisina ja verrattu FI-valmistuksen työjärjestykseen, määriin, paistoihin, vesi-/öljyrajoihin, annoksiin ja nimikkeisiin. Tämä on **ChatGPT:n AI-merkitysvertailu**, ei riippumattoman ihmiskääntäjän, natiivipuhujan tai fyysisen koepaiston raportti.

| FI-resepti | AI-merkityskatselmoinnin kriittiset havainnot |
| --- | --- |
| `korealainen-gyeran-mari-kasviksilla` | Ohut kerroksittainen munarullan rullaus, porkkanan kosteuden puristus ja matala paistolämpö kaikissa kolmessa kielessä. |
| `paprikauunimunakkaat` | 320 g syötävää paprikaa, 220 g kuoretonta munaa ja 200 °C paisto kypsyysmerkkiin; ei lisää öljyä. |
| `uunimunat-pinaatilla` | 220 g kuoretonta munaa jaetaan kahteen vuokaan, 4,5 g voi voiteluun, 200 °C ja 10–14 min; ei lisärasvaa. |
| `munakokkeli` | 220 g kuoretonta munaa, 30 g nestemäistä 38 % kermaa, 14 g voita, matala paistolämpö ja pehmeän munakokkelin vaiheistus. |
| `meksikolainen-munakokkeli-pico-de-gallolla` | Maissitortillat lasketaan annokseen; tomaatti-korianterilisuke tehdään ilman listaamatonta sipulia tai muita aineksia. |
| `valimerellinen-tahinipuuro` | 100 g 0,5–0,6 mm kaurahiutaleita, 700 g vettä ja 10 min keitto; tahini, hunaja ja 130 g tuore appelsiini kokonaisuudessaan. |
| `thai-papaijajogurtti` | 200 g tuore papaija, 200 g makeuttamaton jogurtti, 15 g **tuoretta kookoslihaa**, 15 g limettiä; ei kuivattua kookosta. |
| `pohjoisafrikkalainen-harcha-juustolla` | Mannasuurimoiden turvotus 10 min, kaksi paksua kiekkoa, rauhallinen pannupaisto; tuorejuusto tarjoillaan lisukkeena, ei taikinan täytteenä. |
| `kiinalainen-tomaattimunakas-riisilla` | 100 g kuivaa riisiä, poistuva keitinvesi, paistoöljy jaetaan munien ja tomaatin kypsennykseen. |
| `vietnamilainen-banh-mi-munalla` | 100 g valmista patonkia; 60 g porkkana käytetään tuoreena eikä pikkelöidä; ei ylimääräistä etikkaa. |
| `meksikolainen-atole-maissipuuro` | 100 g hienoa ei-nixtamalisoitua maissijauhoa, 700 g vettä ja 200 g täysmaitoa; mausteita ei siivilöidä. |
| `thai-khao-tom-katkaravuilla` | 100 g kuivaa riisiä kypsennetään 700 g käyttövalmiissa kanaliemessä, katkaravut kauttaaltaan kypsiksi ja liemi kuuluu annokseen. |
| `karibia-maissipuuro-kookoksella` | 100 g maissijauhoa, 700 g vettä, 184 g kookosmaitoa; koko seos mausteineen kahteen annokseen. |
| `karibia-jamaikalainen-munakokkeli` | Scotch bonnet -chilin käsittelyturvallisuus, pehmeä täysin kypsä munakokkeli, vain listattu öljy. |
| `lahi-ita-kikherne-shakshuka` | 100 g **kypsiä ja valutettuja** kikherneitä, 110 g kuoretonta munaa, kypsennys kannen alla; ei kuivia papuja/jauhoa. |

## 5 erilleen jätettyä HOLDia (15 kieliversiota, ei julkaistu)

1. `malesialainen-nasi-lemak-aamiaisella`: FI:n `cooking_method: paistaminen` ristiriidassa riisin ja munan valmistuksen kanssa.
2. `indonesialainen-nasi-uduk-aamiaisella`: sama menetelmäristiriita sekä 100 g riisin kypsennys vain 200 g kookosmaidolla vaatii kokkikatselmoinnin.
3. `pohjoisafrikkalainen-maakouda`: 1 kpl peruna ilman massaa ja annoksen CHO/GK-laskentaraja tarkistettava.
4. `kiinalainen-kevatsipulipannukakku`: 15 min lepo + kaulinta, kerrostus ja paisto voivat ylittää lähteen 25 minuutin `time_total_min`-arvon; tarkka aika hyväksyttävä ennen julkaisua.
5. `indonesialainen-pisang-goreng-aamiaiseksi`: SV-otsikon `friterade bananer` antaa uppopaistamisen vaikutelman, vaikka lähde käyttää 1 rkl öljyä tarttumattomalla pannulla. Oikaisu ja uusi kieli-SHA ennen julkaisua.

## Lähdelukot, semanttinen evidenssi ja stop-rajat

- Päähaaran FI Markdown -alkuperäiset, annokset, ainesmäärät, ravintoarvot, GK80/GK100/GI/GK-lähdesinetit ja sisältöbuildin laskentaputki pysyvät muuttumattomina.
- 45 käännöksen `status: draft` muutetaan `published`-tilaan ilman muiden kielitiedoston rivien muutoksia. `semanticHash` sulkee julkaisutilan pois, joten C20:n täsmä-HEADin CI-lokissa tuotetut 45 `source_hash`/`translation_hash`-paria pätevät vain samalle tekstille. Kaikki 45 tallennetaan `meta/kaannokset/codex-review-evidence.json`-rekisteriin `outcome: pass`, mikä tarkoittaa **AI-katselmointia** eikä ihmiskatselmointia.
- `published-translation-pairs.json`: 40 FI / 120 kieliparia → **55 FI / 165 kieliparia**. Tämä on julkaisusivurekisterin kattavuus, ei koko sivuston historian kaikkien käännösten määrä.
- C20:n Draft-työjono ja 60 alkuperäistä luonnosta säilytetään erillisinä; **älä yhdistä #380:n vanhoja Draft-tiedostoja** julkaistujen päälle.
- Aja täsmällisen release-PR-HEADin changed-content / strict translation / semantic SHA / GI-GK / build -tarvittavat CI-portit. Enintään yksi virheen todellisesta juurisyystä johtuva korjaus ja uusi CI, muuten STOP.
- Merge vasta hyväksytyn HEADin jälkeen; tarkista saman main-merge-SHA:n Pages build + deploy SUCCESS. Julkisen sivuston 3–5 reitin smoke on erillinen mittaus: sitä ei väitetä tehdyksi.
