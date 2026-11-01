# AFCD9837 — kahden ravintoarvopaketin pidätys

Omistaja hyväksyi keto-suklaakeksien ja keto-mutakakun ravintoarvopakettien
pidätyksen sekä main-pohjaisen Draftin valmistelun. Tämä ei ole julkaisulupa.
Lähtö-main: `5761afa069ea54c9d510f1cb3c1086ae7d42f998`.
Tausta: [AFCD-vaikutusauditointi, PR #161](https://github.com/ozirix-dev/Reseptit/pull/161).

Molempien reseptien neljä ravintoarvoa asetetaan puuttuviksi. Ainekset,
annosmäärä, valmistus, julkaistu reseptitila, luokitukset, ID:t ja URL:t säilyvät.
Muistiinpano kertoo ravintoarvojen olevan pidätetty lähdetarkistuksen vuoksi.
Resepteille ei löytynyt EN-, SV- tai TH-versioita. Uusia käännöksiä ei tehdä.

| Resepti | Aiempi netto / kokonais-CHO / proteiini / rasva, g/annos | Uusi näyttö | GK |
| --- | --- | --- | --- |
| keto-suklaakeksit | 1,38 / 12,63 / 4,77 / 20,03 | kaikki neljä puuttuvat | HOLD |
| keto-mutakakku | 1,52 / 19,84 / 5,78 / 25,34 | kaikki neljä puuttuvat | HOLD |

## Lähdehistoria ja tarkistuksen rajaus

`withdrawal.json` arkistoi aiemmat neljä arvoa, resepti- ja evidenssihashit,
lähtöcommitin sekä suklaan nimetyt polyolit. F009837:n kenttäpari on 28,
mutta erilliset ilmoitetut maltitoli-, erytritoli- ja ksylitolimäärät ovat
28 + 3,8 + 3,6 g/100 g. Kokonaispolyoli säilyy tuntemattomana. Tunnettua
lisäosuutta 0,444 tai 1,3875 g/annos ei julkaista korvaavana kokonais-CHO:na.

Alkuperäiset kaksi laskentatiedostoa säilytetään muuttumattomina historiallisina
todisteina. Niiden vanhaa kenttäpari = kokonaispolyoli -väitettä ei hyväksytä
nykyisen julkaistavan ravintoarvopaketin perustaksi.

Pelkkä arvojen tyhjentäminen ei riittänyt: säilytetty laskenta aiheutti neljä
arvoristiriitaa ja strict-auditoinnin esteen. Siksi `nutrition-evidence.ts`
tunnistaa vain nämä kaksi nimenomaista, täsmällisellä evidenssihashilla lukittua
pidätystä. Se tarkistaa edelleen reseptisyötteen ja mahdolliset käännökset.
Kaikkien neljän arvon on puututtava, alkuperäisen evidenssin on säilyttävä ja
sen hashin täsmättävä. Muutos palauttaa `INSUFFICIENT SOURCE DATA` eikä laske
pidätetylle paketille uusia julkaistavia arvoja. Todisteen tai reseptisyötteen
muuttuminen, osittainen arvojen palautus tai käännösristiriita pysäyttää
tarkistuksen. Todisteen puuttuminen pysäyttää myös tarkistuksen.

Tämä on rajattu tarkistustuen muutos aiemman data-only-ehdotuksen lisäksi.
Yleistä ravintolaskentamallia, polyolivaatimusta tai osittaisten ravintoarvojen
julkaisusopimusta ei löysennetä. Muille resepteille ei synny pidätyspoikkeusta.
Arvojen palautus edellyttää erillistä lähdekatselmointia ja muutosta.

## Varmennus

- Muuttuneet reseptit: 2/2 PASS; reseptisyötteet ja historialliset evidenssit ennallaan.
- Strict-ravintoarvoauditointi: PASS, 0 ristiriitaa; molemmat paketit `INSUFFICIENT SOURCE DATA`.
- Kohdistetut ravintoarvo- ja GI/GK-testit: 109 PASS, mukana kolme uutta pidätyksen rajatestiä.
- Staattiset/SEO-testit: 25 PASS.
- Yksi paikallinen sivustobuild: 691 reittiä PASS.
- Valmiit HTML-, koneluettavat sisältö- ja JSON-LD-tiedot: ei pidätettyjä numeroita.
- Kaikki 326 kokonaista GK-tulosobjektia täsmäävät mainiin sidottuun lähtötilaan.
- Numeeriset GK-tulokset: 130/326; keskeneräiset: 196. Molemmat HOLDit ja teehaudutettujen munien keskeneräisyys säilyvät.

`verification.json` sisältää tarkistustulokset, baseline-viitteen ja varmennettujen
tiedostojen hashit. Normaali PR-CI tarkistetaan erikseen lopulliselle HEADille.
Paikallinen tarkistus ei todista tuotannossa tapahtunutta muutosta.

## Julkaisuportti

Vain erillinen main-pohjainen Draft. Ei Readyä, mergeä, deployta, manuaalista
Actions-ajoa, Codex Review -pyyntöä, tutkimusajoa tai ReportHub-muutosta.
PR #153, #156–#161 sekä muut lähdehaarat jäävät erilleen.
