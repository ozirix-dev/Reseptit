# Recipavo – Cloudflare-tuotanto ja GitHub Pages -staging (V2)

**Tila:** suunnitelma / Draft PR, EI julkaisuvaltuutus  
**Päivitetty:** 4.11.2026  
**Päälähderepo:** [ozirix-dev/Reseptit](https://github.com/ozirix-dev/Reseptit), työpolku `D:\Projects\Products\Reseptit`  
**Pohja:** main `de83657c52e0f018b10c3d5e7d26cdf671d5c85f`  
**Aiempi selvitys:** [ReportHub 24.10. domainin valmistelu](https://github.com/ozirix-dev/ReportHub/blob/main/reports/archive/2026-10-24-recipavo-domain-preparation.md) ja [24.10. Coming Soon -julkaisu](https://github.com/ozirix-dev/ReportHub/blob/main/reports/archive/2026-10-24-recipavo-coming-soon-publication.md). Vanhat raportit säilyvät historiallisina, eivät nykyisen julkaisusuunnitelman lähteenä.

## Omistajan vahvistamat linjaukset 4.11.2026

1. **Julkinen osoite:** `https://www.recipavo.com/`; käyttäjä ei halua markkinoida `ozirix-dev.github.io/Reseptit/`-osoitetta. `recipavo.com` ohjataan ensisijaiseen www-osoitteeseen vain julkaisuhetkellä erikseen hyväksytyn, toimivaksi varmennetun reittisäännön avulla.
2. **Tuotanto:** Cloudflare. Päätös korvaa 24.10. suunnitelman suosituksen GitHub Pages -tuotannosta. Toteutustavaksi ehdotetaan **Cloudflare Pages** -staattista Vite/React-buildia, koska Coming Soon on jo Pagesissa. Cloudflare Workers Static Assets säilyy myöhempänä vaihtoehtona vain, jos sitä varten ilmenee todellinen vaatimus. Hosting-tuotevalinta tarkistetaan ennen toteutusta eikä tätä ehdotusta pidetä aktivoituna palveluna.
3. **Staging:** GitHub Pages voidaan säilyttää julkisena mutta indeksoinnilta suojattuna **kehitys-/integraatioversiona**, ei varsinaisena julkaisuosoitteena. Se ei ole pääsynhallinnalla yksityinen. PR-kohtaiset testit tehdään paikallisesti tai Cloudflaren erillisillä preview-deployilla tarpeen mukaan.
4. **Coming Soon:** `recipavo.com` ja `www.recipavo.com` osoittivat 2.11.2026 tehdyn ReportHub-auditoinnin mukaan Cloudflare Pages -projektiin `recipavo-coming-soon` ja näyttivät `noindex,nofollow`-sivun. **Älä korvaa, sammuta tai kytke irti sitä ennen erillistä nimenomaista tuotantojulkaisulupaa.**
5. **GSC ja SEO:** GitHub Pagesia ei ole käyttäjän mukaan lisätty Search Consoleen, mutta tämä EI takaa, ettei sitä olisi indeksoitu. Recipavo saa oman GSC-propertyn ja indeksoitavan sitemapin vasta lopullisen julkaisuportin jälkeen. Ei luvata automaattisia 301-ohjauksia GitHub Pagesilta: käyttäjä ei halua ohjata käyttäjiä GitHub-osoitteeseen.
6. **Julkaisut:** mitään `main`-pushia, hyväksyntää tai vihreää CI:tä ei tulkita Cloudflare-tuotantojulkaisuluvaksi. Erillinen täsmäversio-/commit-SHA-sidottu hyväksyntä ja tuotantovarmennus vaaditaan.

## Nykytila ja reunaehdot

- `Reseptit/.github/workflows/pages.yml` sisältää GitHub Pages -deployn `main`-pushista ja PR-tarkistukset. Tällä hetkellä sama työnkulku voi tuottaa kehitysosoitteeseen julkaistun buildin; siitä ei seuraa Cloudflare-tuotantodeployta.
- `site/scripts/build-content.ts` sisältää kovakoodatun vanhan `https://ozirix-dev.github.io/Reseptit`-pohjan, ja 24.10. selvitys tunnisti Viten `/Reseptit/`-base-polun, reittien, canonicalin, hreflangin, Open Graphin, JSON-LD:n ja sitemapin riippuvuudet. **Eri ympäristöihin tarvitaan omat build-konfiguraatiot; pelkkä DNS-muutos ei riitä.**
- Reseptit on nelikielinen (FI/EN/SV/TH), ja kaikki julkaistut reseptit, GK-only-versiot ja käännöspolut on huomioitava tuotantosiirrossa.
- Tuotanto ei ole tällä suunnitelmalla vielä varmistetusti siirretty. Historiallinen ReportHub-raportti ei ole live Cloudflare-DNS:n tai Pages-domain-asetusten todiste; tarkista ne ennen toteutusta.
- Käynnissä olevien GK100- ja käännös-PR:ien branch-omistajuus säilyy: julkaisuympäristötyö tehdään **omassa haarassa ja worktreessä**.

## Tavoitearkkitehtuuri

| Ympäristö | Julkaisukohde | URL ja hakukonepolitiikka | Käyttö |
| --- | --- | --- | --- |
| Tuotanto | Cloudflare Pages / myöhemmin tarvittaessa Workers Static Assets | `www.recipavo.com`; `index,follow` vasta launchissa, sitemap/canonical/hreflang Recipavo-osoitteisiin | Käyttäjät, GSC, SEO |
| Coming Soon (siirtymä) | Nykyinen Cloudflare Pages `recipavo-coming-soon` | Nykyiset domainit, `noindex,nofollow` | Säilyy cutoveriin asti |
| Integraatio/staging | GitHub Pages | `ozirix-dev.github.io/Reseptit/`, `noindex`, ei markkinointilinkkejä, ei staging-sitemapin lähetystä GSC:hen | Testit, koko sivuston integroitu katselu |
| PR-preview | Paikallinen Vite tai tarvittaessa Cloudflare Pages preview-osoite | Indeksoinnilta estetty; arkaluonteiselle sisällölle pääsynhallinta | PR-tarkistus ennen mainia |

GitHub Pages -stagingin nykyinen `main`-pohjainen deploy ei ole *ennakkotesti* samasta main-commitista tehtävälle tuotantojulkaisulle, jos Cloudflare julkaisee pushista automaattisesti. **Ratkaisu:** Cloudflare-tuotanto julkaistaan vain erillisen hyväksytyn promote-to-production -toimenpiteen kautta. Silloin Pages voi kuvata uudempaa integroitua `main`-versiota kuin viimeisin hyväksytty Cloudflare-tuotanto, ilman pakollista erillistä `staging`-haaraa. Erillinen staging-haara otetaan käyttöön vain, jos siitä on todellista hyötyä (esim. vaikea julkaisuikkuna), jotta CI- ja sync-kustannukset eivät kasva.

## Toteutuserät ja riippuvuudet

### Vaihe 0 – inventaario (read-only)

- Tarkista Cloudflare Pages `recipavo-coming-soon`, custom domainit, CNAME/redirect-konfiguraatio ja mahdolliset GSC-asetukset live-lähteistä.
- Tarkista nykyisen Reseptit-mainin GitHub Pages, asset-polut, reittilista, sitemap, robots, canonical, hreflang, OG ja JSON-LD.
- Selvitä Vite-buildin todellinen asset-koko ja Cloudflare Pagesin rajoitukset; varmista palveluvalinta.
- Varmista, että Coming Soon pysyy toiminnassa kaikissa myöhemmissä vaiheissa ennen varsinaista cutoveria.

### Vaihe 1 – ympäristöriippumaton build (erillinen toteutus-PR)

- Lisää ympäristökohtaiset `basePath`, `publicOrigin`, `canonicalOrigin`, `robotsPolicy` ja `deployTarget` **yhdestä tyypitetystä konfiguraatiosta**. Poista vain osoitekohtaiset kovakoodaukset; älä muuta reseptisisältöä eikä GK-laskelmia.
- GitHub Pages -buildissa säilytä `/Reseptit/`-asset- ja reittipohja. Cloudflare-tuotannossa käytä juuripolkua `/` ja `https://www.recipavo.com`.
- Tuota stagingiin `X-Robots-Tag: noindex` mahdollisuuksien mukaan ja meta `noindex` kaikille HTML-reiteille; ei julkaistavaa Recipavo-sitemapia tai staging-canonicaleja Recipavoon ilman tietoisesti päätettyä politiikkaa. `robots.txt Disallow` ei korvaa `noindex`-ohjetta, koska hakukoneen on voitava lukea se. Älä tukeudu `robots.txt`-tiedostoon yksityisyyden suojana.
- Cloudflare-tuotanto: canonical, hreflang (vastavuoroiset FI/EN/SV/TH + `x-default` tarvittaessa), sitemap, Recipe JSON-LD, Open Graph ja mahdolliset jakolinkit oikeaan domainiin.
- Varmista SPA-syvälinkkien käsittely (200/404 erot), latausreittien, kuvien ja neljän kielen polkujen toiminta. Hakukoneille ei saa syöttää samaa geneeristä HTML-200-vastausta jokaiseen olemattomaan URLiin.
- Tarkista kielipolut nykyisestä tuotteen reittisopimuksesta. **Älä** muuta `/en/recipes/`, `/sv/recept/`, `/th/recipes/` tai suomen polkuja vain vanhan raportin esimerkin perusteella.

### Vaihe 2 – Cloudflare-preview ilman julkisen domainin siirtoa

- Tee uusi erillinen Cloudflare Pages -projekti esim. `recipavo-site` nykyisen `recipavo-coming-soon` rinnalle. Älä kirjoita olemassa olevan Coming Soon -projektin päälle.
- Rakenna/siirrä vain hyväksytty commit Cloudflare-preview-osoitteeseen; varmista assetit, SEO-konfiguraatio, kielipolut, kuvien lataus, 404, mobiili sekä GK-versioiden renderöinti.
- Varmista, ettei `pages.dev`-preview indeksoidu (noindex ja tarvittaessa Cloudflare Access). Tarkista, että salaisuudet eivät tallennu GitHubiin.
- Vältä kallista kaksinkertaista CI:tä: uudelleenkäytä jo todettu build/asset-artifact, jos turvallisesti toteutettavissa. Testaa vain muuttuvat julkaisu- ja reittiasiat.

### Vaihe 3 – tuotantojulkaisu ja DNS-cutover (VAATII ERILLISEN LUVAN)

**Stop/go-portti ennen toimia:** omistaja hyväksyy nimenomaisesti tuotantocommitin, kohteen, domain-siirron, reitit, SEO-asetukset ja palautussuunnitelman. Mikään tämä Draft-PR ei ole lupa.

- Jäädytä julkaistava commit-SHA, tee varmennettu Cloudflare-preview ja dokumentoi odotettu sisältö/GK-kattavuus.
- Ota talteen nykyisen Coming Soon -projektin DNS-asetukset sekä palautustapa.
- Siirrä `www.recipavo.com` hyväksyttyyn projektiin ja aseta kanoninen HTTP→HTTPS / apex→www -ohjaus asianmukaisesti. Varmista ettei välissä tule laajaa katkosta tai yllätyspalvelua.
- Aseta tuotannossa `index,follow` ja julkaistut canonicalit/sitemapit vasta toimivaksi varmennetun julkaisun jälkeen; tarkista GSC ja lähetä sitemap erillisellä päätöksellä.
- Tarkista oikeat HTTP-tilakoodit, 404:t, kuvat, kieliversiot, GK-kattavuus ja turvaotsakkeet tuotannosta. Raportoi todennettava release-SHA ja tarvittaessa rollback.

### Vaihe 4 – ylläpito

- `main`-muutos → GitHub Pages -staging + riskiperusteinen CI. Cloudflare-tuotantoon **vain erikseen hyväksytty promote**.
- Mahdollinen pilvinen PR-preview ei saa laukaista tuotantodeployta. Uusi GK-hyväksyntä ei itsessään valtuuta hostausjulkaisua.
- Seuraa Cloudflaren virheitä, liikennettä ja SEO-indeksointia; siirrä GSC-sitemap vain todellisessa julkaisussa. Dokumentoi palautus ja jatkojulkaisut.
- Arvioi GitHub Pages -stagingin tarve myöhemmin: jos Cloudflare-preview kattaa saman käytön, Pages voidaan poistaa erillisellä päätöksellä; ei nyt.

## Konkreettiset toimitus- ja hyväksyntäkriteerit

- [ ] Vanha Coming Soon säilynyt koskemattomana siihen asti, kunnes cutover hyväksytään.
- [ ] Erillinen rakenne erottaa Cloudflare root `/` ja GitHub Pages `/Reseptit/` ilman haarukoituja sisältölähteitä.
- [ ] SEO metadata: canonical, `hreflang`, `x-default`, sitemap, robots, OG ja Recipe JSON-LD kunnossa neljällä kielellä.
- [ ] GitHub Pages -staging noindex kaikilla generoituilla HTML-sivuilla; ei GSC:hen tai markkinointiin.
- [ ] Cloudflare-preview onnistuu ilman live-domainia.
- [ ] CI ja deploy erotettu; ei automaattista Cloudflare-tuotantodeployta main-pushista.
- [ ] Tuotantohyväksyntä on erillinen ja SHA-sidottu.
- [ ] DNS, 404, HTTPS, nelikieliset reitit ja GK-kattavuus varmennetaan julkaisuhetkellä.
- [ ] Palautussuunnitelma ja vanhan Coming Soon -konfiguraation tiedot säilytetty.
- [ ] Ei ylimääräisiä kokonaisia testisarjoja/Actions-ajoja, kun rajattu tarkistus riittää.

## Tietoisesti tämän suunnittelu-PR:n ulkopuolella

Ei Cloudflare-tilimuutoksia, DNS-muutoksia, GitHub Pages -asetusten muutoksia, deployta, koodimuutoksia, PR-mergejä, GSC-rekisteröintiä tai live-URL-migraatiota. Tuleva toteutus tehdään omassa erillisessä työhaarassa käyttäjän hyväksynnän jälkeen.

## Historiallisen suunnitelman päätösmuutokset

| Asia | 24.10. suunnitelma | 4.11. päätös |
| --- | --- | --- |
| Hosting | GitHub Pages tuotantoon aluksi | Cloudflare tuotantoon |
| GitHub Pages | Tuotantopalvelu | Mahdollinen noindex-staging |
| Domain | Aktivointi vasta myöhemmin | Coming Soon jo Cloudflare Pagesissa; ei korvata ilman lupaa |
| SEO/GSC | Siirtymä ja redirectit avoinna | Recipavo ainoa julkinen canonical; ei markkinoida GitHub URLia; indeksointi tutkitaan |
| CI | Pages-deploy mainista | Staging mainista, Cloudflare-tuotanto vain valtuutetulla promootiolla |
| Kielipolut | Ehdotuksia juurireiteiksi | Säilytetään toteutunut reittisopimus, muutetaan vain erillisellä päätöksellä |

**Päätösten lähteet:** käyttäjän 4.11. Cloudflare-tuotantolinjaukset; ReportHubin 24.10. Coming Soon -todisteet ja 2.11. liikenneauditointi; Reseptit-repon `.github/workflows/pages.yml`, `site/scripts/build-content.ts`.
