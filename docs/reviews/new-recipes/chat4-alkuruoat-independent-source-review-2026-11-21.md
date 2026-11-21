# Chat-4 – kymmenen suomalaisen alkuruoan lähde- ja turvallisuuskatselmointi
Päiväys: 2026-11-21
Työn omistaja: Chat 4
PR: https://github.com/ozirix-dev/Reseptit/pull/805

Tämä katselmointi koskee FI-luonnosten valmistuskelpoisuutta ja nelikielisen erän jatkorajoja. Julkiset koekeittiöreseptit ovat vertailuaineistoa, **eivät väite siitä, että Recipavo olisi valmistanut tai maistanut annokset**. Ei lupaa korvata yksittäisten tuotteiden elintarviketurvallisuustarkistusta.

## Päätös resepteittäin

| Resepti | Testattu vertailu ja poikkeama | Rajattu päätös |
| --- | --- | --- |
| Suolasienisalaatti | [Martat, Sienisalaatti](https://www.martat.fi/reseptit/sienisalaatti/): suolasienet, sipuli ja maitopohja; oma smetana-/ranskankerma-suhde eroaa. [Ruokavirasto](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/ruokasienet/sienten-kasittely/) vaatii lajikohtaisen esikäsittelyn. | Menetelmä kohtuullinen; **HOLD**, kunnes käytetty rouskulaji ja esikäsittely vahvistetaan |
| Lasimestarin silli | [K-Ruoka, helppo lasimestarin silli](https://www.k-ruoka.fi/reseptit/helppo-lasimestarin-silli): käyttövalmiit sillifileet, etikkaliemi ja 2–3 vrk maustuminen. Oma makeus ja kasvismäärä ovat muunnelma. | Valmistusmenetelmä lähteistetty; valmiin sillin tuotekohtainen säilytys tarkistettava |
| Graavisiika | [K-Ruoka, graavisiika](https://www.k-ruoka.fi/reseptit/graavisiika): n. vuorokauden graavaus; oma suola-/sokerisuhde eri. [Ruokavirasto, kala](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/): graavaus ei tapa loisia. | **HOLD:** raakana käytetyn fileen toimittaja, pakastuskäsittely ja listeriariski |
| Uunissa paistetut silakkarullat | [K-Ruoka, Silakkarullat](https://www.k-ruoka.fi/reseptit/silakkarullat): 600 g fileitä, uuni 200 °C ja 35–40 min kermassa. Korjattu oman alkuperäisen 190 °C / 20–25 min liian optimistinen oletus neljällä kielellä. | Aika- ja lämpötilamenetelmä nyt testatun ohjeen suuruusluokassa; kypsä kala tarkistettava |
| Muikunmäti-rieskarullat | [Arla, Muikunmäti-rieskarullat](https://arlaficmsproduction.azurewebsites.net/reseptit/muikunmati-rieskarullat/): rieskan käärintä toimii, mutta Arla käyttää erilaista muna-anjovistäytettä ja mätiä koristeena. [Ruokavirasto, kala](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/kala/). | **HOLD:** mädin pakastuskäsittely, listeria ja oman täytesuhteen arvio |
| Savupororullat kantarelleilla | [Valio, Pororullat](https://www.valio.fi/reseptit/pororullat/) ja [Martat, Kantarellitäyte](https://www.martat.fi/reseptit/kantarellitayte/). Oma yhdistelmä on itsenäinen sovitus. | Rullan ja kypsennetyn sienitäytteen menetelmät lähteistetty; lopullinen maku-/määräarvio odottaa |
| Pienet kantarellipiiraat | [Arla, Kantarellipiirakka](https://www.arla.fi/reseptit/kantarellipiirakka/): pienet vuoat, 200 °C, esipaisto 10 min ja jatkopaisto noin 15 min. Oma 8 + 18–22 min on arvio. | Menetelmä uskottava, muottikoko ja hyytyminen varmistettava; realistinen kokonaisaika korjattu 75 min |
| Punajuuricarpaccio vuohenjuustolla | [Haganol, punajuuricarpaccio](https://haganol.fi/reseptit/salmiakilla-maustettu-punajuuricarpaccio-vuohenjuustoa-ja-salmiakkihyyteloa/): kokonaiset punajuuret noin 200 °C tunnin ajan ja ohuet siivut. Oma marinadi ja lisukkeet eri. | Menetelmä uskottava; punajuuret paahdettava pehmeiksi koon mukaan; ei väitettä testatuista määristä |
| Sillikaviaari ruisnapeilla | [Valio, Sillikaviaari](https://www.valio.fi/reseptit/sillikaviaari/): valmis silli, muna, sipuli, crème fraîche ja yrtit. | Menetelmä ja annoksen luonne tuettu, mutta tuotekohtainen kala-/kylmäsäilytys tarkistettava |
| Nokkosletut puolukoilla | [Martat, Nokkosletut](https://www.martat.fi/reseptit/nokkosletut-2/): ryöppäys, noin 30 min taikinan turvotus ja puolukat. Lepoaika 10 → 30 min korjattu neljällä kielellä. [Ruokavirasto, nitraatti](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/nitraattia-sisaltavat-kasvikset/). | Valmistusperiaate tuettu, poimintapaikka ja lapsia koskeva nitraattirajoitus pidettävä mukana |

## Turvallisuus- ja julkaisurajat
- Kaikkien neljän kielen `status: draft` säilyy.
- FI-lähteiden ainesmäärät ja annokset pysyvät muuttumattomina. Kolmen aikakorjauksen vaikutus synkronoitu FI/EN/SV/TH-tiedostoihin.
- Ei numeroituja ravintoarvoja tai GK-arvoa ilman erillistä reseptikohtaista laskentaa; ei keinotekoisia nollia.
- Graavisiika ja muikunmäti ovat erityisesti **HOLD**, kunnes raaka-aineiden turvallisuus on dokumentoitu.
- Kuvat ovat tarkistesidotuissa keskustelun 720 × 720 WebP-tiedostoissa, eivät tässä vaiheessa Git-objekteina. **Ei YAML-kuvaviitteitä ennen kuvan todellista varmennettua tuontia.**
- Käännösten todellinen merkitys- ja lähde-SHA-katselmointi tarvitaan ennen käännösten julkaisemista.
- Täsmä-HEADin CI ja Repo Guard arvioidaan erikseen. Ei Readyä/mergeä eikä Cloudflare-tuotantojulkaisua tämän muistion perusteella.
