# Bibimbap – pavunitujen riittävän kuumennuksen julkinen esityskorjaus

Päiväys: 18.11.2026. Lähtörevisio `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`.
Lähdetehtävät: [#327](https://github.com/ozirix-dev/Reseptit/issues/327), [laatupilotti PR #725](https://github.com/ozirix-dev/Reseptit/pull/725).
**Tila: toteutusehdokas, ei yhdistetty eikä julkaistu.**

## Miksi

Julkaistu bibimbap suosittaa kaikilla neljällä kielellä pinaatin ja pavunitujen pikaista ryöppäämistä samassa vaiheessa. Tämä ei anna pavunitujen turvallisen kuumennuksen riittävyyttä käyttäjän arvioitavaksi. [Ruokaviraston ohjeen](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kasvikset-ja-hedelmat/huomioitavaa-itujen-kasittelyssa-ja-valmistamisessa-kotikeittiossa/) mukaan idut on turvallisinta kuumentaa ennen syömistä. Raakoihin ituihin liittyy EHEC- ja salmonellariski; kyseinen viranomaisohje ei määrää tiettyä keittoaikaa. Myös [Ruokaviraston turvallisen käytön ohje](https://www.ruokavirasto.fi/globalassets/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/turvallisenkaytonohjeet_2025.pdf) korostaa itujen kuumentamista riskiryhmissä.

## Rajattu muutos

Julkisen valmistusvaiheen 4 esitysteksti eriyttää pinaatin nopean ryöppäyksen ja **pavunitujen kunnollisen, kauttaaltaan tapahtuvan kuumentamisen kiehuvassa vedessä**. Teksti kertoo, että pelkkä nopea kastaminen ei riitä. Samat merkitykset FI/EN/SV/TH. Mitään minuuttimäärää tai kypsennyslämpötilaa ei johdeta lähteettömästi.

| Kieli | Uuden julkisen esityksen olennainen rajaus |
|---|---|
| FI | Pinaatti ryöpätään nopeasti; pavunidut kuumennetaan erikseen kiehuvassa vedessä kunnolla kauttaaltaan |
| EN | Spinach is briefly blanched; bean sprouts are cooked separately in boiling water until thoroughly heated through |
| SV | Spenat förvälls snabbt; böngroddar kokas separat tills de är ordentligt genomhetta |
| TH | ลวกผักโขมสั้น ๆ และต้มถั่วงอกแยกจนร้อนทั่วถึง ไม่ใช่แค่จุ่มน้ำเดือดเร็ว ๆ |

Toteutus `site/scripts/public-recipe-copy-r2.ts` käyttää ennestään käytössä olevaa reseptikohtaista `method`-esityskorjausta. Kanoniset reseptit ja käännökset säilyvät muuttumattomina, samoin annokset (4), 150 g pavunituja, muut raaka-aineet, ravintolaskenta, GK-tutkimushistoria ja hyväksyntätietueet. Ei karanteenin, tilan tai julkaisuluvan muutosta.

## Varmennettava täsmäversio

| Kieli | Git-blob SHA lukitulla mainilla |
|---|---|
| FI | `fdfb2435d54591c0f11551bae84b53f0afb8f729` |
| EN | `30f39be1d24cd91d240d68a48bb0a45e1ce85c4c` |
| SV | `a4b664f8057b890c140788e6324888c6bdd4a540` |
| TH | `7129e812cd21ee2507a9a8a210533be4c95f701d` |

`site/tests/bibimbap-sprouts-safety.test.ts` lukitsee kaikki neljä lähdeblobia ja varmistaa, että vain oikea vanha valmistuslause korvautuu. Testi vaatii korjatun merkityksen renderöityyn `instructionsHtml`- ja `instructionStepsHtml`-sisältöön sekä `instructionsText`-vaiheisiin; lähteiden muutos kaataa testin.

**Portit:** PR-CI (tyyppitarkistus, kohdennetut testit, build), riippumaton nelikielinen turvallisuus-/merkityskatselmointi samalla HEADilla, Repo Guard ja erillinen yhdistämis-/julkaisupäätös. CI:n onnistuminen ei yksin ole hyväksyntä. Vain julkisen esityksen muuttaminen ei muuta raakaa kielikatselmointirekisteriä; näkyvän tekstin nelikielinen sisältökatselmointi on siksi kirjattava erikseen.

## Mihin tämä ei ota kantaa

Munankeltuaisen juoksevuus, lihan kypsyys, jokaisen pavunidun tarkka lämpötila sekä koko reseptin ravintolaskennan oikeellisuus eivät ole tämän rajatun esityskorjauksen uudelleenarviointia. Aiemmat GK- ja lähdepäätökset säilyvät. Fyysistä koekeittiökoetta ei väitetä tehdyksi.
