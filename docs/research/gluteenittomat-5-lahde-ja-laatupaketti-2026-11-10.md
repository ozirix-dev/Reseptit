# Gluteenittoman viiden reseptin pilotti – 10.11.2026

Lähtötarkistus: Keliakialiiton reseptien määrät ja kriittiset valmistusvaiheet on luettu 10.11.2026. Tämän branchin **viisi FI-reseptiä ovat `status: draft`**, eivät julkaisulähteitä. Tämä erä on eri työnjako kuin gluteeniton-suodattimen PR #417; gluteenittomuusmerkintää `gluten_free: true` ei aseteta ennen tuotekohtaista tarkastusta ja ennen kuin suodatin on hyväksytty.

| ID | Lähde | Keskeinen epävarmuus |
|---|---|---|
| gluteeniton-siemenvuokaleipa | https://www.keliakialiitto.fi/ruoka/reseptit/anna-kaisan-vuokaleipa/ | Vuoka vuorattu leivinpaperilla alkuperäisen voitelun sijasta. Jauhoseos ja kuivahiivan pakkauksen määrä lukittava. |
| gluteenittomat-kauralesesampylat | https://www.keliakialiitto.fi/ruoka/reseptit/gluteenittomat-kauralesesampylat/ | Perunakuitu ei ole perunajauho. Erikoisaineen ja kuivahiivan määrät tarkistettava tuotepakkauksesta. |
| gluteeniton-durrapizzapohja | https://www.keliakialiitto.fi/ruoka/reseptit/durrainen-pizzapohja/ | Korjattu täytettyyn pizzaan: 150 g gluteenittomaksi merkittyä tomaattikastiketta, 200 g mozzarellaa, 120 g kirsikkatomaatteja, 10 g basilikaa. Pohja paistetaan Keliakialiiton ohjeen tavoin täytettynä. Täytteet ovat Recipavon oma mitoitus ja vaativat tuotteiden varmentamisen. |
| gluteeniton-perunajauhokakkupohja | https://www.keliakialiitto.fi/ruoka/reseptit/taytekakku-tai-kaaretorttupohja/ | Vuokaan vaihdettu leivinpaperi. Jauhot ja leivinjauhe gluteenittomaksi merkittyjä. Ei ole kiehuvan veden sienikakku. |
| gluteeniton-uunipannukakku | https://www.keliakialiitto.fi/ruoka/reseptit/gluteeniton-pannukakku/ | Käytettävät jauhoseos, kaurajauho ja margariini tarkistettava. Marjat (200 g), kerma (1 dl) ja gluteenittomaksi merkitty tomusokeri (1 rkl) ovat **nyt** osa reseptiä ja tulevaa ravintoarvolaskentaa. |

## Julkaisuportti

1. Gluteenittomuuden ehdot: jokaiselle yksilöidylle valmistuotteelle gluteeniton-pakkausmerkintä, kauratuotteiden erillinen gluteenittomuus ja puhtaiden välineiden vaatimus. EU:n `gluteeniton`-väitteen raja on 20 mg/kg. Ristikontaminaation esto on välttämätöntä.
2. Kaikki ainekset, myös mahdollinen vuoan voitelurasva, oltava rakenteisissa metatiedoissa tai työvaihe muutettava leivinpaperille. Täytteet ja tarjoilulisäkkeet eivät kuulu pohjien ravintoarvoihin.
3. Tuote- ja tilavuuspainooletuksiin perustuvat arviot on nyt laskettu kaikille viidelle, lähteet ja epävarmuudet: [ravintoarviomuistio](../nutrition/gluteenittomat-5-tuote-evidenssi-2026-11-11.md). Arvioita ei esitetä mittauksina. `carbs_total_per_serving_g` pysyy `null`; GK puuttuu.
4. Kaikille viidelle reseptille on lisätty oma **1500 × 1000 WebP-piirros** ja vastaava `image`-metatieto. Ne ovat Github Actionsissa tuotettuja uusia SVG-pohjaisia kuvia, eivät keskustelun erillisen ZIP-paketin valokuvia. Kuvat ovat kuvitusta, eivät koepaistokuvat.
5. CI validoi luonnosten rakenteet. Vasta erillisessä rajatussa julkaisu-PR:ssä asetetaan `published` ja mahdollisesti `gluten_free:true` tarkistetuille resepteille; EN/SV/TH omien semanttisten tarkistusten jälkeen.

Lähdekokoelma: https://www.keliakialiitto.fi/ruoka/reseptit/
Gluteenittomuuden kriteerit: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/gluteenittomat-ja-erittain-vahagluteeniset-elintarvikkeet/

Tuotetietojen jatkokatselmointi: [gluteenittomien viiden tuote-evidenssi](../nutrition/gluteenittomat-5-tuote-evidenssi-2026-11-11.md). Erityisesti huomioitu gluteenittoman vehnätärkkelyksen ja vehnäallergian ero sekä tavallisen kauran kontaminaatioriski.

Toteutus liittyy lähde-issueen #418. Reseptit eivät ole koeleivottuja; niitä ei saa markkinoida itsenäisesti testatuiksi.

## Alkuperäisen keskustelussa tuotetun valokuva-ZIP:n tarkisteet (ei GitHubissa)

Valokuvamaiset kuvat valmistettiin keskustelussa erilliseen `gluteenittomat_viisi_kuvaa.zip`-pakettiin, 1500 × 1000 px, WebP. Näitä **tarkkoja ZIP:n binäärejä ei ole lisätty GitHubiin**. Sen sijaan GitHubiin tuotettiin samasta reseptierästä viisi erillistä 1500 × 1000 WebP-piirroskuvaa, joihin `image.src` nyt osoittaa. Alla olevat SHA-256-tarkisteet koskevat alkuperäistä ZIP:iä, eivät GitHubin uusia kuvituksia.

| Resepti-ID ja odotettu kuvatiedosto | SHA-256 |
|---|---|
| `gluteeniton-siemenvuokaleipa.webp` | `903cbd3252b22ba58cd03d7d0edcd4f61dda58cc4e3e76f4e4ce3a416cb0cc99` |
| `gluteenittomat-kauralesesampylat.webp` | `251d501a36f7f78fe9501a864cd60e53f441a03bb63de51aab4afed38b350e25` |
| `gluteeniton-durrapizzapohja.webp` | `ec6154968f21d7c690308daad623244c1dda66d154c46d6da9a4b5653eaf7c0f` |
| `gluteeniton-perunajauhokakkupohja.webp` | `f9fa50e561f3803554829a6a6c1c77fcf1b609785a38a2d993d3d83e8e045637` |
| `gluteeniton-uunipannukakku.webp` | `b28b2c7eff01ea475553b44205ed6d4c941d02afa12dbe8636be7473a6405b1b` |

**Kuvien sisällöllinen auditointi:** pizzapohjan kuvituksessa näkyy juustoa, tomaattia ja basilikaa, joita ei ole pohjareseptissä; pannukakun kuvituksessa näkyy marjoja ja kermaa, jotka eivät kuulu taikinaan. Näitä kahta **ei saa tulkita ainesosaluetteloksi**, ja ne on korjattava ennen julkaisukuvaa tai merkittävä nimenomaisesti tarjoiluehdotukseksi. Sämpylöiden kuvan pinta muistuttaa kaurahiutaleita; varmistettava vastaavuus kauraleseseen. Kuvat eivät osoita gluteenittoman lopputuotteen mittausta tai tosiasiallista koepaistoa.


## Laajempi tarkistus 11.11.2026

**Lähdevertailu:** Kaikkien viiden Keliakialiiton valmistusaineet ja perustyövaiheet tarkistettiin uudelleen alkuperäisiltä verkkosivuilta. Pizzan lähde paistaa täytetyn pizzan 225–250 °C:ssa noin 15 min; alun paljaspohjaehdotus oli perusteeton ja se poistettiin. Kauralesesämpylöiden kuvaa varten lisättiin 1 rkl gluteenittomia kaurahiutaleita pintaan, joka ei kuulunut alkuperäiseen ohjeeseen.

### Lukitut tuotekohdat – osa 1 (ei vielä kokonaishyväksyntää)

- **Virtasalmen Viljatuote, Gluteeniton Durrajauhoseos 500 g, EAN 6430041081623**. Valmistaja kertoo tuotteen gluteeniton-merkinnästä, ainesosista (durra 70 %, perunajauho, tapiokatärkkelys, psyllium), ja määrämittamuunnoksesta 1 dl ≈ 65 g. Lähde: https://www.virtasalmenviljatuote.fi/tuote/gluteeniton-durrajauhoseos-500g/ . 3 dl ≈ 195 g (tuotekohtainen arvio). Valmistajan nykyisellä 500 g:n sivulla ravintoarvot / 100 g: 70,6 g imeytyvää hiilihydraattia, 7,4 g proteiinia, 2,6 g rasvaa. Vanhoissa jälleenmyyjätiedoissa on eri koostumusluvut (68,5/6,6/2,3), joita ei saa sekoittaa saman laskentaversion sisään. Varmista käytetyn myyntipakkauksen erä.
- **Meira leivinjauhe 50 g, EAN 6414200210055**. Ainesosat: nostatusaineet E450i ja E500, E330 sekä maissitärkkelys; sisältöjen ja gluteenittomuuden tarkistus nykyisestä pakkauksesta. https://meira.fi/tuote/leivinjauhe/ . Jälleenmyyjän merkinnässä hiilihydraatit 17,6 g / 100 g, mutta varsinainen käyttömäärä on vain 1 tl tai 3 tl. https://www.s-kaupat.fi/tuote/meira-leivinjauhe-50g/6414200210055
- **Dansukker suomalainen taloussokeri**, valmistajan nykyinen mitta 1 dl = 88 g; käytetään vain, jos varsinaisen reseptin sokeri lukitaan tähän tuotteeseen. https://www.dansukker.fi/fi/tuotteet/kaikki-tuotteet/suomalainen-taloussokeri

### Valmistus- ja kuvavastaavuus

- **Pizzapohja**: kuva esittää valmista tomaatti-mozzarellapizzaa. Täytteet nyt mitoitettu reseptiin. Gluteenittomuuden varmennus koskee myös tomaattikastiketta sekä ristikontaminaatiota.
- **Pannukakku**: kuva esittää marjoja, kermavaahtoa ja tomusokeria. Nämä nyt mitoitettu mukaan, eivät vain mainittuja koristeita; viitearvot lasketaan myöhemmin koko yhdistelmästä.
- **Sämpylät**: kaurahiutaleet pinnassa nyt 1 rkl / 16 sämpylää, gluteenittomaksi merkittynä.
- **Vuokaleipä ja kakkupohja**: kuvitusten rakenteet vastaavat reseptien yleisiä aineksia ilman lisätyn täyteen mallia.

### Testien ja väitteiden raja

Historialliset GK-testit vartioivat viittä täsmälleen hash-sidottua draft-sisältöä, mukaan lukien nyt lisätyt kuvalinkit. Kaikille viidelle FI-reseptille on laskettu tuotteisiin ja paino-oletuksiin perustuvat suuntaa-antavat makrot, ja viisi SVG-pohjaisesti tuotettua WebP-kuvitusta on GitHubin `kuvat/`-hakemistossa. Julkaisu vaatii silti reseptikohtaisen valmistuote- ja gluteenittomuusportin; `gluten_free: true` ei ole sallittu ennen PR #417:n tuotantoa ja kunkin reseptin tarkistusta.
