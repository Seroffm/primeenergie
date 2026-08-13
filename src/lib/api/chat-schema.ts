import { z } from "zod";

const chatMessageSchema = z
  .object({
    id: z.string().max(200).optional(),
    role: z.enum(["user", "assistant"]),
    parts: z
      .array(
        z
          .object({
            type: z.literal("text"),
            text: z.string().trim().min(1).max(2_000),
          })
          .strict(),
      )
      .min(1)
      .max(3),
  })
  .strict();

export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(12),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.messages.at(-1)?.role !== "user") {
      context.addIssue({ code: "custom", path: ["messages"], message: "Letzte Nachricht fehlt" });
    }
  });
