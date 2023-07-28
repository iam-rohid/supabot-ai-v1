import { z } from "zod";

export const createChatbotSchema = z.object({
  name: z.string({ required_error: "Name is required" }).max(80),
  slug: z.string({ required_error: "Slug is required" }).max(80),
  description: z.string().max(300).optional(),
});

export type CreateChatbotSchemaData = z.infer<typeof createChatbotSchema>;
