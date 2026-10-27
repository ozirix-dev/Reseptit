# GI/GK-erän 2B6C – aalto A1

## Portti ja tulos

- Lähtö-HEAD: `b2ac53b11b45b8759d5f841ba978c966a50efe26`.
- Aaltoon hyväksyttiin neljä laskelmaa; viides testattu kandidaattiryhmä ei saanut kerman GI-arvoa, vaan kuohukerma jätettiin pois pienosuustoleranssin mukaisesti vain reseptissä, jossa summa jäi alle 2 g/annos.
- Uusia GI-tietueita: 0.
- Kaikki aiemmat 134 GK-arviota säilyivät. Uusia estymisiä tai fingerprint-eroja ei tullut.
- Kattavuus: 325 reseptiä; 138 laskettua; 187 keskeneräistä; 42 GI-tietuetta.

## Hyväksytyt reseptit

| Resepti | GK/annos | Luokka | Luottamus | Päätöksen peruste |
|---|---:|---|---|---|
| `meksikolainen-aamiais-tacot-mustapavuilla` | 16,04 | MEDIUM | LOW | Maissitortillan julkaistu tutkimus vastaa tuoteryhmää; ruoka-/valmistusavaimet kirjattiin. Avokadon 0,462 g/annos ja aiempi 0,265 g pysyvät näkyvässä kumulatiivisessa poistossa. |
| `meksikolainen-paputostada-aamupalaksi` | 16,04 | MEDIUM | LOW | Sama rajattu lähde ja match kuin toisessa tortillareseptissä; pienosuuksien summa 0,727 g/annos. |
| `meheva-suklaakakku` | 20,31 | HIGH | LOW | Tumma suklaa -keskiarvo (4 ISO-testattua tuotetta, GI 29); maitosuklaa ei läpäise uutta perheguardia. Kaakaojauheen 0,330 g/annos ja aiempi 0,3052 g pysyvät poisjättöinä. |
| `vhh-kaalikaarryleet` | 9,24 | LOW | LOW | Kuohukerman 0,725 g/annos ei saanut perusteetonta GI-arvoa. Kaikkien poisjättöjen summa 1,578025 g/annos, alle nykyisen 2 g rajan. |

## Tiedostomuutokset

- `site/scripts/glycemic-load-model.ts`: tumma suklaa -luokkakeskiarvon tunnistus ja erillinen maitosuklaa-guard.
- `site/tests/glycemic-load.test.ts`: neljän reseptituloksen, pienosuuksien ja maitosuklaa-negatiivisen sidonnan regressiot.
- `docs/nutrition/glycemic-load-pilot-input.json`: kahden maissitortillan lähdeavaimet, tumma suklaa -lähdeavaimet ja läpinäkyvät GI-poistot pienille avokado-/kaakao-/kermamäärille.
- `docs/nutrition/glycemic-load-recipe-bindings.json`: neljän muuttuneen reseptin laskenta- ja evidenssifingerprintit.
- Uudet 2B6C-baseline/current/review/A1-dokumentit.

## Jatkoportin päätös

Ei A2-aaltoa: laajoissa tomaatti-, liemi-, kookosmaito-, tamarindi- ja taateliryhmissä lähde löytyi eri ruoka-aineelle, eri valmistukselle tai muulle kuin yksittäiselle ainesosalle, tai reseptillä oli lisäksi määrittelyesteitä. Näiden käyttäminen kasvattaisi lukua ilman riittävää perustetta. Uudet arvot odottavat riippumatonta katselmointia Draft PR:ssä; yhdistämistä tai tuotantojulkaisua ei tehty.
