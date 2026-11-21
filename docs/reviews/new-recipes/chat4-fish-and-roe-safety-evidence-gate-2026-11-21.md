# Chat-4 – graavisiian ja muikunmädin todistettava turvallisuusportti

Päiväys: 2026-11-21
Työn omistaja: Chat 4
PR #805
Päätös: **SAFETY_HOLD** molemmille resepteille, kunnes alla olevat todelliset ehdot voidaan tarkistaa.

## Viranomaisperusta

- Ruokaviraston jäädytysvaatimus: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/tuote--ja-toimialakohtaiset-vaatimukset/kalat-ja-kalastustuotteet/jaadytysvaatimus/
- Ruokaviraston 1.7.2026 voimaan tullut kalastustuoteohje: https://www.ruokavirasto.fi/elintarvikkeet/oppaat/kalastustuoteohje/kalastustuoteohje/
- Ruokaviraston listeriaohje: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/ruokamyrkytykset/ruokamyrkytyksia-aiheuttavia-bakteereja/listeria/
- Ruokaviraston kalatuotteiden säilytys: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/mikrobiologiset-vaarat-ja-muut-riskit/

Loisriskin hallintaa varten tavanomaiset jäädytyskäsittelyvaihtoehdot ovat **−20 °C tai kylmempi vähintään 24 h** tai **−35 °C tai kylmempi vähintään 15 h**; vaihtoehtoisesti vähintään 96 h −18 °C:ssa säilytetty tuote ei tarvitse erillistä käsittelyä. Aika koskee tuotteen asianmukaisesti saavutettua lämpötilaa, ei automaattista oletusta kotipakastimen näytöstä. Jäädytys voi olla tehty jo valmistajalla tai sen raaka-aineen toimittajalla. Vapautus jäädytysvaatimuksesta on mahdollinen vain viranomaisohjeessa yksilöidyillä perusteilla ja dokumentoidusti. **Siikaa tai muikunmätiä ei pidä olettaa vapautetuksi pelkän nimen perusteella.** Pakastus tai suolaus ei poista listeriaa.

## `graavisiika-tillilla` – hyväksyntäehdot

1. Tunnista valittu siikafilee ja toimittaja, laji, alkuperä ja mahdollinen tuotetunnus; merkitse tarkistuspäivä ja lähde.
2. Varmista luotettavasti nimenomaisen kalatuotteen raakakäyttökelpoisuus. Kirjaa valmistajan/toimittajan tieto tehdystä loisriskin jäädytyskäsittelystä **tai** perusteltu, dokumentoitu laillinen vapautus. Pelkkä 'tuore' tai 'laadukas' ei riitä.
3. Sido kylmäketju, viimeinen käyttöpäivä ja käsittelyohje tuotteeseen; kylmäsäilytys mielellään 0–3 °C.
4. Säilytä varoitus, ettei graavisuolattu kuumentamaton kala sovi sellaisenaan listerian riskiryhmille. Ei markkinoida riskittömänä.
5. Tarkista käytetty kala ja reseptin 24 tunnin graavaus osana valmistusohjetta; graavaus ei korvaa loisriskin hallintaa.

## `muikunmati-rieskarullat` – hyväksyntäehdot

1. Tunnista syöntivalmis muikunmäti, valmistaja/toimittaja ja mahdollinen erä-/tuotetunnus.
2. Tarkista tuotteen käsittelyohjeista tai valmistajalta, että loisriskin vaatima jäädytyskäsittely on tehty tai että oikeudellinen vapautus voidaan osoittaa. Älä päättele tätä pelkästä valmismerkinnästä tai kuvasta.
3. Tarkista säilytys 0–3 °C mahdollisuuksien mukaan, viimeinen käyttöpäivä, avaamisen jälkeinen aika ja käyttö kylmässä tarjottavassa annoksessa.
4. Säilytä riskiryhmiä koskeva listeriavaroitus. Jäädytys ei tuhoa listeriaa; riskiryhmälle turvallisempi vaihtoehto on riittävästi kuumennettu kalatuote, mutta se ei ole sama kylmä mätiresepti.
5. Tarkista, että 140 g mädin, 180 g tuorejuuston ja 90 g smetanan suhde sekä rieskojen pinta-ala ovat valmistusteknisesti realistisia.

## Näytön tilakentät

| Kenttä | Siika | Muikunmäti |
| --- | --- | --- |
| Tuote ja valmistaja | PUUTTUU | PUUTTUU |
| Raakakäyttö / syöntivalmius | TODENTAMATTA | TODENTAMATTA |
| Loisriskin käsittelyn todiste tai poikkeus | PUUTTUU | PUUTTUU |
| Lämpötila, käyttöaika ja pakkausohje | PUUTTUU | PUUTTUU |
| Riskiryhmien listeriavaroitus reseptissä | TEHTY | TEHTY |
| Nelikielinen kriittinen varoitus | TARKISTETTU CHAT-4 | TARKISTETTU CHAT-4 |
| Julkaisupäätös | HOLD | HOLD |

**Todistuksia ei saa keksiä eikä tulkita yleisestä Ruokaviraston sivusta yksittäisen kalatuotteen todistukseksi.** Tuotekohtaiset tiedot saadaan todellisesta pakkauksesta tai valmistajan/toimittajan dokumentaatiosta. Julkaisuportti voidaan tämän jälkeen arvioida uudelleen SHA-pinnatulla reseptiversiolla.

## Vaihtoehto, jos tuotekohtaista näyttöä ei saada

Pidä nämä kaksi reseptiä julkaisusta erillään. Suunnittele erilliset kypsennettyä siikaa tai muuta kypsennettyä kalaa käyttävät reseptit omilla `recipe_id`-tunnuksillaan. Älä muuta graavisiian tai muikunmädin tunnusta hiljaisesti toiseksi ruokalajiksi. Kahdeksan muuta riippumatonta alkuruokaa voivat jatkaa omia hyväksyntäporttejaan ilman, että kaksi HOLD-reseptiä estävät koko erän.
