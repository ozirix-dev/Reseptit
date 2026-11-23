# Chat-4 – kahdeksan alkuruoan käännösyksiköiden korjaus (22.11.2026)

Työn omistaja: Chat 4
Alkuperäisen erän PR: https://github.com/ozirix-dev/Reseptit/pull/805
Lähtö-main: `26f2cf6f2c527ec94e36d0abdac5773a2ee57cde`

## Rajaus

- Kahdeksan mainissa jo julkaistun FI-alkuruoan 24 EN/SV/TH-käännöstiedostoa; **kaikkien käännösten status pysyy `draft`**.
- Ainesosien suomalainen `tl` on käännetty kohdekielen muotoon: `tsp` (EN), `tsk` (SV), `ช้อนชา` (TH).
- Ainesosien `kpl` on käännetty `pcs` (EN), `st` (SV), `ชิ้น` (TH). Lukumäärät ja ainesosien järjestys eivät muutu; thain `ชิ้น` on yleinen kappaleyksikkö, mutta lopullinen idiomatiikka (esimerkiksi muna `ฟอง`) vaatii yhä kohdekielisen tarkastuksen.
- Yhteensä 39 yksikkömerkinnän lokalisointia. Kaikki annokset, massat, tilavuudet, työvaiheet, lämpötilat, turvallisuuslauseet ja kuvatiedot säilyvät muutoksessa.
- `site/tests/chat4-finnish-starters-drafts.test.ts` vertaa nyt yksiköiden **merkitystä**, ei suomenkielisen yksikkölyhenteen kirjoitusasua; lisätty uusi kohdekielen yksiköitä vaativa regressiotesti.
- Kaksi FI-raakakalaluonnosta ja niiden kuusi käännöstä eivät kuulu tähän rajattuun korjaukseen.
- Virallisia merkitystiivisteiden hyväksyntöjä ei luoda ilman kohdekielen ja turvallisuussisällön hyväksyntää. Ei `published`-tilan, koekeittiö- eikä Cloudflare-muutosta.

## Jatkoportti

Tämä rajattu korjaus tekee käännösluonnosten ainesosalistoista luontevampia, mutta se ei yksin vahvista täyttä semanttista vastaavuutta eikä julkaisuvalmiutta. Julkaisutyö jatkuu erillisellä lähde- ja käännöshasheihin sidotulla katselmoinnilla.
