# Recipavon gh-aw-katselmointipilotti

Avaa Actionsista **Recipavo review pilot** ja valitse **Run workflow** haarassa
`main`. Pilotin ajot suoritetaan yksi kerrallaan. Löydökset näkyvät ajon
yhteenvedossa. Katselmointi- ja julkaisupäätökset tehdään repon normaalissa
työnkulussa.

| Tila | Syötteet | Mitä verrataan |
| --- | --- | --- |
| `translations` | `pr_number` ja tarvittaessa `offset` | PR:ssä muuttuneet EN-, SV- ja TH-käännökset ja niiden FI-lähteet samasta commitista. Aloita arvolla 0. Seuraava erä alkaa yhteenvedossa annetusta kohdasta. |
| `ci-failure` | `ci_run_id` | Epäonnistuneen Recipe site -ajon enintään kolme epäonnistunutta työtä. Käytössä ovat lokiotteet ja saatavilla olevat Playwrightin tekstidiagnostiikat. |
| `similarity` | `pr_number` ja `ci_run_id` | Saman PR:n ja nykyisen HEADin Recipe site -ajon `audit:similarity`-ehdokkaat. Enintään viisi osumaparia. |

Valitse tähän repoon kuuluva PR, joka kohdistuu mainiin. Recipe site -ajon
tunnus on GitHub Actionsin osoitteessa kohdassa `/actions/runs/`. Jos ajossa
ei tehty samankaltaisuustarkistusta, tarvitaan tähän PR:ään kuuluva ajo, joka
sisältää tarkistuksen. Käännösvertailun erä on enintään viisi paria ja
yksittäisen Markdown-lähteen enimmäiskoko on 9 000 tavua. Puuttuvat lähteet
näkyvät rajauksina. Käytä normaalia [kielikatselmointiohjetta](translation-review-policy.md)
havaintojen tarkistamiseen.

Käyttöönotto tarvitsee Reseptit-repon Actions-salaisuuden `CODEX_API_KEY`.
Säilytä käytetty avain sovitussa holvissa. Jos avain kuuluu jaettuun OpenAI
API -projektiin, Actionsin raportti erottaa pilotin ajot, mutta projektin
Usage-näkymä sisältää myös muun käytön. Tarkkaan laskutäsmäytykseen voi
käyttää pilotille omistettua API-projektia.
Ajo käyttää GPT-6.1 Solia High-asetuksella, 8 minuutin
agenttiaikarajaa ja 50 AI Creditsin gh-aw-arviorajaa per ajo.

**Recipavo review pilot costs** kokoaa päivittäin klo 05.23 UTC edelliset
seitsemän täyttä Helsinki-vuorokautta. Yhteenvedossa näkyvät ajokohtaiset arviot,
päiväkohtainen AIC- ja USD-summa sekä puuttuva käyttödata. Raportti käyttää
gh-aw:n käyttöartefakteja ja käynnistyy myös käsin. Käynnistä uusi
katselmointiajo GitHubin Rerun-toiminnon sijaan, jotta kaikki yritykset saavat oman
ajotunnuksen. Vertaa arvioita OpenAI-projektin Usage-näkymään ensimmäisten ajojen
jälkeen. Maksullinen osa on mallin käyttö.

GPT-6.1 Solin tavallisella API-hinnalla 20 000 välimuistittamatonta
syötetokenia ja 2 000 tulostetokenia maksaisi noin 0,06 USD.
50 000 syötetokenia ja 5 000 tulostetokenia maksaisi noin 0,15 USD.
Esimerkit kuvaavat koko ajon tokeneita mahdollisine useine mallikutsuineen.
Ne eivät ole mitattuja ajoja.
[OpenAI API -hinta](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
ja [gh-aw:n kustannuslaskenta](https://github.github.com/gh-aw/reference/cost-management/).

Kun muutat työnkulkua, käännä Markdown gh-aw-versiolla `v1.2.2` komennolla
`gh aw compile recipavo-review --validate` ja sisällytä generoitu
`recipavo-review.lock.yml` samaan PR:ään.
