# Recipavo – B21 ravintoperustan 8 lähdelukittua julkista karanteenia (10.11.2026)

**Rajaus:** issue #404:n 21 aines- ja ravintoesteestä #02/#40/#63:n julkisen FI-valmistuksen oikaisu on julkaistu erillisessä PR #409:ssä, mutta niiden ravintoevidenssi on edelleen HOLD. Tämä PR eristää **kahdeksan** muuta reseptiä, joiden ainesosa-/ravintoperusta ei ole puolustettavasti julkaistavissa. Kyse ei ole uusista ravintoarvoista, reseptin korjaamisesta tai GI/GK:n hyväksymisestä.

| Issue #404 | Resepti | Peruste – korjausehto |
|---:|---|---|
| 21 | `pohjoisafrikkalainen-maakouda` | peruna kappaleena, CHO/GK-perusta epäselvä; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 26 | `indonesialainen-lontong-sayur-aamiaiseksi` | kokonainen kaali ilman syötävää grammapainoa; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 28 | `japanilainen-miso-tofu-paksoi` | 150 g misoa ja wakamea; kuivattu/valmis tila epäselvä; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 34 | `korealainen-mandu-keitto-aamiaiseksi` | 150 g merilevää ilman tuore/kuivattu- tai jodiperustaa; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 44 | `valimerellinen-appelsiini-aamiaiskakku` | puutteellinen taikinan rakenne ja väärä uuniohje; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 45 | `valimerellinen-kikherne-yrttiaamiainen` | valmistuksessa kananmuna ja sitruunaöljy ilman ainepunnituksia; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 62 | `kiinalainen-bao-munalla` | bao-taikinasta neste ja kohotusaine puuttuvat; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |
| 64 | `malesialainen-kuih-seri-muka` | pandanin tila ja munakerroksen höyrytystapa määrittämättä; varmista oikea resepti, todellinen syötävä määrä ja riippumaton ravintomalli ennen paluuta |

Tekninen ratkaisu: lisätään vain kahdeksan tarkasti nimettyä `recipe_id`-tunnusta olemassa olevaan `site/scripts/public-recipe-quarantine.ts`-karantenilistaa. Tämä poistaa käyttäjälle näkyvät valmistusohjeet sekä niitä vastaavat julkiset GK/GK-only-kortit, hakutulokset ja reseptireitit. **Alkuperäiset FI-lähdebitit, vanhat ravintolaskelmat, GK100-bundlet ja käännösrekisteri eivät muutu.** Raportissa jokaisen 8 Git-blob-SHA on lukittu CI-testillä. Vanha 3 kohteen turvakaranteeni säilyy: julkisia karanteenitunnuksia yhteensä **11**.

Tämä erä on valittu ennen viittä muuta B21:n ravintokriittistä reseptiä, joilla on erillinen GK100-version näyttö-/seurantariippuvuus. Niitä ei hyväksytä tässä. B21:n muut 5 menetelmä-/rajausasiaa ovat erillisiä varsinaisia valmistuskorjaus- tai ravintotarkistuksia.

**Kattavuus:** tämän commitin lähtötilanteessa FI-aamiaisia on 147 julkisena, uuden karanteenin jälkeen odotetaan 139. Kaikkien julkaistujen FI-reseptien kokonaislukema on tarkistettava nykyisen main-tilan perusteella; historiallisten source-rivien määrä ei pienene.

**Käyttäjäavaus:** karanteeni vähentää julkisen sisällön riskiä, mutta ei ole näiden 8 reseptin lopullinen hyväksyntä. Issue #404:n checkboxit säilyvät avoimina, kunnes reseptit on uudelleen tarkistettu, punnittu ja turvallisesti palautettu. Cloudflare Coming Soon pysyy ennallaan.
