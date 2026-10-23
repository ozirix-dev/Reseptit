# Sivukartan lähetys ja Italian padan aika-arvio

Päiväys: 23.10.2026, Europe/Helsinki.
Haara: `codex/reseptit-followup-audit`; lähtöcommit:
`cf0790ad730d9726d894690c3c146664359c06bb`.

## Sivukartan löytyminen

Käyttäjän pyytämä jatkotyö koski sivukartan löytymistä ja valmistusajan
arviointia. Search Consolen Reseptit-ominaisuuden sivukarttaluettelo oli tyhjä.
Lähetin osoitteen `https://ozirix-dev.github.io/Reseptit/sitemap.xml`.
Google vahvisti lähetyksen ja luetteloon ilmestyi yksi rivi.

Raportti näytti lähetyksen jälkeen **Noutaminen epäonnistui** ja 0 löydettyä
sivua. Tätä ei tulkita sivuston indeksoitujen reseptien määräksi.
Googlen omalla live-URL-testillä sivukartan nouto kuitenkin onnistui
23.10.2026 klo 8.07.33: indeksointi sallittu, nouto onnistui ja hakemistoon
lisääminen sallittu. Manuaalisten toimenpiteiden näkymä ilmoitti, ettei
ongelmia havaittu. Käyttäjän toimittama kuvakaappaus vahvisti tämän.

Julkinen GET palautti HTTP 200 ja `application/xml`; XML jäsentyi ja sisälsi
480 URL-osoitetta. Googlebot-nimellä tehty paikallinen HTTP-pyyntö palautti
myös 200; varsinainen Googlen saatavuusnäyttö on erillinen GSC-live-testi.
Sanitoidut havainnot ovat
[lähetyshavainnossa](../seo/gsc-sitemap-submission-2026-10-23.json).

[Googlen ohje](https://support.google.com/webmasters/answer/7451001?hl=en-GB)
neuvoo käyttämään live-testiä noutovirheen selvitykseen. Virhe voi olla
tilapäinen, ja Google yrittää epäonnistunutta noutoa uudelleen.
Tämän tapauksen syytä tai onnistunutta sivukarttakäsittelyä ei ole todistettu.
Seuraava askel on tarkistaa lähetyksen käsittelytila myöhemmin; välitöntä
toistuvaa lähetystä tai sivukartan nimeämistä uudelleen ei tehty.
Automaattista seurantaa ei perustettu.

[PR #2:n havainto](https://github.com/ozirix-dev/Reseptit/pull/2#discussion_r4327338958)
jää avoimeksi käsittelyn varmistumiseen asti. Originin robots.txt:tä ei
muutettu. Sivukarttatiedostolle ei pyydetty erikseen hakutulosindeksointia.

## Italian padan kokonaisaika

Käyttäjä pyysi arvioimaan kokonaisajan. Reseptin metatieto on nyt
`time_total_min: 60`, ja muistiinpanoissa eritellään:

- valmistelu, ruskistus ja vuoan kokoaminen noin 25 minuuttia
- paisto 20 minuuttia
- vetäytyminen vähintään 15 minuuttia.

Uuni lämpenee valmistelun aikana. Salaatin teko ei sisälly arvioon.
Valmistelun 25 minuuttia on toimituksellinen arvio työvaiheista; paisto ja
vetäytyminen tulevat alkuperäisestä ohjeesta. Aika ei ole kellotettu
koekeittiötulos. Raaka-aineet, annokset ja kypsennysohje säilyivät ennallaan.

Muuttuneet lähde ja käännökset:

- `reseptit/paaruoat/italian-pata.md`
- `kaannokset/en/paaruoat/italian-pata.md`
- `kaannokset/sv/paaruoat/italian-pata.md`
- `kaannokset/th/paaruoat/italian-pata.md`

Aika-arvion ja sen rajausten merkitys verrattiin kaikissa kolmessa
käännöksessä suomeen. Taso on **AUTOMATED SEMANTIC REVIEW**;
**HUMAN REVIEW PENDING** säilyy. Kokonaisia käännöksiä ei merkitä
ihmistarkistetuiksi tämän rajatun lisäyksen vuoksi.

## Tarkistukset ja julkaisu

Ydintestit 36/36, käännöstestit 26/26 ja staattiset testit 18/18 läpäisivät.
Uudet testit tarkistavat arvion, erittelyn ja `PT60M`-arvon Recipe-JSON-LD:ssä
kaikilla neljällä kielellä. Build tuotti 480 reittiä; paikallisessa
SEO-auditoinnissa ei ollut löydöksiä. Markdown-lint ja diff-check läpäisivät.
Kuva- ja selaintestejä ei uusittu tämän pelkän aikalisäyksen vuoksi; ne
läpäisivät saman haaran edellisessä korjauksessa.

Sisältökorjaus commitataan ja pushataan nykyiseen haaraan. Uutta PR:ää,
yhdistämistä tai tuotantojulkaisua ei tehty.
[PR #17:n havainto](https://github.com/ozirix-dev/Reseptit/pull/17#discussion_r4329705260)
on korjattu haarassa, mutta jätetään avoimeksi julkaisuvarmistukseen asti.
Tämä tuoterepon raportti säilyttää käännöstarkistuksen ja GSC-havainnon;
rajatusta jatkokorjauksesta ei tehdä päällekkäistä ReportHub-raporttia.
