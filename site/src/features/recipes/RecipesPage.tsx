import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRecipes } from "@/lib/content";
import type { RecipeEntry, RecipeLocale } from "@/types/content";
import { recipeUi } from "./recipe-i18n";
import { emptyRecipeFilters, filterRecipes, parseRecipeFilters, recipeFiltersToSearch, type RecipeCategory, type RecipeDietFilter, type RecipeFilters } from "./recipe-search";

const categories: RecipeEntry["category"][] = ["alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"];

export function RecipesPage({ locale }: { locale: RecipeLocale }) {
  const recipes = getRecipes(locale);
  const labels = recipeUi[locale];
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<RecipeFilters>(emptyRecipeFilters);
  const availableCategories = categories.filter((category) => recipes.some((recipe) => recipe.category === category));
  const hasDietClasses = recipes.some((recipe) => recipe.dietClass !== null);
  const hasKetoRecipes = recipes.some((recipe) => recipe.dietClass === "keto");
  const availableDiets: RecipeDietFilter[] = [
    ...(hasKetoRecipes ? ["keto" as const] : []),
    ...(hasDietClasses ? ["vhh" as const] : []),
  ];

  // Start from the prerendered default state, then read query parameters after hydration.
  useEffect(() => {
    setFilters(parseRecipeFilters(location.search, ["all", ...availableCategories], availableDiets));
  }, [location.search]);

  function updateFilters(patch: Partial<RecipeFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    const search = recipeFiltersToSearch(next);
    navigate(`${location.pathname}${search}`, { replace: true });
  }

  function resetFilters() {
    setFilters(emptyRecipeFilters);
    navigate(location.pathname, { replace: true });
  }

  const filteredRecipes = filterRecipes(recipes, filters, locale);
  const hasActiveFilters = filters.query !== "" || filters.category !== "all" || filters.diet !== "all";

  return <section className="page-section recipe-index"><div className="container recipe-index__container">
    <div className="page-intro"><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.indexTitle}</h1><p className="page-intro__description">{labels.intro}</p></div>
    <form className="recipe-filters" role="search" aria-label={labels.search} onSubmit={(event) => event.preventDefault()}>
      <div className="recipe-search-field">
        <label htmlFor="recipe-search">{labels.search}</label>
        <div className="recipe-search-field__control">
          <input id="recipe-search" type="search" value={filters.query} placeholder={labels.searchPlaceholder} onChange={(event) => updateFilters({ query: event.currentTarget.value })} />
          {filters.query ? <button type="button" className="recipe-search-field__clear" onClick={() => updateFilters({ query: "" })}>{labels.clearSearch}</button> : null}
        </div>
      </div>
      <div className="recipe-filter-select">
        <label htmlFor="recipe-category">{labels.categoryFilter}</label>
        <select id="recipe-category" value={filters.category} onChange={(event) => updateFilters({ category: event.currentTarget.value as RecipeCategory })}>
          <option value="all">{labels.allCategories}</option>
          {availableCategories.map((category) => <option key={category} value={category}>{labels.category[category]}</option>)}
        </select>
      </div>
      {hasDietClasses ? <div className="recipe-filter-select">
        <label htmlFor="recipe-diet">{labels.dietFilter}</label>
        <select id="recipe-diet" value={filters.diet} onChange={(event) => updateFilters({ diet: event.currentTarget.value as RecipeDietFilter })}>
          <option value="all">{labels.allDiets}</option>
          {hasKetoRecipes ? <option value="keto">{labels.keto}</option> : null}
          <option value="vhh">{labels.vhh}</option>
        </select>
      </div> : null}
      {hasActiveFilters && filteredRecipes.length > 0 ? <button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button> : null}
    </form>
    <p className="recipe-result-count" role="status" aria-live="polite" aria-atomic="true">{labels.results(filteredRecipes.length)}</p>
    {hasActiveFilters ? <p className="recipe-active-filters">{[
      filters.query ? `“${filters.query}”` : null,
      filters.category !== "all" ? labels.category[filters.category] : null,
      filters.diet === "keto" ? labels.keto : filters.diet === "vhh" ? labels.vhh : null,
    ].filter(Boolean).join(" · ")}</p> : null}
    {filteredRecipes.length ? <div className="recipe-card-grid">{filteredRecipes.map((recipe, index) => <RecipeCard key={`${recipe.recipeId}-${recipe.locale}`} recipe={recipe} index={index} locale={locale} />)}</div>
      : <div className="recipe-empty-state"><p>{labels.noResults}</p><button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button></div>}
  </div></section>;
}

function RecipeCard({ recipe, index, locale }: { recipe: RecipeEntry; index: number; locale: RecipeLocale }) {
  const labels = recipeUi[locale];
  const dietLabel = recipe.dietClass === "keto" ? labels.keto : recipe.dietClass ? labels.vhh : null;
  const meta = [recipe.timeTotalMin ? `${recipe.timeTotalMin} ${labels.minutes}` : null, recipe.difficulty].filter(Boolean).join(" · ");
  return <article className="recipe-card">
    <Link className="recipe-card__link" to={recipe.routePath}>
      {recipe.image ? <img className="recipe-card__image" src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipe.image.sizes ?? undefined} alt={recipe.image.alt} width={recipe.image.width} height={recipe.image.height} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} decoding="async" />
        : <span className="recipe-card__image recipe-card__image--placeholder" aria-hidden="true" />}
      <span className="recipe-card__content">
        <span className="recipe-card__badges"><span className="recipe-card__category">{labels.category[recipe.category]}</span>{dietLabel ? <span className="recipe-card__diet">{dietLabel}</span> : null}</span>
        {meta ? <span className="recipe-card__meta">{meta}</span> : null}
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <span className="recipe-card__description">{recipe.description}</span>
      </span>
    </Link>
  </article>;
}
