# Chat 3 – perinteinen ruskea kastike: nimettyjen tuotteiden ravintolähteet

**22.11.2026, PR #808, Chat 3. CANDIDATE / HOLD.** Tämä on ravintolaskennan lähtöaineisto, ei virallinen `docs/nutrition/calculations/`-todiste.

## Puljonki Signature Lihaliemi 1 l, EAN 6416796728013

**FI-reseptin määrä:** 500 ml käyttövalmista lientä.

- Valmistajan omat tuotetiedot: [Oscar Nordic, Puljonki Signature Lihaliemi 1 l](https://www.oscarnordic.fi/puljonki-signature/367-signature-lihaliemi-1-l.html).
- Riippumaton vähittäiskaupan saman EAN:n tarkistus: [S-kaupat](https://www.s-kaupat.fi/tuote/puljonkir-lihaliemi-1-l-tetra/6416796728013).
- Näiden yhteinen ilmoitettu koostumus **100 ml kohti**: rasva 0,1 g, hiilihydraatit 0,6 g, proteiini 4,0 g, ravintokuitu 0,6 g, suola 0,69 g, energia 20 kcal. 
- Pelkästä **500 ml:n mitatusta tilavuudesta** suoraan tuotteen tilavuuspohjaisella ravintotaulukolla: rasva 0,5 g, ilmoitetut hiilihydraatit 3,0 g, proteiini 20,0 g ja ravintokuitu 3,0 g koko **neljän annoksen reseptierälle**. Nämä ovat vain liemen, eivät valmiin kastikkeen arvoja.
- **POLYL (sokerialkoholit):** valmistajan ja kaupan taulukoissa ei ole numeerista polyoliriviä. Arvo **UNKNOWN, ei nolla**. Hiilihydraattien kokonaismäärä on valmistajan EU-taulukossa, mutta se ei yksin korvaa projektin vaatimaa polyolitodistetta.
- **Muunnos:** Valmistaja ilmoittaa koostumuksen 100 ml kohti, ja resepti määrän millilitroina. Lähdearvojen osasumma ei vaadi tiheysarvausta. Nykyinen `nutrition-model.ts` kuitenkin hyväksyy `FoodRecord`-basisarvoksi vain 100 g -pohjaiset tietueet ja tarvitsee `IngredientInput`-massamuunnoksen. **Älä aseta 500 ml = 500 g ilman todistettua ainekohtaista tiheyttä**. Vaihtoehto olisi erikseen testattu tilavuusperusteisen, lähteen yksikön säilyttävä mallilaajennus.

## Kikkoman Naturally Brewed -soijakastike, tavanomainen ei-luomu, ei 'standard'-erikoisversio

**FI-reseptin määrä:** 4 g punnittua soijakastiketta.

- [Kikkoman, virallinen suomalainen tuotetieto](https://www.kikkoman.fi/ammattikeittioet/tuotteet/detail/fs-kikkoman-luonnollisesti-valmistettu-soijakastike): raaka-aineet vesi, soijapavut, vehnä ja suola; allergeenit **soija ja vehnä**.
- Valmistajan ravintotiedot **100 ml kohti**: rasva 0 g, hiilihydraatit 3,2 g, proteiini 10 g, suola 16,9 g. Tuote **ei** ole eri Kikkoman Standard- tai luomuversio.
- Resepti ilmoittaa 4 **grammaa**, mutta valmistajan taulukko 100 **millilitraa**. Tästä ei saa laskea komponentteja 4/100-kertoimella eikä väittää tilavuuden olevan 4 ml ilman tuotekohtaista tiheysarvoa.
- Kuitua ja polyoleja ei ole tässä valmistajan taulukossa erikseen. Arvot ovat **UNKNOWN**, eivät 0.
- Mallin pienen poisjätön ehdollinen tarkistusvaihtoehto: jos **vain 4 g Kikkomania** jätettäisiin laskennasta ja kaikki muut komponentit olisivat varmistettuja, massasta johdettu yläraja per neljä annosta on **enintään 1 g kutakin massana ilmoitettua makroa per annos** ja 9 kcal per annos, kun käytetään kaikille ravitseville makroille konservatiivista 9 kcal/g -kattoa. `nutrition-model.ts` sallii 1 g/makro ja 10 kcal/annos rajan, mutta tämä vaatii erikseen dokumentoidun poisjättöpäätöksen. **Jos myös mustapippuri jätetään pois, kumulatiivinen 1 g:n raja voi ylittyä.** Tästä ei synny automaattisesti `pass`-tilaa eikä oikeutta julkaista makroja.

## Muut FI-ainesosat ja valmistustila

| Ainesosa | Massa | Lähdetilanne |
| --- | ---: | --- |
| Voi | 35 g | Fineli #500 -kortti jo käytetty tämän PR:n valko- ja munakastikkeiden laskentakandidaateissa; varmennettava täsmäarvo viralliseen pakettiin |
| Vehnäjauho | 35 g | Fineli #110 -kortti jo käytetty tämän PR:n valko- ja munakastikkeiden laskentakandidaateissa |
| Mustapippuri | 1 g | Maustekortti ja POLYL-varmennus löytyvät toisen saman PR:n laskentakandidaatin AFCD-/Fineli-pohjalta; varmista nimenomaan 1 g rouhittuun/jauhettuun tilaan |
| Puljonki-liemi | 500 ml | Valmistaja + vähittäiskauppa: 100 ml -koostumus yllä, polyolit puuttuvat |
| Kikkoman-soijakastike | 4 g | Valmistajan 100 ml -koostumus yllä; ei tiheyttä eikä numeerista polyoli-/kuitutietoa |

Valmistuksessa vehnäjauho ruskistetaan 6–8 minuuttia, liemi lisätään, kastike hautuu 5 minuuttia. Nestettä haihtuu, mutta mitään ravintoainetta sisältävää ainesosaa ei ohjeen mukaan siivilöidä pois. Molemmat täsmätuotteet säilyttävät alkuperäisen reseptin allergeenit: **maito, vehnä ja soija**.

## Mitä oikeasti valmistui ja mitä puuttuu

**Valmista:** kaksi nimettyä tuotetta (ainesosat, tuotetunniste ja valmistajan hiilihydraatti/proteiini/rasvakoostumus) on dokumentoitu. Liemelle 500 ml:n tilavuuden suora osasumma voidaan laskea ilman arvattua tiheyttä. Näin ei tarvita valmistajakirjettä etiketissä jo julkaistuja arvoja varten.

**Avoinna:** POLYL-todiste ja muiden aineiden lopullinen `FoodRecord`-sidonta; Kikkomanin 4 g → ravintotaulukon 100 ml -muunnos tai perusteltu omission-budjetti; liemen tilavuusperusteinen laskentamalli tai ainekohtainen tiheys; `recipeNutritionInputHash`-sidonta ja oikea `site/scripts/nutrition-evidence.ts`-validointi.

**Julkaisutila:** `status: draft`, `checks.nutrition: pending`, `decision: hold`. Ei laskettuja neljää julkista makroarvoa eikä numeerista GK:ta. Chat-1 hoitaa Ready/merge-portit myöhemmin.
