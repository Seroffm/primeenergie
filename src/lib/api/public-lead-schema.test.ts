import { describe, expect, it } from "vitest";
import { publicLeadPayloadSchema } from "./public-lead-schema";

const validLead = {
  first_name: "Max",
  last_name: "Mustermann",
  email: "max@example.de",
  phone: "+49 171 1234567",
  customer_type: "private",
  product_type: "electricity",
  privacy_consent: true,
  contact_consent: true,
  address: { postal_code: "10115", city: "Berlin" },
  electricity: { annual_consumption_kwh: 2500, consumption_known: true },
  website: "",
};

describe("publicLeadPayloadSchema", () => {
  it("accepts a complete lead", () => {
    expect(publicLeadPayloadSchema.safeParse(validLead).success).toBe(true);
  });

  it("rejects invalid email and postal code", () => {
    const result = publicLeadPayloadSchema.safeParse({
      ...validLead,
      email: "invalid",
      address: { postal_code: "123", city: "Berlin" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(
      publicLeadPayloadSchema.safeParse({ ...validLead, website: "spam.example" }).success,
    ).toBe(false);
  });

  it("requires matching energy details", () => {
    expect(
      publicLeadPayloadSchema.safeParse({
        ...validLead,
        product_type: "both",
      }).success,
    ).toBe(false);
  });
});
