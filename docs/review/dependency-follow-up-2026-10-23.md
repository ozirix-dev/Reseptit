# Riippuvuuspäivitysten jatkosuunnitelma

Tarkistettu 23.10.2026. Tämä suunnitelma ei päivitä riippuvuuksia.
CI-tulokset koskevat Dependabot-haarojen omia 20.10.2026 committeja,
eivät nykyistä mainia tai katselmointikorjausten yhdistämisen jälkeistä tilaa.

| PR | Riippuvuus | Nykyinen → ehdotettu | Todettu CI | Riski ja tarvittava jatkotesti |
| --- | --- | --- | --- | --- |
| [#6](https://github.com/ozirix-dev/Reseptit/pull/6) | upload-pages-artifact | v3 → v5 | Build PASS, deploy SKIPPED | Major-päivitys: tarkista actionin runtime, artifactin rakenne ja yhteensopivuus deploy-actionin kanssa; PR-build ei testaa julkaisuvaihetta. |
| [#7](https://github.com/ozirix-dev/Reseptit/pull/7) | deploy-pages | v4 → v5 | Build PASS, deploy SKIPPED | Tarkista artifactin kulutus, Pages-oikeudet ja OIDC; varsinainen julkaisutesti vaatii erillisen julkaisupäätöksen. |
| [#8](https://github.com/ozirix-dev/Reseptit/pull/8) | configure-pages | v5 → v6 | Build PASS, deploy SKIPPED | Tarkista olemassa olevan Pages-sivuston asetukset sekä runtime; säilytä tämän korjaushaaran enablement-poisto. |
| [#9](https://github.com/ozirix-dev/Reseptit/pull/9) | marked | 17.0.6 → 18.1.1 | Build PASS | Parserin major: Markdown-turvallisuus, ohjevaiheet, JSON-LD, staattinen HTML sekä kaikkien kielten build. |
| [#10](https://github.com/ozirix-dev/Reseptit/pull/10) | TypeScript | 5.9.3 → 7.0.2 | Build FAIL | Vanha baseUrl ja suhteeton paths-polku aiheuttavat TS5102/TS5090. Korjaushaara poistaa baseUrlin ja käyttää ./src/*; päivitä PR:n pohja vasta korjauksen yhdistämisen jälkeen ja aja sen oma CI. |
| [#11](https://github.com/ozirix-dev/Reseptit/pull/11) | @types/node | 25.9.9 → 26.6.5 | Build PASS | Varmista tyyppien sopivuus Node 22 -runtimeen ja ettei koodi ala käyttää vain Node 26:ssa olevia API-kutsuja; typecheck, build ja kaikki skriptitestit. |

Nykyiset npm-versiot tarkoittavat lukitustiedoston ratkaistuja versioita.
Kaikki kuusi PR:ää pitää tarkistaa ajantasaista mainia vasten erikseen.
TypeScript 7:n eristetty paikallinen typecheck ei tee PR #10:n vanhasta
epäonnistuneesta CI:stä hyväksyttyä.
