import { z } from "zod";

const localeSchema = z.enum(["fi", "en", "sv", "th"]);
const imagePathSchema = z.string().min(1).refine((value) =>
  !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && /^[a-z0-9][a-z0-9/_-]*\.webp$/i.test(value),
"Recipe image paths must be relative WebP files inside kuvat/.");

export const recipeFrontmatterSchema = z.object({
  title: z.string().min(1),
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url_slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen", "aamupala", "valipala"]),
  language: localeSchema,
  status: z.enum(["draft", "published"]),
  diet_class: z.enum(["keto", "vhh_tiukka", "vhh_valjempi"]).optional(),
  gluten_free: z.boolean().optional(),
  // Checked evidence is required whenever a recipe claims gluten-free status.
  gluten_free_review: z.object({
    evidence_ref: z.string().regex(/^docs\/reviews\/gluteeniton\/[a-z0-9-]+\.md$/),
    reviewed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reviewer: z.string().min(2),
  }).strict().optional(),
  main_ingredient: z.array(z.string()).optional(),
  cooking_method: z.array(z.string()).optional(),
  translation_languages: z.array(localeSchema).optional(),
  translation_status: z.partialRecord(localeSchema, z.enum(["draft", "published", "missing"])).optional(),
  source_language: localeSchema.optional(),
  source_recipe: z.string().optional(),
  translation_of: z.string().optional(),
  ingredients: z.array(z.object({
    amount: z.number().nullable(),
    unit: z.string().default(""),
    item: z.string().min(1),
    note: z.string().optional(),
  }).strict()).min(1),
  servings: z.number().int().positive(),
  time_total_min: z.number().positive().nullable().optional(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).default([]),
  carbs_net_per_serving_g: z.number().nonnegative().nullable().optional(),
  carbs_total_per_serving_g: z.number().nonnegative().nullable().optional(),
  protein_per_serving_g: z.number().nonnegative().nullable().optional(),
  fat_per_serving_g: z.number().nonnegative().nullable().optional(),
  image: z.object({
    src: imagePathSchema,
    alt: z.string().trim().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    sizes: z.string().optional(),
    srcset: z.array(z.object({ src: imagePathSchema, width: z.number().int().positive() }).strict()).optional(),
  }).strict().optional(),
}).strict().superRefine((data, ctx) => {
  if (data.gluten_free === true && !data.gluten_free_review) {
    ctx.addIssue({ code: "custom", message: "Gluten-free claims need a recipe-specific reviewed evidence record", path: ["gluten_free_review"] });
  }
  if (data.gluten_free_review && data.gluten_free !== true) {
    ctx.addIssue({ code: "custom", message: "Orphan gluten-free review metadata without an approved claim", path: ["gluten_free_review"] });
  }
});
