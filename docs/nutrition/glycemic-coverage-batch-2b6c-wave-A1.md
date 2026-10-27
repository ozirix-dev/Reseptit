# GI/GK-erän 2B6C – aalto A1: riippumattoman katselmoinnin korjattu tulos

## Lähtötilanne ja lopputulos

- Lähtö-main: `b2ac53b11b45b8759d5f841ba978c966a50efe26`.
- Alkuperäisessä A1-luonnoksessa oli neljä mahdollista GK-arviota. Riippumaton lähdekatselmointi hyväksyi niistä **kaksi** ja palautti kaksi estetyiksi.
- Uusia GI-tietueita: 0.
- Hyväksytyt 134 vanhaa GK-arviota ja niiden luokat pysyivät ennallaan; uusia estymisiä tai fingerprint-ristiriitoja ei tullut.
- Lopullinen ehdotettu kattavuus: **325 reseptiä / 136 laskettua / 189 keskeneräistä / 42 GI-tietuetta**. Tuotantoon ei julkaistu.

## Lähteillä hyväksytyt uudet arviot

| Resepti | GK/annos | Luokka | Luottamus | Päätöksen peruste |
| --- | ---: | --- | --- | --- |
| `meksikolainen-aamiais-tacot-mustapavuilla` | 16,04 | MEDIUM | LOW | Julkaistu kaupallisen maissitortillan pienen otoksen GI-tutkimus. Lämmin tortillapohja vastaa tarkasteltua ruokamuotoa riittävällä varauksella, muttei muodosta mitattua aterian GI:tä. Avokadon 0,462 g/annos sekä aiemman 0,265 g/annos pienosuudet jäävät alle toimituksellisen 1 g / 2 g -rajan. |
| `vhh-kaalikaarryleet` | 9,24 | LOW | LOW | Kuohukermalle ei siirretty yleistä maitotuotteiden GI:tä. Kerman laskettu imeytyvä hiilihydraattiosuus 0,725 g/annos voidaan jättää pienosuutena pois; kaikkien poisjättöjen summa 1,578025 g/annos jää alle nykyisen 2 g:n rajan. |

## Hylätyt alkuperäiset A1-arviot

| Resepti | Alkuperäinen luonnos | Lopullinen status | Syy |
| --- | --- | --- | --- |
| `meheva-suklaakakku` | GK 20,31 | INSUFFICIENT SOURCE DATA | Vuoden 2021 GI 29 -keskiarvo mitattiin tummalle suklaalle sellaisenaan. Kakun suklaa sulatetaan, paistetaan taikinassa sekä sekoitetaan kuumaan kuorrutteeseen; valmistustapavastaavuutta ei ole vahvistettu. 2B6B:n BLOCKED-päätös säilyy. |
| `meksikolainen-paputostada-aamupalaksi` | GK 16,04 | INSUFFICIENT SOURCE DATA | Reseptin pohja on rapea tostada, mutta Noriegan GI-tutkimus koskee kaupallista tavallista maissitortillaa ilman vastaavaa todistettua rapeutusta. |

Molempien numeerinen GK on `null`. Laskentasyötteet ja fingerprint-sidonnat palautettiin hyväksytyn lähtö-mainin tasolle. Mikään hylätyistä arvioista ei jää julkiseksi laskentatulokseksi tai nollaksi. GI-laskentamallin uudet suklaata koskeneet ruokaryhmäsäännöt poistettiin, koska ne olisivat sallineet huonosti vastaavan lähteen.

## Lähde- ja testausportti

- Käytä vain ruoka- ja valmistustapavastaavuuden täyttäviä, lähteistettyjä GI-tietueita. Maissitortillan leipä→glukoosi-muunnos ja pieni n=8 pidetään näkyvissä LOW-luottamuksen yhteydessä.
- Tavalliset ravintoarvot, reseptien ainesosamäärät, GK-kaava, luokat ja pienosuustoleranssit pysyvät ennallaan.
- Uudet regressiotestit varmistavat kahden hyväksytyn tuloksen sekä kakun ja tostadan GK-eston. Koko 325 reseptin inventaario on päivitetty 136/189-tilaan.
- Edellisen HEADin testitulokset eivät ole todistus tämän korjauscommittien CI:stä. Viimeinen HEAD ja CI pitää vahvistaa ennen PR:n hyväksymistä.

## Jatkoportti

A2- ja A3-aaltoja ei aloitettu: tomaattimurska, liemet, kookosmaito, tamarindi ja taatelit eivät läpäisseet nykyistä lähde- ja valmistustapapolitiikkaa. Tavoitteena on luotettava, ei keinotekoisesti kasvatettu GK-kattavuus.

PR #117 ja ReportHub PR #70 pidetään Draft-tilassa riippumattoman katselmoinnin ajan. Ei yhdistämistä eikä Pages-julkaisua.
