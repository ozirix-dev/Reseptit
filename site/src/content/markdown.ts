import { parse } from "yaml";
import { marked, Renderer } from "marked";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function safeHref(value: string): string | null {
  const candidate = value.trim().replace(/[\u0000-\u0020\u007f]/g, "");
  if (!candidate || candidate.startsWith("//") || candidate.startsWith("\\\\")) return null;
  try {
    const parsed = new URL(candidate, "https://recipes.invalid/");
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return null;
    return candidate;
  } catch {
    return null;
  }
}

export async function renderSafeMarkdown(source: string): Promise<string> {
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeHtml(text);
  renderer.link = function ({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    const safeUrl = safeHref(href);
    if (!safeUrl) return label;
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    const external = /^https?:/i.test(safeUrl) ? ' rel="noopener noreferrer"' : "";
    return `<a href="${escapeHtml(safeUrl)}"${titleAttribute}${external}>${label}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    const safeUrl = safeHref(href);
    if (!safeUrl) return escapeHtml(text);
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${escapeHtml(safeUrl)}" alt="${escapeHtml(text)}"${titleAttribute} loading="lazy" decoding="async">`;
  };
  return await marked.parse(source, { renderer });
}

export function parseMarkdown(text: string): { data: Record<string, unknown>; content: string } | null {
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) return null;
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Recipe frontmatter must be a YAML object.");
  return { data: data as Record<string, unknown>, content: text.slice(match[0].length) };
}
