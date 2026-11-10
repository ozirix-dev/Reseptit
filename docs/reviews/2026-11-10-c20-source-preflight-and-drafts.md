# C20 – käännöserän lähdeportti (10.11.2026)

Tämä on **60 käännösluonnoksen** valmistelua, ei julkaisu eikä riippumaton ihmisen tekemä kielentarkistus. Lähdecommit on `b86a2b01ea477e9399bb1e035cbc303ebea19572`.

## Valinta
- Valittu 20 FI-reseptiä hakemistosta `reseptit/aamupalat/`, kaikille EN/SV/TH-luonnokset.
- FI-lähteiden Git blob -SHA:t pinnoitettu `meta/kaannokset/c20-translation-worklist.json`-rekisteriin. `release_authorized: false` estää vahingossa tapahtuvan julkaisemisen.
- Ennakkotarkistus: FI-lähde on julkaistu, ei geneerinen virheellinen ohje, kaikki kolme kieliversiota löytyvät, rakenne, ainesosarivit, määrät, yksiköt, annokset, ravintokentät, kuva ja valmistusvaiheiden numeeriset faktat säilyvät.
- `npm run preflight:translations:c20` ajetaan CI:ssä ennen sisältövalidointia silloin, kun käännöksiä muutetaan.
- FI-reseptit, GK80/GK100-lähdesinetit, GI/GK-arvot, ravintoarvot ja julkaisusivurekisteri jätetty koskemattomiksi.

## Lähde-HOLD-vertailun havaintoja
Seuraavia vanhoja FI-lähteitä **ei** otettu C20:een, koska lähdekokkiteksti on puutteellinen tai ristiriitainen. Nämä vaativat oman katselmoinnin ennen käännösjulkaisua:

| Resepti | Havaittu ongelma |
| --- | --- |
| `lahi-ita-pistaasijogurtti` | ohjeessa geneerinen kehotus kypsentää pavut ja paistaa proteiini vaikka resepti on kylmä jogurtti |
| `lahi-ita-labneh-kulho-zaatarilla` | ohje vaatii oliiviöljyä, jota ainesosaluettelossa ei ole |
| `japanilainen-miso-tofu-paksoi` | epäuskottavat 150 g misoa ja 150 g wakamea sekä geneeriset keittovaiheet |
| `korealainen-tofu-kimchi-aamiaiskulho` | geneeriset ohjeet ja 100 g seesamia 2 annokseen |
| `indonesialainen-tempeh-munakulho` | geneeriset ohjeet ja 150 g sambalia 2 annokseen |
| `valimerellinen-jogurttikulho-hunajalla` | papujen ja lämpimien täytteiden valmistusohje ei kuulu kylmään jogurttikulhoon |
| `valimerellinen-ricotta-persikkakulho` | geneerinen kasvis-/proteiinikypsennys ei vastaa kylmää hedelmäkulhoa |
| `valimerellinen-menemen-fetalla` | yleiset pavun/lihan kypsennysvaiheet eivät perustu annettuihin aineksiin |
| `valimerellinen-pinaatti-fetashakshuka` | geneeriset liha/papuohjeet ja ylimääräinen vesi mainitaan ilman määrää |
| `yrttituorejuusto-kinkkurullat` | annokset FI-metassa 4, mutta ohjeessa ruokaa jaetaan kahteen |

## Julkaisun stop-portit
1. Näistä 60 luonnoksesta ei nosteta yhtään `published`-tilaan ennen erillistä AI-merkityskatselmointia, semanttisia lähde- ja käännös-SHA-evidenssejä sekä mahdollisten lähde-HOLDien ratkaisua.
2. Hyväksyttyihin GI/GK-lähteisiin tai ravintoarvoihin ei tehdä muutoksia käännösjulkaisun vuoksi.
3. Julkaisu-PR muodostetaan vasta tarkasta, tämänhetkisestä `main`-haarasta ja varmennetaan yhdellä CI-ajolla sekä main-Pages-deploylla.
4. Erillinen live-sivujen 3–5 reitin HTTP-smoke-otanta kirjataan raporttiin, ei väitetä tehtyä ennen tarkistusta.
