import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { articles, articlePath, blogRoot, blogPosts } from "../src/features/blog/blog-data";
import { contentManifest } from "../src/generated/routes.generated";

const dist = path.resolve(import.meta.dirname, "../dist");

test("Ruokaopas publishes exactly two sourced Finnish pilot articles", () => {
  assert.equal(articles.length, 2);
  assert.equal(blogPosts.length, 2);
  assert.equal(new Set(articles.map(articlePath)).size, 2);
  for(const article of articles) {
    assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(articlePath(article), `/ruokaopas/${article.slug}/`);
    assert.ok(article.sources.length >= 2, article.slug);
    assert.ok(article.sections.length >= 4, article.slug);
    assert.ok(article.description.length > 40);
    assert.ok(article.datePublished && article.author);
    assert.ok(article.alt.length > 12);
  }
  const brioche = articles.find(post => post.slug === "briossisampylan-onnistuminen")!;
  assert.deepEqual(brioche.related.map(item => item.path), [
    "/briossisampylat-joshua-weissman/",
    "/hampurilaissampylat-moomie/",
    "/kevyet-briossisampylat-clever-carrot/",
  ]);
});

test("Ruokaopas URLs are prerendered, linked and sourced without JS", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const index = await readFile(path.join(dist, "ruokaopas", "index.html"), "utf8");
  assert.match(index, /<h1>Ruokaopas<\/h1>/);
  for (const route of [blogRoot, ...articles.map(articlePath)]) {
    assert.ok(contentManifest[route], `Missing content manifest ${route}`);
    assert.ok(sitemap.includes(`https://ozirix-dev.github.io/Reseptit${route}`));
  }
  for (const article of articles) {
    const route = articlePath(article);
    const html = await readFile(path.join(dist, route.slice(1), "index.html"), "utf8");
    assert.ok(html.includes(`<h1>${article.title}</h1>`));
    assert.ok(html.includes(`rel="canonical" href="https://ozirix-dev.github.io/Reseptit${route}"`));
    assert.ok(html.includes(`<script id="blog-jsonld" type="application/ld+json">`));
    assert.ok(html.includes("Lähteet ja lisätietoa"));
    assert.ok(html.includes(`alt="${article.alt}"`));
    for (const related of article.related) assert.ok(html.includes(`href="/Reseptit${related.path}"`), related.path);
    const asset = path.join(dist, article.image.replace(/^\//, ""));
    const body = await readFile(asset);
    if(article.image.endsWith(".svg")) {
      const svg = body.toString("utf8");
      assert.match(svg, /<svg\s/);
      assert.match(svg, /width="1600" height="900"/);
      assert.match(html, /Havainnollistava kuvitus/);
    } else {
      assert.match(article.image, /\.webp$/);
      const meta = await sharp(body).metadata();
      assert.ok(meta.width && meta.width >= 1200);
      assert.ok(meta.height && meta.width / meta.height > 1.76 && meta.width / meta.height < 1.79);
      assert.equal(meta.format, "webp");
    }
  }
});

test("Ruokaopas menu remains reachable across all four language indexes", async () => {
 for (const route of ["", "en/recipes", "sv/recept", "th/recipes"]) {
  const html = await readFile(path.join(dist, route, "index.html"), "utf8");
  assert.ok(html.includes('href="/Reseptit/ruokaopas/"'), route);
 }
});
