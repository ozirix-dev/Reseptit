# GK80-ajonohjain – vaiheistus, päätösportit ja hyväksymiskriteerit

Päivitetty 3.11.2026. Tämä on ehdotus vaiheistettuun käyttöönottoon,
ei hyväksyntä ajaa automaattisesti mallia, käyttää lisäkrediittejä,
julkaista 30 GK-laskelmaa tai muuttaa tuotantoa.

## Miksi ajonohjain?

30-reseptin GK80-työ päättyi toistuvasti yksittäisiin välituloksiin 7/30,
8/30 ja 9/30. Yksi salsan GI:n avoin kysymys tai maitotuotteen
reseptuurin epävarmuus ei ollut koko erän este. Pelkkä tarkempi
"jatka, kunnes valmis" -prompti ei luo pysyvää ulkoista tilaa.

V1:n ohjain pystyy käynnistämään saman 30-ID-tavoitteen uusia
rajattuja Codex-vuoroja työjonon perusteella. Se ei lupaa
todellista 30 tieteellisesti hyväksyttävän version määrää.
Työ keskeytetään myös, kun sopivia reseptejä ei enää löydy
tai käyttö-/vuorobudjetti täyttyy.

## Kokonaisratkaisun osat

### 0. Repon ja omistajuuden turvallisuus (V1)

- Oma research-worktree ja yksilöllinen codex/gk80-batch30-* -haara.
- Git remote origin on täsmälleen ozirix-dev/Reseptit.
- Työpuuhun kirjoittaa yksi nimetty Codex-ajonohjain.
- Ajonohjain ei koskaan ota toisen avoimen PR-haaran omistajuutta.
- Istuntolukko ja STOP-lippu paikallisina, Gitin ulkopuolella.
- Manuaalinen käynnistys: init/status/step/run, execute erikseen.

**Hyväksyntä:** väärä repo, väärä haara tai toinen aktiivinen
kirjoittaja pysäyttää ennen Codex-käynnistystä.

### 1. Pysyvä jono ja checkpointit (V1)

- schemaVersion 1, target=30, uniikit recipe-ID:t.
- Tila NEW/RESEARCH/CALCULATED/VERIFIED/HOLD/EXCLUDED.
- VERIFIED vaatii lähdeviitteen, tarkat positiiviset määrät,
  GI-/massarajaukset, nimenomaiset tarkistusmerkinnät ja hashit.
- CHECKPOINT tiedostoon ennen vuoron loppumista.
- Korkeintaan 326 uniikkia reseptitunnistetta.
- Virheellisen jonon kohdalla pysähdys ja palautus edelliseen
  kelvolliseen snapshotiin, ei pääteltyä "menestystä".

**Hyväksyntä:** toistettu käynnistys ei hukkaa aiempia
CALCULATED/HOLD/VERIFIED-tietueita.

### 2. Rajattu Codex-vuorojen ajo (V1)

- Default on dry-run. Execute vaatii eksplisiittisen valinnan.
- Yksi vuoro tai enintään rajattu määrä vuoroja etualalla.
- Eräkohtainen päättymisehto on jonon tavoiteluku,
  ei mallin yksi loppuviesti.
- Yksi HOLD johtaa seuraavaan ehdokkaaseen.
- Per-vuoron timeout, kokonaisvuorobudjetti ja
  toistuvan etenemättömyyden esto.
- Ei mallinvaihtoa, ei vaarallisia sandbox-ohituksia.
- Ei turhaa laajaa reseptitestien uusintaa.

**Hyväksyntä:** 7/30 -> 8/30 tai yhden HOLDin jälkeen ohjain
kykenee käynnistämään seuraavan vuoron, jos budget, stop ja
turvaportit sallivat.

### 3. Todistusketju (V1 rakenteellinen, myöhemmin vahvempi)

- Molempien syöte- ja evidenssitiedostojen SHA-256 lasketaan ja tarkistetaan itse.
- Lähde-/syötepolut rajataan fyysiseen tutkimushakemistoon, myös symlinkkien osalta.
- Gitin muuttuneet tiedostot tarkistetaan ennen varsinaista ajoa ja sen jälkeen:
  muu kuin tutkimushakemiston muutos pysäyttää jatkon (`STOPPED_GUARD`).
- Tuotannon julkaistuja reseptejä ei muuteta tällä ajolla.
- Luovutuksessa listataan 30 ID:tä ja niiden evidenssitiivisteet.
- Tieteellinen lähdevarmennus kuuluu yhä erilliseen katselmointiin.

**Hyväksyntä:** väärä SHA, duplikaatti-ID, puuttuva lähde,
puuttuva valmistusevidenssi tai vaarallinen polku ei kasvata
VERIFIED-määrää.

### 4. Ensimmäinen pilotti (vaatii käyttäjän aktivoinnin)

1. Aseta --max-turns 2 ja ajasta yksi paikallinen rajattu
   kuiva/esimerkkivuoro; erillistä Windows-ajastusta ei tarvita.
2. Tarkista todellinen Codex CLI:n --json-, -C- ja --sandbox-tuki.
3. Tee yksi varsinainen vuoro, kirjaa kustannusten suhde
   VERIFIED- ja HOLD-tapauksiin.
4. Tee korkeintaan toinen vuoro, jos ensimmäinen jätti
   arvokasta jatkotyötä ja todellinen budjetti sallii.
5. Auditioi käsin työjonon ja dokumentoi blokkerien laatu.

**GO:** jatko toimii ilman välikysymystä, eikä yksittäinen HOLD
päätä koko tutkimuserää. **NO-GO:** arvoja keksitään,
malli kirjoittaa toisen työpuuhun, käyttöbudjetti ylittyy,
jonon validointi ohitetaan tai stop ei pysäytä jatkoa.

### 5. Pitkä testi (ei tämän PR:n automaattinen tehtävä)

Kun 2 vuoron pilotti on hyväksytty, käyttäjä voi kasvattaa
kokonaisvuorobudjettia alusta asti esimerkiksi 12:een ja
ajaa käsin 4–6 vuoron jaksoja.

Tavoite: vähentää toistuvien aloitusten, pitkäksi venyvien
yksittäisten HOLDien ja käsin kopioidun tutkimusraportin
aiheuttamaa työtä. 30 VERIFIED ei ole luvattu suorite.

### 6. Tieteellinen PR-luovutus (V1 vain handoff)

Ajonohjain luo paikallisen HANDOFF.md:n 30 VERIFY-tapauksesta
vain kun rakenteellinen portti on läpäisty. Sen jälkeen:

- riippumaton lähde- ja sisältöarvio;
- ajantasaisen mainin ja avointen PR:ien deduplikointi;
- tarvittaessa aiemmin julkaistujen ID:iden korvaus;
- yksi nimetty kirjoittaja avaa yhden rajatun Draft-PR:n;
- käyttäjän erillinen Ready/merge/deploy-lupa.

Ohjain ei automaattisesti pushaa, luo PR:ää tai julkaise mitään.

### 7. Mahdolliset myöhemmät parannukset – EI V1

- Read-only GitHubin resepti-ID-synkronointi ja julkaistujen
  versioiden törmäysportti (lähdekatselmoinnin jälkeen).
- Aikakatkaisusta selviytyvän nykyisen yhden vuoron palautuksen laajentaminen versioiduksi journaliksi ja usean prosessin kaatumistilanteisiin.
- Ulkoinen käyttökrediitti-/tokenbudjetti, jos luotettava
  paikallinen kulutustieto on saatavilla.
- Päätös- ja lähdeaineiston riippumaton verifier-palvelu.
- ReportHubin valinnainen raportointisilta; ei tuotantokytkentää.
- Windows Task Scheduler tai Windows-palvelu vain käyttäjän
  erillisellä päätöksellä ja näkyvällä STOP-hallinnalla.
- Erillinen turvallisesti valtuutettu gh Draft-PR-vaihe.
- Toisen mallin tai lisäkrediittien käyttöönotto EI ole
  oletusarvoinen ratkaisu.

## V1:n pakolliset testit

| Tarkistus | Odotettu |
| --- | --- |
| Repo on Ravinto tai checkout main | HALT |
| Worktree puuttuu tai branch vaihtuu | HALT |
| Kaksi samaa recipe-ID:tä | HALT |
| Väärä syöte-/evidenssi-SHA tai puuttuva tarkistusmerkintä | HALT |
| Ohjattu työvuoro muuttaa reseptitiedostoa tai vaihtaa branchia | STOPPED_GUARD |
| Keskeytetty vuoro jättää rikkinäisen queue.json:n | Palautus ja STOPPED_INVALID_QUEUE |
| HOLD ilman estettä | HALT |
| DRY RUN ilman executea | Ei Codex-prosessia |
| STOP tai active.lock | Ei uutta vuoroa |
| max-turns tai max-seconds loppu | Ei salattua uusinta-ajoa |
| 30 VERIFIED täynnä | READY_FOR_DRAFT, ei automaattista PR:ää |
| Jo julkaistu ID myöhemmin mainissa | Erillinen deduplikointi ennen julkaisua |
| Käännösten ja makrojen julkaisu | Ei saa muuttua |
| GitHub Actions | Ei manuaalista ajoa |

Tämän PR:n suppea testipaketti ajetaan komennolla:

~~~text
python -m unittest discover -s tools/tests -p test_gk80_controller.py
~~~

## Erilliset toimivaltapäätökset

| Päätös | Tämän PR:n valtuus |
| --- | --- |
| V1-koodin tarkastelu ja yhdistäminen | Erillinen käyttäjän päätös |
| Paikallisen ensimmäisen Codex-vuoron execute | Erillinen käyttäjän aktivointi |
| 30 tutkimusversion hyväksyntä | Erillinen lähdekatselmointi |
| 30 version Draft-PR | Nimetty kirjoittaja, oma valtuus |
| Ready / merge / sivuston julkaisu | Ei anneta tässä |
| ReportHub / Cloudflare / muut repot | Ei anneta tässä |

Tämä pitää GK-laskelmien laadun ennallaan samalla, kun
tutkimuksen jatkuvuus ja raportointikuri paranevat.
