# Ketomutakakun ruotsin- ja thainkielisten luonnosten tarkistus 4.11.2026

Ruotsinnos perustuu PR #220:n luonnokseen (commit `28a53a02b5363e100ea5f2d979780621fd78462a`). Thaikielinen vastine käännettiin suomenkielisestä reseptistä. Käännöksistä verrattiin lähteeseen otsikko, kuvaus, ainesosat järjestyksineen, määrät ja yksiköt, kuvan alt-teksti, ohjeet ja huomautukset. Molemmissa on kahdeksan annosta, 30 minuutin kokonaisaika ja kuusi valmistusvaihetta. Uuni on 175 °C, vuoka noin 20 cm ja paistoaika 12–16 minuuttia. Vaniljauute on ainesluettelossa, kuten lähteessä. Lähdeohje ei määritä, missä vaiheessa se lisätään.

- **STRUCTURE PASS.** Tilapäisessä julkaisuesikatselussa käännösauditointi tarkisti 392 paria ilman virheitä, ja 27 käännöstestiä läpäisi. TypeScript, tuotantokoonti, 726 reitin esirenderöinti ja 29 staattista testiä läpäisivät.
- **GK-esikatselu.** Molemmilla reseptisivuilla alkuperäisen GK näkyi puuttuvana. Hyväksytyn A-version `gk149-b373e5621c6c` laskettu osuus näkyi muodossa alle 1 annosta kohti. Lähdeosio avautui Bravessa näppäimistöllä ja näytti 10 linkkiä kummallakin sivulla. Kaikkien hyväksyttyjen GK-only-versioiden generoitu aineisto vastasi aiempaa aineistoa tavutasolla.
- **AUTOMATED SEMANTIC REVIEW / HUMAN REVIEW PENDING.** Kielimalli vertasi käännöksiä lähteeseen. Riippumatonta ihmistarkistusta ei ole dokumentoitu. Käännökset palautettiin luonnostilaan esikatselun jälkeen.

Suomenkielinen lähdetiedosto sisältyy hyväksytyn GK-aineiston sisältötarkistukseen. Julkaisussa on sovitettava kielimetatiedon päivitys tähän tarkistukseen ja ratkaistava ruotsinnoksen päällekkäisyys PR #220:n kanssa.
