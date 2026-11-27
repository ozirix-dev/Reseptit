# Recipavo FLOW RESET

## Suojatusta julkaisusta PR:n CI-varmennukseen

Skripti tarkistaa GitHubista, että pinnaamaasi main-committia vastaava suojattu tuotantoajo valmistui ja tuotantovarmennus onnistui. Sen jälkeen se tarkistaa sovitun PR:n Recipe site -ajon ja poimii CI:n käyttämän main-revision ja testatun commitin. Ajo hyväksyy vain avoimen saman repon main-PR:n ja tarkistaa GitHubin nykyiset revisiot ennen kuitin tallennusta. Tarkistus yhdistää tuotanto- ja CI-tiedot samaan kuittiin. PR:n omistaja voi käyttää kuittia yhdessä riippumattoman katselmoinnin ja muiden sovellettavien porttien kanssa.

Aja skripti Windowsissa PowerShell 7:llä, kun GitHub CLI:n tunnistautuminen repoon on kunnossa. Alla on pilotin komento. Uuteen ajoon poimi voimassa olevat SHA:t, ajojen numerot ja yritykset GitHubista.

~~~powershell
pwsh -NoProfile -File scripts/recipavo-flow.ps1 -PullRequest 1026 `
  -HeadSha f501e0fe14cd7139b3622e21a4027325df2759d7 `
  -BaseSha 6802a41061525918d5c300ecdad3f0218f34e178 `
  -ReleaseRun 45965105393 -ReleaseAttempt 1 -CiRun 45939439179 -CiAttempt 2
~~~

Oletuksena skripti tarkistaa tilan kerran. Parametri WaitSeconds jatkaa odotusta enintään 3600 sekuntia.

Aja samoilla parametreilla uudelleen, kun GitHub näyttää odotetun ajon valmistuneen. Rajatulla odotusajalla skripti siirtyy seuraavaan tarkistukseen saman prosessin aikana. Environmentin hyväksyntää odottava ajo palauttaa tilan heti.

- **CI_VERIFIED, exit 0** tarkoittaa valmistunutta CI-tarkistusta. Uusinta lukee pinnatun tuotantoajon varmennuksen ja Recipe site -lokin GitHubista. Kuitti käytetään uudelleen vain, jos PR, HEAD, base, testattu commit ja ajoviitteet täsmäävät. Ristiriitainen kuitti hylätään.
- **WAITING_RELEASE, WAITING_CI tai BUSY, exit 3** tarkoittaa, että GitHub-ajo tai saman PR:n paikallinen tarkistus on kesken.
- **Virhe, exit 1** tarkoittaa esimerkiksi vanhentunutta revisiota, epäonnistunutta ajoa, puuttuvaa evidenssiä tai yhteysvirhettä kolmen lukuyrityksen jälkeen. Varmista virheen syy GitHubista ennen uusintaa.

Kuitti on Windows-käyttäjän paikallinen kirjaus. GitHubin pinnaama CI-yritys on testatun commitin lähde myös uusinnassa. Kuitin paikalliset aikaleimat säilyvät. Polku on %LOCALAPPDATA%\Recipavo\Flow\v1. Saman PR:n rinnakkaiset ajot jakavat prosessilukon, jonka Windows vapauttaa prosessin päätyttyä. Uusi ajo voi aloittaa keskeytyneen tarkistuksen samoilla parametreilla. Tallennus tulee näkyviin kerralla. Skriptillä on ainoastaan GitHubin lukuoperaatioita. Käyttö voidaan lopettaa palaamalla aiempaan käsin tehtyyn tarkistukseen.

Kuitin Windows-regressiotesti toimii ilman GitHub-yhteyttä. Aja PowerShellissä `python -B scripts/test_recipavo_flow_receipt.py`.

## Pilotti 27.11.2026

- Suojattu julkaisu valmistui klo 10.26.58. Tarkistus käynnistettiin sen jälkeen ja varmisti oikean työjonotapauksen #1026 ilman käyttäjän väliviestiä tai uutta CI-ajoa. [Suojattu julkaisu](https://github.com/ozirix-dev/Reseptit/actions/runs/45965105393) · [PR #1026](https://github.com/ozirix-dev/Reseptit/pull/1026) · [Recipe site, yritys 2](https://github.com/ozirix-dev/Reseptit/actions/runs/45939439179/attempts/2)
- Evidenssin haku ja tarkistus kesti kuitin kellonaikojen perusteella 5,8 sekuntia. Testattu commit oli 7f34f5719855366d70e2993770e32bb56ab8e387. Uusinta palautti alkuperäisen kuitin. Rinnakkainen ajo palautti BUSY, ja väärä main-SHA pysäytti tarkistuksen.
- Hallitussa testissä tuotantoajon siirtyminen jonosta onnistuneeksi käynnisti seuraavan tarkistuksen samassa prosessissa. Ensimmäinen luku yritettiin uudelleen yhteysvirheen jälkeen. Environmentin odotustila ja epäonnistunut julkaisu estivät seuraavan tarkistuksen.
- Näyttö kattaa yhden paikallisen työvaiheen. Pilotissa PR:tä, reseptiä tai julkaisua koskevia GitHub-kirjoituksia oli nolla. Vertailuaineistoa PR-läpimenoajasta ja varmennettujen reseptien määrästä ei vielä ole. ChatGPT:n vastaanottokuittaus, valvomaton käynnistyminen ja automaattinen jatkuminen Windowsin uudelleenkäynnistyksen jälkeen ovat edelleen varmentamatta.
