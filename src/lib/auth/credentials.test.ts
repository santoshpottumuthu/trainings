import { describe, expect, it } from "vitest";
import { credentialsSchema } from "./credentials";

describe("credentialsSchema", () => {
  it("trims the login identifier and accepts a valid password", () => {
    const result = credentialsSchema.safeParse({
      username: " admin ",
      password: "a-secure-password",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("admin");
    }
  });

  it("rejects empty identifiers and passwords that exceed bcrypt's byte limit", () => {
    expect(
      credentialsSchema.safeParse({ username: " ", password: "password" })
        .success,
    ).toBe(false);
    expect(
      credentialsSchema.safeParse({
        username: "admin",
        password: "😀".repeat(19),
      }).success,
    ).toBe(false);
  });

  it("accepts a password exactly at bcrypt's byte limit", () => {
    expect(
      credentialsSchema.safeParse({
        username: "admin",
        password: "😀".repeat(18),
      }).success,
    ).toBe(true);
  });
});
