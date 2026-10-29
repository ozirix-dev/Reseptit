# AJO 2.0A: kolmen GK-palautusehdokkaan lähdekatselmointi

Päivä: 2026-10-29. Päätös: **NO CALCULATIONS APPROVED**.
Kaikki kolme GK-arvoa jäävät nulliksi. Tämä dokumentti säilyttää tutkimuksen;
laskentasyötteisiin, katalogiin, kaavaan, toleransseihin tai resepteihin ei tehty muutoksia.

## Julkaisu ja muuttumaton lähtötilanne

[PR #129](https://github.com/ozirix-dev/Reseptit/pull/129) yhdistettiin normaalilla
merge-commitilla `16a9c0444ff7b9d6ea61b20abd2c31b0d0ae9fa2`.
HEAD oli hyväksytty `743bef0502e27d530dc2b7dbd949b09b508dbe2c`, viimeisin PR-CI PASS,
review-lista ja avoimet review-ketjut tyhjät, mergeable true. GitHubin branch protection
-palautus oli "Branch not protected" ja rules-lista tyhjä. Draft poistettiin ennen mergeä.

[Main-CI 40840004918](https://github.com/ozirix-dev/Reseptit/actions/runs/40840004918)
ja Pages-deploy onnistuivat. GI/GK-testit suoritettiin: 85/85, staattiset 24/24.
[Tuotannon GK-sivu](https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/)
verrattiin kaikilta 326 reseptiriviltä hyväksytyn version buildiin 2026-10-29T08:12:56Z:
326 / 85 laskettua / 241 keskeneräistä, 26,1 %. Kaikki 12 poistettua arvoa puuttuivat.
GI-tietueita 45; bakery GI58 REFERENCE_ONLY, aktiivisia sidontoja 0.

Uusi työpuu `Reseptit-gk-recovery-2a`, haara `codex/gk-recovery-2a`, luotiin vasta
julkaisun tarkistamisen jälkeen main-merge-SHA:sta. Origin ja repo_guard PASS:
`ozirix-dev/Reseptit`. Rinnakkaiset työpuut säilytettiin.

[Eräbaseline](glycemic-recovery-2a-baseline.json) sisältää kaikki 326 pyöristämätöntä
mallitulosta, lähde-/syöte-/evidenssifingerprintit ja 15 aiemman baseline-tiedoston
SHA-256:t. [Koneellinen katselmointi](glycemic-recovery-2a-review.json) sisältää
23 ainesrivin nykyiset tiedot, päätökset, vain muistissa suoritetut diagnostiikat,
326 tuloksen vertailun sekä jatkoauditoinnin käyttäjälistat.

## Lähdepäätökset

[Atkinson 2021, DOI 10.1093/ajcn/nqab233](https://doi.org/10.1093/ajcn/nqab233),
Table1: dairy35±11 (186 ruokaa) ja fruit51±11 (105 ruokaa) ovat ryhmäkeskiarvoja.
Dairy ei tarkoita yksinomaan maustamattomia maitotuotteita; lähde sisältää esimerkiksi
jäätelöä, maustettuja hapanmaitojälkiruokia ja jogurtteja. Tietueen nykyinen
"unflavoured-dairy" ei siis kuvaa taulukon otosta. Koonti ei osoita GI35:tä
pannulla kypsennetylle tuorejuustolle/kermalle, paistetun kakun smetanalle tai
kylmälle rahkakermatäytteelle. LOW-merkintä ei korvaa tätä puuttuvaa vastaavuusnäyttöä.

[Alkuperäisartikkelin Supplemental Table1, peili](https://ghwinstitute.com/wp-content/uploads/2022/10/supplementaltable1-2.pdf),
s.79, rivi1174: raaka tuore mansikka, Australia2001, GI40±7 glukoosiasteikolla,
10 tervettä osallistujaa, 25g imeytyvää HH, 925g koeannos, kahden tunnin seuranta.
S.139 alaviite5 yksilöi alkuperän Sydneyn tutkimuspalvelun julkaisemattomiksi havainnoiksi.
Tämä on ruokakohtainen mitattu ehdokas julkaistussa koonnissa, ei erillinen julkaistu
alkuperäistutkimus. Sen laatuluokitus ja mahdollinen katalogilisäys on erotettava
reseptin hyväksynnästä. Mansikkakakku jää silti estetyksi vaniljan vuoksi.

[Tuorejuuston ateriatutkimus, DOI 10.1016/S0271-5317(98)00062-1](https://doi.org/10.1016/S0271-5317(98)00062-1)
tutki 20%-rasvaisen tuorejuuston lisäämistä aamiaiseen kahdessa 12 henkilön kokeessa.
Se ei anna näihin laskelmiin tuorejuuston erillistä, glukoosivertailuun perustuvaa GI-arvoa.
Sydneyn GI Search sekä vuoden2021 molemmat lisätaulukot tarkistettiin; sopivaa
kerman/tuorejuuston/rahkan/smetanan valmistuskohtaista GI-lähdettä ei löytynyt.
Tämä on rajatun haun tulos, ei väite ettei mittausta voisi olla olemassa.

Koostumukset ja standardiannokset tarkistettiin versionhallituista
[Fineli Release20](fineli-release-20-reference.json) ja
[AFCD Release3](afcd-release-3-reference.json) -aineistoista.
Standardiannos ei ole reseptissä punnittu määrä. AFCD:n Australian-koostumusrajoitus
säilyy; mantelijauhon täysrasvainen yleinen analogia ei kata rasvatonta mantelijauhoa.

[Foodinin puhtaan erytritolin tuoteseloste](https://foodin.fi/tuote/erytritoli-luomu-200g-2/)
vahvistaa hiilihydraatti100g / polyolit100g, joten nykyisen määritelmän imeytyvä HH on0.
Resepti ei nimeä Foodin-brändiä: seloste tukee puhtaan aineen koostumusta, ei mielivaltaista
brändivalintaa eikä 12g/rkl-massaa. Massaa ei tarvitse keksiä nollakomponentille.

[Vaniljauutteen valmistajan kuvaus](https://www.oetker.fi/inspiroidu/vanilja/vanilja-tuotteet/vaniljauute)
osoittaa tuotemuotojen vaihtelua. Se ei yksilöi resepteissä käytettyä tuotetta.
AFCD F009350 on lainattu koostumus (12,6g/100g), ei vahvistus tuntemattoman uutteen
koostumuksesta tai 2g/tl-muunnoksesta. Mitään valmistajan arvoja ei yhdistetty
vieraan tuotteen tiheyteen eikä makuvastaavuutta tulkittu massamuunnokseksi.

## vhh-letut: ei palautusta

Alkuperäinen resepti: [Letut](../../reseptit/jalkiruoat/vhh-letut.md), 4 annosta.
Maitotuotteet ja manteli paistetaan taikinassa, kaikki reseptissä ilmoitettu voi lasketaan.

| Aines | Varmennettu tai nykyinen lähtö | HH g/annos | Päätös |
|---|---|---:|---|
| Munat | Fineli858,4×55g kuoreton M-muna | 0,165 | Standardiarvio; pienosuus |
| Tuorejuusto | Nykyinen Fineli11571,100g,rasva11% | 1,000 | GI35 hylätty; yksittäisraja ei täyty; tuotemuoto avoin |
| Mantelijauho | AFCD F006077,50g täysrasvainen | 0,675 | Ehdollinen koostumusanalogia; pienosuus |
| Kuohukerma | Fineli631,1dl=100g | 0,725 | Standardiarvio; GI35:n sijasta pienosuus mahdollinen |
| Erytritoli | Puhdas erytritoli | 0 | Nolla lähteistetty;12g/rkl ei varmennettu |
| Paistovoi | Fineli500,1tl=4,5g | 0,009 | Standardiarvio; pienosuus |
| Suola | Fineli30/79 molemmat0HH | 0 | Ei grammapainoa; sallittu lähteistetty nolla |

Hyväksyttävien positiivisten pienosuuksien summa on1,574g/annos, jos täysrasvaisen
mantelin vastaavuus hyväksytään. Tuorejuuston1,000g ei ole alle1g. Kaikkien positiivisten
osuuksien summa olisi2,574g, joten kaikkia ei voi jättää pois myöskään kokonaisrajan nojalla.
Finelissä on useita maustamattoman tuorejuuston rasvaversioita; resepti ei valitse niistä11%:a.
Alempaa HH-arvoa ei saa valita vain rajan alittamiseksi.

Nykyisellä mallilla pelkkä suolan korjaus tuottaisi laskennallisesti0,60375 (näyttö0,60),
mutta tulos riippuisi perusteettomista dairy-sidoksista. Diagnostiikka osoitti tämän
ja hylkäsi palautuksen; epäkelpoa lukua ei viedä laskentasyötteisiin tai julkaisuun.

## vhh-juustokakku: ei palautusta

Alkuperäinen [juustokakku](../../reseptit/jalkiruoat/vhh-juustokakku.md),10 annosta:
pohja160°C8min, täyte noin50min, jäähdytys. Sitruunamehua on1rkl, vaniljauutetta1tl.

| Aines | Lähde ja määrä | HH g/annos | Päätös |
|---|---|---:|---|
| Manteli | F006077,120g | 0,648 | Täysrasvainen yleinen match; pienosuus |
| Voi | Fineli500,50g | 0,040 | Pienosuus |
| Tuorejuusto | Nykyinen11571,400g,rasva11% | 1,600 | Tuotemuoto avoin; GI35 hylätty; ei pienosuus |
| Smetana | Fineli630,150g,rasva42% | ≤0,330 | Koostumuksellinen yläraja; polyolitnull; nykyinen628/28% väärä |
| Munat | Fineli858,3×55g | 0,0495 | Standardiarvio; pienosuus |
| Erytritoli | Puhdas,80g | 0 | Lähteistetty nolla |
| Vaniljauute | 1tl; tuote ja massamuunnos avoin | tuntematon | Vanhaa2g ja0,0252g-osuutta ei hyväksytä |
| Sitruunamehu | Fineli11557,1rkl=15g | 0,024 | Laimentamaton mehu; standardiarvio ja pienosuus |

Hyväksyttävien/ehdollisten pienosuuksien summa on enintään1,0915g ilman tuorejuustoa
ja tuntematonta vaniljaa. Smetanan0,330 on konservatiivinen yläraja, ei polyolinollasta
laskettu täsmällinen arvo. [Valion smetanakuvaus](https://www.valio.fi/artikkelit/valio-smetana/)
vahvistaa tuoteryhmän42%-rasvaisen muodon; sitä ei valittu reseptin brändiksi.

Fineli11557 esiintyy food-recordsissa kahdesti samallaID:llä. Molemmilla HH1,6g/100g,
kuitu0,1 ja polyolit0; ensimmäisen nimi on merkistörikkoinen. Fineli-reference sisältää
yhden tietueen ja RKL15g. Laskentamallin Map käyttää viimeistä, julkinen viitteenhaku
.find ensimmäistä. Duplikaatti ei tässä muuta HH:ta, mutta erillinen identiteetti- ja
esityskorjaus tarvitaan. Koko katalogia ei muuteta nollatuloksen varjolla.

## vhh-mansikkakakku: ei palautusta

Alkuperäinen [mansikkakakku](../../reseptit/jalkiruoat/vhh-mansikkakakku.md),10 annosta.
Pohja paistetaan175°C22–26min. Kerma, rahka, vanilja ja tuoreet mansikat lisätään
jäähtyneeseen pohjaan: mansikat ovat raakoja, eivät kypsennettyä hedelmätäytettä.

| Aines | Lähde ja määrä | HH g/annos | Päätös |
|---|---|---:|---|
| Munat | Fineli858,4×55g | 0,066 | Standardiarvio; pienosuus |
| Erytritoli | Puhdas,100g | 0 | Lähteistetty nolla |
| Manteli | F006077,120g | 0,648 | Täysrasvainen yleinen match; pienosuus |
| Leivinjauhe | Fineli74,1tl=5g,HH37,8/100g | ≤0,189 | Polyolitnull; yläraja, ei tarkka arvo |
| Kuohukerma | Fineli631,2dl=200g | 0,580 | GI35 hylätty; pienosuus |
| Maitorahka | Fineli622,150g | 0,450 | Maustamaton yleinen standardi; GI35 hylätty; pienosuus |
| Mansikka | F008952,250g raaka | 1,400 | Ei pienosuus; GI40 yksilöity ehdokas, GI51 ei perusteltu |
| Vaniljauute | 1tl, tarkka tuote/massa puuttuu | tuntematon | Estää palautuksen |

Fineli74:n standardi ja koostumus kuuluvat yhteen. AFCD:n4g-syötteen perustetta ei
löytynyt; sen19,8g/100g-koostumusta ei yhdistetä Finelin5g-mittaan. Vaihtoehtoisen
lähteistetyn ylärajan ja muiden pienosuuksien summa on1,933g/annos ennen vaniljaa.
Vaniljan pitäisi siis olla lähteistetysti **alle0,067g HH/annos** (alle0,670g koko
kakkuun), jotta yhteissumma olisi alle2g. Tuntematon ei ole nolla eikä sitä voi
olettaa tämän pienen marginaalin sisään. Myös kaikki tuotemuoto-oletukset pitää hyväksyä.

GI40 antaisi yksin mansikan osuudeksi0,560 verrattuna nykyisen GI51:n0,714:ään;
koonti ei kuitenkaan tuota hyväksyttyä koko kakun GK:ta. Vain muistissa ajettu
korjausskenaario jäi odotetusti nulliksi vaniljan puutteen vuoksi.

## Erillinen julkaistujen arvojen laatuhavainto

Dairy GI35:n metadata ja yleinen sidontaperuste eivät osoita nyt tutkittujen
ruokien ja valmistusten vastaavuutta. Katalogissa samaa tietuetta käyttää125
ainesriviä98 reseptissä, joista33 on laskettuja. Fruit GI51:llä on51 sidontaa45
reseptissä, joista7 laskettuja. Näiden laskettujen reseptien unioni on33.
Täydet käyttäjälistat ja nykyiset GK-luvut ovat katselmointi-JSONissa.

Tämä on kiireellinen lähdekohtaisen vaikutusauditoinnin tarve, ei päätös siitä,
että kaikki33 arvoa poistuisivat: jokaisen aineksen muoto, mahdollinen suora GI,
määrä ja yhteistoleranssi pitää tarkistaa erikseen. Esimerkiksi julkaistu
munakasrulla-pinaatti-tuorejuustolla käyttää samaa tuorejuustoanalogiaa; LOW ei
itsessään osoita vastaavuutta. Mainin85 tuloksen ennallaan säilyminen on tekninen
regressiotulos, ei näiden lähteiden uusi tieteellinen hyväksyntä.

## Regressiot, testit ja säilytys

Kaikki326 täyttä mallitulosta ovat täsmälleen samoja kuin eräbaselinessa:
85 laskettua ennallaan,241 edelleen keskeneräistä,0 uutta,0 poistunutta,
0 pyöristettyä tai pyöristämätöntä muutosta ja0 luokkamuutosta. Nettokattavuus+0.
15 historiallista baselinea ja 2B6E:n tutkimusraportit säilyivät tavutasolla.
Kaikki aiemmat REFERENCE_ONLY-suojaukset säilyivät; laskentatiedostoja ei muokattu.

Oikean työpuun site-hakemistossa suoritettu:

- `npm run build`: PASS, sisältää content:sync, strict nutrition audit,
  GK-auditoinnin, TypeScriptin, Viten ja691 esirenderöityä reittiä.
- `npm run audit:glycemic-coverage`: PASS85/241/45.
- `npm run test:glycemic`:85/85 PASS.
- `npm test`:155/155 PASS.
- `npm run test:select-ci`:12/12 PASS.
- `npm run test:static`:24/24 PASS.
- Vain muistissa suoritetut lähdeskenaarioiden assertit: PASS.

Auditointien kirjoituskohteet tarkistettiin. Build kirjoitti vain tämän työpuun
site-generaatteihin ja tmp/nutrition-hakemistoon. Kattavuusauditin oletuksena
versionhallittuihin raportteihin kirjoittavat kaksi tulosta ohjattiin scratchiin;
vanhoja inventaarioita tai baselineja ei ylikirjoitettu. Strict audit on laadun
portti, ei väite kaikkien reseptien ravintotietojen täydellisyydestä.
Viten ennestään tuttu yli500kB bundle-varoitus jäi varoitukseksi.

Markdownlint: PASS, 838 tiedostoa ja 0 virhettä. `git diff --check`: PASS.
326 täyden tuloksen vertailu, 23 katselmointiriviä ja 15 historiallista
baseline-tiivistettä tarkistettiin myös erillisillä asserteilla: PASS.
Viimeisen tutkimuscommitin GitHub Actions ajetaan erikseen `deploy=false`;
CI-linkki ja lopullinen HEAD raportoidaan loppuvastauksessa. Uutta Draft-PR:ää ei avata,
koska yhtään laskelmaa ei hyväksytty. Tutkimus säilytetään omassa Git-haarassa.

## Kolmen jäljellä olevan ehdokkaan prioriteetti

1. `vhh-korvapuustit`: ensin kanelin1rkl-massa/koostumus ja mozzarella-raasteen
   koostumusvastaavuus; myös tuorejuuston ja mozzarellan GI35-sidokset arvioitava
   uudelleen. Mantelin0,810g ja kaikkien pienosuuksien yhteissumma tarkistettava.
   Psylliumin ja erytritolin nollakoostumus erotettava varmennettamattomista rkl-massoista.
2. `keto-mutakakku`: suklaan tuote ja polyolit sekä vaniljan massa ensin.
   AFCD "no added sugar" ei automaattisesti vastaa nimeämätöntä sokeritonta suklaata.
   Kaakaon2rkl olisi Fineli20:n standardilla12g, ei nykyinen10g.
   Suolan ratkaisu yksin ei oikeuta palautusta.
3. `keto-suklaakeksit`: suklaan ja vaniljan tuote/massa, leivinjauheen oikea
   standardi ja yhteissumma. Mantelin0,972g on lähellä yksittäisrajaa.

Julkaistujen dairy-/fruit-sidontojen laatuauditointi on näitä uusia palautuksia
kiireellisempi. AJO2.0B:tä tai uutta laatukorjauserää ei aloitettu automaattisesti.

**AJO 2.0A – NO CALCULATIONS APPROVED**
