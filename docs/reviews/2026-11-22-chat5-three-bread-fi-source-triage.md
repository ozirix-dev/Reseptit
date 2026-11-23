# Chat-5 / Issue #327 – kolmen leipäreseptin lähdekohtainen katselmointi

**Päivä:** 22.11.2026 · **Tila:** SOURCE-REVIEW / ei julkaisuhyväksyntä · **Omistaja:** Chat 5

Tämä raportti on GitHubin `main`-haaran FI-lähteiden sisällöllinen vertailu. Se ei perustu pelkkään tekstin samankaltaisuuteen: kunkin reseptin ainesosat ja valmistusohje verrattiin toisiinsa. Tarkistettuja reseptejä ei muuteta tässä PR:ssä, koska ne ovat jo julkaistujen ravinto-/GK-sidosten piirissä. Tämä ei todista Cloudflare-tuotannon nykyistä sisältöä.

| Resepti | FI-lähteen Git-blob | Varmennettu ristiriita | Päätös |
| --- | --- | --- | --- |
| `lahi-ita-manakish-zaatarilla` | `1369126b90bafbe09c07aaf503ae2c69c886b8e4` | Vaiheet 1–3 ovat sama geneerinen taikina-/täyttö-/pannupaistoteksti kuin kahdessa aivan eri leipäannoksessa. Vaihe 4 kertoo varsinaisen manakishin: 150 g jauhoa, 100 g jogurttia, 40 ml vettä, timjami, seesami ja oliiviöljy. Geneerinen täyttövaihe ei kuvaa pinnalle levitettävää za'atar-seosta. | **P1 SOURCE-REVIEW:** korvaa ristiriitaiset geneeriset vaiheet täsmällisellä manakish-menetelmällä, säilytä annos- ja rasvamäärät; tarkista myös 1 rkl paistoöljyn käyttö ja aika. |
| `malesialainen-kaya-paahtoleipa` | `04d0be9051dd41645e08345990078260e374f6ca` | FI-aineksissa on 100 g valmista hapanjuurileipää, ei jauhoja tai leipätaikinaa. Silti vaiheet 1–3 käskevät vaivaamaan ja kaulimaan taikinan. Vaihe 4 tekee kookosmaidosta, sokerista ja kananmunasta kaya-tahnan sekä paahtaa leivän. | **P1 SOURCE-REVIEW:** poista väärä taikinamenetelmä; täsmennä kahden kananmunan erillinen käyttö, kaya-tahnan kypsyys, saanto ja syöty osuus. |
| `valimerellinen-halloumi-tomaattileipa` | `253f6853afd71b5ffe17d338e45778bcbf0b1343` | FI-aineksissa on 100 g valmista hapanjuurileipää, 150 g halloumia, 100 g tomaattia ja 25 g oliiveja, ei jauhoja tai taikinaa. Vaiheet 1–3 kuitenkin käskevät vaivaamaan ja kaulimaan taikinan. Vaihe 4 kuvaa todellisen leivän paahtamisen ja halloumin paiston. | **P1 SOURCE-REVIEW:** poista taikina-/täyttöharha; täsmennä öljyn käyttö ja suolan tarve halloumin suolaisuuden huomioiden. |

## Riippuvuudet ja turvallinen korjausjärjestys

1. Käsittele jokainen resepti erikseen: vahvista alkuperäiset määrät, kypsennystapa, todellinen kokonaisaika sekä ravinto-/GK-lähdesidokset. Näkyvän ohjeen korjaus voi vaikuttaa syödyn öljyn määrään tai valmistusmenetelmään.
2. Korjaa ensin FI-valmistus ja katselmoi uuden lähde-SHA:n vaikutus ravinto-/GK-sinetteihin. Älä kirjoita uusia aikoja tai makroja arvauksina.
3. Tarkista vasta hyväksytyn FI:n jälkeen julkaistut EN/SV/TH-merkitysvastineet; aiemmat kielihyväksynnät voivat vanhentua.
4. Päivitä `#327`-raportin seitsemän pitkän toistoryhmän määrä vasta uuden julkisen esityksen auditin jälkeen. Samankaltaisuus ei yksin todista virhettä, mutta nämä kolme tapausta ovat ainesosien perusteella ristiriitaisia.
5. Jätä julkaisu ja Ready/merge Chat-1:n koordinoitavaksi. Tämä raportti on **docs-only**, ei korjattu tai hyväksytty resepti.

**Lopputulos:** kolmessa erillisessä FI-reseptissä on sama väärä geneerinen taikinaohje, vaikka kaksi käyttää valmista leipää ja kolmas vaatii za'atar-päällysteen. Kirjattu korjausehdotus ei poista lähde-/ravinto-/käännösportteja.
