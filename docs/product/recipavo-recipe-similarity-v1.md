# Recipavo: reseptien sisällöllinen duplikaattitarkistus V1

**Tila:** toteutettu offline- ja CI-tarkistus. Ei automaattista julkaisun estoa, reseptien poistoa eikä GK-muutoksia. Julkisen ehdotuslomakkeen T4-palvelu on tuleva erillinen vaihe.

## Toteutus

Nykyinen tekninen assertUniqueRecipes säilyy ennallaan. Uusi vertailu tunnistaa eri nimillä julkaistut samankaltaiset reseptit ja selittää erot: normalisoidut ainesosat, annoskohtaiset määrät, valmistusmenetelmät ja aito rakenteellinen muunnelma. Tulokset ovat MATERIAL_DUPLICATE, POSSIBLE_DUPLICATE, POSSIBLE_VARIANT. Kokonaispäätös on NO_MATERIAL_MATCH, MATERIAL_DUPLICATE tai UNCERTAIN.

Nimet ja alkuperä-URL:t eivät yksin tarkoita samaa reseptiä. Score on vain heuristinen järjestysmitta eikä todennäköisyys. Puuttuvaa määrää tai tuntematonta ainetta ei imputoida. Käännökset samalla resepti-ID:llä käsitellään yhtenä.

## Käyttö

Asenna site-hakemiston riippuvuudet (npm ci). Käytä site-hakemistossa:

- Koko kirjasto: npm run audit:similarity -- --all --limit=30 --output=site/similarity-inventory.md
- Muuttuneet reseptit: BASE_SHA=<main_sha> HEAD_SHA=HEAD npm run audit:similarity -- --changed
- Yksi rakenteinen reseptiehdotus: npm run audit:similarity -- --submission=reseptit/aamupalat/esimerkki.md
- Yksikkötestit: npx tsx --test tests/recipe-similarity.test.ts

Jos --output on annettu, tuotetaan Markdown ja JSON. PR:n muuttuneiden reseptien tulos kirjautuu CI:hin varoituksina. Kun vertailumoottoria muutetaan, GitHub Actions tekee koko kirjaston inventaarion sekä säilyttää tuloksen lyhytaikaisena artefaktina.

## Referenssiesimerkki

Julkaistut Joshua Weissman -tyylinen briossi, Moomien sämpylä ja The Clever Carrot -briossi muistuttavat toisiaan, mutta eroavat menetelmässä tai määräsuhteissa. Etenkin tangzhong on merkittävä tunnistettava valmistustapa. Nämä eivät kuulu automaattisesti poistettaviksi tai yhdistettäviksi.

## T4-julkinen käyttäjäehdotus

Ohjelmallinen checkPublicRecipeSubmission ottaa ehdotuksen, julkiset reseptit ja rajatun pending-jonon. Sisäinen päätös sisältää vertailuperusteet ja mahdolliset pending-osumat. Julkiseen tulosteeseen saa päästää vain julkaistujen reseptien sallitut tiedot; ei toisten käyttäjien keskeneräisiä reseptejä. Tämä API ei itsessään anna käyttöoikeuksia eikä toteuta kirjautumista, lomaketta, tietokantaa, omistajan päätösnäkymää tai varsinaista backend-palvelua.

Vain NO_MATERIAL_MATCH pääsee normaalisti OWNER_REVIEW_PENDING-jonoon; MATERIAL_DUPLICATE ja UNCERTAIN tarvitsevat tarkennuksen tai dokumentoidun omistajan poikkeuspäätöksen. Mikään tila ei julkaise reseptiä. Käyttäjän yksityinen reseptitallennus toimii erillään tästä portista. Omistajan toimituksellinen päätösvalta säilyy. Katso suunnittelu-PR #295: https://github.com/ozirix-dev/Reseptit/pull/295.

## Rajaukset ja turvallisuus

- Ensisijainen vertailukieli on suomi. Muita kieliä koskevaa synonyymisanastoa ei ole vielä kattavasti verifioitu: niistä palautuu varovaisesti UNCERTAIN.
- g/kg ja ml/l/dl muunnetaan saman mittatyypin sisällä. Grammaa ja millilitraa ei rinnasteta automaattisesti; kypsän ja raa'an painoja ei arvata.
- CI näkee checkoutin julkaistut reseptit ja ne reseptimuotoiset luonnokset, jotka kuuluvat valittuihin paikallisiin katselmointihakemistoihin. Se ei näe muiden PR-haarojen julkaisemattomia muutoksia automaattisesti. Tuleva T4-palvelu tarvitsee keskeneräisten ehdotusten oman indeksin.
- Ei verkko- tai AI-kutsuja. Ei muutoksia nykyisiin ravintoarvoihin, GI/GK-lähteisiin, julkaisun estoihin tai käyttöoikeuksiin.
- Toiminnan kehitys vaatii testidataa todellisista vääristä positiivisista ja vääristä negatiivisista osumista. Omistajan hyväksytyt poikkeukset sidotaan myöhemmin reseptien sisältöversioihin.
