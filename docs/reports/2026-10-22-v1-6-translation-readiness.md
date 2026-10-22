# V1.6 – käännösten ihmistarkistuksen hallinta

Päiväys: 22.10.2026, Europe/Helsinki. Lähtö-main:
`02ffd5a92092d27fa8509ec47135d9ecb4c2a497`.
Haara: `codex/reseptit-v1-6-translation-review`.

## Kattavuus ja todellinen tila

Julkaistussa inventaariossa on 119 FI-lähdettä ja 357 käännöstä:
119 EN, 119 SV ja 119 TH. Rekisteri muodostuu inventaariosta eikä
kovakoodatusta rivimäärästä. [Rekisterin snapshot](translation-review-registry.json)
kattaa kaikki 357 paria. Jokaisessa ovat polut, koko tiedoston SHA-256,
rakennetarkistus, rajatun semantiikkatarkistuksen tila, ihmistarkistuksen
tila, päivä/todiste sekä riskiperusteet.

Todellisia dokumentoituja ihmistarkistuksia: **0**. Kaikki 357 ovat
AUTOMATED REVIEW ONLY. Rakennetarkistukset ja aiemmat rajatut virhetermit
läpäisevät; automaattisia havaintoja 0. Tämä ei todista yleistä kielilaatua.
V1.3/V1.4:n korjauksia tai julkaistujen reseptien statuksia ei muutettu.

## Riskijono ja vertailuaineisto

339 korkean ja 18 keskisuuren prioriteetin paria. Luokitus perustuu
sisältöön ja kieleen, ei todettujen virheiden määrään. Thaikieliset ovat
ensin: ainesosat ja valmistus, sitten muu sisältö. Tämän jälkeen EN ja SV,
kunkin kielen korkein prioriteetti ensin. Riskit kattavat lihalajit,
kalan/äyriäiset, allergeenit, kypsennyksen, lämpötilat, raaka/kypsä-eron,
säilytyksen, määrät, kieltomuodot ja ruokavalioväitteet.

`npm run review:translations` tuottaa 357 paikallista HTML-vertailusivua,
hakemiston ja JSON-rekisterin polkuun `tmp/translation-review/`.
FI ja kohdekieli näkyvät rinnakkain: otsikko, kuvaus, ainesosat määrineen,
valmistus, muistiinpanot, ravintoluvut, tunnisteet ja alt-teksti.
Raakateksti escapetaan; paketti ei suorita lähteestä HTML:ää eikä skriptejä.
Sivut eivät sisälly sivuston buildiin tai julkaisuun.

## Hyväksynnän rajat

[Ohje](../translation-human-review.md) määrittelee viisi tilaa ja
ihmistarkistustodisteen. Tyhjä `human-review-evidence.json` ei väitä
olemattomia hyväksyntöjä. Todellinen hyväksyntä tarvitsee päiväyksen,
molemmat tiedostotiivisteet, koko sisällön rajauksen ja todisteen tunnisteen.
Lähteen tai käännöksen muutos tuottaa REVIEW STALE -tilan. CRLF/LF-ero
yksin ei vanhenna tarkistusta. Myös automaattinen virhe estää COMPLETE-tilan.
Ohjelma ei voi todistaa ihmisen identiteettiä tai tunnisteen aitoutta;
ylläpitäjä varmistaa ne ennen tietueen lisäämistä. Henkilötietoja ei tarvita.

## Testaus

`npm ci`, `npm test`, `test:translations` (18), `test:image` (7), `build`,
`test:static` (10), `test:browser` (4, Brave), riippuvuusauditointi,
Markdown-lint ja diff-check läpäisivät lopullisessa tarkistuksessa.
Ensimmäinen build löysi uuden työkalun TypeScript-tyyppivirheen; se korjattiin.
Ensimmäinen selaintestikierros epäonnistui rinnakkaisten työpuiden käyttämän
paikallisen testipalvelimen yhteyteen; erillinen uusinta läpäisi 4/4.
Epäonnistumisia ei tulkittu hyväksytyiksi tuloksiksi.

Uudet regressiot kattavat molemmat muuttuvat tiivisteet, vanhentuneen ja
puutteellisen hyväksynnän, todistetyypit, dynaamisen kattavuuden, luonnoksen,
puuttuvan vastineen, määrän/yksikön ja tunnetun kieltomuotovirheen.
Vanhat termiregressiot säilyvät. Build: 476 versiota / 480 reittiä,
JS 363,97 kB / gzip 116,46 kB, ennallaan. Ei uusia riippuvuuksia.

## Valmius ja seuraava vaihe

Tekninen työkalu on valmis katselmoitavaksi. Kielisisällön ihmishyväksyntä
on avoin: TECHNICALLY READY – HUMAN REVIEW PENDING edellyttäen PR:n
viimeisen commitin CI:n ja koodikatselmoinnin valmistumista.
Omistaja järjestää Thai-arvioijan ja sen jälkeen EN/SV-arvioinnin, säilyttää
todisteet ja päättää mergeistä erikseen. Tässä työssä ei mergeä eikä deployta.
Työpaketit A/B lähtevät samasta mainista; yhteinen package.json-tiedosto
sovitetaan ja testataan erillisessä yhdistelmätyöpuussa.
