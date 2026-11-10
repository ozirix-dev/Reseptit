# F25 – 30 uutta kieliluonnosta yhdellä commitilla (10.11.2026)

[Erän PR #399](https://github.com/ozirix-dev/Reseptit/pull/399). Tässä on **10 FI-reseptiä × EN/SV/TH = 30 uutta Draftia**, aiemman 6 rinnalla. Yhteensä **36/75 Draft-kieltä (12/25 FI-lähdettä)**. Kaikki ovat `status: draft` eikä mitään julkaista.

## 10 FI-lähdettä

- `karibia-mango-limejogurtti`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `japanilainen-hojicha-jogurtti-persimonilla`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `lahi-ita-pistaasijogurtti`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `vietnamilainen-kahvijogurtti-banaanilla`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `valimerellinen-jogurttikulho-hunajalla`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `kiinalainen-soijamaito-aamiaisella`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `korealainen-gyeranbap-riisikulho`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `lahi-ita-zaatar-munat`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 2 annosta, 25 minuuttia.
- `rahka-marjakerroskulho`: EN, SV, TH; FI-aineosamäärät ja neljä makroa lähetetään kieliin ilman arvojen muuntamista. 4 annosta, 10 minuuttia; kylmävalmistus.
- `munakoiso-kesakurpitsalasagne`: EN/SV/TH, 4 annosta, 110 minuuttia, 15 punnittua raaka-ainetta + 15 selittävää note-kenttää jokaisessa kielessä. Tarkat 200/225/180 °C uuniasetukset, 20–25 + 45 + 15 minuutin vaiheet, oliiviöljyn 50+5+5 g ja tomaattikastikkeen 650+150 g jako säilyvät. Neljä makroa ja GK puuttuvat FI-lähteestä, joten niitä **ei keksitä** kieliversioihin.

## Lähtölaatu ja julkaisuesteet

Kahdeksan aamiaisen väärät yleisohjeet korjattiin **erilliseen FI-kokkikorjaus-PR:ään [#401](https://github.com/ozirix-dev/Reseptit/pull/401)**. Lisäksi rahka-marjakerroskulhon julkinen valmistustapa korjataan siinä kylmävalmistukseksi. Käännökset vastaavat korjattuja ruokalajikohtaisia ohjeita; niiden julkaisu odottaa #401:n CI:tä ja lopullista main-deployta.

- Hojichan 2 g kuivaa teetä tarkoittaa koko syötäväksi jauhettua määrää, ei pois heitettyä hauduketta.
- Kahvijogurtin 200 ml kahvia ja 100 g jogurttia tekee juotavan notkean koostumuksen; 1 banaanin syötävä paino on vielä katselmoitava.
- Soijajuoman juoksettuminen ei ole taattua; riippuu tuotteen koostumuksesta. Gyeranbapiin ei lisätä listan ulkopuolista seesamiöljyä.
- Rahkan 4 annosta ja 4 makroa säilyvät; lasagnen ravinto/GK on edelleen HOLD.

Erän automatisoitu `site/scripts/f25-draft-structural-check.mjs` vertaa kaikki olemassa olevat EN/SV/TH-Draftit FI-lähteeseen: annokset, ainemäärät, lokalisoidut yksiköt, note-kentän säilyminen, kokonaisaika, kuvat, makrot ja valmistusvaiheiden lukumäärä. Läpäisy **ei** ole itsenäistä natiivikielikatselmointia, ravintolaskennan uusintatarkistusta eikä GI/GK-hyväksyntää.

**STOP:** Kaikkien 25 alkuperäisen lähteen `release_authorized: false`; 21 SOURCE-HOLDia ja 4 kokkikatselmointijonoa säilyvät, kunnes yksilölliset ravinto-/punnitus-/kielipäätökset valmistuvat. Ei `published-translation-pairs.json`-rekisteriä eikä hyväksymis-evidenssiä muutettu.
