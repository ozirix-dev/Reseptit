# Reseptit – käännösten oma jatkotarkistus

Päiväys: 22.10.2026. Lähtöcommit: `ba9549abd3581ec3699182a7202b03ff77fbaa6d`.
Työhaara: `codex/reseptit-translation-self-review`.

## Laajuus ja tarkistustapa

Käyttäjä pyysi omaa käännöstarkistusta, löydösten korjaamista ja cpr:ää.
Tarkistuksessa oli 119 suomenkielistä lähdettä ja 357 julkaistua käännöstä.

- Rakenne, määrät, yksiköt, ajat, kielet ja lähdeviittaukset tarkistettiin
  koneellisesti kaikista 357 lähde–käännösparista.
- Oma semanttinen tarkistus vertasi 522 erilaista lähteen ainesosa–huomautusparia
  niiden EN/SV/TH-vastineisiin sekä kävi läpi hakutunnisteet ja reseptien
  muistiinpanot lähteineen. Toistuvat samat tekstit arvioitiin yhtenä ryhmänä.
- Otsikoita, kuvauksia, alt-tekstejä ja valmistusvaiheita tarkistettiin
  kohdennetusti löytyneiden termi- ja merkitysvirheiden ympäriltä.
- Tämä kierros ei ole jokaisen lauseen riippumaton äidinkielinen oikoluku.
  Tarkistaja on Codex-kielimalli. Tila on `AUTOMATED SEMANTIC REVIEW` ja
  `HUMAN REVIEW PENDING`.

[Koneellinen muutosten luettelo](2026-10-22-translation-self-review.json)
tallentaa lähtöversion, tarkistusrajauksen ja jokaisen muuttuneen version.
Korjauksia tuli 93 reseptin 256 käännösversioon: EN 81, SV 84 ja TH 91.
Lukumäärä sisältää myös toistuvien ainesosahuomautusten ja tunnisteiden korjaukset;
se ei tarkoita 256 erillistä kriittistä virhettä.

## Korjatut merkitysvirheet

### Ravintohuomautuksen kieltomuoto

Thainkielinen kauralesesämpylän huomautus väitti virheellisesti, ettei kauralese
sisällä hiilihydraatteja. Se vastaa nyt suomenkielistä lähdettä: kauralese
sisältää hiilihydraatteja. Reseptin ravintonumerot ja ruokavalioluokka säilyivät.

### Ainesosat ja käsittely

- Hienontaminen ei tarkoita jalostamista, muusi pohtimista eikä pinnalle
  ripottelu pintaan nousemista.
- Luulliset ja nahalliset kananpalat erotetaan nahkamaisista tai luisista;
  viillotettu liha erotetaan ohuiksi viipaleiksi leikkaamisesta.
- Lohkot, kukinnot, halkaiseminen, valuttaminen ja kuutiointi kuvataan
  ruoanlaiton sanastolla. Chilin tulisuuden säätö ei tarkoita lämmittämistä.
- Valmis kala-/kanaliemi erotetaan ruotsiksi fonditiivisteestä. Smetanaa ei
  vaihdeta gräddfil-tuotteeseen, ja kuohukerman englanninkielinen nimi on
  whipping cream. Kuha erotetaan hauesta ja kanan reisi koivesta.
- Thainkieliset korianterinsiemenet, raaka puuroriisi ja tomaattipyree sekä
  nuudelien keitinveden käyttö täsmennettiin lähteiden mukaisiksi.

### Hakutunnisteet ja ruokien nimet

Isan ei tarkoita isää, nakit koruja, linssit optisia linssejä eikä paneer
ikkunaruutua. Välimerellinen ruoka ei ole merellinen-luokan synonyymi.
Lisäksi alueiden nimistä poistettiin virheellisiä kieliviittauksia ja
vihannesruoan hakutunnisteet lokalisoitiin luontevasti.

Thainkielisissä nimissä selvennettiin medu vadan rengasmuoto, pav bhajin
kasvissose, tangyuanin riisijauhosta tehdyt pallot ja khao man gain
kukkakaaliriisi. Reseptitunnisteet ja URL-osoitteet säilyivät.

### Valmistus ja muistiinpanot

- Char siun viismauste ja bouillabaissen fenkoli erotettiin thaiksi basilikasta
  ja juustokuminasta.
- Jogurtin juoksettuminen, moussakan leikkaaminen levon jälkeen ja purin
  taikinakuoret korjattiin niiden oikeisiin merkityksiin.
- Brikin paistaminen öljyssä erotettiin uunipaistamisesta; valuva kananmuna
  ei tarkoita vuotavaa nenää. Muutamien uuni- ja grillireseptien englanti
  korjattiin paistomenetelmän mukaiseksi.
- Nakkikeiton huomautuksessa käytetään nakkeja, ei välipaloja. Pad see ew'n
  nimivirhe ja osterikastikkeen sekoittuminen ostereihin korjattiin.
- Larbissa puhutaan paahdetusta riisijauheesta eli ข้าวคั่ว, ei tavallisesta
  riisijauhosta. Pav bhajin viimeistelyssä käytetään puolet voista ja kaikki
  korianteri; loput voista menevät sämpylöille suomenkielisen ohjeen mukaan.

## Säilytetyt tiedot

Koneellinen vertailu lähtötilaan vahvisti, että kaikki suomenkieliset lähteet
säilyivät kokonaan. Käännösten ainesmäärät, yksiköt, ainesrivien järjestys,
annokset, ajat, ravintonumerot, ruokavalioluokat, julkaisutiedot, reseptitunnisteet,
URL:t ja kuvatiedostot säilyivät. Ainesosien nimet ja tekstihuomiot korjattiin
lähteen mukaisiksi; uusia raaka-aineita ei lisätty.

## Regressiosuoja ja tarkistukset

Käännösauditointi tarkistaa nyt myös ainesosien huomautukset ja hakutunnisteet.
Uudet rajatut säännöt estävät todettujen virheiden palaamisen. Testit syöttävät
virheellisiä huomautuksia, tunnisteita ja kieltomuotoja auditointiin sekä
varmistavat, ettei sama sana laillisessa toisessa asiayhteydessä aiheuta virhettä.

Paikalliset tarkistukset: 25 yksikkötestiä, 14 käännöstestiä, kolme kuvatestiä,
tuotantobuild (476 kieliversiota, 480 reittiä), yhdeksän staattista testiä ja
kolme selaintestiä. Staattisessa HTML:ssä tarkistetaan erikseen tärkeimpien
merkityskorjausten näkyminen sekä reseptien metatiedot.

Tiukka käännösauditointi: 357 paria, nolla havaittua rakenne- tai tunnettujen
termien virhettä. Tämä luku ei todista kaikkien lauseiden semanttista oikeellisuutta.
Tarkat CI-tulokset ovat muutos-PR:ssä; tuotantoon julkaisu on erillinen vaihe.

## Opittu ja seuraava tarkistus

Aiemmat ainesnimien ja numeroiden testit eivät kattaneet tekstihuomautuksia ja
hakutunnisteita. Myös kieltomuodon katoaminen voi muuttaa väitteen vastakkaiseksi,
vaikka määrät ja rakenteet täsmäävät. Jatkossa oma tarkistus kattaa nämä pinnat,
raaka/kypsä- ja liemi/tiiviste-erot sekä uuni/pannu/grilli-verbien merkityksen.
Tarkistuksen rajaus ja löydökset tallennetaan aina; tekninen läpäisy ei muuta
riippumattoman ihmiskielentarkistuksen tilaa hyväksytyksi.

## Uudelleenkäynnistetyn PR #37 -katselmoinnin korjaus

Käyttäjän pyynnöstä 22.10.2026 käynnistetty ulkoinen katselmointi valmistui
ja löysi yhden P2-havainnon: hakutunnisteiden virhetarkistus vertasi taulukoiden
samoja indeksejä, vaikka tunnisteiden järjestyksellä ei ole merkitystä.
[Alkuperäinen havainto](https://github.com/ozirix-dev/Reseptit/pull/37#discussion_r4348074748).

Korjaus tarkistaa jokaisen kohdekielen tunnisteen kaikkia lähteen aktivoimia
sääntöjä vasten. Ainesosahuomautusten rivikohtainen vertailu säilyy ennallaan.
Reseptisisältöjä ei muutettu. Regressiotestit vaihtavat lähteen ja kohteen
järjestystä EN/SV/TH-esimerkeissä sekä varmistavat oikeiden käännösten ja
asiaan liittymättömien lähdetunnisteiden hyväksymisen. Koko reseptiauditoinnin
testi kierrättää nakkikeiton tunnisteiden järjestystä.

Kaksi testiä epäonnistui ennen korjausta. Korjauksen jälkeen kaikki 14
käännöstestiä ja yhdeksän staattista testiä sekä tuotantobuild läpäisivät
(476 kieliversiota, 480 reittiä). Korjaus tehdään julkaistun version
`c14914a49e8c87abfbbd3e0fde49d0c36a5a5463` päälle erillisellä haaralla
`codex/reseptit-tag-review-fix`; yhdistäminen on erillinen vaihe.
