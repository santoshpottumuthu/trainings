import { z } from "zod";

export const adminSeedSchema = z.object({
  ADMIN_USERNAME: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[a-zA-Z0-9._-]+$/),
  ADMIN_EMAIL: z.string().trim().email(),
  ADMIN_PASSWORD: z
    .string()
    .min(12)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "must be no more than 72 bytes for bcrypt",
    ),
});
