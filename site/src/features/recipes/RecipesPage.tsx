import { recipeCardSizes } from "./image-layout";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContent } from "@/lib/content";
import type { RecipeLocale } from "@/types/content";
import { glycemicLoadPath, recipeUi } from "./recipe-i18n";
import { toolUi } from "./recipe-tools";
import { cuisines, ingredientGroups } from "@/content/recipe-facets";
import { emptyRecipeFilters, filterRecipes, parseRecipeFilters, recipeFiltersToSearch, type RecipeCategory, type RecipeDietFilter, type RecipeFilters, type GlycemicLoadFilterCategory } from "./recipe-search";
import { glycemicLoadFilterCategories } from "@/generated/glycemic-load-filters.generated";

import type { RecipeSummary } from "@/content/route-data";

const categories: RecipeSummary["category"][] = ["aamupala", "alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"];

export function RecipesPage({ locale }: { locale: RecipeLocale }) {
  const { recipes } = useContent();
  const labels = recipeUi[locale];
  const tools = toolUi[locale];
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<RecipeFilters>(emptyRecipeFilters);
  const [hydrated, setHydrated] = useState(false);
  const availableCategories = categories.filter((category) => recipes.some((recipe) => recipe.category === category));
  const hasDietClasses = recipes.some((recipe) => recipe.dietClass !== null);
  const hasKetoRecipes = recipes.some((recipe) => recipe.dietClass === "keto");
  const hasGlycemicLoad = recipes.some((recipe) => glycemicLoadFilterCategories[recipe.recipeId] !== undefined);
  const availableDiets: RecipeDietFilter[] = [
    ...(hasKetoRecipes ? ["keto" as const] : []),
    ...(hasDietClasses ? ["vhh" as const] : []),
  ];

  // Start from the prerendered default state, then read query parameters after hydration.
  useEffect(() => {
    setFilters(parseRecipeFilters(location.search, ["all", ...availableCategories], availableDiets));
    setHydrated(true);
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

  const filteredRecipes = filterRecipes(recipes, filters, locale, glycemicLoadFilterCategories);
  const activeFilters: Array<{ key: string; label: string; clear: Partial<RecipeFilters> }> = [];
  if (filters.query) activeFilters.push({ key: "query", label: `“${filters.query}”`, clear: { query: "" } });
  if (filters.category !== "all") activeFilters.push({ key: "category", label: labels.category[filters.category], clear: { category: "all" } });
  if (filters.diet !== "all") activeFilters.push({ key: "diet", label: filters.diet === "keto" ? labels.keto : labels.vhh, clear: { diet: "all" } });
  if (filters.maxTime) activeFilters.push({ key: "time", label: `${tools.time}: ${filters.maxTime} ${labels.minutes}`, clear: { maxTime: undefined } });
  if (filters.cuisine) activeFilters.push({ key: "cuisine", label: tools.cuisines[filters.cuisine as keyof typeof tools.cuisines], clear: { cuisine: undefined } });
  if (filters.ingredient) activeFilters.push({ key: "ingredient", label: tools.ingredients[filters.ingredient as keyof typeof tools.ingredients], clear: { ingredient: undefined } });
  if (filters.gl) {
    const glLabels: Record<GlycemicLoadFilterCategory, string> = { low: tools.lowGl, medium: tools.mediumGl, high: tools.highGl };
    activeFilters.push({ key: "gl", label: glLabels[filters.gl], clear: { gl: undefined } });
  }
  const hasActiveFilters = activeFilters.length > 0;

  return <section className="page-section recipe-index"><div className="container recipe-index__container">
    <div className="page-intro"><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.indexTitle}</h1><p className="page-intro__description">{labels.intro}</p></div>
    {hydrated ? <form className="recipe-filters" role="search" aria-label={labels.search} onSubmit={(event) => event.preventDefault()}>
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
      <details className="recipe-more-filters"><summary>{tools.moreFilters}</summary><div>
      <div className="recipe-filter-select"><label htmlFor="recipe-time">{tools.time}</label><select id="recipe-time" value={filters.maxTime ?? ""} onChange={(event) => updateFilters({ maxTime: Number(event.currentTarget.value) || undefined })}><option value="">{tools.anyTime}</option>{[30, 60, 90].map(time => <option key={time} value={time}>{time} {labels.minutes}</option>)}</select></div>
      <div className="recipe-filter-select"><label htmlFor="recipe-cuisine">{tools.cuisine}</label><select id="recipe-cuisine" value={filters.cuisine ?? ""} onChange={(event) => updateFilters({ cuisine: event.currentTarget.value || undefined })}><option value="">{tools.anyCuisine}</option>{cuisines.filter(cuisine => recipes.some(recipe => recipe.cuisine === cuisine)).map(cuisine => <option key={cuisine} value={cuisine}>{tools.cuisines[cuisine]}</option>)}</select></div>
      <div className="recipe-filter-select"><label htmlFor="recipe-ingredient">{tools.ingredient}</label><select id="recipe-ingredient" value={filters.ingredient ?? ""} onChange={(event) => updateFilters({ ingredient: event.currentTarget.value || undefined })}><option value="">{tools.anyIngredient}</option>{ingredientGroups.filter(group => recipes.some(recipe => recipe.ingredientGroups?.includes(group))).map(group => <option key={group} value={group}>{tools.ingredients[group]}</option>)}</select></div>
      {hasGlycemicLoad ? <div className="recipe-filter-select"><label htmlFor="recipe-gl">{tools.gl}</label><select id="recipe-gl" value={filters.gl ?? ""} onChange={(event) => updateFilters({ gl: (event.currentTarget.value || undefined) as GlycemicLoadFilterCategory | undefined })}><option value="">{tools.anyGl}</option><option value="low">{tools.lowGl}</option><option value="medium">{tools.mediumGl}</option><option value="high">{tools.highGl}</option></select></div> : null}
      </div></details>
      {hasActiveFilters && filteredRecipes.length > 0 ? <button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button> : null}
    </form> : <div className="recipe-filters recipe-filters--placeholder" aria-hidden="true">{[labels.search, labels.categoryFilter, ...(hasDietClasses ? [labels.dietFilter] : [])].map((label) => <div className="recipe-filter-select" key={label}><span className="placeholder-label">{label}</span><span className="placeholder-input" /></div>)}<details className="recipe-more-filters"><summary>{tools.moreFilters}</summary></details></div>}
    {hydrated && filters.diet !== "all" ? <p className="recipe-disclosure">{tools.diet}</p> : null}
    {hydrated && filters.gl ? <p className="recipe-disclosure recipe-gl-disclosure">{tools.glNote} <Link to={glycemicLoadPath(locale)}>{labels.glycemicLoadMethod}</Link></p> : null}
    {hydrated ? <p className="recipe-result-count" role="status" aria-live="polite" aria-atomic="true">{labels.results(filteredRecipes.length)}</p> : <p className="recipe-result-count recipe-result-placeholder" aria-hidden="true">{labels.results(recipes.length)}</p>}
    {hydrated && hasActiveFilters ? <div className="recipe-active-filters" aria-label={tools.activeFilters}>{activeFilters.map((chip) => <button key={chip.key} type="button" className="recipe-filter-chip" aria-label={`${tools.removeFilter}: ${chip.label}`} onClick={() => updateFilters(chip.clear)}>{chip.label}<span className="recipe-filter-chip__remove" aria-hidden="true">×</span></button>)}</div> : null}
    {!hydrated || filteredRecipes.length ? <div className="recipe-card-grid">{(hydrated ? filteredRecipes : recipes).map((recipe, index) => <RecipeCard key={`${recipe.recipeId}-${recipe.locale}`} recipe={recipe} index={index} locale={locale} />)}</div>
      : <div className="recipe-empty-state"><p>{labels.noResults}</p><button type="button" className="recipe-filter-reset" onClick={resetFilters}>{labels.resetFilters}</button></div>}
  </div></section>;
}

function RecipeCard({ recipe, index, locale }: { recipe: RecipeSummary; index: number; locale: RecipeLocale }) {
  const [imageFailed, setImageFailed] = useState(false);
  const labels = recipeUi[locale];
  const dietLabel = recipe.dietClass === "keto" ? labels.keto : recipe.dietClass ? labels.vhh : null;
  const meta = [recipe.timeTotalMin ? `${recipe.timeTotalMin} ${labels.minutes}` : null, recipe.difficulty].filter(Boolean).join(" · ");
  return <article className="recipe-card">
    <Link className="recipe-card__link" to={recipe.routePath}>
      {recipe.image && !imageFailed ? <img className="recipe-card__image" src={recipe.image.src} srcSet={recipe.image.srcSet ?? undefined} sizes={recipeCardSizes} alt={recipe.image.alt} width={recipe.image.width} height={recipe.image.height} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} decoding="async" onError={() => setImageFailed(true)} />
        : <span className="recipe-card__image recipe-card__image--placeholder">{labels.imageUnavailable}</span>}
      <span className="recipe-card__content">
        <span className="recipe-card__badges"><span className="recipe-card__category">{labels.category[recipe.category]}</span>{dietLabel ? <span className="recipe-card__diet">{dietLabel}</span> : null}</span>
        {meta ? <span className="recipe-card__meta">{meta}</span> : null}
        <h2 className="recipe-card__title">{recipe.title}</h2>
        <span className="recipe-card__description">{recipe.description}</span>
      </span>
    </Link>
  </article>;
}
