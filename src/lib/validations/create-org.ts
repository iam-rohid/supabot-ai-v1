import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(1).max(32),
  slug: z.string().min(1).max(32),
});

export type CreateOrgData = z.infer<typeof createOrgSchema>;
