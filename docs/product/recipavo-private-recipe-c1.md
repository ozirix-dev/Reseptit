# Yksityisen reseptikirjan synteettinen C1-pilotti

Pilotti ajaa paikallisessa tiedostopohjaisessa SQLitessä kahta ennalta määrättyä testikäyttäjää. Se tallentaa nimen tai muistiinpanon, avaa keskeneräisen reseptin, päivittää sen version ja kuittaa vasta transaktion valmistuttua. Sama omistaja ja pyyntöavain palauttavat saman kuitin. Samalla avaimella saapuva muuttunut sisältö tai vanhentunut muokkausversio tuottaa ristiriidan. Toisen testikäyttäjän resepti ei näy luku- tai päivityspolussa. Kaikki omistajuustarkistukset ovat tallennuskerroksessa.

~~~sh
cd site
node --test --experimental-strip-types tests/private-recipe-storage-pilot.test.ts
~~~

Aja uudella Node 22 LTS -päivityksellä tai projektin nykyisellä Node-versiolla. Pilotti ei kytkeydy julkiseen sovellukseen, GitHubiin, CI:hin, reseptijulkaisuun tai pilvitietokantaan. Se käyttää vain synteettistä dataa. SQLiten paikallinen mittaus kattaa tiedostotransaktion. Verkkoyhteyden, tunnistuksen ja todellisen palvelukannan p95 pitää mitata erillisessä pilotissa.

## Päätettävä ennen käyttäjädatan pilottia

D1 on ehdokas erilliselle käyttäjätietokannalle. Nykyinen julkaisu sisältää feedback-D1:n skeeman, ja feedbackin tuotantoportti pitää toiminnon pois päältä. Näyttöä tuotantokelpoisesta reseptikirjan tunnistuksesta tai erillisestä käyttäjäkantaan sidotusta palvelusta ei ole. Testaa seuraavaksi D1:n transaktiorajapinnan sopivuus ja kuittien atomisuus, palauta varmistus, varmista tunnistus ja testaa kaksi eri käyttäjää myös palvelinrajapinnan kautta. D1-pilotin pitää toistaa kaksi rinnakkaista samaa Tallennus-pyyntöä ja mitata mediaani sekä p95. Tietojen vienti, poisto, säilytys ja valtuudet kuuluvat ennen oikeita käyttäjiä tehtävään päätökseen.
