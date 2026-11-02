# AFCD-POLYOL-01: yhteinen lähdetulkinta ja päätösehdotus

2.11.2026. **Tutkimus- ja päätösajo.** Kohde `ozirix-dev/Reseptit`, lopullinen main-snapshot **`4a804757d5f9732938928dcba8f79ea0674ad98c`**. [Operaatio 147 / PR #180](https://github.com/ozirix-dev/Reseptit/pull/180) luettiin versiosta `fd8bd4d31e6d37bc53d669870a00557f5147644a`. Alkuperäinen 172 reseptin joukko säilyy erillisenä vertailupohjana.

**Suositeltu yhteinen päätös:** AFCD:n *without sugar alcohols* on oma saatavan hiilihydraatin lähdehavaintonsa. *With − without* tallennetaan erilliseksi johdetuksi hiilihydraattikenttien erotukseksi. **Erotusta ei hyväksytä sellaisenaan todennetuksi kokonaispolyoliksi eikä todisteeksi nollasta.** Kokonaispolyoli jää tuntemattomaksi ilman riittävän kattavaa tietuekohtaista näyttöä. Proteiini ja rasva sekä oikein valitun saatavan hiilihydraatin lukuarvo säilyvät riippumattomina.

Löytyi **yksi nykyiseen julkaistuun GK-laskelmaan vaikuttava kenttävalintavirhe**, yksi samanlainen virhe pidätetyssä GK-inputissa ja yksi nykyisin käyttämätön virheellinen rekisterikopio. Lisäksi sokerittoman suklaan vanhan polyolitulkinnan numeerinen aliarvio on osoitettavissa kahdessa jo pidätetyssä reseptissä. Muiden reseptien vääriä makrolukemia ei tällä perusteella osoitettu. Täydellisen kokonaispolyolin puuttuvuus on silti laaja menetelmällinen epävarmuus.

## 1. Täsmälliset määrät ja rajaus

| Mittari | Tulos ja merkitys |
| --- | --- |
| PR #180:n alkuperäinen tarkastusjoukko | 172 reseptiä, **127 uniikkia alkuperäistä AFCD-ID:tä**, 167 paikallista tunnistetta, 519 ainesosariviä |
| Sama lähdeongelma nykyisen mainin tavallisissa makroinputeissa | **125 uniikkia AFCD-tietuetta, 175 reseptiä**, joista 173:n makropaketti näkyy ja kaksi on jo withdrawn |
| Nykyisten makro- tai GK-laskentapolkujen käyttämät AFCD-lähteet | **133 tietuetta / 219 reseptiä**. Sisältää myös pidätetyt inputit ja kolme rajattua erityismallia; ei tarkoita 219 julkaistua väärää arvoa. |
| Kaikki nykyiset viitteet, myös laskennassa ohitetut | 135 tietuetta / 223 reseptiä; 979 CSV-riviä, joista 936 käytössä ja 43 ohitettua viitettä |
| Päätösmatriisi | 138 lähderiviä: 133 käytettyä, kaksi vain ohitettuihin riveihin liittyvää ja kolme nykyisin käyttämätöntä tarkastuskopiota |
| Normalisointiversiot | 253; sama paikallinen ID voi sisältää eri arvoja eri tiedostoissa |
| Osoitetut nykyiset julkaistut numeeriset virheet | **1 GK-laskelma, 0 makropakettia** tämän AFCD-ongelman perusteella |
| Muut osoitetut numeeriset/input-ongelmat | 1 pidätetyn GK-inputin väärä A-kenttä; 2 jo withdrawn-historialaskelmaa; 1 käyttämätön väärä rekisterikopio |

Työ alkoi mainista `c127a715…`. Ajon aikana [PR #179](https://github.com/ozirix-dev/Reseptit/pull/179) yhdistettiin mainiin. Lopullinen riippuvuuskartta tehtiin uudesta mainista omassa uudessa worktreessä `D:/Projects/tmp/reseptit-afcd-polyol-01-current`, haaralla `codex/afcd-polyol-01-current`; repo_guard PASS tarkistettiin molemmissa vaiheissa. Malli ja effort olivat istuntometadatan sekä asetusten mukaan Sol High. Rinnakkainen GK-chat tarkistettiin, sen tiedostoihin ei kirjoitettu.

Uuden mainin myötä viisi alkuperäisen joukon reseptiä ei enää viittaa AFCD:hen. Alkuperäisjoukon nykyisissä parikenttäinputeissa on 125 lähdettä ja 507 riviä. Lisäksi kahdeksan reseptin sama laskentamenetelmä oli jäänyt alkuperäisen sanan `paired` perusteella tehdyn haun ulkopuolelle: niissä peruste on kirjoitettu `with-minus-without`. Tämä selittää nykyisen 175:n makroinputjoukon. Rajattujen recovery/scoped-menettelyjen kolme reseptiä erotetaan tästä joukosta.

## 2. Mitä virallinen lähde todella sanoo?

Kolme virallista Release 3 -tiedostoa ladattiin kerran paikalliseen lähdevälimuistiin. Tietueita ei tutkittu uudelleen joka reseptille. Työkalun lähdehashit ovat [summary.json](summary.json)-tiedostossa ja kenttien paikantimet [source-notes.json](source-notes.json)-tiedostossa.

- [Nutrient details](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20details.xlsx): `Proximates!G38:H39` kuvaa hiilihydraattikentät. Yleisen with-yhtälön lisäjäsenet ovat sorbitoli, mannitoli ja glyseroli. Erytritoli, maltitoli ja ksylitoli esiintyvät erillisillä riveillä. Joidenkin CHO-havaintojen menetelmä voi perustua pakkausmerkintään tai erotuslaskentaan; pelkkä nimi ei ole analyysimenetelmä.
- [Nutrient profiles](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20profiles.xlsx): sheet `All solids & liquids per 100 g`, A = native-ID, Y/AB/AC/AD/AE/AK = kuusi polyolilajia, AM/AN = without/with. Tyhjä solu säilytettiin puuttuvana. Vertailu nykyisen repon referenssiin ei löytänyt eroa tarkistettujen 138 tietueen yhdestätoista kentästä.
- [Food Details](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Food%20Details.xlsx): tuotekuvaus, koostumuksen tausta ja elintarviketason derivation. `Analysed` ei todista jokaisen ravintotekijän mittausta.

[AFCD:n taustakuvaus](https://www.foodstandards.gov.au/sites/default/files/2025-12/About%20the%20Australian%20Food%20Composition%20Database%20-%20Release%203.pdf), s. 1 ja 3, erottaa puuttuvan ravintotekijän poissaolosta ja kertoo alle raportointirajan tulosten mahdollisesta nollaesityksestä. Lähteen nolla ei siis yksin todista täsmällistä biologista nollaa.

**Yleiskaava ei riitä jokaisen tietueen tulkinnaksi.** Suklaassa F009837 with/without-erotus vastaa numerona maltitolia, vaikka yleinen yhtälö mainitsee toiset polyolit. Syytä ei ratkaistu alkuperäisellä laboratorioaineistolla. Tätä pidetään tietuekohtaisena määritelmä-/kattavuuspoikkeamana, ei hiljaisesti korjattuna viranomaisarvona. Siksi turvallinen yleinen normalisointinimi on *parikenttien erotus*, ei edes yleisesti vahvistettu kolmen lajin summa.

## 3. Päätösmatriisi ja epävarmuuden lajit

[source-decisions.csv](source-decisions.csv) sisältää yhden rivin kutakin native-ID:tä kohti: lähdearvot kerran, derivaatioluokka, ryhmä, käytettyjen ja kaikkien viitattujen reseptien määrät, molemmat hiilihydraatit, kuusi lajia, tunnettu osasumma, Excel-paikantimet ja numeerinen ongelma. [normalization-variants.csv](normalization-variants.csv) erottaa paikalliset normalisointiversiot ja käytössä olevat rivit.

| Alkuperäisen 127 lähteen ryhmä | Lähteitä | Päätös |
| --- | ---: | --- |
| With = without, kaikki kuusi lajia puuttuvat | 121 | Erotus on 0, mutta kokonaispolyolin arvo on UNKNOWN. |
| Erotus 0, joitakin lajeja ilmoitettu nollina | 2 | Säilytä ilmoitettu nolla juuri kyseiselle lajille. Muut lajit ja kokonaisuus jäävät tuntemattomiksi. |
| Positiivinen erotus ja vajaa lajipaneeli | 3 | Erotus ja ilmoitetut lajimäärät pidetään eri havaintoina. Ei täydellisen summan väitettä. |
| Tunnettu lajien osasumma ylittää selvästi erotuksen | 1 | F009837, vanha kokonaispolyoliväite on osoitettavasti liian pieni. |

Koko 138 lähteen matriisissa vastaavat ryhmät ovat 129 / 3 / 5 / 1. Tämä laajempi luku sisältää myös nykyisin käyttämättömät vertailukopiot. Kaikille näille ei löytynyt kattavaa ilmoitettua kokonaispolyolihavaintoa. **Puuttuvan kokonaismäärän täsmällistä ylärajaa tai arvojen biologista virhettä ei voitu osoittaa yleisesti.**

Erota seuraavat tilat yhteisessä tietomallissa:

| Havainto | Tallennus ja merkitys |
| --- | --- |
| Lähteen lajikohtainen numero, myös 0 | `REPORTED_SOURCE_VALUE` + laji, lähdeversio ja menetelmätieto. Ei automaattista ANALYTICAL- tai TOTAL-merkintää. |
| With − without | `DERIVED_PAIRED_CARBOHYDRATE_DIFFERENCE`. Molemmat operandit, versio ja tarkkuus säilyvät. |
| Ilmoitettujen lajien summa | `REPORTED_SPECIES_PARTIAL_SUM` + mukana olevat sekä puuttuvat jäsenet. Ei tyhjien solujen nollausta. |
| Puuttuva tai kattavuudeltaan vajaa kokonaispolyoli | `polyols_total = null`, syy `AGGREGATE_COVERAGE_NOT_ESTABLISHED`. |
| Täydellinen paneeli / kokonaismäärä | Hyväksyttävissä vasta nimetyn polyolijoukon ja tietuekohtaisen kattavuusnäytön perusteella. Tässä ei hyväksytty yhtään yleistä total-nollaa. |

Proximates-taulukon esitystarkkuus on myös eri asia kuin epävarmuuden biologinen raja. Omenan F000095 erotus on 0,3 mutta ilmoitettu sorbitoli 0,2; sienen F005946 erotus on 1,2 mutta mannitoli 1,3. Näitä 0,1:n eroja ei nimetä osoitetuiksi laskentavirheiksi: yhden desimaalin pyöristysvälit voivat sopia yhteen ja havaintojen menetelmät/taustat voivat erota. Lajiarvoa ei vaihdeta automaattisesti parierotuksen tilalle.

## 4. Osoitetut numeeriset ongelmat

### 4.1 Sokeriton tumma suklaa F009837: kaksi vanhaa, jo pidätettyä pakettia

Virallinen tietue raportoi without 4,1 ja with 32,1 g/100 g. Erotus on **28**, mutta ilmoitetut erytritoli 3,8 + maltitoli 28 + ksylitoli 3,6 summautuvat **35,4 g/100 g**. Tunnetun osasumman ero vanhaan kokonaispolyoliväitteeseen on 7,4 g/100 g. Tämä ero säilyy suurena myös yhden desimaalin esityksen pyöristyskokeessa. Muut lajit ovat puuttuvia; 35,4:ää ei hyväksytä täydelliseksi kokonaismääräksi.

Vanhoilla määrillä pelkkä tunnetun osasumman aliarvio vastaa:

| Historiallinen laskelma | Suklaa / annokset | Kokonais-CHO:n nimellinen aliarvio tästä syystä |
| --- | --- | ---: |
| keto-mutakakku | 150 g / 8 | 1,3875 g/annos |
| keto-suklaakeksit | 60 g / 10 | 0,444 g/annos |

Nämä ovat lähdemallin laskennallisia eroja, eivät reseptin todellisen biologisen virheen rajoja. Molemmat paketit on jo vedetty näkyvistä. Tämä tutkimus ei palauta niitä, vaihda puuttuvaa polyolia nollaksi eikä yleistä sokerittoman suklaan keskiarvoa kaikkiin tuotteisiin.

### 4.2 With-arvo on merkitty without-arvoksi kolmessa rekisterikopiossa

| Native-ID / paikallinen kopio | Rekisterissä A | Virallinen without | Nykyinen käyttö |
| --- | ---: | ---: | --- |
| F006573 / `afcd-F006573-release-3` | 8,0 | 7,7 | Ricotta-persikkakulhon julkaistu GK-input |
| F007619 / `afcd-F007619-release-3`, GK-versio | 7,0 | 6,9 | Pellava-puuron pidätetty GK-input |
| F002384 / `afcd-F002384-release-3` | 5,0 | 2,8 | Ei enää käytössä uudessa mainissa; vanha siskonmakkarakeiton GK-riippuvuus poistui PR #179:ssä |

Kaikissa näissä kopioissa määritelmä on `EU_AVAILABLE`, joten moottori käyttää lukua jo polyolit pois sulkevana. Oikea korjaus on valita oikea lähdekenttä; kaikkien AFCD-arvojen polyolivähennys aiheuttaisi uusia virheitä.

**Sama paikallinen tunniste ei yksilöi samaa normalisointia.** Vadelman F007619 makrolaskentakopiot sisältävät oikein 6,9, mutta GK-rekisterikopio 7,0. Siemengranolan ja runebergintorttujen makroissa ei osoitettu tästä virhettä. Viiden tapauksen muistissa tehdyssä tarkistuksessa niiden kaikki neljä lukua säilyivät. Versiot erotetaan CSV:ssä normalisointiarvoista muodostetulla `variant_id`:llä; pelkkä ID-join olisi tuottanut väärän hälytyksen.

### 4.3 GK-vaikutus vain todellisesta A-riippuvuudesta

Ricotta-persikkakulhossa 150 g persikkaa / 2 annosta ja nykyinen GI 51 antavat korjauksen:

`(8,0 − 7,7) × 150 / 100 / 2 × 51 / 100 = 0,11475 GK/annos`.

Koko pistearvio muuttuisi **4,0836 → 3,96885**, sisäinen kahden desimaalin arvo **4,08 → 3,97**. Nykyinen karkea näyttö pysyisi **noin 4** ja matala luokka säilyisi. Julkinen sivu tarkistettiin erikseen; sen näyttö on noin 4, ei 4,08. Lähdematch, GI ja reseptiversio säilytettiin laskentakokeessa. Oikea muutos tarvitsee uudet evidenssisidokset ja hyväksynnän.

Pellava-puuron vadelmaosuuden GK-panoksen korjaus olisi **0,26775 → 0,263925**, eli −0,003825. Kokonais-GK pysyy puuttuvana muun lähdepuutteen takia. Uuden mainin siskonmakkarakeitto ei enää käytä virheellistä AFCD-kopiota: sama muutoskoe jätti sen GK:n 7,04:ään. Vanhan inputin muuttamista ei lasketa nykyiseksi kattavuusvoitoksi.

## 5. Vaikutus kaikkiin ravintotekijöihin

[recipe-dependencies.csv](recipe-dependencies.csv) sisältää lähde-ID:n, resepti-ID:n, kanavan, skenaarion, ainesosarivin, normalisointiversion, massakertoimen, käytössä/ohitettu-tilan ja lähtötiedoston. Siinä ei toisteta lähdearvoja tai evidenssiobjekteja. [recipe-effects.csv](recipe-effects.csv) sisältää 228 tarkasteluriviä: nykyiset viitteet sekä alkuperäisjoukon reseptit, joiden AFCD-riippuvuus on jo poistunut.

| Kenttä | Johtopäätös |
| --- | --- |
| Nettohiilihydraatti | Oikein without-kenttään sidotut nykyiset makroluvut säilyvät tämän lähdeongelman suhteen. Uutta numeerisesti väärää julkaistua makropakettia ei osoitettu. Tämä ei varmista reseptien muita oletuksia. |
| Kokonais-CHO = A + kuitu + P | Parierotus ei osoita täydellistä P:tä. **173 näkyvän tavallisen makropaketin** total-kentän tämä osa jää kattavuudeltaan epävarmaksi; lukuja ei tämän ajon perusteella muuteta tai peruta automaattisesti. Kaksi historiallista aliarviota on jo pidätetty. |
| Proteiini, rasva | AFCD-polyolit eivät kuulu näiden laskentayhtälöön. Niiden korjaamista ei perustella tällä löydöksellä. Määrä, lähdematch ja valmistus ovat edelleen omat riippuvuutensa. |
| GK | Without-A:n säilyessä polyolien uudelleennimeäminen ei muuta aritmetiikkaa. Poikkeuksena on osoitettu väärä A-kenttä: yksi julkaistu ja yksi jo pidätetty input. Tässä ei ole tarvetta muuttaa GI:tä tai toleransseja. |
| Hyväksyntätilat ja hashit | Metadata-/normalisointimuutos voi vanhentaa hyväksynnän vaikka lukuarvo säilyisi. Se on porttivaikutus, ei uusi numeerinen virhe. Suljettuja fingerprint-paketteja ei kirjoiteta uusiksi. |

Kolme suljettua source-accounting-mallia, jauheliha-kaalikeitto, VHH-kaalilaatikko ja uunikanapasta, on erotettu tavallisista paketeista. Niissä puuttuvan kokonaispolyolin käsittely on reseptikohtaisesti rajattu ja hyväksytty. Niitä ei nimetä yleiseksi kokonaispolyolinäytöksi, niiden numeroita ei yleistetä eikä hyväksyntää siirretä.

Nykyisten 175 tavallisen makroinputin joukossa **173:n kokonaispolyolikattavuus jää epävarmaksi ja kaksi on jo withdrawn**. Alkuperäisessä 172:n joukossa oli 170 näkyvää ja kaksi withdrawn-pakettia; myöhemmät reseptimuutokset ja kahdeksan eri sanamuodolla löytynyttä tapausta selittävät joukon muutoksen. Tämä on puuttuvan näytön luokitus, ei 173 todistetun väärän lukeman laskuri.

## 6. Yksi yhteinen normalisointiratkaisu

Ehdotus `AFCD-CHO-POLYOL-v1`, omistajan päätettäväksi:

1. Säilytä raw `without`, `with` ja kuusi lajikenttää omine nolla-/puuttuvuustiloineen, source release, native-ID ja menetelmäpaikantimet.
2. Saatavan CHO:n normalisointi käyttää **without-havaintoa**, kun sen tietue-/paino-/menetelmävastaavuus on osoitettu. Polyoleja tai kuitua ei vähennetä tästä uudestaan.
3. Laske parierotus tarvittaessa tarkalla desimaaliaritmetiikalla omaksi johdetuksi havainnokseen. Nimeä se vain parierotukseksi. Älä aseta `polyolsSourceVerified=true` tai total-polyolia sen perusteella.
4. Ilmoitettujen lajien osasumma säilyy erillisenä. Kokonaissumman hyväksyntä tarvitsee nimetyn jäsenjoukon ja kattavuusnäytön. Puuttuvat lajit eivät ole nollia, ja label-/analysed-/recipe-tausta säilyy erillään havainnon tilasta.
5. A, total-CHO, P/F ja GK saavat omat riippuvuus- ja hyväksyntäpäätöksensä. Nykyisen neljän makron portin muuttaminen sovitetaan Nutrition Coreen erillisenä työnä.

Tämä ratkaisee saman tulkintaongelman yhteisesti 125 nykyisessä makrolähteessä ja 175 reseptin inputissa. **Se ei luo puuttuvaa kokonaispolyolihavaintoa** eikä vapauta niiden total-kenttiä täydellisiksi. Valkosipulin, pippurin ja muiden toistuvien lähteiden lähdearvio tehdään kerran ja viitataan joka reseptistä samaan lähdeversioon.

Pelkkä `polyolsSourceVerified=false`-massapäivitys nykyisiin lähteisiin ei ole turvallinen toteutuserä: nykyinen atominen hyväksyntä voisi pidättää samalla myös riippumattomat kentät ja laukaista suljettuja hash-estoja. Tutkimus ei myönnä lupaa tällaiseen massamuutokseen. Nykyisten hyväksyntöjen migraatio ja puuttuvuusviestintä on päätettävä ennen käyttöönottoa.

## 7. Seuraava pieni toteutuserä

**Ensimmäinen ehdotus:** kolmen virheellisen rekisterikopion kenttäsidoksen korjaus/quarantine omassa toteutus-PR:ssä, uuden mainin todellisia riippuvuuksia käyttäen. Arvio 1–2 kehitystyöpäivää tarkistuksineen, ei sitova aikataulu.

- F006573: 8,0 → 7,7; vain ricotta-persikkakulhon nykyinen GK-laskenta muuttuu. Tarkista 4,0836 → 3,96885, näyttö ja luokka, lähde-/input-hashit sekä kielikohtainen yhteinen laskelma.
- F007619: korjaa GK-rekisterikopio 7,0 → 6,9. Säilytä jo oikeat makrokopiot. Pellava-puuron HOLD jatkuu muun lähdepuutteen takia.
- F002384: korjaa tai merkitse käyttämätön kopio pois käytöstä; estä sen palaaminen inputiksi. Älä muuta siskonmakkarakeiton jo Fineliin sidottua versiota.

Tämä erä ei ratkaise koko total-polyolisemantiikkaa eikä tarvitse yleisiä toleranssimuutoksia. Seuraava erillinen päätös on edellä kuvatun yhteisen adapterisopimuksen ja komponenttikohtaisen julkaisutavan yhteensovitus [Nutrition Core #176:n](https://github.com/ozirix-dev/Reseptit/pull/176) kanssa. Ei 172 reseptin erillistä lähdetutkimusta, massauusintalaskentaa tai uusia infrastruktuuriresursseja.

## 8. Toistettavuus, tarkistukset ja säilytetyt rajat

[tools/README.md](tools/README.md) sisältää komennot. Yksi Python-työkalu rakentaa lähde- ja normalisointiverkon suoraan reseptien metatiedoista, makroinputeista, GK-inputeista, release-packeista ja kolmesta suljetusta reitistä. Lähdeperustelut säilytetään kerran native-ID:tä kohti. Pieni muistissa ajettava TypeScript-koe koskee vain kahta makrokontrollia ja kolmea GK-tapausta. Riippumaton Decimal-tarkistus vahvistaa 0,11475:n GK-eron ja kaksi suklaan aliarviota. Tulosten ja alkuperäisten syötetiedostojen eheys tarkistetaan erikseen.

Ei sivustobuildia, koko testisviittiä, ylimääräisiä GitHub Actions -ajoja tai aktiivisen laskentamoottorin ajoa julkaisevana CLI:nä. Ei resepti-, lähderekisteri-, makro-, GK-, hyväksyntä- tai Cloudflare-muutoksia. PR #180 ja muut PR:t säilyvät tämän työn ulkopuolella. Uusi PR on dokumentaatio-Draft; ei Readyä, mergeä tai deployta.

AFCD-faktojen lähde: © Food Standards Australia New Zealand, Australian Food Composition Database, Release 3. Repon lähderekisterin lisenssitieto: CC BY-SA 3.0 Australia / FSANZ Data User Licence Agreement, Australian-data-rajaus. CSV:t ovat valittujen lähdefaktojen ja tämän auditoinnin havaintojen johdannaisia; muutokset ovat tietueiden valinta, normalisointivertailu ja riippuvuuslaskenta, eivät FSANZ:n hyväksyntä. Katso [virallinen AFCD ja aineistolinkit](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/about-afcd).
