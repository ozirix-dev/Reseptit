# kinkkukiusaus – FI/EN/SV/TH luonnoskäännösten esikatselmointi (Chat 3)

- Päivä: 2026-11-21; PR: #785; lähde-HEAD: `a493c38eb355ee72d0f8b83de19bbb01d960f135`.
- Lähdereseptin Git blob: `d41b25d6577a10ab4311d4501cb4fa791d1a302c`; käännösten Git blobit: EN `38a0ec3560d734c335e47267278843d6eb275ffe`, SV `55119ca2cefd283cc840fb57621d2af9441a75d6`, TH `192ab65b892e960b1b891649e74b8ce97e831af5`.
- Tekijä: **Chat 3 / Kokki-3**, ei Codex- tai ihmishyväksyntää. Tilanne: **alustava merkitysvertailu tehty, julkaisu-HOLD voimassa**.
- Kaikissa neljässä: 7 ainesosariviä, 6 annosta, 5 valmistusvaihetta, samat numeeriset ainesmäärät ja yksiköt (g).

## Rivikohtainen ainesosavertailu

| # | FI | EN | SV | TH |
|---|---|---|---|---|
| 1 | pakasteperunasuikaleita (1000 g) | frozen potato strips | frysta potatisstrimlor | มันฝรั่งหั่นเส้นแช่แข็ง |
| 2 | kypsää savukinkkua suikaleina (250 g) | cooked smoked ham, cut into strips | kokt rökt skinka i strimlor | แฮมรมควันสุกหั่นเส้น |
| 3 | sipulia (150 g) | onion | gul lök | หอมหัวใหญ่ |
| 4 | ruokakermaa, rasvaa noin 15 % (400 g) | cooking cream, about 15% fat | matlagningsgrädde, cirka 15 % fett | ครีมสำหรับปรุงอาหารไขมันประมาณ 15% |
| 5 | voita vuoan voiteluun (10 g) | butter for greasing the dish | smör till formen | เนยสำหรับทาถาดอบ |
| 6 | suolaa (4 g) | salt | salt | เกลือ |
| 7 | rouhittua mustapippuria (1 g) | ground black pepper | malen svartpeppar | พริกไทยดำบด |

## Valmistuksen ja turvallisuuden merkitys

- **EN:** Kypsä savukinkku (cooked smoked ham) ja pakastetut perunasuikaleet, 225 °C / 30 min, sitten 200 °C / 35–40 min, vuoka noin 2,5 l, 10 min vetäytyminen ja perunan pehmeys ovat lähteen mukaiset. Maitoallergeeni ja kinkun tuoteselosteen tarkistus säilyvät.
- **SV:** "kokt rökt skinka" tarkoittaa kypsää savukinkkua, "frysta potatisstrimlor" on pakastettu perunasuikale, lämpötilat ja kypsennysjärjestys täsmäävät. "mjölk" allergeenina ja varoitus gluteenittomuusväitteestä säilyvät.
- **TH:** "แฮมรมควันสุก" kuvaa kypsää savukinkkua, "มันฝรั่งหั่นเส้นแช่แข็ง" pakastettuja perunasuikaleita; 225→200 °C, ajat, kylmässä säilyttäminen ja allergeenimerkintä ovat johdonmukaiset.
- **Havainnot:** Ei löydetty P0/P1-sisältöristiriitaa tästä tekstivertailusta. Maku/koostumus ja tarkat tuotteiden ravintoarvot vaativat edelleen lähdeperusteista varmennusta. Ei fyysistä koekeittiötestiä.

## Julkaisuportti

Käännösten virallinen merkitystiivisteisiin sidottu katselmointi `meta/kaannokset/codex-review-evidence.json` -rekisteriin **ei ole kuitattu**. Kun FI-lähde hyväksytään, tee repon edellyttämä Codex-merkitysvertailu, päivitä tiivisteet, tarkista CI ja `docs/reviews/new-recipes/kinkkukiusaus.json` -hyväksyntä. Nykyinen `decision: hold` säilyy.

## Chat-3:n uusi rakenteellinen ja turvallisuustarkistus 22.11.2026

FI/EN/SV/TH: 2,5 litran vuoka korjattu **vähintään 3 litran** uunivuoaksi; jääkaappisäilytys tarkennettu **alle +6 °C**. Tämä on todellinen ohjemuutos, jonka kaikki neljä kieliversiota vastaavat. Ainesosat säilyvät samassa 7 rivin järjestyksessä ja punnitussa massassa; 6 annosta ja 95 min kokonaisaika ennallaan. FI-lähteen uusi SHA-256: `6c7bb9ac4b4e788a36bae0b107f164ad2d9f9e73d8246fd829acd8733120699c`, Git-blob `6b3df798cb703131fbd72c427db5e457365c1a88`.

Chat 3:n aloitteesta tehty tekstuaalinen semantiikkatarkistus: 7/7 ingredient- ja 5/5 valmistusvaiheparia; kriittiset 225 °C / 30 min → 200 °C / 35–40 min, kypsä kinkku, perunan pehmeys, 10 min lepo ja uusi 3 l tilavuus mukana kaikissa EN/SV/TH-versioissa. Merkityksellistä ristiriitaa ei näissä kohdissa havaittu. Ei riippumatonta Codex-/ihmiskatsausta eikä virallista `meta/kaannokset/codex-review-evidence.json`-PASS-merkintää. Virallinen rekisteri saa merkinnät vasta julkaisuprosessin edellyttämässä oikeassa tilassa ja todellisen hyväksynnän perusteella. PR #785 ja neljä kieltä pysyvät Draft/HOLD.
