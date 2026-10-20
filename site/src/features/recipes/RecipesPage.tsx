import { Link } from "react-router-dom";
import { getRecipes } from "@/lib/content";
import type { RecipeEntry, RecipeLocale } from "@/types/content";
import { recipeUi } from "./recipe-i18n";

const categories: RecipeEntry["category"][] = ["alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"];

export function RecipesPage({ locale }: { locale: RecipeLocale }) {
  const recipes = getRecipes(locale);
  const labels = recipeUi[locale];
  return <section className="page-section recipe-index"><div className="container container--narrow">
    <div className="page-intro"><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.indexTitle}</h1><p className="page-intro__description">{labels.intro}</p></div>
    {categories.map((category) => {
      const entries = recipes.filter((recipe) => recipe.category === category);
      return entries.length ? <section className="recipe-category" key={category} aria-labelledby={`recipe-category-${category}`}>
        <h2 id={`recipe-category-${category}`}>{labels.category[category]}</h2>
        <div className="recipe-card-list">{entries.map((recipe) => <article className="recipe-card" key={recipe.recipeId}>
          {recipe.image ? <img className="recipe-card__image" src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipe.image.sizes ?? undefined} alt={recipe.image.alt} width={recipe.image.width} height={recipe.image.height} loading="lazy" decoding="async" /> : null}
          <p className="post-card__meta">{[recipe.timeTotalMin ? `${recipe.timeTotalMin} ${labels.minutes}` : null, recipe.difficulty].filter(Boolean).join(" · ")}</p>
          <h3><Link to={recipe.routePath}>{recipe.title}</Link></h3><p>{recipe.description}</p>
        </article>)}</div>
      </section> : null;
    })}
  </div></section>;
}
