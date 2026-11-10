/** Exact list of quarantined, source-sealed recipes. No public route until approved. */
export const publicRecipeQuarantineIds = Object.freeze([
  "karibia-bammy-kassavaleipa",
  "karibia-ackee-ja-suolakala",
  "vietnamilainen-banh-bao-kananmunalla",
  "pohjoisafrikkalainen-maakouda",
  "indonesialainen-lontong-sayur-aamiaiseksi",
  "japanilainen-miso-tofu-paksoi",
  "korealainen-mandu-keitto-aamiaiseksi",
  "valimerellinen-appelsiini-aamiaiskakku",
  "valimerellinen-kikherne-yrttiaamiainen",
  "kiinalainen-bao-munalla",
  "malesialainen-kuih-seri-muka",
] as const);
export const isPublicRecipeQuarantined = (id: string): boolean =>
  (publicRecipeQuarantineIds as readonly string[]).includes(id);
