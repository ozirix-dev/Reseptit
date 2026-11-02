# GK80 Next Four — neljä hyväksyttyä A-versiota

**Toteutettu ehdokas on183/326**,alkuperäisten reseptien numeeriset156 säilyvät ja GK-only-versioita on27. Varmennettu tuotanto on edelleen **179/326 ja23 GK-only-versiota**. Neljää uutta ei ole julkaistu tämän tehtävän perusteella.

| Hyväksytty täsmäversio | Syötehash | Laskettu GK-osa/annos | Positiivinen poisjättö gCHO/annos |
| --- | --- | ---: | ---: |
| rahkapiirakka-vhh |`4194712a2cecb7979c779f4479a1f0a92bf402e190c4ff66a2369667455acbd4` |0,45 |1,736875 |
| bulgogi |`5ae159afc878044788f07f23db47c2932168760d4f8020e5ec3d9b553f7e83c1` |41,31 |0,0670125 |
| rahka-marjakerroskulho |`092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86` |2,34 |0,67 |
| kaakao-kookos-chia |`dfcb1006838f327d6dc368dbdd647180f4be3305b82518e99f88b8d25f71f8b2` |0,22 |0,9625 |

Kaikki ovat A-aritmetiikan LOW-versioita. Alle yhden tulokset käyttävät nykyistä ilmaisua ”laskettu osuus alle1”; kaakaon rajoitus ilmoittaa lisäksi välittömästi,että0,22 kattaa vain kermarivin ja poisjätetty0,9625gCHO on katettua0,725g:aa suurempi. Tämä ei ole valmiin aterian mittaustulos.

## Omistus,lähtö ja hyväksynnät

Rooli ja tämän PR-haaran ainoa kirjoittaja: **Codex Julkaisu / GK80 Next Four**. Oma worktree`D:/Projects/tmp/reseptit-gk80-next-four-approved-release`;haara`codex/gk80-next-four-approved-release`. Tarkoitettu repo`ozirix-dev/Reseptit`,origin varmennettu repo_guardilla. Integraatio ja yksi Draft-PR on valtuutettu; Ready,merge ja deploy eivät ole.

Työn lähtö-main`96a25d8c9db6fb0a505a70a37a5b357b6a83593a`. Työn aikana mainiin tuli erillinen#186:n suklaaskenaariopilotti,main nyt`554f8a414782497da89640c8e45be1ccf1580a95`. Sen13 lisättyä tiedostoa eivät muuta nykyisiä reseptejä,makroja,GI-/CHO-lähteitä tai GK-only-integraatiota. Tämä haara ei tuo niitä omana integraationaan eikä muuta niitä. Main-synkronointia ei ole tehty; mergekelpoisuus ja nyky-mainin ero tarkistetaan guardin lukevassa esitarkastuksessa ja normaalissa PR-CI:ssä.

Tutkimusaineiston täsmällinen hyväksyntäcommit`2a626c560873c0d414508522e1a1173f244f9d1c`. Hyväksyntäkatselmointi luettu PR187:n commitista`0aab0b9a11e57c6e6695dc871796c48282a6d3cf`. Sen haaraa tai työpuuta ei muutettu. Tutkimushaaran myöhempi GI-varareittitutkimus ei kuulu tähän erään.

Kolme alkuperäistä hyväksyntäkuittia on säilytetty muuttamattomina:[rahkapiirakka](../../research/afcd-polyol-03/rahkapiirakka-approval.json),[bulgogi](../../research/afcd-polyol-03/bulgogi-approval.json),[kaksi kylmää jälkiruokaa](../../research/afcd-polyol-03/cold-dessert-approval.json). Katselmoidut sisältöcommitit ovat991f94ea…,20e77b57… ja7272e71e…. Uusia lähde-/sisältöhyväksyntöjä ei luotu tai pyydetty.

## Rajattu toteutus

`gk-next-four.ts` tuo nykyiseen koontiin vain neljä tarkkaa syötehashia. Se varmentaa integroitavan paketin,kolme alkuperäistä kuittia,reseptihashit,yhteiset lähdetiedostot,natiivikentät ja nimettyjen GI-sidosten laajuuden. Laskenta käyttää nykyistä puhdasta`calculateGlycemicLoad`-moottoria ja muuttumattomia tiukkoja A-rajoja. Viereisiä tutkimuksen B-tapauksia,uutta laskentamoottoria tai GI-vakioita ei tuoda.

Syötteet ovat alkuperäiset JSON-objektit muuttamattomine syötehasheineen. Lähdekatalogit on rajattu vain näissä neljässä käytettyihin tietueisiin. Täydet historialliset hyväksyntäpaketit varmistettiin pinned-commitista ennen rajausta; alkuperäisten kuittien pakettilinkit ja kokonaisfilehashit säilyvät historiallisina lähdeviitteinä. Koko tutkimushaaraa tai PR187:n päätöspakettia ei tuotu tähän haaraan.

- **Rahkapiirakka:** erillinen MEXT05001-sidonta5,2gCHOAVL/100g. Kaksi työvihkohashia ja P435/O359-kentät säilyvät.150g kuivia paahtamattomia kokonaisia manteleita jauhetaan ja käytetään kokonaan. Hyväksyntää ei laajenneta kaupalliseen mantelijauhoon tai natto04046:n lähdehyväksyntään.0,975gCHO/annos ja0,025g marginaali näkyvät heti. Alkuperäinen2rkl Foodin säilyy myös annosskaalauksessa.
- **Bulgogi:**600g nauta,300g **kuiva** jasmiiniriisi,100g päärynä,72g soija,14g fariinisokeri ja40g kevätsipuli neljälle annokselle. Koko marinadi kypsäksi ja kaikki pannunesteet syödään. Seesamiöljyn1rkl säilyy näkyvänä lusikkamääränä. Riisi68,sakkaroosivertailu60 ja päärynä38 pysyvät nimettyinä LOW-sovelluksina.
- **Marjakulho:**50g tuoretta kanadalaista wild blueberry -marjaa; Australian koostumusproxy näkyvästi LOW. Suomalainen metsämustikka ja B2,41 eivät peri hyväksyntää.2g kuori säilyy kuorena ja4g Foodin mukana.
- **Kaakao-kookos-chia:**40g chiaa,200ml täsmällistä Koko UK -kylmäjuomaa,100ml kermaa ja20g jo paahdettua Urtekram DK1003481 -kookosta. Kaakao6g lähteen oman rkl-mitan mukaan ja vanilja punnittu5g. Valinnainen Foodin säilyy maun mukaan. Ei täysrasvaista kookosmaitovaihtoa tai B1,59-korviketta.

## Mittayksikkösopimus

Uusi valinnainen`GK_ONLY_NATIVE_UNITS_V1`-esityssopimus tuo lähteen oman määrän`quantity:{amount,unit}`,yksikkönä`ml` tai`tbsp`. Samalla rivillä`grams` on tällöin`null`. Vanhojen23 version grammapohjaiset tietueet eivät muutu eikä niille lisätä uutta sopimusmerkintää. Määrä ja yksikkö ovat esityksen johdettu tieto,ei alkuperäisen sinetöidyn laskentasyötteen uudelleentulkinta.

Annoslaskuri skaalaa grammat,millilitrat ja alkuperäiset lusikkamäärät samalla suhteella. Sekä ainesluettelo että valmistustarkennusten määrät päivittyvät. Koko-juoman200ml ja valmistajan0,4g/100ml lasketaan suoraan tilavuuspohjaiseksi positiiviseksi ylärajaksi; grammoja tai tiheyttä ei anneta. Kerman laskennassa käytetään vain hyväksyttyä Fineli631:n omaa100g/dl-mittaa; esityksessä säilyy alkuperäinen100ml. Yleistä tiheysmuunninta ei tehty.

## Makrot ja kielet

Alkuperäiset reseptit,makronumerot,evidenssit ja pidätykset säilyvät. Uuden version`macroScope` on`NO_MACRO_PACKAGE_FOR_THIS_VERSION`; vanhaa makropakettia ei peritä uudelle sisällölle. Alkuperäisen reseptin arvot on nykyisellä komponentilla merkitty erikseen sen omiksi arvoiksi.

Kaikilla neljällä on FI/EN/SV/TH-ainesnimet,valmistus ja heti näkyvät rajaukset. Neljän kielen koontisivu renderöi kaikki neljä versiota. Reseptisivuille lisätään paneeli vain olemassa olevan alkuperäiskäännöksen yhteyteen: neljä rahkapiirakkasivua ja yksi kullekin kolmelle muulle,ei keksittyjä alkuperäiskäännöksiä. Yhteensä54 nykyistä kielisivua sisältää GK-only-paneelin. Ihmisen tekemää kielikatselmointia ei väitetä.

## Varmennus ja jatko

- Neljän syötehashin,lähteiden ja kolmen hyväksyntäkuitin tarkistus: PASS.
- Itsenäinen Decimal:`python docs/nutrition/gk80-next-four/verify_decimal.py`,4 tapausta PASS,kirjoituksia0.
- Kaikki326 alkuperäistä tulosobjektia ja23 vanhaa GK-only-objektia vastaavat main-vertailua. Kuusi keskeistä lähde-/evidenssitiedostoa sekä resepti-/käännös-/makrolaskentapuut säilyvät;PR182:a ei tuotu.
-8 uutta kohdennettua testiä;kaikki283 paikallista yksikkötestiä PASS.
- TypeScript,normaali build ja721 reitin esirenderöinti PASS;27 staattista testiä ja4 Brave-selaintestiä PASS.
- Brave: kaakao4→8 annosta,400ml Koko/200ml kerma,oikeat lähderajaukset,makroerottelu ja390px vaakaylivuodottomuus. Neljä uutta paneelia myös th-koontisivulla;27 versiota yhteensä. Konsolivirheitä0.

GitHubin automaattinen CI tarkistetaan täsmälliselle lopulliselle PR-HEADille ja raportoidaan PR-kuvauksessa. Manuaalisia Actions-ajoja ei käynnistetä. Tämän Draftin jälkeen tarvitaan käyttäjän erillinen lupa Ready-siirtymään sekä täsmällisen HEADin mergeen ja julkaisuun projektin guard-menettelyllä. Aiemman lähde- ja sisältöhyväksynnän uusintaa ei tarvita. Tekniseen HOLDiin ei jäänyt yhtäkään neljästä.
