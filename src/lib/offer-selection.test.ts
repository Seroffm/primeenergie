import { describe, expect, it } from "vitest";
import { getOfferStartForQuickCalculator, resolveOfferSelection } from "./offer-selection";

describe("offer selection", () => {
  it("keeps gas selected for business requests", () => {
    const start = getOfferStartForQuickCalculator("gewerbe", "gas");
    expect(start).toBe("gas");
    expect(resolveOfferSelection(start, "gewerbe")).toEqual({
      energyType: "gas",
      customerType: "gewerbe",
    });
  });

  it("keeps legacy business links compatible with business electricity", () => {
    expect(resolveOfferSelection("gewerbe")).toEqual({
      energyType: "strom",
      customerType: "gewerbe",
    });
  });
});
