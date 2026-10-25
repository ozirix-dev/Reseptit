# Nutritics-kokeilun valmistelu

Tämä kansio valmistelee käyttäjän itse aktivoimaa seitsemän päivän Nutritics-kokeilua. Se ei ole tuotantointegraatio. Älä lisää tänne API-vastauksia, avaimia, tilitietoja, lisensoituja ruokatietueita tai Nutriticsista kopioitua tietokantaa.

## Eristys ja nykytila

- Työhaara: `codex/nutritics-evaluation`, luotu `origin/main`-haarasta.
- Vertailun lähtö-SHA: `ce5b2ef4ddae0507a3dae6fc5de5d88fb0693868`.
- Käynnissä oleva GI/GK-laskentatyö on erillinen. Sen työpuita tai muutoksia ei sisällytetä. Tässä työssä Nutriticsin GI/GK-ominaisuutta vain tarkastellaan; kokeilutuloksia ei kopioida GI/GK-laskentaan.
- `origin/main`-pohjassa ajettu tiukka audit (25.10.2026) käsitteli 325 reseptiä: 140 `ESTIMATE WITH EVIDENCE`, 86 `INSUFFICIENT SOURCE DATA` ja 99 `MISSING`. Nämä ovat lähtötilan luokkia, eivät väitteitä Nutriticsin tarkkuudesta. Vertailureseptien lähdehashit ja annosmäärät on tallennettu tyhjään vertailupohjaan; vertailuarvot lasketaan uudelleen ennen kokeilua.
- Fineli Rel20 -aineisto, reseptikohtaiset laskentasyötteet ja ravintoarvoraportit ovat jo repossa. Fineliä ei ladata uudelleen eikä reseptien nykyisiä arvoja muuteta.

## Vertailureseptit

Reseptitunnisteet on valittu usean keittiön, hiilihydraattitason, ruokavaliotyypin ja nykyisen näyttötilan kattamiseksi. `docs/nutrition/audit.json` on tämän haaran lähtöaudit.

| Resepti-ID | Edustava käyttötapaus | Ravintoarvojen lähtötila |
| --- | --- | --- |
| `jauheliha-makaronilaatikko` | suomalainen, hiilihydraattipitoinen | INSUFFICIENT SOURCE DATA |
| `lohikeitto-kuohukermalla` | suomalainen perusruoka | INSUFFICIENT SOURCE DATA |
| `kanaviillokki-kukkakaalilla` | suomalainen VHH | ESTIMATE WITH EVIDENCE; GK-arvio tehty |
| `jauheliha-kaalikeitto-vhh` | suomalainen VHH | INSUFFICIENT SOURCE DATA |
| `siskonmakkarakeitto-juurekset` | suomalainen perusruoka | MISSING |
| `bulgogi` | korealainen, hiilihydraattipitoinen | ESTIMATE WITH EVIDENCE |
| `yangzhou-paistettu-riisi` | kiinalainen, hiilihydraattipitoinen | ESTIMATE WITH EVIDENCE |
| `gulab-jamun` | intialainen jälkiruoka, runsashiilihydraattinen | INSUFFICIENT SOURCE DATA |
| `congee-riisipuuro` | kansainvälinen riisipuuro | ESTIMATE WITH EVIDENCE |
| `amritsari-kala` | intialainen, friteeraus ja taikina | ESTIMATE WITH EVIDENCE |
| `keto-joulutortut` | keto-leivonnainen | MISSING; GK-arvio tehty |
| `pad-thai-vhh-konjac` | VHH, tuotekohtainen nuudeli/kastike | INSUFFICIENT SOURCE DATA |
| `vhh-lohikeitto-kukkakaalilla` | suomalainen VHH | INSUFFICIENT SOURCE DATA |
| `karjalanpaisti-vhh` | suomalainen VHH | ESTIMATE WITH EVIDENCE |
| `butter-chicken` | kansainvälinen, kastikkeen ja marinadin epävarmuus | INSUFFICIENT SOURCE DATA |
| `paella-valenciana` | kansainvälinen riisiruoka, reseptivaihtoehtoja | MISSING |
| `lahi-ita-menemen-sumakilla` | kansainvälinen aamupala | ESTIMATE WITH EVIDENCE; GK-arvio tehty |
| `valimerellinen-jogurttikulho-hunajalla` | aamupala, hunaja ja hedelmät | ESTIMATE WITH EVIDENCE; GK-arvio tehty |

Lähtötilaa ei käytetä Nutriticsin tuloksen hyväksymiseen. Päivän 3 vertailu tallennetaan manuaalisesti kokeilun aikana erilliseen yksityiseen työmuistiinpanoon. Julkiseen repohaaraan kirjataan vain aggregoidut havainnot ja käyttöoikeuksien kannalta turvalliset yhteenvedot.

## Tietoturva ja API-sovitin

`site/scripts/nutritics-evaluation-client.ts` on erillinen kokeilusovitin. Synteettinen tila toimii vain injektoidulla feikkikuljetuksella; ilman sitä se ei voi tehdä verkkopyyntöä. Live-tila vaatii eksplisiittisen `mode: "live"`-valinnan, Nutriticsilta vahvistetun avainotsakkeen, hyväksyttyjen v1.2-päätepisteiden listan ja avaimen. Sovitin ei ole tuotantosivun riippuvuus, sitä ei kutsuta buildissa tai normaalissa CI:ssä oikean verkkokuljetuksen kanssa, eikä mukana ole ajastusta.

API-avain siirretään vain otsakkeessa, ei URL:ssa. API-tuotesivun yleinen autentikointiteksti ja Explorerin API Key -valitsin eivät yksilöi nykyisen avainotsakkeen nimeä/arvoa, joten live-tila edellyttää Nutriticsin kirjallista vahvistusta. Se on kovakoodattu viralliseen `https://www.nutritics.com`-alkuperään. Uudelleenohjauksia ei seurata; URL-tunnukset, traversal-polut, ulkoiset alkuperät ja allowlistin ulkopuoliset päätepisteet torjutaan. Avainta tai vastausrunkoa ei kirjata lokiin/virheviestiin. Kustannusmittari laskee kutsut, virheet, keston ja quota-otsakkeet; rahakustannus on `UNKNOWN`, ellei kirjallinen yksikköhinta ja valuutta ole tiedossa.

Kokeilun päätyttyä lisättävät vastaukset, muistiinpanot ja raportit käyvät läpi lisenssi- ja salaisuusarvion. Todellisia Nutritics-vastauksia ei commitoida.

## Käyttöehdot ja ulkoiset kysymykset

Nutriticsin sivusto tarjoaa maksuttoman tarjouspyynnön, ei julkaistua ilmaista API-kiintiötä. Tarjous ja käyttöehdot pyydetään ennen sitoutumista. Julkisista lähteistä ei ole vahvistettu Finelin saatavuutta Nutriticsin Suomen lähteenä, kokeilutilin API-oikeuksia tai mahdollisuutta julkaista tuloksia. Katso [ominaisuusmatriisi](feature-matrix.md), [7 päivän protokolla](seven-day-protocol.md), [vertailupohja](comparison-template.csv) ja Nutriticsin [API-sivu](https://www.nutritics.com/en/product/food-data-api/), [API Explorer](https://www.nutritics.com/api/v1.2/explorer/) sekä [hinnoittelu](https://www.nutritics.com/en/pricing/).
