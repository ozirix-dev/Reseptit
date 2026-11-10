/** Exact list of quarantined, source-sealed recipes. No public route until approved. */
export const publicRecipeQuarantineIds = Object.freeze([
  "karibia-bammy-kassavaleipa",
  "karibia-ackee-ja-suolakala",
  "vietnamilainen-banh-bao-kananmunalla",
] as const);
export const isPublicRecipeQuarantined = (id: string): boolean =>
  (publicRecipeQuarantineIds as readonly string[]).includes(id);
