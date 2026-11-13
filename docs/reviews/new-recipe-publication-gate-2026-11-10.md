# Uuden reseptin ennakkotarkastus V1 – julkaisu ennen kaikkea oikein

Päivä: 10.11.2026 · Repo: `ozirix-dev/Reseptit` · Omistajuus: uudet tiedostot `site/scripts/new-recipe-preflight.*`, tämä dokumentti ja yksi rajattu askel nykyiseen `pages.yml`-työnkulkuun.

## Miksi

Reseptien julkaisemista edeltänyt tekninen validointi tarkistaa rakenteen, ravinto-/GI/GK-regressiot, käännöksiä, kuvia ja URL-osoitteita, mutta **kokin ja toimituksen tarkastuksesta ei ole vaadittu täsmäversion hyväksyntää**. Viiden todellisen ongelmareseptin kokeilu PR #366 jatkaa laajempaa kokkikelpoisuustutkimusta. Tämä uusi portti koskee **vain uusia FI-reseptejä** ja `draft -> published` -siirtymiä, eikä muuta vanhoja reseptejä.

## Päätösjärjestys

1. **DRAFT**: luonnostele FI-resepti rauhassa. Selvitä ruoan alkuperä, samankaltaiset julkaisut, ruokalajin menetelmä, syötävät raaka-aineet/grammat, nesteet (erota pois kaadettava keitinvesi ruokaan jäävästä), rasvat, määrien järkevyys, turvallinen käsittely, annoskoko, aikataulu ja todelliset työvaiheet.
2. **TOIMITUKSELLINEN ARVIO**: erillinen kokkikatselmointi ja ravintolaskennan lähdeaineisto. GI/GK:ta ei arvata: dokumentoitu `unavailable` on sallittu, jos perustelu on kirjattu eikä julkaisu väitä keksittyä arvoa. Vain todellista testikeittämistä saa kutsua koepaistoksi.
3. **VERSIOLUKITTU HYVÄKSYNTÄ**: `docs/reviews/new-recipes/<recipe_id>.json` sitoo täsmällisen lähdetiedoston SHA-256:een, alkuperään ja vastuulliseen tarkistajaan. Pakolliset perustellut tarkistusalueet: duplikaatit, ainesosat, menetelmä, elintarviketurvallisuus, aika/annokset, ravintolaskenta, GI/GK. Tässä kohdassa arvioija tekee päätöksen; skripti vain todentaa, ettei puuttuvaa tai vanhentunutta evidenssiä ohiteta.
4. **PR/CI**: nopea Node-ennakkotarkistus ennen `npm ci`:tä ja raskaita testejä. Puuttuva hyväksyntä pysäyttää uuden *julkaistavan* reseptin. Olemassa olevat YAML-, schema-, nutrition-, GI/GK-, translation-, image-, duplikaattiraportti-, build- ja staattiset testit jatkavat entisinä.
5. **JULKAISU**: vain puhdas PR yhdistetään mainiin; sen jälkeen Pages build/deploy varmennetaan. Vihreä CI ei todista fyysistä koepaistoa, ruoan makua tai yksittäisen ravintoarvon laboratoriotarkkuutta.

## Käyttö

Kun uusi `reseptit/<kategoria>/<id>.md` on kirjoitettu, tee tarkistusluonnos:

```bash
node site/scripts/new-recipe-preflight.mjs --template=reseptit/aamupalat/uusi-resepti.md > docs/reviews/new-recipes/uusi-resepti.json
```

Luo `docs/reviews/new-recipes/`-hakemisto tarvittaessa. Pohja on tarkoituksella `decision: hold` ja sisältää `pending`-tarkistuksia. Täytä se tosiasioihin perustuvalla arviolla. `nutrition_evidence` osoittaa erilliseen laskenta-/lähdedokumenttiin; kirjaukset eivät saa väittää olematonta laboratoriomittausta. Jos FI-tiedostoa muokataan, tee uusi arvio ja SHA – vanha hyväksyntä ei kelpaa.

Ennen PR:ää (myös Windowsin WSL-ympäristössä):

```bash
node --test site/scripts/new-recipe-preflight.test.mjs
node site/scripts/new-recipe-preflight.mjs --recipe=reseptit/aamupalat/uusi-resepti.md
```

PR:n CI vertaa GitHubin testiyhdistämistä sen main-pohjaan. Portti tunnistaa uudet julkaistut FI-tiedostot ja luonnosten julkaisun myös silloin, kun tiedosto siirretään tai nimetään uudelleen. Hyväksyntä sidotaan lopulliseen polkuun ja tiedostosisältöön. Saman jo julkaistun reseptin siirto säilyttää nykyisen tarkistusmenettelyn.

**HUOM:** tämä on *evidenssin olemassaoloa ja versionmukaisuutta* tarkistava pakollinen portti. Menetelmä-/ainesosakysymysten semanttista totuutta ei voi vahvistaa pelkällä JSON-tarkistimella; PR #366:n kokkikelpoisuusmenetelmästä ja #358:n ainesosaristiriita-auditoinnista on tarkoitus rakentaa seuraava automaattinen varoitus-/HOLD-vaihe. Tätä PR:ää ei saa esittää noiden pilotin tulosten korvaajana.

## Karanteenista palautettavan reseptin osoite

Lisää seuraajan ID ja vanha slug sekä edeltäjän ID, polku ja Git-blob-SHA
[seuraajarekisteriin](../../meta/recipe-successors.json). Edeltäjän ID säilyy
julkisessa karanteeniluettelossa. Uuden reseptin arvioon kirjataan sama
edeltäjä kentässä `supersedes_quarantined`. Uuden reseptin oma SHA,
ravintolaskenta ja GK-päätös tarkistetaan sen julkaisuversion perusteella.

## Regressio ja kustannusten hallinta

- Uusi resepti ilman hyväksyntää -> **HOLD**.
- `draft -> published` ilman hyväksyntää -> **HOLD**.
- Vaihtunut lähdetiedosto-SHA, väärä resepti-ID, valheellinen `approved` ilman seitsemää perusteltua kohtaa, lähteetön muokattu resepti tai identtinen ID/slug -> **HOLD**.
- `draft` ilman hyväksyntää ja jo julkaistun reseptin toimituksellinen korjaus -> uusi portti ei estä (muu validointi normaalisti).
- Puuttuva GI/GK voidaan dokumentoida `unavailable`-tilaan -> ei keinotekoista GK-numeroa.
- Yksi nopea tarkistus nykyisen Recipe site -työnkulun sisällä; ei uusia erillisiä Actions-työnkulkuja, ei tyhjää commitia, ei ylimääräistä koeaallosarjaa.

Tässä PR:ssä ei lisätä eikä julkaista reseptejä, ei muokata ravintoarvoja tai GI/GK-sinettejä, ei kosketa `kaannokset/`-tiedostoihin eikä hyväksytä #366:ta automaattisesti.
