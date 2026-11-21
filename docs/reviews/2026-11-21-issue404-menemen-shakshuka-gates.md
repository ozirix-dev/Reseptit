# Issue #404: menemen ja pinaatti-fetashakshuka — ravinto- ja kieliporttien uusintatarkistus

**21.11.2026 · TOTEUTETTU KATSELMOINTI / EI KOKONAISHYVÄKSYNTÄÄ**

- Tarkastaja: ChatGPT:n suorittama lähde-, laskenta- ja kielitarkistus; ei väitettä ihmisarvioijasta eikä omasta koekeittiöstä.
- Lukittu lähtö-`main`: `41da757d67fb302553d7f13fcc236bfad5e9dd0f`.
- Rajaus: kaksi **jo julkaistua** suomenkielistä C13-korttia (#46 ja #47), kummankin kolme julkaistua käännöstä, niiden laskentatietueet ja nykyiset GI/GK-rajoitukset. Ei uusia reseptejä eikä uutta arvoa laskentarekisteriin.
- Tulokset: **2/2 neljän makron riippumatonta aritmeettista tarkistusta PASS**; **6/6 nykyisen EN/SV/TH-käännöksen olennaista aines-/kypsyys-/allergeenivastaavuutta PASS**. **0/2 lopullista issue-kortin sulkuhyväksyntää**, koska osa tuotemäärittelyistä ja GK-/julkaisuporteista ei ole kattavasti vahvistettu.

## Tarkistettujen tiedostojen identiteetit

| Resepti | Kanoninen FI Git-blob | Laskentatiedoston Git-blob |
| --- | --- | --- |
| `valimerellinen-menemen-fetalla` | `6a767558edc1ee37372f9029ca4ea88c6f129746` | `5fb16b4ec3c1edcf10e312027b7d71cfc4d4ea46` |
| `valimerellinen-pinaatti-fetashakshuka` | `3e2882523e98b4ab681c97d8a95a5e6c59f5a7bb` | `41f50b722344fd067ae191dd923ad91f9b3904af` |

| Lähde | Menemen EN/SV/TH Git-blobit | Shakshuka EN/SV/TH Git-blobit |
| --- | --- | --- |
| EN | `dcb27ea6eba20094f491649ecc84d2c1b56c4a12` | `aa84114a32ce23881714f8f416ec557b1a702872` |
| SV | `e05601dfa3fd920f261b58be943c379bd5870a05` | `625ea0b0f3f80a117813fdca21bd46287b489ed5` |
| TH | `161a21e9c8e8bb71368b85310e7578d96a31ed76` | `57d8d1709d5cb0e093eb034dd5662ad7ae72ad93` |

Aiemmat kieliparien `codex-review-evidence.json`-merkinnät olivat PASS (shakshuka 13.11.; menemen 14.11.). Tämä audit luki kaikki kuusi nykyistä käännöstä uudelleen, mutta ei muuta entisiä tiivisteitä, koska kielilähteitä ei muutettu. Regressiotesti `site/tests/issue404-two-egg-recipes-final-gates.test.ts` tarkistaa nykyisten lähteiden kriittiset valmistusvaiheet ja makrokentät.

## Makrojen riippumaton uudelleenlasku

Jokaisessa laskelmassa käytettiin **nykyisen JSON-lähderekisterin** ravintokomponentteja per 100 g, todelliseen syötävään massaan kirjattua kerrointa, kahta annosta ja pyöristystä vasta koko erän jakamisen **jälkeen**. Tämä on nykyisten lähdemallien aritmeettinen replikointi, **ei** pakkauskoe, fyysinen kypsennyssaanto eikä uusi tuotekohtainen mittaus.

| Per annos | Menemen laskettu = julkaistu | Shakshuka laskettu = julkaistu |
| --- | ---: | ---: |
| Nettohiilihydraatit (`carbs_net_per_serving_g`) | **5,35 g** | **3,52 g** |
| Kokonaishiilihydraatit (netto + kuitu + polyolit) | **7,13 g** | **5,02 g** |
| Proteiini | **21,58 g** | **21,98 g** |
| Rasva | **31,02 g** | **30,91 g** |

- Molemmissa kaksi kuoretonta kananmunaa á 55 g, yksi 125 g:n syötäväksi laskettu tomaatti, 150 g fetaa ja **13,5 g öljyä oletuksena kokonaan annoksiin jääväksi**.
- Menemen: lisäksi yksi vihreä paprika, oletus 170 g syötävää osaa. Shakshuka: lisäksi 100 g raakaa täysikasvuista pinaattia. Kappalekoot, hävikki ja annosten todellinen syötävä massa voivat poiketa oletuksista.
- Munat: Fineli 858; tomaatti: Fineli 352; feta: **Fineli 11211 / vuohenmaitoinen feta, rasvaa 25 %**; öljy: Fineli 541; paprika: Fineli 387; pinaatti: AFCD F008761. Kyseessä ovat laskennan nimetyt lähdetietueet; tuotepakkaus ja käyttäjän valitsema feta eivät automaattisesti vastaa niitä.
- Kaikkien **mukaan otettujen** ravintotietueiden polyolikomponentti on laskennassa eksplisiittisesti lähteistetty ja ilmoitettu nollaksi; mukana on kuidun erillinen arvo. Se ei oikeuta korvaamaan tulevasta pakkausmerkinnästä puuttuvaa polyolia nollalla.
- Määrittelemätön `suolaa maun mukaan` jätetään neljän makron laskennan ulkopuolelle perustellusti; tämä **ei** varmista natriumin määrää. Laskentatiedostojen `reviewerStatus` säilyy `AUTOMATED ONLY`. Tekninen `ESTIMATE WITH EVIDENCE` ei ole tuote- tai ravintoarvojen uusi riippumaton hyväksyntäsinetti.

## Neljän kielen merkitysvastaavuus

- Kahdeksan reseptitiedostoa: FI + EN/SV/TH molemmille; kaikki `status: published`, 2 annosta, kuusi ainesriviä ja identtiset neljä laskennallista makroa.
- **Menemen:** yksi tomaatti, yksi vihreä paprika, kaksi munaa, 150 g fetaa, 1 rkl neutraalia öljyä ja suola. Vihannekset pehmennetään ennen munia; munat kypsennetään kauttaaltaan. Neljä kieltä vastaavat toisiaan, ei puuttuvia munan tai maidon allergeeneja.
- **Shakshuka:** 100 g pinaattia, yksi tomaatti, kaksi munaa, 150 g fetaa ja 1 rkl öljyä. Munat lisätään kahteen syvennykseen, kansi ja matala lämpö; **8–12 minuuttia** tai kunnes valkuaiset ja keltuaiset hyytyvät. Kuvaan mahdollisesti kuuluvat leipä, yrtit ja siemenet ovat vain tarjoiluehdotus eikä niitä lasketa ruoan arvoihin; sama huomio säilyy kaikilla kielillä.
- [FDA:n kananmunaturvaohje](https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling) tukee läpikypsää munaa, vaikka osa perinteisistä menemen- ja shakshukaohjeista tarkoituksella jättää keltuaisen pehmeäksi.
- Valmistusmenetelmän riippumattomat **vertailut** (eivät täsmäainesmääriin tehtyjä omia testejä): [Refika's Kitchen / menemen](https://www.youtube.com/watch?v=7fUI-nbEbN4); [NHS / munashakshuka ja pinaatti](https://www.nhs.uk/healthier-families/recipes/shakshuka/). Niiden määrät ja mahdolliset lisäainekset poikkeavat näiden kahden Recipavo-version aineslistoista; niitä ei kopioida ravintolaskennan todistukseksi.

## Avoimet lopulliset hyväksyntä- ja julkaisuportit

1. **Feta / tuote:** nykyisissä reseptilistauksissa lukee pelkkä `feta`, mutta laskentapohja koskee **vuohenmaitoista 25 % fetaa**. Menemenin huomautus ei yksilöi oletusta, shakshukan huomautus kertoo vain rasvaprosentin. Valitse lähteistetty vastaava tuote tai kirjaa molempien FI/EN/SV/TH:n tuoterajaus sekä vahvista vaikutus laskentaan. Mahdollinen lähdetekstin muutos edellyttää **uudet** kielitiivisteet, arvioinnit ja GK-historiasidosten tarkistuksen.
2. **Annos/retentio:** tomaatti-/paprikakappaleet, 55 g:n kuoreton munakoko ja kaiken paistoöljyn jääminen ruokaan ovat laskentaoletuksia. Niitä ei väitetä Recipavossa punnituiksi; tuote- ja käyttörajaukset on pidettävä selvinä käyttäjälle. Puuttuva koekeittiö ei yksin estä etenemistä.
3. **GK-soveltuvuus:** shakshukan `docs/nutrition/gk-reviewed-portions.json` sisältää 18.11. katselmoidun historiallisen GK-arvion, jossa pinaattina on AFCD **F008749** (0 g imeytyvää HH/100 g), mutta neljän makron ravintolaskelma käyttää **F008761** (0,6 g/100 g, tästä **0,3 g per annos**). Ero on jo kuvattu GK-kohteen selitteessä. Älä laske uutta GK:ta tai siirrä hyväksyntää ilman oikean tuotteen, GI-lähteen, annoksen ja sidoksen uutta arviointia. Menemen ei saanut tästä tarkistuksesta uutta `gk-reviewed-portions`-merkintää; sen historiallista GK-tilaa ei tulkita julkaisuarvoksi.
4. **Tuotanto:** tarkistusyhteydestä ei saatu Recipavon kahden FI-reitin HTTP-vastausta. Tässä ei ole todettu niiden olevan alhaalla eikä tuotannon Cloudflare-deployn täsmä-SHA:ta. Ennen issue-rivin sulkemista tarvitaan suora FI/EN/SV/TH HTTP- ja näyttötarkistus ja julkaistun sisällön vastaavuus tarkistettuun SHA:han.
5. **Hyväksyntä:** nykyiset lähde-, ravinto-, F25-/GK- ja käännössinetit jätetään muuttumatta. Issue #404:n 38 alkuperäisestä rastista ei kuitata kumpaakaan tällä raportilla. Katselmointi on käyttökelpoinen riippumaton aritmetiikka- ja kielivertailu, ei yleinen ihmis- tai koekeittiöhyväksyntä.

**Toteutusraja:** vain dokumentoitu nykytila ja regressiotesti. Ei muutoksia reseptiteksteihin, ravintolukuihin, ruokavalio- tai GK-luokkiin, kuvaan, kielisivuisiin merkitystiivisteisiin, karanteeniin tai Cloudflareen. Mahdolliset lähdekorjaukset valmistellaan omassa myöhemmässä resepti- ja ravintolaskenta-PR:ssä SHA-sidottuina.
