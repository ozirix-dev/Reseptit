import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { siteContent } from "../src/generated/content.generated";
import { contentForRoute, localeIndexes, serializeRouteContent } from "../src/content/route-data";
import { parseRouteContent } from "../src/lib/load-content";

test("each index contains only its language's summaries and no instructions", () => {
  for (const [locale, route] of Object.entries(localeIndexes)) {
    const data = contentForRoute(siteContent.recipes, route);
    assert.equal(data.recipes.length, siteContent.recipes.filter((r) => r.locale === locale).length);
    assert.ok(data.recipes.every((r) => r.locale === locale && !("instructionsHtml" in r) && !("nutrition" in r)));
    assert.equal(data.recipe, null);
    assert.deepEqual(parseRouteContent(data, route), data);
  }
});

test("recipe payload includes one complete recipe and lightweight published translation links", () => {
  const source = siteContent.recipes.find((r) => r.locale === "fi")!;
  const data = contentForRoute(siteContent.recipes, source.routePath);
  assert.deepEqual(data.recipe, source);
  assert.deepEqual(data.recipes, []);
  assert.ok(data.translations.every((r) => Object.keys(r).sort().join() === "locale,routePath"));
  const withoutThai = siteContent.recipes.filter((r) => !(r.recipeId === source.recipeId && r.locale === "th"));
  assert.equal(contentForRoute(withoutThai, source.routePath).translations.some((r) => r.locale === "th"), false);
  assert.equal(contentForRoute(siteContent.recipes, "/xx/recipes/missing/").recipe, null);
});

test("embedded JSON cannot terminate a script and corrupt data is rejected", () => {
  const data = contentForRoute(siteContent.recipes, "/");
  data.recipes[0] = { ...data.recipes[0], title: '</script><img src=x onerror="alert(1)">' };
  const serialized = serializeRouteContent(data);
  assert.doesNotMatch(serialized, /</);
  assert.deepEqual(JSON.parse(serialized), data);
  for (const invalid of [null, {}, { ...data, path: "/wrong/" }, { ...data, recipes: {} }, { ...data, recipe: {} }]) {
    assert.throws(() => parseRouteContent(invalid, "/"), /Invalid/);
  }
});

test("client source never imports the full generated content index", async () => {
  async function visit(dir: URL): Promise<void> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name === "generated") continue;
      const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir);
      if (entry.isDirectory()) await visit(url);
      else if (/\.tsx?$/.test(entry.name)) assert.doesNotMatch(await readFile(url, "utf8"), /from\s+["'][^"']*content\.generated/);
    }
  }
  await visit(new URL("../src/", import.meta.url));
});

test("variant changes invalidate route JSON hashes without moving recipe routes", async () => {
  const { createHash } = await import("node:crypto");
  const original = contentForRoute(siteContent.recipes, "/");
  const updated = structuredClone(original);
  updated.recipes[0].image!.srcSet += ", https://example.test/new.webp 200w";
  const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  assert.notEqual(hash(original), hash(updated));
  assert.equal(updated.path, original.path);
  assert.equal(updated.recipes[0].routePath, original.recipes[0].routePath);
});
