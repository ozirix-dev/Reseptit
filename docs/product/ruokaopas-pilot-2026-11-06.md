# Ruokaopas V1 – toteutus, rajat ja hyväksyntä

Status: Draft-PR katselmukseen 6.11.2026. Ei merge- eikä deploy-lupaa.

## Päätökset

- Julkinen blogi nimellä **Ruokaopas** reittiin `/ruokaopas/`, erilliset artikkelit `/ruokaopas/:slug/`.
- Aluksi vain kaksi suomenkielistä tekstiä. Englannin, ruotsin ja thain kielivalinnat johtavat edelleen reseptihakuihin; Ruokaopas-linkki ilmaisee `lang=fi`. Älä lisää olemattomia hreflang-versioita.
- Reitit tuodaan mukaan samaan staattiseen HTML-esirenderöintiin, sitemap.xml-tiedostoon ja reittimanifestiin kuin reseptit. BlogPosting JSON-LD vain artikkeleille.
- Ei uutta palvelinta, tietokantaa, CMS:ää, kommentointia, kirjautumista, feikkiarvosteluja, GK-arvauksia tai kuvitteellisia koepaistoja.
- Omat SVG-havainnekuvat V1:ssä; kuvia ei esitetä valokuvina tai todellisina testituloksina. Molemmille oma alt-teksti.
- Ei muutoksia reseptihaun hero-elementteihin, suodattimiin tai nelikielisiin reseptiteksteihin. Hero-vaihe 0 oli PR #293, joka yhdistyi mainiin 6.11.2026; myöhempi hero-brändimuutos omassa työssään.
- Perusta tukee uuden artikkelin lisäämistä blog-dataan ja automaattista reitin/sitemapin muodostusta; tarvittaessa erillinen Markdown-sisältöputki vasta käyttäjäpalautteen jälkeen.

## Ensimmäiset artikkelit

1. `/ruokaopas/briossisampylan-onnistuminen/`: viisi valmistusvaihetta ja lähteet. Ei luultua kolmiosaista kuuluisa-testiä ennen erillistä vertailukatsausta.
2. `/ruokaopas/gi-ja-gk-annoskoko/`: ero GI/GK, kuvitteellinen laskuesimerkki, lähderajaus ja linkki nykyiseen GK-menetelmään.

## Valion havaintojen hyödyntäminen

Katso [Valio-lähdemuistio](../research/valio-reseptipalvelu-2026-11-06.md). Valion 16.7.2026 tiedotteen miljoona+ kuukausikävijää koskee verkkopalvelua ja sovellusta yhdessä, ei blogia yksinään. Sesonki-/arkiruokateemat voivat ohjata seuraavia artikkeleita, mutta sisältö ja kuvat ovat alkuperäisiä.

## Katselmuksen jälkeinen jono (EI julkaista tässä PR:ssä)

- 3 kuuluisaa briossiohjetta: erot ja todennettu tunnettuus, vasta kun kolme reseptikorttia ovat valmiit;
- pad thain alkuperä ja valmistustavat;
- riisin keittäminen;
- pullataikinan kohoamisen ongelmat;
- airfryer vs uuni;
- VHH, keto ja muut hiilihydraattirajaukset;
- ravintoarvolaskureiden vertailu;
- pizzapohjien vertailu;
- thaimaalaiset raaka-aineet Suomessa;
- reseptin GK-arvion luotettavuus.

Tarkista ennen julkaisua alkuperäiset lähteet, kuvien oikeudet, terveysväitteet, tekstin merkitys ja varsinkin tuotteen käytettävissä olevat ominaisuudet. Käyttäjä hyväksyy 2 pilotin jälkeen jatkoerän erikseen.

## Seuranta vasta recipavo.com-siirtymän yhteydessä

Ei tähän PR:ään uusia GA-/Plausible-/muita analytiikkaskriptejä eikä seurantaevästeitä. Kun `https://www.recipavo.com/` on julkaistu ja sen domain-/SEO-migraation kanoniset polut sekä tietosuojaratkaisu on hyväksytty, arvioidaan:
- GSC-indexointi ja sivukohtaiset näyttökerrat/klikkaukset;
- artikkelista reseptiin -siirtymät;
- artikkeleiden aihekohtainen käyttö;
- päivitystarpeet ja toimituksellinen työmäärä.

Muuta silloin kaikki julkiset kanoniset osoitteet, OG-kuvat, sitemap ja hreflang-linkit samassa migraatiossa. Nyt pysytään GitHub Pages -osoitteessa.

## Katselmuksen testi- ja yhdistämisportti

`cd site && npm run build && npm run test:static`, lisäksi `npm run audit:seo`. Varmista kummankin artikkelin renderöity H1, alt, lähteet, BlogPosting JSON-LD, canonical, sitemap ja navigaatio. Tarkista 404, fi-only hrefLang ja ettei hero-PR:n mallia vaihdettu. Älä yhdistä ennen omistajan katselmusta.
