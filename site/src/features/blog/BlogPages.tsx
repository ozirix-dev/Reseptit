import { Link, useParams } from "react-router-dom";
import { articles, articlePath, blogRoot, type Article } from "./blog-data";
const imageSrc = (src: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${src}`;

export function BlogIndex() {
 return <section className="page-section"><div className="container blog-page">
 <div className="page-intro"><p className="eyebrow">Ruokaopas</p><h1>Ruokaopas</h1><p className="page-intro__description">Ruoanlaiton tekniikoita ja luotettavaa ravitsemustietoa. Kaksi artikkelia katselmointipilotissa.</p></div>
 <div className="blog-grid">{articles.map(post=><article key={post.slug} className="blog-card">
 <Link to={articlePath(post)}><img src={imageSrc(post.image)} alt={post.alt} width="960" height="580" loading="lazy"/><h2>{post.title}</h2></Link>
 <p className="blog-meta">{post.category} · 6.11.2026</p><p>{post.description}</p>
 </article>)}</div></div></section>;
}
export function BlogArticle() {
 const {slug}=useParams();
 const article:Article|undefined=articles.find(p=>p.slug===slug);
 if(!article)return <section className="page-section"><div className="container container--narrow"><h1>Artikkelia ei löytynyt</h1><Link to={blogRoot}>Kaikki artikkelit</Link></div></section>;
 return <article className="page-section"><div className="container container--narrow blog-article">
 <nav aria-label="Murupolku"><Link to="/">Reseptit</Link> / <Link to={blogRoot}>Ruokaopas</Link></nav>
 <p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="blog-lead">{article.description}</p>
 <p className="blog-meta">6.11.2026 · Reseptit-toimitus</p>
 <figure><img src={imageSrc(article.image)} alt={article.alt} width="960" height="580"/><figcaption>Havainnollistava kuvitus, ei valokuva koepaistosta tai mittauksesta.</figcaption></figure>
 {article.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2>{s.text.map(t=><p key={t}>{t}</p>)}</section>)}
 {article.slug==="glykeeminen-indeksi-ja-kuorma"&&<p><Link to="/glykeeminen-kuorma/">Lue tarkka GK-menetelmä ja lähderajaukset</Link></p>}
 <section className="blog-sources"><h2>Lähteet</h2><ul>{article.sources.map(s=><li key={s.url}><a href={s.url} {...(s.url.startsWith("https:")?{target:"_blank",rel:"noopener noreferrer"}:{})}>{s.label}</a></li>)}</ul></section>
 <p><Link to={blogRoot}>← Takaisin Ruokaoppaaseen</Link></p></div></article>;
}
