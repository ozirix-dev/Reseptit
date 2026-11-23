# Chat 3 – kastikkeiden päällekkäisyystarkistus 22.11.2026

**PR #808**, tarkistettu lähtö-HEAD `a47873a83300dba52d329f82751d088f51ec8964`, main `fa1b4c42779e5323f267dc860d75c4857340ab30`.

Päähaaran Git-puusta tarkistettiin **489 FI-reseptitiedostoa**: yhdelläkään ei ollut samaa täsmäpolkua kuin kymmenellä uudella kastikereseptillä. Repo Guardin kautta tarkistettiin **27 avoimen PR:n otsikkoa**: samoille nimetyille erillisille kastikkeille ei löytynyt kilpailevaa PR:ää. Lähimmät olemassa olevat päähaaran reseptit avattiin myös sisällöllistä vertailua varten. Tämä on rajattu toimituksellinen arvio, ei kaikkien tulevien haarojen tai slugin reittien automatisoidun julkaisuportin korvike.

| #808 recipe_id | Lähin vertailu ja olennainen ero |
| --- | --- |
| perinteinen-ruskea-kastike | PR #798 on lihapullat–ruskea kastike–perunamuusi kokonaisena ruokana; #808 on erillinen viiden ainesosan yleiskastike |
| kermainen-tillikastike | Silakkapihvit tilli-kermakastikkeella on paistettu kala-annos kuumalla kermakastikkeella; #808:ssa on kylmä kermaviili-tillilisuke |
| kantarellikastike | Porsaanfilee-sienikastike ja pienet kantarellipiiraat ovat kokonaisia ruokia; #808 on itsenäinen 350 g kantarellin ja 20 g vehnäsuurusteen kastike |
| sinappikastike-joulukinkulle | Hunaja-sinappikana-kaalilla on kanaa sisältävä pääruoka; #808 on kahden sinapin ja kasvisliemen kastike kinkulle |
| kylma-piparjuurikastike | Paahtopaistileivän piparjuurikastikkeessa on smetanaa, majoneesia ja Dijonia; #808:n itsenäisessä kastikkeessa 12 % crème fraîche, ei majoneesia tai Dijonia |
| perinteinen-munakastike | Muut kananmunaruoat eivät ole erillisiä maidolla ja vehnällä suurustettuja kovaksi keitetyn munan kastikkeita |
| kermainen-pippurikastike | Kermaiset liha-/kanakastikeruoat ovat pääruokia; #808 on erillinen salottisipuli–lihaliemi–kerma–Dijon-kastike |
| perinteinen-valkokastike | Muut kermakastikeruoat ovat ruokalajin osia; #808 on sileä maito–voi–vehnäjauho-peruskastike |
| puolukkakastike-jalkiruokiin | Puolukkakiisseli suurustetaan perunajauholla; #808:n puolukkakastikkeessa osa marjoista jää kokonaisiksi eikä suurustetta lisätä |
| perinteinen-vaniljakastike | Marjakiisseli vaniljakastikkeella on kaksiosainen jälkiruoka, jonka kastikkeessa on kermaa ja eri suhteet; #808:ssa 450 g täysmaitoa ja 18 g maissitärkkelystä |

**Toimituksellinen päätös:** 10/10 `checks.duplicates` voidaan kirjata `pass`-tilaan tämän rajatun nykytilakatselmoinnin perusteella. Julkaisukatselmuksessa on tarkistettava uusin main, avoimet PR:t ja automaattinen URL/recipe_id-yksikäsitteisyys uudelleen. Tämä arvio ei muuta muiden tarkistusten `pending`-tilaa, `decision: hold`-päätöksiä eikä `status: draft`-metadataa. Chat-1 omistaa Ready/merge-julkaisupäätökset.
