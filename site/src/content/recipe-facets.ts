// Browse groups derive only from source metadata, never nutrition or an image.
export const cuisines = ["thai", "indian", "chinese", "mediterranean"] as const;
export const ingredientGroups = ["fish", "chicken", "meat", "vegetables", "legumes", "eggs", "cheese"] as const;
export function recipeFacets(mainIngredients: string[], tags: string[]) {
  const cuisine = ({ thaimaalainen: "thai", intialainen: "indian", kiinalainen: "chinese", valimerellinen: "mediterranean" } as Record<string, string>);
  const ingredients = mainIngredients.join(" ").toLocaleLowerCase("fi");
  const groups: Record<typeof ingredientGroups[number], RegExp> = {
    fish: /kala|lohi|kuha|turska|katkarapu|simpukka|äyriäi/,
    chicken: /kana(?!nmuna)|broileri|kalkkuna/,
    meat: /jauheliha|nauta|pors|lammas|liha|maksa|makkara|nakki|pekoni/,
    vegetables: /kaali|pinaatti|kesäkurpitsa|munakoiso|tomaatti|paprika|sieni|kurkku|peruna|lanttu/,
    legumes: /linssi|kikherne|papu|herne|tofu/,
    eggs: /kananmuna|^muna$|munat/,
    cheese: /juusto|paneer|feta|mozzarella/,
  };
  return { cuisine: tags.map((tag) => cuisine[tag]).find(Boolean) ?? null,
    ingredientGroups: ingredientGroups.filter((group) => groups[group].test(ingredients)) };
}
