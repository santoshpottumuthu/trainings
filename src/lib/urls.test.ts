import { describe, expect, it } from "vitest";
import { asSafeHttpsUrl } from "./urls";

describe("asSafeHttpsUrl", () => {
  it("accepts an HTTPS link", () => {
    expect(asSafeHttpsUrl("https://example.com/notebook")).toBe(
      "https://example.com/notebook",
    );
  });

  it.each([
    "http://example.com",
    "javascript:alert(1)",
    "https://user:password@example.com",
    "not a URL",
  ])("rejects unsafe or invalid link %s", (value) => {
    expect(asSafeHttpsUrl(value)).toBeNull();
  });
});
