# GK80 – kolme käytettyä arviointireittiä ja karkea vaihteluväliesitys

Käyttäjän jatko-ohjeen mukaan valittiin kolme parasta lähdeperusteista reittiä ja käytettiin niitä eristetyssä tutkimuksessa. Esimerkin5–10 tulkinta on karkea, tarvittaessa noin5 GK-yksikön askelin esitettävä arvio. Alkuperäinen julkaisukielto säilyy: **mainia, tuotantosääntöjä, GI-rekisteriä tai Codex2:n tiedostoja ei muutettu**.

Julkaistu kattavuus on edelleen **179/326 (54,9 %)**, tavoitteeseen261 puuttuu **82**. Tutkimuksen alku oli156/326. Tämä paketti lisää kaksi täyttä A-tutkimusversiota ja yhden erillisen, lähdevastaavuutta odottavan B-skenaarion. Julkaistuja lisäyksiä0.

## Valitut kolme tapaa ja toteutettu käyttö

| Tapa | Sovellus | Tulos ja raja |
| --- | --- | --- |
| **1. Lähdevastaava aineslaskenta ja natiivi saatava hiilihydraatti** | Omena- ja raparperipiirakka,150 g itse jauhettua kokonaista mantelia /8 annosta | Lasketut GK-osat1,4955 ja1,33125. MEXT-koostumuslähde käytettiin uudelleen; ei uutta mantelin GI:tä |
| **2. Ihmisillä mitattu valmis ruoka vastineena kokonaiselle valmistetulle yksikölle** | Peruna-hernetäytteinen uppopaistettu samosa,kaikki11 ainesriviä kerran | Omanin ihmis-GI60,4 antaa nykyisiin päämääriin sidotun lähdeskenaarion44,460742–44,611742. Karkea esitys **40–45**, ehdollinen lähdevastaavuudelle |
| **3. Julkaistu ryhmäimputointi vain nimetyille aineille** | Samat kaksi piirakkaa: eläinperäinen maustamaton rahka30 ja raparperin kasviskoodaus40 | Lasketut GK-osat1,47675 ja0,85625. Nämä ovat julkaistun koodausmenetelmän uusia rajattuja sovelluksia, eivät mitattuja GI-arvoja |

Menetelmien1 ja3 piirakkaskenaariot voidaan esittää karkeasti **”laskettu GK-arvio alle5/annos”**. Menetelmät eroavat lähdekoodauksessa, joten niiden ero ei ole tilastollinen luottamusväli. Positiiviset poisjätöt ja tuotteen/valmistuksen epävarmuus kuuluvat edelleen näkyviin. Samosan40–45 on ulospäin pyöristetty **lähdeskenaario**, ei todiste siitä, että jokaisen tämän nimisen ruoan todellinen GK olisi tuolla välillä.

[Valinta ja hylätyt vaihtoehdot](three-method-selection.json) sisältää lähdehierarkian. [Olendzki2006](https://pmc.ncbi.nlm.nih.gov/articles/PMC1989668/) kuvaa valmistusta ja koostumusta huomioivaa lähivastineiden valintaa sekä sekaruokien purkamista. [Atkinson2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2584181/) antaa kasvis40- ja maito30-koodauksen. [Dodd2011](https://pubmed.ncbi.nlm.nih.gov/21831990/) osoittaa, ettei ainesarvojen laskennallinen yhdistäminen takaa samaa tulosta kuin aterian mittaus. Siksi ei lisätty yleistä fysiologista korjauskerrointa.

AI:n yksin ennustamaa lukua, in-vitro-GI:n nimeämistä ihmis-GI:ksi tai puuttuvien tietojen nollaamista ei valittu. Kirjallisuuden yksittäistä GI0-koodausta ei omaksuttu. Jauhoille tai manteleille ei annettu yleistä GI70:tä tai GI50:tä.

## Kaksi uutta manteliversiota

Codex2:n jo tutkima **MEXT05001**, kuiva paahtamaton kokonainen manteli, antaa massasumman5,2 g/100 g. Sokeriekvivalentti5,5, erotuslaskettu11,5 ja tuntemattomat polyolit ovat eri kenttiä. [Virallinen natiivitaulukko](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=5_05001_7&MODE=7) vastaa uudelleenkäytettyä tietuetta. Kahden työkirjan täsmäys varmentaa saman julkaistun tietueen, ei kahta riippumatonta koostumuskoetta.

Nimetyissä versioissa150 g manteleita punnitaan ennen hienoksi jauhamista; kuoria, rasvaa tai seulontajaetta ei poisteta ja koko jauho käytetään. Tämä ei määritä nimettömän kaupallisen mantelijauhon koostumusta. Jauhamisen häviötön massansäilytys ja lähdepopulaatio ovat sovelluksen epävarmuuksia. Mantelin osuus0,975 g/annos alittaa1 g-rajan vain0,025 grammalla. Natiivi5,2 on lähdepiste, ei kaikkien mantelierien analysoitu yläraja. AFCD-mantelijauhon5,4 antaisi1,0125 ja jää edelleen HOLDiin.

| Versio | Valmistus-/määrätäsmennykset | GK-osa,tapa1 | Positiiviset poisjätöt g/annos |
| --- | --- | ---: | ---: |
| [vhh-omenapiirakka](vhh-omenapiirakka.json) |150 g kokonaisia manteleita; kahdesta pienestä GrannySmith-omenasta punnittu200 g syötävää kuorineen; kaneli2,55 g, sitruunamehu15 g;8 annosta |1,4955|1,18390625|
| [vhh-raparperipiirakka](vhh-raparperipiirakka.json) |150 g kokonaisia manteleita; alkuperäinen raparperi250 g ja rahka150 g; vaniljauute punnittu5 g; psyllium1 rkl lähdemitalla7,5 g;8 annosta |1,33125|1,73125|

Omenan200 g on uuden version punnittu määrä, ei todistettu100 g/pieni omena -muunnos. Kanelin0,51 g/ml ja psylliumkuoren0,5 g/ml tulevat samoista AUSNUT2023-elintarviketunnisteista. Munien55 g/kpl ja sitruunamehun15 g/rkl ovat Finelin omia mittoja. Foodinin puhtaan erytritolin alkuperäiset lusikkamäärät säilyvät: mallin0 g massasentinel ei poista makeutusainetta, vaan käytettävissä oleva hiilihydraatti on lähteen100CHO−100varmennettua polyolia=0. Makroja ei lasketa sentinelistä.

Raparperille säilytettiin Fineli338:n natiivi **5,5 g/100 g** ja VEGFRESH-luokka. AFCD:n raakavarren1,7 löydettiin, mutta pienempää pistettä ei vaihdettu tilalle poisjättörajan vuoksi. Tapa1 käyttää näkyvästi laajaa kasvisryhmän66-analogiaa; tapa3 erillistä julkaistua40-koodausta. Kumpikaan ei ole mitattu raparperi- tai piirakka-GI. Viiden gramman vaniljalle käytetään koko massan fysikaalista CHO-ylärajaa0,625 g/annos; tl=5 g tiheysväitettä ei tehdä.

**Täsmällisten versioiden, MEXT-sidonnan ja GI-sovellusten hyväksyntää ei väitetä.** Uudet laskelmat ovat Codex2:n käyttöön tarjottavaa tutkimusaineistoa. Lähdetutkimusta ei tehty päällekkäin: MEXT-kortti jäädytettiin Codex2:n jo laatimasta tietueesta ja sille annetaan lähdecredit.

## Samosa: uusi lähde ja rajattu valmistetun ruoan skenaario

[Ali2022:n alkuperäistaulukko](https://iscientific.org/wp-content/uploads/2022/08/13-ijcbs-22-21-13.pdf), PDF-sivu5 / painettu116, erottaa samosan **ihmis-GI60,4±3,5** ja laboratorion ennusteen69,2±3,5. Table2:n hajonnan lajia ei tunnisteta SEM:ksi tai SD:ksi. Osallistujia12; ihmisprotokolla viittaa saman ryhmän vuoden2020 työhön. Riippumatonta toista koehenkilöjoukkoa ei varmistettu, eikä60,35/60,4-lukuja keskiarvoisteta.

PDF-sivu3 kuvaa uppopaistetun peruna-hernetäytteen, mutta myös muita aineksia ja tuntemattomia suhteita. [Lähdekortti](oman-human-source-card.json) kirjaa valmistuksen, koko alkuperäisprotokollan puutteen ja DOI-resolverin404-tilan. Koko ihmisprotokollaa tai lähteen paistolämpöä ei varmennettu: skenaario ei ole julkaisuvalmis.

[Täydellinen11 rivin samosasovellus](samosa-prepared-source-scenario.json) säilyttää300 g vehnäjauhoa,400 g perunaa ja100 g hernettä. Mausteille on uuden version punnitut2 g juustokuminansiemeniä,1 g garam masalaa ja1 g chiliä. Garam masalan hiilihydraatti jää fysikaaliselle välille0–1 g/erä. Nolla on vain tuntemattoman koostumuksen matemaattisen alarajan päätepiste, ei sille annettu koostumusarvo. Koko valmistetun komponentin hiilihydraattiväli kerrotaan kerranGI60,4:llä; samojen aineiden GI:tä ei lisätä toistamiseen. Raakajauholle ei anneta samosan GI:tä.

## Vaihteluvälin näyttösääntö ja kokonaisvaikutus

Lähde-/malliskenaarion alaraja pyöristetään alaspäin ja yläraja ylöspäin5:n askeliin. Esimerkiksi44,46–44,61 →40–45. Pienelle arviolle voidaan käyttää ”alle5”. Lähdeskenaariota ei nimetä95 % luottamusväliksi eikä SEM:iä käytetä reseptin vaihteluvälinä. Jos perusteltu epävarmuus on yli10 yksikköä, sitä ei kavenneta keinotekoisesti. Tuntemattoman valmistusvastaavuuden rajausta ei korjata pelkällä pyöristyksellä.

Omia täysiä A-tutkimusversioita on nyt **12**: aiemmat10 ja kaksi piirakkaa. Lisäksi on **1 erillinen ehdollinen samosan B-skenaario**. Imputointiprofiilit ovat samojen piirakkareseptien vaihtoehtoja, eivät kaksi uutta reseptiä. Julkaistu179, muualla hyväksytty mutta julkaisematon rahkapiirakka1 ja omat12 olisivat myöhemmän hyväksynnän/julkaisun jälkeen192/326. Myös samosan porttien ratketessa määrä voisi olla193/326, jolloin puuttuisi68. Nämä ovat ehdollisia vaikutuslukuja, eivät valmis erä tai tämänhetkinen kattavuus.

Seuraavat tehokkaat toimet:

1. Tarkistetaan viisi aiempaa lähteistettyä nykyisten määrien versiota; tämä on lyhin oma reitti lisäarvoihin.
2. Tarkistetaan kahden piirakan täsmälliset lähde-/valmistusversiot ja pieni mantelirajan marginaali.
3. Haetaan samosan ihmisprotokollan täysi teksti ja ratkaistaan vastinereseptin suhde-/paistoero.
4. Muualla hyväksytty rahkapiirakka etenee oman työnsä julkaisutarkistuksessa; sitä ei lasketa uutena omana löytönä.
5. Laajennetaan kolmea reittiä vastaaviin valmistusperheisiin vasta lähdeporttien täytyttyä. Jauhojen yleistä oletusarvoa ei oteta käyttöön.

[Malli](model-results.json), [imputointiprofiilien todellinen moottoriajo](imputation-model-results.json), [Decimal-varmennus](verify_decimal.py) ja [kolmen reitin erillinen varmennus](verify_three_methods.py) läpäisivät. Yhdeksän negatiivista kontrollia suojaa puuttuvia lähteitä, mantelirajaa ja tuntematonta makeutusainetta. Samosan11 riviä ja ulospäin pyöristys tarkistettiin erikseen. Ei raskasta CI:tä tai julkaisua.
