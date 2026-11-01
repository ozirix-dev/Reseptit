# AJO 8 — alkuperäinen tavoitepäätös

Lukittu ennen resepti-, rekisteri- tai laskentaintegraation aloittamista.
Päätös: CONDITIONAL GO — 11 välittömästi integroitavaa, omistajan hyväksyntää odottavaa ehdokasta.

## Varmennettu lähtötila

Main ed5e3a67046cff3b1fd56acf4cb214a0fe3813ad. Mainin CI ja Pages-deploy
SUCCESS: https://github.com/ozirix-dev/Reseptit/actions/runs/41292997883.
Tuotantosivun tuore HTTP 200 -luku vahvisti 326 reseptiä, 119 numeerista,
207 keskeneräistä (36,50 %): https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/.
Tavoitteeseen 261 puuttuu 142. Uusi haara perustuu tähän mainiin, ei vanhaan PR-haaraan.

## Etukäteen asetetut määrätavoitteet

| Taso | Uusia numeerisia ehdokkaita | Mahdollinen ehdokaskattavuus |
| --- | ---: | --- |
| MINIMUM TARGET | 10 | 129/326 — 39,57 % |
| PRIMARY TARGET | 11 | 130/326 — 39,88 % |
| STRETCH TARGET | 13 | 132/326 — 40,49 % |

18 lukittua AJO 7 -tutkimuspakettia tarkistettiin HEADilla
f3777a8c423f4cb49eb67b0f2aca318aaebb7531. Kaikki 18 alkuperäistä
reseptihashia vastaavat nykyistä mainia; yksikään ei ole jo numeerisesti julkaistu.
BundleHashit tarkistettiin. Seulonta kattoi neljä makroa, polyolit,
ainesosamassat, GI-sidokset, valmistusrajaukset sekä nykyisen rekisteripolun.

Luokat: A 9, B 2, C 2, D 5. Yksitoista A/B-tapausta on todellinen nykyinen
integraatiopohja. Minimi 10 sallii yhden myöhemmässä todellisessa tarkistuksessa
osoittautuvan esteen; ensisijainen tavoite 11 käyttää kaikki nykyiset A/B-tapaukset.
Suositusalue 15–18 ei ole lähdevaatimuksia ohittava kiintiö.

Stretch 13 on ehdollinen yläraja, ei valmistumisennuste. Se edellyttää kahteen
kuivattua meiramia käyttävään C-tapaukseen täydellistä ensisijaista koostumustietuetta,
jossa polyolimäärä on varmennettu. Vain rajattu olemassa olevien ensisijaisten
aineistojen tarkistus sallitaan. Tuoreen meiramin AFCD-tietuetta ei siirretä
kuivattuun eikä maustetta vaihdeta tavoiteluvun saavuttamiseksi.
Jos näyttöä ei löydy, stretch raportoidaan NOT REACHED; tavoitetta ei muuteta.

Viiden muun D-tapauksen laakerinlehti-, liemi- tai Dijon-polyolipuute on HOLD.
Puuttuvia polyoleja ei oleteta nollaksi. Jerk-kana, pav bhaji, palak paneer ja
nakkikeitto pysyvät erillisinä aiempina HOLDeina. Muita 22 ehdollista tapausta
ei seulota integraatioon, koska kaikki ensisijaiset 18 eivät täytä ehtoja.

## Alkuperäinen reseptikohtainen luokitus

| Resepti-ID | Luokka | Polyolipuute |
| --- | --- | --- |
| jauheliha-kaalikeitto-vhh | C | U170928-r5 |
| tortilla-de-patatas | A | — |
| tabbouleh | A | — |
| jauhelihapihvit-vhh-kermakastikkeella | D | maille-label-proxy |
| vhh-kaalilaatikko | C | U170928-r5 |
| munakoiso-jauhelihavuoka-vhh | A | — |
| parsakaali-sinihomejuustofrittata | A | — |
| italian-pata | A | — |
| raejuusto-uunimunakas | A | — |
| uunilohi-smetanakuorrutteella | A | — |
| meksikolainen-quesadilla-sienilla | A | — |
| koshari | B | — |
| yangzhou-paistettu-riisi | B | — |
| lohikeitto-kuohukermalla | A | — |
| ropa-vieja | D | U170917-r5 |
| siskonmakkarakeitto-juurekset | D | U170917-r5 |
| kana-parmesaanipannu-parsakaali | D | afcd-F006618-checked, chicken-label-proxy |
| kermainen-kanasienipannu | D | afcd-F006618-checked, afcd-F010466-checked, chicken-label-proxy, maille-label-proxy |

A: kaikki olennainen löytyy; integraatio, lähdehashien lopullinen sidonta ja
omistajan päätös tarvitaan. B: koshari (valkosipuli 7 g ja kuorruttamaton sipuli)
sekä Yangzhou (öljy 27,4 g ja kuuma kypsäpainoinen jasmiiniriisi) vaativat
selvästi nimetyn sisältöversion. C: kuivattu meirami vaatii uutta oikeaa näyttöä.
D: nykyinen näyttö ei riitä julkaistavaan kokonaisarvioon.

## Muutos- ja resurssisuunnitelma

Yksi main-pohjainen julkaisurekisterin paketti ja yksi Draft-PR.
Käsittely kahdessa sisäisessä noin yhdeksän tapauksen osassa, ei erillisiä pinoja.
Täsmälliset syötävät massat, annokset, neljä julkaisumakroa, LOW, nimetyt
valmistusanalogiat, version- ja inputHashit sekä riippumaton Decimal.
Olemassa olevat käännökset sovitetaan vain muuttuvien reseptien osalta;
uusia kieliversioita tai ihmistarkistuksia ei keksitä.

FAST FIRST: lähde- ja syötesidokset, kohdistetut testit ja Decimal ensin.
Yksi suunniteltu paikallinen kokonaisbuild integraation lopussa; sen jälkeen
rajattu Brave-katselmointi. Yksi suunniteltu lopullinen Reseptit PR-CI.
Ei manuaalisia Actions-ajoja, sisäisiä väli-PR:iä, kuvagenerointia tai uutta
testikehystä. Todellisen virheen edellyttämä uusinta kirjataan erikseen.
ReportHubiin yksi merkittävä main-pohjainen handoff; dokumentointirepon normaali
kevyt CI lasketaan erikseen. PR #90 on avoin Draft ja kuvaa vanhaa AJO 7
-tilannetta, joten se ei korvaa tämän ajon tavoite- ja tuloskoostetta.

Ei Ready-siirtymää, mergeä, deployta, yleisen GK-mallin muutosta tai uutta
massatutkimusajoa. Valmis erä tuodaan yhtenä kokonaisuutena omistajalle.
