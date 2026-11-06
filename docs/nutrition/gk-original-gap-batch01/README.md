# Alkuperäisten reseptien GK-puutteet: ensimmäinen rajattu erä

## Tavoite ja toteutettu suunnitelma

Lähtö-main on `944e3e2830d466933c99829d01172fb44f1be51f`. Ensin toistettiin nykyinen laskenta, sitten muodostettiin kaikkien 170 alkuperäisen HOLDin jono ja valittiin viisi rajattua, yhden nykyisen estetyypin tapausta. Tavoitteena on alkuperäisen ohjeen ratkaiseminen ilman ainesmäärien tai valmistuksen vaihtoa. Valinta ei ole tieteellisen hyväksynnän tai julkaisukelpoisuuden paremmuusjärjestys.

Toteutus on `site/scripts/gk-original-gap-inventory.ts`: se muodostaa jonon, erottaa aiemmat variantit tutkimusvertailuista nykyisellä scope-resolverilla ja tuottaa viiden tapauksen lähdekomponentit. `baseline.json` sitoo kaikki 326 täydellistä alkuperäistulosobjektia, 87 täydellistä lisäversiota, 326 alkuperäistekstiä, makrolaskentatiedostot sekä nimetyt lähde-/syöte-/menetelmätiedostot. Muutos pysäyttää vanhan tutkimuspaketin käytön. Git-esi-isyys tarkistetaan; pelkkä saman niminen hakemisto ei kelpaa lähtötilaksi.

## Ensimmäisen erän tulokset

| Alkuperäinen ohje | Varmennettu este | Seuraava tarvittava näyttö |
| --- | --- | --- |
| Siemengranola | Poisjätöt 2,06375 g CHO/annos. Voin 0,06 g:n ratkaisemisen jälkeenkin 2,00375 g ylittää rajan. | Muu alkuperäiseen soveltuva komponenttinäyttö; ei EDEKA-vaihtoa tai kanelioletuksen automaattista siirtoa. |
| Pad see ew, konjac | Poisjätöt 2,6585 g. Valkopippurin koko 0,5 g:n osuuden ratkaiseminen jättäisi 2,1585 g. | Todellinen pippurimäärä ja lisäksi kastikkeiden näyttö. Pippuria tai kastiketta ei poisteta. |
| Maksa ja pekoni | 500 g / 4 annosta, Fineli 5 g CHO/100 g: 6,25 g CHO/annos; GI puuttuu. | Alkuperäistä maksaa ja paistoa koskeva GI-/menetelmäsoveltuvuus, ei #227:n toisen version hyväksynnän siirtoa. |
| Paella | 1 l liemi on syötteessä 1000 g. Fineli 0,427 g/100 g antaa 1,0675 g/annos. | Alkuperäisen liemen natiiviyksikkö, koostumus ja tarvittaessa tiheys. Litraa ja kiloa ei yleisesti samasteta eikä tuotetta vaihdeta rajan vuoksi. |
| Pad thai, konjac | AFCD F009081:n puhdas tamarinditahna: 30 g × 57,4 / 100 / 4 = 4,305 g CHO/annos. | Tahnan ja käsittelyn GI-soveltuvuus; koostumustietue ei ole GI-hyväksyntä. |

Kaikki viisi jäävät HOLDiin. Uusia luotettavasti laskettavia alkuperäis-GK-arvoja: **0**. Alkuperäiset määrät, valmistus, makrot, hyväksytyt GK-arvot, lähderajaukset ja hyväksyntäkuitit säilyvät. Raportti ei myönnä sisältö-, lähde- tai julkaisuhyväksyntää. Lähteitä ei ole haettu uudelleen ilman uutta perustetta: tässä korjataan jatkotyön kohdistus ja estetään vanhojen versioiden uudelleenkäyttö. Baozi, moussaka ja bubur sumsum jäävät edellisen lähdeselvityksen HOLDiin; pandanin määrää tai syötävää osuutta ei päätellä.

## Toistaminen ja turvallisuus

Aja repon `site`-hakemistossa ensin `npm run audit:glycemic-load` (tarvittaessa `npm run content:sync` ennen sitä), sitten `npx tsx scripts/gk-original-gap-inventory.ts`. Tuloste menee vain `tmp/nutrition/gk-original-gap-batch01.json`-tiedostoon. Katselmoitu snapshot on `inventory.json`; sen on vastattava uutta tulosta täsmälleen. `plan.json` säilyttää konkreettiset näyttövaatimukset.

Negatiiviset testit kattavat muuttuneen alkuperäistuloksen, hyväksytyn variantin, reseptin ja koostumuslähteen, julkaisuluvan ujuttamisen suunnitelmaan, jo lasketun reseptin väärän valinnan sekä variantin virheellisen laskemisen alkuperäiskattavuudeksi. Granolan ja pippurin numeeriset oikopolut tarkistetaan erikseen. Tuotantolaskennan regressiot ajetaan rinnalla. Ei ajonohjaimen aktivointia, CI-massauusintoja, mergeä tai deployta.
