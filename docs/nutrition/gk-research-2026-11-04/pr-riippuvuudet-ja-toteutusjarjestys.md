# GK-tutkimuksen toteutusjärjestys ja PR-törmäystarkistus

**Tarkistus:** 4.11.2026 noin klo 20.16 Suomen aikaa. Main `67261d139b1e3dcc55772f25ffcdd8e6a22c116d`. Tämä on tilannekuva, ei repon jatkuvasti päivittyvä totuus. Tässä dokumentissa kuvatut haaroille tehtävät päätökset on tarkistettava uudelleen ennen toteutusta ja mergeä.

## 1. Nykytilan auditointi

- Avoimia PR:iä haulla: **83**. Mukana paljon eri aikaan tehtyjä GK80/GK100-lähde- ja sisältöpaketteja; kaikkia ei tule yhdistää automaattisesti.
- Main sisältää juuri yhdistetyn [PR #259:n](https://github.com/ozirix-dev/Reseptit/pull/259), **GI SQLite cache V1**: paikallinen tarkistevarmennettu haku, kanoninen data edelleen Gitin JSONissa. Tämä on jo toteutus, ei enää pelkkä suunnitelma.
- [PR #257](https://github.com/ozirix-dev/Reseptit/pull/257) yhdistetty: viisi GK-versiota tuotantoon. Tähän perustuva uusin raportointi **235/326 (72,09 %)**; 80 % tarkoittaa vähintään 261/326, joten **26 uutta** reseptiä tarvitaan numerotavoitteeseen. Tämä on dokumentoitu kattavuus, ei tässä työssä suoritettu uusi täydellinen tuotantoajo.
- Päähaaran CI oli tarkistushetkellä käynnissä PR #259:n merge-SHA:lle. Älä päättele keskeneräisestä ajosta PASS-tilaa.
- Muutoksia resepteihin, suodattimiin, GI-katalogiin, Approval Factoryyn, sivubuildiin tai pilveen **ei tehdä tutkimus-PR:ssä**.

## 2. Tärkeimmät aktiiviset PR:t ja täsmälliset tiedostorajaukset

| PR | Tila tarkistuksessa | Muutosalue | Vaikutus tämän tutkimuksen toteuttamiseen |
| --- | --- | --- | --- |
| [#241](https://github.com/ozirix-dev/Reseptit/pull/241) | Draft | docs/nutrition/gk100-new-recipe-pipeline-plan.md | Uusien reseptien arviointiputki. Sovita uuden sopimuksen vaiheet tähän, ei muokata toisen haaran suunnitelmaa. |
| [#242](https://github.com/ozirix-dev/Reseptit/pull/242) | Draft | docs/nutrition/gi-knowledge-base-v1-plan.md | GI-havainto/soveltuvuus. Huomioi jo yhdistetty #259:n SQLite; ei päällekkäistä tietokantaratkaisua. |
| [#253](https://github.com/ozirix-dev/Reseptit/pull/253) | Open | gk100-mixed-evidence-v1.md, Approval Factory/CLI/mixed-evidence -TS ja testi | Aktiivinen menetelmätoteutus; älä tee samojen tiedostojen muutoksia V2:ssa vielä. |
| [#254](https://github.com/ozirix-dev/Reseptit/pull/254) | Open | gk100-mixed-evidence-method-approval.json | Pelkkä review-only -hyväksyntätietue; riippuu #253:sta. |
| [#255](https://github.com/ozirix-dev/Reseptit/pull/255) | Draft | evidence-recovery-v2 dokumentit/erä/py-scripti ja bánh xèo -ehdokas | Nykyinen 96 reseptin gap/review-jono. V2 priorisointi sovitetaan siihen, ettei tehdä rinnakkaista kilpailevaa työjonoa. |
| [#247](https://github.com/ozirix-dev/Reseptit/pull/247) | Open | gk100-lontong-sayur-calculation.md | Lontongin lähteiden historiallinen tapaus, ei muutoksia sen tiedostoon. |
| [#229](https://github.com/ozirix-dev/Reseptit/pull/229) | Open | GK-skenaariovälin koodit ja UI sekä yksi docs | Esitystavan V2-muutos sovitetaan tähän; ei samoihin komponentteihin nyt. |
| [#262](https://github.com/ozirix-dev/Reseptit/pull/262) | Draft | FI/EN/SV/TH reseptimuutoksia, GK149-sidos ja testit | Älä muokkaa reseptejä tai kuittien tiedostoja tutkimus-PR:ssä. |
| [#263](https://github.com/ozirix-dev/Reseptit/pull/263) | Open | käännöstarkistuksen skriptit, AGENTS.md ja ohjeet | Reseptitekstin täsmennys vasta kun käännös-/semantiikkaportit huomioitu. |
| [#243](https://github.com/ozirix-dev/Reseptit/pull/243) | Draft | recipavo-cloudflare-release-plan.md | Erillinen pilvisiirtosuunnitelma; ei tuoda tätä GK-laskimen suunnittelua siihen. |
| [#258](https://github.com/ozirix-dev/Reseptit/pull/258), [#261](https://github.com/ozirix-dev/Reseptit/pull/261) | Open | tutkimusannosten lähde- ja ehdokas-JSONit | Tutkimusruoan GI/GK ei automaattisesti ole kotireseptin GK. |
| [#244](https://github.com/ozirix-dev/Reseptit/pull/244), [#245](https://github.com/ozirix-dev/Reseptit/pull/245), [#248](https://github.com/ozirix-dev/Reseptit/pull/248) | Open | historialliset lähde-, sisältö- ja julkaisuvalmistelupaketit | **#257 on jo tuonut osan niissä hyväksytystä sisällöstä tuotantoon.** Varo vanhojen pakettien uudelleenjulkaisua. |

Tarkistuksessa haettiin avoimet PR:t ja pyydettiin näiden olennaisimpien PR:ien muuttuneet tiedostopolut. Tämän PR:n oma hakemisto **docs/nutrition/gk-research-2026-11-04/** on uusi, eikä se koske yhdenkään yllä nimetyn PR:n muokattuja tiedostoja. Muissa 83:n joukkoon kuuluvissa PR:issä on mahdollista semanttista kytkentää, mutta täysin uusien polkujen valinnalla vältetään välitön tiedostotörmäys. Älä väitä kaikkia 83 PR:ää kooditasolla riippumattomiksi.

## 3. Suositeltu vaiheistus (ei kalenteriaikoja tai automaattista toteutuslupaa)

### G0 — tämä laaja tutkimus-/suunnitelma-PR, **nyt**

- Yksi oma haara ja yksi docs-only commit.
- Täysi 16-sivuisen raportin Markdown, laskenta- ja tuotesopimus, reseptikohtaiset kortit, Recipavo-suunnitelma, PR-kartta ja kohdennetut hyväksyntätestit.
- Draft → sisältökatselmointi → voidaan yhdistää dokumentaationa **ennen muita koodiriippuvuuksia**, kun PR-head ja CI/mergekelpoisuus on tarkistettu. Ei tarvita #241/#242/#253:n yhdistämistä vain tämän dokumentaation lukemiseksi.
- Ei uutta GK-lukua eikä uusia ravintoarvokenttiä. Merkintä “REVIEW ONLY / NOT FOR PRODUCTION”.

### G1 — nykyisen menetelmähaaran vakautus

- Katselmoi #253:n menetelmä, päällekkäisen komponenttilaskennan estot, nollapoisjättö ja nykyisten 0,50 GK / 10 % -seulojen toiminta.
- Yhdistä #253 vasta läpäistyjen porttien jälkeen; sitten #254:n SHA-sidottu review-only-päätös. Review-only ei ole tuotantokytkentä.
- #255:n Smart Review V2 ja #229:n skenaarioväli arvioidaan erillisinä avoimina toteutuksina; kumpaakaan ei muuteta tämän PR:n haarassa.
- Vanhoista #244/#245/#248-jonoista jo #257:ssä julkaistut reseptit merkitään seurannassa “already released” ennen uusia julkaisuajoja.

### M1 — normalisoinnin korjaus (erillinen koodi-PR)

**Suositus aloittaa heti G0:n katselmoinnin jälkeen erillisessä haarassa** kohdennetulla olemassa olevan nutrition-model.ts:n semanttisella auditoinnilla. Se ei kosketa #253:n Approval Factory -tiedostoja. Yhdistä vasta, kun nykyisen mainin GK-regressio ja menetelmätarkisteet ovat yhteensopivia #253/#254:n kanssa.

- Kirjoita yksiselitteinen CHO-lähdeperusta, kuidun ja polyolien erittely ja GI-testin mittayksikkö.
- Tee nykyisten US/EU/Fineli/AFCD-tapausten rajattu lukittujen lähdearvojen regressiosarja; ensisijainen tavoite on poistua monitulkintaisesta `available`-kentästä **rikkouttamatta julkaistuja arvoja**.
- Jos jokin julkaistu GK todella muuttuisi, jätä muutos erilliseen sisältö-/menetelmäpäätökseen, älä piilota sitä normalisointirefaktorointiin.

### M2 — kuratoitu GI-soveltuvuustietokanta ja haku

- Käytä #242:n Source / Observation / Applicability -mallia, joka tarvitsee sovituksen jo yhdistettyyn #259 SQLite-adapteriin.
- Kuratointi ja alkuperäistutkimusten deduplikointi eivät ole SQL-hakuongelma. SQLite rakennetaan JSONista deterministisesti; sitä ei commitata.
- Hyväksytyt valmistuskohtaiset sidokset palautetaan haussa ehdokkaina; automaattinen uudelleenkäyttö on rajattua nimenomaan samaan soveltuvuuteen.

### M3 — uusien reseptien arviointiputki

- Käytä #241:n suunnitelmaa: uusi resepti tulee laskentaan jo draft-vaiheessa; tunnettu point/range syntyy laskentamoottorista, puuttuva näyttö työjonosta.
- #255:n olemassa oleva 96 aukon työjono on ensisijainen nykyisten reseptien priorisointinäkymä, ei erillinen toinen inventaario.
- Tuo Approval Factoryn SHA-portti julkisiin sisältöehdotuksiin, älä yksityisen käyttäjän automaattiseen laskentaan omistajan puolesta.

### M4 — reseptitekstien korjaukset ja Recipavo-UI

- Reseptin ainesosa-/valmistustekstien täsmennykset omaan sisältö-PR:ään **#262/#263:n käännösportin jälkeen**. Ensimmäinen havaittu ristiriita: uunimuna-avokadot; seuraavaksi merkittävä avoin lähdesidos: lontong sayur.
- Recipavo voi kysyä käyttäjältä yhden suurimman vaikutuksen tarkennuksen ja laskea oman reseptin uudelleen. Älä muuta julkisten reseptien hash-/tuotantoportteja.
- Pilotti tarvitsee erillisen tuote- ja tietosuojapäätöksen. Cloudflare-tuotantosiirto PR #243:ssa on itsenäinen riippuvuus.

## 4. Mikä valmistuu millä portilla?

| Kokonaisuus | Voidaan valmistella nyt? | Voidaan yhdistää/julkaista? |
| --- | --- | --- |
| Tämä tutkimusdokumentaatio | Kyllä | Dokumentaation katselmoinnin ja normaalin PR-portin jälkeen |
| US/EU/polyolien CHO-normalisointi | Erillisessä M1-haarassa kyllä | Kohdennetun GK-regression ja menetelmävertailun jälkeen |
| Mixed Evidence review-only | #253/#254 jo valmisteilla | #253 ensin, #254 vasta sen päälle; ei tuotantolupaa |
| Lontongin, Ojjan, muokattujen reseptien GK:t | Lähteiden katselmointi kyllä | Vasta reseptikohtaisella hyväksynnällä ja erillisellä julkaisupäätöksellä |
| Recipavon käyttäjien oma laskuri | Vaatimukset ja prototyyppi kyllä | Vasta M1–M3 sopimusten, tietosuojan ja tuotteen hyväksynnän jälkeen |

## 5. Seuraavan tekijän sääntö

Ennen uutta PR:ää: hae tuore main-SHA, avoimet PR:t ja niiden muutospolut; varmista omistaja/haara; älä muokkaa toisen worktreetä. Yksittäinen lähde-este ei keskeytä 30 reseptin erätavoitetta, mutta estettyä reseptiä ei merkitä valmiiksi. Raportoi jokaisesta erästä käsiteltyjä resepti-ID:tä, lopputilat, avatut muutokset ja seuraavat tehtävät. Käytä jo olemassa olevia CI-valitsimia eikä koko Actions-ajojen sarjaa vain dokumentaation takia.
