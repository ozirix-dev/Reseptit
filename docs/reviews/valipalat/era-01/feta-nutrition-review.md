# Fetavaahto – laskettava ravintoarvokandidaatti

Tämä on **lähteisiin sidottu, deterministinen laskentakandidaatti**, ei julkaistu ravintoarvo eikä hyväksytty GK. Tarkka lähdekartta: `feta-evidence-candidate.json`. Projektin `nutrition-model` lasketaan uudelleen yksikkötestissä suoraan kuudesta Fineli Release 20 -tietueesta sekä nykyisestä punnitusta reseptiluonnoksesta.

| Annos (¼ reseptiä) | Tarkistettava arvo |
| --- | ---: |
| Nettohiilihydraatti | 3,53 g |
| Kokonaishiilihydraatti (kuitu mukana) | 4,83 g |
| Proteiini | 8,15 g |
| Rasva | 9,42 g |
| GK | **HOLD — ei lukua** |

Ainesosien määrä /4: 120 g feta, 100 g kreikkalainen jogurtti, 10 g laimentamaton sitruunamehu, 5 g tilli, 200 g kurkku, 150 g punainen paprika. Kaikki määrät ovat syötäviä määriä ilman paistohävikkiä. Energiaa ei johdeta virheellisesti julkaistavaksi, sillä lähdemalli tarkistaa tässä vain neljä makroarvoa.

**Viimeiset portit:** (1) vahvistettu tuotteen ja annoksen todellinen toteutus, (2) oikea hyväksytty 16:9 ruokakuva `kuvat/valipalat/`, (3) kieliversioiden laatu, (4) julkaisulähteeseen siirtyminen ja `docs/nutrition/calculations/`-evidenssin identtinen ravintoarvojen laskenta, (5) CI/SEO ja omistajan hyväksyntä.

Fetan GK:ta ei voi päätellä pelkästään pienestä hiilihydraattimäärästä. Mikäli julkaisu muuten kelpaa, GK jää puuttuvaksi nykyisen julkaisukäytännön mukaan.
