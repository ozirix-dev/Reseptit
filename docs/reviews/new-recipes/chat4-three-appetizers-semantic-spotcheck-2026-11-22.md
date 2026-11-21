# Chat-4 – kolmen alkuruoan käännösten rajattu merkityskatselmointi

Päiväys: 2026-11-22
Työn omistaja: Chat 4
Lähtö-main: `754700d532b9b4fabd005a6a311ac700627811ee`

## Rajaus

Verrattu alla mainitut julkaistut FI-lähteet ja niiden EN/SV/TH-Draftit lähdetiedostojen sisältöön, ainesosien nimiin ja määriin, valmistuksen järjestykseen, lämpötiloihin, aikoihin, negatiivisiin turvallisuusohjeisiin ja kuvan merkitykseen. Tämä on ChatGPT Chat-4:n tekstikatselmointi, ei Codexin työkalulla ajettu virallinen semanttinen SHA-hyväksyntä eikä ihmiskatselmointi. Kaikki yhdeksän käännöstä säilyvät `draft`.

| Recipe ID | FI-blob | EN-blob | SV-blob | TH-blob | Tekstihavainto |
| --- | --- | --- | --- | --- | --- |
| `uunissa-paistetut-silakkarullat` | `d27baffed5d9ca129377c5e598a198df0c5650ba` | `dd57125d5755d5efe07d12d119a5459292c655f8` | `3cbf49c4a350cd95ba076d877923df2bfb0b4b29` | `8a84ff0b5c0c28de8fe43c97ee7d25981e3e1e8a` | 600 g silakkaa, 200 °C ja 35–40 min yhtäpitävät. TH kuohukerma täsmennettävä nestemäiseksi. |
| `savupororullat-kantarelleilla` | `0e99872fe4018e049772642a529f0b1b3cc2888f` | `27328dcb685c0b8fa8b0042df414b1e87bfc1184` | `36de849c4b5b6d75590e410bf204e00f84a24ada` | `0dbbffba5b1b707b5e754bca8ee829ffbbe77827` | Kypsä syöntivalmis savuporo, tunnistetut ja kypsennetyt kantarellit, jäähdytys ja kylmäsäilytys vastaavat FI-lähdettä. |
| `pienet-kantarellipiiraat` | `8f7fe67b9b75c6194672d1c2c7c71118e7be2920` | `abd4499d5892331a50d55cf94c7e7a1059fefb78` | `da57dad7f87f56f64be22f4fa1b945c2f27c1022` | `8a1030b4e5b43671a5c6f36c5d4d586cebfbd786` | 8 piirasta, 200 °C, esipaisto 8 min, loppupaisto 18–22 min, täytteen hyytyminen ja 75 min kokonaisaika vastaavat FI-lähdettä. |

## Korjaus

Thain silakkarullien ainesosa `kuohukermaa` oli `วิปปิงครีมชนิดไขมันสูง` (runsasrasvainen vispikerma), mikä ei yksiselitteisesti täsmennä olomuotoa. Ainesosa on nyt `วิปปิงครีมชนิดเหลว (ยังไม่ตี)` (nestemäinen, vaahdottamaton kuohukerma), ja ohjeen vaiheessa 3 kaadetaan nimenomaan nestemäinen vaahdottamaton kerma vuokaan. Grammoja, tilavuutta tai kypsennysaikaa ei muuteta.

## Tuloksen rajaus

- **Noin yhdeksän kieliparin paikallinen tekstivertailu tehty; yksi täsmennys korjattu.**
- Edellä olevat blobit tarkoittavat katselmoinnin lähtöversiota, ennen TH-tekstin korjausta; lopullinen SHA-sidottu käännösrekisterin hyväksyntä on tehtävä korjatun version mukaan.
- Rekisteriin `meta/kaannokset/codex-review-evidence.json` ei kirjoiteta tekaistua Codex-arviointia.
- Tuotannon FI-tiedostot, kuvat, numeeriset ravintoarvot, GK ja 24 käännöksen julkaisutilat eivät muutu. Riskiruokalajien graavisiian ja muikunmädin luonnokset säilyvät.
