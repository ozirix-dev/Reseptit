# Käännösten ihmistarkistuksen työjono

Suorita `site/`-kansiossa `npm run review:translations`.
Komento lukee julkaistun inventaarion, nykyiset rakennetarkistukset ja
tunnettuja virheitä etsivät semantiikkasäännöt. Se kirjoittaa paikallisen
`tmp/translation-review/index.html`-vertailupaketin ja `registry.json`-rekisterin.
`--snapshot` tallentaa päivätyn työn yhteydessä rekisterin myös dokumentaatioon.
Paketti ei kuulu `site/public`- tai `site/dist`-hakemistoon eikä sivuston buildiin.

Suomenkielinen lähde ja käännös näkyvät rinnakkain. Näkyvissä ovat otsikko,
ainesrivit määrineen, annokset, ravintoluvut, alt-teksti ja tunnisteet sekä koko
Markdown-leipäteksti kuvauksineen, valmistusohjeineen ja muistiinpanoineen.
HTML escapetaan; lähteestä ei suoriteta skriptejä. Epäillyt merkityserot
näkyvät rekisteririvin havainnoissa.

## Tarkistusjärjestys

Thaikielisten reseptien ainekset ja valmistus ensin, sitten EN ja SV.
Kunkin kielen sisällä tarkistetaan korkea riski ensin. Eläinlajit, kala ja
äyriäiset, allergeenit, raaka/kypsä, lämpötilat, säilytys, määrät,
kieltomuodot ja ruokavalioväitteet nostavat prioriteettia.
Riskit ovat toimituksellisen jonon heuristiikka, eivät todiste virheestä.
Käytä [ruokasanastoa](../meta/kaannokset/ruokasanasto.md).

## Tilat ja hyväksyntätodiste

| Tila | Merkitys |
| --- | --- |
| NOT REVIEWED | Vastine tai kelvollinen tarkistusnäyttö puuttuu |
| AUTOMATED REVIEW ONLY | Koneelliset tarkistukset tehty; ihminen ei hyväksynyt |
| HUMAN REVIEW IN PROGRESS | Ihmisen aloittama, dokumentoitu tarkistus |
| HUMAN REVIEW COMPLETE | Todellinen hyväksyntä täsmälleen näille tiedostoversioille |
| REVIEW STALE | Lähde tai käännös muuttui, tai koneellinen tarkistus löysi virheen |

`meta/kaannokset/human-review-evidence.json` on tarkoituksella tyhjä.
Vain todellisen ihmistarkistuksen jälkeen ylläpitäjä lisää tietueen:
`recipe_id`, `locale`, `evidence_id`, molemmat rekisteristä kopioidut
`source_content_hash` ja `translation_content_hash`, `reviewed_at` (YYYY-MM-DD),
`scope`, `status` (`in-progress` tai `complete`) ja `human_attestation: true`.
Rajauksen tulee kattaa title, description, ingredients, instructions, notes,
nutrition, alt ja tags. Täydellinen tarkistus ei synny osittaisesta hyväksynnästä.

Todiste-ID viittaa säilytettyyn ihmisen hyväksyntään, esimerkiksi tämän
versioparin PR-katselmointiin tai yksityisen toimituksen hyväksyntätunnisteeseen.
Älä kirjaa henkilön nimeä, sähköpostia tai muuta tarpeetonta henkilötietoa.
Ohjelma validoi dokumentoidun väitteen ja version, ei todista todistetta
aidoksi: ylläpitäjän on varmistettava hyväksynnän antaja ja rajaus.
Kielimalli tai CI ei saa lisätä omaa työtään ihmistodisteeksi.

SHA-256 lasketaan koko tiedoston tekstistä, ainoastaan CRLF normalisoidaan LF:ksi.
Metadata, määrät, huomautukset ja valmistus ovat näin mukana. Sekä lähteen
että käännöksen muutos vanhentaa hyväksynnän. Päivätty rekisteri on snapshot:
aja komento uudestaan ennen hyväksyntää. Luonnos ei täytä julkaistua vastinetta.
Rekisteri ei muuta reseptien julkaisutiloja.

## Automaation rajat

Tunnetut väärät termit ja kauralesesämpylöiden havaittu kieltomuotovirhe
tarkistetaan aiemmilla rajatuilla säännöillä. Kaikkien lauseiden merkitystä,
luontevuutta, allergeeniturvallisuutta tai ruokavaliolupausta ei voi todistaa
näillä testeillä. V1.3/V1.4-korjauksia ei tehdä uudelleen massana.
