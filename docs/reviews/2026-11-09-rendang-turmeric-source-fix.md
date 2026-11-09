# Rendang: puuttuvan kurkumavaiheen FI-korjausehdotus

Käännöserän #356:n kielitarkistuksessa havaittiin, että FI-ainesosissa on 1 tl kurkumajauhetta mutta valmistuksessa sitä ei mainita. Lisätään jo lueteltu kurkuma vaiheen 2 kattilaan. Ei uusia aineksia, ei määriä, annoksia, kypsennyksen luonnetta, GI/GK-arvoja eikä ravintoarvoja muuteta. Kokkikatselmointi, ei koepaisto.

FI-lähteen SHA muuttuu: kaikki kolme rendang-käännösluonnosta PR #356:ssa tulee päivittää tämän jälkeen ja vertailla uudestaan. Tällä PR:llä ei muuteta käännöksiä. Julkaisu edellyttää muuttuneen sisällön, nutrition/GK:n ja CI:n tarkistusta. Mikäli laskenta on sidottu lähteen tarkkaan tekstihashiin, korjaus jää HOLDiin, kunnes sidonta käsitellään hyväksytyllä tavalla.

## GitHub Actions - uusintakokeen peruste

9.11.2026 edellinen PR-run `42672447457` päättyi `failure`, mutta GitHub Actions palautti 0 jobia ja 0 check runia, eikä siinä ajettu testejä. Työnkulun `pages.yml` sisältö on sama kuin aikaisemman vihreän ajon aikana. Samankaltainen 0-job failure esiintyi toisessa resepti- ja i18n-PR:ssä. Tämän dokumentin muutoksella laukaistaan yksi uusi, tavallinen PR-ajo; tulosta ei pidetä hyväksyttynä ennen oikeaa build-jobin onnistumista. GI/GK-sidontoja ei muuteta eikä testejä ohiteta.
