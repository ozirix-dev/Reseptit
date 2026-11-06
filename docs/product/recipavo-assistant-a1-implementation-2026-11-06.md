# Recipavo Keittiöapuri — A1: read-only julkaistu indeksi ja yhteinen haku

**Päiväys:** 6.11.2026  
**Tila:** A1-toteutus erillisessä PR:ssä. Ei AI-mallia, chat-käyttöliittymää, Worker-rajapintaa, laskutusavainta, Diary-integraatiota tai domainin vaihtoa.  
**Edeltävä suunnitelma:** [Keittiöapuri V1, PR #320](https://github.com/ozirix-dev/Reseptit/pull/320).

## Tavoite ja nykyisen toteutuksen käyttö

A1 ei kopioi reseptihakua: `searchAssistantCatalog` käyttää täsmälleen samaa `filterRecipes`-funktiota kuin nykyinen hakemisto. Hakukenttien semantiikka (hakutermit, kategoria, keto/VHH, aika, keittiö, ainesosaryhmä ja mahdollinen hyväksytty GK-luokka) pysyy siten yhteisenä. Luonnollisen kielen intenttijäsentäjä tulee vasta A2/A4-vaiheissa.

Uusi `site/src/features/assistant/catalog.ts` muodostaa rakentajan palauttamasta **status=published**-joukosta yhden `AssistantCatalog`-rakenteen per FI/EN/SV/TH-kieli. Mahdollinen raw-`draft`-lähde, virheellinen identiteetti, väärä reitti, kaksoiskappale tai rikkinäinen ravintoarvo hylätään. Jokaista tietuetta sitoo koko julkaistun `RecipeEntry`-objektin SHA-256.

Vain rajattu julkaistu tieto:
- `recipeId`, `locale`, oikea `routePath`, otsikko, kuvaus, luokka, ruokavalio, aika, vaikeus, tagit, keittiö ja ainesosaryhmä;
- määrällinen lähdeainesosaluettelo sekä reseptin annosmäärä;
- **jo julkaistut** makrot `nutritionPerServing`-kentässä; puuttuvat arvot pysyvät `null`-arvoina;
- julkaistujen kieliversioiden todelliset `routePath`-osoitteet, ei käännettyjä slugeja;
- yksittäisen julkaistun reseptiversion SHA-256 (`sourceVersion`).

**Ei indeksiin:** GK-numeroita, GK-only-versioiden laskentatuloksia, GI-analogioita, raakaa evidenssiä, koko valmistusohjeen HTML:ää, kuvan `srcSet`-riviä, keskeneräisiä reseptejä tai käyttäjädataa. GK-luokkarajaus toimii vain, jos kutsuja antaa jo nykyisellä sivustolla julkaistun hyväksytyn `glycemicLoadFilterCategories`-taulukon. Muuten palautuu `requires_gk_evidence` ja tyhjä tulos; mitään uutta GK:ta ei lasketa.

## Build ja tiedostot

`site/scripts/build-content.ts` kirjoittaa nykyiseen, joka ajossa uudelleen luotavaan `site/public/data/`-hakemistoon:

- `assistant-manifest.json` — versio 1 ja neljän kielen indeksien tiedostonimet, SHA-256 ja tietuemäärät;
- `assistant-fi-<sha20>.json`, `assistant-en-<sha20>.json`, `assistant-sv-<sha20>.json`, `assistant-th-<sha20>.json` — vain kun kyseisessä kielessä on julkaistuja reseptejä.

Hashit suojaavat välimuistin vanhenemiselta; manifestin SHA-256 voidaan tarkastaa ennen datan käyttöä. Indeksit eivät muuta `routes.generated.ts`-reittejä, canonicaleja, SEO-kuvia, nykyistä hakudataa eivätkä sivun JS-bundlea. Ne ovat **julkisia, laiskasti haettavia JSON-asset-tiedostoja**; A1 ei tee niihin verkkokutsua. Nykyisen GitHub Pages -ympäristön asset-osoite on polun `/Reseptit/data/...` alla. Uuden domainin/base-polun ohjaus ei kuulu A1:een.

### Paikallinen tarkistus

~~~powershell
cd site
npm ci
npm run content:sync
npm exec -- tsx --test tests/assistant-catalog.test.ts
npm run build
npm test
npm run test:static
~~~

Build synkronoi julkaistut reseptit tavalliseen tapaan; A1:n omat testit ovat mukana `npm test` -komennossa. Koodimuutoksen varsinainen CI-tulos sidotaan PR:n viimeisimpään SHA:han ennen Ready-tilaa.

## Kattavuus ja hyväksymiskriteerit

1. Neljän kielen tietuemäärät vastaavat julkaistujen `siteContent.recipes`-tietueiden määriä.
2. Kaikki avustajan ID:t, URL:t ja kielivaihdot ovat julkaistusta lähteestä; ei oletuslinkkejä.
3. Haku palauttaa samoilla suodattimilla samat reseptit ja saman järjestyksen kuin `filterRecipes`.
4. Numerolliset makrot tulevat vain julkaistusta `RecipeEntry.nutrition`-sisällöstä; `null` säilyy.
5. GK-numeroita ei ole indeksissä eikä niitä muodosteta tekstistä; GK-rajaus ilman hyväksyttyä luokkakarttaa pysähtyy.
6. Indeksien SHA-256 täsmää manifestiin; erilaiset reseptiversiot eivät voi olla saman alkuperäisen `sourceVersion`-arvon takana.
7. GitHub Pages / nykyinen etusivu, blogi, kielipolut, reseptihaku, kuvat ja SEO pysyvät ennallaan.
8. A1:n tiedostomuutokset rajataan vain omaan indeksiin, build-kytkentään, testeihin ja dokumenttiin; ei `RecipesPage.tsx`-, `router.tsx`-, `styles.css`- tai GK-laskennan muutoksia.

## Jatko

**A2:** tuo nelikielisen mock-keskustelukäyttöliittymän vasta, kun #312:n ja H2-kirjaston muutokset on sovitettu. A2:n haun lähde on tämä manifesti; chat pitää pois näkyvistä feature-flagin takana.

**A3:** Cloudflare Worker käyttää samaa versiollista snapshotia/indeksisopimusta palvelimella ja tarkastaa originit, request-mitat sekä käytön kiintiöt. LLM saa korkeintaan intentin tulkinnan, ei auktoriteettia faktavastauksille.

**A4/A5:** nelikielinen laatu- ja tietosuojatestaus ennen AI-palvelun maksettua käyttöönottoa. Ei muuteta Coming Soon -projektia tai julkaista `www.recipavo.com`iin ilman erillistä lupaa.
