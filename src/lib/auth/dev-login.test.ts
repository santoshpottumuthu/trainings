import { describe, expect, it } from "vitest";
import { isDevelopmentLoginEnabled } from "./dev-login";

describe("isDevelopmentLoginEnabled", () => {
  it("is disabled unless explicitly enabled", () => {
    expect(
      isDevelopmentLoginEnabled({ nodeEnv: "development", enabled: "false" }),
    ).toBe(false);
    expect(
      isDevelopmentLoginEnabled({ nodeEnv: "production", enabled: undefined }),
    ).toBe(false);
  });

  it("allows explicit development use and rejects production use", () => {
    expect(
      isDevelopmentLoginEnabled({ nodeEnv: "development", enabled: "true" }),
    ).toBe(true);
    expect(() =>
      isDevelopmentLoginEnabled({ nodeEnv: "production", enabled: "true" }),
    ).toThrow(/only allowed in development/);
  });
});
