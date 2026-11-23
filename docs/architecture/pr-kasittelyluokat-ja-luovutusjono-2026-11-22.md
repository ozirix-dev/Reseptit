# PR-käsittelyluokat ja kevyt luovutusjono – RFC (Chat-6, 22.11.2026)

**Tila:** suunnitelma / ei käyttöönottoa. **Työn omistaja:** Chat 6. **Integraatio-omistaja:** Chat 1.

## Ongelma ja tavoite

Reseptit-repossa useat chatit voivat tuottaa uusia PR:iä nopeammin kuin Chat-1 pystyy katselmoimaan ja yhdistämään. Tekninen PASS, kirjallinen luovutus, GitHubin `Ready` ja oikea yhdistämislupa ovat eri asioita. Jos jokainen muutos käsitellään kuin ravintolaskennan julkaisu, myös harmittomat dokumenttityöt joutuvat samaan ruuhkaan.

**Tavoite:** pienennä Chat-1:n käsityötä **ilman uusia ohitusreittejä**. Luokittele riski ja valmistele katselmoitava luovutus yhdellä lyhyellä kuittauksella. Pidä kaikki vaaditut GitHub-/Repo Guard -suojat käytössä.

Tämä on täydentävä **ennen-Ready-vaiheen** malli. Chat-1:n [PR #856](https://github.com/ozirix-dev/Reseptit/pull/856) suunnittelee erikseen *paikallisesti ennakkovaltuutettua automaattista yhdistämistä*. Sen Windows-suostumus-, SHA-, review- ja CI-sääntöjä ei korvata eikä tätä RFC:tä pidä tulkita `authorized_queue`-toiminnon käyttöönotoksi.

## 1. Kolme käsittelyluokkaa

| Luokka | Esimerkki | Tavallinen valmistelu | Kuka saa Readyksi / mergeen? |
| --- | --- | --- | --- |
| **A – rajattu dokumentti** | Uusi itsenäinen ei-normatiivinen raportti, kirjoitusasun korjaus, vanhaan aineistoon osoittava linkki | Automaattinen CI, diff ja linkit; lyhyt katselmointi | Chat-1, nykyisillä GitHub- ja Repo Guard -ehdoilla |
| **B – normaali tuote- tai sisältömuutos** | Käyttöliittymän muutos, tavallinen hyväksyttävä reseptitekstin korjaus, ei-kriittinen käännös | Muutoksen vaatimien sisältö-/käännös-/selain- ja regressiotestien näyttö | Chat-1 vasta asianmukaisten katselmointien jälkeen |
| **C – kriittinen tai epäselvä** | Ruokaturvallisuus, GI/GK ja ravintoarvot, julkaisuluvat, karanteeni, F25, hyväksyntäsinetit, GitHub Actions / Repo Guard, tunnukset tai haara-/turvasäännöt | Erillinen lähde- ja turvakatselmointi, kaikki asianmukaiset portit | Chat-1, nimenomaisesti hyväksytyn sisällön ja tuoreiden porttien jälkeen |

**Tämä taulukko on ensin käsin käytettävä ehdotus, ei uusi automaattinen hyväksyntä.**

### Luokittelun tärkeät reunat

- Arvioi **todellinen diff ja vaikutus**, älä pelkkää tiedostopäätettä tai PR:n omaa väitettä. Jos tiedoston sisältö on laskennan, hyväksynnän tai julkaisun syöte, se ei ole A, vaikka tiedosto päättyisi `.md`.
- Dokumentaatio, joka muuttaa turvallisuus-, omistajuus-, työnkulku- tai hyväksymiskäytäntöä, kuuluu **C-katselmointiin**, vaikka PR muuttaisi vain yhtä Markdown-tiedostoa. Tämä RFC ei yksin muuta voimassa olevia sääntöjä.
- `.github/**`, salaisuuksia, julkaisuputkea, Repo Guardia, laskentaa, historiallisia sinettejä tai `docs/research/**`-syötteitä koskevat muutokset eivät ole automaattisesti kevyitä.
- Käännöksen tai reseptitekstin pieni merkkimuutos voi olla B, mutta ruokaturvallisuuden, ainesmäärän, ravinnon, allergeenin tai GK:n merkitysmuutos nostaa C:hen.
- Useita riskiluokkia sisältävässä PR:ssä **korkein riski määrää**. Tuntematon muutos -> C / käsin tarkistettava. PR:n pilkkominen ei saa kiertää yhteen kuuluvan muutoksen turvallisuutta.
- `Draft`, `HOLD`, puuttuva katselmointi ja `CI FAIL/PENDING` **eivät kuulu** yhdistämisjonoon luokasta riippumatta.
- GitHubin pakolliset tarkistukset, branch protection ja Repo Guardin suojaus ovat aina voimassa. A-luokka **ei** anna lupaa ohittaa yhtäkään pakollista CI- tai review-ehtoa.

## 2. Luovutuspolku ilman uutta järjestelmää

`Työn alla (Draft)` -> `Luovutusvalmis (Draft, omistajan kuittaus)` -> `Chat-1:n katselmointi` -> `Ready (vain Chat-1)` -> `Repo Guard -preflight / merge (vain Chat-1)` -> `main-CI/julkaisutarkistus`.

**Luovutusvalmis** on työjonon *neuvoa antava tieto*, ei GitHubin `Ready` eikä hyväksyntä. Ei uutta tietokantaa, MCP-palvelinta, pakollista GitHub-labelia tai automaattista PR-kommenttibottia ensimmäisessä vaiheessa.

Chat-2…n merkitsee oman PR:n kuvaukseen tai luovutuskommenttiin vain:

1. **Omistaja + muutosrajat:** `Chat N`, PR, kirjoitettu tiedostojoukko, vaikutus (ja mahdolliset rinnakkaiset PR:t).
2. **Luokkaehdotus:** A/B/C ja yksi perustelulause; riskiluokan vahvistaa Chat-1.
3. **Täsmäversio:** PR HEAD-SHA, käytetty base/main-SHA, vaaditut CI-run-linkit **juuri kyseiselle sisällölle**, avoimet review-threadit.
4. **Päätösesteet:** `EI` tai tarkka HOLD-/katselmointiehto. Ei väitettä `valmis`, jos sisältöhyväksyntä puuttuu.

Chat-1 lukee yhden koonnin ja tarkistaa GitHubista ajantasaisen PR:n, ei selaa pitkää keskusteluketjua. Mitään `Ready`- tai merge-toimintoa ei tee raportin kirjoittava chatti.

## 3. Keskeneräisen työn rajaaminen

**Uusi normaali toimintatapa:** yksi kerrallaan integraatioon luovutettava PR per kirjoittava Chat N. Kun edellinen PR on `Draft/HOLD` tai odottaa integraatiota, toinen iso toteutus avataan vasta Chat-1:n erikseen rajaamalla poikkeuksella. Riippumattomia tutkimuksia, analyysiä ja taustavalmistelua voi jatkaa avaamatta lisää PR:iä.

- Sääntö on **neuvoa antava aloituskäytäntö**, ei takautuva tekninen estin vanhoille Draft-PR:ille.
- Jo avattuja PR:iä ei suljeta tai yhdistetä määräsäännön perusteella. Oikeat F25-, GK-, turvallisuus- ja julkaisupidot säilyvät.
- Useita valmiita, riippumattomia reseptejä voi yhdistää yhteen hallittuun erä-PR:ään, jos jokaisella reseptillä on oma hyväksyntä ja samat testivaatimukset. Vahvasti eri riskiset muutokset pidetään erillään.
- Chat-1 voi poiketa rajasta, kun työnjako ja muiden PR:ien muutospolut eivät ole ristiriidassa.

Tavoite on vähentää luovutettujen, mutta keskeneräisten PR:ien kasvua. Se ei ole rangaistus aktiivisesta tutkimustyöstä.

## 4. Nopean integraatiokierroksen toimintatapa

1. **Lue nykyinen GitHub:** kaikki avoimet PR:t, HEAD, Draft/Ready, changed files, review-tieto ja check-run-tilat. Käytä nykyisiä Repo Guardin **vain luku** -työkaluja. Älä luota aiempaan raporttiin nykytilana.
2. **Nosta ensin läpimenevät A-ehdokkaat**, sitten B, ja käsittele C erillisenä estejonona. Luokka ei ylitä todellisia riippuvuuksia eikä anna riskittömillekaan pääsyä ennen hyväksyntää.
3. **Älä pidä vanhaa SHA:ta vihreänä.** Jos PR HEAD, base-main tai GitHubin testattu yhdistelmä muuttuu, vaaditaan uusi asianmukainen preflight ja tarvittaessa CI. Älä yritä korjata `main`-driftiä päivittämällä muiden chattien haaroja.
4. **Älä käynnistä kaikille turhaa uutta koko testipakettia.** Nykyinen valikoiva CI hoitaa muutoskohtaiset tarkistukset, mutta jos GitHubin pakollinen portti vaatii uuden testatun yhdistelmän, sitä ei ohiteta nopeussyistä.
5. **Valmista PR tai kirjaa todellinen HOLD-syy** ja seuraava omistaja. Samaa PR:ää ei palauteta katselmointijonoon pelkän huomiotta jääneen luovutusmerkinnän vuoksi.
6. **Chat-1 yksin** tekee Ready-/merge-päätökset ja tarkistaa yhdistämisen jälkeisen mainin. Automaattinen yhdistäminen voidaan myöhemmin arvioida vain PR #856:n erillisellä valtuutusmallilla.

## 5. Käyttöönotto ilman turhaa tekniikkaa

**Vaihe 0 – lähtömittaus (vain luku):** kirjaa yhden integraatiokierroksen ajalta avoimet Ready-/Draft-/HOLD-PR:t, valmis mutta Draftiin unohtunut määrä, CI:n uusintojen syyt ja Chat-1:n käsittelyyn kuluva työmäärä. Määrät ovat hetkellisiä, ei kiinteää historialistaa.

**Vaihe 1 – käsin tehtävä 10 PR:n pilotti:** Chat-1 kokeilee A/B/C-luokitusta ja nelikenttäistä luovutuskuittausta. Ei uusia GitHub-asetuksia, webhookkeja tai ohjelmallisia siirtoja. Korjaa väärät luokittelut ja dokumentoi todelliset esteet.

**Vaihe 2 – vain jos hyöty on mitattu:** lisää haluttaessa nykyisen Repo Guardin tai GitHubin **read-only**-yhteenvedolle A/B/C-*ehdotus* ja luovutusjononäkymä. Testaa nimenomaisesti, etteivät tiedostopolut tai PR:n oma teksti anna hyväksyntää. Ei automaattista `pr_ready`-, `pr_merge`-, deploy- tai label-kirjoitusta.

**Vaihe 3 – vasta riippuvan PR #856:n omien turvaehtojen valmistuttua:** arvioi erikseen, voiko korkeintaan muutaman ennalta hyväksytyn A-luokan PR:n käsitellä paikallisella rajatulla erävaltuutuksella. Käyttöönotto vaatii oman testin, käyttäjän paikallisen hyväksynnän ja voimassa olevat Repo Guard -portit.

## 6. Hyväksymiskriteerit ja estot

Pilotti on hyödyllinen vain, jos:

- Yksikään HOLD, Draft, väärän SHA:n CI, avoin pakollinen review tai epäselvä muutos **ei** ohita yhdistämisportteja (0 poikkeusta).
- A/B/C-luokitus ja luovutuskuittaus vähentävät Chat-1:n tarvittavia manuaalisia tarkistuskierroksia verrattuna vaiheeseen 0.
- Riskiluokasta voidaan päätellä tarvittava **sisältökatselmointi**, mutta **ei** ohittaa GitHubin pakollista CI:tä.
- Valmistunut tekninen PR ei jää Draftiin vain siksi, että Chat-1 ei nähnyt luovutusviestiä.
- Pilotti ei kasvata avoimien toteutus-PR:ien määrää eikä edellytä uutta ylläpidettävää palvelua.

Pakolliset negatiiviset esimerkit tulevaa automaattista luokittelua varten: `docs/research/` on laskennan sinetöity syöte; `AGENTS.md` muuttaa sääntöä; `.github/workflows/` muuttaa porttia; reseptin allergia-/kypsennysohje muuttuu; GK-lähde vaihtuu; yhden PR:n alhaisen riskin osio sisältää myös korkean riskin muutoksen. Näiden on estettävä **A-luokkaan** pääsy.

**Päätösraja:** tämä PR tallentaa **vain suunnitelman**. Se ei aktivoi mitään automaatiota, muuta Repo Guardia, estä muiden PR:ien avaamista, muuta Githubin sääntöjä tai myönnä julkaisulupaa. Chat-1 vastaa integraatiosta ja mahdollisesta jatkototeutuksen omistajuudesta.
