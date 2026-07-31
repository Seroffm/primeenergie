const ACTION_RE = /\[\[ACTION:([^|\]]+)\|([^\]]+)\]\]/g;
const ALLOWED_ACTION_PATHS = new Set(["/kontakt", "/ablauf", "/faq"]);

export function isAllowedChatActionHref(href: string): boolean {
  if (ALLOWED_ACTION_PATHS.has(href)) return true;
  if (!href.startsWith("/angebot")) return false;

  try {
    const url = new URL(href, "https://primeenergie.de");
    if (url.pathname !== "/angebot") return false;
    const allowedKeys = new Set(["start", "kunde"]);
    if ([...url.searchParams.keys()].some((key) => !allowedKeys.has(key))) return false;
    const start = url.searchParams.get("start");
    const customer = url.searchParams.get("kunde");
    return (
      (!start || ["strom", "gas", "beides", "gewerbe"].includes(start)) &&
      (!customer || ["privat", "gewerbe"].includes(customer))
    );
  } catch {
    return false;
  }
}

export function parseChatMessage(text: string): {
  body: string;
  actions: { label: string; href: string }[];
} {
  const actions: { label: string; href: string }[] = [];
  const body = text
    .replace(ACTION_RE, (_match, label: string, href: string) => {
      const normalizedHref = href.trim();
      if (isAllowedChatActionHref(normalizedHref)) {
        actions.push({ label: label.trim(), href: normalizedHref });
      }
      return "";
    })
    .trim();
  return { body, actions };
}
