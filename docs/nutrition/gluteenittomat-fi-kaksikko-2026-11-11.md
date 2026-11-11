# Gluteenittoman FI-ensijulkaisun ravintoarvo- ja tuotemuistio — 11.11.2026

**Rajaus:** vain `gluteeniton-perunajauhokakkupohja` ja `gluteeniton-durrapizzapohja`. Tämä muistio korvaa julkaistavan kaksikon osalta PR #422:n aiemman yleisen viiden reseptin laskentataulukon. Muut kolme jäävät Draft-työjonoon eivätkä kuulu tähän julkaisuun.

## Tuotevaihdon perustelu
Aiemmat laskelmat käyttivät Meira-leivinjauheen ilmoitettua C 17,6 g /100 g -arvoa kakkupohjassa, ja oletuksen mukaan pizzassa. Tässä julkaisussa määritetään [Dr. Oetker leivinjauhe 160 g, EAN 5701073066485](https://www.metrotukku.fi/fi/EUR/tuotteet/kuivatuotteet-ja-napostelu/dr--oetker-leivinjauhe-160g/5701073066485): C 19 g, P 0,1 g, R 0 g / 100 g. [Gluteeniton-jälleenmyyjämerkintä](https://www.confetti.fi/Dr-Oetker-leivinjauhe). Käytä vain pakkauksessa gluteenittomaksi merkittyä tuoteversiota.

Taikinan lisäys 1 tl leivinjauhetta arvioidaan 4 grammaksi, 3 tl 12 grammaksi. Valmistajien ravintoarvot voivat muuttua; käytettyjen pakkauksien merkinnät ratkaisevat.

## Perunajauhokakkupohja
- **10 annosta**.
- 4 munan syötävä sisältö oletettu 200 g; 1½ dl sokeria 132 g; [Finnamyl Helmi perunajauhoa](https://finnamyl.fi/tuotteet/perunajauhot-kuluttajille/) 1½ dl = 105 g (70 g/dl); leivinjauhe 4 g.
- Perunajauho: C 82 g, P 0,1 g, R 0 g / 100 g. Muna: C 0,3, P 12,6, R 9,2 /100 g. Sokeri: C 100, P 0, R 0 /100 g.
- Edellisen laskelman koko kakun C 219,404 g. Dr. Oetker -vaihdon vaikutus: 4 × (19−17,6)/100 = **+0,056 g**, joten uusi koko kakun laskennallinen C **219,460 g** ja 1/10 **21,946 g** ⇒ frontmatter **21,95 g**. P noin **2,53 g**, R noin **1,84 g** per annos; suuntaa antava energia noin **115 kcal**.
- Ei täytteitä tai kuorrutteita. Kokonaishiilihydraatti (sisältäen kuidun) ei ole laskettu; `carbs_total_per_serving_g: null`.
- Ei GK-arvoa, koska juuri tälle reseptille soveltuvat ainesosien GI-vastaavuudet eivät ole lukittuja.

## Durra-tomaatti-mozzarellapizza
- **4 annosta**. Lähdepohja: [Keliakialiiton gluteeniton durrapizza](https://www.keliakialiitto.fi/ruoka/reseptit/durrainen-pizzapohja/).
- Määrät: turkkilainen jogurtti 350 g; [Virtasalmen gluteeniton durrajauhoseos](https://www.virtasalmenviljatuote.fi/tuote/gluteeniton-durrajauhoseos-500g/) 3 dl = 195 g (65 g/dl); kuivahiiva 10 g; Dr. Oetker leivinjauhe noin 12 g; oliiviöljy 4 rkl noin 54 g; [Hungry Chef -kastike](https://lejos.fi/tuotteet/hungry-chef-pizzakastike/) 150 g; Lactalis-mozzarella valutettuna 200 g; kirsikkatomaatit 120 g, basilika 10 g, lisäksi mitattu suola.
- Edellisen laskelman C 44,05 g / annos pyöristettynä. Dr. Oetker -vaihdon C-vaikutus 12 × (19−17,6)/100 /4 = **+0,042 g/annos**. Tästä laskennallinen frontmatter-arvio **44,09 g/annos**, P **17,07 g/annos** ja R **32,83 g/annos**.
- **Öljyn epävarmuus:** kaksi ruokalusikallista paperille lisättävää öljyä sisältyy kaikkiin laskennallisiin arvoihin; jos 27 g öljyä jää paperiin, rasvan todellinen määrä olisi noin 6,75 g/annos pienempi. Tätä ei vähennetä ennakkoon ilman näyttöä.
- Kastike sisältää selleriä, jogurtti ja mozzarella maitoa. Kuten kakkupohjassa, `carbs_total_per_serving_g: null`; GK puuttuu.

## Yhteiset rajaukset ja julkaisuteksti
Ainesosakohtainen laskenta: syötävä raakapaino (g) × valmistajan C/P/R (g/100 g) /100. Summa jaettuna annoksilla. Kaikki täytteet, kuorrutteet ja leivinpaperin öljy ovat mukana silloin, kun ne ovat reseptissä. Veden haihtuminen voi muuttaa paistopainoa. Nämä ovat **laskennallisia ravintoarvioita, eivät laboratorioarvoja**. Fyysistä koepaistoa tai yksittäisten ostospakkausten tarkastusta ei ole tehty.

[Lainsäädännön mukainen gluteeniton-väite](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/ainesosat-ja-sisalto/gluteenittomat-ja-erittain-vahagluteeniset-elintarvikkeet/) koskee enintään 20 mg/kg gluteenia valmiissa tuotteessa; reseptin metadata ei ole mittaus. [Ristikontaminaatio](https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/ristikontaminaatio/) on estettävä oikeassa valmistuksessa. Reseptissä annetaan tuotevalintaehdot sekä tätä koskevat varoitukset. Keliakia ei ole sama asia kuin vehnäallergia.
