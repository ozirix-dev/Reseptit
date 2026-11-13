# Kikherne-yrttiaamiainen V2: koneluettava ravintotodiste ja julkaisupäätös

13.11.2026. PR:n omistus: yksi uusi `docs/reviews`-JSON, yksi kohdennettu testi ja tämä katselmointi. **Ei julkaistu.**

## Näytön sisältö

- Luetaan suoraan `reseptit/raakileet/valimerellinen-kikherne-yrttiaamiainen-punnittu-v2.md`: 100 g jo kypsää ja valutettua kikhernettä (Fineli 11089), 150 g kurkkua (346), 8 g persiljaa (333), 20 g sitruunamehua (11557), 10 g oliiviöljyä (536), 2 kuoretonta kananmunaa (malli 50 g/kpl, Fineli 858), 1 g suolaa (Fineli 30).
- `2026-11-13-kikherne-v2-nutrition-evidence.json` sitoo **jokaisen ainerivin**, grammapainon, ruokatilan, lähdetietueen ja kuitu/polyoli-määritelmän version tarkkaan `recipeNutritionInputHash`-tiivisteeseen `f4b9f80e5524aa1ca1f0afcc0dfd17d45a227e6f2e29fdb391e8a281c28564c3`. Tietueet kopioidaan repon jo käytössä olevista Fineli-laskelmista; sitä ei pidä kutsua erilliseksi ravintotietojen laboratoriomittaukseksi.
- Automaattinen `nutrition-model.calculate` ja yksikkötesti varmentavat **laskennalliset** netto-HH 10,20 g, kokonais-HH sisältäen kuidun 13,66 g, proteiini 11,10 g, rasva 10,95 g **/ annos**. Tarkkoja arvoja ei kopioida vanhan alkuperäisreseptin peruslukemista.
- Testi lukitsee samalla alkuperäisreseptin Git-blobin `33923cc854eabc27c7905db024c3b2e7d9ca44ab` sekä julkisen karanteenin edelleen päälle. Edellisen laskelman ja uusi versio pysyvät eri aineistoina.

## Julkaisua estävät tarkistukset

**1. Olemassa oleva kuva** `kuvat/aamupalat/valimerellinen-kikherne-yrttiaamiainen.webp` (Git blob `4c13ff1c5b681044b3b943f80cf944af57fb70ba`) on olemassa, mutta kuvan visuaalista sisältöä ei vielä pystytty tarkistamaan työkalujen binary-rajoituksen vuoksi. Älä väitä kuvaa hyväksytyksi tai julkaise munallista reseptiä vanhalla kuvalla ilman vastaavuuden vahvistusta.

**2. GK:** Alkuperäiseen ID:hen on sidottu `docs/nutrition/glycemic-load-recipe-bindings.json` -rekisterin historiallinen resepti-, laskentasyöte- ja laskentanäyttötiiviste. Uutta V2:n makrolaskentaa ei saa kirjoittaa niiden päälle. Uusi versio: **GK ei määritetty** kunnes hyväksyttävää ruokalajikohtaista näyttöä löytyy ja julkaisuportti hyväksyy dokumentoidun puuttuvan tiedon.

**3. Käytännön ruoanvalmistus:** ohje on ruoanvalmistuksen työpöytäarvion perusteella toteuttamiskelpoiseksi arvioitu mutta ei fyysisesti koekeitetty. Kukin muna on mallissa 50 g ilman kuorta; todellinen paino ja kotikeittiön keitettyjen kikherneiden vesipitoisuus vaihtelevat. Alustavan ravintoarvon aritmeettinen oikeellisuus ei takaa kaikille pakkauksille täsmällistä ravintosisältöä.

**4. Julkinen versio:** FI-lähteen `recipe_id`-migraatio, uusi kuva tai kuvatarkistus ja tarvittavat EN/SV/TH-sisältövertailut puuttuvat. Koska lähdemigraation yleinen GK-portti estää karanteenilähteen suoran muutoksen, erillinen kontrolloitu julkaisu-PR on välttämätön.

## Päätös

**RAVINTOARVOJEN RAKENTEINEN TODISTE VALMIS / JULKAISU HOLD.** Tämä ei ole uusi CI-järjestelmä; yksi täsmätesti olemassa olevaa laskentamallia vasten. Tämä paketti voidaan yhdistää nykyiseen mainiin ilman että valmiit reseptisivut, GK-historia, alkuperäiset makrot, kuvat tai karanteenimäärä muuttuvat.
