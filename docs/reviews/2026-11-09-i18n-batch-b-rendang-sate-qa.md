# Erä B – lähdevertailun pilotti 2 reseptiä / 6 kieliparia (9.11.2026)

**Tarkistaja:** ChatGPT, ei ihmiskatselmointia. **Käännös-HEAD:** `6aadea928b7c3aa5fe2f1fdfa8eac27f0d56883d`. **FI:** saman commitin sisältämä lähde. Molemmat `status: draft`. Vain riippumaton tekstin lukemiseen perustuva arvio; ei automaattisen rakennetestin eikä julkaisuportin korvike.

## Rendang Padang (FI → EN/SV/TH)

- 12/12 ainesosariviä sekä niiden määrät ja yksiköt säilyvät: liha 900 g, kookosmaito 800 ml, salotti 150 g, valkosipuli 5 kynttä, inkivääri 55 g, chili 2 kpl, sitruunaruoho 2, makrutlehdet 4, kurkuma 1 tl, suola 1 tl, kookos 50 g, kuiva riisi 300 g. Makrot, annoskoko 6 ja kokonaisaika 300 min yhtenevät.
- Vaiheiden merkitys ja järjestys 5/5; kuiva kypsennys ilman loppuvaiheen lisävettä, 3–4 tuntia hyvin miedolla lämmöllä, rasvan erottuminen ja pohjaanpalamisen välttäminen säilyvät.
- Thai-takaisinkäännöksen avainsisältö: mausteista tehdään tahna, kookosmaito kuumennetaan, naudanliha haudutetaan ilman kantta 3–4 tuntia, lopuksi kuivataan ja riisi keitetään erikseen. Ei löydetty kiellettyä ainelisäystä.
- **P1 FI-LÄHDEVIRHE / HOLD:** kurkuma 1 tl sisältyy FI-aineksiin mutta ei FI-valmistukseen; kolme käännöstä seuraavat puutteellista ohjetta. Tarkoituksenmukainen keittiökorjaus on lisätä jo ilmoitettu kurkuma maustetahnan kuumentamisvaiheeseen muuttamatta määriä. FI:n mahdollinen GK-/lähdesinetti arvioitava ennen muutosta. Älä kirjaa `pass`-todistetta tai julkaise näitä kolmea kieliversiota.
- Huomio: 300 g kuivaa jasmiiniriisiä kuuluu annoslaskentaan; ohjeen tarjoilu riisin kanssa ei ole lisuke laskennan ulkopuolelta.

## Sate ayam (FI → EN/SV/TH)

- 12/12 ainesosariviä ja määrät vastaavat FI:tä: 700 g kanan reisilihaa, marinadiin 32 g soijaa + 18 g fariinisokeria, kastikkeeseen 16 g soijaa + 9 g fariinisokeria, 150 g maapähkinävoita, 200 ml kookosmaitoa sekä muut mausteet ja limetti. 4 annosta, 60 min, makrot ennallaan.
- Vaiheiden merkitys 5/5: 30 min kylmämarinointi, tikkujen liotus, kastike miedolla lämmöllä, grillaa/paista kauttaaltaan kypsäksi, tarjoile limetin kanssa. TH-takaisinkäännös säilyttää erilliset soija- ja sokerimäärät, marinoinnin jääkaapissa, kastikkeen vesiohennuksen ja maapähkinäallergian tarkistamisen.
- FI:n `kecap manis`-ilmaus tarkoittaa lähteessä omaa makeaa soija-sokerimarinadia, ei erillistä pullosta lisättävää kecap manis -kastiketta. Käännökset selventävät tämän oikein.
- **P2 lähdekuvaus:** kuvatekstissä esiintyvät kurkku ja punasipuli, mutta ne eivät kuulu reseptin syötävien ainesten luetteloon eivätkä laskettuun annokseen. Ei lisätä niitä ruokaan; kuvatekstin selite voidaan täsmentää myöhemmin.
- **Laatuarvio:** FI–EN/SV/TH:n tarkastetussa sisällössä ei havaittu P0/P1-merkityseroa. Tämä on tekstin AI-katselmointihavainto, ei julkaisu-QA:n pass, sillä SHA-sidottu rekisteri, lähdekuvan riskipäätös ja lopullinen CI-julkaisupolku ovat vielä auki.

## Portti

Kaikki kuusi kielitiedostoa pidetään `draft`. Älä muuta `codex-review-evidence.json`-rekisteriä tämän osaarvion perusteella. Päivitä rendangin FI-lähde oman GK-porttinsa kautta, käännä lähdemuutos kaikkiin kolmeen kieleen, uusi merkitysvertailu ja semanttiset SHA:t vasta lopuksi.
