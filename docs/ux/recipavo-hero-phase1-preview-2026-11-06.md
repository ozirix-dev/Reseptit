# Recipavo Hero – vaihe 1, staging-esikatselu (6.11.2026)

**Tila:** toimiva, ympäristömuuttujalla rajattu käyttöliittymäluonnos; EI Recipavon tuotantojulkaisu.
**Riippuvuus:** vaihe 0, PR #293. Tämä vaihe on oma pinottu PR, eikä se saa ohittaa PR #293:n katselmointia.

## Toteutus

- Nelikielinen FI/EN/SV/TH Recipavo-otsikko, tiivis käyttäjälupaus, header-brändi ja footer.
- Nykyinen, toimiva reseptihaku suodattimineen pysyy heti tekstiosion alla. Ei suurta herokuvaa, karusellia, rekisteröitymiskehotetta tai kuvitteellista Päiväkirja/Plus-ominaisuutta.
- Nykyisen Reseptit-palvelun normaali build **ei muutu ulkoasultaan**: kytkin on oletuksena poissa.
- Stagingissa opt-in `VITE_RECIPAVO_HERO_PREVIEW=true` ennen buildiä. Vite-client ja SSR-prerender lukevat saman arvon. Preview-sivuihin lisätään `robots=noindex,nofollow`, mutta stagingin robots-, canonical-, hreflang- ja julkaisupolitiikka on varmistettava erikseen.
- Normaalia SEO-, domain-, kuorma- tai reseptidataa ei muuteta. Preview ei ole tuotannon SEO-migraation hyväksyntä.

## Paikallinen kokeilu

Esimerkiksi PowerShellissä (vain paikalliseen/staging-kokeiluun):

```powershell
cd site
$env:VITE_RECIPAVO_HERO_PREVIEW = 'true'
npm run build
npm run preview
Remove-Item Env:VITE_RECIPAVO_HERO_PREVIEW
```

Vertaa sitten tavalliseen buildiin ilman ympäristömuuttujaa. **Älä käytä tätä kytkintä GitHub Pages -tuotantoajossa tai Cloudflare-tuotantodeployssa.** Vanha GH Pages on nykyinen tuotanto eikä tämä PR tee cutoveria.

## Varmennusportti ennen Ready/mergeä

1. `npm run build`, `npm run test:static`, `npm run test:browser` ja kohdennettu `npx tsx --test tests/recipe-search.test.ts` onnistuvat nykyisellä HEADillä.
2. FI/EN/SV/TH: desktop 1440 px, tabletti 768 px ja mobiili 320/390 px. H1/SEO-kuvaus vastaa esikatselussa toisiaan ja HTML/React-hydraatio ei eroa.
3. Näppäimistö, ruudunlukijan labelit, suurennettu tekstikoko, no-JS-tilanne, lisäsuodattimien oletussulku, haku, `?q=`, `?diet=`, `?gl=low`, reseptikortit ja takaisin-navigointi säilyvät.
4. Tavallisen buildin HTML ei saa sisältää Recipavo-esikatselun H1:tä eikä `robots=noindex`-lisäystä tästä muutoksesta. Preview-buildin HTML saa ne, mutta sitä ei saa indeksoida tai julkaista tuotantona.
5. Omistaja tarkistaa FI- ja EN-/SV-/TH-tekstien merkitysvastaavuuden hyväksyntäportissa. Tarvittaessa korjataan ilman uusia ravitsemusväitteitä.

## Blogin oma valikkokohta

Blogia kehitetään rinnakkaisessa työssä. Julkinen **Blogi**-navigaatiolinkki lisätään vasta, kun blogin oikeat sivut ja kielireitit ovat olemassa ja niillä on hyväksytyt canonical-/hreflang-ratkaisut. Tämän Hero-esikatselun PR ei luo blogin reittejä eikä dead-end-CTA:ta. Blogin toteutus tarkistaa ristiriidat `site/src/router.tsx`-tiedostossa ja huolehtii pienillä näytöillä navigaation luettavuudesta. Blogin linkkiä ei pidä sitoa Recipavon Heron käyttöönottoon; se on oma julkaisuporttinsa.

## Vaihe 1:n lopullinen tuotantokäyttö on myöhempi päätös

Yhdistäminen, Cloudflare-domainin kytkentä, uusi canonical/hreflang/sitemap/robots, absoluuttiset linkit, mahdolliset redirectit ja julkaisuvaltuutus ovat erillinen julkaisuportti PR #243:ssa suunnitellun työn jälkeen. Tämä PR ei toteuta kyseisiä infrastruktuurimuutoksia, eikä julkaise Recipavoa.

## Palautus

Esikatselun saa pois jättämällä `VITE_RECIPAVO_HERO_PREVIEW`-muuttujan asettamatta. Normaalin sivun haku ja sisältö eivät tarvitse uuden Heron koodia. Jos esikatselussa havaitaan ongelma, peru tämä PR; vaihe 0 pysyy erillään.
