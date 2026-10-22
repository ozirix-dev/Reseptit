// Explicit network mode: GET only, no Search Console account operations.
import { siteContent } from "../src/generated/content.generated";
import { expectedPages, inspectPage, siteBase } from "./seo-audit";

const findings: unknown[] = [];
let checked = 0;
for (const page of expectedPages(siteContent.recipes)) {
  const response = await fetch(siteBase + page.route, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  checked++;
  if (response.status !== 200) findings.push({ route: page.route, status: response.status });
  else findings.push(...inspectPage(await response.text(), page));
}
for (const file of ["robots.txt", "sitemap.xml", "google0c6f9c0486376f0f.html", "v16-deliberately-missing-route/"]) {
  const response = await fetch(`${siteBase}/${file}`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
  const body = await response.text();
  const expected = file.startsWith("v16-") ? 404 : 200;
  if (response.status !== expected) findings.push({ file, status: response.status, expected });
  if (file.startsWith("google") && body.trim() !== `google-site-verification: ${file}`) findings.push({ file, error: "verification mismatch" });
  if (expected === 404 && !/noindex/.test(body)) findings.push({ file, error: "missing noindex" });
}
console.log(JSON.stringify({ mode: "public-GET", checked, findings, note: "HTTP availability does not prove Google ownership or indexing" }, null, 2));
if (findings.length) process.exitCode = 1;
