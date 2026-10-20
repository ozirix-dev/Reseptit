import { createBrowserRouter, Link, Outlet } from "react-router-dom";
import { RecipePage } from "@/features/recipes/RecipePage";
import { RecipesPage } from "@/features/recipes/RecipesPage";
import { getRecipes } from "@/lib/content";
import { SeoMeta } from "@/SeoMeta";

function SiteLayout() {
  const hasEnglish = getRecipes("en").length > 0;
  const hasSwedish = getRecipes("sv").length > 0;
  const hasThai = getRecipes("th").length > 0;
  return (
    <div className="site-shell">
      <SeoMeta />
      <a className="skip-link" href="#main">Siirry sisältöön</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="site-brand" to="/" aria-label="Reseptit, etusivu"><span className="site-brand__mark" aria-hidden="true">R</span><span><strong>Reseptit</strong><small>Selkeitä reseptejä arkeen</small></span></Link>
          <nav className="site-nav" aria-label="Kielet">
            <Link to="/" lang="fi">Suomi</Link>
            {hasEnglish ? <Link to="/en/recipes/" lang="en">English</Link> : null}
            {hasSwedish ? <Link to="/sv/recept/" lang="sv">Svenska</Link> : null}
            {hasThai ? <Link to="/th/recipes/" lang="th">ไทย</Link> : null}
          </nav>
        </div>
      </header>
      <main id="main" className="site-main"><Outlet /></main>
      <footer className="site-footer"><div className="container">Reseptit · Ozirix</div></footer>
    </div>
  );
}

function NotFoundPage() {
  return <section className="page-section"><div className="container container--narrow"><h1>Sivua ei löytynyt</h1><p><Link to="/">Takaisin resepteihin</Link></p></div></section>;
}

export const router = createBrowserRouter([
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
], { basename: import.meta.env.BASE_URL });
