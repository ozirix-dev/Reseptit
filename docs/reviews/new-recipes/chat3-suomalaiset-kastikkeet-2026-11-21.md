# Chat 3 – kymmenen suomalaista kastiketta

Työn omistaja: Chat 3
Päivä: 2026-11-21
Haara: `chat3/suomalaiset-kastikkeet-20261121`

Kymmenen erillistä reseptitunnusta, kaikki FI/EN/SV/TH; yksi Draft-PR, 8 suolaista alkuruoka-kategoriassa ja 2 jälkiruokakategoriassa. Tämä on väliaikainen luokittelu: nykyinen schema ei tue kastiketta omana kategorianaan. Ennen julkaisemista harkitse kastike-fasettia erillisellä käyttöliittymämuutoksella.

Kuvat: kaikki 10 WebP-havainnekuvaa on nyt tallennettu `kuvat/alkuruoat/`- tai `kuvat/jalkiruoat/`-hakemistoon ja niiden polut sekä 960 × 640 -mitat on liitetty kaikkiin 40 kielitiedostoon. Yksi kuva on erikseen generoitu, yhdeksän on rajattu generoiduista kollaaseista. Erityiset julkaisun esteet: kantarellin kuva ei näytä varmasti kantarellia, puolukkakastikkeen kuva näyttää kermakastikkeelta vaikka resepti on marjasose, vaniljakastikkeen kuvassa on vihreitä yrttejä. Kuvien toimituksellinen hyväksyntä puuttuu.

Ravintoarvoja eikä numeerista GK:ta ole arvattu. Kaikki on tietoisesti `status: draft`. Käännöksiä ei ole julkaistu eikä nelikielisen merkitysvertailun julkaisuevidenssiä ole kuitattu.

Julkaisun portit: kuvien korvaaminen/viimeistely tarpeen mukaan ja hyväksyntä, reseptikohtainen ravinto- ja GK-arvio/päätös, turvallisuustarkistus, merkityskatselmointi, täsmä-HEAD-CI ja Repo Guard. Ei mergeä eikä Cloudflare-julkaisua.

## CI-kuvasyötteen varmennus 21.11.2026

Kymmenen Git-tracked WebP-kuvaa lisättiin `assets/images.tracked-overlays.json`-tiedostoon tarkalla tavumäärällä ja SHA-256-tiivisteellä. Manifestin `approved: true` vahvistaa tämän yksilöidyn kuvatiedoston teknisesti hyväksytyksi CI:n erilliseksi lähdesyötteeksi. **Se ei ole** sisällöllinen/valokuvallinen hyväksyntä, julkaisulupa eikä valmis ravintoarvio. Erityisesti kantarelli-, puolukka- ja vaniljakastikkeen kuvien sisällöllinen HOLD säilyy, kunnes vastaava kuva vaihdetaan tai hyväksytään perustellusti. R2:n alkuperäistä 396 kuvan varmennettua arkistoa ei muutettu.

## Kolmen kuvan korjauspäätös – Chat 3, 21.11.2026

Aiemmin ongelmalliset kantarelli-, puolukka- ja vaniljakastikkeen WebP-kuvat on nyt vaihdettu. Kantarelli- ja puolukkakastikkeelle on erikseen luotu alkuperäinen AI-havainnekuva; vaniljakastikkeelle on rajattu aineksia vastaava kuva AI-kollaasista. Kaikki ovat 960 × 640. Nelikieliset alt-tekstit ja puolukkakastikkeen osittain kokonaisia marjoja salliva valmistusohje on päivitetty. Kuvien uudet tavumäärät ja SHA-256-syötteet on kirjattu tekniseen kuvamanifestiin. Aiemmat kuvahavainnot koskevat nyt korvattuja historiallisia versioita.

**Tämän täydennyksen rajaus:** tekninen kuvanvaihto ja silmämääräinen sisältövastaavuuden parannus, ei virallinen toimituksellinen kuvahyväksyntä. Tämä ei muodosta ravintolaskelmaa, GK-päätöstä, kielten versiosidonnaista merkitysvertailua tai Repo Guardin Ready/merge-lupaa. Kaikki 10 reseptiä ovat edelleen `status: draft` ja PR on HOLD.
