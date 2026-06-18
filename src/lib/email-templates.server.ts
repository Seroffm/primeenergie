// ─── Shared Layout ───────────────────────────────────────────────────────────

const BRAND_GREEN = "#16a34a";
const BRAND_DARK = "#0f172a";
const BRAND_LIGHT = "#f0fdf4";

function layout(content: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EnergieClever</title>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>` : ""}
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND_DARK};padding:24px 32px;text-align:center;">
            <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
              ⚡ EnergieClever
            </span>
            <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">Ihr Energie-Vergleichsportal</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              EnergieClever · Ihr unabhängiger Energievergleich<br/>
              Bei Fragen antworten Sie einfach auf diese E-Mail.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND_GREEN};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;margin-top:8px;">${text}</a>`;
}

function infoBox(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:14px;color:#64748b;width:160px;">${label}</td>
    <td style="padding:8px 0;font-size:14px;font-weight:600;color:#0f172a;">${value}</td>
  </tr>`;
}

// ─── Template 1: Lead-Bestätigung (an Kunden) ────────────────────────────────

export interface LeadConfirmationData {
  firstName: string;
  lastName: string;
  leadNumber: string;
  productType: "electricity" | "gas" | "both";
}

const PRODUCT_LABEL: Record<string, string> = {
  electricity: "Strom",
  gas: "Gas",
  both: "Strom & Gas",
};

export function leadConfirmationTemplate(d: LeadConfirmationData): {
  subject: string;
  html: string;
} {
  const subject = `Ihre Anfrage ist eingegangen – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Ihre Anfrage ist eingegangen 🎉
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;">
      Hallo ${d.firstName} ${d.lastName},<br/><br/>
      vielen Dank für Ihre Anfrage! Wir haben Ihre Daten erhalten und werden uns
      so schnell wie möglich bei Ihnen melden — in der Regel innerhalb von 24 Stunden.
    </p>
    <table cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;width:100%;margin-bottom:24px;">
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoBox("Vorgangsnummer:", d.leadNumber)}
          ${infoBox("Produkt:", PRODUCT_LABEL[d.productType] ?? d.productType)}
        </table>
      </td></tr>
    </table>
    <p style="font-size:14px;color:#64748b;margin:0 0 8px;">
      <strong>Was passiert als Nächstes?</strong>
    </p>
    <ol style="font-size:14px;color:#475569;padding-left:20px;margin:0 0 24px;">
      <li style="margin-bottom:6px;">Unser Team prüft Ihre Anfrage</li>
      <li style="margin-bottom:6px;">Wir vergleichen die besten Tarife für Sie</li>
      <li style="margin-bottom:6px;">Sie erhalten Ihr persönliches Angebot per E-Mail</li>
    </ol>
    <p style="font-size:13px;color:#94a3b8;">
      Haben Sie noch Fragen? Antworten Sie einfach auf diese E-Mail.
    </p>`,
    "Ihre Anfrage wurde erfolgreich empfangen.",
  );
  return { subject, html };
}

// ─── Template 2: Interne Benachrichtigung (neuer Lead) ───────────────────────

export interface NewLeadInternalData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  leadNumber: string;
  productType: string;
  customerType: string;
  score: number;
  scoreLabel: "cold" | "warm" | "hot";
  leadId: string;
  appUrl: string;
}

const SCORE_BADGE: Record<string, string> = {
  cold: "🔵 Kalt",
  warm: "🟡 Warm",
  hot: "🔴 Heiß",
};

export function newLeadInternalTemplate(d: NewLeadInternalData): {
  subject: string;
  html: string;
} {
  const subject = `🆕 Neuer Lead: ${d.firstName} ${d.lastName} (${d.leadNumber})`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:20px;color:${BRAND_DARK};">
      Neuer Lead eingegangen
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;">
      Ein neuer Interessent hat das Formular ausgefüllt.
    </p>
    <table cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;width:100%;margin-bottom:20px;">
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoBox("Vorgangsnummer:", d.leadNumber)}
          ${infoBox("Name:", `${d.firstName} ${d.lastName}`)}
          ${infoBox("E-Mail:", d.email)}
          ${infoBox("Telefon:", d.phone ?? "–")}
          ${infoBox("Produkt:", PRODUCT_LABEL[d.productType] ?? d.productType)}
          ${infoBox("Score:", `${SCORE_BADGE[d.scoreLabel] ?? d.scoreLabel} (${d.score} Punkte)`)}
        </table>
      </td></tr>
    </table>
    <p style="text-align:center;margin:24px 0 0;">
      ${button("Lead im CRM öffnen", `${d.appUrl}/mitarbeiter/leads/${d.leadId}`)}
    </p>`,
    `Neuer Lead: ${d.firstName} ${d.lastName}`,
  );
  return { subject, html };
}

// ─── Template 3: Angebot versandt ────────────────────────────────────────────

export interface OfferSentData {
  firstName: string;
  leadNumber: string;
  productType: string;
  employeeName?: string | null;
}

export function offerSentTemplate(d: OfferSentData): {
  subject: string;
  html: string;
} {
  const subject = `Ihr persönliches Angebot wartet – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Ihr Angebot ist fertig ✨
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${d.firstName},<br/><br/>
      Ihr persönliches ${PRODUCT_LABEL[d.productType] ?? d.productType}-Angebot ist fertig!
      Unser Team hat die besten Tarife für Sie verglichen.
    </p>
    <div style="background:${BRAND_LIGHT};border-left:4px solid ${BRAND_GREEN};border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:600;color:${BRAND_DARK};">
        Vorgangs-Nr.: ${d.leadNumber}
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#475569;">
        Ihr persönlicher Berater ${d.employeeName ? `(${d.employeeName})` : ""} wird sich in Kürze bei Ihnen melden.
      </p>
    </div>
    <p style="font-size:14px;color:#475569;margin:0 0 24px;">
      Wenn Sie Fragen haben oder Ihren Termin verschieben möchten, antworten Sie einfach auf diese E-Mail.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Vielen Dank, dass Sie EnergieClever vertrauen!
    </p>`,
    "Ihr persönliches Energieangebot ist bereit.",
  );
  return { subject, html };
}

// ─── Template 4: Vertrag versandt ────────────────────────────────────────────

export interface ContractSentData {
  firstName: string;
  leadNumber: string;
  productType: string;
}

export function contractSentTemplate(d: ContractSentData): {
  subject: string;
  html: string;
} {
  const subject = `Ihr Vertrag wartet auf Ihre Unterschrift – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Ihr Vertrag ist bereit 📄
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${d.firstName},<br/><br/>
      Ihr ${PRODUCT_LABEL[d.productType] ?? d.productType}-Vertrag wurde vorbereitet und wartet auf
      Ihre Unterzeichnung. Ihr persönlicher Berater wird sich mit den Details bei Ihnen melden.
    </p>
    <div style="background:${BRAND_LIGHT};border:1px solid #86efac;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:${BRAND_DARK};">
        ✅ Angebot akzeptiert<br/>
        ✅ Bester Tarif ausgewählt<br/>
        ⏳ Vertrag zur Unterzeichnung bereit
      </p>
    </div>
    <p style="font-size:14px;color:#475569;margin:0 0 8px;">
      Vorgangs-Nr.: <strong>${d.leadNumber}</strong>
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Antworten Sie auf diese E-Mail, wenn Sie Fragen haben.
    </p>`,
    "Ihr Energievertrag ist zur Unterzeichnung bereit.",
  );
  return { subject, html };
}

// ─── Template 5: Wechsel abgeschlossen ───────────────────────────────────────

export interface CompletedData {
  firstName: string;
  lastName: string;
  leadNumber: string;
  productType: string;
}

export function completedTemplate(d: CompletedData): {
  subject: string;
  html: string;
} {
  const subject = `Ihr Energiewechsel ist abgeschlossen! 🎉 – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Herzlichen Glückwunsch, ${d.firstName}! 🎉
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Ihr ${PRODUCT_LABEL[d.productType] ?? d.productType}-Wechsel wurde erfolgreich abgeschlossen.
      Ab jetzt profitieren Sie von Ihrem neuen günstigeren Tarif.
    </p>
    <div style="background:${BRAND_LIGHT};border:1px solid #86efac;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-size:40px;">⚡</p>
      <p style="margin:8px 0 0;font-size:16px;font-weight:600;color:${BRAND_DARK};">
        Wechsel erfolgreich!
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#475569;">
        Vorgangs-Nr. ${d.leadNumber}
      </p>
    </div>
    <p style="font-size:14px;color:#475569;margin:0 0 16px;">
      Wir bedanken uns für Ihr Vertrauen in EnergieClever.
      Empfehlen Sie uns gerne an Freunde und Familie weiter!
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.
    </p>`,
    "Ihr Energiewechsel wurde erfolgreich abgeschlossen.",
  );
  return { subject, html };
}

// ─── Template 6: Rückfrage ────────────────────────────────────────────────────

export interface QuestionData {
  firstName: string;
  leadNumber: string;
  employeeName?: string | null;
  questionText?: string | null;
}

export function questionTemplate(d: QuestionData): {
  subject: string;
  html: string;
} {
  const subject = `Rückfrage zu Ihrer Anfrage – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Wir haben eine kurze Rückfrage
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${d.firstName},<br/><br/>
      für Ihre Anfrage (${d.leadNumber}) benötigen wir noch eine kurze Rückmeldung von Ihnen,
      damit wir das beste Angebot für Sie zusammenstellen können.
    </p>
    ${
      d.questionText
        ? `<div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:16px 20px;margin-bottom:24px;font-size:14px;color:#713f12;">
        ❓ ${d.questionText}
      </div>`
        : ""
    }
    <p style="font-size:14px;color:#475569;margin:0 0 8px;">
      Antworten Sie einfach auf diese E-Mail${d.employeeName ? ` oder sprechen Sie direkt mit ${d.employeeName}` : ""}.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Vielen Dank für Ihre Mitarbeit!
    </p>`,
    "Wir haben eine kurze Rückfrage zu Ihrer Anfrage.",
  );
  return { subject, html };
}

// ─── Template 7: Abgelehnt / Kein Angebot möglich ────────────────────────────

export interface RejectedData {
  firstName: string;
  leadNumber: string;
}

export function rejectedTemplate(d: RejectedData): {
  subject: string;
  html: string;
} {
  const subject = `Zu Ihrer Energie-Anfrage – ${d.leadNumber}`;
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Leider kein passendes Angebot
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${d.firstName},<br/><br/>
      wir haben Ihre Anfrage (${d.leadNumber}) geprüft, konnten aber leider kein
      für Sie wirtschaftlich sinnvolles Angebot finden.
    </p>
    <p style="font-size:14px;color:#475569;margin:0 0 16px;">
      Das kann verschiedene Gründe haben — beispielsweise einen bereits sehr guten
      bestehenden Tarif oder regionale Einschränkungen. Gerne können Sie in einigen
      Monaten erneut anfragen, wenn sich die Marktlage verändert hat.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Vielen Dank für Ihr Interesse an EnergieClever.
    </p>`,
    "Zu Ihrer Energie-Anfrage haben wir leider kein passendes Angebot.",
  );
  return { subject, html };
}

// ─── Template 8: Referral-Code ausgestellt (nach Vertragsabschluss) ──────────

export function referralCodeIssuedTemplate({
  firstName,
  referralCode,
  referralUrl,
}: {
  firstName: string;
  referralCode: string;
  referralUrl: string;
}): { subject: string; html: string } {
  const subject = "Ihr persönlicher Empfehlungs-Link ist bereit";
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Glückwunsch zu Ihrem Energiewechsel! 🎉
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${firstName},<br/><br/>
      Ihr Energiewechsel wurde erfolgreich abgeschlossen. Als Dankeschön haben Sie
      nun Ihren persönlichen Empfehlungs-Link. Teilen Sie ihn mit Freunden und Familie —
      und verdienen Sie für jeden abgeschlossenen Wechsel <strong>30 € als Amazon-Gutschein</strong>.
    </p>
    <div style="background:${BRAND_LIGHT};border:2px solid ${BRAND_GREEN};border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:0.05em;">
        Ihr persönlicher Code
      </p>
      <p style="margin:0 0 12px;font-size:32px;font-weight:700;color:${BRAND_DARK};letter-spacing:0.15em;font-family:monospace;">
        ${referralCode}
      </p>
      <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">
        ${referralUrl}
      </p>
    </div>
    <p style="font-size:14px;color:#475569;margin:0 0 16px;">
      <strong>So funktioniert's:</strong>
    </p>
    <ol style="font-size:14px;color:#475569;padding-left:20px;margin:0 0 24px;">
      <li style="margin-bottom:8px;">Teilen Sie Ihren Link per WhatsApp, E-Mail oder Social Media</li>
      <li style="margin-bottom:8px;">Ihr Freund füllt das Formular aus und schließt seinen Energiewechsel ab</li>
      <li style="margin-bottom:8px;">Nach 30 Tagen erhalten Sie einen 30-€-Amazon-Gutschein per E-Mail</li>
    </ol>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;font-size:13px;color:#64748b;">
      <strong>Bedingungen:</strong> Nur Neukunden (kein bestehender EnergieClever-Vertrag) zählen.
      Ihr Code ist 90 Tage gültig. Max. 5 Prämien pro Monat.
    </div>`,
    "Ihr persönlicher Empfehlungs-Link ist bereit.",
  );
  return { subject, html };
}

// ─── Template 9: Referral qualifiziert (Prämie verdient) ─────────────────────

export function referralQualifiedTemplate({
  firstName,
  referredFirstName,
  rewardAmount,
  payoutAfter,
}: {
  firstName: string;
  referredFirstName: string;
  rewardAmount: number;
  payoutAfter: string;
}): { subject: string; html: string } {
  const rewardEur = (rewardAmount / 100).toFixed(2).replace(".", ",");
  const payoutDate = new Date(payoutAfter).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const subject = "Sie haben eine Prämie verdient!";
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      🎉 Prämie verdient!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${firstName},<br/><br/>
      großartige Neuigkeit! <strong>${referredFirstName}</strong> hat seinen Energiewechsel
      über Ihren persönlichen Empfehlungs-Link erfolgreich abgeschlossen.
    </p>
    <div style="background:${BRAND_LIGHT};border:2px solid ${BRAND_GREEN};border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:13px;color:#475569;">Ihre Prämie</p>
      <p style="margin:0 0 8px;font-size:40px;font-weight:700;color:${BRAND_DARK};">
        ${rewardEur} €
      </p>
      <p style="margin:0;font-size:13px;color:#475569;">Amazon-Gutschein per E-Mail</p>
    </div>
    <table cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;width:100%;margin-bottom:24px;">
      <tr><td style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${infoBox("Auszahlung ab:", payoutDate)}
          ${infoBox("Prämienart:", "Amazon-Gutschein")}
        </table>
      </td></tr>
    </table>
    <p style="font-size:14px;color:#475569;margin:0 0 8px;">
      Ab dem <strong>${payoutDate}</strong> werden wir Ihnen den Gutschein per E-Mail zusenden.
      Wir melden uns dann bei Ihnen — Sie müssen nichts weiter tun.
    </p>
    <p style="font-size:13px;color:#94a3b8;margin:0;">
      Vielen Dank, dass Sie EnergieClever weiterempfehlen!
    </p>`,
    `Sie haben eine ${rewardEur}-€-Prämie verdient!`,
  );
  return { subject, html };
}

// ─── Template 10: Code-Anfrage (Kunde möchte seinen Link per E-Mail) ─────────

export function referralCodeRequestTemplate({
  firstName,
  referralCode,
  referralUrl,
}: {
  firstName: string;
  referralCode: string;
  referralUrl: string;
}): { subject: string; html: string } {
  const subject = "Ihr EnergieClever Empfehlungs-Link";
  const html = layout(
    `<h2 style="margin:0 0 8px;font-size:22px;color:${BRAND_DARK};">
      Ihr persönlicher Empfehlungs-Link
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">
      Hallo ${firstName},<br/><br/>
      hier ist Ihr persönlicher Empfehlungs-Link. Teilen Sie ihn mit Freunden und Familie —
      und verdienen Sie für jeden abgeschlossenen Wechsel <strong>30 € als Amazon-Gutschein</strong>.
    </p>
    <div style="background:${BRAND_LIGHT};border:2px solid ${BRAND_GREEN};border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:0.05em;">
        Ihr persönlicher Code
      </p>
      <p style="margin:0 0 12px;font-size:32px;font-weight:700;color:${BRAND_DARK};letter-spacing:0.15em;font-family:monospace;">
        ${referralCode}
      </p>
      <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">
        ${referralUrl}
      </p>
    </div>
    <p style="font-size:14px;color:#475569;margin:0 0 16px;">
      Kopieren Sie einfach den Link oben und teilen Sie ihn mit Freunden per WhatsApp, E-Mail oder Social Media.
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;font-size:13px;color:#64748b;">
      Ihr Freund muss das Formular über Ihren Link ausfüllen und seinen Wechsel abschließen.
      Danach erhalten Sie nach 30 Tagen Wartezeit automatisch Ihren Gutschein.
    </div>`,
    "Ihr persönlicher EnergieClever Empfehlungs-Link.",
  );
  return { subject, html };
}
