# Reseptit – avoimien PR:ien tiedostopäällekkäisyydet ja F25 A2 -työraja (11.11.2026)

## Menetelmä

GitHubin `is:open`-haussa oli **25 avointa PR:ää** tämän tarkistuksen alussa. Kaikkien 25 PR:n muuttuneet tiedostot haettiin `list_pr_changed_filenames`-toiminnolla. Tiedostopäällekkäisyys merkitsee samaa tiedostopolkua eri PR:issä; se **ei yksin todista merge-konfliktia**, joka riippuu muuttuneista riveistä ja haarojen ajantasaisuudesta. Tuoreiden main-muutosten osalta vertailu tehdään aina uudelleen juuri ennen mergeä.

## Tiedostotason ristikkäisyydet – omistajuus

| PR | Yhteinen tiedosto / sisältö | Toiminta |
|---|---|---|
| #313, #355, #473 | `reseptit/aamupalat/rasvakaakao-rouva-keto.md`, WebP, sekä GK-baseline- ja julkaisutestit | **Vahva sisältöpäällekkäisyys.** #473 on rajattu rasvakaakaon uudempi julkaisuhaara; älä yhdistä #313/#355 kokonaisina sen päälle. Samat testimuutokset eivät saa kadota |
| #313 ja #355 | lämmin chia-puuro, kuva, ravintoluonnos, julkaisutestit | Sama työ kahdessa vanhassa PR:ssä. Vain uusi eristetty julkaisu-PR selkeällä lähdeversiolla |
| #399 ja #380 | `kaannokset/{en,sv,th}/aamupalat/pohjoisafrikkalainen-maakouda.md` ja Pages workflow | Karanteenissa/HOLDissa olevan lähteen kieliluonnosta ei julkaista; ei kokonaisten Draftien mergeä |
| #358, #366, #380, #396, #399, #400, #388, #223 | `.github/workflows/pages.yml` | **Suuri shared-file-riski.** Integroi erillisinä, mainiin uudelleen perustettuina portteina; älä koskaan korvaa muiden CI-gateja vanhan haaran versiolla |
| #389, #390, #391, #392 | `site/package.json`, `site/package-lock.json` | Riippuvuuspäivitykset yksitellen uudelta mainilta, lockfile generoidaan ja CI ajetaan joka kerta |
| #100, #291, #292, #380 sekä #389–#392 | `site/package.json` | Muiden ominaisuuksien testikäskyt säilytettävä; ei pohjaa vanhasta package.json-versiosta |
| #305, #313, #355, #473 | sama Rouva Keto -idea lähde-/tutkimus-/julkaisuvaiheissa | Tutkimus #305 ei ole julkaisu, älä siirrä julkaistuun FI:hin vanhaa ehdokasta uudemman tilalle |
| #448 ja jo mainiin yhdistetty #467 | Karnivore-lähdekartta ja ensimmäisen kolmen tarkistus | Tarkista että korjaus näkyy mainissa/haaran base-versiossa ennen #448 mergeä; puuttuva lähde pysyy null, ei 0 |

Muut avoimet #360 ja #362 koskevat erillisiä FI-reseptejä; #354 on erillinen ravintoarvokatselmointi; #291/#292 ovat GK-tutkimus-PR:iä. Yhteisiä tiedostoja on silti `site/package.json`-tasolla (#291/#292). PR:t #396 ja #399 ovat **eri kielireseptierät**, mutta jakavat Pages-työnkulun.

## F25 A2: rajattu jatko #471

- Vertailtu nykyiseen main-pohjaan. PR #471:n vain **4** `docs/reviews/f25-a2-draft-recipes/*.md`, niiden oma `meta/kaannokset/f25-a2-four-fi-draft-manifest-20261111.json` sekä omat `docs/reviews/2026-11-11-f25-a2-*.json` -tutkimusraportit.
- Tarkistuksessa **0 yhteistä muuttuvaa tiedostopolkua** muiden 24 avoimen PR:n kanssa. Tämä ei ohita lähteiden semanttisia riippuvuuksia: #399 sisältää näiden neljän EN/SV/TH-kieliluonnokset, ja #444 mainissa määrää 15 lähteen julkaisulukot.
- #458 B1 -erä vastaa viidestä muusta F25-lähteestä; #471 ei muuta #458:n UI-noticea, schema-testiä eikä tuotekarttaa.
- #471:ssä ei `.github/workflows/`, `site/`, `reseptit/`, `kaannokset/` tai GK-historiaa.
- Neljä reseptiä 4/4 **HOLD**, `approval:null`, `nutritionApproved:false`, `gkApproved:false`, `translationApproved:false`.
- Tuotetarkistuksen numeeriset skenaariot tallennetaan vain tutkimusaineistoon, jossa polyoleja, kalakastikkeen pakkauksia ja öljyn pidättyvyyttä ei arvata hyväksytyiksi.

## Päätöskriteeri jatkossa

1. Ennen kirjoitusta: `main...PR` tiedostolista, muiden avointen PR:ien sama polku, SHA-omistajuus.
2. Ei muutoksia rinnakkaisen PR:n tiedostoon; tarvittaessa uuteen main-pohjaiseen haaraan vain minimaalinen muutos.
3. Tarkista jokaisen reseptin valmistus, raaka-aine ja käännös riippumatta näennäisestä tiedostojen erillisyydestä.
4. Uusi commit = uusi exact-HEAD CI; vihreä vanhalla SHA:lla ei kelpaa.
5. PR-merge ei ole Pages deploy; varmista molemmat erikseen. Älä julkaise HOLD-reseptejä, vaikka CI vihertyisi.

**Tässä raportissa ei anneta merge- tai ravinto/GK-julkaisulupaa yhdellekään HOLD-PR:lle.**
