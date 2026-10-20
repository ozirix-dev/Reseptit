import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getRecipeByPath, getRecipeTranslations } from "@/lib/content";
import { recipeLocaleName, recipeUi } from "./recipe-i18n";
import { formatIngredientAmount, nextServingCount } from "./servings";

export function RecipePage() {
  const { pathname } = useLocation();
  const recipe = getRecipeByPath(pathname);
  const [servings, setServings] = useState(recipe?.servings ?? 1);
  const labels = recipe ? recipeUi[recipe.locale] : recipeUi.fi;
  useEffect(() => { setServings(recipe?.servings ?? 1); }, [recipe?.recipeId, recipe?.locale]);
  if (!recipe) return <section className="page-section"><div className="container container--narrow"><h1>Reseptiä ei löytynyt</h1></div></section>;
  const translations = getRecipeTranslations(recipe);
  const numberLocale = { fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale];
  const nutritionItems = Object.entries(recipe.nutrition).filter(([, value]) => value !== null) as [keyof typeof recipe.nutrition, number][];
  return <article className="page-section recipe-page"><div className="container container--narrow">
    <nav className="article-breadcrumbs" aria-label={recipe.locale === "fi" ? "Murupolku" : "Breadcrumb"}><Link to={recipe.locale === "fi" ? "/" : `/${recipe.locale === "sv" ? "sv/recept" : `${recipe.locale}/recipes`}/`}>{labels.indexTitle}</Link><span aria-hidden="true">/</span><span>{recipe.title}</span></nav>
    {recipe.image ? <img className="recipe-image" src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipe.image.sizes ?? undefined} alt={recipe.image.alt} width={recipe.image.width} height={recipe.image.height} fetchPriority="high" decoding="async" /> : null}
    <header className="recipe-header"><p className="eyebrow">{labels.category[recipe.category]}</p><h1>{recipe.title}</h1><p className="article-excerpt">{recipe.description}</p>
      <div className="recipe-facts">{recipe.timeTotalMin ? <span>{recipe.timeTotalMin} {labels.minutes}</span> : null}{recipe.difficulty ? <span>{labels.difficulty}: {recipe.difficulty}</span> : null}</div>
      {translations.length > 1 ? <nav className="recipe-languages" aria-label="Language">{translations.map((entry) => <Link key={entry.locale} hrefLang={entry.locale} aria-current={entry.locale === recipe.locale ? "page" : undefined} to={entry.routePath}>{recipeLocaleName(entry.locale)}</Link>)}</nav> : null}
    </header>
    <div className="recipe-layout">
      <section className="recipe-panel" aria-labelledby="recipe-ingredients-title"><div className="recipe-panel__heading"><h2 id="recipe-ingredients-title">{labels.ingredients}</h2><div className="serving-control"><span>{labels.servings}</span><button type="button" aria-label={labels.decrease} disabled={servings <= 1} onClick={() => setServings((value) => nextServingCount(value, -1))}>−</button><output aria-live="polite">{servings}</output><button type="button" aria-label={labels.increase} onClick={() => setServings((value) => nextServingCount(value, 1))}>+</button></div></div>
        <ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.item}-${index}`}><span>{ingredient.amount === null ? "" : `${formatIngredientAmount(ingredient.amount, servings, recipe.servings, numberLocale)}${ingredient.unit ? ` ${ingredient.unit}` : ""} `}{ingredient.item}</span>{ingredient.note ? <span className="ingredient-note">{ingredient.note}</span> : null}</li>)}</ul>
      </section>
      <section className="recipe-panel"><h2>{labels.instructions}</h2><div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.instructionsHtml }} /></section>
      {nutritionItems.length ? <section className="recipe-panel"><h2>{labels.nutrition}</h2><dl className="nutrition-list">{nutritionItems.map(([key, value]) => <div key={key}><dt>{labels.nutrients[key]}</dt><dd>{formatIngredientAmount(value, 1, 1, numberLocale)} g</dd></div>)}</dl></section> : null}
      {recipe.notesHtml ? <section className="recipe-panel"><h2>{labels.notes}</h2><div className="rich-text" dangerouslySetInnerHTML={{ __html: recipe.notesHtml }} /></section> : null}
    </div>
  </div></article>;
}
