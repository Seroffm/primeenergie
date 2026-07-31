import { describe, expect, it } from "vitest";
import { isAllowedChatActionHref, parseChatMessage } from "./chat-actions";

describe("chat actions", () => {
  it("allows only known internal destinations", () => {
    expect(isAllowedChatActionHref("/angebot?start=gas&kunde=gewerbe")).toBe(true);
    expect(isAllowedChatActionHref("/kontakt")).toBe(true);
    expect(isAllowedChatActionHref("https://example.com")).toBe(false);
    expect(isAllowedChatActionHref("javascript:alert(1)")).toBe(false);
    expect(isAllowedChatActionHref("/angebot?redirect=https://example.com")).toBe(false);
  });

  it("removes unsafe actions without losing the answer text", () => {
    const result = parseChatMessage(
      "Gerne.\n[[ACTION:Gas prüfen|/angebot?start=gas]]\n[[ACTION:Fremdseite|https://example.com]]",
    );

    expect(result.body).toBe("Gerne.");
    expect(result.actions).toEqual([{ label: "Gas prüfen", href: "/angebot?start=gas" }]);
  });
});
