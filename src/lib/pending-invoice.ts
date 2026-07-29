let pendingInvoice: File | null = null;

export function setPendingInvoice(file: File | null): void {
  pendingInvoice = file;
}

export function getPendingInvoice(): File | null {
  return pendingInvoice;
}

export function clearPendingInvoice(): void {
  pendingInvoice = null;
}

export function validateInvoice(file: File): string | null {
  const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
  const allowedExtension = /\.(pdf|jpe?g|png)$/i.test(file.name);

  if (!allowedTypes.has(file.type) && !allowedExtension) {
    return "Bitte laden Sie eine PDF-, JPG- oder PNG-Datei hoch.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Die Datei darf maximal 10 MB groß sein.";
  }
  return null;
}
