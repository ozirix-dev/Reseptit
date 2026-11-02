# AFCD-POLYOL-03 / GK80: yhteinen menetelmä- ja lähderatkaisu

## Nykytila: PR183 julkaistu

**PR183:n16 hyväksyttyä GK-versiota on yhdistetty mainiin ja julkaistu, merge-HEAD`92dc6db`. Build ja deploy41504708914 läpäisivät. Julkaistu GK-sivu näyttää172/326 reseptiä, joilla on numeerinen GK vähintään yhdessä versiossa: A166 ja B6. Alkuperäisten ohjeiden numeerinen kattavuus säilyy156/326:ssa.** [Julkaisuhavainto](production-observation.json) sitoo nämä luvut tarkkaan HEADiin, deployhin ja julkaistun sivun sisältöhashiin. Tämä Codex2-tutkimusajo ei suorittanut julkaisua.

| Näkymä | Numeerisia /326 | Ero tavoitteeseen261 |
| --- | ---: | ---: |
| Varmennettu julkaistu kattavuus, vähintään yksi versio |172 (52,76%) |89 |
| Lisäksi kuusi lukittua hyväksyttyä versiota myöhemmin julkaistuna |178 (54,60%) |83 |
| Lisäksi hyväksytty pad see ew myöhemmin julkaistuna |179 (54,91%) |82 |
| Lisäksi hyväksytty rahkapiirakkaversio myöhemmin julkaistuna |180 (55,21%), ehdollinen |81 |

Yhteisessä36 reseptin laskenta-aineistossa24 versiolla on menetelmä- tai sisältöhyväksyntä:16 julkaistu,6 lukitussa erässä ja2 tutkimusluovutuksessa. Hyväksyttyjä mutta julkaisemattomia on8.12 reseptiltä puuttuu hyväksytty versio; niistä6 pysyy valmistetun ruoan lähde-HOLDissa ja uusi vihreän curryn skenaario yksikkö-/tuote-HOLDissa.30 lähdekelpoisen julkaisuehdokkaan tavoitetta ei ole osoitettu. Uusi B-poisjättöprofiili ja hernekeiton tutkimusmalli säilyvät tutkimuksena.

[Nykytilakirjaus](current-state.json) ja [nykyinen päätösmatriisi:36 aritmeettista ehdotusta ja34 muuta HOLD-riippuvuutta](current-decision-matrix.csv) ovat vaiheiden ensisijaiset yhteenvedot. Aiemmat`summary.json`,`joint-*`-tiedostot ja [integraatiokuitti](integration-receipt.json) ovat historiallisia tilannekuvia. Niiden alkuperäisiä hyväksyntä-, laskenta- tai hash-kenttiä ei muutettu; nykytilaksi tulkinta on merkitty vanhentuneeksi ja ohjattu tähän uuteen kirjaukseen.

**Codex2:n kirjoitusrajaus:** vain`D:/Projects/tmp/reseptit-afcd-polyol-03-gk80-handoff` ja`codex/afcd-polyol-03-gk80-handoff`. PR183:n`codex/gk80-operation149-v2` kuuluu Codex1:lle. Kuuden version säilytyshaaraa ei muokata. Lähdetyö luovutetaan jatkossa omana versionlukittuna pakettinaan; ei Readyä, mergeä tai deployta.

Uudet projektisäännöt löytyivät mainiin PR184:llä yhdistetyistä [AGENTS.md](../../../AGENTS.md)- ja [rinnakkaisajo-ohjeista](../../rinnakkaiset-codex-ajot.md), commit`061f817`. Ne tuotiin tähän omaan työpuuhun täsmälleen samansisältöisinä. Pelkkää repo_guardin PASSia ei käsitellä haaran kirjoituslukkona. PR182 jää erilliseksi Draftiksi ja sen koko lähdetiedoston hash-/regressioriippuvuus on edelleen avoin.

## Uusin yhteisen lähde-esteen jatko

[Kookosmaidon tuotesidonnan päätösraportti](coconut-product-route.md) ja [sinetöity paketti](coconut-product-route/manifest.json) tarkistavat saman28 reseptin riippuvuusjoukon. Valmistajan täsmällinen1L-tuote ilmoittaa0,8g CHO/100g: seitsemän alkuperäistä grammaperusteista kookosmaitoainesosaa läpäisee yksittäisen rajan,21 tilavuusmäärälle ei johdeta massaa. Vihreälle currylle valmistui yksi **lähde-HOLDissa** oleva A-aritmetiikan skenaario: laskettu GK-osa2,38 ja poisjätöt1,66655g/annos. AU-/UK-currytahnaversion ja Squid700ml:n todellisen g/ml-perusteen näyttö pitää ratkaista ennen omistajan käyttöönottokatselmointia. Uusia lähdekelpoisia tai julkaistuja tuloksia0; uusia GI-oletuksia0.

Yhteinen koonti on nyt36 aritmeettista ehdotusta ja34 muuta HOLD-riippuvuutta, yhteensä70 reseptiä. Hyväksyttyjä on24 ja julkaisemattomia hyväksyttyjä8; tuotanto172/326 ja näiden kahdeksan myöhemmän julkaisun suunnitteluluku180/326 säilyvät. Seitsemää ainesosarajan läpäisyä ei lasketa seitsemäksi valmiiksi GK-tulokseksi. Alla oleva natiivimantelin katselmointi on edellisen tutkimuserän tulos, jonka hyväksyntä säilyy muuttumattomana.

## Edellisen natiivilähde-erän hyväksytty tulos

[Rahkapiirakan tarkka uusi valmistusversio](native-point-followup.md) käyttää MEXT05001:n kuivan paahtamattoman mantelin natiivia CHOAVL-massasummaa5,2g/100g sekä koko150g:n jauhamista ja käyttöä. Kahdeksan annosta ja alkuperäiset grammamäärät säilyvät. Vaniljauute täsmennetään erillisen version punnituksi5g:ksi; tämä ei ole väite alkuperäisen teelusikan massasta. Nykyisen A-menetelmän laskettu GK-osa on0,45 ja positiiviset poisjätöt1,736875g CHO/annos. Mantelin oma poisjättö0,975g on vain0,025g alle yksittäisen1g-rajan: käyttäjä hyväksyi tämän rajatun lähde- ja sisältösovelluksen sekä pienen marginaalin myöhempään integraatioon: [sinetöity hyväksyntäkuitti](rahkapiirakka-approval.json). Katselmoitu991f94e-raportti ja syöte säilyvät hyväksyntää edeltävinä tilannekuvina; kuitti määrittää nykyisen hyväksynnän. Ei mantelijauhon GI50:tä, paistettujen manteleiden siirtoa tai B-poisjättöprofiilin aktivointia.

Sama uusi natiivipiste ei avaa kolmea muuta seulottua mantelileivonnaista niiden nykyisillä määrillä. Uusi aritmeettinen koonti on35 uniikkia reseptiä; hyväksyttyjä nyt24 ja tuotannossa172/326. Kaikkien kahdeksan hyväksytyn mutta julkaisemattoman version myöhempi integraatio ja julkaisu veisi ehdolliseen180/326:een (55,21%);261:een puuttuisi81. [Luovutuspaketti](native-point-followup/manifest.json) sisältää lähderivit, syötteen, vertailut ja riippumattoman Decimal-tarkistuksen.

## Laajan nuudelijatkoajon nykyinen tulos

[Yksi uusi päätösraportti](noodle-campaign-report.md) ja [luovutuspaketti](noodle-campaign/manifest.json) kattavat14 nuudelireseptin yksityiskohtaisen tarkastelun sekä viiden lähdeperheen42 reseptin riippuvuuskartan. Uusi nykyisen A-aritmetiikan mukainen versio on **pad see ew: laskettu GK-osa0,73, positiivisia GI-puutteita pois1,5733g CHO/annos**. Käyttäjä hyväksyi tarkan Yutaka- ja valutetun KoRo-tuotteen sidonnan sekä tämän sisältöversion myöhempää integraatiota varten: [sinetöity hyväksyntäkuitti](pad-see-ew-approval.json). Uusia hyväksyttyjä versioita on1 ja julkaistuja lisäyksiä0. Jäädytetyn tutkimuspaketin approval=false-kentät kuvaavat hyväksyntää edeltänyttä40cd180-tilannetta; kuitti määrittää nykyisen rajatun hyväksynnän. Aritmeettisten ehdotusten koonti on34 uniikkia reseptiä; matriisin35 muuta uutta riviä ovat HOLD-riippuvuuksia.

MEXT01050:n natiivi saatava massasumma65,0g/100g löytyi kuivaan vehnänuudeliin ja01051:n25,4 keitettyyn muotoon. Fineli120:n66,4 oli aiemmin jäänyt löytämättä, mutta RAW ei yksin varmista kuivapainoa. Dan Danin keitinvesi ja Lanzhoun siivilöity liemi sekä punnitsemattomat aromit pitävät ne HOLDissa. GI46 ja62 ovat erillisiä havaintoja; ne eivät ole hyväksytty vaihteluväli. Kookosmaidon28 riippuvuutta,25 ilman hyväksyttyä versiota, muodostavat suurimman yhteisen jatkoryhmän; osoitettu kokonainen lisätuotto tästä perheestä on0.

[Aiempi rajattu lähdemuistio](followup-source-report.md) säilyy edellisen ajon historiallisena tuloksena, ei uusimman ajon tuottona. Aiemmat hyväksynnät, lähdehashit ja suojatut julkaisu-/säilytyshaarat pysyvät ennallaan. Tämän nuudelitutkimuksen alkuperäinen156/326 oli julkaisua edeltävä tilannekuva. Nykyinen julkaistu kattavuus on172/326. Nuudeliajon ja aiempien hyväksyntöjen23 version osajoukon jälkeen ehdollinen kattavuus olisi179/326 (54,91%);261:een puuttuisi82. Uusin rahkapiirakkahyväksyntä nostaa nykyisen kokonaismäärän24:ään ja myöhemmän julkaisun suunnitteluluvun180:een.

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
