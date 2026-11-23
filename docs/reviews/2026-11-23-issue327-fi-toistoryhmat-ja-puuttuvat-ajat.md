# FI-valmistusvaiheiden toistoryhmät ja puuttuvat kokonaisajat

Issue [#327](https://github.com/ozirix-dev/Reseptit/issues/327) · 23.11.2026

Tarkistus koskee `main`-committia `916a3c99404c7ec37e17ba25d1e63cffdb5ad09a`. [Recipe site -ajo](https://github.com/ozirix-dev/Reseptit/actions/runs/45145527391) läpäisi. [FI-julkiesityksen auditointiartefakti](https://github.com/ozirix-dev/Reseptit/actions/runs/45145527391/artifacts/14804706055) kattaa 411 suomenkielistä julkaistua reseptiä karanteenin ulkopuolelta. Artefakti kuvaa CI:ssä rakennettua esitystä.

## Valmistusvaiheiden toistot

Julkiesityksessä on kuusi toistoryhmää, joissa on yhteensä yhdeksän eri reseptiä. Vertasin ryhmiä ja samaan committiin sidottuja lähdetiedostoja aiempaan lähdekatselmointiin. Kaikki kuusi ryhmää vastaavat aiempia päätöksiä. Yhdenkään ryhmän yhteisestä vaiheesta ei löytynyt siihen liittyvää valmistusvirhettä. [Aiempi lähdekatselmointi](https://github.com/ozirix-dev/Reseptit/issues/327#issuecomment-7089925188)

| Toistuva vaihe | Reseptit | Päätöksen peruste |
| --- | --- | --- |
| Puuron haudutus | Hirssipuuro taateleilla, korealainen kasvisjuk ja pohjoisafrikkalainen taatelipuuro appelsiinilla | Yhteinen vaihe kuvaa puuron rakenteen seuraamista. Vilja, nestemäärät ja muu valmistus määritellään kussakin reseptissä. |
| Kasvisten ja kapristen valmistelu | Paahtopaistileipä piparjuurikastikkeella ja paahtopaistileivät kauralesesämpylöillä | Molemmat käyttävät samoja täytteitä. |
| Riisipuuron peruspohja | Thaimaalainen kanariisipuuro ja porsasjok | Molemmissa on 100 g kuivaa valkoista riisiä ja 700 ml vettä. Lihan valmistus kuvataan myöhemmin erikseen. |
| Paahtopaistileivän kokoaminen | Paahtopaistileipä piparjuurikastikkeella ja paahtopaistileivät kauralesesämpylöillä | Täytteet ja niiden jako ovat samat. Leipäpohjat valmistellaan reseptikohtaisessa vaiheessa. |
| Vuokien valmistelu | Munakasmuffinit ja pienet tonnikalamunakkaat | Julkiesitys käyttää molemmissa kuutta vuokaa ja samaa uunin lämpötilaa. Täytteet ja paistoajat on kuvattu erikseen. |
| Piparjuurikastike | Paahtopaistileipä piparjuurikastikkeella ja paahtopaistileivät kauralesesämpylöillä | Molemmat käyttävät samaa kastiketta ja samoja määriä. |

## Kokonaisajat

Käyttäjän päätös sallii kuudelle reseptille määrittämättömän kokonaisajan. Kaikki kuusi nimeä täsmäävät CI-artefaktiin. Puuttuminen on tietokattavuushavainto. [Hyväksytty päätös](https://github.com/ozirix-dev/Reseptit/issues/327) · [Lähdekohtaiset perustelut](https://github.com/ozirix-dev/Reseptit/issues/327#issuecomment-7096278246)

- `keto-kauralesesampylat`
- `lohikeitto-kuohukermalla`
- `paprikainen-vhh-gulassi`
- `parsakaali-sinihomejuustofrittata`
- `ketopizza-pofiber-pohjalla`
- `uunilohi-smetanakuorrutteella`

Julkiesityksessä on 0 geneeristä kuvausta ja 0 puuttuvaa valmistusosiota. Lähdeauditissa on 0 virheellistä aikaa ja 0 toistuvaa aikakenttää. Tähän tilannekuvaan kuuluvat kuusi toistoryhmää ja kuusi puuttuvaa kokonaisaikaa on käsitelty. Uusi havainto arvioidaan oman lähdenäyttönsä perusteella.

Kaikkien 15 tarkastetun lähdetiedoston SHA-256-alku vastasi CI-raporttia. Raportin `public-current.json` SHA-256 on `00d75401fbc45e04e0d773857003f34035dbca99e69727d285c929f5de4053cd`.
