# laskeGK 50 — seitsemäs ChatGPT-tutkimuserä

**Tila:** RESEARCH HANDOFF / vain tutkimus, ei GK-julkaisuhyväksyntää  
**Päivä:** 18.11.2026 (Europe/Helsinki)  
**Lähtöpiste:** Reseptit `main`, `e8ed43ed525a9cb6abbe61b94bc1c036153979c7`  
**Rinnakkainen omistaja:** Codex, Reseptit [PR #706](https://github.com/ozirix-dev/Reseptit/pull/706)  
**Aiemmat ChatGPT-erät:** [#709](https://github.com/ozirix-dev/Reseptit/pull/709)–[#714](https://github.com/ozirix-dev/Reseptit/pull/714), yhteensä 130 muuta alkuperäisreseptiä.

## Valinta ja todellinen tulos

Ensin vertailtiin nykyisen mainin 303 laskentasyötteen resepti-ID:t kuuden aiemman ChatGPT-tutkimusraportin 130 eri resepti-ID:hen ja Codexin #706-työhaaran `gk-reviewed-portions.json`-avaimiin. Näin löytyi 121 uutta tutkimusehdokasta. Niistä rajattiin vielä pois vanhassa `gk80-operation146/recipe-audits.json`-erässä jo käsitellyt, vanhan `glycemic-coverage-batch-2b6e-baseline.json`-tilannekuvan CALCULATED-rivit sekä tunnetut karanteenit. Jäljelle jäi 52 ehdokasta. Lopulliseen 50:een valittiin vain sellaiset, joilla löytyi nykyisestä mainista **sekä julkaistu FI-alkuperäisresepti että laskentasyöte**; esimerkiksi pelkän laskentasyötteen sisältävä `vhh-kaalilaatikko` ei kelvannut alkuperäisreseptiksi.

Tämä on rajattu **uuden, päällekkäisyyksiä välttävän lähde- ja annostiedon tutkimus**, ei 50 hyväksyttyä GK-laskelmaa. Kaikkien 50 FI-reseptin `status: published` tarkistettiin; kaikki 50 laskentasyötettä luettiin. **45 reseptillä on nykyisessä FI-reseptissä numeerinen `carbs_net_per_serving_g`, viidellä ei.** Repon syötteiden `reviewerStatus` on tässä joukossa `AUTOMATED ONLY`. Uusia hyväksyttyjä numeerisia GK-arvoja **0**, sanallisia GK-luokkia **0** ja julkaistuja ravintokorjauksia **0**.

Ainesosien määrät, `gramsPerUnit`-muunnokset, `per100g.carbohydrate`, syötävät osuudet, retention ja annosmäärän sisältävä yksinkertainen vertailusumma vastasi sellaisenaan **34/45** nykyistä julkista HH-lukua 0,01 g:n tarkkuudella. Muissa **11/45** tapauksessa tämä yksinkertainen summakaava ei ole oikea lopullinen laskuri: kuudessa on nimenomaisesti rajattuja mauste-/ainesosa-omissioita (caponata, menemen, munatacot, ratatouille, shakshuka, täytetyt paprikat), kolmessa on vähennettävä erytritolin polyolit (moo-ping, som tam, Runebergintortut) ja kaksi käyttää erikoistarkistettua `scopedPolyolC`- tai `recoveryC`-laskentaa (jauheliha-kaalikeitto, uunikanapasta). **Nämä 11 eivät ole tämän tarkistuksen perusteella laskentavirheitä.** Virallinen lähde-, retentio-, polyoli-, toleranssi- ja hyväksyntäpolku on ajettava erikseen ennen julkaisua.

## Kaikki 50 alkuperäisreseptiä

HH-sarake on **jo FI-reseptissä näkyvä annoksen imeytyvien hiilihydraattien luku grammoina**, ei GK. Päätekijät ovat nykyisen laskentasyötteen osuuksista; niiden koostumuskohdistusta ei vahvistettu uutena lähdehyväksyntänä. Viivan sijasta `Ei julkaistu` tarkoittaa, ettei annos-HH-lukua ole julkaistu FI-reseptissä. Nämä viisi eivät ole nollahiilihydraattisia.

| # | FI-alkuperäinen resepti | Julkaistu HH g/annos | Päätekijät / rajaus |
| ---: | --- | ---: | --- |
| 1 | [`baozi`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/baozi.md) | 80,23 | vehnäjauho; sokeri; maissitärkkelys |
| 2 | [`butter-chicken`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/butter-chicken.md) | 11,54 | hunaja; tomaattimurska; kerma |
| 3 | [`caponata`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/caponata.md) | 13,73 | munakoiso; tomaattimurska; sokeri |
| 4 | [`carnitas-salaattitacot`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/carnitas-salaattitacot.md) | 4,98 | appelsiini; salaatti; tomaatti |
| 5 | [`chili-con-carne-kukkakaaliriisi`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/chili-con-carne-kukkakaaliriisi.md) | 15,63 | kidneypavut; tomaattimurska; kukkakaali |
| 6 | [`hapanimela-porsas`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/hapanimela-porsas.md) | 54,86 | keitetty riisi; sokeri; maissitärkkelys |
| 7 | [`harira`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/harira.md) | 33,89 | kikherneet; linssit; vermiselli |
| 8 | [`janssoninkiusaus-juuriselleri`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/janssoninkiusaus-juuriselleri.md) | Ei julkaistu | juuriselleri; kerma; maito |
| 9 | [`jauheliha-kaalikeitto-vhh`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/jauheliha-kaalikeitto-vhh.md) | 10,21 | erillinen scopedPolyolC-laskenta |
| 10 | [`kana-enchilada-kukkakaalivuoka`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kana-enchilada-kukkakaalivuoka.md) | 6,37 | kukkakaali; tomaatti; ranskankerma |
| 11 | [`kanakeitto-pinaatti-sitruuna`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kanakeitto-pinaatti-sitruuna.md) | 4,65 | kerma; kanaliemi; kesäkurpitsa |
| 12 | [`kanapyorykat-tomaattikastike`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kanapyorykat-tomaattikastike.md) | 4,99 | tomaattimurska; kerma; sipuli |
| 13 | [`kerala-kalacurry`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kerala-kalacurry.md) | 5,54 | tamarinditahna; kookosmaito; sipuli |
| 14 | [`kookos-lime-kanacurry`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kookos-lime-kanacurry.md) | 5,74 | kookosmaito; paprika; currytahna |
| 15 | [`kung-pao-kana`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/kung-pao-kana.md) | 45,21 | valkoinen riisi; kevätsipuli; maapähkinät |
| 16 | [`lanttulaatikko-kermainen`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/lanttulaatikko-kermainen.md) | 13,11 | lanttu; kerma |
| 17 | [`lindstrominpihvit-kaalilla`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/lindstrominpihvit-kaalilla.md) | 9,89 | valkokaali; säilykepunajuuri; sipuli |
| 18 | [`marokkolainen-couscous`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/marokkolainen-couscous.md) | Ei julkaistu | nimetty kuiva durumcouscous; kikherneet |
| 19 | [`meheva-suklaakakku`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/jalkiruoat/meheva-suklaakakku.md) | 43,76 | sokeri; tumma suklaa; vehnäjauho |
| 20 | [`menemen`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/menemen.md) | 6,87 | tomaatti; paprika; sipuli |
| 21 | [`moo-ping-vhh`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/moo-ping-vhh.md) | 2,16 | kurkku; kookosmaito; erytritoli ei imeytyvää HH:ta |
| 22 | [`munakoiso-jauhelihavuoka-vhh`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/munakoiso-jauhelihavuoka-vhh.md) | 8,92 | munakoiso; tomaattimurska; sipuli |
| 23 | [`munatacot-huevos-rancheros`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/munatacot-huevos-rancheros.md) | 4,23 | tomaattimurska; sipuli; avokado |
| 24 | [`okonomiyaki-kaaliletut`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/okonomiyaki-kaaliletut.md) | 11,28 | kaali; kevätsipuli; majoneesi |
| 25 | [`paprikainen-vhh-gulassi`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/paprikainen-vhh-gulassi.md) | Ei julkaistu | lihaliemi; sipuli; paprika |
| 26 | [`pasta-alla-norma`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/pasta-alla-norma.md) | Ei julkaistu | nimetty kuiva De Cecco -pasta; tomaatti; munakoiso |
| 27 | [`pohjoisafrikkalainen-harissa-shakshuka`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md) | 5,81 | paprika; tomaatti; muna |
| 28 | [`pohjoisafrikkalainen-minttutee-kaurapuuro`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/pohjoisafrikkalainen-minttutee-kaurapuuro.md) | 39,41 | kaura; hunaja; maito |
| 29 | [`raejuusto-uunimunakas`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/raejuusto-uunimunakas.md) | 3,42 | ruokakerma; raejuusto; muna |
| 30 | [`ratatouille`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/ratatouille.md) | 11,55 | tomaatti; kesäkurpitsa; munakoiso |
| 31 | [`rendang-padang`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/rendang-padang.md) | 41,86 | jasmiiniriisi; kookosmaito; salottisipuli |
| 32 | [`sate-ayam`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/sate-ayam.md) | 13,74 | maapähkinävoi; fariinisokeri |
| 33 | [`shakshuka`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/shakshuka.md) | 8,20 | tomaattimurska; paprika; sipuli |
| 34 | [`shoyu-kanakeitto-konjac`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/shoyu-kanakeitto-konjac.md) | 4,00 | kevätsipuli; kanaliemi; soijakastike |
| 35 | [`sitruuna-yrttikana-parsa`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/sitruuna-yrttikana-parsa.md) | Ei julkaistu | parsa; valkosipulijauhe; timjami |
| 36 | [`som-tam-vhh-kurkkuna`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/som-tam-vhh-kurkkuna.md) | 5,33 | kurkku; tomaatti; maapähkinät; erytritoli |
| 37 | [`spanakopita`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/spanakopita.md) | 16,15 | filotaikina; pinaatti; kevätsipuli |
| 38 | [`tabbouleh`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/alkuruoat/tabbouleh.md) | 11,34 | bulgur; tomaatti; kevätsipuli |
| 39 | [`taytetyt-paprikat-vhh`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/taytetyt-paprikat-vhh.md) | 9,65 | paprika; tomaattimurska; sipuli |
| 40 | [`thai-kananmunat-kookoscurryssa`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/thai-kananmunat-kookoscurryssa.md) | 43,31 | kuiva riisi; currytahna; tomaatti |
| 41 | [`thai-maissifritterit`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/thai-maissifritterit.md) | 55,41 | vehnäjauho; maissi |
| 42 | [`thai-papaijajogurtti`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/thai-papaijajogurtti.md) | 12,14 | papaija; jogurtti; kookos |
| 43 | [`tunisialainen-ojja`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/tunisialainen-ojja.md) | 26,41 | leipä; tomaattimurska; paprika |
| 44 | [`uunikanapasta-kesakurpitsa`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/uunikanapasta-kesakurpitsa.md) | 7,40 | erillinen recoveryC-laskenta |
| 45 | [`uunilohi-smetanakuorrutteella`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/uunilohi-smetanakuorrutteella.md) | 2,04 | smetana; purjo; sitruuna |
| 46 | [`valimerellinen-tahinipuuro`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/valimerellinen-tahinipuuro.md) | 40,34 | kaura; hunaja; appelsiini |
| 47 | [`valimerellinen-tortilla-espanola-aamupalaksi`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/valimerellinen-tortilla-espanola-aamupalaksi.md) | 6,14 | peruna; sipuli; muna |
| 48 | [`vhh-runebergintortut`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/leivonnaiset/vhh-runebergintortut.md) | 2,16 | mantelijauho; rahka; erytritoli ei imeytyvää HH:ta |
| 49 | [`vietnamilainen-hu-tieu-aamiaiskeitto`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md) | 42,08 | riisinuudelit; pavunidut |
| 50 | [`bouillabaisse`](https://github.com/ozirix-dev/Reseptit/blob/e8ed43ed525a9cb6abbe61b94bc1c036153979c7/reseptit/paaruoat/bouillabaisse.md) | 37,69 | peruna; leipä; tomaattimurska |

Jokaisen rivin laskentasyöte on GitHub-polussa `docs/nutrition/calculations/<recipe_id>.json` samalla lähtö-mainilla. Numeroita ei saa käyttää eri reseptiversion tai lisukkeiden arviona.

## Prioriteetti integraatio-omistajalle

1. **Julkaisematon HH (5):** `janssoninkiusaus-juuriselleri`, `marokkolainen-couscous`, `paprikainen-vhh-gulassi`, `pasta-alla-norma`, `sitruuna-yrttikana-parsa`. Kaikilla on oma laskentasyöte, mutta reseptissä ei ole hyväksyttyä julkista HH-kenttää. Tarkista alkuperäisen ainesluettelon, tuotteen, valmistusvaiheiden, poisjättöjen, laskelman ja omistajaportin vastaavuus. **Älä siirrä syötteestä johdettua osasummaa julkiseksi HH- tai GK-luvuksi.** Erityisesti `pasta-alla-norma`-syötteen `scope` on merkitty E-HOLDiksi; marokkolainen couscous nimeää tarkan durumcouscous-tuotteen.
2. **Mahdolliset sanallisen GK:n ehdokkaat, eivät hyväksynnät:** `uunilohi-smetanakuorrutteella` (2,04 g HH/annos), `moo-ping-vhh` (2,16 g, erytritoli), `vhh-runebergintortut` (2,16 g, erytritoli), `raejuusto-uunimunakas` (3,42 g), `shoyu-kanakeitto-konjac` (4,00 g). Näille vaaditaan reseptikohtainen GI-/glykeemisen vaikutuksen lähdeperustelu ja annoksen/tuotteiden soveltuvuuden varmennus; vähäinen HH yksin ei riitä GK-luokaksi.
3. **Suuret HH-lähteet ryhmissä:** vehnäjauho ja taikinatuote (`baozi`, `thai-maissifritterit`), riisi ja riisinuudelit (`hapanimela-porsas`, `kung-pao-kana`, `rendang-padang`, `vietnamilainen-hu-tieu-aamiaiskeitto`, `thai-kananmunat-kookoscurryssa`), kaura ja hunaja (`valimerellinen-tahinipuuro`, `pohjoisafrikkalainen-minttutee-kaurapuuro`), sekä bulgur/couscous/pasta. Reseptin kypsennys, tuotetunniste ja annos ovat ratkaisevia. Älä käytä kuivajauhon, keitetyn riisin tai yksittäisen raaka-aineen GI:tä suoraan valmiin sekareseptin GI:nä.
4. **Erillinen metadatahavainto P2:** `spanakopita`-laskentasyötteen `scope`-teksti puhuu couscousin broilerivaihtoehdosta ja congeen jasmiiniriisistä. Nämä ovat ilmeisesti väärään laskentasyötteeseen jääneet rajauslauseet. Tarkista ja korjaa tarvittaessa lähderajaus erillisessä omistetussa integraatiossa. Tästä ei yksin seuraa annos-HH:n tai GK:n virhettä.
5. **Omission ja polyolin rajat:** tarkista mainitut 11 nykyisen virallisen laskurin ja lähdesopimuksen avulla. Erytritolia ei saa käsitellä 100 % imeytyvänä hiilihydraattina; tyhjää `record.per100g`-rakennetta ei saa tulkita 0 g HH:ksi, jos syötteessä käytetään `scopedPolyolC` / `recoveryC`-polkua.

## Menetelmä- ja lähderajat

Katselmointi on GitHubin nykyisten tekstien ja JSON-syötteiden lukutarkistus; se ei suorita repon `audit:glycemic-load`-, `audit:nutrition`- eikä 1 659 reitin julkaisubuildia, ei validoi GI-mittausten soveltuvuutta jokaiselle tuotteelle eikä korvaa riippumatonta lääkinnällistä tai ruoan turvallisuuskatselmointia. Käytetyt periaatelähteet: [FAO:n seka-aterioiden GI-laskenta](https://www.fao.org/4/w8079e/w8079e0a.htm), [International GI tables 2021](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext), [THL Fineli CHOAVL](https://fineli.fi/fineli/content/file/8/Fineli_data_file_instructions) ja [EFSA:n erytritolikatsaus](https://www.efsa.europa.eu/en/plain-language-summary/re-evaluation-erythritol-e-968-food-additive). GI/GL ei ole mitattu tämän erän sekaresepteille eikä siitä voi päätellä yksilöllistä verensokerivastetta.

**Oikeus- ja haararajat:** tämä erä kirjoittaa vain tämän Markdownin erilliseen ChatGPT-tutkimushaaraan. Ei muutoksia Codexin PR #706 -haaraan, alkuperäisresepteihin, ravintosyötteisiin, GI-lähderekistereihin, GK-hyväksyntöihin, laskentamoottoriin, testeihin, julkaisuun tai ReportHubiin. Ei automaattista mergeä. Codexin omistajan tulee integroida vain erikseen hyväksymänsä, nykyiseen HEADiin uudelleen sidotut havainnot.
