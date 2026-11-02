# GK80 – Operaatio 145: PR #175:n lähdekorjaus

**Päätös: CONDITIONAL GO.** Marokkolaisen couscousin korjattu
GK-ehdokas on **37,50/annos, LOW**. Kaikki neljä julkista makroarvoa
pidätetään puuttuvan tuotekohtaisen polyolitiedon vuoksi.
Omistaja hyväksyi 2.11.2026 täsmällisen version, LOW-sovellukset ja neljän
makron pidätyksen sekä valtuutti Ready-siirtymän ja Codex Review’n.
PR #175 on Ready for review. **Mergeä ja deployta ei ole valtuutettu.**
[Hyväksynnän alkuperä ja lukitut hashit](owner-approval.json).

Main-pohja: `adda64fda9bf63e69e190b6d888698587a250a2a`.
Tuotanto: **146/326 (44,79 %)**. PR:n ehdokas: **147/326 (45,09 %)**.
Ehdokaskattavuus ei ole tuotantokattavuus. Carnitas säilyy HOLDissa.
Muut PR:t, ReportHub ja rinnakkaiset suunnitteluprojektit ovat erillään.

## A–D. Koostumusratkaisu ja laskennan vaikutus

[Valmistajan kuivan tuotteen etiketti](https://sanremo.com.au/products/couscous/)
antaa /100 g: hiilihydraatti 72 g, kuitu 3 g, proteiini 12,5 g ja rasva 2 g.
Polyoleja ei ilmoiteta. [AU/NZ-määritelmä](https://www.legislation.gov.au/F2015L00385/2025-06-18/2025-06-18/text/original/epub/OEBPS/document_1/document_1.html)
ja [Schedule 11 S11—3](https://www.legislation.gov.au/F2015L00481/2024-10-29/2024-10-29/text/original/epub/OEBPS/document_1/document_1.html)
tukevat luvun käsittelyä saatavana hiilihydraattina: kuitua tai polyoleja
ei vähennetä siitä uudelleen. Tämä ei osoita tuotteen polyolimäärää nollaksi
eikä selvitä valmistajan tarkkaa analyysimenetelmää.
Sisäisen `EU_AVAILABLE`-kentän käyttö on määritelmän normalisointi,
ei väite Australian etiketistä EU-etikettinä. EU:n etikettimääritelmässä
hiilihydraatti sisältää polyoleja ([1169/2011, liite I kohta 7](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32011R1169)).

Fineli 29208:n 63,6 g on geneerisen kuivan kuskusin oma koostumustieto.
Se ei ole nimetyn San Remo -tuotteen parempi koostumuslähde, kun valmistajan
oma etiketti on saatavilla. Eroa ei selitetä kuituna tai kypsän tuotteen vetenä.
Fineli säilyy vain vertailu-/historiatietona, ei tämän tuotteen aktiivisena syötteenä.
Rajattu saman tuotteen tarkemman teknisen/polyolitietueen haku ei tuottanut
parempaa ensisijaista lähdettä. Kolmatta yleistä tietokantaproxyä ei oteta käyttöön.

Samalla 250 g:n kuivamäärällä ja neljällä annoksella:

| Vertailu / annos | A: Fineli, hylätty julkaisuvalinta | B: valmistajan etiketti |
| --- | ---: | ---: |
| Saatavan hiilihydraatin ainesosasumma | 61,8565 g | 67,1065 g |
| GK tarkkana laskentatuloksena | 34,08285 | 37,49535 |
| GK kahden desimaalin katselmointiarvona | 34,08 | **37,50** |
| Proteiinin ainesosasumma | 46,447625 g | 47,072625 g |
| Rasvan ainesosasumma | 17,31625 g | 17,87875 g |
| Julkinen neljän makron paketti | vanha vertailu 61,86 / 70,94 / 46,45 / 17,32 g | **kaikki neljä pidätetty** |

Erotus: `(72−63,6)×250/100/4 = 5,25 g` saatavaa hiilihydraattia/annos;
GK-muutos `5,25×65/100 = 3,4125`. Lähdevertailu ei ole biologinen vaihteluväli.
Pienten mausteiden erillinen GK-poisrajauskatto säilyy 0,664 g:ssa/annos;
sitä ei väitetä todelliseksi puuttuvaksi hiilihydraattimääräksi.

B:n tunnetut ainesosasummat ovat diagnostisia, eivät osittain julkaistavia
makroarvoja. Sivuston kokonais-CHO olisi symbolisesti `75,879 + 0,625×P`
g/annos, missä P on kuivan San Remon tuntematon polyolimäärä g/100 g.
Nykyinen makromalli vaatii varmennetun polyolitiedon myös neton todentamiseen.
Siksi netto, kokonais-CHO, proteiini ja rasva ovat FI/EN/SV/TH:ssa kaikki `null`.
Tämä käyttää olemassa olevaa `WITHHELD_SOURCE_INCOMPLETE`-menettelyä.
Vanhaa Finelin nollaa tai AFCD-makroevidenssiä ei siirretä uudelle lähteelle.

## E. Hyväksyttävä täsmällinen versio

Operaatio 145 muuttaa lähdevalinnan, makrojen pidätyksen ja lähdeselitteet.
Ainesosamäärät, valmistusohjeet ja annosmäärä säilyvät PR:n edellisestä HEADista:

- 600 g nahatonta luutonta paistileikettä; ei rintalihavaihtoa.
- 400 g juuri suolavedessä keitettyjä kokonaisia kikherneitä, punnittuina
  valuttamisen jälkeen ja lisättyinä pois lämmöltä valmiiseen kuumaan pataan.
  Ei säilykkeen 15 minuutin uudelleenkeiton GI-siirtoa.
- 250 g kuivaa tavallista San Remo CousCousia ja 375 ml kiehuvaa vettä,
  viisi minuuttia peitettynä. Ei helmiversiota, paahtamista tai jäähdytystä.
- 1000 g käyttövalmista kanalientä punnittuna, kaikki jäljelle jäävä liemi
  tarjoillaan neljässä annoksessa. Ei litran tiheysoletusta tai hävikkihyvitystä.
- Kokonaisaika noin 150 minuuttia; mahdollinen esiliotus erikseen.

Historiallinen San Remo GI 65 (2006, n=9) ei mittaa nykyistä tuote-erää.
[Khan ym. 2008:n](https://doi.org/10.3923/pjn.2008.104.108) keitettyjen
kikherneiden GI 36 on edelleen SUPPLEMENTARY/ANALOG/LOW: n=7 terveet miehet,
yksi glukoosivertailu ja neljä näyteaikaa; lajike, keittoaika ja tarjoilulämpötila
puuttuvat. Ei ISO-varmennusta, yleistä ruokalajiarvoa tai SEM-epävarmuusväliä.
Kypsien kikherneiden Fineli 11089 ja kanaliemen Fineli 30315 säilyvät erillisinä
ilmoitettuina koostumusproxyinä. Aiemmat hylätyt valmistusanalogiat säilyvät
[lähdekatselmoinnissa](source-review.json).

Omistaja hyväksyi yhtenä kokonaisuutena tämän tarkan version, rajatut
LOW-sovellukset, nykyetiketin käytön ja neljän makron pidätyksen.
Hyväksyntä on sidottu HEADin `447bbad866383ed154b8a3971a8540ab6395ad84`
resepti-, makro- ja GK-evidenssihasheihin. Tätä merkintää varten ei muuteta
lukittuja reseptejä, laskentoja, lähdetietueita tai niiden hasheja.
Alkuperäisen evidenssin ja historiallisten raporttien PENDING-tekstit kuvaavat
niiden tallennushetkeä; nykyinen omistajapäätös on erillisessä hyväksyntätietueessa.
Täydellisen makropaketin GO edellyttäisi vielä tuotekohtaista polyolitietoa;
hyväksyntä ei yksin korvaa sitä. Neljän kielisivun HTML:stä varmennettu
julkinen näyttö on tässä noin 38, ei katselmointitaulukon kahden desimaalin 37,50.

## F. Carnitasin muuttumaton HOLD

Carnitasin appelsiinimehun ja hedelmäpalojen 2,5 tunnin haudutuksen GI-vastaavuutta
ei ole osoitettu. Raaka-appelsiinia, mehua tai säilykemandariinia ei siirretä
automaattisesti tähän valmistukseen. Appelsiiniosuus ylittää nykyisen
yksittäisen poisrajausrajan. Reseptiä, määrää, makropakettia tai käännöksiä
ei muuteta. Uutta appelsiinitutkimusta ei käynnistetä.

## G–I. Jäljitettävyys ja varmennus

- [Nykyinen integraatio, hashit ja makrotila](integration.json),
  [päätökset](decisions.json), [kohdennettu laskenta](targeted-results.json).
- [Operaatio 145:n lähdemääritelmä](operation145/source-definition.json),
  [Decimal-herkkyysvertailu](operation145/sensitivity.json) ja
  [nykyisen korjauksen varmennus](operation145/validation.json).
- [Riippumaton Decimal-varmennin](verify_decimal.py) tarkistaa GK:n,
  poisrajaukset ja todellisen puuttuvan polyolitiedon sekä makrojen pidätyksen.
- [Mainin vertailutila](main146-baseline.json) suojaa 146 aiempaa numeerista
  tulosta ja muiden 325 reseptin täydelliset GK-tulosobjektit.
- [Vanha Fineli-vertailu](operation145/fineli-comparison-baseline.json) ja
  alkuperäinen `validation.json` ovat historiallisia. Niiden 34,08 ja täydet
  makrot eivät kuvaa tämän korjauksen julkaisutietoja.
- Alkuperäinen PR-kuvaus säilyy historiatietona; tämän tiedoston nykyversio
  ja uusi korjauscommitti korvaavat sen vanhan GK-/makroyhteenvedon.
  Repo_guard ei tarjoa PR-kuvauksen muokkausta eikä suoria GitHub-muutoksia käytetä.

## J. Seuraava rajattu työjono

[Yhdeksän nykyisen HOLD-reseptin priorisoitu työjono](operation145/next-queue.json)
perustuu vain aiempiin tutkimuspaketteihin ja nykyisiin esteisiin:

1. Jauhelihapihvit VHH-kermakastikkeella: Dijon-/liemituotteen koostumus ja sidonta.
2. Ropa vieja: laakerin koostumusraja sekä tomaatti-/liemivastaavuus.
3. Kana-parmesaanipannu parsakaalilla: pippuri ja nimetty liemituote.
4. Kermainen kanasienipannu: liemi/Dijon sekä pippuri/timjami.
5. Siskonmakkarakeitto juureksilla: mausteet, liemi ja valmistusvastaavuudet.
6. Palak paneer: paneerin polyolit sekä mausteseoksen tarkka koostumus/määrä.
7. Nakkikeitto kukkakaalilla: laakeri ja nakki-/liemilähde, kumulatiivinen poisrajaus.
8. Jerk-kana: kevätsipulin syötävä massa ja nykyversion syötekartoitus.
9. Pav bhaji: nimetyn mausteseoksen koostumus ja korianterin määrä.

SOURCE-01 voi auttaa vain, jos tuleva aineisto todella kattaa täsmällisen
tuotteen, tilan, hiilihydraattimääritelmän ja eksplisiittiset komponentti-/polyolitiedot.
Se ei itsessään korvaa puuttuvaa GI-tutkimusta, valmistusnäyttöä tai reseptimassaa.
Rinnakkaisten suunnittelujen sisältöön ei ole koskettu. Seuraavaa erää ei aloiteta.
