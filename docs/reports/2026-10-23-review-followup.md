# Reseptit – katselmoinnin ja sisällön jatkotarkistus

Päiväys: 23.10.2026, Europe/Helsinki. Tarkistettu main:
`d42767ca1b3192d982dcab20c0bab85b1362c95b`.
Korjaushaara: `codex/reseptit-followup-audit`.

## Katselmointien tila

GitHubista tarkistettiin kaikki 44 PR:ää ja 68 havaintokeskustelua.
Kaksi keskustelua on edelleen avoinna; uusia havaintoja ei ollut.

- [PR #2: sivukartan löytyminen](https://github.com/ozirix-dev/Reseptit/pull/2#discussion_r4327338958).
  Originin `https://ozirix-dev.github.io/robots.txt` palautti HTTP 404.
  Projektin oma robots.txt ei ratkaise originin löytämisongelmaa.
  GSC:n lähetysluettelo oli edellisessä, 23.10. tehdyssä lukutarkistuksessa
  tyhjä; GSC-tiliä ei tarkistettu uudelleen tässä työssä.
  Sulkeminen edellyttää todennettua sitemap-lähetystä tai originin korjausta.
- [PR #17: Italian padan kokonaisaika](https://github.com/ozirix-dev/Reseptit/pull/17#discussion_r4329705260).
  Lähde kertoo 20 minuutin paiston ja vähintään 15 minuutin vetäytymisen,
  mutta ei valmistelun kestoa. Kokonaisaikaa ei keksitty eikä havaintoa suljettu.

Avoimia issueita ei ollut. Kuusi Dependabot-PR:ää (#6–#11) ovat edelleen
avoimia. #10:n viimeinen CI on epäonnistunut vanhalla haaralla; mainin
TypeScript-yhteensopivuuskorjaus ei itsessään päivitä sen CI-tulosta.
Riippuvuuspäivityksiä ei yhdistetty tässä tarkistuksessa.

## Korjattu sisältö ja käännösten oma tarkistus

Butter chickenin ohje käytti ruskistamiseen öljyä, jota ei ollut aineslistassa.
Öljy lisättiin neljään aineslistaan määrättömänä (`amount: null`), huomiona
lähteen mukainen tilkka ruskistamiseen. Tarkkaa määrää ei johdettu arvauksesta.
Hunajan valinnaisuus näkyy nyt myös valmistusvaiheessa kaikilla kielillä.

Muuttuneet reseptit:

- `reseptit/paaruoat/butter-chicken.md`
- `kaannokset/en/paaruoat/butter-chicken.md`
- `kaannokset/sv/paaruoat/butter-chicken.md`
- `kaannokset/th/paaruoat/butter-chicken.md`

Kaikki kolme käännöstä verrattiin tämän reseptin suomenkieliseen lähteeseen.
Ruotsin sivuun nostaminen, soseuttaminen, loppusuola ja tarjoilu muutettiin
luonteviksi ohjeiksi. Paprika täsmennettiin paprikajauheeksi.
Thain erissä ruskistaminen ja sivuun nostaminen korjattiin; epämääräinen
"hetki" korvattiin lähteen minuutilla. Englannin loppusuola ja tarjoilu
selkeytettiin. Annokset, numeeriset määrät, ajat, kuvat ja URL:t säilyivät.

Tämä on kielimallin oma lähdevertailu, **AUTOMATED SEMANTIC REVIEW**.
Riippumaton ihmistarkistus on edelleen **HUMAN REVIEW PENDING**.
Koko kirjaston tarkistus tässä työssä oli rakenteellinen ja tekninen;
119 reseptin kaikkia käännöksiä ei arvioitu uudelleen sanasta sanaan.

Ravintoauditoinnin öljyä koskeva avoin kohta päivitettiin: öljy on nyt
aineslistassa, mutta määrä ja paistossa jäävä osuus ovat yhä tuntemattomia.
Nykyinen CSV-inventaario generoitiin uudelleen. Siihen päivittyi tämän
reseptin lisäksi 25 aiemmin korjatun kieliversion vanhentunutta riviä.
Historiallisia raportteja ei kirjoitettu uudelleen.

## Tarkistustulokset

- Ydintestit 36/36, käännöstestit 25/25, kuvatestit 7/7,
  staattiset testit 17/17 ja selaintestit 4/4: yhteensä 89/89, ei ohituksia.
- Uusi butter chicken -regressio epäonnistui ensin puuttuvaan öljyriviin
  ja läpäisi lähteen sekä kaikkien kolmen käännöksen korjauksen jälkeen.
- Tuotantobuild esirenderöi 480 reittiä. Paikallinen SEO-auditointi tarkisti
  480 reittiä ja 358 kuvatiedostoa, löydöksiä 0.
- Mainia vastaavan inventaarion julkinen GET-auditointi tarkisti 480 sivua,
  sitemapin, projektin robots.txt:n, vahvistustiedoston ja puuttuvan reitin:
  löydöksiä 0. Tämä tehtiin ennen sisältökorjausta; uusi haarasisältö ei ole
  tuotannossa eikä tätä ajoa väitetä sen julkaisutodisteeksi.
- Asennetulla Bravella suoritetut selaintestit kattavat neljä kieltä,
  320–1440 pikselin leveydet, näppäimistöä, JavaScriptittömän HTML:n,
  reittidatan virhetilat sekä responsiiviset kuvat.
- `npm audit`: 0 haavoittuvuutta, myös kehitysriippuvuudet mukana.
- Markdown-lint ja `git diff --check` läpäisivät.

## Jäljellä olevat laaturajat

- 357 käännösparia läpäisi rakennetarkistuksen. Ihmistarkistuksia on kirjattu 0.
- 119 lähdereseptistä 24 sisältää ravintoarvoja ilman täydellistä laskentaketjua;
  95:ltä arvot puuttuvat. Auditointi ei vahvista kokonaisia annosarvoja.
- Tekniset testit eivät todista kaikkien kuvien vastaavuutta tai reseptien
  käytännön toimivuutta. Tässä kierroksessa kuvia ei muutettu.
- Julkaisua tai uutta PR:ää ei tehty. Haaran push ei käynnistä sivuston CI:tä:
  nykyinen workflow käynnistyy PR:stä tai main-muutoksesta. Manuaalista
  workflow-ajoa ei käytetä pelkkään tarkistukseen, koska se myös julkaisee.

## CPR:n raportointiratkaisu

Korjaukset, regressiotesti ja tämä käännöskäytännön vaatima raportti kuuluvat
Reseptit-repoon. ReportHubin README:n raportointikynnyksen mukaan tavallisesta
rajatusta korjauskierroksesta ei tehdä päällekkäistä ReportHub-artefaktia.
Kaksi avoimeksi jäävää katselmointihavaintoa säilyvät GitHubissa.
