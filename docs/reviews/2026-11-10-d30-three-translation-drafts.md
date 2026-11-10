# D30: kolmen FI-lähteen 9 EN/SV/TH-luonnosta (10.11.2026)

Tämä on **Draft-pilotti**, ei käännösjulkaisu eikä syntyperäisen kielenkäyttäjän tarkastus. Lähde-main `efc8ce70fcac2ba5961e3aea528c522116ec5599`. Kaikki kolme alkuperäistä FI Markdown -tiedostoa ja niiden blob-SHA:t ovat D30:n päähaaraan yhdistetyssä `meta/kaannokset/d30-source-worklist.json`-työjonossa.

## AI-lähde- ja merkityskatselmointi

- `lahi-ita-taatelipuuro-tahinilla`: 100 g 0,5–0,6 mm kaurahiutaleet, 300 g täysmaito, 10 min haudutus, 10 g kuivatut kivettömät taatelit, 2,1 g kardemumma ja 15 g makeuttamaton tahini. Kolmen kielen valmistus pitää kaikki punnitut aineet annoksessa. Ravintoarvojen oikeellisuutta ei laskettu uudelleen.
- `pohjoisafrikkalainen-minttutee-kaurapuuro`: 100 g kaurahiutaleet ja 500 g vesi, 10 min; 200 g maito, 6 g **syötävät** tuoreet mintunlehdet ja 20 g hunaja. Erottelu siivilöidyn minttuhaudukkeen vaihtoehtoon on säilytettävä, eikä GK-arviota siirretä tuolle vaihtoehdolle.
- `karibia-johnny-cake`: 100 g vehnäjauho, 60 ml maito, 15 g voi, 5 g leivinjauhe ja 1 rkl neutraalia paistoöljyä. Pannulla paistettavat litteät kiekot, ei uppopaistoa eikä erillistä täytettä.

**Tämän pilotin rajat:** EN/SV/TH:n yhdeksän tiedostoa ovat `status: draft`, eikä FI-reseptejä, ravintoarvoja, GK/GI-lähdesidontoja, julkaisurekisteriä tai semanttisten julkaisutodisteiden rekisteriä muutettu. Näille on vielä tehtävä täysi, käännöskohtainen tarkistus ja kirjattava ajantasaiset SHA-evidenssit ennen kuin niitä voidaan nostaa `published`-tilaan.

D30:n aiemman 8/22-lähdekarsinnan toinen AI-läpikäynti jätti viisi lisäreseptiä HOLDiin. 30:n joukosta **vain nämä kolme ovat jatkokäsittelyn ehdokkaita**, eivät automaattisesti hyväksyttyjä. Jos lähdetarkistus löytää annos- tai ravintovirheen, myös näiden kolmen kielijulkaisu estetään.

## 10.11.2026: täysmaitotäsmennys ja luonnosten semanttiset SHA:t

Minttupuuron `docs/nutrition/calculations/pohjoisafrikkalainen-minttutee-kaurapuuro.json` käyttää 200 g Finelin `fineli-689-release-20` **täysmaitoa**. FI-lähteen valmistusohje sanoo jo täysmaito, mutta alkuperäisen ainesosarivin sana on väljä. [FI-näyttökorjauksen PR #394](https://github.com/ozirix-dev/Reseptit/pull/394) on erillinen. Tässä Draftissa korjattiin **kaikkien kolmen** minttupuuron käännöksen maitonimike ja vaihe 2 täysmaidoksi: whole milk / helmjölk / นมเต็มมันเนย. Grammoihin, annoksiin, valmistusjärjestykseen tai ravintoarvoihin ei koskettu.

Kaikki yhdeksän kieliversiota vertailtiin AI-katselmoinnissa alkuperäisen FI-raakalähteen määrien, annosten, pääraaka-aineiden, työvaiheiden ja neljän makrokentän kanssa. Alla ovat **Draft-tekstien** versiosidotut tiivisteet, eivät julkaistujen kielten hyväksyntämerkinnät. `source_hash` perustuu kanoniseen FI-raakatekstiin; FI-näyttöoikaisu ei muuta sitä. `translation_hash` perustuu juuri tässä PR:ssä olevaan käännöstekstiin.

| FI-resepti | Kieli | source_hash | translation_hash |
| --- | --- | --- | --- |
| `lahi-ita-taatelipuuro-tahinilla` | en | `fb87fba84974be12d0161196ae7d46b988e3407a4fbc25f09c7a8054f51fd154` | `3c23727e6e7e5c657162e1220d71f1c9335b481ce043d62fdbcccd4be519a38e` |
| `lahi-ita-taatelipuuro-tahinilla` | sv | `fb87fba84974be12d0161196ae7d46b988e3407a4fbc25f09c7a8054f51fd154` | `82b9cb4387dd52eb027849d7c7b8430f5d3fa66fae32ab79a183c94e20712b01` |
| `lahi-ita-taatelipuuro-tahinilla` | th | `fb87fba84974be12d0161196ae7d46b988e3407a4fbc25f09c7a8054f51fd154` | `12ff5164c4613ecb3dd9dab09921987825c3c82aed362a867dde2a2d23ed6f44` |
| `pohjoisafrikkalainen-minttutee-kaurapuuro` | en | `c6c4d0a46470842891d7efb25d61a060225a040af49f892857ed1cd75e6e2f20` | `12ffe31415eb36039826801537ab2789f86769388bc3d8b527179c5373ff58a9` |
| `pohjoisafrikkalainen-minttutee-kaurapuuro` | sv | `c6c4d0a46470842891d7efb25d61a060225a040af49f892857ed1cd75e6e2f20` | `856307f420cec918d496776a7e30cf813620f48465b68ceda0ce69bc0fe15b5e` |
| `pohjoisafrikkalainen-minttutee-kaurapuuro` | th | `c6c4d0a46470842891d7efb25d61a060225a040af49f892857ed1cd75e6e2f20` | `7d4e3628e195f4a71ff2bff9e3b7ae4d2a811fec359defc9b261fc0d805e1b07` |
| `karibia-johnny-cake` | en | `1c540f72f20c01ffc08923033650fd37f43f657f066273f8ac8a5df4f3fd0c1a` | `5c0efbdb26823c114d74174073d4cd80f1e18eb3143b766025ecbb467b0843db` |
| `karibia-johnny-cake` | sv | `1c540f72f20c01ffc08923033650fd37f43f657f066273f8ac8a5df4f3fd0c1a` | `b3abc86c1e0372f36ef858499c735df257804fd2954fd68694f351202a12763a` |
| `karibia-johnny-cake` | th | `1c540f72f20c01ffc08923033650fd37f43f657f066273f8ac8a5df4f3fd0c1a` | `985c8a9144479693a140d98f3c107104e9efe6504fdd8647a4c2b68337457603` |

Kaikki 9 käännöstä ovat edelleen `status: draft`. Ei uusia `codex-review-evidence.json`-julkaisuhyväksyntöjä, ei julkaisurekisterimuutosta eikä väitettä riippumattomasta ihmiskielitarkastuksesta, koepaistosta tai uudesta GK-laskennasta. Ennen julkaisu-PR:ää on tarkistettava PR #394:n CI, nykyiset source- ja translation-hashit sekä Pages-julkaisun erillinen tila.
