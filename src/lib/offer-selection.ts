export type OfferEnergy = "strom" | "gas" | "beides";
export type OfferAudience = "privat" | "gewerbe";
export type OfferStart = OfferEnergy | "gewerbe";

export function getOfferStartForQuickCalculator(
  audience: OfferAudience,
  energy: OfferEnergy,
): OfferStart {
  return audience === "gewerbe" && energy === "strom" ? "gewerbe" : energy;
}

export function resolveOfferSelection(start?: OfferStart, audience?: OfferAudience) {
  return {
    energyType: start === "gewerbe" ? "strom" : start,
    customerType:
      audience === "gewerbe" || start === "gewerbe"
        ? ("gewerbe" as const)
        : audience === "privat"
          ? ("privat" as const)
          : undefined,
  };
}
