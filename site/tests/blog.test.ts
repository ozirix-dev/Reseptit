import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { blogPosts, blogRoutes, blogIndexPath, blogPostForRoute, blogJsonLd } from "../src/features/blog/blog-data";
import { contentManifest } from "../src/generated/routes.generated";

const dist = path.resolve(import.meta.dirname, "../dist");
test("pilot exposes exactly two distinct sourced Finnish articles and no unpublished queue", () => {
  assert.equal(blogPosts.length, 2);
  assert.deepEqual(blogRoutes, [blogIndexPath, ...blogPosts.map(post => post.routePath)]);
  assert.equal(new Set(blogRoutes).size, 3);
  for (const post of blogPosts) {
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(post.routePath, `/ruokaopas/${post.slug}/`);
    assert.equal(blogPostForRoute(post.routePath), post);
    assert.ok(post.sources.length >= 2);
    assert.ok(post.sections.length >= 4);
    assert.ok(post.image.startsWith("https://ozirix-dev.github.io/Reseptit/ruokaopas/images/"));
    assert.equal(blogJsonLd(post)["@type"], "BlogPosting");
  }
  assert.equal(blogPostForRoute("/ruokaopas/ei-ole/"), null);
});
test("blog URLs have independently prerendered article, metadata, real image and sitemap", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const index = await readFile(path.join(dist, "ruokaopas", "index.html"), "utf8");
  assert.match(index, /<h1>Ruokaopas<\/h1>/);
  assert.ok(index.includes("href=\"/Reseptit/ruokaopas/briossisampylan-onnistuminen/\""));
  for (const route of blogRoutes) {
    assert.ok(contentManifest[route], `Missing manifest route: ${route}`);
    assert.ok(sitemap.includes(`https://ozirix-dev.github.io/Reseptit${route}`));
  }
  for (const post of blogPosts) {
    const html = await readFile(path.join(dist, post.routePath.slice(1), "index.html"), "utf8");
    assert.ok(html.includes(`<h1>${post.title}</h1>`));
    assert.ok(html.includes(`<title>${post.seoTitle}</title>`));
    assert.ok(html.includes(`href="https://ozirix-dev.github.io/Reseptit${post.routePath}"`));
    assert.ok(html.includes(`src="${post.image}"`));
    const json = html.match(/<script id="blog-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(json, `No BlogPosting markup for ${post.slug}`);
    assert.deepEqual(JSON.parse(json[1]), blogJsonLd(post));
    assert.ok(html.includes("Lähteet ja lisätietoa"));
    const asset = path.join(dist, "ruokaopas", "images", post.image.split("/").at(-1)!);
    assert.match(await readFile(asset, "utf8"), /<svg\s/);
  }
});
test("all language recipe indexes expose the Finnish Ruokaopas menu, without touching recipe hero", async () => {
  for (const route of ["", "en/recipes", "sv/recept", "th/recipes"]) {
    const html = await readFile(path.join(dist, route, "index.html"), "utf8");
    assert.ok(html.includes('href="/Reseptit/ruokaopas/"'), route);
    assert.ok(html.includes(">Ruokaopas</a>"), route);
  }
});
