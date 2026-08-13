import { z } from "zod";

const optionalShortText = z.string().trim().max(200).optional();
const optionalPositiveNumber = z.number().finite().nonnegative().max(10_000_000).optional();
const optionalIsoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Ungültiges Datum")
  .optional();

const energyPayloadSchema = z.object({
  annual_consumption_kwh: z.number().finite().nonnegative().max(10_000_000).nullable(),
  consumption_known: z.boolean().nullable(),
  current_provider: optionalShortText,
  monthly_payment: optionalPositiveNumber,
  contract_end_date: optionalIsoDate,
  price_guarantee: z.boolean().optional(),
});

const gasPayloadSchema = energyPayloadSchema.extend({
  hot_water_with_gas: z.boolean().nullable(),
  heating_type: optionalShortText,
  household_size: z.number().int().min(1).max(1000).optional(),
});

export const publicLeadPayloadSchema = z
  .object({
    first_name: z.string().trim().min(2).max(100),
    last_name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(5).max(50),
    customer_type: z.enum(["private", "business", "property_management", "multi_location_company"]),
    product_type: z.enum(["electricity", "gas", "both"]),
    privacy_consent: z.literal(true),
    contact_consent: z.literal(true),
    address: z.object({
      postal_code: z.string().regex(/^\d{5}$/),
      city: z.string().trim().min(2).max(100),
      street: z.string().trim().max(150).optional(),
    }),
    turnstile_token: z.string().max(4096).optional().default(""),
    electricity: energyPayloadSchema.optional(),
    gas: gasPayloadSchema.optional(),
    ziele: z.array(z.string().trim().max(100)).max(10).optional(),
    erreichbarkeit: z.string().trim().max(50).optional(),
    rechnung_dateiname: z.string().trim().max(500).optional(),
    rechnung_groesse_kb: z.number().finite().nonnegative().max(30_000).optional(),
    referral_code: z.string().trim().max(32).optional(),
    website: z.string().max(0).optional(),
  })
  .superRefine((payload, context) => {
    if (
      (payload.product_type === "electricity" || payload.product_type === "both") &&
      !payload.electricity
    ) {
      context.addIssue({ code: "custom", path: ["electricity"], message: "Stromangaben fehlen" });
    }
    if ((payload.product_type === "gas" || payload.product_type === "both") && !payload.gas) {
      context.addIssue({ code: "custom", path: ["gas"], message: "Gasangaben fehlen" });
    }
  });

export type ValidPublicLeadPayload = z.infer<typeof publicLeadPayloadSchema>;
