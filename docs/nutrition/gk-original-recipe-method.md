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

## Pysyvä tutkimus-HOLD ja uusintakatselmoinnin portti

Issue [#717](https://github.com/ozirix-dev/Reseptit/issues/717) erottaa
**tutkimustyön toistamisen välttämisen** GK:n julkaisu- ja
turvallisuushyväksynnästä. Katselmoitu `NO_RELIABLE_GK`-päätös voidaan
tallentaa Gitissä säilyvään [tutkimus-HOLD-rekisteriin](gk-review-stops.json).
Rekisterin tietue sisältää alkuperäisen julkisen reseptin tunnisteen ja
tekstin SHA-256:n, nimettyjen tutkimustiedostojen SHA-256:t, tarkistetut
lähdeviitteet, puutteen tarkan syyn, katselmointiviitteen, päivämäärän
ja katselmoijan. Päätösten oma SHA-256 havaitsee jälkikäteisen muokkauksen.

Ennen uutta saman alkuperäisreseptin GI-lähdetutkimusta suorita
versionmukainen lukuportti (yksi tai useampi tunniste):

```bash
node site/scripts/gk-review-stop-gate.mjs check --id idli-sambar
```

- `SKIP_REPEAT_GI_RESEARCH`: **vain** sama reseptiteksti ja täsmälleen samat
  katselmoidut lähdetiedostot; aiempi HOLD kelpaa tutkimustyön
  deduplikointiin, ei numeeriseksi GK-arvioksi.
- `REVIEW_REQUIRED`: ei päätöstä, muutos reseptissä tai lähdenäytössä,
  puuttuva sidonta tai nimenomainen uusi lähde. Jatka katselmointia.
- Jos ulkoinen uusi GI-tutkimus tai turvallisuushavainto ei vielä näy
  Gitissä tallennetussa evidenssissä, pakota uudelleenkatselmointi:
  `check --id idli-sambar --new-evidence "Uusi DOI tai turvallisuushavainto"`.
  P0/P1-turvallisuustarkastelua **ei** saa ohittaa tutkimus-HOLDilla.

Uusi päätös kirjataan vasta kun valmistustavan, annoksen ja tarkistettujen
lähteiden soveltuvuus on todella arvioitu. Esimerkki komennosta:
```bash
node site/scripts/gk-review-stop-gate.mjs record \
  --id idli-sambar --recipe-path reseptit/paaruoat/idli-sambar.md \
  --evidence docs/nutrition/gk100-idli-sambar-component-review.md \
  --source https://doi.org/10.1093/ajcn/nqab233 \
  --reason "Kotireseptin fermentointia vastaava GI-mittaus ei ole osoitettu" \
  --review-ref https://github.com/ozirix-dev/Reseptit/issues/717 \
  --reviewer "Nimetty katselmoija" --reviewed-at 2026-11-18
```

Tämä on **käyttöesimerkki**, ei väite siitä, että kyseinen GI-lähde soveltuu
idli-sambariin, eikä komennon esittäminen tarkoita sen suorittamista.
Käytä todellisuudessa tarkistettuja lähteitä ja katselmointiviitettä.
Uuden lähdeaineiston ilmaantumista verkkosivuille ei voi havaita
automaattisesti pelkistä Gitissä olevista tiedostoista; uuden tutkimusnäytön
havaitsevan katselmoijan on käytettävä `--new-evidence`-ohitusta tai
päivitettävä evidenssitiedosto ja tehtävä uusi päätös.

**Historiallisia GK100-, F25- tai muiden HOLD-rekisterien päätöksiä ei
migroida tähän rekisteriin automaattisesti.** Alussa tyhjä rekisteri
välttää perusteettomat tutkimusohitukset. Kun vanha päätös sidotaan
nykyiseen alkuperäiseen reseptiin ja nykyiseen näyttöön, rekisteriin
tehtävä muutos vaatii oman katselmointinsa. Gitin tutkimus-HOLD ei muuta
reseptin hyväksyttyjä HH-/GK-lukuja, erillisversioiden kattavuutta,
karanteenia, F25-sääntöjä tai mitään tuotantojulkaisua. Se on
työnkulun lukuportti, ei julkisen GK-laskennan syöte.
