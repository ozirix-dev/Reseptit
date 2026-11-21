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

**Rajaus:** tämä on yhteistyösääntö, ei automaattinen GitHub-oikeuksien valvonta. Myöhempi erillinen CI-tarkistus voisi varmistaa uuden PR:n `Työn omistaja: Chat N` -merkinnän, mutta sitä ei kytketä käyttöön ilman erillistä suunnittelua, jotta vanhat PR:t tai muut tekijät eivät vahingossa esty.
