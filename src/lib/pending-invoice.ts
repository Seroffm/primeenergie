import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB, PUBLIC_INVOICE_TYPES } from "@/lib/upload-limits";

let pendingInvoices: File[] = [];

export function setPendingInvoice(files: File[]): void {
  pendingInvoices = files;
}

export function getPendingInvoice(): File[] {
  return pendingInvoices;
}

export function clearPendingInvoice(): void {
  pendingInvoices = [];
}

export function validateInvoice(file: File): string | null {
  const allowedTypes = new Set<string>(PUBLIC_INVOICE_TYPES);
  const allowedExtension = /\.(pdf|jpe?g|png)$/i.test(file.name);

  if (!allowedTypes.has(file.type) && !allowedExtension) {
    return "Bitte laden Sie eine PDF-, JPG- oder PNG-Datei hoch.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Die Datei darf maximal ${MAX_UPLOAD_MB} MB groß sein.`;
  }
  return null;
}
