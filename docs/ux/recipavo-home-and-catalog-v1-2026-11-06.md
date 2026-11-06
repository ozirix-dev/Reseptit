# Recipavo: etusivu ja erillinen reseptikirjasto V1 – päätös- ja toteutussuunnitelma

**Päivä:** 6.11.2026  
**Tila:** suunnitelma / katselmointiluonnos, **ei koodimuutosta eikä merge-, deploy- tai domain-cutover-lupaa**  
**Perusta:** Reseptit `main` `4c6eefd88a6fe28e1c592058e7af1c34716c7fd1`; toteutuksen alkaessa tarkistetaan uusin main ja rinnakkaiset PR:t.

## 1. Arvio ja ehdotettu päätös

Nykyinen aloitusnäkymä on nelikielinen reseptihakemisto: `RecipesPage` tekee haun ja listaa suodattamattomassa tilassa **jokaisen saman kielen reseptikortin**. `RecipeAbout` ja tekijänoikeus- ja lähdekäytäntö ovat footerissa pitkän korttilistan jälkeen. Rakenne toimii hakemistona mutta ei Recipavon palvelun etusivuna. Myös korttien määrä, erittäin pitkä vieritysmatka sekä alareunan huono saavutettavuus lisääntyvät reseptien kasvaessa. Tämä havainto **ei yksin todista** huonoa LCP-arvoa, suorituskykyregressiota tai käyttäjien käyttäytymistä; niitä mitataan erikseen.

**Suositeltu tavoite:** erotetaan **Etusivu (löydä kiinnostavaa + aloita haku)** ja **Kaikki reseptit (täysi haku/suodatus + 24 korttia/sivu)**. Etusivu ei ole mainossivu vaan lyhyt toimiva väylä ruoanlaittoon. Alatunniste tulee saavutettavaksi ilman satojen korttien selaamista.

Käyttäjän päätettävä raja: tämän dokumentin hyväksyntä avaa toteutuksen suunnittelun, ei automaattisesti uutta tuotantokokemusta. Omistajalla säilyy erillinen katselmointi- ja julkaisupäätös.

### Vertailu

| Vaihtoehto | Hyödyt | Haitat / päätös |
|---|---|---|
| A: kaikki kortit etusivulla (nykyinen) | Kaikki näkyvät ja klikattavissa yhdellä sivulla | Etusivu ei esittele palvelua, footer kaukana. **Ei suositella kasvupoluksi.** |
| B: nykyinen sivu, pelkkä `Näytä lisää` | Pieni tekninen muutos ja lyhyempi DOM | Etusivu pysyy hakemistona; pelkän JS-painikkeen kautta avautuvat sivut ovat hankalia hakukoneille. **Väliaikainen vararatkaisu.** |
| C: lyhyt etusivu + erillinen sivutettu kirjasto | Selkeä palvelurakenne, pienempi näkyvä korttimassa, kasvaa blogiin/Diaryyn | Reitityksen, SEO:n ja vanhojen hakulinkkien ylläpito vaatii suunnittelua. **Suositus.** |
| D: automaattinen infinite scroll | Näennäisesti kitkaton selaus | Loputon lista, footer ja saavutettavuus edelleen ongelma; hakuindeksointi vaatii erilliset sivut. **Ei suositella.** |

Googlen dokumentaatio: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading. Google löytää luotettavasti linkitetyt `<a href>`-sivut, mutta ei käynnistä `Näytä lisää`-nappeja. Jokaisella indeksoitavalla sivutussivulla on oma URL ja self-canonical. Tästä syystä lista toteutetaan indeksoitavina sivuina, vaikka käyttöliittymä myöhemmin tarjoaa mukavuuspainikkeen.

## 2. Käyttäjätehtävät ja prioriteettijärjestys

1. **Löydä resepti heti:** hakukenttä näkyvillä, tekstihaku ja kategoria-/ruokavaliorajaukset toimivat. Hakua ei piiloteta kuvakarusellin tai tilinluonnin alle.
2. **Inspiroidu nopeasti:** kiinnostavat, toimituksellisesti valitut 6–9 *oikeaa julkaistua* reseptikorttia. Ei väitettä `suosituin`, `trendaa` tai `testattu` ilman tietoa.
3. **Valitse aihe:** selkeät oikopolut aamiaisiin, pääruokiin, leivonnaisiin sekä keto/VHH-suodatuksiin, vain kun kohteessa on reseptejä.
4. **Lue lisää:** Ruokaopas-artikkelit vasta, kun PR #303 tai vastaava oikeasti julkaisee ne. Aluksi vain FI-artikkelit; muilla kielillä ei keksittyä artikkelisisältöä eikä valheellista hreflang-paria.
5. **Ymmärrä ravintoarvojen rajat:** hillitty linkki nykyiseen GK-menetelmäselitteeseen, ei väitettä että kaikilla resepteillä olisi mitattu GK.
6. **Löydä luotettavuus- ja oikeustiedot:** lyhyt footer (Tietoa resepteistä, lähteet/tekijänoikeudet ja yhteys/korjauskanava) näkyy etusivun lopussa kohtuullisen vierityksen jälkeen.
7. **Päiväkirja tulevaisuudessa:** EI kirjautumis-, Plus-, kalenteri-, oma ateria- tai `Kirjaa`-painiketta etusivulle ennen toimivaa, hyväksyttyä tuotetta.

## 3. Etusivun sisältöspesifikaatio (V1)

| Järjestys | Osa | Ensimmäisen version toteutus |
|---|---|---|
| 1 | Header | Recipavo-brändi **vain hyväksytyssä brändi-/preview-tilassa**, selkeä Etusivu/Reseptit; Ruokaopas vain jos julkaistu, GK-menetelmä tarvittaessa; FI/EN/SV/TH-kielivalinta ja mobiilissa saavutettava valikko. Valikko ei saa paisua. |
| 2 | Lyhyt hero | Jo PR #301:ssä suunniteltu arvolupaus: `Maailman reseptit. Sinun arkeesi.` Ei uutta isoa herokuvaa. |
| 3 | Haku | Yksi selkeä hakukenttä; lähetys vie kyseisen kielen reseptikirjastoon toimivalla `?q=`-ehdolla; myös tyhjällä haulla käyttäjä pääsee kaikkiin resepteihin. |
| 4 | Aihepolut | 4–6 toimintakelpoista linkkiä oikeisiin suodatettuihin kirjastonäkymiin (ei kuvaa vain koristeena): esimerkiksi pääruoat, aamiainen, leivonnaiset, keto ja VHH. Lajitelmat ja kohteiden saatavuus validoidaan lähdedatasta. |
| 5 | Reseptipoiminnat | Enintään 9 korttia, mobiilissa 1 sarake ja muualla sopiva responsiivinen ruudukko. Jokainen linkkaa julkaistuun reseptiin; otsikko ja alt tulevat lähdedatasta. |
| 6 | Ruokaopas | FI-etusivulla enintään kaksi julkaistua oikeaa artikkelia. Ei näytetä ennen blogin reittien/SEO:n valmistumista. Muilla kielillä osio jätetään aluksi pois; valikkolinkki voi avata suomenkielisen Ruokaoppaan selkeällä `lang=fi`-ilmaisulla. |
| 7 | Mistä GK-arvio tulee? | Yksi ymmärrettävä tietoisku ja linkki menetelmän oikeaan kieliversioon. Ei kirjasto- tai reseptikohtaisen kattavuuden virheellistä yleistystä. |
| 8 | Footer | Nykyiset `Tietoa resepteistä` ja `Reseptien lähteet ja tekijänoikeudet` säilyvät, samoin palaute. Asetellaan luettavasti ja näppäimistöllä avattaviksi. |

**Poimintojen valinta:** ylläpidetty toimituksellinen `recipeId`-lista (enintään 9); vakaus, ei `Math.random`, ei päivittäin vaihtuvaa automatiikkaa. Tarkista julkaisutila, kyseisen kielen olemassaolo, kuva ja reitti buildissä. Jos kohde puuttuu, korvaa dokumentoidusta varalistasta tai jätä se pois; älä linkitä 404:ään. Älä näytä `uusimmat`-, `suosituimmat`- tai arvostelumerkkejä ilman tarkoitukseen sopivaa todennettua dataa. Pelkkä tiedostojärjestys ei määritä julkaisupäivää.

### Sisältöluonnos ja kielten vastaavuus

Nämä ovat **käyttöliittymätekstiehdotuksia**, eivät uutta julkaisulupaa. Heron varsinainen teksti otetaan olemassa olevasta `recipavoHeroCopy`-lähteestä ja tarkistetaan #301:n kanssa, ei tuoda toisena kilpailevana lokalisaatiotiedostona.

| Käsite | FI | EN | SV | TH |
|---|---|---|---|---|
| Yläosan lupaus | Maailman reseptit. Sinun arkeesi. | Recipes from around the world. Made for everyday life. | Recept från hela världen. För din vardag. | สูตรอาหารจากทั่วโลก สำหรับทุกวันของคุณ |
| Avaa kirjasto | Kaikki reseptit | All recipes | Alla recept | สูตรอาหารทั้งหมด |
| Poiminnat | Poimintoja resepteistä | Recipe picks | Recepttips | สูตรอาหารที่แนะนำ |
| Haku | Hae reseptiä tai ainesosaa | Search recipes or ingredients | Sök recept eller ingredienser | ค้นหาสูตรอาหารหรือวัตถุดิบ |
| Aiheet | Mitä tänään kokattaisiin? | What shall we cook today? | Vad ska vi laga idag? | วันนี้ทำอะไรกินดี |

Tekstien käännöslaatu tarkistetaan olemassa olevalla nelikielisellä QA-menettelyllä, eikä uusia kliinisiä/ravitsemuslupauksia lisätä. Vältä samalla sivulla kahta samanlaista suurta `H1`-otsikkoa.

## 4. Reittipäätös: säilytä nykyiset osoitteet

**Tavoite V1:** nykyiset kielikohtaiset resepti-indeksien osoitteet voivat muuttua lyhyiksi **etusivuiksi**, mutta ne **eivät katoa**. Kaikki yksittäisten reseptien `routePath`-osoitteet säilyvät täsmälleen. Kirjasto saa uudet osoitteet:

| Kieli | Nykyinen kielietusivu (säilyy) | Uusi kirjaston osoite (ehdotus) |
|---|---|---|
| FI | `/` | `/reseptit/` |
| EN | `/en/recipes/` | `/en/recipes/all/` |
| SV | `/sv/recept/` | `/sv/recept/alla/` |
| TH | `/th/recipes/` | `/th/recipes/all/` |

Kielietusivujen nykyisten polkujen säilyttäminen on yhteensopivuusratkaisu nykyiselle julkaisulle. Jos `www.recipavo.com`-lanseerauksessa joskus halutaan `/en/`, `/sv/` ja `/th/` omiksi etusivuiksi, sitä ei tehdä hiljaisesti tässä työssä: se tarvitsee erilliset 301/308-säännöt, SEO:n ja käyttäjän hyväksynnän.

**Sivutus:** 24 korttia / kirjastosivu oletuksena. Esirenderöidyt, oikeat `<a href>`-linkit seuraaville ja edellisille sivuille. Ensisijainen ehdotus staattiselle buildille `/reseptit/sivu/2/`, `/en/recipes/all/page/2/`, `/sv/recept/alla/sida/2/` ja `/th/recipes/all/page/2/`; tarkat nimet voidaan lukita ennen toteutusta. Vaihtoehto `?page=2` vaatii staattisen esirenderöinnin ja palvelinasetusten erillisen suunnittelun, joten sitä ei oleteta automaattisesti toimivaksi nykyisessä Vite/GitHub Pages -ympäristössä. Jos viimeisellä sivulla on vähemmän kortteja, kaikki näytetään; yli viimeisen sivun menevä reitti on oikea 404.

**Vanhojen hakulinkkien säilytys:** nykyiset `/?q=...`, `/?category=...`, `/?diet=...`, `/?gl=...` ja yhdistelmäparametrit sekä EN/SV/TH-vastineet ovat nykyisin jaettavia hakulinkkejä. Kun etusivu erotetaan kirjastosta, kyselyparametreja sisältävä *vanha indeksi-URL* ohjataan tai muunnetaan vastaavaan kirjaston osoitteeseen **säilyttäen hyväksytyt parametrit** ja niiden keskinäiset yhdistelmät. Toiminta testataan reloadilla, takaisin-näppäimellä ja suorilla linkeillä. Ei tehdä tyhjää hero-etusivua vanhan haun tuloksena. Haun perusfunktio `filterRecipes` ja tyypitetyt ehdot pysyvät yhtenä lähteenä.

**SEO ja kielireitit:** koti-, kirjaston sivu 1- ja sivutussivut saavat oikeat omat metatiedot, HTML-h1:n, self-canonicalin ja toimivat crawlattavat linkit. Hreflang-parit muodostuvat **vastaavista sivutyypeistä** (koti ↔ koti, kirjasto ↔ kirjasto, tarvittaessa sama sivunumero ja olemassa oleva kieli), eivät etusivusta erikielisen kirjastosivun vastineena. Hakusuodattimien URL-variantit eivät muodosta indeksoitavia tuhansia kombinaatioita; hyväksytty canonical/noindex-strategia testataan. Uudet sitemap-reitit ja auditoinnin `expectedPages` tuotetaan todellisista julkaistavista reiteistä. Reseptikohtaiset Recipe JSON-LD:t pysyvät vain reseptisivuilla.

**Staattisuus ja JS:** etusivun kortit, kirjaston ensimmäiset 24 korttia, sivutuslinkit, leipäteksti ja footer näkyvät jo esirenderöidyssä HTML:ssä ilman JavaScriptiä. Haku-/suodatinkontrollien hydratoitu lisätoiminta ei saa muuttaa ensimmäisen ruudun sisältöä yllättäen. Sivutus ei saa piilottaa ainoaa kulkua myöhemmille resepteille JS-napin taakse. Huomio: pelkkä korttien DOM-rajaus ei pienennä automaattisesti koko `RouteContent`-JSON-payloadia; sen koko ja uusien sivujen datarajaus arvioidaan erikseen ennen optimointiväitettä.

## 5. Toteutusjärjestys: pienet, rajatut PR:t

### H0 – tämä PR: päätösluonnos ja tekniset hyväksyntäkriteerit
- Vain tämä dokumentti. Ei JSX-, CSS-, reititys-, SEO-, resepti-, käännös- tai julkaisuympäristömuutoksia.
- Katselmoidaan oikea etusivusisältö, 6–9 poiminnan konsepti, kirjaston 24/sivu, reittikaavio ja viestit.
- Ehdotettu käyttökokemus hyväksytään ensin. Ei mergeä tai deployta tämän hyväksynnästä automaattisesti.

### H1 – erillinen staging-/preview-PR (nykyisen heron kanssa yhteensopiva)
- Lyhyt nelikielinen etusivuasettelu + toimiva haku ja julkaistut poiminnat. Käytetään #301:n `recipavoHeroCopy`-tekstiä ja olemassa olevaa preview-politiikkaa; ei oteta rinnakkaista ristiriitaista Hero-versiota.
- Pidetään tuotannon normaali build ennallaan, kunnes kirjastoreitit ja yhteensopivuustestit ovat mukana.
- Jos blogi #303 ei ole yhdistetty, Ruokaopas-kortteja ei renderöidä eikä niiden linkkejä arvata. Hero ei lisää kuollutta painiketta.
- Testit: neljä kieltä, mobiili 320/390/768 ja desktop 1440, no-JS, focus, responsiivisuus, ettei hero peitä hakua tai riko näppäimistöä.

### H2 – kirjaston erotus ja sivutus omana PR:nään
- Uudet eksplisiittiset reitit ja `RouteContent`-muutos, sivutettu staattinen SSR/SSG-listaus ja täysien reseptiyhteenvetojen tarvittava data hakuun.
- Yhteinen `filterRecipes`-logiikka, kyselyparametrien säilyvyys, oikea 404, sivu 1:n ja N:n canonical, hreflang, sitemap, selaintestit ja indeksoitavat `href`-linkit.
- Navigaation tila, fokus ja scrollin palautus: sivunvaihto alusta, reseptistä takaisin suodatettuun tulokseen, toimii myös näppäimistöllä.
- Ei satunnaista sorttia; vakaasta järjestyksestä sovitaan ennen julkaisua (esim. otsikko + resepti-ID tasatilanteissa). Ei `uusin` ilman päiväystä.

### H3 – varsinainen etusivu/kirjasto-erottelu ja hyväksytty julkaisu
- Vaihda kielietusivujen sisältö vasta kun H1 + H2 ja nelikielinen QA ovat läpäisseet.
- Vanhat hakulinkit ohjataan oikein, näkyvät reseptinumerot ja löydettävyys pysyvät; blogi näkyy vain toteutuneella kieli- ja reittikattavuudella.
- Vahvista domain-/SEO-migraation aikataulu erikseen PR #243:een pohjautuvasta `docs/recipavo-cloudflare-release-plan.md`-suunnitelmasta. **GitHub Pages -merge ei ole hyväksyntä julkaista www.recipavo.com-sivua.** Coming Soon säilyy, ellei omistaja nimenomaisesti hyväksy cutoveria SHA-sidottuna.
- Laadi rollback: feature flag takaisin vanhaan indeksiin, kirjastoreitit voidaan pitää, eikä reseptien suoria URL:eja vaihdeta.

## 6. Hyväksymiskriteerit ja regressioiden esto

- [ ] Etusivulla enintään 9 julkaistua reseptikorttia ja footer ilman valtavaa korttilistaa; ensimmäinen toimintakelpoinen haku näkyy heti.
- [ ] Kaikki julkaistut reseptit löytyvät kirjastosta ja suoralla linkillä; ei pudonneita reseptejä kielittäin tai suodatusluokittain.
- [ ] Sivutussivu 2 ja viimeinen sivu toimivat ilman JS:ää; sivuilla on linkitetty seuraava/edellinen, eikä sivuja ole canonicaloitu kaikki sivulle 1.
- [ ] Neljän kielen koti- ja kirjastolinkit sekä kielivaihdot pysyvät järkevinä; olemattomat blogikäännökset eivät näy.
- [ ] Vanhat `?q`, `?category`, `?diet`, `?time`, `?cuisine`, `?ingredient`, `?gl` yhdistelmät säilyvät suoraan avattavina ja jaettavina.
- [ ] GK-puutteet, suodatinluokat ja niiden selitteet eivät muutu tämän työn sivuvaikutuksena.
- [ ] Canonical, hreflang, sitemap, 404, metadata, Recipe JSON-LD ja mahdollinen blogin BlogPosting JSON-LD läpäisevät `test:static` ja SEO-auditoinnin.
- [ ] Ruudunlukijan otsikkotasot, fokus, näppäimistö, 200 % zoom, mobiili 320/390 px sekä no-JS-hakusivusto testattu.
- [ ] Vertaillaan HTML:n kokoa, JSON-hydraatiopayloadia, korttien määrää ja selainmittausta *ennen/jälkeen* samaan laitteeseen/verkkoon. Ei keksittyjä prosenttiparannuksia.
- [ ] Uudelle #303:n blogipohjalle (jos integroitu) kohdistetaan oma ristiintestaus hero-, router- ja prerender-koodin kanssa.
- [ ] Mahdolliset uudet GA/Plausible/GSC-mittaukset vasta hyväksytyn domain-, tietosuoja- ja analytiikkasuunnitelman mukaan; ei lisätä seurantoja tähän PR:ään.
- [ ] Oikea PR HEAD + CI/selain/SEO + käyttäjän katselmus ennen hyväksyntää; tuotantopromootio erikseen.

## 7. Törmäys- ja omistajuuskartta (tarkastettu 6.11.2026)

- `#301` hero-vaihe 1 **sisältyy nykyiseen mainiin** preview-koodina; vanha `docs/ux/recipavo-homepage-phased-rollout-2026-11-05.md` on vaihe 0–1:n periaatelähde. **Tämä suunnitelma täydentää sitä erotetulla kirjastolla, ei kumoa arvolupauksen tai varovaisen esikatselun päätöksiä.**
- `#303` **avoin Draft**: Ruokaopas V1. Se muuttaa `site/src/router.tsx`, `site/scripts/prerender.ts`, `site/src/SeoMeta.tsx`, `site/scripts/seo-audit.ts`, `site/src/main.tsx` ja muita blogitiedostoja. **H1/H2:n kooditöihin ei kosketa niihin ennen blogin integraatiopäätöstä**; mieluiten #303 valmistuu ja sille tehdään regressiopohja ensin.
- `#305` Rouva Keto -lähdekartoitus ja muut GK-/reseptien PR:t voivat lisätä julkaistuja reseptejä. Poiminnat ja sivumäärät lasketaan aina buildin julkaistusta datasta, eikä suunnitelma lukitse reseptien kokonaislukua.
- `#295` käyttäjän reseptituonti ja `docs/product/recipavo-product-strategy.md` ovat eri tuotevaiheita; ei tilikirjautumista eikä oman reseptin tuontia etusivulle ennen ominaisuuden valmistumista.
- `docs/recipavo-cloudflare-release-plan.md`: `www.recipavo.com` lanseeraus ja GitHub Pages -staging ovat erilliset asiat. Tämä dokumentti **ei muuta** Cloudflaren Coming Soonia eikä korvaa tuotantopäätöstä.

## 8. Avoimet omistajapäätökset ennen H1:n koodia

1. Hyväksytäänkö perusperiaate **lyhyt etusivu + erillinen kaikki reseptit** (suositus C)?
2. Onko **6–9 poimintaa / 24 kirjastokorttia per sivu** sopiva ensiversion oletus?
3. Hyväksytäänkö yllä oleva nykyisiä URL:eja säilyttävä nelikielinen kirjastopolku; myöhemmät `/en/` ym. käsitellään erikseen?
4. Näytetäänkö Ruokaoppaan FI-kortit vasta #303:n julkaisun jälkeen (suositus) ja muilla kielillä toistaiseksi vain merkitty FI-linkki?

Tämä PR on suunnitelma eikä muuta käyttäjien näkemää sivustoa.
