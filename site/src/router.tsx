import { createBrowserRouter, createMemoryRouter, Link, Outlet, useLocation, type RouteObject } from "react-router-dom";
import { RecipePage } from "@/features/recipes/RecipePage";
import { RecipeAbout } from "@/features/recipes/recipe-tools";
import { RecipesPage } from "@/features/recipes/RecipesPage";
import { GlycemicLoadPilotPage } from "@/features/glycemic-load/GlycemicLoadPilotPage";
import { recipeIndexPath, recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { useContent } from "@/lib/content";
import { loadContent } from "@/lib/load-content";
import type { RouteContent } from "@/content/route-data";
import { SeoMeta } from "@/SeoMeta";

function SiteLayout() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const { locales: availableLocales } = useContent();
  return (
    <div className="site-shell">
      <SeoMeta />
      <a className="skip-link" href="#main">{labels.skipToContent}</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="site-brand" to={recipeIndexPath(locale)} aria-label={labels.brandHome}><span className="site-brand__mark" aria-hidden="true">{labels.brand.slice(0, 1)}</span><span><strong>{labels.brand}</strong><small>{labels.tagline}</small></span></Link>
          {availableLocales.length > 1 ? <nav className="site-nav" aria-label={labels.languages}>
            {availableLocales.includes("fi") ? <Link to="/" lang="fi" aria-current={locale === "fi" && !pathname.replace(/\/$/, "").endsWith("/glykeeminen-kuorma") ? "page" : undefined}>Suomi</Link> : null}
            {availableLocales.includes("en") ? <Link to="/en/recipes/" lang="en" aria-current={locale === "en" ? "page" : undefined}>English</Link> : null}
            {availableLocales.includes("sv") ? <Link to="/sv/recept/" lang="sv" aria-current={locale === "sv" ? "page" : undefined}>Svenska</Link> : null}
            {availableLocales.includes("th") ? <Link to="/th/recipes/" lang="th" aria-current={locale === "th" ? "page" : undefined}>ไทย</Link> : null}
            <Link to="/glykeeminen-kuorma/" lang="fi" aria-current={pathname.replace(/\/$/, "") === "/glykeeminen-kuorma" ? "page" : undefined}>GL-pilotti</Link>
          </nav> : null}
        </div>
      </header>
      <main id="main" className="site-main"><Outlet /></main>
      <footer className="site-footer"><div className="container"><p>{labels.footer}</p><RecipeAbout locale={locale} /></div></footer>
    </div>
  );
}

function NotFoundPage() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  return <section className="page-section"><div className="container container--narrow"><h1>{labels.notFound}</h1><p><Link to={recipeIndexPath(locale)}>{labels.backToRecipes}</Link></p></div></section>;
}

function ContentError() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const text = {
    fi: ["Sisällön lataaminen epäonnistui", "Yritä uudelleen"],
    en: ["Could not load this page", "Try again"],
    sv: ["Sidan kunde inte laddas", "Försök igen"],
    th: ["โหลดเนื้อหาไม่สำเร็จ", "ลองอีกครั้ง"],
  }[locale];
  return <main className="container" lang={locale}><h1>{text[0]}</h1><a href={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${pathname}`}>{text[1]}</a></main>;
}

export const siteRoutes: RouteObject[] = [
  {
    id: "content",
    path: "/",
    loader: loadContent,
    shouldRevalidate: ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname,
    element: <SiteLayout />,
    errorElement: <ContentError />,
    children: [
      { index: true, element: <RecipesPage locale="fi" /> },
      { path: "glykeeminen-kuorma", element: <GlycemicLoadPilotPage /> },
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

export function createSiteRouter(initial: RouteContent) {
  return createBrowserRouter(siteRoutes, { basename: import.meta.env.BASE_URL, hydrationData: { loaderData: { content: initial } } });
}

export function createStaticRouter(route: string, initial: RouteContent) {
  return createMemoryRouter(siteRoutes, {
    basename: import.meta.env.BASE_URL,
    hydrationData: { loaderData: { content: initial } },
    initialEntries: [`${import.meta.env.BASE_URL.replace(/\/$/, "")}${route}`],
  });
}
