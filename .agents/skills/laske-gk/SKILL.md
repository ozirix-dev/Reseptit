---
name: laske-gk
description: "Recipavon GI/GK-reseptien lähteistetty ja keskeytyksestä jatkettava eräajo. Käytä, kun käyttäjä kirjoittaa laskeGK N tai $laske-gk N (N = 1–30), pyytää erän jatkoa tai haluaa käytännöllisen annoskohtaisen GK- ja hiilihydraattikatselmoinnin."
---

# laskeGK – GI/GK-erätyö

Tämä on **Codexin ohjeistettu työnkulku**, ei automaattinen julkaisu-, ajastus- tai laskentakomento. Käytä repon olemassa olevia GK-/ravintolaskentatyökaluja ja hyväksyntäportteja. Tässä skillissä ei korvata niitä uudella laskentamoottorilla.

## Käynnistys ja parametri

- Käyttäjän **`laskeGK 10`** on repon AGENTS.md:ssä määritelty kutsu tähän työnkulkuun. Codexissa eksplisiittinen skill-kutsu on **`$laske-gk 10`**.
- Hyväksy kokonaisluku **1–30**; parametrin puuttuessa käytä oletusta **10** ja kerro se. Virheellinen arvo (0, yli 30, murtoluku, epäselvä arvo) ei käynnistä kirjoittavaa ajoa.
- Luku tarkoittaa **enintään N erillistä alkuperäistä, julkista resepti-identiteettiä käsittelyjonoon yhdessä ajossa**. Se ei lupaa N numeerista GK-tulosta, N julkaistua reseptiä, N PR:ää eikä N CI-ajoa. Yksi resepti lasketaan vain kerran, vaikka sillä olisi FI/EN/SV/TH ja erillisversioita.
- `laskeGK jatka` jatkaa saman omistajan kesken jäänyttä erää, jos se voidaan tunnistaa luotettavasti. Älä aloita uutta erää vanhan päälle.

## Ennen kuin muokkaat mitään

1. Tarkista `git remote get-url origin`: kohde on **ozirix-dev/Reseptit**. Lue voimassa olevat AGENTS.md-ohjeet, työaseman Master-AGENTS kun saatavilla, ja `docs/rinnakkaiset-codex-ajot.md`.
2. Tarkista uusin `main`, työpuun tila, aktiiviset PR:t ja juuri tämän ajon nimetty PR-/worktree-omistaja. Tarkista myös avoin GI/GK-työ (erityisesti #706, jos se on vielä kesken). **Älä kirjoita toisen Codex-istunnon omistamaan haaraan tai työpuuhun.** Käytä omaa haaraa ja luovuta tulokset nimetylle integraatio-omistajalle; älä tee rinnakkaista samoihin tiedostoihin kirjoittavaa toteutusta.
3. Lue kerran nykyisen laskentamallin ja julkisen esityksen sopimukset sekä relevantit lähderekisterit. Aiempi ReportHubin GI/GK-handoff on tausta-aineisto; nykyinen repo ja commit ovat totuus. Älä toista jo tehtyä inventaariota jokaiselle uudelle erälle.
4. Varmista hyväksytty tehtävä- ja julkaisuvaltuus. Tämä käynnistys antaa luvan **lähdekatselmointiin ja hyväksytyn työn rajattuun valmisteluun**, ei automaattisesti mergeen, GK-historian muuttamiseen tai Cloudflare-tuotantojulkaisuun.

## Valitse erä nykyisestä tilasta

- Tarkista avoimet korjausjonot ja muiden ajojen varaukset. Anna tunnetut P0/P1-reseptit jonolle muodossa `--priority=resepti-id` ja muiden aktiivisesti käsittelemät reseptit muodossa `--exclude=resepti-id`.
- Aja `site/`-hakemistossa `node --import tsx scripts/gk-research-queue.ts 10 --catalog` käyttäen pyydettyä eräkokoa ja tarkistettuja tunnisteita. Puuttuvan tai vanhentuneen projektion luo `node --import tsx scripts/recipe-state-cli.ts` puhtaasta nykyisestä commitista. Aja sen jälkeen valinta uudelleen.
- Käytä vain `next`-listan tapauksia uuden lähdehaun aloittamiseen. Jono priorisoi reseptit, joilta koko annoksen hiilihydraattiarvio puuttuu, ja jättää entiset hyväksynnät, samasta näytöstä tehdyt päätökset sekä käsintarkistukset pois valinnasta. Noudata [menetelmän jonosopimusta](../../../docs/nutrition/gk-original-recipe-method.md#pysyvä-tutkimuspäätös-ja-jonon-tarkistus).
- Ryhmittele saman `foodKey + preparationKey + product`-ongelman reseptit samaan tutkittavaan erään. Yksi tutkimus/lähdehavainto voi tukea monta reseptiä, mutta reseptikohtainen soveltuvuus varmistetaan erikseen.
- Valitse enintään N ID:tä; erä voi jäädä N:ää pienemmäksi, jos kelpoisia tapauksia ei ole. **Älä täytä erää tekaistulla GI:llä tai riskitapauksilla päästäksesi lukuun N.** Kirjaa ennen työn alkua valitut tunnukset, syy, lähtö-SHA ja työn omistaja.

## Käsittele resepti – paras perusteltu käyttäjätieto

Kunkin reseptin tulos on jokin näistä, mieluiten tässä etenemisjärjestyksessä:

1. Hyväksytty laskennallinen GK-arvo tai nimetty vaihteluväli (ei mitatun aterian vasteeksi nimetty).
2. Lähteistetty sanallinen GK-luokka juuri kuvatulle annokselle, kun numero ei ole perusteltu.
3. Koko **syötävän annoksen** perusteltu hiilihydraattimäärä, vaikka muiden makrojen tai GK:n arvio olisi edelleen keskeneräinen.
4. Nimetyn pääasiallisen hiilihydraattilähteen annosmäärä, pakkausarvo tai toimiva ruokakohtainen huomio oikealla rajauksella.
5. Perusteltu puuttuva tieto ja sen täsmällinen ratkaisemisen edellytys (HOLD), jos edelliset eivät onnistu.

Annos on aina erotettava valmistuserästä; käyttäjälle kerrotaan lisukkeet, vaihtoehdot ja tieto laskennan soveltamisalasta. Muodon FI/EN/SV/TH merkitys säilytetään. Tieto auttaa diabetesta sairastavaa valitsemaan annoksia, mutta **GK ei ole insuliinilaskuri eikä henkilökohtainen glukoosivasteen ennuste**.

Älä pakota puuttuvaa GI:tä nollaksi tai yleiseksi 50/100-oletukseksi, laske varianttia alkuperäisen kattavuuteen, sekoita kuitu-/polyolimääritelmiä tai muuta reseptiä vain paremman GK:n vuoksi. Älä julkaise osasummaa kokonaisen annoksen hiilihydraattimääränä. Nykyiset hyväksytyt lukuarvot ja historiallinen evidenssi säilyvät, ellei erillinen dokumentoitu korjaus oikeuta muutosta.

Jokaisesta lähteestä talleta linkki/alkuperäinen havainto, soveltuvuus valmistustapaan ja annokseen, rajoite sekä version/syötteen tarvittavat sidokset. Jo todettua **ei ratkaistavissa nykyisellä näytöllä** -tapausta ei tutkita uudestaan ilman uutta lähdettä, tuotetietoa tai olennaista syötemuutosta.

## Hallittu toteutus ja CI

- **Valmistele saman ongelmaluokan reseptit isompana eränä**. Tee paikallisia committeja sopiviin, itsenäisesti varmennettaviin välietappeihin, mutta älä työnnä jokaista pientä copy-/lähdemuutosta heti GitHubiin.
- Käytä alkuun kohdennettuja paikallisia GK-, ravinto-, lähde-/SHA-, käännös- ja julkisen näkymän testejä. Tarkista historia-/hyväksyntäsidokset *ennen* pushia. Aja lopullinen vaadittu täysi CI tarkalle PR-HEADille; tarvittaessa tarkista myös selaimessa annos- ja eräsäätimien ero.
- Ryhmittele yhdistettävät muutokset riskin ja riippuvuuksien mukaan. Esimerkiksi 1–30 reseptin käsittely voi jakautua useaan hallittuun muutos-/CI-erään, jos turvallisuus vaatii. Älä aseta jäykkää 6–8 CI-ajon kiintiötä.
- Älä aja samaan generoituun työpuuhun rinnakkaisia kirjoittavia build/test-komentoja. Tutki muita riippumattomia lähderyhmiä odottaessasi CI:tä, mutta säilytä työpuu- ja haaraomistajuus.
- Pidä valmiin julkaisuehdokkaan scope suljettuna. Uudet tutkimuserät eivät kuulu jo Ready-tilassa olevaan PR:ään ilman sovittua integraatiota. Repo Guardin ja julkaisun erilliset päätösrajat säilyvät.

## Keskeytyminen ja jatkaminen

- Kirjaa ajon alkuun tai omaan `tmp/gk-runs/`-väliaikaismuistioon: `laskeGK N`, lähtö-SHA, oma haara/worktree, valitut recipe_id:t, viimeinen hyväksytysti käsitelty ID, HOLD-tilat, tehdyt commitit, testit ja seuraava vaihe. `tmp/` on **vain paikallinen työmuisti**, ei pysyvä tai versionhallittu todiste.
- **Pysyvä jatkopiste on oman haaran Git-commit + repon lähde-/katselmointitietueet + avoin PR/luovutus.** Commitaa koherentit, tarkistetut välitulokset sopiviin kohtiin; älä ilmoita tallentamattomia muutoksia pysyviksi.
- Keskeytyksen jälkeen tarkista `git status`, mahdolliset uncommitted/ignored-muutokset, oma haara, etä-HEAD, avoin PR ja viimeinen onnistunut testi. Säilytä epävarmat paikalliset muutokset; **älä tee reset/clean/force-push/työpuun poistoa oletusarvoisesti**.
- Syötä jatkettaessa oman erän jäljellä olevat tunnisteet samalle jonokomennolle ilman `--catalog`-valintaa. Käytä vain tämän erän `next`-listaa. Varmenna lähtö-SHA ja omistaja Gitistä ja erän luovutuksesta ennen työn jatkamista. Jos omistaja tai jäljellä olevat tunnisteet jäävät epäselviksi, jää lukutilaan ja kirjaa este.
- Jos edellisen ajon haara kuuluu vielä toiselle kirjoittajalle, tee vain lukutarkistus ja luovutus. Työn omistajuuden siirto sovitaan erikseen.

## Valmis erä ja raportointi

- Raportoi **valitut / käsitellyt / hyödyllisen tiedon saaneet / hyväksytyt numeeriset / sanalliset / hiilihydraatti- / ainesosahuomio- / HOLD** sekä reseptikohtaiset syyt. Älä kutsu pelkkää puutemerkintää numeeriseksi tai sanalliseksi kattavuudeksi.
- Vertaile lähtö- ja lopputilaa saman määritelmän nimittäjällä; käytä viimeistä varmistettua SHA:ta, relevantteja testejä ja CI-linkkejä. Erottele PR-CI, main-CI ja Cloudflare-tuotanto.
- Päivitä **yhtä olemassa olevaa ReportHubin GI/GK-raporttia työvaiheen lopussa**, ei jokaisen commitin jälkeen; pidä lyhyt välitieto tarvittaessa omassa työmuistissa.
- Seuraa ajon kalenteriaikaa, PR-CI-kierrosten määrää ja epäonnistumisen syytä sekä hyödyllisten tulosten määrää. Älä sekoita CI-aikaa aktiiviseen kehitysaikaan tai laske rinnakkaisia vaiheita yhteen.
- Lopeta yhden kutsun jälkeen, kun valittu erä on käsitelty tai aidosti estynyt. Jos työ ei mahdu kerralla, tallenna turvallinen jatkopiste ja raportoi kesken olevat ID:t. Seuraavan erän voi käynnistää `laskeGK N`.
- **Ei automaattista mergeä eikä tuotantojulkaisua** tämän skillin perusteella. Erilliset hyväksyntä- ja tuotantovarmennusrajat pysyvät voimassa.

## Päällekkäisen työn välttäminen

Tämä skill täydentää olemassa olevia ohjeita, erityisesti:
- `docs/rinnakkaiset-codex-ajot.md` – yksi kirjoittaja haaraa kohti ja eräkokojen päätös;
- `docs/nutrition/gk-original-recipe-method.md` – alkuperäinen resepti ensin;
- `docs/nutrition/glycemic-portion-policy.md` – jos nykyisessä haarassa käytössä, annos- ja arviointisemantiikka;
- ReportHubin `2026-11-18-recipavo-gi-gk-5-5-toimeksianto.md` – laatutavoitteen asiasisältö.

Älä monista näiden dokumenttien sisältöä tai toteuta jo olemassa olevaa toimintoa uudelleen.
