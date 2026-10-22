# Ravintoarvojen ja ruokavalioluokituksen näyttö

Ravintoarvot ovat reseptin metatiedoissa; niitä ei ylläpidetä toisena
numerokopiona tekstissä. Puuttuva arvo jätetään puuttumaan. Arvio merkitään
reseptin muistiinpanoihin ja käännetään kaikille julkaistuille kielille.

Ennen uuden laskelman hyväksymistä tallenna reseptikohtainen laskentamuistio:

- reseptin `recipe_id`, lähdecommit ja laskennan päivämäärä
- käytetyt tuotepakkausten tiedot tai yksilöidyt ravintotietokannan tietueet
- syötävä raakapaino, käytetyt tuotemerkit ja mahdollinen valutettu paino
- annosmäärä, laskentakaava ja kokonaismäärän jakaminen annoksiin
- hiilihydraatin määritelmä: netto ja kokonaismäärä eivät ole sama asia;
  EU-pakkausmerkinnästä ei vähennetä kuitua automaattisesti uudelleen
- valmistuksen saantoa, paistorasvaa ja lisäkkeitä koskevat oletukset
- tarkistaja ja epävarmuudet.

Muistio sijoitetaan tuoterepon dokumentaatioon. Schemaan ei lisätä vapaata
laskentalähdekenttää ilman erillistä toteutusta. Nykyinen inventaario ei
todista numeroiden laskentapohjaa, vaikka käännösten arvot täsmäävät.

Perinteinen riisi-, pasta- tai perunaruoka erotetaan VHH-muunnelmasta.
Keto-otsikko ja luokitus vaativat perustellun annoskohtaisen arvion.
Tuotevalinnasta riippuvaa sopivuutta ei luvata yleisesti. Runsasproteiinisuus
ei tarkoita vähähiilihydraattisuutta. V1.4 ei tee massalaskentaa eikä muuta
olemassa olevia luokituksia arvaamalla.

## V1.4:n rajattu väitekorjaus

22.10.2026 jatkokorjauksessa viiden reseptin (`keto-pinaattiletut`,
`keto-pannukakku`, `keto-joulutortut`, `keto-korvapuustit` ja
`ketopizza-pofiber-pohjalla`) keto-otsikko ja vahvistamaton ruokavalioluokka
poistettiin. Kuvaava nimi kertoo ainesosista; ID:t ja URL:t säilyvät.
Myös pizzapohjan todentamaton alle 5 g:n väite poistettiin.

Tämä ratkaisee julkisen perusteettoman lupauksen ilman uutta laskelmaa.
Luokituksen voi palauttaa vasta tämän dokumentin mukaisen näytön perusteella.
Muiden reseptien arvioita ei tällä päätöksellä vahvisteta.
