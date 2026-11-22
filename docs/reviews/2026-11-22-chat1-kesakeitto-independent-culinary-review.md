# Chat-1: Perinteisen kesäkeiton riippumaton valmistus- ja lähdekatselmointi

**Päivä:** 22.11.2026
**Resepti:** `kesakeitto`, PR [#787](https://github.com/ozirix-dev/Reseptit/pull/787)
**Tarkistettu PR-HEAD:** `2efb29756739bd16e8fc754d48f0948d131e828b`
**Tarkistettu FI-lähde:** `reseptit/paaruoat/kesakeitto.md`, lähdetekstin SHA-256 `79b70a59c4ff3b8bd84069964b52a3b5e902664427e20c9959d9c4187ca4e3a8`
**Tarkistaja:** Chat-1, eri työistunto kuin reseptin kirjoittanut Chat-3
**Katselmoinnin rajaus:** kirjallinen riippumaton kokkikelpoisuus-, lähde- ja ruokaturvallisuusarvio. Ei valmistettu, maistettu, mitattu valmista saantoa tai analysoitu makroja.
**Tulos:** **Ei tunnistettua P0/P1-tason valmistus- tai ruokaturvallisuusongelmaa** tästä versiosidonnaisesta kirjallisesta arviosta. **Reseptin kokonaisjulkaisupäätös pysyy HOLD**, koska eri hyväksyntäportit ovat avoinna.

## Tarkistettu riippumaton valmistuslähde

- [Martat: Kesäkeitto](https://www.martat.fi/reseptit/kesakeitto/), tarkistettu 22.11.2026. Marttojen ohjeessa on 3–4 porkkanaa, yksi kukkakaali, 4–6 uutta perunaa, nippusipuli varsineen, 1 litra vettä, noin 3 dl herneitä, 4 dl kevytmaitoa, 2 rkl vehnäjauhoja sekä yrtit. Martat korostaa varhaiskasvisten lyhyttä keittoaikaa.
- Recipavon oma kuuden annoksen määräsovitus on 500 g uusia perunoita, 250 g porkkanaa, 350 g kukkakaalia, 150 g herneitä, 100 g kevätsipulia, 700 g vettä, 400 g maitoa, 20 g vehnäjauhoja, 15 g voita, 7 g suolaa ja 12 g tilliä.
- Valmistusmenetelmä on **samansukuinen, ei määriltään eikä suoritusjärjestykseltään identtinen**: peruna ja porkkana aloittavat; kukkakaali sekä sipulin vaalea osa lisätään myöhemmin; herneet ja vihreät sipuliosat lähellä loppua; vehnäjauho sekoitetaan **kylmään maitoon** ja kypsennetään hiljaa poreillen 4–5 minuuttia; tilli ja voi lisätään pois lämmöltä.
- [Ruokavirasto: Jäähdyttäminen](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/jaahdyttaminen/), päivitetty 14.7.2026: jäähdytä nopeasti ja siirrä kylmäsäilytykseen, jos ruoka ei mene heti tarjolle. FI-reseptin tähteiden nopea jäähdytysohje on oikeansuuntainen.

## Katselmointitulos, ei tekaistua koekeittiötä

| Kohde | Arvio | Tarkennus |
|---|---|---|
| Raaka-aineiden yhteensopivuus | **PASS, lähdeperusteinen** | Kaikki 11 ainesosaa ovat uskottavia tämän kesäkeittotyypin ohjeessa; maito ja vehnä mainittu allergeeneina |
| Työjärjestys | **PASS, lähdeperusteinen** | Kovemmat kasvikset ensin, herneet viimeiseksi; vehnäjauho sekoittuu ensin kylmään maitoon; 4–5 min suurustuksen kypsennys |
| Kypsennysaika | **PASS ohjeellisena arviona, ei mittauksena** | Näkyvät 7–8 + 5–7 + 2 + 4–5 min keittovaiheet tekevät yhteensä noin 18–22 min, joten `time_total_min: 40` jättää esivalmisteluun noin 18–22 min; kasviksen koko vaikuttaa |
| Liemen ja massan suhde | **P2 / dokumentoitava määräsovitus** | Martat 1 l vettä, Recipavo 700 g; yhdistettynä 400 g maitoon ja noin 1,35 kg kasviksiin tulee paksuhko keitto. Ei väitetä Marttojen mittaamaksi tai fyysisesti testatuksi |
| Annostus ja kypsyys | **P2 / ohjeellinen** | Kuusi annosta on itsenäinen arvio; haarukalla todettu perunan kypsyys ja tarpeen mukaan pieni nestelisäys ovat hyödyllisiä viimeistelytarkennuksia |
| Ruokaturvallisuus | **PASS tässä rajatussa arviossa** | Maito/vehnä oikein ilmoitettu, kuumennus ja nopea jäähdytys oikein periaatetasolla; mitään gluteeniton-väitettä ei hyväksytty |
| FI–EN/SV/TH | **Alustava tekstuaalinen PASS, muodollinen hyväksyntä avoin** | Kaikissa neljässä tiedostossa 6 annosta, 11 ainesosaa samoissa määrissä, 5 työvaihetta ja 40 min. Ei selvää P0/P1-merkityseroa. Viralliset versioihin sidotut semanttiset tiivisteet puuttuvat |
| Kuva | **PASS erillisenä havainnekuvana** | `paaruoat/kesakeitto.webp` hyväksytty ja SHA-256-lukittu Git-overlayyn PR #852:ssä; kuva ei todista reseptin fyysistä valmistamista |
| Ravintoarvot | **HOLD julkaistaville numeerisille arvoille** | Ei hyväksyttyä täyden reseptin makrolaskelmaa. Pelkkiä tunnettujen rivien osasummia ei saa julkaista kokonaisarvoina |
| GK | **Määrittämätön, ei arvattu** | Ei hyväksyttyä reseptikohtaista GK-laskentaa |

## Kevätsipulin tuotekohtainen ravintoaine-evidenssi

Tuoteselosteiden käyttö on mahdollista ilman valmistajakirjettä. Nämä ovat vaihtoehtoisia **vertailutuotteita**, eivät vahvistus juuri tämän reseptin valitusta tuotteesta.

| Tuote | EAN | Hiilihydraatti / 100 g | Proteiini | Rasva | Kuitu | Polyolit |
|---|---|---:|---:|---:|---:|---|
| [Pirkka suomalainen kevätsipuli 100 g](https://www.k-ruoka.fi/kauppa/tuote/pirkka-kevatsipuli-100g-suomi-6410405093080) | 6410405093080 | 4,8 g | 1,2 g | 0,2 g | 1,7 g | Ei ilmoitettu |
| [ÅTH kevätsipuli 100 g](https://www.k-ruoka.fi/kauppa/tuote/kevatsipuli-100g-pakattu-suomi-6408642649931) | 6408642649931 | 4,8 g | 1,2 g | 0,1 g | 1,7 g | Ei ilmoitettu |

Puuttuva polyolitieto **ei ole mitattu nolla**. Reseptin `docs/nutrition/candidates/kesakeitto-2026-11-21.json` on `HOLD_NOT_PUBLISHABLE`; siellä 100 g kevätsipuli on edelleen ravintolaskennassa ratkaisematon rivi. Tämä katselmointi **ei lisää ravintolaskelmaan** tai julkaise numeroita, koska käytettävä tuote ja muu maitoperuna-herneprofiili ovat vielä avoimia.

## Seuraava tarkasti rajattu vaihe alkuperäiselle PR:n omistajalle

1. Chat-3 tarkentaa tarvittaessa FI-ohjeessa, että kasvisten kypsyyttä arvioidaan haarukalla ja nesteen määrää voidaan hienosäätää. Kuuden annoksen, 700 g veden ja 400 g maidon ilmoitetaan olevan Recipavon oma määräsovitus, ei Marttojen testattu määrä.
2. Tee lähde-/tuotepäätös: määritelläänkö tietty maito ja kevätsipuli, vai jätetäänkö numeeriset ravintoarvot kokonaan pois dokumentoidulla perusteella. Kummassakin tapauksessa ruokavalio- ja gluteenittomuusväitteet jäävät pois ilman omaa näyttöä.
3. Vasta **viimeisteltyä FI-lähdeversiota** verrataan uudelleen EN/SV/TH:hen ja kirjataan repon edellyttämät `meta/kaannokset/codex-review-evidence.json`-hyväksynnän tiivisteet. Tämä Chat-1:n dokumentti ei esitä itsensä olevan Codexin ajama vertailu.
4. Päivitä reseptin `docs/reviews/new-recipes/kesakeitto.json` vasta todellisen katselmointinäytön perusteella. Tarvittaessa raportoi numeerinen ravinto/GK tarkoituksella puuttuvaksi. Kuvatiedoston erillinen hyväksyntä on jo toteutettu PR #852:ssä.
5. Kun yllä olevat ehdot on täytetty, uusi täsmä-HEAD, CI/Repo Guard ja julkaisuvirran erillinen hyväksyntä. **Älä yhdistä tätä lähdekatselmointia reseptin automaattiseksi julkaisuvaltuudeksi.**

**Tämä raportti on erillisen omistajan riippumaton kirjallinen lähdekatselmus, ei reseptin omistajuuden siirto eikä resepti-PR:n hyväksymisen ohitus.**
