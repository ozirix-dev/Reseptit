# Karnivore – kolmen kuvan toimitus ja liitosohje (11.11.2026)

**Tila:** kolme kuvaversiota on generoitu ja muunnettu 1280 × 853 px WebP-muotoon paikallisessa toimituspaketissa. **Binaareja EI ole vielä GitHub-haarassa**. Kuvien tuotantojulkaisua, CI-testiä tai hyväksyttyä image-metadataa ei pidä väittää tapahtuneeksi.

## Valmiit kuvatiedostot

| Reseptin ID | Tavoitepolku GitHubissa | Kuvan alt (FI) | Tiedostokoko paikallisessa paketissa |
| --- | --- | --- | ---: |
| `karnivore-steak-and-eggs` | `kuvat/paaruoat/karnivore-steak-and-eggs.webp` | Viipaloitua entrecôte-pihviä ja kaksi paistettua kananmunaa tummalla lautasella. | 156 320 tavua |
| `karnivore-jauhelihakulho-munalla` | `kuvat/paaruoat/karnivore-jauhelihakulho-munalla.webp` | Ruskistettua naudan jauhelihaa ja paistettu kananmuna tummassa kulhossa. | 150 844 tavua |
| `karnivore-voilohi-pannulla` | `kuvat/paaruoat/karnivore-voilohi-pannulla.webp` | Rapeanahkainen voissa paistettu lohifilee tummalla lautasella. | 179 026 tavua |

Kuvat on sommiteltu 3:2 vaakakuviin, neutraalille vaalealle alustalle tummalle lautaselle/kulhoon, ilman kasviskoristeita. Kuva ei ole todiste toteutuneesta koepaistosta. Kuvien maustehiput ja kananmunan keltuaisen ulkonäkö ovat kuvageneroinnin visuaalisia yksityiskohtia, eivät reseptin uusia aineksia tai ruoan kypsyyden varmennus.

## Tarvittava viimeistely kuvien tuonnin jälkeen

1. Lisää binääriset WebP-tiedostot yllä oleviin `kuvat/paaruoat/`-polkuihin **tähän työhaaraan**, ei mainiin.
2. Tee kuvaa vastaavan reseptin `image.src`, `alt`, `width: 1280`, `height: 853` -metadata skeeman sallimassa muodossa. Älä muuta `status: draft` -tilaa.
3. Tarkista reseptin ainesosavastaavuus erityisesti pippuria muistuttavien pisteiden ja kananmunan kypsyyden kuvassa; tarvittaessa korvaa kuva ennen julkaisua.
4. Aja `npm run test:image`, `npm run build` ja julkaisun muut portit. Ravintoarvo- ja GK-HOLD ovat tästä erillisiä.
5. Vain hyväksytyt reseptit siirretään erillisellä FI-julkaisu-PR:llä tuotantosisältöön ja ruokavaliosuodattimen SHA-lukittuun manifestiin.

Huom.: tässä dokumentissa ei ole kuvatiedostoja sisällään, eikä GitHubiin tallennettua kuvaa voi päätellä pelkästä tästä raportista.
