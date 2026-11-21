# Rapeat cheddarjuustonaksut – FI/EN/SV/TH-julkaisukatselmointi

**21.11.2026 · kolmesta jo olemassa olevasta Draft-käännöksestä julkaistut versiot · ChatGPT-tehty semanttinen vertailu (ei Codex-katselmointiväite)**

## Lähtötilan sidonta ja katselmoija

- FI-lähde: `reseptit/valipalat/rapeat-juustonaksut.md`, Git-blob `af69aab954bf3ed06e3eb5294d51954679a940ef` (jo julkaistu resepti, ei muuteta).
- EN/SV/TH: PR #773:n testaamat valmiit Draft-tekstit; muutettiin vain kunkin `status: draft` → `status: published`. Kaikkien kolmen muun kuin status-kentän semanttinen sisältö pysyi samana. Muutos ei ole uusi resepti.
- **Katselmoinnin suoritti ChatGPT tässä käyttäjän erillisellä “Toteuta”-pyynnöllä valtuuttamassa keskustelussa.** Tämä ei ole väite Codex-sovelluksen, ulkopuolisen ihmisen tai fyysisen koekeittiön tekemästä tarkistuksesta. Repon historiallisesti nimetty `meta/kaannokset/codex-review-evidence.json` on tekninen semanttisten SHA-todisteiden rekisteri; tässä `reference` osoittaa avoimesti tarkistajan ja rajauksen.
- Rinnakkaisen PR #771:n thai-pääruoka, sen työhaara ja rekisterin mahdollinen myöhempi omistajuus säilyvät erillisinä. Tämän PR:n lähtömain: `06dc9815b26286e04cf8764127b1b47485fc8f23`. Ennen integraatiota tarkistettava tuore main ja CI.

## Kielikohtainen merkitysauditointi

Kävin läpi suomenkielisen lähdetekstin ja kunkin käännöksen otsikon, ainesosat järjestyksessä, neljä valmistusvaihetta, huomautukset, alt-tekstin ja metatiedot; thain ohjeen tarkistukseen sisältyi merkityksen palauttaminen suomeksi. **Avoimia olennaisia P0/P1-virheitä: 0.** Ei muutoksia luonnosten varsinaiseen tekstiin.

| Kenttä | FI-lähde | EN / SV / TH |
| --- | --- | --- |
| Juuston tyyppi ja massa | Cheddarraaste, noin 34 % rasvaa, 140 g | Cheddar cheese / cheddarost / ชีสเชดดาร์, kaikki 140 g ja noin 34 % |
| Mauste | Savupaprikajauhe, 1 g | Smoked paprika powder / rökt paprikapulver / ผงปาปริก้ารมควัน, kaikki 1 g |
| Kuumennus | Uuni 200 °C, ylä- ja alalämpö, leivinpaperi | Kaikissa 200 °C, ylä- ja alalämpö sekä parchment/bakplåtspapper/กระดาษรองอบ |
| Jakaminen ja paisto | 12 yhtä suurta matalaa kekoa; keskitasolla 6–9 min, kunnes kuplii ja reunat kultaiset | Kaikissa 12 matalaa kasaa, keskitaso, 6–9 min ja samat tunnusmerkit; ohut reuna ruskistuu nopeasti |
| Jäähtyminen / annos | Pellillä vähintään 5 min; 3 lastua/annos, 4 annosta | Kaikissa 5 min vähimmäisaika, 3 lastua/annos ja 4 annosta |
| Allergeeni | Maito | milk / mjölk / นม, ei lisättyjä allergeeniväitteitä |
| Ravintoarvot per annos | Netto-HH 0,04; koko-HH 0,04; proteiini 8,97; rasva 12,04 g | Täsmälleen samat neljä frontmatter-lukua, eivät mittaustuloksia |
| Mallivaraumat | Cheddarin koko rasva mukana, leivinpaperille jäävä vähentää; 0,25 g savupaprikaa/annos pois laskennasta, koska POLYL ei ilmoitettu | Kaikissa samat rasva- ja polyolirajaukset, ei väitettä `POLYL=0` |
| GK ja kuva | GK: ei määritetty; kolmea lastua näyttävä kuvituskuva | Kaikissa nimenomainen ei-numeroitu GL ja kuva ilmoitettu kuvitukseksi |

### Thain merkityksen palautus suomeksi

- ขั้นตอน 1: lämmitä uuni 200 °C ylä-/alalämmöllä ja vuoraa pelti leivinpaperilla.
- ขั้นตอน 2: jaa 140 g juustoraaste 12 samankokoiseksi matalaksi kasaksi, jätä leviämisvara ja ripottele 1 g savupaprikajauhetta.
- ขั้นตอน 3: paista keskitasolla 6–9 min, kunnes juusto kuplii ja reunat ovat kullankeltaisia; valvo nopeasti ruskistuvia reunoja.
- ขั้นตอน 4: anna jäähtyä pellillä vähintään 5 min, siirrä varovasti paperilta, tarjoa 3 lastua/annos.
- หมายเหตุ: maitoallergeeni; 0,04 g cheddarin netto-HH/annos laskennallinen; rasvahävikki mahdollinen; 0,25 g savupaprikaa/annos jätetty pois, koska polyoleja ei ilmoitettu; GK ei määritetty; kuva havainnekuva.

## Tarkat semanttiset SHA-256-tiivisteet

Projektin `site/scripts/translation-semantic-review.ts`-määritelmän mukaan: JSON-skeeman kenttäjärjestys, normalisoitu Markdown, ei status-/julkaisumetatietojen vaikutusta semanttiseen hash-arvoon. SHA-256-algoritmi varmistettiin tunnetulla `abc`-testivektorilla ja nykyisen fetavaahdon hyväksytyllä FI-tiivisteellä (`239ef9ca…`).

| Kieli | `source_hash` | `translation_hash` |
| --- | --- | --- |
| EN | `0b57f0d1f9b437c7d6ca14e04d8d4f6772f762fd0269dd742cf4f8711d98e4ac` | `76cf3ca5267535d7214d7cf0150a6feb9b99029d31079a953b5e69412b665b87` |
| SV | `0b57f0d1f9b437c7d6ca14e04d8d4f6772f762fd0269dd742cf4f8711d98e4ac` | `eaa6c1123d8548b0892b737109e92b9e46cb50d1ed5aa69f309a1f50a32eceaa` |
| TH | `0b57f0d1f9b437c7d6ca14e04d8d4f6772f762fd0269dd742cf4f8711d98e4ac` | `06fc67dbfbc7496f7f78f82d7043c758f6131ede9b2cd5f1b74268458153a70a` |

**Päätös tästä vertailevasta AI-katselmoinnista:** `outcome: pass`, `findings: []`, ei materiaalista ihmistarkistusta vaativaa epäselvyyttä. Käyttöönoton erilliset julkaisuportit säilyvät: muuttuneen sisällön auditointi, käännösrekisterin täsmä-SHA, kuvien ja ravintomallin eheys, PR:n CI, Repo Guard -yhdistäminen, uuden mainin CI sekä erikseen hyväksyttävä Cloudflare-tuotantodeploy. **Main-merge ei tarkoita Cloudflare-tuotannon julkaisua.**

Seurantakohde: [Issue #333](https://github.com/ozirix-dev/Reseptit/issues/333). FI-reseptin GK ja neljä makroarvoa säilyvät ennallaan.
