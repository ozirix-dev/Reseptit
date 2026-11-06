# Alkuperäisreseptien ratkaisuerä 02

Tutkimus ja ehdokaskohtainen tarkistus nyky-mainista `be26182a1b0547a6d98e889349855ee05bda07c7`. PR #290:n lopullinen luokittelu on mukana. PR #291:n haaraa, historiallista baselinea tai viittä aiempaa HOLDia ei muuteta.

## Todellinen tulos

| Mittari | Määrä |
| --- | ---: |
| Priorisoidut puuttuvat alkuperäiset | 170 |
| Seulotut alkuperäiset | 53 |
| Seulotut yhden esteen tapaukset | 32 / 57 |
| Syvemmin tarkistetut tapaukset | 11 |
| Ehdollinen numeerinen alkuperäisehdokas | 1 |
| Factoryn tekninen PASS | 1 |
| Tieteellinen hyväksyntä / omistajahyväksyntä / julkaisu | 0 / 0 / 0 |
| Seulonnan HOLD / lähdetyö / täsmennys / ehdokas | 18 / 11 / 23 / 1 |
| Julkaistu alkuperäiskattavuus | 156 / 326 (47,85 %) |
| Hyväksyntöjen jälkeen mahdollinen alkuperäislisäys | enintään 1, ei vielä lisätty |
| 80 %:n tavoite / puuttuva määrä | 261 / 105 |
| Nykyiset hyväksytyt lisäversiot | 87, muuttumattomat |

Yksi omistajan sisältöpäätöstä odottava paketti on valmisteltu, mutta sitä ennen tarvitaan lähdesoveltuvuuden arvio. Tekninen PASS ei tarkoita tieteellisesti hyväksyttävää lukua. GK-only-julkaisusovittimen alkuperäisvaikutus olisi nolla: alkuperäisintegraatio on valmisteltava erikseen vasta soveltuvuus- ja omistajapäätösten jälkeen. Tässä PR:ssä ei muuteta reseptejä, hyväksyttyjä GK-arvoja, lähderajauksia, tuotantorekistereitä, makroja tai hyväksyntäkuitteja.

## Ehdokkaat ja ratkaistut osakysymykset

- **VHH-mansikkakakku:** alkuperäiset kahdeksan ainesosaa ja 10 annosta säilyvät. Health Canada CNF216 antaa vaniljauutteen 5 ml:n viitemassaksi 4,3 g. Fineli #74 korjaa alkuperäisen leivinjauheteelusikan laskentamassan 4 → 5 g. Ehdollinen nykyisen menetelmän piste on **1,0745**, näyttö 1,07; positiiviset poisjätöt **0,86718 g CHO/annos**. Kerman/rahkan GI 35 ja mansikan GI 51 ovat nykyisiä ryhmäkeskiarvoja, eivät ainesosien tai kakun mittauksia. Niiden soveltuvuus ja geneerisen uutteen vastaavuus pysyvät `REVIEW_PENDING`-tilassa. [Laskentamuistio](../gk-original-batch02-mansikka-evidence.md) ja [paketti](../gk-original-batch02-mansikka-release-candidate.json).
- **Bulgogi:** alkuperäiset kaksi kevätsipulia voidaan mallintaa 2 × 15 g:n ruokakohtaisena viitepainona. Tämä ei ole todellinen punnitus eikä erillisversion 40 g. Soijakastikkeen 60 ml:n viitemassa on Fineli #31:n avulla 72 g. Aiemmat riisin, soijan ja ruskean sokerin GI-pidätykset sovelletaan myös uuteen laskelmaan: **ei kokonais-GK-ehdokasta**. Kevätsipulin vihreiden osien koostumusvastaavuuskin vaatii arvioinnin.
- **Keto-mutakakku ja keto-suklaakeksit:** Fineli #30/#79/#35555 sekä AFCD:n tavalliset suolat tukevat nollaa saatavaa hiilihydraattia. Tuntematon ripauksen massa pysyy tuntemattomana; natriumia ei lasketa eikä mausteseosta nollata. Mutakakun 2 rkl kaakaota täsmentyy Fineli #20:n avulla 12 g:ksi ja sen positiivinen poisjättö 0,165 g:ksi. Vanilja ja keksien leivinjauhe saavat lähteistetyt viitemassat. Mallin nolla-GK koostuu silti kokonaan positiivisista poisjätöistä (1,58835 / 1,41818 g): **ei uusia luotettavia kokonaislukuja**.
- **Farinata:** 100 g tomaattia / 2 annosta = 1,725 g CHO/annos, yli yksittäisen poisjättörajan. Raaka tomaatti tai kastikeanalogia ei osoita 220 °C:ssa paistetun tomaatin vastaavuutta.
- **Pinaatti-paneer-chilla:** `1 kpl pinaattia` ei määritä lehteä, nippua tai pussia; omistajan määräselvennys tarvitaan.
- **Tangyuan:** yhden kirjattua estettä sisältävän syöterivin taakse jää kahdeksan alkuperäistä ainesosaa, myös 250 g riisijauhoa ja 110 g sokeria. Yhden seesamirivin ratkaisu ei riitä.
- **Mala xiangguo:** lootusjuuren `1 kpl` ei määrää massaa; koostumussidoksen lisäksi tarvitaan määrä ja GI-soveltuvuus.
- **Pellavapuuro:** kuivattu kookosraaste ei ole kookosjauho; AFCD F002987:ää ei siirretä jauhoksi.
- **Runebergintortut:** mantelijauhon 1,08 g CHO/annos ylittää yksittäisrajan. Annoskokoa tai annosmäärää ei muuteta.
- **Hernekeitto savupotkalla:** laakerinlehden lisäksi sinappi, savupotkan rinnastus raakaan vähärasvaiseen sianfileeseen ja perityt mauste-oletukset estävät kokonaisuuden hyväksymisen.

## Lähteet ja ajankäyttö

Ensisijaiset uudet viitepainolähteet ovat [Health Canada CNF216](https://aliments-nutrition.canada.ca/cnf-fce/serving-portion?id=216&lang=eng&wbdisable=true) ja [Health Canada 2008:n vihannestaulukko](https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/nutrient-data/table-4-vegetables-vegetable-products-nutrient-value-some-common-foods-2008.html). Numeeriset faktat, URL:t ja ladattujen lähdesivujen tarkisteet ovat [sources.json](sources.json)-tiedostossa. Raakoja lähdesivuja tai kokonaisia taulukoita ei kopioida repoon. Nykyisten virallisten Fineli Rel20- ja AFCD Rel3 -tietueiden tarkat rivit sidotaan tapauskohtaisesti.

Mansikoiden GI 40:n tutkimusjohtolanka palautuu vuoden 2002 taulukon julkaisemattomaan UO-havaintoon. Sitä ei hyväksytä uutena GI-lähteenä. SQLite V2:n hakuosuma ei ole hyväksyntä eikä indeksin puuttuva osuma todista maailmanlaajuisesti tuloksetonta lähdehakua.

Tutkimussnapshotin seinäkelloaika on **3 422 sekuntia, noin 57 minuuttia**, eristetyn työpuun luonnista viimeiseen seulontaan. Se sisältää paikalliset lähde- ja laskentatarkistukset; myöhempi testaus ja CI-odotus eivät sisälly. [deep-review.json](deep-review.json) tallentaa ajan määritelmän. Jatkohyöty on yksi toistettava katselmointipaketti, lähteistetyt määrä- ja suolatäsmennykset sekä 53 reseptin yksilöidyt todelliset esteet. Julkaistujen alkuperäisten puute ei vielä vähene.

## Käytännöllinen jatkotyö ja eheyssuoja

- [priority-snapshot.json](priority-snapshot.json) on kaikkien 170 tapauksen nykytilasnapshot: esteet, määrä/koostumus/GI/identiteettiratkaisut, tunnettu CHO-vaikutus, tuntemattomat osuudet, aiemmat negatiiviset haut ja painotettu prioriteetti. Rivimäärän yhtäläisyys ei todista semanttista vastaavuutta.
- [screening.json](screening.json) kattaa myös prioriteetin 30 ensimmäistä tapausta; [sqlite-screen.json](sqlite-screen.json) säilyttää paikallisindeksin, kyselyjen ja lähteiden tarkisteet sekä osumien tunnisteet. Kaikki osumat ovat hyväksymättömiä tutkimusjohtolankoja.
- [cases.json](cases.json) pinnaa neljä laskentakapselia. Jokainen tarkistaa oman alkuperäisreseptinsä, syötteen, käytettyjen lähderivien, menetelmätiedostojen ja aiempien GI-päätösten tarkisteet. Mansikkapaketti sitoo lisäksi käännöstekstit. Toisen reseptin muutos ei itsessään vanhenna tätä aineistoa.
- `npm --prefix site run audit:gk-original-solutions` muodostaa nykyisen inventaarion ja toistaa kapselit kirjoittaen vain ignoroituun tmp-hakemistoon. Ensin tarvitaan nyky-mainin `audit:glycemic-load`; jokaisen 326 alkuperäisen tuoreet resepti/input/evidence-sidokset tarkistetaan.
- [publication-baseline.json](publication-baseline.json) suojaa koko lähtötilan, kaikki 156 hyväksyttyä alkuperäistulosta, 87 lisäversiota ja resepti-/makrotiedostot. #291:n historiallinen baseline tarkistetaan alkuperäisestä Git-objektista. Historiallista snapshotia ei käytetä kaikkien tulevien ehdokkaiden yhteisenä julkaisulukituksena: myöhempi tarkoituksellinen julkaisu päivittää kokoelman regressio-odotuksen erikseen, mutta muiden kapselien rajatut sidokset säilyvät.
- `site/tests/gk-original-solutions.test.ts` tarkistaa nykyinventaarion, julkaisutulokset ja historialliset sidokset sekä pysäyttää oman reseptin/lähteen/menetelmän muutoksen, vanhan kaakaopoisjätön, nollatun tuntemattoman massan ja puuttuvan suolanäytön. Se varmistaa myös, ettei muu reseptijulkaisu vanhenna mansikkakapselia.

Seuraava rajattu sisältökatselmointi on mansikkakakun lähdesoveltuvuus. Sen jälkeen bulgogin kolme GI-sidosta tarvitsevat varsinaisen tieteellisen ratkaisun. Selvennyksistä pinaatin määrä sekä tarkasti nimetyt labneh-, salsa-, gochujang- ja kimchituotteet voivat avata muita tapauksia. Aiemman erän viiteen HOLDiin palataan vain uuden lähdejohtolangan perusteella. Mitään ei mergeta tai deployata tässä erässä.
