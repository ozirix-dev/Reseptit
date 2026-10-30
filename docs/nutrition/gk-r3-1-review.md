# GK 2.1 R3.1 – riippumattoman katselmoinnin korjaukset

Tila: **REVIEW FIXUP – DRAFT ONLY / CONDITIONAL GO** tutkimusaineistolle.
Päivä 2026-10-30. Ei julkaisuhyväksyntää. R4, R5 ja R6 ovat alla vain suunnitelmia.

## Katselmoinnin lähtökohta ja luokkien tulkinta

Päärepo on ozirix-dev/Reseptit, työpuu D:/Projects/tmp/reseptit-gk-2-1-r3,
haara codex/gk-2-1-r3. Lähtö-main on
e8da2c9417e2aeff55a85d599b3b7e1ad465f36c ja katselmoitu R3-HEAD
1d7dc77f15de34e92607b979484504b9834e162c.
[R3 #134](https://github.com/ozirix-dev/Reseptit/pull/134) säilyy Draftina.
[R3:n riippumaton kommentti](https://github.com/ozirix-dev/Reseptit/pull/134#pullrequestreview-5711068770)
luettiin kokonaan ennen korjauksia. Review 5711068770 on COMMENTED, ei APPROVED.
Kuuden kohdan käsittely ja kommentin hash ovat [päätöstietueessa](gk-r3-1-review.json).

Alkuperäinen R3 määritteli B:n nimetyn kokonaisen ainesosaskenaarion arvioksi,
ei nykyisen julkaisutekstin kaikkien tulkintojen varmentamiseksi. Siksi
**0 A / 14 B / 8 C / 2 D säilyy tällä rajatulla määritelmällä**: kahdessa B:ssä
on nyt nimenomainen valmistustekstin korjausportti, 12 B:ssä ei ole näitä kahta
tekstiristiriitaa. Riippumattomasti julkaisuvalmiita on nolla.
57,01 ja 48,22 ovat edelleen ehdollisia kokonaisarvioita täsmennetyille
skenaarioille. Ne eivät osoita nykyisten ristiriitaisten ohjeiden yksikäsitteisyyttä
tai todellista syötyä ravintomäärää. Jos nimetty ainesosaskenaario kumoutuu,
B on laskettava uudelleen tai siirrettävä C/D:ksi; tavoiteluku ei ohjaa päätöstä.

## Serabi: vahvistunut ristiriita ja ehdotettu korjaus

Alkuperäiset vaiheet 1–3 kuvaavat yleistä ohutta pannukakkua; vaihe 4 aloittaa
sekoituksen, levon ja paiston uudelleen pienenä paksuna kookospannukakkuna.
Vaihe 4 on reseptikohtaisin ja R3:n valitseman skenaarion peruste.
Tämä on perusteltu tulkinta, ei itsenäisesti varmennettu tekijän tarkoitus.

Laskenta käyttää kaikkia kuutta ainesriviä kerran: 100 g riisijauhoa,
20 g kuivattua kookosta, 150 ml rasvaista kookosmaitoa, 30 g fariinisokeria,
yhteensä 1 rkl eli laskennassa 13,5 g öljyä ja suolaa; kaksi annosta.
Tässä yhden erän koko syötteen säilymisoletuksessa CHO/proteiini/rasva/kuitu
ovat **57,01 / 6,08 / 29,98 / 6,55 g/annos**.
Päällekkäinen taikina tai lisäöljy muuttaisi kaikkia tarpeellisia välilaskelmia,
mutta määrää ei tiedetä eikä toista summaa keksitä. Pannuun jäävä rasva vaikuttaa
etenkin rasva-arvioon. Ohut/paksu paisto ei yksin todista syödyn annoksen
samoja makroja. R3:n laskelma on syötelaskelma, ei mitattu paistosaanto.

Ehdotettu kaikkien neljän nykyisen vaiheen korvaava teksti seuraavaan PR:ään:

1. Sekoita riisijauho, kookosmaito, kookoshiutaleet ja suola tasaiseksi taikinaksi. Anna taikinan levätä 10 minuuttia.
2. Paista taikina pieninä paksuina pannukakkuina öljytyssä pannussa miedolla lämmöllä molemmin puolin kypsäksi. Käytä koko erään yhteensä reseptin 1 rkl öljyä.
3. Jaa kaikki fariinisokeri pannukakkujen päälle ja kuumenna miedolla lämmöllä, kunnes sokeri sulaa. Jaa koko erä kahdeksi annokseksi.

Ennen julkaisua hyväksytään yksieräinen tulkinta, lähdetuotteiden vastaavuus ja
öljyn koko erän määrä. Keittiötarkistus varmistaa taikinan toimivuuden,
kypsyyden sekä nykyisen 25 minuutin ajan. Jos ainesmääriä korjataan, neljä makroa
lasketaan uudelleen. Julkaistua tekstiä ei muutettu R3.1:ssä.

## Thai-kookosriisi: vahvistunut ristiriita ja ehdotettu korjaus

Vaihe 1 esikypsentää riisin pakkauksen ohjeella ja mainitsee tofun/kananmunan;
vaiheet 2–3 lisäävät yleisiä kasvis-, yrtti- ja kastikeohjeita.
Vaihe 4 aloittaa raa'an riisin huuhtelusta ja kookosmaitoon imeyttämisestä.
Myös nykyinen valmistustapa ”paistaminen” vaatii korjauksen.

R3:n nimetty vaiheeseen 4 perustuva skenaario on **100 g kuivaa raakaa valkoista
riisiä, 200 ml rasvaista säilykekookosmaitoa, 150 g kuorittua ja kivetöntä
mangon hedelmälihaa sekä 6 g kuorittuja seesaminsiemeniä**, kaksi annosta.
Nämä tarkenteet puuttuvat osin nykyisestä tekstistä ja lisätään vasta R4:ssä.
Kookosjuoma ei ole vastaava tuote. Tuote- ja valmistusvastaavuus hyväksytään
erikseen; ainesosat eivät yksin todista yhtä ainoaa alkuperäistä tarkoitusta.

Koko syötteen säilymisoletuksella CHO/proteiini/rasva/kuitu on
**48,22 / 5,97 / 17,95 / 1,71 g/annos**. Huuhtelun poistamaa tärkkelystä ei
ole mitattu. Imeytys ei sisällä keitinveden poiskaatamista; veden haihtuminen
muuttaa massaa/tiheyttä, ei itsessään annoserän ravintoainesyötettä.
Esikeittäminen ja valutus, 100 g kypsää riisiä tai lisäproteiini vaativat uuden
kokonaislaskelman. Huuhteluun ei keksitä säilymiskerrointa.

Ehdotettu kaikkien neljän nykyisen vaiheen korvaava teksti seuraavaan PR:ään:

1. Huuhtele 100 g kuivaa riisiä ja valuta huuhteluvesi.
2. Laita riisi, 200 ml kookosmaitoa ja suola kattilaan. Kuumenna kiehuvaksi ja kypsennä miedolla lämmöllä kannen alla, kunnes neste on imeytynyt ja riisi on pehmeää.
3. Leikkaa 150 g kuorittua, kivetöntä mangon hedelmälihaa paloiksi. Jaa koko riisierä kahteen annokseen ja tarjoa kaiken mangon sekä seesaminsiementen kanssa.

R4:n hyväksymisehtoihin kuuluvat kuiva-/syötävä paino ja ainesosatarkenteet,
valmistustavan skeeman mukainen keittäminen/hauduttaminen sekä keittiötarkistus
100 g riisin / 200 ml kookosmaidon toimivuudelle ja 25 minuutin ajalle.
Jos vettä tarvitaan lisää, määrä mitataan ja kirjataan; R3.1 ei keksi vesimäärää.
Huuhteluhävikki jää ilmoitetuksi epävarmuudeksi, ei VERIFIED_TOTAL-väitteeksi.

## Kookosmaito: lähdetarkkuus ja neljän makron herkkyys

Fineli 29014:n paikallisen hyväksytyn release 20 -tietueen DL-annos on 100 g.
Se on kyseisen edustavan elintarviketietueen annosmitta, ei kaikkien tuotteiden
fysikaalinen tiheys eikä yhden tuotemerkin mitattu pakkausarvo.
Serabin 150 ml → 150 g on tämän lähteen laskentaoletus.

[AFCD F002991:n alkuperäinen API-tietue](https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/api/foods/F002991)
antaa rasvaiselle säilykekookosmaidolle specific gravity 1,02.
Se kuvaa edustavaa koostumustietuetta (kahdeksan eri tuotemerkin näytteiden
yhdistelmä), ei tarkkaa valittua tuotemerkkiä. API:n 100 ml -esitys ja paikallisen
koostumusaineiston 100 g -esitys erotetaan; 200 ml → 204 g kuuluu tähän
tietueeseen. Lähdeyksikkövirhettä ei löytynyt.

[FSANZ:n yleinen tiheysohje, PDF](https://www.foodstandards.gov.au/sites/default/files/2023-12/npc-specific-gravities.pdf)
antaa kookosmaidolle 1,01 (PDF:n toinen sivu). Ensimmäinen sivu rajaa luvut
ohjeellisiksi ja kuvaa koostumuksen/lämpötilan vaikutusta. Tämä ei kumoa
tarkemman AFCD-tietueen 1,02:ta. HTML-sivu palautti suorassa haussa 403;
alkuperäinen PDF ja AFCD API avautuivat. Vastauksien SHA-256:t ovat
[lähderaportin R3.1-osassa](gk-r3-source-evidence.json).

Alla vain tiheyttä vaihdetaan: koostumus ja kaikki muut rivit pysyvät samoina.
Arvot ovat CHO / proteiini / rasva / kuitu, g/annos.

| Resepti | g/ml | Erän kookosmaidon massa | Makrot |
| --- | ---: | ---: | --- |
| Serabi, säilytetty Fineli-oletus | 1,00 | 150 g | 57,01 / 6,08 / 29,98 / 6,55 |
| Serabi, yleisen viitteen herkkyys | 1,01 | 151,5 g | 57,03 / 6,10 / 30,14 / 6,59 |
| Serabi, 1,02-herkkyys | 1,02 | 153 g | 57,05 / 6,11 / 30,30 / 6,63 |
| Thai, 1,00-herkkyys | 1,00 | 200 g | 48,19 / 5,94 / 17,64 / 1,71 |
| Thai, yleisen viitteen herkkyys | 1,01 | 202 g | 48,20 / 5,95 / 17,80 / 1,71 |
| Thai, säilytetty AFCD-oletus | 1,02 | 204 g | 48,22 / 5,97 / 17,95 / 1,71 |

Serabin 1,00 → 1,02 kasvattaa pyöristämättömiä makroja
0,04215 / 0,03030 / 0,31995 / 0,077175 g/annos.
Thain 1,02 → 1,01 vähentää niitä 0,017 / 0,014 / 0,154 / 0 g/annos.
Tiheysherkkyys ei ole tilastollinen epävarmuusväli eikä rajaa kaikkien tuotteiden
koostumusvaihtelua tai todellista hävikkiä. Jos myöhempi tuotemittaus tai
lähdeyksikkö osoittaa ristiriidan, kyseinen muutos merkitään BLOCKED-tilaan
sovittamiseen asti; aktiivisia lukuja ei vaihdeta hiljaa.

## Nykyisten 83 arvojen kohdennettu havainto

Alkuperäinen seula oli metadataa ja laskennallisia lippuja. Se erottelee nyt
tallennetun GI-tunnisteen, nollahiilihydraatin käyttämättömän metadatan ja
todellisen numeerisen GI-osuuden. [Kohdennettu aineisto](gk-r3-1-targeted-screen.json)
sisältää kaikki poikkeamarivit, yhdeksän valmistusmuodon jatkokohdetta,
yhdeksän nollatapausta ja muistissa tehdyt herkkyyskokeet.

| Resepti / aines | Todettu havainto | GK nyt → muistissa ilman sidosta |
| --- | --- | --- |
| kiinalainen-tomaattimunakas-riisilla / öljy | Aktiiviseen syötteeseen tallennettu väärä vihannes-GI, CHO 0; malli ohittaa GI:n | 28,07 → 28,07 |
| lahi-ita-kikhernejauho-yrttilettu / öljy | Sama väärä metadata, CHO 0 | 7,42 → 7,42 |
| poronkaristys-kukkakaalimuusilla / mustapippuri | Mauste saa vihannesryhmän GI 66:n; 0,0965 g CHO/annos ja 0,06369 GK-osuus | 3,09 → 3,03 |

Mustapippurin englanninkielinen ”Pepper, black, ground” läpäisee nykyisen
väljän pepper-nimivastaavuuden. Tämä on todellinen ruokaperhevirhe.
Öljyn sidos on myös todellinen metadatavirhe; väite sen numeerisesta GI 66
-vaikutuksesta olisi väärä hälytys. Kolmas CHO 0 -sidos on pinaatti:
sen vihannesperhe ei ole väärä vain siksi, että tietueen CHO on nolla.

166 tallennettua sidosta käytiin kohdennetusti läpi; 139 numeerista
ruokaryhmäriviä kuuluu 68 reseptiin. Rajatut koneelliset tunnistesäännöt
osoittavat kolme varmaa perhevirhettä, eivät kaikkien muiden tieteellistä
kelvollisuutta. Yhdeksän jatkokohdetta koskee riisijauhoa, perunatärkkelystä,
kikhernejauhoa, soijajalosteita ja mantelijauhoa; ne eivät kaikki ole todettuja
väärän ruokaperheen sidoksia.

83 LOW, 68 ruokaryhmää, 47 valmistuslippua ja yhdeksän GK 0 -tapausta säilyvät.
47 lippua ei tarkoita 47 virhettä. Nollatapaukset eivät johdu pyöristämisestä:
niissä kaikki tunnettu positiivinen CHO on pois jätetty. Täsmälliset määrät ja
reseptit ovat JSON-aineistossa. Näytettävä nolla edellyttää R5:ssä omaa ratkaisua.
Aktiiviset 326 tulosta ja kaikki nykyiset syötteet säilyvät R3.1:ssä ennallaan.

[Yhtenäinen GI-politiikkaehdotus](gk-r3-1-gi-policy.md) esittää samat portit
uusille ja vanhoille. Sen mekaaninen määrällinen portti jättäisi 21 nykyistä
arvoa, nollan esitysraja 12. Tämä on yläraja ennen lähdehyväksyntää, ei
tuotannon muutos, kaikkien ryhmäarvojen poistopäätös tai hyväksytty kattavuus.

## R2-yhteensopivuus ja julkaisujärjestys

R2:n 020b665582f4f1ec54e56ec978581e424adc6ace sisältää 10 määräkorjausta,
yhden koostumuskorjauksen ja 20 GI-poistoa: 31 kenttämuutosta 30 rivillä.
Baozin yhdellä rivillä on kaksi muutosta. Preflight tarkistaa aineiston ja
83 vanhaa tulosta sekä 24 mutaatiokoetta. R3.1 tarkistaa lisäksi viiden
ravintolaskennan ja kolmen yhteisen koostumusaineiston olevan samoja R2:ssa.
Luettelo ja tarkat R4-polut ovat [päätöstietueessa](gk-r3-1-review.json).

R2 ei muuta viiden kohteen resepti- tai ravintolaskentatiedostoja. Tomaatin ja
Yangzhoun R3-skenaarioissa R2:n korjatut määrät on jo huomioitu: niitä ei lisätä
kahdesti. R2:n integrointi ei muuta näitä viittä R3-makroehdotusta.
Bulgogin, baozin ja kosharin pidätetyt kokoravintoarvoehdotukset jäävät erilleen;
niitä ei ole siirretty aktiivisiin laskentoihin tai R4:n viiden joukkoon.

Viiden kohteen aktiivisissa GK-syötteissä on 14 suoraa R2-riippuvuutta:
tomaatilla kaksi määräkorjausta ja kolme GI-poistoa, Yangzhoulla kaksi ja yksi,
moussakalla kuusi GI-poistoa. Serabilla ja thai-kookosriisillä niitä ei ole.
R2:n ainoa koostumuskorjaus ei koske näitä viittä.

Suositus: R3.1:n riippumaton katselmointi → R2:n oma hyväksyntä ja erikseen
valtuutettu integrointi → R4 tuoreesta mainista lähde-/sidospinnit uudelleen
tarkistaen. Ilman R2-mergeä voi valmistella R4:ää, mutta julkaisu vaatii
14 oleellisen muutoksen itsenäisen katselmoinnin ja nimenomaisen sisällyttämisen
tai perustellun korvaavan ratkaisun sekä yhteensovituksen R2:n kanssa.
Riippuvuuksien ohittaminen ei ole hyväksyttävä julkaisutapa.
R3.1 ei cherry-pickkaa, yhdistä tai muuta R2:n PR:iä.

## R4 – viiden reseptin rajattu toteutussuunnitelma

Makrot järjestyksessä CHO / proteiini / rasva / kuitu, g/annos.
Vanha sarake tarkoittaa nykyisen ravintolaskennan julkaistua pyöristystä;
uusi on R3:n ehdollinen tutkimusskenaario, ei R3.1:ssä tehty muutos.

| Kohde | Nykyinen | Ehdollinen R3 |
| --- | --- | --- |
| Tomaatti-kananmuna-wokki | 38,93 / 12,98 / 16,58 / 1,70 | 39,03 / 13,03 / 16,58 / 1,70 |
| Yangzhou-paistettu riisi | 39,01 / 21,18 / 11,11 / 1,36 | 39,16 / 21,26 / 11,01 / 1,36 |
| Kreikkalainen moussaka | 32,22 / 27,59 / 35,19 / 5,42 | 32,25 / 27,60 / 35,20 / 5,48 |
| Serabi | 57,30 / 5,93 / 28,70 / 6,24 | 57,01 / 6,08 / 29,98 / 6,55 |
| Thai-kookosriisi | 48,05 / 5,83 / 16,41 / 1,71 | 48,22 / 5,97 / 17,95 / 1,71 |

R4 koskee viittä docs/nutrition/calculations-JSONia ja viittä FI-reseptiä.
Kolmella ensimmäisellä on nykyiset EN/SV/TH-versiot (yhteensä yhdeksän);
ne päivitetään samasta hyväksytystä laskennasta ja tarkistetaan kielellisesti.
Serabilla ja thai-kookosriisillä ei nykyisessä puussa ole näitä kieliversioita.
19 olemassa olevan polun tarkka lista on päätöstietueessa; uusia käännöksiä ei
luoda huomaamatta tämän korjauserän sivutyönä.

Ensimmäisten kolmen reseptitekstiin viedään vain hyväksytyn laskennan
aines-, annos- ja makrotarkenteet; vältetään tarpeetonta valmistusmuutosta.
Serabin ja thain teksti korvataan yllä ehdotetulla, ensin keittiössä tarkistetulla
valmistuksella. Kaikkien viiden lähderivit, syötävä massa, tuotevastaavuus,
säilymisoletus ja pyöristys hyväksytään erikseen; pienikään delta ei korvaa näyttöä.
R4 ei saa luvata uusia GK-arvoja ravintolaskennan korjaamisen sivutuotteena.

R4:n hyväksymisehdot: riippumaton lähde- ja sisältökatselmointi, R2-riippuvuuksien
ratkaisu, kaksi tekstikorjausta ja keittiöehdot, laskentadeltat sekä FI/EN/SV/TH
ristivertailu. Aja strict nutrition, GK, kattavuus, molemmat testisarjat,
sisältö-/käännös-/renderöintitestit ja CI täsmälliselle lopulliselle HEADille.
Nykyinen CI-polkuvalitsin valitsee kaikille viidelle todelliselle polkujoukolle
sekä nutrition- että GK-testit ja sisältötarkistuksen. R4 varmistaa tämän
uudelleen toteutuvasta diffistä. R3.1 ei muuta CI:tä.

## R5 ja R6 – erilliset jatkoajot

R5:n ensimmäinen tarkastuserä: kolme todettua väärän ruokaperheen kohdetta
ja yhdeksän GK 0 -reseptiä, yhteensä 12 eri reseptiä. Öljyn korjaus on metadataa,
pippurilla on numeerinen vaikutus; nollatapauksissa ratkaistaan esitys ja
puuttuva lähde. Seuraavaksi priorisoidaan 57 reseptin merkittävät ruokaryhmä-
CHO-lähteet ja yhdeksän valmistusmuodon jatkoriviä pieniksi eriksi.
Vanhan seulan 68 merkittävän epävarmuuden joukko sisältää myös muita analogioita,
joten se ei ole sama kuin 57 merkittävän ruokaryhmän joukko.
Ehto: politiikan itsenäinen hyväksyntä, rivikohtainen lähdenäyttö, rajattu
ennen/jälkeen-vaikutus, nollan esitystestit ja lopullisen HEADin CI.

R6:n ensimmäiset lähdeselvitysehdokkaat ovat meksikolainen-quesadilla-sienilla
ja pohjoisafrikkalainen-taatelipuuro-appelsiinilla. Molemmilla on R3:n täydellinen
nimetty B-CHO-skenaario. Maissitortillan sekä mannasuurimon/taatelin
alkuperäiset GI-tutkimukset ovat jo [GI-lähderekisterissä](glycemic-index-records.json), mutta vastaavuus juuri
näiden reseptien tuotteeseen, käsittelyyn ja kypsennykseen ei ole hyväksytty.
Taatelipuuro on näistä toissijainen: rekisterin Mani 1992 -mannasuurimo on
höyrygelatinoitu maapähkinäöljyllä, eikä se kelpaa tämän vesipuuroon sellaisenaan.
Se tarvitsee uuden valmistukseltaan vastaavan lähteen; nykyistä hylättyä siirtoa
ei oteta uudelleen käyttöön. Quesadilla tutkitaan ensin, eikä kumpaakaan luvata
uudeksi GK-arvoksi.
Ehto: täydellisen CHO:n riippumaton hyväksyntä ja jokaisen merkittävän lähteen
soveltuva GI. Jos vastaavuus ei täyty, kohde jää estyneeksi; valintamäärä ei
oikeuta löysentämään sääntöä. Soba on myöhempi ehdokas vasta ainesosapuutteiden
ratkettua. R6 alkaa vasta lähdepolitiikan päätöksen ja oman valtuutuksen jälkeen.

## R3.1:n toistettavat tarkistukset

Aja site-hakemistossa content:sync sekä strict nutrition- ja GK-auditointi ennen
lukevia apuohjelmia. Kattavuusauditoinnin tulosteet pidetään ohitetussa tmp-kansiossa.
R3-tarkistin vertaa koko 326 tuloksen versiokiinnitettyä auditointitulosta.
Lisäksi suojataan kaikki 369 reseptipuussa, 361 kieliversiopuussa ja
180 ravintolaskentapuussa olevaa Git-tiedostoa LF-kanonisoiduilla SHA-256-koosteilla.
Tämä sisältää muutkin kuin julkaistut reseptit. 57 aiempaa lähdepinniä säilyy.

Lukevat tarkistimet ovat tools/gk_r3_verify.py, tools/gk-r3-r2-preflight.mts
ja tools/gk_r3_1_review.mts --verify. Viimeinen toistaa kohdennetun seulonnan,
muistissa tehdyt vaikutuskokeet ja R4:n polkuvalinnan; se ei muuta aktiivista dataa.
Lisäksi ajetaan test:nutrition, test:glycemic, JSON-/linkki-/UTF-8-tarkistukset,
Markdownlint ja git diff --check. Toteutuneet tulokset ja lopullisen HEADin
CI kirjataan saman ReportHub-raportin R3.1-lisäykseen.

Alkuperäisen R3-CI:n erilliset nutrition/GK-askeleet olivat SKIPPED, mutta
Unit tests -askeleen npm test sisälsi kummankin sarjan testit. Siksi väite,
että ne ajettiin vain paikallisesti, olisi liian vahva. Tämän johtopäätöksen
tueksi tarkistettiin ajon 40988970417 lokin todellinen testikomento.
