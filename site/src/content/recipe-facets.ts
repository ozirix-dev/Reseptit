// Browse groups derive only from source metadata, never nutrition or an image.
export const cuisines = ["thai", "indian", "chinese", "mediterranean", "mexican", "japanese", "korean", "vietnamese", "indonesian", "malaysian", "caribbean", "middle-eastern", "north-african"] as const;
export const ingredientGroups = ["fish", "chicken", "meat", "vegetables", "legumes", "eggs", "cheese"] as const;

// Explicit metadata values avoid substring collisions and Finnish inflection gaps.
// Ingredients outside these browse groups (e.g. rice, flour, cream) stay ungrouped.
const groupValues: Record<typeof ingredientGroups[number], readonly string[]> = {
  fish: ["kala", "lohi", "kuha", "turska", "katkarapu", "simpukka", "äyriäiset", "tonnikala"],
  chicken: ["kana", "broileri"],
  meat: ["ankka", "kalkkuna", "jauheliha", "nauta", "naudan jauheliha", "naudanliha", "naudanmaksa", "lammas", "liha", "maksa", "makkara", "nakki", "nakit", "pekoni", "poronkäristys", "porsaan jauheliha", "porsaan kassler", "porsaan lapaa", "porsaan niska", "porsaanliha", "sianliha"],
  vegetables: ["kasvikset", "kaali", "valkokaali", "kukkakaali", "parsakaali", "pinaatti", "kesäkurpitsa", "kesakurpitsa", "munakoiso", "tomaatti", "paprika", "sieni", "sienet", "kurkku", "peruna", "lanttu", "oliivi", "persilja", "thaibasilika"],
  legumes: ["linssi", "urad-linssi", "kikherne", "kikhernejauho", "papu", "herne", "tofu", "maapähkinä"],
  eggs: ["kananmuna", "kananmunat", "muna", "munat"],
  cheese: ["juusto", "paneer", "feta", "mozzarella", "raejuusto", "sinihomejuusto", "tuorejuusto"],
};

export function recipeFacets(mainIngredients: string[], tags: string[]) {
  const cuisine = ({ thaimaalainen: "thai", intialainen: "indian", kiinalainen: "chinese", valimerellinen: "mediterranean", meksikolainen: "mexican", japanilainen: "japanese", korealainen: "korean", vietnamilainen: "vietnamese", indonesialainen: "indonesian", malesialainen: "malaysian", karibia: "caribbean", "lähi-itä": "middle-eastern", pohjoisafrikkalainen: "north-african", marokkolainen: "north-african" } as Record<string, string>);
  const ingredients = mainIngredients.map(ingredient => ingredient.trim().toLocaleLowerCase("fi"));
  return { cuisine: tags.filter(tag => Object.hasOwn(cuisine, tag)).map((tag) => cuisine[tag]).find(Boolean) ?? null,
    ingredientGroups: ingredientGroups.filter((group) => ingredients.some(ingredient => groupValues[group].includes(ingredient))) };
}
