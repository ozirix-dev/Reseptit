import { z } from "zod";

export const recipeFrontmatterSchema = z.object({
  title: z.string().min(1),
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  url_slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["alkuruoka", "paaruoka", "jalkiruoka"]),
  language: z.enum(["fi", "en", "sv", "th"]),
  status: z.enum(["draft", "published"]),
  ingredients: z.array(z.object({
    amount: z.number().nullable(),
    unit: z.string().default(""),
    item: z.string().min(1),
    note: z.string().optional(),
  })).min(1),
  servings: z.number().int().positive(),
  time_total_min: z.number().positive().nullable().optional(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).default([]),
  carbs_net_per_serving_g: z.number().nonnegative().nullable().optional(),
  carbs_total_per_serving_g: z.number().nonnegative().nullable().optional(),
  protein_per_serving_g: z.number().nonnegative().nullable().optional(),
  fat_per_serving_g: z.number().nonnegative().nullable().optional(),
});
