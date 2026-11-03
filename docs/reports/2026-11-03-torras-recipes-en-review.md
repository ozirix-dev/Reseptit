# Kolmen Torras-reseptin EN-käännösten tarkistus 3.11.2026

- `keto-mutakakku` → Keto chocolate mud cake
- `keto-suklaakeksit` → Keto chocolate chunk cookies
- `meheva-suklaakakku` → Moist chocolate cake

**STRUCTURE PASS / AUTOMATED SEMANTIC REVIEW / HUMAN REVIEW PENDING.**

Käännökset ovat luonnoksia. Tarkistin ainesosien järjestyksen, merkityksen, määrät ja yksiköt sekä annokset, valmistuksen, lämpötilat, ajat, otsikot, muistiinpanot ja kuvatekstit FI-lähteitä vasten. Lähteiden sanamuotoero säilyy: keto-ohjeiden ainesosaluettelossa suklaa on sokeritonta ja muistiinpanoissa puhutaan makeuttamattomasta suklaasta. Käännöksissä nämä ovat vastaavasti *sugar-free* ja *unsweetened*. Ihmisen kielentarkistus on tekemättä.

Kakussa vertailu erottaa taikinan ja kuorrutteen, kekseissä suklaapalat ja erikseen lisättävän erytritolin. Keto-ohjeet viittaavat laskettuun osuuteen vain GK-only-osion näkyessä. Tuotelähteet, alkuperäinen lähdetarkistuspäivä ja maltitolituotteen tunnistehuomio ovat samat kuin FI-versiossa.

- Repon käännösauditointi: 387 julkaistua paria, 0 poikkeamaa. Käännöstestit 27/27 ja vertailutestit 4/4.
- Erillinen paikallinen esikatselu: 724 reittiä ja vertailu täsmälleen kuudella FI/EN-reseptisivulla. FI- ja EN-sivujen JSON-LD:n ravintotiedot täsmäsivät. Keto-ohjeilla näkyi nykyinen laskettu GK-osuus ja Mehevällä suklaakakulla nykyiset makrot.
- Esikatselukopion käännösauditointi kaikille 390 parille: 0 poikkeamaa. Tätä tarkistusta varten EN-luonnokset ja vastaavat FI-kielimerkinnät aktivoitiin vain paikallisessa kopiossa.

Julkaisun yhteydessä FI-lähteiden käännösmetatiedot on päivitettävä ja niiden vaikutus lähdetiedostojen hasheihin varmennettava. Tässä muutoksessa FI-lähteet ja laskenta-aineisto säilyvät sellaisinaan.

## PR #204:n jatkokatselmointi

Mutakakun englanninkielistä kuvausta ja vesihaudeohjetta täsmennettiin. Keksien suklaapalat, kakun kuorrute ja valmistajan tuotesivun tunnistehuomio tarkistettiin lähdetekstejä vasten. Käännökset odottavat edelleen ihmisen kielentarkistusta.

Ensimmäisessä CI-ajossa kaksi GK-regressiotestiä tulkitsi käännösluonnosten lisäämisen muutokseksi suojattuihin resepteihin. Testit sallivat nyt uusina lisätyt käännösluonnokset ja tarkistavat edelleen olemassa olevat tiedostot sekä alkuperäiset GK-tulokset.

## Kielentarkistuksen palaute

Käyttäjän katselmoinnin perusteella mutakakun ja suklaakeksien muistiinpanoissa käytetään nyt samoja termejä kuin ainesosaluetteloissa, *sokeriton* ja *sugar-free*. GK-tarkistus tunnistaa nämä kaksi täsmällistä muistiinpanomuutosta ja vertaa muuta reseptitiedostoa edelleen hyväksyttyyn versioon. Käännösten tiedostot ovat luonnoksia.

## Englanninkielisten sivujen julkaisuvalmistelu

Käyttäjä tarkisti FI–EN-kielentarkistuspaketin 3.11.2026. Palautteen mukainen sokerittoman suklaan sanamuoto on mukana PR:n #204 yhdistetyssä versiossa. Tämä muutos aktivoi samat englanninkieliset tekstit ja Torras-vertailut. Suomenkielisiin lähteisiin lisättiin englannin julkaisumetatiedot. GK-sidonnat tunnistavat vain nämä täsmälliset metatiedot ja säilyttävät hyväksyttyjen laskentasyötteiden tarkistukset.
