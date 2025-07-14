import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  categories: z.array(z.string().uuid()).optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const getNotesSchema = z.object({
  category: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  orderBy: z.enum(["createdAt", "title"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  category: z.string().optional(),
});
