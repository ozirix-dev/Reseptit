import { Link, useParams } from "react-router-dom";
import { blogIndexPath, blogPosts, blogPostForRoute, type BlogPost } from "./blog-data";

function PostCard({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  return <article className="blog-card">
    <Link className="blog-card__link" to={post.routePath}>
      <img src={post.image} alt={post.imageAlt} width={1200} height={675} loading={eager ? "eager" : "lazy"} decoding="async" />
      <span className="blog-card__body">
        <span className="eyebrow">{post.category}</span>
        <h2>{post.title}</h2>
        <span className="blog-card__excerpt">{post.excerpt}</span>
        <span className="blog-card__meta">{post.readingMinutes} min lukuaika · {new Date(post.datePublished + "T12:00:00Z").toLocaleDateString("fi-FI", { timeZone: "UTC" })}</span>
      </span>
    </Link>
  </article>;
}

export function BlogIndexPage() {
  return <section className="page-section blog-index">
    <div className="container">
      <header className="page-intro blog-intro">
        <p className="eyebrow">Reseptit · Ruokaopas</p>
        <h1>Ruokaopas</h1>
        <p className="page-intro__description">Ruoan taustoja, leivonnan ja ruoanlaiton tekniikoita sekä ymmärrettävää ravitsemustietoa. Artikkelit täydentävät reseptejä – eivät korvaa niitä.</p>
      </header>
      <div className="blog-card-grid">{blogPosts.map((post, index) => <PostCard key={post.slug} post={post} eager={index === 0} />)}</div>
      <p className="blog-backlink">Etsitkö valmistusohjetta? <Link to="/">Selaa reseptejä</Link>.</p>
    </div>
  </section>;
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const post = blogPosts.find(item => item.slug === slug) ?? null;
  if (!post || !blogPostForRoute(post.routePath)) return <section className="page-section"><div className="container container--narrow"><h1>Artikkelia ei löytynyt</h1><p><Link to={blogIndexPath}>Takaisin Ruokaoppaaseen</Link></p></div></section>;
  return <article className="page-section blog-article">
    <div className="container container--narrow">
      <nav className="article-breadcrumbs" aria-label="Murupolku"><Link to="/">Reseptit</Link><span aria-hidden="true">/</span><Link to={blogIndexPath}>Ruokaopas</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <header className="blog-article__header">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="blog-article__lead">{post.excerpt}</p>
        <p className="blog-card__meta">{post.author} · {new Date(post.datePublished + "T12:00:00Z").toLocaleDateString("fi-FI", { timeZone: "UTC" })} · {post.readingMinutes} min lukuaika</p>
      </header>
      <figure className="blog-article__figure"><img src={post.image} alt={post.imageAlt} width={1200} height={675} /><figcaption>Havainnekuva. Artikkeli ei perustu toimituksen koekeittoon tai laboratoriomittaukseen.</figcaption></figure>
      <div className="blog-article__body">
        {post.sections.map(section => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.points ? <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul> : null}
        </section>)}
        <section className="blog-article__sources" aria-labelledby="blog-sources"><h2 id="blog-sources">Lähteet ja lisätietoa</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>
        <section className="blog-article__related" aria-labelledby="blog-related"><h2 id="blog-related">Jatka tästä</h2><ul>{post.related.map(item => <li key={item.path}><Link to={item.path}>{item.title}</Link></li>)}<li className="blog-article__all"><Link to={blogIndexPath}>Kaikki Ruokaoppaan artikkelit</Link></li></ul></section>
      </div>
    </div>
  </article>;
}
