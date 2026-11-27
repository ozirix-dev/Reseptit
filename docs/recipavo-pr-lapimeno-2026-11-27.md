# Recipavon PR-läpimeno – ongelmat ja ratkaisuehdotus

Tila: ehdotus katselmointiin
Tilannekuva: 27.11.2026 klo 03.52 UTC
Tarkastettu main: `bdfaa41a434d61f7f7153d0d68546bd51f9895ff`

## Päätös, jota ehdotetaan

Kokeillaan kolmen peräkkäisen integraation ajan yhtä Chat 1:n ylläpitämää PR-jonoa. Omistajat ja katselmoijat valmistelevat seuraavia PR:iä rinnakkain. Vain yhdellä PR:llä on main-integraatiovuoro kerrallaan, ja vuoro päättyy varmennettuun main-CI-tulokseen. Erotetaan työjonosta julkaisuympäristön hyväksyntä ja kirjataan odotus aikaleimalla.

Aloitetaan olemassa olevalla Repo Guardilla, GitHub Actionsilla ja jonon nykyisellä seurantamerkinnällä. Kokeilun päätös koskee toimintatapaa. Työkalumuutokset, käyttöoikeudet ja tuotantojulkaisut käsitellään omien hyväksyntäporttiensa kautta.

## Mitattu lähtötilanne

- 26.11. klo 00.00 UTC – 27.11. klo 03.52 UTC yhdistettiin mainiin 18 PR:ää eli 0,65 PR:ää tunnissa. PR:n avauksesta yhdistämiseen kului mediaanina 5 h 05 min ja p90:nä 30 h 12 min. P90 on järjestetyn otoksen sijaluku `ceil(0,9 × 18)`. Luku kuvaa kaikkia jakson aikana yhdistettyjä main-PR:iä. Osa niistä avattiin ennen jaksoa. [Yhdistettyjen PR:ien rajaus](https://github.com/ozirix-dev/Reseptit/pulls?q=is%3Apr+is%3Amerged+base%3Amain+merged%3A2026-11-26..2026-11-27)
- Alkuperäisestä 15 PR:n jonosta yksi yhdistettiin ja main-CI varmennettiin. Kuudella oli omistajan perusteltu HOLD. Jäljellä oli 14 avointa luonnosta, joista kaikki olivat GitHubin mukaan teknisesti yhdistämiskelpoisia #1011:n korjauspushin jälkeen. [Avoimet PR:t](https://github.com/ozirix-dev/Reseptit/pulls) · [#1030:n main-CI](https://github.com/ozirix-dev/Reseptit/actions/runs/45928846648) · [#1011:n uusi PR-CI](https://github.com/ozirix-dev/Reseptit/actions/runs/45936399152)
- Mainiin tuli 39 uutta suomenkielistä resepti-identiteettiä kahdesta erästä. Viimeisin onnistunut suojattu tuotantoajo kohdistui näitä vanhempaan revisioon `3e0fe341`. Tuotantoon julkaisun nopeus oli tällä UTC-jaksolla 0 uutta reseptiä tunnissa käytettävissä olevan tuotantoajohistorian perusteella. [20 reseptiä, #1022](https://github.com/ozirix-dev/Reseptit/pull/1022) · [19 reseptiä, #1024](https://github.com/ozirix-dev/Reseptit/pull/1024) · [Viimeisin onnistunut tuotantoajo](https://github.com/ozirix-dev/Reseptit/actions/runs/45703417283)

## Havaitut pullonkaulat

| Havainto | Seuraus | Ensimmäinen korjaus |
| --- | --- | --- |
| `pages.yml` muuttui PR-tapahtuman jälkeen. #1020:n vanhan ajon uusinta pysähtyi revision varmistukseen ennen testejä. #1013:n vihreä ajo testasi vanhaa BASEa. | Vihreä PR-näkymä tai uusi yritys vanhaan tapahtumaan ei anna näyttöä nykyiselle HEAD/BASE-parille. | Merkitään tapahtuman BASE, työssä testattu BASE ja workflow-blob. Hankitaan tarvittaessa uusi vartioitu PR-tapahtuma. [#1020:n loki](https://github.com/ozirix-dev/Reseptit/actions/runs/45778800366/job/140279319851) · [#1013:n ajo](https://github.com/ozirix-dev/Reseptit/actions/runs/45788079157) |
| #1020:n Repo Guard -esitarkastus läpäisi ja käyttäjä antoi valtuutuksen. Paikallinen suoritusympäristö esti työvarauksen. | Lupa ja käyttökelpoinen suoritusreitti selviävät eri kohdissa. | Todennetaan nimetyn operaattorin sallittu suoritusreitti ennen vuoron sitomista. Kirjataan tekninen esto kerran ja edetään riippumattomassa valmistelussa. [Valtuutus](https://github.com/ozirix-dev/Reseptit/pull/1020#issuecomment-7208423863) · [Estokuitti](https://github.com/ozirix-dev/Reseptit/issues/351#issuecomment-7208786054) |
| #1031:n testikorjaus on valmis ja varaus vanhentunut. | Omistajan työ odottaa alkuperäisen varaajan kuittia. | Tarkistetaan varauksen haltija ja päättymisaika ennen työvuoroa. Vapautetaan varaus heti rajatun toimenpiteen jälkeen. [#1031:n kuitti](https://github.com/ozirix-dev/Reseptit/pull/1031#issuecomment-7207636637) |
| #1011:n hyväksytty teksti ja kuvarekisterin ratkaisu olivat ensin vain paikallisessa commitissa. | GitHub näytti vanhan konfliktin, eikä etärevisiolle voinut käynnistyä CI:tä tai lopullista katselmointia. | Sidotaan omistajan luovutus yhteen revisioon ja kirjataan erikseen, milloin se näkyy etähaarassa. [Paikallinen näyttö](https://github.com/ozirix-dev/Reseptit/issues/969#issuecomment-7209154583) |
| Yhdistetty reseptierä odottaa suojattua tuotantoajoa. Viimeisimmässä onnistuneessa ajossa esitarkistuksen ja buildin alun väli oli 59 min 05 s. | Mainin läpimeno kasvoi, mutta uudet reseptit eivät edenneet tuotantoon samalla jaksolla. Yhden ajon viive ei yksilöi koko odotuksen syytä. | Valmistellaan yksi julkaisuvalmis SHA-kooste sovittuun hyväksyntäikkunaan ja mitataan vaiheet erikseen. [Tuotantoajon työvaiheet](https://github.com/ozirix-dev/Reseptit/actions/runs/45703417283) |

## Kolmen integraation pilotti

Chat 1 ja Kokki-Codex hyväksyvät pilotin rajauksen ennen aloitusta. Kirjaa jonoon aloitushetki UTC-aikana sekä kolme mukaan valittua PR-numeroa sovitussa integraatiojärjestyksessä. Kuittaa rajaus kunkin PR:n omistajan kanssa ennen aloitusta. Jos valittu PR jää HOLDiin, säilytä se pilotin seurannassa ja kirjaa HOLDin alku, loppu ja syy erikseen. Näytä PR:n kokonaisläpimeno ja aktiivinen etenemisaika erikseen. Jos kolme integraatiota ei toteudu, raportoi pilotti keskeneräisenä. Tämän dokumentin yhdistäminen ei käynnistä pilottia.

1. **Yksi näkyvä työjono.** Chat 1 säilyttää kullekin PR:lle omistajan, HEADin, BASEn, viimeisen kuitin, seuraavan toimenpiteen ja aikaleimat. Jonosta näkyy yhdellä silmäyksellä, voiko joku edistää työtä nyt. HOLDin syy ja päätöksentekijä kirjataan.
2. **Kaksi ehdokasta valmisteluun, yksi integraatioon.** Omistajat valmistelevat seuraavat kaksi toisistaan riippumatonta PR:ää. Chat 2 katselmoi rajatut deltat ja Chat 3 tuo reseptien ravinto- ja GK-näytön. Toinen kirjoittaja samalle haaralle edellyttää nimenomaista työvuoron vaihtoa. Chat 1 siirtää vuoroa vain, kun riippuvuudet ja omistajien päätökset sen sallivat.
3. **Katselmointikuitti kokoaa olemassa olevan näytön.** Sisältö, kuvat, ravinto/GK ja tekninen tarkastus sidotaan tarkastettuun ID:hen ja revisioon. Nykyisen HEADin ja BASEn riippumaton kuitti kattaa muuttuneen deltan. Muuttumattomien tiedostojen aiempi näyttö hyödynnetään portin vaatimalla tavalla.
4. **Tarkista CI:n tuoreus ennen uutta ajoa.** Vertaa workflow-blob ja PR-tapahtuman revisiot. Käytä nykyisen CI-valitsimen määräämiä testejä. Hyödynnä alkuperäisiä lähde- ja historiakiinnikkeitä, kun samaa testiä nopeutetaan. Säilytä negatiiviset kontrollit ja vertaa samat testijoukot puhtaassa työpuussa. [Historiavarmistusten nykyinen ratkaisu #1032](https://github.com/ozirix-dev/Reseptit/pull/1032)
5. **Tarkista hyväksyntä ja suorituskelpoisuus etukäteen.** Nimetty operaattori tarkistaa Repo Guardin, omistajuuden ja varauksen ennen muutosta. Jos tarvitaan käyttäjän päätös, tiivistä yhteen viestiin pyydetty toiminto, tarkka revisiopari ja luvan rajaus. Yhdistämisen jälkeen varmista täsmä-main-CI ja vapauta varaus.
6. **Kokoa julkaisuikkunaan täsmälista.** Yksi hyväksyntäpyyntö yksilöi ehdokas-SHA:n, uudet resepti-identiteetit, mukaan tulevat muutokset ja tarkistuskuitit. Suojatun ajon päätyttyä tarkista live-sivustolta versio ja uusien reittien näkyvyys ennen kuin reseptit lasketaan julkaistuiksi.

## Mittaus ja päätöskriteerit

| Mittari | Miten mitataan | Pilotin tavoite |
| --- | --- | --- |
| Julkaistut uudet reseptit tunnissa | Deduplicoidut identiteetit hyväksytystä versiosta, varmennettu live-näyttö, jaettuna koko UTC-jakson tunneilla | Tulosta seurataan erikseen. Yksi onnistunut julkaisu ei riitä ennusteeksi. |
| PR:n läpimeno | Avauksesta mergeen ja erikseen ensimmäisestä integraatiovalmiista hetkestä mergeen, mediaani ja p90 | Pilotin kolmen PR:n ajat kirjataan. Verrataan vähintään kymmeneen vastaavan luokan valmistuneeseen PR:ään ennen pysyvää tavoitepäätöstä. |
| Väärän revision CI | Aloitetut ajot, jotka revision portti pysäyttää vanhan tapahtuman vuoksi | 0 tällaista uusintaa pilotissa. |
| CI:n jonotus ja suoritus | Tapahtuma → runnerin aloitus → tulos, HEAD ja testattu BASE mukana | Aikajakauma näkyviin, ennen kuin arvioidaan testien nopeuttamisen hyötyä. |
| Päätös- ja julkaisuodotus | Kelvollinen pyyntö → päätös → tuotantoajo → live-varmennus | Jokainen odotus näkyy omalla aikaleimalla. |
| Laatu ja turvallisuus | Main-CI, julkaisuvarmennus, todelliset palautukset ja avoimet ruokaturvallisuus-, käännös- ja ravinto/GK-estot | 100 % vaaditusta näytöstä. Jokainen portin poikkeama pysäyttää pilotin arviointiin. |

Suurin odotettu hyöty on väärälle revisiolle aloitettujen ajojen ja jonosta kadonneiden odotusaikojen väheneminen. Mittausjakson 0,65 PR:ää tunnissa sisältää eri kokoisia muutoksia ja niiden odotusajat. Aineisto ei riitä erottamaan hyväksyntäjonon, testien ja oman prep-työn osuutta kokonaisajasta.

Kolmen kierroksen lopuksi Chat 1 ja Kokki-Codex vertaavat havaintoja, nimeävät seuraavan mitatun esteen ja päättävät, jatketaanko kokeilua. Mahdollinen automaatio suunnitellaan erikseen vasta, kun käsin toimiva polku ja sen suojaehdot on osoitettu.
