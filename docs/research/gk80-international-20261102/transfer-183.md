# GK80 · tutkimustulosten luovutus ja julkaisujono

Tarkistettu main `12cce31acaa1fcaf4516440b58a1f5c30390fdea`. [Julkisella sivulla](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/) on 183 eri numeerista reseptitunnistetta, joista 156 pohjalaskelmasta ja 27 GK-only-versioista. Nimittäjä 326, tavoite 261 ja vajaus 78. Sivulla näkyi yhteensä 325 riviä.

## Ensin kolme hyväksyttyä täsmäversiota

[Codex2:n hyväksyntäkuitti, a75f984](https://github.com/ozirix-dev/Reseptit/blob/a75f984/docs/research/afcd-polyol-03/current-a-cap-approval.json) sitoo päätöksen kolmeen syötehashiin. Kaikki kolme tunnistetta löytyvät julkiselta sivulta ilman numeerista GK:ta. Alla on hyväksytyn syötteen laskettu osuus. Mahdollinen integraatio, kieliversiot ja julkaisu ovat erillisiä vaiheita.

| Resepti | Laskettu GK/annos | Hyväksytty syöte, SHA-256 |
| --- | ---: | --- |
| paella-valenciana | 40,35 | `5e9c7deff4c545411210ed1c5979ff29c0c63e37c746f1cc9fcc192d11b9fa69` |
| kana-tagine-sitruunalla | 21,05 | `1d9e7a0b626d42571ef29d35a0732982e21f9b94cff8472b9b52a8a824d42c7c` |
| hernekeitto-savupotkalla | 16,22 | `ed3041f5514e3668a93361f9f5c353d38530f9a88a7db07650d2fce46fb61990` |

Paella on ainoa Codex1:n 23 tutkimustunnisteen osuma Codex2:n kolmessa tarkastetussa jono- ja päätöstiedostossa. Käytä yllä olevaa hyväksyttyä versiota. Codex1:n aikaisempi 40,01949:n paellalaskelma jää tutkimushistoriaan. Yksikään Codex1:n 23 tunnisteesta ei osu julkaistuihin numeerisiin riveihin tai [PR 187:n päätöstaulukkoon](https://github.com/ozirix-dev/Reseptit/pull/187).

## Seuraavat 14 A-laskelmaa lähde- ja sisältökatselmointiin

| Reseptit | Syötteet ja rajaukset |
| --- | --- |
| siemengranola-jogurtilla, pellava-puuro-pahkinoilla | [Punnittavat aamiaissyötteet](followup/CURRENT.md) |
| lahi-ita-pistaasijogurtti | [Pistaasijogurtti](breakfast-versions/CURRENT.md) |
| korealainen-kongjuk-soijapapu-riisipuuro | [Kongjukin vesiversio](stock-and-current-bindings/CURRENT.md) |
| falafel, okonomiyaki-kaaliletut | [Kikherne- ja kastikesidonnat](sauces-and-legumes/CURRENT.md) |
| hunaja-sinappikana-kaalilla | [Kiinteät grammamäärät](pancake-source-and-fixed-input/CURRENT.md) |
| indialainen-poha-maapahkinoilla | [Poha](poha-and-main179/CURRENT.md) |
| pav-bhaji | [Nimetty maustesovellus](spices-and-native-miso/CURRENT.md) |
| vhh-omenapiirakka, vhh-raparperipiirakka, vhh-mustikkapiirakka | [Omena ja raparperi](almond-reuse-and-oman/CURRENT.md), [mustikka](blueberry-and-defined-brine/CURRENT.md). Sama MEXT 05001 -koostumusratkaisu, reseptikohtaiset syötteet. |
| uunimakkara-sipulipedilla | [Nimetty tuoteversio](sausage-named-version/CURRENT.md) |
| lindstrominpihvit-kaalilla | [Erikseen määritelty liemiversio](blueberry-and-defined-brine/CURRENT.md). Sisältöpäätös, koska alkuperäisen liemen koostumus on yhä avoin. |

## Kahdeksan B-skenaariota lähdevastaavuuden ratkaisuun

- [Samosa](almond-reuse-and-oman/CURRENT.md). Täytteen ja paistotavan vastaavuus.
- [Aloo paratha, intialainen aloo paratha ja kevätsipulipannukakku](paratha-component-routes/CURRENT.md). Erilliset valmistetut komponentit ja taikinavastineet.
- [Bánh bao](steamed-buns-source-control/CURRENT.md). Höyrytetyn täytetyn tuotteen vastaavuus.
- [Tangyuan](tangyuan-study.md), [bánh cuốn](banh-cuon-study.md) ja [jiaozi](jiaozi-study.md). Valmistetun tuotteen mittauksista lasketut annosskenaariot. Leveät bánh cuốn- ja jiaozi-skenaariot osoittavat lähdevastineen epävarmuuden.

## Vaikutus ja käsittelyjärjestys

1. Luovuta kolme hyväksyttyä syötettä julkaisijan tekniseen tarkistukseen. Mahdollinen kattavuus **186/326**, vajaus 75.
2. Katselmoi yhdessä kolmen mantelipiirakan lähdeperuste. Tee sisältöpäätös kullekin punnitulle reseptiversiolle erikseen.
3. Katselmoi 11 muuta A-laskelmaa ja kirjaa tarkka syöte päätöksen yhteyteen. Jos myös kaikki 14 A-laskelmaa hyväksytään ja julkaistaan, yhteensä **200/326**, vajaus 61.
4. Ratkaise kahdeksan B-tapauksen valmistusvastaavuus. Esitä noin 5–10 GK-pisteen kaista, kun laskelman tarkkuus sen sallii. Pidä muunlaiset lähdeskenaariot tutkimusaineistona.
5. Varmenna numeeriset tunnisteet julkiselta sivulta mahdollisen julkaisun jälkeen. Kaikkien tässä koottujen **25 eri tunnisteen** hyväksyntä ja julkaisu tuottaisi **208/326**, jolloin puuttuisi vielä 53. Muut työjonot ovat tämän vaikutusluvun ulkopuolella.
