# Kikherne-V2:n kuva- ja GK-HOLD-tarkisteen täsmäpäivitys (13.11.2026)

## Julkisen FI-version korjaus

- V2 on jo julkaistu tunnuksella `valimerellinen-kikherne-yrttiaamiainen-punnittu-v2`, ja sen pysyvä URL on `valimerellinen-kikherne-yrttiaamiainen`.
- Uusi kuva `kuvat/aamupalat/valimerellinen-kikherne-yrttiaamiainen-v2.webp` on ruokalajin nykyisen 7 ainesosan mukainen havainnekuva: kikherneet, kurkku, persilja, sitruuna/öljy ja kovaksi keitetty kananmuna. Kuva on AI-generoitu, eikä fyysistä koepaistoa väitetä tehdyksi.
- Git-blob `75c9c75125dabde2df1452fc66e03879a8d5cebd`, 254 882 tavua, 1536 × 1024 WebP.
- FI-lähteen ainoat muutokset: `image.src`, kuvan alt ja kuvituskuvan huomautus. Ingredients, servings, preparation, nutritional values, recipe ID and slug do not change.

## Uuden V2:n versionlukko

`docs/nutrition/new-public-gk-pending-sources.json` seuraa erikseen uutta FI-V2-julkaisua, jolla ei ole hyväksyttyä GK-arvoa. Sen vanha alkuperäisen V2-tiedoston blob oli `172af458934dce456a54ccaacee8a2fb0c6f4b64`. Uusi lähdekuvan muutos on `81707cb321c504a0765f29933ab4f6049dcd53ea`. Päivitetään täsmälleen yksi rekisterin rivi ja pidetään **GK: ei määritetty**. Rekisterin muita 34 tunnusta, alkuperäisen reseptin `glycemic-load-recipe-bindings.json`-historiasinettiä ja 21 jäsenen julkaisukaranteenia ei muuteta.

Tämä on kuvavastaavuuden ja nykyisen lähdetarkisteen ylläpito, ei GK:n numeerinen hyväksyntä. Laskettu neljän makron arvio pysyy **10,20 / 13,66 / 11,10 / 10,95 g** (netto-HH / HH+kuitu / P / rasva) per annos; julkaistu V2 eroaa vanhasta karanteenissa olevasta reseptistä. Käytä jatkossakin alkuperäisestä erillistä versiontunnusta, älä julkaise karanteenissa olevaa vanhaa tunnusta uudestaan.
