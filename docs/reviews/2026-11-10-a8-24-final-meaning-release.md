# A8: kahdeksan reseptin 24 EN/SV/TH-julkaisukäännöstä – FI-julkisen esityksen merkitysvertailu

**10.11.2026.** ChatGPT:n AI-katselmointi (EN/SV/TH ja thai-takaisinkäännös); ei ihmisen tekemää riippumatonta kielentarkistusta tai koepaistoa. **FI-raakaversio:** main `a90df8fa7698a74c29b8afe67dc842af300d9ef2` ja edelleen byte-for-byte samat tiedostot mainissa; **FI-julkisen näyttöversion muutokset:** [PR #361](https://github.com/ozirix-dev/Reseptit/pull/361), joka on testattu CI-ajossa #42740299669 ja yhdistetty mainiin `185a6af902d3bb79a610f32618084f1082f6fa1b`. Käännösten alkuperäinen WIP-esikatselmointi `docs/reviews/2026-11-10-a8-24-translation-draft-preflight.md` (erillisessä staging-haarassa).

## Kohde ja ruoanvalmistuksen merkityksen tarkistus

| FI-resepti | EN/SV/TH-käännösten olennaiset kokkimerkitykset ja laskentarajat |
| --- | --- |
| `falafel` | **12 tunnin** kuivien kikherneiden liotus jääkaapissa; n. 20 pientä falafelia, 220 °C paisto 20–25 min ja kastikkeen kaikki reseptiin punnitut ainekset. Salaatti ja pita ovat **valinnaisia erillisiä lisukkeita**, eivät neljän annoksen makrolaskentaa. Kaikissa kielissä lisukkeet kuvataan laskennan ulkopuolisiksi. |
| `jerk-kana` | Vähintään **60 minuutin jääkaappimarinointi** ja **45–55 minuutin uunipaisto 200 °C:ssa**; kokonaisaika näyttöversiossa **130 min** (ei 90 min). Kanan paksuimman osan sisälämpö vähintään **75 °C**; raakaa kanaa koskettanutta marinadia **ei** käytetä kypsän ruoan viimeistelyyn. Riisi ja pavut valmistetaan kanan paiston aikana, annokset ja ainekset pysyvät samoina. |
| `kimchi-jjigae` | Kimchi 400 g, porsaanliha ja tofu kypsyvät samassa liemessä; 25 min + 5–7 min hautumisvaiheet. Riisi on vain **vapaaehtoinen laskentaan kuulumaton lisuke**, ei tämän version punnittu ainesosa. |
| `lanttulaatikko-kermainen` | Kuorittua lanttua 800 g, kerma 150 g, **55 g kuoretonta kananmunan syötävää osaa**, kaikki 50 g voi (myös vuoka ja pinta), 100 g keitinvettä säilytetään soseessa. Ei siirappia tai lisää rasvaa. GK80 Release 6:n historiallinen FI-SHA muuttumaton. |
| `lindstrominpihvit-kaalilla` | 500 g jauhelihaa, punajuurta ja kaalia; kahdeksan pihviä. **2 rkl voita yhteensä:** 1 rkl pihveille, 1 rkl kaalin paistoon. Ei laskentaan lisää voita; 4 min/puoli ja kaali 10–12 min. |
| `maksalaatikko-kukkakaalilla` | Naudanmaksa 400 g ja kukkakaali 500 g; **2 rkl voita yhteensä:** 1,5 rkl maksan/sipulin pannuun ja 0,5 rkl uunivuoan voiteluun. Maksa ja muna kypsennetään kauttaaltaan, paisto 180 °C / 35–40 min. Ei lisärasvaa. |
| `shoyu-kanakeitto-konjac` | Broilerin reisiliha 400 g keitetään 1 200 g:ssa käyttövalmista kanalientä vähintään **75 °C:n** sisälämpöön. Valmistustapa **keittäminen**, ei historiallinen virheellinen `paistaminen`. Konjac-nuudelien 200 g tarkoittaa valutetun tuotteen määrää; kaikki 32 g soijakastike, 15 g riisiviinietikka, 13,5 g seesamiöljy ja liemi jaetaan neljään annokseen. GK80 Release 3:n raaka-SHA ennallaan. |
| `vhh-brita-kakku` | 100 g mantelijauho ja 1 tl leivinjauhe **käännellään** voi–erytritoli–keltuaisseokseen ennen pohjan levittämistä. Pohjan 70 g ja marengin 60 g erytritolia ovat eri luettelomäärät; marenki paistetaan pohjan päällä, kerma ja mansikat vasta jäähdytyksen jälkeen. |

## Mekaaniset ja versiontarkistukset

- Kahdeksan kanonisen FI-reseptin `semanticHash` vastaa muuttumattomia, aiemmin tallennettuja lähdetiivisteitä **8/8 PASS**. 24 käännöksen semanttiset SHA:t tuotettiin uudelleen WIP-haaran tarkasta tekstistä. Julkaisu muuttaa kielitiedostojen ainoastaan `status: draft` → `status: published`; `semanticHash` sulkee statuksen pois.
- 24/24: samat ainesosarivien määrät, numerolliset massat, annokset ja kaikki neljä ilmoitettua ravintoarvokenttää kuin alkuperäisessä FI-laskentaversiossa. Jerk-kanan `time_total_min = 130` sekä shoyu-keiton `cooking_method = keittäminen` poikkeavat historiallisesta FI-metatiedosta **vain** #361:n tarkkaan alkuperäis-SHA:han sidottujen näyttökorjausten perusteella.
- `site/scripts/translation-audit.ts` käyttää näihin kahteen yksilöityyn FI-lähdepolkuun `projectA8FiEditorialSource`-tarkistusta; varmistaa samat annokset, ainesosamäärät ja makrot ennen aika-/menetelmäpoikkeuksen soveltamista. **Kaikille muille resepteille alkuperäinen tiukka vertailu säilyy.**
- Kaikki 24 EN/SV/TH-tiedostoa julkaistaan samassa auditoinnissa ja kaikille kirjataan `source_hash`, `translation_hash`, `reviewed_at`, `reference`, `outcome: pass`. SHA todistaa sisällön version, ei yksin thainkielisen ilmaisun oikeellisuutta.
- Julkaisu ei kirjoita FI Markdown -alkuperäisiä, GK80/GK100-paketteja, makroja eikä valmistusmäärien uusia ravintolähteitä. Ei automaattista ihmistarkastusväitettä.

## Julkaisuportti ja auditointi

- [ ] Exact HEAD PR-CI: changed-content sekä strict `test:translations` ja semanttinen SHA-audit PASS
- [ ] CI: valitut unit-/GI/GK-regressiot ja sivuston build PASS, erityisesti shoyun 75 °C sekä jerk-kanan 130 min
- [ ] PR yhdistetään vasta CI:n SUCCESS-tilan ja SHA:n vastatarkistuksen jälkeen
- [ ] Main-merge-SHA:n GitHub Pages build ja deploy SUCCESS
- [ ] Ei lähtöpaketin/GK-sinettien uusimista pelkän käännöksen julkaisun vuoksi

**Historiallinen vertailu:** [ReportHubin 9.11. lähtötaso](https://github.com/ozirix-dev/ReportHub/blob/main/reports/active/2026-11-09-reseptit-kaannosjulkaisun-vertailutaso.md). B-erä 60/60 ja Pages-toipuminen eivät automaattisesti korvaa näiden 24 käännöksen omaa testausnäyttöä.
