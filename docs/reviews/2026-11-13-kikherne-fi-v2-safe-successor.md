# FI-julkaisuehdokas: kikherne-yrttiaamiainen V2, alkuperäinen GK-historia koskemattomana

13.11.2026. Tämä ratkaisu tekee **uuden julkaistavan punnitun seuraajaversion**, ei vaihda historiallisen `valimerellinen-kikherne-yrttiaamiainen`-lähteen tavua eikä muuta sen GK-historian sidoksia.

## Käyttöliittymässä jatkuva osoite

Julkaisuehdokas:
- `recipe_id: valimerellinen-kikherne-yrttiaamiainen-punnittu-v2`
- `url_slug: valimerellinen-kikherne-yrttiaamiainen`
- FI-lähde: `reseptit/aamupalat/valimerellinen-kikherne-yrttiaamiainen-punnittu-v2.md`
- Git-blob SHA: `172af458934dce456a54ccaacee8a2fb0c6f4b64`
- Alkuperäinen `recipe_id: valimerellinen-kikherne-yrttiaamiainen` säilyy karanteenissa, mutta sen julkista reittiä ei muodosteta, joten URL-konfliktia ei synny.
- Alkuperäinen lähdeblob `33923cc854eabc27c7905db024c3b2e7d9ca44ab` ja historialliset GK-sidokset pysyvät muuttumattomina. **Karanteenin kokonaismäärä ei tällä tekniikalla laske 21:stä**, vaikka käyttäjä saa korjatun FI-reseptin samalla URL-slugilla. Älä sulje vanhan tunnuksen korjauskorttia virheellisesti.

## Ravinto ja GK

Uuden version `docs/nutrition/calculations/valimerellinen-kikherne-yrttiaamiainen-punnittu-v2.json` käyttää hyväksytyssä V2-Draftissa jo testattua lähdetietueisiin sidottua laskentaa, identtisiä ainesmääriä ja täsmälleen samaa `recipeNutritionInputHash`-arvoa `f4b9f80e5524aa1ca1f0afcc0dfd17d45a227e6f2e29fdb391e8a281c28564c3`.
- 2 annosta; netto-HH 10,20 g; HH+kuitu 13,66 g; proteiini 11,10 g; rasva 10,95 g/annos. Annostuotteen vaihtelu on ilmoitettu.
- `docs/nutrition/new-public-gk-pending-sources.json` säilyttää tulokkaan GK:ssa **INSUFFICIENT SOURCE DATA** -tilassa; se ei peri vanhaa alkuperäisreseptin eikä ryhmäanalogian GK-numeroa.
- Vanhan alkuperäisen 21 karanteenilista ja GK-pilotin historia pysyvät muuttumattomina.

## Kuva: rehellinen rajaus ja viimeinen julkaisuvalinta

Nykyinen WebP `kuvat/aamupalat/valimerellinen-kikherne-yrttiaamiainen.webp` on versionoitu, 1536 × 1024, Git blob `4c13ff1c5b681044b3b943f80cf944af57fb70ba`. Binaarikuvan varsinainen sisältö **ei ole ollut saatavissa katselmointityökalussa**, joten en väitä sen esittävän tätä täsmällistä munallista annosta. `image.alt` ja muistiinpanot nimeävät kuvan tarkoituksella **havainnekuvaksi**, eivät tarkaksi todisteeksi. Ennen kuin PR siirtyy julkaisuun, kuva tulee tarkastaa ihmissilmin tai vaihtaa varmennettuun versioon. Jos kuvan oikeellisuudesta jää olennaista epävarmuutta, PR pysyy Draftissa.

## Julkaisuehto

Tämä PR on alkuperäisen reseptin suoraa migraatiota turvallisempi, koska historiatarkisteiden päivitys ja vanhojen pakettien muuttaminen vältetään kokonaan. Julkaisu vaatii nykyisen PR:n täsmä-HEAD-CI PASS, kuvan hyväksynnän, uuden GK:n puuttumistilan ja FI-reitin tarkistuksen, mainin Pages build/deploy PASS ja julkisen sivun HTTP-varmennuksen. Uuden version hyväksyminen ei tarkoita vanhan alkuperäisreseptin automaattista vapautusta.
