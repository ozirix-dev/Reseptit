# Gluteenittoman viiden reseptin pilotti – 10.11.2026

Lähtötarkistus: Keliakialiiton reseptien määrät ja kriittiset valmistusvaiheet on luettu 10.11.2026. Tämän branchin **viisi FI-reseptiä ovat `status: draft`**, eivät julkaisulähteitä. Tämä erä on eri työnjako kuin gluteeniton-suodattimen PR #417; gluteenittomuusmerkintää `gluten_free: true` ei aseteta ennen tuotekohtaista tarkastusta ja ennen kuin suodatin on hyväksytty.

| ID | Lähde | Keskeinen epävarmuus |
|---|---|---|
| gluteeniton-siemenvuokaleipa | https://www.keliakialiitto.fi/ruoka/reseptit/anna-kaisan-vuokaleipa/ | Vuoka vuorattu leivinpaperilla alkuperäisen voitelun sijasta. Jauhoseos ja kuivahiivan pakkauksen määrä lukittava. |
| gluteenittomat-kauralesesampylat | https://www.keliakialiitto.fi/ruoka/reseptit/gluteenittomat-kauralesesampylat/ | Perunakuitu ei ole perunajauho. Erikoisaineen ja kuivahiivan määrät tarkistettava tuotepakkauksesta. |
| gluteeniton-durrapizzapohja | https://www.keliakialiitto.fi/ruoka/reseptit/durrainen-pizzapohja/ | Lähde paistaa *täytetyn pizzan*. Pelkkä pohja ilman täytettä vaatii paistoajan ja rakenteen erillisen tarkistuksen; HOLD. |
| gluteeniton-perunajauhokakkupohja | https://www.keliakialiitto.fi/ruoka/reseptit/taytekakku-tai-kaaretorttupohja/ | Vuokaan vaihdettu leivinpaperi. Jauhot ja leivinjauhe gluteenittomaksi merkittyjä. Ei ole kiehuvan veden sienikakku. |
| gluteeniton-uunipannukakku | https://www.keliakialiitto.fi/ruoka/reseptit/gluteeniton-pannukakku/ | Käytettävät gluteeniton jauhoseos, kaurajauho ja margariini tarkistettava; ei lasketa lisukkeita. |

## Julkaisuportti

1. Gluteenittomuuden ehdot: jokaiselle yksilöidylle valmistuotteelle gluteeniton-pakkausmerkintä, kauratuotteiden erillinen gluteenittomuus ja puhtaiden välineiden vaatimus. EU:n `gluteeniton`-väitteen raja on 20 mg/kg. Ristikontaminaation esto on välttämätöntä.
2. Kaikki ainekset, myös mahdollinen vuoan voitelurasva, oltava rakenteisissa metatiedoissa tai työvaihe muutettava leivinpaperille. Täytteet ja tarjoilulisäkkeet eivät kuulu pohjien ravintoarvoihin.
3. Lukitse reseptien käytetyt jauho- ja valmisainesosatuotteet ennen ravintoarvojen laskentaa. `carbs_net_per_serving_g`, `carbs_total_per_serving_g`, `protein_per_serving_g`, `fat_per_serving_g` ovat `null`, eivät nollia; GK puuttuu.
4. Valmis kuva jokaista reseptiä varten. Tämän keskustelun kuvagenerointikuvat toimitetaan erillisenä viiden WebP-kuvan pakettina; **niitä ei ole vielä siirretty GitHubiin**, eikä kuva-frontmatteria lisätä ennen tiedostojen versionointia ja mittojen tarkistusta.
5. CI validoi luonnosten rakenteet. Vasta erillisessä rajatussa julkaisu-PR:ssä asetetaan `published` ja mahdollisesti `gluten_free:true` tarkistetuille resepteille; EN/SV/TH omien semanttisten tarkistusten jälkeen.

Lähdekokoelma: https://www.keliakialiitto.fi/ruoka/reseptit/
Gluteenittomuuden kriteerit: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/gluteenittomat-ja-erittain-vahagluteeniset-elintarvikkeet/

Toteutus liittyy lähde-issueen #418. Reseptit eivät ole koeleivottuja; niitä ei saa markkinoida itsenäisesti testatuiksi.

## Generoidun kuvapaketin tarkisteet (chatissa, ei vielä GitHubissa)

Kuvat on valmistettu erilliseen `gluteenittomat_viisi_kuvaa.zip`-pakettiin, 1500 × 1000 px, WebP. Nämä tarkisteet varmistavat myöhemmän siirron vastaavuuden; GitHubissa ei vielä ole näitä binäärejä, joten `image.src` jätettiin pois.

| Resepti-ID ja odotettu kuvatiedosto | SHA-256 |
|---|---|
| `gluteeniton-siemenvuokaleipa.webp` | `903cbd3252b22ba58cd03d7d0edcd4f61dda58cc4e3e76f4e4ce3a416cb0cc99` |
| `gluteenittomat-kauralesesampylat.webp` | `251d501a36f7f78fe9501a864cd60e53f441a03bb63de51aab4afed38b350e25` |
| `gluteeniton-durrapizzapohja.webp` | `ec6154968f21d7c690308daad623244c1dda66d154c46d6da9a4b5653eaf7c0f` |
| `gluteeniton-perunajauhokakkupohja.webp` | `f9fa50e561f3803554829a6a6c1c77fcf1b609785a38a2d993d3d83e8e045637` |
| `gluteeniton-uunipannukakku.webp` | `b28b2c7eff01ea475553b44205ed6d4c941d02afa12dbe8636be7473a6405b1b` |

**Kuvien sisällöllinen auditointi:** pizzapohjan kuvituksessa näkyy juustoa, tomaattia ja basilikaa, joita ei ole pohjareseptissä; pannukakun kuvituksessa näkyy marjoja ja kermaa, jotka eivät kuulu taikinaan. Näitä kahta **ei saa tulkita ainesosaluetteloksi**, ja ne on korjattava ennen julkaisukuvaa tai merkittävä nimenomaisesti tarjoiluehdotukseksi. Sämpylöiden kuvan pinta muistuttaa kaurahiutaleita; varmistettava vastaavuus kauraleseseen. Kuvat eivät osoita gluteenittoman lopputuotteen mittausta tai tosiasiallista koepaistoa.
