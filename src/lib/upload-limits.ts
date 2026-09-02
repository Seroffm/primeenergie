export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_UPLOAD_MB = 10;
export const MAX_UPLOAD_FILES = 2;

export const PUBLIC_INVOICE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const STAFF_DOCUMENT_TYPES = [
  ...PUBLIC_INVOICE_TYPES,
  "image/webp",
  "image/gif",
] as const;

export function isAllowedUploadType(
  type: string,
  allowedTypes: readonly string[],
): boolean {
  return allowedTypes.includes(type);
}
