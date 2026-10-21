import { createBrowserRouter, createMemoryRouter, Link, Outlet, useLocation, type RouteObject } from "react-router-dom";
import { RecipePage } from "@/features/recipes/RecipePage";
import { RecipesPage } from "@/features/recipes/RecipesPage";
import { recipeIndexPath, recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { getRecipes } from "@/lib/content";
import { SeoMeta } from "@/SeoMeta";

function SiteLayout() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const availableLocales = (["fi", "en", "sv", "th"] as const).filter((locale) => getRecipes(locale).length > 0);
  return (
    <div className="site-shell">
      <SeoMeta />
      <a className="skip-link" href="#main">{labels.skipToContent}</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="site-brand" to={recipeIndexPath(locale)} aria-label={labels.brandHome}><span className="site-brand__mark" aria-hidden="true">{labels.brand.slice(0, 1)}</span><span><strong>{labels.brand}</strong><small>{labels.tagline}</small></span></Link>
          {availableLocales.length > 1 ? <nav className="site-nav" aria-label={labels.languages}>
            {availableLocales.includes("fi") ? <Link to="/" lang="fi" aria-current={locale === "fi" ? "page" : undefined}>Suomi</Link> : null}
            {availableLocales.includes("en") ? <Link to="/en/recipes/" lang="en" aria-current={locale === "en" ? "page" : undefined}>English</Link> : null}
            {availableLocales.includes("sv") ? <Link to="/sv/recept/" lang="sv" aria-current={locale === "sv" ? "page" : undefined}>Svenska</Link> : null}
            {availableLocales.includes("th") ? <Link to="/th/recipes/" lang="th" aria-current={locale === "th" ? "page" : undefined}>ไทย</Link> : null}
          </nav> : null}
        </div>
      </header>
      <main id="main" className="site-main"><Outlet /></main>
      <footer className="site-footer"><div className="container">{labels.footer}</div></footer>
    </div>
  );
}

function NotFoundPage() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  return <section className="page-section"><div className="container container--narrow"><h1>{labels.notFound}</h1><p><Link to={recipeIndexPath(locale)}>{labels.backToRecipes}</Link></p></div></section>;
}

export const siteRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SiteLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <RecipesPage locale="fi" /> },
      { path: ":slug", element: <RecipePage /> },
      { path: "en/recipes", element: <RecipesPage locale="en" /> },
      { path: "en/recipes/:slug", element: <RecipePage /> },
      { path: "sv/recept", element: <RecipesPage locale="sv" /> },
      { path: "sv/recept/:slug", element: <RecipePage /> },
      { path: "th/recipes", element: <RecipesPage locale="th" /> },
      { path: "th/recipes/:slug", element: <RecipePage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export function createSiteRouter() {
  return createBrowserRouter(siteRoutes, { basename: import.meta.env.BASE_URL });
}

export function createStaticRouter(route: string) {
  return createMemoryRouter(siteRoutes, {
    basename: import.meta.env.BASE_URL,
    initialEntries: [`${import.meta.env.BASE_URL.replace(/\/$/, "")}${route}`],
  });
}
