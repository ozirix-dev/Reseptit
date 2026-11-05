# Resurssitalous ja nykyiset CI-suojat

Tämä nyky-mainin sovitus säilyttää PR #231:n tarpeelliset CI-parannukset. Reseptit valitsevat edelleen sisältö-, ravintoarvo- ja GK-tarkistukset. Käännösmuutos valitsee myös käännöskatselmoinnin. Tutkimushakemiston aineisto valitsee täydet tarkistukset: myös Markdown-katselmointiteksti voi olla sinetöidyn paketin syöte. Tuntematonta aineistoa ei ohiteta sijainnin perusteella.

Kolme täsmälleen nimettyä suunnittelu-JSONia käsitellään kevyesti: operation145/next-queue.json, operation146/queue.json ja gk80-run8/inventory.json. Niihin ei löytynyt aktiivisia laskenta- tai testisidoksia tässä sovituksessa. Viereiset laskenta-, lähde- ja hyväksyntäpaketit säilyttävät tarkistuksensa. Virheellinen muutospolkulista valitsee koko tarkistuspaketin.

Työn perussäännöt tulevat nykyisestä AGENTS.md:stä ja yhteisestä resurssitalousohjeesta: rajatut haut, nykyisten lähteiden ja päätösten uudelleenkäyttö, kohdennetut tarkistukset ensin, valmiit erät kerralla ja yksi kirjoittaja haaralle. Suojauksia tai julkaisulupia ei kevennetä. Tämän PR:n testit suoritetaan peräkkäin toisen GK100-ajon kuormituksen huomioimiseksi.

## Historiallinen GK80-indeksi

PR #231:n gk80-work-index.mjs, sen testit, alkuperäiset mittaukset ja työohje säilyvät [pinnatussa commitissa](https://github.com/ozirix-dev/Reseptit/commit/9d20ca9adbd158a9acf6c50a1665dd4797250191). Ne käyttävät suljetun #230:n vanhaa inventaarioskeemaa ja on tarkoitettu sen tutkimushistorian toistamiseen. Niitä ei aseteta nykyisen GK100-työjonon oletustyökaluksi.

Nykyinen GK100-nopeus-/reseptityö jatkuu omistajansa erillisissä työpuissa. Tämän sovituksen yhteydessä sen tiedostoihin tai haaroihin ei kirjoiteta. Lähdehavaintojen käyttö edellyttää edelleen ruoan, valmistuksen, oikeuksien ja tarkisteiden vastaavuutta; laskennallinen PASS ei myönnä sisältö- tai julkaisuhyväksyntää.
