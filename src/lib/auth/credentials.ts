import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(254),
  password: z
    .string()
    .min(1)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password is too long.",
    ),
});
