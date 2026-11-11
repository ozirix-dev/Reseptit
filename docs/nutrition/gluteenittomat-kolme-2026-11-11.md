# Kolmen gluteenittoman FI-reseptiluonnoksen jatkopaketti — 11.11.2026

**Tila:** `draft` / ei gluteeniton-hyväksyntää / ei uutta julkaisuvaltuutta. Tämä paketti korvaa vanhan PR #422:n viiden reseptin yhdistämissuunnitelman. Kaksi FI-reseptiä on jo julkaistu erillisessä [PR #434:ssa](https://github.com/ozirix-dev/Reseptit/pull/434): kakkupohja ja durrapizza. **Niiden tiedostoja eikä ravintoarvoja sisällytetä tähän PR:ään.**

## Lähteet ja reseptit

| Reseptitunniste | Lähtöohje | Annoksia | C / P / R / annos, g |
| --- | --- | ---: | --- |
| `gluteeniton-siemenvuokaleipa` | [Keliakialiiton Anna-Kaisan vuokaleipä](https://www.keliakialiitto.fi/ruoka/reseptit/anna-kaisan-vuokaleipa/) | 12 viipaletta | 27,45 / 3,98 / 3,08 |
| `gluteenittomat-kauralesesampylat` | [Keliakialiiton gluteenittomat kauralesesämpylät](https://www.keliakialiitto.fi/ruoka/reseptit/gluteenittomat-kauralesesampylat/) | 16 kpl | 10,14 / 2,13 / 3,69 |
| `gluteeniton-uunipannukakku` | [Keliakialiiton gluteeniton pannukakku](https://www.keliakialiitto.fi/ruoka/reseptit/gluteeniton-pannukakku/) | 13 annosta | 15,13 / 5,63 / 11,19 |

C = imeytyvä hiilihydraatti (EU-tuotemerkinnän hiilihydraatti), P = proteiini, R = rasva. Luvut ovat **laskennallisia, epätarkkoihin massamuunnoksiin perustuvia toimituksellisia arvioita**, eivät ravintolaboratorion tai fyysisen koekeittiön tuloksia. `carbs_total_per_serving_g` on tarkoituksella `null`, koska kuitua ja polyoleja sisältävää eri hiilihydraattimääritelmää ei ole laskettu. **GK puuttuu**, ei ole nolla eikä sanallisesti vahvistettu korkeaksi tai matalaksi.

## Lukitut tuotevalinnat ja avoimet epävarmuudet

| Aine ja resepti | Käytetty tuotetieto / määrä | Katselmointitila |
| --- | --- | --- |
| Siemen-vuokaleivän Pirkka vaalea gluteeniton jauhoseos | EAN 6410405221858, C 75/P 5,3/R 0,9 per 100 g; **3,5 dl = 210 g laskentaolettama**, 60 g/dl | Tuote tunnettu, tilavuuspaino ei tuotekohtaisesti lukittu; ei julkaisuvalmis |
| Vuokaleivän, sämpylöiden ja pannukakun Pirkka tumma gluteeniton jauhoseos | EAN 6410405221872, C 70/P 7/R 4,3 per 100 g; **60 g/dl oletus** | Tuote tunnettu, massan todellinen mitta avoin |
| Myllärin gluteeniton kauralese | EAN 6415000164739, C 48/P 18/R 7,7 per 100 g; [valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kauralese-450-g/) | Gluteenittomuuden valmistajalähde vahvistettu; 2 dl:n punnittu paino puuttuu |
| Myllärin gluteeniton kaurajauho | EAN 6415000163565, C 58/P 14/R 6,5 per 100 g; [valmistaja](https://myllarin.fi/tuotteet/myllarin-gluteeniton-kaurajauho-950-g/) | Tuotelähde vahvistettu; 2 dl = 120 g oletus, ei punnittu |
| Schär Pofiber / perunakuitu sämpylöissä | 2,5 dl = **42,5 g** laskennassa (17 g/dl); tuotetta ei saa sekoittaa perunajauhoon | [Semper Pofiber 17 g/dl](https://www.scandinavianonlinestore.com/fi/food/semper-pofiber-125-grams) tukee suuntaa, mutta käytettävän Schär-erän massaa ja sidontaa ei ole rinnastettu riippumattomasti |
| Myllärin gluteenittomat kaurahiutaleet, FiberHusk, Sunnuntai-kuivahiiva | Hiutale, psyllium ja kuivahiiva yksilöity aiemmassa PR #422:n [tuote-evidenssissä](https://github.com/ozirix-dev/Reseptit/blob/editorial/gf-five-drafts-20261110/docs/nutrition/gluteenittomat-5-tuote-evidenssi-2026-11-11.md) | Tuotepakkauksen gluteeniton-tunnisteet, ainemäärät ja käyttäjän erä varmistettava |
| Pannukakun Valio kevytmaito ja Keiju juokseva rypsiöljyvalmiste | [Valio](https://www.valio.fi/tuotteet/valio-kevytmaito/), [Keiju](https://www.s-kaupat.fi/tuote/keiju-juokseva-rypsioljyvalmiste-500-ml/6438207019008) | Tuotelajit yksilöity; marjat, kuohukerma ja tomusokeri ovat mukana myös makroarviossa |

[Kotikeittiön yksittäinen jauhoseosvertailu](https://viimeistamuruamyoten.com/gluteenittomat-jauhoseokset-testissa-osa-1-piirakkapohja-muffinit/) ilmoittaa Pirkka vaalean jauhoseoksen painoksi noin 65 g/dl, kun nykyinen laskenta käyttää 60 g/dl. Tämä ei vahvista EAN-erää, mutta osoittaa, ettei 60 g/dl:n pistelukua saa esittää yksilöllisenä mittaustuloksena.

**Herkkyysesimerkit** annoskohtaiselle imeytyvälle hiilihydraatille muuttamatta reseptiä:
- Vuokaleivän 3,5 dl vaaleaa jauhoseosta 60→65 g/dl: **+1,09 g/viipale**.
- Vuokaleivän 3 dl tummaa seosta, mahdollinen ±10 g/dl: **±1,75 g/viipale**.
- Sämpylöiden 2 dl tummaa seosta, ±10 g/dl: **±0,88 g/sämpylä**.
- Pannukakun 1,5 dl tummaa seosta, ±10 g/dl: **±0,81 g/annos**.
Nämä ovat yksittäisten oletusten skenaarioita, eivät tilastollisia luottamusvälejä.

## Gluteenittomuuden julkaisuehdot

1. Tarkista jokaisen kaupallisen jauho-, kaura-, hiiva-, psyllium-, kuitu- ja muun valmistuotteen **nimenomainen gluteeniton-merkintä tai luotettava tuoteseloste**. Kaura ei automaattisesti ole keliakiaruokavalioon sopivaa. Gluteeniton ei välttämättä tarkoita vehnätöntä tai kaikille allergikoille sopivaa.
2. Ohjeen tulee edellyttää puhtaita välineitä ja työpintoja sekä gluteenin siirtymisen välttämistä. [Ruokaviraston gluteenittomuusohje](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/gluteenittomat-ja-erittain-vahagluteeniset-elintarvikkeet/) edellyttää enintään 20 mg/kg valmiissa elintarvikkeessa sekä koko valmistusprosessin hallintaa.
3. Resepti voidaan siirtää `gluten_free: true` -tilaan vasta reseptikohtaisella, päivätyllä ja lähde-SHA-256:een lukitulla `gluten_free_review`-muistiolla. Tämä dokumentti EI ole sellainen hyväksyntä eikä korvaa käyttäjän omaa pakkaustarkistusta.
4. Kolmella reseptillä on alkuperäisellä viiden erän PR-haaralla jo 1500×1000 WebP-piirroskuvat. Ne tuodaan Git-blobien SHA-sidotuista versioista uudelle haaralle muuttamatta kuvia tai lisäämättä valokuvien väitettyä koepaistoa.
5. Jokainen `status: draft` säilyy. Raportti ja linkitetyt mittaukset eivät myönnä `published`-julkaisuvaltuutta. EN/SV/TH käännöksiä ei tehdä ennen FI-hyväksyntää.

**Ainoat tähän jatkoerään kuuluvat tiedostot** ovat kolme FI-draftia, kolme täsmälleen aiemmin tehtyä WebP-kuvitusta, tämä uusi lähderaportti ja yksi kolmen draftin SHA-sidottu GK-historian poikkeus. Ei vanhoja kakkupohja- tai durrapizzaversioita, ei alkuperäisen PR #422:n vanhoja julkaisuobjekteja.

Lisäksi tarkistetaan CI tämän uuden haara-HEADin version mukaisesti. Vanha CI ei ole uusi CI.
