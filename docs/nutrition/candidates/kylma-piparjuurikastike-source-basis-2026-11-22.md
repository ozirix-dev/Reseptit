# Chat 3 – kylmä piparjuurikastike: ravintolaskennan täsmälähteet

**Päivä:** 22.11.2026  
**PR:** #808, `chat3/suomalaiset-kastikkeet-20261121`  
**Tila:** CANDIDATE / HOLD, ei `docs/nutrition/calculations/`-hyväksyntää.  
**Resepti:** `reseptit/alkuruoat/kylma-piparjuurikastike.md`, neljä annosta; FI-lähteen nykyisiä määriä ei muutettu.

## Varmennetut lähtötiedot

| Reseptin ainesosa | Määrä | Saatu lähdetieto | Ravintoarvot per 100 g | Avoin kysymys |
| --- | ---: | --- | --- | --- |
| Crème fraîche, rasvaa noin 12 % | 200 g | [Valio Hyvä suomalainen Arki crème fraîche 12 %, laktoositon 180 g](https://www.valio.fi/tuotteet/valio-hyva-suomalainen-arki-creme-fraiche/), EAN 6408430141227; sama tuote [K-Ruoka](https://www.k-ruoka.fi/kauppa/tuote/valio-hyva-suomal-arki-creme-fraich-180g-6408430141227) | Hiilihydraatit 4,8 g; proteiini 2,8 g; rasva 12 g; sokereita 3,3 g | Valmistaja ei ilmoita **polyoleja** erikseen. Kuituarvo ei ole yksiselitteinen ensisijaisessa tiedossa. EU-hiilihydraatin polyolikäsittely varmennettava. |
| Tuore piparjuuri | 20 g | [THL Fineli -datan avoin julkaisu: piparjuuri](https://ravinto.ptjesse.fi/piparjuuri/) | Imeytyvät hiilihydraatit 14,06 g; ravintokuitu 7,5 g; proteiini 3,93 g; rasva 0,25 g; sokerialkoholi 0 g | Puhdistettu syötävä juurimassa on reseptin 20 g; vahvista `recipeNutritionInputHash` ja oikea Fineli-tuotetunnus ennen varsinaista evidenssiä. |
| Sokeri | 5 g | THL Fineli #1; aiemmissa saman PR:n laskentapaketeissa lähdekortti | CHO 99,9 g; kuitu 0; proteiini 0; rasva 0; polyolit 0 g | Käytä täsmälleen aiemmin validoitua lähdeversiota. |
| Sitruunamehu | 12 ml | THL Fineli #11557 (laimentamaton sitruunamehu), samaa pohjaa käytetty tillikastikkeessa | CHO 1,6 g; kuitu 0,1 g; proteiini 0,31 g; rasva 0; polyolit 0 g | Tilavuus 12 ml ei ole punnittu 12 g. **Älä siirrä tillikastikkeen 12 g vastaavuutta automaattisesti tähän.** Hanki tuotesidottu muunnos tai muuta FI/EN/SV/TH sovitusti grammoiksi. |
| Suola | 2 g | THL Fineli #30, aiemmissa saman PR:n laskentapaketeissa lähdekortti | Hiilihydraatit 0; proteiini 0,63 g; rasva 0; kuitu 0; polyolit 0 g | Täsmää käytettävän tuotteen tila ja lähdeversio. |
| Tuore ruohosipuli | 8 g | Lähdetuote vielä yksilöimättä tähän tarkistusversioon | **Ei lukuarvoja** | Varmista oikean tuoreen, syötävän ruohosipulin Fineli-ainesosakortti, mukaan lukien FIBT/POLYL. |

**12 % Valio-tuote on 180 gramman pakkaus**, mutta reseptissä tarvitaan 200 g; tämä ei tee tuotteen 100 gramman ravintotaulukosta virheellistä. Tuotteen 12 % rasva vahvistaa FI:n nykyistä geneeristä `crème fraîchea, rasvaa noin 12 %` -ilmausta; tuote ei ole vielä reseptin nimetty pakollinen merkki. Älä vaihda sitä kesken laskennan 15–18 %:n tai 28 %:n Fineli-ranskankermaan (eri rasvapitoisuus).

## Lähdeperusteinen osasumma, EI koko reseptin ravintoarvo

Vain yllä **kolmesta täysin grammaperusteisesta** määrästä (200 g nimettyä Valio-proxya, 20 g Fineli-piparjuurta ja 5 g Fineli-sokeria) saadaan neljän annoksen osasummaksi:

- CHO 17,407 g / **erä** (4,35175 g / annos osasummana)
- Proteiini 6,386 g / **erä** (1,5965 g / annos osasummana)
- Rasva 24,05 g / **erä** (6,0125 g / annos osasummana)

Nämä luvut **eivät sisällä** sitruunamehua, suolaa eivätkä ruohosipulia, eivätkä ne ole julkisia makroarvoja; niihin ei saa yhdistää tuntematonta nollana. Lisäksi crème fraîchen polyolipitoisuus ja kuitu vaativat lähteen sekä tarvittaessa reseptin täsmäkirjauksen. Ruokamäärä on jääkaapissa sekoitettu kylmä kastike, joten mitään valmista kastiketta tai ainesosia ei ole tarkoitus siivilöidä tai hävittää; valmistuksen syötävä osuus on silti dokumentoitava viralliseen pakettiin.

## Seuraavan hyväksyttävän paketin tarkistuslista

1. Varmista crème fraîchen polyolit ja kuitu, tai muu täsmäosumia tuottava lähde; ei arvattuja nollia.
2. Varmista ruohosipulin ja sitruunamehun lähdekortit; ratkaise sitruunamehun ml→g aineistolla, tai tee 12 g muutos kaikkiin neljään kieleen synkronoidusti.
3. Laske `recipeNutritionInputHash` todellisen FI-lähteen määristä ja sitouta kaikkien kuuden ainesosan `record`-rakenteet. Aja `site/scripts/nutrition-model.ts` ja `site/scripts/nutrition-evidence.ts` oikeilla tietueilla.
4. Julkisia neljää makroa ei kirjoiteta ennen täyttä evidenssiä. `checks.nutrition: pending`, `decision: hold`, `status: draft`, GK määrittämätön, PR #808 Draft/HOLD, ei Readyä/mergeä/tuotantodeployta.

Lähteiden lainausta on minimoitu. Tämä on Chat 3:n toimituksellinen esiselvitys, ei hyväksytty laboratoriomittaus tai fyysisen valmistuskokeen tulos.
