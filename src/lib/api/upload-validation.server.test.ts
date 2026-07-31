import { describe, expect, it } from "vitest";
import { hasValidFileSignature } from "./upload-validation.server";

describe("hasValidFileSignature", () => {
  it("recognizes supported file signatures", () => {
    expect(
      hasValidFileSignature("application/pdf", new TextEncoder().encode("%PDF-1.7").buffer),
    ).toBe(true);
    expect(
      hasValidFileSignature("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff, 0xe0]).buffer),
    ).toBe(true);
    expect(
      hasValidFileSignature(
        "image/png",
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer,
      ),
    ).toBe(true);
  });

  it("rejects spoofed content", () => {
    expect(
      hasValidFileSignature("application/pdf", new TextEncoder().encode("not a pdf").buffer),
    ).toBe(false);
    expect(hasValidFileSignature("image/jpeg", new Uint8Array([0x89, 0x50, 0x4e]).buffer)).toBe(
      false,
    );
  });
});
