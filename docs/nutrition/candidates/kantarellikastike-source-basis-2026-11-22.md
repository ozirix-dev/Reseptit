# Chat 3 – kantarellikastike: Fineli-lähteistetty ravintolaskennan lähtöaineisto

Päivä: 22.11.2026. PR #808. Omistaja: Chat 3. **CANDIDATE / HOLD**; ei varsinaista `docs/nutrition/calculations/`-laskentapakettia eikä julkaistavia makroja.

## Tunnistettu raaka-aine ja tila

- Resepti: `reseptit/alkuruoat/kantarellikastike.md`, neljä lisukeannosta.
- FI-ainesosa: **350 g puhdistettuja kantarelleja** – massa on punnittu syötäväksi puhdistamisen jälkeen.
- Tarkka vastaavuus: **THL Fineli #367**, [Kantarelli (*Cantharellus cibarius*)](https://fineli.fi/fineli/fi/elintarvikkeet/367), raaka-aine, käsittelemätön tai tuore, syötävä osuus 100 %.
- Finelin ilmoittamat ravintoarvot 100 gramman syötävälle osalle: imeytyvät hiilihydraatit **1,5 g**, kuitu **3,2 g**, proteiini **2,0 g**, rasva **0,7 g**. Nämä ovat elintarviketietokannan keskimääräisiä lähdearvoja, eivät Recipavon keittiömittauksia.
- **Sokerialkoholi/POLYL:** Finelin #367:n juuri tarkastetun julkisen elintarvikesivun ravintoaine-erittelyssä ei ole erillistä sokerialkoholin numeerista riviä. Siksi arvo merkitään **UNKNOWN**, **ei** `0`. Tätä raaka-ainetta ei voi vielä lisätä `nutrition-model`-pakettiin täydeksi net/total-CHO-evidenssiksi ilman lähdekomponentin varmennusta.

## Rajattu osalaskenta, ei julkisiin kenttiin

350 g x ravintoaineen g/100 g / 100:
- imeytyvät hiilihydraatit **5,25 g koko erässä**, eli **1,31 g / 4 annosta**;
- kuitu **11,20 g koko erässä**, eli **2,80 g / annos**;
- proteiini **7,00 g koko erässä**, eli **1,75 g / annos**;
- rasva **2,45 g koko erässä**, eli **0,61 g / annos**.

Näihin lukuihin **ei sisälly** sipuli, voi, 20 g vehnäjauhoja, 200 ml kuohukermaa, 75 ml vettä, suola, mustapippuri tai persilja. Ei kokonaista ravintolaskelmaa eikä hyväksyttyä GK-arviota. Paistettaessa sienistä haihtuva vesi voi muuttaa kastikkeen massaa per 100 g, mutta ei itsessään ole peruste vähentää ravintoaineita annoksen kokonaismääristä; erilliset hävikkitiedot on dokumentoitava laskentaan.

## Seuraavan paketin tarvittavat sidokset

1. Varmista Fineli #367:n **POLYL-komponentin nimenomainen arvo** hyväksyttävästä julkaistusta lähdetietueesta. Puuttuva kenttä ei tarkoita nollaa.
2. Sido sipuli, voi, vehnäjauhot, kerma, suola, mustapippuri ja persilja oikeaan Fineli/AFCD-ainesosakorttiin, myös kuidut ja polyolit. Vesi on ravintoarvoiltaan erillinen, mutta sen määrä on laskentaan dokumentoitava.
3. Ratkaise **200 ml kuohukermaa** sekä **75 ml vettä** punnittuihin massoihin tai tarkasti todistettuihin ml→g-kertoimiin. Älä käytä samaa tiheyskerrointa kaikille nesteille. Jos resepti muuttuu, synkronoi FI/EN/SV/TH ja SHA-/ravintosyöttötiivisteet.
4. Aja `site/scripts/nutrition-model.ts` ja `site/scripts/nutrition-evidence.ts` koko raaka-ainejoukolle. Kirjaa syötävän osuuden ja ravintoaineiden retentio myös paistamis- ja haudutusvaiheessa.

**Kaikki ravintokentät säilyvät puuttuvina, `status: draft`, `decision: hold` ja GK määrittämättömänä.** Lähdesidonta ei ole riippumaton julkaisu-/kielihyväksyntä, Ready, merge eikä Cloudflare-deploy.