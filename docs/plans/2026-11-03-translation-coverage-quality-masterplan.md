# Reseptit nelikieliseksi hallituissa erissä

Jokainen julkaistu suomenkielinen resepti saa englannin-, ruotsin- ja
thaikielisen version. Seuraa julkaistujen kieliversioiden kattavuutta ja
ajantasaisten merkitysvertailujen määrää erillisinä mittareina.

## Lähtötilanne

Tarkistettu main-commit on `358bbadf9e8f28db254bcfc3bd68c4bdcc8f6e5c`.
Julkaistuja FI-reseptejä on 326 ja täysin nelikielisiä 132. Julkaistuja
käännöspareja on 396/978 (40,5 %). EN, SV ja TH ovat kukin tasolla 132/326.
Puuttuvia pareja on 582, eli 194 kieltä kohti. Rakennetarkistus läpäisee
396 parille. Ajantasainen Codexin lähdevertailu on 39/396 parilla (9,8 %).

V2:n tarkistusportti on mainissa [PR #263:n](https://github.com/ozirix-dev/Reseptit/pull/263)
jäljiltä. Ensimmäinen yhdeksän parin auditointi ja thaibiryanin
julkaistu korjaus sisältyvät [PR #262:een](https://github.com/ozirix-dev/Reseptit/pull/262).
V2:n käyttöönotossa kirjattiin lisäksi 30 vertailua. Kolmen suklaareseptin
puuttuneet kieliversiot on julkaistu.

[PR #222](https://github.com/ozirix-dev/Reseptit/pull/222) varaa pohan ja
hunaja-sinappikanan kaikki kuusi käännöstä. Pohassa suomen ohje yhdistää
pihvitaikinan ja riisihiutaleiden paistamisen. Kanapellissä kaksi ohjetta
toistaa kuorrutuksen ja paahtamisen eri järjestyksessä. Ratkaise lähdetekstit
ja tarkista GK-sidonnat samassa työssä ennen V2-hyväksyntää. Käsittele
käännökset ja mahdolliset yhteensopivuuskorjaukset PR #222:ssa.

## Työjärjestys

1. Auditoi julkaistuista resepteistä gai yang, jauhelihapihvit
   kermakastikkeella, kai jiew, keltainen kanacurry, keto-kauralesesämpylät,
   keto-pannukakku, Pofiber-ketopizza, khao kha moo, konjak-khao soi ja
   koshari. Korjaa todetut P0/P1-virheet ennen erän julkaisua ja kirjaa
   vähäiset havainnot V2-rekisteriin.
2. Auditointierän katselmoinnin jälkeen valitse 10 julkaistua FI-reseptiä,
   joilta puuttuvat EN, SV ja TH. Kierrätä reseptikategorioita ja ratkaise
   tasatilanteet reseptitunnuksella. Tarkista avoimet PR:t ja ohita niihin
   varatut reseptit. Siirrä epäselvä FI-lähde ratkaistavaksi ja poimi
   seuraava resepti samasta kategoriasta. Tee 30 uutta käännösparia
   tarkistustietueineen yhdessä rajatussa PR:ssä.
3. Jatka 10 reseptin erissä. Kahden peräkkäisen ongelmattoman erän jälkeen
   nosta koko 15:een. Palaa kymmeneen, jos P0/P1 jää avoimeksi tai
   GK-sidonta vaatii uuden korjauskierroksen. Käsittele kaikki kolme
   kohdekieltä yhdessä. Avaa uusi erä ajantasaisesta mainista ja nimeä
   PR-haaralle yksi kirjoittaja.

Päivitä lähtöluvut komennolla `npm run review:translations -- --summary`
`site/`-hakemistosta. Käytä julkaistuja reseptitietoja ja V2-rekisteriä,
jotta luonnokset ja vanhentuneet vertailut näkyvät erillään. Aloita
jokainen erä avoimista P0/P1-havainnoista ja vanhentuneista vertailuista.
Kirjaa katselmoidut parit, havainnot, tarkistetut commitit ja seuraava erä
nykyiseen V2-rekisteriin ja PR-kuvaukseen.

## Hyväksyntä ja tuotantovarmennus

Vertaa ainesosat, annokset, valmistus, turvallisuus, allergeenit,
otsikot, kuvaukset, alt-tekstit ja GK-version rajaus FI-lähteeseen.
Säilytä julkaistut reseptitunnukset ja reitit. Tallenna uusille ja
olennaisesti muuttuneille pareille V2-tietue. Ratkaisematon olennainen
epäselvyys ohjataan ihmistarkistukseen. Laskentaan tai hyväksyttyihin
ravintoarvoihin vaikuttavat korjaukset katselmoidaan erikseen.

Aja muutoksille kuuluva kohdennettu sisältövalidaatio. Hyväksytyn erän
yhdistäminen edellyttää vihreää CI:tä samalle commitille ja tapahtuu
repo_guardilla. Seuraa automaattinen Pages-julkaisu loppuun. Varmista
uusien kieliversioiden reitit, kielenvaihto ja vastavuoroiset
`hreflang`-linkit. Tarkista selaimella erän riskialtteimmat sisältökohdat,
ravintoarvot ja GK-esitys.

Nykyisellä 326 reseptin nimittäjällä välietapit ovat 163, 245, 294 ja 326
nelikielistä reseptiä. Laske rajat uudelleen FI-reseptien määrän muuttuessa.
Hanke valmistuu, kun puuttuvia kieliversioita ja avoimia P0/P1-havaintoja
on nolla ja jokaisella julkaistulla parilla on ajantasainen merkitysvertailu.

Pysyvät ohjeet ovat [käännösten tarkistuskäytännössä](../translation-review-policy.md)
ja [tarkistustyöjonon kuvauksessa](../translation-human-review.md).
