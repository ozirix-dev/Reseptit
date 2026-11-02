# Omistajan päätöslomake — kaksi uutta B-versiota

Tyhjät solut ovat **vastaamattomia**. Kirjoita lähde-/menetelmäpäätökseen ja sisältöpäätökseen erikseen`hyväksyn` tai`hylkään`,tarvittaessa rajaus. Päätös koskee vain täyttä syötehashia,sen lähdesidontoja ja täsmällistä versiota. Hylkäys tai vastaamatta jättäminen ei valtuuta integraatiota.

| Täsmällinen versio | Malli / GK-laskelma | Syötehash | Lähde- ja menetelmäpäätös | Reseptiversion sisältöpäätös |
| --- | --- | --- | --- | --- |
| `intialainen-besan-chilla` | B / 9.47 | `afc7beb15b482d6b53c84e7d4c58bee88c007a4232a6984918b0320e6f9ed213` |  |  |
| `intialainen-pinaatti-paneer-chilla` | B / 8.92 | `6c0b1890e16a526a75f5e8ef7b2729de3f7ef370c17b197dacb3990ece6f0710` |  |  |

- **Besan-chilla:**2 annosta,uusi kokonaisen kuorimattoman kikherneen ohut fermentoimaton pannulettu,100g jauhoa/222,2g vettä/16,7g öljyä. Kaikki100g tomaatti+70g sipuli -chutney ja6g korianteri mukaan. Batra42-komponentti ja AFCD:n natiivi kokonaiskikhernekoostumus ovat LOW-analogioita. Vanhan15 henkilön tutkimuksen54,8gCHO vs50g glukoosiviite,rasvalajin ja näytteenoton rajoitteet säilyvät. Ei kaupallisen kuoritun besanin yleistä GI42-hyväksyntää.
- **Pinaatti-paneer-chilla:**sama kokonaiskikhernelettu,50g pinaattia,100g paneeria,2g juustokuminaa nimetyn trace50:n mukaan. Määräämätön tarjoiluchutney ja sitruunalohko ovat tämän GK-version ulkopuolella. B-ainesosamalli,ei täytetyn aterian mitattua GI:tä. Jauhon vaihto,vesi/öljymäärät ja tarjoilurajaus hyväksytään sisältönä erikseen.

Täydet syötteet:[proposals.json](proposals.json);lähderajaukset:[review.md](review.md). Nykyisen B:n trace50-tyyppiä ei laajenneta uusiin rajoihin eikä B-poisjättöprofiilia oteta käyttöön. Neljän jo hyväksytyn A-version eteneminen ei edellytä näiden B-päätösten hyväksymistä.

## Jo hyväksytyt — ei samoja kysymyksiä uudelleen

| A-versio | Hyväksytty syötehash | Laskettu GK-osa |
| --- | --- | ---: |
| rahkapiirakka-vhh |`4194712a2cecb7979c779f4479a1f0a92bf402e190c4ff66a2369667455acbd4` |0,45 |
| bulgogi |`5ae159afc878044788f07f23db47c2932168760d4f8020e5ec3d9b553f7e83c1` |41,31 |
| rahka-marjakerroskulho |`092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86` |2,34 |
| kaakao-kookos-chia |`dfcb1006838f327d6dc368dbdd647180f4be3305b82518e99f88b8d25f71f8b2` |0,22 |

Kaikkien neljän aiemmat lähde-/sisältöhyväksynnät ja myöhemmän nimetyn julkaisijan integraatiovaltuus on varmennettu. Uusi hyväksyntä ei ulotu metsämustikan2,41 B-versioon,vanhaan kaakao1,59 B:hen,jerk-/sate-menetelmiin tai muihin raaka-aineisiin.

## Vaiheet ja julkaisuvaltuus

| Toimi | Täsmällinen rajaus | Mahdollinen uusi omistajan vastaus |
| --- | --- | --- |
| Julkaisun valmistelu | Neljä aiempaa A-kuittia sallii myöhemmän integraation nimetyllä julkaisuomistajalla. Jo annettua valtuutta ei kysytä uudelleen. Mahdollisten uusien B-hyväksyntöjen valmistelu rajataan omaan erään. |  |
| Merge | Vasta tulevan julkaisijan PR:n täsmällinen HEAD/main repo_guardin menettelyssä. Tätä lomaketta ei käytetä merge-vahvistuksena. |  |
| Deploy | Erillinen myöhemmän julkaisu-PR:n valtuus ja tuotantovarmennus. |  |

Tämä katselmointi ei täytä vastauksia omistajan puolesta. Dokumentti-Draftin mahdollinen merge ei aktivoi numeroita tai valtuuta toisen agentin haaraan kirjoittamista.
