# GK:n kaksi julkaisulinjaa — menetelmä- ja käyttöönottosuunnitelma V1

**Tila: DRAFT / SUUNNITELMA, 5.11.2026. Ei laskentakoodin, hyväksyntäsäännön eikä julkisen sivuston muutosta.**
Lähtö: main 42ec76d67b3f703c64d92e2aa5fb5f7a86d1aecc, heti raejuustopizzan PR #294:n jälkeen.
Tämä paketti **ei hyväksy** tiettyä GI-arvoa, numeerista GK-arvoa, B-koodia tai uutta lähdeanalogiaa.

## Päätösehdotus

Säilytetään nykyinen, lähteistetty ja hyväksytty GK-julkaisulinja muuttumattomana. Sen rinnalle valmistellaan erillinen, selvästi merkitty **mallinnettu GK-arvio**, jossa hyväksytysti rajatut koostumus- ja GI-vastineet saavat tuottaa suuntaa-antavan annoskohtaisen luvun tai nimetyn skenaariovälin. Kolmas taso, **mitä-jos-herkkyyslaskelma**, on vain tutkimusta ja käyttäjän yksityistä kokeilua; sitä ei saa julkaista reseptin GK:nä.

Soveltuvien ihmis-GI-tutkimusten puute ei estä reseptin julkaisemista. Se ei myöskään oikeuta väittämään, että jokaiseen ruoan nimeen löytyisi mitattu GI. Käytettävä laskennallinen arvo voi olla mahdollinen vasta kun koko annoksen GI:hin vaikuttavat hiilihydraattiosuudet on ratkaistu tai poisjätetty nimenomaisesti hyväksytyllä, vaikutusperusteisella politiikalla.

## Mikä tässä on uutta?

- **Käyttäjän näkemän arvion asema** eriytetään nykyisestä hyväksytystä GK:sta myös tietomallissa, laskennassa, sivusuodatuksessa, kattavuusmittareissa ja hakukoneen rakenteisissa tiedoissa.
- **Kerran katselmoitu GI-vastine** sidotaan tiettyyn ruokaan, koostumukseen, valmistustapaan ja lähteeseen; samaa hyväksyttyä soveltuvuutta saa käyttää uusissa resepteissä ilman saman lähdehaun toistamista. Resepteille tehdään silti aina oma annos- ja syötelaskenta.
- **Arvion tuottaminen** ei tarkoita julkaisua: laskenta → lähde-/soveltuvuustarkistus → menetelmäportti → toimituksellinen päätös → julkaisu.
- **Luotettava puuttuva tulos on hyväksyttävä lopputulos.** Tärkeää on priorisoida olennaiset puutteet, ei tuottaa numero hinnalla millä hyvänsä.
- Rakennetaan Recipavon omien reseptien nopea arviointi saman deterministisen ytimen päälle; yksityinen arvio ei muutu julkisesti hyväksytyksi reseptiksi.

## Tämän Draft-PR:n rajaus

Lisätään vain uusi dokumentaatiohakemisto ja ei-julkaistava pizza-esimerkin laskentafixture. Ei muuteta reseptiä, käännöksiä, laskenta-JSONeja, GI-rekisteriä, GK80/100 Factorya, suodattimia, CI:tä, deployta eikä sivuston näyttämiä lukuja. Ei mergeä ilman erillistä päätöstä. Tämän PR:n hyväksyntä tarkoittaisi enintään **toteutussuunnitelman** hyväksyntää; menetelmän tuotantokäyttö tarvitsee myöhemmän erillisen päätöksen.

## Lue järjestyksessä

1. [Menetelmä ja näytön tasot](menetelma-ja-laatutasot.md) — laskenta, GI-soveltuvuus, valmiin ruoan mittaus ja riskirajat.
2. [Tietomalli, rajapinnat ja julkaisun erottaminen](tietomalli-ja-rajapinnat.md) — tarkisteet, tilakone, käyttöliittymät ja kattavuus.
3. [Raejuustopizzan pilotti](raejuustopizza-pilotti.md) — 12,902625 g/annos, mitä todella tiedetään, mikä on edelleen auki.
4. [Vaiheittainen toteutus ja PR-riippuvuudet](toteutuspolku-ja-riippuvuudet.md) — pienet PR:t, riskit, palautus ja kustannusrajat.
5. [Testit, mittarit ja päätösportit](hyvaksyntatestit-ja-mittarit.md) — todennettava Definition of Done.
6. [Koneellisesti luettava ei-julkaistava esimerkki](raejuustopizza-laskentapilotti.json).

## Jo olemassa oleva työ, jota EI toteuteta uudestaan

- [4.11.2026 menetelmä- ja hiilihydraattisopimus](../gk-research-2026-11-04/menetelma-ja-hiilihydraattisopimus.md), [Recipavo-automaation määrittely](../gk-research-2026-11-04/recipavo-automaattinen-gk.md), [hyväksyntätestit](../gk-research-2026-11-04/kohdennetut-hyvaksyntatestit.md).
- [Mixed Evidence V1](../gk100-mixed-evidence-v1.md) ja GK100 Approval Factory ovat nykyisen hyväksynnän rajapinta, ei korvattava laskuri.
- [Uuden reseptin GK-arviointiputken suunnitelma](../gk100-new-recipe-pipeline-plan.md).
- [GI Knowledge Base](../gi-knowledge-base-v1-plan.md); paikallinen SQLite-haku on jo toteutettu aiemmassa PR #259:ssä ja kanoninen lähde on edelleen versionhallittu aineisto.
- [Skenaariolaskenta](../../../site/scripts/gk-estimated-range.ts), [skenaarion esityssopimus](../../../site/src/features/recipes/gk-scenario-types.ts) ja [nykyinen GK-esitys](../../../site/src/features/recipes/glycemic-load-display.ts).
- [GK-laskurien vertailupilotti](../gk100-calculator-comparison-pilot-plan.md) pidetään erillisenä; tämä ehdotus ei käynnistä sitä.

## Tieteellinen tausta (lähteet, ei automaattisia hyväksyttyjä GI-tietueita)

- Atkinson FS ym. *International tables of glycemic index and glycemic load values 2021: a systematic review*. AJCN 2021, DOI 10.1093/ajcn/nqab233. https://pubmed.ncbi.nlm.nih.gov/34258626/ ; seka-aterian GI on käytännössä komponenttien painotettu estimaatti ja viljatuotteiden GI riippuu valmistuksesta.
- Tosh SM, Chu Y. *Systematic review of the effect of processing of whole-grain oat cereals on glycaemic response*. Br J Nutr 2015. https://pubmed.ncbi.nlm.nih.gov/26330200/ ; eri kauravalmisteita EI saa käsitellä samana GI-mittauskohteena.
- Zhou CJ Chen ym. *Increasing particle size of oat flours decreases postprandial glycemia and increases appetite in healthy adults*. Nutrition Research 2024, PMID 39366276. https://pubmed.ncbi.nlm.nih.gov/39366276/ ; eri jauhatuskarkeudella valmistetut **puurot** antavat eri vasteen, ei suoraa pizzan GI:tä.\n- ISO 26642:2010, https://www.iso.org/standard/43633.html ; ihmisen GI-mittausmenetelmän viitestandardi, ei valmiin reseptin automaattinen GI-tietokanta.
- Wolever TMS ym. *Food glycemic index ... composite breakfast meals*. AJCN 2006. https://pubmed.ncbi.nlm.nih.gov/16762941/ ; tukee komponenttitarkastelua ryhmätasolla, ei henkilön verensokerin ennustamista.
