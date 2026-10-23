import assert from "node:assert/strict";
import test from "node:test";
import { renderSafeMarkdown, renderInstructionSteps } from "../src/content/markdown";

test("raw HTML is escaped and unsafe link and image URLs are removed", async () => {
  const html = await renderSafeMarkdown([
    '<script>alert("x")</script>',
    '<img src=x onerror="alert(1)">',
    "[unsafe](javascript:alert%281%29)",
    "![unsafe](data:text/html,boom)",
    "[external](https://example.com/path)",
  ].join("\n\n"));
  assert.match(html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.doesNotMatch(html, /href="javascript:|src="data:|<[^>]*onerror=/i);
  assert.match(html, /rel="noopener noreferrer"/);
});

test("ordinary Markdown formatting and ordered steps render", async () => {
  const html = await renderSafeMarkdown("**Bold** and *emphasis*\n\n1. First\n2. Second\n\n[local](/Reseptit/)");
  assert.match(html, /<strong>Bold<\/strong>/);
  assert.match(html, /<em>emphasis<\/em>/);
  assert.match(html, /<ol>/);
  assert.match(html, /<a href="\/Reseptit\/">local<\/a>/);
});

test("step enhancement preserves Markdown and continuation lines and never discards surrounding advice", async () => {
  const steps = await renderInstructionSteps('1. **Mix** well.\n   Keep stirring.\n2. <script>bad()</script>');
  assert.equal(steps?.length, 2);
  assert.match(steps![0], /<strong>Mix<\/strong> well\.\nKeep stirring/);
  assert.doesNotMatch(steps![1], /<script>/);
  assert.equal(await renderInstructionSteps('Read first.\n\n1. Mix.\n2. Bake.'), null);
  assert.equal(await renderInstructionSteps('1. Mix.\n\n## Finish\n\nServe.'), null);
});
