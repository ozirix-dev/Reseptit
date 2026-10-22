# Reseptit V1.4 – suorituskyky

Päiväys: 22.10.2026, Europe/Helsinki. Vertailupohja:
`f9d915e5439527fccb2cd4ee2c26ff0f76a09207`.
PR-haaran labramittaus, ei tuotantojulkaisu. Sisältö: 119 lähdereseptiä,
476 kieliversiota ja 480 reittiä.

## Valittu ratkaisu

Kielikohtainen täysi paketti olisi yksinkertainen, mutta yksittäinen resepti
siirtäisi silti kaikki saman kielen ohjeet. Reittikohtainen data rajaa
hakemiston yhden kielen hakutiivistelmiin ja reseptin yhteen täyteen tietueeseen.
Kielilinkit ovat kevyitä polkuja. Mittaus alla puoltaa reittiratkaisua.

HTML sisältää saman turvallisesti serialisoidun lähtödatan kuin Reactin
ensirenderöinti. Ensilatauksella ei tarvita JSON-hakua. Navigointi hakee
SHA256-tiivisteellä nimetyn JSONin. Muistivälimuisti säilyttää 24 reittiä;
query-muutos ei hae dataa. Vanhentuneen tai virheellisen JSONin virhe näyttää
lokalisoidun linkin sivun lataamiseksi uudelleen. Pages hallitsee HTTP-cachea.

## Menetelmä ja rajat

Windows, Node 24.14.1, asennettu Brave. Lighthouse, kolme onnistunutta ajoa
jokaiselle viidelle URL:lle mobiilissa ja työpöydällä. Paikallinen HTTP-palvelin
gzip-6-pakkauksella ja kylmä välimuisti. Mobiili käyttää oletuksen simuloitua
hidasta verkkoa/CPU:ta; työpöytä erillistä desktop-configia. Kuvat haettiin
samoista julkisista osoitteista, joten verkkovaihtelu vaikuttaa tuloksiin.
Keskeytynyt selaimen käynnistys jatkettiin puuttuvista ajoista.

[Mittausdata](2026-10-22-v1-4-performance-data.json) sisältää asetukset ja
jokaisen hyväksytyn ajon tulokset. INP:tä tai luotettavaa erillistä hydraation
kestoa ei mitattu. TBT ei ole INP. Viten gzip ja palvelimen gzip-6 voivat erota.

**Verkosta mitattu JavaScript: 346 514 → 115 419 tavua, vähennys 66,7 %.**

Mobiilin LCP parani kaikissa viidessä kohteessa ja hakemiston CLS poistui.
Työpöytähakemiston LCP muuttui noin 0,84 sekunnista 1,00–1,04 sekuntiin
(+0,17–0,20 s). Tämä on näkyvä kompromissi; kaikkien mittarien ei väitetä
parantuneen. Performance on 98–99 ja CLS 0. Reseptien työpöytä-LCP parani.
Toisen ja kolmannen hakemistokuvan esilataus on rajattu 700/1100 px:n leveyksiin.
Mobiilissa kolmea kuvaa ei pakoteta eager-tilaan.

Suuret kuvat hallitsevat edelleen työpöytähakemiston noin 5,2 MB:n latausta.
Responsive-kuvaversiot ovat seuraava erillinen optimointikohde.

## Moduulianalyysi

Viten/Rolldownin `renderedLength` on ennen lopullista minifiointia raportoitu
moduulimitta, ei yhteenlaskettava gzip-siirtokoko. Raakarivit ovat mittausdatassa.

| Ryhmä | Ennen | Jälkeen |
|---|---:|---:|
| React, React DOM, Router ja scheduler | 773469 | 773292 |
| Koko reseptidata | 1439137 | 0 |
| Reittimanifesti | 0 | 29578 |
| Sovelluskoodi | 37129 | 39189 |
| Viten apuosat | 5379 | 5379 |

## Skaalautuvuuden rajaus

119/250/500-reseptin fixturet kloonaavat olemassa olevaa sisältöä yksilöllisillä
tunnuksilla. Fixturejä ei kirjoiteta julkaisuaineistoon. Yksi ajo per koko;
hakuajan mediaani 100 saman kyselyn ajosta. Pipeline sisältää datan muodostuksen,
Viten ja SSR:n, ei npm ci:tä, koko Markdown-/kuvavalidointia tai levy-I/O:ta.
Virtualisoidun baseline-paketin gzip eroaa fyysisen buildin gzipistä.
Ajoajat ovat suuntaa-antavia. Hakualgoritmi ei muuttunut.

## Tarkistus

Reittidata-, turvaserialisointi-, latausvirhe-, cache- ja selainhistoriatestit
täydentävät nykyisiä testejä. Selaimella tarkistetaan neljä hakemistoa ja
reseptiä, leveydet 320/375/390/768/1024/1440, kuvat, JavaScriptitön HTML,
query-URL:t ja konsolivirheet. Lopulliset komennot ja CI ovat PR:n näytössä.

## Koot

| Mittari, tavua | Ennen | Jälkeen |
|---|---:|---:|
| js pakkaamatta | 1714648 | 363779 |
| js gzip-6 | 347046 | 116380 |
| css pakkaamatta | 9075 | 9379 |
| css gzip-6 | 2579 | 2639 |

## Lighthouse-mediaanit

Lighthouse 13.5.0. kB = 1000 tavua.

| Näkymä / reitti | Perf ennen→jälkeen | LCP ms | CLS | TBT ms | Pyynnöt | Siirto kB | Kuvat kB |
|---|---:|---:|---:|---:|---:|---:|---:|
| mobile `/` | 68→93 | 4129→3128 | 0.280→0.000 | 31.5→50.0 | 12→11 | 2194.6→1756.6 | 1830.7→1603.2 |
| mobile `/kermainen-lohipata/` | 79→90 | 4833→3568 | 0.000→0.000 | 47.0→42.0 | 5→5 | 695.7→465.2 | 343.3→343.3 |
| mobile `/en/recipes/` | 68→93 | 4114→3107 | 0.280→0.000 | 32.5→51.0 | 12→11 | 2168.2→1676.3 | 1804.7→1523.8 |
| mobile `/sv/recept/proteinrik-makaronilada-med-kottfars/` | 83→95 | 4060→2794 | 0.000→0.000 | 25.5→28.0 | 5→5 | 553.7→323.3 | 201.0→201.0 |
| mobile `/th/recipes/makaroni-op-nuea-bot-protein-sung/` | 84→96 | 3952→2742 | 0.000→0.000 | 19.0→30.0 | 5→5 | 554.2→323.8 | 201.1→201.0 |
| desktop `/` | 98→98 | 845→1045 | 0.085→0.000 | 0.0→0.0 | 28→28 | 5419.1→5208.7 | 5055.2→5055.2 |
| desktop `/kermainen-lohipata/` | 99→100 | 898→722 | 0.000→0.000 | 0.0→0.0 | 5→5 | 695.7→465.3 | 343.3→343.4 |
| desktop `/en/recipes/` | 98→99 | 836→1004 | 0.085→0.000 | 0.0→0.0 | 28→28 | 5418.7→5207.7 | 5055.2→5055.2 |
| desktop `/sv/recept/proteinrik-makaronilada-med-kottfars/` | 100→100 | 777→599 | 0.000→0.000 | 0.0→0.0 | 5→5 | 553.7→323.3 | 201.1→201.1 |
| desktop `/th/recipes/makaroni-op-nuea-bot-protein-sung/` | 100→100 | 769→599 | 0.000→0.000 | 0.0→0.0 | 5→5 | 554.2→323.8 | 201.1→201.0 |

## Fixturevertailu

| Reseptejä/kieli | JS gzip kB ennen→jälkeen | Pipeline ms ennen→jälkeen | Haku ms ennen→jälkeen | FI täysi JSON gzip | FI hakemisto gzip | Yksi resepti gzip |
|---|---:|---:|---:|---:|---:|---:|
| 119 | 355.8→115.1 | 2069→1930 | 15.21→15.67 | 52009 | 20663 | 1015 |
| 250 | 631.9→124.6 | 3247→3252 | 27.67→27.87 | 108725 | 42943 | 1015 |
| 500 | 1159.0→143.2 | 8113→5882 | 57.44→62.31 | 216774 | 84912 | 1015 |

## Kielikohtainen data

| Kieli | Täysi sisältö raw/gzip tavua | Hakemistodata raw/gzip | Esimerkkiresepti raw/gzip |
|---|---:|---:|---:|
| fi | 313664/52009 | 120890/20663 | 2593/1015 |
| en | 302548/50322 | 113111/20051 | 2487/947 |
| sv | 302870/51171 | 114376/20258 | 2470/982 |
| th | 527481/61986 | 189198/24655 | 4729/1411 |

Paikallinen lopputarkistus: npm ci, 25 yksikkötestiä, 2 käännöstestiä, 2 kuvatestiä, tuotantobuild (480 reittiä), 7 staattista testiä, 2 selaintestiä Bravella, npm audit (0 haavoittuvuutta), Markdown-lint ja git diff --check läpäisivät. SSG-testin preload-laskenta erottaa Reactin ensimmäisen kuvan esilatauksen kahdesta leveysrajatusta vihjeestä.

