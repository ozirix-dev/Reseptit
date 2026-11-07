# Recipavo H2 – erillisen reseptikirjaston sivutusydin

Päivä: 6.11.2026. Tila: **toteutettu erillinen TypeScript-ydin ja testit, DRAFT; ei uusia julkisia reittejä eikä julkaisua**.

## Riippuvuus ja vaihe

H1-esikatselu (#312) integroitiin mainiin `79589b2`. Sen main-työnkulun rakennus ja Pages-deploy olivat PASS ennen H2-haaran avaamista. PR #316 korjaa esikatselun hydraation SEO-merkinnät erillisessä integraatiossa. H2:n lähdetiedostot eivät muuta #316:n tai #312:n omia kirjoitusalueita.

## Jo tehty

- `site/src/features/recipes/recipe-pagination.ts`: neljä kielikohtaista kirjastoreittipohjaa, turvallinen sivunumeron parsinta ja 24 julkaistun reseptin sivukoko.
- Sivu 1 on `/reseptit/`, `/en/recipes/all/`, `/sv/recept/alla/` tai `/th/recipes/all/`; sivu N on `/reseptit/sivu/N/`, `/en/recipes/all/page/N/`, `/sv/recept/alla/sida/N/` tai `/th/recipes/all/page/N/`.
- Jokaiselle sivulle annetaan canonical-polku, edellinen/seuraava-linkkipolut, kohteet ja kokonaismäärä. Virheellinen tai viimeisen sivun ylittävä sivunumero ei muuta itseään hiljaisesti sivuksi 1.
- Järjestys on deterministinen julkaistun resepti-ID:n perusteella. Ei keksittyä `suosituin`-, `uusin`- tai arvioperusteista järjestystä.
- `site/tests/recipe-pagination.test.ts`: tarkistaa ettei reseptejä huku tai monistu, kielten eristys, sivukoot, reitit, 404-ehdot ja vakaus. Testi mukana normaalissa `npm test`-ajossa.

## Seuraavat H2-integraatioportit – EIVÄT mukana tässä PR:ssä

1. Päivitä `site/src/content/route-data.ts` ja sisältömanifesti niin, että kukin julkaistava kirjastosivu sisältää vain juuri sen tarvitsemat 24 reseptiyhteenvetoa. Hae ja suodata kokonaista reseptijoukkoa erillisellä rajatulla indeksillä; pelkkä 24 kortin renderöinti ilman datan rajausta ei ole todellinen sivutus.
2. Lisää eksplisiittiset reitit ennen nykyisiä `:slug`-reittejä `site/src/router.tsx`:ssa, uudet otsikot, linkit ja nelikielinen navigaatio. Etusivun lyhentäminen vasta kun kirjastoreitit ovat toimivia.
3. Säilytä vanhat `/?q=`, `?category=`, `?diet=`, `?gl=`, `?time=`, `?cuisine=`, `?ingredient=` ja näiden yhdistelmät. Uudet kirjastoreitit eivät saa rikkoa käyttäjien tallentamia linkkejä.
4. Lisää reitit prerenderöintiin ja `sitemap.xml`:ään sekä SEO-auditoinnin `expectedPages`-inventaarioon. Jokainen oikea sivutussivu saa oman self-canonicalin, 404-tarkistuksen ja vain olemassa olevat kielivastineet. Ei lähetetä tyhjiä /page/N/-sivuja hakukoneille.
5. No-JS-testit: sivulta 1 pääsee sivulle 2 ja viimeiselle sivulle tavallisilla `<a href>`-linkeillä. SEO-testit, selain, mobiili ja saavutettavuus mukaan ennen tuotantoon vaihtoa.
6. Blogi #309:n kaksi FI-artikkelia voidaan esitellä etusivulla vasta erillisen etusivuintegraation hyväksynnässä. Ei näytetä olemattomia EN/SV/TH-artikkeleita.
7. Ei `www.recipavo.com`-domainin cutoveria tai Cloudflaren Coming Soon -muutosta ilman erillistä valtuutusta.

## Julkaisuportti

Tämä on H2:n laskennallinen perusta, **ei loppukäyttäjälle näkyvä kirjaston sivutus**. Avaa toteutuskokonaisuus omassa H2-integraatio-PR:ssä vasta tämän ydinosan testien ja avoimien julkaisujen hyväksynnän jälkeen. PR voidaan yhdistää myöhemmin ilman käyttöliittymän käyttäytymismuutosta, mutta omaa merge-/deploy-päätöstä ei pidä ohittaa.
