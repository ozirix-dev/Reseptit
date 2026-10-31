# GK-80 AJO6 tutkimus ja seuraavat hyväksyntäaineistot

Tulos PARTIAL:20/20 tapausta käsitelty kahdessa10 reseptin kierroksessa,
7 uutta numeerista ehdotusta (tavoite10,stretch13),13 pidätettyä.
Kierros1 tuotti4 ja kierros2 tuotti3. Kolmatta kierrosta ei käynnistetty.
Kaikki169 jäljellä ollutta ID:tä seulottiin uudelleen todellisilla koostumus-
ja valmistusesteillä. Korkea konepistemäärä ei tarkoita soveltuvaa GI:tä.
Valinta ja toteutuneet esteet:selection.json,rescreen169.json,recipes.json.
Seitsemän on kokonaisia punnittuja LOW-skenaarioita;13 avoimelle ei väitetä
kokonaisia makroja tai GK:ta. Puutteita ei täytetty keksityillä arvoilla.

## Uudet kokonaiset ehdotukset

| Resepti | CHO/annos g | GK/annos | Luottamus |
| --- | ---: | ---: | --- |
| butter-chicken | 11.53577 | 4.97930 | LOW, ei tunnettua biologista virheväliä |
| palak-paneer | 2.95107 | 1.15369 | LOW, ei tunnettua biologista virheväliä |
| som-tam-vhh-kurkkuna | 5.33300 | 1.87318 | LOW, ei tunnettua biologista virheväliä |
| pohjoisafrikkalainen-harissa-shakshuka | 5.81010 | 2.34660 | LOW, ei tunnettua biologista virheväliä |
| moo-ping-vhh | 2.15500 | 0.98680 | LOW, ei tunnettua biologista virheväliä |
| nakkikeitto-kukkakaalilla | 11.67883 | 5.38529 | LOW, ei tunnettua biologista virheväliä |
| lanttulaatikko-kermainen | 13.10825 | 5.14062 | LOW, ei tunnettua biologista virheväliä |

Kaikkien punnitut ainesosat,valmistus,neljä makroa,GI-/koostumushashit ja
ehdot ovat versions/-aineistoissa sekä rakenteisissa JSON-tiedostoissa.
Raakojen ainesten ravintoarvojen säilyminen on nimetty proxy,ei mitattu
kypsennyshävikki. Proteiini/rasva eivät poista hiilihydraattien GK-osuuksia.

## Lähderatkaisut ja rajat

- Kokonainen maapähkinä:Atkinson2021 Supplement2 rivi3245,GI13,5henkilöä,
  glukoosiasteikko. SEM6 ei ole reseptin epävarmuusväli. Valmistustapa ei
  täsmenny; paahdettuun kokonaiseen pähkinään sovelletaan LOW-analogiaa.
  Maapähkinävoi ja jauho eivät kuulu sidokseen. Alkuperäisartikkelin metadata
  tarkistettiin,sen kokotekstiä ei väitetä luetuksi. PDF:n hash säilytetty.
- Paneer:Norjan virallisen Matvaretabellenin01.301,CHO0,P26,F24.5,kuitu0
  per100g. Koostumusproxy,ei tietyn suomalaisen tuotteen varmennus.
- Garam masala on täydellinen nimetty kuuden mausteen seos;kotiharissa
  nimetty5g tuoreversio. Ei mitattua GI-väitettä kaupallisille tahnoille.
- Fineli7600:n keitetty nakki sopii5gCHO-rajaan. Naudan maksa786:n5.031g
  ylittää rajan eikä sitä pyöristetä tai vaihdeta eläinlajia tavoitteen vuoksi.
- Lantun GI40 on non-starchy root vegetable -koodauksen toimituksellinen
  sovellus; ei mitattu lanttulaatikon GI. Siirappi oli alkuperäisessä valinnainen.
- USDA-laakerin CHO on total-minus-fibre-proxy;endogeenisiä polyoleja ei
  väitetä mitatuiksi nolliksi. Erytritoli sisältyy kokonais-CHO:on kerran.
- Vanhoja lähteitä ei muuteta. Uudet lowcho50-r6/small-flavour50-r6-sidokset
  on rajattu täsmällisiin koostumus-ID:ihin ja valmistusmuotoihin.

## Avoimet13

- paistettu-maksa-pekonilla: Actual Fineli beef liver786 has5.031gCHO/100g, above the5g project cutoff. Do not round down, switch animal or cherry-pick another database solely to pass. A defensible beef-liver GI/coding decision is missing.
- maksalaatikko-kukkakaalilla: Beef liver5.031gCHO/100g outside lowCHO50; fresh lingonberry100g serving component also needs an applicable GI. Both retained, not deleted.
- kreikkalainen-moussaka: Cooked flour-thickened bechamel60g flour and roasted potato need appropriate preparation comparators. White bread GI is not raw flour GI; no complete valid whole result.
- silakkapihvit-tilli-kermakastike: Pan-fried rye flour coating is not whole rye bread. Consumed flour/butter and lemon portions need weighed preparation; full source scenario remains open.
- japanilainen-dashimaki-tamago-aamiaislautasella: Dashi200ml lacks a gram-based complete named composition. Ninben label is per100ml concentrate8.9gCHO, not ready broth; density/dilution and applicable product GI remain open. Do not label concentrate as lowCHO ready broth.
- meksikolainen-huevos-divorciados: Green salsa150g needs full named composition; black bean150g needs actual preparation/GI comparator. Kidney bean GI is not silently applied to black beans.
- kana-tagine-sitruunalla: Preserved lemon composition/consumed rinsed peel and edible bone-in chicken yield remain undefined. Fresh lemon substitution would not establish preserved lemon.
- keltainen-kanacurry-vhh: Mae Ploy yellow paste30g: complete exact product composition and GI/coding application unresolved. Full label alone is not GI. No arbitrary homemade replacement chosen solely to reach target.
- thai-vihrea-curry-kanalla-vhh: Commercial green paste30g and kaffir lime leaf2g need full composition and appropriate GI/extraction application. Basil is not automatically kaffir leaf.
- panang-curry-kanalla-vhh: Whole peanut comparator now identified, but commercial Panang paste30g and kaffir leaf2g remain unresolved. Peanuts alone do not establish complete recipe.
- paprikainen-vhh-gulassi: Paprika1.5tbsp is a main flavour dose; full actual weighed dose must satisfy minor-spice limits. Concentrated tomato paste also needs GI application. Do not shrink ingredients to pass dose caps.
- munakoiso-kesakurpitsalasagne: Original contains200g lasagne sheets and800g ready tomato sauce. Oven-baked pasta preparation and sauce composition need matched sources; all retained. Not a flour-free vegetable-only recipe.
- kimchi-jjigae: Gochujang1tbsp and fermented kimchi400g require full matched composition/GI application. Soy bean GI is not fermented paste GI; no forced ingredient deletion.

## Kahdeksan aiempaa ehdotusta

next-eight/ sisältää8 erillistä AJO5:n DRAFT_NUMERIC-ehdotusta täydellisinä
hyväksyntäaineistoina. Ne eivät ole uusia tutkimustuloksia eivätkä tässä
haarassa tuotantoon integroituja. Kaikki8 ovat FI-only; nelikielistä resepti-
käännöstä tai ihmisarviota ei väitetä tehdyksi. Omistajan hyväksyntä odottaa.

## Kattavuus ja261-polku

Tuotannon tekninen83/326; yhdeksän tunnetun laatuvirheen suodatuksella74/326.
74 ei tarkoita koko kokoelman uutta manuaaliauditointia.
Ehdollisia on81=aiemmat74+uudet7. Näistä32 on hyväksyntäaineistoina:
24 runtime-integraatiossa#146,8 tämän haaran aineistona;49 on tutkimusvaiheessa.
Hyväksyttyjä0,julkaistuja uusia GK80-arvioita0. Q09 ei ole uusia ID:itä.
Q09:n jälkeen vanhoja numeerisia olisi82:8 korjattua ja1 poistettu.
Kaikkien81 ehdotuksen kanssa ehdollinen laatupotentiaali163/326,261-tavoitteesta
puuttuu98. Jäljellä162 yksilöllistä keskeneräistä ID:tä;ne on lueteltu
remaining-plan.json-tiedostossa. Tulosten syntymisestä ei anneta prosenttilupausta.

P1:Q09-laatukorjaus. P2:24 integroitua,8 seuraavaa,49 muuta ehdotusta.
P3:yhteisten tahna-/valmistuslähteiden ratkaisut. P4:vaikeat taikinat ja
fermentoidut seokset erillisinä tutkimuskohteina. Ei automaattista AJO7:ää.

## Yhteinen menetelmäpäätös ja julkaisupolku

Omistajan24 reseptin päätös on#146:n owner-method-decision.md:
ihmis-GI,sovellettu ihmis-GI,julkaistu koodaus,projektin soveltamisraja,
nimetty skenaario ja tuntematon erotellaan. Kasvis40,eläinmaitotuote30,
Schakel50,5gCHO/100g,pieni mauste0.5g/ainesosa/annos ja1g yhteensä ovat
nimenomaisia katselmointiehtoja,eivät biologisia virherajoja.
Riisi-,puuro-,nuudeli-,kaura-,pita-,maissi- ja palkokasvianalogiat vaativat
ruokaperheen,valmistusmuodon ja tuotteen vastaavuuden tarkastuksen.
Tämän haaran7 eivät kuulu24 hyväksyntäpäätökseen.

#146 ja#147 ovat erillisiä main-pohjaisia ehdokkaita. Niiden yhdistelmä106
on toistaiseksi aritmeettinen ennuste,ei testattu build. Ennen yhdistettyä
julkaisua tarvitaan unionirekisteri,historia-/hash-/makrotestit ja kokoHEAD CI.
Rollback sekä lopullinen julkaisutarkistuslista ovat#146:ssa. Ei Readyä,
mergeä tai deployta eikä hyväksyntää kirjattu saaduksi.
