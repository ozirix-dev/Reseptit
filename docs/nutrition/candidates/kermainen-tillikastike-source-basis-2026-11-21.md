# Tillikastikkeen ravintolähteet – Chat 3

Päivä: 2026-11-21. PR #808, tila: DRAFT. Ei vielä laskennan julkaisu- tai toimituksellista hyväksyntää.

Fineli Release 20 **#11152**, laktoositon kermaviili rasvaa 10–12 %, 100 g: saatava hiilihydraatti 4,0 g, kuitu 0 g, polyolit 0 g, proteiini 2,63 g, rasva 12 g. Peilattu [Fineli-rajapinnan tieto](https://ravinto.ptjesse.fi/kermaviili-rasvaa-10-12-vl/). Kyse on elintarvikekeskiarvosta; esimerkiksi Valion 10 % tuotteen koostumus poikkeaa.

Muut ainesosat ovat projektin aikaisemmista lähdelaskelmista: tuore tilli Fineli #369, punnittu laimentamaton sitruunamehu Fineli #11557, sokeri Fineli #1, jodioitu ruokasuola Fineli #30 ja mustapippuri FSANZ AFCD F006618. Kaikki kuusi riviä ovat grammoissa ja kokonaan kastikkeessa, ei syötävän osan poisjättöä eikä kuumennushävikkiä.

Laskennan inputHash: `3c80ddde80a9596d3591b78dd85f970091e5410e6684589de842bd49ca51af4d`.

Paketti `docs/nutrition/calculations/kermainen-tillikastike.json` on lähtöaineisto. `nutrition-model`- ja `verifyNutritionEvidence`-tulokset sekä FI/EN/SV/TH-makrojen versiosidonta on vielä varmistettava. GK:n numeerista arvoa ei johdeta tästä laskennasta.

## Laskennallinen annosarvio

Ainesosien per 100 g -arvot kerrottiin punnituilla massoilla ja jaettiin neljään annokseen. Nettohiilihydraatti **2.89 g**, kokonaishiilihydraatti (sis. kuidun) **3.07 g**, proteiini **1.52 g**, rasva **6.04 g** per annos. Kaikki neljä kieliversiota sisältävät samat arvot. Laskentatiiviiste `3c80ddde80a9596d3591b78dd85f970091e5410e6684589de842bd49ca51af4d` ei muuttunut; FI-lähteen tekstin uusi SHA-256 on `33a53e7d69efbe161d5f1732afbf9157d906aebb5c08981fbca5b7a1ef2d21a3`. `nutrition: pass` koskee rajattua laskennallista Fineli/AFCD-arviota, **ei** koko reseptin julkaisuhyväksyntää. GK jätetään määrittämättömäksi.
