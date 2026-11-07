import { createBrowserRouter, createMemoryRouter, Link, Outlet, ScrollRestoration, useLocation, type RouteObject } from "react-router-dom";
import { RecipePage } from "@/features/recipes/RecipePage";
import { RecipeAbout } from "@/features/recipes/recipe-tools";
import { RecipesPage } from "@/features/recipes/RecipesPage";
import { GlycemicLoadPilotPage } from "@/features/glycemic-load/GlycemicLoadPilotPage";
import { recipeIndexPath, recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { isRecipavoHeroPreviewEnabled, recipavoHeroCopy } from "@/features/recipes/recipavo-hero";
import { useContent } from "@/lib/content";
import { loadContent } from "@/lib/load-content";
import type { RouteContent } from "@/content/route-data";
import { SeoMeta } from "@/SeoMeta";
import { BlogIndex, BlogArticle } from "@/features/blog/BlogPages";
import { SiteNavigation } from "@/SiteNavigation";

function SiteLayout() {
  const { pathname } = useLocation();
  const locale = recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const previewCopy = isRecipavoHeroPreviewEnabled() ? recipavoHeroCopy[locale] : null;
  const brand = previewCopy?.brand ?? labels.brand;
  const { locales: availableLocales, translations } = useContent();
  return (
    <div className="site-shell">
      <SeoMeta />
      <a className="skip-link" href="#main">{labels.skipToContent}</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="site-brand" to={recipeIndexPath(locale)} aria-label={previewCopy?.brandHome ?? labels.brandHome}><span className="site-brand__mark" aria-hidden="true">{brand.slice(0, 1)}</span><span><strong>{brand}</strong><small>{previewCopy?.tagline ?? labels.tagline}</small></span></Link>
          <SiteNavigation pathname={pathname} locale={locale} availableLocales={availableLocales} translations={translations} />
        </div>
      </header>
      <main id="main" className="site-main"><Outlet /></main>
      <footer className="site-footer"><div className="container"><p>{previewCopy?.footer ?? labels.footer}</p><RecipeAbout locale={locale} /></div></footer>
      <ScrollRestoration />
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
      { path: "ruokaopas", element: <BlogIndex /> },
      { path: "ruokaopas/:slug", element: <BlogArticle /> },
      { path: "en/glycemic-load", element: <GlycemicLoadPilotPage /> },
      { path: "sv/glykemisk-belastning", element: <GlycemicLoadPilotPage /> },
      { path: "th/glycemic-load", element: <GlycemicLoadPilotPage /> },
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
