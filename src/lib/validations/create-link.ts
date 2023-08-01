import { z } from "zod";

export const createLinkSchema = z.object({
  url: z.string().min(1).url(),
});

export type CreateLinkData = z.infer<typeof createLinkSchema>;
