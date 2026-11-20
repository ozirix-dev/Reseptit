# Repo Guard: ChatGPT-kirjoitusyhteyden koekäyttö

Tämä ohje kuvaa rajatun, auditoitavan kokeen, jolla varmennetaan ChatGPT:n MCP-yhteyden **kirjoitusoperaatioiden** toiminta paikalliseen Repo Guardiin. Ohje ei ole yleinen julkaisu- tai yhdistämislupa.

## Lähtötilanne

- Tarkista ensin Repo Guardin `repo_guard_check`-identiteetti: odotettu kohde on `ozirix-dev/reseptit`, oikea `origin` ja `main`.
- Lue PR:n tila ja ajantasaiset HEAD- sekä base-SHA:t. Tarkista PR:n muutokset, katselmointi, CI ja mahdolliset esteet.
- Älä valitse kokeeseen vanhaa tai ristiriitaista Draft-PR:ää vain siksi, että kirjoitustoiminto halutaan testata.
- Käytä kokeeseen omaa, rajattua ja katselmoitua PR:ää. Jos ehdot eivät täyty, jätä PR Draftiksi ja kirjaa HOLD.

## Kirjoitustesti (Ready)

1. Varmista, että PR:n HEAD ja base vastaavat juuri tarkistettuja SHA-arvoja ja että Repo Guardin ennakkotarkistuksen vaatimukset täyttyvät.
2. Kutsu **vain** Repo Guardin `pr_ready`-työkalua täsmällisillä projektilla, PR-numerolla, HEAD-SHA:lla ja base-SHA:lla. Älä ohita Repo Guardia GitHubin suoralla kirjoituskomennolla.
3. Repo Guardin paikallisen Windows-hyväksyntäikkunan pitää näyttää juuri aiottu toimenpide. Käyttäjä voi hyväksyä tai hylätä sen; hyväksyntää ei saa olettaa.
4. Lue operaation vastaus ja tarkista GitHubin todellinen PR-tila `operation_status`- tai `pull_request_status`-työkalulla. Pelkkä ikkunan näkyminen tai painallus ei todista onnistumista.

## Rajat

- **Ready ei ole merge.** Yhdistäminen on oma erillinen porttinsa, joka vaatii tuoreen tarkistuksen, täsmä-SHA:t ja uuden paikallisen hyväksynnän.
- **Merge ei ole deploy.** Cloudflare-tuotantojulkaisua ei käynnistetä tämän kokeen osana.
- Älä muuta reseptejä, ravintoarvoja, GK/F25-hyväksyntöjä, kuvia tai julkaisuasetuksia kirjoitusyhteyden testin takia.
- Jos CI, katselmointi, PR:n omistajuus, SHA tai Windows-hyväksyntä jää epäselväksi, tulos on **HOLD**. Kirjaa onnistuneet lukutarkistukset erikseen kirjoituskokeesta.

## Todisteet ja valmistumiskriteeri

Kirjaa kokeen PR-numero ja pysyvä linkki, vahvistetut HEAD/base-SHA:t, Repo Guardin ennakkotarkistus, paikallisen hyväksynnän tulos, operaation vastaus ja GitHubin jälkitila. **Kirjoituskoe on valmis vasta**, kun Repo Guardin kautta hyväksytty Ready-siirtymä näkyy todistetusti GitHubissa. Hylätty/umpeutunut hyväksyntä tai epäonnistunut siirtymä on turvallinen testitulos, mutta ei onnistunut kirjoituskoe.
