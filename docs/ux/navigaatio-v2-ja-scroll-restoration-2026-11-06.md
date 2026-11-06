# Navigaatio V2 ja koko sivuston vierityskorjaus

Päiväys: 6.11.2026. Rajattu toteutus nykyiseen GitHub Pages -julkaisupohjaan.

## Lähtöongelmat

1. Kielenvalinta (Suomi / English / Svenska / ไทย) ja sisältöosiot (Ruokaopas / GK-opas) ovat samalla rivillä yhtenä ryhmänä ja sekoittuvat keskenään.
2. React Router -sisäinen linkki säilyttää edellisen sivun scroll-kohdan, jolloin blogi- tai reseptisivu voi avautua keskeltä. Ongelma ei rajoitu päävalikkoon.

## Ratkaisu
- `site/src/SiteNavigation.tsx` jakaa navigaation semanttisesti eri `nav`-elementteihin: sisältöosiot / kielet.
- Desktop: yksi rivi, erilliset ryhmät ja visuaalinen erotin.
- Tabletti (701–1099 px): kielet oikealla ylärivillä ja sisältöosiot toisella rivillä.
- Mobiili (enintään 700 px): kaksi natiivia `<details>`-valitsinta Valikko ja FI/EN/SV/TH. Toimivat myös ilman JavaScriptiä; navigoinnin jälkeen valinnat sulkeutuvat.
- Kaikille kielille reseptikirjaston linkki; vain suomenkielinen Ruokaopas selvästi merkitty muilla kielillä FI-versioksi. GK-oppaan linkki säilyy nykykielisenä.
- Kielenvaihto säilyttää reseptin vastaavan käännöksen, mikäli sellainen on reittidatassa; puuttuvalla käännöksellä palataan valitun kielen reseptihakemistoon.
- `<ScrollRestoration />` vain kerran juurilayoutissa: PUSH uuteen sivuun -> sivun alku, ankkuri -> kohde, selaimen Back/Forward -> aiemman sivun scroll-asento.
- Reseptihakemistossa `navigate(..., { replace:true, preventScrollReset:true })` sekä suodatinmuutokselle että nollaukselle. Suodattimet eivät pyyhkäise lukijaa turhaan ylös.

## Rajaukset
- Ei hero-/etusivuesikatselun muutoksia, ei kirjastoreitin muutoksia, ei blogisisällön muutoksia, ei ravinto/GK-arvomuutoksia, ei uusia kielikäännöksiä.
- Recipavo.com-domainia ja analytiikkaa ei muuteta.

## Tarkistukset
- `npm run build`, `npm run test:static`, `npm run test:browser`, `npm run audit:seo` sekä valitut CI-ryhmät.
- Navigaation yksikkötestit: semanttiset navit neljässä kielihakemistossa, fi-only blogi, olemassa oleva reseptikäännös, GK-oppaan kieliversio, ScrollRestoration ja filter scroll reset -poikkeus.
- Playwright: desktop-ryhmittely, tabletin kaksirivisyys, mobiilin `details`-käyttö, blogin linkistä uuden sivun alku, selaimen Takaisin-toiminnon palautus sekä reseptin valmistusankkuri.
- Julkaisun jälkeen tuotannon klikkausketju: blogi -> artikkeli -> takaisin -> GK-opas -> reseptit; tarkista URL, vierityspaikka ja mobiilin avautuva valikko. Julkaisu vasta vihreällä CI:llä.
