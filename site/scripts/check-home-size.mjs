import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const dist = new URL("../dist/", import.meta.url);
const html = await readFile(new URL("index.html", dist));
const urls = [...html.toString("utf8").matchAll(
  /<(?:script\b(?=[^>]*\btype="module")|link\b(?=[^>]*\brel="modulepreload"))[^>]*\b(?:src|href)="([^"]+)"/g,
)].map(match => match[1]);
if (!urls.length) throw new Error("No JavaScript entry points in the prerendered home page");

const gzipBytes = bytes => gzipSync(bytes, { level: 9 }).length;
let jsRaw = 0;
let jsGzip = 0;
for (const url of new Set(urls)) {
  const path = /^\/(?:Reseptit\/)?(assets\/[\w.-]+\.js)$/.exec(url)?.[1];
  if (!path) throw new Error("Unexpected home page JavaScript URL: " + url);
  const bytes = await readFile(new URL(path, dist));
  jsRaw += bytes.length;
  jsGzip += gzipBytes(bytes);
}

const htmlBudget = 32_000;
const jsBudget = 220_000;
const htmlGzip = gzipBytes(html);
console.log(JSON.stringify({ homeHtml: { raw: html.length, gzip: htmlGzip, budget: htmlBudget },
  homeJavaScript: { raw: jsRaw, gzip: jsGzip, budget: jsBudget } }));
if (htmlGzip > htmlBudget || jsGzip > jsBudget) {
  throw new Error("Home page HTML or initial JavaScript exceeds the gzip size budget");
}
