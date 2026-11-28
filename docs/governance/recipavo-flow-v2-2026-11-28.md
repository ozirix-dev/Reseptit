# RECIPAVO FLOW V2 – integraation läpimenoaika

Chat 1 omistaa kokonaisuuden ja koordinoi integraatiovuorot. Kokki-Codex 1 on tämän Draftin ainoa haarakirjoittaja. Jokainen työpaketti voidaan hyväksyä, pilotoida tai jättää HOLDiin erikseen.

## Tavoite ja lähtötaso

Lyhennä valtuutetun muutoksen matkaa katselmointivalmiudesta vihreään main-CI:hin ja vapautettuun varaukseen. Käytä GitHubin nykyistä työjonoa [#969](https://github.com/ozirix-dev/Reseptit/issues/969) ja [RECIPAVO-AUTONOMIA-V1:n omistajapäätöstä](https://github.com/ozirix-dev/Reseptit/issues/969#issuecomment-7212803624). Ensisijainen mittari on hyödyllisen valtuutetun työn läpimenoaika. 4–6 valmista PR:ää tunnissa on hypoteesi, joka arvioidaan vertailukelpoisella aineistolla.

GitHubista varmennettu alustava vertailu 28.11.2026 kattaa vain main-CI:n aikavälin `run_started_at → updated_at` onnistuneissa ajoissa. Ajot valitsivat eri tarkistuksia. Näistä ajoista ei lasketa integraation kokonaiskestoa eikä tuntikapasiteettia.

| PR | Main-CI | Aikaväli UTC | Kesto |
| --- | --- | --- | --- |
| #1046 | [46115373720](https://github.com/ozirix-dev/Reseptit/actions/runs/46115373720) | 06.10.24–06.17.16 | 6 min 52 s |
| #1020 | [46118817776](https://github.com/ozirix-dev/Reseptit/actions/runs/46118817776) | 06.55.20–07.01.49 | 6 min 29 s |
| #1047 | [46120404633](https://github.com/ozirix-dev/Reseptit/actions/runs/46120404633) | 07.16.02–07.18.30 | 2 min 28 s |

Täysi lähtötaso kerätään WP08:ssa nykyisellä hyväksyntämenettelyllä. [#1020:n eräesitarkistus](https://github.com/ozirix-dev/Reseptit/pull/1020) antaa esimerkin rajatusta eräkäsittelystä ja muuttumattomista hyväksyntäehdoista. [#982:n istuntokatkos](https://github.com/ozirix-dev/Reseptit/issues/969#issuecomment-7235435289) antaa toistettavan regressiotapauksen WP05:lle.

## Työpaketit

Omistajasarakkeessa mainitut tekniset roolit ovat toteutusehdotuksia. Chat 1 nimeää kunkin kokeilun toteuttajan nykyisessä jonossa.

| Paketti | Toteutus ja omistajuus | Edellytys | Hyväksymiskriteeri |
| --- | --- | --- | --- |
| WP01 Tapahtumapohjainen CI-seuranta | CI:n ylläpitäjä seuraa olemassa olevan GitHub-tapahtuman kautta PR- ja main-ajoja. Katkoksesta palataan saman run ID:n ja attemptin tilalukemaan. | Nykyisen tapahtumatilauksen saatavuus. Lukutilainen rajattu kysely toimii toissijaisena reittinä. | Onnistuminen, virhe ja peruutus havaitaan oikealle revisiolle. Kahdentunut tai viiveellä tullut tapahtuma ei käynnistä uutta ajoa. |
| WP02 Sarjallinen integraatiojono | Chat 1 käyttää #969:ää nykyisen ja yhden seuraavan vuoron osoittamiseen. Valmistelut voivat edetä rinnakkain omissa rajauksissaan. | WP09:n yhden kirjoittajan sääntö ja vahvistettu edeltävän vuoron lopputulos. | Kahdesta valmiista työstä vain yhdellä on aktiivinen main-vuoro. HOLD vapauttaa vuoron vain vahvistetulla päätöksellä, ja riippumaton valtuutettu työ voi edetä. |
| WP03 Katselmointinäytön uudelleenkäyttö | Riippumaton katselmoija sitoo kuitin HEADiin, BASEen, ehdokaspuuhun ja katselmoituihin blobeihin. Seuraava katselmointi rajataan muuttuneisiin blobeihin ja riippuvuuksiin. | Alkuperäinen kuitti ja sen tekijä voidaan todentaa. | Identtinen aineisto kelpaa vain kuitin kattamassa laajuudessa. Sisällön tai merkityksellisen riippuvuuden muutos vaatii deltakatselmoinnin. |
| WP04 Pohjapäivitysten vähentäminen | Integraatio-operaattori vertaa vahvistettua testipuuta nykyisestä HEADista ja mainista laskettuun ehdokaspuuhun sekä tarkistaa CI-workflow'n ja revisiovalitsimen. | WP03 ja Repo Guardin sekä GitHubin nykyiset portit. | Vältetty synkronointi kirjataan vain, jos täsmätestattu puu, nykyinen workflow ja portit sen sallivat. Muuttunut puu tai vanha workflow-tapahtuma edellyttää hyväksyttyä uutta PR-tapahtumaa. |
| WP05 MCP-istunto ja varaus | Repo Guardin ylläpitäjä testaa istuntokatkoksen, alkuperäisen istunnon jatkon ja eri istunnon pyynnön. Mahdollinen korjaus kuuluu Repo Guardin omaan repoon. | Testivaraukset ja Repo Guardin omistajan rajaus. | Väärä istunto ei voi Ready-, Merge- tai Close-toiminnolla käyttää toisen varausta. Tuettu jatko todennetaan synteettisellä varauksella. Istuntotunnuksia tai varausavaimia ei siirretä. |
| WP06 Riskiperusteinen hyväksyntä | Chat 1 ja Repo Guardin ylläpitäjä kuvaavat, mitä valmistelussa voi tehdä itsenäisesti ja mikä tarkka SHA-sidottu vaihe edellyttää omistajaa. | AUTONOMIA-V1 ja nykyinen paikallinen ihmishyväksyntä. | Väärä SHA, vanhentunut hyväksyntä ja puuttuva päätös pysäyttävät toiminnon testissä. Paikallinen ihmishyväksyntä säilyy. Kuittaus pysyy käyttäjän omana toimena. |
| WP07 Samantasoiset erä-PR:t | Sisältöomistaja kokoaa samaan erään vain samantyyppiset, saman riskin ja samojen porttien muutokset. Chat 1 päättää integraatiovuoron. | Rajattu tiedostoluettelo ja riippumaton eräkatselmointi. | Jokaisen kohteen näyttö ja mahdollinen HOLD näkyvät erikseen. Erän voi jakaa menettämättä hyväksyttyjen kohteiden näyttöä. Mitataan hyödylliset kohteet ja uusintatyö. |
| WP08 Kolmen integraation lähtötaso | Kokki-Codex kokoaa GitHubin ajoista ja #969:n kuiteista kolme normaalia peräkkäistä integraatiota. Chat 1 varmistaa rajauksen. | Vertailtavat lähtö- ja päätepisteet sekä käytettävissä olevat aikaleimat. | Kolme jäljitettävää riviä, joista näkyvät valmistelu, CI, hyväksyntäodotus, luovutusviive ja kokonaiskesto. Puuttuvat aikaleimat merkitään puuttuviksi. |
| WP09 Päällekkäisyyksien esto | Chat 1 ja haaran omistaja tarkistavat live-HEADin, aktiiviset varaukset ja muuttuvat tiedostot ennen työn aloitusta. Käytetään jaettua Repo Guard -varausta. | Olemassa oleva varaus- ja omistajuusnäkymä. | Samanaikaisista pyynnöistä vain yksi saa saman haaran kirjoitusvuoron. Vanhentunut varaus pysyy selvityksessä, ja ristiriita pysäyttää kirjoituksen. |
| WP10 Yksi kuitti tilamuutoksesta | Nykyinen operaattori kirjaa olennaisen tilamuutoksen nykyiseen PR:ään tai #969:ään, mukana pinni ja lähdeviite. | WP01:n ja WP02:n todennettu siirtymä. | Toistettu tapahtuma ei tuota uutta kuittia. Virheestä tai HOLDista näkyy yksi syy ja jatkoehto. Valmistuneesta vuorosta näkyvät merge-SHA, main-CI ja vapautettu varaus. |

## Vaiheistus ja testisuunnitelma

1. **Mittaa nykytila.** WP08 ja WP10 käyttävät olemassa olevia kuitteja. Mittaa kokonaiskesto hetkestä, jolloin sovittu toteutus on ensimmäistä kertaa katselmointivalmis, siihen kun main-CI on läpi ja varaus vapaa. Kirjaa valmistelun, CI:n, hyväksyntäodotuksen ja luovutusviiveen alku ja loppu erikseen UTC:ssa. Mittaa kokonaiskesto seinäkellosta. Merkitse päällekkäiset jaksot, älä summaa niitä kokonaiskestoon. Tallenna PR, HEAD, BASE, run ID/attempt, testipuu, riski ja muuttuneet polut. Raportoi myös ajamatta jätetyt uusinnat sekä HOLDien määrä ja kesto.
2. **Kokeile lukutilassa.** WP01–04 ja WP09–10 testataan tallennetuilla metatiedoilla. Toista onnistunut ajo, epäonnistunut ajo, vanhan yrityksen viivästynyt tapahtuma, mainin muuttuminen, ristiriitainen varaus, muuttunut riippuvuus ja saman tapahtuman kaksoistoimitus. Vertaa tulosta GitHubin lopputilaan. Lisää yksi keskeytys ja varmista, että samaan ajoon palaaminen ei toista kirjoitusta.
3. **Testaa rajat erikseen.** WP05 käyttää synteettisiä istuntoja ja varauksia. WP06 tarkastetaan käyttäjän hyväksyntäportteja muuttamatta. Pilotoi WP07 yhdellä erällä, jonka kohteilla on samat portit. Jatka muiden pakettien hyväksyttyjä osia, jos jokin näistä jää HOLDiin.
4. **Vertaa tulokset.** Tee seuraava vertailu vastaavalla riskitasolla ja tarkistusprofiililla. Arvioi kokonaiskeston mediaani, odotusten osuus, hyödylliset valmiit kohteet ja regressiot. Kolmen PR:n otos kertoo, mihin aika kului, ja auttaa rajaamaan seuraavan kokeilun. Laajenna otosta ennen kapasiteettiväitettä.

Ensimmäinen Draft sisältää tämän suunnitelman. Nykyiset workflow't, Repo Guard -portit, reseptit, ravinto/GK, GitHub-asetukset ja tuotanto ovat tämän avauksen rajauksen ulkopuolella. [#1027:n](https://github.com/ozirix-dev/Reseptit/pull/1027) GH-02/03/08/10/11-omistajuus kattaa edelleen turvallisuusasetukset, rulesetit, kustannusauditoinnin, palautuksen ja release-evidenssin. Mahdollinen toteutus etenee nykyisessä työjonossa sen omilla katselmointi-, CI- ja hyväksyntäehdoilla.
