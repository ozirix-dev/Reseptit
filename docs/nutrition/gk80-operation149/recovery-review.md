# Lähdepalautus: viisi erillistä versiota omistajan katselmointiin

**Ei omistajahyväksyntää, julkista aktivointia, Readyä, mergeä tai deployta.** Hyväksytty16 version integraatio ja sen172/326-ehdokaskattavuus säilyvät erillään. Tuotantolähtö on156/326. Tämä tiedosto ei valtuuta uutta menetelmä- tai sisältösovellusta.

## Uusi erä

| Täsmällinen versio | Malli | GK/annos | Olennaisin katselmoitava rajaus |
| --- | --- | --- | --- |
| Rahka-marjakerroskulho | A | ≈2,34 | Tuore mansikka ja pohjoisamerikkalainen wild blueberry;2g punnittua sitruunankuorta;4g erytritolia. Ei kuoren vaihtoa mehuksi. Hasselpähkinän ja kuoren positiivinen GI:tön CHO yhteensä0,67g/annos pois A-säännöllä. |
| Hojicha-jogurtti persimonilla | B | ≈8,42 | Vain jo alkuperäisessä ohjeessa sallittu haudukeversio.2g lehtiä+50g vettä; lehdet siivilöidään ja punnitaan40g jäähtynyttä hauduketta. Tavallinen vihreän teen hauduke on paahdetun teen koostumusproxy, ei jauhettujen lehtien koostumus. |
| Pad kee mao konjac-fettuccinella | A | ≈1,80 |600g valutettua KoRo-fettuccinea vedessä. Valmistajan ilmoittama CHO<0,1g/100g käsitellään nimellisenä0,1-kattona, ei nollana tai laboratoriotakuuna kaikille erille. Osterikastikkeen kanssa positiivista GI:töntä CHO:ta jätetään pois0,9375g/annos. |
| Besan-chilla, kokonaisen kikherneen versio | B | ≈9,47 | Kokonainen kuorimaton Cicer arietinum jauhetaan; ei kaupallista kuorittua besania.100g jauhoa,222,2g vettä,16,7g öljyä; ohut pannulettu, ei fermentointia.100g tomaatti ja70g sipuli muodostavat chutneyn;6g korianteria. |
| Pinaatti-paneer-chilla, kokonaisen kikherneen versio | B | ≈8,92 | Sama pannulettupohja;50g pinaattia,100g paneeria,2g juustokuminaa. Arvio ei sisällä alkuperäisen tarjoiluehdotuksen määräämätöntä korianterichutneya tai sitruunalohkoa. Poisrajaus ja jauhoversion muutos vaativat erillisen sisältöpäätöksen. |

Kaikki ovat LOW-luottamuksen ainesosamalleja, eivät mitattuja valmiin ruoan vasteita. Yksikään ei peri alkuperäisen reseptin makropakettia. Nykyisiä reseptejä tai niiden käännöksiä ei muuteta. `recovery-cases.json` sitoo nykyisen FI-version ja kaikki olemassa olevat kieliversiot hasheihin; ehdotuksen omat punnitut syötteet sidotaan erikseen. Julkaisuintegraation FI/EN/SV/TH-esitys ja makrojen yhteensopivuusportti jäävät tämän uuden erän hyväksynnän jälkeiseen vaiheeseen.

## Lähderatkaisut ja laatu

- KoRon [valmistajan tuotesivu](https://www.koro.com/fi/luomu-konjac-fettuccine-vedessae-1-kg) erottaa vedessä myytävän valutetun tuotteen kuivatuista konjac-nuudeleista. Tässä käytetty alle0,1g/100g on valmistajan ilmoitus, ei etiketin0g:sta keksitty täydellinen nolla tai virallisen valvontatoleranssin fysikaalinen raja. AFCD:n kaupallisen kala- ja soijakastikkeen natiivikentät ovat nimetyt koostumusproxyt; Squid-brändin polyoleja ei väitetä varmennetuiksi.
- [Atkinson ym.2021](https://doi.org/10.1093/ajcn/nqab233), Table1/1092 s.74: wild blueberry53. Table1/1163 s.78: persimon61. Mansikka40 on jo hyväksytyssä lähdepaketissa. Bread-viiteateria ei tarkoita, että taulukon Glucose100-luku pitäisi muuntaa uudestaan. Lajike-, maa- ja koostumusanalogiat jäävät näkyviin; SEM ei ole reseptin vaihteluväli.
- [Batra ym.1994](https://apjcn.nhri.org.tw/server/APJCN/3/4/151.pdf), s.151–152: jauhetusta kokonaisesta Cicer arietinumista tehty fermentoimaton ohut pannukakku42; ei mungpapua, kuorittua besania, uunifarinataa tai falafelia. Perussuhde90g jauhoa:200ml vettä:15g rasvaa on sovitettu punnittavaan versioon. Lähde ei määritä rasvan lajia tarkasti; valittu neutraali öljy ja täytteet ovat B-analogian epävarmuuksia. Tutkimus on vanha,15 nuorta naista, neljä verinäyteaikaa ja yksi glukoosiviite. Testiannoksen laskennallinen CHO54,8g poikkeaa50g glukoosiviitteestä. Alkuperäisen CHO-määrityksen ei väitetä olevan sama kuin nykyinen ilman kuitua ja polyoleja oleva AFCD-kenttä; tämä heikentää vertailun varmuutta ja on lähdesovelluspäätöksen osa. Malli käyttää raportoitua42:ta vertailulukuna ja kertoo rajoitteet; nykyisen täytetyn aterian GI:tä ei väitetä mitatuksi.
- Hojichassa käytetään AFCD:n makeuttamattoman vihreän teen haudukkeen natiivia saatavaaCHO:ta. Natiivin nimellinen0 ei todista kokonaispolyoleja nolliksi tai haudukkeen koostumusta muuttumattomaksi kaikissa haudutuksissa. Jauhetut lehdet jäävät tämän version ulkopuolelle. Seesamin ja juustokuminan pienissä B-osuuksissa käytetään jo ehdotettua rajattua trace50-koodausta; sen herkkyys ei ole biologinen vaihteluväli.

Kuvatarkistus tehtiin Table1:n sivuille74/78/79 ja alkuperäisen Batra-PDF:n sivuille151–152. `recovery-observations.json` sisältää valitut faktat ja PDF-hashit; historiallisia P0-oletuksia ei kopioida AJO10–13:n lähdepaketeista.

## Estyneet ja hyväksynnän rajat

Pad see ew ei peri tavallisen soijakastikkeen koostumusta tummalle kastikkeelle. [LKK Premium Dark](https://shopuk.lkk.com/products/premium-dark-soy-sauce-150ml) ilmoittaa31g hiilihydraattia/100g;15g kastikkeen nimellinen kokonais-CHO on1,1625g/annos. SaatavaaCHO:ta tai puuttuvaa GI:tä ei johdeta oletetulla P0:lla eikä kastiketta alenneta low50-luokkaan. Hunaja–Dijon-kanan kuumennetun hunajasovelluksen ja Dijon- sekä mausteosuuksien menetelmäyhteensopivuutta ei kierretä. Farinata ei saa Cheela-lukua automaattisesti.

Kaksi kokonaiskikherneversiota tuodaan nimenomaan omistajan reseptiversiopäätökseen: kaupallista besania ei korvata julkaistussa ohjeessa hiljaisesti. Pinaatti-paneer-version tarjoilurajaus vaatii myös päätöksen. Koko kuuden uuden ehdotuksen erä (nämä5 sekä aiempi kahvijogurtti≈10,92) voidaan katselmoida yhdessä; mitään näistä kuudesta ei aktivoida aiemman16 version hyväksynnällä.

## Toistettavuus ja kattavuus

`cd site` ja `npm run pilot:gk149-recovery` tuottavat viiden ehdotuksen laskentatulokset vain stdoutiin. `python docs/nutrition/gk80-operation149/verify_recovery.py` laskee samat tulokset riippumattomasti Decimalilla ilman kirjoituksia. Paketti ei kuulu sivuston importtiketjuun. Viisi kohdennettua testiä tarkistaa natiivikentät, positiiviset poisjätöt, väärän jauho-/tuotemuodon eston, GI-asteikon ja hyväksytyn16 version muuttumattoman julkisen rajauksen. TypeScript läpäisi. Vanhan pilotti-/integraatioportin regressiot mukaan lukien23 kohdennettua testiä läpäisi; sivuston buildia tai selaintarkistusta ei toisteta muuttumattomalle UI:lle. Normaali PR-CI tarkistetaan täsmälliselle uudelle HEADille ilman manuaalista uusinta-ajoa.

Numeerisia ehdotuksia on nyt yhteensä22 (16 integroitua hyväksyttyä +6 hyväksymätöntä).30:n tavoite ei vielä täyty:8 puuttuu. Kaikkien kuuden erillinen hyväksyntä ja myöhempi integraatio voisi nostaa ehdokkaan178/326:een (54,60%); tämä ei ole nykyinen integraatio- tai tuotantokattavuus.80% vaatii261 tulosta;178:n jälkeenkin puuttuisi83.
