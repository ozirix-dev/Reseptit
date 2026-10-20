import { parse } from "yaml";

export function parseMarkdown(text: string): { data: Record<string, unknown>; content: string } | null {
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) return null;
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Recipe frontmatter must be a YAML object.");
  return { data: data as Record<string, unknown>, content: text.slice(match[0].length) };
}
