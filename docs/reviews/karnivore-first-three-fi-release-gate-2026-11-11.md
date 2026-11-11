# Karnivore: kolmen FI-reseptin ensimmäinen julkaisuerä – rajattu hyväksyntäportti (11.11.2026)

Tämä on PR #448:n työasiakirja, ei julkaisu- tai ravintoarvohyväksyntä. PR #450:n ruokavaliosuodattimet on jo yhdistetty mainiin, mutta karnivore-valinta ei saa avautua ilman SHA-lukittua, hyväksyttyä julkaistua reseptiä.

## Ensimmäinen erä – lukitut raakapainot

| Resepti | Annosta | Ainesosat | Lähdematch / jäljellä oleva ongelma |
| --- | ---: | --- | --- |
| `karnivore-steak-and-eggs` | 2 | entrecôte 360 g; kuoreton kananmuna 220 g; voi 20 g; suola 3 g | AFCD:n scotch fillet on välillinen entrecôte-vastine; pihvin rasvaisuus sekä pannulle jäävä voi varmistettava |
| `karnivore-voilohi-pannulla` | 2 | nahallinen lohifilee 400 g; voi 35 g; suola 3 g | Nahallisen fileen syötävä osuus, lohen koostumus ja paistorasvan päätyminen annokseen varmistettava |
| `karnivore-jauhelihakulho-munalla` | 2 | 20 % naudan jauheliha 400 g; kuoreton kananmuna 110 g; suola 4 g | Snellman 20 % -tuote on valmistajan dokumentoima *ehdokas*; resepti ei vielä määrää täsmätuotetta eikä kypsennyksen rasvasaantoa |

Lähdeaineisto: `docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json`; reseptien kanoniset FI-luonnokset ovat `tuonti/karnivore/paaruoat/`-kansiossa. Syötävä määrä, kypsennyshävikki ja pannuun jäänyt rasva on erotettava ennen lopullisia energia-, rasva- ja proteiinilaskelmia. Tuotteet, joihin ei ole vahvistettu sopivaa täsmätietuetta, pysyvät proxy-tilassa.

## Yhteinen julkaisupäätös: kaikki kohdat pakollisia

- [ ] Reseptin valittua raakatuotetta vastaava ravintotietue (tai dokumentoitu ja hyväksytty vastaavuus) sekä lähdeversio ja tunniste; ei proxy-merkinnän hiljaista muuttamista exactiksi.
- [ ] Syötävän osuuden ja todellisuudessa annokseen jäävän rasvan perusteltu, kirjattu laskentamalli. Jos tämä jää epävarmaksi, julkaistavaa kokonaistulosta ei lasketa.
- [ ] Annoskohtaiset energia, proteiini, rasva, hiilihydraatit ja kuitu laskettu samasta ainesosaversiosta; ei puuttuvan tiedon nollaksi pakottamista. Lähteistetty laskenta `docs/nutrition/calculations/`-hakemistossa.
- [ ] GI/GK arvioitu projektin voimassa olevalla portilla. Eläinperäinen ei tarkoita automaattisesti GK = 0; tuntematon GK pidetään tuntemattomana.
- [ ] Oma ruokalajin ja lopullisten ainesosien kanssa vastaava WebP-kuva, alt-teksti ja kuva-metadata; ei koristekasviksia, sitruunaa tai muita reseptiin kuulumattomia ruokia.
- [ ] Sisällöllinen duplikaattivertailu julkaistuihin pihvi-, lohi- ja jauheliharuokiin, ei vain ID/slug-tarkistus.
- [ ] Ruokaturvallisuustarkistus: pihville voimassa oleva ohje ja lepoaika, kalalle 63 °C sekä jauhelihalle kauttaaltaan turvallinen kypsyys; kanoninen resepti pidetään keskenään ristiriidattomana.
- [ ] Vain nämä kolme siirretään hallitussa *erillisessä julkaisu-PR:ssä* `reseptit/paaruoat/`-hakemistoon; jäljellä olevat seitsemän pysyvät `tuonti/`-jonossa.
- [ ] Karnivore-luokitus `dietTags`-hyväksyntämanifestiin vain lopullisen FI-tiedoston tarkalla Git-blob-SHA:lla. Testaa, että muutos alkuperäiseen tiedostoon pudottaa hyväksynnän pois.
- [ ] CI: sisältövalidointi, ravintoarvot ja GK, kuvat, FI-haku, suodatin, build sekä selaintestit. Merkitse Ready vasta kun tarkka HEAD on vihreä ja katselmointi hyväksytty.
- [ ] Vasta mergeä seuraavan tuotantoajon ja julkisen sivun todentamisen jälkeen merkitse kolme FI-reseptiä julkaistuiksi. EN/SV/TH ovat erillinen myöhempi kielierä, eikä niiden olemassaoloa väitetä.

## Etenemisjärjestys

1. **Jauhelihakulho:** vahvista 20 % jauhelihatuote, dokumentoi rasvan talteenotto ja munan tietue.
2. **Steak & Eggs:** vahvista käytetty entrecôte-leikkuu ja todellinen voiannos; vertaa tämän jälkeen lähdearvoja.
3. **Pannulohi:** vahvista nahallisen lohen ravintovastine ja syötävä saanto sekä voiannos.
4. Tee vasta hyväksytyistä aineistoista kolme erillistä laskelmaa; päätä GK erikseen.
5. Lisää kuvat ja tekninen manifestilukitus erillisessä julkaisu-PR:ssä, aja testit ja julkaise hallitusti.

**Tila: HOLD / NO MERGE.** Tämä dokumentti ei muuta julkaistuja reseptejä, kuvia, ravintoarvoja eikä nykyisiä GK-lähtötasoja.
