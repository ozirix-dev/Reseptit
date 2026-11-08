# Välipalat – erä 02: viisi uutta ja kaksi olemassa olevaa reseptiä

Päiväys: 2026-11-06. **KATSELMOINTI, EI TUOTANTOVIENTI.** Tämän paketin muutokset ovat vain `docs/reviews/`-hakemistossa, eivät julkaistussa reseptipuussa. Kolme edellistä kohdetta käsitellään erillisessä PR:ssä #319.

## Viisi uutta katselmointia

| # | Resepti | Annos | Tila | Keskeinen esto |
|---|---|---|---|---|
| 20 | Tonnikalatäyte kurkkukupeissa | ¼ erästä | HOLD | Valutetun tonnikalan täsmätuote, majoneesin koostumus, syötävä kurkkumassa |
| 24 | Rapeat VHH-siemennäkkärit | 1/12 levystä | HOLD | Koepaisto, pellavarouheen soveltuvuus ja siemenen tarkat lähteet |
| 26 | Pekoni-juustotäytteiset jalapeñot | 2 chilipuolikasta | HOLD | Jalapeñon täsmälähde ja pekonin paistohävikki |
| 27 | Kesäkurpitsalastut parmesaanilla | ⅓ erästä | HOLD | Kuivaus/rapeus testattava, savupaprika ja juuston käsittely |
| 30 | Manteliset suklaapallot | 1 pallo | HOLD | Makeutuksen polyolit, mantelijauhon ja kookoksen koostumus ja koekeittiö |

Kaikkien uusien FI-luonnosten grammamäärät, annokset ja valmistus on tarkennettu; `diet_class` ja ravintoarvoluvut ovat tarkoituksella asettamatta. **GK = HOLD kaikilla viidellä**, kunnes aineosien GI-soveltuvuus on hyväksytty. Puuttuva tai epävarma tieto ei ole nolla.

## Kaksi ennestään repoissa olevaa katselmointikohdetta

**#11 Munakasmuffinit:** `reseptit/aamupalat/munakasmuffinit.md` on jo **published**. Sitä ei monisteta uutena välipalareseptinä eikä URL-osoitetta vaihdeta. Välipalakäyttö voidaan tulevaisuudessa tarjota **toissijaisena käyttötarkoitustunnisteena**, mutta sellainen muutos tarvitsee oman katselmoinnin, koska julkaistu resepti ja sen GK-sidokset ovat sinetöityjä. Päätös: **säilytä julkaistu aamupalaresepti ennallaan; ei uutta välipalareseptiä.**

**#23 Suklaamousse-keto:** `reseptit/jalkiruoat/suklaamousse-keto.md` sisältää nyt vain otsikon, ilman kelvollista `frontmatter`-reseptiä. Se ei ole julkaistu toimiva resepti. Älä luo toista samaa ID:tä huomaamatta; päätä myöhemmin, täydennetäänkö nykyinen otsikkoraakile oikeaksi keto-suklaamousseksi (vain, jos erillinen täsmäresepti ei jo ole julkaistu). Päätös: **HOLD – odottaa pohjareseptin ja duplikaattien tarkastusta.**

## Lähteet ja tarkka estejono

Kunkin viiden FI-reseptin ainesosa ja sen pääasiallinen Fineli/AFCD/tuotetietolähde on osoitettu tiedostossa `docs/reviews/valipalat/era-02/source-bindings.json`. `EXACT` on koostumuslähteen aineidentiteetin ehdokas, ei ihmisen jo hyväksymä ravintolaskenta. `REVIEW` vaatii tuotteen vahvistuksen; `PROVISIONAL` ei oikeuta julkisiin ravintoarvoihin. Osassa painon hävikki on edelleen tuntematon.

**Luokittelupäätös:** viiden uuden reseptin tuotantovalmius = HOLD, nykyisten munakasmuffinssien uudelleenjulkaisu = EI, suklaamousse = HOLD. Jäljellä olevista kahdeksasta muualla tallennetusta ehdokkaasta ei poisteta mitään eikä aloiteta julkaisuja.

## Yhteinen 10 reseptin tilanne

- Ensimmäinen erä PR #319: **3 reseptiä**, 9 käännösluonnosta, laskentalähteet ja GK HOLD.
- Tämä erä: **5 erillistä FI-reseptiä**, punnitut työversiot ja lähdekartoitus.
- Nykyiset kohteet: **1 jo julkaistu aamupalaresepti + 1 otsikkoraakile**.
- Kahdeksan erillistä myöhempää luonnosta: pysyvät HOLD / draft -jonossa.
- **Uusia reseptejä tässä PR:ssä julkaistu: 0.** Kolmen jo valmistellun reseptin kuvia ei saa tulkita julkaistuiksi tai GI/GK-näytöksi.

## Seuraava hyväksymisvaihe

Ratkaise ensin täsmätuotteet sekä valmistushävikit. Vasta sitten CI:ssä validoitava ravintoarvoevidenssi, neljän kielen lopullinen merkitystarkistus, oikeat reseptikuvat ja omistajan hyväksyntä. Viidestä uudesta saa tarvittaessa erikseen ensimmäiseen julkaisuun parhaiten todistetun osan ilman, että HOLD-reseptit pysäyttävät muuta erää.
