# Chat-4 – 8 FI-alkuruoan ja 24 käännösluonnoksen nykytila- ja hyväksyntäinventaario

Päiväys 22.11.2026. Työn omistaja: Chat 4. Lähtö-main `5748dd1ce0ba5b907b3cfcc5c7145520b7225325`.

## Kohde ja näyttö

Kahdeksan jo julkaistun FI-alkuruoan sekä niiden 24 EN/SV/TH-käännösluonnoksen Git-blobien SHA-1:t on talletettu koneellisesti tarkistettavaan `chat4-eight-starters-translation-snapshot.json`-tiedostoon. Tämä on **tiedostoversioiden inventaario**, ei julkaisukelpoinen `codex-review-evidence.json`-hyväksyntä. Git SHA-1 -tunniste on eri asia kuin sisällön SHA-256-katselmointitiiviste.

Nykytilan odotus on FI `published`, jokainen EN/SV/TH `draft`. Mukana on 32 tiedostoa, ei raakakalojen graavisiian tai muikunmädin reseptejä. Erillinen testi `site/tests/chat4-eight-starters-translation-snapshot.test.ts` vahvistaa lukumäärän, nykyisen blobin ja Draft/Published-rajauksen sekä sen, ettei tämä inventaario anna julkaisuhyväksyntää.

## Aiemmat katselmoinnit

- `docs/reviews/new-recipes/chat4-eight-appetizers-semantic-review-2026-11-21.md`: Chat-4:n rajattu toimituksellinen tekstivertailu.
- `site/tests/chat4-alkuruoat-translation-safety.test.ts`: riskisisältöjen regressiot.
- Tiedostojen kuva- ja yksikköhuomautuksia on korjattu erillisissä aiemmissa PR:issä.

## Avoimet hyväksynnät

1. Jokaisen nykyisen käännöksen riippumaton semanttinen lopputarkistus nykyiseen FI-lähteeseen; aiemman raportin vanhoja Git-blobeja ei saa tulkita nykyisen version hyväksynnäksi.
2. Vaatimusten mukaiset kanoniset lähde- ja käännöstiivisteet sekä todellinen arvion hyväksyntämerkintä viralliseen rekisteriin – vain aidosti tehdyn tarkistuksen perusteella.
3. Reseptikohtaiset viimeiset julkaisu-, kuva- ja tarvittaessa ravintoarvo-/GK-portit.

**Ei** muutoksia varsinaisiin resepteihin, turvallisuusohjeisiin, käännösten statuksiin eikä Cloudflareen. Tämä tekninen inventaario voidaan yhdistää itsenäisesti, mutta se ei julkaise käännöksiä. Chat-1 vastaa Ready/merge-prosessista.
