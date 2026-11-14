import { describe, expect, it } from "vitest";
import { adminSeedSchema } from "./admin-seed-schema";

describe("adminSeedSchema", () => {
  it("accepts a valid administrator configuration", () => {
    const result = adminSeedSchema.safeParse({
      ADMIN_USERNAME: "training-admin",
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "a-strong-administrator-password",
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing credentials, invalid identifiers, and bcrypt-overlong passwords", () => {
    expect(adminSeedSchema.safeParse({}).success).toBe(false);
    expect(
      adminSeedSchema.safeParse({
        ADMIN_USERNAME: "bad username",
        ADMIN_EMAIL: "not-an-email",
        ADMIN_PASSWORD: "short",
      }).success,
    ).toBe(false);
    expect(
      adminSeedSchema.safeParse({
        ADMIN_USERNAME: "training-admin",
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD: "😀".repeat(19),
      }).success,
    ).toBe(false);
  });
});
