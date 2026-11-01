# GK-80 AJO 7: kahdeksan reseptin julkaisuehdokas

Tila READY FOR OWNER METHOD AND CONTENT REVIEW. Draft, ei hyväksytty julkaisu.
Pohja main `cec3263b8643961a0da2538662960283fe6fdb0f`, tuotanto 106/326.
Tutkimuslähde [PR148](https://github.com/ozirix-dev/Reseptit/pull/148),
HEAD `767f57795f981028227167d52ee23f7e674494db`, next-eight-aineisto.
Tutkimushaaran historiaa ei ole yhdistetty. Vanhat neljä pakettia ovat ennallaan.
Uusi paketti5 rekisteröidään datarekisterillä; yleistä laskentamoottoria ei muuteta.

## Katselmoitavat täsmälliset versiot

| Resepti-ID | Annoksia | Netto-CHO g | Kokonais-CHO g | Proteiini g | Rasva g | GK |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| paprikauunimunakkaat | 2 | 7.64 | 10.77 | 21.01 | 16.35 | 3.097630 |
| kana-fajita-pelti | 4 | 4.84 | 8.11 | 32.13 | 17.14 | 1.930697 |
| kana-enchilada-kukkakaalivuoka | 4 | 6.37 | 10.03 | 46.44 | 28.95 | 2.514525 |
| thai-kookosriisi-mangolla | 2 | 48.05 | 49.76 | 5.83 | 16.41 | 30.779065 |
| thai-riisinuudelikeitto-aamuksi | 2 | 42.58 | 44.61 | 19.59 | 1.62 | 25.773000 |
| valimerellinen-tortilla-espanola-aamupalaksi | 2 | 6.14 | 6.89 | 7.84 | 18.64 | 3.679500 |
| chili-con-carne-kukkakaaliriisi | 4 | 15.63 | 22.57 | 30.77 | 28.96 | 5.155188 |
| kanakeitto-pinaatti-sitruuna | 4 | 4.65 | 7.28 | 25.69 | 23.49 | 1.851275 |

Kaikki8 LOW. Ehdokasbuild 114/326 (34,97 %), keskeneräisiä212.
Tuotanto säilyy106/326. 80 %:n raja261: tuotannosta155, tämän paketin jälkeen147.

## Sisältö- ja menetelmäpäätös koko erälle

- Paprikamunakkaat: syötävä paprika320g, kuoreton muna220g, juusto40g,
  ruohosipuli3g ja pippuri0,5g. Ei listaamatonta paistorasvaa.
- Fajitapelti: paprika240g, sipuli55g; koko avokado150g-jogurtti100g-
  limetti50g-kastike syödään. Limetin hedelmäliha mukana, ei pelkkä puristus.
- Enchiladavuoka: 250g kotisalsa = tomaatti200g+sipuli35g+limettimehu10g+
  vihreä chili5g. Lisäksi50g kuorittua limettiä. Kana500g punnitaan kypsänä.
  Kaupallinen salsa ja tortillat eivät kuulu laskelmaan.
- Kookosriisi: kuiva jasmiiniriisi100g, kookosmaito184g, vesi100g,
  syötävä raaka mango150g ja kokonainen seesami6g. Kuuma jyväriisi.
- Riisinuudelikeitto: kuivat riisinuudelit100g keitetään ja valutetaan,
  kana150g raakana, käyttövalmis liemi700g, limetin hedelmäliha50g.
  Kuivan nuudelin koostumus on ravintopanosten proxy ilman hävikkihyvitystä.
- Tortilla española: peruna60g raakapainona esikeitetään ja valutetaan,
  sipuli55g, muna110g, oliiviöljy13,5g ja rypsiöljy13,5g syödään kokonaan.
  Tämä muuttaa alkuperäistä pitkään öljyssä kypsennettyä valmistustapaa.
- Chili: kypsä valutettu kokonainen kidneypapu200g; kukkakaali500g
  höyrytetään. Kaikki punnittu öljy27g käytetään chilikastikkeeseen.
- Pinaatti-sitruunakeitto: käyttövalmis liemi1000g, kerma200g ja
  sitruunan hedelmäliha65g; kaikki keitto syödään neljänä annoksena.

Valmistuksen kaikki massat ja neljä makroa ovat varsinaisissa resepteissä.
Reseptit ovat FI-only; uusia käännöksiä tai ihmisarvioita ei väitetä.
Kuvat säilyvät havainnollistuksina ja mahdolliset lisukkeet rajataan näkyvästi.

Omistajan aiempi PR149-hyväksyntä ei kata näitä kahdeksaa versiota.
Hyväksyttäväksi esitetään yhtenä eränä: täsmälliset sisällöt, niiden
GI40/30/50-sidokset ja projektirajat, valmistusanalogiat sekä koostumusproxyt.
LOW ei ole biologinen virheraja. Proteiini tai rasva ei alenna GK-summaa.

## Lähdevarmennus ja laskenta

- [Koostumukset](composition-sources.json): Fineli Release20 ja AFCD Release3.
  AFCD:n kaikki15 käytettyä tietuetta verrattiin alkuperäisen Excelin sheet2:n
  per100g-sarakkeisiin: neljä makroa sekä CHO polyoleineen ja ilman.
  [Primäärivarmennus ja tiedostohash](afcd-primary-verification.json).
- Fineli-rypsiöljy korjattiin seosöljystä541 todelliseen535:een. Samat13,5g;
  tortillan rasva18,63695→18,64370g, pyöristetty18,64g ja GK3,6795 ennallaan.
- GI-lähteet ja rajat: [sources.json](sources.json). Riisinuudeli61 vastaa
  Atkinson2021 T1-riviä1463, kuivattu keitetty Thai World,12 tervettä,
  glukoosiasteikko. Peruna66 vastaa T1-riviä1842, keitetty määrittämätön
  lajike,10 tervettä. Kyseessä ovat LOW-analogiat, eivät tämän aterian mittaukset.
- Raaka mango51 on vuoden2002 kolmen tutkimuksen kooste. Vuoden2008
  julkaistu taulukko tukee samaa raakamangon keskiarvoa. Vuoden2002 DOI:n
  kokoteksti ei auennut tässä ajossa uudelleen; jo tallennettu tietue säilyy.
- Jasmiiniriisi68: Venn2014 Euroopan ryhmä; kookosmaito ei oikeuta
  mitattua GI-alennusta. Kidneypapu24: Atkinson2008 ruokakohtainen keskiarvo,
  sovellus säilykkeenä kypsään valutettuun kokonaiseen papuun on analogia.
- Liemi on nimetty yleinen AFCD-proxy, ei tietyn suomalaisen tuotteen tarkka
  pakkaustieto. Tiivistettä ei lasketa käyttövalmiina liemenä.
- Imeytyvä CHO, kuitu ja lähteiden polyolit erotellaan; kuitua ei vähennetä
  kahdesti. Tämän8-paketin koostumuksissa ei käytetä USDA-mausteproxya.
- [Golden](golden.json), [syötteet](recipes.json), [makrot](publication-macros.json)
  ja koko reseptiteksti on sidottu hashilla. Riippumaton Decimal tarkistaa8/8.

## Varmennus

Yksi kokonaisbuild,691 reittiä. Kohdistettu ensimmäinen tarkistus10/10.
Alkuperäinen yksikköajo180/191;11 historiallista testiä havaitsi uusien8
sidontojen puuttuvan eristetyistä historianäkymistä. Staattisen ajon yksi
testi odotti106 eikä114. Rajaukset korjattiin muuttamatta laskentaa;
korjattujen tiedostojen90/90 testiä läpäisi. Lopullinen HEAD varmennetaan CI:ssä.

Todellisen main-baselinen vertailu:8 uutta ja318 ennallaan säilynyttä täyttä
GK-tulosobjektia. Kaikki106 julkaistua numeerista tulosta säilyvät.
Q09:n tee pysyy keskeneräisenä; pakettien1–4 lähteitä ei muuteta.
Vanhat historialliset odotukset säilyvät erillisissä testeissä ja uusi
main-regressio tarkistaa todellisen nykytilan ilman historiaeristystä.

Brave:8/8 muuttunutta FI-sivua, GK/LOW, neljä makroa, valmistusvaiheet,
kuvan lataus ja lisukerajaus; lähdelinkit kaikille8 keskitetyn sivun kautta.
Ei JavaScript-virheitä. Kookosriisin ja tortillan koko sivun kuvakaappaukset
katsottiin. Kaksi ensimmäistä selaintarkistusta korjattiin DOM-selektorien
vuoksi; ne eivät johtaneet tuotemuutokseen. Esikatselu ja selain suljettiin.
Uusia GK-arvoja ei ole lähellä10/20-rajaa. Aiempi Lablabin lähderiippuvainen
19,12945→20,00945-luokkaraja säilyy omistajan aiemmin hyväksymänä rajauksena.

## Rajaus ja seuraava askel

Ei Ready-siirtymää, mergeä, deployta, GK-suodatinta tai VHH/Keto-muutoksia.
Seitsemän AJO6-ehdotusta ja rajattu20 jatko pidetään erillisessä tutkimus-Draftissa.
Omistajalle yksi eräpäätös: hyväksytäänkö tämän8 version sisältö ja menetelmän
rajaukset seuraavaan julkaisuvaiheeseen? Varsinainen julkaisulupa on erillinen.
