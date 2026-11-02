# Seitsemän A-version seuraavan julkaisuerän suunnitelma

## Ajon rajaus

- Rooli: Codex Julkaisu 3, itsenäinen julkaisuvalvoja ja jatkoerän suunnittelija.
- Tarkoitettu repo: `ozirix-dev/Reseptit`.
- Oma worktree: `D:/Projects/tmp/reseptit-gk80-release3-verification-20261102`.
- Oma haara: `codex/gk80-next-seven-plan-20261102`.
- Lähtö-main ja PR #183:n merge: `92dc6dbe7b27e145d6938026c73b6823f2e2108f`.
- Kirjoitusrajaus: tämä suunnitelma. Lähdepaketteja, reseptejä, hyväksyntöjä tai tuotantoimporttia ei muuteta.
- PR #183:n lähdehaaran kirjoitusvastuuta ei siirretä. Jatkoerän toteuttaja käyttää omaa mainista aloitettua haaraa.
- Luovutus: seuraavan rajatun erän nimetty Codex Julkaisu -omistaja.

Suunnitelma valmistellaan PR #183:n tuotantovarmennuksen jälkeen. Sen lähtötaso
on vähintään yksi numeerinen täsmällinen versio **172/326 (52,76 %)** ja
alkuperäisohjeiden erillinen kattavuus **156/326 (47,85 %)**.
[PR #183](https://github.com/ozirix-dev/Reseptit/pull/183) ja sen
[mainin automaattinen CI/Pages-ajo](https://github.com/ozirix-dev/Reseptit/actions/runs/41504708914)
omistavat julkaisutiedon. Tämä suunnitelma ei julkaise seitsemää versiota.

## Täsmällinen sisältö

Kaikki seitsemän ovat A-versioita. Syötehashit tarkistettiin tapausobjektien
JSON-sisällöstä ja hyväksyntäkirjauksista. Kaikkien seitsemän paketteihin
sidotut alkuperäiset reseptitiedostot vastaavat lähtö-mainia; käännökset
varmennettiin niiltä kieliltä, jotka pakettiin on sidottu.

| Resepti | Hyväksytty syötteen SHA-256 |
| --- | --- |
| `vietnamilainen-kahvijogurtti-banaanilla` | `75b3125da4abf6072188d26656629bfacd4d04d83fe169109c3837da1aadc60a` |
| `japanilainen-dashimaki-tamago-aamiaislautasella` | `a9f8daa4b86c5b9326eed7a0f35577ed80fcb5e306d9d106276a9f8a84ab3aa8` |
| `japanilainen-hojicha-jogurtti-persimonilla` | `2f0e19fde34c89031e3e4a0a11b340b86a49b3a07a9c536d3504b797abed7413` |
| `japanilainen-natto-riisikulho` | `a23b798d343f87c31c41b49cd26eda3f66a1d0c48307ac47b50ee19830881c4a` |
| `pad-kee-mao-vhh-konjac` | `0c692cf887c1a70c12d537c3685a25284f004653e752f7e3995197129a50370e` |
| `chettinad-kana` | `ba7aeeede3d2222a38cf82d7ff2f571c64933269f439b52e4b9e7a4b64aec85e` |
| `pad-see-ew-vhh-konjac` | `aff3debfb7b5f7bf6f1957b68de41b1bda051e5eeb0d64a7e68fbeb92c235efc` |

Kuuden version luovutus on haarassa `codex/gk80-six-a-isolated`, commitissa
`80f4360435b978d1cfa81088df1414430a88c222`.
[Hyväksyntäkirjaus](https://github.com/ozirix-dev/Reseptit/blob/80f4360435b978d1cfa81088df1414430a88c222/docs/nutrition/gk80-operation149/approved-six-owner-approval.json)
sitoo 20 lähdetiedostoa; kaikki LF-normalisoidut hashit täsmäävät.
Päätös koskee myös tarkasti rajattuja MEXT2023 CHOAVL mass -natto04046- ja
IFCT2017 Table6 G010 -lähdesovelluksia. Uusi B-poisjättöprofiili ei kuulu erään.

Pad see ew -luovutus on haarassa `codex/afcd-polyol-03-gk80-handoff`, commitissa
`9bb90548ee0cb7d820c0a1d4f57b9d5082b8da24`.
[Erillinen hyväksyntä](https://github.com/ozirix-dev/Reseptit/blob/9bb90548ee0cb7d820c0a1d4f57b9d5082b8da24/docs/research/afcd-polyol-03/pad-see-ew-approval.json)
sitoo viisi katselmoitua pakettitiedostoa; niiden hashit täsmäävät.
Resepti käyttää 600 g valutettuja KoRo-valmisnuudeleita ja 15 g nimettyä
Yutaka-tummaa soijakastiketta. Laskettu osuus 0,73 ja pois jätetty CHO
1,5733 g/annos eivät osoita koko ruoan GK:n olevan alle yhden.
Tuotantonäytön tulee käyttää nykyistä alle yhden lasketun osuuden tekstiä,
poisjätön ylöspäin pyöristettyä enintään 1,6 g:n merkintää ja vaikutusrajausta.

## Lähde- ja integraatioedellytykset

Pad see ew -paketin kuusi tuotannossa jo olevaa yhteistä syötettä vastaavat
lähtö-mainia: Fineli Rel20, AFCD Rel3, food-records, GI-rekisteri sekä ravinto-
ja GK-laskentamallit. Viisi tutkimuspaikallista manifestiviitettä puuttuu
mainista; ne on tuotava täsmällisestä luovutuksesta tai säilytettävä erillisen
jäädytetyn tutkimustodisteen viitteinä. Kokonaista tutkimushaaraa ei yhdistetä
lähdepaketin oikaisuna. Valmistaja-arvojen nimelliset ylärajat eivät muutu
laboratoriovarmennetuiksi eräkohtaisiksi rajoiksi.

1. Aloita toteutus silloisesta varmennetusta mainista. Tarkista molempien
   luovutusten commitit, seitsemän syötehashia ja reseptien nykyiset hashit.
   Säilytä PR #183:n alkuperäisen 16 version lähde- ja hyväksyntäpaketti.
2. Tuo vain seitsemän version paketti ja sen tarpeelliset lähderiippuvuudet.
   Kuuden A-version vanhassa haarassa on myös aiempi 22 version adapteri ja
   ennen PR #184:ää syntyneitä ohjemuutoksia. Älä yhdistä haaraa kokonaisena
   tai korvaa nykyisiä adapteri-, testi-, AGENTS- tai rinnakkaisajo-ohjeita sillä.
3. Muodosta seitsemälle versiolle erillinen hyväksyntään sidottu adapteri ja
   koonti. Älä kasvata alkuperäisen `owner-approval.json`:n 16 version scopea
   tai muuta sen kuutta lähdehashia hiljaisesti. Kytke erät yhteiseen
   versiokattavuuteen vasta seitsemän version validoinnin jälkeen.
4. Sovita GK-only-sopimus, omat määrät, valmistus, LOW-luottamus, lähteet,
   annosskaalaus ja makrojen erillisyys FI/EN/SV/TH-esityksiin. Julkaise vain
   olemassa oleville reseptikielireiteille; tämä erä ei lisää uusia käännösreittejä.
5. Tarkista rajatusti seitsemän syötettä, lähdesidonnat, riippumaton aritmetiikka,
   alkuperäiset 326 tulosta ja jo julkaistut 16 versiota. Varmista koonnin
   yksilöllisyys ja ehdokaskattavuus **179/326 (54,91 %)**, puuttuvia 147.
   Alkuperäisohjeiden kattavuus pysyy omana 156/326-mittarinaan, ellei erillinen
   lähdekorjaus muuta sen perustaa. Normaali täsmällisen HEADin CI ja
   kohdennettu selainvarmennus kuuluvat myöhempään julkaisuun.
6. Hanki seitsemän version myöhempää Readyä, mergeä ja deployta koskeva
   erillinen julkaisuvaltuutus. Nykyinen tehtävä valtuutti vain PR #183:n 16
   version tuotantojulkaisun sekä tämän suunnitelman valmistelun.

## PR #182:n riippuvuus

[PR #182](https://github.com/ozirix-dev/Reseptit/pull/182) on erillinen Draft,
head `924a827b515f4d4e27d70389837e22f904d38c1f`. Se ei ole näiden seitsemän
version pakollinen edeltäjä nykyisellä lähdepohjalla eikä kuulu tämän erän
julkaisuvaltuutukseen.

Sekä julkaistun GK149-paketin erytritolisidonta että pad see ew -lähdepaketti
sitoutuvat koko `docs/nutrition/food-records.json`:n hashiin
`2f8ff76b97848294c28195bb92c6d202e9754168ddb169d30ee5e8610d2c2b9b`.
PR #182 muuttaisi sen hashiksi
`361a945c3d6702ec64529dff267f8cd849ba0a8a14fd42ee6798d189a619dcd3`,
vaikka Foodin-erytritolitietue säilyy samana. Nykyinen koko tiedoston sidonta
pysäyttäisi validoinnin. Tätä ei ohiteta, eikä hyväksyttyjä hasheja vaihdeta
pelkästään testin läpäisemiseksi.

Jos #182 etenee ensin, sen omistaja ja jatkoerän omistaja ratkaisevat yhdessä
rajatun lähdesidonnan ja tarvittavan hyväksyntäpäivityksen. Lisäksi
persikkakulhon ja pellavapuuron kahden perustellun tulosmuutoksen regressiopohja
päivitetään erikseen. Muut 324 tulosta ja nykyiset hyväksytyt versiot on
säilytettävä; yleistä regressiopoikkeusta ei tehdä. Main, #182 ja molemmat
luovutukset tarkistetaan uudelleen toteutuksen alussa.

## Rajauksen ulkopuoli

Tämä suunnitelma ei aktivoi kuutta A-versiota, pad see ew -versiota tai muita
tutkimusehdotuksia. Se ei muuta alkuperäisiä reseptejä, makroja tai julkaistun
16 version hyväksyntää. Se ei avaa uusia tutkimusajoja eikä anna lupaa muiden
agenttien haarojen muokkaamiseen. Myöhempi 179/326 on tavoite seitsemän version
erilliselle hyväksytylle julkaisulle, ei tämän suunnitelman tuotantotulos.
