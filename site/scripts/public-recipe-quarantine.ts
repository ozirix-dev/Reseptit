import quarantineIds from "./public-recipe-quarantine.json";

/** Exact list of quarantined, source-sealed recipes. No public route until approved. */
export const publicRecipeQuarantineIds: readonly string[] = Object.freeze(quarantineIds);

export const isPublicRecipeQuarantined = (id: string): boolean =>
  publicRecipeQuarantineIds.includes(id);
