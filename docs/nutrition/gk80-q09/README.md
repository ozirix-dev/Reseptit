# Q09 –yhdeksän virheellisen GK-nollan korjaus

Tila READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW. Omistajan menetelmä- ja
sisältöhyväksyntä odottaa. Tuotantoa ei muutettu. Tämä main-pohjainen
korjaus-Draft on erillinen24 reseptin integraatiosta#146.

Ehdokasbuild82/326:8 vanhaa nollaa muuttuu positiivisiksi, teehaudutetut
munat keskeneräisiksi. Muut317 täyttä GK-tulosobjektia säilyvät SHA256-
vertailussa muuttumattomina. Korjauksista ei lasketa uusia resepti-ID:itä.

| Resepti | Vanha GK | Uusi laskentapiste tai tila | Käytettävä CHO g/annos | Luottamus |
| --- | ---: | --- | ---: | --- |
| munakokkeli | 0 | 0.37077 | 0.94305 | LOW |
| munakasmuffinit | 0 | 0.275 | 0.6793333333333333 | LOW |
| uunimuna-avokadot | 0 | 0.61347 | 1.23205 | LOW |
| uunimunat-pinaatilla | 0 | 0.507125 | 1.38445 | LOW |
| vhh-lihamureke | 0 | 0.7299166666666667 | 1.9078333333333333 | LOW |
| uuniporsas-kermakastikkeessa-vhh | 0 | 0.514975 | 1.5120833333333332 | LOW |
| tonnikalamunakkaat-uunissa | 0 | 0.23216666666666666 | 0.5818333333333333 | LOW |
| kiinalainen-teehaudutetut-munat | 0 | INSUFFICIENT SOURCE DATA | avoin | avoin |
| thai-kai-jiao-yrteilla | 0 | 0.4335 | 0.96 | LOW |

Kaikki8 positiivista arviota näytetään alle yhtenä, eivät nollana. LOW on
luottamusluokka; biologista epävarmuusväliä ei tunneta. GI40/30/50-koodaus,
projektin soveltamisrajat ja täsmälliset punnitut versiot odottavat hyväksyntää.
Kaikki imeytyvät hiilihydraatit sisältyvät laskentaan.

## Syyt ja lähdekorjaukset

Vanhoissa tuloksissa positiivinen CHO jätettiin laskennan ulkopuolelle ilman
GI-vastinetta. Uusissa versioissa mausteet ja syötävät massat punnitaan.
Puuttuvat cheddar-, avokado- ja ruohosipulimakrot saadaan täydestä Fineli
Release20 -tietueesta. Mausteilla on täydet AFCD-koostumukset. Seitsemän
AFCD-tietueen neljä makroa ja kokonais-CHO varmistettiin virallisesta per100g-
Excelistä; tunnisteet ja tiedostohashi ovat afcd-primary-verification.json:ssa.

Thai-munakkaan Fineli8029 tarkoittaa kalakastiketta eli mademuhennosta, ei
aasialaista kastiketta. Uusi versio käyttää AFCD commercial-kalakastikkeen
koostumusproxya. Squid-tuotemerkin täsmällistä vastaavuutta ei väitetä.
Tuore basilika toimii thaibasilikan koostumusproxyna. Porsaan yleinen
sianliha713 vaihdetaan raakaan kassleriin sopivaan34190-tietueeseen.

Lihamurekkeen kesäkurpitsaa ei tässä versiossa puristeta; vuoka vuorataan
leivinpaperilla ilman laskematonta rasvaa. Porsaan sipulia ja jauhettuja
mausteita ei siivilöidä pois. Kaikki kastike/pannuneste syödään. Raakojen
ainesten koostumus on kypsän ruoan ravintoarvoproxy ilman keksittyä
kypsennyshävikkivähennystä. Kuvat ovat kuvituskuvia, lisukkeet rajataan pois.

Teehaudutettujen munien ristiriitainen kuorinta-/haudutusohje, punnitsematon
tähtianis ja syötävän liemen osuus jäävät avoimiksi. Ehdotus on
INSUFFICIENT SOURCE DATA. Soijakastikkeen9,5g CHO/100g ei myöskään sovi
rajattuun vähähiilihydraattisen ruoan GI50-sovellukseen. Lähteen muuttaminen
vanhentaa myös keskeneräiseksi poistamisen päätöksen; hash tarkistetaan.

## Kieliversiot ja varmennus

Lihamurekkeelle ja uuniporsaalle oli valmiiksi EN/SV/TH-käännökset.
Kaikki6 päivitettiin samaan punnittuun sisältöön, makroihin ja neljään
työvaiheeseen. Muille ei väitetä tehtyjä käännöksiä. Kaikki käännökset
ovat edelleen AUTOMATED REVIEW ONLY; ihmisarvioita ei ole lisätty.
GK:n mallinnus-, matala luottamus- ja alle yhden esitykset ovat FI/EN/SV/TH.

Paikallinen691 reitin build, yksikkötestit,27 käännöstestiä ja25 staattista
testiä läpäisivät. Riippumaton Decimal tarkistaa8 laskentapistettä sekä kaikki
neljä makroa. Brave tarkisti14 numeerista kielisivua,56 näkyvää makroa,
8 lähdeviitekokonaisuutta ja teehaudutettujen munien keskeneräisen tilan.
JavaScript-virheitä0. Lopullinen HEAD ja valmistunut CI raportoidaan
AJO6:n yhdessä ReportHub-koonnissa; tekninen PASS ei ole omistajahyväksyntä.

## Riippuvuus ja julkaisu

Tämä paketti4 ja#146:n paketit1–3 ovat eri main-pohjaisissa Drafteissa.
Myöhempi yhteinen julkaisu edellyttää rekisterien, Q09-poistamisen ja
historiatestinäkymien unionia sekä uutta koko HEADin CI:tä. Tämän pohjan
odotettu yhteinen määrä olisi106, ei107. Yhdistelmää ei väitetä testatuksi.
Tuotanto on edelleen83 teknistä tulosta, joista9 tunnetusti virheellisiä
nollia; niiden poistamisen jälkeinen74 on rajatun laatulipun vertailuluku,
ei koko kokoelman uusi manuaalinen syväauditointi.

Ei Ready-siirtymää, mergeä, deployta tai automaattista AJO7:ää.
