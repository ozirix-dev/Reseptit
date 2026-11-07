# Reseptit / Recipavo: ulkoasu- ja käytettävyyslinja

**Tila:** projektikohtainen ylläpito-ohje, 6.11.2026. Koskee nykyistä Reseptit-sivustoa ja sen Ruokaopasta; ei päätä tulevan Recipavon koko ilmettä etukäteen.

## Lähtökohta ja lähteiden järjestys

Nykyinen sivusto on jo varsin toimiva. **Säilytä hyvä, muuta havaittu ongelma.** Älä tee laajaa redesignia tai lisää uutta järjestelmää vain yhden sivun asetteluongelman vuoksi.

- **Reseptit-repo on toteutuksen ja projektikohtaisten päätösten lähde:** erityisesti `site/src/styles.css`, React-komponentit ja tämä ohje.
- [Ossi Web-Design Foundationin quickstart](https://github.com/ozirix-dev/Ossi/blob/main/docs/web-design-foundation-quickstart.md) on yleinen suunnittelun taustalähde, **ei** Reseptit-sivuston tyylitiedosto tai suoraan kopioitava design system.
- Ossi on yksityinen repo: linkit ovat ylläpitäjille, joilla on siihen pääsy. Älä kopioi kokonaisia tutkimusmuistioita tai Ossi-assetteja julkiseen Reseptit-repoon.
- Tarkista tarvittaessa tehtävään liittyvät 1–3 muistiota (fontit, taitto, sisältörakenne, saavutettavuus tai muut). Kirjaa uusi projektikohtainen päätös tähän, jos siitä tulee toistuva sääntö.

## Säilytettävät ratkaisut

1. **Oma identiteetti:** nykyinen tumma vihreä, luonnonvaalea tausta ja rauhallinen kontrasti pysyvät. Käytä olemassa olevia CSS-rooleja, esimerkiksi `--accent`, `--surface`, `--ink-soft`, `--line` ja `--focus`; älä lisää kilpailevia värisävyjä tai kokonaisia palettikirjastoja ilman havaittua tarvetta.
2. **Typografian työnjako:** Georgia tai saman luokan serif otsikoihin, nykyinen system-ui käyttöliittymään, metatietoihin ja pitkiin tekstikappaleisiin. Älä lisää verkkofonttia vain ulkonäön vuoksi. Tarkista suomen, englannin, ruotsin ja thain merkkituki siellä, missä näitä kieliä näytetään.
3. **Lukupalsta:** nykyinen `.container--narrow` (enintään 820 px) säilyy. Älä venytä leipätekstiä leveämmäksi vain siksi, että pitkä otsikko mahtuisi yhdelle riville. Pitkän tekstin lukuriville suuntaa-antava tavoite on noin 45–80 merkkiä.
4. **Rakenne:** yksi selkeä H1, kuvaava ingressi, skannattavat H2-osat, tarkoituksenmukaiset välistykset ja näkyvät lähteet. Murupolku, päivämäärä ja lukuaika ovat hyödyllisiä, mutta eivät saa kilpailla pääotsikon kanssa.
5. **Kuvat:** säilytä nykyinen kuvaohjeistus, rajaukset, alt-tekstit ja oikeat mitat. Kuva täydentää tekstin merkitystä; tärkeää tietoa ei upoteta pelkkään kuvaan. Älä muuta tämän ohjeen takia reseptikuvien työnkulkua.
6. **Käytettävyys:** merkitykselliset linkki- ja painiketekstit, näkyvä näppäimistöfokus, toimiva zoom ja ei vaakasuuntaista vierityspakkoa. Väri ei yksin selitä tilaa.

## Ruokaoppaan artikkelien täsmennys (6.11.2026)

Kapeallekin lukupalstalle tulevat otsikot voivat olla pitkiä, kuten *Thaimaalaiset raaka-aineet Suomessa: mitä voi korvata ja mitä ei?*. Ongelma ei ratkea otsikon keinotekoisella katkaisulla tai koko sivuston typografian pienentämisellä.

- `.blog-article h1`: käytä hillittyä responsiivista kokoa `clamp(1.8rem, 3.3vw, 2.375rem)` (noin 29–38 px, jos juuri-fontti on 16 px), tiiviimpää rivikorkeutta ja luonnollista, tasapainoista rivittymistä. Otsikko saa olla kahdella tai useammalla rivillä; älä lisää käsin rivinvaihtoja tai lyhennä sisältöä pelkän taiton vuoksi.
- `.blog-lead`: nykyinen `1.12rem` (noin 18 px) **säilyy**. Se tukee luettavuutta; aiempi ajatus pienentää kaikkea tekstiä hylätään.
- Artikkelisivun ylätilaa tiivistetään vain hieman (`2.5rem` → `1.75rem`). Hakemiston, reseptinäkymien, etusivun hero-alueen ja muiden `.page-section`-osien välistyksiä ei muuteta.
- Säilytä `.container--narrow`, kuva- ja tekstijärjestys sekä artikkelin semantiikka. Älä tee tästä yleistä `h1`-sääntöä.
- Navigaation erottelu ja linkkien vieritys kuuluvat erilliseen [PR #328:aan](https://github.com/ozirix-dev/Reseptit/pull/328); älä muokkaa niitä osana typografiakorjausta.

## Muutostyön tarkistusohje

1. **Määritä ongelma:** kuvaile ruutu, näkymä, käyttäjän tehtävä ja todettu virhe. Vertaa nykyistä toteutusta ennen uuden CSS:n lisäämistä.
2. **Valitse pienin muutos:** ensiksi jo olemassa oleva komponentti tai rajattu luokkaselektori, ei globaalia `h1`-/`body`-ylikirjoitusta, uutta fonttia, uutta pakettia tai uutta breakpointtia ilman tarvetta.
3. **Testaa oikealla sisällöllä:** lyhyt ja pitkä otsikko, 320–360 px mobiili, noin 768 px tabletti, 1024 px ja 1440 px työpöytä sekä 200 % zoom ja tarvittaessa 400 % reflow. Tarkista, ettei otsikon viimeiselle riville jää kohtuuttoman irrallista sanaa, ettei teksti leikkaannu ja ettei vaakavieritystä synny.
4. **Tarkista toiminta:** näppäimistöjärjestys, näkyvä focus, murupolkujen ja muiden linkkien toiminta, riittävä tekstikontrasti, tekstin skaalautuminen, merkityksellinen alt ja otsikkohierarkia. Testaa kielet niillä reiteillä, joilla ne ovat käytössä.
5. **Pidä testikuorma oikeasuhtaisena:** tyylimuutokselle riittävät kohdennetut tarkistukset ja sivuston build; laaja selain- tai koko repositorion testiajo vain, kun vaikutusalue vaatii sitä tai CI sitä edellyttää. Tarkista `git diff --check` ja ilmoita, mitä oikeasti testattiin.
6. **Vältä rinnakkaistyön törmäykset:** tarkista avoimet PR:t ja tiedostojen omistajuudet. Tee muutokset omassa haarassa, kuvaa rajaus PR:ssä, älä yhdistä tai julkaise pelkän ulkoasukatselmoinnin perusteella.

## Mihin Ossi-tutkimuksiin tämä perustuu

Ylläpitäjille tarkoitetut taustalinkit (Ossi on yksityinen):

- [Fontit ja luettavuus](https://github.com/ozirix-dev/Ossi/blob/main/research/web-design/fonttien_kaytto_verkkosivuilla_tutkimuskooste.md)
- [Web-taitto ja responsiivisuus](https://github.com/ozirix-dev/Ossi/blob/main/research/web-design/web_taitto_layout_tutkimuskooste.md)
- [Sisältörakenne ja skannattavuus](https://github.com/ozirix-dev/Ossi/blob/main/research/web-design/sisaltorakenne_ja_skannattavuus_tutkimuskooste.md)
- [Saavutettavuuden käytännön tarkistuslista](https://github.com/ozirix-dev/Ossi/blob/main/research/web-design/saavutettavuuden_kaytannon_checklist_tutkimuskooste.md)
- [Design tokenit ja kevyt design system](https://github.com/ozirix-dev/Ossi/blob/main/research/web-design/design_tokenit_ja_kevyt_design_system_tutkimuskooste.md)

Tämä on Reseptit-projektin oma tiivis päätös ja työohje, ei Ossi-muistioiden kopio.
