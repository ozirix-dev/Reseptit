# Repo Guard: rajattu, ennakkoon valtuutettu integraatiojono (Chat-1, 22.11.2026)

**Tila:** suunnitelma ja hyväksymistestien sopimus; EI käytössä. **Omistaja:** Chat-1. Repo Guardin varsinainen palvelin sijaitsee käyttäjän Windows-koneella `D:\MCP\repo-guard-mcp`, ei tässä repossa. Tätä dokumenttia ei saa tulkita käyttöönottoluvaksi eikä korvata Windows-vahvistusta suoraan GitHub-merge-kutsulla.

## Tavoite

Mahdollista käyttäjän nukkuessa vain **ennalta rajattujen, nimenomaisesti hyväksyttyjen** PR:ien yhdistäminen ilman jokaisen PR:n erillistä Windows-ponnahdusikkunaa. Älä avaa yleistä kirjoitusoikeutta, älä muuta nykyisten `pr_ready` / `pr_merge` -komentojen käyttäytymistä. Ensimmäinen käyttöönotto: **dry-run**, ei automaattisia yhdistämisiä.

## Turvamalli

1. Erillinen paikallinen `authorized_queue`-toiminto; nykyinen interaktiivinen polku säilyy. Oletusarvo DISABLED, ja kaikki tuntemattomat kentät tai puuttuva konfiguraatio -> STOP.
2. Käyttäjä hyväksyy **kerran paikallisesti** lyhytaikaisen, enintään 60 minuutin erän, jossa jokainen sallittu PR on yksilöity numeroilla, repo-identiteetillä, täsmällisellä 40-merkkisellä HEAD-SHA:lla, odotetulla base-SHA:lla ja hyväksytyllä muutostyypillä. Hyväksyntää ei saa antaa ChatGPT:n tekstistä, GitHub-PR-kuvauksesta tai PR:n omasta tiedostosta.
3. Valtuutus tallennetaan koneelle käyttöoikeusrajattuun, allekirjoitettuun tai eheydeltään suojattuun paikalliseen tietueeseen. Kertakäyttöisyys ja vanheneminen tarkistetaan ennen jokaista toimintoa. Valtuutuksen laatiminen ei ole etätyökalun sallittu toiminto.
4. Vain **Ready**, ei Draft; vain sama repo, `main`-kohde, ei forkkeja; GitHubin branch protection, review-vaatimukset ja täsmä-HEADin kaikki pakolliset check-run-tilat PASS. Ei ohituksia admin-oikeudella.
5. Jokaiselle PR:lle ennen mergeä: hae GitHubista tuore PR, main SHA, katselmoinnit, ratkaisemattomat review-keskustelut, muutoslista, release-gatet sekä CI. Jos SHA, base, tiedostot, katselmointitila tai tarkistukset poikkeavat hyväksytystä, STOP. Päähaaran edettyä edellisen mergen vuoksi vaadi uusi preflight ja tarvittaessa uusi erävaltuutus; ei automaattista rebasea.
6. Julkaisu- ja sisältöportit ovat erillisiä. `decision: hold`, karanteeni, kuva-/käännös-/ravinto-/GK-sinetin puute tai tietoturva-/credential-/workflow-muutos -> STOP. Numerotonta ravintoa voi käyttää vain, jos reseptikohtainen hyväksyntä sen sallii.
7. Vain **merge commit** Repo Guardin nykyisellä GitHub-identiteetillä; ei branch-deleteä, force-pushia, GitHubin asetusten muutosta eikä Cloudflare-deployta.
8. Yksi työntekijä kerrallaan: prosessilukko ja GitHubin SHA-ehdollinen merge. Merkitse valtuutus käytetyksi atomisesti, jotta uudelleenkäynnistys tai aikakatkaisu ei voi tehdä samaa toimenpidettä kahdesti. Epäselvä vastaus -> tarkista GitHubin tila, älä sokkona yritä uudelleen.
9. Kirjaa auditointiin valtuutuksen tunniste (ei salaisuutta), PR, ennen/jälkeen-SHA, CI-run-ID:t, päätös, merge-SHA, aikaleima ja STOP-syy. Auditoinnin epäonnistuminen -> STOP ennen kirjoitusta.
10. Hätäkatkaisu: paikallinen disable + keskeytys; ei uusia mergejä. Ei mitään fallbackia suoraan GitHub-liittimen merge-toimintoon.

## Ehdotettu käyttöönotto

**Vaihe A:** lue paikallisen Repo Guardin `server.py`, `configure_writes.py`, CLI ja testit sekä nykyinen 45 sekunnin consent-polku. Tee varmuuskopio ja nykytestien lähtötilanne. Tämä vaatii Windows-koneen tiedostojen muokkausoikeuden; GitHub-PR ei sitä yksin tarjoa.

**Vaihe B:** toteuta paikalliseen Repo Guardiin erillinen fail-closed `queue_preflight` + `queue_execute` sekä valtuutuksen myöntämisen paikallinen käyttäjätoiminto. Ei muutosta olemassa olevaan `pr_merge`-polkuun.

**Vaihe C:** testit: puuttuva/vanhentunut/virheellinen valtuutus, väärä repo/PR/SHA/base, Draft, HOLD, failed/pending CI, muuttunut review, avoin review thread, muutettu workflow/credential, kilpaileva merge, toistettu viesti, epäselvä verkko, auditointivika, koneen restart ja kill switch. Kaikissa 0 kirjoitusta.

**Vaihe D:** read-only shadow-mode vähintään yksi täysi integraatiokierros, raportoi preflightit; vasta erillisellä paikallisella käyttöönottohyväksynnällä rajattu pilotti yhdelle dokumentti-PR:lle. Ei reseptien julkaisua pilotissa.

## Nykyinen jono

- #855: dokumentti-PR, CI PASS, mutta Draft. Sopii myöhemmän pilotin ehdokkaaksi **vain** jos se on hyväksytty Readyksi ja paikallinen erävaltuutus on olemassa.
- #785–789: Draft/HOLD; **eivät** kuulu automaattiseen yhdistämisjonoon.
- #826: suojattu GK-malli, tarkoituksellinen CI FAIL; **ei** kuulu jonoon.

## Hyväksymiskriteeri

Kaikki negatiiviset testit PASS, nykyiset Repo Guard -testit PASS, shadow-mode ei tee yhtään kirjoitusta, pilotissa vain täsmälleen valtuutettu PR yhdistyy ja jälkitarkistus vahvistaa GitHubin merge-SHA:n sekä mainin CI:n. Muussa tapauksessa ominaisuus pysyy DISABLED.
