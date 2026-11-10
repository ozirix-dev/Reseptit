# C20 – kokin toinen lähdekatselmointi ja julkaisurajaus (10.11.2026)

**Tila: SOURCE-REVIEW / EI JULKAISULUPA.** Tarkastelun lähde on C20 Draft-PR #380:n tarkka FI-työjono (20 julkaistua aamiaisreseptiä, 60 EN/SV/TH-luonnosta). Päähaaran julkaisurekisteriä, FI-reseptejä, GI/GK-lähde-SHA:ta, ravintoarvoja tai kielitiedostojen `status: draft` -tilaa ei muuteta. PR:n tekninen CI SUCCESS ei ole sama asia kuin lähdesisällön kokkikelpoisuuden hyväksyntä.

## Toinen läpikäynti: 20 FI-valmistusohjetta

Kaikkien 20 työjonoon merkityn FI-reseptin valmistusohjeet luettu niiden alkuperäisistä `reseptit/aamupalat/*.md`-tiedostoista PR-haaralla. Alla oleva luokittelu on manuaalisen tekstikatselmoinnin havaintoluettelo, ei koepaisto eikä hyväksytty riippumaton ravintolaskenta.

| Resepti | Toisen läpikäynnin huomio / seuraava portti |
| --- | --- |
| `korealainen-gyeran-mari-kasviksilla` | Munarullan ohje on ruokalajikohtainen, ei geneerinen; kolmelle kielelle varmistettava kerroksittainen rullaus ja paisto alhaisella lämmöllä. |
| `paprikauunimunakkaat` | 200 °C -kypsennys on annettu ilman minuuttiarviota; kypsyysmerkki ja 320 g paprikan syötävän osan punnitus pitää säilyttää. |
| `uunimunat-pinaatilla` | 220 g kuoretonta munaa / 2 annosta ja vuokien voiteluun käytetty 4,5 g luettelon voita; kielissä ei saa syntyä ylimääräistä rasvaa. |
| `munakokkeli` | FI-ohje ruokalajikohtainen; EN/SV/TH-luonnosten ainekset, 10 min, neljä vaihetta ja pehmeän munakokkelin valmistus pistokatselmoitu. Ei vielä SHA-merkittyä varsinaista hyväksyntää. |
| `meksikolainen-munakokkeli-pico-de-gallolla` | Pico on tietoisesti ilman sipulia; ei saa lisätä sitä käännöksissä. Maissitortillat ovat mukana lasketuissa aineksissa. |
| `valimerellinen-tahinipuuro` | 100 g kaurahiutaleet, 700 g vesi, 10 min; tahini, hunaja ja 130 g appelsiini kokonaisuudessaan. Varmennettava 25 min kokonaisaika. |
| `thai-papaijajogurtti` | Kylmä kulho: 15 g **tuoretta** kookoslihaa, ei kuivattua kookosta eikä papaijasosetta. |
| `kiinalainen-kevatsipulipannukakku` | Taikinan lepo 15 min, kaulinta, kerrostus ja kahden pannukakun paisto; `time_total_min: 25` vaatii realistisuusarvion ennen julkaisua. |
| `malesialainen-nasi-lemak-aamiaisella` | **SOURCE-HOLD:** FI `cooking_method: paistaminen` vaikka koko reseptin riisi ja kananmuna kypsennetään keittämällä/höyryttämällä. 100 g riisiä, 184 g kookosmaitoa ja 100 g vettä on reseptin rajattu määrä; kokkiarvio ensin, sitten SHA-sidottu FI-/käännösmenetelmän korjaus. |
| `pohjoisafrikkalainen-harcha-juustolla` | Murenevan mannasuurimotaikinan käsittely, 10 min turvotus ja maltillinen pannupaisto tulee selittää kolmella kielellä. |
| `indonesialainen-pisang-goreng-aamiaiseksi` | Yksi lueteltu öljymäärä kaikille paistoerille; ei lisäöljyä eikä uppopaistoa, ellei reseptiä ja laskentaa erikseen muuteta. |
| `indonesialainen-nasi-uduk-aamiaisella` | **SOURCE-HOLD:** FI `cooking_method: paistaminen` vaikka riisi kypsennetään kookosmaidossa ja muna höyrytetään. Lisäksi 100 g kuivaa jasmiiniriisiä kypsyy ohjeessa **pelkässä 200 g kookosmaidossa** ilman lisävettä; keittokelpoisuus ja lisäveden ravintovaikutukset tarkistettava ennen mahdollista korjausta. EN/SV/TH-luonnokset toistavat FI:n nykyisen menetelmän ja määrät. |
| `kiinalainen-tomaattimunakas-riisilla` | Riisin keitinvesi on poistuva prosessivesi, ei tarjoiltava ainesosa; öljyn jako munien ja tomaattien välillä säilytettävä. |
| `vietnamilainen-banh-mi-munalla` | Porkkana on tarkoituksella tuore, ei pikkelöity. Käännöksiin ei saa keksiä etikkaa tai korianteria. |
| `pohjoisafrikkalainen-maakouda` | **SOURCE-REVIEW:** yksi `kpl`-peruna ilman grammapainoa, vaikka hiilihydraatit ja GK riippuvat annoksen perunamassasta; 4,84 g nettohiilihydraattia/annos vaatii lähdelaskennan tarkistuksen. Ei keksitä grammamäärää eikä ravintoarvoa. |
| `meksikolainen-atole-maissipuuro` | 100 g hienoa maissijauhoa, 700 g vettä ja 200 g maitoa; keitto ja kaikki mausteet mukaan, ei siivilöintiä. |
| `thai-khao-tom-katkaravuilla` | Riisi keitetään 700 g käyttövalmiissa kanaliemessä ja kaikki liemi tarjoillaan; katkaravut kypsennetään kauttaaltaan. |
| `karibia-maissipuuro-kookoksella` | 100 g maissijauhoa, 700 g vettä, 184 g kookosmaitoa; kaikki mausteet syödään, ei siivilöintiä. |
| `karibia-jamaikalainen-munakokkeli` | Chiliä käsitellään turvallisesti; kananmunat hyytyvät kauttaaltaan, lisäöljyä ei keksitä. |
| `lahi-ita-kikherne-shakshuka` | 100 g **kypsiä valutettuja** kikherneitä; muna kannen alla kypsäksi, ei kuivien papujen keittoa. |

## Käännösten pistokatselmointi

- `munakokkeli`: luettu EN, SV ja TH -luonnokset kokonaisina. 220 g kuoretonta munaa, 30 g nestemäistä 38 % kermaa, 14 g voita ja neljä munakokkelin työvaihetta säilyvät; kaikissa `status: draft`. Tämä **ei** vielä ole riippumaton kielentarkastus eikä täysi semanttinen SHA-evidenssi.
- `indonesialainen-nasi-uduk-aamiaisella`: luettu EN, SV ja TH -luonnokset kokonaisina. Kaikki kolme säilyttävät lähteen 100 g riisin + 200 g kookosmaidon ja höyrytetyn 110 g munan; mutta ne myös perivät edellä nimetyn FI-lähteen menetelmä-/valmistusesteen. **Ei julkaisua ennen FI-korjauspäätöstä**.

## Julkaisupäätös ja työnjako

1. Pidä PR #380 Draftina, kaikki 60 kieliversiota `draft`-tilassa. Älä muuta C20-työjonon `release_authorized: false` -arvoja tässä PR:ssä.
2. Selvitä ensiksi kaksi varmaa `cooking_method`-ristiriitaa (`nasi-lemak` ja `nasi-uduk`) sekä maakoudan perunamassan ravintolähde. Jos FI-lähde on GI/GK-SHA-lukittu, tee erillinen, tarkasti rajattu ja hyväksytty toimituksellinen näyttökorjaus **vain, jos se ei muuta laskennallista sisältöä**; määrä-/makromuutokset vaativat oman ravintolaskennan ja GI/GK-uudelleenarvioinnin.
3. Muista 17 FI-reseptistä tarvitaan vielä järjestelmällinen **kolmen kielen sisältövertailu** sekä ajantasaiset `source_hash`/`translation_hash`-evidenssit. Valintaa ei saa tulkita kokin hyväksynnäksi pelkästä YAML:n samankaltaisuudesta.
4. Julkaisukelpoinen osajoukko irrotetaan **uuteen** `main`-pohjaiseen release-PR:ään vain erillisten hyväksyntöjen jälkeen. Aja ennakkotarkistus ja CI yhdelle HEADille; korkeintaan yksi perusteltu korjaus ja uusi tarkistus, sitten STOP/HOLD. Varmista merge-SHA:n Pages build/deploy ja 3–5 live-reitin HTTP-smoke.
5. Tämä toinen läpikäynti koskee nimenomaan C20:n 20 valittua FI-lähdettä; alkuperäiseen C20-raporttiin luetellut **10 C20:n ulkopuolista source-HOLD-reseptiä** pysyvät erillisenä jonona.

**Evidenssirajat:** Tekninen GitHub-CI ja Git blob-SHA eivät todista reseptin kokkikelpoisuutta. Fyysistä koepaistoa, riippumatonta ihmiskielitarkastusta tai uutta ravintoarvolaskentaa ei tehty. Tämä raportti ei muuta olemassa olevia CI-todisteita eikä anna julkaisulupaa.
