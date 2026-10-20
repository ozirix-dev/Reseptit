export type ContentStatus = "draft" | "published";

export interface ArticleEntry {
  kind: "article";
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string | null;
  routePath: string;
  status: ContentStatus;
  tags: string[];
  bodyHtml: string;
  bodyText: string;
  wordCount: number;
  readingTimeMinutes: number;
  author: string;
  featured: boolean;
}

export type RecipeLocale = "fi" | "en" | "sv" | "th";

export interface RecipeIngredient {
  amount: number | null;
  unit: string;
  item: string;
  note?: string;
}

export interface RecipeImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string | null;
  srcSet: string | null;
}

export interface RecipeEntry {
  kind: "recipe";
  recipeId: string;
  slug: string;
  locale: RecipeLocale;
  title: string;
  category: "alkuruoka" | "paaruoka" | "jalkiruoka" | "leivonnainen";
  routePath: string;
  image: RecipeImage | null;
  description: string;
  ingredients: RecipeIngredient[];
  instructionsHtml: string;
  instructionsText: string[];
  notesHtml: string;
  servings: number;
  timeTotalMin: number | null;
  difficulty: string | null;
  tags: string[];
  nutrition: {
    carbsNetG: number | null;
    carbsTotalG: number | null;
    proteinG: number | null;
    fatG: number | null;
  };
}

export interface SiteContentIndex {
  articles: ArticleEntry[];
  recipes: RecipeEntry[];
}
