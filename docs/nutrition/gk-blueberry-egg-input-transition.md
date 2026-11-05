# Mustikkapiirakan GK-syötteen munakorjaus

Lähtöcommit `be26182a1b0547a6d98e889349855ee05bda07c7`. Reseptin luonticommit `17827a13` ja syötteen luonticommit `00dec510` osoittavat, että pohjassa on yksi muna ja täytteessä kaksi. Fineli Release 20:n tietue 858 antaa kuorettoman keskikokoisen kananmunan syötävän osan viitemassaksi 55 g (KPL_M).

| Suure | Ennen | Jälkeen |
| --- | ---: | ---: |
| Pohjan munamassa, g | 165 | 55 |
| Täytteen munamassa, g | 110 | 110 |
| Pohjan munan saatava CHO, g/annos | 0,061875 | 0,020625 |
| Kumulatiivinen poisjätetty CHO, g/annos | 1,194375 | 1,153125 |

Syötteen massakorjauksen laskennallinen vaikutus kahdeksan annoksen koko reseptiin on −0,33 g saatavaa CHO:ta, −13,871 g proteiinia ja −10,164 g rasvaa Finelin koostumuksella. Julkaistujen makrojen erillinen laskentaketju säilyy omassa tarkastelussaan.

- Syötesidos ennen `e485d104a8a1eafe27a49aa726a0145017d96c7659146ca38f1df5a136f25eb8`
- Syötesidos jälkeen `5a6b2400402a3f533eb87f86af97a5fb196d73e93915700446df3ff7e53844f9`
- Täydellisen tulosobjektin SHA-256 ennen `5e626bd26cdc469672fb88dcf9021688e585992bf1927a8cf00eb8f4205b9396`
- Täydellisen tulosobjektin SHA-256 jälkeen `eab4e1090d5c2f90820e91885092af8758965c80186265747ec1170406c76275`

Kohdistettu 326/87-vertailu läpäisi. Ainoa muuttunut alkuperäistulos on mustikkapiirakan HOLD-rivi, jossa paistetun metsämustikan GI-soveltuvuus jää avoimeksi. Kaikki 87 lisäversiota ja kattavuusmittarit täsmäävät. Mustikkapiirakan hyväksytyssä erillisversiossa pohjan muna on jo 55 g. Sama kolmen munan muunnosteksti löytyi kauralesesämpylöistä ja pinaattiletuista, joiden alkuperäisreseptit sisältävät kolme munaa.

Evidenssisidos säilyy, sillä käytetyt lähdetietueet ovat samat. Vain nykyisen syötteen sidos päivittyy. PR #291:n ja #292:n historialliset snapshotit kuvaavat edellistä tilaa. #292:n nykytilan vertailu tarvitsee myöhemmin tämän reseptin erikseen sallitun deltan. #291:n main-yhteensopivuus sekä #292:n mansikkakakun NO_RELIABLE_GK-päätöksen siirto ovat erilliset yhdistämisen edellytykset.

## Omistajan hyväksymien sisältökorjausten siirtymä

[Omistajan päätös](https://github.com/ozirix-dev/Reseptit/pull/292#issuecomment-6664633388) koskee chillan ja Mapo tofun sisältöä. Chillan taikinassa on 50 g tuoretta pinaattia ja 140 ml vettä. Paneer lämmitetään taitettujen lettujen sisällä. Ohje odottaa koepaistoa. Mapo tofun neljän annoksen riisi on 600 g kypsää pitkäjyväistä riisiä. Fineli 30346 sisältää 23,561 g saatavaa CHO:ta / 100 g kypsää riisiä, joten osuus on 35,3415 g annosta kohti. Riisin GI sekä chillan kikhernejauhon ja paneerin GI odottavat soveltuvuusnäyttöä.

[Siirtymäaineisto](gk-original-content-transition.json) yksilöi kolmen alkuperäisen HOLD-rivin syötteet, tulokset ja sidosten tarkisteet ennen ja jälkeen. Ravintoinventaarion kaksi muuttunutta riviä sisältävät uudet reseptimetatiedot. Niiden julkaistut makrot ovat edelleen tyhjiä. Historiatestien adapteri hyväksyy vain täsmälleen dokumentoidun uuden rivin ja palauttaa testivertailuun vanhan rivin. Nykytilan regressio tarkistaa uuden rivin erikseen. Vanhojen baselinejen tarkisteet säilyvät, ja muut 323 alkuperäistulosta sekä 87 hyväksyttyä lisäversiota täsmäävät lähtötilaan.

Chillan hyväksytyn erillisversion reseptisidos varmennetaan vanhasta reseptinäkymästä vasta, kun uuden toimituksellisen tekstin SHA-256 täsmää. Hyväksyntäpakettien sisältö ja tarkisteet säilyvät. PR:t #291 ja #292 ovat erillisiä tutkimushaaroja. Niiden mahdollinen jatkointegraatio tarvitsee tämän siirtymän huomioinnin sekä aiemmin tunnistetut baseline- ja mansikkakakkukorjaukset.

Mainin erillinen raejuustopizzan julkaisu #294 muutti vertailun kokonaismäärän 327:ään. Nykytilassa numeerisia alkuperäisiä on 156, puuttuvia 171 ja 80 prosentin tavoite 262. Pizza on uusi HOLD. Historiavertailu palaa 326 reseptiin vain kyseisen tarkan tulosrivin ja syötteen varmennuksen jälkeen.
