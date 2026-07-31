import { z } from "zod";

export const providerInputSchema = z.object({
  name: z.string().trim().min(2).max(150),
  energy_type: z.enum(["strom", "gas", "beide"]),
  rating: z.number().finite().min(0).max(5),
  is_partner: z.boolean(),
  is_active: z.boolean().optional(),
});

export const tariffInputSchema = z.object({
  provider_id: z.string().uuid(),
  name: z.string().trim().min(2).max(150),
  energy_type: z.enum(["strom", "gas"]),
  segment: z.enum(["privat", "gewerbe"]),
  price_per_kwh: z.number().finite().min(0).max(1000),
  base_price: z.number().finite().min(0).max(100_000),
  duration_months: z.number().int().min(0).max(120),
  price_guarantee_months: z.number().int().min(0).max(120),
  is_eco: z.boolean(),
  is_active: z.boolean().optional(),
});

export const emailTemplateInputSchema = z.object({
  name: z.string().trim().min(2).max(150),
  subject: z.string().trim().min(2).max(250),
  trigger_name: z.string().trim().min(2).max(150),
  body: z.string().max(50_000).optional(),
  is_active: z.boolean(),
});
