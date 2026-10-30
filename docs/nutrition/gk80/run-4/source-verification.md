# Kohdennettu AFCD-lähdevarmennus

Uusi virallinen Release3-ravintoprofiilien tiedosto tarkistettiin neljältä
uudelta koostumustyypiltä: kaupallinen soijakastikeF008065, kalakastikeF008004,
tahiniF009076 ja kypsän kookospähkinän hedelmälihaF002983. Kaikki neljä makroa
vastaavat repon per100g-viitettä. afcd-primary-verification.json sisältää
valitut rivit, tarkan taulukon nimen ja alkuperäistiedoston SHA256:n.

Live-API:n soijakastikkeen oletusmitta on100mL, kun laskennan tietue on100g.
Esimerkiksi7,2g proteiinia/100mL ei ole ristiriidassa valitun6,8g/100g
ravintoprofiilin kanssa. Virallisen työkirjan erilliset100g- ja100mL-taulukot
varmistettiin; API:n pyöristettyjä lukuja ei muunnettu arvaamalla eikä siirretty
sellaisinaan gramma-aineistoon. Laskentatuloksia tai repon viitettä ei muutettu.

[FSANZ Release3 -ravintoprofiilit](https://www.foodstandards.gov.au/sites/default/files/2025-12/AFCD%20Release%203%20-%20Nutrient%20profiles.xlsx).
