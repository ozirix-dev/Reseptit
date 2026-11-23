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

## Lähde- ja rakennekatselmointi

Kymmenen resepti-identiteetin 40 kielitiedoston ainesosa-/annos-/vaiherakenne verrattiin. Havaitut rakenteelliset ristiriidat: 0. Valmistuksen lähdevastaavuus kirjattu riskiperusteisesti tiedostoon `docs/reviews/new-recipes/chat3-kastikkeet-lahde-ja-rakennekatselmointi-2026-11-21.md`. Tämä ei korvaa semantic evidence -rekisteriä eikä keittiötestiä. Kaikki edelleen Draft/HOLD.

## Chat 3:n jatkotarkistus – alustava kieli- ja allergeenikatselmointi

Kymmenen reseptin FI/EN/SV/TH-kieliversioiden ainesmäärät, valmistusvaiheet ja riskikohdat käytiin läpi. Thaikielinen täysmaito täsmennettiin 3 reseptissä; piparjuurikastikkeen crème fraîche yksilöitiin noin 12-prosenttiseksi; erilliset allergeenihuomiot lisättiin kaikkiin 10 kastikkeeseen. Kolmelle lisävertailureseptille löytyi täsmällisempi julkaistu lähde, joita ei esitetä Recipavon oman version koekeittiötestauksena. Aineisto on edelleen Draft/HOLD. Tarkka erillisraportti: `docs/reviews/translations/chat3-kastikkeet-alustava-merkitysvertailu-2026-11-21.md`.

## Julkaisuportin ja laskentakandidaattien erottaminen – 22.11.2026

Uusimman `main`-haaran `site/scripts/nutrition-audit.ts` ja `site/scripts/validate-changed-content.ts` hyväksyvät `docs/nutrition/calculations/*.json`-todisteet vain **julkaistun** FI-lähteen yhteydessä. Chat 3:n kymmenen FI-reseptiä ovat tarkoituksella edelleen `status: draft`. Tämän seurauksena neljän sisällöltään laskennallisen, mutta julkaisemattoman paketoinnin paikka on nyt `docs/nutrition/candidates/draft-calculations/`, ei virallinen `docs/nutrition/calculations/`.

Kandidaatit (alkuperäiset JSON-sisällöt säilytetty muuttumattomina): `kermainen-tillikastike`, `perinteinen-munakastike`, `perinteinen-valkokastike`, `puolukkakastike-jalkiruokiin`. Reseptikohtaisiin tarkistus-JSON-tietueisiin vaihdettiin `nutrition: pending` ja tyhjä `nutrition_evidence`, koska ne eivät ole nykyisen julkaisuportin hyväksyttyjä laskentatodisteita. Nelikielisten Draft-reseptien neljä numerokenttää säilyivät toistaiseksi **vain ehdokkaina**, joita ei julkaista ilman myöhempää lopullista evidenssiä.

Tarkka tilanne: **4/10 dokumentoitua laskentakandidaattia, 0/10 julkaistuun FI-lähteeseen kiinnitettyä virallista laskentapakettia, 6/10 ravintosisällön osalta edelleen keskeneräistä.** Tämä ei hävitä tehtyä aritmetiikkaa eikä muuta raaka-ainemääriä; myöhempi hyväksytty julkaisuversio vaatii varsinaisen calculations-todisteen ja uudet CI/Repo Guard -portit. PR pysyy Draft/HOLD.
