import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string({ required_error: "Name is required" }).max(32),
  slug: z.string({ required_error: "Slug is required" }).max(32),
});

export type CreateOrgData = z.infer<typeof createOrgSchema>;
