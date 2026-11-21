# Codex-handoff: Recipavo Cloudflare → GitHub Actions -ympäristötunnukset

**Omistaja:** Codex (käyttäjän erillisestä pyynnöstä 22.11.2026).
**Tila:** toimeksianto, ei valmis asennus. Tämä PR on vain luovutuspiste.
**Repo:** `ozirix-dev/Reseptit`
**Tavoite:** ota käsin käynnistettävän tuotantojulkaisun GitHub Environment -salaisuudet käyttöön mahdollisimman pitkälle ilman Cloudflare Dashboardissa klikkailua. Älä käynnistä tuotantodeployta.

## Varmennettu lähtötilanne

- [PR #825](https://github.com/ozirix-dev/Reseptit/pull/825) on MERGED: `.github/workflows/recipavo-production-manual.yml` on manuaalinen, SHA-lukittu tuotantojulkaisu. Se vaatii oikean `main`-SHA:n, onnistuneen `Recipe site` -CI:n, GitHub Environment -suojauksen ja Cloudflaren tiliasetusten tarkistuksen.
- [PR #828](https://github.com/ozirix-dev/Reseptit/pull/828) on **erillinen Chat-1:n työn alla oleva Draft-PR**, joka muuttaa Required reviewers -vaatimuksen 10 minuutin `wait_timer`-suojaukseksi. Älä muokkaa sen haaraa tai yhdistele sen muutoksia tähän työnkulkuun.
- GitHub Environment `recipavo-production` on jo luotu. Käyttäjän viimeisimmässä GitHub-kuvassa siinä näkyi `Selected branches and tags: main`, admin bypass pois ja **0 environment secretiä**. Edellisessä kuvassa `Wait timer: 10 minutes` oli valittuna. Kaikkien asetusten tallennus-/API-tilaa ei ole vielä vahvistettu.
- Pages-projekti `recipavo-site` on Direct Upload; Cloudflaren production branch on `production`. Viimeksi onnistuneesti todennettu tuotanto-SHA: `a45f4e49afd4dcd96d4f24b7f44f81dda23fbeba`; tämän tehtävän aikana ei muuteta tuotantoa.
- Windowsissa on ollut toimiva Wrangler-kirjautuminen ja GitHubin paikalliset työkalut, mutta **älä oleta**, että niistä saadaan automaattisesti oikeudet luoda Cloudflare API tokeneita.

## Codexin toteutustehtävä

1. Selvitä GitHubin `recipavo-production`-ympäristön ja Actions-salaisuuksien **nykytila read-only**. Varmista 10 minuutin `wait_timer`, admin-bypass OFF ja täsmälleen `main`-branch policy; tunnista mahdolliset puuttuvat asetukset. Pidä PR #828 erillisenä.
2. Selvitä paikallisen Wrangler CLI:n ja Cloudflare-tilin **read-only**-tiedoista oikea Account ID ja projekti. Esimerkiksi Wrangler `whoami`, Pages project list tai autentikoidun Cloudflare-API:n rajattu GET, jos käytettävissä. Älä tulosta salaisuuksia tai niiden arvoja lokeihin.
3. Selvitä, onko käytettävissä jo turvallisesti hallittu, Pages-julkaisuun **minimioikeuksin rajattu ja hyväksytty** API token. Älä siirrä tai paljasta laajaoikeuksista OAuth-istuntotunnusta, Global API Key -avainta tai lokaalisti talletettuja credentialeja GitHubiin. **Älä koskaan lisää tokenia committiin, PR-kuvaukseen, issueen tai raporttiin.**
4. Jos asianmukainen token on saatavilla turvallisen credential-välityksen kautta ja käyttäjän oikeutus kattaa sen käyttöönoton, aseta GitHub-ympäristöön seuraavat kaksi **Environment secretiä** (ei repository-leveliksi):
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   Käytä mieluiten `gh secret set --env recipavo-production --repo ozirix-dev/Reseptit` ja syötä salaisuus turvallisesti **stdinistä** tai suojatusta syötteestä, ei komentorivin argumenttina tai tulostettuna arvona. Säilytä mahdolliset olemassa olevat salaisuudet.
5. Jos oikeaa API tokenia ei voida luoda tai hakea ilman Cloudflaren käyttäjän interaktiivista tunnistautumista, älä väitä työn valmistuneen: **HOLD** ja yksi täsmällinen käyttäjältä tarvittava toimenpide. Pyri vähentämään Dashboard-vaiheet minimiin; älä kierrä tunnistautumista tai keksi tokenia.
6. Tarkista lopuksi GitHubin API:sta vain **salaisuuksien nimien olemassaolo** sekä Environmentin suojaussäännöt; testaa Cloudflare-API:n turvallinen GET, jos tokenin käyttö on mahdollista, varmistamatta tai näyttämättä sen arvoa. Tee tarvittaessa rajattu offline/preflight, mutta **älä suorita tuotantodeployta**, älä muuta DNS:ää, D1:tä, Turnstileä, WAFia, Cronia tai palautteen POST-vastaanottoa.
7. Raportoi PR:ään sanitoitu yhteenveto: `PASS` / `HOLD` jokaisesta tarkistuksesta, mitkä salaisuuksien **nimet** ovat läsnä (ei arvoja), mahdolliset vielä tarvittavat käyttäjätoimet. Sulje tehtävä vasta todisteilla.

## Turvarajat ja hyväksymiskriteerit

- Ei tunnuksia GitHub-historiaan, lokeihin, työnkulun artefakteihin eikä chattiin.
- Käytä pienimmän oikeuden Cloudflare Pages -tokenia, joka on rajattu asianmukaiseen tiliin. Älä käytä Global API Keytä tai julkaise selaimen sessiotunnuksia.
- Ei Cloudflare-projektin vaihtoa tai toista production deployta tämän tehtävän perusteella.
- GitHub Environment -suojaus pysyy käyttäjän valitsemana: 10 min timer, vain `main`, admin bypass OFF; PR #828:n vielä keskeneräinen sovitus on oma työnsä.
- Todennettu lopputila: GitHubissa `recipavo-production` sisältää nimiltään molemmat salaisuudet, niiden Cloudflare-käyttö on tarvittaessa verifioitu read-only ja kaikki julkaisun portit pysyvät suljettuina oikeaan käsin käynnistettyyn julkaisuun saakka.
- Jos tekniset työkalut tai tilioikeudet eivät riitä salaisuuden luomiseen/asettamiseen, pysähdy ja kerro täsmälleen miksi.

**Codexia ei käynnistetä automaattisesti tällä PR:llä.** Tämä dokumentti on luovutus/toimeksianto; Codexin oma toteutus voi edellyttää lisäcommitteja, hyväksyntää ja käyttöoikeuksia.
