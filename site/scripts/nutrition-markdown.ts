export type PublishedNutritionValues = {
  carbs_net_per_serving_g: number;
  carbs_total_per_serving_g: number;
  protein_per_serving_g: number;
  fat_per_serving_g: number;
};

const keys = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;

export function updateNutritionFrontmatter(markdown: string, values: PublishedNutritionValues): string {
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)([\s\S]*)$/.exec(markdown);
  if (!match) throw new Error("Recipe Markdown has no valid YAML frontmatter");
  let frontmatter = match[2]!;
  for (const key of keys) {
    const value = values[key];
    if (!Number.isFinite(value) || value < 0 || Number(value.toFixed(2)) !== value) throw new Error(`Invalid two-decimal nutrition value for ${key}`);
    const expression = new RegExp(`^${key}:.*$`, "m");
    if (expression.test(frontmatter)) frontmatter = frontmatter.replace(expression, `${key}: ${value}`);
    else frontmatter += `${frontmatter.endsWith("\n") || frontmatter.length === 0 ? "" : "\n"}${key}: ${value}\n`;
  }
  return `${match[1]}${frontmatter}${match[3]}${match[4]}`;
}
