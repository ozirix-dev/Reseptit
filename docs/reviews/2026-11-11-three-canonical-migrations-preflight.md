# Issue #404 – kymmenen näyttökorjauksen esiseulonta ja kaksi lähdemigraatiota

Päiväys 11.11.2026. Tämä on valmistusohjeen kanoninen siirto, EI ravinto-/GK- tai ruoan turvallisuushyväksyntä.

## Esiseulonnan todellinen lopputulos

Kymmenen SHA-lukittua julkista FI-näyttökorjausta kartoitettiin. **Kahdeksaa ei voitu siirtää kanoniseen Markdowniin** ilman lisäselvityksiä: poha, kaya-paahtoleipä, halloumi-tomaattileipä, pho ga ja mannasuurimoupma ovat GK149:n lähde-SHA-sidoksissa; poha on lisäksi EN/SV/TH-merkitystarkistusten HOLDissa. Soba-aamiaiskeitto on *GK100 first-five* -hyväksyntäpaketissa, jonka reseptilähteen koko SHA-sidos estää muutoksen. Labneh tarvitsee erillisen `cooking_method`- ja ravinto/GK-katselmoinnin. Manakish tarvitsee jogurttipannuleivän ja perinteisen hiivalla kohotetun ruokalajin identiteetin katselmoinnin.

## Lähdemigraatiot, kaksi valmistusohjetta

| Kortti | Resepti | Valmistus | Jäljellä avoimena |
| --- | --- | --- | --- |
| B21 #31 | kiinalainen-jianbing-munaletty | Vesi-vehnäjauhotaikina, munien ja sesamin paistaminen sekä soijapaputahna | Tuotekohtainen soijapaputahna, kokonaisravintoarvot, GK |
| A #32 | kiinalainen-katkarapu-wontonkeitto | Katkaravun käsittely, wontonnyyttien täyttö ja sulkeminen sekä kypsennys liemessä | Katkarapu-/taikinatuotteen ravintoarvot ja riippumaton turvallisuusvarmennus |

Aiemmin PR #421:n ja #407:n tarkistettuja julkisia näyttötekstejä käytettiin **täsmälleen** kanonisissa FI-tiedostoissa. Kumpaankaan ei lisätty ainesmääriä, annoksia, `cooking_method`-muutosta, makrolukuja eikä uutta GI/GK-arvoa. Menetelmäprojektori `material21-methods-public-display.ts` suojaa edelleen sobaa lähde-SHA:lla; wontonin projektori on yhteensopivuusadapteri, joka palauttaa jo korjatun lähteen.

Historiatesti `site/tests/issue404-three-canonical-history.ts` hyväksyy ainoastaan kahden uuden reseptitiedoston täsmä-Git-blob-SHA:n, varmistaa koko valmistusosion edeltävän lähdeosan muuttumattomuuden ja rekonstruoi vanhan lähteen vain jäädytettyyn GK-/makrohistorian vertailuun. Tuntematon muutos epäonnistuu eikä historiallista laskentaa kirjoiteta uusiksi.

## Mitä pilotista opittiin?

Käytössä ollut ennakkotarkistin #436 tunnisti GK149:n ja julkaistut kieliparit, **muttei GK100:n neljän hyväksyntäpaketin lähde-ID:itä**. Ensimmäinen CI pysähtyi virheeseen `GK100_RELEASE_CANDIDATE_CHANGED`, ja lähderiippuvuus jäljitettiin `docs/nutrition/gk100-approved-releases/first-five.json` -paketin soba-aamiaiskeittoon. Soba palautettiin alkuperäiseen lähdetiedostoon, joten hyväksyttyä GK100-bundlea ei muuteta. **Ennakkotarkistinta tulee laajentaa GK100-paketteihin ennen seuraavaa suurta erää.**

Issue #404:n tekninen tavoite vasta CI-hyväksytyn yhdistämisen jälkeen: **21 karanteenia + 8 SHA-lukittua FI-näyttökorjausta + 9 kanonista FI-menetelmää = 38**. Tämä on työvaihejako, ei 38 lopullista ravinto-/GK-hyväksyntää.

**Draft / DO NOT MERGE** ennen täsmä-HEAD CI PASSia. Ei uutta käännöstä, Cloudflare-julkaisua tai karanteenista vapautusta.
