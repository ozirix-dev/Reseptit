# Reseptien ohje–ainesosatarkistus: kokkikorjaukset, erä 1

**Päiväys:** 2026-11-09
**Lähtötaso:** PR #358, automaattinen tarkistus 335 julkaistusta FI-lähdereseptistä.
**Lähderaportti:** https://github.com/ozirix-dev/Reseptit/pull/358

## Lukitut korjausperiaatteet

1. Säilytä ruokalajin tunnistettava luonne. Poista selvästi toisen reseptin geneeriset vaiheet.
2. Käytä vain jo ilmoitettuja ruokaan jääviä ainesosia. Älä lisää edes pientä öljy-, sokeri-, jauho- tai lisukemäärää ilman ravintoevidenssin tarkistusta.
3. Kypsennykseen käytettävä keitinvesi ei automaattisesti ole syötävä ainesosa. Taikinaan ja kastikkeeseen jäävä vesi on.
4. Säilytä alkuperäinen YAML:n `ingredients`, `servings`, ravintoarvot ja GI/GK-sidokset. Nämä eivät tämän erän tekstikorjauksissa muutu.
5. Ei väitettä suoritetusta koepaistosta. Kokkijärkeen perustuva kirjoitus ei ole sama kuin mitattu koekeittiötulos.
6. Korjauksille ei ole julkaistuja EN/SV/TH-käännöksiä tämän erän lähtötilanteessa; käännöksiin kohdistuvaa rinnakkaisen PR:n muokkausta vältetään.

## Korjatut 12 reseptiä

| Resepti | Olennainen korjaus |
| --- | --- |
| `indonesialainen-pisang-goreng-aamiaiseksi` | Banaanit leikkeiksi ja luettelon riisijauhotaikinaan; ei pihvi- tai raasteohjetta |
| `karibia-jamaikalainen-munakokkeli` | Tulinen tomaatti-timjamimunakokkeli ilman yleistä täytetaikinaa |
| `karibia-plantain-aamiaislautanen` | Paistettu ruokabanaani, muna, avokado ja lime omiksi komponenteikseen |
| `karibia-johnny-cake` | Jauho, leivinjauhe, voi ja maito oikeaksi pannuleipätaikinaksi |
| `kiinalainen-kevatsipulipannukakku` | Kevätsipuli ja seesamiöljy taikinakerrosten väliin; soijakastike dippinä |
| `kiinalainen-tomaattimunakas-riisilla` | Riisi keitetään; muna ja tomaatti pannulla; kevätsipuli lopuksi |
| `korealainen-gyeran-mari-kasviksilla` | Hienonnetut kasvikset munaseokseen, rullaus vähitellen |
| `malesialainen-mee-goreng-aamunuudeleilla` | Kypsennetty nuudeli, tofu, pavunidut ja munat yhdessä pannulla |
| `meksikolainen-munakokkeli-pico-de-gallolla` | Tomaatti-korianterilisuke ilman luettelosta puuttuvaa sipulia |
| `pohjoisafrikkalainen-harcha-juustolla` | Mannasuurimoista paksu pannuleipä; tuorejuusto tarjoiluun |
| `pohjoisafrikkalainen-maakouda` | Kypsä peruna, munat, persilja ja juustokumina pihviseokseksi |
| `vietnamilainen-banh-mi-munalla` | Valmis patonki, muna ja tuoreet porkkana-kurkkutäytteet; ei keksittyä pikkelöintiä |

## Kolmetoista erilliseen selvitykseen jätettyä reseptiä

Kahdeksan alla olevista oli saman PR #358:n **25 geneerisen valmistusohjepohjan** jäljellä olevaa tapausta. Lisäksi kaksi GK149-menetelmäpakettiin ja kolme GK100-hyväksyttyyn laskentapakettiin sidottua lähdetekstiä jätettiin pois korjaus-PR:stä.  Ei kosketa sokkona aines- eikä ravintotietoihin:

| ID | Miksi ei korjattu pelkällä tekstillä | Seuraava turvallinen ratkaisu |
| --- | --- | --- |
| `indialainen-poha-maapahkinoilla` | EN/SV/TH jo julkaistu; kaikki sisältävät alkuperäisen lähteen semantiikan | Korjaa FI + 3 käännöstä rinnakkain ja päivitä semanttinen katselmointievidenssi |
| `indonesialainen-bakwan-maissifritter` | Maissi–jauhotaikinaan tarvittava neste on luettelosta poissa | Varmista veden määritys ja nykyisen ravintolaskelman perustelut ennen aineslistan muutosta |
| `intialainen-aloo-paratha` | Aiempi HOLD: perunan kypsennys/täyttö puutteellinen ja tarjoilujogurtti luettelematon | Korjaa lähde ja erillinen HOLD-hyväksyntä, ravinto- ja mahdolliset käännössidokset |
| `japanilainen-yaki-onigiri-misolla` | Epäuskottavat 150 g misoa ja 150 g noria suhteessa 100 g riisiin | Tarkista punnitut määrät; pelkkä ohjeen vaihto peittäisi virheen |
| `karibia-bammy-kassavaleipa` | Tuoreen kassavan turvallinen käsittely ja soveltuvuus vaativat selvityksen | Ei anneta puutteellista kassavan valmistusohjetta ilman turvallisuusvarmistusta |
| `karibia-saltfish-fritterit` | 1 tl suolakalaa sekä luettelosta puuttuva taikinaliemi; suolauksen poisto puutteellinen | Punnitse kala ja neste, määritä turvallinen liotus ja koko resepti uudelleen |
| `malesialainen-roti-canai-dhalilla` | Taikinan neste ja dhalin valmistus puutteellisia suhteessa luetteloon | Koko taikinan ja linssimuhennoksen määrä- ja kypsennysarvio |
| `pohjoisafrikkalainen-msemen-hunajalla` | Vehnäjauhoista ja mannasta tehtävään taiteltuun taikinaan ei ole nestettä | Määritä lisättävä neste ja tarkista sen vaikutus annoskohtaiseen laskentaan |
| `malesialainen-kaya-paahtoleipa` | FI-lähdeteksti on lukitussa GK149-reseptisnapshotissa | Tee sisältökorjaus vain erillisessä GK149-hyväksyntä- ja uudelleensidontaprosessissa |
| `valimerellinen-halloumi-tomaattileipa` | FI-lähdeteksti on lukitussa GK149-reseptisnapshotissa | Säilytä lähdesnapshot muuttumattomana, kunnes metodipaketin omistaja on hyväksynyt uuden sidonnan |
| `indonesialainen-nasi-goreng-aamiaisriisi` | FI-lähdeteksti kuuluu GK100 v31-eight -hyväksyttyyn pakettiin | Reseptin ja lukitun GK100-paketin yhteiskatselmointi ennen tekstimuutosta |
| `lahi-ita-manakish-zaatarilla` | FI-lähdeteksti kuuluu GK100 approved-five -pakettiin | Säilytä hyväksytty tekstifingerprint, kunnes GK100-uudelleensidonta hyväksytään |
| `thai-maissifritterit` | FI-lähdeteksti kuuluu GK100 eighteen -pakettiin | Korjaus vaatii aines- ja GK100-version tietojen täsmäytyksen |

## Laajemman ainesosatarkistuksen jono

PR #358 löysi yhteensä **109 mahdollisesti ristiriitaista reseptiä** (60:ssä puuttuvan lisäyksen epäily, 16:ssa tarjoilulisukkeen epäily, 25:ssä yleisohjepohja). Luokat ovat päällekkäisiä ja osa osumista on vääriä. Tämä PR korjaa vain 12 selkeää valmistusohjetapausta, ei kaikkia 109:ää.

**Erityinen tarkistinsääntö seuraavaan kierrokseen:** `valkosipuli`, `kevätsipuli` ja tavallinen `sipuli` on erotettava sanana tai täsmällisinä aliaspareina. Ei lisätä tavallista sipulia, jos reseptissä mainitaan vain valkosipuli.

**Hyväksymisportti:** sisältö- ja rakenne-CI, näkyvän valmistusohjeen vastaavuus ainesmääriin, sekä tarvittaessa erillinen ravinto- ja käännöskatselmointi. Julkaisu ei tarkoita todellista koepaistoa.
