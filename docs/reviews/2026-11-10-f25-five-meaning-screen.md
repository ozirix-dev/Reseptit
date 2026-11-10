# F25 – viiden lähteen / 15 kieliversion merkitysesikatselmointi (10.11.2026)

Tämä katselmointi koskee [F25 Draft #399](https://github.com/ozirix-dev/Reseptit/pull/399) -erän ensimmäistä viittä lähdettä. FI-lähteenä on [#405:n](https://github.com/ozirix-dev/Reseptit/pull/405) kautta SHA-lukittu **julkinen FI-esitys**, ei kanonisessa raakatekstissä oleva jo korjattu malliohje. FI:n ravinto/GK-lukituksia tai käännösten julkaisurekisteriä ei muuteta.

## Tarkastettujen 15 kieliversion tulokset

1. **uunimuna-avokadot** – Alustava AI-merkitystarkistus: ei havaittua pääaines-/annosmääräristiriitaa. Keto-luokitus korjattu kaikille kielille. Vahvista 200 g kuorettoman munan kokonaan kypsennys (lisävuoka) ja 200 g avokadon syötävä massa ennen julkaisua. Käytetyt EN/SV/TH Git-blob-SHA:t ovat koneellisesti lukittuina [esikatselmointirekisteriin](../../meta/kaannokset/f25-five-semantic-screening.json).

2. **karibia-mango-limejogurtti** – Alustava AI-merkitystarkistus: ei havaittua pääaines-/annosmääräristiriitaa. Mango 200 g, jogurtti 100 g (laskennassa 3,9 %), limemehu 15 g, kookos 20 g; kuiva paahto valinnainen, ei rasvaa. Tuote ja paahdon vaikutus vahvistettava. Käytetyt EN/SV/TH Git-blob-SHA:t ovat koneellisesti lukittuina [esikatselmointirekisteriin](../../meta/kaannokset/f25-five-semantic-screening.json).

3. **lahi-ita-pistaasijogurtti** – Ehdollinen; lähdetarkistus tarvitaan. Ruusuvettä 5 ml ruokalaatuista; laskentasyötteessä jätetty pois yläraja-arviolla. Varmista ettei kyseessä ole sokeroitu ruususiirappi ja että poikkeusraja perusteltu. Käytetyt EN/SV/TH Git-blob-SHA:t ovat koneellisesti lukittuina [esikatselmointirekisteriin](../../meta/kaannokset/f25-five-semantic-screening.json).

4. **valimerellinen-jogurttikulho-hunajalla** – Alustava AI-merkitystarkistus: ei havaittua pääaines-/annosmääräristiriitaa. Hunaja 1 rkl = laskentasyötteessä 20 g, kreikkalainen jogurtti 7 %, saksanpähkinät 30 g ja viikuna 50 g; tarkista tuotteiden ja lusikkamuunnoksen vastaavuus. Käytetyt EN/SV/TH Git-blob-SHA:t ovat koneellisesti lukittuina [esikatselmointirekisteriin](../../meta/kaannokset/f25-five-semantic-screening.json).

5. **korealainen-gyeranbap-riisikulho** – Ehdollinen; lähdetarkistus tarvitaan. 100 g riisiä kuivana; kananmunat paistetaan ilman öljyä, nori 5 g ja soijakastike 1 rkl. Vahvista kuivan tarttumattoman pannun toteutettavuus ja munien yksikköpaino. Käytetyt EN/SV/TH Git-blob-SHA:t ovat koneellisesti lukittuina [esikatselmointirekisteriin](../../meta/kaannokset/f25-five-semantic-screening.json).

Kielikohtainen tarkistus: ruokalajin otsikko ja kuvaus, pääainesosat ja niiden määrät, valmisteiden tilat (raaka/kuiva/kypsä), valinnaiset lisäykset, lämmitys- ja ruokaturvallisuusohjeet, annosmäärä sekä laskentasyötteen neljä makroa. Kaikki 15 ovat edelleen `status: draft`. Huomautukset eivät ole väite natiivipuhujan tekemästä kielenhuollosta tai laboratoriomittauksesta.

## Korjattu oikea metadatavirhe

FI:n `uunimuna-avokadot` sisältää `diet_class: keto`, mutta F25:n EN/SV/TH-tekstien yhteydessä tämä kenttä puuttui. **Lisätty `diet_class: keto` kolmeen Draftiin** muuttamatta ainesosia, annoksia, valmistusohjeita, laskennallisia makroja tai kuvia. Laajennettu 75 kieliversion automaattinen rakennetarkistus vaatimaan jokaisen kielen ruokavalioluokituksen vastaavuutta FI-lähteen kanssa. Kyse ei ole uuden keto-laskennan hyväksymisestä.

## Seuraava portti

- 3 lähdettä / 9 kieliparia: alustava merkitysesikatselmointi tehty, mutta ravintolaskennan lähtötuotteet ja niiden yksikkömuunnokset sekä tarkka semanttinen SHA-evidenssi vaativat vielä hyväksynnän.
- 2 lähdettä / 6 kieliparia: ehdollinen lähde-QA ennen merkityksen lopullista hyväksyntää.
- Koska alkuperäinen 25 lähteen F25-työjono on lukittu `release_authorized:false`, näitä **ei** nosteta automaattisesti julkaistuiksi. 21 SOURCE-HOLD + 4 needs-chef-review -merkintää pysyvät muuttumattomina, ja ensimmäinen julkaisu tehdään vasta hyväksytyillä resepteillä erillisessä main-pohjaisessa release-PR:ssä.

Tämä erä ei koske rinnakkaisia [#400](https://github.com/ozirix-dev/Reseptit/pull/400) uuden reseptin ennakkotarkistuksia tai [#402](https://github.com/ozirix-dev/Reseptit/pull/402) 82 FI-laatuosuman käsittelyä.
