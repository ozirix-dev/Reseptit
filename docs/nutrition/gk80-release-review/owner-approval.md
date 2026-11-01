# Omistajan hyväksyntä A–C ja seuraava julkaisuportti

Kirjattu: 2026-11-01T05:35+02:00
Tila: OWNER_METHOD_AND_CONTENT_APPROVED — AWAITING_SEPARATE_RELEASE_AUTHORIZATION.
PR: https://github.com/ozirix-dev/Reseptit/pull/149

## Päätöksen alkuperä ja täsmällinen rajaus

Omistajan nimenomainen viesti tässä keskustelussa:

> Hyväksyn päätökset A, B ja C esitetyin rajauksin.

Samassa viestissä omistaja pyysi valmistelemaan PR149:n seuraavaan
julkaisuvaiheeseen ja kielsi vielä mergen ja deployn.
Hyväksynnän kohde on final release gatessa katselmoitu HEAD
`492f09113e91d579529df2c6ea4c5a60d5629a0c`, main-pohja
`e8da2c9417e2aeff55a85d599b3b7e1ad465f36c` ja alla yksilöidyt paketit.
Katselmoidun HEADin CI:
https://github.com/ozirix-dev/Reseptit/actions/runs/41264955057 (SUCCESS).

## Hyväksytyt päätökset

- A: rajattu GI40/30/50-koodaus, tarkat ruokaperhe-/valmistussidokset,
  projektin5gCHO/100g sekä pienten mausteiden0.5g/ainesosa/annos ja1g
  yhteisraja, läpinäkyvä LOW-mallinnus. Nykyinen kelpoisuussääntö käyttää
  näitä rajoja vanhan yhden GK-yksikön kokonaisimputaatioportin sijaan.
  Tämä on hyväksytty myös niiden13 täsmäreseptin osalta, joiden vanha
  imputedWithinPolicy-ehto on epätosi. Yksi GK ei ole biologinen virheraja.
- B: nimetyt riisi-,puuro-,nuudeli-,kaura-,maissi-,pita- ja palkokasvianalogiat
  vain hyväksyttyihin punnittuihin valmistusversioihin. Ei raakajauhon
  automaattista leipä-GI:tä eikä vapaata tuotekohtaista soveltamista.
  Lablabin19.12945-piste ja keskiluokka ovat valitun vastineen tuloksia,
  eivät luokkarajasta riippumaton takuu: kikherne-GI35/38-vastineilla,
  muun laskennan pysyessä ennallaan, saatiin19.74545/20.00945.
  Hariran11.95235 muuttui samassa vertailussa12.77368/13.12568.
  Nämä lähdevalinnan skenaariot eivät ole biologisia epävarmuusvälejä.
- C: alla olevat24 uutta numeerista versiota ja8 korjattua Q09-versiota
  sekä kiinalainen-teehaudutetut-munat-reseptin perusteettoman nollan poisto.
  Tee-munat pysyvät keskeneräisinä. Q09:n korjattu rypsiöljytietue on535.

Hyväksyntä ei laajenna menetelmiä uusiin resepteihin tai tutkimusPR148:aan.
Kaikki luvut ovat mallinnusta, eivät mitattuja yksilöllisiä verensokerivasteita.
Jäädytettyjen pakettien ja aiemman katselmointimatriisin hyväksyntää odottavat
merkinnät ovat katselmointivaiheen tilannekuvia. Niitä ei muuteta takautuvasti:
tämä asiakirja kirjaa uuden, voimassa olevan omistajapäätöksen.

## Hyväksytyt lähdepaketit ja versiot

### gk80-release-1, versio1

- `vietnamilainen-hu-tieu-aamiaiskeitto`
- `vietnamilainen-chao-ga-kanapuuro`
- `indonesialainen-bubur-ayam-kanariisipuuro`
- `pohjoisafrikkalainen-minttutee-kaurapuuro`

Manifestin SHA256: `1b70a339dd5e7fe14d369c4eb01c33ef60f4bddb6654b056e3bf8a790f90e83f`.

### gk80-release-2, versio1

- `meksikolainen-huevos-a-la-mexicana`
- `karibia-callaloo-munakas`
- `yrttituorejuusto-kinkkurullat`
- `kreikkalainen-kanavuoka-oliiveilla`
- `kanapyorykat-tomaattikastike`
- `malesialainen-nasi-lemak-aamiaisella`
- `kiinalainen-musta-seesamipuuro`
- `harira`

Manifestin SHA256: `931340cad09e8489ab22ccb5754bb72f635a47519ee6ad3c1ec0233bfcaa9150`.

### gk80-release-3, versio1

- `shoyu-kanakeitto-konjac`
- `indonesialainen-nasi-uduk-aamiaisella`
- `thai-khao-tom-katkaravuilla`
- `karibia-kookosriisi-pavuilla`
- `pohjoisafrikkalainen-lablabi`
- `meksikolainen-atole-maissipuuro`
- `karibia-maissipuuro-kookoksella`
- `meksikolainen-kurpitsapuuro-piloncillolla`
- `lahi-ita-taatelipuuro-tahinilla`
- `valimerellinen-tahinipuuro`
- `thai-papaijajogurtti`
- `lahi-ita-kikherne-shakshuka`

Manifestin SHA256: `3f5901789db8bdc01199849c40af97f5a2806b9b8d2716d5745cb6744f4d876f`.

### gk80-release-4, versio2

- `munakokkeli`
- `munakasmuffinit`
- `uunimuna-avokadot`
- `uunimunat-pinaatilla`
- `vhh-lihamureke`
- `uuniporsas-kermakastikkeessa-vhh`
- `tonnikalamunakkaat-uunissa`
- `thai-kai-jiao-yrteilla`

Manifestin SHA256: `3ebc379db76d485cc11942d5546d62e1b5f7d28fd5cc86f4f796436326d84154`.

## Valmisteltu seuraava portti

- Hyväksytty ehdokastulos106/326,220 keskeneräistä;24 uutta,8 korjattua,
  1 poistettu numero ja293 muuta tulosobjektia ennallaan.
- Tämä hyväksynnän kirjaus muuttaa vain kahta päätösdokumenttia.
  Laskenta,reseptit,lähteet,pakettiversiot ja niiden hashit säilyvät ennallaan.
  Uusi dokumentointicommit ei itsessään muuta hyväksyttyä laskentasisältöä.
- PR149 säilyy ensisijaisena julkaisupolkuna ja Draftina. PR146/147 ovat
  historiallisia lähteitä, joita ei yhdistetä peräkkäin; PR148 on tutkimusta.
- Ennen erikseen luvitettua seuraavaa toimenpidettä tarkistetaan ajantasainen
  main ja PR-HEAD, valmistunut CI sekä mahdolliset uudet katselmointilöydökset.
  Sisältömuutos vaatii hyväksynnän rajauksen uudelleenarvioinnin.
- Ready-siirtymää ei ole tässä valtuutettu. Mergeä ja deployta ei ole
  valtuutettu. Omistajan erillinen lupa on edelleen julkaisun portti.
- ReportHub88:n pinottua haaraa ei yhdistetä sellaisenaan. Julkaisun jälkeen
  tarvittaessa pieni suoraan ReportHub-mainiin perustuva raportti todellisella
  julkaisu-SHA:lla, CI-/deploynäytöllä ja tuotannosta varmennetulla kattavuudella.
- Palautuspolku on katselmoinnin README:ssä; Q09:n korjauksia ei palauteta
  vahingossa vanhoiksi nolliksi. Ei AJO7:ää tai hostingmuutoksia.
