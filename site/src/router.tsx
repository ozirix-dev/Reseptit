import { createBrowserRouter, createMemoryRouter, Link, Outlet, ScrollRestoration, useLocation, type RouteObject } from "react-router-dom";
import { RecipeAbout } from "@/features/recipes/recipe-tools";
import { RecipeLibraryPage, RecipesPage } from "@/features/recipes/RecipesPage";
import { recipeLibraryPagePattern, recipeLibraryRoots } from "@/features/recipes/recipe-pagination";
import { recipeIndexPath, recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { isRecipavoHeroEnabled, recipavoHeroCopy } from "@/features/recipes/recipavo-hero";
import { useContent } from "@/lib/content";
import { loadContent } from "@/lib/load-content";
import type { RouteContent } from "@/content/route-data";
import { SeoMeta } from "@/SeoMeta";
import { SiteNavigation } from "@/SiteNavigation";
import { AnalyticsPrompt, PrivacyPage } from "@/features/privacy/Privacy";
import { privacyCopy, privacyEmail, privacyLocaleFromPath, privacyPaths } from "@/features/privacy/privacy-copy";
import type { RecipeLocale } from "@/types/content";

function SiteLayout() {
  const { pathname } = useLocation();
  const locale = privacyLocaleFromPath(pathname) ?? recipeLocaleFromPath(pathname);
  const labels = recipeUi[locale];
  const previewCopy = isRecipavoHeroEnabled() ? recipavoHeroCopy[locale] : null;
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
      <AnalyticsPrompt locale={locale} />
      <main id="main" className="site-main"><Outlet /></main>
      <footer className="site-footer"><div className="container"><p>{previewCopy?.footer ?? labels.footer}</p><p className="site-footer__contact"><Link to={privacyPaths[locale]}>{privacyCopy[locale].title}</Link><a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></p><RecipeAbout locale={locale} /></div></footer>
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

function RecipeLibraryRoute() {
  return useContent().pagination ? <RecipeLibraryPage /> : <NotFoundPage />;
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

const recipePage = async () => ({ Component: (await import("@/features/recipes/RecipePage")).RecipePage });
const glycemicLoadPage = async () => ({ Component: (await import("@/features/glycemic-load/GlycemicLoadPilotPage")).GlycemicLoadPilotPage });

const siteRoutes: RouteObject[] = [
  {
    id: "content",
    path: "/",
    loader: loadContent,
    shouldRevalidate: ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname,
    element: <SiteLayout />,
    errorElement: <ContentError />,
    children: [
      { index: true, element: <RecipesPage locale="fi" /> },
      { path: "glykeeminen-kuorma", lazy: glycemicLoadPage },
      { path: "ruokaopas", lazy: async () => ({ Component: (await import("@/features/blog/BlogPages")).BlogIndex }) },
      { path: "ruokaopas/:slug", lazy: async () => ({ Component: (await import("@/features/blog/BlogPages")).BlogArticle }) },
      { path: "en/glycemic-load", lazy: glycemicLoadPage },
      { path: "sv/glykemisk-belastning", lazy: glycemicLoadPage },
      { path: "th/glycemic-load", lazy: glycemicLoadPage },
      ...(Object.keys(privacyPaths) as RecipeLocale[]).map(locale => ({
        path: privacyPaths[locale].slice(1, -1),
        element: <PrivacyPage locale={locale} />,
      })),
      ...(Object.keys(recipeLibraryRoots) as RecipeLocale[]).flatMap(locale =>
        [recipeLibraryRoots[locale], recipeLibraryPagePattern(locale)].map(path => ({
          path: path.slice(1), element: <RecipeLibraryRoute />,
        }))),
      { path: ":slug", lazy: recipePage },
      { path: "en/recipes", element: <RecipesPage locale="en" /> },
      { path: "en/recipes/:slug", lazy: recipePage },
      { path: "sv/recept", element: <RecipesPage locale="sv" /> },
      { path: "sv/recept/:slug", lazy: recipePage },
      { path: "th/recipes", element: <RecipesPage locale="th" /> },
      { path: "th/recipes/:slug", lazy: recipePage },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

async function initializedRouter(router: ReturnType<typeof createBrowserRouter>) {
  // Keep the prerendered HTML visible while the initial route module loads.
  if (!router.state.initialized) await new Promise<void>(resolve => {
    const unsubscribe = router.subscribe(state => {
      if (!state.initialized) return;
      unsubscribe();
      resolve();
    });
  });
  return router;
}

export function createSiteRouter(initial: RouteContent) {
  return initializedRouter(createBrowserRouter(siteRoutes, { basename: import.meta.env.BASE_URL, hydrationData: { loaderData: { content: initial } } }));
}

export function createStaticRouter(route: string, initial: RouteContent) {
  return initializedRouter(createMemoryRouter(siteRoutes, {
    basename: import.meta.env.BASE_URL,
    hydrationData: { loaderData: { content: initial } },
    initialEntries: [`${import.meta.env.BASE_URL.replace(/\/$/, "")}${route}`],
  }));
}
