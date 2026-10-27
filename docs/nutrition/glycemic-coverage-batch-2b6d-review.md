# GK-kattavuuserä 2B6D – lähde- ja kattavuuskatsaus

## Rajaus ja lähtötilanne

Erä perustuu korjattuun 2B6C-haaraan ja sen muuttumattomaan lähtösnapshotiin `f2ba9e849e677f9e223103022e309a09b9992f62`. Reseptit PR #117 ja ReportHub PR #70 olivat tarkistettaessa edelleen Draft-tilassa. Tähän erään ei tuotu käyttöliittymä-, vaihteluväli- tai Nutritics-muutoksia. Resepteihin ei tehty sisältömuutoksia.

| Mittari | Ennen 2B6D:tä | 2B6D:n jälkeen | Muutos |
| --- | ---: | ---: | ---: |
| Reseptit | 325 | 325 | 0 |
| GK laskettu | 136 | 139 | +3 |
| GK keskeneräinen | 189 | 186 | −3 |
| GI-tietueet | 42 | 43 | +1 |
| GK-kattavuus | 41,8 % | 42,8 % | +0,9 prosenttiyks. |

Laskettuja GK-arvoja ei poistunut eikä aiemmin lasketun 136 reseptin GK muuttunut. Uusi current-inventaario vertaa jokaisen arvon ja reseptin statuksen lähtösnapshotiin.

## Uusi GI-lähde ja laskennat

Lisätty yksi GI-tietue: Tamer-vaiheen taateleiden 17 lajikkeen keskiarvo GI 55,2 (SEM 7,7; vaihteluväli 42,8–74,6), glukoosiasteikko. Tutkimuksessa oli 19 tervettä osallistujaa; kukin lajike testattiin vain 9–10 henkilöllä. Tietue on `SUPPLEMENTARY`, `ANALOG`, `LOW`, koska kaikkia reseptien kuivattuja taateleita tai lajikkeita ei tunnisteta tutkimuksen tasolle. Käyttö rajataan kuivattuihin taateleihin sellaisenaan, ilman jatkokuumennusta. Arvoa ei sovelleta taatelitahnaan, siirappiin, tuoreisiin/puolikypsiin taateleihin eikä kypsennettyihin seoksiin. [AlGeffari ym. 2016, alkuperäistutkimus](https://pmc.ncbi.nlm.nih.gov/articles/PMC6074203/).

| Resepti | GK / annos | Luottamus | Uuden taatelitietueen osuus GK:sta | Muut pääosuudet |
| --- | ---: | --- | ---: | --- |
| `kiinalainen-hirssipuuro-taateleilla` | 20,39 | LOW | 1,05 | Hirssi 19,33 |
| `pohjoisafrikkalainen-taatelipuuro-appelsiinilla` | 22,45 | LOW | 1,05 | Mannasuurimo 18,44; appelsiini 2,95 |
| `pohjoisafrikkalainen-kuskus-aamiaiskulho` | 33,56 | LOW | 1,05 | Kuskus 31,48; jogurtti 0,88; manteli 0,15 |

Kaikissa taatelia on lähdereseptin mukaiset 10 g / resepti. Taateli lisätään puuron tai kuskusin valmistuttua. Laskenta on ainesosakohtainen arvio, ei valmisaterian GI-mittaus.

`lahi-ita-taatelipuuro-tahinilla` pysyy estettynä: taatelit keitetään puuron kanssa, eikä Tamer-vaiheen sellaisenaan syödyn taatelin GI-sidosta siirretty kypsennettyyn seokseen. Sen input korjattiin lähdereseptin 10 g taateliin, 15 g tahiniin ja 300 ml täysmaitoon. Hirssipuuron inputiin korjattiin myös reseptin 2 g tuore inkivääri, 8 g seesaminsiemen ja 700 ml vesi; appelsiinipuuron appelsiini korjattiin reseptin 130 grammaan ja vesi 300 millilitraan. Nämä ovat laskentasyötteiden lähdevastaavuuden korjauksia; reseptejä tai niiden määriä ei muutettu.

Uudet arviot ovat herkkiä lähteiden ja valmistustavan eroille, joten ne jäävät LOW-luokkaan. Aiemmat arvot säilyivät täsmälleen samoina; inventaario osoittaa `newlyBlocked: 0`.

## Kaikkien jäljellä olevien reseptien esteet

Koneellinen inventaario sisältää kaikki 325 reseptiä ja jokaisen 186 keskeneräisen reseptin estoviestit, luokat, ainesosakohtaiset tietueet ja seuraavat toimet. 93 keskeneräisellä reseptillä ravintoarvotila on lähteistetty, 40 vaatii ravintoarvojen tarkistamista ja 53:lta ravintoarvotieto puuttuu.

Estoluokat menevät päällekkäin, koska samalla reseptillä voi olla useita esteitä. Keskeneräisistä resepteistä 38 sisältää rakennesidonnan esteen, 65 koostumusesteen, 20 massa- tai valmistustapaesteen, 81 GI-vastaavuusesteen, 41 puuttuvan GI:n ja 6 toleranssivirheen. Nämä määrät eivät summaudu 186:een. Kaikki keskeneräiset reseptit sisältävät vähintään yhden luokitellun eston.

Keskeiset jäljellä olevat ongelmaryhmät priorisoituina:

| Ongelma | Vaikutus | Miksi GK:tä ei lisätty tässä erässä |
| --- | --- | --- |
| Kookosmaito | 17 reseptiä | 12 inputissa koostumus on tiedossa mutta GI puuttuu; viidessä tuotetyyppi tai massamuunnos on ratkaisematta. GI 31 koskee riisipuuroa kookosmaidolla, ei yksittäistä kookosmaitoa. |
| Soijakastike | 17 reseptiä; 3:ssa yli 1 g/annos | Luotettavaa soijakastikkeen GI-mittausta ei löytynyt. Pienet annokset arvioidaan nykyisen yhteisen alle 2 g:n toleranssin mukaan, eikä maustetta tarvitse mitata reseptikohtaisesti. |
| Tomaattimurska | 10 reseptiä | Seitsemän aiempaa raakaa tomaattia / yleistä kastiketta kuvaavaa sidosta ei läpäise valmistustapavastaavuutta; kolmessa GI puuttuu. Raaka kokonainen tomaatti ei yksin todista kypsän murskatun tomaatin GI:tä. |
| Liemet ja liemivaihtoehdot | 43 reseptiriviä mainitsee liemen; 10 epäselvää kasvis-/kanaliemivaihtoehtoa, joista 9:ltä puuttuu koostumuslähde | Kaupallisten liemien suola, sokerit ja hiilihydraatit vaihtelevat. “Vettä tai lientä” ei ole yksi koostumus. Keittojen GI-keskiarvo ei ole yksittäisen liemen mittaus. |
| Tamarinditahna | 4 reseptiä | Hedelmien yleinen kategoriakeskiarvo ei ole perusteltu tamarinditahnan vastaavuus; hiilihydraattia on noin 2,15–4,31 g/annos. |
| Lanttu | 4 reseptiä | Laaja vihannesten kategoriakeskiarvo ei läpäise nykyistä lähde-/ruokaperhevalidointia lantulle ja reseptin kypsälle muodolle. |
| Hunaja | 4 reseptiä ilman GI-sidosta | Vuoden 2002 taulukossa on 11 hunajatyypin keskiarvo 55 ± 5, mutta käyttö vaatii reseptikohtaisen arvion siitä, lisätäänkö hunaja sellaisenaan vai kypsennetäänkö se. Se ei yksin ratkaise näiden reseptien muita koostumus- tai valmistustapaesteitä. |
| Papaija | 2 reseptiä | Papayan GI-lähteet ja testatut muodot eroavat (palat vs. sose); laaja hedelmäkeskiarvo peittäisi tämän eron. |
| Maissitortilla | 1 resepti | Nykyinen GI-tietue ei ole julkistettu riittävästi eikä vastaa reseptissä paistettua/tostadaksi valmistettua tuotetta. Ainesosan hiilihydraattiosuus on olennainen. |
| Kypsennetty taateli | 1 resepti | Uusi Tamer-vaiheen GI-tietue ei kata puuroon keitettyä taatelia. |

Nämä ovat priorisointiryhmiä, eivät riippumattomia reseptimääriä. Esimerkiksi kookosmaito, liemi ja tomaatti voivat estää samaa reseptiä samanaikaisesti. Tämän erän tutkimuksessa kookosmaitoinen riisipuuro löytyi mitattuna GI-tuloksena, mutta se on seka-ateria; lähde ei mittaa kookosmaitoa yksinään eikä sitä käytetty kookosmaidon GI:nä. [PubMed 22212476](https://pubmed.ncbi.nlm.nih.gov/22212476/).

## Seuraavan erän realistinen potentiaali

65 keskeneräisellä reseptillä esteluokat ovat GI-missing, GI-match ja/tai toleranssi ilman muuta luokiteltua estettä; 31:llä näistä ravintoarvotila on lähteistetty. Tämä on yläraja GI-lähteiden tutkimiselle, ei lupaus siitä, että kaikki voidaan laskea. Nykyisellä aineistolla realistinen lisätulos on arviolta noin 5–15 GK-arviota, jos vähintään muutamalle GI-only-reseptille löytyy täsmällinen lähde ja muutama pieni puute voidaan käsitellä nykyisellä toleranssilla. Tämä on lähdeinventaarioon perustuva arvio; jokainen tapaus vaatii erillisen vastaavuus- ja lähdetarkistuksen. Koostumuspuutteita, epäselviä reseptivaihtoehtoja tai eri valmistustapoja ei voi korvata GI-lähteellä.

## Testit ja auditointitiedostot

- Taatelien lähde-/valmistustapatesti tarkistaa lähteen tiedot, fingerprintit, kolmen lasketun arvon ja sen, että keitetty taateli pysyy estettynä.
- Kattavuustesti vertaa kaikkia lähtötilanteessa laskettuja 136 GK-arvoa muuttumattomaan snapshotiin sekä varmistaa, että kaikilla 186 keskeneräisellä reseptillä on luokiteltu este.
- Koneellinen, reseptikohtainen lähtö- ja nykyinventaario: [`glycemic-coverage-batch-2b6d-current.json`](glycemic-coverage-batch-2b6d-current.json) ja [`glycemic-coverage-batch-2b6d-current.md`](glycemic-coverage-batch-2b6d-current.md).
- Muuttumaton lähtösnapshot: [`glycemic-coverage-batch-2b6d-baseline.json`](glycemic-coverage-batch-2b6d-baseline.json).
- `npm run test:glycemic`: PASS, 59/59; `npm test`: PASS, 128/128.
- `npm run audit:nutrition -- --strict`: PASS, 180 / 86 / 59 / 0.
- `npm run audit:glycemic-load`: PASS, 325 reseptiä; 139 laskettua / 186 estettyä.
- Eräinventaario: PASS; kolme uutta arviota, 0 aiemmin lasketun arvoa muuttui, fingerprint-mismatchit 0/0/0.
- `npm run build`: PASS, TypeScript ja 690 prerenderöityä reittiä. Vite raportoi olemassa olevan suuren JavaScript-chunkin varoituksen.
- GitHub Actions: odottaa Draft PR:n HEADille ajettavaa CI:tä.
