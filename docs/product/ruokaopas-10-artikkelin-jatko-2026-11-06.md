# Ruokaopas V2 – 10 artikkelin jatkoerä (6.11.2026)

## Perusta
- PR #309 on yhdistetty ja alkuperäiset kaksi juttua säilytetään URL-osoitteineen.
- Omistaja ilmoitti 6.11.2026 katselmoinnin tehdyksi ja pyysi jatkamaan aiemman sisältösuunnitelman mukaan.
- Tämä muutos lisää **10 suomenkielistä artikkelia** ja **10 erillistä alkuperäistä 16:9-SVG-kuvitusta**. Kuvitus ei ole ruokavalokuva eikä koepaistotulos.
- Uudet artikkelit pidetään ensin erillisessä PR:ssä; tekniset portit läpäistyään ne voidaan julkaista.
- Ei muuta reseptien sisältöä, ravinto- tai GK-arvoja, hero-aluetta, käännöksiä, tilejä tai maksullisuutta.

## Artikkelit
| Aihe | Polku | Huomio |
| --- | --- | --- |
| Hiivataikina ei kohoa | /ruokaopas/hiivataikina-ei-kohoa/ | Eri aihe kuin briossin 5 vaihetta |
| Pad thain ainekset | /ruokaopas/pad-thai-ainesosat/ | Thai SELECT + Hot Thai Kitchen |
| Riisilajikkeiden erot | /ruokaopas/riisin-keitto-eri-lajikkeet/ | Myös turvallinen jäähdyttäminen |
| Annoskoon mittaaminen | /ruokaopas/annoskoon-mittaaminen/ | Raaka vs. kypsä, ei GI-perusjutun toisto |
| Laskurien tuloserot | /ruokaopas/ravintoarvolaskurit-eri-tulokset/ | Lähteet ja mittaustilat |
| Airfryer vs. uuni | /ruokaopas/airfryer-vai-uuni/ | Ruoan turvallinen kypsennys |
| Keto ja VHH | /ruokaopas/keto-vhh-ero/ | Ei yksilöllisiä hoitoväitteitä |
| Pizzapohjat | /ruokaopas/pizzapohjien-vertailu/ | Ei väitetty koepaistetuiksi |
| Thaiainesosat Suomessa | /ruokaopas/thaimaalaiset-raaka-aineet-suomessa/ | Korvaamisen erot |
| Ravintoarvioiden epävarmuus | /ruokaopas/ravintoarvio-epavarmuus/ | Laskenta ≠ laboratoriomittaus |

## Kuvat ja SEO
- Jokaisella artikkelilla oma lähdepolku `/ruokaopas/kuvitus/<slug>.svg` ja uniikki alt-teksti. 1600×900 artboard, ei ulkoisia resursseja.
- Tämä on **toimituksellinen kuvitus**, ei PR #308:n kolmen kuvasuhteen WebP-pohja. Älä väitä SVG-tiedostoa valokuvamasteriksi.
- Ennen myöhempää kuvaputkilaajennusta suunnitellaan 1600×900, 1600×1200 ja 1600×1600 laadukkaat todelliset kuvaversiot. V1.5:n reseptikuvaputkea ei muuteta.
- Olemassa olevat canonical-/BlogPosting-/Open Graph-/sitemap-mallit laajenevat datavetoisesti. Testit tarkistavat kaikkien julkaistujen polkujen kuvat ja lähteet.

## Valion havainnon hyödyntäminen
[Valion 16.7.2026 käyttödatamuistio](../research/valio-ruokaopas-vertailu-2026-11-06.md) tukee kiinnostuksen suuntaamista arkikäytön käytännön ongelmiin, leivontaan ja ajankohtaisiin reseptiaiheisiin. Saman lähteen yli miljoonan kävijän mittari sisältää **verkkopalvelun ja mobiilisovelluksen yhteensä** eikä mittaa Valion blogia tai Recipavon potentiaalia.

## Julkaisurajat
- Ei suoria väitteitä henkilökohtaisista koepaistoista tai mitatuista tuloksista.
- Lähde-URL:t ja sisäiset reitit tarkistetaan. Lisäksi tarvitsee muutoksen mukaiset regressiotestit.
- Ei kävijäseurantaa tai canonical-vaihdosta ennen hyväksyttyä `https://www.recipavo.com/`-siirtoa.
