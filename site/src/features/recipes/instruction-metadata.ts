import type { RecipeEntry } from "../../types/content";

export function recipeInstructionId(kind: "prep" | "step", index: number): string {
  return `recipe-${kind}-${index + 1}`;
}

// Each title summarizes the opening action of a published Finnish step.
const finnishStepNames: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "avokado-banaanijaatelo": {
    "Lusikoi avokadon hedelmäliha tehosekoittimeen.": "Lisää ainekset tehosekoittimeen",
    "Soseuta tasaiseksi.": "Soseuta jäätelömassa",
    "Levitä massa matalaan pakastuksen kestävään rasiaan, sulje kansi ja pakasta noin 4 tuntia.": "Pakasta jäätelömassa",
    "Anna jäätelön pehmetä huoneenlämmössä ": "Pehmennä jäätelö ennen tarjoilua",
  },
  bataattiletut: {
    "Soseuta bataatti ja kananmunat tasaiseksi.": "Tee lettutaikina",
    "Kuumenna tarttumaton paistinpannu keskilämmöllä ": "Kuumenna pannu",
    "Paista noin 3 minuuttia ensimmäiseltä puolelta,": "Paista ja käännä letut",
    "Paista loput letut samalla tavalla.": "Paista loput letut",
  },
};

export function recipeStepName(recipe: RecipeEntry, text: string): string | undefined {
  const names = recipe.locale === "fi" ? finnishStepNames[recipe.recipeId] : undefined;
  return names && Object.entries(names).find(([opening]) => text.startsWith(opening))?.[1];
}
