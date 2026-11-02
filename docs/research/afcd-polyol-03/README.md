# AFCD-POLYOL-03 / GK80: yhteinen menetelmä- ja lähderatkaisu

## Nykytila erottelun jälkeen

**PR183:n Ready-sisältö on16 hyväksyttyä GK-versiota, HEAD`d98d77f`. Kuusi muuta hyväksyttyä A-versiota ovat lukitussa erillisessä haarassa`codex/gk80-six-a-isolated`, HEAD`80f4360`.22 hyväksyttyä versiota ei tarkoita22 versiota PR183:ssa eikä22 julkaistua lisäystä.**

| Näkymä | Numeerisia /326 | Ero tavoitteeseen261 |
| --- | ---: | ---: |
| Viimeksi varmennettu main/tuotanto |156 (47,85%) |105 |
| Codex1:n PR183:n16 version julkaisuehdokas |172 (52,76%) |89 |
| Molemmat erät joskus erikseen katselmoitu, integroitu ja julkaistu |178 (54,60%) |83 |

Yhteisessä33 reseptin laskenta-aineistossa22 versiolla on menetelmä- tai sisältöhyväksyntä eri vaiheissa:16 integraatiossa ja6 erillään.11 reseptiltä puuttuu hyväksytty versio; niistä6 pysyy valmistetun ruoan lähde-HOLDissa.30 lähdekelpoisen julkaisuehdokkaan tavoitetta ei ole osoitettu. Uuden B-poisjättöprofiilin ja hernekeiton tutkimusmallin tila säilyy tutkimuksena.

[Nykytilakirjaus](current-state.json) ja [33 reseptin nykyinen päätösmatriisi](current-decision-matrix.csv) ovat vaiheiden ensisijaiset yhteenvedot. Aiemmat`summary.json`,`joint-*`-tiedostot ja [integraatiokuitti](integration-receipt.json) ovat historiallisia tilannekuvia. Niiden alkuperäisiä hyväksyntä-, laskenta- tai hash-kenttiä ei muutettu; nykytilaksi tulkinta on merkitty vanhentuneeksi ja ohjattu tähän uuteen kirjaukseen.

**Codex2:n kirjoitusrajaus:** vain`D:/Projects/tmp/reseptit-afcd-polyol-03-gk80-handoff` ja`codex/afcd-polyol-03-gk80-handoff`. PR183:n`codex/gk80-operation149-v2` kuuluu Codex1:lle. Kuuden version säilytyshaaraa ei muokata. Lähdetyö luovutetaan jatkossa omana versionlukittuna pakettinaan; ei Readyä, mergeä tai deployta.

Uudet projektisäännöt löytyivät mainiin PR184:llä yhdistetyistä [AGENTS.md](../../../AGENTS.md)- ja [rinnakkaisajo-ohjeista](../../rinnakkaiset-codex-ajot.md), commit`061f817`. Ne tuotiin tähän omaan työpuuhun täsmälleen samansisältöisinä. Pelkkää repo_guardin PASSia ei käsitellä haaran kirjoituslukkona. PR182 jää erilliseksi Draftiksi ja sen koko lähdetiedoston hash-/regressioriippuvuus on edelleen avoin.

## Rajatun jatkotutkimuksen tulos

[Uusi lähde- ja menetelmämuistio](followup-source-report.md) tutkii neljän nykyisen reseptin tuoteperusteisia poisjättörajoja sekä yhteistä vehnänuudelireittiä kahdelle muulle reseptille. Uusia lähdekelpoisia kokonaisia numeerisia GK-tuloksia syntyi0. Tuotetietojen ylärajat eivät ratkaise mison, kimchin tai tamarinditahnan koko reseptiriippuvuutta alkuperäisillä määrillä. Varmennetut nuudelien ihmis-GI-havainnot46 ja62 ovat erillisiä ruokahavaintoja, eivät hyväksytty yleinen vaihteluväli. Niitä ei asennettu GI-rekisteriin. Seuraava itsenäinen erä on DanDanin ja Lanzhoun yksi yhteinen kuivan nuudelin valmistus-/koostumuspaketti sekä sen erilliset kastike- ja liemiesteet.33:n yhteinen laskentaehdotusmäärä ja tuotantokattavuus eivät muutu.

## Historiallisten kirjausten lukuohje

Alla säilytetään aiemmat tapahtuma- ja tutkimustilannekuvat. Ilmaisut ”nyt”, ”nykyinen” ja ”Draft” kuvaavat kyseisen kirjaushetken tilaa. Väliaikainen22-version integraatio palautettiin myöhemmin16-version sisältöön; vanhoja kuitteja ei käytetä nykytilan osoituksena.

## Historiallinen tilannekuva: tilapäinen22-version integraatio

**Kuusi A-versiota on nyt omistajan nimenomaisella hyväksynnällä integroitu samaan julkaisemattomaan PR183:een, HEAD`80f4360435b978d1cfa81088df1414430a88c222`. Hyväksyttyjä versioita on22 ja Draftin ehdokaskattavuus178/326=54,60%; tuotanto156/326.80% rajaan261 puuttuu tästä ehdokastilasta83.** [Integraatiokuitti](integration-receipt.json) sitoo päätöksen kuuteen tarkkaan syötteeseen ja erilliseen hyväksyntäkirjaukseen. [Ajantasainen pääraportti](https://github.com/ozirix-dev/Reseptit/blob/80f4360435b978d1cfa81088df1414430a88c222/docs/nutrition/gk80-operation149/README.md) on integraatiohaarassa.

Alla oleva tutkimusraportti sekä`joint-*`-koontitiedostot säilyttävät hyväksyntää edeltäneen c559be5-tilannekuvan. Niiden16 hyväksyttyä täydentyy kuitin kuudella valitulla versiolla; vaihtoehtoinen syöterivi ei peri hyväksyntää. Nykyisestä33 reseptin koonnista11 jää ilman hyväksyttyä versiota, mukaan lukien kuusi lähde-HOLDia.30 käyttökelpoisen julkaisuehdokkaan tavoitetta ei ole osoitettu. B-poisjättöprofiili ja hernekeiton tutkimusmalli eivät aktivoidu. Ei julkaisua, Readyä, mergeä tai deployta.

**Rinnakkainen GitHub-tilamuutos:** PR siirrettiin toisessa chatissa Readyksi2026-11-02T15:58:26Z vanhan16-version HEADin`c559be5` hyväksynnällä. Nykyinen`80f4360` sisältää22 versiota eikä peri vanhan HEADin katselmointia. Tämä ajo ei tehnyt Readya, mergeä tai deployta. Integraatiohaaran README kuvaa valmistelun sisältöä; ajantasainen GitHub-tila tarkistettiin erikseen ja on kuitissa.

## Hyväksyntää edeltänyt tutkimusraportti


## Päätös

**Käytetään yhtä yhteistä GK-only-putkea: ensin varmennettu natiivi saatava hiilihydraatti, sitten nimetty ainesosa tai valmistettu kokonaisuus GI-lähteen käyttöalan mukaan.** Valmistetun ruoan pilotti on jo [Draft PR #183:ssa](https://github.com/ozirix-dev/Reseptit/pull/183). Sen toteutusta ei kopioida toiseen haaraan. Tässä luovutuksessa sitä täydennetään MEXT-lähdeadapterilla sekä yhteisellä reseptitunnusten ja menetelmäpäätösten koonnilla.

Uusia GI-vakioita tai yleistä aterian vasteen alennuskerrointa ei lisätty. Kaikki uudet käyttöönotot koskevat eristettyä valmistelua. Aktiivinen moottori, reseptit, makrot ja tuotannon GK-luvut säilyvät ennallaan.

## Yhteiset luvut ilman kaksoislaskentaa

[joint-proposal-index.csv](joint-proposal-index.csv) yhdistää #183:n commitin `c559be5855b86e4b89b8f780df51a6298612ec6f` 30 ehdotusta tämän luovutuksen 22 ehdotukseen. Yhteisiä reseptitunnuksia on 19: alkuperäiset 16 sekä kahvijogurtti, rahkakulho ja hojicha-kulho. **Yhteensä on 33 uniikkia laskennallista ehdokasta.** Niistä16 on menetelmä- ja sisältöhyväksyttyjä.17 muuta jakautuvat kuuteen tunnettuun lähde-HOLDiin ja11 muuhun avoimeen katselmointiin. Vaikka kaikki tunnetun HOLD-ryhmän ulkopuoliset27 ehdotusta osoittautuisivat kelvollisiksi,30:n erästä puuttuisi kolme.

**30:n raja ylittyy laskennallisten ehdotusten määrässä. Tämä laskenta ei vielä todista30 lähdekelpoista julkaisuvalmista arvoa.** Omistajan hyväksyntä ei korvaa puuttuvaa lähde- tai valmistusvastaavuutta. Vain hyväksytyn julkaisusopimuksen täyttävät ja oikeasti julkaistut arvot kasvattavat todellista kattavuutta.

| Tila | Numeerinen kattavuus |
| --- | ---: |
| Main / tuotannon lähtötila |156/326 =47,85 % |
| #183:n16 hyväksytyn erillisen version Draft-integraatio |172/326 =52,76 % |
| Kaikkien33 lähdekelpoisuus osoitettu, versiot hyväksytty, integroitu ja julkaistu |189/326 =57,98 % |
| Lopullinen vähintään80 % tavoite |261/326 =80,06 % |

189 on ehdollinen suunnitteluluku. Senkin jälkeen puuttuisi 72; nykyisestä lähtötilasta puuttuu105. Tällä ajolla julkaistuja uusia lukuja on 0. [joint-proposal-summary.json](joint-proposal-summary.json) pitää aritmetiikan, lähdekelpoisuuden ja julkaisuvaltuuden erillään.

## Kolmen uuden reitin vertailu ja toteutus

[new-strategy-comparison.csv](new-strategy-comparison.csv) ja [joint-method-impact.csv](joint-method-impact.csv) antavat määrät ja reseptiriippuvuudet.

| Reitti | Todennettu laskennallinen tuotto | Päätös ja rajat |
| --- | ---: | --- |
| Valmis ruoka tai valmistettu osa yhtenä GI-yksikkönä |6 B-ehdotusta #183:ssa | Otettu yhteiseen valmisteluun olemassa olevalla pilotilla. Lähdevastaavuus arvioidaan tapauskohtaisesti. |
| Uusi kansallinen MEXT-lähdeperhe, natiivi saatavan hiilihydraatin massa |1 uusi A-aritmetiikan ehdotus kolmesta riippuvasta reseptistä | Toteutettu tässä. Lähdeperheen hyväksyntä tarvitaan; natolle ei aseteta GI:tä. |
| GI-sertifioitu riisi yksin |0 tarkastelluista8 reseptistä | Muut riippumattomat lähde-/tuote-esteet säilyvät. Low-GI-sertifikaatti ei ole täsmällinen GI55-mittaus. |

Valmistettujen kokonaisuuksien lähdesidonta tuotti eniten laskennallisia kokeita, mutta #183:n viimeisin lähdevastaavuusmatriisi pitää kaikki kuusi lähde-HOLDissa. Niiden GI-siirtoa ei voi ottaa julkaisuun ilman parempaa koostumus-/valmistusnäyttöä. Suositeltu seuraava integraatio on siksi kuuden A-version katselmointipaketti. Yhteismenetelmä palvelee biryania, baozia, pizzaa, roti jalaa, upmaa ja mannapohjaista taatelipuuroa. Jokainen ainesosa kuuluu tasan yhteen laskentayksikköön. Koko aterian GI edellyttää koko määritellyn aterian hiilihydraattimäärää; pohjan tai verkkolettukomponentin GI ei kata kastiketta tai koko lautasta. Tutkimuksen testiannos ei määrää reseptin annosta. Biryani ei siirry paellaan, Cheela farinataan tai riisi–natto-aterian GI pelkkään nattoon.

Käytin #183:n olemassa olevia suljettuja laskentatyökaluja:8 uuden valmistus-/lähdereitin ja5 lähdepalautuksen laskelmat läpäisivät niiden portit. Näistä kahdeksasta kuusi käyttää varsinaista valmistetun kokonaisuuden menetelmää; Chettinad ja kaakao-kookos-chia ovat muut kaksi lähde-/koodaussovellusta. Tämä ei varmista lähderuoan tieteellistä vastaavuutta. Erityisesti vanhaan diabetesaineistoon ja höyrytettyyn mannaan perustuva taatelipuuro on heikko sovellus. Se voi jäädä HOLDiin; sitä ei suositella ensimmäiseen julkaisuintegraatioon ilman parempaa valmistusnäyttöä.

## MEXTin toteutettu uusi lähderatkaisu

[mext-available-source.ts](mext-available-source.ts) ja [extract-mext.py](extract-mext.py) lukevat MEXTin vuoden 2023 taulukon 27.3.2026 korjatun version. [Virallinen aineisto ja määritelmät](https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html) erottavat saatavan hiilihydraatin massan (CHOAVL), sokeriekvivalentin (CHOAVLM) ja erotuslaskennan. Naton 04046 massakenttä on 0,3 g/100 g sekä yleistaulukon solussa P399 että erillisen hiilihydraattitaulukon solussa O333. Erotusarvio `(4.8)` on toinen suure; näistä ei tehdä koostumuksen vaihteluväliä.

Käytetään lähteen omaa julkaistua massasummaa. Tuntematonta galaktoosia tai polyoleja ei summata nollina eikä lähteen arvoa kutsuta kaikkien komponenttien erilliseksi mittaukseksi. Makroja ei hyväksytä tämän perusteella. Natiivin julkaistun massasumman käyttö ja uuden lähdeperheen kelpuutus ovat erillisiä lähdepoliittisia päätöksiä.

**Natto-riisikulho: GK ≈25,34/annos.** Alkuperäiset 150 g nattoa,100 g riisiä ja kaksi munaa säilyvät. Natolle ei anneta GI:tä: sen lähdemallin saatavaa hiilihydraattia on 0,225 g/annos; A-poisjättö munan kanssa on 0,39 g. Tarkka versio käyttää maustamatonta kokonaista Itohiki-nattoa, tuoreena keitettyä valkoista jasmiiniriisiä ja punnittua20 g kevätsipulia. Epämääräinen ”mausteineen” tarkoittaa luettelon suolaa ja kevätsipulia. Kaupallista makeaa maustepussia ei oleteta mukaan tai nollahiilihydraattiseksi. Uusi lähdeperhe ja sisältöversio tarvitsevat hyväksynnän.

Poimija varmentaa kahden alkuperäisen työkirjan hashit ja kenttäotsikot sekä tallentaa vain kaksi lähderiviä. Kimchin06236 massakenttä on `-`, vaikka toisessa kentässä näkyy nolla: adapteri hylkää sen. Se ei vaihda puuttuvaa kenttää nollaan, estimaattiin tai sokeriekvivalenttiin. Polyolit säilyvät tuntemattomina. MEXT-lähteen nimeäminen: 日本食品標準成分表（八訂）増補2023年から引用.

## Tämän luovutuksen lisäys ja vaihtoehtoiset versiot

#183:n30:n ulkopuolelle lisätään kolme uniikkia reseptiä: natto25,34 A-aritmetiikalla/uudella lähdeperheellä, dashimaki25,16 nykyisellä A-menetelmällä ja ven pongal noin44 B-ehdotuksena. Pongalin43,49385–43,60835 on vain cashew-vertailujen ero, ei riisin ja mungin valmistuksen kokonaisepävarmuus. Keitetyn mungin havainto on heikko; koko valmistussovellus tarvitsee katselmoinnin.

Dashimakin alkuperäinen200 ml dashi sidotaan [valmistajan7 g/litra -ohjeeseen](https://www.ajinomoto.co.th/en/our-product/food-service/hon-dashi/hondashi/):1,4 g jauhetta lopullisessa200 ml liemessä. Koko jauhemassa on hiilihydraatin yläraja; soijan ja munan kanssa A-poisjättö on 1,72 g/annos. Annosmäärä tai alkuperäinen100 g riisiä ei pienene. Jasmiinilajike, tuore tarjoilu ja punnitut tuoteversiot hyväksytään erikseen.

Kolmessa yhteisessä reseptissä säilytetään vaihtoehtoiset ehdotukset yhden reseptitunnuksen alla. Kahvijogurtin10,92 on sama piste. Rahkakulhon paikallinen 2,41 B säilyttää suomalaisen metsämustikan ja esittää kanadalaisen luonnonmustikan53:n avoimena lajien välisenä analogiana; #183:n2,34 A käyttää pohjoisamerikkalaista marjaversiota. Hojichan paikallinen 8,82 A käyttää kaikki 2 g jauhettua [MUSO TLF013 -lehteä](https://muso-intl.com/wp-content/uploads/2022/01/TLF013-JAS-ORGANIC-HOJICHA-WEB.pdf), jonka EU-hiilihydraatti13,2 g/100 g on saatavan hiilihydraatin lähdemallin yläraja. #183:n8,42 B käyttää hauduketta. Suosittelen täyslehtiselle versiolle sen omaa A-lähdesidosta. Versioiden valinta ei moninkertaista kattavuutta.

Paikallisesti varmennettu joukko on 22:13 A nykyisillä lähdeperheillä,1 A-aritmetiikan/MEXT-lähdepäätöksen ehdotus ja8 B. [source-extensions/cases.jsonl](source-extensions/cases.jsonl) sisältää vain kuusi lisäsyötettä; alkuperäisten 16 tulokset ovat [16-decision-matrix.csv](16-decision-matrix.csv):ssä. [summary.json](summary.json) on paikallisen joukon tilasto; koko yhteinen33 on erillisessä koonnissa.

## Uusi B-poisjättöprofiili ja konkreettinen päätöserä

[Kuuden A-version katselmointipaketti](six-a-review.md) yksilöi lähde-, sisältö- ja syöteversiot hyväksyntää varten. Niiden ehdollinen lisäys on6, yhteensä178/326 aiemman16:n kanssa, kun erillinen julkaisu myöhemmin hyväksytään.

Uusi eristetty [B-malli nykyisillä A-poisjättörajoilla](minor-omission-review.md) vähentää GI50-mausteoletuksia: kolme vanhaa reseptiä saa vaihtoehdon ilman trace50-koodausta. Ne eivät lisää reseptimäärää. Kaakao-kookos-chia jää tässä profiilissa HOLDiin. Hernekeitto sai yhden uuden tutkimusmallin noin16, mutta sen1,9868875g poisjättö on aivan2g-rajan tuntumassa ja GI47 on keitetyn marrowfat-herneen heikko lähdeanalogia. Sitä ei lasketa yhteiseen33:een tai lähdekelpoiseksi julkaisuehdokkaaksi. Menetelmä odottaa hyväksyntää.

## Seuraava todellinen hyppy ja hyväksynnät

Ensimmäinen hyppy on 16 hyväksytyn tarkan version julkaisu,156 →172, kun erillinen julkaisuvaltuus annetaan. Seuraavaksi suosittelen kuuden A-yhteensopivan version katselmointia yhdessä: kahvijogurtti, dashimaki, täyslehtinen hojicha, pad kee mao, Chettinad ja natto. Ne voisivat nostaa luvun178:aan. MEXTin ja IFCT:n natiivien saatavan hiilihydraatin kenttien lähdekelpuutukset sekä Chettinadin tarjoilurajaus ja kaikki tarkat versiot päätetään erikseen. Tämä ei hyväksy GI-oletuksia tai julkaisemista.

B-erä käsitellään nimettyinä lähdesovelluksina. Merkittävät valmistus-, väestö-, jauho-, vesi-/rasvasuhde- ja annosperuste-erot arvioidaan ennen hyväksyntää. Lähteen SEM/SD ei ole reseptin vaihteluväli; puuttuvaa GI-vastaavuutta ei täytetä GI0–150-herkkyyskokeella. Epäkelpo lähdesovellus jää HOLDiin, vaikka aritmetiikka läpäisee.

Nykyinen 39 mallinnus- ja38 tuote-/valmistustapauksen työjono säilyy [priority77.csv](priority77.csv):ssä. Paikallisen22:n jälkeen siitä on 65 ratkaisematta; uutta rinnakkaista70 reseptin tutkimusta ei aloitettu. AFCD-polyolien yleistä tulkintaa ei tutkittu uudelleen: aiempi170 tapauksen vastakoe muutti raakalaskentaa0 kertaa. Neljää mantelijauhon GI50-tutkimusskenaariota ei lasketa yhteiseen33:een. #182:n korjausta ei kopioitu tähän haaraan eikä vanhaa makropakettia peritä uudelle versiolle.

## Tarkistus ja toistettavuus

Alkuperäiset 19 laskentatapausta ja viisi aiempaa lisätulosta säilyvät muuttumattomina. Riippumaton Decimal vahvisti kuusi lisäsyötettä; naton tarkka tulos on 25,344. Natiivi-/resepti-/GI-hashit, väärän etikettiyksikön hylkäys ja MEXTin puuttuvan kentän erotus nollasta tarkistettiin. Yhteiskoonti varmentaa #183:n sinetöidyt tiedostot, erottaa hyväksytyt ja odottavat syötteet ja laskee jokaisen reseptin kerran. Ei ylimääräistä koko sivuston buildia, testisviittiä tai manuaalista Actions-ajoa.

`extract-mext.py SOURCE_DIR EXTERNAL_OUT` poimii kaksi riviä alkuperäisistä työkirjoista. `evaluate-source-extensions.mts ROOT SHARED_SNAPSHOT SOURCE_EXTENSIONS EXTERNAL_OUT` laskee lisäsyötteet; `verify_decimal.py` tekee riippumattoman tarkistuksen. `reconcile-shared-proposals.py` yhdistää varmennetut tulokset pinned-HEADista ja tarkistaa sinetöidyt lähdehashit. Tulostiedostot syntyvät vain Gitin ulkopuoliseen scratch-hakemistoon. Täydellisiä326 tulosobjekteja tai lähdekirjoja ei kopioida reseptiriveihin. Lähteet: THL Fineli Rel20 (CC BY4.0), FSANZ AFCD Release3 (CC BY-SA3.0 Australia) ja yllä nimetty MEXT.

Julkaisupolku pysyy #183:ssa: ei uutta päällekkäistä PR:ää, Readyä, mergeä tai deployta.
