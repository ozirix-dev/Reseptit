import { Link, useParams } from "react-router-dom";
import { articles, articlePath, blogRoot, type Article } from "./blog-data";
const imageSrc = (src: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${src}`;

export function BlogIndex() {
 return <section className="page-section"><div className="container blog-page">
 <div className="page-intro"><p className="eyebrow">Ruokaopas</p><h1>Ruokaopas</h1><p className="page-intro__description">Ruoanlaiton tekniikoita, reseptien taustoja ja lähteistettyä ravitsemustietoa.</p></div>
 <div className="blog-grid">{articles.map(post=><article key={post.slug} className="blog-card">
 <Link to={articlePath(post)}><img src={imageSrc(post.image)} alt={post.alt} width="1600" height="900" loading="lazy"/><h2>{post.title}</h2></Link>
 <p className="blog-meta">{post.category}</p><p>{post.description}</p>
 </article>)}</div></div></section>;
}
export function BlogArticle() {
 const {slug}=useParams();
 const article:Article|undefined=articles.find(p=>p.slug===slug);
 if(!article)return <section className="page-section"><div className="container container--narrow"><h1>Artikkelia ei löytynyt</h1><Link to={blogRoot}>Kaikki artikkelit</Link></div></section>;
 return <article className="page-section blog-article-page"><div className="container container--narrow blog-article">
 <nav aria-label="Murupolku"><Link to="/">Reseptit</Link> / <Link to={blogRoot}>Ruokaopas</Link></nav>
 <p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="blog-lead">{article.description}</p>
 <p className="blog-meta"><time dateTime={article.datePublished}>{new Intl.DateTimeFormat("fi-FI").format(new Date(article.datePublished+"T12:00:00Z"))}</time> · {article.author}</p>
 <figure><img src={imageSrc(article.image)} alt={article.alt} width="1600" height="900"/><figcaption>Havainnollistava kuvitus</figcaption></figure>
 {article.sections.map(section => (
   <section key={section.heading}>
     <h2>{section.heading}</h2>
     {section.text.map(text => <p key={text}>{text}</p>)}
     {section.points?.length ? <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul> : null}
     {section.furtherReading && (
       <p>Lisälukemista <a href={section.furtherReading.url}>{section.furtherReading.label}</a></p>
     )}
   </section>
 ))}
 {article.slug==="glykeeminen-indeksi-ja-kuorma"&&<p><Link to="/glykeeminen-kuorma/">Lue tarkka GK-menetelmä ja lähderajaukset</Link></p>}
 <section className="blog-sources"><h2>Lähteet ja lisätietoa</h2><ul>{article.sources.map(s=><li key={s.url}><a href={s.url} {...(s.url.startsWith("https:")?{target:"_blank",rel:"noopener noreferrer"}:{})}>{s.label}</a></li>)}</ul></section>
 {article.related.length ? <aside className="blog-related" aria-label="Aiheeseen liittyvät reseptit ja oppaat"><h2>Katso myös</h2><ul>{article.related.map(item=><li key={item.path}><Link to={item.path}>{item.title}</Link></li>)}</ul></aside> : null}
 <p><Link to={blogRoot}>← Takaisin Ruokaoppaaseen</Link></p></div></article>;
}
