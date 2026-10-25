# Nutritics-kokeilun valmistelu

Tämä kansio valmistelee käyttäjän itse aktivoimaa seitsemän päivän Nutritics-kokeilua. Se ei ole tuotantointegraatio. Älä lisää tänne API-vastauksia, avaimia, tilitietoja, lisensoituja ruokatietueita tai Nutriticsista kopioitua tietokantaa.

## Eristys ja nykytila

- Työhaara: `codex/nutritics-evaluation`, luotu `origin/main`-haarasta.
- Vertailun lähtö-SHA: `ce5b2ef4ddae0507a3dae6fc5de5d88fb0693868`.
- Käynnissä oleva GI/GK-laskentatyö on erillinen. Sen työpuita tai muutoksia ei sisällytetä. Tässä työssä Nutriticsin GI/GK-ominaisuutta vain tarkastellaan; kokeilutuloksia ei kopioida GI/GK-laskentaan.
- Haaran valmisteluvaiheessa (25.10.2026 ajettu tiukka audit) ravintoarvoauditin jakauma on 120 `ESTIMATE WITH EVIDENCE`, 86 `INSUFFICIENT SOURCE DATA` ja 119 `MISSING` (325 reseptiä). Repon aiempi tallennettu audit-tilannekuva oli vanhentunut; tämän haaran ajettu tulos on vertailun lähtötila. Nämä ovat auditin luokkia, eivät väitteitä Nutriticsin tarkkuudesta.
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

`site/scripts/nutritics-evaluation-client.ts` on erillinen kokeilusovitin. Se tekee verkkopyynnön vain, kun kutsuja antaa sen suoraan ajossa ja injektoi kuljetusfunktion. Sovitin ei ole tuotantosivun riippuvuus, sitä ei kutsuta buildissa, eikä mukana ole oletusarvoista Nutritics-pyynnön ajastusta.

API-avain siirretään otsakkeessa, ei URL:ssa. Otsakkeen nimi jätetään asetettavaksi, koska julkinen nykyinen dokumentaatio ei vahvista uuden API-avaimen täsmällistä otsakeskeemaa. Oikea nimi ja API-kokeilun kutsuoikeudet on vahvistettava Nutriticsilta ennen live-pyyntöä. Avainta ei kirjata lokiin tai testitulokseen. Kustannusmittari laskee kutsut ja keston; rahakustannus näytetään vain, jos kokeilun kirjallinen yksikköhinta on tiedossa.

Kokeilun päätyttyä lisättävät vastaukset, muistiinpanot ja raportit käyvät läpi lisenssi- ja salaisuusarvion. Todellisia Nutritics-vastauksia ei commitoida.

## Käyttöehdot ja ulkoiset kysymykset

Nutriticsin sivusto tarjoaa Food Data API:lle ilmaisen tarjouksen pyytämisen, ei julkaistua ilmaista API-hintaa. Tarjous ja käyttöehdot pyydetään ennen sitoutumista. Julkisista lähteistä ei ole vahvistettu, että Fineli olisi käytettävissä Nutriticsin Suomen lähteenä. Katso [ominaisuusmatriisi](feature-matrix.md), [7 päivän protokolla](seven-day-protocol.md) ja Nutriticsin [API-sivu](https://www.nutritics.com/en/product/food-data-api/), [API Explorer](https://www.nutritics.com/api/v1.2/explorer/) sekä [hinnoittelu](https://www.nutritics.com/en/pricing/).
