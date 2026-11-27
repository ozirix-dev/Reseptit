# Rinnakkaisten ChatGPT-keskustelujen työnomistajuus

**Päiväys:** 21.11.2026
**Soveltamisala:** Reseptit / Recipavo, GitHub-työtä tekevät ChatGPT-keskustelut.
**Periaate:** jokainen työskentelevä chatti tunnistautuu itse GitHubissa.

## 1. Chat 1–n – ei neljän chatin ylärajaa

Käyttäjä antaa keskustelulle tunnuksen `Chat N`, jossa **N on positiivinen kokonaisluku ilman kiinteää ylärajaa**: esimerkiksi Chat 1, Chat 4, Chat 5, Chat 12 tai Chat 100. Tunnus säilyy saman keskustelun töissä käyttäjän ilmoittamaan vaihtoon saakka. Samanaikaisilla keskusteluilla tulee olla eri numerot.

Chatti ei keksi eikä vaihda numeroaan omatoimisesti. Jos tunnusta ei ole annettu tai se on epäselvä, voi tehdä vain lukevia tarkistuksia ja suunnitelmia; ennen uutta GitHub-kirjoitustyötä tunnus varmistetaan käyttäjältä.

**GitHub-käyttäjä `ozirix-dev` on sama kaikissa chateissa.** `Chat N` on työnjako- ja jäljitettävyysmerkintä, ei GitHubin todentama käyttäjäidentiteetti tai oikeuslukko.

## 2. Jokainen chatti tekee omat GitHub-merkintänsä

Kun chatti aloittaa oman GitHub-kirjoitustyönsä, se:

1. Tarkistaa oikean repon, ajantasaisen `main`-SHA:n, avoimet PR:t ja niiden muuttamat tiedostot. Tunnistaa mahdolliset päällekkäisyydet ennen kirjoittamista.
2. Luo **oman uuden haaran** nimellä `chat<N>/<lyhyt-tehtava>-<paiva>`, esimerkiksi `chat12/kielitestit-20261121`. Samaa haaraa ei luovuteta toiselle chatille ilman nimenomaista omistajuuden siirtoa. Vanhoja, jo toimivia haaroja ei tarvitse nimetä uudelleen.
3. Merkitsee **uuden PR:n otsikkoon** tunnisteen `[Chat N]` ja **PR:n kuvaukseen** vähintään `Työn omistaja: Chat N`, tehtävän, rajatut tiedostot, oman haaran ja mahdolliset rinnakkaiset PR:t. Täytä myös `.github/pull_request_template.md` soveltuvin osin.
4. Jos chatti jatkaa **ennen sääntöä avattua omaa PR:ää**, kirjoittaa ensiksi PR-kommentin `Työn omistaja: Chat N` ja muutosten rajauksen. Tämä ei ole lupa ottaa toisen omistamaa PR:ää.
5. Päivittää omaan PR:ään todennetun HEAD-SHA:n, CI-tuloksen ja olennaiset esteet työn edetessä. CI-väite koskee vain tarkasti tarkistettua HEADia. Ei väitä Draftia julkaistuksi.

**Tärkeää:** GitHubin API:lla luotu PR ei välttämättä saa käyttöliittymän PR-pohjaa automaattisesti. Chatin on lisättävä tunnisteet **itse käyttämänsä työkalun PR-kuvaukseen** myös silloin, kun pohja ei lataudu.

## 3. Yksi kirjoittaja per haara

- **Yksi nimetty omistaja kirjoittaa yhtä PR-haaraa.** Sama Chat N voi omistaa useita erillisiä PR:iä, mutta ei toisen chatin haaroja.
- Tarkista ennen jokaista kirjoitusta haaran nykyinen HEAD. Jos HEAD muuttui odottamatta, toinen kirjoittaja toimii samassa haarassa tai tiedostovaraukset ovat ristiriidassa, **STOP** ja ilmoita käyttäjälle. Älä force-pushaa tai korjaa konfliktia hiljaisesti.
- Samaa tiedostoa tai yhteistä build-/validointiskriptiä koskevat rinnakkaiset muutokset sovitetaan **yhden valitun omistajan** kautta. Muut antavat katselmoinnin tai erillisen, SHA-lukitun ehdotuksen.
- Merkitse PR-kuvaukseen muiden PR:ien mahdolliset riippuvuudet; päällekkäinen kirjoittaminen ei muutu turvalliseksi vain siksi, että chatit ovat eri numeroilla.
- Repo Guard, F25/GK/ravinto- ja käännöshyväksynnät, branch protection, CI, julkaisu- ja tietosuojaportit pysyvät voimassa. Tunniste ei myönnä Ready-, merge- tai tuotantojulkaisuoikeutta.

## 4. Pieni kopioitava GitHub-ilmoitus

```markdown
Työn omistaja: Chat 12
Tehtävä: Rajattu monikielinen korjaus
Kirjoitushaara: chat12/korjaus-20261121
Muutettavat tiedostot: site/tests/oma-testi.test.ts
Rinnakkaiset PR:t tarkistettu: kyllä; ei päällekkäisiä kirjoitusvarauksia
Tila: Draft, julkaisematon
Testattu HEAD / CI: odottaa
```

Kun työn omistaja vaihtuu, molemmat osapuolet pysäyttävät kirjoitukset ja uusi omistaja kirjaa luovutuksen PR-kommenttiin. GitHubin todellinen HEAD, CI ja PR-tila tarkistetaan uudelleen. Omistajuuden siirtoa ei päätellä pelkästä kommentista.

## 5. Käyttöönotto

Tämä ohje kannattaa säilyttää pysyvästi sekä tämän repon `AGENTS.md`-tiedostossa (linkki ja pakollinen tiivistelmä) että GitHubin PR-pohjassa. Uudet työt noudattavat ohjetta heti sen hyväksymisen jälkeen. Vanhoja PR-otsikoita tai haaroja ei ole tarpeen massamuuttaa; omistaja tunnistautuu GitHubissa seuraavalla omalla päivityskerralla.

**Rajaus:** tämä on yhteistyösääntö, ei GitHubin todentama käyttäjäidentiteetti. Alla kuvattu CI-auditointi tarkistaa merkintöjen keskinäistä johdonmukaisuutta eikä anna uusia kirjoitus-, merge- tai julkaisuoikeuksia.

## 6. CI:n Chat N -merkintätarkistus

Erillinen `.github/workflows/chat-owner-metadata.yml` käynnistyy PR:n avaamisesta, päivittämisestä ja uudelleenavaamisesta. Sen testattu Node-ohjelma on `.github/scripts/check-chat-owner.mjs`; se lukee GitHubin `pull_request`-tapahtuman **vain paikallisesta tapahtuma-JSON:sta**, ei GitHubiin tehtävillä muutospyynnöillä.

- Uusi PR (numero yli **791**), jonka otsikossa tai kuvauksessa on `Chat N` tai jonka haara alkaa `chatN/`, saa tarkistuksen: otsikon `[Chat N]`, kuvauksen `Työn omistaja: Chat N` ja mahdollisen `chatN/`-haaratunnuksen on oltava samat positiiviset kokonaisluvut.
- Väärät tai ristiriitaiset Chat-numerot merkitsevät tämän **erillisen CI-tarkistuksen epäonnistuneeksi**. Puuttuva Chat-merkintä uudessa PR:ssä antaa **varoituksen**, ei automaattista estoa: esimerkiksi ihmisen tai Codexin työtä ei voi päätellä pelkästä PR:n otsikosta. Chatti ei saa käyttää tätä poikkeusta ohittaakseen itseilmoitusvelvollisuuttaan.
- Ennen omistajuussäännön yhdistämistä avatut PR:t **#1–#791 jätetään takautuvasti rauhaan**; niiden omistaja ilmoittautuu seuraavalla omalla päivityksellä tämän ohjeen mukaisesti. Vanhoja haaroja ei nimetä automaattisesti uudelleen.
- Jos uusi chatti jatkaa aiemmin nimettyä haaraa, numeroiden on täsmättävä aina, kun haarassa on `chatN/`-etuliite. Vanhoilla `recipe/`- tai muilla haaroilla johdonmukainen otsikko ja kuvaus kelpaavat; haaran nimestä annetaan vain suositus.
- Auditointi käyttää `pull_request`-tapahtumaa ja read-only-oikeuksia, ei salaisuuksia tai `pull_request_target`-kirjoitusoikeuksia. Se ei ole identiteetti- tai Repo Guard -turvaportti, eikä sen läpäisy todista käyttäjän suostumusta tai branch-omistajuutta. Tämän lisätarkistuksen tilaa ei merkitä pakolliseksi `Recipe site / build` -portiksi tässä työssä.
- Auditointi kirjoittaa vain staattiset virhe-/varoitusviestit ja PR-numeron: se ei tulosta PR:n vapaata tekstiä tai arkaluonteisia tietoja. Automaattiset korjaukset, kommentit, haarojen muuttaminen ja PR:n yhdistäminen eivät kuulu tarkistukseen.

Testaa itsenäisesti Node 22:lla: `node --test .github/scripts/check-chat-owner.test.mjs`. PR:n täsmä-HEAD:n tuloksen varmistaminen on edelleen omistavan chatin vastuulla.

## 7. Kokki-Codex – nimetty tekninen työntekijä (22.11.2026)

Käyttäjän antama pysyvä työnjako- ja GitHub-merkintä on **Kokki-Codex**.
Se on oma Codex-työntekijän roolinsa, **ei** uusi `Chat N` -numero,
GitHub-tunnus eikä erillinen oikeuksien myöntäminen. Aiemman Codex-työn
omistajuutta tai PR-haaroja ei vaihdeta takautuvasti.

Uusissa Kokki-Codexin **nimenomaisesti valtuutetuissa** kirjoitustöissä:

- PR-otsikko: `[Kokki-Codex] <tehtävä>`.
- PR-kuvaus: `Työn omistaja: Kokki-Codex`, tehtävä, rajatut tiedostot,
  kirjoitushaara, riippuvuudet, HEAD/base-SHA, CI-tulokset ja HOLD-ehdot.
- Uusi kirjoitushaara mahdollisuuksien mukaan
  `kokki-codex/<tehtava>-<paiva>`. Vanhoja haaroja ei nimetä uudelleen.
- **Chat-1 (Pääkokki) vastaa yksin Ready-siirroista, mergeistä ja
  integraation jälkeisistä main-CI-tarkistuksista.** Kokki-Codex
  luovuttaa oman rajatun Draft-PR:nsä Chat-1:lle, ellei käyttäjä erikseen
  muuta työnjakoa.
- Chat-2–6 säilyttävät nykyiset omat PR:nsä ja muutostensa kirjoitusomistajuuden.
  Jos tiedostovaraukset osuvat päällekkäin, työ sovitetaan omistajan kanssa
  **ennen** kirjoittamista. Pelkkä GitHub-kommentti tai tämän ohjeen lukeminen
  ei siirrä omistajuutta.
- Codexin nyt käynnissä oleva **Reseptit + ReportHub -perehtymisauditointi
  on vain luku -työ**: uusi nimi ei käynnistä toteutusta eikä muuta auditoinnin
  käyttöoikeuksia tai rajoituksia.

Nykyiset Repo Guardin paikallinen suostumus, tarkka HEAD/base-SHA, CI,
review-, ruoka-/ravinto-/GK-, F25-, karanteeni- ja julkaisuportit säilyvät
sellaisinaan. `Chat owner metadata`-tarkistus koskee edelleen `Chat N`
-merkintöjen johdonmukaisuutta; `Kokki-Codex` ei saa tekeytyä Chat N:ksi
tarkistuksen läpäisemiseksi.

**Tiedoksi Chat-2–6:** jokainen voi jatkaa omaa työtään ennallaan.
Kokki-Codexin uusi tunniste koskee tulevia Codexille erikseen osoitettuja
tehtäviä. Yhteiset ohjeet luetaan GitHubista; erillisiä chat-keskusteluja
ei voi automaattisesti synkronoida pelkällä GitHub-päivityksellä.

## 8. Codex- ja ChatGPT-keskustelujen viestintä

- **Codex N ↔ Chat N.** Jokaisella käyttäjän nimeämällä Codex N:llä on
  kaksisuuntainen viestiyhteys saman numeron Chat N:ään. Käytä käyttäjän
  nimeämää paria riippumatta numerosta. Vastaus osoitetaan alkuperäiselle
  lähettäjälle.
- **Kokki-Codex ↔ Chat 1–n.** Lähetä työkohtainen viesti sille Chat N:lle,
  jonka vastuulle asia kuuluu. Chat 1 (Pääkokki) vastaanottaa Kokki-Codexin
  Draft-PR-luovutukset ja vastaa yksin Ready-siirroista, mergeistä ja main-CI:stä.
- **Kohteen tarkistus.** ChatGPT-kohde tarkistetaan kirjautuneessa Bravessa
  projektin, roolin ja aktiivisen keskustelutunnisteen perusteella.
  Codex-kohteesta tarkistetaan Reseptit-projekti ja chatin tunniste.
  Jos keskustelu on vaihtunut, varmista ajantasainen tunniste ennen lähettämistä.
  Käytä ChatGPT-kohteeseen Playwright-skillin viestintäohjetta ja Codex-kohteeseen
  käytettävissä olevaa Codex-chatin viestityökalua.
- **Lähetys ja kuittaus.** Lähetä käyttäjän valtuuttama viesti oikeaan
  keskusteluun. Tarkista lähetyksen jälkeen, että viesti näkyy siellä.
  Jos tulos jää epäselväksi, etsi sama viesti ennen uutta yritystä.
  Kuittaus saadaan, kun vastaanottaja vahvistaa viestin vastaanoton.
  Tee GitHub-toimet projektin omistajuus-, Repo Guard- ja hyväksyntäohjeiden mukaan.
- **Kuittauksen paluureitti.** Jos Chat N vahvistaa vastaanoton Bravessa ja
  suora lähetys Codex N:ään ei onnistu, välitä Chat N:n kuittaus käyttäjän
  valtuuttamana sanatarkasti saman numeron Codex N:lle. Varmista Reseptit-projekti,
  Codex-rooli ja keskustelutunniste. Kerro, mistä chatista kuittaus tuli, ja
  pyydä Codex N:ää vahvistamaan vastaanotto samalla viestitunnisteella.
  Tarkista Codex N:n vastaus ja merkitse paluu vahvistetuksi vasta, kun
  tunniste täsmää. Kerro tarvittaessa, että paluu kulki välityksen kautta.

### Kopioitava viestipohja

```text
Projekti: Reseptit / ozirix-dev/Reseptit
Lähettäjä: <Kokki-Codex / Codex N / Chat N>
Vastaanottaja: <Kokki-Codex / Codex N / Chat N>
Asia: <tilannepäivitys, kysymys, luovutus tai kuittaus>
Tehtävä ja tulos: <lyhyt tilannekuva>
PR tai issue: <linkki tai ei sovellu>
Haara ja rajatut tiedostot: <haara ja tiedostot tai ei sovellu>
HEAD/base-SHA: <täydet SHA:t tai ei sovellu>
Testit ja CI: <tulokset ja testattu SHA; merkitse keskeneräiset>
Esteet, HOLD-ehdot ja riippuvuudet: <olennaiset tiedot>
Vastaanottajalta odotetaan: <täsmätoimi, vastaus, kuittaus tai tiedoksi>
```

Esimerkiksi Codex 12 lähettää Chat 12:lle työkohtaiseen kysymykseen
liittyvän viestin, ja Chat 12 osoittaa vastauksen Codex 12:lle.
Kokki-Codex osoittaa Draft-PR:n luovutuksen Chat 1:lle.
