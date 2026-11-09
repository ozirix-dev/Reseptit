import { createHash } from "node:crypto";

/**
 * Version-pinned public FI presentation corrections for GK80-sealed originals.
 * Never use this projection for GK calculations, source pack approval or
 * nutrition evidence. The original raw Markdown and release SHA remain intact.
 *
 * The projection fails closed on even a one-byte unexpected source revision.
 * A canonical FI correction requires a separately reviewed GK80 source-version
 * migration; adding more strings here is not a substitute.
 */
type ReviewedPatch = {
  sourceSha256: string;
  pack: string;
  edits: readonly (readonly [string, string])[];
};

const reviewedPatches: Readonly<Record<string, ReviewedPatch>> = {
  "reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md": {
    "sourceSha256": "d67ceed756075fd94a208344789c4323a8a59cf2a43300377255c38de8a9b6e0",
    "pack": "gk80-release-6",
    "edits": [
      [
        "  item: kananmunaa kuoretta\n",
        "  item: kananmunaa kuorettomana\n"
      ]
    ]
  },
  "reseptit/aamupalat/munakasmuffinit.md": {
    "sourceSha256": "8fb9bd93679e1b4ddbb8604f16eba144a1d849c6d8ff7d54120a9ebcf176c73f",
    "pack": "gk80-release-4",
    "edits": [
      [
        "1. Lämmitä uuni 190 asteeseen. Voitele kuusi muffinivuokaa.",
        "1. Lämmitä uuni 190 asteeseen. Käytä kuutta tarttumatonta silikonivuokaa tai muffinipellissä kuutta paperivuokaa. Älä lisää erillistä voitelurasvaa."
      ],
      [
        "2. Paista pekoni pannulla rapeaksi ja nosta talouspaperille. Hienonna pinaatti ja pekoni.",
        "2. Paista pekoni pannulla rapeaksi. Ota pannulle irronnut pekonirasva talteen munaseosta varten, älä valuta sitä talouspaperiin. Hienonna pinaatti ja pekoni."
      ],
      [
        "3. Vatkaa munat ja kerma. Sekoita mukaan pinaatti, murennettu pekoni, juusto ja pippuri.",
        "3. Vatkaa munat ja kerma. Sekoita mukaan pinaatti, murennettu pekoni, juusto, pippuri ja kaikki talteen otettu pekonirasva."
      ]
    ]
  },
  "reseptit/aamupalat/tonnikalamunakkaat-uunissa.md": {
    "sourceSha256": "7cab94aedfe0b1cb14070557393adf3a3268d0f0306fdbd0d1c377def7e141dd",
    "pack": "gk80-release-4",
    "edits": [
      [
        "1. Lämmitä uuni 190 asteeseen ja voitele kuusi muffinivuokaa.",
        "1. Lämmitä uuni 190 asteeseen. Käytä kuutta tarttumatonta silikonivuokaa tai muffinipellissä kuutta paperivuokaa. Älä lisää erillistä voitelurasvaa."
      ]
    ]
  },
  "reseptit/aamupalat/thai-kookosriisi-mangolla.md": {
    "sourceSha256": "df6fe9113a62bc23fbea66eb023b30ef2aa70eeb3ec7221826fa96ff564997f8",
    "pack": "gk80-release-5",
    "edits": [
      [
        "cooking_method:\n- paistaminen\n",
        "cooking_method:\n- keittäminen\n"
      ]
    ]
  },
  "reseptit/aamupalat/vietnamilainen-chao-ga-kanapuuro.md": {
    "sourceSha256": "d2b3105d6525b2b626792cbbe2bf12a2e073183ba061cd2f05dcef230ba85e97",
    "pack": "gk80-release-1",
    "edits": [
      [
        "1. Mittaa kuiva valkoinen jasmiiniriisi ja 800 g vettä kattilaan. Kuumenna kiehuvaksi ja hauduta pehmeäksi puuroksi noin 40 minuuttia; sekoita välillä ja lisää tarvittaessa vain vettä.",
        "1. Mittaa 100 g kuivaa valkoista jasmiiniriisiä ja 800 g vettä kattilaan. Kuumenna kiehuvaksi ja hauduta pehmeäksi puuroksi yhteensä noin 40 minuuttia; sekoita välillä ja lisää tarvittaessa vain vettä."
      ],
      [
        "2. Kypsennä broilerin rintafilee puurossa kauttaaltaan. Nosta kana, revi pieneksi ja palauta kaikki kana ja siitä irronnut neste puuroon.",
        "2. Leikkaa 150 g nahatonta broilerin rintafileetä pieniksi paloiksi. Lisää kana puuroon, kun riisi on hautunut noin 25 minuuttia; kypsennä vielä noin 15 minuuttia riisin kanssa. Tarkista paksuimmasta kanapalasta vähintään 75 °C:n sisälämpötila; jatka kypsennystä tarvittaessa. Nosta kypsä kana halutessasi revittäväksi ja palauta kaikki kana ja siitä irronnut neste puuroon."
      ]
    ]
  },
  "reseptit/aamupalat/indonesialainen-bubur-ayam-kanariisipuuro.md": {
    "sourceSha256": "1d2cb832c221d6645c32dfe6bacd4516b26b7fc84864a4b9965d514c9b9de9f0",
    "pack": "gk80-release-1",
    "edits": [
      [
        "1. Mittaa kuiva valkoinen jasmiiniriisi ja 800 g vettä kattilaan. Hauduta noin 40 minuuttia pehmeäksi puuroksi. Sekoita välillä; mahdollinen lisäneste on vettä.",
        "1. Mittaa 100 g kuivaa valkoista jasmiiniriisiä ja 800 g vettä kattilaan. Hauduta pehmeäksi puuroksi yhteensä noin 40 minuuttia; sekoita välillä ja lisää tarvittaessa vain vettä."
      ],
      [
        "2. Kypsennä broilerin rintafilee puurossa kauttaaltaan. Revi kypsä kana ja palauta se sekä kaikki neste puuroon.",
        "2. Leikkaa 150 g broilerin nahatonta rintafileetä pieniksi paloiksi. Lisää kana puuroon, kun riisi on hautunut noin 25 minuuttia; kypsennä vielä noin 15 minuuttia riisin kanssa. Tarkista paksuimman kanapalan sisälämpötilaksi vähintään 75 °C; jatka kypsennystä tarvittaessa. Revi kypsä kana halutessasi ja palauta kaikki kana sekä kypsennysneste puuroon."
      ]
    ]
  }
};

export const reviewedFiEditorialPaths = Object.freeze(Object.keys(reviewedPatches));

export function projectReviewedFiEditorialSource(relativePath: string, raw: string): string {
  const patch = reviewedPatches[relativePath];
  if (!patch) return raw;
  const normalized = raw.replaceAll("\r\n", "\n");
  const hash = createHash("sha256").update(normalized).digest("hex");
  if (hash !== patch.sourceSha256) {
    throw new Error(`EDITORIAL_FI_SOURCE_STALE: ${relativePath} (${patch.pack})`);
  }
  let projected = normalized;
  for (const [before, after] of patch.edits) {
    if (projected.split(before).length !== 2 || before === after) {
      throw new Error(`EDITORIAL_FI_PATCH_AMBIGUOUS: ${relativePath}`);
    }
    projected = projected.replace(before, after);
  }
  if (projected === normalized) {
    throw new Error(`EDITORIAL_FI_PATCH_EMPTY: ${relativePath}`);
  }
  return projected;
}
