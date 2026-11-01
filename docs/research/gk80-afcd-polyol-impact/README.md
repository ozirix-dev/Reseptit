# AFCD-POLYOL-IMPACT-01 — vaikutusauditointi

**1.11.2026 — tutkimus ja korjausehdotus, ei tuotantomuutoksia.**

Nykyisen tuotannon päätös: **CONDITIONAL**. 101/130 julkaistun GK-arvion jäljitetyssä lähdeketjussa on AFCD:n kenttäparin liian laaja kokonaispolyolitulkinta. Tämä ei osoita 101 GK-lukua vääriksi. 21 muussa tapauksessa näkyvien makrojen täydellinen lähdeketju ei selvinnyt nykyisistä laskentatodisteista; kahdeksassa ei löytynyt AFCD-vaikutusta jäljitettyyn julkaistavaan aineistoon. Nämä 21 lisätapausta eivät ole todettuja AFCD-virheitä.

PR #153: **HOLD, 0/20 julkaisuhyväksyntää tästä auditoinnista**. PR #156: **CONDITIONAL kahdelle täsmälliselle hyväksytylle lähdeskenaariolle**. Ei merge-, Ready- tai deploy-lupaa.

## Rajaus ja nykytila

Repo ozirix-dev/Reseptit, main 5761afa069ea54c9d510f1cb3c1086ae7d42f998. Oma worktree D:/Projects/tmp/reseptit-afcd-polyol-impact-01, haara codex/afcd-polyol-impact-01, repo_guard PASS. Muiden haarojen sisältöä ei muutettu. Tuotannon GK-sivu palautti HTTP 200 ja luvut 326 /130 /196. Käytettyjen 326 olemassa olevan tulosobjektin hashit täsmäsivät mainiin sidottuun baselineen; uusia koko aineiston GK-laskentoja ei tehty.

PR #153 HEAD 19a559d80d3b64d8d17954f87be5e4b0955a4826, CI 41313771770 PASS. Bún chản P2 on ratkaistu. Omistajan pyytämä uusi Codex Review valmistui tälle HEADille ja löysi uuden bulgogin P2:n: 13,5 g seesamiöljyn ja sipulien käyttövaiheet puuttuvat. [Havainto](https://github.com/ozirix-dev/Reseptit/pull/153#discussion_r4436028690) jätettiin muuttamatta. Ei uutta review-pyyntöä, kommenttia, ketjun ratkaisua tai Actions-uusinta-ajoa.

PR #156 HEAD d31c3a7ae157337177733375a9c7d811646187ee; #157–#160:n HEADit ja PASS-CI:t säilyivät. Ne ovat Draftina. Sol/High on asetustiedostossa; aktiivinen chat-valitsin ei näy työkalumetatiedoissa. Tarkka tilanne on provenance.json-tiedostossa.

## 1. AFCD:n täsmällinen määritelmä ja tietuetason poikkeus

Alkuperäinen [FSANZ Nutrient details -tiedosto](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx), Proximates G38:H39: ilman sokerialkoholeja laskettu A muodostetaan nimetyistä sokereista, tärkkelyksestä ja muista luetelluista hiilihydraateista. With-kentän julkaistu yhtälö lisää sorbitolin, mannitolin ja glyserolin. Erotus on laskettu kenttä, ei koko polyoliryhmän kattava analyysi. AFCD ei tällä yhtälöllä todista esimerkiksi erytritolia, ksylitolia, maltitolia, laktitolia tai isomaltia poissa oleviksi.

Release 3:n alkuperäinen profiilitiedosto sisältää kuitenkin myös erilliset **erytritoli-, maltitoli- ja ksylitolikentät**. F009837:n ilman/with-luvut 4,1/32,1 antavat erotuksen 28. Samassa tietueessa ilmoitetaan maltitoli 28, erytritoli 3,8 ja ksylitoli 3,6. Sorbitoli/mannitoli/glyseroli jäävät tässä tietueessa tyhjiksi. Näin ollen julkaistun kolmipolyoliyhtälön ja tämän rivin todellisen kenttäparin välillä on ristiriita: erotus vastaa maltitoliarvoa eikä ole näyttö mitatusta kolmipolyolisummasta. Eri polyolien ilmoitettu summa on 35,4, jo 7,4 enemmän kuin vanha adapteriarvo 28. Muista lajeista ei johdeta nollaa.

Tämän vuoksi myöskään lausetta “AN−AM on aina mitattu sorbitoli+mannitoli+glyseroli” ei käytetä uutena yleissääntönä. Lähdemääritelmä, tietueen johtamistapa, yksittäiset kentät ja niiden kattavuus tarkistetaan erikseen. 137 AFCD-lähdetietueen ketjusta ei löytynyt riippumatonta koko polyoliryhmän kattavaa määritystä. Analysed-johtamistapa ei tarkoita kaikkien ravintotekijöiden täydellistä analyysiä.

0 tarkoittaa tässä lähteen raportoimaa nollaa; AFCD-ohjeen mukaan myös alle raportointirajan olevia analyysiarvoja tallennetaan nollina. Tyhjä alkusolu tai null on raportoimaton arvo. Laskettu nolla kenttäparista on vielä eri asia. Finelin POLYL-komponentti 2260 tai yksilöity valmistajan kokonaispolyolimerkintä on erillinen lähdeperuste, mutta niitäkään ei nimitetä automaattisesti täydelliseksi analyyttiseksi määritykseksi. [Alkuperäinen AFCD-käyttöohje](https://www.foodstandards.gov.au/sites/default/files/2025-12/About%20the%20Australian%20Food%20Composition%20Database%20-%20Release%203.pdf).

## 2. Vaikutus neljään makroon ja GK:hon

- AFCD:n raportoitu ilman-kenttä A ei muutu pelkästä määritelmän tarkennuksesta. Tuntematonta polyolia ei vähennetä A:sta toiseen kertaan. Nykyisen A×GI/100-ainesosasumman piste ja GK-luokka eivät siksi automaattisesti muutu. Tämä ei osoita puuttuvien polyolien mahdollista vastetta huomioiduksi; laajempi menetelmätulkinta vaatii oman päätöksen.
- Kokonais-CHO A+kuitu+P tarvitsee todella koko P:n. Vanha kenttäpari antaa puutteellisen lähdeosasumman. Uutta tarkkaa kokonais-CHO:ta tai sen pyöristysvakautta ei voi päätellä tuntemattomasta lisäosuudesta.
- Proteiini ja rasva eivät muutu polyolikentän merkityksestä. Lähdetietueen vaihto voi muuttaa niiden arvoja; se erotetaan määritelmäkorjauksesta.
- Globaalin tarkistimen polyolilipun nollaaminen/nullittaminen sokkona ei ole turvallinen julkaisutoteutus: nykyinen neljän makron sopimus voi tällöin sulkea kokonaisen ravintoarvopaketin. Sääntöä ei tässä ohitettu.

## 3. A — nykyiset 130 julkaistua GK-arviota

| Jäljitetty riippuvuus | Reseptejä |
|---|---:|
| AFCD sekä GK- että makroketjussa |84|
| Vain jäljitetyssä GK-ketjussa |7|
| Vain makroketjussa |10|
| **Varmennetut AFCD-osumat yhteensä** |**101**|
| Muu näkyvien makrojen lähdetodisteen aukko, ei AFCD-osumaa GK-ketjussa |21|
| AFCD-kohtainen vaikutus ei löydy jäljitetystä aineistosta |8|

GK-ketjujen AFCD-osumia on 91 ja makroketjujen 94; niitä ei summata. 30 reseptille ei ole nykyistä recipe-ID-nimistä calculation-tiedostoa. Näistä kahdessa ei näytetä makropakettia, seitsemän sisältyy jo AFCD-GK-osumiin ja 21 jää erilliseksi näkyvien makrojen jäljitettävyysaukoksi. Niihin ei keksitä lähdettä, eikä niitä lasketa todetuiksi uusiksi AFCD-virheiksi.

Nykyisen 130 ryhmän lähteistä ei löytynyt positiivista erytritoli/ksylitolilisäosuutta, joka jo todistaisi nykyisen GK-pisteen muuttuvan. Tämä ei varmista kokonaispolyolia nollaksi. AFCD-tulkinta tarvitsee 101 ketjussa tarkistuksen, mutta massaperuutukselle tai kaikkien GK-pisteiden muuttamiselle ei syntynyt numeerista perustetta. Koko reseptikohtainen matriisi on matrix.json-tiedostossa, mukana lähde-ID:t, tarkat grammamäärät, annokset, retentiot, skenaariot ja kenttäparin tunnettu osuus.

## 4. B — PR #153:n kaikki 20 versiota

| Resepti-ID | Päätös | Lisärajaus |
|---|---|---|
|bulgogi|HOLD|Uusi bulgogin valmistus-P2 sekä AFCD-kattavuus|
|bun-cha-hanoi|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|caponata|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|carnitas-salaattitacot|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|congee-riisipuuro|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|doner-kebab|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|janssoninkiusaus-juuriselleri|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|japanilainen-kabocha-puuro|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|marokkolainen-couscous|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|menemen|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|pasta-alla-norma|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|ratatouille|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|rogan-josh|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|shakshuka|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|sitruuna-yrttikana-parsa|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|taytetyt-paprikat-vhh|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|tomaatti-kananmuna-wokki|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|uunikanapasta-kesakurpitsa|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|valimerellinen-halloumi-tomaattileipa|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|
|vietnamilainen-kahvijogurtti-banaanilla|HOLD|AFCD-kokonaiskattavuuden päätös puuttuu; määritelmä ei yksin pakota uutta GK-pistettä|

Kaikissa 20:ssa on AFCD-riippuvuus. Hyväksyttävissä tämän auditoinnin perusteella: **0/20 julkaisuun**. Tämä ei tarkoita 20 todettua numerovirhettä. Bún chản korjattu ohje, neljä makroa, GK ja kaikki muut lukitut versiot säilyivät. Vanha omistajahyväksyntä ei ratkaise nyt todettua lähdetulkintaa.

## 5. C — PR #156:n kaksi hyväksyttyä C-tapausta

| Resepti | Koko GK-skenaarion leveys | Näyttö | Päätös |
|---|---:|---|---|
| jauheliha-kaalikeitto-vhh |0,058|GK noin 5; kokonais-CHO 12 g|CONDITIONAL|
| vhh-kaalilaatikko |0,086|GK noin 4; kokonais-CHO 13 g|CONDITIONAL|

Riippumaton Decimal tarkisti vain nämä kaksi tapausta. Suljetut koko evidenssin hyväksyntähashit täsmäsivät. Molemmissa on pippurin kenttäparin ulkopuolinen osuus **sekä** meiramin tuntematon kokonaispolyoli. Lähteen makroluvut kiinnitetään, jäännös 100−A−kuitu−proteiini−rasva−tunnettu osa rajaa ehdollisen lisäosuuden; johdettua vettä ei vähennetä. Vastekerroinskenaario on hyväksytty 0–150 ja koko leveyden budjetti 0,10 GK/annos.

Molempien GK-luokka, kokonaislukuna näytetty GK ja kokonais-CHO sekä kahden desimaalin muut makrot pysyvät vakaina koko hyväksytyssä skenaariossa. Tämä on lähdelukuihin sidottu koostumusmalli, ei mitattu fysiologinen virheraja tai kaikkien makrojen mittausepävarmuuden yläraja. Menetelmää ja evidenssihasheja ei muutettu tai laajennettu. Julkaisujärjestys ja erillinen julkaisulupa ovat yhä avoimia.

## 6. D — viisi ehdotusta ja 83 HOLDia

| Lukittu tutkimusehdotus | AFCD-tietueita | AFCD-auditoinnin päätös |
|---|---:|---|
|rahka-marjakerroskulho|3|HOLD|
|malesialainen-kaya-paahtoleipa|0|NOT AFFECTED|
|munatacot-huevos-rancheros|4|HOLD|
|paprikainen-vhh-gulassi|5|HOLD|
|jauheliha-makaronilaatikko|3|HOLD|

Kaya-paahtoleivässä ei ole AFCD-riippuvuutta: NOT AFFECTED koskee vain tätä kysymystä, ei sisältö-/menetelmä- tai julkaisuhyväksyntää. Neljän muun ehdotuksen lähdeketju tarvitsee kokonaiskattavuuden päätöksen. Lukitut tutkimustekstit, syötehashit ja ravintolaskelmat säilyivät; niitä ei integroitu.

83 HOLDista 74 käyttää AFCD:tä, yhdeksän ei. Usealla on samanaikaisesti GI-, tuote-, määrä- tai valmistuseste. Yhteiset tietueet on deduplikoitu resepti-ID:n perusteella shared-hold-sources.json-tiedostoon; vaihtoehtoisia GK-skenaarioita ei summata keskenään.

Kaksi HOLD-reseptiä sisältää nykyisin **julkaistuja ravintoarvoja**, vaikka GK on keskeneräinen: keto-suklaakeksit ja keto-mutakakku. Niiden AFCD F009837 -todiste käyttää P=28 eikä lähteen erillisiä erytritoli 3,8/ksylitoli3,6-kenttiä. Tunnettujen eri polyolien summa on vähintään 35,4. Puuttuva tunnettu kokonais-CHO-osuus on kekseissä 0,444 g/annos (60 g suklaata /10 annosta) ja mutakakussa 1,3875 g/annos (150 g /8). Tämä ei anna uutta täsmällistä koko polyolia tai GK-vastetta. Nykyiset kokonais-CHO-pisteet 12,63 ja 19,84 g eivät kata tätä tunnettua lisäosuutta.

### Enintään viisi jatkotoimea 74 AFCD-HOLDille

| Ensisijainen lähdetoimi | Suora reseptijoukko | Muu este säilyy |
|---|---:|---|
|F009837 — Chocolate, dark, no added sugar|2|Tallenna kaikki ilmoitetut lajikentät; kokonaiskattavuus jää avoimeksi|
|F006077 — Nut, almond meal|13|Lähde-/valmistus-/GI-ehdot ratkaistaan erikseen; ei automaattista vapautusta|
|F004193 — Garlic, peeled, fresh, raw|12|Lähde-/valmistus-/GI-ehdot ratkaistaan erikseen; ei automaattista vapautusta|
|F002991 — Coconut, milk, canned, regular fat|11|Lähde-/valmistus-/GI-ehdot ratkaistaan erikseen; ei automaattista vapautusta|
|F006618 — Pepper, black, ground|11|Lähde-/valmistus-/GI-ehdot ratkaistaan erikseen; ei automaattista vapautusta|

Näiden viiden joukon unioni on **41 eri HOLD-reseptiä**. Lukumääriä ei summata. Tietueen kattavuuden korjaus ei yksin tuota hyväksyttyä koko reseptin GK:ta: tässä auditoinnissa uusia julkaistavia arvioita syntyi 0. Mantelijauhon 13 tapausta tarvitsevat lisäksi jauholle soveltuvan GI-sidoksen; tunnettu lähdekenttä ei poista muita esteitä. Pippurin 11 tapaukseen ei saa automaattisesti kopioida PR #156:n kahden reseptin lupaa.

## 7. Pienin korjaus ja muu systemaattinen virhe

Vaihtoehdot arvioitiin pyydetyssä järjestyksessä. AFCD-ketjuissa ei ole itsenäistä kokonais-P-todistetta. Olemassa oleva Fineli 33456 ilmoittaa raakapinaatin aggregate-POLYL 0, mutta komponentin johtamistapa on S, ei kaikkien lajien laboratoriomittaus. Raakapinaatin yhden reseptin vaihtoehtoinen lähdevaihto laskettiin erikseen: se yhdistäisi nyt eri baby/mature-AFCD-tietueita käyttävät GK- ja makroketjut. Vaihto muuttaisi neljää makroa ja vaatisi lisäksi nimetyn 40-kasvisoletuksen uuden sovellussidoksen. Siksi se on dokumentoitu vaihtoehto, **ei valittu ensimmäiseksi tuotantokorjaukseksi**. Pelkkää GI 40:tä ei esitetä mitattuna pinaatti-GI:nä.

Pyöristysvakautta voidaan osoittaa nyt vain PR #156:n kahdessa jo hyväksytyssä skenaariossa. Muihin resepteihin ei johdeta nollaa, keskipistettä tai uutta yleistä toleranssia.

**US-total-polun erillinen laskentavirhe:** synteettinen kontrolli C=20, F=4, P=3 antaa nykyisestä normalizeCarbohydrate-funktiosta available 16 ja net 13. Oikea kuitu- ja polyolivapaa A on 13. Nykyinen kokonais-CHO muodostuu 16+4+3=23, vaikka lähde ilmoittaa 20. Legacy-GK lukee available-kenttää ja voi siten käyttää P:n sisältävää 16:ta; P:n puuttuessa se voi edelleen saada available 16/net null. Yhtään tätä polkua käyttävää aktiivista lähdettä ei löytynyt nykyisen130 numeerisen GK:n tai niiden nykyisten makrotodisteiden joukosta. Virhe toistettiin kontrollilla, ei korjattu. EU_AVAILABLE-polussa ei havaittu polyolin kaksoisvähennystä.

## 8. Vain yksi seuraava tuotantokorjauserä, omistajan päätettäväksi

**Ehdotus: keto-suklaakeksien ja keto-mutakakun nykyisten ravintoarvopakettien pidätys.** Ne ovat tämän auditoinnin konkreettiset tunnetun lajikattavuuden numeropuute-esimerkit. Säilytä reseptit, grammojen määrät, annokset ja valmistus. Arkistoi nykyiset neljä arvoa ja lähdehistoria. Säilytä kaikki nimetyt polyolit sekä johdettu kenttäpari erillisinä ja kokonais-P tuntemattomana.

Uuden tarkalta näyttävän kokonais-CHO-pisteen julkaisu lisäämällä vain 7,4 g/100 g olisi edelleen perusteeton. Nykyinen neljän makron evidenssitarkistin vaatii täydellisen paketin; vain yhden kentän poistaminen tuottaisi ristiriidan. Pienin nykyiseen sopimukseen sopiva, yleissääntöä löysentämätön korjaus on pidättää näiden kahden julkinen makropaketti olemassa olevan insufficient-evidence-polun kautta, tarvittavat nykyiset kieliversiot mukaan lukien. Tämä ei väitä proteiinia, rasvaa tai raportoituun A:han perustuvaa nettoa vääriksi.

Molemmat GK-HOLDit säilyvät. Julkaistu GK-kattavuus pysyisi 130/326:ssa. Tulevan oikean korjaus-HEADin tarkistusten on osoitettava kaikkien 130 numeerisen GK:n ja 326 tuloksen tilajoukon säilyminen, vain kahden makropaketin muutokset, lähde-/käännössidokset ja strict audit. Yksi tarpeellinen kokonaisbuild vasta tämän erikseen hyväksytyn sisältökorjauksen toteutuksessa. US-total-bugia, pinaattivaihtoehtoa tai muita AFCD-tapauksia ei lisätä tämän ensimmäisen erän toteutuslupaan.

**Pysähdys tähän raporttiin.** PR #153:n ja #156:n julkaisut pysyvät omissa porteissaan. Ei mergeä, deployta, Ready-siirtymiä, massatutkimuseriä, ReportHubia tai automaattisia jatkoajoja.

## Toistettavuus ja päätösmatriisi

python docs/research/gk80-afcd-polyol-impact/verify.py tarkistaa paketin hashit, 240 matriisiriviä,137 AFCD-tietuetta, altistumismäärät, kahden C-evidenssin fingerprintit ja Decimal-budjetin sekä kontrollitulokset. --check-local-source-files tarkistaa lisäksi alkuperäiset paikalliset lähdehashit; polut ovat tämän auditoinnin Windows-työympäristöstä. Se ei muuta tai rakenna sivustoa.

Aineisto: matrix.json (kaikki 240 tapausta), sources.json (137 yksilöityä AFCD-lähdettä), numeric-checks.json (rajatut numeeriset tarkistukset), next-production-batch.json (vain ehdotus), provenance.json (HEADit/CI/lähdehashit). Alkuperäisen PR:n merkitys erotetaan: originalPr jäljittää mainiin tulleen recipe-ID-syötteen tai tämän tutkimus-PR:n; currentSourceReleasePr kertoo asennetun release-paketin julkaisun. Niitä ei väitetä samaksi kuin jokaisen historiallisen GK-pisteen ensimmäinen onnistunut ajo.

### Kaikki240 tapausta

| Ryhmä | Resepti-ID | Alkuperäinen syöte-PR / nykyinen lähde-PR | Päätös | AFCD-tietueet |
|---|---|---|---|---|
|A|munakokkeli|54 / 149|CONDITIONAL|F006618|
|A|munakasmuffinit|54 / 149|CONDITIONAL|F006618|
|A|munakasrulla-pinaatti-tuorejuustolla|54 / legacy main|HOLD||
|A|paprikauunimunakkaat|54 / 150|CONDITIONAL|F006618|
|A|uunimuna-avokadot|54 / 149|CONDITIONAL|F006618|
|A|uunimunat-pinaatilla|54 / 149|CONDITIONAL|F006118, F006618|
|A|tortilla-de-patatas|54 / 152|CONDITIONAL|F006618|
|A|vhh-lihamureke|54 / 149|CONDITIONAL|F006316, F006618|
|A|hummus|69 / legacy main|HOLD||
|A|chili-con-carne-kukkakaaliriisi|69 / 150|CONDITIONAL|F000448, F002893, F003327, F006316|
|A|vhh-kaalikaarryleet|69 / legacy main|HOLD||
|A|munakoiso-jauhelihavuoka-vhh|69 / 152|CONDITIONAL|F006281, F006618|
|A|valimerellinen-kikherne-yrttiaamiainen|69 / legacy main|HOLD||
|A|lahi-ita-kikherne-shakshuka|69 / 149|NOT AFFECTED||
|A|medu-vada|77 / legacy main|HOLD||
|A|lohikeitto-kuohukermalla|77 / 152|CONDITIONAL|F006618|
|A|butter-chicken|77 / 151|CONDITIONAL|F002258, F002806, F002963, F002970, F003190, F003192, F003327, F004193, F004213, F004380, F006316, F006618|
|A|lihapullat-kermakastikkeessa-vhh|77 / legacy main|HOLD||
|A|kanakorma-kukkakaaliriisilla|77 / legacy main|HOLD||
|A|khao-kha-moo-vhh|77 / legacy main|HOLD||
|A|larb-moo-vhh|77 / legacy main|HOLD||
|A|jauhelihakastike-kesakurpitsanuudeleilla|77 / legacy main|HOLD||
|A|marjakiisseli-vaniljakastikkeella|ei ratkennut / legacy main|CONDITIONAL|F009881|
|A|pannacotta-marjakastikkeella|ei ratkennut / legacy main|CONDITIONAL|F004196, F009881|
|A|koshari|ei ratkennut / 152|CONDITIONAL|F003327, F004193, F004726|
|A|harira|ei ratkennut / 149|CONDITIONAL|F002963, F003192, F004210, F004726, F008936, F009335|
|A|souvlaki|ei ratkennut / legacy main|CONDITIONAL|F002806, F004193, F004726, F006281|
|A|gazpacho|ei ratkennut / legacy main|CONDITIONAL|F004193|
|A|tabbouleh|ei ratkennut / 152|CONDITIONAL|F001929, F004726, F005700, F006250, F006321, F006618|
|A|poronkaristys-kukkakaalimuusilla|ei ratkennut / legacy main|CONDITIONAL|F006618|
|A|raejuusto-pesto-kasviskulho|ei ratkennut / legacy main|NOT AFFECTED||
|A|vhh-brita-kakku|ei ratkennut / legacy main|CONDITIONAL|F000247, F006077, F008952|
|A|vhh-mokkapalat|ei ratkennut / legacy main|CONDITIONAL|F000247, F003041, F006077|
|A|khao-man-gai-vhh|ei ratkennut / legacy main|CONDITIONAL|F002806, F003192, F004193, F004213, F004729|
|A|kesakurpitsalasagne-vhh|ei ratkennut / legacy main|HOLD||
|A|vhh-lohikeitto-kukkakaalilla|ei ratkennut / legacy main|HOLD||
|A|valimerellinen-tortilla-espanola-aamupalaksi|ei ratkennut / 150|NOT AFFECTED||
|A|kana-fajita-pelti|ei ratkennut / 150|CONDITIONAL|F002594, F002893, F003327, F005199, F006316|
|A|italian-pata|ei ratkennut / 152|CONDITIONAL|F004193, F006281, F006618|
|A|kukkakaaligratiini-pekonilla|ei ratkennut / legacy main|HOLD||
|A|valimerellinen-menemen-fetalla|ei ratkennut / legacy main|HOLD||
|A|broileri-kukkakaaligratiini|ei ratkennut / legacy main|CONDITIONAL|F002806|
|A|som-tam-vhh-kurkkuna|ei ratkennut / 151|CONDITIONAL|F000430, F002896, F004193, F004729, F006110, F008004|
|A|kanakeitto-pinaatti-sitruuna|ei ratkennut / 150|CONDITIONAL|F002594, F006618, F008761, F008936|
|A|pad-kra-pao-vhh|ei ratkennut / legacy main|CONDITIONAL|F000396, F002901, F004193|
|A|pohjoisafrikkalainen-maakouda|ei ratkennut / legacy main|HOLD||
|A|kermainen-lohipata|ei ratkennut / legacy main|HOLD||
|A|gai-yang-vhh|85 / legacy main|CONDITIONAL|F002809, F003192, F004193, F004729|
|A|paahdettu-aamiaismunakoiso|85 / legacy main|HOLD||
|A|halloumimunakas|85 / legacy main|HOLD||
|A|raejuusto-uunimunakas|85 / 152|CONDITIONAL|F006618|
|A|keto-pannukakku|85 / legacy main|HOLD||
|A|parsakaali-sinihomejuustofrittata|85 / 152|CONDITIONAL|F002405, F006618|
|A|yum-woon-sen-vhh|85 / legacy main|CONDITIONAL|F002901, F003192, F004729, F007422|
|A|keto-pinaattiletut|85 / legacy main|CONDITIONAL|F008761|
|A|kurkku-oliivi-aamiaiskulho|85 / legacy main|HOLD||
|A|uunilohi-smetanakuorrutteella|85 / 152|CONDITIONAL|F003269, F006618|
|A|moo-ping-vhh|86 / 151|CONDITIONAL|F002991, F003192, F004193, F005199, F006618, F008004, F008065|
|A|uuniporsas-kermakastikkeessa-vhh|86 / 149|CONDITIONAL|F006618, F009160|
|A|kai-jiew-vhh|86 / legacy main|CONDITIONAL|F006250|
|A|savulohi-avokadokulho|86 / legacy main|HOLD||
|A|tonnikalamunakkaat-uunissa|86 / 149|CONDITIONAL|F006618|
|A|indonesialainen-bubur-ayam-kanariisipuuro|86 / 149|CONDITIONAL|F002594, F004213, F006250, F007682|
|A|yangzhou-paistettu-riisi|88 / 152|CONDITIONAL|F006250, F006538, F007433, F008065|
|A|lanttulaatikko-kermainen|88 / 151|CONDITIONAL|F006118, F006618|
|A|amritsari-kala|88 / legacy main|CONDITIONAL|F002893, F003986, F004193, F006316|
|A|kana-yakitori-kaalilla|88 / legacy main|CONDITIONAL|F004213, F005701, F006187, F006250, F008214|
|A|kana-enchilada-kukkakaalivuoka|88 / 150|CONDITIONAL|F002896, F003192, F003327, F004729, F005199, F006316|
|A|karjalanpaisti-vhh|88 / legacy main|CONDITIONAL|F006933|
|A|kanapyorykat-tomaattikastike|88 / 149|CONDITIONAL|F002479, F006281, F006618|
|A|kantonilainen-hoyrytetty-kala|88 / legacy main|CONDITIONAL|F004213, F005198, F006250|
|A|tacokulho-nauta-avokado|88 / legacy main|CONDITIONAL|F000678, F003327, F005198, F006316|
|A|kanasalaatti-pesto-mozzarella|88 / legacy main|CONDITIONAL|F009190|
|A|karibia-kookosriisi-pavuilla|89 / 149|CONDITIONAL|F000448, F002991, F010466|
|A|thai-khao-tom-katkaravuilla|89 / 149|CONDITIONAL|F004193, F004213, F007422|
|A|lahi-ita-kikhernejauho-yrttilettu|89 / legacy main|CONDITIONAL|F003327, F003986, F006321|
|A|korealainen-yachaejuk-kasvisjuk|89 / legacy main|CONDITIONAL|F006187|
|A|malesialainen-congee-inkivaarilla|89 / legacy main|CONDITIONAL|F004213, F006250|
|A|kiinalainen-tomaattimunakas-riisilla|89 / legacy main|CONDITIONAL|F006250|
|A|kiinalainen-riisipuuro-kananmunalla|89 / legacy main|CONDITIONAL|F004213, F006250|
|A|thai-jok-kanalla|89 / legacy main|CONDITIONAL|F004213|
|A|thai-porsasjok|89 / legacy main|CONDITIONAL|F004213|
|A|lahi-ita-fattet-hummus|89 / legacy main|NOT AFFECTED||
|A|pohjoisafrikkalainen-lablabi|89 / 149|CONDITIONAL|F003327|
|A|meksikolainen-kurpitsapuuro-piloncillolla|89 / 149|CONDITIONAL|F002963, F006143, F007535, F008969|
|A|meksikolainen-aamiais-tacot-mustapavuilla|90 / legacy main|NOT AFFECTED||
|A|intialainen-pesarattu-mungpavuista|90 / legacy main|CONDITIONAL|F000446, F002896, F004213, F007682|
|A|lahi-ita-ful-medames|90 / legacy main|CONDITIONAL|F000418, F003327, F006321|
|A|meksikolainen-molletes-pico-de-gallolla|92 / legacy main|NOT AFFECTED||
|A|vietnamilainen-chao-ga-kanapuuro|92 / 149|CONDITIONAL|F002594, F004213, F006250, F007682|
|A|korealainen-gyeranbap-riisikulho|92 / legacy main|CONDITIONAL|F007682, F008204|
|A|vietnamilainen-hu-tieu-aamiaiskeitto|92 / 149|CONDITIONAL|F003192, F007037, F008806|
|A|karibia-maissipuuro-kookoksella|92 / 149|CONDITIONAL|F002963, F002991, F009350|
|A|lahi-ita-taatelipuuro-tahinilla|92 / 149|CONDITIONAL|F002258, F003496, F006143, F009076|
|A|indonesialainen-ketoprak-aamiaiskulho|92 / legacy main|CONDITIONAL|F008806, F009176|
|A|thai-kookosriisi-mangolla|92 / 150|CONDITIONAL|F002991, F005299, F007682|
|A|meksikolainen-quesadilla-sienilla|93 / 152|CONDITIONAL|F003202, F005946|
|A|korealainen-jumeokbap-merilevalla|93 / legacy main|CONDITIONAL|F006187, F007682, F008204|
|A|valimerellinen-tahinipuuro|93 / 149|CONDITIONAL|F004380, F006143, F009076|
|A|pohjoisafrikkalainen-minttutee-kaurapuuro|93 / 149|CONDITIONAL|F004380, F005700, F006143|
|A|malesialainen-mee-goreng-aamunuudeleilla|93 / legacy main|CONDITIONAL|F008806, F009176|
|A|meksikolainen-atole-maissipuuro|93 / 149|CONDITIONAL|F002963, F009350|
|A|vietnamilainen-banh-mi-munalla|94 / legacy main|NOT AFFECTED||
|A|pohjoisafrikkalainen-kuskus-aamiaiskulho|94 / legacy main|CONDITIONAL|F003239, F003496|
|A|malesialainen-nasi-lemak-aamiaisella|94 / 149|CONDITIONAL|F002991, F003319, F007682|
|A|indonesialainen-nasi-uduk-aamiaisella|94 / 149|CONDITIONAL|F002991, F007682|
|A|japanilainen-onigiri-lohella|94 / legacy main|CONDITIONAL|F007682, F008204|
|A|kiinalainen-hirssipuuro-taateleilla|94 / legacy main|CONDITIONAL|F003496, F004213|
|A|thai-riisinuudelikeitto-aamuksi|94 / 150|CONDITIONAL|F002594, F003192, F005199, F008936|
|A|kiinalainen-musta-seesamipuuro|95 / 149|CONDITIONAL|F004380, F007682, F008214|
|A|meksikolainen-munakokkeli-pico-de-gallolla|95 / legacy main|CONDITIONAL|F003192|
|A|karibia-mango-limejogurtti|95 / legacy main|CONDITIONAL|F002987, F004729, F005299|
|A|thai-papaijajogurtti|95 / 149|CONDITIONAL|F002983, F004729, F006528|
|A|japanilainen-tamago-kake-gohan|96 / legacy main|CONDITIONAL|F007682, F008204|
|A|lahi-ita-zaatar-munat|96 / legacy main|NOT AFFECTED||
|A|keto-joulutortut|96 / legacy main|CONDITIONAL|F006077|
|A|valimerellinen-jogurttikulho-hunajalla|96 / legacy main|CONDITIONAL|F003834, F004380|
|A|kiinalainen-soijamaito-aamiaisella|96 / legacy main|CONDITIONAL|F006187, F006250|
|A|valimerellinen-ricotta-persikkakulho|96 / legacy main|CONDITIONAL|F002488, F006113, F006571, F006573|
|A|meksikolainen-huevos-a-la-mexicana|96 / 149|CONDITIONAL|F002896|
|A|karibia-callaloo-munakas|98 / 149|CONDITIONAL|F006250, F008761, F010466|
|A|korealainen-gyeran-mari-kasviksilla|98 / legacy main|CONDITIONAL|F006187, F006250|
|A|karibia-jamaikalainen-munakokkeli|98 / legacy main|CONDITIONAL|F010466|
|A|pohjoisafrikkalainen-harissa-shakshuka|98 / 151|CONDITIONAL|F002896, F003190, F003327, F004193|
|A|valimerellinen-pinaatti-fetashakshuka|98 / legacy main|CONDITIONAL|F008749, F008761|
|A|thai-kai-jiao-yrteilla|98 / 149|CONDITIONAL|F000396, F006250, F008004|
|A|yrttituorejuusto-kinkkurullat|98 / 149|CONDITIONAL|F006618|
|A|kreikkalainen-kanavuoka-oliiveilla|98 / 149|CONDITIONAL|F002806, F006198, F006281, F006618, F009190|
|A|shoyu-kanakeitto-konjac|98 / 149|CONDITIONAL|F004213, F005946, F006187, F006250, F008065, F008936|
|A|tandoorikana|98 / legacy main|CONDITIONAL|F002806, F003190, F003327, F004193, F004213, F006316|
|B|bulgogi|153 / 153|HOLD|F000810, F004193, F006187, F006250, F006618, F007682, F008065, F008969|
|B|bun-cha-hanoi|153 / 153|HOLD|F003192, F004193, F006618, F006862, F008004, F008969|
|B|caponata|153 / 153|HOLD|F000396, F002220, F002390, F006198|
|B|carnitas-salaattitacot|153 / 153|HOLD|F003192, F003327, F004193, F005191, F005199, F006281, F006618|
|B|congee-riisipuuro|153 / 153|HOLD|F004213, F006187, F006250, F007682, F008065, F008936|
|B|doner-kebab|153 / 153|HOLD|F003327, F004193, F006281, F006316, F006618|
|B|janssoninkiusaus-juuriselleri|153 / 153|HOLD|F000074, F006618|
|B|japanilainen-kabocha-puuro|153 / 153|HOLD|F002991, F007535, F007682|
|B|marokkolainen-couscous|153 / 153|HOLD|F002806, F003190, F003239, F003327, F008936, F009335|
|B|menemen|153 / 153|HOLD|F006316, F006618|
|B|pasta-alla-norma|153 / 153|HOLD|F000396, F002479, F004193, F006618|
|B|ratatouille|153 / 153|HOLD|F000396, F004193, F006618, F009160|
|B|rogan-josh|153 / 153|HOLD|F002258, F002893, F002963, F003190, F003327, F004193, F004213, F005077, F006316|
|B|shakshuka|153 / 153|HOLD|F003327, F006316, F006618|
|B|sitruuna-yrttikana-parsa|153 / 153|HOLD|F000155, F004193, F006618, F009160|
|B|taytetyt-paprikat-vhh|153 / 153|HOLD|F006281, F006618|
|B|tomaatti-kananmuna-wokki|153 / 153|HOLD|F006159, F006250, F008065|
|B|uunikanapasta-kesakurpitsa|153 / 153|HOLD|F000396, F002594, F004193, F006618|
|B|valimerellinen-halloumi-tomaattileipa|153 / 153|HOLD|F002466, F006198|
|B|vietnamilainen-kahvijogurtti-banaanilla|153 / 153|HOLD|F003065, F005582|
|D|baozi|157 / 157|HOLD|F004213, F006187, F006250|
|D|chow-mein|157 / 157|HOLD|F002806, F004193, F006044, F006187, F006250, F008026|
|D|hyderabadi-kanabiryani|157 / 157|HOLD|F002258, F002963, F003190, F003192, F003327, F005700, F007682, F009335|
|D|indonesialainen-serabi-kookospannukakku|157 / 157|HOLD|F002987|
|D|intialainen-rava-uttapam|157 / 157|HOLD||
|D|jiaozi|157 / 157|HOLD|F004213, F006187, F006250|
|D|karibia-johnny-cake|157 / 157|HOLD|F000247|
|D|keto-suklaakeksit|157 / 157|HOLD|F000247, F006077, F009350, F009837|
|D|korealainen-kongjuk-soijapapu-riisipuuro|157 / 157|HOLD|F000458, F007682|
|D|lahi-ita-menemen-sumakilla|157 / 157|HOLD||
|D|malesialainen-apam-balik|157 / 157|HOLD|F003202, F006107|
|D|marjainen-chiavanukas|157 / 157|HOLD|F009350|
|D|munakoiso-kesakurpitsalasagne|157 / 157|HOLD|F000396, F004193, F006618, F010466|
|D|paistettu-maksa-pekonilla|157 / 157|HOLD|F006618|
|D|pohjoisafrikkalainen-bissara|157 / 157|HOLD|F000416, F003327, F004193|
|D|rahka-marjakerroskulho|157 / 157|HOLD|F001290, F004726, F008952|
|D|siemengranola-jogurtilla|157 / 157|HOLD|F002963, F007619, F008210, F008212, F008215|
|D|thai-maissifritterit|157 / 157|HOLD|F000396|
|D|valimerellinen-appelsiini-aamiaiskakku|157 / 157|HOLD||
|D|vhh-letut|157 / 157|HOLD|F006077|
|D|vhh-pyttipannu|157 / 157|HOLD|F006618|
|D|vietnamilainen-banh-xeo-aamiaisletut|157 / 157|HOLD|F002991, F007422, F008806|
|D|bouillabaisse|158 / 158|HOLD|F003820, F004193, F005968, F007433|
|D|dan-dan-nuudelit|158 / 158|HOLD||
|D|indialainen-poha-maapahkinoilla|158 / 158|HOLD|F003192, F006107|
|D|intialainen-aloo-paratha|158 / 158|HOLD|F003192, F003327|
|D|intialainen-ven-pongal|158 / 158|HOLD|F000446, F004205, F006088, F006618, F007682|
|D|kaakao-kookos-chia|158 / 158|HOLD|F009350|
|D|kerala-kalacurry|158 / 158|HOLD|F002893, F002991, F004193, F004213, F009081, F009335|
|D|kiinalainen-jianbing-munaletty|158 / 158|HOLD|F005702, F006250|
|D|kreikkalainen-moussaka|158 / 158|HOLD|F002963, F006618|
|D|lahi-ita-pistaasijogurtti|158 / 158|HOLD|F006113, F006842|
|D|malesialainen-kaya-paahtoleipa|158 / 158|NOT AFFECTED||
|D|meheva-suklaakakku|158 / 158|HOLD|F000247|
|D|munatacot-huevos-rancheros|158 / 158|HOLD|F003192, F003327, F006316, F006618|
|D|paprikainen-vhh-gulassi|158 / 158|HOLD|F003269, F003327, F004193, F006316, F006618|
|D|pohjoisafrikkalainen-harcha-juustolla|158 / 158|HOLD||
|D|rahkapiirakka-vhh|158 / 158|HOLD|F006077, F009350|
|D|silakkapihvit-tilli-kermakastike|158 / 158|HOLD||
|D|thai-roti-munalla-banaanilla|158 / 158|HOLD|F002991|
|D|valimerellinen-farinata-aamupalaksi|158 / 158|HOLD|F003986, F006198|
|D|vhh-lihapiirakka|158 / 158|HOLD|F006077, F006618|
|D|vhh-raparperipiirakka|158 / 158|HOLD|F006077, F007502, F009350|
|D|vietnamilainen-papaija-kookospuuro|158 / 158|HOLD|F002991, F004729, F006528, F009090|
|D|char-siu|159 / 159|HOLD|F004193, F004380, F007037, F008008|
|D|falafel|159 / 159|HOLD|F000247, F002881, F003190, F003192, F003327, F004193, F006321|
|D|indonesialainen-bakwan-maissifritter|159 / 159|HOLD|F003209, F006250|
|D|intialainen-besan-chilla|159 / 159|HOLD|F003192, F003986|
|D|japanilainen-hojicha-jogurtti-persimonilla|159 / 159|HOLD|F006628|
|D|kanaviillokki-kukkakaalilla|159 / 159|HOLD|F003337|
|D|keto-korvapuustit|159 / 159|HOLD|F002963, F006077|
|D|kiinalainen-kevatsipulipannukakku|159 / 159|HOLD|F006187, F006250|
|D|kung-pao-kana|159 / 159|HOLD|F002806, F002893, F004193, F004213, F006110, F006250|
|D|liha-juureskeitto-perunaton|159 / 159|HOLD|F000514, F006321, F006618, F009021|
|D|malesialainen-roti-canai-dhalilla|159 / 159|HOLD|F002991, F005184|
|D|meksikolainen-paputostada-aamupalaksi|159 / 159|HOLD||
|D|okonomiyaki-kaaliletut|159 / 159|HOLD|F005441, F006077, F006250, F008214|
|D|pizza-margherita|159 / 159|HOLD|F000396, F009606|
|D|pohjoisafrikkalainen-msemen-hunajalla|159 / 159|HOLD|F004380|
|D|rendang-padang|159 / 159|HOLD|F002901, F002987, F002991, F004193, F004213, F007682, F009335|
|D|spanakopita|159 / 159|HOLD|F002452, F006250, F006497, F006618, F008761|
|D|tunisialainen-ojja|159 / 159|HOLD|F003327, F004193|
|D|vhh-juustokakku|159 / 159|HOLD|F004726, F006077, F009350|
|D|vhh-mansikkakakku|159 / 159|HOLD|F000247, F006077, F008952, F009350|
|D|vhh-runebergintortut|159 / 159|HOLD|F000247, F002258, F006077, F007619|
|D|vietnamilainen-pho-ga-aamuksi|159 / 159|HOLD||
|D|chettinad-kana|160 / 160|HOLD|F002806, F002963, F003190, F004193, F004213, F006159, F006618|
|D|hapanimela-porsas|160 / 160|HOLD|F007037|
|D|indonesialainen-pisang-goreng-aamiaiseksi|160 / 160|HOLD|F002987|
|D|intialainen-mannasuurimoupma|160 / 160|HOLD||
|D|jauheliha-makaronilaatikko|160 / 160|HOLD|F004193, F006316, F006618|
|D|karibia-bammy-kassavaleipa|160 / 160|HOLD|F002286, F002991, F004729|
|D|keto-mutakakku|160 / 160|HOLD|F006077, F009350, F009837|
|D|kookos-lime-kanacurry|160 / 160|HOLD|F000396, F000431, F002806, F002991, F005199|
|D|lahi-ita-manakish-zaatarilla|160 / 160|HOLD|F009160|
|D|lindstrominpihvit-kaalilla|160 / 160|HOLD|F000678, F001010, F006618|
|D|malesialainen-roti-jala-currykanalla|160 / 160|HOLD|F002806, F002991|
|D|miso-lohi-paksoi|160 / 160|HOLD|F001301, F005702, F006187, F008214|
|D|paella-valenciana|160 / 160|HOLD|F000431, F002806, F006316, F007682, F008936|
|D|pohjoisafrikkalainen-baghrir|160 / 160|HOLD|F004380, F009606|
|D|pohjoisafrikkalainen-taatelipuuro-appelsiinilla|160 / 160|HOLD|F002963, F003496|
|D|sate-ayam|160 / 160|HOLD|F002991, F003190, F004193, F004729, F005199, F008969, F009335|
|D|thai-kananmunat-kookoscurryssa|160 / 160|HOLD|F002991, F007682|
|D|uunimakkara-sipulipedilla|160 / 160|HOLD|F006316, F006618|
|D|vhh-korvapuustit|160 / 160|HOLD|F002963, F006077, F007502|
|D|vhh-omenapiirakka|160 / 160|HOLD|F000095, F002963, F004726, F006077|
|D|vietnamilainen-banh-cuon-sienilla|160 / 160|HOLD|F005946, F007057|
|D|xiaolongbao|160 / 160|HOLD|F004196, F004213, F006187, F006250|
|C|jauheliha-kaalikeitto-vhh|156 / 156|CONDITIONAL|F006618|
|C|vhh-kaalilaatikko|156 / 156|CONDITIONAL|F006618|
