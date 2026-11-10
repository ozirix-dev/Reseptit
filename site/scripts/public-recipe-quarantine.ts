/** Exact list of quarantined, source-sealed recipes. No public route until approved. */
export const publicRecipeQuarantineIds = Object.freeze([
  "karibia-bammy-kassavaleipa",
  "karibia-ackee-ja-suolakala",
  "vietnamilainen-banh-bao-kananmunalla",
  "indonesialainen-nasi-goreng-aamiaisriisi",
  "japanilainen-yaki-onigiri-misolla",
  "karibia-saltfish-fritterit",
  "intialainen-idli-kookoschutneylla",
  "vietnamilainen-xoi-maapahkinalla",
  "pohjoisafrikkalainen-maakouda",
  "indonesialainen-lontong-sayur-aamiaiseksi",
  "japanilainen-miso-tofu-paksoi",
  "korealainen-mandu-keitto-aamiaiseksi",
  "valimerellinen-appelsiini-aamiaiskakku",
  "valimerellinen-kikherne-yrttiaamiainen",
  "kiinalainen-bao-munalla",
  "malesialainen-kuih-seri-muka",
  "intialainen-aloo-paratha",
  "malesialainen-laksa-lemak-aamiaiseksi",
] as const);
export const isPublicRecipeQuarantined = (id: string): boolean =>
  (publicRecipeQuarantineIds as readonly string[]).includes(id);
