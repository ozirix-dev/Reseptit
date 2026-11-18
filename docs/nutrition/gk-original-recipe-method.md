# GK-menetelmä: alkuperäisen reseptin ensisijaisuus

Omistajan vahvistama pysyvä päätös 5.11.2026.

**GK-laskennan pitää mukautua reseptiin. Reseptiä ei saa muuttaa olennaisesti
vain GK-arvon saamiseksi.** Tämä on hyväksytty pysyvä toimintaperiaate.
80 %:n tavoite säilyy alkuperäisten reseptien tavoitteena. Sitä ei saavuteta
muuttamalla reseptejä tai siirtämällä erillisversioita niiden kattavuudeksi.

Sallittuja ovat luotettavat puuttuvien painojen ja määrien täsmennykset,
alkuperäistä vastaavan tuotteen yksilöinti sekä valmistuksen ja annoskoon
selvennykset ilman olennaista muutosta. Käytä valmistukseen soveltuvaa
luotettavaa tutkimustietoa ja perusteltuja epävarmuusvälejä vain menetelmän
salliessa. Tuotteen nimeäminen ei yksin todista vastaavuutta, eikä
raaka-/kypsäpainojen vaihto ole pelkkä yksikkömuunnos ilman saantonäyttöä.

GK-kattavuuden vuoksi ei vaihdeta pääraaka-aineita, vähennetä olennaisesti
ainesmääriä, lisätä alkuperäiseen kuulumatonta riisiä/leipää/lisuketta,
vaihdeta olennaisesti valmistusta tai lientä/kastiketta toiseen tuotteeseen.
Tutkimuksen kanssa yhteensopivaa keinotekoista reseptiä ei rakenneta
alkuperäisen tilalle. Tutkimusannoksen GK ei kasvata kotireseptin kattavuutta.
Tavallinen kulinaarinen parannus on mahdollinen erillisellä sisältöperusteella;
pelkkä laskennallisen kattavuuden kasvattaminen ei ole peruste.

Erota kaikissa mittareissa, käyttöliittymässä ja hyväksynnöissä:

- **Alkuperäinen resepti:** arvio sen todellisesta koostumuksesta ja valmistuksesta.
- **Aito erillinen reseptiversio:** kulinaarisesti mielekäs, erikseen päätetty
  sisältö; sen GK ei ole alkuperäisen GK eikä alkuperäiskattavuuden lisäys.
- **Tutkimusvertailu:** säilyvä tutkimusaineisto, jonka arvoa ei esitetä
  alkuperäisen kotireseptin mitattuna tai luotettavasti laskettuna GK:na.

Näiden luokkien nimet eivät tarkoita vanhojen menetelmien A/B/C-tasoja.
Uudelleenarvioinnin luokat ovat `ORIGINAL_OK` (alkuperäissoveltuvuus osoitettu),
`VARIANT_ONLY` (korkeintaan erillinen versio), `NO_RELIABLE_GK` (nykynäyttö
riittämätön) ja `CLARIFICATION_NEEDED` (pieni perusteltu täsmennys voi riittää).
`VARIANT_ONLY` ei hyväksy variantin GI:tä tai julkaisua. Tekninen PASS,
omistajan sisältöpäätös ja tieteellinen soveltuvuus ovat eri asioita.
Pieni täsmennys ei oikeuta muuttamaan valmistusta GI-tutkimuksen mukaiseksi.

Kun soveltuva GI-tieto, CHO-määrä tai syödyn osuuden määritys ei riitä,
käyttäjälle ilmoitetaan seuraava viesti. Puuttuva arvo säilyy puuttuvana;
sitä ei esitetä nollana eikä epäluotettavaa pistettä varmana tuloksena.

| Kieli | Ilmoitus |
| --- | --- |
| FI | GK-arviota ei voida laskea luotettavasti. |
| EN | A reliable glycemic load estimate is not available. |
| SV | En tillförlitlig uppskattning av glykemisk belastning är inte tillgänglig. |
| TH | ยังไม่สามารถประมาณค่าภาระน้ำตาลได้อย่างน่าเชื่อถือ |

Nämä ovat pysyvä viestisopimus. Käyttöliittymän kytkentä ja vanhojen
julkaisujen luokkasiirrot toteutetaan erikseen katselmoidussa vaiheessa.
Nykyisiä hyväksyntämanifesteja, tarkisteita tai tutkimushistoriaa ei kirjoiteta
uudelleen. [15 ehdokkaan arvio ja kattavuuden korjaussuunnitelma](gk100-original-recipe-audit-2026-11-05.md)

## Pysyvä tutkimuspäätös ja jonon tarkistus

`laskeGK N` ja `laskeGK jatka` käyttävät alla olevaa tarkistusta ennen
GI/GK-lähdehakua. Käytä nykyisen reseptitilaprojektion ja avointen korjaus-
ja tutkimusjonojen perusteella järjestettyjä alkuperäisten reseptien ID:itä.
Merkitse tiedossa olevat P0/P1-tapaukset, myös issue #404:n oikeaan resepti-
versioon kohdistuvat tapaukset, muodossa `--priority=resepti-id`.
Tarkista lista ennen kuin rajaat sen N aloittavaan reseptiin.

Aja `site/`-hakemistossa. Päivitä projektio, kun se puuttuu tai HEAD vaihtuu.

```sh
node --import tsx scripts/recipe-state-cli.ts
node --import tsx scripts/gk-research-queue.ts 10 idli-sambar vhh-mansikkakakku
```

- `next` sisältää enintään N uutta tai uudelleen avattua tapausta annetussa
  järjestyksessä. `counts.skip` laskee samalla sidonnalla ohitetut
  uusintatutkimukset. Raportoi käsitellyt tapaukset vasta tutkimuksen jälkeen.
- `priority` ohjaa turvallisuus- ja lähdevirheet korjausjonoon. `review`
  vaatii sidonnan tai päätösnäytön käsintarkistuksen. Karanteenia tai
  epäselvää alkuperäistä reseptiversiota ei hyväksytä tutkimusohitukseksi.
- `approved` tarkoittaa julkisessa näkymässä olevaa alkuperäistä
  numeerista arviota tai vaihteluväliä, jonka sidonnassa ei ole havaittu
  ristiriitaa. Julkisen arvion sidontaristiriita ohjataan `review`-jonoon
  nykyiseen julkaisulähteiden auditointiin. `hasPublicEstimate` kertoo
  erikseen, näkyykö arvio jo julkisessa näkymässä. Tarkka uudempi
  julkaisusidonta voi osoittaa vanhan lähde-eron historialliseksi, kun myös
  näkyvä ohje ja tulos täsmäävät. Jono näyttää tämän tiedon erikseen.
  Käytä myös nykyisiä hyväksyntärekistereitä, kuten tähän asti.
- `skip` koskee vain saman GI/GK-lähdetutkimuksen toistamista. Se ei estä
  hiilihydraatti-, annos- tai ainesosatiedon parantamista, turvallisuus-
  korjausta eikä reseptin julkaisua nykyisten porttien mukaisesti.

Kirjaa tarkistettu `NO_RELIABLE_GK` omaan haaraan
[tutkimuspäätöksiin](glycemic-research-decisions.json). Rivi sitoo kanonisen
ID:n nykyiseen alkuperäislähteeseen, valmistukseen ja reseptikohtaisiin
laskenta-, lähde- ja kontekstitiivisteisiin. Konteksti kattaa annoksen
kuvauksen ja laskennan lähdeperustelut. Kopioi tiivisteet jonotarkistuksen
`binding`-kentästä. Merkitse päätöspäivä, täsmällinen este sekä Gitissä oleva
katselmointiviite, sen LF-normalisoitu SHA-256 ja kohta, joka yksilöi
tarkistetut lähteet. Hyväksytyt GK- ja F25-aineistot säilyvät omissa
rekistereissään. Vanhat HOLDit eivät siirry automaattisesti tutkimuspäätöksiksi.

Reseptin olennainen muutos tai reseptiin sidotun laskenta- tai
lähdeaineiston muutos avaa tutkimuksen uudelleen. Pelkkä kontekstitiivisteen
muutos ohjaa tarkistamaan lähteen soveltuvuuden tai annoksen rajauksen.
Jos soveltuva uusi
GI- tai koostumuslähde ei vielä ole laskentasyötteessä, tai on muu
nimenomainen uudelleenkatselmointipäätös, lisää vanhalle riville `reopen`.
Käytä tyyppiä `applicable-gi`, `applicable-composition` tai
`documented-review`. Kirjaa perustelu ja uusi, varmennettava Git-viite
tiivisteineen. Kirjaa lopputulos katselmoinnin jälkeen ja poista käsitelty
`reopen` samalla. Kielteinen tulos saa päivitetyn päätösrivin ja vanha
versio jää Git-historiaan. Hyväksyttävä tulos kulkee nykyisten
hyväksyntäporttien kautta. Ajan kuluminen yksin ei avaa tutkimusta.

Ohitukset säilyvät Git-commitissa. Keskeytyksestä jatkettaessa käytä
omistetun haaran viimeistä tarkistettua commitia, luo tarvittaessa
reseptitilaprojektio uudelleen ja tarkista sama jono.
