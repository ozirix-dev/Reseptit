// Explicit network mode: GET only, no Search Console account operations.
import { siteContent } from "../src/generated/content.generated";
import { expectedPages, inspectPage, inspectDiscovery, inspectNotFound, siteBase } from "./seo-audit";

const findings: unknown[] = [];
let checked = 0;
const pages = expectedPages(siteContent.recipes);
const discovery: Record<string, string> = {};
for (const page of pages) {
  const response = await fetch(siteBase + page.route, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  checked++;
  if (response.status !== 200) findings.push({ route: page.route, status: response.status });
  else findings.push(...inspectPage(await response.text(), page));
  if (/noindex|none/i.test(response.headers.get("x-robots-tag") ?? "")) findings.push({ route: page.route, error: "HTTP header blocks indexing" });
}
for (const file of ["robots.txt", "sitemap.xml", "google0c6f9c0486376f0f.html", "v16-deliberately-missing-route/"]) {
  const response = await fetch(`${siteBase}/${file}`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  const body = await response.text();
  discovery[file] = body;
  const expected = file.startsWith("v16-") ? 404 : 200;
  if (response.status !== expected) findings.push({ file, status: response.status, expected });
  if (file.startsWith("google") && body.trim() !== `google-site-verification: ${file}`) findings.push({ file, error: "verification mismatch" });
  if (expected === 404) findings.push(...inspectNotFound(body));
}
findings.push(...inspectDiscovery(discovery["sitemap.xml"], discovery["robots.txt"], pages.map((p) => p.route)));
console.log(JSON.stringify({ mode: "public-GET", checked, findings, note: "HTTP availability does not prove Google ownership or indexing" }, null, 2));
if (findings.length) process.exitCode = 1;
