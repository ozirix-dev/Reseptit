# GK — valkosipulin historiallinen lähdeidentiteettiseulonta 01

Työn omistaja: Chat 3. Tila: **AUDIT / ei runtime-muutosta eikä uutta käyttölupaa**. Pinned lähtömain `a0fbeb33d7fb84f4e0718ec57f1d5e4447a290dc`. Täydentää #1004:n seulontaa; ei muuta #1003/#1004:n sinettejä tai #1007:n aktiivista haaraa.

## Toteutettu

Koko 326 reseptin alkuperäissyötteestä poimittiin kaikki 51 ainesosariviä (50 reseptiä), joiden nimessä esiintyy merkkijono "valkosipuli" (kirjainkoosta riippumatta). 45 rivillä koostumuskortin nimi viittaa valkosipuliin (ei tarkoita soveltuvuushyväksyntää), 4 ilman korttia ja 2 keltasipulikorttiin virheellisesti sidottua riviä. Molemmat virheet on varmistettu nykyisestä FI-reseptistä ja ravintolaskentamuistiosta. Neljää kortitonta riviä ei nollata eikä hyväksytä. Seulonta ei kata kaikkia synonyymeja, kieliä, valmisteita eikä muita sipulilajeja.

| Resepti / alkuperäinen ainesosaindeksi | Vanha sidonta | Tarkastettava ehdokas |
|---|---|---|
| Falafel / 2 | 165 g keltasipulia; 3 valkosipulinkynttä | 9 g valkosipulia, AFCD F004193; 3 g/kynttä |
| Bissara / 1 | Keltasipulikortti, massa null; 1 tl valkosipulia | 3 g hienonnettua valkosipulia, AFCD F004193; 3 g/tl |

Koostumuksen laskennallinen osuus ennen muita vaikutuksia: falafel 1,98 → 0,2295 g imeytyvää HH/annos (delta −1,7505 g). Bissara: vanha tuntematon, ehdokas 0,153 g/annos. Luvut kuvaavat vain yksittäisen ainesosan koostumuskortin ja dokumentoidun annosjaon aritmetiikkaa; eivät valmiin annoksen retentoitunutta HH:ta tai GK:ta. GI jää molemmissa null. Nykyisten ravintolaskentamuistioiden reviewStatus AUTOMATED ONLY: ei uutta riippumatonta hyväksyntää. Falafelin myös muut historialliset syöterivit (kikherne, öljy ym.) tarvitsevat reseptiversion ja soveltuvuuden tarkistuksen; ei pelkkää vanhan syötteen siirtoa nykyversioon.

## Toistaminen

`audit.json` sisältää kaikki 51 osumaa, kaksi tarkkaa ennen/jälkeen-ehdokasta ja kuusi lähdepinneistä. Aja repon juuresta `node docs/research/gk-allium-source-audit-01/verify.mjs` Node 22:lla. Tarkistin lukee lähdeblobit suoraan pinnatusta Git-objektihistoriasta, ei aktiivisen työpuun muuttuvista lähdetiedostoista; siksi #1007:n myöhempi syötemuutos ei vaihda historiallista aineistoa. Vaatii pinnatun commitin ja objektit paikallisesti, ei verkkoa, npm-asennusta, sovelluksen ajoa tai CI-porttimuutosta. Puuttuva/muuttunut pinni tai erilainen snapshot aiheuttaa FAILin.

Toteutuksessa audit-funktion samaa lähdekoodia suoritettiin GitHub-liitännän kautta luetuilla kuudella täsmälähteellä, ja muutettu falafel-massa (164 g) hylättiin negatiivisessa kokeessa. Varsinainen Node22/Git-checkout-ajo ei ole vielä varmennettu. Tässä ympäristössä GitHub-DNS ei toimi. Tarkistin ei ole julkaisuportti.

Ennen mahdollista aktiivista muutosta: #1007:n integraatio ja uusi todellinen BASE, canonical original/public/variant/range/portion-näyttö, reseptiversion sidonta, ennen/jälkeen-fingerprintit ja historiaseuraaja, riippumaton Chat-2-katselmointi sekä normaalit CI/F25/GK-portit. Ei uutta GI-lukua, GK-arvoa, hyväksyntää, tuotantomuutosta tai main-kirjoitusta.
