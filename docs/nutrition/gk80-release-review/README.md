# Julkaisukatselmointi:24 reseptiä ja Q09

Omistaja hyväksyi päätökset A–C final release gaten rajauksin1.11.2026.
Voimassa oleva [hyväksyntä ja seuraava julkaisuportti](owner-approval.md)
yksilöi katselmoidun HEADin ja32 reseptiversiota sekä tee-munien numeron poiston.
Alla oleva katselmointi säilyy päätöksen taustana. Readyä, mergeä, deployta
tai AJO7:ää ei ole tässä valtuutettu.

Lähtö: main e8da2c9417e2aeff55a85d599b3b7e1ad465f36c.
Lähde-PR146:5735e46f3939bfbc3154a1226e71729fa112522c;
PR147:31816bbe1c2401bc1f4c5864e36e87de30f426d0.
Tutkimus-PR148:767f57795f981028227167d52ee23f7e674494db ei kuulu ehdokkaaseen.
Ensisijainen julkaisupolku on tämän haaran uusi yhdistetty Draft. #146/#147
ovat historiallisia lähde-Drafteja; niitä ei tule yhdistää peräkkäin mainiin.

## Q09:n päätökset

Seitsemän ACCEPT-ehdotusta: punnitut syötävät massat,annokset,Fineli-/AFCD-
koostumus,GI-soveltamisrajat ja koko kastikkeen syöminen on yksilöity.
Hyväksyttävyys koskee nimettyä LOW-mallia,ei mitattua alkuperäisaterian vastetta.
Thai kai jiao ACCEPT WITH CORRECTION: rypsiöljy oli sidottu Fineli536-
oliiviöljyyn. Korjattu Fineli535 RYPSIÖLJY -tietueeseen. Neljä makroa ja GK
pysyvät ennallaan; koostumus-/syötehashit ja pakettirekisteri päivitetään.
Kassler34190 vastaa raakaa kassleria; ei yleinen sianliha713.
AFCD F008004 on nimetty aasialaisen commercial-kalakastikkeen koostumusproxy,
ei Fineli8029-mademuhennos tai varmennettu Squid-tuote. Basilika on nimetty proxy.
Tee-munat HOLD: marinadin kulutus/uutto ja valmistus ovat avoimia. Nollan
poistaminen on hyväksyttävä laatukorjaus; numeerista arviota ei hyväksytä.

## Menetelmälähteiden uudelleentarkistus

Atkinson2008 DOI10.2337/dc08-1239,Conclusions,antaa vähähiilihydraattisille
kasviksille40 ja maitotuotteille30 koodausmahdollisuutena. Se ei osoita näiden
reseptien mitattua GI:tä. Tuoreet yrtit/alliumit ovat rajattu projektitulkinta.
Schakelin tekijäesityksen sivu12 (PDF-indeksi11),Default and Zero Values,
antaa vähähiilihydraattisille ruoille glukoosiasteikon50. Tämä on esityksestä
varmennettu menetelmä;5g/100g ei ole lähteessä validoitu raja. Mausteiden
0.5g/ainesosa/annos ja1g yhteisraja ovat projektin oma jatkosovellus.
Lähteet:https://pmc.ncbi.nlm.nih.gov/articles/PMC2584181/ ja
https://pdfs.semanticscholar.org/eead/ef25b9a2d5c209deb31265082c85080758f4.pdf

Lähteet sallivat koodauksen,mutta eivät biologista virherajaa tai lupaa
luokitella tuotteita nimen osilla. Näitä ei muuteta yleisiksi tuotantosäännöiksi.
Raakojen ainesten koostumus on nimetty ravintoproxy,ei mitattu kypsennyshävikki.
Eläinmaitotuotteet rajataan makeuttamattomiin;kasvijuoma ei ole sama ryhmä.
Korkean CHO:n kastike,tahna,jauho tai suuri siemenannos ei pääse pienen
mausteannoksen piiriin. Täysi koostumus ei itsessään todista GI:tä.

## 24 reseptin matriisi

Kaikki24 edellyttävät yhteistä omistajan menetelmä- ja version sisältöpäätöstä.
Tässä ei väitetä riippumatonta laboratoriovarmennusta tai ihmiskäännösarviota.
Lähdeversiot säilytetään erillisinä neljässä paketissa;samannimisiä tietueita
ei yhdistetä pelkällä nimellä. Skenaariot kuvaavat vaihtoehtoja,ei virheväliä.

| Resepti | Päätösehdotus | Keskeinen sovellus |
| --- | --- | --- |
| vietnamilainen-hu-tieu-aamiaiskeitto | Vaatii omistajan menetelmäpäätöksen | rice-noodle61, vegetable-imputation40 |
| vietnamilainen-chao-ga-kanapuuro | Vaatii omistajan menetelmäpäätöksen | rice-congee80, vegetable-imputation40 |
| indonesialainen-bubur-ayam-kanariisipuuro | Vaatii omistajan menetelmäpäätöksen | rice-congee80, vegetable-imputation40 |
| pohjoisafrikkalainen-minttutee-kaurapuuro | Vaatii omistajan menetelmäpäätöksen | honey-category-mean-gi-55-2002, milk30, oats-elovena76, vegetable-imputation40 |
| meksikolainen-huevos-a-la-mexicana | Vaatii omistajan menetelmäpäätöksen | lowcho50-v2, vegetable-imputation40 |
| karibia-callaloo-munakas | Vaatii omistajan menetelmäpäätöksen | lowcho50-v2, vegetable-imputation40 |
| yrttituorejuusto-kinkkurullat | Vaatii omistajan menetelmäpäätöksen | dairy-imputation30, lowcho50-v2, spice-portion50-v2, vegetable-imputation40 |
| kreikkalainen-kanavuoka-oliiveilla | Vaatii omistajan menetelmäpäätöksen | dairy-imputation30, lowcho50-v2, spice-portion50-v2, vegetable-imputation40 |
| kanapyorykat-tomaattikastike | Vaatii omistajan menetelmäpäätöksen | dairy-imputation30, lowcho50-v2, spice-portion50-v2, vegetable-imputation40 |
| malesialainen-nasi-lemak-aamiaisella | Vaatii omistajan menetelmäpäätöksen | lowcho50-v2, rice-basmati57, rice-jasmine68, vegetable-imputation40 |
| kiinalainen-musta-seesamipuuro | Vaatii omistajan menetelmäpäätöksen | honey-category-mean-gi-55-2002, lowcho50-v2, rice-congee80, spice-portion50-v2 |
| harira | Vaatii omistajan menetelmäpäätöksen | chickpea-mean28, lentil-mean32, lowcho50-v2, pasta-mean49, spice-portion50-v2, vegetable-imputation40 |
| shoyu-kanakeitto-konjac | Vaatii omistajan menetelmäpäätöksen | lowcho50-r4, vegetable-imputation40 |
| indonesialainen-nasi-uduk-aamiaisella | Vaatii omistajan menetelmäpäätöksen | lowcho50-r4, rice-jasmine68, vegetable-imputation40 |
| thai-khao-tom-katkaravuilla | Vaatii omistajan menetelmäpäätöksen | lowcho50-r4, rice-jasmine68, vegetable-imputation40 |
| karibia-kookosriisi-pavuilla | Vaatii omistajan menetelmäpäätöksen | kidney-mean24-r4, lowcho50-r4, rice-jasmine68, vegetable-imputation40 |
| pohjoisafrikkalainen-lablabi | Vaatii omistajan menetelmäpäätöksen | chickpea-mean28, lowcho50-r4, pita-white68-r4, small-flavour50-r4 |
| meksikolainen-atole-maissipuuro | Vaatii omistajan menetelmäpäätöksen | cornmeal-porridge68-r4, dairy-imputation30, small-flavour50-r4 |
| karibia-maissipuuro-kookoksella | Vaatii omistajan menetelmäpäätöksen | cornmeal-porridge68-r4, lowcho50-r4, small-flavour50-r4 |
| meksikolainen-kurpitsapuuro-piloncillolla | Vaatii omistajan menetelmäpäätöksen | brown-sugar60-r4, oats-elovena76, pumpkin51, small-flavour50-r4 |
| lahi-ita-taatelipuuro-tahinilla | Vaatii omistajan menetelmäpäätöksen | dairy-imputation30, dried-date-tamer-mean-gi-55-2-algeffari-2016, lowcho50-r4, oats-elovena76, small-flavour50-r4 |
| valimerellinen-tahinipuuro | Vaatii omistajan menetelmäpäätöksen | honey-category-mean-gi-55-2002, lowcho50-r4, oats-elovena76, orange45-r4 |
| thai-papaijajogurtti | Vaatii omistajan menetelmäpäätöksen | dairy-imputation30, lowcho50-r4, papaya-pieces38-r4 |
| lahi-ita-kikherne-shakshuka | Vaatii omistajan menetelmäpäätöksen | chickpea-mean28, lowcho50-r4, vegetable-imputation40 |

Riisi/congee/riisinuudeli/kaura/maissi/pita/palkokasvi-sidokset ovat
pakettien nimettyjen kypsien valmistusten LOW-analogioita; ei raakajauhon
automaattista leipä-GI:tä. Maissipuuro ei ole tortilla. Musta seesami käytetään
version mukaisesti kokonaisena,ei uutena tahna-GI:nä. Minttu syödään eikä
pelkkää siivilöityä uutetta lasketa lehtien ravintona. Konjac on konjac;
pelkistetty nasi lemak sekä erilliset chao ga/bubur ayam näkyvät versioina.
Kuvan lisukkeet eivät ole laskentaan sisältyviä ainesosia. Kaikki24 ovat FI-only.

## Omistajan päätökset ja hylkäyksen vaikutus

1. Hyväksytäänkö rajattu40/30/50-koodaus ja omat5g/mausteannosrajat LOW-
   malliksi? Suositus:ehdollinen hyväksyntä,kun rajoitukset näkyvät.
   Jos ei,kyseisiin sidoksiin tukeutuvat reseptit pidätetään numeerisina.
2. Hyväksytäänkö täsmälliset32 punnittua versiota,niiden valmistusanalogiat,
   koostumusproxyt ja tee-munien numeron poisto? Suositus:versionmukainen
   hyväksyntä;ei hyväksyntää alkuperäisen nimeämättömän tuotevaihdon laskennalle.

Julkaisurekisterin rajaus tukee pienempää aineistoa vain nimenomaisella uudella
manifestiversiolla,resepti-/golden-aineistolla ja uusilla hasheilla; ei hiljaista
paketin katoamista. Muutoksen jälkeen vaaditaan uusi tarkka regressio ja CI.
Omistajan menetelmähyväksyntä ei yksin anna merge- tai deploy-lupaa.

## Varmennus ja julkaisu

Uusi nykytesti tarkistaa33 tarkoituksellista muutosta ja293 täyttä muuttumatonta
tulosobjektia. Vanhojen erillistestien näkymät on nimetty historiallisiksi;
ne eivät väitä yhdistelmän kattavuutta. Koko yhdistelmän nykytestiä ei korvata
historiallisella näkymällä. Numerot sekä lopullinen HEAD/CI raportoidaan vasta
valmistuneen buildin perusteella. Tuotanto säilyy83/326.

Rollback:ennen erikseen luvitettua julkaisua tallenna julkaisu- ja edeltävä
tuotanto-SHA sekä kattavuus. Tarvittaessa valmistele guarded main-pohjainen
palautus-PR; säilytä Q09:n korjaukset ja pidätä tee-munat. Ei historian poistoa.
Seuraava vaihe:omistajan rajattu menetelmä-/sisältöpäätös vasta lopullisen
CI:n ja riskikohtien selaintarkistuksen jälkeen. Uusia tutkimuseriä ei aloiteta.


## Valmistunut paikallinen yhdistelmä

Todellinen build106/326 (32.52%),keskeneräisiä220.24 uutta,8 korjattua ja
1 pois vedetty;293 muuta täyttä tulosobjektia SHA256-vertailussa ennallaan.
Tunnetut positiivisen poisjätetyn CHO:n nollavirheet0. Menetelmähyväksyntää
odottavia32; tämä ei ole kaikkien106:n uusi riippumaton lähdesyväauditointi.
Tuotannon83 ei muutu tästä Draftista.261-tavoitteeseen ehdokkaasta puuttuu155.

188 yksikkötestiä ja25 staattista testiä läpäisivät. Decimal4+8+12+8 toistui.
691 reittiä valmistui. Brave:Thai FI,porsas FI/EN/SV/TH sekä shoyu,
20 näkyvää makroarvoa,Q09:n alle1,LOW ja tee-munien numeron poisto sekä
kahden FI-sivun lähdelinkit; JS-virheitä0. Nykyinen hakusuodatus ei tarjoa
erillistä GK-suodatinta; uutta ei lisätty. Olemassa oleva haku/VHH/Keto-
toiminta säilyy ja sen yksikkötestit läpäisivät. Käännösten sisältö säilyy
#147:n jo varmennetussa muodossa ja kaikki nykyiset makrot tarkistettiin
yhdistelmän kieliversioista. Ihmisarvioita tai uusia käännöksiä ei väitetä.

Ensimmäinen build pysähtyi LF/CRLF-pakettihashiin,ei ohitettuun suojaan.
Korjauksen jälkeen ajettiin vain GI-auditointi ja jäljellä olleet buildvaiheet,
ei uutta kuva-/sisältögenerointia. Kohdistetuissa testeissä erillisen Q09:n
vanha82-odotus rajattiin nimettyyn historialliseen näkymään; todellinen106
testataan erikseen ilman palautettua näkymää. Tyypityksen käyttämätön import
poistettiin. GitHub CI käynnistetään vain lopulliselle commitille.
