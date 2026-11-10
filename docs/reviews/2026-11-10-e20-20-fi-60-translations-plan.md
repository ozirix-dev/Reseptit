# E20: seuraava 20 reseptiä / 60 käännöksen laatulukittu julkaisusuunnitelma

Päivä 10.11.2026. Tarkka lähtömain `bd11aa4847c763229996d17731c142f13c24ce2e`. E20 ei sisällä 60 uutta julkaistua käännöstä; tarkoitus on kerätä yhteen **20 laadullisesti hyväksyttyä FI-lähdettä × EN/SV/TH**, ja julkaista ne aikanaan yhdellä täsmä-HEADin CI:n läpäisevällä release-PR:llä.

## Valitut ja jatkokatselmoinnin tilat

**Yhdeksän yksilöityä jatkoehdokasta (ei vielä release authorization):**

- `lahi-ita-taatelipuuro-tahinilla`: PR386 draft triple; review nutrition and semantics
- `pohjoisafrikkalainen-minttutee-kaurapuuro`: PR386 draft triple; whole milk FI display now main
- `karibia-johnny-cake`: PR386 draft triple; review cooking and macros
- `briossisampylat-joshua-weissman`: PR395 draft triple; attribution retained, GK not approved
- `hampurilaissampylat-moomie`: PR395 draft triple; attribution retained, GK not approved
- `kevyet-briossisampylat-clever-carrot`: PR395 draft triple; attribution retained, GK not approved
- `yrttituorejuusto-kinkkurullat`: FI public overlay PR394 corrected 4 servings/cold cooking, new translations needed
- `malesialainen-mee-goreng-aamunuudeleilla`: FI public overlay PR394 corrected wheat noodle facet, translations needed
- `vietnamilainen-hu-tieu-aamiaiskeitto`: Specific FI steps; meat fully cooked and 20 minute time review

**11 SOURCE-HOLDia, joista käännöstä ei tehdä ennen korjausta:**

- `kiinalainen-teehaudutetut-munat`: Cooked eggs peeled before cracked-shell tea marinade: contradiction
- `karibia-kookosriisi-pavuilla`: 100g dry rice with 184g coconut milk needs water/cooking evaluation
- `japanilainen-onigiri-lohella`: Generic rice and tofu/egg text, not salmon onigiri preparation
- `intialainen-aloo-paratha`: Generic bread preparation missing potato filling
- `lahi-ita-labneh-kulho-zaatarilla`: Generic warm bean/tofu bowl instructions for cold labneh
- `valimerellinen-ricotta-persikkakulho`: Generic warm bowl for cold ricotta and peach
- `intialainen-rava-uttapam`: Generic pancakes, no specific rava texture/frying
- `valimerellinen-menemen-fetalla`: Generic bean/meat skillet, not menemen
- `malesialainen-apam-balik`: Generic pancake template and irrelevant legumes
- `japanilainen-soba-aamiaiskeitto`: Generic soup, soba cooking times not specific
- `thai-maissifritterit`: Generic mashed-item fritters, corn technique unclear

Ensimmäisistä kuudesta on jo 18 EN/SV/TH-käännösluonnosta [PR #386](https://github.com/ozirix-dev/Reseptit/pull/386) ja [PR #395](https://github.com/ozirix-dev/Reseptit/pull/395) -haaroissa. Kolmen muun kieliversioita ei vielä ole. Aiempi [C20-julkaisu #385](https://github.com/ozirix-dev/Reseptit/pull/385) sisälsi **erillisen** 9 käännöksen julkaisun eikä sitä lasketa tähän E20-tavoitteeseen.

## Julkaisumenettely

1. Tässä PR:ssä SHA-lukitaan kaikki 20 FI-lähdettä `meta/kaannokset/e20-source-worklist.json`-tiedostoon. Jokaisella `release_authorized: false`. Yleinen `site/scripts/translation-source-preflight.mjs` tarkistaa julkaistun FI:n, yksilöidyn blob-SHA:n ja tunnistetun geneerisen ohjeen. Yksi CI-portti myös tälle E20-työjonolle; muutettua SHA:ta ei hyväksytä hiljaisesti.
2. Selvitä 11 HOLDia FI-lähteen ja ravintolähteiden perusteella ensin. Jos korjaus vaikuttaa punnittuihin aineksiin, annokseen tai GI/GK:hon, se vaatii uuden laskennan. Kanonisen ravinto/GI/GK-lähteen SHA-sidoksia ei muuteta huomaamatta.
3. Katselmoi 9 jatkoehdokkaan sisällöt ja tarkista kaikki EN/SV/TH-vaiheet, annokset, ainesmäärät ja ajalliset ohjeet. Ruokalajikohtaiset valmistusohjeet, ei mallipohjia. Ruotsin/thain merkitys ja ruoan kypsyys erillisenä porttina. Ei ihmiskatselmoinnin väitettä.
4. Lisää versiosidottu `source_hash` + `translation_hash` kuhunkin vasta **hyväksytyn** julkaisukäännöksen exact HEAD -versioon; HOLD ei tuota pass-evidenssiä.
5. Kokoa hyväksytyistä **yksi main-pohjainen julkaisu-PR**, jolla tavoite 20 FI / 60 kieliparia. Jos jokin rivi ei läpäise, pidä se HOLDissa eikä väkisin täytetä määrää. Yksi PR-CI per HEAD ja vain juurisyyhyn sidotut korjaukset; merge-SHA Pages build + deploy SUCCESS erillisenä varmistuksena.

Tämä on **lähdevalinnan Draft**, ei 60 uuden käännöksen toimitus, eikä julkaisusivurekisterin tai kanonisen FI-/GI/GK-aineiston muutos. Edellinen Pages-palautus vahvistettu; kaikki tulevat main-merge-SHA:t on silti tarkistettava erikseen.

## Konsolidointi yhteen E20 Draft-PR:ään 10.11.2026

[PR #386](https://github.com/ozirix-dev/Reseptit/pull/386) (HEAD `9682b1022dc30958d7659e28ca3a68d29d655c46`) ja [PR #395](https://github.com/ozirix-dev/Reseptit/pull/395) (HEAD `96dc07a2e81e2828887316f16e289b869a414775`) sisälsivät yhteensä 18 ennestään laadittua EN/SV/TH **Draft**-tiedostoa. Ne on nyt kopioitu sanasta sanaan E20:n työhaaraan täsmälleen noista HEAD-versioista. Kinkkurullien, mee gorengin ja hu tieu -keiton 9 uutta Draft-käännöstä olivat jo tässä E20-haarassa.

E20-haarassa on siis **9 FI-reseptin 27 kieliluonnosta**: 6 aiemmin kirjoitettua (18 kieliversiota) + 3 nyt kirjoitettua (9). **11 SOURCE-HOLDissa olevaa FI-lähdettä ei ole käännetty.** Kaikilla 27 kieliversiolla `status: draft` ja julkaisuvaltuus `false`. Aiemmat kaksi Draft-PR:ää ovat tämän kopion jälkeen vain historiallisia lähtöaineistoja; niitä ei pidä yhdistää mainiin E20:n rinnalla. Yhdistäminen edellyttää edelleen 20 lähteen laatuhyväksyntää, semanttisia SHA-evidenssejä ja puhdasta main-pohjaista release-PR:ää. Käännösten `Draft`-tila ei ole julkaisu.
