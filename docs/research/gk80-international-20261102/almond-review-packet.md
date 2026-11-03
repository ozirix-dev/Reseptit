# GK80 · kolme mantelipiirakkaa samaan lähdekatselmointiin

Katselmoi yksi yhteinen MEXT 05001 -sovellus ja kolme erillistä valmistettavaa syötettä. Nämä ovat aiemmin lasketut tutkimusversiot. [PR 192](https://github.com/ozirix-dev/Reseptit/pull/192) koskee neljää muuta reseptiä. [PR 187](https://github.com/ozirix-dev/Reseptit/pull/187) dokumentoi MEXTin rahkapiirakkasovelluksen, jonka täsmähyväksyntä ei kata näitä kolmea syötettä. Codex2:n päätösmatriisissa ei ole näitä tunnisteita.

| Resepti ja tarkka syöte | Laskettu GK-osuus / annos | Positiivinen poisjättö g / annos | Syötteen LF-SHA-256 |
| --- | ---: | ---: | --- |
| [Omenapiirakka](almond-reuse-and-oman/vhh-omenapiirakka.json) | 1,4955 | 1,18390625 | `909d45f07d6b4548c14f0b3fbe8a87e3f0ae044533ce4ab73f3bac3bcbb115d2` |
| [Raparperipiirakka](almond-reuse-and-oman/vhh-raparperipiirakka.json) | 1,33125 | 1,73125 | `07d408ef4ead966af300e705cce151f0f9cd58e951a3100187bf52578feb8b4c` |
| [Mustikkapiirakka](blueberry-and-defined-brine/blueberry-pie-proposal.json) | 1,30177875 | 1,736875 | `4c8b093cdbf484b4e5b939e98400cc1eb310b2e0f95e0b142ea30447ceb2bd0a` |

Yhteinen lähdepäätös koskee 150 g punnittuja, kuivia, paahtamattomia, kuorellisia kokonaisia manteleita, joiden koko jauhatustulos käytetään kahdeksaan annokseen. MEXTin saatavan hiilihydraatin massapohjainen 5,2 g/100 g antaa 0,975 g/annos. Raja on tiukasti alle 1 g. Syöte saavuttaa rajan jo pitoisuudella 5,3333… g/100 g tai 153,846… g punnitulla mantelimäärällä samalla lähdepisteellä. AFCD:n kaupallisen mantelijauhon 5,4 g/100 g ylittää rajan 150 g syötteellä. Täsmäpäätöksessä on hyväksyttävä, että 5,2 on edustava koostumuspiste tälle määritellylle raaka-aineelle. Se ei ole erän mitattu yläraja. [Virallinen MEXT-tietue](https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=5_05001_7&MODE=7)

Sisältöpäätökset tehdään erikseen. Omenaan sidotaan 200 g syötävää Granny Smithiä ja punnitut kaneli ja sitruunamehu. Raparperiin ja mustikkaan sidotaan punnittu 5 g vaniljauute ja sen positiivinen CHO-varaus. Mustikan laskelmassa kolme munaa ovat 165 g, yksi pohjassa ja kaksi täytteessä. Muu aineskohtainen näyttö, GI-sovellukset ja poisjätöt ovat linkitetyissä syötteissä ja [omenan ja raparperin lähdekatalogissa](almond-reuse-and-oman/source-catalog.json) sekä [mustikan lähdekatalogissa](blueberry-and-defined-brine/source-catalog.json). Mahdollinen esitystapa on ”laskettu GK-arvio alle 5 / annos”, jossa rajaus laskettuun osuuteen säilyy.

Kolmen alkuperäisen FI-reseptin tavut verrattiin mainiin `12cce31acaa1fcaf4516440b58a1f5c30390fdea`. Syötteiden LF-hashit on tarkistettu ja molemmat olemassa olevat Decimal-varmentimet ajettiin onnistuneesti. Muun kielisisällön ja tuotantointegraation tarkistus kuuluu mahdolliselle julkaisijalle.

Vaikutus **0 uutta tutkimustunnistetta ja 3 katselmoitavaa täsmäversiota**. Kolme sisältyvät jo [25 tunnisteen luovutuskoontiin](transfer-183.md). Niiden mahdollinen julkaisu yksin nostaisi 183:n 186:een. PR 192:n neljä tunnistetta ovat tästä erillisiä.
