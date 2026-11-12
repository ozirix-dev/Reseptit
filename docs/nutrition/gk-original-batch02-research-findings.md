# Alkuperäisreseptien GK-tutkimus, erä 02

Havainnot on tarkistettu mainin commitia `35066c0` vasten. Laskentasyötteen
vertailutiedot ovat [GK-pilotin syötteessä](glycemic-load-pilot-input.json).
[Lähtöaineisto #292](https://github.com/ozirix-dev/Reseptit/blob/20bfcefb621a2bafa16f240591c7749fe8023fc5/docs/nutrition/gk-original-solutions-batch02/README.md)

## VHH-mansikkakakun alkuperäisohje

**GK:ta ei voida määrittää luotettavasti (`NO_RELIABLE_GK`).**
Aiempi ehdollinen laskelma käytti maitotuotteiden ja hedelmien
ryhmäkeskiarvoja. Niiden soveltuvuutta kuohukermalle, maitorahkalle ja
tuoreelle mansikalle ei osoitettu. Mansikkaa on 250 g kymmeneen annokseen,
joten sen osuus on AFCD F008952:n perusteella 1,4 g imeytyvää hiilihydraattia
annosta kohti, yli yksittäisen poisjätön rajan. Vuoden 2002 taulukon
julkaisematon mansikkahavainto ei ratkaise estettä.
[Atkinson ym., taulukko 1](https://ajcn.nutrition.org/article/S0002-9165%2822%2900494-4/fulltext)
· [Lähdesoveltuvuuden katselmointi #292:ssa](https://github.com/ozirix-dev/Reseptit/pull/292#issuecomment-6663404956)

Nestemäisen vaniljauutteen 5 ml:n viitemassa on 4,3 g. Käytetyn uutteen
koostumus ja vastaavuus viitetuotteeseen on vielä varmistettava. Viitemassa
auttaa määräkysymyksessä, ja mansikan GI-näyttö jää edelleen avoimeksi.
[Health Canada CNF 216](https://aliments-nutrition.canada.ca/cnf-fce/serving-portion?id=216&lang=eng&wbdisable=true)

## Muut tutkimuksessa avoimet havainnot

- **Bulgogi.** Kahdelle keskikokoiselle kevätsipulille saadaan 30 g:n
  viitemassa. Alkuperäisen 60 ml:n soijakastikeannoksen viitemassa on
  Fineli 31:n desilitramitalla 72 g. Arvioi vielä syötävän sipuliosan
  koostumus sekä riisin, soijakastikkeen ja fariinisokerin GI-soveltuvuus.
  [Health Canadan kasvistaulukko](https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/nutrient-data/table-4-vegetables-vegetable-products-nutrient-value-some-common-foods-2008.html)
  · [Bulgogin tutkimuslaskelma](https://github.com/ozirix-dev/Reseptit/blob/20bfcefb621a2bafa16f240591c7749fe8023fc5/docs/nutrition/gk-original-solutions-batch02/case-bulgogi.json)
- **Keto-mutakakku ja keto-suklaakeksit.** Tavallisen suolan koostumustieto
  ratkaisee suolarivin hiilihydraattiosuuden, ja ripauksen massa jää
  avoimeksi. Tutkimusmallissa kaikki positiiviset hiilihydraattiosuudet
  jäivät pois laskennasta, joten mallin nollatulos ei riitä kokonais-GK:ksi.
- **Mala xiang guo ja pellavapuuro.** Lootusjuuren kappalemitta vaatii
  syötävän osan punnituksen tai perustellun viitemassan. Pellavapuuron
  kookosjauho tarvitsee oman koostumuslähteen. AFCD F002987 kuvaa kuivattua
  kookosraastetta.
- **Hernekeitto savupotkalla.** Alkuperäissyöte yhdistää savupotkan raakaan
  vähärasvaiseen porsaan ulkofileeseen (AFCD F007037). Selvitä savupotkaa
  vastaava koostumus laakerinlehden ja tarjoiltavan sinapin lähteiden rinnalla.
