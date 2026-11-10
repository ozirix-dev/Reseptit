import { createHash } from "node:crypto";

/**
 * A8 editorial projection: public FI instructions only, never GK80/GK100,
 * nutrition evidence, or canonical FI source approval.
 *
 * Every accepted source is bound to its exact original raw SHA-256.
 * Unexpected source drift or missing/ambiguous anchors fail closed.
 */
type A8EditorialPatch = {
  sourceSha256: string;
  approvalScope: string;
  edits: readonly (readonly [string, string])[];
};
const editorialPatches: Readonly<Record<string, A8EditorialPatch>> = {
  "reseptit/paaruoat/falafel.md": {
    "sourceSha256": "5f2549ef9ba3d3506719b5ccb0258b8ef374f8870c33348fd11a5a6edf4ac6b4",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "6. Tarjoa tahinikastikkeen, salaatin ja pitaleivän kanssa.\n",
        "6. Tarjoa falafelit tässä ohjeessa valmistetun tahinikastikkeen kanssa. Salaatti ja pitaleipä voivat olla erillisiä valinnaisia lisukkeita, mutta ne eivät sisälly tämän version annoksiin tai ravintoarvoihin.\n"
      ]
    ]
  },
  "reseptit/paaruoat/jerk-kana.md": {
    "sourceSha256": "9a5501f0f5a7e397f211ed3fc6017975122aa8ce7b3e3c9bbb741096157acafc",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "time_total_min: 90\n",
        "time_total_min: 130\n"
      ],
      [
        "3. Kuumenna uuni 200 asteeseen. Nosta kana vuokaan ja paista 45–55 minuuttia, kunnes liha on täysin kypsää ja pinta saanut väriä. Voit viimeistellä pinnan grillivastuksen alla.\n",
        "3. Kuumenna uuni 200 asteeseen. Nosta kana vuokaan ja paista 45–55 minuuttia, kunnes liha on kauttaaltaan kypsää (sisälämpötila vähintään 75 °C) ja pinta saanut väriä. Voit viimeistellä pinnan grillivastuksen alla. Älä käytä raakaa kanaa koskettanutta marinadia kypsän ruoan viimeistelyyn.\n"
      ],
      [
        "- Chili on tulinen; poista siemenet tai käytä vain osa chilistä miedompaa makua varten. Kypsennä kana kauttaaltaan.\n",
        "- Chili on tulinen; poista siemenet tai käytä vain osa chilistä miedompaa makua varten. Kokonaisaika noin 130 minuuttia sisältää vähintään tunnin marinoinnin, esivalmistelun sekä 45–55 minuutin paiston; riisi kypsennetään paiston aikana. Kypsennä kana kauttaaltaan.\n"
      ]
    ]
  },
  "reseptit/paaruoat/kimchi-jjigae.md": {
    "sourceSha256": "ddf90c6176447617f9e997b58c8587fb5a3979aa40656aec152cab4407afb561",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "Kimchi-jjigae on lämmin, hapanmausteinen korealainen hauduke, jossa kypsä kimchi, porsaanliha ja tofu kypsyvät samassa liemessä. Tarjoa riisin kanssa.\n",
        "Kimchi-jjigae on lämmin, hapanmausteinen korealainen hauduke, jossa kypsä kimchi, porsaanliha ja tofu kypsyvät samassa liemessä. Tarjoa sellaisenaan. Riisi on haluttaessa erillinen lisuke, joka ei sisälly tämän reseptiversion ravintotietoihin.\n"
      ]
    ]
  },
  "reseptit/paaruoat/lindstrominpihvit-kaalilla.md": {
    "sourceSha256": "ea116b68468b429136a7d799a9e84530ab6d618b77aa4dcd2a18857599f77069",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "2. Muotoile seoksesta kahdeksan litteää pihviä. Paista voissa keskilämmöllä noin 4 minuuttia per puoli, kunnes pihvit ovat kypsiä.\n",
        "2. Muotoile seoksesta kahdeksan litteää pihviä. Paista ne 1 rkl:ssa voita keskilämmöllä noin 4 minuuttia per puoli, kunnes pihvit ovat kauttaaltaan kypsiä.\n"
      ],
      [
        "3. Suikaloi kaali. Paista toisella pannulla voissa 10–12 minuuttia pehmeäksi ja kevyesti ruskistuneeksi.\n",
        "3. Suikaloi kaali. Paista toisella pannulla jäljellä olevassa 1 rkl:ssa voita 10–12 minuuttia pehmeäksi ja kevyesti ruskistuneeksi. Käytä koko ohjeen 2 rkl voita, älä lisää ylimääräistä paistorasvaa.\n"
      ]
    ]
  },
  "reseptit/paaruoat/maksalaatikko-kukkakaalilla.md": {
    "sourceSha256": "0bc68c7f8a97e63f13b6dc778f1167979a4047b2e5f6a7286cd0c6bf185d0cb7",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "2. Hienonna sipuli ja kuullota voissa. Ruskista pieniksi paloiksi leikattu maksa pannulla kypsäksi.\n",
        "2. Hienonna sipuli ja kuullota sitä 1,5 rkl:ssa voita. Lisää pieniksi paloiksi leikattu maksa samaan pannuun ja kypsennä kauttaaltaan. Säästä jäljelle jäävä 0,5 rkl voita vuoan voiteluun; älä lisää muuta paistorasvaa.\n"
      ],
      [
        "4. Kaada voideltuun uunivuokaan ja paista 35–40 minuuttia, kunnes keskusta on asettunut.\n",
        "4. Voitele uunivuoka talteen otetulla 0,5 rkl:lla voita, kaada seos vuokaan ja paista 35–40 minuuttia, kunnes keskusta on asettunut. Varmista, että maksa ja muna ovat kauttaaltaan kypsiä.\n"
      ]
    ]
  },
  "reseptit/jalkiruoat/vhh-brita-kakku.md": {
    "sourceSha256": "5e50ff8c97ab1c36729d732f7245b8f81b4d9c8fb984bd378f3bd3bcad3e608f",
    "approvalScope": "GI/GK-bound, canonical raw preserved; PR361 reviewed wording",
    "edits": [
      [
        "3. Sekoita mantelijauho ja leivinjauhe. Levitä taikina ohueksi levyksi vuoan pohjalle.\n",
        "3. Sekoita mantelijauho ja leivinjauhe keskenään. Kääntele jauhoseos voin, erytritolin ja keltuaisten seokseen tasaiseksi taikinaksi. Levitä taikina ohueksi levyksi vuoan pohjalle.\n"
      ]
    ]
  },
  "reseptit/paaruoat/lanttulaatikko-kermainen.md": {
    "sourceSha256": "a906f10835a76549a852da321ede912f3e2fdd2caf05ed115dd51a990bdfd7ad",
    "approvalScope": "GK80 release-6 sealed source",
    "edits": [
      [
        "  item: kananmunaa kuoretta\n",
        "  item: kananmunaa kuorettomana\n"
      ]
    ]
  },
  "reseptit/paaruoat/shoyu-kanakeitto-konjac.md": {
    "sourceSha256": "18003d3ee1ec7ebf29aa855c73244ce5a4e0ccb33312982dfa1eab0364eb4b68",
    "approvalScope": "GK80 release-3 sealed source",
    "edits": [
      [
        "cooking_method:\n- paistaminen\n",
        "cooking_method:\n- keittäminen\n"
      ],
      [
        "1. Kiehauta punnittu käyttövalmis kanaliemi. Kypsennä broileri siinä kauttaaltaan.",
        "1. Kiehauta punnittu käyttövalmis kanaliemi. Kypsennä broileri siinä kauttaaltaan vähintään 75 °C:n sisälämpötilaan."
      ]
    ]
  }
};

export const a8EditorialFiPaths = Object.freeze(Object.keys(editorialPatches));

export function projectA8FiEditorialSource(relativePath: string, raw: string): string {
  const patch = editorialPatches[relativePath];
  if (!patch) return raw;
  const normalized = raw.replaceAll("\r\n", "\n");
  const hash = createHash("sha256").update(normalized).digest("hex");
  if (hash !== patch.sourceSha256) {
    throw new Error(`A8_EDITORIAL_SOURCE_STALE: ${relativePath} (${patch.approvalScope})`);
  }
  let projected = normalized;
  for (const [before, after] of patch.edits) {
    if (before === after || projected.split(before).length !== 2) {
      throw new Error(`A8_EDITORIAL_PATCH_AMBIGUOUS: ${relativePath}`);
    }
    projected = projected.replace(before, after);
  }
  if (projected === normalized) throw new Error(`A8_EDITORIAL_PATCH_EMPTY: ${relativePath}`);
  return projected;
}
