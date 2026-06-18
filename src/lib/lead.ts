import { createServerFn } from "@tanstack/react-start";
import { leadSchema, type LeadInput } from "./lead-schema";
import { generateLeadNumber } from "./lead-number";

function formatLead(lead: LeadInput, leadId: string): string {
  const lines = [
    `=== NEUER LEAD ${leadId} ===`,
    `Energie: ${lead.energyType} | Kunde: ${lead.customerType}`,
    `Adresse: ${lead.plz} ${lead.ort}${lead.strasse ? ", " + lead.strasse : ""}`,
    "",
    "VERBRAUCH:",
    lead.stromVerbrauchKwh ? `  Strom: ${lead.stromVerbrauchKwh} kWh/Jahr` : "",
    lead.stromPersonen ? `  Strom (geschätzt): ${lead.stromPersonen} Personen` : "",
    lead.gasVerbrauchKwh ? `  Gas: ${lead.gasVerbrauchKwh} kWh/Jahr` : "",
    lead.gasWohnflaeche
      ? `  Gas (geschätzt): ${lead.gasWohnflaeche} m², Heizart ${lead.gasHeizart}, ${lead.gasPersonen} Pers., Warmwasser: ${lead.gasWarmwasser ? "ja" : "nein"}`
      : "",
    "",
    "AKTUELLE SITUATION:",
    `  Anbieter: ${lead.aktuellerAnbieter ?? "-"}`,
    `  Abschlag: ${lead.monatlicherAbschlag ?? "-"} €/Monat`,
    `  Vertragsende: ${lead.vertragsende ?? "-"}`,
    `  Preisgarantie: ${lead.preisgarantie ?? "-"}`,
    "",
    `ZIELE: ${lead.ziele.join(", ") || "-"}`,
    "",
    "KONTAKT:",
    `  ${lead.vorname} ${lead.nachname}`,
    `  ${lead.email} | ${lead.telefon}`,
    `  Beste Erreichbarkeit: ${lead.erreichbarkeit}`,
    lead.rechnungDateiname
      ? `  Rechnung angekündigt: ${lead.rechnungDateiname} (${lead.rechnungGroesseKb} KB)`
      : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const leadId = generateLeadNumber();

    // Phase 1: Lead in Server-Log ausgeben. TODO Phase 2:
    // Hier E-Mail an LEAD_RECIPIENT_EMAIL versenden (Lovable Emails oder Resend),
    // und Lead in `leads`-Tabelle (Lovable Cloud) speichern.
    console.log(formatLead(data, leadId));

    return { ok: true as const, leadId };
  });
