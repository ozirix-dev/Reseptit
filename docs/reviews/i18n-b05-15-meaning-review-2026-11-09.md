# Erä B05 – 5 FI-reseptin 15 EN/SV/TH-julkaisukäännöksen merkityskatselmointi

9.11.2026. AI-lähdevertailu (ChatGPT), ei ihmistarkistusta eikä koepaistoväitettä.
FI main: 7a21ed52fecdc18a1e862f66a75cecd20f497a87; käännösluonnosten #356 HEAD: 543c2e5dbbd9a2ffb7c945695eab123f8279fe3a.

## Rajaus ja lähdesuoja

15 locale-tiedoston status: draft → published. Yhtään suomenkielistä FI-reseptiä ei muuteta; GK80/GK100:n raakatekstilukot säilyvät. Julkaistut kieliparit kirjataan sivurekisteriin meta/kaannokset/published-translation-pairs.json. Yhteiseen semanttiseen SHA-256-rekisteriin lisätään 15 ajantasaista lähde- ja käännöstietuetta. Aiemmat tietueet säilyvät.

## AI:n suomenkieliseen lähteeseen vertaamat olennaiset rajat

| Resepti | Merkitys ja thai-takaisinkäännöksen avainkohdat |
| --- | --- |
| meksikolainen-huevos-a-la-mexicana | 110 g kuoretonta kananmunaa, 13,5 g öljyä, sipuli 55 g, jalapeño 15 g ja tomaatti 125 g; koko pannuneste 2 annokseen, ei tortillaa. TH kypsennys ja matalan GL-luottamuksen/insuliinin varoitus säilyvät. |
| karibia-callaloo-munakas | Pinaatti 150 g, sipuli 50 g, kevätsipuli 12 g, timjami 6 g, öljy 13,5 g ja kuoreton muna 110 g. Peitetty kypsennys, pannuneste mukaan. TH ผักปวยเล้ง viittaa pinaattiin, ei amaranttiin. |
| valimerellinen-farinata-aamupalaksi | Kikhernejauho 100 g, vesi 150 ml, oma 1 rkl paistoöljyä; 220 °C / 200 °C kiertoilmalla, vuoka 20–22 cm, turvotus 20 min, paisto 20–25 min ja lepo 5 min, 2 annosta. TH säilyttää kiertoilmarajan ja veden määrän. |
| rendang-padang | FI:n #367-korjattu kurkuma 1 tl mukana vaiheessa 2. Naudanlapa 900 g, täysrasvainen kookosmaito 800 ml, kuiva jasmiiniriisi 300 g; 3–4 h haudutus, kuivaan rendangiin ei lisätä vettä loppuvaiheessa. TH: kurkumajauhe, maustetahnan hienonnus ja nesteen vähentyminen. |
| sate-ayam | Kana 700 g, erillinen marinadi (soijakastike 32 g + fariini 18 g) ja kastike (soija 16 g + fariini 9 g, maapähkinävoi 150 g, kookosmaito 200 ml). 30 min jääkaappimarinointi, kana täysin kypsäksi, maapähkinäallergiavaroitus. TH säilyttää marinadi-/kastike-erottelun ja veden sallimisen kastikkeen koostumukseen. |

Kaikissa 15 parissa AI:n rakennetarkastuksessa ainesosarivien lukumäärä ja järjestys, kaikki numeeriset ainemäärät, annosmäärä, kokonaisaika, ravintoarvojen neljä kenttää ja kuvapolku vastaavat suomenkielistä lähdettä. Aiemman 9 käännösparin PR #356:n merkitystodisteet vastasivat nykyisiä semanttisia FI- ja käännös-SHA-256-tiivisteitä. Rendangille ja sataylle tuotettiin kuusi uutta tietuetta samaa schema-normalisointia käyttäen. Tiivistelaskenta validoitiin aiemmin julkaistun bulgogi-parin tunnettuja tiivisteitä vasten.

**P2 satay:** FI:n kuvan alt-teksti mainitsee kurkun ja punasipulin, vaikka niitä ei luetella laskettuihin ainesosiin. Käännökset säilyttävät kuvan kuvauksen, mutta eivät lisää uusia ainemääriä. Avoin toimituksellinen havainto, ei tiedossa olevaa P0/P1-estettä.

## Julkaisuportit (suljetaan CI-näytön jälkeen)

- [ ] Täsmälleen tämän HEADin changed-content ja strict translation audit PASS
- [ ] Kaikki yksikkö-/ravinto-/GK-testit ja julkaisu-build PASS
- [ ] PR #356 ja #357 säilyvät Draftina eikä niiden muutoksia kopioida julkaisuun
- [ ] Vasta testien jälkeen Ready ja merge; Pages-deploy varmistetaan mainissa

status-kenttä ei kuulu reseptin merkitys-SHA:n normalisointiin, mutta sisällön muuttuessa tarkistus vanhenee. Ei koepaisto- eikä ihmiskatselmointiväitettä.
