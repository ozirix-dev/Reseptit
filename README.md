# Recipavo (Reseptit)

**Recipavo** on nelikielinen reseptisivusto. Tämä `Reseptit`-repo sisältää
kanoniset Markdown-reseptit ja staattisen verkkosovelluksen.
[Julkinen sivusto](https://ozirix-dev.github.io/Reseptit/) julkaistaan
GitHub Pagesissa.
[Cloudflare Pages -V1-esikatselu](https://final-recovery.recipavo-v1-preview.pages.dev/)
on erillinen testijulkaisu, ei sama kuin GitHub Pagesin julkinen sivusto.

Suomi on lähdekieli; englanti, ruotsi ja thai ovat reseptikohtaisia käännöksiä.
Hakemisto, haku, suodattimet ja annoslaskuri ovat käytössä.

## Sisältö ja rakenne

- `reseptit/{aamupalat,alkuruoat,paaruoat,jalkiruoat,leivonnaiset}/`: lähdereseptit.
- `kaannokset/{en,sv,th}/`: kieliversiot samalla `recipe_id`-tunnuksella.
- `kuvat/`: versionoidut WebP-kuvat.
- `site/`: Vite/React-sovellus, sisältöbuild, esirenderöinti ja testit.
- `meta/`: luokitukset, ravintokentät ja käännössanasto.
- `docs/`: ylläpito-ohjeet ja päivätyt tarkistusraportit.
- `reseptit/raakileet/`, `arkisto/`, `_mallipohjat/` ja `tmp/` eivät ole julkaisulähteitä.

Aamupalat ja välipalat ovat omia selailukategorioita. `reseptit/valipalat/`
-kansiota ei nykyisessä mainissa ole; keskeneräisiä välipaloja säilytetään
`status: draft` -tilassa eikä niitä julkaista automaattisesti.
Ruokavalioluokka ja tagit tallennetaan metatietoihin.
Pelkkä `status: published` ei ohita karanteenia, lähde- tai hyväksyntäportteja.
Ajantasainen määrä saadaan lähteistä, ei tästä dokumentista:

```powershell
cd site
npm ci
npm run report:inventory
```

Komento generoi sisällön ja näyttää kieliversioiden, reittien ja kuvien määrät.
Päivätyt raportit ovat oman tarkistushetkensä tilannekuvia.

## Uuden reseptin lisääminen

1. Käytä `reseptit/_mallipohjat/resepti/`-pohjaa. Valitse oikea sisältökansio.
2. Valitse pysyvät `recipe_id` ja `url_slug`: pienet ASCII-kirjaimet ja
   yhdysmerkit. Älä muuta julkaistua URL-osoitetta toimituksellisen korjauksen vuoksi.
3. Tallenna ainekset frontmatterin `ingredients`-riveiksi: `amount`, `unit`,
   `item` ja tarvittaessa `note`. Määrät ovat numeroita tai `null`.
4. Kirjoita yksilöllinen ingressi, kuvaus, numeroidut valmistusvaiheet ja
   valmistamista auttavat muistiinpanot. Tarkista annokset, työjärjestys ja ajat.
5. Ilmoita ravintoarvot vain perustellusta ja reseptiversioon sidotusta
   laskennasta; puuttuvia arvoja ei saa esittää nollina. Numeerista GK:ta
   ei julkaista ilman hyväksyttyä laskentaa; käytä sallittua
   `GK: ei määritetty` -tilaa, kun se on perusteltu. Tavallista riisiä,
   pastaa tai perunaa sisältävä ruoka ei saa keto-luokitusta.
6. Lisää WebP-kuva `kuvat/`-hakemistoon. `image.src` on suhteellinen polku
   kuvan juureen; `alt`, `width` ja `height` vastaavat oikeaa kuvaa.
   Build generoi responsiiviset lisäresoluutiot automaattisesti; niitä ei tarvitse
   ylläpitää reseptien metatiedoissa.
7. Pidä keskeneräinen resepti luonnoksena. Varmista valmistus, allergeenit,
   lähde- ja ravintoevidenssi sekä kuvan vastaavuus. Suorita muutoksen
   edellyttämät tarkistukset ennen PR:ää.

Metatietojen tarkka sopimus on [schema.ts](site/src/content/schema.ts).
Kuvien build validoi polut ja tiedostot ja käsittelee vain julkaistun sisällön kuvat.
Katso [responsiivisten kuvien ylläpito](docs/responsive-images.md).

Hakemiston raaka-aineryhmät johdetaan suomenkielisistä `main_ingredient`-arvoista
ja aluekeittiöt tageista. Tunnistetut arvot ovat tiedostossa
[recipe-facets.ts](site/src/content/recipe-facets.ts).
Kun lisäät uuden sanamuodon olemassa olevaan ryhmään, päivitä sen arvolista
ja hakusuodattimen regressiotesti. Ryhmät eivät kata kaikkia aineksia:
esimerkiksi riisi, jauhot ja kerma eivät kuulu nykyisiin seitsemään ryhmään.
Luokittelua ei päätellä kuvasta tai ravintoarvoista.

## Käännöksen lisääminen

Kopioi rakenne saman luokan kielikansioon. Säilytä `recipe_id`, määrät,
annokset, valmistuksen merkitys ja ravintoarvot. Aseta `language`,
`translation_of`, `source_recipe` ja kohdekielen pysyvä `url_slug`.
Käännä myös kuvaus, huomiot ja kuvan vaihtoehtoinen teksti.

Päivitä lähteen `translation_languages` ja `translation_status` samassa
muutoksessa. Noudata [käännösten tarkistuskäytäntöä](docs/translation-review-policy.md)
ja [ruokasanastoa](meta/kaannokset/ruokasanasto.md).
Käytä ajantasaista käännösjonoa (`cd site && npm run queue:translations`).
Käännösten katselmointinäyttö ja merkitystiivisteet sidotaan täsmälliseen
FI-lähteeseen; ks. `meta/kaannokset/codex-review-evidence.json`.
Osaa lähteistä koskee lisäksi
[F25:n erillinen hyväksyntäportti](meta/kaannokset/f25-release-gate.json):
vihreä käännöstesti tai FI:n `published`-merkintä ei yksin riitä.
Automaattinen läpäisy ei korvaa sisällöllistä kielikatselmointia.

## Kehitys ja tarkistukset

Valitse ensin muutoksen riskin mukaiset kohdennetut tarkistukset.
Laajaa regressiota varten komennot suoritetaan `site/`-kansiossa:

```powershell
npm ci
npm test
npm run test:translations
npm run test:image
npm run build
npm run test:static
npm run test:browser
npm audit --audit-level=low
npm run preview
```

Selaintestit tarvitsevat Playwrightin Chromiumin (`npx playwright install chromium`)
tai ympäristömuuttujan `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, joka osoittaa
asennettuun Braveen. Repon juuressa suoritetaan myös `git diff --check` ja
`scripts/lint-markdown.ps1`. Testit eivät julkaise tuotantoon.
GitHub Actions valitsee PR:n testit muutosriskin perusteella; pakollista
CI:tä ei ohiteta. Työhaarojen ja Repo Guardin säännöt ovat
[AGENTS.md](AGENTS.md)-tiedostossa ja
[rinnakkaisten Codex-ajojen ohjeessa](docs/rinnakkaiset-codex-ajot.md).

## Lataus, SEO ja julkaisu

Build tuottaa jokaiselle julkaistulle reitille valmiin HTML:n ja turvallisesti
upotetun lähtödatan. Hakemisto käyttää yhden kielen hakutietoja ja reseptisivu
yhden reseptin sisältöä. Siirtyminen toiselle reitille hakee tarvittaessa
sisältötiivisteellä nimetyn JSON-tiedoston. Yhteinen JavaScript ei sisällä koko
reseptikirjastoa. Haku ja suodattimet toimivat nykyisen hakemiston datassa.

HTML sisältää reseptit ja linkit myös ilman JavaScriptiä. Hydraation jälkeen
annoslaskuri, haku ja query-osoitteet toimivat. Canonicalit, hreflang,
Recipe-JSON-LD ja sitemap syntyvät julkaistusta sisällöstä.

GitHub Actions tarkistaa PR:t. `main`-haaran sivustomuutokset käynnistävät
GitHub Pages -julkaisun; pelkkä PR tai vihreä PR-CI ei ole julkaisun todiste.
Cloudflare Pages -esikatselu varmennetaan erikseen täsmälliseen versioon
sidottuna. Hyväksyttävät, toisistaan riippumattomat reseptit voidaan julkaista
mukautuvissa erissä; vaikea GK- tai turvallisuustapaus ei saa estää muita
valmiita reseptejä. Merge tehdään projektin Repo Guard -menettelyllä.
Katso [julkaisuarkkitehtuuri](docs/julkaisuarkkitehtuuri_github_pages.md),
[eräjulkaisujen toimintatapa](docs/rinnakkaiset-codex-ajot.md) ja
[V1.4:n historialliset suorituskykymittaukset](docs/reports/2026-10-22-v1-4-performance.md).

## Ylläpidon rajat

Tämä julkinen repo ei ole salaisuuksien tai yksityisten muistiinpanojen säilytyspaikka.
Reseptit ja tekninen toteutus kuuluvat tänne; ReportHub kokoaa päätös- ja
handoff-kontekstin. Lisenssiä ei ole lukittu: julkisuus ei yksin anna vapaata
sisällön uudelleenkäyttöoikeutta.
