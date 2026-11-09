# Rinnakkainen käännöserä B — 9.11.2026

Omistaja: ChatGPT / tämä keskustelu. Haara: `chatgpt/i18n-parallel-batch-b-20261109`.
Tavoite: 20 erillistä FI-reseptiä × EN/SV/TH = 60 kieliversiota. Tämä on työnjono, ei väite 60 valmiista käännöksestä.

Toisessa keskustelussa tehtävä 20 reseptin erä ei saa koskea alla olevia recipe_id-tunnuksia. Ennen seuraavia kirjoituksia tarkistetaan toisen erän muuttuneet polut ja mahdolliset uudet PR:t; päällekkäisyys pysäyttää kyseisen tiedoston käsittelyn.

| ID | EN | SV | TH |
|---|---|---|---|
| bulgogi | luonnos | luonnos | luonnos |
| bun-cha-hanoi | odottaa | odottaa | odottaa |
| carnitas-salaattitacot | odottaa | odottaa | odottaa |
| chili-con-carne-kukkakaaliriisi | odottaa | odottaa | odottaa |
| falafel | odottaa | odottaa | odottaa |
| harira | odottaa | odottaa | odottaa |
| jerk-kana | odottaa | odottaa | odottaa |
| kana-enchilada-kukkakaalivuoka | odottaa | odottaa | odottaa |
| kana-fajita-pelti | odottaa | odottaa | odottaa |
| kana-yakitori-kaalilla | odottaa | odottaa | odottaa |
| kanakeitto-pinaatti-sitruuna | odottaa | odottaa | odottaa |
| kanapyorykat-tomaattikastike | odottaa | odottaa | odottaa |
| kimchi-jjigae | luonnos | luonnos | luonnos |
| kreikkalainen-kanavuoka-oliiveilla | odottaa | odottaa | odottaa |
| lanttulaatikko-kermainen | odottaa | odottaa | odottaa |
| pho-bo | odottaa | odottaa | odottaa |
| rendang-padang | odottaa | odottaa | odottaa |
| sate-ayam | odottaa | odottaa | odottaa |
| silakkapihvit-tilli-kermakastike | odottaa | odottaa | odottaa |
| uunilohi-voikastike | odottaa | odottaa | odottaa |

## Laatuportit

- P0/P1 merkitysvirheitä ei saa jäädä. Kaikki ainesosat, määrät, yksiköt, ajankäyttö, lämpötilat, annokset ja turvallisuusohjeet peilataan lähteeseen.
- Käännöksen vieraskielinen teksti ei saa muuttaa FI-reseptin ravintolukuja tai GI/GK-tietoja.
- FI-lähteen täsmälliset semanttiset SHA-parit ja V2-katselmointinäyttö kirjataan ennen julkaisua rekisteriin `meta/kaannokset/codex-review-evidence.json`.
- FI-metatiedon `translation_languages` ja `translation_status` päivitetään vasta katselmoinnissa.
- Aja kohdistetut i18n-/schema-/build-testit ja varmista CI HEADille. Ei mergeä eikä deployta pelkän tekstiluonnoksen perusteella.
- Käännösten kontrolli ei ole ihmisen käsin tehtävän tarkistuksen varassa; epävarmat vastineet HOLD.

## Tilanne

Kaksi reseptiä (bulgogi ja kimchi-jjigae), kuusi kielitiedostoa on laadittu ensimmäisiksi luonnoksiksi. Ne eivät vielä ole julkaisuvalmiita: semanttiset katselmointihashit ja automaattiset testit puuttuvat. Loput 18 reseptiä / 54 kielitiedostoa odottavat.
