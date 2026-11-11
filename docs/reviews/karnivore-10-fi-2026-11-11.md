# Karnivore-pääruoat: 10 FI-luonnoksen ensimmäinen laatukierros (11.11.2026)

## Rajaus

- Oma, erillinen sisältö-PR: 10 pääruokaluonnosta eristettyyn `tuonti/karnivore/paaruoat/`-jonoon; julkaisuun hyväksytyt reseptit siirretään myöhemmin `reseptit/paaruoat/`-kansioon.
- Kaikille `status: draft`, `language: fi`, `category: paaruoka`.
- Kanoninen tunniste `carnivore` ja FI-hakusynonyymi `karnivore`. Nykyisen skeeman `diet_class` hyväksyy vain `keto`, `vhh_tiukka` ja `vhh_valjempi`; siksi `diet_class` jätetään kokonaan pois tämän PR:n tiedostoista. Suodattimen toteutus on erillisessä PR:ssä, eikä tätä luokitusta pidä hiljaisesti tulkita sen valmiiksi integraatioksi.
- Ainesosat on punnittu grammoina. Oletukseen sisältyvät liha, kala, kananmunat, voirasva, naudan tali, juusto, suola sekä tarvittaessa vesi. Juusto kelpaa tässä nimenomaisesti sallittuun maitotuotteita käyttävään carnivore-muunnelmaan.
- Uudet ohjeet on kirjoitettu käyttäjän tässä keskustelussa antaman kymmenen ruokakuvauksen pohjalta; kyse ei ole kolmannen osapuolen tekstin kopioinnista.

## Kokkikatselmointi ja korjaukset

| Resepti | Erityinen tarkistus |
| --- | --- |
| Steak & Eggs | Pihvin 63 °C + 3 minuutin lepo; munien kypsennys |
| Smashburger | Jauhelihapihvin riittävä sisälämpö ja oikea smash-tekniikka |
| Pannulohi | Nimike vastaa pannulla paistamista; 63 °C, nahkan kuivaus |
| Short ribs | Virheellinen 300 °C / 4–8 h -> kannellinen pata 150 °C / noin 4–4,5 h |
| Kanareidet | Reisipala, ei rintafilee; 75 °C ja mittaus luun vierestä |
| Jauhelihakulho | Raaka keltuainen korvattu kypsällä munalla oletusohjeessa |
| Porsaan kylki | 150 °C:n pehmennys ja 230 °C:n loppurapeutus, ≥70 °C |
| Maksa ja pekoni | Ei sipulia; pekonin koostumus tarkistettava; 72 °C; raskausvaroitus |
| Meatza | Jauhelihapohja vähintään 75 °C ennen täytteitä; pekoni ensin kypsäksi |
| Lammaskyljykset | 63 °C + 3 minuutin lepo; luullisen osan saanto huomioitava |

## Samankaltaiset julkaisussa olevat reseptit

- `paistettu-maksa-pekonilla` sisältää sipulin, kerman ja mustapippurin. Uusi ohje on tiukka eläinperäinen vaihtoehto, ei tämän reseptin korvaaminen.
- `uunilohi-voikastike`, `voissa-paistetut-kanareidet` ja `hitaasti-haudutettu-nauta` on tunnistettu samantyyppisiksi nimikkeiksi. Uusien sisältöjen erot ovat paistotavassa, raaka-aineissa ja carnivore-rajauksessa; ennen julkaisua tehdään vielä sisällöllinen duplikaattitarkistus.
- Vastaavasti `jauhelihapihvit-vhh-kermakastikkeella` on eri tuote: sisältää muita VHH-ainesosia ja kastikkeen.

## GK-historian tiedostoraja

Historialliset GK-baasitestit vaativat, ettei niiden hyväksyttyyn `reseptit/`-puuhun lisätä automaattisesti uusia reseptitiedostoja. Nämä kymmenen Draftia on siksi eristetty `tuonti/karnivore/paaruoat/`-hakemistoon. Tämä ei ole julkaisulähde. Muiden GK- tai CI-testien sääntöjä ei muuteta eikä kiertotietä julkaisulle käytetä. Lopullinen siirto vaatii erillisen lähde- ja baseline-hyväksynnän.

## Miksi ei vielä published?

1. **Kuvat:** julkaistavalta reseptiltä edellytetään omaa WebP-kuvaa, sopivaa `alt`-tekstiä ja todellisiin pikselimittoihin täsmäävää metadataa.
2. **Ravintoarvot:** tarvitaan kullekin punnittujen raaka-aineiden tuote-/Fineli-tietueet sekä paistorasvan ja luullisen lihan syötävän osuuden saannot. `carbs_total`, `carbs_net`, proteiini ja rasva jätetään pois, ei väärennetä nolliksi.
3. **GK:** eläinperäisyys ei todista GK=0:aa; erityisesti maksa, munat ja maitotuotteet voivat sisältää hiilihydraattia. Arvot ratkaistaan projektin GI/GK-portin omilla näyttösäännöillä, ei tällä sisällönlisäyksellä.
4. **Tuoteselosteet:** pekonista on varmistettava, ettei siinä ole sokeria tai kasvipohjaisia mausteita. Mozzarellan ja voin luonnostaan sisältämiä hiilihydraatteja ei saa sivuuttaa.
5. **Portit:** uuden FI-reseptin ennakkotarkastus, kuvaputki, sisällöllinen duplikaattitarkistus ja julkaisukäännökset ovat erillisiä hyväksyntöjä; tämä PR ei anna niille PASS-leimaa.

## Turvallisuuslähteet

- Ruokavirasto, liha ja jauheliha (sis. 70 °C / 75 °C): https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/kasittely-ja-sailyttaminen/hygienia-kotikeittiossa/liha/
- Ruokavirasto, kypsentäminen: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/hygieeninen-toiminta/tuotanto--ja-kasittelyhygienia/kypsentaminen/
- Ruokavirasto, maksaruoat ja raskaus: https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/maksa-ja-maksaruoat/maksan-kaytto-raskauden-aikana/
- Ruokavirasto, kotimaiset kananmunat ja salmonella: https://www.ruokavirasto.fi/elintarvikkeet/elintarvikeala/omavalvonnan-naytteenotto-ja-tutkimukset/kansalliset-zoonoosivalvontaohjelmat/salmonellavalvontaohjelma/usein-kysyttya/
- FoodSafety.gov, kokolihan, kanan, kalan ja munien lämpötilat: https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures

## Ennen julkaisuvaihetta

- Lisää omat kuvat ja tarkista välttämättömät elintarviketiedot; ei keinotekoisia ravintoarvoja.
- Varmista tuotekohtaiset ainesosat, syötävät määrät ja ravintoarvojen näyttö resepti kerrallaan.
- Suorita sisällöllinen duplikaattianalyysi ja erillinen ruokavaliosuodattimen integrointitesti.
- Aja `npm ci`, `npm test`, `npm run build`, `npm run test:static` sekä tuotantoportit ja päivitä dokumentti tuloksista.
