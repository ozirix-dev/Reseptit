import { z } from "zod";

const localeSchema = z.enum(["fi", "en", "sv", "th"]);
const imagePathSchema = z.string().min(1).refine((value) =>
  !value.startsWith("/") && !value.includes("\\") && !value.split("/").includes("..") && /^[a-z0-9][a-z0-9/_-]*\.webp$/i.test(value),
"Recipe image paths must be relative WebP files inside kuvat/.");

export const recipeFrontmatterSchema = z.object({
  title: z.string().min(1),
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url_slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen", "aamupala"]),
  language: localeSchema,
  status: z.enum(["draft", "published"]),
  diet_class: z.enum(["keto", "vhh_tiukka", "vhh_valjempi"]).optional(),
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
}).strict();
