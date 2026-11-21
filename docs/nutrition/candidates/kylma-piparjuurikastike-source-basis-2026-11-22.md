# Chat 3 – kylmä piparjuurikastike: ravintolaskennan täsmälähteet

**Päivä:** 22.11.2026  
**PR:** #808, `chat3/suomalaiset-kastikkeet-20261121`  
**Tila:** CANDIDATE / HOLD, ei `docs/nutrition/calculations/`-hyväksyntää.  
**Resepti:** `reseptit/alkuruoat/kylma-piparjuurikastike.md`, neljä annosta. Sitruunamehu täsmennettiin FI/EN/SV/TH-lähteissä 12 millilitrasta 12 punnittuun grammaan 22.11.2026.

## Varmennetut lähtötiedot

| Reseptin ainesosa | Määrä | Saatu lähdetieto | Ravintoarvot per 100 g | Avoin kysymys |
| --- | ---: | --- | --- | --- |
| Crème fraîche, rasvaa noin 12 % | 200 g | [Valio Hyvä suomalainen Arki crème fraîche 12 %, laktoositon 180 g](https://www.valio.fi/tuotteet/valio-hyva-suomalainen-arki-creme-fraiche/), EAN 6408430141227; sama tuote [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/valio-hyva-suomal-arki-creme-fraich-180g-6408430141227) | Hiilihydraatit 4,8 g; proteiini 2,8 g; rasva 12 g; sokereita 3,3 g | Valmistaja ei ilmoita **polyoleja** erikseen. Kuituarvo ei ole yksiselitteinen ensisijaisessa tiedossa. EU-hiilihydraatin polyolikäsittely varmennettava. |
| Tuore piparjuuri | 20 g | [THL Fineli -datan avoin julkaisu: piparjuuri](https://ravinto.ptjesse.fi/piparjuuri/) | Imeytyvät hiilihydraatit 14,06 g; ravintokuitu 7,5 g; proteiini 3,93 g; rasva 0,25 g; sokerialkoholi 0 g | Puhdistettu syötävä juurimassa on reseptin 20 g; vahvista `recipeNutritionInputHash` ja oikea Fineli-tuotetunnus ennen varsinaista evidenssiä. |
| Sokeri | 5 g | THL Fineli #1; aiemmissa saman PR:n laskentapaketeissa lähdekortti | CHO 99,9 g; kuitu 0; proteiini 0; rasva 0; polyolit 0 g | Käytä täsmälleen aiemmin validoitua lähdeversiota. |
| Sitruunamehu | 12 g | THL Fineli #11557 (laimentamaton sitruunamehu), samaa pohjaa käytetty tillikastikkeessa | CHO 1,6 g; kuitu 0,1 g; proteiini 0,31 g; rasva 0; polyolit 0 g | Sitruunamehun määrä määritettiin uudessa reseptiversiossa **12 punnituksi grammaksi**. Tämä ei ole väite, että alkuperäinen 12 ml olisi ollut sama massa. |
| Suola | 2 g | THL Fineli #30, aiemmissa saman PR:n laskentapaketeissa lähdekortti | Hiilihydraatit 0; proteiini 0,63 g; rasva 0; kuitu 0; polyolit 0 g | Täsmää käytettävän tuotteen tila ja lähdeversio. |
| Tuore ruohosipuli | 8 g | [THL Fineli #392: ruohosipuli, Allium schoenoprasum](https://fineli.fi/fineli/fi/elintarvikkeet/392), raaka/tuore; syötävä osuus 100 % | Imeytyvät hiilihydraatit 0,7 g; ravintokuitu 2,7 g; proteiini 2,2 g; rasva 0,9 g; sokerialkoholi 0 g / 100 g | Finelin julkaistut arvot ovat pyöristettyjä. Sokerialkoholin 0 g on **erikseen julkaistu johdettu arvo**, ei puuttuvan tiedon nollaksi tulkinta. |

**12 % Valio-tuote on 180 gramman pakkaus**, mutta reseptissä tarvitaan 200 g; tämä ei tee tuotteen 100 gramman ravintotaulukosta virheellistä. Tuotteen 12 % rasva vahvistaa FI:n nykyistä geneeristä `crème fraîchea, rasvaa noin 12 %` -ilmausta; tuote ei ole vielä reseptin nimetty pakollinen merkki. Älä vaihda sitä kesken laskennan 15–18 %:n tai 28 %:n Fineli-ranskankermaan (eri rasvapitoisuus).

## Lähdeperusteinen osasumma, EI koko reseptin ravintoarvo

Vain yllä **kolmesta täysin grammaperusteisesta** määrästä (200 g nimettyä Valio-proxya, 20 g Fineli-piparjuurta ja 5 g Fineli-sokeria) saadaan neljän annoksen osasummaksi:

- CHO 17,407 g / **erä** (4,35175 g / annos osasummana)
- Proteiini 6,386 g / **erä** (1,5965 g / annos osasummana)
- Rasva 24,05 g / **erä** (6,0125 g / annos osasummana)

Nämä luvut **eivät sisällä** sitruunamehua, suolaa eivätkä ruohosipulia, eivätkä ne ole julkisia makroarvoja; niihin ei saa yhdistää tuntematonta nollana. Lisäksi crème fraîchen polyolipitoisuus ja kuitu vaativat lähteen sekä tarvittaessa reseptin täsmäkirjauksen. Ruokamäärä on jääkaapissa sekoitettu kylmä kastike, joten mitään valmista kastiketta tai ainesosia ei ole tarkoitus siivilöidä tai hävittää; valmistuksen syötävä osuus on silti dokumentoitava viralliseen pakettiin.

## Seuraavan hyväksyttävän paketin tarkistuslista

1. Varmista crème fraîchen polyolit ja kuitu tai muu täsmäosumia tuottava lähde; ei arvattuja nollia.
2. Tuoreen ruohosipulin Fineli #392 -ravintokortti on lähdetasolla yksilöity ja sitruunamehun määrä on jo muutettu 12 g punnituksi massaksi FI/EN/SV/TH-kielissä. Sitruunamehun Fineli #11557 -lähde on dokumentoitu aiemmassa tillikastikkeen laskentapaketissa; varsinainen kokonaislaskennan validointi on tekemättä.
3. Laske `recipeNutritionInputHash` todellisen FI-lähteen määristä ja sitouta kaikkien kuuden ainesosan `record`-rakenteet. Aja `site/scripts/nutrition-model.ts` ja `site/scripts/nutrition-evidence.ts` oikeilla tietueilla.
4. Julkisia neljää makroa ei kirjoiteta ennen täyttä evidenssiä. `checks.nutrition: pending`, `decision: hold`, `status: draft`, GK määrittämätön, PR #808 Draft/HOLD, ei Readyä/mergeä/tuotantodeployta.

Lähteiden lainausta on minimoitu. Tämä on Chat 3:n toimituksellinen esiselvitys, ei hyväksytty laboratoriomittaus tai fyysisen valmistuskokeen tulos.

## Täsmennys 22.11.2026

Kaikki neljä reseptitiedostoa käyttävät nyt punnittua **12 g** sitruunamehua. FI SHA-256: `9a577bfdf6e610f3dfee98ff802de6841a2b3b9e23cc30544cea65345ed03260`. Ravintolaskennan syöttötiiviste: `c6fd529885f21f835fa6a97c4873c05bd27a9b11b8d04a3c6de68499666945a0`. Aiemmin kirjattu 12 ml koski vanhaa luonnosversiota. Crème fraîchen polyoli-/kuituevidenssi on edelleen avoinna; ruohosipulin lähdekortti vahvistettiin alempana Fineli #392:ksi. Virallisia makroarvoja ei julkaista.

## Tuoreen ruohosipulin virallinen Fineli-vastine 22.11.2026

Finelin oma [raaka-aine #392](https://fineli.fi/fineli/fi/elintarvikkeet/392) vahvistaa nimen **Ruohosipuli (Allium schoenoprasum)**, valmistustilan **käsittelemätön/tuore** ja syötävän osuuden **100 %**. Per 100 g Fineli näyttää imeytyvät hiilihydraatit 0,7 g, kuidun 2,7 g, proteiinin 2,2 g, rasvan 0,9 g sekä erikseen sokerialkoholin 0 g (johdettu). Näistä kahdeksan gramman raaka-ainesmäärälle saadaan vain ruohosipulin **erillinen lähdesidottu osavaikutus**: hiilihydraatit 0,056 g; kuitu 0,216 g; proteiini 0,176 g; rasva 0,072 g; sokerialkoholit 0 g. Arvoja ei vielä kirjoiteta koko reseptin ravintokenttiin.

THL:n ilmoittama polyolien johdettu nolla on nimenomaisesti lähteessä näkyvä arvo; erillisen Valio crème fraîche -tuotteen polyolit pysyvät **tietona puuttuvina**, eikä tuota puutetta saa paikata ruohosipulin arvoilla.
